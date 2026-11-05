import React, { useState, useEffect, useRef } from 'react';
import { Video, Palette, Play, Pause, Search, X, Check } from 'lucide-react';
import WebbDeepFieldCanvas from '../WebbDeepFieldCanvas';
import StarfieldBackground from '../StarfieldBackground';
import MarketAnomaliesView from '../MarketAnomaliesView';
import PortfolioVista1Builder from '../portfolio/PortfolioVista1Builder';
import PortfolioVista2Risk from '../portfolio/PortfolioVista2Risk';
import PortfolioVista3AdHoc from '../portfolio/PortfolioVista3AdHoc';
import { INITIAL_HOLDINGS } from '../portfolio/portfolioConstants';
import { DEFAULT_WATCHLIST_SYMS } from '../../services/committeeService';
import { FlagBadge } from '../FooterBar';
import { LANGUAGES, PALETTES, I18N } from '../../data/i18n';
import { useViewLocale } from '../../data/i18n/viewLocaleService';
import { getGuideVideoLangData, getGuideVideoPageTimings } from './guideVideoI18n';

/* ═══════════════════════════════════════════════════════════════════════════
   CAPA 1: COREOGRAFÍA VISUAL PURA POR PÁGINA (100% INDEPENDIENTE DEL IDIOMA)
   Aquí solo se definen coordenadas del puntero animado (cursorX, cursorY),
   scroll vertical automático (scrollY), mirada del Orbe 4D (lookAtX, lookAtY)
   y estado visual de la vista real (previewConfig).
   Los subtítulos, etiquetas y tiempos de audio por idioma viven separados
   en ./guideVideoI18n.js.
   ═══════════════════════════════════════════════════════════════════════════ */
