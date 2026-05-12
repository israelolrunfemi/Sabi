import { Request, Response, NextFunction } from 'express';
import { webhookService } from '../services/webhook.service';
import { logger } from '../config/logger.config';

export const webhookController = {
  async handleSquadWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;

      logger.debug('Squad webhook received', {
        reference: payload.transaction_reference,
        channel: payload.channel,
        indicator: payload.transaction_indicator,
      });

      if (payload.transaction_indicator === 'C') {
        await webhookService.handlePaymentSuccess(payload);
      }

      res.status(200).json({
        response_code: 200,
        transaction_reference: payload.transaction_reference,
        response_description: 'Success',
      });
    } catch (err) {
      next(err);
    }
  },
};
