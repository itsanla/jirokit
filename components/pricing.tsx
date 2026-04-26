"use client";

const PRICING_PLANS = [
  {
    title: "Starter",
    price: "Rp 5 juta",
    period: "/ proyek",
    description: "Cocok untuk bisnis kecil atau startup yang baru memulai",
    features: [
      "Landing Page Profesional (5 halaman)",
      "Desain Responsif (Mobile & Desktop)",
      "SEO Basic Optimization",
      "Form Kontak & Integrasi Email",
      "Google Analytics Setup",
      "Hosting & Domain (1 tahun)",
      "Revisi hingga 3x",
      "Maintenance 1 bulan gratis",
    ],
    ctaText: "Mulai Sekarang",
    ctaHref: "#kontak",
  },
  {
    title: "Professional",
    price: "Rp 15 juta",
    period: "/ proyek",
    description: "Untuk bisnis yang membutuhkan fitur lebih lengkap dan kompleks",
    features: [
      "Website Full Custom (10-15 halaman)",
      "Admin Panel / CMS",
      "Database Integration",
      "User Authentication & Authorization",
      "Payment Gateway Integration",
      "API Development",
      "Advanced SEO & Performance Optimization",
      "Hosting & Domain (1 tahun)",
      "Revisi hingga 5x",
      "Maintenance 3 bulan gratis",
      "Training & Dokumentasi",
    ],
    popular: true,
    ctaText: "Pilih Paket Ini",
    ctaHref: "#kontak",
  },
];

export default function Pricing() {
  return (
    <section id="layanan" className="py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-16">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Paket Layanan
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Pilih paket yang sesuai
          </h2>
        </div>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-4 md:px-6 lg:px-12 xl:px-16 min-w-max md:grid md:grid-cols-2 md:max-w-5xl md:mx-auto">
          {PRICING_PLANS.map((plan, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[85vw] sm:w-[400px] md:w-auto relative bg-white rounded-3xl p-6 md:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  {plan.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6 md:mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-semibold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 text-xs md:text-sm">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 md:space-y-3 mb-6 md:mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 md:gap-3 text-xs md:text-sm">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className="block w-full text-center py-2.5 md:py-3 px-4 rounded-full bg-gray-900 text-white text-sm md:text-base font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                {plan.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
