import { NextResponse } from "next/server";
import type { Lang } from "@/lib/dict";
import { detectLocale } from "@/lib/qaderBot/normalize";
import { retrieveKnowledge } from "@/lib/qaderBot/retrieve";
import { getKnowledgeContext } from "@/lib/qaderBot/knowledge";
import { respondLocal } from "@/lib/qaderBot/respondLocal";
import { askOpenAI, isOpenAIEnabled } from "@/lib/qaderBot/openai";
import { checkRateLimit } from "@/lib/qaderBot/rateLimit";
import {
  detectContactIntent,
  getContactFormPrompt,
  resolveContactAction,
  type QaderBotAction,
} from "@/lib/qaderBot/intents";

const MAX_MESSAGE_LENGTH = 500;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function sanitizeMessage(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_MESSAGE_LENGTH) return trimmed.slice(0, MAX_MESSAGE_LENGTH);
  return trimmed;
}

function parseLocale(raw: unknown, message: string): Lang {
  if (raw === "ar" || raw === "en") return raw;
  return detectLocale(message);
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: rateCheck.retryAfter
            ? { "Retry-After": String(rateCheck.retryAfter) }
            : undefined,
        }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const payload = body as { message?: unknown; locale?: unknown };
    const message = sanitizeMessage(payload.message);
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const locale = parseLocale(payload.locale, message);
    const wantsContact = detectContactIntent(message, locale);

    if (wantsContact) {
      return NextResponse.json({
        answer: getContactFormPrompt(locale),
        source: "local" as const,
        action: "start_lead_flow" as QaderBotAction,
      });
    }

    const retrieval = retrieveKnowledge(message, locale);
    const context = getKnowledgeContext(retrieval.chunks);

    if (isOpenAIEnabled()) {
      try {
        const answer = await askOpenAI(message, context, retrieval.locale);
        const source = "openai" as const;
        return NextResponse.json({
          answer,
          source,
          action: resolveContactAction(message, locale, source, answer),
        });
      } catch {
        const local = respondLocal(
          message,
          retrieval.locale,
          retrieval.chunks,
          retrieval.confidence
        );
        const source = local.source === "fallback" ? ("fallback" as const) : ("local" as const);
        return NextResponse.json({
          answer: local.answer,
          source,
          action: resolveContactAction(message, locale, source, local.answer),
        });
      }
    }

    const local = respondLocal(
      message,
      retrieval.locale,
      retrieval.chunks,
      retrieval.confidence
    );
    return NextResponse.json({
      answer: local.answer,
      source: local.source,
      action: resolveContactAction(message, locale, local.source, local.answer),
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
