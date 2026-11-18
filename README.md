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

## ต่อกับ API ของ PJ05

รัน Express และ MongoDB ตาม README ของ backend ตั้ง `PORT=5050` สำหรับใช้งานในเครื่อง หรือตั้ง `BACKEND_URL` เป็น origin ของ Express ที่กำลังใช้งานโดยเว้นส่วน `/api/v1` ไว้ [API รุ่นเดโมและวิธีสร้างแอดมิน](https://github.com/Pornmongkolnano/pj05-market-vendor-api/tree/deploy/pj05-demo) · [API ตั้งต้นจากรายวิชา](https://github.com/SWDevPrac2-69-1/PJ05-MarketVendorBook) · [Swagger ในเครื่อง](http://localhost:5050/api-docs/)

ฟอร์ม `/register` ส่ง `name`, `email`, `tel`, `role` และ `password` ผ่าน Next.js บัญชี `member` ใช้ `POST /api/v1/auth/register` ส่วนแอดมินที่ล็อกอินแล้วเปิดเมนูสร้างบัญชีจาก `/admin` เพื่อสร้างบัญชี `admin` ผ่าน `POST /api/v1/auth/register/admin` โหมด `npm run dev` ใช้ `http://127.0.0.1:5050` เป็นค่าเริ่มต้น ส่วน production อ่าน `BACKEND_URL` จาก environment ของเซิร์ฟเวอร์

NextAuth Credentials ใช้ `POST /api/v1/auth/login` ตรวจรหัสผ่านและใช้ Bearer token อ่านบัญชีจาก `GET /api/v1/auth/me` ก่อนอนุญาตให้เข้าหน้าส่วนตัวและหน้าแอดมิน การออกจากระบบล้าง session cookie ของ NextAuth

## เส้นทางเดโม

| ผู้ใช้ | เส้นทาง |
| --- | --- |
| ทุกคน | `/spots` ดูรายการและรายละเอียดพื้นที่ขาย |
| สมาชิก | `/bookings` ดู แก้ และลบรายการของตนเอง เริ่มจองจากหน้ารายละเอียดแผง |
| แอดมิน | `/admin` เข้าหน้าจัดการแผง จัดการการจองทั้งหมด และเปิดแดชบอร์ดแยกตามวันที่และโซน |

ก่อนซ้อม สร้างแผงตัวอย่างด้วยบัญชีแอดมินแล้วจองหนึ่งแผงด้วยบัญชีสมาชิกอีกบัญชี จะได้มีข้อมูลให้แอดมินแก้และลบในช่วงของตัวเอง
