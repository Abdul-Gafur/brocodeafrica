"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { requestPasswordReset, resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { clearSession } from "@/lib/auth/session";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "@/components/auth/icons";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Mirrors Laravel's `Password::defaults()` (min 8), which the API enforces. */
const MIN_PASSWORD_LENGTH = 8;

const labelClass = "text-[12px] uppercase tracking-[1.2px] text-[rgba(235,194,73,0.8)]";
const inputClass =
  "w-full rounded-xl bg-[#2b2b2b] px-4 py-[19px] text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.2)] outline-none focus:ring-1 focus:ring-[#ebc249]";
const submitClass =
  "relative flex w-full items-center justify-center rounded-xl bg-[#cba42d] px-6 py-4 text-[16px] font-bold text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.1),0px_4px_6px_-4px_rgba(235,194,73,0.1)] transition-opacity disabled:cursor-not-allowed disabled:opacity-60";

/**
 * `/reset-password` has two steps:
 *   - no `token` in the URL: ask for an email and send the reset link;
 *   - the emailed link (`?token=…&email=…`): choose a new password, which is
 *     posted with the token to `POST /auth/reset-password`.
 */
export default function ResetPasswordCard({
  token,
  email,
}: {
  token: string | null;
  email: string | null;
}) {
  const isConfirmStep = Boolean(token);

  return (
    <div className="relative flex w-full flex-1 items-center justify-center overflow-clip px-4 pb-[289px] pt-[257px]">
      <div className="pointer-events-none absolute inset-[-10%_-10%_61.17%_70.94%] rounded-full bg-[rgba(235,194,73,0.05)] blur-[60px]" />
      <div className="pointer-events-none absolute inset-[65.94%_73.75%_-5%_-5%] rounded-full bg-[rgba(203,164,45,0.05)] blur-[50px]" />

      <div className="relative flex w-full max-w-[448px] flex-col items-start gap-8">
        <div className="relative w-full rounded-2xl bg-[#201f1f] p-10 shadow-[0px_0px_0px_1px_rgba(77,70,53,0.1),0px_10px_30px_0px_rgba(0,0,0,0.5),0px_4px_12px_0px_rgba(235,194,73,0.04)]">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col items-center gap-3">
              <h1 className="text-center font-geist text-[30px] font-black uppercase leading-9 tracking-[-1.5px] text-[#e5e2e1]">
                {isConfirmStep ? "Choose a New Password" : "Reset Your Password"}
              </h1>
              <p className="max-w-[280px] text-center text-[16px] leading-[26px] text-[rgba(229,226,225,0.6)]">
                {isConfirmStep
                  ? "Set the password you'll use to sign in"
                  : "Enter your email to receive a reset link"}
              </p>
            </div>

            {token ? (
              email ? (
                <NewPasswordForm token={token} email={email} />
              ) : (
                <InvalidLinkNotice />
              )
            ) : (
              <RequestLinkForm />
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

/** Step 1: email the visitor a reset link. */
function RequestLinkForm() {
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
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 429
          ? "Too many attempts. Please wait a minute and try again."
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSent) {
    return (
      <div className="flex w-full flex-col items-center gap-6 pt-10">
        <p
          role="status"
          className="text-center text-[14px] leading-[22px] text-[rgba(229,226,225,0.7)]"
        >
          If an account exists for <span className="text-[#e5e2e1]">{email}</span>, a password
          reset link is on its way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-10 pt-10">
      <div className="flex w-full flex-col items-end gap-2">
        <div className="flex w-full flex-col items-start">
          <label htmlFor="email" className={labelClass}>
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
          aria-describedby={error ? "email-error" : undefined}
          className={inputClass}
        />
        {error && (
          <p id="email-error" role="alert" className="w-full px-1 text-[12px] text-[#e08a8a]">
            {error}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className={submitClass}>
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}

interface NewPasswordErrors {
  password?: string;
  confirmPassword?: string;
}

/** Step 2: the emailed link — set a new password with the token. */
function NewPasswordForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<NewPasswordErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [linkExpired, setLinkExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const next: NewPasswordErrors = {};
    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (!confirmPassword) {
      next.confirmPassword = "Please confirm your password.";
    } else if (password && confirmPassword !== password) {
      next.confirmPassword = "Passwords do not match.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setLinkExpired(false);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });
    } catch (err) {
      handleError(err);
      setIsSubmitting(false);
      return;
    }

    // The API revoked every token on this account, so any session stored in
    // this browser is dead too; drop it so /login doesn't bounce the visitor.
    clearSession();
    router.replace("/login?reset=success");
  }

  function handleError(err: unknown) {
    if (!(err instanceof ApiError)) {
      setFormError("Something went wrong. Please try again.");
      return;
    }
    if (err.status === 422) {
      const fields = err.fieldErrors;
      const passwordError = fields.password?.[0];
      if (passwordError) {
        setErrors({ password: passwordError });
        return;
      }
      // Bad or expired token, or a malformed email/token in the link.
      setLinkExpired(true);
      setFormError(
        err.serverMessage ??
          "This password reset link is invalid or has expired. Please request a new one."
      );
      return;
    }
    if (err.status === 429) {
      setFormError("Too many attempts. Please wait a minute and try again.");
      return;
    }
    if (err.isNetworkError) {
      setFormError("We couldn't reach the server. Check your connection and try again.");
      return;
    }
    setFormError("Something went wrong. Please try again.");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-8 pt-10">
      <div className="flex w-full flex-col gap-2">
        <span className={labelClass}>Account</span>
        <p className="w-full truncate rounded-xl bg-[#2b2b2b] px-4 py-[19px] text-[16px] text-[rgba(229,226,225,0.6)]">
          {email}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <label htmlFor="password" className={labelClass}>
          New password
        </label>
        <div className="relative w-full">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgba(229,226,225,0.4)] hover:text-[#e5e2e1]"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="w-full px-1 text-[12px] text-[#e08a8a]">
            {errors.password}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        <label htmlFor="password_confirmation" className={labelClass}>
          Confirm new password
        </label>
        <input
          id="password_confirmation"
          name="password_confirmation"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={errors.confirmPassword ? "password_confirmation-error" : undefined}
          className={inputClass}
        />
        {errors.confirmPassword && (
          <p
            id="password_confirmation-error"
            role="alert"
            className="w-full px-1 text-[12px] text-[#e08a8a]"
          >
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {formError && (
        <div role="alert" className="flex w-full flex-col gap-2">
          <p className="w-full px-1 text-[13px] text-[#e08a8a]">{formError}</p>
          {linkExpired && (
            <Link
              href="/reset-password"
              className="px-1 text-[12px] uppercase tracking-[1.2px] text-[#ebc249] hover:underline"
            >
              Request a new link
            </Link>
          )}
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className={submitClass}>
        {isSubmitting ? "Saving..." : "Reset Password"}
      </button>
    </form>
  );
}

/** A link with a token but no email cannot be used; send them back to step 1. */
function InvalidLinkNotice() {
  return (
    <div role="alert" className="flex w-full flex-col items-center gap-6 pt-10">
      <p className="text-center text-[14px] leading-[22px] text-[rgba(229,226,225,0.7)]">
        This password reset link is incomplete. Please request a new one.
      </p>
      <Link href="/reset-password" className={submitClass}>
        Request a New Link
      </Link>
    </div>
  );
}
