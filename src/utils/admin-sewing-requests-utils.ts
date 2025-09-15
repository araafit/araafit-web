import { type AdminSewingRequest } from "../services/admin-sewing-requests.service";
import { formatCurrency, formatDate } from "./admin-dashboard-utils";

// Convert API sewing request to table format
export const convertApiSewingRequestToTableFormat = (apiRequest: AdminSewingRequest) => {
  return {
    orderId: apiRequest.id,
    dress: apiRequest.dressStyle || "Custom Dress",
    cost: apiRequest.totalAmount,
    status: apiRequest.status,
    image: apiRequest.fabric.images?.[0]?.url || "", // Use first fabric image
    size: apiRequest.size,
    PreferredStyle: apiRequest.dressStyle,
    YardEstimate: apiRequest.yardEstimate,
    PricePerYard: apiRequest.pricePerYard,
    TotalAmount: apiRequest.totalAmount,
    paymentMethod: "N/A", // Not provided in API response

    customerMeasurements: {
      Bust: apiRequest.bust,
      Waist: apiRequest.waist,
      Hips: apiRequest.hips,
      Shoulder: 0, // Not provided in API response
      Height: apiRequest.height.toString(),
      SkinTone: apiRequest.skinTone,
    },

    deliveryInformation: {
      name: `${apiRequest.user.firstName} ${apiRequest.user.lastName}`,
      email: apiRequest.user.email,
      address: "N/A", // Not provided in API response
      city: "N/A", // Not provided in API response
      phone: "N/A", // Not provided in API response
    },

    riderInformation: apiRequest.rider ? {
      name: apiRequest.rider.name,
      phone: apiRequest.rider.phone,
      vehicleNumber: "N/A", // Not provided in API response
      trackingId: "N/A", // Not provided in API response
    } : undefined,

    additionalInfo: apiRequest.noteForTailor || "No additional notes",

    // Additional sewing request specific fields
    fabric: {
      id: apiRequest.fabric.id,
      name: apiRequest.fabric.name,
      pricePerYard: apiRequest.fabric.pricePerYard,
      images: apiRequest.fabric.images || [],
    },
    dressSize: apiRequest.dressSize,
  };
};

// Convert multiple API sewing requests to table format
export const convertApiSewingRequestsToTableFormat = (apiRequests: AdminSewingRequest[]) => {
  return apiRequests.map(convertApiSewingRequestToTableFormat);
};

// Get status color classes for sewing request status
export const getSewingRequestStatusColorClasses = (status: string) => {
  const statusMap: Record<string, { textColor: string; bgColor: string }> = {
    pending: {
      textColor: "text-[#F59E0B]",
      bgColor: "bg-[#FEF3C7]",
    },
    approved: {
      textColor: "text-[#16A34A]",
      bgColor: "bg-[#DCFCE7]",
    },
    sewing: {
      textColor: "text-[#8B5CF6]",
      bgColor: "bg-[#EDE9FE]",
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

// Format sewing request date for display
export const formatSewingRequestDate = (dateString: string): string => {
  return formatDate(dateString);
};

// Format sewing request amount for display
export const formatSewingRequestAmount = (amount: number): string => {
  return formatCurrency(amount);
};

// Calculate total amount from yard estimate and price per yard
export const calculateTotalAmount = (yardEstimate: number, pricePerYard: number): number => {
  return yardEstimate * pricePerYard;
};