export const GUIDE_VIDEO_SCENES_BY_PAGE = {
    home: [
        { id: 'home-canvas', cursorX: 50, cursorY: 27, lookAtX: 0.0, lookAtY: -0.9, dockSide: 'right' },
        { id: 'home-header', cursorX: 3.2, cursorY: 4.5, lookAtX: -2.5, lookAtY: -2.2, dockSide: 'right' },
        { id: 'home-markets', cursorX: 46.2, cursorY: 4.5, lookAtX: -0.3, lookAtY: -2.2, dockSide: 'right' },
        { id: 'home-portfolio', cursorX: 53.8, cursorY: 4.5, lookAtX: 0.3, lookAtY: -2.2, dockSide: 'right' },
        { id: 'home-system', cursorX: 3.8, cursorY: 95.5, lookAtX: -2.4, lookAtY: 2.1, dockSide: 'right' },
        { id: 'home-guide', cursorX: 8.8, cursorY: 95.5, lookAtX: -2.0, lookAtY: 2.1, dockSide: 'right' },
        { id: 'home-langs', cursorX: 93.2, cursorY: 95.5, lookAtX: 2.2, lookAtY: 2.1, dockSide: 'left' },
        { id: 'home-palettes', cursorX: 97.2, cursorY: 95.5, lookAtX: 2.5, lookAtY: 2.1, dockSide: 'left' }
    ],

    'mkt-screener': [
        {
            id: 'scr-categories',
            cursorX: 48,
            cursorY: 10.5,
            lookAtX: -0.2,
            lookAtY: -2.0,
            dockSide: 'right',
            scrollY: 0,
            previewConfig: { viewMode: 'screener', visualMode: 'table', categoryFilter: 'ALL' }
        },
        {
            id: 'scr-pulse',
            cursorX: 46,
            cursorY: 21,
            lookAtX: -0.2,
            lookAtY: -1.3,
            dockSide: 'right',
            scrollY: 0,
            previewConfig: { viewMode: 'screener', visualMode: 'table', categoryFilter: 'ALL' }
        },
        {
            id: 'scr-table',
            cursorX: 44,
            cursorY: 58,
            lookAtX: -0.5,
            lookAtY: 0.5,
            dockSide: 'right',
            scrollY: -95,
            previewConfig: { viewMode: 'screener', visualMode: 'table', categoryFilter: 'ALL' }
        },
        {
            id: 'scr-orbital',
            cursorX: 38,
            cursorY: 56,
            lookAtX: -0.6,
            lookAtY: 0.4,
            dockSide: 'right',
            scrollY: -105,
            previewConfig: { viewMode: 'screener', visualMode: 'orbital', categoryFilter: 'ALL' }
        },
        {
            id: 'scr-heatmap',
            cursorX: 46,
            cursorY: 56,
            lookAtX: -0.2,
            lookAtY: 0.4,
            dockSide: 'right',
            scrollY: -105,
            previewConfig: { viewMode: 'screener', visualMode: 'heatmap', categoryFilter: 'ALL' }
        },
        {
            id: 'scr-maintools',
            cursorX: 52,
            cursorY: 54,
            lookAtX: 0.2,
            lookAtY: 0.3,
            dockSide: 'left',
            scrollY: -105,
            previewConfig: { viewMode: 'screener', visualMode: 'tools', categoryFilter: 'ALL' }
        }
    ],

    'mkt-analytics': [
        {
            id: 'ana-hero',
            cursorX: 48,
            cursorY: 18,
            lookAtX: -0.2,
            lookAtY: -1.6,
            dockSide: 'right',
            scrollY: 0,
            previewConfig: { viewMode: 'detail', l2Section: 'analytics', analysisLens: 'technical', showBollinger: false, showVwap: false, showSubChart: true }
        },
        {
            id: 'ana-technical',
            cursorX: 54,
            cursorY: 52,
            lookAtX: 0.2,
            lookAtY: 0.1,
            dockSide: 'right',
            scrollY: -65,
            previewConfig: { viewMode: 'detail', l2Section: 'analytics', analysisLens: 'technical', showBollinger: true, showVwap: true, showSubChart: true }
        },
        {
            id: 'ana-compare',
            cursorX: 48,
            cursorY: 52,
            lookAtX: -0.1,
            lookAtY: 0.1,
            dockSide: 'right',
            scrollY: -65,
            previewConfig: { viewMode: 'detail', l2Section: 'analytics', analysisLens: 'compare', compareSymbol: 'SPY' }
        },
        {
            id: 'ana-micro',
            cursorX: 42,
            cursorY: 56,
            lookAtX: -0.4,
            lookAtY: 0.3,
            dockSide: 'right',
            scrollY: -65,
            previewConfig: { viewMode: 'detail', l2Section: 'analytics', analysisLens: 'microstructure' }
        },
        {
            id: 'ana-engines',
            cursorX: 56,
            cursorY: 54,
            lookAtX: 0.4,
            lookAtY: 0.2,
            dockSide: 'left',
            scrollY: -65,
            previewConfig: { viewMode: 'detail', l2Section: 'analytics', analysisLens: 'derivatives', optionsSubView: 'vol3d' }
        }
    ],

    'mkt-research': [
        {
            id: 'res-hero',
            cursorX: 68,
            cursorY: 19,
            lookAtX: 1.1,
            lookAtY: -1.6,
            dockSide: 'left',
            scrollY: 0,
            previewConfig: { viewMode: 'detail', l2Section: 'research', researchFactorFilter: 'ALL' }
        },
        {
            id: 'res-rag',
            cursorX: 18,
            cursorY: 54,
            lookAtX: -1.8,
            lookAtY: 0.2,
            dockSide: 'right',
            scrollY: -75,
            previewConfig: { viewMode: 'detail', l2Section: 'research', researchFactorFilter: 'ALL' }
        },
        {
            id: 'res-factors',
            cursorX: 50,
            cursorY: 54,
            lookAtX: 0.0,
            lookAtY: 0.2,
            dockSide: 'right',
            scrollY: -75,
            previewConfig: { viewMode: 'detail', l2Section: 'research', researchFactorFilter: 'BULL' }
        },
        {
            id: 'res-pulse24h',
            cursorX: 82,
            cursorY: 54,
            lookAtX: 1.8,
            lookAtY: 0.2,
            dockSide: 'left',
            scrollY: -75,
            previewConfig: { viewMode: 'detail', l2Section: 'research', researchFactorFilter: 'ALL' }
        }
    ],

    'port-v1': [
        { id: 'p1-pills', cursorX: 48, cursorY: 18, lookAtX: -0.1, lookAtY: -1.6, dockSide: 'right', scrollY: 0 },
        { id: 'p1-table', cursorX: 25, cursorY: 52, lookAtX: -1.5, lookAtY: 0.1, dockSide: 'right', scrollY: -75 },
        { id: 'p1-xray', cursorX: 72, cursorY: 38, lookAtX: 1.5, lookAtY: -0.5, dockSide: 'left', scrollY: -75 },
        { id: 'p1-calendar', cursorX: 72, cursorY: 66, lookAtX: 1.5, lookAtY: 0.8, dockSide: 'left', scrollY: -135 },
        { id: 'p1-backtest', cursorX: 50, cursorY: 64, lookAtX: 0.0, lookAtY: 0.7, dockSide: 'right', scrollY: -410 }
    ],

    'port-v2': [
        { id: 'p2-markowitz', cursorX: 26, cursorY: 46, lookAtX: -1.5, lookAtY: -0.2, dockSide: 'right', scrollY: -60 },
        { id: 'p2-tornado', cursorX: 26, cursorY: 62, lookAtX: -1.5, lookAtY: 0.6, dockSide: 'right', scrollY: -360 },
        { id: 'p2-corr', cursorX: 74, cursorY: 46, lookAtX: 1.6, lookAtY: -0.2, dockSide: 'left', scrollY: -60 },
        { id: 'p2-shock2d', cursorX: 74, cursorY: 62, lookAtX: 1.6, lookAtY: 0.6, dockSide: 'left', scrollY: -360 },
        { id: 'p2-montecarlo', cursorX: 50, cursorY: 64, lookAtX: 0.0, lookAtY: 0.7, dockSide: 'right', scrollY: -670 }
    ],

    'port-v3': [
        { id: 'p3-impact', cursorX: 48, cursorY: 18, lookAtX: -0.1, lookAtY: -1.6, dockSide: 'right', scrollY: 0 },
        { id: 'p3-whatif', cursorX: 26, cursorY: 46, lookAtX: -1.5, lookAtY: -0.2, dockSide: 'right', scrollY: -65 },
        { id: 'p3-tailhedge', cursorX: 26, cursorY: 62, lookAtX: -1.5, lookAtY: 0.6, dockSide: 'right', scrollY: -365 },
        { id: 'p3-committee', cursorX: 74, cursorY: 52, lookAtX: 1.6, lookAtY: 0.2, dockSide: 'left', scrollY: -210 },
        { id: 'p3-walkforward', cursorX: 50, cursorY: 64, lookAtX: 0.0, lookAtY: 0.7, dockSide: 'right', scrollY: -670 }
    ]
};

