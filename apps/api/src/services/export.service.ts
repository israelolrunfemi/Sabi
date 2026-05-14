import { financialReportService } from './financial-report.service';

export const exportService = {
  async generateFinancialReport(userId: string) {
    return financialReportService.generateForUser(userId);
  },
};
