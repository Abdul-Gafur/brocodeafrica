# Security Audit and Remediation Report

**Assessment date:** 2026-09-09  
**Scope:** `brocodeafrica_frontend` and `../brocode_backend`  
**Assessment type:** Authorized source-code, configuration, dependency, and local regression review

## Executive summary

The review confirmed twelve security weaknesses: three High, eight Medium, and one Low. All twelve were remediated in this change set. The most consequential issues were cross-user continuation of AI conversations, unsanitized CMS HTML rendered into the browser, and vulnerable Next.js/runtime dependencies.

Validation included the complete Laravel test suite, a Next.js production build and type check, ESLint, Composer and npm advisory audits, focused secret-pattern scans, route/configuration inspection, and runtime response-header inspection. No committed credential material was identified by the focused scans. No database migration is required.

Four defense-in-depth or architectural risks remain: browser-side bearer-token storage, the lack of privileged-user MFA, flexible SMTP destinations, and sign-up account enumeration. These are documented under Remaining risks.

## Threat model summary

The principal trust boundaries are:

- Browser to Laravel API over a public bearer-token interface.
- Public and signed-in visitors to CMS content, support, marketplace, event, download, and AI-chat endpoints.
- Anonymous AI conversations protected by a browser-held session capability; member conversations protected by account ownership.
- Staff roles in Filament, with editors controlling public content and administrators controlling credentials and provider configuration.
- Laravel to SMTP and third-party AI providers, where outbound destinations and credentials require special protection.
- Public/private storage disks used for media and downloadable resources.

## Confirmed findings

### SEC-001 — AI conversation continuation lacked ownership enforcement

- **Status:** Fixed
- **Severity:** High
- **CWE / OWASP:** CWE-639; OWASP API1:2023 Broken Object Level Authorization
- **Affected code:** `../brocode_backend/app/Services/MaGuy/MaGuyService.php`, `app/Http/Controllers/Api/V1/MaGuyController.php`, `app/Http/Requests/SendChatMessageRequest.php`
- **Scenario / preconditions:** A caller possessing another conversation UUID could submit a new message to that conversation without proving account or anonymous-session ownership.
- **Impact:** Cross-user modification of a private conversation and disclosure of its history to the configured AI provider as context.
- **Evidence:** `resolveConversation()` returned any matching UUID before evaluating its owner. Read access had an ownership check, but write/continuation access did not.
- **Root cause:** Authorization was implemented on the read endpoint but omitted from the shared continuation path.
- **Remediation:** Existing conversations now require matching member ownership or a constant-time match on the anonymous session capability. Unknown or unauthorized UUIDs return 404. Session identifiers are validated and bounded; a signed-in member may safely claim their own anonymous thread.
- **Verification:** Cross-session write regression, invalid-session regression, and existing conversation tests pass.
- **Remaining risk:** Anonymous capability values still authorize a thread for the lifetime of the browser tab and must not be disclosed.

### SEC-002 — Stored CMS HTML reached raw browser HTML sinks

- **Status:** Fixed
- **Severity:** High
- **CWE / OWASP:** CWE-79; OWASP A03:2021 Injection
- **Affected code:** `../brocode_backend/app/Http/Resources/PageResource.php`, `../brocode_backend/app/Http/Resources/LibraryResource.php`; frontend raw sinks in `src/components/pages/CmsPageBody.tsx` and `src/app/(site)/resources/[slug]/page.tsx`
- **Scenario / preconditions:** A compromised or malicious content editor could store active HTML that was returned verbatim and rendered with `dangerouslySetInnerHTML`.
- **Impact:** Script execution in the public-site origin, including possible access to browser-stored bearer tokens.
- **Evidence:** Filament's rich editor explicitly treats submitted HTML as untrusted; both API resources previously returned it without sanitization.
- **Root cause:** Trust in the editor UI rather than sanitization at the public output boundary.
- **Remediation:** Page and resource bodies are sanitized with Filament's configured Symfony HTML sanitizer before API serialization. A restrictive CSP was also added as defense in depth.
- **Verification:** Regression tests confirm safe markup remains while script elements, event handlers, and unsafe URL schemes are removed.
- **Remaining risk:** The CSP keeps `unsafe-inline` for scripts to preserve static Next.js rendering. Moving to a nonce-based strict policy requires dynamic rendering and should accompany the cookie-authentication work described below.

### SEC-003 — Known vulnerable frontend dependencies

