import { Request, Response, NextFunction } from 'express';
import { vouchService } from '../services/vouch.service';

export const vouchController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await vouchService.create(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Vouch created',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await vouchService.remove(req.user!.userId, req.params.id);
      res.status(200).json({
        success: true,
        message: 'Vouch removed',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async listMineReceived(req: Request, res: Response, next: NextFunction) {
    try {
      const vouches = await vouchService.listReceived(req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Received vouches retrieved',
        data: vouches,
      });
    } catch (err) {
      next(err);
    }
  },

  async listMineGiven(req: Request, res: Response, next: NextFunction) {
    try {
      const vouches = await vouchService.listGiven(req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Given vouches retrieved',
        data: vouches,
      });
    } catch (err) {
      next(err);
    }
  },

  async listReceivedByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const vouches = await vouchService.listReceived(req.params.userId);
      res.status(200).json({
        success: true,
        message: 'Received vouches retrieved',
        data: vouches,
      });
    } catch (err) {
      next(err);
    }
  },
};
