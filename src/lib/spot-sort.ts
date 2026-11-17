import type { Spot } from "./market";

// must live outside the "use client" file: values exported from a client
export const sortOptions = {
  alphabetical: "Alphabetical",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  zone: "Zone",
} as const;

export type SortKey = keyof typeof sortOptions;

const bySpotNumber = (a: Spot, b: Spot) =>
  // numeric: true sorts "A2" before "A10"
  a.spotNumber.localeCompare(b.spotNumber, "en", { numeric: true });

export const compareSpots: Record<SortKey, (a: Spot, b: Spot) => number> = {
  alphabetical: bySpotNumber,
  "price-asc": (a, b) => a.rentalFee - b.rentalFee,
  "price-desc": (a, b) => b.rentalFee - a.rentalFee,
  zone: (a, b) => a.zone.localeCompare(b.zone) || bySpotNumber(a, b),
};

export function readSort(value: string | string[] | undefined): SortKey {
  return typeof value === "string" && Object.hasOwn(sortOptions, value)
    ? (value as SortKey)
    : "alphabetical";
}
