import { tx, txList, txTpl, useViewLocale } from '../../data/i18n/viewLocaleService';
import React, { useState, useMemo } from 'react';
import {
    exportToCsv,
    exportSnapshotToPng,
    getExportDateStamp,
    ExportFormatButton
} from '../../utils/exportService';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    CartesianGrid
} from 'recharts';
import { Search, Plus, Trash2, Star, CheckSquare, Square } from 'lucide-react';
import { ASSET_CATALOG, getAssetBySymbol } from '../../services/marketService';
import { computeLivePortfolioMetrics } from '../../services/committeeService';
import {
    getSemanticReturnStyle,
    colAlign,
    PortfolioCardShell,
    INITIAL_HOLDINGS,
    BASE_BACKTEST,
    BENCH_META,
    MONTHLY_HEATMAP
} from './portfolioConstants';

/* ───────────────────────────────────────────────────────────────────────────
   FILA 1: CABECERA DE 6 PÍLDORAS DE RESUMEN REACTIVAS
   ─────────────────────────────────────────────────────────────────────────── */
function Row1SummaryPills({ holdings, liveMetrics, isES = false }) {
    const activeList = holdings.filter(h => h.enabled !== false && Number(h.weight) > 0);
    const isEmpty = activeList.length === 0;
    const varDollar = isEmpty ? '0' : Math.round(Math.abs(Number(liveMetrics.var95Pct || 0)) * 1000).toLocaleString();
    const cvarDollar = isEmpty ? '0' : Math.round(Math.abs(Number(liveMetrics.cvar99Pct || 0)) * 1000).toLocaleString();
    const sharpeNum = isEmpty ? 0 : Number(liveMetrics.sharpeRatio || 0);
    const enbNum = isEmpty ? 0 : Number(liveMetrics.enb || 0);

    const pills = [
        {
            lbl: tx('RETORNO ANUAL (CAGR)', 'ANNUAL RETURN (CAGR)'),
            val: isEmpty ? '0.0%' : `${liveMetrics.cagrPct >= 0 ? '+' : ''}${liveMetrics.cagrPct}%`,
            sub: tx('vs +16.5% SPX • Ganancia est.', 'vs +16.5% SPX • Est. gain'),
            col: isEmpty ? 'var(--text-dim, #64748b)' : liveMetrics.cagrPct >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)'
        },
        {
            lbl: 'SHARPE / SORTINO',
            val: isEmpty ? '0.00 / 0.00' : `${liveMetrics.sharpeRatio} / ${liveMetrics.sortinoRatio}`,
            sub: txTpl(
                'Vol. σ: {0}% • {1}',
                [
                    isEmpty ? '0.0' : liveMetrics.portfolioVolPct,
                    isEmpty ? 'Sin activos' : sharpeNum >= 1.5 ? 'Excelente (>1.5)' : sharpeNum >= 1.0 ? 'Sólido (>1.0)' : 'Moderado (<1.0)'
                ],
                'Vol. σ: {0}% • {1}',
                [
                    isEmpty ? '0.0' : liveMetrics.portfolioVolPct,
                    isEmpty ? 'No holdings' : sharpeNum >= 1.5 ? 'Strong (>1.5)' : sharpeNum >= 1.0 ? 'Solid (>1.0)' : 'Moderate (<1.0)'
                ]
            ),
            col: isEmpty ? 'var(--text-dim, #64748b)' : 'var(--accent, #10b981)'
        },
        {
            lbl: 'VaR 95% / CVaR 99% (1D)',
            val: isEmpty ? '0.0% / 0.0%' : `${liveMetrics.var95Pct}% / ${liveMetrics.cvar99Pct}%`,
            sub: txTpl(
                'Día: -${0} • Extremo: -${1}',
                [varDollar, cvarDollar],
                'Day: -${0} • Tail: -${1}',
                [varDollar, cvarDollar]
            ),
            col: isEmpty ? 'var(--text-dim, #64748b)' : 'var(--danger, #f43f5e)'
        },
        {
            lbl: 'MAX DRAWDOWN (12M)',
            val: isEmpty ? '0.0%' : `${liveMetrics.maxDrawdownPct}%`,
            sub: tx('Caída máx. • Recup.: ~14 días', 'Max drop • Recovery: ~14d'),
            col: isEmpty ? 'var(--text-dim, #64748b)' : 'var(--danger, #f43f5e)'
        },
        {
            lbl: 'ALPHA BRINSON (12M)',
            val: isEmpty ? '0.0%' : `${liveMetrics.brinsonAlphaPct >= 0 ? '+' : ''}${liveMetrics.brinsonAlphaPct}%`,
            sub: txTpl(
                'Ventaja vs SPX • Beta: {0}',
                [isEmpty ? '0.00' : liveMetrics.portfolioBeta],
                'Edge vs SPX • Beta: {0}',
                [isEmpty ? '0.00' : liveMetrics.portfolioBeta]
            ),
            col: isEmpty ? 'var(--text-dim, #64748b)' : liveMetrics.brinsonAlphaPct >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)'
        },
        {
            lbl: tx('ACTIVOS SELECCIONADOS', 'SELECTED ASSETS'),
            val: `${activeList.length} / ${holdings.length}`,
            sub: txTpl(
                'ENB: {0} • {1}',
                [isEmpty ? '0.0' : liveMetrics.enb, isEmpty ? 'Vacía' : enbNum >= 3.5 ? 'Diversificada' : 'Concentrada'],
                'ENB: {0} • {1}',
                [isEmpty ? '0.0' : liveMetrics.enb, isEmpty ? 'Empty' : enbNum >= 3.5 ? 'Diversified' : 'Concentrated']
            ),
            col: isEmpty ? 'var(--text-dim, #64748b)' : 'var(--accent, #10b981)'
        }
    ];

    return (
        <div className="resp-kpi-grid-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '8px', alignItems: 'stretch' }}>
            {pills.map(p => (
                <div
                    key={p.lbl}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                        borderLeft: `3px solid ${p.col}`,
                        borderRadius: '10px',
                        padding: '10px 13px',
                        minWidth: 0,
                        minHeight: '84px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted, #94a3b8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.lbl}
                    </div>
                    <div style={{ fontSize: '18.5px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: p.col, marginTop: '2px', whiteSpace: 'nowrap' }}>
                        {p.val}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim, #64748b)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.sub}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ───────────────────────────────────────────────────────────────────────────
   FILA 2 — IZQUIERDA: TABLA DE PONDERACIÓN SIN SLIDERS + WATCHLIST ★
   ─────────────────────────────────────────────────────────────────────────── */
function Row2LeftWeightTable({ holdings, setHoldings, watchlistSyms = [], onToggleWatchlist, onOpenAssetInMarkets, isES = false }) {
    const [query, setQuery] = useState('');
    const [openDrop, setOpenDrop] = useState(false);
    const [filterMode, setFilterMode] = useState('ALL'); // ALL | WATCHLIST

    const catalogMatches = useMemo(() => {
        const list = Array.isArray(ASSET_CATALOG) ? ASSET_CATALOG : [];
        const q = query.trim().toLowerCase();
        return list
            .filter(a => !holdings.some(h => h.sym === a.sym))
            .filter(a => (filterMode === 'WATCHLIST' ? watchlistSyms.includes(a.sym) : true))
            .filter(a => !q || a.sym.toLowerCase().includes(q) || (a.name || '').toLowerCase().includes(q) || (a.cat || '').toLowerCase().includes(q))
            .slice(0, 8);
    }, [query, holdings, filterMode, watchlistSyms]);

    const activeHoldings = holdings.filter(h => h.enabled !== false);
    const totalWeight = activeHoldings.reduce((acc, h) => acc + Number(h.weight || 0), 0);

    const toggleEnable = (sym) => {
        setHoldings(prev => prev.map(h => (h.sym === sym ? { ...h, enabled: h.enabled === false ? true : false } : h)));
    };

    const updateWeight = (sym, val) => {
        const clean = Math.max(0, Math.min(100, Number(val) || 0));
        setHoldings(prev => prev.map(h => (h.sym === sym ? { ...h, weight: clean } : h)));
    };

    const stepWeight = (sym, delta) => {
        setHoldings(prev =>
            prev.map(h => (h.sym === sym ? { ...h, weight: Math.max(0, Math.min(100, Number(h.weight || 0) + delta)) } : h))
        );
    };

    const removeAsset = (sym) => {
        setHoldings(prev => prev.filter(h => h.sym !== sym));
        if (onToggleWatchlist && watchlistSyms.includes(sym)) {
            onToggleWatchlist(sym);
        }
    };

    const addAsset = (item) => {
        setHoldings(prev => [
            ...prev,
            { sym: item.sym, name: item.name || item.sym, cat: item.cat || 'Equities', weight: 8, enabled: true }
        ]);
        if (onToggleWatchlist && !watchlistSyms.includes(item.sym)) {
            onToggleWatchlist(item.sym);
        }
        setQuery('');
        setOpenDrop(false);
    };

    const equalize = () => {
        const activeCount = holdings.filter(h => h.enabled !== false).length || 1;
        const w = Number((100 / activeCount).toFixed(1));
        setHoldings(prev => prev.map(h => (h.enabled === false ? h : { ...h, weight: w })));
    };

    const normalize100 = () => {
        if (totalWeight <= 0) return;
        setHoldings(prev =>
            prev.map(h => (h.enabled === false ? h : { ...h, weight: Number(((h.weight / totalWeight) * 100).toFixed(1)) }))
        );
    };

    const applyPreset = (presetId) => {
        let nextPreset = INITIAL_HOLDINGS;
        if (presetId === 'CONSERVATIVE') {
            nextPreset = [
                { sym: 'TLT', name: 'iShares 20+ Yr Treasury', cat: 'Fixed Income', weight: 30, enabled: true },
                { sym: 'GLD', name: 'SPDR Gold Trust', cat: 'Commodities', weight: 25, enabled: true },
                { sym: 'SPY', name: 'SPDR S&P 500 ETF', cat: 'Equities', weight: 25, enabled: true },
                { sym: 'MSFT', name: 'Microsoft Corp.', cat: 'Equities', weight: 12, enabled: true },
                { sym: 'AAPL', name: 'Apple Inc.', cat: 'Equities', weight: 8, enabled: true }
            ];
        } else if (presetId === 'QUANT') {
            nextPreset = [
                { sym: 'NVDA', name: 'NVIDIA Corp.', cat: 'Equities', weight: 28, enabled: true },
                { sym: 'BTC', name: 'Bitcoin', cat: 'Crypto', weight: 22, enabled: true },
                { sym: 'QQQ', name: 'Invesco QQQ Trust', cat: 'Equities', weight: 20, enabled: true },
                { sym: 'MSFT', name: 'Microsoft Corp.', cat: 'Equities', weight: 15, enabled: true },
                { sym: 'SOL', name: 'Solana', cat: 'Crypto', weight: 15, enabled: true }
            ];
        }
        setHoldings(nextPreset);
        if (onToggleWatchlist) {
            onToggleWatchlist(nextPreset.map(h => h.sym), 'set');
        }
    };

    const tableHeaders = txList(['ON', 'ACTIVO', 'CLASE', 'PESO (%)', 'CAPITAL ($)', 'ACCIÓN'], ['ON', 'ASSET', 'CLASS', 'WEIGHT (%)', 'CAPITAL ($)', 'ACTION']);

    const handleExportBuilderCsv = () => {
        const live = computeLivePortfolioMetrics(holdings);
        const rows = holdings.map(h => {
            const w = h.enabled === false ? 0 : Number(h.weight || 0);
            return {
                status: h.enabled === false ? 'PAUSED' : 'ACTIVE',
                sym: h.sym,
                name: h.name || h.sym,
                cat: h.cat || 'Asset',
                weightPct: w.toFixed(1),
                capitalUsd: Math.round(w * 1000),
                portfolioCagrPct: live.cagrPct,
                portfolioSharpe: live.sharpeRatio,
                portfolioVar95Pct: live.var95Pct,
            };
        });
        exportToCsv(
            `portfolio-holdings-${getExportDateStamp()}.csv`,
            [
                { key: 'status', label: 'Status' },
                { key: 'sym', label: 'Ticker' },
                { key: 'name', label: 'Asset Name' },
                { key: 'cat', label: 'Asset Class' },
                { key: 'weightPct', label: 'Weight (%)' },
                { key: 'capitalUsd', label: 'Capital ($100k Base)' },
                { key: 'portfolioCagrPct', label: 'Portfolio CAGR (%)' },
                { key: 'portfolioSharpe', label: 'Portfolio Sharpe' },
                { key: 'portfolioVar95Pct', label: 'Portfolio 95% VaR (%)' },
            ],
            rows
        );
    };

    const handleExportBuilderPng = () => {
        const live = computeLivePortfolioMetrics(holdings);
        exportSnapshotToPng({
            filename: `portfolio-holdings-${getExportDateStamp()}.png`,
            title: tx('Resumen de Cartera Activa (Portfolio Builder)', 'Active Portfolio Summary (Portfolio Builder)'),
            subtitle: `${activeHoldings.length} ${tx('activos activos', 'active holdings')} • ${tx('Suma', 'Total')}: ${totalWeight.toFixed(1)}% • ${getExportDateStamp()}`,
            metrics: [
                { label: 'CAGR (ANUAL)', value: `+${live.cagrPct}%`, sub: `Vol ${live.portfolioVolPct}%`, color: 'var(--accent, #10b981)' },
                { label: 'SHARPE / SORTINO', value: `${live.sharpeRatio} / ${live.sortinoRatio}`, sub: `Beta ${live.portfolioBeta}`, color: 'var(--info-text, #38bdf8)' },
                { label: 'VAR 95% / CVAR 99%', value: `${live.var95Pct}% / ${live.cvar99Pct}%`, sub: '1D Tail Risk', color: 'var(--warn-text, #f59e0b)' },
                { label: 'MAX DRAWDOWN', value: `${live.maxDrawdownPct}%`, sub: 'Historical Peak-to-Trough', color: 'var(--danger, #f43f5e)' },
                { label: 'ALPHA BRINSON', value: `+${live.brinsonAlphaPct}%`, sub: 'vs S&P 500', color: 'var(--purple-text, #a855f7)' },
                { label: 'MEUCCI ENB', value: `${live.enb}`, sub: `${activeHoldings.length} holdings`, color: 'var(--accent, #10b981)' },
            ],
            tableHeaders: ['TICKER', 'ASSET NAME', 'CLASS', 'WEIGHT (%)', 'CAPITAL ($)'],
            tableRows: activeHoldings.map(h => [
                h.sym,
                h.name || h.sym,
                h.cat || 'Asset',
                `${Number(h.weight || 0).toFixed(1)}%`,
                `$${Math.round(Number(h.weight || 0) * 1000).toLocaleString()}`,
            ]),
        });
    };

    return (
        <PortfolioCardShell
            badge="FILA 2 • IZQUIERDA"
            title={tx('Activos de la Cartera', 'Portfolio Holdings')}
            subtitle={
                txTpl("{0} activos • Suma: {1}%", [activeHoldings.length, totalWeight.toFixed(1)], "{0} assets • Total: {1}%", [activeHoldings.length, totalWeight.toFixed(1)])
            }
            color="var(--accent, #10b981)"
            rightSlot={
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                        onClick={() => applyPreset('CONSERVATIVE')}
                        style={{
                            padding: '2px 4px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-muted, rgba(148, 163, 184, 0.78))',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        {tx('Conservadora', 'Conservative')}
                    </button>
                    <button
                        onClick={() => applyPreset('BALANCED')}
                        style={{
                            padding: '2px 4px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-muted, rgba(148, 163, 184, 0.78))',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        {tx('Balanceada', 'Balanced')}
                    </button>
                    <button
                        onClick={() => applyPreset('QUANT')}
                        style={{
                            padding: '2px 4px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-muted, rgba(148, 163, 184, 0.78))',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        {tx('Quant', 'Quant')}
                    </button>
                    <span style={{ color: 'rgba(148, 163, 184, 0.25)', userSelect: 'none' }}>|</span>
                    <button
                        onClick={equalize}
                        style={{
                            padding: '2px 4px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-muted, rgba(148, 163, 184, 0.78))',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        {tx('1/N', '1/N')}
                    </button>
                    <button
                        onClick={normalize100}
                        style={{
                            padding: '2px 4px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--ui-accent, #10b981)',
                            textShadow: '0 0 10px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.65)',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer'
                        }}
                    >
                        100%
                    </button>
                    <span style={{ color: 'rgba(148, 163, 184, 0.25)', userSelect: 'none' }}>|</span>
                    <ExportFormatButton
                        format="CSV"
                        onClick={handleExportBuilderCsv}
                        title={tx('Exportar tabla de cartera (CSV)', 'Export portfolio holdings table (CSV)')}
                    />
                    <ExportFormatButton
                        format="PNG"
                        onClick={handleExportBuilderPng}
                        title={tx('Descargar imagen resumen de cartera (PNG)', 'Download portfolio summary snapshot (PNG)')}
                    />
                </div>
            }
            subBar={
                <>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Search size={12} color="var(--accent, #10b981)" />
                            <input
                                value={query}
                                onFocus={() => setOpenDrop(true)}
                                onChange={e => {
                                    setQuery(e.target.value);
                                    setOpenDrop(true);
                                }}
                                placeholder={
                                    tx('Buscar y sumar entre los 213 activos globales (ej. AAPL, ETH, YPF, EURUSD)...', 'Search & add across 213 global assets (e.g. AAPL, ETH, YPF, EURUSD)...')
                                }
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'var(--text-main, #f8fafc)',
                                    fontSize: '13px'
                                }}
                            />
                            <button
                                onClick={() => {
                                    setFilterMode(m => (m === 'WATCHLIST' ? 'ALL' : 'WATCHLIST'));
                                    setOpenDrop(true);
                                }}
                                style={{
                                    padding: '2px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: filterMode === 'WATCHLIST' ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                                    textShadow: filterMode === 'WATCHLIST' ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                    fontSize: '12px',
                                    fontWeight: filterMode === 'WATCHLIST' ? 800 : 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Watchlist ({watchlistSyms.length})
                            </button>
                            {openDrop && (
                                <button
                                    onClick={() => setOpenDrop(false)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim, #64748b)', cursor: 'pointer', fontSize: '11.5px' }}
                                >
                                    {tx('Cerrar', 'Close')}
                                </button>
                            )}
                        </div>
                        {openDrop && catalogMatches.length > 0 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '28px',
                                    left: 0,
                                    right: 0,
                                    zIndex: 45,
                                    background: 'var(--bg-glass-strong, #090d16)',
                                    border: '1px solid rgba(16,185,129,0.45)',
                                    borderRadius: '7px',
                                    padding: '5px',
                                    boxShadow: '0 14px 30px rgba(0,0,0,0.85)',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))',
                                    gap: '4px'
                                }}
                            >
                                {catalogMatches.map(item => (
                                    <button
                                        key={item.sym}
                                        onClick={() => addAsset(item)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '5px 8px',
                                            borderRadius: '5px',
                                            background: 'transparent',
                                            border: '1px solid var(--border-slate, rgba(148,163,184,0.14))',
                                            color: 'var(--text-main, #f8fafc)',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--pos-text, #6ee7b7)' }}>
                                                + {item.sym}
                                            </div>
                                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted, #94a3b8)' }}>{item.cat}</div>
                                        </div>
                                        <Plus size={12} color="var(--accent, #10b981)" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            }
        >
            <div className="resp-portfolio-table-scroll">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5px', minWidth: '460px' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '32px 1.3fr 0.85fr 118px 86px 46px',
                            alignItems: 'center',
                            padding: '2px 6px',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            color: 'var(--text-dim, #64748b)',
                            borderBottom: '1px solid var(--border-slate, rgba(148,163,184,0.12))'
                        }}
                    >
                        {tableHeaders.map((h, i) => {
                            if (i === 0) {
                                const allEnabled = holdings.length > 0 && holdings.every(it => it.enabled !== false);
                                return (
                                    <button
                                        key={h}
                                        type="button"
                                        onClick={() =>
                                            setHoldings(prev =>
                                                prev.map(it => ({ ...it, enabled: !allEnabled }))
                                            )
                                        }
                                        title={
                                            allEnabled
                                                ? tx('Desmarcar todos los activos (OFF)', 'Uncheck all holdings (OFF)')
                                                : tx('Marcar todos los activos (ON)', 'Check all holdings (ON)')
                                        }
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            background: 'transparent',
                                            border: 'none',
                                            padding: 0,
                                            color: allEnabled ? 'var(--accent, #10b981)' : 'var(--text-dim, #64748b)',
                                            fontSize: '11.5px',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        {allEnabled ? <CheckSquare size={12} color="var(--accent, #10b981)" /> : <Square size={12} color="var(--text-dim, #64748b)" />}
                                    </button>
                                );
                            }
                            return (
                                <span key={h} style={{ textAlign: colAlign(i, tableHeaders.length) }}>
                                    {h}
                                </span>
                            );
                        })}
                    </div>

                    <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4.5px', paddingRight: '2px' }}>
                        {holdings.length === 0 ? (
                            <div
                                style={{
                                    padding: '28px 14px',
                                    textAlign: 'center',
                                    fontSize: '12.5px',
                                    color: 'var(--text-muted, #94a3b8)',
                                    borderBottom: '1px solid var(--border-slate, rgba(148, 163, 184, 0.10))'
                                }}
                            >
                                {tx(
                                    'No hay activos en tu cartera (Watchlist en 0). Sumá activos desde el buscador de arriba, elegí un Preset (Conservadora / Balanceada / Quant) o marcalos con ★ en Markets.',
                                    'No assets in your portfolio (Watchlist is 0). Add assets using the search bar above, choose a Preset (Conservative / Balanced / Quant), or star (★) them in Markets.'
                                )}
                            </div>
                        ) : null}
                        {holdings.map(h => {
                            const isOn = h.enabled !== false;
                            const inWatch = watchlistSyms.includes(h.sym);
                            return (
                                <div
                                    key={h.sym}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '32px 1.3fr 0.85fr 118px 86px 46px',
                                        alignItems: 'center',
                                        padding: '6px 6px',
                                        background: 'transparent',
                                        borderBottom: '1px solid var(--border-slate, rgba(148, 163, 184, 0.10))',
                                        opacity: isOn ? 1 : 0.48
                                    }}
                                >
                                    {/* 1ª Columna: Izquierda */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <button
                                            onClick={() => toggleEnable(h.sym)}
                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                                        >
                                            {isOn ? <CheckSquare size={13} color="var(--accent, #10b981)" /> : <Square size={13} color="var(--text-dim, #64748b)" />}
                                        </button>
                                    </div>

                                    {/* Intermedia 1: Centrada */}
                                    <div style={{ textAlign: 'center' }}>
                                        {(() => {
                                            const liveAsset = getAssetBySymbol(h.sym);
                                            return (
                                                <>
                                                    <div
                                                        onClick={() => onOpenAssetInMarkets && onOpenAssetInMarkets(h.sym)}
                                                        title={tx('Abrir activo en Markets', 'Open asset in Markets')}
                                                        style={{
                                                            fontSize: '13px',
                                                            fontWeight: 900,
                                                            fontFamily: 'var(--font-mono)',
                                                            color: 'var(--text-main, #f8fafc)',
                                                            cursor: onOpenAssetInMarkets ? 'pointer' : 'default'
                                                        }}
                                                    >
                                                        {h.sym}{' '}
                                                        {liveAsset?.priceFormatted ? (
                                                            <span style={{ fontSize: '11px', fontWeight: 700, color: (liveAsset.chg ?? 0) >= 0 ? 'var(--pos-text, #6ee7b7)' : 'var(--neg-text, #fda4af)' }}>
                                                                {liveAsset.priceFormatted}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <div style={{ fontSize: '11.5px', color: 'var(--text-dim, #64748b)' }}>{liveAsset?.name || h.name}</div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Intermedia 2: Centrada */}
                                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #94a3b8)', textAlign: 'center' }}>{h.cat}</span>

                                    {/* Intermedia 3: Centrada */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                                        <button
                                            onClick={() => stepWeight(h.sym, -1)}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '4px',
                                                border: '1px solid var(--border-slate, rgba(148,163,184,0.22))',
                                                background: 'transparent',
                                                color: 'var(--text-body, #cbd5e1)',
                                                fontSize: '11px',
                                                fontWeight: 900,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={h.weight}
                                            onChange={e => updateWeight(h.sym, e.target.value)}
                                            style={{
                                                width: '44px',
                                                textAlign: 'center',
                                                background: 'transparent',
                                                border: '1px solid rgba(16,185,129,0.38)',
                                                borderRadius: '4px',
                                                color: 'var(--accent, #10b981)',
                                                fontSize: '13px',
                                                fontWeight: 900,
                                                fontFamily: 'var(--font-mono)',
                                                padding: '2px'
                                            }}
                                        />
                                        <button
                                            onClick={() => stepWeight(h.sym, 1)}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '4px',
                                                border: '1px solid var(--border-slate, rgba(148,163,184,0.22))',
                                                background: 'transparent',
                                                color: 'var(--text-body, #cbd5e1)',
                                                fontSize: '11px',
                                                fontWeight: 900,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Intermedia 4: Centrada */}
                                    <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-body, #cbd5e1)', textAlign: 'center' }}>
                                        ${isOn ? ((h.weight || 0) * 1000).toLocaleString() : '0'}
                                    </span>

                                    {/* Última Columna: Derecha */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                                        {onToggleWatchlist && (
                                            <button
                                                onClick={() => onToggleWatchlist(h.sym)}
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                                                title={tx('Seguir en Watchlist ★', 'Track in Watchlist ★')}
                                            >
                                                <Star size={11} color={inWatch ? 'var(--accent, #10b981)' : 'var(--text-dim, #64748b)'} fill={inWatch ? 'var(--accent, #10b981)' : 'none'} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => removeAsset(h.sym)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim, #64748b)', cursor: 'pointer', padding: 0 }}
                                            title={tx('Quitar activo', 'Remove asset')}
                                        >
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PortfolioCardShell>
    );
}

/* ───────────────────────────────────────────────────────────────────────────
   FILA 2 — DERECHA ARRIBA: RADIOGRAFÍA & ATRIBUCIÓN DE LA CARTERA (CON ALPHA BRINSON ADENTRO)
   ─────────────────────────────────────────────────────────────────────────── */
function Row2RightAnatomyAndAlpha({ holdings, liveMetrics, isES = false }) {
    const [tab, setTab] = useState('XRAY');
    const m = useMemo(() => liveMetrics || computeLivePortfolioMetrics(holdings, isES), [liveMetrics, holdings, isES]);

    const activeHoldings = holdings.filter(h => h.enabled !== false);
    const byCat = useMemo(() => {
        const map = {};
        activeHoldings.forEach(h => {
            map[h.cat] = (map[h.cat] || 0) + Number(h.weight || 0);
        });
        return Object.entries(map);
    }, [activeHoldings]);

    const brinsonHeaders = txList(['SECTOR', 'ASIGNACIÓN', 'SELECCIÓN', 'INTERACCIÓN', 'TOTAL ALPHA'], ['SECTOR', 'ALLOCATION', 'SELECTION', 'INTERACTION', 'TOTAL ALPHA']);
    const brinsonItems = [
        [tx('Tecnología & IA (NVDA, MSFT)', 'Tech & AI (NVDA, MSFT)'), '+1.85%', '+3.40%', '+0.45%', '+5.70%', +5.7],
        [tx('Activos Digitales (BTC)', 'Digital Assets (BTC)'), '+1.10%', '+1.25%', '+0.15%', '+2.50%', +2.5],
        [tx('Metales Preciosos (GLD)', 'Precious Metals (GLD)'), '+0.64%', '+0.18%', '+0.04%', '+0.86%', +0.86],
        [tx('Renta Fija Larga (TLT)', 'Long Fixed Income (TLT)'), '-0.52%', '+0.12%', '-0.06%', '-0.46%', -0.46]
    ];

    const xrayHeaders = txList(['ACTIVO SUBYACENTE', 'TENENCIA DIRECTA', 'PESO OCULTO EN ETF', 'EXPOSICIÓN REAL'], ['UNDERLYING ASSET', 'DIRECT HOLDING', 'HIDDEN ETF WEIGHT', 'TRUE EXPOSURE']);
    const xrayItems = m.xrayItems?.length
        ? m.xrayItems
        : [
              ['NVDA', '22.0%', tx('+2.4% (vía SPY)', '+2.4% (via SPY)'), tx('24.4% REAL', '24.4% TRUE'), -6],
              ['MSFT', '10.0%', tx('+2.1% (vía SPY)', '+2.1% (via SPY)'), tx('12.1% REAL', '12.1% TRUE'), +5],
              ['GLD', '18.0%', tx('+0.0% (Directo)', '+0.0% (Direct)'), tx('18.0% REAL', '18.0% TRUE'), +4],
              ['AAPL', '0.0%', tx('+1.9% (vía SPY)', '+1.9% (via SPY)'), tx('1.9% REAL', '1.9% TRUE'), +3]
          ];

    const custHeaders = txList(['CUSTODIO', '% CARTERA', 'CDS SPREAD', 'COBERTURA LEGAL'], ['CUSTODIAN', '% PORTFOLIO', 'CDS SPREAD', 'LEGAL COVERAGE']);
    const custItems = [
        ['Interactive Brokers / DTC', `${m.custBrokersPct.toFixed(1)}%`, '42 bps', tx('Cubierto SIPC $500k', 'SIPC Insured $500k'), +8],
        ['HSBC Bullion Vault (GLD)', `${m.custCommodityPct.toFixed(1)}%`, '38 bps', tx('Oro Físico Asignado', 'Allocated Physical Gold'), +9],
        ['Coinbase Custody Cold', `${m.custCryptoPct.toFixed(1)}%`, '115 bps', tx('Multisig Frío', 'Cold Multisig'), +4]
    ];

    return (
        <PortfolioCardShell
            badge="FILA 2 • DERECHA ARRIBA"
            title={tx('Exposición y Atribución', 'Exposure & Attribution')}
            color="var(--accent, #10b981)"
            style={{ flex: 1 }}
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                        { id: 'XRAY', lbl: tx('Solapamiento', 'Overlap') },
                        { id: 'EXP', lbl: tx('Exposición', 'Exposure') },
                        { id: 'ALPHA', lbl: tx('Atribución', 'Attribution') },
                        { id: 'YIELD', lbl: tx('Flujo de Caja', 'Cash Flow') },
                        { id: 'CUST', lbl: tx('Custodia', 'Custody') }
                    ].map(t => {
                        const active = tab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                style={{
                                    padding: '2px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: active ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                                    textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                    fontSize: '12px',
                                    fontWeight: active ? 800 : 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                {t.lbl}
                            </button>
                        );
                    })}
                </div>
            }
        >
            {tab === 'XRAY' && (
                <div className="resp-portfolio-table-scroll">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '6px', fontSize: '11.5px', fontFamily: 'var(--font-mono)', minWidth: '410px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.1fr 1fr', color: 'var(--text-dim, #64748b)', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                        {xrayHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, xrayHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {xrayItems.map((it, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1.1fr 1fr',
                                padding: '6px 6px',
                                borderRadius: '5px',
                                background: 'transparent',
                                borderBottom: '1px solid var(--border-slate, rgba(148, 163, 184, 0.08))',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontWeight: 900, color: 'var(--text-main, #f8fafc)' }}>{it[0]}</span>
                            <span style={{ textAlign: 'center', color: 'var(--text-body, #cbd5e1)' }}>{it[1]}</span>
                            <span style={{ textAlign: 'center', color: 'var(--pos-text, #6ee7b7)' }}>{it[2]}</span>
                            <span style={{ textAlign: 'right', padding: '1.5px 6px', borderRadius: '4px', fontWeight: 900, justifySelf: 'end', ...getSemanticReturnStyle(it[4], 10) }}>
                                {it[3]}
                            </span>
                        </div>
                    ))}
                </div>
                </div>
            )}

            {tab === 'EXP' && (
                <div className="resp-portfolio-3col-inner" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11.5px' }}>
                    <div style={{ background: 'transparent', padding: '7px', borderRadius: '6px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-muted, #94a3b8)', marginBottom: '3px', fontSize: '11.5px' }}>
                            {tx('CLASE DE ACTIVO', 'ASSET CLASS')}
                        </div>
                        {byCat.map(([c, w]) => (
                            <div key={c} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                <span style={{ color: 'var(--text-secondary, #e2e8f0)' }}>{c}</span>
                                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent, #10b981)', fontWeight: 800 }}>{w.toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: 'transparent', padding: '7px', borderRadius: '6px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-muted, #94a3b8)', marginBottom: '3px', fontSize: '11.5px' }}>
                            {tx('MONEDA SUBYACENTE', 'UNDERLYING CURRENCY')}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>{tx('USD Duro', 'Hard USD')}</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent, #10b981)', fontWeight: 800 }}>68%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>{tx('Oro Físico', 'Physical Gold')}</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--pos-text, #6ee7b7)', fontWeight: 800 }}>18%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{tx('Crypto Descentr.', 'Decentr. Crypto')}</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--pos-text-soft, #a7f3d0)', fontWeight: 800 }}>14%</span></div>
                    </div>
                    <div style={{ background: 'transparent', padding: '7px', borderRadius: '6px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-muted, #94a3b8)', marginBottom: '3px', fontSize: '11.5px' }}>
                            {tx('LIQUIDEZ DE SALIDA', 'EXIT LIQUIDITY')}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>{tx('Inmediata T+0', 'Immediate T+0')}</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent, #10b981)', fontWeight: 800 }}>86%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>Spot 24/7</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--pos-text, #6ee7b7)', fontWeight: 800 }}>14%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{tx('Ilíquido (>3d)', 'Illiquid (>3d)')}</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim, #64748b)', fontWeight: 800 }}>0%</span></div>
                    </div>
                </div>
            )}

            {tab === 'ALPHA' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 0.9fr', color: 'var(--text-dim, #64748b)', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                        {brinsonHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, brinsonHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {brinsonItems.map((it, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 0.9fr',
                                padding: '5px 6px',
                                borderRadius: '5px',
                                background: 'transparent',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontFamily: 'sans-serif', fontWeight: 700, color: 'var(--text-secondary, #e2e8f0)' }}>{it[0]}</span>
                            <span style={{ textAlign: 'center', color: it[1].startsWith('-') ? 'var(--neg-text, #fda4af)' : 'var(--pos-text, #6ee7b7)' }}>{it[1]}</span>
                            <span style={{ textAlign: 'center', color: 'var(--accent, #10b981)' }}>{it[2]}</span>
                            <span style={{ textAlign: 'center', color: 'var(--text-muted, #94a3b8)' }}>{it[3]}</span>
                            <span style={{ textAlign: 'right', padding: '1.5px 6px', borderRadius: '4px', fontWeight: 900, justifySelf: 'end', ...getSemanticReturnStyle(it[5], 6) }}>
                                {it[4]}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'YIELD' && (
                <div className="resp-portfolio-3col-inner" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <div style={{ background: 'transparent', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: 'var(--text-dim, #64748b)', fontSize: '11.5px', fontWeight: 800 }}>{tx('CUPONES TLT (4.4%)', 'TLT COUPONS (4.4%)')}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--accent, #10b981)', fontSize: '13px', marginTop: '2px' }}>
                            +${m.couponsAnnualUsd.toLocaleString()} {tx('/ año', '/ yr')}
                        </div>
                    </div>
                    <div style={{ background: 'transparent', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: 'var(--text-dim, #64748b)', fontSize: '11.5px', fontWeight: 800 }}>{tx('DIVIDENDOS ACCIONES / ETF', 'EQUITY / ETF DIVIDENDS')}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--pos-text, #6ee7b7)', fontSize: '13px', marginTop: '2px' }}>
                            +${m.dividendsAnnualUsd.toLocaleString()} {tx('/ año', '/ yr')}
                        </div>
                    </div>
                    <div style={{ background: 'transparent', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: 'var(--text-dim, #64748b)', fontSize: '11.5px', fontWeight: 800 }}>{tx('TOTAL RENTA PASIVA', 'TOTAL PASSIVE YIELD')}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--accent, #10b981)', fontSize: '13px', marginTop: '2px' }}>
                            +${m.totalYieldUsd.toLocaleString()} ({m.totalYieldPct}%)
                        </div>
                    </div>
                </div>
            )}

            {tab === 'CUST' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.8fr 1.1fr', color: 'var(--text-dim, #64748b)', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                        {custHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, custHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {custItems.map((c, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1.4fr 0.8fr 0.8fr 1.1fr',
                                padding: '5px 6px',
                                borderRadius: '5px',
                                background: 'transparent',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontFamily: 'sans-serif', fontWeight: 800, color: 'var(--text-secondary, #e2e8f0)' }}>{c[0]}</span>
                            <span style={{ textAlign: 'center', color: 'var(--pos-text, #6ee7b7)', fontWeight: 900 }}>{c[1]}</span>
                            <span style={{ textAlign: 'center', color: 'var(--text-muted, #94a3b8)' }}>{c[2]}</span>
                            <span style={{ textAlign: 'right', padding: '1.5px 6px', borderRadius: '4px', fontWeight: 800, justifySelf: 'end', ...getSemanticReturnStyle(c[4], 10) }}>
                                {c[3]}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </PortfolioCardShell>
    );
}

/* ───────────────────────────────────────────────────────────────────────────
   FILA 2 — DERECHA ABAJO: CALENDARIO HEATMAP DE RETORNOS MENSUALES (GRADIENTE VERDE/ROJO)
   ─────────────────────────────────────────────────────────────────────────── */
function Row2RightMonthlyCalendar({ isES = false }) {
    const headers = txList(['AÑO', 'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC', 'YTD'], ['YEAR', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'YTD']);
    return (
        <PortfolioCardShell
            badge="FILA 2 • DERECHA ABAJO"
            title={tx('Retornos Mensuales', 'Monthly Returns')}
            subtitle={tx('Ene – Dic', 'Jan – Dec')}
            color="var(--accent, #10b981)"
            style={{ flex: 1 }}
        >
            <div className="resp-portfolio-table-scroll">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '6px', minWidth: '510px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '42px repeat(12, 1fr) 54px', gap: '3px', fontSize: '11.5px', color: 'var(--text-dim, #64748b)', fontWeight: 800 }}>
                    {headers.map((h, i) => (
                        <span key={h} style={{ textAlign: colAlign(i, headers.length) }}>{h}</span>
                    ))}
                </div>
                {MONTHLY_HEATMAP.map(row => (
                    <div key={row.yr} style={{ display: 'grid', gridTemplateColumns: '42px repeat(12, 1fr) 54px', gap: '3px', alignItems: 'center' }}>
                        <span style={{ textAlign: 'left', fontSize: '11.5px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--text-body, #cbd5e1)' }}>
                            {row.yr}
                        </span>
                        {row.m.map((v, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '6px 1px',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                    fontSize: '11.5px',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: 800,
                                    ...getSemanticReturnStyle(v, 4.5)
                                }}
                            >
                                {v > 0 ? `+${v.toFixed(1)}%` : `${v.toFixed(1)}%`}
                            </div>
                        ))}
                        <span
                            style={{
                                textAlign: 'right',
                                fontSize: '11.5px',
                                fontWeight: 900,
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--pos-text, #6ee7b7)'
                            }}
                        >
                            +{row.ytd}%
                        </span>
                    </div>
                ))}
            </div>
            </div>
        </PortfolioCardShell>
    );
}

/* ───────────────────────────────────────────────────────────────────────────
   FILA 3 (100% ANCHO): SERIE DE TIEMPO DEL BACKTESTING HISTÓRICO + MULTI-ESTRATEGIA (#10)
   ─────────────────────────────────────────────────────────────────────────── */
function Row3FullWidthBacktest({ holdings, isES = false }) {
    const [activeBench, setActiveBench] = useState('spx');
    const [timeframe, setTimeframe] = useState('1Y');
    const meta = BENCH_META[activeBench];

    const activeFactor = useMemo(() => {
        const activeWeight = holdings.filter(h => h.enabled !== false).reduce((s, h) => s + Number(h.weight || 0), 0);
        return Math.max(0.65, Math.min(1.25, activeWeight / 100));
    }, [holdings]);

    const chartData = useMemo(() => {
        const sliceMap = { '3M': 4, '6M': 6, '1Y': 12, '3Y': 12, MAX: 12 };
        const count = sliceMap[timeframe] || 12;
        return BASE_BACKTEST.slice(BASE_BACKTEST.length - count).map(d => ({
            ...d,
            port: Number((100 + (d.port - 100) * activeFactor * (timeframe === '3Y' ? 1.35 : timeframe === 'MAX' ? 1.6 : 1)).toFixed(1))
        }));
    }, [timeframe, activeFactor]);

    return (
        <PortfolioCardShell
            badge="FILA 3 • ANCHO COMPLETO (100%)"
            title={tx('Rendimiento Histórico', 'Historical Performance')}
            subtitle={txTpl("Ventana {0} • Cartera vs {1}", [timeframe, meta.label], "{0} Window • Portfolio vs {1}", [timeframe, meta.label])}
            color="var(--accent, #10b981)"
            rightSlot={
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {['3M', '6M', '1Y', '3Y', 'MAX'].map(tf => {
                            const active = timeframe === tf;
                            return (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    style={{
                                        padding: '2px 5px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: active ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                                        textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                        fontSize: '12px',
                                        fontWeight: active ? 800 : 600,
                                        fontFamily: 'var(--font-mono)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {tf}
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {Object.entries(BENCH_META).map(([k, v]) => {
                            const active = activeBench === k;
                            return (
                                <button
                                    key={k}
                                    onClick={() => setActiveBench(k)}
                                    style={{
                                        padding: '2px 5px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: active ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                                        textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                        fontSize: '12px',
                                        fontWeight: active ? 800 : 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    vs {v.label} ({v.ret})
                                </button>
                            );
                        })}
                    </div>
                </div>
            }
        >
            <div style={{ width: '100%', height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 6, right: 14, left: -16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="prodV1PortGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent, #10b981)" stopOpacity={0.45} />
                                <stop offset="95%" stopColor="var(--accent, #10b981)" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                        <XAxis dataKey="date" tick={{ fill: 'var(--text-dim, #64748b)', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                        <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--text-dim, #64748b)', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip
                            contentStyle={{ background: 'var(--bg-glass-strong, #090d16)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '6px', fontSize: '13px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey={activeBench}
                            name={meta.label}
                            stroke="var(--text-muted, #94a3b8)"
                            strokeWidth={1.6}
                            strokeDasharray="4 3"
                            fill="none"
                        />
                        <Area
                            type="monotone"
                            dataKey="port"
                            name={tx('Tu Cartera Activa', 'Active Portfolio')}
                            stroke="var(--accent, #10b981)"
                            strokeWidth={2.3}
                            fill="url(#prodV1PortGrad)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </PortfolioCardShell>
    );
}

export default function PortfolioVista1Builder({
    holdings,
    setHoldings,
    watchlistSyms,
    onToggleWatchlist,
    onOpenAssetInMarkets,
    langCode = 'EN'
}) {
    const { localeTick } = useViewLocale(langCode);
    const isES = `${langCode}_${localeTick}`;
    const liveMetrics = useMemo(() => computeLivePortfolioMetrics(holdings, isES), [holdings, isES]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Row1SummaryPills holdings={holdings} liveMetrics={liveMetrics} isES={isES} />
            <div className="resp-portfolio-builder-row2" style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.15fr', gap: '12px', alignItems: 'stretch' }}>
                <Row2LeftWeightTable
                    holdings={holdings}
                    setHoldings={setHoldings}
                    watchlistSyms={watchlistSyms}
                    onToggleWatchlist={onToggleWatchlist}
                    onOpenAssetInMarkets={onOpenAssetInMarkets}
                    isES={isES}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                    <Row2RightAnatomyAndAlpha holdings={holdings} liveMetrics={liveMetrics} isES={isES} />
                    <Row2RightMonthlyCalendar isES={isES} />
                </div>
            </div>
            <Row3FullWidthBacktest holdings={holdings} isES={isES} />
        </div>
    );
}

