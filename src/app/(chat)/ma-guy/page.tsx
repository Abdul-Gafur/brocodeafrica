"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  getActiveMaGuyConversationId,
  getMaGuyModels,
  listMaGuyConversations,
  loadMaGuyConversation,
  openMaGuyConversation,
  resetMaGuyConversation,
  sendMessageToMaGuy,
} from "@/lib/api/ma-guy";
import {
  ChatMessage,
  MaGuyConversationSummary,
  MaGuyModel,
} from "@/lib/types/ma-guy";
import { useAuth } from "@/lib/auth/context";
import { updatePreferences } from "@/lib/api/user";

const MODEL_STORAGE_KEY = "brocode.maguy.model";
const TRANSCRIPT_STORAGE_KEY = "brocode.maguy.transcript";

const SUGGESTED_PROMPTS = [
  "I'm feeling anxious, who can I talk to?",
  "Tell me about SRHR services",
  "I need help urgently",
  "How do I start saving money?",
];

function now() {
  return new Date().toISOString();
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function relativeDay(iso: string | null): string {
  if (!iso) return "";
  const then = new Date(iso);
  const today = new Date();
  const days = Math.floor(
    (today.setHours(0, 0, 0, 0) - new Date(then).setHours(0, 0, 0, 0)) / 86_400_000
  );
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return then.toLocaleDateString([], { month: "short", day: "numeric" });
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Hey, I'm Ma Guy — your digital sanctuary companion. Ask me anything about mental health, SRHR, finances, or where to find support. This space is 100% anonymous.",
  timestamp: now(),
};

function readTranscript(): ChatMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TRANSCRIPT_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChatMessage[]) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function writeTranscript(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    // Nothing worth keeping until the visitor has actually said something.
    if (messages.length <= 1) {
      window.localStorage.removeItem(TRANSCRIPT_STORAGE_KEY);
    } else {
      window.localStorage.setItem(TRANSCRIPT_STORAGE_KEY, JSON.stringify(messages));
    }
  } catch {
    /* storage unavailable */
  }
}