- **Status:** Fixed
- **Severity:** High
- **CWE / OWASP:** CWE-1104; OWASP A06:2021 Vulnerable and Outdated Components
- **Affected code:** `package.json`, `package-lock.json`
- **Scenario / preconditions:** The application used Next.js 16.2.10 and affected transitive packages with published authorization-bypass, SSRF, denial-of-service, file-disclosure, and native image-processing advisories. Development tooling also contained denial-of-service advisories.
- **Impact:** Exploitability depended on the specific Next.js feature and deployment path, but the installed versions were inside vulnerable ranges.
- **Evidence:** The initial npm production audit reported vulnerable `next`, `sharp`, `postcss`, and `nanoid` paths. The complete audit additionally reported `brace-expansion`, `browserslist`, and `js-yaml` development paths.
- **Root cause:** The lockfile predated patched releases.
- **Remediation:** Upgraded `next` and `eslint-config-next` to 16.3.4 and refreshed affected transitive packages within the existing dependency model.
- **Verification:** Final `npm audit --json` reports zero vulnerabilities; the application compiles, type-checks, and prerenders successfully with Next.js 16.3.4.
- **Remaining risk:** Continue automated advisory monitoring because framework and image-processing advisories change frequently.

### SEC-004 — Configurable AI endpoint could receive stored provider credentials

- **Status:** Fixed
- **Severity:** Medium
- **CWE / OWASP:** CWE-918; OWASP A10:2021 Server-Side Request Forgery
- **Affected code:** `../brocode_backend/app/Models/AiModel.php`, `../brocode_backend/app/Filament/Resources/AiModels/Schemas/AiModelForm.php`
- **Scenario / preconditions:** A settings administrator could point an AI model at an arbitrary URL. Public use of the model would then send the stored provider key to that endpoint.
- **Impact:** Provider-credential disclosure and server-side requests to attacker-selected or internal services.
- **Evidence:** `baseUrl()` accepted the database value without scheme, host, credential, port, query, or fragment restrictions.
- **Root cause:** A flexible integration endpoint shared a long-lived vendor credential without an outbound-host boundary.
- **Remediation:** Runtime resolution now accepts only HTTPS URLs on the selected provider's official host, without user-info, nonstandard ports, queries, or fragments. Invalid overrides fall back to the provider default.
- **Verification:** Regression coverage confirms an untrusted host is rejected.
- **Remaining risk:** Outbound network egress controls remain recommended as a second layer.

### SEC-005 — Account and token lifecycle controls were incomplete

- **Status:** Fixed
- **Severity:** Medium
- **CWE / OWASP:** CWE-613; OWASP A07:2021 Identification and Authentication Failures
- **Affected code:** `../brocode_backend/app/Http/Middleware/EnsureAccountIsActive.php`, `bootstrap/app.php`, `app/Http/Controllers/Api/V1/Auth/ResetPasswordController.php`, `config/sanctum.php`, `.env.example`
- **Scenario / preconditions:** Tokens issued before account deactivation or password recovery could remain usable; tokens also had no default maximum lifetime.
- **Impact:** A stolen or unwanted session could retain access after a security-sensitive account event.
- **Evidence:** Active status was checked during login but not on subsequent API requests, password reset did not delete personal-access tokens, and Sanctum expiration was `null`.
- **Root cause:** Token issuance, account state, and recovery were enforced independently rather than as one lifecycle.
- **Remediation:** All API requests reject inactive token owners and revoke their tokens; successful password resets revoke every existing token; the default Sanctum lifetime is now 43,200 minutes (30 days), configurable with `SANCTUM_EXPIRATION`.
- **Verification:** Deactivated-token and password-reset revocation regressions pass; effective configuration reports `43200`.
- **Remaining risk:** The frontend has no refresh-token flow, so users must sign in again after expiration.

### SEC-006 — Anonymous AI cost limiter could be bypassed by rotating session IDs

- **Status:** Fixed
- **Severity:** Medium
- **CWE / OWASP:** CWE-770; OWASP API4:2023 Unrestricted Resource Consumption
- **Affected code:** `../brocode_backend/app/Providers/AppServiceProvider.php`
- **Scenario / preconditions:** An unauthenticated caller could choose a fresh `X-Session-Id` for each request.
- **Impact:** Bypass of the per-session limit and avoidable third-party AI cost or resource exhaustion.
- **Evidence:** The previous limiter selected either session ID or IP, making the user-controlled value the complete anonymous key.
- **Root cause:** No independent IP ceiling was applied to anonymous requests.
- **Remediation:** Authenticated accounts retain a 15/minute limit. Anonymous traffic now has both a 15/minute session-and-IP limit and an independent 30/minute IP limit.
- **Verification:** A regression test rotates session identifiers and confirms the IP ceiling returns HTTP 429.
- **Remaining risk:** Application limits do not replace edge/CDN controls against distributed abuse.

### SEC-007 — Support-ticket references had a small online search space

