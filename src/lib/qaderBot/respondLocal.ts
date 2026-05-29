import type { Lang } from "../dict";
import type { KnowledgeChunk } from "./knowledge";
import { getKnowledgeByLocale } from "./knowledge";
import { normalizeText } from "./normalize";

export const GREETINGS: Record<Lang, string> = {
  ar: "أهلًا! أنا QaderBot. كيف أقدر أساعدك في مشروعك الرقمي؟",
  en: "Hi! I'm QaderBot. How can I help you with your digital project?",
};

export const FALLBACK_MESSAGES: Record<Lang, string> = {
  ar: "ما عندي معلومات كافية عن هذا الموضوع من بيانات الموقع، لكن أقدر أساعدك بالتواصل مع فريق قادر.",
  en: "I do not have enough information about that from the website data, but I can help you contact the QaderTech team.",
};

const GREETING_PATTERNS = {
  ar: ["السلام", "سلام", "مرحب", "اهلا", "أهلا", "هلا", "صباح", "مساء"],
  en: ["hi", "hello", "hey", "good morning", "good evening"],
};

function isGreeting(message: string, locale: Lang): boolean {
  const lower = message.toLowerCase().trim();
  const patterns = GREETING_PATTERNS[locale];
  return patterns.some((p) => lower.includes(p));
}

function buildAnswerFromChunks(chunks: KnowledgeChunk[], locale: Lang): string {
  if (chunks.length === 0) return FALLBACK_MESSAGES[locale];

  const faq = chunks.find((c) => c.type === "faq" && !c.id.includes("pricing"));
  if (faq) {
    const answerMatch = faq.content.match(/A:\s*(.+)/);
    if (answerMatch) return answerMatch[1].trim();
  }

  const services = chunks.filter((c) => c.type === "service");
  if (services.length >= 2) {
    const list = services.map((s) => `• ${s.title}`).join("\n");
    return locale === "ar"
      ? `خدماتنا تشمل:\n${list}`
      : `Our services include:\n${list}`;
  }

  if (services.length === 1) {
    return services[0].content.split(".")[0] + ".";
  }

  const contact = chunks.find((c) => c.type === "contact");
  if (contact) {
    return contact.content.split(". ").slice(0, 4).join(". ") + ".";
  }

  const best = chunks[0];
  const sentences = best.content.split(/[.!?؟]/).filter(Boolean);
  return sentences.slice(0, 2).join(". ").trim() + ".";
}

export function respondLocal(
  message: string,
  locale: Lang,
  chunks: KnowledgeChunk[],
  confidence: number
): { answer: string; source: "local" | "fallback" } {
  if (isGreeting(message, locale)) {
    return { answer: GREETINGS[locale], source: "local" };
  }

  const contactChunk = chunks.find((c) => c.type === "contact");
  const pricingChunk = getKnowledgeByLocale(locale).find((c) => c.id.includes("pricing"));
  const contactFromKb = getKnowledgeByLocale(locale).find((c) => c.type === "contact");

  const msgNorm = normalizeText(message, locale);
  const asksServices =
    msgNorm.includes("خدم") ||
    msgNorm.includes("service") ||
    msgNorm.includes("services");
  const asksContact =
    msgNorm.includes("تواصل") ||
    msgNorm.includes("contact") ||
    msgNorm.includes("email") ||
    msgNorm.includes("phone");
  const asksPricing =
    msgNorm.includes("سعر") ||
    msgNorm.includes("اسعار") ||
    msgNorm.includes("price") ||
    msgNorm.includes("pricing") ||
    msgNorm.includes("cost");

  if (asksPricing && pricingChunk) {
    return { answer: pricingChunk.content, source: "local" };
  }

  if (asksContact && (contactChunk || contactFromKb)) {
    const contact = contactChunk ?? contactFromKb!;
    return { answer: contact.content.split(". ").slice(0, 5).join(". ") + ".", source: "local" };
  }

  if (asksServices) {
    const allServices = getKnowledgeByLocale(locale).filter((c) => c.type === "service");
    if (allServices.length > 0) {
      const list = allServices.map((s) => `• ${s.title}`).join("\n");
      return {
        answer: locale === "ar" ? `خدماتنا تشمل:\n${list}` : `Our services include:\n${list}`,
        source: "local",
      };
    }
  }

  if (confidence >= 0.6) {
    return { answer: buildAnswerFromChunks(chunks, locale), source: "local" };
  }

  if (confidence >= 0.25 && chunks.length > 0) {
    const answer = buildAnswerFromChunks(chunks, locale);
    if (answer !== FALLBACK_MESSAGES[locale]) {
      return { answer, source: "local" };
    }
  }

  return { answer: FALLBACK_MESSAGES[locale], source: "fallback" };
}
