import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { DeleteContentButton } from "@/components/admin/delete-content-button";
import { AdminForm as AdminFormShell, AdminSubmitButton } from "@/components/admin/admin-form";
import { LocationListField } from "@/components/admin/location-list-field";
import { VisibilityToggle } from "@/components/admin/visibility-toggle";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { requireSluggersStaff } from "@/lib/sluggers-admin-auth";
import { adminSections, publicPathsForSection, type AdminField } from "@/lib/sluggers-admin-sections";
import { deleteContent, listContent, saveContent, type ContentItem } from "@/lib/sluggers-cms";
import { cleanupManagedMedia, collectManagedMediaPaths } from "@/lib/sluggers-media";
import { compareProfileContentItems } from "@/lib/sluggers-profile-order";
import { isTournamentDocumentImage } from "@/lib/tournament-document";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function dataString(data: Record<string, unknown>, key: string) {
  return typeof data[key] === "string" ? data[key] : "";
}

function dataStringList(data: Record<string, unknown>, key: string) {
  return Array.isArray(data[key]) ? data[key].filter((value): value is string => typeof value === "string" && Boolean(value.trim())) : [];
}

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function displayDate(value: string) {
  if (!value) return "Date not set";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.valueOf())
    ? value
    : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    open: "Registration Open",
    "coming-soon": "Coming Soon",
    "closing-soon": "Closing Soon",
    "sold-out": "Sold Out",
    closed: "Closed",
    completed: "Completed",
  };
  return labels[value] ?? value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function itemImage(item: ContentItem) {
  for (const key of ["flyerUrl", "photoUrl", "imageUrl", "heroImageUrl"]) {
    const value = dataString(item.data, key);
    if (value) return value;
  }
  return "";
}

function itemDetails(item: ContentItem) {
  const data = item.data;
  if (item.content_type === "tournament") {
    const locations = dataStringList(data, "locations");
    return [
      `${displayDate(dataString(data, "startDate"))} – ${displayDate(dataString(data, "endDate"))}`,
      locations.length ? locations.join(" · ") : [dataString(data, "location"), dataString(data, "address")].filter(Boolean).join(" · "),
      dataString(data, "ageGroups"),
      statusLabel(dataString(data, "status")),
    ].filter(Boolean);
  }
  if (item.content_type === "training_offering") {
    return [statusLabel(dataString(data, "sport")), dataString(data, "category"), dataString(data, "description")].filter(Boolean);
  }
  if (item.content_type === "staff") return [dataString(data, "role"), dataString(data, "specialties")].filter(Boolean);
  if (item.content_type === "travel_team_coach") return [dataString(data, "teamName"), dataString(data, "email"), dataString(data, "phone")].filter(Boolean);
  if (item.content_type === "business_staff") return [dataString(data, "role")].filter(Boolean);
  if (item.content_type === "facility_section") return [dataString(data, "description")].filter(Boolean);
  if (item.content_type === "facility_stat") return [[dataString(data, "label"), dataString(data, "value")].filter(Boolean).join(": ")].filter(Boolean);
  if (item.content_type === "program") return [dataString(data, "type"), dataString(data, "dates"), statusLabel(dataString(data, "status"))].filter(Boolean);
  if (item.content_type === "homepage") return [dataString(data, "headline"), dataString(data, "heroDescription")].filter(Boolean);
  if (item.content_type === "site_settings") return [dataString(data, "phone"), dataString(data, "email"), dataString(data, "address")].filter(Boolean);
  return [dataString(data, "description")].filter(Boolean);
}

function sortItems(items: ContentItem[]) {
  return [...items].sort((a, b) => {
    if (a.content_type === "tournament" && b.content_type === "tournament") {
      return dataString(a.data, "startDate").localeCompare(dataString(b.data, "startDate"));
    }
    if (
      ["travel_team_coach", "business_staff"].includes(a.content_type)
      && a.content_type === b.content_type
    ) {
      return compareProfileContentItems(a, b);
    }
    return a.sort_order - b.sort_order || a.title.localeCompare(b.title);
  });
}

