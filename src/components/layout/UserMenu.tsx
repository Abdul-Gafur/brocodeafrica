"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { AuthUser } from "@/lib/types/auth";

function initials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

/** Signed-in account button + dropdown for the desktop navbar. */
export default function UserMenu({ user }: { user: AuthUser }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleSignOut() {
    setSigningOut(true);
    await logout();
    setOpen(false);
    setSigningOut(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-[2px] border border-[rgba(229,226,225,0.15)] py-[7px] pl-[7px] pr-3 hover:border-[rgba(235,194,73,0.5)] transition-colors"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-[#ebc249] font-geist text-[11px] font-black text-[#3d2e00]">
          {initials(user.name)}
        </span>
        <span className="hidden xl:block font-geist text-[12px] font-bold uppercase tracking-[-0.3px] text-[#e5e2e1] max-w-[120px] truncate">
          {user.name.split(/\s+/)[0]}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-60 rounded-lg border border-[rgba(77,70,53,0.2)] bg-[#1c1b1b] p-1.5 shadow-[0px_20px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="px-3 py-2">
            <p className="font-geist text-[13px] font-bold text-[#e5e2e1] truncate">{user.name}</p>
            <p className="text-[12px] text-[rgba(229,226,225,0.5)] truncate">{user.email}</p>
            {!user.emailVerified && (
              <p className="mt-1 text-[10px] uppercase tracking-[0.5px] text-[#ebc249]">
                Email not verified
              </p>
            )}
          </div>
          <div className="my-1 h-px bg-[rgba(77,70,53,0.2)]" />
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-[13px] text-[rgba(229,226,225,0.8)] hover:bg-[#2a2a2a] hover:text-[#e5e2e1]"
          >
            Account settings
          </Link>
          <Link
            href="/ma-guy"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-[13px] text-[rgba(229,226,225,0.8)] hover:bg-[#2a2a2a] hover:text-[#e5e2e1]"
          >
            My chat with Ma Guy
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={signingOut}
            className="block w-full rounded-md px-3 py-2 text-left text-[13px] text-[rgba(229,226,225,0.8)] hover:bg-[#2a2a2a] hover:text-[#e5e2e1] disabled:opacity-50"
          >
            {signingOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
