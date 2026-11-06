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
import { CheckSquare, Square, Plus } from 'lucide-react';
import {
    getSemanticReturnStyle,
    colAlign,
    PortfolioCardShell,
    INITIAL_HOLDINGS,
    TACTICAL_CANDIDATES,
    WALK_FORWARD_SERIES,
    INITIAL_LEDGER
} from './portfolioConstants';
import {
    computeLivePortfolioMetrics,
    evaluateTacticalCandidate,
    runLiveCommitteeCycle
} from '../../services/committeeService';
import { runLiveAnomalyInference } from '../../services/anomalyService';

/* FILA 1: ENCABEZADO PERMANENTE DE IMPACTO SOBRE EL TOTAL DE LA CARTERA */
function Row1TotalPortfolioImpactHeader({ activeSym, allocPct, hedgeActive, liveMetrics, candidateInfo, isES = false }) {
    const m = liveMetrics || computeLivePortfolioMetrics(INITIAL_HOLDINGS, isES);
    const c = candidateInfo || evaluateTacticalCandidate(activeSym, null, isES);
    const isCapped = allocPct > 20;
    const effAlloc = isCapped ? 20 : allocPct;

    const deltaRet = Number((3.8 * (effAlloc / 12)).toFixed(1));
    const deltaSharpe = Number((0.22 * (effAlloc / 12) + (hedgeActive ? 0.08 : 0)).toFixed(2));
    const deltaVaR = Number(((hedgeActive ? 0.48 : -0.18) * (effAlloc / 12)).toFixed(2));
    const deltaDD = Number(((hedgeActive ? 1.9 : -0.4) * (effAlloc / 12)).toFixed(2));

    const pills = [
        {
            lbl: tx('IMPACTO EN RETORNO TOTAL (CAGR)', 'TOTAL RETURN IMPACT (CAGR)'),
            val: `+${m.cagrPct.toFixed(1)}% → +${(m.cagrPct + deltaRet).toFixed(1)}%`,
            sub: txTpl("Delta Estrategia Ad-Hoc: +{0}% anual", [deltaRet], "Ad-Hoc Strategy Delta: +{0}%/yr", [deltaRet]),
            col: '#10b981'
        },
        {
            lbl: tx('IMPACTO EN SHARPE DE CARTERA', 'PORTFOLIO SHARPE IMPACT'),
            val: `${m.sharpeRatio.toFixed(2)} → ${(m.sharpeRatio + deltaSharpe).toFixed(2)}`,
            sub: txTpl("Eficiencia marginal: +{0} pts", [deltaSharpe], "Marginal efficiency: +{0} pts", [deltaSharpe]),
            col: '#10b981'
        },
        {
            lbl: tx('IMPACTO EN VaR 95% DIARIO', 'DAILY 95% VaR IMPACT'),
            val: `${m.var95Pct}% → ${(m.var95Pct + deltaVaR).toFixed(2)}%`,
            sub:
                deltaVaR >= 0
                    ? txTpl("Mejora cola diaria: +{0}%", [deltaVaR], "Daily tail improvement: +{0}%", [deltaVaR])
                    : txTpl("Mayor riesgo cola: {0}%", [deltaVaR], "Increased tail risk: {0}%", [deltaVaR]),
            col: deltaVaR >= 0 ? '#10b981' : '#f43f5e'
        },
        {
            lbl: tx('IMPACTO EN MAX DRAWDOWN', 'MAX DRAWDOWN IMPACT'),
            val: `${m.maxDrawdownPct.toFixed(2)}% → ${(m.maxDrawdownPct + deltaDD).toFixed(2)}%`,
            sub:
                deltaDD >= 0
                    ? txTpl("Escudo activo: +{0}% menos caída", [deltaDD], "Active shield: +{0}% less drawdown", [deltaDD])
                    : txTpl("Ampliación DD: {0}%", [deltaDD], "Drawdown expansion: {0}%", [deltaDD]),
            col: deltaDD >= 0 ? '#10b981' : '#f43f5e'
        },
        {
            lbl: tx('CAPITAL TÁCTICO / CARTERA TOTAL', 'TACTICAL CAPITAL / TOTAL NAV'),
            val: `${effAlloc.toFixed(1)}% NAV ($${(effAlloc * 1000).toLocaleString()})`,
            sub: isCapped
                ? tx('⚠ Tope Guardrail 20% NAV Aplicado', '⚠ 20% NAV Guardrail Cap Applied')
                : txTpl("{0}% Cartera Core Intacta", [Math.max(0, 100 - effAlloc).toFixed(0)], "{0}% Core Portfolio Intact", [Math.max(0, 100 - effAlloc).toFixed(0)]),
            col: isCapped ? '#f43f5e' : '#10b981'
        },
        {
            lbl: tx('VEREDICTO COMITÉ 3 PILARES', '3-PILLAR COMMITTEE VERDICT'),
            val:
                c.p06 < 0.65 && !isCapped
                    ? tx('APROBADO (3/3)', 'APPROVED (3/3)')
                    : tx('RECORTE GUARDRAIL', 'GUARDRAIL TRIM'),
            sub: `P-06 = ${c.p06} (${tx('Umbral', 'Limit')} < 0.65) • Cap ≤ 20%`,
            col: c.p06 < 0.65 && !isCapped ? '#10b981' : '#f43f5e'
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

/* CUADRANTE 1: SIMULADOR "WHAT-IF" PRE-TRADE (#1) & CRITERIO DE KELLY (#14) (320PX) */
function Quad1WhatIfAndKelly({
    activeSym,
    setActiveSym,
    allocPct,
    setAllocPct,
    onExecuteOrder,
    candidateSyms = [],
    liveMetrics,
    candidateInfo,
    isES = false
}) {
    const [subTab, setSubTab] = useState('WHATIF');
    const m = liveMetrics || computeLivePortfolioMetrics(INITIAL_HOLDINGS, isES);
    const c = candidateInfo || evaluateTacticalCandidate(activeSym, null, isES);
    const symList = candidateSyms.length ? candidateSyms : Object.keys(TACTICAL_CANDIDATES);

    const headers = txList(['MÉTRICA DE CARTERA', 'CARTERA BASE', 'CON JUGADA AD-HOC', 'IMPACTO NETO (Δ)'], ['PORTFOLIO METRIC', 'BASE PORTFOLIO', 'WITH AD-HOC TRADE', 'NET IMPACT (Δ)']);
    const rows = [
        [
            tx('Retorno Anual (CAGR)', 'Annual Return (CAGR)'),
            `+${m.cagrPct.toFixed(1)}%`,
            `+${(m.cagrPct + allocPct * 0.28).toFixed(1)}%`,
            `+${(allocPct * 0.28).toFixed(1)}%`,
            +(allocPct * 0.28)
        ],
        [
            'Sharpe Ratio',
            m.sharpeRatio.toFixed(2),
            (m.sharpeRatio + allocPct * 0.015).toFixed(2),
            `+${(allocPct * 0.015).toFixed(2)}`,
            +1.5
        ],
        [
            tx('VaR 95% Diario', 'Daily 95% VaR'),
            `${m.var95Pct}%`,
            `${(m.var95Pct + 0.32).toFixed(2)}%`,
            '+0.32%',
            +4
        ],
        [
            tx('Exposición Activo', 'Asset Exposure'),
            '10.0%',
            `${(10 + Math.min(20, allocPct)).toFixed(1)}%`,
            `+${Math.min(20, allocPct).toFixed(1)}%`,
            +3
        ]
    ];

    const kellyHeaders = txList(['MODO KELLY', 'FÓRMULA', 'TAMAÑO SUGERIDO', 'GUÍA / RIESGO'], ['KELLY MODE', 'FORMULA', 'SUGGESTED SIZE', 'GUIDE / RISK']);
    const kellyRows = [
        [tx('Quarter-Kelly (0.25x — Conservador)', 'Quarter-Kelly (0.25x — Conservative)'), '0.25 × Full Kelly', `${c.quarterKelly}% NAV`, tx('Recomendado / Seguro', 'Recommended / Safe'), +5],
        [tx('Half-Kelly (0.50x — Equilibrado)', 'Half-Kelly (0.50x — Balanced)'), '0.50 × Full Kelly', `${c.halfKelly}% NAV`, tx('Óptimo Institucional', 'Institutional Optimal'), +8],
        [tx('Full-Kelly (1.00x — Límite agresivo)', 'Full-Kelly (1.00x — Aggressive limit)'), 'W - (1-W)/R', `${c.fullKelly}% NAV`, tx('Alto (Volátil)', 'High (Volatile)'), -4]
    ];

    return (
        <PortfolioCardShell
            badge="CUADRANTE 1 • SIMULADOR"
            title={tx('Simulador de Posición', 'Position Simulator')}
            color="#10b981"
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {[
                        { id: 'WHATIF', lbl: tx('Impacto', 'Impact') },
                        { id: 'KELLY', lbl: tx('Tamaño Kelly', 'Kelly Sizing') }
                    ].map(m => {
                        const active = subTab === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setSubTab(m.id)}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>
                            {tx('ACTIVO:', 'ASSET:')}
                        </span>
                        {symList.map(sym => (
                            <button
                                key={sym}
                                onClick={() => setActiveSym(sym)}
                                style={{
                                    padding: '1px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: activeSym === sym ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                    textShadow: activeSym === sym ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                    fontSize: '12px',
                                    fontWeight: activeSym === sym ? 800 : 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {sym}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 800 }}>% NAV:</span>
                        {[5, 10, 14.2, 20, 25].map(w => (
                            <button
                                key={w}
                                onClick={() => setAllocPct(w)}
                                style={{
                                    padding: '1px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: allocPct === w ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                    textShadow: allocPct === w ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                    fontSize: '12px',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: allocPct === w ? 800 : 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {w}%
                            </button>
                        ))}
                        <button
                            onClick={onExecuteOrder}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '2px 6px',
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--ui-accent, #10b981)',
                                textShadow: '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)',
                                fontSize: '12px',
                                fontWeight: 800,
                                cursor: 'pointer'
                            }}
                        >
                            {tx('Simular Orden ↗', 'Simulate Order ↗')}
                        </button>
                    </div>
                </>
            }
        >
            {subTab === 'WHATIF' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                        {headers.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, headers.length) }}>{h}</span>
                        ))}
                    </div>
                    {rows.map((r, rIdx) => (
                        <div
                            key={rIdx}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1.3fr 1fr 1fr 1fr',
                                padding: '5px 6px',
                                borderRadius: '5px',
                                background: 'transparent',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontFamily: 'sans-serif', fontWeight: 800, color: '#e2e8f0' }}>{r[0]}</span>
                            <span style={{ textAlign: 'center', color: '#94a3b8' }}>{r[1]}</span>
                            <span style={{ textAlign: 'center', color: '#f8fafc', fontWeight: 800 }}>{r[2]}</span>
                            <span style={{ textAlign: 'right', padding: '1.5px 6px', borderRadius: '4px', fontWeight: 900, justifySelf: 'end', ...getSemanticReturnStyle(r[4], 10) }}>
                                {r[3]}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', padding: '0 4px', fontFamily: 'sans-serif' }}>
                        {txTpl("Parámetros de {0}:", [c.sym], "{0} parameters:", [c.sym])} <strong>Win Rate {c.winRate}%</strong> • <strong>Payoff Ratio {c.payoff}x</strong> ({tx('Clic para aplicar peso', 'Click to apply weight')}):
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.1fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                        {kellyHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, kellyHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {kellyRows.map((kr, idx) => (
                        <div
                            key={idx}
                            onClick={() => setAllocPct(parseFloat(kr[2]))}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1.2fr 1fr 1fr 1.1fr',
                                padding: '5px 6px',
                                borderRadius: '5px',
                                background: 'transparent',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontFamily: 'sans-serif', fontWeight: 800, color: '#f8fafc' }}>{kr[0]}</span>
                            <span style={{ textAlign: 'center', color: '#94a3b8' }}>{kr[1]}</span>
                            <span style={{ textAlign: 'center', color: '#6ee7b7', fontWeight: 900 }}>{kr[2]}</span>
                            <span style={{ textAlign: 'right', padding: '1.5px 6px', borderRadius: '4px', fontWeight: 800, justifySelf: 'end', ...getSemanticReturnStyle(kr[4], 10) }}>
                                {kr[3]}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </PortfolioCardShell>
    );
}

/* CUADRANTE 2: ESCUDO TAIL-HEDGE (#6) & APALANCAMIENTO / MARGIN CALL (#13) (320PX) */
function Quad2TailHedgeAndMargin({ hedgeActive, setHedgeActive, isES = false }) {
    const [tab, setTab] = useState('HEDGE');
    const [leverage, setLeverage] = useState(1.25);

    const hedgeHeaders = txList(['CAÍDA S&P 500', 'CARTERA SIN ESCUDO', 'CON PUT 5% OTM', 'PROTECCIÓN NETA'], ['S&P 500 DROP', 'UNHEDGED PORTFOLIO', 'WITH 5% OTM PUT', 'NET PROTECTION']);
    const hedgeRows = [
        ['Crash -10% SPX', '-6.4%', '-2.1%', tx('+4.3% Salvado', '+4.3% Saved'), +6],
        ['Crash -20% SPX', '-13.8%', '-3.8%', tx('+10.0% Salvado', '+10.0% Saved'), +12],
        ['Crash -30% SPX', '-21.5%', '-4.9%', tx('+16.6% Salvado', '+16.6% Saved'), +18]
    ];

    const marginHeaders = txList(['PARÁMETRO DE MARGEN', 'ACTUAL', 'LÍMITE BROKER', 'COLCHÓN / DISTANCIA'], ['MARGIN PARAMETER', 'CURRENT', 'BROKER LIMIT', 'BUFFER / DISTANCE']);
    const marginRows = [
        [tx('Apalancamiento Bruto', 'Gross Leverage'), `${leverage.toFixed(2)}x`, '2.00x Reg-T', `${(2.0 - leverage).toFixed(2)}x ${tx('Libre', 'Free')}`, +8],
        [tx('Margen de Mantenimiento', 'Maintenance Margin'), '18.5% NAV', tx('25.0% Mínimo', '25.0% Min'), '+6.5% Buffer', +6],
        [tx('Caída para Margin Call', 'Drop to Margin Call'), `-${Math.round(44 / leverage)}% ${tx('Mercado', 'Market')}`, tx('-15% Alerta', '-15% Alert'), tx('Zona Segura', 'Safe Zone'), leverage <= 1.5 ? +10 : -8]
    ];

    return (
        <PortfolioCardShell
            badge="CUADRANTE 2 • COBERTURA & MARGEN"
            title={tx('Cobertura y Margen', 'Hedging & Margin')}
            color="#f43f5e"
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {[
                        { id: 'HEDGE', lbl: tx('Cobertura Put', 'Put Hedge') },
                        { id: 'MARGIN', lbl: tx('Margen', 'Margin') }
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
                tab === 'HEDGE' ? (
                    <button
                        onClick={() => setHedgeActive(v => !v)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'transparent',
                            border: 'none',
                            color: hedgeActive ? 'var(--ui-accent, #10b981)' : '#94a3b8',
                            textShadow: hedgeActive ? '0 0 10px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.7)' : 'none',
                            fontSize: '11.5px',
                            fontWeight: hedgeActive ? 900 : 700,
                            cursor: 'pointer',
                            padding: 0
                        }}
                    >
                        {hedgeActive
                            ? tx('Cobertura Put Activa (Costo Prima: -0.65%/año)', 'Put Hedge Active (Premium Cost: -0.65%/yr)')
                            : tx('Activar Cobertura Put en Cartera Total (Costo Prima: -0.65%/año)', 'Activate Put Hedge on Total Portfolio (Premium Cost: -0.65%/yr)')}
                    </button>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>
                            {tx('SIMULAR APALANCAMIENTO:', 'SIMULATE LEVERAGE:')}
                        </span>
                        {[1.0, 1.25, 1.5, 1.85].map(lv => (
                            <button
                                key={lv}
                                onClick={() => setLeverage(lv)}
                                style={{
                                    padding: '1px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: leverage === lv ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                    textShadow: leverage === lv ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                    fontSize: '12px',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: leverage === lv ? 800 : 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {lv.toFixed(2)}x
                            </button>
                        ))}
                    </div>
                )
            }
        >
            {tab === 'HEDGE' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr 1fr 1.1fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                        {hedgeHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, hedgeHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {hedgeRows.map((r, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1.15fr 1fr 1fr 1.1fr',
                                padding: '5px 6px',
                                borderRadius: '5px',
                                background: 'transparent',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontFamily: 'sans-serif', fontWeight: 800, color: '#e2e8f0' }}>{r[0]}</span>
                            <span style={{ textAlign: 'center', color: '#fda4af' }}>{r[1]}</span>
                            <span style={{ textAlign: 'center', color: '#6ee7b7', fontWeight: 900 }}>{r[2]}</span>
                            <span style={{ textAlign: 'right', padding: '1.5px 6px', borderRadius: '4px', fontWeight: 900, justifySelf: 'end', ...getSemanticReturnStyle(r[4], 15) }}>
                                {r[3]}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.9fr 0.9fr 1.1fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                        {marginHeaders.map((h, i) => (
                            <span key={h} style={{ textAlign: colAlign(i, marginHeaders.length) }}>{h}</span>
                        ))}
                    </div>
                    {marginRows.map((r, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1.3fr 0.9fr 0.9fr 1.1fr',
                                padding: '5px 6px',
                                borderRadius: '5px',
                                background: 'transparent',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ textAlign: 'left', fontFamily: 'sans-serif', fontWeight: 800, color: '#e2e8f0' }}>{r[0]}</span>
                            <span style={{ textAlign: 'center', color: '#f8fafc', fontWeight: 800 }}>{r[1]}</span>
                            <span style={{ textAlign: 'center', color: '#94a3b8' }}>{r[2]}</span>
                            <span style={{ textAlign: 'right', padding: '1.5px 6px', borderRadius: '4px', fontWeight: 900, justifySelf: 'end', ...getSemanticReturnStyle(r[4], 10) }}>
                                {r[3]}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </PortfolioCardShell>
    );
}

/* CUADRANTE 3: COMITÉ AUTÓNOMO DE 3 PILARES & CIRCUIT-BREAKER (NEW-09) (320PX) */
function Quad3AutonomousCommittee({ activeSym, allocPct, candidateInfo, isES = false }) {
    const c = candidateInfo || evaluateTacticalCandidate(activeSym, null, isES);
    const isCapped = allocPct > 20;

    const headers = txList(['PILAR DEL COMITÉ', 'SEÑAL / MÉTRICA', 'UMBRAL REGLA', 'VEREDICTO'], ['COMMITTEE PILLAR', 'SIGNAL / METRIC', 'RULE THRESHOLD', 'VERDICT']);
    const pillars = [
        [
            tx('Análisis Cuantitativo', 'Quantitative Analysis'),
            c.quantScore,
            'Z-Score > +1.5',
            tx('APROBADO', 'APPROVED'),
            +10
        ],
        [
            tx('Investigación y Noticias', 'Research & Sentiment'),
            c.researchScore,
            tx('Sentimiento > +0.35', 'Sentiment > +0.35'),
            tx('APROBADO', 'APPROVED'),
            +8
        ],
        [
            tx('Límite de Riesgo', 'Risk Guardrail'),
            txTpl("Peso Solicitado: {0}% | P-06: {1}", [allocPct, c.p06], "Requested Weight: {0}% | P-06: {1}", [allocPct, c.p06]),
            'Cap ≤ 20% | P-06 < 0.65',
            isCapped
                ? tx('RECORTADO A 20%', 'CAPPED AT 20%')
                : tx('DENTRO DE LÍMITE', 'WITHIN LIMIT'),
            isCapped ? -10 : +12
        ]
    ];

    return (
        <PortfolioCardShell
            badge="CUADRANTE 3 • COMITÉ"
            title={tx('Comité de Riesgo', 'Risk Committee')}
            subtitle={txTpl("Evaluación sobre {0}", [c.sym], "Evaluation on {0}", [c.sym])}
            color="#10b981"
            subBar={
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#6ee7b7' }}>
                    {tx('REGLA DURA INSTITUCIONAL: Tope máximo 20% NAV por activo • Circuit-Breaker al 5% NAV si P-06 ≥ 0.65', 'INSTITUTIONAL HARD RULE: Max 20% NAV cap per asset • 5% NAV Circuit-Breaker if P-06 ≥ 0.65')}
                </span>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1.45fr 1fr 0.95fr', color: '#64748b', fontWeight: 800, fontSize: '11.5px', padding: '0 6px' }}>
                    {headers.map((h, i) => (
                        <span key={h} style={{ textAlign: colAlign(i, headers.length) }}>{h}</span>
                    ))}
                </div>
                {pillars.map((p, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1.25fr 1.45fr 1fr 0.95fr',
                            padding: '5px 6px',
                            borderRadius: '5px',
                            background: 'transparent',
                            alignItems: 'center'
                        }}
                    >
                        <span style={{ textAlign: 'left', fontFamily: 'sans-serif', fontWeight: 800, color: '#f8fafc' }}>{p[0]}</span>
                        <span style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#cbd5e1', fontSize: '11.5px' }}>{p[1]}</span>
                        <span style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11.5px' }}>{p[2]}</span>
                        <span style={{ textAlign: 'right', padding: '1.5px 6px', borderRadius: '4px', fontWeight: 900, justifySelf: 'end', ...getSemanticReturnStyle(p[4], 12) }}>
                            {p[3]}
                        </span>
                    </div>
                ))}
                <div
                    style={{
                        marginTop: '2px',
                        padding: '5px 8px',
                        borderRadius: '5px',
                        background: isCapped ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.10)',
                        border: `1px solid ${isCapped ? 'rgba(244,63,94,0.35)' : 'rgba(16,185,129,0.3)'}`,
                        fontSize: '11.5px',
                        fontFamily: 'sans-serif',
                        color: isCapped ? '#fda4af' : '#a7f3d0'
                    }}
                >
                    <strong>{tx('Síntesis de Consenso:', 'Consensus Synthesis:')}</strong> {c.guardrailNote}
                </div>
            </div>
        </PortfolioCardShell>
    );
}

/* CUADRANTE 4: LIBRO DE EJECUCIÓN & AUDITORÍA HISTÓRICA (EXECUTION LEDGER NEW-10) (320PX) */
function Quad4ExecutionLedger({ ledger, isES = false }) {
    const headers = txList(['HORA / FECHA', 'ACTIVO', 'ESTRATEGIA', 'PESO NAV', 'Δ SHARPE', 'Δ VaR 95%', 'ESTADO'], ['TIME / DATE', 'ASSET', 'STRATEGY', 'NAV WEIGHT', 'Δ SHARPE', 'Δ 95% VaR', 'STATUS']);

    return (
        <PortfolioCardShell
            badge="CUADRANTE 4 • HISTORIAL"
            title={tx('Historial de Simulaciones', 'Simulation History')}
            color="#10b981"
            subBar={
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#94a3b8' }}>
                    {txTpl("REGISTRO DE REBALANCEOS TÁCTICOS Y RECORTE DE GUARDRAILS ({0} ÓRDENES)", [ledger.length], "TACTICAL REBALANCING & GUARDRAIL AUDIT LOG ({0} ORDERS)", [ledger.length])}
                </span>
            }
        >
            <div className="resp-portfolio-table-scroll">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', fontFamily: 'var(--font-mono)', minWidth: '470px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 0.75fr 1.15fr 0.7fr 0.7fr 0.75fr 0.85fr', color: '#64748b', fontWeight: 800, fontSize: '11px', padding: '0 6px' }}>
                    {headers.map((h, i) => (
                        <span key={h} style={{ textAlign: colAlign(i, headers.length) }}>{h}</span>
                    ))}
                </div>
                {ledger.slice(0, 4).map((row, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '0.9fr 0.75fr 1.15fr 0.7fr 0.7fr 0.75fr 0.85fr',
                            padding: '5px 6px',
                            borderRadius: '5px',
                            background: 'transparent',
                            alignItems: 'center'
                        }}
                    >
                        <span style={{ textAlign: 'left', color: '#94a3b8' }}>{row.time}</span>
                        <span style={{ textAlign: 'center', fontWeight: 900, color: '#f8fafc' }}>{row.sym}</span>
                        <span style={{ textAlign: 'center', fontFamily: 'sans-serif', fontWeight: 700, color: '#cbd5e1' }}>{row.side}</span>
                        <span style={{ textAlign: 'center', color: '#6ee7b7', fontWeight: 800 }}>{row.navPct}</span>
                        <span style={{ textAlign: 'center', color: '#6ee7b7', fontWeight: 800 }}>{row.impactSharpe}</span>
                        <span style={{ textAlign: 'center', color: row.impactVaR.startsWith('-') ? '#fda4af' : '#6ee7b7', fontWeight: 800 }}>
                            {row.impactVaR}
                        </span>
                        <span
                            style={{
                                textAlign: 'right',
                                padding: '1.5px 5px',
                                borderRadius: '4px',
                                fontWeight: 900,
                                justifySelf: 'end',
                                ...getSemanticReturnStyle(8, 10)
                            }}
                        >
                            {row.status}
                        </span>
                    </div>
                ))}
            </div>
            </div>
        </PortfolioCardShell>
    );
}

/* FILA 3 (100% ANCHO): VALIDACIÓN WALK-FORWARD (#9) & CURVA COMPARADA CON SOMBRA DEGRADADA */
function Row3WalkForwardFullWidth({ activeSym, allocPct, isES = false }) {
    const [showBase, setShowBase] = useState(true);
    const [showAdHoc, setShowAdHoc] = useState(true);
    const [showFloor, setShowFloor] = useState(true);

    const series = useMemo(() => {
        const boost = Math.min(20, allocPct) / 12;
        return WALK_FORWARD_SERIES.map(d => ({
            ...d,
            adhoc: Number((d.base + (d.adhoc - d.base) * boost).toFixed(1))
        }));
    }, [allocPct]);

    return (
        <PortfolioCardShell
            badge="FILA 3 • ANCHO COMPLETO (100%)"
            title={tx('Validación Histórica', 'Walk-Forward Validation')}
            subtitle={txTpl("Cartera Base vs Cartera + {0}", [activeSym], "Base Portfolio vs Portfolio + {0}", [activeSym])}
            color="#10b981"
            subBar={
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>
                            {tx('CURVAS VISIBLES:', 'VISIBLE CURVES:')}
                        </span>
                        {[
                            {
                                lbl: txTpl("Cartera Total + {0} (+49.4%)", [activeSym], "Total Portfolio + {0} (+49.4%)", [activeSym]),
                                val: showAdHoc,
                                set: setShowAdHoc,
                                col: '#10b981'
                            },
                            {
                                lbl: tx('Cartera Base (+34.6%)', 'Base Portfolio (+34.6%)'),
                                val: showBase,
                                set: setShowBase,
                                col: '#6ee7b7'
                            },
                            {
                                lbl: tx('Piso Mínimo Out-of-Sample', 'Out-of-Sample Floor'),
                                val: showFloor,
                                set: setShowFloor,
                                col: '#f43f5e'
                            }
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
                    <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: '#6ee7b7' }}>
                        {tx('Eficiencia Walk-Forward (OOS / IS):', 'Walk-Forward Efficiency (OOS / IS):')}{' '}
                        <strong>{tx('94.2% (Sin Overfitting)', '94.2% (No Overfitting)')}</strong>
                    </span>
                </>
            }
        >
            <div style={{ width: '100%', height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={series} margin={{ top: 6, right: 14, left: -16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="prodV3AdHocGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="prodV3FloorRed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                        <XAxis dataKey="p" tick={{ fill: '#64748b', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[98, 155]} tick={{ fill: '#64748b', fontSize: 9.5 }} axisLine={false} tickLine={false} />
                        <ReferenceLine x="W6 (IS)" stroke="rgba(16,185,129,0.45)" strokeDasharray="3 3" />
                        <RechartsTooltip contentStyle={{ background: '#090d16', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '6px', fontSize: '13px' }} />
                        {showAdHoc && (
                            <Area
                                type="monotone"
                                dataKey="adhoc"
                                name={tx('★ Cartera + Estrategia Ad-Hoc', '★ Portfolio + Ad-Hoc Strategy')}
                                stroke="#10b981"
                                strokeWidth={2.3}
                                fill="url(#prodV3AdHocGreen)"
                            />
                        )}
                        {showBase && (
                            <Area
                                type="monotone"
                                dataKey="base"
                                name={tx('Cartera Base', 'Base Portfolio')}
                                stroke="#6ee7b7"
                                strokeWidth={1.8}
                                strokeDasharray="5 3"
                                fill="none"
                            />
                        )}
                        {showFloor && (
                            <Area
                                type="monotone"
                                dataKey="oosFloor"
                                name={tx('Piso Mínimo OOS', 'Min OOS Floor')}
                                stroke="#f43f5e"
                                strokeWidth={1.6}
                                fill="url(#prodV3FloorRed)"
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </PortfolioCardShell>
    );
}

export default function PortfolioVista3AdHoc({
    holdings = INITIAL_HOLDINGS,
    watchlistSyms = [],
    langCode = 'EN'
}) {
    const { localeTick } = useViewLocale(langCode);
    const isES = `${langCode}_${localeTick}`;
    const [activeSym, setActiveSym] = useState('NVDA');
    const [allocPct, setAllocPct] = useState(14.2);
    const [hedgeActive, setHedgeActive] = useState(true);
    const [liveAnomalyMap, setLiveAnomalyMap] = useState({});
    const [ledger, setLedger] = useState(() => {
        try {
            const raw = localStorage.getItem('mi_portfolio_adhoc_ledger_v1');
            const parsed = raw ? JSON.parse(raw) : null;
            return Array.isArray(parsed) && parsed.length ? parsed : INITIAL_LEDGER;
        } catch {
            return INITIAL_LEDGER;
        }
    });

    const liveMetrics = useMemo(() => computeLivePortfolioMetrics(holdings, isES), [holdings, isES]);

    const candidateSyms = useMemo(() => {
        const base = Object.keys(TACTICAL_CANDIDATES);
        const extra = [
            ...holdings.filter(h => h.enabled !== false).map(h => h.sym),
            ...watchlistSyms
        ].filter(s => !base.includes(s));
        return [...base, ...Array.from(new Set(extra)).slice(0, 4)];
    }, [holdings, watchlistSyms]);

    const candidateInfo = useMemo(
        () => evaluateTacticalCandidate(activeSym, liveAnomalyMap[activeSym], isES),
        [activeSym, liveAnomalyMap, isES]
    );

    const handleExecuteOrder = async () => {
        const eff = Math.min(20, allocPct);
        let p06Score = candidateInfo.p06;
        try {
            const [anomRes] = await Promise.all([
                runLiveAnomalyInference(activeSym),
                runLiveCommitteeCycle(activeSym)
            ]);
            if (typeof anomRes?.anomalyScore === 'number') {
                p06Score = Number(anomRes.anomalyScore.toFixed(2));
                setLiveAnomalyMap(prev => ({ ...prev, [activeSym]: p06Score }));
            }
        } catch {
            // deterministic fallback preserved
        }

        const circuitBroken = p06Score >= 0.65;
        const finalEff = circuitBroken ? Math.min(5, eff) : eff;
        const newEntry = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sym: activeSym,
            side: circuitBroken
                ? 'CIRCUIT-BREAKER 5%'
                : allocPct > 20
                ? 'CAP GUARDRAIL 20%'
                : tx('SIMULACIÓN AD-HOC', 'AD-HOC SIMULATION'),
            navPct: `${finalEff.toFixed(1)}%`,
            kelly: 'Half-Kelly',
            impactSharpe: `+${(finalEff * 0.015).toFixed(2)}`,
            impactVaR: hedgeActive ? '+0.42%' : '-0.14%',
            status: tx('SIMULADA', 'SIMULATED')
        };

        setLedger(prev => {
            const next = [newEntry, ...prev].slice(0, 12);
            try {
                localStorage.setItem('mi_portfolio_adhoc_ledger_v1', JSON.stringify(next));
            } catch {
                // ignore storage quota errors
            }
            return next;
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Row1TotalPortfolioImpactHeader
                activeSym={activeSym}
                allocPct={allocPct}
                hedgeActive={hedgeActive}
                liveMetrics={liveMetrics}
                candidateInfo={candidateInfo}
                isES={isES}
            />
            <div className="resp-portfolio-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', alignItems: 'stretch' }}>
                <Quad1WhatIfAndKelly
                    activeSym={activeSym}
                    setActiveSym={setActiveSym}
                    allocPct={allocPct}
                    setAllocPct={setAllocPct}
                    onExecuteOrder={handleExecuteOrder}
                    candidateSyms={candidateSyms}
                    liveMetrics={liveMetrics}
                    candidateInfo={candidateInfo}
                    isES={isES}
                />
                <Quad3AutonomousCommittee
                    activeSym={activeSym}
                    allocPct={allocPct}
                    candidateInfo={candidateInfo}
                    isES={isES}
                />
                <Quad2TailHedgeAndMargin hedgeActive={hedgeActive} setHedgeActive={setHedgeActive} isES={isES} />
                <Quad4ExecutionLedger ledger={ledger} isES={isES} />
            </div>
            <Row3WalkForwardFullWidth activeSym={activeSym} allocPct={allocPct} isES={isES} />
        </div>
    );
}

