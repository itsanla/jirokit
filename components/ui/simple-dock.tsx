"use client";

import { cn } from "@/lib/utils";

interface SimpleDockProps {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}

export default function SimpleDock({ items, className }: SimpleDockProps) {
  return (
    <div
      className={cn(
        "flex h-14 items-center justify-between rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-6 shadow-lg dark:bg-black/10 dark:border-white/10",
        className
      )}
    >
      {items.map((item) => (
        <a
          key={item.title}
          href={item.href}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200/80 backdrop-blur-sm transition-all active:scale-90 dark:bg-neutral-800/80"
          aria-label={item.title}
        >
          <div className="h-5 w-5">{item.icon}</div>
        </a>
      ))}
    </div>
  );
}
