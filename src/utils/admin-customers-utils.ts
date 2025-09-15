import { ShoppingBag, UserIcon } from "lucide-react";
import type { AdminCustomer, CustomerMetrics, CustomerDetailMetrics } from "../services/admin-customers.service";
import { DressIcon, ShoppingCartIcon } from "@phosphor-icons/react";

// Utility functions for formatting customer data

export const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateString;
  }
};

// Convert API customer data to table format
export const convertApiCustomerToTableFormat = (customer: AdminCustomer) => ({
  orderId: customer.id,
  deliveryInformation: {
    name: customer.name,
    email: customer.email,
  },
  TotalAmount: 0, // Not provided in list endpoint, could be fetched separately if needed
  Date: formatDateTime(customer.joinedAt),
  status: customer.status,
});

export const convertApiCustomersToTableFormat = (customers: AdminCustomer[]) =>
  customers.map(convertApiCustomerToTableFormat);

// Get status color classes
export const getCustomerStatusClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return {
        bgColor: "bg-[#F0FDF5]",
        textColor: "text-[#16A34A]",
      };
    case "blocked":
    case "inactive":
      return {
        bgColor: "bg-[#FEF2F2]",
        textColor: "text-[#DC2626]",
      };
    default:
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
      };
  }
};

// Calculate customer metrics (would typically come from API)
export const calculateCustomerMetrics = (customers: AdminCustomer[]) => {
  const total = customers.length;
  const active = customers.filter(c => c.status === "Active").length;
  const blocked = customers.filter(c => c.status === "Blocked").length;
  
  return {
    totalCustomers: total,
    activeCustomers: active,
    blockedCustomers: blocked,
    newCustomersThisMonth: 0, // Would need additional data from API
  };
};

// Convert API metrics to overview cards format
export const convertCustomerMetricsToCards = (metrics: CustomerMetrics) => [
  {
    id: 1,
    title: "Total Customers",
    figures: metrics.totalCustomers.toLocaleString(),
    description: "All registered customers",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    icon: UserIcon,
  },
  {
    id: 2,
    title: "New Customers",
    figures: metrics.newCustomers.toLocaleString(),
    description: "Recently joined customers", 
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    icon: DressIcon,
  },
  {
    id: 3,
    title: "Total Revenue",
    figures: formatCurrency(metrics.totalAmountSpent),
    description: "Total amount spent by customers",
    bgColor: "bg-purple-50", 
    textColor: "text-purple-600",
    icon: ShoppingBag,
  },
];

// Convert customer detail metrics to overview cards format
export const convertCustomerDetailMetricsToCards = (metrics: CustomerDetailMetrics) => [
  {
    id: 1,
    title: "Total Orders",
    figures: metrics.totalOrders.toLocaleString(),
    description: "Completed orders",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    icon: ShoppingCartIcon,
  },
  {
    id: 2,
    title: "Total Requests",
    figures: metrics.totalRequests.toLocaleString(),
    description: "Tailoring requests", 
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    icon: DressIcon,
  },
  {
    id: 3,
    title: "Total Spent",
    figures: formatCurrency(metrics.totalAmountSpent),
    description: "Total amount spent",
    bgColor: "bg-purple-50", 
    textColor: "text-purple-600",
    icon: ShoppingBag,
  },
  //{
  //  id: 4,
  //  title: "Order Amount",
  //  figures: formatCurrency(metrics.orderAmount),
  //  description: "Amount from orders",
  //  bgColor: "bg-orange-50", 
  //  textColor: "text-orange-600",
  //  icon: ShoppingCartIcon,
  //},
];
