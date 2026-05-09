import { Router, Request, Response } from 'express';
import { env } from '../config/env.config';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Sabi API is running',
    environment: env.NODE_ENV,
    version: env.API_VERSION,
    timestamp: new Date().toISOString(),
  });
});

export default router;