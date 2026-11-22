# DocFinish API Contract (v1)

This document is the contract between `docfinish-web` (Next.js, Vercel) and `docfinish-api` (Fastify, Render).
Both repositories keep a copy. When it changes, update both.

- Production base URL: `https://api.docfinish.com`
- Local base URL: `http://localhost:4000` (web runs on `http://localhost:3000`)
- All request and response bodies are JSON (`application/json`) unless noted.
- Timestamps are ISO-8601 strings (UTC).

## Conventions

### Authentication

- Session-based. `POST /auth/login` and `POST /auth/register` set an HTTP-only cookie `df_session`
  (opaque random token, stored hashed in the `sessions` table, 30-day rolling expiry).
- Cookie attributes: `HttpOnly; SameSite=Lax; Path=/; Secure` (Secure off in local dev);
  `Domain=.docfinish.com` in production (configurable via `COOKIE_DOMAIN`).
- The web client always sends `credentials: "include"`.

### CSRF protection

Every non-GET request authenticated by cookie must include the header:

```
X-DocFinish-Client: web
```

The custom header forces a CORS preflight, and CORS only allows origins in `CORS_ORIGINS`
(`https://app.docfinish.com,https://www.docfinish.com` in production). Requests without it get `403 CSRF_REJECTED`.
Exempt: `POST /billing/webhook/:provider`, `GET /google/callback`.

### Errors

All errors use one envelope:

```json
{ "error": { "code": "QUOTA_EXCEEDED", "message": "Human readable message", "details": {} } }
```

| HTTP | code | Meaning |
|------|------|---------|
| 400 | `VALIDATION_ERROR` | Body/query failed validation. `details.issues` lists the issues |
| 401 | `UNAUTHENTICATED` | No valid session |
| 403 | `FORBIDDEN` | Not owner / not allowed |
| 403 | `CSRF_REJECTED` | Missing `X-DocFinish-Client` header |
| 403 | `PLAN_REQUIRED` | Feature needs Pro. `details.feature` names it |
| 402 | `QUOTA_EXCEEDED` | Plan limit reached. `details.limit`, `details.used`, `details.resetsAt` |
| 404 | `NOT_FOUND` | Missing, or owned by someone else (do not leak existence) |
| 409 | `CONFLICT` | e.g. email already registered |
| 413 | `FILE_TOO_LARGE` | Upload exceeds limit |
| 415 | `UNSUPPORTED_FILE_TYPE` | Extension/MIME/magic bytes rejected |
| 429 | `RATE_LIMITED` | Too many requests. `Retry-After` header set |
| 503 | `PROVIDER_NOT_CONFIGURED` | Integration (Google, billing, conversion) lacks credentials |
| 500 | `INTERNAL` | Unexpected error (no internals leaked) |

## Shared types

