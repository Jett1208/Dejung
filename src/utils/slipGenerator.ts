import type { AllocationItem, CalculationSummary, ItemCalculation } from '../domain/types';

export interface SlipData {
  totalFunds: number;
  cycleDays: number;
  items: AllocationItem[];
  itemSummaries: ItemCalculation[];
  summary: CalculationSummary;
  savingsTarget?: number;
  currentSavings?: number;
}

/**
 * Generates a clean, friendly Thai text summary for copying to LINE / Notes.
 */
export function generateSummaryText(data: SlipData): string {
  const { totalFunds, cycleDays, items, itemSummaries, summary, savingsTarget } = data;
  const summaryMap = new Map<string, ItemCalculation>(itemSummaries.map((s) => [s.id, s]));

  const now = new Date();
  const dateStr = now.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const lines: string[] = [];
  lines.push(`📊 สรุปแผนจัดสรรงบประมาณ — Dejung (${dateStr})`);
  lines.push(`🗓️ รอบเวลา: ${cycleDays} วัน`);
  lines.push(`💰 เงินก้อนตั้งต้น: ฿${totalFunds.toLocaleString()} บาท`);
  lines.push(`📉 ยอดแบ่งจ่ายทั้งหมด: ฿${summary.totalAllocated.toLocaleString()} บาท`);
  lines.push('');

  if (items.length > 0) {
    lines.push('📋 รายการที่แบ่งไว้:');
    items.forEach((item) => {
      const calc = summaryMap.get(item.id)?.calculatedAmount ?? 0;
      const ruleText =
        item.rule === 'daily'
          ? item.selectedDays
            ? `${item.value} บ./วัน × ${item.selectedDays.filter(Boolean).length} วัน`
            : `${item.value} บ./วัน`
          : item.rule === 'percentage'
          ? `${item.value}%`
          : 'คงที่';
      const savingsTag = item.isSavings ? ' [เงินออม]' : '';
      lines.push(`  • ${item.name}: ฿${calc.toLocaleString()} (${ruleText})${savingsTag}`);
    });
    lines.push('');
  }

  if (summary.isOverAllocated) {
    lines.push(`⚠️ งบเกิน: ฿${summary.overAllocatedAmount.toLocaleString()} บาท`);
    lines.push('💡 คำแนะนำ: ปรับลดรายการค่าใช้จ่ายเพื่อรักษาสมดุล');
  } else {
    lines.push(`✨ เงินกินใช้อิสระต่อวัน: ฿${Math.round(summary.freeDailyAllowance).toLocaleString()} บ./วัน`);
    lines.push(`💵 เงินคงเหลือติดกระเป๋า: ฿${summary.unallocatedBalance.toLocaleString()} บาท`);
  }

  if (savingsTarget && savingsTarget > 0 && summary.totalSavingsAllocated > 0) {
    lines.push('');
    lines.push(
      `🎯 เป้าหมายเงินออม: ฿${savingsTarget.toLocaleString()} (จะถึงเป้าในอีก ~${summary.savingsCyclesRequired} รอบ)`
    );
  }

  lines.push('');
  lines.push('💡 คำแนะนำ: ผลคำนวณตามแผนที่ตั้งไว้ • ไม่มีการตัดเงินหรือย้ายเงินจริงระหว่างบัญชี');
  lines.push('สร้างด้วย Dejung — วางแผนการเงินอย่างสบายใจ');

  return lines.join('\n');
}

/**
 * Renders a crisp high-resolution financial slip image using HTML5 Canvas
 * and downloads it as a PNG file.
 */
