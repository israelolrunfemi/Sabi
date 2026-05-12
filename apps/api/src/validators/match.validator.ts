import { z } from 'zod';

export const generateMatchesSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  minScore: z.coerce.number().int().min(0).max(100).default(50),
});

export const updateMatchStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
});

export type GenerateMatchesInput = z.infer<typeof generateMatchesSchema>;
export type UpdateMatchStatusInput = z.infer<typeof updateMatchStatusSchema>;
