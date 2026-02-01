import { api } from "../lib/api";
import type {
  UserSignupRequest,
  UserSignupResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  SetPasswordRequest,
  SetPasswordResponse,
  SendMobileOtpRequest,
  SendMobileOtpResponse,
  LoginWithOtpRequest,
  LoginWithOtpResponse,
  LoginWithPasswordRequest,
  LoginWithPasswordResponse,
} from "../model/auth.model";

class AuthService {
  private baseUrl = "/auth";

  // USER SIGNUP
  async userSignup(
    data: UserSignupRequest
  ): Promise<UserSignupResponse> {
    const response = await api.post<UserSignupResponse>(
      `${this.baseUrl}/user-signup`,
      data
    );
    return response.data;
  }

  // VERIFY OTP
  async verifyOtp(
    data: VerifyOtpRequest
  ): Promise<VerifyOtpResponse> {
    const response = await api.post<VerifyOtpResponse>(
      `${this.baseUrl}/verify-otp`,
      data
    );
    return response.data;
  }

  // SET PASSWORD
  async setPassword(
    data: SetPasswordRequest
  ): Promise<SetPasswordResponse> {
    const response = await api.post<SetPasswordResponse>(
      `${this.baseUrl}/set-password`,
      data
    );
    return response.data;
  }

  // SEND MOBILE OTP
  async sendMobileOtp(
    data: SendMobileOtpRequest
  ): Promise<SendMobileOtpResponse> {
    const response = await api.post<SendMobileOtpResponse>(
      `${this.baseUrl}/send-mobile-otp`,
      data
    );
    return response.data;
  }

  // LOGIN WITH OTP
  async loginWithOtp(
    data: LoginWithOtpRequest
  ): Promise<LoginWithOtpResponse> {
    const response = await api.post<LoginWithOtpResponse>(
      `${this.baseUrl}/user-login/login-with-otp`,
      data
    );
    return response.data;
  }

  // LOGIN WITH PASSWORD
  async loginWithPassword(
    data: LoginWithPasswordRequest
  ): Promise<LoginWithPasswordResponse> {
    const response = await api.post<LoginWithPasswordResponse>(
      `${this.baseUrl}/user-login/login-with-password`,
      data
    );
    return response.data;
  }
}

export const authService = new AuthService();
