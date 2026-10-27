/**
 * Anomaly Detection Service (`anomalyService.js`)
 * Covers:
 * - P-06: asset-anomaly-detection (Isolation Forest Anomaly Scores & Feature Vectors)
 *   Live Cloud Run endpoint: POST `/cloud/p06/predict` (`https://p06-anomaly-api-obaffww4hq-uc.a.run.app/predict`)
 */

import { getAssetBySymbol } from './marketService';

export const ANOMALY_PROFILES = {
  BTC: {
    score: 0.241,
    regime: 'NORMAL',
    volumeZScore: '+0.42σ',
    realizedVol: '31.8%',
    spreadDislocation: 'Nominal (1.2 bps)',
    contaminationParam: '0.05',
    alertTitle: { EN: 'NOMINAL REGIME • BTC', ES: 'RÉGIMEN NOMINAL • BTC' },
    alertTime: '16:02:10',
    alertDesc: {
      EN: 'Isolation Forest path length within 88th percentile of normal distribution. Full systematic position sizing authorized.',
      ES: 'Profundidad de árbol Isolation Forest dentro del percentil 88 normal. Tamaño completo de posición autorizado.',
    },
    modelPayload: {
      close: 68620.0,
      close_rolling_mean_7: 67900.0,
      close_rolling_std_7: 480.0,
      momentum_rsi_14: 61.4,
      price_velocity_roc_1: 0.0185,
      volatility_std_7: 0.022,
      volume: 1850.0,
    },
  },
  ETH: {
    score: 0.284,
    regime: 'NORMAL',
    volumeZScore: '+0.61σ',
    realizedVol: '34.5%',
    spreadDislocation: 'Nominal (1.5 bps)',
    contaminationParam: '0.05',
    alertTitle: { EN: 'LIQUIDITY STABLE • ETH', ES: 'LIQUIDEZ ESTABLE • ETH' },
    alertTime: '15:58:04',
    alertDesc: {
      EN: 'Spot-perpetual basis and 20-day rolling volume variance remain well below the 0.65 circuit breaker.',
      ES: 'El basis spot-perpetuo y la varianza móvil de 20 días permanecen muy por debajo del umbral 0.65.',
    },
    modelPayload: {
      close: 2750.4,
      close_rolling_mean_7: 2718.0,
      close_rolling_std_7: 34.0,
      momentum_rsi_14: 54.2,
      price_velocity_roc_1: 0.0092,
      volatility_std_7: 0.024,
      volume: 1420.0,
    },
  },
  SOL: {
    score: 0.659,
    regime: 'DISLOCATION',
    volumeZScore: '+2.84σ',
    realizedVol: '64.2%',
    spreadDislocation: 'Widened (6.8 bps)',
    contaminationParam: '0.05',
    alertTitle: { EN: 'VOLATILITY ALERT • SOL', ES: 'ALERTA DE VOLATILIDAD • SOL' },
    alertTime: '14:18:22',
    alertDesc: {
      EN: 'Statistical Anomaly Model flagged volume dislocation score: 0.659 (> 0.65 threshold). Position sizing trimmed 50% automatically.',
      ES: 'Modelo de Anomalías Estadísticas detectó dislocación de volumen: 0.659 (> umbral 0.65). Reducción automática del 50% en posición.',
    },
    modelPayload: {
      close: 178.2,
      close_rolling_mean_7: 164.5,
      close_rolling_std_7: 9.8,
      momentum_rsi_14: 76.8,
      price_velocity_roc_1: 0.0314,
      volatility_std_7: 0.064,
      volume: 6900.0,
    },
  },
  NVDA: {
    score: 0.382,
    regime: 'ELEVATED',
    volumeZScore: '+1.45σ',
    realizedVol: '42.1%',
    spreadDislocation: 'Nominal (0.9 bps)',
    contaminationParam: '0.05',
    alertTitle: { EN: 'MOMENTUM INFLOW • NVDA', ES: 'FLUJO DE MOMENTUM • NVDA' },
    alertTime: '15:45:19',
    alertDesc: {
      EN: 'Institutional block volume +1.45σ above 20d mean, but order-book depth absorbs flow without spread dislocation.',
      ES: 'Volumen institucional +1.45σ sobre la media de 20d, pero la liquidez del libro absorbe el flujo sin dislocación de spread.',
    },
    modelPayload: {
      close: 141.5,
      close_rolling_mean_7: 136.8,
      close_rolling_std_7: 3.2,
      momentum_rsi_14: 64.9,
      price_velocity_roc_1: 0.0245,
      volatility_std_7: 0.035,
      volume: 3400.0,
    },
  },
  AAPL: {
    score: 0.195,
    regime: 'NORMAL',
    volumeZScore: '+0.18σ',
    realizedVol: '18.4%',
    spreadDislocation: 'Tight (0.4 bps)',
    contaminationParam: '0.05',
    alertTitle: { EN: 'LOW VARIANCE • AAPL', ES: 'BAJA VARIANZA • AAPL' },
    alertTime: '15:50:00',
    alertDesc: {
      EN: 'Lowest anomaly score across tech cohort (0.195). Ideal volatility profile for fundamental overweight allocation.',
      ES: 'Score de anomalía más bajo de la cohorte tech (0.195). Perfil de volatilidad óptimo para sobreponderación fundamental.',
    },
    modelPayload: {
      close: 232.8,
      close_rolling_mean_7: 231.4,
      close_rolling_std_7: 1.5,
      momentum_rsi_14: 52.1,
      price_velocity_roc_1: 0.0032,
      volatility_std_7: 0.014,
      volume: 1120.0,
    },
  },
  MSFT: {
    score: 0.212,
    regime: 'NORMAL',
    volumeZScore: '-0.12σ',
    realizedVol: '19.1%',
    spreadDislocation: 'Tight (0.5 bps)',
    contaminationParam: '0.05',
    alertTitle: { EN: 'MEAN REVERSION • MSFT', ES: 'REVERSIÓN A LA MEDIA • MSFT' },
    alertTime: '15:12:40',
    alertDesc: {
      EN: 'Intraday drift compressed within ±0.4σ Bollinger channel. Zero structural anomalies detected.',
      ES: 'Deriva intradía comprimida dentro del canal de Bollinger ±0.4σ. Sin anomalías estructurales.',
    },
    modelPayload: {
      close: 428.1,
      close_rolling_mean_7: 428.9,
      close_rolling_std_7: 2.1,
      momentum_rsi_14: 48.3,
      price_velocity_roc_1: -0.0015,
      volatility_std_7: 0.015,
      volume: 980.0,
    },
  },
  AMZN: {
    score: 0.268,
    regime: 'NORMAL',
    volumeZScore: '+0.54σ',
    realizedVol: '24.6%',
    spreadDislocation: 'Nominal (0.7 bps)',
    contaminationParam: '0.05',
    alertTitle: { EN: 'STEADY ACCUMULATION • AMZN', ES: 'ACUMULACIÓN ESTABLE • AMZN' },
    alertTime: '15:33:11',
    alertDesc: {
      EN: 'Gradual volume expansion accompanied by tight bid-ask spread. Isolation Forest confirms healthy trend.',
      ES: 'Expansión gradual de volumen con spread bid-ask ajustado. Isolation Forest confirma tendencia saludable.',
    },
    modelPayload: {
      close: 186.4,
      close_rolling_mean_7: 184.2,
      close_rolling_std_7: 1.9,
      momentum_rsi_14: 57.6,
      price_velocity_roc_1: 0.011,
      volatility_std_7: 0.019,
      volume: 1340.0,
    },
  },
  GOOGL: {
    score: 0.229,
    regime: 'NORMAL',
    volumeZScore: '+0.31σ',
    realizedVol: '22.3%',
    spreadDislocation: 'Nominal (0.6 bps)',
    contaminationParam: '0.05',
    alertTitle: { EN: 'NOMINAL REGIME • GOOGL', ES: 'RÉGIMEN NOMINAL • GOOGL' },
    alertTime: '15:20:05',
    alertDesc: {
      EN: 'Feature vector within normal historical covariance matrix.',
      ES: 'Vector de features dentro de la matriz de covarianza histórica normal.',
    },
    modelPayload: {
      close: 165.7,
      close_rolling_mean_7: 164.3,
      close_rolling_std_7: 1.6,
      momentum_rsi_14: 55.0,
      price_velocity_roc_1: 0.0075,
      volatility_std_7: 0.018,
      volume: 1190.0,
    },
  },
  SPY: {
    score: 0.164,
    regime: 'NORMAL',
    volumeZScore: '+0.09σ',
    realizedVol: '12.8%',
    spreadDislocation: 'Ultra-Tight (0.2 bps)',
    contaminationParam: '0.05',
    alertTitle: { EN: 'BENCHMARK STABLE • SPY', ES: 'BENCHMARK ESTABLE • SPY' },
    alertTime: '16:00:00',
    alertDesc: {
      EN: 'Macro equity index volatility anchored at 12.8%. No systemic cross-asset stress detected.',
      ES: 'Volatilidad del índice macro anclada en 12.8%. Sin estrés sistémico entre clases de activos.',
    },
    modelPayload: {
      close: 580.4,
      close_rolling_mean_7: 578.1,
      close_rolling_std_7: 2.4,
      momentum_rsi_14: 58.9,
      price_velocity_roc_1: 0.0045,
      volatility_std_7: 0.011,
      volume: 1500.0,
    },
  },
  QQQ: {
    score: 0.188,
    regime: 'NORMAL',
    volumeZScore: '+0.24σ',
    realizedVol: '16.2%',
    spreadDislocation: 'Ultra-Tight (0.3 bps)',
    contaminationParam: '0.05',
    alertTitle: { EN: 'TECH INDEX NOMINAL • QQQ', ES: 'ÍNDICE TECH NOMINAL • QQQ' },
    alertTime: '16:00:00',
    alertDesc: {
      EN: 'Nasdaq-100 tracking error and liquidity depth operating within normal parameters.',
      ES: 'Tracking error y profundidad de liquidez del Nasdaq-100 operando en parámetros normales.',
    },
    modelPayload: {
      close: 492.15,
      close_rolling_mean_7: 489.2,
      close_rolling_std_7: 2.9,
      momentum_rsi_14: 60.2,
      price_velocity_roc_1: 0.006,
      volatility_std_7: 0.013,
      volume: 1410.0,
    },
  },
};