function fileName(value: string) {
  try {
    return decodeURIComponent(new URL(value, "https://sluggers.local").pathname.split("/").pop() || "Current file");
  } catch {
    return "Current file";
  }
}

export default async function AdminSectionPage({ params, searchParams }: { params: Promise<{ section: string }>; searchParams: SearchParams }) {
  const { section } = await params;
  const query = await searchParams;
  const definition = adminSections[section];
  if (!definition) notFound();

  const { db, tenantId, role } = await requireSluggersStaff();
  const { data, error } = await listContent(db, tenantId, definition.type);
  if (error) console.error("Sluggers admin content load failed", { section, tenantId, code: error.code, message: error.message });
  const items = sortItems((data ?? []) as ContentItem[]);
  const editId = param(query.edit);
  const adding = param(query.mode) === "add";
  const selected = editId ? items.find((item) => item.id === editId) : undefined;
  if (editId && !selected) notFound();
  const editorOpen = adding || Boolean(selected);

  async function saveAction(formData: FormData) {
    "use server";
    const auth = await requireSluggersStaff();
    const itemId = String(formData.get("id") || "");
    const { data: existing, error: existingError } = itemId
      ? await auth.db.from("tenant_content_items").select("*").eq("id", itemId).eq("tenant_id", auth.tenantId).maybeSingle()
      : { data: null, error: null };
    if (existingError || (itemId && !existing)) {
      console.error("Sluggers admin could not load item before save", { section, itemId, message: existingError?.message });
      redirect(`/admin/${section}?error=save`);
    }

    const nextData: Record<string, unknown> = { ...((existing?.data as Record<string, unknown> | undefined) ?? {}) };
    const newlyUploadedData: Record<string, unknown> = {};
    for (const field of definition.fields) {
      if (field.kind === "file") continue;
      nextData[field.key] = field.kind === "checkboxes"
        ? formData.getAll(field.key).map(String).join(", ")
        : field.kind === "string-list"
          ? formData.getAll(field.key).map(String).map((value) => value.trim()).filter(Boolean)
          : String(formData.get(field.key) ?? "").trim();
    }

    for (const field of definition.fields.filter((candidate) => candidate.kind === "file")) {
      const targetKey = field.targetKey ?? field.key.replace(/File$/, "Url");
      const upload = formData.get(field.key);
      if (formData.get(`remove_${targetKey}`) === "on") nextData[targetKey] = "";
      if (!(upload instanceof File) || upload.size === 0) continue;
      const editorQuery = itemId ? `edit=${itemId}&` : "mode=add&";
      if (upload.size > 10 * 1024 * 1024) {
        await cleanupManagedMedia(auth.db, newlyUploadedData, [], auth.tenantId);
        redirect(`/admin/${section}?${editorQuery}error=file-size`);
      }
      const allowed = (field.accept ?? "").split(",").filter(Boolean);
      if (allowed.length && !allowed.includes(upload.type)) {
        await cleanupManagedMedia(auth.db, newlyUploadedData, [], auth.tenantId);
        redirect(`/admin/${section}?${editorQuery}error=file-type`);
      }

      const safeName = upload.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${auth.tenantId}/${definition.type}/${crypto.randomUUID()}-${safeName}`;
      const uploaded = await auth.db.storage.from("sluggers-media").upload(path, upload, { contentType: upload.type, upsert: false });
      if (uploaded.error) {
        console.error("Sluggers admin upload failed", { section, itemId, message: uploaded.error.message });
        await cleanupManagedMedia(auth.db, newlyUploadedData, [], auth.tenantId);
        redirect(`/admin/${section}?${editorQuery}error=upload`);
      }
      const publicUrl = auth.db.storage.from("sluggers-media").getPublicUrl(path).data.publicUrl;
      nextData[targetKey] = publicUrl;
      newlyUploadedData[targetKey] = publicUrl;
    }

    const title = definition.singleton
      ? (existing?.title ?? (definition.type === "homepage" ? "Homepage Content" : "Site Settings"))
      : definition.deriveTitleFrom
        ? String(nextData[definition.deriveTitleFrom] ?? "").trim()
        : String(formData.get("title") || "").trim();
    if (!title) {
      await cleanupManagedMedia(auth.db, newlyUploadedData, [], auth.tenantId);
      redirect(`/admin/${section}?${itemId ? `edit=${itemId}&` : "mode=add&"}error=title`);
    }
    const slug = existing?.slug ?? (slugify(title) || crypto.randomUUID());
    const sortOrder = existing?.sort_order ?? (items.reduce((max, item) => Math.max(max, item.sort_order), 0) + 1);
    const result = await saveContent(auth.db, auth.tenantId, {
      id: itemId || undefined,
      content_type: definition.type,
      slug,
      title,
      data: nextData,
      published: formData.get("published") === "on",
      sort_order: sortOrder,
    });
    if (result.error) {
      console.error("Sluggers admin content save failed", { section, itemId, code: result.error.code, message: result.error.message });
      await cleanupManagedMedia(auth.db, newlyUploadedData, [], auth.tenantId);
      redirect(`/admin/${section}?${itemId ? `edit=${itemId}&` : "mode=add&"}error=save`);
    }
    await cleanupManagedMedia(auth.db, existing?.data, collectManagedMediaPaths(nextData), auth.tenantId);
    revalidatePath("/admin");
    revalidatePath(`/admin/${section}`);
    for (const path of publicPathsForSection(section)) revalidatePath(path);
    if (section === "settings") revalidatePath("/", "layout");
    redirect(`/admin/${section}?saved=1`);
  }

  async function toggleAction(formData: FormData) {
    "use server";
    const auth = await requireSluggersStaff();
    const itemId = String(formData.get("id") || "");
    const nextPublished = formData.get("nextPublished") === "true";
    const { error: toggleError } = await auth.db.from("tenant_content_items").update({ published: nextPublished })
      .eq("id", itemId).eq("tenant_id", auth.tenantId).eq("content_type", definition.type);
    if (toggleError) {
      console.error("Sluggers admin visibility update failed", { section, itemId, message: toggleError.message });
      redirect(`/admin/${section}?error=visibility`);
    }
    revalidatePath("/admin");
    for (const path of publicPathsForSection(section)) revalidatePath(path);
    if (section === "settings") revalidatePath("/", "layout");
    redirect(`/admin/${section}?visibility=1`);
  }

  async function deleteAction(formData: FormData) {
    "use server";
    const auth = await requireSluggersStaff();
    const itemId = String(formData.get("id") || "");
    const { data: existing, error: existingError } = await auth.db.from("tenant_content_items").select("data")
      .eq("id", itemId).eq("tenant_id", auth.tenantId).eq("content_type", definition.type).maybeSingle();
    if (existingError || !existing) {
      console.error("Sluggers admin delete lookup failed", { section, itemId, message: existingError?.message });
      redirect(`/admin/${section}?error=delete`);
    }
    const result = await deleteContent(auth.db, auth.tenantId, itemId);
    if (result.error) {
      console.error("Sluggers admin delete failed", { section, itemId, message: result.error.message });
      redirect(`/admin/${section}?error=delete`);
    }
    await cleanupManagedMedia(auth.db, existing.data, [], auth.tenantId);
    revalidatePath("/admin");
    for (const path of publicPathsForSection(section)) revalidatePath(path);
    if (section === "settings") revalidatePath("/", "layout");
    redirect(`/admin/${section}?deleted=1`);
  }

  const errorMessage = param(query.error) ? friendlyError(param(query.error) ?? "") : "";
  if (editorOpen) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <Link href={`/admin/${section}`} className="text-sm font-semibold text-gold hover:text-barn-cream">← Back to {definition.title}</Link>
        <div className="mt-5 border border-gunmetal bg-card p-5 sm:p-7">
          <p className="eyebrow">{selected ? "Edit" : "Add"} {definition.singular}</p>
          <h1 className="mt-2 font-display text-3xl font-black uppercase text-barn-navy sm:text-4xl">{selected ? selected.title : `New ${definition.singular}`}</h1>
          <p className="mt-2 text-xs text-stone">Fields marked with * are required.</p>
          {errorMessage ? <AdminAlert tone="error">{errorMessage}</AdminAlert> : null}
          <AdminForm action={saveAction} definition={definition} item={selected} cancelHref={`/admin/${section}`} />
        </div>
      </main>
    );
  }

  const canAdd = !definition.singleton || items.length === 0;
  const addLabel = definition.singleton ? `Set Up ${definition.title}` : `+ Add ${definition.singular}`;
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Sluggers Staff Portal</p>
          <h1 className="mt-2 font-display text-4xl font-black uppercase text-barn-cream">{definition.title}</h1>
          <p className="mt-3 max-w-2xl text-stone">{definition.description}</p>
        </div>
        {canAdd ? <Link href={`/admin/${section}?mode=add`} className="inline-flex min-h-11 items-center justify-center bg-gold px-5 py-3 text-sm font-bold tracking-[.1em] text-obsidian uppercase">{addLabel}</Link> : null}
      </div>
      {section === "facility" ? <div className="mt-5 text-sm text-stone">Need to change the short stats at the top of the Facility page? <Link href="/admin/facility-stats" className="font-semibold text-gold hover:text-barn-cream">Manage Facility Highlights →</Link></div> : null}
      {section === "training" ? <div className="mt-5 max-w-3xl border border-gold/40 bg-card p-4 text-sm text-stone"><span className="font-semibold text-barn-navy">Training options and staff profiles are managed separately.</span> Changes here update the training offering cards only. To change the instructors shown lower on the Training page, use <Link href="/admin/staff" className="font-semibold text-gold hover:text-barn-cream">Training Staff →</Link></div> : null}
      {param(query.saved) ? <AdminAlert tone="success">Your changes were saved.</AdminAlert> : null}
      {param(query.visibility) ? <AdminAlert tone="success">Website visibility was updated.</AdminAlert> : null}
      {param(query.deleted) ? <AdminAlert tone="success">The item was deleted.</AdminAlert> : null}
      {errorMessage ? <AdminAlert tone="error">{errorMessage}</AdminAlert> : null}
      {error ? <AdminAlert tone="error">We couldn’t load this section. Please try again.</AdminAlert> : null}

      {!error && items.length === 0 ? (
        <section className="mt-8 border border-dashed border-gunmetal bg-card p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold uppercase text-barn-navy">Nothing here yet</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-stone">{definition.emptyText}</p>
          <Link href={`/admin/${section}?mode=add`} className="mt-6 inline-flex min-h-11 items-center bg-gold px-5 py-3 text-sm font-bold text-obsidian uppercase">{addLabel}</Link>
        </section>
      ) : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const image = itemImage(item);
          const documentUrl = item.content_type === "tournament_resource" ? dataString(item.data, "url") : "";
          const isPortraitProfile = ["travel_team_coach", "business_staff"].includes(item.content_type);
          return (
            <article key={item.id} className="flex min-w-0 flex-col overflow-hidden border border-gunmetal bg-card">
              {image ? <div className={`relative border-b border-gunmetal ${isPortraitProfile ? "aspect-[3/4] bg-barn-sand" : item.content_type === "staff" ? "aspect-[4/3] bg-barn-sand" : "aspect-[16/8] bg-obsidian"}`}><Image src={image} alt="" fill className={isPortraitProfile ? "object-cover object-top" : item.content_type === "staff" ? "object-contain" : "object-cover"} sizes="(max-width: 640px) 100vw, 33vw" /></div> : isPortraitProfile ? <MediaPlaceholder alt={`${item.title} photo placeholder`} size="lg" className="aspect-[3/4] !min-h-0 !max-h-none rounded-none border-0 border-b border-gunmetal" /> : null}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-bold uppercase text-barn-navy">{item.title}</h2>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[.65rem] font-bold uppercase ${item.published ? "bg-emerald-900/60 text-emerald-200" : "bg-white/10 text-stone"}`}>{item.published ? "Visible" : "Hidden"}</span>
                </div>
                <div className="mt-3 space-y-1 text-sm text-stone">{itemDetails(item).slice(0, 4).map((detail) => <p key={detail} className="line-clamp-2 whitespace-pre-line">{detail}</p>)}</div>
                {documentUrl ? <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm font-semibold text-gold hover:text-barn-cream">View current document →</a> : null}
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-gunmetal pt-5">
                  <Link href={`/admin/${section}?edit=${item.id}`} className="text-sm font-semibold text-gold hover:text-barn-cream">{item.content_type === "tournament_resource" ? "Replace PDF" : "Edit"}</Link>
                  <form action={toggleAction}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="nextPublished" value={String(!item.published)} /><button type="submit" className="text-sm font-semibold text-stone hover:text-barn-cream">{item.published ? "Hide" : "Show"}</button></form>
                  {!definition.singleton ? <DeleteContentButton action={deleteAction} id={item.id} title={item.title} noun={definition.singular} /> : null}
                </div>
              </div>
            </article>
          );
        })}
      </section>
      <p className="mt-8 text-xs text-stone">Signed in as {role}. Hidden items do not appear on the public website.</p>
    </main>
  );
}

