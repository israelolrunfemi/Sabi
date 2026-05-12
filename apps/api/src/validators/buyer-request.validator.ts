import { z } from 'zod';

export const createBuyerRequestSchema = z.object({
  imageBase64: z.string().min(100, 'imageBase64 is required'),
  mimeType: z
    .string()
    .regex(/^image\/(png|jpe?g|webp|gif)$/i, 'mimeType must be a supported image type'),
  description: z.string().trim().max(1000).optional(),
});

export type CreateBuyerRequestInput = z.infer<typeof createBuyerRequestSchema>;
