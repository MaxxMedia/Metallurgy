# Technology News Dark (Next.js)

Next.js 15 port of the static Nerio WordPress mirror in `../technology-news-dark`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and compare with the original `index.html`.

## Environment variables

**None are required.** Site name, URLs, and content come from `data/settings.json` and `content/`.

Optional local file (see `.env.example`):

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | No | Public site origin (default `http://localhost:3000`; use your production URL when deploying) |
| `PORT` | No | Dev server port (Next.js default `3000`) |

Copy the example file if you want overrides:

```bash
copy .env.example .env
```

## Regenerate extracted HTML (after mirror changes)

```bash
npm run assets:sync
npm run content:index
npm run data:build
```

This updates `content/extracted/` from `../technology-news-dark/index.html` (header, footer, home main, head styles).

## Project layout

- `app/` — routes (home done; archives/posts next)
- `components/layout/` — shell (preloader, header, footer, legacy CSS/JS)
- `content/extracted/` — verbatim HTML chunks from the mirror
- `lib/` — asset paths and page bundle mapping
- `public/wp-content/` — images, optimizer CSS/JS
- `public/wp-includes/` — jQuery (for legacy Elementor scripts)

## Migration status

- [x] Next.js scaffold, assets in `public/`
- [x] Global shell (header/footer/preloader)
- [x] Home page (`/`) with original CSS + JS bundles
- [x] **32 single posts** at `/2025/[month]/[day]/[slug]` (SSG, per-post CSS/JS from mirror)
- [x] **9 category archives** at `/category/[slug]` (includes mirror `/category/tech` 404 page)
- [x] **14 tag archives** at `/tag/[slug]`
- [x] **Author** at `/author/[slug]` (Matt Rosnor / `istiak`)
- [x] **Blog** and static pages: `/blog`, `/about-us`, `/contact`, `/login`, `/register`
- [x] **Search** at `/search` (blog archive layout; mirror has no dedicated search HTML)
- [x] **Date archives** at `/2025`, `/2025/[month]`, `/2025/[month]/[day]`
- [x] Redirect `/category/tech` → `/category/tech-2`
