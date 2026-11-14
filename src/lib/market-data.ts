import "server-only";

import { notFound, redirect } from "next/navigation";
import { loginPath } from "./auth";
import { type Booking, isObjectId, type Spot } from "./market";
import { Pj05Error, pj05Data } from "./pj05";

export function listSpots() {
  return pj05Data<Spot[]>("spots");
}

export async function readSpot(id: string) {
  if (!isObjectId(id)) notFound();
  try {
    return await pj05Data<Spot>(`spots/${id}`);
  } catch (error) {
    if (error instanceof Pj05Error && error.status === 404) notFound();
    throw error;
  }
}

export async function listBookings(token: string, page: string) {
  try {
    return await pj05Data<Booking[]>("bookings", { token });
  } catch (error) {
    handleBookingReadError(error, page);
  }
}

export async function readBooking(id: string, token: string, page: string) {
  if (!isObjectId(id)) notFound();
  try {
    return await pj05Data<Booking>(`bookings/${id}`, { token });
  } catch (error) {
    handleBookingReadError(error, page);
  }
}

function handleBookingReadError(error: unknown, page: string): never {
  if (error instanceof Pj05Error) {
    if (error.status === 401) redirect(loginPath(page));
    if (error.status === 403) redirect("/forbidden");
    if (error.status === 404) notFound();
  }
  throw error;
}
