import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  amount: z
    .number({ error: 'Amount must be a number' })
    .min(10000, 'Minimum amount is ₦100 (10000 kobo)'),
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Valid email is required'),
  callbackUrl: z.string().url('Valid callback URL is required').optional(),
});

export const verifyTransactionSchema = z.object({
  transactionRef: z.string().min(1, 'Transaction reference is required'),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;