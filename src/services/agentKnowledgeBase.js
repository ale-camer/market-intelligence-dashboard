import { tx, txTpl } from '../data/i18n/viewLocaleService';
import { getAssetBySymbol } from './marketService';
import { getAnomalyProfile } from './anomalyService';
import { getAssetResearchBrief } from './filingsAndNewsService';
import { computeLivePortfolioMetrics } from './committeeService';
import { INITIAL_HOLDINGS } from '../components/portfolio/portfolioConstants';

/**
 * Global Agent Knowledge Base & Conversational Engine (`agentKnowledgeBase.js`)
 *
 * Implements Phase 2 (Steps 2.1, 2.2, 2.3, 2.4):
 * 1. Step 2.1: Minimal 1-line greeting, 4 product-centered quick options, and strict Scope Lock guardrails.
 * 2. Step 2.2: 3-block dynamic Knowledge Base (Functional Map, 2-Tier Financial Dictionary, P-01..P-13 + FinOps Tech Specs)
 *              with multi-turn conversation memory (never canned templates).
 * 3. Step 2.3: Read-only live screen snapshot (`buildLiveAppSnapshot`) across Home, Markets, Portfolio, System, and Guide.
 * 4. Step 2.4: Multilingual support across all 56 platform languages via `tx` / `txTpl` + language-aware synthesis.
 */

export const AGENT_QUICK_PROMPTS = [
  {
    id: 'start',
    label: () => tx('¿Por dónde empiezo?', 'Where do I start?'),
    prompt: () => tx('¿Por dónde empiezo?', 'Where do I start?'),
  },
  {
    id: 'sections',
    label: () => tx('¿Qué hay en cada sección de la app?', 'What is in each section of the app?'),
    prompt: () => tx('¿Qué hay en cada sección de la app?', 'What is in each section of the app?'),
  },
  {
    id: 'current_screen',
    label: () => tx('Explicame qué estoy viendo en esta pantalla', 'Explain what I am seeing on this screen'),
    prompt: () => tx('Explicame qué estoy viendo en esta pantalla', 'Explain what I am seeing on this screen'),
  },
  {
    id: 'architecture',
    label: () => tx('¿Cómo funciona la arquitectura y el sistema?', 'How do the architecture and system work?'),
    prompt: () => tx('¿Cómo funciona la arquitectura y el sistema?', 'How do the architecture and system work?'),
  },
];

export function getAgentGreeting() {
  return tx(
    'Hola, soy el guía de la plataforma. ¿Qué te gustaría explorar o consultar?',
    'Hi, I am the platform guide. What would you like to explore or ask?'
  );
}

/**
 * Builds a live read-only snapshot of the active screen state (Step 2.3)
 */
export function buildLiveAppSnapshot({
  activeTab = 'presentation',
  marketsViewMode = 'screener',
  selectedAsset = 'BTC',
  watchlistSyms = [],
}) {
  let portfolioHoldings = INITIAL_HOLDINGS;
  try {
    const raw = window.localStorage.getItem('mid_portfolio_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        portfolioHoldings = parsed;
      }
    }
  } catch {
    // fallback to INITIAL_HOLDINGS
  }

  const params = new URLSearchParams(window.location.search);
  const section = params.get('section') || 'analytics';
  const sub = params.get('sub') || '';
  const cat = params.get('cat') || 'ALL';
  const screenerMode = params.get('screener') || 'table';

  const assetObj = getAssetBySymbol(selectedAsset);
  const anomObj = getAnomalyProfile(selectedAsset);
  const briefObj = getAssetResearchBrief(selectedAsset);
  const portMetrics = computeLivePortfolioMetrics(portfolioHoldings);

  return {
    activeTab,
    marketsViewMode,
    marketsSection: section,
    screenerMode,
    categoryFilter: cat,
    subTab: sub,
    selectedAsset: assetObj.sym,
    assetName: assetObj.name,
    assetCat: assetObj.cat,
    assetPrice: assetObj.priceFormatted,
    assetChg: assetObj.chg,
    assetRsi: assetObj.indicators?.rsi14 ?? 54,
    assetMacd: assetObj.indicators?.macdSignal ?? 'NEUTRAL',
    assetVol24h: assetObj.vol24h,
    assetVolZ: assetObj.volumeZScore || anomObj.volumeZScore,
    anomalyScore: anomObj.score,
    anomalyRegime: anomObj.regime,
    researchComposite: briefObj.compositeFormatted,
    researchStance: briefObj.stanceLabel?.ES || briefObj.stanceLabel?.EN || 'Constructive',
    watchlistSyms,
    portfolioCount: portMetrics.enrichedHoldings.length,
    portfolioHoldingsSummary: portMetrics.enrichedHoldings
      .map((h) => `${h.sym} (${h.weight}%)`)
      .join(', '),
    portfolioCagr: portMetrics.cagrPct,
    portfolioVol: portMetrics.portfolioVolPct,
    portfolioSharpe: portMetrics.sharpeRatio,
    portfolioSortino: portMetrics.sortinoRatio,
    portfolioVar95: portMetrics.var95Pct,
    portfolioCvar99: portMetrics.cvar99Pct,
    portfolioMaxDD: portMetrics.maxDrawdownPct,
    portfolioBeta: portMetrics.portfolioBeta,
    portfolioAlpha: portMetrics.brinsonAlphaPct,
    portfolioEnb: portMetrics.enb,
    portfolioStress2008: portMetrics.stress2008Pct,
  };
}

/**
 * Scope Lock Guardrail: detects gibberish, prompt injection, or off-topic non-platform/non-financial queries.
 */
