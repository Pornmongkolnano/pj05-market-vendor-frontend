# PJ05 Market Vendor Frontend

Frontend สำหรับระบบจองพื้นที่ตลาดกลางคืน ใช้ Next.js App Router, TypeScript และ Tailwind CSS

## รันในเครื่อง

```bash
npm ci
npm run dev
```

เปิด [หน้าเว็บในเครื่อง](http://localhost:3000)

สำหรับเข้าสู่ระบบ ให้คัดลอก `.env.example` เป็น `.env.local` และใช้ `openssl rand -base64 32` สร้างค่า `NEXTAUTH_SECRET` ตั้ง `NEXTAUTH_URL` ตรงกับ origin ที่เปิดในเบราว์เซอร์

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

ฟอร์ม `/register` ส่งข้อมูลผ่าน Next.js ไปยัง `POST /api/v1/auth/register` โหมด `npm run dev` ใช้ `http://127.0.0.1:5050` เป็นค่าเริ่มต้น ถ้าใช้พอร์ตอื่นหรือรันแบบ production ให้กำหนด `BACKEND_URL` เป็น origin ของ PJ05 เช่น `http://127.0.0.1:5050` ใน `.env.local` หรือใน environment ของ server

NextAuth Credentials ใช้ `POST /api/v1/auth/login` ตรวจรหัสผ่านและใช้ Bearer token อ่านบัญชีจาก `GET /api/v1/auth/me` ก่อนอนุญาตให้เข้าหน้าส่วนตัวและหน้าแอดมิน การออกจากระบบล้าง session cookie ของ NextAuth
