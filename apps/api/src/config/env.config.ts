import dotenv from 'dotenv';

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const optional = (key: string, fallback: string): string => {
  return process.env[key] ?? fallback;
};

export const env = {
  // Server
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '5000'), 10),
  API_VERSION: optional('API_VERSION', 'v1'),

  // Database
// Database
DATABASE_URL: optional('DATABASE_URL', ''),



  /// Auth
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: optional('JWT_REFRESH_EXPIRES_IN', '7d'),

  // Squad
  // SQUAD_API_KEY: required('SQUAD_API_KEY'),
  // SQUAD_BASE_URL: optional('SQUAD_BASE_URL', 'https://sandbox-api-d.squadco.com'),
  // SQUAD_WEBHOOK_SECRET: required('SQUAD_WEBHOOK_SECRET'),

  // Anthropic
  // ANTHROPIC_API_KEY: required('ANTHROPIC_API_KEY'),
  // ANTHROPIC_MODEL: optional('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514'),
  // ANTHROPIC_MAX_TOKENS: parseInt(optional('ANTHROPIC_MAX_TOKENS', '1000'), 10),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: optional('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: optional('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: optional('CLOUDINARY_API_SECRET', ''),

  // CORS
  ALLOWED_ORIGIN_DEV: optional('ALLOWED_ORIGIN_DEV', 'http://localhost:3000'),
  ALLOWED_ORIGIN_PROD: optional('ALLOWED_ORIGIN_PROD', ''),

  // Logging
  LOG_LEVEL: optional('LOG_LEVEL', 'debug'),

  // Helpers
  get isDev() { return this.NODE_ENV === 'development'; },
  get isProd() { return this.NODE_ENV === 'production'; },
};