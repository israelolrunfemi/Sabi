import { Request, Response, NextFunction } from 'express';
import { trustScoreService } from '../services/trust-score.service';

export const trustScoreController = {
  async getMine(req: Request, res: Response, next: NextFunction) {
    try {
      const breakdown = await trustScoreService.getBreakdown(req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Trust score retrieved',
        data: breakdown,
      });
    } catch (err) {
      next(err);
    }
  },

  async getByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const breakdown = await trustScoreService.getBreakdown(req.params.userId);
      res.status(200).json({
        success: true,
        message: 'Trust score retrieved',
        data: breakdown,
      });
    } catch (err) {
      next(err);
    }
  },

  async recalculateMine(req: Request, res: Response, next: NextFunction) {
    try {
      const breakdown = await trustScoreService.recalculateAndSave(req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Trust score recalculated',
        data: breakdown,
      });
    } catch (err) {
      next(err);
    }
  },
};
