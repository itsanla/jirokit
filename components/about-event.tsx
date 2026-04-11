"use client";

import AboutCard from "@/components/about-card";

const EVENT_INFO = [
  {
    title: "Pengubah File Universal",
    description:
      "Alat untuk mengubah format file apa saja menjadi format yang diinginkan. Dokumen, gambar, hingga video bisa diubah dalam hitungan detik",
    subTitle: "File Converter",
    img: "/converter.webp",
    href: "/file-converter",
  },
  {
    title: "Pencatat Suara Otomatis",
    description:
      "Pengguna cukup mengunggah rekaman suara, dan website kami akan otomatis mengetikkannya menjadi teks yang rapi. Sangat membantu untuk notulen rapat, transkrip wawancara, atau tugas kuliah.",
    subTitle: "Audio to Text",
    img: "/audio.webp",
    href: "/audio-to-text",
  },
];

export default function AboutEvent() {
  return (
    <section
      id="tentang"
      className="container mx-auto flex flex-col items-center px-4 md:px-6 lg:px-12 xl:px-16 py-10"
    >
      <p className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-orange-700">
        Tentang Kami
      </p>
      <h2 className="text-center text-3xl font-bold text-blue-gray-900">
        Kenapa Memilih ruang.studio?
      </h2>
      <p className="mt-2 mb-8 w-full text-center text-lg font-normal text-gray-500 lg:max-w-4xl">
        Kami membuat sebuah website &quot;serba bisa&quot; yang menyediakan
        alat-alat digital untuk mempermudah pekerjaan sehari-hari. Di kembangkan khusus dalam mengolah dokumen, foto, dan suara. Yang membuat kami berbeda adalah semua
        proses terjadi langsung di perangkat pengguna (HP/Laptop), bukan di
        server kami. Ini artinya bekerja lebih cepat dan jauh lebih aman.
      </p>
      <p className="mb-8 w-full text-center text-base font-normal text-gray-500 lg:max-w-3xl">
        Cocok untuk mahasiswa, pekerja kantoran, pedagang online/UMKM, dan
        konten kreator yang butuh alat praktis tanpa ribet install aplikasi.
      </p>
      <div id="layanan" className="w-full mt-8">
        <p className="mb-6 text-sm font-semibold uppercase tracking-wider text-orange-700">
          Layanan Kami
        </p>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {EVENT_INFO.map((props, idx) => (
          <AboutCard key={idx} {...props} />
        ))}
        <div className="md:col-span-2">
          <AboutCard
            title="Penghapus Latar Belakang Foto"
            subTitle="Background Remover"
            description="Cukup satu klik, latar belakang foto hilang otomatis. Objek utama (orang/barang) terpotong rapi, siap dipakai untuk desain, jualan online, atau pas foto. Hasil berkualitas tinggi tanpa perlu skill editing."
            compareImages={{
              before: "/rb2.webp",
              after: "/rb.webp",
            }}
            href="/background-remover"
          />
        </div>
        </div>
      </div>
    </section>
  );
}
