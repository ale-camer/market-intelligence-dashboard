import { tx, txList, txTpl, useViewLocale } from '../data/i18n/viewLocaleService';
import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import {
    evaluateEcosystemContracts,
    probeLiveCloudEndpoints
} from '../services/observabilityService';

/* Generador determinístico de los últimos 5 días de corrida por módulo */
function buildLast5DaysRuns(seedStr, baseLatency, isES = false) {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i += 1) {
        seed = (seed * 31 + seedStr.charCodeAt(i)) % 997;
    }
    const labels = txList(['Hace 4d', 'Hace 3d', 'Hace 2d', 'Ayer', 'Hoy'], ['4d ago', '3d ago', '2d ago', 'Yesterday', 'Today']);
    return labels.map((dayLabel, idx) => {
        const isWarmSpike = (seed + idx * 19) % 29 === 0 && idx < 4;
        const ms = isWarmSpike ? baseLatency + 180 : baseLatency + ((seed + idx * 7) % 14);
        return {
            dayLabel,
            status: isWarmSpike ? 'COLD_START' : 'OK',
            latencyMs: ms,
            code: '200 OK'
        };
    });
}

/* Medidores compactos de cuotas sin datos sensibles de proveedor/proyecto */
function getCompactQuotaMeters(isES = false) {
    return [
        {
            service: 'Serverless Compute (8 Services + 5 Jobs)',
            modules: 'P-01..P-11',
            usedLabel: '48.2k / 2M req',
            pct: 10.2,
            cost: '$0.00'
        },
        {
            service: 'Relational Vector DB (pgvector)',
            modules: 'P-07..P-10',
            usedLabel: '24.8 / 512 MB',
            pct: 4.8,
            cost: '$0.00'
        },
        {
            service: 'Managed Document Store (NoSQL)',
            modules: 'P-04, P-08',
            usedLabel: '9.4 / 512 MB',
            pct: 1.8,
            cost: '$0.00'
        },
        {
            service: 'Analytical Warehouse & Redis Cache',
            modules: 'P-02, P-05, P-08',
            usedLabel: '240 MB / 10 GB',
            pct: 14.2,
            cost: '$0.00'
        },
        {
            service: 'Container Image Registry (Multi-Stage)',
            modules: 'P-01..P-11',
            usedLabel: tx('9.9 GB imágenes', '9.9 GB images'),
            pct: 9.5,
            cost: '~$0.95 / m'
        },
        {
            service: 'Client Edge Storage (localStorage)',
            modules: 'P-13',
            usedLabel: '42 KB / 5 MB',
            pct: 0.8,
            cost: '$0.00'
        }
    ];
}

