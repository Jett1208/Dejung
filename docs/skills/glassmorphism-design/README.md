# Glassmorphism Design Skill & Guidelines (Liquid Glass UI)

โฟลเดอร์นี้รวบรวม **ชุดคำสั่ง Agent Skill (`SKILL.md`)** และ **แนวทางการออกแบบ (`DESIGN.md`)** สำหรับการสร้างเว็บสไตล์ **Glassmorphism (Liquid Glass)** ระดับพรีเมียมตามมาตรฐาน Apple macOS / iOS

## หัวใจสำคัญของสไตล์นี้ (Core Philosophy):
1. **Glass is a window, not a filter**:
   - แผงกระจกไม่มีสีในตัวเอง สีของกระจกเกิดจากพื้นหลังข้างหลังที่เบลอทะลุขึ้นมา
   - ใช้ค่าสี `rgba(255, 255, 255, N)` เสมอ ไม่ใช้สีทึบหรือฟิลเตอร์สีจัดจ้าน
2. **Specular Top Highlight (1px Inset)**:
   - จุดเด่นของ Liquid Glass คือแสงสะท้อนขอบบนกระจก `box-shadow: 0 1px 0 0 rgba(255,255,255,0.20) inset` จำลองความหนาของแผ่นกระจกจริง
3. **Pill-shaped Controls**:
   - ปุ่มกด, ช่องกรอก, และชิปหมวดหมู่เป็นทรงแคปซูลมนสมบูรณ์ (`border-radius: 999px`)
4. **Rich Animated Background**:
   - กระจกจะสวยงามเมื่อมีพื้นหลังที่มีสีสันเคลื่อนไหว (Luminous Blobs) เบื้องหลัง

## ตำแหน่งไฟล์ที่ติดตั้งในระบบ:
- **Global Skill (เรียกใช้ได้ทุกเซสชันในเครื่อง)**: `C:\Users\tatar\.gemini\config\skills\glassmorphism-design\SKILL.md`
- **Project Reference**: `docs/skills/glassmorphism-design/`
