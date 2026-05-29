import { NextResponse } from "next/server";
import type { Lang } from "@/lib/dict";
import {
  getPhoneValidationError,
  submitContactLead,
} from "@/lib/contactSubmit";
import { normalizeLeadPayload, isValidEmail } from "@/lib/qaderBot/parseLeadInput";
import { checkRateLimit } from "@/lib/qaderBot/rateLimit";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, phone, message, email, locale, page } = body as {
      name?: string;
      phone?: string;
      message?: string;
      email?: string;
      locale?: Lang;
      page?: string;
    };

    const lang: Lang = locale === "en" ? "en" : "ar";
    const normalized = normalizeLeadPayload({ name, phone, message, email });

    if (!normalized.name) {
      return NextResponse.json(
        { error: lang === "ar" ? "الاسم مطلوب" : "Name is required" },
        { status: 400 }
      );
    }

    if (!normalized.phone) {
      return NextResponse.json(
        { error: getPhoneValidationError(lang) },
        { status: 400 }
      );
    }

    if (!normalized.message) {
      return NextResponse.json(
        { error: lang === "ar" ? "الرسالة مطلوبة" : "Message is required" },
        { status: 400 }
      );
    }

    if (!normalized.email || !isValidEmail(normalized.email)) {
      return NextResponse.json(
        { error: lang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required" },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") ?? "";

    await submitContactLead({
      name: normalized.name,
      phone: normalized.phone,
      email: normalized.email,
      message: normalized.message.slice(0, 1000),
      source: "qaderbot",
      locale: lang,
      page: page?.trim() || "landing",
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message:
        lang === "ar"
          ? "تم إرسال طلبك بنجاح! فريق قادر بيتواصل معك قريبًا."
          : "Your request was sent successfully! The QaderTech team will contact you soon.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "CONTACT_WEBHOOK_NOT_CONFIGURED"
    ) {
      return NextResponse.json(
        { error: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }
    if (process.env.NODE_ENV !== "production") {
      console.error("QaderBot lead error:", error instanceof Error ? error.message : "unknown");
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
