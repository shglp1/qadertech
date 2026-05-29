import type { Lang } from "../dict";
import { isValidPhone, formatPhoneForStorage, normalizePhoneInput } from "../contactSubmit";
import { normalizeText } from "./normalize";
import { extractPhoneFromText } from "./parseLeadInput";

const AFFIRMATIVE: Record<Lang, string[]> = {
  ar: [
    "نعم",
    "ايه",
    "اي",
    "ايوه",
    "أيوه",
    "آه",
    "اه",
    "تمام",
    "موافق",
    "اوك",
    "اوكي",
    "ok",
    "yes",
    "yeah",
    "yep",
    "sure",
    "يلا",
    "زين",
    "طيب",
    "ماشي",
    "الله",
    "اكيد",
    "أكيد",
  ],
  en: ["yes", "yeah", "yep", "sure", "ok", "okay", "please", "go ahead", "do it"],
};

const NEGATIVE: Record<Lang, string[]> = {
  ar: ["لا", "لأ", "مو", "ما ابي", "ما ابي", "لا شكرا", "لا شكراً", "مش الان", "مش الآن"],
  en: ["no", "nope", "not now", "no thanks", "later"],
};

const GREETING: Record<Lang, string[]> = {
  ar: ["السلام", "سلام", "مرحب", "اهلا", "أهلا", "هلا", "صباح", "مساء"],
  en: ["hi", "hello", "hey", "good morning", "good evening"],
};

const CONTACT_OFFER: Record<Lang, string[]> = {
  ar: [
    "هل تحب",
    "هل تود",
    "هل تريد",
    "هل تبغى",
    "هل تبغي",
    "هل تحب ان",
    "هل تود ان",
    "هل تريد ان",
    "ممكن تعطيني",
    "اعطيني سؤالك",
    "أعطيني سؤالك",
    "ارسل لهم",
    "أرسل لهم",
    "اجمع سؤالك",
    "أجمع سؤالك",
    "تحب ارسل",
    "تود ان ارسل",
  ],
  en: [
    "would you like",
    "do you want",
    "shall i send",
    "can i send",
    "give me your question",
    "collect your question",
    "forward your request",
  ],
};

const CONTACT_SUGGESTION: Record<Lang, string[]> = {
  ar: [
    "فريق قادر",
    "تواصل مع فريق",
    "التواصل مع فريق",
    "ارسل طلبك",
    "أرسل طلبك",
    "ازودوك بالتفاصيل",
    "يتواصلوا معك",
    "يتواصل معك",
    "بحولهم",
    "بحوّلهم",
    "فريق الدعم",
  ],
  en: [
    "qadertech team",
    "contact the team",
    "contact the qadertech team",
    "forward your request",
    "reach out to you",
    "support team",
  ],
};

function matchesWordList(text: string, locale: Lang, list: Record<Lang, string[]>): boolean {
  const normalized = normalizeText(text, locale);
  const words = normalized.split(/\s+/).filter(Boolean);
  const candidates = [...list[locale], ...list[locale === "ar" ? "en" : "ar"]].map((w) =>
    normalizeText(w, locale)
  );

  if (candidates.includes(normalized)) return true;

  return words.length <= 3 && words.every((w) => candidates.some((c) => w === c || w.startsWith(c)));
}

export function isAffirmativeMessage(message: string, locale: Lang): boolean {
  return matchesWordList(message, locale, AFFIRMATIVE);
}

export function isNegativeMessage(message: string, locale: Lang): boolean {
  return matchesWordList(message, locale, NEGATIVE);
}

export function isGreetingMessage(message: string, locale: Lang): boolean {
  const normalized = normalizeText(message, locale);
  const patterns = [...GREETING[locale], ...GREETING[locale === "ar" ? "en" : "ar"]];
  return patterns.some((p) => normalized.includes(normalizeText(p, locale)));
}

export function isPhoneOnlyMessage(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed) return false;
  if (isValidPhone(trimmed)) return true;
  const extracted = extractPhoneFromText(trimmed);
  if (!extracted) return false;
  const withoutPhone = trimmed.replace(/[\d\s\-+()]/g, "").trim();
  return withoutPhone.length <= 3;
}

export function formatPhoneFromMessage(message: string): string {
  if (isValidPhone(message)) return formatPhoneForStorage(message);
  const extracted = extractPhoneFromText(message);
  if (extracted) return extracted;
  return formatPhoneForStorage(normalizePhoneInput(message));
}

export function detectContactOfferInAnswer(answer: string, locale: Lang): boolean {
  const normalized = normalizeText(answer, locale);
  const offers = [...CONTACT_OFFER[locale], ...CONTACT_OFFER[locale === "ar" ? "en" : "ar"]];
  return offers.some((p) => normalized.includes(normalizeText(p, locale)));
}

export function detectContactSuggestionInAnswer(answer: string, locale: Lang): boolean {
  const normalized = normalizeText(answer, locale);
  const suggestions = [
    ...CONTACT_SUGGESTION[locale],
    ...CONTACT_SUGGESTION[locale === "ar" ? "en" : "ar"],
  ];
  return suggestions.some((p) => normalized.includes(normalizeText(p, locale)));
}

export function shouldAwaitContactConfirm(answer: string, locale: Lang): boolean {
  if (detectContactOfferInAnswer(answer, locale)) return true;
  if (detectContactSuggestionInAnswer(answer, locale) && answer.includes("?")) return true;
  if (detectContactSuggestionInAnswer(answer, locale) && detectContactOfferInAnswer(answer, locale)) {
    return true;
  }
  return false;
}

export function getAffirmativeStartPrompt(locale: Lang): string {
  return locale === "ar"
    ? "تمام، بجمع بياناتك ونرسل طلبك لفريق قادر."
    : "Sure, I'll collect your details and send your request to the team.";
}

export function getNegativeAckPrompt(locale: Lang): string {
  return locale === "ar"
    ? "تمام، إذا احتجت أي شي ثاني أنا هنا."
    : "No problem. I'm here if you need anything else.";
}

export interface ChatTurn {
  role: "user" | "bot";
  text: string;
}

export function findLastTopicMessage(messages: ChatTurn[], locale: Lang): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "user") continue;
    const text = messages[i].text.trim();
    if (!text || text.length < 4) continue;
    if (isAffirmativeMessage(text, locale)) continue;
    if (isNegativeMessage(text, locale)) continue;
    if (isPhoneOnlyMessage(text)) continue;
    if (isGreetingMessage(text, locale)) continue;
    return text;
  }
  return "";
}

export function lastBotOfferedContact(messages: ChatTurn[], locale: Lang): boolean {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "bot") continue;
    const text = messages[i].text;
    if (shouldAwaitContactConfirm(text, locale)) return true;
    if (detectContactSuggestionInAnswer(text, locale)) return true;
    break;
  }
  return false;
}
