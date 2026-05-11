import { ONBOARDING_SYSTEM_PROMPT } from '../utils/prompt';
import { gemini } from '../config/gemini.config';
import { env } from '../config/env.config';
import { EconomicProfile } from '../models/index';
import { AppError } from '../utils/app.error';
import { logger } from '../config/logger.config';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type GeminiHistoryItem = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

const toGeminiHistory = (history: Message[] = []): GeminiHistoryItem[] => {
  return history
    .filter((item) => item.role !== 'system' && item.content?.trim())
    .map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    }));
};

export const onboardingService = {
  // ── 1. Chat — send message, get AI response ───────────────────────────────
  async chat(message: string, history: Message[] = []) {
    try {
      const chat = gemini.chats.create({
        model: env.GEMINI_MODEL,
        history: toGeminiHistory(history),
        config: {
          systemInstruction: ONBOARDING_SYSTEM_PROMPT,
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const response = await chat.sendMessage({
        message,
      });

      const reply = response.text ?? '';

      // Check if AI has finished extracting — looks for <extracted> tag
      const extracted = onboardingService.parseExtracted(reply);

      return {
        reply,
        isComplete: !!extracted,
        extractedData: extracted,
      };
    } catch (error) {
      logger.error('Gemini onboarding chat failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      throw new AppError('AI onboarding failed. Please try again.', 500);
    }
  },

  // ── 2. Parse <extracted> block from AI response ───────────────────────────
  parseExtracted(reply: string) {
    const match = reply.match(/<extracted>([\s\S]*?)<\/extracted>/);
    if (!match) return null;

    try {
      return JSON.parse(match[1].trim());
    } catch {
      logger.warn('Failed to parse extracted JSON from AI response');
      return null;
    }
  },

  // ── 3. Complete — save extracted profile to DB ────────────────────────────
  async complete(
    userId: string,
    data: {
      tradeCategory: string;
      skills: string[];
      location: string;
      language: string;
      yearsExperience: number;
      description: string;
    }
  ) {
    if (!data.tradeCategory || !data.skills || !data.location) {
      throw new AppError('Incomplete profile data. Please finish the onboarding chat.', 400);
    }

    const [profile] = await EconomicProfile.upsert({
      userId,
      tradeCategory: data.tradeCategory,
      skills: data.skills,
      location: data.location,
      language: data.language,
      yearsExperience: data.yearsExperience ?? 0,
      description: data.description,
    });

    logger.info('Economic profile saved', { userId });

    return profile;
  },
};