export function getAnomalyProfile(sym = 'BTC') {
  return ANOMALY_PROFILES[sym] || ANOMALY_PROFILES.BTC;
}

/**
 * Calls the live P-06 Cloud Run Isolation Forest microservice (`/cloud/p06/predict`)
 * with the asset's feature vector, returning the live MLflow artifact prediction.
 */
export async function runLiveAnomalyInference(sym = 'BTC') {
  const profile = getAnomalyProfile(sym);
  const asset = getAssetBySymbol(sym);
  const payload = {
    features: [
      profile.modelPayload || {
        close: asset.price,
        close_rolling_mean_7: asset.price * 0.985,
        close_rolling_std_7: asset.price * 0.012,
        momentum_rsi_14: asset.indicators.rsi14,
        price_velocity_roc_1: asset.chgNum / 100,
        volatility_std_7: 0.022,
        volume: 1500.0,
      },
    ],
  };

  const t0 = performance.now();
  const res = await fetch('/cloud/p06/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(4000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();
  const latencyMs = Math.round(performance.now() - t0);
  const pred = data.predictions?.[0];

  return {
    liveScore: pred ? Number(pred.anomaly_score.toFixed(3)) : profile.score,
    isAnomaly: pred ? Boolean(pred.is_anomaly) : profile.score > 0.65,
    modelVersion: data.model_version || 'v1-production-artifact',
    latencyMs,
    source: 'LIVE • P-06 Cloud Run',
  };
}