function AdminAlert({ children, tone }: { children: React.ReactNode; tone: "success" | "error" }) {
  return <div className={`mt-6 border p-4 text-sm ${tone === "success" ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-100" : "border-red-400/40 bg-red-950/30 text-red-100"}`}>{children}</div>;
}

function friendlyError(code: string) {
  if (code === "file-size") return "That file is too large. Choose a file smaller than 10 MB.";
  if (code === "file-type") return "That file type is not supported. Please choose one of the listed file types.";
  if (code === "upload") return "We couldn’t upload that file. Please try again.";
  if (code === "title") return "Please enter a name before saving.";
  if (code === "visibility") return "We couldn’t update website visibility. Please try again.";
  if (code === "delete") return "We couldn’t delete that item. Please try again.";
  return "We couldn’t save your changes. Please try again.";
}

function AdminForm({ action, definition, item, cancelHref }: { action: (formData: FormData) => void | Promise<void>; definition: (typeof adminSections)[string]; item?: ContentItem; cancelHref: string }) {
  const normalFields = definition.fields.filter((field) => !field.advanced);
  const advancedFields = definition.fields.filter((field) => field.advanced);
  return (
    <AdminFormShell action={action}>
      <input type="hidden" name="id" value={item?.id ?? ""} />
      {!definition.singleton && !definition.deriveTitleFrom ? <FieldLabel label={`${definition.titleLabel} *`}><input required name="title" defaultValue={item?.title ?? ""} className="admin-input" /></FieldLabel> : null}
      {normalFields.map((field) => <AdminFieldControl key={field.key} field={field} data={item?.data ?? {}} />)}
      <div className="flex items-center justify-between gap-4 border border-gunmetal bg-barn-sand p-4">
        <span><span className="block font-semibold text-barn-navy">Show on Website</span><span className="mt-1 block text-xs text-stone">{item?.published === false ? "Hidden from public website" : "Visible on website"}</span></span>
        <VisibilityToggle defaultChecked={item?.published ?? true} />
      </div>
      {advancedFields.length ? (
        <details className="border border-gunmetal bg-barn-sand p-4">
          <summary className="cursor-pointer font-semibold text-barn-navy">Advanced Settings</summary>
          <p className="mt-2 text-xs text-stone">Most staff members will not need these fields.</p>
          <div className="mt-5 space-y-5">{advancedFields.map((field) => <AdminFieldControl key={field.key} field={field} data={item?.data ?? {}} />)}</div>
        </details>
      ) : null}
      <div className="flex flex-col-reverse gap-3 border-t border-gunmetal pt-5 sm:flex-row sm:justify-end">
        <Link href={cancelHref} className="inline-flex min-h-11 items-center justify-center border border-gunmetal px-5 py-3 text-sm font-semibold text-barn-navy hover:border-gold">Cancel</Link>
        <AdminSubmitButton />
      </div>
    </AdminFormShell>
  );
}

