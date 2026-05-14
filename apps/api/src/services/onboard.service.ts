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

const normalizeExtractedProfile = (value: unknown) => {
  if (!value || typeof value !== 'object') return value;

  const payload = value as Record<string, unknown>;
  const skills = payload.skills;
  const language = payload.language ?? payload.languages;

  return {
    ...payload,
    tradeCategory: payload.tradeCategory ?? payload.category ?? payload.businessCategory,
    skills:
      typeof skills === 'string'
        ? skills
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean)
        : skills,
    language: Array.isArray(language) ? language.join(', ') : language,
    yearsExperience: payload.yearsExperience ?? payload.yearsOfExperience ?? payload.experienceYears,
    description: payload.description ?? payload.bio ?? payload.summary,
  };
};

const sleep = (milliseconds: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const isTransientAiError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('"code":503') || message.includes('UNAVAILABLE') || message.includes('high demand');
};

const titleCase = (value: string): string =>
  value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const extractListAfter = (message: string, labels: string[]): string[] => {
  for (const label of labels) {
    const match = message.match(new RegExp(`${label}\\s*(?:are|is|:|-)?\\s*([^.;\\n]+)`, 'i'));
    if (match?.[1]) {
      return match[1]
        .split(/,| and /i)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const localProfileExtraction = (message: string): ExtractedProfile | null => {
  const lower = message.toLowerCase();
  const tradeCategory =
    message.match(/(?:i am|i'm|i work as|i sell|trade category is|business is)\s+(?:a|an)?\s*([^.,;\n]+)/i)?.[1] ??
    message.match(/(?:as a|as an)\s+([^.,;\n]+)/i)?.[1];
  const location =
    message.match(/(?:in|at|around|located in|location is)\s+([a-z ,'-]+?)(?:\.|,|;|$)/i)?.[1] ?? '';
  const yearsMatch = message.match(/(\d+)\s*(?:years|yrs)/i);
  const language =
    extractListAfter(message, ['languages?', 'i speak']).join(', ') ||
    (lower.includes('english') ? 'English' : '');
  const skills = extractListAfter(message, ['skills?', 'i can', 'i do']);

  const candidate = {
    tradeCategory: titleCase(tradeCategory ?? ''),
    skills: skills.length > 0 ? skills.map(titleCase) : tradeCategory ? [titleCase(tradeCategory)] : [],
    location: titleCase(location),
    language: language ? titleCase(language) : 'English',
    yearsExperience: yearsMatch ? Number(yearsMatch[1]) : 0,
    description: message.trim(),
  };

  const result = extractedProfileSchema.safeParse(candidate);
  return result.success ? result.data : null;
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

      let response;
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          response = await chat.sendMessage({ message });
          break;
        } catch (error) {
          if (!isTransientAiError(error) || attempt === 3) throw error;
          await sleep(attempt * 700);
        }
      }

      const reply = response?.text ?? '';

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

      const extracted = localProfileExtraction(message);
      if (extracted) {
        return {
          reply:
            'I captured enough details to complete your profile. Review the extracted data and submit it to finish onboarding.',
          isComplete: true,
          extractedData: extracted,
          fallback: true,
        };
      }

      if (isTransientAiError(error)) {
        return {
          reply:
            'The AI service is temporarily busy. You can still continue by sending your trade category, skills, location, language, years of experience, and a short description in one message.',
          isComplete: false,
          extractedData: null,
          fallback: true,
        };
      }

      throw new AppError('AI onboarding failed. Please try again.', 500);
    }
  },

  // ── 2. Parse <extracted> block from AI response ───────────────────────────
  parseExtracted(reply: string): ExtractedProfile | null {
    const candidate = getExtractionCandidate(reply);
    if (!candidate) return null;

    try {
      const parsed = JSON.parse(candidate.replace(/,\s*([}\]])/g, '$1'));
      const result = extractedProfileSchema.safeParse(normalizeExtractedProfile(parsed));

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
    const normalized = normalizeExtractedProfile(data);
    const result = extractedProfileSchema.safeParse(normalized);

    if (!result.success) {
      throw new AppError('Incomplete profile data. Please finish the onboarding chat.', 400);
    }

    const profileData = result.data;
    const [profile] = await EconomicProfile.upsert({
      userId,
      tradeCategory: profileData.tradeCategory,
      skills: profileData.skills,
      location: profileData.location,
      language: profileData.language,
      yearsExperience: profileData.yearsExperience ?? 0,
      description: profileData.description,
    });

    logger.info('Economic profile saved', { userId });

    return profile;
  },
};