export async function downloadSlipImage(data: SlipData): Promise<boolean> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  const { totalFunds, cycleDays, items, itemSummaries, summary } = data;
  const summaryMap = new Map<string, ItemCalculation>(itemSummaries.map((s) => [s.id, s]));

  // Canvas Setup
  const width = 800;
  // Calculate dynamic height based on item count
  const baseHeight = 780;
  const itemRowHeight = 44;
  const height = Math.max(900, baseHeight + items.length * itemRowHeight);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  // Background - Deep midnight gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#090D16');
  bgGrad.addColorStop(0.5, '#0E1524');
  bgGrad.addColorStop(1, '#080C14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Ambient luminous glow circles
  const glow1 = ctx.createRadialGradient(160, 160, 20, 160, 160, 280);
  glow1.addColorStop(0, 'rgba(5, 223, 114, 0.15)'); // Vibrant Emerald
  glow1.addColorStop(1, 'rgba(5, 223, 114, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(width - 150, 450, 20, width - 150, 450, 320);
  glow2.addColorStop(0, 'rgba(16, 185, 129, 0.12)'); // Emerald Green
  glow2.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // Outer Border Frame
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Header Banner
  const now = new Date();
  const dateStr = now.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Logo Monogram Circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(80, 80, 26, 0, Math.PI * 2);
  ctx.fillStyle = '#08090B';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#05DF72';
  ctx.stroke();

  ctx.fillStyle = '#05DF72';
  ctx.font = 'bold 28px Mitr, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('D', 80, 81);
  ctx.restore();

  // App Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '300 28px Mitr, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Dejung', 122, 72);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = '200 16px Mitr, sans-serif';
  ctx.fillText('สลิปสรุปผลการจัดสรรงบประมาณ', 122, 98);

  // Date/Time on the right
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '200 14px Mitr, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${dateStr} • ${timeStr}`, width - 50, 85);

  // Top Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, 130);
  ctx.lineTo(width - 50, 130);
  ctx.stroke();

  // 3-Col Quick Stats Box (Glass Card)
  const statsY = 155;
  const statsHeight = 100;
  drawRoundedRect(ctx, 50, statsY, width - 100, statsHeight, 18, 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.12)');

  const colWidth = (width - 100) / 3;

  // Stat 1: เงินก้อนตั้งต้น
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = '200 14px Mitr, sans-serif';
  ctx.fillText('เงินก้อนตั้งต้น', 50 + colWidth * 0.5, statsY + 36);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '400 24px Mitr, sans-serif';
  ctx.fillText(`฿${totalFunds.toLocaleString()}`, 50 + colWidth * 0.5, statsY + 70);

  // Stat 2: รอบเวลา
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = '200 14px Mitr, sans-serif';
  ctx.fillText('รอบเวลา', 50 + colWidth * 1.5, statsY + 36);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '400 24px Mitr, sans-serif';
  ctx.fillText(`${cycleDays} วัน`, 50 + colWidth * 1.5, statsY + 70);

  // Stat 3: แบ่งจ่ายแล้ว
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = '200 14px Mitr, sans-serif';
  ctx.fillText('แบ่งจ่ายแล้ว', 50 + colWidth * 2.5, statsY + 36);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '400 24px Mitr, sans-serif';
  ctx.fillText(`฿${summary.totalAllocated.toLocaleString()}`, 50 + colWidth * 2.5, statsY + 70);

  // Highlight Hero Card: เงินกินใช้อิสระต่อวัน
  const heroY = statsY + statsHeight + 20;
  const heroHeight = 120;
  drawRoundedRect(ctx, 50, heroY, width - 100, heroHeight, 20, 'rgba(5, 223, 114, 0.08)', 'rgba(5, 223, 114, 0.25)');

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '200 15px Mitr, sans-serif';
  ctx.fillText('✨ เงินกินใช้อิสระเฉลี่ยต่อวัน', 75, heroY + 42);

  ctx.fillStyle = '#05DF72';
  ctx.font = '500 36px Mitr, sans-serif';
  if (summary.isOverAllocated) {
    ctx.fillStyle = '#FF6B8B';
    ctx.fillText('0 ฿/วัน (เกินงบ)', 75, heroY + 86);
  } else {
    ctx.fillText(`฿${Math.round(summary.freeDailyAllowance).toLocaleString()} บ./วัน`, 75, heroY + 86);
  }

  // Right tag inside hero: เงินคงเหลือ
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '200 14px Mitr, sans-serif';
  ctx.fillText(summary.isOverAllocated ? 'งบเกิน' : 'เงินคงเหลือ', width - 75, heroY + 42);

  ctx.fillStyle = summary.isOverAllocated ? '#FF6B8B' : '#10B981';
  ctx.font = '400 24px Mitr, sans-serif';
  ctx.fillText(`${summary.isOverAllocated ? '-' : ''}฿${Math.abs(summary.unallocatedBalance).toLocaleString()}`, width - 75, heroY + 82);

  // Section Title: รายการแบ่งจ่าย
  let curY = heroY + heroHeight + 35;
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '300 18px Mitr, sans-serif';
  ctx.fillText('📋 รายการที่แบ่งไว้ในรอบนี้', 50, curY);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '200 14px Mitr, sans-serif';
  ctx.fillText(`${items.length} รายการ`, width - 50, curY);

  curY += 15;

  // Items List
  if (items.length === 0) {
    curY += 30;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '200 16px Mitr, sans-serif';
    ctx.fillText('(ยังไม่มีรายการแบ่งจ่าย)', width / 2, curY);
    curY += 30;
  } else {
    items.forEach((item, idx) => {
      curY += itemRowHeight;
      const isEven = idx % 2 === 0;
      if (isEven) {
        drawRoundedRect(ctx, 50, curY - 28, width - 100, 36, 10, 'rgba(255, 255, 255, 0.03)', 'transparent');
      }

      const calc = summaryMap.get(item.id)?.calculatedAmount ?? 0;
      const ruleText =
        item.rule === 'daily'
          ? item.selectedDays
            ? `${item.value} บ./วัน × ${item.selectedDays.filter(Boolean).length} วัน`
            : `${item.value} บ./วัน`
          : item.rule === 'percentage'
          ? `${item.value}%`
          : 'คงที่';

      // Item Name
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '300 16px Mitr, sans-serif';
      ctx.fillText(item.name, 70, curY);

      // Item Rule / Savings Tag
      ctx.fillStyle = item.isSavings ? '#05DF72' : 'rgba(255, 255, 255, 0.45)';
      ctx.font = '200 13px Mitr, sans-serif';
      ctx.fillText(`(${ruleText})${item.isSavings ? ' • ออม' : ''}`, 260, curY);

      // Item Amount
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '400 16px Mitr, sans-serif';
      ctx.fillText(`฿${calc.toLocaleString()}`, width - 70, curY);
    });
  }

  // Footer Divider & Brand Watermark
  const footerY = height - 55;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, footerY - 20);
  ctx.lineTo(width - 50, footerY - 20);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '200 14px Mitr, sans-serif';
  ctx.fillText('Dejung • วางแผนการเงินอย่างสบายใจ', width / 2, footerY + 8);

  // Convert canvas to Blob & trigger automatic download
  return new Promise<boolean>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dejung-budget-slip-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve(true);
    }, 'image/png');
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillColor: string,
  strokeColor: string
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  if (fillColor && fillColor !== 'transparent') {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  if (strokeColor && strokeColor !== 'transparent') {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}
