import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../config/database.config';
import { AppError } from '../utils/app.error';
import { EscrowPayment, SquadAccount, Transaction, User } from '../models/index';
import type { EscrowPaymentStatus } from '../models/escrow-payment.model';
import type { CreateEscrowInput } from '../validators/payment.validator';
import { trustScoreService } from './trust-score.service';

const ACTIVE_ESCROW_STATUSES: EscrowPaymentStatus[] = ['FUNDED', 'IN_PROGRESS', 'DISPUTED'];

const buildReference = (prefix: string) =>
  `${prefix}_${uuidv4().replace(/-/g, '').slice(0, 16)}`;

const toMoney = (value: unknown): number => Number(Number(value).toFixed(2));

const ensurePositiveAmount = (amount: number) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError('Amount must be greater than zero.', 400);
  }
};

export const paymentService = {
  async getWallet(userId: string) {
    const account = await SquadAccount.findOne({ where: { userId } });

    if (!account) {
      throw new AppError('No wallet found. Please complete onboarding.', 404);
    }

    const [escrowHeld, pendingEarnings] = await Promise.all([
      EscrowPayment.sum('amount', {
        where: {
          buyerId: userId,
          status: { [Op.in]: ACTIVE_ESCROW_STATUSES },
        },
      }),
      EscrowPayment.sum('amount', {
        where: {
          traderId: userId,
          status: { [Op.in]: ['FUNDED', 'IN_PROGRESS'] },
        },
      }),
    ]);

    return {
      account,
      balances: {
        available: toMoney(account.balance),
        escrowHeld: toMoney(escrowHeld ?? 0),
        pendingEarnings: toMoney(pendingEarnings ?? 0),
      },
    };
  },

  async createEscrow(buyerId: string, input: CreateEscrowInput) {
    ensurePositiveAmount(input.amount);

    return sequelize.transaction(async (dbTransaction) => {
      const [buyer, trader] = await Promise.all([
        User.findByPk(buyerId, { transaction: dbTransaction }),
        User.findByPk(input.traderId, { transaction: dbTransaction }),
      ]);

      if (!buyer) throw new AppError('Buyer not found.', 404);
      if (!trader) throw new AppError('Trader not found.', 404);
      if (buyer.id === trader.id) {
        throw new AppError('Buyer and trader must be different users.', 400);
      }
      if (buyer.userType !== 'BUYER') {
        throw new AppError('Only buyers can fund escrow payments.', 403);
      }
      if (trader.userType !== 'TRADER') {
        throw new AppError('Escrow can only be funded for a trader account.', 400);
      }

      const buyerAccount = await SquadAccount.findOne({
        where: { userId: buyer.id },
        transaction: dbTransaction,
        lock: dbTransaction.LOCK.UPDATE,
      });

      if (!buyerAccount) {
        throw new AppError('Buyer wallet not found. Fund the buyer account first.', 404);
      }

      const availableBalance = toMoney(buyerAccount.balance);
      const amount = toMoney(input.amount);

      if (availableBalance < amount) {
        throw new AppError('Insufficient wallet balance for this escrow payment.', 400);
      }

      const escrow = await EscrowPayment.create(
        {
          reference: buildReference('ESCROW'),
          buyerId: buyer.id,
          traderId: trader.id,
          amount,
          status: 'FUNDED',
          description: input.description ?? null,
          metadata: input.metadata ?? null,
        },
        { transaction: dbTransaction }
      );

      await buyerAccount.update(
        { balance: toMoney(availableBalance - amount) },
        { transaction: dbTransaction }
      );

      await Transaction.create(
        {
          userId: buyer.id,
          squadReference: buildReference('ESCROW_HOLD'),
          amount,
          type: 'DEBIT',
          status: 'SUCCESS',
          counterpartyId: trader.id,
          description: `Escrow funded for ${trader.fullName}`,
          metadata: {
            escrowPaymentId: escrow.id,
            escrowReference: escrow.reference,
            action: 'ESCROW_HOLD',
          },
        },
        { transaction: dbTransaction }
      );

      return escrow;
    });
  },

  async startEscrow(userId: string, escrowId: string) {
    return sequelize.transaction(async (dbTransaction) => {
      const escrow = await EscrowPayment.findByPk(escrowId, {
        transaction: dbTransaction,
        lock: dbTransaction.LOCK.UPDATE,
      });

      if (!escrow) throw new AppError('Escrow payment not found.', 404);
      if (escrow.traderId !== userId) {
        throw new AppError('Only the assigned trader can start this escrow payment.', 403);
      }
      if (escrow.status !== 'FUNDED') {
        throw new AppError(`Escrow payment cannot be started from ${escrow.status}.`, 400);
      }

      await escrow.update({ status: 'IN_PROGRESS' }, { transaction: dbTransaction });
      return escrow;
    });
  },

  async releaseEscrow(buyerId: string, escrowId: string) {
    const releaseResult = await sequelize.transaction(async (dbTransaction) => {
      const escrow = await EscrowPayment.findByPk(escrowId, {
        transaction: dbTransaction,
        lock: dbTransaction.LOCK.UPDATE,
      });

      if (!escrow) throw new AppError('Escrow payment not found.', 404);
      if (escrow.buyerId !== buyerId) {
        throw new AppError('Only the buyer can release this escrow payment.', 403);
      }
      if (!['FUNDED', 'IN_PROGRESS'].includes(escrow.status)) {
        throw new AppError(`Escrow payment cannot be released from ${escrow.status}.`, 400);
      }

      const trader = await User.findByPk(escrow.traderId, { transaction: dbTransaction });
      if (!trader) throw new AppError('Trader not found.', 404);

      const traderAccount = await SquadAccount.findOne({
        where: { userId: escrow.traderId },
        transaction: dbTransaction,
        lock: dbTransaction.LOCK.UPDATE,
      });

      if (!traderAccount) {
        throw new AppError('Trader wallet not found. Trader needs a virtual account first.', 404);
      }

      const amount = toMoney(escrow.amount);
      const previousBalance = toMoney(traderAccount.balance);
      const newBalance = toMoney(previousBalance + amount);

      await traderAccount.update(
        { balance: newBalance },
        { transaction: dbTransaction }
      );

      await escrow.update(
        { status: 'COMPLETED', releasedAt: new Date() },
        { transaction: dbTransaction }
      );

      await Transaction.create(
        {
          userId: escrow.traderId,
          squadReference: buildReference('ESCROW_RELEASE'),
          amount,
          type: 'CREDIT',
          status: 'SUCCESS',
          counterpartyId: escrow.buyerId,
          description: `Escrow released from buyer to ${trader.fullName}`,
          metadata: {
            escrowPaymentId: escrow.id,
            escrowReference: escrow.reference,
            action: 'ESCROW_RELEASE',
          },
        },
        { transaction: dbTransaction }
      );

      return {
        escrow,
        traderWallet: {
          userId: traderAccount.userId,
          accountNumber: traderAccount.accountNumber,
          previousBalance,
          creditedAmount: amount,
          availableBalance: newBalance,
        },
      };
    });

    const [buyerTrustScore, traderTrustScore] = await Promise.all([
      trustScoreService.recalculateAndSave(releaseResult.escrow.buyerId),
      trustScoreService.recalculateAndSave(releaseResult.escrow.traderId),
    ]);

    return {
      ...releaseResult,
      trustScores: {
        buyer: buyerTrustScore,
        trader: traderTrustScore,
      },
    };
  },

  async refundEscrow(buyerId: string, escrowId: string) {
    const refundedEscrow = await sequelize.transaction(async (dbTransaction) => {
      const escrow = await EscrowPayment.findByPk(escrowId, {
        transaction: dbTransaction,
        lock: dbTransaction.LOCK.UPDATE,
      });

      if (!escrow) throw new AppError('Escrow payment not found.', 404);
      if (escrow.buyerId !== buyerId) {
        throw new AppError('Only the buyer can refund this escrow payment.', 403);
      }
      if (!['FUNDED', 'DISPUTED'].includes(escrow.status)) {
        throw new AppError(`Escrow payment cannot be refunded from ${escrow.status}.`, 400);
      }

      const buyerAccount = await SquadAccount.findOne({
        where: { userId: escrow.buyerId },
        transaction: dbTransaction,
        lock: dbTransaction.LOCK.UPDATE,
      });

      if (!buyerAccount) throw new AppError('Buyer wallet not found.', 404);

      const amount = toMoney(escrow.amount);

      await buyerAccount.update(
        { balance: toMoney(Number(buyerAccount.balance) + amount) },
        { transaction: dbTransaction }
      );

      await escrow.update(
        { status: 'REFUNDED', refundedAt: new Date() },
        { transaction: dbTransaction }
      );

      await Transaction.create(
        {
          userId: escrow.buyerId,
          squadReference: buildReference('ESCROW_REFUND'),
          amount,
          type: 'CREDIT',
          status: 'SUCCESS',
          counterpartyId: escrow.traderId,
          description: 'Escrow payment refunded to buyer wallet',
          metadata: {
            escrowPaymentId: escrow.id,
            escrowReference: escrow.reference,
            action: 'ESCROW_REFUND',
          },
        },
        { transaction: dbTransaction }
      );

      return escrow;
    });

    const [buyerTrustScore, traderTrustScore] = await Promise.all([
      trustScoreService.recalculateAndSave(refundedEscrow.buyerId),
      trustScoreService.recalculateAndSave(refundedEscrow.traderId),
    ]);

    return {
      escrow: refundedEscrow,
      trustScores: {
        buyer: buyerTrustScore,
        trader: traderTrustScore,
      },
    };
  },

  async listEscrows(userId: string, role?: 'buyer' | 'trader') {
    const where =
      role === 'buyer'
        ? { buyerId: userId }
        : role === 'trader'
          ? { traderId: userId }
          : { [Op.or]: [{ buyerId: userId }, { traderId: userId }] };

    return EscrowPayment.findAll({
      where,
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'fullName', 'email', 'userType'] },
        { model: User, as: 'trader', attributes: ['id', 'fullName', 'email', 'userType'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  },
};
