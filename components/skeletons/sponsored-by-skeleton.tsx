"use client";

import { Skeleton } from "@heroui/skeleton";

export default function SponsoredBySkeleton() {
  return (
    <section className="py-8 px-8 lg:py-20">
      <div className="container mx-auto text-center">
        <Skeleton className="mx-auto mb-8 h-4 w-32 rounded-lg" />
        <div className="flex flex-wrap items-center justify-center gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-40 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}
