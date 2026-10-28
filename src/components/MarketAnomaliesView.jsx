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
} from '../services/marketService';
import { getAnomalyProfile, runLiveAnomalyInference } from '../services/anomalyService';
import {
  SEC_10K_CHUNKS,
  FINBERT_HEADLINES,
  LIVE_WIRE_POOL,
  RAG_QUICK_TOPICS,
  IMPORTANCE_WEIGHTS,
  getAssetClassSensitivity,
  getAssetResearchBrief,
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
function RadialRingGauge({ pct = 50, color = '#10b981', label = '', sub = '', size = 54 }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = c - (clamped / 100) * c;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
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
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--text-main)',
          }}
        >
          {label}
        </div>
      </div>
      {sub && (
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-main)' }}>{sub}</div>
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
  const [visualMode, setVisualMode] = useState('table');
  const [activeMetric, setActiveMetric] = useState('anomaly');
  const [hoveredAsset, setHoveredAsset] = useState('SOL');
  const [assetSearch, setAssetSearch] = useState('');
  const [l1SelectedIndex, setL1SelectedIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('rank');
  const [sortAsc, setSortAsc] = useState(true);

  // Level 2 (Horizon Editorial) states
  const [l2Section, setL2Section] = useState('analytics'); // 'analytics' | 'research'
  const [timeframe, setTimeframe] = useState('1D');
  const [l2TickerQuery, setL2TickerQuery] = useState('');
  const [l2SearchOpen, setL2SearchOpen] = useState(false);
  const [l2SelectedIndex, setL2SelectedIndex] = useState(0);
  // Active analysis lens: 'technical' | 'compare' | 'microstructure' | 'derivatives'
  const [analysisLens, setAnalysisLens] = useState('technical');
  const [showSma20, setShowSma20] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVwap, setShowVwap] = useState(false);
  const [showSubChart, setShowSubChart] = useState('vol'); // 'none' | 'vol' | 'zscore'
  const [compareSymbol, setCompareSymbol] = useState(null); // e.g. 'ETH', 'SPY', null
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

  // 1. Filter by Asset Category
  const categoryFilteredCatalog = useMemo(() => {
    if (categoryFilter === 'ALL') return enrichedCatalog;
    return enrichedCatalog.filter((a) => a.cat === categoryFilter);
  }, [enrichedCatalog, categoryFilter]);

  // 2. Aggregated Level 1 Pulse Metrics
  const pulseMetrics = useMemo(() => {
    const source = categoryFilteredCatalog.length > 0 ? categoryFilteredCatalog : enrichedCatalog;
    const totalVol = source.reduce((acc, a) => acc + a.vol24hNum, 0);
    const avgRsi = source.reduce((acc, a) => acc + a.indicators.rsi14, 0) / source.length;
    const normalCount = source.filter((a) => a.regime === 'NORMAL').length;
    const elevatedCount = source.filter((a) => a.regime === 'ELEVATED').length;
    const dislocatedAssets = source.filter((a) => a.regime === 'DISLOCATION');
    const topDislocations = [...source]
      .sort((a, b) => b.volumeZNum - a.volumeZNum)
      .slice(0, 3);

    return {
      totalCount: source.length,
      totalVolFormatted: `$${totalVol.toFixed(2)}B`,
      avgRsi: avgRsi.toFixed(1),
      avgRsiNum: avgRsi,
      normalCount,
      elevatedCount,
      dislocatedAssets,
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

  const handleOpenAssetDetail = (sym) => {
    onSelectAsset(sym);
    setViewMode('detail');
  };

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
    }
  }, [selectedAsset, viewMode]);

  const assetSensitivity = useMemo(
    () => getAssetClassSensitivity(currentAsset.cat),
    [currentAsset.cat]
  );

  // Function to push a new incoming wire headline to the top of the stream and update Top-5 Bull/Bear when warranted
  const pushIncomingWireHeadline = () => {
    const pool = LIVE_WIRE_POOL[selectedAsset] || LIVE_WIRE_POOL.BTC;
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
    const pool = LIVE_WIRE_POOL[selectedAsset] || LIVE_WIRE_POOL.BTC;
    if (viewMode !== 'detail' || l2Section !== 'research' || wireCursor >= pool.length) return undefined;
    const timer = setInterval(() => {
      pushIncomingWireHeadline();
    }, 18000);
    return () => clearInterval(timer);
  }, [viewMode, l2Section, selectedAsset, wireCursor]);

  // P-04 & P-08 FinBERT headlines for Level 2 Research (Latest 5 headlines, Live wire prepended at the top)
  const assetFinbertNews = useMemo(() => {
    const direct = FINBERT_HEADLINES.filter((h) => h.sym === selectedAsset);
    const baseList = direct.length > 0 ? direct : FINBERT_HEADLINES;
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

    // For Orbital: keep fixed angular vector order by catalog `rank`
    const orbitalItems = [...screenerRows].sort((a, b) => a.rank - b.rank);

    // For Heatmap: strictly sort descending by the active indicator's `sortMagnitude`
    const heatmapItems = [...screenerRows].sort(
      (a, b) =>
        evaluateHistoricalMetric(b, activeMetric, isES).sortMagnitude -
        evaluateHistoricalMetric(a, activeMetric, isES).sortMagnitude
    );

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
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div />

          {/* CENTER: ASSET CATEGORY FILTER PILLS */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'rgba(13, 19, 33, 0.62)',
              backdropFilter: 'blur(12px)',
              padding: '0.24rem',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              gap: '0.25rem',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
            }}
          >
            {[
              { id: 'ALL', label: isES ? 'Todos' : 'All' },
              { id: 'CRYPTO', label: 'Crypto' },
              { id: 'EQUITY', label: isES ? 'Acciones' : 'Equities' },
              { id: 'INDEX', label: isES ? 'Índices' : 'Indices' },
            ].map((tab) => {
              const active = categoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: active ? 700 : 600,
                    padding: '0.3rem 1.05rem',
                    borderRadius: '999px',
                    border: active ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                    backgroundColor: active ? 'rgba(16, 185, 129, 0.16)' : 'transparent',
                    color: active ? '#ffffff' : 'var(--text-dim)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div />
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
            }}
          >
            <RadialRingGauge
              pct={(pulseMetrics.normalCount / pulseMetrics.totalCount) * 100}
              color="#10b981"
              label={`${pulseMetrics.normalCount}/${pulseMetrics.totalCount}`}
              sub={isES ? 'Régimen Normal' : 'Normal Regime'}
            />
            <span
              onClick={() => handleOpenAssetDetail('SOL')}
              className="mono-metric"
              style={{
                fontSize: '0.66rem',
                fontWeight: 700,
                padding: '0.22rem 0.55rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(244, 63, 94, 0.16)',
                color: '#f43f5e',
                cursor: 'pointer',
              }}
            >
              SOL 0.659 ↗
            </span>
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
          {/* Left: View Mode Switcher (Table / Orbital / Heatmap) */}
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

          {/* Right: Indicator Driver Selector (Appears when user selects Orbital or Heatmap) */}
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
                  <th onClick={() => handleSort('zscore')} style={{ padding: '0.45rem 0.85rem', cursor: 'pointer' }}>
                    Vol Z-Score (20d) ↕
                  </th>
                  <th onClick={() => handleSort('rvol')} style={{ padding: '0.45rem 0.85rem', cursor: 'pointer' }}>
                    {isES ? 'Vol. Realizada' : 'Realized Vol'} ↕
                  </th>
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
                          padding: '0.75rem 0.75rem',
                          textAlign: 'center',
                          color: 'var(--text-dim)',
                        }}
                      >
                        {row.rank}
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

                      {/* VOL Z-SCORE */}
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

                      {/* REALIZED VOL */}
                      <td className="mono-metric" style={{ ...cellBase, padding: '0.75rem 0.85rem', color: 'var(--text-muted)' }}>
                        {row.realizedVol}
                      </td>

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
          <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            {currentAsset.name} • {currentAsset.pair} • {currentAsset.cat}
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
          <div className="mono-metric" style={{ display: 'flex', gap: '1.65rem', fontSize: '0.74rem', flexWrap: 'wrap' }}>
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
              <div style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>VOL Z-SCORE (20D)</div>
              <div style={{ fontWeight: 800, color: currentEnriched.volumeZNum >= 0 ? '#10b981' : '#f43f5e', marginTop: '0.14rem' }}>
                {currentEnriched.volumeZScore}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>REALIZED VOL (30D)</div>
              <div style={{ fontWeight: 800, color: '#fff', marginTop: '0.14rem' }}>{anomalyProfile.realizedVol}</div>
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
                    currentAsset.cat === 'CRYPTO'
                      ? isES
                        ? 'Perpetuos & Volatilidad (Roadmap)'
                        : 'Perp Funding & Vol Smile (Roadmap)'
                      : isES
                      ? 'Superficie Opciones IV (Roadmap)'
                      : 'Options IV Surface (Roadmap)',
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
                <>
                  <span className="mono-metric" style={{ fontSize: '0.63rem', color: 'var(--text-dim)', marginRight: '0.2rem' }}>
                    {isES ? 'COMPARAR CONTRA:' : 'BENCHMARK VS:'}
                  </span>
                  {enrichedCatalog
                    .filter((a) => a.sym !== selectedAsset)
                    .map((peer) => {
                      const active = compareSymbol === peer.sym;
                      return (
                        <button
                          key={peer.sym}
                          onClick={() => setCompareSymbol(active ? null : peer.sym)}
                          className="mono-metric"
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            border: active ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                            backgroundColor: active ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
                            color: active ? '#38bdf8' : 'var(--text-dim)',
                            cursor: 'pointer',
                          }}
                        >
                          {peer.sym}
                        </button>
                      );
                    })}
                </>
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

              {analysisLens === 'derivatives' && (
                <span className="mono-metric" style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
                  {currentAsset.cat === 'CRYPTO'
                    ? isES
                      ? 'Módulo planificado en UI_SPEC.md: Curva de Funding Rate, Open Interest Basis y Vol Smile'
                      : 'Planned in UI_SPEC.md: Perp Funding Curve, Open Interest Basis & Implied Vol Smile'
                    : isES
                    ? 'Módulo planificado en UI_SPEC.md: Sonrisa / Superficie de Volatilidad Implícita (IV) y Skew 25Δ'
                    : 'Planned in UI_SPEC.md: Options Implied Volatility Smile / 3D Surface & 25Δ Put-Call Skew'}
                </span>
              )}
            </div>
          </div>

          {/* 2.4 OPEN BORDERLESS STARFIELD CHART WORKSPACE */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '0.25rem 0' }}>
            <div style={{ flex: showSubChart === 'none' ? 1 : 0.74, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
                    hide={showSubChart !== 'none'}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    stroke="var(--text-dim)"
                    fontSize={11}
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => (isCompareMode ? `${v}%` : v)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 15, 28, 0.92)',
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      fontSize: '0.73rem',
                    }}
                  />

                  {/* Primary Series (Price or Normalized % Return when comparing) */}
                  <Area
                    type="monotone"
                    dataKey={isCompareMode ? 'pctReturn' : 'price'}
                    name={isCompareMode ? `${currentAsset.sym} (%)` : currentAsset.sym}
                    stroke={assetMainColor}
                    strokeWidth={2.5}
                    fill={isCompareMode ? 'transparent' : 'url(#feyMainGrad)'}
                  />

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
                  {!isCompareMode && showSma20 && (
                    <Line type="monotone" dataKey="sma20" name="SMA (20)" stroke="#38bdf8" strokeWidth={1.6} strokeDasharray="4 4" dot={false} />
                  )}
                  {!isCompareMode && showVwap && (
                    <Line type="monotone" dataKey="vwap" name="VWAP" stroke="#f59e0b" strokeWidth={1.6} dot={false} />
                  )}
                  {!isCompareMode && showBollinger && (
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
                  <BarChart data={chartData}>
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
                      name={showSubChart === 'zscore' ? 'Vol Z-Score (σ)' : 'Volume'}
                      fill={assetMainColor}
                      opacity={0.48}
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

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

              {/* Guided Topic Chips so user can test distinct answers in 1 click */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.32rem', flexWrap: 'wrap' }}>
                {RAG_QUICK_TOPICS.map((topic) => {
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
