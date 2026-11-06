import React from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   REGLA TRANSVERSAL 1: GRADIENTE SEMÁNTICO FINANCIERO ESTRICTO (VERDE / ROJO)
   ═══════════════════════════════════════════════════════════════════════════ */
export function getSemanticReturnStyle(numericVal, maxScale = 15) {
    const ratio = Math.min(1, Math.max(0.14, Math.abs(numericVal) / maxScale));
    if (numericVal > 0) {
        return {
            background: `rgba(16, 185, 129, ${(ratio * 0.42).toFixed(2)})`,
            border: `1px solid rgba(16, 185, 129, ${(0.22 + ratio * 0.45).toFixed(2)})`,
            color: ratio > 0.5 ? '#6ee7b7' : '#a7f3d0'
        };
    }
    if (numericVal < 0) {
        return {
            background: `rgba(244, 63, 94, ${(ratio * 0.44).toFixed(2)})`,
            border: `1px solid rgba(244, 63, 94, ${(0.22 + ratio * 0.45).toFixed(2)})`,
            color: ratio > 0.5 ? '#fda4af' : '#fecdd3'
        };
    }
    return {
        background: 'rgba(148, 163, 184, 0.10)',
        border: '1px solid rgba(148, 163, 184, 0.22)',
        color: '#cbd5e1'
    };
}

/* ═══════════════════════════════════════════════════════════════════════════
   REGLA TRANSVERSAL 3: ALINEACIÓN DE COLUMNAS (1ª IZQ, INTERMEDIAS CENTRO, ÚLTIMA DER)
   ═══════════════════════════════════════════════════════════════════════════ */
export const colAlign = (idx, total) => (idx === 0 ? 'left' : idx === total - 1 ? 'right' : 'center');

/* ═══════════════════════════════════════════════════════════════════════════
   CONTENEDOR MODULAR ESTANDARIZADO PARA LAS 3 VISTAS DE PORTFOLIO
   ═══════════════════════════════════════════════════════════════════════════ */
/* Formatea títulos en mayúsculas a formato limpio (Title Case respetando siglas) */
const KEEP_UPPER = new Set([
    'CVAR', 'VAR', 'ETF', 'ETFS', 'USD', 'SPY', 'QQQ', 'NVDA', 'BTC', 'TLT', 'GLD', 'MSFT',
    'RAG', 'IA', 'AI', 'P&L', '2D', '3D', '1D', '5D', '10D', '95%', '99%', 'HRP', 'MVO',
    'KELLY', 'MARKOV', 'STRESS', 'S&P', '500', '60/40', 'BETA', 'SHARPE', 'SORTINO', 'FX', 'bps'
]);

function formatCleanBlockTitle(rawTitle) {
    if (!rawTitle || typeof rawTitle !== 'string') return rawTitle;
    return rawTitle
        .split(' ')
        .map((word, idx) => {
            const clean = word.replace(/[()[\],.:]/g, '').toUpperCase();
            if (KEEP_UPPER.has(clean) || /^P-\d+$/.test(clean)) return word;
            const lower = word.toLowerCase();
            if (idx > 0 && ['de', 'del', 'y', 'e', 'o', 'u', 'en', 'por', 'con', 'vs', 'a', 'al', 'el', 'la', 'los', 'las'].includes(lower)) {
                return lower;
            }
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join(' ');
}

export function PortfolioCardShell({ badge, title, subtitle, color = '#10b981', rightSlot, subBar, children, fixedHeight = null, style = {} }) {
    return (
        <div
            style={{
                background: 'transparent',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: '10px',
                minWidth: 0,
                maxWidth: '100%',
                overflow: 'hidden',
                ...style
            }}
        >
            {/* PASO 4 OPCIÓN 1 + PASO 7 OPCIÓN 3: Título 15.5px a la izquierda + dato 12px a la derecha */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    flexWrap: 'wrap',
                    flexShrink: 0,
                    paddingBottom: '8px',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.14)'
                }}
            >
                <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15.5px', fontWeight: 700, color: '#ffffff' }}>
                        {formatCleanBlockTitle(title)}
                    </span>
                    {subtitle && (
                        <span style={{ fontSize: '11.5px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                            {subtitle}
                        </span>
                    )}
                </div>

                {rightSlot && (
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                        {rightSlot}
                    </div>
                )}
            </div>

            {subBar && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'transparent',
                        border: '1px solid rgba(148, 163, 184, 0.14)',
                        flexShrink: 0,
                        flexWrap: 'wrap'
                    }}
                >
                    {subBar}
                </div>
            )}

            <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflowY: 'auto', overflowX: 'hidden' }}>
                {children}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATOS DETERMINISTAS COMPARTIDOS POR LAS 3 VISTAS DE PORTFOLIO
   ═══════════════════════════════════════════════════════════════════════════ */
