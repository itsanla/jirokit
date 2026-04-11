import Image from "next/image";

interface EventContentCardProps {
  title: string;
  des: string;
  name: string;
  position: string;
  panel: string;
  img: string;
}

export default function EventContentCard({
  title,
  des,
  name,
  position,
  panel,
  img,
}: EventContentCardProps) {
  return (
    <div className="mb-10 flex flex-col overflow-hidden rounded-xl bg-transparent shadow-none lg:flex-row lg:items-end">
      <div className="h-[32rem] w-full shrink-0 overflow-hidden rounded-xl lg:max-w-[28rem]">
        <Image
          width={768}
          height={768}
          src={img}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="px-2 py-6 lg:px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-gray-700">
          {panel}
        </p>
        <h2 className="mb-4 text-2xl font-medium text-blue-gray-900 lg:text-3xl">
          {title}
        </h2>
        <p className="mb-12 text-base font-medium text-gray-500 md:w-8/12">
          {des}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            <Image
              width={48}
              height={48}
              src="/logos/logo-google.svg"
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h6 className="text-base font-semibold text-blue-gray-900">
              {name}
            </h6>
            <p className="text-sm font-normal text-gray-500">{position}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
