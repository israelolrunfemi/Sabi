import bcrypt from 'bcryptjs';
import { User } from '../models/index';
import { AppError } from '../utils/app.error';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';

export const authService = {
  async register(input: RegisterInput) {
    // 1. Check if email or phone already exists
    const existingUser = await User.findOne({
      where: { email: input.email },
    });
    if (existingUser) {
      throw new AppError('An account with this email already exists.', 409);
    }

    const existingPhone = await User.findOne({
      where: { phone: input.phone },
    });
    if (existingPhone) {
      throw new AppError('An account with this phone number already exists.', 409);
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(input.password, 12);

    // 3. Create user
    const user = await User.create({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      password: hashedPassword,
      userType: input.userType,
    });

    // 4. Generate tokens
    const payload = {
      userId: user.id,
      email: user.email,
      userType: user.userType,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // 5. Return user (without password) + tokens
    const { password: _password, ...userWithoutPassword } = user.toJSON();

    return { user: userWithoutPassword, accessToken, refreshToken };
  },

  async login(input: LoginInput) {
    // 1. Find user by email — include password for comparison
    const user = await User.findOne({ where: { email: input.email } });
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    // 2. Check if account is suspended
    if (user.status === 'SUSPENDED') {
      throw new AppError('Your account has been suspended. Contact support.', 403);
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    // 4. Generate tokens
    const payload = {
      userId: user.id,
      email: user.email,
      userType: user.userType,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const { password: _password, ...userWithoutPassword } = user.toJSON();

    return { user: userWithoutPassword, accessToken, refreshToken };
  },

  async refresh(token: string) {
    // 1. Verify refresh token
    const decoded = verifyRefreshToken(token);

    // 2. Check user still exists
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new AppError('User no longer exists.', 401);
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError('Your account has been suspended.', 403);
    }

    // 3. Issue new access token
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    });

    return { accessToken };
  },
};