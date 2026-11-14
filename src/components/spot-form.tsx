"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Spot } from "@/lib/market";
import type { FormMutation } from "./action-state";

const fields = [
  { name: "spotNumber", label: "หมายเลขแผง" },
  { name: "zone", label: "โซน" },
  { name: "spotSize", label: "ขนาดพื้นที่" },
  { name: "locationDescription", label: "รายละเอียดตำแหน่ง" },
  { name: "rentalFee", label: "ค่าเช่าต่อวัน (บาท)" },
] as const;

export default function SpotForm({
  action,
  spot,
}: {
  action: FormMutation;
  spot?: Spot;
}) {
  const [state, submit, pending] = useActionState(action, null);
  const [values, setValues] = useState({
    spotNumber: spot?.spotNumber ?? "",
    zone: spot?.zone ?? "",
    spotSize: spot?.spotSize ?? "",
    locationDescription: spot?.locationDescription ?? "",
    rentalFee: spot ? String(spot.rentalFee) : "",
  });

  return (
    <form action={submit} className="panel mt-5 max-w-xl space-y-4">
      <fieldset disabled={pending} className="space-y-4">
        {fields.map(({ name, label }) => (
          <div key={name}>
            <label htmlFor={name} className="text-sm font-medium">
              {label}
            </label>
            <input
              id={name}
              name={name}
              value={values[name]}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setValues((previous) => ({ ...previous, [name]: value }));
              }}
              required
              type={name === "rentalFee" ? "number" : "text"}
              min={name === "rentalFee" ? 0 : undefined}
              step={name === "rentalFee" ? "any" : undefined}
              className="form-input"
            />
          </div>
        ))}
      </fieldset>
      {state ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
        >
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="button-primary" disabled={pending}>
          {pending ? "กำลังบันทึก…" : "บันทึกข้อมูลพื้นที่"}
        </button>
        <Link href="/admin/spots" className="button-secondary">
          ยกเลิก
        </Link>
      </div>
    </form>
  );
}