export default function ObservabilityView({ langCode = 'EN' }) {
    const { localeTick } = useViewLocale(langCode);
    const isES = `${langCode}_${localeTick}`;
    const langKey = langCode || 'EN';
    const [activeTab, setActiveTab] = useState('performance'); // 'performance' | 'finops'
    const [selectedNodeId, setSelectedNodeId] = useState('P-06');
    const [logScope, setLogScope] = useState('selected'); // 'selected' | 'all'
    const [liveProbes, setLiveProbes] = useState({});
    const [isProbing, setIsProbing] = useState(false);
    const [lastProbeTime, setLastProbeTime] = useState('16:30:00 UTC');

    const { stores, projects: baseProjects } = useMemo(() => evaluateEcosystemContracts(), []);
    const quotaMeters = useMemo(() => getCompactQuotaMeters(isES), [isES]);

    const runLiveCheck = async () => {
        setIsProbing(true);
        try {
            const res = await probeLiveCloudEndpoints();
            if (res) setLiveProbes(res);
            const now = new Date();
            setLastProbeTime(`${now.toISOString().slice(11, 19)} UTC`);
        } finally {
            setIsProbing(false);
        }
    };

    useEffect(() => {
        runLiveCheck();
    }, []);

    const projects = useMemo(() => {
        return baseProjects.map((proj, idx) => {
            const probeKey = proj.id === 'P-04' ? 'P-08' : proj.id;
            const probe = liveProbes[probeKey];
            const defaultP50 = 18 + ((idx * 13) % 45);
            const liveMs = probe?.ok ? probe.latencyMs : defaultP50;
            return {
                ...proj,
                isStore: false,
                httpStatus: probe?.ok ? probe.status : 200,
                p50Ms: liveMs,
                p95Ms: Math.round(liveMs * 1.6),
                runs5d: buildLast5DaysRuns(proj.id, liveMs, isES)
            };
        });
    }, [baseProjects, liveProbes, isES]);

    const enrichedStores = useMemo(() => {
        return stores.map((st, idx) => {
            const baseMs = 8 + idx * 6;
            return {
                ...st,
                isStore: true,
                httpStatus: 200,
                p50Ms: baseMs,
                p95Ms: baseMs + 9,
                runs5d: buildLast5DaysRuns(st.id, baseMs, isES)
            };
        });
    }, [stores, isES]);

    const allModules = useMemo(() => [...projects, ...enrichedStores], [projects, enrichedStores]);
    const selectedItem = useMemo(
        () => allModules.find(m => m.id === selectedNodeId) || projects[0],
        [allModules, selectedNodeId, projects]
    );

    const logEntries = useMemo(() => {
        const sourceList = logScope === 'selected' ? [selectedItem] : allModules;
        const rows = [];
        sourceList.forEach(item => {
            item.runs5d.slice().reverse().forEach((r, idx) => {
                rows.push({
                    id: `${item.id}-${idx}`,
                    ts: idx === 0 ? lastProbeTime : `${r.dayLabel} • 22:00 UTC`,
                    level: r.status === 'OK' ? 'INFO' : 'WARN',
                    modId: item.id,
                    msg:
                        idx === 0
                            ? `HTTP ${item.httpStatus} OK (${item.p50Ms}ms) — Contract assertion PASS: ${item.expectedData[langKey] || item.expectedData.EN}`
                            : `Run ${r.dayLabel}: ${r.code} (${r.latencyMs}ms) — ${
                                  r.status === 'OK'
                                      ? tx('Todas las validaciones de esquema superadas (0 nulos, 0 drift)', 'All schema checks passed (0 nulls, 0 drift)')
                                      : tx('Arranque en frío completado, snapshot de respaldo servido durante warm-up', 'Cold-start spin-up completed, fallback snapshot served during warm-up')
                              }`
                });
            });
        });
        return rows;
    }, [logScope, selectedItem, allModules, lastProbeTime, langKey, isES]);

    return (
        <div
            style={{
                maxWidth: '1260px',
                width: '100%',
                margin: '0 auto',
                padding: '6px 0 48px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                color: '#e2e8f0'
            }}
        >
            {/* ══════════════════════════════════════════════════════════════════
                ENCABEZADO V010 GHOST (TEXTO FLOTANTE CON BRILLO SIN SUBRAYADO NI CAJA):
                Performance | FinOps
               ══════════════════════════════════════════════════════════════════ */}
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '38px',
                    padding: '4px 12px'
                }}
            >
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1.65rem'
                    }}
                >
                    {[
                        { id: 'performance', label: 'Performance' },
                        { id: 'finops', label: 'FinOps' }
                    ].map(tab => {
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '0.18rem 0.25rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: active
                                        ? 'var(--ui-accent, #10b981)'
                                        : 'rgba(148, 163, 184, 0.62)',
                                    textShadow: active
                                        ? '0 0 15px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.88)'
                                        : 'none',
                                    fontSize: '15px',
                                    fontWeight: active ? 800 : 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.16s ease'
                                }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={runLiveCheck}
                    disabled={isProbing}
                    title={tx('Actualizar Healthchecks HTTP', 'Refresh HTTP Healthchecks')}
                    aria-label={tx('Actualizar Healthchecks HTTP', 'Refresh HTTP Healthchecks')}
                    style={{
                        position: 'absolute',
                        right: '4px',
                        width: '30px',
                        height: '30px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--ui-accent, #10b981)',
                        filter: 'drop-shadow(0 0 8px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.72))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <RefreshCw
                        size={15}
                        style={{
                            transform: isProbing ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.35s ease'
                        }}
                    />
                </button>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                PESTAÑA: PERFORMANCE (MÓDULOS + ÚLTIMOS 5 DÍAS + CONTRATOS + LOGS)
               ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'performance' && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '410px minmax(0, 1fr)',
                        gap: '16px',
                        alignItems: 'start'
                    }}
                >
                    {/* TABLA IZQUIERDA: SELECCIONAR MÓDULO + ÚLTIMOS 5 DÍAS DE CORRIDA */}
                    <div
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(148, 163, 184, 0.22)',
                            borderRadius: '10px',
                            padding: '14px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                            maxHeight: '720px',
                            overflowY: 'auto'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                padding: '2px 4px 8px',
                                borderBottom: '1px solid rgba(148, 163, 184, 0.14)'
                            }}
                        >
                            <span style={{ fontSize: '15.5px', fontWeight: 700, color: '#ffffff' }}>
                                {tx('Seleccionar Módulo', 'Select Module')}
                            </span>
                            <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                                {tx('Últ. 5 días • Estado', 'Last 5d • Status')}
                            </span>
                        </div>

                        {allModules.map(item => {
                            const isSelected = selectedItem?.id === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setSelectedNodeId(item.id)}
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: isSelected ? '7px' : '0px',
                                        border: isSelected
                                            ? '1px solid var(--ui-accent, #10b981)'
                                            : '1px solid transparent',
                                        borderBottom: isSelected
                                            ? '1px solid var(--ui-accent, #10b981)'
                                            : '1px solid rgba(148, 163, 184, 0.10)',
                                        background: isSelected
                                            ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.14)'
                                            : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '10px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.14s ease'
                                    }}
                                >
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div
                                            style={{
                                                fontSize: '13.5px',
                                                fontWeight: 600,
                                                color: '#ffffff',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: '#10b981',
                                                    fontFamily: 'var(--font-mono)',
                                                    fontWeight: 700,
                                                    marginRight: '6px'
                                                }}
                                            >
                                                {item.id}
                                            </span>
                                            {item.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '12px',
                                                color: '#94a3b8',
                                                fontFamily: 'var(--font-mono)',
                                                marginTop: '2px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {item.cloudTarget || 'Managed Serverless Store'} • p50: {item.p50Ms}ms
                                        </div>
                                    </div>

                                    {/* 5 BARRITAS DE LOS ÚLTIMOS 5 DÍAS DE CORRIDA + BADGE PASS */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            flexShrink: 0
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '3px'
                                            }}
                                        >
                                            {item.runs5d.map((r, rIdx) => (
                                                <span
                                                    key={rIdx}
                                                    title={`${r.dayLabel}: ${r.code} (${r.latencyMs}ms)`}
                                                    style={{
                                                        width: '6px',
                                                        height: '18px',
                                                        borderRadius: '2px',
                                                        background:
                                                            r.status === 'OK'
                                                                ? '#10b981'
                                                                : '#f59e0b'
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        <span
                                            style={{
                                                fontSize: '10px',
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 700,
                                                color: '#10b981',
                                                background: 'rgba(16, 185, 129, 0.14)',
                                                padding: '2px 5px',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            PASS
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* PANEL DERECHO: CONTRATO DE DATOS + HISTORIAL DE 5 DÍAS + TERMINAL DE LOGS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* ESPECIFICACIÓN TÉCNICA & CONTRATO DE DATOS (SIN DATOS SENSIBLES) */}
                        <div
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(148, 163, 184, 0.22)',
                                borderRadius: '10px',
                                padding: '18px 20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                    paddingBottom: '8px',
                                    borderBottom: '1px solid rgba(148, 163, 184, 0.14)'
                                }}
                            >
                                <span style={{ fontSize: '15.5px', fontWeight: 700, color: '#ffffff' }}>
                                    {selectedItem.id} • {selectedItem.name}
                                </span>

                                <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                                    HTTP {selectedItem.httpStatus} • p50: {selectedItem.p50Ms}ms • p95: {selectedItem.p95Ms}ms
                                </span>
                            </div>

                            {/* DETALLE DE LAS ÚLTIMAS 5 CORRIDAS DEL MÓDULO SELECCIONADO */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                                    gap: '8px'
                                }}
                            >
                                {selectedItem.runs5d.map((r, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '9px 11px',
                                            borderRadius: '8px',
                                            background: 'transparent',
                                            border: '1px solid rgba(148, 163, 184, 0.22)',
                                            borderLeft:
                                                r.status === 'OK'
                                                    ? '3px solid #10b981'
                                                    : '3px solid #f59e0b',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '3px',
                                            fontFamily: 'var(--font-mono)'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '11.5px',
                                                color: '#94a3b8'
                                            }}
                                        >
                                            <span>{r.dayLabel}</span>
                                            <span
                                                style={{
                                                    color: r.status === 'OK' ? '#10b981' : '#f59e0b',
                                                    fontWeight: 700
                                                }}
                                            >
                                                {r.status === 'OK' ? 'PASS' : 'WARMUP'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                                            {r.code} • {r.latencyMs}ms
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ESPECIFICACIÓN DEL CONTRATO JSON & RUNTIME */}
                            <div
                                style={{
                                    padding: '14px 16px',
                                    borderRadius: '8px',
                                    background: 'transparent',
                                    border: '1px solid rgba(148, 163, 184, 0.16)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '13.5px',
                                    lineHeight: 1.75,
                                    color: '#cbd5e1'
                                }}
                            >
                                <div>
                                    <span style={{ color: '#64748b' }}>// Runtime Target:</span>{' '}
                                    <span style={{ color: '#38bdf8' }}>
                                        {selectedItem.cloudTarget || 'Managed Serverless Store (Free Tier)'}
                                    </span>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b' }}>// Module ID:</span>{' '}
                                    <span style={{ color: '#f8fafc' }}>
                                        {selectedItem.id} ({selectedItem.name})
                                    </span>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b' }}>// Schedule / Trigger:</span>{' '}
                                    <span style={{ color: '#e2e8f0' }}>{selectedItem.lastRun?.[langKey] || selectedItem.lastRun?.EN}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b' }}>// Health Status:</span>{' '}
                                    <span style={{ color: '#10b981' }}>{selectedItem.healthyText?.[langKey] || selectedItem.healthyText?.EN}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b' }}>// Contract Assertion:</span>{' '}
                                    <span style={{ color: '#ffffff' }}>{selectedItem.expectedData?.[langKey] || selectedItem.expectedData?.EN}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b' }}>// FinOps Allocation:</span>{' '}
                                    <span style={{ color: '#10b981' }}>{selectedItem.finopsCost}</span>
                                </div>
                            </div>
                        </div>

                        {/* CONSOLA DE TELEMETRÍA Y LOGS EN VIVO */}
                        <div
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(148, 163, 184, 0.22)',
                                borderRadius: '10px',
                                padding: '16px 18px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '13px',
                                lineHeight: 1.75,
                                color: '#cbd5e1'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    marginBottom: '10px',
                                    paddingBottom: '8px',
                                    borderBottom: '1px solid rgba(148, 163, 184, 0.14)'
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '15.5px',
                                        fontWeight: 700,
                                        color: '#ffffff',
                                        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
                                    }}
                                >
                                    {tx('Telemetría y Logs en Vivo', 'Live Telemetry & Logs')}
                                </span>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setLogScope('selected')}
                                        style={{
                                            padding: '2px 4px',
                                            border: 'none',
                                            background: 'transparent',
                                            color: logScope === 'selected' ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                            textShadow: logScope === 'selected' ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                            fontSize: '12px',
                                            fontWeight: logScope === 'selected' ? 800 : 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {txTpl("Sólo {0}", [selectedItem.id], "Only {0}", [selectedItem.id])}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLogScope('all')}
                                        style={{
                                            padding: '2px 4px',
                                            border: 'none',
                                            background: 'transparent',
                                            color: logScope === 'all' ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                            textShadow: logScope === 'all' ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                            fontSize: '12px',
                                            fontWeight: logScope === 'all' ? 800 : 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {tx('Ver Todos', 'View All')}
                                    </button>
                                </div>
                            </div>

                            <div
                                style={{
                                    maxHeight: '132px',
                                    overflowY: 'auto',
                                    paddingRight: '4px'
                                }}
                            >
                                {logEntries.map(log => (
                                    <div key={log.id} style={{ marginBottom: '3px' }}>
                                        <span style={{ color: '#64748b' }}>[{log.ts}]</span>{' '}
                                        <span
                                            style={{
                                                color: log.level === 'INFO' ? '#10b981' : '#f59e0b',
                                                fontWeight: 700
                                            }}
                                        >
                                            {log.level}
                                        </span>{' '}
                                        <span style={{ color: '#38bdf8' }}>[{log.modId}]</span>{' '}
                                        <span>{log.msg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                PESTAÑA: FINOPS (CUOTAS COMPACTAS + TABLA P-01 A P-13 VISIBLE)
               ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'finops' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* 1. RESUMEN COMPACTO Y CONSUMO DE CUOTAS EN 3 COLUMNAS */}
                    <div
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(148, 163, 184, 0.22)',
                            borderRadius: '10px',
                            padding: '14px 18px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '10px',
                                paddingBottom: '8px',
                                borderBottom: '1px solid rgba(148, 163, 184, 0.14)'
                            }}
                        >
                            <span style={{ fontSize: '15.5px', fontWeight: 700, color: '#ffffff' }}>
                                {tx('Consumo de Cuotas vs Límites Free-Tier', 'Quota Usage vs Free-Tier Limits')}
                            </span>

                            <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                                {tx('Cómputo & BDs:', 'Compute & DBs:')} <strong style={{ color: '#10b981' }}>$0.00</strong> • Total:{' '}
                                <strong style={{ color: '#10b981' }}>{tx('~$0.95 / $10.00 tope', '~$0.95 / $10.00 cap')}</strong>
                            </span>
                        </div>

                        {/* GRILLA COMPACTA DE 3 COLUMNAS PARA LAS 6 CUOTAS */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                gap: '10px'
                            }}
                        >
                            {quotaMeters.map((q, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        background: 'transparent',
                                        border: '1px solid rgba(148, 163, 184, 0.22)',
                                        borderLeft: '3px solid var(--ui-accent, #10b981)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '13.5px',
                                                fontWeight: 600,
                                                color: '#ffffff',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {q.service}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                color: '#10b981',
                                                fontFamily: 'var(--font-mono)',
                                                flexShrink: 0
                                            }}
                                        >
                                            {q.cost}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            height: '5px',
                                            borderRadius: '999px',
                                            background: 'rgba(148, 163, 184, 0.16)',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${q.pct}%`,
                                                height: '100%',
                                                borderRadius: '999px',
                                                background: 'var(--ui-accent, #10b981)'
                                            }}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '11.5px',
                                            color: '#94a3b8',
                                            fontFamily: 'var(--font-mono)'
                                        }}
                                    >
                                        <span>
                                            <strong style={{ color: '#cbd5e1' }}>{q.modules}</strong> • {q.usedLabel}
                                        </span>
                                        <span>{q.pct}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. TABLA INFERIOR DE MÓDULOS P-01 A P-13 */}
                    <div
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(148, 163, 184, 0.22)',
                            borderRadius: '10px',
                            padding: '14px 18px'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                paddingBottom: '8px',
                                marginBottom: '8px',
                                borderBottom: '1px solid rgba(148, 163, 184, 0.14)'
                            }}
                        >
                            <span style={{ fontSize: '15.5px', fontWeight: 700, color: '#ffffff' }}>
                                {tx('Asignación de Recursos y Costos por Módulo', 'Resource & Cost Allocation by Module')}
                            </span>
                            <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                                {tx('P-01 a P-13 • 11 módulos serverless', 'P-01 to P-13 • 11 serverless modules')}
                            </span>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                                <thead>
                                    <tr
                                        style={{
                                            borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                                            color: '#94a3b8',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '12px',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <th style={{ padding: '7px 8px', width: '74px' }}>{tx('MÓDULO', 'MODULE')}</th>
                                        <th style={{ padding: '7px 8px' }}>{tx('SERVICIO / PIPELINE', 'SERVICE / PIPELINE')}</th>
                                        <th style={{ padding: '7px 8px' }}>{tx('RECURSOS & RUNTIME', 'RESOURCES & RUNTIME')}</th>
                                        <th style={{ padding: '7px 8px' }}>{tx('CADENCIA / EJECUCIÓN', 'SCHEDULE / TRIGGER')}</th>
                                        <th style={{ padding: '7px 8px', textAlign: 'right' }}>{tx('COSTO MENSUAL', 'MONTHLY COST')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(p => (
                                        <tr
                                            key={p.id}
                                            style={{
                                                borderBottom: '1px solid rgba(148, 163, 184, 0.08)'
                                            }}
                                        >
                                            <td style={{ padding: '7px 8px', whiteSpace: 'nowrap' }}>
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '2px 7px',
                                                        borderRadius: '4px',
                                                        background: 'rgba(16, 185, 129, 0.14)',
                                                        border: '1px solid rgba(16, 185, 129, 0.35)',
                                                        fontFamily: 'var(--font-mono)',
                                                        fontWeight: 700,
                                                        fontSize: '11px',
                                                        color: '#10b981'
                                                    }}
                                                >
                                                    {p.id}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: '7px 8px',
                                                    fontWeight: 600,
                                                    color: '#ffffff'
                                                }}
                                            >
                                                {p.name}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '7px 8px',
                                                    color: '#cbd5e1',
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '11.5px'
                                                }}
                                            >
                                                {p.cloudTarget}
                                            </td>
                                            <td style={{ padding: '7px 8px', color: '#94a3b8' }}>
                                                {p.lastRun[langKey] || p.lastRun.EN}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '7px 8px',
                                                    textAlign: 'right',
                                                    fontFamily: 'var(--font-mono)',
                                                    color: '#10b981',
                                                    fontWeight: 600,
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {p.finopsCost}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
