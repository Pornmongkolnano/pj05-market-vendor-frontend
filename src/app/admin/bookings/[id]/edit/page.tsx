import EditBooking from "@/components/edit-booking";

export default async function Page({
  params,
}: PageProps<"/admin/bookings/[id]/edit">) {
  return <EditBooking id={(await params).id} admin />;
}
