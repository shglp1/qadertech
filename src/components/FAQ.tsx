"use client";

import React, { useState, useId } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { dict, Lang } from "../lib/dict";

interface FAQProps {
  lang: Lang;
}

export default function FAQ({ lang }: FAQProps) {
  const t = dict[lang].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div id="faq" className="container mx-auto px-6 py-16 md:py-24">
      <div className="mb-16 text-center w-full flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
          {t.title}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full mb-10" />
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <dl className="space-y-4">
          {t.questions.map((item, index) => {
            const isOpen = openIndex === index;
            const questionId = `${baseId}-faq-q-${index}`;
            const answerId = `${baseId}-faq-a-${index}`;

            return (
              <div
                key={index}
                className={`bg-[#111111] border rounded-2xl overflow-hidden transition-colors ${
                  isOpen ? "border-brand-cyan/40" : "border-white/10 hover:border-brand-cyan/30"
                }`}
              >
                <dt>
                  <button
                    type="button"
                    id={questionId}
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="w-full text-left rtl:text-right px-6 py-5 flex items-center justify-between gap-4 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 rounded-2xl"
                  >
                    <span className="text-lg md:text-xl font-bold text-white flex items-center gap-3 flex-1">
                      <span className="text-brand-purple font-mono text-sm shrink-0" aria-hidden="true">
                        0{index + 1}
                      </span>
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 text-gray-400 group-hover:text-brand-cyan transition-colors"
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.span>
                  </button>
                </dt>
                <motion.dd
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  aria-hidden={!isOpen}
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-0 text-gray-400 leading-relaxed font-light border-t border-white/5 mx-6 mb-4 mt-0 pt-4">
                    {item.a}
                  </div>
                </motion.dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