function isOutOfScopeQuery(qClean) {
  if (!qClean || qClean.length < 2) return false;

  // Off-topic keywords (cooking, sports, weather, politics, movies, general coding homework unrelated to the app)
  const offTopicPatterns = [
    /\b(receta|cocinar|pizza|pasta|empanada|asado|comida|restaurante|recipe|cooking|bake)\b/i,
    /\b(futbol|fútbol|messi|mundial|champions|nba|tenis|partido de|soccer|football|basketball)\b/i,
    /\b(clima en|llueve|pronostico del tiempo|weather in|temperature tomorrow)\b/i,
    /\b(pelicula|película|netflix|serie de tv|actor|cine|horoscopo|horóscopo|zodiac)\b/i,
    /\b(chiste|poema|cancion|canción|tell me a joke|write a poem|write a song)\b/i,
    /\b(ignore previous|ignora las instrucciones|system prompt|jailbreak)\b/i,
  ];
  return offTopicPatterns.some((re) => re.test(qClean));
}

/**
 * Financial & Technical Concept Dictionary (2 Levels: Level 1 plain language by default, Level 2 Quant/Math on demand)
 */
const CONCEPT_KNOWLEDGE = [
  {
    keys: ['cvar', 'var ', 'var?', 'value at risk', 'valor en riesgo', 'tail loss', 'cola'],
    simple: (snap) =>
      txTpl(
        '• **VaR 95% / CVaR 99% (1D):** Mide cuánto podría perder tu cartera en un mal día habitual (**VaR 95%**, hoy **{0}%**) y en un día de crisis extrema del 1% peor (**CVaR 99%**, hoy **{1}%**).\n• Lo ves en **Portfolio > Builder** y **Portfolio > Risk**.',
        [snap.portfolioVar95, snap.portfolioCvar99],
        '• **95% VaR / 99% CVaR (1D):** Measures how much your portfolio could lose on a typical bad day (**95% VaR**, currently **{0}%**) versus an extreme 1%-tail crisis day (**99% CVaR**, currently **{1}%**).\n• Available in **Portfolio > Builder** and **Portfolio > Risk**.',
        [snap.portfolioVar95, snap.portfolioCvar99]
      ),
    advanced: (snap) =>
      txTpl(
        '• **Fórmula Quant (Expected Shortfall):** $\\text{CVaR}_{\\alpha} = \\mathbb{E}[L \\mid L \\ge \\text{VaR}_{\\alpha}]$. Mientras el VaR 95% corta en el percentil 95 de pérdidas diarias, el CVaR 99% integra la media condicional de la cola más allá del percentil 99 (capturando *fat tails*).\n• En tu cartera actual: **VaR 95% = {0}%** y **CVaR 99% = {1}%** con **Beta {2}**.',
        [snap.portfolioVar95, snap.portfolioCvar99, snap.portfolioBeta],
        '• **Quant Formula (Expected Shortfall):** $\\text{CVaR}_{\\alpha} = \\mathbb{E}[L \\mid L \\ge \\text{VaR}_{\\alpha}]$. While 95% VaR cuts at the 95th loss percentile, 99% CVaR integrates the conditional tail expectation beyond the 99th percentile (capturing fat tails).\n• In your active portfolio: **95% VaR = {0}%** and **99% CVaR = {1}%** with **Beta {2}**.',
        [snap.portfolioVar95, snap.portfolioCvar99, snap.portfolioBeta]
      ),
  },
  {
    keys: ['sharpe', 'sortino'],
    simple: (snap) =>
      txTpl(
        '• **Sharpe y Sortino:** Miden cuánto retorno ganás por cada unidad de riesgo asumido (arriba de **1.0** es sólido; arriba de **1.5** es excelente).\n• Tu cartera actual tiene **Sharpe {0}** y **Sortino {1}** con volatilidad anual de **{2}%**.',
        [snap.portfolioSharpe, snap.portfolioSortino, snap.portfolioVol],
        '• **Sharpe & Sortino:** Measure how much return you earn per unit of risk taken (above **1.0** is solid; above **1.5** is strong).\n• Your active portfolio shows **Sharpe {0}** and **Sortino {1}** with **{2}%** annual volatility.',
        [snap.portfolioSharpe, snap.portfolioSortino, snap.portfolioVol]
      ),
    advanced: (snap) =>
      txTpl(
        '• **Detalle Quant:** $\\text{Sharpe} = (R_p - R_f)/\\sigma_p$ penaliza toda la volatilidad, mientras que $\\text{Sortino} = (R_p - R_f)/\\sigma_{\\text{downside}}$ sólo penaliza la desviación negativa (caídas).\n• En vivo: **CAGR +{0}%**, **$\\sigma$ {1}%**, **Sharpe {2}**, **Sortino {3}**.',
        [snap.portfolioCagr, snap.portfolioVol, snap.portfolioSharpe, snap.portfolioSortino],
        '• **Quant Detail:** $\\text{Sharpe} = (R_p - R_f)/\\sigma_p$ penalizes total volatility, whereas $\\text{Sortino} = (R_p - R_f)/\\sigma_{\\text{downside}}$ penalizes only downside semi-deviation.\n• Live values: **CAGR +{0}%**, **$\\sigma$ {1}%**, **Sharpe {2}**, **Sortino {3}**.',
        [snap.portfolioCagr, snap.portfolioVol, snap.portfolioSharpe, snap.portfolioSortino]
      ),
  },
  {
    keys: ['kelly', 'quarter-kelly', 'half-kelly', 'tamaño de posicion', 'position sizing'],
    simple: (snap) =>
      txTpl(
        '• **Criterio de Kelly:** Calcula qué porcentaje de tu cartera conviene asignarle a una idea según su probabilidad de éxito y relación ganancia/pérdida.\n• Podés probarlo en **Portfolio > Simulator > Kelly Sizing** (`Quarter-Kelly 0.25x` es la opción conservadora recomendada; el sistema aplica además un tope de seguridad del **20% NAV**).',
        [snap.selectedAsset],
        '• **Kelly Criterion:** Computes the optimal portfolio weight for a trade based on its win rate and payoff ratio.\n• Test it in **Portfolio > Simulator > Kelly Sizing** (`Quarter-Kelly 0.25x` is the recommended conservative option, plus a hard **20% NAV** guardrail cap).',
        [snap.selectedAsset]
      ),
    advanced: () =>
      tx(
        '• **Fórmula Quant:** $f^* = W - (1 - W)/R$, donde $W$ es el *Win Rate* y $R$ el *Payoff Ratio* (ganancia media / pérdida media). En gestión institucional se usa **Half-Kelly ($0.5f^*$)** o **Quarter-Kelly ($0.25f^*$)** para reducir la varianza geométrica manteniendo el 75%–94% de la tasa de crecimiento óptima.',
        '• **Quant Formula:** $f^* = W - (1 - W)/R$, where $W$ is Win Rate and $R$ is Payoff Ratio. Institutional desks use **Half-Kelly ($0.5f^*$)** or **Quarter-Kelly ($0.25f^*$)** to cut geometric variance while preserving 75%–94% of optimal log-growth.'
      ),
  },
  {
    keys: ['p-06', 'p06', 'isolation forest', 'anomalia', 'anomalía', 'anomaly'],
    simple: (snap) =>
      txTpl(
        '• **Detector de Anomalías (P-06):** Es un modelo que puntúa de **0.00 a 1.00** si el precio y el volumen de un activo se mueven normal (`< 0.35`), con actividad alta (`0.35–0.65`) o de forma atípica (`≥ 0.65`).\n• Ahora mismo **{0}** tiene un puntaje de **{1} ({2})**.',
        [snap.selectedAsset, snap.anomalyScore, snap.anomalyRegime],
        '• **Anomaly Detector (P-06):** Scores from **0.00 to 1.00** whether an asset’s price and volume are moving normally (`< 0.35`), with elevated flow (`0.35–0.65`), or atypically (`≥ 0.65`).\n• Right now **{0}** has a score of **{1} ({2})**.',
        [snap.selectedAsset, snap.anomalyScore, snap.anomalyRegime]
      ),
    advanced: (snap) =>
      txTpl(
        '• **Detalle Técnico (P-06 Cloud Run):** Microservicio scikit-learn **Isolation Forest** (`contamination=0.05`) que evalúa un vector de 7 features (precio, media/desvío móvil 7d, RSI-14, ROC-1, volatilidad 7d y volumen). Si el score supera **0.65**, el comité en **Portfolio > Simulator** activa el *circuit breaker* y recorta la exposición máxima al 5% NAV.\n• En **{0}**: score **{1}** y desvío de volumen 20d **{2}**.',
        [snap.selectedAsset, snap.anomalyScore, snap.assetVolZ],
        '• **Technical Detail (P-06 Cloud Run):** scikit-learn **Isolation Forest** microservice (`contamination=0.05`) scoring a 7-feature vector (close, 7d rolling mean/std, RSI-14, ROC-1, 7d volatility, volume). If score ≥ **0.65**, the Risk Committee triggers a circuit-breaker cap at 5% NAV.\n• On **{0}**: score **{1}** and 20d volume Z-score **{2}**.',
        [snap.selectedAsset, snap.anomalyScore, snap.assetVolZ]
      ),
  },
  {
    keys: ['brinson', 'atribucion', 'atribución', 'attribution', 'alpha'],
    simple: (snap) =>
      txTpl(
        '• **Alpha Brinson (+{0}%):** Separa cuánto del rendimiento extra de tu cartera frente al S&P 500 vino por **elegir buenos sectores** (*Allocation*) y cuánto por **elegir los mejores activos dentro de cada sector** (*Selection*).\n• Lo ves detallado en **Portfolio > Builder > Attribution**.',
        [snap.portfolioAlpha],
        '• **Brinson Alpha (+{0}%):** Breaks down how much of your excess return vs. the S&P 500 came from **choosing the right asset classes** (*Allocation*) vs. **picking the best assets within them** (*Selection*).\n• View the breakdown in **Portfolio > Builder > Attribution**.',
        [snap.portfolioAlpha]
      ),
    advanced: (snap) =>
      txTpl(
        '• **Modelo Brinson-Fachler:** Descompone el exceso de retorno activo $\\alpha = R_p - R_b$ en tres términos ortogonales: **Allocation** $(w_{p,i} - w_{b,i})(R_{b,i} - R_b)$, **Selection** $w_{b,i}(R_{p,i} - R_{b,i})$ e **Interaction** $(w_{p,i} - w_{b,i})(R_{p,i} - R_{b,i})$.\n• Tu cartera actual registra **Alpha +{0}%** y **Beta {1}** vs. S&P 500.',
        [snap.portfolioAlpha, snap.portfolioBeta],
        '• **Brinson-Fachler Model:** Decomposes active excess return $\\alpha = R_p - R_b$ into **Allocation** $(w_{p,i} - w_{b,i})(R_{b,i} - R_b)$, **Selection** $w_{b,i}(R_{p,i} - R_{b,i})$, and **Interaction**.\n• Your active portfolio shows **+{0}% Alpha** and **{1} Beta** vs. S&P 500.',
        [snap.portfolioAlpha, snap.portfolioBeta]
      ),
  },
  {
    keys: ['markov', 'regimen', 'régimen', 'regime', 'bull quiet'],
    simple: () =>
      tx(
        '• **Régimen de Markov:** Clasifica el clima actual del mercado en 4 estados (*Alcista Calmo, Alcista Volátil, Inflacionario o Crisis*) y estima la probabilidad de pasar de uno a otro.\n• Podés explorarlo en **Portfolio > Risk > Market Shock > Regimes**.',
        '• **Markov Regime:** Classifies the market climate into 4 states (*Bull Quiet, Bull Volatile, Inflationary, or Crisis*) and estimates transition probabilities.\n• Explore it in **Portfolio > Risk > Market Shock > Regimes**.'
      ),
    advanced: () =>
      tx(
        '• **Cadena de Markov de Estados Ocultos (HMM):** Modela la matriz estocástica de transición $P_{ij} = P(S_{t+1}=j \\mid S_t=i)$ condicionando los vectores de retorno esperado $\\mu_s$ y la matriz de covarianza $\\Sigma_s$ según el estado activo (*Bull Quiet 62%*).',
        '• **Hidden Markov Regime Model (HMM):** Estimates the stochastic transition matrix $P_{ij} = P(S_{t+1}=j \\mid S_t=i)$, conditioning expected return vectors $\\mu_s$ and covariance matrices $\\Sigma_s$ on the active state (*Bull Quiet 62%*).'
      ),
  },
  {
    keys: ['enb', 'apuestas reales', 'effective bets', 'diversificacion', 'diversificación', 'overlap', 'solapamiento'],
    simple: (snap) =>
      txTpl(
        '• **Apuestas Reales (ENB = {0}) y Solapamiento:** Aunque tengas **{1} activos**, muchos se mueven parecido o están repetidos adentro de ETFs como `SPY`. El **ENB** te dice cuántas apuestas verdaderamente independientes tenés (arriba de **3.5** está bien diversificada).\n• Miralo en **Portfolio > Builder > Overlap**.',
        [snap.portfolioEnb, snap.portfolioCount],
        '• **Effective Bets (ENB = {0}) & Overlap:** Even with **{1} assets**, several move together or overlap inside index ETFs like `SPY`. **ENB** tells you how many truly independent bets you hold (above **3.5** is well diversified).\n• Check it in **Portfolio > Builder > Overlap**.',
        [snap.portfolioEnb, snap.portfolioCount]
      ),
    advanced: (snap) =>
      txTpl(
        '• **Entropía de Meucci (Effective Number of Bets):** Se calcula descomponiendo las contribuciones ortogonales de riesgo $p_i$ sobre los autovectores principales de la matriz de covarianza: $\\text{ENB} = \\exp(-\\sum p_i \\ln p_i)$. Tu cartera hoy tiene **ENB = {0}** sobre **{1}** posiciones activas.',
        [snap.portfolioEnb, snap.portfolioCount],
        '• **Meucci Entropy (Effective Number of Bets):** Computed from orthogonalized risk contributions $p_i$ across principal covariance eigenvectors: $\\text{ENB} = \\exp(-\\sum p_i \\ln p_i)$. Your portfolio currently has **ENB = {0}** across **{1}** active holdings.',
        [snap.portfolioEnb, snap.portfolioCount]
      ),
  },
  {
    keys: ['ols', 'regresion', 'regresión', 'regression', 'bollinger', 'rsi', 'vwap'],
    simple: (snap) =>
      txTpl(
        '• **Indicadores Técnicos (`Markets > Analytics`):**\n  - **RSI (14):** mide si el activo está con empuje comprador (`>50`) o vendedor (`<50`). En **{0}** hoy vale **{1}**.\n  - **Bollinger (2σ) y VWAP:** marcan el canal estadístico normal del precio y el precio promedio ponderado por volumen institucional.',
        [snap.selectedAsset, snap.assetRsi],
        '• **Technical Indicators (`Markets > Analytics`):**\n  - **RSI (14):** measures buying (`>50`) vs. selling (`<50`) momentum. On **{0}** it is currently **{1}**.\n  - **Bollinger (2σ) & VWAP:** plot the normal 2-standard-deviation price channel and institutional volume-weighted average price.',
        [snap.selectedAsset, snap.assetRsi]
      ),
    advanced: (snap) =>
      txTpl(
        '• **Detalle Quant en `Markets > Analytics`:** Las bandas de Bollinger trazan $\\text{SMA}_{20} \\pm 2\\sigma_{20}$, el VWAP integra $\\sum (P_i V_i)/\\sum V_i$, y el Z-Score de volumen 20d mide $(V_t - \\mu_{20})/\\sigma_{20}$ (en **{0}**: **{1}**).',
        [snap.selectedAsset, snap.assetVolZ],
        '• **Quant Detail in `Markets > Analytics`:** Bollinger Bands plot $\\text{SMA}_{20} \\pm 2\\sigma_{20}$, VWAP integrates $\\sum (P_i V_i)/\\sum V_i$, and 20d Volume Z-Score computes $(V_t - \\mu_{20})/\\sigma_{20}$ (on **{0}**: **{1}**).',
        [snap.selectedAsset, snap.assetVolZ]
      ),
  },
  {
    keys: ['finops', 'costo', 'cost', '0.95', 'scale-to-zero', 'free tier', 'presupuesto', 'cloud run'],
    simple: () =>
      tx(
        '• **Arquitectura FinOps (`~$0.95/mes`):** Los 13 pipelines (`P-01` a `P-13`) corren de forma programada en **GitHub Actions** y **GCP Cloud Run** con perfil *Scale-to-Zero (`min-instances=0`)*.\n• Cuando nadie consulta el backend, los contenedores se apagan a `$0.00` y la app lee el último snapshot desde caché/Supabase. Podés auditar cada centavo en **System > FinOps**.',
        '• **FinOps Architecture (`~$0.95/mo`):** All 13 pipelines (`P-01` to `P-13`) run on schedule via **GitHub Actions** and **GCP Cloud Run** with *Scale-to-Zero (`min-instances=0`)*.\n• Idle compute costs `$0.00` while the UI serves cached/Supabase snapshots. Audit every quota in **System > FinOps**.'
      ),
    advanced: () =>
      tx(
        '• **Ingeniería de Costos (`System > FinOps`):** Arbitraje de capas gratuitas entre **GitHub Actions** (cron DAGs), **BigQuery** (1 TB query/mes + 10 GB storage free), **Supabase PostgreSQL + pgvector** y **GCP Cloud Run** (`min=0, max=2`), acotando el gasto real a `~$0.95 USD/mes` de almacenamiento de imágenes en Artifact Registry.',
        '• **Cost Engineering (`System > FinOps`):** Free-tier arbitrage across **GitHub Actions** (cron DAGs), **BigQuery** (1 TB query/mo + 10 GB storage free), **Supabase PostgreSQL + pgvector**, and **GCP Cloud Run** (`min=0, max=2`), bounding total cloud spend to `~$0.95 USD/mo` in Artifact Registry storage.'
      ),
  },
];

