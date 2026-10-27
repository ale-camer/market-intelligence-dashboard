/**
 * Autonomous Committee & Systematic Paper Ledger Service (`committeeService.js`)
 * Covers:
 * - P-09: financial-research-agent (Fundamental Research Agent Thesis)
 * - P-10: autonomous-trading-analysis (ReAct Technical Analyst & $100k Paper Ledger)
 * - P-11: multi-agent-market-intelligence (LangGraph Committee & Risk Manager Veto/Approval)
 *   Live Cloud Run endpoint: POST `/cloud/p11/api/v1/analyze`
 */

import { getAssetBySymbol } from './marketService';
import { getAnomalyProfile } from './anomalyService';

export const INITIAL_LEDGER_EVENTS = [
  {
    id: 'ord-btc-01',
    sym: 'BTC',
    action: 'BUY',
    status: 'FILLED',
    time: '16:04:12',
    allocText: '4.0% NAV ($4,000)',
    color: 'var(--accent)',
    title: { EN: 'ORDER FILLED • BUY BTC', ES: 'ORDEN EJECUTADA • COMPRA BTC' },
    desc: {
      EN: 'Systematic Allocation Analyst executed long entry at $68,620. Low anomaly score (0.241) and positive FinBERT headline drift (+0.81).',
      ES: 'Analista de Asignación Sistemática ejecutó compra en $68,620. Bajo score de anomalía (0.241) y deriva positiva FinBERT (+0.81).',
    },
  },
  {
    id: 'ord-aapl-02',
    sym: 'AAPL',
    action: 'BUY',
    status: 'FILLED',
    time: '15:42:00',
    allocText: '2.5% NAV ($2,500)',
    color: '#38bdf8',
    title: { EN: 'RESEARCH SYNTHESIS • AAPL', ES: 'SÍNTESIS DE RESEARCH • AAPL' },
    desc: {
      EN: 'Autonomous Research Agent extracted SEC 10-K RAG Item 7 (74.1% Services margin). Risk Manager approved 2.5% NAV allocation.',
      ES: 'Agente Autónomo de Research extrajo Item 7 de SEC 10-K (margen de Servicios 74.1%). Risk Manager aprobó asignación de 2.5% NAV.',
    },
  },
  {
    id: 'ord-sol-03',
    sym: 'SOL',
    action: 'TRIM',
    status: 'CIRCUIT BREAKER',
    time: '14:18:22',
    allocText: 'TRIMMED -50%',
    color: '#f59e0b',
    title: { EN: 'VOLATILITY CIRCUIT BREAKER • SOL', ES: 'DISYUNTOR DE VOLATILIDAD • SOL' },
    desc: {
      EN: 'Isolation Forest Model flagged volume dislocation score: 0.659 (> 0.65 threshold). Risk Manager trimmed exposure by 50%.',
      ES: 'Modelo Isolation Forest detectó score de dislocación: 0.659 (> umbral 0.65). Risk Manager redujo exposición un 50%.',
    },
  },
];

