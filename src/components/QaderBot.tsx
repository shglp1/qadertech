"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot, Loader2, Phone } from "lucide-react";
import type { Lang } from "../lib/dict";
import { detectLocale } from "../lib/qaderBot/normalize";
import { GREETINGS } from "../lib/qaderBot/respondLocal";
import {
  createLeadFlow,
  getContactCollectIntro,
  getStepPrompt,
  getSubmittingPrompt,
  getSuccessPrompt,
  getCancelPrompt,
  isCancelMessage,
  isGenericContactOnly,
  processLeadStep,
  resolveLeadPrefill,
  type LeadFlowState,
  type LeadPrefill,
} from "../lib/qaderBot/leadFlow";
import { detectContactIntent } from "../lib/qaderBot/intents";
import {
  isAffirmativeMessage,
  isNegativeMessage,
  isPhoneOnlyMessage,
  formatPhoneFromMessage,
  findLastTopicMessage,
  lastBotOfferedContact,
  getAffirmativeStartPrompt,
  getNegativeAckPrompt,
} from "../lib/qaderBot/conversationContext";

interface QaderBotProps {
  lang: Lang;
}

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  dir?: "rtl" | "ltr";
  variant?: "default" | "success" | "error";
}

const UI_TEXT = {
  ar: {
    online: "أونلاين",
    empty: "أرسل رسالة للبدء",
    placeholder: "اكتب رسالتك...",
    placeholderQuestion: "اكتب سؤالك أو طلبك...",
    placeholderName: "اكتب اسمك...",
    placeholderPhone: "05XXXXXXXX",
    error: "تعذر إرسال الرسالة. حاول مرة أخرى.",
    submitError: "تعذر إرسال طلبك. حاول مرة أخرى.",
    typing: "يكتب...",
    contactBtn: "طلب تواصل",
    placeholderEmail: "example@email.com",
  },
  en: {
    online: "Online",
    empty: "Send a message to start",
    placeholder: "Type your message...",
    placeholderQuestion: "Type your question or request...",
    placeholderName: "Type your name...",
    placeholderPhone: "05XXXXXXXX",
    error: "Could not send your message. Please try again.",
    submitError: "Could not send your request. Please try again.",
    typing: "Typing...",
    contactBtn: "Contact team",
    placeholderEmail: "example@email.com",
  },
};