/* ───────────────────────────────────────────────────────────────────────────
   CABECERA Y PIE DE PÁGINA OFICIALES V010 (FIELES 1:1 A HEADERBAR.JSX Y FOOTERBAR.JSX)
   ─────────────────────────────────────────────────────────────────────────── */
function RealV010HeaderChrome({ activeTabId, activeSceneId, langCode = 'EN' }) {
    const t = I18N[langCode] || I18N.EN;
    const isLambdaFocused = activeSceneId === 'home-header';
    const isMarketsFocused = activeSceneId === 'home-markets';
    const isPortfolioFocused = activeSceneId === 'home-portfolio';

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '0.82rem 1.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                zIndex: 40,
                pointerEvents: 'none'
            }}
        >
            {/* SECTOR IZQUIERDO: ÚNICAMENTE EL ÍCONO λ CINCELADO (SIN TEXTO AL LADO) */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                    style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isLambdaFocused ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.22)' : 'transparent',
                        border: isLambdaFocused ? '1.5px solid var(--ui-accent, #10b981)' : '1px solid transparent',
                        boxShadow: isLambdaFocused ? '0 0 18px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.65)' : 'none',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.75))' }}
                    >
                        <polygon points="6.5,4 9.8,4 18.8,20 15.5,20" fill="var(--ui-accent, #10b981)" />
                        <polygon points="11.6,11.2 13.4,13.8 8.4,20 5.2,20" fill="#34d399" />
                        <polygon points="5.2,4 9.8,4 8.2,6.2 5.2,6.2" fill="#a7f3d0" />
                    </svg>
                </div>
            </div>

            {/* SECTOR CENTRAL: MARKETS Y PORTFOLIO CENTRADOS (ESTILO V010 GHOST) */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1.15rem' }}>
                <span
                    style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.84rem',
                        fontWeight: activeTabId === 'workstation' || isMarketsFocused ? 800 : 600,
                        color:
                            activeTabId === 'workstation' || isMarketsFocused
                                ? 'var(--ui-accent, #10b981)'
                                : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.78)',
                        background: isMarketsFocused ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.18)' : 'transparent',
                        border: isMarketsFocused ? '1.5px solid var(--ui-accent, #10b981)' : '1px solid transparent',
                        textShadow:
                            activeTabId === 'workstation' || isMarketsFocused
                                ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.95), 0 0 22px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.55)'
                                : '0 1px 4px rgba(0, 0, 0, 0.9)'
                    }}
                >
                    {t.navWorkstation}
                </span>

                <span
                    style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.84rem',
                        fontWeight: activeTabId === 'consensus' || isPortfolioFocused ? 800 : 600,
                        color:
                            activeTabId === 'consensus' || isPortfolioFocused
                                ? 'var(--ui-accent, #10b981)'
                                : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.78)',
                        background: isPortfolioFocused ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.18)' : 'transparent',
                        border: isPortfolioFocused ? '1.5px solid var(--ui-accent, #10b981)' : '1px solid transparent',
                        textShadow:
                            activeTabId === 'consensus' || isPortfolioFocused
                                ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.95), 0 0 22px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.55)'
                                : '0 1px 4px rgba(0, 0, 0, 0.9)'
                    }}
                >
                    {t.navConsensus}
                </span>
            </div>

            {/* SECTOR DERECHO: VACÍO EN HOME Y EN VISTAS PRINCIPALES */}
            <div />
        </div>
    );
}

