-- =============================================================================
-- Modeling agency site — initial schema
--
-- Tables: site_settings, hero, sections, models, model_images, services,
--         testimonials, inquiries, admins
-- Security: RLS on everything; public read of visible content, public INSERT
--           on inquiries, admin-only CRUD via is_admin() + admins table
-- Storage: public "site-media" bucket, public read / admin-only write
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Admins + is_admin()
-- -----------------------------------------------------------------------------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.admins
    where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create policy "Admins can manage admins"
on public.admins
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- site_settings (single row)
-- -----------------------------------------------------------------------------

create table public.site_settings (
  id boolean primary key default true check (id),
  agency_name text not null default '',
  tagline text not null default '',
  logo_url text,
  email text,
  phone text,
  whatsapp text,
  address text,
  instagram text,
  facebook text,
  tiktok text,
  footer_text text,
  seo_title text,
  seo_description text
);

alter table public.site_settings enable row level security;

create policy "Anyone can read site settings"
on public.site_settings
for select
to public
using (true);

create policy "Admins can manage site settings"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- hero (single row)
-- -----------------------------------------------------------------------------

create table public.hero (
  id boolean primary key default true check (id),
  headline text not null default '',
  subheadline text,
  background_image_url text,
  cta_label text,
  cta_link text,
  secondary_cta_label text,
  secondary_cta_link text
);

alter table public.hero enable row level security;

create policy "Anyone can read hero"
on public.hero
for select
to public
using (true);

create policy "Admins can manage hero"
on public.hero
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- sections
-- -----------------------------------------------------------------------------

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null default '',
  subtitle text,
  description text,
  image_url text,
  layout text not null default 'image-left'
    check (layout in ('image-left', 'image-right', 'full-bleed')),
  sort_order integer not null default 0,
  is_visible boolean not null default true
);

alter table public.sections enable row level security;

create policy "Anyone can read visible sections"
on public.sections
for select
to public
using (is_visible = true);

create policy "Admins can manage sections"
on public.sections
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- models
-- -----------------------------------------------------------------------------

create table public.models (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null
    check (category in ('women', 'men', 'new-faces', 'kids')),
  cover_image_url text,
  bio text,
  height text,
  bust text,
  waist text,
  hips text,
  shoes text,
  hair text,
  eyes text,
  sort_order integer not null default 0,
  is_visible boolean not null default true
);

alter table public.models enable row level security;

create policy "Anyone can read visible models"
on public.models
for select
to public
using (is_visible = true);

create policy "Admins can manage models"
on public.models
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- model_images
-- -----------------------------------------------------------------------------

create table public.model_images (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models (id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0
);

create index model_images_model_id_idx on public.model_images (model_id);

alter table public.model_images enable row level security;

create policy "Anyone can read images of visible models"
on public.model_images
for select
to public
using (
  exists (
    select 1
    from public.models m
    where m.id = model_id
      and m.is_visible = true
  )
);

create policy "Admins can manage model images"
on public.model_images
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- services
-- -----------------------------------------------------------------------------

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  sort_order integer not null default 0,
  is_visible boolean not null default true
);

alter table public.services enable row level security;

create policy "Anyone can read visible services"
on public.services
for select
to public
using (is_visible = true);

create policy "Admins can manage services"
on public.services
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- testimonials (also used as a client logo strip via logo_url)
-- -----------------------------------------------------------------------------

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  quote text,
  sort_order integer not null default 0,
  is_visible boolean not null default true
);

alter table public.testimonials enable row level security;

create policy "Anyone can read visible testimonials"
on public.testimonials
for select
to public
using (is_visible = true);

create policy "Admins can manage testimonials"
on public.testimonials
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- inquiries
-- -----------------------------------------------------------------------------

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

alter table public.inquiries enable row level security;

create policy "Anyone can submit an inquiry"
on public.inquiries
for insert
to anon, authenticated
with check (true);

create policy "Admins can manage inquiries"
on public.inquiries
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Storage: public "site-media" bucket
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

create policy "Anyone can read site media"
on storage.objects
for select
to public
using (bucket_id = 'site-media');

create policy "Admins can upload site media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-media' and public.is_admin());

create policy "Admins can update site media"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());

create policy "Admins can delete site media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-media' and public.is_admin());

-- -----------------------------------------------------------------------------
-- Seed data
-- -----------------------------------------------------------------------------

