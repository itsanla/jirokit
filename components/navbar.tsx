"use client";

import React from "react";
import {
  RectangleStackIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
  NewspaperIcon,
} from "@heroicons/react/24/solid";
import {
  Navbar as NavbarWrapper,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const NAV_MENU = [
  { name: "Beranda", icon: RectangleStackIcon, link: "/" },
  { 
    name: "Layanan", 
    icon: WrenchScrewdriverIcon, 
    link: "/#layanan",
    dropdown: [
      { name: "File Converter", link: "/file-converter" },
      { name: "Audio to Text", link: "/audio-to-text" },
      { name: "Background Remover", link: "/background-remover" },
    ]
  },
  { name: "Blog", icon: NewspaperIcon, link: "/blog" },
  { name: "Tentang", icon: InformationCircleIcon, link: "/#tentang" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <NavbarWrapper>
      {/* Desktop Navigation */}
      <NavBody>
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
              ruang.studio
            </span>
          </a>
        </NavbarLogo>
        <NavItems items={NAV_MENU} />
        <div className="flex items-center gap-4">
          <NavbarButton variant="secondary" href="#faq">
            FAQ
          </NavbarButton>
          <NavbarButton variant="primary" href="/converter">
            Coba Sekarang
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
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
              <span className="text-lg font-bold text-black dark:text-white">
                ruang.studio
              </span>
            </a>
          </NavbarLogo>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {NAV_MENU.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`mobile-link-${idx}`} className="w-full">
                <a
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 hover:text-orange-500"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
                {item.dropdown && (
                  <div className="ml-7 mt-2 flex flex-col gap-2">
                    {item.dropdown.map((dropItem, dropIdx) => (
                      <a
                        key={`mobile-dropdown-${idx}-${dropIdx}`}
                        href={dropItem.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-orange-500"
                      >
                        {dropItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex w-full flex-col gap-4 mt-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="secondary"
              href="#faq"
              className="w-full"
            >
              FAQ
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              href="/converter"
              className="w-full"
            >
              Coba Sekarang
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </NavbarWrapper>
  );
}
