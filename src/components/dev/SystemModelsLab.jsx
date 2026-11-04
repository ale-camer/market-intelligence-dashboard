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

const SYSTEM_TABS = [
    { id: 'ALL', label: 'Vista Integral' },
    { id: 'VIEWS', label: 'Pantallas & Vistas (7)' },
    { id: 'ENGINES', label: 'Motores IA & Datos (6)' },
    { id: 'STORAGE', label: 'Almacenes & Cuotas ($0)' }
];

const APP_VIEWS_STATUS = [
    {
        id: 'V-HOME',
        name: 'Home • Escenario Espacial & Pulso',
        module: 'HomeStage.jsx',
        tools: 'Canvas 60 FPS • Navegación V010',
        latency: '12 ms',
        status: '100% Activa',
        pos: true
    },
    {
        id: 'V-MKT-1',
        name: 'Markets • Screener Global (Nivel 1)',
        module: 'MarketAnomaliesView.jsx',
        tools: '213 Activos • 10 Clases • Tabla / Orbital / Heatmap / Main Tools',
        latency: '28 ms',
        status: '100% Activa',
        pos: true
    },
    {
        id: 'V-MKT-2A',
        name: 'Markets • Analytics & Motores 3D/2D (Nivel 2A)',
        module: 'MarketAnomaliesView.jsx',
        tools: 'Técnico • Comparar % • Microestructura • Vol 3D / Soberanos / FX / Forward',
        latency: '34 ms',
        status: '100% Activa',
        pos: true
    },
    {
        id: 'V-MKT-2B',
        name: 'Markets • Research & Chat RAG (Nivel 2B)',
        module: 'MarketAnomaliesView.jsx',
        tools: 'Chat Vertical RAG • Acordeón 5 Bull vs 5 Bear • Timeline 24h + AreaChart',
        latency: '92 ms',
        status: '100% Activa',
        pos: true
    },
    {
        id: 'V-PORT-1',
        name: 'Portfolio • Constructor & Performance (Vista 1)',
        module: 'PortfolioVista1Builder.jsx',
        tools: '6 Píldoras • Tabla sin Sliders + ON/OFF • Radiografía (Alpha) + Calendario • Backtest 100%',
        latency: '19 ms',
        status: '100% Activa',
        pos: true
    },
    {
        id: 'V-PORT-2',
        name: 'Portfolio • Riesgo Cuantitativo & Stress (Vista 2)',
        module: 'PortfolioVista2Risk.jsx',
        tools: 'Grilla 2×2 (Markowitz Dinámico, Tornado/VaR, Correlación, Choque 2D/Markov) • Monte Carlo 100%',
        latency: '24 ms',
        status: '100% Activa',
        pos: true
    },
    {
        id: 'V-PORT-3',
        name: 'Portfolio • Laboratorio de Estrategias Ad-Hoc (Vista 3)',
        module: 'PortfolioVista3AdHoc.jsx',
        tools: 'Impacto Cartera Total • What-If & Kelly • Escudo Opciones & Margen • Comité 3 Pilares • Walk-Forward',
        latency: '22 ms',
        status: '100% Activa',
        pos: true
    }
];

const BACKEND_ENGINES_STATUS = [
    { id: 'P-01..03', name: 'Ingesta Multi-Activo & Feature Store', role: 'Precios, 42 curvas, 61 divisas, RSI y Z-Score', latency: '41 ms', quota: '18% Free-Tier', status: 'Online', pos: true },
    { id: 'P-06', name: 'Isolation Forest (Detector de Anomalías)', role: 'Score P-06 en Screener y corte automático ≥ 0.65', latency: '84 ms', quota: '32% Cloud Run', status: 'Online', pos: true },
    { id: 'P-08', name: 'FinBERT Sentiment Engine (10-K / FOMC / 24h)', role: 'Nota ponderada (-100 a +100) y 10 Factores en Research', latency: '108 ms', quota: '39% Cloud Run', status: 'Online', pos: true },
    { id: 'P-09', name: 'Buscador Documental RAG + Guardrail 3 Capas', role: 'Chat de Research y Copiloto 💬 de Portfolio', latency: '95 ms', quota: '26% Firestore', status: 'Online', pos: true },
    { id: 'P-11', name: 'Motor Cuantitativo (Markowitz, VaR, Monte Carlo)', role: '28 herramientas matemáticas en Portfolio V1, V2 y V3', latency: '27 ms', quota: '12% Local/Edge', status: 'Online', pos: true },
    { id: 'P-12', name: 'Persistencia & Sincronización (Watchlist / Cartera)', role: 'Sincroniza ★ Watchlist, pesos, órdenes, idioma y paleta', latency: '4 ms', quota: 'localStorage OK', status: 'Online', pos: true }
];