/**
 * Generates a versatile, context-aware, multi-turn response (Steps 2.1, 2.2, 2.3, 2.4)
 */
export async function generateGlobalAgentResponse({
  userText = '',
  history = [],
  snapshot,
}) {
  const qRaw = String(userText || '').trim();
  const q = qRaw.toLowerCase();
  const snap = snapshot || buildLiveAppSnapshot({});

  // 1. Strict Scope Lock Guardrail
  if (isOutOfScopeQuery(q)) {
    return tx(
      'Soy el guía exclusivo de esta plataforma: puedo ayudarte a navegar sus secciones (`Markets`, `Portfolio`, `System`, `Guide`), interpretar tus activos y métricas en pantalla o detallar la arquitectura técnica `P-01` a `P-13`.',
      'I am the dedicated guide for this platform: I can help you navigate its sections (`Markets`, `Portfolio`, `System`, `Guide`), interpret the live assets and metrics on screen, or explain the `P-01` to `P-13` technical architecture.'
    );
  }

  // Detect if user is asking for deeper / mathematical / technical follow-up based on current message or conversation history
  const wantsDeepMathOrTech =
    /\b(formula|fórmula|matematica|matemática|ecuacion|ecuación|quant|profundiz|detall|tecnic|técnic|como se calcula|cómo se calcula|math|equation|deeper|technical)\b/i.test(
      q
    );

  // Check if user is asking a follow-up ("¿y la fórmula?", "profundizá", "¿cómo se calcula?", "¿y en mi cartera?")
  const lastUserMsg = [...history]
    .reverse()
    .find((m) => m.role === 'user' && m.txt?.toLowerCase() !== q)?.txt?.toLowerCase() || '';

  // 2. Quick Option 1: "¿Por dónde empiezo?" / "Where do I start?"
  if (
    q.includes('por dónde empiezo') ||
    q.includes('por donde empiezo') ||
    q.includes('where do i start') ||
    q.includes('how to start') ||
    q.includes('empezar')
  ) {
    return tx(
      'Según lo que quieras hacer hoy, podés ir directo a:\n• **Markets:** explorar los 213 activos globales, ver gráficos 2D/3D, tesis con IA y marcar favoritos con **`★`**.\n• **Portfolio:** armar tu cartera en 1 clic (*Conservadora, Balanceada o Quant*) y medir su riesgo (`VaR`, estrés histórico y simulador `Kelly`).\n• **System:** auditar los **13 pipelines (`P-01` a `P-13`)**, telemetría en vivo y costos cloud (**`~$0.95/mes`**).\n• **Guide:** ver el recorrido paso a paso y el video resumen. ¿En cuál te gustaría profundizar?',
      'Depending on your goal today, you can jump straight to:\n• **Markets:** explore 213 global assets, 2D/3D surfaces, AI research briefs, and bookmark favorites with **`★`**.\n• **Portfolio:** build a portfolio in 1 click (*Conservative, Balanced, or Quant*) and stress-test risk (`VaR`, historical crashes, and `Kelly` simulator).\n• **System:** audit all **13 pipelines (`P-01` to `P-13`)**, live telemetry, and cloud FinOps (**`~$0.95/mo`**).\n• **Guide:** browse the step-by-step tour and video overview. Which one would you like to explore?'
    );
  }

  // 3. Quick Option 2: "¿Qué hay en cada sección de la app?" / "What is in each section of the app?"
  if (
    q.includes('qué hay en cada sección') ||
    q.includes('que hay en cada seccion') ||
    q.includes('what is in each section') ||
    q.includes('secciones de la app')
  ) {
    return tx(
      'La plataforma se organiza en 4 secciones principales:\n• **Markets (arriba):** Nivel 1 **`Screener`** (Tabla, Orbital, Mapa de Calor y `Main Tools` 3D) y Nivel 2 por activo (**`Analytics`** técnico/cuantitativo y **`Research`** documental con IA).\n• **Portfolio (arriba):** **`Builder`** (pesos, solapamiento de ETFs y atribución Brinson), **`Risk`** (Markowitz, correlaciones y estrés 2008) y **`Simulator`** (órdenes *What-If*, Kelly y Comité de 3 pilares).\n• **System (abajo izq.):** **`Performance`** (arquitectura `P-01`..`P-13`, contratos y logs en vivo) y **`FinOps`** (cuotas cloud y diseño *Scale-to-Zero*).\n• **Guide (abajo izq.):** manual interactivo por sección, glosario y video resumen.',
      'The platform is organized into 4 main sections:\n• **Markets (top):** Level 1 **`Screener`** (Table, Orbital, Heatmap & 3D `Main Tools`) and Level 2 per asset (**`Analytics`** technical/quant desk and **`Research`** AI filings desk).\n• **Portfolio (top):** **`Builder`** (weights, ETF overlap & Brinson attribution), **`Risk`** (Markowitz, correlations & 2008 crash stress), and **`Simulator`** (*What-If* trades, Kelly sizing & 3-pillar Committee).\n• **System (bottom left):** **`Performance`** (`P-01`..`P-13` DAGs, schema contracts & live logs) and **`FinOps`** (cloud quotas & *Scale-to-Zero* budget).\n• **Guide (bottom left):** interactive manual, glossary, and video overview.'
    );
  }

  // 4. Quick Option 3: "Explicame qué estoy viendo en esta pantalla" / "Explain what I am seeing on this screen"
  if (
    q.includes('qué estoy viendo') ||
    q.includes('que estoy viendo') ||
    q.includes('what i am seeing') ||
    q.includes('esta pantalla') ||
    q.includes('this screen')
  ) {
    if (snap.activeTab === 'presentation') {
      return tx(
        'Estás en la **portada (`Home`)** de la plataforma. Desde acá podés entrar a **`Markets`** (arriba) para analizar los 213 activos globales, a **`Portfolio`** para construir y simular tu cartera, o abrir **`System`** y **`Guide`** en la barra inferior.',
        'You are on the platform **Home** screen. From here you can open **`Markets`** (top bar) to analyze 213 global assets, **`Portfolio`** to build and stress-test your portfolio, or **`System`** and **`Guide`** in the bottom bar.'
      );
    }
    if (snap.activeTab === 'workstation') {
      if (snap.marketsViewMode === 'screener') {
        return txTpl(
          'Estás en **`Markets > Screener`** (filtro activo: **`{0}`**, vista **`{1}`**) con **{2} favoritos (`★`)** en tu Watchlist.\n• Las 4 tarjetas superiores resumen el pulso global (volumen 24h, `RSI` promedio, porcentaje de activos en régimen normal `P-06` y mayores desvíos de volumen).\n• Hacé clic en cualquier activo para abrir su mesa **`Analytics`** o **`Research`**, o marcá la **`★`** para llevarlo a **`Portfolio`**.',
          [snap.categoryFilter, snap.screenerMode.toUpperCase(), snap.watchlistSyms.length],
          'You are in **`Markets > Screener`** (active filter: **`{0}`**, **`{1}`** view) with **{2} bookmarked (`★`)** assets in your Watchlist.\n• The 4 top KPI cards summarize global pulse (24h volume, average `RSI`, normal `P-06` regime share, and top volume dislocations).\n• Click any asset to open its **`Analytics`** or **`Research`** desk, or click **`★`** to use it in **`Portfolio`**.',
          [snap.categoryFilter, snap.screenerMode.toUpperCase(), snap.watchlistSyms.length]
        );
      }
      if (snap.marketsSection === 'research') {
        return txTpl(
          'Estás en **`Markets > Research`** analizando **`{0}` (`{1}`)** a **`{2}` (`{3}`)**.\n• Arriba ves la postura institucional (**`{4}`**) y la **Nota Ponderada Total (`{5}`)** que combina reportes oficiales y sentimiento de noticias.\n• En las 3 columnas tenés el **Chat Documental RAG** (izquierda), los **5 factores alcistas vs. 5 bajistas** (centro) y el **cable de noticias FinBERT en vivo** (derecha).',
          [snap.selectedAsset, snap.assetName, snap.assetPrice, snap.assetChg, snap.researchStance, snap.researchComposite],
          'You are in **`Markets > Research`** analyzing **`{0}` (`{1}`)** at **`{2}` (`{3}`)**.\n• The top strip shows the institutional stance (**`{4}`**) and **Weighted Composite Score (`{5}`)** combining filings and news sentiment.\n• Below are the **Document RAG Chat** (left), **5 Bull vs. 5 Bear Factors** (center), and **live FinBERT News Wire** (right).',
          [snap.selectedAsset, snap.assetName, snap.assetPrice, snap.assetChg, snap.researchStance, snap.researchComposite]
        );
      }
      return txTpl(
        'Estás en **`Markets > Analytics`** viendo **`{0}` (`{1}`)** a **`{2}` (`{3}`)**.\n• Indicadores clave hoy: **`RSI (14)` en `{4}`**, desvío de volumen 20d en **`{5}`** y puntaje de anomalía **`P-06` en `{6}` (`{7}`)**.\n• A la izquierda podés cambiar entre lente **Técnica**, **Comparador %**, **Microestructura** o **Superficies 3D**, y al pie del gráfico tenés el diagnóstico en lenguaje llano y cuantitativo.',
        [snap.selectedAsset, snap.assetName, snap.assetPrice, snap.assetChg, snap.assetRsi, snap.assetVolZ, snap.anomalyScore, snap.anomalyRegime],
        'You are in **`Markets > Analytics`** viewing **`{0}` (`{1}`)** at **`{2}` (`{3}`)**.\n• Key live metrics: **`RSI (14)` at `{4}`**, 20d volume Z-score at **`{5}`**, and **`P-06` anomaly score at `{6}` (`{7}`)**.\n• Use the left panel to switch between **Technical**, **Compare %**, **Micro & Flow**, or **3D Surfaces**, and read the plain-language + quant diagnosis along the bottom bar.',
        [snap.selectedAsset, snap.assetName, snap.assetPrice, snap.assetChg, snap.assetRsi, snap.assetVolZ, snap.anomalyScore, snap.anomalyRegime]
      );
    }
    if (snap.activeTab === 'consensus') {
      return txTpl(
        'Estás en **`Portfolio`** con **{0} activos activos** (`{1}`).\n• Tu cartera proyecta **`+{2}% CAGR`**, **`Sharpe {3}`**, **`VaR 95%` diario de `{4}%`** (`CVaR 99%: {5}%`) y **`{6}` apuestas efectivas (`ENB`)**.\n• Arriba podés alternar entre **`Builder`** (pesos, presets de 1 clic y solapamiento), **`Risk`** (Markowitz, correlaciones y estrés 2008) y **`Simulator`** (jugadas tácticas y criterio de Kelly).',
        [snap.portfolioCount, snap.portfolioHoldingsSummary, snap.portfolioCagr, snap.portfolioSharpe, snap.portfolioVar95, snap.portfolioCvar99, snap.portfolioEnb],
        'You are in **`Portfolio`** with **{0} active holdings** (`{1}`).\n• Your portfolio projects **`+{2}% CAGR`**, **`{3} Sharpe`**, **`{4}%` daily `95% VaR`** (`99% CVaR: {5}%`), and **`{6}` effective bets (`ENB`)**.\n• Switch at the top between **`Builder`** (weights, 1-click presets & ETF overlap), **`Risk`** (Markowitz, correlations & 2008 stress), and **`Simulator`** (*What-If* sizing & Kelly).',
        [snap.portfolioCount, snap.portfolioHoldingsSummary, snap.portfolioCagr, snap.portfolioSharpe, snap.portfolioVar95, snap.portfolioCvar99, snap.portfolioEnb]
      );
    }
    if (snap.activeTab === 'observability') {
      return tx(
        'Estás en **`System`**, el centro de ingeniería y observabilidad de la plataforma.\n• En **`Performance`** podés inspeccionar cada uno de los **13 módulos (`P-01` a `P-13`)**, su topología DAG, contratos de datos (`0 Schema Drift`) y latencias `p50/p95`.\n• En **`FinOps`** ves cómo el diseño *Scale-to-Zero* y el arbitraje de capas gratuitas mantienen el costo cloud total en **`~$0.95/mes`**.',
        'You are in **`System`**, the platform engineering and observability center.\n• **`Performance`** lets you inspect all **13 pipelines (`P-01` to `P-13`)**, DAG topology, schema contracts (`0 Schema Drift`), and `p50/p95` latencies.\n• **`FinOps`** details how *Scale-to-Zero* compute and free-tier arbitrage keep total cloud spend at **`~$0.95/mo`**.'
      );
    }
    if (snap.activeTab === 'guide') {
      return tx(
        'Estás en **`Guide`**, el manual interactivo de la plataforma.\n• En **`Home`** tenés accesos directos según lo que busques hacer hoy y el **Video Resumen**, y en las pestañas superiores el detalle paso a paso de **`Markets`**, **`Portfolio`** y **`System`**.',
        'You are in **`Guide`**, the interactive platform manual.\n• **`Home`** provides direct starting points by goal plus the **Video Overview**, while the top tabs cover **`Markets`**, **`Portfolio`**, and **`System`** step by step.'
      );
    }
  }

  // 5. Quick Option 4: "¿Cómo funciona la arquitectura y el sistema?" / "How do the architecture and system work?"
  if (
    q.includes('arquitectura') ||
    q.includes('architecture') ||
    q.includes('cómo funciona el sistema') ||
    q.includes('como funciona el sistema') ||
    q.includes('p-01') ||
    q.includes('p-13') ||
    q.includes('pipelines')
  ) {
    return tx(
      'La plataforma opera sobre una arquitectura desacoplada de **13 módulos (`P-01` a `P-13`)**:\n• **Ingesta y Datos (`P-01` a `P-05`, `P-10`):** pipelines en Python/BigQuery/Supabase orquestados por **GitHub Actions** que recolectan mercado, macro, on-chain y reportes SEC 10-K.\n• **Modelos e IA (`P-06` a `P-09`, `P-11`):** microservicios en **GCP Cloud Run** para detección de anomalías (*Isolation Forest P-06*), sentimiento **FinBERT**, búsqueda vectorial **RAG (`pgvector`)** y consenso multi-agente.\n• **Eficiencia FinOps (`~$0.95/mes`):** todos los servicios escalan a cero (`min-instances=0`) en reposo. Podés explorar cada módulo en vivo desde la pestaña **`System`** (abajo a la izquierda).',
      'The platform runs on a decoupled **13-module architecture (`P-01` to `P-13`)**:\n• **Data & Ingestion (`P-01` to `P-05`, `P-10`):** Python/BigQuery/Supabase pipelines orchestrated via **GitHub Actions** ingesting market, macro, on-chain, and SEC 10-K filings.\n• **ML & Agentic Engines (`P-06` to `P-09`, `P-11`):** **GCP Cloud Run** microservices for *Isolation Forest (`P-06`)* anomaly detection, **FinBERT** sentiment, **`pgvector` RAG**, and multi-agent consensus.\n• **FinOps Efficiency (`~$0.95/mo`):** all containers scale to zero (`min-instances=0`) when idle. Inspect every module live in the **`System`** tab (bottom left).'
    );
  }

  // 6. Check Financial & Technical Concept Dictionary (with multi-turn memory support)
  for (const concept of CONCEPT_KNOWLEDGE) {
    const matchedNow = concept.keys.some((k) => q.includes(k));
    const matchedPrev = wantsDeepMathOrTech && concept.keys.some((k) => lastUserMsg.includes(k));
    if (matchedNow || matchedPrev) {
      if (wantsDeepMathOrTech) {
        return `${concept.simple(snap)}\n${concept.advanced(snap)}`;
      }
      return `${concept.simple(snap)}\n${tx('*(Si querés ver la fórmula matemática o el detalle técnico, decime "profundizá" o "mostrame la fórmula").*', '*(If you want the mathematical formula or technical spec, just ask to "go deeper" or "show the formula").*')}`;
    }
  }

  // 7. Check if user asks about a specific ticker or current asset (e.g. BTC, NVDA, AAPL, SPY, TLT, GLD...)
  const tickerMatch = qRaw.toUpperCase().match(/\b(BTC|ETH|SOL|NVDA|AAPL|MSFT|AMZN|GOOGL|SPY|QQQ|TLT|GLD|US10Y|EUR\/USD|CL|GC)\b/);
  if (tickerMatch || q.includes('activo') || q.includes('asset') || q.includes('precio') || q.includes('price')) {
    const targetSym = tickerMatch ? tickerMatch[1] : snap.selectedAsset;
    const tAsset = getAssetBySymbol(targetSym);
    const tAnom = getAnomalyProfile(targetSym);
    const tBrief = getAssetResearchBrief(targetSym);
    return txTpl(
      'Resumen en vivo de **`{0}` (`{1}` — `{2}`)**:\n• **Precio y Tendencia:** **`{3}` (`{4}`)** con `RSI (14)` en **`{5}`** y desvío de volumen 20d en **`{6}`**.\n• **Régimen Estadístico (`P-06`):** puntaje **`{7}` (`{8}`)**.\n• **Tesis Documental y Noticias (`Research`):** nota compuesta **`{9}`** (*{10}*). Podés abrirlo en **`Markets > Analytics`** o **`Research`** y marcarle la **`★`** para sumarlo a tu cartera.',
      [
        tAsset.sym,
        tAsset.name,
        tAsset.cat,
        tAsset.priceFormatted,
        tAsset.chg,
        tAsset.indicators?.rsi14 ?? 54,
        tAsset.volumeZScore || tAnom.volumeZScore,
        tAnom.score,
        tAnom.regime,
        tBrief.compositeFormatted,
        tBrief.stanceLabel?.ES || tBrief.stanceLabel?.EN,
      ],
      'Live summary for **`{0}` (`{1}` — `{2}`)**:\n• **Price & Trend:** **`{3}` (`{4}`)** with `RSI (14)` at **`{5}`** and 20d volume Z-score at **`{6}`**.\n• **Statistical Regime (`P-06`):** score **`{7}` (`{8}`)**.\n• **Filings & News (`Research`):** weighted composite **`{9}`** (*{10}*). Open it in **`Markets > Analytics`** or **`Research`** and click **`★`** to include it in your portfolio.',
      [
        tAsset.sym,
        tAsset.name,
        tAsset.cat,
        tAsset.priceFormatted,
        tAsset.chg,
        tAsset.indicators?.rsi14 ?? 54,
        tAsset.volumeZScore || tAnom.volumeZScore,
        tAnom.score,
        tAnom.regime,
        tBrief.compositeFormatted,
        tBrief.stanceLabel?.EN || tBrief.stanceLabel?.ES,
      ]
    );
  }

  // 8. Check if user asks about their portfolio / cartera / holdings / watchlist
  if (
    q.includes('cartera') ||
    q.includes('portafolio') ||
    q.includes('portfolio') ||
    q.includes('holdings') ||
    q.includes('watchlist') ||
    q.includes('favoritos')
  ) {
    return txTpl(
      'Estado en vivo de tu **Cartera (`Portfolio`)**:\n• **Posiciones activas ({0}):** `{1}`.\n• **Rendimiento y Eficiencia:** **`+{2}% CAGR`**, volatilidad **`{3}%`**, **`Sharpe {4}`** (`Sortino {5}`) y **`Alpha Brinson +{6}%`**.\n• **Riesgo y Diversificación:** `VaR 95%` diario **`{7}%`** (`CVaR 99%: {8}%`), caída en estrés 2008 de **`{9}%`** (vs. `-42%` S&P 500) y **`{10}` apuestas efectivas (`ENB`)**.',
      [
        snap.portfolioCount,
        snap.portfolioHoldingsSummary,
        snap.portfolioCagr,
        snap.portfolioVol,
        snap.portfolioSharpe,
        snap.portfolioSortino,
        snap.portfolioAlpha,
        snap.portfolioVar95,
        snap.portfolioCvar99,
        snap.portfolioStress2008,
        snap.portfolioEnb,
      ],
      'Live status of your **Portfolio**:\n• **Active holdings ({0}):** `{1}`.\n• **Return & Efficiency:** **`+{2}% CAGR`**, **`{3}%`** volatility, **`{4} Sharpe`** (`{5} Sortino`), and **`+{6}% Brinson Alpha`**.\n• **Risk & Diversification:** daily `95% VaR` **`{7}%`** (`99% CVaR: {8}%`), 2008 crash stress **`{9}%`** (vs. `-42%` S&P 500), and **`{10}` effective bets (`ENB`)**.',
      [
        snap.portfolioCount,
        snap.portfolioHoldingsSummary,
        snap.portfolioCagr,
        snap.portfolioVol,
        snap.portfolioSharpe,
        snap.portfolioSortino,
        snap.portfolioAlpha,
        snap.portfolioVar95,
        snap.portfolioCvar99,
        snap.portfolioStress2008,
        snap.portfolioEnb,
      ]
    );
  }

  // 9. Context-aware default synthesis combining current screen + live metrics
  return txTpl(
    'Estoy leyendo tu sesión en vivo:\n• **Activo seleccionado en `Markets`:** **`{0}` (`{1}`)** a **`{2}` (`{3}`)** con `P-06` en **`{4}`** y nota `Research` de **`{5}`**.\n• **Cartera activa en `Portfolio` ({6} activos):** **`+{7}% CAGR`**, **`Sharpe {8}`**, **`VaR 95% {9}%`** y **`ENB {10}`**.\n• Preguntame por cualquier indicador (`VaR/CVaR`, `Sharpe`, `Kelly`, `Brinson`, `Markov`, `P-06`), por un activo puntual o por la arquitectura `P-01`..`P-13` (`~$0.95/mes`).',
    [
      snap.selectedAsset,
      snap.assetName,
      snap.assetPrice,
      snap.assetChg,
      snap.anomalyScore,
      snap.researchComposite,
      snap.portfolioCount,
      snap.portfolioCagr,
      snap.portfolioSharpe,
      snap.portfolioVar95,
      snap.portfolioEnb,
    ],
    'I am reading your live session:\n• **Selected asset in `Markets`:** **`{0}` (`{1}`)** at **`{2}` (`{3}`)** with `P-06` score **`{4}`** and `Research` composite **`{5}`**.\n• **Active portfolio in `Portfolio` ({6} assets):** **`+{7}% CAGR`**, **`{8} Sharpe`**, **`{9}% 95% VaR`**, and **`{10} ENB`**.\n• Ask me about any metric (`VaR/CVaR`, `Sharpe`, `Kelly`, `Brinson`, `Markov`, `P-06`), a specific ticker, or the `P-01`..`P-13` architecture (`~$0.95/mo`).',
    [
      snap.selectedAsset,
      snap.assetName,
      snap.assetPrice,
      snap.assetChg,
      snap.anomalyScore,
      snap.researchComposite,
      snap.portfolioCount,
      snap.portfolioCagr,
      snap.portfolioSharpe,
      snap.portfolioVar95,
      snap.portfolioEnb,
    ]
  );
}
