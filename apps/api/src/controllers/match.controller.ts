import { Request, Response, NextFunction } from 'express';
import { matchService } from '../services/match.service';

export const matchController = {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const matches = await matchService.generateForUser(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Matches generated',
        data: matches,
      });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const matches = await matchService.listForUser(req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Matches retrieved',
        data: matches,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await matchService.updateStatus(req.user!.userId, req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Match status updated',
        data: match,
      });
    } catch (err) {
      next(err);
    }
  },
};
