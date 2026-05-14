import { Sequelize } from 'sequelize';
import { env } from './env.config';
import { logger } from './logger.config';

const shouldUseSsl = (): boolean => {
  return env.NODE_ENV === 'production' || env.DATABASE_URL.includes('.render.com');
};

export const sequelize = new Sequelize(env.DATABASE_URL,{
  dialect: 'postgres',
  dialectOptions: shouldUseSsl()
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : undefined,

  logging: env.isDev ? (sql) => logger.debug(sql) : false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,       // maps camelCase fields → snake_case columns automatically
    timestamps: true,        // adds created_at and updated_at to every model
    freezeTableName: false,  // Sequelize will pluralize table names
  },
});

export const connectDB = async (): Promise<void> => {
  await sequelize.authenticate();
  logger.info('PostgreSQL connected via Sequelize');
};
