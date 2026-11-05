-- =====================================================================
-- Nuestros lugares · esquema de Supabase
--
-- Cómo usarlo: Supabase → SQL Editor → New query → pega este archivo
-- entero → Run. Se puede volver a ejecutar sin romper nada.
--
-- Después, añade los correos que pueden entrar (los de ustedes dos):
--   insert into public.members (email) values
--     ('tu@correo.com'),
--     ('ella@correo.com');
-- =====================================================================

-- ---------- Quién puede entrar ----------

create table if not exists public.members (
  email text primary key check (email = lower(email))
);

-- Sin políticas: nadie la lee desde la app, solo la función de abajo.
alter table public.members enable row level security;

create or replace function public.is_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.members
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------- Lugares ----------

create table if not exists public.places (
  id uuid primary key,
  name text not null check (length(name) between 1 and 200),
  status text not null check (status in ('visited', 'wishlist')),
  address text,
  cuisine text,
  lng double precision not null check (lng between -180 and 180),
  lat double precision not null check (lat between -90 and 90),
  visited_at date,
  notes text,
  rec_id text,
  osm_id text,
  photo_ids text[] not null default '{}',
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dishes (
  id uuid primary key,
  place_id uuid not null references public.places (id) on delete cascade,
  name text not null check (length(name) between 1 and 200),
  rating smallint not null check (rating between 1 and 5),
  notes text,
  price numeric(10, 2) check (price >= 0),
  photo_id text,
  created_at timestamptz not null default now()
);

create index if not exists dishes_place_id_idx on public.dishes (place_id);

-- Añadidas después de la primera versión: `add column if not exists` para que
-- volver a ejecutar este archivo actualice un proyecto ya creado.
alter table public.places
  add column if not exists price_level smallint check (price_level between 1 and 4);
alter table public.places
  add column if not exists quote jsonb check (quote is null or jsonb_typeof(quote) = 'object');
alter table public.places
  add column if not exists website text check (website is null or website ~* '^https?://');
alter table public.places
  add column if not exists message text check (length(message) <= 500);
alter table public.places
  add column if not exists message_from text;

alter table public.places
  add column if not exists food_category text check (food_category is null or food_category in (
    'criollo', 'marino', 'norteno', 'arequipeno', 'selvatico', 'chifa', 'nikkei', 'polleria',
    'parrilla', 'sangucheria', 'italiana', 'cafe', 'bar', 'alta-cocina', 'mercado', 'otro'
  ));

-- ⭐ Próximo destino: solo un lugar a la vez (lo garantiza el índice).
alter table public.places add column if not exists is_next boolean not null default false;
alter table public.places add column if not exists next_date date;
create unique index if not exists places_one_next_idx on public.places ((true)) where is_next;

-- Nombre para los correos ("Ana quiere ir a…"). Opcional.
alter table public.members add column if not exists name text;

alter table public.places enable row level security;
alter table public.dishes enable row level security;

-- Los dos miembros comparten todo: leen y escriben los mismos lugares.
drop policy if exists "members manage places" on public.places;
create policy "members manage places" on public.places
  for all to authenticated
  using ((select public.is_member()))
  with check ((select public.is_member()));

drop policy if exists "members manage dishes" on public.dishes;
create policy "members manage dishes" on public.dishes
  for all to authenticated
  using ((select public.is_member()))
  with check ((select public.is_member()));

-- ---------- Diario: todo lo que hacemos ----------
-- Sin clave foránea a `places`: la entrada sobrevive aunque se borre el lugar.

create table if not exists public.activity (
  id text primary key check (length(id) <= 80),
  kind text not null,
  place_id uuid,
  place_name text not null,
  detail jsonb not null default '{}' check (jsonb_typeof(detail) = 'object'),
  actor text,
  created_at timestamptz not null default now()
);

create index if not exists activity_created_at_idx on public.activity (created_at desc);

-- Tipos de entrada permitidos. Se rehace siempre, para que volver a ejecutar
-- este archivo admita los tipos nuevos en un proyecto ya creado.
alter table public.activity drop constraint if exists activity_kind_check;
alter table public.activity add constraint activity_kind_check check (kind in (
  'place_added', 'visited', 'wishlist', 'message', 'price_level',
  'dish_added', 'photos_added', 'quote_saved', 'place_removed', 'next_destination'
));

alter table public.activity enable row level security;

drop policy if exists "members manage activity" on public.activity;
create policy "members manage activity" on public.activity
  for all to authenticated
  using ((select public.is_member()))
  with check ((select public.is_member()));

-- Nombres de los miembros para el diario; solo los ve otro miembro.
create or replace function public.member_names()
returns table (email text, name text)
language sql
stable
security definer
set search_path = ''
as $$
  select m.email, m.name from public.members as m where public.is_member();
$$;

-- ---------- Precios de la carta encontrados en internet ----------
-- Los escribe solo la función `price-search` (con la clave de servicio);
-- los miembros los leen. La clave es "place:<uuid>" para un lugar guardado o
-- "rec:<id>" para uno de la guía de Lima (que no está en `places`).

create table if not exists public.menu_lookups (
  key text primary key check (key ~ '^(place:[0-9a-f-]{36}|rec:[a-z0-9-]{1,60})$'),
  place_id uuid references public.places (id) on delete cascade,
  name text not null,
  found boolean not null default false,
  confidence text not null default 'baja' check (confidence in ('alta', 'media', 'baja')),
  summary text,
  source_date text,
  items jsonb not null default '[]' check (jsonb_typeof(items) = 'array'),
  searches integer not null default 0,
  searched_at timestamptz not null default now(),
  searched_by text
);

alter table public.menu_lookups enable row level security;

drop policy if exists "members read menu lookups" on public.menu_lookups;
create policy "members read menu lookups" on public.menu_lookups
  for select to authenticated
  using ((select public.is_member()));

-- ---------- Guardar un lugar con sus platos (todo o nada) ----------
-- security invoker: se ejecuta con los permisos de quien llama, así que
-- las políticas de arriba se siguen aplicando.

create or replace function public.save_place(place jsonb, dish_rows jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  pid uuid := (place ->> 'id')::uuid;
begin
  insert into public.places as p (
    id, name, status, address, cuisine, lng, lat, visited_at, notes,
    rec_id, osm_id, photo_ids, price_level, quote, website, message, message_from,
    food_category, is_next, next_date, created_at, updated_at
  )
  select
    r.id, r.name, r.status, r.address, r.cuisine, r.lng, r.lat, r.visited_at,
    r.notes, r.rec_id, r.osm_id, coalesce(r.photo_ids, '{}'), r.price_level,
    r.quote, r.website, r.message, r.message_from, r.food_category,
    coalesce(r.is_next, false), r.next_date,
    coalesce(r.created_at, now()), coalesce(r.updated_at, now())
  from jsonb_populate_record(null::public.places, place) as r
  on conflict (id) do update set
    name = excluded.name,
    status = excluded.status,
    address = excluded.address,
    cuisine = excluded.cuisine,
    lng = excluded.lng,
    lat = excluded.lat,
    visited_at = excluded.visited_at,
    notes = excluded.notes,
    rec_id = excluded.rec_id,
    osm_id = excluded.osm_id,
    photo_ids = excluded.photo_ids,
    price_level = excluded.price_level,
    quote = excluded.quote,
    website = excluded.website,
    message = excluded.message,
    message_from = excluded.message_from,
    food_category = excluded.food_category,
    is_next = excluded.is_next,
    next_date = excluded.next_date,
    updated_at = excluded.updated_at;

  delete from public.dishes as d
  where d.place_id = pid
    and d.id not in (
      select (x ->> 'id')::uuid from jsonb_array_elements(dish_rows) as x
    );

  insert into public.dishes as d (
    id, place_id, name, rating, notes, price, photo_id, created_at
  )
  select r.id, pid, r.name, r.rating, r.notes, r.price, r.photo_id,
    coalesce(r.created_at, now())
  from jsonb_populate_recordset(null::public.dishes, dish_rows) as r
  on conflict (id) do update set
    name = excluded.name,
    rating = excluded.rating,
    notes = excluded.notes,
    price = excluded.price,
    photo_id = excluded.photo_id
  -- Un plato no puede saltar de un lugar a otro.
  where d.place_id = pid;
end;
$$;

-- ---------- Fotos (bucket privado) ----------

insert into storage.buckets (id, name, public, file_size_limit)
values ('photos', 'photos', false, 10485760)
on conflict (id) do nothing;

drop policy if exists "members read photos" on storage.objects;
create policy "members read photos" on storage.objects
  for select to authenticated
  using (bucket_id = 'photos' and (select public.is_member()));

drop policy if exists "members upload photos" on storage.objects;
create policy "members upload photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos' and (select public.is_member()));

drop policy if exists "members update photos" on storage.objects;
create policy "members update photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'photos' and (select public.is_member()));

drop policy if exists "members delete photos" on storage.objects;
create policy "members delete photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and (select public.is_member()));
