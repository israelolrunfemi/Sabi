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

export const createEscrowSchema = z.object({
  traderId: z.string().uuid('Trader ID must be a valid UUID'),
  amount: z.number({ error: 'Amount must be a number' }).positive('Amount must be greater than zero'),
  description: z.string().trim().min(2).max(255).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type CreateEscrowInput = z.infer<typeof createEscrowSchema>;
