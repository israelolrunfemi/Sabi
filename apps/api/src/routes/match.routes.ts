import { Router } from 'express';
import { matchController } from '../controllers/match.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { generateMatchesSchema, updateMatchStatusSchema } from '../validators/match.validator';

const router = Router();

router.use(protect);

router.post('/generate', validateRequest(generateMatchesSchema), matchController.generate);
router.get('/', matchController.list);
router.patch('/:id/status', validateRequest(updateMatchStatusSchema), matchController.updateStatus);

export default router;
