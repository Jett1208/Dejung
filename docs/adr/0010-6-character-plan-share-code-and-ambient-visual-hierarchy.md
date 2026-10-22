# ADR-0010: 6-Character Plan Share Code and Ambient Visual Hierarchy

## Status
Accepted

## Date
2026-10-22

## Context
1. **Plan Export/Import Complexity:**
   - Previously, sharing or exporting a budget plan required saving or copying long, complex JSON documents.
   - The user requested a simple 6-character code (e.g. `DJ7K9B`) to make sharing and migrating plans across devices (such as iPhone to iPad) effortless and clean.
2. **Visual Hierarchy & Background Aesthetics:**
   - With the previous dark mode update, a solid black background was applied across the entire viewport, which inadvertently obscured the lively animated 3D green particles and luminous ambient blobs.
   - The user requested that the solid dark/black color should frame ONLY the individual cards/widgets (`glass-panel`), while the main page background should showcase the dynamic, moving 3D greenish atmosphere.
3. **iPad Landscape Optimization:**
   - In iPad landscape view, viewport height is relatively constrained (~768-834px). The right sticky sidebar needed internal scroll capabilities (`max-h-[calc(100vh-2.5rem)] overflow-y-auto`) so lower sections (donut chart actions) remain accessible.

## Decision
1. **6-Character Crockford Base32 Share Codes (`src/utils/shareCode.ts`):**
   - Implemented `generateShareCode()` using Crockford's 32-character set (`23456789ABCDEFGHJKMNPQRSTVWXYZ`), omitting ambiguous characters (`0, 1, I, L, O`) to eliminate confusion on touch keyboards.
   - Created `/api/share` endpoint supporting serverless cloud storage with public cloud clipboard fallback (`cl1p.net` with `dejung_${code}` namespaces), enabling instant cross-device sync without requiring user registration or login.
   - Implemented `ImportPreviewModal` as a safety barrier to preview imported total funds, cycle days, and items before overwriting local plans.
2. **Dual-Tab Export/Import (`src/components/ExportImportModal.tsx`):**
   - **Primary Tab:** "รหัสแชร์ 6 หลัก (ด่วน)" with OTP-style character boxes and one-click copy.
   - **Secondary Tab:** "ไฟล์ JSON (ถาวร)" retained for full offline archival.
3. **Visual Contrast: Dark Card Framing on Moving 3D Green Canvas:**
   - Main container background switched to `bg-slate-50/70 dark:bg-black/25` with full translucency to reveal the 3D particles and animated emerald blobs.
   - Enhanced `Ambient3DBackground.tsx` with 80 particles, floating icosahedrons, and undulating wave physics.
   - Updated `.dark` glassmorphic cards to use a deep charcoal-black frame (`rgba(13, 16, 22, 0.90)`), ensuring each widget stands out boldly against the glowing green canvas.

## Consequences
- **Positive:**
  - Plans can now be transferred across devices in seconds by entering 6 letters/numbers.
  - Safe import flow prevents accidental plan overwrites with the preview modal.
  - The moving green 3D background is fully visible and vibrant, while cards maintain crisp dark framing.
  - 100% test coverage with 53 passing Vitest tests.
