import { Op, WhereOptions } from 'sequelize';
import { z } from 'zod';
import { gemini } from '../config/gemini.config';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';
import { EconomicProfile, GigApplication, Opportunity, User } from '../models/index';
import { AppError } from '../utils/app.error';
import { squadService } from './squad.service';

interface BrowseGigFilters {
  category?: string;
  location?: string;
  minBudget?: number;
  maxBudget?: number;
  page?: number;
  limit?: number;
}

const gigRecommendationSchema = z.object({
  gigId: z.string().uuid(),
  score: z.coerce.number().int().min(0).max(100),
  reason: z.string().default(''),
});

const applicantRankSchema = z.object({
  applicationId: z.string().uuid(),
  score: z.coerce.number().int().min(0).max(100),
  recommendation: z.string().default(''),
});

const stripCodeFence = (value: string): string => {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
};

const findFirstJsonArray = (value: string): string | null => {
  const start = value.indexOf('[');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < value.length; index += 1) {
    const char = value[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = inString;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '[') depth += 1;
    if (char === ']') depth -= 1;

    if (depth === 0) return value.slice(start, index + 1);
  }

  return null;
};

const parseJsonArray = <T>(reply: string, schema: z.ZodType<T>): T[] => {
  const candidate = findFirstJsonArray(stripCodeFence(reply));
  if (!candidate) throw new Error('Gemini response did not contain a JSON array.');

  const parsed = JSON.parse(candidate.replace(/,\s*([}\]])/g, '$1'));
  const result = z.array(schema).safeParse(parsed);
  if (!result.success) throw new Error('Gemini response failed validation.');

  return result.data;
};

const clampPageLimit = (limit: number): number => Math.max(1, Math.min(limit, 50));

