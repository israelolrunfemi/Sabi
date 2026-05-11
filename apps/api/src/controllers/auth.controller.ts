import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AppError } from '../utils/app.error';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError('Refresh token is required.', 400);
      }
      const result = await authService.refresh(refreshToken);
      res.status(200).json({
        success: true,
        message: 'Token refreshed',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await (await import('../models/index')).User.findByPk(
        req.user!.userId,
        { attributes: { exclude: ['password'] } }
      );
      if (!user) throw new AppError('User not found.', 404);
      res.status(200).json({
        success: true,
        message: 'Current user retrieved',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
};