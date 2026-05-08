# Village of Midvale, Ohio — Website Build Specification

**Project:** Demo website for the Village of Midvale, Tuscarawas County, Ohio
**Target domain:** `midvaleohio.org` (transitioning to `midvaleoh.gov` post-approval)
**Status:** Unofficial community demo, pending Village Council approval
**Spec version:** 1.0
**Last updated:** May 2026

---

## 1. Project Overview

### 1.1 Goal

Build a complete, production-quality demonstration website for the Village of Midvale, Ohio (Tuscarawas County, population ~673). The site must be polished enough to present to Village Council as a working artifact, with the explicit ask that they sanction the project, support a transition to a `.gov` domain, and enter into a no-cost services MOU for ongoing maintenance.

### 1.2 Constraints and principles

- **Free or near-free to operate.** Hosting, DNS, email forwarding, and forms must run on free tiers indefinitely. The village should never receive a bill.
- **Single-maintainer friendly.** One volunteer maintains this. Content updates must be possible from a phone if needed. No build steps that require specialized environments.
- **Stale-content resistant.** Information architecture must make it obvious when something is out of date. Officials, meetings, and announcements need clear timestamps.
- **Government-appropriate.** No marketing fluff, no tracking pixels, no third-party analytics that share data, no dark patterns, no ads ever.
- **Mobile first.** Rural broadband is uneven; many residents will visit on phones. Pages must be fast on a 3G connection.
- **Accessible.** WCAG 2.1 AA minimum, AAA where reasonable. This is not optional for a government-adjacent site.
- **Demo-honest.** Until council approval, every page must clearly indicate the site is unofficial.

### 1.3 Out of scope (defer to phase 2 or later)

