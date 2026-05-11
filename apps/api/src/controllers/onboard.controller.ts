// controllers/onboarding.controller.ts
import { Request, Response, NextFunction } from 'express';
import { onboardingService } from '../services/onboard.service';

export const onboardingController = {
  // POST /api/v1/onboarding/chat
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, history = [] } = req.body;
      const result = await onboardingService.chat(message, history);
      res.status(200).json({
        success: true,
        message: 'Response received',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/onboard/complete
  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await onboardingService.complete(
        req.user!.userId,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Profile saved successfully',
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  },
};