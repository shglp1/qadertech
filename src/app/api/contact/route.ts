import { NextResponse } from "next/server";
import type { Lang } from "@/lib/dict";
import {
  submitContactLead,
  isValidPhone,
  formatPhoneForStorage,
  getPhoneValidationError,
} from "@/lib/contactSubmit";

export async function POST(request: Request) {
  try {
    const { name, email, message, phone, locale } = await request.json();
    const lang: Lang = locale === "en" ? "en" : "ar";

    if (!name?.trim()) {
      return NextResponse.json(
        { error: lang === "ar" ? "الاسم مطلوب" : "Name is required" },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        { error: lang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: lang === "ar" ? "البريد الإلكتروني غير صحيح" : "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: lang === "ar" ? "رقم الجوال مطلوب" : "Phone number is required" },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: getPhoneValidationError(lang) },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { error: lang === "ar" ? "الرسالة مطلوبة" : "Message is required" },
        { status: 400 }
      );
    }

    await submitContactLead({
      name: name.trim(),
      email: email.trim(),
      phone: formatPhoneForStorage(phone),
      message: message.trim(),
      source: "contact_form",
      page: "landing",
      locale: lang,
    });

    return NextResponse.json(
      { success: true, message: "Message recorded successfully!" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "CONTACT_WEBHOOK_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: "Server configuration error. Please ensure environment variables are set." },
        { status: 500 }
      );
    }
    if (process.env.NODE_ENV !== "production") {
      console.error("Contact API Error:", error instanceof Error ? error.message : "unknown");
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
