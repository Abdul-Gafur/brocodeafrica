"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { clearSession } from "@/lib/auth/session";
import { ApiError } from "@/lib/api/client";
import {
  changePassword,
  deleteAccount,
  updatePreferences,
  updateProfile,
} from "@/lib/api/user";
import { getMaGuyModels } from "@/lib/api/ma-guy";
import { MaGuyModel } from "@/lib/types/ma-guy";

type Banner = { tone: "ok" | "error"; text: string } | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cardClass =
  "flex w-full flex-col gap-5 rounded-2xl border border-[rgba(77,70,53,0.15)] bg-[#1c1b1b] p-6 sm:p-8";
const labelClass =
  "px-1 text-[12px] uppercase tracking-[1.2px] text-[rgba(229,226,225,0.5)]";
const inputClass =
  "w-full rounded-2xl bg-[#2a2a2a] px-5 py-[15px] text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.25)] outline-none focus:ring-1 focus:ring-[#ebc249]";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ebc249] px-6 py-3 text-[13px] font-bold uppercase tracking-[1.2px] text-[#3d2e00] transition-opacity disabled:cursor-not-allowed disabled:opacity-50";

function BannerLine({ banner }: { banner: Banner }) {
  if (!banner) return null;
  return (
    <p
      role={banner.tone === "error" ? "alert" : "status"}
      className={`text-[13px] ${banner.tone === "error" ? "text-[#e08a8a]" : "text-[#8fce9b]"}`}
    >
      {banner.text}
    </p>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { user, status, applyUser } = useAuth();
  // Set once the account is closed, so dropping the local session sends the
  // visitor home rather than to the sign-in page.
  const accountClosed = useRef(false);

  useEffect(() => {
    if (status === "anonymous" && !accountClosed.current) {
      router.replace("/login?redirect=/account");
    }
  }, [status, router]);

  if (status !== "authenticated" || !user) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-[720px] items-center justify-center px-6">
        <p className="text-[rgba(229,226,225,0.5)]">Loading your account…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-6 py-12 sm:py-16">
      <header className="flex flex-col gap-1">
        <h1 className="font-geist text-[32px] font-black tracking-[-1.5px] text-[#e5e2e1]">
          Account
        </h1>
        <p className="text-[14px] text-[rgba(229,226,225,0.5)]">
          Manage your profile, password and preferences.
        </p>
      </header>

      <ProfileCard
        key={user.email}
        initialName={user.name}
        initialEmail={user.email}
        initialPhone={user.phone ?? ""}
        emailVerified={user.emailVerified}
        onSaved={applyUser}
      />

      <PasswordCard />

      <PreferencesCard
        currentModel={user.preferences?.maGuyModel ?? ""}
        onSaved={applyUser}
      />

      <DangerCard
        onDeleted={() => {
          // `DELETE /user` already revoked every token, so there is nothing to
          // log out of server-side (a logout call would 401). Drop the local
          // session and leave.
          accountClosed.current = true;
          clearSession();
          router.replace("/");
          router.refresh();
        }}
      />
    </div>
  );
}

function ProfileCard({
  initialName,
  initialEmail,
  initialPhone,
  emailVerified,
  onSaved,
}: {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
  emailVerified: boolean;
  onSaved: (user: Parameters<ReturnType<typeof useAuth>["applyUser"]>[0]) => void;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  const dirty =
    name !== initialName || email !== initialEmail || phone !== initialPhone;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBanner(null);
    if (!name.trim()) return setBanner({ tone: "error", text: "Name is required." });
    if (!EMAIL_PATTERN.test(email))
      return setBanner({ tone: "error", text: "Enter a valid email address." });

    setSaving(true);
    try {
      const emailChanged = email !== initialEmail;
      const fresh = await updateProfile({ fullName: name, email, phone });
      onSaved(fresh);
      setBanner({
        tone: "ok",
        text: emailChanged
          ? "Saved. Check your inbox to confirm your new email address."
          : "Profile saved.",
      });
    } catch (error) {
      setBanner({
        tone: "error",
        text:
          error instanceof ApiError && error.status === 422
            ? "That email address is already in use."
            : "Couldn't save your profile. Try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cardClass}>
      <div className="flex flex-col gap-1">
        <h2 className="font-geist text-[18px] font-bold text-[#e5e2e1]">Profile</h2>
        <p className="text-[13px] text-[rgba(229,226,225,0.45)]">
          Your name, contact email and phone number.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="acc-name" className={labelClass}>Full name</label>
        <input id="acc-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="acc-email" className={labelClass}>Email address</label>
        <input id="acc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" />
        <span className="px-1 text-[12px] text-[rgba(229,226,225,0.4)]">
          {emailVerified ? "Verified" : "Not verified — check your inbox for the confirmation link."}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="acc-phone" className={labelClass}>Phone (optional)</label>
        <input id="acc-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+233 20 123 4567" autoComplete="tel" />
      </div>

      <BannerLine banner={banner} />

      <div>
        <button type="submit" disabled={saving || !dirty} className={primaryBtn}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function PasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBanner(null);
    if (password.length < 8)
      return setBanner({ tone: "error", text: "New password must be at least 8 characters." });
    if (password !== confirm)
      return setBanner({ tone: "error", text: "New passwords don't match." });

    setSaving(true);
    try {
      const res = await changePassword({
        currentPassword,
        password,
        passwordConfirmation: confirm,
      });
      setBanner({ tone: "ok", text: res.message });
      setCurrentPassword("");
      setPassword("");
      setConfirm("");
    } catch (error) {
      setBanner({
        tone: "error",
        text:
          error instanceof ApiError && error.status === 422
            ? "Your current password is incorrect."
            : "Couldn't update your password. Try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cardClass}>
      <div className="flex flex-col gap-1">
        <h2 className="font-geist text-[18px] font-bold text-[#e5e2e1]">Password</h2>
        <p className="text-[13px] text-[rgba(229,226,225,0.45)]">
          Changing it signs you out on your other devices.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="acc-cur" className={labelClass}>Current password</label>
        <input id="acc-cur" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} autoComplete="current-password" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="acc-new" className={labelClass}>New password</label>
        <input id="acc-new" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} autoComplete="new-password" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="acc-confirm" className={labelClass}>Confirm new password</label>
        <input id="acc-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} autoComplete="new-password" />
      </div>

      <BannerLine banner={banner} />

      <div>
        <button
          type="submit"
          disabled={saving || !currentPassword || !password || !confirm}
          className={primaryBtn}
        >
          {saving ? "Updating…" : "Update password"}
        </button>
      </div>
    </form>
  );
}

function PreferencesCard({
  currentModel,
  onSaved,
}: {
  currentModel: string;
  onSaved: (user: Parameters<ReturnType<typeof useAuth>["applyUser"]>[0]) => void;
}) {
  const [models, setModels] = useState<MaGuyModel[]>([]);
  const [selected, setSelected] = useState(currentModel);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  useEffect(() => {
    let active = true;
    getMaGuyModels().then(({ models: list }) => {
      if (active) setModels(list);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSave() {
    setSaving(true);
    setBanner(null);
    try {
      const fresh = await updatePreferences({ maGuyModel: selected || undefined });
      onSaved(fresh);
      setBanner({ tone: "ok", text: "Preferences saved." });
    } catch {
      setBanner({ tone: "error", text: "Couldn't save your preferences. Try again." });
    } finally {
      setSaving(false);
    }
  }

  const recommended = models.find((m) => m.recommended);

  return (
    <div className={cardClass}>
      <div className="flex flex-col gap-1">
        <h2 className="font-geist text-[18px] font-bold text-[#e5e2e1]">Ma Guy</h2>
        <p className="text-[13px] text-[rgba(229,226,225,0.45)]">
          Your default model when you start a chat. Applies across your devices.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="acc-model" className={labelClass}>Preferred model</label>
        <select
          id="acc-model"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={`${inputClass} appearance-none`}
        >
          <option value="">
            Recommended{recommended ? ` (${recommended.label})` : ""}
          </option>
          {models.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
              {m.free ? " · Free" : ""}
            </option>
          ))}
        </select>
        {models.length === 0 && (
          <span className="px-1 text-[12px] text-[rgba(229,226,225,0.4)]">
            No models are available right now — the recommended one will be used.
          </span>
        )}
      </div>

      <BannerLine banner={banner} />

      <div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || selected === currentModel}
          className={primaryBtn}
        >
          {saving ? "Saving…" : "Save preference"}
        </button>
      </div>
    </div>
  );
}

function DangerCard({ onDeleted }: { onDeleted: () => void }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [working, setWorking] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  async function handleDelete() {
    setWorking(true);
    setBanner(null);
    try {
      await deleteAccount(password);
    } catch (error) {
      setBanner({
        tone: "error",
        text:
          error instanceof ApiError && error.status === 422
            ? "That password is incorrect."
            : "Couldn't close your account. Try again.",
      });
      setWorking(false);
      return;
    }
    // Outside the try: a problem leaving the page must not be reported as a
    // failed closure, because the account is already gone.
    onDeleted();
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-[rgba(224,138,138,0.25)] bg-[rgba(224,138,138,0.04)] p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-geist text-[18px] font-bold text-[#e08a8a]">Close account</h2>
        <p className="text-[13px] text-[rgba(229,226,225,0.45)]">
          Your chats and profile are removed. Support tickets and orders keep their
          records. This can&rsquo;t be undone from here.
        </p>
      </div>

      {open ? (
        <div className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Confirm your password"
            className={inputClass}
            autoComplete="current-password"
          />
          <BannerLine banner={banner} />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={working || !password}
              className="inline-flex items-center justify-center rounded-2xl bg-[#e08a8a] px-6 py-3 text-[13px] font-bold uppercase tracking-[1.2px] text-[#3d0000] disabled:opacity-50"
            >
              {working ? "Closing…" : "Permanently close account"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setPassword("");
                setBanner(null);
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-[rgba(229,226,225,0.2)] px-6 py-3 text-[13px] font-bold uppercase tracking-[1.2px] text-[#e5e2e1]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-2xl border border-[rgba(224,138,138,0.4)] px-6 py-3 text-[13px] font-bold uppercase tracking-[1.2px] text-[#e08a8a] hover:bg-[rgba(224,138,138,0.08)]"
          >
            Close my account
          </button>
        </div>
      )}

      <Link
        href="/support"
        className="px-1 text-[12px] text-[rgba(229,226,225,0.35)] hover:text-[rgba(229,226,225,0.6)]"
      >
        Need help instead? Contact support
      </Link>
    </div>
  );
}
