// routes/onboarding.routes.ts
import { Router } from 'express';
import { onboardingController } from '../controllers/onboard.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { chatSchema, completeOnboardingSchema } from '../validators/onboard.validator';

const router = Router();

router.use(protect, restrictTo('TRADER', 'SEEKER'));

router.post('/chat', validateRequest(chatSchema), onboardingController.chat);
router.post('/complete', validateRequest(completeOnboardingSchema), onboardingController.complete);

export default router;
