"use client";

import Link from "next/link";
import { startTransition, type SubmitEvent, useActionState } from "react";
import type { FormMutation } from "./action-state";

type BookingFormValues = {
  spot: string;
  bookingDate: string;
  productType: string;
};

export default function BookingForm({
  action,
  spots,
  initial,
  cancelPath,
  submitLabel,
}: {
  action: FormMutation;
  spots: { id: string; label: string }[];
  initial: BookingFormValues;
  cancelPath: string;
  submitLabel: string;
}) {
  const [state, submit, pending] = useActionState(action, null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  }

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      className="panel mt-5 max-w-xl space-y-4"
    >
      <fieldset disabled={pending} className="space-y-4">
        <div>
          <label htmlFor="booking-spot" className="text-sm font-medium">
            พื้นที่ขาย
          </label>
          <select
            id="booking-spot"
            name="spot"
            defaultValue={initial.spot}
            required
            className="form-input"
          >
            <option value="" disabled>
              เลือกพื้นที่ขาย
            </option>
            {spots.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="booking-date" className="text-sm font-medium">
            วันที่จอง
          </label>
          <input
            id="booking-date"
            name="bookingDate"
            type="date"
            defaultValue={initial.bookingDate}
            required
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="booking-product" className="text-sm font-medium">
            ประเภทสินค้า
          </label>
          <input
            id="booking-product"
            name="productType"
            defaultValue={initial.productType}
            required
            className="form-input"
          />
        </div>
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
        <button type="submit" disabled={pending} className="button-primary">
          {pending ? "กำลังบันทึก…" : submitLabel}
        </button>
        <Link href={cancelPath} className="button-secondary">
          ยกเลิก
        </Link>
      </div>
    </form>
  );
}
