import apiClient from "../lib/axios";
import type { ApiResponse } from "./admin-auth.service";

// Types for Admin Dashboard Metrics
export interface AdminDashboardMetrics {
  totalRevenue: number;
  totalCustomer: number;
  totalOrders: number;
  newOrders: number;
  newRequests: number;
  mostRecentOrder: {
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  };
  mostRecentRequest: {
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    fabricName: string;
  };
}

export interface RecentActivity {
  id: string;
  customerName: string;
  activityType: "Order" | "Request";
  amountSpent: number;
  dateTime: string;
  detailsUrl: string;
}

export interface RecentActivitiesResponse {
  recentActivities: RecentActivity[];
}

// Admin Dashboard Service Class
class AdminDashboardService {
  /**
   * Get admin dashboard metrics
   */
  async getMetrics(): Promise<AdminDashboardMetrics> {
    const response = await apiClient.get<ApiResponse<AdminDashboardMetrics>>(
      "/admin/dashboard/metrics"
    );
    return response.data.data;
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(): Promise<RecentActivitiesResponse> {
    const response = await apiClient.get<ApiResponse<RecentActivitiesResponse>>(
      "/admin/dashboard/recent-activities"
    );
    return response.data.data;
  }
}

// Export singleton instance
export const adminDashboardService = new AdminDashboardService();
export default adminDashboardService;
