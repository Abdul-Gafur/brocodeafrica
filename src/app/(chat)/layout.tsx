/**
 * Full-screen chat chrome. No shared site navbar, footer or floating buttons —
 * the Ma Guy page owns the whole viewport with its own sidebar, header and
 * pinned composer.
 */
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-[100dvh] overflow-hidden bg-[#0e0e0e]">{children}</div>;
}
