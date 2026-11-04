import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    ChevronRight,
    ChevronDown,
    Layers,
    Maximize2,
    ArrowLeft,
    ArrowRight,
    Play,
    Pause,
    Volume2,
    Video,
    X
} from 'lucide-react';
import { GUIDE_TREE_PAGES, ALL_GUIDE_PAGES } from './guide/guideTreeData';
import { GUIDE_MODALS_BY_SECTION } from './guide/guideModalsData';
import { getSavedGuideTypoPreset } from './guide/guideTypographyPresets';

const LEVEL_LABELS = {
    0: 'Vista Colapsada',
    1: 'Vista Principal',
    2: 'Vista Expandida'
};

/* ── COMPONENTE DE FÓRMULA MATEMÁTICA ESTRUCTURADA (FRACCIONES REALES + LEYENDA) ── */
function MathFormulaBox({ math, formula, typo }) {
    if (!math && !formula) return null;

    return (
        <div
            style={{
                flexShrink: 0,
                padding: '14px 18px',
                borderRadius: '8px',
                background: 'rgba(2, 6, 23, 0.90)',
                border: '1px solid rgba(16, 185, 129, 0.28)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}
        >
            <div
                style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--ui-accent, #10b981)',
                    fontFamily: typo.headingFontFamily
                }}
            >
                Fórmula Matemática
            </div>

            {math ? (
                <>
                    {/* ECUACIÓN PRINCIPAL CON SOPORTE DE FRACCIÓN VERTICAL REAL */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '10px',
                            padding: '6px 4px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13.5px',
                            color: '#f8fafc',
                            overflowX: 'auto'
                        }}
                    >
                        {math.lhs && (
                            <span style={{ fontWeight: 700, color: '#10b981', whiteSpace: 'nowrap' }}>
                                {math.lhs.includes('=') ? math.lhs : `${math.lhs} =`}
                            </span>
                        )}

                        {math.numerator && math.denominator ? (
                            <div
                                style={{
                                    display: 'inline-flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '2px 8px'
                                }}
                            >
                                <span
                                    style={{
                                        padding: '0 8px 5px',
                                        color: '#ffffff',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {math.numerator}
                                </span>
                                <span
                                    style={{
                                        width: '100%',
                                        height: '1.5px',
                                        background: 'rgba(16, 185, 129, 0.75)'
                                    }}
                                />
                                <span
                                    style={{
                                        padding: '5px 8px 0',
                                        color: '#cbd5e1',
                                        fontWeight: 500,
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {math.denominator}
                                </span>
                            </div>
                        ) : (
                            math.inline && (
                                <span style={{ color: '#ffffff', fontWeight: 600 }}>
                                    {math.inline}
                                </span>
                            )
                        )}

                        {math.rhs && (
                            <span style={{ fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap' }}>
                                {math.rhs}
                            </span>
                        )}
                    </div>

                    {/* LEYENDA DE VARIABLES ("Dónde:") */}
                    {math.vars?.length > 0 && (
                        <div
                            style={{
                                borderTop: '1px solid rgba(148, 163, 184, 0.14)',
                                paddingTop: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                fontSize: '12.5px',
                                color: '#cbd5e1',
                                fontFamily: typo.fontFamily,
                                lineHeight: 1.5
                            }}
                        >
                            {math.vars.map((vLine, idx) => {
                                const colonIdx = vLine.indexOf(':');
                                if (colonIdx > 0) {
                                    const varName = vLine.slice(0, colonIdx);
                                    const varDesc = vLine.slice(colonIdx + 1);
                                    return (
                                        <div key={idx}>
                                            <strong style={{ color: '#e2e8f0', fontWeight: 600 }}>
                                                • {varName}:
                                            </strong>
                                            <span>{varDesc}</span>
                                        </div>
                                    );
                                }
                                return <div key={idx}>• {vLine}</div>;
                            })}
                        </div>
                    )}
                </>
            ) : (
                <div
                    style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13.5px',
                        color: '#f8fafc',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap'
                    }}
                >
                    {formula}
                </div>
            )}
        </div>
    );
}

/* ── PLACEHOLDER DE VIDEO Y AUDIO POR SECCIÓN (ESTILO DOCKER DOCS) ── */
function GuideMediaPlaceholder({ page, typo }) {
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [audioPlaying, setAudioPlaying] = useState(false);

    useEffect(() => {
        setVideoPlaying(false);
        setAudioPlaying(false);
    }, [page?.id]);

    return (
        <div
            style={{
                margin: '0 0 40px',
                borderRadius: '10px',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                background: 'transparent',
                overflow: 'hidden'
            }}
        >
            {/* 1. PLACEHOLDER DE VIDEO DEMOSTRATIVO (16:9) */}
            <div
                onClick={() => setVideoPlaying(prev => !prev)}
                style={{
                    position: 'relative',
                    aspectRatio: '16 / 9',
                    maxHeight: '320px',
                    width: '100%',
                    background: 'transparent',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '24px',
                    cursor: 'pointer',
                    textAlign: 'center'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '12px',
                        left: '14px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        background: 'rgba(2, 6, 23, 0.75)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#cbd5e1',
                        fontFamily: typo.headingFontFamily
                    }}
                >
                    <Video size={12} color="var(--ui-accent, #10b981)" />
                    <span>Placeholder de Video • {page.label}</span>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '14px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(2, 6, 23, 0.75)',
                        border: '1px solid rgba(148, 163, 184, 0.18)',
                        fontSize: '11px',
                        color: '#94a3b8',
                        fontFamily: 'var(--font-mono)'
                    }}
                >
                    01:45 • 1080p
                </div>

                <div
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '999px',
                        background: videoPlaying
                            ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.28)'
                            : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.18)',
                        border: '1.5px solid var(--ui-accent, #10b981)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        boxShadow: '0 0 24px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.25)',
                        transition: 'transform 0.15s ease'
                    }}
                >
                    {videoPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: '2px' }} />}
                </div>

                <div>
                    <div
                        style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#ffffff',
                            fontFamily: typo.headingFontFamily
                        }}
                    >
                        {videoPlaying
                            ? `Reproduciendo vista previa de ${page.label}...`
                            : `Recorrido visual en video por ${page.label}`}
                    </div>
                    <div
                        style={{
                            fontSize: '12.5px',
                            color: '#94a3b8',
                            marginTop: '4px',
                            maxWidth: '480px'
                        }}
                    >
                        Espacio reservado para la cápsula de video demostrativo paso a paso de esta sección.
                    </div>
                </div>
            </div>

            {/* 2. PLACEHOLDER DE AUDIO (RESUMEN NARRADO) */}
            <div
                style={{
                    padding: '11px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    flexWrap: 'wrap',
                    background: 'rgba(2, 6, 23, 0.55)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <button
                        type="button"
                        onClick={() => setAudioPlaying(prev => !prev)}
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '999px',
                            border: '1px solid rgba(var(--ui-accent-rgb, 16, 185, 129), 0.45)',
                            background: 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.14)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0
                        }}
                    >
                        {audioPlaying ? <Pause size={13} /> : <Play size={13} style={{ marginLeft: '1px' }} />}
                    </button>

                    <div style={{ minWidth: 0 }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                color: '#e2e8f0',
                                fontFamily: typo.headingFontFamily
                            }}
                        >
                            <Volume2 size={13} color="var(--ui-accent, #10b981)" />
                            <span>Placeholder de Audio • Resumen hablado de {page.label}</span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                            {audioPlaying
                                ? 'Narración en curso (00:18 / 01:30)...'
                                : 'Escuchá la explicación rápida en audio mientras recorrés la pantalla.'}
                        </div>
                    </div>
                </div>

                {/* BARRA DE PROGRESO DE AUDIO Y DURACIÓN */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <div
                        style={{
                            width: '110px',
                            height: '4px',
                            borderRadius: '999px',
                            background: 'rgba(148, 163, 184, 0.2)',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                width: audioPlaying ? '35%' : '0%',
                                height: '100%',
                                background: 'var(--ui-accent, #10b981)',
                                transition: 'width 0.25s ease'
                            }}
                        />
                    </div>
                    <span
                        style={{
                            fontSize: '11px',
                            color: '#94a3b8',
                            fontFamily: 'var(--font-mono)'
                        }}
                    >
                        {audioPlaying ? '00:18 / 01:30' : '00:00 / 01:30'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function UserGuideView({ typoPresetOverride = null, compactHeight = false }) {
    const [activePageId, setActivePageId] = useState('home');
    const [activeSectionId, setActiveSectionId] = useState('home-canvas');
    const [menuLevel, setMenuLevel] = useState(1);
    const [openNodes, setOpenNodes] = useState({
        home: false,
        markets: true,
        'mkt-screener': false,
        'mkt-analytics': false,
        'mkt-research': false,
        portfolio: true,
        'port-v1': false,
        'port-v2': false,
        'port-v3': false
    });
    const [modalSection, setModalSection] = useState(null);
    const [modalTabIdx, setModalTabIdx] = useState(0);
    const [savedTypo, setSavedTypo] = useState(() => getSavedGuideTypoPreset());

    useEffect(() => {
        const onStorage = () => setSavedTypo(getSavedGuideTypoPreset());
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    useEffect(() => {
        if (!modalSection) return undefined;
        const onKeyDown = e => {
            if (e.key === 'Escape') setModalSection(null);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [modalSection]);

    const typo = typoPresetOverride || savedTypo;

    const contentScrollRef = useRef(null);
    const leftMenuScrollRef = useRef(null);
    const sectionRefs = useRef({});
    const programmaticScrollLockRef = useRef(false);

    const activePageIdx = ALL_GUIDE_PAGES.findIndex(p => p.id === activePageId);
    const activePage = ALL_GUIDE_PAGES[activePageIdx] || ALL_GUIDE_PAGES[0];
    const prevPage =
        activePageIdx > 0
            ? ALL_GUIDE_PAGES[activePageIdx - 1]
            : ALL_GUIDE_PAGES[ALL_GUIDE_PAGES.length - 1];
    const nextPage =
        activePageIdx < ALL_GUIDE_PAGES.length - 1
            ? ALL_GUIDE_PAGES[activePageIdx + 1]
            : ALL_GUIDE_PAGES[0];

    const viewportHeightCalc = compactHeight ? 'calc(100vh - 185px)' : 'calc(100vh - 108px)';

    /* ── CÁLCULO DE LA SECCIÓN ACTIVA AL ESCROLEAR:
          - Se ilumina SÓLO UN ÍTEM A LA VEZ.
          - Es el ítem que está más abajo entre los que aparecen en pantalla. ── */
    const computeActiveSectionOnScroll = useCallback(() => {
        if (programmaticScrollLockRef.current) return;

        const container = contentScrollRef.current;
        if (!container || !activePage?.sections?.length) return;

        /* Si el usuario está arriba del todo sin haber escroleado, marcamos la primera sección */
        if (container.scrollTop <= 14) {
            setActiveSectionId(activePage.sections[0].id);
            return;
        }

        const cRect = container.getBoundingClientRect();
        const viewTop = cRect.top + 24;
        const viewBottom = cRect.bottom - 44;

        const visibleOnScreen = [];

        activePage.sections.forEach(sec => {
            const el = sectionRefs.current[sec.id];
            if (!el) return;
            const sRect = el.getBoundingClientRect();
            if (sRect.top < viewBottom && sRect.bottom > viewTop) {
                visibleOnScreen.push(sec.id);
            }
        });

        /* Elegimos únicamente el último (el que está más abajo de los que aparecen en pantalla) */
        if (visibleOnScreen.length > 0) {
            const lowestVisibleId = visibleOnScreen[visibleOnScreen.length - 1];
            setActiveSectionId(lowestVisibleId);
        }
    }, [activePage]);

    useEffect(() => {
        const container = contentScrollRef.current;
        if (!container) return undefined;

        container.addEventListener('scroll', computeActiveSectionOnScroll, { passive: true });
        window.addEventListener('resize', computeActiveSectionOnScroll);
        return () => {
            container.removeEventListener('scroll', computeActiveSectionOnScroll);
            window.removeEventListener('resize', computeActiveSectionOnScroll);
        };
    }, [computeActiveSectionOnScroll]);

    /* ── BOTÓN ÚNICO QUE INDICA EL ESTADO ACTUAL DEL MENÚ Y CICLA (0 → 1 → 2 → 0) ── */
    const handleCycleMenuLevel = () => {
        const nextLevel = (menuLevel + 1) % 3;
        setMenuLevel(nextLevel);

        if (nextLevel === 0) {
            setOpenNodes({
                home: false,
                markets: false,
                'mkt-screener': false,
                'mkt-analytics': false,
                'mkt-research': false,
                portfolio: false,
                'port-v1': false,
                'port-v2': false,
                'port-v3': false
            });
        } else if (nextLevel === 1) {
            setOpenNodes({
                home: false,
                markets: true,
                'mkt-screener': false,
                'mkt-analytics': false,
                'mkt-research': false,
                portfolio: true,
                'port-v1': false,
                'port-v2': false,
                'port-v3': false
            });
        } else {
            setOpenNodes({
                home: true,
                markets: true,
                'mkt-screener': true,
                'mkt-analytics': true,
                'mkt-research': true,
                portfolio: true,
                'port-v1': true,
                'port-v2': true,
                'port-v3': true
            });
        }
    };

    const handleSelectPage = (page) => {
        programmaticScrollLockRef.current = true;
        setActivePageId(page.id);
        setActiveSectionId(page.sections[0]?.id);
        setOpenNodes(prev => ({
            ...prev,
            ...(page.id.startsWith('mkt-') ? { markets: true } : {}),
            ...(page.id.startsWith('port-') ? { portfolio: true } : {})
        }));
        if (contentScrollRef.current) {
            contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setTimeout(() => {
            programmaticScrollLockRef.current = false;
        }, 420);
    };

    const handleSelectSection = (pageId, sectionId) => {
        programmaticScrollLockRef.current = true;
        setActiveSectionId(sectionId);
        setOpenNodes(prev => ({
            ...prev,
            [pageId]: true,
            ...(pageId.startsWith('mkt-') ? { markets: true } : {}),
            ...(pageId.startsWith('port-') ? { portfolio: true } : {})
        }));

        if (pageId !== activePageId) {
            setActivePageId(pageId);
            setTimeout(() => {
                const el = sectionRefs.current[sectionId];
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
        } else {
            const el = sectionRefs.current[sectionId];
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setTimeout(() => {
            programmaticScrollLockRef.current = false;
        }, 480);
    };

    const renderPageAndSections = (page, depth = 0) => {
        const isPageActive = page.id === activePageId;
        const isOpen = !!openNodes[page.id];

        return (
            <div key={page.id}>
                <button
                    onClick={() => {
                        setOpenNodes(prev => ({ ...prev, [page.id]: !prev[page.id] }));
                        if (page.id !== activePageId) {
                            handleSelectPage(page);
                        }
                    }}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: `7px 10px 7px ${10 + depth * 14}px`,
                        border: isPageActive
                            ? '1px solid var(--ui-accent, #10b981)'
                            : '1px solid transparent',
                        background: isPageActive
                            ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.14)'
                            : 'transparent',
                        color: isPageActive ? '#ffffff' : '#cbd5e1',
                        fontSize: '13px',
                        fontWeight: isPageActive ? 600 : 400,
                        fontFamily: typo.headingFontFamily,
                        borderRadius: '7px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                    }}
                >
                    <span>{page.label}</span>
                </button>

                {isOpen && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: `${16 + depth * 14}px`,
                            borderLeft: '1px solid rgba(148, 163, 184, 0.16)',
                            marginTop: '2px',
                            marginBottom: '4px'
                        }}
                    >
                        {page.sections.map(sec => {
                            const isSecActive = isPageActive && activeSectionId === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => handleSelectSection(page.id, sec.id)}
                                    style={{
                                        padding: '5px 12px',
                                        border: 'none',
                                        borderLeft: isSecActive
                                            ? '2px solid var(--ui-accent, #10b981)'
                                            : '2px solid transparent',
                                        marginLeft: '-1px',
                                        background: isSecActive
                                            ? 'rgba(var(--ui-accent-rgb, 16,185,129), 0.12)'
                                            : 'transparent',
                                        color: isSecActive ? '#ffffff' : '#94a3b8',
                                        fontSize: '12px',
                                        fontWeight: isSecActive ? 600 : 400,
                                        fontFamily: typo.headingFontFamily,
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.14s ease'
                                    }}
                                >
                                    {sec.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            style={{
                height: viewportHeightCalc,
                overflow: 'hidden',
                background: 'transparent',
                color: typo.bodyColor,
                fontFamily: typo.fontFamily,
                WebkitFontSmoothing: typo.fontSmoothing,
                padding: '8px 24px 0'
            }}
        >
            <div
                style={{
                    maxWidth: '1380px',
                    height: '100%',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: '235px minmax(0, 1fr) 215px',
                    gap: '32px',
                    alignItems: 'stretch',
                    background: 'transparent'
                }}
            >
                {/* ══════════════════════════════════════════════════════════════
                    1. MENÚ LATERAL IZQUIERDO CON SCROLL VERTICAL INDEPENDIENTE
                   ══════════════════════════════════════════════════════════════ */}
                <aside
                    style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        paddingRight: '10px',
                        borderRight: '1px solid rgba(148, 163, 184, 0.12)',
                        minHeight: 0
                    }}
                >
                    <div
                        style={{
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 4px 10px',
                            borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
                            marginBottom: '8px'
                        }}
                    >
                        <button
                            onClick={handleCycleMenuLevel}
                            title="Click para alternar el nivel del árbol"
                            style={{
                                width: '100%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid rgba(148, 163, 184, 0.2)',
                                background: 'transparent',
                                color: '#e2e8f0',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                fontFamily: typo.headingFontFamily,
                                cursor: 'pointer'
                            }}
                        >
                            {LEVEL_LABELS[menuLevel]}
                        </button>
                    </div>

                    <div
                        ref={leftMenuScrollRef}
                        style={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: 'auto',
                            paddingRight: '4px',
                            paddingBottom: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px'
                        }}
                    >
                        {GUIDE_TREE_PAGES.map(topNode => {
                            if (topNode.isPage) {
                                return renderPageAndSections(topNode, 0);
                            }

                            const isGroupOpen = !!openNodes[topNode.id];
                            return (
                                <div key={topNode.id}>
                                    <button
                                        onClick={() =>
                                            setOpenNodes(prev => ({
                                                ...prev,
                                                [topNode.id]: !prev[topNode.id]
                                            }))
                                        }
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '8px 10px',
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#f8fafc',
                                            fontSize: '13.5px',
                                            fontWeight: 600,
                                            fontFamily: typo.headingFontFamily,
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span>{topNode.label}</span>
                                    </button>

                                    {isGroupOpen && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            {topNode.children.map(childPage =>
                                                renderPageAndSections(childPage, 1)
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* ══════════════════════════════════════════════════════════════
                    2. COLUMNA CENTRAL DE LECTURA CLARA Y PRÁCTICA
                   ══════════════════════════════════════════════════════════════ */}
                <main
                    ref={contentScrollRef}
                    style={{
                        height: '100%',
                        overflowY: 'auto',
                        paddingRight: '18px',
                        paddingBottom: '64px',
                        background: 'transparent'
                    }}
                >
                    <div
                        style={{
                            maxWidth: '750px',
                            letterSpacing: typo.letterSpacing
                        }}
                    >
                        {/* BREADCRUMB SUPERIOR */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12.5px',
                                color: '#94a3b8',
                                fontFamily: typo.headingFontFamily,
                                marginBottom: '10px'
                            }}
                        >
                            <span style={{ color: 'var(--ui-accent, #10b981)', fontWeight: 500 }}>
                                Guide
                            </span>
                            {activePage.groupLabel && (
                                <>
                                    <span style={{ color: '#475569' }}>/</span>
                                    <span style={{ color: 'var(--ui-accent, #10b981)', fontWeight: 500 }}>
                                        {activePage.groupLabel}
                                    </span>
                                </>
                            )}
                            <span style={{ color: '#475569' }}>/</span>
                            <span style={{ color: '#cbd5e1' }}>{activePage.label}</span>
                        </div>

                        {/* TÍTULO H1 PRINCIPAL */}
                        <h1
                            style={{
                                margin: '0 0 18px',
                                paddingBottom: '16px',
                                borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
                                fontSize: typo.h1Size,
                                fontWeight: 700,
                                fontFamily: typo.headingFontFamily,
                                color: typo.headingColor,
                                letterSpacing: '-0.02em',
                                lineHeight: 1.22
                            }}
                        >
                            {activePage.label}
                        </h1>

                        {/* INTRODUCCIÓN DE PARA QUÉ SIRVE LA VISTA */}
                        {(activePage.introParagraphs || [activePage.intro]).map((pText, idx) => (
                            <p
                                key={idx}
                                style={{
                                    margin: '0 0 16px',
                                    fontSize: typo.bodySize,
                                    color: typo.bodyColor,
                                    lineHeight: typo.lineHeight
                                }}
                            >
                                {pText}
                            </p>
                        ))}

                        {/* SÍNTESIS EN VIÑETAS */}
                        <p
                            style={{
                                margin: '0 0 10px',
                                fontSize: typo.bulletSize,
                                color: typo.headingColor,
                                fontWeight: 600
                            }}
                        >
                            En esta sección vas a encontrar:
                        </p>

                        <ul
                            style={{
                                margin: '0 0 38px',
                                paddingLeft: '22px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '9px',
                                fontSize: typo.bulletSize,
                                color: typo.bodyColor,
                                lineHeight: typo.lineHeight
                            }}
                        >
                            {activePage.sections.map(sec => (
                                <li key={sec.id}>
                                    <button
                                        onClick={() => handleSelectSection(activePage.id, sec.id)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            padding: 0,
                                            color: 'var(--ui-accent, #10b981)',
                                            fontWeight: 600,
                                            fontSize: typo.bulletSize,
                                            fontFamily: typo.fontFamily,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {sec.label}
                                    </button>
                                    <span>. {sec.summary}</span>
                                </li>
                            ))}
                        </ul>

                        {/* PLACEHOLDER DE VIDEO Y AUDIO (ESTILO DOCKER DOCS) */}
                        <GuideMediaPlaceholder page={activePage} typo={typo} />

                        {/* SECCIONES DE LECTURA CONTINUA */}
                        {activePage.sections.map(sec => (
                            <section
                                key={sec.id}
                                ref={el => {
                                    sectionRefs.current[sec.id] = el;
                                }}
                                style={{
                                    marginBottom: '44px',
                                    scrollMarginTop: '16px'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '12px',
                                        marginBottom: '12px'
                                    }}
                                >
                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: typo.h2Size,
                                            fontWeight: 700,
                                            fontFamily: typo.headingFontFamily,
                                            color: typo.headingColor,
                                            letterSpacing: '-0.01em'
                                        }}
                                    >
                                        {sec.label}
                                    </h2>

                                    {sec.hasTechnicalModal && (
                                        <button
                                            onClick={() => {
                                                setModalTabIdx(0);
                                                setModalSection(sec);
                                            }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                border: '1px solid rgba(148, 163, 184, 0.22)',
                                                background: 'rgba(255, 255, 255, 0.04)',
                                                color: 'var(--ui-accent, #10b981)',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                fontFamily: typo.headingFontFamily,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Maximize2 size={12} />
                                            Profundizar
                                        </button>
                                    )}
                                </div>

                                {(sec.paragraphs || [sec.lead]).map((pText, pIdx) => (
                                    <p
                                        key={pIdx}
                                        style={{
                                            margin: '0 0 14px',
                                            fontSize: typo.bodySize,
                                            color: typo.bodyColor,
                                            lineHeight: typo.lineHeight
                                        }}
                                    >
                                        {pText}
                                    </p>
                                ))}

                                <ul
                                    style={{
                                        margin: 0,
                                        paddingLeft: '22px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '13px'
                                    }}
                                >
                                    {sec.bullets.map((b, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                fontSize: typo.bulletSize,
                                                color: typo.bodyColor,
                                                lineHeight: typo.lineHeight
                                            }}
                                        >
                                            <strong style={{ color: typo.boldColor, fontWeight: 600 }}>
                                                {b.bold.replace(/\.$/, '')}
                                                {b.code ? ` (${b.code})` : ''}.
                                            </strong>{' '}
                                            <span>{b.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}

                        {/* NAVEGACIÓN INFERIOR EN LA MISMA LÍNEA: ANTERIOR (IZQUIERDA) Y SIGUIENTE (DERECHA) */}
                        <div
                            style={{
                                marginTop: '48px',
                                paddingTop: '24px',
                                borderTop: '1px solid rgba(148, 163, 184, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '16px',
                                flexWrap: 'wrap'
                            }}
                        >
                            <button
                                onClick={() => handleSelectPage(prevPage)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '9px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(148, 163, 184, 0.25)',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    color: '#e2e8f0',
                                    fontSize: '13.5px',
                                    fontWeight: 600,
                                    fontFamily: typo.headingFontFamily,
                                    cursor: 'pointer'
                                }}
                            >
                                <ArrowLeft size={14} />
                                <span>Anterior: {prevPage.label}</span>
                            </button>

                            <button
                                onClick={() => handleSelectPage(nextPage)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '9px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(var(--ui-accent-rgb), 0.45)',
                                    background: 'rgba(var(--ui-accent-rgb), 0.16)',
                                    color: '#ffffff',
                                    fontSize: '13.5px',
                                    fontWeight: 600,
                                    fontFamily: typo.headingFontFamily,
                                    cursor: 'pointer'
                                }}
                            >
                                <span>Siguiente: {nextPage.label}</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </main>

                {/* ══════════════════════════════════════════════════════════════
                    3. ÍNDICE DERECHO "EN ESTA PÁGINA"
                       - Ilumina únicamente el ítem activo (el más bajo en pantalla)
                   ══════════════════════════════════════════════════════════════ */}
                <aside
                    style={{
                        height: '100%',
                        overflowY: 'auto',
                        paddingTop: '4px'
                    }}
                >
                    <div
                        style={{
                            fontSize: '13.5px',
                            fontWeight: 700,
                            fontFamily: typo.headingFontFamily,
                            color: '#ffffff',
                            marginBottom: '10px',
                            paddingLeft: '12px'
                        }}
                    >
                        En esta página
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            borderLeft: '1px solid rgba(148, 163, 184, 0.14)'
                        }}
                    >
                        {activePage.sections.map(sec => {
                            const isCurrent = activeSectionId === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => handleSelectSection(activePage.id, sec.id)}
                                    style={{
                                        padding: '6px 12px',
                                        border: 'none',
                                        borderLeft: isCurrent
                                            ? '2px solid var(--ui-accent, #10b981)'
                                            : '2px solid transparent',
                                        marginLeft: '-1px',
                                        background: isCurrent
                                            ? 'rgba(var(--ui-accent-rgb, 16,185,129), 0.12)'
                                            : 'transparent',
                                        color: isCurrent ? '#ffffff' : '#94a3b8',
                                        fontSize: '12.5px',
                                        fontWeight: isCurrent ? 600 : 400,
                                        fontFamily: typo.headingFontFamily,
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.14s ease'
                                    }}
                                >
                                    {sec.label}
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>

            {/* VENTANA EMERGENTE TÉCNICA (PROFUNDIZAR) RENDERIZADA EN PORTAL PARA BLOQUEAR EL RESTO DE LA PANTALLA IGUAL QUE IDIOMA */}
            {modalSection &&
                typeof document !== 'undefined' &&
                createPortal(
                    (() => {
                        const modalTabs =
                            modalSection.modalTabs || GUIDE_MODALS_BY_SECTION[modalSection.id] || [];
                        const activeTab = modalTabs[modalTabIdx] || modalTabs[0] || null;

                        return (
                            <div
                                onMouseDown={e => {
                                    if (e.target === e.currentTarget) setModalSection(null);
                                }}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    backgroundColor: 'rgba(4, 7, 14, 0.80)',
                                    backdropFilter: 'blur(9px)',
                                    zIndex: 9999,
                                    pointerEvents: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '20px',
                                    fontFamily: typo.fontFamily,
                                    WebkitFontSmoothing: typo.fontSmoothing
                                }}
                            >
                                <div
                                    style={{
                                        width: 'min(760px, 95vw)',
                                        maxHeight: '88vh',
                                        overflow: 'hidden',
                                        background: 'rgba(13, 19, 32, 0.98)',
                                        border: '1px solid rgba(148, 163, 184, 0.24)',
                                        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
                                        borderRadius: '12px',
                                        padding: '22px 26px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px',
                                        letterSpacing: typo.letterSpacing
                                    }}
                                >
                                    {/* CABECERA FIJA DEL MODAL CON LA X ARRIBA A LA DERECHA */}
                                    <div
                                        style={{
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-between',
                                            gap: '12px'
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: 'var(--ui-accent, #10b981)',
                                                    fontFamily: typo.headingFontFamily
                                                }}
                                            >
                                                Profundizar • {activePage.label}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '21px',
                                                    fontWeight: 700,
                                                    color: '#ffffff',
                                                    fontFamily: typo.headingFontFamily,
                                                    marginTop: '2px'
                                                }}
                                            >
                                                {modalSection.label}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setModalSection(null)}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.06)',
                                                border: '1px solid rgba(255, 255, 255, 0.14)',
                                                color: '#94a3b8',
                                                borderRadius: '8px',
                                                width: '28px',
                                                height: '28px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                flexShrink: 0
                                            }}
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>

                                    {activeTab ? (
                                        <>
                                            {/* PESTAÑAS V010 GHOST (TEXTO FLOTANTE CON BRILLO SIN SUBRAYADO NI CAJA) */}
                                            <div
                                                style={{
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '26px',
                                                    flexWrap: 'wrap',
                                                    padding: '4px 0 8px'
                                                }}
                                            >
                                                {modalTabs.map((tab, idx) => {
                                                    const isTabActive = modalTabIdx === idx;
                                                    return (
                                                        <button
                                                            key={tab.id}
                                                            onClick={() => setModalTabIdx(idx)}
                                                            style={{
                                                                padding: '4px 6px',
                                                                background: 'transparent',
                                                                border: 'none',
                                                                color: isTabActive
                                                                    ? 'var(--ui-accent, #10b981)'
                                                                    : 'rgba(148, 163, 184, 0.62)',
                                                                textShadow: isTabActive
                                                                    ? '0 0 15px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.88)'
                                                                    : 'none',
                                                                fontSize: '13.5px',
                                                                fontWeight: isTabActive ? 800 : 600,
                                                                fontFamily: typo.headingFontFamily,
                                                                cursor: 'pointer',
                                                                transition: 'all 0.16s ease'
                                                            }}
                                                        >
                                                            {tab.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* CUERPO CON SCROLL VERTICAL PROPIO (SIN COLAPSAR ELEMENTOS FLEX) */}
                                            <div
                                                style={{
                                                    flex: 1,
                                                    minHeight: 0,
                                                    overflowY: 'auto',
                                                    paddingRight: '6px',
                                                    paddingBottom: '4px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '16px'
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        flexShrink: 0,
                                                        margin: 0,
                                                        fontSize: typo.bodySize,
                                                        color: typo.bodyColor,
                                                        lineHeight: typo.lineHeight
                                                    }}
                                                >
                                                    {activeTab.intro}
                                                </p>

                                                {/* FÓRMULA MATEMÁTICA ESTRUCTURADA */}
                                                <MathFormulaBox
                                                    math={activeTab.math}
                                                    formula={activeTab.formula}
                                                    typo={typo}
                                                />

                                                {activeTab.lead && (
                                                    <p
                                                        style={{
                                                            flexShrink: 0,
                                                            margin: 0,
                                                            fontSize: typo.bodySize,
                                                            color: typo.bodyColor,
                                                            lineHeight: typo.lineHeight
                                                        }}
                                                    >
                                                        {activeTab.lead}
                                                    </p>
                                                )}

                                                {activeTab.bullets?.length > 0 && (
                                                    <ul
                                                        style={{
                                                            flexShrink: 0,
                                                            margin: 0,
                                                            paddingLeft: '22px',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '10px'
                                                        }}
                                                    >
                                                        {activeTab.bullets.map((b, i) => (
                                                            <li
                                                                key={i}
                                                                style={{
                                                                    fontSize: typo.bulletSize,
                                                                    color: typo.bodyColor,
                                                                    lineHeight: typo.lineHeight
                                                                }}
                                                            >
                                                                <strong style={{ color: typo.boldColor, fontWeight: 600 }}>
                                                                    {b.bold.replace(/\.$/, '')}
                                                                    {b.code ? ` (${b.code})` : ''}.
                                                                </strong>{' '}
                                                                <span>{b.text}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {activeTab.example && (
                                                    <div
                                                        style={{
                                                            flexShrink: 0,
                                                            padding: '12px 14px',
                                                            borderRadius: '8px',
                                                            background: 'rgba(255, 255, 255, 0.03)',
                                                            borderLeft: '3px solid var(--ui-accent, #10b981)',
                                                            fontSize: typo.bulletSize,
                                                            color: typo.bodyColor,
                                                            lineHeight: typo.lineHeight
                                                        }}
                                                    >
                                                        <strong style={{ color: '#ffffff' }}>Ejemplo práctico: </strong>
                                                        {activeTab.example}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            style={{
                                                padding: '14px 16px',
                                                borderRadius: '8px',
                                                background: 'rgba(2, 6, 23, 0.75)',
                                                border: '1px solid rgba(148, 163, 184, 0.16)',
                                                fontSize: '14px',
                                                color: typo.bodyColor,
                                                lineHeight: 1.68
                                            }}
                                        >
                                            {modalSection.modalPreview}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })(),
                    document.body
                )}
        </div>
    );
}
