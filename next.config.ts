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

const backendOrigin = apiOrigin();
const isDevelopment = process.env.NODE_ENV === "development";
const shouldUpgradeInsecureRequests =
  !isDevelopment && (backendOrigin === null || backendOrigin.startsWith("https://"));
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
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
