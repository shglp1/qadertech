import {
  formatPhoneForStorage,
  isValidPhone,
  normalizePhoneInput,
} from "../contactSubmit";

export interface ParsedLeadFields {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

const PHONE_LABEL_REGEX =
  /(?:رقم\s*(?:ال)?(?:جوال|هاتف|موبايل)?|جوالي|هاتفي|هاتف|phone|mobile|tel|whatsapp|واتساب)[:\s]*([+\d][\d\s\-()]{7,20})/gi;

const ARABIC_CONTACT_NOISE = [
  /(?:هذا\s*)?(?:رقم\s*)?(?:ال)?(?:جوال|هاتف|موبايل)[ي]?/gi,
  /(?:وهذا\s*)?(?:ال)?(?:ا?يميل|إ?يميل|email)[ي]?/gi,
  /(?:رقم\s*ال)?(?:جوال|هاتف)/gi,
];

const LOOSE_EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+(?:[.;][a-zA-Z]{2,})?/gi;

export function extractEmail(text: string): string {
  const match = text.match(EMAIL_REGEX);
  if (match) return match[0].toLowerCase();

  const loose = text.match(LOOSE_EMAIL_REGEX);
  if (loose) {
    return loose[0].toLowerCase().replace(";", ".");
  }
  return "";
}

export function extractPhoneFromText(text: string): string {
  const withoutEmail = text.replace(EMAIL_REGEX, " ");

  let match: RegExpExecArray | null;
  const labelRegex = new RegExp(PHONE_LABEL_REGEX.source, "gi");
  while ((match = labelRegex.exec(withoutEmail)) !== null) {
    const candidate = normalizePhoneInput(match[1]);
    const formatted = tryFormatPhone(candidate);
    if (formatted) return formatted;
  }

  const candidates: string[] = [];
  const saudiPatterns = [
    /\+9665\d{8}/g,
    /9665\d{8}/g,
    /05\d{8}/g,
    /\b5\d{8}\b/g,
  ];

  for (const pattern of saudiPatterns) {
    const found = withoutEmail.match(pattern);
    if (found) candidates.push(...found);
  }

  const digitRuns = withoutEmail.match(/\+?\d[\d\s\-()]{8,18}\d/g);
  if (digitRuns) candidates.push(...digitRuns);

  for (const raw of candidates) {
    const formatted = tryFormatPhone(normalizePhoneInput(raw));
    if (formatted) return formatted;
  }

  return "";
}

function tryFormatPhone(raw: string): string {
  if (!raw) return "";
  if (isValidPhone(raw)) return formatPhoneForStorage(raw);

  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 10 && digits.length <= 15) {
    return digits.startsWith("+") ? digits : `+${digits}`;
  }
  return "";
}

export function cleanMessageText(
  text: string,
  email: string,
  phone: string
): string {
  let cleaned = text;

  if (email) {
    cleaned = cleaned.replace(new RegExp(escapeRegex(email), "gi"), " ");
  }

  const looseEmails = text.match(LOOSE_EMAIL_REGEX);
  if (looseEmails) {
    for (const raw of looseEmails) {
      cleaned = cleaned.replace(new RegExp(escapeRegex(raw), "gi"), " ");
    }
  }

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    cleaned = cleaned.replace(new RegExp(escapeRegex(phone), "g"), " ");
    if (digits.length >= 8) {
      cleaned = cleaned.replace(new RegExp(escapeRegex(digits), "g"), " ");
      const withoutLeadingZeros = digits.replace(/^0+/, "");
      if (withoutLeadingZeros.length >= 8) {
        cleaned = cleaned.replace(new RegExp(escapeRegex(withoutLeadingZeros), "g"), " ");
      }
    }
  }

  for (const pattern of ARABIC_CONTACT_NOISE) {
    cleaned = cleaned.replace(pattern, " ");
  }

  cleaned = cleaned.replace(PHONE_LABEL_REGEX, " ");
  cleaned = cleaned.replace(/[+]?[\d][\d\s\-()]{7,18}[\d]/g, " ");
  cleaned = cleaned.replace(/\d{8,15}/g, " ");
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function looksLikeName(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 40) return false;
  if (EMAIL_REGEX.test(trimmed)) return false;
  if (/[\d@+]/.test(trimmed)) return false;
  const words = trimmed.split(/\s+/);
  return words.length <= 4;
}

