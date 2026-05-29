"use client";

import React from "react";
import { motion } from "framer-motion";
import { IconBrandInstagram, IconBrandX, IconBrandTiktok } from "@tabler/icons-react";

const socialLinks = [
  {
    name: "Instagram",
    icon: <IconBrandInstagram className="w-6 h-6" />,
    href: "https://instagram.com",
    color: "hover:text-[#E4405F]",
    glow: "group-hover:shadow-[0_0_20px_rgba(228,64,95,0.4)]",
  },
  {
    name: "TikTok",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
    href: "https://tiktok.com",
    color: "hover:text-[#000000]",
    glow: "group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]",
  },
  {
    name: "X",
    icon: <IconBrandX className="w-6 h-6" />,
    href: "https://x.com",
    color: "hover:text-[#1DA1F2]",
    glow: "group-hover:shadow-[0_0_20px_rgba(29,161,242,0.4)]",
  },
];

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-6 justify-center">
      {socialLinks.map((social) => (
        <motion.a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -5, scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`group relative p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 ${social.color} ${social.glow} hover:bg-white/10 hover:border-white/20`}
        >
          {social.icon}
          
          {/* Tooltip */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 backdrop-blur-md">
            {social.name}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
