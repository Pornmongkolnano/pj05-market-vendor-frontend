"use client";

import Link from "next/link";
import {
  startTransition,
  type SubmitEvent,
  useActionState,
  useState,
} from "react";
import type { Spot } from "@/lib/market";
import type { FormMutation } from "./action-state";

type BookingFormValues = {
  spot: string;
  bookingDate: string;
  productType: string;
};

const marketField =
  "mt-2 block min-h-11 w-full rounded-md border border-line bg-paper px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-dark-wine";
const feeFormat = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

function SpotPreview({ spot }: { spot: Spot | undefined }) {
  return (
    <aside
      aria-labelledby="spot-preview-heading"
      className="overflow-hidden rounded-lg border border-line bg-paper"
    >
      <div className="border-b border-line bg-light-apricot px-5 py-4">
        <h2
          id="spot-preview-heading"
          className="text-sm font-semibold text-dark-wine"
        >
          Spot preview
        </h2>
        {spot ? (
          <p className="mt-1 font-display text-4xl leading-none font-medium wrap-break-word">
            {spot.spotNumber}
          </p>
        ) : null}
      </div>
      {spot ? (
        <dl className="space-y-3 px-5 py-5 text-sm">
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
            <dt className="text-taupe">Zone</dt>
            <dd className="wrap-break-word font-medium">{spot.zone}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
            <dt className="text-taupe">Size</dt>
            <dd className="wrap-break-word font-medium">{spot.spotSize}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-taupe">Location</dt>
            <dd className="wrap-break-word font-medium">
              {spot.locationDescription}
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-4">
            <dt className="text-taupe">Rental fee</dt>
            <dd className="text-lg font-semibold text-dark-wine">
              {feeFormat.format(spot.rentalFee)} THB
              <span className="ml-1 text-xs font-normal text-taupe">
                / night
              </span>
            </dd>
          </div>
        </dl>
      ) : (
        <p className="px-5 py-5 text-sm text-taupe">
          Choose a spot to see its details and rental fee.
        </p>
      )}
    </aside>
  );
}

export default function BookingForm({
  action,
  spots,
  initial,
  cancelPath,
  submitLabel,
}: {
  action: FormMutation;
  spots: Spot[];
  initial: BookingFormValues;
  cancelPath: string;
  submitLabel: string;
}) {
  const [state, submit, pending] = useActionState(action, null);
  const [spotId, setSpotId] = useState(initial.spot);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  }

  const form = (
    <form
      method="post"
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-line bg-paper p-5 sm:p-6"
    >
      <h2 className="font-display text-[28px] leading-tight font-medium">
        Booking details
      </h2>
      <fieldset disabled={pending} className="grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="booking-spot" className="text-sm font-medium">
            Spot
          </label>
          <select
            id="booking-spot"
            name="spot"
            value={spotId}
            onChange={(event) => setSpotId(event.currentTarget.value)}
            required
            className={marketField}
          >
            <option value="" disabled>
              Choose a spot
            </option>
            {spots.map((spot) => (
              <option key={spot._id} value={spot._id}>
                {spot.spotNumber} · {spot.zone}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor="booking-date" className="text-sm font-medium">
            Market date
          </label>
          <input
            id="booking-date"
            name="bookingDate"
            type="date"
            defaultValue={initial.bookingDate}
            required
            className={marketField}
          />
        </div>
        <div className="min-w-0 sm:col-span-2">
          <label htmlFor="booking-product" className="text-sm font-medium">
            Product category
          </label>
          <input
            id="booking-product"
            name="productType"
            defaultValue={initial.productType}
            placeholder="e.g. Food and drinks"
            required
            className={marketField}
          />
        </div>
      </fieldset>
      {state ? (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-3 text-sm text-red-800"
        >
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-md bg-dark-wine px-5 py-2.5 text-sm font-semibold text-paper hover:bg-coffee-bean disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href={cancelPath}
          className="inline-flex min-h-11 items-center rounded-md border border-line px-4 py-2.5 text-sm font-medium hover:bg-linen"
        >
          Cancel
        </Link>
      </div>
    </form>
  );

  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="min-w-0">{form}</div>
      <SpotPreview spot={spots.find((spot) => spot._id === spotId)} />
    </div>
  );
}
