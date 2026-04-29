import type { Room } from "@/lib/firestore";

// ── Types ──────────────────────────────────────────────────────────────────

export interface RoomGroup {
  /** The stable grouping key stored on every Room document */
  roomTypeId: string;
  /** Display name taken from the first room in the group */
  name: string;
  /** Total number of rooms of this type (available) */
  count: number;
  /** All individual rooms belonging to this type */
  rooms: Room[];
  /** Representative room used for UI (image, price, description, amenities) */
  details: Room;
}

// ── Grouping function ──────────────────────────────────────────────────────

/**
 * Transforms a flat array of Room documents into one RoomGroup per
 * unique roomTypeId, ordered by the price of the representative room.
 *
 * Edge cases:
 *  - Rooms without roomTypeId fall back to using their `id` as the key.
 *  - Groups with count === 0 are filtered out automatically.
 */
export function groupRoomsByTypeId(rooms: Room[]): RoomGroup[] {
  const map = new Map<string, RoomGroup>();

  for (const room of rooms) {
    // Fallback: if roomTypeId was not set in Firestore, use the room id so it
    // still appears as a unique entry rather than crashing.
    const key = room.roomTypeId || room.id;

    if (!map.has(key)) {
      map.set(key, {
        roomTypeId: key,
        name:       room.name,
        count:      0,
        rooms:      [],
        details:    room,
      });
    }

    const group = map.get(key)!;
    group.rooms.push(room);
    group.count += 1;
  }

  // Sort groups cheapest-first (same order as the original flat list)
  return Array.from(map.values()).sort(
    (a, b) => a.details.pricePerNight - b.details.pricePerNight
  );
}

// ── Availability label helper ──────────────────────────────────────────────

export function availabilityLabel(count: number): string {
  if (count === 0)  return "Sold Out";
  if (count === 1)  return "1 room available";
  return `${count} rooms available`;
}
