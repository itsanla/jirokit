import type { Metadata } from "next";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import BlogListClient from "@/components/blog/blog-list-client";
import BlogFooter from "@/components/blog-footer";
import Navbar from "@/components/navbar";
import MobileFloatingNav from "@/components/mobile-floating-nav";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog — Tips Landing Page, SEO & Digital Marketing untuk UMKM",
  description:
    "Baca artikel terbaru seputar pembuatan landing page, SEO untuk UMKM, strategi konversi, dan digital marketing untuk bisnis Indonesia di blog Jirokit.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    title: "Blog Jirokit — Tips Landing Page & Digital Marketing UMKM Indonesia",
    description:
      "Artikel praktis tentang landing page profesional, SEO, dan strategi digital untuk UMKM, startup, dan brand lokal Indonesia.",
    url: "/blog",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Blog Jirokit — Tips Landing Page & Digital Marketing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Jirokit — Tips Landing Page & Digital Marketing UMKM",
    description:
      "Artikel praktis tentang landing page profesional, SEO, dan strategi digital untuk bisnis Indonesia.",
    images: ["/og-image.png"],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />
      <MobileFloatingNav />

      {/* Header with Spotlight Effect */}
      <div className="relative flex h-[28rem] w-full overflow-hidden bg-black/[0.96] antialiased md:items-center md:justify-center">
        {/* Grid Background Pattern */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
            "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
          )}
        />

        {/* Spotlight Effect */}
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="white"
        />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
          <span className="mb-6 inline-block w-full text-center rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400">
            Blog & Artikel
          </span>
          <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
            Wawasan &{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text">
              Pengetahuan
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base font-normal text-neutral-300 md:text-lg">
            Artikel terbaru seputar teknologi, desain, produktivitas, dan
            keamanan digital untuk membantu Anda tetap terdepan.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 md:px-6 md:py-16 lg:px-12 xl:px-16">
        <BlogListClient posts={posts} categories={categories} />
      </div>

      <BlogFooter />
    </main>
  );
}
