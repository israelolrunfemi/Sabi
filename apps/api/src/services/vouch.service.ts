import { Vouch, User } from '../models/index';
import { AppError } from '../utils/app.error';
import { trustScoreService } from './trust-score.service';
import type { CreateVouchInput } from '../validators/vouch.validator';

const publicUserAttributes = ['id', 'fullName', 'userType', 'trustScore', 'profileImage'];

export const vouchService = {
  async create(voucherId: string, input: CreateVouchInput) {
    if (voucherId === input.voucheeId) {
      throw new AppError('You cannot vouch for yourself.', 400);
    }

    const [voucher, vouchee] = await Promise.all([
      User.findByPk(voucherId),
      User.findByPk(input.voucheeId),
    ]);

    if (!voucher) throw new AppError('Voucher not found.', 404);
    if (!vouchee) throw new AppError('User to vouch for not found.', 404);
    if (voucher.status !== 'ACTIVE') {
      throw new AppError('Your account must be active before you can vouch for someone.', 403);
    }
    if (vouchee.status === 'SUSPENDED') {
      throw new AppError('You cannot vouch for a suspended account.', 403);
    }

    const existing = await Vouch.findOne({
      where: { voucherId, voucheeId: input.voucheeId },
    });
    if (existing) throw new AppError('You have already vouched for this user.', 409);

    const vouch = await Vouch.create({
      voucherId,
      voucheeId: input.voucheeId,
      message: input.message?.trim() || null,
    });
    const trustScore = await trustScoreService.recalculateAndSave(input.voucheeId);

    const saved = await Vouch.findByPk(vouch.id, {
      include: [
        { model: User, as: 'voucher', attributes: publicUserAttributes },
        { model: User, as: 'vouchee', attributes: publicUserAttributes },
      ],
    });

    return { vouch: saved ?? vouch, trustScore };
  },

  async remove(voucherId: string, vouchId: string) {
    const vouch = await Vouch.findByPk(vouchId);
    if (!vouch) throw new AppError('Vouch not found.', 404);
    if (vouch.voucherId !== voucherId) {
      throw new AppError('You can only remove vouches you created.', 403);
    }

    const voucheeId = vouch.voucheeId;
    await vouch.destroy();
    const trustScore = await trustScoreService.recalculateAndSave(voucheeId);

    return { deleted: true, trustScore };
  },

  async listReceived(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('User not found.', 404);

    return Vouch.findAll({
      where: { voucheeId: userId },
      include: [{ model: User, as: 'voucher', attributes: publicUserAttributes }],
      order: [['createdAt', 'DESC']],
    });
  },

  async listGiven(userId: string) {
    return Vouch.findAll({
      where: { voucherId: userId },
      include: [{ model: User, as: 'vouchee', attributes: publicUserAttributes }],
      order: [['createdAt', 'DESC']],
    });
  },
};
