import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/contactInfo";
import { SITE_SECTIONS } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_SECTIONS.map((section) => ({
    url: section.anchor === "hero" ? SITE_URL : `${SITE_URL}/#${section.anchor}`,
    lastModified: new Date(),
    changeFrequency: section.changeFrequency,
    priority: section.priority,
  }));
}
