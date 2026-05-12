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

const extractedProfileSchema = z.object({
  tradeCategory: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
  location: z.string().min(1),
  language: z.string().min(1),
  yearsExperience: z.coerce.number().int().min(0),
  description: z.string().min(1),
});

export const completeOnboardingSchema = z.preprocess((body) => {
  if (!body || typeof body !== 'object') return body;

  const payload = body as {
    extractedData?: unknown;
    data?: { extractedData?: unknown };
  };

  return payload.extractedData ?? payload.data?.extractedData ?? body;
}, extractedProfileSchema);
