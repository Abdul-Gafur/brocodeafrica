"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "@/lib/api/auth";
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from "@/components/auth/icons";

interface FormErrors {
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
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
      await login({ email, password });
      router.push("/");
      router.refresh();
    } catch {
      setFormError("Invalid email or password. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex w-full flex-1 items-center justify-center overflow-clip px-4 pb-[153.5px] pt-[201.5px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(235,194,73,0.05)] blur-[60px]" />

      <div
        className="pointer-events-none absolute inset-[22.22%_-10%_22.22%_76.67%] overflow-clip rounded-[24px] opacity-50"
        aria-hidden
      >
        <div className="relative size-full">
          <Image
            src="/images/auth/editorial-hero.png"
            alt=""
            fill
            className="object-cover mix-blend-saturation"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-[#0e0e0e] to-transparent" />
      </div>

      <div className="relative flex w-full max-w-[448px] flex-col items-start gap-8">
        <div className="flex w-full flex-col gap-10">
          <div className="flex w-full flex-col gap-3">
            <p className="font-manrope text-[10px] uppercase tracking-[2px] text-[#ebc249]">
              Welcome Back
            </p>
            <h1 className="font-geist text-[48px] font-black leading-[48px] tracking-[-2.4px] text-[#e5e2e1]">
              Code with
              <br />
              <span className="text-[#cba42d]">purpose.</span>
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex w-full flex-col gap-10 rounded-2xl border border-[rgba(77,70,53,0.1)] bg-[#201f1f] p-[41px] shadow-[0px_20px_25px_rgba(0,0,0,0.4)] backdrop-blur-[2px]"
          >
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full flex-col gap-[7px]">
                <label
                  htmlFor="email"
                  className="px-1 text-[12px] uppercase tracking-[1.2px] text-[rgba(229,226,225,0.5)]"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  className="w-full rounded-2xl bg-[#2a2a2a] px-5 py-[17px] text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.2)] outline-none focus:ring-1 focus:ring-[#ebc249]"
                />
                {errors.email && (
                  <p className="px-1 text-[12px] text-[#e08a8a]">{errors.email}</p>
                )}
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[12px] uppercase tracking-[1.2px] text-[rgba(229,226,225,0.5)]"
                  >
                    Password
                  </label>
                  <Link
                    href="/reset-password"
                    className="text-[10px] uppercase tracking-[0.5px] text-[#ebc249] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative w-full">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    className="w-full rounded-2xl bg-[#2a2a2a] px-5 py-[17px] pr-12 text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.2)] outline-none focus:ring-1 focus:ring-[#ebc249]"
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

              {formError && (
                <p className="text-[13px] text-[#e08a8a]" role="alert">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[16px] font-bold uppercase tracking-[1.6px] text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.1),0px_4px_6px_-4px_rgba(235,194,73,0.1)] transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(171deg, rgb(235, 194, 73) 0%, rgb(203, 164, 45) 100%)",
                }}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
                {!isSubmitting && <ArrowRightIcon />}
              </button>
            </div>

            <div className="w-full border-t border-[rgba(77,70,53,0.1)] pt-[33px]">
              <p className="flex items-center justify-center gap-1 text-center text-[14px] text-[rgba(229,226,225,0.4)]">
                {"Don't have an account? "}
                <Link href="/signup" className="font-semibold text-[#e5e2e1] hover:text-[#ebc249]">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="flex w-full items-start justify-center gap-8">
          <Link
            href="/privacy-policy"
            className="text-[10px] uppercase tracking-[1.5px] text-[rgba(229,226,225,0.3)] hover:text-[rgba(229,226,225,0.6)]"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-[10px] uppercase tracking-[1.5px] text-[rgba(229,226,225,0.3)] hover:text-[rgba(229,226,225,0.6)]"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
