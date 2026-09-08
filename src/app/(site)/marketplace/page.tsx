import Image from "next/image";
import Link from "next/link";
import { getMarketplace } from "@/lib/api/products";
import { formatPrice } from "@/lib/format";

const CATEGORY_FILTERS = ["All Products", "Merch", "Wellness", "Digital Assets"] as const;

export default async function MarketplacePage() {
  const { products, comingSoon, message, preview } = await getMarketplace();

  if (comingSoon) {
    return <ComingSoon message={message} />;
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <section className="w-full flex flex-col items-center px-6 pt-16 pb-8">
        <div className="flex flex-col gap-6 max-w-[1280px] w-full">
          <h1 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
            The Marketplace
          </h1>
          <p className="max-w-[672px] text-[20px] leading-7 text-[rgba(229,226,225,0.6)]">
            Curated lifestyle and financial essentials for the modern African youth. Every
            purchase supports the Brocode community.
          </p>
          {preview && (
            <p className="max-w-[672px] text-sm leading-6 text-[rgba(229,226,225,0.45)]">
              We&rsquo;re taking orders over WhatsApp while the on-site checkout is being built.
              Tap <span className="text-[#ebc249]">Buy on WhatsApp</span> to chat with our team.
            </p>
          )}
        </div>
      </section>

      {/* Categories and Filters */}
      <section className="w-full flex flex-col items-center px-6 py-4 border-b border-t border-[rgba(77,70,53,0.1)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-[1280px] w-full">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((category, index) => (
              <button
                key={category}
                type="button"
                className={`px-5 py-2 rounded-xl font-geist font-black text-sm whitespace-nowrap transition-colors ${
                  index === 0
                    ? "bg-[#ebc249] text-[#3d2e00]"
                    : "bg-[#201f1f] border border-[rgba(77,70,53,0.2)] text-[rgba(229,226,225,0.7)] hover:text-[#e5e2e1]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[rgba(229,226,225,0.5)]">Sort by</span>
            <div className="flex items-center gap-1 rounded-2xl bg-[#201f1f] border border-[rgba(77,70,53,0.1)] p-1">
              {["Newest", "Price", "Popular"].map((sort) => (
                <button
                  key={sort}
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-geist text-sm text-[rgba(229,226,225,0.6)] hover:text-[#e5e2e1]"
                >
                  {sort}
                  <ChevronDownIcon />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="w-full flex flex-col items-center px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1280px] w-full">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-[24px] overflow-hidden flex flex-col"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 280px"
                />
              </div>
              <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-1">
                  <span className="font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
                    {product.category}
                  </span>
                  <h3 className="font-geist font-black text-lg text-[#e5e2e1]">
                    {product.title}
                  </h3>
                  <span className="font-geist font-black text-base text-[#ebc249]">
                    {formatPrice(product.price, product.currency)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={product.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#ebc249] font-geist font-black text-sm text-[#3d2e00]"
                  >
                    <CartIcon />
                    Buy on WhatsApp
                  </a>
                  <Link
                    href={`/marketplace/${product.slug}`}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#353534] font-geist font-black text-sm text-[#e5e2e1]"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full flex flex-col items-center px-6 py-16">
        <div className="relative max-w-[1280px] w-full bg-[#201f1f] border border-[rgba(77,70,53,0.1)] rounded-[32px] overflow-hidden flex flex-col justify-center px-8 md:px-20 py-16 md:py-20 min-h-[360px]">
          <div className="absolute -right-1/4 top-0 bottom-0 w-1/3 bg-[rgba(235,194,73,0.05)] blur-[60px] rounded-xl" />
          <div className="flex flex-col gap-4 max-w-[672px] relative">
            <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
              Elevate Your Lifestyle.
            </h2>
            <p className="text-[20px] leading-7 text-[rgba(229,226,225,0.7)]">
              Join the movement of ambitious Africans investing in premium growth tools.
            </p>
            <Link
              href="/marketplace"
              className="mt-6 w-fit flex items-center justify-center gap-2 px-8 py-[18px] rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00] shadow-[0px_20px_25px_-5px_rgba(235,194,73,0.2),0px_8px_10px_-6px_rgba(235,194,73,0.2)]"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ComingSoon({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full flex flex-col items-center px-6 py-24 md:py-40">
        <div className="relative max-w-[768px] w-full bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-[32px] overflow-hidden flex flex-col items-center text-center gap-6 px-8 py-20">
          <div className="absolute -right-24 -top-24 size-64 bg-[rgba(235,194,73,0.06)] blur-3xl rounded-xl" />
          <span className="relative bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
            The Marketplace
          </span>
          <h1 className="relative font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
            Coming Soon
          </h1>
          <p className="relative max-w-[520px] text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
            {message ?? "Our marketplace is launching soon. Watch this space."}
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

function ChevronDownIcon() {
  return (
    <svg width="7" height="5" viewBox="0 0 7 5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1l2.5 2.5L6 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 1h1.5l1.4 8.4a1 1 0 001 .8h6.4a1 1 0 001-.8l1-5.4H3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="13.5" r="1" fill="currentColor" />
      <circle cx="11" cy="13.5" r="1" fill="currentColor" />
    </svg>
  );
}
