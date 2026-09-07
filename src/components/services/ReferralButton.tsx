"use client";

import { useState } from "react";
import { requestServiceReferral } from "@/lib/api/services";

interface ReferralButtonProps {
  /** Tracked referral endpoint from CoreService.referralUrl. */
  referralUrl: string;
  partnerName?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Sends the visitor to a service's partner platform (3.3) via the tracked
 * redirect endpoint, so the click is recorded for the Referral Analytics
 * dashboard before the hand-off happens.
 */
export default function ReferralButton({
  referralUrl,
  partnerName,
  label,
  className,
  style,
  children,
}: ReferralButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    if (isLoading) return;
    setError(false);
    setIsLoading(true);
    try {
      const { destination, opensInNewTab } = await requestServiceReferral(referralUrl);
      if (opensInNewTab) {
        window.open(destination, "_blank", "noopener,noreferrer");
        setIsLoading(false);
      } else {
        window.location.assign(destination);
      }
    } catch {
      setError(true);
      setIsLoading(false);
    }
  }

  const defaultLabel = partnerName ? `Continue to ${partnerName}` : "Get Help";

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        style={style}
        className={
          className ??
          "flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
        }
      >
        {children ?? (isLoading ? "Connecting…" : label ?? defaultLabel)}
      </button>
      {error && (
        <p className="text-xs text-[#ffb4ab]">
          Couldn&apos;t open the partner service. Please try again.
        </p>
      )}
    </div>
  );
}
