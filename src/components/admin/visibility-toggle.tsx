"use client";

import { useState } from "react";

export function VisibilityToggle({ defaultChecked }: { defaultChecked: boolean }) {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <label className="flex cursor-pointer flex-col items-center gap-1">
      <input
        name="published"
        type="checkbox"
        checked={enabled}
        onChange={(event) => setEnabled(event.target.checked)}
        className="sr-only"
      />
      <span aria-hidden="true" className={`relative block h-7 w-12 rounded-full transition ${enabled ? "bg-gold" : "bg-barn-muted/40"}`}>
        <span className={`absolute left-1 top-1 size-5 rounded-full transition ${enabled ? "translate-x-5 bg-obsidian" : "bg-white"}`} />
      </span>
      <span className="text-xs font-semibold text-barn-navy">{enabled ? "On" : "Off"}</span>
    </label>
  );
}
