import Link from "next/link";

const DEFAULT_COMING_SOON_MESSAGE = "Our marketplace is launching soon. Watch this space.";

/**
 * Full-page marketplace notice, shown in place of the catalogue on the
 * listing and product pages when there are no products to show.
 */
function MarketplaceNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full flex flex-col items-center px-6 py-24 md:py-40">
        <div className="relative max-w-[768px] w-full bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-[32px] overflow-hidden flex flex-col items-center text-center gap-6 px-8 py-20">
          <div className="absolute -right-24 -top-24 size-64 bg-[rgba(235,194,73,0.06)] blur-3xl rounded-xl" />
          <span className="relative bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
            The Marketplace
          </span>
          <h1 className="relative font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
            {title}
          </h1>
          <p className="relative max-w-[520px] text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
            {message}
          </p>
          <Link
            href="/resources"
            className="relative mt-2 flex items-center justify-center px-8 py-[16px] rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00]"
          >
            Explore Resources Instead
          </Link>
        </div>
      </section>
    </div>
  );
}

/** Admin "Coming Soon" switch is on. `message` is the admin's text, if set. */
export function ComingSoon({ message }: { message?: string }) {
  return <MarketplaceNotice title="Coming Soon" message={message ?? DEFAULT_COMING_SOON_MESSAGE} />;
}

/** The API could not be reached, so we cannot tell whether the shop is open. */
export function MarketplaceUnavailable() {
  return (
    <MarketplaceNotice
      title="Temporarily Unavailable"
      message="We can't load the marketplace right now. Please check back in a few minutes."
    />
  );
}
