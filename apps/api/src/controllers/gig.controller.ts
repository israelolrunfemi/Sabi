import { Request, Response, NextFunction } from 'express';
import { gigService } from '../services/gig.service';

export const gigController = {
  async browseGigs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gigService.browseGigs(req.user!.userId, {
        category: req.query.category as string | undefined,
        location: req.query.location as string | undefined,
        minBudget: req.query.minBudget ? Number(req.query.minBudget) : undefined,
        maxBudget: req.query.maxBudget ? Number(req.query.maxBudget) : undefined,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
      });

      res.status(200).json({ success: true, message: 'Gigs retrieved', data: result });
    } catch (err) {
      next(err);
    }
  },

  async getRecommendedGigs(req: Request, res: Response, next: NextFunction) {
    try {
      const gigs = await gigService.getRecommendedGigs(req.user!.userId);
      res.status(200).json({ success: true, message: 'Recommended gigs', data: gigs });
    } catch (err) {
      next(err);
    }
  },

  async apply(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await gigService.apply(
        req.user!.userId,
        req.params.opportunityId,
        req.body.coverNote
      );

      res.status(201).json({
        success: true,
        message: 'Application submitted',
        data: application,
      });
    } catch (err) {
      next(err);
    }
  },

  async getApplicationsForGig(req: Request, res: Response, next: NextFunction) {
    try {
      const applications = await gigService.getApplicationsForGig(
        req.params.opportunityId,
        req.user!.userId
      );

      res.status(200).json({
        success: true,
        message: 'Applications retrieved',
        data: applications,
      });
    } catch (err) {
      next(err);
    }
  },

  async hireApplicant(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gigService.hireApplicant(
        req.params.applicationId,
        req.user!.userId,
        req.user!.email
      );

      res.status(200).json({ success: true, message: 'Applicant hired', data: result });
    } catch (err) {
      next(err);
    }
  },

  async markComplete(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await gigService.markComplete(
        req.params.applicationId,
        req.user!.userId
      );

      res.status(200).json({
        success: true,
        message: 'Gig marked as complete',
        data: application,
      });
    } catch (err) {
      next(err);
    }
  },

  async getMyApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gigService.getMyApplications(
        req.user!.userId,
        Number(req.query.page) || 1,
        Number(req.query.limit) || 10
      );

      res.status(200).json({
        success: true,
        message: 'Applications retrieved',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