export const INITIAL_HOLDINGS = [
    { sym: 'NVDA', name: 'NVIDIA Corp.', cat: 'Equities', weight: 22, enabled: true },
    { sym: 'SPY', name: 'SPDR S&P 500 ETF', cat: 'Equities', weight: 24, enabled: true },
    { sym: 'BTC-USD', name: 'Bitcoin Spot', cat: 'Crypto', weight: 14, enabled: true },
    { sym: 'GLD', name: 'SPDR Gold Trust', cat: 'Commodities', weight: 18, enabled: true },
    { sym: 'TLT', name: 'iShares 20+ Yr Treasury', cat: 'Fixed Income', weight: 12, enabled: true },
    { sym: 'MSFT', name: 'Microsoft Corp.', cat: 'Equities', weight: 10, enabled: true }
];

export const BASE_BACKTEST = [
    { date: 'Ene 25', port: 100.0, spx: 100.0, s6040: 100.0, allw: 100.0, eqw: 100.0 },
    { date: 'Feb 25', port: 104.2, spx: 101.8, s6040: 101.1, allw: 100.9, eqw: 102.5 },
    { date: 'Mar 25', port: 101.9, spx: 99.1, s6040: 99.8, allw: 100.2, eqw: 100.4 },
    { date: 'Abr 25', port: 107.6, spx: 102.4, s6040: 101.9, allw: 101.8, eqw: 104.1 },
    { date: 'May 25', port: 112.4, spx: 105.0, s6040: 103.4, allw: 103.1, eqw: 107.2 },
    { date: 'Jun 25', port: 110.1, spx: 104.2, s6040: 102.9, allw: 102.8, eqw: 105.9 },
    { date: 'Jul 25', port: 116.8, spx: 107.9, s6040: 105.2, allw: 104.6, eqw: 110.1 },
    { date: 'Ago 25', port: 114.0, spx: 105.5, s6040: 104.0, allw: 103.9, eqw: 108.3 },
    { date: 'Sep 25', port: 120.5, spx: 109.2, s6040: 106.8, allw: 105.7, eqw: 112.4 },
    { date: 'Oct 25', port: 125.9, spx: 111.8, s6040: 108.4, allw: 107.1, eqw: 115.0 },
    { date: 'Nov 25', port: 129.8, spx: 114.1, s6040: 110.1, allw: 108.4, eqw: 117.3 },
    { date: 'Dic 25', port: 134.6, spx: 116.5, s6040: 111.6, allw: 109.8, eqw: 119.2 }
];

export const BENCH_META = {
    spx: { label: 'S&P 500 (SPY)', ret: '+16.5%', sharpe: '1.28', col: '#10b981' },
    s6040: { label: 'Clásica 60/40', ret: '+11.6%', sharpe: '1.08', col: '#94a3b8' },
    allw: { label: 'All-Weather', ret: '+9.8%', sharpe: '1.34', col: '#6ee7b7' },
    eqw: { label: 'Equal-Weight (1/N)', ret: '+19.2%', sharpe: '1.62', col: '#a7f3d0' }
};

