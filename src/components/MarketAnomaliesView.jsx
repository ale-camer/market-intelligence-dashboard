import { tx, txList, txTpl, useViewLocale } from '../data/i18n/viewLocaleService';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import HoverTooltip from './HoverTooltip';
import {
  exportToCsv,
  exportSnapshotToPng,
  getExportDateStamp,
  ExportFormatButton,
} from '../utils/exportService';
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
  fetchLiveAssetSeries,
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
  fetchLiveAssetNews,
  executeSec10kRagQuery,
} from '../services/filingsAndNewsService';
import { getCommitteeDeliberation } from '../services/committeeService';

/**
 * Industry-standard Finviz / TradingView 8-shade strictly Green & Red palette.
 * Rule: GREEN = Positive / Above historical baseline, RED = Negative / Below historical baseline.
 * Intensity (1..4) scales with how strong the positive or negative deviation is against historical limits.
 */
const GREEN_SHADES = {
  1: { stroke: 'var(--pos-text, #6ee7b7)', text: 'var(--pos-text-soft, #a7f3d0)', bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(11, 22, 24, 0.85) 100%)', glow: 'rgba(16, 185, 129, 0.25)' },
  2: { stroke: 'var(--pos-text, #34d399)', text: 'var(--pos-text, #6ee7b7)', bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.28) 0%, rgba(9, 28, 26, 0.88) 100%)', glow: 'rgba(16, 185, 129, 0.38)' },
  3: { stroke: 'var(--accent, #10b981)', text: 'var(--pos-text, #34d399)', bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.44) 0%, rgba(6, 36, 30, 0.90) 100%)', glow: 'rgba(16, 185, 129, 0.54)' },
  4: { stroke: '#059669', text: '#ecfdf5', bg: 'linear-gradient(135deg, rgba(5, 150, 105, 0.65) 0%, rgba(6, 48, 38, 0.94) 100%)', glow: 'rgba(16, 185, 129, 0.72)' },
};

const RED_SHADES = {
  1: { stroke: 'var(--neg-text, #fda4af)', text: 'var(--neg-text-soft, #fecdd3)', bg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.16) 0%, rgba(26, 13, 20, 0.85) 100%)', glow: 'rgba(244, 63, 94, 0.25)' },
  2: { stroke: 'var(--neg-text, #fb7185)', text: 'var(--neg-text, #fda4af)', bg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.28) 0%, rgba(34, 12, 22, 0.88) 100%)', glow: 'rgba(244, 63, 94, 0.38)' },
  3: { stroke: 'var(--danger, #f43f5e)', text: 'var(--neg-text, #fb7185)', bg: 'linear-gradient(135deg, rgba(225, 29, 72, 0.44) 0%, rgba(45, 10, 22, 0.90) 100%)', glow: 'rgba(244, 63, 94, 0.54)' },
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
      label: tx('Volumen 24h ($)', '24h Volume ($)'),
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
      label: tx('Vol. Realizada (30d)', 'Realized Vol (30d)'),
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

