export default function AboutEventSkeleton() {
  return (
    <section className="container mx-auto flex flex-col items-center px-4 md:px-6 lg:px-12 xl:px-16 py-10">
      <div className="h-4 w-28 rounded bg-gray-200 animate-pulse mb-2" />
      <div className="h-8 w-80 rounded bg-gray-200 animate-pulse mb-4" />
      <div className="h-5 w-full max-w-xl rounded bg-gray-100 animate-pulse mb-2" />
      <div className="h-5 w-full max-w-lg rounded bg-gray-100 animate-pulse mb-8" />
      <div className="w-full mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-[453px] rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-[453px] rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-[453px] rounded-2xl bg-gray-200 animate-pulse md:col-span-2" />
      </div>
    </section>
  );
}
