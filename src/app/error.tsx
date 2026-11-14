"use client";

export default function AppError({ reset }: { reset: () => void }) {
  return (
    <main className="page-shell">
      <h1 className="text-2xl font-semibold">โหลดข้อมูลไม่ได้</h1>
      <p className="mt-2 text-slate-600">ระบบขัดข้องชั่วคราว กรุณาลองอีกครั้ง</p>
      <button type="button" className="button-primary mt-5" onClick={reset}>
        ลองอีกครั้ง
      </button>
    </main>
  );
}
