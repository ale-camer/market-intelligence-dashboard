import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, AlertTriangle, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { ASSET_CATALOG, TICKER_ITEMS, getAssetBySymbol, getAssetSeries } from '../services/marketService';
import { getAnomalyProfile, runLiveAnomalyInference } from '../services/anomalyService';

export default function MarketAnomaliesView({ selectedAsset, onSelectAsset, langCode = 'EN', t }) {
  const [assetSearch, setAssetSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'CRYPTO' | 'EQUITY' | 'INDEX'
  const [timeframe, setTimeframe] = useState('5M'); // '1M' | '5M' | '1H' | '1D'
  const [liveInference, setLiveInference] = useState(null);
  const [isScoring, setIsScoring] = useState(false);

  const currentAsset = useMemo(() => getAssetBySymbol(selectedAsset), [selectedAsset]);
  const anomalyProfile = useMemo(() => getAnomalyProfile(selectedAsset), [selectedAsset]);
  const series = useMemo(() => getAssetSeries(selectedAsset, timeframe), [selectedAsset, timeframe]);

  const filteredAssets = useMemo(() => {
    return ASSET_CATALOG.filter((a) => {
      const matchesCat = categoryFilter === 'ALL' || a.cat === categoryFilter;
      if (!matchesCat) return false;
      if (!assetSearch.trim()) return true;
      const q = assetSearch.toLowerCase();
      return (
        a.sym.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.cat.toLowerCase().includes(q)
      );
    });
  }, [assetSearch, categoryFilter]);

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

  useEffect(() => {
    setLiveInference(null);
    triggerLiveP06Scoring(selectedAsset);
  }, [selectedAsset]);

  const displayedScore = liveInference ? liveInference.liveScore : anomalyProfile.score;
  const isDislocated = displayedScore >= 0.65 || anomalyProfile.regime === 'DISLOCATION';
  const isElevated = !isDislocated && (displayedScore >= 0.35 || anomalyProfile.regime === 'ELEVATED');
  const scoreColor = isDislocated ? '#ef4444' : isElevated ? '#f59e0b' : 'var(--accent)';
  const scorePct = Math.min(100, Math.max(5, Math.round(displayedScore * 100)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: 'calc(100vh - 115px)' }}>
      {/* P-03 RUNNING TICKER TAPE INSIDE MARKET & ANOMALIES */}
      <div
        style={{
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-light)',
          borderRadius: '6px',
          padding: '0.35rem 0',
          fontSize: '0.73rem',
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <div className="ticker-marquee-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((tItem, i) => (
            <div
              key={i}
              onClick={() => {
                const cleanSym = tItem.sym.split('/')[0];
                onSelectAsset(cleanSym);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0 1.5rem',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{tItem.sym}</span>
              <span className="mono-metric" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                {tItem.price}
              </span>
              <span
                style={{
                  color: tItem.chg.startsWith('+') ? 'var(--accent)' : 'var(--danger)',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                }}
              >
                {tItem.chg}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '295px 1fr 350px', gap: '0.75rem' }}>
        {/* LEFT: P-01 / P-02 / P-05 UNIFIED ASSET WATCHLIST */}
        <div className="terminal-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: '0.6rem 0.85rem',
              borderBottom: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="mono-metric" style={{ fontSize: '0.71rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t.secSelector}
            </span>
            <span className="mono-metric" style={{ fontSize: '0.66rem', color: 'var(--accent)', fontWeight: 600 }}>
              {filteredAssets.length} {t.assetsCount}
            </span>
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.25rem',
              padding: '0.4rem 0.65rem',
              borderBottom: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-panel)',
            }}
          >
            {['ALL', 'CRYPTO', 'EQUITY', 'INDEX'].map((cat) => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className="mono-metric"
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '0.22rem 0.2rem',
                    borderRadius: '4px',
                    border: active ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                    backgroundColor: active ? 'var(--accent-light)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-dim)',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* SEARCH INPUT BAR */}
          <div style={{ padding: '0.45rem 0.65rem', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-panel)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.32rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid var(--border-light)',
              }}
            >
              <Search size={13} strokeWidth={2.2} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder={t.searchSecurities}
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.73rem',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'var(--font-sans)',
                }}
              />
              {assetSearch && (
                <button
                  onClick={() => setAssetSearch('')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredAssets.map((item) => {
              const isSelected = selectedAsset === item.sym;
              return (
                <div
                  key={item.sym}
                  onClick={() => onSelectAsset(item.sym)}
                  style={{
                    padding: '0.6rem 0.85rem',
                    borderBottom: '1px solid var(--border-light)',
                    backgroundColor: isSelected ? 'var(--bg-subtle)' : 'transparent',
                    cursor: 'pointer',
                    borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="mono-metric" style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-main)' }}>
                        {item.sym}
                      </span>
                      <span
                        className="mono-metric"
                        style={{
                          fontSize: '0.58rem',
                          padding: '0.05rem 0.3rem',
                          borderRadius: '3px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          color: 'var(--text-dim)',
                        }}
                      >
                        {item.cat}
                      </span>
                    </div>
                    <span className="mono-metric" style={{ fontWeight: 700, fontSize: '0.79rem', color: 'var(--text-main)' }}>
                      {item.priceFormatted}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.18rem', fontSize: '0.67rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{item.name}</span>
                    <span style={{ color: item.chg.startsWith('+') ? 'var(--accent)' : 'var(--danger)', fontWeight: 600 }}>
                      {item.chg}
                    </span>
                  </div>
                </div>
              );
            })}
            {filteredAssets.length === 0 && (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                No assets matching "{assetSearch}"
              </div>
            )}
          </div>
        </div>

        {/* CENTER: P-02 / P-03 / P-05 CHARTING & POLARS TECHNICAL INDICATORS */}
        <div className="terminal-card" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* CHART HEADER + TIMEFRAME SELECTOR */}
          <div
            style={{
              padding: '0.6rem 1rem',
              borderBottom: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="mono-metric" style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)' }}>
                {currentAsset.pair}
              </span>
              <span className="mono-metric" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent)' }}>
                {currentAsset.priceFormatted}
              </span>
              <span
                className="mono-metric"
                style={{
                  fontSize: '0.65rem',
                  padding: '0.12rem 0.45rem',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-dim)',
                }}
              >
                {currentAsset.source}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {['1M', '5M', '1H', '1D'].map((tf) => {
                const isActive = timeframe === tf;
                return (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className="mono-metric"
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      border: isActive ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                      backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                      color: isActive ? '#000' : 'var(--text-dim)',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {tf}
                  </button>
                );
              })}
            </div>
          </div>

          {/* P-02 POLARS TECHNICAL INDICATORS RIBBON */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              padding: '0.45rem 1rem',
              borderBottom: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-panel)',
              fontSize: '0.68rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>RSI (14):</span>
              <span
                className="mono-metric"
                style={{
                  fontWeight: 700,
                  color: currentAsset.indicators.rsi14 > 70 ? '#f59e0b' : 'var(--text-main)',
                }}
              >
                {currentAsset.indicators.rsi14}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>MACD (12,26):</span>
              <span
                className="mono-metric"
                style={{
                  fontWeight: 700,
                  color: currentAsset.indicators.macd.startsWith('+') ? 'var(--accent)' : 'var(--danger)',
                }}
              >
                {currentAsset.indicators.macd}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>BB Width:</span>
              <span className="mono-metric" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                {currentAsset.indicators.bbWidth}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Signal:</span>
              <span className="mono-metric" style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.63rem' }}>
                {currentAsset.indicators.macdSignal}
              </span>
            </div>
          </div>

          {/* PRICE AREA CHART & VOLUME HISTOGRAM */}
          <div style={{ flex: 1, padding: '0.85rem 0.5rem 0 0', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="72%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={11} tickLine={false} />
                <YAxis domain={['auto', 'auto']} stroke="var(--text-dim)" fontSize={11} orientation="right" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-light)',
                    fontSize: '0.74rem',
                  }}
                />
                <Area type="monotone" dataKey="price" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#chartGrad)" />
              </AreaChart>
            </ResponsiveContainer>

            <div style={{ height: '26%', borderTop: '1px solid var(--border-light)', padding: '0.45rem 0 0 0' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series}>
                  <XAxis dataKey="time" hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-light)',
                      fontSize: '0.7rem',
                    }}
                  />
                  <Bar dataKey="vol" fill="var(--text-dim)" opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT: P-06 ISOLATION FOREST ANOMALY MONITOR (LIVE CLOUD RUN + SNAPSHOT) */}
        <div className="terminal-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: '0.6rem 0.85rem',
              borderBottom: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              className="mono-metric"
              style={{
                fontSize: '0.71rem',
                fontWeight: 700,
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <AlertTriangle size={13} strokeWidth={2.2} /> P-06 ISOLATION FOREST
            </span>
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
                padding: '0.18rem 0.45rem',
                borderRadius: '4px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-panel)',
                color: liveInference ? 'var(--accent)' : 'var(--text-dim)',
                cursor: 'pointer',
              }}
              title="Run live POST /predict on P-06 Cloud Run service"
            >
              <RefreshCw size={11} className={isScoring ? 'spin' : ''} />
              <span>{isScoring ? 'SCORING...' : liveInference ? `LIVE (${liveInference.latencyMs}ms)` : 'RE-SCORE'}</span>
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* ANOMALY SCORE GAUGE */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600 }}>ANOMALY SCORE</span>
                  <span className="mono-metric" style={{ fontSize: '0.62rem', color: scoreColor, fontWeight: 700 }}>
                    REGIME: {isDislocated ? 'DISLOCATION' : isElevated ? 'ELEVATED' : 'NORMAL'}
                  </span>
                </div>
                <span className="mono-metric" style={{ fontSize: '1.3rem', fontWeight: 800, color: scoreColor }}>
                  {displayedScore}
                </span>
              </div>

              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  marginTop: '0.55rem',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${scorePct}%`,
                    height: '100%',
                    backgroundColor: scoreColor,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.63rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                <span>Normal (&lt; 0.50)</span>
                <span>Circuit Breaker (&gt; 0.65)</span>
              </div>
            </div>

            {/* FEATURE VECTOR TELEMETRY */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.42rem',
                fontSize: '0.71rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' }}>
                <span className="mono-metric" style={{ fontSize: '0.66rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  FEATURE VECTOR INPUTS
                </span>
                <span className="mono-metric" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                  contamination={anomalyProfile.contaminationParam}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Volume Z-Score (20d):</span>
                <span className="mono-metric" style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                  {anomalyProfile.volumeZScore}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Realized Volatility:</span>
                <span className="mono-metric" style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                  {anomalyProfile.realizedVol}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Spread Dislocation:</span>
                <span
                  className="mono-metric"
                  style={{ color: isDislocated ? '#f59e0b' : 'var(--accent)', fontWeight: 600 }}
                >
                  {anomalyProfile.spreadDislocation}
                </span>
              </div>
              {liveInference && (
                <div
                  style={{
                    marginTop: '0.25rem',
                    paddingTop: '0.35rem',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.63rem',
                  }}
                >
                  <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Cpu size={11} style={{ color: 'var(--accent)' }} /> MLflow Artifact:
                  </span>
                  <span className="mono-metric" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    {liveInference.modelVersion}
                  </span>
                </div>
              )}
            </div>

            {/* DYNAMIC ASSET ANOMALY EVENT LOG */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.75rem',
                borderRadius: '4px',
                borderLeft: `3px solid ${scoreColor}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                  {anomalyProfile.alertTitle[langCode] || anomalyProfile.alertTitle.EN}
                </span>
                <span className="mono-metric" style={{ color: 'var(--text-dim)' }}>
                  {anomalyProfile.alertTime}
                </span>
              </div>
              <p style={{ fontSize: '0.71rem', color: 'var(--text-muted)', marginTop: '0.3rem', lineHeight: 1.45 }}>
                {anomalyProfile.alertDesc[langCode] || anomalyProfile.alertDesc.EN}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
