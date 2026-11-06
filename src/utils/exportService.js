/**
 * Client-Side Institutional Export Service (`src/utils/exportService.js`)
 *
 * Implements Phase 3 (Steps 3.1 to 3.4):
 * - Zero-dependency instant downloads for `CSV`, `JSON`, `Markdown (.md)`, and high-DPI Canvas `PNG` snapshots.
 * - Minimalist V010 Ghost button styling (`9px` monospace `↓ CSV`, `↓ PNG`, `↓ MD`, `↓ JSON`).
 */

export function getExportDateStamp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function triggerBlobDownload(blob, filename) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * Downloads an array of objects/rows as a UTF-8 CSV file.
 * @param {string} filename
 * @param {Array<{ key: string, label: string }>} columns
 * @param {Array<Record<string, any>>} rows
 */
export function exportToCsv(filename, columns = [], rows = []) {
  const escapeCell = (val) => {
    const str = val === null || val === undefined ? '' : String(val);
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = columns.map((c) => escapeCell(c.label)).join(',');
  const bodyLines = rows.map((row) =>
    columns.map((c) => escapeCell(typeof c.accessor === 'function' ? c.accessor(row) : row[c.key])).join(',')
  );
  const csvContent = `\uFEFF${[headerLine, ...bodyLines].join('\r\n')}\r\n`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerBlobDownload(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

/**
 * Downloads a structured object as a formatted JSON file.
 */
export function exportToJson(filename, payload) {
  const jsonContent = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  triggerBlobDownload(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
}

/**
 * Downloads a Markdown string as a `.md` file.
 */
export function exportToMarkdown(filename, markdownText) {
  const blob = new Blob([String(markdownText || '')], { type: 'text/markdown;charset=utf-8;' });
  triggerBlobDownload(blob, filename.endsWith('.md') ? filename : `${filename}.md`);
}

/**
 * Generates and downloads a high-resolution (2x Retina) institutional dark-mode PNG snapshot
 * summarizing KPIs, chart/series points, or portfolio holdings.
 */
export function exportSnapshotToPng({
  filename = 'snapshot.png',
  title = 'Market Intelligence Snapshot',
  subtitle = '',
  metrics = [],
  tableHeaders = [],
  tableRows = [],
  seriesPoints = [],
  footerNote = '',
  accentColor = '#10b981',
}) {
  if (typeof document === 'undefined') return;
  const scale = 2;
  const width = 980;
  const rowCount = Math.min(tableRows.length, 14);
  const hasChart = Array.isArray(seriesPoints) && seriesPoints.length > 2;
  const chartBlockH = hasChart ? 230 : 0;
  const tableBlockH = rowCount > 0 ? 52 + rowCount * 28 : 0;
  const height = Math.max(380, 185 + chartBlockH + tableBlockH + 54);

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(scale, scale);

  // 1. Institutional Dark Background (`#050811`) + Subtle Border
  ctx.fillStyle = '#050811';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.24)';
  ctx.lineWidth = 1;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  // Top Accent Bar
  ctx.fillStyle = accentColor;
  ctx.fillRect(12, 12, width - 24, 3);

  // 2. Header Title & Subtitle
  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 20px Inter, system-ui, sans-serif';
  ctx.fillText(title, 32, 48);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText(subtitle || `Generated ${getExportDateStamp()}`, 32, 68);

  // 3. KPI Metrics Strip (up to 6 cards)
  let currentY = 86;
  if (metrics.length > 0) {
    const cols = Math.min(metrics.length, 6);
    const gap = 10;
    const cardW = (width - 64 - gap * (cols - 1)) / cols;
    const cardH = 68;

    metrics.slice(0, 6).forEach((m, idx) => {
      const x = 32 + idx * (cardW + gap);
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(x, currentY, cardW, cardH);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.strokeRect(x, currentY, cardW, cardH);

      ctx.fillStyle = m.color || accentColor;
      ctx.fillRect(x, currentY, 3, cardH);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '700 9.5px "JetBrains Mono", monospace';
      ctx.fillText(String(m.label || '').toUpperCase().slice(0, 22), x + 10, currentY + 18);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 16px "JetBrains Mono", monospace';
      ctx.fillText(String(m.value || '—').slice(0, 16), x + 10, currentY + 41);

      if (m.sub) {
        ctx.fillStyle = '#64748b';
        ctx.font = '500 9.5px Inter, system-ui, sans-serif';
        ctx.fillText(String(m.sub).slice(0, 26), x + 10, currentY + 57);
      }
    });
    currentY += cardH + 20;
  }

  // 4. Optional Price/Equity Curve Plot
  if (hasChart) {
    const plotX = 32;
    const plotY = currentY;
    const plotW = width - 64;
    const plotH = 195;

    ctx.fillStyle = '#090e1a';
    ctx.fillRect(plotX, plotY, plotW, plotH);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.strokeRect(plotX, plotY, plotW, plotH);

    const vals = seriesPoints.map((p) => Number(typeof p === 'object' ? p.value ?? p.close ?? p.price ?? 0 : p));
    const minV = Math.min(...vals);
    const maxV = Math.max(...vals);
    const span = Math.max(maxV - minV, 1e-6);

    // Grid lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    for (let g = 1; g <= 3; g += 1) {
      const gy = plotY + (plotH * g) / 4;
      ctx.beginPath();
      ctx.moveTo(plotX, gy);
      ctx.lineTo(plotX + plotW, gy);
      ctx.stroke();
    }

    // Line Path
    ctx.beginPath();
    vals.forEach((v, i) => {
      const px = plotX + 16 + (i / Math.max(vals.length - 1, 1)) * (plotW - 32);
      const py = plotY + plotH - 18 - ((v - minV) / span) * (plotH - 36);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    currentY += plotH + 20;
  }

  // 5. Optional Data Table (Holdings / Screener / Risk)
  if (rowCount > 0 && tableHeaders.length > 0) {
    const tableX = 32;
    const tableW = width - 64;
    const colW = tableW / tableHeaders.length;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(tableX, currentY, tableW, 26);

    tableHeaders.forEach((h, cIdx) => {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.fillText(String(h).toUpperCase().slice(0, 22), tableX + cIdx * colW + 8, currentY + 17);
    });
    currentY += 26;

    tableRows.slice(0, rowCount).forEach((r, rIdx) => {
      if (rIdx % 2 === 1) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.fillRect(tableX, currentY, tableW, 26);
      }
      r.forEach((cell, cIdx) => {
        ctx.fillStyle = cIdx === 0 ? '#f8fafc' : '#cbd5e1';
        ctx.font = cIdx === 0 ? '700 11px "JetBrains Mono", monospace' : '500 11px "JetBrains Mono", monospace';
        ctx.fillText(String(cell ?? '').slice(0, 26), tableX + cIdx * colW + 8, currentY + 17);
      });
      currentY += 26;
    });
  }

  // 6. Footer Watermark
  ctx.fillStyle = '#64748b';
  ctx.font = '500 10.5px "JetBrains Mono", monospace';
  ctx.fillText(
    footerNote || `Institutional Quantitative Platform • Snapshot ${getExportDateStamp()}`,
    32,
    height - 24
  );

  canvas.toBlob((blob) => {
    if (blob) {
      triggerBlobDownload(blob, filename.endsWith('.png') ? filename : `${filename}.png`);
    }
  }, 'image/png');
}

/**
 * Shared inline style for minimalist `9px` V010 Ghost export buttons (`↓ CSV`, `↓ PNG`, `↓ MD`, `↓ JSON`).
 */
export const GHOST_EXPORT_BTN_STYLE = {
  background: 'transparent',
  border: '1px solid rgba(148, 163, 184, 0.22)',
  borderRadius: '4px',
  padding: '2px 6px',
  fontSize: '9.5px',
  fontWeight: 700,
  fontFamily: 'var(--font-mono, monospace)',
  color: '#94a3b8',
  cursor: 'pointer',
  letterSpacing: '0.03em',
  lineHeight: 1.3,
  transition: 'all 0.15s ease',
  whiteSpace: 'nowrap',
};
