# docfinish-web

Frontend for **DocFinish**: turn AI-generated Markdown into client-ready PDFs and Google Docs.
Next.js (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Radix UI primitives. Deploys to Vercel
at `app.docfinish.com` / `www.docfinish.com`.

Markdown rendering, pagination, Mermaid and math all run **locally in the browser**. The app calls only the
Fastify API (`docfinish-api`); no third-party keys or credentials exist in this repo or its bundles.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev                       # http://localhost:3000
```

Run `docfinish-api` alongside it (see that repo; `DATA_STORE=memory` needs no database). Public pages and the
no-login preview work even with the API offline.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the API, e.g. `http://localhost:4000` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata / OG tags |

Scripts: `npm run dev | build | start | lint | typecheck | test`.

## Routes

Public: `/`, `/tools` (+ `/tools/markdown-viewer`, `markdown-to-pdf`, `markdown-to-google-docs`, `pdf-to-markdown`,
`ai-markdown-to-pdf`), `/templates` (+ `/templates/[slug]`), `/resources` (+ `/resources/[slug]`), `/pricing`, `/login`, `/signup`.
Authenticated (noindex, redirect to `/login?next=…` when signed out): `/dashboard`, `/editor/[documentId]`, `/projects`,
`/brand-kit`, `/billing`, `/settings`.

## Structure

```
src/app/(marketing)  public pages + SEO metadata     src/lib/api         typed API client + contract types
src/app/(auth)       login / signup                  src/lib/pagination  print-style page layout engine
src/app/(app)        authenticated app               src/lib/markdown    unified/remark/rehype pipeline
src/components/workspace   editor, settings, export  src/lib/templates   8 templates (starter + layout)
```

`src/lib/api/types.ts` mirrors `docfinish-api/docs/API.md`; update both together when the contract changes.

## Behavior to know

* Guests can preview and customise freely (draft kept in `localStorage`); **export requires login**. Free: 3 PDF exports/month,
  basic templates, 1 project. Pro: unlimited exports, Google Docs, brand kit, premium templates. PDFs are never watermarked.
* Google Docs export shows an explanatory disabled state until the API reports Google as configured.
* After checkout the app re-reads entitlements; Pro is granted by the payment webhook, not by the redirect.

## Deploy to Vercel

1. Import the repo in Vercel (framework: Next.js; defaults are fine).
2. Environment variables: `NEXT_PUBLIC_API_BASE_URL=https://api.docfinish.com`, `NEXT_PUBLIC_SITE_URL=https://www.docfinish.com`.
3. Add domains `app.docfinish.com` and `www.docfinish.com` (redirect one to the other if you prefer a single host).
4. In the API set `CORS_ORIGINS` / `WEB_APP_URL` to the deployed origins and `COOKIE_DOMAIN=.docfinish.com` so the session
   cookie is shared between `app.` and `api.`.
