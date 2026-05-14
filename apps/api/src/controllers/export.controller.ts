import { Request, Response, NextFunction } from 'express';
import { exportService } from '../services/export.service';

export const exportController = {
  async downloadFinancialReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await exportService.generateFinancialReport(req.user!.userId);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${report.filename}"`,
        'Content-Length': report.buffer.length,
        'Cache-Control': 'no-store',
      });

      res.end(report.buffer);
    } catch (err) {
      next(err);
    }
  },
};
