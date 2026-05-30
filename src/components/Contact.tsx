"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { dict, Lang } from "../lib/dict";
import { contactInfo } from "../lib/contactInfo";
import FooterDock from "./FooterDock";

interface ContactProps {
  lang: Lang;
}

export default function Contact({ lang }: ContactProps) {
  const t = dict[lang].contact;

  // 1. Form States
  const [formData, setFormData] = React.useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  // 2. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, locale: lang }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
        // Automatically return to idle state after 5 seconds to allow sending another message
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setErrorMessage(
          data.error || 
          (lang === "ar" ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." : "Something went wrong. Please try again.")
        );
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        lang === "ar" 
          ? "تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت." 
          : "Could not connect to the server. Please check your internet connection."
      );
    }
  };

  return (
    <div id="contact" className="container mx-auto px-6 py-16 md:py-20 flex flex-col justify-center md:min-h-screen">
      <div className="mb-16 text-center w-full flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          {t.title}
        </motion.h2>
        <div className="w-20 h-1 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full" />
        <p className="mt-4 text-gray-400 max-w-2xl text-center">{t.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto w-full">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-8"
        >
          <div className="glass p-8 rounded-3xl border border-white/10 hover:border-brand-purple/50 transition-colors h-full flex flex-col gap-8">
            <h3 className="text-2xl font-bold text-white">{t.info}</h3>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-cyan/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-brand-cyan" />
              </div>
              <div className="mt-2 text-gray-300 flex flex-col">
                <a href={`mailto:${contactInfo.emails.general}`} className="hover:text-brand-cyan transition-colors duration-300">
                  {contactInfo.emails.general}
                </a>
                <a href={`mailto:${contactInfo.emails.support}`} className="hover:text-brand-cyan transition-colors duration-300">
                  {contactInfo.emails.support}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-brand-purple" />
              </div>
              <div className="mt-2 text-gray-300 font-mono">
                <a href={`tel:${contactInfo.phone.tel}`} className="hover:text-brand-purple transition-colors duration-300">
                  {contactInfo.phone.display}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-cyan/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-brand-cyan" />
              </div>
              <div className="mt-2 text-gray-300">
                <a 
                  href={contactInfo.mapUrl}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand-cyan transition-colors duration-300"
                >
                  {t.address}
                </a>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-white/10 flex justify-center">
              <FooterDock />
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: lang === 'ar' ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1"
        >
          <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border border-white/10 flex flex-col gap-6">
            
            {/* Success/Error Alerts */}
            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium overflow-hidden"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    {lang === "ar"
                      ? "تم إرسال رسالتك بنجاح! سنتواصل معك في أقرب وقت."
                      : "Your message has been sent successfully! We will contact you soon."}
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium overflow-hidden"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">{t.name}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                placeholder={t.name}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">{t.email}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple transition-colors"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">{t.phone}</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple transition-colors font-mono"
                placeholder={t.phonePlaceholder}
                dir="ltr"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">{t.message}</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors resize-none"
                placeholder={t.message}
              />
            </div>

            <motion.button
              whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
              whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
              type="submit"
              disabled={status === "loading"}
              className="relative group mt-4 w-full py-4 rounded-xl font-bold text-white overflow-hidden shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-cyan bg-[length:200%_auto] animate-[gradient_2s_linear_infinite]" />
              <span className="absolute inset-[2px] bg-black rounded-[10px] z-0 group-hover:bg-[#111] transition-colors" />
              <span className="absolute inset-0 bg-brand-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity z-0 duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
                {status === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{lang === "ar" ? "جاري الإرسال..." : "Sending..."}</span>
                  </>
                ) : (
                  <>
                    <span>{t.send}</span>
                    <Send className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </>
                )}
              </span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
