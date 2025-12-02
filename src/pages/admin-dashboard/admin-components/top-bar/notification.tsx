import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "../../../ui/popover";
import { BellIcon, XIcon, CheckIcon } from "@phosphor-icons/react";
import {
  useAdminNotifications,
  useMarkAdminNotificationAsRead,
  useAdminDeleteNotification,
  adminNotificationsKeys,
} from "../../../../hooks/admin-notification.hooks";
import type { CartMetadata, NotificationResponse, PurchaseMetadata } from "../../../../services/admin-notification.service";
import { useState } from "react";
import Spinner from "../../../../shared-components/spinner";
import { useMutationState } from "@tanstack/react-query";

/* ---------------------------------------------------------------------------------------------------- */

const getNotificationIcon = (type) => {
  switch (type) {
    case "PURCHASE":
      return <span className="text-xl">🧾</span>;
    case "CART":
      return <span className="text-xl">🛒</span>;
    case "DELIVERY":
      return <span className="text-xl">🚚</span>;
    default:
      return <span className="w-5 h-5">🔔</span>;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case "PURCHASE":
      return "bg-green-50 border-green-200 text-green-800";
    case "CART":
      return "bg-blue-50 border-blue-200 text-blue-800";
    case "DELIVERY":
      return "bg-amber-50 border-amber-200 text-amber-800";
    default:
      return "bg-gray-50 border-gray-200 text-gray-800";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

 const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

/**
 * 
 * @param param0
 *  
 * @returns ReactElement
 */
const NotificationList = ({
  markAsRead,
  removeNotification,
  toggleNotification,
  expandedId,
  data: notificationData,
}: {
  data: NotificationResponse | undefined;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  toggleNotification: (id: string) => void;
  expandedId: null | number;
}) => {
   const updateMutation = useMutationState({
    filters: { mutationKey: adminNotificationsKeys.update("update54321") },
  });

  // const deletionState = deleteMutation[deleteMutation.length - 1];
  const updateState = updateMutation[updateMutation.length - 1];
  
  if (!notificationData) {
    return (
      <h3 className="font-inter text-[#3D3D3D]">You’ve no new notification!</h3>
    );
  }

  return notificationData.data.map((notification) => (
    <div
      key={notification.id}
      className={`rounded-xl transition-all duration-300 ${getNotificationColor(
        notification.type
      )} ${!notification.isRead ? "border-l-2" : ""}`}
    >
      {/* Notification header */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-white/30 rounded-xl transition-colors"
        onClick={() => toggleNotification(notification.id)}
      >
        <div className="mt-1">{getNotificationIcon(notification.type)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm font-inter">
              {notification.title}
            </h3>
            <span className="text-xs opacity-70 whitespace-nowrap">
              {formatDate(notification.createdAt)}
            </span>
          </div>
          <p
            className={`text-sm mt-1 ${
              (expandedId as unknown as string) === notification.id
                ? ""
                : "line-clamp-2"
            }`}
          >
            {notification.message}
          </p>
        </div>

        <button
          title="close"
          onClick={(e) => {
            e.stopPropagation();
            removeNotification(notification.id);
          }}
          className="p-1 hover:bg-white/50 rounded-full transition-colors"
        >
          <div className="flex items-center gap-1">
            <XIcon className="w-4 h-4" />
            {/* <Spinner isLoading={deletionState?.status === "pending"} size="sm" speed="fast" circleColor="#1e40af" arcColor="#e5e5e5" /> */}
          </div>
        </button>
      </div>


      {/* Expanded detail */}
        {(expandedId as unknown as string) === notification.id && (
          <div className="px-4 pb-4 border-t border-current/20 pt-3 mt-2">
            <div className="bg-white/50 rounded-lg p-3 space-y-3">
              {notification.type === "PURCHASE" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Order ID:</span>
                    <span className="font-mono text-xs">
                      {(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        notification.metadata as any
                      ).requestId?.substring(0, 8)}
                      ...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold">
                      {formatAmount(
                        (notification.metadata as PurchaseMetadata).totalAmount
                      )}
                    </span>
                  </div>
                </>
              )}

              {notification.type === "CART" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Quantity:</span>
                    <span>
                      {(notification.metadata as CartMetadata).quantity}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Size:</span>
                    <span className="font-bold">
                      {(notification.metadata as CartMetadata).size}
                    </span>
                  </div>
                </>
              )}

              {/* {notification.type === "DELIVERY" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Order ID:</span>
                    <span className="font-mono text-xs">
                      {(notification.metadata as PurchaseMetadata).orderId.substring(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Est. Delivery:</span>
                    <span className="font-bold">
                      {(notification.metadata as any).estimatedDelivery}
                    </span>
                  </div>
                </>
              )} */}

              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="w-full mt-2 px-3 py-2 bg-white rounded-lg text-sm font-medium hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  Mark as Read
                  <Spinner
                    isLoading={updateState?.status === "pending"}
                    size="sm"
                    speed="fast"
                    circleColor="#1e40af"
                    arcColor="#e5e5e5"
                  />
                </button>
              )}
            </div>
          </div>
        )}
    </div>
  ));
};

const AdminNotification = () => {
  const markAsRead = useMarkAdminNotificationAsRead();
  const deleteNotification = useAdminDeleteNotification();

  const {
    data: notification,
  } = useAdminNotifications();

  const [expandedId, setExpandedId] = useState(null);

  const handleMarkAsRead = async (id) => {
    await markAsRead.mutateAsync(id);
  };

  const removeNotification = async (id) => {
    await deleteNotification.mutateAsync(id);
  };

  const toggleNotification = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };


  return (
    <Popover>
      <PopoverTrigger>
        <div className="size-[40px] border border-neutral-100 rounded-[0.327rem] flex items-center justify-center hover:cursor-pointer">
          <BellIcon className="size-[1.25rem] block" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[500px]">
       <div className="flex items-center justify-between">
        <div />
         <PopoverClose asChild>
          <XIcon className="text-red-500 text-3xl cursor-pointer" />
        </PopoverClose>
       </div>

        <div className="max-h-[500px] overflow-y-scroll space-y-3">
        <NotificationList
          data={notification}
          markAsRead={(id: string) => handleMarkAsRead(id)}
          removeNotification={(id: string) => removeNotification(id)}
          toggleNotification={(id: string) => toggleNotification(id)}
          expandedId={expandedId}
        />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminNotification;
