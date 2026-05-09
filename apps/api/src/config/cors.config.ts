import cors from 'cors';
import { env } from './env.config';

const allowedOrigins: Record<string, string[]> = {
  development: [
    env.ALLOWED_ORIGIN_DEV,
    'http://127.0.0.1:3000',
  ],
  production: [
    env.ALLOWED_ORIGIN_PROD,
  ],
  test: [
    'http://localhost:3000',
  ],
};

const currentOrigins = allowedOrigins[env.NODE_ENV] ?? allowedOrigins.development;

export const corsConfig = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin — Postman, server-to-server, Squad webhooks
    if (!origin) return callback(null, true);

    if (currentOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' is not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
  credentials: true,
  maxAge: 86400,
});