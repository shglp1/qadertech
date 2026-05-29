"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";
import { dict, Lang } from "../lib/dict";
import Logo from "./Logo";

interface NavbarProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export default function Navbar({ lang, setLang }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = dict[lang].nav;

  const toggleLang = () => {
    setLang(lang === "ar" ? "en" : "ar");
  };

  const navLinks = [
    { name: t.home, href: "#hero" },
    { name: t.howItWorks, href: "#process" },
    { name: t.services, href: "#services" },
    { name: t.about, href: "#about" },
    { name: t.contact, href: "#contact" },
    { name: t.faq, href: "#faq" }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-4"
    >
      <div className="container mx-auto">
        <div className="glass rounded-full px-4 md:px-6 py-3 flex items-center justify-between border border-white/10 shadow-[0_0_20px_rgba(0,240,255,0.1)] relative z-20">

          {/* Logo */}
          <div className="relative z-30">
            <Logo />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-brand-cyan transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          {/* Actions & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:gap-4 z-30">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-xs md:text-sm font-medium border border-white/10"
            >
              <Globe className="w-4 h-4 text-brand-purple" />
              <span>{lang === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Hamburger Button */}
            <button
              className="md:hidden p-1.5 rounded-full hover:bg-white/10 transition-colors border border-transparent"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-brand-cyan" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-4 right-4 mt-2 bg-[#080808]/98 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.9)] md:hidden z-50 flex flex-col gap-2"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 px-4 rounded-xl hover:bg-white/5 transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