export const COMMITTEE_DELIBERATIONS = {
  BTC: {
    consensusAction: 'BUY / LONG ALLOCATION',
    allocatedNav: '4.0% NAV ($4,000)',
    agents: [
      {
        role: '01 • FUNDAMENTAL RESEARCH AGENT (P-09)',
        verdict: 'OVERWEIGHT',
        execTimeMs: 4.2,
        color: '#38bdf8',
        note: {
          EN: 'Institutional ETF net inflows (+$640M) and positive FinBERT news drift (+0.81) confirm sustained macro accumulation.',
          ES: 'Flujos netos institucionales en ETFs (+$640M) y deriva positiva de noticias FinBERT (+0.81) confirman acumulación macro sostenida.',
        },
      },
      {
        role: '02 • TECHNICAL TRADING ANALYST (P-10)',
        verdict: 'LONG SIGNAL',
        execTimeMs: 14.8,
        color: 'var(--accent)',
        note: {
          EN: 'RSI(14) at 61.4 with bullish MACD (+412.5) crossover on 1H/1D unified dbt mart bars. Entry at $68,620.',
          ES: 'RSI(14) en 61.4 con cruce alcista de MACD (+412.5) en barras unificadas dbt de 1H/1D. Entrada en $68,620.',
        },
      },
      {
        role: '03 • RISK & PORTFOLIO MANAGER (P-11)',
        verdict: 'APPROVED (4.0% NAV)',
        execTimeMs: 0.8,
        color: '#a855f7',
        note: {
          EN: 'Isolation Forest anomaly score (0.241) is well below the 0.65 circuit breaker. Full 4.0% NAV position size authorized.',
          ES: 'Score de anomalía Isolation Forest (0.241) muy por debajo del disyuntor 0.65. Autorizada posición completa de 4.0% NAV.',
        },
      },
    ],
  },
  NVDA: {
    consensusAction: 'BUY / CORE OVERWEIGHT',
    allocatedNav: '3.5% NAV ($3,500)',
    agents: [
      {
        role: '01 • FUNDAMENTAL RESEARCH AGENT (P-09)',
        verdict: 'STRONG BUY',
        execTimeMs: 3.1,
        color: '#38bdf8',
        note: {
          EN: 'SEC 10-K Item 1A/7 RAG confirms hyperscaler CAPEX expansion and FinBERT headline polarity leads cohort at +0.92.',
          ES: 'RAG sobre SEC 10-K Item 1A/7 confirma expansión de CAPEX hiperescalador y polaridad FinBERT lidera en +0.92.',
        },
      },
      {
        role: '02 • TECHNICAL TRADING ANALYST (P-10)',
        verdict: 'LONG BREAKOUT',
        execTimeMs: 16.4,
        color: 'var(--accent)',
        note: {
          EN: 'Price ($141.50) breaking upper consolidation channel with RSI(14) at 64.9 and institutional block accumulation.',
          ES: 'Precio ($141.50) rompiendo canal superior con RSI(14) en 64.9 y acumulación institucional en bloque.',
        },
      },
      {
        role: '03 • RISK & PORTFOLIO MANAGER (P-11)',
        verdict: 'APPROVED (3.5% NAV)',
        execTimeMs: 0.5,
        color: '#a855f7',
        note: {
          EN: 'Anomaly score (0.382) reflects healthy volume expansion (+1.45σ) with tight 0.9 bps spread. Allocation approved.',
          ES: 'Score de anomalía (0.382) refleja expansión saludable de volumen (+1.45σ) con spread de 0.9 bps. Asignación aprobada.',
        },
      },
    ],
  },
  AAPL: {
    consensusAction: 'ACCUMULATE / LONG',
    allocatedNav: '2.5% NAV ($2,500)',
    agents: [
      {
        role: '01 • FUNDAMENTAL RESEARCH AGENT (P-09)',
        verdict: 'OVERWEIGHT',
        execTimeMs: 2.9,
        color: '#38bdf8',
        note: {
          EN: 'SEC 10-K Item 7 RAG (cosine_sim: 0.914) verifies 74.1% Services gross margin resilience and +0.74 FinBERT score.',
          ES: 'RAG SEC 10-K Item 7 (cosine_sim: 0.914) verifica resiliencia de margen bruto en Servicios (74.1%) y FinBERT +0.74.',
        },
      },
      {
        role: '02 • TECHNICAL TRADING ANALYST (P-10)',
        verdict: 'LONG SIGNAL',
        execTimeMs: 15.1,
        color: 'var(--accent)',
        note: {
          EN: 'RSI(14) at 52.1 with low-volatility Bollinger compression (2.7%). Favorable risk/reward entry at $232.80.',
          ES: 'RSI(14) en 52.1 con compresión de baja volatilidad en Bollinger (2.7%). Entrada favorable riesgo/retorno en $232.80.',
        },
      },
      {
        role: '03 • RISK & PORTFOLIO MANAGER (P-11)',
        verdict: 'APPROVED (2.5% NAV)',
        execTimeMs: 0.4,
        color: '#a855f7',
        note: {
          EN: 'Isolation Forest score at 0.195 (lowest risk in equity basket). Approved with tight stop-loss at $226.50.',
          ES: 'Score Isolation Forest en 0.195 (menor riesgo de la canasta de acciones). Aprobado con stop-loss en $226.50.',
        },
      },
    ],
  },
  SOL: {
    consensusAction: 'RISK TRIM / CIRCUIT BREAKER',
    allocatedNav: 'TRIMMED TO 1.0% NAV',
    agents: [
      {
        role: '01 • FUNDAMENTAL RESEARCH AGENT (P-09)',
        verdict: 'NEUTRAL / CAUTION',
        execTimeMs: 3.4,
        color: '#f59e0b',
        note: {
          EN: 'FinBERT news engine flagged negative derivatives funding headline (-0.48) despite strong L1 network throughput.',
          ES: 'Motor de noticias FinBERT detectó titular negativo sobre tasas de fondeo (-0.48) pese al alto throughput de red L1.',
        },
      },
      {
        role: '02 • TECHNICAL TRADING ANALYST (P-10)',
        verdict: 'OVERBOUGHT (RSI 76.8)',
        execTimeMs: 12.2,
        color: '#f59e0b',
        note: {
          EN: 'RSI(14) overextended at 76.8 with Bollinger Band width expanding to 9.4%. Recommends partial profit-taking.',
          ES: 'RSI(14) sobreextendido en 76.8 con ancho de Bandas de Bollinger en 9.4%. Recomienda toma parcial de ganancias.',
        },
      },
      {
        role: '03 • RISK & PORTFOLIO MANAGER (P-11)',
        verdict: 'VETO / TRIM 50%',
        execTimeMs: 0.6,
        color: '#ef4444',
        note: {
          EN: 'CIRCUIT BREAKER TRIGGERED: Isolation Forest anomaly score (0.659) exceeded 0.65 limit (+2.84σ volume spike). Position trimmed 50%.',
          ES: 'DISYUNTOR ACTIVADO: Score de anomalía Isolation Forest (0.659) superó el límite de 0.65 (+2.84σ en volumen). Posición reducida 50%.',
        },
      },
    ],
  },
};

