"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type MutationState, textField } from "@/components/action-state";
import { loginPath, requireViewer } from "@/lib/auth";
import { isObjectId, marketDay } from "@/lib/market";
import { Pj05Error, pj05Data } from "@/lib/pj05";

const errors: Record<string, string> = {
  "Booking date cannot be in the past": "วันที่จองต้องไม่ย้อนหลัง",
  "A valid bookingDate in YYYY-MM-DD format is required":
    "กรุณาเลือกวันที่จองให้ถูกต้อง",
  "Invalid booking date": "กรุณาเลือกวันที่จองให้ถูกต้อง",
  "Member already has a booking for this spot on this date":
    "คุณจองแผงนี้ในวันที่เลือกแล้ว",
  "Vendor spot is already booked on this date": "แผงนี้ถูกจองในวันที่เลือกแล้ว",
  "Member can book at most 3 spots per day": "สมาชิกจองได้สูงสุด 3 แผงต่อวัน",
  "Vendor spot not found or inactive": "พื้นที่นี้ปิดให้จองแล้ว กรุณาเลือกพื้นที่อื่น",
  "Booking not found": "ไม่พบรายการจองนี้",
};

function bookingMutationError(error: unknown, page: string): MutationState {
  if (error instanceof Pj05Error) {
    if (error.status === 401) redirect(loginPath(page));
    if (error.status === 403) redirect("/forbidden");
    if (error.status === 429)
      return { error: "มีคำขอมากเกินไป กรุณาลองใหม่ภายหลัง" };
    if (error.detail && Object.hasOwn(errors, error.detail)) {
      return { error: errors[error.detail] };
    }
  }
  return { error: "บันทึกการจองไม่ได้ กรุณาลองอีกครั้ง" };
}

async function bookingAccount(page: string, role: "member" | "admin") {
  try {
    return await requireViewer(page, role);
  } catch (error) {
    if (error instanceof Pj05Error) return null;
    throw error;
  }
}

function readValues(data: FormData) {
  return {
    spot: textField(data, "spot"),
    bookingDate: textField(data, "bookingDate"),
    productType: textField(data, "productType"),
  };
}

function validateValues(values: ReturnType<typeof readValues>) {
  if (!isObjectId(values.spot) || !values.bookingDate || !values.productType) {
    return "กรุณาเลือกพื้นที่ วันที่จอง และระบุประเภทสินค้า";
  }
  if (values.bookingDate < marketDay()) {
    return errors["Booking date cannot be in the past"];
  }
}

function revalidateBookings() {
  revalidatePath("/bookings");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
}

export async function createBooking(
  _previous: MutationState,
  data: FormData,
): Promise<MutationState> {
  const values = readValues(data);
  const error = validateValues(values);
  if (error) return { error };

  const page = `/bookings/new?spot=${values.spot}`;
  const account = await bookingAccount(page, "member");
  if (!account) return { error: "ตรวจสอบบัญชีไม่ได้ กรุณาลองอีกครั้ง" };
  try {
    await pj05Data("bookings", {
      method: "POST",
      token: account.backendToken,
      body: values,
    });
  } catch (error) {
    return bookingMutationError(error, page);
  }
  revalidateBookings();
  redirect("/bookings?result=created");
}

export async function updateBooking(
  id: string,
  admin: boolean,
  _previous: MutationState,
  data: FormData,
): Promise<MutationState> {
  if (!isObjectId(id)) return { error: "ไม่พบรายการจองนี้" };
  const values = readValues(data);
  const error = validateValues(values);
  if (error) return { error };

  const list = admin ? "/admin/bookings" : "/bookings";
  const page = `${list}/${id}/edit`;
  const account = await bookingAccount(page, admin ? "admin" : "member");
  if (!account) return { error: "ตรวจสอบบัญชีไม่ได้ กรุณาลองอีกครั้ง" };
  try {
    await pj05Data(`bookings/${id}`, {
      method: "PUT",
      token: account.backendToken,
      body: values,
    });
  } catch (error) {
    return bookingMutationError(error, page);
  }
  revalidateBookings();
  redirect(`${list}?result=updated`);
}

export async function deleteBooking(
  id: string,
  admin: boolean,
  _previous: MutationState,
  _data: FormData,
): Promise<MutationState> {
  if (!isObjectId(id)) return { error: "ไม่พบรายการจองนี้" };
  const list = admin ? "/admin/bookings" : "/bookings";
  const account = await bookingAccount(list, admin ? "admin" : "member");
  if (!account) return { error: "ตรวจสอบบัญชีไม่ได้ กรุณาลองอีกครั้ง" };

  try {
    await pj05Data(`bookings/${id}`, {
      method: "DELETE",
      token: account.backendToken,
    });
  } catch (error) {
    return bookingMutationError(error, list);
  }
  revalidateBookings();
  redirect(`${list}?result=deleted`);
}