function RealV010FooterChrome({ activeSceneId, langCode = 'EN' }) {
    const t = I18N[langCode] || I18N.EN;
    const sampleLang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];

    return (
        <div
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '0.65rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.76rem',
                zIndex: 40,
                pointerEvents: 'none'
            }}
        >
            {/* ESQUINA INFERIOR IZQUIERDA: SYSTEM & GUIDE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
                <span
                    style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: activeSceneId === 'home-system' ? 700 : 600,
                        color: activeSceneId === 'home-system' ? 'var(--ui-accent, #10b981)' : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.78)',
                        background: activeSceneId === 'home-system' ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.18)' : 'transparent',
                        border: activeSceneId === 'home-system' ? '1.5px solid var(--ui-accent, #10b981)' : '1px solid transparent',
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.9)'
                    }}
                >
                    {t.navTelemetry || 'System'}
                </span>
                <span
                    style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: activeSceneId === 'home-guide' ? 700 : 600,
                        color: activeSceneId === 'home-guide' ? 'var(--ui-accent, #10b981)' : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.78)',
                        background: activeSceneId === 'home-guide' ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.18)' : 'transparent',
                        border: activeSceneId === 'home-guide' ? '1.5px solid var(--ui-accent, #10b981)' : '1px solid transparent',
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.9)'
                    }}
                >
                    {t.navGuide || 'Guide'}
                </span>
            </div>

            {/* ESQUINA INFERIOR DERECHA: IDIOMA + PALETTE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.42rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: activeSceneId === 'home-langs' ? 700 : 600,
                        color: activeSceneId === 'home-langs' ? 'var(--ui-accent, #10b981)' : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.78)',
                        background: activeSceneId === 'home-langs' ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.18)' : 'transparent',
                        border: activeSceneId === 'home-langs' ? '1.5px solid var(--ui-accent, #10b981)' : '1px solid transparent'
                    }}
                >
                    <FlagBadge lang={sampleLang} width={17} height={12} />
                    <span>{sampleLang.code}</span>
                </span>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '3px 7px',
                        borderRadius: '6px',
                        background: activeSceneId === 'home-palettes' ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.18)' : 'transparent',
                        border: activeSceneId === 'home-palettes' ? '1.5px solid var(--ui-accent, #10b981)' : '1px solid transparent'
                    }}
                >
                    <Palette size={16} color="var(--ui-accent, #10b981)" />
                </span>
            </div>
        </div>
    );
}

/* ── 1. ESCENARIO REAL DE LA PANTALLA HOME (100% FIEL A HOMESTAGE.JSX + HEADERBAR.JSX + FOOTERBAR.JSX) ── */
function RealHomeCanvasStage({ activeSceneId, langCode = 'EN', animClock }) {
    const t = I18N[langCode] || I18N.EN;
    const sampleLang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];

    const paletteAmbientBgs = [
        'rgba(2, 6, 23, 0.18)',
        'rgba(0, 0, 0, 0.52)',
        'rgba(7, 24, 54, 0.42)',
        'rgba(28, 25, 23, 0.42)',
        'rgba(15, 23, 62, 0.45)'
    ];
    const activeThemeIdx =
        activeSceneId === 'home-palettes'
            ? Math.floor(animClock * 1.1) % PALETTES.length
            : 0;

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#000000' }}>
            {/* Fondo espacial real WebbDeepFieldCanvas */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <WebbDeepFieldCanvas isPaused={false} lang={langCode} />
            </div>

            {/* Tinte de ambiente cuando se demuestra Palette */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: paletteAmbientBgs[activeThemeIdx],
                    transition: 'background 0.35s ease',
                    pointerEvents: 'none'
                }}
            />

            {/* HEADER OFICIAL V010: λ a la izquierda, Markets y Portfolio centrados */}
            <RealV010HeaderChrome activeTabId="presentation" activeSceneId={activeSceneId} langCode={langCode} />

            {/* TEXTO INTRODUCTORIO EXACTAMENTE IGUAL A HOMESTAGE.JSX + I18N.JS */}
            <div
                style={{
                    position: 'absolute',
                    top: '18.5%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 15,
                    textAlign: 'center',
                    width: '90%',
                    maxWidth: '700px',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.55rem'
                }}
            >
                <h1
                    className="serif-heading"
                    style={{
                        fontSize: '1.55rem',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.94)',
                        letterSpacing: '-0.01em',
                        margin: 0
                    }}
                >
                    {t.homeHeadline}
                </h1>
                <p
                    style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.68)',
                        lineHeight: 1.6,
                        fontWeight: 400,
                        margin: 0
                    }}
                >
                    {t.homeBrief}
                </p>
            </div>

            {/* MODAL CENTRAL REAL DE 56 IDIOMAS (CUANDO LA ESCENA ES 07 • IDIOMAS) */}
            {activeSceneId === 'home-langs' && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(4, 7, 14, 0.68)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 35,
                        pointerEvents: 'none'
                    }}
                >
                    <div
                        style={{
                            width: '440px',
                            borderRadius: '16px',
                            backgroundColor: 'rgba(10, 15, 26, 0.98)',
                            border: '1px solid rgba(16, 185, 129, 0.55)',
                            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 28px rgba(16, 185, 129, 0.22)',
                            padding: '16px 18px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                                    {t.langModalTitle}
                                </span>
                                <span
                                    className="mono-metric"
                                    style={{
                                        fontSize: '9.5px',
                                        fontWeight: 800,
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        backgroundColor: 'rgba(16, 185, 129, 0.16)',
                                        border: '1px solid rgba(16, 185, 129, 0.38)',
                                        color: '#10b981'
                                    }}
                                >
                                    56 LANGUAGES
                                </span>
                            </div>
                            <X size={14} color="#94a3b8" />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'rgba(6, 10, 18, 0.92)',
                                border: '1.5px solid #10b981',
                                borderRadius: '10px',
                                padding: '7px 11px',
                                fontSize: '11.5px',
                                color: '#94a3b8'
                            }}
                        >
                            <Search size={13} color="#10b981" />
                            <span>{t.langSearchPlaceholder}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {LANGUAGES.slice(0, 5).map(lang => {
                                const isSel = lang.code === sampleLang.code;
                                return (
                                    <div
                                        key={lang.code}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '6px 10px',
                                            borderRadius: '8px',
                                            backgroundColor: isSel ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                            border: isSel ? '1px solid #10b981' : '1px solid transparent'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FlagBadge lang={lang} width={20} height={14} />
                                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
                                                {lang.nativeName}
                                            </span>
                                            <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                                                {lang.name} • {lang.region}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span
                                                className="mono-metric"
                                                style={{
                                                    fontSize: '10px',
                                                    fontWeight: 800,
                                                    color: isSel ? '#10b981' : '#64748b'
                                                }}
                                            >
                                                {lang.code}
                                            </span>
                                            {isSel && <Check size={12} color="#10b981" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* POPOVER REAL DE 5 AMBIENTES DE LECTURA (PALETTE) EN ESQUINA INFERIOR DERECHA */}
            {activeSceneId === 'home-palettes' && (
                <div
                    style={{
                        position: 'absolute',
                        right: '24px',
                        bottom: '44px',
                        zIndex: 35,
                        width: '285px',
                        padding: '11px 13px',
                        borderRadius: '11px',
                        background: 'rgba(2, 6, 23, 0.96)',
                        border: '1px solid rgba(16, 185, 129, 0.55)',
                        boxShadow: '0 14px 36px rgba(0, 0, 0, 0.88)'
                    }}
                >
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                        Palette (5 Themes)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {PALETTES.map((pt, i) => {
                            const isSel = i === activeThemeIdx;
                            return (
                                <div
                                    key={pt.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '5px 9px',
                                        borderRadius: '6px',
                                        background: isSel ? 'rgba(16, 185, 129, 0.22)' : 'rgba(15, 23, 42, 0.72)',
                                        border: isSel ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.14)',
                                        fontSize: '11px',
                                        fontWeight: isSel ? 700 : 500,
                                        color: isSel ? '#ffffff' : '#94a3b8'
                                    }}
                                >
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                                        <span
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '999px',
                                                backgroundColor: pt.color,
                                                boxShadow: `0 0 6px ${pt.color}`
                                            }}
                                        />
                                        <span>{pt.name}</span>
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '10px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        <span style={{ color: '#10b981' }}>▲#10b981</span>
                                        <span style={{ color: '#f43f5e' }}>▼#f43f5e</span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* FOOTER OFICIAL V010 */}
            <RealV010FooterChrome activeSceneId={activeSceneId} langCode={langCode} />
        </div>
    );
}

/* ───────────────────────────────────────────────────────────────────────────
   VIEWPORT ESCALADO 1440×810 CON LOS COMPONENTES REALES DE LA APLICACIÓN
   Renderiza MarketAnomaliesView, PortfolioVista1Builder, PortfolioVista2Risk
   y PortfolioVista3AdHoc con su contenido real completo, cambiando de pestaña
   y desplazándose suavemente según la escena activa del video.
   ─────────────────────────────────────────────────────────────────────────── */
function ScaledLiveAppStage({ pageId, activeScene, langCode = 'EN', portTabs }) {
    const outerRef = useRef(null);
    const [scale, setScale] = useState(0.55);
    const [selectedAsset, setSelectedAsset] = useState('NVDA');
    const [holdings, setHoldings] = useState(INITIAL_HOLDINGS);
    const [watchlistSyms] = useState(DEFAULT_WATCHLIST_SYMS);

    const t = I18N[langCode] || I18N.EN;

    useEffect(() => {
        const el = outerRef.current;
        if (!el) return undefined;
        const updateScale = () => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const scaleX = rect.width / 1440;
                const scaleY = rect.height / 810;
                setScale(Math.min(scaleX, scaleY));
            }
        };
        updateScale();
        const ro = new ResizeObserver(updateScale);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const isPortfolioPage = pageId.startsWith('port-');
    const activeTabId = isPortfolioPage ? 'consensus' : 'workstation';
    const scrollY = activeScene?.scrollY || 0;
    const tabsLabels = portTabs || ['Builder', 'Risk', 'Simulator', 'Copilot'];

    return (
        <div
            ref={outerRef}
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                backgroundColor: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
            }}
        >
            <div
                style={{
                    width: '1440px',
                    height: '810px',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#020617',
                    '--ui-accent': '#10b981',
                    '--ui-accent-rgb': '16, 185, 129',
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    flexShrink: 0
                }}
            >
                {pageId === 'home' ? (
                    <RealHomeCanvasStage
                        activeSceneId={activeScene.id}
                        langCode={langCode}
                        animClock={activeScene.animClock || 0}
                    />
                ) : (
                    <>
                        <StarfieldBackground active={true} />
                        <RealV010HeaderChrome activeTabId={activeTabId} activeSceneId={activeScene.id} langCode={langCode} />

                        {/* CONTENIDO REAL DE LA VISTA CON SCROLL VERTICAL AUTOMÁTICO POR ESCENA */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '54px',
                                left: '24px',
                                right: '24px',
                                bottom: '40px',
                                overflow: 'hidden',
                                zIndex: 10
                            }}
                        >
                            <div
                                style={{
                                    transform: `translateY(${scrollY}px)`,
                                    transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)'
                                }}
                            >
                                {!isPortfolioPage ? (
                                    <MarketAnomaliesView
                                        selectedAsset={selectedAsset}
                                        onSelectAsset={setSelectedAsset}
                                        initialViewMode={pageId === 'mkt-screener' ? 'screener' : 'detail'}
                                        watchlistSyms={watchlistSyms}
                                        onToggleWatchlist={() => {}}
                                        marketsToolsMode="v4-tab"
                                        mainToolsStyleId="hb-05"
                                        langCode={langCode}
                                        t={t}
                                        previewConfig={activeScene.previewConfig}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {/* Barra superior real de Portfolio (Constructor | Riesgo | Simulador + Copiloto) */}
                                        <div
                                            style={{
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '34px',
                                                padding: '2px 12px'
                                            }}
                                        >
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1.65rem' }}>
                                                {[
                                                    { id: 'port-v1', label: tabsLabels[0] },
                                                    { id: 'port-v2', label: tabsLabels[1] },
                                                    { id: 'port-v3', label: tabsLabels[2] }
                                                ].map(v => {
                                                    const isAct = pageId === v.id;
                                                    return (
                                                        <span
                                                            key={v.id}
                                                            style={{
                                                                fontSize: '15px',
                                                                fontWeight: isAct ? 800 : 600,
                                                                color: isAct ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.62)',
                                                                textShadow: isAct ? '0 0 15px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.88)' : 'none'
                                                            }}
                                                        >
                                                            {v.label}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    right: '4px',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    color: 'rgba(148, 163, 184, 0.72)'
                                                }}
                                            >
                                                {tabsLabels[3]}
                                            </span>
                                        </div>

                                        {pageId === 'port-v1' && (
                                            <PortfolioVista1Builder
                                                holdings={holdings}
                                                setHoldings={setHoldings}
                                                watchlistSyms={watchlistSyms}
                                                onToggleWatchlist={() => {}}
                                                onOpenAssetInMarkets={() => {}}
                                                langCode={langCode}
                                            />
                                        )}
                                        {pageId === 'port-v2' && (
                                            <PortfolioVista2Risk holdings={holdings} langCode={langCode} />
                                        )}
                                        {pageId === 'port-v3' && (
                                            <PortfolioVista3AdHoc
                                                holdings={holdings}
                                                setHoldings={setHoldings}
                                                onNavigateToBuilder={() => {}}
                                                langCode={langCode}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <RealV010FooterChrome activeSceneId={activeScene.id} langCode={langCode} />
                    </>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL DE ESCENARIO INTERACTIVO 16:9 + ORBE 4D EN PIP
   Combina la Coreografía Visual (GUIDE_VIDEO_SCENES_BY_PAGE) con la Capa de
   Idiomas y Tiempos (guideVideoI18n.js) para los 56 idiomas.
   ═══════════════════════════════════════════════════════════════════════════ */
export default function GuideInteractiveVideoStage({
    page,
    typo,
    isES,
    langCode,
    audioPlaying,
    currentTime,
    progressPct,
    animClock,
    speechEnergy,
    onToggleAudio,
    onJumpToScene,
    OrbCharacterComponent,
    isFullscreen = false,
    subtitlesEnabled = true
}) {
    const resolvedLang = (langCode || (isES ? 'ES' : 'EN')).toUpperCase();
    useViewLocale(resolvedLang);
    const pageId = page?.id || 'home';
    const langData = getGuideVideoLangData(resolvedLang);
    const pageTimings = getGuideVideoPageTimings(resolvedLang, pageId);

    const baseScenes = GUIDE_VIDEO_SCENES_BY_PAGE[pageId] || GUIDE_VIDEO_SCENES_BY_PAGE.home;
    const scenes = baseScenes.map((sc, idx) => {
        const timingObj = pageTimings.find(t => t.id === sc.id) || pageTimings[idx] || {};
        const fallbackStart = (idx / baseScenes.length) * 100;
        const fallbackEnd = ((idx + 1) / baseScenes.length) * 100.1;
        return {
            ...sc,
            short: langData.short?.[sc.id] || sc.id,
            caption: langData.captions?.[sc.id] || '',
            startPct: timingObj.startPct ?? fallbackStart,
            endPct: timingObj.endPct ?? fallbackEnd
        };
    });

    const activeSceneIdx = Math.max(
        0,
        scenes.findIndex(s => progressPct >= s.startPct && progressPct < s.endPct)
    );
    const activeScene = {
        ...(scenes[activeSceneIdx] || scenes[0]),
        animClock
    };

    const showCenterPlayOverlay = !audioPlaying;

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                flex: isFullscreen ? 1 : 'initial',
                minHeight: isFullscreen ? 0 : 'auto',
                background: '#020617',
                borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Barra superior de temas/capítulos clicables para anticipar y navegar el video */}
            <div
                style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '9px 14px',
                    background: 'rgba(2, 6, 23, 0.94)',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
                    flexWrap: 'wrap'
                }}
            >
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: 'var(--ui-accent, #10b981)',
                        fontFamily: typo.headingFontFamily
                    }}
                >
                    <Video size={13} color="var(--ui-accent, #10b981)" />
                    <span>
                        {`${langData.ui?.walkthrough || 'Live Visual Walkthrough'} • ${page.label}`}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                    {scenes.map((sc, idx) => {
                        const isCurrent = idx === activeSceneIdx && (audioPlaying || currentTime > 0);
                        return (
                            <button
                                key={sc.id}
                                type="button"
                                onClick={() => onJumpToScene(sc)}
                                style={{
                                    padding: '2px 7px',
                                    borderRadius: '5px',
                                    border: isCurrent
                                        ? '1px solid var(--ui-accent, #10b981)'
                                        : '1px solid rgba(148, 163, 184, 0.18)',
                                    background: isCurrent
                                        ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.18)'
                                        : 'rgba(15, 23, 42, 0.65)',
                                    color: isCurrent ? '#ffffff' : '#94a3b8',
                                    fontSize: '10.5px',
                                    fontWeight: isCurrent ? 700 : 500,
                                    fontFamily: 'var(--font-mono)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                {sc.short}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Lienzo 16:9 con la vista real completa del módulo + Cursor animado + Botón Play central + Orbe 4D + Subtítulos */}
            <div
                onClick={onToggleAudio}
                title={langData.ui?.clickPlayPause || 'Click to play or pause'}
                style={{
                    position: 'relative',
                    aspectRatio: isFullscreen ? 'auto' : '16 / 9',
                    flex: isFullscreen ? 1 : 'initial',
                    minHeight: isFullscreen ? 0 : 'auto',
                    maxHeight: isFullscreen ? 'none' : '460px',
                    width: '100%',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    userSelect: 'none',
                    background: '#000000'
                }}
            >
                <ScaledLiveAppStage
                    pageId={pageId}
                    activeScene={activeScene}
                    langCode={resolvedLang}
                    portTabs={langData.ui?.portTabs}
                />

                {/* CURSOR DEMOSTRATIVO ANIMADO QUE RECORRE LA INTERFAZ AL RITMO DE LA LOCUCIÓN */}
                <div
                    style={{
                        position: 'absolute',
                        left: `${activeScene.cursorX}%`,
                        top: `${activeScene.cursorY}%`,
                        transform: 'translate(-4px, -4px)',
                        transition: 'left 0.6s cubic-bezier(0.22, 1, 0.36, 1), top 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                        zIndex: 18,
                        pointerEvents: 'none'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            left: '-12px',
                            top: '-12px',
                            width: '28px',
                            height: '28px',
                            borderRadius: '999px',
                            border: '2px solid rgba(16, 185, 129, 0.85)',
                            background: 'rgba(16, 185, 129, 0.18)',
                            transform: `scale(${1 + 0.22 * Math.sin(animClock * 5.5)})`,
                            boxShadow: '0 0 14px rgba(16, 185, 129, 0.65)'
                        }}
                    />
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.9))' }}>
                        <path
                            d="M4 3L11.5 20L14.2 13.2L21 10.5L4 3Z"
                            fill="#10b981"
                            stroke="#ffffff"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* BOTÓN CENTRAL DE PLAY / PAUSE EN EL MEDIO DEL VIDEO (ESTILO YOUTUBE) */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) scale(${showCenterPlayOverlay ? 1 : 0.86})`,
                        opacity: showCenterPlayOverlay ? 1 : 0,
                        transition: 'opacity 0.22s ease, transform 0.22s ease',
                        zIndex: 24,
                        pointerEvents: 'none'
                    }}
                >
                    <div
                        style={{
                            width: isFullscreen ? '72px' : '58px',
                            height: isFullscreen ? '72px' : '58px',
                            borderRadius: '999px',
                            background: 'rgba(2, 6, 23, 0.82)',
                            border: '2px solid rgba(16, 185, 129, 0.88)',
                            boxShadow: '0 10px 32px rgba(0, 0, 0, 0.85), 0 0 24px rgba(16, 185, 129, 0.45)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff'
                        }}
                    >
                        {audioPlaying ? (
                            <Pause size={isFullscreen ? 28 : 22} fill="#ffffff" />
                        ) : (
                            <Play size={isFullscreen ? 28 : 22} fill="#ffffff" style={{ marginLeft: '3px' }} />
                        )}
                    </div>
                </div>

                {/* PRESENTADOR ORBE 4D EN PICTURE-IN-PICTURE (SE CAMBIA DE LADO PARA NO TAPAR CONTROLES) */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: isFullscreen ? '56px' : '46px',
                        left: activeScene.dockSide === 'left' ? (isFullscreen ? '24px' : '16px') : 'auto',
                        right: activeScene.dockSide === 'right' ? (isFullscreen ? '24px' : '16px') : 'auto',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        padding: isFullscreen ? '10px 14px' : '6px 10px',
                        borderRadius: '14px',
                        background: 'rgba(2, 6, 23, 0.84)',
                        border: audioPlaying
                            ? '1.5px solid rgba(16, 185, 129, 0.68)'
                            : '1px solid rgba(148, 163, 184, 0.28)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                >
                    <OrbCharacterComponent
                        size={isFullscreen ? 150 : 106}
                        isSpeaking={audioPlaying}
                        speechEnergy={speechEnergy}
                        currentTime={animClock}
                        lookAtX={activeScene.lookAtX}
                        lookAtY={activeScene.lookAtY}
                    />
                </div>

                {/* SUBTÍTULOS LIMPIOS EN EL IDIOMA CORRESPONDIENTE (SIN EL PREFIJO DE CAPÍTULO) */}
                {subtitlesEnabled && (
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: isFullscreen ? '16px' : '10px',
                            transform: 'translateX(-50%)',
                            zIndex: 22,
                            maxWidth: '90%',
                            padding: isFullscreen ? '7px 20px' : '5px 15px',
                            borderRadius: '8px',
                            background: 'rgba(2, 6, 23, 0.88)',
                            border: '1px solid rgba(148, 163, 184, 0.22)',
                            color: '#f8fafc',
                            fontSize: isFullscreen ? '14.5px' : '12px',
                            fontWeight: 600,
                            textAlign: 'center',
                            lineHeight: 1.4,
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
                            pointerEvents: 'none'
                        }}
                    >
                        {activeScene.caption}
                    </div>
                )}
            </div>
        </div>
    );
}
