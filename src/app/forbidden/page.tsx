import Link from "next/link";

export default function PermissionPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">คุณไม่มีสิทธิ์เข้าหน้านี้</h1>
      <Link
        href="/account"
        className="mt-5 inline-block underline underline-offset-4"
      >
        กลับบัญชีของฉัน
      </Link>
    </main>
  );
}
