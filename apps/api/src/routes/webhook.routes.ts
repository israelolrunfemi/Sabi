import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';
import { verifySquadWebhook } from '../middlewares/webhook.middleware';

const router = Router();

router.post('/squad', verifySquadWebhook, webhookController.handleSquadWebhook);

export default router;
