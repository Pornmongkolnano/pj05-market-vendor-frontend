import { redirect } from "next/navigation";

// home page: "/" sends visitors straight to Explore spots.
export default function Home() {
	redirect("/spots");
}
