export type Lang = "ar" | "en";

export interface ServiceItem {
  title: string;
  description: string;
  aeoDefinition: string;
  schema: Record<string, unknown>;
}

export const servicesData: Record<Lang, ServiceItem[]> = {
  ar: [
    {
      title: "أتمتة الشغل",
      description: "نحوّل المهام الروتينية لعمليات تلقائية توفّر وقتك وترفع إنتاجية فريقك.",
      aeoDefinition: "أتمتة الأعمال هي تحويل المهام الروتينية في أعمالك لعمليات آلية سريعة بدون أخطاء بشرية، مما يزيد كفاءة فريقك.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "أتمتة الأعمال", provider: { "@type": "Organization", name: "QaderTech" } },
    },
    {
      title: "تطوير المواقع",
      description: "نصمم ونطوّر مواقع سريعة، متجاوبة، ومهيّأة لمحركات البحث عشان تعزّز حضورك الرقمي.",
      aeoDefinition: "تطوير المواقع الإلكترونية مع قادر يشمل برمجة مواقع سريعة ومتجاوبة ومحسنة لمحركات البحث (SEO) لزيادة المبيعات والوصول.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "تطوير المواقع الإلكترونية", provider: { "@type": "Organization", name: "QaderTech" } },
    },
    {
      title: "تطوير التطبيقات والأنظمة",
      description: "نبرمج تطبيقات ذكية وأنظمة مخصصة تدير علاقاتك مع عملاءك وتتحكم في أعمالك بكفاءة عالية.",
      aeoDefinition: "نحن نبرمج تطبيقات جوال وأنظمة تشغيل مخصصة تساعدك في إدارة المبيعات وعلاقات العملاء بكل سهولة.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "تطوير التطبيقات والأنظمة", provider: { "@type": "Organization", name: "QaderTech" } },
    },
    {
      title: "حلول الذكاء الاصطناعي",
      description: "ندمج أدوات الذكاء الاصطناعي مثل الشات بوت وتحليل البيانات عشان نحسّن تجربة عملاءك.",
      aeoDefinition: "حلول الذكاء الاصطناعي من قادر تشمل روبوتات المحادثة (شات بوت) وتحليل البيانات الضخمة للتنبؤ باحتياجات السوق.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "حلول الذكاء الاصطناعي", provider: { "@type": "Organization", name: "QaderTech" } },
    },
    {
      title: "الهوية الرقمية وتجربة المستخدم",
      description: "نصمم واجهات احترافية ومسارات مستخدم تضمن تجربة تفاعلية مريحة وجذابة.",
      aeoDefinition: "تحسين تجربة المستخدم وتصميم واجهات المستخدم (UI/UX) الاحترافية تضمن بقاء عملائك وقت أطول وتفاعلهم مع خدماتك.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "تجربة المستخدم", provider: { "@type": "Organization", name: "QaderTech" } },
    },
    {
      title: "التكامل بين التقنية والمحتوى",
      description: "نربط بين الحلول التقنية المتقدمة والمحتوى الإبداعي عشان ننتج أعمال متكاملة.",
      aeoDefinition: "ندمج الحلول التقنية المتطورة مع المحتوى الإبداعي والتسويق الرقمي لتكون واجهتك الرقمية فعالة وجذابة.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "التكامل التقني", provider: { "@type": "Organization", name: "QaderTech" } },
    },
  ],
  en: [
    {
      title: "Business Automation",
      description: "Transforming routine tasks into automated processes that save time and increase your team's productivity.",
      aeoDefinition: "Business automation transforms your daily routine tasks into fast, error-free automated processes to boost team efficiency.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "Business Automation", provider: { "@type": "Organization", name: "QaderTech" } },
    },
    {
      title: "Web Development",
      description: "We design and develop fast, responsive, and SEO-optimized websites to enhance your digital presence.",
      aeoDefinition: "Web development with Qader includes programming fast, responsive, and SEO-optimized sites to increase sales and reach.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "Web Development", provider: { "@type": "Organization", name: "QaderTech" } },
    },
    {
      title: "App & System Development",
      description: "Programming smart apps and custom systems to manage customer relationships and control your business efficiently.",
      aeoDefinition: "We program custom mobile apps and operating systems that help you manage sales and customer relationships with ease.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "App Development", provider: { "@type": "Organization", name: "QaderTech" } },
    },
    {
      title: "AI Solutions",
      description: "Integrating AI tools like chatbots and data analysis to improve your customer experience.",
      aeoDefinition: "Qader's AI solutions include chatbots and big data analysis to predict market needs and enhance customer experience.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "AI Solutions", provider: { "@type": "Organization", name: "QaderTech" } },
    },
    {
      title: "Digital Identity & UX",
      description: "Designing professional interfaces and user journeys that ensure a comfortable and engaging interactive experience.",
      aeoDefinition: "UX optimization and professional UI design ensure your customers stay longer and interact more with your services.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "UX Design", provider: { "@type": "Organization", name: "QaderTech" } },
    },
    {
      title: "Tech & Content Integration",
      description: "Seamless connection between advanced technical solutions and creative content to produce integrated work.",
      aeoDefinition: "We blend advanced technical solutions with creative content and digital marketing so your digital front is effective and engaging.",
      schema: { "@context": "https://schema.org", "@type": "Service", name: "Tech Integration", provider: { "@type": "Organization", name: "QaderTech" } },
    },
  ],
};
