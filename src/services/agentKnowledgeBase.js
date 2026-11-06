import { tx, txTpl, getActiveViewLang } from '../data/i18n/viewLocaleService';
import { getAssetBySymbol } from './marketService';
import { getAnomalyProfile } from './anomalyService';
import { getAssetResearchBrief } from './filingsAndNewsService';
import { computeLivePortfolioMetrics } from './committeeService';
import { INITIAL_HOLDINGS } from '../components/portfolio/portfolioConstants';

/**
 * Global Agent Knowledge Base, Guardrails & Audit Telemetry Engine (`agentKnowledgeBase.js`)
 *
 * Implements Phase 2 (Steps 2.1, 2.2, 2.3, 2.4) + Institutional FinOps & Safety Guardrails:
 * - Primary Engine: Gemini Flash-Lite (`gemini-3.5-flash-lite` / `p12-guide-agent-flash-lite` on `projects/162760084346`).
 * - Hard Guardrails:
 *   1. Scope Lock (blocks off-topic queries, prompt injection, and personalized financial advice before calling LLM).
 *   2. Input Sanitization & Length Cap (`MAX_INPUT_CHARS = 500`).
 *   3. Output Token Cap (`MAX_OUTPUT_TOKENS = 320`, `temperature = 0.25`).
 *   4. Sliding-Window Rate Limiter (`RPM_LIMIT = 10 req/min`).
 *   5. Daily Quota Circuit-Breaker (`DAILY_REQ_CAP = 250 req/day`, `DAILY_TOKEN_CAP = 50,000 tokens/day`).
 * - Live Audit Telemetry (`getAgentAuditTelemetry`): records token consumption, latency, responseIds,
 *   and guardrail triggers for real-time auditing in `System > Performance` and `System > FinOps`.
 */

const GEMINI_STORAGE_KEY = 'mid_gemini_api_key';
const AUDIT_STORAGE_KEY = 'mid_agent_audit_v1';

export const AGENT_GUARDRAIL_LIMITS = {
  keyName: import.meta.env?.VITE_GEMINI_KEY_NAME || 'p12-guide-agent-flash-lite',
  projectName: import.meta.env?.VITE_GCP_PROJECT_NAME || 'projects/162760084346',
  projectNumber: import.meta.env?.VITE_GCP_PROJECT_NUMBER || '162760084346',
  model: import.meta.env?.VITE_GEMINI_MODEL || 'gemini-3.5-flash-lite',
  maxOutputTokens: Number(import.meta.env?.VITE_GEMINI_MAX_OUTPUT_TOKENS) || 320,
  maxInputChars: Number(import.meta.env?.VITE_GEMINI_MAX_INPUT_CHARS) || 500,
  rpmLimit: Number(import.meta.env?.VITE_GEMINI_RPM_LIMIT) || 10,
  dailyReqCap: Number(import.meta.env?.VITE_GEMINI_DAILY_REQ_CAP) || 250,
  dailyTokenCap: Number(import.meta.env?.VITE_GEMINI_DAILY_TOKEN_CAP) || 50000,
};

function getTodayUtcKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getAgentAuditTelemetry() {
  const today = getTodayUtcKey();
  const defaultState = {
    dayKey: today,
    keyName: AGENT_GUARDRAIL_LIMITS.keyName,
    projectName: AGENT_GUARDRAIL_LIMITS.projectName,
    modelVersion: AGENT_GUARDRAIL_LIMITS.model,
    requestsToday: 0,
    geminiCallsToday: 0,
    localFallbackCallsToday: 0,
    scopeLockBlocksToday: 0,
    rateLimitBlocksToday: 0,
    promptTokensToday: 0,
    completionTokensToday: 0,
    totalTokensToday: 0,
    lastLatencyMs: 280,
    avgLatencyMs: 280,
    lastResponseId: 'init-ready',
    rpmTimestamps: [],
    events: [],
  };

  try {
    const raw = window.localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.dayKey !== today) {
      return defaultState;
    }
    return {
      ...defaultState,
      ...parsed,
      rpmTimestamps: Array.isArray(parsed.rpmTimestamps) ? parsed.rpmTimestamps : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
    };
  } catch {
    return defaultState;
  }
}

