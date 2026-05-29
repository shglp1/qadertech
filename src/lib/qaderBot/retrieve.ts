import type { Lang } from "../dict";
import {
  getAllKnowledge,
  getKnowledgeByLocale,
  type KnowledgeChunk,
} from "./knowledge";
import { detectLocale, normalizeText, tokenize } from "./normalize";

const AR_SYNONYMS: Record<string, string[]> = {
  موقع: ["مواقع", "ويب", "صفحة", "landing", "page", "website", "web"],
  تطبيق: ["تطبيقات", "app", "mobile", "جوال", "انظمة", "أنظمة"],
  أتمتة: ["اوتوميشن", "automation", "شغل", "روتين"],
  سعر: ["أسعار", "تكلفة", "cost", "price", "pricing", "باقات"],
  تواصل: ["contact", "ايميل", "email", "هاتف", "اتصال", "واتساب"],
  خدمات: ["service", "services", "خدمة"],
  مشروع: ["start", "بداية", "ابدأ", "رحلة"],
  ذكاء: ["ai", "artificial", "اصطناعي", "chatbot", "شات"],
  قادر: ["qadertech", "qader", "شركة", "من"],
};

const EN_SYNONYMS: Record<string, string[]> = {
  website: ["web", "site", "sites", "landing", "page"],
  app: ["apps", "mobile", "application", "system", "systems"],
  automation: ["automate", "workflow", "routine"],
  price: ["pricing", "cost", "packages", "rates"],
  contact: ["email", "phone", "reach", "whatsapp"],
  services: ["service", "offer", "offerings"],
  project: ["start", "begin", "journey"],
  ai: ["artificial", "intelligence", "chatbot", "bot"],
  qadertech: ["qader", "company", "who"],
};

export interface RetrievalResult {
  chunks: KnowledgeChunk[];
  confidence: number;
  locale: Lang;
}

function expandSynonyms(tokens: string[], locale: Lang): Set<string> {
  const expanded = new Set(tokens);
  const synonymMap = locale === "ar" ? AR_SYNONYMS : EN_SYNONYMS;

  for (const token of tokens) {
    expanded.add(token);
    for (const [key, values] of Object.entries(synonymMap)) {
      const normalizedKey = normalizeText(key, locale);
      if (token === normalizedKey || values.some((v) => normalizeText(v, locale) === token)) {
        expanded.add(normalizedKey);
        values.forEach((v) => expanded.add(normalizeText(v, locale)));
      }
    }
  }

  return expanded;
}

function scoreChunk(
  chunk: KnowledgeChunk,
  queryTokens: Set<string>,
  locale: Lang
): number {
  const searchable = normalizeText(
    `${chunk.title} ${chunk.content} ${(chunk.keywords ?? []).join(" ")}`,
    locale
  );
  const chunkTokens = new Set(tokenize(searchable, locale));
  let score = 0;

  for (const token of queryTokens) {
    if (chunkTokens.has(token)) score += 2;
    if (searchable.includes(token)) score += 1;
  }

  if (chunk.type === "faq" && chunk.title) {
    const titleNorm = normalizeText(chunk.title, locale);
    for (const token of queryTokens) {
      if (titleNorm.includes(token)) score += 3;
    }
  }

  const serviceIntent =
    queryTokens.has("services") ||
    queryTokens.has("service") ||
    queryTokens.has("خدمات") ||
    queryTokens.has("خدمه") ||
    queryTokens.has("ايش") ||
    queryTokens.has("what");
  if (serviceIntent && chunk.type === "service") score += 4;

  const contactIntent =
    queryTokens.has("contact") ||
    queryTokens.has("email") ||
    queryTokens.has("phone") ||
    queryTokens.has("تواصل") ||
    queryTokens.has("ايميل") ||
    queryTokens.has("هاتف");
  if (contactIntent && chunk.type === "contact") score += 5;

  const pricingIntent =
    queryTokens.has("price") ||
    queryTokens.has("pricing") ||
    queryTokens.has("cost") ||
    queryTokens.has("سعر") ||
    queryTokens.has("اسعار") ||
    queryTokens.has("تكلفه");
  if (pricingIntent && chunk.id.includes("pricing")) score += 6;

  if (chunk.type === "service") score += 0.5;
  if (chunk.type === "contact") score += 0.5;

  return score;
}

export function retrieveKnowledge(
  message: string,
  preferredLocale?: Lang
): RetrievalResult {
  const locale = preferredLocale ?? detectLocale(message);
  const tokens = tokenize(message, locale);
  const queryTokens = expandSynonyms(tokens, locale);

  const primaryPool = getKnowledgeByLocale(locale);
  const fallbackPool = getAllKnowledge().filter((c) => c.locale !== locale);
  const pool = primaryPool.length > 0 ? primaryPool : fallbackPool;

  const scored = pool
    .map((chunk) => ({
      chunk,
      score: scoreChunk(chunk, queryTokens, locale),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const topChunks = scored.slice(0, 5).map((item) => item.chunk);
  const topScore = scored[0]?.score ?? 0;
  const maxPossible = Math.max(queryTokens.size * 3, 1);
  const confidence = Math.min(topScore / maxPossible, 1);

  if (topChunks.length === 0) {
    const general = getKnowledgeByLocale(locale).filter(
      (c) => c.type === "company" || c.type === "contact"
    );
    return { chunks: general.slice(0, 2), confidence: 0.1, locale };
  }

  return { chunks: topChunks, confidence, locale };
}
