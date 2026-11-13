import type { NextConfig } from "next";

function apiOrigin(): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) return null;

  try {
    return new URL(baseUrl).origin;
  } catch {
    return null;
  }
}

type RemotePattern = Exclude<
  NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number],
  URL
>;

const backendOrigin = apiOrigin();
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Hosts `next/image` may optimise. The API returns admin uploads as absolute
 * `<APP_URL>/storage/...` URLs (public disk), so allow that path on the API's
 * own origin, read from NEXT_PUBLIC_API_BASE_URL at build time. Seeded content
 * uses site-relative `/images/...` paths, which need no pattern.
 *
 * In development the API runs on localhost, which Next 16 refuses to fetch
 * from unless `dangerouslyAllowLocalIP` is on; that is enabled for dev only.
 */
function storagePattern(origin: string): RemotePattern {
  const url = new URL(origin);
  return {
    protocol: url.protocol === "https:" ? "https" : "http",
    hostname: url.hostname,
    port: url.port,
    pathname: "/storage/**",
  };
}

const imageRemotePatterns: RemotePattern[] = [
  ...(backendOrigin ? [storagePattern(backendOrigin)] : []),
  ...(isDevelopment
    ? [
        { protocol: "http" as const, hostname: "localhost", pathname: "/storage/**" },
        { protocol: "http" as const, hostname: "127.0.0.1", pathname: "/storage/**" },
      ]
    : []),
];

const shouldUpgradeInsecureRequests =
  !isDevelopment && (backendOrigin === null || backendOrigin.startsWith("https://"));
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Optimised images are served from 'self' (/_next/image); the API origin is
  // listed for the same /storage uploads when they are rendered unoptimised.
  `img-src 'self' data: blob:${backendOrigin ? ` ${backendOrigin}` : ""}`,
  "font-src 'self' data:",
  `connect-src 'self'${backendOrigin ? ` ${backendOrigin}` : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(shouldUpgradeInsecureRequests ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Navbar renders the logo at quality 100; keep Next's default 75 too.
    qualities: [75, 100],
    remotePatterns: imageRemotePatterns,
    dangerouslyAllowLocalIP: isDevelopment,
  },
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
          ...(isDevelopment
            ? []
            : [{ key: "Strict-Transport-Security", value: "max-age=63072000" }]),
        ],
      },
    ];
  },
};

export default nextConfig;