export const MONTHLY_HEATMAP = [
    { yr: '2026', m: [2.8, 1.9, -0.7, 3.4, 2.1, 1.4, 3.1, -1.2, 2.6, 1.8, 2.2, 1.9], ytd: 23.4 },
    { yr: '2025', m: [3.1, 2.4, -1.8, 4.1, 3.0, -1.1, 4.5, -2.0, 3.8, 2.9, 3.1, 2.7], ytd: 34.6 },
    { yr: '2024', m: [1.6, 3.2, 1.9, -2.4, 2.8, 2.1, 1.5, 0.9, -1.1, 2.4, 3.9, 1.4], ytd: 19.8 }
];

export const ASSET_RISK_PROFILES = [
    { sym: 'NVDA', weight: 22, vol: 34.0, ret: 42.5, sharpe: 1.92, beta: 1.68, var95: -3.45, upCap: 162, dnCap: 128, bestRegime: 'Bull Quiet' },
    { sym: 'SPY', weight: 24, vol: 14.5, ret: 16.5, sharpe: 1.28, beta: 1.00, var95: -1.62, upCap: 100, dnCap: 100, bestRegime: 'Bull Quiet' },
    { sym: 'BTC', weight: 14, vol: 44.0, ret: 48.0, sharpe: 1.74, beta: 1.42, var95: -4.60, upCap: 185, dnCap: 135, bestRegime: 'Bull Volatile' },
    { sym: 'GLD', weight: 18, vol: 11.2, ret: 14.2, sharpe: 1.48, beta: 0.08, var95: -1.10, upCap: 68, dnCap: -22, bestRegime: 'Inflationary' },
    { sym: 'TLT', weight: 12, vol: 13.8, ret: 7.4, sharpe: 0.68, beta: -0.32, var95: -1.35, upCap: 42, dnCap: -38, bestRegime: 'Crash / Crisis' },
    { sym: 'MSFT', weight: 10, vol: 19.5, ret: 24.0, sharpe: 1.56, beta: 1.14, var95: -2.05, upCap: 124, dnCap: 92, bestRegime: 'Bull Quiet' }
];

export const PORTFOLIO_NODES = [
    { id: 'PORT', label: 'Tu Cartera Actual', vol: 11.4, ret: 28.4, sharpe: 2.18, isOptimal: true },
    { id: 'MINVAR', label: 'Mínima Varianza', vol: 7.8, ret: 14.8, sharpe: 1.68, isOptimal: true },
    { id: 'MAXSH', label: 'Máximo Sharpe (Tangente)', vol: 12.6, ret: 31.2, sharpe: 2.28, isOptimal: true },
    { id: 'EQW', label: 'Equiponderada (1/N)', vol: 15.8, ret: 22.1, sharpe: 1.54, isOptimal: false },
    { id: 'S6040', label: 'Clásica 60/40', vol: 11.2, ret: 11.6, sharpe: 1.08, isOptimal: false }
];

export const SIMULATED_CLOUD = [
    { vol: 9.5, ret: 12.0 }, { vol: 11.0, ret: 15.2 }, { vol: 13.2, ret: 18.4 }, { vol: 14.8, ret: 14.1 },
    { vol: 16.5, ret: 21.0 }, { vol: 18.2, ret: 17.5 }, { vol: 19.4, ret: 25.2 }, { vol: 21.0, ret: 19.8 },
    { vol: 23.5, ret: 28.4 }, { vol: 25.0, ret: 22.6 }, { vol: 27.8, ret: 31.0 }, { vol: 30.2, ret: 26.5 },
    { vol: 12.4, ret: 21.8 }, { vol: 15.1, ret: 26.4 }, { vol: 17.6, ret: 29.5 }, { vol: 22.1, ret: 33.2 }
];

export const CORR_NORMAL = [
    [1.00, 0.82, 0.46, 0.08, -0.32, 0.79],
    [0.82, 1.00, 0.39, 0.12, -0.28, 0.86],
    [0.46, 0.39, 1.00, 0.24, -0.15, 0.41],
    [0.08, 0.12, 0.24, 1.00, 0.34, 0.06],
    [-0.32, -0.28, -0.15, 0.34, 1.00, -0.25],
    [0.79, 0.86, 0.41, 0.06, -0.25, 1.00]
];

