import type { Booking, Spot } from "./market";

function occupancyRow(zone: string) {
  return { zone, active: 0, booked: 0, available: 0 };
}

export function occupancyByZone(
  spots: Spot[],
  bookings: Booking[],
  date: string,
) {
  const bookedSpots = new Set<string>();
  for (const booking of bookings) {
    if (booking.spot && booking.bookingDate.slice(0, 10) === date) {
      bookedSpots.add(booking.spot._id);
    }
  }

  const zones = new Map<string, ReturnType<typeof occupancyRow>>();
  for (const spot of spots) {
    if (!spot.isActive) continue;

    const row = zones.get(spot.zone) ?? occupancyRow(spot.zone);
    row.active += 1;
    if (bookedSpots.has(spot._id)) row.booked += 1;
    else row.available += 1;
    zones.set(spot.zone, row);
  }

  return [...zones.values()];
}
