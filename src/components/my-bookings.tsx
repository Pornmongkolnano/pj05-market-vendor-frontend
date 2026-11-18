"use client";

import Link from "next/link";
import { type Ref, useRef, useState } from "react";
import { deleteBooking } from "@/app/bookings/actions";
import { type Booking, marketDay } from "@/lib/market";
import BookingCancelDialog from "./booking-cancel-dialog";
import { CalendarIcon, PinIcon } from "./icons";

// bookingDate is stored as UTC midnight, so read it in UTC to get the day the member picked.
const dayKey = (iso: string) => iso.slice(0, 10); // "2026-12-01"
const longDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const weekdayDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
// createdAt is a real moment in time, so show it in Thai time
const bookedOnLong = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso));
const fee = (amount: number) => `${amount.toLocaleString("en-US")} THB`;

type Tab = "upcoming" | "past";

export default function MyBookings({
  bookings,
  today,
  admin = false,
}: {
  bookings: Booking[];
  today: string; // "YYYY-MM-DD"
  admin?: boolean; // Manage bookings: every member's bookings, with the vendor's name
}) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailsRef = useRef<HTMLElement>(null);

  const upcoming = bookings
    .filter((b) => dayKey(b.bookingDate) >= today)
    .sort((a, b) => a.bookingDate.localeCompare(b.bookingDate));
  const past = bookings
    .filter((b) => dayKey(b.bookingDate) < today)
    .sort((a, b) => b.bookingDate.localeCompare(a.bookingDate));
  const list = tab === "upcoming" ? upcoming : past;

  // If nothing is selected yet, use the first card
  const selected = list.find((b) => b._id === selectedId) ?? list[0];

  function openTab(next: Tab) {
    setTab(next);
    setSelectedId(null);
  }

  function selectBooking(id: string) {
    setSelectedId(id);
    if (window.matchMedia("(min-width: 64rem)").matches) return;

    requestAnimationFrame(() => {
      detailsRef.current?.focus({ preventScroll: true });
      detailsRef.current?.scrollIntoView({ block: "start" });
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <div
        role="tablist"
        className="flex gap-7 border-b border-line pb-3.5 text-sm leading-[1.45]"
      >
        {(
          [
            ["upcoming", `Upcoming (${upcoming.length})`],
            ["past", `Past (${past.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => openTab(key)}
            className={
              tab === key
                ? "cursor-pointer font-bold text-dark-wine underline underline-offset-4"
                : "cursor-pointer text-taupe hover:text-dark-wine"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded-lg border border-line bg-paper p-6 text-sm text-taupe">
          {tab === "upcoming" && admin ? (
            "No upcoming bookings."
          ) : tab === "upcoming" ? (
            <>
              No upcoming bookings.{" "}
              <Link
                href="/spots"
                className="font-medium text-dark-wine underline"
              >
                Find a spot
              </Link>
            </>
          ) : (
            "No past bookings yet."
          )}
        </p>
      ) : (
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_440px]">
          <ul className="flex flex-col gap-[18px]">
            {list.map((booking) => (
              <li key={booking._id}>
                <ReservationCard
                  booking={booking}
                  selected={booking._id === selected?._id}
                  admin={admin}
                  onSelect={() => selectBooking(booking._id)}
                />
              </li>
            ))}
          </ul>
          {selected ? (
            <BookingDetails
              booking={selected}
              canEdit={tab === "upcoming"}
              admin={admin}
              panelRef={detailsRef}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

function ReservationCard({
  booking,
  selected,
  admin,
  onSelect,
}: {
  booking: Booking;
  selected: boolean;
  admin: boolean;
  onSelect: () => void;
}) {
  const { spot } = booking;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full cursor-pointer flex-col overflow-hidden rounded-[7px] border bg-paper text-left transition-colors ${
        selected ? "border-dark-wine" : "border-taupe hover:border-dark-wine"
      }`}
    >
      <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-3 p-[22px]">
        <div className="flex w-[102px] flex-col items-center justify-center rounded-[5px] bg-light-apricot px-2 py-3.5 text-center">
          <span className="font-display text-[32px] leading-[1.1] font-semibold break-all text-dark-wine">
            {spot?.spotNumber ?? "—"}
          </span>
          <span className="text-[9px] leading-[1.45] font-bold tracking-[1.3px] text-taupe">
            {spot?.zone ?? "Spot removed"}
          </span>
        </div>

        <div className="order-last flex min-w-0 basis-full flex-col gap-[7px] text-xs leading-[1.45] text-taupe sm:order-none sm:basis-0 sm:flex-1">
          <p className="flex items-center gap-1.5">
            <PinIcon />
            <span className="min-w-0 break-words">
              {spot
                ? `${spot.locationDescription}  ·  ${spot.spotSize}`
                : "This spot is no longer available"}
            </span>
          </p>
          <p className="break-words">{booking.productType}</p>
          {admin ? (
            <p className="break-words font-medium text-coffee-bean">
              Vendor: {booking.user?.name ?? "Unknown member"}
            </p>
          ) : null}
          {spot && !spot.isActive ? (
            <p className="font-medium text-dark-wine">
              This spot has been closed by the market
            </p>
          ) : null}
        </div>

        {spot ? (
          <div className="ml-auto flex flex-col items-end gap-[3px] leading-[1.45] whitespace-nowrap">
            <span className="text-[23px] font-semibold text-coffee-bean">
              {fee(spot.rentalFee)}
            </span>
            <span className="text-[11px] text-taupe">per night</span>
          </div>
        ) : null}
      </div>

      <div className="flex w-full flex-wrap items-center justify-between gap-2 bg-parchment px-[22px] py-3 text-xs leading-[1.45]">
        <span className="flex items-center gap-[7px] text-taupe">
          <CalendarIcon />
          {dayKey(booking.bookingDate)}
        </span>
        {booking.createdAt ? (
          <span className="text-dark-wine">
            booked on: {marketDay(new Date(booking.createdAt))}
          </span>
        ) : null}
      </div>
    </button>
  );
}

function BookingDetails({
  booking,
  canEdit,
  admin,
  panelRef,
}: {
  booking: Booking;
  canEdit: boolean;
  admin: boolean;
  panelRef: Ref<HTMLElement>;
}) {
  const list = admin ? "/admin/bookings" : "/bookings";
  const { spot } = booking;
  const date = new Date(booking.bookingDate);
  const rows: [string, string][] = [
    ["SPOT", spot ? `${spot.spotNumber} · ${spot.zone}` : "Spot removed"],
    ["MARKET DATE", weekdayDate.format(date)],
    ["PRODUCT CATEGORY", booking.productType],
    ["VENDOR", booking.user?.name ?? "—"],
  ];

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      aria-label="Booking details"
      className="scroll-mt-36 overflow-hidden rounded-lg border border-line bg-paper lg:sticky lg:top-24"
    >
      <div className="flex flex-col gap-2.5 bg-dark-wine px-[26px] py-6">
        <p className="text-[10px] leading-[1.45] font-bold tracking-[1.4px] text-light-apricot">
          BOOKING DETAILS
        </p>
        <h2 className="font-display text-[32px] leading-[1.1] font-medium break-words text-light-apricot">
          {spot?.spotNumber ?? "—"} · {longDate.format(date)}
        </h2>
        {booking.createdAt ? (
          <p className="text-[11px] leading-[1.45] text-blush">
            Booked on: {bookedOnLong(booking.createdAt)}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-[19px] px-[26px] py-6">
        <dl className="flex flex-col gap-[19px]">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 leading-[1.45]"
            >
              <dt className="text-[10px] font-bold text-taupe">{label}</dt>
              <dd className="text-right text-[13px] font-medium break-words">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <hr className="border-line" />

        <div className="flex items-center justify-between leading-[1.45]">
          <span className="text-sm font-medium">Total rental fee</span>
          <span className="text-[23px] font-semibold text-dark-wine">
            {spot ? fee(spot.rentalFee) : "—"}
          </span>
        </div>

        <div className="flex flex-wrap justify-between gap-3">
          {canEdit ? (
            <Link
              href={`${list}/${booking._id}/edit`}
              className="inline-flex min-h-11 items-center rounded-[5px] bg-dark-wine px-4 text-[13px] font-semibold text-paper hover:bg-coffee-bean"
            >
              Edit booking
            </Link>
          ) : null}
          <BookingCancelDialog
            key={booking._id}
            action={deleteBooking.bind(null, booking._id, admin)}
            bookingDate={booking.bookingDate}
            spotNumber={spot?.spotNumber}
          />
        </div>
      </div>
    </aside>
  );
}
