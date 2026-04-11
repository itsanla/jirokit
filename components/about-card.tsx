import Image from "next/image";
import { ShinyButton } from "@/components/ui/shiny-button"
import { Compare } from "@/components/ui/compare";

interface AboutCardProps {
  title: string;
  subTitle: string;
  description: string;
  img?: string;
  compareImages?: {
    before: string;
    after: string;
  };
  href?: string;
}

export default function AboutCard({
  title,
  description,
  subTitle,
  img,
  compareImages,
  href = "/converter",
}: AboutCardProps) {
  return (
    <div className="rounded-2xl bg-gray-900 shadow-none relative overflow-hidden h-[453px]">
      {compareImages ? (
        <>
          <div className="absolute inset-0 z-0">
            <Compare
              firstImage={compareImages.before}
              secondImage={compareImages.after}
              firstImageClassName="object-cover"
              secondImageClassname="object-cover"
              className="w-full h-full"
              slideMode="hover"
            />
          </div>
          <div className="absolute inset-0 bg-gray-900/70 z-[1] pointer-events-none" />
        </>
      ) : (
        img && (
          <>
            <Image
              src={img}
              alt={title}
              fill
              className="object-cover z-0"
            />
            <div className="absolute inset-0 bg-gray-900/70 z-[1]" />
          </>
        )
      )}
      <div className="flex h-full flex-col items-center justify-center rounded-2xl p-5 relative z-[2] pointer-events-none">
        <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-white/80">
          {subTitle}
        </p>
        <h3 className="text-center text-2xl font-bold text-white">
          {title}
        </h3>
        <p className="mt-2 mb-10 w-full text-center text-base font-normal text-white/80 lg:w-8/12">
          {description}
        </p>
        <a
          href={href}
          className="rounded-lg bg-white pointer-events-auto inline-flex items-center min-h-[48px]"
          aria-label={`Coba Sekarang - ${title}`}
        >
          <ShinyButton>Coba Sekarang</ShinyButton>
        </a>
      </div>
    </div>
  );
}
