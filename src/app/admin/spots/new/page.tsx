import SpotEditor from "@/components/spot-editor";
import { requireViewer } from "@/lib/auth";
import { saveSpot } from "../actions";

export default async function NewSpotPage() {
  await requireViewer("/admin/spots/new", "admin");
  
  return <SpotEditor saveAction={saveSpot.bind(null, null)} />;
}
