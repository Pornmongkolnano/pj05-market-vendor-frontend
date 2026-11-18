import { getSessionViewer, loginPath } from "@/lib/auth";
import type { Spot } from "@/lib/market";
import { listSpots } from "@/lib/market-data";
import { compareSpots, type SortKey } from "@/lib/spot-sort";
import Pagination from "./pagination";
import SortSelect from "./sort-select";
import SpotCard from "./spot-card";

const PAGE_SIZE = 9; // 3 rows of 3 cards, as in Figma

// Async server component wrapped in <Suspense>.
export default async function SpotCatalog({
  sort,
  page,
  basePath = "/spots",
}: {
  sort: SortKey;
  page: number;
  basePath?: string;
}) {
  const [spots, viewer] = await Promise.all([listSpots(), getSessionViewer()]);

  const sorted = [...spots].sort(compareSpots[sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const shown = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // The action link depends on the viewer's role.
  function action(spot: Spot) {
    if (viewer?.role === "admin") {
      return {
        href: `/admin/spots/${spot._id}/edit`,
        label: "Edit spot",
        icon: "pencil" as const,
      };
    }
    const booking = `/bookings/new?spot=${spot._id}`;
    return {
      href: viewer ? booking : loginPath(booking),
      label: "Book spot",
      icon: "arrow" as const,
    };
  }

  return (
    <div className="flex flex-col gap-[18px]">
      <SortSelect value={sort} />

      {shown.length === 0 ? (
        <p className="rounded-lg border border-line bg-paper p-6 text-sm text-taupe">
          No vendor spots are open yet. Please check back later.
        </p>
      ) : (
        // 1 column on phones, 2 on tablets, 3 on desktop
        <ul className="grid grid-cols-1 gap-x-11 gap-y-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((spot) => {
            const { href, label, icon } = action(spot);
            return (
              <li key={spot._id}>
                <SpotCard
                  spot={spot}
                  actionHref={href}
                  actionLabel={label}
                  actionIcon={icon}
                />
              </li>
            );
          })}
        </ul>
      )}

      <Pagination
        page={current}
        totalPages={totalPages}
        hrefFor={(n) => `${basePath}?sort=${sort}&page=${n}`}
      />
    </div>
  );
}
