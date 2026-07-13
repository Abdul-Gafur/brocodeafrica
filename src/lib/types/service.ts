export type ServiceVariant = "default" | "crisis";

export interface CoreService {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  variant: ServiceVariant;
  badge?: string;
}

export interface SecondaryService {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  href: string;
}
