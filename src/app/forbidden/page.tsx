import Link from "next/link";
import { getSessionViewer } from "@/lib/auth";

export default async function PermissionPage() {
  const viewer = await getSessionViewer();
  const isMember = viewer?.role === "member";

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">คุณไม่มีสิทธิ์เข้าหน้านี้</h1>
      <Link
        href={isMember ? "/bookings" : "/account"}
        className="mt-5 inline-block underline underline-offset-4"
      >
        {isMember ? "กลับไปที่การจองของฉัน" : "กลับบัญชีของฉัน"}
      </Link>
    </main>
  );
}
