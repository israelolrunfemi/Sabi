import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  updateProfileSchema,
  updateEconomicProfileSchema,
} from '../validators/user.validator';

const router = Router();

// Public
router.get('/:id', userController.getPublicProfile);

// Protected
router.get('/me/profile', protect, userController.getMyProfile);
router.patch('/me', protect, validateRequest(updateProfileSchema), userController.updateProfile);
router.patch('/me/economic-profile', protect, validateRequest(updateEconomicProfileSchema), userController.updateEconomicProfile);
router.get('/', protect, userController.getAllUsers);

export default router;