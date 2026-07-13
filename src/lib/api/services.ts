import { CoreService, SecondaryService } from "@/lib/types/service";
import { MOCK_CORE_SERVICES, MOCK_SECONDARY_SERVICES } from "@/lib/data/services";

/**
 * Swap the body of these functions for `apiFetch<CoreService[]>("/services")` once
 * the backend is available. The signatures are designed to match a typical
 * REST/GraphQL resource endpoint so callers never need to change.
 */
export async function getCoreServices(): Promise<CoreService[]> {
  return MOCK_CORE_SERVICES;
}

export async function getCoreServiceBySlug(slug: string): Promise<CoreService | undefined> {
  return MOCK_CORE_SERVICES.find((service) => service.slug === slug);
}

export async function getSecondaryServices(): Promise<SecondaryService[]> {
  return MOCK_SECONDARY_SERVICES;
}
