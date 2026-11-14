import EditBooking from "@/components/edit-booking";

export default async function Page({
  params,
}: PageProps<"/bookings/[id]/edit">) {
  return <EditBooking id={(await params).id} admin={false} />;
}
