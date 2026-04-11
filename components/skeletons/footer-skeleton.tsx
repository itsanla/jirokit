"use client";

import { Skeleton } from "@heroui/skeleton";

export default function FooterSkeleton() {
  return (
    <footer className="p-10 pb-5 md:pt-10">
      <div className="container mx-auto flex flex-col">
        {/* CTA Banner */}
        <div className="mx-auto mb-5 flex w-full max-w-6xl flex-col items-center justify-center rounded-2xl bg-gray-900/10 p-5 py-10 md:mb-20">
          <Skeleton className="mb-3 h-8 w-80 rounded-lg" />
          <Skeleton className="mb-3 h-4 w-96 rounded-lg md:w-7/12" />
          <Skeleton className="mt-2 h-12 w-44 rounded-lg" />
        </div>

        {/* Footer links */}
        <div className="flex flex-col items-center justify-between md:flex-row">
          <Skeleton className="h-6 w-28 rounded-lg" />
          <div className="mx-auto my-4 flex items-center justify-center gap-4 md:my-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-14 rounded-lg" />
            ))}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <Skeleton className="mx-auto h-4 w-72 rounded-lg" />
          <Skeleton className="mx-auto mt-2 h-3 w-48 rounded-lg" />
          <Skeleton className="mx-auto mt-1 h-3 w-56 rounded-lg" />
        </div>
      </div>
    </footer>
  );
}
