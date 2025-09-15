import apiClient from '../lib/axios';

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

// Admin User interface (simpler than regular user)
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Request/Response Types for Admin Auth
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  user: AdminUser;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface AdminForgotPasswordRequest {
  email: string;
}

export interface AdminForgotPasswordResponse {
  isSuccess: boolean;
  message: string;
}

export interface AdminResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AdminResetPasswordResponse {
  isSuccess: boolean;
  message: string;
}

export interface AdminLogoutRequest {
  refreshToken: string;
}

export interface AdminLogoutResponse {
  message: string;
}

// Admin Auth Service Class
class AdminAuthService {
  /**
   * Admin login
   */
  async login(data: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await apiClient.post<ApiResponse<AdminLoginResponse>>('/admin/login', data);
    return response.data.data;
  }

  /**
   * Admin forgot password
   */
  async forgotPassword(data: AdminForgotPasswordRequest): Promise<AdminForgotPasswordResponse> {
    const response = await apiClient.post<AdminForgotPasswordResponse>('/admin/forgot-password', data);
    return response.data;
  }

  /**
   * Admin reset password
   */
  async resetPassword(data: AdminResetPasswordRequest): Promise<AdminResetPasswordResponse> {
    const response = await apiClient.post<AdminResetPasswordResponse>('/admin/reset-password', data);
    return response.data;
  }

  /**
   * Admin logout
   */
  async logout(data: AdminLogoutRequest): Promise<AdminLogoutResponse> {
    const response = await apiClient.post<AdminLogoutResponse>('/admin/logout', data);
    return response.data;
  }
}

// Export singleton instance
export const adminAuthService = new AdminAuthService();
export default adminAuthService;
