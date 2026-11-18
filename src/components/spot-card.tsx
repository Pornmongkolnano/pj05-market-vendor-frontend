import Link from "next/link";
import type { Spot } from "@/lib/market";
import { ArrowRightIcon, GridIcon, PencilIcon, PinIcon } from "./icons";

export default function SpotCard({
  spot,
  actionHref,
  actionLabel,
  actionIcon = "arrow",
}: {
  spot: Spot;
  // A label without a link draws the action in the vendor preview.
  actionHref?: string;
  actionLabel?: string;
  actionIcon?: "arrow" | "pencil";
}) {
  const buttonClass =
    "flex items-center gap-[9px] rounded-[5px] border border-line bg-paper px-4 py-[11px] text-[13px] leading-[1.45] font-semibold whitespace-nowrap transition-colors";
  const icon = actionIcon === "pencil" ? <PencilIcon /> : <ArrowRightIcon />;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-paper transition-colors hover:border-dark-wine">
      <header className="flex flex-col gap-0.5 bg-light-apricot px-[22px] py-[17px]">
        <h3 className="font-display text-[38px] leading-[1.1] font-semibold break-words text-dark-wine">
          {spot.spotNumber}
        </h3>
        <p className="text-[10px] leading-[1.45] font-medium tracking-[0.5px]">
          {spot.zone}
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-3.5 px-[22px] py-5">
        <p className="flex items-center gap-[7px] text-sm leading-[1.45] font-medium">
          <PinIcon />
          <span className="min-w-0 break-words">
            {spot.locationDescription}
          </span>
        </p>
        <p className="flex items-center gap-1.5 text-xs leading-[1.45] text-taupe">
          <GridIcon />
          {spot.spotSize}
        </p>

        <hr className="mt-auto border-line" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-baseline gap-1 leading-[1.45] whitespace-nowrap">
            <span className="text-[23px] font-semibold">
              {spot.rentalFee.toLocaleString("en-US")} THB
            </span>
            <span className="text-[11px] text-taupe">/ night</span>
          </p>
          {actionHref && actionLabel ? (
            <Link
              href={actionHref}
              aria-label={`${actionLabel} ${spot.spotNumber}`}
              className={`${buttonClass} group-hover:border-dark-wine group-hover:bg-dark-wine group-hover:text-paper`}
            >
              {actionLabel}
              {icon}
            </Link>
          ) : actionLabel ? (
            <span aria-hidden="true" className={buttonClass}>
              {actionLabel}
              {icon}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
