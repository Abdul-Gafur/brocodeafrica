const DEFAULT_REDIRECT = "/ma-guy";

/**
 * Reduce a post-authentication redirect to a same-origin path. Parsing the
 * value catches browser-normalized forms such as `/\\example.com`, which a
 * prefix-only check can mistake for an internal URL.
 */
export function safeRedirectPath(
  value: string | null,
  origin: string,
  fallback = DEFAULT_REDIRECT
): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const destination = new URL(value, origin);

    if (destination.origin !== origin) {
      return fallback;
    }

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return fallback;
  }
}
