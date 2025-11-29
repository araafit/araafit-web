import apiClient from "../lib/axios";
import { type User } from "../stores/auth-store";
import { type AuthTokens } from "../lib/utils";

/* ------------------------------------------------------ */

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

// Request/Response Types
export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmailResponse {
  [name: string]: unknown;
  message: string;
  isSuccess: boolean;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  [name: string]: unknown;
  isSuccess: boolean;
  message: string;
}

export interface GoogleAuthRequest {
  idToken: string;
  measurement?: {
    gender?: "male" | "female";
    // Shared
    waist?: number;
    height?: number;
    skinTone?: string;
    // Female
    bust?: number;
    hips?: number;
    dressSize?: string;
    // Male
    chest?: number;
    neck?: number;
    inseam?: number;
    shoulder?: number;
    size?: string;
  };
}

export interface GoogleAuthResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  deliveryAddress: string;
  password: string;
  gender: "male" | "female";
  measurement?: {
    gender?: "male" | "female";
    // Shared
    waist?: number;
    height?: number;
    skinTone?: string;
    // Female
    bust?: number;
    hips?: number;
    dressSize?: string;
    // Male
    chest?: number;
    neck?: number;
    inseam?: number;
    shoulder?: number;
    size?: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface GuestUserRequest {
  // Shared
  waist?: number;
  height?: number;
  skinTone?: string;
  gender?: "male" | "female";
  // Female
  bust?: number;
  hips?: number;
  // Male
  chest?: number;
  inseam?: number;
  shoulder?: number;
}

export interface GuestUserResponse {
  message: string;
  user: User;
  token: string;
}

export interface CompleteRegistrationRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  deliveryAddress: string;
  dateOfBirth: string;
}

export interface CompleteRegistrationResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  isSuccess: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  isSuccess: boolean;
  message: string;
}

export interface ResendOtpRequest {
  email: string;
}
export interface VerifyEmailWithMeasurementsRequest {
  email: string;
  measurement: {
    gender?: "male" | "female";
    // Shared
    waist?: number;
    height?: number;
    skinTone?: string;
    // Female
    bust?: number;
    hips?: number;
    dressSize?: string;
    // Male
    chest?: number;
    neck?: number;
    inseam?: number;
    shoulder?: number;
    size?: string;
  };
}

// Auth Service Class
class AuthService {
  /**
   *  O-auth registration with Google
   */

  async googleAuth(payload?: GoogleAuthRequest): Promise<GoogleAuthResponse> {
    const response = await apiClient.post<ApiResponse<GoogleAuthResponse>>(
      "/auth/google-auth",
      payload
    );

    return response.data.data;
  }

  /**
   * Send OTP to email for verification
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const response = await apiClient.post<ApiResponse<VerifyEmailResponse>>(
      "/auth/verify-email",
      data
    );
    return response.data.data;
  }

  /**
   * Send OTP to email for verification, including measurement data
   */
  async verifyEmailWithMeasurements(
    data: VerifyEmailWithMeasurementsRequest
  ): Promise<VerifyEmailResponse> {
    const response = await apiClient.post<ApiResponse<VerifyEmailResponse>>(
      "/auth/verify-email-with-measurements",
      data
    );
    return response.data.data;
  }

  /**
   * Verify OTP sent to email
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await apiClient.post<ApiResponse<VerifyOtpResponse>>(
      "/auth/verify-otp",
      data
    );
    return response.data.data;
  }

  /**
   * Resend OTP to email
   */
  async resendOtp(data: ResendOtpRequest): Promise<VerifyEmailResponse> {
    const response = await apiClient.post<ApiResponse<VerifyEmailResponse>>(
      "/auth/resend-otp",
      data
    );
    return response.data.data;
  }
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      "/auth/register",
      data
    );
    return response.data.data;
  }

  /**
   * Create a guest user
   */
  async createGuestUser(data: GuestUserRequest): Promise<GuestUserResponse> {
    const response = await apiClient.post<ApiResponse<GuestUserResponse>>(
      "/auth/guest-user",
      data
    );
    return response.data.data;
  }

  /**
   * Complete registration for guest user (upgrade to full user)
   */
  async completeRegistration(
    data: CompleteRegistrationRequest
  ): Promise<CompleteRegistrationResponse> {
    const response = await apiClient.patch<CompleteRegistrationResponse>(
      "/auth/complete-registration",
      data
    );
    return response.data;
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      data
    );
    return response.data.data;
  }

  /**
   * Logout user
   */
  async logout(data: LogoutRequest): Promise<LogoutResponse> {
    const response = await apiClient.post<LogoutResponse>("/auth/logout", data);
    return response.data;
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data
    );
    return response.data;
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ResetPasswordResponse>(
      "/auth/reset-password",
      data
    );
    return response.data;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>("/auth/get-profile");
    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
