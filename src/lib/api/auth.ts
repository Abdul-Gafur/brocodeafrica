import {
  AuthResponse,
  LoginPayload,
  ResetPasswordConfirmPayload,
  ResetPasswordPayload,
  SignupPayload,
} from "@/lib/types/auth";
import { apiFetch } from "@/lib/api/client";

/**
 * Real auth calls against `/api/v1/auth/*`. Signatures are unchanged so
 * callers never need to change.
 *
 * `login` / `signup` also return `token` and `user`; we stash the bearer
 * token in localStorage so `logout` can revoke it. Swap this for a proper
 * session store when one exists.
 */

const TOKEN_KEY = "brocode.auth.token";

interface AuthSuccess extends AuthResponse {
  token?: string;
}

function storeToken(token?: string): void {
  if (typeof window === "undefined" || !token) {
    return;
  }
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* private mode / storage disabled — token just isn't remembered */
  }
}

function readToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function clearToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* nothing to clear */
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await apiFetch<AuthSuccess>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  storeToken(res.token);
  return { success: res.success, message: res.message };
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
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
  storeToken(res.token);
  return { success: res.success, message: res.message };
}

export async function logout(): Promise<AuthResponse> {
  const token = readToken();
  try {
    return await apiFetch<AuthResponse>("/auth/logout", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } finally {
    clearToken();
  }
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
