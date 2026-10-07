-- MANUAL / NOT PART OF THE MIGRATION CHAIN
-- Review and run separately in the production Signal Works database only
-- after the Sluggers tenant identity and membership owner are confirmed.
-- This file has not been executed by Codex.
-- STOP if a Sluggers tenant already exists. The production tenant currently
-- configured for this application must be reused; do not create a duplicate.

insert into public.tenants (
  id,
  slug,
  display_name,
  status,
  platform_category
)
values (
  gen_random_uuid(),
  'sluggers-indoor-baseball-softball',
  'Sluggers Indoor Baseball & Softball',
  'active',
  'services'
)
returning id, slug, display_name, status, platform_category;

-- Copy the returned id into TENANT_ID after reviewing the row.
