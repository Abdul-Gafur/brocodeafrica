import { ProductItem } from "@/lib/types/product";
import { apiFetch, ApiError } from "@/lib/api/client";
import { MOCK_PRODUCTS } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { productWhatsappUrl } from "@/lib/whatsapp";

/**
 * Real API calls for the Marketplace (3.6).
 *
 * `/products` has two shapes:
 *   - open:        { data: ProductItem[], meta, links, comingSoon: false, whatsappNumber }
 *   - coming soon: { data: [], comingSoon: true, message, whatsappNumber }
 * `/products/{slug}` returns { data: ProductItem } or 404 while coming soon.
 *
 * PREVIEW MODE: the client wants the storefront visible now, so while the
 * backend is still in "Coming Soon" mode (or unreachable) we serve the curated
 * catalogue from `src/lib/data/products.ts` and hand every purchase off to
 * WhatsApp, using the client-managed `whatsappNumber` from the API response.
 * Swap this out once the API-backed cart/checkout is built.
 *
 * Not cached: the "Coming Soon" toggle is flipped from the admin panel and
 * should take effect immediately.
 */

interface ProductsIndexResponse {
  data: ProductItem[];
  comingSoon: boolean;
  message?: string;
  /** Client-managed WhatsApp checkout number, digits only. */
  whatsappNumber?: string;
}

/** The static catalogue, each item linked to the WhatsApp hand-off. */
function buildPreviewProducts(whatsappNumber?: string): ProductItem[] {
  return MOCK_PRODUCTS.map((product) => ({
    ...product,
    whatsappUrl: productWhatsappUrl(
      product.title,
      formatPrice(product.price, product.currency),
      whatsappNumber
    ),
  }));
}

/** Whether the live catalogue is unavailable and we should fall back to preview. */
function shouldUsePreview(res: ProductsIndexResponse): boolean {
  return res.comingSoon || res.data.length === 0;
}

export async function getFeaturedProducts(
  limit?: number
): Promise<ProductItem[]> {
  let list: ProductItem[];
  try {
    const res = await apiFetch<ProductsIndexResponse>("/products?featured=1", {
      cache: "no-store",
    });
    list = shouldUsePreview(res)
      ? buildPreviewProducts(res.whatsappNumber).filter((p) => p.featured)
      : res.data;
  } catch {
    list = buildPreviewProducts().filter((p) => p.featured);
  }
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export async function getProductBySlug(
  slug: string
): Promise<ProductItem | undefined> {
  try {
    const { data } = await apiFetch<{ data: ProductItem }>(
      `/products/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    return data;
  } catch (error) {
    // 404 while coming soon, or the API is down — fall back to the preview
    // catalogue so the product page still renders. Pull the checkout number
    // from the index endpoint since the detail 404 carries no body.
    const fallback = (await getMarketplace()).products.find(
      (p) => p.slug === slug
    );
    if (fallback) {
      return fallback;
    }
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function getAllProducts(): Promise<ProductItem[]> {
  try {
    const res = await apiFetch<ProductsIndexResponse>("/products", {
      cache: "no-store",
    });
    return shouldUsePreview(res)
      ? buildPreviewProducts(res.whatsappNumber)
      : res.data;
  } catch {
    return buildPreviewProducts();
  }
}

export interface MarketplaceState {
  products: ProductItem[];
  comingSoon: boolean;
  message?: string;
  /** True when the products come from the static preview catalogue. */
  preview?: boolean;
}

/**
 * Full marketplace state. The "Coming Soon" gate is intentionally not honoured
 * on the storefront right now: when the API withholds the catalogue we show the
 * preview products instead (see PREVIEW MODE above).
 */
export async function getMarketplace(): Promise<MarketplaceState> {
  try {
    const res = await apiFetch<ProductsIndexResponse>("/products", {
      cache: "no-store",
    });
    if (shouldUsePreview(res)) {
      return {
        products: buildPreviewProducts(res.whatsappNumber),
        comingSoon: false,
        preview: true,
      };
    }
    return { products: res.data, comingSoon: false };
  } catch {
    return {
      products: buildPreviewProducts(),
      comingSoon: false,
      preview: true,
    };
  }
}
