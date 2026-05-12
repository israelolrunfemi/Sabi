import { Request, Response, NextFunction } from 'express';
import { exportService } from '../services/export.service';

export const exportController = {
  async downloadFinancialReport(req: Request, res: Response, next: NextFunction) {
    try {
      const pdfBuffer = await exportService.generateFinancialReport(req.user!.userId);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="sabi-financial-report.pdf"',
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (err) {
      next(err);
    }
  },
};
