import { ClockIcon, PinIcon } from "./icons";

export default function MarketIntro() {
  return (
    <section className="flex flex-wrap items-center justify-between gap-6 bg-coffee-bean px-4 pt-[34px] pb-[38px] sm:px-8 lg:px-16">
      <div className="flex flex-col gap-3.5 text-light-apricot">
        <p className="text-[11px] leading-[1.45] font-bold tracking-[2px]">
          GOOD NIGHTS. GREAT OPPORTUNITIES.
        </p>
        <h1 className="font-display text-[38px] leading-[1.05] font-medium sm:text-[54px]">
          A little space
          <br />A lot of possibilities
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-display text-2xl leading-[1.05] font-medium text-light-apricot">
          ScubiduPapa Market
        </p>
        <p className="flex items-center gap-2 text-[13px] leading-[1.45] text-tan">
          <PinIcon size={17} />
          Chulalongkorn University, Bangkok
        </p>
        <p className="flex items-center gap-2 text-[13px] leading-[1.45] whitespace-pre text-tan">
          <ClockIcon size={17} />
          17:00 – 23:00 · Every evening
        </p>
      </div>
    </section>
  );
}
