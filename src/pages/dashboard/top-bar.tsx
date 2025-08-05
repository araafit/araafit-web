import { BellIcon, CaretRightIcon } from "@phosphor-icons/react";

/* -------------------------------------------------------------------- */

type TopBarType = {
  userName: string;
  breadCrumb: string;
  notificationCount?: number | string;
  className?: string;
};

export default function TopBar({
  userName = "user",
  breadCrumb = "home",
}: TopBarType) {
  return (
    <div className="w-full h-[4.8125rem] absolute top-0 left-0 bg-white px-10 py-[0.375rem] flex items-center justify-between">
      <div>
        <h2 className="font-medium text-[1.75rem] capitalize text-[#979797]">
          Welcome, <span className="font-lora text-[#1C1C1C]">{userName}</span>
        </h2>

        <div className="font-inter font-light capitalize flex items-center">
          <span>Araafit</span>
          <CaretRightIcon className="text-[#979797]" />
          <span className="text-[#979797]">{breadCrumb}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-primary-500 font-medium">My Measurement</span>
        <div className="size-[40px] border border-neutral-100 rounded-[0.327rem] flex items-center justify-center hover:cursor-pointer">
          <BellIcon className="size-[1.25rem] block" />
        </div>
      </div>
    </div>
  );
}
