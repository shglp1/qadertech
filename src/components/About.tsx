"use client";

import React from "react";
import { motion } from "framer-motion";
import { dict, Lang } from "../lib/dict";

interface AboutProps {
  lang: Lang;
}

export default function About({ lang }: AboutProps) {
  const t = dict[lang].about;

  return (
    <div className="container mx-auto px-6 py-20 flex flex-col justify-center min-h-screen">
      <div className="mb-16 text-center w-full flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          {t.title}
        </motion.h2>
        <div className="w-20 h-1 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full" />
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Abstract visual representation of QaderTech combining creative and tech */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full min-h-[300px] md:h-[400px] md:flex-1 relative group perspective-[1000px] flex-shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/20 to-brand-purple/20 rounded-3xl border border-white/10 backdrop-blur-md overflow-hidden">
            {/* Animated internal elements */}
            <motion.div 
              className="absolute -top-20 -right-20 w-64 h-64 bg-brand-cyan/30 blur-[80px] rounded-full"
              animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-purple/30 blur-[80px] rounded-full"
              animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-32 h-32 border-4 border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite]" />
               <div className="absolute w-20 h-20 bg-brand-cyan/40 backdrop-blur-xl rounded-lg rotate-45 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                 <div className="w-10 h-10 bg-brand-purple/60 rounded-sm -rotate-45" />
               </div>
            </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <div className={`flex-1 flex flex-col gap-6 text-lg md:text-xl text-gray-300 font-light leading-relaxed ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.description1}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t.description2}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
