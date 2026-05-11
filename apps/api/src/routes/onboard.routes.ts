// routes/onboarding.routes.ts
import { Router } from 'express';
import { onboardingController } from '../controllers/onboard.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { chatSchema, completeOnboardingSchema } from '../validators/onboard.validator';

const router = Router();

router.post('/chat', protect, validateRequest(chatSchema), onboardingController.chat);
router.post('/complete', protect, validateRequest(completeOnboardingSchema), onboardingController.complete);

export default router;