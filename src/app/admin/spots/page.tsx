import Link from "next/link";
import { Suspense } from "react";
import { PlusCircleIcon } from "@/components/icons";
import SpotCatalog from "@/components/spot-catalog";
import { requireViewer } from "@/lib/auth";
import { readPage, readSort } from "@/lib/spot-sort";

const notices: Record<string, string> = {
  created: "New spot added.",
  updated: "Spot changes saved.",
  deactivated: "Spot deleted. Members can no longer book it.",
};

export default async function AdminSpotsPage({
  searchParams,
}: PageProps<"/admin/spots">) {
  // Admins only: guests go to /login, members to /forbidden
  await requireViewer("/admin/spots", "admin");

  const params = await searchParams;
  const sort = readSort(params.sort);
  const page = readPage(params.page);
  const notice =
    typeof params.result === "string" && Object.hasOwn(notices, params.result)
      ? notices[params.result]
      : null;

  return (
    <main className="flex flex-col gap-2.5 px-4 pt-8 pb-[15px] sm:px-8 lg:px-10">
      {notice ? (
        <p
          role="status"
          className="mb-2 rounded-md bg-linen px-[18px] py-3 text-sm font-medium text-dark-wine"
        >
          {notice}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[32px] leading-[1.1] font-medium">
          All active spots
        </h1>
        <Link
          href="/admin/spots/new"
          className="flex items-center gap-[9px] rounded-[5px] border border-line bg-paper px-4 py-[11px] text-[13px] leading-[1.45] font-semibold transition-colors hover:border-dark-wine hover:bg-dark-wine hover:text-paper"
        >
          <PlusCircleIcon size={19} />
          Add new spot
        </Link>
      </div>

      {/* Same catalog as Explore spots. For an admin each card says "Edit spot". */}
      <Suspense
        key={`${sort}-${page}`}
        fallback={
          <p className="py-16 text-center text-sm text-taupe">
            Loading vendor spots…
          </p>
        }
      >
        <SpotCatalog sort={sort} page={page} basePath="/admin/spots" />
      </Suspense>
    </main>
  );
}
