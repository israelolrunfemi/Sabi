// validators/onboard.validator.ts
import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      })
    )
    .default([]),
});

const extractedProfileSchema = z.object({
  tradeCategory: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
  location: z.string().min(1),
  language: z.string().min(1),
  yearsExperience: z.coerce.number().int().min(0),
  description: z.string().min(1),
});

const normalizeProfilePayload = (value: unknown) => {
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

export const completeOnboardingSchema = z.preprocess((body) => {
  if (!body || typeof body !== 'object') return body;

  const payload = body as {
    extractedData?: unknown;
    data?: { extractedData?: unknown; profile?: unknown; economicProfile?: unknown };
    profile?: unknown;
    economicProfile?: unknown;
  };

  return normalizeProfilePayload(
    payload.extractedData ??
      payload.data?.extractedData ??
      payload.profile ??
      payload.data?.profile ??
      payload.economicProfile ??
      payload.data?.economicProfile ??
      body
  );
}, extractedProfileSchema);
