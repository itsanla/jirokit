import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const BASE_URL = "https://jirokit.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Jirokit — Digital Studio untuk Landing Page Profesional",
    template: "%s | Jirokit",
  },
  description:
    "Jirokit adalah digital studio yang menyediakan layanan pembuatan landing page profesional untuk UMKM, startup, dan brand lokal Indonesia. Website indah, SEO optimized, dirancang untuk convert visitors menjadi customers.",
  keywords: [
    "landing page profesional",
    "jasa pembuatan website",
    "landing page UMKM",
    "website startup Indonesia",
    "digital studio Indonesia",
    "jasa landing page murah",
    "website konversi tinggi",
    "brand lokal Indonesia",
    "jirokit",
  ],
  authors: [{ name: "Jirokit", url: BASE_URL }],
  creator: "Jirokit",
  publisher: "Jirokit",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "Jirokit",
    title: "Jirokit — Digital Studio untuk Landing Page Profesional",
    description:
      "Landing page profesional untuk UMKM, startup, dan brand lokal Indonesia. SEO optimized & dirancang untuk convert visitors menjadi customers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jirokit — Digital Studio Landing Page Profesional Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jirokit — Digital Studio untuk Landing Page Profesional",
    description:
      "Landing page profesional untuk UMKM, startup, dan brand lokal Indonesia. SEO optimized & dirancang untuk convert visitors menjadi customers.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Jirokit",
  url: BASE_URL,
  logo: `${BASE_URL}/icon.webp`,
  description:
    "Digital studio yang menyediakan layanan pembuatan landing page profesional untuk UMKM, startup, dan brand lokal Indonesia.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "ID",
  },
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Jirokit",
  url: BASE_URL,
  description:
    "Digital studio yang menyediakan layanan pembuatan landing page profesional untuk UMKM, startup, dan brand lokal Indonesia.",
  inLanguage: "id-ID",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="shortcut icon" href="/icon.webp" type="image/webp" />
        <link
          rel="preload"
          href="/image/event.webp"
          as="image"
          type="image/webp"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={roboto.className + " antialiased"}>{children}</body>
    </html>
  );
}
