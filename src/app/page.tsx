import { redirect } from "next/navigation";
import { getSessionViewer } from "@/lib/auth";

export default async function Home() {
	const viewer = await getSessionViewer();
	if (viewer?.role === "admin") redirect("/admin/dashboard");
	if (viewer?.role === "member") redirect("/bookings");
	redirect("/spots");
}
