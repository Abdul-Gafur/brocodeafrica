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
}
