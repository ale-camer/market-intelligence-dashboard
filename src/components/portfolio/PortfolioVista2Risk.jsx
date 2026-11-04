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
    ASSET_RISK_PROFILES,
    PORTFOLIO_NODES,
    SIMULATED_CLOUD,
    CORR_NORMAL,
    CORR_STRESS,
    MONTE_CARLO_BASE,
    RISK_TIME_SERIES
} from './portfolioConstants';

/* FILA 1: 6 PÍLDORAS DE RIESGO Y RETORNO */
function Row1SummaryPills() {
    const pills = [
        { lbl: 'PROYECCIÓN MEDIANA (12M)', val: '+22.4%', sub: 'P95: +52.4% | P05: -13.2%', col: '#10b981' },
        { lbl: 'SHARPE / SORTINO', val: '2.18 / 2.84', sub: 'Volatilidad Anual σ: 11.4%', col: '#10b981' },
        { lbl: 'VaR 95% / CVaR 99% (1D)', val: '-1.84% / -2.84%', sub: 'Pérdida esperada en cola diaria', col: '#f43f5e' },
        { lbl: 'MAX DRAWDOWN (12M)', val: '-4.80%', sub: 'Recuperación media: 14 días', col: '#f43f5e' },
        { lbl: 'STRESS CRASH 2008', val: '-11.4%', sub: 'vs -42.0% Benchmark S&P 500', col: '#f43f5e' },
        { lbl: 'RÉGIMEN MARKOV ACTUAL', val: 'Bull Quiet (62%)', sub: 'Retorno esp. régimen: +2.4%/mes', col: '#10b981' }
    ];
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '8px' }}>
            {pills.map(p => (
                <div
                    key={p.lbl}
                    style={{
                        background: 'linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(9,13,22,0.96) 100%)',
                        border: '1px solid rgba(148,163,184,0.16)',
                        borderLeft: `3px solid ${p.col}`,
                        borderRadius: '8px',
                        padding: '8px 11px'
                    }}
                >
                    <div style={{ fontSize: '8.5px', fontWeight: 800, color: '#94a3b8' }}>{p.lbl}</div>
                    <div style={{ fontSize: '15px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: p.col, marginTop: '2px' }}>
                        {p.val}
                    </div>
                    <div style={{ fontSize: '8.5px', color: '#64748b', marginTop: '1px' }}>{p.sub}</div>
                </div>
            ))}
        </div>
    );
}

