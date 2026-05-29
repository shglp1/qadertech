export const contactInfo = {
  emails: {
    general: "hello@qadertech.com",
    support: "support@qadertech.com",
  },
  phone: {
    display: "+966 56 001 9865",
    tel: "+966560019865",
  },
  website: "https://qadertech.com",
  mapUrl: "https://maps.google.com/?q=Saudi+Arabia",
  // TODO: Add full street address when available
  // TODO: Add WhatsApp number when available
  // TODO: Add business hours when available
  social: {
    instagram: "https://instagram.com/qadertech",
    tiktok: "https://tiktok.com/@qadertech",
    x: "https://x.com/qadertech",
  },
  location: {
    ar: "المدينة المنورة، المملكة العربية السعودية",
    en: "Saudi Arabia",
    // SEO schema uses Madinah — EN dict address is generic; TODO: align EN address with city
    schemaCity: "Madinah",
    schemaRegion: "Al Madinah Province",
    schemaCountry: "Saudi Arabia",
  },
} as const;