```ts
type Plan = "free" | "pro";

interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  plan: Plan;
  createdAt: string;
}

interface Entitlements {
  plan: Plan;
  pdfExportsPerMonth: number | null;   // free: 3, pro: null (unlimited)
  maxProjects: number | null;          // free: 1, pro: null
  googleDocsExport: boolean;           // pro only
  brandKit: boolean;                   // pro only
  premiumTemplates: boolean;           // pro only
  headerFooterPresets: boolean;        // pro only
  customBranding: boolean;             // logo, colors, fonts: pro only for *saving*; preview allowed for all
  pdfToMarkdown: boolean;              // pro only
  priorityQueue: boolean;              // pro only
}

interface Usage {
  periodStart: string;                 // first day of current calendar month UTC
  periodEnd: string;                   // first day of next month UTC
  pdfExports: number;
  projects: number;
}

type PageSize = "A4" | "Letter";
type Orientation = "portrait" | "landscape";
type Align = "left" | "center" | "right";

interface HeaderFooterSettings {
  enabled: boolean;
  left: string;                        // supports tokens: {title} {date} {page} {pages} {company}
  center: string;
  right: string;
  showOnFirstPage: boolean;
}

interface DocumentSettings {
  pageSize: PageSize;
  orientation: Orientation;
  margins: { top: number; right: number; bottom: number; left: number }; // millimetres, 5–50
  fontFamily: string;                  // body font key, e.g. "source-serif", "inter", "ibm-plex-sans"
  headingFontFamily: string;
  baseFontSize: number;                // pt, 9–14
  lineHeight: number;                  // 1.2–2.0
  textColor: string;                   // #rrggbb
  accentColor: string;                 // #rrggbb
  header: HeaderFooterSettings;
  footer: HeaderFooterSettings;
  pageNumbers: {
    enabled: boolean;
    placement: "header" | "footer";
    align: Align;
    format: "n" | "page-n" | "n-of-total";   // "3" | "Page 3" | "3 / 12"
    showOnFirstPage: boolean;
    startAt: number;
  };
  logo: {
    dataUrl: string | null;            // PNG/JPEG/WebP/SVG data URL, max 500 KB
    placement: "header-left" | "header-right" | "title";
    heightMm: number;                  // 6–30
  };
  titlePage: boolean;                  // first page rendered as cover
  companyName: string;                 // fills {company}
}

interface TemplateSummary {
  id: string;                          // slug
  name: string;
  category: string;
  tier: "basic" | "premium";
  description: string;
  previewImage: string;                // path on the web app, e.g. "/templates/client-proposal.svg"
}

interface Template extends TemplateSummary {
  starterMarkdown: string;
  settings: DocumentSettings;
  styles: Record<string, string>;      // CSS variable overrides, e.g. {"--df-h1-size":"28pt"}
}

interface ProjectSummary {
  id: string;
  name: string;
  templateId: string;
  updatedAt: string;
  createdAt: string;
  excerpt: string;                     // first ~160 chars of plain text
}

interface Project extends ProjectSummary {
  markdown: string;
  settings: DocumentSettings;
  version: number;                     // increments on each save; used for optimistic concurrency
}

interface DocumentVersion { id: string; version: number; createdAt: string; excerpt: string }

interface BrandKit {
  name: string;
  companyName: string;
  logoDataUrl: string | null;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  headerPresets: Array<{ id: string; name: string; header: HeaderFooterSettings; footer: HeaderFooterSettings }>;
  defaultPageSize: PageSize;
  defaultMargins: DocumentSettings["margins"];
  updatedAt: string;
}

type JobStatus = "queued" | "processing" | "succeeded" | "failed";

interface ConversionJob {
  id: string;
  type: "markdown_to_pdf" | "pdf_to_markdown";
  status: JobStatus;
  mode: "browser" | "server";          // markdown_to_pdf only
  provider: string;                    // "browser" | "mock" | "rapidapi-..." etc.
  createdAt: string;
  completedAt: string | null;
  error: { code: string; message: string } | null;
  result: {
    downloadUrl?: string;              // short-lived signed URL (/downloads/:id?token=...)
    expiresAt?: string;
    markdown?: string;                 // pdf_to_markdown
  } | null;
}

interface StoredFile {
  id: string;
  kind: "markdown" | "pdf" | "image";
  name: string;
  size: number;
  mimeType: string;
  expiresAt: string | null;            // temporary uploads expire after 24h
  text?: string;                       // returned for markdown uploads (UTF-8 content)
}

interface Subscription {
  provider: string;
  status: "active" | "trialing" | "past_due" | "canceled" | "expired";
  plan: "pro_monthly" | "pro_yearly";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}
```

## Endpoints

Legend: 🔓 public · 🔐 session required · ⭐ Pro required · ⏱ rate limited

### Health

`GET /health` 🔓 → `{ "status": "ok", "version": "1.0.0", "time": "..." }`

### Auth

`POST /auth/register` 🔓 ⏱ (5/min/IP)
Body `{ email, password (8–128 chars), name? }` → `201 { user: User }` + sets cookie. `409 CONFLICT` if email exists.

