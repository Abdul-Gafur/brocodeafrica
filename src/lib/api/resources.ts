import { ResourceItem } from "@/lib/types/resource";
import { apiFetch } from "@/lib/api/client";

/**
 * Real API calls for the Resource Library (3.2).
 *
 * `/resources` is paginated: { data: ResourceItem[], meta, links }. The list
 * pages filter client-side, so we request the API's max page size and unwrap
 * `.data`. Single lookups return { data: ResourceItem }.
 */

const REVALIDATE = 300;
const MAX_PER_PAGE = 60;

interface Paginated<T> {
  data: T[];
}

export async function getFeaturedResources(
  limit?: number
): Promise<ResourceItem[]> {
  const perPage = typeof limit === "number" ? limit : MAX_PER_PAGE;
  const { data } = await apiFetch<Paginated<ResourceItem>>(
    `/resources?per_page=${perPage}`,
    { next: { revalidate: REVALIDATE } }
  );
  return typeof limit === "number" ? data.slice(0, limit) : data;
}

export async function getResourceBySlug(
  slug: string
): Promise<ResourceItem | undefined> {
  try {
    const { data } = await apiFetch<{ data: ResourceItem }>(
      `/resources/${encodeURIComponent(slug)}`,
      { next: { revalidate: REVALIDATE } }
    );
    return data;
  } catch {
    return undefined;
  }
}

export async function getAllResources(): Promise<ResourceItem[]> {
  const { data } = await apiFetch<Paginated<ResourceItem>>(
    `/resources?per_page=${MAX_PER_PAGE}`,
    { next: { revalidate: REVALIDATE } }
  );
  return data;
}
