import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/api/products";
import { ProductItem } from "@/lib/types/product";

const CATEGORY_FILTERS = ["All Products", "Merch", "Wellness", "Digital Assets"] as const;

function formatPrice(product: ProductItem) {
  return `${product.currency}${product.price.toLocaleString("en-US")}`;
}

export default async function MarketplacePage() {
  const products = await getAllProducts();

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
                    {formatPrice(product)}
                  </span>
                </div>
                <Link
                  href={`/marketplace/${product.slug}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#353534] font-geist font-black text-sm text-[#e5e2e1]"
                >
                  <CartIcon />
                  View Product
                </Link>
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
