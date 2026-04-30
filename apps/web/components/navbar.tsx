"use client";

import React from "react";
import {
  RectangleStackIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
  NewspaperIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import {
  Navbar as NavbarWrapper,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

const NAV_MENU = [
  { name: "Beranda", icon: RectangleStackIcon, link: "/" },
  { name: "Layanan", icon: WrenchScrewdriverIcon, link: "/#layanan" },
  { name: "Event", icon: SparklesIcon, link: "/event" },
  { name: "Blog", icon: NewspaperIcon, link: "/blog" },
  { name: "Tentang", icon: InformationCircleIcon, link: "/#tentang" },
];

export default function Navbar() {
  return (
    <NavbarWrapper>
      {/* Desktop Navigation - Hidden on mobile */}
      <NavBody className="hidden md:flex">
        <NavbarLogo>
          <a href="/" className="flex items-center gap-2">
            <img
              src="/icon.webp"
              alt=""
              width={30}
              height={30}
              className="rounded-lg"
              decoding="async"
            />
            <span className="text-lg font-bold">
              jirokit
            </span>
          </a>
        </NavbarLogo>
        <NavItems items={NAV_MENU} />
        <div className="flex items-center gap-4">
          <NavbarButton variant="secondary" href="#faq">
            FAQ
          </NavbarButton>
          <NavbarButton variant="primary" href="#kontak">
            Hubungi Kami
          </NavbarButton>
        </div>
      </NavBody>
    </NavbarWrapper>
  );
}
