"use client";

import { Skeleton } from "@heroui/skeleton";

export default function FaqSkeleton() {
  return (
    <section className="py-8 px-8 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center">
          <Skeleton className="mx-auto mb-4 h-9 w-80 rounded-lg" />
          <Skeleton className="mx-auto mb-24 h-5 w-96 rounded-lg lg:w-3/5" />
        </div>
        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-b border-blue-gray-100 py-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-5 w-5 shrink-0 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
