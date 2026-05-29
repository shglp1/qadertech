import type { Lang } from "../dict";

const TASHKEEL_REGEX = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

export function removeTashkeel(text: string): string {
  return text.replace(TASHKEEL_REGEX, "");
}

export function normalizeArabic(text: string): string {
  return removeTashkeel(text)
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeEnglish(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function normalizeText(text: string, locale?: Lang): string {
  const detected = locale ?? detectLocale(text);
  if (detected === "ar") {
    return normalizeArabic(text);
  }
  return normalizeEnglish(text);
}

export function detectLocale(text: string): Lang {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  if (arabicChars > latinChars) return "ar";
  if (latinChars > 0) return "en";
  return "ar";
}

export function tokenize(text: string, locale?: Lang): string[] {
  const normalized = normalizeText(text, locale);
  return normalized
    .split(/[\s,.!?؛،؟]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}
