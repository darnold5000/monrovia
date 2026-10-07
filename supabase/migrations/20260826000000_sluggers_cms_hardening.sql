-- Tenant CMS hardening using the existing Signal Works authorization model.

create or replace function public.is_sluggers_tenant(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tenants t
    where t.id = target_tenant_id
      and (
        lower(t.display_name) = 'sluggers indoor baseball & softball'
        or lower(t.display_name) = 'sluggers indoor baseball & softball complex'
        or lower(t.slug) in ('sluggers', 'sluggers-indoor-baseball-softball', 'sluggers-indoor-baseball-softball-complex', 'sluggers-indoor-complex')
      )
  );
$$;

create or replace function public.is_tenant_website_staff(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_tenant_permission(target_tenant_id, 'manage_website');
$$;

revoke all on function public.is_sluggers_tenant(uuid) from public;
revoke all on function public.is_tenant_website_staff(uuid) from public;
grant execute on function public.is_sluggers_tenant(uuid) to anon, authenticated;
grant execute on function public.is_tenant_website_staff(uuid) to authenticated;

alter table public.tenant_content_items enable row level security;

drop policy if exists tenant_content_public_select on public.tenant_content_items;
create policy tenant_content_public_select on public.tenant_content_items
  for select to anon, authenticated
  using (published = true);

drop policy if exists tenant_content_staff_select on public.tenant_content_items;
create policy tenant_content_staff_select on public.tenant_content_items
  for select to authenticated
  using (public.is_tenant_website_staff(tenant_id));

drop policy if exists tenant_content_staff_insert on public.tenant_content_items;
create policy tenant_content_staff_insert on public.tenant_content_items
  for insert to authenticated
  with check (public.is_tenant_website_staff(tenant_id));

drop policy if exists tenant_content_staff_update on public.tenant_content_items;
create policy tenant_content_staff_update on public.tenant_content_items
  for update to authenticated
  using (public.is_tenant_website_staff(tenant_id))
  with check (public.is_tenant_website_staff(tenant_id));

drop policy if exists tenant_content_staff_delete on public.tenant_content_items;
create policy tenant_content_staff_delete on public.tenant_content_items
  for delete to authenticated
  using (public.is_tenant_website_staff(tenant_id));

create or replace function public.is_tenant_media_staff(object_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if object_name !~ '^[0-9a-fA-F-]{36}/' then
    return false;
  end if;
  return public.is_sluggers_tenant(split_part(object_name, '/', 1)::uuid)
    and public.is_tenant_website_staff(split_part(object_name, '/', 1)::uuid);
end;
$$;

revoke all on function public.is_tenant_media_staff(text) from public;
grant execute on function public.is_tenant_media_staff(text) to authenticated;

drop policy if exists sluggers_media_public_read on storage.objects;
create policy sluggers_media_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'sluggers-media');

drop policy if exists sluggers_media_staff_insert on storage.objects;
create policy sluggers_media_staff_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'sluggers-media' and public.is_tenant_media_staff(name));

drop policy if exists sluggers_media_staff_update on storage.objects;
create policy sluggers_media_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'sluggers-media' and public.is_tenant_media_staff(name))
  with check (bucket_id = 'sluggers-media' and public.is_tenant_media_staff(name));

drop policy if exists sluggers_media_staff_delete on storage.objects;
create policy sluggers_media_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'sluggers-media' and public.is_tenant_media_staff(name));

notify pgrst, 'reload schema';
