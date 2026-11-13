import type { Metadata } from "next";
import ResetPasswordCard from "@/components/auth/ResetPasswordCard";

export const metadata: Metadata = {
  title: "Reset your password | Brocode Africa",
  // The emailed link carries a one-time token in its query string.
  robots: { index: false, follow: false },
};

/** First value of a query parameter, trimmed; null when absent or empty. */
function firstParam(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : null;
}

/**
 * The API emails `FRONTEND_URL/reset-password?token=…&email=…`. With a token
 * this page asks for the new password; without one it sends a reset link.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <ResetPasswordCard token={firstParam(params.token)} email={firstParam(params.email)} />
  );
}