- Online utility bill payment (water service is transitioning to Aqua Ohio; income tax goes through RITA's existing portal)
- Resident login / account portal
- Live-streamed council meetings
- Multi-language translation (98% white population, no significant non-English-speaking community per census)
- A blog / editorial content
- E-commerce / merchandise
- Forums / comment sections
- Mobile app

---

## 2. Technology Stack

### 2.1 Decisions

| Concern | Choice | Rationale |
|---|---|---|
| Static site generator | **Astro 4.x** | Markdown-first, content collections, partial hydration, excellent Cloudflare Pages integration, fast builds, great DX |
| Styling | **Tailwind CSS 3.x** | Utility-first, no runtime, easy theming via CSS variables, excellent with Astro |
| Hosting | **Cloudflare Pages** | Free, global edge, automatic SSL, Git-based deploys, generous build minutes |
| Forms / dynamic | **Cloudflare Pages Functions** | Free, integrates with Pages, Workers runtime |
| Email delivery | **MailChannels via Pages Functions** | Free for Cloudflare Pages, no API key needed |
| Bot protection | **Cloudflare Turnstile** | Free, privacy-respecting CAPTCHA replacement |
| Document storage | **Repo `/public/documents/`** initially, **Cloudflare R2** if it grows past ~50MB | R2 free tier is 10GB, no egress fees on Cloudflare network |
| DNS | **Cloudflare DNS** | Free, integrates with Pages |
| Source control | **GitHub** (public repo) | Free, transparent, public records compatible |
| CMS (Phase 2) | **Decap CMS** | Free, writes back to Git, simple browser UI for non-technical editors |
| Search (Phase 2) | **Pagefind** | Static-site-friendly, runs at build time, no backend |

### 2.2 Why Astro specifically (vs. alternatives considered)

- **vs. 11ty:** Astro's component model and TypeScript support are better; templating is more modern.
- **vs. Hugo:** Astro's JavaScript ecosystem is more accessible to volunteers who might inherit this; Go templates have a steeper learning curve.
- **vs. Next.js / SvelteKit:** Overkill. We have no real need for server rendering or client-side routing. A static site is the right shape.
- **vs. plain HTML/CSS:** No content collections, no component reuse, hard to maintain at scale.

### 2.3 Why not WordPress

WordPress is the default for municipal sites and it is the wrong choice here. It requires database hosting (cost), regular security patching (maintenance burden for a volunteer), is a constant target for exploits (risk to the village), and the editorial UX is dated. A static site eliminates 90% of the attack surface and 95% of the maintenance burden.

---

## 3. Visual Design

### 3.1 Color palette

The palette evokes the Tuscarawas River valley landscape (deep green), small-town warmth (cream), and historic Ohio brick (muted accent red). It deliberately avoids the school colors of Indian Valley Local Schools (red/black) and the palettes of neighboring village sites (Bolivar uses teal-blue; Dennison uses primary red/blue) so Midvale has its own visual identity.

| Role | Name | Hex | Use |
|---|---|---|---|
| Primary | Tuscarawas Green | `#1F4D3A` | Headers, primary buttons, main nav background |
| Primary dark | Deep Forest | `#143025` | Hover states, active links, footer |
| Primary light | Sage | `#5C8270` | Borders, dividers, secondary UI |
| Background | Heritage Cream | `#FAF7F0` | Page background |
| Surface | Pure White | `#FFFFFF` | Cards, content panels |
| Text primary | Slate Ink | `#1A1F2E` | Body text |
| Text secondary | Slate Gray | `#4A5163` | Captions, metadata |
| Accent | Barn Red | `#9B2C2C` | Alert states, important call-to-action highlights, "live" indicators |
| Accent muted | Aged Brick | `#C2856A` | Decorative accents (use sparingly) |
| Success | Field Green | `#2F7A4D` | Confirmation messages |
| Warning | Harvest Gold | `#B8860B` | Non-critical advisories |
| Border | Soft Stone | `#D4CFC0` | Default borders |

**Contrast verification (WCAG AA requires 4.5:1 for body text, 3:1 for large text):**
- Slate Ink on Heritage Cream: 14.8:1 (AAA)
- Tuscarawas Green on Heritage Cream: 9.1:1 (AAA)
- Heritage Cream on Tuscarawas Green: 9.1:1 (AAA)
- Slate Gray on Heritage Cream: 7.4:1 (AAA)
- Barn Red on Heritage Cream: 6.8:1 (AAA)

### 3.2 Typography

| Role | Font | Weights | Source |
|---|---|---|---|
| Headers | **Source Serif 4** | 600, 700 | Google Fonts (self-host for performance) |
| Body | **Source Sans 3** | 400, 600 | Google Fonts (self-host for performance) |
| Monospace | **JetBrains Mono** | 400 | Google Fonts (only loaded if used) |

**Self-host fonts.** Do not use the Google Fonts CDN. Subset fonts to Latin only and serve from the same origin. This improves performance and keeps the site GDPR/privacy-friendly without a cookie banner.

**Type scale:**
- Display (hero): 48px / 56px line-height — Source Serif 4 700
- H1: 36px / 44px — Source Serif 4 700
- H2: 28px / 36px — Source Serif 4 600
- H3: 22px / 30px — Source Serif 4 600
- H4: 18px / 26px — Source Sans 3 600
- Body: 17px / 28px — Source Sans 3 400 (slightly larger than typical 16px because the audience skews older)
- Small: 14px / 22px — Source Sans 3 400

### 3.3 Layout

- **Max content width:** 1200px (with 1024px reading-width for prose)
- **Spacing scale:** Tailwind defaults (4px base unit)
- **Grid:** 12 columns, 24px gutters
- **Border radius:** 6px standard, 12px on cards, full on pills
- **Shadows:** Subtle and rare. Default to flat design with borders. Government sites should not look like consumer SaaS.

### 3.4 Logo placement (placeholder until provided)

The maintainer's wife is creating a village seal/logo. Until provided, use a temporary wordmark:

- **Wordmark text:** "Village of Midvale" (Source Serif 4, 700, Tuscarawas Green)
- **Subtitle:** "Tuscarawas County, Ohio · Est. 1888" (Source Sans 3, 400, Slate Gray)
- **Reserved space:** Header should accommodate a 64x64px logo (or 56x56 on mobile) to the left of the wordmark when delivered. Logo file should be SVG. Build the header layout assuming the logo will arrive — leave the slot in the markup with a placeholder div or a minimal SVG of a stylized "M".

When the real logo arrives, drop it into `/public/brand/` as `seal.svg` and update the header component reference. No layout changes should be required.

### 3.5 Imagery guidance

- **Hero photo:** Until original photography is captured, use a creative-commons-licensed photo of rural Tuscarawas County or the village hall building. Verify license before deployment. Cite source in `/credits` page.
- **Departmental photos:** Stock photography is acceptable for placeholder pages but should be replaced with locally-shot photos within 90 days of launch.
- **Photo treatment:** Slight desaturation (-10%), subtle warm tone shift. No heavy filters.
- **Aspect ratios:** 16:9 for hero, 4:3 for cards, 1:1 for portraits.

---

## 4. Information Architecture

### 4.1 Sitemap

```
/
├── /about/
│   ├── /about/history/
│   ├── /about/notable-residents/
│   └── /about/community/
├── /government/
│   ├── /government/mayor/
│   ├── /government/council/
│   ├── /government/fiscal-officer/
│   ├── /government/board-of-public-affairs/
│   └── /government/mayors-court/
├── /services/
│   ├── /services/police/
│   ├── /services/fire-ems/
│   ├── /services/streets/
│   ├── /services/parks/
│   ├── /services/water-sewer/
│   ├── /services/zoning-permits/
│   └── /services/trash-recycling/
├── /meetings/
│   ├── /meetings/schedule/
│   ├── /meetings/agendas/
│   ├── /meetings/minutes/
│   └── /meetings/ordinances/
├── /news/
│   └── /news/[slug]/  (individual posts)
├── /events/
├── /resources/
│   ├── /resources/forms/
│   ├── /resources/audit-reports/
│   ├── /resources/utility-transition/
│   └── /resources/links/
├── /contact/
├── /alerts/    (active emergency/advisory alerts)
├── /accessibility/
├── /privacy/
├── /credits/   (photo credits, OSS attribution)
└── /unofficial-disclosure/  (linked from demo banner)
```

### 4.2 Primary navigation (top nav)

Six items maximum. In order:

1. **Government**
2. **Services**
3. **Meetings**
4. **News & Events**
5. **Resources**
6. **Contact**

"About" goes in the footer along with Accessibility, Privacy, Credits.

### 4.3 Footer structure

Three columns on desktop, stacked on mobile:

- **Column 1: Village info** — Name, address, mailing address, main phone, hours.
- **Column 2: Quick links** — About, History, Council, Meetings, Pay Taxes (RITA link), Report an Issue, Contact.
- **Column 3: Stay informed** — Email signup form (Phase 2 — disabled but visible in Phase 1), Facebook link, RSS link to /news.

Bottom bar: copyright, accessibility statement link, privacy link, "unofficial demo" link (until approval).

---

## 5. Component Specifications

### 5.1 Demo banner (top of every page, until approval)

```
This is an unofficial demonstration site, not an official Village of Midvale resource.
Learn more › [link to /unofficial-disclosure/]
```

- Background: Harvest Gold (`#B8860B`) with dark text for contrast
- Position: Above the main header, full-width
- Dismissible: No (intentionally — we want this visible)
- Removable: When council approves, set `siteConfig.isOfficial = true` and the banner disappears

### 5.2 Alert banner (above demo banner when active)

For active village alerts (boil advisories, road closures, hydrant flushing). Sourced from `/content/alerts/*.md` with a `status: active` flag.

- Background: Barn Red (`#9B2C2C`) for emergencies, Harvest Gold for advisories
- Icon: AlertTriangle (Lucide icon set)
- Content: Title, one-line summary, "Read more" link
- Dismissible: Per session (localStorage; not persistent — they should see it again next visit)

### 5.3 Header

- Logo slot (64x64) + wordmark on left
- Primary nav on right (desktop) or hamburger (mobile, <768px)
- Sticky on scroll with subtle shadow when stuck
- Keyboard navigable; visible focus rings (2px Tuscarawas Green outline with 2px offset)

### 5.4 Hero (homepage only)

- Full-width photo background with dark overlay (50% black)
- Headline: "Welcome to Midvale" (Display size, white)
- Subhead: "A small village in the Tuscarawas Valley since 1888" (white, 90% opacity)
- Primary CTA: "Next Council Meeting" → /meetings/schedule/
- Secondary CTA: "Contact the Village" → /contact/
- Height: 480px desktop, 360px mobile

### 5.5 Quick action tiles (homepage, below hero)

Six tiles in a 3x2 grid (desktop) or 2x3 / stacked (mobile):

1. **Pay Income Tax** → external link to RITA `https://www.ritaohio.com/`
2. **Report an Issue** → /contact/?topic=report
3. **Council Meetings** → /meetings/schedule/
4. **Police (non-emergency)** → tel:+13303391939 with note "Emergencies: 911"
5. **Water Service (Aqua Ohio)** → external link to Aqua Ohio customer service
6. **News & Announcements** → /news/

Each tile:
- White background, 1px Soft Stone border, 6px radius
- Icon at top (Lucide icons, 32px, Tuscarawas Green)
- Title (H4, Slate Ink)
- One-line description (Small, Slate Gray)
- Hover: subtle lift (translate Y -2px, shadow appears), border becomes Tuscarawas Green
- Full tile is clickable; underlying link is the full container

### 5.6 News card

For news index and homepage "Latest" section:
- Date (small, Slate Gray, ALL CAPS letter-spacing 0.05em)
- Title (H3)
- Excerpt (2-3 lines, body text)
- "Read more →" link (Tuscarawas Green)

### 5.7 Officials card

- Photo (or initials placeholder if no photo) — circle, 96px
- Name (H4)
- Title (Small, Slate Gray)
- Term (Small, italic)
- Contact button (if email available)
- "Last verified: [date]" footer (Small, Slate Gray)

### 5.8 Document list item

For meeting minutes, ordinances, audit reports:
- Document icon (Lucide FileText)
- Title (clickable)
- Date and file size metadata
- Download icon button
- Opens PDF in new tab

### 5.9 Contact form

Single form, routes to one inbox. Fields:
- Full name (required)
- Email (required, validated)
- Phone (optional)
- Topic (select: General, Report an Issue, Records Request, Other)
- Message (required, max 2000 chars, with counter)
- Turnstile widget (invisible challenge)
- Submit button

Submission handler (Pages Function `/functions/contact.ts`):
- Validate Turnstile token
- Validate required fields server-side
- Send email via MailChannels
- Return JSON success/error
- Rate limit: 3 submissions per IP per hour

Show explicit notice above form:
> ⚠️ This form is for general inquiries. For emergencies, call **911**. For police non-emergencies, call **(330) 339-1939**. Public records requests under Ohio R.C. § 149.43 should be directed to the Fiscal Officer.

### 5.10 Skip link

First focusable element on every page. Hidden until focused.
> Skip to main content [→ #main]

---

## 6. Page-Level Specifications

### 6.1 Home (/)

Sections in order:
1. Demo banner
2. Alert banner (conditional)
3. Header
4. Hero
5. Welcome paragraph (3-4 sentences, see seed content section 9.1)
6. Quick action tiles (6)
7. "Latest News" — three most recent news cards + link to /news
8. "Upcoming Meetings" — next 2 council meetings as cards + link to /meetings/schedule
9. "About Midvale" snippet with photo + link to /about
10. Footer

### 6.2 About (/about/)

Sections:
- Hero band (no photo, just colored background)
- Welcome message from the Mayor (placeholder until council approves and provides actual message)
- "Our village" — short narrative covering location, character, demographics summary
- Quick facts panel (population, area, founded, schools, etc.)
- Links to History, Notable Residents, Community

### 6.3 About / History (/about/history/)

Long-form content. Cover:
- Platting in 1888
- Origin of the name (halfway between New Philadelphia and Uhrichsville)
- The townships the village spans (Goshen, Mill, Warwick)
- Brief mention of Midvale Speedway as a community institution
- Note that further historical research is documented by `midvaleohiohistory.com` with link

### 6.4 About / Notable Residents (/about/notable-residents/)

- **Frank Baumholtz** — MLB outfielder (Cincinnati Reds, Chicago Cubs, Philadelphia Phillies), played 1947–1957. Brief biography, link to baseball-reference.com page.

### 6.5 Government (/government/)

Hub page with cards for each role/body. Each card links to a detailed page.

### 6.6 Government / Mayor (/government/mayor/)

Currently: **Acting Mayor Donna Kohler**. Note explicitly that she ascended from Council President when Mayor Doug Cross resigned in late 2024 to take the Street Superintendent role. Term notes: serving remainder of Cross's term per Ohio R.C.

> ⚠️ Build note: Mark this entry "Pending verification" until Donna Kohler or the Fiscal Officer confirms.

### 6.7 Government / Council (/government/council/)

Six-member council. Confirmed members per public records:
- Donna Kohler (Council President; serving as Acting Mayor)
- Randall ("Randy") Cadle
- Mark R. Bassett

Three additional seats — names not publicly verifiable from research. Show as "Seat held by [pending verification]" rather than guess. The 2025 election had only three filed candidates for four open seats, so one seat is currently vacant pending Council appointment.

Include:
- Meeting cadence (verify with Fiscal Officer; placeholder: "second Wednesday of each month, 7:00 PM")
- Meeting location (Village Hall, 3111 Barnhill Road)
- How to address council (in person, by mail, by email)

### 6.8 Government / Fiscal Officer (/government/fiscal-officer/)

**Georgianne Turner** — confirmed via 2024 Auditor of State report. Describe role per Ohio R.C. (financial recordkeeping, payroll, public records contact).

### 6.9 Government / Board of Public Affairs (/government/board-of-public-affairs/)

Historically responsible for water/sewer. Note the 2024 sale to Aqua Ohio is changing this body's role; mark as "in transition" and link to /resources/utility-transition/.

### 6.10 Government / Mayor's Court (/government/mayors-court/)

- Located at 3111 Barnhill Road
- Authority under Ohio R.C. Chapter 1905
- Brief description of jurisdiction (minor traffic and ordinance violations)
- "If you received a citation" guidance: how to pay, how to appear, how to request continuance
- Link to citation payment process (verify with Police Chief)

### 6.11 Services hub (/services/)

Card grid linking to each service page. Each card has icon, title, one-line description.

### 6.12 Services / Police (/services/police/)

- **Chief Brian Anderson** (also serves as Village Administrator)
- Address: 3111 Barnhill Road, Midvale, OH 44653
- Mailing: PO Box 227, Midvale, OH 44653
- Non-emergency: (330) 339-1939
- Fax: (330) 339-8986
- **Emergencies: 911** (prominent, top of page)
- Brief description of services
- Note about one full-time officer plus auxiliary
- "Currently accepting applications for Auxiliary Police Officer" callout (verify still current before publishing)

### 6.13 Services / Fire & EMS (/services/fire-ems/)

⚠️ Content needs verification. The 2024 audit states fire protection is contracted through the Village of Dennison. There is also a Midvale-Barnhill-Brightwood Volunteer Fire Department housed at the Village Hall. EMS is contracted to Smith Ambulance Service.

Page should:
- State **"Emergencies: 911"** at top
- Explain who actually responds (clarify with Chief Anderson before publishing)
- List the contract relationships
- Provide non-emergency contacts

### 6.14 Services / Streets (/services/streets/)

- **Street Superintendent: Doug Cross** (took office November 2024 after retirement of predecessor Jay Thornton)
- Snow removal priorities (placeholder until verified)
- Brush and leaf collection schedule (placeholder)
- Pothole and street issue reporting (link to /contact/?topic=report)

### 6.15 Services / Parks (/services/parks/)

Brief page. Verify with village what parks exist and what amenities they offer.

### 6.16 Services / Water & Sewer (/services/water-sewer/)

Major content piece given the transition.

- **Heading:** "Water Service is now provided by Aqua Ohio"
- Explain the August 2024 Asset Purchase Agreement, Q1 2025 closing
- "Who to call for what" table:
  - Billing, service, repairs → Aqua Ohio customer service [number]
  - Storm sewer, drainage on village streets → Village Streets Department
  - Sewer (verify; village may still operate this or it may also be transitioned)
- Link to /resources/utility-transition/ for full details

### 6.17 Services / Zoning & Permits (/services/zoning-permits/)

- How to request a building permit
- Contact for the Building/Zoning department (verify)
- Fee schedule (request from village)
- Forms (link to /resources/forms/)

### 6.18 Services / Trash & Recycling (/services/trash-recycling/)

Verify provider with village before publishing. Show pickup schedule, holiday adjustments, what's accepted.

### 6.19 Meetings (/meetings/)

Hub with sub-pages. Top of page shows **next council meeting** prominently.

### 6.20 Meetings / Schedule (/meetings/schedule/)

- Calendar view (next 6 months)
- Regular meeting cadence
- Special meetings as posted
- iCal subscribe link (`webcal://...`) so residents can add to their phone calendars

### 6.21 Meetings / Agendas (/meetings/agendas/)

PDF list, reverse chronological. Each entry: meeting date, agenda PDF link, file size. Filter by year.

### 6.22 Meetings / Minutes (/meetings/minutes/)

Same structure as agendas. Backfill at least 12 months of minutes if available.

### 6.23 Meetings / Ordinances (/meetings/ordinances/)

Codified ordinances list. Each entry: ordinance number, date passed, subject, PDF. Note that comprehensive Ohio municipal codes are typically hosted at American Legal Publishing or Walter H. Drane — link out if Midvale uses one.

### 6.24 News (/news/)

Reverse chronological list of announcements. Pagination at 20 per page.

### 6.25 News / [slug] (/news/[slug]/)

Individual post. Date, title, body, related posts, share links.

### 6.26 Events (/events/)

Community events. Even if village doesn't host many, link to:
- Indian Valley school events
- Midvale Speedway race schedule
- Tuscarawas County events
- Local church events

### 6.27 Resources / Forms (/resources/forms/)

PDF library. Income tax forms link to RITA (don't host duplicates). Other forms hosted directly.

### 6.28 Resources / Audit Reports (/resources/audit-reports/)

Link directly to ohioauditor.gov rather than rehost. Show last 5 audit cycles with status (Released, Pending, etc.) and direct PDF links.

### 6.29 Resources / Utility Transition (/resources/utility-transition/)

Detailed FAQ about the Aqua Ohio acquisition. Address resident concerns:
- Will my bill change?
- Will my service change?
- Who do I call for water emergencies now?
- What's the timeline?
- Where do I send my final village water payment?

This page may have an expiration — once the transition is complete and stable, it can be archived to /news/ and removed from primary nav.

### 6.30 Resources / Links (/resources/links/)

External resource directory:
- Tuscarawas County government
- Tuscarawas County Board of Elections
- Ohio Auditor of State
- RITA (income tax)
- Indian Valley Local Schools
- Aqua Ohio
- Tuscarawas County CVB / Visitors Bureau
- Tuscarawas County Sheriff
- Ohio EPA (drinking water reports)
- Ohio Revised Code

### 6.31 Contact (/contact/)

- Village Hall address with embedded map (use OpenStreetMap, not Google — privacy)
- Office hours (verify)
- Phone numbers for each department
- Mailing address
- Contact form (per spec 5.9)
- Public records request guidance per Ohio R.C. § 149.43

### 6.32 Alerts (/alerts/)

Currently active alerts only. If empty, show: "There are no active alerts at this time. ✓"

### 6.33 Accessibility (/accessibility/)

WCAG 2.1 AA conformance statement, contact info for accessibility issues, alternate format request process.

### 6.34 Privacy (/privacy/)

What we collect (essentially nothing — no analytics, no cookies, contact form data only), how it's used, retention.

### 6.35 Credits (/credits/)

Photo attribution, OSS license attribution (Astro, Tailwind, fonts, icons).

### 6.36 Unofficial Disclosure (/unofficial-disclosure/)

Explanation of the demo status. Who built it, why, what the path to officiality looks like. Linked from the persistent demo banner.

---

## 7. Content Structure (File Layout)

```
/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   ├── sitemap.xml (auto-generated)
│   ├── brand/
│   │   ├── seal.svg (placeholder until provided)
│   │   └── wordmark.svg
│   ├── photos/
│   │   ├── hero/
│   │   ├── officials/
│   │   └── general/
│   ├── documents/
│   │   ├── minutes/
│   │   ├── agendas/
│   │   ├── ordinances/
│   │   └── forms/
│   └── fonts/
│       ├── source-serif-4-700.woff2
│       ├── source-sans-3-400.woff2
│       └── source-sans-3-600.woff2
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── DemoBanner.astro
│   │   ├── AlertBanner.astro
│   │   ├── Hero.astro
│   │   ├── QuickActionTile.astro
│   │   ├── NewsCard.astro
│   │   ├── OfficialCard.astro
│   │   ├── DocumentList.astro
│   │   ├── ContactForm.astro
│   │   ├── SkipLink.astro
│   │   └── Map.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── PageLayout.astro
│   │   └── ProseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about/
│   │   ├── government/
│   │   ├── services/
│   │   ├── meetings/
│   │   ├── news/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── events/
│   │   ├── resources/
│   │   ├── contact.astro
│   │   ├── alerts.astro
│   │   ├── accessibility.astro
│   │   ├── privacy.astro
│   │   ├── credits.astro
│   │   └── unofficial-disclosure.astro
│   ├── content/
│   │   ├── config.ts (Astro content collections schema)
│   │   ├── officials/
│   │   │   ├── donna-kohler.md
│   │   │   ├── randy-cadle.md
│   │   │   ├── mark-bassett.md
│   │   │   ├── georgianne-turner.md
│   │   │   ├── brian-anderson.md
│   │   │   └── doug-cross.md
│   │   ├── news/
│   │   │   └── 2026-05-08-welcome.md (sample)
│   │   ├── alerts/
│   │   │   └── (empty by default)
│   │   ├── meetings/
│   │   │   └── (calendar entries)
│   │   └── services/
│   │       ├── police.md
│   │       ├── fire-ems.md
│   │       └── ...
│   ├── data/
│   │   ├── site.json (village contact info, hours, etc.)
│   │   └── nav.json (navigation structure)
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       ├── date.ts
│       └── format.ts
├── functions/
│   ├── contact.ts (contact form handler)
│   └── _middleware.ts (security headers)
└── .github/
    └── workflows/
        └── deploy.yml (Cloudflare Pages auto-deploys, but lint/test workflow useful)
```

---

## 8. Configuration Files

### 8.1 `src/data/site.json`

```json
{
  "name": "Village of Midvale",
  "shortName": "Midvale",
  "county": "Tuscarawas County",
  "state": "Ohio",
  "founded": 1888,
  "population": 673,
  "populationYear": 2020,
  "areaSquareMiles": 0.74,
  "elevationFeet": 873,
  "townships": ["Goshen", "Mill", "Warwick"],
  "isOfficial": false,
  "address": {
    "street": "3111 Barnhill Road",
    "city": "Midvale",
    "state": "OH",
    "zip": "44653"
  },
  "mailing": {
    "po": "PO Box 227",
    "city": "Midvale",
    "state": "OH",
    "zip": "44653"
  },
  "coordinates": {
    "lat": 40.4358,
    "lng": -81.3701
  },
  "phones": {
    "main": "(330) 339-1939",
    "policeFax": "(330) 339-8986",
    "emergency": "911"
  },
  "hours": {
    "general": "Hours pending verification with Fiscal Officer",
    "policeNonEmergency": "Hours pending verification"
  },
  "social": {
    "facebook": "https://www.facebook.com/profile.php?id=107749202588577"
  },
  "schoolDistrict": {
    "name": "Indian Valley Local School District",
    "url": "https://www.ivschools.org/"
  },
  "contactEmail": "PLACEHOLDER_TO_BE_PROVIDED",
  "incomeTaxRate": 0.015,
  "incomeTaxAdministrator": {
    "name": "RITA — Regional Income Tax Authority",
    "url": "https://www.ritaohio.com/"
  }
}
```

### 8.2 `tailwind.config.mjs` (color tokens)

```js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F4D3A',
          dark: '#143025',
          light: '#5C8270',
        },
        cream: '#FAF7F0',
        ink: '#1A1F2E',
        slate: {
          DEFAULT: '#4A5163',
        },
        accent: {
          DEFAULT: '#9B2C2C',
          muted: '#C2856A',
        },
        success: '#2F7A4D',
        warning: '#B8860B',
        border: '#D4CFC0',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '1024px',
        content: '1200px',
      },
    },
  },
}
```

### 8.3 `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://midvaleohio.org',
  integrations: [tailwind(), sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});
```

### 8.4 `functions/_middleware.ts` (security headers)

```ts
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  const headers = new Headers(response.headers);

  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://tile.openstreetmap.org; font-src 'self'; connect-src 'self'; frame-src https://challenges.cloudflare.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
```

### 8.5 `public/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://midvaleohio.org/sitemap-index.xml
```

---

## 9. Seed Content

### 9.1 Homepage welcome paragraph

> Midvale is a small village in the Tuscarawas River valley of eastern Ohio, halfway between New Philadelphia and Uhrichsville. Platted in 1888, we're home to about 700 residents who care deeply about our community, our schools, and our neighbors. This site is your starting point for everything happening in the village — meetings, services, news, and the people who keep things running.

### 9.2 About / History (draft)

> The Village of Midvale was platted in 1888 and incorporated soon after, taking its name from its location at the midpoint between New Philadelphia (the county seat) and Uhrichsville. The village sits in the Tuscarawas River valley and crosses portions of three townships: Goshen, Mill, and Warwick.
>
> Today, Midvale covers about three-quarters of a square mile and is home to roughly 700 residents. The village operates its own police department, contracts with the Village of Dennison for fire protection and Smith Ambulance Service for emergency medical services, and is currently transitioning its water utility to Aqua Ohio under a 2024 asset purchase agreement.
>
> Children in the village attend schools in the Indian Valley Local School District. Midvale Elementary School (kindergarten through fifth grade) is located within the village and serves about 400 students. Indian Valley Middle School is in the nearby village of Tuscarawas, and Indian Valley High School is in Gnadenhutten.
>
> For deeper village history — photographs, oral histories, and stories about the people and places that shaped Midvale — visit the community-run Midvale Ohio History project at [midvaleohiohistory.com](https://midvaleohiohistory.com).

### 9.3 Notable Residents

> **Frank Baumholtz (1918–1997)** was a Major League Baseball outfielder born in Midvale. He played eleven seasons in the majors between 1947 and 1957 for the Cincinnati Reds, Chicago Cubs, and Philadelphia Phillies, finishing with a career batting average of .290. Baumholtz was also a two-sport college athlete at Ohio University and briefly played professional basketball before settling on baseball as his career.

### 9.4 Sample news post (`/content/news/2026-05-08-welcome.md`)

```markdown
---
title: "Welcome to the new Village of Midvale website"
date: 2026-05-08
author: "Village of Midvale"
excerpt: "A modern home for village news, meetings, and services."
---

We're pleased to introduce the new official website for the Village of Midvale.

This site is designed to make it easier to find information about your village
government — when council meets, who represents you, how to reach the police
non-emergency line, where to pay your income tax, and what's happening in the
community.

We'll be adding meeting minutes, ordinances, and other public records over the
coming weeks. If something you're looking for isn't here yet, please reach out
through our [contact page](/contact/) and we'll get it added.

Thank you to everyone who helped make this resource possible.
```

> Note: This post is a placeholder. Replace with the actual launch announcement when the site goes official.

### 9.5 Officials seed data

For each official in `/src/content/officials/`:

```markdown
---
name: "Donna Kohler"
title: "Acting Mayor"
role: "mayor"
order: 1
verified: false
verifiedDate: null
notes: "Acting Mayor following the resignation of Mayor Doug Cross in late 2024. Previously served as Council President. Term details pending verification with Fiscal Officer."
photo: null
contactEmail: null
---

Donna Kohler is serving as Acting Mayor of the Village of Midvale, having
ascended from her role as Council President when Mayor Doug Cross resigned
in late 2024 to accept the position of Street Superintendent.

[Pending: more biographical detail to be provided by Mrs. Kohler]
```

Repeat for each confirmed council member, the Fiscal Officer, the Police Chief, and the Street Superintendent. Mark all as `verified: false` until directly confirmed.

---

## 10. Accessibility Requirements

### 10.1 Standards

- **Target:** WCAG 2.1 Level AA, with AAA where reasonable (especially color contrast).
- **Section 508:** Conformant by default if WCAG AA is met.
- **ADA:** No formal federal standard for state/local government websites, but WCAG 2.1 AA is the de facto expectation and was reaffirmed by DOJ guidance in 2024.

### 10.2 Specific requirements

- All images have meaningful `alt` text. Decorative images use `alt=""`.
- All interactive elements are keyboard accessible. Tab order is logical.
- Visible focus indicators on all focusable elements (2px Tuscarawas Green outline, 2px offset).
- Skip link as first focusable element.
- Heading hierarchy is correct (one `h1` per page, no skipped levels).
- Form fields have associated `label` elements; errors are announced to screen readers.
- Color is never the sole means of conveying information.
- Links have descriptive text (no "click here").
- Tables use proper `th` and `scope` attributes.
- Page language declared in `<html lang="en">`.
- ARIA used minimally and correctly (prefer semantic HTML).

### 10.3 Testing

Before launch, run:
- **axe DevTools** — should have zero violations
- **Lighthouse Accessibility** — should score 95+
- **Keyboard-only navigation** — manually test every interactive element
- **Screen reader smoke test** — at minimum, run VoiceOver on the homepage and one form page

---

## 11. Performance Targets

### 11.1 Core Web Vitals

- **LCP (Largest Contentful Paint):** < 2.0s on 4G
- **CLS (Cumulative Layout Shift):** < 0.05
- **INP (Interaction to Next Paint):** < 200ms

### 11.2 Specific budgets

- Homepage HTML: < 30KB gzipped
- Total page weight (excluding hero image): < 200KB
- Hero image: < 150KB (modern WebP/AVIF, lazy-loaded below the fold)
- Fonts: Two weights of each family, subsetted to Latin, woff2 only
- JavaScript: < 20KB total (Astro should ship near-zero JS by default)

### 11.3 Optimization techniques

- Self-hosted fonts with `font-display: swap`
- Image processing via Astro's built-in image component (responsive `srcset`, modern formats)
- Critical CSS inlined automatically by Astro
- Preload key assets in `<head>`
- HTTP/2 push handled by Cloudflare automatically

---

## 12. Deployment

### 12.1 Cloudflare Pages setup

1. Create new Pages project, connect GitHub repo
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Environment variables (none required for static build)
5. Functions deploy automatically from `/functions/` directory

### 12.2 Domain configuration

Phase 1 (demo):
1. Register `midvaleohio.org` (recommend Cloudflare Registrar — at-cost, no markup)
2. Add domain to Cloudflare account (it's automatic if registered there)
3. In Pages project, add `midvaleohio.org` as custom domain
4. Cloudflare auto-provisions SSL via Let's Encrypt

Phase 2 (post-approval):
1. Council passes resolution authorizing application for `.gov` domain
2. Apply at [get.gov](https://get.gov) — typical approval time 30-60 days
3. Once approved, add `midvaleoh.gov` as additional custom domain
4. Set up 301 redirects from `.org` to `.gov` after a 30-day overlap period
5. Update all printed materials, business cards, social media, Google Business Profile

### 12.3 Email forwarding

Use Cloudflare Email Routing (free) to forward `contact@midvaleohio.org` to the maintainer's personal email until village provides an official inbox. Once village has Microsoft 365 or Google Workspace, transition to direct delivery.

### 12.4 Monitoring

- **Uptime:** Cloudflare's built-in monitoring for Pages projects
- **Form submissions:** Logged via Cloudflare Pages Functions analytics
- **404 tracking:** Cloudflare Web Analytics (privacy-respecting, no cookies)
- **Build failures:** GitHub Actions notification to maintainer email

---

## 13. Content Maintenance Workflow

### 13.1 Phase 1 (pre-CMS)

All content updates via Git pull request:
1. Maintainer receives request from village via email
2. Updates relevant Markdown file in repo
3. Commits and pushes
4. Cloudflare Pages auto-deploys within 90 seconds
5. Confirms deployment to village contact

Target turnaround: 24 business hours for routine updates, 2 hours for emergency alerts.

### 13.2 Phase 2 (with Decap CMS)

1. Add Decap CMS configuration to repo
2. Set up Cloudflare Access for `/admin/` route, restricted to designated village email addresses
3. Train Fiscal Officer on basic operations: adding news posts, uploading meeting minutes, toggling alerts
4. Maintainer remains available for structural changes

### 13.3 Emergency alert workflow

For boil advisories, road closures, or other urgent communications:
1. Authorized village contact emails maintainer with alert text
2. Maintainer creates `/src/content/alerts/[date]-[slug].md` with `status: active`
3. Pushes to repo; Cloudflare deploys within 90 seconds
4. Banner appears on every page automatically
5. When alert ends, maintainer changes `status: resolved` and pushes

For Phase 2, give the Police Chief and Fiscal Officer direct access via Decap CMS to manage alerts independently.

---

## 14. Phase 2 Roadmap (post-approval)

In suggested priority order:

1. **`.gov` domain transition** — see section 12.2
2. **Official disclosure removal** — flip `siteConfig.isOfficial` to `true`, remove demo banner
3. **Real photography** — replace stock with locally-shot images
4. **Decap CMS integration** — empower village staff to update content directly
5. **Pagefind site search** — full-text search across all content and PDFs
6. **iCal calendar feed** — for council meetings, residents subscribe in their phone calendars
7. **Email subscription** — opt-in alerts and newsletter via Buttondown or similar (free tier)
8. **OCR'd historical minutes** — backfill years of meeting minutes as searchable text
9. **Codified ordinances** — proper ordinance database with cross-references
10. **Spanish translation** — only if/when resident demand emerges; not a current need

---

## 15. Build Order (Suggested)

For an agentic coding session executing this spec, suggested order:

1. Initialize Astro project with Tailwind
2. Set up base layout, header, footer, demo banner
3. Configure content collections (`src/content/config.ts`)
4. Build component library (cards, tiles, forms)
5. Build homepage with seed content
6. Build About / History
7. Build Government section + officials seed data
8. Build Services section + service pages
9. Build Meetings hub + sample documents
10. Build News index + sample post
11. Build Resources section
12. Build Contact page + form handler function
13. Build static pages (Accessibility, Privacy, Credits, Unofficial Disclosure)
14. Add security headers middleware
15. Configure sitemap and robots.txt
16. Add 404 and 500 error pages
17. Run accessibility audit (axe, Lighthouse)
18. Run performance audit
19. Test all forms end-to-end
20. Document deployment process in README

---

## 16. Open Items Requiring Verification with Village

Mark these in the codebase with a `<!-- TO VERIFY -->` HTML comment or a `// TODO: verify` code comment so they're easy to find later:

- [ ] Full council roster (3 of 6 confirmed; 3 unknown; 1 vacant pending appointment)
- [ ] Council meeting cadence and time
- [ ] Village Hall office hours
- [ ] Fire/EMS exact arrangement (Dennison contract vs M-B-B volunteer department)
- [ ] Trash and recycling provider and schedule
- [ ] Sewer service operator (village or Aqua Ohio)
- [ ] Aqua Ohio customer service number for water transition page
- [ ] Building/Zoning permit process and contact
- [ ] Park inventory and amenities
- [ ] Whether the Auxiliary Police Officer position is still open
- [ ] Mayor's Court session schedule and citation payment process
- [ ] Whether the village uses American Legal Publishing or Drane for codified ordinances
- [ ] Official email address for the contact form to forward to
- [ ] Photos of officials (with their permission)
- [ ] Mayor's welcome message
- [ ] Sewer rates and water rate transition details

---

## 17. Legal and Compliance Notes

### 17.1 Demo period

While the site is unofficial:
- Persistent demo banner is mandatory
- All claims about village operations must be sourced from public records (audit reports, BOE filings, news media) and footnoted internally
- No claims attributed to officials without their explicit consent
- Footer must include "Built and maintained by [maintainer name] as a community contribution. Not affiliated with the Village of Midvale government."

### 17.2 Post-approval

- Adopt the village's records retention policy on the site (Ohio R.C. § 149.43)
- Ensure all public records linked from the site are accessible per ORC requirements
- ADA accessibility statement updated with formal contact for accommodation requests
- Privacy policy updated to reflect any analytics or data collection

### 17.3 MOU between maintainer and village

Separate document. Key terms recommended:
- Term: 1 year, auto-renew unless either party gives 60 days notice
- Scope: hosting, security updates, content updates within defined turnaround
- Compensation: $1 nominal consideration (or framed as services in-kind)
- Liability: maintainer carries personal/professional liability insurance; village holds harmless for content provided by village
- Termination: at any time by either party with 60 days notice; all code, content, and credentials transfer to village
- Public records: site content is public record under Ohio R.C. § 149.43; maintainer cooperates with records requests
- Ownership: village owns the domain; maintainer owns the source code under permissive license, with perpetual license to village

---

## 18. Success Criteria

The demo is ready to present to council when:

- [ ] All 36 pages from the sitemap render without errors
- [ ] Lighthouse scores: Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100, SEO ≥ 95
- [ ] axe DevTools reports zero accessibility violations
- [ ] Site loads under 2 seconds on a throttled 4G connection
- [ ] Contact form successfully delivers an email end-to-end
- [ ] Demo banner is visible on every page
- [ ] Site renders correctly on iPhone SE (375px), iPad (768px), and 1440px desktop
- [ ] Keyboard-only navigation works on every page
- [ ] All TO VERIFY items are flagged in a single tracked document
- [ ] README clearly documents how to run locally, deploy, and update content
- [ ] LICENSE file present (recommend MIT for code, CC-BY-4.0 for content)
- [ ] Repository is publicly visible on GitHub with a clear README

---

## End of Specification
