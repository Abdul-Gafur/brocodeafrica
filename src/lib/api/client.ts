/**
 * Central API client. Once the backend is live, point NEXT_PUBLIC_API_BASE_URL
 * at it and swap the mock data modules in `lib/api/*` for real `apiFetch` calls.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/** RequestInit plus the Next.js server-fetch caching extensions we use. */
export type ApiFetchInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

export async function apiFetch<T>(path: string, init?: ApiFetchInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // Laravel keys `expectsJson()` off Accept — send it so validation
      // errors come back as 422 JSON rather than an HTML redirect.
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `Request to ${path} failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}