insert into public.site_settings (
  agency_name, tagline, logo_url, email, phone, whatsapp, address,
  instagram, facebook, tiktok, footer_text, seo_title, seo_description
) values (
  'Lumina Model Management',
  'Representing distinctive talent across fashion, commercial, and editorial.',
  'https://placehold.co/240x80/1a1a1a/ffffff?text=LUMINA',
  'hello@luminamodels.com',
  '+1 (212) 555-0148',
  '+1 (212) 555-0148',
  '214 Mercer Street, Suite 4, New York, NY 10012',
  'https://instagram.com/luminamodels',
  'https://facebook.com/luminamodels',
  'https://tiktok.com/@luminamodels',
  '© 2026 Lumina Model Management. All rights reserved.',
  'Lumina Model Management — New York Talent Agency',
  'Lumina represents distinctive models for fashion, editorial, and commercial work worldwide.'
);

insert into public.hero (
  headline, subheadline, background_image_url,
  cta_label, cta_link, secondary_cta_label, secondary_cta_link
) values (
  'Faces That Define the Season',
  'A boutique New York agency representing women, men, new faces, and kids for runway, editorial, and commercial campaigns.',
  'https://placehold.co/1920x1080/d9d4cc/1a1a1a?text=Hero',
  'View the Board',
  '/models',
  'Get in Touch',
  '/contact'
);

insert into public.sections (key, title, subtitle, description, image_url, layout, sort_order, is_visible) values
  (
    'about',
    'An Agency Built on Individuality',
    'Who we are',
    'Lumina Model Management was founded on a simple belief: every career should be as unique as the face behind it. We pair rigorous development with personal representation, guiding talent from first test shoots to international campaigns.',
    'https://placehold.co/900x1100/e8e4dd/1a1a1a?text=About',
    'image-left',
    1,
    true
  ),
  (
    'philosophy',
    'Craft, Care, and Longevity',
    'How we work',
    'From portfolio strategy to on-set management, our team stays close to every opportunity. We negotiate with care, protect our talent''s time, and build careers that last beyond a single season.',
    'https://placehold.co/900x1100/dcd8d0/1a1a1a?text=Philosophy',
    'image-right',
    2,
    true
  ),
  (
    'representation',
    'A Board as Diverse as the Industry We Serve',
    'Our board',
    'Editorial and commercial, established names and brand-new faces — our board spans every category and is scouted with intention. Browse the board or apply to join it.',
    'https://placehold.co/1920x900/cfc9bf/1a1a1a?text=Board',
    'full-bleed',
    3,
    true
  ),
  (
    'join',
    'Begin Your Journey With Us',
    'Applications',
    'We review every application personally. Send your measurements and a few natural photos — no professional portfolio required — and our scouts will be in touch if there is a fit.',
    'https://placehold.co/900x1100/d4cfc6/1a1a1a?text=Apply',
    'image-right',
    4,
    true
  );

insert into public.models (name, slug, category, cover_image_url, bio, height, bust, waist, hips, shoes, hair, eyes, sort_order, is_visible) values
  (
    'Amara Osei',
    'amara-osei',
    'women',
    'https://placehold.co/800x1000/c9b8a8/1a1a1a?text=Amara',
    'Accra-born, New York–based editorial talent. Recent work includes beauty campaigns and a Milan Fashion Week debut.',
    '5''11" / 180 cm', '32"', '24"', '35"', '9 US / 40 EU', 'Dark Brown', 'Hazel',
    1, true
  ),
  (
    'Elodie Marchand',
    'elodie-marchand',
    'women',
    'https://placehold.co/800x1000/b8c4c9/1a1a1a?text=Elodie',
    'Paris-raised with a background in contemporary dance. Specializing in editorial and luxury ready-to-wear.',
    '5''10" / 178 cm', '33"', '24"', '35"', '8.5 US / 39 EU', 'Blonde', 'Blue',
    2, true
  ),
  (
    'Julian Reyes',
    'julian-reyes',
    'men',
    'https://placehold.co/800x1000/a8b8c9/1a1a1a?text=Julian',
    'Commercial and runway talent with a decade of experience across North American and European markets.',
    '6''1" / 185 cm', '38"', '32"', '—', '11 US / 44 EU', 'Black', 'Brown',
    3, true
  ),
  (
    'Sora Tanaka',
    'sora-tanaka',
    'new-faces',
    'https://placehold.co/800x1000/c9c4a8/1a1a1a?text=Sora',
    'Discovered in Brooklyn. Fresh, versatile look suited to beauty, e-commerce, and emerging designer showcases.',
    '5''9" / 175 cm', '32"', '24"', '34"', '8 US / 38 EU', 'Black', 'Brown',
    4, true
  ),
  (
    'Mila Petrova',
    'mila-petrova',
    'new-faces',
    'https://placehold.co/800x1000/c9a8b8/1a1a1a?text=Mila',
    'First-generation collegiate scout with an editorial-ready profile and a background in figure skating.',
    '5''10" / 178 cm', '31"', '23"', '34"', '8.5 US / 39 EU', 'Light Brown', 'Green',
    5, true
  ),
  (
    'Noah Whitfield',
    'noah-whitfield',
    'kids',
    'https://placehold.co/800x1000/a8c9b4/1a1a1a?text=Noah',
    'Kidswear and commercial talent, ages 8–12. Experienced in catalog, lifestyle, and national television spots.',
    null, null, null, null, 'Youth 3', 'Brown', 'Blue',
    6, true
  );

