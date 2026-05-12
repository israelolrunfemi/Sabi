import { Op } from 'sequelize';
import { z } from 'zod';
import { gemini } from '../config/gemini.config';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';
import { BuyerRequest, EconomicProfile, User } from '../models/index';
import { AppError } from '../utils/app.error';
import { uploadToCloudinary } from '../utils/cloudinary.util';
import { BUYER_TRADER_MATCH_SYSTEM_PROMPT, VISUAL_MATCH_SYSTEM_PROMPT } from '../utils/prompt';
import type { CreateBuyerRequestInput } from '../validators/buyer-request.validator';

const extractedNeedSchema = z.object({
  serviceNeeded: z.string().min(1),
  category: z.enum([
    'tailoring',
    'phone repair',
    'fabric',
    'food',
    'construction',
    'electronics',
    'beauty',
    'photography',
    'other',
  ]),
  specificRequirements: z.array(z.string()).default([]),
  estimatedBudget: z.coerce.number().nullable().default(null),
  urgency: z.string().default('normal'),
});

const traderMatchSchema = z.object({
  traderId: z.string().uuid(),
  score: z.coerce.number().int().min(0).max(100),
  reasoning: z.string().default(''),
  keyStrengths: z.array(z.string()).default([]),
});

type ExtractedNeed = z.infer<typeof extractedNeedSchema>;
type TraderMatch = z.infer<typeof traderMatchSchema>;

const categorySearchTerms: Record<ExtractedNeed['category'], string[]> = {
  tailoring: ['tailoring', 'tailor', 'fashion', 'sewing'],
  'phone repair': ['phone repair', 'phone', 'mobile', 'screen repair'],
  fabric: ['fabric', 'textile', 'cloth', 'ankara', 'lace'],
  food: ['food', 'catering', 'cook', 'restaurant'],
  construction: ['construction', 'builder', 'carpentry', 'plumbing', 'electrical'],
  electronics: ['electronics', 'electrical', 'appliance'],
  beauty: ['beauty', 'hair', 'makeup', 'salon'],
  photography: ['photography', 'photo', 'videography', 'camera'],
  other: ['general'],
};

const stripCodeFence = (value: string): string => {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
};

const findFirstJsonValue = (value: string, open: '{' | '['): string | null => {
  const close = open === '{' ? '}' : ']';
  const start = value.indexOf(open);
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

    if (char === open) depth += 1;
    if (char === close) depth -= 1;

    if (depth === 0) return value.slice(start, index + 1);
  }

  return null;
};

const parseExtractedNeed = (reply: string): ExtractedNeed => {
  const cleaned = stripCodeFence(reply);
  const tagged = cleaned.match(/<need>([\s\S]*?)<\/need>/i)?.[1];
  const json = tagged ?? findFirstJsonValue(cleaned, '{');
  if (!json) throw new Error('Gemini response did not contain an extracted need object.');

  const parsed = JSON.parse(json.replace(/,\s*([}\]])/g, '$1'));
  const result = extractedNeedSchema.safeParse(parsed);
  if (!result.success) throw new Error('Gemini visual need response failed validation.');

  return result.data;
};

const parseTraderMatches = (reply: string): TraderMatch[] => {
  const json = findFirstJsonValue(stripCodeFence(reply), '[');
  if (!json) throw new Error('Gemini response did not contain a trader match array.');

  const parsed = JSON.parse(json.replace(/,\s*([}\]])/g, '$1'));
  const result = z.array(traderMatchSchema).safeParse(parsed);
  if (!result.success) throw new Error('Gemini trader match response failed validation.');

  return result.data;
};

export const buyerRequestService = {
  async analyseImage(imageBase64: string, mimeType: string, description?: string) {
    const response = await gemini.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: imageBase64,
              },
            },
            {
              text: description
                ? `The buyer also says: "${description}". Analyse the image and extract what service or product they need.`
                : 'Analyse this image and extract what service or product the buyer needs.',
            },
          ],
        },
      ],
      config: {
        systemInstruction: VISUAL_MATCH_SYSTEM_PROMPT,
        temperature: 0.1,
        maxOutputTokens: 1000,
      },
    });

    return parseExtractedNeed(response.text ?? '');
  },

  async matchTradersToNeed(buyerId: string, input: CreateBuyerRequestInput) {
    try {
      const extractedNeed = await buyerRequestService.analyseImage(
        input.imageBase64,
        input.mimeType,
        input.description
      );

      const includeActiveTrader = [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'trustScore', 'profileImage', 'status'],
          where: { status: 'ACTIVE', userType: 'TRADER' },
        },
      ];
      const terms = categorySearchTerms[extractedNeed.category];
      let traders = await EconomicProfile.findAll({
        where: {
          [Op.or]: terms.map((term) => ({
            tradeCategory: {
              [Op.iLike]: `%${term}%`,
            },
          })),
        },
        include: includeActiveTrader,
        limit: 20,
      });

      if (traders.length === 0) {
        traders = await EconomicProfile.findAll({
          include: includeActiveTrader,
          order: [['updatedAt', 'DESC']],
          limit: 20,
        });
      }

      const matchResponse = await gemini.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: JSON.stringify(
          {
            buyerNeed: extractedNeed,
            traders: traders.map((trader) => {
              const user = (trader as EconomicProfile & { user?: User }).user;

              return {
                traderId: user?.id,
                tradeCategory: trader.tradeCategory,
                skills: trader.skills,
                location: trader.location,
                yearsExperience: trader.yearsExperience,
                trustScore: user?.trustScore,
              };
            }),
          },
          null,
          2
        ),
        config: {
          systemInstruction: BUYER_TRADER_MATCH_SYSTEM_PROMPT,
          temperature: 0.2,
          maxOutputTokens: 2000,
          responseMimeType: 'application/json',
        },
      });

      const allowedTraderIds = new Set(
        traders
          .map((trader) => (trader as EconomicProfile & { user?: User }).user?.id)
          .filter((id): id is string => Boolean(id))
      );
      const matches = parseTraderMatches(matchResponse.text ?? '')
        .filter((match) => allowedTraderIds.has(match.traderId))
        .sort((left, right) => right.score - left.score);

      const imageUrl = await uploadToCloudinary(input.imageBase64, input.mimeType);
      const saved = await BuyerRequest.create({
        buyerId,
        imageUrl,
        extractedNeed,
        category: extractedNeed.category,
        estimatedBudget: extractedNeed.estimatedBudget,
        rawDescription: input.description ?? null,
        status: matches.length > 0 ? 'MATCHED' : 'OPEN',
      });

      return {
        request: saved,
        extractedNeed,
        matches,
      };
    } catch (error) {
      logger.error('Gemini visual buyer matching failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      if (error instanceof AppError) throw error;
      throw new AppError('Visual buyer matching failed. Please try again.', 500);
    }
  },

  async listForBuyer(buyerId: string) {
    return BuyerRequest.findAll({
      where: { buyerId },
      order: [['createdAt', 'DESC']],
    });
  },
};