`POST /auth/login` 🔓 ⏱ (10/min/IP, plus per-email backoff)
Body `{ email, password }` → `200 { user: User }` + sets cookie. Wrong credentials → `401 UNAUTHENTICATED` (generic message).

`POST /auth/logout` 🔐 → `204`, clears cookie, deletes session.

`GET /auth/me` 🔐 →
```json
{ "user": User, "entitlements": Entitlements, "usage": Usage,
  "google": { "configured": boolean, "connected": boolean, "email": string | null },
  "billing": { "provider": string, "configured": boolean } }
```

### Templates

`GET /templates` 🔓 → `{ templates: TemplateSummary[] }`
`GET /templates/:id` 🔓 → `{ template: Template }`

### Projects

`GET /projects` 🔐 → `{ projects: ProjectSummary[] }` (most recently updated first)

`POST /projects` 🔐 Body `{ name, templateId, markdown?, settings? }` → `201 { project: Project }`.
Free plan with ≥1 project → `402 QUOTA_EXCEEDED` (`details.limit = 1`).

`GET /projects/:id` 🔐 → `{ project: Project, versions: DocumentVersion[] }` (versions: Pro gets full history, free gets latest only)

`PATCH /projects/:id` 🔐 Body (all optional) `{ name, templateId, markdown, settings, baseVersion, snapshot }` → `{ project: Project }`.
- `baseVersion`: if given and it doesn't match the current `version` → `409 CONFLICT` with `details.current: Project`.
- Autosave sends PATCH debounced (~1.5 s). The server writes a new `documents` history row at most every 10 minutes per project, or when `snapshot: true`.
- Premium template IDs on a free plan → `403 PLAN_REQUIRED`.

`DELETE /projects/:id` 🔐 → `204`

`GET /projects/:id/versions/:versionId` 🔐 ⭐ → `{ version: DocumentVersion & { markdown: string; settings: DocumentSettings } }`

### Brand kit

`GET /brand-kit` 🔐 → `{ brandKit: BrandKit | null }` (free users get `null` and may still read)
`PUT /brand-kit` 🔐 ⭐ Body = `BrandKit` without `updatedAt` → `{ brandKit: BrandKit }`

### Files

`POST /files/upload` 🔐 ⏱ (20/min/user) — `multipart/form-data`, single field `file`, optional field `purpose` = `markdown | pdf | logo`.
- `.md`/`.markdown`/`.txt` (text/markdown, text/plain, text/x-markdown): max 2 MB, must be valid UTF-8 → returns `text`.
- `.pdf` (application/pdf, must start with `%PDF-`): max 20 MB (free plan: rejected with `PLAN_REQUIRED` for purpose `pdf`).
- `.png/.jpg/.jpeg/.webp/.svg` logos: max 500 KB (SVG is sanitized).
→ `201 { file: StoredFile }`. Files are temporary (24 h TTL) unless attached to a saved project.

Note: the web app reads `.md` files locally with `FileReader` for no-login preview; the upload endpoint is used for PDFs and for server-side storage.

### Conversions

`POST /conversions/markdown-to-pdf` 🔐 ⏱ (30/min/user)
Body:
```json
{ "projectId": "optional", "title": "string", "mode": "browser" | "server",
  "html": "required when mode=server: the rendered, paginated document HTML (sanitized server-side)",
  "markdown": "optional", "settings": DocumentSettings }
```
- Checks the monthly PDF quota (free: 3/month) **before** doing any work → `402 QUOTA_EXCEEDED` when exhausted.
- `mode: "browser"` (default, highest fidelity): server records the usage event and returns a job with `status: "succeeded"` and `provider: "browser"`; the web app then prints its own paginated preview to PDF (`window.print()` with `@page` CSS).
- `mode: "server"`: creates a `conversion_jobs` row and runs the configured `ConversionProvider.markdownToPdf()`; when it succeeds, `result.downloadUrl` is a signed URL valid for 10 minutes.
→ `201 { job: ConversionJob, usage: Usage }`