function FieldLabel({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return <label className="block text-sm"><span className="mb-1.5 block font-semibold text-barn-navy">{label}</span>{children}{help ? <span className="mt-1.5 block text-xs text-stone">{help}</span> : null}</label>;
}

function AdminFieldControl({ field, data }: { field: AdminField; data: Record<string, unknown> }) {
  const value = dataString(data, field.key);
  if (field.kind === "string-list") {
    const storedLocations = dataStringList(data, field.key);
    const legacyLocation = [dataString(data, "location"), dataString(data, "address")].filter(Boolean).join(", ");
    return <LocationListField name={field.key} label={field.label} help={field.help} defaultValues={storedLocations.length ? storedLocations : legacyLocation ? [legacyLocation] : []} />;
  }
  if (field.kind === "textarea") return <FieldLabel label={field.label} help={field.help}><textarea name={field.key} defaultValue={value} placeholder={field.placeholder} className="admin-input min-h-28 resize-y" /></FieldLabel>;
  if (field.kind === "select") {
    return <FieldLabel label={field.label} help={field.help}><select name={field.key} defaultValue={value} className="admin-input min-h-12"><option value="">Select an option</option>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></FieldLabel>;
  }
  if (field.kind === "checkboxes") {
    const selected = new Set(value.split(",").map((entry) => entry.trim()).filter(Boolean));
    return <fieldset><legend className="mb-2 text-sm font-semibold text-barn-navy">{field.label}</legend><div className="grid gap-2 sm:grid-cols-2">{field.options?.map((option) => <label key={option.value} className="flex min-h-11 items-center gap-2 border border-gunmetal bg-barn-white px-3 py-2 text-sm text-barn-navy"><input type="checkbox" name={field.key} value={option.value} defaultChecked={selected.has(option.value)} className="size-4 accent-[var(--gold)]" />{option.label}</label>)}</div></fieldset>;
  }
  if (field.kind === "file") {
    const targetKey = field.targetKey ?? field.key.replace(/File$/, "Url");
    const current = dataString(data, targetKey);
    const acceptsImages = field.accept?.includes("image/");
    const acceptsPdf = field.accept?.includes("application/pdf");
    const isImage = acceptsImages && (!acceptsPdf || isTournamentDocumentImage(current));
    return (
      <div className="border border-gunmetal bg-barn-sand p-4">
        <p className="text-sm font-semibold text-barn-navy">{field.label}</p>
        {current ? <div className="mt-3 flex items-center gap-3">{isImage ? <div className="relative size-20 shrink-0 overflow-hidden border border-gunmetal"><Image src={current} alt="Current upload" fill className="object-cover" sizes="80px" /></div> : null}<div className="min-w-0"><a href={current} target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-semibold text-gold hover:text-barn-cream">{fileName(current)}</a><label className="mt-2 flex items-center gap-2 text-xs text-stone"><input type="checkbox" name={`remove_${targetKey}`} /> Remove current file</label></div></div> : <p className="mt-2 text-xs text-stone">No file uploaded.</p>}
        <input name={field.key} type="file" accept={field.accept} className="mt-3 block w-full text-sm text-barn-navy file:mr-3 file:min-h-10 file:border-0 file:bg-gold file:px-4 file:font-semibold file:text-obsidian" />
        {field.help ? <p className="mt-2 text-xs text-stone">{field.help}</p> : null}
      </div>
    );
  }
  const inputType = field.kind === "date" || field.kind === "email" || field.kind === "tel" ? field.kind : "text";
  const inputMode = field.kind === "url" ? "url" : field.kind === "email" ? "email" : field.kind === "tel" ? "tel" : undefined;
  return <FieldLabel label={field.label} help={field.help}><input name={field.key} type={inputType} inputMode={inputMode} defaultValue={value} placeholder={field.placeholder} className="admin-input" /></FieldLabel>;
}
