import { ProductItem } from "@/lib/types/product";
import { MOCK_PRODUCTS } from "@/lib/data/products";

/**
 * Swap the body of these functions for `apiFetch<ProductItem[]>("/products")` once
 * the backend is available. The signatures are designed to match a typical
 * REST/GraphQL resource endpoint so callers never need to change.
 */
export async function getFeaturedProducts(limit?: number): Promise<ProductItem[]> {
  const products = MOCK_PRODUCTS.filter((product) => product.featured);
  return typeof limit === "number" ? products.slice(0, limit) : products;
}

export async function getProductBySlug(slug: string): Promise<ProductItem | undefined> {
  return MOCK_PRODUCTS.find((product) => product.slug === slug);
}

export async function getAllProducts(): Promise<ProductItem[]> {
  return MOCK_PRODUCTS;
}
