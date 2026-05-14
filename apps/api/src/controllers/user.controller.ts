import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { financialReportService } from '../services/financial-report.service';


export const userController = {
  // GET /api/v1/users/:id — public profile
  async getPublicProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getPublicProfile(req.params.id);
      res.status(200).json({
        success: true,
        message: 'User profile retrieved',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/users/me/profile — full profile (authenticated)
  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getById(req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Profile retrieved',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/v1/users/me — update name, phone, image
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateProfile(req.user!.userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/v1/users/me/economic-profile — update trade/skills info
  async updateEconomicProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await userService.updateEconomicProfile(
        req.user!.userId,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Economic profile updated',
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/users/me/financial-report.pdf
  async exportFinancialReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await financialReportService.generateForUser(req.user!.userId);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${report.filename}"`,
        'Content-Length': report.buffer.length,
        'Cache-Control': 'no-store',
      });
      res.status(200).end(report.buffer);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/users — list all users (paginated)
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await userService.getAllUsers(page, limit);
      res.status(200).json({
        success: true,
        message: 'Users retrieved',
        data: result.users,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
