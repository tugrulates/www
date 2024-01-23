export function formatDate(date?: Date): string | undefined {
  if (date === undefined) {
    return undefined;
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
