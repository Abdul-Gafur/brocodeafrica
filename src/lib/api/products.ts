import { ProductItem } from "@/lib/types/product";
import { apiFetch, ApiError } from "@/lib/api/client";

/**
 * Real API calls for the Marketplace (3.6).
 *
 * `/products` has two shapes:
 *   - open:        { data: ProductItem[], meta, links, comingSoon: false }
 *   - coming soon: { data: [], comingSoon: true, message }
 * Either way we unwrap `.data`, so a closed marketplace simply yields `[]`.
 * `/products/{slug}` returns { data: ProductItem } or 404 while coming soon.
 *
 * Not cached: the "Coming Soon" toggle is flipped from the admin panel and
 * should take effect immediately.
 */

interface ProductsIndexResponse {
  data: ProductItem[];
  comingSoon: boolean;
  message?: string;
}

export async function getFeaturedProducts(
  limit?: number
): Promise<ProductItem[]> {
  const { data } = await apiFetch<ProductsIndexResponse>(
    "/products?featured=1",
    { cache: "no-store" }
  );
  return typeof limit === "number" ? data.slice(0, limit) : data;
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
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function getAllProducts(): Promise<ProductItem[]> {
  const { data } = await apiFetch<ProductsIndexResponse>("/products", {
    cache: "no-store",
  });
  return data;
}

export interface MarketplaceState {
  products: ProductItem[];
  comingSoon: boolean;
  message?: string;
}

/**
 * Full marketplace state, including the "Coming Soon" flag the client toggles
 * from the admin dashboard (3.6). When closed, `products` is empty and
 * `message` carries the copy to show instead of the catalogue.
 */
export async function getMarketplace(): Promise<MarketplaceState> {
  const res = await apiFetch<ProductsIndexResponse>("/products", {
    cache: "no-store",
  });
  return {
    products: res.data,
    comingSoon: res.comingSoon,
    message: res.message,
  };
}
