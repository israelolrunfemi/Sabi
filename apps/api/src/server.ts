import app from './app';
import { connectDB, sequelize } from './config/database.config';
import { env } from './config/env.config';
import { logger } from './config/logger.config';
import './models/index';                    

const start = async (): Promise<void> => {
  try {
    await connectDB();

    await sequelize.sync();
    logger.info('Database synced');

    const server = app.listen(env.PORT);

    await new Promise<void>((resolve, reject) => {
      server.once('listening', () => resolve());
      server.once('error', (error) => reject(error));
    });

    logger.info(`Sabi API running on port ${env.PORT}`);

    const shutdown = (signal: string) => {
      logger.info(`${signal} received — shutting down`);
      server.close(() => process.exit(0));
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    logger.error('Failed to start server', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    process.exit(1);
  }
};

start();
