import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { trustScoreController } from '../controllers/trust-score.controller';

const router = Router();

router.get('/me', protect, trustScoreController.getMine);
router.post('/me/recalculate', protect, trustScoreController.recalculateMine);
router.get('/:userId', trustScoreController.getByUserId);

export default router;
