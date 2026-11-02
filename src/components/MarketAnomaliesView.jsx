import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Table2,
  Orbit,
  LayoutGrid,
  SlidersHorizontal,
  Sparkles,
  FileText,
  BarChart3,
  Radio,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  ASSET_CATALOG,
  GLOBAL_VOLUME_SPARKLINE,
  getAssetBySymbol,
  getAssetSeries,
  SOVEREIGN_YIELD_CURVES,
  computeSovereignCurveMetrics,
  WORLD_USD_RATES,
  computeCrossCurrencyRate,
  getHighVolumeOptionsChain,
  getCommodityForwardCurve,
  getAssetClassSpecificMetrics,
  OPTIONS_STRATEGIES,
  computeOptionsStrategyPayoff,
  computeVolatilitySurface3D,
  computeSovereignYieldSurface3D,
  computeCommodityForwardSurface3D,
} from '../services/marketService';
import Surface3DViewer from './Surface3DViewer';
import { getAnomalyProfile, runLiveAnomalyInference } from '../services/anomalyService';
import {
  FINBERT_HEADLINES,
  RAG_QUICK_TOPICS,
  getRagQuickTopicsForCategory,
  IMPORTANCE_WEIGHTS,
  getAssetClassSensitivity,
  getAssetResearchBrief,
  getAssetFinbertHeadlines,
  getAssetLiveWirePool,
  executeSec10kRagQuery,
} from '../services/filingsAndNewsService';
import { getCommitteeDeliberation } from '../services/committeeService';

/**
 * Industry-standard Finviz / TradingView 8-shade strictly Green & Red palette.
 * Rule: GREEN = Positive / Above historical baseline, RED = Negative / Below historical baseline.
 * Intensity (1..4) scales with how strong the positive or negative deviation is against historical limits.
 */
const GREEN_SHADES = {
  1: { stroke: '#6ee7b7', text: '#a7f3d0', bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(11, 22, 24, 0.85) 100%)', glow: 'rgba(16, 185, 129, 0.25)' },
  2: { stroke: '#34d399', text: '#6ee7b7', bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.28) 0%, rgba(9, 28, 26, 0.88) 100%)', glow: 'rgba(16, 185, 129, 0.38)' },
  3: { stroke: '#10b981', text: '#34d399', bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.44) 0%, rgba(6, 36, 30, 0.90) 100%)', glow: 'rgba(16, 185, 129, 0.54)' },
  4: { stroke: '#059669', text: '#ecfdf5', bg: 'linear-gradient(135deg, rgba(5, 150, 105, 0.65) 0%, rgba(6, 48, 38, 0.94) 100%)', glow: 'rgba(16, 185, 129, 0.72)' },
};

const RED_SHADES = {
  1: { stroke: '#fda4af', text: '#fecdd3', bg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.16) 0%, rgba(26, 13, 20, 0.85) 100%)', glow: 'rgba(244, 63, 94, 0.25)' },
  2: { stroke: '#fb7185', text: '#fda4af', bg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.28) 0%, rgba(34, 12, 22, 0.88) 100%)', glow: 'rgba(244, 63, 94, 0.38)' },
  3: { stroke: '#f43f5e', text: '#fb7185', bg: 'linear-gradient(135deg, rgba(225, 29, 72, 0.44) 0%, rgba(45, 10, 22, 0.90) 100%)', glow: 'rgba(244, 63, 94, 0.54)' },
  4: { stroke: '#e11d48', text: '#ffe4e6', bg: 'linear-gradient(135deg, rgba(190, 18, 60, 0.65) 0%, rgba(58, 8, 22, 0.94) 100%)', glow: 'rgba(244, 63, 94, 0.72)' },
};

/**
 * Evaluates a ticker's indicator against fixed historical / industry-standard thresholds.
 * STRICT RULE:
 * - Positive / Bullish / Above historical baseline -> GREEN (shades 1..4 by strength)
 * - Negative / Bearish / Below historical baseline -> RED (shades 1..4 by strength)
 */
function evaluateHistoricalMetric(row, metricKey, isES = false) {
  if (metricKey === 'chg') {
    const val = row.chgNum; // e.g. +3.14%, -0.15%
    const absVal = Math.abs(val);
    const tier = absVal >= 2.5 ? 4 : absVal >= 1.2 ? 3 : absVal >= 0.5 ? 2 : 1;
    const palette = val >= 0 ? GREEN_SHADES[tier] : RED_SHADES[tier];
    const norm = Math.min(1, Math.max(0.18, absVal / 3.5));
    return {
      label: '24h % Change',
      formatted: row.chg,
      sub: row.priceFormatted,
      raw: val,
      sortMagnitude: val, // Highest positive first
      norm,
      color: palette.stroke,
      textColor: palette.text,
      bgGradient: palette.bg,
      glow: palette.glow,
      limitNote: 'Green ≥ 0% | Red < 0% (Hist. ±0.5% / ±1.2% / ±2.5%)',
    };
  }

  if (metricKey === 'vol') {
    // 24h Volume ($B) + 24h Volume Change % vs 20d Historical Average
    // Positive volume expansion (+%) = GREEN, Negative volume contraction (-%) = RED
    const volB = row.vol24hNum;
    const volChgPct = parseFloat(row.volChg24h.replace(/[+%]/g, '')) || 0;
    const absChg = Math.abs(volChgPct);
    const tier = absChg >= 25 ? 4 : absChg >= 10 ? 3 : absChg >= 3 ? 2 : 1;
    const palette = volChgPct >= 0 ? GREEN_SHADES[tier] : RED_SHADES[tier];
    const norm = Math.min(1, Math.max(0.18, volB / 45));
    return {
      label: isES ? 'Volumen 24h ($)' : '24h Volume ($)',
      formatted: row.vol24h,
      sub: `${row.volChg24h} vs 20d avg`,
      raw: volB,
      sortMagnitude: volB, // Largest 24h volume ($B) first
      norm,
      color: palette.stroke,
      textColor: palette.text,
      bgGradient: palette.bg,
      glow: palette.glow,
      limitNote: 'Green: Vol Chg ≥ 0% | Red: Vol Chg < 0%',
    };
  }

  if (metricKey === 'zscore') {
    // 20-Day Historical Volume Z-Score (Sigma):
    // Positive Z-Score (>= 0σ) = GREEN (shades 1..4 by sigma strength)
    // Negative Z-Score (< 0σ) = RED (shades 1..4 by sigma strength)
    const z = row.volumeZNum;
    const absZ = Math.abs(z);
    const tier = absZ >= 2.2 ? 4 : absZ >= 1.2 ? 3 : absZ >= 0.5 ? 2 : 1;
    const palette = z >= 0 ? GREEN_SHADES[tier] : RED_SHADES[tier];
    const norm = Math.min(1, Math.max(0.18, (z + 0.6) / 3.8));
    return {
      label: 'Vol Z-Score (20d)',
      formatted: row.volumeZScore,
      sub: z >= 0 ? `POSITIVE FLOW (${row.volumeZScore})` : `NEGATIVE FLOW (${row.volumeZScore})`,
      raw: z,
      sortMagnitude: z,
      norm,
      color: palette.stroke,
      textColor: palette.text,
      bgGradient: palette.bg,
      glow: palette.glow,
      limitNote: 'Green: Z ≥ 0σ | Red: Z < 0σ (Hist. ±0.5σ / ±1.2σ / ±2.2σ)',
    };
  }

  if (metricKey === 'rsi') {
    // Wilder's 14-Period RSI Standard Centerline (50):
    // Positive Momentum (RSI >= 50) = GREEN (shades 1..4 by strength above 50: 50-55, 55-62, 62-70, 70+)
    // Negative Momentum (RSI < 50) = RED (shades 1..4 by weakness below 50)
    const rsi = row.indicators.rsi14;
    const diff = rsi - 50;
    const absDiff = Math.abs(diff);
    const tier = absDiff >= 20 ? 4 : absDiff >= 10 ? 3 : absDiff >= 5 ? 2 : 1;
    const palette = diff >= 0 ? GREEN_SHADES[tier] : RED_SHADES[tier];
    const norm = Math.min(1, Math.max(0.18, (rsi - 35) / 45));
    return {
      label: 'RSI (14)',
      formatted: `${rsi}`,
      sub: diff >= 0 ? `BULLISH (+${diff.toFixed(1)} vs 50)` : `BEARISH (${diff.toFixed(1)} vs 50)`,
      raw: rsi,
      sortMagnitude: rsi,
      norm,
      color: palette.stroke,
      textColor: palette.text,
      bgGradient: palette.bg,
      glow: palette.glow,
      limitNote: 'Green: RSI ≥ 50 (Bullish) | Red: RSI < 50 (Bearish)',
    };
  }

  if (metricKey === 'rvol') {
    // Realized Volatility (30d) colored by Positive vs Negative price trend (chgNum >= 0 -> GREEN, < 0 -> RED)
    // and shade intensity scaled by historical volatility level (<20%, 20-35%, 35-55%, >55%)
    const rvol = row.realizedVolNum;
    const isPos = row.chgNum >= 0;
    const tier = rvol >= 55 ? 4 : rvol >= 35 ? 3 : rvol >= 20 ? 2 : 1;
    const palette = isPos ? GREEN_SHADES[tier] : RED_SHADES[tier];
    const norm = Math.min(1, Math.max(0.18, rvol / 70));
    return {
      label: isES ? 'Vol. Realizada (30d)' : 'Realized Vol (30d)',
      formatted: row.realizedVol,
      sub: `${row.chg} • Spread ${row.spreadBps}`,
      raw: rvol,
      sortMagnitude: rvol,
      norm,
      color: palette.stroke,
      textColor: palette.text,
      bgGradient: palette.bg,
      glow: palette.glow,
      limitNote: 'Green: Positive Trend Vol | Red: Negative Trend Vol',
    };
  }

  // Default: 'anomaly' — P-06 Isolation Forest Health / Anomaly Score
  // Normal / Healthy Market Regime (< 0.35) = Positive / GREEN (stronger green the cleaner the regime)
  // Elevated / Dislocated Anomaly (>= 0.35) = Negative / RED (stronger red the more severe the anomaly)
  const score = row.anomalyScore;
  let palette;
  if (score >= 0.65) palette = RED_SHADES[4];
  else if (score >= 0.50) palette = RED_SHADES[3];
  else if (score >= 0.40) palette = RED_SHADES[2];
  else if (score >= 0.35) palette = RED_SHADES[1];
  else if (score <= 0.16) palette = GREEN_SHADES[4];
  else if (score <= 0.22) palette = GREEN_SHADES[3];
  else if (score <= 0.28) palette = GREEN_SHADES[2];
  else palette = GREEN_SHADES[1];

  const norm = Math.min(1, Math.max(0.18, score / 0.70));
  return {
    label: 'Anomaly Score (P-06)',
    formatted: score.toFixed(3),
    sub: row.regime,
    raw: score,
    sortMagnitude: score,
    norm,
    color: palette.stroke,
    textColor: palette.text,
    bgGradient: palette.bg,
    glow: palette.glow,
    limitNote: 'Green: Normal (<0.35) | Red: Anomaly (≥0.35)',
  };
}

// Radial SVG Gauge for Top Aggregated Pulse Cards
function RadialRingGauge({ pct = 50, color = '#10b981', label = '', sub = '', detail = null, size = 54 }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = c - (clamped / 100) * c;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="4.5"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div
          className="mono-metric"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.74rem',
            fontWeight: 800,
            color: 'var(--text-main)',
          }}
        >
          {label}
        </div>
      </div>
      {(sub || detail) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.16rem' }}>
          {sub && <div style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-main)' }}>{sub}</div>}
          {detail && <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>{detail}</div>}
        </div>
      )}
    </div>
  );
}

