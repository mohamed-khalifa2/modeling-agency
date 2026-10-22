# Lumina — Modeling Agency Site

A premium editorial modeling-agency showcase built with **Next.js 16 (App Router, Cache Components)**, **TypeScript**, **Tailwind CSS v4**, and **Supabase**. Every piece of public content is CMS-editable through an admin dashboard — nothing is hardcoded.

## Features

**Public site**
- Full-screen hero, dynamic editorial sections (3 layouts), featured models with category filter, services list, client testimonials, contact form (zod + honeypot server action)
- `/models` roster with filters, `/models/[slug]` detail pages with gallery, stats, and email/WhatsApp booking actions
- Dedicated `/services` and `/about` pages wired to the same CMS content; placeholder copy, contact details, and roster render until real content exists (and when the admin clears it)
- Metadata from `site_settings` (title template, description, Open Graph), per-model metadata, `sitemap.xml`, `robots.txt`
- `next/image` everywhere with `sizes`, blur placeholders, shimmer skeletons, branded 404/error pages

**Admin (`/admin` = login, dashboard at `/admin/dashboard`)**
- Email + password auth (Supabase); `proxy.ts` requires a verified session **and** a row in the `admins` table; unauthenticated requests are redirected to `/admin`
- Site Settings & Hero single-row forms
- Sections / Services / Clients: table lists with add/edit/delete, visibility toggles, and drag-and-drop reordering (dnd-kit) that persists `sort_order`
- Models: searchable/filterable list, full editor with cover upload and a reorderable multi-image gallery
- Inquiries: unread badges, detail view, mark-as-read, delete
- Image uploads validate type (jpg/png/webp) and size (≤ 5 MB) before storing in the public `site-media` bucket
- All mutations revalidate paths, so public pages update immediately; feedback via sonner toasts

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 — App Router, Cache Components (`cacheComponents: true`), typed `PageProps`/`LayoutProps` |
| Styling | Tailwind CSS v4 (tokens in `app/globals.css`) |
| Database/Auth/Storage | Supabase (Postgres + RLS, Auth, Storage) |
| Validation | zod v4 |
| DnD | @dnd-kit |
| Toasts | sonner |

## Prerequisites

- Node.js 20.11+
- A [Supabase](https://supabase.com) project (free tier is fine)
- (Optional) [Supabase CLI](https://supabase.com/docs/guides/cli) to push migrations

## 1. Install

```bash
npm install
cp .env.local.example .env.local
```

## 2. Create the Supabase project

1. Create a project at [database.new](https://database.new) (choose a region close to your users).
2. In the dashboard, open **Connect** (or **Project Settings → Data API**) and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** (`sb_publishable_…`) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Set `NEXT_PUBLIC_SITE_URL` (use `http://localhost:3000` locally).

> The publishable key replaces the deprecated anon key. Never put the secret key (`sb_secret_…`) in a `NEXT_PUBLIC_*` variable.

## 3. Run the migration

The full schema, RLS policies, storage bucket, and seed content live in:

```
supabase/migrations/20261018000000_initial_schema.sql
```

**Option A — Supabase CLI**

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

**Option B — SQL editor**

1. Supabase Dashboard → **SQL Editor → New query**
2. Paste the migration file and run it.

Either way you get: all 9 tables (`site_settings`, `hero`, `sections`, `models`, `model_images`, `services`, `testimonials`, `inquiries`, `admins`), row-level security (`is_admin()` + `admins` table), the public **`site-media`** storage bucket with admin-only write policies, and seed content so the site renders immediately.

## 4. Create the first admin user

**Option A — one-time seed (provided credentials)**

Run `supabase/seed-admin.sql` in the SQL Editor **after** the migration (step 3). It creates a confirmed auth user (`mohamed.khalifa4090@gmail.com`) plus the matching `admins` row in one go. It's idempotent — re-running resets the password to the injected value. Delete the file afterwards if you don't want the password in the repository, and change the password after the first sign-in.

**Option B — manual**

1. Supabase Dashboard → **Authentication → Users → Add user** — enter an email and password, enable **Auto Confirm**, and create the user. Copy the user's UUID.
2. Insert the admin row (SQL Editor):

```sql
insert into public.admins (user_id) values ('<user-uuid>');
```

3. Visit `/admin` and sign in; you land on the dashboard at `/admin/dashboard`. Without the `admins` row, a signed-in user is redirected back to `/admin` by the proxy.

To grant someone else access later, repeat Option B: add the auth user, insert into `admins`.

## 5. Develop

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin (dashboard: `/admin/dashboard`)
- Design system check: http://localhost:3000/design-test

Other scripts: `npm run lint`, `npm run build`, `npm start`.

## 6. Deploy to Vercel

1. Push the repository to GitHub/GitLab and import it in [Vercel](https://vercel.com/new) (framework auto-detected as Next.js).
2. Run the migration against your **production** Supabase project (step 3).
3. Add the production environment variables:

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | production project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | production publishable key |
   | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` (no trailing slash) |

4. Deploy. `NEXT_PUBLIC_SITE_URL` feeds `metadataBase`, Open Graph URLs, `sitemap.xml`, and `robots.txt`, so set it to the final domain.
5. Create the first admin for production (step 4) against the production project.

## How content caching works

- Public queries are server functions marked `"use cache"` with `cacheLife("hours")` + `cacheTag(...)` (1 h revalidate / 1 d expire, shown in the build output).
- Admin mutations call `revalidatePath(...)` so changes appear on the public site immediately.
- Admin pages are request-dynamic (`export const instant = false`) so they always read fresh, session-authenticated data.
- If you need faster invalidation, add `revalidateTag("…")` next to the existing `revalidatePath` calls — the tags are already defined.

## Project structure

```
app/
  (site)/            public pages (home, models, model detail, services, about)
  admin/             page.tsx = login; (dashboard)/ section pages (dashboard, settings, …)
  layout.tsx         root layout + site-wide generateMetadata
  sitemap.ts, robots.ts, not-found.tsx, error.tsx, global-error.tsx
components/
  site/              public site components
  admin/             admin UI (managers, uploaders, primitives)
lib/
  actions/           zod-validated server actions ("use server")
  supabase/          proxy (middleware), server & browser clients
  *.ts               cached content queries
supabase/migrations/ schema + RLS + storage + seed
types/               table mirrors shared by server and client
```
