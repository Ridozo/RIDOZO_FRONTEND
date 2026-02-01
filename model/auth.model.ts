// --------------------
// USER SIGNUP
// --------------------
export interface UserSignupRequest {
  fullName: string;
  mobileNo: string;
  email: string;
  city: string;
  password: string;
  isActive: boolean;
}

export interface UserSignupResponse {
  message: string;
  userId: number;
}

// --------------------
// VERIFY OTP (SIGNUP)
// --------------------
export interface VerifyOtpRequest {
  email?: string;
  mobileNo?: string;
  emailOtp: string;
  mobileOtp: string; // use "000000" in dev
}

export interface VerifyOtpResponse {
  message: string;
  token?: string;
}

// --------------------
// SET PASSWORD
// --------------------
export interface SetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SetPasswordResponse {
  message: string;
}

// --------------------
// SEND MOBILE OTP
// --------------------
export interface SendMobileOtpRequest {
  mobileNo: string;
}

export interface SendMobileOtpResponse {
  message: string;
}

// --------------------
// LOGIN WITH OTP
// --------------------
export interface LoginWithOtpRequest {
  mobileNo: string;
  otp: string;
}

export interface LoginWithOtpResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// --------------------
// LOGIN WITH PASSWORD
// --------------------
export interface LoginWithPasswordRequest {
  mobileNo: string;
  password: string;
}

export interface LoginWithPasswordResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// --------------------
// COMMON USER MODEL
// --------------------
export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  mobileNo: string;
  role?: string;
}
