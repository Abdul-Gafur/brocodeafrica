import { cache } from "react";
import { ProductItem } from "@/lib/types/product";
import { apiFetch, ApiError } from "@/lib/api/client";

/**
 * Real API calls for the Marketplace (3.6).
 *
 * `/products` has two shapes:
 *   - open:        { data: ProductItem[], meta, links, comingSoon: false, whatsappNumber }
 *   - coming soon: { data: [], comingSoon: true, message, whatsappNumber }
 * `/products/{slug}` returns { data: ProductItem } or 404 while coming soon.
 *
 * COMING SOON GATE: the admin "Coming Soon" switch (`marketplace.coming_soon`)
 * is honoured everywhere. While it is on the backend withholds the catalogue,
 * and the storefront shows the Coming Soon page (with the admin's message)
 * on both the listing and every product URL. Products are only ever shown when
 * the API itself returns them, so there is no static fallback catalogue.
 *
 * If the API cannot be reached we do not know whether the shop is open, so we
 * report the marketplace as "unavailable" rather than guess either way.
 *
 * Not cached: the switch is flipped from the admin panel and should take
 * effect immediately.
 */

interface ProductsIndexResponse {
  data: ProductItem[];
  comingSoon: boolean;
  message?: string | null;
  /** Client-managed WhatsApp checkout number, digits only. */
  whatsappNumber?: string;
}

/** The admin's Coming Soon message, or undefined so the UI uses its default. */
function comingSoonMessage(res: ProductsIndexResponse): string | undefined {
  return res.message?.trim() || undefined;
}

export type MarketplaceState =
  | { status: "open"; products: ProductItem[] }
  | { status: "coming-soon"; message?: string }
  /** The API could not be reached or errored; the shop state is unknown. */
  | { status: "unavailable" };

export type ProductPageState =
  | { status: "open"; product: ProductItem }
  | { status: "coming-soon"; message?: string }
  | { status: "not-found" }
  | { status: "unavailable" };

/**
 * Server-side log line for a failed marketplace call, so an outage or a wrong
 * NEXT_PUBLIC_API_BASE_URL shows up in the hosting logs instead of only as a
 * "Temporarily Unavailable" page. Carries the endpoint and status only: no
 * visitor data.
 */
function logMarketplaceFailure(endpoint: string, error: unknown): void {
  console.error("[marketplace] API request failed", {
    endpoint,
    status: error instanceof ApiError ? error.status : undefined,
    networkError: error instanceof ApiError ? error.isNetworkError : undefined,
    error: error instanceof Error ? error.message : String(error),
  });
}

async function fetchMarketplace(query = ""): Promise<MarketplaceState> {
  try {
    const res = await apiFetch<ProductsIndexResponse>(`/products${query}`, {
      cache: "no-store",
    });
    if (res.comingSoon) {
      return { status: "coming-soon", message: comingSoonMessage(res) };
    }
    return { status: "open", products: res.data ?? [] };
  } catch (error) {
    logMarketplaceFailure(`GET /products${query}`, error);
    return { status: "unavailable" };
  }
}

/**
 * Full marketplace state for the listing page. Wrapped in React `cache` so
 * `generateMetadata` and the page share one result (and one failure log) per
 * request.
 */
export const getMarketplace = cache(function getMarketplace(): Promise<MarketplaceState> {
  return fetchMarketplace();
});

/** Products from the API, or none while the shop is closed or unreachable. */
export async function getAllProducts(): Promise<ProductItem[]> {
  const state = await fetchMarketplace();
  return state.status === "open" ? state.products : [];
}

export async function getFeaturedProducts(
  limit?: number
): Promise<ProductItem[]> {
  const state = await fetchMarketplace("?featured=1");
  const list = state.status === "open" ? state.products : [];
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

/**
 * State for a single product URL. The detail endpoint 404s both for unknown
 * slugs and for every slug while Coming Soon is on, so on a 404 we ask the
 * index endpoint which of the two it was. Unknown slugs also get the Coming
 * Soon page while the shop is closed, so nothing about the hidden catalogue
 * can be inferred from a product URL.
 */
export const getProductPage = cache(getProductPageUncached);

async function getProductPageUncached(slug: string): Promise<ProductPageState> {
  try {
    const { data } = await apiFetch<{ data: ProductItem }>(
      `/products/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    return { status: "open", product: data };
  } catch (error) {
    if (!(error instanceof ApiError && error.status === 404)) {
      logMarketplaceFailure("GET /products/{slug}", error);
      return { status: "unavailable" };
    }
  }

  const gate = await fetchMarketplace("?per_page=1");
  if (gate.status === "open") {
    return { status: "not-found" };
  }
  return gate;
}
