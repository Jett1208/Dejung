# Design Document: Money Allocation Planner (เว็บจัดสรรงบประมาณอัจฉริยะ)

**Date**: 2026-10-21  
**Status**: Proposed  
**Author**: Antigravity & User  
**Target Platform**: Mobile-First Web App (iOS Safari, iPadOS, Android Chrome, Desktop) with PWA support  

---

## 1. Intent & The "Why"
ผู้ใช้ต้องการเครื่องมือวางแผนและจัดสรรเงินก้อนที่มีอยู่ในรอบเวลาหนึ่งๆ (เช่น รายรับใน 1 เดือน หรือรอบ 30 วัน) เพื่อให้เห็นภาพล่วงหน้าอย่างชัดเจนว่าเงินแต่ละส่วนจะถูกกระจายไปเป็น:
1. ค่าใช้จ่ายรายวัน (เช่น ค่าข้าววันละกี่บาท × จำนวนวัน)
2. ค่าใช้จ่ายคงที่ (เช่น ค่าน้ำมัน, ค่าเดินทาง)
3. สัดส่วนเงินออมและสำรองฉุกเฉิน (คำนวณเป็น % หรือยอดคงที่)
4. เงินคงเหลือที่สามารถนำไปใช้จ่ายอิสระได้เฉลี่ยต่อวัน (Free Daily Allowance)
และจำลองการเก็บเงินตามเป้าหมาย (Savings Target) ว่าต้องใช้เวลากี่รอบจึงจะถึงเป้า

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Smart Allocation**: รองรับการจัดสรรงบประมาณ 3 รูปแบบ (รายวัน, ยอดคงที่, เปอร์เซ็นต์)
- **Live Calculations**: คำนวณยอดเงินคงเหลือ (Unallocated Balance), สัดส่วน %, และเงินใช้ได้เฉลี่ยต่อวัน (Free Daily Allowance) ทันทีทุกครั้งที่ตัวเลขเปลี่ยนแปลง
- **Savings Goal Tracker**: คำนวณระยะเวลา (รอบ/เดือน) ที่จะบรรลุเป้าหมายเงินออม โดยผูกกับยอดเงินออมที่จัดสรรในรอบนั้นโดยอัตโนมัติ
- **Mobile & iPad-First UX**: ดีไซน์รองรับการใช้งานบนมือถือ/แท็บเล็ตเป็นอันดับแรก มีแถบสรุปเงินคงเหลือลอยติดขอบล่าง (Sticky Bottom Bar) ไม่ต้องเลื่อนจอกลับไปมา
- **Frictionless Onboarding**: ไม่มีข้อมูลจำลองรกตา แต่มีตัวอย่าง Placeholder แนะนำชัดเจน (`เช่น 25,000`, `เช่น 30 วัน`) พร้อม Quick-Add Chips ช่วยสร้างหมวดหมู่เร็ว
- **Zero-Backend & High Privacy**: เก็บข้อมูลบน `LocalStorage` ของเบราว์เซอร์ ไม่ต้องสมัครสมาชิก ไม่ต้องต่อเน็ต ข้อมูลการเงินเป็นส่วนตัว 100%
- **PWA Ready**: สามารถ "Add to Home Screen" บน iPhone/iPad ใช้งานได้เต็มหน้าจอแบบ Native App

### Non-Goals
- **Daily Transaction Logger**: ไม่ใช่แอปทำบัญชีรายรับ-รายจ่ายที่ต้องคอยบันทึกสลิปทุกครั้งที่ซื้อของ (เน้น Proactive Planning ไม่ใช่ Reactive Expense Tracking)
- **Bank Account Integration**: ไม่มีการเชื่อมต่อ API กับธนาคาร
- **Multi-user Cloud Sync**: ไม่มีระบบบัญชีผู้ใช้หรือฐานข้อมูลบน Cloud ในเฟสแรก (ใช้วิธี Export/Import JSON สำหรับสำรองข้อมูล)

### Anti-Goals
- **No Blocking Validation**: ไม่แสดง Popup แจ้งเตือนน่ารำคาญเมื่อคำนวณงบเกิน แต่ใช้แถบสถานะสีแดงและตัวเลขติดลบแจ้งเตือนอย่างชัดเจน เพื่อให้ผู้ใช้ปรับจูนตัวเลขได้อย่างอิสระ
- **No Complex Accounting Jargon**: ไม่ใช้ศัพท์บัญชีซับซ้อน (เช่น เดบิต, เครดิต, สินทรัพย์) ใช้ภาษาธรรมดาที่เข้าใจง่าย (เงินตั้งต้น, จำนวนวัน, รายการแบ่งจ่าย, เงินเหลือใช้วันละ)

