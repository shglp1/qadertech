"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Globe,
  Terminal,
  Workflow,
  BrainCircuit,
  LayoutTemplate,
  Layers,
  Code2,
  Image as ImageIcon,
  CheckCircle2,
  Server
} from "lucide-react";
import { servicesData } from "../lib/servicesData";
import type { Lang } from "../lib/dict";

interface ServicesGridProps {
  lang: Lang;
}

// --- Micro Apps Components ---

// 1. Business Automation (Workflow Node Builder)
const WorkflowApp = ({ lang }: { lang: Lang }) => {
  return (
    <div className="absolute inset-0 w-full h-full p-4 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
      <div className="relative w-full h-40 flex items-center justify-between px-4 max-w-sm">
        {/* Nodes */}
        <motion.div className="z-10 bg-black border border-white/20 p-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.1)] group-hover:border-brand-cyan transition-colors"
          whileHover={{ scale: 1.05 }}>
          <Globe className="w-4 h-4 text-brand-cyan" />
          <span className="text-[10px] font-mono">Webhook</span>
        </motion.div>

        <motion.div className="z-10 bg-black border border-white/20 p-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.1)] group-hover:border-brand-purple transition-colors"
          whileHover={{ scale: 1.05 }}>
          <Workflow className="w-4 h-4 text-brand-purple" />
          <span className="text-[10px] font-mono">Condition</span>
        </motion.div>

        <motion.div className="z-10 bg-black border border-white/20 p-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.1)] group-hover:border-brand-cyan transition-colors"
          whileHover={{ scale: 1.05 }}>
          <Server className="w-4 h-4 text-brand-cyan" />
          <span className="text-[10px] font-mono">Database</span>
        </motion.div>

        {/* SVG Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <motion.path
            d={lang === 'ar' ? "M280,80 Q200,80 180,80 T80,80" : "M80,80 Q160,80 180,80 T280,80"}
            fill="transparent"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="group-hover:stroke-brand-cyan/50 transition-colors duration-700"
          />
          {/* Animated Packet */}
          <motion.circle
            r="4"
            fill="#00E5FF"
            className="opacity-0 group-hover:opacity-100 drop-shadow-[0_0_8px_#00E5FF]"
            initial={{ offsetDistance: "0%" } as any}
            animate={{ offsetDistance: "100%" } as any}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              offsetPath: lang === 'ar' ? "path('M280,80 Q200,80 180,80 T80,80')" : "path('M80,80 Q160,80 180,80 T280,80')",
            } as any}
          />
        </svg>
      </div>
    </div>
  );
};

