// validators/onboard.validator.ts
import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      })
    )
    .default([]),
});

export const completeOnboardingSchema = z.object({
  tradeCategory: z.string().min(1),
  skills: z.array(z.string()).min(1),
  location: z.string().min(1),
  language: z.string().min(1),
  yearsExperience: z.number().int().min(0),
  description: z.string().min(1),
});