"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/nav";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-40 w-full backdrop-blur-[12px] bg-[rgba(19,19,19,0.6)] border-b border-[rgba(77,70,53,0.1)]">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between pl-6 pr-6 py-4 relative">
        <Link href="/" className="shrink-0" aria-label="Brocode Africa home">
          <Image src="/images/logo.png" alt="Brocode Africa" width={157} height={40} priority quality={100} unoptimized />
        </Link>

        <nav className="hidden lg:flex items-center">
          {NAV_LINKS.map((link, i) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${i > 0 ? "ml-8" : ""} font-geist font-bold text-[12px] tracking-[-0.3px] uppercase pb-[6px] border-b-2 ${
                  isActive
                    ? "text-[#cba42d] border-[#cba42d]"
                    : "text-[#e5e2e1] border-transparent hover:text-[#cba42d] transition-colors"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/ma-guy"
            className="shrink-0 bg-[#ebc249] rounded-[2px] px-8 py-[10px] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)]"
          >
            <span className="font-geist font-black text-[14px] leading-5 text-[#3d2e00]">
              MA GUY
            </span>
          </Link>

          <button
            className="lg:hidden text-[#e5e2e1] p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden absolute top-full left-0 w-full bg-[rgba(19,19,19,0.95)] backdrop-blur-[12px] border-b border-[rgba(77,70,53,0.1)] flex flex-col px-6 py-4 shadow-xl">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-geist font-bold text-[14px] uppercase py-3 border-b border-[rgba(77,70,53,0.1)] last:border-0 ${
                  isActive ? "text-[#cba42d]" : "text-[#e5e2e1]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
