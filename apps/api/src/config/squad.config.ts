import axios from 'axios';
import { env } from './env.config';
import { AppError } from '../utils/app.error';

export const squadClient = axios.create({
  baseURL: env.SQUAD_BASE_URL,
  headers: {
    Authorization: `Bearer ${env.SQUAD_API_KEY || 'missing'}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

squadClient.interceptors.request.use((config) => {
  if (!env.SQUAD_API_KEY) {
    return Promise.reject(new AppError('SQUAD_API_KEY is not configured.', 500));
  }

  return config;
});

// Log Squad errors in dev
squadClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new AppError(`Squad API Error: ${message}`, 502));
  }
);
