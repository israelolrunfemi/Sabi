import { Router } from 'express';
import { gigController } from '../controllers/gig.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { applyToGigSchema } from '../validators/gig.validator';

const router = Router();

router.use(protect);

router.get('/browse', gigController.browseGigs);
router.get('/recommended', gigController.getRecommendedGigs);
router.get('/my-applications', gigController.getMyApplications);
router.post('/:opportunityId/apply', validateRequest(applyToGigSchema), gigController.apply);
router.patch('/applications/:applicationId/complete', gigController.markComplete);
router.get('/:opportunityId/applications', gigController.getApplicationsForGig);
router.patch('/applications/:applicationId/hire', gigController.hireApplicant);

export default router;