function messageContainsContactInfo(message: string): boolean {
  return Boolean(extractEmail(message) || extractPhoneFromText(message));
}

/** Parse messy Arabic/English text into structured lead fields */
export function parseLeadText(
  text: string,
  existing: Partial<ParsedLeadFields> = {}
): ParsedLeadFields {
  const combined = [text, existing.message].filter(Boolean).join(" ").trim();

  const email = existing.email || extractEmail(combined);
  const phone = existing.phone || extractPhoneFromText(combined);

  let name = existing.name || "";
  if (!name && looksLikeName(text) && !extractEmail(text) && !extractPhoneFromText(text)) {
    name = text.trim();
  }

  const cleanedFromInput = cleanMessageText(text, email, phone);
  const cleanedFromExisting = existing.message
    ? cleanMessageText(existing.message, email, phone)
    : "";

  let message = "";

  if (existing.message && messageContainsContactInfo(existing.message)) {
    message = cleanedFromExisting;
  } else if (
    existing.message &&
    cleanedFromInput.length >= 3 &&
    !looksLikeName(text)
  ) {
    message = `${existing.message} ${cleanedFromInput}`.replace(/\s+/g, " ").trim();
  } else if (existing.message) {
    message = existing.message.trim();
  } else if (cleanedFromInput.length >= 3) {
    message = cleanedFromInput;
  } else if (text.trim().length >= 3 && !looksLikeName(text)) {
    message = text.trim();
  }

  message = message.replace(/\s+/g, " ").trim();

  return {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    message,
  };
}

const EMAIL_VALIDATION = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_VALIDATION.test(email.trim().toLowerCase());
}

/** Update only the active step field — avoids skipping name/phone during guided flow */
export function mergeLeadData(
  current: ParsedLeadFields,
  input: string,
  step: "message" | "name" | "phone" | "email"
): ParsedLeadFields {
  const trimmed = input.trim();

  if (step === "message") {
    return {
      ...current,
      message: trimmed || current.message,
    };
  }

  if (step === "name") {
    return {
      ...current,
      name: trimmed || current.name,
    };
  }

  if (step === "phone") {
    const extracted = extractPhoneFromText(trimmed);
    const phone =
      extracted ||
      (isValidPhone(trimmed) ? formatPhoneForStorage(trimmed) : "") ||
      current.phone;

    return {
      ...current,
      phone,
    };
  }

  const extracted = extractEmail(trimmed);
  const email = extracted || trimmed.toLowerCase();
  return {
    ...current,
    email: isValidEmail(email) ? email : current.email,
  };
}

export function isLeadComplete(data: ParsedLeadFields): boolean {
  return Boolean(
    data.name.trim() &&
      data.phone.trim() &&
      data.email.trim() &&
      isValidEmail(data.email) &&
      data.message.trim()
  );
}

export function getLeadSummary(data: ParsedLeadFields, locale: "ar" | "en"): string {
  if (locale === "ar") {
    return [
      "قبل ما أرسل طلبك، تأكد من المعلومات:",
      "",
      `الاسم: ${data.name}`,
      `الجوال: ${data.phone}`,
      `الإيميل: ${data.email}`,
      `الطلب: ${data.message}`,
    ].join("\n");
  }
  return [
    "Before I send your request, please confirm these details:",
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Request: ${data.message}`,
  ].join("\n");
}

export function normalizeLeadPayload(input: {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}): ParsedLeadFields {
  const name = input.name?.trim() || "";
  let email = input.email?.trim().toLowerCase() || "";
  let phone = input.phone?.trim() || "";
  let message = input.message?.trim() || "";

  if (phone) {
    phone = formatPhoneForStorage(phone) || tryFormatPhone(normalizePhoneInput(phone));
  }

  if (!phone && message) {
    const extracted = extractPhoneFromText(message);
    if (extracted) phone = formatPhoneForStorage(extracted) || extracted;
  }

  if (!email && message) {
    const extractedEmail = extractEmail(message);
    if (extractedEmail && isValidEmail(extractedEmail)) {
      email = extractedEmail;
    }
  }

  if (message && (email || phone)) {
    const cleaned = cleanMessageText(message, email, phone);
    if (cleaned.length >= 3) message = cleaned;
  }

  if (phone && (phone.includes("@") || /[\u0600-\u06FF]/.test(phone))) {
    phone = "";
  }

  return { name, email, phone, message };
}
