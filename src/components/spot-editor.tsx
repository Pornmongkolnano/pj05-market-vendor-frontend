"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Spot } from "@/lib/market";
import type { FormMutation } from "./action-state";
import DeleteSpotDialog from "./delete-spot-dialog";
import { ArrowLeftIcon, LockIcon } from "./icons";
import SpotCard from "./spot-card";

// size pattern formatter: "width × length" in metres
const sizePattern = /^\s*(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i;

function splitSize(spotSize: string) {
  const match = spotSize.match(sizePattern);
  return match
    ? { width: match[1], length: match[2] }
    : { width: "", length: "" };
}

const joinSize = (width: string, length: string) => `${width} × ${length} m`;
const positive = (value: string) => value !== "" && Number(value) > 0;

const inputBox =
  "flex items-center gap-2 rounded-[5px] border border-line bg-paper px-[13px] py-3 text-[13px] leading-[1.45] focus-within:border-dark-wine";
const lockedBox =
  "flex items-center justify-between gap-2 rounded-[5px] border border-line bg-[#f2eee7] px-[13px] py-3 text-[13px] leading-[1.45] text-taupe";
const labelText = "text-xs leading-[1.45] font-medium";

export default function SpotEditor({
  spot,
  saveAction,
  deleteAction,
}: {
  spot?: Spot; // missing = "Add new spot", present = "Edit spot"
  saveAction: FormMutation;
  deleteAction?: FormMutation;
}) {
  const [state, submit, pending] = useActionState(saveAction, null);

  const initial = {
    spotNumber: spot?.spotNumber ?? "",
    zone: spot?.zone ?? "",
    rentalFee: spot ? String(spot.rentalFee) : "",
    ...splitSize(spot?.spotSize ?? ""),
    locationDescription: spot?.locationDescription ?? "",
  };
  const [values, setValues] = useState(initial);
  type Field = keyof typeof values;

  function update(field: Field, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  const complete =
    values.spotNumber.trim() !== "" &&
    values.zone.trim() !== "" &&
    values.locationDescription.trim() !== "" &&
    values.rentalFee !== "" &&
    Number(values.rentalFee) >= 0 &&
    positive(values.width) &&
    positive(values.length);
  const changed = (Object.keys(initial) as Field[]).some(
    (field) => values[field] !== initial[field],
  );
  // "Add" needs a complete form. "Save changes" also needs something to have changed.
  const canSubmit = complete && (spot ? changed : true) && !pending;

  const area =
    positive(values.width) && positive(values.length)
      ? `${Number((Number(values.width) * Number(values.length)).toFixed(2))} m²`
      : "–";

  // What the vendor card on Explore spots will look like
  const preview: Spot = {
    _id: spot?._id ?? "preview",
    spotNumber: values.spotNumber || "Spot number",
    zone: values.zone || "Zone",
    spotSize:
      positive(values.width) && positive(values.length)
        ? joinSize(values.width, values.length)
        : "Width × length",
    locationDescription: values.locationDescription || "Location description",
    rentalFee: Number(values.rentalFee) || 0,
    isActive: true,
  };

  return (
    <main className="flex flex-col gap-7 px-4 pt-7 pb-9 sm:px-8 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-[9px]">
          <Link
            href="/admin/spots"
            className="flex w-fit items-center gap-[7px] text-xs leading-[1.45] text-taupe hover:text-dark-wine"
          >
            <ArrowLeftIcon />
            All vendor spots
          </Link>
          <h1 className="font-display text-[42px] leading-[1.1] font-medium break-words">
            {spot ? `Edit spot ${spot.spotNumber}` : "Add new spot"}
          </h1>
        </div>

        <div className="flex gap-2.5">
          <Link
            href="/admin/spots"
            className="rounded-[5px] border border-line bg-paper px-[17px] py-[11px] text-[13px] leading-[1.45] font-semibold hover:border-dark-wine"
          >
            Cancel
          </Link>
          {/* form="spot-form" lets a button outside the <form> submit it */}
          <button
            type="submit"
            form="spot-form"
            disabled={!canSubmit}
            className="cursor-pointer rounded-[5px] bg-dark-wine px-[17px] py-[11px] text-[13px] leading-[1.45] font-semibold text-paper hover:bg-coffee-bean disabled:cursor-not-allowed disabled:bg-[#f2eee7] disabled:text-taupe"
          >
            {pending ? "Saving…" : spot ? "Save changes" : "Add"}
          </button>
        </div>
      </div>

      <div className="border-b border-line pb-3.5 text-[13px] leading-[1.45] font-bold text-dark-wine">
        Spot details
      </div>

      {state ? (
        <p
          role="alert"
          className="rounded-md border border-[#dabeb0] bg-paper px-[18px] py-3 text-sm text-dark-wine"
        >
          {state.error}
        </p>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,840px)_minmax(0,480px)]">
        <div className="flex flex-col gap-5">
          <form id="spot-form" action={submit} className="flex flex-col gap-5">
            {/* The server action reads spotSize, so send width × length as one field */}
            <input
              type="hidden"
              name="spotSize"
              value={joinSize(values.width, values.length)}
            />

            <section className="flex flex-col gap-5 rounded-[7px] border border-line bg-paper p-6">
              <SectionHeading number="01" title="Spot information" />

              <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-14">
                <Field label="Spot number *" htmlFor="spotNumber">
                  <div className={inputBox}>
                    <input
                      id="spotNumber"
                      name="spotNumber"
                      required
                      value={values.spotNumber}
                      onChange={(e) => update("spotNumber", e.target.value)}
                      placeholder="A01"
                      className="min-w-0 flex-1 bg-transparent outline-none"
                    />
                  </div>
                </Field>
                {spot ? (
                  <div className="flex flex-col gap-[7px]">
                    <span className={labelText}>Spot ID</span>
                    <div className={lockedBox}>
                      <span className="truncate">{spot._id}</span>
                      <LockIcon size={16} />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-14">
                <Field label="Zone *" htmlFor="zone">
                  <div className={inputBox}>
                    <input
                      id="zone"
                      name="zone"
                      required
                      value={values.zone}
                      onChange={(e) => update("zone", e.target.value)}
                      placeholder="Food zone"
                      className="min-w-0 flex-1 bg-transparent outline-none"
                    />
                  </div>
                </Field>
                <Field label="Rental fee *" htmlFor="rentalFee">
                  <div className={inputBox}>
                    <input
                      id="rentalFee"
                      name="rentalFee"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      required
                      value={values.rentalFee}
                      onChange={(e) => update("rentalFee", e.target.value)}
                      placeholder="300"
                      className="min-w-0 flex-1 bg-transparent outline-none"
                    />
                    <span className="text-[11px] text-taupe">THB / night</span>
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-[repeat(3,minmax(0,220px))]">
                {(["width", "length"] as const).map((field) => (
                  <Field
                    key={field}
                    label={field === "width" ? "Width *" : "Length *"}
                    htmlFor={field}
                  >
                    <div className={inputBox}>
                      <input
                        id={field}
                        type="number"
                        inputMode="decimal"
                        min={0.1}
                        step="any"
                        required
                        value={values[field]}
                        onChange={(e) => update(field, e.target.value)}
                        placeholder="3"
                        className="min-w-0 flex-1 bg-transparent outline-none"
                      />
                      <span className="text-[11px] text-taupe">metres</span>
                    </div>
                  </Field>
                ))}
                <div className="flex flex-col gap-[7px]">
                  <span className={labelText}>Total area</span>
                  <div className={lockedBox}>
                    {area}
                    <LockIcon size={16} />
                  </div>
                </div>
              </div>

              {spot && !sizePattern.test(spot.spotSize) ? (
                <p className="text-[11px] leading-[1.45] text-dark-wine">
                  The saved size “{spot.spotSize}” is not in “width × length”
                  form. Enter the width and length again.
                </p>
              ) : null}
              <p className="text-[11px] leading-[1.45] text-taupe">
                The spot ID is assigned automatically and cannot be changed.
              </p>
            </section>

            <section className="flex flex-col gap-5 rounded-[7px] border border-line bg-paper p-6">
              <SectionHeading number="02" title="Location" />
              <Field
                label="Location description *"
                htmlFor="locationDescription"
              >
                <div className={inputBox}>
                  <input
                    id="locationDescription"
                    name="locationDescription"
                    required
                    value={values.locationDescription}
                    onChange={(e) =>
                      update("locationDescription", e.target.value)
                    }
                    placeholder="Near the main entrance"
                    className="min-w-0 flex-1 bg-transparent outline-none"
                  />
                </div>
                <span className="text-[11px] leading-[1.45] text-taupe">
                  Help vendors picture exactly where they’ll be.
                </span>
              </Field>
            </section>
          </form>

          {spot && deleteAction ? (
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-[#dabeb0] px-[22px] py-5">
              <div className="flex flex-col gap-[5px]">
                <h2 className="font-display text-lg leading-[1.1] font-medium text-dark-wine">
                  Delete this spot
                </h2>
                <p className="text-[11px] leading-[1.45] text-taupe">
                  Deleted spot will become inaccessible for users and admins.
                </p>
              </div>
              <DeleteSpotDialog
                spotNumber={spot.spotNumber}
                action={deleteAction}
              />
            </section>
          ) : null}
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
          <div className="flex flex-col gap-[5px] leading-[1.45]">
            <p className="text-[10px] font-bold tracking-[1.2px] text-dark-wine">
              VENDOR PREVIEW
            </p>
            <p className="text-xs text-taupe">
              How the spot will be shown in the marketplace.
            </p>
          </div>
          <SpotCard spot={preview} actionLabel="Book spot" />
        </aside>
      </div>
    </main>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="flex items-center gap-3">
      <span className="text-[11px] leading-[1.45] font-bold text-dark-wine">
        {number}
      </span>
      <span className="font-display text-[23px] leading-[1.1] font-medium">
        {title}
      </span>
    </h2>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[7px]">
      <label htmlFor={htmlFor} className={labelText}>
        {label}
      </label>
      {children}
    </div>
  );
}
