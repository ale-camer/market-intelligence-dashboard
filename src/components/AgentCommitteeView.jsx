import { tx, txList, txTpl, useViewLocale } from '../data/i18n/viewLocaleService';
import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { INITIAL_HOLDINGS } from './portfolio/portfolioConstants';
import { syncLiveMarketSnapshot } from '../services/marketService';
import { computeLivePortfolioMetrics, generateCopilotPortfolioResponse } from '../services/committeeService';
import PortfolioVista1Builder from './portfolio/PortfolioVista1Builder';
import PortfolioVista2Risk from './portfolio/PortfolioVista2Risk';
import PortfolioVista3AdHoc from './portfolio/PortfolioVista3AdHoc';

const PORTFOLIO_STORAGE_KEY = 'mid_portfolio_v1';

export default function AgentCommitteeView({
    onOpenAssetInMarkets,
    watchlistSyms = [],
    onToggleWatchlist,
    langCode = 'EN'
}) {
    const { localeTick } = useViewLocale(langCode);
    const isES = `${langCode}_${localeTick}`;
    const [activeView, setActiveView] = useState(() => {
        const sub = (new URLSearchParams(window.location.search).get('sub') || '').toLowerCase();
        if (sub === 'risk' || sub === 'v2') return 'V2';
        if (sub === 'simulator' || sub === 'v3') return 'V3';
        return 'V1';
    });
    const [copilotOpen, setCopilotOpen] = useState(false);
    const [copilotMsg, setCopilotMsg] = useState('');
    const [copilotThread, setCopilotThread] = useState([]);

    const portfolioViews = [
        {
            id: 'V1',
            label: 'Builder'
        },
        {
            id: 'V2',
            label: 'Risk'
        },
        {
            id: 'V3',
            label: 'Simulator'
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
        syncLiveMarketSnapshot();
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(holdings));
        } catch {
            // ignore storage errors
        }
    }, [holdings]);

    const liveMetrics = useMemo(() => computeLivePortfolioMetrics(holdings, isES), [holdings, isES]);

    const sendCopilotPrompt = async (txt) => {
        const q = txt.trim();
        if (!q) return;
        const reply = await generateCopilotPortfolioResponse(q, holdings, isES);
        setCopilotThread(prev => [
            ...prev,
            { role: 'user', txt: q },
            { role: 'ai', txt: reply }
        ]);
    };

    const initialGreeting = txTpl("Copiloto activo ({0} activos). Tu cartera proyecta +{1}% CAGR con Sharpe {2}, Beta {3} y VaR 95% de {4}%.", [liveMetrics.enrichedHoldings.length, liveMetrics.cagrPct, liveMetrics.sharpeRatio, liveMetrics.portfolioBeta, liveMetrics.var95Pct], "Copilot active ({0} assets). Your portfolio projects +{1}% CAGR with {2} Sharpe, {3} Beta, and {4}% 95% VaR.", [liveMetrics.enrichedHoldings.length, liveMetrics.cagrPct, liveMetrics.sharpeRatio, liveMetrics.portfolioBeta, liveMetrics.var95Pct]);
    const displayedThread = [{ role: 'ai', txt: initialGreeting }, ...copilotThread];
    const quickChips = txList(['Revisar solapamiento', 'Simular cobertura', 'Optimizar Sharpe'], ['Check ETF overlap', 'Simulate Put hedge', 'Optimize Sharpe']);

    return (
        <div
            className="responsive-page-container"
            style={{
                minHeight: '100vh',
                background: 'transparent',
                color: '#f8fafc',
                padding: '12px clamp(4px, 1.2vw, 18px) 64px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}
        >
            {/* ══════════════════════════════════════════════════════════════════
                ENCABEZADO V010 GHOST (TEXTO FLOTANTE CON BRILLO SIN SUBRAYADO NI CAJA)
               ══════════════════════════════════════════════════════════════════ */}
            <div
                className="resp-portfolio-subnav"
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '38px',
                    padding: '4px 12px',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
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
                    className="resp-portfolio-copilot-btn"
                    onClick={() => setCopilotOpen(v => !v)}
                    aria-label={tx('Copiloto', 'Copilot')}
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
                    <span>Copilot</span>
                </button>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                LIENZO DE LA VISTA ACTIVA + COPILOTO COLAPSABLE BAJO DEMANDA
               ══════════════════════════════════════════════════════════════════ */}
            <div className="resp-portfolio-main-row" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                    {activeView === 'V1' && (
                        <PortfolioVista1Builder
                            holdings={holdings}
                            setHoldings={setHoldings}
                            watchlistSyms={watchlistSyms}
                            onToggleWatchlist={onToggleWatchlist}
                            onOpenAssetInMarkets={onOpenAssetInMarkets}
                            langCode={langCode}
                        />
                    )}
                    {activeView === 'V2' && <PortfolioVista2Risk holdings={holdings} langCode={langCode} />}
                    {activeView === 'V3' && (
                        <PortfolioVista3AdHoc
                            holdings={holdings}
                            setHoldings={setHoldings}
                            watchlistSyms={watchlistSyms}
                            langCode={langCode}
                        />
                    )}
                </div>

                {copilotOpen && (
                    <div
                        className="resp-copilot-drawer"
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
                                {tx('Copiloto de Cartera', 'Portfolio Copilot')}
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
                                placeholder={tx('Consultar sobre la cartera...', 'Ask about your portfolio...')}
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
                                {tx('Enviar', 'Send')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
