import React from "react";
import { motion } from "framer-motion";
import { dict, Lang } from "../lib/dict";

export default function HowItWorks({ lang }: { lang: Lang }) {
  const t = dict[lang];

  return (
    <div id="process" className="container mx-auto px-6 py-16 md:py-24 relative z-10">
      <div className="mb-20 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.process.title}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-brand-cyan to-brand-purple mx-auto rounded-full" />
      </div>

      <div className="relative max-w-3xl mx-auto w-full px-6">
        {/* Vertical Line - Hidden on Mobile to prevent crowding */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-white/10 rounded-full transform -translate-x-1/2 overflow-hidden rtl:right-1/2 rtl:translate-x-1/2">
          <motion.div 
            className="w-full h-full bg-gradient-to-b from-brand-cyan via-brand-purple to-brand-cyan"
            initial={{ y: "-100%" }}
            whileInView={{ y: "0%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>

        <div className="flex flex-col gap-12 items-center justify-center">
          {t.process.steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col md:flex-row items-center justify-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="hidden md:flex w-1/2 justify-center relative">
                {/* Node Point for Desktop */}
                <div className="absolute left-1/2 rtl:right-1/2 transform -translate-x-1/2 rtl:translate-x-1/2 w-6 h-6 rounded-full bg-black border-4 border-brand-cyan z-10 shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
              </div>
              <div className="w-full text-center md:w-1/2 md:px-12 flex justify-center items-center">
                <div className="glass p-6 rounded-2xl inline-block hover:border-brand-purple/50 transition-colors w-full text-center">
                  <span className="text-brand-purple font-mono text-sm block mb-2">0{index + 1}</span>
                  <h4 className="text-xl font-bold text-white">{step}</h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
