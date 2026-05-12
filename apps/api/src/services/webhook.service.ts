import { SquadAccount, Transaction, User } from '../models/index';
import { logger } from '../config/logger.config';
import { AppError } from '../utils/app.error';
import { trustScoreService } from './trust-score.service';

interface SquadWebhookPayload {
  transaction_reference: string;
  virtual_account_number: string;
  principal_amount: string;
  settled_amount: string;
  fee_charged: string;
  transaction_date: string;
  customer_identifier: string;
  transaction_indicator: string;
  remarks: string;
  currency: string;
  channel: string;
  sender_name: string;
}

export const webhookService = {
  async handlePaymentSuccess(payload: SquadWebhookPayload) {
    const {
      transaction_reference,
      principal_amount,
      customer_identifier,
      sender_name,
    } = payload;

    const existing = await Transaction.findOne({
      where: { squadReference: transaction_reference },
    });

    if (existing) {
      logger.warn('Duplicate webhook - transaction already processed', {
        reference: transaction_reference,
      });
      return { alreadyProcessed: true };
    }

    const userId = customer_identifier.replace(/^SABI_/, '');
    const user = await User.findByPk(userId);

    if (!user) {
      logger.error('Webhook: user not found for customer_identifier', {
        customer_identifier,
      });
      throw new AppError('User not found for this transaction.', 404);
    }

    const amount = Number.parseFloat(principal_amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new AppError('Invalid webhook transaction amount.', 400);
    }

    await Transaction.create({
      userId: user.id,
      squadReference: transaction_reference,
      amount,
      type: 'CREDIT',
      status: 'SUCCESS',
      counterpartyId: null,
      description: `Payment from ${sender_name || 'Unknown sender'}`,
      metadata: payload,
    });

    const account = await SquadAccount.findOne({
      where: { userId: user.id },
    });

    if (account) {
      const newBalance = Number(account.balance) + amount;
      await account.update({ balance: newBalance });
    }

    const trustScore = await trustScoreService.recalculateAndSave(user.id);

    logger.info('Transaction saved and trust score recalculated', {
      userId: user.id,
      amount,
      reference: transaction_reference,
      trustScore: trustScore.total,
    });

    return { success: true, userId: user.id, trustScore: trustScore.total };
  },
};
