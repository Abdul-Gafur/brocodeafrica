import { AuthUser } from "@/lib/types/auth";
import { resetTabSession } from "@/lib/visitor-session";

/**
 * The browser-side source of truth for "who is signed in".
 *
 * The API issues Sanctum bearer tokens; there is no cookie session, so the
 * token and a cached copy of the user live in localStorage. `apiFetch` reads
 * the token from here, and `AuthProvider` subscribes (via `useSyncExternalStore`)
 * so every tab and every component re-renders when it changes.
 */

const TOKEN_KEY = "brocode.auth.token";
const USER_KEY = "brocode.auth.user";

export interface SessionSnapshot {
  token: string | null;
  user: AuthUser | null;
}

/** Stable reference for SSR and for the signed-out client state. */
const EMPTY_SNAPSHOT: SessionSnapshot = { token: null, user: null };

type Listener = () => void;
const listeners = new Set<Listener>();

function compute(): SessionSnapshot {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT;
  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    const rawUser = window.localStorage.getItem(USER_KEY);
    if (!token || !rawUser) return EMPTY_SNAPSHOT;
    return { token, user: JSON.parse(rawUser) as AuthUser };
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

// Recomputed only on change, so `useSyncExternalStore` sees a stable reference
// between renders and doesn't loop.
let snapshot: SessionSnapshot = compute();

function emit(): void {
  snapshot = compute();
  listeners.forEach((fn) => fn());
}

/** Subscribe to sign-in / sign-out. Returns an unsubscribe function. */
export function subscribeToSession(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSessionSnapshot(): SessionSnapshot {
  return snapshot;
}

export function getServerSessionSnapshot(): SessionSnapshot {
  return EMPTY_SNAPSHOT;
}

export function getToken(): string | null {
  return compute().token;
}

export function getStoredUser(): AuthUser | null {
  return compute().user;
}

export function setSession(token: string, user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* private mode — the session just won't survive a reload */
  }
  emit();
}

/** Refresh the cached user without touching the token. */
export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
  emit();
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
  // A new anonymous session starts: the old Ma Guy guest id and referral
  // visitor id must not carry over to whoever uses this tab next (KI-04).
  resetTabSession();
  emit();
}

// Keep tabs in sync: a sign-in or sign-out in one tab fires `storage` in the
// others, where our in-process `emit()` never runs.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === TOKEN_KEY || event.key === USER_KEY) {
      emit();
    }
  });
}
