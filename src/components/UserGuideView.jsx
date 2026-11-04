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
import GuideInteractiveVideoStage from './guide/GuideInteractiveVideoStage';

const getLevelLabels = (isES) => ({
    0: isES ? 'Vista Colapsada' : 'Collapsed View',
    1: isES ? 'Vista Principal' : 'Main View',
    2: isES ? 'Vista Expandida' : 'Expanded View'
});

/* ── COMPONENTE DE FÓRMULA MATEMÁTICA ESTRUCTURADA (FRACCIONES REALES + LEYENDA) ── */
function MathFormulaBox({ math, formula, typo, isES = false }) {
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
                {isES ? 'Fórmula Matemática' : 'Mathematical Formula'}
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

/* ── PERSONAJE 4D ANIMADO CON LIP-SYNC EN TIEMPO REAL, PARPADEO, MIRADA DIRIGIDA Y ÓRBITA ── */
function AnimatedOrb4DCharacter({
    size = 215,
    isSpeaking = false,
    speechEnergy = 0,
    currentTime = 0,
    lookAtX = null,
    lookAtY = null
}) {
    const [phase, setPhase] = useState(0);
    const [isBlinking, setIsBlinking] = useState(false);

    // Loop suave de animación (levitación + satélites orbitales)
    useEffect(() => {
        let rafId;
        const start = performance.now();
        const tick = (now) => {
            setPhase((now - start) / 1000);
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Parpadeo orgánico cada ~2.8 - 4.2 segundos
    useEffect(() => {
        let timeoutId;
        const scheduleBlink = () => {
            const delay = 2600 + Math.random() * 1800;
            timeoutId = setTimeout(() => {
                setIsBlinking(true);
                setTimeout(() => {
                    setIsBlinking(false);
                    scheduleBlink();
                }, 130);
            }, delay);
        };
        scheduleBlink();
        return () => clearTimeout(timeoutId);
    }, []);

    // Levitación vertical suave
    const floatY = Math.sin(phase * 2.2) * 3.2;

    // Posición de los 2 satélites sobre la elipse orbital inclinada (-12 deg, rx=74, ry=21)
    const angle1 = phase * (isSpeaking ? 1.85 : 0.85);
    const angle2 = angle1 + Math.PI;
    const tiltRad = (-12 * Math.PI) / 180;
    const calcSat = (theta) => {
        const ex = 74 * Math.cos(theta);
        const ey = 21 * Math.sin(theta);
        return {
            x: 80 + ex * Math.cos(tiltRad) - ey * Math.sin(tiltRad),
            y: 82 + ex * Math.sin(tiltRad) + ey * Math.cos(tiltRad),
            inFront: Math.sin(theta) >= 0
        };
    };
    const sat1 = calcSat(angle1);
    const sat2 = calcSat(angle2);

    // Dirección sutil de la mirada hacia la zona activa de la pantalla
    const gazeX =
        typeof lookAtX === 'number'
            ? lookAtX + Math.sin(phase * 1.6) * 0.45
            : isSpeaking
            ? Math.sin(phase * 1.9) * 2.2
            : Math.sin(phase * 0.7) * 1.1;
    const gazeY =
        typeof lookAtY === 'number'
            ? lookAtY + Math.cos(phase * 1.4) * 0.35
            : isSpeaking && currentTime > 10 && currentTime < 22
            ? -2.0
            : isSpeaking && currentTime >= 22
            ? 2.0
            : Math.cos(phase * 1.1) * 0.8;

    // Geometría de la boca sincronizada con la voz (Lip-Sync)
    const energy = isSpeaking ? Math.max(0.08, Math.min(1, speechEnergy)) : 0;
    const mouthOpen = energy * 11.5;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 160 160"
            fill="none"
            style={{
                filter: isSpeaking
                    ? `drop-shadow(0 0 ${10 + Math.round(energy * 14)}px rgba(16, 185, 129, 0.45))`
                    : 'drop-shadow(0 6px 16px rgba(0, 0, 0, 0.55))',
                transition: 'filter 0.12s ease'
            }}
        >
            <defs>
                <radialGradient id="orbCore4DAnim" cx="36%" cy="32%" r="68%">
                    <stop offset="0%" stopColor={isSpeaking ? 'rgba(16, 185, 129, 0.58)' : 'rgba(16, 185, 129, 0.42)'} />
                    <stop offset="60%" stopColor="rgba(5, 14, 26, 0.96)" />
                    <stop offset="100%" stopColor="#020617" />
                </radialGradient>
                <linearGradient id="iconGoldGreenAnim" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a7f3d0" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
            </defs>

            <g transform={`translate(0, ${floatY.toFixed(2)})`}>
                {/* Halo exterior reactivo a la voz */}
                <circle
                    cx="80"
                    cy="80"
                    r={64 + energy * 4.5}
                    stroke="rgba(16, 185, 129, 0.28)"
                    strokeWidth={1.2 + energy * 1.2}
                    strokeDasharray="3 5"
                />

                {/* Satélites cuando pasan por detrás de la esfera */}
                {!sat1.inFront && <circle cx={sat1.x} cy={sat1.y} r="4.2" fill="#a7f3d0" opacity="0.55" />}
                {!sat2.inFront && <circle cx={sat2.x} cy={sat2.y} r="3.5" fill="#10b981" opacity="0.55" />}

                {/* Anillo orbital inclinado */}
                <ellipse
                    cx="80"
                    cy="82"
                    rx="74"
                    ry="21"
                    transform="rotate(-12 80 82)"
                    stroke="#10b981"
                    strokeWidth="2.2"
                    opacity="0.85"
                />

                {/* Esfera principal de cristal */}
                <circle
                    cx="80"
                    cy="80"
                    r="55"
                    fill="url(#orbCore4DAnim)"
                    stroke="#6ee7b7"
                    strokeWidth={2.4 + energy * 0.8}
                />

                {/* El ícono cincelado grande y nítido en el centro exacto (late suavemente al hablar) */}
                <g opacity={0.85 + energy * 0.15}>
                    <polygon
                        points="56,34 76,34 116,108 98,108"
                        fill="url(#iconGoldGreenAnim)"
                        opacity={0.55 + energy * 0.22}
                        stroke="#a7f3d0"
                        strokeWidth="1.6"
                    />
                    <polygon
                        points="80,72 91,87 68,108 50,108"
                        fill="url(#iconGoldGreenAnim)"
                        opacity={0.48 + energy * 0.22}
                        stroke="#6ee7b7"
                        strokeWidth="1.4"
                    />
                    <polygon
                        points={`48,${(34 - energy * 1.8).toFixed(1)} 76,${(34 - energy * 1.8).toFixed(1)} 66,${(46 - energy * 1.8).toFixed(1)} 48,${(46 - energy * 1.8).toFixed(1)}`}
                        fill="#a7f3d0"
                        opacity="0.92"
                    />
                </g>

                {/* Ojos expresivos con parpadeo y seguimiento de mirada */}
                <g
                    style={{
                        transformOrigin: '80px 67px',
                        transform: `scaleY(${isBlinking ? 0.12 : 1})`,
                        transition: 'transform 0.06s ease'
                    }}
                >
                    <rect x="52" y="56" width="16" height="22" rx="8" fill="#020617" stroke="#6ee7b7" strokeWidth="1.8" />
                    <rect x="92" y="56" width="16" height="22" rx="8" fill="#020617" stroke="#6ee7b7" strokeWidth="1.8" />
                    <rect
                        x={55 + gazeX * 0.7}
                        y={59 + gazeY * 0.7}
                        width="10"
                        height="15"
                        rx="5"
                        fill="#10b981"
                    />
                    <rect
                        x={95 + gazeX * 0.7}
                        y={59 + gazeY * 0.7}
                        width="10"
                        height="15"
                        rx="5"
                        fill="#10b981"
                    />
                    <circle cx={62 + gazeX} cy={64 + gazeY} r="2.8" fill="#ffffff" />
                    <circle cx={102 + gazeX} cy={64 + gazeY} r="2.8" fill="#ffffff" />
                </g>

                {/* BOCA SINCRONIZADA CON LA VOZ (LIP-SYNC) */}
                {isSpeaking && energy > 0.12 ? (
                    <g>
                        {/* Labio superior e inferior abriéndose al ritmo de las sílabas */}
                        <path
                            d={`M 64 95 Q 80 ${(93 - mouthOpen * 0.35).toFixed(1)} 96 95 Q 80 ${(99 + mouthOpen * 1.25).toFixed(1)} 64 95 Z`}
                            fill="rgba(2, 6, 23, 0.9)"
                            stroke="#ffffff"
                            strokeWidth="2.6"
                            strokeLinejoin="round"
                        />
                        {/* Onda luminosa interna dentro de la boca mientras articula */}
                        <path
                            d={`M 69 96 L 74 ${(96 - mouthOpen * 0.35).toFixed(1)} L 80 ${(96 + mouthOpen * 0.45).toFixed(1)} L 86 ${(96 - mouthOpen * 0.35).toFixed(1)} L 91 96`}
                            stroke="#6ee7b7"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />
                    </g>
                ) : (
                    <path
                        d="M64 95 Q80 107 96 95"
                        stroke="#ffffff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                    />
                )}

                {/* Satélites cuando pasan por delante de la esfera */}
                {sat1.inFront && <circle cx={sat1.x} cy={sat1.y} r="5.2" fill="#a7f3d0" stroke="#020617" strokeWidth="1" />}
                {sat2.inFront && <circle cx={sat2.x} cy={sat2.y} r="4.2" fill="#10b981" stroke="#ffffff" strokeWidth="1" />}
            </g>
        </svg>
    );
}

function formatMediaTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ── RECORRIDO VISUAL EN VIVO + PRESENTADOR 4D + REPRODUCTOR DE AUDIO NEURONAL POR PÁGINA ── */
function GuideMediaPlaceholder({ page, typo, isES = false }) {
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [animClock, setAnimClock] = useState(0);
    const [speechEnergy, setSpeechEnergy] = useState(0);

    const audioRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceNodeRef = useRef(null);

    const pageId = page?.id || 'home';
    const audioSrc = `/guide/audio/${pageId}_${isES ? 'es' : 'en'}.mp3?v=3`;

    useEffect(() => {
        setAudioPlaying(false);
        setCurrentTime(0);
        setSpeechEnergy(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.load();
        }
    }, [pageId, isES]);

    // Reloj de animación continua (órbita 3D, levitación, parpadeo y lip-sync con Web Audio API)
    useEffect(() => {
        let rafId = null;
        const startTs = performance.now();
        const freqData = new Uint8Array(64);

        const tick = (now) => {
            const elapsedSec = (now - startTs) / 1000;
            setAnimClock(elapsedSec);

            if (audioPlaying && audioRef.current && !audioRef.current.paused) {
                const t = audioRef.current.currentTime || elapsedSec;
                let measured = 0;
                if (analyserRef.current) {
                    try {
                        analyserRef.current.getByteFrequencyData(freqData);
                        let sum = 0;
                        const bins = 28;
                        for (let i = 2; i < bins; i++) {
                            sum += freqData[i];
                        }
                        measured = Math.min(1, (sum / ((bins - 2) * 255)) * 2.35);
                    } catch {
                        measured = 0;
                    }
                }
                const syllabic =
                    0.35 +
                    0.32 * Math.sin(t * 19.5) +
                    0.22 * Math.cos(t * 11.3) +
                    0.15 * Math.sin(t * 31.0);
                const pauseGate = Math.sin(t * 2.4) > -0.78 ? 1 : 0.12;
                const fallbackEnergy = Math.max(0.08, Math.min(0.95, syllabic * pauseGate));
                setSpeechEnergy(measured > 0.04 ? Math.max(measured, fallbackEnergy * 0.55) : fallbackEnergy);
            } else {
                setSpeechEnergy(0);
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [audioPlaying]);

    const ensureAudioAnalyser = () => {
        if (!audioRef.current || sourceNodeRef.current) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 128;
            analyser.smoothingTimeConstant = 0.65;
            const src = ctx.createMediaElementSource(audioRef.current);
            src.connect(analyser);
            analyser.connect(ctx.destination);
            audioCtxRef.current = ctx;
            analyserRef.current = analyser;
            sourceNodeRef.current = src;
        } catch {
            // El generador silábico mantiene el lip-sync activo si Web Audio API está restringido
        }
    };

    const handleToggleAudio = () => {
        if (!audioRef.current) return;
        if (audioPlaying) {
            audioRef.current.pause();
            setAudioPlaying(false);
        } else {
            ensureAudioAnalyser();
            if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume().catch(() => {});
            }
            audioRef.current
                .play()
                .then(() => setAudioPlaying(true))
                .catch(() => setAudioPlaying(false));
        }
    };

    const handleJumpToScene = (scene) => {
        if (!audioRef.current) return;
        const targetDur = duration || 38;
        const targetSec = ((scene.startPct + 0.5) / 100) * targetDur;
        audioRef.current.currentTime = targetSec;
        setCurrentTime(targetSec);
        if (!audioPlaying) {
            ensureAudioAnalyser();
            if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume().catch(() => {});
            }
            audioRef.current
                .play()
                .then(() => setAudioPlaying(true))
                .catch(() => setAudioPlaying(false));
        }
    };

    const handleSeek = (e) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audioRef.current.currentTime = ratio * duration;
        setCurrentTime(ratio * duration);
    };

    const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

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
            {/* 1. ESCENARIO VISUAL INTERACTIVO 16:9 CON LA VISTA REAL DE LA APP + ORBE 4D */}
            <GuideInteractiveVideoStage
                page={page}
                typo={typo}
                isES={isES}
                audioPlaying={audioPlaying}
                currentTime={currentTime}
                progressPct={progressPct}
                animClock={animClock}
                speechEnergy={speechEnergy}
                onToggleAudio={handleToggleAudio}
                onJumpToScene={handleJumpToScene}
                OrbCharacterComponent={AnimatedOrb4DCharacter}
            />

            {/* 2. REPRODUCTOR DE AUDIO NEURONAL MULTILINGÜE (AVA MULTILINGUAL) */}
            <audio
                ref={audioRef}
                src={audioSrc}
                preload="metadata"
                onLoadedMetadata={e => setDuration(e.currentTarget.duration || 0)}
                onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime || 0)}
                onEnded={() => {
                    setAudioPlaying(false);
                    setCurrentTime(0);
                }}
            />
            <div
                style={{
                    padding: '11px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    background: 'rgba(2, 6, 23, 0.55)'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        flexWrap: 'wrap'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <button
                            type="button"
                            onClick={handleToggleAudio}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '999px',
                                border: '1px solid rgba(var(--ui-accent-rgb, 16, 185, 129), 0.55)',
                                background: audioPlaying
                                    ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.28)'
                                    : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.14)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                                boxShadow: audioPlaying ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.4)' : 'none'
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
                                <span>
                                    {isES
                                        ? `Recorrido narrado de ${page.label} • Presentador 4D + Voz Neuronal Bilingüe`
                                        : `Spoken walkthrough of ${page.label} • 4D Presenter + Neural Voice`}
                                </span>
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                                {audioPlaying
                                    ? isES
                                        ? `Reproduciendo explicación sincronizada (${formatMediaTime(currentTime)} / ${formatMediaTime(duration || 38)})...`
                                        : `Playing synchronized walkthrough (${formatMediaTime(currentTime)} / ${formatMediaTime(duration || 35)})...`
                                    : isES
                                    ? 'Hacé clic en Play o en cualquier capítulo superior para ver y escuchar el recorrido en vivo.'
                                    : 'Click Play or any chapter pill above to watch and listen to the live walkthrough.'}
                            </div>
                        </div>
                    </div>

                    {/* BARRA DE PROGRESO DE AUDIO Y DURACIÓN */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <div
                            onClick={handleSeek}
                            title={isES ? 'Hacé clic para adelantar o retroceder' : 'Click to seek'}
                            style={{
                                width: '130px',
                                height: '6px',
                                borderRadius: '999px',
                                background: 'rgba(148, 163, 184, 0.22)',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}
                        >
                            <div
                                style={{
                                    width: `${progressPct}%`,
                                    height: '100%',
                                    background: 'var(--ui-accent, #10b981)',
                                    transition: 'width 0.1s linear'
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
                            {`${formatMediaTime(currentTime)} / ${formatMediaTime(duration || 38)}`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UserGuideView({ langCode = 'EN', typoPresetOverride = null, compactHeight = false }) {
    const isES = langCode === 'ES';
    const LEVEL_LABELS = getLevelLabels(isES);
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
                            {isES ? 'En esta sección vas a encontrar:' : 'In this section you will find:'}
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
                        <GuideMediaPlaceholder page={activePage} typo={typo} isES={isES} />

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
                                            {isES ? 'Profundizar' : 'Deep Dive'}
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
                                <span>{isES ? 'Anterior' : 'Previous'}: {prevPage.label}</span>
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
                                <span>{isES ? 'Siguiente' : 'Next'}: {nextPage.label}</span>
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
                        {isES ? 'En esta página' : 'On this page'}
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
                                                {isES ? 'Profundizar' : 'Deep Dive'} • {activePage.label}
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
                                                    isES={isES}
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
                                                        <strong style={{ color: '#ffffff' }}>
                                                            {isES ? 'Ejemplo práctico: ' : 'Practical example: '}
                                                        </strong>
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
