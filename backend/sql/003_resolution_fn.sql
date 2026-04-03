create or replace function resolve_place(
  in_lat double precision,
  in_lng double precision,
  in_city text default 'san-francisco'
)
returns table (
  mode text,
  confidence text,
  distance_meters double precision,
  place_id text
)
language sql
as $$
  with candidate as (
    select p.id,
           st_distance(
             p.geom,
             st_setsrid(st_makepoint(in_lng, in_lat), 4326)::geography
           ) as distance_meters
    from places p
    where p.city_slug = in_city
    order by p.geom <-> st_setsrid(st_makepoint(in_lng, in_lat), 4326)::geography
    limit 1
  )
  select
    case
      when c.distance_meters <= 50 then 'exact_place'
      when c.distance_meters <= 250 then 'nearby_place'
      else 'area_context'
    end as mode,
    case
      when c.distance_meters <= 50 then 'high'
      when c.distance_meters <= 250 then 'medium'
      else 'low'
    end as confidence,
    c.distance_meters,
    c.id
  from candidate c;
$$;
