export default function OurStatsSkeleton() {
  return (
    <section className="container mx-auto grid gap-10 px-4 md:px-6 lg:px-12 xl:px-16 py-15 lg:grid-cols-1 lg:gap-20 xl:grid-cols-2 xl:place-items-center">
      <div>
        <div className="h-4 w-28 rounded bg-gray-200 animate-pulse mb-6" />
        <div className="h-10 w-72 rounded bg-gray-200 animate-pulse mb-3" />
        <div className="h-5 w-full max-w-md rounded bg-gray-100 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-8 gap-x-28">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-start gap-2">
            <div className="h-10 w-20 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}
