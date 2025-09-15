import {
  MoneyIcon,
  UserIcon,
  DressIcon,
  //ShoppingBagIcon,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { type AdminDashboardMetrics } from "../services/admin-dashboard.service";

// Overview card type
export type OverviewFigures = {
  title: string;
  figures: string;
  icon: ComponentType<any>;
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-NG').format(num);
};

// Convert metrics to overview cards
export const convertMetricsToOverviewCards = (metrics: AdminDashboardMetrics): OverviewFigures[] => {
  return [
    {
      title: "Total Revenue",
      figures: formatCurrency(metrics.totalRevenue),
      icon: MoneyIcon,
    },
    {
      title: "Total Customers",
      figures: formatNumber(metrics.totalCustomer),
      icon: UserIcon,
    },
    {
      title: "Total Orders",
      figures: formatNumber(metrics.totalOrders),
      icon: DressIcon,
    },
  ];
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get status color classes
export const getStatusColorClasses = (status: string) => {
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
    sewing: {
      textColor: "text-[#8B5CF6]",
      bgColor: "bg-[#F3E8FF]",
    },
    "out for delivery": {
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
    canceled: {
      textColor: "text-[#DC2626]",
      bgColor: "bg-[#FEE2E2]",
    },
  };

  return statusMap[status.toLowerCase()] || {
    textColor: "text-[#6B7280]",
    bgColor: "bg-[#F3F4F6]",
  };
};
