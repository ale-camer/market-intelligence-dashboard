import { tx, txList, txTpl, useViewLocale } from '../../data/i18n/viewLocaleService';
import React, { useState, useMemo } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    CartesianGrid,
    ReferenceLine
} from 'recharts';
import { CheckSquare, Square } from 'lucide-react';
import {
    getSemanticReturnStyle,
    colAlign,
    PortfolioCardShell,
    INITIAL_HOLDINGS,
    ASSET_RISK_PROFILES,
    PORTFOLIO_NODES,
    SIMULATED_CLOUD,
    CORR_NORMAL,
    CORR_STRESS,
    MONTE_CARLO_BASE,
    RISK_TIME_SERIES
} from './portfolioConstants';
import { computeLivePortfolioMetrics } from '../../services/committeeService';

/* FILA 1: 6 PÍLDORAS DE RIESGO Y RETORNO */
function Row1SummaryPills({ liveMetrics, isES = false }) {
    const m = liveMetrics || computeLivePortfolioMetrics(INITIAL_HOLDINGS, isES);
    const medProj = Number((m.cagrPct * 0.82).toFixed(1));
    const p95Proj = Number((medProj + m.portfolioVolPct * 1.95).toFixed(1));
    const p05Proj = Number((medProj - m.portfolioVolPct * 1.65).toFixed(1));

    const pills = [
        {
            lbl: tx('PROYECCIÓN MEDIANA (12M)', 'MEDIAN PROJECTION (12M)'),
            val: `${medProj >= 0 ? '+' : ''}${medProj}%`,
            sub: `P95: +${p95Proj}% | P05: ${p05Proj}%`,
            col: '#10b981'
        },
        {
            lbl: 'SHARPE / SORTINO',
            val: `${m.sharpeRatio.toFixed(2)} / ${m.sortinoRatio.toFixed(2)}`,
            sub: txTpl("Volatilidad Anual σ: {0}%", [m.portfolioVolPct], "Annual Volatility σ: {0}%", [m.portfolioVolPct]),
            col: '#10b981'
        },
        {
            lbl: 'VaR 95% / CVaR 99% (1D)',
            val: `${m.var95Pct}% / ${m.cvar99Pct}%`,
            sub: tx('Pérdida esperada en cola diaria', 'Expected daily tail loss'),
            col: '#f43f5e'
        },
        {
            lbl: 'MAX DRAWDOWN (12M)',
            val: `${m.maxDrawdownPct.toFixed(2)}%`,
            sub: tx('Recuperación media: 14 días', 'Avg recovery: 14 days'),
            col: '#f43f5e'
        },
        {
            lbl: 'STRESS CRASH 2008',
            val: `${m.stress2008Pct > 0 ? '+' : ''}${m.stress2008Pct}%`,
            sub: 'vs -42.0% Benchmark S&P 500',
            col: '#f43f5e'
        },
        {
            lbl: tx('RÉGIMEN MARKOV ACTUAL', 'CURRENT MARKOV REGIME'),
            val: 'Bull Quiet (62%)',
            sub: tx('Retorno esp. régimen: +2.4%/mes', 'Expected regime return: +2.4%/mo'),
            col: '#10b981'
        }
    ];
    return (
        <div className="resp-kpi-grid-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '8px' }}>
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

/* CUADRANTE 1: MARKOWITZ 2D 100% DINÁMICO (320PX) */
function Quad1DynamicMarkowitz({ liveMetrics, isES = false }) {
    const m = liveMetrics || computeLivePortfolioMetrics(INITIAL_HOLDINGS, isES);
    const activeProfiles = m.enrichedHoldings?.length ? m.enrichedHoldings : ASSET_RISK_PROFILES;

    const dynamicNodes = useMemo(
        () =>
            PORTFOLIO_NODES.map(p =>
                p.id === 'PORT'
                    ? {
                          ...p,
                          label: tx('★ Tu Cartera', '★ Your Portfolio'),
                          vol: m.portfolioVolPct,
                          ret: m.cagrPct,
                          sharpe: m.sharpeRatio
                      }
                    : p
            ),
        [m.portfolioVolPct, m.cagrPct, m.sharpeRatio, isES]
    );

    const [showAssets, setShowAssets] = useState(true);
    const [showCloud, setShowCloud] = useState(true);
    const [showCML, setShowCML] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [activeTargetId, setActiveTargetId] = useState('PORT');

    const displayPoint = selectedPoint || {
        name: tx('Tu Cartera Actual', 'Current Portfolio'),
        vol: m.portfolioVolPct,
        ret: m.cagrPct,
        sharpe: m.sharpeRatio
    };

    const toX = (vol) => 42 + ((Math.max(5, Math.min(48, vol)) - 5) / 43) * 365;
    const toY = (ret) => 146 - ((Math.max(2, Math.min(52, ret)) - 2) / 50) * 130;

    const frontierPath = useMemo(() => {
        const pts = [];
        for (let v = 7.5; v <= 42; v += 1.5) {
            const r = 8.5 + 11.8 * Math.sqrt(v - 7.0);
            pts.push(`${pts.length === 0 ? 'M' : 'L'} ${toX(v).toFixed(1)} ${toY(r).toFixed(1)}`);
        }
        return pts.join(' ');
    }, []);

    return (
        <PortfolioCardShell
            badge="CUADRANTE 1 • IZQ ARRIBA"
            title={tx('Riesgo vs Retorno', 'Risk vs Return')}
            color="#10b981"
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {dynamicNodes.slice(0, 3).map(p => {
                        const active = activeTargetId === p.id;
                        const label =
                            p.id === 'PORT'
                                ? tx('Mi Cartera', 'My Portfolio')
                                : p.id === 'MINVAR'
                                ? tx('Mínima Varianza', 'Min Variance')
                                : tx('Máximo Sharpe', 'Max Sharpe');
                        return (
                            <button
                                key={p.id}
                                onClick={() => {
                                    setActiveTargetId(p.id);
                                    setSelectedPoint({ name: label, vol: p.vol, ret: p.ret, sharpe: p.sharpe });
                                }}
                                style={{
                                    padding: '2px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: active ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                    textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                    fontSize: '12px',
                                    fontWeight: active ? 800 : 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            }
            subBar={
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>
                            {tx('CAPAS:', 'LAYERS:')}
                        </span>
                        {[
                            { lbl: tx('Activos', 'Assets'), val: showAssets, set: setShowAssets },
                            { lbl: tx('Nube Monte Carlo', 'Monte Carlo Cloud'), val: showCloud, set: setShowCloud },
                            { lbl: tx('Tangente CML', 'CML Tangent'), val: showCML, set: setShowCML }
                        ].map(t => (
                            <button
                                key={t.lbl}
                                onClick={() => t.set(v => !v)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'transparent',
                                    border: 'none',
                                    color: t.val ? 'var(--ui-accent, #10b981)' : '#64748b',
                                    textShadow: t.val ? '0 0 10px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.7)' : 'none',
                                    fontSize: '11.5px',
                                    fontWeight: t.val ? 800 : 600,
                                    cursor: 'pointer',
                                    padding: '1px 3px'
                                }}
                            >
                                {t.lbl}
                            </button>
                        ))}
                    </div>
                    <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: '#e2e8f0' }}>
                        <strong style={{ color: '#6ee7b7' }}>{displayPoint.name}:</strong> σ {displayPoint.vol}% | E[R] +{displayPoint.ret}% | Sharpe {displayPoint.sharpe}
                    </div>
                </>
            }
        >
            <svg width="100%" height="185" viewBox="0 0 435 162" style={{ background: 'transparent', borderRadius: '6px' }}>
                {[10, 20, 30, 40].map(v => (
                    <g key={v}>
                        <line x1={toX(v)} y1="12" x2={toX(v)} y2="146" stroke="rgba(148,163,184,0.08)" strokeDasharray="2 2" />
                        <text x={toX(v)} y="157" fill="#64748b" fontSize="8" textAnchor="middle">σ {v}%</text>
                    </g>
                ))}
                {[10, 25, 40].map(r => (
                    <g key={r}>
                        <line x1="42" y1={toY(r)} x2="415" y2={toY(r)} stroke="rgba(148,163,184,0.08)" strokeDasharray="2 2" />
                        <text x="38" y={toY(r) + 3} fill="#64748b" fontSize="8" textAnchor="end">+{r}%</text>
                    </g>
                ))}
                <line x1="42" y1="146" x2="415" y2="146" stroke="rgba(148,163,184,0.28)" />
                <line x1="42" y1="12" x2="42" y2="146" stroke="rgba(148,163,184,0.28)" />

                {showCloud &&
                    SIMULATED_CLOUD.map((c, idx) => (
                        <circle key={idx} cx={toX(c.vol)} cy={toY(c.ret)} r="2.6" fill="rgba(148,163,184,0.28)" />
                    ))}

                {showCML && (
                    <line x1="42" y1={toY(4.5)} x2={toX(30)} y2={toY(49)} stroke="rgba(16,185,129,0.55)" strokeWidth="1.3" strokeDasharray="4 3" />
                )}

                <path d={frontierPath} fill="none" stroke="#10b981" strokeWidth="2.3" />

                {showAssets &&
                    activeProfiles.map(a => {
                        const cx = toX(a.vol);
                        const cy = toY(a.ret);
                        return (
                            <g
                                key={a.sym}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setSelectedPoint({ name: `${tx('Activo', 'Asset')} ${a.sym}`, vol: a.vol, ret: a.ret, sharpe: a.sharpe })}
                                onClick={() => setSelectedPoint({ name: `${tx('Activo', 'Asset')} ${a.sym}`, vol: a.vol, ret: a.ret, sharpe: a.sharpe })}
                            >
                                <circle cx={cx} cy={cy} r="4.2" fill={a.sharpe >= 1.5 ? '#10b981' : '#f43f5e'} stroke="#090d16" strokeWidth="1.2" />
                                <text x={cx + 6} y={cy + 3} fill="#cbd5e1" fontSize="8.5" fontWeight="800">{a.sym}</text>
                            </g>
                        );
                    })}

                {dynamicNodes.map(p => {
                    const cx = toX(p.vol);
                    const cy = toY(p.ret);
                    const isMain = p.id === activeTargetId;
                    return (
                        <g
                            key={p.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setActiveTargetId(p.id);
                                setSelectedPoint({ name: p.label, vol: p.vol, ret: p.ret, sharpe: p.sharpe });
                            }}
                        >
                            <circle cx={cx} cy={cy} r={isMain ? 6.5 : 4.5} fill={p.isOptimal ? '#10b981' : '#f43f5e'} stroke="#f8fafc" strokeWidth={isMain ? 2 : 1} />
                            {isMain && <text x={cx - 8} y={cy - 10} textAnchor="end" fill="#6ee7b7" fontSize="9.5" fontWeight="900">{p.label}</text>}
                        </g>
                    );
                })}
            </svg>
        </PortfolioCardShell>
    );
}

/* CUADRANTE 2: TORNADO DE STRESS, VaR 95% & CAPTURA POR ACTIVO (320PX) */
function Quad2TornadoAndAssetTail({ liveMetrics, isES = false }) {
    const m = liveMetrics || computeLivePortfolioMetrics(INITIAL_HOLDINGS, isES);
    const activeProfiles = m.enrichedHoldings?.length ? m.enrichedHoldings : ASSET_RISK_PROFILES;

    const [subView, setSubView] = useState('TORNADO');
    const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
    const [selectedAsset, setSelectedAsset] = useState('ALL');

    const scenarios = m.stressScenarios?.length
        ? m.stressScenarios
        : [
              {
                  name: tx('Crash Lehman 2008 (-42% SPX)', 'Lehman Crash 2008 (-42% SPX)'),
                  port: -11.4,
                  bench: -42.0,
                  byAsset: [
                      { sym: 'TLT', chg: +14.2 },
                      { sym: 'GLD', chg: +9.8 },
                      { sym: 'MSFT', chg: -22.0 },
                      { sym: 'SPY', chg: -42.0 },
                      { sym: 'NVDA', chg: -48.5 }
                  ]
              }
          ];

    const activeScenario = scenarios[selectedScenarioIdx] || scenarios[0];
    const varHeaders = txList(['ACTIVO', 'PESO', 'VOLAT. σ', 'VaR 95% (1D)', 'ROL EN COLA'], ['ASSET', 'WEIGHT', 'VOLAT. σ', 'VaR 95% (1D)', 'TAIL ROLE']);
    const capHeaders = txList(['ACTIVO', 'UPSIDE CAPTURE', 'DOWNSIDE CAPTURE', 'ASIMETRÍA NETA'], ['ASSET', 'UPSIDE CAPTURE', 'DOWNSIDE CAPTURE', 'NET ASYMMETRY']);

    return (
        <PortfolioCardShell
            badge="CUADRANTE 2 • IZQ ABAJO"
            title={tx('Escenarios de Estrés', 'Stress Scenarios')}
            color="#f43f5e"
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {[
                        { id: 'TORNADO', lbl: tx('Estrés Histórico', 'Historical Stress') },
                        { id: 'VAR_ASSET', lbl: tx('VaR por Activo', 'Asset VaR') },
                        { id: 'CAPTURE', lbl: tx('Captura', 'Capture') }
                    ].map(t => {
                        const active = subView === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setSubView(t.id)}
                                style={{
                                    padding: '2px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: active ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                    textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                    fontSize: '12px',
                                    fontWeight: active ? 800 : 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {t.lbl}
                            </button>
                        );
                    })}
                </div>
            }
            subBar={
                subView === 'TORNADO' ? (
                    <>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#94a3b8' }}>
                            {tx('IMPACTO POR ACTIVO', 'IMPACT BY ASSET')} ({activeScenario.name}):
                        </span>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {activeScenario.byAsset.map(a => (
                                <span
                                    key={a.sym}
                                    style={{
                                        padding: '1px 5px',
                                        borderRadius: '3px',
                                        fontSize: '11.5px',
                                        fontFamily: 'var(--font-mono)',
                                        fontWeight: 900,
                                        ...getSemanticReturnStyle(a.chg, 35)
                                    }}
                                >
                                    {a.sym} {a.chg > 0 ? `+${a.chg}%` : `${a.chg}%`}
                                </span>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#94a3b8' }}>
                            {tx('FILTRAR ACTIVO:', 'FILTER ASSET:')}
                        </span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['ALL', ...activeProfiles.map(a => a.sym).slice(0, 7)].map(sym => (
                                <button
                                    key={sym}
                                    onClick={() => setSelectedAsset(sym)}
                                    style={{
                                        padding: '1px 4px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: selectedAsset === sym ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                        textShadow: selectedAsset === sym ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                        fontSize: '12px',
                                        fontWeight: selectedAsset === sym ? 800 : 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {sym === 'ALL' ? (tx('Todos', 'All')) : sym}
                                </button>
                            ))}
                        </div>
                    </>
                )
            }
        >
            {subView === 'TORNADO' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr 112px', fontSize: '11.5px', fontWeight: 800, color: '#64748b', padding: '0 6px' }}>
                        <span style={{ textAlign: 'left' }}>{tx('ESCENARIO HISTÓRICO / MACRO', 'HISTORICAL / MACRO SCENARIO')}</span>
                        <span style={{ textAlign: 'center' }}>{tx('MAGNITUD DE IMPACTO', 'IMPACT MAGNITUDE')}</span>
                        <span style={{ textAlign: 'right' }}>{tx('CARTERA (BENCH)', 'PORTFOLIO (BENCH)')}</span>
                    </div>
                    {scenarios.map((s, idx) => {
                        const pillStyle = getSemanticReturnStyle(s.port, 25);
                        const isSel = selectedScenarioIdx === idx;
                        return (
                            <div
                                key={s.name}
                                onClick={() => setSelectedScenarioIdx(idx)}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1.45fr 1fr 112px',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '11.5px',
                                    padding: '5px 8px',
                                    borderRadius: isSel ? '7px' : '0px',
                                    background: isSel ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.14)' : 'transparent',
                                    border: isSel ? '1px solid var(--ui-accent, #10b981)' : '1px solid transparent',
                                    borderBottom: isSel
                                        ? '1px solid var(--ui-accent, #10b981)'
                                        : '1px solid rgba(148, 163, 184, 0.10)',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ textAlign: 'left', color: '#f8fafc', fontWeight: 800 }}>{s.name}</span>
                                <div style={{ height: '8px', background: 'transparent', borderRadius: '99px', overflow: 'hidden', display: 'flex' }}>
                                    <div
                                        style={{
                                            width: `${Math.min(100, Math.abs(s.port) * 3.5)}%`,
                                            height: '100%',
                                            background: s.port >= 0 ? 'linear-gradient(90deg, #059669, #10b981)' : 'linear-gradient(90deg, #e11d48, #f43f5e)'
                                        }}
                                    />
                                </div>
                                <span
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontWeight: 900,
                                        textAlign: 'right',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        justifySelf: 'end',
                                        ...pillStyle
                                    }}
                                >
                                    {s.port > 0 ? `+${s.port}%` : `${s.port}%`} <span style={{ opacity: 0.7, fontSize: '11.5px' }}>({s.bench}%)</span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {subView === 'VAR_ASSET' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 0.7fr 0.8fr 0.9fr 1fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                        {varHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, varHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {activeProfiles.filter(a => selectedAsset === 'ALL' || a.sym === selectedAsset).map(a => (
                        <div
                            key={a.sym}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '0.8fr 0.7fr 0.8fr 0.9fr 1fr',
                                padding: '4px 6px',
                                borderRadius: '4px',
                                background: 'transparent',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontWeight: 900, color: '#f8fafc' }}>{a.sym}</span>
                            <span style={{ textAlign: 'center', color: '#94a3b8' }}>{a.weight}%</span>
                            <span style={{ textAlign: 'center', color: '#cbd5e1' }}>{a.vol}%</span>
                            <span style={{ textAlign: 'center', padding: '1px 5px', borderRadius: '4px', fontWeight: 900, ...getSemanticReturnStyle(a.var95 * 3, 15) }}>
                                {a.var95}%
                            </span>
                            <span style={{ textAlign: 'right', fontFamily: 'sans-serif', fontSize: '11.5px', color: a.beta <= 0.1 ? '#6ee7b7' : '#fda4af', fontWeight: 800 }}>
                                {a.beta <= 0.1
                                    ? tx('Escudo Defensivo', 'Defensive Shield')
                                    : tx('Generador Riesgo', 'Risk Driver')}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {subView === 'CAPTURE' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1fr 1fr 0.9fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                        {capHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, capHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {activeProfiles.filter(a => selectedAsset === 'ALL' || a.sym === selectedAsset).map(a => {
                        const netGood = a.upCap - a.dnCap;
                        return (
                            <div
                                key={a.sym}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '0.8fr 1fr 1fr 0.9fr',
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    background: 'transparent',
                                    alignItems: 'center'
                                }}
                            >
                                <span style={{ textAlign: 'left', fontWeight: 900, color: '#f8fafc' }}>{a.sym}</span>
                                <span style={{ textAlign: 'center', color: '#6ee7b7', fontWeight: 800 }}>{a.upCap}%</span>
                                <span style={{ textAlign: 'center', color: a.dnCap < 0 ? '#6ee7b7' : '#fda4af', fontWeight: 800 }}>{a.dnCap}%</span>
                                <span style={{ textAlign: 'right', padding: '1px 5px', borderRadius: '4px', fontWeight: 900, justifySelf: 'end', ...getSemanticReturnStyle(netGood / 4, 15) }}>
                                    {netGood > 0 ? `+${netGood} pts` : `${netGood} pts`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </PortfolioCardShell>
    );
}

/* CUADRANTE 3: MATRIZ DE CORRELACIÓN CRUZADA & SENSIBILIDAD POR ACTIVO (320PX) */
function Quad3CorrelationAndAssetBeta({ liveMetrics, isES = false }) {
    const m = liveMetrics || computeLivePortfolioMetrics(INITIAL_HOLDINGS, isES);
    const activeProfiles = (m.enrichedHoldings?.length ? m.enrichedHoldings : ASSET_RISK_PROFILES).slice(0, 6);
    const [corrRegime, setCorrRegime] = useState('NORMAL');
    const [subMode, setSubMode] = useState('MATRIX');
    const [focusAssetIdx, setFocusAssetIdx] = useState(null);

    const rawMatrix = corrRegime === 'NORMAL' ? (m.corrNormal || CORR_NORMAL) : (m.corrStress || CORR_STRESS);
    const activeMatrix = rawMatrix.slice(0, activeProfiles.length).map(r => r.slice(0, activeProfiles.length));
    const assets = activeProfiles.map(a => a.sym);
    const matHeaders = [tx('ACTIVO', 'ASSET'), ...assets];
    const betaHeaders = txList(['ACTIVO', 'BETA SPX', 'CORR MEDIA', 'SHARPE INDIV.', 'MEJOR RÉGIMEN'], ['ASSET', 'SPX BETA', 'AVG CORR', 'INDIV. SHARPE', 'BEST REGIME']);

    return (
        <PortfolioCardShell
            badge="CUADRANTE 3 • DER ARRIBA"
            title={tx('Correlación y Sensibilidad', 'Correlation & Sensitivity')}
            color="#10b981"
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {[
                        { id: 'MATRIX', lbl: tx('Matriz', 'Matrix') },
                        { id: 'BETAS', lbl: tx('Beta por Activo', 'Asset Beta') }
                    ].map(m => {
                        const active = subMode === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setSubMode(m.id)}
                                style={{
                                    padding: '2px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: active ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                    textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                    fontSize: '12px',
                                    fontWeight: active ? 800 : 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {m.lbl}
                            </button>
                        );
                    })}
                </div>
            }
            subBar={
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>
                            {tx('RÉGIMEN:', 'REGIME:')}
                        </span>
                        <button
                            onClick={() => setCorrRegime('NORMAL')}
                            style={{
                                padding: '1px 4px',
                                border: 'none',
                                background: 'transparent',
                                color: corrRegime === 'NORMAL' ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                textShadow: corrRegime === 'NORMAL' ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                fontSize: '12px',
                                fontWeight: corrRegime === 'NORMAL' ? 800 : 600,
                                cursor: 'pointer'
                            }}
                        >
                            {tx('Mercado Normal (1Y)', 'Normal Market (1Y)')}
                        </button>
                        <button
                            onClick={() => setCorrRegime('STRESS')}
                            style={{
                                padding: '1px 4px',
                                border: 'none',
                                background: 'transparent',
                                color: corrRegime === 'STRESS' ? '#f43f5e' : 'rgba(148, 163, 184, 0.68)',
                                textShadow: corrRegime === 'STRESS' ? '0 0 12px rgba(244, 63, 94, 0.85)' : 'none',
                                fontSize: '12px',
                                fontWeight: corrRegime === 'STRESS' ? 800 : 600,
                                cursor: 'pointer'
                            }}
                        >
                            {tx('Cola de Crisis (Contagio)', 'Crisis Tail (Contagion)')}
                        </button>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                        {focusAssetIdx !== null
                            ? txTpl("Foco en {0}", [assets[focusAssetIdx]], "Focus on {0}", [assets[focusAssetIdx]])
                            : tx('Clic en activo para aislar fila', 'Click asset to isolate row')}
                    </span>
                </>
            }
        >
            {subMode === 'MATRIX' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: `52px repeat(${assets.length}, 1fr)`, gap: '3.5px', fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>
                        {matHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, matHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {activeMatrix.map((row, rIdx) => {
                        const dimmed = focusAssetIdx !== null && focusAssetIdx !== rIdx;
                        return (
                            <div key={assets[rIdx]} style={{ display: 'grid', gridTemplateColumns: `52px repeat(${assets.length}, 1fr)`, gap: '3.5px', alignItems: 'center' }}>
                                <button
                                    onClick={() => setFocusAssetIdx(focusAssetIdx === rIdx ? null : rIdx)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: focusAssetIdx === rIdx ? '#6ee7b7' : '#cbd5e1',
                                        fontWeight: 900,
                                        textAlign: 'left',
                                        fontSize: '11.5px',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    {assets[rIdx]}
                                </button>
                                {row.map((val, cIdx) => {
                                    const style =
                                        val === 1
                                            ? { background: 'rgba(148,163,184,0.16)', border: '1px solid rgba(148,163,184,0.25)', color: '#94a3b8' }
                                            : val < 0
                                            ? getSemanticReturnStyle(Math.abs(val) * 28, 15)
                                            : val > 0.5
                                            ? getSemanticReturnStyle(-val * 16, 15)
                                            : { background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.22)', color: '#a7f3d0' };
                                    return (
                                        <div
                                            key={cIdx}
                                            style={{
                                                padding: '4.5px 4px',
                                                borderRadius: '4px',
                                                fontWeight: 800,
                                                textAlign: colAlign(cIdx + 1, matHeaders.length),
                                                opacity: dimmed && focusAssetIdx !== cIdx ? 0.35 : 1,
                                                ...style
                                            }}
                                        >
                                            {val.toFixed(2)}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 0.8fr 0.9fr 1fr 1fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                        {betaHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, betaHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {activeProfiles.map((a, idx) => {
                        const row = activeMatrix[idx] || [1];
                        const avgCorr =
                            row.length > 1
                                ? ((row.reduce((s, v) => s + v, 0) - 1) / (row.length - 1)).toFixed(2)
                                : '0.00';
                        return (
                            <div
                                key={a.sym}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '0.8fr 0.8fr 0.9fr 1fr 1fr',
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    background: 'transparent',
                                    alignItems: 'center'
                                }}
                            >
                                <span style={{ textAlign: 'left', fontWeight: 900, color: '#f8fafc' }}>{a.sym}</span>
                                <span style={{ textAlign: 'center', color: a.beta < 0 ? '#6ee7b7' : a.beta > 1.2 ? '#fda4af' : '#cbd5e1' }}>
                                    {a.beta.toFixed(2)}
                                </span>
                                <span style={{ textAlign: 'center', padding: '1px 5px', borderRadius: '4px', fontWeight: 900, ...getSemanticReturnStyle(-parseFloat(avgCorr) * 20, 15) }}>
                                    r = {avgCorr}
                                </span>
                                <span style={{ textAlign: 'center', color: '#6ee7b7', fontWeight: 800 }}>{a.sharpe.toFixed(2)}</span>
                                <span style={{ textAlign: 'right', fontFamily: 'sans-serif', fontSize: '11.5px', color: '#cbd5e1' }}>{a.bestRegime}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </PortfolioCardShell>
    );
}

/* CUADRANTE 4: MATRIZ 2D CHOQUE TASAS×SPX & MATRIZ DE REGÍMENES DE MARKOV (#11) (320PX) */
function Quad4ShockAndMarkovMatrices({ liveMetrics, isES = false }) {
    const m = liveMetrics || computeLivePortfolioMetrics(INITIAL_HOLDINGS, isES);
    const activeProfiles = m.enrichedHoldings?.length ? m.enrichedHoldings : ASSET_RISK_PROFILES;

    const [tab, setTab] = useState('SHOCK2D');
    const [targetSym, setTargetSym] = useState('CARTERA');

    const assetSens = {
        CARTERA: { rateMult: 1.0, eqMult: 1.0 },
        NVDA: { rateMult: 1.45, eqMult: 1.85 },
        SPY: { rateMult: 0.85, eqMult: 1.35 },
        BTC: { rateMult: 1.30, eqMult: 1.70 },
        GLD: { rateMult: -0.65, eqMult: -0.25 },
        TLT: { rateMult: 2.10, eqMult: -0.55 }
    };

    const selectedProf = activeProfiles.find(a => a.sym === targetSym);
    const mult =
        assetSens[targetSym] ||
        (selectedProf
            ? {
                  rateMult: selectedProf.beta < 0 ? 1.5 : Number(Math.max(0.4, selectedProf.beta * 0.85).toFixed(2)),
                  eqMult: Number(selectedProf.beta.toFixed(2))
              }
            : assetSens.CARTERA);
    const displayTarget = targetSym === 'CARTERA' ? (tx('CARTERA', 'PORTFOLIO')) : targetSym;
    const shockHeaders = [
        `${tx('TASAS', 'RATES')} \\ SPX (${displayTarget})`,
        'S&P 500 -15%',
        'S&P 500 0%',
        'S&P 500 +15%'
    ];
    const shockRows = [
        { rate: tx('Tasas -100 bps', 'Rates -100 bps'), base: [-4.2, 3.8, 12.4] },
        { rate: tx('Tasas 0 bps (Base)', 'Rates 0 bps (Base)'), base: [-6.8, 0.0, 8.9] },
        { rate: tx('Tasas +100 bps', 'Rates +100 bps'), base: [-10.4, -3.1, 4.2] },
        { rate: tx('Tasas +200 bps', 'Rates +200 bps'), base: [-14.2, -6.4, 1.1] }
    ];

    const markovHeaders = txList(['RÉGIMEN', 'BQ', 'BV', 'INF', 'CR', 'ACTIVO LÍDER', 'E[RET]'], ['REGIME', 'BQ', 'BV', 'INF', 'CR', 'TOP ASSET', 'E[RET]']);
    const regimes = [
        { name: 'Bull Quiet (62%)', bq: '74%', bv: '16%', inf: '7%', cr: '3%', exp: 2.4, top: 'NVDA (+4.8%/m)' },
        { name: 'Bull Volatile (21%)', bq: '28%', bv: '52%', inf: '12%', cr: '8%', exp: 1.1, top: 'BTC (+5.4%/m)' },
        { name: 'Inflationary (12%)', bq: '14%', bv: '22%', inf: '54%', cr: '10%', exp: -0.8, top: 'GLD (+3.1%/m)' },
        { name: 'Crash / Crisis (5%)', bq: '10%', bv: '30%', inf: '18%', cr: '42%', exp: -4.2, top: 'TLT (+2.9%/m)' }
    ];

    return (
        <PortfolioCardShell
            badge="CUADRANTE 4 • DER ABAJO"
            title={
                tab === 'SHOCK2D'
                    ? tx('Choque de Mercado', 'Market Shock')
                    : tx('Regímenes de Mercado', 'Market Regimes')
            }
            color="#f43f5e"
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {[
                        { id: 'SHOCK2D', lbl: tx('Tasas vs S&P 500', 'Rates vs S&P 500') },
                        { id: 'MARKOV', lbl: tx('Regímenes', 'Regimes') }
                    ].map(m => {
                        const active = tab === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setTab(m.id)}
                                style={{
                                    padding: '2px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: active ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                    textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                    fontSize: '12px',
                                    fontWeight: active ? 800 : 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {m.lbl}
                            </button>
                        );
                    })}
                </div>
            }
            subBar={
                tab === 'SHOCK2D' ? (
                    <>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#94a3b8' }}>
                            {tx('VER CHOQUE SOBRE:', 'SHOCK TARGET:')}
                        </span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['CARTERA', ...activeProfiles.map(a => a.sym).slice(0, 5)].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setTargetSym(s)}
                                    style={{
                                        padding: '1px 4px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: targetSym === s ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                        textShadow: targetSym === s ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                        fontSize: '12px',
                                        fontWeight: targetSym === s ? 800 : 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {s === 'CARTERA' ? (tx('CARTERA', 'PORTFOLIO')) : s}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#94a3b8' }}>
                        {tx('PROBABILIDAD DE TRANSICIÓN A 30 DÍAS + ACTIVO LÍDER POR RÉGIMEN', '30-DAY TRANSITION PROBABILITY + TOP ASSET PER REGIME')}
                    </span>
                )
            }
        >
            {tab === 'SHOCK2D' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr repeat(3, 1fr)', gap: '4px', fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>
                        {shockHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, shockHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {shockRows.map(r => (
                        <div key={r.rate} style={{ display: 'grid', gridTemplateColumns: '1.15fr repeat(3, 1fr)', gap: '4px', alignItems: 'center' }}>
                            <span style={{ color: '#e2e8f0', fontWeight: 800, textAlign: 'left' }}>{r.rate}</span>
                            {r.base.map((c, idx) => {
                                const val = Number((c * (idx === 1 ? mult.rateMult : mult.eqMult)).toFixed(1));
                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '5px 6px',
                                            borderRadius: '5px',
                                            fontWeight: 900,
                                            textAlign: colAlign(idx + 1, shockHeaders.length),
                                            ...getSemanticReturnStyle(val, 18)
                                        }}
                                    >
                                        {val > 0 ? `+${val}%` : `${val}%`}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.35fr repeat(4, 0.5fr) 1.05fr 0.75fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                        {markovHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, markovHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {regimes.map(r => (
                        <div
                            key={r.name}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1.35fr repeat(4, 0.5fr) 1.05fr 0.75fr',
                                padding: '4.5px 6px',
                                borderRadius: '5px',
                                background: 'transparent',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontFamily: 'sans-serif', fontWeight: 800, color: r.exp > 0 ? '#6ee7b7' : '#fda4af', fontSize: '11.5px' }}>
                                {r.name}
                            </span>
                            <span style={{ textAlign: 'center', color: '#a7f3d0' }}>{r.bq}</span>
                            <span style={{ textAlign: 'center', color: '#cbd5e1' }}>{r.bv}</span>
                            <span style={{ textAlign: 'center', color: '#fecdd3' }}>{r.inf}</span>
                            <span style={{ textAlign: 'center', color: '#fda4af', fontWeight: 800 }}>{r.cr}</span>
                            <span style={{ textAlign: 'center', color: '#6ee7b7', fontSize: '11.5px' }}>{r.top}</span>
                            <span style={{ textAlign: 'right', padding: '1.5px 5px', borderRadius: '4px', fontWeight: 900, justifySelf: 'end', ...getSemanticReturnStyle(r.exp, 4.5) }}>
                                {r.exp > 0 ? `+${r.exp}%` : `${r.exp}%`}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </PortfolioCardShell>
    );
}

/* FILA 3 (100% ANCHO): PROYECCIÓN MONTE CARLO / DRAWDOWN / ROLLING 60D */
function Row3FullWidthProjectionInteractive({ liveMetrics, isES = false }) {
    const m = liveMetrics || computeLivePortfolioMetrics(INITIAL_HOLDINGS, isES);
    const activeProfiles = m.enrichedHoldings?.length ? m.enrichedHoldings : ASSET_RISK_PROFILES;

    const [seriesMode, setSeriesMode] = useState('MC');
    const [horizon, setHorizon] = useState('12M');
    const [showP95, setShowP95] = useState(true);
    const [showP50, setShowP50] = useState(true);
    const [showP05, setShowP05] = useState(true);
    const [showBench, setShowBench] = useState(true);
    const [compareAsset, setCompareAsset] = useState('NVDA');

    const mcData = useMemo(() => {
        const mult = horizon === '6M' ? 0.55 : horizon === '24M' ? 1.75 : 1.0;
        return MONTE_CARLO_BASE.map(d => ({
            m: d.m,
            p95: Number((100 + (d.p95 - 100) * mult).toFixed(1)),
            p50: Number((100 + (d.p50 - 100) * mult).toFixed(1)),
            p05: Number((100 + (d.p05 - 100) * mult).toFixed(1)),
            bench: Number((100 + (d.bench - 100) * mult).toFixed(1))
        }));
    }, [horizon]);

    return (
        <PortfolioCardShell
            badge="FILA 3 • ANCHO COMPLETO (100%)"
            title={
                seriesMode === 'MC'
                    ? tx('Proyección Monte Carlo', 'Monte Carlo Projection')
                    : seriesMode === 'DD'
                    ? tx('Caída Histórica (Drawdown)', 'Historical Drawdown')
                    : tx('Sharpe y Beta Rodante', 'Rolling Sharpe & Beta')
            }
            color={seriesMode === 'DD' ? '#f43f5e' : '#10b981'}
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                        { id: 'MC', lbl: 'Monte Carlo' },
                        { id: 'DD', lbl: 'Drawdown' },
                        { id: 'ROLL', lbl: tx('Sharpe y Beta', 'Sharpe & Beta') }
                    ].map(m => {
                        const active = seriesMode === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setSeriesMode(m.id)}
                                style={{
                                    padding: '2px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: active ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                    textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                    fontSize: '12px',
                                    fontWeight: active ? 800 : 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {m.lbl}
                            </button>
                        );
                    })}
                </div>
            }
            subBar={
                seriesMode === 'MC' ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>
                                {tx('BANDAS VISIBLES:', 'VISIBLE BANDS:')}
                            </span>
                            {[
                                { lbl: tx('P95 Optimista', 'P95 Bullish'), val: showP95, set: setShowP95, col: '#10b981' },
                                { lbl: tx('P50 Mediana', 'P50 Median'), val: showP50, set: setShowP50, col: '#6ee7b7' },
                                { lbl: tx('P05 Cola Adversa', 'P05 Tail Risk'), val: showP05, set: setShowP05, col: '#f43f5e' },
                                { lbl: 'Benchmark S&P 500', val: showBench, set: setShowBench, col: '#94a3b8' }
                            ].map(b => (
                                <button
                                    key={b.lbl}
                                    onClick={() => b.set(v => !v)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: 'transparent',
                                        border: 'none',
                                        color: b.val ? b.col : '#64748b',
                                        fontSize: '11.5px',
                                        fontWeight: b.val ? 800 : 600,
                                        cursor: 'pointer',
                                        padding: '1px 3px'
                                    }}
                                >
                                    {b.lbl}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 800 }}>
                                {tx('HORIZONTE:', 'HORIZON:')}
                            </span>
                            {['6M', '12M', '24M'].map(h => (
                                <button
                                    key={h}
                                    onClick={() => setHorizon(h)}
                                    style={{
                                        padding: '1px 4px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: horizon === h ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                        textShadow: horizon === h ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                        fontSize: '12px',
                                        fontWeight: horizon === h ? 800 : 600,
                                        fontFamily: 'var(--font-mono)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>
                            {tx('COMPARAR CONTRA ACTIVO INDIVIDUAL:', 'COMPARE AGAINST SINGLE ASSET:')}
                        </span>
                        {activeProfiles.map(a => a.sym).slice(0, 6).map(s => (
                            <button
                                key={s}
                                onClick={() => setCompareAsset(s)}
                                style={{
                                    padding: '1px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: compareAsset === s ? '#f43f5e' : 'rgba(148, 163, 184, 0.68)',
                                    textShadow: compareAsset === s ? '0 0 12px rgba(244, 63, 94, 0.85)' : 'none',
                                    fontSize: '12px',
                                    fontWeight: compareAsset === s ? 800 : 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )
            }
        >
            <div style={{ width: '100%', height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {seriesMode === 'MC' ? (
                        <AreaChart data={mcData} margin={{ top: 6, right: 14, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="prodV2McGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                                </linearGradient>
                                <linearGradient id="prodV2McRed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                            <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                            <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                            <RechartsTooltip contentStyle={{ background: '#090d16', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '6px', fontSize: '13px' }} />
                            {showP95 && <Area type="monotone" dataKey="p95" name={tx('P95 Banda Optimista', 'P95 Bullish Band')} stroke="#10b981" strokeWidth={2.2} fill="url(#prodV2McGreen)" />}
                            {showP50 && <Area type="monotone" dataKey="p50" name={tx('P50 Mediana', 'P50 Median')} stroke="#6ee7b7" strokeWidth={2} strokeDasharray="5 3" fill="none" />}
                            {showBench && <Area type="monotone" dataKey="bench" name={tx('S&P 500 Esperado', 'Expected S&P 500')} stroke="#94a3b8" strokeWidth={1.4} strokeDasharray="3 3" fill="none" />}
                            {showP05 && <Area type="monotone" dataKey="p05" name={tx('P05 Cola Adversa', 'P05 Adverse Tail')} stroke="#f43f5e" strokeWidth={2} fill="url(#prodV2McRed)" />}
                        </AreaChart>
                    ) : seriesMode === 'DD' ? (
                        <AreaChart data={RISK_TIME_SERIES} margin={{ top: 6, right: 14, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="prodV2DdRed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.45} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[-12.5, 0.5]} tick={{ fill: '#64748b', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                            <ReferenceLine y={0} stroke="rgba(148,163,184,0.35)" />
                            <RechartsTooltip contentStyle={{ background: '#090d16', border: '1px solid rgba(244,63,94,0.4)', borderRadius: '6px', fontSize: '13px' }} />
                            <Area type="monotone" dataKey="ddAsset" name={`Drawdown ${compareAsset} (%)`} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
                            <Area type="monotone" dataKey="ddPort" name={tx('★ Drawdown Tu Cartera (%)', '★ Portfolio Drawdown (%)')} stroke="#f43f5e" strokeWidth={2.2} fill="url(#prodV2DdRed)" />
                        </AreaChart>
                    ) : (
                        <AreaChart data={RISK_TIME_SERIES} margin={{ top: 6, right: 14, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="prodV2ShGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0.5, 2.4]} tick={{ fill: '#64748b', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                            <RechartsTooltip contentStyle={{ background: '#090d16', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '6px', fontSize: '13px' }} />
                            <Area type="monotone" dataKey="sharpe60" name="Rolling Sharpe 60D" stroke="#10b981" strokeWidth={2.2} fill="url(#prodV2ShGreen)" />
                            <Area type="monotone" dataKey="beta60" name="Rolling Beta 60D" stroke="#f43f5e" strokeWidth={1.6} strokeDasharray="4 3" fill="none" />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </div>
        </PortfolioCardShell>
    );
}

export default function PortfolioVista2Risk({ holdings = INITIAL_HOLDINGS, langCode = 'EN' }) {
    const { localeTick } = useViewLocale(langCode);
    const isES = `${langCode}_${localeTick}`;
    const liveMetrics = useMemo(() => computeLivePortfolioMetrics(holdings, isES), [holdings, isES]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Row1SummaryPills liveMetrics={liveMetrics} isES={isES} />
            <div className="resp-portfolio-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', alignItems: 'stretch' }}>
                <Quad1DynamicMarkowitz liveMetrics={liveMetrics} isES={isES} />
                <Quad3CorrelationAndAssetBeta liveMetrics={liveMetrics} isES={isES} />
                <Quad2TornadoAndAssetTail liveMetrics={liveMetrics} isES={isES} />
                <Quad4ShockAndMarkovMatrices liveMetrics={liveMetrics} isES={isES} />
            </div>
            <Row3FullWidthProjectionInteractive liveMetrics={liveMetrics} isES={isES} />
        </div>
    );
}

