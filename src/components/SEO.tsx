import React from 'react';
import { dict, Lang } from '../lib/dict';
import { SITE_URL } from '../lib/contactInfo';

interface SEOProps {
  lang: Lang;
}

export default function SEO({ lang }: SEOProps) {
  const t = dict[lang].faq;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "QaderTech Digital Solutions | قادر تك للحلول الرقمية",
    "url": SITE_URL,
    "logo": `${SITE_URL}/qaderlogo.svg`,
    "description": "حلول تقنية وإبداعية تساعد الأعمال على النمو والتحول الرقمي",
    "areaServed": {
      "@type": "Country",
      "name": "Saudi Arabia",
      "containedInPlace": {
        "@type": "City",
        "name": "Madinah"
      }
    }
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "QaderTech Digital Solutions",
    "image": `${SITE_URL}/qaderlogo.svg`,
    "description": "Tech agency specializing in AI, business automation, and digital transformation for entrepreneurs in KSA, built by a team with a background in leading tech competitions.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Madinah",
      "addressRegion": "Al Madinah Province",
      "addressCountry": "SA"
    }
  };

  const knowledgeGraphSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": `${SITE_URL}/`,
    "name": "QaderTech",
    "about": [
      {
        "@type": "Thing",
        "name": "Digital Transformation",
        "alternateName": "تحول رقمي"
      },
      {
        "@type": "Thing",
        "name": "Artificial Intelligence",
        "alternateName": "الذكاء الاصطناعي"
      }
    ]
  };

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": t.questions.map(q => ({
      "@type": "Question",
      "name": q.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.a
      }
    }))
  };

  return (
    <>
      <script id="org-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script id="prof-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }} />
      <script id="kg-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(knowledgeGraphSchema) }} />
      <script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
    </>
  );
}