export default function MaGuyPage() {
  const { isAuthenticated, status: authStatus, user, applyUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [models, setModels] = useState<MaGuyModel[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [conversations, setConversations] = useState<MaGuyConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hydratedRef = useRef(false);
  // True once the visitor picks a model by hand, so a late-arriving saved
  // preference doesn't yank their choice out from under them.
  const modelTouchedRef = useRef(false);
  const preferredModel = user?.preferences?.maGuyModel ?? "";

  const refreshConversations = useCallback(() => {
    listMaGuyConversations().then(setConversations);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Restore the thread after a refresh: paint the cached transcript
  // immediately, then reconcile with the server's copy (authoritative, and
  // how a signed-in visitor picks their thread up on another device).
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    // Reading persisted state from localStorage can only happen after mount
    // (it isn't available during SSR), so this one sync setState is expected.
    const cached = readTranscript();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cached) setMessages(cached);

    let active = true;
    loadMaGuyConversation().then((thread) => {
      if (!active || !thread || thread.messages.length === 0) return;
      setMessages([INITIAL_MESSAGE, ...thread.messages]);
      setActiveId(thread.conversationId);
    });
    refreshConversations();
    return () => {
      active = false;
    };
  }, [refreshConversations]);

  // Signing in mid-session: the just-linked thread and the account's history
  // both become visible.
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    loadMaGuyConversation().then((thread) => {
      if (!active || !thread || thread.messages.length === 0) return;
      setMessages([INITIAL_MESSAGE, ...thread.messages]);
      setActiveId(thread.conversationId);
    });
    refreshConversations();
    return () => {
      active = false;
    };
  }, [isAuthenticated, refreshConversations]);

  // Persist every change so the thread survives a reload for everyone,
  // signed in or not.
  useEffect(() => {
    writeTranscript(messages);
  }, [messages]);

  function handleNewChat() {
    resetMaGuyConversation();
    writeTranscript([INITIAL_MESSAGE]);
    setMessages([INITIAL_MESSAGE]);
    setActiveId(null);
    setInput("");
    setSidebarOpen(false);
  }

  async function handleOpenConversation(id: string) {
    setSidebarOpen(false);
    if (id === activeId) return;
    const thread = await openMaGuyConversation(id);
    if (thread) {
      setMessages([INITIAL_MESSAGE, ...thread.messages]);
      setActiveId(id);
      setInput("");
    } else {
      // The server no longer serves it — drop the stale row.
      setConversations((prev) => prev.filter((c) => c.id !== id));
    }
  }

  useEffect(() => {
    let active = true;
    getMaGuyModels().then(({ models: list }) => {
      if (!active) return;
      setModels(list);
      if (modelTouchedRef.current) return;

      // Prefer the account setting; fall back to this device's last pick.
      let stored = "";
      try {
        stored = window.localStorage.getItem(MODEL_STORAGE_KEY) ?? "";
      } catch {
        /* storage unavailable */
      }
      const choice = [preferredModel, stored].find(
        (key) => key && list.some((m) => m.key === key)
      );
      if (choice) setSelectedModel(choice);
    });
    return () => {
      active = false;
    };
    // Re-runs if the saved preference resolves after the first pass (e.g. the
    // auth check finishes a beat later), so it still gets applied.
  }, [preferredModel]);

  function handleModelChange(key: string) {
    modelTouchedRef.current = true;
    setSelectedModel(key);
    try {
      if (key) {
        window.localStorage.setItem(MODEL_STORAGE_KEY, key);
      } else {
        window.localStorage.removeItem(MODEL_STORAGE_KEY);
      }
    } catch {
      /* storage unavailable */
    }
    // Signed in: remember it on the account so it follows the visitor.
    if (isAuthenticated) {
      updatePreferences({ maGuyModel: key || undefined })
        .then(applyUser)
        .catch(() => {
          /* a failed sync just leaves the localStorage pick in place */
        });
    }
  }

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: now(),
    };

    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await sendMessageToMaGuy(trimmed, history, selectedModel || undefined);
      setMessages((prev) => [...prev, reply]);
      setActiveId(getActiveMaGuyConversationId());
      refreshConversations();
    } catch (error) {
      console.error("Ma Guy send failed", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I couldn't get that through just now. Check your connection and try again in a moment.",
          timestamp: now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleSend(input);
  }

  return (
    <div className="flex h-[100dvh] bg-[#0e0e0e]">
      <ChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeId={activeId}
        onNewChat={handleNewChat}
        onOpen={handleOpenConversation}
        authStatus={authStatus}
        userName={user?.name ?? null}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="shrink-0 border-b border-[rgba(77,70,53,0.1)] bg-[#1c1b1b] px-4 py-4 sm:px-6">
          <div className="mx-auto flex w-full max-w-[880px] items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open chats"
              className="md:hidden -ml-1 flex size-9 items-center justify-center rounded-lg text-[rgba(229,226,225,0.7)] hover:bg-[#2a2a2a]"
            >
              <MenuIcon />
            </button>

            <div className="flex items-center justify-center size-10 rounded-2xl bg-[#ebc249] shrink-0 sm:size-12">
              <MaGuyIcon />
            </div>
            <div className="flex min-w-0 flex-col">
              <h1 className="font-geist font-black text-lg text-[#e5e2e1] sm:text-xl">Ma Guy</h1>
              <span className="flex items-center gap-2 text-[13px] text-[rgba(229,226,225,0.5)] sm:text-sm">
                <span className="size-2 rounded-full bg-[#4ade80]" />
                Online &middot; Anonymous &amp; Confidential
              </span>
            </div>

            {models.length > 0 && (
              <label className="ml-auto flex shrink-0 flex-col items-end gap-1 text-right">
                <span className="hidden text-[10px] uppercase tracking-[1px] text-[rgba(229,226,225,0.4)] sm:block">
                  Model
                </span>
                <select
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="max-w-[150px] rounded-xl border border-[rgba(77,70,53,0.2)] bg-[#2a2a2a] px-3 py-2 text-[13px] text-[#e5e2e1] outline-none focus:border-[#ebc249] sm:max-w-[220px] sm:text-sm"
                >
                  <option value="">
                    Recommended
                    {models.find((m) => m.recommended)
                      ? ` (${models.find((m) => m.recommended)!.label})`
                      : ""}
                  </option>
                  {models.map((model) => (
                    <option key={model.key} value={model.key}>
                      {model.label}
                      {model.free ? " · Free" : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
          <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t border-[rgba(77,70,53,0.1)] bg-[#1c1b1b] px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto flex w-full max-w-[880px] flex-col gap-4">
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-3">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-xl border border-[rgba(235,194,73,0.1)] bg-[#2a2a2a] px-4 py-2 text-sm text-[rgba(229,226,225,0.7)] transition-colors hover:border-[rgba(235,194,73,0.3)] hover:text-[#e5e2e1]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 sm:gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Ma Guy anything..."
                className="flex-1 rounded-2xl border border-[rgba(77,70,53,0.2)] bg-[#2a2a2a] px-5 py-4 text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.3)] outline-none transition-colors focus:border-[#ebc249] sm:px-6"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="flex size-[52px] shrink-0 items-center justify-center rounded-2xl bg-[#ebc249] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SendIcon />
              </button>
            </form>
            <p className="text-center text-xs text-[rgba(229,226,225,0.3)]">
              Ma Guy is a supportive AI guide, not a replacement for professional care. In a crisis,
              visit <Link href="/support" className="underline hover:text-[rgba(229,226,225,0.5)]">Support</Link>.
            </p>
            {authStatus === "anonymous" && (
              <p className="text-center text-xs text-[rgba(229,226,225,0.3)]">
                You&rsquo;re chatting anonymously — this thread is saved on this device.{" "}
                <Link href="/login?redirect=/ma-guy" className="text-[#ebc249] hover:underline">
                  Log in
                </Link>{" "}
                or{" "}
                <Link href="/signup?redirect=/ma-guy" className="text-[#ebc249] hover:underline">
                  sign up
                </Link>{" "}
                to keep it on every device.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatSidebar({
  open,
  onClose,
  conversations,
  activeId,
  onNewChat,
  onOpen,
  authStatus,
  userName,
}: {
  open: boolean;
  onClose: () => void;
  conversations: MaGuyConversationSummary[];
  activeId: string | null;
  onNewChat: () => void;
  onOpen: (id: string) => void;
  authStatus: "loading" | "authenticated" | "anonymous";
  userName: string | null;
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[rgba(77,70,53,0.15)] bg-[#141313] transition-transform md:static md:z-auto md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" aria-label="Brocode Africa home" className="shrink-0">
            <Image src="/images/logo.png" alt="Brocode Africa" width={120} height={31} priority />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chats"
            className="md:hidden flex size-8 items-center justify-center rounded-lg text-[rgba(229,226,225,0.6)] hover:bg-[#2a2a2a]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-3">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center gap-2 rounded-xl border border-[rgba(235,194,73,0.25)] bg-[rgba(235,194,73,0.08)] px-4 py-3 text-sm font-bold text-[#ebc249] transition-colors hover:bg-[rgba(235,194,73,0.14)]"
          >
            <PlusIcon />
            New chat
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto px-2 pb-2">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[1px] text-[rgba(229,226,225,0.35)]">
            Recent chats
          </p>
          {conversations.length === 0 ? (
            <p className="px-3 py-2 text-[13px] leading-5 text-[rgba(229,226,225,0.35)]">
              Your past conversations show up here.
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(c.id)}
                    className={`flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors ${
                      c.id === activeId
                        ? "bg-[#2a2a2a] text-[#e5e2e1]"
                        : "text-[rgba(229,226,225,0.7)] hover:bg-[#201f1f] hover:text-[#e5e2e1]"
                    }`}
                  >
                    <span className="truncate text-[13px] font-medium">
                      {c.title || "New conversation"}
                    </span>
                    <span className="text-[11px] text-[rgba(229,226,225,0.35)]">
                      {relativeDay(c.lastMessageAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-[rgba(77,70,53,0.15)] p-3">
          {authStatus === "authenticated" ? (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-[rgba(229,226,225,0.7)] hover:bg-[#201f1f] hover:text-[#e5e2e1]"
            >
              <UserIcon />
              <span className="truncate">{userName ?? "Account"}</span>
            </Link>
          ) : authStatus === "anonymous" ? (
            <Link
              href="/login?redirect=/ma-guy"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-[rgba(229,226,225,0.7)] hover:bg-[#201f1f] hover:text-[#e5e2e1]"
            >
              <UserIcon />
              Log in to save your chats
            </Link>
          ) : null}
        </div>
      </aside>
    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex items-center justify-center size-9 rounded-xl bg-[#2a2a2a] shrink-0">
          <MaGuyIcon small />
        </div>
      )}
      <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-5 py-3 rounded-2xl text-[15px] leading-6 whitespace-pre-wrap ${
            isUser
              ? "bg-[#ebc249] text-[#3d2e00] rounded-br-md"
              : "bg-[#201f1f] border border-[rgba(77,70,53,0.1)] text-[#e5e2e1] rounded-bl-md"
          }`}
        >
          {message.content}
        </div>
        <span
          suppressHydrationWarning
          className="px-1 text-[11px] text-[rgba(229,226,225,0.3)]"
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 justify-start">
      <div className="flex items-center justify-center size-9 rounded-xl bg-[#2a2a2a] shrink-0">
        <MaGuyIcon small />
      </div>
      <div className="flex items-center gap-1.5 px-5 py-4 rounded-2xl rounded-bl-md bg-[#201f1f] border border-[rgba(77,70,53,0.1)]">
        <span className="size-2 rounded-full bg-[rgba(229,226,225,0.4)] animate-bounce [animation-delay:-0.3s]" />
        <span className="size-2 rounded-full bg-[rgba(229,226,225,0.4)] animate-bounce [animation-delay:-0.15s]" />
        <span className="size-2 rounded-full bg-[rgba(229,226,225,0.4)] animate-bounce" />
      </div>
    </div>
  );
}

function MaGuyIcon({ small }: { small?: boolean }) {
  const size = small ? 16 : 20;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        stroke={small ? "#ebc249" : "#3d2e00"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke="#3d2e00"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
