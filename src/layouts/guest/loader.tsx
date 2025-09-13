const Skeleton = ({ className = "" }: { className: string }) => (
  <div
    className={`animate-pulse  rounded-md bg-gradient-to-r from-[#F1EFEF] to-[#E7E5E5] ${className}`}
  />
);

const CardSkeleton = () => (
  <div className="w-full h-auto flex flex-col item-center gap-2">
    <div className="h-[11.0625rem] bg-gradient-to-r from-[#F1EFEF] to-[#E7E5E5] rounded-md" />

    <div className="w-full flex flex-col justify-between gap-2">
      <div className="w-[16.3125rem] h-[1.375rem] bg-gradient-to-r from-[#F1EFEF] to-[#E7E5E5] animate-pulse rounded-md" />

      <div className="flex items-center justify-between">
        <div className="w-[6rem] h-[1.375rem] bg-gradient-to-r from-[#F1EFEF] to-[#E7E5E5] animate-pulse rounded-md" />
        <div className="w-[1.133125rem] h-[1.375rem] bg-gradient-to-r from-[#F1EFEF] to-[#E7E5E5] animate-pulse rounded-md" />
      </div>
    </div>
  </div>
);

/**
 * Dashboard loader
 *
 * @returns ReactElement
 */
export default function GuestPageLoader() {
  return (
    <div className="h-screen flex flex-col gap-16 p-2 overflow-y-scroll">
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="w-[31.625rem] h-[2.1875rem] mb-1" />
            <Skeleton className="w-[31.625rem] h-[1.1375rem]" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="w-[9rem] h-[1.375rem]" />
            <Skeleton className="w-[0.9375rem] h-[1.1375rem]" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="w-[6.1875rem] h-[1.5rem]" />
          <Skeleton className="w-[6.1875rem] h-[1.5rem]" />
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <Skeleton className="size-[12.5rem]" />
          <Skeleton className="w-full max-w-[43rem] h-[2.75rem]" />
          <Skeleton className="w-[6.1875rem] h-[1.5rem]" />
        </div>
      </div>

      <div className="w-full">
        <div className="w-full flex items-center justify-between mb-4">
          <Skeleton className="w-[18.25rem] h-[2.1875rem]" />
          <Skeleton className="w-[4.0625rem] h-[1.375rem]" />
        </div>

        <div className="w-full grid grid-cols-3  gap-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
