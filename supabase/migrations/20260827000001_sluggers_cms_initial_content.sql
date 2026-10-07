-- Initialize every public Sluggers content item exposed by the staff portal.
-- Existing CMS records are preserved. Staff records are intentionally excluded
-- because they are initialized by 20260827000000_sluggers_staff_cms_source.sql.

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
    raise exception 'Refusing to initialize Sluggers CMS: verified Sluggers tenant was not found.';
  end if;

  insert into public.tenant_content_items (
    tenant_id,
    content_type,
    slug,
    title,
    data,
    published,
    sort_order
  )
  select
    sluggers_tenant_id,
    seed.content_type,
    seed.slug,
    seed.title,
    seed.data,
    true,
    seed.sort_order
  from (values
    (
      'tournament',
      'hydrocephalus-fundraiser-2026',
      'Hydrocephalus Fundraiser Softball Tournament',
      $json${"cmsManaged":true,"startDate":"2026-09-26","endDate":"2026-09-27","location":"Springfield High School","address":"New Middletown, Ohio","locations":["Springfield High School, New Middletown, Ohio"],"ageGroups":"8U through High School","registrationFee":"$440","format":"","status":"open","description":"Fundraiser tournament with proceeds supporting the Hydrocephalus Association.","flyerUrl":"/images/sluggers/tournaments/hydrocephalus-fundraiser-2026.png","registrationFormUrl":"/documents/sluggers-fall-tournaments-2026-registration-form.pdf","featured":true}$json$::jsonb,
      1
    ),
    (
      'tournament',
      'fall-brawl-2026',
      'Sluggers Fall Brawl',
      $json${"cmsManaged":true,"startDate":"2026-10-17","endDate":"2026-10-18","location":"Springfield High School","address":"11335 Youngstown-Pittsburgh Road, New Middletown, Ohio","locations":["Springfield High School, 11335 Youngstown-Pittsburgh Road, New Middletown, Ohio"],"ageGroups":"8U through High School","registrationFee":"$450","format":"4-game guarantee","status":"open","description":"Season-ending fall classic for travel and school teams across Northeast Ohio.","flyerUrl":"/images/sluggers/tournaments/fall-brawl-2026.png","registrationFormUrl":"/documents/sluggers-fall-tournaments-2026-registration-form.pdf","featured":true}$json$::jsonb,
      2
    ),
    (
      'tournament',
      'sluggers-softball-tournament-series-2027',
      '2027 Sluggers Softball Tournament Series',
      $json${"cmsManaged":true,"startDate":"2027-04-30","endDate":"2027-07-05","location":"Multiple Northeast Ohio locations","address":"Springfield High School, Fields of Dreams & McCune Fields","locations":["Springfield High School, New Middletown, Ohio","Fields of Dreams, Boardman, Ohio","McCune Fields, Canfield, Ohio"],"ageGroups":"8U–14U; select 16U & 18U divisions","registrationFee":"$495","format":"Seven tournament dates with multi-tournament discounts","status":"open","description":"Choose from May Madness, Spring Fling, Stars & Stripes Classic, June Sluggfest, Father’s Day Battle, June Rumble, and Firecracker Frenzy.","flyerUrl":"/images/sluggers/tournaments/2027-softball-tournament-series-discounts.jpg","registrationFormUrl":"/documents/2027-sluggers-softball-tournament-series-registration.pdf","registrationVariant":"series","featured":false}$json$::jsonb,
      3
    ),
    (
      'tournament_resource',
      '8u-playing-rules',
      '8U Playing Rules',
      $json${"cmsManaged":true,"resourceType":"bundled PDF","url":"/documents/2027-playing-rules-8u.pdf"}$json$::jsonb,
      1
    ),
    (
      'tournament_resource',
      'tournament-rules-guidelines',
      'Tournament Rules and Guidelines',
      $json${"cmsManaged":true,"resourceType":"bundled PDF","url":"/documents/2027-playing-rules-70-minutes.pdf"}$json$::jsonb,
      2
    ),
    (
      'tournament_resource',
      '2027-player-age-chart',
      '2027 Player Age Chart',
      $json${"cmsManaged":true,"resourceType":"bundled PDF","url":"/documents/2027-player-age-chart.pdf"}$json$::jsonb,
      3
    ),
    (
      'training_offering',
      'baseball-hitting',
      'Baseball Hitting Lesson',
      $json${"cmsManaged":true,"sport":"baseball","category":"Hitting","description":"One-on-one hitting instruction focused on mechanics, timing, and game-ready practice.","imageUrl":"/images/sluggers/training/baseball-hitting.png","duration":"45 minutes","displayPrice":"Contact for availability and pricing","ctaLabel":"Request a Lesson","ctaUrl":"/availability?calendar=upstairs&service=small-group-training"}$json$::jsonb,
      1
    ),
    (
      'training_offering',
      'baseball-pitching',
      'Baseball Pitching Lesson',
      $json${"cmsManaged":true,"sport":"baseball","category":"Pitching","description":"Pitching instruction built around mechanics, command, and player-specific development.","imageUrl":"/images/sluggers/training/baseball-pitching.png","imagePosition":"center 20%","duration":"60 minutes","displayPrice":"Contact for availability and pricing","ctaLabel":"Request a Lesson","ctaUrl":"/availability?calendar=upstairs&service=baseball-lesson"}$json$::jsonb,
      2
    ),
    (
      'training_offering',
      'softball-hitting',
      'Softball Hitting Lesson',
      $json${"cmsManaged":true,"sport":"softball","category":"Hitting","description":"Softball hitting development with individualized instruction and quality reps.","imageUrl":"/images/sluggers/training/softball-hitting.png","duration":"45 minutes","displayPrice":"Contact for availability and pricing","ctaLabel":"Request a Lesson","ctaUrl":"/availability?calendar=upstairs&service=small-group-training"}$json$::jsonb,
      3
    ),
    (
      'training_offering',
      'softball-pitching',
      'Softball Pitching Lesson',
      $json${"cmsManaged":true,"sport":"softball","category":"Pitching","description":"Softball pitching instruction focused on mechanics and confidence in the circle.","imageUrl":"/images/sluggers/training/softball-pitching.png","imagePosition":"center 25%","duration":"60 minutes","displayPrice":"Contact for availability and pricing","ctaLabel":"Request a Lesson","ctaUrl":"/availability?calendar=upstairs&service=softball-lesson"}$json$::jsonb,
      4
    ),
    (
      'facility_section',
      'main',
      'Main Turf',
      $json${"cmsManaged":true,"description":"Sluggers supports team practices, hitting, pitching, scrimmages, individual work, and both baseball and softball development on the main turf.","imageUrl":"/images/sluggers/facility/main-turf-field.png","secondaryImageUrl":"/images/sluggers/facility/main-turf-wide.png"}$json$::jsonb,
      1
    ),
    (
      'facility_section',
      'upstairs',
      'Upstairs Hitting / Pitching Area',
      $json${"cmsManaged":true,"description":"A dedicated upstairs training area suited for individual work, small groups, hitting stations, and pitching development.","imageUrl":"/images/sluggers/facility/upstairs-pitching-lane.png","secondaryImageUrl":"/images/sluggers/facility/upstairs-training.png"}$json$::jsonb,
      2
    ),
    (
      'facility_stat',
      'square-footage',
      '9,000+ SQ FT TURF',
      $json${"cmsManaged":true,"label":"9,000+ SQ FT TURF","value":""}$json$::jsonb,
      1
    ),
    (
      'facility_stat',
      'sports-supported',
      'BASEBALL & SOFTBALL',
      $json${"cmsManaged":true,"label":"BASEBALL & SOFTBALL","value":""}$json$::jsonb,
      2
    ),
    (
      'facility_stat',
      'small-group-training',
      'SMALL-GROUP TRAINING',
      $json${"cmsManaged":true,"label":"SMALL-GROUP TRAINING","value":""}$json$::jsonb,
      3
    ),
    (
      'facility_stat',
      'team-practice-rentals',
      'TEAM PRACTICE & RENTALS',
      $json${"cmsManaged":true,"label":"TEAM PRACTICE & RENTALS","value":""}$json$::jsonb,
      4
    ),
    (
      'homepage',
      'homepage',
      'Homepage Content',
      $json${"cmsManaged":true,"eyebrow":"Poland, Ohio · Indoor Baseball & Softball","headline":"Sluggers Indoor Baseball & Softball","tagline":"Train. Compete. Develop.","heroDescription":"Indoor baseball and softball training, team practices, tournaments, and more in Poland, Ohio.","heroImageUrl":"/images/sluggers/facility/main-turf-wide.png","introEyebrow":"Welcome to Sluggers","introHeading":"Northeast Ohio's indoor home for baseball & softball","introBody":"Sluggers Indoor Baseball & Softball Complex is Northeast Ohio's premier indoor training facility for players and teams of all ages. We offer team practices, private hitting, pitching and fielding instruction, summer softball tournaments, birthday parties and more!","closingStatement":"At Sluggers, there's always something happening—so come join the action!","featuredAnnouncement":""}$json$::jsonb,
      1
    ),
    (
      'site_settings',
      'site-settings',
      'Site Settings',
      $json${"cmsManaged":true,"businessName":"Sluggers Indoor Baseball & Softball","phone":"330-549-6150","email":"sluggers.ohio@gmail.com","address":"9862 South Ave.\nPoland, OH 44514","facebook":"https://www.facebook.com/SluggersIndoorComplex/","instagram":"https://www.instagram.com/Sluggersofohio","x":"https://x.com/SluggersofOhio1","yelp":"https://www.yelp.com/biz/sluggers-of-ohio-youngstown","mapsUrl":"https://www.google.com/maps/dir/?api=1&destination=9862+South+Ave.,+Poland,+OH+44514","playingFieldCalendarId":"sluggers.ohio@gmail.com","upstairsCalendarId":"dfc83902467c36e1aa925eb56ba27cd29a1cd5c0900408bd498a1705e73462dc@group.calendar.google.com","timezone":"America/New_York"}$json$::jsonb,
      1
    )
  ) as seed(content_type, slug, title, data, sort_order)
  on conflict (tenant_id, content_type, slug) do nothing;
end
$$;