// Radial SVG Gauge for Top Aggregated Pulse Cards (Unclipped Directional Shadow)
function RadialRingGauge({ pct = 50, color = 'var(--accent, #10b981)', label = '', sub = '', detail = null, size = 54 }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = c - (clamped / 100) * c;
  const center = size / 2;
  const filterId = `ringShadow-${String(label).replace(/[^a-zA-Z0-9]/g, '')}-${String(color).replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible', display: 'block' }}>
          <defs>
            <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor={color} floodOpacity="0.58" />
            </filter>
          </defs>
          <circle
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="4.5"
          />
          <g filter={`url(#${filterId})`}>
            <circle
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${center} ${center})`}
            />
          </g>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.14rem', minWidth: 0 }}>
          {sub && (
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {sub}
            </div>
          )}
          {detail && (
            <div style={{ fontSize: '0.61rem', color: 'var(--text-dim)', lineHeight: 1.25, whiteSpace: 'nowrap' }}>
              {detail}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Standardized Standalone Trajectory AreaChart (identical format to Level 1 '24h Aggregate Volume')
function MiniSparkline({ sym, timeframe = '5M', isPos, color, width = 94, height = 36, version = 0 }) {
  const series = useMemo(() => getAssetSeries(sym, timeframe), [sym, timeframe, version]);
  const strokeColor = color || (isPos ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)');
  const gradId = `sparkGrad-${sym.replace(/[^a-zA-Z0-9_-]/g, '')}-${timeframe}-${width}x${height}`;

  return (
    <div style={{ width: `${width}px`, height: `${height}px`, flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 3, right: 2, left: 2, bottom: 3 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.45} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Area
            type="linear"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function MarketAnomaliesView({
  selectedAsset,
  onSelectAsset,
  initialViewMode = 'screener',
  onViewModeChange,
  watchlistSyms = [],
  onToggleWatchlist,
  marketsToolsMode = 'v4-tab',
  mainToolsStyleId = 'mt-01',
  onLaunchTarget,
  langCode = 'EN',
  t,
  previewConfig = null,
}) {
  const [viewMode, setViewModeState] = useState(initialViewMode || 'screener');
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [orbitalLimit, setOrbitalLimit] = useState(20);
  const [previewToolId, setPreviewToolId] = useState('sovereign-curve');
  const [selectedToolPresetIdx, setSelectedToolPresetIdx] = useState(0);
  const [toolPreviewSym, setToolPreviewSym] = useState('US10Y');
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [toolSearchOpen, setToolSearchOpen] = useState(false);
  const [toolSearchIdx, setToolSearchIdx] = useState(0);
  const [l1VisualSearchOpen, setL1VisualSearchOpen] = useState(false);
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
  // Left Quant Rail Searchable Combobox states (Asset / Country / FX CCY / Commodity)
  const [railSearchQuery, setRailSearchQuery] = useState('');
  const [railSearchOpen, setRailSearchOpen] = useState(false);
  const [railSearchIdx, setRailSearchIdx] = useState(0);
  const [fxQuoteQuery, setFxQuoteQuery] = useState('');
  const [fxQuoteOpen, setFxQuoteOpen] = useState(false);
  const [fxQuoteIdx, setFxQuoteIdx] = useState(0);
  const [liveInference, setLiveInference] = useState(null);
  const [isScoring, setIsScoring] = useState(false);

  // Level 2 Research (P-04, P-07, P-08, P-09) states + Live Incoming Wire + Vertical Chat & Accordion
  const [ragQuery, setRagQuery] = useState('');
  const [ragResult, setRagResult] = useState(null);
  const [isRagLoading, setIsRagLoading] = useState(false);
  const [researchScope, setResearchScope] = useState('asset'); // 'asset' (current ticker) | 'all' (cross-market)
  const [liveWireItems, setLiveWireItems] = useState([]);
  const [wireCursor, setWireCursor] = useState(0);
  const [liveBullUpdates, setLiveBullUpdates] = useState([]);
  const [liveBearUpdates, setLiveBearUpdates] = useState([]);
  const [lastUpdatedPart, setLastUpdatedPart] = useState(null); // 'bull' | 'bear' | null
  const [researchChatHistory, setResearchChatHistory] = useState([]);
  const [researchFactorFilter, setResearchFactorFilter] = useState('all'); // 'all' | 'bull' | 'bear' | 'twin'
  const [researchExpandedKey, setResearchExpandedKey] = useState('');
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);
  const [newsRefreshTick, setNewsRefreshTick] = useState(0);

  const { localeTick } = useViewLocale(langCode);
  const isES = `${langCode}_${localeTick}`;

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

  // 1. Filter by Asset Category or User Watchlist + Second-Row Trait Filter + Multi-Select Equity Industries (Phase 4)
  const [traitFilter, setTraitFilter] = useState('ALL');
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [industryMenuOpen, setIndustryMenuOpen] = useState(false);
  const industryMenuRef = useRef(null);

  useEffect(() => {
    if (!industryMenuOpen) return undefined;
    const handlePointerDownOutside = (e) => {
      if (industryMenuRef.current && !industryMenuRef.current.contains(e.target)) {
        setIndustryMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [industryMenuOpen]);

  const EQUITY_INDUSTRIES = useMemo(
    () => [
      {
        id: 'SEMI_AI',
        label: tx('Semiconductores & Hardware IA', 'Semiconductors & AI Hardware'),
        syms: ['NVDA', 'AMD', 'AVGO', 'MU', 'QCOM', 'INTC', 'AMAT', 'AAPL'],
      },
      {
        id: 'SOFTWARE_CLOUD',
        label: tx('Software, Cloud & Ciberseguridad', 'Software, Cloud & Cyber'),
        syms: ['MSFT', 'PLTR', 'ORCL', 'CRM', 'PANW'],
      },
      {
        id: 'INTERNET_MEDIA',
        label: tx('Internet, Media & E-Commerce', 'Internet, Media & E-Commerce'),
        syms: ['AMZN', 'GOOGL', 'META', 'NFLX'],
      },
      {
        id: 'FINANCE_PAYMENTS',
        label: tx('Banca, Pagos & Finanzas', 'Banking, Payments & Finance'),
        syms: ['BRK.B', 'JPM', 'V', 'MA', 'GS', 'BAC'],
      },
      {
        id: 'HEALTH_PHARMA',
        label: tx('Salud, Pharma & MedTech', 'Healthcare, Pharma & MedTech'),
        syms: ['LLY', 'UNH', 'ISRG'],
      },
      {
        id: 'CONSUMER_RETAIL',
        label: tx('Consumo, Automotriz & Retail', 'Consumer, Auto & Retail'),
        syms: ['TSLA', 'COST', 'WMT', 'HD', 'PG'],
      },
      {
        id: 'ENERGY_OIL',
        label: tx('Energía, Petróleo & Gas', 'Energy, Oil & Gas'),
        syms: ['XOM', 'CVX'],
      },
    ],
    [isES]
  );

  const toggleIndustrySelection = (indId) => {
    setSelectedIndustries((prev) =>
      prev.includes(indId) ? prev.filter((id) => id !== indId) : [...prev, indId]
    );
  };

  const GENERAL_TRAIT_FILTERS = useMemo(
    () => [
      { id: 'ALL', label: tx('Todos', 'All'), match: () => true },
      { id: 'UP_TODAY', label: tx('Suben Hoy (>0%)', 'Up Today (>0%)'), match: (a) => a.chgNum > 0 },
      { id: 'DOWN_TODAY', label: tx('Bajan Hoy (<0%)', 'Down Today (<0%)'), match: (a) => a.chgNum < 0 },
      {
        id: 'RSI_BULL',
        label: tx('Impulso Comprador (RSI > 60)', 'Bull Momentum (RSI > 60)'),
        match: (a) => (a.indicators?.rsi14 ?? 50) >= 58,
      },
      {
        id: 'RSI_OVERSOLD',
        label: tx('Sobreventa (RSI < 40)', 'Oversold (RSI < 40)'),
        match: (a) => (a.indicators?.rsi14 ?? 50) <= 49,
      },
      {
        id: 'VOL_UNUSUAL',
        label: tx('Volumen Inusual (Z > 1.5σ)', 'Unusual Volume (Z > 1.5σ)'),
        match: (a) => a.volumeZNum >= 1.2,
      },
      {
        id: 'NORMAL_P06',
        label: tx('Movimiento Normal (P-06)', 'Normal Move (P-06)'),
        match: (a) => a.regime === 'NORMAL',
      },
      {
        id: 'ATYPICAL_P06',
        label: tx('Atípico / Anomalía (P-06)', 'Atypical / Anomaly (P-06)'),
        match: (a) => a.regime !== 'NORMAL' || a.anomalyScore >= 0.35,
      },
    ],
    [isES]
  );

  const CATEGORY_SPECIFIC_TRAITS = useMemo(
    () => ({
      EQUITY: [
        {
          id: 'EQ_TECH',
          label: tx('Mega-Cap & Tech', 'Mega-Cap & Tech'),
          match: (a) =>
            [
              'NVDA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'META',
              'AMD', 'AVGO', 'PLTR', 'NFLX', 'MU', 'ORCL', 'CRM', 'QCOM',
              'INTC', 'AMAT', 'PANW',
            ].includes(a.sym),
        },
        {
          id: 'EQ_FIN_IND',
          label: tx('Finanzas & Industria', 'Finance & Industrials'),
          match: (a) => ['BRK.B', 'JPM', 'V', 'MA', 'GS', 'BAC', 'XOM', 'CVX'].includes(a.sym),
        },
        {
          id: 'EQ_CONS_HEALTH',
          label: tx('Consumo & Salud', 'Consumer & Healthcare'),
          match: (a) => ['LLY', 'COST', 'UNH', 'WMT', 'HD', 'PG', 'ISRG'].includes(a.sym),
        },
        {
          id: 'EQ_GLOBAL',
          label: tx('ADRs & Global', 'ADRs & Global'),
          match: (a) => ['NVDA', 'AVGO', 'AMD', 'MU', 'QCOM', 'INTC', 'AMAT', 'ORCL', 'PANW'].includes(a.sym),
        },
      ],
      FX: [
        {
          id: 'FX_G10',
          label: tx('G10 Majors', 'G10 Majors'),
          match: (a) =>
            ['DXY', 'EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'USD/SEK', 'USD/NOK'].includes(a.sym),
        },
        {
          id: 'FX_EM_LATAM',
          label: tx('Emergentes & LatAm', 'Emerging & LatAm'),
          match: (a) =>
            ['USD/MXN', 'USD/BRL', 'USD/ARS', 'USD/CLP', 'USD/COP', 'USD/ZAR', 'USD/TRY', 'USD/PLN'].includes(a.sym),
        },
        {
          id: 'FX_ASIA',
          label: tx('Divisas Asiáticas', 'Asian Currencies'),
          match: (a) => ['USD/CNH', 'USD/JPY', 'USD/INR', 'USD/SGD', 'USD/KRW'].includes(a.sym),
        },
      ],
      RATES: [
        {
          id: 'RATES_SHORT',
          label: tx('Corto Plazo (≤2Y)', 'Short Term (≤2Y)'),
          match: (a) => ['US2Y'].includes(a.sym),
        },
        {
          id: 'RATES_MID',
          label: tx('Tramo Medio (5Y–10Y)', 'Mid Curve (5Y–10Y)'),
          match: (a) => !['US2Y', 'US30Y'].includes(a.sym),
        },
        {
          id: 'RATES_LONG',
          label: tx('Largo Plazo (20Y–30Y)', 'Long End (20Y–30Y)'),
          match: (a) => ['US30Y'].includes(a.sym),
        },
      ],
      FIXED_INCOME: [
        {
          id: 'FI_SHORT',
          label: tx('Corto Plazo (≤2Y)', 'Short Term (≤2Y)'),
          match: (a) => ['UST-2Y', 'UST-3Y'].includes(a.sym),
        },
        {
          id: 'FI_MID',
          label: tx('Tramo Medio (5Y–10Y)', 'Mid Curve (5Y–10Y)'),
          match: (a) => ['UST-5Y', 'UST-7Y', 'UST-10Y', 'UST-5Y-TIPS', 'UST-10Y-TIPS'].includes(a.sym),
        },
        {
          id: 'FI_LONG',
          label: tx('Largo Plazo (20Y–30Y)', 'Long End (20Y–30Y)'),
          match: (a) => ['UST-20Y', 'UST-30Y'].includes(a.sym),
        },
      ],
      CRYPTO: [
        {
          id: 'CRYPTO_MAJORS',
          label: tx('Layer 1 Majors (BTC/ETH/SOL)', 'Layer 1 Majors (BTC/ETH/SOL)'),
          match: (a) => ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA'].includes(a.sym),
        },
        {
          id: 'CRYPTO_DEFI',
          label: tx('DeFi & Infraestructura', 'DeFi & Infrastructure'),
          match: (a) => ['LINK', 'UNI', 'AAVE', 'DOT', 'NEAR', 'AVAX', 'SUI', 'TRX'].includes(a.sym),
        },
        {
          id: 'CRYPTO_HIGH_VOL',
          label: tx('Alta Volatilidad', 'High Volatility'),
          match: (a) => ['SOL', 'DOGE', 'SUI', 'AVAX', 'AAVE', 'NEAR'].includes(a.sym),
        },
      ],
      COMMODITY: [
        {
          id: 'COMM_PRECIOUS',
          label: tx('Metales Preciosos', 'Precious Metals'),
          match: (a) => ['GC', 'SI', 'PL', 'PA'].includes(a.sym),
        },
        {
          id: 'COMM_ENERGY',
          label: tx('Energía (Petróleo/Gas)', 'Energy (Crude/NatGas)'),
          match: (a) => ['CL', 'BZ', 'NG', 'TTF', 'RB', 'HO', 'UX'].includes(a.sym),
        },
        {
          id: 'COMM_IND_AGRO',
          label: tx('Industriales & Agro', 'Industrials & Agriculture'),
          match: (a) =>
            ['HG', 'ALI', 'NICKEL', 'ZINC', 'LITH', 'TIO', 'ZS', 'ZC', 'ZW', 'ZM', 'ZL', 'KC', 'CC', 'SB', 'CT'].includes(a.sym),
        },
      ],
      INDEX: [
        {
          id: 'IDX_BROAD',
          label: tx('Índices Amplios (SPX/NDX)', 'Broad Indices (SPX/NDX)'),
          match: (a) => ['SPX', 'NDX', 'DJI', 'RUT', 'SX5E', 'DAX', 'UKX', 'NKY', 'TPX'].includes(a.sym),
        },
        {
          id: 'IDX_SECTOR',
          label: tx('Sectoriales & Temáticos', 'Sector & Thematic'),
          match: (a) => ['SOX', 'NYFANG', 'TWII', 'KOSPI'].includes(a.sym),
        },
        {
          id: 'IDX_EM',
          label: tx('Emergentes & Regionales', 'Emerging & Regional'),
          match: (a) => ['HSI', 'SHCOMP', 'CSI300', 'AS51', 'NIFTY', 'IBOV', 'MEXBOL', 'MERVAL', 'CAC', 'SMI', 'IBEX', 'FTSEMIB'].includes(a.sym),
        },
      ],
      ETF: [
        {
          id: 'ETF_BROAD',
          label: tx('Índices Amplios (SPX/NDX)', 'Broad Indices (SPX/NDX)'),
          match: (a) => ['SPY', 'QQQ', 'IWM', 'VOO', 'IVV', 'VTI', 'DIA', 'RSP', 'EEM', 'FXI', 'EWJ', 'EWZ'].includes(a.sym),
        },
        {
          id: 'ETF_SECTOR',
          label: tx('Sectoriales & Temáticos', 'Sector & Thematic'),
          match: (a) =>
            ['SMH', 'SOXX', 'XLK', 'XLF', 'XLE', 'XLV', 'XLI', 'XLY', 'XLP', 'XLU', 'XLC', 'XLB', 'XLRE', 'ARKK'].includes(a.sym),
        },
        {
          id: 'ETF_FI_VOL',
          label: tx('Renta Fija & Volatilidad', 'Fixed Income & Volatility'),
          match: (a) => ['TLT', 'HYG', 'LQD', 'IEF', 'SHY', 'GLD', 'SLV', 'USO'].includes(a.sym),
        },
      ],
      DERIVATIVES_VOL: [
        {
          id: 'DERIV_BROAD',
          label: tx('Índices Amplios (SPX/NDX)', 'Broad Indices (SPX/NDX)'),
          match: (a) => ['VIX', 'VXN', 'ES', 'NQ', 'SPY-OPT', 'QQQ-OPT'].includes(a.sym),
        },
        {
          id: 'DERIV_SECTOR',
          label: tx('Sectoriales & Temáticos', 'Sector & Thematic'),
          match: (a) => ['NVDA-OPT', 'TSLA-OPT', 'AAPL-OPT', 'AMD-OPT', 'GVZ', 'OVX'].includes(a.sym),
        },
        {
          id: 'DERIV_FI_VOL',
          label: tx('Renta Fija & Volatilidad', 'Fixed Income & Volatility'),
          match: (a) => ['MOVE', 'V2X', 'ZN', 'ZB', 'SR3'].includes(a.sym),
        },
      ],
      CASH: [
        {
          id: 'CASH_OVERNIGHT',
          label: tx('Overnight (SOFR/EFFR)', 'Overnight (SOFR/EFFR)'),
          match: (a) => ['SOFR', 'EFFR', 'ESTR', 'SONIA', 'TONAR', 'FED-RRP'].includes(a.sym),
        },
        {
          id: 'CASH_TBILLS',
          label: tx('Corto Plazo (T-Bills)', 'Short-Term (T-Bills)'),
          match: (a) => ['UST-1M-BILL', 'UST-3M-BILL', 'UST-6M-BILL', 'SGOV', 'BIL'].includes(a.sym),
        },
        {
          id: 'CASH_PEGS',
          label: tx('Liquidez Digital (USD)', 'Digital Liquidity (USD)'),
          match: (a) => ['USDT', 'USDC'].includes(a.sym),
        },
      ],
    }),
    [isES]
  );

  const activeCategoryTraits = useMemo(
    () => CATEGORY_SPECIFIC_TRAITS[categoryFilter] || [],
    [CATEGORY_SPECIFIC_TRAITS, categoryFilter]
  );

  const availableTraitFilters = useMemo(
    () => [...GENERAL_TRAIT_FILTERS, ...activeCategoryTraits],
    [GENERAL_TRAIT_FILTERS, activeCategoryTraits]
  );

  useEffect(() => {
    if (!availableTraitFilters.some((tf) => tf.id === traitFilter)) {
      setTraitFilter('ALL');
    }
    if (categoryFilter !== 'EQUITY') {
      setIndustryMenuOpen(false);
    }
  }, [categoryFilter, availableTraitFilters, traitFilter]);

  const categoryFilteredCatalog = useMemo(() => {
    let base = enrichedCatalog;
    if (categoryFilter === 'WATCHLIST') {
      base = enrichedCatalog.filter((a) => watchlistSyms.includes(a.sym));
    } else if (categoryFilter !== 'ALL') {
      base = enrichedCatalog.filter((a) => a.cat === categoryFilter);
    }
    if (categoryFilter === 'EQUITY' && selectedIndustries.length > 0) {
      const allowedSyms = new Set();
      EQUITY_INDUSTRIES.forEach((ind) => {
        if (selectedIndustries.includes(ind.id)) {
          ind.syms.forEach((s) => allowedSyms.add(s));
        }
      });
      base = base.filter((a) => allowedSyms.has(a.sym));
    }
    const activeTraitObj = availableTraitFilters.find((tf) => tf.id === traitFilter);
    if (activeTraitObj && activeTraitObj.id !== 'ALL') {
      return base.filter(activeTraitObj.match);
    }
    return base;
  }, [
    enrichedCatalog,
    categoryFilter,
    watchlistSyms,
    availableTraitFilters,
    traitFilter,
    selectedIndustries,
    EQUITY_INDUSTRIES,
  ]);

  // 2. Aggregated Level 1 Pulse Metrics (dynamic per active asset class)
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

    // Dynamic 24h Volume Change % and 14-point Volume Time Series per category
    const weightedChgSum = source.reduce(
      (acc, a) => acc + (a.chgNum * 1.15 + a.volumeZNum * 3.1) * Math.max(a.vol24hNum, 0.5),
      0
    );
    const weightDenom = source.reduce((acc, a) => acc + Math.max(a.vol24hNum, 0.5), 0) || 1;
    const volChgNum = categoryFilter === 'ALL' ? 8.42 : weightedChgSum / weightDenom;
    const isVolPos = volChgNum >= 0;
    const volChgFormatted = `${isVolPos ? '+' : ''}${volChgNum.toFixed(2)}%`;

    const seed = source.reduce((acc, a, idx) => acc + a.rank * (idx + 1) + a.vol24hNum * 0.7, 0);
    const volSparkline =
      categoryFilter === 'ALL'
        ? GLOBAL_VOLUME_SPARKLINE
        : Array.from({ length: 14 }, (_, idx) => {
            const progress = idx / 13;
            const wave1 = Math.sin(idx * 0.75 + seed * 0.13) * 14;
            const wave2 = Math.cos(idx * 1.35 + seed * 0.29) * 9;
            const trend = (progress - 0.5) * volChgNum * 2.2;
            const val = Math.max(12, Math.round(65 + wave1 + wave2 + trend));
            return { t: `${idx * 2}h`, v: val };
          });

    return {
      totalCount: source.length,
      totalVolFormatted: totalVol >= 1000 ? `$${(totalVol / 1000).toFixed(2)}T` : `$${totalVol.toFixed(2)}B`,
      volChgNum,
      volChgFormatted,
      isVolPos,
      volSparkline,
      avgRsi: avgRsi.toFixed(1),
      avgRsiNum: avgRsi,
      normalCount,
      normalPct,
      elevatedCount,
      dislocatedAssets,
      topAnomaly,
      topDislocations,
    };
  }, [categoryFilteredCatalog, enrichedCatalog, categoryFilter]);

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

  const syncTickerDependentToolState = (sym, opts = {}) => {
    const assetObj = getAssetBySymbol(sym);
    onSelectAsset(assetObj.sym);
    if (opts.country && SOVEREIGN_YIELD_CURVES[opts.country]) {
      setSelectedCurveCountry(opts.country);
    } else if (assetObj.countryCode && SOVEREIGN_YIELD_CURVES[assetObj.countryCode]) {
      setSelectedCurveCountry(assetObj.countryCode);
    }
    if (opts.fxBase && opts.fxQuote) {
      setFxBaseCcy(opts.fxBase);
      setFxQuoteCcy(opts.fxQuote);
    } else if (assetObj.cat === 'FX' && assetObj.sym.includes('/')) {
      const [b, q] = assetObj.sym.split('/');
      if (WORLD_USD_RATES[b]) setFxBaseCcy(b);
      if (WORLD_USD_RATES[q]) setFxQuoteCcy(q);
    }
  };

  const handleOpenAssetDetail = (sym, forceLens = null, opts = {}) => {
    const assetObj = getAssetBySymbol(sym);
    syncTickerDependentToolState(assetObj.sym, opts);
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

  useEffect(() => {
    if (!previewConfig) return;
    if (previewConfig.viewMode) setViewModeState(previewConfig.viewMode);
    if (previewConfig.visualMode) setVisualMode(previewConfig.visualMode);
    if (previewConfig.categoryFilter) setCategoryFilter(previewConfig.categoryFilter);
    if (previewConfig.l2Section) setL2Section(previewConfig.l2Section);
    if (previewConfig.analysisLens) setAnalysisLens(previewConfig.analysisLens);
    if (typeof previewConfig.showBollinger === 'boolean') setShowBollinger(previewConfig.showBollinger);
    if (typeof previewConfig.showVwap === 'boolean') setShowVwap(previewConfig.showVwap);
    if (previewConfig.compareSymbol !== undefined) setCompareSymbol(previewConfig.compareSymbol);
    if (previewConfig.optionsSubView) setOptionsSubView(previewConfig.optionsSubView);
    if (previewConfig.showSubChart) setShowSubChart(previewConfig.showSubChart);
    if (previewConfig.researchFactorFilter) setResearchFactorFilter(previewConfig.researchFactorFilter);
  }, [
    previewConfig,
    previewConfig?.viewMode,
    previewConfig?.visualMode,
    previewConfig?.categoryFilter,
    previewConfig?.l2Section,
    previewConfig?.analysisLens,
    previewConfig?.showBollinger,
    previewConfig?.showVwap,
    previewConfig?.compareSymbol,
    previewConfig?.optionsSubView,
    previewConfig?.showSubChart,
    previewConfig?.researchFactorFilter,
  ]);

  // Bidirectional URL Synchronization for Health Checks & Visual Audits
  useEffect(() => {
    if (previewConfig) return;
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

  // Level 2 data & Real Yahoo Finance historical chart synchronization
  const [liveSeriesVersion, setLiveSeriesVersion] = useState(0);
  const currentAsset = useMemo(() => getAssetBySymbol(selectedAsset), [selectedAsset]);
  const anomalyProfile = useMemo(() => getAnomalyProfile(selectedAsset), [selectedAsset]);
  const series = useMemo(
    () => getAssetSeries(selectedAsset, timeframe),
    [selectedAsset, timeframe, liveSeriesVersion]
  );

  useEffect(() => {
    let active = true;
    const tasks = [fetchLiveAssetSeries(selectedAsset, timeframe)];
    if (currentAsset.cat === 'FX' && fxBaseCcy && fxQuoteCcy) {
      tasks.push(fetchLiveAssetSeries(`${fxBaseCcy}/${fxQuoteCcy}`, timeframe));
    }
    if (compareSymbol) {
      tasks.push(fetchLiveAssetSeries(compareSymbol, timeframe));
    }
    Promise.all(tasks).then((results) => {
      if (active && results.some((r) => Array.isArray(r) && r.length > 0)) {
        setLiveSeriesVersion((v) => v + 1);
      }
    });
    return () => {
      active = false;
    };
  }, [selectedAsset, timeframe, currentAsset.cat, fxBaseCcy, fxQuoteCcy, compareSymbol]);

  useEffect(() => {
    if (viewMode !== 'screener') return undefined;
    let active = true;
    const topVisible = screenerRows.slice(0, 10).map((r) => r.sym);
    Promise.all(topVisible.map((sym) => fetchLiveAssetSeries(sym, '5M'))).then((results) => {
      if (active && results.some((r) => Array.isArray(r) && r.length > 0)) {
        setLiveSeriesVersion((v) => v + 1);
      }
    });
    return () => {
      active = false;
    };
  }, [viewMode, categoryFilter, screenerRows]);

  const triggerLiveP06Scoring = async (sym) => {
    setIsScoring(true);
    try {
      const [res] = await Promise.all([
        runLiveAnomalyInference(sym),
        new Promise((resolve) => setTimeout(resolve, 420)),
      ]);
      setLiveInference(res);
    } catch {
      setLiveInference(null);
    } finally {
      setIsScoring(false);
    }
  };

  const runAssetRagQuery = async (customQuery = ragQuery, scope = researchScope, sym = selectedAsset) => {
    const cleanQ = (customQuery || '').trim();
    if (!cleanQ) return;
    setIsRagLoading(true);
    setResearchChatHistory((prev) => [...prev, { role: 'user', text: cleanQ }]);
    try {
      const res = await executeSec10kRagQuery({
        query: cleanQ,
        ticker: scope === 'all' ? 'ALL' : sym,
        langCode,
      });
      setRagResult(res);
      setResearchChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          blocked: Boolean(res?.blocked),
          topicLabel: res?.topicLabel || (tx('REPORTE OFICIAL', 'OFFICIAL FILING')),
          text: res?.answer || '',
          latency: `${18 + (cleanQ.length % 14)}ms`,
        },
      ]);
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
      setResearchChatHistory([]);
      setResearchExpandedKey('');
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

  // Real live RSS news fetch for Level 2 Research (Yahoo Finance RSS + curated institutional wire)
  const refreshLiveAssetNews = async (force = false) => {
    if (force) setIsRefreshingNews(true);
    try {
      const [rssItems] = await Promise.all([
        fetchLiveAssetNews(selectedAsset, force),
        force ? new Promise((resolve) => setTimeout(resolve, 460)) : Promise.resolve(),
      ]);
      if (Array.isArray(rssItems) && rssItems.length > 0) {
        setLiveWireItems(rssItems);
      }
      if (force) {
        setNewsRefreshTick((t) => t + 1);
      }
    } finally {
      if (force) setIsRefreshingNews(false);
    }
  };

  useEffect(() => {
    if (viewMode !== 'detail' || l2Section !== 'research') return undefined;
    let active = true;
    fetchLiveAssetNews(selectedAsset, false).then((rssItems) => {
      if (active && Array.isArray(rssItems) && rssItems.length > 0) {
        setLiveWireItems(rssItems);
      }
    });
    return () => {
      active = false;
    };
  }, [viewMode, l2Section, selectedAsset]);

  // P-04 & P-08 FinBERT headlines for Level 2 Research (Real live RSS + curated institutional headlines)
  const assetFinbertNews = useMemo(() => {
    const baseList = getAssetFinbertHeadlines(selectedAsset);
    const seen = new Set();
    const merged = [];
    [...liveWireItems, ...baseList].forEach((item) => {
      const k = item?.title?.EN || item?.id;
      if (k && !seen.has(k)) {
        seen.add(k);
        merged.push(item);
      }
    });
    return merged.slice(0, 6);
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
      label: isPos ? (tx('Alcista', 'Bullish')) : tx('Bajista', 'Bearish'),
      color: isPos ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
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
  const scoreColor = isDislocated ? 'var(--danger, #f43f5e)' : isElevated ? 'var(--neg-text, #fb7185)' : 'var(--accent, #10b981)';
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
  }, [compareSymbol, timeframe, liveSeriesVersion]);

  const chartData = useMemo(() => {
    return series.map((pt, i) => {
      const cmpIdx =
        compareSeries && compareSeries.length > 0
          ? Math.min(
              compareSeries.length - 1,
              Math.round((i / Math.max(1, series.length - 1)) * (compareSeries.length - 1))
            )
          : 0;
      const cmpPt = compareSeries ? compareSeries[cmpIdx] : null;
      return {
        ...pt,
        cmpReturn: cmpPt ? cmpPt.pctReturn : null,
        zBar: Number(((pt.vol / 220 - 1) * 2.1).toFixed(2)),
      };
    });
  }, [series, compareSeries]);

  const handleExportScreenerCsv = () => {
    exportToCsv(
      `markets-screener-${categoryFilter.toLowerCase()}-${getExportDateStamp()}.csv`,
      [
        { key: 'sym', label: 'Ticker' },
        { key: 'name', label: 'Asset Name' },
        { key: 'cat', label: 'Category' },
        { key: 'priceFormatted', label: 'Price' },
        { key: 'chg', label: '24h Change (%)' },
        { key: 'vol24h', label: 'Volume (24h)' },
        { key: 'zScore', label: 'Vol Z-Score (20d)', accessor: (r) => `${r.zScore >= 0 ? '+' : ''}${Number(r.zScore || 0).toFixed(2)}σ` },
        { key: 'rsi', label: 'RSI (14)' },
        { key: 'anomalyScore', label: 'P-06 Anomaly Score', accessor: (r) => Number(r.anomalyScore || 0).toFixed(2) },
        { key: 'regime', label: 'Regime' },
      ],
      screenerRows
    );
  };

  const handleExportAnalyticsCsv = () => {
    exportToCsv(
      `analytics-${selectedAsset}-${timeframe}-${getExportDateStamp()}.csv`,
      [
        { key: 'time', label: 'Timestamp / Period' },
        { key: 'price', label: `${selectedAsset} Close Price` },
        { key: 'pctReturn', label: 'Cumulative Return (%)' },
        { key: 'upperBand', label: 'Bollinger Upper (2σ)' },
        { key: 'lowerBand', label: 'Bollinger Lower (2σ)' },
        { key: 'olsTrend', label: 'OLS Regression Trend' },
        { key: 'vol', label: 'Volume Index' },
        { key: 'zBar', label: 'Volume Z-Score (σ)' },
      ],
      chartData
    );
  };

  const handleExportAnalyticsPng = () => {
    const chgPositive = !String(currentAsset?.chg || '').startsWith('-');
    exportSnapshotToPng({
      filename: `analytics-${selectedAsset}-${timeframe}-${getExportDateStamp()}.png`,
      title: `${currentAsset.sym} — ${currentAsset.name} (${timeframe})`,
      subtitle: `${currentAsset.cat} • Price ${currentAsset.priceFormatted} (${currentAsset.chg}) • P-06 Score ${Number(displayedScore || 0).toFixed(2)} (${anomalyProfile.regime})`,
      metrics: [
        { label: 'PRICE (SPOT)', value: currentAsset.priceFormatted, sub: `24h: ${currentAsset.chg}`, color: chgPositive ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)' },
        { label: 'P-06 ANOMALY', value: Number(displayedScore || 0).toFixed(2), sub: anomalyProfile.regime, color: scoreColor },
        { label: 'VOLUME (24H)', value: currentAsset.vol24h || '—', sub: `Z-Score ${anomalyProfile.volumeZScore || '+0.4σ'}`, color: 'var(--info-text, #38bdf8)' },
        { label: 'RSI (14)', value: String(currentAsset.indicators?.rsi14 ?? 54), sub: currentAsset.indicators?.macdSignal || 'NEUTRAL', color: 'var(--purple-text, #a855f7)' },
        { label: 'RESEARCH SCORE', value: dynamicResearch.compositeFormatted, sub: `Bull ${dynamicResearch.avgBull} / Bear ${dynamicResearch.avgBear}`, color: 'var(--accent, #10b981)' },
      ],
      seriesPoints: chartData.map((d) => Number(d.price ?? d.close ?? d.value ?? 0)),
      footerNote: `Markets > Analytics (${selectedAsset} • ${timeframe}) • ${getExportDateStamp()}`,
      accentColor: chgPositive ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
    });
  };

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
    { id: 'vol', label: tx('Volumen 24h', '24h Volume') },
    { id: 'rvol', label: tx('Vol. Realizada', 'Realized Vol') },
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

    // For Orbital: sort descending by the active indicator's `sortMagnitude` and slice to `orbitalLimit`
    const orbitalItems = [...screenerRows]
      .sort(
        (a, b) =>
          evaluateHistoricalMetric(b, activeMetric, isES).sortMagnitude -
          evaluateHistoricalMetric(a, activeMetric, isES).sortMagnitude
      )
      .slice(0, orbitalLimit >= screenerRows.length ? screenerRows.length : orbitalLimit);

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
      height: '98px',
      minHeight: '98px',
      maxHeight: '98px',
      boxSizing: 'border-box',
      overflow: 'hidden',
      padding: '0.75rem 1.1rem',
      borderRadius: '10px',
      backgroundColor: 'transparent',
      border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
    };

    const MAIN_TOOLS_ITEMS = [
      {
        id: 'sovereign-curve',
        cats: ['RATES', 'FIXED_INCOME', 'CASH'],
        swimlaneId: 'LANE_RATES',
        swimlaneTitle: tx('Tasas, Bonos y Liquidez', 'Rates, Bonds & Cash'),
        sharedAssetClasses: txList(['Tasas & Curvas', 'Bonos US Treasury', 'Cash & SOFR'], ['Rates & Curves', 'US Treasuries', 'Cash & SOFR']),
        isShared: true,
        assetClassLabel: tx('Tasas, Bonos & Cash', 'Rates, Treasuries & Cash'),
        label: tx('Curva Soberana', 'Sovereign Curve'),
        desc: tx('Superficie histórica 3D (Plazo × Fecha × Yield %), comparador multi-país G10/EM y spreads 2s10s / SOFR.', '3D historical yield surface (Tenor × Date × Yield %), G10/EM peer comparator, and 2s10s / SOFR spreads.'),
        howItWorks: tx('Permite inspeccionar cómo se desplaza toda la estructura temporal de tasas (1M a 30Y) a través del tiempo o comparar curvas soberanas entre 42 economías para detectar inversiones de curva (2s10s < 0) y diferenciales reales.', 'Inspect how the full yield term structure (1M to 30Y) shifts over time or compare sovereign curves across 42 economies to spot curve inversions (2s10s < 0) and real rate differentials.'),
        keyAxes: txList(['Eje X: Plazos (1M → 30Y)', 'Eje Y: Historia / 42 Países', 'Eje Z: Rendimiento (Yield %)'], ['X-Axis: Tenors (1M → 30Y)', 'Y-Axis: History / 42 Countries', 'Z-Axis: Sovereign Yield (%)']),
        badge: 'RATES & TREASURIES',
        dimension: '3D Mesh / 2D',
        liveStat: 'US 10Y • 2s10s Spread',
        liveValue: '4.86% (+24 bps)',
        liveColor: 'var(--accent, #10b981)',
        svgType: 'mesh-rates',
        quickPresets: [
          {
            label: tx('🇺🇸 US10Y • Tesoro EE.UU.', '🇺🇸 US10Y • US Treasury'),
            statLabel: tx('US10Y • Spread 2s10s', 'US10Y • 2s10s Spread'),
            statValue: '4.86% (+24 bps)',
            statColor: 'var(--accent, #10b981)',
            variant: 0,
            seriesLegend: [
              {
                label: tx('US10Y Curva Hoy', 'US10Y Spot Curve'),
                color: 'var(--accent, #10b981)',
                dashed: false,
                desc: tx('Estructura temporal soberana actual de EE.UU. desde 1M hasta 30Y.', 'Current US Treasury yield curve across tenors from 1M to 30Y.'),
              },
              {
                label: tx('Hace 1 Mes (-1M)', '1M Historical (-1M)'),
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
                desc: tx('Curva soberana hace 30 días para visualizar el desplazamiento paralelo o empinamiento.', 'Sovereign yield curve 30 days ago to track parallel shifts or steepening.'),
              },
              {
                label: tx('Media 1 Año (1Y Avg)', '1Y Average Curve'),
                color: 'var(--text-muted, rgba(255,255,255,0.55))',
                dashed: false,
                desc: tx('Nivel promedio histórico de los últimos 12 meses por plazo.', 'Trailing 12-month historical average yield across tenors.'),
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setRatesSubView('3d-history');
              handleOpenAssetDetail('US10Y', 'derivatives', { country: 'US' });
            },
          },
          {
            label: tx('🌍 Comparador G10 / EM', '🌍 G10 / EM Peer Matrix'),
            statLabel: tx('Dispersión 10Y G10/EM', 'G10/EM 10Y Dispersion'),
            statValue: 'US 4.86% • DE 3.28% • BR 13.15%',
            statColor: 'var(--info-text, #38bdf8)',
            variant: 1,
            seriesLegend: [
              {
                label: 'US10Y (4.86%)',
                color: 'var(--info-text, #38bdf8)',
                dashed: false,
                desc: tx('Curva de referencia del Tesoro de EE.UU. (Benchmark global).', 'US Treasury benchmark curve across all maturities.'),
              },
              {
                label: 'DE10Y Bund (3.28%)',
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
                desc: tx('Curva soberana alemana (referencia libre de riesgo en la Eurozona).', 'German Bund sovereign curve (Eurozone risk-free benchmark).'),
              },
              {
                label: 'JP10Y JGB (2.76%)',
                color: 'var(--text-muted, rgba(255,255,255,0.55))',
                dashed: false,
                desc: tx('Curva soberana de Japón (ancla de tasas bajas del G10).', 'Japanese Government Bond curve (G10 low-yield anchor).'),
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setRatesSubView('3d-peers');
              handleOpenAssetDetail('US10Y', 'derivatives', { country: 'US' });
            },
          },
          {
            label: tx('🇩🇪 DE10Y • Bund Alemán', '🇩🇪 DE10Y • German Bund'),
            statLabel: 'DE10Y Bund • 2s10s',
            statValue: '3.28% (+34 bps)',
            statColor: 'var(--purple-text, #a855f7)',
            variant: 2,
            seriesLegend: [
              {
                label: tx('DE10Y Curva Hoy', 'DE10Y Spot Curve'),
                color: 'var(--purple-text, #a855f7)',
                dashed: false,
                desc: tx('Curva actual del Bund alemán desde 3M hasta 30Y.', 'Current German Bund yield curve from 3M to 30Y.'),
              },
              {
                label: tx('US10Y Benchmark', 'US10Y Benchmark'),
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
                desc: tx('Curva del Tesoro de EE.UU. superpuesta para medir el spread transatlántico.', 'Overlaid US Treasury curve to measure the transatlantic yield spread.'),
              },
              {
                label: tx('DE10Y Hace 6M', 'DE10Y 6M Ago'),
                color: 'var(--text-muted, rgba(255,255,255,0.55))',
                dashed: false,
                desc: tx('Estructura temporal alemana hace 6 meses.', 'German sovereign term structure 6 months ago.'),
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setRatesSubView('3d-history');
              handleOpenAssetDetail('DE10Y', 'derivatives', { country: 'DE' });
            },
          },
          {
            label: tx('🇧🇷 BR10Y • Soberano Brasil', '🇧🇷 BR10Y • Brazil Sovereign'),
            statLabel: 'BR10Y DI • 2s10s',
            statValue: '13.15% (+7 bps)',
            statColor: 'var(--warn-text, #f59e0b)',
            variant: 3,
            seriesLegend: [
              {
                label: tx('BR10Y Curva Hoy', 'BR10Y Spot Curve'),
                color: 'var(--warn-text, #f59e0b)',
                dashed: false,
                desc: tx('Curva soberana actual de Brasil (DI Futuro / NTN-F) en moneda local.', 'Current Brazil sovereign yield curve (DI Futures / Local Treasury).'),
              },
              {
                label: tx('US10Y Benchmark', 'US10Y Benchmark'),
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
                desc: tx('Curva del Tesoro de EE.UU. para visualizar el premio por riesgo emergente.', 'US Treasury benchmark curve showing the EM sovereign risk premium.'),
              },
              {
                label: tx('DE10Y Benchmark', 'DE10Y Benchmark'),
                color: 'var(--text-muted, rgba(255,255,255,0.55))',
                dashed: false,
                desc: tx('Curva base europea como segundo nivel de referencia internacional.', 'European Bund base curve as secondary international benchmark.'),
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setRatesSubView('3d-history');
              handleOpenAssetDetail('BR10Y', 'derivatives', { country: 'BR' });
            },
          },
        ],
        action: () => {
          setL2Section('analytics');
          setAnalysisLens('derivatives');
          setRatesSubView('3d-history');
          handleOpenAssetDetail('US10Y', 'derivatives', { country: 'US' });
        },
      },
      {
        id: 'vol-surface-3d',
        cats: ['DERIVATIVES_VOL', 'EQUITY', 'INDEX', 'ETF', 'CRYPTO'],
        swimlaneId: 'LANE_EQUITY_DERIV',
        swimlaneTitle: tx('Derivados, Acciones y Crypto', 'Derivatives, Equities & Crypto'),
        sharedAssetClasses: txList(['Derivados & Vol', 'Acciones', 'Índices', 'ETFs', 'Crypto'], ['Derivatives & Vol', 'Equities', 'Indices', 'ETFs', 'Crypto']),
        isShared: true,
        assetClassLabel: tx('Derivados, Acciones, Índices, ETFs & Crypto', 'Derivatives, Equities, Indices, ETFs & Crypto'),
        label: tx('Superficie de Volatilidad', 'Volatility Surface'),
        desc: tx('Malla interactiva Strike × Vencimiento × IV (%) con skew de puts y sonrisa de volatilidad.', 'Interactive Strike × Expiry × IV (%) mesh with put skew and volatility smile.'),
        howItWorks: tx('Visualiza en 3D dónde el mercado de opciones está pagando prima extra por cobertura bajista (Put Skew) o explosión alcista (Call Wing) a lo largo de distintos strikes (80% a 120% Moneyness) y vencimientos (7D a 180D).', 'Visualize in 3D where the options market is pricing extra premium for downside protection (Put Skew) or upside tail risk across strikes (80%–120% moneyness) and expiries (7D–180D).'),
        keyAxes: txList(['Eje X: Moneyness / Strike', 'Eje Y: Vencimiento (7D → 180D)', 'Eje Z: Volatilidad Implícita (IV %)'], ['X-Axis: Moneyness / Strike', 'Y-Axis: Expiry (7D → 180D)', 'Z-Axis: Implied Volatility (IV %)']),
        badge: 'OPTIONS & VOL 3D',
        dimension: 'Strike × Exp × IV',
        liveStat: 'NVDA ATM IV (30d)',
        liveValue: '46.8% (Skew -2.8%)',
        liveColor: 'var(--purple-text, #a855f7)',
        svgType: 'vol-smile',
        quickPresets: [
          {
            label: 'NVDA',
            statLabel: 'NVDA • ATM IV (30D)',
            statValue: '46.8% (Skew -2.8%)',
            statColor: 'var(--purple-text, #a855f7)',
            variant: 0,
            seriesLegend: [
              {
                label: tx('NVDA Sonrisa 30D IV', 'NVDA 30D IV Smile'),
                color: 'var(--purple-text, #a855f7)',
                dashed: false,
                desc: tx('Volatilidad implícita a 30 días entre strikes 85% y 115% Moneyness.', '30-day implied volatility smile across 85% to 115% moneyness strikes.'),
              },
              {
                label: tx('NVDA Plazo 90D IV', 'NVDA 90D Term IV'),
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
                desc: tx('Sonrisa de volatilidad trimestral (90 días) para comparar estructura de plazos.', 'Quarterly (90-day) volatility smile comparing term structure flattening.'),
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setOptionsSubView('surface3d');
              handleOpenAssetDetail('NVDA-OPT', 'derivatives');
            },
          },
          {
            label: 'SPY',
            statLabel: 'SPY • ATM IV (30D)',
            statValue: '15.4% (Skew -3.4%)',
            statColor: 'var(--accent, #10b981)',
            variant: 1,
            seriesLegend: [
              {
                label: tx('SPY Sonrisa 30D IV', 'SPY 30D IV Smile'),
                color: 'var(--accent, #10b981)',
                dashed: false,
                desc: tx('Curva de volatilidad implícita a 30 días del S&P 500 con fuerte Put Skew.', 'S&P 500 30-day implied volatility curve displaying institutional Put Skew.'),
              },
              {
                label: tx('SPY Plazo 90D IV', 'SPY 90D Term IV'),
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
                desc: tx('Curva de volatilidad implícita a 90 días del S&P 500.', 'S&P 500 90-day implied volatility curve.'),
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setOptionsSubView('surface3d');
              handleOpenAssetDetail('SPY', 'derivatives');
            },
          },
          {
            label: 'TSLA',
            statLabel: 'TSLA • ATM IV (30D)',
            statValue: '54.2% (Skew -2.1%)',
            statColor: 'var(--info-text, #38bdf8)',
            variant: 2,
            seriesLegend: [
              {
                label: tx('TSLA Sonrisa 30D IV', 'TSLA 30D IV Smile'),
                color: 'var(--info-text, #38bdf8)',
                dashed: false,
                desc: tx('Sonrisa de volatilidad a 30 días en TSLA con convexidad en ambos extremos.', 'TSLA 30-day volatility smile with elevated wings on both OTM puts and calls.'),
              },
              {
                label: tx('TSLA Plazo 90D IV', 'TSLA 90D Term IV'),
                color: 'var(--purple-text, #a855f7)',
                dashed: true,
                desc: tx('Estructura de volatilidad a 90 días en TSLA.', 'TSLA 90-day implied volatility term structure.'),
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setOptionsSubView('surface3d');
              handleOpenAssetDetail('TSLA', 'derivatives');
            },
          },
          {
            label: 'BTC',
            statLabel: 'BTC • ATM IV (30D)',
            statValue: '58.4% (Call Wing)',
            statColor: 'var(--warn-text, #f59e0b)',
            variant: 3,
            seriesLegend: [
              {
                label: tx('BTC Sonrisa 30D IV', 'BTC 30D IV Smile'),
                color: 'var(--warn-text, #f59e0b)',
                dashed: false,
                desc: tx('Volatilidad implícita de opciones de Bitcoin a 30 días con sesgo alcista (Call Wing).', 'Bitcoin 30-day options implied volatility showing upside Call Wing skew.'),
              },
              {
                label: tx('BTC Plazo 90D IV', 'BTC 90D Term IV'),
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
                desc: tx('Volatilidad implícita de Bitcoin a 90 días.', 'Bitcoin 90-day quarterly implied volatility curve.'),
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setOptionsSubView('surface3d');
              handleOpenAssetDetail('BTC', 'derivatives');
            },
          },
        ],
        action: () => {
          setL2Section('analytics');
          setAnalysisLens('derivatives');
          setOptionsSubView('surface3d');
          handleOpenAssetDetail('NVDA-OPT', 'derivatives');
        },
      },
      {
        id: 'options-payoff',
        cats: ['DERIVATIVES_VOL', 'EQUITY', 'INDEX', 'ETF'],
        swimlaneId: 'LANE_EQUITY_DERIV',
        swimlaneTitle: tx('Derivados, Acciones y Crypto', 'Derivatives, Equities & Crypto'),
        sharedAssetClasses: txList(['Derivados & Vol', 'Acciones', 'Índices', 'ETFs'], ['Derivatives & Vol', 'Equities', 'Indices', 'ETFs']),
        isShared: true,
        assetClassLabel: tx('Derivados, Acciones, Índices & ETFs', 'Derivatives, Equities, Indices & ETFs'),
        label: tx('Simulador Payoff', 'Options Payoff'),
        desc: tx('Simulador de estrategias (Straddle, Iron Condor, Sintéticos) con Griegas Δ, Γ, Θ, ν en tiempo real.', 'Multi-leg strategy simulator (Straddle, Iron Condor, Synthetics) with real-time Δ, Γ, Θ, ν Greeks.'),
        howItWorks: tx('Construye estructuras de hasta 4 patas de opciones (Calls/Puts compradas o vendidas) y proyecta el perfil de ganancia/pérdida al vencimiento y hoy (T+0), junto con los puntos de equilibrio (Breakevens) y sensibilidad a Griegas.', 'Build up to 4-leg option structures (long/short Calls & Puts) and project expiration vs. T+0 P&L curves, breakeven thresholds, and net Greek exposures.'),
        keyAxes: txList(['Eje X: Precio Subyacente al Vencimiento', 'Eje Y: P&L Neto ($ / %)', 'Sensibilidad: Δ Delta • Γ Gamma • Θ Theta • ν Vega'], ['X-Axis: Underlying Price at Expiry', 'Y-Axis: Net P&L ($ / %)', 'Greeks: Δ Delta • Γ Gamma • Θ Theta • ν Vega']),
        badge: 'DERIVATIVES LAB',
        dimension: '4-Leg + Greeks',
        liveStat: 'NVDA Long Straddle',
        liveValue: 'Γ +0.121 • ν +$0.73',
        liveColor: 'var(--accent, #10b981)',
        svgType: 'payoff',
        quickPresets: [
          {
            label: 'NVDA • Long Straddle',
            statLabel: 'NVDA • Long Straddle (ATM)',
            statValue: 'BE $178.4 / $218.5 • Γ +0.085',
            statColor: 'var(--accent, #10b981)',
            variant: 0,
            seriesLegend: [
              {
                label: tx('P&L al Vencimiento ($)', 'Expiration P&L ($)'),
                color: 'var(--accent, #10b981)',
                dashed: false,
                desc: tx('Resultado neto exacto al día de expiración según el precio final del subyacente.', 'Exact net profit/loss at expiration across underlying spot prices.'),
              },
              {
                label: tx('P&L Hoy (T+0 BS)', 'Today P&L (T+0 BS)'),
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
                desc: tx('Valuación teórica Black-Scholes hoy (T+0) antes del desgaste por Theta.', 'Theoretical Black-Scholes mark-to-market curve today (T+0).'),
              },
              {
                label: tx('Equilibrio ($0 BE)', 'Breakeven ($0 BE)'),
                color: 'var(--text-muted, rgba(255,255,255,0.5))',
                dashed: true,
                desc: tx('Línea horizontal de beneficio cero ($0).', 'Zero profit/loss breakeven threshold ($0).'),
              },
            ],
            run: () => {
              setSelectedOptStrategy('LONG_STRADDLE');
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setOptionsSubView('payoff');
              handleOpenAssetDetail('NVDA-OPT', 'derivatives');
            },
          },
          {
            label: 'SPY • Iron Condor',
            statLabel: 'SPY • Iron Condor (±5%)',
            statValue: tx('Crédito +$4.15 • Θ +$0.28/d', 'Credit +$4.15 • Θ +$0.28/d'),
            statColor: 'var(--info-text, #38bdf8)',
            variant: 1,
            seriesLegend: [
              {
                label: tx('P&L al Vencimiento ($)', 'Expiration P&L ($)'),
                color: 'var(--info-text, #38bdf8)',
                dashed: false,
                desc: tx('Meseta de ganancia máxima entre los strikes vendidos con riesgo acotado en los extremos.', 'Defined-risk profit plateau between short strikes with capped wing losses.'),
              },
              {
                label: tx('P&L Hoy (T+0 BS)', 'Today P&L (T+0 BS)'),
                color: 'var(--purple-text, #a855f7)',
                dashed: true,
                desc: tx('Curva suave de valuación actual (T+0) que converge hacia la meseta por Theta positivo.', 'Smooth T+0 mark-to-market curve converging toward max profit via positive Theta.'),
              },
              {
                label: tx('Equilibrio ($0 BE)', 'Breakeven ($0 BE)'),
                color: 'var(--text-muted, rgba(255,255,255,0.5))',
                dashed: true,
                desc: tx('Línea horizontal de beneficio cero ($0).', 'Zero profit/loss breakeven threshold ($0).'),
              },
            ],
            run: () => {
              setSelectedOptStrategy('IRON_CONDOR');
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setOptionsSubView('payoff');
              handleOpenAssetDetail('SPY', 'derivatives');
            },
          },
          {
            label: 'TSLA • Bull Call Spread',
            statLabel: 'TSLA • Bull Call Spread',
            statValue: 'Δ +0.28 • Max +$14.80',
            statColor: 'var(--purple-text, #a855f7)',
            variant: 2,
            seriesLegend: [
              {
                label: tx('P&L al Vencimiento ($)', 'Expiration P&L ($)'),
                color: 'var(--purple-text, #a855f7)',
                dashed: false,
                desc: tx('Perfil alcista con pérdida máxima limitada al débito pagado y ganancia acotada en el Call vendido.', 'Bullish vertical spread with loss capped at net debit and upside capped at short Call strike.'),
              },
              {
                label: tx('P&L Hoy (T+0 BS)', 'Today P&L (T+0 BS)'),
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
                desc: tx('Curva actual (T+0) con sensibilidad direccional positiva (Delta +0.28).', 'Current T+0 valuation curve with positive directional Delta (+0.28).'),
              },
              {
                label: tx('Equilibrio ($0 BE)', 'Breakeven ($0 BE)'),
                color: 'var(--text-muted, rgba(255,255,255,0.5))',
                dashed: true,
                desc: tx('Línea horizontal de beneficio cero ($0).', 'Zero profit/loss breakeven threshold ($0).'),
              },
            ],
            run: () => {
              setSelectedOptStrategy('BULL_CALL_SPREAD');
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setOptionsSubView('payoff');
              handleOpenAssetDetail('TSLA', 'derivatives');
            },
          },
        ],
        action: () => {
          setL2Section('analytics');
          setAnalysisLens('derivatives');
          setOptionsSubView('payoff');
          handleOpenAssetDetail('NVDA-OPT', 'derivatives');
        },
      },
      {
        id: 'fx-cross',
        cats: ['FX'],
        swimlaneId: 'LANE_FX',
        swimlaneTitle: tx('Divisas (FX)', 'FX Currencies'),
        sharedAssetClasses: txList(['Divisas (FX)'], ['FX Currencies']),
        isShared: false,
        assetClassLabel: tx('Divisas (FX)', 'FX Currencies'),
        label: tx('Conversor FX y Carry', 'FX Cross & Carry'),
        desc: tx('Triangulación instantánea entre 61 divisas G10 y Mercados Emergentes con diferencial de tasas (Carry).', 'Instant cross-rate triangulation across 61 G10 & EM currencies with interest rate Carry differential.'),
        howItWorks: tx('Calcula tipos de cambio cruzados sintéticos entre cualquiera de las 61 monedas globales (G10, LatAm, Asia, EMEA) y compara el diferencial de tasas de bancos centrales para estrategias de Carry Trade.', 'Computes synthetic cross rates across 61 global currencies (G10, LatAm, Asia, EMEA) and compares central bank rate differentials for Carry Trade positioning.'),
        keyAxes: txList(['Moneda Base (61 CCY)', 'Moneda Cotizada (61 CCY)', 'Diferencial Carry Implícito (% anual)'], ['Base Currency (61 CCY)', 'Quote Currency (61 CCY)', 'Implied Carry Differential (% p.a.)']),
        badge: 'FX & CARRY',
        dimension: '61×61 Matrix',
        liveStat: 'EUR / USD Spot & Carry',
        liveValue: '1.1240 (+113 bps)',
        liveColor: 'var(--accent, #10b981)',
        svgType: 'fx-matrix',
        quickPresets: [
          {
            label: 'EUR / USD',
            statLabel: 'EUR / USD • Carry 10Y',
            statValue: '1.1240 (+113 bps)',
            statColor: 'var(--accent, #10b981)',
            variant: 0,
            seriesLegend: [
              {
                label: 'EUR/USD Spot',
                color: 'var(--accent, #10b981)',
                dashed: false,
              },
              {
                label: 'SMA (20)',
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              handleOpenAssetDetail('EUR/USD', 'derivatives', { fxBase: 'EUR', fxQuote: 'USD' });
            },
          },
          {
            label: 'USD / JPY',
            statLabel: 'USD / JPY • Carry 10Y',
            statValue: '158.46 (-338 bps)',
            statColor: 'var(--info-text, #38bdf8)',
            variant: 1,
            seriesLegend: [
              {
                label: 'USD/JPY Spot',
                color: 'var(--info-text, #38bdf8)',
                dashed: false,
              },
              {
                label: 'SMA (20)',
                color: 'var(--accent, #10b981)',
                dashed: true,
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              handleOpenAssetDetail('USD/JPY', 'derivatives', { fxBase: 'USD', fxQuote: 'JPY' });
            },
          },
          {
            label: 'EUR / BRL',
            statLabel: 'EUR / BRL • Carry 10Y',
            statValue: '6.1391 (+950 bps)',
            statColor: 'var(--warn-text, #f59e0b)',
            variant: 2,
            seriesLegend: [
              {
                label: 'EUR/BRL Spot',
                color: 'var(--warn-text, #f59e0b)',
                dashed: false,
              },
              {
                label: 'SMA (20)',
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              handleOpenAssetDetail('EUR/USD', 'derivatives', { fxBase: 'EUR', fxQuote: 'BRL' });
            },
          },
        ],
        action: () => {
          setL2Section('analytics');
          setAnalysisLens('derivatives');
          handleOpenAssetDetail('EUR/USD', 'derivatives', { fxBase: 'EUR', fxQuote: 'USD' });
        },
      },
      {
        id: 'commodity-forward-3d',
        cats: ['COMMODITY'],
        swimlaneId: 'LANE_COMMODITIES',
        swimlaneTitle: tx('Materias Primas', 'Commodities'),
        sharedAssetClasses: txList(['Materias Primas'], ['Commodities']),
        isShared: false,
        assetClassLabel: tx('Materias Primas', 'Commodities'),
        label: tx('Curva Forward', 'Commodity Forward'),
        desc: tx('Estructura temporal de futuros de Energía, Metales y Agro (Spot a +24M) y cálculo de Roll Yield.', 'Futures term structure across Energy, Metals & Ags (Spot to +24M) and Roll Yield calculation.'),
        howItWorks: tx('Representa la curva de contratos de futuros desde el mes frontal (Spot/M1) hasta +24 meses para identificar escasez física inmediata (Backwardation, pendiente negativa) o sobrecosto de almacenamiento (Contango, pendiente positiva).', 'Maps futures contracts from front-month (Spot/M1) out to +24 months to identify physical tightness (Backwardation, downward slope) or storage carry cost (Contango, upward slope).'),
        keyAxes: txList(['Eje X: Vencimiento Futuro (Spot → M24)', 'Eje Y: Evolución Histórica', 'Eje Z: Precio Forward & Roll Yield (%)'], ['X-Axis: Futures Maturity (Spot → M24)', 'Y-Axis: Historical Evolution', 'Z-Axis: Forward Price & Roll Yield (%)']),
        badge: 'COMMODITIES 3D',
        dimension: 'Spot → +24M 3D',
        liveStat: 'WTI (CL) • Roll Yield',
        liveValue: '$88.49 (+4.8% Backw.)',
        liveColor: 'var(--info-text, #38bdf8)',
        svgType: 'commodity-curve',
        quickPresets: [
          {
            label: '🛢️ CL • WTI Crude',
            statLabel: 'CL (WTI) • Roll Yield',
            statValue: '$88.49 (+4.8% Backw.)',
            statColor: 'var(--info-text, #38bdf8)',
            variant: 0,
            seriesLegend: [
              {
                label: tx('CL Curva Forward (M1→M24)', 'CL Forward Curve (M1→M24)'),
                color: 'var(--info-text, #38bdf8)',
                dashed: false,
                desc: tx('Estructura temporal actual de futuros de petróleo WTI en Backwardation (pendiente descendente).', 'Current WTI crude futures curve in Backwardation (downward-sloping term structure).'),
              },
              {
                label: tx('Curva hace 3M (-3M)', '3M Historical Curve'),
                color: 'var(--accent, #10b981)',
                dashed: true,
                desc: tx('Estructura temporal de futuros hace 3 meses para comparar el Roll Yield.', 'Futures term structure 3 months ago to compare Roll Yield evolution.'),
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setCommoditySubView('3d');
              handleOpenAssetDetail('CL', 'derivatives');
            },
          },
          {
            label: '🥇 GC • Gold',
            statLabel: 'GC (Gold) • Term Carry',
            statValue: '$4,119.10 (-3.6% Contango)',
            statColor: 'var(--warn-text, #f59e0b)',
            variant: 1,
            seriesLegend: [
              {
                label: tx('GC Curva Forward (M1→M24)', 'GC Forward Curve (M1→M24)'),
                color: 'var(--warn-text, #f59e0b)',
                dashed: false,
                desc: tx('Curva de futuros de Oro en Contango reflejando tasas de financiamiento y costo de custodia.', 'Gold futures curve in Contango reflecting interest-rate carry and storage costs.'),
              },
              {
                label: tx('Curva hace 3M (-3M)', '3M Historical Curve'),
                color: 'var(--accent, #10b981)',
                dashed: true,
                desc: tx('Curva histórica de futuros de Oro hace 3 meses.', 'Historical Gold futures curve 3 months ago.'),
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setCommoditySubView('3d');
              handleOpenAssetDetail('GC', 'derivatives');
            },
          },
          {
            label: '🔥 NG • NatGas',
            statLabel: 'NG (NatGas) • Term Carry',
            statValue: '$2.94 (-8.6% Contango)',
            statColor: 'var(--accent, #10b981)',
            variant: 2,
            seriesLegend: [
              {
                label: tx('NG Curva Forward (M1→M24)', 'NG Forward Curve (M1→M24)'),
                color: 'var(--accent, #10b981)',
                dashed: false,
                desc: tx('Estructura estacional de futuros de Gas Natural desde Spot hasta +24 meses.', 'Seasonal Natural Gas futures term structure from Spot out to +24 months.'),
              },
              {
                label: tx('Curva hace 3M (-3M)', '3M Historical Curve'),
                color: 'var(--info-text, #38bdf8)',
                dashed: true,
                desc: tx('Curva de futuros de Gas Natural hace 3 meses.', 'Natural Gas futures term structure 3 months ago.'),
              },
            ],
            run: () => {
              setL2Section('analytics');
              setAnalysisLens('derivatives');
              setCommoditySubView('3d');
              handleOpenAssetDetail('NG', 'derivatives');
            },
          },
        ],
        action: () => {
          setL2Section('analytics');
          setAnalysisLens('derivatives');
          setCommoditySubView('3d');
          handleOpenAssetDetail('CL', 'derivatives');
        },
      },
    ];

    const contextualTools = MAIN_TOOLS_ITEMS.filter((item) => item.cats.includes(categoryFilter));
    const pulseVolColor = pulseMetrics.isVolPos ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)';

    return (
      <div
        className="responsive-page-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          width: '100%',
          paddingBottom: '2.5rem',
        }}
      >
        {/* 1.0 TOP BAR (ABOVE AGGREGATED INDICATORS): V010 GHOST ASSET TYPE SWITCHER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
            padding: '0.18rem 0',
          }}
        >
          {/* CENTER: 10-CATEGORY GLOBAL ASSET UNIVERSE FILTER IN V010 GHOST STYLE */}
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              gap: '1.15rem',
            }}
          >
            {[
              {
                id: 'ALL',
                label: tx('Todos', 'All'),
                desc: tx('Muestra el universo completo de 213 activos globales en tiempo real.', 'Displays the full 213-asset global universe in real time.'),
              },
              {
                id: 'WATCHLIST',
                label: `Watchlist (${watchlistSyms.length})`,
                desc: tx('Filtra tus activos favoritos para seguimiento y Portfolio.', 'Filters your watchlist assets for tracking and Portfolio evaluation.'),
              },
              ...[
                {
                  id: 'INDEX',
                  label: tx('Índices', 'Indices'),
                  desc: tx('Índices bursátiles globales (S&P 500, Nasdaq 100, DAX, Nikkei).', 'Global equity indices (S&P 500, Nasdaq 100, DAX, Nikkei).'),
                },
                {
                  id: 'EQUITY',
                  label: tx('Acciones (S&P/NDX)', 'Equities (S&P/NDX)'),
                  desc: tx('Acciones líderes con P/E Forward, Beta e indicadores institucionales.', 'Leading equities with Forward P/E, Beta, and institutional indicators.'),
                },
                {
                  id: 'ETF',
                  label: 'ETFs',
                  desc: tx('Fondos cotizados sectoriales, renta fija y materias primas.', 'Sector, fixed-income, and commodity exchange-traded funds.'),
                },
                {
                  id: 'CRYPTO',
                  label: 'Crypto',
                  desc: tx('Activos digitales spot con Funding Rate perpetuo y Open Interest.', 'Spot digital assets with perpetual Funding Rate and Open Interest.'),
                },
                {
                  id: 'RATES',
                  label: tx('Tasas & Curvas', 'Rates & Curves'),
                  desc: tx('Rendimientos soberanos y curvas 3D/2D en 42 países.', 'Sovereign yields and 3D/2D curves across 42 countries.'),
                },
                {
                  id: 'FIXED_INCOME',
                  label: tx('Bonos US Treasury', 'US Treasuries'),
                  desc: tx('Bonos del Tesoro de EE.UU. con Duración Modificada y Convexidad.', 'US Treasury bonds with Modified Duration and Convexity.'),
                },
                {
                  id: 'FX',
                  label: tx('Divisas (FX)', 'FX Currencies'),
                  desc: tx('Pares de divisas G10 y EM con diferencial de tasas (Carry) y conversor 61 monedas.', 'G10 & EM currency pairs with interest rate carry and 61-CCY converter.'),
                },
                {
                  id: 'COMMODITY',
                  label: tx('Materias Primas', 'Commodities'),
                  desc: tx('Energía, metales y agro con estructura temporal Contango / Backwardation.', 'Energy, metals, and agriculture with Contango / Backwardation term structure.'),
                },
                {
                  id: 'DERIVATIVES_VOL',
                  label: tx('Derivados & Vol', 'Derivatives & Vol'),
                  desc: tx('Opciones y futuros de volatilidad con Superficie IV 3D y simulador Payoff P&L.', 'Options and volatility futures with 3D IV Surface and P&L Payoff simulator.'),
                },
                {
                  id: 'CASH',
                  label: 'Cash & SOFR',
                  desc: tx('Liquidez monetaria, tasas repo SOFR y letras del Tesoro a corto plazo.', 'Money market liquidity, SOFR repo rates, and short-term T-Bills.'),
                },
              ].sort((a, b) => a.label.localeCompare(b.label, tx('es', 'en'))),
            ].map((tab) => {
              const active = categoryFilter === tab.id;
              return (
                <HoverTooltip
                  key={tab.id}
                  title={tab.label}
                  description={tab.desc}
                  hint={tx('Click para filtrar clase de activo', 'Click to filter asset class')}
                  badge={tab.id}
                  placement="bottom"
                  disabled={true}
                >
                  <button
                    onClick={() => setCategoryFilter(tab.id)}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: active ? 800 : 600,
                      padding: '0.18rem 0.25rem',
                      border: 'none',
                      background: 'transparent',
                      color: active ? 'var(--ui-accent)' : 'var(--text-muted, rgba(148, 163, 184, 0.62))',
                      textShadow: active ? '0 0 15px rgba(var(--ui-accent-rgb), 0.88)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.16s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </button>
                </HoverTooltip>
              );
            })}
          </div>
        </div>

        {/* 1.0b SECOND-ROW TRAIT FILTER MENU + MULTI-SELECT EQUITY INDUSTRIES (PHASE 4: PASO 4.1) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            flexWrap: 'wrap',
            padding: '0.12rem 0.4rem',
          }}
        >
          {GENERAL_TRAIT_FILTERS.map((tf) => {
            const active = traitFilter === tf.id;
            return (
              <button
                key={tf.id}
                type="button"
                onClick={() => setTraitFilter(tf.id)}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: active ? 800 : 600,
                  padding: '0.16rem 0.45rem',
                  borderRadius: '999px',
                  border: active
                    ? '1px solid rgba(var(--ui-accent-rgb), 0.55)'
                    : '1px solid transparent',
                  background: active ? 'rgba(var(--ui-accent-rgb), 0.14)' : 'transparent',
                  color: active ? 'var(--ui-accent)' : 'var(--text-muted, rgba(148, 163, 184, 0.72))',
                  textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb), 0.75)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tf.label}
              </button>
            );
          })}

          {activeCategoryTraits.length > 0 && (
            <>
              <span
                style={{
                  color: 'rgba(148, 163, 184, 0.32)',
                  fontSize: '0.72rem',
                  margin: '0 0.15rem',
                  userSelect: 'none',
                }}
              >
                |
              </span>
              {activeCategoryTraits.map((tf) => {
                const active = traitFilter === tf.id;
                return (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => setTraitFilter(tf.id)}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: active ? 800 : 700,
                      padding: '0.16rem 0.52rem',
                      borderRadius: '999px',
                      border: active
                        ? '1px solid var(--trait-pill-active-border, rgba(56, 189, 248, 0.65))'
                        : '1px solid var(--trait-pill-border, rgba(56, 189, 248, 0.22))',
                      background: active
                        ? 'var(--trait-pill-active-bg, rgba(56, 189, 248, 0.18))'
                        : 'var(--trait-pill-bg, rgba(56, 189, 248, 0.05))',
                      color: active ? 'var(--info-text, #38bdf8)' : 'var(--trait-pill-text, #BAE6FD)',
                      textShadow: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tf.label}
                  </button>
                );
              })}
            </>
          )}

          {/* MULTI-SELECT INDUSTRY DROPDOWN FOR EQUITIES */}
          {categoryFilter === 'EQUITY' && (
            <div ref={industryMenuRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIndustryMenuOpen((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.32rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.18rem 0.62rem',
                  borderRadius: '999px',
                  border:
                    selectedIndustries.length > 0 || industryMenuOpen
                      ? '1px solid rgba(var(--ui-accent-rgb), 0.7)'
                      : '1px solid var(--border-slate, rgba(148, 163, 184, 0.35))',
                  background:
                    selectedIndustries.length > 0 || industryMenuOpen
                      ? 'rgba(var(--ui-accent-rgb), 0.18)'
                      : 'var(--bg-elevated-soft, rgba(15, 23, 42, 0.55))',
                  color: selectedIndustries.length > 0 ? 'var(--ui-accent)' : 'var(--text-secondary, #e2e8f0)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>
                  {selectedIndustries.length > 0
                    ? `${tx('Industrias', 'Industries')} (${selectedIndustries.length})`
                    : tx('Industrias', 'Industries')}
                </span>
                <span style={{ fontSize: '0.62rem', opacity: 0.85 }}>{industryMenuOpen ? '▴' : '▾'}</span>
              </button>

              {industryMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    zIndex: 95,
                    minWidth: '255px',
                    padding: '0.45rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.96))',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(var(--ui-accent-rgb), 0.42)',
                    boxShadow: '0 16px 38px rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.22rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.18rem 0.4rem 0.32rem',
                      borderBottom: '1px solid var(--border-slate, rgba(148, 163, 184, 0.16))',
                      marginBottom: '0.1rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        color: 'var(--text-muted, #94a3b8)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {tx('Filtrar por Industria (Multiselector)', 'Filter by Industry (Multi-select)')}
                    </span>
                    {selectedIndustries.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedIndustries([])}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--ui-accent)',
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        {tx('Limpiar', 'Clear')}
                      </button>
                    )}
                  </div>

                  {EQUITY_INDUSTRIES.map((ind) => {
                    const checked = selectedIndustries.includes(ind.id);
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => toggleIndustrySelection(ind.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          padding: '0.36rem 0.5rem',
                          borderRadius: '8px',
                          border: checked
                            ? '1px solid rgba(var(--ui-accent-rgb), 0.45)'
                            : '1px solid transparent',
                          backgroundColor: checked ? 'rgba(var(--ui-accent-rgb), 0.14)' : 'transparent',
                          color: checked ? 'var(--text-main, #ffffff)' : 'var(--text-body, #cbd5e1)',
                          fontSize: '0.7rem',
                          fontWeight: checked ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span
                            style={{
                              width: '13px',
                              height: '13px',
                              borderRadius: '3px',
                              border: checked
                                ? '1px solid var(--ui-accent)'
                                : '1px solid rgba(148, 163, 184, 0.45)',
                              backgroundColor: checked ? 'var(--ui-accent)' : 'transparent',
                              color: '#070b14',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '9.5px',
                              fontWeight: 900,
                              flexShrink: 0,
                            }}
                          >
                            {checked ? '✓' : ''}
                          </span>
                          <span>{ind.label}</span>
                        </div>
                        <span
                          className="mono-metric"
                          style={{ fontSize: '0.62rem', color: 'var(--text-dim, #64748b)', fontWeight: 700 }}
                        >
                          {ind.syms.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SUB-BAR CENTERED RIGHT UNDER ASSET CLASS ITEMS IN V010 GHOST STYLE */}
        {marketsToolsMode === 'v5-under-cats' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                padding: '0.1rem 0.4rem',
                gap: '1.1rem',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: 'var(--ui-accent)',
                  textShadow: '0 0 12px rgba(var(--ui-accent-rgb), 0.72)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Main Tools:
              </span>
              {MAIN_TOOLS_ITEMS.map((qBtn) => (
                <HoverTooltip key={qBtn.id} title={qBtn.label} description={qBtn.desc} badge={qBtn.badge} placement="bottom" disabled={true}>
                  <button
                    type="button"
                    onClick={qBtn.action}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.14rem 0.24rem',
                      border: 'none',
                      background: 'transparent',
                      color: 'rgba(203, 213, 225, 0.78)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.16s ease',
                    }}
                  >
                    {qBtn.label}
                  </button>
                </HoverTooltip>
              ))}
            </div>
          </div>
        )}

        {/* 1.1 AGGREGATED MARKET INDICATORS (KPI FORMAT: 1PX BORDER + 3PX SEMANTIC LEFT BAR) */}
        <div
          className="resp-kpi-grid-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          {/* KPI 1: 24H AGGREGATE VOLUME */}
          <div
            style={{
              background: 'transparent',
              border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
              borderLeft: `3px solid ${pulseVolColor}`,
              borderRadius: '10px',
              padding: '10px 14px',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted, #94a3b8)' }}>
              {tx('VOLUMEN AGREGADO (24H)', '24H AGGREGATE VOLUME')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 8px', marginTop: '3px' }}>
              <span className="mono-metric" style={{ fontSize: '19px', fontWeight: 900, color: 'var(--text-main, #f8fafc)' }}>
                {pulseMetrics.totalVolFormatted}
              </span>
              <span className="mono-metric" style={{ fontSize: '12.5px', fontWeight: 800, color: pulseVolColor }}>
                {pulseMetrics.volChgFormatted}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim, #64748b)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {pulseMetrics.totalCount} {tx('activos', 'assets')} •{' '}
              {parseFloat(pulseMetrics.volChgFormatted) >= 0
                ? tx('Mayor entrada de dinero hoy', 'Higher money inflow today')
                : tx('Menor actividad que ayer', 'Lower activity than yesterday')}
            </div>
          </div>

          {/* KPI 2: AVERAGE RSI (14) */}
          <div
            style={{
              background: 'transparent',
              border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
              borderLeft: `3px solid ${pulseMetrics.avgRsiNum >= 50 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)'}`,
              borderRadius: '10px',
              padding: '10px 14px',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted, #94a3b8)' }}>
              {tx('RSI PROMEDIO (14D)', 'AVERAGE RSI (14D)')}
            </div>
            <div
              className="mono-metric"
              style={{
                fontSize: '19px',
                fontWeight: 900,
                color: pulseMetrics.avgRsiNum >= 50 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                marginTop: '3px',
              }}
            >
              {pulseMetrics.avgRsi}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim, #64748b)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {pulseMetrics.avgRsiNum > 60
                ? tx('Predominio comprador fuerte (>60)', 'Strong buyer dominance (>60)')
                : pulseMetrics.avgRsiNum >= 45
                  ? tx('Mercado equilibrado • Empuje moderado', 'Balanced market • Moderate push')
                  : tx('Predominio vendedor (<45)', 'Seller dominance (<45)')}
            </div>
          </div>

          {/* KPI 3: P-06 ISOLATION FOREST REGIME */}
          <div
            style={{
              background: 'transparent',
              border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
              borderLeft: '3px solid #10b981',
              borderRadius: '10px',
              padding: '10px 14px',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted, #94a3b8)' }}>
              {tx('RÉGIMEN NORMAL (P-06)', 'NORMAL REGIME (P-06)')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 8px', marginTop: '3px' }}>
              <span className="mono-metric" style={{ fontSize: '19px', fontWeight: 900, color: 'var(--accent, #10b981)' }}>
                {pulseMetrics.normalPct}%
              </span>
              <span className="mono-metric" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted, #94a3b8)' }}>
                ({pulseMetrics.normalCount}/{pulseMetrics.totalCount})
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim, #64748b)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {pulseMetrics.topAnomaly
                ? txTpl(
                    'Mayoría sin sobresaltos • Atípico hoy: {0} ({1})',
                    [pulseMetrics.topAnomaly.sym, pulseMetrics.topAnomaly.anomalyScore.toFixed(2)],
                    'Mostly calm • Outlier today: {0} ({1})',
                    [pulseMetrics.topAnomaly.sym, pulseMetrics.topAnomaly.anomalyScore.toFixed(2)]
                  )
                : tx('Mercado sin sobresaltos estadísticos', 'Market within normal statistical bounds')}
            </div>
          </div>

          {/* KPI 4: TOP VOLUME Z-SCORE DISLOCATIONS */}
          <div
            style={{
              background: 'transparent',
              border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
              borderLeft: `3px solid ${(pulseMetrics.topDislocations[0]?.volumeZNum ?? 1) >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)'}`,
              borderRadius: '10px',
              padding: '10px 14px',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted, #94a3b8)' }}>
              {tx('MAYOR DESVÍO VOLUMEN (20D)', 'TOP VOLUME Z-SCORE (20D)')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 8px', marginTop: '3px' }}>
              <span
                className="mono-metric"
                style={{
                  fontSize: '19px',
                  fontWeight: 900,
                  color: (pulseMetrics.topDislocations[0]?.volumeZNum ?? 1) >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                }}
              >
                {pulseMetrics.topDislocations[0] ? pulseMetrics.topDislocations[0].volumeZScore : '—'}
              </span>
              {pulseMetrics.topDislocations[0] && (
                <span className="mono-metric" style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main, #f8fafc)' }}>
                  {pulseMetrics.topDislocations[0].sym}
                </span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim, #64748b)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tx('Volumen inusual:', 'Unusual volume:')}{' '}
              {pulseMetrics.topDislocations
                .slice(1, 3)
                .map((d) => `${d.sym} (${d.volumeZScore})`)
                .join(' • ')}
            </div>
          </div>
        </div>

        {/* PROPUESTA P07: DEDICATED 4 MINI-CARDS STRIP BELOW THE 4 PULSE CARDS */}
        {marketsToolsMode === 'v7-cards-strip' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', flexShrink: 0 }}>
            {MAIN_TOOLS_ITEMS.map((tool) => (
              <HoverTooltip key={tool.id} title={tool.label} description={tool.desc} badge={tool.badge} placement="bottom">
                <div
                  onClick={tool.action}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.9rem',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.24))',
                    backdropFilter: 'blur(2px)',
                    border: '1px solid rgba(var(--ui-accent-rgb), 0.32)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.15rem',
                  }}
                >
                  <span style={{ fontSize: '0.73rem', fontWeight: 800, color: 'var(--text-main, #ffffff)' }}>{tool.label}</span>
                  <span className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--ui-accent)' }}>{tool.badge} ↗</span>
                </div>
              </HoverTooltip>
            ))}
          </div>
        )}

        {/* 1.2 VIEW SWITCHER + MAIN TOOLS (CONFIGURABLE VIA DEV PROPOSALS P01-P08) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.55rem',
            flexShrink: 0,
          }}
        >
          {/* Row 1: View Mode Switcher (Table / Orbital / Heatmap / Main Tools) in V010 Ghost Style */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.65rem', flexWrap: 'wrap', width: '100%' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                padding: '0.18rem 0',
                border: 'none',
                gap: '1.35rem',
              }}
            >
              {[
                {
                  id: 'table',
                  label: tx('Tabla', 'Table'),
                  desc: tx('Tabla con buscador integrado, sparklines 24h y métricas por clase de activo.', 'Table with integrated search, 24h sparklines, and asset-class specific metrics.'),
                },
                {
                  id: 'orbital',
                  label: tx('Orbital', 'Orbital'),
                  desc: tx('Topología orbital de 3 anillos concéntricos impulsada por el indicador seleccionado.', '3-ring concentric orbital topology driven by the selected indicator.'),
                },
                {
                  id: 'heatmap',
                  label: tx('Mapa de Calor', 'Heatmap'),
                  desc: tx('Mosaico proporcional de mercado coloreado según la métrica cuantitativa elegida.', 'Proportional market treemap colored by the selected quantitative metric.'),
                },
                ...(marketsToolsMode === 'v4-tab'
                  ? [
                      {
                        id: 'tools',
                        label: tx('Herramientas', 'Main Tools'),
                        desc: tx('Lanzador de curvas soberanas, superficie de volatilidad, payoffs y FX.', 'Launcher for 3D sovereign curves, volatility surfaces, options payoffs, and FX.'),
                      },
                    ]
                  : []),
              ].map((mode) => {
                const active = visualMode === mode.id;
                return (
                  <HoverTooltip
                    key={mode.id}
                    title={mode.label}
                    placement="bottom-left"
                  >
                    <button
                      onClick={() => setVisualMode(mode.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '14.5px',
                        fontWeight: active ? 800 : 600,
                        padding: '0.18rem 0.25rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: active ? 'var(--ui-accent)' : 'var(--text-muted, rgba(148, 163, 184, 0.65))',
                        textShadow: active ? '0 0 15px rgba(var(--ui-accent-rgb), 0.88)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{mode.label}</span>
                    </button>
                  </HoverTooltip>
                );
              })}
            </div>

            {/* PROPUESTA P02 (v2-right-bar) OR PROPUESTA P06 (v2-contextual): Horizontal Main Tools in V010 Ghost Style */}
            {(marketsToolsMode === 'v2-right-bar' || (marketsToolsMode === 'v2-contextual' && contextualTools.length > 0)) && (
              <div
                style={{
                  marginLeft: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  padding: '0.18rem 0',
                  border: 'none',
                  gap: '1.15rem',
                  flexWrap: 'wrap',
                }}
              >
                {(marketsToolsMode === 'v2-right-bar' ? MAIN_TOOLS_ITEMS : contextualTools).map((qBtn) => (
                  <HoverTooltip key={qBtn.id} title={qBtn.label} placement="bottom-right">
                    <button
                      type="button"
                      onClick={qBtn.action}
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        padding: '0.18rem 0.25rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted, rgba(148, 163, 184, 0.78))',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {qBtn.label}
                    </button>
                  </HoverTooltip>
                ))}
              </div>
            )}

            {/* PROPUESTA P03: Compact 'Main Tools ▾' Dropdown Button Centered Vertically on the Right */}
            {marketsToolsMode === 'v3-dropdown' && (
              <div style={{ marginLeft: 'auto', position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <HoverTooltip
                  title="Main Tools"
                  description={
                    tx('Despliega los 4 motores especiales: Curva Soberana 3D, Superficie Vol 3D, Payoff P&L y Conversor FX.', 'Opens the 4 specialized quant engines: 3D Sovereign Curve, 3D Vol Surface, Options Payoff & FX Converter.')
                  }
                  badge="4 ENGINES"
                  placement="bottom-right"
                  disabled={toolsDropdownOpen}
                >
                  <button
                    type="button"
                    onClick={() => setToolsDropdownOpen((prev) => !prev)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.42rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.34rem 0.95rem',
                      borderRadius: '999px',
                      backgroundColor: toolsDropdownOpen ? 'rgba(var(--ui-accent-rgb), 0.22)' : 'var(--bg-glass-strong, rgba(8, 12, 22, 0.24))',
                      backdropFilter: 'blur(2px)',
                      border: '1px solid rgba(var(--ui-accent-rgb), 0.38)',
                      color: 'var(--text-main, #ffffff)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Sparkles size={13} style={{ color: 'var(--ui-accent)' }} />
                    <span>Main Tools</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--ui-accent)' }}>{toolsDropdownOpen ? '▴' : '▾'}</span>
                  </button>
                </HoverTooltip>

                {toolsDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.45rem)',
                      right: 0,
                      zIndex: 80,
                      minWidth: '290px',
                      padding: '0.55rem',
                      borderRadius: '16px',
                      backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.92))',
                      backdropFilter: 'blur(14px)',
                      border: '1px solid rgba(var(--ui-accent-rgb), 0.38)',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem',
                    }}
                  >
                    {MAIN_TOOLS_ITEMS.map((qBtn) => (
                      <button
                        key={qBtn.id}
                        type="button"
                        onClick={() => {
                          setToolsDropdownOpen(false);
                          qBtn.action();
                        }}
                        style={{
                          textAlign: 'left',
                          padding: '0.5rem 0.7rem',
                          borderRadius: '11px',
                          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          color: 'var(--text-main)',
                          fontSize: '0.71rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {qBtn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <ExportFormatButton
              format="CSV"
              onClick={handleExportScreenerCsv}
              title={tx('Exportar tabla filtrada a CSV', 'Export filtered table to CSV')}
              style={{
                marginLeft:
                  marketsToolsMode === 'v2-right-bar' ||
                  (marketsToolsMode === 'v2-contextual' && contextualTools.length > 0) ||
                  marketsToolsMode === 'v3-dropdown'
                    ? '4px'
                    : 'auto',
              }}
            />
          </div>

          {/* Row 2: Indicator Driver Selector + Integrated Asset Search Combobox (Appears BELOW when Orbital or Heatmap is selected) */}
          {(visualMode === 'orbital' || visualMode === 'heatmap') && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: '0.65rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '2px 0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="mono-metric"
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'var(--text-dim, #64748b)',
                  }}
                >
                  {tx('INDICADOR:', 'INDICATOR:')}
                </span>

                {METRIC_OPTIONS.map((m) => {
                  const active = activeMetric === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setActiveMetric(m.id)}
                      style={{
                        fontSize: '12.5px',
                        fontWeight: active ? 800 : 600,
                        padding: '2px 4px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: active ? 'var(--ui-accent)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                        textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb), 0.85)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {/* Searchable Asset Combobox for Orbital & Heatmap Modes (with Master Watchlist Star to the left) */}
              <div style={{ position: 'relative', minWidth: '270px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {(() => {
                  const allFilteredStarred =
                    screenerRows.length > 0 && screenerRows.every((r) => watchlistSyms.includes(r.sym));
                  return (
                    <button
                      type="button"
                      disabled={screenerRows.length === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!onToggleWatchlist || screenerRows.length === 0) return;
                        const syms = screenerRows.map((r) => r.sym);
                        onToggleWatchlist(syms, allFilteredStarred ? 'remove' : 'add');
                      }}
                      title={
                        allFilteredStarred
                          ? tx(
                              `Quitar los ${screenerRows.length} activos filtrados de Watchlist`,
                              `Remove ${screenerRows.length} filtered assets from Watchlist`
                            )
                          : tx(
                              `Sumar los ${screenerRows.length} activos filtrados a Watchlist`,
                              `Add ${screenerRows.length} filtered assets to Watchlist`
                            )
                      }
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: screenerRows.length === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        lineHeight: 1,
                        color: allFilteredStarred
                          ? 'var(--ui-accent, #10b981)'
                          : 'var(--text-muted, rgba(148, 163, 184, 0.55))',
                        flexShrink: 0,
                      }}
                    >
                      {allFilteredStarred ? '★' : '☆'}
                    </button>
                  );
                })()}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.42rem',
                    backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.48))',
                    backdropFilter: 'blur(4px)',
                    padding: '0.28rem 0.75rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(var(--ui-accent-rgb), 0.35)',
                    width: '100%',
                  }}
                >
                  <Search size={12} style={{ color: 'var(--ui-accent)', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder={tx('Buscar activo (↑↓ Enter)...', 'Search ticker or asset (↑↓ Enter)...')}
                    value={assetSearch}
                    onFocus={() => setL1VisualSearchOpen(true)}
                    onBlur={() => setTimeout(() => setL1VisualSearchOpen(false), 160)}
                    onChange={(e) => {
                      setAssetSearch(e.target.value);
                      setL1SelectedIndex(0);
                      setL1VisualSearchOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (!screenerRows.length) return;
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextIdx = (l1SelectedIndex + 1) % screenerRows.length;
                        setL1SelectedIndex(nextIdx);
                        setHoveredAsset(screenerRows[nextIdx].sym);
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevIdx = (l1SelectedIndex - 1 + screenerRows.length) % screenerRows.length;
                        setL1SelectedIndex(prevIdx);
                        setHoveredAsset(screenerRows[prevIdx].sym);
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        const target = screenerRows[l1SelectedIndex] || screenerRows[0];
                        if (target) {
                          setL1VisualSearchOpen(false);
                          handleOpenAssetDetail(target.sym);
                        }
                      } else if (e.key === 'Escape') {
                        setAssetSearch('');
                        setL1VisualSearchOpen(false);
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      fontSize: '0.68rem',
                      outline: 'none',
                      width: '100%',
                    }}
                  />
                  {assetSearch && (
                    <button
                      type="button"
                      onClick={() => setAssetSearch('')}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0, display: 'flex' }}
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>

                {l1VisualSearchOpen && screenerRows.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      width: '310px',
                      maxHeight: '240px',
                      overflowY: 'auto',
                      borderRadius: '14px',
                      backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.96))',
                      backdropFilter: 'blur(14px)',
                      border: '1px solid rgba(var(--ui-accent-rgb), 0.38)',
                      boxShadow: '0 16px 38px rgba(0,0,0,0.75)',
                      padding: '0.32rem',
                      zIndex: 85,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.16rem',
                    }}
                  >
                    {screenerRows.slice(0, 10).map((item, idx) => {
                      const activeRow = idx === l1SelectedIndex;
                      return (
                        <button
                          key={item.sym}
                          type="button"
                          onMouseEnter={() => {
                            setL1SelectedIndex(idx);
                            setHoveredAsset(item.sym);
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setL1VisualSearchOpen(false);
                            handleOpenAssetDetail(item.sym);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.45rem',
                            padding: '0.38rem 0.55rem',
                            borderRadius: '9px',
                            border: activeRow ? '1px solid rgba(var(--ui-accent-rgb), 0.45)' : '1px solid transparent',
                            backgroundColor: activeRow ? 'rgba(var(--ui-accent-rgb), 0.16)' : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                            <span className="mono-metric" style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-main, #ffffff)', minWidth: '48px' }}>
                              {item.sym}
                            </span>
                            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.name}
                            </span>
                          </div>
                          <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 700, color: item.chgNum >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)', flexShrink: 0 }}>
                            {item.chg}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* MODE 4 (HÍBRIDO HB-05): 3-COLUMN PROGRESSIVE MAIN TOOLS WORKBENCH   */}
        {/* [1. Clase de Activo] → [2. Instrumento Principal & Explicación] →    */}
        {/* [3. Vista Previa Vectorial & Lanzador por Buscador]                  */}
        {/* ==================================================================== */}
        {visualMode === 'tools' && (() => {
          const ASSET_CLASS_LANES = [
            {
              laneId: 'LANE_RATES',
              title: tx('Tasas, Bonos & Liquidez', 'Rates, Bonds & Cash'),
              subtitle: tx('Curvas Soberanas 3D & Spreads', '3D Sovereign Curves & Spreads'),
              cats: ['RATES', 'FIXED_INCOME', 'CASH'],
              sharedLabels: txList(['Tasas & Curvas', 'Bonos US Treasury', 'Cash & SOFR'], ['Rates & Curves', 'US Treasuries', 'Cash & SOFR']),
              isShared: true,
            },
            {
              laneId: 'LANE_EQUITY_DERIV',
              title: tx('Derivados, Acciones, Índices & Crypto', 'Derivatives, Equities, Indices & Crypto'),
              subtitle: tx('Superficie IV 3D & Payoff Multi-Leg', '3D IV Surface & Multi-Leg Payoff'),
              cats: ['DERIVATIVES_VOL', 'EQUITY', 'INDEX', 'ETF', 'CRYPTO'],
              sharedLabels: txList(['Derivados & Vol', 'Acciones', 'Índices', 'ETFs', 'Crypto'], ['Derivatives & Vol', 'Equities', 'Indices', 'ETFs', 'Crypto']),
              isShared: true,
            },
            {
              laneId: 'LANE_FX',
              title: tx('Divisas (FX Currencies)', 'FX Currencies'),
              subtitle: tx('Matriz 61 Monedas & Carry Trade', '61-Currency Matrix & Carry Trade'),
              cats: ['FX'],
              sharedLabels: txList(['Divisas (FX)'], ['FX Currencies']),
              isShared: false,
            },
            {
              laneId: 'LANE_COMMODITIES',
              title: tx('Materias Primas (Commodities)', 'Commodities'),
              subtitle: tx('Curva Forward 3D/2D & Roll Yield', '3D/2D Forward Curve & Roll Yield'),
              cats: ['COMMODITY'],
              sharedLabels: txList(['Materias Primas'], ['Commodities']),
              isShared: false,
            },
          ];

          // If user filtered a specific asset class in bar 1.0, prioritize its matching lane
          const categoryMatchedTool =
            categoryFilter !== 'ALL' && categoryFilter !== 'WATCHLIST'
              ? MAIN_TOOLS_ITEMS.find((t) => t.cats.includes(categoryFilter))
              : null;

          const focusedTool =
            MAIN_TOOLS_ITEMS.find((x) => x.id === previewToolId) ||
            categoryMatchedTool ||
            MAIN_TOOLS_ITEMS[0];

          const activeLaneId = focusedTool.swimlaneId;
          const siblingToolsInLane = MAIN_TOOLS_ITEMS.filter((t) => t.swimlaneId === activeLaneId);

          // Compatible assets for the focused tool (used by the Searchable Combobox in Column 3)
          const compatibleToolAssets = enrichedCatalog.filter((a) => focusedTool.cats.includes(a.cat));
          const defaultToolSym =
            focusedTool.id === 'sovereign-curve'
              ? 'US10Y'
              : focusedTool.id === 'fx-cross'
                ? 'EUR/USD'
                : focusedTool.id === 'commodity-forward-3d'
                  ? 'CL'
                  : 'NVDA-OPT';

          const effectivePreviewAsset =
            compatibleToolAssets.find((a) => a.sym === toolPreviewSym) ||
            compatibleToolAssets.find((a) => a.sym === defaultToolSym) ||
            compatibleToolAssets[0] ||
            enrichedCatalog[0];

          const filteredToolMatches = compatibleToolAssets
            .filter((a) => {
              if (!toolSearchQuery.trim()) return true;
              const q = toolSearchQuery.toLowerCase();
              return (
                a.sym.toLowerCase().includes(q) ||
                a.name.toLowerCase().includes(q) ||
                a.cat.toLowerCase().includes(q) ||
                (a.countryCode && a.countryCode.toLowerCase().includes(q))
              );
            })
            .slice(0, 14);

          // Dynamically compute live preview telemetry & chart series for `effectivePreviewAsset`
          let dynStatLabel = focusedTool.liveStat;
          let dynStatValue = focusedTool.liveValue;
          let dynStatColor = focusedTool.liveColor;
          let dynSeriesLegend = [];
          let dynPreviewData = [];
          let dynYFormatter = (v) => v;

          if (focusedTool.svgType === 'mesh-rates') {
            const ctry =
              effectivePreviewAsset.countryCode && SOVEREIGN_YIELD_CURVES[effectivePreviewAsset.countryCode]
                ? effectivePreviewAsset.countryCode
                : 'US';
            const curveObj = computeSovereignCurveMetrics(ctry);
            dynStatLabel = `${ctry} 10Y (${effectivePreviewAsset.sym}) • 2s10s`;
            dynStatValue = `${curveObj.y10}% (${curveObj.spread2s10sBps >= 0 ? '+' : ''}${curveObj.spread2s10sBps} bps)`;
            dynStatColor = curveObj.spread2s10sBps >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)';
            dynSeriesLegend = [
              { label: `${ctry} Spot Curve`, color: dynStatColor, dashed: false },
              { label: ctry === 'US' ? '1M Historical (-1M)' : 'US10Y Benchmark', color: 'var(--info-text, #38bdf8)', dashed: true },
              { label: 'DE10Y Bund', color: 'var(--purple-text, #a78bfa)', dashed: false },
            ];
            dynPreviewData = curveObj.curveSeries.map((pt) => ({
              time: pt.tenor,
              s0: pt.yield,
              s1: ctry === 'US' ? Number((pt.yield - 0.18).toFixed(2)) : pt.ustYield,
              s2: pt.bundYield,
            }));
            dynYFormatter = (v) => `${v}%`;
          } else if (focusedTool.svgType === 'vol-smile') {
            const undSym = (effectivePreviewAsset.underlyingSym || effectivePreviewAsset.sym).replace(/-OPT$/, '');
            const catAsset = ASSET_CATALOG.find((a) => a.sym === undSym) || effectivePreviewAsset;
            const spot = catAsset ? catAsset.price : 140;
            const chain = getHighVolumeOptionsChain(undSym, spot);
            dynStatLabel = `${effectivePreviewAsset.sym} • ATM IV (30D)`;
            dynStatValue = `${chain.atmIvPct}% (Skew ${chain.skew25d})`;
            dynStatColor = 'var(--purple-text, #a855f7)';
            dynSeriesLegend = [
              { label: `${undSym} 30D IV Smile`, color: 'var(--purple-text, #a855f7)', dashed: false },
              { label: `${undSym} 90D Term IV`, color: 'var(--info-text, #38bdf8)', dashed: true },
            ];
            dynPreviewData = chain.strikes.map((st) => ({
              time: st.moneyness,
              s0: st.iv30d,
              s1: st.iv90d,
            }));
            dynYFormatter = (v) => `${v}%`;
          } else if (focusedTool.svgType === 'payoff') {
            const undSym = (effectivePreviewAsset.underlyingSym || effectivePreviewAsset.sym).replace(/-OPT$/, '');
            const catAsset = ASSET_CATALOG.find((a) => a.sym === undSym) || effectivePreviewAsset;
            const spot = catAsset ? catAsset.price : 140;
            const pData = computeOptionsStrategyPayoff(undSym, spot, 'LONG_STRADDLE');
            dynStatLabel = `${effectivePreviewAsset.sym} • Long Straddle`;
            dynStatValue = `BE ${pData.breakevenText} • Γ ${pData.greeks.gamma}`;
            dynStatColor = 'var(--accent, #10b981)';
            dynSeriesLegend = [
              { label: tx('P&L al Vencimiento ($)', 'Expiration P&L ($)'), color: 'var(--accent, #10b981)', dashed: false },
              { label: tx('P&L Hoy (T+0 BS)', 'Today P&L (T+0 BS)'), color: 'var(--info-text, #38bdf8)', dashed: true },
              { label: tx('Equilibrio ($0)', 'Breakeven ($0)'), color: 'var(--text-muted, rgba(255,255,255,0.5))', dashed: true },
            ];
            dynPreviewData = pData.payoffSeries.map((pt) => ({
              time: pt.time,
              s0: pt.price,
              s1: pt.t0Pnl,
              s2: pt.zeroLine,
            }));
            dynYFormatter = (v) => `$${v}`;
          } else if (focusedTool.svgType === 'fx-matrix') {
            const parts = effectivePreviewAsset.sym.includes('/') ? effectivePreviewAsset.sym.split('/') : ['EUR', 'USD'];
            const b = WORLD_USD_RATES[parts[0]] ? parts[0] : 'EUR';
            const q = WORLD_USD_RATES[parts[1]] ? parts[1] : 'USD';
            const crossObj = computeCrossCurrencyRate(b, q, 1000);
            dynStatLabel = `${b} / ${q} • Carry 10Y`;
            dynStatValue = `${crossObj.rateFormatted} (${crossObj.carryFormatted})`;
            dynStatColor = crossObj.carryDiffBps >= 0 ? 'var(--accent, #10b981)' : 'var(--info-text, #38bdf8)';
            dynSeriesLegend = [
              { label: `${b}/${q} Spot`, color: dynStatColor, dashed: false },
              { label: 'SMA (20)', color: 'var(--info-text, #38bdf8)', dashed: true },
            ];
            dynPreviewData = crossObj.crossSeries.slice(-20).map((pt) => ({
              time: pt.time,
              s0: pt.price,
              s1: pt.sma20,
            }));
            dynYFormatter = (v) => Number(v).toFixed(q === 'JPY' ? 1 : 3);
          } else {
            const sym = effectivePreviewAsset.sym;
            const spot = effectivePreviewAsset.price || 68.4;
            const fwdObj = getCommodityForwardCurve(sym, spot);
            dynStatLabel = `${sym} • Roll Yield (1Y)`;
            dynStatValue = `${effectivePreviewAsset.priceFormatted} (${fwdObj.rollYieldAnnual} ${fwdObj.regime})`;
            dynStatColor = fwdObj.isBackwardation ? 'var(--accent, #10b981)' : 'var(--warn-text, #f59e0b)';
            dynSeriesLegend = [
              { label: `${sym} Forward Curve (M1→M24)`, color: dynStatColor, dashed: false },
              { label: tx('Referencia Spot', 'Spot Reference'), color: 'var(--info-text, #38bdf8)', dashed: true },
            ];
            dynPreviewData = fwdObj.curveSeries.map((pt) => ({
              time: pt.time,
              s0: pt.price,
              s1: pt.sma20,
            }));
            dynYFormatter = (v) => `$${v}`;
          }

          const hasS2 = dynPreviewData.some((d) => d.s2 !== undefined);
          const c0 = dynSeriesLegend[0]?.color || dynStatColor;
          const c1 = dynSeriesLegend[1]?.color || 'var(--info-text, #38bdf8)';
          const c2 = dynSeriesLegend[2]?.color || 'var(--purple-text, #a78bfa)';

          const handleLaunchPreviewedTool = () => {
            setL2Section('analytics');
            setAnalysisLens('derivatives');
            if (focusedTool.id === 'sovereign-curve') {
              setRatesSubView('3d-history');
              const ctry =
                effectivePreviewAsset.countryCode && SOVEREIGN_YIELD_CURVES[effectivePreviewAsset.countryCode]
                  ? effectivePreviewAsset.countryCode
                  : 'US';
              handleOpenAssetDetail(effectivePreviewAsset.sym, 'derivatives', { country: ctry });
            } else if (focusedTool.id === 'vol-surface-3d') {
              setOptionsSubView('surface3d');
              handleOpenAssetDetail(effectivePreviewAsset.sym, 'derivatives');
            } else if (focusedTool.id === 'options-payoff') {
              setOptionsSubView('payoff');
              handleOpenAssetDetail(effectivePreviewAsset.sym, 'derivatives');
            } else if (focusedTool.id === 'fx-cross') {
              const parts = effectivePreviewAsset.sym.includes('/') ? effectivePreviewAsset.sym.split('/') : ['EUR', 'USD'];
              handleOpenAssetDetail(effectivePreviewAsset.sym, 'derivatives', {
                fxBase: WORLD_USD_RATES[parts[0]] ? parts[0] : 'EUR',
                fxQuote: WORLD_USD_RATES[parts[1]] ? parts[1] : 'USD',
              });
            } else {
              setCommoditySubView('3d');
              handleOpenAssetDetail(effectivePreviewAsset.sym, 'derivatives');
            }
          };

          return (
            <div
              className="resp-tools-3col"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(275px, 0.9fr) minmax(360px, 1.35fr) minmax(310px, 1.05fr)',
                gap: '0.95rem',
                width: '100%',
                alignItems: 'stretch',
              }}
            >
              {/* COLUMN 1: CLASES DE ACTIVO (SWIMLANE FAMILIES & SHARED ASSET TAGS — CLICK ONLY) */}
              <div
                style={{
                  padding: '1.15rem 1.2rem',
                  borderRadius: '22px',
                  backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.24))',
                  backdropFilter: 'blur(2px)',
                  border: '1px solid rgba(var(--ui-accent-rgb), 0.28)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))', paddingBottom: '0.5rem' }}>
                  <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--ui-accent)', letterSpacing: '0.06em' }}>
                    {tx('1. CLASES DE ACTIVO', '1. ASSET CLASSES')}
                  </span>
                  <span className="mono-metric" style={{ fontSize: '0.54rem', color: 'var(--text-dim)' }}>
                    {tx('4 FAMILIAS', '4 FAMILIES')}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1, justifyContent: 'space-between' }}>
                  {ASSET_CLASS_LANES.map((lane) => {
                    const isSelectedLane = activeLaneId === lane.laneId;
                    const primaryToolForLane = MAIN_TOOLS_ITEMS.find((t) => t.swimlaneId === lane.laneId);
                    return (
                      <div
                        key={lane.laneId}
                        onClick={() => {
                          if (primaryToolForLane) {
                            setPreviewToolId(primaryToolForLane.id);
                            setSelectedToolPresetIdx(0);
                            const nextDef =
                              primaryToolForLane.id === 'sovereign-curve'
                                ? 'US10Y'
                                : primaryToolForLane.id === 'fx-cross'
                                  ? 'EUR/USD'
                                  : primaryToolForLane.id === 'commodity-forward-3d'
                                    ? 'CL'
                                    : 'NVDA-OPT';
                            setToolPreviewSym(nextDef);
                            setToolSearchQuery('');
                          }
                        }}
                        style={{
                          padding: '0.78rem 0.9rem',
                          borderRadius: '15px',
                          backgroundColor: isSelectedLane ? 'rgba(var(--ui-accent-rgb), 0.16)' : 'var(--bg-elevated-soft, rgba(10, 15, 26, 0.42))',
                          border: isSelectedLane
                            ? '1.5px solid var(--ui-accent)'
                            : '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                          cursor: 'pointer',
                          transition: 'all 0.16s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: isSelectedLane ? 'var(--text-main, #ffffff)' : 'var(--text-main)' }}>
                            {lane.title}
                          </span>
                          <span
                            className="mono-metric"
                            style={{
                              fontSize: '0.48rem',
                              padding: '0.1rem 0.42rem',
                              borderRadius: '999px',
                              backgroundColor: lane.isShared ? 'rgba(var(--ui-accent-rgb), 0.15)' : 'rgba(255,255,255,0.07)',
                              color: lane.isShared ? 'var(--ui-accent)' : 'var(--text-muted)',
                              fontWeight: 800,
                            }}
                          >
                            {lane.isShared ? (tx('COMPARTIDO', 'SHARED')) : tx('EXCLUSIVO', 'DEDICATED')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {lane.sharedLabels.map((lbl) => (
                            <span
                              key={lbl}
                              className="mono-metric"
                              style={{
                                fontSize: '0.52rem',
                                padding: '0.08rem 0.4rem',
                                borderRadius: '999px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
                                color: 'var(--text-dim)',
                              }}
                            >
                              {lbl}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COLUMN 2: INSTRUMENTO PRINCIPAL & EXPLICACIÓN PEDAGÓGICA */}
              <div
                style={{
                  padding: '1.25rem 1.45rem',
                  borderRadius: '22px',
                  backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.24))',
                  backdropFilter: 'blur(2px)',
                  border: '1px solid rgba(var(--ui-accent-rgb), 0.32)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))', paddingBottom: '0.5rem' }}>
                    <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--ui-accent)', letterSpacing: '0.06em' }}>
                      {tx('2. INSTRUMENTO PRINCIPAL & EXPLICACIÓN', '2. PRINCIPAL INSTRUMENT & GUIDE')}
                    </span>

                    {/* If the lane has 2 shared instruments (Derivatives/Equities: 3D Vol Surface vs Payoff), let user switch */}
                    {siblingToolsInLane.length > 1 && (
                      <div style={{ display: 'inline-flex', gap: '0.25rem', padding: '0.16rem', borderRadius: '999px', backgroundColor: 'var(--bg-elevated-soft, rgba(10,15,26,0.65))', border: '1px solid rgba(var(--ui-accent-rgb), 0.3)' }}>
                        {siblingToolsInLane.map((sib) => {
                          const activeSib = sib.id === focusedTool.id;
                          return (
                            <button
                              key={sib.id}
                              type="button"
                              onClick={() => {
                                setPreviewToolId(sib.id);
                                setSelectedToolPresetIdx(0);
                              }}
                              className="mono-metric"
                              style={{
                                padding: '0.18rem 0.55rem',
                                borderRadius: '999px',
                                border: 'none',
                                fontSize: '0.54rem',
                                fontWeight: activeSib ? 800 : 600,
                                backgroundColor: activeSib ? 'rgba(var(--ui-accent-rgb), 0.22)' : 'transparent',
                                color: activeSib ? 'var(--ui-accent)' : 'var(--text-dim)',
                                cursor: 'pointer',
                              }}
                            >
                              {sib.id === 'vol-surface-3d' ? (tx('📐 Superficie IV 3D', '📐 3D IV Surface')) : tx('⚡ Simulador Payoff', '⚡ Payoff Lab')}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <span
                      className="mono-metric"
                      style={{
                        fontSize: '0.56rem',
                        fontWeight: 800,
                        color: 'var(--ui-accent)',
                        padding: '0.14rem 0.52rem',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(var(--ui-accent-rgb), 0.14)',
                        border: '1px solid rgba(var(--ui-accent-rgb), 0.32)',
                      }}
                    >
                      {focusedTool.badge}
                    </span>
                    <h3 style={{ margin: '0.55rem 0 0.3rem 0', fontSize: '1.22rem', fontWeight: 800, color: 'var(--text-main, #ffffff)', lineHeight: 1.25 }}>
                      {focusedTool.label}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.48 }}>
                      {focusedTool.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '0.8rem 0.95rem',
                      borderRadius: '14px',
                      backgroundColor: 'var(--bg-elevated-soft, rgba(10, 15, 26, 0.52))',
                      border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                    }}
                  >
                    <strong style={{ color: 'var(--ui-accent)' }}>
                      {tx('¿Qué muestra y cómo orientarse? ', 'What it shows & how to read it: ')}
                    </strong>
                    {focusedTool.howItWorks}
                  </div>
                </div>

                {/* Bottom of Col 2: Axes & Shared Asset Classes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.07))' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {focusedTool.keyAxes.map((ax) => (
                      <span
                        key={ax}
                        className="mono-metric"
                        style={{
                          fontSize: '0.56rem',
                          padding: '0.18rem 0.52rem',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
                          color: 'var(--text-dim)',
                        }}
                      >
                        {ax}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                    <span className="mono-metric" style={{ fontSize: '0.54rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                      {focusedTool.isShared ? (tx('ACTIVOS QUE LO COMPARTEN:', 'SHARED ACROSS:')) : tx('CLASE DE ACTIVO:', 'ASSET CLASS:')}
                    </span>
                    {focusedTool.sharedAssetClasses.map((ac) => (
                      <span
                        key={ac}
                        className="mono-metric"
                        style={{
                          fontSize: '0.55rem',
                          fontWeight: 700,
                          padding: '0.12rem 0.48rem',
                          borderRadius: '999px',
                          backgroundColor: 'rgba(var(--ui-accent-rgb), 0.14)',
                          border: '1px solid rgba(var(--ui-accent-rgb), 0.35)',
                          color: 'var(--ui-accent)',
                        }}
                      >
                        {ac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMN 3: VISTA PREVIA VECTORIAL & LANZADOR POR BUSCADOR */}
              <div
                style={{
                  padding: '1.25rem 1.35rem',
                  borderRadius: '22px',
                  backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.26))',
                  backdropFilter: 'blur(2px)',
                  border: '1px solid rgba(var(--ui-accent-rgb), 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))', paddingBottom: '0.5rem' }}>
                  <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--ui-accent)', letterSpacing: '0.06em' }}>
                    {tx('3. VISTA PREVIA & LANZADOR', '3. PREVIEW & LAUNCHER')}
                  </span>
                  <span className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>
                    {focusedTool.dimension}
                  </span>
                </div>

                {/* Vector Chart Box */}
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-elevated-soft, rgba(10, 15, 26, 0.58))',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>
                      {dynStatLabel}
                    </span>
                    <span className="mono-metric" style={{ fontSize: '0.78rem', fontWeight: 800, color: dynStatColor }}>
                      {dynStatValue}
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '124px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dynPreviewData} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                        <defs>
                          <linearGradient id="toolPreviewGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={c0} stopOpacity={0.45} />
                            <stop offset="95%" stopColor={c0} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="time"
                          stroke="var(--text-dim)"
                          fontSize={9.5}
                          tickLine={false}
                          axisLine={false}
                          minTickGap={14}
                        />
                        <YAxis
                          domain={['auto', 'auto']}
                          stroke="var(--text-dim)"
                          fontSize={9.5}
                          orientation="right"
                          tickLine={false}
                          axisLine={false}
                          width={38}
                          tickFormatter={dynYFormatter}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-glass-strong, rgba(10, 15, 28, 0.94))',
                            borderColor: 'rgba(255, 255, 255, 0.14)',
                            borderRadius: '10px',
                            fontSize: '0.68rem',
                            padding: '0.4rem 0.6rem',
                          }}
                          itemStyle={{ padding: '1px 0', fontWeight: 700 }}
                          labelStyle={{ color: 'var(--text-main, #ffffff)', fontWeight: 800, marginBottom: '2px' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="s0"
                          name={dynSeriesLegend[0]?.label || 'Primary'}
                          stroke={c0}
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#toolPreviewGrad)"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="s1"
                          name={dynSeriesLegend[1]?.label || 'Secondary'}
                          stroke={c1}
                          strokeWidth={1.8}
                          strokeDasharray="4 3"
                          dot={false}
                        />
                        {hasS2 && (
                          <Line
                            type="monotone"
                            dataKey="s2"
                            name={dynSeriesLegend[2]?.label || 'Benchmark'}
                            stroke={c2}
                            strokeWidth={1.4}
                            strokeDasharray={focusedTool.svgType === 'payoff' ? '3 3' : undefined}
                            dot={false}
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Standard Inline Series Legend (No Popover) */}
                  {dynSeriesLegend.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.45rem 0.75rem',
                        paddingTop: '0.35rem',
                        borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                      }}
                    >
                      {dynSeriesLegend.map((s) => (
                        <div
                          key={s.label}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.32rem',
                          }}
                        >
                          <svg width="16" height="8" viewBox="0 0 16 8" style={{ flexShrink: 0 }}>
                            <line
                              x1="1"
                              y1="4"
                              x2="15"
                              y2="4"
                              stroke={s.color}
                              strokeWidth="2.2"
                              strokeDasharray={s.dashed ? '3 2' : undefined}
                            />
                          </svg>
                          <span
                            className="mono-metric"
                            style={{
                              fontSize: '0.53rem',
                              color: 'var(--text-muted)',
                              fontWeight: 700,
                            }}
                          >
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Searchable Asset Combobox (Replaces Hardcoded Preset Pills) */}
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className="mono-metric" style={{ fontSize: '0.55rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                      {tx('BUSCAR ACTIVO COMPATIBLE:', 'SEARCH COMPATIBLE ASSET:')}
                    </span>
                    <span
                      className="mono-metric"
                      style={{
                        fontSize: '0.56rem',
                        fontWeight: 800,
                        color: 'var(--ui-accent)',
                        padding: '0.08rem 0.48rem',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(var(--ui-accent-rgb), 0.16)',
                        border: '1px solid rgba(var(--ui-accent-rgb), 0.35)',
                      }}
                    >
                      ● {effectivePreviewAsset.sym} ({effectivePreviewAsset.cat})
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      backgroundColor: 'var(--bg-elevated, rgba(10, 15, 26, 0.85))',
                      border: '1px solid rgba(var(--ui-accent-rgb), 0.42)',
                      borderRadius: '999px',
                      padding: '0.36rem 0.8rem',
                    }}
                  >
                    <Search size={13} style={{ color: 'var(--ui-accent)', flexShrink: 0 }} />
                    <input
                      type="text"
                      value={toolSearchQuery}
                      onFocus={() => {
                        setToolSearchOpen(true);
                        setToolSearchIdx(0);
                      }}
                      onBlur={() => setTimeout(() => setToolSearchOpen(false), 160)}
                      onChange={(e) => {
                        setToolSearchQuery(e.target.value);
                        setToolSearchOpen(true);
                        setToolSearchIdx(0);
                      }}
                      onKeyDown={(e) => {
                        if (!filteredToolMatches.length) return;
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          setToolSearchIdx((prev) => (prev + 1) % filteredToolMatches.length);
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          setToolSearchIdx((prev) => (prev - 1 + filteredToolMatches.length) % filteredToolMatches.length);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          const chosen = filteredToolMatches[toolSearchIdx] || filteredToolMatches[0];
                          if (chosen) {
                            setToolPreviewSym(chosen.sym);
                            setToolSearchQuery('');
                            setToolSearchOpen(false);
                          }
                        } else if (e.key === 'Escape') {
                          setToolSearchOpen(false);
                        }
                      }}
                      placeholder={
                        txTpl("Buscar entre {0} activos compatibles (↑↓ Enter)...", [compatibleToolAssets.length], "Search across {0} compatible assets (↑↓ Enter)...", [compatibleToolAssets.length])
                      }
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-main, #ffffff)',
                        fontSize: '0.68rem',
                        width: '100%',
                      }}
                    />
                    {toolSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setToolSearchQuery('')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0, display: 'flex' }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {toolSearchOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        maxHeight: '220px',
                        overflowY: 'auto',
                        borderRadius: '14px',
                        backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.98))',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(var(--ui-accent-rgb), 0.45)',
                        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
                        padding: '0.35rem',
                        zIndex: 90,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.18rem',
                      }}
                    >
                      {filteredToolMatches.length === 0 ? (
                        <div className="mono-metric" style={{ padding: '0.5rem', fontSize: '0.62rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                          {tx('Sin activos compatibles para esta búsqueda', 'No compatible assets match this search')}
                        </div>
                      ) : (
                        filteredToolMatches.map((item, idx) => {
                          const isHighlighted = idx === toolSearchIdx;
                          const isCurrent = item.sym === effectivePreviewAsset.sym;
                          return (
                            <button
                              key={item.sym}
                              type="button"
                              onMouseEnter={() => setToolSearchIdx(idx)}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setToolPreviewSym(item.sym);
                                setToolSearchQuery('');
                                setToolSearchOpen(false);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.45rem',
                                padding: '0.4rem 0.58rem',
                                borderRadius: '9px',
                                border: isCurrent ? '1px solid rgba(var(--ui-accent-rgb), 0.5)' : '1px solid transparent',
                                backgroundColor: isCurrent || isHighlighted ? 'rgba(var(--ui-accent-rgb), 0.18)' : 'transparent',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.42rem', minWidth: 0 }}>
                                <span className="mono-metric" style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-main, #ffffff)', minWidth: '54px' }}>
                                  {item.sym}
                                </span>
                                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {item.name}
                                </span>
                              </div>
                              <div className="mono-metric" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                                <span style={{ fontSize: '0.5rem', padding: '0.06rem 0.35rem', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.07)', color: 'var(--text-dim)' }}>
                                  {item.cat}
                                </span>
                                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: item.chgNum >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)' }}>
                                  {item.priceFormatted}
                                </span>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                {/* Explicit Launch Button (ONLY this button opens the tool) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchPreviewedTool();
                  }}
                  className="mono-metric"
                  style={{
                    width: '100%',
                    padding: '0.64rem 1rem',
                    borderRadius: '999px',
                    border: '1px solid var(--ui-accent)',
                    backgroundColor: 'rgba(var(--ui-accent-rgb), 0.2)',
                    color: 'var(--ui-accent)',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {txTpl("Abrir herramienta con {0} ↗", [effectivePreviewAsset.sym], "Open tool with {0} ↗", [effectivePreviewAsset.sym])}
                </button>
              </div>
            </div>
          );
        })()}

        {/* ==================================================================== */}
        {/* MODE 1 (DEFAULT): FLAT TRANSPARENT TABLE WITH 1PX DIVIDERS (OPT 1)   */}
        {/* ==================================================================== */}
        {visualMode === 'table' && (
          <div
            className="resp-table-scroll-box"
            style={{
              width: '100%',
              borderRadius: '10px',
              border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
              backgroundColor: 'transparent',
              padding: '8px 14px 12px',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                borderSpacing: 0,
                fontSize: '13.5px',
                textAlign: 'right',
              }}
            >
              <thead>
                <tr
                  style={{
                    color: 'var(--text-dim, #64748b)',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: 'transparent',
                    borderBottom: '1px solid var(--border-slate, rgba(148, 163, 184, 0.16))',
                  }}
                >
                  {/* INTEGRATED MASTER WATCHLIST STAR + SEARCH INSIDE THE ASSET / TICKER COLUMN HEADER */}
                  <th style={{ padding: '6px 8px 10px', textAlign: 'left', minWidth: '245px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {(() => {
                        const allFilteredStarred =
                          screenerRows.length > 0 && screenerRows.every((r) => watchlistSyms.includes(r.sym));
                        return (
                          <button
                            type="button"
                            disabled={screenerRows.length === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!onToggleWatchlist || screenerRows.length === 0) return;
                              const syms = screenerRows.map((r) => r.sym);
                              onToggleWatchlist(syms, allFilteredStarred ? 'remove' : 'add');
                            }}
                            title={
                              allFilteredStarred
                                ? tx(
                                    `Quitar los ${screenerRows.length} activos filtrados de Watchlist`,
                                    `Remove ${screenerRows.length} filtered assets from Watchlist`
                                  )
                                : tx(
                                    `Sumar los ${screenerRows.length} activos filtrados a Watchlist`,
                                    `Add ${screenerRows.length} filtered assets to Watchlist`
                                  )
                            }
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: 0,
                              cursor: screenerRows.length === 0 ? 'not-allowed' : 'pointer',
                              fontSize: '13.5px',
                              lineHeight: 1,
                              color: allFilteredStarred
                                ? 'var(--ui-accent, #10b981)'
                                : 'var(--text-muted, rgba(148, 163, 184, 0.55))',
                              flexShrink: 0,
                              transition: 'color 0.15s ease, transform 0.15s ease',
                            }}
                          >
                            {allFilteredStarred ? '★' : '☆'}
                          </button>
                        );
                      })()}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: 'transparent',
                          border: assetSearch
                            ? '1px solid var(--ui-accent)'
                            : '1px solid var(--border-slate, rgba(148, 163, 184, 0.24))',
                          borderRadius: '7px',
                          padding: '4px 10px',
                          width: '215px',
                        }}
                      >
                        <Search size={12} strokeWidth={2.3} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                        <input
                          type="text"
                          placeholder={tx('Buscar ticker o activo...', 'Search ticker or asset...')}
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
                            fontSize: '12.5px',
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
                    </div>
                  </th>

                  <th onClick={() => handleSort('price')} style={{ padding: '6px 10px 10px', cursor: 'pointer' }}>
                    {tx('Precio', 'Price')}
                  </th>
                  <th onClick={() => handleSort('chg')} style={{ padding: '6px 10px 10px', cursor: 'pointer' }}>
                    24h %
                  </th>
                  <th style={{ padding: '6px 10px 10px', textAlign: 'center' }}>
                    {tx('Tendencia', 'Sparkline')}
                  </th>
                  <th onClick={() => handleSort('vol')} style={{ padding: '6px 10px 10px', cursor: 'pointer' }}>
                    {tx('Volumen (24h)', 'Volume (24h)')}
                  </th>
                  {categoryFilter === 'ALL' ? (
                    <>
                      <th onClick={() => handleSort('zscore')} style={{ padding: '6px 10px 10px', cursor: 'pointer' }}>
                        Vol Z-Score (20d)
                      </th>
                      <th onClick={() => handleSort('rvol')} style={{ padding: '6px 10px 10px', cursor: 'pointer' }}>
                        {tx('Vol. Realizada', 'Realized Vol')}
                      </th>
                    </>
                  ) : (
                    (() => {
                      const sampleSpec = getAssetClassSpecificMetrics(screenerRows[0] || { cat: categoryFilter }, isES);
                      return (
                        <>
                          <th style={{ padding: '6px 10px 10px', color: 'var(--accent, #10b981)' }}>{sampleSpec.col1Label}</th>
                          <th style={{ padding: '6px 10px 10px', color: 'var(--info-text, #38bdf8)' }}>{sampleSpec.col2Label}</th>
                        </>
                      );
                    })()
                  )}
                  <th onClick={() => handleSort('rsi')} style={{ padding: '6px 10px 10px', cursor: 'pointer' }}>
                    RSI (14)
                  </th>
                  <th
                    onClick={() => handleSort('anomaly')}
                    style={{ padding: '6px 10px 10px', cursor: 'pointer' }}
                  >
                    Anomaly Score (P-06)
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
                    backgroundColor: isKeyHighlighted ? 'rgba(var(--ui-accent-rgb), 0.14)' : 'transparent',
                    borderTop: isKeyHighlighted ? '1px solid var(--ui-accent)' : 'none',
                    borderBottom: isKeyHighlighted ? '1px solid var(--ui-accent)' : '1px solid var(--border-slate, rgba(148, 163, 184, 0.12))',
                  };

                  return (
                    <tr
                      key={row.sym}
                      onClick={() => handleOpenAssetDetail(row.sym)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* TICKER & NAME (FLAT TRANSPARENT ROW WITHOUT CIRCULAR AVATAR) */}
                      <td
                        style={{
                          ...cellBase,
                          borderLeft: isKeyHighlighted ? '1px solid var(--ui-accent)' : 'none',
                          padding: '10px 8px',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleWatchlist) onToggleWatchlist(row.sym);
                            }}
                            title={
                              watchlistSyms.includes(row.sym)
                                ? tx('Quitar de Watchlist', 'Remove from Watchlist')
                                : tx('Agregar a Watchlist', 'Add to Watchlist')
                            }
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              fontSize: '13.5px',
                              lineHeight: 1,
                              color: watchlistSyms.includes(row.sym) ? 'var(--ui-accent, #10b981)' : 'rgba(148, 163, 184, 0.35)',
                              flexShrink: 0,
                            }}
                          >
                            {watchlistSyms.includes(row.sym) ? '★' : '☆'}
                          </button>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                              <span className="mono-metric" style={{ fontWeight: 800, color: 'var(--text-main, #ffffff)', fontSize: '13.5px' }}>
                                {row.sym}
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)' }}>{row.name}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* PRICE */}
                      <td className="mono-metric" style={{ ...cellBase, padding: '10px 10px', fontWeight: 700, color: 'var(--text-main, #f8fafc)', fontSize: '13.5px' }}>
                        {row.priceFormatted}
                      </td>

                      {/* 24H % */}
                      <td className="mono-metric" style={{ ...cellBase, padding: '10px 10px' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: '13.5px',
                            color: chgEval.color,
                          }}
                        >
                          {row.chg}
                        </span>
                      </td>

                      {/* SPARKLINE */}
                      <td style={{ ...cellBase, padding: '10px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MiniSparkline sym={row.sym} isPos={isPos} width={88} height={28} version={liveSeriesVersion} />
                        </div>
                      </td>

                      {/* VOLUME (24H) */}
                      <td className="mono-metric" style={{ ...cellBase, padding: '10px 10px', color: 'var(--text-secondary, #e2e8f0)', fontSize: '13px' }}>
                        <div>{row.vol24h}</div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: row.volChg24h.startsWith('+') ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                          }}
                        >
                          {row.volChg24h}
                        </div>
                      </td>

                      {/* VOL Z-SCORE & REALIZED VOL (WHEN ALL) OR CATEGORY-SPECIFIC METRICS */}
                      {categoryFilter === 'ALL' ? (
                        <>
                          <td className="mono-metric" style={{ ...cellBase, padding: '10px 10px', fontWeight: 800, fontSize: '13px', color: zEval.color }}>
                            {row.volumeZScore}
                          </td>
                          <td className="mono-metric" style={{ ...cellBase, padding: '10px 10px', color: 'var(--text-body, #cbd5e1)', fontSize: '13px' }}>
                            {row.realizedVol}
                          </td>
                        </>
                      ) : (
                        (() => {
                          const spec = getAssetClassSpecificMetrics(row, isES);
                          return (
                            <>
                              <td className="mono-metric" style={{ ...cellBase, padding: '10px 10px', color: 'var(--text-main, #f8fafc)', fontWeight: 700, fontSize: '13px' }}>
                                <div>{spec.col1Val}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-dim, #64748b)', fontWeight: 500 }}>{spec.col1Sub}</div>
                              </td>
                              <td className="mono-metric" style={{ ...cellBase, padding: '10px 10px', color: 'var(--text-body, #cbd5e1)', fontWeight: 700, fontSize: '13px' }}>
                                <div style={{ color: 'var(--text-main, #f8fafc)' }}>{spec.col2Val}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-dim, #64748b)', fontWeight: 500 }}>{spec.col2Sub}</div>
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
                          padding: '10px 10px',
                          fontWeight: 800,
                          fontSize: '13.5px',
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
                          borderRight: isKeyHighlighted ? '1px solid var(--ui-accent)' : 'none',
                          padding: '10px 10px',
                        }}
                      >
                        <span style={{ fontWeight: 800, color: anomEval.color, fontSize: '13.5px', marginRight: '6px' }}>
                          {row.anomalyScore.toFixed(3)}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--text-muted, #94a3b8)',
                          }}
                        >
                          {row.regime}
                        </span>
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
            className="resp-orbital-grid"
            style={{
              minHeight: '540px',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 330px',
              gap: '0.85rem',
            }}
          >
            {/* Left Orbital Field */}
            <div
              style={{
                position: 'relative',
                borderRadius: '22px',
                backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.22))',
                backdropFilter: 'blur(2px)',
                border: '1px solid rgba(var(--ui-accent-rgb), 0.28)',
                overflow: 'hidden',
                padding: '1.25rem',
                minHeight: '540px',
              }}
            >
              {/* Top Header Bar Specifying Displayed Assets & Quick Count Selector */}
              <div
                style={{
                  position: 'absolute',
                  top: '0.85rem',
                  left: '1rem',
                  right: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  zIndex: 15,
                  pointerEvents: 'auto',
                }}
              >
                <div
                  className="mono-metric"
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    padding: '0.28rem 0.68rem',
                    borderRadius: '999px',
                    backgroundColor: 'var(--bg-elevated-soft, rgba(10, 15, 26, 0.78))',
                    border: '1px solid rgba(var(--ui-accent-rgb), 0.28)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {orbitalItems.length >= screenerRows.length
                    ? txTpl("MOSTRANDO TODOS LOS {0} ACTIVOS • ORDENADOS POR {1}", [screenerRows.length, spotlightMetricInfo.label.toUpperCase()], "SHOWING ALL {0} ASSETS • RANKED BY {1}", [screenerRows.length, spotlightMetricInfo.label.toUpperCase()])
                    : txTpl("TOP {0} POR {1} (DE {2} ACTIVOS)", [orbitalItems.length, spotlightMetricInfo.label.toUpperCase(), screenerRows.length], "TOP {0} BY {1} (OF {2} ASSETS)", [orbitalItems.length, spotlightMetricInfo.label.toUpperCase(), screenerRows.length])}
                </div>

                {screenerRows.length > 12 && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.2rem',
                      borderRadius: '999px',
                      backgroundColor: 'var(--bg-elevated-soft, rgba(10, 15, 26, 0.78))',
                      border: '1px solid rgba(var(--ui-accent-rgb), 0.28)',
                    }}
                  >
                    {[
                      { val: 12, label: 'Top 12' },
                      { val: 20, label: 'Top 20' },
                      { val: 32, label: 'Top 32' },
                      { val: 999, label: txTpl("Todos ({0})", [screenerRows.length], "All ({0})", [screenerRows.length]) },
                    ]
                      .filter((opt, idx, arr) => opt.val < screenerRows.length || idx === arr.length - 1)
                      .map((opt) => {
                        const isSel =
                          opt.val === 999
                            ? orbitalLimit >= screenerRows.length
                            : orbitalLimit === opt.val && orbitalLimit < screenerRows.length;
                        return (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => setOrbitalLimit(opt.val)}
                            className="mono-metric"
                            style={{
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              border: 'none',
                              fontSize: '0.58rem',
                              fontWeight: isSel ? 800 : 600,
                              cursor: 'pointer',
                              backgroundColor: isSel ? 'rgba(var(--ui-accent-rgb), 0.22)' : 'transparent',
                              color: isSel ? 'var(--ui-accent)' : 'var(--text-dim)',
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Concentric Orbital Rings */}
              {[32, 56, 80].map((pctSize, i) => (
                <div
                  key={pctSize}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '53%',
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
                  top: '53%',
                  transform: 'translate(-50%, -50%)',
                  padding: '0.42rem 0.8rem',
                  borderRadius: '999px',
                  backgroundColor: 'var(--bg-elevated, rgba(10, 15, 26, 0.92))',
                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.15))',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  color: 'var(--text-main, #f8fafc)',
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
                const total = Math.max(1, orbitalItems.length);
                const isDense = total > 24;
                const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;

                // Distribute across concentric rings cleanly so even 60 nodes never collide
                const ringOffset = isDense ? (idx % 3) * 8.5 : (idx % 2) * 4.5;
                const radiusPct = isDense
                  ? 16 + ringOffset + (1 - m.norm) * 9
                  : 17 + ringOffset + (1 - m.norm) * 18;
                const rawX = 50 + Math.cos(angle) * radiusPct;
                const rawY = 53 + Math.sin(angle) * radiusPct;

                // Hard clamp to container bounds so no node ever overflows
                const xPct = Math.min(93, Math.max(7, rawX));
                const yPct = Math.min(91, Math.max(15, rawY));

                const orbSize = isDense
                  ? Math.round(34 + m.norm * 14)
                  : total > 14
                  ? Math.round(40 + m.norm * 20)
                  : Math.round(44 + m.norm * 26);
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
                      boxShadow: `0 0 ${Math.round(10 + m.norm * 16)}px ${m.glow}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.22s ease',
                      zIndex: isFocused ? 20 : Math.round(m.norm * 5) + 2,
                    }}
                  >
                    <span
                      className="mono-metric"
                      style={{
                        fontSize:
                          row.sym.length >= 7
                            ? isDense
                              ? '0.48rem'
                              : '0.56rem'
                            : isDense
                            ? '0.58rem'
                            : '0.68rem',
                        fontWeight: 800,
                        color: '#fff',
                        lineHeight: 1.05,
                        textAlign: 'center',
                        width: '100%',
                        display: 'block',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.sym}
                    </span>
                    <span
                      className="mono-metric"
                      style={{
                        fontSize: isDense ? '0.46rem' : '0.54rem',
                        color: m.textColor,
                        fontWeight: 800,
                        lineHeight: 1.05,
                        textAlign: 'center',
                        width: '100%',
                        display: 'block',
                        whiteSpace: 'nowrap',
                      }}
                    >
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
                borderRadius: '22px',
                backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.24))',
                backdropFilter: 'blur(2px)',
                border: '1px solid rgba(var(--ui-accent-rgb), 0.28)',
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
                    <AreaChart data={spotlightSeries} margin={{ top: 6, right: 4, left: 4, bottom: 6 }}>
                      <defs>
                        <linearGradient
                          id={`orbitalSpotGrad-${spotlightItem.sym.replace(/[^a-zA-Z0-9_-]/g, '')}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="5%" stopColor={spotlightMetricInfo.color} stopOpacity={0.45} />
                          <stop offset="95%" stopColor={spotlightMetricInfo.color} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={spotlightMetricInfo.color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#orbitalSpotGrad-${spotlightItem.sym.replace(/[^a-zA-Z0-9_-]/g, '')})`}
                        isAnimationActive={false}
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
            className="resp-heatmap-row"
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.7rem',
              paddingBottom: '0.5rem',
              height: '540px',
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
                          borderRadius: '20px',
                          padding: '0.95rem 1.1rem',
                          background: m.bgGradient,
                          backdropFilter: 'blur(2px)',
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
                                  color: 'var(--text-muted, rgba(255,255,255,0.65))',
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
                                  color: 'var(--text-main, #ffffff)',
                                }}
                              >
                                {row.sym}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted, rgba(255,255,255,0.72))', marginTop: '0.08rem' }}>
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
                            <div className="mono-metric" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main, #ffffff)' }}>
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
  const assetMainColor = isAssetPos ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)';
  const currentEnriched = enrichedCatalog.find((a) => a.sym === selectedAsset) || enrichedCatalog[0];
  const isCompareMode = analysisLens === 'compare' && Boolean(compareSymbol);

  return (
    <div
      className="resp-l2-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.65rem',
        maxWidth: 'min(1860px, 100%)',
        width: '100%',
        margin: '0 auto',
        height: '100%',
        overflowY: 'auto',
        padding: '0.15rem 0.5rem 0.35rem 0.5rem',
      }}
    >
      {/* 2.1 TOP HORIZON BAR: BACK BUTTON + INTEGRATED TICKER SEARCH + ANALYTICS | RESEARCH PILLS + TIMEFRAMES */}
      {/* 2.1 TOP HORIZON BAR — V010 NEON-HALO BOXLESS NAVIGATION */}
      <div
        className="resp-l2-topbar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem 0.85rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
          flexShrink: 0,
        }}
      >
        {/* Left: Boxless Neon Back Button + Sleek Ticker Search Switcher */}
        <div className="resp-l2-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
          <HoverTooltip
            title={tx('Volver al Screener Global', 'Back to Global Screener')}
            badge="LEVEL 1"
            description={
              tx('Regresa al Screener Global (Tabla, Orbital, Mapa de Calor y Main Tools).', 'Returns to the Level 1 Global Screener (Table, Orbital, Heatmap, and Main Tools).')
            }
            placement="bottom"
          >
            <button
              onClick={() => setViewMode('screener')}
              className="mono-metric"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.34rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--ui-accent)',
                padding: '0.2rem 0.15rem',
                fontSize: '0.74rem',
                fontWeight: 800,
                textShadow: '0 0 12px rgba(var(--ui-accent-rgb), 0.75)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <ArrowLeft size={13} strokeWidth={2.4} />
              <span>{tx('Todos los Mercados', 'All Markets')}</span>
            </button>
          </HoverTooltip>

          <span className="resp-hide-mobile" style={{ color: 'rgba(255, 255, 255, 0.15)', userSelect: 'none' }}>•</span>

          {/* Integrated Ticker Search Combobox with Full Keyboard Navigation */}
          <div className="resp-l2-search-wrap" style={{ position: 'relative' }}>
            <div
              className="resp-l2-search-box"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.42rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: l2SearchOpen ? '1px solid var(--ui-accent)' : '1px solid var(--border-subtle, rgba(255, 255, 255, 0.09))',
                borderRadius: '999px',
                padding: '0.22rem 0.75rem',
                width: '230px',
              }}
            >
              <Search size={12} style={{ color: 'var(--ui-accent)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder={txTpl("Cambiar activo ({0})...", [currentAsset.sym], "Switch ticker ({0})...", [currentAsset.sym])}
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
                      syncTickerDependentToolState(picked.sym);
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
                  color: 'var(--text-main, #ffffff)',
                  fontSize: '0.7rem',
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
                  backgroundColor: 'var(--bg-glass-strong, rgba(10, 15, 28, 0.96))',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.14))',
                  boxShadow: '0 14px 36px rgba(0, 0, 0, 0.6)',
                  padding: '0.35rem',
                  zIndex: 9999,
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
                        syncTickerDependentToolState(item.sym);
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
                          ? 'rgba(var(--ui-accent-rgb), 0.22)'
                          : item.sym === selectedAsset
                            ? 'rgba(255, 255, 255, 0.06)'
                            : 'transparent',
                        border: isHighlighted ? '1px solid rgba(var(--ui-accent-rgb), 0.45)' : '1px solid transparent',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                      }}
                    >
                      <div>
                        <span className="mono-metric" style={{ fontWeight: 800, color: 'var(--text-main, #f8fafc)' }}>{item.sym}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginLeft: '0.45rem' }}>{item.name}</span>
                      </div>
                      <div className="mono-metric" style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-main, #f8fafc)' }}>{item.priceFormatted}</span>
                        <span style={{ color: pos ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)', fontWeight: 700 }}>{item.chg}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center: LEVEL 2 PRIMARY MODE SWITCHER IN V010 BOXLESS NEON-HALO STYLE */}
        <div className="resp-l2-topbar-center" style={{ display: 'inline-flex', alignItems: 'center', gap: '1.45rem' }}>
          {[
            {
              id: 'analytics',
              label: 'Analytics',
              desc: tx('Mesa cuantitativa: gráficos técnicos, comparador relativo, microestructura y superficies 3D/2D.', 'Quantitative desk: technical overlays, relative comparison, microstructure, and 3D/2D surfaces.'),
            },
            {
              id: 'research',
              label: 'Research',
              desc: tx('Mesa documental e IA: tesis ejecutiva, buscador RAG (SEC 10-K / Bancos Centrales), drivers y cable FinBERT.', 'Documentary & AI desk: executive thesis, RAG search (SEC 10-K / Central Banks), drivers, and FinBERT wire.'),
            },
          ].map((sec) => {
            const active = l2Section === sec.id;
            return (
              <HoverTooltip key={sec.id} title={sec.label} badge="LEVEL 2 DESK" description={sec.desc} placement="bottom" disabled={true}>
                <button
                  onClick={() => {
                    setL2Section(sec.id);
                    const appViewport = typeof document !== 'undefined' ? document.querySelector('.app-main-viewport') : null;
                    if (appViewport) appViewport.scrollTop = 0;
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: active ? 800 : 600,
                    color: active ? 'var(--ui-accent)' : 'var(--text-muted, rgba(148, 163, 184, 0.62))',
                    textShadow: active ? '0 0 15px rgba(var(--ui-accent-rgb), 0.88)' : 'none',
                    cursor: 'pointer',
                    padding: '0.18rem 0.25rem',
                    transition: 'all 0.16s ease',
                  }}
                >
                  {sec.label}
                </button>
              </HoverTooltip>
            );
          })}
        </div>

        {/* Right: V010 Ghost P-06 Trigger + Boxless Neon Timeframes (Analytics) OR Live Wire Trigger (Research) */}
        <div className="resp-l2-topbar-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.68rem', flexWrap: 'wrap', flex: 1 }}>
          {l2Section === 'analytics' ? (
            <>
              <HoverTooltip
                title="P-06 Isolation Forest Re-Score"
                badge={liveInference ? `${liveInference.latencyMs}ms` : 'CLOUD RUN'}
                description={
                  tx('Ejecuta inferencia estadística en vivo para recalcular el puntaje de anomalía (0.00 a 1.00) del activo.', 'Runs live statistical inference to recompute the asset anomaly score (0.00 to 1.00).')
                }
                placement="bottom"
              >
                <button
                  onClick={() => triggerLiveP06Scoring(selectedAsset)}
                  disabled={isScoring}
                  className="mono-metric"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.26rem',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.25rem',
                    border: 'none',
                    background: 'transparent',
                    color: liveInference ? 'var(--accent, #10b981)' : 'var(--text-dim)',
                    textShadow: liveInference ? '0 0 10px rgba(16, 185, 129, 0.7)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw
                    size={10}
                    style={{
                      transform: isScoring ? 'rotate(360deg)' : 'rotate(0deg)',
                      transition: isScoring ? 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    }}
                  />
                  <span>{isScoring ? 'SCORING...' : liveInference ? `P-06 (${liveInference.latencyMs}ms)` : 'P-06'}</span>
                </button>
              </HoverTooltip>

              <span style={{ color: 'rgba(255, 255, 255, 0.14)', userSelect: 'none' }}>|</span>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                {TIMEFRAMES.map((tf) => {
                  const isActive = timeframe === tf.id;
                  return (
                    <button
                      key={tf.id}
                      onClick={() => {
                        setTimeframe(tf.id);
                        if (analysisLens === 'derivatives' && currentAsset.cat !== 'FX') {
                          setAnalysisLens('technical');
                        }
                      }}
                      className="mono-metric"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '0.66rem',
                        padding: '0.12rem 0.2rem',
                        color: isActive ? 'var(--ui-accent)' : 'var(--text-dim)',
                        fontWeight: isActive ? 800 : 600,
                        textShadow: isActive ? '0 0 12px rgba(var(--ui-accent-rgb), 0.85)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.14s ease',
                      }}
                    >
                      {tf.label}
                    </button>
                  );
                })}
              </div>

              <span style={{ color: 'rgba(255, 255, 255, 0.14)', userSelect: 'none' }}>|</span>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ExportFormatButton
                  format="PNG"
                  onClick={handleExportAnalyticsPng}
                  title={tx('Descargar captura del gráfico y métricas (PNG)', 'Download chart & metrics snapshot (PNG)')}
                />
                <ExportFormatButton
                  format="CSV"
                  onClick={handleExportAnalyticsCsv}
                  title={tx('Descargar serie histórica de precios y bandas (CSV)', 'Download historical price & band series (CSV)')}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* 2.2 V010 HERO HEADER: AREA-GLOW SPARKLINE WITH LIVE DOT + DUAL-TIER SEMANTIC PILLS */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.65rem 1.25rem',
          paddingBottom: '0.6rem',
          borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.07))',
          flexShrink: 0,
        }}
      >
        {(() => {
          const isHeroRatesTool =
            l2Section === 'analytics' &&
            analysisLens === 'derivatives' &&
            (currentAsset.cat === 'RATES' || currentAsset.cat === 'FIXED_INCOME' || currentAsset.cat === 'CASH');
          const isHeroFxTool =
            l2Section === 'analytics' &&
            analysisLens === 'derivatives' &&
            currentAsset.cat === 'FX';
          const heroCurve = isHeroRatesTool ? computeSovereignCurveMetrics(selectedCurveCountry) : null;
          const heroFxCross = isHeroFxTool ? computeCrossCurrencyRate(fxBaseCcy, fxQuoteCcy, fxAmount, timeframe) : null;

          const activeTfMeta = TIMEFRAMES.find((tf) => tf.id === timeframe) || { id: '1D', label: '1D' };
          const tfPeriodReturn =
            series && series.length > 0 && typeof series[series.length - 1]?.pctReturn === 'number'
              ? series[series.length - 1].pctReturn
              : currentAsset.chgNum;
          const tfReturnFormatted =
            l2Section === 'analytics' && timeframe !== '1D'
              ? `${tfPeriodReturn >= 0 ? '+' : ''}${Number(tfPeriodReturn).toFixed(2)}% (${activeTfMeta.label})`
              : currentAsset.chg;
          const tfReturnColor =
            l2Section === 'analytics' && timeframe !== '1D'
              ? tfPeriodReturn >= 0
                ? 'var(--accent, #10b981)'
                : 'var(--danger, #f43f5e)'
              : assetMainColor;

          const heroBadgeCat = isHeroRatesTool
            ? `SOVEREIGN (${heroCurve.rating})`
            : isHeroFxTool
              ? 'FX CROSS'
              : currentAsset.cat;

          const heroSubtitle = isHeroRatesTool
            ? `${heroCurve.country[langCode] || heroCurve.country.EN} (${selectedCurveCountry} 10Y)`
            : isHeroFxTool
              ? `${heroFxCross.baseName} / ${heroFxCross.quoteName} (${heroFxCross.pair})`
              : `${currentAsset.name} (${currentAsset.pair})`;

          const heroPriceText = isHeroRatesTool
            ? `${heroCurve.y10}%`
            : isHeroFxTool
              ? heroFxCross.rateFormatted
              : currentAsset.priceFormatted;

          const heroChgText = isHeroRatesTool
            ? `2s10s: ${heroCurve.spread2s10sBps >= 0 ? '+' : ''}${heroCurve.spread2s10sBps} bps`
            : isHeroFxTool
              ? heroFxCross.chgFormatted
              : tfReturnFormatted;

          const heroChgColor = isHeroRatesTool
            ? heroCurve.spread2s10sBps >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)'
            : isHeroFxTool
              ? heroFxCross.chg24h >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)'
              : tfReturnColor;

          const isWatchedHero = watchlistSyms.includes(currentAsset.sym);

          return (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                  <span
                    className="mono-metric"
                    style={{
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      color: 'var(--ui-accent)',
                      textShadow: '0 0 10px rgba(var(--ui-accent-rgb), 0.55)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {heroBadgeCat}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {heroSubtitle}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleWatchlist && onToggleWatchlist(currentAsset.sym)}
                    className="mono-metric"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isWatchedHero ? 'var(--warn-text, #fbbf24)' : 'var(--text-dim)',
                      textShadow: isWatchedHero ? '0 0 12px rgba(251, 191, 36, 0.75)' : 'none',
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: '0.08rem 0.25rem',
                    }}
                  >
                    {isWatchedHero
                      ? tx('★ EN WATCHLIST', '★ IN WATCHLIST')
                      : tx('☆ + WATCHLIST', '☆ + WATCHLIST')}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.68rem', marginTop: '0.08rem' }}>
                  <span className="mono-metric" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main, #ffffff)', letterSpacing: '-0.03em' }}>
                    {heroPriceText}
                  </span>
                  <span
                    className="mono-metric"
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: heroChgColor,
                      textShadow: `0 0 12px ${heroChgColor}55`,
                    }}
                  >
                    {heroChgText}
                  </span>
                  {l2Section === 'analytics' && compareSymbol && (
                    <span className="mono-metric" style={{ fontSize: '0.72rem', color: 'var(--info-text, #38bdf8)', fontWeight: 700 }}>
                      vs {compareSymbol} ({getAssetBySymbol(compareSymbol).chg})
                    </span>
                  )}
                </div>
              </div>

              {/* Centered Standalone Trajectory AreaChart matching Level 1 '24h Aggregate Volume' */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <MiniSparkline
                  sym={isHeroFxTool ? `${fxBaseCcy}/${fxQuoteCcy}` : currentAsset.sym}
                  timeframe={l2Section === 'analytics' ? timeframe : '1D'}
                  color={heroChgColor}
                  width={118}
                  height={46}
                  version={liveSeriesVersion}
                />
              </div>
            </>
          );
        })()}

        {/* Right Hero Strip: 5 Dual-Tier Semantic Pills (Analytics) vs 3 Dual-Tier Semantic Pills (Research) */}
        {l2Section === 'analytics' ? (
          (() => {
            const effectiveAssetForSpec =
              analysisLens === 'derivatives' &&
              (currentAsset.cat === 'RATES' || currentAsset.cat === 'FIXED_INCOME' || currentAsset.cat === 'CASH')
                ? { ...currentAsset, cat: 'RATES', countryCode: selectedCurveCountry }
                : analysisLens === 'derivatives' && currentAsset.cat === 'FX'
                  ? { ...currentAsset, cat: 'FX', sym: `${fxBaseCcy}/${fxQuoteCcy}` }
                  : currentAsset;
            const catSpec = getAssetClassSpecificMetrics(effectiveAssetForSpec, isES);

            const heroPills = [
              {
                label: '24H VOLUME',
                val: currentAsset.vol24h,
                sub: currentAsset.volChg24h,
                color: 'var(--text-main, #ffffff)',
                subColor: currentAsset.volChg24h.startsWith('+') ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                isClassSpecific: false,
                desc: tx('Volumen institucional operado en las últimas 24 horas y variación porcentual.', '24-hour institutional trading volume and daily percentage change.'),
              },
              {
                label: catSpec.col1Label,
                val: catSpec.col1Val,
                sub: catSpec.col1Sub,
                color: catSpec.col1Color || 'var(--accent, #10b981)',
                subColor: 'var(--text-dim)',
                isClassSpecific: true,
                desc: txTpl("Métrica #1 exclusiva de la clase {0}.", [effectiveAssetForSpec.cat], "Primary metric exclusive to the {0} asset class.", [effectiveAssetForSpec.cat]),
              },
              {
                label: catSpec.col2Label,
                val: catSpec.col2Val,
                sub: catSpec.col2Sub,
                color: catSpec.col2Color || 'var(--info-text, #38bdf8)',
                subColor: 'var(--text-dim)',
                isClassSpecific: true,
                desc: txTpl("Métrica #2 exclusiva de la clase {0}.", [effectiveAssetForSpec.cat], "Secondary metric exclusive to the {0} asset class.", [effectiveAssetForSpec.cat]),
              },
              {
                label: 'RSI (14) / MACD',
                val: `${currentAsset.indicators.rsi14}`,
                sub: currentAsset.indicators.macdSignal,
                color: currentAsset.indicators.rsi14 >= 50 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                subColor: 'var(--text-dim)',
                isClassSpecific: false,
                desc: tx('Índice de Fuerza Relativa (14 períodos) y régimen de momentum MACD.', '14-period Relative Strength Index and MACD momentum signal.'),
              },
              {
                label: 'P-06 ANOMALY',
                val: `${displayedScore}`,
                sub: isDislocated ? 'ATYPICAL' : isElevated ? 'ELEVATED' : 'NORMAL',
                color: scoreColor,
                subColor: scoreColor,
                isClassSpecific: false,
                desc: tx('Puntaje de anomalía estadística (0.00 a 1.00) calculado por el motor Isolation Forest.', 'Statistical anomaly score (0.00 to 1.00) computed by the Isolation Forest engine.'),
              },
            ];

            return (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {heroPills.map((k) => (
                  <HoverTooltip key={k.label} title={k.label} badge={k.val} description={k.desc} placement="bottom" width={235} disabled={true}>
                    <div
                      className="mono-metric"
                      style={{
                        padding: '0.42rem 0.82rem',
                        borderRadius: '10px',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                        borderLeft: `3px solid ${k.color || 'var(--ui-accent, #10b981)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.12rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.48rem',
                          fontWeight: 700,
                          color: k.isClassSpecific ? 'var(--ui-accent)' : 'var(--text-dim)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {k.label}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, color: k.color }}>{k.val}</span>
                        <span style={{ fontSize: '0.54rem', color: k.subColor, fontWeight: 600 }}>({k.sub})</span>
                      </div>
                    </div>
                  </HoverTooltip>
                ))}
              </div>
            );
          })()
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
            {/* 1. Research Stance + Asset-Class News Sensitivity Pill */}
            <div
              className="mono-metric"
              style={{
                padding: '0.42rem 0.82rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                borderLeft: `3px solid ${researchBrief.stance === 'BULLISH' ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0.12rem',
              }}
            >
              <span style={{ fontSize: '0.48rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
                {assetSensitivity.shortLabel[langCode] || assetSensitivity.shortLabel.EN}
              </span>
              <span
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: researchBrief.stance === 'BULLISH' ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                }}
              >
                {researchBrief.stanceLabel[langCode] || researchBrief.stanceLabel.EN}
              </span>
            </div>

            {/* 2. Weighted Composite Score Pill */}
            <div
              className="mono-metric"
              style={{
                padding: '0.42rem 0.82rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                borderLeft: `3px solid ${researchBrief.compositeScore >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0.12rem',
              }}
            >
              <span style={{ fontSize: '0.48rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
                {tx('NOTA PONDERADA TOTAL', 'WEIGHTED COMPOSITE')}
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                <span
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    color: researchBrief.compositeScore >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                  }}
                >
                  {researchBrief.compositeFormatted}
                </span>
                <span style={{ fontSize: '0.54rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                  ({tx('Fund.', 'Filings')} {researchBrief.filingNetFormatted} • {tx('Not.', 'News')} {assetFinbertPolarity.formattedInt})
                </span>
              </div>
            </div>

            {/* 3. News Sentiment Linear Number Line Pill (-100 to +100) */}
            <div
              className="mono-metric"
              style={{
                padding: '0.42rem 0.82rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                borderLeft: `3px solid ${assetFinbertPolarity.color}`,
                minWidth: '185px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0.22rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.48rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
                  {tx('SENTIMIENTO NOTICIAS', 'NEWS SENTIMENT')}
                </span>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: assetFinbertPolarity.color }}>
                  {assetFinbertPolarity.formattedInt}
                </span>
              </div>
              <div style={{ position: 'relative', height: '5px', borderRadius: '999px', background: 'linear-gradient(90deg, #f43f5e 0%, rgba(255,255,255,0.16) 50%, #10b981 100%)' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '-2px',
                    bottom: '-2px',
                    width: '2px',
                    backgroundColor: 'var(--text-muted, rgba(255,255,255,0.5))',
                    transform: 'translateX(-50%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: `${assetFinbertPolarity.linePct}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: `2px solid ${assetFinbertPolarity.color}`,
                    boxShadow: `0 0 8px ${assetFinbertPolarity.color}`,
                    transition: 'left 0.35s ease',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {l2Section === 'analytics' ? (
        <>
          {/* 2.3 + 2.4 UNIFIED LQR-F WORKSPACE: LEFT QUANT CONTROL RAIL (4 LENSES + SUB-MODES + SEARCH + 6 TELEMETRY PILLS) + FULL-HEIGHT RIGHT 3D/2D STAGE */}
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

            const cleanUndSym = (currentAsset.underlyingSym || currentAsset.sym).replace(/-OPT$/, '');
            const undCatalogObj = ASSET_CATALOG.find((a) => a.sym === cleanUndSym);
            const effectiveOptSpot = undCatalogObj ? undCatalogObj.price : currentAsset.price;

            const curveMetrics = isRatesCurveMode ? computeSovereignCurveMetrics(selectedCurveCountry) : null;
            const fxCrossMetrics = isFxCrossMode ? computeCrossCurrencyRate(fxBaseCcy, fxQuoteCcy, fxAmount, timeframe) : null;
            const commForwardMetrics = isCommodityCurveMode
              ? getCommodityForwardCurve(currentAsset.sym, currentAsset.price)
              : null;
            const optChainMetrics = isOptionsBaseMode
              ? getHighVolumeOptionsChain(cleanUndSym, effectiveOptSpot)
              : null;
            const optPayoffMetrics = isOptionsBaseMode
              ? computeOptionsStrategyPayoff(cleanUndSym, effectiveOptSpot, selectedOptStrategy)
              : null;

            const active3DSurfaceData = isOptions3DMode
              ? computeVolatilitySurface3D(cleanUndSym, effectiveOptSpot)
              : isRates3DMode
                ? computeSovereignYieldSurface3D(
                    selectedCurveCountry,
                    ratesSubView === '3d-peers' ? 'crossCountry' : 'history'
                  )
                : isCommodity3DMode
                  ? computeCommodityForwardSurface3D(currentAsset.sym, currentAsset.price)
                  : null;

            const activeChartData = isRatesCurveMode
              ? curveMetrics.curveSeries.map((pt) => ({
                  time: pt.tenor,
                  price: pt.yield,
                  cmpReturn: pt.ustYield,
                  bundYield: pt.bundYield,
                  vol: pt.vol,
                  zBar: pt.zBar,
                }))
              : isFxCrossMode
                ? fxCrossMetrics.crossSeries
                : isCommodityCurveMode
                  ? commForwardMetrics.curveSeries
                  : isOptionsPayoffMode
                    ? optPayoffMetrics.payoffSeries
                    : isOptionsSmileMode
                      ? optChainMetrics.strikes.map((st) => ({
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

            // Build dynamic 6 Dual-Tier Semantic Telemetry Pills for Block 3 of the Left Quant Rail
            const latestChartPt = chartData[chartData.length - 1] || {};
            const peerAssetObj = compareSymbol ? getAssetBySymbol(compareSymbol) : null;
            const alphaSpread = peerAssetObj ? (currentAsset.chgNum - peerAssetObj.chgNum).toFixed(2) : '0.00';

            const railTelemetryPills = (() => {
              if (analysisLens === 'technical') {
                const smaVal = latestChartPt.sma20 ? `$${Number(latestChartPt.sma20).toFixed(2)}` : currentAsset.priceFormatted;
                const vwapVal = latestChartPt.vwap ? `$${Number(latestChartPt.vwap).toFixed(2)}` : currentAsset.priceFormatted;
                return [
                  { label: 'SMA (20) LEVEL', val: smaVal, sub: showSma20 ? 'ACTIVE OVERLAY' : 'HIDDEN', color: 'var(--info-text, #38bdf8)', accent: showSma20 },
                  { label: 'INSTITUTIONAL VWAP', val: vwapVal, sub: showVwap ? 'ACTIVE OVERLAY' : 'HIDDEN', color: 'var(--warn-text, #f59e0b)', accent: showVwap },
                  { label: 'BOLLINGER (20, 2σ)', val: currentAsset.indicators.bbWidth, sub: showBollinger ? 'BANDS ACTIVE' : 'BAND WIDTH', color: 'var(--purple-text, #a78bfa)', accent: showBollinger },
                  { label: 'RSI (14) MOMENTUM', val: `${currentAsset.indicators.rsi14}`, sub: currentAsset.indicators.macdStatus, color: 'var(--accent, #10b981)', accent: false },
                  { label: '24H VOLUME FLOW', val: currentAsset.vol24h, sub: `${anomalyProfile.volumeZScore} vs 20d`, color: 'var(--text-main, #ffffff)', accent: false },
                  { label: 'VOL Z-SCORE (20D)', val: anomalyProfile.volumeZScore, sub: anomalyProfile.realizedVol + ' RVol', color: 'var(--accent, #10b981)', accent: false },
                ];
              }
              if (analysisLens === 'compare') {
                return [
                  { label: `${currentAsset.sym} 24H (%)`, val: currentAsset.chg, sub: currentAsset.cat, color: currentAsset.isPositive ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)', accent: true },
                  {
                    label: peerAssetObj ? `VS ${peerAssetObj.sym} (%)` : tx('PAR COMPARADO', 'PEER RETURN'),
                    val: peerAssetObj ? peerAssetObj.chg : tx('Usar buscador ↑', 'Use search ↑'),
                    sub: peerAssetObj ? peerAssetObj.cat : tx('Sin seleccionar', 'None selected'),
                    color: 'var(--info-text, #38bdf8)',
                    accent: Boolean(peerAssetObj),
                  },
                  {
                    label: 'ALPHA SPREAD (24H)',
                    val: peerAssetObj ? `${Number(alphaSpread) >= 0 ? '+' : ''}${alphaSpread}%` : '—',
                    sub: peerAssetObj ? `${currentAsset.sym} - ${peerAssetObj.sym}` : 'Select peer',
                    color: Number(alphaSpread) >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                    accent: false,
                  },
                  { label: 'PRIMARY RSI (14)', val: `${currentAsset.indicators.rsi14}`, sub: peerAssetObj ? `Peer RSI ${peerAssetObj.indicators.rsi14}` : currentAsset.indicators.macdStatus, color: 'var(--text-main, #ffffff)', accent: false },
                  { label: 'REALIZED VOL (30D)', val: anomalyProfile.realizedVol, sub: peerAssetObj ? `Peer ${getAnomalyProfile(peerAssetObj.sym).realizedVol}` : 'ANNUALIZED', color: 'var(--purple-text, #a78bfa)', accent: false },
                  { label: 'VOL Z-SCORE (20D)', val: anomalyProfile.volumeZScore, sub: peerAssetObj ? `Peer ${getAnomalyProfile(peerAssetObj.sym).volumeZScore}` : 'FLOW PULSE', color: 'var(--accent, #10b981)', accent: false },
                ];
              }
              if (analysisLens === 'microstructure') {
                return [
                  { label: 'VOL Z-SCORE (20D)', val: anomalyProfile.volumeZScore, sub: showSubChart === 'zscore' ? 'SUB-PANE ACTIVE' : '20D SIGMA', color: 'var(--accent, #10b981)', accent: showSubChart === 'zscore' },
                  { label: '24H VOLUME FLOW', val: currentAsset.vol24h, sub: showSubChart === 'vol' ? 'SUB-PANE ACTIVE' : anomalyProfile.volumeZScore, color: 'var(--info-text, #38bdf8)', accent: showSubChart === 'vol' },
                  { label: 'SPREAD DISLOCATION', val: anomalyProfile.spreadDislocation, sub: 'ORDERBOOK DEPTH', color: 'var(--accent, #10b981)', accent: false },
                  { label: 'BOLLINGER WIDTH', val: currentAsset.indicators.bbWidth, sub: 'VOLATILITY REGIME', color: 'var(--purple-text, #a78bfa)', accent: false },
                  { label: 'REALIZED VOL', val: anomalyProfile.realizedVol, sub: '30D ANNUALIZED', color: 'var(--text-main, #ffffff)', accent: false },
                  { label: 'P-06 ANOMALY SCORE', val: displayedScore.toFixed(3), sub: anomalyProfile.regime, color: scoreColor, accent: false },
                ];
              }
              if (isRatesCurveMode && curveMetrics) {
                const cObj = SOVEREIGN_YIELD_CURVES[selectedCurveCountry] || SOVEREIGN_YIELD_CURVES.US;
                return [
                  { label: `${selectedCurveCountry} 10Y BENCHMARK`, val: `${curveMetrics.y10}%`, sub: `Rating ${cObj.rating}`, color: 'var(--accent, #10b981)', accent: true },
                  {
                    label: '2s10s SLOPE SPREAD',
                    val: `${curveMetrics.spread2s10sBps >= 0 ? '+' : ''}${curveMetrics.spread2s10sBps} bps`,
                    sub: curveMetrics.spread2s10sBps < 0 ? 'INVERTED' : 'NORMAL',
                    color: curveMetrics.spread2s10sBps >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                    accent: true,
                  },
                  {
                    label: '3m10y TERM SPREAD',
                    val: `${curveMetrics.spread3m10yBps >= 0 ? '+' : ''}${curveMetrics.spread3m10yBps} bps`,
                    sub: 'SHORT-LONG',
                    color: curveMetrics.spread3m10yBps >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                    accent: false,
                  },
                  {
                    label: 'BUTTERFLY 2s5s10s',
                    val: `${curveMetrics.butterfly2s5s10sBps >= 0 ? '+' : ''}${curveMetrics.butterfly2s5s10sBps} bps`,
                    sub: 'BELLY CURVATURE',
                    color: 'var(--info-text, #38bdf8)',
                    accent: false,
                  },
                  {
                    label: 'REAL 10Y YIELD',
                    val: `${curveMetrics.realYield10Y >= 0 ? '+' : ''}${curveMetrics.realYield10Y}%`,
                    sub: `Policy ${cObj.policyRate}%`,
                    color: curveMetrics.realYield10Y >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                    accent: false,
                  },
                  { label: 'DV01 ($1M NOTIONAL)', val: curveMetrics.dv01PerMillion10Y, sub: 'RATE SENSITIVITY', color: 'var(--text-main, #ffffff)', accent: false },
                ];
              }
              if (isFxCrossMode && fxCrossMetrics) {
                return [
                  { label: `${fxCrossMetrics.pair} SPOT`, val: fxCrossMetrics.rateFormatted, sub: fxCrossMetrics.chgFormatted, color: 'var(--accent, #10b981)', accent: true },
                  { label: 'CONVERTED TOTAL', val: `${fxCrossMetrics.convertedFormatted} ${fxQuoteCcy}`, sub: `From ${fxAmount.toLocaleString()} ${fxBaseCcy}`, color: 'var(--info-text, #38bdf8)', accent: true },
                  { label: '10Y CARRY SPREAD', val: fxCrossMetrics.carryFormatted, sub: fxCrossMetrics.carryDiffBps >= 0 ? 'POSITIVE CARRY' : 'NEGATIVE CARRY', color: fxCrossMetrics.carryDiffBps >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)', accent: false },
                  { label: `INVERSE (${fxQuoteCcy}/${fxBaseCcy})`, val: fxCrossMetrics.inverseFormatted, sub: 'RECIPROCAL', color: 'var(--text-main, #ffffff)', accent: false },
                  { label: `${fxBaseCcy} POLICY RATE`, val: `${WORLD_USD_RATES[fxBaseCcy]?.policyRate ?? WORLD_USD_RATES[fxBaseCcy]?.rate10Y ?? 3.88}%`, sub: WORLD_USD_RATES[fxBaseCcy]?.name || fxBaseCcy, color: 'var(--purple-text, #a78bfa)', accent: false },
                  { label: `${fxQuoteCcy} POLICY RATE`, val: `${WORLD_USD_RATES[fxQuoteCcy]?.policyRate ?? WORLD_USD_RATES[fxQuoteCcy]?.rate10Y ?? 0.5}%`, sub: WORLD_USD_RATES[fxQuoteCcy]?.name || fxQuoteCcy, color: 'var(--warn-text, #f59e0b)', accent: false },
                ];
              }
              if (isCommodityCurveMode && commForwardMetrics) {
                return [
                  { label: 'TERM STRUCTURE', val: commForwardMetrics.regime, sub: currentAsset.sym, color: commForwardMetrics.isBackwardation ? 'var(--accent, #10b981)' : 'var(--warn-text, #f59e0b)', accent: true },
                  { label: 'ROLL YIELD (1Y ANN)', val: commForwardMetrics.rollYieldAnnual, sub: 'FRONT vs M12', color: commForwardMetrics.isBackwardation ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)', accent: true },
                  { label: 'INVENTORY vs 5Y AVG', val: commForwardMetrics.inventoryVs5Y, sub: 'PHYSICAL STOCK', color: 'var(--text-main, #ffffff)', accent: false },
                  { label: 'COT NET SPECULATIVE', val: commForwardMetrics.cotNetSpec, sub: 'CFTC POSITIONING', color: 'var(--info-text, #38bdf8)', accent: false },
                  { label: 'FRONT SPOT PRICE', val: currentAsset.priceFormatted, sub: currentAsset.chg, color: 'var(--accent, #10b981)', accent: false },
                  { label: 'REALIZED VOL (30D)', val: anomalyProfile.realizedVol, sub: anomalyProfile.volumeZScore, color: 'var(--purple-text, #a78bfa)', accent: false },
                ];
              }
              if (isOptionsPayoffMode && optPayoffMetrics) {
                return [
                  { label: tx('PRIMA NETA', 'NET PREMIUM'), val: optPayoffMetrics.netCostFormatted, sub: cleanUndSym, color: 'var(--text-main, #ffffff)', accent: true },
                  { label: 'BREAKEVEN THRESHOLD', val: optPayoffMetrics.breakevenText, sub: 'AT EXPIRATION', color: 'var(--info-text, #38bdf8)', accent: true },
                  { label: 'MAX PROFIT TARGET', val: optPayoffMetrics.maxProfitText, sub: 'EXPIRY CAP', color: 'var(--accent, #10b981)', accent: false },
                  { label: 'MAX LOSS FLOOR', val: optPayoffMetrics.maxLossText, sub: 'DEFINED RISK', color: 'var(--danger, #f43f5e)', accent: false },
                  { label: 'DELTA (Δ) / GAMMA (Γ)', val: `Δ ${optPayoffMetrics.greeks.delta}`, sub: `Γ ${optPayoffMetrics.greeks.gamma}`, color: 'var(--accent, #10b981)', accent: false },
                  { label: 'THETA (Θ) / VEGA (ν)', val: `Θ ${optPayoffMetrics.greeks.theta}`, sub: `ν ${optPayoffMetrics.greeks.vega}`, color: 'var(--purple-text, #a78bfa)', accent: false },
                ];
              }
              if (optChainMetrics) {
                return [
                  { label: 'ATM IMPLIED VOL (30D)', val: `${optChainMetrics.atmIvPct}%`, sub: `IV Rank ${optChainMetrics.ivRank}`, color: 'var(--accent, #10b981)', accent: true },
                  { label: '25Δ PUT-CALL SKEW', val: `${optChainMetrics.skew25d}`, sub: 'DOWNSIDE TAIL', color: 'var(--info-text, #38bdf8)', accent: true },
                  { label: 'STRADDLE BREAKEVEN', val: optChainMetrics.straddleBreakevenPct, sub: 'IMPLIED MOVE', color: 'var(--text-main, #ffffff)', accent: false },
                  { label: 'NET GAMMA (GEX)', val: optChainMetrics.netGammaExposure, sub: 'DEALER POSITION', color: 'var(--accent, #10b981)', accent: false },
                  { label: 'MAX PAIN STRIKE', val: `$${optChainMetrics.maxPain}`, sub: `Spot $${effectiveOptSpot}`, color: 'var(--purple-text, #a78bfa)', accent: false },
                  { label: 'PUT/CALL OI RATIO', val: `${optChainMetrics.putCallRatio || '0.78'}`, sub: 'OPEN INTEREST', color: 'var(--warn-text, #f59e0b)', accent: false },
                ];
              }
              return [];
            })();

            // Filtered lists for the contextual Searchable Comboboxes inside Block 2 of the Left Rail
            const rq = railSearchQuery.trim().toLowerCase();
            const sovereignCountryMatches = Object.entries(SOVEREIGN_YIELD_CURVES)
              .map(([code, c]) => ({
                code,
                name: c.country[langCode] || c.country.EN,
                rating: c.rating,
                y10: c.tenors['10Y'],
              }))
              .filter(
                (item) =>
                  !rq ||
                  item.code.toLowerCase().includes(rq) ||
                  item.name.toLowerCase().includes(rq) ||
                  item.rating.toLowerCase().includes(rq)
              );

            const fxBaseMatches = Object.entries(WORLD_USD_RATES)
              .map(([code, info]) => ({ code, name: info.name, rate10Y: info.rate10Y }))
              .filter(
                (item) =>
                  !rq ||
                  item.code.toLowerCase().includes(rq) ||
                  item.name.toLowerCase().includes(rq)
              );

            const fq = fxQuoteQuery.trim().toLowerCase();
            const fxQuoteMatches = Object.entries(WORLD_USD_RATES)
              .map(([code, info]) => ({ code, name: info.name, rate10Y: info.rate10Y }))
              .filter(
                (item) =>
                  !fq ||
                  item.code.toLowerCase().includes(fq) ||
                  item.name.toLowerCase().includes(fq)
              );

            const commodityMatches = enrichedCatalog
              .filter((a) => a.cat === 'COMMODITY')
              .filter(
                (a) =>
                  !rq ||
                  a.sym.toLowerCase().includes(rq) ||
                  a.name.toLowerCase().includes(rq)
              );

            const optionableMatches = enrichedCatalog
              .filter((a) => ['DERIVATIVES_VOL', 'EQUITY', 'INDEX', 'ETF', 'CRYPTO'].includes(a.cat))
              .filter(
                (a) =>
                  !rq ||
                  a.sym.toLowerCase().includes(rq) ||
                  a.name.toLowerCase().includes(rq) ||
                  a.cat.toLowerCase().includes(rq)
              );

            const generalAssetMatches = enrichedCatalog
              .filter(
                (a) =>
                  !rq ||
                  a.sym.toLowerCase().includes(rq) ||
                  a.name.toLowerCase().includes(rq) ||
                  a.cat.toLowerCase().includes(rq)
              )
              .slice(0, 14);

            const syncCatalogFxPair = (nextBase, nextQuote) => {
              const directMatch = ASSET_CATALOG.find((a) => a.cat === 'FX' && a.sym === `${nextBase}/${nextQuote}`);
              if (directMatch) onSelectAsset(directMatch.sym);
            };

            return (
              <div
                className="resp-l2-analytics-grid"
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: 'grid',
                  gridTemplateColumns: '315px minmax(0, 1fr)',
                  gap: '0.85rem',
                  alignItems: 'stretch',
                }}
              >
                {/* ============================================================ */}
                {/* LEFT QUANT CONTROL RAIL (LQR-F: LENSES + CONTROLS + TELEMETRY)*/}
                {/* ============================================================ */}
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    gap: '14px',
                    minHeight: 0,
                    overflowY: 'auto',
                  }}
                >
                  {/* BLOCK 1: 4 PRIMARY ANALYSIS LENSES (2x2 GRID) */}
                  <div>
                    <div
                      className="mono-metric"
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-main, #ffffff)',
                        fontWeight: 700,
                        marginBottom: '0.35rem',
                      }}
                    >
                      {tx('Lente de Análisis', 'Analysis Lens')}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                      {[
                        { id: 'technical', label: tx('Técnico', 'Technical') },
                        { id: 'compare', label: tx('Comparar %', 'Compare %') },
                        { id: 'microstructure', label: tx('Micro & Flujo', 'Micro & Flow') },
                        {
                          id: 'derivatives',
                          label:
                            currentAsset.cat === 'RATES' || currentAsset.cat === 'FIXED_INCOME' || currentAsset.cat === 'CASH'
                              ? tx('Curva 3D/2D', '3D/2D Curve')
                              : currentAsset.cat === 'FX'
                                ? tx('FX & Carry', 'FX Cross')
                                : currentAsset.cat === 'COMMODITY'
                                  ? tx('Forward 3D/2D', '3D/2D Forward')
                                  : tx('Vol 3D & Payoff', '3D Vol & Payoff'),
                        },
                      ].map((lens) => {
                        const active = analysisLens === lens.id;
                        return (
                          <button
                            key={lens.id}
                            type="button"
                            onClick={() => {
                              setAnalysisLens(lens.id);
                              setRailSearchQuery('');
                              setRailSearchOpen(false);
                            }}
                            style={{
                              fontSize: '12px',
                              fontWeight: active ? 800 : 600,
                              padding: '4px 6px',
                              border: 'none',
                              background: 'transparent',
                              color: active ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                              textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              textAlign: 'left',
                            }}
                          >
                            {lens.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* BLOCK 2: SUB-MODES, OVERLAYS & SEARCHABLE ASSET/COUNTRY/CCY COMBOBOX */}
                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.07))',
                      paddingTop: '0.42rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.38rem',
                    }}
                  >
                    <div
                      className="mono-metric"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px',
                        color: 'var(--text-main, #ffffff)',
                        fontWeight: 700,
                      }}
                    >
                      <span>{tx('Configuración', 'Sub-Mode & Search')}</span>
                      <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '11.5px' }}>
                        {isRatesCurveMode
                          ? `${selectedCurveCountry} • 42 PAÍSES`
                          : isFxCrossMode
                            ? `${fxBaseCcy}/${fxQuoteCcy} • 61 CCY`
                            : `${currentAsset.sym} • ${currentAsset.cat}`}
                      </span>
                    </div>

                    {/* 4.2 TECHNICAL OVERLAYS: 2x2 Toggle Grid + Searchable Asset Combobox */}
                    {analysisLens === 'technical' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.24rem' }}>
                          {[
                            { label: 'SMA (20)', active: showSma20, toggle: () => setShowSma20(!showSma20) },
                            { label: 'Bollinger (2σ)', active: showBollinger, toggle: () => setShowBollinger(!showBollinger) },
                            { label: 'VWAP', active: showVwap, toggle: () => setShowVwap(!showVwap) },
                            {
                              label: tx('Panel: Volumen', 'Sub: Volume'),
                              active: showSubChart === 'vol',
                              toggle: () => setShowSubChart(showSubChart === 'vol' ? 'none' : 'vol'),
                            },
                          ].map((tool) => (
                            <button
                              key={tool.label}
                              type="button"
                              onClick={tool.toggle}
                              style={{
                                fontSize: '11.5px',
                                fontWeight: tool.active ? 800 : 600,
                                padding: '3px 6px',
                                border: 'none',
                                background: 'transparent',
                                color: tool.active ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                                textShadow: tool.active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              {tool.label}
                            </button>
                          ))}
                        </div>

                        {/* Searchable Asset Combobox */}
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.38rem',
                              backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.88))',
                              border: '1px solid rgba(var(--ui-accent-rgb), 0.38)',
                              borderRadius: '999px',
                              padding: '0.24rem 0.65rem',
                            }}
                          >
                            <Search size={11} style={{ color: 'var(--ui-accent)', flexShrink: 0 }} />
                            <input
                              type="text"
                              value={railSearchQuery}
                              onFocus={() => {
                                setRailSearchOpen(true);
                                setRailSearchIdx(0);
                              }}
                              onBlur={() => setTimeout(() => setRailSearchOpen(false), 160)}
                              onChange={(e) => {
                                setRailSearchQuery(e.target.value);
                                setRailSearchOpen(true);
                                setRailSearchIdx(0);
                              }}
                              onKeyDown={(e) => {
                                if (!generalAssetMatches.length) return;
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setRailSearchIdx((p) => (p + 1) % generalAssetMatches.length);
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setRailSearchIdx((p) => (p - 1 + generalAssetMatches.length) % generalAssetMatches.length);
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const target = generalAssetMatches[railSearchIdx] || generalAssetMatches[0];
                                  if (target) {
                                    syncTickerDependentToolState(target.sym);
                                    setRailSearchQuery('');
                                    setRailSearchOpen(false);
                                  }
                                } else if (e.key === 'Escape') {
                                  setRailSearchOpen(false);
                                }
                              }}
                              placeholder={
                                txTpl("Buscar activo ({0})...", [currentAsset.sym], "Search asset ({0})...", [currentAsset.sym])
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'var(--text-main, #ffffff)',
                                fontSize: '0.62rem',
                                width: '100%',
                              }}
                            />
                          </div>

                          {railSearchOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 5px)',
                                left: 0,
                                right: 0,
                                maxHeight: '210px',
                                overflowY: 'auto',
                                borderRadius: '12px',
                                backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.98))',
                                border: '1px solid rgba(var(--ui-accent-rgb), 0.42)',
                                boxShadow: '0 16px 36px rgba(0,0,0,0.8)',
                                padding: '0.28rem',
                                zIndex: 95,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.14rem',
                              }}
                            >
                              {generalAssetMatches.map((item, idx) => (
                                <button
                                  key={item.sym}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    syncTickerDependentToolState(item.sym);
                                    setRailSearchQuery('');
                                    setRailSearchOpen(false);
                                  }}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.34rem 0.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor:
                                      idx === railSearchIdx || item.sym === currentAsset.sym
                                        ? 'rgba(var(--ui-accent-rgb), 0.18)'
                                        : 'transparent',
                                    color: 'var(--text-main, #ffffff)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                  }}
                                >
                                  <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800 }}>
                                    {item.sym}{' '}
                                    <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                                      • {item.name.slice(0, 18)}
                                    </span>
                                  </span>
                                  <span className="mono-metric" style={{ fontSize: '0.56rem', color: item.chgNum >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)', fontWeight: 700 }}>
                                    {item.chg}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* 4.3 RELATIVE COMPARISON (%): Searchable Compatible Peer Combobox */}
                    {analysisLens === 'compare' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem', position: 'relative' }}>
                        {compareSymbol && (
                          <div
                            className="mono-metric"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.35rem',
                              fontSize: '0.58rem',
                              fontWeight: 800,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '9px',
                              border: '1px solid #38bdf8',
                              backgroundColor: 'rgba(56, 189, 248, 0.16)',
                              color: 'var(--info-text, #38bdf8)',
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
                              style={{ background: 'transparent', border: 'none', color: 'var(--info-text, #38bdf8)', cursor: 'pointer', padding: 0, display: 'flex' }}
                            >
                              <X size={11} />
                            </button>
                          </div>
                        )}

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.38rem',
                            backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.88))',
                            border: '1px solid rgba(56, 189, 248, 0.42)',
                            borderRadius: '999px',
                            padding: '0.24rem 0.65rem',
                          }}
                        >
                          <Search size={11} style={{ color: 'var(--info-text, #38bdf8)', flexShrink: 0 }} />
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
                              txTpl("Buscar par compatible ({0})...", [currentAsset.cat], "Search compatible peer ({0})...", [currentAsset.cat])
                            }
                            style={{
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              color: 'var(--text-main, #ffffff)',
                              fontSize: '0.62rem',
                              width: '100%',
                            }}
                          />
                        </div>

                        {compareDropdownOpen && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 5px)',
                              left: 0,
                              right: 0,
                              maxHeight: '215px',
                              overflowY: 'auto',
                              borderRadius: '12px',
                              backgroundColor: 'var(--bg-elevated, rgba(10, 15, 26, 0.98))',
                              border: '1px solid rgba(56, 189, 248, 0.42)',
                              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.8)',
                              padding: '0.28rem',
                              zIndex: 95,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.15rem',
                            }}
                          >
                            {compatibleCompareMatches.map((peer, idx) => {
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
                                    gap: '0.4rem',
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: '8px',
                                    backgroundColor: isActive || isHighlighted ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
                                    border: isActive ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid transparent',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                  }}
                                >
                                  <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--text-main, #ffffff)' }}>
                                    {peer.sym}{' '}
                                    <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                                      • {peer.name.slice(0, 16)}
                                    </span>
                                  </span>
                                  <span className="mono-metric" style={{ fontSize: '0.58rem', fontWeight: 700, color: peer.chgNum >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)' }}>
                                    {peer.chg}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 4.4 MICROSTRUCTURE & FLOW: Sub-Pane Switcher + Searchable Asset Combobox */}
                    {analysisLens === 'microstructure' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.24rem' }}>
                          {[
                            { label: 'Z-Score (20d)', id: 'zscore' },
                            { label: '24h Vol Bars', id: 'vol' },
                          ].map((pane) => {
                            const active = showSubChart === pane.id;
                            return (
                              <button
                                key={pane.id}
                                type="button"
                                onClick={() => setShowSubChart(pane.id)}
                                style={{
                                  fontSize: '11.5px',
                                  fontWeight: active ? 800 : 600,
                                  padding: '3px 6px',
                                  border: 'none',
                                  background: 'transparent',
                                  color: active ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                                  textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                              >
                                {pane.label}
                              </button>
                            );
                          })}
                        </div>

                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.38rem',
                              backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.88))',
                              border: '1px solid rgba(var(--ui-accent-rgb), 0.38)',
                              borderRadius: '999px',
                              padding: '0.24rem 0.65rem',
                            }}
                          >
                            <Search size={11} style={{ color: 'var(--ui-accent)', flexShrink: 0 }} />
                            <input
                              type="text"
                              value={railSearchQuery}
                              onFocus={() => {
                                setRailSearchOpen(true);
                                setRailSearchIdx(0);
                              }}
                              onBlur={() => setTimeout(() => setRailSearchOpen(false), 160)}
                              onChange={(e) => {
                                setRailSearchQuery(e.target.value);
                                setRailSearchOpen(true);
                                setRailSearchIdx(0);
                              }}
                              onKeyDown={(e) => {
                                if (!generalAssetMatches.length) return;
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setRailSearchIdx((p) => (p + 1) % generalAssetMatches.length);
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setRailSearchIdx((p) => (p - 1 + generalAssetMatches.length) % generalAssetMatches.length);
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const target = generalAssetMatches[railSearchIdx] || generalAssetMatches[0];
                                  if (target) {
                                    syncTickerDependentToolState(target.sym);
                                    setRailSearchQuery('');
                                    setRailSearchOpen(false);
                                  }
                                } else if (e.key === 'Escape') {
                                  setRailSearchOpen(false);
                                }
                              }}
                              placeholder={
                                txTpl("Buscar activo ({0})...", [currentAsset.sym], "Search asset ({0})...", [currentAsset.sym])
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'var(--text-main, #ffffff)',
                                fontSize: '0.62rem',
                                width: '100%',
                              }}
                            />
                          </div>

                          {railSearchOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 5px)',
                                left: 0,
                                right: 0,
                                maxHeight: '210px',
                                overflowY: 'auto',
                                borderRadius: '12px',
                                backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.98))',
                                border: '1px solid rgba(var(--ui-accent-rgb), 0.42)',
                                boxShadow: '0 16px 36px rgba(0,0,0,0.8)',
                                padding: '0.28rem',
                                zIndex: 95,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.14rem',
                              }}
                            >
                              {generalAssetMatches.map((item, idx) => (
                                <button
                                  key={item.sym}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    syncTickerDependentToolState(item.sym);
                                    setRailSearchQuery('');
                                    setRailSearchOpen(false);
                                  }}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.34rem 0.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor:
                                      idx === railSearchIdx || item.sym === currentAsset.sym
                                        ? 'rgba(var(--ui-accent-rgb), 0.18)'
                                        : 'transparent',
                                    color: 'var(--text-main, #ffffff)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                  }}
                                >
                                  <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800 }}>
                                    {item.sym}{' '}
                                    <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                                      • {item.name.slice(0, 18)}
                                    </span>
                                  </span>
                                  <span className="mono-metric" style={{ fontSize: '0.56rem', color: 'var(--accent, #10b981)', fontWeight: 700 }}>
                                    {item.volumeZScore}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* 4.6 SOVEREIGN YIELD CURVE (42 COUNTRIES): 3D/2D Sub-Modes + Searchable Country Combobox */}
                    {isRatesCurveMode && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.22rem' }}>
                          {[
                            { id: '3d-history', label: tx('3D (Hist)', '3D (Hist)') },
                            { id: '3d-peers', label: tx('3D (Países)', '3D (Peers)') },
                            { id: '2d', label: tx('Curva 2D', '2D Curve') },
                          ].map((sub) => {
                            const active = ratesSubView === sub.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => setRatesSubView(sub.id)}
                                style={{
                                  fontSize: '11.5px',
                                  fontWeight: active ? 800 : 600,
                                  padding: '3px 4px',
                                  border: 'none',
                                  background: 'transparent',
                                  color: active ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                                  textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                {sub.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Searchable Country Combobox (42 Sovereign Countries) */}
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.38rem',
                              backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.88))',
                              border: '1px solid rgba(16, 185, 129, 0.45)',
                              borderRadius: '999px',
                              padding: '0.24rem 0.65rem',
                            }}
                          >
                            <Search size={11} style={{ color: 'var(--accent, #10b981)', flexShrink: 0 }} />
                            <input
                              type="text"
                              value={railSearchQuery}
                              onFocus={() => {
                                setRailSearchOpen(true);
                                setRailSearchIdx(0);
                              }}
                              onBlur={() => setTimeout(() => setRailSearchOpen(false), 160)}
                              onChange={(e) => {
                                setRailSearchQuery(e.target.value);
                                setRailSearchOpen(true);
                                setRailSearchIdx(0);
                              }}
                              onKeyDown={(e) => {
                                if (!sovereignCountryMatches.length) return;
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setRailSearchIdx((p) => (p + 1) % sovereignCountryMatches.length);
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setRailSearchIdx((p) => (p - 1 + sovereignCountryMatches.length) % sovereignCountryMatches.length);
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const target = sovereignCountryMatches[railSearchIdx] || sovereignCountryMatches[0];
                                  if (target) {
                                    setSelectedCurveCountry(target.code);
                                    const matchingRateAsset =
                                      ASSET_CATALOG.find((a) => a.cat === 'RATES' && a.countryCode === target.code && a.sym.endsWith('10Y')) ||
                                      ASSET_CATALOG.find((a) => a.cat === 'RATES' && a.countryCode === target.code);
                                    if (matchingRateAsset) onSelectAsset(matchingRateAsset.sym);
                                    setRailSearchQuery('');
                                    setRailSearchOpen(false);
                                  }
                                } else if (e.key === 'Escape') {
                                  setRailSearchOpen(false);
                                }
                              }}
                              placeholder={
                                txTpl("Buscar país ({0} • {1})...", [selectedCurveCountry, SOVEREIGN_YIELD_CURVES[selectedCurveCountry]?.country?.[langCode] || SOVEREIGN_YIELD_CURVES[selectedCurveCountry]?.country?.EN || selectedCurveCountry], "Search country ({0} • {1})...", [selectedCurveCountry, SOVEREIGN_YIELD_CURVES[selectedCurveCountry]?.country?.[langCode] || SOVEREIGN_YIELD_CURVES[selectedCurveCountry]?.country?.EN || selectedCurveCountry])
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'var(--text-main, #ffffff)',
                                fontSize: '0.62rem',
                                width: '100%',
                              }}
                            />
                          </div>

                          {railSearchOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 5px)',
                                left: 0,
                                right: 0,
                                maxHeight: '220px',
                                overflowY: 'auto',
                                borderRadius: '12px',
                                backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.98))',
                                border: '1px solid rgba(16, 185, 129, 0.45)',
                                boxShadow: '0 16px 36px rgba(0,0,0,0.8)',
                                padding: '0.28rem',
                                zIndex: 95,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.14rem',
                              }}
                            >
                              {sovereignCountryMatches.map((item, idx) => (
                                <button
                                  key={item.code}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setSelectedCurveCountry(item.code);
                                    const matchingRateAsset =
                                      ASSET_CATALOG.find((a) => a.cat === 'RATES' && a.countryCode === item.code && a.sym.endsWith('10Y')) ||
                                      ASSET_CATALOG.find((a) => a.cat === 'RATES' && a.countryCode === item.code);
                                    if (matchingRateAsset) onSelectAsset(matchingRateAsset.sym);
                                    setRailSearchQuery('');
                                    setRailSearchOpen(false);
                                  }}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.34rem 0.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor:
                                      idx === railSearchIdx || item.code === selectedCurveCountry
                                        ? 'rgba(16, 185, 129, 0.18)'
                                        : 'transparent',
                                    color: 'var(--text-main, #ffffff)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                  }}
                                >
                                  <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800 }}>
                                    {item.code}{' '}
                                    <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                                      • {item.name} ({item.rating})
                                    </span>
                                  </span>
                                  <span className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--accent, #10b981)', fontWeight: 800 }}>
                                    10Y {item.y10}%
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* 4.7 FX CROSS CONVERTER (61 CURRENCIES): Notional + Swap + 2 Searchable CCY Comboboxes */}
                    {isFxCrossMode && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.28rem' }}>
                          <input
                            type="number"
                            min="1"
                            value={fxAmount}
                            onChange={(e) => setFxAmount(Math.max(1, Number(e.target.value) || 1))}
                            className="mono-metric"
                            style={{
                              width: '76px',
                              backgroundColor: 'var(--bg-elevated, rgba(13, 19, 33, 0.92))',
                              color: 'var(--text-main, #ffffff)',
                              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.18))',
                              borderRadius: '8px',
                              padding: '0.2rem 0.42rem',
                              fontSize: '0.6rem',
                              fontWeight: 800,
                              outline: 'none',
                              textAlign: 'right',
                            }}
                          />
                          {[1000, 10000, 100000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setFxAmount(amt)}
                              className="mono-metric"
                              style={{
                                flex: 1,
                                fontSize: '11.5px',
                                fontWeight: fxAmount === amt ? 800 : 600,
                                padding: '2px 4px',
                                border: 'none',
                                background: 'transparent',
                                color: fxAmount === amt ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                                textShadow: fxAmount === amt ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                cursor: 'pointer',
                              }}
                            >
                              {amt >= 1000 ? `${amt / 1000}k` : amt}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const prevBase = fxBaseCcy;
                              const nextBase = fxQuoteCcy;
                              setFxBaseCcy(nextBase);
                              setFxQuoteCcy(prevBase);
                              syncCatalogFxPair(nextBase, prevBase);
                            }}
                            title={tx('Invertir par de divisas', 'Swap currency pair')}
                            className="mono-metric"
                            style={{
                              background: 'transparent',
                              color: 'var(--ui-accent, #10b981)',
                              border: 'none',
                              padding: '2px 6px',
                              fontSize: '13px',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            ⇄
                          </button>
                        </div>

                        {/* Two Searchable Currency Comboboxes (Base CCY & Quote CCY across 61 ISO Currencies) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.28rem' }}>
                          {/* Base CCY Search Combobox */}
                          <div style={{ position: 'relative' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.28rem',
                                backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.88))',
                                border: '1px solid rgba(16, 185, 129, 0.45)',
                                borderRadius: '999px',
                                padding: '0.22rem 0.5rem',
                              }}
                            >
                              <Search size={10} style={{ color: 'var(--accent, #10b981)', flexShrink: 0 }} />
                              <input
                                type="text"
                                value={railSearchQuery}
                                onFocus={() => {
                                  setRailSearchOpen(true);
                                  setRailSearchIdx(0);
                                }}
                                onBlur={() => setTimeout(() => setRailSearchOpen(false), 160)}
                                onChange={(e) => {
                                  setRailSearchQuery(e.target.value);
                                  setRailSearchOpen(true);
                                  setRailSearchIdx(0);
                                }}
                                onKeyDown={(e) => {
                                  if (!fxBaseMatches.length) return;
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setRailSearchIdx((p) => (p + 1) % fxBaseMatches.length);
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    setRailSearchIdx((p) => (p - 1 + fxBaseMatches.length) % fxBaseMatches.length);
                                  } else if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const target = fxBaseMatches[railSearchIdx] || fxBaseMatches[0];
                                    if (target) {
                                      setFxBaseCcy(target.code);
                                      syncCatalogFxPair(target.code, fxQuoteCcy);
                                      setRailSearchQuery('');
                                      setRailSearchOpen(false);
                                    }
                                  } else if (e.key === 'Escape') {
                                    setRailSearchOpen(false);
                                  }
                                }}
                                placeholder={`Base: ${fxBaseCcy}`}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  outline: 'none',
                                  color: 'var(--accent, #10b981)',
                                  fontWeight: 700,
                                  fontSize: '0.58rem',
                                  width: '100%',
                                }}
                              />
                            </div>

                            {railSearchOpen && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 'calc(100% + 5px)',
                                  left: 0,
                                  width: '230px',
                                  maxHeight: '210px',
                                  overflowY: 'auto',
                                  borderRadius: '12px',
                                  backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.98))',
                                  border: '1px solid rgba(16, 185, 129, 0.45)',
                                  boxShadow: '0 16px 36px rgba(0,0,0,0.8)',
                                  padding: '0.28rem',
                                  zIndex: 95,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.12rem',
                                }}
                              >
                                {fxBaseMatches.map((item, idx) => (
                                  <button
                                    key={item.code}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setFxBaseCcy(item.code);
                                      syncCatalogFxPair(item.code, fxQuoteCcy);
                                      setRailSearchQuery('');
                                      setRailSearchOpen(false);
                                    }}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: '0.32rem 0.48rem',
                                      borderRadius: '8px',
                                      border: 'none',
                                      backgroundColor:
                                        idx === railSearchIdx || item.code === fxBaseCcy
                                          ? 'rgba(16, 185, 129, 0.18)'
                                          : 'transparent',
                                      color: 'var(--text-main, #ffffff)',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                    }}
                                  >
                                    <span className="mono-metric" style={{ fontSize: '0.6rem', fontWeight: 800 }}>
                                      {item.code} <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>• {item.name.slice(0, 15)}</span>
                                    </span>
                                    <span className="mono-metric" style={{ fontSize: '0.54rem', color: 'var(--accent, #10b981)' }}>
                                      {item.rate10Y}%
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Quote CCY Search Combobox */}
                          <div style={{ position: 'relative' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.28rem',
                                backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.88))',
                                border: '1px solid rgba(56, 189, 248, 0.45)',
                                borderRadius: '999px',
                                padding: '0.22rem 0.5rem',
                              }}
                            >
                              <Search size={10} style={{ color: 'var(--info-text, #38bdf8)', flexShrink: 0 }} />
                              <input
                                type="text"
                                value={fxQuoteQuery}
                                onFocus={() => {
                                  setFxQuoteOpen(true);
                                  setFxQuoteIdx(0);
                                }}
                                onBlur={() => setTimeout(() => setFxQuoteOpen(false), 160)}
                                onChange={(e) => {
                                  setFxQuoteQuery(e.target.value);
                                  setFxQuoteOpen(true);
                                  setFxQuoteIdx(0);
                                }}
                                onKeyDown={(e) => {
                                  if (!fxQuoteMatches.length) return;
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setFxQuoteIdx((p) => (p + 1) % fxQuoteMatches.length);
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    setFxQuoteIdx((p) => (p - 1 + fxQuoteMatches.length) % fxQuoteMatches.length);
                                  } else if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const target = fxQuoteMatches[fxQuoteIdx] || fxQuoteMatches[0];
                                    if (target) {
                                      setFxQuoteCcy(target.code);
                                      syncCatalogFxPair(fxBaseCcy, target.code);
                                      setFxQuoteQuery('');
                                      setFxQuoteOpen(false);
                                    }
                                  } else if (e.key === 'Escape') {
                                    setFxQuoteOpen(false);
                                  }
                                }}
                                placeholder={`Quote: ${fxQuoteCcy}`}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  outline: 'none',
                                  color: 'var(--info-text, #38bdf8)',
                                  fontWeight: 700,
                                  fontSize: '0.58rem',
                                  width: '100%',
                                }}
                              />
                            </div>

                            {fxQuoteOpen && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 'calc(100% + 5px)',
                                  right: 0,
                                  width: '230px',
                                  maxHeight: '210px',
                                  overflowY: 'auto',
                                  borderRadius: '12px',
                                  backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.98))',
                                  border: '1px solid rgba(56, 189, 248, 0.45)',
                                  boxShadow: '0 16px 36px rgba(0,0,0,0.8)',
                                  padding: '0.28rem',
                                  zIndex: 95,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.12rem',
                                }}
                              >
                                {fxQuoteMatches.map((item, idx) => (
                                  <button
                                    key={item.code}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setFxQuoteCcy(item.code);
                                      syncCatalogFxPair(fxBaseCcy, item.code);
                                      setFxQuoteQuery('');
                                      setFxQuoteOpen(false);
                                    }}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: '0.32rem 0.48rem',
                                      borderRadius: '8px',
                                      border: 'none',
                                      backgroundColor:
                                        idx === fxQuoteIdx || item.code === fxQuoteCcy
                                          ? 'rgba(56, 189, 248, 0.18)'
                                          : 'transparent',
                                      color: 'var(--text-main, #ffffff)',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                    }}
                                  >
                                    <span className="mono-metric" style={{ fontSize: '0.6rem', fontWeight: 800 }}>
                                      {item.code} <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>• {item.name.slice(0, 15)}</span>
                                    </span>
                                    <span className="mono-metric" style={{ fontSize: '0.54rem', color: 'var(--info-text, #38bdf8)' }}>
                                      {item.rate10Y}%
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* 4.8 COMMODITY FORWARD (26 FUTURES): 3D/2D Sub-Modes + Searchable Commodity Combobox */}
                    {isCommodityCurveMode && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.24rem' }}>
                          {[
                            { id: '3d', label: tx('Superficie 3D', '3D Surface') },
                            { id: '2d', label: tx('Curva 2D', '2D Curve') },
                          ].map((sub) => {
                            const active = commoditySubView === sub.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => setCommoditySubView(sub.id)}
                                style={{
                                  fontSize: '11.5px',
                                  fontWeight: active ? 800 : 600,
                                  padding: '3px 6px',
                                  border: 'none',
                                  background: 'transparent',
                                  color: active ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                                  textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                              >
                                {sub.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Searchable Commodity Combobox */}
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.38rem',
                              backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.88))',
                              border: '1px solid rgba(16, 185, 129, 0.45)',
                              borderRadius: '999px',
                              padding: '0.24rem 0.65rem',
                            }}
                          >
                            <Search size={11} style={{ color: 'var(--accent, #10b981)', flexShrink: 0 }} />
                            <input
                              type="text"
                              value={railSearchQuery}
                              onFocus={() => {
                                setRailSearchOpen(true);
                                setRailSearchIdx(0);
                              }}
                              onBlur={() => setTimeout(() => setRailSearchOpen(false), 160)}
                              onChange={(e) => {
                                setRailSearchQuery(e.target.value);
                                setRailSearchOpen(true);
                                setRailSearchIdx(0);
                              }}
                              onKeyDown={(e) => {
                                if (!commodityMatches.length) return;
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setRailSearchIdx((p) => (p + 1) % commodityMatches.length);
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setRailSearchIdx((p) => (p - 1 + commodityMatches.length) % commodityMatches.length);
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const target = commodityMatches[railSearchIdx] || commodityMatches[0];
                                  if (target) {
                                    syncTickerDependentToolState(target.sym);
                                    setRailSearchQuery('');
                                    setRailSearchOpen(false);
                                  }
                                } else if (e.key === 'Escape') {
                                  setRailSearchOpen(false);
                                }
                              }}
                              placeholder={
                                txTpl("Buscar commodity ({0} • {1})...", [currentAsset.sym, currentAsset.name], "Search commodity ({0} • {1})...", [currentAsset.sym, currentAsset.name])
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'var(--text-main, #ffffff)',
                                fontSize: '0.62rem',
                                width: '100%',
                              }}
                            />
                          </div>

                          {railSearchOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 5px)',
                                left: 0,
                                right: 0,
                                maxHeight: '215px',
                                overflowY: 'auto',
                                borderRadius: '12px',
                                backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.98))',
                                border: '1px solid rgba(16, 185, 129, 0.45)',
                                boxShadow: '0 16px 36px rgba(0,0,0,0.8)',
                                padding: '0.28rem',
                                zIndex: 95,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.14rem',
                              }}
                            >
                              {commodityMatches.map((cm, idx) => (
                                <button
                                  key={cm.sym}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    syncTickerDependentToolState(cm.sym);
                                    setRailSearchQuery('');
                                    setRailSearchOpen(false);
                                  }}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.34rem 0.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor:
                                      idx === railSearchIdx || cm.sym === currentAsset.sym
                                        ? 'rgba(16, 185, 129, 0.18)'
                                        : 'transparent',
                                    color: 'var(--text-main, #ffffff)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                  }}
                                >
                                  <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800 }}>
                                    {cm.sym}{' '}
                                    <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                                      • {cm.name.slice(0, 18)}
                                    </span>
                                  </span>
                                  <span className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--accent, #10b981)', fontWeight: 700 }}>
                                    {cm.priceFormatted}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* 4.5 OPTIONS 3D VOL SURFACE, 2D SMILE & MULTI-LEG PAYOFF */}
                    {isOptionsBaseMode && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.22rem' }}>
                          {[
                            { id: 'surface3d', label: tx('Superficie 3D', '3D Surface') },
                            { id: 'surface', label: tx('Sonrisa 2D', '2D Smile') },
                            { id: 'payoff', label: tx('Payoff P&L', 'Payoff P&L') },
                          ].map((sub) => {
                            const active = optionsSubView === sub.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => setOptionsSubView(sub.id)}
                                style={{
                                  fontSize: '11.5px',
                                  fontWeight: active ? 800 : 600,
                                  padding: '3px 4px',
                                  border: 'none',
                                  background: 'transparent',
                                  color: active ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                                  textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                {sub.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Searchable Underlying / Optionable Asset Combobox */}
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.38rem',
                              backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.88))',
                              border: '1px solid rgba(56, 189, 248, 0.45)',
                              borderRadius: '999px',
                              padding: '0.24rem 0.65rem',
                            }}
                          >
                            <Search size={11} style={{ color: 'var(--info-text, #38bdf8)', flexShrink: 0 }} />
                            <input
                              type="text"
                              value={railSearchQuery}
                              onFocus={() => {
                                setRailSearchOpen(true);
                                setRailSearchIdx(0);
                              }}
                              onBlur={() => setTimeout(() => setRailSearchOpen(false), 160)}
                              onChange={(e) => {
                                setRailSearchQuery(e.target.value);
                                setRailSearchOpen(true);
                                setRailSearchIdx(0);
                              }}
                              onKeyDown={(e) => {
                                if (!optionableMatches.length) return;
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setRailSearchIdx((p) => (p + 1) % optionableMatches.length);
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setRailSearchIdx((p) => (p - 1 + optionableMatches.length) % optionableMatches.length);
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const target = optionableMatches[railSearchIdx] || optionableMatches[0];
                                  if (target) {
                                    syncTickerDependentToolState(target.sym);
                                    setRailSearchQuery('');
                                    setRailSearchOpen(false);
                                  }
                                } else if (e.key === 'Escape') {
                                  setRailSearchOpen(false);
                                }
                              }}
                              placeholder={
                                txTpl("Buscar subyacente ({0})...", [currentAsset.sym], "Search underlying ({0})...", [currentAsset.sym])
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'var(--text-main, #ffffff)',
                                fontSize: '0.62rem',
                                width: '100%',
                              }}
                            />
                          </div>

                          {railSearchOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 5px)',
                                left: 0,
                                right: 0,
                                maxHeight: '215px',
                                overflowY: 'auto',
                                borderRadius: '12px',
                                backgroundColor: 'var(--bg-glass-strong, rgba(8, 12, 22, 0.98))',
                                border: '1px solid rgba(56, 189, 248, 0.45)',
                                boxShadow: '0 16px 36px rgba(0,0,0,0.8)',
                                padding: '0.28rem',
                                zIndex: 95,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.14rem',
                              }}
                            >
                              {optionableMatches.slice(0, 16).map((item, idx) => (
                                <button
                                  key={item.sym}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    syncTickerDependentToolState(item.sym);
                                    setRailSearchQuery('');
                                    setRailSearchOpen(false);
                                  }}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.34rem 0.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor:
                                      idx === railSearchIdx || item.sym === currentAsset.sym
                                        ? 'rgba(56, 189, 248, 0.18)'
                                        : 'transparent',
                                    color: 'var(--text-main, #ffffff)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                  }}
                                >
                                  <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800 }}>
                                    {item.sym}{' '}
                                    <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                                      • {item.name.slice(0, 17)}
                                    </span>
                                  </span>
                                  <span className="mono-metric" style={{ fontSize: '0.56rem', color: 'var(--info-text, #38bdf8)', fontWeight: 700 }}>
                                    {item.priceFormatted}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Multi-Leg Strategy Pills when in Payoff Mode */}
                        {isOptionsPayoffMode && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.22rem' }}>
                            {OPTIONS_STRATEGIES.map((st) => {
                              const active = selectedOptStrategy === st.id;
                              return (
                                <button
                                  key={st.id}
                                  type="button"
                                  onClick={() => setSelectedOptStrategy(st.id)}
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: active ? 800 : 600,
                                    padding: '2px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: active ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                                    textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    textAlign: 'left',
                                  }}
                                >
                                  {(st.label[langCode] || st.label.EN).split(' (')[0]}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* BLOCK 3: 2x3 DUAL-TIER QUANTITATIVE TELEMETRY PILLS */}
                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.07))',
                      paddingTop: '0.42rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.32rem',
                    }}
                  >
                    <div
                      className="mono-metric"
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-main, #ffffff)',
                        fontWeight: 700,
                      }}
                    >
                      {tx('Indicadores Clave', 'Quant Telemetry')}
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: '8px',
                      }}
                    >
                      {railTelemetryPills.map((k) => (
                        <div
                          key={k.label}
                          className="mono-metric"
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                            borderLeft: `3px solid ${k.color === '#ffffff' || String(k.color).includes('--text-main') ? 'var(--accent, #10b981)' : k.color}`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '3px',
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 700,
                              color: 'var(--text-muted, #94a3b8)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {k.label}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '4px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 800, color: k.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {k.val}
                            </span>
                          </div>
                          <span style={{ fontSize: '10px', color: 'var(--text-dim, #64748b)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {k.sub}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* RIGHT UNOBSTRUCTED 3D / 2D STAGE (+45PX FULL VERTICAL HEIGHT)*/}
                {/* ============================================================ */}
                <div
                  className="resp-l2-chart-stage"
                  style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}
                >
                  {is3DSurfaceActive && active3DSurfaceData ? (
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <Surface3DViewer surfaceData={active3DSurfaceData} isES={isES} />
                    </div>
                  ) : (
                    <>
                      {/* Multi-Granularity Timeframe & Rollup Header Strip */}
                      {(() => {
                        const firstPt = activeChartData[0] || {};
                        const lastPt = activeChartData[activeChartData.length - 1] || {};
                        const tfObj = TIMEFRAMES.find((tf) => tf.id === timeframe) || { label: '1D' };
                        const granLabel =
                          isRatesCurveMode
                            ? `${selectedCurveCountry} Sovereign Term Structure (1M → 30Y)`
                            : isCommodityCurveMode
                              ? `${currentAsset.sym} Futures Term Structure (Spot → M24)`
                              : isOptionsPayoffMode
                                ? `${cleanUndSym} Expiration Payoff Profile`
                                : isOptionsSmileMode
                                  ? `${cleanUndSym} Implied Volatility Smile (7D–180D)`
                                  : firstPt.granularity || 'Intraday (24h)';
                        const rangeLabel =
                          firstPt.time && lastPt.time ? `${firstPt.time} → ${lastPt.time}` : '';
                        const periodRet =
                          typeof lastPt.pctReturn === 'number'
                            ? `${lastPt.pctReturn >= 0 ? '+' : ''}${lastPt.pctReturn.toFixed(2)}%`
                            : currentAsset.chg;
                        return (
                          <div
                            className="mono-metric"
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '4px 10px',
                              padding: '2px 8px 4px',
                              borderBottom: '1px solid var(--border-slate, rgba(148, 163, 184, 0.12))',
                              fontSize: '11px',
                              color: 'var(--text-muted, #94a3b8)',
                              flexShrink: 0,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.14)',
                                  border: '1px solid rgba(var(--ui-accent-rgb, 16, 185, 129), 0.38)',
                                  color: 'var(--ui-accent, #10b981)',
                                  fontWeight: 800,
                                  fontSize: '10.5px',
                                }}
                              >
                                {isRatesCurveMode || isCommodityCurveMode || isOptionsPayoffMode || isOptionsSmileMode
                                  ? 'CURVE'
                                  : tfObj.label}
                              </span>
                              <span style={{ color: 'var(--text-secondary, #e2e8f0)', fontWeight: 700 }}>{granLabel}</span>
                              {rangeLabel && <span style={{ color: 'var(--text-dim, #64748b)' }}>({rangeLabel})</span>}
                            </div>
                            {!isRatesCurveMode && !isCommodityCurveMode && !isOptionsPayoffMode && !isOptionsSmileMode && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                {typeof firstPt.price === 'number' && typeof lastPt.price === 'number' && (
                                  <span style={{ color: 'var(--text-muted, #94a3b8)' }}>
                                    Open: <strong style={{ color: 'var(--text-body, #cbd5e1)' }}>{firstPt.price}</strong> • Last:{' '}
                                    <strong style={{ color: 'var(--text-main, #ffffff)' }}>{lastPt.price}</strong>
                                  </span>
                                )}
                                <span
                                  style={{
                                    fontWeight: 800,
                                    color: (lastPt.pctReturn ?? currentAsset.chgNum) >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                                  }}
                                >
                                  {periodRet}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      <div style={{ flex: showSubChart === 'none' ? 1 : 0.74, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={activeChartData}>
                            <defs>
                              <linearGradient id="feyMainGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={assetMainColor} stopOpacity={0.45} />
                                <stop offset="95%" stopColor={assetMainColor} stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="time"
                              interval={isRatesCurveMode || isCommodityCurveMode || isOptionsSmileMode ? 0 : 'preserveStartEnd'}
                              minTickGap={isRatesCurveMode || isCommodityCurveMode || isOptionsSmileMode ? 6 : 28}
                              stroke="var(--text-dim)"
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
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
                                backgroundColor: 'var(--bg-glass-strong, rgba(10, 15, 28, 0.92))',
                                borderColor: 'rgba(255, 255, 255, 0.12)',
                                borderRadius: '12px',
                                fontSize: '0.73rem',
                              }}
                            />

                            {/* Primary Series */}
                            <Area
                              type={isRatesCurveMode || isCommodityCurveMode || isOptionsSmileMode || isOptionsPayoffMode ? 'monotone' : 'linear'}
                              dataKey={isCompareMode ? 'pctReturn' : 'price'}
                              name={
                                isRatesCurveMode
                                  ? `${selectedCurveCountry} Yield (%)`
                                  : isFxCrossMode
                                    ? `${fxBaseCcy}/${fxQuoteCcy} Cross Rate`
                                    : isCommodityCurveMode
                                      ? `${currentAsset.sym} Forward Curve`
                                      : isOptionsPayoffMode
                                        ? tx('P&L al Vencimiento ($)', 'Expiration Payoff P&L ($)')
                                        : isOptionsSmileMode
                                          ? `30D IV Surface (%)`
                                          : isCompareMode
                                            ? `${currentAsset.sym} (%)`
                                            : currentAsset.sym
                              }
                              stroke={assetMainColor}
                              strokeWidth={2}
                              fillOpacity={1}
                              fill={isCompareMode ? 'transparent' : 'url(#feyMainGrad)'}
                              isAnimationActive={false}
                            />

                            {/* Options Strategy Payoff Mode: Today T+0 Black-Scholes P&L + $0 Breakeven Line */}
                            {isOptionsPayoffMode && (
                              <>
                                <Line
                                  type="monotone"
                                  dataKey="t0Pnl"
                                  name={tx('P&L Hoy T+0 Black-Scholes ($)', 'Today T+0 Black-Scholes P&L ($)')}
                                  stroke="var(--info-text, #38bdf8)"
                                  strokeWidth={2.0}
                                  strokeDasharray="4 3"
                                  dot={false}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="zeroLine"
                                  name={tx('Línea Breakeven ($0)', 'Breakeven Line ($0)')}
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
                                  stroke="var(--danger, #f43f5e)"
                                  strokeWidth={1.9}
                                  strokeDasharray="3 3"
                                  dot={false}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="iv90d"
                                  name="90D Quarterly IV (%)"
                                  stroke="var(--info-text, #38bdf8)"
                                  strokeWidth={2.0}
                                  dot={false}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="iv180d"
                                  name="180D LEAPS IV (%)"
                                  stroke="var(--purple-text, #a78bfa)"
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
                                stroke="var(--info-text, #38bdf8)"
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
                                stroke="var(--purple-text, #a78bfa)"
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
                                stroke="var(--info-text, #38bdf8)"
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
                                stroke="var(--info-text, #38bdf8)"
                                strokeWidth={2.2}
                                dot={false}
                              />
                            )}

                            {/* Technical Overlays (when in Technical mode and not normalized %) */}
                            {!isCompareMode && !isRatesCurveMode && !isOptionsSmileMode && !isOptionsPayoffMode && !isFxCrossMode && !isCommodityCurveMode && showSma20 && (
                              <Line type="monotone" dataKey="sma20" name="SMA (20)" stroke="var(--info-text, #38bdf8)" strokeWidth={1.6} strokeDasharray="4 4" dot={false} />
                            )}
                            {!isCompareMode && !isRatesCurveMode && !isOptionsSmileMode && !isOptionsPayoffMode && !isFxCrossMode && !isCommodityCurveMode && showVwap && (
                              <Line type="monotone" dataKey="vwap" name="VWAP" stroke="var(--warn-text, #f59e0b)" strokeWidth={1.6} dot={false} />
                            )}
                            {!isCompareMode && !isRatesCurveMode && !isOptionsSmileMode && !isOptionsPayoffMode && !isFxCrossMode && !isCommodityCurveMode && showBollinger && (
                              <>
                                <Line type="monotone" dataKey="bbUpper" name="BB Upper" stroke="var(--purple-text, #a78bfa)" strokeWidth={1.2} strokeDasharray="3 3" dot={false} />
                                <Line type="monotone" dataKey="bbLower" name="BB Lower" stroke="var(--purple-text, #a78bfa)" strokeWidth={1.2} strokeDasharray="3 3" dot={false} />
                              </>
                            )}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Synchronized Sub-Pane (Volume Histogram or Intraday Z-Score) */}
                      {showSubChart !== 'none' && (
                        <div style={{ flex: 0.26, minHeight: 0, borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))', paddingTop: '0.35rem' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activeChartData}>
                              <XAxis
                                dataKey="time"
                                interval={isRatesCurveMode || isCommodityCurveMode || isOptionsSmileMode ? 0 : 'preserveStartEnd'}
                                minTickGap={isRatesCurveMode || isCommodityCurveMode || isOptionsSmileMode ? 6 : 28}
                                stroke="var(--text-dim)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis stroke="var(--text-dim)" fontSize={10} orientation="right" tickLine={false} axisLine={false} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'var(--bg-glass-strong, rgba(10, 15, 28, 0.92))',
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
              borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
              fontSize: '0.73rem',
              flexShrink: 0,
            }}
          >
            <div style={{ color: 'var(--text-muted)' }}>
              <strong style={{ color: scoreColor, marginRight: '0.45rem' }}>
                {isDislocated
                  ? tx('MOVIMIENTO ATÍPICO', 'ATYPICAL MOVE')
                  : isElevated
                    ? tx('ACTIVIDAD ELEVADA', 'ELEVATED ACTIVITY')
                    : tx('MOVIMIENTO NORMAL', 'NORMAL MOVEMENT')}
                {' • '}
              </strong>
              <span>
                {isDislocated
                  ? tx(
                      'Salto inusual de volumen y volatilidad fuera del rango estadístico normal',
                      'Unusual jump in volume and volatility outside the normal statistical range'
                    )
                  : isElevated
                    ? tx(
                        'Flujo institucional por encima del promedio sin romper la estructura de liquidez',
                        'Institutional flow above average without breaking liquidity structure'
                      )
                    : tx(
                        'Precio y volumen dentro de su rango habitual, sin presión inusual de compra o venta',
                        'Price and volume within their normal range, with no unusual buying or selling pressure'
                      )}
              </span>
              <span className="mono-metric" style={{ color: 'var(--text-dim, #64748b)', marginLeft: '0.45rem', fontSize: '0.68rem' }}>
                (P-06: {displayedScore}
                {isDislocated ? ' > 0.65' : ''} • Vol 20d: {currentAsset.volumeZScore || anomalyProfile.volumeZScore} •{' '}
                {isDislocated || isElevated
                  ? `${tx('Spread', 'Spread')}: ${anomalyProfile.spreadDislocation}`
                  : `${tx('Volatilidad', 'Volatility')}: ${anomalyProfile.realizedVol}`}
                )
              </span>
            </div>

            <span className="mono-metric" style={{ fontSize: '0.64rem', color: 'var(--text-dim)' }}>
              {anomalyProfile.alertTime} • MLFLOW ARTIFACT V1
            </span>
          </div>
        </>
      ) : (
        /* ==================================================================== */
        /* LEVEL 2 — RESEARCH MODE (FOC-01: 3-COLUMN FOCAL ARCHITECTURE)        */
        /* [1. Left Vertical RAG Chat | 2. Center Protagonist Accordion |       */
        /*  3. Right Chronological Timeline with Nodes + 24h AreaChart Below]   */
        /* ==================================================================== */
        (() => {
          const totalForce = Math.max(1, researchBrief.avgBull + researchBrief.avgBear);
          const bullPct = Math.round((researchBrief.avgBull / totalForce) * 100);
          const bearPct = 100 - bullPct;

          const allFactors = [
            ...researchBrief.bullDrivers.map((d, idx) => ({
              ...d,
              side: 'BULL',
              key: `BULL-${idx}`,
              rank: idx + 1,
              pctContribution: Math.max(12, Math.min(34, Math.round((d.score / Math.max(1, researchBrief.avgBull * 5)) * 100))),
            })),
            ...researchBrief.bearRisks.map((r, idx) => ({
              ...r,
              side: 'BEAR',
              key: `BEAR-${idx}`,
              rank: idx + 1,
              pctContribution: Math.max(12, Math.min(34, Math.round((r.score / Math.max(1, researchBrief.avgBear * 5)) * 100))),
            })),
          ].sort((a, b) => b.score - a.score);

          const filteredFactors =
            researchFactorFilter === 'bull'
              ? allFactors.filter((f) => f.side === 'BULL')
              : researchFactorFilter === 'bear'
              ? allFactors.filter((f) => f.side === 'BEAR')
              : allFactors;

          const sentimentSeries24h = (() => {
            const base = researchBrief.compositeScore || 0;
            const newsDelta = assetFinbertPolarity.score100 || 0;
            return [
              { time: '08:00', score: Math.max(-95, Math.min(95, Math.round(base * 0.55 - 8))) },
              { time: '10:00', score: Math.max(-95, Math.min(95, Math.round(base * 0.68 + 4))) },
              { time: '12:00', score: Math.max(-95, Math.min(95, Math.round(base * 0.52 - 5))) },
              { time: '14:00', score: Math.max(-95, Math.min(95, Math.round(base * 0.78 + 3))) },
              { time: '16:00', score: Math.max(-95, Math.min(95, Math.round(base * 0.84 - 2))) },
              { time: '18:00', score: Math.max(-95, Math.min(95, Math.round((base + newsDelta) * 0.52))) },
              { time: 'Now', score: Math.max(-95, Math.min(95, base)) },
            ];
          })();

          const strokeHex24h = researchBrief.compositeScore >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)';
          const gradId24h = `l2-research-sent-24h-${currentAsset.sym}`;

          const renderAccordionRow = (item, isCompact = false) => {
            const isBull = item.side === 'BULL';
            const accentHex = isBull ? 'var(--pos-text, #34d399)' : 'var(--neg-text, #fb7185)';
            const fillRgba = isBull ? 'rgba(16, 185, 129, 0.18)' : 'rgba(244, 63, 94, 0.18)';
            const isOpen = researchExpandedKey === item.key;
            const titleText = item.title[langCode] || item.title.EN;
            const detailText = item.detail[langCode] || item.detail.EN;

            return (
              <div
                key={item.key}
                onClick={() => setResearchExpandedKey(isOpen ? '' : item.key)}
                style={{
                  borderRadius: isOpen ? '7px' : '0px',
                  border: isOpen ? `1px solid ${accentHex}` : '1px solid transparent',
                  borderBottom: isOpen ? `1px solid ${accentHex}` : '1px solid var(--border-slate, rgba(148, 163, 184, 0.12))',
                  backgroundColor: isOpen ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.10)' : 'transparent',
                  overflow: 'hidden',
                  minWidth: 0,
                  cursor: 'pointer',
                  transition: 'all 0.16s ease',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    padding: isCompact ? '0.38rem 0.44rem' : '0.48rem 0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: isCompact ? '0.32rem' : '0.5rem',
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${Math.min(94, Math.max(18, item.score * 0.92))}%`,
                      background: fillRgba,
                      pointerEvents: 'none',
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: isCompact ? '0.32rem' : '0.48rem', minWidth: 0, flex: 1 }}>
                    <span
                      className="mono-metric"
                      style={{
                        fontSize: isCompact ? '0.58rem' : '0.64rem',
                        fontWeight: 800,
                        padding: isCompact ? '0.06rem 0.26rem' : '0.08rem 0.38rem',
                        borderRadius: '5px',
                        backgroundColor: isBull ? 'rgba(16, 185, 129, 0.16)' : 'rgba(244, 63, 94, 0.16)',
                        border: `1px solid ${isBull ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)'}`,
                        color: accentHex,
                        minWidth: isCompact ? '34px' : '42px',
                        textAlign: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.impactTag}
                    </span>
                    {item.isLiveUpdate && (
                      <span
                        className="mono-metric"
                        style={{
                          fontSize: '0.52rem',
                          fontWeight: 800,
                          padding: '0.06rem 0.34rem',
                          borderRadius: '999px',
                          backgroundColor: accentHex,
                          color: '#000',
                          flexShrink: 0,
                        }}
                      >
                        LIVE
                      </span>
                    )}
                    <span
                      style={{
                        color: 'var(--text-main, #f8fafc)',
                        fontSize: isCompact ? '0.68rem' : '0.75rem',
                        fontWeight: isOpen ? 700 : 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minWidth: 0,
                      }}
                    >
                      {titleText}
                    </span>
                  </div>

                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: isCompact ? '0.24rem' : '0.4rem', flexShrink: 0 }}>
                    {!isCompact && (
                      <span
                        className="mono-metric"
                        style={{
                          fontSize: '0.56rem',
                          padding: '0.06rem 0.32rem',
                          borderRadius: '4px',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                          color: item.importance === 'HIGH' ? 'var(--text-main, #f8fafc)' : 'var(--text-muted, #94a3b8)',
                        }}
                      >
                        {item.importance || 'HIGH'}
                      </span>
                    )}
                    <span className="mono-metric" style={{ fontSize: isCompact ? '0.58rem' : '0.64rem', color: 'var(--text-muted, #94a3b8)' }}>
                      {item.pctContribution}% {isOpen ? '▾' : '▸'}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div
                    style={{
                      padding: '0.52rem 0.72rem 0.6rem',
                      borderTop: '1px solid var(--border-slate, rgba(148, 163, 184, 0.14))',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.38rem',
                    }}
                  >
                    <div
                      className="mono-metric"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.6rem',
                        color: 'var(--text-muted, #94a3b8)',
                      }}
                    >
                      <span>
                        {tx('FUENTE OFICIAL:', 'OFFICIAL SOURCE:')}{' '}
                        {researchBrief.filingSource[langCode] || researchBrief.filingSource.EN}
                      </span>
                      <span style={{ color: accentHex, fontWeight: 700 }}>
                        {isBull ? (tx('CATALIZADOR ALCISTA', 'BULL DRIVER')) : tx('FACTOR DE RIESGO', 'BEAR RISK')} ({item.impactTag})
                      </span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-body, #cbd5e1)', lineHeight: 1.46, margin: 0 }}>{detailText}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const qText = txTpl("Explicá en detalle el impacto de \"{0}\" ({1}) en {2}", [titleText, item.impactTag, currentAsset.sym], "Explain in detail the impact of \"{0}\" ({1}) on {2}", [titleText, item.impactTag, currentAsset.sym]);
                          setRagQuery(qText);
                          runAssetRagQuery(qText, 'asset', selectedAsset);
                        }}
                        style={{
                          padding: '2px 6px',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--ui-accent, #10b981)',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {tx('Analizar en Chat ↗', 'Analyze in Chat ↗')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          };

          return (
            <div
              className="resp-l2-research-grid"
              style={{
                flex: 1,
                minHeight: 0,
                display: 'grid',
                gridTemplateColumns: '340px minmax(0, 1.25fr) minmax(0, 0.98fr)',
                gap: '0.95rem',
                alignItems: 'stretch',
              }}
            >
              {/* ================================================================
                  COLUMN 1 (LEFT RAIL 340px): VERTICAL RAG CHAT + PORTFOLIO BRIDGE
                 ================================================================ */}
              <div
                style={{
                  borderRadius: '10px',
                  border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                  background: 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Top Chat Header */}
                <div
                  style={{
                    padding: '12px 14px 8px',
                    borderBottom: '1px solid var(--border-slate, rgba(148, 163, 184, 0.14))',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: 'var(--text-main, #ffffff)', fontSize: '15.5px', fontWeight: 700 }}>
                    {tx('Chat Documental', 'Document Chat')}
                  </span>
                  <span className="mono-metric" style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '12px' }}>
                    {currentAsset.sym}
                  </span>

                  {researchChatHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setResearchChatHistory([]);
                        setRagQuery('');
                        setRagResult(null);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                        padding: '2px 4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Scrollable Conversation Thread */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0.72rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  {/* Pinned Initial Executive Thesis Bubble */}
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      maxWidth: '96%',
                      padding: '0.65rem 0.76rem',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                      borderLeft: '3px solid var(--ui-accent, #10b981)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.38rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                      <span className="mono-metric" style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--ui-accent, #10b981)' }}>
                        {tx('TESIS EJECUTIVA', 'EXECUTIVE THESIS')} • {currentAsset.sym}
                      </span>
                      <span className="mono-metric" style={{ fontSize: '0.56rem', color: 'var(--pos-text, #34d399)', fontWeight: 700 }}>
                        GUARDRAIL OK
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary, #e2e8f0)', fontSize: '0.73rem', lineHeight: 1.46 }}>
                      {researchBrief.executiveSummary[langCode] || researchBrief.executiveSummary.EN}
                    </div>
                    <div
                      className="mono-metric"
                      style={{
                        fontSize: '0.57rem',
                        color: 'var(--text-muted, #94a3b8)',
                        paddingTop: '0.22rem',
                        borderTop: '1px solid var(--border-slate, rgba(148, 163, 184, 0.14))',
                      }}
                    >
                      {assetSensitivity.shortLabel[langCode] || assetSensitivity.shortLabel.EN}
                    </div>
                  </div>

                  {/* Dynamic User & Assistant Message Thread */}
                  {researchChatHistory.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '94%',
                        padding: '0.55rem 0.7rem',
                        borderRadius: '8px',
                        background:
                          msg.role === 'user'
                            ? 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.12)'
                            : msg.blocked
                            ? 'rgba(244, 63, 94, 0.12)'
                            : 'transparent',
                        border:
                          msg.role === 'user'
                            ? '1px solid var(--ui-accent, #10b981)'
                            : msg.blocked
                            ? '1px solid rgba(244, 63, 94, 0.45)'
                            : '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                      }}
                    >
                      {msg.role === 'assistant' && (
                        <div
                          className="mono-metric"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.24rem',
                            fontSize: '0.58rem',
                            color: msg.blocked ? 'var(--neg-text, #fb7185)' : 'var(--ui-accent, #10b981)',
                            fontWeight: 700,
                          }}
                        >
                          <span>{msg.blocked ? 'GUARDRAIL L1 BLOCK' : msg.topicLabel}</span>
                          <span>{msg.latency}</span>
                        </div>
                      )}
                      <div style={{ color: msg.role === 'user' ? 'var(--text-main, #f8fafc)' : 'var(--text-secondary, #e2e8f0)', fontSize: '0.72rem', lineHeight: 1.44 }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Input Dock: 4 Quick Chips + Input Form + Portfolio Bridge Button */}
                <div
                  style={{
                    padding: '0.52rem 0.65rem 0.62rem',
                    borderTop: '1px solid var(--border-slate, rgba(148, 163, 184, 0.14))',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.42rem',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {getRagQuickTopicsForCategory(currentAsset.cat).map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => {
                          setRagQuery(topic.query);
                          runAssetRagQuery(topic.query, 'asset', selectedAsset);
                        }}
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          padding: '2px 4px',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                          cursor: 'pointer',
                        }}
                      >
                        {topic.label[langCode] || topic.label.EN}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (ragQuery.trim()) {
                        const q = ragQuery.trim();
                        setRagQuery('');
                        runAssetRagQuery(q, 'asset', selectedAsset);
                      }
                    }}
                    style={{ display: 'flex', gap: '0.38rem' }}
                  >
                    <input
                      type="text"
                      value={ragQuery}
                      onChange={(e) => setRagQuery(e.target.value)}
                      placeholder={
                        txTpl("Preguntar al chat sobre {0}...", [currentAsset.sym], "Ask chat about {0}...", [currentAsset.sym])
                      }
                      style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.24))',
                        borderRadius: '8px',
                        padding: '0.42rem 0.6rem',
                        color: 'var(--text-main, #f8fafc)',
                        fontSize: '0.72rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isRagLoading}
                      className="mono-metric"
                      style={{
                        padding: '0.42rem 0.68rem',
                        borderRadius: '8px',
                        border: '1px solid var(--ui-accent, #10b981)',
                        background: 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.14)',
                        color: 'var(--ui-accent, #10b981)',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isRagLoading ? '…' : '↵'}
                    </button>
                  </form>

                  {/* Direct Bridge to Portfolio & Risk/Backtest Workbench */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onLaunchTarget) {
                        onLaunchTarget({ view: 'portfolio', asset: currentAsset.sym });
                      } else {
                        window.location.search = `?view=portfolio&asset=${currentAsset.sym}`;
                      }
                    }}
                    className="mono-metric"
                    style={{
                      width: '100%',
                      padding: '0.36rem 0.6rem',
                      borderRadius: '8px',
                      background: 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.12)',
                      border: '1px solid var(--ui-accent, #10b981)',
                      color: 'var(--ui-accent, #10b981)',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>
                      {txTpl("Simular {0} en Portfolio & Riesgo", [currentAsset.sym], "Simulate {0} in Portfolio & Risk", [currentAsset.sym])}
                    </span>
                    <span>{tx('Abrir ↗', 'Open ↗')}</span>
                  </button>
                </div>
              </div>

              {/* ================================================================
                  COLUMN 2 (CENTER PROTAGONIST): VERDICT & WEIGHTED FACTOR ACCORDION
                 ================================================================ */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                  background: 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  minHeight: 0,
                  minWidth: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Top Protagonist Header */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid var(--border-slate, rgba(148, 163, 184, 0.14))',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-main, #ffffff)', fontSize: '15.5px', fontWeight: 700 }}>
                      {tx('Factores Ponderados', 'Weighted Factors')}
                    </span>

                    <span
                      className="mono-metric"
                      style={{
                        color: researchBrief.compositeScore >= 0 ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      {researchBrief.compositeFormatted} • {researchBrief.stanceLabel[langCode] || researchBrief.stanceLabel.EN}
                    </span>
                  </div>

                  {/* Tug-of-War Proportional Bar + View Filter Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flex: 1, minWidth: '175px' }}>
                      <span className="mono-metric" style={{ color: 'var(--pos-text, #34d399)', fontSize: '11.5px', fontWeight: 800 }}>
                        BULL {bullPct}% (+{researchBrief.avgBull})
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: '7px',
                          borderRadius: '999px',
                          overflow: 'hidden',
                          display: 'flex',
                          backgroundColor: 'var(--bg-elevated-soft, rgba(15, 23, 42, 0.9))',
                          border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.2))',
                        }}
                      >
                        <div style={{ width: `${bullPct}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                        <div style={{ width: `${bearPct}%`, background: 'linear-gradient(90deg, #fb7185, #e11d48)' }} />
                      </div>
                      <span className="mono-metric" style={{ color: 'var(--neg-text, #fb7185)', fontSize: '11.5px', fontWeight: 800 }}>
                        (-{researchBrief.avgBear}) {bearPct}% BEAR
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {[
                        { id: 'all', label: tx('Todos', 'All') },
                        { id: 'bull', label: 'Bull' },
                        { id: 'bear', label: 'Bear' },
                        { id: 'twin', label: tx('Comparar', 'Compare') },
                      ].map((tab) => {
                        const active = researchFactorFilter === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setResearchFactorFilter(tab.id)}
                            style={{
                              padding: '2px 4px',
                              border: 'none',
                              background: 'transparent',
                              fontSize: '12px',
                              fontWeight: active ? 800 : 600,
                              cursor: 'pointer',
                              color: active ? 'var(--ui-accent, #10b981)' : 'var(--text-muted, rgba(148, 163, 184, 0.68))',
                              textShadow: active ? '0 0 12px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.85)' : 'none',
                            }}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Accordion List Body */}
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0, paddingRight: '0.15rem' }}>
                  {researchFactorFilter === 'twin' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '0.5rem', minWidth: 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0 }}>
                        <div className="mono-metric" style={{ color: 'var(--pos-text, #34d399)', fontSize: '0.64rem', fontWeight: 800, marginBottom: '2px' }}>
                          {tx('CATALIZADORES', 'BULL DRIVERS')}
                        </div>
                        {allFactors
                          .filter((f) => f.side === 'BULL')
                          .map((item) => renderAccordionRow(item, true))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0 }}>
                        <div className="mono-metric" style={{ color: 'var(--neg-text, #fb7185)', fontSize: '0.64rem', fontWeight: 800, marginBottom: '2px' }}>
                          {tx('RIESGOS', 'BEAR RISKS')}
                        </div>
                        {allFactors
                          .filter((f) => f.side === 'BEAR')
                          .map((item) => renderAccordionRow(item, true))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18rem', minWidth: 0 }}>
                      {filteredFactors.map((item) => renderAccordionRow(item, false))}
                    </div>
                  )}
                </div>
              </div>

              {/* ================================================================
                  COLUMN 3 (RIGHT): VERTICAL TIMELINE WITH NODES + 24H AREACHART BELOW
                 ================================================================ */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                  background: 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px',
                  minHeight: 0,
                  minWidth: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.4rem',
                    flexShrink: 0,
                    paddingBottom: '8px',
                    borderBottom: '1px solid var(--border-slate, rgba(148, 163, 184, 0.14))',
                  }}
                >
                  <span style={{ color: 'var(--text-main, #ffffff)', fontSize: '15.5px', fontWeight: 700 }}>
                    {tx('Noticias y Sentimiento', 'News & Sentiment')}
                  </span>

                  <button
                    type="button"
                    onClick={() => refreshLiveAssetNews(true)}
                    disabled={isRefreshingNews}
                    title={tx('Actualizar Noticias en Vivo', 'Refresh Live News')}
                    aria-label={tx('Actualizar Noticias en Vivo', 'Refresh Live News')}
                    style={{
                      width: '26px',
                      height: '26px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--ui-accent, #10b981)',
                      filter: 'drop-shadow(0 0 6px rgba(var(--ui-accent-rgb, 16, 185, 129), 0.7))',
                      cursor: 'pointer',
                    }}
                  >
                    <RefreshCw
                      size={13}
                      style={{
                        transform: isRefreshingNews ? 'rotate(360deg)' : 'rotate(0deg)',
                        transition: isRefreshingNews ? 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                      }}
                    />
                  </button>
                </div>

                {/* Top Box: Chronological Vertical Timeline with Glowing Nodes */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingRight: '0.18rem',
                    minHeight: 0,
                    opacity: isRefreshingNews ? 0.32 : 1,
                    filter: isRefreshingNews ? 'blur(1.5px)' : 'none',
                    transform: isRefreshingNews ? 'scale(0.996)' : 'scale(1)',
                    transition: 'opacity 0.2s ease, filter 0.2s ease, transform 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      paddingLeft: '1.1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.24rem',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: '4px',
                        top: '6px',
                        bottom: '6px',
                        width: '2px',
                        background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.72), rgba(129, 140, 248, 0.15))',
                      }}
                    />

                    {assetFinbertNews.map((news) => {
                      const isPos = news.scoreNum >= 0;
                      const dotColor = isPos ? 'var(--accent, #10b981)' : 'var(--danger, #f43f5e)';
                      const headlineText = news.title[langCode] || news.title.EN;

                      return (
                        <div key={news.id} style={{ position: 'relative' }}>
                          <span
                            style={{
                              position: 'absolute',
                              left: '-1.1rem',
                              top: '0.35rem',
                              width: '10px',
                              height: '10px',
                              borderRadius: '999px',
                              backgroundColor: dotColor,
                              boxShadow: `0 0 8px ${dotColor}`,
                              border: '2px solid #070b16',
                            }}
                          />
                          <div
                            style={{
                              padding: '0.42rem 0.58rem',
                              borderRadius: news.isNew ? '7px' : '0px',
                              backgroundColor: news.isNew ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                              border: news.isNew
                                ? `1px solid ${dotColor}`
                                : '1px solid transparent',
                              borderBottom: news.isNew
                                ? `1px solid ${dotColor}`
                                : '1px solid var(--border-slate, rgba(148, 163, 184, 0.12))',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.22rem',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
                              <div className="mono-metric" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                {news.isNew && (
                                  <span
                                    style={{
                                      fontSize: '0.5rem',
                                      fontWeight: 800,
                                      padding: '0.04rem 0.32rem',
                                      borderRadius: '999px',
                                      backgroundColor: dotColor,
                                      color: '#000',
                                    }}
                                  >
                                    {tx('NUEVO', 'LIVE')}
                                  </span>
                                )}
                                <span style={{ color: 'var(--info-text, #38bdf8)', fontSize: '0.58rem', fontWeight: 700 }}>{news.time}</span>
                                <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.57rem' }}>• {news.source}</span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.32rem' }}>
                                <span
                                  className="mono-metric"
                                  style={{
                                    fontSize: '0.6rem',
                                    fontWeight: 800,
                                    color: isPos ? 'var(--pos-text, #34d399)' : 'var(--neg-text, #fb7185)',
                                  }}
                                >
                                  {news.score}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const qText = txTpl("Analizá el impacto de este titular ({0}): \"{1}\"", [news.source, headlineText], "Analyze the impact of this headline ({0}): \"{1}\"", [news.source, headlineText]);
                                    setRagQuery(qText);
                                    runAssetRagQuery(qText, 'asset', selectedAsset);
                                  }}
                                  className="mono-metric"
                                  style={{
                                    padding: '2px 4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--ui-accent, #10b981)',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  {tx('Chat ↗', 'Chat ↗')}
                                </button>
                              </div>
                            </div>

                            <div style={{ color: 'var(--text-secondary, #e2e8f0)', fontSize: '0.7rem', lineHeight: 1.36 }}>{headlineText}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Box: Standardized 24h Sentiment Trajectory AreaChart right below the news */}
                <div
                  style={{
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-slate, rgba(148, 163, 184, 0.22))',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.22rem',
                    flexShrink: 0,
                    opacity: isRefreshingNews ? 0.32 : 1,
                    filter: isRefreshingNews ? 'blur(1.5px)' : 'none',
                    transition: 'opacity 0.2s ease, filter 0.2s ease',
                  }}
                >
                  <div className="mono-metric" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.58rem', color: 'var(--text-muted, #94a3b8)', fontWeight: 700 }}>
                      {tx('RECORRIDO SENTIMIENTO FINBERT (24H)', 'FINBERT SENTIMENT TRAJECTORY (24H)')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        color: researchBrief.compositeScore >= 0 ? 'var(--pos-text, #34d399)' : 'var(--neg-text, #fb7185)',
                      }}
                    >
                      {researchBrief.compositeFormatted} pts
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '88px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sentimentSeries24h} margin={{ top: 6, right: 6, left: -26, bottom: 0 }}>
                        <defs>
                          <linearGradient id={gradId24h} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={strokeHex24h} stopOpacity={0.45} />
                            <stop offset="95%" stopColor={strokeHex24h} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" tick={{ fill: 'var(--text-dim, #64748b)', fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'var(--text-dim, #64748b)', fontSize: 9 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-elevated, rgba(7, 11, 22, 0.95))',
                            border: '1px solid rgba(129, 140, 248, 0.35)',
                            borderRadius: '8px',
                            fontSize: '0.68rem',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke={strokeHex24h}
                          strokeWidth={2}
                          fill={`url(#${gradId24h})`}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
