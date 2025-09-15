import apiClient from "../lib/axios";

// Types for API responses
export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: "Active" | "Blocked";
}

export interface AdminCustomerDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  address: string;
  joinedAt: string;
  status: "Active" | "Blocked" | "Inactive";
  blockReason: string | null;
  amountSpent: number;
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
}

export interface GetCustomersResponse {
  users: AdminCustomer[];
  total: number;
  page: number;
  limit: number;
}

export interface BlockCustomerRequest {
  reason: string;
}

export interface BlockCustomerResponse {
  id: string;
  email: string;
  status: "Inactive";
  blockReason: string;
}

export interface UnblockCustomerResponse {
  message: string;
  user: {
    id: string;
    email: string;
    status: "Active";
    blockReason: null;
  };
}

export interface DeleteCustomerRequest {
  reason: string;
}

export interface DeleteCustomerResponse {
  message: string;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  totalAmountSpent: number;
}

export interface CustomerDetailMetrics {
  customerId: string;
  customerName: string;
  customerEmail: string;
  totalOrders: number;
  totalRequests: number;
  totalAmountSpent: number;
  orderAmount: number;
  requestAmount: number;
}

// Wrapper type for API responses
interface ApiResponse<T> {
  data: T;
}

class AdminCustomersService {
  async getCustomerMetrics(): Promise<CustomerMetrics> {
    const response = await apiClient.get<ApiResponse<CustomerMetrics>>("/customers/metrics");
    return response.data.data;
  }

  async getCustomers(
    params?: GetCustomersParams
  ): Promise<GetCustomersResponse> {
    const response = await apiClient.get<ApiResponse<GetCustomersResponse>>(
      "/customers",
      {
        params,
      }
    );
    return response.data.data;
  }

  async getCustomer(id: string): Promise<AdminCustomerDetail> {
    const response = await apiClient.get<ApiResponse<AdminCustomerDetail>>(
      `/customers/${id}`
    );
    return response.data.data;
  }

  async getCustomerDetailMetrics(id: string): Promise<CustomerDetailMetrics> {
    const response = await apiClient.get<ApiResponse<CustomerDetailMetrics>>(
      `/customers/${id}/metrics`
    );
    return response.data.data;
  }

  async blockCustomer(
    id: string,
    request: BlockCustomerRequest
  ): Promise<BlockCustomerResponse> {
    const response = await apiClient.patch<ApiResponse<BlockCustomerResponse>>(
      `/customers/${id}/block`,
      request
    );
    return response.data.data;
  }

  async unblockCustomer(id: string): Promise<UnblockCustomerResponse> {
    const response = await apiClient.patch<
      ApiResponse<UnblockCustomerResponse>
    >(`/customers/${id}/unblock`);
    return response.data.data;
  }

  async deleteCustomer(
    id: string,
    request: DeleteCustomerRequest
  ): Promise<DeleteCustomerResponse> {
    const response = await apiClient.delete<
      ApiResponse<DeleteCustomerResponse>
    >(`/customers/${id}`, {
      data: request,
    });
    return response.data.data;
  }
}

export const adminCustomersService = new AdminCustomersService();
