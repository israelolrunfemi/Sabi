import { z } from 'zod';

export const createVouchSchema = z.object({
  voucheeId: z.string().uuid('voucheeId must be a valid user ID'),
  message: z.string().trim().max(500).optional().nullable(),
});

export type CreateVouchInput = z.infer<typeof createVouchSchema>;
