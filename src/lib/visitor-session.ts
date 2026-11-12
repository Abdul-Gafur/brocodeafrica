/**
 * Per-tab random ids kept in sessionStorage, so they survive a refresh without
 * becoming long-lived identifiers on a shared device.
 *
 * Each purpose gets its own id and storage key. They must never be shared:
 * Ma Guy's guest session id (`brocode.maguy.session`, private to
 * `lib/api/ma-guy.ts`) is the credential that unlocks an anonymous chat, while
 * the referral visitor id below is only an analytics key that the API stores
 * next to IP address, user agent and member id.
 */

/** Storage key of Ma Guy's guest session id (used only by `lib/api/ma-guy.ts`). */
export const MA_GUY_SESSION_KEY = "brocode.maguy.session";
/** Storage key of the Ma Guy thread the composer continues. */
export const MA_GUY_CONVERSATION_KEY = "brocode.maguy.conversation";
const VISITOR_ID_KEY = "brocode.visitor.id";

/**
 * Every per-tab value that belongs to the anonymous session. Listed here rather
 * than registered by the modules that use them, so a sign-out clears them even
 * on a page that never loaded those modules.
 */
const ANONYMOUS_SESSION_KEYS = [MA_GUY_SESSION_KEY, MA_GUY_CONVERSATION_KEY, VISITOR_ID_KEY];

/** In-memory copies to drop on reset, registered by the modules holding them. */
const resetHandlers = new Set<() => void>();

/** Run `handler` whenever this tab's anonymous session is reset. */
export function onTabSessionReset(handler: () => void): void {
  resetHandlers.add(handler);
}

/**
 * Start a new anonymous session in this tab (on sign-out, KI-04): forget the
 * Ma Guy guest session and thread and the referral visitor id, so the next
 * visitor on a shared device gets fresh ids that are not linked to the member
 * who just signed out. The getters mint new ids on their next call.
 */
export function resetTabSession(): void {
  ANONYMOUS_SESSION_KEYS.forEach((key) => writeTabValue(key, null));
  resetHandlers.forEach((handler) => handler());
}

/** Read a per-tab value, dropping any copy older releases left in localStorage. */
export function readTabValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    // Remove capabilities written by older releases to persistent storage.
    window.localStorage.removeItem(key);
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Write (or with `null`, clear) a per-tab value. */
export function writeTabValue(key: string, value: string | null): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
    if (value) window.sessionStorage.setItem(key, value);
    else window.sessionStorage.removeItem(key);
  } catch {
    /* storage unavailable — the value just won't survive a reload */
  }
}

/**
 * A getter for a per-tab random id stored under `key`, created on first use.
 * The getter throws when the browser has no secure randomness (callers that
 * can work without an id should catch).
 */
export function createTabIdGetter(key: string): () => string {
  let id: string | null = null;
  onTabSessionReset(() => {
    id = null;
  });

  return () => {
    if (id === null) {
      id = readTabValue(key);
    }
    if (id === null) {
      if (typeof globalThis.crypto?.randomUUID !== "function") {
        throw new Error("Secure browser randomness is required to start an anonymous session.");
      }
      id = globalThis.crypto.randomUUID();
      writeTabValue(key, id);
    }
    return id;
  };
}

/**
 * This tab's anonymous visitor id for referral analytics, sent as
 * `X-Session-Id` on referral clicks so the admin's "Unique visitors referred"
 * can tell repeat clicks from new visitors. It grants access to nothing.
 */
export const getVisitorId = createTabIdGetter(VISITOR_ID_KEY);
