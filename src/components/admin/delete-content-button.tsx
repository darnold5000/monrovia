"use client";

export function DeleteContentButton({
  action,
  id,
  title,
  noun,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  title: string;
  noun: string;
}) {
  return (
    <form action={action} onSubmit={(event) => {
      if (!window.confirm(`Delete "${title}"?\n\nThis will permanently remove this ${noun.toLowerCase()} from the website.`)) event.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm font-semibold text-red-300 hover:text-red-200">Delete</button>
    </form>
  );
}
