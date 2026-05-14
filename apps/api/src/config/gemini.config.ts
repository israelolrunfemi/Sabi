import { GoogleGenAI } from '@google/genai';
import { AppError } from '../utils/app.error';
import { env } from './env.config';

const missingGemini = () => {
  throw new AppError('GEMINI_API_KEY is not configured.', 500);
};

const missingGeminiClient = {
  chats: {
    create: missingGemini,
  },
  models: {
    generateContent: missingGemini,
  },
} as unknown as GoogleGenAI;

export const gemini = env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
  : missingGeminiClient;
