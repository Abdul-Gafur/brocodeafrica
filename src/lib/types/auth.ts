export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface ResetPasswordConfirmPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

/** Per-user settings written from the account page. */
export interface UserPreferences {
  /** Catalogue key of the preferred Ma Guy model; absent = platform default. */
  maGuyModel?: string;
}

/** The signed-in visitor, as returned by the API and cached in localStorage. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  preferences: UserPreferences;
  roles?: string[];
}

export interface UpdateProfilePayload {
  fullName: string;
  email: string;
  phone?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

/** `login` / `signup` resolve to this: the outcome plus the freshly signed-in user. */
export interface AuthSessionResponse extends AuthResponse {
  user: AuthUser;
}
