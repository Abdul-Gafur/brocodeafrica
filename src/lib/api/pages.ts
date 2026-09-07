import { CmsPage } from "@/lib/types/page";
import { apiFetch, ApiError } from "@/lib/api/client";

/**
 * CMS-managed pages (3.1): About, Privacy Policy, Terms of Service, etc.
 * `/pages/{slug}` returns { data: CmsPage }.
 */

const REVALIDATE = 300;

export async function getPage(slug: string): Promise<CmsPage | undefined> {
  try {
    const { data } = await apiFetch<{ data: CmsPage }>(
      `/pages/${encodeURIComponent(slug)}`,
      { next: { revalidate: REVALIDATE } }
    );
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}
