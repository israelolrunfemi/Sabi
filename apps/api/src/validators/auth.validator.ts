import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  userType: z.enum(['TRADER', 'SEEKER', 'BUYER'], {
  error: 'userType must be TRADER, SEEKER, or BUYER',
}),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;