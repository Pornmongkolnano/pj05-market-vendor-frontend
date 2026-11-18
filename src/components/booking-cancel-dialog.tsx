"use client";

import { useActionState, useId, useRef } from "react";
import type { FormMutation } from "./action-state";

const marketDate = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeZone: "UTC",
});

export default function BookingCancelDialog({
  action,
  bookingDate,
  spotNumber,
}: {
  action: FormMutation;
  bookingDate: string;
  spotNumber?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [state, submit, pending] = useActionState(action, null);
  const date = marketDate.format(new Date(bookingDate));

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="min-h-11 rounded-md border border-dark-wine px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-dark-wine hover:bg-dark-wine hover:text-paper"
      >
        Cancel booking
      </button>
      <dialog
        ref={dialog}
        lang="en"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
        className="fixed inset-0 m-auto max-h-[calc(100vh_-_2rem)] w-[calc(100%_-_2rem)] max-w-[520px] overflow-y-auto rounded-lg border border-line bg-paper p-6 text-coffee-bean shadow-xl backdrop:bg-coffee-bean/55 sm:p-8"
      >
        <form action={submit} className="space-y-4">
          <h2
            id={titleId}
            className="font-display text-[36px] leading-tight font-medium"
          >
            Cancel this booking?
          </h2>
          <p id={descriptionId} className="text-sm leading-relaxed text-taupe">
            {spotNumber ? `Spot ${spotNumber} · ${date}.` : `${date}.`} This
            will release the spot for that date and cannot be undone.
          </p>
          {state ? (
            <p
              role="alert"
              className="rounded-md bg-red-50 p-3 text-sm text-red-800"
            >
              {state.error}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-4">
            <button
              type="button"
              disabled={pending}
              onClick={() => dialog.current?.close()}
              className="min-h-11 rounded-md border border-line px-4 py-2.5 text-sm font-medium hover:bg-linen disabled:opacity-60"
            >
              Keep booking
            </button>
            <button
              type="submit"
              disabled={pending}
              className="min-h-11 rounded-md bg-dark-wine px-4 py-2.5 text-sm font-semibold text-paper hover:bg-coffee-bean disabled:opacity-60"
            >
              {pending ? "Cancelling…" : "Cancel booking"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
