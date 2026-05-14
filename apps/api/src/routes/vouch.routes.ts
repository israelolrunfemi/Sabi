import { Router } from 'express';
import { vouchController } from '../controllers/vouch.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createVouchSchema } from '../validators/vouch.validator';

const router = Router();

router.get('/users/:userId/received', vouchController.listReceivedByUser);

router.use(protect);

router.post('/', validateRequest(createVouchSchema), vouchController.create);
router.get('/me/received', vouchController.listMineReceived);
router.get('/me/given', vouchController.listMineGiven);
router.delete('/:id', vouchController.remove);

export default router;
