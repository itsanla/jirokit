import {
  GlobeAltIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

export default function Footer() {
  const CURRENT_YEAR = new Date().getFullYear();
  const LINKS = [
    { name: "Beranda", href: "/" },
    { name: "Layanan", href: "/#layanan" },
    { name: "Tentang", href: "/#tentang" },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/#faq" },
  ];
  const SOCIAL_LINKS = [
    {
      icon: GlobeAltIcon,
      url: "https://anla.my.id",
      label: "Portfolio",
      title: "Portfolio",
    },
    {
      icon: EnvelopeIcon,
      url: "mailto:me@anla.my.id",
      label: "Email",
      title: "Email",
    },
  ];

  return (
    <footer className="px-4 md:px-6 lg:px-12 xl:px-16 py-10 pb-5 md:pt-10">
      <div className="container mx-auto flex flex-col">
        {/* CTA Banner */}
        <div
          id="mulai"
          className="mx-auto mb-5 flex w-full max-w-6xl flex-col items-center justify-center rounded-2xl bg-gray-900 p-5 py-10 md:mb-20"
        >
          <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
            Mulai Gunakan ruang.studio — Gratis!
          </h2>
          <p className="my-3 text-center text-base text-white/80 md:w-7/12">
            Konversi file, transkripsi audio, dan hapus background foto langsung
            dari browser Anda. Tanpa install, tanpa daftar, tanpa biaya.
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 md:w-fit md:flex-row">
            <a
              href="/converter"
              className="rounded-lg bg-white px-6 py-3 text-center font-medium text-gray-900 transition-colors hover:bg-gray-100"
            >
              Coba Konversi File
            </a>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-col items-center justify-between md:flex-row">
          <a
            href="/"
            className="text-lg font-semibold text-gray-900"
          >
            ruang.studio
          </a>
          <ul className="mx-auto my-4 flex w-max items-center justify-center gap-4 md:my-0">
            {LINKS.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-sm font-normal text-gray-700 transition-colors hover:text-gray-900"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex w-fit justify-center gap-2">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.title}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
            <a
              href="https://www.linkedin.com/in/anlaharpanda"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://github.com/itsanla"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright & Developer Info */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm font-semibold text-gray-900">
            © {CURRENT_YEAR} ruang.studio - Alat Digital Serba Bisa
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Developed by{" "}
            <a
              href="https://anla.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-900 hover:text-orange-500 transition-colors"
            >
              Anla Harpanda
            </a>
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Padang, Indonesia • {" "}
            <a
              href="mailto:me@anla.my.id"
              className="font-medium text-gray-900 hover:text-orange-500 transition-colors"
            >
              me@anla.my.id
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
