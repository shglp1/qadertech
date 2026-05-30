import React from "react";
import type { Lang } from "../lib/dict";
import { buildStructuredDataGraph, getAeoEntitySummary } from "../lib/seo";

interface SEOProps {
  lang: Lang;
}

export default function SEO({ lang }: SEOProps) {
  const structuredData = buildStructuredDataGraph(lang);
  const entitySummary = getAeoEntitySummary(lang);

  return (
    <>
      <p className="aeo-entity-summary sr-only" lang={lang === "ar" ? "ar" : "en"}>
        {entitySummary}
      </p>
      <script
        id="qadertech-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