`POST /conversions/pdf-to-markdown` 🔐 ⭐ ⏱ Body `{ fileId }` → `202 { job: ConversionJob }`

`GET /conversions/:id` 🔐 → `{ job: ConversionJob }` (poll every 1.5 s until `succeeded`/`failed`)

### Downloads

`GET /downloads/:id?token=...` 🔓 (token-gated) → streams the file with `Content-Disposition: attachment`.
`token` is an HMAC-signed, 10-minute token bound to the file id. An authenticated owner may also download without a token.
Expired/invalid → `404 NOT_FOUND`.

### Google Docs

`GET /google/status` 🔐 → `{ configured: boolean, connected: boolean, email: string | null }`

`GET /google/connect` 🔐 (top-level navigation, not fetch) → `302` to Google OAuth consent
(scopes: `openid email https://www.googleapis.com/auth/drive.file`; `access_type=offline`, `prompt=consent`, signed `state`).
When Google isn't configured → `302` to `${WEB_APP_URL}/settings?google=not_configured`.

`GET /google/callback` 🔓 (state-verified) → exchanges the code, stores encrypted tokens, `302` to `${WEB_APP_URL}/settings?google=connected` (or `?google=error`).

`POST /google/disconnect` 🔐 → `204` (revokes and deletes tokens)

`POST /google/export-document` 🔐 ⭐ ⏱ (10/min/user)
Body `{ projectId?, title, markdown, settings: DocumentSettings }` →
`201 { documentId: string, url: string }`.
The server converts Markdown into Google Docs `batchUpdate` requests (headings, paragraphs, bold/italic/code,
links, bullet/numbered/check lists, tables, blockquotes, code blocks, horizontal rules), then creates the header and footer
with the configured text (and page numbers where the Docs API supports them).
Errors: `503 PROVIDER_NOT_CONFIGURED` (no Google credentials), `409 CONFLICT` with `details.reason = "google_not_connected"`.

### Billing

`POST /billing/checkout` 🔐 Body `{ plan: "pro_monthly" | "pro_yearly" }` → `{ checkoutUrl: string }`

`POST /billing/webhook/:provider` 🔓 (signature-verified, raw body) → `200 { received: true }`.
The webhook is the **source of truth** for Pro access: it updates `subscriptions` and sets `users.plan`.

`GET /billing/subscription` 🔐 → `{ subscription: Subscription | null, entitlements: Entitlements }`

`POST /billing/cancel` 🔐 → `{ subscription: Subscription }` (cancel at period end)

Mock provider only (`BILLING_PROVIDER=mock`): `checkoutUrl` points to `GET /billing/mock/complete?session=<signed>`,
which sends a signed mock webhook through the same webhook pipeline and redirects to
`${WEB_APP_URL}/billing?checkout=success`.

## Plan limits summary

| Capability | Free | Pro |
|---|---|---|
| Preview without login | ✅ | ✅ |
| PDF exports | 3 / month (login required) | Unlimited |
| Projects | 1 | Unlimited + version history |
| Templates | basic | basic + premium |
| Header/footer text | ✅ | ✅ + reusable presets |
| Logo / colors / fonts saved | preview only | ✅ |
| Brand kit | ❌ | ✅ |
| Google Docs export | ❌ | ✅ |
| PDF → Markdown | ❌ | ✅ (credits later) |
| Watermark | never | never |

## Template IDs (seeded in the API, bundled in the web app)

| id | name | tier |
|---|---|---|
| `client-proposal` | Client Proposal | basic |
| `business-report` | Business Report | basic |
| `project-brief` | Project Brief | basic |
| `meeting-notes` | Meeting Notes | basic |
| `sop` | Standard Operating Procedure | premium |
| `resume` | Resume | premium |
| `invoice` | Invoice | premium |
| `academic-paper` | Academic Paper | premium |
