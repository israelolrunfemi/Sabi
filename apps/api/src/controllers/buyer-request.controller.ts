import { Request, Response, NextFunction } from 'express';
import { buyerRequestService } from '../services/buyer-request.service';

export const buyerRequestController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await buyerRequestService.matchTradersToNeed(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Buyer request analysed and matched',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await buyerRequestService.listForBuyer(req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Buyer requests retrieved',
        data: requests,
      });
    } catch (err) {
      next(err);
    }
  },
};
