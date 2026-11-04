import React, { useState, useMemo } from 'react';
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
    const activeList = holdings.filter(h => h.enabled !== false);

    const pills = [
        {
            lbl: isES ? 'RETORNO ANUAL (CAGR)' : 'ANNUAL RETURN (CAGR)',
            val: `${liveMetrics.cagrPct >= 0 ? '+' : ''}${liveMetrics.cagrPct}%`,
            sub: 'vs +16.5% Benchmark SPX',
            col: liveMetrics.cagrPct >= 0 ? '#10b981' : '#f43f5e'
        },
        {
            lbl: 'SHARPE / SORTINO',
            val: `${liveMetrics.sharpeRatio} / ${liveMetrics.sortinoRatio}`,
            sub: isES ? `Volatilidad Anual σ: ${liveMetrics.portfolioVolPct}%` : `Annual Volatility σ: ${liveMetrics.portfolioVolPct}%`,
            col: '#10b981'
        },
        {
            lbl: 'VaR 95% / CVaR 99% (1D)',
            val: `${liveMetrics.var95Pct}% / ${liveMetrics.cvar99Pct}%`,
            sub: isES ? 'Pérdida diaria esperada cola' : 'Expected daily tail loss',
            col: '#f43f5e'
        },
        {
            lbl: 'MAX DRAWDOWN (12M)',
            val: `${liveMetrics.maxDrawdownPct}%`,
            sub: isES ? 'Recuperación media: 14 días' : 'Avg recovery: 14 days',
            col: '#f43f5e'
        },
        {
            lbl: 'ALPHA BRINSON (12M)',
            val: `${liveMetrics.brinsonAlphaPct >= 0 ? '+' : ''}${liveMetrics.brinsonAlphaPct}%`,
            sub: isES ? `Beta Cartera: ${liveMetrics.portfolioBeta} vs SPX` : `Portfolio Beta: ${liveMetrics.portfolioBeta} vs SPX`,
            col: liveMetrics.brinsonAlphaPct >= 0 ? '#10b981' : '#f43f5e'
        },
        {
            lbl: isES ? 'ACTIVOS SELECCIONADOS' : 'SELECTED ASSETS',
            val: `${activeList.length} / ${holdings.length}`,
            sub: isES
                ? `ENB: ${liveMetrics.enb} apuestas efectivas`
                : `ENB: ${liveMetrics.enb} effective bets`,
            col: '#10b981'
        }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '8px' }}>
            {pills.map(p => (
                <div
                    key={p.lbl}
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(148, 163, 184, 0.22)',
                        borderLeft: `3px solid ${p.col}`,
                        borderRadius: '10px',
                        padding: '10px 13px'
                    }}
                >
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#94a3b8' }}>{p.lbl}</div>
                    <div style={{ fontSize: '19px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: p.col, marginTop: '3px' }}>
                        {p.val}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{p.sub}</div>
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
        if (holdings.length <= 1) return;
        setHoldings(prev => prev.filter(h => h.sym !== sym));
    };

    const addAsset = (item) => {
        setHoldings(prev => [
            ...prev,
            { sym: item.sym, name: item.name || item.sym, cat: item.cat || 'Equities', weight: 8, enabled: true }
        ]);
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

    const tableHeaders = isES
        ? ['ON', 'ACTIVO', 'CLASE', 'PESO (%)', 'CAPITAL ($)', 'ACCIÓN']
        : ['ON', 'ASSET', 'CLASS', 'WEIGHT (%)', 'CAPITAL ($)', 'ACTION'];

    return (
        <PortfolioCardShell
            badge="FILA 2 • IZQUIERDA"
            title={isES ? 'Activos de la Cartera' : 'Portfolio Holdings'}
            subtitle={
                isES
                    ? `${activeHoldings.length} activos • Suma: ${totalWeight.toFixed(1)}%`
                    : `${activeHoldings.length} assets • Total: ${totalWeight.toFixed(1)}%`
            }
            color="#10b981"
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                        onClick={equalize}
                        style={{
                            padding: '2px 4px',
                            border: 'none',
                            background: 'transparent',
                            color: 'rgba(148, 163, 184, 0.78)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        {isES ? 'Pesos Iguales' : 'Equal Weight'}
                    </button>
                    <button
                        onClick={normalize100}
                        style={{
                            padding: '2px 4px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--ui-accent, #10b981)',
                            textShadow: '0 0 10px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.65)',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer'
                        }}
                    >
                        {isES ? 'Ajustar 100%' : 'Normalize 100%'}
                    </button>
                    <button
                        onClick={() => setHoldings(INITIAL_HOLDINGS)}
                        style={{
                            padding: '2px 4px',
                            border: 'none',
                            background: 'transparent',
                            color: 'rgba(148, 163, 184, 0.78)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        {isES ? 'Restaurar Base' : 'Reset Base'}
                    </button>
                </div>
            }
            subBar={
                <>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Search size={12} color="#10b981" />
                            <input
                                value={query}
                                onFocus={() => setOpenDrop(true)}
                                onChange={e => {
                                    setQuery(e.target.value);
                                    setOpenDrop(true);
                                }}
                                placeholder={
                                    isES
                                        ? 'Buscar y sumar entre los 213 activos globales (ej. AAPL, ETH, YPF, EURUSD)...'
                                        : 'Search & add across 213 global assets (e.g. AAPL, ETH, YPF, EURUSD)...'
                                }
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#f8fafc',
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
                                    color: filterMode === 'WATCHLIST' ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
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
                                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '11.5px' }}
                                >
                                    {isES ? 'Cerrar' : 'Close'}
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
                                    background: '#090d16',
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
                                            border: '1px solid rgba(148,163,184,0.14)',
                                            color: '#f8fafc',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#6ee7b7' }}>
                                                + {item.sym}
                                            </div>
                                            <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{item.cat}</div>
                                        </div>
                                        <Plus size={12} color="#10b981" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '32px 1.3fr 0.85fr 118px 86px 46px',
                        padding: '2px 6px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        color: '#64748b',
                        borderBottom: '1px solid rgba(148,163,184,0.12)'
                    }}
                >
                    {tableHeaders.map((h, i) => (
                        <span key={h} style={{ textAlign: colAlign(i, tableHeaders.length) }}>
                            {h}
                        </span>
                    ))}
                </div>

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
                                borderBottom: '1px solid rgba(148, 163, 184, 0.10)',
                                opacity: isOn ? 1 : 0.48
                            }}
                        >
                            {/* 1ª Columna: Izquierda */}
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <button
                                    onClick={() => toggleEnable(h.sym)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                                >
                                    {isOn ? <CheckSquare size={13} color="#10b981" /> : <Square size={13} color="#64748b" />}
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
                                                title={isES ? 'Abrir activo en Markets' : 'Open asset in Markets'}
                                                style={{
                                                    fontSize: '13px',
                                                    fontWeight: 900,
                                                    fontFamily: 'var(--font-mono)',
                                                    color: '#f8fafc',
                                                    cursor: onOpenAssetInMarkets ? 'pointer' : 'default'
                                                }}
                                            >
                                                {h.sym}{' '}
                                                {liveAsset?.priceFormatted ? (
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: (liveAsset.chg ?? 0) >= 0 ? '#6ee7b7' : '#fda4af' }}>
                                                        {liveAsset.priceFormatted}
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div style={{ fontSize: '11.5px', color: '#64748b' }}>{liveAsset?.name || h.name}</div>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Intermedia 2: Centrada */}
                            <span style={{ fontSize: '11.5px', color: '#94a3b8', textAlign: 'center' }}>{h.cat}</span>

                            {/* Intermedia 3: Centrada */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                                <button
                                    onClick={() => stepWeight(h.sym, -1)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(148,163,184,0.22)',
                                        background: 'transparent',
                                        color: '#cbd5e1',
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
                                        color: '#10b981',
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
                                        border: '1px solid rgba(148,163,184,0.22)',
                                        background: 'transparent',
                                        color: '#cbd5e1',
                                        fontSize: '11px',
                                        fontWeight: 900,
                                        cursor: 'pointer'
                                    }}
                                >
                                    +
                                </button>
                            </div>

                            {/* Intermedia 4: Centrada */}
                            <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#cbd5e1', textAlign: 'center' }}>
                                ${isOn ? ((h.weight || 0) * 1000).toLocaleString() : '0'}
                            </span>

                            {/* Última Columna: Derecha */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                                {onToggleWatchlist && (
                                    <button
                                        onClick={() => onToggleWatchlist(h.sym)}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                                        title={isES ? 'Seguir en Watchlist ★' : 'Track in Watchlist ★'}
                                    >
                                        <Star size={11} color={inWatch ? '#10b981' : '#64748b'} fill={inWatch ? '#10b981' : 'none'} />
                                    </button>
                                )}
                                <button
                                    onClick={() => removeAsset(h.sym)}
                                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                                    title={isES ? 'Quitar activo' : 'Remove asset'}
                                >
                                    <Trash2 size={11} />
                                </button>
                            </div>
                        </div>
                    );
                })}
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

    const brinsonHeaders = isES
        ? ['SECTOR', 'ASIGNACIÓN', 'SELECCIÓN', 'INTERACCIÓN', 'TOTAL ALPHA']
        : ['SECTOR', 'ALLOCATION', 'SELECTION', 'INTERACTION', 'TOTAL ALPHA'];
    const brinsonItems = isES
        ? [
              ['Tecnología & IA (NVDA, MSFT)', '+1.85%', '+3.40%', '+0.45%', '+5.70%', +5.7],
              ['Activos Digitales (BTC)', '+1.10%', '+1.25%', '+0.15%', '+2.50%', +2.5],
              ['Metales Preciosos (GLD)', '+0.64%', '+0.18%', '+0.04%', '+0.86%', +0.86],
              ['Renta Fija Larga (TLT)', '-0.52%', '+0.12%', '-0.06%', '-0.46%', -0.46]
          ]
        : [
              ['Tech & AI (NVDA, MSFT)', '+1.85%', '+3.40%', '+0.45%', '+5.70%', +5.7],
              ['Digital Assets (BTC)', '+1.10%', '+1.25%', '+0.15%', '+2.50%', +2.5],
              ['Precious Metals (GLD)', '+0.64%', '+0.18%', '+0.04%', '+0.86%', +0.86],
              ['Long Fixed Income (TLT)', '-0.52%', '+0.12%', '-0.06%', '-0.46%', -0.46]
          ];

    const xrayHeaders = isES
        ? ['ACTIVO SUBYACENTE', 'TENENCIA DIRECTA', 'PESO OCULTO EN ETF', 'EXPOSICIÓN REAL']
        : ['UNDERLYING ASSET', 'DIRECT HOLDING', 'HIDDEN ETF WEIGHT', 'TRUE EXPOSURE'];
    const xrayItems = m.xrayItems?.length
        ? m.xrayItems
        : isES
        ? [
              ['NVDA', '22.0%', '+2.4% (vía SPY)', '24.4% REAL', -6],
              ['MSFT', '10.0%', '+2.1% (vía SPY)', '12.1% REAL', +5],
              ['GLD', '18.0%', '+0.0% (Directo)', '18.0% REAL', +4],
              ['AAPL', '0.0%', '+1.9% (vía SPY)', '1.9% REAL', +3]
          ]
        : [
              ['NVDA', '22.0%', '+2.4% (via SPY)', '24.4% TRUE', -6],
              ['MSFT', '10.0%', '+2.1% (via SPY)', '12.1% TRUE', +5],
              ['GLD', '18.0%', '+0.0% (Direct)', '18.0% TRUE', +4],
              ['AAPL', '0.0%', '+1.9% (via SPY)', '1.9% TRUE', +3]
          ];

    const custHeaders = isES
        ? ['CUSTODIO', '% CARTERA', 'CDS SPREAD', 'COBERTURA LEGAL']
        : ['CUSTODIAN', '% PORTFOLIO', 'CDS SPREAD', 'LEGAL COVERAGE'];
    const custItems = isES
        ? [
              ['Interactive Brokers / DTC', `${m.custBrokersPct.toFixed(1)}%`, '42 bps', 'Cubierto SIPC $500k', +8],
              ['HSBC Bullion Vault (GLD)', `${m.custCommodityPct.toFixed(1)}%`, '38 bps', 'Oro Físico Asignado', +9],
              ['Coinbase Custody Cold', `${m.custCryptoPct.toFixed(1)}%`, '115 bps', 'Multisig Frío', +4]
          ]
        : [
              ['Interactive Brokers / DTC', `${m.custBrokersPct.toFixed(1)}%`, '42 bps', 'SIPC Insured $500k', +8],
              ['HSBC Bullion Vault (GLD)', `${m.custCommodityPct.toFixed(1)}%`, '38 bps', 'Allocated Physical Gold', +9],
              ['Coinbase Custody Cold', `${m.custCryptoPct.toFixed(1)}%`, '115 bps', 'Cold Multisig', +4]
          ];

    return (
        <PortfolioCardShell
            badge="FILA 2 • DERECHA ARRIBA"
            title={isES ? 'Exposición y Atribución' : 'Exposure & Attribution'}
            color="#10b981"
            style={{ flex: 1 }}
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                        { id: 'XRAY', lbl: isES ? 'Solapamiento' : 'Overlap' },
                        { id: 'EXP', lbl: isES ? 'Exposición' : 'Exposure' },
                        { id: 'ALPHA', lbl: isES ? 'Atribución' : 'Attribution' },
                        { id: 'YIELD', lbl: isES ? 'Flujo de Caja' : 'Cash Flow' },
                        { id: 'CUST', lbl: isES ? 'Custodia' : 'Custody' }
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
                                    color: active ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
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
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '6px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.1fr 1fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
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
                                borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontWeight: 900, color: '#f8fafc' }}>{it[0]}</span>
                            <span style={{ textAlign: 'center', color: '#cbd5e1' }}>{it[1]}</span>
                            <span style={{ textAlign: 'center', color: '#6ee7b7' }}>{it[2]}</span>
                            <span style={{ textAlign: 'right', padding: '1.5px 6px', borderRadius: '4px', fontWeight: 900, justifySelf: 'end', ...getSemanticReturnStyle(it[4], 10) }}>
                                {it[3]}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'EXP' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11.5px' }}>
                    <div style={{ background: 'transparent', padding: '7px', borderRadius: '6px' }}>
                        <div style={{ fontWeight: 800, color: '#94a3b8', marginBottom: '3px', fontSize: '11.5px' }}>
                            {isES ? 'CLASE DE ACTIVO' : 'ASSET CLASS'}
                        </div>
                        {byCat.map(([c, w]) => (
                            <div key={c} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                <span style={{ color: '#e2e8f0' }}>{c}</span>
                                <span style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 800 }}>{w.toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: 'transparent', padding: '7px', borderRadius: '6px' }}>
                        <div style={{ fontWeight: 800, color: '#94a3b8', marginBottom: '3px', fontSize: '11.5px' }}>
                            {isES ? 'MONEDA SUBYACENTE' : 'UNDERLYING CURRENCY'}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>{isES ? 'USD Duro' : 'Hard USD'}</span><span style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 800 }}>68%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>{isES ? 'Oro Físico' : 'Physical Gold'}</span><span style={{ fontFamily: 'var(--font-mono)', color: '#6ee7b7', fontWeight: 800 }}>18%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{isES ? 'Crypto Descentr.' : 'Decentr. Crypto'}</span><span style={{ fontFamily: 'var(--font-mono)', color: '#a7f3d0', fontWeight: 800 }}>14%</span></div>
                    </div>
                    <div style={{ background: 'transparent', padding: '7px', borderRadius: '6px' }}>
                        <div style={{ fontWeight: 800, color: '#94a3b8', marginBottom: '3px', fontSize: '11.5px' }}>
                            {isES ? 'LIQUIDEZ DE SALIDA' : 'EXIT LIQUIDITY'}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>{isES ? 'Inmediata T+0' : 'Immediate T+0'}</span><span style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 800 }}>86%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>Spot 24/7</span><span style={{ fontFamily: 'var(--font-mono)', color: '#6ee7b7', fontWeight: 800 }}>14%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{isES ? 'Ilíquido (>3d)' : 'Illiquid (>3d)'}</span><span style={{ fontFamily: 'var(--font-mono)', color: '#64748b', fontWeight: 800 }}>0%</span></div>
                    </div>
                </div>
            )}

            {tab === 'ALPHA' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 0.9fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
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
                            <span style={{ textAlign: 'left', fontFamily: 'sans-serif', fontWeight: 700, color: '#e2e8f0' }}>{it[0]}</span>
                            <span style={{ textAlign: 'center', color: it[1].startsWith('-') ? '#fda4af' : '#6ee7b7' }}>{it[1]}</span>
                            <span style={{ textAlign: 'center', color: '#10b981' }}>{it[2]}</span>
                            <span style={{ textAlign: 'center', color: '#94a3b8' }}>{it[3]}</span>
                            <span style={{ textAlign: 'right', padding: '1.5px 6px', borderRadius: '4px', fontWeight: 900, justifySelf: 'end', ...getSemanticReturnStyle(it[5], 6) }}>
                                {it[4]}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'YIELD' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <div style={{ background: 'transparent', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 800 }}>{isES ? 'CUPONES TLT (4.4%)' : 'TLT COUPONS (4.4%)'}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#10b981', fontSize: '13px', marginTop: '2px' }}>
                            +${m.couponsAnnualUsd.toLocaleString()} {isES ? '/ año' : '/ yr'}
                        </div>
                    </div>
                    <div style={{ background: 'transparent', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 800 }}>{isES ? 'DIVIDENDOS ACCIONES / ETF' : 'EQUITY / ETF DIVIDENDS'}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#6ee7b7', fontSize: '13px', marginTop: '2px' }}>
                            +${m.dividendsAnnualUsd.toLocaleString()} {isES ? '/ año' : '/ yr'}
                        </div>
                    </div>
                    <div style={{ background: 'transparent', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 800 }}>{isES ? 'TOTAL RENTA PASIVA' : 'TOTAL PASSIVE YIELD'}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#10b981', fontSize: '13px', marginTop: '2px' }}>
                            +${m.totalYieldUsd.toLocaleString()} ({m.totalYieldPct}%)
                        </div>
                    </div>
                </div>
            )}

            {tab === 'CUST' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.8fr 1.1fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
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
                            <span style={{ textAlign: 'left', fontFamily: 'sans-serif', fontWeight: 800, color: '#e2e8f0' }}>{c[0]}</span>
                            <span style={{ textAlign: 'center', color: '#6ee7b7', fontWeight: 900 }}>{c[1]}</span>
                            <span style={{ textAlign: 'center', color: '#94a3b8' }}>{c[2]}</span>
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
    const headers = isES
        ? ['AÑO', 'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC', 'YTD']
        : ['YEAR', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'YTD'];
    return (
        <PortfolioCardShell
            badge="FILA 2 • DERECHA ABAJO"
            title={isES ? 'Retornos Mensuales' : 'Monthly Returns'}
            subtitle={isES ? 'Ene – Dic' : 'Jan – Dec'}
            color="#10b981"
            style={{ flex: 1 }}
        >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '6px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '42px repeat(12, 1fr) 54px', gap: '3px', fontSize: '11.5px', color: '#64748b', fontWeight: 800 }}>
                    {headers.map((h, i) => (
                        <span key={h} style={{ textAlign: colAlign(i, headers.length) }}>{h}</span>
                    ))}
                </div>
                {MONTHLY_HEATMAP.map(row => (
                    <div key={row.yr} style={{ display: 'grid', gridTemplateColumns: '42px repeat(12, 1fr) 54px', gap: '3px', alignItems: 'center' }}>
                        <span style={{ textAlign: 'left', fontSize: '11.5px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
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
                                color: '#6ee7b7'
                            }}
                        >
                            +{row.ytd}%
                        </span>
                    </div>
                ))}
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
            title={isES ? 'Rendimiento Histórico' : 'Historical Performance'}
            subtitle={isES ? `Ventana ${timeframe} • Cartera vs ${meta.label}` : `${timeframe} Window • Portfolio vs ${meta.label}`}
            color="#10b981"
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
                                        color: active ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
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
                                        color: active ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
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
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                        <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip
                            contentStyle={{ background: '#090d16', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '6px', fontSize: '13px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey={activeBench}
                            name={meta.label}
                            stroke="#94a3b8"
                            strokeWidth={1.6}
                            strokeDasharray="4 3"
                            fill="none"
                        />
                        <Area
                            type="monotone"
                            dataKey="port"
                            name={isES ? 'Tu Cartera Activa' : 'Active Portfolio'}
                            stroke="#10b981"
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
    const isES = langCode === 'ES';
    const liveMetrics = useMemo(() => computeLivePortfolioMetrics(holdings, isES), [holdings, isES]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Row1SummaryPills holdings={holdings} liveMetrics={liveMetrics} isES={isES} />
            <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.15fr', gap: '12px', alignItems: 'stretch' }}>
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