// Inline SVG Sparkline
function MiniSparkline({ sym, isPos, width = 82, height = 24 }) {
  const pts = useMemo(() => {
    const series = getAssetSeries(sym, '5M');
    const prices = series.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const span = max - min || 1;
    return prices
      .map((p, i) => {
        const x = (i / (prices.length - 1)) * (width - 4) + 2;
        const y = height - 4 - ((p - min) / span) * (height - 8);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [sym, width, height]);

  const strokeColor = isPos ? '#10b981' : '#f43f5e';

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
        style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
      />
    </svg>
  );
}

export default function MarketAnomaliesView({
  selectedAsset,
  onSelectAsset,
  initialViewMode = 'screener',
  onViewModeChange,
  watchlistSyms = [],
  onToggleWatchlist,
  langCode = 'EN',
  t,
}) {
  const [viewMode, setViewModeState] = useState(initialViewMode || 'screener');
  const setViewMode = (nextMode) => {
    setViewModeState(nextMode);
    if (onViewModeChange) onViewModeChange(nextMode);
  };
  useEffect(() => {
    if (initialViewMode && initialViewMode !== viewMode) {
      setViewModeState(initialViewMode);
    }
  }, [initialViewMode]);
  const [visualMode, setVisualMode] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('screener') || 'table';
  });
  const [activeMetric, setActiveMetric] = useState('anomaly');
  const [hoveredAsset, setHoveredAsset] = useState('SOL');
  const [assetSearch, setAssetSearch] = useState('');
  const [l1SelectedIndex, setL1SelectedIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('cat') || 'ALL';
  });
  const [sortBy, setSortBy] = useState('rank');
  const [sortAsc, setSortAsc] = useState(true);

  // Level 2 (Horizon Editorial) states
  const [l2Section, setL2Section] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('section') === 'research' ? 'research' : 'analytics';
  }); // 'analytics' | 'research'
  const [timeframe, setTimeframe] = useState('1D');
  const [l2TickerQuery, setL2TickerQuery] = useState('');
  const [l2SearchOpen, setL2SearchOpen] = useState(false);
  const [l2SelectedIndex, setL2SelectedIndex] = useState(0);
  // Active analysis lens: 'technical' | 'compare' | 'microstructure' | 'derivatives'
  const [analysisLens, setAnalysisLens] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('lens') || 'technical';
  });
  const [showSma20, setShowSma20] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVwap, setShowVwap] = useState(false);
  const [showSubChart, setShowSubChart] = useState('vol'); // 'none' | 'vol' | 'zscore'
  const [compareSymbol, setCompareSymbol] = useState(null); // e.g. 'ETH', 'SPY', null
  const [compareQuery, setCompareQuery] = useState('');
  const [compareDropdownOpen, setCompareDropdownOpen] = useState(false);
  const [compareSelectedIndex, setCompareSelectedIndex] = useState(0);
  const [selectedCurveCountry, setSelectedCurveCountry] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('country') || 'US';
  });
  const [fxBaseCcy, setFxBaseCcy] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('fxBase') || 'EUR';
  });
  const [fxQuoteCcy, setFxQuoteCcy] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('fxQuote') || 'BRL';
  });
  const [fxAmount, setFxAmount] = useState(1000);
  const [optionsSubView, setOptionsSubView] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const sub = p.get('sub');
    return sub && ['surface3d', 'surface', 'payoff'].includes(sub) ? sub : 'surface3d';
  }); // 'surface3d' | 'surface' | 'payoff'
  const [ratesSubView, setRatesSubView] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const sub = p.get('sub');
    return sub && ['3d-history', '3d-peers', '2d'].includes(sub) ? sub : '3d-history';
  }); // '3d-history' | '3d-peers' | '2d'
  const [commoditySubView, setCommoditySubView] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const sub = p.get('sub');
    return sub && ['3d', '2d'].includes(sub) ? sub : '3d';
  }); // '3d' | '2d'
  const [selectedOptStrategy, setSelectedOptStrategy] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('strategy') || 'LONG_STRADDLE';
  });
  const [liveInference, setLiveInference] = useState(null);
  const [isScoring, setIsScoring] = useState(false);

  // Level 2 Research (P-04, P-07, P-08, P-09) states + Live Incoming Wire
  const [ragQuery, setRagQuery] = useState('');
  const [ragResult, setRagResult] = useState(null);
  const [isRagLoading, setIsRagLoading] = useState(false);
  const [researchScope, setResearchScope] = useState('asset'); // 'asset' (current ticker) | 'all' (cross-market)
  const [liveWireItems, setLiveWireItems] = useState([]);
  const [wireCursor, setWireCursor] = useState(0);
  const [liveBullUpdates, setLiveBullUpdates] = useState([]);
  const [liveBearUpdates, setLiveBearUpdates] = useState([]);
  const [lastUpdatedPart, setLastUpdatedPart] = useState(null); // 'bull' | 'bear' | null

  const isES = langCode === 'ES';

  // Enrich catalog with P-06 anomaly telemetry for Level 1
  const enrichedCatalog = useMemo(() => {
    return ASSET_CATALOG.map((item) => {
      const anom = getAnomalyProfile(item.sym);
      const zNum = item.sym === 'MSFT' ? -0.42 : item.sym === 'AAPL' ? -0.18 : parseFloat(anom.volumeZScore.replace(/[+σ]/g, '')) || 0;
      const zFormatted = zNum >= 0 ? `+${zNum.toFixed(2)}σ` : `${zNum.toFixed(2)}σ`;
      const rVolNum = parseFloat(anom.realizedVol.replace('%', '')) || 0;
      return {
        ...item,
        anomalyScore: anom.score,
        regime: anom.regime,
        volumeZScore: zFormatted,
        volumeZNum: zNum,
        realizedVol: anom.realizedVol,
        realizedVolNum: rVolNum,
        spreadBps: anom.spreadDislocation,
        alertTitle: anom.alertTitle[langCode] || anom.alertTitle.EN,
        alertDesc: anom.alertDesc[langCode] || anom.alertDesc.EN,
      };
    });
  }, [langCode]);

  // 1. Filter by Asset Category or User Watchlist
  const categoryFilteredCatalog = useMemo(() => {
    if (categoryFilter === 'ALL') return enrichedCatalog;
    if (categoryFilter === 'WATCHLIST') {
      return enrichedCatalog.filter((a) => watchlistSyms.includes(a.sym));
    }
    return enrichedCatalog.filter((a) => a.cat === categoryFilter);
  }, [enrichedCatalog, categoryFilter, watchlistSyms]);

  // 2. Aggregated Level 1 Pulse Metrics
  const pulseMetrics = useMemo(() => {
    const source = categoryFilteredCatalog.length > 0 ? categoryFilteredCatalog : enrichedCatalog;
    const totalVol = source.reduce((acc, a) => acc + a.vol24hNum, 0);
    const avgRsi = source.reduce((acc, a) => acc + a.indicators.rsi14, 0) / source.length;
    const normalCount = source.filter((a) => a.regime === 'NORMAL').length;
    const elevatedCount = source.filter((a) => a.regime === 'ELEVATED').length;
    const dislocatedAssets = source.filter((a) => a.regime === 'DISLOCATION');
    const normalPct = Math.round((normalCount / source.length) * 100);
    const topAnomaly = [...source].sort((a, b) => b.anomalyScore - a.anomalyScore)[0] || source[0];
    const topDislocations = [...source]
      .sort((a, b) => b.volumeZNum - a.volumeZNum)
      .slice(0, 3);

    return {
      totalCount: source.length,
      totalVolFormatted: `$${totalVol.toFixed(2)}B`,
      avgRsi: avgRsi.toFixed(1),
      avgRsiNum: avgRsi,
      normalCount,
      normalPct,
      elevatedCount,
      dislocatedAssets,
      topAnomaly,
      topDislocations,
    };
  }, [categoryFilteredCatalog, enrichedCatalog]);

  // 3. Filtered by search query & sorted rows for the Table
  const screenerRows = useMemo(() => {
    const filtered = categoryFilteredCatalog.filter((a) => {
      if (!assetSearch.trim()) return true;
      const q = assetSearch.toLowerCase();
      return (
        a.sym.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.cat.toLowerCase().includes(q)
      );
    });

    return filtered.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'rank') cmp = a.rank - b.rank;
      else if (sortBy === 'price') cmp = b.price - a.price;
      else if (sortBy === 'chg') cmp = b.chgNum - a.chgNum;
      else if (sortBy === 'vol') cmp = b.vol24hNum - a.vol24hNum;
      else if (sortBy === 'zscore') cmp = b.volumeZNum - a.volumeZNum;
      else if (sortBy === 'rvol') cmp = b.realizedVolNum - a.realizedVolNum;
      else if (sortBy === 'rsi') cmp = b.indicators.rsi14 - a.indicators.rsi14;
      else if (sortBy === 'anomaly') cmp = b.anomalyScore - a.anomalyScore;
      return sortAsc ? cmp : -cmp;
    });
  }, [categoryFilteredCatalog, assetSearch, sortBy, sortAsc]);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(col);
      setSortAsc(true);
    }
  };

  const handleOpenAssetDetail = (sym, forceLens = null) => {
    const assetObj = getAssetBySymbol(sym);
    onSelectAsset(sym);
    if (forceLens) {
      setAnalysisLens(forceLens);
    } else if (
      assetObj &&
      ['RATES', 'FIXED_INCOME', 'DERIVATIVES_VOL', 'FX', 'COMMODITY'].includes(assetObj.cat)
    ) {
      // Automatically open the specialized quantitative lens (Sovereign Curve, 3D Vol Surface, FX Cross, Commodity Forward)
      setAnalysisLens('derivatives');
    }
    setViewMode('detail');
  };

  // Bidirectional URL Synchronization for Health Checks & Visual Audits
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('view', 'markets');
    if (viewMode === 'screener') {
      params.set('mode', 'screener');
      if (categoryFilter !== 'ALL') params.set('cat', categoryFilter);
      if (visualMode !== 'table') params.set('screener', visualMode);
    } else {
      params.set('mode', 'detail');
      params.set('asset', selectedAsset);
      params.set('section', l2Section);
      if (l2Section === 'analytics') {
        params.set('lens', analysisLens);
        if (analysisLens === 'derivatives') {
          const aObj = getAssetBySymbol(selectedAsset);
          if (aObj.cat === 'RATES' || aObj.cat === 'FIXED_INCOME' || aObj.cat === 'CASH') {
            params.set('sub', ratesSubView);
            params.set('country', selectedCurveCountry);
          } else if (aObj.cat === 'FX') {
            params.set('fxBase', fxBaseCcy);
            params.set('fxQuote', fxQuoteCcy);
          } else if (aObj.cat === 'COMMODITY') {
            params.set('sub', commoditySubView);
          } else {
            params.set('sub', optionsSubView);
            if (optionsSubView === 'payoff') params.set('strategy', selectedOptStrategy);
          }
        }
      }
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [
    viewMode,
    categoryFilter,
    visualMode,
    selectedAsset,
    l2Section,
    analysisLens,
    ratesSubView,
    selectedCurveCountry,
    fxBaseCcy,
    fxQuoteCcy,
    commoditySubView,
    optionsSubView,
    selectedOptStrategy,
  ]);

  // Level 2 data
  const currentAsset = useMemo(() => getAssetBySymbol(selectedAsset), [selectedAsset]);
  const anomalyProfile = useMemo(() => getAnomalyProfile(selectedAsset), [selectedAsset]);
  const series = useMemo(() => getAssetSeries(selectedAsset, timeframe), [selectedAsset, timeframe]);

  const triggerLiveP06Scoring = async (sym) => {
    setIsScoring(true);
    try {
      const res = await runLiveAnomalyInference(sym);
      setLiveInference(res);
    } catch {
      setLiveInference(null);
    } finally {
      setIsScoring(false);
    }
  };

  const runAssetRagQuery = async (customQuery = ragQuery, scope = researchScope, sym = selectedAsset) => {
    setIsRagLoading(true);
    try {
      const res = await executeSec10kRagQuery({
        query: customQuery,
        ticker: scope === 'all' ? 'ALL' : sym,
        langCode,
      });
      setRagResult(res);
    } finally {
      setIsRagLoading(false);
    }
  };

  const COMPATIBLE_COMPARE_CATEGORIES = useMemo(
    () => ({
      EQUITY: ['EQUITY', 'ETF', 'INDEX'],
      ETF: ['ETF', 'INDEX', 'EQUITY', 'COMMODITY', 'FIXED_INCOME'],
      INDEX: ['INDEX', 'ETF', 'EQUITY'],
      CRYPTO: ['CRYPTO', 'ETF'],
      RATES: ['RATES', 'FIXED_INCOME', 'CASH'],
      FIXED_INCOME: ['FIXED_INCOME', 'RATES', 'CASH', 'ETF'],
      CASH: ['CASH', 'RATES', 'FIXED_INCOME'],
      FX: ['FX'],
      COMMODITY: ['COMMODITY', 'ETF'],
      DERIVATIVES_VOL: ['DERIVATIVES_VOL', 'INDEX', 'EQUITY'],
    }),
    []
  );

  // Compatible assets for Relative Comparison (same class prioritized first, then compatible peer class)
  const compatibleCompareMatches = useMemo(() => {
    const allowedCats = COMPATIBLE_COMPARE_CATEGORIES[currentAsset.cat] || [currentAsset.cat];
    const q = compareQuery.trim().toLowerCase();
    return enrichedCatalog
      .filter((a) => a.sym !== selectedAsset && allowedCats.includes(a.cat))
      .filter((a) => {
        if (!q) return true;
        return (
          a.sym.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.cat.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const aSame = a.cat === currentAsset.cat ? 0 : 1;
        const bSame = b.cat === currentAsset.cat ? 0 : 1;
        if (aSame !== bSame) return aSame - bSame;
        return a.rank - b.rank;
      })
      .slice(0, 12);
  }, [enrichedCatalog, currentAsset.cat, selectedAsset, compareQuery, COMPATIBLE_COMPARE_CATEGORIES]);

  useEffect(() => {
    if (viewMode === 'detail') {
      setLiveInference(null);
      triggerLiveP06Scoring(selectedAsset);
      setRagQuery('');
      setRagResult(null);
      setLiveWireItems([]);
      setWireCursor(0);
      setLiveBullUpdates([]);
      setLiveBearUpdates([]);
      setLastUpdatedPart(null);
      const assetObj = getAssetBySymbol(selectedAsset);
      // Clear compareSymbol if it is identical or belongs to an incompatible asset class
      if (compareSymbol) {
        const cmpObj = getAssetBySymbol(compareSymbol);
        const allowed = COMPATIBLE_COMPARE_CATEGORIES[assetObj.cat] || [assetObj.cat];
        if (compareSymbol === selectedAsset || !allowed.includes(cmpObj.cat)) {
          setCompareSymbol(null);
          setCompareQuery('');
        }
      }
      if (assetObj.countryCode && SOVEREIGN_YIELD_CURVES[assetObj.countryCode]) {
        setSelectedCurveCountry(assetObj.countryCode);
      }
      if (assetObj.cat === 'FX' && assetObj.sym.includes('/')) {
        const [b, q] = assetObj.sym.split('/');
        if (WORLD_USD_RATES[b]) setFxBaseCcy(b);
        if (WORLD_USD_RATES[q]) setFxQuoteCcy(q);
      }
    }
  }, [selectedAsset, viewMode]);

  const assetSensitivity = useMemo(
    () => getAssetClassSensitivity(currentAsset.cat),
    [currentAsset.cat]
  );

  // Function to push a new incoming wire headline to the top of the stream and update Top-5 Bull/Bear when warranted
  const pushIncomingWireHeadline = () => {
    const pool = getAssetLiveWirePool(selectedAsset);
    if (!pool.length) return;
    const item = pool[wireCursor % pool.length];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const score100 = Math.round(item.scoreNum * 100);
    const newEntry = {
      id: `live-wire-${selectedAsset}-${Date.now()}`,
      sym: selectedAsset,
      score: `${score100 >= 0 ? '+' : ''}${score100}`,
      scoreNum: item.scoreNum,
      importance: item.importance || 'MEDIUM',
      materiality: item.materiality || 'ROUTINE',
      probs: item.probs,
      source: item.source,
      time: timeStr,
      isNew: true,
      title: item.title,
    };

    // Deduplicate by headline title so the feed never stacks duplicate wire stories
    setLiveWireItems((prev) => {
      const filtered = prev
        .filter((x) => x.title.EN !== item.title.EN)
        .map((x) => ({ ...x, isNew: false }));
      return [newEntry, ...filtered].slice(0, 5);
    });
    setWireCursor((c) => c + 1);

    // Only update the Top-5 Bull or Bear fundamental drivers if the incoming news has HIGH materiality ("si lo amerita")
    if (item.materiality === 'HIGH' && item.driverUpdate) {
      const upd = item.driverUpdate;
      const driverEntry = {
        score: upd.score,
        importance: upd.importance || 'HIGH',
        isLiveUpdate: true,
        title: upd.title,
        detail: upd.detail,
      };
      if (upd.side === 'bull') {
        setLiveBullUpdates((prev) => {
          const withoutDup = prev.filter((d) => d.title.EN !== upd.title.EN);
          return [driverEntry, ...withoutDup].slice(0, 3);
        });
        setLastUpdatedPart('bull');
      } else {
        setLiveBearUpdates((prev) => {
          const withoutDup = prev.filter((d) => d.title.EN !== upd.title.EN);
          return [driverEntry, ...withoutDup].slice(0, 3);
        });
        setLastUpdatedPart('bear');
      }
    } else {
      setLastUpdatedPart(null);
    }
  };

  // Automatic live wire simulation every 18 seconds while in Level 2 Research mode (stops once pool is shown)
  useEffect(() => {
    const pool = getAssetLiveWirePool(selectedAsset);
    if (viewMode !== 'detail' || l2Section !== 'research' || wireCursor >= pool.length) return undefined;
    const timer = setInterval(() => {
      pushIncomingWireHeadline();
    }, 18000);
    return () => clearInterval(timer);
  }, [viewMode, l2Section, selectedAsset, wireCursor]);

  // P-04 & P-08 FinBERT headlines for Level 2 Research (Latest 5 headlines, Live wire prepended at the top)
  const assetFinbertNews = useMemo(() => {
    const baseList = getAssetFinbertHeadlines(selectedAsset);
    return [...liveWireItems, ...baseList].slice(0, 5);
  }, [selectedAsset, liveWireItems]);

  // Importance-weighted News Sentiment (-100 to +100 integer)
  const assetFinbertPolarity = useMemo(() => {
    const list = assetFinbertNews.length > 0 ? assetFinbertNews : FINBERT_HEADLINES.slice(0, 5);
    let weightedSum = 0;
    let totalWeight = 0;
    list.forEach((item, idx) => {
      const baseW = IMPORTANCE_WEIGHTS[item.importance] || 1.0;
      const recencyBoost = item.isNew ? 1.3 : idx === 0 ? 1.15 : 1.0;
      const w = baseW * recencyBoost;
      weightedSum += item.scoreNum * 100 * w;
      totalWeight += w;
    });
    const score100 = Math.round(weightedSum / Math.max(1, totalWeight));
    const isPos = score100 >= 0;
    const posCount = list.filter((x) => x.scoreNum >= 0).length;
    const negCount = list.filter((x) => x.scoreNum < 0).length;
    const linePct = Math.min(97, Math.max(3, ((score100 + 100) / 200) * 100));
    return {
      score100,
      formattedInt: `${isPos ? '+' : ''}${score100}`,
      linePct,
      label: isPos ? (isES ? 'Alcista' : 'Bullish') : isES ? 'Bajista' : 'Bearish',
      color: isPos ? '#10b981' : '#f43f5e',
      posCount,
      negCount,
    };
  }, [assetFinbertNews, isES]);

  // Structured Qualitative Research Brief: Top 5 Bull Drivers vs Top 5 Bear Risks with Importance Weighting
  const researchBrief = useMemo(() => {
    const base = getAssetResearchBrief(selectedAsset);
    const bullDrivers = [...liveBullUpdates, ...base.bullDrivers].slice(0, 5).map((d) => ({
      ...d,
      impactTag: `+${d.score}`,
    }));
    const bearRisks = [...liveBearUpdates, ...base.bearRisks].slice(0, 5).map((r) => ({
      ...r,
      impactTag: `-${r.score}`,
    }));

    const computeWeightedAvg = (items) => {
      let sum = 0;
      let wSum = 0;
      items.forEach((it, idx) => {
        const w = (IMPORTANCE_WEIGHTS[it.importance] || 1.0) * (it.isLiveUpdate && idx === 0 ? 1.25 : 1.0);
        sum += it.score * w;
        wSum += w;
      });
      return Math.round(sum / Math.max(1, wSum));
    };

    const avgBull = computeWeightedAvg(bullDrivers);
    const avgBear = computeWeightedAvg(bearRisks);
    const filingNet = avgBull - avgBear; // Document-driven net balance
    // Asset-class composite score combining Document Fundamentals + News Sentiment according to asset sensitivity
    const compositeScore = Math.round(
      filingNet * assetSensitivity.fundamentalWeight +
      assetFinbertPolarity.score100 * assetSensitivity.newsWeight
    );
    const fundamentalLinePct = Math.min(97, Math.max(3, ((filingNet + 100) / 200) * 100));

    return {
      ...base,
      bullDrivers,
      bearRisks,
      avgBull,
      avgBear,
      filingNet,
      filingNetFormatted: `${filingNet >= 0 ? '+' : ''}${filingNet}`,
      fundamentalLinePct,
      compositeScore,
      compositeFormatted: `${compositeScore >= 0 ? '+' : ''}${compositeScore}`,
    };
  }, [selectedAsset, liveBullUpdates, liveBearUpdates, assetSensitivity, assetFinbertPolarity.score100]);

  const displayedScore = liveInference ? liveInference.liveScore : anomalyProfile.score;
  const isDislocated = displayedScore >= 0.65 || anomalyProfile.regime === 'DISLOCATION';
  const isElevated = !isDislocated && (displayedScore >= 0.35 || anomalyProfile.regime === 'ELEVATED');
  const scoreColor = isDislocated ? '#f43f5e' : isElevated ? '#fb7185' : '#10b981';
  const scorePct = Math.min(100, Math.max(5, Math.round(displayedScore * 100)));

  const TIMEFRAMES = [
    { id: '1M', label: '1m' },
    { id: '5M', label: '5m' },
    { id: '1H', label: '1H' },
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M_CAL', label: '1M' },
    { id: '3M', label: '3M' },
    { id: '1Y', label: '1Y' },
    { id: 'ALL', label: 'ALL' },
  ];

  // Merge primary series with comparison asset series if `compareSymbol` is active
  // (Placed before the Level 1 early return so React Hook order is identical across renders)
  const compareSeries = useMemo(() => {
    if (!compareSymbol) return null;
    return getAssetSeries(compareSymbol, timeframe);
  }, [compareSymbol, timeframe]);

  const chartData = useMemo(() => {
    return series.map((pt, i) => {
      const cmpPt = compareSeries ? compareSeries[i] : null;
      return {
        ...pt,
        cmpReturn: cmpPt ? cmpPt.pctReturn : null,
        zBar: Number(((pt.vol / 220 - 1) * 2.1).toFixed(2)),
      };
    });
  }, [series, compareSeries]);

  // Filtered dropdown results for Level 2 ticker search
  const l2SearchResults = useMemo(() => {
    if (!l2TickerQuery.trim()) return enrichedCatalog;
    const q = l2TickerQuery.toLowerCase();
    return enrichedCatalog.filter(
      (a) =>
        a.sym.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.cat.toLowerCase().includes(q)
    );
  }, [enrichedCatalog, l2TickerQuery]);

  const METRIC_OPTIONS = [
    { id: 'anomaly', label: 'Anomaly Score (P-06)' },
    { id: 'zscore', label: 'Vol Z-Score (20d)' },
    { id: 'rsi', label: 'RSI (14)' },
    { id: 'chg', label: '24h % Change' },
    { id: 'vol', label: isES ? 'Volumen 24h' : '24h Volume' },
    { id: 'rvol', label: isES ? 'Vol. Realizada' : 'Realized Vol' },
  ];

  // ==========================================================================
  // LEVEL 1: GLOBAL MARKET SCREENER
  // ==========================================================================
  if (viewMode === 'screener') {
    const spotlightItem =
      screenerRows.find((a) => a.sym === hoveredAsset) ||
      screenerRows[0] ||
      enrichedCatalog[0];
    const spotlightSeries = getAssetSeries(spotlightItem.sym, '5M');
    const spotlightMetricInfo = evaluateHistoricalMetric(spotlightItem, activeMetric, isES);

    // For Orbital: keep fixed angular vector order by catalog `rank` (top 12 of active filter so radar stays clean)
    const orbitalItems = [...screenerRows].sort((a, b) => a.rank - b.rank).slice(0, 12);

    // For Heatmap: strictly sort descending by the active indicator's `sortMagnitude` (top 10 of active filter)
    const heatmapItems = [...screenerRows]
      .sort(
        (a, b) =>
          evaluateHistoricalMetric(b, activeMetric, isES).sortMagnitude -
          evaluateHistoricalMetric(a, activeMetric, isES).sortMagnitude
      )
      .slice(0, 10);

    // Group heatmapItems into vertical columns (First Vertical top-to-bottom, Then Horizontal left-to-right):
    // Col 1 (Leftmost, widest): #1 and #2 stacked vertically
    // Col 2: #3 and #4 stacked vertically
    // Col 3: #5, #6, #7 stacked vertically
    // Col 4 (Rightmost): #8, #9, #10 stacked vertically
    const heatmapColumns = [];
    if (heatmapItems.length <= 4) {
      if (heatmapItems.length > 0) heatmapColumns.push(heatmapItems.slice(0, 2));
      if (heatmapItems.length > 2) heatmapColumns.push(heatmapItems.slice(2, 4));
    } else if (heatmapItems.length <= 6) {
      heatmapColumns.push(heatmapItems.slice(0, 2));
      heatmapColumns.push(heatmapItems.slice(2, 4));
      heatmapColumns.push(heatmapItems.slice(4));
    } else {
      heatmapColumns.push(heatmapItems.slice(0, 2)); // #1, #2
      heatmapColumns.push(heatmapItems.slice(2, 4)); // #3, #4
      heatmapColumns.push(heatmapItems.slice(4, 7)); // #5, #6, #7
      if (heatmapItems.length > 7) {
        heatmapColumns.push(heatmapItems.slice(7)); // #8, #9, #10
      }
    }

    const pulseCardStyle = {
      padding: '0.85rem 1.15rem',
      borderRadius: '22px',
      backgroundColor: 'rgba(13, 19, 33, 0.52)',
      backdropFilter: 'blur(14px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 8px 24px rgba(0,0,0,0.26)',
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          height: 'calc(100vh - 115px)',
          overflowY: 'auto',
          paddingRight: '0.35rem',
        }}
      >
        {/* 1.0 TOP BAR (ABOVE AGGREGATED INDICATORS): CENTERED ASSET TYPE PILLS */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {/* CENTER: 10-CATEGORY GLOBAL ASSET UNIVERSE FILTER PILLS */}
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              backgroundColor: 'rgba(13, 19, 33, 0.62)',
              backdropFilter: 'blur(12px)',
              padding: '0.24rem',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              gap: '0.2rem',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
            }}
          >
            {[
              { id: 'ALL', label: isES ? 'Todos' : 'All' },
              { id: 'WATCHLIST', label: `★ Watchlist (${watchlistSyms.length})` },
              ...[
                { id: 'INDEX', label: isES ? 'Índices' : 'Indices' },
                { id: 'EQUITY', label: isES ? 'Acciones (S&P/NDX)' : 'Equities (S&P/NDX)' },
                { id: 'ETF', label: 'ETFs' },
                { id: 'CRYPTO', label: 'Crypto' },
                { id: 'RATES', label: isES ? 'Tasas & Curvas' : 'Rates & Curves' },
                { id: 'FIXED_INCOME', label: isES ? 'Bonos US Treasury' : 'US Treasuries' },
                { id: 'FX', label: isES ? 'Divisas (FX)' : 'FX Currencies' },
                { id: 'COMMODITY', label: isES ? 'Materias Primas' : 'Commodities' },
                { id: 'DERIVATIVES_VOL', label: isES ? 'Derivados & Vol' : 'Derivatives & Vol' },
                { id: 'CASH', label: 'Cash & SOFR' },
              ].sort((a, b) => a.label.localeCompare(b.label, isES ? 'es' : 'en')),
            ].map((tab) => {
              const active = categoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: active ? 700 : 600,
                    padding: '0.26rem 0.78rem',
                    borderRadius: '999px',
                    border: active ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                    backgroundColor: active ? 'rgba(16, 185, 129, 0.16)' : 'transparent',
                    color: active ? '#ffffff' : 'var(--text-dim)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1.1 AGGREGATED MARKET INDICATORS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.8rem',
            flexShrink: 0,
          }}
        >
          {/* PULSE 1: 24H AGGREGATE VOLUME & FLOW */}
          <div
            style={{
              ...pulseCardStyle,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.69rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                {isES ? 'Volumen Agregado (24h)' : '24h Aggregate Volume'}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.24rem' }}>
                <span className="mono-metric" style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {pulseMetrics.totalVolFormatted}
                </span>
                <span className="mono-metric" style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981' }}>
                  +8.42%
                </span>
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '0.18rem' }}>
                {pulseMetrics.totalCount} {isES ? 'activos filtrados' : 'tracked assets'}
              </div>
            </div>

            <div style={{ width: '92px', height: '42px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GLOBAL_VOLUME_SPARKLINE}>
                  <defs>
                    <linearGradient id="pulseVolGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#pulseVolGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PULSE 2: AVERAGE RSI (14) */}
          <div
            style={{
              ...pulseCardStyle,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <RadialRingGauge
              pct={pulseMetrics.avgRsiNum}
              color={pulseMetrics.avgRsiNum >= 50 ? '#10b981' : '#f43f5e'}
              label={pulseMetrics.avgRsi}
              sub="AVG RSI (14)"
            />
            <span
              className="mono-metric"
              style={{
                fontSize: '0.6rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
                backgroundColor: pulseMetrics.avgRsiNum >= 50 ? 'rgba(16, 185, 129, 0.14)' : 'rgba(244, 63, 94, 0.14)',
                color: pulseMetrics.avgRsiNum >= 50 ? '#34d399' : '#fb7185',
                fontWeight: 700,
              }}
            >
              {pulseMetrics.avgRsiNum >= 50 ? 'POSITIVE (>50)' : 'NEGATIVE (<50)'}
            </span>
          </div>

          {/* PULSE 3: P-06 ISOLATION FOREST REGIME */}
          <div
            style={{
              ...pulseCardStyle,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <RadialRingGauge
              pct={pulseMetrics.normalPct}
              color="#10b981"
              label={`${pulseMetrics.normalPct}%`}
              sub={isES ? 'Régimen Normal (P-06)' : 'Normal Regime (P-06)'}
              detail={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                  <div>
                    <span className="mono-metric" style={{ color: '#10b981', fontWeight: 800, fontSize: '0.68rem' }}>
                      {pulseMetrics.normalCount} / {pulseMetrics.totalCount}
                    </span>{' '}
                    <span>{isES ? 'activos normales' : 'normal assets'}</span>
                  </div>
                  <div style={{ fontSize: '0.58rem' }}>
                    <span className="mono-metric" style={{ color: '#fb7185', fontWeight: 700 }}>
                      {pulseMetrics.elevatedCount} {isES ? 'Elevados' : 'Elevated'}
                    </span>
                    {' • '}
                    <span className="mono-metric" style={{ color: '#f43f5e', fontWeight: 700 }}>
                      {pulseMetrics.dislocatedAssets.length} {isES ? 'Disloc.' : 'Disloc.'}
                    </span>
                  </div>
                </div>
              }
            />
            {pulseMetrics.topAnomaly && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem', flexShrink: 0 }}>
                <span className="mono-metric" style={{ fontSize: '0.54rem', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
                  {isES ? 'MAYOR ANOMALÍA' : 'TOP ANOMALY'}
                </span>
                <span
                  onClick={() => handleOpenAssetDetail(pulseMetrics.topAnomaly.sym)}
                  className="mono-metric"
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.22rem 0.55rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(244, 63, 94, 0.16)',
                    color: '#f43f5e',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pulseMetrics.topAnomaly.sym} {pulseMetrics.topAnomaly.anomalyScore.toFixed(3)} ↗
                </span>
              </div>
            )}
          </div>

          {/* PULSE 4: TOP VOLUME Z-SCORE DISLOCATIONS */}
          <div
            style={{
              ...pulseCardStyle,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.69rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                {isES ? 'Top Desvío Volumen (20d)' : 'Top Volume Z-Score (20d)'}
              </span>
              <span className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>
                24H SIGMA
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.22rem' }}>
              {pulseMetrics.topDislocations.map((item, idx) => (
                <div
                  key={item.sym}
                  onClick={() => handleOpenAssetDetail(item.sym)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.71rem',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="mono-metric" style={{ color: 'var(--text-dim)', fontSize: '0.62rem' }}>
                      0{idx + 1}
                    </span>
                    <span className="mono-metric" style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                      {item.sym}
                    </span>
                  </div>
                  <span className="mono-metric" style={{ color: 'var(--text-muted)', fontSize: '0.67rem' }}>
                    {item.priceFormatted}
                  </span>
                  <span
                    className="mono-metric"
                    style={{
                      fontWeight: 700,
                      color: item.volumeZNum >= 0 ? '#10b981' : '#f43f5e',
                    }}
                  >
                    {item.volumeZScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1.2 VIEW SWITCHER TOOLBAR: TABLE (DEFAULT) | ORBITAL | HEATMAP + INDICATOR SELECTOR */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            flexShrink: 0,
          }}
        >
          {/* Left: View Mode Switcher (Table / Orbital / Heatmap) + Contextual Indicator Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-panel-glass)',
                backdropFilter: 'blur(12px)',
                padding: '0.22rem',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                gap: '0.25rem',
              }}
            >
              {[
                { id: 'table', icon: Table2, label: isES ? 'Tabla' : 'Table' },
                { id: 'orbital', icon: Orbit, label: isES ? 'Orbital' : 'Orbital' },
                { id: 'heatmap', icon: LayoutGrid, label: isES ? 'Mapa de Calor' : 'Heatmap' },
              ].map((mode) => {
                const Icon = mode.icon;
                const active = visualMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setVisualMode(mode.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.72rem',
                      fontWeight: active ? 700 : 600,
                      padding: '0.3rem 0.9rem',
                      borderRadius: '999px',
                      border: active ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                      backgroundColor: active ? 'rgba(16, 185, 129, 0.16)' : 'transparent',
                      color: active ? '#ffffff' : 'var(--text-dim)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={13} />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Indicator Driver Selector (Appears when user selects Orbital or Heatmap) */}
            {(visualMode === 'orbital' || visualMode === 'heatmap') && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.24rem 0.55rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(13, 19, 33, 0.62)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  className="mono-metric"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    paddingLeft: '0.35rem',
                    paddingRight: '0.25rem',
                  }}
                >
                  <SlidersHorizontal size={12} style={{ color: '#10b981' }} />
                  <span>{isES ? 'INDICADOR:' : 'INDICATOR:'}</span>
                </div>

                {METRIC_OPTIONS.map((m) => {
                  const active = activeMetric === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setActiveMetric(m.id)}
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: active ? 700 : 500,
                        padding: '0.24rem 0.7rem',
                        borderRadius: '999px',
                        border: active ? '1px solid #10b981' : '1px solid transparent',
                        backgroundColor: active ? 'rgba(16, 185, 129, 0.16)' : 'transparent',
                        color: active ? '#ffffff' : 'var(--text-dim)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Direct 1-Click Access to the 4 Quantitative Engines aligned to the right edge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginLeft: 'auto',
              backgroundColor: 'rgba(13, 19, 33, 0.65)',
              padding: '0.2rem 0.35rem',
              borderRadius: '999px',
              border: '1px solid rgba(56, 189, 248, 0.22)',
              gap: '0.25rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              {
                id: 'sovereign-curve',
                label: isES ? '🌐 Curva Soberana 3D/2D (42 Países)' : '🌐 Sovereign Curve 3D/2D (42 Countries)',
                action: () => {
                  setL2Section('analytics');
                  setAnalysisLens('derivatives');
                  setRatesSubView('3d-history');
                  handleOpenAssetDetail('US10Y', 'derivatives');
                },
              },
              {
                id: 'vol-surface-3d',
                label: isES ? '📐 Superficie Volatilidad 3D' : '📐 3D Volatility Surface',
                action: () => {
                  setL2Section('analytics');
                  setAnalysisLens('derivatives');
                  setOptionsSubView('surface3d');
                  handleOpenAssetDetail('NVDA-OPT', 'derivatives');
                },
              },
              {
                id: 'options-payoff',
                label: isES ? '⚡ Payoff P&L & Sintéticos' : '⚡ Options Payoff & Synthetics',
                action: () => {
                  setL2Section('analytics');
                  setAnalysisLens('derivatives');
                  setOptionsSubView('payoff');
                  handleOpenAssetDetail('NVDA-OPT', 'derivatives');
                },
              },
              {
                id: 'fx-cross',
                label: isES ? '💱 Conversor FX (61 Monedas)' : '💱 FX Cross Converter (61 CCY)',
                action: () => {
                  setL2Section('analytics');
                  setAnalysisLens('derivatives');
                  handleOpenAssetDetail('EUR/USD', 'derivatives');
                },
              },
            ].map((qBtn) => (
              <button
                key={qBtn.id}
                type="button"
                onClick={qBtn.action}
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  padding: '0.22rem 0.68rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(56, 189, 248, 0.28)',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {qBtn.label}
              </button>
            ))}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MODE 1 (DEFAULT): NON-BOXY CAPSULE TABLE WITH INTEGRATED SEARCH      */}
        {/* ==================================================================== */}
        {visualMode === 'table' && (
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              minHeight: 0,
              padding: '0.1rem 0.1rem',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0 0.48rem',
                fontSize: '0.76rem',
                textAlign: 'right',
              }}
            >
              <thead>
                <tr
                  style={{
                    color: 'var(--text-dim)',
                    fontSize: '0.67rem',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: 'rgba(8, 12, 22, 0.78)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <th
                    onClick={() => handleSort('rank')}
                    style={{ padding: '0.45rem 0.75rem', textAlign: 'center', width: '44px', cursor: 'pointer' }}
                  >
                    #
                  </th>

                  {/* INTEGRATED SEARCH INSIDE THE ASSET / TICKER COLUMN HEADER */}
                  <th style={{ padding: '0.35rem 0.75rem', textAlign: 'left', minWidth: '215px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: assetSearch
                          ? '1px solid #10b981'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '999px',
                        padding: '0.26rem 0.7rem',
                        width: '200px',
                      }}
                    >
                      <Search size={12} strokeWidth={2.3} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                      <input
                        type="text"
                        placeholder={isES ? 'Buscar ticker o activo (↑↓ Enter)...' : 'Search ticker or asset (↑↓ Enter)...'}
                        value={assetSearch}
                        onChange={(e) => {
                          setAssetSearch(e.target.value);
                          setL1SelectedIndex(0);
                        }}
                        onKeyDown={(e) => {
                          if (!screenerRows.length) return;
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setL1SelectedIndex((prev) => (prev + 1) % screenerRows.length);
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setL1SelectedIndex((prev) => (prev - 1 + screenerRows.length) % screenerRows.length);
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            const target = screenerRows[l1SelectedIndex] || screenerRows[0];
                            if (target) handleOpenAssetDetail(target.sym);
                          } else if (e.key === 'Escape') {
                            setAssetSearch('');
                            setL1SelectedIndex(0);
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-main)',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          outline: 'none',
                          width: '100%',
                          fontFamily: 'var(--font-sans)',
                        }}
                      />
                      {assetSearch && (
                        <button
                          onClick={() => setAssetSearch('')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                          }}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </th>

                  <th onClick={() => handleSort('price')} style={{ padding: '0.45rem 0.85rem', cursor: 'pointer' }}>
                    {isES ? 'Precio' : 'Price'} ↕
                  </th>
                  <th onClick={() => handleSort('chg')} style={{ padding: '0.45rem 0.85rem', cursor: 'pointer' }}>
                    24h % ↕
                  </th>
                  <th style={{ padding: '0.45rem 0.85rem', textAlign: 'center' }}>
                    {isES ? 'Tendencia' : 'Sparkline'}
                  </th>
                  <th onClick={() => handleSort('vol')} style={{ padding: '0.45rem 0.85rem', cursor: 'pointer' }}>
                    {isES ? 'Volumen (24h)' : 'Volume (24h)'} ↕
                  </th>
                  {categoryFilter === 'ALL' ? (
                    <>
                      <th onClick={() => handleSort('zscore')} style={{ padding: '0.45rem 0.85rem', cursor: 'pointer' }}>
                        Vol Z-Score (20d) ↕
                      </th>
                      <th onClick={() => handleSort('rvol')} style={{ padding: '0.45rem 0.85rem', cursor: 'pointer' }}>
                        {isES ? 'Vol. Realizada' : 'Realized Vol'} ↕
                      </th>
                    </>
                  ) : (
                    (() => {
                      const sampleSpec = getAssetClassSpecificMetrics(screenerRows[0] || { cat: categoryFilter }, isES);
                      return (
                        <>
                          <th style={{ padding: '0.45rem 0.85rem', color: '#10b981' }}>{sampleSpec.col1Label}</th>
                          <th style={{ padding: '0.45rem 0.85rem', color: '#38bdf8' }}>{sampleSpec.col2Label}</th>
                        </>
                      );
                    })()
                  )}
                  <th onClick={() => handleSort('rsi')} style={{ padding: '0.45rem 0.85rem', cursor: 'pointer' }}>
                    RSI (14) ↕
                  </th>
                  <th
                    onClick={() => handleSort('anomaly')}
                    style={{ padding: '0.45rem 1rem', cursor: 'pointer' }}
                  >
                    Anomaly Score (P-06) ↕
                  </th>
                </tr>
              </thead>
              <tbody>
                {screenerRows.map((row, rowIdx) => {
                  const isPos = row.chgNum >= 0;
                  const chgEval = evaluateHistoricalMetric(row, 'chg', isES);
                  const zEval = evaluateHistoricalMetric(row, 'zscore', isES);
                  const rsiEval = evaluateHistoricalMetric(row, 'rsi', isES);
                  const anomEval = evaluateHistoricalMetric(row, 'anomaly', isES);
                  const isKeyHighlighted = Boolean(assetSearch.trim()) && rowIdx === l1SelectedIndex;

                  const cellBase = {
                    backgroundColor: isKeyHighlighted ? 'rgba(16, 185, 129, 0.16)' : 'rgba(13, 19, 33, 0.56)',
                    backdropFilter: 'blur(10px)',
                    borderTop: isKeyHighlighted ? '1px solid rgba(16, 185, 129, 0.55)' : '1px solid rgba(255, 255, 255, 0.07)',
                    borderBottom: isKeyHighlighted ? '1px solid rgba(16, 185, 129, 0.55)' : '1px solid rgba(255, 255, 255, 0.07)',
                  };

                  return (
                    <tr
                      key={row.sym}
                      onClick={() => handleOpenAssetDetail(row.sym)}
                      style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                    >
                      <td
                        className="mono-metric"
                        style={{
                          ...cellBase,
                          borderLeft: '1px solid rgba(255, 255, 255, 0.07)',
                          borderTopLeftRadius: '16px',
                          borderBottomLeftRadius: '16px',
                          padding: '0.75rem 0.65rem',
                          textAlign: 'center',
                          color: 'var(--text-dim)',
                        }}
                      >
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.38rem' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleWatchlist) onToggleWatchlist(row.sym);
                            }}
                            title={
                              watchlistSyms.includes(row.sym)
                                ? isES
                                  ? 'Quitar de Watchlist'
                                  : 'Remove from Watchlist'
                                : isES
                                  ? 'Agregar a Watchlist para evaluar en Portfolio'
                                  : 'Add to Watchlist for Portfolio evaluation'
                            }
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              fontSize: '0.86rem',
                              lineHeight: 1,
                              color: watchlistSyms.includes(row.sym) ? '#fbbf24' : 'rgba(255,255,255,0.22)',
                              transition: 'color 0.15s ease, transform 0.15s ease',
                            }}
                          >
                            {watchlistSyms.includes(row.sym) ? '★' : '☆'}
                          </button>
                          <span>{row.rank}</span>
                        </div>
                      </td>

                      {/* TICKER & NAME */}
                      <td style={{ ...cellBase, padding: '0.75rem 0.85rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            className="mono-metric"
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.22), rgba(15, 23, 42, 0.85))',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.64rem',
                              fontWeight: 800,
                              color: '#10b981',
                              flexShrink: 0,
                            }}
                          >
                            {row.sym.slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span className="mono-metric" style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.82rem' }}>
                                {row.sym}
                              </span>
                              <span
                                className="mono-metric"
                                style={{
                                  fontSize: '0.55rem',
                                  padding: '0.07rem 0.42rem',
                                  borderRadius: '999px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                  color: 'var(--text-dim)',
                                }}
                              >
                                {row.cat}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>{row.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* PRICE */}
                      <td className="mono-metric" style={{ ...cellBase, padding: '0.75rem 0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {row.priceFormatted}
                      </td>

                      {/* 24H % PILL */}
                      <td className="mono-metric" style={{ ...cellBase, padding: '0.75rem 0.85rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.18rem 0.6rem',
                            borderRadius: '999px',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            color: chgEval.textColor,
                            background: chgEval.bgGradient,
                            border: `1px solid ${chgEval.color}55`,
                          }}
                        >
                          {row.chg}
                        </span>
                      </td>

                      {/* SPARKLINE */}
                      <td style={{ ...cellBase, padding: '0.75rem 0.85rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MiniSparkline sym={row.sym} isPos={isPos} width={76} height={22} />
                        </div>
                      </td>

                      {/* VOLUME (24H) */}
                      <td className="mono-metric" style={{ ...cellBase, padding: '0.75rem 0.85rem', color: 'var(--text-main)' }}>
                        <div>{row.vol24h}</div>
                        <div
                          style={{
                            fontSize: '0.61rem',
                            color: row.volChg24h.startsWith('+') ? '#10b981' : '#f43f5e',
                          }}
                        >
                          {row.volChg24h}
                        </div>
                      </td>

                      {/* VOL Z-SCORE & REALIZED VOL (WHEN ALL) OR CATEGORY-SPECIFIC METRICS */}
                      {categoryFilter === 'ALL' ? (
                        <>
                          <td className="mono-metric" style={{ ...cellBase, padding: '0.75rem 0.85rem' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '0.18rem 0.6rem',
                                borderRadius: '999px',
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                color: zEval.textColor,
                                background: zEval.bgGradient,
                                border: `1px solid ${zEval.color}55`,
                              }}
                            >
                              {row.volumeZScore}
                            </span>
                          </td>
                          <td className="mono-metric" style={{ ...cellBase, padding: '0.75rem 0.85rem', color: 'var(--text-muted)' }}>
                            {row.realizedVol}
                          </td>
                        </>
                      ) : (
                        (() => {
                          const spec = getAssetClassSpecificMetrics(row, isES);
                          return (
                            <>
                              <td className="mono-metric" style={{ ...cellBase, padding: '0.75rem 0.85rem', color: '#fff', fontWeight: 700 }}>
                                <div>{spec.col1Val}</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 500 }}>{spec.col1Sub}</div>
                              </td>
                              <td className="mono-metric" style={{ ...cellBase, padding: '0.75rem 0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                <div style={{ color: '#fff' }}>{spec.col2Val}</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 500 }}>{spec.col2Sub}</div>
                              </td>
                            </>
                          );
                        })()
                      )}

                      {/* RSI (14) */}
                      <td
                        className="mono-metric"
                        style={{
                          ...cellBase,
                          padding: '0.75rem 0.85rem',
                          fontWeight: 700,
                          color: rsiEval.color,
                        }}
                      >
                        {row.indicators.rsi14}
                      </td>

                      {/* ANOMALY SCORE (P-06) */}
                      <td
                        className="mono-metric"
                        style={{
                          ...cellBase,
                          borderRight: '1px solid rgba(255, 255, 255, 0.07)',
                          borderTopRightRadius: '16px',
                          borderBottomRightRadius: '16px',
                          padding: '0.75rem 1rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '999px',
                            background: anomEval.bgGradient,
                            border: `1px solid ${anomEval.color}66`,
                          }}
                        >
                          <span style={{ fontWeight: 800, color: anomEval.textColor, fontSize: '0.78rem' }}>
                            {row.anomalyScore.toFixed(3)}
                          </span>
                          <span
                            style={{
                              fontSize: '0.56rem',
                              fontWeight: 800,
                              color: anomEval.textColor,
                              letterSpacing: '0.03em',
                            }}
                          >
                            {row.regime}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODE 2: ORBITAL SYSTEM (BOUNDED TO CONTAINER, POSITIVE=GREEN/NEG=RED) */}
        {/* ==================================================================== */}
        {visualMode === 'orbital' && (
          <div
            style={{
              flex: 1,
              minHeight: '390px',
              display: 'grid',
              gridTemplateColumns: '1fr 320px',
              gap: '0.85rem',
            }}
          >
            {/* Left Orbital Field */}
            <div
              style={{
                position: 'relative',
                borderRadius: '26px',
                backgroundColor: 'rgba(10, 15, 28, 0.48)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                overflow: 'hidden',
                padding: '1.25rem',
              }}
            >
              {/* Concentric Orbital Rings */}
              {[32, 56, 78].map((pctSize, i) => (
                <div
                  key={pctSize}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: `${pctSize}%`,
                    height: `${pctSize}%`,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    border:
                      i === 0
                        ? '1px dashed rgba(16, 185, 129, 0.25)'
                        : '1px dashed rgba(255, 255, 255, 0.08)',
                    pointerEvents: 'none',
                  }}
                />
              ))}

              {/* Center Core Label */}
              <div
                className="mono-metric"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  padding: '0.42rem 0.8rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(10, 15, 26, 0.92)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  color: '#fff',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <div>{spotlightMetricInfo.label.toUpperCase()}</div>
                <div style={{ fontSize: '0.52rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
                  {spotlightMetricInfo.limitNote}
                </div>
              </div>

              {/* Orbiting Asset Nodes */}
              {orbitalItems.map((row, idx) => {
                const m = evaluateHistoricalMetric(row, activeMetric, isES);
                const angle = (idx / Math.max(1, orbitalItems.length)) * 2 * Math.PI - Math.PI / 2;

                // Safe radius in % of container [17% .. 38%]
                const radiusPct = 17 + (1 - m.norm) * 21;
                const rawX = 50 + Math.cos(angle) * radiusPct;
                const rawY = 50 + Math.sin(angle) * radiusPct;

                // Hard clamp to container bounds so no node ever overflows
                const xPct = Math.min(90, Math.max(10, rawX));
                const yPct = Math.min(88, Math.max(12, rawY));

                const orbSize = Math.round(44 + m.norm * 28);
                const isFocused = hoveredAsset === row.sym;

                return (
                  <div
                    key={row.sym}
                    onMouseEnter={() => setHoveredAsset(row.sym)}
                    onClick={() => handleOpenAssetDetail(row.sym)}
                    style={{
                      position: 'absolute',
                      left: `${xPct}%`,
                      top: `${yPct}%`,
                      transform: 'translate(-50%, -50%)',
                      width: `${orbSize}px`,
                      height: `${orbSize}px`,
                      borderRadius: '50%',
                      background: m.bgGradient,
                      border: `${isFocused ? '2.5px' : '1.5px'} solid ${m.color}`,
                      boxShadow: `0 0 ${Math.round(12 + m.norm * 18)}px ${m.glow}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.22s ease',
                      zIndex: isFocused ? 10 : Math.round(m.norm * 5) + 2,
                    }}
                  >
                    <span className="mono-metric" style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fff' }}>
                      {row.sym}
                    </span>
                    <span className="mono-metric" style={{ fontSize: '0.56rem', color: m.textColor, fontWeight: 800 }}>
                      {m.formatted}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right Inspector Capsule for Hovered Orbital Node */}
            <div
              onClick={() => handleOpenAssetDetail(spotlightItem.sym)}
              style={{
                borderRadius: '26px',
                backgroundColor: 'rgba(13, 19, 33, 0.6)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono-metric" style={{ fontSize: '0.64rem', color: spotlightMetricInfo.color, fontWeight: 800 }}>
                    {spotlightMetricInfo.label.toUpperCase()}
                  </span>
                  <span className="mono-metric" style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                    {spotlightItem.cat}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem' }}>
                  <span className="mono-metric" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {spotlightItem.sym}
                  </span>
                  <span className="mono-metric" style={{ fontSize: '1.25rem', fontWeight: 800, color: spotlightMetricInfo.color }}>
                    {spotlightMetricInfo.formatted}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '0.85rem' }}>
                  {spotlightItem.name} • {spotlightItem.priceFormatted} ({spotlightItem.chg})
                </div>

                <div style={{ height: '125px', marginBottom: '0.9rem' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={spotlightSeries}>
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={spotlightMetricInfo.color}
                        strokeWidth={2}
                        fill={spotlightMetricInfo.glow}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mono-metric" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Anomaly Score (P-06):</span>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                      {spotlightItem.anomalyScore.toFixed(3)} ({spotlightItem.regime})
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Vol Z-Score (20d):</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{spotlightItem.volumeZScore}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>RSI (14) / Vol 24h:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {spotlightItem.indicators.rsi14} • {spotlightItem.vol24h}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODE 3: HEATMAP TREEMAP (ORGANIZED FIRST VERTICALLY, THEN HORIZONTALLY) */}
        {/* ==================================================================== */}
        {visualMode === 'heatmap' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              gap: '0.7rem',
              paddingBottom: '0.5rem',
              minHeight: '395px',
            }}
          >
            {heatmapColumns.map((colItems, colIdx) => {
              // Column width weight is proportional to the sum of magnitudes in this vertical column
              const colWeight = colItems.reduce(
                (acc, r) => acc + evaluateHistoricalMetric(r, activeMetric, isES).norm,
                0
              );
              // Give leftmost columns (#1-#2, #3-#4) stronger visual width dominance
              const colFlexGrow =
                colIdx === 0
                  ? colWeight * 1.45
                  : colIdx === 1
                    ? colWeight * 1.15
                    : colIdx === 2
                      ? colWeight * 0.95
                      : colWeight * 0.8;

              return (
                <div
                  key={`hm-col-${colIdx}`}
                  style={{
                    flex: `${colFlexGrow.toFixed(2)} 1 0%`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.7rem',
                    minWidth: 0,
                  }}
                >
                  {colItems.map((row) => {
                    const globalIdx = heatmapItems.findIndex((x) => x.sym === row.sym);
                    const m = evaluateHistoricalMetric(row, activeMetric, isES);

                    return (
                      <div
                        key={`${activeMetric}-${row.sym}`}
                        onClick={() => handleOpenAssetDetail(row.sym)}
                        style={{
                          // Vertical height inside the column is proportional to `m.norm`
                          flex: `${Math.max(20, Math.round(m.norm * 100))} 1 0%`,
                          borderRadius: '22px',
                          padding: '0.95rem 1.1rem',
                          background: m.bgGradient,
                          backdropFilter: 'blur(12px)',
                          border: `1.5px solid ${m.color}`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 24px ${m.glow}`,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'transform 0.16s ease, box-shadow 0.16s ease',
                          minHeight: 0,
                          overflow: 'hidden',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.012)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                              <span
                                className="mono-metric"
                                style={{
                                  fontSize: '0.66rem',
                                  color: 'rgba(255,255,255,0.65)',
                                  fontWeight: 800,
                                }}
                              >
                                #{globalIdx + 1}
                              </span>
                              <span
                                className="mono-metric"
                                style={{
                                  fontSize: globalIdx === 0 ? '1.4rem' : globalIdx < 4 ? '1.2rem' : '1.0rem',
                                  fontWeight: 800,
                                  color: '#ffffff',
                                }}
                              >
                                {row.sym}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.72)', marginTop: '0.08rem' }}>
                              {row.name}
                            </div>
                          </div>

                          <span
                            className="mono-metric"
                            style={{
                              fontSize: globalIdx === 0 ? '1.25rem' : globalIdx < 4 ? '1.08rem' : '0.9rem',
                              fontWeight: 800,
                              color: m.textColor,
                            }}
                          >
                            {m.formatted}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.4rem' }}>
                          <div>
                            <div className="mono-metric" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                              {row.priceFormatted}
                            </div>
                            <div className="mono-metric" style={{ fontSize: '0.6rem', color: m.textColor, marginTop: '0.1rem', fontWeight: 600 }}>
                              {m.sub}
                            </div>
                          </div>

                          {colIdx < 2 && (
                            <div
                              className="mono-metric"
                              style={{
                                fontSize: '0.56rem',
                                fontWeight: 800,
                                padding: '0.14rem 0.48rem',
                                borderRadius: '999px',
                                backgroundColor: 'rgba(0, 0, 0, 0.38)',
                                color: m.textColor,
                                border: `1px solid ${m.color}66`,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {m.label}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // LEVEL 2: HORIZON EDITORIAL (FEY STYLE) WITH ORGANIZED WORKBENCH & SEARCH
  // ==========================================================================
  const isAssetPos = currentAsset.chgNum >= 0;
  const assetMainColor = isAssetPos ? '#10b981' : '#f43f5e';
  const currentEnriched = enrichedCatalog.find((a) => a.sym === selectedAsset) || enrichedCatalog[0];
  const isCompareMode = analysisLens === 'compare' && Boolean(compareSymbol);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.65rem',
        height: 'calc(100vh - 115px)',
        overflowY: 'auto',
        padding: '0.15rem 0.5rem 0.35rem 0.5rem',
      }}
    >
      {/* 2.1 TOP HORIZON BAR: BACK BUTTON + INTEGRATED TICKER SEARCH + ANALYTICS | RESEARCH PILLS + TIMEFRAMES */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '0.75rem',
          paddingBottom: '0.55rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          flexShrink: 0,
        }}
      >
        {/* Left: Back to Screener + Integrated Ticker Search Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setViewMode('screener')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#10b981',
              padding: '0.28rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={13} strokeWidth={2.3} />
            <span>{isES ? 'Todos los Mercados' : 'All Markets'}</span>
          </button>

          {/* Integrated Ticker Search Combobox with Full Keyboard Navigation */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'var(--bg-panel-glass)',
                backdropFilter: 'blur(12px)',
                border: l2SearchOpen ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '999px',
                padding: '0.26rem 0.8rem',
                width: '235px',
              }}
            >
              <Search size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder={isES ? `Cambiar activo (${currentAsset.sym})...` : `Switch ticker (${currentAsset.sym})...`}
                value={l2TickerQuery}
                onFocus={() => {
                  setL2SearchOpen(true);
                  setL2SelectedIndex(0);
                }}
                onBlur={() => setTimeout(() => setL2SearchOpen(false), 180)}
                onChange={(e) => {
                  setL2TickerQuery(e.target.value);
                  setL2SearchOpen(true);
                  setL2SelectedIndex(0);
                }}
                onKeyDown={(e) => {
                  if (!l2SearchResults.length) return;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setL2SearchOpen(true);
                    setL2SelectedIndex((prev) => (prev + 1) % l2SearchResults.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setL2SearchOpen(true);
                    setL2SelectedIndex((prev) => (prev - 1 + l2SearchResults.length) % l2SearchResults.length);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const picked = l2SearchResults[l2SelectedIndex] || l2SearchResults[0];
                    if (picked) {
                      onSelectAsset(picked.sym);
                      setL2TickerQuery('');
                      setL2SearchOpen(false);
                    }
                  } else if (e.key === 'Escape') {
                    setL2SearchOpen(false);
                    setL2TickerQuery('');
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'var(--font-sans)',
                }}
              />
              {l2TickerQuery && (
                <button
                  onClick={() => {
                    setL2TickerQuery('');
                    setL2SelectedIndex(0);
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0, display: 'flex' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {l2SearchOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  width: '285px',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  borderRadius: '18px',
                  backgroundColor: 'rgba(10, 15, 28, 0.96)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  boxShadow: '0 14px 36px rgba(0, 0, 0, 0.6)',
                  padding: '0.35rem',
                  zIndex: 50,
                }}
              >
                {l2SearchResults.map((item, idx) => {
                  const pos = item.chgNum >= 0;
                  const isHighlighted = idx === l2SelectedIndex;
                  return (
                    <div
                      key={item.sym}
                      onMouseEnter={() => setL2SelectedIndex(idx)}
                      onMouseDown={() => {
                        onSelectAsset(item.sym);
                        setL2TickerQuery('');
                        setL2SearchOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.42rem 0.65rem',
                        borderRadius: '12px',
                        backgroundColor: isHighlighted
                          ? 'rgba(16, 185, 129, 0.22)'
                          : item.sym === selectedAsset
                            ? 'rgba(255, 255, 255, 0.06)'
                            : 'transparent',
                        border: isHighlighted ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid transparent',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                      }}
                    >
                      <div>
                        <span className="mono-metric" style={{ fontWeight: 800, color: '#fff' }}>{item.sym}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginLeft: '0.45rem' }}>{item.name}</span>
                      </div>
                      <div className="mono-metric" style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ color: '#fff' }}>{item.priceFormatted}</span>
                        <span style={{ color: pos ? '#10b981' : '#f43f5e', fontWeight: 700 }}>{item.chg}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center: LEVEL 2 PRIMARY MODE SWITCHER: ANALYTICS | RESEARCH */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(13, 19, 33, 0.72)',
            backdropFilter: 'blur(14px)',
            padding: '0.24rem',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            gap: '0.25rem',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          {[
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'research', icon: FileText, label: 'Research' },
          ].map((sec) => {
            const Icon = sec.icon;
            const active = l2Section === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setL2Section(sec.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.42rem',
                  fontSize: '0.75rem',
                  fontWeight: active ? 800 : 600,
                  padding: '0.3rem 1.15rem',
                  borderRadius: '999px',
                  border: active ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid transparent',
                  backgroundColor: active ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                  color: active ? '#ffffff' : 'var(--text-dim)',
                  cursor: 'pointer',
                  transition: 'all 0.16s ease',
                }}
              >
                <Icon size={13} style={{ color: active ? '#10b981' : 'var(--text-dim)' }} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Contextual Top Controls (Timeframes for Analytics OR Live Wire Trigger for Research) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.55rem', flexWrap: 'wrap' }}>
          {l2Section === 'analytics' ? (
            <>
              <button
                onClick={() => triggerLiveP06Scoring(selectedAsset)}
                disabled={isScoring}
                className="mono-metric"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  padding: '0.22rem 0.65rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  color: liveInference ? '#10b981' : 'var(--text-dim)',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={11} />
                <span>{isScoring ? 'P-06 SCORING...' : liveInference ? `P-06 LIVE (${liveInference.latencyMs}ms)` : 'P-06 RE-SCORE'}</span>
              </button>

              <div
                style={{
                  display: 'inline-flex',
                  backgroundColor: 'rgba(13, 19, 33, 0.55)',
                  padding: '0.18rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  gap: '0.15rem',
                }}
              >
                {TIMEFRAMES.map((tf) => {
                  const isActive = timeframe === tf.id;
                  return (
                    <button
                      key={tf.id}
                      onClick={() => setTimeframe(tf.id)}
                      className="mono-metric"
                      style={{
                        fontSize: '0.66rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        border: 'none',
                        backgroundColor: isActive ? '#10b981' : 'transparent',
                        color: isActive ? '#000' : 'var(--text-dim)',
                        fontWeight: isActive ? 800 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.14s ease',
                      }}
                    >
                      {tf.label}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <button
              onClick={pushIncomingWireHeadline}
              className="mono-metric"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.64rem',
                fontWeight: 800,
                padding: '0.26rem 0.8rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.14)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#10b981',
                cursor: 'pointer',
              }}
            >
              <Radio size={12} />
              <span>{isES ? '+ SIMULAR NOTICIA EN VIVO' : '+ SIMULATE INCOMING NEWS'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2.2 EDITORIAL HERO HEADER (FEY STYLE): CONTEXTUAL METRICS FOR ANALYTICS vs RESEARCH */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '0.65rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
              {currentAsset.name} • {currentAsset.pair} • {currentAsset.cat}
            </div>
            <button
              type="button"
              onClick={() => onToggleWatchlist && onToggleWatchlist(currentAsset.sym)}
              className="mono-metric"
              style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '0.16rem 0.6rem',
                borderRadius: '999px',
                border: watchlistSyms.includes(currentAsset.sym)
                  ? '1px solid rgba(251, 191, 36, 0.55)'
                  : '1px solid rgba(255, 255, 255, 0.16)',
                backgroundColor: watchlistSyms.includes(currentAsset.sym)
                  ? 'rgba(251, 191, 36, 0.16)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: watchlistSyms.includes(currentAsset.sym) ? '#fbbf24' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              {watchlistSyms.includes(currentAsset.sym)
                ? isES
                  ? '★ EN WATCHLIST'
                  : '★ IN WATCHLIST'
                : isES
                  ? '☆ + WATCHLIST'
                  : '☆ + WATCHLIST'}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', marginTop: '0.1rem' }}>
            <span className="mono-metric" style={{ fontSize: '2.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
              {currentAsset.priceFormatted}
            </span>
            <span className="mono-metric" style={{ fontSize: '1.08rem', fontWeight: 700, color: assetMainColor }}>
              {currentAsset.chg}
            </span>
            {l2Section === 'analytics' && compareSymbol && (
              <span className="mono-metric" style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                vs {compareSymbol} ({getAssetBySymbol(compareSymbol).chg})
              </span>
            )}
          </div>
        </div>

        {/* Right Hero Strip: Quantitative Metrics in Analytics Mode vs Qualitative Summary in Research Mode */}
        {l2Section === 'analytics' ? (
          (() => {
            const catSpec = getAssetClassSpecificMetrics(currentAsset, isES);
            return (
              <div className="mono-metric" style={{ display: 'flex', gap: '1.45rem', fontSize: '0.74rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>24H VOLUME</div>
                  <div style={{ fontWeight: 800, color: '#fff', marginTop: '0.14rem' }}>
                    {currentAsset.vol24h}{' '}
                    <span style={{ color: currentAsset.volChg24h.startsWith('+') ? '#10b981' : '#f43f5e' }}>
                      ({currentAsset.volChg24h})
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.58rem', color: '#10b981' }}>{catSpec.col1Label}</div>
                  <div style={{ fontWeight: 800, color: catSpec.col1Color || '#fff', marginTop: '0.14rem' }}>
                    {catSpec.col1Val} <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 600 }}>({catSpec.col1Sub})</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.58rem', color: '#38bdf8' }}>{catSpec.col2Label}</div>
                  <div style={{ fontWeight: 800, color: catSpec.col2Color || '#fff', marginTop: '0.14rem' }}>
                    {catSpec.col2Val} <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 600 }}>({catSpec.col2Sub})</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>RSI (14) / MACD</div>
                  <div style={{ fontWeight: 800, color: currentAsset.indicators.rsi14 >= 50 ? '#10b981' : '#f43f5e', marginTop: '0.14rem' }}>
                    {currentAsset.indicators.rsi14} • {currentAsset.indicators.macdSignal}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>P-06 ANOMALY</div>
                  <div style={{ fontWeight: 800, color: scoreColor, marginTop: '0.14rem' }}>
                    {displayedScore} ({anomalyProfile.regime})
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* 1. Research Stance + Asset-Class News Sensitivity */}
            <div>
              <div className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>
                {isES ? 'POSTURA & PONDERACIÓN POR CLASE' : 'RESEARCH STANCE & ASSET SENSITIVITY'}
              </div>
              <div
                className="mono-metric"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: researchBrief.stance === 'BULLISH' ? '#10b981' : '#f43f5e',
                  marginTop: '0.14rem',
                }}
              >
                {researchBrief.stanceLabel[langCode] || researchBrief.stanceLabel.EN}
              </div>
              <div className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                {assetSensitivity.shortLabel[langCode] || assetSensitivity.shortLabel.EN}
              </div>
            </div>

            {/* 2. Weighted Composite Score (Filings + News by Asset Class) */}
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '1.35rem' }}>
              <div className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>
                {isES ? 'NOTA PONDERADA TOTAL' : 'WEIGHTED COMPOSITE'}
              </div>
              <div
                className="mono-metric"
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: researchBrief.compositeScore >= 0 ? '#10b981' : '#f43f5e',
                  marginTop: '0.1rem',
                }}
              >
                {researchBrief.compositeFormatted}
              </div>
              <div className="mono-metric" style={{ fontSize: '0.56rem', color: 'var(--text-dim)', marginTop: '0.06rem' }}>
                {isES ? 'Fundamentos' : 'Filings'} {researchBrief.filingNetFormatted} • {isES ? 'Noticias' : 'News'}{' '}
                {assetFinbertPolarity.formattedInt}
              </div>
            </div>

            {/* 3. News Sentiment Linear Number Line (-100 to +100, Signed Integer Only) */}
            <div style={{ minWidth: '245px', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '1.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.22rem' }}>
                <span className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>
                  {isES ? 'SENTIMIENTO NOTICIAS' : 'NEWS SENTIMENT'}
                </span>
                <span className="mono-metric" style={{ fontSize: '0.96rem', fontWeight: 800, color: assetFinbertPolarity.color }}>
                  {assetFinbertPolarity.formattedInt}
                </span>
              </div>

              {/* -100 .. 0 .. +100 Linear Axis with Positioned Marker */}
              <div style={{ position: 'relative', height: '8px', borderRadius: '999px', background: 'linear-gradient(90deg, #f43f5e 0%, rgba(255,255,255,0.16) 50%, #10b981 100%)' }}>
                {/* Zero Center Tick */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '-2px',
                    bottom: '-2px',
                    width: '2px',
                    backgroundColor: 'rgba(255,255,255,0.55)',
                    transform: 'translateX(-50%)',
                  }}
                />
                {/* Active Asset Position Marker */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${assetFinbertPolarity.linePct}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '13px',
                    height: '13px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: `3px solid ${assetFinbertPolarity.color}`,
                    boxShadow: `0 0 10px ${assetFinbertPolarity.color}`,
                    transition: 'left 0.35s ease',
                  }}
                />
              </div>

              <div className="mono-metric" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.54rem', color: 'var(--text-dim)', marginTop: '0.18rem' }}>
                <span style={{ color: '#f43f5e' }}>-100</span>
                <span>0</span>
                <span style={{ color: '#10b981' }}>+100</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {l2Section === 'analytics' ? (
        <>
          {/* 2.3 ORGANIZED ANALYSIS WORKBENCH BAR (GROUPED BY ANALYSIS TYPE) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.65rem',
              flexShrink: 0,
            }}
          >
            {/* Left: Primary Analysis Lens Selector */}
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: 'rgba(13, 19, 33, 0.55)',
                padding: '0.2rem',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                gap: '0.2rem',
              }}
            >
              {[
                { id: 'technical', label: isES ? 'Análisis Técnico' : 'Technical Overlays' },
                { id: 'compare', label: isES ? 'Comparar Activos (%)' : 'Relative Comparison (%)' },
                { id: 'microstructure', label: isES ? 'Microestructura & Flujo' : 'Microstructure & Flow' },
                {
                  id: 'derivatives',
                  label:
                    currentAsset.cat === 'RATES' || currentAsset.cat === 'FIXED_INCOME' || currentAsset.cat === 'CASH'
                      ? isES
                        ? 'Curva Soberana 3D/2D (42 Países)'
                        : 'Sovereign Curve 3D/2D (42 Countries)'
                      : currentAsset.cat === 'FX'
                        ? isES
                          ? 'Conversión Cruzada (61 Monedas)'
                          : 'FX Cross Converter (61 CCY)'
                        : currentAsset.cat === 'COMMODITY'
                          ? isES
                            ? 'Superficie Forward 3D & Inventarios'
                            : '3D Forward Surface & Inventories'
                          : isES
                            ? 'Superficie Volatilidad 3D & Payoff'
                            : '3D Volatility Surface & Payoff',
                },
              ].map((lens) => {
                const active = analysisLens === lens.id;
                return (
                  <button
                    key={lens.id}
                    onClick={() => setAnalysisLens(lens.id)}
                    style={{
                      fontSize: '0.69rem',
                      fontWeight: active ? 700 : 500,
                      padding: '0.24rem 0.8rem',
                      borderRadius: '999px',
                      border: active ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                      backgroundColor: active ? 'rgba(16, 185, 129, 0.16)' : 'transparent',
                      color: active ? '#ffffff' : 'var(--text-dim)',
                      cursor: 'pointer',
                    }}
                  >
                    {lens.label}
                  </button>
                );
              })}
            </div>

            {/* Right: Contextual Tool Toggles for the Selected Analysis Lens */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              {analysisLens === 'technical' && (
                <>
                  {[
                    { label: 'SMA (20)', active: showSma20, toggle: () => setShowSma20(!showSma20), color: '#38bdf8' },
                    { label: 'Bollinger Bands (20, 2σ)', active: showBollinger, toggle: () => setShowBollinger(!showBollinger), color: '#a78bfa' },
                    { label: 'VWAP', active: showVwap, toggle: () => setShowVwap(!showVwap), color: '#f59e0b' },
                    {
                      label: isES ? 'Sub-panel: Volumen' : 'Sub-pane: Volume',
                      active: showSubChart === 'vol',
                      toggle: () => setShowSubChart(showSubChart === 'vol' ? 'none' : 'vol'),
                      color: '#10b981',
                    },
                  ].map((tool) => (
                    <button
                      key={tool.label}
                      onClick={tool.toggle}
                      className="mono-metric"
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.22rem 0.68rem',
                        borderRadius: '999px',
                        border: tool.active ? `1px solid ${tool.color}` : '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: tool.active ? 'rgba(255,255,255,0.07)' : 'transparent',
                        color: tool.active ? tool.color : 'var(--text-dim)',
                        cursor: 'pointer',
                      }}
                    >
                      {tool.label}
                    </button>
                  ))}
                </>
              )}

              {analysisLens === 'compare' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', position: 'relative' }}>
                  <span className="mono-metric" style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                    {isES
                      ? `COMPARAR CONTRA (${(COMPATIBLE_COMPARE_CATEGORIES[currentAsset.cat] || [currentAsset.cat]).join(' / ')}):`
                      : `COMPARE VS (${(COMPATIBLE_COMPARE_CATEGORIES[currentAsset.cat] || [currentAsset.cat]).join(' / ')}):`}
                  </span>

                  {/* Active Comparison Pill (if selected) */}
                  {compareSymbol && (
                    <div
                      className="mono-metric"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.65rem',
                        borderRadius: '999px',
                        border: '1px solid #38bdf8',
                        backgroundColor: 'rgba(56, 189, 248, 0.16)',
                        color: '#38bdf8',
                      }}
                    >
                      <span>
                        vs {compareSymbol} ({getAssetBySymbol(compareSymbol).cat} • {getAssetBySymbol(compareSymbol).chg})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCompareSymbol(null);
                          setCompareQuery('');
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#38bdf8',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {/* Searchable Input for Compatible Asset Comparison */}
                  <div style={{ position: 'relative', minWidth: '250px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        backgroundColor: 'rgba(8, 12, 22, 0.85)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: '999px',
                        padding: '0.2rem 0.7rem',
                      }}
                    >
                      <Search size={12} style={{ color: '#38bdf8', flexShrink: 0 }} />
                      <input
                        type="text"
                        value={compareQuery}
                        onFocus={() => setCompareDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setCompareDropdownOpen(false), 160)}
                        onChange={(e) => {
                          setCompareQuery(e.target.value);
                          setCompareDropdownOpen(true);
                          setCompareSelectedIndex(0);
                        }}
                        onKeyDown={(e) => {
                          if (!compatibleCompareMatches.length) return;
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setCompareSelectedIndex((prev) => (prev + 1) % compatibleCompareMatches.length);
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setCompareSelectedIndex((prev) => (prev - 1 + compatibleCompareMatches.length) % compatibleCompareMatches.length);
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            const target = compatibleCompareMatches[compareSelectedIndex] || compatibleCompareMatches[0];
                            if (target) {
                              setCompareSymbol(target.sym);
                              setCompareQuery('');
                              setCompareDropdownOpen(false);
                            }
                          } else if (e.key === 'Escape') {
                            setCompareDropdownOpen(false);
                          }
                        }}
                        placeholder={
                          isES
                            ? `Escribir ticker o nombre (${currentAsset.cat})...`
                            : `Type ticker or name (${currentAsset.cat})...`
                        }
                        style={{
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#ffffff',
                          fontSize: '0.67rem',
                          width: '100%',
                        }}
                      />
                    </div>

                    {/* Autocomplete Dropdown of Compatible Assets */}
                    {compareDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          right: 0,
                          width: '330px',
                          maxHeight: '260px',
                          overflowY: 'auto',
                          borderRadius: '14px',
                          backgroundColor: 'rgba(10, 15, 26, 0.98)',
                          border: '1px solid rgba(56, 189, 248, 0.38)',
                          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.75)',
                          padding: '0.35rem',
                          zIndex: 80,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.18rem',
                        }}
                      >
                        {compatibleCompareMatches.length === 0 ? (
                          <div className="mono-metric" style={{ padding: '0.55rem', fontSize: '0.64rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                            {isES
                              ? `Sin coincidencias compatibles para ${currentAsset.cat}`
                              : `No compatible matches for ${currentAsset.cat}`}
                          </div>
                        ) : (
                          compatibleCompareMatches.map((peer, idx) => {
                            const isHighlighted = idx === compareSelectedIndex;
                            const isActive = compareSymbol === peer.sym;
                            return (
                              <button
                                key={peer.sym}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setCompareSymbol(peer.sym);
                                  setCompareQuery('');
                                  setCompareDropdownOpen(false);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '0.5rem',
                                  padding: '0.42rem 0.6rem',
                                  borderRadius: '9px',
                                  backgroundColor:
                                    isActive || isHighlighted ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
                                  border: isActive ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid transparent',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                                  <span className="mono-metric" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ffffff', minWidth: '52px' }}>
                                    {peer.sym}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '0.65rem',
                                      color: 'var(--text-muted)',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {peer.name}
                                  </span>
                                </div>
                                <div className="mono-metric" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                                  <span
                                    style={{
                                      fontSize: '0.52rem',
                                      fontWeight: 800,
                                      padding: '0.08rem 0.38rem',
                                      borderRadius: '999px',
                                      backgroundColor: peer.cat === currentAsset.cat ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255,255,255,0.08)',
                                      color: peer.cat === currentAsset.cat ? '#10b981' : 'var(--text-dim)',
                                    }}
                                  >
                                    {peer.cat}
                                  </span>
                                  <span style={{ fontSize: '0.63rem', fontWeight: 700, color: peer.chgNum >= 0 ? '#10b981' : '#f43f5e' }}>
                                    {peer.chg}
                                  </span>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {analysisLens === 'microstructure' && (
                <>
                  {[
                    { label: 'Vol Z-Score Pulse (20d)', id: 'zscore' },
                    { label: '24h Volume Histogram', id: 'vol' },
                  ].map((pane) => {
                    const active = showSubChart === pane.id;
                    return (
                      <button
                        key={pane.id}
                        onClick={() => setShowSubChart(pane.id)}
                        className="mono-metric"
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.22rem 0.68rem',
                          borderRadius: '999px',
                          border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                          backgroundColor: active ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                          color: active ? '#10b981' : 'var(--text-dim)',
                          cursor: 'pointer',
                        }}
                      >
                        {pane.label}
                      </button>
                    );
                  })}
                  <span className="mono-metric" style={{ fontSize: '0.64rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                    Spread: <strong style={{ color: '#10b981' }}>{anomalyProfile.spreadDislocation}</strong> • BB Width:{' '}
                    <strong style={{ color: '#fff' }}>{currentAsset.indicators.bbWidth}</strong>
                  </span>
                </>
              )}

              {analysisLens === 'derivatives' &&
                (() => {
                  if (
                    currentAsset.cat === 'RATES' ||
                    currentAsset.cat === 'FIXED_INCOME' ||
                    currentAsset.cat === 'CASH'
                  ) {
                    const curveMetrics = computeSovereignCurveMetrics(selectedCurveCountry);
                    return (
                      <div className="mono-metric" style={{ display: 'flex', alignItems: 'center', gap: '0.48rem', flexWrap: 'wrap', fontSize: '0.62rem' }}>
                        {/* 3D vs 2D Sovereign Yield Surface Switcher */}
                        <div
                          style={{
                            display: 'inline-flex',
                            backgroundColor: 'rgba(8, 12, 22, 0.85)',
                            padding: '0.14rem',
                            borderRadius: '999px',
                            border: '1px solid rgba(255,255,255,0.12)',
                            gap: '0.15rem',
                          }}
                        >
                          {[
                            { id: '3d-history', label: isES ? 'Superficie 3D (Hist)' : '3D Surface (Hist)' },
                            { id: '3d-peers', label: isES ? 'Superficie 3D (Países)' : '3D Surface (Peers)' },
                            { id: '2d', label: isES ? 'Curva 2D' : '2D Curve' },
                          ].map((sub) => {
                            const active = ratesSubView === sub.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => setRatesSubView(sub.id)}
                                style={{
                                  fontSize: '0.6rem',
                                  fontWeight: 800,
                                  padding: '0.14rem 0.52rem',
                                  borderRadius: '999px',
                                  border: active ? '1px solid #10b981' : '1px solid transparent',
                                  backgroundColor: active ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                  color: active ? '#10b981' : 'var(--text-dim)',
                                  cursor: 'pointer',
                                }}
                              >
                                {sub.label}
                              </button>
                            );
                          })}
                        </div>
                        <select
                          value={selectedCurveCountry}
                          onChange={(e) => setSelectedCurveCountry(e.target.value)}
                          style={{
                            backgroundColor: 'rgba(13, 19, 33, 0.9)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.45)',
                            borderRadius: '999px',
                            padding: '0.2rem 0.65rem',
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          {Object.entries(SOVEREIGN_YIELD_CURVES).map(([code, c]) => (
                            <option key={code} value={code}>
                              {code} • {c.country[langCode] || c.country.EN} ({c.rating})
                            </option>
                          ))}
                        </select>
                        <span style={{ color: 'var(--text-muted)' }}>
                          10Y: <strong style={{ color: '#fff' }}>{curveMetrics.y10}%</strong>
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          2s10s:{' '}
                          <strong style={{ color: curveMetrics.spread2s10sBps >= 0 ? '#10b981' : '#f43f5e' }}>
                            {curveMetrics.spread2s10sBps >= 0 ? '+' : ''}
                            {curveMetrics.spread2s10sBps} bps
                          </strong>
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          3m10y:{' '}
                          <strong style={{ color: curveMetrics.spread3m10yBps >= 0 ? '#10b981' : '#f43f5e' }}>
                            {curveMetrics.spread3m10yBps >= 0 ? '+' : ''}
                            {curveMetrics.spread3m10yBps} bps
                          </strong>
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          Butterfly 2s5s10s:{' '}
                          <strong style={{ color: curveMetrics.butterfly2s5s10sBps >= 0 ? '#10b981' : '#f43f5e' }}>
                            {curveMetrics.butterfly2s5s10sBps >= 0 ? '+' : ''}
                            {curveMetrics.butterfly2s5s10sBps} bps
                          </strong>
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          Real 10Y:{' '}
                          <strong style={{ color: curveMetrics.realYield10Y >= 0 ? '#10b981' : '#f43f5e' }}>
                            {curveMetrics.realYield10Y >= 0 ? '+' : ''}
                            {curveMetrics.realYield10Y}%
                          </strong>
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          DV01: <strong style={{ color: '#fff' }}>{curveMetrics.dv01PerMillion10Y}</strong>
                        </span>
                      </div>
                    );
                  }

                  if (currentAsset.cat === 'FX') {
                    const cross = computeCrossCurrencyRate(fxBaseCcy, fxQuoteCcy, fxAmount);
                    return (
                      <div className="mono-metric" style={{ display: 'flex', alignItems: 'center', gap: '0.42rem', flexWrap: 'wrap', fontSize: '0.63rem' }}>
                        <input
                          type="number"
                          min="1"
                          value={fxAmount}
                          onChange={(e) => setFxAmount(Math.max(1, Number(e.target.value) || 1))}
                          style={{
                            width: '74px',
                            backgroundColor: 'rgba(13, 19, 33, 0.92)',
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            borderRadius: '999px',
                            padding: '0.18rem 0.5rem',
                            fontSize: '0.63rem',
                            fontWeight: 800,
                            outline: 'none',
                            textAlign: 'right',
                          }}
                        />
                        <select
                          value={fxBaseCcy}
                          onChange={(e) => setFxBaseCcy(e.target.value)}
                          style={{
                            backgroundColor: 'rgba(13, 19, 33, 0.9)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.45)',
                            borderRadius: '999px',
                            padding: '0.18rem 0.55rem',
                            fontSize: '0.63rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          {Object.keys(WORLD_USD_RATES).map((ccy) => (
                            <option key={ccy} value={ccy}>
                              {ccy} ({WORLD_USD_RATES[ccy].name})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const prevBase = fxBaseCcy;
                            setFxBaseCcy(fxQuoteCcy);
                            setFxQuoteCcy(prevBase);
                          }}
                          title={isES ? 'Invertir par de divisas' : 'Swap currency pair'}
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.16)',
                            borderRadius: '999px',
                            padding: '0.12rem 0.45rem',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          ⇄
                        </button>
                        <select
                          value={fxQuoteCcy}
                          onChange={(e) => setFxQuoteCcy(e.target.value)}
                          style={{
                            backgroundColor: 'rgba(13, 19, 33, 0.9)',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.45)',
                            borderRadius: '999px',
                            padding: '0.18rem 0.55rem',
                            fontSize: '0.63rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          {Object.keys(WORLD_USD_RATES).map((ccy) => (
                            <option key={ccy} value={ccy}>
                              {ccy} ({WORLD_USD_RATES[ccy].name})
                            </option>
                          ))}
                        </select>
                        <span
                          style={{
                            color: '#ffffff',
                            fontWeight: 800,
                            padding: '0.16rem 0.58rem',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(16, 185, 129, 0.14)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                          }}
                        >
                          = <strong style={{ color: '#10b981' }}>{cross.convertedFormatted} {fxQuoteCcy}</strong>
                        </span>
                        <span style={{ color: '#fff', fontWeight: 800 }}>
                          {cross.pair}: <strong style={{ color: '#10b981' }}>{cross.rateFormatted}</strong>
                        </span>
                        <span style={{ color: cross.chg24h >= 0 ? '#10b981' : '#f43f5e', fontWeight: 700 }}>
                          ({cross.chgFormatted})
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          Inv: <strong style={{ color: '#fff' }}>{cross.inverseFormatted}</strong> • Carry 10Y:{' '}
                          <strong style={{ color: cross.carryDiffBps >= 0 ? '#10b981' : '#f43f5e' }}>{cross.carryFormatted}</strong>
                        </span>
                      </div>
                    );
                  }

                  if (currentAsset.cat === 'COMMODITY') {
                    const fwd = getCommodityForwardCurve(currentAsset.sym, currentAsset.price);
                    return (
                      <div className="mono-metric" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', fontSize: '0.63rem' }}>
                        {/* 3D vs 2D Commodity Forward Surface Switcher */}
                        <div
                          style={{
                            display: 'inline-flex',
                            backgroundColor: 'rgba(8, 12, 22, 0.85)',
                            padding: '0.14rem',
                            borderRadius: '999px',
                            border: '1px solid rgba(255,255,255,0.12)',
                            gap: '0.15rem',
                          }}
                        >
                          {[
                            { id: '3d', label: isES ? 'Superficie Forward 3D' : '3D Forward Surface' },
                            { id: '2d', label: isES ? 'Curva Forward 2D' : '2D Forward Curve' },
                          ].map((sub) => {
                            const active = commoditySubView === sub.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => setCommoditySubView(sub.id)}
                                style={{
                                  fontSize: '0.6rem',
                                  fontWeight: 800,
                                  padding: '0.14rem 0.52rem',
                                  borderRadius: '999px',
                                  border: active ? '1px solid #10b981' : '1px solid transparent',
                                  backgroundColor: active ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                  color: active ? '#10b981' : 'var(--text-dim)',
                                  cursor: 'pointer',
                                }}
                              >
                                {sub.label}
                              </button>
                            );
                          })}
                        </div>
                        <span style={{ color: '#10b981', fontWeight: 800 }}>
                          {isES ? 'ESTRUCTURA:' : 'STRUCTURE:'}{' '}
                          <strong style={{ color: fwd.isBackwardation ? '#10b981' : '#f59e0b' }}>{fwd.regime}</strong>
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          Roll Yield (1Y):{' '}
                          <strong style={{ color: fwd.isBackwardation ? '#10b981' : '#f43f5e' }}>{fwd.rollYieldAnnual}</strong>
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {isES ? 'Inventario vs 5A:' : 'Inventory vs 5Y:'}{' '}
                          <strong style={{ color: '#fff' }}>{fwd.inventoryVs5Y}</strong>
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          COT Net Spec: <strong style={{ color: '#38bdf8' }}>{fwd.cotNetSpec}</strong>
                        </span>
                      </div>
                    );
                  }

                  const optChain = getHighVolumeOptionsChain(
                    currentAsset.underlyingSym || currentAsset.sym,
                    currentAsset.price
                  );
                  const payoffData = computeOptionsStrategyPayoff(
                    currentAsset.underlyingSym || currentAsset.sym,
                    currentAsset.price,
                    selectedOptStrategy
                  );
                  return (
                    <div className="mono-metric" style={{ display: 'flex', alignItems: 'center', gap: '0.52rem', flexWrap: 'wrap', fontSize: '0.62rem' }}>
                      {/* Sub-mode Switcher: 3D Volatility Surface vs 2D Smile vs Strategy Payoff P&L */}
                      <div
                        style={{
                          display: 'inline-flex',
                          backgroundColor: 'rgba(8, 12, 22, 0.85)',
                          padding: '0.14rem',
                          borderRadius: '999px',
                          border: '1px solid rgba(255,255,255,0.12)',
                          gap: '0.15rem',
                        }}
                      >
                        {[
                          { id: 'surface3d', label: isES ? 'Superficie IV 3D' : '3D IV Surface' },
                          { id: 'surface', label: isES ? 'Sonrisa IV 2D' : '2D IV Smile' },
                          { id: 'payoff', label: isES ? 'Payoff P&L & Sintéticos' : 'Payoff P&L & Synthetics' },
                        ].map((sub) => {
                          const active = optionsSubView === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => setOptionsSubView(sub.id)}
                              style={{
                                fontSize: '0.61rem',
                                fontWeight: 800,
                                padding: '0.15rem 0.58rem',
                                borderRadius: '999px',
                                border: active ? '1px solid #10b981' : '1px solid transparent',
                                backgroundColor: active ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                color: active ? '#10b981' : 'var(--text-dim)',
                                cursor: 'pointer',
                              }}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>

                      {optionsSubView !== 'payoff' ? (
                        <>
                          <span style={{ color: '#10b981', fontWeight: 700 }}>{optChain.filterPolicy}</span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            ATM IV: <strong style={{ color: '#fff' }}>{optChain.atmIvPct}%</strong> (IVR {optChain.ivRank})
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            Straddle: <strong style={{ color: '#fff' }}>{optChain.straddleBreakevenPct}</strong>
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            25Δ Skew: <strong style={{ color: '#10b981' }}>{optChain.skew25d}</strong>
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            GEX: <strong style={{ color: '#10b981' }}>{optChain.netGammaExposure}</strong>
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            Max Pain: <strong style={{ color: '#38bdf8' }}>${optChain.maxPain}</strong>
                          </span>
                        </>
                      ) : (
                        <>
                          <select
                            value={selectedOptStrategy}
                            onChange={(e) => setSelectedOptStrategy(e.target.value)}
                            style={{
                              backgroundColor: 'rgba(13, 19, 33, 0.92)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.45)',
                              borderRadius: '999px',
                              padding: '0.18rem 0.6rem',
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              outline: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {OPTIONS_STRATEGIES.map((st) => (
                              <option key={st.id} value={st.id}>
                                {st.label[langCode] || st.label.EN}
                              </option>
                            ))}
                          </select>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {isES ? 'Prima:' : 'Net:'}{' '}
                            <strong style={{ color: '#ffffff' }}>{payoffData.netCostFormatted}</strong>
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            BE: <strong style={{ color: '#38bdf8' }}>{payoffData.breakevenText}</strong>
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            Max +: <strong style={{ color: '#10b981' }}>{payoffData.maxProfitText}</strong>
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            Max -: <strong style={{ color: '#f43f5e' }}>{payoffData.maxLossText}</strong>
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            Δ <strong style={{ color: '#fff' }}>{payoffData.greeks.delta}</strong> • Γ{' '}
                            <strong style={{ color: '#fff' }}>{payoffData.greeks.gamma}</strong> • Θ{' '}
                            <strong style={{ color: '#fff' }}>{payoffData.greeks.theta}</strong> • ν{' '}
                            <strong style={{ color: '#fff' }}>{payoffData.greeks.vega}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  );
                })()}
            </div>
          </div>

          {/* 2.4 OPEN BORDERLESS STARFIELD CHART WORKSPACE */}
          {(() => {
            const isRatesCurveMode =
              analysisLens === 'derivatives' &&
              (currentAsset.cat === 'RATES' || currentAsset.cat === 'FIXED_INCOME' || currentAsset.cat === 'CASH');
            const isFxCrossMode =
              analysisLens === 'derivatives' && currentAsset.cat === 'FX';
            const isCommodityCurveMode =
              analysisLens === 'derivatives' && currentAsset.cat === 'COMMODITY';
            const isOptionsBaseMode =
              analysisLens === 'derivatives' &&
              !isRatesCurveMode &&
              !isFxCrossMode &&
              !isCommodityCurveMode;
            const isOptionsSmileMode = isOptionsBaseMode && optionsSubView === 'surface';
            const isOptionsPayoffMode = isOptionsBaseMode && optionsSubView === 'payoff';

            // Determine if a 3D Volumetric Surface is active
            const isOptions3DMode = isOptionsBaseMode && optionsSubView === 'surface3d';
            const isRates3DMode = isRatesCurveMode && ratesSubView !== '2d';
            const isCommodity3DMode = isCommodityCurveMode && commoditySubView === '3d';
            const is3DSurfaceActive = isOptions3DMode || isRates3DMode || isCommodity3DMode;

            const active3DSurfaceData = isOptions3DMode
              ? computeVolatilitySurface3D(currentAsset.underlyingSym || currentAsset.sym, currentAsset.price)
              : isRates3DMode
                ? computeSovereignYieldSurface3D(
                  selectedCurveCountry,
                  ratesSubView === '3d-peers' ? 'crossCountry' : 'history'
                )
                : isCommodity3DMode
                  ? computeCommodityForwardSurface3D(currentAsset.sym, currentAsset.price)
                  : null;

            const activeChartData = isRatesCurveMode
              ? computeSovereignCurveMetrics(selectedCurveCountry).curveSeries.map((pt) => ({
                time: pt.tenor,
                price: pt.yield,
                cmpReturn: pt.ustYield,
                bundYield: pt.bundYield,
                vol: pt.vol,
                zBar: pt.zBar,
              }))
              : isFxCrossMode
                ? computeCrossCurrencyRate(fxBaseCcy, fxQuoteCcy, fxAmount).crossSeries
                : isCommodityCurveMode
                  ? getCommodityForwardCurve(currentAsset.sym, currentAsset.price).curveSeries
                  : isOptionsPayoffMode
                    ? computeOptionsStrategyPayoff(
                      currentAsset.underlyingSym || currentAsset.sym,
                      currentAsset.price,
                      selectedOptStrategy
                    ).payoffSeries
                    : isOptionsSmileMode
                      ? getHighVolumeOptionsChain(
                        currentAsset.underlyingSym || currentAsset.sym,
                        currentAsset.price
                      ).strikes.map((st) => ({
                        time: `$${st.strike} (${st.moneyness})`,
                        iv7d: st.iv7d,
                        price: st.iv30d,
                        iv90d: st.iv90d,
                        iv180d: st.iv180d,
                        sma20: st.callMid,
                        vol: Math.round((st.callVol + st.putVol) / 100),
                        zBar: Number(st.deltaCall.toFixed(2)),
                      }))
                      : chartData;

            return (
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '0.25rem 0' }}>
                {is3DSurfaceActive && active3DSurfaceData ? (
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <Surface3DViewer surfaceData={active3DSurfaceData} isES={isES} />
                  </div>
                ) : (
                  <>
                    <div style={{ flex: showSubChart === 'none' ? 1 : 0.74, minHeight: 0 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activeChartData}>
                          <defs>
                            <linearGradient id="feyMainGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={assetMainColor} stopOpacity={0.32} />
                              <stop offset="95%" stopColor={assetMainColor} stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="time"
                            stroke="var(--text-dim)"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            hide={showSubChart !== 'none' && !isRatesCurveMode && !isOptionsSmileMode && !isOptionsPayoffMode && !isCommodityCurveMode}
                          />
                          <YAxis
                            domain={['auto', 'auto']}
                            stroke="var(--text-dim)"
                            fontSize={11}
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) =>
                              isOptionsPayoffMode
                                ? `$${v}`
                                : isCompareMode || isRatesCurveMode || isOptionsSmileMode
                                  ? `${v}%`
                                  : v
                            }
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(10, 15, 28, 0.92)',
                              borderColor: 'rgba(255, 255, 255, 0.12)',
                              borderRadius: '12px',
                              fontSize: '0.73rem',
                            }}
                          />

                          {/* Primary Series */}
                          <Area
                            type="monotone"
                            dataKey={isCompareMode ? 'pctReturn' : 'price'}
                            name={
                              isRatesCurveMode
                                ? `${selectedCurveCountry} Yield (%)`
                                : isFxCrossMode
                                  ? `${fxBaseCcy}/${fxQuoteCcy} Cross Rate`
                                  : isCommodityCurveMode
                                    ? `${currentAsset.sym} Forward Curve`
                                    : isOptionsPayoffMode
                                      ? isES
                                        ? 'P&L al Vencimiento ($)'
                                        : 'Expiration Payoff P&L ($)'
                                      : isOptionsSmileMode
                                        ? `30D IV Surface (%)`
                                        : isCompareMode
                                          ? `${currentAsset.sym} (%)`
                                          : currentAsset.sym
                            }
                            stroke={assetMainColor}
                            strokeWidth={2.5}
                            fill={isCompareMode ? 'transparent' : 'url(#feyMainGrad)'}
                          />

                          {/* Options Strategy Payoff Mode: Today T+0 Black-Scholes P&L + $0 Breakeven Line */}
                          {isOptionsPayoffMode && (
                            <>
                              <Line
                                type="monotone"
                                dataKey="t0Pnl"
                                name={isES ? 'P&L Hoy T+0 Black-Scholes ($)' : 'Today T+0 Black-Scholes P&L ($)'}
                                stroke="#38bdf8"
                                strokeWidth={2.0}
                                strokeDasharray="4 3"
                                dot={false}
                              />
                              <Line
                                type="monotone"
                                dataKey="zeroLine"
                                name={isES ? 'Línea Breakeven ($0)' : 'Breakeven Line ($0)'}
                                stroke="rgba(255,255,255,0.45)"
                                strokeWidth={1.3}
                                strokeDasharray="3 3"
                                dot={false}
                              />
                            </>
                          )}

                          {/* 2D Volatility Surface Multi-Tenor Curves (7D, 90D, 180D) */}
                          {isOptionsSmileMode && (
                            <>
                              <Line
                                type="monotone"
                                dataKey="iv7d"
                                name="7D Weekly IV (%)"
                                stroke="#f43f5e"
                                strokeWidth={1.9}
                                strokeDasharray="3 3"
                                dot={false}
                              />
                              <Line
                                type="monotone"
                                dataKey="iv90d"
                                name="90D Quarterly IV (%)"
                                stroke="#38bdf8"
                                strokeWidth={2.0}
                                dot={false}
                              />
                              <Line
                                type="monotone"
                                dataKey="iv180d"
                                name="180D LEAPS IV (%)"
                                stroke="#a78bfa"
                                strokeWidth={1.8}
                                strokeDasharray="5 3"
                                dot={false}
                              />
                            </>
                          )}

                          {/* US Treasury & German Bund Benchmark Overlays when viewing Sovereign Curve */}
                          {isRatesCurveMode && selectedCurveCountry !== 'US' && (
                            <Line
                              type="monotone"
                              dataKey="cmpReturn"
                              name="US Treasury Benchmark (%)"
                              stroke="#38bdf8"
                              strokeWidth={1.9}
                              strokeDasharray="4 4"
                              dot={false}
                            />
                          )}
                          {isRatesCurveMode && selectedCurveCountry !== 'DE' && (
                            <Line
                              type="monotone"
                              dataKey="bundYield"
                              name="German Bund Benchmark (%)"
                              stroke="#a78bfa"
                              strokeWidth={1.6}
                              strokeDasharray="2 3"
                              dot={false}
                            />
                          )}

                          {/* FX Cross Triangulated SMA(20) or Commodity Spot Reference */}
                          {(isFxCrossMode || isCommodityCurveMode) && (
                            <Line
                              type="monotone"
                              dataKey="sma20"
                              name={isCommodityCurveMode ? 'Spot Price Reference' : `${fxBaseCcy}/${fxQuoteCcy} SMA (20)`}
                              stroke="#38bdf8"
                              strokeWidth={1.7}
                              strokeDasharray="4 4"
                              dot={false}
                            />
                          )}

                          {/* Relative Comparison Overlay Line */}
                          {isCompareMode && (
                            <Line
                              type="monotone"
                              dataKey="cmpReturn"
                              name={`${compareSymbol} (%)`}
                              stroke="#38bdf8"
                              strokeWidth={2.2}
                              dot={false}
                            />
                          )}

                          {/* Technical Overlays (when in Technical mode and not normalized %) */}
                          {!isCompareMode && !isRatesCurveMode && !isOptionsSmileMode && !isOptionsPayoffMode && !isFxCrossMode && !isCommodityCurveMode && showSma20 && (
                            <Line type="monotone" dataKey="sma20" name="SMA (20)" stroke="#38bdf8" strokeWidth={1.6} strokeDasharray="4 4" dot={false} />
                          )}
                          {!isCompareMode && !isRatesCurveMode && !isOptionsSmileMode && !isOptionsPayoffMode && !isFxCrossMode && !isCommodityCurveMode && showVwap && (
                            <Line type="monotone" dataKey="vwap" name="VWAP" stroke="#f59e0b" strokeWidth={1.6} dot={false} />
                          )}
                          {!isCompareMode && !isRatesCurveMode && !isOptionsSmileMode && !isOptionsPayoffMode && !isFxCrossMode && !isCommodityCurveMode && showBollinger && (
                            <>
                              <Line type="monotone" dataKey="bbUpper" name="BB Upper" stroke="#a78bfa" strokeWidth={1.2} strokeDasharray="3 3" dot={false} />
                              <Line type="monotone" dataKey="bbLower" name="BB Lower" stroke="#a78bfa" strokeWidth={1.2} strokeDasharray="3 3" dot={false} />
                            </>
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Synchronized Sub-Pane (Volume Histogram or Intraday Z-Score) */}
                    {showSubChart !== 'none' && (
                      <div style={{ flex: 0.26, minHeight: 0, borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.35rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={activeChartData}>
                            <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-dim)" fontSize={10} orientation="right" tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(10, 15, 28, 0.92)',
                                borderColor: 'rgba(255, 255, 255, 0.12)',
                                borderRadius: '10px',
                                fontSize: '0.7rem',
                              }}
                            />
                            <Bar
                              dataKey={showSubChart === 'zscore' ? 'zBar' : 'vol'}
                              name={
                                isOptionsSmileMode
                                  ? 'Contracts Vol (x100)'
                                  : isRatesCurveMode
                                    ? showSubChart === 'zscore'
                                      ? 'Spread vs UST (bps / 100)'
                                      : 'Tenor Liquidity Weight'
                                    : isCommodityCurveMode
                                      ? 'Open Interest Weight'
                                      : showSubChart === 'zscore'
                                        ? 'Vol Z-Score (σ)'
                                        : 'Volume'
                              }
                              fill={assetMainColor}
                              opacity={0.48}
                              radius={[3, 3, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })()}

          {/* 2.5 BOTTOM EDITORIAL DIAGNOSIS HAIRLINE (NO TICKER LIST ON THE RIGHT) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              paddingTop: '0.6rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.73rem',
              flexShrink: 0,
            }}
          >
            <div style={{ color: 'var(--text-muted)' }}>
              <strong style={{ color: scoreColor, marginRight: '0.5rem' }}>
                {anomalyProfile.alertTitle[langCode] || anomalyProfile.alertTitle.EN}:
              </strong>
              {anomalyProfile.alertDesc[langCode] || anomalyProfile.alertDesc.EN}
            </div>

            <span className="mono-metric" style={{ fontSize: '0.64rem', color: 'var(--text-dim)' }}>
              {anomalyProfile.alertTime} • MLFLOW ARTIFACT V1
            </span>
          </div>
        </>
      ) : (
        /* ==================================================================== */
        /* LEVEL 2 — RESEARCH MODE (CLEAN QUALITATIVE INTELLIGENCE WORKSPACE)   */
        /* ==================================================================== */
        <>
          {/* 1. EXECUTIVE THESIS BANNER + MULTI-INTENT Q&A SEARCH WITH QUICK CHIPS */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.15rem',
              padding: '0.85rem 1.25rem',
              borderRadius: '20px',
              background:
                researchBrief.stance === 'BULLISH'
                  ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.14) 0%, rgba(13, 19, 33, 0.65) 60%)'
                  : 'linear-gradient(90deg, rgba(244, 63, 94, 0.14) 0%, rgba(13, 19, 33, 0.65) 60%)',
              border:
                researchBrief.stance === 'BULLISH'
                  ? '1px solid rgba(16, 185, 129, 0.35)'
                  : '1px solid rgba(244, 63, 94, 0.35)',
              backdropFilter: 'blur(14px)',
              flexShrink: 0,
            }}
          >
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <span
                  className="mono-metric"
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '0.14rem 0.6rem',
                    borderRadius: '999px',
                    backgroundColor:
                      researchBrief.stance === 'BULLISH'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(244, 63, 94, 0.2)',
                    color: researchBrief.stance === 'BULLISH' ? '#10b981' : '#f43f5e',
                  }}
                >
                  {researchBrief.stanceLabel[langCode] || researchBrief.stanceLabel.EN}
                </span>
                <span className="mono-metric" style={{ fontSize: '0.63rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                  {isES ? 'TESIS EJECUTIVA' : 'EXECUTIVE THESIS'} •{' '}
                  {researchBrief.filingSource[langCode] || researchBrief.filingSource.EN}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#ffffff', lineHeight: 1.52, margin: 0, fontWeight: 500 }}>
                {researchBrief.executiveSummary[langCode] || researchBrief.executiveSummary.EN}
              </p>
            </div>

            {/* Right: Interactive Q&A Input + Topic Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '0 1 420px', minWidth: '320px' }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (ragQuery.trim()) {
                    runAssetRagQuery(ragQuery, 'asset', selectedAsset);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'rgba(8, 12, 22, 0.82)',
                  padding: '0.26rem 0.35rem 0.26rem 0.8rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                }}
              >
                <Search size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder={
                    isES
                      ? `Preguntar sobre ${currentAsset.sym} (ej. márgenes, riesgos, caja, competencia)...`
                      : `Ask ${currentAsset.sym} filing (e.g. margins, risks, cash flow, moat)...`
                  }
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
                {(ragQuery || ragResult) && (
                  <button
                    type="button"
                    onClick={() => {
                      setRagQuery('');
                      setRagResult(null);
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex' }}
                  >
                    <X size={13} />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isRagLoading}
                  className="mono-metric"
                  style={{
                    backgroundColor: '#10b981',
                    color: '#000',
                    border: 'none',
                    padding: '0.22rem 0.72rem',
                    borderRadius: '999px',
                    fontWeight: 800,
                    fontSize: '0.64rem',
                    cursor: 'pointer',
                  }}
                >
                  {isRagLoading ? '...' : isES ? 'PREGUNTAR' : 'ASK'}
                </button>
              </form>

              {/* Guided Topic Chips dynamically adapted by Asset Class (10 categories) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.32rem', flexWrap: 'wrap' }}>
                {getRagQuickTopicsForCategory(currentAsset.cat).map((topic) => {
                  const active = ragQuery === topic.query;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => {
                        setRagQuery(topic.query);
                        runAssetRagQuery(topic.query, 'asset', selectedAsset);
                      }}
                      className="mono-metric"
                      style={{
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        padding: '0.14rem 0.55rem',
                        borderRadius: '999px',
                        border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: active ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255,255,255,0.04)',
                        color: active ? '#10b981' : 'var(--text-dim)',
                        cursor: 'pointer',
                      }}
                    >
                      {topic.label[langCode] || topic.label.EN}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ON-DEMAND FILING ANSWER DRAWER (WITH STRICT GUARDRAIL STATE) */}
          {ragResult && (
            <div
              style={{
                padding: '0.75rem 1.1rem',
                borderRadius: '16px',
                backgroundColor: ragResult.blocked ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.09)',
                border: ragResult.blocked ? '1px solid rgba(244, 63, 94, 0.45)' : '1px solid rgba(16, 185, 129, 0.35)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
                flexShrink: 0,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.22rem' }}>
                  {ragResult.blocked ? (
                    <ShieldAlert size={13} style={{ color: '#f43f5e' }} />
                  ) : (
                    <Sparkles size={13} style={{ color: '#10b981' }} />
                  )}
                  <span
                    className="mono-metric"
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: ragResult.blocked ? '#f43f5e' : '#10b981',
                    }}
                  >
                    {ragResult.topicLabel || (isES ? 'RESPUESTA DEL REPORTE' : 'OFFICIAL FILING ANSWER')}
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#ffffff', margin: 0, lineHeight: 1.5 }}>{ragResult.answer}</p>
              </div>
              <button
                onClick={() => {
                  setRagQuery('');
                  setRagResult(null);
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '0.15rem' }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* 2. MAIN QUALITATIVE WORKSPACE: LEFT = UNIFIED FUNDAMENTAL BALANCE CARD (TOP 5 BULL & TOP 5 BEAR), RIGHT = REAL-TIME NEWS WIRE */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: 'grid',
              gridTemplateColumns: '1.25fr 1fr',
              gap: '1.15rem',
            }}
          >
            {/* LEFT COLUMN: UNIFIED FUNDAMENTAL BALANCE CONTAINER (ENCLOSING TOP 5 BULL & TOP 5 BEAR + TUG-OF-WAR BAR) */}
            <div
              style={{
                borderRadius: '22px',
                backgroundColor: 'rgba(13, 19, 33, 0.56)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.8rem',
                minHeight: 0,
              }}
            >
              {/* Top 2 Sub-Columns: Top 5 Bull Drivers (Green) vs Top 5 Bear Risks (Red) — Signed Integers Only */}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.95rem',
                  overflowY: 'auto',
                  paddingRight: '0.2rem',
                }}
              >
                {/* Bull Case Sub-Column (Latest 5 Weighted Items) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '0.4rem',
                      borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    <span className="mono-metric" style={{ fontSize: '0.66rem', fontWeight: 800, color: '#10b981' }}>
                      {isES ? 'CATALIZADORES ALCISTAS (TOP 5)' : 'GROWTH DRIVERS (TOP 5 BULL)'}
                    </span>
                    <span
                      className="mono-metric"
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.52rem',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(16, 185, 129, 0.18)',
                        color: '#10b981',
                      }}
                    >
                      +{researchBrief.avgBull}
                    </span>
                  </div>

                  {researchBrief.bullDrivers.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.62rem 0.8rem',
                        borderRadius: '14px',
                        backgroundColor:
                          lastUpdatedPart === 'bull' && idx === 0
                            ? 'rgba(16, 185, 129, 0.16)'
                            : 'rgba(16, 185, 129, 0.06)',
                        borderLeft: '3px solid #10b981',
                        transition: 'background-color 0.35s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
                          {item.isLiveUpdate && (
                            <span
                              className="mono-metric"
                              style={{
                                fontSize: '0.5rem',
                                fontWeight: 800,
                                padding: '0.06rem 0.35rem',
                                borderRadius: '999px',
                                backgroundColor: '#10b981',
                                color: '#000',
                                flexShrink: 0,
                              }}
                            >
                              LIVE
                            </span>
                          )}
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                            {item.title[langCode] || item.title.EN}
                          </span>
                        </div>
                        <span className="mono-metric" style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', flexShrink: 0 }}>
                          {item.impactTag}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.44, margin: 0 }}>
                        {item.detail[langCode] || item.detail.EN}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bear Case Sub-Column (Latest 5 Weighted Items) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '0.4rem',
                      borderBottom: '1px solid rgba(244, 63, 94, 0.25)',
                    }}
                  >
                    <span className="mono-metric" style={{ fontSize: '0.66rem', fontWeight: 800, color: '#f43f5e' }}>
                      {isES ? 'FACTORES DE RIESGO (TOP 5)' : 'KEY RISK FACTORS (TOP 5 BEAR)'}
                    </span>
                    <span
                      className="mono-metric"
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.52rem',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(244, 63, 94, 0.18)',
                        color: '#f43f5e',
                      }}
                    >
                      -{researchBrief.avgBear}
                    </span>
                  </div>

                  {researchBrief.bearRisks.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.62rem 0.8rem',
                        borderRadius: '14px',
                        backgroundColor:
                          lastUpdatedPart === 'bear' && idx === 0
                            ? 'rgba(244, 63, 94, 0.16)'
                            : 'rgba(244, 63, 94, 0.06)',
                        borderLeft: '3px solid #f43f5e',
                        transition: 'background-color 0.35s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
                          {item.isLiveUpdate && (
                            <span
                              className="mono-metric"
                              style={{
                                fontSize: '0.5rem',
                                fontWeight: 800,
                                padding: '0.06rem 0.35rem',
                                borderRadius: '999px',
                                backgroundColor: '#f43f5e',
                                color: '#000',
                                flexShrink: 0,
                              }}
                            >
                              LIVE
                            </span>
                          )}
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                            {item.title[langCode] || item.title.EN}
                          </span>
                        </div>
                        <span className="mono-metric" style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f43f5e', flexShrink: 0 }}>
                          {item.impactTag}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.44, margin: 0 }}>
                        {item.detail[langCode] || item.detail.EN}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM ENCLOSING FUNDAMENTAL BALANCE BAR (BULL FORCE vs BEAR FORCE FROM OFFICIAL FILINGS) */}
              <div
                style={{
                  padding: '0.65rem 0.9rem',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(8, 12, 22, 0.72)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.32rem' }}>
                  <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800, color: '#10b981' }}>
                    {isES ? `FUERZA ALCISTA (+${researchBrief.avgBull})` : `BULLISH FORCE (+${researchBrief.avgBull})`}
                  </span>
                  <span className="mono-metric" style={{ fontSize: '0.64rem', fontWeight: 800, color: '#ffffff' }}>
                    {isES ? 'BALANCE NETO FUNDAMENTAL (REPORTES):' : 'NET FUNDAMENTAL BALANCE (FILINGS):'}{' '}
                    <strong style={{ color: researchBrief.filingNet >= 0 ? '#10b981' : '#f43f5e', fontSize: '0.7rem' }}>
                      {researchBrief.filingNetFormatted}
                    </strong>{' '}
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.58rem' }}>
                      ({Math.round(assetSensitivity.fundamentalWeight * 100)}% {isES ? 'peso en activo' : 'asset weight'})
                    </span>
                  </span>
                  <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800, color: '#f43f5e' }}>
                    {isES ? `PRESIÓN DE RIESGO (-${researchBrief.avgBear})` : `RISK PRESSURE (-${researchBrief.avgBear})`}
                  </span>
                </div>

                {/* Tug-of-War Proportional Bar */}
                <div
                  style={{
                    display: 'flex',
                    height: '7px',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    style={{
                      width: `${(researchBrief.avgBull / Math.max(1, researchBrief.avgBull + researchBrief.avgBear)) * 100}%`,
                      backgroundColor: '#10b981',
                      transition: 'width 0.35s ease',
                    }}
                  />
                  <div
                    style={{
                      width: `${(researchBrief.avgBear / Math.max(1, researchBrief.avgBull + researchBrief.avgBear)) * 100}%`,
                      backgroundColor: '#f43f5e',
                      transition: 'width 0.35s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: REAL-TIME INCOMING NEWS WIRE & SENTIMENT ESTIMATION */}
            <div
              style={{
                borderRadius: '22px',
                backgroundColor: 'rgba(13, 19, 33, 0.56)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.55rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      boxShadow: '0 0 8px #10b981',
                      display: 'inline-block',
                    }}
                  />
                  <span className="mono-metric" style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff' }}>
                    {isES ? `TERMINAL DE NOTICIAS EN VIVO (${currentAsset.sym})` : `LIVE NEWS WIRE & IMPACT (${currentAsset.sym})`}
                  </span>
                </div>
                <div className="mono-metric" style={{ display: 'flex', gap: '0.45rem', fontSize: '0.62rem' }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>
                    {assetFinbertPolarity.posCount} {isES ? 'Alcistas' : 'Bullish'}
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>•</span>
                  <span style={{ color: '#f43f5e', fontWeight: 800 }}>
                    {assetFinbertPolarity.negCount} {isES ? 'Bajistas' : 'Bearish'}
                  </span>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {assetFinbertNews.map((news) => {
                  const isPos = news.scoreNum >= 0;
                  const toneColor = isPos ? '#10b981' : '#f43f5e';
                  return (
                    <div
                      key={news.id}
                      style={{
                        padding: '0.72rem 0.9rem',
                        borderRadius: '16px',
                        backgroundColor: news.isNew ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                        border: news.isNew
                          ? `1.5px solid ${toneColor}`
                          : `1px solid ${isPos ? 'rgba(16, 185, 129, 0.22)' : 'rgba(244, 63, 94, 0.22)'}`,
                        transition: 'all 0.35s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {news.isNew && (
                            <span
                              className="mono-metric"
                              style={{
                                fontSize: '0.54rem',
                                fontWeight: 800,
                                padding: '0.08rem 0.42rem',
                                borderRadius: '999px',
                                backgroundColor: toneColor,
                                color: '#000',
                              }}
                            >
                              {isES ? 'NUEVO' : 'JUST IN'}
                            </span>
                          )}
                          <span className="mono-metric" style={{ fontSize: '0.64rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                            {news.source} • {news.time}
                          </span>
                        </div>
                        <span
                          className="mono-metric"
                          style={{
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            color: toneColor,
                            padding: '0.1rem 0.52rem',
                            borderRadius: '999px',
                            backgroundColor: isPos ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                          }}
                        >
                          {news.score} {isPos ? (isES ? 'ALCISTA' : 'BULLISH') : isES ? 'BAJISTA' : 'BEARISH'}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.76rem', color: '#ffffff', margin: '0 0 0.45rem 0', lineHeight: 1.46, fontWeight: 500 }}>
                        {news.title[langCode] || news.title.EN}
                      </p>

                      {/* Clean Bullish vs Bearish Probability Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div
                          style={{
                            flex: 1,
                            display: 'flex',
                            height: '5px',
                            borderRadius: '999px',
                            overflow: 'hidden',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                          }}
                        >
                          <div style={{ width: `${news.probs.pos * 100}%`, backgroundColor: '#10b981' }} />
                          <div style={{ width: `${news.probs.neu * 100}%`, backgroundColor: 'rgba(255,255,255,0.16)' }} />
                          <div style={{ width: `${news.probs.neg * 100}%`, backgroundColor: '#f43f5e' }} />
                        </div>
                        <span className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>
                          <strong style={{ color: '#10b981' }}>{Math.round(news.probs.pos * 100)}% Bull</strong> /{' '}
                          <strong style={{ color: '#f43f5e' }}>{Math.round(news.probs.neg * 100)}% Bear</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
