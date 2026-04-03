create table if not exists places (
  id text primary key,
  city_slug text not null,
  name text not null,
  place_type text not null,
  coverage_type text not null,
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  latitude double precision not null,
  longitude double precision not null,
  geom geography(point, 4326) generated always as (
    st_setsrid(st_makepoint(longitude, latitude), 4326)::geography
  ) stored
);

create table if not exists place_briefs (
  place_id text primary key references places(id) on delete cascade,
  hook text not null,
  summary text not null,
  why_it_matters text not null,
  facts jsonb not null default '[]'::jsonb
);

create table if not exists place_lenses (
  id bigserial primary key,
  place_id text not null references places(id) on delete cascade,
  lens_type text not null,
  body text not null
);

create table if not exists sources (
  id bigserial primary key,
  place_id text not null references places(id) on delete cascade,
  label_type text not null check (label_type in ('official', 'archival', 'secondary')),
  title text not null,
  url text not null
);

create index if not exists idx_places_city on places(city_slug);
create index if not exists idx_places_name_trgm on places using gin (name gin_trgm_ops);
create index if not exists idx_places_geom on places using gist (geom);
