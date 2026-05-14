require('dotenv').config();

const cleanEnvValue = (value) => {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

const required = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return cleanEnvValue(value);
};

module.exports = {
  development: {
    url: required('DATABASE_URL'),
    dialect: 'postgres',
    dialectOptions:
      process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('.render.com')
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined,
    logging: false,
  },
  test: {
    url: required('DATABASE_URL'),
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: required('DATABASE_URL'),
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
};
