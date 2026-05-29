import OpenAI from "openai";
import type { Lang } from "../dict";
import { FALLBACK_MESSAGES } from "./respondLocal";

const SYSTEM_PROMPT = `You are QaderBot, the official assistant for QaderTech.
You answer only from the provided QaderTech website context.
You must answer in the same language as the user.
If the user writes Arabic, answer in Arabic.
If the user writes English, answer in English.
Be friendly, professional, and human-like.
Keep answers short and useful (2-4 sentences max).
Do not invent prices.
Do not invent phone numbers.
Do not invent emails.
Do not invent WhatsApp numbers.
Do not invent addresses.
Do not invent social media links.
Do not invent services.
Do not make unsupported claims.
If the user wants to contact the team, speak to a human, or submit a request, tell them you will collect their question and phone number in the chat and send it directly to the team.
If the answer is not available in the provided context, say exactly:
Arabic: "ما عندي معلومات كافية عن هذا الموضوع من بيانات الموقع، لكن أقدر أساعدك بالتواصل مع فريق قادر."
English: "I do not have enough information about that from the website data, but I can help you contact the QaderTech team."`;

function getClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) return null;
  return new OpenAI({ apiKey });
}

export function isOpenAIEnabled(): boolean {
  const provider = process.env.QADERBOT_AI_PROVIDER ?? "openai";
  const hasKey = Boolean(process.env.OPENAI_API_KEY?.trim());
  return provider === "openai" && hasKey;
}

export async function askOpenAI(
  message: string,
  context: string,
  locale: Lang
): Promise<string> {
  const client = getClient();
  if (!client) {
    throw new Error("OpenAI API key not configured");
  }

  const model = process.env.QADERBOT_MODEL || "gpt-4.1-mini";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await client.responses.create(
      {
        model,
        temperature: 0.2,
        max_output_tokens: 300,
        instructions: SYSTEM_PROMPT,
        input: `Context:\n${context || "No specific context found."}\n\nUser question (${locale}):\n${message}`,
      },
      { signal: controller.signal }
    );

    const text = response.output_text?.trim();
    if (!text) {
      throw new Error("Empty OpenAI response");
    }
    return text;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("QaderBot OpenAI error:", error instanceof Error ? error.message : "unknown");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function getFallbackForLocale(locale: Lang): string {
  return FALLBACK_MESSAGES[locale];
}
