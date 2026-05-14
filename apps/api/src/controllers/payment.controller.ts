import { Request, Response, NextFunction } from 'express';
import { squadService } from '../services/squad.service';
import { paymentService } from '../services/payment.service';

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
      const wallet = await paymentService.getWallet(req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Wallet retrieved',
        data: wallet,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/payments/escrow
  async createEscrow(req: Request, res: Response, next: NextFunction) {
    try {
      const escrow = await paymentService.createEscrow(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Escrow payment funded successfully',
        data: escrow,
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/v1/payments/escrow/:escrowId/start
  async startEscrow(req: Request, res: Response, next: NextFunction) {
    try {
      const escrow = await paymentService.startEscrow(req.user!.userId, req.params.escrowId);
      res.status(200).json({
        success: true,
        message: 'Escrow payment marked in progress',
        data: escrow,
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/v1/payments/escrow/:escrowId/release
  async releaseEscrow(req: Request, res: Response, next: NextFunction) {
    try {
      const escrow = await paymentService.releaseEscrow(req.user!.userId, req.params.escrowId);
      res.status(200).json({
        success: true,
        message: 'Escrow released to trader wallet',
        data: escrow,
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/v1/payments/escrow/:escrowId/refund
  async refundEscrow(req: Request, res: Response, next: NextFunction) {
    try {
      const escrow = await paymentService.refundEscrow(req.user!.userId, req.params.escrowId);
      res.status(200).json({
        success: true,
        message: 'Escrow refunded to buyer wallet',
        data: escrow,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/payments/escrow
  async listEscrows(req: Request, res: Response, next: NextFunction) {
    try {
      const role = req.query.role as 'buyer' | 'trader' | undefined;
      const escrows = await paymentService.listEscrows(req.user!.userId, role);
      res.status(200).json({
        success: true,
        message: 'Escrow payments retrieved',
        data: escrows,
      });
    } catch (err) {
      next(err);
    }
  },
};
