"use client";

import React from "react";
import { FloatingDock } from "./ui/floating-dock";
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
} from "@tabler/icons-react";
import { contactInfo } from "../lib/contactInfo";

export default function FooterDock() {
  const links = [
    {
      title: "Instagram",
      icon: (
        <IconBrandInstagram className="h-full w-full text-neutral-400 group-hover:text-brand-cyan transition-colors" />
      ),
      href: contactInfo.social.instagram,
    },
    {
      title: "TikTok",
      icon: (
        <IconBrandTiktok className="h-full w-full text-neutral-400 group-hover:text-brand-cyan transition-colors" />
      ),
      href: contactInfo.social.tiktok,
    },
    {
      title: "X",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-400 group-hover:text-brand-cyan transition-colors" />
      ),
      href: contactInfo.social.x,
    },
  ];

  return (
    <div className="flex items-center justify-center w-full py-10">
      <FloatingDock
        mobileClassName="translate-y-0"
        items={links}
      />
    </div>
  );
}