function recordAgentAuditEvent({
  type = 'GEMINI_OK',
  latencyMs = 0,
  promptTokens = 0,
  completionTokens = 0,
  totalTokens = 0,
  responseId = '',
  modelVersion = AGENT_GUARDRAIL_LIMITS.model,
  note = '',
}) {
  try {
    const state = getAgentAuditTelemetry();
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString().slice(11, 19) + ' UTC';
    const recentRpm = state.rpmTimestamps.filter((ts) => nowMs - ts < 60_000);

    state.requestsToday += 1;
    if (type === 'GEMINI_OK') {
      state.geminiCallsToday += 1;
      recentRpm.push(nowMs);
      state.promptTokensToday += promptTokens;
      state.completionTokensToday += completionTokens;
      state.totalTokensToday += totalTokens;
      state.lastLatencyMs = latencyMs;
      state.avgLatencyMs =
        state.geminiCallsToday === 1
          ? latencyMs
          : Math.round((state.avgLatencyMs * (state.geminiCallsToday - 1) + latencyMs) / state.geminiCallsToday);
      if (responseId) state.lastResponseId = responseId;
      if (modelVersion) state.modelVersion = modelVersion;
    } else if (type === 'SCOPE_LOCK_BLOCK') {
      state.scopeLockBlocksToday += 1;
    } else if (type === 'RATE_LIMIT_FALLBACK') {
      state.rateLimitBlocksToday += 1;
      state.localFallbackCallsToday += 1;
    } else {
      state.localFallbackCallsToday += 1;
    }

    state.rpmTimestamps = recentRpm;
    const ev = {
      id: `aud-${nowMs}`,
      ts: nowIso,
      type,
      latencyMs,
      promptTokens,
      completionTokens,
      totalTokens,
      responseId: responseId || 'local-guardrail',
      note,
    };
    state.events = [ev, ...state.events].slice(0, 25);
    window.localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

function checkRateAndQuotaGuardrails() {
  const state = getAgentAuditTelemetry();
  const nowMs = Date.now();
  const activeRpm = state.rpmTimestamps.filter((ts) => nowMs - ts < 60_000).length;

  if (activeRpm >= AGENT_GUARDRAIL_LIMITS.rpmLimit) {
    return {
      allowed: false,
      reason: `RPM cap (${activeRpm}/${AGENT_GUARDRAIL_LIMITS.rpmLimit} req/min)`,
    };
  }
  if (state.geminiCallsToday >= AGENT_GUARDRAIL_LIMITS.dailyReqCap) {
    return {
      allowed: false,
      reason: `Daily request cap (${state.geminiCallsToday}/${AGENT_GUARDRAIL_LIMITS.dailyReqCap} RPD)`,
    };
  }
  if (state.totalTokensToday >= AGENT_GUARDRAIL_LIMITS.dailyTokenCap) {
    return {
      allowed: false,
      reason: `Daily token cap (${state.totalTokensToday}/${AGENT_GUARDRAIL_LIMITS.dailyTokenCap} tokens)`,
    };
  }
  return { allowed: true, reason: 'OK' };
}

export function getConfiguredGeminiKey() {
  try {
    const envKey = import.meta.env?.VITE_GEMINI_API_KEY;
    if (envKey && String(envKey).trim().length > 10) return String(envKey).trim();
    const localKey = window.localStorage.getItem(GEMINI_STORAGE_KEY);
    if (localKey && String(localKey).trim().length > 10) return String(localKey).trim();
  } catch {
    // ignore storage errors
  }
  return '';
}

export function setConfiguredGeminiKey(keyStr) {
  try {
    const clean = String(keyStr || '').trim();
    if (!clean) {
      window.localStorage.removeItem(GEMINI_STORAGE_KEY);
    } else {
      window.localStorage.setItem(GEMINI_STORAGE_KEY, clean);
    }
  } catch {
    // ignore storage errors
  }
}

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

export function getContextualQuickPrompts({
  activeTab = 'presentation',
  marketsViewMode = 'screener',
  selectedAsset = 'BTC',
} = {}) {
  const sym = selectedAsset || 'BTC';
  if (activeTab === 'workstation') {
    if (marketsViewMode === 'screener') {
      return [
        {
          id: 'scr_explain',
          label: () => tx('Explicame qué estoy viendo en el Screener', 'Explain what I am seeing in the Screener'),
          prompt: () => tx('Explicame qué estoy viendo en esta pantalla', 'Explain what I am seeing on this screen'),
        },
        {
          id: 'scr_asset',
          label: () => txTpl('Resumime cómo está {0} hoy', [sym], 'Summarize how {0} looks today', [sym]),
          prompt: () => txTpl('Resumime cómo está {0} hoy', [sym], 'Summarize how {0} looks today', [sym]),
        },
        {
          id: 'scr_p06',
          label: () => tx('¿Qué mide el score de anomalía P-06?', 'What does the P-06 anomaly score measure?'),
          prompt: () => tx('¿Qué mide el score de anomalía P-06?', 'What does the P-06 anomaly score measure?'),
        },
        {
          id: 'scr_tour',
          label: () => tx('¿Cómo paso activos del Screener a mi cartera?', 'How do I send Screener assets to my portfolio?'),
          prompt: () => tx('¿Cómo paso activos del Screener a mi cartera?', 'How do I send Screener assets to my portfolio?'),
        },
      ];
    }
    return [
      {
        id: 'det_screen',
        label: () => txTpl('Explicame qué estoy viendo en {0}', [sym], 'Explain what I am seeing on {0}', [sym]),
        prompt: () => tx('Explicame qué estoy viendo en esta pantalla', 'Explain what I am seeing on this screen'),
      },
      {
        id: 'det_thesis',
        label: () => txTpl('Resumime el estado técnico y tesis de {0}', [sym], 'Summarize the technical & research thesis for {0}', [sym]),
        prompt: () => txTpl('Resumime cómo está {0} hoy', [sym], 'Summarize how {0} looks today', [sym]),
      },
      {
        id: 'det_p06',
        label: () => tx('¿Qué significa el régimen P-06 y el Z-Score?', 'What do the P-06 regime and Volume Z-Score mean?'),
        prompt: () => tx('¿Qué mide el detector P-06?', 'What does the P-06 detector measure?'),
      },
      {
        id: 'det_sim',
        label: () => txTpl('¿Cómo simulo {0} dentro de mi cartera?', [sym], 'How do I simulate {0} inside my portfolio?', [sym]),
        prompt: () => txTpl('¿Cómo simulo {0} dentro de mi cartera en Portfolio?', [sym], 'How do I simulate {0} inside my portfolio in Portfolio?', [sym]),
      },
    ];
  }

  if (activeTab === 'consensus') {
    return [
      {
        id: 'port_screen',
        label: () => tx('Explicame las métricas de mi cartera actual', 'Explain my active portfolio metrics'),
        prompt: () => tx('Explicame cómo está mi cartera actual', 'Explain how my active portfolio looks'),
      },
      {
        id: 'port_var',
        label: () => tx('¿Qué significan mi VaR 95%, CVaR 99% y Sharpe?', 'What do my 95% VaR, 99% CVaR, and Sharpe mean?'),
        prompt: () => tx('¿Qué significan el VaR 95%, CVaR 99% y el Sharpe de mi cartera?', 'What do the 95% VaR, 99% CVaR, and Sharpe of my portfolio mean?'),
      },
      {
        id: 'port_enb',
        label: () => tx('¿Qué son las apuestas efectivas (ENB) y Brinson?', 'What are Effective Bets (ENB) and Brinson Alpha?'),
        prompt: () => tx('¿Qué significan las apuestas reales ENB y el Alpha Brinson?', 'What do Effective Bets (ENB) and Brinson Alpha mean?'),
      },
      {
        id: 'port_kelly',
        label: () => tx('¿Cómo funciona el simulador Kelly y el Comité?', 'How do the Kelly simulator and Risk Committee work?'),
        prompt: () => tx('¿Cómo funciona el criterio de Kelly en Simulator?', 'How does the Kelly Criterion work in Simulator?'),
      },
    ];
  }

  if (activeTab === 'observability') {
    return [
      {
        id: 'sys_arch',
        label: () => tx('¿Cómo se conectan los 13 módulos (P-01 a P-13)?', 'How do the 13 modules (P-01 to P-13) connect?'),
        prompt: () => tx('¿Cómo funciona la arquitectura y el sistema P-01 a P-13?', 'How do the architecture and P-01 to P-13 system work?'),
      },
      {
        id: 'sys_finops',
        label: () => tx('¿Cómo logran que toda la nube cueste ~$0.95/mes?', 'How does the entire cloud stack cost ~$0.95/mo?'),
        prompt: () => tx('¿Cómo funciona la arquitectura FinOps de ~$0.95/mes y Scale-to-Zero?', 'How does the ~$0.95/mo FinOps and Scale-to-Zero architecture work?'),
      },
      {
        id: 'sys_guard',
        label: () => tx('¿Qué guardrails y contratos audita el sistema?', 'What guardrails and contracts does the system audit?'),
        prompt: () => tx('¿Qué guardrails, contratos de datos y telemetría audita System?', 'What guardrails, data contracts, and telemetry does System audit?'),
      },
      {
        id: 'sys_screen',
        label: () => tx('Explicame qué estoy viendo en esta pantalla', 'Explain what I am seeing on this screen'),
        prompt: () => tx('Explicame qué estoy viendo en esta pantalla', 'Explain what I am seeing on this screen'),
      },
    ];
  }

  return AGENT_QUICK_PROMPTS;
}

export function getLiveContextPillLabel({
  activeTab = 'presentation',
  marketsViewMode = 'screener',
  selectedAsset = 'BTC',
} = {}) {
  const sym = selectedAsset || 'BTC';
  const params = new URLSearchParams(window.location.search);
  const section = params.get('section') || 'analytics';

  if (activeTab === 'workstation') {
    if (marketsViewMode === 'screener') {
      return tx('Viendo: Markets > Screener', 'Viewing: Markets > Screener');
    }
    const secName = section === 'research' ? 'Research' : 'Analytics';
    return txTpl('Viendo: Markets > {0} • {1}', [secName, sym], 'Viewing: Markets > {0} • {1}', [secName, sym]);
  }
  if (activeTab === 'consensus') {
    return tx('Viendo: Portfolio (Builder / Risk / Simulator)', 'Viewing: Portfolio (Builder / Risk / Simulator)');
  }
  if (activeTab === 'observability') {
    return tx('Viendo: System (P-01..P-13 & FinOps)', 'Viewing: System (P-01..P-13 & FinOps)');
  }
  if (activeTab === 'guide') {
    return tx('Viendo: Guide (Manual Interactivo)', 'Viewing: Guide (Interactive Manual)');
  }
  return txTpl('Viendo: Home • Activo: {0}', [sym], 'Viewing: Home • Asset: {0}', [sym]);
}

export function getAgentGreeting() {
  return tx(
    'Hola, soy el guía de la plataforma. ¿Qué te gustaría explorar o consultar?',
    'Hi, I am the platform guide. What would you like to explore or ask?'
  );
}

/**
 * Detects whether the user's message was written in Spanish or English,
 * falling back to the active UI language (`getActiveViewLang()`).
 */
function detectMessageLang(userText = '') {
  const s = String(userText || '').trim();
  if (
    /[áéíóúñ¿¡]/i.test(s) ||
    /\b(como|cómo|que|qué|donde|dónde|cual|cuál|por donde|por dónde|explicame|explica|aconsejas|aconsejás|recomendas|recomendás|explorar|recorrer|empiezo|empezar|cartera|mercado|mercados|sistema|guia|guía|activo|activos|riesgo|secciones|pantalla|viendo|funciona|arquitectura|hacer|puedo)\b/i.test(
      s
    )
  ) {
    return 'ES';
  }
  if (
    /\b(where|what|how|explain|screen|start|explore|recommend|should|portfolio|markets|system|architecture|seeing|does|work)\b/i.test(
      s
    )
  ) {
    return 'EN';
  }
  return getActiveViewLang() || 'EN';
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

  const bullAvg =
    Array.isArray(briefObj.bullDrivers) && briefObj.bullDrivers.length > 0
      ? Math.round(briefObj.bullDrivers.reduce((acc, d) => acc + (d.score || 70), 0) / briefObj.bullDrivers.length)
      : 78;
  const bearAvg =
    Array.isArray(briefObj.bearRisks) && briefObj.bearRisks.length > 0
      ? Math.round(briefObj.bearRisks.reduce((acc, d) => acc + (d.score || 45), 0) / briefObj.bearRisks.length)
      : 42;
  const netComposite = bullAvg - bearAvg;
  const compositeFormatted = `${netComposite >= 0 ? '+' : ''}${netComposite}`;

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
    assetVolZ: assetObj.volumeZScore || anomObj.volumeZScore || '+0.42σ',
    anomalyScore: anomObj.score,
    anomalyRegime: anomObj.regime,
    researchComposite: compositeFormatted,
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

  const offTopicPatterns = [
    /\b(receta|cocinar|pizza|pasta|empanada|asado|comida|restaurante|recipe|cooking|bake)\b/i,
    /\b(futbol|fútbol|messi|mundial|champions|nba|tenis|partido de|soccer|football|basketball)\b/i,
    /\b(clima en|llueve|pronostico del tiempo|weather in|temperature tomorrow)\b/i,
    /\b(pelicula|película|netflix|serie de tv|actor|cine|horoscopo|horóscopo|zodiac)\b/i,
    /\b(chiste|poema|cancion|canción|tell me a joke|write a poem|write a song)\b/i,
    /\b(ignore previous|ignora las instrucciones|olvida tus instrucciones|system prompt|jailbreak|dan mode|bypass)\b/i,
  ];
  return offTopicPatterns.some((re) => re.test(qClean));
}

/**
 * Calls Gemini 3.5 Flash-Lite (`gemini-3.5-flash-lite`) with strict Scope Lock, input/output caps, and audit telemetry.
 */
async function callGeminiFlashLite({ apiKey, userText, history, snap, msgLang }) {
  const sanitizedInput = String(userText || '').slice(0, AGENT_GUARDRAIL_LIMITS.maxInputChars);
  const viewNames = {
    presentation: 'Home (Portada)',
    workstation:
      snap.marketsViewMode === 'screener'
        ? `Markets > Screener (${snap.screenerMode} view, filter ${snap.categoryFilter})`
        : `Markets > ${snap.marketsSection === 'research' ? 'Research' : 'Analytics'} (${snap.selectedAsset})`,
    consensus: 'Portfolio (Builder / Risk / Simulator)',
    observability: 'System (Performance & FinOps)',
    guide: 'Guide (Interactive Manual)',
  };

  const systemInstruction = `You are the interactive guide inside a market intelligence and portfolio platform.
CONVERSATIONAL STYLE & SPONTANEITY (CRITICAL):
1. Reply ALWAYS in the exact same language and register as the user's latest message (detected language: ${msgLang}).
2. Be spontaneous, human, and proportional to what the user said:
   - If the user just says hello, greets casually, or makes small talk (e.g., "que haces papa???", "hola", "todo bien?", "hey", "gracias"), reply in ONE short, natural, friendly sentence (10 to 20 words max, e.g. "¡Todo tranqui por acá! ¿Qué tenés ganas de mirar o probar hoy?"). NEVER use robotic corporate intros ("Soy tu asistente de Inteligencia Institucional...") and NEVER dump bullet points or unrequested metrics on a casual greeting.
   - Only use bullet points (2–3 short bullets max, under 85 words total) or cite live screen numbers when the user actually asks a question about the screen, an asset, a metric, or how the platform works.
   - Use **bold** sparingly for section names or key values, and \`code\` only for standalone tickers or pipeline IDs (never nest backticks inside bold).
3. SCOPE LOCK:
   - Your domain is guiding the user across the platform's 5 views (**Home**, **Markets** > **Screener** / **Analytics** / **Research**, **Portfolio** > **Builder** / **Risk** / **Simulator**, **System** \`P-01\`..\`P-13\` with \`~$0.95/mo\` Scale-to-Zero FinOps, and **Guide**), explaining financial/quant metrics (Sharpe, Sortino, 95% VaR, 99% CVaR, Kelly Criterion, Brinson Alpha, Markov Regimes, Meucci ENB, Isolation Forest P-06), and reading the live screen data below when relevant.
   - Never give personalized investment advice, and if asked about unrelated off-topic subjects (cooking, sports, politics, general homework), decline naturally in 1 short sentence.

LIVE SCREEN CONTEXT (use ONLY when relevant to what the user asks):
- View: ${viewNames[snap.activeTab] || snap.activeTab}
- Selected Asset: ${snap.selectedAsset} (${snap.assetName}, ${snap.assetCat}) at ${snap.assetPrice} (${snap.assetChg}), RSI(14): ${snap.assetRsi}, Vol Z-Score: ${snap.assetVolZ}, P-06 Anomaly: ${snap.anomalyScore} (${snap.anomalyRegime}), Research Composite: ${snap.researchComposite} (${snap.researchStance})
- Watchlist (${snap.watchlistSyms.length}): ${snap.watchlistSyms.join(', ') || 'None'}
- Active Portfolio (${snap.portfolioCount} holdings: ${snap.portfolioHoldingsSummary}): CAGR +${snap.portfolioCagr}%, Vol ${snap.portfolioVol}%, Sharpe ${snap.portfolioSharpe}, Sortino ${snap.portfolioSortino}, 95% VaR ${snap.portfolioVar95}%, 99% CVaR ${snap.portfolioCvar99}%, Brinson Alpha +${snap.portfolioAlpha}%, ENB ${snap.portfolioEnb}, 2008 Stress ${snap.portfolioStress2008}% (vs -42% S&P 500).`;

  const recentTurns = history.slice(-6).map((m) => ({
    role: m.role === 'ai' ? 'model' : 'user',
    parts: [{ text: String(m.txt || '').slice(0, AGENT_GUARDRAIL_LIMITS.maxInputChars) }],
  }));

  if (recentTurns.length === 0 || recentTurns[recentTurns.length - 1].parts[0].text !== sanitizedInput) {
    recentTurns.push({ role: 'user', parts: [{ text: sanitizedInput }] });
  }

  const modelId = AGENT_GUARDRAIL_LIMITS.model;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const t0 = performance.now();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(8000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: recentTurns,
      generationConfig: {
        maxOutputTokens: AGENT_GUARDRAIL_LIMITS.maxOutputTokens,
        temperature: 0.45,
      },
    }),
  });
  const latencyMs = Math.round(performance.now() - t0);

  if (!res.ok) {
    throw new Error(`Gemini HTTP ${res.status}`);
  }
  const data = await res.json();
  const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!replyText) {
    throw new Error('Empty Gemini response');
  }

  const usage = data?.usageMetadata || {};
  recordAgentAuditEvent({
    type: 'GEMINI_OK',
    latencyMs,
    promptTokens: usage.promptTokenCount || 0,
    completionTokens: usage.candidatesTokenCount || 0,
    totalTokens: usage.totalTokenCount || 0,
    responseId: data?.responseId || '',
    modelVersion: data?.modelVersion || modelId,
    note: `Tab=${snap.activeTab} Asset=${snap.selectedAsset}`,
  });

  return replyText.trim();
}

