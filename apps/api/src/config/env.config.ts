import dotenv from 'dotenv';

dotenv.config();

const cleanEnvValue = (value: string): string => {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return cleanEnvValue(value);
};

const optional = (key: string, fallback: string): string => {
  const value = process.env[key];
  return value ? cleanEnvValue(value) : fallback;
};

export const env = {
  // Server
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '5000'), 10),
  API_VERSION: optional('API_VERSION', 'v1'),

  // Database
  DATABASE_URL: required('DATABASE_URL'),



  /// Auth
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: optional('JWT_REFRESH_EXPIRES_IN', '7d'),

  // Squad
  SQUAD_API_KEY: optional('SQUAD_API_KEY', ''),
  SQUAD_BASE_URL: optional('SQUAD_BASE_URL', 'https://sandbox-api-d.squadco.com'),
  SQUAD_WEBHOOK_SECRET: optional('SQUAD_WEBHOOK_SECRET', ''),
  SQUAD_BENEFICIARY_ACCOUNT: optional('SQUAD_BENEFICIARY_ACCOUNT', '0123456789'),

  // GEMINI
  GEMINI_API_KEY: optional('GEMINI_API_KEY', ''),
  GEMINI_MODEL: optional('GEMINI_MODEL', 'gemini-3.1-flash-lite'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: optional('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: optional('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: optional('CLOUDINARY_API_SECRET', ''),

  // Logging
  LOG_LEVEL: optional('LOG_LEVEL', 'debug'),

  //Ngrok
  NGROK_AUTHTOKEN: optional('NGROK_AUTHTOKEN', ''),

  // Client
  CLIENT_BASE_URL: optional('CLIENT_BASE_URL', 'http://localhost:3000'),

  // Helpers
  get isDev() { return this.NODE_ENV === 'development'; },
  get isProd() { return this.NODE_ENV === 'production'; },
};
