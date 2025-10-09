import React, { type ReactElement } from "react";
import { BellIcon } from "@phosphor-icons/react";

/* -------------------------------------------------------------------- */

type TopBarType = {
  title: React.ReactNode;
  breadCrumb: React.ReactNode;
  notificationCount?: number | string;
  className?: string;
  leftSide?: ReactElement;
  rightSide?: ReactElement;
};

export default function TopBar({
  rightSide,
  leftSide,
  title,
  breadCrumb = "home",
}: TopBarType) {


  return (
    <div className="w-full h-[4.8125rem] mt-8 lg:mt-0 lg:absolute top-0 left-0 bg-white px-4 lg:px-10 py-[0.375rem] flex items-center justify-between">
      {leftSide ? (
        leftSide
      ) : (
        <div className="flex flex-col gap-1 lg:gap-2">
          <h2 className="font-medium text-lg lg:text-[1.75rem] capitalize">{title}</h2>
          {breadCrumb}
        </div>
      )}

      {rightSide ? (
        rightSide
      ) : (
        <div className="flex items-center gap-2 lg:gap-6">
          <span className="text-primary-500 font-medium text-sm lg:text-base hidden sm:block">My Measurements</span>
          <div className="size-[32px] lg:size-[40px] border border-neutral-100 rounded-[0.327rem] flex items-center justify-center hover:cursor-pointer">
            <BellIcon className="size-[1rem] lg:size-[1.25rem] block" />
          </div>
        </div>
      )}
    </div>
  );
}
