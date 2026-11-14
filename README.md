# PJ05 Market Vendor Frontend

Frontend สำหรับระบบจองพื้นที่ตลาดกลางคืน ใช้ Next.js App Router, TypeScript และ Tailwind CSS

## รันในเครื่อง

```bash
npm ci
npm run dev
```

เปิด [หน้าเว็บในเครื่อง](http://localhost:3000)

- `src/app/page.tsx` คือหน้าแรก
- `src/app/layout.tsx` คือ layout หลักและ metadata ของเว็บ
- `src/app/globals.css` โหลด Tailwind สำหรับทุกหน้า

## ตรวจโครงโปรเจกต์

```bash
npm run lint
npm run build
```

## Backend อ้างอิง

PJ05 ใช้ Express API ที่มากับโจทย์ รอบทบทวน Auth เปิด Swagger ในเครื่องที่พอร์ต `5050` [API ของ PJ05](https://github.com/SWDevPrac2-69-1/PJ05-MarketVendorBook) · [Swagger ในเครื่อง](http://localhost:5050/api-docs/)
