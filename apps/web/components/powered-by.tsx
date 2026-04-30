"use client";

import { Marquee } from "@/components/icon/marque";

type TechStack = {
  image: string;
  name: string;
};

export default function PoweredBy() {
  const techStack: TechStack[] = [
    {
      image: "/logos/next.webp",
      name: "Next.js",
    },
    {
      image: "/logos/tailwind.webp",
      name: "Tailwind CSS",
    },
    {
      image: "/logos/Node-js.webp",
      name: "Node.js",
    },
    {
      image: "/logos/radix-ui.webp",
      name: "Radix UI",
    },
    {
      image: "/logos/Cloudflare.webp",
      name: "Cloudflare",
    },
    {
      image: "/logos/eslint.webp",
      name: "ESLint",
    },
  ];

  return (
    <section className="py-8 px-4 md:px-6 lg:px-12 lg:py-20 xl:px-16">
      <div className="container mx-auto">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-orange-700">
          Powered By
        </p>
        {/* Single direction marquee - lebih profesional */}
        <Marquee className="[--duration:30s] [--gap:1.5rem] md:[--gap:3rem]" pauseOnHover>
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="flex items-center justify-center"
            >
              <img
                src={tech.image}
                alt={tech.name}
                className="h-8 w-auto object-contain grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100 md:h-12"
                loading="lazy"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
