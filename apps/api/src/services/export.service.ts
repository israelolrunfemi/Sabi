import { financialReportService } from './financial-report.service';

export const exportService = {
  async generateFinancialReport(userId: string): Promise<Buffer> {
    const report = await financialReportService.generateForUser(userId);
    return report.buffer;
  },
};
