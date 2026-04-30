export default function HeroScrollSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden py-20">
      <div className="mx-auto flex flex-col items-center">
        <div className="h-8 w-64 rounded bg-gray-200 animate-pulse mb-4" />
        <div className="h-16 w-96 rounded bg-gray-200 animate-pulse mb-8" />
        <div className="mx-auto h-[400px] w-full max-w-5xl rounded-2xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
