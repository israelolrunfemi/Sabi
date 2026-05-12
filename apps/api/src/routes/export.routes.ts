import { Router } from 'express';
import { exportController } from '../controllers/export.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/financial-report', protect, exportController.downloadFinancialReport);

export default router;
