# Security Audit Report - TechBar Next.js E-Commerce Project

**Audit Date:** 14 April 2026
**Project:** ecom-project (Next.js E-Commerce Platform)
**Auditor:** Automated Security Audit

---

## Executive Summary

This audit identified **38 security issues** across the codebase, including **5 Critical**, **8 High**, **12 Medium**, **8 Low**, and **5 Informational** severity findings. The most pressing concerns are exposed secrets in version-controlled files, missing authentication/authorization on admin and data-mutation endpoints, insecure configuration settings, and absence of security headers and CSRF protections.

---

## Table of Contents

1. [Critical Severity](#critical-severity)
2. [High Severity](#high-severity)
3. [Medium Severity](#medium-severity)
4. [Low Severity](#low-severity)
5. [Informational](#informational)

---

## Critical Severity

### CRIT-01: Live API Secrets Committed to Repository

| Property | Value |
|---|---|
| **Severity** | Critical |
| **Files** | `.env.local` (lines 2-3) |
| **Status** | Active vulnerability |

**Description:** Real GitHub OAuth client credentials are hardcoded and committed to the repository:
- `GITHUB_CLIENT_ID="Ov23lild4y1KMxzOBVuB"`
- `GITHUB_CLIENT_SECRET="ae78f8df7901dc847bd1e85a3392903b27ab88ab"`

These are production-grade credentials that can be used by anyone with repository access to impersonate the application, steal OAuth tokens, or compromise user accounts.

**Remediation:**
1. Immediately rotate the GitHub OAuth client secret at https://github.com/settings/developers
2. Remove `.env.local` from the repository and add it to `.gitignore` (already present, verify it was not previously committed)
3. Use a secrets manager (e.g., Vercel Environment Variables, Doppler, AWS Secrets Manager)
4. Run `git filter-branch` or BFG to remove secrets from git history

---

### CRIT-02: Hardcoded Admin Password in Source Code

| Property | Value |
|---|---|
| **Severity** | Critical |
| **File** | `C:\Users\ashis\techbar\seed.ts` (line 13) |
| **Status** | Active vulnerability |

**Description:** The admin account creation function contains a hardcoded weak password:
```typescript
password:"admin123@",
```

This password is visible in git history, source code, and any logs. It uses a predictable pattern (`admin` + `123` + `@`) that is trivially guessable.

**Remediation:**
```typescript
// Instead, generate a secure random password or require manual input
import { randomBytes } from "crypto";
const securePassword = randomBytes(16).toString("hex");
// Output to environment variable or secure vault only
console.log("Generated admin password (store securely):", securePassword);
```
Rotate the admin account password immediately.

---

### CRIT-03: No Authentication on Admin Product Creation Endpoint

| Property | Value |
|---|---|
| **Severity** | Critical |
| **File** | `C:\Users\ashis\techbar\app\api\admin\route.ts` (lines 1-12) |
| **Status** | Active vulnerability |

**Description:** The `/api/admin` POST endpoint calls `createAdmin()` from `seed.ts` which creates an admin user, with **no authentication or authorization check whatsoever**. Any unauthenticated user can hit this endpoint to create arbitrary admin accounts.

```typescript
export async function POST(req: Request) {
    await createAdmin()  // No auth check!
    return NextResponse.json({ message: "ok done" }, { status: 201 })
}
```

**Remediation:**
```typescript
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.role || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    // ... rest of logic
}
```

---

### CRIT-04: No Authentication on Product Seeding Endpoint

| Property | Value |
|---|---|
| **Severity** | Critical |
| **File** | `C:\Users\ashis\techbar\app\api\products\route.ts` (lines 8-18) |
| **Status** | Active vulnerability |

**Description:** The `POST /api/products` endpoint deletes the entire product table and re-seeds it without any authentication:
```typescript
export async function POST(req: Request) {
    await db.delete(product);  // Deletes ALL products without auth!
    const data = await seedProds();
    ...
}
```

Any unauthenticated user can delete all products from the database.

**Remediation:** Add admin authentication check before the `db.delete(product)` call.

---

### CRIT-05: Stripe Webhook Fire-and-Forget Processing

| Property | Value |
|---|---|
| **Severity** | Critical |
| **File** | `C:\Users\ashis\techbar\app\api\webhooks\stripe\route.ts` (lines 469-474) |
| **Status** | Active vulnerability |

**Description:** The Stripe webhook processes payment events asynchronously after returning a 200 response:
```typescript
processStripe();  // Called without await
return new Response("OK", { status: 200 });
```

This creates a race condition where:
- The webhook can be called again by Stripe before the first call completes
- If the server restarts during processing, payment state is lost
- Idempotency checks exist but are not bulletproof for all event types

**Remediation:** Use a proper message queue (e.g., Upstash, Redis) or at minimum await the processing, or implement a durable job queue pattern.

---

## High Severity

### HIGH-01: Missing `middleware.ts` - No Global Auth Protection

| Property | Value |
|---|---|
| **Severity** | High |
| **Files** | Project root (missing file) |
| **Status** | Architecture-level gap |

**Description:** The project has no Next.js middleware file. Without middleware, there is no global route guard to protect `/admin/*` routes, API routes, or server actions. Authentication is checked on a per-endpoint basis (inconsistently), meaning any missed check results in an unprotected endpoint.

**Remediation:** Create `middleware.ts` at the project root:
```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const protectedPaths = ["/admin", "/api/admin"];
    const path = request.nextUrl.pathname;

    if (protectedPaths.some(p => path.startsWith(p))) {
        const sessionCookie = request.cookies.get("better-auth.session_token");
        if (!sessionCookie) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

---

### HIGH-02: No CSRF Protection

| Property | Value |
|---|---|
| **Severity** | High |
| **Files** | Multiple API routes, server actions |
| **Status** | Active vulnerability |

**Description:** The application uses cookie-based sessions (`credentials: "include"` in `lib/auth-client.ts` line 7) but has no CSRF token validation. Any state-changing POST/PUT/DELETE/PATCH request can be triggered from a malicious site via a forged request.

Affected endpoints include:
- `/api/cart` (POST)
- `/api/favorites` (POST)
- `/api/payments/create-intent` (POST)
- `/api/stripe/checkout` (POST)
- All admin POS cart/order endpoints
- Server actions for cart, favorites, reviews, addresses

**Remediation:** Enable CSRF protection in better-auth or implement custom CSRF token validation for all state-changing requests.

---

### HIGH-03: Missing Security Headers

| Property | Value |
|---|---|
| **Severity** | High |
| **File** | `C:\Users\ashis\techbar\next.config.ts` |
| **Status** | Missing configuration |

**Description:** The Next.js configuration does not define any security headers. The following critical headers are missing:
- `Content-Security-Policy` (CSP)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (HSTS)
- `X-XSS-Protection`
- `Referrer-Policy`
- `Permissions-Policy`

**Remediation:**
```typescript
const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-DNS-Prefetch-Control", value: "on" },
                    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-XSS-Protection", value: "1; mode=block" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://*.imagekit.io; frame-src https://js.stripe.com;",
                    },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                ],
            },
        ];
    },
};
```

---

### HIGH-04: No Authorization on Admin POS API Endpoints

| Property | Value |
|---|---|
| **Severity** | High |
| **Files** | `app/api/admin/pos/cart/create/route.ts`, `app/api/admin/pos/cart/add/route.ts`, `app/api/admin/pos/cart/clear/route.ts`, `app/api/admin/pos/cart/remove/route.ts`, `app/api/admin/pos/cart/[cartId]/route.ts`, `app/api/admin/pos/order/route.ts`, `app/api/admin/pos/order/create/route.ts`, `app/api/admin/pos/order/update-status/route.ts` |
| **Status** | Active vulnerability |

**Description:** All admin POS API endpoints accept POST/GET requests with **no authentication or authorization checks**. Any user (authenticated or not) can:
- Create POS carts and orders
- Add/remove items from POS carts
- Clear POS carts
- View all POS orders
- Create POS orders with arbitrary customer data
- Update order statuses

**Remediation:** Add admin role verification to every POS route:
```typescript
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.role || session.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // ... rest of logic
}
```

---

### HIGH-05: No Authorization on Admin Users List Endpoint

| Property | Value |
|---|---|
| **Severity** | High |
| **File** | `C:\Users\ashis\techbar\app\api\admin\users\route.ts` |
| **Status** | Active vulnerability |

**Description:** `GET /api/admin/users` lists all users (up to 100) including their emails, names, and roles without any authentication check. This is an information disclosure vulnerability.

**Remediation:** Add admin authentication check before calling `listUsers()`.

---

### HIGH-06: RBAC `isAdmin` Function Returns String on Failure Instead of Throwing

| Property | Value |
|---|---|
| **Severity** | High |
| **File** | `C:\Users\ashis\techbar\lib\rbac.ts` (lines 7-16) |
| **Status** | Active vulnerability |

**Description:** The `isAdmin` function catches errors and returns the error message as a string instead of throwing or returning false. Callers that use `await isAdmin(user.user)` in `lib/actions/admin-actions/prods.ts` get a string back, which is truthy in JavaScript, meaning the authorization check passes even when the user is NOT an admin:

```typescript
export async function isAdmin(user: UserT) {
  try {
    if (user && user.role) {
      if (user.role == "admin") return true;
      throw new Error("user is not admin");
    }
    throw new Error("user doesnt exists");
  } catch (error: any) {
    return error.message;  // BUG: Returns truthy string "user is not admin"!
  }
}
```

When `createProductAction` calls `await isAdmin(user.user)`, the result is `"user is not admin"` (a truthy string), and the code proceeds to create the product without checking the return value properly.

**Remediation:**
```typescript
export async function isAdmin(user: UserT): Promise<boolean> {
    if (!user?.role) return false;
    return user.role === "admin";
}
```

Then update callers to check the boolean:
```typescript
const admin = await isAdmin(user.user);
if (!admin) throw new Error("Unauthorized");
```

---

### HIGH-07: Server Actions Missing Authentication on Delete Operations

| Property | Value |
|---|---|
| **Severity** | High |
| **Files** | `lib/actions/admin-actions/prods.ts` (deleteProductAction), `lib/actions/categories.actions.ts` (deleteCategory) |
| **Status** | Active vulnerability |

**Description:** `deleteProductAction` and `deleteCategory` have no authentication check:

```typescript
// deleteProductAction
export async function deleteProductAction(id: string) {
    await deleteProductDb(id);  // No auth check!
    revalidatePath("/admin/products");
    return { success: true };
}
```

**Remediation:** Add session + admin role validation at the top of each server action.

---

### HIGH-08: SQL Injection Risk via Raw SQL in Search

| Property | Value |
|---|---|
| **Severity** | High |
| **File** | `C:\Users\ashis\techbar\lib\actions\search.ts` (lines 34-50) |
| **Status** | Potential vulnerability |

**Description:** While Drizzle ORM generally parameterizes queries, the search function uses raw SQL template literals with user input:
```typescript
sql`LOWER(${product.productName}->>'en') LIKE ${q.toLowerCase()}`
```

The `q` variable is derived from user input (`%${query}%`). Although Drizzle handles parameterization here, the pattern of building SQL strings with user-derived values in `sql\`\`` blocks is risky and can lead to injection if the ORM's escaping behavior changes.

