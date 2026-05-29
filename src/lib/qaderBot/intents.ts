import type { Lang } from "../dict";
import { normalizeText } from "./normalize";
import {
  detectContactOfferInAnswer,
  detectContactSuggestionInAnswer,
  shouldAwaitContactConfirm,
} from "./conversationContext";

export type QaderBotAction = "none" | "start_lead_flow" | "await_contact_confirm";

/** Strong contact phrases — matched as substrings after normalization */
const CONTACT_PHRASES: Record<Lang, string[]> = {
  ar: [
    "ابي احد يكلمني",
    "أبي أحد يكلمني",
    "ابي احد يتواصل",
    "أبي أحد يتواصل",
    "ابغى تواصل",
    "أبغى تواصل",
    "اريد التواصل",
    "أريد التواصل",
    "كيف أتواصل",
    "كيف اتواصل",
    "تواصل معكم",
    "تواصلو معي",
    "اتصل بي",
    "اتصل معي",
    "كلمني",
    "كلّمني",
    "راسلوني",
    "كلموني",
    "سجلوني",
    "رقم جوالي",
    "رقم الهاتف",
    "اتصلون",
    "طلب تواصل",
    "ارسل طلب",
    "أرسل طلب",
  ],
  en: [
    "contact your team",
    "contact the team",
    "contact qader",
    "get in touch",
    "reach out",
    "call me back",
    "call me",
    "callback",
    "speak to someone",
    "talk to someone",
    "talk to a human",
    "speak to a human",
    "contact me",
    "my phone number",
    "leave my number",
    "send a request",
    "submit a request",
    "how can i contact",
    "how to contact",
  ],
};

/** Single-word signals — only match when paired with contact context words */
const CONTACT_CONTEXT_WORDS: Record<Lang, string[]> = {
  ar: ["تواصل", "اتصل", "كلمني", "جوال", "هاتف", "رقم"],
  en: ["contact", "call", "phone", "callback", "reach"],
};

export function detectContactIntent(message: string, locale: Lang): boolean {
  const normalized = normalizeText(message, locale);

  const phraseLists = [CONTACT_PHRASES[locale], CONTACT_PHRASES[locale === "ar" ? "en" : "ar"]];
  for (const phrases of phraseLists) {
    if (phrases.some((p) => normalized.includes(normalizeText(p, locale)))) {
      return true;
    }
  }

  const words = normalized.split(/\s+/).filter(Boolean);
  const contextWords = [
    ...CONTACT_CONTEXT_WORDS[locale],
    ...CONTACT_CONTEXT_WORDS[locale === "ar" ? "en" : "ar"],
  ].map((w) => normalizeText(w, locale));

  const hasContext = words.some((w) => contextWords.some((c) => w.includes(c) || c.includes(w)));
  const hasProjectIntent =
    normalized.includes("مشروع") ||
    normalized.includes("project") ||
    normalized.includes("ابغى") ||
    normalized.includes("أبغى") ||
    normalized.includes("want");

  if (hasContext && hasProjectIntent) return true;

  return false;
}

export function getContactFormPrompt(locale: Lang): string {
  return locale === "ar"
    ? "أقدر أرسل استفسارك مباشرة لفريق قادر. اكتب سؤالك أو طلبك:"
    : "I can send your request directly to the QaderTech team. What is your question or request?";
}

export function resolveContactAction(
  message: string,
  locale: Lang,
  source: "openai" | "local" | "fallback",
  answer: string
): QaderBotAction {
  if (detectContactIntent(message, locale)) return "start_lead_flow";

  if (shouldAwaitContactConfirm(answer, locale)) return "await_contact_confirm";

  if (source === "fallback" && detectContactSuggestionInAnswer(answer, locale)) {
    return "await_contact_confirm";
  }

  if (
    detectContactOfferInAnswer(answer, locale) ||
    answer.includes("contact the QaderTech team") ||
    answer.includes("التواصل مع فريق قادر")
  ) {
    return "await_contact_confirm";
  }

  return "none";
}
