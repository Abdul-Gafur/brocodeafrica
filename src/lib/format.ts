const CURRENCY_SYMBOLS: Record<string, string> = {
  GHS: "GH₵",
  NGN: "₦",
  KES: "KSh",
  USD: "$",
};

/** The display symbol for an ISO currency code. Defaults to Ghana Cedi. */
export function currencySymbol(code = "GHS"): string {
  return CURRENCY_SYMBOLS[code.toUpperCase()] ?? code;
}

/**
 * Format a price for display, e.g. `GH₵12,500` or `GH₵1,499.99`.
 * Whole amounts drop the decimals; anything with pesewas keeps two places.
 */
export function formatPrice(amount: number, currency = "GHS"): string {
  const fractionDigits = Number.isInteger(amount) ? 0 : 2;
  return `${currencySymbol(currency)}${amount.toLocaleString("en-GH", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}
