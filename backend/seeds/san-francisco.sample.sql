insert into places (id, city_slug, name, place_type, coverage_type, confidence, latitude, longitude)
values
  ('plc_ferry_building', 'san-francisco', 'Ferry Building', 'landmark', 'exact_place', 'high', 37.7955, -122.3937),
  ('plc_coit_tower', 'san-francisco', 'Coit Tower', 'landmark', 'exact_place', 'high', 37.8024, -122.4058)
on conflict do nothing;

insert into place_briefs (place_id, hook, summary, why_it_matters, facts)
values
  ('plc_ferry_building', 'A waterfront landmark that keeps reinventing itself.', 'The Ferry Building opened in 1898 and remains a civic gateway.', 'It reflects major shifts in transport, commerce, and waterfront planning.', '["Clock tower modeled after 12th-century Spanish architecture.","Transit and ferry hub for Bay commuters."]'::jsonb),
  ('plc_coit_tower', 'A hilltop monument with city-scale views and murals.', 'Coit Tower was completed in 1933 atop Telegraph Hill.', 'Its New Deal murals preserve social history and public art narratives.', '["Built with funds from Lillie Hitchcock Coit.","Contains Depression-era WPA murals."]'::jsonb)
on conflict do nothing;

insert into sources (place_id, label_type, title, url)
values
  ('plc_ferry_building', 'official', 'Port of San Francisco', 'https://sfport.com/'),
  ('plc_coit_tower', 'official', 'SF Recreation and Parks', 'https://sfrecpark.org/')
on conflict do nothing;
