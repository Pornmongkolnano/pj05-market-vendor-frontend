import Link from "next/link";
import type { ReactNode } from "react";

export default function BookingPage({
  title,
  backPath,
  backLabel,
  subtitle,
  children,
}: {
  title: string;
  backPath: string;
  backLabel: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main
      lang="en"
      className="mx-auto w-full max-w-[1440px] px-4 pt-8 pb-14 sm:px-8 lg:px-16 lg:pt-10"
    >
      <Link
        href={backPath}
        className="inline-flex min-h-8 items-center gap-1 text-sm font-medium text-taupe hover:text-dark-wine hover:underline"
      >
        <span aria-hidden="true">‹</span>
        {backLabel}
      </Link>
      <h1 className="mt-1 font-display text-[42px] leading-[1.04] font-medium sm:text-[52px]">
        {title}
      </h1>
      {subtitle ? <p className="mt-2 text-sm text-taupe">{subtitle}</p> : null}
      {children}
    </main>
  );
}
