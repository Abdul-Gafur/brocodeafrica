"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";

/**
 * Sits under the navbar for signed-in members whose email isn't confirmed yet.
 * Registration is deliberately "soft" — nothing is blocked — so this is the
 * only nudge to finish verifying.
 */
export default function VerifyEmailBanner() {
  const { user, isAuthenticated, resendVerification } = useAuth();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!isAuthenticated || !user || user.emailVerified) return null;

  async function handleResend() {
    setState("sending");
    try {
      const msg = await resendVerification();
      setMessage(msg);
      setState("sent");
    } catch {
      setMessage("Couldn't send right now. Try again in a minute.");
      setState("error");
    }
  }

  return (
    <div className="w-full bg-[rgba(235,194,73,0.1)] border-b border-[rgba(235,194,73,0.2)]">
      <div className="max-w-[1280px] mx-auto px-6 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
        <span className="text-[#e5e2e1]">
          Confirm your email to secure your account.{" "}
          <span className="text-[rgba(229,226,225,0.6)]">
            We sent a link to {user.email}.
          </span>
        </span>
        {state === "sent" || state === "error" ? (
          <span
            className={
              state === "sent" ? "text-[#8fce9b]" : "text-[#e08a8a]"
            }
          >
            {message}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={state === "sending"}
            className="font-bold uppercase tracking-[0.5px] text-[10px] text-[#ebc249] hover:underline disabled:opacity-50"
          >
            {state === "sending" ? "Sending…" : "Resend email"}
          </button>
        )}
      </div>
    </div>
  );
}