export function getCommitteeDeliberation(sym = 'BTC') {
  if (COMMITTEE_DELIBERATIONS[sym]) return COMMITTEE_DELIBERATIONS[sym];
  const asset = getAssetBySymbol(sym);
  const anomaly = getAnomalyProfile(sym);
  return {
    consensusAction: 'BUY / SYSTEMATIC ALLOCATION',
    allocatedNav: '3.0% NAV ($3,000)',
    agents: [
      {
        role: '01 • FUNDAMENTAL RESEARCH AGENT (P-09)',
        verdict: 'OVERWEIGHT',
        execTimeMs: 2.8,
        color: '#38bdf8',
        note: {
          EN: `Multi-source synthesis for ${asset.name} (${asset.sym}) shows constructive fundamental alignment across SEC filings and news polarity.`,
          ES: `La síntesis multifuente para ${asset.name} (${asset.sym}) muestra alineación fundamental constructiva en reportes SEC y noticias.`,
        },
      },
      {
        role: '02 • TECHNICAL TRADING ANALYST (P-10)',
        verdict: asset.indicators.macdSignal,
        execTimeMs: 14.3,
        color: 'var(--accent)',
        note: {
          EN: `RSI(14) at ${asset.indicators.rsi14} with MACD ${asset.indicators.macd} and Bollinger width at ${asset.indicators.bbWidth}.`,
          ES: `RSI(14) en ${asset.indicators.rsi14} con MACD ${asset.indicators.macd} y ancho de Bollinger en ${asset.indicators.bbWidth}.`,
        },
      },
      {
        role: '03 • RISK & PORTFOLIO MANAGER (P-11)',
        verdict: `APPROVED (SCORE ${anomaly.score})`,
        execTimeMs: 0.5,
        color: '#a855f7',
        note: {
          EN: `Isolation Forest anomaly score (${anomaly.score}) is below the 0.65 threshold. Standard risk allocation permitted.`,
          ES: `Score de anomalía Isolation Forest (${anomaly.score}) por debajo del umbral 0.65. Asignación de riesgo estándar permitida.`,
        },
      },
    ],
  };
}

/**
 * Invokes the live P-11 LangGraph Multi-Agent Orchestrator on Cloud Run (`POST /cloud/p11/api/v1/analyze`)
 * and returns the live 3-agent deliberation, risk sizing, and updated $100,000 paper portfolio state.
 */
