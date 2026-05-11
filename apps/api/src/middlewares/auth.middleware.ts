import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.util';
import { AppError } from '../utils/app.error';

// Extend Express Request to carry the user payload
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const protect = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided. Please log in.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
};

// Optional: restrict to specific user types
export const restrictTo = (...userTypes: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !userTypes.includes(req.user.userType)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};