**Remediation:** Use Drizzle's `ilike` helper instead of raw SQL where possible:
```typescript
import { ilike } from "drizzle-orm/pg-core";
// Use ilike for case-insensitive search
```

---

## Medium Severity

### MED-01: `ignoreBuildErrors: true` in Production Config

| Property | Value |
|---|---|
| **Severity** | Medium |
| **File** | `C:\Users\ashis\techbar\next.config.ts` (lines 6-8) |
| **Status** | Misconfiguration |

**Description:** TypeScript build errors are suppressed:
```typescript
typescript: {
    ignoreBuildErrors: true,
},
```
This can hide type errors that lead to runtime security vulnerabilities, such as incorrect type narrowing or missing null checks on auth objects.

**Remediation:** Set `ignoreBuildErrors: false` and fix all TypeScript errors.

---

### MED-02: Hardcoded Development Tunnel URL in `allowedOrigins`

| Property | Value |
|---|---|
| **Severity** | Medium |
| **File** | `C:\Users\ashis\techbar\next.config.ts` (lines 25-27) |
| **Status** | Configuration issue |

**Description:** A development tunnel URL is hardcoded in the production config:
```typescript
allowedOrigins: [
    "https://xtt5m66l-3000.inc1.devtunnels.ms",
    "http://localhost:3000",
],
```

