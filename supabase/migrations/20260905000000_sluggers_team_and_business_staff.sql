-- Add CMS-managed profile types for the Travel Teams and Our Staff pages.

alter table public.tenant_content_items
  drop constraint if exists tenant_content_items_content_type_check;

alter table public.tenant_content_items
  add constraint tenant_content_items_content_type_check check (content_type in (
    'tournament', 'tournament_resource', 'staff', 'travel_team_coach',
    'business_staff', 'training_offering', 'program', 'facility_section',
    'facility_stat', 'homepage', 'site_settings'
  ));

do $$
declare
  sluggers_tenant_id uuid;
begin
  select t.id
    into sluggers_tenant_id
  from public.tenants t
  where lower(t.slug) = 'sluggers-of-ohio'
    and lower(t.display_name) in (
      'sluggers of ohio',
      'sluggers indoor baseball & softball',
      'sluggers indoor baseball & softball complex'
    )
  limit 1;

  if sluggers_tenant_id is null then
    raise exception 'Refusing to initialize profile CMS: verified Sluggers tenant was not found.';
  end if;

  insert into public.tenant_content_items (
    tenant_id, content_type, slug, title, data, published, sort_order
  )
  select
    sluggers_tenant_id,
    'travel_team_coach',
    'travel-team-coach-' || slot,
    'Travel Team Coach ' || slot,
    jsonb_build_object('cmsManaged', true, 'photoUrl', '', 'teamName', '', 'email', '', 'phone', ''),
    true,
    slot
  from generate_series(1, 6) as slot
  on conflict (tenant_id, content_type, slug) do nothing;

  insert into public.tenant_content_items (
    tenant_id, content_type, slug, title, data, published, sort_order
  )
  select
    sluggers_tenant_id,
    'business_staff',
    'staff-member-' || slot,
    'Staff Member ' || slot,
    jsonb_build_object('cmsManaged', true, 'photoUrl', '', 'role', ''),
    true,
    slot
  from generate_series(1, 4) as slot
  on conflict (tenant_id, content_type, slug) do nothing;
end
$$;
