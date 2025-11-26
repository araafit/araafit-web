import React, { type ReactElement } from "react";
import { BellIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

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
          <h2 className="font-medium text-lg lg:text-[1.75rem] capitalize">
            {title}
          </h2>
          {breadCrumb}
        </div>
      )}

      {rightSide ? (
        rightSide
      ) : (
        <div className="flex items-center gap-2 lg:gap-6">
          <Link
            to="/dashboard/profile?tab=measurement"
            className="text-primary-500 font-medium text-sm lg:text-base hidden sm:block"
          >
            My Measurements
          </Link>
<<<<<<< Updated upstream
          <div className="size-[32px] lg:size-[40px] border border-neutral-100 rounded-[0.327rem] flex items-center justify-center hover:cursor-pointer">
            <BellIcon className="size-[1rem] lg:size-[1.25rem] block" />
=======

          <div className="relative">
            <button
              title="notification"
              className="size-[32px] lg:size-[40px] border border-neutral-100 rounded-[0.327rem] flex items-center justify-center hover:cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <BellIcon className="size-[1rem] lg:size-[1.25rem] block" />
              <Spinner
                size="sm"
                speed="fast"
                arcColor="#9A6C50"
                isLoading={isLoading}
                className="absolute -top-1 -right-1 bg-white"
              />
              {!isLoading && userNotifications && (
                <span className="absolute -top-1 -right-1 bg-primary-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center p-1">
                  {userNotifications.total}
                </span>
              )}
            </button>

            {/* Notification */}
            {!isLoading && !isError && (
              <UserNotification
                isOpen={isOpen}
                onClose={() => {
                  setIsOpen(!isOpen);
                }}
                className="w-[500px]"
                data={userNotifications}
                markAsRead={(id: string) => handleMarkAsRead(id)}
                removeNotification={(id: string) => removeNotification(id)}
                toggleNotification={(id: string) => toggleNotification(id)}
                expandedId={expandedId}
              />
            )}
>>>>>>> Stashed changes
          </div>
        </div>
      )}
    </div>
  );
}