**Remediation:** Move these to environment variables and use separate configs for development vs production.

---

### MED-03: Sensitive Data Logged in Console

| Property | Value |
|---|---|
| **Severity** | Medium |
| **Files** | Multiple files |
| **Status** | Active risk |

**Description:** Sensitive data is logged to console in multiple places:
- `app/api/cart/route.ts` line 7: `console.log(JSON.stringify(session))` - logs full session object including user data
- `auth.ts` line 23: `console.error("EMAIL ERROR:", err)` - logs full error object
- `lib/actions/create-review.ts` line 86: `console.log(r1)` - logs full review data with user emails
- `seed.ts` line 18: `console.log("user made ",user)` - logs created user details

**Remediation:** Use structured logging (e.g., `pino`, `winston`) with log levels. Never log session objects, tokens, or user PII in production.

---

### MED-04: Error Stack Trace Exposure in Development Mode

| Property | Value |
|---|---|
| **Severity** | Medium |
| **File** | `C:\Users\ashis\techbar\app\api\imagekit\upload\route.ts` (lines 103-107) |
| **Status** | Information disclosure |

**Description:** Error stack traces are conditionally exposed in API responses:
```typescript
details: process.env.NODE_ENV === "development" ? error.stack : undefined,
```

**Remediation:** Never include stack traces in API responses, even in development. Log them server-side only.

