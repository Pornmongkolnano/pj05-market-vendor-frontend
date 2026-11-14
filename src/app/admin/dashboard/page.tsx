import type { Metadata } from "next";
import Link from "next/link";
import { requireViewer } from "@/lib/auth";
import { formatBookingDate } from "@/lib/market";
import { listBookings, listSpots } from "@/lib/market-data";
import { occupancyByZone } from "@/lib/occupancy";

export const metadata: Metadata = { title: "แดชบอร์ดตลาด" };
const dashboard = "/admin/dashboard";

function selectedDate(param: string | string[] | undefined) {
  if (typeof param === "string" && /^\d{4}-\d{2}-\d{2}$/.test(param)) {
    const day = new Date(`${param}T00:00:00.000Z`);
    if (
      !Number.isNaN(day.getTime()) &&
      day.toISOString().slice(0, 10) === param
    ) {
      return param;
    }
  }
  return new Date().toISOString().slice(0, 10);
}

export default async function DashboardPage({
  searchParams,
}: PageProps<"/admin/dashboard">) {
  const params = await searchParams;
  const date = selectedDate(params.date);
  const requestedZone = typeof params.zone === "string" ? params.zone : "";
  const query = new URLSearchParams({ date });
  if (requestedZone) query.set("zone", requestedZone);
  const path = `${dashboard}?${query}`;

  const { backendToken } = await requireViewer(path, "admin");
  const [spots, bookings] = await Promise.all([
    listSpots(),
    listBookings(backendToken, path),
  ]);
  const zones = occupancyByZone(spots, bookings, date);
  const zone = zones.some((entry) => entry.zone === requestedZone)
    ? requestedZone
    : "";
  const rows = zone ? zones.filter((entry) => entry.zone === zone) : zones;
  const totals = rows.reduce(
    (total, row) => ({
      active: total.active + row.active,
      booked: total.booked + row.booked,
      available: total.available + row.available,
    }),
    { active: 0, booked: 0, available: 0 },
  );

  return (
    <main className="page-shell">
      <Link href="/admin" className="text-link text-sm">
        กลับหน้าจัดการตลาด
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">แดชบอร์ดตลาด</h1>
      <form
        action={dashboard}
        className="panel mt-5 flex flex-wrap items-end gap-3"
      >
        <div>
          <label htmlFor="dashboard-date" className="text-sm font-medium">
            วันที่
          </label>
          <input
            type="date"
            name="date"
            id="dashboard-date"
            defaultValue={date}
            required
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="dashboard-zone" className="text-sm font-medium">
            โซน
          </label>
          <select
            name="zone"
            id="dashboard-zone"
            defaultValue={zone}
            className="form-input"
          >
            <option value="">ทุกโซน</option>
            {zones.map((entry) => (
              <option key={entry.zone} value={entry.zone}>
                {entry.zone}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="button-primary">
          แสดงผล
        </button>
      </form>

      <section className="mt-7" aria-labelledby="occupancy-heading">
        <h2 id="occupancy-heading" className="text-xl font-semibold">
          {formatBookingDate(date)} · {zone ? `โซน ${zone}` : "ทุกโซน"}
        </h2>
        <dl className="mt-3 grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { label: "แผงเปิดใช้", value: totals.active },
            { label: "ถูกจอง", value: totals.booked },
            { label: "แผงว่าง", value: totals.available },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-3 sm:p-5"
            >
              <dt className="text-sm text-slate-600">{label}</dt>
              <dd className="mt-1 text-3xl font-semibold tabular-nums">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-slate-600">
          ยอดคำนวณจากแผงที่เปิดใช้อยู่ในปัจจุบัน
        </p>

        {rows.length === 0 ? (
          <p className="mt-5">ยังไม่มีพื้นที่เปิดใช้งาน</p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm tabular-nums">
              <caption className="sr-only">จำนวนแผงตามโซนและวันที่เลือก</caption>
              <thead className="border-b border-slate-200 bg-slate-100">
                <tr>
                  <th scope="col" className="p-3 text-left">
                    โซน
                  </th>
                  <th scope="col" className="whitespace-nowrap p-3 text-right">
                    เปิดใช้
                  </th>
                  <th scope="col" className="whitespace-nowrap p-3 text-right">
                    ถูกจอง
                  </th>
                  <th scope="col" className="whitespace-nowrap p-3 text-right">
                    ว่าง
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((row) => (
                  <tr key={row.zone}>
                    <th scope="row" className="wrap-break-word p-3 text-left">
                      {row.zone}
                    </th>
                    <td className="p-3 text-right">{row.active}</td>
                    <td className="p-3 text-right">{row.booked}</td>
                    <td className="p-3 text-right">{row.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
