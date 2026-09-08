import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email verification — Brocode Africa",
  robots: { index: false },
};

type Status = "success" | "already" | "invalid";

const COPY: Record<Status, { heading: string; body: string; tone: "good" | "bad" }> = {
  success: {
    heading: "Email confirmed",
    body: "Thanks — your email address is verified and your account is fully set up.",
    tone: "good",
  },
  already: {
    heading: "Already verified",
    body: "This email address was confirmed already. You're all set.",
    tone: "good",
  },
  invalid: {
    heading: "Link expired or invalid",
    body: "That verification link didn't work. Sign in and use the “Resend email” button in the banner to get a fresh one.",
    tone: "bad",
  },
};

export default async function EmailVerifiedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const key: Status =
    status === "success" || status === "already" || status === "invalid"
      ? status
      : "invalid";
  const { heading, body, tone } = COPY[key];

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-6 py-20">
      <div className="flex w-full max-w-[440px] flex-col items-center gap-6 rounded-2xl border border-[rgba(77,70,53,0.15)] bg-[#1c1b1b] p-10 text-center shadow-[0px_20px_50px_rgba(0,0,0,0.5)]">
        <span
          className={`flex size-12 items-center justify-center rounded-full ${
            tone === "good" ? "bg-[rgba(74,222,128,0.15)]" : "bg-[rgba(224,138,138,0.15)]"
          }`}
        >
          <span className={`text-[22px] ${tone === "good" ? "text-[#4ade80]" : "text-[#e08a8a]"}`}>
            {tone === "good" ? "✓" : "!"}
          </span>
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-geist text-[26px] font-black tracking-[-1px] text-[#e5e2e1]">
            {heading}
          </h1>
          <p className="text-[15px] leading-[24px] text-[rgba(229,226,225,0.6)]">{body}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-[#ebc249] px-6 py-3 text-[14px] font-bold uppercase tracking-[1px] text-[#3d2e00]"
          >
            Go to site
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-[rgba(229,226,225,0.2)] px-6 py-3 text-[14px] font-bold uppercase tracking-[1px] text-[#e5e2e1] hover:border-[#ebc249]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
