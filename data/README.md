# Data layer

Structured JSON under `data/` powers future presentational components and backend swaps without changing legacy HTML pages.

## Files

| File | Purpose |
|------|---------|
| `posts.json` | All posts (merged WP REST + route/bundle metadata) |
| `categories.json` | Categories |
| `tags.json` | Tags |
| `authors.json` | Authors |
| `featured.json` | Home featured section post order |
| `trending.json` | Header ticker / live news post order |
| `advertisements.json` | Ad banner assets |
| `menu.json` | Primary, mobile, footer nav |
| `settings.json` | Site name, logos, newsletter, social |
| `widgets.json` | Sidebar widget config |

## Regenerate

After updating mirror indexes or extracted HTML:

```bash
npm run posts:index
npm run categories:index
npm run tags:index
npm run extract
npm run data:build
```

## API

Use `lib/api.ts` in new code:

- `getPosts()`, `getCategories()`, `getAuthors()`, `getTags()`
- `getFeatured()`, `getTrending()`, `getFeaturedPosts()`, `getTrendingPosts()`
- `getMenu()`, `getSettings()`, `getAdvertisements()`, `getSidebarWidgets()`

Legacy routes render React views from `data/*.json` via `ThemeLayout` (theme CSS/JS only — no `dangerouslySetInnerHTML` for page content).

Types: `types/data.ts`.