export const gigService = {
  async browseGigs(seekerId: string, filters: BrowseGigFilters) {
    const { category, location, minBudget, maxBudget, page = 1 } = filters;
    const limit = clampPageLimit(filters.limit ?? 10);
    const offset = (Math.max(1, page) - 1) * limit;

    const where: WhereOptions = {
      status: 'OPEN',
      posterId: { [Op.ne]: seekerId },
    };

    if (category) {
      where.category = { [Op.iLike]: `%${category}%` };
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (minBudget !== undefined || maxBudget !== undefined) {
      where.budget = {
        ...(minBudget !== undefined ? { [Op.gte]: minBudget } : {}),
        ...(maxBudget !== undefined ? { [Op.lte]: maxBudget } : {}),
      };
    }

    const { rows: gigs, count: total } = await Opportunity.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'fullName', 'trustScore', 'profileImage'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const gigIds = gigs.map((gig) => gig.id);
    const existingApplications =
      gigIds.length === 0
        ? []
        : await GigApplication.findAll({
            where: { seekerId, opportunityId: { [Op.in]: gigIds } },
          });
    const appliedIds = new Set(existingApplications.map((application) => application.opportunityId));

    return {
      gigs: gigs.map((gig) => ({
        ...gig.toJSON(),
        hasApplied: appliedIds.has(gig.id),
      })),
      total,
      page: Math.max(1, page),
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getRecommendedGigs(seekerId: string) {
    const profile = await EconomicProfile.findOne({ where: { userId: seekerId } });
    if (!profile) {
      throw new AppError('Please complete your profile first to get recommendations.', 400);
    }

    const gigs = await Opportunity.findAll({
      where: {
        status: 'OPEN',
        posterId: { [Op.ne]: seekerId },
      },
      limit: 20,
      order: [['createdAt', 'DESC']],
    });

    if (gigs.length === 0) return [];

    const response = await gemini.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: JSON.stringify(
        {
          seekerProfile: {
            tradeCategory: profile.tradeCategory,
            skills: profile.skills,
            location: profile.location,
            yearsExperience: profile.yearsExperience,
          },
          gigs: gigs.map((gig) => ({
            gigId: gig.id,
            title: gig.title,
            category: gig.category,
            location: gig.location,
            description: gig.description,
            budget: gig.budget,
          })),
        },
        null,
        2
      ),
      config: {
        systemInstruction:
          'You are a gig recommendation engine. Given a seeker profile and a list of gigs, rank gigs by skill, category, location, and experience fit. Return ONLY a JSON array sorted by score descending. Format: [{ "gigId": "", "score": 0, "reason": "one sentence" }].',
        temperature: 0.2,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json',
      },
    });

    const ranked = parseJsonArray(response.text ?? '', gigRecommendationSchema);
    const gigMap = new Map(gigs.map((gig) => [gig.id, gig]));

    return ranked
      .filter((recommendation) => recommendation.score >= 40)
      .filter((recommendation) => gigMap.has(recommendation.gigId))
      .map((recommendation) => ({
        ...gigMap.get(recommendation.gigId)!.toJSON(),
        matchScore: recommendation.score,
        matchReason: recommendation.reason,
      }));
  },

  async apply(seekerId: string, opportunityId: string, coverNote?: string) {
    const gig = await Opportunity.findByPk(opportunityId);
    if (!gig) throw new AppError('Gig not found.', 404);
    if (gig.status !== 'OPEN') throw new AppError('This gig is no longer accepting applications.', 400);
    if (gig.posterId === seekerId) throw new AppError('You cannot apply to your own gig.', 400);

    const existing = await GigApplication.findOne({
      where: { seekerId, opportunityId },
    });
    if (existing) throw new AppError('You have already applied to this gig.', 409);

    const profile = await EconomicProfile.findOne({ where: { userId: seekerId } });
    if (!profile) throw new AppError('Please complete your profile before applying.', 400);

    const application = await GigApplication.create({
      seekerId,
      opportunityId,
      coverNote: coverNote ?? null,
    });

    logger.info('Gig application submitted', { seekerId, opportunityId });

    return application;
  },

  async getApplicationsForGig(opportunityId: string, posterId: string) {
    const gig = await Opportunity.findByPk(opportunityId);
    if (!gig) throw new AppError('Gig not found.', 404);
    if (gig.posterId !== posterId) throw new AppError('You do not own this gig.', 403);

    const applications = await GigApplication.findAll({
      where: { opportunityId },
      include: [
        {
          model: User,
          as: 'seeker',
          attributes: ['id', 'fullName', 'trustScore', 'profileImage'],
          include: [
            {
              model: EconomicProfile,
              as: 'economicProfile',
              attributes: ['tradeCategory', 'skills', 'yearsExperience', 'location'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (applications.length === 0) return [];

    const response = await gemini.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: JSON.stringify(
        {
          gig: {
            title: gig.title,
            category: gig.category,
            description: gig.description,
            location: gig.location,
            budget: gig.budget,
          },
          applicants: applications.map((application) => {
            const seeker = (application as GigApplication & {
              seeker?: User & { economicProfile?: EconomicProfile | null };
            }).seeker;

            return {
              applicationId: application.id,
              trustScore: seeker?.trustScore,
              skills: seeker?.economicProfile?.skills ?? [],
              yearsExperience: seeker?.economicProfile?.yearsExperience ?? 0,
              location: seeker?.economicProfile?.location,
              coverNote: application.coverNote,
            };
          }),
        },
        null,
        2
      ),
      config: {
        systemInstruction:
          'Rank these applicants for the gig based on skill match, trust score, location fit, and experience. Return ONLY a JSON array sorted by score descending. Format: [{ "applicationId": "", "score": 0, "recommendation": "one sentence" }].',
        temperature: 0.2,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json',
      },
    });

    const ranked = parseJsonArray(response.text ?? '', applicantRankSchema);
    const rankMap = new Map(ranked.map((rank) => [rank.applicationId, rank]));

    return applications
      .map((application) => ({
        ...application.toJSON(),
        aiScore: rankMap.get(application.id)?.score ?? 0,
        aiRecommendation: rankMap.get(application.id)?.recommendation ?? '',
      }))
      .sort((left, right) => right.aiScore - left.aiScore);
  },

  async hireApplicant(applicationId: string, posterId: string, posterEmail: string) {
    const application = await GigApplication.findByPk(applicationId, {
      include: [{ model: Opportunity, as: 'opportunity' }],
    });
    if (!application) throw new AppError('Application not found.', 404);

    const gig = (application as GigApplication & { opportunity?: Opportunity }).opportunity;
    if (!gig) throw new AppError('Gig not found.', 404);
    if (gig.posterId !== posterId) throw new AppError('You do not own this gig.', 403);
    if (application.status !== 'APPLIED' && application.status !== 'SHORTLISTED') {
      throw new AppError('This application cannot be hired at this stage.', 400);
    }
    if (!gig.budget) throw new AppError('Gig must have a budget to hire.', 400);

    const payment = await squadService.initiatePayment(posterId, {
      amount: Math.round(Number(gig.budget) * 100),
      customerName: 'Gig Payment',
      customerEmail: posterEmail,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/gigs/payment/callback`,
    });

    await application.update({
      status: 'HIRED',
      squadEscrowRef: payment.transactionRef,
    });

    await GigApplication.update(
      { status: 'REJECTED' },
      {
        where: {
          opportunityId: gig.id,
          id: { [Op.ne]: applicationId },
          status: { [Op.in]: ['APPLIED', 'SHORTLISTED'] },
        },
      }
    );

    await gig.update({ status: 'FILLED' });

    logger.info('Applicant hired, Squad payment initiated', {
      applicationId,
      transactionRef: payment.transactionRef,
    });

    return {
      application,
      checkoutUrl: payment.checkoutUrl,
      transactionRef: payment.transactionRef,
    };
  },

  async markComplete(applicationId: string, seekerId: string) {
    const application = await GigApplication.findByPk(applicationId);
    if (!application) throw new AppError('Application not found.', 404);
    if (application.seekerId !== seekerId) throw new AppError('Not authorised.', 403);
    if (application.status !== 'HIRED') {
      throw new AppError('This gig is not in a completable state.', 400);
    }

    await application.update({
      status: 'COMPLETED',
      completedAt: new Date(),
    });

    logger.info('Gig marked complete by seeker', { applicationId, seekerId });

    return application;
  },

  async getMyApplications(seekerId: string, page = 1, requestedLimit = 10) {
    const limit = clampPageLimit(requestedLimit);
    const safePage = Math.max(1, page);
    const offset = (safePage - 1) * limit;

    const { rows: applications, count: total } = await GigApplication.findAndCountAll({
      where: { seekerId },
      include: [
        {
          model: Opportunity,
          as: 'opportunity',
          include: [
            {
              model: User,
              as: 'poster',
              attributes: ['id', 'fullName', 'profileImage'],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      applications,
      total,
      page: safePage,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};
