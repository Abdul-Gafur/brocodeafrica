import {
  ChatMessage,
  MaGuyConversationSummary,
  MaGuyModelList,
} from "@/lib/types/ma-guy";
import { apiFetch, ApiError } from "@/lib/api/client";
import {
  createTabIdGetter,
  MA_GUY_CONVERSATION_KEY,
  MA_GUY_SESSION_KEY,
  onTabSessionReset,
  readTabValue,
  writeTabValue,
} from "@/lib/visitor-session";

/**
 * Real "Ma Guy" assistant calls (3.5).
 *
 * The server owns conversation history. We hold two ids so a thread survives a
 * refresh and can be reloaded:
 *   - `sessionId`      — a stable per-tab id, sent as `X-Session-Id`. Lets
 *                        an anonymous visitor keep one thread and be rate-limited
 *                        fairly, and authorises reloading that thread.
 *   - `conversationId` — the thread the server created; echoed back each turn.
 * Both are kept in sessionStorage so an anonymous thread survives a refresh
 * without becoming a long-lived capability on a shared device. A signed-in
 * visitor's threads are keyed to their account server-side.
 *
 * Response shape: { conversationId: string, message: ChatMessage }
 */

const SESSION_KEY = MA_GUY_SESSION_KEY;
const CONVERSATION_KEY = MA_GUY_CONVERSATION_KEY;

const readStore = readTabValue;
const writeStore = writeTabValue;
// The guest session id is the only credential needed to read an unclaimed
// anonymous chat, so it is private to this module: never send it anywhere but
// the Ma Guy endpoints (referrals use their own id from lib/visitor-session).
const getSessionId = createTabIdGetter(SESSION_KEY);

let conversationId: string | null = null;
let conversationLoaded = false;

// Sign-out clears the stored thread id; drop the in-memory copy too, so the
// next message starts a fresh thread under the new guest session.
onTabSessionReset(() => {
  conversationId = null;
  conversationLoaded = false;
});

function getConversationId(): string | null {
  if (!conversationLoaded) {
    conversationId = readStore(CONVERSATION_KEY);
    conversationLoaded = true;
  }
  return conversationId;
}

function setConversationId(id: string | null): void {
  conversationId = id;
  conversationLoaded = true;
  writeStore(CONVERSATION_KEY, id);
}

/** Forget the current thread so the next message starts a fresh one. */
export function resetMaGuyConversation(): void {
  setConversationId(null);
}

/** The thread the composer will continue, or null for a fresh one. */
export function getActiveMaGuyConversationId(): string | null {
  return getConversationId();
}

/** Point the composer at an existing thread (from the sidebar). */
export function setActiveMaGuyConversation(id: string): void {
  setConversationId(id);
}

interface SendMessageResponse {
  conversationId: string;
  message: ChatMessage;
}

interface ConversationResponse {
  conversationId: string;
  messages: ChatMessage[];
}

export async function sendMessageToMaGuy(
  message: string,
  history: ChatMessage[],
  /** Catalogue key of the chosen model. Omit to use the platform's recommended one. */
  modelKey?: string | null
): Promise<ChatMessage> {
  void history;

  const existing = getConversationId();

  const res = await apiFetch<SendMessageResponse>("/ma-guy/messages", {
    method: "POST",
    headers: { "X-Session-Id": getSessionId() },
    body: JSON.stringify({
      message,
      ...(existing ? { conversation_id: existing } : {}),
      ...(modelKey ? { model: modelKey } : {}),
    }),
  });

  setConversationId(res.conversationId);

  return res.message;
}

/**
 * Re-fetch the current thread from the server so a refresh (or a sign-in on a
 * new device) restores the real transcript. Returns null when there is no
 * saved thread, or when the server no longer recognises it for this
 * session / account.
 */
export async function loadMaGuyConversation(): Promise<ConversationResponse | null> {
  const id = getConversationId();
  if (!id) return null;

  try {
    const res = await apiFetch<ConversationResponse>(
      `/ma-guy/conversations/${id}`,
      {
        cache: "no-store",
        headers: { "X-Session-Id": getSessionId() },
      }
    );
    return res;
  } catch (error) {
    // 404 → not our thread any more (cleared server-side, or a stale id).
    if (error instanceof ApiError && error.status === 404) {
      setConversationId(null);
    }
    return null;
  }
}

/**
 * Recent threads for the sidebar — this browser session's, plus (when signed
 * in) every thread on the account. Empty on failure so the sidebar just hides.
 */
export async function listMaGuyConversations(): Promise<MaGuyConversationSummary[]> {
  try {
    const res = await apiFetch<{ conversations: MaGuyConversationSummary[] }>(
      "/ma-guy/conversations",
      { cache: "no-store", headers: { "X-Session-Id": getSessionId() } }
    );
    return res.conversations;
  } catch {
    return [];
  }
}

/**
 * Switch the composer to an existing thread and return its transcript, or null
 * if the server no longer serves it to this session / account.
 */
export async function openMaGuyConversation(
  id: string
): Promise<ConversationResponse | null> {
  setConversationId(id);
  return loadMaGuyConversation();
}

/**
 * The models a visitor may pick between, plus which one the platform
 * recommends. Returns an empty list when Ma Guy has no provider configured.
 */
export async function getMaGuyModels(): Promise<MaGuyModelList> {
  try {
    return await apiFetch<MaGuyModelList>("/ma-guy/models", { cache: "no-store" });
  } catch {
    return { models: [], recommended: null };
  }
}
