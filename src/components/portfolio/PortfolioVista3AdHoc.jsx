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
    TACTICAL_CANDIDATES,
    WALK_FORWARD_SERIES,
    INITIAL_LEDGER
} from './portfolioConstants';

/* FILA 1: ENCABEZADO PERMANENTE DE IMPACTO SOBRE EL TOTAL DE LA CARTERA */
function Row1TotalPortfolioImpactHeader({ activeSym, allocPct, hedgeActive }) {
    const c = TACTICAL_CANDIDATES[activeSym] || TACTICAL_CANDIDATES.NVDA;
    const isCapped = allocPct > 20;
    const effAlloc = isCapped ? 20 : allocPct;

    const deltaRet = Number((3.8 * (effAlloc / 12)).toFixed(1));
    const deltaSharpe = Number((0.22 * (effAlloc / 12) + (hedgeActive ? 0.08 : 0)).toFixed(2));
    const deltaVaR = Number(((hedgeActive ? 0.48 : -0.18) * (effAlloc / 12)).toFixed(2));
    const deltaDD = Number(((hedgeActive ? 1.9 : -0.4) * (effAlloc / 12)).toFixed(2));

    const pills = [
        {
            lbl: 'IMPACTO EN RETORNO TOTAL (CAGR)',
            val: `+28.4% → +${(28.4 + deltaRet).toFixed(1)}%`,
            sub: `Delta Estrategia Ad-Hoc: +${deltaRet}% anual`,
            col: '#10b981'
        },
        {
            lbl: 'IMPACTO EN SHARPE DE CARTERA',
            val: `2.18 → ${(2.18 + deltaSharpe).toFixed(2)}`,
            sub: `Eficiencia marginal: +${deltaSharpe} pts`,
            col: '#10b981'
        },
        {
            lbl: 'IMPACTO EN VaR 95% DIARIO',
            val: `-1.84% → ${(-1.84 + deltaVaR).toFixed(2)}%`,
            sub: deltaVaR >= 0 ? `Mejora cola diaria: +${deltaVaR}%` : `Mayor riesgo cola: ${deltaVaR}%`,
            col: deltaVaR >= 0 ? '#10b981' : '#f43f5e'
        },
        {
            lbl: 'IMPACTO EN MAX DRAWDOWN',
            val: `-4.80% → ${(-4.8 + deltaDD).toFixed(2)}%`,
            sub: deltaDD >= 0 ? `Escudo activo: +${deltaDD}% menos caída` : `Ampliación DD: ${deltaDD}%`,
            col: deltaDD >= 0 ? '#10b981' : '#f43f5e'
        },
        {
            lbl: 'CAPITAL TÁCTICO / CARTERA TOTAL',
            val: `${effAlloc.toFixed(1)}% NAV ($${(effAlloc * 1000).toLocaleString()})`,
            sub: isCapped ? '⚠ Tope Guardrail 20% NAV Aplicado' : '88% Cartera Core Intacta',
            col: isCapped ? '#f43f5e' : '#10b981'
        },
        {
            lbl: 'VEREDICTO COMITÉ 3 PILARES',
            val: c.p06 < 0.65 && !isCapped ? 'APROBADO (3/3)' : 'RECORTE GUARDRAIL',
            sub: `P-06 = ${c.p06} (Umbral < 0.65) • Cap ≤ 20%`,
            col: c.p06 < 0.65 && !isCapped ? '#10b981' : '#f43f5e'
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

/* CUADRANTE 1: SIMULADOR "WHAT-IF" PRE-TRADE (#1) & CRITERIO DE KELLY (#14) (320PX) */
function Quad1WhatIfAndKelly({ activeSym, setActiveSym, allocPct, setAllocPct, onExecuteOrder }) {
    const [subTab, setSubTab] = useState('WHATIF');
    const c = TACTICAL_CANDIDATES[activeSym] || TACTICAL_CANDIDATES.NVDA;

    const headers = ['MÉTRICA DE CARTERA', 'CARTERA BASE', 'CON JUGADA AD-HOC', 'IMPACTO NETO (Δ)'];
    const rows = [
        ['Retorno Anual (CAGR)', '+28.4%', `+${(28.4 + allocPct * 0.28).toFixed(1)}%`, `+${(allocPct * 0.28).toFixed(1)}%`, +(allocPct * 0.28)],
        ['Sharpe Ratio', '2.18', (2.18 + allocPct * 0.015).toFixed(2), `+${(allocPct * 0.015).toFixed(2)}`, +1.5],
        ['VaR 95% Diario', '-1.84%', '-1.52%', '+0.32%', +4],
        ['Exposición Activo', '10.0%', `${(10 + Math.min(20, allocPct)).toFixed(1)}%`, `+${Math.min(20, allocPct).toFixed(1)}%`, +3]
    ];

    const kellyHeaders = ['MODO KELLY', 'FÓRMULA', 'TAMAÑO SUGERIDO', 'RIESGO DE RUINA'];
    const kellyRows = [
        ['Full Kelly (1.0x)', 'W - (1-W)/R', `${c.fullKelly}% NAV`, 'Alto (Volátil)', -4],
        ['Half Kelly (0.5x)', '0.5 × Full Kelly', `${c.halfKelly}% NAV`, 'Óptimo Institucional', +8],
        ['Quarter Kelly (0.25x)', '0.25 × Full Kelly', `${c.quarterKelly}% NAV`, 'Ultra Conservador', +5]
    ];

    return (
        <PortfolioCardShell
            badge="CUADRANTE 1 • SIMULADOR"
            title="Simulador de Posición"
            color="#10b981"
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {[
                        { id: 'WHATIF', lbl: 'Impacto' },
                        { id: 'KELLY', lbl: 'Tamaño Kelly' }
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
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>ACTIVO:</span>
                        {Object.keys(TACTICAL_CANDIDATES).map(sym => (
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
                            Simular Orden ↗
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
                        Parámetros de {c.sym}: <strong>Win Rate {c.winRate}%</strong> • <strong>Payoff Ratio {c.payoff}x</strong> (Clic para aplicar peso):
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
function Quad2TailHedgeAndMargin({ hedgeActive, setHedgeActive }) {
    const [tab, setTab] = useState('HEDGE');
    const [leverage, setLeverage] = useState(1.25);

    const hedgeHeaders = ['CAÍDA S&P 500', 'CARTERA SIN ESCUDO', 'CON PUT 5% OTM', 'PROTECCIÓN NETA'];
    const hedgeRows = [
        ['Crash -10% SPX', '-6.4%', '-2.1%', '+4.3% Salvado', +6],
        ['Crash -20% SPX', '-13.8%', '-3.8%', '+10.0% Salvado', +12],
        ['Crash -30% SPX', '-21.5%', '-4.9%', '+16.6% Salvado', +18]
    ];

    const marginHeaders = ['PARÁMETRO DE MARGEN', 'ACTUAL', 'LÍMITE BROKER', 'COLCHÓN / DISTANCIA'];
    const marginRows = [
        ['Apalancamiento Bruto', `${leverage.toFixed(2)}x`, '2.00x Reg-T', `${(2.0 - leverage).toFixed(2)}x Libre`, +8],
        ['Margen de Mantenimiento', '18.5% NAV', '25.0% Mínimo', '+6.5% Buffer', +6],
        ['Caída para Margin Call', `-${Math.round(44 / leverage)}% Mercado`, '-15% Alerta', 'Zona Segura', leverage <= 1.5 ? +10 : -8]
    ];

    return (
        <PortfolioCardShell
            badge="CUADRANTE 2 • COBERTURA & MARGEN"
            title="Cobertura y Margen"
            color="#f43f5e"
            rightSlot={
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {[
                        { id: 'HEDGE', lbl: 'Cobertura Put' },
                        { id: 'MARGIN', lbl: 'Margen' }
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
                        {hedgeActive ? 'Cobertura Put Activa (Costo Prima: -0.65%/año)' : 'Activar Cobertura Put en Cartera Total (Costo Prima: -0.65%/año)'}
                    </button>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>SIMULAR APALANCAMIENTO:</span>
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
function Quad3AutonomousCommittee({ activeSym, allocPct }) {
    const c = TACTICAL_CANDIDATES[activeSym] || TACTICAL_CANDIDATES.NVDA;
    const isCapped = allocPct > 20;

    const headers = ['PILAR DEL COMITÉ', 'SEÑAL / MÉTRICA', 'UMBRAL REGLA', 'VEREDICTO'];
    const pillars = [
        ['Análisis Cuantitativo', c.quantScore, 'Z-Score > +1.5', 'APROBADO', +10],
        ['Investigación y Noticias', c.researchScore, 'Sentimiento > +0.35', 'APROBADO', +8],
        [
            'Límite de Riesgo',
            `Peso Solicitado: ${allocPct}% | P-06: ${c.p06}`,
            'Cap ≤ 20% | P-06 < 0.65',
            isCapped ? 'RECORTADO A 20%' : 'DENTRO DE LÍMITE',
            isCapped ? -10 : +12
        ]
    ];

    return (
        <PortfolioCardShell
            badge="CUADRANTE 3 • COMITÉ"
            title="Comité de Riesgo"
            subtitle={`Evaluación sobre ${c.sym}`}
            color="#10b981"
            subBar={
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#6ee7b7' }}>
                    REGLA DURA INSTITUCIONAL: Tope máximo 20% NAV por activo • Circuit-Breaker al 5% NAV si P-06 ≥ 0.65
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
                    <strong>Síntesis de Consenso:</strong> {c.guardrailNote}
                </div>
            </div>
        </PortfolioCardShell>
    );
}

/* CUADRANTE 4: LIBRO DE EJECUCIÓN & AUDITORÍA HISTÓRICA (EXECUTION LEDGER NEW-10) (320PX) */
function Quad4ExecutionLedger({ ledger }) {
    const headers = ['HORA / FECHA', 'ACTIVO', 'ESTRATEGIA', 'PESO NAV', 'Δ SHARPE', 'Δ VaR 95%', 'ESTADO'];

    return (
        <PortfolioCardShell
            badge="CUADRANTE 4 • HISTORIAL"
            title="Historial de Simulaciones"
            color="#10b981"
            subBar={
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#94a3b8' }}>
                    REGISTRO DE REBALANCEOS TÁCTICOS Y RECORTE DE GUARDRAILS ({ledger.length} ÓRDENES)
                </span>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
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
        </PortfolioCardShell>
    );
}

/* FILA 3 (100% ANCHO): VALIDACIÓN WALK-FORWARD (#9) & CURVA COMPARADA CON SOMBRA DEGRADADA */
function Row3WalkForwardFullWidth({ activeSym, allocPct }) {
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
            title="Validación Histórica"
            subtitle={`Cartera Base vs Cartera + ${activeSym}`}
            color="#10b981"
            subBar={
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>CURVAS VISIBLES:</span>
                        {[
                            { lbl: `Cartera Total + ${activeSym} (+49.4%)`, val: showAdHoc, set: setShowAdHoc, col: '#10b981' },
                            { lbl: 'Cartera Base (+34.6%)', val: showBase, set: setShowBase, col: '#6ee7b7' },
                            { lbl: 'Piso Mínimo Out-of-Sample', val: showFloor, set: setShowFloor, col: '#f43f5e' }
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
                        Eficiencia Walk-Forward (OOS / IS): <strong>94.2% (Sin Overfitting)</strong>
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
                                name="★ Cartera + Estrategia Ad-Hoc"
                                stroke="#10b981"
                                strokeWidth={2.3}
                                fill="url(#prodV3AdHocGreen)"
                            />
                        )}
                        {showBase && (
                            <Area
                                type="monotone"
                                dataKey="base"
                                name="Cartera Base"
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
                                name="Piso Mínimo OOS"
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

export default function PortfolioVista3AdHoc() {
    const [activeSym, setActiveSym] = useState('NVDA');
    const [allocPct, setAllocPct] = useState(14.2);
    const [hedgeActive, setHedgeActive] = useState(true);
    const [ledger, setLedger] = useState(INITIAL_LEDGER);

    const handleExecuteOrder = () => {
        const eff = Math.min(20, allocPct);
        setLedger(prev => [
            {
                time: 'Ahora',
                sym: activeSym,
                side: allocPct > 20 ? 'CAP GUARDRAIL 20%' : 'SIMULACIÓN AD-HOC',
                navPct: `${eff.toFixed(1)}%`,
                kelly: 'Half-Kelly',
                impactSharpe: `+${(eff * 0.015).toFixed(2)}`,
                impactVaR: hedgeActive ? '+0.42%' : '-0.14%',
                status: 'SIMULADA'
            },
            ...prev
        ]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Row1TotalPortfolioImpactHeader
                activeSym={activeSym}
                allocPct={allocPct}
                hedgeActive={hedgeActive}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', alignItems: 'stretch' }}>
                <Quad1WhatIfAndKelly
                    activeSym={activeSym}
                    setActiveSym={setActiveSym}
                    allocPct={allocPct}
                    setAllocPct={setAllocPct}
                    onExecuteOrder={handleExecuteOrder}
                />
                <Quad3AutonomousCommittee activeSym={activeSym} allocPct={allocPct} />
                <Quad2TailHedgeAndMargin hedgeActive={hedgeActive} setHedgeActive={setHedgeActive} />
                <Quad4ExecutionLedger ledger={ledger} />
            </div>
            <Row3WalkForwardFullWidth activeSym={activeSym} allocPct={allocPct} />
        </div>
    );
}