export const CORR_STRESS = [
    [1.00, 0.94, 0.72, -0.18, -0.54, 0.91],
    [0.94, 1.00, 0.68, -0.14, -0.48, 0.93],
    [0.72, 0.68, 1.00, 0.05, -0.31, 0.69],
    [-0.18, -0.14, 0.05, 1.00, 0.52, -0.16],
    [-0.54, -0.48, -0.31, 0.52, 1.00, -0.45],
    [0.91, 0.93, 0.69, -0.16, -0.45, 1.00]
];

export const MONTE_CARLO_BASE = [
    { m: 'Hoy', p95: 100.0, p50: 100.0, p05: 100.0, bench: 100.0 },
    { m: '+2M', p95: 108.4, p50: 103.2, p05: 96.1, bench: 101.9 },
    { m: '+4M', p95: 116.8, p50: 106.7, p05: 93.4, bench: 103.8 },
    { m: '+6M', p95: 125.4, p50: 110.5, p05: 91.0, bench: 105.9 },
    { m: '+8M', p95: 134.2, p50: 114.3, p05: 89.2, bench: 108.1 },
    { m: '+10M', p95: 143.1, p50: 118.2, p05: 87.9, bench: 110.4 },
    { m: '+12M', p95: 152.4, p50: 122.4, p05: 86.8, bench: 112.8 }
];

export const RISK_TIME_SERIES = [
    { date: 'Ene 25', ddPort: -0.2, ddAsset: -1.1, sharpe60: 1.42, beta60: 0.88 },
    { date: 'Feb 25', ddPort: -0.9, ddAsset: -2.4, sharpe60: 1.55, beta60: 0.85 },
    { date: 'Mar 25', ddPort: -3.2, ddAsset: -7.8, sharpe60: 1.38, beta60: 0.91 },
    { date: 'Abr 25', ddPort: -0.5, ddAsset: -1.9, sharpe60: 1.64, beta60: 0.84 },
    { date: 'May 25', ddPort: 0.0, ddAsset: 0.0, sharpe60: 1.79, beta60: 0.80 },
    { date: 'Jun 25', ddPort: -2.1, ddAsset: -5.2, sharpe60: 1.68, beta60: 0.82 },
    { date: 'Jul 25', ddPort: 0.0, ddAsset: -0.4, sharpe60: 1.88, beta60: 0.78 },
    { date: 'Ago 25', ddPort: -4.8, ddAsset: -11.4, sharpe60: 1.61, beta60: 0.86 },
    { date: 'Sep 25', ddPort: -1.1, ddAsset: -3.6, sharpe60: 1.92, beta60: 0.77 },
    { date: 'Oct 25', ddPort: 0.0, ddAsset: 0.0, sharpe60: 2.04, beta60: 0.75 },
    { date: 'Nov 25', ddPort: -0.3, ddAsset: -1.2, sharpe60: 2.11, beta60: 0.74 },
    { date: 'Dic 25', ddPort: 0.0, ddAsset: 0.0, sharpe60: 2.18, beta60: 0.76 }
];

