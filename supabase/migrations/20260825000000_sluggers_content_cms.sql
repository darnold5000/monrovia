-- Generic tenant-scoped website content for Signal Works client sites.
-- This migration assumes the existing Signal Works platform foundation has
-- already created public.tenants, public.roles, and public.tenant_memberships.

create table if not exists public.tenant_content_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  content_type text not null check (content_type in (
    'tournament', 'tournament_resource', 'staff', 'training_offering',
    'program', 'facility_section', 'facility_stat', 'homepage', 'site_settings'
  )),
  slug text not null,
  title text not null,
  data jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, content_type, slug)
);

create index if not exists tenant_content_items_public_idx
  on public.tenant_content_items (tenant_id, content_type, published, sort_order);

create or replace function public.tenant_content_items_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tenant_content_items_updated_at on public.tenant_content_items;
create trigger tenant_content_items_updated_at
  before update on public.tenant_content_items
  for each row execute function public.tenant_content_items_set_updated_at();

alter table public.tenant_content_items enable row level security;

grant select on public.tenant_content_items to anon;
grant select, insert, update, delete on public.tenant_content_items to authenticated;
grant all on public.tenant_content_items to service_role;

insert into storage.buckets (id, name, public)
values ('sluggers-media', 'sluggers-media', true)
on conflict (id) do nothing;
