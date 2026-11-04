import React from 'react';
import { Video, Palette } from 'lucide-react';
import WebbDeepFieldCanvas from '../WebbDeepFieldCanvas';
import { FlagBadge } from '../FooterBar';
import { LANGUAGES } from '../../data/i18n';

/* ═══════════════════════════════════════════════════════════════════════════
   DEFINICIÓN DE ESCENAS Y COREOGRAFÍA DE CURSOR POR PÁGINA DE GUIDE
   Cada página tiene sus capítulos sincronizados (0% a 100% del audio),
   coordenadas del puntero animado, dirección de mirada del Orbe 4D y subtítulos.
   ═══════════════════════════════════════════════════════════════════════════ */
export const GUIDE_VIDEO_SCENES_BY_PAGE = {
    home: [
        {
            id: 'home-canvas',
            short: '01 • Home',
            startPct: 0,
            endPct: 17,
            cursorX: 50,
            cursorY: 42,
            lookAtX: -0.4,
            lookAtY: -0.4,
            dockSide: 'right',
            cameraTransform: 'scale(1) translate(0%, 0%)',
            captionES: 'Bienvenido a Market Intelligence Dashboard: la pantalla Home es tu punto central de partida.',
            captionEN: 'Welcome to Market Intelligence Dashboard: the Home screen is your central starting point.'
        },
        {
            id: 'home-header',
            short: '02 • Header (λ)',
            startPct: 17,
            endPct: 33,
            cursorX: 16,
            cursorY: 9,
            lookAtX: -2.4,
            lookAtY: -2.2,
            dockSide: 'right',
            cameraTransform: 'scale(1.04) translate(1.8%, 1.5%)',
            captionES: 'Arriba a la izquierda en el Header, un clic en el ícono λ o en el título te devuelve siempre a Home.',
            captionEN: 'Top-left in the Header, clicking the λ icon or title always brings you right back to Home.'
        },
        {
            id: 'home-markets',
            short: '03 • Markets',
            startPct: 33,
            endPct: 46,
            cursorX: 83,
            cursorY: 9,
            lookAtX: 1.9,
            lookAtY: -2.2,
            dockSide: 'right',
            cameraTransform: 'scale(1.04) translate(-1.8%, 1.5%)',
            captionES: 'A la derecha del Header, Markets abre el análisis en vivo de los 213 activos globales.',
            captionEN: 'On the right of the Header, Markets opens live analysis across all 213 global assets.'
        },
        {
            id: 'home-portfolio',
            short: '04 • Portfolio',
            startPct: 46,
            endPct: 59,
            cursorX: 93,
            cursorY: 9,
            lookAtX: 2.5,
            lookAtY: -2.2,
            dockSide: 'right',
            cameraTransform: 'scale(1.04) translate(-2.2%, 1.5%)',
            captionES: 'Al lado, Portfolio es tu mesa de decisiones para construir carteras, medir riesgo y simular órdenes.',
            captionEN: 'Next to it, Portfolio is your decision desk to build allocations, measure risk and simulate trades.'
        },
        {
            id: 'home-system',
            short: '05 • System',
            startPct: 59,
            endPct: 71,
            cursorX: 7,
            cursorY: 92,
            lookAtX: -2.4,
            lookAtY: 2.1,
            dockSide: 'right',
            cameraTransform: 'scale(1.04) translate(1.8%, -1.5%)',
            captionES: 'Abajo en el Footer izquierdo, System confirma en vivo el estado de los servidores y bases de datos.',
            captionEN: 'Down in the bottom-left Footer, System confirms live health across servers and databases.'
        },
        {
            id: 'home-guide',
            short: '06 • Guide',
            startPct: 71,
            endPct: 81,
            cursorX: 15,
            cursorY: 92,
            lookAtX: -1.8,
            lookAtY: 2.1,
            dockSide: 'right',
            cameraTransform: 'scale(1.04) translate(1.5%, -1.5%)',
            captionES: 'Al lado, Guide abre este manual interactivo paso a paso en cualquier momento.',
            captionEN: 'Next to it, Guide opens this interactive step-by-step manual whenever you need it.'
        },
        {
            id: 'home-langs',
            short: '07 • Idiomas',
            startPct: 81,
            endPct: 91,
            cursorX: 88,
            cursorY: 92,
            lookAtX: 2.2,
            lookAtY: 2.1,
            dockSide: 'left',
            cameraTransform: 'scale(1.04) translate(-1.8%, -1.5%)',
            captionES: 'En la esquina inferior derecha, el buscador de idiomas traduce toda la plataforma a 56 lenguas.',
            captionEN: 'At the bottom-right corner, the language selector translates the platform into 56 languages.'
        },
        {
            id: 'home-palettes',
            short: '08 • Palette',
            startPct: 91,
            endPct: 100.1,
            cursorX: 95,
            cursorY: 92,
            lookAtX: 2.5,
            lookAtY: 2.1,
            dockSide: 'left',
            cameraTransform: 'scale(1.04) translate(-2.0%, -1.5%)',
            captionES: 'Y Palette rota entre los 5 ambientes visuales manteniendo intactos el verde y rojo financieros.',
            captionEN: 'And Palette cycles across 5 visual themes while keeping financial green and red intact.'
        }
    ],

    'mkt-screener': [
        {
            id: 'scr-categories',
            short: '01 • Categorías',
            startPct: 0,
            endPct: 22,
            cursorX: 34,
            cursorY: 13,
            lookAtX: -1.2,
            lookAtY: -2.0,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0%, 1%)',
            captionES: 'En la barra de Categorías filtrás entre Todos los 213 activos, tu Watchlist o 10 mercados especializados.',
            captionEN: 'In the Categories bar, filter across All 213 assets, your Watchlist, or 10 specialized markets.'
        },
        {
            id: 'scr-pulse',
            short: '02 • Pulso 24h',
            startPct: 22,
            endPct: 42,
            cursorX: 48,
            cursorY: 28,
            lookAtX: -0.2,
            lookAtY: -1.1,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0%, 0.5%)',
            captionES: 'Las 4 tarjetas de Pulso 24h muestran volumen global, régimen de volatilidad y mayores movimientos.',
            captionEN: 'The 4 Pulse 24h cards display global volume, volatility regime, and top market movers.'
        },
        {
            id: 'scr-table',
            short: '03 • Tabla',
            startPct: 42,
            endPct: 62,
            cursorX: 44,
            cursorY: 60,
            lookAtX: -0.5,
            lookAtY: 0.6,
            dockSide: 'right',
            cameraTransform: 'scale(1) translate(0%, 0%)',
            captionES: 'La Tabla cuantitativa ordena los 213 instrumentos en vivo con precio, variación, Z-Score y Hurst.',
            captionEN: 'The quantitative Table ranks all 213 live instruments with price, delta, Z-Score, and Hurst.'
        },
        {
            id: 'scr-orbital',
            short: '04 • Orbital',
            startPct: 62,
            endPct: 76,
            cursorX: 50,
            cursorY: 58,
            lookAtX: 0.0,
            lookAtY: 0.5,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0%, 0%)',
            captionES: 'La vista Orbital agrupa los activos por atracción gravitatoria según su retorno y volumen.',
            captionEN: 'The Orbital view clusters assets by gravitational attraction based on return and volume.'
        },
        {
            id: 'scr-heatmap',
            short: '05 • Mapa Calor',
            startPct: 76,
            endPct: 89,
            cursorX: 52,
            cursorY: 58,
            lookAtX: 0.2,
            lookAtY: 0.5,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0%, 0%)',
            captionES: 'El Mapa de Calor dimensiona cada bloque por liquidez y lo colorea según su ganancia o caída diaria.',
            captionEN: 'The Heatmap sizes each block by liquidity and colors it by daily gain or loss.'
        },
        {
            id: 'scr-maintools',
            short: '06 • Main Tools',
            startPct: 89,
            endPct: 100.1,
            cursorX: 88,
            cursorY: 13,
            lookAtX: 2.1,
            lookAtY: -2.0,
            dockSide: 'left',
            cameraTransform: 'scale(1.03) translate(-1.5%, 1%)',
            captionES: 'Desde Main Tools arriba a la derecha alternás al instante entre Tabla, Orbital y Mapa de Calor.',
            captionEN: 'From Main Tools at the top-right, switch instantly between Table, Orbital, and Heatmap.'
        }
    ],

    'mkt-analytics': [
        {
            id: 'ana-hero',
            short: '01 • Cabecera',
            startPct: 0,
            endPct: 22,
            cursorX: 28,
            cursorY: 15,
            lookAtX: -1.5,
            lookAtY: -1.8,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(1%, 1%)',
            captionES: 'La Cabecera del activo muestra su cotización en vivo, variación 24h, rango diario y métricas clave.',
            captionEN: 'The asset Header displays live price, 24h delta, daily range, and core metrics.'
        },
        {
            id: 'ana-technical',
            short: '02 • Técnico',
            startPct: 22,
            endPct: 46,
            cursorX: 38,
            cursorY: 48,
            lookAtX: -0.9,
            lookAtY: 0.0,
            dockSide: 'right',
            cameraTransform: 'scale(1) translate(0%, 0%)',
            captionES: 'El panel Técnico combina velas japonesas interactivas con bandas de Bollinger, RSI y MACD.',
            captionEN: 'The Technical panel combines interactive candlesticks with Bollinger Bands, RSI, and MACD.'
        },
        {
            id: 'ana-compare',
            short: '03 • Comparar %',
            startPct: 46,
            endPct: 64,
            cursorX: 54,
            cursorY: 36,
            lookAtX: 0.2,
            lookAtY: -0.6,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0%, 0%)',
            captionES: 'Con Comparar % superponés en base 100 el rendimiento relativo frente a índices y competidores.',
            captionEN: 'With Compare %, overlay normalized relative performance against benchmarks and peers.'
        },
        {
            id: 'ana-micro',
            short: '04 • Micro & Flujo',
            startPct: 64,
            endPct: 83,
            cursorX: 82,
            cursorY: 44,
            lookAtX: 2.0,
            lookAtY: -0.2,
            dockSide: 'left',
            cameraTransform: 'scale(1.03) translate(-1.5%, 0%)',
            captionES: 'A la derecha, Microestructura y Flujo revela profundidad del libro de órdenes, Hurst y Z-Score.',
            captionEN: 'On the right, Microstructure & Flow reveals order book depth, Hurst exponent, and Z-Score.'
        },
        {
            id: 'ana-engines',
            short: '05 • Motores 3D/2D',
            startPct: 83,
            endPct: 100.1,
            cursorX: 48,
            cursorY: 82,
            lookAtX: 0.0,
            lookAtY: 1.8,
            dockSide: 'right',
            cameraTransform: 'scale(1.03) translate(0%, -1.5%)',
            captionES: 'En la base, los Motores 3D y 2D proyectan la superficie de volatilidad y el atractor de espacio de fases.',
            captionEN: 'At the bottom, the 3D and 2D Engines project the volatility surface and phase-space attractor.'
        }
    ],

    'mkt-research': [
        {
            id: 'res-hero',
            short: '01 • Nota & Postura',
            startPct: 0,
            endPct: 25,
            cursorX: 35,
            cursorY: 16,
            lookAtX: -1.1,
            lookAtY: -1.8,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0.8%, 1%)',
            captionES: 'Arriba, Nota y Postura resume la calificación cuantitativa 0-100 y el consenso institucional.',
            captionEN: 'At the top, Score & Stance summarizes the 0-100 quant rating and institutional consensus.'
        },
        {
            id: 'res-rag',
            short: '02 • Chat RAG',
            startPct: 25,
            endPct: 54,
            cursorX: 28,
            cursorY: 52,
            lookAtX: -1.6,
            lookAtY: 0.2,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(1.2%, 0%)',
            captionES: 'A la izquierda, el Chat RAG responde consultas sobre reportes SEC 10-K, 10-Q y noticias verificadas.',
            captionEN: 'On the left, RAG Chat answers queries grounded in official SEC 10-K/10-Q filings and verified news.'
        },
        {
            id: 'res-factors',
            short: '03 • Factores',
            startPct: 54,
            endPct: 78,
            cursorX: 76,
            cursorY: 48,
            lookAtX: 1.8,
            lookAtY: 0.0,
            dockSide: 'left',
            cameraTransform: 'scale(1.02) translate(-1.2%, 0%)',
            captionES: 'A la derecha, el radar de Factores evalúa Valor, Calidad, Momentum, Crecimiento y Baja Volatilidad.',
            captionEN: 'On the right, the Factors radar scores Value, Quality, Momentum, Growth, and Low Volatility.'
        },
        {
            id: 'res-pulse24h',
            short: '04 • Pulso FinBERT',
            startPct: 78,
            endPct: 100.1,
            cursorX: 52,
            cursorY: 83,
            lookAtX: 0.1,
            lookAtY: 1.8,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0%, -1.2%)',
            captionES: 'Abajo, el Pulso FinBERT clasifica en tiempo real el sentimiento positivo, neutral o negativo de cada noticia.',
            captionEN: 'At the bottom, FinBERT Pulse classifies real-time positive, neutral, or negative headline sentiment.'
        }
    ],

    'port-v1': [
        {
            id: 'p1-pills',
            short: '01 • Resumen',
            startPct: 0,
            endPct: 22,
            cursorX: 42,
            cursorY: 15,
            lookAtX: -0.6,
            lookAtY: -1.8,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0%, 1%)',
            captionES: 'Las tarjetas de Resumen calculan en vivo el Retorno Esperado, el Ratio de Sharpe y la Volatilidad.',
            captionEN: 'The Summary cards compute live Expected Return, Sharpe Ratio, and annualized Volatility.'
        },
        {
            id: 'p1-table',
            short: '02 • Ponderación',
            startPct: 22,
            endPct: 48,
            cursorX: 30,
            cursorY: 48,
            lookAtX: -1.4,
            lookAtY: 0.1,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(1%, 0%)',
            captionES: 'En Ponderación ajustás el peso de cada activo o aplicás optimización de Mínima Varianza o Máximo Sharpe.',
            captionEN: 'In Weighting, adjust each asset weight or apply Minimum Variance or Maximum Sharpe optimization.'
        },
        {
            id: 'p1-xray',
            short: '03 • Radiografía',
            startPct: 48,
            endPct: 68,
            cursorX: 76,
            cursorY: 46,
            lookAtX: 1.8,
            lookAtY: 0.0,
            dockSide: 'left',
            cameraTransform: 'scale(1.02) translate(-1.2%, 0%)',
            captionES: 'A la derecha, la Radiografía desglosa tu exposición real por clase de activo, sector y moneda.',
            captionEN: 'On the right, X-Ray breaks down your true exposure by asset class, sector, and currency.'
        },
        {
            id: 'p1-calendar',
            short: '04 • Calendario',
            startPct: 68,
            endPct: 84,
            cursorX: 32,
            cursorY: 82,
            lookAtX: -1.2,
            lookAtY: 1.8,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0.8%, -1.2%)',
            captionES: 'Abajo a la izquierda, el Calendario mensual revela la estacionalidad histórica de los retornos.',
            captionEN: 'Bottom-left, the Monthly Calendar reveals historical return seasonality across months.'
        },
        {
            id: 'p1-backtest',
            short: '05 • Backtesting',
            startPct: 84,
            endPct: 100.1,
            cursorX: 72,
            cursorY: 82,
            lookAtX: 1.5,
            lookAtY: 1.8,
            dockSide: 'left',
            cameraTransform: 'scale(1.02) translate(-1.0%, -1.2%)',
            captionES: 'Y el gráfico de Backtesting compara la curva de capital de tu cartera frente al benchmark.',
            captionEN: 'And the Backtesting chart compares your portfolio equity curve against the benchmark.'
        }
    ],

    'port-v2': [
        {
            id: 'p2-markowitz',
            short: '01 • Markowitz 2D',
            startPct: 0,
            endPct: 24,
            cursorX: 28,
            cursorY: 36,
            lookAtX: -1.5,
            lookAtY: -0.7,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(1%, 0.5%)',
            captionES: 'El gráfico Markowitz 2D traza la Frontera Eficiente y ubica tu cartera frente al Portafolio Tangente.',
            captionEN: 'The 2D Markowitz chart plots the Efficient Frontier and positions your allocation vs Tangency.'
        },
        {
            id: 'p2-tornado',
            short: '02 • Tornado & VaR',
            startPct: 24,
            endPct: 48,
            cursorX: 74,
            cursorY: 36,
            lookAtX: 1.7,
            lookAtY: -0.7,
            dockSide: 'left',
            cameraTransform: 'scale(1.02) translate(-1%, 0.5%)',
            captionES: 'Al lado, Tornado y Value at Risk miden la pérdida máxima esperada al 95% y 99% de confianza.',
            captionEN: 'Next to it, Tornado and Value at Risk measure expected tail loss at 95% and 99% confidence.'
        },
        {
            id: 'p2-corr',
            short: '03 • Correlación',
            startPct: 48,
            endPct: 66,
            cursorX: 26,
            cursorY: 78,
            lookAtX: -1.6,
            lookAtY: 1.6,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(1%, -1%)',
            captionES: 'La matriz de Correlación cruzada detecta si tus activos se mueven juntos durante una caída.',
            captionEN: 'The cross-asset Correlation matrix detects whether your holdings move together during selloffs.'
        },
        {
            id: 'p2-shock2d',
            short: '04 • Choque & Markov',
            startPct: 66,
            endPct: 83,
            cursorX: 52,
            cursorY: 78,
            lookAtX: 0.1,
            lookAtY: 1.6,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0%, -1%)',
            captionES: 'El módulo de Choque y Markov estima probabilidades de cambio de régimen y crisis históricas.',
            captionEN: 'The Shock & Markov module estimates regime-switching probabilities and historical crisis stress.'
        },
        {
            id: 'p2-montecarlo',
            short: '05 • Monte Carlo',
            startPct: 83,
            endPct: 100.1,
            cursorX: 80,
            cursorY: 78,
            lookAtX: 2.0,
            lookAtY: 1.6,
            dockSide: 'left',
            cameraTransform: 'scale(1.02) translate(-1.2%, -1%)',
            captionES: 'Y el abanico de Monte Carlo simula 10.000 trayectorias estocásticas para proyectar el capital futuro.',
            captionEN: 'And the Monte Carlo fan simulates 10,000 stochastic paths to project future portfolio wealth.'
        }
    ],

    'port-v3': [
        {
            id: 'p3-impact',
            short: '01 • Impacto',
            startPct: 0,
            endPct: 20,
            cursorX: 44,
            cursorY: 14,
            lookAtX: -0.4,
            lookAtY: -1.9,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0%, 1%)',
            captionES: 'Arriba, las tarjetas de Impacto comparan el portafolio actual frente al simulado post-operación.',
            captionEN: 'At the top, the Impact cards compare your current portfolio against the simulated post-trade state.'
        },
        {
            id: 'p3-whatif',
            short: '02 • What-If & Kelly',
            startPct: 20,
            endPct: 42,
            cursorX: 26,
            cursorY: 38,
            lookAtX: -1.6,
            lookAtY: -0.5,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(1%, 0.4%)',
            captionES: 'En What-If y Criterio de Kelly simulás órdenes y calculás el tamaño óptimo según su ventaja estadística.',
            captionEN: 'In What-If & Kelly Criterion, simulate orders and compute optimal position size by statistical edge.'
        },
        {
            id: 'p3-tailhedge',
            short: '03 • Put OTM & Margen',
            startPct: 42,
            endPct: 62,
            cursorX: 26,
            cursorY: 62,
            lookAtX: -1.6,
            lookAtY: 0.7,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(1%, -0.4%)',
            captionES: 'Debajo, Put OTM y Margin Call modela coberturas con opciones y monitorea garantías Reg-T.',
            captionEN: 'Below, OTM Put & Margin Call models tail-risk option hedges and monitors Reg-T margin.'
        },
        {
            id: 'p3-committee',
            short: '04 • Comité & Libro',
            startPct: 62,
            endPct: 82,
            cursorX: 76,
            cursorY: 46,
            lookAtX: 1.8,
            lookAtY: 0.0,
            dockSide: 'left',
            cameraTransform: 'scale(1.02) translate(-1.2%, 0%)',
            captionES: 'A la derecha, el Comité de 3 agentes IA audita límites de riesgo junto al Libro y el Copiloto.',
            captionEN: 'On the right, the 3-agent AI Committee audits risk guardrails alongside the Log and Copilot.'
        },
        {
            id: 'p3-walkforward',
            short: '05 • Walk-Forward',
            startPct: 82,
            endPct: 100.1,
            cursorX: 52,
            cursorY: 86,
            lookAtX: 0.1,
            lookAtY: 1.9,
            dockSide: 'right',
            cameraTransform: 'scale(1.02) translate(0%, -1.4%)',
            captionES: 'Y en la base, el gráfico Walk-Forward valida la solidez In-Sample y Out-of-Sample con eficiencia WFE.',
            captionEN: 'And at the bottom, the Walk-Forward chart validates In-Sample and Out-of-Sample WFE robustness.'
        }
    ]
};

