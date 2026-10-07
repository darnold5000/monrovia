"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function AdminForm({
  action,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
}) {
  const [error, setError] = useState("");

  function validateUploads(event: React.FormEvent<HTMLFormElement>) {
    const oversized = Array.from(event.currentTarget.querySelectorAll<HTMLInputElement>('input[type="file"]'))
      .find((input) => input.files?.[0]?.size && input.files[0].size > MAX_UPLOAD_BYTES);
    if (!oversized) {
      setError("");
      return;
    }
    event.preventDefault();
    setError("That file is too large. Choose a file smaller than 10 MB.");
  }

  return (
    <form action={action} encType="multipart/form-data" onSubmit={validateUploads} className="mt-6 space-y-5">
      {error ? <p role="alert" className="border border-red-700/30 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</p> : null}
      {children}
    </form>
  );
}

export function AdminSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="inline-flex min-h-11 items-center justify-center gap-2 bg-gold px-6 py-3 text-sm font-bold tracking-[.1em] text-obsidian uppercase disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? <span className="size-4 animate-spin rounded-full border-2 border-obsidian/30 border-t-obsidian" aria-hidden="true" /> : null}
      {pending ? "Saving…" : "Save Changes"}
    </button>
  );
}
