import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QaderTech | قادر تِك",
  description: "تحول رقمي لرواد الأعمال. حلول تقنية وإبداعية تساعد الأعمال على النمو. خدماتنا تشمل تطوير المواقع، التطبيقات، الذكاء الاصطناعي، وأتمتة الأعمال في السعودية.",
  keywords: ["حلول تقنية بالسعودية", "تحول رقمي لرواد الأعمال", "تطوير تطبيقات", "الذكاء الاصطناعي", "أتمتة الأعمال", "QaderTech", "قادر للحلول الرقمية"],
  openGraph: {
    title: "QaderTech | قادر تِك",
    description: "تحول رقمي لرواد الأعمال. حلول تقنية وإبداعية تساعد الأعمال على النمو.",
    url: 'https://qadertech.com',
    siteName: 'QaderTech',
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "QaderTech | قادر للحلول الرقمية",
    description: "حلول تقنية وإبداعية تساعد الأعمال على النمو والتحول الرقمي",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`h-full antialiased ${poppins.variable}`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
