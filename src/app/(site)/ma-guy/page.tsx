"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { sendMessageToMaGuy } from "@/lib/api/ma-guy";
import { ChatMessage } from "@/lib/types/ma-guy";

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

const INITIAL_MESSAGE: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Hey, I'm Ma Guy — your digital sanctuary companion. Ask me anything about mental health, SRHR, finances, or where to find support. This space is 100% anonymous.",
  timestamp: now(),
};

export default function MaGuyPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

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
      const reply = await sendMessageToMaGuy(trimmed, history);
      setMessages((prev) => [...prev, reply]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleSend(input);
  }

  return (
    <div className="h-[calc(100vh-96px)] flex flex-col bg-[#0e0e0e]">
      {/* Header */}
      <div className="shrink-0 border-b border-[rgba(77,70,53,0.1)] bg-[#1c1b1b] px-6 py-5">
        <div className="max-w-[880px] mx-auto w-full flex items-center gap-4">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-[#ebc249] shrink-0">
            <MaGuyIcon />
          </div>
          <div className="flex flex-col">
            <h1 className="font-geist font-black text-xl text-[#e5e2e1]">Ma Guy</h1>
            <span className="flex items-center gap-2 text-sm text-[rgba(229,226,225,0.5)]">
              <span className="size-2 rounded-full bg-[#4ade80]" />
              Online &middot; Anonymous &amp; Confidential
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-[880px] mx-auto w-full flex flex-col gap-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-[rgba(77,70,53,0.1)] bg-[#1c1b1b] px-6 py-6">
        <div className="max-w-[880px] mx-auto w-full flex flex-col gap-4">
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-3">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="px-4 py-2 rounded-xl bg-[#2a2a2a] border border-[rgba(235,194,73,0.1)] text-sm text-[rgba(229,226,225,0.7)] hover:border-[rgba(235,194,73,0.3)] hover:text-[#e5e2e1] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Ma Guy anything..."
              className="flex-1 bg-[#2a2a2a] border border-[rgba(77,70,53,0.2)] rounded-2xl px-6 py-4 text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.3)] outline-none focus:border-[#ebc249] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="flex items-center justify-center size-[52px] shrink-0 rounded-2xl bg-[#ebc249] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              <SendIcon />
            </button>
          </form>
          <p className="text-center text-xs text-[rgba(229,226,225,0.3)]">
            Ma Guy is a supportive AI guide, not a replacement for professional care. In a crisis,
            visit <a href="/support" className="underline hover:text-[rgba(229,226,225,0.5)]">Support</a>.
          </p>
        </div>
      </div>
    </div>
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
        <span className="px-1 text-[11px] text-[rgba(229,226,225,0.3)]">
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