---

## 3. Technology Stack Decisions

- **Framework**: **React 19 + Vite + TypeScript**
  - *เหตุผล*: โหลดเร็วมาก ไม่มีปัญหา Hydration Mismatch กับ LocalStorage เหมือน Next.js, จัดการ PWA ง่าย และ Deploy ได้ฟรี 100% บน Vercel, Cloudflare Pages หรือ GitHub Pages (อ้างอิง [ADR-0003](file:///c:/Users/tatar/OneDrive/เดสก์ท็อป/dejung/docs/adr/0003-react-vite-vs-nextjs.md))
- **Styling**: **Tailwind CSS**
  - *เหตุผล*: Utility-first CSS น้ำหนักเบา ปรับแต่ง UI ให้สวยสะดุดตาและ Responsive Mobile/Tablet ได้รวดเร็ว
- **Icons**: **Lucide React** (ไอคอนทันสมัย สะอาด สไตล์ iOS/Modern Web)
- **Visuals / Charts**: **Recharts** หรือ Lightweight SVG Donut Chart สำหรับแสดงสัดส่วนเปอร์เซ็นต์
- **Storage**: **Browser LocalStorage** (อ้างอิง [ADR-0001](file:///c:/Users/tatar/OneDrive/เดสก์ท็อป/dejung/docs/adr/0001-client-side-local-first-storage.md))
- **PWA**: **Vite PWA Plugin** (Web Manifest, Service Worker, Touch Icons)

---

## 4. Domain Model & Mathematical Formulas

อ้างอิงจาก [GLOSSARY.md](file:///c:/Users/tatar/OneDrive/เดสก์ท็อป/dejung/GLOSSARY.md):

1. **Total Funds ($T$)**: จำนวนเงินก้อนตั้งต้น (บาท)
2. **Budget Cycle ($D$)**: จำนวนวันในรอบ (วัน, ค่าเริ่มต้น 30)
3. **Allocation ($A_i$)**: ยอดเงินของหมวดหมู่ที่ $i$
   - กรณี **Daily Rate**: $A_i = \text{rate}_i \times D$
   - กรณี **Fixed Amount**: $A_i = \text{amount}_i$
   - กรณี **Percentage**: $A_i = T \times \left(\frac{\text{percent}_i}{100}\right)$
4. **Total Allocated ($S$)**: $\sum A_i$
5. **Unallocated Balance ($U$)**: $T - S$
6. **Free Daily Allowance**: $\frac{U}{D}$ (เมื่อ $U > 0$, ถ้า $U \le 0$ จะแสดง $0$ พร้อมป้ายเตือนเกินงบ)
7. **Savings Target Calculations**:
   - $T_{\text{target}}$: เป้าหมายเงินออมรวม (บาท)
   - $C_{\text{current}}$: เงินออมสะสมที่มีอยู่แล้วในปัจจุบัน (บาท, ค่าเริ่มต้น 0)
   - $S_{\text{savings}}$: ยอดรวมเงินออมที่จัดสรรในรอบปัจจุบัน ($\sum A_{\text{savings}}$)
   - **Remaining to Goal**: $R = \max(0, T_{\text{target}} - C_{\text{current}})$
   - **Progress %**: $\min\left(100, \frac{C_{\text{current}}}{T_{\text{target}}} \times 100\right)$
   - **Cycles Required**: $\lceil \frac{R}{S_{\text{savings}}} \rceil$ (รอบ)

---

## 5. User Interface & Interaction Design

### 5.1 Mobile / iPad Layout (Primary View)
1. **Header**:
   - ชื่อแอป Money Allocation Planner พร้อมไอคอนกระเป๋าเงิน
   - ปุ่ม Quick Actions: Reset แผน, Export/Import JSON
2. **Setup Card (ส่วนตั้งค่าตั้งต้น)**:
   - **เงินก้อนตั้งต้น**: ช่องใส่ตัวเลขขนาดใหญ่ โฟกัสชัดเจน (`inputMode="decimal"`, placeholder: `เช่น 25,000`)
   - **จำนวนวันในรอบ**: สวิตช์เลือกเร็ว `30 วัน` | `15 วัน` | `7 วัน` หรือพิมพ์กำหนดเอง (placeholder: `เช่น 30`)
3. **Quick-Add Category Chips**:
   - แถบปุ่มลัดแตะง่าย: `+ 🍜 ค่าข้าว (รายวัน)` `+ ⛽ ค่าน้ำมัน (คงที่)` `+ ☕ ค่ากาแฟ (รายวัน)` `+ 💰 เงินออม (%)` `+ ➕ เพิ่มเอง`
4. **Allocation Categories List**:
   - การ์ดรายการแบ่งจ่าย แต่ละแถวประกอบด้วย:
     - ชื่อรายการ
     - ตัวเลือกโหมดคำนวณ: [ รายวัน (฿/วัน) | ยอดคงที่ (฿) | เปอร์เซ็นต์ (%) ]
     - ช่องใส่ตัวเลข (ปรับเปลี่ยนตามโหมด เช่น `150 บ./วัน` หรือ `2,000 บ.` หรือ `20%`)
     - ป้ายกำกับคำนวณยอดสุทธิและสัดส่วน % เช่น `= 4,500 บ. (18%)`
     - สวิตช์แท็ก "นับเป็นเงินออม" (สำหรับเชื่อมกับเป้าหมายออม)
     - ปุ่มลบรายการ
5. **Savings Target Goal Card**:
   - ช่องใส่เป้าหมายเงินออม (placeholder: `เช่น 50,000 บาท`)
   - ช่องใส่เงินออมสะสมปัจจุบัน (placeholder: `เช่น 20,000 บาท (ถ้ามี)`)
   - แสดง Progress Bar ความคืบหน้าสะสม (%)
   - สรุปผลชัดเจน: *"มีอยู่แล้ว 20,000 บ. (40%) ขาดอีก 30,000 บ. ด้วยยอดออมรอบนี้ (5,000 บ.) จะถึงเป้าในอีก 6 รอบ"*
6. **Sticky Bottom Summary Bar (Mobile/iPad)**:
   - ลอยติดขอบล่างตลอดเวลา
   - แสดง **เงินคงเหลือ (฿X,XXX)** และ **ใช้อิสระได้วันละ (฿YYY)**
   - แถบสถานะสี (เขียวเมื่อมีเงินเหลือ, แดงเมื่อ Over-allocated)
   - แตะเพื่อคลี่ดู Donut Chart แสดงสัดส่วนรายจ่ายทั้งหมดแบบเต็มจอ

### 5.2 Desktop Layout
- ใช้การแบ่ง 2 คอลัมน์ (Split Screen):
  - ฝั่งซ้าย: ฟอร์มกรอกข้อมูลและรายการจัดสรร (Scrollable)
  - ฝั่งขวา: Summary Dashboard แสดง Donut Chart ขนาดใหญ่, การ์ดสถานะเงินคงเหลือ และการ์ดเป้าหมายเงินออม (Sticky)

---

## 6. Technical Specifications & Edge Case Decisions (Builder Calls)
- **Multi-Category Savings Aggregation (Builder Call)**: หากผู้ใช้เปิดสวิตช์ "นับเป็นเงินออม" หลายรายการ ระบบจะรวมยอดเงินออมทั้งหมด ($\sum A_{\text{savings}}$) มาคิดคำนวณกับเป้าหมายเงินออมรวมให้อัตโนมัติ เพื่อความเรียบง่ายของ Data Model
- **Over-allocation Display (Builder Call)**: เมื่อจัดสรรเงินเกิน ($U < 0$):
  - Free Daily Allowance จะแสดงเป็น `0 บ./วัน (เกินงบ)` พร้อมป้ายเตือนสีแดง
  - Donut Chart จะแสดงสัดส่วนปกติเทียบกับยอดรวมที่จัดสรรจริง พร้อมแสดงแถบเตือนสีแดงเตือนว่างบประมาณทะลุ 100%
- **Desktop Summary Scope (Builder Call)**: ตัดส่วนคำแนะนำการเงินที่ซับซ้อนออก เพื่อคงความกระชับและตรงไปตรงมา เน้นเฉพาะ Donut Chart, ยอดเงินคงเหลือ และตัวชี้วัดเป้าหมายออมเงิน ให้สอดคล้องกับหน้าจอมือถือ
- **Styling Details (Builder Call)**: ใช้ชุดสี Modern Emerald/Teal สำหรับสถานะปกติและเงินออม, และ Rose/Red สำหรับสถานะงบเกิน
