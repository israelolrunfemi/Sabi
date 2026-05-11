import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { initiatePaymentSchema } from '../validators/payment.validator';

const router = Router();

// All payment routes are protected
router.use(protect);

router.post('/initiate', validateRequest(initiatePaymentSchema), paymentController.initiatePayment);
router.get('/verify/:transactionRef', paymentController.verifyTransaction);
router.get('/transactions', paymentController.getTransactions);
router.get('/wallet', paymentController.getWallet);

export default router;