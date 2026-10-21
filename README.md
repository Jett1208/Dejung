# Dejung (ดีจัง) — ผู้ช่วยจัดสรรงบประมาณ 💸

> **Local-first Money Allocation Planner** ออกแบบด้วยดีไซน์ **Liquid Glassmorphism**, ฟอนต์ **Mitr ExtraLight** และ **3D Interactive Visuals (Three.js)** เพื่อให้การวางแผนและจัดสรรเงินเป็นเรื่องง่าย ชัดเจน และสบายใจ

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

---

## ✨ จุดเด่นและฟีเจอร์หลัก (Key Features)

- **💰 เริ่มต้นง่ายใน 3 ขั้นตอน:** กำหนดเงินก้อนตั้งต้น ➔ ตั้งรอบเวลา (จำนวนวัน) ➔ เพิ่มรายการแบ่งจ่าย
- **📋 รองรับกฎการจัดสรร 3 รูปแบบ:**
  - **รายวัน (Daily):** คำนวณยอดรวมอัตโนมัติตามจำนวนวัน เช่น ค่าอาหาร 150 บ./วัน
  - **ยอดคงที่ (Fixed):** สำหรับค่าใช้จ่ายคงที่ เช่น ค่าเช่า ค่าน้ำมัน อินเทอร์เน็ต
  - **เปอร์เซ็นต์ (% ก้อน):** คำนวณสัดส่วนจากเงินก้อนตั้งต้น เช่น เงินออม 20%
- **✨ ไฮไลต์เงินกินใช้อิสระต่อวัน (Free Daily Allowance):** คำนวณเงินที่เหลือให้เห็นทันทีว่าวันนี้สามารถกินใช้ ช้อปปิ้ง หรือจ่ายนอกแผนได้กี่บาท/วัน โดยไม่กระทบค่าใช้จ่ายคงที่
- **🎯 ติดตามเป้าหมายเงินออม (Savings Goal Tracker):** คำนวณความคืบหน้าสะสมและจำลองจำนวนรอบ/จำนวนวันที่ต้องเก็บเงินเพื่อพิชิตเป้าหมายใหญ่
- **🪙 เหรียญ 3 มิติโต้ตอบได้ (Interactive 3D Coin Indicator):** เหรียญ 3D หมุนและเปล่งแสงตอบสนองตามสถานะงบประมาณแบบ Real-time โดย Three.js
- **🧾 สลิปสรุปผลการจัดสรร (Result Slip Modal):**
  - **ดาวน์โหลดภาพสลิป PNG:** เจนเนอเรตภาพสลิปการเงินความละเอียดสูง (HD) บันทึกลงเครื่องได้ทันที
  - **คัดลอกข้อความสรุป:** ก๊อปปี้สรุปข้อความภาษาไทยจัดฟอร์แมตสวยงาม พร้อมส่งใน LINE หรือบันทึกใน Note
- **💾 Local-first & Privacy-friendly:** ข้อมูลทุกอย่างจัดเก็บในเครื่องของคุณผ่าน `localStorage` ไม่มีการส่งข้อมูลการเงินออกสู่ภายนอก พร้อมระบบ Export / Import ไฟล์ `.json` เพื่อสำรองข้อมูล
- **📱 PWA & Mobile-First:** ติดตั้งลงหน้าจอมือถือ/แท็บเล็ตได้เหมือนแอปแท้ และใช้งานแบบออฟไลน์ได้ 100%

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS, Liquid Glassmorphism Architecture
- **3D Graphics:** Three.js (WebGL Particle dust & Interactive Coin)
- **Typography:** Google Fonts Mitr (ExtraLight 200 / Light 300 / Regular 400)
- **Icons:** Lucide React
- **Build Tool:** Vite 8, Vite PWA Plugin
- **Code Quality & Testing:** ESLint 9 (Flat Config), Vitest (10 test suites, 29 unit & integration tests)

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
dejung/
├── docs/                     # เอกสารสเปก, สถาปัตยกรรม (ADR), และบันทึกโครงการ
│   ├── adr/                  # Architecture Decision Records (ADR-0001 ถึง 0007)
│   ├── assets/               # โลโก้และกราฟิกหลักของแบรนด์
│   ├── brainstorming/        # บันทึกไอเดียและการวิจัยช่วงเริ่มต้น
│   ├── skills/               # Glassmorphism Design System Guidelines
│   └── SPEC.md               # ข้อกำหนดระบบ (Product Specification)
├── public/                   # Static assets สำหรับ PWA (logo, favicon, manifest)
├── src/
│   ├── components/           # UI Components (Header, SetupCard, CategoryList, ResultModal, ฯลฯ)
│   ├── domain/               # Pure calculation logic และ Domain Types
│   ├── hooks/                # Custom React Hooks (useBudgetPlanner)
│   ├── utils/                # Slip Generator (Canvas HD PNG & Summary Text)
│   ├── App.tsx               # Main Application Layout
│   ├── index.css             # Glass tokens, Specular highlights & Luminous blobs
│   └── main.tsx              # Entry point
├── tests/                    # Vitest unit & integration test suites
├── GLOSSARY.md               # พจนานุกรมคำศัพท์มาตรฐานประจำระบบ
└── package.json
```

---

## 🚀 เริ่มต้นใช้งาน (Getting Started)

### ข้อกำหนดเบื้องต้น
- Node.js (เวอร์ชัน 18 ขึ้นไป แนะนำ Node 20+)
- npm หรือ pnpm

### คำสั่งติดตั้งและรันในโหมดพัฒนา

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. รัน Local Development Server
npm run dev

# 3. รัน Unit & Component Tests
npx vitest run

# 4. ตรวจสอบ Linting
npm run lint

# 5. บิลด์สำหรับ Production
npm run build
```

---

## 📄 ใบอนุญาต (License)

โปรเจกต์นี้พัฒนาขึ้นเพื่อการเรียนรู้และการใช้งานส่วนบุคคลภายใต้ [MIT License](LICENSE).