export default function QaderBot({ lang }: QaderBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leadFlow, setLeadFlow] = useState<LeadFlowState | null>(null);
  const [pendingContact, setPendingContact] = useState<{ topic: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = UI_TEXT[lang];
  const isRtl = lang === "ar";
  const positionClass = isRtl ? "right-3 md:right-6" : "left-3 md:left-6";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, leadFlow, scrollToBottom]);

  const addBotMessage = (text: string, variant: ChatMessage["variant"] = "default") => {
    const dir = detectLocale(text) === "ar" ? "rtl" : "ltr";
    setMessages((prev) => [...prev, { role: "bot", text, dir, variant }]);
  };

  const handleToggle = () => {
    if (!isOpen && messages.length === 0) {
      setMessages([
        { role: "bot", text: GREETINGS[lang], dir: lang === "ar" ? "rtl" : "ltr" },
      ]);
    }
    setIsOpen((v) => !v);
  };

  const startLeadFlow = (prefill: string | LeadPrefill = "", botIntro?: string) => {
    const flow = createLeadFlow(prefill);
    setLeadFlow(flow);
    setPendingContact(null);
    if (botIntro) {
      addBotMessage(botIntro);
    }
    addBotMessage(getStepPrompt(flow.step, lang));
    setTimeout(scrollToBottom, 100);
  };

  const beginLeadFromConfirm = (topic: string, prefill: LeadPrefill = {}) => {
    const message = prefill.message || topic;
    if (isGenericContactOnly(message, lang) && !prefill.message?.trim()) {
      startLeadFlow("", getAffirmativeStartPrompt(lang));
      return;
    }
    startLeadFlow({ ...prefill, message }, getAffirmativeStartPrompt(lang));
  };

  const handleContactButton = () => {
    const chatTurns = messages.map((m) => ({ role: m.role, text: m.text }));
    const priorTopic = findLastTopicMessage(chatTurns, lang);

    if (priorTopic && !isGenericContactOnly(priorTopic, lang)) {
      startLeadFlow({ message: priorTopic }, getContactCollectIntro(lang));
      return;
    }

    startLeadFlow("", getContactCollectIntro(lang));
  };

  const submitLead = async (data: LeadFlowState["data"]) => {
    addBotMessage(getSubmittingPrompt(lang));
    setIsLoading(true);

    try {
      const response = await fetch("/api/qaderbot/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          message: data.message,
          locale: lang,
          page: "landing",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        addBotMessage(result.error || t.submitError, "error");
        setLeadFlow({ step: "email", data });
        return;
      }

      addBotMessage(getSuccessPrompt(lang), "success");
      setLeadFlow(null);
    } catch {
      addBotMessage(t.submitError, "error");
      setLeadFlow({ step: "email", data });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadFlowInput = async (trimmed: string) => {
    if (isCancelMessage(trimmed)) {
      setLeadFlow(null);
      addBotMessage(getCancelPrompt(lang));
      return;
    }

    if (!leadFlow) return;

    const messageDir = detectLocale(trimmed) === "ar" ? "rtl" : "ltr";
    setMessages((prev) => [...prev, { role: "user", text: trimmed, dir: messageDir }]);

    const result = processLeadStep(leadFlow, trimmed, lang);

    if (result.summary) {
      addBotMessage(result.summary);
    } else if (result.botReply) {
      addBotMessage(result.botReply, result.error ? "error" : "default");
    }

    if (result.readyToSubmit && result.nextFlow) {
      setLeadFlow(null);
      await submitLead(result.nextFlow.data);
      return;
    }

    if (result.nextFlow) {
      setLeadFlow(result.nextFlow);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");

    if (leadFlow) {
      await handleLeadFlowInput(trimmed);
      return;
    }

    const messageDir = detectLocale(trimmed) === "ar" ? "rtl" : "ltr";
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text: trimmed, dir: messageDir },
    ];
    setMessages(nextMessages);

    const chatTurns = nextMessages.map((m) => ({ role: m.role, text: m.text }));
    const topic =
      pendingContact?.topic ||
      findLastTopicMessage(chatTurns.slice(0, -1), lang) ||
      findLastTopicMessage(chatTurns, lang);

    if (pendingContact && isAffirmativeMessage(trimmed, lang)) {
      beginLeadFromConfirm(pendingContact.topic || topic);
      return;
    }

    if (pendingContact && isNegativeMessage(trimmed, lang)) {
      setPendingContact(null);
      addBotMessage(getNegativeAckPrompt(lang));
      return;
    }

    if (
      isPhoneOnlyMessage(trimmed) &&
      (pendingContact || lastBotOfferedContact(chatTurns.slice(0, -1), lang))
    ) {
      beginLeadFromConfirm(topic, {
        message: topic || (lang === "ar" ? "طلب تواصل" : "Contact request"),
        phone: formatPhoneFromMessage(trimmed),
      });
      return;
    }

    if (
      isAffirmativeMessage(trimmed, lang) &&
      lastBotOfferedContact(chatTurns.slice(0, -1), lang)
    ) {
      beginLeadFromConfirm(topic);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/qaderbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, locale: lang }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      const answerDir = detectLocale(data.answer) === "ar" ? "rtl" : "ltr";
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer, dir: answerDir },
      ]);

      if (data.action === "await_contact_confirm") {
        setPendingContact({
          topic: findLastTopicMessage(
            [...nextMessages, { role: "bot", text: data.answer }],
            lang
          ) || trimmed,
        });
      } else if (data.action === "start_lead_flow" || data.action === "contact_form") {
        const flowTopic = findLastTopicMessage(nextMessages, lang) || trimmed;
        const prefill = resolveLeadPrefill(
          flowTopic,
          detectContactIntent(trimmed, lang),
          lang
        );
        const flow = createLeadFlow(prefill);
        setLeadFlow(flow);
        setPendingContact(null);
        if (flow.step !== "message") {
          addBotMessage(getStepPrompt(flow.step, lang));
        }
      } else {
        setPendingContact(null);
      }
    } catch {
      addBotMessage(t.error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const inputPlaceholder = leadFlow
    ? leadFlow.step === "message"
      ? t.placeholderQuestion
      : leadFlow.step === "name"
        ? t.placeholderName
        : leadFlow.step === "phone"
          ? t.placeholderPhone
          : t.placeholderEmail
    : t.placeholder;

  const inputType =
    leadFlow?.step === "phone" ? "tel" : leadFlow?.step === "email" ? "email" : "text";

  const inputDir =
    leadFlow?.step === "phone" || leadFlow?.step === "email"
      ? "ltr"
      : lang === "ar"
        ? "rtl"
        : "ltr";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-20 md:bottom-28 ${positionClass} z-[9999] w-[calc(100vw-24px)] max-w-[440px] max-h-[75vh] md:max-h-[70vh] flex flex-col rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,255,255,0.15)]`}
          >
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-brand-cyan/40 via-brand-purple/30 to-brand-cyan/40 pointer-events-none" />

            <div className="relative flex flex-col h-full max-h-[75vh] md:max-h-[70vh] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/60 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-cyan to-brand-purple flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white font-english">QaderBot</span>
                    <span className="text-[10px] text-gray-400">
                      {leadFlow
                        ? lang === "ar"
                          ? "جمع بيانات التواصل"
                          : "Collecting contact info"
                        : pendingContact
                          ? lang === "ar"
                            ? "بانتظار تأكيدك"
                            : "Waiting for your reply"
                          : t.online}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleContactButton}
                    disabled={!!leadFlow || isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 hover:border-brand-cyan/40 hover:bg-brand-cyan/10 transition-colors text-gray-300 hover:text-white disabled:opacity-40"
                  >
                    <Phone className="w-3 h-3" />
                    {t.contactBtn}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[50vh] md:max-h-[45vh] scrollbar-thin scrollbar-thumb-white/10">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40 select-none">
                    <Bot className="w-10 h-10 text-brand-cyan" />
                    <p className="text-xs text-gray-500 text-center">{t.empty}</p>
                  </div>
                )}
                {messages.map((msg, i) => {
                  const msgDir = msg.dir ?? (lang === "ar" ? "rtl" : "ltr");
                  const isArabicMsg = msgDir === "rtl";
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        dir={msgDir}
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                          isArabicMsg ? "font-arabic text-right" : "font-english text-left"
                        } ${
                          isUser
                            ? "bg-gradient-to-r from-brand-cyan to-brand-purple text-white rounded-br-sm"
                            : msg.variant === "success"
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-bl-sm"
                              : msg.variant === "error"
                                ? "bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-bl-sm"
                                : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                })}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 text-xs">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>{t.typing}</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-4 py-3 border-t border-white/10 bg-black/40 shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type={inputType}
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, 500))}
                    onKeyDown={handleKeyDown}
                    placeholder={inputPlaceholder}
                    disabled={isLoading}
                    dir={inputDir}
                    maxLength={500}
                    inputMode={
                      leadFlow?.step === "phone"
                        ? "tel"
                        : leadFlow?.step === "email"
                          ? "email"
                          : "text"
                    }
                    className={`flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan/50 transition-colors disabled:opacity-50 ${
                      leadFlow?.step === "phone" || leadFlow?.step === "email"
                        ? "font-mono text-left"
                        : lang === "ar"
                          ? "font-arabic text-right"
                          : "font-english text-left"
                    } ${leadFlow ? "border-brand-cyan/30" : ""}`}
                  />
                  <motion.button
                    whileHover={{ scale: isLoading ? 1 : 1.1 }}
                    whileTap={{ scale: isLoading ? 1 : 0.9 }}
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple shadow-lg hover:shadow-brand-cyan/30 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 text-white" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 ${positionClass} z-[10000] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer group`}
        aria-label="Open QaderBot chat"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-cyan to-brand-purple opacity-80" />
        <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-brand-cyan to-brand-purple opacity-30 animate-ping" />
        <span className="absolute -inset-2 rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 blur-md group-hover:opacity-80 transition-opacity opacity-50" />

        <span className="relative z-10">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    </>
  );
}
