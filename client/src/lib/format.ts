export function formatMoney(min?: number | null, max?: number | null, currency = "INR") {
  if (!min && !max) return "Salary not disclosed";

  const format = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      notation: value >= 100000 ? "compact" : "standard",
      maximumFractionDigits: 1
    }).format(value);

  if (min && max) return format(min) + " ? " + format(max);
  return format(min ?? max ?? 0);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function relativeDate(value: string) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86400000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return days + "d ago";
  if (days < 30) return Math.floor(days / 7) + "w ago";
  return formatDate(value);
}

export function readableEnum(value: string) {
  return value.replace(/_/g, " ").toLocaleLowerCase().replace(/\b\w/g, (letter) => letter.toLocaleUpperCase());
}
