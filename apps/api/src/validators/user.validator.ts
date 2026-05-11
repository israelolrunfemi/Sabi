import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number')
    .optional(),
  profileImage: z.string().url('Must be a valid URL').optional(),
});

export const updateEconomicProfileSchema = z.object({
  tradeCategory: z.string().min(1).optional(),
  skills: z.array(z.string()).optional(),
  description: z.string().max(500).optional(),
  yearsExperience: z.number().int().min(0).max(50).optional(),
  location: z.string().optional(),
  language: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateEconomicProfileInput = z.infer<typeof updateEconomicProfileSchema>;