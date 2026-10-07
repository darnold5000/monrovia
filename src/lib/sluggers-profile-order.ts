import type { ContentItem } from "@/lib/sluggers-cms";

function profilePriority(item: ContentItem) {
  if (item.content_type === "business_staff") {
    const name = item.title.trim().toLowerCase();
    if (name === "bill amero") return 0;
    if (name === "eric sweeney") return 1;
  }
  return 2;
}

export function compareProfileContentItems(a: ContentItem, b: ContentItem) {
  return profilePriority(a) - profilePriority(b)
    || a.sort_order - b.sort_order
    || a.title.localeCompare(b.title);
}
