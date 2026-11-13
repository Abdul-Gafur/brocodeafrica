import { CoreService, SecondaryService } from "@/lib/types/service";
import { API_BASE_URL, apiFetch } from "@/lib/api/client";
import { getVisitorId } from "@/lib/visitor-session";

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
 * The referral endpoint as a path relative to `API_BASE_URL`, or null when it
 * does not live under the configured API (then it is never sent credentials).
 *
 * The API builds `referralUrl` from its own `APP_URL`, which may differ in
 * scheme or host from `NEXT_PUBLIC_API_BASE_URL` (e.g. localhost vs 127.0.0.1),
 * so only the path is compared, and the request goes to the configured API.
 */
function referralApiPath(referralUrl: string): string | null {
  if (!API_BASE_URL) return null;
  try {
    const base = new URL(API_BASE_URL);
    const target = new URL(referralUrl, base);
    const basePath = base.pathname.replace(/\/+$/, "");
    if (!target.pathname.startsWith(`${basePath}/`)) return null;
    return `${target.pathname.slice(basePath.length)}${target.search}`;
  } catch {
    return null;
  }
}

/**
 * This tab's referral analytics id, or none if the browser cannot create one.
 * Deliberately not Ma Guy's guest session id: that id unlocks anonymous chats
 * and must never be stored with referral clicks or sent to other hosts.
 */
function visitorHeaders(): Record<string, string> {
  try {
    return { "X-Session-Id": getVisitorId() };
  } catch {
    return {};
  }
}

/**
 * Resolve a service's tracked referral hand-off (3.3). `referralUrl` on a
 * CoreService is an absolute URL to the API's redirect endpoint; asking for it
 * as JSON records the click and returns where to send the visitor next.
 *
 * The click carries the tab's referral analytics id (`X-Session-Id`, separate
 * from Ma Guy's guest session) and, via `apiFetch`, the bearer token when
 * signed in, so the admin's "Unique visitors referred" and per-member reports
 * have something to count.
 */
export async function requestServiceReferral(
  referralUrl: string
): Promise<ServiceReferral> {
  const path = referralApiPath(referralUrl);
  if (path !== null) {
    return apiFetch<ServiceReferral>(path, {
      method: "POST",
      cache: "no-store",
      headers: visitorHeaders(),
    });
  }

  // Not under the configured API: still count the visitor with the analytics
  // id (it grants access to nothing), but never attach the bearer token or any
  // other credential to a URL we do not recognise.
  const res = await fetch(referralUrl, {
    method: "POST",
    headers: { Accept: "application/json", ...visitorHeaders() },
  });
  if (!res.ok) {
    throw new Error(`Referral request failed with status ${res.status}`);
  }
  return res.json() as Promise<ServiceReferral>;
}
