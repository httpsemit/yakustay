/**
 * Type-safe date parsing utility for Firestore Timestamps and other date formats
 */

export function parseDate(value: unknown): Date {
  if (!value) return new Date();

  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }

  if (value instanceof Date) {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as any).toDate === "function"
  ) {
    return (value as any).toDate(); // Firestore Timestamp
  }

  return new Date();
}
