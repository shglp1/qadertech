"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBeam } from "./ui/animated-beam";
import { dict, Lang } from "../lib/dict";

// ---------------------------------------------------------------------------
// Node Configuration (Multilingual)
// ---------------------------------------------------------------------------
const getNodes = (lang: Lang) => ({
  a: {
    label: lang === "ar" ? "العميل" : "Client",
    tooltip: lang === "ar" ? "تحديد الاحتياجات الرقمية" : "Digital Needs Identification",
    tooltipSub: lang === "ar" ? "Input" : "Input",
  },
  b: {
    label: lang === "ar" ? "المحرك" : "The Engine",
    tooltip: lang === "ar" ? "تطوير الحلول المتكاملة" : "Integrated Solutions Development",
    tooltipSub: lang === "ar" ? "Digital Engineering" : "Digital Engineering",
  },
  c: {
    label: lang === "ar" ? "التسليم" : "Delivery",
    tooltip: lang === "ar" ? "تحويل الرؤية إلى واقع" : "Turning Vision into Reality",
    tooltipSub: lang === "ar" ? "Final Solution" : "Final Solution",
  },
});

// ---------------------------------------------------------------------------
// Workflow Node Icons (SVG)
// ---------------------------------------------------------------------------

/** Node A — User / Discovery */
const UserIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-colors duration-700 ${active ? "text-brand-cyan" : "text-gray-600"}`}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/** Node B — The Brain / QaderCore */
const BrainIcon = () => (
  <span className="text-white font-bold text-2xl tracking-tight select-none">
    Q
  </span>
);

/** Node C — Output / Lightning / Delivery */
const LightningIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-colors duration-700 ${active ? "text-brand-cyan" : "text-gray-600"}`}
  >
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Glassmorphism Tooltip
// ---------------------------------------------------------------------------
const NodeTooltip = ({
  visible,
  tooltip,
  tooltipSub,
  lang,
}: {
  visible: boolean;
  tooltip: string;
  tooltipSub: string;
  lang: Lang;
}) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 5, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`absolute z-50 pointer-events-none ${lang === 'ar' ? '-left-4 md:left-auto md:-right-52' : '-right-4 md:right-auto md:-left-52'}`}
      >
        <div
          className="px-4 py-3 rounded-xl border border-white/10 backdrop-blur-xl bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-w-[180px]"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          <p className="text-sm font-semibold text-white leading-relaxed">
            {tooltip}
          </p>
          <p className="text-[11px] text-gray-500 mt-1 font-mono tracking-wide">
            {tooltipSub}
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ---------------------------------------------------------------------------
// Circle Node with State-Based Glow & Breathing
// ---------------------------------------------------------------------------
interface CircleNodeProps {
  children: React.ReactNode;
  nodeRef: React.RefObject<HTMLDivElement | null>;
  active: boolean;
  glowColor: "cyan" | "purple";
  size?: "sm" | "lg";
  label: string;
  tooltip: string;
  tooltipSub: string;
  lang: Lang;
}

