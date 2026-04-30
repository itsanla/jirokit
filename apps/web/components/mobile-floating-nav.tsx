"use client";

import SimpleDock from "@/components/ui/simple-dock";
import {
  IconHome,
  IconBriefcase,
  IconNews,
  IconMail,
} from "@tabler/icons-react";

export default function MobileFloatingNav() {
  const links = [
    {
      title: "Beranda",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Layanan",
      icon: (
        <IconBriefcase className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/#layanan",
    },
    {
      title: "jirokit",
      icon: (
        <img
          src="/icon.webp"
          width={20}
          height={20}
          alt="jirokit"
          className="rounded-lg"
        />
      ),
      href: "/",
    },
    {
      title: "Blog",
      icon: (
        <IconNews className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/blog",
    },
    {
      title: "Hubungi",
      icon: (
        <IconMail className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#kontak",
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 md:hidden w-[90%] max-w-md">
      <SimpleDock items={links} className="w-full" />
    </div>
  );
}
