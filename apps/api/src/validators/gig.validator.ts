import { z } from 'zod';

export const applyToGigSchema = z.object({
  coverNote: z.string().trim().max(2000).optional(),
});

export type ApplyToGigInput = z.infer<typeof applyToGigSchema>;