const CircleNode = ({
  children,
  nodeRef,
  active,
  glowColor,
  size = "sm",
  label,
  tooltip,
  tooltipSub,
  lang,
}: CircleNodeProps) => {
  const [hovered, setHovered] = useState(false);
  const sizeClasses =
    size === "lg" ? "w-20 h-20 md:w-24 md:h-24" : "w-14 h-14 md:w-16 md:h-16";

  const activeGlow =
    glowColor === "purple"
      ? "shadow-[0_0_40px_rgba(168,85,247,0.5)] border-brand-purple/50"
      : "shadow-[0_0_30px_rgba(0,255,255,0.35)] border-brand-cyan/40";

  const inactiveStyle = "shadow-none border-white/8";

  return (
    <div
      className="flex flex-col items-center gap-3 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        ref={nodeRef}
        animate={
          active
            ? { scale: [1, 1.08, 1] }
            : { scale: 1 }
        }
        transition={
          active
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
        className={`
          ${sizeClasses}
          rounded-full
          bg-white/[0.03]
          backdrop-blur-xl
          border
          flex items-center justify-center
          z-10
          cursor-pointer
          transition-all duration-700 ease-out
          ${active ? activeGlow : inactiveStyle}
          ${active ? "bg-white/[0.06]" : ""}
        `}
      >
        {children}
      </motion.div>

      {/* Label */}
      <span
        className={`text-xs md:text-sm font-semibold transition-colors duration-700 ${active ? "text-gray-300" : "text-gray-600"
          }`}
      >
        {label}
      </span>

      {/* Tooltip on hover */}
      <NodeTooltip visible={hovered} tooltip={tooltip} tooltipSub={tooltipSub} lang={lang} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Animated Beam Workflow with State Progression
// ---------------------------------------------------------------------------
const BeamWorkflow = ({ lang }: { lang: Lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeARef = useRef<HTMLDivElement>(null);
  const nodeBRef = useRef<HTMLDivElement>(null);
  const nodeCRef = useRef<HTMLDivElement>(null);

  const nodes = getNodes(lang);

  // Slow state cycle sync: 
  // Node A (2s) -> Beam A-B (4s) -> Node B (2s) -> Beam B-C (4s) -> Node C (2s)
  const [activeNode, setActiveNode] = useState<"a" | "b" | "c">("a");

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runCycle = () => {
      // Step 1: Node A is active (breathes)
      setActiveNode("a");
      timeout = setTimeout(() => {
        // Step 2: Node B becomes active when beam pulse reaches it (4s duration)
        setActiveNode("b");
        timeout = setTimeout(() => {
          // Step 3: Node C becomes active when second beam pulse reaches it
          setActiveNode("c");
          timeout = setTimeout(() => {
            runCycle();
          }, 4000); // Hold at C
        }, 4000); // Time for B-C beam
      }, 4000); // Time for A-B beam
    };

    runCycle();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      <div className="flex flex-row md:flex-col items-center justify-center gap-14 md:gap-20 relative py-8">
        <CircleNode
          nodeRef={nodeARef}
          active={activeNode === "a"}
          glowColor="cyan"
          label={nodes.a.label}
          tooltip={nodes.a.tooltip}
          tooltipSub={nodes.a.tooltipSub}
          lang={lang}
        >
          <UserIcon active={activeNode === "a"} />
        </CircleNode>

        <CircleNode
          nodeRef={nodeBRef}
          active={activeNode === "b"}
          glowColor="purple"
          size="lg"
          label={nodes.b.label}
          tooltip={nodes.b.tooltip}
          tooltipSub={nodes.b.tooltipSub}
          lang={lang}
        >
          <BrainIcon />
        </CircleNode>

        <CircleNode
          nodeRef={nodeCRef}
          active={activeNode === "c"}
          glowColor="cyan"
          label={nodes.c.label}
          tooltip={nodes.c.tooltip}
          tooltipSub={nodes.c.tooltipSub}
          lang={lang}
        >
          <LightningIcon active={activeNode === "c"} />
        </CircleNode>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={nodeARef}
        toRef={nodeBRef}
        gradientStartColor="#00FFFF"
        gradientStopColor="#A855F7"
        pathColor="#1A1A1A"
        pathOpacity={0.1}
        pathWidth={2}
        duration={4}
        curvature={0}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={nodeBRef}
        toRef={nodeCRef}
        gradientStartColor="#A855F7"
        gradientStopColor="#00FFFF"
        pathColor="#1A1A1A"
        pathOpacity={0.1}
        pathWidth={2}
        duration={4}
        delay={4} // Start exactly when first beam finishes
        curvature={0}
      />
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Animated CTA Button
// ---------------------------------------------------------------------------
function CleanButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative group px-10 py-5 rounded-full overflow-hidden font-bold text-lg text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all w-full md:w-auto mt-8"
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-cyan bg-[length:200%_auto] animate-[gradient_2s_linear_infinite]" />
      <span className="absolute inset-[2px] bg-black rounded-full z-0 group-hover:bg-black/90 transition-colors" />
      <span className="absolute inset-0 bg-brand-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity z-0 duration-500" />
      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-md">
        {children}
      </span>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Main Hero Component
// ---------------------------------------------------------------------------
export default function Hero({ lang }: { lang: Lang }) {
  const t = dict[lang].hero;

  return (
    <div className="relative w-full h-full min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, #0A0A0A 0%, #000000 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
        <div className={`w-full flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 pt-20 md:pt-0 ${lang === 'ar' ? '' : 'md:flex-row-reverse'}`}>

          <div className="w-full md:w-[40%] h-[35vh] md:h-[60vh] relative flex items-center justify-center">
            <BeamWorkflow lang={lang} />
          </div>

          <div className={`w-full md:w-[55%] flex flex-col items-center z-20 ${lang === 'ar' ? 'md:items-start text-right md:text-right' : 'md:items-end text-left md:text-left'}`}>
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className={`flex flex-col ${lang === 'ar' ? 'w-full items-start' : 'w-fit max-w-xl items-start'}`}
            >
              <h1
                id="hero-heading"
                className={`font-bold leading-[1.1] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan via-white to-brand-purple pb-2 tracking-[0.02em] ${lang === 'ar' ? 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl' : 'text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-8xl'}`}
              >
                {lang === 'en' ? (
                  <>
                    QaderTech
                    <br className="hidden md:inline" />
                    Digital Solutions
                  </>
                ) : t.title}
              </h1>

              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-8 text-white drop-shadow-[0_0_20px_rgba(0,255,255,0.4)] tracking-[0.02em]"
              >
                {t.slogan}
              </motion.p>

              <motion.p
                id="hero-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg sm:text-xl text-gray-400 font-light leading-relaxed mb-4 max-w-xl tracking-[0.01em]"
              >
                {t.subtitle}
              </motion.p>

              <div className={`flex w-full ${lang === 'ar' ? 'justify-start' : 'justify-start'}`}>
                <CleanButton onClick={() => window.location.hash = 'contact'}>{t.cta}</CleanButton>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
