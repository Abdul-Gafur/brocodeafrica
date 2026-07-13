export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}
