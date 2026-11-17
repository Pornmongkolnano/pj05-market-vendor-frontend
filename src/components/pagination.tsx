import Link from "next/link";
import { ChevronIcon } from "./icons";

// Page links, each one is a normal link to ?page=N.
export default function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pages" className="flex items-center justify-end gap-1.5">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} aria-label="Previous page">
          <ChevronIcon direction="left" />
        </Link>
      ) : null}
      {pages.map((n) => (
        <Link
          key={n}
          href={hrefFor(n)}
          aria-current={n === page ? "page" : undefined}
          className={`rounded-[5px] border px-3 py-1.5 text-[13px] leading-[1.45] font-semibold ${
            n === page
              ? "border-dark-wine bg-dark-wine text-paper"
              : "border-line bg-paper hover:border-dark-wine"
          }`}
        >
          {n}
        </Link>
      ))}
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} aria-label="Next page">
          <ChevronIcon direction="right" />
        </Link>
      ) : null}
    </nav>
  );
}
