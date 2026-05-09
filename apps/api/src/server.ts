import app from './app';
import { connectDB } from './config/database.config';
import { env } from './config/env.config';
import { logger } from './config/logger.config';

const start = async (): Promise<void> => {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Start HTTP server
    const server = app.listen(env.PORT, () => {
      logger.info(`Sabi API running`, {
        port: env.PORT,
        env: env.NODE_ENV,
        url: `http://localhost:${env.PORT}/api/${env.API_VERSION}/health`,
      });
    });

    // ── Graceful Shutdown ─────────────────────────────────────────────────
    const shutdown = (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    logger.error('Failed to start server', { error: (err as Error).message });
    process.exit(1);
  }
};

start();