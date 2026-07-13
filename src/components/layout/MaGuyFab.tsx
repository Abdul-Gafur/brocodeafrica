import Link from "next/link";

export default function MaGuyFab() {
  return (
    <Link
      href="/ma-guy"
      className="fixed bottom-[104px] right-12 z-30 flex items-center gap-4 bg-[#ebc249] rounded-xl px-6 py-4 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.5),0px_4px_12px_0px_rgba(235,194,73,0.04)] hover:brightness-105 transition"
    >
      <div className="flex flex-col items-end">
        <span className="font-geist font-black text-[10px] tracking-[1px] uppercase text-[rgba(61,46,0,0.6)]">
          Chat with
        </span>
        <span className="font-geist font-black text-[18px] leading-7 text-[#3d2e00]">Ma Guy</span>
      </div>
      <div className="flex items-center justify-center bg-[#3d2e00] rounded-xl size-12">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
            stroke="#ebc249"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
