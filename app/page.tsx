import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import MobileFloatingNav from "@/components/mobile-floating-nav";
import { getAllPosts } from "@/lib/blog";

import {
  AboutEventSkeleton,
  EventContentSkeleton,
  FaqSkeleton,
  FooterSkeleton,
  OurStatsSkeleton,
  HeroScrollSkeleton,
  SponsoredBySkeleton,
} from "@/components/skeletons";

// Lazy-load below-fold & heavy components with skeleton fallbacks
const PoweredBy = dynamic(() => import("@/components/powered-by"), {
  loading: () => <SponsoredBySkeleton />,
});
const AboutEvent = dynamic(() => import("@/components/about-event"), {
  loading: () => <AboutEventSkeleton />,
});
const Pricing = dynamic(() => import("@/components/pricing"), {
  loading: () => <AboutEventSkeleton />,
});
const OurStats = dynamic(() => import("@/components/our-stats"), {
  loading: () => <OurStatsSkeleton />,
});
const HeroScrollDemo = dynamic(() => import("@/components/demo"), {
  loading: () => <HeroScrollSkeleton />,
});
const EventContent = dynamic(() => import("@/components/event-content"), {
  loading: () => <EventContentSkeleton />,
});
const Faq = dynamic(() => import("@/components/faq"), {
  loading: () => <FaqSkeleton />,
});
const Footer = dynamic(() => import("@/components/footer"), {
  loading: () => <FooterSkeleton />,
});

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 6).map((post) => ({
    category: post.frontmatter.categories?.[0] || "Artikel",
    title: post.frontmatter.title,
    src: post.frontmatter.image || "/image/event.webp",
    href: `/blog/${post.slug}`,
  }));

  return (
    <>
      <Navbar />
      <MobileFloatingNav />
      <Hero />
      <PoweredBy />
      <AboutEvent />
      <Pricing />
      {/* <OurStats /> */}
      <HeroScrollDemo/>
      <EventContent posts={latestPosts} />
      <Faq />
      <Footer />
    </>
  );
}
