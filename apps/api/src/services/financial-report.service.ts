import { EconomicProfile, Rating, Transaction, User, Vouch } from '../models/index';
import { AppError } from '../utils/app.error';
import { generateFinancialReportPDF } from '../utils/pdf.util';

const clamp = (value: number, min = 0, max = 100): number => Math.max(min, Math.min(max, value));

const percent = (part: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
};

export const financialReportService = {
  async generateForUser(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'fullName', 'email', 'phone', 'userType', 'trustScore', 'createdAt'],
      include: [{ model: EconomicProfile, as: 'economicProfile' }],
    });

    if (!user) throw new AppError('User not found.', 404);

    const [transactions, ratingRows, vouchCount] = await Promise.all([
      Transaction.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 50,
      }),
      Rating.findAll({ where: { rateeId: userId } }),
      Vouch.count({ where: { voucheeId: userId } }),
    ]);

    const successfulTransactions = transactions.filter((transaction) => transaction.status === 'SUCCESS');
    const totalVolume = successfulTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0
    );
    const averageRating =
      ratingRows.length === 0
        ? 0
        : ratingRows.reduce((sum, rating) => sum + rating.score, 0) / ratingRows.length;
    const memberDays = Math.max(
      1,
      Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    );
    const profile = (user as User & { economicProfile?: EconomicProfile | null }).economicProfile ?? null;
    const profileFields = [
      profile?.tradeCategory,
      profile?.skills?.length ? profile.skills.join(',') : null,
      profile?.location,
      profile?.yearsExperience ? String(profile.yearsExperience) : null,
      profile?.description,
    ];
    const completedProfileFields = profileFields.filter(Boolean).length;

    const trustScore = {
      total: user.trustScore,
      transactionScore: clamp(successfulTransactions.length * 8 + totalVolume / 50000),
      ratingScore: clamp(averageRating * 20),
      tenureScore: clamp(memberDays / 3.65),
      vouchingScore: clamp(vouchCount * 20),
      profileScore: percent(completedProfileFields, profileFields.length),
    };

    const transactionSummary = {
      totalTransactions: transactions.length,
      totalVolume,
      completionRate: percent(successfulTransactions.length, transactions.length),
      recentTransactions: transactions.slice(0, 8).map((transaction) => ({
        date: new Date(transaction.createdAt).toLocaleDateString('en-NG'),
        amount: Number(transaction.amount),
        type: transaction.type,
        status: transaction.status,
        description: transaction.description ?? transaction.squadReference,
      })),
    };

    const buffer = await generateFinancialReportPDF({
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        createdAt: user.createdAt,
        economicProfile: profile
          ? {
              tradeCategory: profile.tradeCategory,
              skills: profile.skills,
              location: profile.location,
              yearsExperience: profile.yearsExperience,
              description: profile.description,
            }
          : null,
      },
      trustScore,
      transactions: transactionSummary,
    });

    return {
      filename: `sabi-financial-report-${user.id}.pdf`,
      buffer,
    };
  },
};
