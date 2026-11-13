import { getToken } from "@/lib/auth/session";

/**
 * Central API client. Once the backend is live, point NEXT_PUBLIC_API_BASE_URL
 * at it and swap the mock data modules in `lib/api/*` for real `apiFetch` calls.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  /** Parsed JSON error body, when the server sent one (e.g. Laravel's 422). */
  readonly body: unknown;

  constructor(
    public status: number,
    message: string,
    options?: { cause?: unknown; body?: unknown }
  ) {
    super(message, options?.cause === undefined ? undefined : { cause: options.cause });
    this.name = "ApiError";
    this.body = options?.body;
  }

  /** True when the request never reached the server (network / CORS failure). */
  get isNetworkError(): boolean {
    return this.status === 0;
  }

  /** The API's own `message`, if the error body carried one. */
  get serverMessage(): string | undefined {
    const body = this.body as { message?: unknown } | null | undefined;
    return typeof body?.message === "string" && body.message.trim()
      ? body.message
      : undefined;
  }

  /** Laravel validation messages keyed by field name (422 responses). */
  get fieldErrors(): Record<string, string[]> {
    const errors = (this.body as { errors?: unknown } | null | undefined)?.errors;
    if (!errors || typeof errors !== "object") return {};

    const result: Record<string, string[]> = {};
    for (const [field, messages] of Object.entries(errors)) {
      if (Array.isArray(messages)) {
        result[field] = messages.filter((m): m is string => typeof m === "string");
      }
    }
    return result;
  }
}

/** RequestInit plus the Next.js server-fetch caching extensions we use. */
export type ApiFetchInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

export async function apiFetch<T>(path: string, init?: ApiFetchInit): Promise<T> {
  // Attach the Sanctum bearer token when the visitor is signed in. On the
  // server `getToken()` is always null, so SSR calls stay anonymous.
  const token = getToken();

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        // Laravel keys `expectsJson()` off Accept — send it so validation
        // errors come back as 422 JSON rather than an HTML redirect.
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
  } catch (cause) {
    // `fetch` rejects (rather than resolving with a status) when the request
    // never completes: the backend is down, DNS/connection failed, or a CORS
    // preflight was blocked. Surface it as an ApiError with status 0 so callers
    // can handle it like any other failure instead of an unhandled TypeError.
    throw new ApiError(
      0,
      `Could not reach the API at ${API_BASE_URL || "the current origin"} (${path}). ` +
        `Is the backend running and CORS configured for this origin?`,
      { cause }
    );
  }

  if (!res.ok) {
    // Keep the JSON body (validation errors, the API's message) so callers can
    // show the server's reason; a non-JSON body is simply dropped.
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = undefined;
    }
    throw new ApiError(res.status, `Request to ${path} failed with status ${res.status}`, {
      body,
    });
  }

  return res.json() as Promise<T>;
}
