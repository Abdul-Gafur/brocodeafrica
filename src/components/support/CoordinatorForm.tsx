"use client";

import { FormEvent, useState } from "react";
import { submitCoordinatorRequest } from "@/lib/api/support";

interface FormState {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const INITIAL_STATE: FormState = { name: "", email: "", topic: "", message: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CoordinatorForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = "Please share your name or a pseudonym.";
    if (!form.email.trim()) {
      nextErrors.email = "An email helps us reach you back.";
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!form.topic.trim()) nextErrors.topic = "Let us know what this is about.";
    if (!form.message.trim() || form.message.trim().length < 10) {
      nextErrors.message = "Please provide a few more details (min. 10 characters).";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setResultMessage(null);
    try {
      const result = await submitCoordinatorRequest(form);
      setStatus(result.success ? "success" : "error");
      setResultMessage(
        result.success
          ? `${result.message} Reference: ${result.ticketId}`
          : result.message
      );
      if (result.success) {
        setForm(INITIAL_STATE);
      }
    } catch {
      setStatus("error");
      setResultMessage("Something went wrong on our end. Please try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-12">
        <div className="size-16 rounded-2xl bg-[rgba(235,194,73,0.1)] flex items-center justify-center">
          <CheckIcon />
        </div>
        <h3 className="font-geist font-black text-2xl text-[#e5e2e1]">Request received</h3>
        <p className="max-w-md text-[15px] leading-6 text-[rgba(229,226,225,0.6)]">
          {resultMessage}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 font-geist font-black text-sm text-[#ebc249]"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Name (or pseudonym)"
          error={errors.name}
        >
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="e.g. Kwame A."
            className={inputClasses(Boolean(errors.name))}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@example.com"
            className={inputClasses(Boolean(errors.email))}
          />
        </Field>
      </div>
      <Field label="Topic" error={errors.topic}>
        <input
          type="text"
          value={form.topic}
          onChange={(e) => updateField("topic", e.target.value)}
          placeholder="What do you need support with?"
          className={inputClasses(Boolean(errors.topic))}
        />
      </Field>
      <Field label="Message" error={errors.message}>
        <textarea
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          placeholder="Share as much or as little as you're comfortable with."
          rows={5}
          className={`${inputClasses(Boolean(errors.message))} resize-none`}
        />
      </Field>

      {status === "error" && resultMessage && (
        <p className="text-sm text-[#ffb4ab]">{resultMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : "Talk to a Coordinator"}
      </button>
      <p className="text-xs text-[rgba(229,226,225,0.4)] text-center">
        For emergencies, please use the Crisis Hotline or Ma Guy chat instead — this form is
        reviewed within a few hours, not instantly.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-geist font-bold text-xs tracking-[0.5px] uppercase text-[rgba(229,226,225,0.5)]">
        {label}
      </span>
      {children}
      {error && <span className="text-xs text-[#ffb4ab]">{error}</span>}
    </label>
  );
}

function inputClasses(hasError: boolean) {
  return `bg-[#2a2a2a] border rounded-2xl px-5 py-4 text-[15px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.3)] outline-none transition-colors ${
    hasError
      ? "border-[#ffb4ab] focus:border-[#ffb4ab]"
      : "border-[rgba(77,70,53,0.2)] focus:border-[#ebc249]"
  }`;
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 6L9 17l-5-5"
        stroke="#ebc249"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
