"use client";

import { Skeleton } from "@heroui/skeleton";

function CardSkeleton() {
  return (
    <div className="mb-10 flex flex-col overflow-hidden rounded-xl lg:flex-row lg:items-end">
      {/* Image placeholder */}
      <Skeleton className="h-[32rem] w-full shrink-0 rounded-xl lg:max-w-[28rem]" />
      {/* Text area */}
      <div className="flex-1 px-2 py-6 lg:px-6">
        <Skeleton className="mb-4 h-3 w-28 rounded-lg" />
        <Skeleton className="mb-4 h-8 w-3/4 rounded-lg" />
        <div className="mb-12 space-y-2 md:w-8/12">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventContentSkeleton() {
  return (
    <section className="py-8 px-8 lg:py-20">
      {/* Tabs placeholder */}
      <div className="mb-8 flex w-full flex-col items-center">
        <Skeleton className="h-12 w-72 rounded-lg md:w-[28rem]" />
      </div>
      {/* Cards placeholder */}
      <div className="container mx-auto">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
