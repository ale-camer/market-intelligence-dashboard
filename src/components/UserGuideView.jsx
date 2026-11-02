import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Layers,
  Cpu,
  Compass,
  ShieldCheck,
  Search,
  Sparkles,
} from 'lucide-react';

export default function UserGuideView({ langCode = 'ES', onGoBack, onLaunchTarget }) {
  const isES = langCode === 'ES';
  const [activeChapter, setActiveChapter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const chapters = [
    { id: 'ALL', label: isES ? 'Todos (22 Objetos)' : 'All (22 Objects)', icon: Sparkles },
    { id: 'ui-objects', label: isES ? '1. Pantallas y Objetos UI' : '1. Screens & UI Objects', icon: Compass },
    { id: 'asset-classes', label: isES ? '2. Las 10 Clases de Activos' : '2. The 10 Asset Classes', icon: Layers },
    { id: 'quant-engines', label: isES ? '3. Motores 3D/2D y Fórmulas' : '3. 3D/2D Engines & Formulas', icon: Cpu },
    { id: 'risk-and-ai', label: isES ? '4. Riesgo Quant, VaR e IA' : '4. Quant Risk, VaR & AI', icon: ShieldCheck },
  ];

  const guideEntries = useMemo(
    () => [
      // CHAPTER 1: UI OBJECTS & SCREENS
      {
        id: 'ui-home-stage',
        chapter: 'ui-objects',
        badge: isES ? 'PANTALLA • HOME' : 'SCREEN • HOME',
        title: isES
          ? 'Home Stage: Campo Profundo, Lanzadores 3D/2D y Pulso Macro'
          : 'Home Stage: Deep Field, 3D/2D Launchers & Macro Pulse',
        formula: '3 Layouts Seleccionables: Bento Grid • Split Workstation • Minimal HUD',
        summary: isES
          ? 'Puerta de entrada ejecutiva sobre el lienzo cósmico interactivo (Webb Deep Field). Incluye 6 tarjetas de acceso directo a los motores cuantitativos 3D/2D, guía operativa de 3 pasos y cinta inferior con el pulso macro en vivo.'
          : 'Executive entry stage over the interactive Webb Deep Field canvas. Features 6 direct launcher cards to the 3D/2D quant engines, a 3-step operational guide, and a live macro pulse bottom strip.',
        points: isES
          ? [
              'Selector superior de diseño (Bento / Split / Minimal HUD) persistido en localStorage.',
              'Acceso directo en 1 clic a Superficie IV 3D, Curva Soberana 3D/2D, Payoffs, FX y Portfolio.',
              'Cinta Macro inferior con S&P 500, UST 10Y, DXY, VIX, BTC y % de activos en Régimen Normal P-06.',
            ]
          : [
              'Top layout model selector (Bento / Split / Minimal HUD) persisted in localStorage.',
              '1-click direct access to 3D IV Surface, 3D/2D Sovereign Curve, Payoffs, FX, and Portfolio.',
              'Bottom Macro strip with S&P 500, UST 10Y, DXY, VIX, BTC, and % of assets in P-06 Normal Regime.',
            ],
        targetLabel: isES ? 'Ir a Home Stage' : 'Go to Home Stage',
        target: { view: 'home' },
      },
      {
        id: 'ui-markets-l1',
        chapter: 'ui-objects',
        badge: isES ? 'MARKETS • NIVEL 1' : 'MARKETS • LEVEL 1',
        title: isES
          ? 'Screener Multi-Activo (Table, Orbital y Heatmap) + Accesos Rápidos'
          : 'Multi-Asset Screener (Table, Orbital & Heatmap) + Quick Shortcuts',
        formula: '213 Activos Únicos • 10 Categorías • Filtro ★ Watchlist Sincronizado',
        summary: isES
          ? 'Explorador global del universo filtrado por liquidez. Permite alternar entre Tabla Institucional con columnas específicas por categoría, Mapa Orbital de Anomalías y Heatmap proporcional por capitalización/volumen.'
          : 'Global liquidity-filtered universe explorer. Switch between Institutional Table with category-specific columns, Anomaly Orbital Map, and proportional Market-Cap/Volume Heatmap.',
        points: isES
          ? [
              '4 botones de acceso rápido alineados a la derecha hacia los motores cuantitativos más populares.',
              'Estrella ★ en cada fila para marcar/desmarcar activos en la Watchlist persistente.',
              'Tarjetas superiores de pulso agregado (Total Activos, Normal, Elevated y Dislocation).',
            ]
          : [
              '4 right-aligned quick shortcut buttons to the most popular quantitative engines.',
              'Star ★ on every row to bookmark/unbookmark assets into the persistent Watchlist.',
              'Top aggregated regime pulse cards (Total Assets, Normal, Elevated, and Dislocation).',
            ],
        targetLabel: isES ? 'Abrir Screener (Nivel 1)' : 'Open Screener (Level 1)',
        target: { view: 'markets', mode: 'screener' },
      },
      {
        id: 'ui-markets-l2',
        chapter: 'ui-objects',
        badge: isES ? 'MARKETS • NIVEL 2' : 'MARKETS • LEVEL 2',
        title: isES
          ? 'Workstation de Activo: Analytics (4 Lentes) vs Research (FinBERT & RAG)'
          : 'Asset Workstation: Analytics (4 Lenses) vs Research (FinBERT & RAG)',
        formula: 'Horizontes 1D • 1W • 1M • 1Y • ALL + Comparador A vs B + Deep-Linking URL',
        summary: isES
          ? 'Al seleccionar cualquier activo en Nivel 1 se abre su estación dedicada dividida en dos grandes áreas: Analytics (Price Action, Factor Decomposition, Microstructure y el 4° lente de Motores 3D/2D) y Research (Sentimiento NLP, Tesis Bull/Bear y RAG).'
          : 'Selecting any asset in Level 1 opens its dedicated workstation split into two main areas: Analytics (Price Action, Factor Decomposition, Microstructure, and the 4th 3D/2D Engine lens) and Research (NLP Sentiment, Bull/Bear Thesis, and RAG).',
        points: isES
          ? [
              'Bandas estadísticas σ (±1σ, ±2σ), medias móviles (SMA 20/50/200) y sub-panel RSI(14) / MACD.',
              'Comparador relativo normalizado (% base 0) restringido a activos compatibles.',
              'URL canónica única por lente y sub-vista para auditoría directa.',
            ]
          : [
              'Statistical σ bands (±1σ, ±2σ), moving averages (SMA 20/50/200), and RSI(14) / MACD sub-chart.',
              'Normalized relative comparator (% base 0) restricted to compatible asset classes.',
              'Unique canonical URL per lens and sub-view for direct auditing.',
            ],
        targetLabel: isES ? 'Abrir NVDA en Nivel 2' : 'Open NVDA in Level 2',
        target: { view: 'markets', mode: 'detail', asset: 'NVDA', section: 'analytics', lens: 'price' },
      },
      {
        id: 'ui-color-semantics',
        chapter: 'ui-objects',
        badge: isES ? 'REGLA VISUAL • COLOR' : 'VISUAL RULE • COLOR',
        title: isES
          ? 'Semántica Estricta de Color Financiero (Verde Alcista / Rojo Bajista)'
          : 'Strict Financial Color Semantics (Bullish Green / Bearish Red)',
        formula: 'Positivo / Saludable = #10b981 • Negativo / Alerta / Dislocación = #f43f5e',
        summary: isES
          ? 'Toda la aplicación respeta una regla cromática inquebrantable para evitar ambigüedad visual: el verde esmeralda (#10b981) indica retornos positivos, carry favorable o régimen normal; el rojo coral (#f43f5e) indica pérdidas, anomalías o alertas.'
          : 'The entire application enforces an unbreakable chromatic rule to eliminate visual ambiguity: emerald green (#10b981) denotes positive returns, favorable carry, or normal regime; rose red (#f43f5e) denotes losses, anomalies, or alerts.',
        points: isES
          ? [
              'Aplicado en velas, curvas de payoff P&L, pendientes soberanas 2s10s, matriz de correlación y Comité IA.',
              'Los datos neutros o estructurales utilizan blanco puro (#ffffff) o gris pizarra.',
            ]
          : [
              'Applied across candles, P&L payoff curves, 2s10s sovereign slopes, correlation matrix, and AI Committee.',
              'Neutral or structural telemetry uses crisp white (#ffffff) or slate gray.',
            ],
        targetLabel: isES ? 'Ver en Portfolio' : 'View in Portfolio',
        target: { view: 'portfolio' },
      },

      // CHAPTER 2: THE 10 ASSET CLASSES
      {
        id: 'class-equities-etfs-indices',
        chapter: 'asset-classes',
        badge: isES ? 'CLASES 01–03 • RENTA VARIABLE' : 'CLASSES 01–03 • EQUITIES & INDICES',
        title: isES
          ? 'Equities (70), ETFs (24) e Indices (19): Métricas de Valuación y Flujo'
          : 'Equities (70), ETFs (24) & Indices (19): Valuation & Flow Metrics',
        formula: 'Columnas: P/E Fwd • EV/EBITDA • Rev Growth • Beta • Short % • AUM • Net Flow',
        summary: isES
          ? 'Cobertura de las mayores acciones del S&P 500 y Nasdaq 100, ETFs sectoriales/factoriales e índices globales de referencia. Al filtrar cualquiera de estas categorías en la tabla de Nivel 1 se activan sus columnas institucionales específicas.'
          : 'Coverage of top S&P 500 and Nasdaq 100 equities, sector/factor ETFs, and global benchmark indices. Filtering any of these categories in the Level 1 table activates its category-specific institutional columns.',
        points: isES
          ? [
              'Equities: Market Cap, P/E Forward, EV/EBITDA, Crecimiento de Ingresos YoY, Beta (1Y) y % Short Float.',
              'ETFs: AUM ($B), Expense Ratio (bps), Flujo Neto 30D ($M), Tracking Error y Dividend Yield.',
              'Indices: Puntos, Retorno YTD, P/E Agregado, Breadth (% > 200d MA) y Realized Vol 30D.',
            ]
          : [
              'Equities: Market Cap, Forward P/E, EV/EBITDA, YoY Revenue Growth, Beta (1Y), and Short Float %.',
              'ETFs: AUM ($B), Expense Ratio (bps), 30D Net Flow ($M), Tracking Error, and Dividend Yield.',
              'Indices: Index Points, YTD Return, Aggregate P/E, Breadth (% > 200d MA), and 30D Realized Vol.',
            ],
        targetLabel: isES ? 'Filtrar Equities en Screener' : 'Filter Equities in Screener',
        target: { view: 'markets', mode: 'screener', cat: 'Equities' },
      },
      {
        id: 'class-rates-ust-cash',
        chapter: 'asset-classes',
        badge: isES ? 'CLASES 04–06 • RENTA FIJA & LIQUIDEZ' : 'CLASSES 04–06 • FIXED INCOME & CASH',
        title: isES
          ? 'Rates & Curves (18), US Treasuries (6) y Cash & SOFR (6)'
          : 'Rates & Curves (18), US Treasuries (6) & Cash & SOFR (6)',
        formula: 'DV01 = −(∂P / ∂y) × 0.0001 • Real Yield = Nominal 10Y − CPI YoY',
        summary: isES
          ? 'Monitoreo de bonos soberanos globales (con motor interactivo para 42 países desde 3M hasta 30Y), curva completa del Tesoro de EE.UU. y tasas monetarias overnight (SOFR, EFFR, Reverse Repo).'
          : 'Monitoring of global sovereign bonds (with interactive 3M–30Y engine across 42 countries), full US Treasury benchmark curve, and overnight money market rates (SOFR, EFFR, Reverse Repo).',
        points: isES
          ? [
              'Rates & Curves: Yield Actual (%), Cambio diario (bps), Spread 2s10s (bps), Inflación CPI YoY y Tasa Real.',
              'US Treasuries: Tenor, Yield, Modified Duration (años), Convexidad y sensibilidad DV01 ($ por $1M).',
              'Cash & SOFR: Tasa Anualizada, Spread vs Fed Funds Target, Volumen Diario ($B) y Liquidez RRP.',
            ]
          : [
              'Rates & Curves: Current Yield (%), Daily Change (bps), 2s10s Spread (bps), YoY CPI, and Real Yield.',
              'US Treasuries: Tenor, Yield, Modified Duration (years), Convexity, and DV01 sensitivity ($ per $1M).',
              'Cash & SOFR: Annualized Rate, Spread vs Fed Funds Target, Daily Volume ($B), and RRP Liquidity.',
            ],
        targetLabel: isES ? 'Abrir Curva Soberana (US10Y)' : 'Open Sovereign Curve (US10Y)',
        target: {
          view: 'markets',
          mode: 'detail',
          asset: 'US10Y',
          section: 'analytics',
          lens: 'derivatives',
          sub: '2d-curve',
          country: 'US',
        },
      },
      {
        id: 'class-fx-commodities-crypto-derivs',
        chapter: 'asset-classes',
        badge: isES ? 'CLASES 07–10 • MACRO, CRYPTO & VOL' : 'CLASSES 07–10 • MACRO, CRYPTO & VOL',
        title: isES
          ? 'FX (15 pares + 61 divisas), Commodities (19), Crypto (20) y Derivatives (16)'
          : 'FX (15 pairs + 61 currencies), Commodities (19), Crypto (20) & Derivatives (16)',
        formula: 'Carry 10Y = r_base − r_quote • Roll Yield = (F_spot − F_6M) / F_spot',
        summary: isES
          ? 'Activos globales de divisas G10/EM, materias primas (Energía, Metales, Agricultura), criptoactivos de alta capitalización y contratos de volatilidad/opciones.'
          : 'Global G10/EM currency pairs, commodities (Energy, Metals, Agriculture), large-cap crypto assets, and volatility/options contracts.',
        points: isES
          ? [
              'FX Currencies: Spot, Diferencial de Tasas 10Y (Carry bps), Implied Vol 1M y Banco Central.',
              'Commodities: Precio Spot, Estructura Temporal (Contango / Backwardation), Roll Yield Anualizado e Inventarios.',
              'Crypto & Derivatives: Funding Rate 8h, Open Interest ($B), IV Percentile (1Y), 25Δ Skew y Net GEX.',
            ]
          : [
              'FX Currencies: Spot, 10Y Rate Differential (Carry bps), 1M Implied Vol, and Central Bank.',
              'Commodities: Spot Price, Term Structure (Contango / Backwardation), Annualized Roll Yield, and Inventories.',
              'Crypto & Derivatives: 8h Funding Rate, Open Interest ($B), IV Percentile (1Y), 25Δ Skew, and Net GEX.',
            ],
        targetLabel: isES ? 'Abrir Superficie IV 3D (NVDA-OPT)' : 'Open 3D IV Surface (NVDA-OPT)',
        target: {
          view: 'markets',
          mode: 'detail',
          asset: 'NVDA-OPT',
          section: 'analytics',
          lens: 'derivatives',
          sub: 'surface3d',
        },
      },

      // CHAPTER 3: 3D/2D QUANTITATIVE ENGINES & FORMULAS
      {
        id: 'engine-vol-surface-3d',
        chapter: 'quant-engines',
        badge: isES ? 'MOTOR 3D • VOLATILIDAD IMPLÍCITA' : '3D ENGINE • IMPLIED VOLATILITY',
        title: isES
          ? 'Superficie de Volatilidad Implícita 3D y Cortes Transversales (Smile & Term Structure)'
          : '3D Implied Volatility Surface & Cross-Sectional Slices (Smile & Term Structure)',
        formula: 'σ_imp(m, τ) = σ_ATM(τ) + α(τ)·(m − 1) + β(τ)·(m − 1)²',
        summary: isES
          ? 'Representación volumétrica 3D interactiva donde el Eje X es el Strike / Moneyness (80% a 120% Spot), el Eje Y es el Tiempo a Vencimiento (DTE: 7D a 180D) y el Eje Z (altura y color) es la Volatilidad Implícita anualizada.'
          : 'Interactive 3D volumetric mesh where the X-axis is Strike / Moneyness (80% to 120% Spot), the Y-axis is Days to Expiration (DTE: 7D to 180D), and the Z-axis (height and color) is annualized Implied Volatility.',
        points: isES
          ? [
              'Rotación orbital libre (Yaw / Pitch con mouse drag), zoom y 4 presets de cámara (Isometric, Skew, Term, Top).',
              'Al hacer clic en cualquier nodo (X, Y) se actualizan debajo los dos cortes 2D exactos: Smile por Strike y Estructura Temporal por DTE.',
              'Métricas clave: 25Δ Put-Call Skew, Net Gamma Exposure (GEX), Max Pain Strike y Straddle Breakeven (±%).',
            ]
          : [
              'Free orbital rotation (Yaw / Pitch mouse drag), zoom, and 4 camera presets (Isometric, Skew, Term, Top).',
              'Clicking any (X, Y) node updates the two exact 2D cross-sections below: Strike Smile and DTE Term Structure.',
              'Key metrics: 25Δ Put-Call Skew, Net Gamma Exposure (GEX), Max Pain Strike, and Straddle Breakeven (±%).',
            ],
        targetLabel: isES ? 'Lanzar Superficie 3D (NVDA-OPT)' : 'Launch 3D Surface (NVDA-OPT)',
        target: {
          view: 'markets',
          mode: 'detail',
          asset: 'NVDA-OPT',
          section: 'analytics',
          lens: 'derivatives',
          sub: 'surface3d',
        },
      },
      {
        id: 'engine-options-payoff',
        chapter: 'quant-engines',
        badge: isES ? 'MOTOR P&L • OPCIONES Y SINTÉTICOS' : 'P&L ENGINE • OPTIONS & SYNTHETICS',
        title: isES
          ? 'Diagramas de Payoff P&L (8 Estrategias) y Griegas de Primer Orden (Δ, Γ, Θ, ν)'
          : 'P&L Payoff Diagrams (8 Strategies) & First-Order Greeks (Δ, Γ, Θ, ν)',
        formula: 'Sintético Largo: Call(K) − Put(K) = S_T − K·e^(−rT) (Paridad Put-Call)',
        summary: isES
          ? 'Simulador interactivo de estructuras de derivados que superpone la curva sólida al vencimiento (At Expiration) con la curva punteada de valor teórico hoy (T+0 Black-Scholes).'
          : 'Interactive derivatives structure simulator overlaying the solid At-Expiration payoff curve with the dashed theoretical T+0 Black-Scholes curve.',
        points: isES
          ? [
              '8 Estrategias: Long Call, Long Put, Bull Call Spread, Long Straddle, Iron Condor, Covered Call, Protective Put y Long Synthetic Future.',
              'Sliders de Choque de Volatilidad Implícita (IV Shock −20% a +20%) y Días a Vencimiento (DTE).',
              'Griegas en vivo: Delta (Δ direccional), Gamma (Γ convexidad), Theta (Θ decaimiento diario $) y Vega (ν sensibilidad a 1% IV).',
            ]
          : [
              '8 Strategies: Long Call, Long Put, Bull Call Spread, Long Straddle, Iron Condor, Covered Call, Protective Put, and Long Synthetic Future.',
              'Interactive Implied Volatility Shock (−20% to +20%) and Days to Expiration (DTE) sliders.',
              'Live Greeks: Delta (Δ directional), Gamma (Γ convexity), Theta (Θ daily $ decay), and Vega (ν sensitivity to 1% IV).',
            ],
        targetLabel: isES ? 'Abrir Motor Payoff P&L' : 'Open P&L Payoff Engine',
        target: {
          view: 'markets',
          mode: 'detail',
          asset: 'NVDA-OPT',
          section: 'analytics',
          lens: 'derivatives',
          sub: 'payoff',
        },
      },
      {
        id: 'engine-sovereign-yield-3d',
        chapter: 'quant-engines',
        badge: isES ? 'MOTOR 3D/2D • CURVAS SOBERANAS' : '3D/2D ENGINE • SOVEREIGN CURVES',
        title: isES
          ? 'Superficie y Curva de Bonos Soberanos (42 Países • 3M a 30Y)'
          : 'Sovereign Yield Surface & Curve (42 Countries • 3M to 30Y)',
        formula: '2s10s = (Y_10Y − Y_2Y) × 100 bps • Butterfly 2s5s10s = 2·Y_5Y − (Y_2Y + Y_10Y)',
        summary: isES
          ? 'Permite inspeccionar tanto la curva 2D actual como la evolución histórica 3D (Tenor × Época Histórica × Yield %) para 42 emisores soberanos de América, Europa, Asia-Pacífico y Medio Oriente/África.'
          : 'Inspect both the current 2D term structure and the 3D historical evolution (Tenor × Historical Epoch × Yield %) across 42 sovereign issuers in the Americas, Europe, Asia-Pacific, and MEA.',
        points: isES
          ? [
              'Pendiente 2s10s y 3m10y: valores negativos (< 0 bps, en rojo) señalan inversión de curva y alerta recesiva.',
              'Comparador directo contra benchmark (US Treasury o German Bund) y superposición de curva hace 1 Mes / 1 Año.',
              'Cálculo automático de Tasa Real 10Y (descontando inflación CPI YoY) y sensibilidad DV01 por cada $1M nocional.',
            ]
          : [
              '2s10s and 3m10y slopes: negative values (< 0 bps, in red) signal curve inversion and recession warning.',
              'Direct benchmark overlay (vs US Treasury or German Bund) and 1-Month / 1-Year historical comparison.',
              'Automatic 10Y Real Yield calculation (net of YoY CPI inflation) and DV01 sensitivity per $1M notional.',
            ],
        targetLabel: isES ? 'Abrir Superficie Soberana 3D' : 'Open 3D Sovereign Surface',
        target: {
          view: 'markets',
          mode: 'detail',
          asset: 'US10Y',
          section: 'analytics',
          lens: 'derivatives',
          sub: '3d-history',
          country: 'US',
        },
      },
      {
        id: 'engine-fx-and-commodities',
        chapter: 'quant-engines',
        badge: isES ? 'MOTORES MACRO • FX & COMMODITIES' : 'MACRO ENGINES • FX & COMMODITIES',
        title: isES
          ? 'Triangulador FX de 61 Monedas y Superficie Forward 3D de Commodities'
          : '61-Currency FX Triangulator & 3D Commodity Forward Surface',
        formula: 'FX Cross(A/B) = Rate(USD/B) / Rate(USD/A) • F(T) = S₀ · e^((r + u − y)·T)',
        summary: isES
          ? 'En activos FX permite convertir cualquier monto entre 61 monedas mundiales vía triangulación USD y medir el diferencial Carry 10Y. En Commodities modela la estructura Spot a 24M (Contango vs Backwardation) en 2D y 3D.'
          : 'In FX assets, convert any amount across 61 world currencies via USD triangulation and measure 10Y Carry differentials. In Commodities, model the Spot-to-24M forward structure (Contango vs Backwardation) in 2D and 3D.',
        points: isES
          ? [
              'Botón de inversión instantánea Base ⇄ Cotizada y tabla de equivalencias frente a las 8 grandes reservas (G8).',
              'En Commodities: Backwardation (Spot > Forward, verde) genera Roll Yield positivo; Contango (Spot < Forward) implica costo de acarreo.',
            ]
          : [
              'Instant Base ⇄ Quote swap button and live equivalence table against the 8 major reserve currencies (G8).',
              'In Commodities: Backwardation (Spot > Forward, green) yields positive roll return; Contango (Spot < Forward) implies storage drag.',
            ],
        targetLabel: isES ? 'Abrir Triangulador FX (EUR/USD)' : 'Open FX Triangulator (EUR/USD)',
        target: {
          view: 'markets',
          mode: 'detail',
          asset: 'EUR/USD',
          section: 'analytics',
          lens: 'derivatives',
        },
      },

      // CHAPTER 4: PORTFOLIO QUANT RISK, VaR, CORRELATION & AI
      {
        id: 'risk-var-cvar-correlation',
        chapter: 'risk-and-ai',
        badge: isES ? 'RIESGO DE CARTERA • VaR & MATRIZ r' : 'PORTFOLIO RISK • VaR & MATRIX r',
        title: isES
          ? 'VaR Paramétrico (95%, 1D), CVaR (99%) y Matriz de Correlación Cruzada'
          : 'Parametric VaR (95%, 1D), CVaR (99%) & Cross-Correlation Matrix',
        formula: 'σ_p = √(wᵀ · Σ · w) • VaR_{95%, 1D} = NAV × 1.645 × (σ_p / √252)',
        summary: isES
          ? 'Panel cuantitativo integrado en Portfolio que calcula en tiempo real la pérdida máxima esperada a 1 día con 95% de confianza (VaR), el Expected Shortfall al 99% (CVaR), el beneficio monetario de diversificación y la matriz NxN de correlaciones.'
          : 'Quantitative panel integrated in Portfolio computing real-time 1-day 95% Value at Risk (VaR), 99% Expected Shortfall (CVaR), monetary diversification benefit, and the NxN cross-correlation matrix.',
        points: isES
          ? [
              'Beneficio de Diversificación ($): ahorro de riesgo diario logrado gracias a correlaciones cruzadas r < 1.00.',
              'Matriz de Correlación (r ∈ [-1.00, +1.00]): colorea en verde los pares descorrelacionados (< 0.45) y en rojo las concentraciones (≥ 0.70).',
              'Beta Ponderado (vs SPY), Volatilidad Anualizada de la cartera (%) y Sharpe Ratio (sobre tasa libre de riesgo Rf = 4.30%).',
            ]
          : [
              'Diversification Benefit ($): daily risk reduction achieved through cross-correlations r < 1.00.',
              'Correlation Matrix (r ∈ [-1.00, +1.00]): highlights diversified pairs (< 0.45) in green and concentrated pairs (≥ 0.70) in red.',
              'Weighted Beta (vs SPY), Annualized Portfolio Volatility (%), and Sharpe Ratio (over risk-free rate Rf = 4.30%).',
            ],
        targetLabel: isES ? 'Abrir Riesgo y Matriz en Portfolio' : 'Open Risk & Matrix in Portfolio',
        target: { view: 'portfolio' },
      },
      {
        id: 'ai-p06-finbert-rag-committee',
        chapter: 'risk-and-ai',
        badge: isES ? 'INTELIGENCIA ARTIFICIAL • P-06 & RAG' : 'ARTIFICIAL INTELLIGENCE • P-06 & RAG',
        title: isES
          ? 'Régimen P-06 (Isolation Forest), Sentimiento FinBERT, RAG y Comité de 3 Pilares'
          : 'P-06 Regime (Isolation Forest), FinBERT Sentiment, RAG & 3-Pillar Committee',
        formula: 'P-06 Score ∈ [0, 1]: Normal (< 0.35) • Elevated (0.35–0.50) • Dislocation (≥ 0.50)',
        summary: isES
          ? 'Ecosistema de modelos cuantitativos y de lenguaje natural: detección de anomalías estructurales P-06, clasificación FinBERT sobre cables de noticias, buscador RAG con Guardrail de 3 capas y deliberación auditable de cartera.'
          : 'Quantitative and NLP model ecosystem: P-06 structural anomaly detection, FinBERT news wire classification, 3-layer guardrailed RAG search, and auditable portfolio deliberation.',
        points: isES
          ? [
              'Guardrail Automático de Cartera: cualquier activo con anomalía P-06 ≥ 0.65 (ej. SOL) queda bloqueado a un tope máximo de 5.0% del NAV.',
              'Tope Institucional por Posición: ningún activo individual puede superar el 20.0% del NAV ($21,284 en el simulador).',
              'Buscador RAG en Research: valida alcance financiero (Capa 1), fundamentación en documentos recuperados (Capa 2) y bloqueo de alucinaciones (Capa 3).',
            ]
          : [
              'Automated Portfolio Guardrail: any asset with P-06 anomaly ≥ 0.65 (e.g., SOL) is automatically capped at 5.0% of NAV.',
              'Institutional Single-Asset Cap: no individual position can exceed 20.0% of NAV ($21,284 in the sandbox).',
              'RAG Search in Research: enforces financial scope (Layer 1), retrieved document grounding (Layer 2), and hallucination blocking (Layer 3).',
            ],
        targetLabel: isES ? 'Probar FinBERT & RAG en Research' : 'Test FinBERT & RAG in Research',
        target: { view: 'markets', mode: 'detail', asset: 'NVDA', section: 'research' },
      },
    ],
    [isES]
  );

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return guideEntries.filter((entry) => {
      if (activeChapter !== 'ALL' && entry.chapter !== activeChapter) return false;
      if (!q) return true;
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.formula.toLowerCase().includes(q) ||
        entry.points.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [guideEntries, activeChapter, searchQuery]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.05rem',
        maxWidth: '1240px',
        width: '100%',
        margin: '0 auto',
        paddingBottom: '2rem',
      }}
    >
      {/* Top Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.1rem 1.35rem',
          borderRadius: '20px',
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.14) 0%, rgba(13, 19, 33, 0.82) 65%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <span
              className="mono-metric"
              style={{
                fontSize: '0.6rem',
                fontWeight: 800,
                padding: '0.16rem 0.65rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                color: '#10b981',
              }}
            >
              {isES ? 'MANUAL OFICIAL & DICCIONARIO CUANTITATIVO' : 'OFFICIAL MANUAL & QUANTITATIVE DICTIONARY'}
            </span>
            <span className="mono-metric" style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 700 }}>
              {isES
                ? '10 CLASES • MOTORES 3D/2D • FÓRMULAS • VaR & IA'
                : '10 CLASSES • 3D/2D ENGINES • FORMULAS • VaR & AI'}
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
            }}
          >
            <BookOpen size={20} style={{ color: '#10b981' }} />
            {isES
              ? 'Guía Interactiva de Usuario, Fórmulas Cuantitativas y Objetos de la App'
              : 'Interactive User Guide, Quantitative Formulas & App Objects'}
          </h1>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, maxWidth: '860px', lineHeight: 1.48 }}>
            {isES
              ? 'Explorá cada pantalla, clase de activo, superficie volumétrica 3D, fórmula de derivados y métrica de riesgo de cartera. Usá los botones "Abrir ↗" en cada tarjeta para saltar directamente al objeto en vivo.'
              : 'Explore every screen, asset class, 3D volumetric surface, derivatives formula, and portfolio risk metric. Use the "Launch ↗" button on any card to jump directly to the live object.'}
          </p>
        </div>

        {onGoBack && (
          <button
            type="button"
            onClick={onGoBack}
            className="mono-metric"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.95rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={14} />
            {isES ? 'Volver' : 'Back'}
          </button>
        )}
      </div>

      {/* Filter & Instant Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderRadius: '16px',
          backgroundColor: 'rgba(13, 19, 33, 0.78)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* 5 Chapter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {chapters.map((ch) => {
            const IconComp = ch.icon;
            const active = activeChapter === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChapter(ch.id)}
                className="mono-metric"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.34rem 0.78rem',
                  borderRadius: '999px',
                  border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: active ? '#10b981' : 'var(--text-muted)',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <IconComp size={12} />
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.34rem 0.75rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(6, 10, 19, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            minWidth: '270px',
          }}
        >
          <Search size={13} style={{ color: 'var(--text-dim)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isES
                ? 'Buscar fórmula, VaR, 3D, DV01, P-06, FX...'
                : 'Search formula, VaR, 3D, DV01, P-06, FX...'
            }
            className="mono-metric"
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.64rem',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))',
          gap: '0.9rem',
        }}
      >
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            style={{
              padding: '1.1rem 1.25rem',
              borderRadius: '18px',
              backgroundColor: 'rgba(13, 19, 33, 0.76)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.65rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="mono-metric" style={{ fontSize: '0.58rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.04em' }}>
                  {entry.badge}
                </span>

                {onLaunchTarget && entry.target && (
                  <button
                    type="button"
                    onClick={() => onLaunchTarget(entry.target)}
                    className="mono-metric"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.22rem 0.65rem',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(16, 185, 129, 0.16)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#10b981',
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <span>{entry.targetLabel}</span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{entry.title}</div>

              {/* Formula / Quantitative Specification Pill */}
              <div
                className="mono-metric"
                style={{
                  padding: '0.38rem 0.65rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(6, 10, 19, 0.78)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#10b981',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                }}
              >
                {entry.formula}
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.48 }}>
                {entry.summary}
              </p>
            </div>

            <div
              style={{
                paddingTop: '0.55rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.32rem',
              }}
            >
              {entry.points.map((pt, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.45rem',
                    fontSize: '0.71rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.4,
                  }}
                >
                  <span className="mono-metric" style={{ color: '#10b981', fontWeight: 800 }}>
                    •
                  </span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
