# CLAUDE.md

Guidance for Claude Code in this repository (DocFinish web app). Conventions follow `mc-web` where they apply.
Read `AGENTS.md` too: this Next.js version (16, Cache Components) has breaking changes, check `node_modules/next/dist/docs/` first.

## Commands

```sh
npm run dev         # http://localhost:3000 (needs docfinish-api on NEXT_PUBLIC_API_BASE_URL)
npm run build       # next build (server output; Cache Components enabled)
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm test            # vitest, tests/unit
```

## Architecture: Container-Component (as in mc-web)

- `src/app/` routes only. Pages are thin and compose a container (`export default function XPage() { return <XContainer />; }`).
- `src/containers/` logic, data fetching (React Query), mutations, state; pass props down. Named `XContainer.tsx`.
- `src/components/` presentational; no data fetching, except the editor workspace under `components/workspace` and `components/document`
  (pre-existing, owns its own state).
- `src/lib/` pure logic and the typed API client (`lib/api/client.ts`, contract types in `lib/api/types.ts`, mirrors `docfinish-api/docs/API.md`).
- The browser only ever talks to the Fastify API. No provider keys, ever.

## Rules

- **Imports: always the `@/` alias, never relative** (pre-commit and CI enforce it).
- **Tests live in `tests/unit/` mirroring `src/`** (never inside `src/`), e.g. `tests/unit/lib/api/client.test.ts` tests `src/lib/api/client.ts`.
  New logic is test-first (Red, Green, Refactor). Pure logic is mandatory to test. Assert on behaviour, mock external APIs not internal modules.
- Strong loading, error, empty and success states on every data view (`EmptyState`, `ErrorState`, `Skeleton`).
- Authenticated routes live in the `(app)` group (noindex, guarded by `AppShellContainer`, redirects to `/login?next=`). `safeNext()` guards redirects.
- Pre-commit hook (`.githooks/pre-commit`, wired by `npm install`): eslint on staged files, `tsc --noEmit`, relative-import check, tests.
- CI (`.github/workflows/ci.yml`): audit, lint, typecheck, tests, relative-import check, build.

## Deliberate differences from mc-web

- Styling is **Tailwind CSS 4 + Radix primitives** (the product spec requires it), not CSS Modules/tokens. The mc-web "no inline styles / rem-only"
  rules do not apply here; use Tailwind utilities and the theme tokens in `src/app/globals.css` (canvas, paper, ink, navy, cobalt).
- Test runner is Vitest (already installed) rather than Jest + RTL; the folder layout matches mc-web.
- Three `react-hooks` compiler rules (`set-state-in-effect`, `immutability`, `refs`) are warnings, because existing editor code predates them.
  Do not add new violations; fix existing ones when you touch those files.

## Product facts

Free: preview without login, login to export, 3 PDF exports/month, basic templates, 1 project, no brand kit, no Google Docs. Pro: unlimited exports,
Google Docs, brand kit, premium templates, unlimited projects with history. PDFs are never watermarked. Pro access comes from billing webhooks only; after
checkout the UI re-reads entitlements, it never assumes Pro from the redirect. Palette: warm off-white canvas, ink text, dark navy chrome, cobalt accent.
