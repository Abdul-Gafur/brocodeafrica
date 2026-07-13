"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { requestPasswordReset } from "@/lib/api/auth";
import { ArrowLeftIcon } from "@/components/auth/icons";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  function validate(): boolean {
    if (!email.trim()) {
      setError("Email address is required.");
      return false;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("Enter a valid email address.");
      return false;
    }
    setError(null);
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await requestPasswordReset({ email });
      setIsSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex w-full flex-1 items-center justify-center overflow-clip px-4 pb-[289px] pt-[257px]">
      <div className="pointer-events-none absolute inset-[-10%_-10%_61.17%_70.94%] rounded-full bg-[rgba(235,194,73,0.05)] blur-[60px]" />
      <div className="pointer-events-none absolute inset-[65.94%_73.75%_-5%_-5%] rounded-full bg-[rgba(203,164,45,0.05)] blur-[50px]" />

      <div className="relative flex w-full max-w-[448px] flex-col items-start gap-8">
        <div className="relative w-full rounded-2xl bg-[#201f1f] p-10 shadow-[0px_0px_0px_1px_rgba(77,70,53,0.1),0px_10px_30px_0px_rgba(0,0,0,0.5),0px_4px_12px_0px_rgba(235,194,73,0.04)]">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col items-center gap-3">
              <h1 className="text-center font-geist text-[30px] font-black uppercase leading-9 tracking-[-1.5px] text-[#e5e2e1]">
                Reset Your Password
              </h1>
              <p className="max-w-[280px] text-center text-[16px] leading-[26px] text-[rgba(229,226,225,0.6)]">
                Enter your email to receive a reset link
              </p>
            </div>

            {isSent ? (
              <div className="flex w-full flex-col items-center gap-6 pt-10">
                <p className="text-center text-[14px] leading-[22px] text-[rgba(229,226,225,0.7)]">
                  If an account exists for <span className="text-[#e5e2e1]">{email}</span>, a
                  password reset link is on its way.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-10 pt-10">
                <div className="flex w-full flex-col items-end gap-2">
                  <div className="flex w-full flex-col items-start">
                    <label
                      htmlFor="email"
                      className="text-[12px] uppercase tracking-[1.2px] text-[rgba(235,194,73,0.8)]"
                    >
                      Email address
                    </label>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(error)}
                    className="w-full rounded-xl bg-[#2b2b2b] px-4 py-[19px] text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.2)] outline-none focus:ring-1 focus:ring-[#ebc249]"
                  />
                  {error && <p className="w-full px-1 text-[12px] text-[#e08a8a]">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative flex w-full items-center justify-center rounded-xl bg-[#cba42d] px-6 py-4 text-[16px] font-bold text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.1),0px_4px_6px_-4px_rgba(235,194,73,0.1)] transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <div className="flex w-full flex-col items-center pt-10">
              <Link
                href="/login"
                className="flex items-center gap-2 text-[12px] uppercase tracking-[1.2px] text-[rgba(229,226,225,0.4)] hover:text-[#e5e2e1]"
              >
                <ArrowLeftIcon />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        <div className="relative flex w-full items-center justify-center gap-6 opacity-30">
          <div className="h-px w-8 bg-[rgba(229,226,225,0.2)]" />
          <p className="font-geist text-[12px] font-bold uppercase tracking-[2.4px] text-[#e5e2e1]">
            Secure Sanctuary
          </p>
          <div className="h-px w-8 bg-[rgba(229,226,225,0.2)]" />
        </div>
      </div>
    </div>
  );
}
