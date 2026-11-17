"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type SortKey, sortOptions } from "@/lib/spot-sort";
import { ChevronIcon } from "./icons";

export default function SortSelect({ value }: { value: SortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function change(next: string) {
    const params = new URLSearchParams(searchParams);
    params.set("sort", next);
    params.delete("page");
    router.push(`${pathname}?${params}`);
  }

  return (
    <label className="relative flex w-fit items-center gap-2 text-xs leading-[1.45] font-medium">
      Sort:
      <select
        value={value}
        onChange={(event) => change(event.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-6 font-medium focus-visible:outline-2 focus-visible:outline-dark-wine"
      >
        {Object.entries(sortOptions).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <ChevronIcon
        direction="down"
        className="pointer-events-none absolute right-0"
      />
    </label>
  );
}
