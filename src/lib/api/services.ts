import { CoreService, SecondaryService } from "@/lib/types/service";
import { apiFetch } from "@/lib/api/client";

/**
 * Real API calls for the Services module (3.3). Signatures are unchanged so
 * callers never need to touch them.
 *
 * `GET /services` returns both groupings in one round trip:
 *   { core: CoreService[], secondary: SecondaryService[] }
 * Single lookups return { data: CoreService }.
 */

const REVALIDATE = 300;

interface ServicesIndexResponse {
  core: CoreService[];
  secondary: SecondaryService[];
}

export async function getCoreServices(): Promise<CoreService[]> {
  const { core } = await apiFetch<ServicesIndexResponse>("/services", {
    next: { revalidate: REVALIDATE },
  });
  return core;
}

export async function getCoreServiceBySlug(
  slug: string
): Promise<CoreService | undefined> {
  try {
    const { data } = await apiFetch<{ data: CoreService }>(
      `/services/${encodeURIComponent(slug)}`,
      { next: { revalidate: REVALIDATE } }
    );
    return data;
  } catch {
    return undefined;
  }
}

export async function getSecondaryServices(): Promise<SecondaryService[]> {
  const { secondary } = await apiFetch<ServicesIndexResponse>("/services", {
    next: { revalidate: REVALIDATE },
  });
  return secondary;
}

export interface ServiceReferral {
  destination: string;
  partner: string | null;
  opensInNewTab: boolean;
}

/**
 * Resolve a service's tracked referral hand-off (3.3). `referralUrl` on a
 * CoreService is an absolute URL to the API's redirect endpoint; asking for it
 * as JSON records the click and returns where to send the visitor next.
 */
export async function requestServiceReferral(
  referralUrl: string
): Promise<ServiceReferral> {
  const res = await fetch(referralUrl, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Referral request failed with status ${res.status}`);
  }
  return res.json() as Promise<ServiceReferral>;
}
