import express, { Application, Request, Response, NextFunction } from 'express';
import { corsConfig } from './config/cors.config';
import { errorMiddleware } from './middlewares/error.middleware';
import { logger } from './config/logger.config';
import { env } from './config/env.config';
import { AppError } from './utils/app.error';

// ── Routes ─────────────────────────────────────────────────────────────────
import healthRoutes from './routes/health.routes';
// Add your routes here as you build them:
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
// import matchRoutes from './routes/match.routes';
// import paymentRoutes from './routes/payment.routes';

const app: Application = express();

// ── Global Middleware ───────────────────────────────────────────────────────
app.use(corsConfig);
app.options('*', corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request Logger (dev only) ───────────────────────────────────────────────
if (env.isDev) {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });
}

// ── Routes ──────────────────────────────────────────────────────────────────
const BASE = `/api/${env.API_VERSION}`;

app.use(`${BASE}/health`, healthRoutes);
app.use(`${BASE}/auth`, authRoutes);
app.use(`${BASE}/users`, userRoutes);
// app.use(`${BASE}/matches`, matchRoutes);
// app.use(`${BASE}/payments`, paymentRoutes);

// ── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.method} ${req.path}`, 404));
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

export default app;