import { sequelize } from '../config/database.config';
import '../models/index';

const run = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.info('Database schema is up to date.');
  } catch (error) {
    console.error('Failed to run database migration:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