---

### MED-05: Weak Password Policy

| Property | Value |
|---|---|
| **Severity** | Medium |
| **File** | `C:\Users\ashis\techbar\auth.ts` (line 32) |
| **Status** | Configuration weakness |

**Description:** Minimum password length is only 8 characters with no complexity requirements enforced:
```typescript
minPasswordLength: 8,
maxPasswordLength: 128,
```

**Remediation:** Increase minimum to 12 characters and add complexity requirements (uppercase, lowercase, number, special character).

---

### MED-06: IP Address Spoofing via `cf-connecting-ip` Header

| Property | Value |
|---|---|
| **Severity** | Medium |
| **File** | `C:\Users\ashis\techbar\auth.ts` (lines 54-57) |
| **Status** | Potential vulnerability |

**Description:** The application trusts the `cf-connecting-ip` header for rate limiting and IP tracking:
```typescript
advanced: {
    ipAddress: {
        ipAddressHeaders: ["cf-connecting-ip"],
    },
},
```

If the application is not behind Cloudflare, any client can spoof their IP by sending this header.

**Remediation:** Only use `cf-connecting-ip` when behind Cloudflare. Add a fallback to the standard remote address when not behind a proxy.

---

### MED-07: Unreviewed `any` Type Usage in Payment Refund Action

| Property | Value |
|---|---|
| **Severity** | Medium |
| **File** | `C:\Users\ashis\techbar\lib\actions\admin-actions\payment-refund.ts` (lines 32-33) |
| **Status** | Type safety gap |

**Description:** Multiple Stripe instances are created from `process.env.STRIPE_SECRET_KEY!` without validation across different files:
- `lib/stripe.ts`
- `lib/actions/admin-actions/payment-refund.ts`
- `lib/actions/admin-actions/admin-customer-checkout.ts`
- `lib/actions/admin-actions/admin-analytic.ts`

**Remediation:** Create a single Stripe instance in a shared module and import it everywhere. Add validation that the key exists.

---

### MED-08: User Email Leaked in Review API Response

| Property | Value |
|---|---|
| **Severity** | Medium |
| **File** | `C:\Users\ashis\techbar\lib\actions\create-review.ts` (lines 77-91) |
| **Status** | Privacy issue |

**Description:** The `getReviews` function returns full user objects including email addresses in the review response:
```typescript
with: {
    user: {
        select: {
            id: true,
            name: true,
            image: true,
        },
    },
},
```

Despite the select clause, the actual query result (as shown in the code comments) includes the email field. Drizzle's `select` may not filter server-side in all cases.

**Remediation:** Explicitly map and filter the response to exclude email:
```typescript
const sanitizedReviews = r1.map(r => ({
    ...r,
    user: { id: r.user.id, name: r.user.name, image: r.user.image }
}));
return response(true, sanitizedReviews);
```

---

### MED-09: Rate Limiting Too Permissive

| Property | Value |
|---|---|
| **Severity** | Medium |
| **File** | `C:\Users\ashis\techbar\auth.ts` (lines 58-61) |
| **Status** | Configuration weakness |

