import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { env } from '../config/env.config';
import { AppError } from '../utils/app.error';
import { logger } from '../config/logger.config';

const requiredSignatureFields = [
  'transaction_reference',
  'virtual_account_number',
  'currency',
  'principal_amount',
  'settled_amount',
  'customer_identifier',
] as const;

export const verifySquadWebhook = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    if (!env.SQUAD_WEBHOOK_SECRET) {
      throw new AppError('SQUAD_WEBHOOK_SECRET is not configured.', 500);
    }

    const signature = req.headers['x-squad-signature'] as string | undefined;

    if (!signature) {
      throw new AppError('Missing Squad webhook signature.', 401);
    }

    const payload = req.body as Record<string, unknown>;
    const missingFields = requiredSignatureFields.filter((field) => payload[field] === undefined);

    if (missingFields.length > 0) {
      throw new AppError(`Missing Squad webhook field(s): ${missingFields.join(', ')}.`, 400);
    }

    const signatureString = requiredSignatureFields.map((field) => String(payload[field])).join('|');
    const generatedHash = crypto
      .createHmac('sha512', env.SQUAD_WEBHOOK_SECRET)
      .update(signatureString)
      .digest('hex');

    if (generatedHash !== signature) {
      logger.warn('Invalid Squad webhook signature', { signature });
      throw new AppError('Invalid webhook signature.', 401);
    }

    next();
  } catch (err) {
    next(err);
  }
};
