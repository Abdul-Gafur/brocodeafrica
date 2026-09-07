/** A CMS-managed page served from `/api/v1/pages/{slug}` (3.1). */
export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  /** Rendered HTML body from the CMS rich-text editor. */
  body?: string;
  blocks: unknown[];
  seo: {
    title?: string;
    description?: string;
    ogImage?: string | null;
  };
  publishedAt?: string;
  updatedAt?: string;
}
