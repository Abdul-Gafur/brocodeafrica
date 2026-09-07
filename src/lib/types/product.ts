export type ProductCategory = "Merch" | "Wellness" | "Digital Assets";

export interface ProductItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  category: ProductCategory;
  image: string;
  description: string;
  tagline?: string;
  featured?: boolean;
  inStock?: boolean;
  /**
   * wa.me link to the client's checkout number, prefilled with this product.
   * The storefront "chat to buy" hand-off (3.6) until the full cart is built.
   */
  whatsappUrl?: string;
}
