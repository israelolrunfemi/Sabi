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
  SQUAD_API_KEY: required('SQUAD_API_KEY'),
  SQUAD_BASE_URL: optional('SQUAD_BASE_URL', 'https://sandbox-api-d.squadco.com'),
  SQUAD_WEBHOOK_SECRET: required('SQUAD_WEBHOOK_SECRET'),
  SQUAD_BENEFICIARY_ACCOUNT: optional('SQUAD_BENEFICIARY_ACCOUNT', '0123456789'),

  // GEMINI
GEMINI_API_KEY: required('GEMINI_API_KEY'),
GEMINI_MODEL: optional("GEMINI_MODEL", "gemini-3.1-flash-lite"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: optional('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: optional('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: optional('CLOUDINARY_API_SECRET', ''),

  // CORS
  ALLOWED_ORIGIN_DEV: optional('ALLOWED_ORIGIN_DEV', 'http://localhost:3000'),
  ALLOWED_ORIGIN_PROD: optional('ALLOWED_ORIGIN_PROD', ''),

  // Logging
  LOG_LEVEL: optional('LOG_LEVEL', 'debug'),

  //Ngrok
  NGROK_AUTHTOKEN: optional('NGROK_AUTHTOKEN', ''),

  // Helpers
  get isDev() { return this.NODE_ENV === 'development'; },
  get isProd() { return this.NODE_ENV === 'production'; },
};