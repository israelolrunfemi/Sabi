import { z } from 'zod';

export const createBuyerRequestSchema = z
  .object({
    imageBase64: z.string().min(100, 'imageBase64 must be at least 100 characters').optional(),
    mimeType: z
      .string()
      .regex(/^image\/(png|jpe?g|webp|gif)$/i, 'mimeType must be a supported image type')
      .optional(),
    description: z.string().trim().min(3).max(1000).optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.description && !value.imageBase64) {
      ctx.addIssue({
        code: 'custom',
        path: ['description'],
        message: 'Tell us what you are looking for or upload an image.',
      });
    }

    if (value.imageBase64 && !value.mimeType) {
      ctx.addIssue({
        code: 'custom',
        path: ['mimeType'],
        message: 'mimeType is required when imageBase64 is provided.',
      });
    }

    if (value.mimeType && !value.imageBase64) {
      ctx.addIssue({
        code: 'custom',
        path: ['imageBase64'],
        message: 'imageBase64 is required when mimeType is provided.',
      });
    }
  });

export type CreateBuyerRequestInput = z.infer<typeof createBuyerRequestSchema>;
