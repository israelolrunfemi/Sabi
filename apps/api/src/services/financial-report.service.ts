import { EconomicProfile, Transaction, User } from '../models/index';
import { AppError } from '../utils/app.error';
import { generateFinancialReportPDF } from '../utils/pdf.util';
import { trustScoreService } from './trust-score.service';

export const financialReportService = {
  async generateForUser(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'fullName', 'email', 'phone', 'userType', 'trustScore', 'createdAt'],
      include: [{ model: EconomicProfile, as: 'economicProfile' }],
    });

    if (!user) throw new AppError('User not found.', 404);

    const [transactions, trustScore] = await Promise.all([
      Transaction.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 50,
      }),
      trustScoreService.getBreakdown(userId),
    ]);

    const successfulTransactions = transactions.filter((transaction) => transaction.status === 'SUCCESS');
    const totalVolume = successfulTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0
    );
    const profile = (user as User & { economicProfile?: EconomicProfile | null }).economicProfile ?? null;

    const transactionSummary = {
      totalTransactions: transactions.length,
      totalVolume,
      completionRate: trustScore.inputs.completionRate,
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
