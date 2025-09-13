const Skeleton = ({ className = "" }: { className: string }) => (
  <div
    className={`animate-pulse  rounded-md bg-gradient-to-r from-[#F1EFEF] to-[#E7E5E5] ${className}`}
  />
);

/**
 * Dashboard loader
 *
 * @returns ReactElement
 */
export default function DashboardLoader() {
  return (
    <div className="h-screen flex flex-col gap-16 p-2 overflow-y-scroll">
      <div className="w-full flex flex-col gap-4 px-4">
        <div className="flex items-center justify-between ">
          <div>
            <Skeleton className="w-[31.625rem] h-[2.1875rem] mb-1" />
            <Skeleton className="w-[31.625rem] h-[1.1375rem]" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="w-[0.9375rem] h-[1.1375rem]" />
            <Skeleton className="w-[9rem] h-[1.375rem]" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-7">
          <Skeleton className="w-[6.1875rem] h-[2.5rem]" />
        </div>

        <div className="mt-10 flex gap-[171px]">
          <div className="flex items-center gap-4">
            <Skeleton className="w-[1.1719rem] h-[0.7031rem]" />
            <div className="flex flex-col  gap-2">
              <Skeleton className=" w-[10rem] h-[1.3125rem]" />
              <Skeleton className="w-[8rem] h-[1.5rem]" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="w-[1.1719rem] h-[0.7031rem]" />
            <div className="flex flex-col  gap-2">
              <Skeleton className=" w-[8rem] h-[1.3125rem]" />
              <Skeleton className="w-[8rem] h-[1.5rem]" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="w-[1.1719rem] h-[0.7031rem]" />
            <div className="flex flex-col  gap-2">
              <Skeleton className=" w-[10rem] h-[1.3125rem]" />
              <Skeleton className="w-[8rem] h-[1.5rem]" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 flex justify-between gap-4 mt-16">
        <div className="flex flex-col  max-w-[535px]  flex-auto gap-2">
          <Skeleton className="w-[6.1875rem] h-[1.5rem] relative left-0" />
          <Skeleton className="size-[12.5rem] mx-auto" />
          <Skeleton className=" w-[33.4375rem] h-6" />
        </div>
        <div className="flex flex-col  max-w-[535px]  flex-auto gap-2">
          <Skeleton className="w-[7.1875rem] h-[1.5rem] relative left-0" />
          <Skeleton className="size-[12.5rem] mx-auto" />
          <Skeleton className=" w-[33.4375rem] h-6" />
        </div>
      </div>
      <div className="flex flex-col  px-4  gap-2">
        <Skeleton className="w-[6.1875rem] h-[1.5rem] relative left-0" />
        <div className="w-full mx-auto ">
          <Skeleton className=" w-[33.4375rem] mx-auto h-5" />
        </div>
      </div>
    </div>
  );
}
