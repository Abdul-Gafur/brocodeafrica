"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  resendVerificationEmail,
  signup as signupRequest,
} from "@/lib/api/auth";
import {
  clearSession,
  getServerSessionSnapshot,
  getSessionSnapshot,
  setStoredUser,
  subscribeToSession,
} from "@/lib/auth/session";
import { ApiError } from "@/lib/api/client";
import { AuthUser, LoginPayload, SignupPayload } from "@/lib/types/auth";

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  /** Re-send the verification email; resolves to the API's message. */
  resendVerification: () => Promise<string>;
  /** Re-read the user from the API (e.g. after verifying in another tab). */
  refresh: () => Promise<void>;
  /** Push a fresh user (e.g. returned by an account update) into the session. */
  applyUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // The session store (localStorage) is the external source of truth; this
  // keeps us hydration-safe (server + first client render both see "empty")
  // and in sync across tabs.
  const snapshot = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot
  );

  // Whether the stored token has been checked against the API yet this load.
  const [validated, setValidated] = useState(false);

  const refresh = useCallback(async () => {
    if (!getSessionSnapshot().token) {
      setValidated(true);
      return;
    }
    try {
      const fresh = await fetchCurrentUser();
      setStoredUser(fresh);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearSession();
      }
      // Any other error (network / 500): keep the cached user, stay signed in.
    } finally {
      setValidated(true);
    }
  }, []);

  useEffect(() => {
    // `refresh()` is async — any state change happens after an `await`, not
    // synchronously in this effect — so the lint rule's warning doesn't apply.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const login = useCallback(async (payload: LoginPayload) => {
    const { user } = await loginRequest(payload);
    setValidated(true);
    return user;
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    const { user } = await signupRequest(payload);
    setValidated(true);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
  }, []);

  const resendVerification = useCallback(async () => {
    const res = await resendVerificationEmail();
    return res.message;
  }, []);

  const applyUser = useCallback((next: AuthUser) => {
    setStoredUser(next);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const status: AuthStatus = snapshot.token
      ? snapshot.user || validated
        ? "authenticated"
        : "loading"
      : "anonymous";

    return {
      user: snapshot.user,
      status,
      isAuthenticated: status === "authenticated",
      login,
      signup,
      logout,
      resendVerification,
      refresh,
      applyUser,
    };
  }, [snapshot, validated, login, signup, logout, resendVerification, refresh, applyUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
