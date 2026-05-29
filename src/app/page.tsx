"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactFullpage from "@fullpage/react-fullpage";

import { dict, Lang } from "../lib/dict";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ServicesGrid from "../components/ServicesGrid";
import About from "../components/About";
import Contact from "../components/Contact";
import Logo from "../components/Logo";
import HowItWorks from "../components/HowItWorks";
import FAQ from "../components/FAQ";
import SEO from "../components/SEO";
import QaderBot from "../components/QaderBot";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      onAnimationComplete={onComplete}
    >
      <div className="flex flex-col items-center gap-6">
        <Logo className="w-48 h-auto" />
        <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative mt-8">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-brand-cyan"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  const t = dict[lang];

  return (
    <main className="bg-black min-h-screen text-white overflow-hidden">
      <SEO lang={lang} />
      
      {/* Navigation Bar Component */}
      <Navbar lang={lang} setLang={setLang} />

      <ReactFullpage
        licenseKey={'Gplv3-license-1!'}
        scrollingSpeed={1000}
        navigation={true}
        navigationPosition={lang === 'ar' ? 'left' : 'right'}
        anchors={['hero', 'process', 'services', 'about', 'contact', 'faq', 'footer']}
        credits={{ enabled: false }}
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              
              {/* SECTION 1: HERO */}
              <div className="section p-0">
                <Hero lang={lang} />
              </div>

              {/* SECTION 2: PROCESS */}
              <div className="section relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <HowItWorks lang={lang} />
              </div>

              {/* SECTION 3: BENTO GRID SERVICES */}
              <div className="section">
                <div className="container mx-auto px-6 py-20 flex flex-col justify-center min-h-screen">
                  <div className="mb-16 text-center w-full flex flex-col items-center">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="text-3xl md:text-5xl font-bold mb-4"
                    >
                      {t.services.title}
                    </motion.h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full" />
                  </div>
                  
                  <ServicesGrid lang={lang} />
                </div>
              </div>

              {/* SECTION 4: ABOUT US */}
              <div className="section relative">
                <About lang={lang} />
              </div>

              {/* SECTION 5: CONTACT US */}
              <div className="section">
                <Contact lang={lang} />
              </div>

              {/* SECTION 6: FAQ (AEO & GEO optimized) */}
              <div className="section relative">
                <FAQ lang={lang} />
              </div>

              {/* FOOTER SECTION */}
              <div className="section fp-auto-height">
                <footer className="w-full bg-black py-12 border-t border-white/10 relative overflow-hidden">
                  {/* Subtle Background Glow */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-brand-cyan to-transparent opacity-50" />
                  
                  <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-8">
                    <div className="relative">
                      <Logo />
                    </div>
                    
                    <p className="text-gray-400 text-sm font-light text-center">
                      {t.footer.rights}
                    </p>
                  </div>
                </footer>
              </div>

            </ReactFullpage.Wrapper>
          );
        }}
      />

      {/* Global Bot Component */}
      <QaderBot key={lang} lang={lang} />
    </main>
  );
}
