import { updateBooking } from "@/app/bookings/actions";
import { requireViewer } from "@/lib/auth";
import { marketDay } from "@/lib/market";
import { listSpots, readBooking } from "@/lib/market-data";
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
      subtitle={
        admin && booking.user ? `Booked by ${booking.user.name}` : undefined
      }
    >
      {!selectedSpot ? (
        <p
          role="status"
          className="mt-4 rounded-md bg-linen p-3 text-sm text-dark-wine"
        >
          {spots.length
            ? "The original spot is no longer available. Choose a different spot."
            : "There are no active spots to move this booking to."}
        </p>
      ) : null}
      <BookingForm
        action={action}
        minDate={marketDay()}
        spots={spots}
        initial={initial}
        cancelPath={list}
        submitLabel="Save changes"
      />
    </BookingPage>
  );
}
