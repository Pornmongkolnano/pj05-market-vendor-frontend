"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { type MutationState, textField } from "@/components/action-state";
import { loginPath, requireViewer } from "@/lib/auth";
import { isObjectId } from "@/lib/market";
import { Pj05Error, pj05Data } from "@/lib/pj05";

async function adminAccount(page: string) {
  try {
    return await requireViewer(page, "admin");
  } catch (error) {
    if (error instanceof Pj05Error) return null;
    throw error;
  }
}

function failure(error: unknown, page: string): MutationState {
  if (error instanceof Pj05Error) {
    if (error.status === 401) redirect(loginPath(page));
    if (error.status === 403) redirect("/forbidden");
    if (error.status === 404) return { error: "ไม่พบพื้นที่ที่เปิดใช้งาน" };
    if (error.status === 429)
      return { error: "มีคำขอมากเกินไป กรุณาลองใหม่ภายหลัง" };
  }
  return { error: "บันทึกข้อมูลพื้นที่ไม่ได้ กรุณาลองอีกครั้ง" };
}

function refreshSpots() {
  updateTag("spots");
  revalidatePath("/spots");
  revalidatePath("/admin/spots");
  revalidatePath("/admin/dashboard");
}

export async function saveSpot(
  id: string | null,
  _previous: MutationState,
  data: FormData,
): Promise<MutationState> {
  if (id !== null && !isObjectId(id)) return { error: "ไม่พบพื้นที่ที่ต้องการแก้ไข" };

  const spotNumber = textField(data, "spotNumber");
  const zone = textField(data, "zone");
  const spotSize = textField(data, "spotSize");
  const locationDescription = textField(data, "locationDescription");
  const fee = textField(data, "rentalFee");
  const rentalFee = Number(fee);
  if (
    !spotNumber ||
    !zone ||
    (id === null && !spotSize) ||
    !locationDescription ||
    !fee ||
    !Number.isFinite(rentalFee) ||
    rentalFee < 0
  ) {
    return { error: "กรุณากรอกข้อมูลพื้นที่ให้ครบและระบุค่าเช่าตั้งแต่ 0 บาท" };
  }

  const page = id ? `/admin/spots/${id}/edit` : "/admin/spots/new";
  const account = await adminAccount(page);
  if (!account) return { error: "ตรวจสอบบัญชีไม่ได้ กรุณาลองอีกครั้ง" };

  try {
    await pj05Data(id ? `spots/${id}` : "spots", {
      method: id ? "PUT" : "POST",
      token: account.backendToken,
      body: {
        spotNumber,
        zone,
        ...(spotSize ? { spotSize } : {}),
        locationDescription,
        rentalFee,
      },
    });
  } catch (error) {
    return failure(error, page);
  }

  refreshSpots();
  redirect(`/admin/spots?result=${id ? "updated" : "created"}`);
}

export async function deactivateSpot(
  id: string,
  _previous: MutationState,
  _data: FormData,
): Promise<MutationState> {
  if (!isObjectId(id)) return { error: "ไม่พบพื้นที่ที่ต้องการปิด" };
  const page = "/admin/spots";
  const account = await adminAccount(page);
  if (!account) return { error: "ตรวจสอบบัญชีไม่ได้ กรุณาลองอีกครั้ง" };

  try {
    await pj05Data(`spots/${id}`, {
      method: "DELETE",
      token: account.backendToken,
    });
  } catch (error) {
    return failure(error, page);
  }

  refreshSpots();
  redirect(`${page}?result=deactivated`);
}
