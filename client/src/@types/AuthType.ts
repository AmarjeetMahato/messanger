export interface RequestRegisterUserDto {
  email: string;
  password: string;
  username: string;
  roleName?: string;
  fullName?: string;
  avatarUrl?: string;
  mfaEnabled?: boolean;
}

export interface ResponseAuthDto {
  message: string;
  success: boolean;
}

export interface VerifyEmailWithOTP {
  otp: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
  fingerprint: string;
}

export interface LogoutResponse {
  message: string;
  success: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
