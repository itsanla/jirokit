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
        Kenapa Memilih jirokit?
      </h2>
      <p className="mt-2 mb-8 w-full text-center text-lg font-normal text-gray-500 lg:max-w-4xl">
        Kami adalah software house yang berfokus pada pembuatan website dan aplikasi berkualitas tinggi. 
        Dengan tim developer berpengalaman, kami siap mengubah ide bisnis Anda menjadi solusi digital yang powerful dan scalable.
      </p>
      <p className="mb-8 w-full text-center text-base font-normal text-gray-500 lg:max-w-3xl">
        Dari startup hingga enterprise, kami telah membantu berbagai klien mewujudkan visi digital mereka dengan teknologi terkini dan best practices.
      </p>
    </section>
  );
}
