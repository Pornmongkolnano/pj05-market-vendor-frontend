import { deleteBooking, updateBooking } from "@/app/bookings/actions";
import { requireViewer } from "@/lib/auth";
import { listSpots, readBooking } from "@/lib/market-data";
import AdminBookingDelete from "./admin-booking-delete";
import BookingForm from "./booking-form";
import BookingPage from "./booking-page";

export default async function EditBooking({
  id,
  admin,
}: {
  id: string;
  admin: boolean;
}) {
  const list = admin ? "/admin/bookings" : "/bookings";
  const page = `${list}/${id}/edit`;
  const { backendToken } = await requireViewer(
    page,
    admin ? "admin" : "member",
  );
  const [booking, spots] = await Promise.all([
    readBooking(id, backendToken, page),
    listSpots(),
  ]);
  const selectedSpot = spots.find((spot) => spot._id === booking.spot?._id);
  const initial = {
    spot: selectedSpot?._id ?? "",
    bookingDate: booking.bookingDate.slice(0, 10),
    productType: booking.productType,
  };
  const action = updateBooking.bind(null, id, admin);

  return (
    <BookingPage
      title="Edit booking"
      backPath={list}
      backLabel={admin ? "Manage bookings" : "My bookings"}
      subtitle={
        admin && booking.user ? `Booked by ${booking.user.name}` : undefined
      }
    >
      {!selectedSpot ? (
        <p
          role="status"
          className="mt-4 rounded-md bg-linen p-3 text-sm text-dark-wine"
        >
          The original spot is no longer available. Choose a different spot.
        </p>
      ) : null}
      <BookingForm
        action={action}
        spots={spots}
        initial={initial}
        cancelPath={list}
        submitLabel="Save changes"
      >
        {admin ? (
          <section
            aria-labelledby="delete-booking-heading"
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-paper px-5 py-4 sm:px-6"
          >
            <div>
              <h2
                id="delete-booking-heading"
                className="font-display text-2xl leading-tight font-medium text-dark-wine"
              >
                Delete booking
              </h2>
              <p className="mt-1 text-sm text-taupe">
                Releases the spot for the booked date.
              </p>
            </div>
            <AdminBookingDelete
              action={deleteBooking.bind(null, id, true)}
              bookingDate={booking.bookingDate}
              spotNumber={booking.spot?.spotNumber}
            />
          </section>
        ) : null}
      </BookingForm>
    </BookingPage>
  );
}
