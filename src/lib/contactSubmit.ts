import type { Lang } from "./dict";

export interface ContactPayload {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  source?: string;
  locale?: Lang;
  page?: string;
  userAgent?: string;
}

/** Strip spaces, dashes, parentheses — keep leading + if present. */
export function normalizePhoneInput(phone: string): string {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^\d]/g, "");
  return hasPlus ? `+${digits}` : digits;
}

/**
 * Accepts Saudi mobile formats:
 * 05XXXXXXXX | 5XXXXXXXX | 9665XXXXXXXX | +9665XXXXXXXX
 * Returns canonical storage format: +9665XXXXXXXX
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = normalizePhoneInput(phone);
  return /^(05\d{8}|5\d{8}|9665\d{8}|\+9665\d{8})$/.test(cleaned);
}

export function formatPhoneForStorage(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed || trimmed.includes("@") || /[\u0600-\u06FFa-zA-Z]/.test(trimmed.replace(/^\+/, ""))) {
    return "";
  }

  const cleaned = normalizePhoneInput(trimmed);

  if (/^05\d{8}$/.test(cleaned)) {
    return `+966${cleaned.slice(1)}`;
  }
  if (/^5\d{8}$/.test(cleaned)) {
    return `+966${cleaned}`;
  }
  if (/^9665\d{8}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  if (/^\+9665\d{8}$/.test(cleaned)) {
    return cleaned;
  }

  const digits = cleaned.replace(/\D/g, "");
  if (/^9665\d{8}$/.test(digits)) {
    return `+${digits}`;
  }

  return "";
}

export function getPhoneValidationError(locale: Lang): string {
  return locale === "ar"
    ? "يرجى إدخال رقم جوال سعودي صحيح (مثل: 05XXXXXXXX أو +9665XXXXXXXX)"
    : "Please enter a valid Saudi mobile number (e.g. 05XXXXXXXX or +9665XXXXXXXX)";
}

function buildWebhookPayload(payload: ContactPayload): Record<string, string> {
  return {
    timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" }),
    name: payload.name.trim(),
    email: payload.email?.trim().toLowerCase() || "",
    phone: payload.phone ? formatPhoneForStorage(payload.phone) : "",
    message: payload.message.trim(),
    source: payload.source || "website",
    locale: payload.locale || "",
    page: payload.page || "landing",
    userAgent: payload.userAgent ? payload.userAgent.slice(0, 200) : "",
  };
}

export async function submitContactLead(payload: ContactPayload): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.includes("XXXXX_YOUR_APPS_SCRIPT_URL_HERE_XXXXX")) {
    throw new Error("CONTACT_WEBHOOK_NOT_CONFIGURED");
  }

  const body = buildWebhookPayload(payload);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Webhook responded with status: ${response.status}`);
  }
}

/** @deprecated Use normalizePhoneInput — kept for internal compatibility */
export function normalizePhone(phone: string): string {
  return formatPhoneForStorage(phone);
}