insert into public.model_images (model_id, image_url, sort_order)
select m.id, u.image_url, u.sort_order
from (values
  ('amara-osei', 'https://placehold.co/900x1200/c9b8a8/1a1a1a?text=Amara+1', 1),
  ('amara-osei', 'https://placehold.co/900x1200/c2b09f/1a1a1a?text=Amara+2', 2),
  ('amara-osei', 'https://placehold.co/900x1200/bba898/1a1a1a?text=Amara+3', 3),
  ('elodie-marchand', 'https://placehold.co/900x1200/b8c4c9/1a1a1a?text=Elodie+1', 1),
  ('elodie-marchand', 'https://placehold.co/900x1200/b0bcc1/1a1a1a?text=Elodie+2', 2),
  ('julian-reyes', 'https://placehold.co/900x1200/a8b8c9/1a1a1a?text=Julian+1', 1),
  ('julian-reyes', 'https://placehold.co/900x1200/a0b0c1/1a1a1a?text=Julian+2', 2),
  ('sora-tanaka', 'https://placehold.co/900x1200/c9c4a8/1a1a1a?text=Sora+1', 1),
  ('sora-tanaka', 'https://placehold.co/900x1200/c1bc9f/1a1a1a?text=Sora+2', 2),
  ('mila-petrova', 'https://placehold.co/900x1200/c9a8b8/1a1a1a?text=Mila+1', 1),
  ('mila-petrova', 'https://placehold.co/900x1200/c1a0b0/1a1a1a?text=Mila+2', 2),
  ('noah-whitfield', 'https://placehold.co/900x1200/a8c9b4/1a1a1a?text=Noah+1', 1)
) as u(slug, image_url, sort_order)
join public.models m on m.slug = u.slug;

insert into public.services (title, description, icon, sort_order, is_visible) values
  (
    'Editorial & Campaign Representation',
    'Full-service placement with magazines, fashion houses, and global brands — from lookbooks to season-long campaigns.',
    'camera',
    1,
    true
  ),
  (
    'Runway & Show Production',
    'Casting support, show packages, and backstage management for New York, Paris, Milan, and London fashion weeks.',
    'runway',
    2,
    true
  ),
  (
    'Events & Appearances',
    'Brand activations, product launches, and hosted appearances matched to your audience and aesthetic.',
    'calendar',
    3,
    true
  ),
  (
    'Brand Partnerships & Ambassadorships',
    'Long-term ambassador programs and social partnerships negotiated and managed end to end by our team.',
    'handshake',
    4,
    true
  );

insert into public.testimonials (name, logo_url, quote, sort_order, is_visible) values
  (
    'Maison Delacroix',
    null,
    'Lumina understands editorial like few agencies do. Every face they send arrives prepared, punctual, and camera-ready.',
    1,
    true
  ),
  (
    'Vogue Editorial',
    'https://placehold.co/200x80/e8e4dd/1a1a1a?text=Vogue',
    null,
    2,
    true
  ),
  (
    'North & Co. Campaigns',
    null,
    'We booked three of Lumina''s new faces for our spring campaign and every one of them exceeded expectations on set.',
    3,
    true
  ),
  (
    'Bella Magazine',
    'https://placehold.co/200x80/dcd8d0/1a1a1a?text=Bella',
    null,
    4,
    true
  );
