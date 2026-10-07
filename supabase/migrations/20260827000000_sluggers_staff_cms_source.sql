-- Make the three current Sluggers staff members editable from the tenant CMS.
-- This migration is deliberately restricted to the verified production Sluggers tenant.

do $$
declare
  sluggers_tenant_id uuid;
  victoria_item_id uuid;
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
    raise exception 'Refusing to initialize staff CMS: verified Sluggers tenant was not found.';
  end if;

  insert into public.tenant_content_items (
    tenant_id, content_type, slug, title, data, published, sort_order
  ) values
  (
    sluggers_tenant_id,
    'staff',
    'bill-amero',
    'Bill Amero',
    jsonb_build_object(
      'cmsManaged', true,
      'role', 'Baseball & Softball Instructor',
      'bio', 'Baseball and softball instruction focused on player development, mechanics, and game-ready training.',
      'specialties', 'Hitting, Pitching, Player Development',
      'sport', 'baseball,softball',
      'phone', '330-549-6150',
      'photoUrl', '/images/sluggers/coaches/bill-amero-2026.jpg'
    ),
    true,
    1
  ),
  (
    sluggers_tenant_id,
    'staff',
    'tony-sarigianopolous',
    'Tony Sarigianopolous',
    jsonb_build_object(
      'cmsManaged', true,
      'role', 'Fitness / Athletic Development',
      'bio', 'Fitness and athletic development training to support baseball and softball athletes at Sluggers.',
      'specialties', 'Strength, Conditioning, Athletic Performance',
      'sport', 'fitness',
      'phone', '330-207-6269',
      'photoUrl', '/images/sluggers/coaches/tony-sarigianopolous-2026.jpg'
    ),
    true,
    2
  )
  on conflict (tenant_id, content_type, slug) do update
  set title = excluded.title,
      data = excluded.data,
      published = excluded.published,
      sort_order = excluded.sort_order;

  select item.id
    into victoria_item_id
  from public.tenant_content_items item
  where item.tenant_id = sluggers_tenant_id
    and item.content_type = 'staff'
    and (
      lower(item.slug) in ('victoria', 'victoria-tedesco')
      or lower(item.title) like 'victoria%'
    )
  order by
    case when lower(item.slug) = 'victoria' then 0 else 1 end,
    item.updated_at desc
  limit 1;

  if victoria_item_id is null then
    insert into public.tenant_content_items (
      tenant_id, content_type, slug, title, data, published, sort_order
    ) values (
      sluggers_tenant_id,
      'staff',
      'victoria',
      'Victoria',
      jsonb_build_object(
        'cmsManaged', true,
        'role', 'Softball Instructor',
        'bio', 'Softball Instructor.',
        'specialties', 'Hitting, Pitching, Fielding, Player Development',
        'sport', 'softball',
        'phone', '330-207-6269',
        'photoUrl', '/images/sluggers/coaches/victoria.jpg'
      ),
      true,
      3
    );
  else
    update public.tenant_content_items
    set data = coalesce(data, '{}'::jsonb) || jsonb_build_object(
          'cmsManaged', true,
          'role', 'Softball Instructor',
          'bio', 'Softball Instructor.',
          'specialties', 'Hitting, Pitching, Fielding, Player Development',
          'sport', 'softball',
          'phone', '330-207-6269',
          'photoUrl', '/images/sluggers/coaches/victoria.jpg'
        ),
        published = true,
        sort_order = 3
    where id = victoria_item_id
      and tenant_id = sluggers_tenant_id;
  end if;
end
$$;
