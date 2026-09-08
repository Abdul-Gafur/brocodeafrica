import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/api/products";
import { formatPrice } from "@/lib/format";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full flex flex-col items-center px-6 py-16">
        <div className="flex flex-col gap-8 max-w-[1280px] w-full">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 w-fit font-bold text-sm text-[#ebc249]"
          >
            <ArrowLeftIcon />
            Back to Marketplace
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Image gallery */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-[32px] overflow-hidden border border-[rgba(77,70,53,0.1)]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="relative aspect-square w-full rounded-2xl overflow-hidden border border-[rgba(77,70,53,0.1)] bg-[#1c1b1b] opacity-60"
                  >
                    <Image src={product.image} alt="" fill sizes="(max-width: 768px) 25vw, 150px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-6">
              <span className="w-fit bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-4 py-[6px] rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
                {product.category}
              </span>
              <h1 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
                {product.title}
              </h1>
              {product.tagline && (
                <p className="text-sm text-[rgba(229,226,225,0.5)]">{product.tagline}</p>
              )}
              <span className="font-geist font-black text-[32px] text-[#ebc249]">
                {formatPrice(product.price, product.currency)}
              </span>
              <p className="text-[16px] leading-[26px] text-[rgba(229,226,225,0.6)]">
                {product.description}
              </p>

              <div className="flex flex-col gap-3 pt-4">
                <a
                  href={product.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)]"
                >
                  <CartIcon />
                  Buy on WhatsApp
                </a>
                <p className="text-xs text-center text-[rgba(229,226,225,0.4)]">
                  Orders are completed over WhatsApp with our team. A full on-site cart is on the
                  way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 6H2M6 2L2 6l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
