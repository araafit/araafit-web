import React, { useState, type ReactElement } from "react";
import { BellIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { UserNotification } from "../../layouts/user-dashboard/notification";

/* -------------------------------------------------------------------- */

const notificationState = [
  {
    id: "1cb86fdb-a727-4889-92bb-705406b778e8",
    type: "PURCHASE",
    title: "Order Created",
    message:
      "Your order (333403cc-bf5f-4b5a-9be6-4cbaaf1e8aae) has been created successfully. Redirecting to payment.",
    metadata: {
      orderId: "333403cc-bf5f-4b5a-9be6-4cbaaf1e8aae",
      totalAmount: "20000.00",
    },
    isRead: false,
    createdAt: "2025-11-19T07:44:08.557Z",
  },
  {
    id: "546f9b3b-d92a-4749-bb9c-526458de0b3a",
    type: "CART",
    title: "Item Added to Cart",
    message: "Sleeping Dress has been added to your cart.",
    metadata: {
      productId: "cb088133-058e-43d9-aafb-ee66fed5678c",
      quantity: 1,
      size: "M",
    },
    isRead: false,
    createdAt: "2025-11-19T07:40:53.668Z",
  },
  {
    id: "delivery-example",
    type: "DELIVERY",
    title: "Your order is on its way! 🚚",
    message:
      "Hang tight. Your custom-fit item is en route and will be with you shortly. We'll keep you updated every step of the way!",
    metadata: {
      orderId: "333403cc-bf5f-4b5a-9be6-4cbaaf1e8aae",
      estimatedDelivery: "Nov 26, 2025",
    },
    isRead: false,
    createdAt: "2025-11-20T10:30:00.000Z",
  },
];

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
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationState);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [expandedId, setExpandedId] = useState(null);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

   const toggleNotification = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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

          <div className="relative">
            <button
              title="notification"
              className="size-[32px] lg:size-[40px] border border-neutral-100 rounded-[0.327rem] flex items-center justify-center hover:cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <BellIcon className="size-[1rem] lg:size-[1.25rem] block" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification */}
            <UserNotification
              isOpen={isOpen}
              onClose={() => {
                setIsOpen(!isOpen);
              }}
              className="w-[500px]"
              data={notifications}
              markAsRead={(id: string) => markAsRead(id)}
              removeNotification={(id: string) => removeNotification(id)}
              toggleNotification={(id: string) => toggleNotification(id)}
              expandedId={expandedId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
