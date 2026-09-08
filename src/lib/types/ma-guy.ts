export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

/** A model the visitor can choose for Ma Guy (3.5). */
export interface MaGuyModel {
  key: string;
  label: string;
  description?: string | null;
  free?: boolean;
  recommended?: boolean;
}

export interface MaGuyModelList {
  models: MaGuyModel[];
  /** Key of the platform's default model, or null when none is configured. */
  recommended: string | null;
}

/** One row in the chat sidebar's "recent chats" list. */
export interface MaGuyConversationSummary {
  id: string;
  title: string | null;
  messageCount: number;
  lastMessageAt: string | null;
}
