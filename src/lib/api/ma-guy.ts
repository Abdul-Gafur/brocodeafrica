import {
  ChatMessage,
  MaGuyConversationSummary,
  MaGuyModelList,
} from "@/lib/types/ma-guy";
import { apiFetch, ApiError } from "@/lib/api/client";

/**
 * Real "Ma Guy" assistant calls (3.5).
 *
 * The server owns conversation history. We hold two ids so a thread survives a
 * refresh and can be reloaded:
 *   - `sessionId`      — a stable per-browser id, sent as `X-Session-Id`. Lets
 *                        an anonymous visitor keep one thread and be rate-limited
 *                        fairly, and authorises reloading that thread.
 *   - `conversationId` — the thread the server created; echoed back each turn.
 * Both are persisted to localStorage; a signed-in visitor's threads are also
 * keyed to their account server-side, so they reload on any device.
 *
 * Response shape: { conversationId: string, message: ChatMessage }
 */

const SESSION_KEY = "brocode.maguy.session";
const CONVERSATION_KEY = "brocode.maguy.conversation";

function readStore(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStore(key: string, value: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    /* storage unavailable — the thread just won't survive a reload */
  }
}

let sessionId: string | null = null;

function getSessionId(): string {
  if (sessionId === null) {
    sessionId = readStore(SESSION_KEY);
  }
  if (sessionId === null) {
    sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    writeStore(SESSION_KEY, sessionId);
  }
  return sessionId;
}

let conversationId: string | null = null;
let conversationLoaded = false;

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
