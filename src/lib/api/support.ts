import {
  CoordinatorRequest,
  CoordinatorRequestResult,
  FaqItem,
  SupportChannel,
} from "@/lib/types/support";
import { apiFetch } from "@/lib/api/client";

/**
 * Real API calls for Support (3.4).
 *
 * `/support/channels` and `/support/faqs` are non-paginated collections
 * wrapped as { data: [...] }. `submitCoordinatorRequest` POSTs the "Talk to a
 * Coordinator" form to `/support/tickets` and returns { success, ticketId,
 * message } straight through.
 */

const REVALIDATE = 300;

export async function getSupportChannels(): Promise<SupportChannel[]> {
  const { data } = await apiFetch<{ data: SupportChannel[] }>(
    "/support/channels",
    { next: { revalidate: REVALIDATE } }
  );
  return data;
}

export async function getSupportFaqs(): Promise<FaqItem[]> {
  const { data } = await apiFetch<{ data: FaqItem[] }>("/support/faqs", {
    next: { revalidate: REVALIDATE },
  });
  return data;
}

export async function submitCoordinatorRequest(
  payload: CoordinatorRequest
): Promise<CoordinatorRequestResult> {
  return apiFetch<CoordinatorRequestResult>("/support/tickets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