function focusBoxStyle(isActive) {
    return {
        border: isActive ? '1.5px solid #10b981' : '1px solid rgba(148, 163, 184, 0.16)',
        background: isActive ? 'rgba(16, 185, 129, 0.14)' : 'rgba(2, 6, 23, 0.72)',
        boxShadow: isActive ? '0 0 20px rgba(16, 185, 129, 0.42)' : 'none',
        transition: 'all 0.25s ease'
    };
}

/* ── 1. ESCENARIO REAL DE LA PANTALLA HOME (CON WEBB DEEP FIELD CANVAS REAL + MODALES) ── */
function RealHomeCanvasStage({ activeSceneId, isES, animClock }) {
    const sampleLang = isES
        ? LANGUAGES.find(l => l.code === 'ES') || LANGUAGES[0]
        : LANGUAGES.find(l => l.code === 'EN') || LANGUAGES[0];

    // En la escena 08 (Palette), rotamos suavemente los 5 fondos reales para mostrar el efecto en vivo
    const paletteThemes = [
        { name: 'Obsidian Night', bg: 'rgba(2, 6, 23, 0.25)', accent: '#10b981' },
        { name: 'OLED Pitch Black', bg: 'rgba(0, 0, 0, 0.55)', accent: '#10b981' },
        { name: 'Abyssal Navy', bg: 'rgba(7, 24, 54, 0.42)', accent: '#38bdf8' },
        { name: 'Warm Titanium', bg: 'rgba(28, 25, 23, 0.42)', accent: '#f59e0b' },
        { name: 'Cobalt Quant', bg: 'rgba(15, 23, 62, 0.45)', accent: '#818cf8' }
    ];
    const activeThemeIdx =
        activeSceneId === 'home-palettes'
            ? Math.floor(animClock * 1.1) % paletteThemes.length
            : 0;
    const activeTheme = paletteThemes[activeThemeIdx];

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#000000' }}>
            {/* Fondo espacial real WebbDeepFieldCanvas de la aplicación */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <WebbDeepFieldCanvas isPaused={false} lang={isES ? 'ES' : 'EN'} />
            </div>

            {/* Tinte de ambiente cuando se demuestra Palette */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: activeTheme.bg,
                    transition: 'background 0.35s ease',
                    pointerEvents: 'none'
                }}
            />

            {/* HEADER OFICIAL V010 (MINIMAL & GHOST) */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40px',
                    padding: '0 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 10
                }}
            >
                {/* Izquierda: Ícono λ cincelado + Market Intelligence Dashboard */}
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        ...focusBoxStyle(activeSceneId === 'home-header'),
                        background: activeSceneId === 'home-header' ? 'rgba(16, 185, 129, 0.22)' : 'transparent',
                        border: activeSceneId === 'home-header' ? '1.5px solid #10b981' : '1px solid transparent'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.7))' }}>
                        <polygon points="6.5,4 9.8,4 18.8,20 15.5,20" fill="#10b981" />
                        <polygon points="11.6,11.2 13.4,13.8 8.4,20 5.2,20" fill="#34d399" />
                        <polygon points="5.2,4 9.8,4 8.2,6.2 5.2,6.2" fill="#a7f3d0" />
                    </svg>
                    <span
                        className="serif-heading"
                        style={{
                            fontSize: '12.5px',
                            fontWeight: 700,
                            color: '#10b981',
                            textShadow: '0 1px 6px rgba(0,0,0,0.95)'
                        }}
                    >
                        Market Intelligence Dashboard
                    </span>
                </div>

                {/* Derecha: Markets y Portfolio */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                        style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: activeSceneId === 'home-markets' ? '#ffffff' : 'rgba(16, 185, 129, 0.88)',
                            background: activeSceneId === 'home-markets' ? 'rgba(16, 185, 129, 0.24)' : 'transparent',
                            border: activeSceneId === 'home-markets' ? '1.5px solid #10b981' : '1px solid transparent',
                            boxShadow: activeSceneId === 'home-markets' ? '0 0 18px rgba(16, 185, 129, 0.55)' : 'none',
                            textShadow: '0 1px 4px rgba(0,0,0,0.9)'
                        }}
                    >
                        Markets
                    </span>
                    <span
                        style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: activeSceneId === 'home-portfolio' ? '#ffffff' : 'rgba(16, 185, 129, 0.88)',
                            background: activeSceneId === 'home-portfolio' ? 'rgba(16, 185, 129, 0.24)' : 'transparent',
                            border: activeSceneId === 'home-portfolio' ? '1.5px solid #10b981' : '1px solid transparent',
                            boxShadow: activeSceneId === 'home-portfolio' ? '0 0 18px rgba(16, 185, 129, 0.55)' : 'none',
                            textShadow: '0 1px 4px rgba(0,0,0,0.9)'
                        }}
                    >
                        Portfolio
                    </span>
                </div>
            </div>

            {/* TEXTO INTRODUCTORIO REAL DE HOMESTAGE.JSX */}
            <div
                style={{
                    position: 'absolute',
                    top: '19%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 8,
                    textAlign: 'center',
                    width: '86%',
                    maxWidth: '580px',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: activeSceneId === 'home-canvas' ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid transparent',
                    background: activeSceneId === 'home-canvas' ? 'rgba(2, 6, 23, 0.42)' : 'transparent',
                    pointerEvents: 'none'
                }}
            >
                <div
                    className="serif-heading"
                    style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.95)',
                        letterSpacing: '-0.01em',
                        textShadow: '0 2px 12px rgba(0,0,0,0.9)'
                    }}
                >
                    {isES
                        ? 'Inteligencia Cuantitativa de Mercados y Portafolios'
                        : 'Institutional Market & Portfolio Intelligence'}
                </div>
                <div
                    style={{
                        fontSize: '11.5px',
                        color: 'rgba(255, 255, 255, 0.72)',
                        lineHeight: 1.5,
                        marginTop: '5px',
                        textShadow: '0 1px 8px rgba(0,0,0,0.95)'
                    }}
                >
                    {isES
                        ? 'Explorá 213 activos globales en tiempo real, detectá anomalías estadísticas y simulá carteras institucionales.'
                        : 'Explore 213 global assets in real time, detect statistical anomalies, and simulate institutional portfolios.'}
                </div>
            </div>

            {/* VENTANAS EMERGENTES REALES CUANDO EL RECORRIDO EXPLICA SYSTEM, IDIOMAS O PALETTE */}
            {activeSceneId === 'home-system' && (
                <div
                    style={{
                        position: 'absolute',
                        left: '18px',
                        bottom: '48px',
                        zIndex: 12,
                        width: '270px',
                        padding: '10px 12px',
                        borderRadius: '9px',
                        background: 'rgba(2, 6, 23, 0.94)',
                        border: '1px solid rgba(16, 185, 129, 0.55)',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.8)',
                        fontSize: '10.5px',
                        color: '#e2e8f0'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>● SYSTEM TELEMETRY</span>
                        <span style={{ color: '#6ee7b7', fontFamily: 'var(--font-mono)' }}>99.98% OK</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#94a3b8' }}>
                        <div>Cloud Run API: <strong style={{ color: '#fff' }}>24ms</strong></div>
                        <div>BigQuery Feed: <strong style={{ color: '#10b981' }}>LIVE</strong></div>
                        <div>213 Tickers: <strong style={{ color: '#fff' }}>SYNCED</strong></div>
                        <div>RAG Vector DB: <strong style={{ color: '#10b981' }}>READY</strong></div>
                    </div>
                </div>
            )}

            {activeSceneId === 'home-langs' && (
                <div
                    style={{
                        position: 'absolute',
                        right: '18px',
                        bottom: '48px',
                        zIndex: 12,
                        width: '290px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(2, 6, 23, 0.95)',
                        border: '1px solid rgba(16, 185, 129, 0.55)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.85)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>Select Language (56)</span>
                        <span style={{ fontSize: '10px', color: '#10b981', fontFamily: 'var(--font-mono)' }}>mid_lang_v1</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                        {LANGUAGES.slice(0, 9).map(l => (
                            <div
                                key={l.code}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '3px 6px',
                                    borderRadius: '5px',
                                    background: l.code === sampleLang.code ? 'rgba(16, 185, 129, 0.22)' : 'rgba(15, 23, 42, 0.8)',
                                    border: l.code === sampleLang.code ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.16)',
                                    fontSize: '10px',
                                    color: '#f8fafc',
                                    fontFamily: 'var(--font-mono)'
                                }}
                            >
                                <FlagBadge lang={l} width={14} height={10} />
                                <span>{l.code}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSceneId === 'home-palettes' && (
                <div
                    style={{
                        position: 'absolute',
                        right: '18px',
                        bottom: '48px',
                        zIndex: 12,
                        width: '275px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(2, 6, 23, 0.95)',
                        border: '1px solid rgba(16, 185, 129, 0.55)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.85)'
                    }}
                >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                        {isES ? '5 Ambientes de Lectura (Palette)' : '5 Visual Reading Themes (Palette)'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {paletteThemes.map((pt, i) => (
                            <div
                                key={pt.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '3px 7px',
                                    borderRadius: '5px',
                                    background: i === activeThemeIdx ? 'rgba(16, 185, 129, 0.22)' : 'rgba(15, 23, 42, 0.7)',
                                    border: i === activeThemeIdx ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.14)',
                                    fontSize: '10px',
                                    color: i === activeThemeIdx ? '#ffffff' : '#94a3b8'
                                }}
                            >
                                <span>{pt.name}</span>
                                <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>▲#10b981 ▼#f43f5e</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FOOTER OFICIAL V010 CON BANDERA SVG REAL Y PALETTE */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '38px',
                    padding: '0 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 10
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                        style={{
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: activeSceneId === 'home-system' ? '#ffffff' : 'rgba(16, 185, 129, 0.85)',
                            background: activeSceneId === 'home-system' ? 'rgba(16, 185, 129, 0.24)' : 'transparent',
                            border: activeSceneId === 'home-system' ? '1.5px solid #10b981' : '1px solid transparent',
                            boxShadow: activeSceneId === 'home-system' ? '0 0 16px rgba(16, 185, 129, 0.55)' : 'none',
                            textShadow: '0 1px 4px rgba(0,0,0,0.95)'
                        }}
                    >
                        System
                    </span>
                    <span
                        style={{
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: activeSceneId === 'home-guide' ? '#ffffff' : 'rgba(16, 185, 129, 0.85)',
                            background: activeSceneId === 'home-guide' ? 'rgba(16, 185, 129, 0.24)' : 'transparent',
                            border: activeSceneId === 'home-guide' ? '1.5px solid #10b981' : '1px solid transparent',
                            boxShadow: activeSceneId === 'home-guide' ? '0 0 16px rgba(16, 185, 129, 0.55)' : 'none',
                            textShadow: '0 1px 4px rgba(0,0,0,0.95)'
                        }}
                    >
                        Guide
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: activeSceneId === 'home-langs' ? '#ffffff' : 'rgba(16, 185, 129, 0.85)',
                            background: activeSceneId === 'home-langs' ? 'rgba(16, 185, 129, 0.24)' : 'transparent',
                            border: activeSceneId === 'home-langs' ? '1.5px solid #10b981' : '1px solid transparent',
                            boxShadow: activeSceneId === 'home-langs' ? '0 0 16px rgba(16, 185, 129, 0.55)' : 'none'
                        }}
                    >
                        <FlagBadge lang={sampleLang} width={16} height={11} />
                        <span>{sampleLang.code}</span>
                    </span>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: activeSceneId === 'home-palettes' ? 'rgba(16, 185, 129, 0.24)' : 'transparent',
                            border: activeSceneId === 'home-palettes' ? '1.5px solid #10b981' : '1px solid transparent',
                            boxShadow: activeSceneId === 'home-palettes' ? '0 0 16px rgba(16, 185, 129, 0.55)' : 'none'
                        }}
                    >
                        <Palette size={15} color="#10b981" />
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ── 2. ESCENARIO REAL DE MARKETS → SCREENER ── */
function RealScreenerStage({ activeSceneId, isES }) {
    const categories = ['Todos (213)', '★ Watchlist', 'Acciones', 'Bonos', 'Crypto', 'ETFs', 'FX', 'Índices', 'Commodities', 'Tasas'];
    const sampleRows = [
        { sym: 'NVDA', name: 'NVIDIA Corp', cat: 'Acciones', price: '$138.40', chg: '+4.22%', z: '+2.14σ', hurst: '0.68 Tendencial', up: true },
        { sym: 'BTC', name: 'Bitcoin Spot', cat: 'Crypto', price: '$91,420', chg: '+3.81%', z: '+1.85σ', hurst: '0.64 Tendencial', up: true },
        { sym: 'MSFT', name: 'Microsoft', cat: 'Acciones', price: '$442.10', chg: '+1.74%', z: '+0.92σ', hurst: '0.58 Persistente', up: true },
        { sym: 'GLD', name: 'SPDR Gold Trust', cat: 'Commodities', price: '$248.90', chg: '+0.95%', z: '+0.61σ', hurst: '0.55 Neutral', up: true },
        { sym: 'UST10Y', name: 'US Treasury 10Y', cat: 'Bonos', price: '4.21%', chg: '-0.45%', z: '-0.74σ', hurst: '0.43 Reversión', up: false }
    ];

    return (
        <div style={{ position: 'absolute', inset: 0, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#030712' }}>
            {/* Barra superior: Categorías + Main Tools */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 8px',
                        borderRadius: '7px',
                        overflow: 'hidden',
                        ...focusBoxStyle(activeSceneId === 'scr-categories')
                    }}
                >
                    {categories.slice(0, 7).map((cat, idx) => (
                        <span
                            key={cat}
                            style={{
                                padding: '2px 7px',
                                borderRadius: '4px',
                                fontSize: '9.5px',
                                fontWeight: idx === 0 ? 700 : 500,
                                background: idx === 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(15, 23, 42, 0.8)',
                                color: idx === 0 ? '#ffffff' : '#94a3b8',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Main Tools Switcher */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '7px',
                        ...focusBoxStyle(activeSceneId === 'scr-maintools')
                    }}
                >
                    {['Tabla', 'Orbital', 'Mapa Calor'].map((mode, i) => {
                        const isModeActive =
                            (activeSceneId === 'scr-orbital' && i === 1) ||
                            (activeSceneId === 'scr-heatmap' && i === 2) ||
                            (activeSceneId !== 'scr-orbital' && activeSceneId !== 'scr-heatmap' && i === 0);
                        return (
                            <span
                                key={mode}
                                style={{
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    fontSize: '9.5px',
                                    fontWeight: 700,
                                    background: isModeActive ? '#10b981' : 'transparent',
                                    color: isModeActive ? '#020617' : '#94a3b8'
                                }}
                            >
                                {mode}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* 4 Tarjetas de Pulso 24h */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                    padding: '6px',
                    borderRadius: '8px',
                    ...focusBoxStyle(activeSceneId === 'scr-pulse')
                }}
            >
                {[
                    { k: isES ? 'VOLUMEN GLOBAL 24H' : '24H GLOBAL VOLUME', v: '$142.8B', s: '+12.4% vs media', c: '#10b981' },
                    { k: isES ? 'VOLATILIDAD MEDIA' : 'AVG VOLATILITY', v: '14.2%', s: 'Régimen Calmo', c: '#38bdf8' },
                    { k: isES ? 'LÍDER DEL DÍA' : 'TOP MOVER 24H', v: 'NVDA +4.22%', s: 'Z-Score +2.14σ', c: '#10b981' },
                    { k: isES ? 'ANOMALÍAS ACTIVAS' : 'ACTIVE ANOMALIES', v: '7 / 213', s: 'Umbral > 2.0σ', c: '#f59e0b' }
                ].map(card => (
                    <div key={card.k} style={{ padding: '6px 9px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(148, 163, 184, 0.14)' }}>
                        <div style={{ fontSize: '8.5px', fontWeight: 700, color: '#64748b', fontFamily: 'var(--font-mono)' }}>{card.k}</div>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#ffffff', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{card.v}</div>
                        <div style={{ fontSize: '9px', color: card.c }}>{card.s}</div>
                    </div>
                ))}
            </div>

            {/* Cuerpo central: conmuta entre Tabla, Orbital y Mapa de Calor según la escena */}
            <div
                style={{
                    flex: 1,
                    borderRadius: '8px',
                    padding: '8px 10px',
                    overflow: 'hidden',
                    ...focusBoxStyle(['scr-table', 'scr-orbital', 'scr-heatmap'].includes(activeSceneId))
                }}
            >
                {activeSceneId === 'scr-orbital' ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <svg width="260" height="140" viewBox="0 0 260 140">
                            <ellipse cx="130" cy="70" rx="105" ry="52" stroke="rgba(16, 185, 129, 0.3)" strokeDasharray="3 4" fill="none" />
                            <ellipse cx="130" cy="70" rx="65" ry="32" stroke="rgba(56, 189, 248, 0.35)" strokeDasharray="3 4" fill="none" />
                            <circle cx="130" cy="70" r="14" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" />
                            <text x="130" y="73" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="700">CORE</text>
                            {[
                                { s: 'NVDA', x: 52, y: 38, r: 11, c: '#10b981' },
                                { s: 'BTC', x: 205, y: 42, r: 12, c: '#34d399' },
                                { s: 'MSFT', x: 75, y: 98, r: 10, c: '#38bdf8' },
                                { s: 'GLD', x: 188, y: 96, r: 9, c: '#fbbf24' },
                                { s: 'SPX', x: 130, y: 20, r: 10, c: '#a7f3d0' }
                            ].map(n => (
                                <g key={n.s}>
                                    <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} fillOpacity="0.28" stroke={n.c} strokeWidth="1.5" />
                                    <text x={n.x} y={n.y + 3} textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="700">{n.s}</text>
                                </g>
                            ))}
                        </svg>
                    </div>
                ) : activeSceneId === 'scr-heatmap' ? (
                    <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.2fr 1fr', gridTemplateRows: '1fr 1fr', gap: '5px' }}>
                        {[
                            { s: 'NVDA +4.22%', bg: 'rgba(16, 185, 129, 0.38)', span: 'row-span-2' },
                            { s: 'BTC +3.81%', bg: 'rgba(16, 185, 129, 0.32)' },
                            { s: 'MSFT +1.74%', bg: 'rgba(16, 185, 129, 0.22)' },
                            { s: 'TSLA -1.42%', bg: 'rgba(244, 63, 94, 0.32)' },
                            { s: 'AAPL +1.15%', bg: 'rgba(16, 185, 129, 0.20)' },
                            { s: 'GLD +0.95%', bg: 'rgba(16, 185, 129, 0.18)' },
                            { s: 'UST10Y -0.45%', bg: 'rgba(244, 63, 94, 0.22)' }
                        ].map(b => (
                            <div
                                key={b.s}
                                style={{
                                    background: b.bg,
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    fontFamily: 'var(--font-mono)'
                                }}
                            >
                                {b.s}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.6fr 1fr 1fr 1fr 1.3fr', fontSize: '9px', fontWeight: 700, color: '#64748b', fontFamily: 'var(--font-mono)', paddingBottom: '3px', borderBottom: '1px solid rgba(148,163,184,0.14)' }}>
                            <span>TICKER</span>
                            <span>INSTRUMENTO</span>
                            <span>PRECIO</span>
                            <span>24H %</span>
                            <span>Z-SCORE</span>
                            <span>RÉGIMEN HURST</span>
                        </div>
                        {sampleRows.map(r => (
                            <div key={r.sym} style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.6fr 1fr 1fr 1fr 1.3fr', fontSize: '10px', color: '#e2e8f0', fontFamily: 'var(--font-mono)', padding: '2.5px 0', borderBottom: '1px solid rgba(148,163,184,0.07)' }}>
                                <span style={{ fontWeight: 700, color: '#ffffff' }}>{r.sym}</span>
                                <span style={{ color: '#94a3b8' }}>{r.name}</span>
                                <span>{r.price}</span>
                                <span style={{ color: r.up ? '#10b981' : '#f43f5e', fontWeight: 700 }}>{r.chg}</span>
                                <span style={{ color: '#38bdf8' }}>{r.z}</span>
                                <span style={{ color: '#a7f3d0' }}>{r.hurst}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── 3. ESCENARIO REAL DE MARKETS → ANALYTICS ── */
function RealAnalyticsStage({ activeSceneId }) {
    return (
        <div style={{ position: 'absolute', inset: 0, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#030712' }}>
            {/* Cabecera del activo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', borderRadius: '8px', ...focusBoxStyle(activeSceneId === 'ana-hero') }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>NVDA</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>NVIDIA Corporation • NASDAQ</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>$138.40 (+4.22%)</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
                    <span>RSI(14): <strong style={{ color: '#10b981' }}>64.2</strong></span>
                    <span>Hurst: <strong style={{ color: '#38bdf8' }}>0.68</strong></span>
                    <span>Z-Score: <strong style={{ color: '#fbbf24' }}>+2.14σ</strong></span>
                </div>
            </div>

            {/* Centro: Gráfico Técnico + Comparar % a la izquierda y Microestructura a la derecha */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2.1fr 1fr', gap: '8px', minHeight: 0 }}>
                <div style={{ borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...focusBoxStyle(activeSceneId === 'ana-technical' || activeSceneId === 'ana-compare') }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9.5px', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: '#e2e8f0', fontWeight: 700 }}>
                            {activeSceneId === 'ana-compare' ? 'COMPARACIÓN RELATIVA BASE 100 (NVDA vs SPX vs SOXX)' : 'VELAS JAPONESAS + BOLLINGER + MACD'}
                        </span>
                        <span style={{ padding: '1px 6px', borderRadius: '4px', background: activeSceneId === 'ana-compare' ? '#10b981' : 'rgba(148,163,184,0.18)', color: activeSceneId === 'ana-compare' ? '#020617' : '#cbd5e1', fontWeight: 700 }}>
                            Comparar %
                        </span>
                    </div>
                    <svg width="100%" height="95" viewBox="0 0 320 95" preserveAspectRatio="none">
                        <path d="M0,75 Q60,65 110,48 T220,28 T320,14" stroke="#10b981" strokeWidth="2.2" fill="none" />
                        <path d="M0,78 Q60,72 110,60 T220,46 T320,38" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="4 3" fill="none" />
                        {activeSceneId === 'ana-compare' && (
                            <path d="M0,80 Q60,76 110,68 T220,58 T320,50" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
                        )}
                    </svg>
                </div>

                {/* Microestructura & Flujo */}
                <div style={{ borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px', ...focusBoxStyle(activeSceneId === 'ana-micro') }}>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>MICROESTRUCTURA & FLUJO</div>
                    <div style={{ fontSize: '9.5px', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>Imbalance Bid/Ask: <strong style={{ color: '#10b981' }}>+68.4% Compra</strong></div>
                    <div style={{ height: '7px', borderRadius: '999px', background: '#f43f5e', overflow: 'hidden' }}>
                        <div style={{ width: '68%', height: '100%', background: '#10b981' }} />
                    </div>
                    <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        • Exponente Hurst: <strong style={{ color: '#fff' }}>0.68 (Memoria Larga)</strong><br />
                        • Anomalía Vol: <strong style={{ color: '#fbbf24' }}>+2.14σ Activa</strong>
                    </div>
                </div>
            </div>

            {/* Base: Motores 3D/2D */}
            <div style={{ height: '48px', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...focusBoxStyle(activeSceneId === 'ana-engines') }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>MOTORES 3D / 2D • SUPERFICIE DE VOLATILIDAD IMPLÍCITA & ESPACIO DE FASES</span>
                <span style={{ fontSize: '9.5px', color: '#10b981', fontFamily: 'var(--font-mono)' }}>Skew 25Δ: -3.2% • Term Structure Contango</span>
            </div>
        </div>
    );
}

/* ── 4. ESCENARIO REAL DE MARKETS → RESEARCH ── */
function RealResearchStage({ activeSceneId }) {
    return (
        <div style={{ position: 'absolute', inset: 0, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#030712' }}>
            {/* Nota & Postura */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', borderRadius: '8px', ...focusBoxStyle(activeSceneId === 'res-hero') }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '5px', background: 'rgba(16,185,129,0.22)', border: '1px solid #10b981', color: '#10b981', fontSize: '11px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                        SCORE 88 / 100
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#ffffff' }}>POSTURA INSTITUCIONAL: SOBREPONDERAR (OVERWEIGHT)</span>
                </div>
                <span style={{ fontSize: '9.5px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>SEC EDGAR 10-K / 10-Q VERIFIED</span>
            </div>

            {/* Centro: Chat RAG + Factores */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '8px', minHeight: 0 }}>
                <div style={{ borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px', ...focusBoxStyle(activeSceneId === 'res-rag') }}>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>CHAT RAG DOCUMENTAL (SEC FILINGS & NEWS)</div>
                    <div style={{ padding: '5px 8px', borderRadius: '6px', background: 'rgba(15,23,42,0.85)', fontSize: '9.5px', color: '#cbd5e1' }}>
                        <strong>Pregunta:</strong> ¿Qué crecimiento reportó el segmento Data Center en el último 10-Q?
                    </div>
                    <div style={{ padding: '5px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', fontSize: '9.5px', color: '#e2e8f0' }}>
                        <strong>Respuesta RAG:</strong> Ingresos de Data Center subieron +112% YoY impulsados por arquitectura Blackwell [Fuente: SEC Form 10-Q, pág. 24].
                    </div>
                </div>

                <div style={{ borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px', ...focusBoxStyle(activeSceneId === 'res-factors') }}>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>RADAR MULTIFACTOR</div>
                    {[
                        { f: 'Calidad (ROE / ROIC)', v: 94 },
                        { f: 'Momentum (6M / 12M)', v: 91 },
                        { f: 'Crecimiento EPS', v: 89 },
                        { f: 'Valoración Relativa', v: 72 }
                    ].map(row => (
                        <div key={row.f} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', fontSize: '9px', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                            <span>{row.f}</span>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>{row.v}/100</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Base: Pulso FinBERT */}
            <div style={{ height: '46px', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...focusBoxStyle(activeSceneId === 'res-pulse24h') }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>PULSO NLP FINBERT 24H • SENTIMIENTO DE TITULARES</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>84% POSITIVO • 11% NEUTRAL • 5% NEGATIVO</span>
            </div>
        </div>
    );
}

/* ── 5. ESCENARIO REAL DE PORTFOLIO → CONSTRUCTOR (VISTA 1) ── */
function RealPortfolioBuilderStage({ activeSceneId }) {
    return (
        <div style={{ position: 'absolute', inset: 0, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#030712' }}>
            {/* Resumen KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', padding: '5px', borderRadius: '8px', ...focusBoxStyle(activeSceneId === 'p1-pills') }}>
                {[
                    { l: 'RETORNO ESPERADO', v: '+14.8% a.a.', c: '#10b981' },
                    { l: 'RATIO DE SHARPE', v: '1.92', c: '#10b981' },
                    { l: 'VOLATILIDAD ANUAL', v: '11.4%', c: '#38bdf8' },
                    { l: 'MAX DRAWDOWN', v: '-7.2%', c: '#f59e0b' }
                ].map(k => (
                    <div key={k.l} style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(15,23,42,0.8)', fontFamily: 'var(--font-mono)' }}>
                        <div style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 700 }}>{k.l}</div>
                        <div style={{ fontSize: '12px', color: k.c, fontWeight: 800 }}>{k.v}</div>
                    </div>
                ))}
            </div>

            {/* Centro: Ponderación + Radiografía */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '8px', minHeight: 0 }}>
                <div style={{ borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px', ...focusBoxStyle(activeSceneId === 'p1-table') }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                        <span>PONDERACIÓN DE ACTIVOS (100%)</span>
                        <span style={{ color: '#10b981' }}>[Max Sharpe] [Min Var]</span>
                    </div>
                    {[
                        { s: 'UST10Y • US Treasury', w: '25%' },
                        { s: 'NVDA • NVIDIA Corp', w: '22%' },
                        { s: 'GLD • Oro Físico', w: '20%' },
                        { s: 'MSFT • Microsoft', w: '18%' },
                        { s: 'BTC • Bitcoin Spot', w: '15%' }
                    ].map(item => (
                        <div key={item.s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9.5px', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                            <span>{item.s}</span>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>{item.w}</span>
                        </div>
                    ))}
                </div>

                <div style={{ borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px', ...focusBoxStyle(activeSceneId === 'p1-xray') }}>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>RADIOGRAFÍA DE EXPOSICIÓN</div>
                    <div style={{ fontSize: '9.5px', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                        • Renta Variable Tech: <strong>40%</strong><br />
                        • Renta Fija Soberana: <strong>25%</strong><br />
                        • Metales Preciosos: <strong>20%</strong><br />
                        • Activos Digitales: <strong>15%</strong>
                    </div>
                </div>
            </div>

            {/* Base: Calendario + Backtesting */}
            <div style={{ height: '52px', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '8px' }}>
                <div style={{ borderRadius: '8px', padding: '6px 10px', ...focusBoxStyle(activeSceneId === 'p1-calendar') }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>CALENDARIO MENSUAL DE RETORNOS</div>
                    <div style={{ fontSize: '9px', color: '#10b981', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>Ene +2.1% | Feb +3.4% | Mar -0.8% | Abr +4.0%</div>
                </div>
                <div style={{ borderRadius: '8px', padding: '6px 10px', ...focusBoxStyle(activeSceneId === 'p1-backtest') }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>BACKTESTING HISTÓRICO vs BENCHMARK</div>
                    <div style={{ fontSize: '9px', color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>Cartera: +64.2% acum. vs S&P 500: +38.5% (Alfa +25.7%)</div>
                </div>
            </div>
        </div>
    );
}

/* ── 6. ESCENARIO REAL DE PORTFOLIO → RIESGO (VISTA 2) ── */
function RealPortfolioRiskStage({ activeSceneId }) {
    return (
        <div style={{ position: 'absolute', inset: 0, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#030712' }}>
            {/* Fila superior: Markowitz 2D + Tornado & VaR */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '8px', minHeight: 0 }}>
                <div style={{ borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...focusBoxStyle(activeSceneId === 'p2-markowitz') }}>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>FRONTERA EFICIENTE DE MARKOWITZ 2D</div>
                    <svg width="100%" height="85" viewBox="0 0 240 85">
                        <path d="M25,75 Q45,20 215,12" stroke="#10b981" strokeWidth="2.2" fill="none" />
                        <circle cx="115" cy="28" r="5" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="125" y="31" fill="#ffffff" fontSize="8.5" fontWeight="700">★ Portafolio Tangente (Sharpe 1.92)</text>
                    </svg>
                </div>

                <div style={{ borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px', ...focusBoxStyle(activeSceneId === 'p2-tornado') }}>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>TORNADO & VALUE AT RISK (VaR / CVaR)</div>
                    <div style={{ fontSize: '9.5px', color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
                        • VaR 95% (1 día): <strong style={{ color: '#fbbf24' }}>-1.84% (-$18,400)</strong><br />
                        • CVaR 99% (Expected Shortfall): <strong style={{ color: '#f43f5e' }}>-2.95%</strong><br />
                        • Mayor Contribución Marginal: <strong>NVDA (34%)</strong>
                    </div>
                </div>
            </div>

            {/* Fila inferior: Correlación + Choque Markov + Monte Carlo */}
            <div style={{ height: '74px', display: 'grid', gridTemplateColumns: '1fr 1fr 1.15fr', gap: '8px' }}>
                <div style={{ borderRadius: '8px', padding: '6px 9px', ...focusBoxStyle(activeSceneId === 'p2-corr') }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>MATRIZ DE CORRELACIÓN</div>
                    <div style={{ fontSize: '8.5px', color: '#cbd5e1', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
                        NVDA/MSFT: +0.72<br />GLD/SPX: -0.14 (Cobertura)
                    </div>
                </div>
                <div style={{ borderRadius: '8px', padding: '6px 9px', ...focusBoxStyle(activeSceneId === 'p2-shock2d') }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>CHOQUE & CADENAS DE MARKOV</div>
                    <div style={{ fontSize: '8.5px', color: '#cbd5e1', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
                        Alcista: 68% | Lateral: 22%<br />Stress Crisis 2008: -14.2%
                    </div>
                </div>
                <div style={{ borderRadius: '8px', padding: '6px 9px', ...focusBoxStyle(activeSceneId === 'p2-montecarlo') }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>SIMULACIÓN MONTE CARLO (10.000)</div>
                    <div style={{ fontSize: '8.5px', color: '#cbd5e1', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
                        P95: +34.8% | Mediana P50: +14.8%<br />Cola P05 (1 año): -8.4%
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── 7. ESCENARIO REAL DE PORTFOLIO → SIMULADOR AD-HOC (VISTA 3) ── */
function RealPortfolioSimulatorStage({ activeSceneId }) {
    return (
        <div style={{ position: 'absolute', inset: 0, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '7px', background: '#030712' }}>
            {/* Impacto Pre vs Post */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 12px', borderRadius: '8px', ...focusBoxStyle(activeSceneId === 'p3-impact') }}>
                <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>IMPACTO DE LA SIMULACIÓN (PRE vs POST-TRADE)</span>
                <div style={{ display: 'flex', gap: '12px', fontSize: '9.5px', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: '#10b981' }}>Sharpe: <strong>1.92 → 2.08</strong></span>
                    <span style={{ color: '#38bdf8' }}>VaR 95%: <strong>-1.84% → -1.52%</strong></span>
                </div>
            </div>

            {/* Centro: Izquierda (What-If/Kelly + Put OTM/Margen) y Derecha (Comité IA & Libro) */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.1fr 1.1fr', gap: '8px', minHeight: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ flex: 1, borderRadius: '8px', padding: '6px 10px', ...focusBoxStyle(activeSceneId === 'p3-whatif') }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>1. WHAT-IF & CRITERIO DE KELLY</div>
                        <div style={{ fontSize: '8.5px', color: '#cbd5e1', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                            Orden Simulada: Compra +$25,000 GLD • Half-Kelly Óptimo: <strong>14.5%</strong>
                        </div>
                    </div>
                    <div style={{ flex: 1, borderRadius: '8px', padding: '6px 10px', ...focusBoxStyle(activeSceneId === 'p3-tailhedge') }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>2. PUT OTM & MARGEN REG-T</div>
                        <div style={{ fontSize: '8.5px', color: '#cbd5e1', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                            Cobertura SPY Put -10% OTM • Margen Usado: <strong>28% (Buffer -42% a Margin Call)</strong>
                        </div>
                    </div>
                </div>

                <div style={{ borderRadius: '8px', padding: '7px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...focusBoxStyle(activeSceneId === 'p3-committee') }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                        <span>COMITÉ IA (3 AGENTES) & LIBRO</span>
                        <span style={{ color: '#10b981' }}>💬 Copiloto #8</span>
                    </div>
                    <div style={{ fontSize: '8.5px', color: '#e2e8f0', fontFamily: 'var(--font-mono)', lineHeight: 1.45 }}>
                        • <strong>1. Quant Analytics:</strong> APROBADO (Mejora ratio retorno/riesgo)<br />
                        • <strong>2. Fundamental RAG:</strong> APROBADO (Sin alertas SEC 10-Q)<br />
                        • <strong>3. Risk Guardrail:</strong> OK (Ningún activo supera el tope del 25%)
                    </div>
                </div>
            </div>

            {/* Base: Walk-Forward */}
            <div style={{ height: '46px', borderRadius: '8px', padding: '5px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...focusBoxStyle(activeSceneId === 'p3-walkforward') }}>
                <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>VALIDACIÓN WALK-FORWARD (IN-SAMPLE ENTRENAMIENTO vs OUT-OF-SAMPLE PURO)</span>
                <span style={{ padding: '2px 7px', borderRadius: '4px', background: 'rgba(16,185,129,0.22)', color: '#10b981', fontSize: '9.5px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    EFICIENCIA WFE: 82.4% (ROBISTO)
                </span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL DE ESCENARIO INTERACTIVO 16:9 + ORBE 4D EN PIP
   ═══════════════════════════════════════════════════════════════════════════ */
export default function GuideInteractiveVideoStage({
    page,
    typo,
    isES,
    audioPlaying,
    currentTime,
    progressPct,
    animClock,
    speechEnergy,
    onToggleAudio,
    onJumpToScene,
    OrbCharacterComponent
}) {
    const scenes = GUIDE_VIDEO_SCENES_BY_PAGE[page?.id] || GUIDE_VIDEO_SCENES_BY_PAGE.home;
    const activeSceneIdx = Math.max(
        0,
        scenes.findIndex(s => progressPct >= s.startPct && progressPct < s.endPct)
    );
    const activeScene = scenes[activeSceneIdx] || scenes[0];

    const renderPageRealStage = () => {
        switch (page?.id) {
            case 'home':
                return <RealHomeCanvasStage activeSceneId={activeScene.id} isES={isES} animClock={animClock} />;
            case 'mkt-screener':
                return <RealScreenerStage activeSceneId={activeScene.id} isES={isES} />;
            case 'mkt-analytics':
                return <RealAnalyticsStage activeSceneId={activeScene.id} isES={isES} />;
            case 'mkt-research':
                return <RealResearchStage activeSceneId={activeScene.id} isES={isES} />;
            case 'port-v1':
                return <RealPortfolioBuilderStage activeSceneId={activeScene.id} isES={isES} />;
            case 'port-v2':
                return <RealPortfolioRiskStage activeSceneId={activeScene.id} isES={isES} />;
            case 'port-v3':
                return <RealPortfolioSimulatorStage activeSceneId={activeScene.id} isES={isES} />;
            default:
                return <RealHomeCanvasStage activeSceneId={activeScene.id} isES={isES} animClock={animClock} />;
        }
    };

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                background: '#020617',
                borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Barra superior de capítulos clicables del video */}
            <div
                style={{
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
                        {isES
                            ? `Recorrido Visual en Vivo • ${page.label}`
                            : `Live Visual Walkthrough • ${page.label}`}
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

            {/* Lienzo 16:9 con la vista real del módulo + Cursor animado + Presentador Orbe 4D */}
            <div
                onClick={onToggleAudio}
                title={isES ? 'Hacé clic para reproducir o pausar el recorrido guiado' : 'Click to play or pause the guided walkthrough'}
                style={{
                    position: 'relative',
                    aspectRatio: '16 / 9',
                    maxHeight: '420px',
                    width: '100%',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    userSelect: 'none',
                    background: '#000000'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        transform: audioPlaying || currentTime > 0 ? activeScene.cameraTransform : 'scale(1)',
                        transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                >
                    {renderPageRealStage()}

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
                </div>

                {/* PRESENTADOR ORBE 4D EN PICTURE-IN-PICTURE (SE CAMBIA DE LADO PARA NO TAPAR CONTROLES) */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '46px',
                        left: activeScene.dockSide === 'left' ? '16px' : 'auto',
                        right: activeScene.dockSide === 'right' ? '16px' : 'auto',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '6px 10px',
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
                        size={106}
                        isSpeaking={audioPlaying}
                        speechEnergy={speechEnergy}
                        currentTime={animClock}
                        lookAtX={activeScene.lookAtX}
                        lookAtY={activeScene.lookAtY}
                    />
                </div>

                {/* SUBTÍTULOS SINCRONIZADOS (CC) EN LA BASE DEL VIDEO */}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '8px',
                        transform: 'translateX(-50%)',
                        zIndex: 21,
                        maxWidth: '92%',
                        padding: '4px 13px',
                        borderRadius: '999px',
                        background: 'rgba(2, 6, 23, 0.90)',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        color: '#f8fafc',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.75)'
                    }}
                >
                    <span style={{ color: 'var(--ui-accent, #10b981)', fontWeight: 700, marginRight: '6px', fontFamily: 'var(--font-mono)' }}>
                        [{activeScene.short}]
                    </span>
                    <span>{isES ? activeScene.captionES : activeScene.captionEN}</span>
                </div>
            </div>
        </div>
    );
}

