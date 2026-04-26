import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "jirokit — Alat Digital Serba Bisa",
  description:
    "Alat digital serba bisa untuk konversi file, transkripsi audio, dan hapus background foto. Semua proses di perangkat Anda sendiri — cepat, aman, dan gratis.",
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
        {/* Preload hero background for faster LCP */}
        <link
          rel="preload"
          href="/image/event.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body className={roboto.className + " antialiased"}>
        {children}
      </body>
    </html>
  );
}
