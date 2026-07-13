import Image from "next/image";
import Link from "next/link";
import { HelpCircleIcon } from "@/components/auth/icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-[#0e0e0e]">
      <header className="absolute left-0 top-0 z-10 flex w-full items-center justify-between bg-gradient-to-b from-[#131313] to-[rgba(19,19,19,0)] px-6 py-6">
        <Link href="/" className="shrink-0" aria-label="Brocode Africa home">
          <Image src="/images/logo.png" alt="Brocode Africa" width={40} height={40} priority />
        </Link>
        <Link
          href="/support"
          aria-label="Get help"
          className="flex size-5 items-center justify-center text-[rgba(229,226,225,0.5)] transition-colors hover:text-[#ebc249]"
        >
          <HelpCircleIcon />
        </Link>
      </header>
      {children}
    </div>
  );
}
