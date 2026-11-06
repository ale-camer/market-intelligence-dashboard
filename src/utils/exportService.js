import React from 'react';

/**
 * Client-Side Institutional Export Service (`src/utils/exportService.js`)
 *
 * Implements Phase 3 (Steps 3.1 to 3.4):
 * - Zero-dependency instant downloads for `CSV`, `JSON`, `Markdown (.md)`, and high-DPI Canvas `PNG` snapshots.
 * - Universal File-Badge SVG Icon button (`ExportFormatButton`) where the format (`CSV`, `PNG`, `MD`, `JSON`)
 *   is embedded directly inside the file icon silhouette.
 */

export function getExportDateStamp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function sanitizeFilename(name) {
  return String(name || 'export').replace(/[/\\?%*:|"<>]/g, '-');
}

function triggerBlobDownload(blob, rawFilename) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const filename = sanitizeFilename(rawFilename);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (a.parentNode) a.parentNode.removeChild(a);
    URL.revokeObjectURL(url);
  }, 2000);
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

  // Synchronous DataURL -> Blob conversion so browser download happens within the synchronous user click gesture
  const dataUrl = canvas.toDataURL('image/png');
  const byteString = atob(dataUrl.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: 'image/png' });
  const targetName = filename.endsWith('.png') ? filename : `${filename}.png`;
  triggerBlobDownload(blob, targetName);
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

/**
 * Color-coded, format-specific icon badge button (`ExportFormatButton`).
 * Each file format has its own signature color palette and recognizable visual motif:
 *  - CSV  -> Excel Green (#15803d) & White (#ffffff) + spreadsheet grid icon
 *  - MD   -> Pitch Black (#090d16) & Pure White (#ffffff) + official Markdown M↓ symbol
 *  - JSON -> JavaScript Yellow (#facc15) & Black (#090d16) + curly braces { } icon
 *  - PNG  -> Vibrant Orange (#ea580c) & White (#ffffff) + mountain/sun image frame icon
 */
const FORMAT_THEMES = {
  CSV: {
    bg: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)',
    bgHover: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
    border: '#4ade80',
    fg: '#ffffff',
    glow: 'rgba(34, 197, 94, 0.55)',
    label: 'CSV',
  },
  MD: {
    bg: '#090d16',
    bgHover: '#111827',
    border: 'rgba(255, 255, 255, 0.85)',
    fg: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.45)',
    label: 'MD',
  },
  JSON: {
    bg: 'linear-gradient(180deg, #fde047 0%, #facc15 100%)',
    bgHover: 'linear-gradient(180deg, #fef08a 0%, #fde047 100%)',
    border: '#fef08a',
    fg: '#090d16',
    glow: 'rgba(250, 204, 21, 0.55)',
    label: 'JSON',
  },
  PNG: {
    bg: 'linear-gradient(180deg, #f97316 0%, #ea580c 100%)',
    bgHover: 'linear-gradient(180deg, #fb923c 0%, #f97316 100%)',
    border: '#fdba74',
    fg: '#ffffff',
    glow: 'rgba(249, 115, 22, 0.55)',
    label: 'PNG',
  },
};

function renderFormatGlyph(fmt, fg) {
  if (fmt === 'CSV') {
    // Excel-style spreadsheet grid icon in crisp white
    return React.createElement(
      'svg',
      { width: 13, height: 13, viewBox: '0 0 14 14', fill: 'none', style: { display: 'block', flexShrink: 0 } },
      React.createElement('rect', {
        x: '1.2',
        y: '1.5',
        width: '11.6',
        height: '11',
        rx: '1.6',
        stroke: fg,
        strokeWidth: '1.35',
      }),
      React.createElement('path', {
        d: 'M1.2 5.2H12.8M1.2 8.8H12.8M5.4 1.5V12.5',
        stroke: fg,
        strokeWidth: '1.25',
      })
    );
  }

  if (fmt === 'MD') {
    // Official Markdown down-arrow / M↓ motif in crisp white on black
    return React.createElement(
      'svg',
      { width: 13, height: 13, viewBox: '0 0 14 14', fill: 'none', style: { display: 'block', flexShrink: 0 } },
      React.createElement('path', {
        d: 'M1.5 10.5V3.5L4.1 6.7L6.7 3.5V10.5',
        stroke: fg,
        strokeWidth: '1.55',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
      React.createElement('path', {
        d: 'M10.5 3.5V10.2M10.5 10.2L8.5 8.1M10.5 10.2L12.5 8.1',
        stroke: fg,
        strokeWidth: '1.55',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      })
    );
  }

  if (fmt === 'JSON') {
    // Bold curly braces { } in dark ink on JavaScript yellow
    return React.createElement(
      'svg',
      { width: 13, height: 13, viewBox: '0 0 14 14', fill: 'none', style: { display: 'block', flexShrink: 0 } },
      React.createElement('path', {
        d: 'M5.1 2.2C3.8 2.2 3.4 2.8 3.4 4.0V5.4C3.4 6.3 2.7 7.0 1.8 7.0C2.7 7.0 3.4 7.7 3.4 8.6V10.0C3.4 11.2 3.8 11.8 5.1 11.8',
        stroke: fg,
        strokeWidth: '1.65',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
      React.createElement('path', {
        d: 'M8.9 2.2C10.2 2.2 10.6 2.8 10.6 4.0V5.4C10.6 6.3 11.3 7.0 12.2 7.0C11.3 7.0 10.6 7.7 10.6 8.6V10.0C10.6 11.2 10.2 11.8 8.9 11.8',
        stroke: fg,
        strokeWidth: '1.65',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      })
    );
  }

  // PNG -> Image frame with sun + mountain peak
  return React.createElement(
    'svg',
    { width: 13, height: 13, viewBox: '0 0 14 14', fill: 'none', style: { display: 'block', flexShrink: 0 } },
    React.createElement('rect', {
      x: '1.2',
      y: '1.8',
      width: '11.6',
      height: '10.4',
      rx: '1.8',
      stroke: fg,
      strokeWidth: '1.35',
    }),
    React.createElement('circle', {
      cx: '4.4',
      cy: '4.9',
      r: '1.15',
      fill: fg,
    }),
    React.createElement('path', {
      d: 'M2.2 10.8L5.6 7.1L8.1 9.5L9.9 7.8L12.0 10.8',
      stroke: fg,
      strokeWidth: '1.35',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    })
  );
}

export function ExportFormatButton({ format = 'CSV', onClick, title, style = {} }) {
  const fmt = String(format || 'CSV').toUpperCase();
  const theme = FORMAT_THEMES[fmt] || FORMAT_THEMES.CSV;

  return React.createElement(
    'button',
    {
      type: 'button',
      onClick,
      title: title || `Download .${fmt.toLowerCase()}`,
      'aria-label': title || `Download .${fmt.toLowerCase()}`,
      style: {
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '5px',
        height: '23px',
        padding: '0 7px',
        margin: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4.5px',
        color: theme.fg,
        fontSize: '10.5px',
        fontWeight: 800,
        fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
        letterSpacing: '0.03em',
        lineHeight: 1,
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.35)',
        transition: 'transform 0.14s ease, filter 0.14s ease, box-shadow 0.14s ease, background 0.14s ease',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        ...style,
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = theme.bgHover;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = `0 0 10px ${theme.glow}`;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = theme.bg;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.35)';
      },
    },
    renderFormatGlyph(fmt, theme.fg),
    React.createElement('span', null, theme.label)
  );
}


