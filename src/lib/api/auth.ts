import {
  AuthResponse,
  LoginPayload,
  ResetPasswordPayload,
  SignupPayload,
} from "@/lib/types/auth";

/**
 * Stubbed auth service layer. Swap the body of each function for a real
 * `apiFetch<AuthResponse>("/auth/...", { method: "POST", body: ... })` call
 * once the backend is available. Signatures are designed to match a typical
 * REST auth endpoint so callers never need to change.
 */

function simulateNetworkDelay(ms = 900): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  // TODO: replace with real POST /auth/login call once backend is available
  await simulateNetworkDelay();
  return { success: true, message: "Logged in successfully." };
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  // TODO: replace with real POST /auth/signup call once backend is available
  await simulateNetworkDelay();
  return { success: true, message: "Account created successfully." };
}

export async function requestPasswordReset(
  payload: ResetPasswordPayload
): Promise<AuthResponse> {
  // TODO: replace with real POST /auth/reset-password call once backend is available
  await simulateNetworkDelay();
  return { success: true, message: "Reset link sent." };
}
