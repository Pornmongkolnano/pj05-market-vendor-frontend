import SpotEditor from "@/components/spot-editor";
import { requireViewer } from "@/lib/auth";
import { readSpot } from "@/lib/market-data";
import { deactivateSpot, saveSpot } from "../../actions";

export default async function EditSpotPage({
  params,
}: PageProps<"/admin/spots/[id]/edit">) {
  const { id } = await params;
  await requireViewer(`/admin/spots/${id}/edit`, "admin");
  const spot = await readSpot(id);

  return (
    <SpotEditor
      spot={spot}
      saveAction={saveSpot.bind(null, id)}
      deleteAction={deactivateSpot.bind(null, id)}
    />
  );
}