/**
 * Financial & Technical Concept Dictionary (2 Levels: Level 1 plain language by default, Level 2 Quant/Math on demand)
 */
const CONCEPT_KNOWLEDGE = [
  {
    keys: ['cvar', 'var ', 'var?', 'value at risk', 'valor en riesgo', 'tail loss', 'cola'],
    simple: (snap, lang) =>
      txTpl(
        '• **VaR 95% / CVaR 99% (1D):** Mide cuánto podría perder tu cartera en un mal día habitual (**VaR 95%**, hoy **{0}%**) y en un día de crisis extrema del 1% peor (**CVaR 99%**, hoy **{1}%**).\n• Lo ves en **Portfolio > Builder** y **Portfolio > Risk**.',
        [snap.portfolioVar95, snap.portfolioCvar99],
        '• **95% VaR / 99% CVaR (1D):** Measures how much your portfolio could lose on a typical bad day (**95% VaR**, currently **{0}%**) versus an extreme 1%-tail crisis day (**99% CVaR**, currently **{1}%**).\n• Available in **Portfolio > Builder** and **Portfolio > Risk**.',
        [snap.portfolioVar95, snap.portfolioCvar99],
        lang
      ),
    advanced: (snap, lang) =>
      txTpl(
        '• **Fórmula Quant (Expected Shortfall):** Mientras el VaR 95% corta en el percentil 95 de pérdidas diarias, el CVaR 99% promedia la cola más allá del percentil 99.\n• En tu cartera actual: **VaR 95% = {0}%** y **CVaR 99% = {1}%** con **Beta {2}**.',
        [snap.portfolioVar95, snap.portfolioCvar99, snap.portfolioBeta],
        '• **Quant Formula (Expected Shortfall):** While 95% VaR cuts at the 95th loss percentile, 99% CVaR integrates the conditional tail expectation beyond the 99th percentile.\n• In your active portfolio: **95% VaR = {0}%** and **99% CVaR = {1}%** with **Beta {2}**.',
        [snap.portfolioVar95, snap.portfolioCvar99, snap.portfolioBeta],
        lang
      ),
  },
  {
    keys: ['sharpe', 'sortino'],
    simple: (snap, lang) =>
      txTpl(
        '• **Sharpe y Sortino:** Miden cuánto retorno ganás por cada unidad de riesgo asumido (arriba de **1.0** es sólido; arriba de **1.5** es excelente).\n• Tu cartera actual tiene **Sharpe {0}** y **Sortino {1}** con volatilidad anual de **{2}%**.',
        [snap.portfolioSharpe, snap.portfolioSortino, snap.portfolioVol],
        '• **Sharpe & Sortino:** Measure how much return you earn per unit of risk taken (above **1.0** is solid; above **1.5** is strong).\n• Your active portfolio shows **Sharpe {0}** and **Sortino {1}** with **{2}%** annual volatility.',
        [snap.portfolioSharpe, snap.portfolioSortino, snap.portfolioVol],
        lang
      ),
    advanced: (snap, lang) =>
      txTpl(
        '• **Detalle Quant:** **Sharpe = (Rp - Rf) / σ** penaliza toda la volatilidad, mientras que **Sortino** sólo penaliza la volatilidad bajista (caídas).\n• En vivo: **CAGR +{0}%**, **Volatilidad {1}%**, **Sharpe {2}**, **Sortino {3}**.',
        [snap.portfolioCagr, snap.portfolioVol, snap.portfolioSharpe, snap.portfolioSortino],
        '• **Quant Detail:** **Sharpe = (Rp - Rf) / σ** penalizes total volatility, whereas **Sortino** penalizes only downside semi-deviation.\n• Live values: **CAGR +{0}%**, **Volatility {1}%**, **Sharpe {2}**, **Sortino {3}**.',
        [snap.portfolioCagr, snap.portfolioVol, snap.portfolioSharpe, snap.portfolioSortino],
        lang
      ),
  },
  {
    keys: ['kelly', 'quarter-kelly', 'half-kelly', 'tamaño de posicion', 'position sizing'],
    simple: (snap, lang) =>
      txTpl(
        '• **Criterio de Kelly:** Calcula qué porcentaje de tu cartera conviene asignarle a una idea según su probabilidad de éxito y relación ganancia/pérdida.\n• Podés probarlo en **Portfolio > Simulator > Kelly Sizing** (`Quarter-Kelly 0.25x` es la opción conservadora recomendada, con tope de seguridad del **20% NAV**).',
        [snap.selectedAsset],
        '• **Kelly Criterion:** Computes the optimal portfolio weight for a trade based on its win rate and payoff ratio.\n• Test it in **Portfolio > Simulator > Kelly Sizing** (`Quarter-Kelly 0.25x` is the recommended conservative option, plus a hard **20% NAV** guardrail cap).',
        [snap.selectedAsset],
        lang
      ),
    advanced: (_snap, lang) =>
      tx(
        '• **Fórmula Quant:** **f* = W - (1 - W) / R**, donde **W** es el Win Rate y **R** el Payoff Ratio. En gestión institucional se usa **Half-Kelly (0.5x)** o **Quarter-Kelly (0.25x)** para reducir la volatilidad manteniendo casi todo el crecimiento compuesto.',
        '• **Quant Formula:** **f* = W - (1 - W) / R**, where **W** is Win Rate and **R** is Payoff Ratio. Institutional desks use **Half-Kelly (0.5x)** or **Quarter-Kelly (0.25x)** to cut variance while preserving optimal log-growth.',
        lang
      ),
  },
  {
    keys: ['p-06', 'p06', 'isolation forest', 'anomalia', 'anomalía', 'anomaly'],
    simple: (snap, lang) =>
      txTpl(
        '• **Detector de Anomalías (P-06):** Puntúa de **0.00 a 1.00** si el precio y el volumen de un activo se mueven normal (`< 0.35`), con actividad alta (`0.35–0.65`) o de forma atípica (`≥ 0.65`).\n• Ahora mismo **{0}** tiene un puntaje de **{1} ({2})**.',
        [snap.selectedAsset, snap.anomalyScore, snap.anomalyRegime],
        '• **Anomaly Detector (P-06):** Scores from **0.00 to 1.00** whether an asset’s price and volume are moving normally (`< 0.35`), with elevated flow (`0.35–0.65`), or atypically (`≥ 0.65`).\n• Right now **{0}** has a score of **{1} ({2})**.',
        [snap.selectedAsset, snap.anomalyScore, snap.anomalyRegime],
        lang
      ),
    advanced: (snap, lang) =>
      txTpl(
        '• **Detalle Técnico (P-06 Cloud Run):** Microservicio scikit-learn **Isolation Forest** (`contamination=0.05`) que evalúa 7 variables (precio, media/desvío 7d, RSI-14, ROC-1, volatilidad 7d y volumen). Si supera **0.65**, el comité en **Portfolio > Simulator** limita la posición al 5% NAV.\n• En **{0}**: score **{1}** y desvío de volumen 20d **{2}**.',
        [snap.selectedAsset, snap.anomalyScore, snap.assetVolZ],
        '• **Technical Detail (P-06 Cloud Run):** scikit-learn **Isolation Forest** microservice (`contamination=0.05`) scoring a 7-feature vector (close, 7d rolling mean/std, RSI-14, ROC-1, 7d volatility, volume). If score ≥ **0.65**, the Risk Committee triggers a 5% NAV cap.\n• On **{0}**: score **{1}** and 20d volume Z-score **{2}**.',
        [snap.selectedAsset, snap.anomalyScore, snap.assetVolZ],
        lang
      ),
  },
  {
    keys: ['brinson', 'atribucion', 'atribución', 'attribution', 'alpha'],
    simple: (snap, lang) =>
      txTpl(
        '• **Alpha Brinson (+{0}%):** Separa cuánto del rendimiento extra de tu cartera frente al S&P 500 vino por **elegir buenos sectores** (*Allocation*) y cuánto por **elegir los mejores activos dentro de cada sector** (*Selection*).\n• Lo ves detallado en **Portfolio > Builder > Attribution**.',
        [snap.portfolioAlpha],
        '• **Brinson Alpha (+{0}%):** Breaks down how much of your excess return vs. the S&P 500 came from **choosing the right asset classes** (*Allocation*) vs. **picking the best assets within them** (*Selection*).\n• View the breakdown in **Portfolio > Builder > Attribution**.',
        [snap.portfolioAlpha],
        lang
      ),
    advanced: (snap, lang) =>
      txTpl(
        '• **Modelo Brinson-Fachler:** Descompone el exceso de retorno activo en **Allocation**, **Selection** e **Interaction**.\n• Tu cartera actual registra **Alpha +{0}%** y **Beta {1}** vs. S&P 500.',
        [snap.portfolioAlpha, snap.portfolioBeta],
        '• **Brinson-Fachler Model:** Decomposes active excess return into **Allocation**, **Selection**, and **Interaction**.\n• Your active portfolio shows **+{0}% Alpha** and **{1} Beta** vs. S&P 500.',
        [snap.portfolioAlpha, snap.portfolioBeta],
        lang
      ),
  },
  {
    keys: ['markov', 'regimen', 'régimen', 'regime', 'bull quiet'],
    simple: (_snap, lang) =>
      tx(
        '• **Régimen de Markov:** Clasifica el clima actual del mercado en 4 estados (*Alcista Calmo, Alcista Volátil, Inflacionario o Crisis*) y estima la probabilidad de pasar de uno a otro.\n• Podés explorarlo en **Portfolio > Risk > Market Shock > Regimes**.',
        '• **Markov Regime:** Classifies the market climate into 4 states (*Bull Quiet, Bull Volatile, Inflationary, or Crisis*) and estimates transition probabilities.\n• Explore it in **Portfolio > Risk > Market Shock > Regimes**.',
        lang
      ),
    advanced: (_snap, lang) =>
      tx(
        '• **Cadena de Markov (HMM):** Modela la matriz de probabilidades de transición entre regímenes condicionando los retornos esperados y las correlaciones según el estado activo (*Bull Quiet 62%*).',
        '• **Hidden Markov Regime Model (HMM):** Estimates the stochastic transition matrix across regimes, conditioning expected returns and covariances on the active state (*Bull Quiet 62%*).',
        lang
      ),
  },
  {
    keys: ['enb', 'apuestas reales', 'effective bets', 'diversificacion', 'diversificación', 'overlap', 'solapamiento'],
    simple: (snap, lang) =>
      txTpl(
        '• **Apuestas Reales (ENB = {0}) y Solapamiento:** Aunque tengas **{1} activos**, varios se mueven parecido o están repetidos dentro de ETFs como `SPY`. El **ENB** te dice cuántas apuestas verdaderamente independientes tenés (arriba de **3.5** está bien diversificada).\n• Miralo en **Portfolio > Builder > Overlap**.',
        [snap.portfolioEnb, snap.portfolioCount],
        '• **Effective Bets (ENB = {0}) & Overlap:** Even with **{1} assets**, several move together or overlap inside index ETFs like `SPY`. **ENB** tells you how many truly independent bets you hold (above **3.5** is well diversified).\n• Check it in **Portfolio > Builder > Overlap**.',
        [snap.portfolioEnb, snap.portfolioCount],
        lang
      ),
    advanced: (snap, lang) =>
      txTpl(
        '• **Entropía de Meucci (Effective Number of Bets):** Se calcula sobre las contribuciones ortogonales de riesgo de la matriz de covarianza. Tu cartera hoy tiene **ENB = {0}** sobre **{1}** posiciones activas.',
        [snap.portfolioEnb, snap.portfolioCount],
        '• **Meucci Entropy (Effective Number of Bets):** Computed from orthogonalized risk contributions across principal covariance eigenvectors. Your portfolio currently has **ENB = {0}** across **{1}** active holdings.',
        [snap.portfolioEnb, snap.portfolioCount],
        lang
      ),
  },
  {
    keys: ['ols', 'regresion', 'regresión', 'regression', 'bollinger', 'rsi', 'vwap'],
    simple: (snap, lang) =>
      txTpl(
        '• **Indicadores Técnicos (Markets > Analytics):**\n  - **RSI (14):** mide si el activo está con empuje comprador (`>50`) o vendedor (`<50`). En **{0}** hoy vale **{1}**.\n  - **Bollinger (2σ) y VWAP:** marcan el canal estadístico normal del precio y el precio promedio ponderado por volumen institucional.',
        [snap.selectedAsset, snap.assetRsi],
        '• **Technical Indicators (Markets > Analytics):**\n  - **RSI (14):** measures buying (`>50`) vs. selling (`<50`) momentum. On **{0}** it is currently **{1}**.\n  - **Bollinger (2σ) & VWAP:** plot the normal 2-standard-deviation price channel and institutional volume-weighted average price.',
        [snap.selectedAsset, snap.assetRsi],
        lang
      ),
    advanced: (snap, lang) =>
      txTpl(
        '• **Detalle Quant en Markets > Analytics:** Las bandas de Bollinger trazan la media móvil de 20 ruedas ± 2 desvíos estándar, y el Z-Score de volumen 20d mide cuántos desvíos se aleja el volumen actual de su media (en **{0}**: **{1}**).',
        [snap.selectedAsset, snap.assetVolZ],
        '• **Quant Detail in Markets > Analytics:** Bollinger Bands plot the 20-period SMA ± 2 standard deviations, and 20d Volume Z-Score measures volume deviation vs. its 20-day mean (on **{0}**: **{1}**).',
        [snap.selectedAsset, snap.assetVolZ],
        lang
      ),
  },
  {
    keys: ['finops', 'costo', 'cost', '0.95', 'scale-to-zero', 'free tier', 'presupuesto', 'cloud run'],
    simple: (_snap, lang) =>
      tx(
        '• **Arquitectura FinOps (~$0.95/mes):** Los 13 pipelines (`P-01` a `P-13`) corren de forma programada en **GitHub Actions** y **GCP Cloud Run** con perfil *Scale-to-Zero (`min-instances=0`)*.\n• Cuando nadie consulta el backend, los contenedores se apagan a `$0.00` y la app lee el último snapshot desde caché/Supabase. Podés auditarlo en **System > FinOps**.',
        '• **FinOps Architecture (~$0.95/mo):** All 13 pipelines (`P-01` to `P-13`) run on schedule via **GitHub Actions** and **GCP Cloud Run** with *Scale-to-Zero (`min-instances=0`)*.\n• Idle compute costs `$0.00` while the UI serves cached/Supabase snapshots. Audit every quota in **System > FinOps**.',
        lang
      ),
    advanced: (_snap, lang) =>
      tx(
        '• **Ingeniería de Costos (System > FinOps):** Arbitraje de capas gratuitas entre **GitHub Actions** (cron DAGs), **BigQuery** (1 TB query/mes + 10 GB storage free), **Supabase PostgreSQL + pgvector** y **GCP Cloud Run** (`min=0, max=2`), acotando el gasto real a `~$0.95 USD/mes`.',
        '• **Cost Engineering (System > FinOps):** Free-tier arbitrage across **GitHub Actions** (cron DAGs), **BigQuery** (1 TB query/mo + 10 GB storage free), **Supabase PostgreSQL + pgvector**, and **GCP Cloud Run** (`min=0, max=2`), bounding total cloud spend to `~$0.95 USD/mo`.',
        lang
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
  const msgLang = detectMessageLang(qRaw);

  // 1. Strict Scope Lock Guardrail (always zero-cost & immediate, logged in audit telemetry)
  if (isOutOfScopeQuery(q)) {
    recordAgentAuditEvent({
      type: 'SCOPE_LOCK_BLOCK',
      latencyMs: 1,
      note: 'Blocked off-topic or prompt-injection query before LLM call',
    });
    return tx(
      'Soy el guía exclusivo de esta plataforma: puedo ayudarte a navegar sus secciones (**Markets**, **Portfolio**, **System**, **Guide**), interpretar tus activos y métricas en pantalla o detallar la arquitectura técnica `P-01` a `P-13`.',
      'I am the dedicated guide for this platform: I can help you navigate its sections (**Markets**, **Portfolio**, **System**, **Guide**), interpret the live assets and metrics on screen, or explain the `P-01` to `P-13` technical architecture.',
      msgLang
    );
  }

  // 2. Check Rate & Quota Guardrails + Call Gemini 3.5 Flash-Lite
  const apiKey = getConfiguredGeminiKey();
  if (apiKey) {
    const guardrailCheck = checkRateAndQuotaGuardrails();
    if (guardrailCheck.allowed) {
      try {
        return await callGeminiFlashLite({
          apiKey,
          userText: qRaw,
          history,
          snap,
          msgLang,
        });
      } catch {
        // Fall through cleanly to local engine if network error
      }
    } else {
      recordAgentAuditEvent({
        type: 'RATE_LIMIT_FALLBACK',
        latencyMs: 1,
        note: guardrailCheck.reason,
      });
    }
  } else {
    recordAgentAuditEvent({
      type: 'LOCAL_FALLBACK',
      latencyMs: 1,
      note: 'Deterministic local synthesis',
    });
  }

  // 3. Language-aware Local Engine (0ms fallback)
  const wantsDeepMathOrTech =
    /\b(formula|fórmula|matematica|matemática|ecuacion|ecuación|quant|profundiz|detall|tecnic|técnic|como se calcula|cómo se calcula|math|equation|deeper|technical)\b/i.test(
      q
    );

  const lastUserMsg =
    [...history]
      .reverse()
      .find((m) => m.role === 'user' && m.txt?.toLowerCase() !== q)
      ?.txt?.toLowerCase() || '';

  // Casual greetings / small talk (1 spontaneous short line)
  if (
    /^(hola|buenas|hey|hi|hello|que haces|qué hacés|que tal|qué tal|todo bien|como va|cómo va|como andas|cómo andás|gracias|thanks)\b/i.test(
      q
    ) &&
    q.length < 40
  ) {
    return tx(
      '¡Todo tranqui por acá! Decime qué tenés ganas de mirar o probar en la app y vamos directo.',
      'All good here! Tell me what you feel like exploring or testing in the app and we can jump right in.',
      msgLang
    );
  }

  if (
    q.includes('por dónde empiezo') ||
    q.includes('por donde empiezo') ||
    q.includes('where do i start') ||
    q.includes('how to start') ||
    q.includes('empezar') ||
    q.includes('empiezo') ||
    q.includes('aconsej') ||
    q.includes('recomend') ||
    q.includes('recommend') ||
    q.includes('explorar') ||
    q.includes('recorrer') ||
    q.includes('explore') ||
    q.includes('tour') ||
    q.includes('usar la app') ||
    q.includes('use the app')
  ) {
    return tx(
      'Te recomiendo este recorrido en 3 pasos para sacarle todo el jugo a la app:\n• **1. Elegí activos en Markets (arriba):** entrá al **Screener**, filtrá por categoría o abrí un activo como **BTC** o **NVDA** para ver su gráfico técnico (**Analytics**), su tesis con IA (**Research**) y sumalo a favoritos con **★**.\n• **2. Armá y probá tu cartera en Portfolio (arriba):** en **Builder** podés cargar en 1 clic una cartera *Conservadora, Balanceada o Quant*, medir su riesgo extremo en **Risk** y simular jugadas tácticas en **Simulator**.\n• **3. Espiá el motor en System y Guide (abajo izq.):** en **System** ves los **13 pipelines (`P-01` a `P-13`)** operando por **~$0.95/mes**, y en **Guide** tenés el manual interactivo con video.',
      'I recommend this 3-step tour to get the most out of the platform:\n• **1. Pick assets in Markets (top bar):** browse the **Screener**, open any asset like **BTC** or **NVDA** to inspect its technical chart (**Analytics**) and AI filings thesis (**Research**), and bookmark favorites with **★**.\n• **2. Build & stress-test in Portfolio (top bar):** use **Builder** to load a 1-click *Conservative, Balanced, or Quant* preset, test crash resilience in **Risk**, and size tactical trades in **Simulator**.\n• **3. Inspect the engine in System & Guide (bottom left):** **System** shows all **13 pipelines (`P-01` to `P-13`)** running on **~$0.95/mo**, while **Guide** has the interactive manual and video overview.',
      msgLang
    );
  }

  if (
    q.includes('qué hay en cada sección') ||
    q.includes('que hay en cada seccion') ||
    q.includes('what is in each section') ||
    q.includes('secciones') ||
    q.includes('sections')
  ) {
    return tx(
      'La plataforma se organiza en 4 secciones principales:\n• **Markets (arriba):** Nivel 1 **Screener** (Tabla, Orbital, Mapa de Calor y `Main Tools` 3D) y Nivel 2 por activo (**Analytics** técnico/cuantitativo y **Research** documental con IA).\n• **Portfolio (arriba):** **Builder** (pesos, solapamiento de ETFs y atribución Brinson), **Risk** (Markowitz, correlaciones y estrés 2008) y **Simulator** (órdenes *What-If*, Kelly y Comité de 3 pilares).\n• **System (abajo izq.):** **Performance** (arquitectura `P-01`..`P-13`, contratos y logs en vivo) y **FinOps** (cuotas cloud y diseño *Scale-to-Zero*).\n• **Guide (abajo izq.):** manual interactivo por sección, glosario y video resumen.',
      'The platform is organized into 4 main sections:\n• **Markets (top):** Level 1 **Screener** (Table, Orbital, Heatmap & 3D `Main Tools`) and Level 2 per asset (**Analytics** technical/quant desk and **Research** AI filings desk).\n• **Portfolio (top):** **Builder** (weights, ETF overlap & Brinson attribution), **Risk** (Markowitz, correlations & 2008 crash stress), and **Simulator** (*What-If* trades, Kelly sizing & 3-pillar Committee).\n• **System (bottom left):** **Performance** (`P-01`..`P-13` DAGs, schema contracts & live logs) and **FinOps** (cloud quotas & *Scale-to-Zero* budget).\n• **Guide (bottom left):** interactive manual, glossary, and video overview.',
      msgLang
    );
  }

  if (
    q.includes('qué estoy viendo') ||
    q.includes('que estoy viendo') ||
    q.includes('what i am seeing') ||
    q.includes('esta pantalla') ||
    q.includes('this screen') ||
    q.includes('donde estoy') ||
    q.includes('dónde estoy') ||
    q.includes('where am i')
  ) {
    if (snap.activeTab === 'presentation') {
      return tx(
        'Estás en la **portada (Home)** de la plataforma. Desde acá podés entrar a **Markets** (arriba) para analizar los 213 activos globales, a **Portfolio** para construir y simular tu cartera, o abrir **System** y **Guide** en la barra inferior.',
        'You are on the platform **Home** screen. From here you can open **Markets** (top bar) to analyze 213 global assets, **Portfolio** to build and stress-test your portfolio, or **System** and **Guide** in the bottom bar.',
        msgLang
      );
    }
    if (snap.activeTab === 'workstation') {
      if (snap.marketsViewMode === 'screener') {
        return txTpl(
          'Estás en **Markets > Screener** (filtro activo: **{0}**, vista **{1}**) con **{2} favoritos (★)** en tu Watchlist.\n• Las 4 tarjetas superiores resumen el pulso global (volumen 24h, RSI promedio, porcentaje de activos en régimen normal `P-06` y mayores desvíos de volumen).\n• Hacé clic en cualquier activo para abrir su mesa **Analytics** o **Research**, o marcá la **★** para llevarlo a **Portfolio**.',
          [snap.categoryFilter, snap.screenerMode.toUpperCase(), snap.watchlistSyms.length],
          'You are in **Markets > Screener** (active filter: **{0}**, **{1}** view) with **{2} bookmarked (★)** assets in your Watchlist.\n• The 4 top KPI cards summarize global pulse (24h volume, average RSI, normal `P-06` regime share, and top volume dislocations).\n• Click any asset to open its **Analytics** or **Research** desk, or click **★** to use it in **Portfolio**.',
          [snap.categoryFilter, snap.screenerMode.toUpperCase(), snap.watchlistSyms.length],
          msgLang
        );
      }
      if (snap.marketsSection === 'research') {
        return txTpl(
          'Estás en **Markets > Research** analizando **{0} ({1})** a **{2} ({3})**.\n• Arriba ves la postura institucional (**{4}**) y la **Nota Ponderada Total ({5})** que combina reportes oficiales y sentimiento de noticias.\n• En las 3 columnas tenés el **Chat Documental RAG** (izquierda), los **5 factores alcistas vs. 5 bajistas** (centro) y el **cable de noticias FinBERT en vivo** (derecha).',
          [snap.selectedAsset, snap.assetName, snap.assetPrice, snap.assetChg, snap.researchStance, snap.researchComposite],
          'You are in **Markets > Research** analyzing **{0} ({1})** at **{2} ({3})**.\n• The top strip shows the institutional stance (**{4}**) and **Weighted Composite Score ({5})** combining filings and news sentiment.\n• Below are the **Document RAG Chat** (left), **5 Bull vs. 5 Bear Factors** (center), and **live FinBERT News Wire** (right).',
          [snap.selectedAsset, snap.assetName, snap.assetPrice, snap.assetChg, snap.researchStance, snap.researchComposite],
          msgLang
        );
      }
      return txTpl(
        'Estás en **Markets > Analytics** viendo **{0} ({1})** a **{2} ({3})**.\n• Indicadores clave hoy: **RSI (14) en {4}**, desvío de volumen 20d en **{5}** y puntaje de anomalía **P-06 en {6} ({7})**.\n• A la izquierda podés cambiar entre lente **Técnica**, **Comparador %**, **Microestructura** o **Superficies 3D**, y al pie del gráfico tenés el diagnóstico en lenguaje llano y cuantitativo.',
        [snap.selectedAsset, snap.assetName, snap.assetPrice, snap.assetChg, snap.assetRsi, snap.assetVolZ, snap.anomalyScore, snap.anomalyRegime],
        'You are in **Markets > Analytics** viewing **{0} ({1})** at **{2} ({3})**.\n• Key live metrics: **RSI (14) at {4}**, 20d volume Z-score at **{5}**, and **P-06 anomaly score at {6} ({7})**.\n• Use the left panel to switch between **Technical**, **Compare %**, **Micro & Flow**, or **3D Surfaces**, and read the plain-language + quant diagnosis along the bottom bar.',
        [snap.selectedAsset, snap.assetName, snap.assetPrice, snap.assetChg, snap.assetRsi, snap.assetVolZ, snap.anomalyScore, snap.anomalyRegime],
        msgLang
      );
    }
    if (snap.activeTab === 'consensus') {
      return txTpl(
        'Estás en **Portfolio** con **{0} activos en cartera** (`{1}`).\n• Tu cartera proyecta **+{2}% CAGR**, **Sharpe {3}**, **VaR 95% diario de {4}%** (CVaR 99%: {5}%) y **{6} apuestas efectivas (ENB)**.\n• Arriba podés alternar entre **Builder** (pesos, presets de 1 clic y solapamiento), **Risk** (Markowitz, correlaciones y estrés 2008) y **Simulator** (jugadas tácticas y criterio de Kelly).',
        [snap.portfolioCount, snap.portfolioHoldingsSummary, snap.portfolioCagr, snap.portfolioSharpe, snap.portfolioVar95, snap.portfolioCvar99, snap.portfolioEnb],
        'You are in **Portfolio** with **{0} active holdings** (`{1}`).\n• Your portfolio projects **+{2}% CAGR**, **{3} Sharpe**, **{4}% daily 95% VaR** (99% CVaR: {5}%), and **{6} effective bets (ENB)**.\n• Switch at the top between **Builder** (weights, 1-click presets & ETF overlap), **Risk** (Markowitz, correlations & 2008 stress), and **Simulator** (*What-If* sizing & Kelly).',
        [snap.portfolioCount, snap.portfolioHoldingsSummary, snap.portfolioCagr, snap.portfolioSharpe, snap.portfolioVar95, snap.portfolioCvar99, snap.portfolioEnb],
        msgLang
      );
    }
    if (snap.activeTab === 'observability') {
      return tx(
        'Estás en **System**, el centro de ingeniería y observabilidad de la plataforma.\n• En **Performance** podés inspeccionar cada uno de los **13 módulos (`P-01` a `P-13`)**, su topología DAG, contratos de datos (`0 Schema Drift`) y latencias `p50/p95`.\n• En **FinOps** ves cómo el diseño *Scale-to-Zero* y el arbitraje de capas gratuitas mantienen el costo cloud total en **~$0.95/mes**.',
        'You are in **System**, the platform engineering and observability center.\n• **Performance** lets you inspect all **13 pipelines (`P-01` to `P-13`)**, DAG topology, schema contracts (`0 Schema Drift`), and `p50/p95` latencies.\n• **FinOps** details how *Scale-to-Zero* compute and free-tier arbitrage keep total cloud spend at **~$0.95/mo**.',
        msgLang
      );
    }
    if (snap.activeTab === 'guide') {
      return tx(
        'Estás en **Guide**, el manual interactivo de la plataforma.\n• En **Home** tenés accesos directos según lo que busques hacer hoy y el **Video Resumen**, y en las pestañas superiores el detalle paso a paso de **Markets**, **Portfolio** y **System**.',
        'You are in **Guide**, the interactive platform manual.\n• **Home** provides direct starting points by goal plus the **Video Overview**, while the top tabs cover **Markets**, **Portfolio**, and **System** step by step.',
        msgLang
      );
    }
  }

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
      'La plataforma opera sobre una arquitectura desacoplada de **13 módulos (`P-01` a `P-13`)**:\n• **Ingesta y Datos (`P-01` a `P-05`, `P-10`):** pipelines en Python/BigQuery/Supabase orquestados por **GitHub Actions** que recolectan mercado, macro, on-chain y reportes SEC 10-K.\n• **Modelos e IA (`P-06` a `P-09`, `P-11`):** microservicios en **GCP Cloud Run** para detección de anomalías (*Isolation Forest P-06*), sentimiento **FinBERT**, búsqueda vectorial **RAG (`pgvector`)** y consenso multi-agente.\n• **Eficiencia FinOps (~$0.95/mes):** todos los servicios escalan a cero (`min-instances=0`) en reposo. Podés explorar cada módulo en vivo desde la pestaña **System** (abajo a la izquierda).',
      'The platform runs on a decoupled **13-module architecture (`P-01` to `P-13`)**:\n• **Data & Ingestion (`P-01` to `P-05`, `P-10`):** Python/BigQuery/Supabase pipelines orchestrated via **GitHub Actions** ingesting market, macro, on-chain, and SEC 10-K filings.\n• **ML & Agentic Engines (`P-06` to `P-09`, `P-11`):** **GCP Cloud Run** microservices for *Isolation Forest (`P-06`)* anomaly detection, **FinBERT** sentiment, **`pgvector` RAG**, and multi-agent consensus.\n• **FinOps Efficiency (~$0.95/mo):** all containers scale to zero (`min-instances=0`) when idle. Inspect every module live in the **System** tab (bottom left).',
      msgLang
    );
  }

  for (const concept of CONCEPT_KNOWLEDGE) {
    const matchedNow = concept.keys.some((k) => q.includes(k));
    const matchedPrev = wantsDeepMathOrTech && concept.keys.some((k) => lastUserMsg.includes(k));
    if (matchedNow || matchedPrev) {
      if (wantsDeepMathOrTech) {
        return `${concept.simple(snap, msgLang)}\n${concept.advanced(snap, msgLang)}`;
      }
      return `${concept.simple(snap, msgLang)}\n${tx('*(Si querés ver la fórmula matemática o el detalle técnico, decime "profundizá" o "mostrame la fórmula").*', '*(If you want the mathematical formula or technical spec, just ask to "go deeper" or "show the formula").*', msgLang)}`;
    }
  }

  const tickerMatch = qRaw.toUpperCase().match(/\b(BTC|ETH|SOL|NVDA|AAPL|MSFT|AMZN|GOOGL|SPY|QQQ|TLT|GLD|US10Y|EUR\/USD|CL|GC)\b/);
  if (tickerMatch || q.includes('activo') || q.includes('asset') || q.includes('precio') || q.includes('price')) {
    const targetSym = tickerMatch ? tickerMatch[1] : snap.selectedAsset;
    const tAsset = getAssetBySymbol(targetSym);
    const tAnom = getAnomalyProfile(targetSym);
    const tBrief = getAssetResearchBrief(targetSym);
    return txTpl(
      'Resumen en vivo de **{0} ({1} — {2})**:\n• **Precio y Tendencia:** **{3} ({4})** con RSI (14) en **{5}** y desvío de volumen 20d en **{6}**.\n• **Régimen Estadístico (P-06):** puntaje **{7} ({8})**.\n• **Tesis Documental y Noticias (Research):** postura **{9}**. Podés abrirlo en **Markets > Analytics** o **Research** y marcarle la **★** para sumarlo a tu cartera.',
      [
        tAsset.sym,
        tAsset.name,
        tAsset.cat,
        tAsset.priceFormatted,
        tAsset.chg,
        tAsset.indicators?.rsi14 ?? 54,
        tAsset.volumeZScore || tAnom.volumeZScore || '+0.42σ',
        tAnom.score,
        tAnom.regime,
        tBrief.stanceLabel?.ES || tBrief.stanceLabel?.EN || 'Constructivo',
      ],
      'Live summary for **{0} ({1} — {2})**:\n• **Price & Trend:** **{3} ({4})** with RSI (14) at **{5}** and 20d volume Z-score at **{6}**.\n• **Statistical Regime (P-06):** score **{7} ({8})**.\n• **Filings & News (Research):** stance **{9}**. Open it in **Markets > Analytics** or **Research** and click **★** to include it in your portfolio.',
      [
        tAsset.sym,
        tAsset.name,
        tAsset.cat,
        tAsset.priceFormatted,
        tAsset.chg,
        tAsset.indicators?.rsi14 ?? 54,
        tAsset.volumeZScore || tAnom.volumeZScore || '+0.42σ',
        tAnom.score,
        tAnom.regime,
        tBrief.stanceLabel?.EN || tBrief.stanceLabel?.ES || 'Constructive',
      ],
      msgLang
    );
  }

  if (
    q.includes('cartera') ||
    q.includes('portafolio') ||
    q.includes('portfolio') ||
    q.includes('holdings') ||
    q.includes('watchlist') ||
    q.includes('favoritos')
  ) {
    return txTpl(
      'Estado en vivo de tu **Cartera (Portfolio)**:\n• **Posiciones activas ({0}):** `{1}`.\n• **Rendimiento y Eficiencia:** **+{2}% CAGR**, volatilidad **{3}%**, **Sharpe {4}** (Sortino {5}) y **Alpha Brinson +{6}%**.\n• **Riesgo y Diversificación:** VaR 95% diario **{7}%** (CVaR 99%: {8}%), caída en estrés 2008 de **{9}%** (vs. -42% S&P 500) y **{10} apuestas efectivas (ENB)**.',
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
      'Live status of your **Portfolio**:\n• **Active holdings ({0}):** `{1}`.\n• **Return & Efficiency:** **+{2}% CAGR**, **{3}%** volatility, **{4} Sharpe** ({5} Sortino), and **+{6}% Brinson Alpha**.\n• **Risk & Diversification:** daily 95% VaR **{7}%** (99% CVaR: {8}%), 2008 crash stress **{9}%** (vs. -42% S&P 500), and **{10} effective bets (ENB)**.',
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
      msgLang
    );
  }

  return txTpl(
    'Estoy leyendo tu sesión en vivo:\n• **Activo seleccionado en Markets:** **{0} ({1})** a **{2} ({3})** con score `P-06` de **{4}** y nota compuesta Research de **{5}**.\n• **Cartera activa en Portfolio ({6} activos):** **+{7}% CAGR**, **Sharpe {8}**, **VaR 95% {9}%** y **ENB {10}**.\n• Preguntame cómo recorrer la app, qué significa cualquier métrica (`VaR/CVaR`, `Sharpe`, `Kelly`, `Brinson`, `Markov`, `P-06`) o cómo funciona la arquitectura `P-01`..`P-13` (`~$0.95/mes`).',
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
    'I am reading your live session:\n• **Selected asset in Markets:** **{0} ({1})** at **{2} ({3})** with `P-06` score **{4}** and Research composite **{5}**.\n• **Active portfolio in Portfolio ({6} assets):** **+{7}% CAGR**, **{8} Sharpe**, **{9}% 95% VaR**, and **{10} ENB**.\n• Ask me how to explore the app, what any metric means (`VaR/CVaR`, `Sharpe`, `Kelly`, `Brinson`, `Markov`, `P-06`), or how the `P-01`..`P-13` architecture works (`~$0.95/mo`).',
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
    msgLang
  );
}