- **Status:** Fixed
- **Severity:** Medium
- **CWE / OWASP:** CWE-330; OWASP API1:2023 Broken Object Level Authorization
- **Affected code:** `../brocode_backend/app/Models/Ticket.php`, `routes/api.php`, `app/Providers/AppServiceProvider.php`
- **Scenario / preconditions:** An attacker knowing a submitter's email could search the six-digit reference space against an unthrottled lookup endpoint.
- **Impact:** Disclosure of ticket messages and member-visible replies.
- **Evidence:** References contained only six random digits and the GET lookup had no endpoint-specific throttle.
- **Root cause:** A human-readable identifier was treated as a sufficient capability-strength component.
- **Remediation:** New tickets receive twelve random digits and lookups are rate-limited by a hash of normalized email plus IP. Existing references remain compatible.
- **Verification:** Reference-format, owner-access, and authorization tests pass.
- **Remaining risk:** Email remains a knowledge factor, not a secret. A signed ticket-access link would be stronger for anonymous users.

### SEC-008 — Post-authentication redirect validation missed browser normalization

- **Status:** Fixed
- **Severity:** Medium
- **CWE / OWASP:** CWE-601; OWASP A01:2021 Broken Access Control
- **Affected code:** `src/lib/safe-redirect.ts`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`
- **Scenario / preconditions:** A crafted redirect parameter using a browser-normalized path form could pass the prefix-only check and be interpreted as a different origin.
- **Impact:** Post-login phishing or user redirection to an attacker-controlled site.
- **Evidence:** Validation only required one leading slash and rejected two literal leading slashes.
- **Root cause:** String-prefix validation was used for a URL-semantic decision.
- **Remediation:** Redirects are parsed against the current origin, require a matching origin, and are reduced to path, query, and fragment before router navigation.
- **Verification:** Type checking and production compilation pass with the shared redirect helper used by both flows.
- **Remaining risk:** None identified for the current client-side redirect flow.

### SEC-009 — Sensitive AI-chat material persisted on shared devices

- **Status:** Fixed
- **Severity:** Medium
- **CWE / OWASP:** CWE-922; OWASP A02:2021 Cryptographic Failures / data exposure
- **Affected code:** `src/app/(chat)/ma-guy/page.tsx`, `src/lib/api/ma-guy.ts`
- **Scenario / preconditions:** Anyone with later access to the same browser profile, or any same-origin script, could retrieve stored transcripts and long-lived anonymous conversation capabilities.
- **Impact:** Privacy exposure involving mental-health, SRHR, financial, or support conversations.
- **Evidence:** Transcript content, session ID, and conversation ID were persisted in `localStorage`; the interface also described the space as “100% anonymous” despite server persistence.
- **Root cause:** Convenience persistence was chosen without matching the sensitivity of the data.
- **Remediation:** Transcript content is no longer stored in the browser; legacy transcript entries are removed; anonymous capability IDs use `sessionStorage`; insecure randomness fallback was removed; the disclosure now accurately explains server storage.
- **Verification:** ESLint, TypeScript, and the production build pass.
- **Remaining risk:** Signed-in conversation history remains available from the account by design and requires appropriate retention/privacy policy controls.

### SEC-010 — Public image uploads allowed active SVG content

- **Status:** Fixed
- **Severity:** Medium
- **CWE / OWASP:** CWE-434; OWASP A04:2021 Insecure Design
- **Affected code:** Public image fields under `../brocode_backend/app/Filament/Resources/**/Schemas`; private resource upload field
- **Scenario / preconditions:** A staff user able to manage content could upload active SVG content to the public storage origin; private resource uploads also lacked an explicit size ceiling.
- **Impact:** Same-origin active-content risk on the backend host and storage exhaustion from oversized resource files.
- **Evidence:** Filament's `image()` accepts `image/*`, which includes SVG, and the resource download field did not define `maxSize()`.
- **Root cause:** Broad convenience MIME rules rather than an explicit passive-image allowlist.
- **Remediation:** Public media now accepts only JPEG, PNG, and WebP with the existing 2 MB limit. Private downloads are capped at 25 MB and remain outside public storage.
- **Verification:** Existing PNG upload behavior passes and a new regression rejects SVG content without creating a product.
- **Remaining risk:** For stronger content assurance, image re-encoding can be added in a future media pipeline.

### SEC-011 — Saved SMTP password could be reused with a changed target

- **Status:** Fixed
- **Severity:** Medium
- **CWE / OWASP:** CWE-522; OWASP A02:2021 Cryptographic Failures
- **Affected code:** `../brocode_backend/app/Filament/Pages/ManageSettings.php`
- **Scenario / preconditions:** A settings administrator changed the SMTP host or username but left the blank “keep existing password” field unchanged.
- **Impact:** The previously stored SMTP credential could be sent to a different server during a test or subsequent delivery.
- **Evidence:** Both save and test-email paths reused the encrypted stored password without binding it to the saved host and username.
- **Root cause:** Blank-field secret preservation did not account for destination identity changes.
- **Remediation:** Changing host or username without a replacement password clears the stored password; test delivery refuses to reuse a saved password for a changed target.
- **Verification:** A settings-page regression confirms the saved password is cleared when the target changes.
- **Remaining risk:** SMTP host flexibility can still produce server-side connections to administrator-selected destinations; see Remaining risks.

### SEC-012 — Missing browser and sensitive-response hardening headers

- **Status:** Fixed
- **Severity:** Low
- **CWE / OWASP:** CWE-693; OWASP A05:2021 Security Misconfiguration
- **Affected code:** `next.config.ts`, `../brocode_backend/app/Http/Middleware/AddSecurityHeaders.php`, `bootstrap/app.php`
- **Scenario / preconditions:** Browser responses lacked an application-defined CSP, frame restrictions, MIME sniffing protection, permissions restrictions, and explicit private caching on sensitive API paths.
- **Impact:** Reduced defense in depth against content injection, framing, content-type confusion, browser feature misuse, and intermediary caching.
- **Evidence:** The Next.js configuration only contained image quality settings and Laravel had no application security-header middleware.
- **Remediation:** Added CSP, HSTS for production frontend responses, clickjacking, referrer, MIME, and permissions policies; disabled the Next.js technology header; added compatible backend headers and `no-store, private` on sensitive API paths.
- **Verification:** Runtime frontend header inspection and Laravel response assertions pass.
- **Remaining risk:** CSP strictness is constrained by current static rendering as noted in SEC-002.

## Remaining risks and recommended actions

1. **Browser bearer-token storage — Medium.** Sanctum bearer tokens remain in `localStorage`, so any future same-origin script execution can read them. Migrate to secure, HttpOnly, SameSite cookies with Sanctum's stateful SPA flow, CSRF protection, `credentials: include`, and coordinated CORS changes. This is an architectural change and should be delivered as a separately tested authentication migration.
2. **Privileged account MFA — Medium.** The Filament admin login has role and active-account gates but no application-configured MFA. Require MFA for staff, especially administrators and settings managers, and add recovery-code and reauthentication procedures.
3. **Flexible SMTP host / outbound network access — Medium.** SMTP configuration intentionally accepts arbitrary business mail servers. Restrict production egress at the network layer or introduce a deployment-managed SMTP host allowlist; explicitly allow private relays only when required.
4. **Registration account enumeration — Low.** Registration's unique-email validation reveals that an address is already registered. Login and password recovery use generic responses and throttling, which limits broader enumeration. Consider an idempotent registration/recovery response if the product can accept the UX change.

## Verification results

- `npm audit --json`: **Pass — 0 vulnerabilities** across production and development dependencies.
- Composer 2 `audit --locked --no-plugins --format=json`: **Pass — 0 advisories**.
- Composer `validate --strict --no-check-publish`: **Pass**.
- `npm run lint`: **Pass with one pre-existing warning** — unused `AlertIcon` in `src/app/(site)/support/page.tsx`.
- `npm run build -- --webpack`: **Pass** — compilation, TypeScript, and 51-page prerender completed.
- Default `npm run build` with Turbopack: **Environment-limited** — the sandbox denied a local port bind used by the CSS/PostCSS worker. The supported webpack build completed successfully. This was not an application compile failure.
- Laravel Pint on changed files: **Pass**.
- Laravel full suite: **Pass — 130 tests, 469 assertions**.
- Focused committed-secret pattern scans: **No matches identified**. This is not a substitute for organization-level secret scanning or Git-history scanning.
- Runtime frontend header inspection: **Pass** for CSP, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, Permissions-Policy, and HSTS.

## Deployment and operational notes

- Deploy the frontend lockfile and application together and run the normal clean dependency install/build process.
- Deploy backend and frontend changes together. The prior frontend already sends `X-Session-Id`, but the updated client also reduces anonymous capability persistence.
- Set `SANCTUM_EXPIRATION=43200` explicitly in production if the 30-day policy is desired, then rebuild Laravel's configuration cache. Choose a different value only as a deliberate session-lifetime policy.
- Tokens older than the configured lifetime will stop authenticating after deployment. Password reset and account deactivation now revoke tokens.
- Existing six-digit ticket references continue to resolve; only newly created tickets receive twelve-digit references.
- Clear or revalidate CDN caches so sanitized CMS responses and new security headers are served promptly.
- No database migration is required.
- No evidence of credential disclosure was found. Rotate AI or SMTP credentials only if operational logs or current stored endpoint configuration indicate that an untrusted destination was previously used.
