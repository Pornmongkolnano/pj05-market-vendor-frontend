import { Suspense } from "react";
import { InfoIcon } from "@/components/icons";
import MarketIntro from "@/components/market-intro";
import SpotCatalog from "@/components/spot-catalog";
import { readSort } from "@/lib/spot-sort";

function readPage(value: string | string[] | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function SpotsPage({ searchParams }: PageProps<"/spots">) {
  const params = await searchParams;
  const sort = readSort(params.sort);
  const page = readPage(params.page);

  return (
    <main>
      <MarketIntro />

      <section className="flex flex-col gap-2.5 px-4 pt-8 pb-[15px] sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-[32px] leading-[1.1] font-medium">
            Find your spot
          </h2>
          <p className="text-xs leading-[1.45] whitespace-pre text-taupe">
            Open daily · Setup from 15:00
          </p>
        </div>

        <Suspense
          key={`${sort}-${page}`}
          fallback={
            <p className="py-16 text-center text-sm text-taupe">
              Loading vendor spots…
            </p>
          }
        >
          <SpotCatalog sort={sort} page={page} />
        </Suspense>

        <aside className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-linen px-[18px] py-[15px] text-xs leading-[1.45]">
          <InfoIcon className="text-dark-wine" />
          <span className="font-bold text-dark-wine">Plan your night:</span>
          <span className="text-taupe">
            Book up to 3 spots per day. One booking per spot, per day. Choose
            today or a future date.
          </span>
        </aside>
      </section>
    </main>
  );
}