**Description:** Rate limiting allows 100 requests per 10-second window:
```typescript
rateLimit: {
    window: 10,
    max: 100,
},
```

This is 10 requests/second, which is too high for auth endpoints (login, password reset, signup). This enables brute-force attacks.

**Remediation:**
```typescript
rateLimit: {
    window: 60,       // 60-second window
    max: 10,          // Max 10 attempts per window for auth endpoints
},
```

---

### MED-10: No Input Validation on Admin POS Order Creation

| Property | Value |
|---|---|
| **Severity** | Medium |
| **File** | `C:\Users\ashis\techbar\app\api\admin\pos\order\create\route.ts` (lines 12-20) |
| **Status** | Active risk |

**Description:** The POS order creation endpoint accepts arbitrary JSON with no validation:
```typescript
const { cartId, customerName, customerEmail, customerPhone, customerAddress } = await req.json();
```

No validation on email format, phone format, or required fields.

**Remediation:** Use Zod schema to validate the request body.

---

### MED-11: Google OAuth `prompt` Contains Invalid Value

| Property | Value |
|---|---|
| **Severity** | Medium |
| **File** | `C:\Users\ashis\techbar\auth.ts` (line 51) |
| **Status** | Configuration bug |

**Description:** The Google OAuth prompt is set to `"select_account consent"` (space-separated string), but Google expects either a single value or an array. This may cause unexpected OAuth behavior.

**Remediation:**
```typescript
prompt: "select_account", // or ["select_account", "consent"]
```

---

### MED-12: No Server-Side Validation on Review Creation

| Property | Value |
|---|---|
| **Severity** | Medium |
| **File** | `C:\Users\ashis\techbar\lib\actions\create-review.ts` (lines 40-62) |
| **Status** | Active risk |

**Description:** The `createReview` function does not verify that the user has actually purchased the product before allowing a review. Any authenticated user can review any product without purchase verification.

**Remediation:** Check the orders table for a completed order containing the product before allowing a review.

---

## Low Severity

### LOW-01: `.env` in `.gitignore` But `.env.local` Tracked

| Property | Value |
|---|---|
| **Severity** | Low |
| **Files** | `.gitignore` (line 30), `.env.local` |
| **Status** | Configuration concern |

**Description:** `.env` is ignored but `.env.local` exists with real credentials. If `.env.local` is not in `.gitignore`, it could be accidentally committed.

**Remediation:** Add `.env.local` to `.gitignore`. The current `.gitignore` has `.env` but not `.env.local` explicitly.

---

### LOW-02: Development/Test Files in Production Codebase

| Property | Value |
|---|---|
| **Severity** | Low |
| **Files** | `test-schema.ts`, `n.ts`, `tmp-check.ts`, `items.md`, `app/test/`, `app/test1/`, `app/products/[id]/test.tsx` |
| **Status** | Code hygiene |

**Description:** Multiple test and development files are present in the production codebase. These can expose internal implementation details or test endpoints.

**Remediation:** Move test files to a dedicated `__tests__` or `tests/` directory and exclude from production builds.

---

### LOW-03: Unused `bcryptjs` and `jsonwebtoken` Dependencies

| Property | Value |
|---|---|
| **Severity** | Low |
| **File** | `package.json` |
| **Status** | Dependency concern |

**Description:** `bcryptjs` and `jsonwebtoken` are listed as dependencies but better-auth handles password hashing and session management internally. These extra crypto dependencies increase the attack surface.

**Remediation:** Audit if these are actually used. If not, remove them from `package.json`.

---

### LOW-04: Hardcoded Default Email Sender Address

| Property | Value |
|---|---|
| **Severity** | Low |
| **File** | `C:\Users\ashis\techbar\lib\sendemail.ts` (line 15) |
| **Status** | Configuration concern |

**Description:** Default sender email is hardcoded:
```typescript
from = "Techbar.store <techbar.store@techbar.store>"
```

**Remediation:** Move to environment variable.

---

### LOW-05: `@barba/core` Dependency Unusual for Next.js

| Property | Value |
|---|---|
| **Severity** | Low |
| **File** | `package.json` |
| **Status** | Compatibility concern |

**Description:** `@barba/core` is a page transition library designed for vanilla JS/MPA setups. Using it with Next.js App Router can cause unexpected behavior and may interfere with Next.js routing security.

