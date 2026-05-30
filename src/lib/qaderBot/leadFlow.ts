import type { Lang } from "../dict";
import { detectContactIntent } from "./intents";
import { isValidPhone, formatPhoneForStorage } from "../contactSubmit";
import {
  mergeLeadData,
  isLeadComplete,
  getLeadSummary,
  isValidEmail,
  extractEmail,
  type ParsedLeadFields,
} from "./parseLeadInput";

export type LeadStep = "message" | "name" | "phone" | "email";

export interface LeadData extends ParsedLeadFields {}

export interface LeadFlowState {
  step: LeadStep;
  data: LeadData;
}

export interface LeadPrefill {
  message?: string;
  name?: string;
  phone?: string;
  email?: string;
}

function getInitialStep(data: LeadData): LeadStep {
  if (!data.message.trim()) return "message";
  if (!data.name.trim()) return "name";
  if (!data.phone.trim()) return "phone";
  return "email";
}

export function createLeadFlow(prefill: string | LeadPrefill = ""): LeadFlowState {
  const data: LeadData =
    typeof prefill === "string"
      ? {
          message: prefill.trim(),
          name: "",
          phone: "",
          email: "",
        }
      : {
          message: prefill.message?.trim() || "",
          name: prefill.name?.trim() || "",
          phone: prefill.phone?.trim() || "",
          email: prefill.email?.trim() || "",
        };

  return {
    step: getInitialStep(data),
    data,
  };
}

export function getDefaultContactMessage(locale: Lang): string {
  return locale === "ar" ? "طلب تواصل" : "Contact request";
}

const SUBSTANTIVE_TOPIC =
  /مشروع|موقع|تطبيق|برمج|ذكاء|artificial|app|website|web|project|service|خدم|سعر|price|تكلف|تصميم|design|store|متجر|dashboard|لوحة|system|نظام|automation|أتمت|bot|بوت|landing|متجر/i;

/** True when the text is only a generic contact phrase with no real request detail */
export function isGenericContactOnly(text: string, locale: Lang): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (trimmed === getDefaultContactMessage(locale)) return true;
  if (SUBSTANTIVE_TOPIC.test(trimmed)) return false;
  if (!detectContactIntent(trimmed, locale)) return false;
  return trimmed.length <= 45;
}

export function resolveLeadPrefill(
  text: string,
  isContactIntent: boolean,
  locale: Lang
): string | LeadPrefill {
  const trimmed = text.trim();
  if (isContactIntent && isGenericContactOnly(trimmed, locale)) {
    return { message: "" };
  }
  return trimmed;
}

export function getContactCollectIntro(locale: Lang): string {
  return locale === "ar"
    ? "تمام، بجمع بياناتك ونرسل طلبك لفريق قادر."
    : "Sure, I'll collect your details and send your request to the team.";
}

export function getLeadStartPrompt(locale: Lang): string {
  return locale === "ar"
    ? "أقدر أرسل طلبك مباشرة لفريق قادر.\n\nوش طلبك أو استفسارك؟"
    : "I can forward your request to the QaderTech team.\n\nWhat would you like to ask or request?";
}

export function getStepPrompt(step: LeadStep, locale: Lang): string {
  const prompts: Record<LeadStep, Record<Lang, string>> = {
    message: {
      ar: "وش طلبك أو استفسارك بالتفصيل؟",
      en: "What is your question or request in detail?",
    },
    name: {
      ar: "تمام. وش اسمك؟",
      en: "Got it. What is your name?",
    },
    phone: {
      ar: "اكتب رقم جوالك (مثل 05XXXXXXXX):",
      en: "What is your mobile number? (e.g. 05XXXXXXXX)",
    },
    email: {
      ar: "وش إيميلك؟",
      en: "What is your email address?",
    },
  };
  return prompts[step][locale];
}

export function getSubmittingPrompt(locale: Lang): string {
  return locale === "ar"
    ? "جاري إرسال طلبك لفريق قادر..."
    : "Sending your request to the QaderTech team...";
}

export function getSuccessPrompt(locale: Lang): string {
  return locale === "ar"
    ? "تم إرسال طلبك بنجاح. فريق قادر بيتواصل معك قريباً."
    : "Your request was sent successfully. The QaderTech team will contact you soon.";
}

