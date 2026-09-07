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
  /**
   * Present when the service is configured as a referral gateway (3.3).
   * The CTA should hit this tracked endpoint rather than linking the partner
   * directly, so the hand-off is counted for the analytics dashboard.
   */
  referralUrl?: string;
  partnerName?: string;
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
