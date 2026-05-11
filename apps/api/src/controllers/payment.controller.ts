import { Request, Response, NextFunction } from 'express';
import { squadService } from '../services/squad.service';

export const paymentController = {

  // POST /api/v1/payments/initiate
  async initiatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await squadService.initiatePayment(
        req.user!.userId,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Payment initiated successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/payments/verify/:transactionRef
  async verifyTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionRef } = req.params;
      const result = await squadService.verifyTransaction(transactionRef);
      res.status(200).json({
        success: true,
        message: 'Transaction verified',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/payments/transactions
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 20;
      const result = await squadService.getTransactions(page, perPage);
      res.status(200).json({
        success: true,
        message: 'Transactions retrieved',
        data: result.transactions,
        meta: {
          page: result.page,
          perPage: result.perPage,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/payments/wallet
  async getWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const wallet = await squadService.getWallet(req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Wallet retrieved',
        data: wallet,
      });
    } catch (err) {
      next(err);
    }
  },
};