/* CUADRANTE 1: MARKOWITZ 2D 100% DINÁMICO (320PX) */
function Quad1DynamicMarkowitz() {
    const [showAssets, setShowAssets] = useState(true);
    const [showCloud, setShowCloud] = useState(true);
    const [showCML, setShowCML] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState({
        name: '★ Tu Cartera Actual',
        vol: 11.4,
        ret: 28.4,
        sharpe: 2.18
    });
    const [activeTargetId, setActiveTargetId] = useState('PORT');

    const toX = (vol) => 42 + ((vol - 5) / 43) * 365;
    const toY = (ret) => 146 - ((ret - 2) / 50) * 130;

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
            title="PLANO 2D DE MARKOWITZ (INTERACTIVO POR ACTIVO Y CARTERA)"
            color="#10b981"
            fixedHeight={320}
            rightSlot={
                <div style={{ display: 'flex', gap: '4px' }}>
                    {PORTFOLIO_NODES.slice(0, 3).map(p => (
                        <button
                            key={p.id}
                            onClick={() => {
                                setActiveTargetId(p.id);
                                setSelectedPoint({ name: p.label, vol: p.vol, ret: p.ret, sharpe: p.sharpe });
                            }}
                            style={{
                                padding: '2px 7px',
                                borderRadius: '4px',
                                border: activeTargetId === p.id ? '1px solid #10b981' : '1px solid rgba(148,163,184,0.2)',
                                background: activeTargetId === p.id ? 'rgba(16,185,129,0.2)' : 'rgba(2,6,23,0.65)',
                                color: activeTargetId === p.id ? '#6ee7b7' : '#94a3b8',
                                fontSize: '8.5px',
                                fontWeight: 800,
                                cursor: 'pointer'
                            }}
                        >
                            {p.id === 'PORT' ? '★ Mi Cartera' : p.id === 'MINVAR' ? 'Min-Var' : 'Max-Sharpe'}
                        </button>
                    ))}
                </div>
            }
            subBar={
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#64748b' }}>CAPAS:</span>
                        {[
                            { lbl: 'Activos (6)', val: showAssets, set: setShowAssets },
                            { lbl: 'Nube Monte Carlo', val: showCloud, set: setShowCloud },
                            { lbl: 'Tangente CML', val: showCML, set: setShowCML }
                        ].map(t => (
                            <button
                                key={t.lbl}
                                onClick={() => t.set(v => !v)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: t.val ? '#6ee7b7' : '#64748b',
                                    fontSize: '8.5px',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                {t.val ? <CheckSquare size={11} color="#10b981" /> : <Square size={11} color="#64748b" />}
                                {t.lbl}
                            </button>
                        ))}
                    </div>
                    <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#e2e8f0' }}>
                        <strong style={{ color: '#6ee7b7' }}>{selectedPoint.name}:</strong> σ {selectedPoint.vol}% | E[R] +{selectedPoint.ret}% | Sharpe {selectedPoint.sharpe}
                    </div>
                </>
            }
        >
            <svg width="100%" height="100%" viewBox="0 0 435 162" style={{ background: 'rgba(2,6,23,0.55)', borderRadius: '6px' }}>
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
                    ASSET_RISK_PROFILES.map(a => {
                        const cx = toX(a.vol);
                        const cy = toY(a.ret);
                        return (
                            <g
                                key={a.sym}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setSelectedPoint({ name: `Activo ${a.sym}`, vol: a.vol, ret: a.ret, sharpe: a.sharpe })}
                                onClick={() => setSelectedPoint({ name: `Activo ${a.sym}`, vol: a.vol, ret: a.ret, sharpe: a.sharpe })}
                            >
                                <circle cx={cx} cy={cy} r="4.2" fill={a.sharpe >= 1.5 ? '#10b981' : '#f43f5e'} stroke="#090d16" strokeWidth="1.2" />
                                <text x={cx + 6} y={cy + 3} fill="#cbd5e1" fontSize="8.5" fontWeight="800">{a.sym}</text>
                            </g>
                        );
                    })}

                {PORTFOLIO_NODES.map(p => {
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
                            {isMain && <text x={cx + 8} y={cy + 3} fill="#6ee7b7" fontSize="9.5" fontWeight="900">{p.label}</text>}
                        </g>
                    );
                })}
            </svg>
        </PortfolioCardShell>
    );
}

