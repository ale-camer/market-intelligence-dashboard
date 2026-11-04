import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { INITIAL_HOLDINGS } from './portfolio/portfolioConstants';
import PortfolioVista1Builder from './portfolio/PortfolioVista1Builder';
import PortfolioVista2Risk from './portfolio/PortfolioVista2Risk';
import PortfolioVista3AdHoc from './portfolio/PortfolioVista3AdHoc';

const PORTFOLIO_STORAGE_KEY = 'mid_portfolio_v1';

export default function AgentCommitteeView({
    watchlistSyms = [],
    onToggleWatchlist,
    langCode = 'EN'
}) {
    const isES = langCode === 'ES';
    const [activeView, setActiveView] = useState('V1');
    const [copilotOpen, setCopilotOpen] = useState(false);
    const [copilotMsg, setCopilotMsg] = useState('');
    const [copilotThread, setCopilotThread] = useState([]);

    const portfolioViews = [
        {
            id: 'V1',
            label: isES ? 'Constructor' : 'Builder'
        },
        {
            id: 'V2',
            label: isES ? 'Riesgo' : 'Risk'
        },
        {
            id: 'V3',
            label: isES ? 'Simulador' : 'Simulator'
        }
    ];

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
                txt: isES
                    ? `Análisis sobre ${holdings.length} activos: el solapamiento real de NVDA es 24.4% (directo + SPY). Un escudo SPY Put 5% OTM recorta el Max Drawdown de -4.80% a -2.90% con +0.23 pts de Sharpe.`
                    : `Analysis across ${holdings.length} holdings: true NVDA overlap is 24.4% (direct + SPY). A 5% OTM SPY Put hedge trims Max Drawdown from -4.80% to -2.90% with +0.23 Sharpe pts.`
            }
        ]);
    };

    const initialGreeting = isES
        ? 'Copiloto activo. Tu cartera mantiene un Sharpe de 2.18 con Beta 0.76 y una eficiencia histórica del 94.2%.'
        : 'Copilot active. Your portfolio maintains a 2.18 Sharpe with 0.76 Beta and 94.2% walk-forward efficiency.';
    const displayedThread = [{ role: 'ai', txt: initialGreeting }, ...copilotThread];
    const quickChips = isES
        ? ['Revisar solapamiento', 'Simular cobertura', 'Optimizar Sharpe']
        : ['Check ETF overlap', 'Simulate Put hedge', 'Optimize Sharpe'];

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'transparent',
                color: '#f8fafc',
                padding: '12px 18px 64px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}
        >
            {/* ══════════════════════════════════════════════════════════════════
                ENCABEZADO V010 GHOST (TEXTO FLOTANTE CON BRILLO SIN SUBRAYADO NI CAJA)
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
                        gap: '1.65rem',
                        flexWrap: 'wrap'
                    }}
                >
                    {portfolioViews.map(v => {
                        const active = activeView === v.id;
                        return (
                            <button
                                key={v.id}
                                onClick={() => setActiveView(v.id)}
                                style={{
                                    padding: '0.18rem 0.25rem',
                                    border: 'none',
                                    background: 'transparent',
                                    color: active ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.62)',
                                    textShadow: active
                                        ? '0 0 15px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.88)'
                                        : 'none',
                                    fontSize: '15px',
                                    fontWeight: active ? 800 : 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.16s ease'
                                }}
                            >
                                {v.label}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => setCopilotOpen(v => !v)}
                    aria-label={isES ? 'Copiloto' : 'Copilot'}
                    style={{
                        position: 'absolute',
                        right: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.18rem 0.35rem',
                        border: 'none',
                        background: 'transparent',
                        color: copilotOpen ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.72)',
                        textShadow: copilotOpen
                            ? '0 0 15px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.88)'
                            : 'none',
                        fontSize: '13px',
                        fontWeight: copilotOpen ? 800 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.16s ease'
                    }}
                >
                    <span>{isES ? 'Copiloto' : 'Copilot'}</span>
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
                            langCode={langCode}
                        />
                    )}
                    {activeView === 'V2' && <PortfolioVista2Risk holdings={holdings} langCode={langCode} />}
                    {activeView === 'V3' && <PortfolioVista3AdHoc holdings={holdings} langCode={langCode} />}
                </div>

                {copilotOpen && (
                    <div
                        style={{
                            width: '320px',
                            flexShrink: 0,
                            background: 'transparent',
                            border: '1px solid rgba(148, 163, 184, 0.22)',
                            borderRadius: '10px',
                            padding: '14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingBottom: '8px',
                                borderBottom: '1px solid rgba(148, 163, 184, 0.14)'
                            }}
                        >
                            <span style={{ fontSize: '15.5px', fontWeight: 700, color: '#ffffff' }}>
                                {isES ? 'Copiloto de Cartera' : 'Portfolio Copilot'}
                            </span>
                            <button onClick={() => setCopilotOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={14} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {quickChips.map(chip => (
                                <button
                                    key={chip}
                                    onClick={() => sendCopilotPrompt(chip)}
                                    style={{
                                        padding: '4px 9px',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(148, 163, 184, 0.22)',
                                        background: 'transparent',
                                        color: 'var(--ui-accent, #10b981)',
                                        fontSize: '11.5px',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
                            {displayedThread.map((m, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '8px 10px',
                                        borderRadius: '7px',
                                        background: m.role === 'ai' ? 'transparent' : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.14)',
                                        border: `1px solid ${m.role === 'ai' ? 'rgba(148,163,184,0.18)' : 'var(--ui-accent, #10b981)'}`,
                                        fontSize: '12.5px',
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
                                placeholder={isES ? 'Consultar sobre la cartera...' : 'Ask about your portfolio...'}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: '1px solid rgba(148,163,184,0.25)',
                                    borderRadius: '6px',
                                    padding: '6px 8px',
                                    color: '#f8fafc',
                                    fontSize: '12px'
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
                                    border: '1px solid var(--ui-accent, #10b981)',
                                    background: 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.16)',
                                    color: 'var(--ui-accent, #10b981)',
                                    fontSize: '12px',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                }}
                            >
                                {isES ? 'Enviar' : 'Send'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
