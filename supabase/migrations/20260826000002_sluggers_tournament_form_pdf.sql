-- Restore each tournament's original card artwork and store the shared
-- downloadable registration form PDF path in Sluggers CMS data.
with sluggers as (
  select id
  from public.tenants
  where lower(slug) in ('sluggers', 'sluggers-indoor-baseball-softball', 'sluggers-indoor-baseball-softball-complex', 'sluggers-indoor-complex')
     or lower(display_name) in ('sluggers indoor baseball & softball', 'sluggers indoor baseball & softball complex')
  limit 1
)
update public.tenant_content_items item
set data = jsonb_set(
      jsonb_set(item.data, '{flyerUrl}', to_jsonb(case item.slug
        when 'hydrocephalus-fundraiser-2026' then '/images/sluggers/tournaments/hydrocephalus-fundraiser-2026.png'
        when 'fall-brawl-2026' then '/images/sluggers/tournaments/fall-brawl-2026.png'
      end::text), true),
      '{registrationFormUrl}',
      to_jsonb('/documents/sluggers-fall-tournaments-2026-registration-form.pdf'::text),
      true
    ),
    updated_at = now()
where item.tenant_id = (select id from sluggers)
  and item.content_type = 'tournament'
  and item.slug in ('hydrocephalus-fundraiser-2026', 'fall-brawl-2026');