export const TACTICAL_CANDIDATES = {
    NVDA: {
        sym: 'NVDA',
        name: 'NVIDIA Corp.',
        winRate: 64,
        payoff: 2.15,
        fullKelly: 28.4,
        halfKelly: 14.2,
        quarterKelly: 7.1,
        p06: 0.22,
        quantScore: '+84 (Momentum & Flujo Institucional)',
        researchScore: '+78 (Demanda Blackwell Q4 sólida)',
        guardrailNote: 'APROBADO: Debajo del límite duro de 20% NAV y P-06 (0.22 < 0.65).'
    },
    'BTC-USD': {
        sym: 'BTC-USD',
        name: 'Bitcoin Spot',
        winRate: 58,
        payoff: 2.45,
        fullKelly: 31.0,
        halfKelly: 15.5,
        quarterKelly: 7.8,
        p06: 0.48,
        quantScore: '+76 (Ruptura de volatilidad positiva)',
        researchScore: '+71 (Flujos ETF Spot netos positivos)',
        guardrailNote: 'APROBADO CON MONITOREO: Volatilidad alta pero P-06 (0.48 < 0.65).'
    },
    TLT: {
        sym: 'TLT',
        name: 'iShares 20+ Yr Treasury',
        winRate: 56,
        payoff: 1.85,
        fullKelly: 22.0,
        halfKelly: 11.0,
        quarterKelly: 5.5,
        p06: 0.14,
        quantScore: '+68 (Cobertura convexa de duración)',
        researchScore: '+74 (Desaceleración de inflación subyacente)',
        guardrailNote: 'APROBADO ÓPTIMO: Reduce el VaR 95% de la cartera total en -0.38%.'
    },
    SPY_PUT: {
        sym: 'SPY_PUT',
        name: 'SPY Put 5% OTM (Escudo Tail)',
        winRate: 38,
        payoff: 4.80,
        fullKelly: 12.0,
        halfKelly: 6.0,
        quarterKelly: 3.0,
        p06: 0.08,
        quantScore: '+91 (Convexidad extrema en crash)',
        researchScore: '+82 (VIX en percentil bajo 18%)',
        guardrailNote: 'ESCUDO DE COLA: Recorta el Max Drawdown de -4.80% a -2.40%.'
    }
};

export const WALK_FORWARD_SERIES = [
    { p: 'W1 (IS)', base: 100.0, adhoc: 100.0, oosFloor: 100.0 },
    { p: 'W2 (IS)', base: 104.2, adhoc: 105.8, oosFloor: 101.2 },
    { p: 'W3 (IS)', base: 102.8, adhoc: 105.1, oosFloor: 100.4 },
    { p: 'W4 (IS)', base: 108.5, adhoc: 112.4, oosFloor: 103.8 },
    { p: 'W5 (IS)', base: 113.0, adhoc: 118.2, oosFloor: 106.5 },
    { p: 'W6 (IS)', base: 116.4, adhoc: 123.5, oosFloor: 108.9 },
    { p: 'W7 (OOS)', base: 114.8, adhoc: 122.9, oosFloor: 107.8 },
    { p: 'W8 (OOS)', base: 120.2, adhoc: 129.6, oosFloor: 111.4 },
    { p: 'W9 (OOS)', base: 124.5, adhoc: 135.4, oosFloor: 114.2 },
    { p: 'W10 (OOS)', base: 129.1, adhoc: 141.8, oosFloor: 117.0 },
    { p: 'W11 (OOS)', base: 131.8, adhoc: 145.2, oosFloor: 119.1 },
    { p: 'W12 (OOS)', base: 134.6, adhoc: 149.4, oosFloor: 121.5 }
];

export const INITIAL_LEDGER = [
    { time: '10:14:22', sym: 'NVDA', side: 'LONG TÁCTICO', navPct: '12.0%', kelly: 'Half-Kelly', impactSharpe: '+0.18', impactVaR: '-0.12%', status: 'EJECUTADA' },
    { time: '09:48:10', sym: 'TLT', side: 'HEDGE DURACIÓN', navPct: '8.0%', kelly: 'Half-Kelly', impactSharpe: '+0.14', impactVaR: '+0.38%', status: 'EJECUTADA' },
    { time: '09:15:04', sym: 'SPY Put 5%', side: 'TAIL SHIELD', navPct: '2.5%', kelly: 'Quarter-Kelly', impactSharpe: '+0.09', impactVaR: '+0.64%', status: 'ACTIVA' },
    { time: 'Ayer 16:50', sym: 'BTC-USD', side: 'RECORTE GUARDRAIL', navPct: '5.0%', kelly: 'Cap P-06', impactSharpe: '+0.11', impactVaR: '+0.29%', status: 'AUDITADA' }
];
