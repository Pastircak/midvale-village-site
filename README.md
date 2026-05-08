# Village of Midvale — Website

A static, fast, free-to-host community website for the Village of Midvale,
Tuscarawas County, Ohio. Built with Astro + Tailwind, deployed on Cloudflare Pages.

> **Status:** unofficial demonstration. Until the Village Council formally
> adopts this site, every page shows a persistent demo banner. Flip
> `isOfficial: true` in `src/data/site.json` to remove it after approval.

---

## TL;DR for the maintainer

```bash
# One-time cleanup (legacy stub files the scaffold couldn't auto-delete):
rm src/content/config.ts tailwind.config.mjs

# One-time install
nvm use            # uses Node 20+
npm install

# Day-to-day
npm run dev        # http://localhost:4321
npm run build      # static output in ./dist
npm run preview    # serve the built site locally
```

> The two stub files above are already in `.gitignore` so they will never reach
> Cloudflare Pages, but the build will warn locally until you delete them. They
> exist because the scaffold ran in an environment that wouldn't let it delete
> files it created earlier. Just remove them once.

Deploys are automatic: push to `main` and Cloudflare Pages publishes within ~90 seconds.

---

## Stack

- **Astro 6** (static site generator)
- **Tailwind CSS v4** (configured in CSS via `@theme` in `src/styles/global.css` — there is no `tailwind.config.mjs`)
- **Cloudflare Pages** (hosting + Pages Functions)
- **MailChannels + Cloudflare Turnstile** for the contact form

## What this repository contains

| Path | Purpose |
|---|---|
| `astro.config.mjs` | Astro + sitemap + Tailwind Vite plugin |
| `src/styles/global.css` | Theme tokens via `@theme {}` (Tuscarawas Green, Heritage Cream, etc.) |
| `src/layouts/` | Page layouts (`BaseLayout`, `PageLayout`, `ProseLayout`) |
| `src/components/` | Header, Footer, Hero, cards, contact form, etc. |
| `src/pages/` | One file per route — see the sitemap in `MIDVALE_WEBSITE_BUILD_SPEC.md` |
| `src/content/` | Markdown content collections: officials, news, alerts, services, meetings |
| `src/data/site.json` | Single source of truth for village info (address, phones, hours, etc.) |
| `src/data/nav.json` | Primary nav and footer link structure |
| `functions/contact.ts` | Cloudflare Pages Function — contact form handler (Turnstile + MailChannels) |
| `functions/_middleware.ts` | Security headers applied to every response |
| `public/_headers` | Static-asset cache and security headers (Cloudflare Pages syntax) |
| `public/robots.txt`, `public/favicon.svg`, `public/brand/` | Site assets |

---

## Editing common things

### Update the next council meeting

Edit (or add) a JSON file in `src/content/meetings/`:

```json
{
  "body": "council",
  "date": "2026-08-12T19:00:00-04:00",
  "time": "7:00 PM",
  "location": "Village Hall, 3111 Barnhill Road",
  "agendaUrl": "/documents/agendas/2026-08-12-agenda.pdf",
  "minutesUrl": null,
  "note": "Regular monthly meeting."
}
```

The schedule, the homepage, and the iCal feed (`/meetings/calendar.ics`) update on the next deploy.

### Add a news post

Create `src/content/news/YYYY-MM-DD-slug.md`:

```markdown
---
title: "Title here"
date: 2026-05-08
author: "Village of Midvale"
excerpt: "One-sentence summary that appears in the cards and RSS feed."
---

Body in Markdown.
```

### Post an active alert (boil advisory, road closure, etc.)

Create `src/content/alerts/YYYY-MM-DD-slug.md`:

```markdown
---
title: "Boil water advisory — Main St"
date: 2026-05-08T14:00:00-04:00
severity: emergency      # emergency | advisory | info
status: active           # active | resolved | scheduled
summary: "Residents on Main St between 1st and 4th should boil all water until further notice."
---

Full details in Markdown.
```

The alert banner appears on every page automatically. When the alert ends,
change `status: resolved` and re-deploy.

### Update an official's information

Edit the corresponding file under `src/content/officials/`. Set
`verified: true` and `verifiedDate: 2026-05-08` once confirmed directly with
the official or the Fiscal Officer.

### Update the village's address, phone, or hours

Edit `src/data/site.json`. Every page that references this data will update on
the next build.

### Drop a real PDF agenda or minutes