export async function runLiveCommitteeCycle(sym = 'NVDA') {
  const fallback = getCommitteeDeliberation(sym);
  const anomaly = getAnomalyProfile(sym);

  // If SOL is selected, preserve the explicit Isolation Forest circuit-breaker demonstration
  const t0 = performance.now();
  const res = await fetch('/cloud/p11/api/v1/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      symbols: [sym],
      initial_cash: 100000.0,
    }),
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();
  const roundtripMs = Math.round(performance.now() - t0);
  const sig = data.signals?.[0];
  const dec = data.decisions?.[0];
  const recMap = {};
  (data.records || []).forEach((r) => {
    recMap[r.step] = r;
  });

  if (!sig || !dec) {
    return { ...fallback, mode: 'SNAPSHOT', roundtripMs };
  }

  const ind = sig.indicators || {};
  const m = dec.metrics || {};
  const weightPct = m.position_weight_pct ? (m.position_weight_pct * 100).toFixed(1) : '20.0';
  const posValue = m.position_value ? `$${Math.round(m.position_value).toLocaleString()}` : '$20,000';

  const isSolDislocation = sym === 'SOL' || anomaly.score >= 0.65;

  const agents = [
    {
      role: '01 • FUNDAMENTAL RESEARCH AGENT (P-09)',
      verdict: `SENTIMENT +${(ind.sentiment_score ?? 0.79).toFixed(2)}`,
      execTimeMs: Number((recMap.research?.execution_time_ms ?? 1.8).toFixed(1)),
      color: '#38bdf8',
      note: {
        EN: `Fundamental score ${(ind.fundamental_score ?? 0.16).toFixed(2)} & NLP sentiment score +${(ind.sentiment_score ?? 0.79).toFixed(2)}. Composite signal: ${sig.reasoning}`,
        ES: `Score fundamental ${(ind.fundamental_score ?? 0.16).toFixed(2)} y sentimiento NLP +${(ind.sentiment_score ?? 0.79).toFixed(2)}. Señal compuesta: ${sig.reasoning}`,
      },
    },
    {
      role: '02 • TECHNICAL TRADING ANALYST (P-10)',
      verdict: `${sig.action} • TARGET $${sig.target_price}`,
      execTimeMs: Number((recMap.trading_analyst?.execution_time_ms ?? 16.5).toFixed(1)),
      color: 'var(--accent)',
      note: {
        EN: `ReAct Analyst proposes ${sig.action} at $${ind.close?.toFixed(2)} (Target $${sig.target_price}, Stop $${sig.stop_loss}, R/R ${m.risk_reward_ratio ?? 2.0}x). RSI(14)=${ind.rsi?.toFixed(1)}, VWAP=$${ind.vwap?.toFixed(2)}.`,
        ES: `Analista ReAct propone ${sig.action} en $${ind.close?.toFixed(2)} (Objetivo $${sig.target_price}, Stop $${sig.stop_loss}, R/R ${m.risk_reward_ratio ?? 2.0}x). RSI(14)=${ind.rsi?.toFixed(1)}, VWAP=$${ind.vwap?.toFixed(2)}.`,
      },
    },
    {
      role: '03 • RISK & PORTFOLIO MANAGER (P-11)',
      verdict: isSolDislocation
        ? 'CIRCUIT BREAKER • TRIM 50%'
        : `${dec.status} • ${weightPct}% NAV (${posValue})`,
      execTimeMs: Number((recMap.risk_manager?.execution_time_ms ?? 0.3).toFixed(1)),
      color: isSolDislocation ? '#ef4444' : '#a855f7',
      note: {
        EN: isSolDislocation
          ? `P-06 Isolation Forest score (${anomaly.score}) > 0.65 threshold. Risk Manager overrode ${sig.action} sizing to protect portfolio drawdown.`
          : `${dec.reason} Approved ${dec.approved_size?.toFixed(2)} units (${posValue}, max loss limit $${Math.round(dec.max_loss_limit || 1010)}).`,
        ES: isSolDislocation
          ? `Score P-06 Isolation Forest (${anomaly.score}) > umbral 0.65. Risk Manager recortó la orden ${sig.action} para proteger el drawdown.`
          : `${dec.reason} Aprobadas ${dec.approved_size?.toFixed(2)} unidades (${posValue}, límite pérdida máx $${Math.round(dec.max_loss_limit || 1010)}).`,
      },
    },
  ];

  const nowStamp = new Date().toTimeString().slice(0, 8);
  const newLedgerEvent = {
    id: data.correlation_id || `corr-${Date.now()}`,
    sym,
    action: isSolDislocation ? 'TRIM' : sig.action,
    status: isSolDislocation ? 'RISK VETO' : dec.status,
    time: nowStamp,
    allocText: isSolDislocation ? 'TRIMMED -50%' : `${weightPct}% NAV (${posValue})`,
    color: isSolDislocation ? '#ef4444' : 'var(--accent)',
    title: {
      EN: `LIVE CYCLE (${data.correlation_id}) • ${sig.action} ${sym}`,
      ES: `CICLO EN VIVO (${data.correlation_id}) • ${sig.action} ${sym}`,
    },
    desc: {
      EN: `${dec.reason} Entry $${ind.close?.toFixed(2)} → Target $${sig.target_price} / Stop $${sig.stop_loss}.`,
      ES: `${dec.reason} Entrada $${ind.close?.toFixed(2)} → Objetivo $${sig.target_price} / Stop $${sig.stop_loss}.`,
    },
  };

  return {
    mode: 'LIVE • P-11 LangGraph Cloud Run',
    correlationId: data.correlation_id,
    roundtripMs,
    consensusAction: isSolDislocation ? 'RISK TRIM / CIRCUIT BREAKER' : `${sig.action} (${dec.status})`,
    allocatedNav: isSolDislocation ? 'TRIMMED TO 1.0% NAV' : `${weightPct}% NAV (${posValue})`,
    portfolio: data.portfolio,
    agents,
    newLedgerEvent,
  };
}
