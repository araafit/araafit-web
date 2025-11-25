import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { CN } from "../../utils/class-merge";

/* ------------------------------------------------ */

export const UserNotification = ({
  isOpen,
  onClose,
  className,
  markAsRead,
  removeNotification,
  toggleNotification,
  expandedId,
  data: notifications,
}: {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  toggleNotification: (id: string) => void;
  expandedId: null | number;
  data?: any
}) => {

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
    const diffMs = now - date;
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

  const NotificationList = () => {
    return notifications.map((notification) => (
      <div
        key={notification.id}
        className={`border-2 rounded-xl transition-all duration-300 ${getNotificationColor(
          notification.type
        )} ${!notification.isRead ? "border-l-4" : ""}`}
      >
        {/* Notification Header */}
        <div
          className="flex items-start gap-3 p-4 cursor-pointer hover:bg-white/30 rounded-xl transition-colors"
          onClick={() => toggleNotification(notification.id)}
        >
          <div className="mt-1">{getNotificationIcon(notification.type)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm">{notification.title}</h3>
              <span className="text-xs opacity-70 whitespace-nowrap">
                {formatDate(notification.createdAt)}
              </span>
            </div>
            <p
              className={`text-sm mt-1 ${
                expandedId === notification.id ? "" : "line-clamp-2"
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
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded detail */}
        {expandedId === notification.id && (
          <div className="px-4 pb-4 border-t border-current/20 pt-3 mt-2">
            <div className="bg-white/50 rounded-lg p-3 space-y-3">
              {notification.type === "PURCHASE" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Order ID:</span>
                    <span className="font-mono text-xs">
                      {notification.metadata.orderId.substring(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold">
                      {formatAmount(notification.metadata.totalAmount)}
                    </span>
                  </div>
                </>
              )}

              {notification.type === "CART" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Quantity:</span>
                    <span>{notification.metadata.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Size:</span>
                    <span className="font-bold">
                      {notification.metadata.size}
                    </span>
                  </div>
                </>
              )}

              {notification.type === "DELIVERY" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Order ID:</span>
                    <span className="font-mono text-xs">
                      {notification.metadata.orderId.substring(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Est. Delivery:</span>
                    <span className="font-bold">
                      {notification.metadata.estimatedDelivery}
                    </span>
                  </div>
                </>
              )}

              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="w-full mt-2 px-3 py-2 bg-white rounded-lg text-sm font-medium hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className={`${CN('bg-white rounded-2xl shadow-2xl p-6 mb-6 fixed right-9', className)}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        <button
          title="close notification"
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No notifications</p>
        ) : (
          <NotificationList />
        )}
      </div>
    </div>
  );
};
