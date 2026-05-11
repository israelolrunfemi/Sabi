import axios from 'axios';
import { env } from './env.config';

export const squadClient = axios.create({
  baseURL: env.SQUAD_BASE_URL,
  headers: {
    Authorization: `Bearer ${env.SQUAD_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Log Squad errors in dev
squadClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(`Squad API Error: ${message}`));
  }
);