1. Save the PDF to `public/documents/agendas/` or `public/documents/minutes/`.
2. Reference it from a meetings entry as `"agendaUrl": "/documents/agendas/your-file.pdf"`.

---

## Deploying

### First-time Cloudflare Pages setup

1. Push this repo to GitHub.
2. In Cloudflare → Pages → **Create project** → connect the GitHub repo.
3. Build command: `npm run build`. Build output: `dist`.
4. **Custom domain:** add `midvaleohio.org` (and `www.midvaleohio.org`).
   Cloudflare auto-provisions SSL.
5. Set the environment variables below.

### Required environment variables

Set these in **Cloudflare Pages → Settings → Environment variables** (production
and preview):

| Variable | Example | Purpose |
|---|---|---|
| `CONTACT_INBOX` | `ryan@pastircak.com` | Where contact-form submissions are emailed |
| `CONTACT_FROM` | `no-reply@midvaleohio.org` | The `From:` address used by MailChannels |
| `CONTACT_FROM_NAME` | `Village of Midvale Website` | Display name on outbound emails |
| `TURNSTILE_SECRET_KEY` | `0x4AAAAAAA…` | Server-side Turnstile secret (see below) |
| `PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAAAAA…` | Public site key (rendered in the form) |

If you skip Turnstile during initial setup, the form still works but is more
vulnerable to spam. Add it before going official.

### MailChannels SPF / domain verification

1. In your domain DNS (Cloudflare DNS), add a TXT record on the root domain:
   ```
   v=spf1 include:_spf.mx.cloudflare.net include:relay.mailchannels.net -all
   ```
2. Add a `_mailchannels` TXT record per
   [MailChannels' Pages instructions](https://support.mailchannels.com/hc/en-us/articles/16918954360845)
   (`v=mc1 cfid=YOUR_PAGES_PROJECT.pages.dev`).

### Email forwarding

Use **Cloudflare Email Routing** (free) to forward `contact@midvaleohio.org`,
`mayor@midvaleohio.org`, `clerk@midvaleohio.org`, etc. to whichever real
inbox you want them to land in. Once the village adopts Microsoft 365 or
Google Workspace, transition to direct delivery.

---

## Fonts

The site references self-hosted Source Serif 4 (600, 700) and Source Sans 3
(400, 600) at `/fonts/*.woff2`. The `font-display: swap` rules ensure the page
renders correctly with system fonts (Georgia, system-ui) until the woff2 files
are added.

To install the font files:

```bash
# Option A: download from Google Fonts and rename
#   https://fonts.google.com/specimen/Source+Serif+4
#   https://fonts.google.com/specimen/Source+Sans+3
# Save the woff2 files into ./public/fonts/ as:
#   source-serif-4-600.woff2
#   source-serif-4-700.woff2
#   source-sans-3-400.woff2
#   source-sans-3-600.woff2

# Option B (recommended): subset to Latin only with `glyphhanger` or `subfont` for ~30% smaller files.
```

Self-hosting (rather than using the Google Fonts CDN) is intentional — it
keeps the site GDPR-friendly without a cookie banner.

---

## Accessibility & performance targets

The spec (`MIDVALE_WEBSITE_BUILD_SPEC.md`) has the full list. Quick checklist
before going official:

- `axe DevTools` — zero violations
- Lighthouse — Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100, SEO ≥ 95
- Keyboard-only nav works on every page
- Real screen-reader test (VoiceOver on macOS, or NVDA on Windows) on home + a form page
- Site renders correctly on iPhone SE (375px), iPad (768px), and 1440px desktop

---

## Removing the demo banner (post-Council approval)

1. In `src/data/site.json`, set `"isOfficial": true`.
2. Update the maintainer attribution if Council adopts a different ownership model.
3. Apply for a `.gov` domain at [get.gov](https://get.gov).
4. After `.gov` issuance, add it as a custom domain in Cloudflare Pages and
   set up 301 redirects from `.org` after a 30-day overlap.

---

## License

- **Code:** MIT (see `LICENSE`).
- **Content:** CC BY 4.0.
- **Photographs of identifiable individuals:** used with permission, not redistributable separately.

---

## Open items

See `MIDVALE_WEBSITE_BUILD_SPEC.md` § 16 for the full list of items that need
verification before this site goes official. Within the codebase, those are
flagged with `<!-- TO VERIFY -->` HTML comments and the `<ToVerify>` component,
both grep-able with `rg "TO VERIFY|ToVerify"`.
