import { dict, type Lang } from "../dict";
import { servicesData } from "../servicesData";
import { contactInfo } from "../contactInfo";

export type KnowledgeType =
  | "company"
  | "service"
  | "faq"
  | "contact"
  | "process"
  | "cta"
  | "footer";

export interface KnowledgeChunk {
  id: string;
  type: KnowledgeType;
  locale: Lang;
  title: string;
  content: string;
  keywords?: string[];
}

function buildKnowledgeBase(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  for (const locale of ["ar", "en"] as const) {
    const d = dict[locale];

    chunks.push({
      id: `company-overview-${locale}`,
      type: "company",
      locale,
      title: locale === "ar" ? "من نحن" : "Who we are",
      content: [
        d.hero.title,
        d.hero.slogan,
        d.hero.subtitle,
        d.about.description1,
        d.about.description2,
        locale === "ar"
          ? "قادر للحلول الرقمية هي الذراع التقني لشركة قادر برودكشن."
          : "QaderTech is the technical arm of the Qader Production ecosystem.",
      ].join(" "),
      keywords: locale === "ar"
        ? ["قادر", "من نحن", "شركة", "قادر برودكشن"]
        : ["qadertech", "who", "company", "qader production"],
    });

    chunks.push({
      id: `process-${locale}`,
      type: "process",
      locale,
      title: d.process.title,
      content: `${d.process.title}: ${d.process.steps.join(" → ")}`,
      keywords: locale === "ar"
        ? ["كيف نشتغل", "عملية", "خطوات", "مشروع", "بداية"]
        : ["process", "how it works", "steps", "project", "start"],
    });

    servicesData[locale].forEach((service, index) => {
      chunks.push({
        id: `service-${index}-${locale}`,
        type: "service",
        locale,
        title: service.title,
        content: `${service.title}. ${service.description} ${service.aeoDefinition}`,
        keywords: locale === "ar"
          ? [service.title, "خدمة", "خدمات"]
          : [service.title, "service", "services"],
      });
    });

    d.faq.questions.forEach((item, index) => {
      chunks.push({
        id: `faq-${index}-${locale}`,
        type: "faq",
        locale,
        title: item.q,
        content: `Q: ${item.q} A: ${item.a}`,
        keywords: [item.q],
      });
    });

    chunks.push({
      id: `contact-${locale}`,
      type: "contact",
      locale,
      title: d.contact.title,
      content: [
        d.contact.subtitle,
        `${locale === "ar" ? "البريد" : "Email"}: ${contactInfo.emails.general}, ${contactInfo.emails.support}`,
        `${locale === "ar" ? "الهاتف" : "Phone"}: ${contactInfo.phone.display}`,
        `${locale === "ar" ? "العنوان" : "Address"}: ${contactInfo.location[locale]}`,
        `${locale === "ar" ? "الموقع" : "Website"}: ${contactInfo.website}`,
        `Instagram: ${contactInfo.social.instagram}`,
        `TikTok: ${contactInfo.social.tiktok}`,
        `X: ${contactInfo.social.x}`,
      ].join(". "),
      keywords: locale === "ar"
        ? ["تواصل", "إيميل", "هاتف", "اتصال", "contact"]
        : ["contact", "email", "phone", "reach"],
    });

    chunks.push({
      id: `cta-${locale}`,
      type: "cta",
      locale,
      title: locale === "ar" ? "ابدأ مشروعك" : "Start your project",
      content: `${d.hero.cta}. ${d.contact.subtitle}`,
    });

    chunks.push({
      id: `footer-${locale}`,
      type: "footer",
      locale,
      title: "Footer",
      content: d.footer.rights,
    });

    // TODO: Add pricing/packages when available on the website
    chunks.push({
      id: `pricing-note-${locale}`,
      type: "faq",
      locale,
      title: locale === "ar" ? "الأسعار" : "Pricing",
      content: locale === "ar"
        ? "لا توجد معلومات عن الأسعار أو الباقات على الموقع حالياً. للاستفسار عن التكلفة، يرجى التواصل مع فريق قادر."
        : "There is no pricing or package information on the website currently. For cost inquiries, please contact the QaderTech team.",
      keywords: locale === "ar"
        ? ["سعر", "أسعار", "تكلفة", "باقات"]
        : ["price", "pricing", "cost", "packages"],
    });
  }

  return chunks;
}

export const qaderBotKnowledge: KnowledgeChunk[] = buildKnowledgeBase();

export function getAllKnowledge(): KnowledgeChunk[] {
  return qaderBotKnowledge;
}

export function getKnowledgeByLocale(locale: Lang): KnowledgeChunk[] {
  return qaderBotKnowledge.filter((chunk) => chunk.locale === locale);
}

export function getKnowledgeContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return "";
  return chunks
    .map((chunk) => `[${chunk.type}] ${chunk.title}: ${chunk.content}`)
    .join("\n\n");
}
