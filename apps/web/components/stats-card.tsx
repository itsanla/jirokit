interface StatsCardProps {
  count: React.ReactNode;
  title: string;
}

export default function StatsCard({ count, title }: StatsCardProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-gray-900">{count}</h1>
      <p className="mt-1 text-base font-medium text-blue-gray-700">{title}</p>
    </div>
  );
}
