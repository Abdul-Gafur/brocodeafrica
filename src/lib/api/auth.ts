import {
  AuthResponse,
  AuthSessionResponse,
  AuthUser,
  LoginPayload,
  ResetPasswordConfirmPayload,
  ResetPasswordPayload,
  SignupPayload,
} from "@/lib/types/auth";
import { apiFetch, ApiError } from "@/lib/api/client";
import { clearSession, getToken, setSession } from "@/lib/auth/session";

/**
 * Real auth calls against `/api/v1/auth/*`.
 *
 * `login` / `signup` persist the bearer token + user through
 * `@/lib/auth/session`, which is also what `apiFetch` reads and what
 * `AuthProvider` subscribes to. Everything else here just forwards to the API.
 */

interface AuthSuccess extends AuthResponse {
  token: string;
  user: AuthUser;
}

export async function login(payload: LoginPayload): Promise<AuthSessionResponse> {
  const res = await apiFetch<AuthSuccess>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setSession(res.token, res.user);
  return { success: res.success, message: res.message, user: res.user };
}

export async function signup(payload: SignupPayload): Promise<AuthSessionResponse> {
  const res = await apiFetch<AuthSuccess>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      // Laravel's `confirmed` rule expects this exact snake_case key.
      password_confirmation: payload.passwordConfirmation,
    }),
  });
  setSession(res.token, res.user);
  return { success: res.success, message: res.message, user: res.user };
}

export async function logout(): Promise<AuthResponse> {
  const token = getToken();
  try {
    return await apiFetch<AuthResponse>("/auth/logout", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (error) {
    // 401: the token was already revoked (account closed, password reset, or
    // signed out elsewhere). The visitor is signed out either way.
    if (error instanceof ApiError && error.status === 401) {
      return { success: true, message: "Signed out." };
    }
    throw error;
  } finally {
    clearSession();
  }
}

/**
 * The signed-in user for the current token. Used on load to confirm a stored
 * token is still good (and to pick up a verification that happened elsewhere).
 * Throws {@link ApiError} 401 when the token has been revoked.
 */
export function fetchCurrentUser(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/user", { cache: "no-store" });
}

/** Re-send the "confirm your email" message to the signed-in user. */
export function resendVerificationEmail(): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/email/verification-notification", {
    method: "POST",
  });
}

export async function requestPasswordReset(
  payload: ResetPasswordPayload
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(
  payload: ResetPasswordConfirmPayload
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