**Remediation:** Verify if Barba is needed. Next.js has built-in transition support.

---

### LOW-06: `uuid` Package Version 13

| Property | Value |
|---|---|
| **Severity** | Low |
| **File** | `package.json` |
| **Status** | Version concern |

**Description:** `uuid` version 13.0.0 is listed. Verify this is the intended package as version numbering seems unusual for the standard `uuid` npm package (standard is at v9-10 range).

**Remediation:** Verify the package name and version. Consider using `crypto.randomUUID()` from Node.js built-in instead.

---

### LOW-07: No Rate Limiting on Non-Auth API Routes

| Property | Value |
|---|---|
| **Severity** | Low |
| **Files** | All non-auth API routes |
| **Status** | Missing protection |

**Description:** Rate limiting is only configured for auth endpoints via better-auth. API routes for products, cart, payments, etc. have no rate limiting.

**Remediation:** Add rate limiting middleware or apply it per-route.

---

### LOW-08: `credentials: "include"` Without SameSite Cookie Policy

| Property | Value |
|---|---|
| **Severity** | Low |
| **File** | `C:\Users\ashis\techbar\lib\auth-client.ts` (line 7) |
| **Status** | Configuration concern |

**Description:** Cookies are sent with every cross-origin request (`credentials: "include"`) without explicit SameSite configuration. This increases CSRF attack surface.

**Remediation:** Configure cookies with `SameSite=Lax` or `SameSite=Strict` in better-auth cookie settings.

---

## Informational

### INFO-01: `bcryptjs` vs `bcrypt`

| Property | Value |
|---|---|
| **Severity** | Info |
| **File** | `package.json` |

**Description:** The project uses `bcryptjs` (pure JS implementation) rather than native `bcrypt`. `bcryptjs` is approximately 30% slower. Not a security issue but a performance note.

---

### INFO-02: Session Token Stored in Cookie

| Property | Value |
|---|---|
| **Severity** | Info |
| **File** | `auth.ts`, `auth-schema.ts` |

**Description:** Better-auth stores session tokens in cookies. Verify that the `HttpOnly`, `Secure`, and `SameSite` flags are set on production cookies. This should be configured in better-auth's cookie options.

---

### INFO-03: No Audit/Dependency Scanning in CI

| Property | Value |
|---|---|
| **Severity** | Info |
| **File** | `package.json` scripts |

**Description:** No `npm audit` or dependency vulnerability scanning is configured in the project scripts or CI pipeline.

**Remediation:** Add `npm audit` to CI pipeline and consider using tools like Snyk or Dependabot.

---

### INFO-04: Google OAuth `accessType: "offline"` Without Refresh Token Handling

| Property | Value |
|---|---|
| **Severity** | Info |
| **File** | `auth.ts` (line 49) |

**Description:** `accessType: "offline"` requests refresh tokens from Google, but the schema's `account` table stores `refresh_token` as plain text. Verify that refresh tokens are encrypted at rest.

---

### INFO-05: Schema Exports Duplicate Tables

| Property | Value |
|---|---|
| **Severity** | Info |
| **Files** | `auth-schema.ts` and `lib/db/schema.ts` |

**Description:** Both `auth-schema.ts` and `lib/db/schema.ts` define the same auth tables (`user`, `session`, `account`, `verification`). The auth config uses the schema from `lib/db/schema.ts`. The `auth-schema.ts` file is redundant and could cause confusion if they diverge.

---

## Summary by Severity

| Severity | Count |
|---|---|
| Critical | 5 |
| High | 8 |
| Medium | 12 |
| Low | 8 |
| Info | 5 |
| **Total** | **38** |

## Priority Recommendations

1. **Immediate (Critical):** Rotate all exposed secrets (GitHub OAuth, admin password), restrict admin endpoint access, fix the RBAC `isAdmin` function.
2. **Short-term (High):** Add middleware for route protection, implement CSRF tokens, add security headers, add auth checks to all admin POS endpoints.
3. **Medium-term (Medium):** Fix build error suppression, remove console logging of sensitive data, strengthen password policy, add input validation, tighten rate limiting.
4. **Long-term (Low/Info):** Clean up test files, audit dependencies, add CI security scanning, consolidate schema definitions.
