import { useViewLocale } from '../data/i18n/viewLocaleService';
import React, { useState, useEffect } from 'react';
import { INITIAL_HOLDINGS } from './portfolio/portfolioConstants';
import { syncLiveMarketSnapshot, getAssetBySymbol } from '../services/marketService';
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
    useViewLocale(langCode);
    const [activeView, setActiveView] = useState(() => {
        const sub = (new URLSearchParams(window.location.search).get('sub') || '').toLowerCase();
        if (sub === 'risk' || sub === 'v2') return 'V2';
        if (sub === 'simulator' || sub === 'v3') return 'V3';
        return 'V1';
    });

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
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map(h => ({
                        ...h,
                        sym: h.sym === 'BTC-USD' ? 'BTC' : h.sym === 'SOL-USD' ? 'SOL' : h.sym
                    }));
                }
            }
        } catch {
            // fallback
        }
        return INITIAL_HOLDINGS;
    });

    // Synchronize starred Watchlist symbols (`watchlistSyms`) directly into Portfolio Holdings (`holdings`)
    useEffect(() => {
        if (!Array.isArray(watchlistSyms) || watchlistSyms.length === 0) return;
        setHoldings(prev => {
            const prevMap = new Map(
                prev.map(h => {
                    const normSym = h.sym === 'BTC-USD' ? 'BTC' : h.sym === 'SOL-USD' ? 'SOL' : h.sym;
                    return [normSym, { ...h, sym: normSym }];
                })
            );
            const defaultWeight = Number((100 / Math.max(1, watchlistSyms.length)).toFixed(1));
            const next = watchlistSyms.map(sym => {
                const normSym = sym === 'BTC-USD' ? 'BTC' : sym === 'SOL-USD' ? 'SOL' : sym;
                if (prevMap.has(normSym)) {
                    return prevMap.get(normSym);
                }
                const meta = getAssetBySymbol(normSym);
                return {
                    sym: normSym,
                    name: meta?.name || normSym,
                    cat: meta?.cat || 'Equities',
                    weight: defaultWeight,
                    enabled: true
                };
            });
            return next;
        });
    }, [watchlistSyms]);

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
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                LIENZO DE LA VISTA ACTIVA
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
            </div>
        </div>
    );
}
