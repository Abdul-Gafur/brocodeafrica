import {
  AuthResponse,
  AuthUser,
  ChangePasswordPayload,
  UpdateProfilePayload,
  UserPreferences,
} from "@/lib/types/auth";
import { apiFetch } from "@/lib/api/client";

/**
 * The signed-in user's own account endpoints (`/api/v1/user/*`). All require a
 * bearer token, which `apiFetch` attaches automatically.
 *
 * `updateProfile` / `updatePreferences` return the fresh `AuthUser`; the caller
 * is expected to push it into the auth context.
 */

export function updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
  return apiFetch<AuthUser>("/user/profile", {
    method: "PATCH",
    body: JSON.stringify({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone ?? null,
    }),
  });
}

export function changePassword(
  payload: ChangePasswordPayload
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/user/password", {
    method: "PUT",
    body: JSON.stringify({
      current_password: payload.currentPassword,
      password: payload.password,
      password_confirmation: payload.passwordConfirmation,
    }),
  });
}

export function updatePreferences(
  patch: Partial<UserPreferences>
): Promise<AuthUser> {
  return apiFetch<AuthUser>("/user/preferences", {
    method: "PATCH",
    // `null` clears a preference; `undefined` keys are dropped by JSON.stringify.
    body: JSON.stringify({
      ...(("maGuyModel" in patch)
        ? { maGuyModel: patch.maGuyModel ?? null }
        : {}),
    }),
  });
}

export function deleteAccount(currentPassword: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/user", {
    method: "DELETE",
    body: JSON.stringify({ current_password: currentPassword }),
  });
}
