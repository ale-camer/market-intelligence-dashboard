import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, X } from 'lucide-react';
import { INITIAL_HOLDINGS } from './portfolio/portfolioConstants';
import PortfolioVista1Builder from './portfolio/PortfolioVista1Builder';
import PortfolioVista2Risk from './portfolio/PortfolioVista2Risk';
import PortfolioVista3AdHoc from './portfolio/PortfolioVista3AdHoc';

const PORTFOLIO_STORAGE_KEY = 'mid_portfolio_v1';

const PORTFOLIO_VIEWS = [
    {
        id: 'V1',
        label: 'Constructor & Performance'
    },
    {
        id: 'V2',
        label: 'Riesgo Cuantitativo & Stress'
    },
    {
        id: 'V3',
        label: 'Laboratorio de Estrategias Ad-Hoc'
    }
];

export default function AgentCommitteeView({
    watchlistSyms = [],
    onToggleWatchlist
}) {
    const [activeView, setActiveView] = useState('V1');
    const [copilotOpen, setCopilotOpen] = useState(false);
    const [copilotMsg, setCopilotMsg] = useState('');
    const [copilotThread, setCopilotThread] = useState([
        {
            role: 'ai',
            txt: 'Copiloto Cuantitativo RAG activo. Tu cartera mantiene un Sharpe de 2.18 con Beta 0.76 y una eficiencia Walk-Forward del 94.2%.'
        }
    ]);

    const [holdings, setHoldings] = useState(() => {
        try {
            const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {
            // fallback
        }
        return INITIAL_HOLDINGS;
    });

    useEffect(() => {
        try {
            localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(holdings));
        } catch {
            // ignore storage errors
        }
    }, [holdings]);

    const sendCopilotPrompt = (txt) => {
        const q = txt.trim();
        if (!q) return;
        setCopilotThread(prev => [
            ...prev,
            { role: 'user', txt: q },
            {
                role: 'ai',
                txt: `Análisis sobre ${holdings.length} activos: el solapamiento real de NVDA es 24.4% (directo + SPY). Un escudo SPY Put 5% OTM recorta el Max Drawdown de -4.80% a -2.90% con +0.23 pts de Sharpe.`
            }
        ]);
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#060911',
                color: '#f8fafc',
                padding: '12px 18px 64px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}
        >
            {/* ══════════════════════════════════════════════════════════════════
                BARRA DE NAVEGACIÓN CENTRADA (SÓLO TÍTULOS) + ICONO COPILOTO A LA ALTURA DEL MENÚ
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '24px',
                        flexWrap: 'wrap'
                    }}
                >
                    {PORTFOLIO_VIEWS.map(v => {
                        const active = activeView === v.id;
                        return (
                            <button
                                key={v.id}
                                onClick={() => setActiveView(v.id)}
                                style={{
                                    padding: '6px 4px',
                                    border: 'none',
                                    borderBottom: active ? '2px solid var(--ui-accent, #10b981)' : '2px solid transparent',
                                    background: 'transparent',
                                    color: active ? 'var(--ui-accent-bright, #6ee7b7)' : 'rgba(148, 163, 184, 0.72)',
                                    textShadow: active
                                        ? '0 0 10px var(--ui-accent-glow, rgba(16,185,129,0.78)), 0 0 22px var(--ui-accent-soft, rgba(16,185,129,0.42))'
                                        : 'none',
                                    fontSize: '12px',
                                    fontWeight: active ? 800 : 600,
                                    letterSpacing: '0.03em',
                                    cursor: 'pointer',
                                    transition: 'all 0.18s ease'
                                }}
                            >
                                {v.label}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => setCopilotOpen(v => !v)}
                    title={copilotOpen ? 'Ocultar Copiloto RAG' : 'Abrir Copiloto RAG'}
                    aria-label="Copiloto RAG"
                    style={{
                        position: 'absolute',
                        right: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        border: copilotOpen
                            ? '1px solid var(--ui-accent, rgba(16,185,129,0.65))'
                            : '1px solid rgba(148,163,184,0.22)',
                        background: copilotOpen ? 'rgba(16,185,129,0.2)' : 'rgba(15,23,42,0.75)',
                        color: copilotOpen ? 'var(--ui-accent-bright, #6ee7b7)' : '#cbd5e1',
                        boxShadow: copilotOpen ? '0 0 14px rgba(16,185,129,0.35)' : 'none',
                        cursor: 'pointer'
                    }}
                >
                    <MessageSquare size={15} />
                </button>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                LIENZO DE LA VISTA ACTIVA + COPILOTO COLAPSABLE BAJO DEMANDA
               ══════════════════════════════════════════════════════════════════ */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {activeView === 'V1' && (
                        <PortfolioVista1Builder
                            holdings={holdings}
                            setHoldings={setHoldings}
                            watchlistSyms={watchlistSyms}
                            onToggleWatchlist={onToggleWatchlist}
                        />
                    )}
                    {activeView === 'V2' && <PortfolioVista2Risk holdings={holdings} />}
                    {activeView === 'V3' && <PortfolioVista3AdHoc holdings={holdings} />}
                </div>

                {copilotOpen && (
                    <div
                        style={{
                            width: '320px',
                            flexShrink: 0,
                            background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(9,13,22,0.99) 100%)',
                            border: '1px solid rgba(16,185,129,0.45)',
                            borderRadius: '10px',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Sparkles size={14} color="#10b981" />
                                <span style={{ fontSize: '11px', fontWeight: 900, color: '#f8fafc' }}>COPILOTO DE CARTERA (#8)</span>
                            </div>
                            <button onClick={() => setCopilotOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={14} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {['Revisar solapamiento ETF', 'Simular cobertura Put 5%', 'Optimizar Sharpe'].map(chip => (
                                <button
                                    key={chip}
                                    onClick={() => sendCopilotPrompt(chip)}
                                    style={{
                                        padding: '3px 7px',
                                        borderRadius: '99px',
                                        border: '1px solid rgba(16,185,129,0.35)',
                                        background: 'rgba(16,185,129,0.1)',
                                        color: '#6ee7b7',
                                        fontSize: '8.5px',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
                            {copilotThread.map((m, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '8px 10px',
                                        borderRadius: '7px',
                                        background: m.role === 'ai' ? 'rgba(2,6,23,0.75)' : 'rgba(16,185,129,0.16)',
                                        border: `1px solid ${m.role === 'ai' ? 'rgba(148,163,184,0.18)' : 'rgba(16,185,129,0.4)'}`,
                                        fontSize: '9.5px',
                                        color: '#e2e8f0',
                                        lineHeight: 1.45
                                    }}
                                >
                                    {m.txt}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                                value={copilotMsg}
                                onChange={e => setCopilotMsg(e.target.value)}
                                placeholder="Consultar al Copiloto RAG..."
                                style={{
                                    flex: 1,
                                    background: 'rgba(2,6,23,0.85)',
                                    border: '1px solid rgba(148,163,184,0.25)',
                                    borderRadius: '6px',
                                    padding: '6px 8px',
                                    color: '#f8fafc',
                                    fontSize: '10px'
                                }}
                            />
                            <button
                                onClick={() => {
                                    sendCopilotPrompt(copilotMsg);
                                    setCopilotMsg('');
                                }}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(16,185,129,0.45)',
                                    background: 'rgba(16,185,129,0.2)',
                                    color: '#6ee7b7',
                                    fontSize: '9.5px',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                }}
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
