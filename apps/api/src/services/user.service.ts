import { User, EconomicProfile } from '../models/index';
import { AppError } from '../utils/app.error';
import type { UpdateProfileInput, UpdateEconomicProfileInput } from '../validators/user.validator';

export const userService = {
  async getById(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: EconomicProfile, as: 'economicProfile' },
      ],
    });

    if (!user) throw new AppError('User not found.', 404);
    return user;
  },

  async getPublicProfile(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'fullName', 'userType', 'trustScore', 'status', 'profileImage', 'createdAt'],
      include: [
        {
          model: EconomicProfile,
          as: 'economicProfile',
          attributes: ['tradeCategory', 'skills', 'description', 'yearsExperience', 'location', 'language'],
        },
      ],
    });

    if (!user) throw new AppError('User not found.', 404);
    if (user.status === 'SUSPENDED') throw new AppError('This account is suspended.', 403);

    return user;
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('User not found.', 404);

    // Check phone uniqueness if being updated
    if (input.phone && input.phone !== user.phone) {
      const phoneExists = await User.findOne({ where: { phone: input.phone } });
      if (phoneExists) throw new AppError('Phone number already in use.', 409);
    }

    await user.update(input);

    const { password: _password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  },

  async updateEconomicProfile(userId: string, input: UpdateEconomicProfileInput) {
    // Upsert — create if doesn't exist, update if it does
    const [profile, created] = await EconomicProfile.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        tradeCategory: input.tradeCategory ?? 'General',
        skills: input.skills ?? [],
        language: input.language ?? 'English',
        ...input,
      },
    });

    if (!created) {
      await profile.update(input);
    }

    return profile;
  },

  async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows: users, count: total } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      include: [{ model: EconomicProfile, as: 'economicProfile' }],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return { users, total, page, limit };
  },
};