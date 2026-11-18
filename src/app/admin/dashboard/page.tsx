import type { Metadata } from "next";
import Link from "next/link";
import { ScubiduPapaLayout } from "@/components/scubidupapa";
import { requireViewer } from "@/lib/auth";
import { listBookings, listSpots } from "@/lib/market-data";
import { occupancyByZone } from "@/lib/occupancy";
import "./dashboard.css";

export const metadata: Metadata = { title: "Market dashboard | ScubiduPapa" };
const dashboard = "/admin/dashboard";
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeZone: "UTC",
});

function zoneLabel(zone: string) {
  return /^[a-z]$/i.test(zone) ? `Zone ${zone}` : zone;
}

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
  const metrics = [
    { key: "active", label: "Active spots", value: totals.active },
    { key: "booked", label: "Booked", value: totals.booked },
    { key: "available", label: "Available", value: totals.available },
  ];

  return (
    <ScubiduPapaLayout>
      <main className="market-dashboard-content">
        <div className="market-dashboard-heading">
          <Link href="/admin" className="market-dashboard-back-link">
            <span aria-hidden="true">‹</span> Market management
          </Link>
          <h1>Market dashboard</h1>
        </div>
        <form action={dashboard} className="market-dashboard-filters">
          <div className="market-field market-dashboard-date-field">
            <label htmlFor="dashboard-date">Date</label>
            <input
              type="date"
              name="date"
              id="dashboard-date"
              defaultValue={date}
              required
              className="market-control"
            />
          </div>
          <div className="market-field market-dashboard-zone-field">
            <label htmlFor="dashboard-zone">Zone</label>
            <div className="market-dashboard-select-control">
              <select
                name="zone"
                id="dashboard-zone"
                defaultValue={zone}
                className="market-control"
              >
                <option value="">All zones</option>
                {zones.map((entry) => (
                  <option key={entry.zone} value={entry.zone}>
                    {zoneLabel(entry.zone)}
                  </option>
                ))}
              </select>
              <span aria-hidden="true">▾</span>
            </div>
          </div>
          <button type="submit" className="market-primary-action">
            Show results
          </button>
        </form>

        <section
          className="market-dashboard-summary"
          aria-labelledby="occupancy-heading"
        >
          <h2 id="occupancy-heading">
            {dateFormat.format(new Date(date))} ·{" "}
            {zone ? zoneLabel(zone) : "All zones"}
          </h2>
          <dl className="market-dashboard-metrics">
            {metrics.map(({ key, label, value }) => (
              <div
                key={key}
                className="market-dashboard-metric"
                data-metric={key}
              >
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="market-dashboard-summary-note">
            Totals include currently active spots.
          </p>
        </section>

        <section
          className="market-dashboard-zone-summary"
          aria-labelledby="zone-heading"
        >
          <h2 id="zone-heading">Occupancy by zone</h2>
          {rows.length === 0 ? (
            <p>There are no active spots.</p>
          ) : (
            <div className="market-dashboard-table-frame">
              <table
                className="market-dashboard-table"
                aria-labelledby="zone-heading"
              >
                <thead>
                  <tr>
                    <th scope="col">Zone</th>
                    <th scope="col">Active spots</th>
                    <th scope="col">Booked</th>
                    <th scope="col">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.zone}>
                      <th scope="row">{zoneLabel(row.zone)}</th>
                      <td>{row.active}</td>
                      <td>{row.booked}</td>
                      <td>{row.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </ScubiduPapaLayout>
  );
}