const STORAGE_QUOTAS = [
    { store: 'BigQuery Data Warehouse', used: '240 MB', limit: '10 GB / mes', cost: '$0.00', status: '+97.6% Libre', pos: true },
    { store: 'Cloud Storage (Parquet)', used: '1.1 GB', limit: '5 GB / mes', cost: '$0.00', status: '+78.0% Libre', pos: true },
    { store: 'Cloud Run (Microservicios IA)', used: '48k req', limit: '2M req / mes', cost: '$0.00', status: '+97.6% Libre', pos: true },
    { store: 'Browser Persistence (mid_*_v1)', used: '42 KB', limit: '5 MB local', cost: '$0.00', status: '+99.1% Libre', pos: true }
];

const LATENCY_SERIES = [
    { t: '00:00', latency: 48, uptime: 100 },
    { t: '03:00', latency: 45, uptime: 100 },
    { t: '06:00', latency: 51, uptime: 100 },
    { t: '09:00', latency: 68, uptime: 99.98 },
    { t: '12:00', latency: 59, uptime: 99.99 },
    { t: '15:00', latency: 72, uptime: 99.97 },
    { t: '18:00', latency: 54, uptime: 100 },
    { t: '21:00', latency: 49, uptime: 100 },
    { t: '24:00', latency: 46, uptime: 100 }
];

const thStyle = (idx, total) => ({
    textAlign: idx === 0 ? 'left' : idx === total - 1 ? 'right' : 'center',
    padding: '7px 8px',
    fontSize: '9px',
    fontWeight: 800,
    color: '#94a3b8',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(148,163,184,0.2)',
    textTransform: 'uppercase'
});

const tdStyle = (idx, total) => ({
    textAlign: idx === 0 ? 'left' : idx === total - 1 ? 'right' : 'center',
    padding: '7px 8px',
    fontSize: '10px',
    borderBottom: '1px solid rgba(148,163,184,0.1)'
});

const badgeStyle = (pos) => ({
    display: 'inline-block',
    padding: '2px 7px',
    borderRadius: '4px',
    fontWeight: 800,
    fontSize: '9.5px',
    background: pos ? 'rgba(16, 185, 129, 0.22)' : 'rgba(244, 63, 94, 0.22)',
    color: pos ? '#6ee7b7' : '#fda4af',
    border: `1px solid ${pos ? 'rgba(16,185,129,0.45)' : 'rgba(244,63,94,0.45)'}`
});

