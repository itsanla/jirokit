"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

interface BlogCardData {
  category: string;
  title: string;
  src: string;
  href: string;
}

interface EventContentProps {
  posts?: BlogCardData[];
}

export default function EventContent({ posts }: EventContentProps) {
  const cardData = posts && posts.length > 0 ? posts : [];

  const cards = cardData.map((card, index) => (
    <Card key={card.href + index} card={card} index={index} />
  ));

  if (cardData.length === 0) return null;

  return (
    <div className="w-full h-full">
      <h2 className="max-w-screen-2xl px-4 md:px-6 lg:px-12 xl:px-16 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Artikel Terbaru Kami.
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
