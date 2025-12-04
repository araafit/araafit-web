import React, { useEffect } from "react";
import {
  useEnableEmailNotification,
  useEnableInAppNotification,
} from "../../../hooks/notification.hook";
import Spinner from "../../../shared-components/spinner";

/* -------------------------------------------------- */

interface Notifications {
  setEmail: boolean;
  setOrder: boolean;
  setInApp: boolean;
  setPromotional: boolean;
}

const NotificationToggle = ({
  isToggled,
  onClick,
}: {
  isToggled: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`w-[32px] h-[20px] p-[2px] rounded-xl relative cursor-pointer transition-colors duration-300 ${
        isToggled ? "bg-primary-500" : "bg-neutral-300"
      }`}
      onClick={onClick}
    >
      <div
        className={`size-[1rem] bg-white rounded-full absolute top-1/2 ${
          isToggled ? "left-[70%]" : "left-[30%]"
        } -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}
      />
    </div>
  );
};

/**
 * Notification settings
 *
 * @returns ReactElement
 */
export default function Notification() {
  const [notifications, setNotifications] = React.useState<Notifications>({
    setEmail: false,
    setOrder: false,
    setInApp: false,
    setPromotional: false,
  });

  const enabledInAppNotification = useEnableInAppNotification();
  const enableEmailNotification = useEnableEmailNotification();

  const toggleNotificaton = (
    notification: "setEmail" | "setOrder" | "setInApp" | "setPromotional"
  ) => {
    if (notification == "setEmail") {
      setNotifications({ ...notifications, setEmail: !notifications.setEmail });

      enableEmailNotification.mutate(!notifications.setEmail);
    }

    // if (notification == "setOrder") {
    //   setNotifications({ ...notifications, setOrder: !notifications.setOrder });
    // }

    if (notification == "setInApp") {
      setNotifications({ ...notifications, setInApp: !notifications.setInApp });
      enabledInAppNotification.mutate(!notifications.setInApp);
    }

    if (notification == "setPromotional") {
      setNotifications({
        ...notifications,
        setPromotional: !notifications.setPromotional,
      });
    }
  };

  useEffect(() => {
    if (enabledInAppNotification.isSuccess && enabledInAppNotification.data) {
      setNotifications((prev) => ({
        ...prev,
        setInApp: enabledInAppNotification.data.receiveInAppNotifications,
      }));
    }
  }, [enabledInAppNotification.isSuccess, enabledInAppNotification.data]);

  useEffect(() => {
    if (enableEmailNotification.isSuccess && enableEmailNotification.data) {
      setNotifications((prev) => ({
        ...prev,
        setEmail: enableEmailNotification.data.receiveEmailNotifications,
      }));
    }
  }, [enableEmailNotification.isSuccess, enableEmailNotification.data]);

  return (
    <div className="size-full bg-white py-5 px-8 rounded-md flex flex-col gap-6">
      <h5 className="text-[2rem] font-semibold">Notification Settings</h5>

      <div className="flex flex-col gap-2">
        <span className="text-neutral-950">Email notification</span>
        <div className="w-full h-[55px] bg-primary-50 rounded-md flex items-center justify-start px-6">
          <div className="flex space-x-3">
            <NotificationToggle
              isToggled={notifications.setEmail}
              onClick={() => toggleNotificaton("setEmail")}
            />
            <span className="text-[0.875rem]">
              Notify me via email once payment is made.
            </span>
            <Spinner
              isLoading={enableEmailNotification.isPending}
              speed="fast"
              size="sm"
              arcColor="#9A6C50"
            />
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col gap-2">
        <span className="text-neutral-950">Order notification</span>
        <div className="w-full h-[55px] bg-primary-50 rounded-md flex items-center justify-start px-6">
          <div className="flex space-x-3">
            <NotificationToggle isToggled={notifications.setOrder} onClick={() => toggleNotificaton("setOrder")} />
            <span className="text-[0.875rem]">
              Get real-time alerts about your ongoing orders.
            </span>
          </div>
        </div>
      </div> */}

      <div className="flex flex-col gap-2">
        <span className="text-neutral-950">In-App notification</span>
        <div className="w-full h-[55px] bg-primary-50 rounded-md flex items-center justify-start px-6">
          <div className="flex space-x-3">
            <NotificationToggle
              isToggled={notifications.setInApp}
              onClick={() => toggleNotificaton("setInApp")}
            />
            <span className="text-[0.875rem]">
              Receive important updates directly in the app while you browse or
              shop.
            </span>
            <Spinner
              isLoading={enabledInAppNotification.isPending}
              speed="fast"
              size="sm"
              arcColor="#9A6C50"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-2">
          <span className="text-neutral-950">Promotional Messages</span>
          <div className="w-full h-[55px] bg-primary-50 rounded-md flex items-center justify-start px-6">
            <div className="flex space-x-3">
              <NotificationToggle
                isToggled={notifications.setPromotional}
                onClick={() => toggleNotificaton("setPromotional")}
              />
              <span className="text-[0.875rem]">
                Be the first to know about exclusive, style drops, and limited
                offers.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
