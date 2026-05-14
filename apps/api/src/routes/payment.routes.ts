import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createEscrowSchema, initiatePaymentSchema } from '../validators/payment.validator';

const router = Router();

// All payment routes are protected
router.use(protect);

router.post('/initiate', validateRequest(initiatePaymentSchema), paymentController.initiatePayment);
router.post('/escrow', validateRequest(createEscrowSchema), paymentController.createEscrow);
router.get('/escrow', paymentController.listEscrows);
router.patch('/escrow/:escrowId/start', paymentController.startEscrow);
router.patch('/escrow/:escrowId/release', paymentController.releaseEscrow);
router.patch('/escrow/:escrowId/refund', paymentController.refundEscrow);
router.get('/verify/:transactionRef', paymentController.verifyTransaction);
router.get('/transactions', paymentController.getTransactions);
router.get('/wallet', paymentController.getWallet);

export default router;
