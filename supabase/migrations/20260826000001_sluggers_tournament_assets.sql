-- Sluggers-only asset migration.
-- The files are bundled with this site so public links do not depend on the
-- previous CDN URLs remaining available.
with sluggers as (
  select id
  from public.tenants
  where lower(slug) in ('sluggers', 'sluggers-indoor-baseball-softball', 'sluggers-indoor-baseball-softball-complex', 'sluggers-indoor-complex')
     or lower(display_name) in ('sluggers indoor baseball & softball', 'sluggers indoor baseball & softball complex')
  limit 1
)
update public.tenant_content_items item
set data = jsonb_set(item.data, '{url}', to_jsonb(case item.slug
  when '8u-playing-rules' then '/documents/2027-playing-rules-8u.pdf'
  when 'tournament-rules-guidelines' then '/documents/2027-playing-rules-70-minutes.pdf'
  when '2027-player-age-chart' then '/documents/2027-player-age-chart.pdf'
end::text), true),
    updated_at = now()
where item.tenant_id = (select id from sluggers)
  and item.content_type = 'tournament_resource'
  and item.slug in ('8u-playing-rules', 'tournament-rules-guidelines', '2027-player-age-chart');

with sluggers as (
  select id
  from public.tenants
  where lower(slug) in ('sluggers', 'sluggers-indoor-baseball-softball', 'sluggers-indoor-baseball-softball-complex', 'sluggers-indoor-complex')
     or lower(display_name) in ('sluggers indoor baseball & softball', 'sluggers indoor baseball & softball complex')
  limit 1
)
update public.tenant_content_items item
set data = jsonb_set(item.data, '{flyerUrl}', to_jsonb('/images/sluggers/tournaments/sluggers-fall-tournaments-2026.jpg'::text), true),
    updated_at = now()
where item.tenant_id = (select id from sluggers)
  and item.content_type = 'tournament'
  and item.slug in ('hydrocephalus-fundraiser-2026', 'fall-brawl-2026');
