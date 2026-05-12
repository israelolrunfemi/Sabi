import { gemini } from '../config/gemini.config';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';
import { EconomicProfile, Rating, Transaction, User, Vouch } from '../models/index';
import { AppError } from '../utils/app.error';

const MIN_STARTING_SCORE = 40;
const MAX_TRUST_SCORE = 100;
const MAX_TRANSACTION_SCORE = 35;
const MAX_RATING_SCORE = 25;
const MAX_TENURE_SCORE = 20;
const MAX_VOUCHING_SCORE = 15;
const MAX_PROFILE_SCORE = 5;

export interface TrustScoreBreakdown {
  total: number;
  rawTotal: number;
  transactionScore: number;
  ratingScore: number;
  tenureScore: number;
  vouchingScore: number;
  profileScore: number;
  maxScores: {
    transactionScore: number;
    ratingScore: number;
    tenureScore: number;
    vouchingScore: number;
    profileScore: number;
    total: number;
  };
  inputs: {
    totalTransactions: number;
    successfulTransactions: number;
    completionRate: number;
    averageRating: number;
    ratingCount: number;
    monthsOnPlatform: number;
    vouchCount: number;
    hasCompleteProfile: boolean;
    hasProfilePhoto: boolean;
  };
  explanation: string;
  aiAssessment: string | null;
}

const clamp = (value: number, min = 0, max = MAX_TRUST_SCORE): number => {
  return Math.max(min, Math.min(max, value));
};

const round = (value: number): number => Math.round(value);

const getMonthsOnPlatform = (createdAt: Date): number => {
  const milliseconds = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 30)));
};

const isProfileComplete = (profile: EconomicProfile | null, user: User): boolean => {
  return Boolean(
    profile?.tradeCategory &&
      profile.skills.length > 0 &&
      profile.location &&
      profile.description &&
      profile.yearsExperience >= 0 &&
      user.profileImage
  );
};

const buildExplanation = (breakdown: Omit<TrustScoreBreakdown, 'explanation' | 'aiAssessment'>): string => {
  const { inputs } = breakdown;

  return [
    `Transaction score is based on ${inputs.successfulTransactions}/${inputs.totalTransactions} successful transactions and ${inputs.completionRate}% completion rate.`,
    `Rating score uses ${inputs.ratingCount} received rating(s) with an average of ${inputs.averageRating}/5.`,
    `Tenure score uses ${inputs.monthsOnPlatform} month(s) on Sabi, capped at 4 months.`,
    `Vouching score uses ${inputs.vouchCount} vouch(es), capped at 3.`,
    `Profile score requires a complete economic profile and profile photo.`,
  ].join(' ');
};

const getAiAssessment = async (
  userId: string,
  breakdown: Omit<TrustScoreBreakdown, 'aiAssessment'>
): Promise<string | null> => {
  try {
    const response = await gemini.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: JSON.stringify(
        {
          instruction:
            'Audit this deterministic trust score. Do not recalculate or change the score. Explain whether the score is reasonable and mention the strongest signal and biggest improvement area in plain English.',
          userId,
          formula:
            'Transactions 35 pts, ratings 25 pts, tenure 20 pts, vouching 15 pts, profile/photo 5 pts. New users have a 40 point starting floor.',
          breakdown,
        },
        null,
        2
      ),
      config: {
        temperature: 0.1,
        maxOutputTokens: 300,
      },
    });

    return response.text?.trim() || null;
  } catch (error) {
    logger.warn('Gemini trust score assessment failed', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
};

export const trustScoreService = {
  async calculate(userId: string, includeAiAssessment = false): Promise<TrustScoreBreakdown> {
    const user = await User.findByPk(userId, {
      include: [{ model: EconomicProfile, as: 'economicProfile' }],
    });

    if (!user) throw new AppError('User not found.', 404);

    const [transactions, ratings, vouchCount] = await Promise.all([
      Transaction.findAll({ where: { userId } }),
      Rating.findAll({ where: { rateeId: userId } }),
      Vouch.count({ where: { voucheeId: userId } }),
    ]);

    const successfulTransactions = transactions.filter((transaction) => transaction.status === 'SUCCESS');
    const completionRate =
      transactions.length === 0 ? 0 : successfulTransactions.length / transactions.length;
    const averageRating =
      ratings.length === 0
        ? 0
        : ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length;
    const monthsOnPlatform = getMonthsOnPlatform(user.createdAt);
    const profile = (user as User & { economicProfile?: EconomicProfile | null }).economicProfile ?? null;
    const hasCompleteProfile = isProfileComplete(profile, user);

    const transactionFrequencyScore = Math.min(successfulTransactions.length / 10, 1);
    const transactionScore = round(
      MAX_TRANSACTION_SCORE * transactionFrequencyScore * completionRate
    );
    const ratingScore = round(MAX_RATING_SCORE * (averageRating / 5));
    const tenureScore = Math.min(monthsOnPlatform * 5, MAX_TENURE_SCORE);
    const vouchingScore = Math.min(vouchCount * 5, MAX_VOUCHING_SCORE);
    const profileScore = hasCompleteProfile ? MAX_PROFILE_SCORE : 0;
    const rawTotal =
      transactionScore + ratingScore + tenureScore + vouchingScore + profileScore;
    const total = clamp(Math.max(MIN_STARTING_SCORE, rawTotal));

    const breakdownWithoutAi = {
      total,
      rawTotal,
      transactionScore,
      ratingScore,
      tenureScore,
      vouchingScore,
      profileScore,
      maxScores: {
        transactionScore: MAX_TRANSACTION_SCORE,
        ratingScore: MAX_RATING_SCORE,
        tenureScore: MAX_TENURE_SCORE,
        vouchingScore: MAX_VOUCHING_SCORE,
        profileScore: MAX_PROFILE_SCORE,
        total: MAX_TRUST_SCORE,
      },
      inputs: {
        totalTransactions: transactions.length,
        successfulTransactions: successfulTransactions.length,
        completionRate: round(completionRate * 100),
        averageRating: Number(averageRating.toFixed(2)),
        ratingCount: ratings.length,
        monthsOnPlatform,
        vouchCount,
        hasCompleteProfile,
        hasProfilePhoto: Boolean(user.profileImage),
      },
    };

    const explanation = buildExplanation(breakdownWithoutAi);
    const breakdown: TrustScoreBreakdown = {
      ...breakdownWithoutAi,
      explanation,
      aiAssessment: null,
    };

    if (includeAiAssessment) {
      breakdown.aiAssessment = await getAiAssessment(userId, breakdown);
    }

    return breakdown;
  },

  async recalculateAndSave(userId: string): Promise<TrustScoreBreakdown> {
    const breakdown = await trustScoreService.calculate(userId, false);
    await User.update({ trustScore: breakdown.total }, { where: { id: userId } });
    return breakdown;
  },

  async getBreakdown(userId: string): Promise<TrustScoreBreakdown> {
    const breakdown = await trustScoreService.calculate(userId, true);
    const user = await User.findByPk(userId);

    if (user && user.trustScore !== breakdown.total) {
      await user.update({ trustScore: breakdown.total });
    }

    return breakdown;
  },
};