// 2. Web Development (Safari Browser)
const SafariBrowserApp = ({ lang }: { lang: Lang }) => {
  const url = "www.qadertech.com/build";
  const [typedUrl, setTypedUrl] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedUrl(url.slice(0, i));
      i = (i + 1) % (url.length + 5);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-x-4 -bottom-10 h-48 bg-[#1E1E1E] rounded-t-xl border border-white/10 overflow-hidden shadow-2xl group-hover:-translate-y-4 transition-transform duration-500 ease-out">
      {/* Browser Chrome */}
      <div className="h-8 bg-[#2D2D2D] border-b border-white/5 flex items-center px-3 rtl:flex-row-reverse">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <div className="mx-auto bg-black/30 rounded px-4 py-0.5 text-[10px] text-gray-400 font-mono flex items-center opacity-50 group-hover:opacity-100 transition-opacity">
          <span>{typedUrl}</span>
          <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>|</motion.span>
        </div>
      </div>
      {/* Browser Content */}
      <div className="p-4 overflow-hidden h-full relative">
        <motion.div
          className="flex flex-col gap-3"
          variants={{
            initial: { y: 0 },
            hover: { y: -40 }
          }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        >
          {/* Skeleton Layout */}
          <div className="h-20 w-full bg-brand-cyan/10 rounded-lg border border-brand-cyan/20 animate-pulse" />
          <div className="flex gap-3">
            <div className="h-24 w-1/3 bg-brand-purple/10 rounded-lg border border-brand-purple/20" />
            <div className="h-24 w-2/3 bg-white/5 rounded-lg border border-white/10" />
          </div>
          <div className="h-20 w-full bg-white/5 rounded-lg border border-white/10" />
        </motion.div>
      </div>
    </div>
  );
};

// 3. Apps & Systems (Terminal)
const TerminalApp = ({ lang }: { lang: Lang }) => {
  return (
    <div className="absolute inset-4 bg-black rounded-lg border border-white/10 overflow-hidden shadow-2xl p-4 font-mono text-xs flex flex-col justify-end group-hover:border-brand-cyan/40 transition-colors">

      {/* Background Chart */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity flex items-end">
        <motion.svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
          <motion.path
            d="M0,50 L10,40 L20,45 L30,20 L40,35 L50,10 L60,25 L70,5 L80,15 L90,2 L100,20 L100,50 Z"
            fill="url(#grad)"
            variants={{
              initial: { y: 50, opacity: 0 },
              hover: { y: 0, opacity: 1 }
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      <div className="z-10">
        <div className="flex gap-2 mb-2 rtl:flex-row-reverse">
          <span className="text-brand-purple">~</span>
          <span className="text-gray-400">./build-system.sh</span>
        </div>
        <div className="text-gray-500 overflow-hidden h-4 rtl:text-right">
          <motion.div
            variants={{
              initial: { opacity: 0 },
              hover: { opacity: 1 }
            }}
          >
            &gt; compiling modules...
          </motion.div>
        </div>
        <div className="flex gap-2 rtl:flex-row-reverse mt-1">
          <span className="text-brand-cyan font-bold opacity-0 group-hover:opacity-100 transition-opacity delay-700">[SUCCESS]</span>
          <span className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity delay-700">System deployed.</span>
          <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="bg-white w-2 h-3 block mt-0.5" />
        </div>
      </div>
    </div>
  );
};

// 4. AI Solutions (Glowing Orb)
const AIOrbApp = ({ lang }: { lang: Lang }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Orb Core */}
      <motion.div
        className="relative w-12 h-12 rounded-full bg-black border-2 border-brand-cyan shadow-[0_0_30px_#00E5FF] flex items-center justify-center z-20"
        variants={{ hover: { scale: 1.2, boxShadow: "0 0 50px #8A2BE2", borderColor: "#8A2BE2" } }}
      >
        <BrainCircuit className="w-6 h-6 text-brand-cyan group-hover:text-white transition-colors" />
      </motion.div>

      {/* Spinning Rings */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border border-dashed border-white/20 z-10"
        variants={{ hover: { rotate: 360, borderColor: "rgba(0, 229, 255, 0.4)" } }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-dashed border-white/10 z-10"
        variants={{ hover: { rotate: -360, borderColor: "rgba(138, 43, 226, 0.4)" } }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Synapses */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 150 + Math.cos(rad) * 24;
          const y1 = 100 + Math.sin(rad) * 24;
          const x2 = 150 + Math.cos(rad) * 100;
          const y2 = 100 + Math.sin(rad) * 100;
          return (
            <motion.line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="url(#synapseGrad)"
              strokeWidth="2"
              variants={{
                initial: { pathLength: 0, opacity: 0 },
                hover: { pathLength: 1, opacity: 0.5 }
              }}
              transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
            />
          )
        })}
        <defs>
          <linearGradient id="synapseGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// 5. Digital Identity & UX (Glass Cards Stack)
const GlassCardsApp = ({ lang }: { lang: Lang }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center perspective-[1000px]">
      <div className="relative w-32 h-40">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-3 shadow-2xl flex flex-col gap-2 overflow-hidden"
            variants={{
              initial: { rotateZ: 0, x: 0, y: 0, opacity: 1 - i * 0.2 },
              hover: {
                rotateZ: (i - 1) * 15,
                x: (i - 1) * 40 * (lang === 'ar' ? -1 : 1),
                y: i * -10,
                borderColor: i === 1 ? "rgba(0, 229, 255, 0.4)" : "rgba(255, 255, 255, 0.2)"
              }
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ zIndex: 3 - i }}
          >
            {/* Fake Content inside cards */}
            <div className="w-full h-1/2 bg-white/10 rounded-md" />
            <div className="w-3/4 h-2 bg-brand-cyan/40 rounded-full" />
            <div className="w-1/2 h-2 bg-brand-purple/40 rounded-full" />

            {/* Glare Effect on top card */}
            {i === 1 && (
              <motion.div
                className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/30 to-transparent -skew-x-12"
                variants={{
                  initial: { x: "-100%" },
                  hover: { x: "200%" }
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 6. Tech & Content Integration (Infinite Marquee)
const MarqueeApp = ({ lang }: { lang: Lang }) => {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-4 overflow-hidden pt-8">
      <motion.div
        className="flex gap-4 w-max"
        variants={{
          initial: { x: "0%" },
          hover: { x: "-50%", scale: 1.05 }
        }}
        animate="initial"
        whileHover="hover"
        transition={{
          x: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.3 }
        }}
      >
        {/* Duplicate items for infinite scroll effect */}
        {[...Array(2)].map((_, idx) => (
          <React.Fragment key={idx}>
            <div className="w-32 h-20 bg-brand-purple/20 rounded-lg border border-brand-purple/40 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="text-brand-purple/60 w-8 h-8" />
            </div>
            <div className="w-40 h-20 bg-[#1E1E1E] rounded-lg border border-white/10 p-2 flex flex-col justify-center gap-1 flex-shrink-0">
              <div className="h-1.5 w-1/2 bg-brand-cyan/40 rounded" />
              <div className="h-1.5 w-3/4 bg-white/20 rounded" />
              <div className="h-1.5 w-1/4 bg-white/20 rounded" />
            </div>
            <div className="w-24 h-20 bg-brand-cyan/20 rounded-lg border border-brand-cyan/40 flex items-center justify-center flex-shrink-0">
              <Code2 className="text-brand-cyan/60 w-8 h-8" />
            </div>
          </React.Fragment>
        ))}
      </motion.div>

      {/* Reverse Marquee */}
      <motion.div
        className="flex gap-4 w-max"
        variants={{
          initial: { x: "-50%" },
          hover: { x: "0%", scale: 1.05 }
        }}
        animate="initial"
        whileHover="hover"
        transition={{
          x: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.3 }
        }}
      >
        {[...Array(2)].map((_, idx) => (
          <React.Fragment key={idx}>
            <div className="w-40 h-20 bg-[#1E1E1E] rounded-lg border border-white/10 p-2 flex flex-col justify-center gap-1 flex-shrink-0">
              <div className="h-1.5 w-full bg-brand-purple/40 rounded" />
              <div className="h-1.5 w-2/3 bg-white/20 rounded" />
            </div>
            <div className="w-24 h-20 bg-brand-cyan/20 rounded-lg border border-brand-cyan/40 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-mono text-brand-cyan/80">&lt;/&gt;</span>
            </div>
            <div className="w-32 h-20 bg-brand-purple/20 rounded-lg border border-brand-purple/40 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="text-brand-purple/60 w-8 h-8" />
            </div>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};


// --- Main Grid Component ---

export default function ServicesGrid({ lang }: ServicesGridProps) {
  const content = servicesData[lang];

  // Map each service to its specific micro-app
  const microApps = [
    WorkflowApp,       // Business Automation
    SafariBrowserApp,  // Web Development
    TerminalApp,       // Apps & Systems
    AIOrbApp,          // AI Solutions
    GlassCardsApp,     // Digital Identity
    MarqueeApp         // Tech & Content
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[320px]">
      {content.map((item, index) => {
        const AppFeature = microApps[index];

        return (
          <motion.div
            key={index}
            initial="initial"
            whileHover="hover"
            className="relative rounded-3xl p-6 flex flex-col gap-4 overflow-hidden group bg-gradient-to-b from-[#111111] to-[#050505] border border-white/10 hover:border-brand-cyan/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-500 cursor-pointer"
          >
            {/* Top Content Layer (Text) */}
            <div className="relative z-30 pointer-events-none flex flex-col w-full items-start text-start">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md">{item.title}</h3>
              <p className="text-sm md:text-base text-gray-400 font-light max-w-[85%] drop-shadow-md leading-relaxed">{item.description}</p>
              {/* Screen-reader only definition for AEO parsing */}
              <div className="sr-only" dangerouslySetInnerHTML={{ __html: item.aeoDefinition }} />
              {/* Service Schema */}
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item.schema) }} />
            </div>

            {/* Background / Interactive Micro-App Layer */}
            <div className="absolute inset-0 z-20 mt-20 pointer-events-none group-hover:pointer-events-auto">
              {AppFeature && <AppFeature lang={lang} />}
            </div>

            {/* Ambient Background Glow */}
            <div className={`absolute ${lang === 'ar' ? '-left-20' : '-right-20'} -bottom-20 w-60 h-60 bg-brand-purple/10 blur-[60px] rounded-full group-hover:bg-brand-cyan/20 transition-colors duration-700 z-10`} />
          </motion.div>
        );
      })}
    </div>
  );
}
