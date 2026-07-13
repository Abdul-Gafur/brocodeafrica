export type ResourceCategory = "Finance" | "Wellness" | "SRHR" | "Investment";

/** Broad library filter groups shown on the Resource Library page. */
export type ResourceFilter = "Health" | "Wealth" | "Self-Dev" | "Courses";

export type ResourceType = "article" | "course" | "download";

export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  category: ResourceCategory;
  image: string;
  excerpt?: string;
  readTimeMinutes?: number;
  /** Library-level classification used for filter pills on /resources. Defaults to "article" when omitted. */
  type?: ResourceType;
  /** Filter group(s) this resource should appear under in the library filter bar. */
  filters?: ResourceFilter[];
  author?: string;
  publishedAt?: string;
  /** Course-only fields */
  courseTags?: [string, string];
  duration?: string;
  price?: string;
  /** Download-only fields */
  fileType?: string;
  fileSize?: string;
}
