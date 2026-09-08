/**
 * WhatsApp "chat to buy" hand-off (3.6).
 *
 * Until the on-site cart and checkout are built, every marketplace purchase is
 * completed in a WhatsApp conversation with the BroCode team. These helpers
 * build the wa.me deep link, prefilled with the product the visitor is asking
 * about.
 *
 * The destination number is client-managed in the admin dashboard and comes
 * back on the `/products` response as `whatsappNumber`; pass it through. The
 * env var is only a last-resort fallback for when the API is unreachable.
 */

const FALLBACK_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/** Digits only, international format — what wa.me expects. */
function normalizeNumber(number?: string): string {
  return (number || FALLBACK_NUMBER).replace(/\D+/g, "");
}

/** A wa.me link to the checkout number, prefilled with `message`. */
export function whatsappCheckoutUrl(message: string, number?: string): string {
  return `https://wa.me/${normalizeNumber(number)}?text=${encodeURIComponent(message)}`;
}

/** The "is this still available?" enquiry link for a single product. */
export function productWhatsappUrl(
  title: string,
  priceLabel: string,
  number?: string
): string {
  return whatsappCheckoutUrl(
    `Hi BroCode Africa! I'm interested in the ${title} (${priceLabel}). Is it still available?`,
    number
  );
}
