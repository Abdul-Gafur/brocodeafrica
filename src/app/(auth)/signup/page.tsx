"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { EyeIcon, EyeOffIcon } from "@/components/auth/icons";

/** Where to land after registering — an explicit same-site `?redirect=`, else Ma Guy. */
function initialRedirect(): string {
  if (typeof window === "undefined") return "/ma-guy";
  const value = new URLSearchParams(window.location.search).get("redirect");

  return safeRedirectPath(value, window.location.origin);
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = useAuth();
  const [redirectTo] = useState(initialRedirect);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Leave this page the moment there's a session — just created here, or the
  // visitor was already signed in when they landed.
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }
    if (!email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password && confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signup({
        fullName,
        email,
        password,
        passwordConfirmation: confirmPassword,
      });
      // The effect above redirects once the session lands.
    } catch {
      setFormError("Could not create your account. This email may already be in use.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex w-full flex-1 items-center justify-center px-6 py-[112px]">
      <div className="pointer-events-none absolute bottom-1/2 left-[-5%] right-[65%] top-[-10%] rounded-full bg-[rgba(235,194,73,0.05)] blur-[60px]" />
      <div className="pointer-events-none absolute bottom-[-10%] left-3/4 right-[-5%] top-[60%] rounded-full bg-[rgba(181,196,255,0.05)] blur-[50px]" />

      <div className="relative flex w-full max-w-[448px] flex-col items-start gap-8">
        <div className="flex w-full flex-col gap-10 overflow-clip rounded-2xl bg-[#1c1b1b] p-12 shadow-[0px_20px_50px_0px_rgba(0,0,0,0.6)]">
          <div className="flex w-full flex-col gap-4">
            <h1 className="font-geist text-[36px] font-black leading-9 tracking-[-1.8px] text-[#e5e2e1]">
              Begin Your <span className="text-[#ebc249]">Journey.</span>
            </h1>
            <p className="text-[14px] leading-[22.75px] text-[rgba(229,226,225,0.6)]">
              Join the sanctuary of digital excellence. High-end tools for the modern visionary.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="fullName"
                className="px-1 text-[10px] font-bold uppercase tracking-[1px] text-[rgba(235,194,73,0.8)]"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Identity"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                aria-invalid={Boolean(errors.fullName)}
                className="w-full rounded-2xl bg-[#2a2a2a] px-4 py-[17px] text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.2)] outline-none focus:ring-1 focus:ring-[#ebc249]"
              />
              {errors.fullName && (
                <p className="px-1 text-[12px] text-[#e08a8a]">{errors.fullName}</p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="email"
                className="px-1 text-[10px] font-bold uppercase tracking-[1px] text-[rgba(235,194,73,0.8)]"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="visionary@brocodeafrica.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                className="w-full rounded-2xl bg-[#2a2a2a] px-4 py-[17px] text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.2)] outline-none focus:ring-1 focus:ring-[#ebc249]"
              />
              {errors.email && <p className="px-1 text-[12px] text-[#e08a8a]">{errors.email}</p>}
            </div>

            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="password"
                className="px-1 text-[10px] font-bold uppercase tracking-[1px] text-[rgba(235,194,73,0.8)]"
              >
                Password
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
                  className="w-full rounded-2xl bg-[#2a2a2a] px-4 py-[17px] pr-12 text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.2)] outline-none focus:ring-1 focus:ring-[#ebc249]"
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
                <p className="px-1 text-[12px] text-[#e08a8a]">{errors.password}</p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2 pb-4">
              <label
                htmlFor="confirmPassword"
                className="px-1 text-[10px] font-bold uppercase tracking-[1px] text-[rgba(235,194,73,0.8)]"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={Boolean(errors.confirmPassword)}
                className="w-full rounded-2xl bg-[#2a2a2a] px-4 py-[17px] text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.2)] outline-none focus:ring-1 focus:ring-[#ebc249]"
              />
              {errors.confirmPassword && (
                <p className="px-1 text-[12px] text-[#e08a8a]">{errors.confirmPassword}</p>
              )}
            </div>

            {formError && (
              <p className="text-[13px] text-[#e08a8a]" role="alert">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-2xl py-4 text-[16px] font-bold text-[#3d2e00] drop-shadow-[0px_10px_10px_rgba(235,194,73,0.15)] transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(171deg, rgb(235, 194, 73) 0%, rgb(203, 164, 45) 100%)",
              }}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="flex w-full flex-col items-center gap-4">
            <p className="flex gap-1 text-[12px] text-[rgba(229,226,225,0.4)]">
              {"Already have an account? "}
              <Link href="/login" className="font-bold text-[#ebc249] hover:underline">
                Log In
              </Link>
            </p>
            <div className="h-px w-12 bg-[rgba(77,70,53,0.2)]" />
            <p className="max-w-[200px] text-center text-[10px] uppercase leading-[15px] tracking-[1px] text-[rgba(229,226,225,0.2)]">
              By creating an account you agree to our terms &amp; privacy policy.
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-2 opacity-30">
          <div className="h-px w-8 bg-[#ebc249]" />
          <p className="text-[10px] uppercase tracking-[1px] text-[#e5e2e1]">Secure Sanctuary</p>
          <div className="h-px w-10 bg-[#ebc249]" />
        </div>
      </div>
    </div>
  );
}
