import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema, refreshSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', validateRequest(refreshSchema), authController.refresh);
router.get('/me', protect, authController.me);

export default router;