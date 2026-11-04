import React, { useState } from 'react';

const SAMPLE_ROWS = [
    { sym: 'NVDA', name: 'NVIDIA Corp.', cat: 'Acciones', price: '$138.60', chg: '+4.20%', vol: '$42.8B', rsi: '64.2', pos: true, sel: true },
    { sym: 'SPY', name: 'SPDR S&P 500 ETF', cat: 'ETFs', price: '$584.20', chg: '+0.85%', vol: '$28.4B', rsi: '56.8', pos: true, sel: false },
    { sym: 'BTC-USD', name: 'Bitcoin Spot', cat: 'Crypto', price: '$89,420', chg: '+5.40%', vol: '$36.1B', rsi: '68.5', pos: true, sel: false },
    { sym: 'TLT', name: 'iShares 20+ Yr Treasury', cat: 'Bonos', price: '$92.40', chg: '-0.62%', vol: '$8.9B', rsi: '43.1', pos: false, sel: false },
    { sym: 'GLD', name: 'SPDR Gold Trust', cat: 'Materias Primas', price: '$248.10', chg: '+1.15%', vol: '$6.2B', rsi: '58.4', pos: true, sel: false }
];

export default function DesignAlignmentLab() {
    const [selRowOpt1, setSelRowOpt1] = useState('NVDA');
    const [selFilterOpt1, setSelFilterOpt1] = useState('Todos');
    const [selRowOpt2, setSelRowOpt2] = useState('NVDA');
    const [selFilterOpt2, setSelFilterOpt2] = useState('Todos');

    return (
        <div
            style={{
                maxWidth: '1400px',
                width: '100%',
                margin: '0 auto',
                padding: '4px 0 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                color: '#f8fafc',
                background: 'transparent'
            }}
        >
            {/* ENCABEZADO EXPLICATIVO BREVE */}
            <div
                style={{
                    background: 'transparent',
                    border: '1px solid rgba(148, 163, 184, 0.22)',
                    borderRadius: '10px',
                    padding: '12px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}
            >
                <div>
                    <div style={{ fontSize: '15.5px', fontWeight: 700, color: '#ffffff' }}>
                        Comparativa Unificada en una Sola Vista (Las 3 Partes Juntas: Tarjetas + Selectores + Tabla)
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
                        A la izquierda ves las 3 cosas con el nuevo diseño limpio de Portfolio y System; a la derecha ves cómo están hoy en Markets → Screener.
                    </div>
                </div>
            </div>

            {/* COMPARATIVA LADO A LADO CON LAS 3 COSAS INTEGRADAS EN UNA SOLA VISUALIZACIÓN */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', alignItems: 'stretch' }}>
                {/* ══════════════════════════════════════════════════════════════════
                    OPCIÓN 1: UNIFICADO AL NUEVO DISEÑO DE LA APP
                   ══════════════════════════════════════════════════════════════════ */}
                <div
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(148, 163, 184, 0.24)',
                        borderRadius: '10px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px'
                    }}
                >
                    <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.14)', paddingBottom: '10px' }}>
                        <div
                            style={{
                                fontSize: '11.5px',
                                fontWeight: 800,
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--ui-accent, #10b981)',
                                marginBottom: '3px'
                            }}
                        >
                            OPCIÓN 1 • ✓ EN PRODUCCIÓN EN TODA LA APP
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                            Tarjetas KPI con Barra 3px + Selectores en Texto Flotante + Tabla Plana sin Círculos
                        </div>
                    </div>

                    {/* PARTE A: TARJETAS SUPERIORES (FORMATO KPI PASO 6 OPCIÓN 2) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                            A. TARJETAS SUPERIORES (FORMATO KPI LIMPIO CON BARRA IZQUIERDA 3PX)
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '8px' }}>
                            {[
                                { lbl: 'VOLUMEN 24H', val: '$549.4B', sub: '+16.5% vs media 20d', col: '#10b981' },
                                { lbl: 'RSI PROMEDIO', val: '54.2', sub: 'Impulso comprador', col: '#10b981' },
                                { lbl: 'RÉGIMEN NORMAL', val: '93%', sub: 'Mayor desvío: GLD', col: '#10b981' },
                                { lbl: 'DESVÍO VOLUMEN', val: '+2.8σ', sub: 'Líder hoy: NVDA', col: '#10b981' }
                            ].map(p => (
                                <div
                                    key={p.lbl}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(148, 163, 184, 0.22)',
                                        borderLeft: `3px solid ${p.col}`,
                                        borderRadius: '10px',
                                        padding: '9px 11px'
                                    }}
                                >
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>{p.lbl}</div>
                                    <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: p.col, marginTop: '2px' }}>
                                        {p.val}
                                    </div>
                                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>{p.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PARTE B: SELECTORES INTERNOS (TEXTO FLOTANTE V010 GHOST SIN RECUADROS) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                            B. SELECTORES Y PARÁMETROS INTERNOS (TEXTO FLOTANTE CON BRILLO SIN CAJAS)
                        </span>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(148, 163, 184, 0.16)',
                                background: 'transparent'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>FILTRO:</span>
                                {['Todos', 'Watchlist', 'Acciones', 'Crypto', 'Bonos'].map(f => {
                                    const active = selFilterOpt1 === f;
                                    return (
                                        <button
                                            key={f}
                                            onClick={() => setSelFilterOpt1(f)}
                                            style={{
                                                padding: '2px 3px',
                                                border: 'none',
                                                background: 'transparent',
                                                color: active ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                                textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                                fontSize: '12px',
                                                fontWeight: active ? 800 : 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {f}
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b' }}>% NAV:</span>
                                {['5%', '10%', '14.2%', '20%'].map((w, i) => (
                                    <span
                                        key={w}
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'var(--font-mono)',
                                            fontWeight: i === 2 ? 800 : 600,
                                            color: i === 2 ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.68)',
                                            textShadow: i === 2 ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none'
                                        }}
                                    >
                                        {w}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PARTE C: FILAS DE LA TABLA (PLANAS TRANSPARENTES CON LÍNEA 1PX, SIN AVATAR CIRCULAR) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                            C. FILAS DE LA TABLA (PLANAS TRANSPARENTES CON LÍNEA 1PX • SIN CÍRCULO DE INICIALES)
                        </span>
                        <div
                            style={{
                                border: '1px solid rgba(148, 163, 184, 0.22)',
                                borderRadius: '10px',
                                padding: '10px 12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                flex: 1
                            }}
                        >
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1.5fr 0.9fr 0.9fr 0.8fr 0.7fr',
                                    padding: '4px 8px 6px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    color: '#64748b',
                                    borderBottom: '1px solid rgba(148, 163, 184, 0.14)'
                                }}
                            >
                                <span>ACTIVO</span>
                                <span style={{ textAlign: 'right' }}>PRECIO</span>
                                <span style={{ textAlign: 'right' }}>CAMBIO 24H</span>
                                <span style={{ textAlign: 'right' }}>VOLUMEN</span>
                                <span style={{ textAlign: 'right' }}>RSI 14</span>
                            </div>

                            {SAMPLE_ROWS.map(r => {
                                const isSel = selRowOpt1 === r.sym;
                                return (
                                    <div
                                        key={r.sym}
                                        onClick={() => setSelRowOpt1(r.sym)}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1.5fr 0.9fr 0.9fr 0.8fr 0.7fr',
                                            alignItems: 'center',
                                            padding: '9px 8px',
                                            borderRadius: isSel ? '7px' : '0px',
                                            background: isSel ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.14)' : 'transparent',
                                            border: isSel ? '1px solid var(--ui-accent, #10b981)' : '1px solid transparent',
                                            borderBottom: isSel
                                                ? '1px solid var(--ui-accent, #10b981)'
                                                : '1px solid rgba(148, 163, 184, 0.10)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div>
                                            <span style={{ fontSize: '13.5px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff', marginRight: '8px' }}>
                                                {r.sym}
                                            </span>
                                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{r.name}</span>
                                        </div>
                                        <span style={{ textAlign: 'right', fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#f8fafc', fontWeight: 700 }}>
                                            {r.price}
                                        </span>
                                        <span
                                            style={{
                                                textAlign: 'right',
                                                fontSize: '13px',
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 800,
                                                color: r.pos ? '#10b981' : '#f43f5e'
                                            }}
                                        >
                                            {r.chg}
                                        </span>
                                        <span style={{ textAlign: 'right', fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
                                            {r.vol}
                                        </span>
                                        <span style={{ textAlign: 'right', fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: '#6ee7b7', fontWeight: 700 }}>
                                            {r.rsi}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════════
                    OPCIÓN 2: CÓMO ESTÁ ACTUALMENTE EN SCREENER Y SUB-BARRAS
                   ══════════════════════════════════════════════════════════════════ */}
                <div
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(148, 163, 184, 0.24)',
                        borderRadius: '10px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px'
                    }}
                >
                    <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.14)', paddingBottom: '10px' }}>
                        <div
                            style={{
                                fontSize: '11.5px',
                                fontWeight: 800,
                                fontFamily: 'var(--font-mono)',
                                color: '#94a3b8',
                                marginBottom: '3px'
                            }}
                        >
                            OPCIÓN 2 • DISEÑO ACTUAL EN SCREENER Y SUB-BARRAS
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                            Tarjetas con Velocímetro/Lista + Selectores con Borde + Filas en Cápsula con Círculo
                        </div>
                    </div>

                    {/* PARTE A: TARJETAS SUPERIORES CON VELOCÍMETRO Y MINI-LISTA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                            A. TARJETAS SUPERIORES (CON VELOCÍMETRO CIRCULAR, BARRA Y MINI-LISTA)
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '8px' }}>
                            <div
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(148, 163, 184, 0.22)',
                                    borderRadius: '10px',
                                    padding: '9px 11px'
                                }}
                            >
                                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8' }}>VOLUMEN 24H</div>
                                <div style={{ fontSize: '17px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#f8fafc', marginTop: '3px' }}>
                                    $549.4B
                                </div>
                                <div style={{ fontSize: '10.5px', color: '#10b981', marginTop: '2px', fontWeight: 700 }}>+16.5% vs 20d</div>
                            </div>

                            <div
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(148, 163, 184, 0.22)',
                                    borderRadius: '10px',
                                    padding: '9px 11px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8' }}>AVG RSI (14)</div>
                                    <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>Alcista</div>
                                </div>
                                <div
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        border: '3px solid #10b981',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '12px',
                                        fontWeight: 800
                                    }}
                                >
                                    54
                                </div>
                            </div>

                            <div
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(148, 163, 184, 0.22)',
                                    borderRadius: '10px',
                                    padding: '9px 11px'
                                }}
                            >
                                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8' }}>RÉGIMEN P-06</div>
                                <div style={{ fontSize: '15px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#10b981', marginTop: '2px' }}>
                                    93% Normal
                                </div>
                                <div style={{ height: '5px', background: 'rgba(148,163,184,0.2)', borderRadius: '99px', marginTop: '5px', overflow: 'hidden' }}>
                                    <div style={{ width: '93%', height: '100%', background: '#10b981' }} />
                                </div>
                            </div>

                            <div
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(148, 163, 184, 0.22)',
                                    borderRadius: '10px',
                                    padding: '9px 11px'
                                }}
                            >
                                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '3px' }}>TOP DESVÍO 20D</div>
                                <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>1. NVDA +2.8σ</div>
                                <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>2. BTC +2.1σ</div>
                            </div>
                        </div>
                    </div>

                    {/* PARTE B: SELECTORES INTERNOS CON CAJAS Y BORDE */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                            B. SELECTORES Y PARÁMETROS INTERNOS (BOTONES CON RECUADRO Y BORDE FINO)
                        </span>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(148, 163, 184, 0.16)',
                                background: 'transparent'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', marginRight: '3px' }}>FILTRO:</span>
                                {['Todos', 'Watchlist', 'Acciones', 'Crypto', 'Bonos'].map(f => {
                                    const active = selFilterOpt2 === f;
                                    return (
                                        <button
                                            key={f}
                                            onClick={() => setSelFilterOpt2(f)}
                                            style={{
                                                padding: '2px 7px',
                                                borderRadius: '4px',
                                                border: active ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.22)',
                                                background: active ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                                                color: active ? '#6ee7b7' : '#94a3b8',
                                                fontSize: '11.5px',
                                                fontWeight: 700,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {f}
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', marginRight: '2px' }}>% NAV:</span>
                                {['5%', '10%', '14.2%', '20%'].map((w, i) => (
                                    <span
                                        key={w}
                                        style={{
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            border: i === 2 ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.22)',
                                            background: i === 2 ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                                            fontSize: '11.5px',
                                            fontFamily: 'var(--font-mono)',
                                            fontWeight: 800,
                                            color: i === 2 ? '#6ee7b7' : '#cbd5e1'
                                        }}
                                    >
                                        {w}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PARTE C: FILAS EN CÁPSULA INDIVIDUAL CON AVATAR CIRCULAR */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                            C. FILAS DE LA TABLA (CÁPSULAS INDIVIDUALES CON CÍRCULO DE INICIALES)
                        </span>
                        <div
                            style={{
                                border: '1px solid rgba(148, 163, 184, 0.22)',
                                borderRadius: '10px',
                                padding: '10px 12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                flex: 1
                            }}
                        >
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1.5fr 0.9fr 0.9fr 0.8fr 0.7fr',
                                    padding: '2px 8px 4px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    color: '#64748b'
                                }}
                            >
                                <span>ACTIVO</span>
                                <span style={{ textAlign: 'right' }}>PRECIO</span>
                                <span style={{ textAlign: 'right' }}>CAMBIO 24H</span>
                                <span style={{ textAlign: 'right' }}>VOLUMEN</span>
                                <span style={{ textAlign: 'right' }}>RSI 14</span>
                            </div>

                            {SAMPLE_ROWS.map(r => {
                                const isSel = selRowOpt2 === r.sym;
                                return (
                                    <div
                                        key={r.sym}
                                        onClick={() => setSelRowOpt2(r.sym)}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1.5fr 0.9fr 0.9fr 0.8fr 0.7fr',
                                            alignItems: 'center',
                                            padding: '7px 10px',
                                            borderRadius: '10px',
                                            background: isSel ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.45)',
                                            border: isSel ? '1px solid #10b981' : '1px solid rgba(30, 41, 59, 0.75)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    border: `1px solid ${r.pos ? '#10b981' : '#f43f5e'}`,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '9.5px',
                                                    fontWeight: 800,
                                                    color: r.pos ? '#10b981' : '#f43f5e',
                                                    flexShrink: 0
                                                }}
                                            >
                                                {r.sym.slice(0, 2)}
                                            </span>
                                            <div>
                                                <div style={{ fontSize: '12.5px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                                                    {r.sym}
                                                </div>
                                                <div style={{ fontSize: '10.5px', color: '#64748b' }}>{r.name}</div>
                                            </div>
                                        </div>
                                        <span style={{ textAlign: 'right', fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#f8fafc', fontWeight: 700 }}>
                                            {r.price}
                                        </span>
                                        <span
                                            style={{
                                                textAlign: 'right',
                                                fontSize: '13px',
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 800,
                                                color: r.pos ? '#10b981' : '#f43f5e'
                                            }}
                                        >
                                            {r.chg}
                                        </span>
                                        <span style={{ textAlign: 'right', fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
                                            {r.vol}
                                        </span>
                                        <span style={{ textAlign: 'right', fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: '#6ee7b7', fontWeight: 700 }}>
                                            {r.rsi}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