/* CUADRANTE 2: TORNADO DE STRESS, VaR 95% & CAPTURA POR ACTIVO (320PX) */
function Quad2TornadoAndAssetTail() {
    const [subView, setSubView] = useState('TORNADO');
    const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
    const [selectedAsset, setSelectedAsset] = useState('ALL');

    const scenarios = [
        {
            name: 'Crash Lehman 2008 (-42% SPX)',
            port: -11.4,
            bench: -42.0,
            byAsset: [
                { sym: 'TLT', chg: +14.2 },
                { sym: 'GLD', chg: +9.8 },
                { sym: 'MSFT', chg: -22.0 },
                { sym: 'SPY', chg: -42.0 },
                { sym: 'NVDA', chg: -48.5 }
            ]
        },
        {
            name: 'Shock COVID-19 Mar 2020',
            port: -7.8,
            bench: -34.0,
            byAsset: [
                { sym: 'TLT', chg: +11.4 },
                { sym: 'GLD', chg: +6.5 },
                { sym: 'MSFT', chg: -14.0 },
                { sym: 'NVDA', chg: -18.2 },
                { sym: 'BTC', chg: -38.0 }
            ]
        },
        {
            name: 'Shock Tasas Fed 2022 (+425 bps)',
            port: -6.2,
            bench: -19.4,
            byAsset: [
                { sym: 'GLD', chg: +1.4 },
                { sym: 'SPY', chg: -19.4 },
                { sym: 'TLT', chg: -26.8 },
                { sym: 'NVDA', chg: -34.0 },
                { sym: 'BTC', chg: -45.0 }
            ]
        },
        {
            name: 'Desinflación + Rally IA',
            port: +24.6,
            bench: +18.2,
            byAsset: [
                { sym: 'NVDA', chg: +52.0 },
                { sym: 'BTC', chg: +44.0 },
                { sym: 'MSFT', chg: +26.0 },
                { sym: 'SPY', chg: +18.2 },
                { sym: 'GLD', chg: +8.4 }
            ]
        }
    ];

    const activeScenario = scenarios[selectedScenarioIdx];
    const varHeaders = ['ACTIVO', 'PESO', 'VOLAT. σ', 'VaR 95% (1D)', 'ROL EN COLA'];
    const capHeaders = ['ACTIVO', 'UPSIDE CAPTURE', 'DOWNSIDE CAPTURE', 'ASIMETRÍA NETA'];

    return (
        <PortfolioCardShell
            badge="CUADRANTE 2 • IZQ ABAJO"
            title="TORNADO DE STRESS, COLA VaR & ASIMETRÍA POR ACTIVO"
            color="#f43f5e"
            fixedHeight={320}
            rightSlot={
                <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                        { id: 'TORNADO', lbl: '1. Tornado Stress' },
                        { id: 'VAR_ASSET', lbl: '2. VaR 95% por Activo' },
                        { id: 'CAPTURE', lbl: '3. Captura Upside/Downside' }
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setSubView(t.id)}
                            style={{
                                padding: '2px 7px',
                                borderRadius: '4px',
                                border: subView === t.id ? '1px solid #f43f5e' : '1px solid rgba(148,163,184,0.2)',
                                background: subView === t.id ? 'rgba(244,63,94,0.18)' : 'rgba(2,6,23,0.6)',
                                color: subView === t.id ? '#fda4af' : '#94a3b8',
                                fontSize: '8.5px',
                                fontWeight: 800,
                                cursor: 'pointer'
                            }}
                        >
                            {t.lbl}
                        </button>
                    ))}
                </div>
            }
            subBar={
                subView === 'TORNADO' ? (
                    <>
                        <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#94a3b8' }}>
                            IMPACTO POR ACTIVO ({activeScenario.name}):
                        </span>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {activeScenario.byAsset.map(a => (
                                <span
                                    key={a.sym}
                                    style={{
                                        padding: '1px 5px',
                                        borderRadius: '3px',
                                        fontSize: '8px',
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
                        <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#94a3b8' }}>FILTRAR ACTIVO:</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {['ALL', 'NVDA', 'SPY', 'BTC', 'GLD', 'TLT', 'MSFT'].map(sym => (
                                <button
                                    key={sym}
                                    onClick={() => setSelectedAsset(sym)}
                                    style={{
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                        border: selectedAsset === sym ? '1px solid #10b981' : '1px solid rgba(148,163,184,0.18)',
                                        background: selectedAsset === sym ? 'rgba(16,185,129,0.18)' : 'transparent',
                                        color: selectedAsset === sym ? '#6ee7b7' : '#94a3b8',
                                        fontSize: '8px',
                                        fontWeight: 800,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {sym === 'ALL' ? 'Todos (6)' : sym}
                                </button>
                            ))}
                        </div>
                    </>
                )
            }
        >
            {subView === 'TORNADO' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr 112px', fontSize: '8px', fontWeight: 800, color: '#64748b', padding: '0 6px' }}>
                        <span style={{ textAlign: 'left' }}>ESCENARIO HISTÓRICO / MACRO</span>
                        <span style={{ textAlign: 'center' }}>MAGNITUD DE IMPACTO</span>
                        <span style={{ textAlign: 'right' }}>CARTERA (BENCH)</span>
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
                                    fontSize: '9.5px',
                                    padding: '4.5px 6px',
                                    borderRadius: '5px',
                                    background: isSel ? 'rgba(148,163,184,0.1)' : 'rgba(2,6,23,0.45)',
                                    border: isSel ? '1px solid rgba(148,163,184,0.22)' : '1px solid transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ textAlign: 'left', color: '#f8fafc', fontWeight: 800 }}>{s.name}</span>
                                <div style={{ height: '8px', background: 'rgba(15,23,42,0.9)', borderRadius: '99px', overflow: 'hidden', display: 'flex' }}>
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
                                    {s.port > 0 ? `+${s.port}%` : `${s.port}%`} <span style={{ opacity: 0.7, fontSize: '8px' }}>({s.bench}%)</span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {subView === 'VAR_ASSET' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 0.7fr 0.8fr 0.9fr 1fr', color: '#64748b', fontWeight: 800, fontSize: '8px', padding: '0 6px' }}>
                        {varHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, varHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {ASSET_RISK_PROFILES.filter(a => selectedAsset === 'ALL' || a.sym === selectedAsset).map(a => (
                        <div
                            key={a.sym}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '0.8fr 0.7fr 0.8fr 0.9fr 1fr',
                                padding: '4px 6px',
                                borderRadius: '4px',
                                background: 'rgba(2,6,23,0.5)',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontWeight: 900, color: '#f8fafc' }}>{a.sym}</span>
                            <span style={{ textAlign: 'center', color: '#94a3b8' }}>{a.weight}%</span>
                            <span style={{ textAlign: 'center', color: '#cbd5e1' }}>{a.vol}%</span>
                            <span style={{ textAlign: 'center', padding: '1px 5px', borderRadius: '4px', fontWeight: 900, ...getSemanticReturnStyle(a.var95 * 3, 15) }}>
                                {a.var95}%
                            </span>
                            <span style={{ textAlign: 'right', fontFamily: 'sans-serif', fontSize: '8.5px', color: a.beta <= 0.1 ? '#6ee7b7' : '#fda4af', fontWeight: 800 }}>
                                {a.beta <= 0.1 ? 'Escudo Defensivo' : 'Generador Riesgo'}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {subView === 'CAPTURE' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1fr 1fr 0.9fr', color: '#64748b', fontWeight: 800, fontSize: '8px', padding: '0 6px' }}>
                        {capHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, capHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {ASSET_RISK_PROFILES.filter(a => selectedAsset === 'ALL' || a.sym === selectedAsset).map(a => {
                        const netGood = a.upCap - a.dnCap;
                        return (
                            <div
                                key={a.sym}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '0.8fr 1fr 1fr 0.9fr',
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    background: 'rgba(2,6,23,0.5)',
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
function Quad3CorrelationAndAssetBeta() {
    const [corrRegime, setCorrRegime] = useState('NORMAL');
    const [subMode, setSubMode] = useState('MATRIX');
    const [focusAssetIdx, setFocusAssetIdx] = useState(null);

    const activeMatrix = corrRegime === 'NORMAL' ? CORR_NORMAL : CORR_STRESS;
    const assets = ['NVDA', 'SPY', 'BTC', 'GLD', 'TLT', 'MSFT'];
    const matHeaders = ['ACTIVO', ...assets];
    const betaHeaders = ['ACTIVO', 'BETA SPX', 'CORR MEDIA', 'SHARPE INDIV.', 'MEJOR RÉGIMEN'];

    return (
        <PortfolioCardShell
            badge="CUADRANTE 3 • DER ARRIBA"
            title="MATRIZ DE CORRELACIÓN CRUZADA & SENSIBILIDAD POR ACTIVO"
            color="#10b981"
            fixedHeight={320}
            rightSlot={
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setSubMode('MATRIX')}
                        style={{
                            padding: '2px 7px',
                            borderRadius: '4px',
                            border: subMode === 'MATRIX' ? '1px solid #10b981' : '1px solid rgba(148,163,184,0.2)',
                            background: subMode === 'MATRIX' ? 'rgba(16,185,129,0.2)' : 'rgba(2,6,23,0.65)',
                            color: subMode === 'MATRIX' ? '#6ee7b7' : '#94a3b8',
                            fontSize: '8.5px',
                            fontWeight: 800,
                            cursor: 'pointer'
                        }}
                    >
                        1. Matriz 6×6
                    </button>
                    <button
                        onClick={() => setSubMode('BETAS')}
                        style={{
                            padding: '2px 7px',
                            borderRadius: '4px',
                            border: subMode === 'BETAS' ? '1px solid #10b981' : '1px solid rgba(148,163,184,0.2)',
                            background: subMode === 'BETAS' ? 'rgba(16,185,129,0.2)' : 'rgba(2,6,23,0.65)',
                            color: subMode === 'BETAS' ? '#6ee7b7' : '#94a3b8',
                            fontSize: '8.5px',
                            fontWeight: 800,
                            cursor: 'pointer'
                        }}
                    >
                        2. Beta & Descorrelación por Activo
                    </button>
                </div>
            }
            subBar={
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#64748b' }}>RÉGIMEN:</span>
                        <button
                            onClick={() => setCorrRegime('NORMAL')}
                            style={{
                                padding: '1.5px 6px',
                                borderRadius: '4px',
                                border: corrRegime === 'NORMAL' ? '1px solid #10b981' : '1px solid rgba(148,163,184,0.18)',
                                background: corrRegime === 'NORMAL' ? 'rgba(16,185,129,0.18)' : 'transparent',
                                color: corrRegime === 'NORMAL' ? '#6ee7b7' : '#94a3b8',
                                fontSize: '8px',
                                fontWeight: 800,
                                cursor: 'pointer'
                            }}
                        >
                            Mercado Normal (1Y)
                        </button>
                        <button
                            onClick={() => setCorrRegime('STRESS')}
                            style={{
                                padding: '1.5px 6px',
                                borderRadius: '4px',
                                border: corrRegime === 'STRESS' ? '1px solid #f43f5e' : '1px solid rgba(148,163,184,0.18)',
                                background: corrRegime === 'STRESS' ? 'rgba(244,63,94,0.18)' : 'transparent',
                                color: corrRegime === 'STRESS' ? '#fda4af' : '#94a3b8',
                                fontSize: '8px',
                                fontWeight: 800,
                                cursor: 'pointer'
                            }}
                        >
                            Cola de Crisis (Contagio)
                        </button>
                    </div>
                    <span style={{ fontSize: '8.5px', color: '#94a3b8' }}>
                        {focusAssetIdx !== null ? `Foco en ${assets[focusAssetIdx]}` : 'Clic en activo para aislar fila'}
                    </span>
                </>
            }
        >
            {subMode === 'MATRIX' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5px', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '52px repeat(6, 1fr)', gap: '3.5px', fontSize: '8px', fontWeight: 800, color: '#64748b' }}>
                        {matHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, matHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {activeMatrix.map((row, rIdx) => {
                        const dimmed = focusAssetIdx !== null && focusAssetIdx !== rIdx;
                        return (
                            <div key={assets[rIdx]} style={{ display: 'grid', gridTemplateColumns: '52px repeat(6, 1fr)', gap: '3.5px', alignItems: 'center' }}>
                                <button
                                    onClick={() => setFocusAssetIdx(focusAssetIdx === rIdx ? null : rIdx)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: focusAssetIdx === rIdx ? '#6ee7b7' : '#cbd5e1',
                                        fontWeight: 900,
                                        textAlign: 'left',
                                        fontSize: '8.5px',
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 0.8fr 0.9fr 1fr 1fr', color: '#64748b', fontWeight: 800, fontSize: '8px', padding: '0 6px' }}>
                        {betaHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, betaHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {ASSET_RISK_PROFILES.map((a, idx) => {
                        const avgCorr = (
                            (activeMatrix[idx].reduce((s, v) => s + v, 0) - 1) /
                            (activeMatrix[idx].length - 1)
                        ).toFixed(2);
                        return (
                            <div
                                key={a.sym}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '0.8fr 0.8fr 0.9fr 1fr 1fr',
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    background: 'rgba(2,6,23,0.5)',
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
                                <span style={{ textAlign: 'right', fontFamily: 'sans-serif', fontSize: '8.5px', color: '#cbd5e1' }}>{a.bestRegime}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </PortfolioCardShell>
    );
}

/* CUADRANTE 4: MATRIZ 2D CHOQUE TASAS×SPX & MATRIZ DE REGÍMENES DE MARKOV (#11) (320PX) */
function Quad4ShockAndMarkovMatrices() {
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

    const mult = assetSens[targetSym] || assetSens.CARTERA;
    const shockHeaders = [`TASAS \\ SPX (${targetSym})`, 'S&P 500 -15%', 'S&P 500 0%', 'S&P 500 +15%'];
    const shockRows = [
        { rate: 'Tasas -100 bps', base: [-4.2, 3.8, 12.4] },
        { rate: 'Tasas 0 bps (Base)', base: [-6.8, 0.0, 8.9] },
        { rate: 'Tasas +100 bps', base: [-10.4, -3.1, 4.2] },
        { rate: 'Tasas +200 bps', base: [-14.2, -6.4, 1.1] }
    ];

    const markovHeaders = ['RÉGIMEN', 'BQ', 'BV', 'INF', 'CR', 'ACTIVO LÍDER', 'E[RET]'];
    const regimes = [
        { name: 'Bull Quiet (62%)', bq: '74%', bv: '16%', inf: '7%', cr: '3%', exp: 2.4, top: 'NVDA (+4.8%/m)' },
        { name: 'Bull Volatile (21%)', bq: '28%', bv: '52%', inf: '12%', cr: '8%', exp: 1.1, top: 'BTC (+5.4%/m)' },
        { name: 'Inflationary (12%)', bq: '14%', bv: '22%', inf: '54%', cr: '10%', exp: -0.8, top: 'GLD (+3.1%/m)' },
        { name: 'Crash / Crisis (5%)', bq: '10%', bv: '30%', inf: '18%', cr: '42%', exp: -4.2, top: 'TLT (+2.9%/m)' }
    ];

    return (
        <PortfolioCardShell
            badge="CUADRANTE 4 • DER ABAJO"
            title={tab === 'SHOCK2D' ? 'MATRIZ 2D DE CHOQUE CRUZADO (TASAS × S&P 500)' : 'MATRIZ DE TRANSICIÓN DE REGÍMENES DE MARKOV (#11)'}
            color="#f43f5e"
            fixedHeight={320}
            rightSlot={
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setTab('SHOCK2D')}
                        style={{
                            padding: '2px 7px',
                            borderRadius: '4px',
                            border: tab === 'SHOCK2D' ? '1px solid #f43f5e' : '1px solid rgba(148,163,184,0.2)',
                            background: tab === 'SHOCK2D' ? 'rgba(244,63,94,0.18)' : 'rgba(2,6,23,0.6)',
                            color: tab === 'SHOCK2D' ? '#fda4af' : '#94a3b8',
                            fontSize: '8.5px',
                            fontWeight: 800,
                            cursor: 'pointer'
                        }}
                    >
                        1. Matriz 2D Tasas × SPX
                    </button>
                    <button
                        onClick={() => setTab('MARKOV')}
                        style={{
                            padding: '2px 7px',
                            borderRadius: '4px',
                            border: tab === 'MARKOV' ? '1px solid #10b981' : '1px solid rgba(148,163,184,0.2)',
                            background: tab === 'MARKOV' ? 'rgba(16,185,129,0.18)' : 'rgba(2,6,23,0.6)',
                            color: tab === 'MARKOV' ? '#6ee7b7' : '#94a3b8',
                            fontSize: '8.5px',
                            fontWeight: 800,
                            cursor: 'pointer'
                        }}
                    >
                        2. Regímenes Markov (#11)
                    </button>
                </div>
            }
            subBar={
                tab === 'SHOCK2D' ? (
                    <>
                        <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#94a3b8' }}>VER CHOQUE SOBRE:</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {['CARTERA', 'NVDA', 'SPY', 'BTC', 'GLD', 'TLT'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setTargetSym(s)}
                                    style={{
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                        border: targetSym === s ? '1px solid #10b981' : '1px solid rgba(148,163,184,0.18)',
                                        background: targetSym === s ? 'rgba(16,185,129,0.18)' : 'transparent',
                                        color: targetSym === s ? '#6ee7b7' : '#94a3b8',
                                        fontSize: '8px',
                                        fontWeight: 800,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#94a3b8' }}>
                        PROBABILIDAD DE TRANSICIÓN A 30 DÍAS + ACTIVO LÍDER POR RÉGIMEN
                    </span>
                )
            }
        >
            {tab === 'SHOCK2D' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr repeat(3, 1fr)', gap: '4px', fontSize: '8px', fontWeight: 800, color: '#64748b' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.35fr repeat(4, 0.5fr) 1.05fr 0.75fr', color: '#64748b', fontWeight: 800, fontSize: '8px', padding: '0 6px' }}>
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
                                background: 'rgba(2,6,23,0.52)',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontFamily: 'sans-serif', fontWeight: 800, color: r.exp > 0 ? '#6ee7b7' : '#fda4af', fontSize: '8.5px' }}>
                                {r.name}
                            </span>
                            <span style={{ textAlign: 'center', color: '#a7f3d0' }}>{r.bq}</span>
                            <span style={{ textAlign: 'center', color: '#cbd5e1' }}>{r.bv}</span>
                            <span style={{ textAlign: 'center', color: '#fecdd3' }}>{r.inf}</span>
                            <span style={{ textAlign: 'center', color: '#fda4af', fontWeight: 800 }}>{r.cr}</span>
                            <span style={{ textAlign: 'center', color: '#6ee7b7', fontSize: '8px' }}>{r.top}</span>
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
function Row3FullWidthProjectionInteractive() {
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
                    ? `PROYECCIÓN MONTE CARLO (${horizon} • 10,000 SIMULACIONES CON BANDAS ACTIVABLES)`
                    : seriesMode === 'DD'
                    ? `CURVA SUBACUÁTICA DE DRAWDOWN (CARTERA vs ACTIVO INDIVIDUAL: ${compareAsset})`
                    : 'SHARPE RATIO & BETA RODANTE A 60 DÍAS (ESTABILIDAD DE RÉGIMEN)'
            }
            color={seriesMode === 'DD' ? '#f43f5e' : '#10b981'}
            fixedHeight={260}
            rightSlot={
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {[
                        { id: 'MC', lbl: '1. Proyección Monte Carlo (NEW-01)' },
                        { id: 'DD', lbl: '2. Drawdown Subacuático (NEW-02)' },
                        { id: 'ROLL', lbl: '3. Rolling 60D Sharpe & Beta (NEW-05)' }
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => setSeriesMode(m.id)}
                            style={{
                                padding: '3px 8px',
                                borderRadius: '5px',
                                border: seriesMode === m.id ? '1px solid #10b981' : '1px solid rgba(148,163,184,0.2)',
                                background: seriesMode === m.id ? 'rgba(16,185,129,0.2)' : 'rgba(2,6,23,0.65)',
                                color: seriesMode === m.id ? '#6ee7b7' : '#94a3b8',
                                fontSize: '8.5px',
                                fontWeight: 800,
                                cursor: 'pointer'
                            }}
                        >
                            {m.lbl}
                        </button>
                    ))}
                </div>
            }
            subBar={
                seriesMode === 'MC' ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#64748b' }}>BANDAS VISIBLES:</span>
                            {[
                                { lbl: 'P95 Optimista (Verde)', val: showP95, set: setShowP95, col: '#10b981' },
                                { lbl: 'P50 Mediana', val: showP50, set: setShowP50, col: '#6ee7b7' },
                                { lbl: 'P05 Cola Adversa (Rojo)', val: showP05, set: setShowP05, col: '#f43f5e' },
                                { lbl: 'Benchmark S&P 500', val: showBench, set: setShowBench, col: '#94a3b8' }
                            ].map(b => (
                                <button
                                    key={b.lbl}
                                    onClick={() => b.set(v => !v)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: b.val ? b.col : '#64748b',
                                        fontSize: '8.5px',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    {b.val ? <CheckSquare size={11} color={b.col} /> : <Square size={11} color="#64748b" />}
                                    {b.lbl}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 800 }}>HORIZONTE:</span>
                            {['6M', '12M', '24M'].map(h => (
                                <button
                                    key={h}
                                    onClick={() => setHorizon(h)}
                                    style={{
                                        padding: '1.5px 7px',
                                        borderRadius: '4px',
                                        border: horizon === h ? '1px solid #10b981' : '1px solid rgba(148,163,184,0.2)',
                                        background: horizon === h ? 'rgba(16,185,129,0.2)' : 'transparent',
                                        color: horizon === h ? '#6ee7b7' : '#94a3b8',
                                        fontSize: '8px',
                                        fontWeight: 900,
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#64748b' }}>COMPARAR CONTRA ACTIVO INDIVIDUAL:</span>
                        {['NVDA', 'SPY', 'BTC', 'GLD', 'TLT', 'MSFT'].map(s => (
                            <button
                                key={s}
                                onClick={() => setCompareAsset(s)}
                                style={{
                                    padding: '1.5px 6px',
                                    borderRadius: '4px',
                                    border: compareAsset === s ? '1px solid #f43f5e' : '1px solid rgba(148,163,184,0.2)',
                                    background: compareAsset === s ? 'rgba(244,63,94,0.18)' : 'transparent',
                                    color: compareAsset === s ? '#fda4af' : '#94a3b8',
                                    fontSize: '8px',
                                    fontWeight: 800,
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
            <div style={{ width: '100%', height: '100%' }}>
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
                            <RechartsTooltip contentStyle={{ background: '#090d16', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '6px', fontSize: '10px' }} />
                            {showP95 && <Area type="monotone" dataKey="p95" name="P95 Banda Optimista" stroke="#10b981" strokeWidth={2.2} fill="url(#prodV2McGreen)" />}
                            {showP50 && <Area type="monotone" dataKey="p50" name="P50 Mediana" stroke="#6ee7b7" strokeWidth={2} strokeDasharray="5 3" fill="none" />}
                            {showBench && <Area type="monotone" dataKey="bench" name="S&P 500 Esperado" stroke="#94a3b8" strokeWidth={1.4} strokeDasharray="3 3" fill="none" />}
                            {showP05 && <Area type="monotone" dataKey="p05" name="P05 Cola Adversa" stroke="#f43f5e" strokeWidth={2} fill="url(#prodV2McRed)" />}
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
                            <RechartsTooltip contentStyle={{ background: '#090d16', border: '1px solid rgba(244,63,94,0.4)', borderRadius: '6px', fontSize: '10px' }} />
                            <Area type="monotone" dataKey="ddAsset" name={`Drawdown ${compareAsset} (%)`} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
                            <Area type="monotone" dataKey="ddPort" name="★ Drawdown Tu Cartera (%)" stroke="#f43f5e" strokeWidth={2.2} fill="url(#prodV2DdRed)" />
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
                            <RechartsTooltip contentStyle={{ background: '#090d16', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '6px', fontSize: '10px' }} />
                            <Area type="monotone" dataKey="sharpe60" name="Rolling Sharpe 60D" stroke="#10b981" strokeWidth={2.2} fill="url(#prodV2ShGreen)" />
                            <Area type="monotone" dataKey="beta60" name="Rolling Beta 60D" stroke="#f43f5e" strokeWidth={1.6} strokeDasharray="4 3" fill="none" />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </div>
        </PortfolioCardShell>
    );
}

export default function PortfolioVista2Risk() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Row1SummaryPills />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', alignItems: 'stretch' }}>
                <Quad1DynamicMarkowitz />
                <Quad3CorrelationAndAssetBeta />
                <Quad2TornadoAndAssetTail />
                <Quad4ShockAndMarkovMatrices />
            </div>
            <Row3FullWidthProjectionInteractive />
        </div>
    );
}

