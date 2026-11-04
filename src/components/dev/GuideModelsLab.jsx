import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const GUIDE_SECTIONS = [
    { id: 'ALL', label: 'Todas las Guías' },
    { id: 'MARKETS', label: 'Markets (Screener, Analytics & Research)' },
    { id: 'PORTFOLIO', label: 'Portfolio (Las 3 Vistas)' },
    { id: 'ENGINES', label: 'Motores 3D/2D' }
];

const VIDEO_LANGS = [
    { code: 'ES', label: 'Español (IA)', flag: '🇪🇸' },
    { code: 'EN', label: 'English (AI)', flag: '🇺🇸' },
    { code: 'PT', label: 'Português (IA)', flag: '🇧🇷' }
];

const INTERACTIVE_LESSONS = [
    {
        id: 'l-screener',
        group: 'MARKETS',
        title: 'Markets • Screener Global',
        duration: '0:45',
        viewsCount: '4 Modos (Tabla, Orbital, Heatmap, Main Tools)',
        target: '/?view=markets&mode=screener',
        summary: {
            ES: 'Cómo explorar los 213 activos globales, filtrar por las 10 categorías, guardar favoritos en tu ★ Watchlist y detectar anomalías en segundos.',
            EN: 'How to explore all 213 global assets, filter across 10 asset classes, bookmark your ★ Watchlist, and spot market anomalies in seconds.',
            PT: 'Como explorar os 213 ativos globais, filtrar pelas 10 categorias, salvar favoritos na ★ Watchlist e detectar anomalias em segundos.'
        },
        captions: {
            ES: [
                '0:00 — En la barra superior elegís entre Todos los 213 activos, tu ★ Watchlist o cualquiera de las 10 clases de activos.',
                '0:15 — Las 4 tarjetas superiores resumen el volumen 24h, el RSI promedio y cuántos activos están en régimen normal (verde) o dislocación (rojo).',
                '0:30 — Hacé click en cualquier fila para abrir el análisis profundo del activo o tocá la estrella ★ para enviarlo directo a tu Portfolio.'
            ],
            EN: [
                '0:00 — Use the top bar to filter all 213 assets, your ★ Watchlist, or any of the 10 asset classes.',
                '0:15 — The 4 pulse cards summarize 24h volume, average RSI, and how many assets are in normal regime (green) vs dislocation (red).',
                '0:30 — Click any row to open deep asset analytics or star ★ any ticker to sync it immediately with your Portfolio.'
            ],
            PT: [
                '0:00 — Na barra superior escolha entre os 213 ativos, sua ★ Watchlist ou qualquer uma das 10 classes de ativos.',
                '0:15 — Os 4 cartões mostram o volume 24h, o RSI médio e quantos ativos estão em regime normal (verde) ou dislocação (vermelho).',
                '0:30 — Clique em qualquer linha para abrir a análise detalhada ou marque a estrela ★ para sincronizar com seu Portfólio.'
            ]
        },
        steps: [
            'Filtrá por categoría (Acciones, Bonos, FX, Materias Primas, Crypto, etc.) con un click.',
            'Mirá el color verde/rojo para identificar rápidamente ganadores, perdedores y anomalías P-06.',
            'Marcá con ★ los activos que te interesen para probarlos luego en tu cartera.'
        ]
    },
    {
        id: 'l-analytics-research',
        group: 'MARKETS',
        title: 'Markets • Analytics & Research',
        duration: '0:55',
        viewsCount: 'Nivel 2A (Técnico/3D) + Nivel 2B (Noticias/RAG)',
        target: '/?view=markets&mode=detail&asset=NVDA&section=analytics',
        summary: {
            ES: 'Cómo leer la estación técnica del activo (Analytics) y la mesa de sentimiento documental con inteligencia artificial (Research).',
            EN: 'How to read the technical workstation (Analytics) and the AI document & news sentiment desk (Research).',
            PT: 'Como ler a estação técnica do ativo (Analytics) e a mesa de sentimento documental com IA (Research).'
        },
        captions: {
            ES: [
                '0:00 — En Analytics tenés 4 lentes: Análisis Técnico con Bandas de Bollinger, Comparador %, Microestructura y el Motor 3D/2D específico.',
                '0:20 — Al cambiar a Research arriba al centro, ves el puntaje de sentimiento (-100 a +100) y los 5 factores alcistas vs 5 bajistas.',
                '0:40 — A la izquierda podés preguntarle al Chat Documental RAG sobre balances 10-K, reportes de la Fed o inventarios.'
            ],
            EN: [
                '0:00 — In Analytics you get 4 lenses: Technical Chart with Bollinger Bands, % Comparison, Microstructure, and the class-specific 3D/2D Engine.',
                '0:20 — Switch to Research at the top center to inspect the sentiment score (-100 to +100) and the 5 Bull Drivers vs 5 Bear Risks.',
                '0:40 — Use the left RAG Chat to query verified SEC 10-K filings, FOMC statements, or commodity inventory reports.'
            ],
            PT: [
                '0:00 — Em Analytics você tem 4 lentes: Gráfico Técnico, Comparador %, Microestrutura e o Motor 3D/2D da classe.',
                '0:20 — Ao mudar para Research no topo, veja o sentimento (-100 a +100) e os 5 fatores de alta contra 5 de baixa.',
                '0:40 — À esquerda, pergunte ao Chat RAG sobre balanços 10-K, atas do Fed ou estoques físicos.'
            ]
        },
        steps: [
            'Elegí la ventana temporal (1m a ALL) en la esquina superior derecha.',
            'Alterná entre Analytics (gráficos y superficies 3D) y Research (tesis alcista/bajista y noticias 24h).',
            'Usá el Chat RAG para hacer preguntas puntuales con fuentes verificadas.'
        ]
    },
    {
        id: 'l-portfolio-v1',
        group: 'PORTFOLIO',
        title: 'Portfolio • Constructor & Performance',
        duration: '0:50',
        viewsCount: 'Vista 1 de Cartera (Tabla + Radiografía + Backtest)',
        target: '/?view=portfolio',
        summary: {
            ES: 'Cómo armar tu cartera, tildar o destildar activos para simular combinaciones al instante y medir el Alpha y los retornos mensuales.',
            EN: 'How to build your portfolio, toggle assets ON/OFF to test combinations instantaneously, and measure Alpha and monthly returns.',
            PT: 'Como montar sua carteira, ativar ou desativar ativos para testar combinações na hora e medir o Alpha e retornos mensais.'
        },
        captions: {
            ES: [
                '0:00 — En la Fila 1 ves las 6 métricas clave de tu cartera: Retorno, Sharpe, VaR 95%, Max Drawdown, Alpha y Diversificación.',
                '0:18 — En la Fila 2 a la izquierda activás o desactivás activos con el checkbox y ajustás pesos sin sliders complejos.',
                '0:35 — A la derecha revisás la Radiografía (con Descomposición de Alpha) y el Calendario Mensual; abajo en Fila 3 ves el Backtest a pantalla completa.'
            ],
            EN: [
                '0:00 — Row 1 displays your 6 core portfolio metrics: Return, Sharpe, 95% VaR, Max Drawdown, Alpha, and Diversification.',
                '0:18 — In Row 2 Left, toggle assets ON/OFF with a single click and adjust weights cleanly without messy sliders.',
                '0:35 — On the right, inspect Portfolio X-Ray (including Alpha Decomposition) and the Monthly Heatmap; Row 3 shows the full-width Backtest.'
            ],
            PT: [
                '0:00 — Na Linha 1 você vê as 6 métricas principais: Retorno, Sharpe, VaR 95%, Max Drawdown, Alpha e Diversificação.',
                '0:18 — Na Linha 2 à esquerda, marque ou desmarque ativos para simular combinações instantaneamente.',
                '0:35 — À direita veja a Radiografia (com Alpha) e o Calendário Mensal; na Linha 3 veja o Backtest em largura total.'
            ]
        },
        steps: [
            'Tildá o destildá activos en la tabla izquierda para ver cómo cambia tu cartera en vivo.',
            'Mirá a la derecha la Radiografía & Atribución y el Calendario de retornos mes a mes.',
            'Compará abajo en la serie histórica cómo le habría ido a tu cartera frente al S&P 500 o una 60/40.'
        ]
    },
    {
        id: 'l-portfolio-v2-v3',
        group: 'PORTFOLIO',
        title: 'Portfolio • Riesgo Quant & Estrategias Ad-Hoc',
        duration: '0:55',
        viewsCount: 'Vista 2 (Markowitz/Matrices) + Vista 3 (What-If/Comité)',
        target: '/?view=portfolio',
        summary: {
            ES: 'Cómo usar la grilla de riesgo (Markowitz dinámico, Tornado, Correlación y Monte Carlo) y el laboratorio de estrategias antes de operar.',
            EN: 'How to use the quant risk grid (dynamic Markowitz, Stress Tornado, Correlation & Monte Carlo) and the pre-trade strategy lab.',
            PT: 'Como usar a grade de risco (Markowitz dinâmico, Tornado, Correlação e Monte Carlo) e o laboratório de estratégias.'
        },
        captions: {
            ES: [
                '0:00 — En Riesgo Cuantitativo tenés 4 cuadrantes simétricos: Markowitz dinámico, Tornado de Stress, Matriz de Correlación y Matriz Tasas×SPX.',
                '0:22 — Abajo en el ancho completo proyectás 10,000 simulaciones Monte Carlo a 6, 12 o 24 meses.',
                '0:38 — En Laboratorio Ad-Hoc ves arriba el impacto en tu Cartera Total antes de ejecutar cualquier cobertura de opciones o rebalanceo.'
            ],
            EN: [
                '0:00 — Quant Risk features 4 symmetric quadrants: Dynamic Markowitz, Stress Tornado, Correlation Matrix, and Rates×SPX Shock Matrix.',
                '0:22 — Across the full bottom row, project 10,000 Monte Carlo simulations over 6, 12, or 24 months.',
                '0:38 — In the Ad-Hoc Lab, the top bar shows the exact impact on your Total Portfolio before executing any option hedge or trade.'
            ],
            PT: [
                '0:00 — Em Risco Quantitativo há 4 quadrantes: Markowitz dinâmico, Tornado de Stress, Matriz de Correlação e Choque Taxas×SPX.',
                '0:22 — Na linha inferior completa, projete 10.000 simulações Monte Carlo para 6, 12 ou 24 meses.',
                '0:38 — No Laboratório Ad-Hoc, veja no topo o impacto na Carteira Total antes de executar qualquer operação.'
            ]
        },
        steps: [
            'Activá capas dentro de Markowitz o cambiá entre Correlación Normal y Crisis con un click.',
            'En la Vista 3 probá un trade o escudo de opciones Put y verificá arriba cómo mejora el Sharpe y baja el VaR.',
            'Abrí el ícono 💬 arriba a la derecha cuando quieras consultar al Copiloto RAG.'
        ]
    },
    {
        id: 'l-engines-3d',
        group: 'ENGINES',
        title: 'Motores Interactivos 3D/2D por Clase',
        duration: '0:40',
        viewsCount: 'Volatilidad 3D • Curvas 42 Países • FX 61 Monedas • Futuros',
        target: '/?view=markets&mode=screener',
        summary: {
            ES: 'Guía rápida para rotar superficies 3D con el mouse, comparar curvas de bonos soberanos y triangular divisas.',
            EN: 'Quick guide to rotating 3D surfaces with your mouse, comparing sovereign yield curves, and triangulating FX pairs.',
            PT: 'Guia rápido para girar superfícies 3D com o mouse, comparar curvas soberanas e converter moedas.'
        },
        captions: {
            ES: [
                '0:00 — Arrastrá con el mouse sobre cualquier malla 3D para rotar el ángulo o usá las 4 cámaras rápidas (Isométrica, Smile, Plazos, Heatmap).',
                '0:20 — Pasá el cursor sobre cualquier nodo para ver el corte transversal y su precio o volatilidad exacta.'
            ],
            EN: [
                '0:00 — Drag with your mouse on any 3D mesh to rotate the angle or click the 4 preset cameras (Isometric, Smile, Term, Heatmap).',
                '0:20 — Hover over any vertex to highlight cross-sections and inspect exact volatility, yield, or forward price.'
            ],
            PT: [
                '0:00 — Arraste com o mouse sobre qualquer malha 3D para girar ou use as 4 câmeras rápidas.',
                '0:20 — Passe o cursor sobre qualquer nó para ver o corte transversal e o valor exato.'
            ]
        },
        steps: [
            'Accedé desde Main Tools en Markets o entrando a cualquier activo y eligiendo la 4ª lente.',
            'Usá el buscador del riel izquierdo para cambiar de activo, país o par de divisas sin salir del motor.'
        ]
    }
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

export default function GuideModelsLab({ activeModel = 'GUIDE-M1' }) {
    const [section, setSection] = useState('ALL');
    const [selectedLessonId, setSelectedLessonId] = useState('l-portfolio-v1');
    const [videoLang, setVideoLang] = useState('ES');
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(18);

    const filteredLessons = INTERACTIVE_LESSONS.filter(
        l => section === 'ALL' || l.group === section
    );
    const activeLesson =
        INTERACTIVE_LESSONS.find(l => l.id === selectedLessonId) ||
        filteredLessons[0] ||
        INTERACTIVE_LESSONS[0];

    useEffect(() => {
        if (!isPlaying) return undefined;
        const timer = setInterval(() => {
            setProgress(p => (p >= 100 ? 0 : p + 4));
        }, 400);
        return () => clearInterval(timer);
    }, [isPlaying]);

    const activeCaptionIdx = progress < 34 ? 0 : progress < 68 ? 1 : 2;
    const captionsList = activeLesson.captions[videoLang] || activeLesson.captions.ES;

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
            {GUIDE_SECTIONS.map(s => {
                const active = section === s.id;
                return (
                    <button
                        key={s.id}
                        onClick={() => setSection(s.id)}
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
                        {s.label}
                    </button>
                );
            })}
        </div>
    );

    /* ── BLOQUE REPRODUCTOR DE VIDEO IA MULTILINGÜE ── */
    const renderAiVideoPlayer = () => (
        <div
            style={{
                background: 'linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(6,9,17,0.98) 100%)',
                border: '1px solid rgba(16,185,129,0.35)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px'
            }}
        >
            {/* CABECERA DEL REPRODUCTOR + SELECTOR DE IDIOMA DEL VIDEO IA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <div>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.06em' }}>
                        VIDEO-CÁPSULA IA INTERACTIVA • {activeLesson.duration} MIN
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
                        {activeLesson.title}
                    </div>
                </div>

                {/* SELECTOR DE IDIOMA DEL VIDEO IA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Volume2 size={13} color="#10b981" />
                    {VIDEO_LANGS.map(l => {
                        const active = videoLang === l.code;
                        return (
                            <button
                                key={l.code}
                                onClick={() => setVideoLang(l.code)}
                                style={{
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    border: active ? '1px solid #10b981' : '1px solid rgba(148,163,184,0.22)',
                                    background: active ? 'rgba(16,185,129,0.22)' : 'rgba(2,6,23,0.7)',
                                    color: active ? '#6ee7b7' : '#cbd5e1',
                                    fontSize: '9.5px',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                }}
                            >
                                {l.flag} {l.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* PANTALLA DEL VIDEO SIMULADO CON SUBTÍTULOS IA SINCRONIZADOS */}
            <div
                style={{
                    position: 'relative',
                    height: '155px',
                    borderRadius: '8px',
                    background: 'radial-gradient(circle at 50% 35%, rgba(16,185,129,0.16), rgba(2,6,23,0.96) 75%)',
                    border: '1px solid rgba(148,163,184,0.2)',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                        style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(16,185,129,0.2)',
                            border: '1px solid rgba(16,185,129,0.45)',
                            color: '#6ee7b7',
                            fontSize: '9px',
                            fontWeight: 800
                        }}
                    >
                        {activeLesson.viewsCount}
                    </span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700 }}>
                        Narración IA • {videoLang} • Paso {activeCaptionIdx + 1} de {captionsList.length}
                    </span>
                </div>

                {/* VISUALIZACIÓN ESQUEMÁTICA ANIMADA DEL PASO ACTUAL */}
                <div style={{ textAlign: 'center', padding: '6px 14px' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#f8fafc', lineHeight: 1.45 }}>
                        “{captionsList[activeCaptionIdx] || captionsList[0]}”
                    </div>
                </div>

                {/* CONTROLES DE REPRODUCCIÓN Y BARRA DE PROGRESO */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={() => setIsPlaying(p => !p)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid #10b981',
                            background: 'rgba(16,185,129,0.25)',
                            color: '#6ee7b7',
                            fontSize: '9.5px',
                            fontWeight: 900,
                            cursor: 'pointer'
                        }}
                    >
                        {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                        {isPlaying ? 'Pausar' : 'Reproducir Video IA'}
                    </button>
                    <button
                        onClick={() => {
                            setProgress(0);
                            setIsPlaying(true);
                        }}
                        style={{
                            padding: '4px 7px',
                            borderRadius: '6px',
                            border: '1px solid rgba(148,163,184,0.25)',
                            background: 'rgba(2,6,23,0.8)',
                            color: '#cbd5e1',
                            cursor: 'pointer'
                        }}
                        title="Reiniciar"
                    >
                        <RotateCcw size={12} />
                    </button>

                    <div
                        onClick={e => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pct = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
                            setProgress(pct);
                        }}
                        style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '99px',
                            background: 'rgba(148,163,184,0.2)',
                            cursor: 'pointer',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                width: `${progress}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #10b981 0%, #6ee7b7 100%)'
                            }}
                        />
                    </div>
                    <span style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'monospace' }}>{progress}%</span>
                </div>
            </div>
        </div>
    );

    /* ══════════════════════════════════════════════════════════════════════════
       MODELO 1: GUIDE-M1 (LECTURA SIMPLE + VIDEO CORTO IA MULTILINGÜE EN 3 FILAS)
       ══════════════════════════════════════════════════════════════════════════ */
    if (activeModel === 'GUIDE-M1') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {renderCenteredMenu()}

                {/* FILA 1: 4 PÍLDORAS DE ACCESO RÁPIDO A LO IMPORTANTE */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '8px' }}>
                    {[
                        { label: 'FORMATO DE APRENDIZAJE', val: 'Lectura + Video IA', sub: 'Explicaciones de 45 seg sin jerga innecesaria' },
                        { label: 'IDIOMAS DE AUDIO / SUBS', val: 'ES • EN • PT (+56)', sub: 'Cambio instantáneo de idioma en el reproductor' },
                        { label: 'PANTALLAS CUBIERTAS', val: '7 Vistas Clave', sub: 'Home • Screener • Analytics • Research • 3 Vistas Portfolio' },
                        { label: 'REGLA VISUAL DE COLOR', val: 'Verde (+) / Rojo (−)', sub: 'Toda ganancia o salud en verde; pérdida o alerta en rojo' }
                    ].map((p, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: 'rgba(15,23,42,0.92)',
                                border: '1px solid rgba(16,185,129,0.28)',
                                borderRadius: '9px',
                                padding: '8px 11px'
                            }}
                        >
                            <div style={{ fontSize: '8px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em' }}>{p.label}</div>
                            <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#6ee7b7', marginTop: '2px' }}>{p.val}</div>
                            <div style={{ fontSize: '8.5px', color: '#cbd5e1', marginTop: '2px' }}>{p.sub}</div>
                        </div>
                    ))}
                </div>

                {/* FILA 2: IZQ LISTA DE TEMAS SIMPLES | DER VIDEO IA + LECTURA EN 3 PASOS */}
                <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.35fr', gap: '10px' }}>
                    {/* IZQUIERDA: TABLA SIMPLE DE LECCIONES */}
                    <div
                        style={{
                            background: 'rgba(15,23,42,0.92)',
                            border: '1px solid rgba(148,163,184,0.2)',
                            borderRadius: '10px',
                            padding: '10px'
                        }}
                    >
                        <div style={{ fontSize: '10.5px', fontWeight: 900, color: '#f8fafc', marginBottom: '6px', letterSpacing: '0.05em' }}>
                            ELEGÍ QUÉ PANTALLA QUERÉS ENTENDER O VER EN VIDEO
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Pantalla / Vista', 'Cobertura', 'Video IA'].map((h, i, a) => (
                                        <th key={h} style={thStyle(i, a.length)}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLessons.map(item => {
                                    const isSel = item.id === activeLesson.id;
                                    return (
                                        <tr
                                            key={item.id}
                                            onClick={() => {
                                                setSelectedLessonId(item.id);
                                                setProgress(0);
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                background: isSel ? 'rgba(16,185,129,0.16)' : 'transparent'
                                            }}
                                        >
                                            <td style={{ ...tdStyle(0, 3), fontWeight: 800, color: isSel ? '#6ee7b7' : '#f8fafc' }}>
                                                {item.title}
                                            </td>
                                            <td style={{ ...tdStyle(1, 3), color: '#cbd5e1', fontSize: '9.5px' }}>
                                                {item.viewsCount}
                                            </td>
                                            <td style={tdStyle(2, 3)}>
                                                <span
                                                    style={{
                                                        padding: '2px 7px',
                                                        borderRadius: '4px',
                                                        background: 'rgba(16,185,129,0.22)',
                                                        border: '1px solid rgba(16,185,129,0.45)',
                                                        color: '#6ee7b7',
                                                        fontWeight: 800,
                                                        fontSize: '9px'
                                                    }}
                                                >
                                                    ▶ {item.duration}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* DERECHA: VIDEO IA ARRIBA + LECTURA PASO A PASO ABAJO */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {renderAiVideoPlayer()}

                        <div
                            style={{
                                background: 'rgba(15,23,42,0.92)',
                                border: '1px solid rgba(148,163,184,0.2)',
                                borderRadius: '10px',
                                padding: '11px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '10px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.05em' }}>
                                    RESUMEN DE LECTURA RÁPIDA (CÓMO USARLO EN 3 PASOS)
                                </span>
                                <a
                                    href={activeLesson.target}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        background: 'rgba(16,185,129,0.2)',
                                        border: '1px solid rgba(16,185,129,0.5)',
                                        color: '#6ee7b7',
                                        fontSize: '9.5px',
                                        fontWeight: 800,
                                        textDecoration: 'none'
                                    }}
                                >
                                    Abrir esta Vista <ArrowUpRight size={11} />
                                </a>
                            </div>

                            <div style={{ fontSize: '10.5px', color: '#cbd5e1', lineHeight: 1.45 }}>
                                {activeLesson.summary[videoLang] || activeLesson.summary.ES}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {activeLesson.steps.map((st, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '7px',
                                            padding: '5px 8px',
                                            borderRadius: '6px',
                                            background: 'rgba(2,6,23,0.65)',
                                            fontSize: '10px',
                                            color: '#e2e8f0'
                                        }}
                                    >
                                        <CheckCircle2 size={13} color="#10b981" />
                                        <span>{st}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILA 3 (100% ANCHO): DICCIONARIO RÁPIDO EN LENGUAJE HUMANO */}
                <div
                    style={{
                        background: 'rgba(15,23,42,0.92)',
                        border: '1px solid rgba(148,163,184,0.2)',
                        borderRadius: '10px',
                        padding: '10px'
                    }}
                >
                    <div style={{ fontSize: '10.5px', fontWeight: 900, color: '#f8fafc', marginBottom: '6px', letterSpacing: '0.05em' }}>
                        GLOSARIO RÁPIDO EN LENGUAJE SIMPLE (¿QUÉ SIGNIFICA Y QUÉ ES BUENO O MALO?)
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Indicador / Herramienta', '¿Qué mide en palabras simples?', 'Señal Positiva (Verde)', 'Señal de Alerta (Rojo)'].map((h, i, a) => (
                                    <th key={h} style={thStyle(i, a.length)}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { k: 'Anomaly Score (P-06)', desc: 'Detecta si el precio y volumen se mueven de forma normal o inusual.', good: '< 0.50 (Régimen Normal)', bad: '≥ 0.65 (Dislocación / Recorte)' },
                                { k: 'Sharpe Ratio', desc: 'Cuánto retorno ganás por cada unidad de riesgo que asumís.', good: '> 1.50 (Excelente eficiencia)', bad: '< 0.80 (Poco retorno para el riesgo)' },
                                { k: 'VaR 95% (1 Día)', desc: 'Pérdida máxima estimada en un día malo normal (19 de cada 20 días).', good: 'Cerca de -1.0% del NAV', bad: 'Supera -2.5% del NAV diario' },
                                { k: 'Alpha Brinson (#2)', desc: 'Cuánto retorno extra generaste por elegir buenos activos vs el índice.', good: '+Alpha positivo (Verde)', bad: '-Alpha negativo (Rojo)' }
                            ].map(r => (
                                <tr key={r.k}>
                                    <td style={{ ...tdStyle(0, 4), fontWeight: 800, color: '#f8fafc' }}>{r.k}</td>
                                    <td style={{ ...tdStyle(1, 4), color: '#cbd5e1' }}>{r.desc}</td>
                                    <td style={{ ...tdStyle(2, 4), color: '#6ee7b7', fontWeight: 700 }}>{r.good}</td>
                                    <td style={{ ...tdStyle(3, 4), color: '#fda4af', fontWeight: 700 }}>{r.bad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    /* ══════════════════════════════════════════════════════════════════════════
       MODELO 2: GUIDE-M2 (TARJETAS VISUALES INTERACTIVAS 2×2 + VIDEO IA ARRIBA)
       ══════════════════════════════════════════════════════════════════════════ */
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {renderCenteredMenu()}
            {renderAiVideoPlayer()}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {INTERACTIVE_LESSONS.slice(0, 4).map(lesson => (
                    <div
                        key={lesson.id}
                        onClick={() => setSelectedLessonId(lesson.id)}
                        style={{
                            background: lesson.id === activeLesson.id ? 'rgba(16,185,129,0.12)' : 'rgba(15,23,42,0.92)',
                            border: lesson.id === activeLesson.id ? '1.5px solid #10b981' : '1px solid rgba(148,163,184,0.2)',
                            borderRadius: '10px',
                            padding: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '8px'
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', fontWeight: 900, color: '#f8fafc' }}>{lesson.title}</span>
                                <span style={{ fontSize: '9px', fontWeight: 800, color: '#6ee7b7' }}>▶ Video IA {lesson.duration}</span>
                            </div>
                            <p style={{ margin: '6px 0', fontSize: '10px', color: '#cbd5e1', lineHeight: 1.45 }}>
                                {lesson.summary[videoLang] || lesson.summary.ES}
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {lesson.steps.map((st, idx) => (
                                <div key={idx} style={{ fontSize: '9.5px', color: '#94a3b8' }}>• {st}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
