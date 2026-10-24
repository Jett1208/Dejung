import type { BudgetState, AllocationItem } from '../domain/types';

// Unambiguous 32-character set (Crockford Base32: excludes 0, 1, I, L, O to avoid mistyping on mobile/iPad)
export const CROCKFORD_BASE32 = '23456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Generates a memorable 6-character alphanumeric share code e.g. "DJ7K9B"
 */
export function generateShareCode(): string {
  let result = '';
  const len = CROCKFORD_BASE32.length;
  for (let i = 0; i < 6; i++) {
    const rand = Math.floor(Math.random() * len);
    result += CROCKFORD_BASE32[rand];
  }
  return result;
}

/**
 * Validates and sanitizes a 6-character code input
 */
export function sanitizeShareCode(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^23456789ABCDEFGHJKMNPQRSTVWXYZ]/g, '')
    .slice(0, 6);
}

/**
 * Validates whether an untrusted JSON object conforms to BudgetState
 */
export function validateBudgetState(data: unknown): BudgetState | null {
  if (!data || typeof data !== 'object') return null;

  const obj = data as Record<string, unknown>;

  const totalFunds = Number(obj.totalFunds);
  const cycleDays = Number(obj.cycleDays);
  if (isNaN(totalFunds) || isNaN(cycleDays) || totalFunds < 0 || cycleDays <= 0) {
    return null;
  }

  const items: AllocationItem[] = [];
  if (Array.isArray(obj.items)) {
    for (const it of obj.items) {
      if (!it || typeof it !== 'object') continue;
      const itemObj = it as Record<string, unknown>;
      const rule = String(itemObj.rule);
      const validRule: AllocationItem['rule'] =
        rule === 'daily' || rule === 'percentage' ? rule : 'fixed';

      items.push({
        id: String(itemObj.id || Math.random().toString(36).substring(2, 9)),
        name: String(itemObj.name || 'ไม่มีชื่อรายการ'),
        rule: validRule,
        value: Math.max(0, Number(itemObj.value) || 0),
        isSavings: Boolean(itemObj.isSavings),
        selectedDays: Array.isArray(itemObj.selectedDays) ? (itemObj.selectedDays as boolean[]) : undefined,
      });
    }
  }

  return {
    totalFunds,
    cycleDays,
    items,
    savingsTarget: Math.max(0, Number(obj.savingsTarget) || 0),
    currentSavings: Math.max(0, Number(obj.currentSavings) || 0),
  };
}

/**
 * Saves a budget plan to cloud KV via /api/share or direct cloud clipboard fallback.
 */
export async function savePlanToCloud(
  state: BudgetState,
  customCode?: string
): Promise<{ success: boolean; code: string; error?: string }> {
  const code = customCode ? sanitizeShareCode(customCode) : generateShareCode();
  const payload = JSON.stringify(state);

  // 1. Try local/Vercel /api/share endpoint
  try {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, code: data.code || code };
    }
  } catch {
    // Continue to direct fallback
  }

  // 2. Direct fallback to public cloud clipboard (cl1p.net / bytebin)
  try {
    const res = await fetch(`https://api.cl1p.net/dejung_${code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    if (res.ok || res.status === 201 || res.status === 200) {
      return { success: true, code };
    }
  } catch (err) {
    console.warn('Fallback cloud save failed', err);
  }

  return {
    success: false,
    code: '',
    error: 'ไม่สามารถเชื่อมต่อระบบคลาวด์ได้ กรุณาตรวจสอบอินเทอร์เน็ตหรือใช้ไฟล์ JSON',
  };
}

/**
 * Fetches and parses a budget plan by 6-character code from cloud KV.
 */
export async function loadPlanFromCloud(
  rawCode: string
): Promise<{ success: boolean; state?: BudgetState; error?: string }> {
  const code = sanitizeShareCode(rawCode);

  if (code.length !== 6) {
    return {
      success: false,
      error: 'รหัสต้องประกอบด้วยตัวอักษรและตัวเลข 6 หลัก (เช่น DJ7K9B)',
    };
  }

  let jsonText: string | null = null;

  // 1. Try /api/share?code=...
  try {
    const res = await fetch(`/api/share?code=${encodeURIComponent(code)}`);
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        const validated = validateBudgetState(result.data);
        if (validated) return { success: true, state: validated };
      }
    }
  } catch {
    // Continue to direct fallback
  }

  // 2. Fallback to direct cloud clipboard
  try {
    const res = await fetch(`https://api.cl1p.net/dejung_${code}`);
    if (res.ok) {
      jsonText = await res.text();
    }
  } catch {
    // Handled below
  }

  if (!jsonText || jsonText.trim() === '') {
    return {
      success: false,
      error: `ไม่พบแผนงบประมาณสำหรับรหัส "${code}" (อาจหมดอายุหรือกรอกรหัสผิด)`,
    };
  }

  try {
    const parsed = JSON.parse(jsonText);
    const validated = validateBudgetState(parsed);
    if (!validated) {
      return {
        success: false,
        error: 'โครงสร้างข้อมูลแผนงบประมาณไม่ถูกต้อง',
      };
    }
    return { success: true, state: validated };
  } catch {
    return {
      success: false,
      error: `ข้อมูลสำหรับรหัส "${code}" เสียหายหรือไม่ถูกต้อง`,
    };
  }
}
