"use client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Teknologi Modern <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Hasil Maksimal
              </span>
            </h1>
          </>
        }
      >
        <video
          src="/demo.mp4"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          autoPlay
          loop
          muted
          playsInline
        />
      </ContainerScroll>
    </div>
  );
}
