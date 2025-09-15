import { type AdminOrder } from "../services/admin-orders.service";
import { formatCurrency, formatDate } from "./admin-dashboard-utils";

// Convert API order to table format
export const convertApiOrderToTableFormat = (apiOrder: AdminOrder) => {
  return {
    orderId: apiOrder.id,
    dress: apiOrder.items[0]?.product.name || "N/A", // Use first item's product name
    cost: apiOrder.totalAmount,
    status: apiOrder.status,
    image: "", // Will need to be added to API response
    size: apiOrder.items[0]?.size || "N/A", // Use first item's size
    PreferredStyle: "N/A", // Will need to be added to API response
    YardEstimate: "N/A", // Will need to be added to API response
    PricePerYard: 0, // Will need to be added to API response
    TotalAmount: apiOrder.totalAmount,
    paymentMethod: "N/A", // Will need to be added to API response

    customerMeasurements: {
      Bust: 0, // Will need to be added to API response
      Waist: 0, // Will need to be added to API response
      Hips: 0, // Will need to be added to API response
      Shoulder: 0, // Will need to be added to API response
      Height: "N/A", // Will need to be added to API response
      SkinTone: "N/A", // Will need to be added to API response
    },

    deliveryInformation: {
      name: `${apiOrder.user.firstName} ${apiOrder.user.lastName}`,
      email: apiOrder.user.email,
      address: "N/A", // Will need to be added to API response
      city: "N/A", // Will need to be added to API response
      phone: "N/A", // Will need to be added to API response
    },

    riderInformation: apiOrder.rider ? {
      name: apiOrder.rider.name,
      phone: apiOrder.rider.phone,
      vehicleNumber: "N/A", // Will need to be added to API response
      trackingId: "N/A", // Will need to be added to API response
    } : undefined,

    additionalInfo: "N/A", // Will need to be added to API response

    // Add API timestamp fields
    createdAt: apiOrder.createdAt,
    deliveryDate: apiOrder.deliveryDate,
  };
};

// Convert multiple API orders to table format
export const convertApiOrdersToTableFormat = (apiOrders: AdminOrder[]) => {
  return apiOrders.map(convertApiOrderToTableFormat);
};

// Get status color classes for order status
export const getOrderStatusColorClasses = (status: string) => {
  const statusMap: Record<string, { textColor: string; bgColor: string }> = {
    pending: {
      textColor: "text-[#F59E0B]",
      bgColor: "bg-[#FEF3C7]",
    },
    approved: {
      textColor: "text-[#16A34A]",
      bgColor: "bg-[#DCFCE7]",
    },
    packaging: {
      textColor: "text-[#0EA5E9]",
      bgColor: "bg-[#E0F2FE]",
    },
    out_for_delivery: {
      textColor: "text-[#2563EB]",
      bgColor: "bg-[#EFF4FF]",
    },
    delivered: {
      textColor: "text-[#059669]",
      bgColor: "bg-[#ECFDF8]",
    },
    complete: {
      textColor: "text-[#475569]",
      bgColor: "bg-[#F1F5F9]",
    },
    cancelled: {
      textColor: "text-[#DC2626]",
      bgColor: "bg-[#FEE2E2]",
    },
    paid: {
      textColor: "text-[#7C3AED]",
      bgColor: "bg-[#F3E8FF]",
    },
  };

  return statusMap[status.toLowerCase()] || {
    textColor: "text-[#6B7280]",
    bgColor: "bg-[#F3F4F6]",
  };
};

// Format order date for display
export const formatOrderDate = (dateString: string): string => {
  return formatDate(dateString);
};

// Format order amount for display
export const formatOrderAmount = (amount: number): string => {
  return formatCurrency(amount);
};
