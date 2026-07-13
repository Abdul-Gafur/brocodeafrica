import { CoordinatorRequest, CoordinatorRequestResult, FaqItem, SupportChannel } from "@/lib/types/support";
import { MOCK_SUPPORT_CHANNELS, MOCK_SUPPORT_FAQS } from "@/lib/data/support";

/** Swap for `apiFetch<SupportChannel[]>("/support/channels")` once the backend exists. */
export async function getSupportChannels(): Promise<SupportChannel[]> {
  return MOCK_SUPPORT_CHANNELS;
}

/** Swap for `apiFetch<FaqItem[]>("/support/faqs")` once the backend exists. */
export async function getSupportFaqs(): Promise<FaqItem[]> {
  return MOCK_SUPPORT_FAQS;
}

/**
 * Stubbed submit handler for the "Talk to a Coordinator" form.
 * TODO: swap for `apiFetch<CoordinatorRequestResult>("/support/coordinator-requests", { method: "POST", body: JSON.stringify(payload) })`
 * once the backend endpoint exists.
 */
export async function submitCoordinatorRequest(
  payload: CoordinatorRequest
): Promise<CoordinatorRequestResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    success: true,
    ticketId: `BC-${Math.floor(100000 + Math.random() * 900000)}`,
    message: "Thanks — a coordinator will reach out to you shortly.",
  };
}
