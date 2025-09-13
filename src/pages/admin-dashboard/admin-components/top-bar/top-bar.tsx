import React, { type ReactElement } from "react";

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
    <div className="h-[4.8125rem] fixed top-0 z-50 lg:left-[12.375rem] w-full lg:w-[calc(100%-12.375rem)] bg-white px-10 py-[0.375rem] flex items-center justify-between">
      {leftSide ? (
        leftSide
      ) : (
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-[1.75rem] capitalize">{title}</h2>
          {breadCrumb}
        </div>
      )}

      {rightSide && (
        <div className="lg:flex hidden items-center gap-6">{rightSide}</div>
      )}
    </div>
  );
}
