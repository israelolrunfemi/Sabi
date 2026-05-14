import { Router } from 'express';
import { buyerRequestController } from '../controllers/buyer-request.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createBuyerRequestSchema } from '../validators/buyer-request.validator';

const router = Router();

router.use(protect, restrictTo('BUYER'));

router.post('/analyse', validateRequest(createBuyerRequestSchema), buyerRequestController.create);
router.post('/', validateRequest(createBuyerRequestSchema), buyerRequestController.create);
router.get('/', buyerRequestController.listMine);

export default router;
