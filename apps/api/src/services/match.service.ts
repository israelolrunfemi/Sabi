import { Op } from 'sequelize';
import { z } from 'zod';
import { gemini } from '../config/gemini.config';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';
import { AppError } from '../utils/app.error';
import { MATCHING_SYSTEM_PROMPT } from '../utils/prompt';
import { EconomicProfile, Match, Opportunity } from '../models/index';
import type { GenerateMatchesInput, UpdateMatchStatusInput } from '../validators/match.validator';

const matchCandidateSchema = z.object({
  opportunityId: z.string().uuid(),
  score: z.coerce.number().int().min(0).max(100),
  reasoning: z.string().default(''),
  keyStrengths: z.array(z.string()).default([]),
  potentialGaps: z.array(z.string()).default([]),
});

type MatchCandidate = z.infer<typeof matchCandidateSchema>;

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

const parseGeminiMatches = (reply: string): MatchCandidate[] => {
  const candidate = findFirstJsonArray(stripCodeFence(reply));
  if (!candidate) throw new Error('Gemini response did not contain a JSON array.');

  const parsed = JSON.parse(candidate.replace(/,\s*([}\]])/g, '$1'));
  const result = z.array(matchCandidateSchema).safeParse(parsed);

  if (!result.success) {
    throw new Error('Gemini matching response failed validation.');
  }

  return result.data;
};

const buildMatchingPrompt = (profile: EconomicProfile, opportunities: Opportunity[]) => {
  const seekerProfile = {
    tradeCategory: profile.tradeCategory,
    skills: profile.skills,
    location: profile.location,
    language: profile.language,
    yearsExperience: profile.yearsExperience,
    description: profile.description,
  };

  const availableOpportunities = opportunities.map((opportunity) => ({
    id: opportunity.id,
    title: opportunity.title,
    description: opportunity.description,
    type: opportunity.type,
    category: opportunity.category,
    location: opportunity.location,
    budget: opportunity.budget,
    expiresAt: opportunity.expiresAt,
  }));

  return JSON.stringify(
    {
      seekerProfile,
      opportunities: availableOpportunities,
    },
    null,
    2
  );
};

export const matchService = {
  async generateForUser(userId: string, input: GenerateMatchesInput) {
    const profile = await EconomicProfile.findOne({ where: { userId } });
    if (!profile) {
      throw new AppError('Complete your economic profile before generating matches.', 400);
    }

    const opportunities = await Opportunity.findAll({
      where: {
        status: 'OPEN',
        posterId: { [Op.ne]: userId },
        [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
      },
      order: [['createdAt', 'DESC']],
      limit: input.limit,
    });

    if (opportunities.length === 0) return [];

    try {
      const response = await gemini.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: buildMatchingPrompt(profile, opportunities),
        config: {
          systemInstruction: MATCHING_SYSTEM_PROMPT,
          temperature: 0.2,
          maxOutputTokens: 4000,
          responseMimeType: 'application/json',
        },
      });

      const scored = parseGeminiMatches(response.text ?? '');
      const allowedOpportunityIds = new Set(opportunities.map((opportunity) => opportunity.id));
      const eligibleMatches = scored
        .filter((candidate) => allowedOpportunityIds.has(candidate.opportunityId))
        .filter((candidate) => candidate.score >= input.minScore)
        .sort((left, right) => right.score - left.score);

      const savedMatches = [];

      for (const candidate of eligibleMatches) {
        const [match, created] = await Match.findOrCreate({
          where: {
            seekerId: userId,
            opportunityId: candidate.opportunityId,
          },
          defaults: {
            seekerId: userId,
            opportunityId: candidate.opportunityId,
            score: candidate.score,
            reasoning: candidate.reasoning,
            keyStrengths: candidate.keyStrengths,
            potentialGaps: candidate.potentialGaps,
          },
        });

        if (!created) {
          await match.update({
            score: candidate.score,
            reasoning: candidate.reasoning,
            keyStrengths: candidate.keyStrengths,
            potentialGaps: candidate.potentialGaps,
          });
        }

        savedMatches.push(match);
      }

      return savedMatches;
    } catch (error) {
      logger.error('Gemini matching failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      throw new AppError('AI matching failed. Please try again.', 500);
    }
  },

  async listForUser(userId: string) {
    return Match.findAll({
      where: { seekerId: userId },
      include: [{ model: Opportunity, as: 'opportunity' }],
      order: [
        ['score', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  },

  async updateStatus(userId: string, matchId: string, input: UpdateMatchStatusInput) {
    const match = await Match.findOne({
      where: { id: matchId, seekerId: userId },
    });

    if (!match) throw new AppError('Match not found.', 404);

    await match.update({ status: input.status });
    return match;
  },
};
