import { ResourceItem } from "@/lib/types/resource";
import { MOCK_RESOURCES } from "@/lib/data/resources";

/** Swap for `apiFetch<ResourceItem[]>("/resources")` once the backend exists. */
export async function getFeaturedResources(limit?: number): Promise<ResourceItem[]> {
  return typeof limit === "number" ? MOCK_RESOURCES.slice(0, limit) : MOCK_RESOURCES;
}

export async function getResourceBySlug(slug: string): Promise<ResourceItem | undefined> {
  return MOCK_RESOURCES.find((resource) => resource.slug === slug);
}

export async function getAllResources(): Promise<ResourceItem[]> {
  return MOCK_RESOURCES;
}
