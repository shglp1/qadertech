import type { Metadata } from "next";
import { contactInfo, SITE_URL } from "./contactInfo";
import { dict, type Lang } from "./dict";
import { servicesData } from "./servicesData";

export const SEO_CONFIG = {
  siteName: "QaderTech",
  siteNameAr: "قادر للحلول الرقمية",
  siteNameFull: "QaderTech Digital Solutions",
  twitterHandle: "@qadertech",
  ogImage: "/QaderTech.jpg",
  locale: "ar_SA",
  alternateLocale: "en_US",
} as const;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const SITE_SECTIONS = [
  { path: "/", anchor: "hero", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/", anchor: "process", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/", anchor: "services", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/", anchor: "about", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/", anchor: "contact", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/", anchor: "faq", changeFrequency: "monthly" as const, priority: 0.8 },
];

const KNOWS_ABOUT = [
  "Digital Transformation",
  "Web Development",
  "Mobile App Development",
  "Artificial Intelligence",
  "Business Automation",
  "User Experience Design",
  "تحول رقمي",
  "تطوير المواقع",
  "الذكاء الاصطناعي",
  "أتمتة الأعمال",
];

export function getRootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "QaderTech | قادر تِك — حلول رقمية في السعودية",
      template: "%s | QaderTech",
    },
    description:
      "قادر للحلول الرقمية: تطوير مواقع، تطبيقات، ذكاء اصطناعي، وأتمتة أعمال لرواد الأعمال في السعودية. مع قادر، أنت قادر.",
    keywords: [
      "QaderTech",
      "قادر للحلول الرقمية",
      "تطوير مواقع السعودية",
      "شركة برمجة المدينة المنورة",
      "تحول رقمي",
      "ذكاء اصطناعي للأعمال",
      "أتمتة الأعمال",
      "تطوير تطبيقات",
      "web development Saudi Arabia",
      "digital transformation KSA",
    ],
    authors: [{ name: SEO_CONFIG.siteNameFull, url: SITE_URL }],
    creator: SEO_CONFIG.siteNameFull,
    publisher: SEO_CONFIG.siteNameFull,
    category: "technology",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: SEO_CONFIG.siteName,
      title: "QaderTech | قادر تِك — حلول رقمية في السعودية",
      description:
        "حلول تقنية وإبداعية: مواقع، تطبيقات، ذكاء اصطناعي، وأتمتة أعمال لنمو أعمالك في السعودية.",
      locale: SEO_CONFIG.locale,
      alternateLocale: [SEO_CONFIG.alternateLocale],
      images: [
        {
          url: SEO_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: "QaderTech Digital Solutions — قادر للحلول الرقمية",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: SEO_CONFIG.twitterHandle,
      creator: SEO_CONFIG.twitterHandle,
      title: "QaderTech | قادر للحلول الرقمية",
      description:
        "Creative and technical digital solutions for entrepreneurs in Saudi Arabia.",
      images: [SEO_CONFIG.ogImage],
    },
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    other: {
      "geo.region": "SA-03",
      "geo.placename": "Madinah",
      "geo.position": "24.5247;39.5692",
      ICBM: "24.5247, 39.5692",
    },
  };
}

export function buildStructuredDataGraph(lang: Lang) {
  const t = dict[lang];
  const services = servicesData[lang];

  const organization = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SEO_CONFIG.siteNameFull,
    alternateName: [SEO_CONFIG.siteName, SEO_CONFIG.siteNameAr, "قادر تك"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/qaderlogo.svg`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}${SEO_CONFIG.ogImage}`,
    description: t.about.description1,
    email: contactInfo.emails.general,
    telephone: contactInfo.phone.tel,
    areaServed: {
      "@type": "Country",
      name: contactInfo.location.schemaCountry,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: contactInfo.location.schemaCity,
      addressRegion: contactInfo.location.schemaRegion,
      addressCountry: "SA",
    },
    sameAs: [
      contactInfo.social.instagram,
      contactInfo.social.tiktok,
      contactInfo.social.x,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: lang === "ar" ? "خدمة العملاء" : "customer service",
        email: contactInfo.emails.general,
        telephone: contactInfo.phone.tel,
        areaServed: "SA",
        availableLanguage: ["Arabic", "English"],
      },
    ],
    knowsAbout: KNOWS_ABOUT,
  };

  const localBusiness = {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SEO_CONFIG.siteNameFull,
    url: SITE_URL,
    image: `${SITE_URL}${SEO_CONFIG.ogImage}`,
    description: t.about.description2,
    telephone: contactInfo.phone.tel,
    email: contactInfo.emails.general,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: contactInfo.location.schemaCity,
      addressRegion: contactInfo.location.schemaRegion,
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.5247,
      longitude: 39.5692,
    },
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    parentOrganization: { "@id": ORG_ID },
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SEO_CONFIG.siteName,
    alternateName: SEO_CONFIG.siteNameAr,
    description: t.hero.subtitle,
    inLanguage: ["ar-SA", "en-US"],
    publisher: { "@id": ORG_ID },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: t.hero.title,
    description: t.hero.subtitle,
    inLanguage: lang === "ar" ? "ar-SA" : "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#hero-heading", "#hero-subtitle", ".aeo-entity-summary"],
    },
  };

  const serviceList = {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#services-list`,
    name: t.services.title,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.aeoDefinition,
        provider: { "@id": ORG_ID },
        areaServed: "SA",
      },
    })),
  };

  const howTo = {
    "@type": "HowTo",
    "@id": `${SITE_URL}/#process`,
    name: t.process.title,
    description:
      lang === "ar"
        ? "خطوات عمل قادر للحلول الرقمية من فهم الاحتياج حتى الإطلاق والدعم."
        : "QaderTech's process from discovery through launch and ongoing support.",
    step: t.process.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step,
      text: step,
    })),
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: t.faq.questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      localBusiness,
      website,
      webPage,
      serviceList,
      howTo,
      faqPage,
    ],
  };
}

export function getAeoEntitySummary(lang: Lang): string {
  const t = dict[lang];
  const serviceNames = servicesData[lang].map((s) => s.title).join(", ");

  if (lang === "ar") {
    return `${SEO_CONFIG.siteNameAr} (${SEO_CONFIG.siteName}) شركة سعودية في ${contactInfo.location.ar} متخصصة في ${serviceNames}. ${t.about.description1} للتواصل: ${contactInfo.emails.general} | ${contactInfo.phone.display}.`;
  }

  return `${SEO_CONFIG.siteNameFull} is a Saudi digital agency serving ${contactInfo.location.en}, specializing in ${serviceNames}. ${t.about.description1} Contact: ${contactInfo.emails.general} | ${contactInfo.phone.display}.`;
}
