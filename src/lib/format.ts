export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatTournamentDates(start: string, end: string): string {
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);

  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) {
    return [start, end].filter(Boolean).join(" – ");
  }

  const fullDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const monthAndDay = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  });
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();
  const sameDay = sameMonth && startDate.getDate() === endDate.getDate();

  if (sameDay) return fullDate.format(startDate);

  if (sameMonth) {
    return `${monthAndDay.format(startDate)}–${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  if (sameYear) {
    return `${monthAndDay.format(startDate)}–${fullDate.format(endDate)}`;
  }

  return `${fullDate.format(startDate)}–${fullDate.format(endDate)}`;
}
