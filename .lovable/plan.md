# Make iwantinformationnow.com work like MiyTube

Goal: retire the static SiteGround site and serve iwantinformationnow.com from this same app — real uploads, accounts, categories, watch-pages, search, ads — but with its own content and its own branding.

## How it will work

One codebase, one database, two domains. Every piece of content gets a `site` tag (`miytube` or `iwin`). The app reads the browser hostname and shows only that site's content, logo, and colors.

```text
miytube.com ─────────────┐
                         ├──> same React app ──> same database
iwantinformationnow.com ─┘        (filters + brands by hostname)
```

## Steps

1. **Add site tagging (database)**
   - Add a `site` column (default `miytube`) to: `uploaded_videos`, `music_videos`, `custom_categories`, `custom_subcategories`, `custom_watch_pages`, `blog_posts`, `breaking_news`, `discussions`, `pictures`, `documents`, `ad_campaigns`.
   - Backfill all existing rows to `miytube` so nothing changes on the current site.
   - Index `site` for fast filtering.

2. **Site context in the app**
   - New `src/config/sites.ts` + `useSite()` hook: resolves the active site from `window.location.hostname` (with a `?site=` override for previewing).
   - Each site gets its own name, tagline, logo, accent colors, and meta title/description.

3. **Filter every read by site**
   - Home feed, trending, shorts, category/watch pages, search (including the `ai-search` edge function), sitemaps, and the creator dashboard all scope to the active site.

4. **Tag every write by site**
   - Uploads, category/watch-page creation, blog posts, discussions and ad campaigns save the current site automatically.

5. **Branding + SEO per site**
   - Header logo, favicon, footer, and page titles switch by site.
   - Dynamic sitemap and robots output per domain.

6. **Shared vs separate**
   - Shared: user accounts, admin panel, ad system, Stripe, email. One login works on both.
   - Separate: all content, categories, and watch-pages.
   - Admin panel gets a site filter so you can moderate each site independently.

7. **Point the domain**
   - Add `iwantinformationnow.com` as a second custom domain on this project and update DNS at SiteGround. The static files stay untouched until DNS flips, so there's no downtime.

## Technical notes

- Filtering uses `.eq('site', site)` on the public views/tables; RLS is unchanged, so no new security surface.
- The default `'miytube'` on the `site` column means any code path not yet updated keeps behaving exactly as today.
- Local/offline video cache keys get namespaced by site so the two feeds don't mix in one browser.
- Categories currently hardcoded in sidebar components (`SportsExtendedLinks.tsx` etc.) are MiyTube-specific; the iwin sidebar will be driven purely by its own `custom_categories` rows, which start empty and you populate.

## What you'll need to do

- Confirm the iwantinformationnow.com branding (logo file, main color, tagline).
- Add the domain in project settings and update its DNS.