export function getPhoneErrorPrompt(locale: Lang): string {
  return locale === "ar"
    ? "الرقم ما يبدو صحيح. اكتبه بهذا الشكل: 05XXXXXXXX"
    : "That number doesn't look valid. Please use this format: 05XXXXXXXX";
}

export function getEmailErrorPrompt(locale: Lang): string {
  return locale === "ar"
    ? "الإيميل ما يبدو صحيح. تأكد من كتابته بشكل صحيح."
    : "That email doesn't look valid. Please check and try again.";
}

export function getCancelPrompt(locale: Lang): string {
  return locale === "ar"
    ? "تم إلغاء الطلب. كيف أقدر أساعدك؟"
    : "Request cancelled. How else can I help you?";
}

const CANCEL_WORDS = ["cancel", "stop", "exit", "الغاء", "إلغاء", "الغ", "وقف"];

export function isCancelMessage(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return CANCEL_WORDS.some((w) => lower === w || lower.includes(w));
}

function resolvePhone(input: string, data: LeadData): string {
  if (data.phone) return data.phone;
  if (isValidPhone(input)) return formatPhoneForStorage(input);
  return "";
}

function resolveEmail(input: string, data: LeadData): string {
  if (data.email) return data.email;
  const extracted = extractEmail(input);
  if (extracted && isValidEmail(extracted)) return extracted;
  const trimmed = input.trim().toLowerCase();
  if (isValidEmail(trimmed)) return trimmed;
  return "";
}

function getNextStep(data: LeadData): LeadStep {
  if (!data.message.trim()) return "message";
  if (!data.name.trim()) return "name";
  if (!data.phone.trim()) return "phone";
  return "email";
}

export function processLeadStep(
  flow: LeadFlowState,
  input: string,
  locale: Lang
): {
  nextFlow: LeadFlowState | null;
  botReply: string | null;
  readyToSubmit: boolean;
  error: boolean;
  summary?: string;
} {
  const trimmed = input.trim();
  let merged = mergeLeadData(flow.data, trimmed, flow.step);

  if (flow.step === "message") {
    const message = merged.message || trimmed;
    if (message.length < 3) {
      return {
        nextFlow: flow,
        botReply:
          locale === "ar"
            ? "اكتب طلبك أو استفسارك بشكل أوضح."
            : "Please describe your request in a bit more detail.",
        readyToSubmit: false,
        error: true,
      };
    }
    if (isGenericContactOnly(message, locale)) {
      return {
        nextFlow: flow,
        botReply:
          locale === "ar"
            ? "وش بالتحديد تبي من فريق قادر؟ اكتب سؤالك أو طلبك بالتفصيل."
            : "What specifically would you like from the QaderTech team? Please describe your request.",
        readyToSubmit: false,
        error: true,
      };
    }
    merged = { ...merged, message };
  }

  if (flow.step === "name") {
    const name = merged.name || (trimmed.length <= 40 ? trimmed : "");
    if (!name || name.length < 2) {
      return {
        nextFlow: flow,
        botReply: locale === "ar" ? "يرجى كتابة اسمك." : "Please enter your name.",
        readyToSubmit: false,
        error: true,
      };
    }
    merged = { ...merged, name };
  }

  if (flow.step === "phone") {
    const phone = resolvePhone(trimmed, merged);
    if (!phone) {
      return {
        nextFlow: { ...flow, data: merged },
        botReply: getPhoneErrorPrompt(locale),
        readyToSubmit: false,
        error: true,
      };
    }
    merged = { ...merged, phone };
  }

  if (flow.step === "email") {
    const email = resolveEmail(trimmed, merged);
    if (!email) {
      return {
        nextFlow: { ...flow, data: merged },
        botReply: getEmailErrorPrompt(locale),
        readyToSubmit: false,
        error: true,
      };
    }
    merged = { ...merged, email };
  }

  if (isLeadComplete(merged)) {
    return {
      nextFlow: { step: flow.step, data: merged },
      botReply: null,
      readyToSubmit: true,
      error: false,
      summary: getLeadSummary(merged, locale),
    };
  }

  const nextStep = getNextStep(merged);
  return {
    nextFlow: { step: nextStep, data: merged },
    botReply: getStepPrompt(nextStep, locale),
    readyToSubmit: false,
    error: false,
  };
}