export default function SystemModelsLab({ activeModel = 'SYS-M1' }) {
    const [tab, setTab] = useState('ALL');
    const [metric, setMetric] = useState('latency');

    /* ── MENÚ CENTRADO V010 (SÓLO TÍTULOS, SIN NUMERACIÓN NI ICONOS) ── */
    const renderCenteredMenu = () => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                padding: '4px 12px',
                minHeight: '34px',
                flexWrap: 'wrap'
            }}
        >
            {SYSTEM_TABS.map(t => {
                const active = tab === t.id;
                return (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        style={{
                            padding: '5px 4px',
                            border: 'none',
                            borderBottom: active ? '2px solid #10b981' : '2px solid transparent',
                            background: 'transparent',
                            color: active ? '#6ee7b7' : 'rgba(148,163,184,0.72)',
                            textShadow: active ? '0 0 10px rgba(16,185,129,0.75)' : 'none',
                            fontSize: '11.5px',
                            fontWeight: active ? 800 : 600,
                            cursor: 'pointer'
                        }}
                    >
                        {t.label}
                    </button>
                );
            })}
        </div>
    );

    /* ── FILA 1: 5 PÍLDORAS EJECUTIVAS CLARAS ── */
    const renderTopPills = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '8px' }}>
            {[
                { label: 'ESTADO GENERAL', val: '100% Operativo', sub: 'Sin errores ni alertas activas' },
                { label: 'VISTAS CREADAS', val: '7 / 7 Activas', sub: 'Home • 3 Markets • 3 Portfolio' },
                { label: 'MOTORES IA & DATOS', val: '6 / 6 Online', sub: 'P-06 • FinBERT • RAG • Quant' },
                { label: 'RESPUESTA MEDIA', val: '48 ms', sub: 'Fluidez instantánea en UI y 3D' },
                { label: 'CUOTA CLOUD FREE-TIER', val: '$0.00 / mes', sub: '97% de margen libre en GCP' }
            ].map((p, idx) => (
                <div
                    key={idx}
                    style={{
                        background: 'rgba(15,23,42,0.92)',
                        border: '1px solid rgba(16,185,129,0.32)',
                        borderRadius: '9px',
                        padding: '8px 10px'
                    }}
                >
                    <div style={{ fontSize: '8px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em' }}>{p.label}</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#6ee7b7', marginTop: '2px' }}>{p.val}</div>
                    <div style={{ fontSize: '8.5px', color: '#cbd5e1', marginTop: '2px' }}>{p.sub}</div>
                </div>
            ))}
        </div>
    );

    /* ── FILA 3 (100% ANCHO): SERIE DE TIEMPO AREACHART DE LATENCIA Y ESTABILIDAD ── */
    const renderChartRow = () => (
        <div
            style={{
                background: 'rgba(15,23,42,0.92)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '10px',
                padding: '10px'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.05em' }}>
                    PULSO DE RENDIMIENTO DEL SISTEMA 24H (100% ANCHO • AREACHART CON SOMBRA DEGRADADA)
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {[
                        { id: 'latency', label: 'Tiempo de Respuesta (ms)' },
                        { id: 'uptime', label: 'Disponibilidad SLA (%)' }
                    ].map(opt => {
                        const active = metric === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => setMetric(opt.id)}
                                style={{
                                    padding: '3px 8px',
                                    fontSize: '9px',
                                    fontWeight: 800,
                                    borderRadius: '5px',
                                    border: active ? '1px solid #10b981' : '1px solid rgba(148,163,184,0.2)',
                                    background: active ? 'rgba(16,185,129,0.2)' : 'transparent',
                                    color: active ? '#6ee7b7' : '#94a3b8',
                                    cursor: 'pointer'
                                }}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={{ width: '100%', height: '160px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={LATENCY_SERIES} margin={{ top: 6, right: 12, left: -18, bottom: 0 }}>
                        <defs>
                            <linearGradient id="sysSimpleGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                        <XAxis dataKey="t" stroke="#64748b" fontSize={9} />
                        <YAxis stroke="#64748b" fontSize={9} />
                        <RechartsTooltip
                            contentStyle={{
                                background: '#090d16',
                                border: '1px solid rgba(16,185,129,0.4)',
                                borderRadius: '6px',
                                fontSize: '10px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey={metric}
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#sysSimpleGrad)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    /* ══════════════════════════════════════════════════════════════════════════
       MODELO 1: SYS-M1 (ESTRUCTURA 3 FILAS ESTILO VISTA 1 DE PORTFOLIO)
       [FILA 1: 5 Píldoras] → [FILA 2 Izq: Estado de las 7 Vistas Creadas | Der: Motores IA/Datos Arriba + Almacenes Free-Tier Abajo] → [FILA 3: Serie 100%]
       ══════════════════════════════════════════════════════════════════════════ */
    if (activeModel === 'SYS-M1') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {renderCenteredMenu()}
                {renderTopPills()}

                <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '10px' }}>
                    {/* IZQUIERDA: LAS 7 VISTAS CREADAS EN LA APLICACIÓN */}
                    <div
                        style={{
                            background: 'rgba(15,23,42,0.92)',
                            border: '1px solid rgba(148,163,184,0.2)',
                            borderRadius: '10px',
                            padding: '10px'
                        }}
                    >
                        <div style={{ fontSize: '10.5px', fontWeight: 900, color: '#f8fafc', marginBottom: '6px', letterSpacing: '0.05em' }}>
                            ESTADO DE LAS 7 PANTALLAS Y VISTAS DE LA APLICACIÓN
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Vista de la Aplicación', 'Componentes & Herramientas Clave', 'Respuesta', 'Estado'].map((h, i, a) => (
                                        <th key={h} style={thStyle(i, a.length)}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {APP_VIEWS_STATUS.map(v => (
                                    <tr key={v.id}>
                                        <td style={{ ...tdStyle(0, 4), fontWeight: 800, color: '#f8fafc' }}>{v.name}</td>
                                        <td style={{ ...tdStyle(1, 4), color: '#cbd5e1', fontSize: '9.5px' }}>{v.tools}</td>
                                        <td style={{ ...tdStyle(2, 4), color: '#6ee7b7', fontWeight: 700 }}>{v.latency}</td>
                                        <td style={tdStyle(3, 4)}>
                                            <span style={badgeStyle(v.pos)}>{v.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* DERECHA: MOTORES IA/DATOS ARRIBA + CUOTAS FREE-TIER ABAJO */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div
                            style={{
                                background: 'rgba(15,23,42,0.92)',
                                border: '1px solid rgba(148,163,184,0.2)',
                                borderRadius: '10px',
                                padding: '10px'
                            }}
                        >
                            <div style={{ fontSize: '10px', fontWeight: 900, color: '#f8fafc', marginBottom: '6px', letterSpacing: '0.05em' }}>
                                MOTORES DE INTELIGENCIA ARTIFICIAL, DATOS Y CÁLCULO
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {['Motor / Servicio', 'Función en las Vistas', 'Latencia', 'Estado'].map((h, i, a) => (
                                            <th key={h} style={thStyle(i, a.length)}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {BACKEND_ENGINES_STATUS.map(e => (
                                        <tr key={e.id}>
                                            <td style={{ ...tdStyle(0, 4), fontWeight: 800, color: '#f8fafc' }}>{e.name}</td>
                                            <td style={{ ...tdStyle(1, 4), color: '#cbd5e1', fontSize: '9px' }}>{e.role}</td>
                                            <td style={{ ...tdStyle(2, 4), color: '#6ee7b7', fontWeight: 700 }}>{e.latency}</td>
                                            <td style={tdStyle(3, 4)}>
                                                <span style={badgeStyle(e.pos)}>{e.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div
                            style={{
                                background: 'rgba(15,23,42,0.92)',
                                border: '1px solid rgba(148,163,184,0.2)',
                                borderRadius: '10px',
                                padding: '10px'
                            }}
                        >
                            <div style={{ fontSize: '10px', fontWeight: 900, color: '#f8fafc', marginBottom: '6px', letterSpacing: '0.05em' }}>
                                ALMACENES DE DATOS Y CUOTAS FREE-TIER (COSTO $0.00)
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {['Almacén / Recurso', 'Uso Actual', 'Límite Gratuito', 'Margen'].map((h, i, a) => (
                                            <th key={h} style={thStyle(i, a.length)}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {STORAGE_QUOTAS.map(s => (
                                        <tr key={s.store}>
                                            <td style={{ ...tdStyle(0, 4), fontWeight: 800, color: '#f8fafc' }}>{s.store}</td>
                                            <td style={{ ...tdStyle(1, 4), color: '#cbd5e1' }}>{s.used}</td>
                                            <td style={{ ...tdStyle(2, 4), color: '#94a3b8' }}>{s.limit}</td>
                                            <td style={tdStyle(3, 4)}>
                                                <span style={badgeStyle(s.pos)}>{s.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {renderChartRow()}
            </div>
        );
    }

    /* ══════════════════════════════════════════════════════════════════════════
       MODELO 2: SYS-M2 (GRILLA 2×2 SIMÉTRICA ESTILO VISTA 2/3 DE PORTFOLIO)
       [Cuadrante 1: Vistas de Markets | Cuadrante 2: Las 3 Vistas de Portfolio | Cuadrante 3: Motores IA/Quant | Cuadrante 4: Almacenes & Cuotas] + Serie 100%
       ══════════════════════════════════════════════════════════════════════════ */
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {renderCenteredMenu()}
            {renderTopPills()}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {/* CUADRANTE 1: HOME & MARKETS (3 VISTAS) */}
                <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '10px', padding: '10px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 900, color: '#f8fafc', marginBottom: '6px' }}>
                        1. PANTALLAS DE HOME & MARKETS (SCREENER, ANALYTICS, RESEARCH)
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Vista', 'Alcance', 'Latencia', 'Estado'].map((h, i, a) => (
                                    <th key={h} style={thStyle(i, a.length)}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {APP_VIEWS_STATUS.slice(0, 4).map(v => (
                                <tr key={v.id}>
                                    <td style={{ ...tdStyle(0, 4), fontWeight: 800, color: '#f8fafc' }}>{v.name}</td>
                                    <td style={{ ...tdStyle(1, 4), color: '#cbd5e1', fontSize: '9px' }}>{v.tools}</td>
                                    <td style={{ ...tdStyle(2, 4), color: '#6ee7b7', fontWeight: 700 }}>{v.latency}</td>
                                    <td style={tdStyle(3, 4)}><span style={badgeStyle(true)}>{v.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* CUADRANTE 2: LAS 3 VISTAS DE PORTFOLIO */}
                <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '10px', padding: '10px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 900, color: '#f8fafc', marginBottom: '6px' }}>
                        2. LAS 3 VISTAS MODULARES DE PORTFOLIO & COPILOTO RAG
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Vista de Portfolio', 'Herramientas Activas', 'Latencia', 'Estado'].map((h, i, a) => (
                                    <th key={h} style={thStyle(i, a.length)}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {APP_VIEWS_STATUS.slice(4).map(v => (
                                <tr key={v.id}>
                                    <td style={{ ...tdStyle(0, 4), fontWeight: 800, color: '#f8fafc' }}>{v.name}</td>
                                    <td style={{ ...tdStyle(1, 4), color: '#cbd5e1', fontSize: '9px' }}>{v.tools}</td>
                                    <td style={{ ...tdStyle(2, 4), color: '#6ee7b7', fontWeight: 700 }}>{v.latency}</td>
                                    <td style={tdStyle(3, 4)}><span style={badgeStyle(true)}>{v.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* CUADRANTE 3: MOTORES IA & BACKEND */}
                <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '10px', padding: '10px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 900, color: '#f8fafc', marginBottom: '6px' }}>
                        3. MOTORES DE IA, ANOMALÍAS (P-06), NLP Y RIESGO QUANT
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Motor', 'Rol Operativo', 'Latencia', 'Estado'].map((h, i, a) => (
                                    <th key={h} style={thStyle(i, a.length)}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {BACKEND_ENGINES_STATUS.slice(0, 4).map(e => (
                                <tr key={e.id}>
                                    <td style={{ ...tdStyle(0, 4), fontWeight: 800, color: '#f8fafc' }}>{e.name}</td>
                                    <td style={{ ...tdStyle(1, 4), color: '#cbd5e1', fontSize: '9px' }}>{e.role}</td>
                                    <td style={{ ...tdStyle(2, 4), color: '#6ee7b7', fontWeight: 700 }}>{e.latency}</td>
                                    <td style={tdStyle(3, 4)}><span style={badgeStyle(true)}>{e.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* CUADRANTE 4: ALMACENES Y CUOTAS FREE-TIER */}
                <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '10px', padding: '10px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 900, color: '#f8fafc', marginBottom: '6px' }}>
                        4. ALMACENES DE DATOS Y CUOTAS GRATUITAS ($0.00 / MES)
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Almacén', 'Uso', 'Tope Gratis', 'Margen'].map((h, i, a) => (
                                    <th key={h} style={thStyle(i, a.length)}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {STORAGE_QUOTAS.map(s => (
                                <tr key={s.store}>
                                    <td style={{ ...tdStyle(0, 4), fontWeight: 800, color: '#f8fafc' }}>{s.store}</td>
                                    <td style={{ ...tdStyle(1, 4), color: '#cbd5e1' }}>{s.used}</td>
                                    <td style={{ ...tdStyle(2, 4), color: '#94a3b8' }}>{s.limit}</td>
                                    <td style={tdStyle(3, 4)}><span style={badgeStyle(true)}>{s.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {renderChartRow()}
        </div>
    );
}
