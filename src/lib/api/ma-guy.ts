import { ChatMessage } from "@/lib/types/ma-guy";
import { apiFetch } from "@/lib/api/client";

/**
 * Real "Ma Guy" assistant calls (3.5).
 *
 * The server owns conversation history, so `history` is no longer sent — we
 * just keep the `conversationId` it returns and echo it back on the next turn.
 * A per-session id lets an anonymous visitor keep one thread and be
 * rate-limited fairly. Response shape:
 *   { conversationId: string, message: ChatMessage }
 */

let conversationId: string | null = null;

let sessionId: string | null = null;

function getSessionId(): string {
  if (sessionId === null) {
    sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
  return sessionId;
}

interface SendMessageResponse {
  conversationId: string;
  message: ChatMessage;
}

export async function sendMessageToMaGuy(
  message: string,
  history: ChatMessage[]
): Promise<ChatMessage> {
  void history;

  const res = await apiFetch<SendMessageResponse>("/ma-guy/messages", {
    method: "POST",
    headers: { "X-Session-Id": getSessionId() },
    body: JSON.stringify({
      message,
      ...(conversationId ? { conversation_id: conversationId } : {}),
    }),
  });

  conversationId = res.conversationId;

  return res.message;
}
