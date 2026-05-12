import { ONBOARDING_SYSTEM_PROMPT } from '../utils/prompt';
import { gemini } from '../config/gemini.config';
import { env } from '../config/env.config';
import { EconomicProfile } from '../models/index';
import { AppError } from '../utils/app.error';
import { logger } from '../config/logger.config';
import { z } from 'zod';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type GeminiHistoryItem = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

const extractedProfileSchema = z.object({
  tradeCategory: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
  location: z.string().min(1),
  language: z.string().min(1),
  yearsExperience: z.coerce.number().int().min(0),
  description: z.string().min(1),
});

type ExtractedProfile = z.infer<typeof extractedProfileSchema>;

const toGeminiHistory = (history: Message[] = []): GeminiHistoryItem[] => {
  return history
    .filter((item) => item.role !== 'system' && item.content?.trim())
    .map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    }));
};

const stripCodeFence = (value: string): string => {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
};

const findFirstJsonObject = (value: string): string | null => {
  const start = value.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < value.length; index += 1) {
    const char = value[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = inString;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;

    if (depth === 0) {
      return value.slice(start, index + 1);
    }
  }

  return null;
};

const getExtractionCandidate = (reply: string): string | null => {
  const taggedMatch = reply.match(/<extracted\b[^>]*>([\s\S]*?)<\/extracted>/i);
  const source = taggedMatch?.[1] ?? reply;
  return findFirstJsonObject(stripCodeFence(source));
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
  parseExtracted(reply: string): ExtractedProfile | null {
    const candidate = getExtractionCandidate(reply);
    if (!candidate) return null;

    try {
      const parsed = JSON.parse(candidate.replace(/,\s*([}\]])/g, '$1'));
      const result = extractedProfileSchema.safeParse(parsed);

      if (!result.success) {
        logger.warn('Extracted onboarding JSON failed validation', {
          errors: result.error.flatten().fieldErrors,
        });
        return null;
      }

      return result.data;
    } catch (error) {
      logger.warn('Failed to parse extracted JSON from AI response', {
        error: error instanceof Error ? error.message : String(error),
      });
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
