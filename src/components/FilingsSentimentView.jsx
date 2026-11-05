import { tx, useViewLocale } from '../data/i18n/viewLocaleService';
import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Search,
  Sparkles,
  X,
  Palette,
  Compass,
  Network,
  Newspaper,
  BookOpen,
  Radio,
} from 'lucide-react';
import {
  SEC_10K_CHUNKS,
  FINBERT_HEADLINES,
  RAG_QUICK_TOPICS,
  executeSec10kRagQuery,
} from '../services/filingsAndNewsService';
import { ASSET_CATALOG } from '../services/marketService';

const SEC_FILING_TICKERS = ['ALL', 'NVDA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'BTC', 'SOL'];

export default function FilingsSentimentView({
  selectedAsset,
  onSelectAsset,
  langCode = 'EN',
  t,
}) {
  // Design Switcher ('horizon' | 'spotlight' | 'constellation' | 'bento' | 'chronicle')
  const [designVariant, setDesignVariant] = useState('horizon');
  const [filingsQuery, setFilingsQuery] = useState('');
  const [tickerFilter, setTickerFilter] = useState(() =>
    SEC_FILING_TICKERS.includes(selectedAsset) ? selectedAsset : 'ALL'
  );
  const [sentimentFilter, setSentimentFilter] = useState('ALL'); // 'ALL' | 'BULLISH' | 'CAUTION'
  const [ragResult, setRagResult] = useState(null);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [focusedChunkId, setFocusedChunkId] = useState(SEC_10K_CHUNKS[0].id);

  const { isES } = useViewLocale(langCode);

  useEffect(() => {
    if (SEC_FILING_TICKERS.includes(selectedAsset)) {
      setTickerFilter(selectedAsset);
    }
  }, [selectedAsset]);

  const runRagSearch = async (customQuery = filingsQuery, customTicker = tickerFilter) => {
    setIsRetrieving(true);
    try {
      const res = await executeSec10kRagQuery({
        query: customQuery,
        ticker: customTicker,
        langCode,
      });
      setRagResult(res);
      if (res?.chunks?.length > 0) {
        setFocusedChunkId(res.chunks[0].id);
      }
    } finally {
      setIsRetrieving(false);
    }
  };

  useEffect(() => {
    runRagSearch(filingsQuery, tickerFilter);
  }, [tickerFilter, langCode]);

  const displayedChunks = ragResult?.chunks || SEC_10K_CHUNKS;

  // Filtered FinBERT Headlines (Strict Green = Positive >= 0, Red = Negative < 0)
  const filteredHeadlines = useMemo(() => {
    return FINBERT_HEADLINES.filter((h) => {
      const matchesTicker = tickerFilter === 'ALL' || h.sym === tickerFilter;
      if (!matchesTicker) return false;
      if (sentimentFilter === 'BULLISH') return h.scoreNum >= 0;
      if (sentimentFilter === 'CAUTION') return h.scoreNum < 0;
      return true;
    });
  }, [tickerFilter, sentimentFilter]);

  // Dynamic Aggregate Polarity Score (Strict Green >= 0, Red < 0)
  const aggregatePolarity = useMemo(() => {
    const list = filteredHeadlines.length > 0 ? filteredHeadlines : FINBERT_HEADLINES;
    const avg = list.reduce((acc, item) => acc + item.scoreNum, 0) / list.length;
    const isPos = avg >= 0;
    const sign = isPos ? '+' : '';
    const label = isPos ? 'POSITIVE (BULLISH)' : 'NEGATIVE (BEARISH)';
    const color = isPos ? '#10b981' : '#f43f5e';
    return {
      avgNum: avg,
      formatted: `${sign}${avg.toFixed(2)}`,
      label,
      color,
      posCount: list.filter((x) => x.scoreNum >= 0).length,
      negCount: list.filter((x) => x.scoreNum < 0).length,
    };
  }, [filteredHeadlines]);

  // Combined Chronological Intelligence Stream (P-04 + P-07 + P-08)
  const unifiedFeed = useMemo(() => {
    const items = [
      ...displayedChunks.map((c) => ({
        uid: `rag-${c.id}`,
        kind: 'SEC_10K',
        pipe: 'P-07 • PGVECTOR',
        sym: c.sym,
        title: `${c.filing} • ${c.section}`,
        body: c.text[langCode] || c.text.EN,
        metricLabel: `cosine_sim: ${c.cosineSim}`,
        isPositive: c.section.includes('ITEM 7'), // Item 7 MD&A = growth/margins (Green), Item 1A = Risk Factors (Red)
        rawScore: c.cosineSim,
        time: '10-K INDEXED',
        chunkRef: c,
      })),
      ...filteredHeadlines.map((n) => ({
        uid: `news-${n.id}`,
        kind: 'FINBERT',
        pipe: 'P-04 & P-08 • NLP',
        sym: n.sym,
        title: n.title[langCode] || n.title.EN,
        body: `${n.source} • Softmax POS ${Math.round(n.probs.pos * 100)}% | NEU ${Math.round(n.probs.neu * 100)}% | NEG ${Math.round(n.probs.neg * 100)}%`,
        metricLabel: `FinBERT: ${n.score}`,
        isPositive: n.scoreNum >= 0,
        rawScore: n.scoreNum,
        time: n.time,
        newsRef: n,
      })),
    ];
    return items;
  }, [displayedChunks, filteredHeadlines, langCode]);

  const handleSelectTicker = (sym) => {
    setTickerFilter(sym);
    if (sym !== 'ALL' && onSelectAsset) {
      onSelectAsset(sym);
    }
  };

  const DESIGN_OPTIONS = [
    { id: 'horizon', label: '1. Editorial Horizon (Fey)' },
    { id: 'spotlight', label: '2. Perplexity AI Spotlight' },
    { id: 'constellation', label: '3. Vector & Sentiment Constellation' },
    { id: 'bento', label: '4. Asymmetric Glass Bento' },
    { id: 'chronicle', label: '5. Split Dossier & Live Wire' },
  ];

  // Shared Top Design Selector + Ticker & Search Bar
  const renderSharedTopControls = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flexShrink: 0 }}>
      {/* DESIGN EXPLORER BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.6rem',
          padding: '0.35rem 0.65rem',
          borderRadius: '999px',
          backgroundColor: 'rgba(13, 19, 33, 0.68)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          className="mono-metric"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#10b981',
            paddingLeft: '0.35rem',
          }}
        >
          <Palette size={13} />
          <span>{tx('EXPLORADOR DE DISEÑO (RESEARCH):', 'RESEARCH DESIGN EXPLORER:')}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {DESIGN_OPTIONS.map((opt) => {
            const active = designVariant === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setDesignVariant(opt.id)}
                style={{
                  fontSize: '0.69rem',
                  fontWeight: active ? 700 : 500,
                  padding: '0.26rem 0.78rem',
                  borderRadius: '999px',
                  border: active ? '1px solid #10b981' : '1px solid transparent',
                  backgroundColor: active ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                  color: active ? '#ffffff' : 'var(--text-dim)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* UNIFIED RESEARCH COMMAND BAR: TICKER PILLS + SEMANTIC RAG SEARCH + QUICK TOPICS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.7rem',
        }}
      >
        {/* Left: Semantic RAG Query Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runRagSearch(filingsQuery, tickerFilter);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(13, 19, 33, 0.65)',
            backdropFilter: 'blur(12px)',
            padding: '0.32rem 0.45rem 0.32rem 0.85rem',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            flex: '1 1 340px',
            maxWidth: '520px',
          }}
        >
          <Search size={14} style={{ color: '#10b981', flexShrink: 0 }} />
          <input
            type="text"
            placeholder={
              tx('Consultar SEC 10-K (pgvector) o noticias FinBERT (ej. margins, CoWoS, AI capex)...', 'Query SEC 10-K (pgvector) or FinBERT news (e.g. margins, CoWoS, AI capex)...')
            }
            value={filingsQuery}
            onChange={(e) => setFilingsQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.74rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
          {filingsQuery && (
            <button
              type="button"
              onClick={() => {
                setFilingsQuery('');
                runRagSearch('', tickerFilter);
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={13} />
            </button>
          )}
          <button
            type="submit"
            disabled={isRetrieving}
            className="mono-metric"
            style={{
              backgroundColor: '#10b981',
              color: '#000',
              border: 'none',
              padding: '0.26rem 0.8rem',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.67rem',
              cursor: 'pointer',
            }}
          >
            {isRetrieving ? '...' : 'RAG QUERY'}
          </button>
        </form>

        {/* Center: Ticker Filter Pills */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(13, 19, 33, 0.58)',
            padding: '0.2rem',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            gap: '0.2rem',
            flexWrap: 'wrap',
          }}
        >
          {SEC_FILING_TICKERS.map((sym) => {
            const active = tickerFilter === sym;
            return (
              <button
                key={sym}
                onClick={() => handleSelectTicker(sym)}
                className="mono-metric"
                style={{
                  fontSize: '0.66rem',
                  fontWeight: active ? 800 : 600,
                  padding: '0.22rem 0.62rem',
                  borderRadius: '999px',
                  border: active ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                  backgroundColor: active ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                  color: active ? '#ffffff' : 'var(--text-dim)',
                  cursor: 'pointer',
                }}
              >
                {sym}
              </button>
            );
          })}
        </div>

        {/* Right: Quick Topic Chips */}
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {RAG_QUICK_TOPICS.map((topic) => {
            const active = filingsQuery.toLowerCase() === topic.query.toLowerCase();
            return (
              <button
                key={topic.id}
                onClick={() => {
                  setFilingsQuery(topic.query);
                  runRagSearch(topic.query, tickerFilter);
                }}
                style={{
                  fontSize: '0.65rem',
                  padding: '0.22rem 0.65rem',
                  borderRadius: '999px',
                  border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.09)',
                  backgroundColor: active ? 'rgba(16, 185, 129, 0.14)' : 'rgba(13, 19, 33, 0.45)',
                  color: active ? '#10b981' : 'var(--text-muted)',
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
  );

  // ============================================================================
  // DESIGN 1: EDITORIAL HORIZON (FEY STYLE — MATCHES LEVEL 2 MARKETS)
  // ============================================================================
  if (designVariant === 'horizon') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          height: 'calc(100vh - 115px)',
          overflowY: 'auto',
          padding: '0.1rem 0.4rem',
        }}
      >
        {renderSharedTopControls()}

        {/* EDITORIAL HERO STRIP: AGGREGATE POLARITY + LIVE RAG SYNTHESIS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '1.8rem',
            alignItems: 'center',
            padding: '0.75rem 0.2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            flexShrink: 0,
          }}
        >
          <div>
            <div className="mono-metric" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.06em' }}>
              P-04 FINBERT POLARITY ({tickerFilter})
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginTop: '0.1rem' }}>
              <span className="mono-metric" style={{ fontSize: '2.1rem', fontWeight: 800, color: aggregatePolarity.color }}>
                {aggregatePolarity.formatted}
              </span>
              <span className="mono-metric" style={{ fontSize: '0.72rem', fontWeight: 700, color: aggregatePolarity.color }}>
                {aggregatePolarity.label}
              </span>
            </div>
            <div className="mono-metric" style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
              <span style={{ color: '#10b981' }}>{aggregatePolarity.posCount} POSITIVE</span> •{' '}
              <span style={{ color: '#f43f5e' }}>{aggregatePolarity.negCount} NEGATIVE</span> • {displayedChunks.length} SEC 10-K CHUNKS
            </div>
          </div>

          {/* Open Cited RAG Synthesis */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              paddingLeft: '1.4rem',
              borderLeft: '2px solid #10b981',
            }}
          >
            <Sparkles size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div className="mono-metric" style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 800 }}>
                {ragResult?.mode || 'P-07 • NEON PGVECTOR CITED SYNTHESIS'}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#ffffff', lineHeight: 1.55, margin: '0.2rem 0 0 0' }}>
                {ragResult?.answer}
              </p>
            </div>
          </div>
        </div>

        {/* TWO OPEN EDITORIAL COLUMNS (NO BOXY CARDS — HAIRLINE DIVIDERS OVER STARFIELD) */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '2rem',
          }}
        >
          {/* Left Column: P-07 SEC Form 10-K Vector Citations */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div
              className="mono-metric"
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                color: 'var(--text-dim)',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>P-07 • SEC FORM 10-K VECTOR CITATIONS (ITEM 7 MD&A / ITEM 1A RISK)</span>
              <span style={{ color: '#10b981' }}>COSINE SIMILARITY</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {displayedChunks.map((chunk) => {
                const isRisk = chunk.section.includes('ITEM 1A');
                const accentColor = isRisk ? '#f43f5e' : '#10b981';
                return (
                  <div
                    key={chunk.id}
                    onClick={() => handleSelectTicker(chunk.sym)}
                    style={{
                      padding: '0.9rem 0.25rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          className="mono-metric"
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.12rem 0.5rem',
                            borderRadius: '999px',
                            backgroundColor: isRisk ? 'rgba(244, 63, 94, 0.16)' : 'rgba(16, 185, 129, 0.16)',
                            color: accentColor,
                          }}
                        >
                          {chunk.sym}
                        </span>
                        <span className="mono-metric" style={{ fontSize: '0.68rem', color: 'var(--text-main)', fontWeight: 700 }}>
                          {chunk.section}
                        </span>
                      </div>
                      <span className="mono-metric" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981' }}>
                        sim {chunk.cosineSim}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                      {chunk.text[langCode] || chunk.text.EN}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: P-04 & P-08 FinBERT Real-Time Headline Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div
              className="mono-metric"
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                color: 'var(--text-dim)',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>P-04 & P-08 • FINBERT REAL-TIME NLP STREAM</span>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {['ALL', 'BULLISH', 'CAUTION'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSentimentFilter(f)}
                    className="mono-metric"
                    style={{
                      fontSize: '0.58rem',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '999px',
                      border: sentimentFilter === f ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                      background: sentimentFilter === f ? 'rgba(16,185,129,0.16)' : 'transparent',
                      color: sentimentFilter === f ? '#fff' : 'var(--text-dim)',
                      cursor: 'pointer',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {filteredHeadlines.map((news) => {
                const isPos = news.scoreNum >= 0;
                const toneColor = isPos ? '#10b981' : '#f43f5e';
                return (
                  <div
                    key={news.id}
                    onClick={() => handleSelectTicker(news.sym)}
                    style={{
                      padding: '0.85rem 0.25rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span className="mono-metric" style={{ fontWeight: 800, color: '#fff', fontSize: '0.76rem' }}>
                          {news.sym}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                          {news.source} • {news.time}
                        </span>
                      </div>
                      <span
                        className="mono-metric"
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: toneColor,
                          padding: '0.12rem 0.52rem',
                          borderRadius: '999px',
                          backgroundColor: isPos ? 'rgba(16, 185, 129, 0.14)' : 'rgba(244, 63, 94, 0.14)',
                        }}
                      >
                        {news.score} ({isPos ? 'POSITIVE' : 'NEGATIVE'})
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: '0 0 0.45rem 0', lineHeight: 1.48 }}>
                      {news.title[langCode] || news.title.EN}
                    </p>

                    {/* Strict Green vs Red FinBERT Softmax Bar */}
                    <div style={{ display: 'flex', height: '4px', borderRadius: '999px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ width: `${news.probs.pos * 100}%`, backgroundColor: '#10b981' }} />
                      <div style={{ width: `${news.probs.neu * 100}%`, backgroundColor: 'rgba(255,255,255,0.22)' }} />
                      <div style={{ width: `${news.probs.neg * 100}%`, backgroundColor: '#f43f5e' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // DESIGN 2: PERPLEXITY AI SPOTLIGHT (CENTERED SYNTHESIS + FLOATING CITATION PILLS)
  // ============================================================================
  if (designVariant === 'spotlight') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem',
          height: 'calc(100vh - 115px)',
          overflowY: 'auto',
          padding: '0.1rem 0.5rem',
        }}
      >
        {renderSharedTopControls()}

        {/* CENTERED AI SYNTHESIS HERO STAGE */}
        <div
          style={{
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(10, 15, 28, 0.78) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '1.25rem 1.6rem',
            boxShadow: '0 14px 40px rgba(0, 0, 0, 0.35)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} style={{ color: '#10b981' }} />
              <span className="mono-metric" style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10b981' }}>
                AI RESEARCH SYNTHESIS • {ragResult?.mode || 'P-07 PGVECTOR + P-04 FINBERT'}
              </span>
            </div>
            <span
              className="mono-metric"
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.18rem 0.65rem',
                borderRadius: '999px',
                backgroundColor: aggregatePolarity.avgNum >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)',
                color: aggregatePolarity.color,
              }}
            >
              NLP Polarity: {aggregatePolarity.formatted}
            </span>
          </div>

          <p className="serif-heading" style={{ fontSize: '1.05rem', color: '#ffffff', lineHeight: 1.55, margin: 0 }}>
            {ragResult?.answer}
          </p>
        </div>

        {/* HORIZONTAL CITATION CAROUSEL (SEC 10-K CHUNKS) */}
        <div style={{ flexShrink: 0 }}>
          <div className="mono-metric" style={{ fontSize: '0.64rem', color: 'var(--text-dim)', marginBottom: '0.45rem', fontWeight: 700 }}>
            VERIFIED SEC FORM 10-K VECTOR SOURCES (P-07 NEON PGVECTOR):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {displayedChunks.slice(0, 3).map((chunk, i) => {
              const isRisk = chunk.section.includes('ITEM 1A');
              const cColor = isRisk ? '#f43f5e' : '#10b981';
              return (
                <div
                  key={chunk.id}
                  onClick={() => handleSelectTicker(chunk.sym)}
                  style={{
                    borderRadius: '22px',
                    backgroundColor: 'rgba(13, 19, 33, 0.62)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${cColor}55`,
                    padding: '0.9rem 1.05rem',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className="mono-metric" style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fff' }}>
                      [{i + 1}] {chunk.sym} • {chunk.filing}
                    </span>
                    <span className="mono-metric" style={{ fontSize: '0.66rem', color: cColor, fontWeight: 800 }}>
                      sim {chunk.cosineSim}
                    </span>
                  </div>
                  <div className="mono-metric" style={{ fontSize: '0.6rem', color: cColor, marginBottom: '0.35rem' }}>
                    {chunk.section}
                  </div>
                  <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', lineHeight: 1.48, margin: 0 }}>
                    {chunk.text[langCode] || chunk.text.EN}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CAPSULE STREAM: P-04 FINBERT LIVE HEADLINES */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="mono-metric" style={{ fontSize: '0.64rem', color: 'var(--text-dim)', marginBottom: '0.45rem', fontWeight: 700 }}>
            REAL-TIME FINBERT SENTIMENT SIGNALS (P-04 & P-08):
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.65rem' }}>
            {filteredHeadlines.map((news) => {
              const isPos = news.scoreNum >= 0;
              return (
                <div
                  key={news.id}
                  onClick={() => handleSelectTicker(news.sym)}
                  style={{
                    borderRadius: '20px',
                    backgroundColor: 'rgba(13, 19, 33, 0.55)',
                    border: `1px solid ${isPos ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`,
                    padding: '0.8rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '0.3rem' }}>
                    <span className="mono-metric" style={{ fontWeight: 800, color: '#fff' }}>{news.sym} • {news.source}</span>
                    <span className="mono-metric" style={{ fontWeight: 800, color: isPos ? '#10b981' : '#f43f5e' }}>
                      {news.score}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.45 }}>
                    {news.title[langCode] || news.title.EN}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // DESIGN 3: SEMANTIC VECTOR & SENTIMENT CONSTELLATION (INTERACTIVE NODE MAP)
  // ============================================================================
  if (designVariant === 'constellation') {
    const activeChunk =
      displayedChunks.find((c) => c.id === focusedChunkId) || displayedChunks[0] || SEC_10K_CHUNKS[0];
    const matchingNews = FINBERT_HEADLINES.filter((n) => n.sym === activeChunk.sym);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          height: 'calc(100vh - 115px)',
          overflowY: 'auto',
          padding: '0.1rem 0.4rem',
        }}
      >
        {renderSharedTopControls()}

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '1rem' }}>
          {/* Left: Interactive Semantic Embedding Map (Cosine Similarity vs FinBERT Polarity) */}
          <div
            style={{
              position: 'relative',
              borderRadius: '28px',
              backgroundColor: 'rgba(10, 15, 28, 0.52)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              padding: '1.2rem',
            }}
          >
            <div className="mono-metric" style={{ fontSize: '0.64rem', color: 'var(--text-dim)', fontWeight: 700 }}>
              PGVECTOR EMBEDDING SPACE (RADIUS = COSINE SIMILARITY • GREEN = GROWTH MD&A / RED = RISK FACTOR)
            </div>

            {[34, 60, 84].map((r) => (
              <div
                key={r}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '54%',
                  width: `${r}%`,
                  height: `${r}%`,
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255,255,255,0.08)',
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Center Query Core */}
            <div
              className="mono-metric"
              style={{
                position: 'absolute',
                left: '50%',
                top: '54%',
                transform: 'translate(-50%, -50%)',
                padding: '0.45rem 0.9rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(10, 15, 28, 0.95)',
                border: '1px solid #10b981',
                color: '#10b981',
                fontSize: '0.64rem',
                fontWeight: 800,
              }}
            >
              QUERY: {filingsQuery || 'ALL 10-K VECTORS'}
            </div>

            {displayedChunks.map((chunk, idx) => {
              const angle = (idx / Math.max(1, displayedChunks.length)) * 2 * Math.PI - Math.PI / 2;
              const radiusPct = 19 + (1 - (chunk.cosineSim - 0.84) / 0.1) * 18;
              const xPct = Math.min(88, Math.max(12, 50 + Math.cos(angle) * radiusPct));
              const yPct = Math.min(86, Math.max(18, 54 + Math.sin(angle) * radiusPct));
              const isRisk = chunk.section.includes('ITEM 1A');
              const nodeColor = isRisk ? '#f43f5e' : '#10b981';
              const selected = activeChunk.id === chunk.id;

              return (
                <div
                  key={chunk.id}
                  onClick={() => {
                    setFocusedChunkId(chunk.id);
                    handleSelectTicker(chunk.sym);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${xPct}%`,
                    top: `${yPct}%`,
                    transform: 'translate(-50%, -50%)',
                    width: selected ? '76px' : '64px',
                    height: selected ? '76px' : '64px',
                    borderRadius: '50%',
                    background: isRisk
                      ? 'radial-gradient(circle, rgba(244,63,94,0.38), rgba(24,10,18,0.92))'
                      : 'radial-gradient(circle, rgba(16,185,129,0.38), rgba(8,26,22,0.92))',
                    border: `${selected ? '2.5px' : '1.5px'} solid ${nodeColor}`,
                    boxShadow: `0 0 20px ${nodeColor}55`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span className="mono-metric" style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fff' }}>
                    {chunk.sym}
                  </span>
                  <span className="mono-metric" style={{ fontSize: '0.56rem', color: nodeColor, fontWeight: 800 }}>
                    {chunk.cosineSim}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Deep Inspector for Selected Vector + Corresponding FinBERT News */}
          <div
            style={{
              borderRadius: '28px',
              backgroundColor: 'rgba(13, 19, 33, 0.64)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1.3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.9rem',
            }}
          >
            <div>
              <div className="mono-metric" style={{ fontSize: '0.64rem', color: '#10b981', fontWeight: 800 }}>
                SELECTED PGVECTOR DOCUMENT CHUNK (P-07)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.35rem' }}>
                <span className="mono-metric" style={{ fontSize: '1.55rem', fontWeight: 800, color: '#fff' }}>
                  {activeChunk.sym} • {activeChunk.filing}
                </span>
                <span className="mono-metric" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981' }}>
                  sim {activeChunk.cosineSim}
                </span>
              </div>
              <div className="mono-metric" style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                {activeChunk.section}
              </div>
              <p style={{ fontSize: '0.84rem', color: '#ffffff', lineHeight: 1.6, marginTop: '0.75rem' }}>
                “{activeChunk.text[langCode] || activeChunk.text.EN}”
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.85rem' }}>
              <div className="mono-metric" style={{ fontSize: '0.64rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 700 }}>
                CROSS-REFERENCED FINBERT HEADLINES FOR {activeChunk.sym} (P-04 & P-08):
              </div>
              {matchingNews.map((n) => {
                const pos = n.scoreNum >= 0;
                return (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.75rem 0.9rem',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${pos ? '#10b98155' : '#f43f5e55'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '0.25rem' }}>
                      <span className="mono-metric" style={{ color: 'var(--text-dim)' }}>{n.source} • {n.time}</span>
                      <span className="mono-metric" style={{ fontWeight: 800, color: pos ? '#10b981' : '#f43f5e' }}>
                        FinBERT: {n.score} ({n.label})
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#fff' }}>{n.title[langCode] || n.title.EN}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // DESIGN 4: ASYMMETRIC GLASS BENTO MOSAIC (MODERN CURVED CAPSULES)
  // ============================================================================
  if (designVariant === 'bento') {
    const capsule = {
      borderRadius: '26px',
      backgroundColor: 'rgba(13, 19, 33, 0.56)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.09)',
      padding: '1.1rem 1.25rem',
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          height: 'calc(100vh - 115px)',
          overflowY: 'auto',
          padding: '0.1rem 0.4rem',
        }}
      >
        {renderSharedTopControls()}

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto 1fr', gap: '0.8rem' }}>
          {/* Bento Tile 1 (Span 2): RAG Synthesis Banner */}
          <div style={{ ...capsule, gridColumn: 'span 2', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="mono-metric" style={{ fontSize: '0.63rem', color: '#10b981', fontWeight: 800 }}>
              P-07 • NEON PGVECTOR SEMANTIC RAG SYNTHESIS
            </div>
            <p style={{ fontSize: '0.82rem', color: '#fff', lineHeight: 1.5, marginTop: '0.35rem', marginBottom: 0 }}>
              {ragResult?.answer}
            </p>
          </div>

          {/* Bento Tile 2 (Span 1): FinBERT Polarity Gauge */}
          <div style={{ ...capsule, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="mono-metric" style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>P-04 FINBERT POLARITY</div>
              <div className="mono-metric" style={{ fontSize: '1.85rem', fontWeight: 800, color: aggregatePolarity.color, marginTop: '0.15rem' }}>
                {aggregatePolarity.formatted}
              </div>
              <div className="mono-metric" style={{ fontSize: '0.64rem', color: aggregatePolarity.color, fontWeight: 700 }}>
                {aggregatePolarity.label}
              </div>
            </div>
            <div className="mono-metric" style={{ textAlign: 'right', fontSize: '0.68rem' }}>
              <div style={{ color: '#10b981', fontWeight: 700 }}>+{aggregatePolarity.posCount} Bullish</div>
              <div style={{ color: '#f43f5e', fontWeight: 700, marginTop: '0.2rem' }}>-{aggregatePolarity.negCount} Bearish</div>
            </div>
          </div>

          {/* Bento Tile 3 (Span 2): Form 10-K Chunks */}
          <div style={{ ...capsule, gridColumn: 'span 2', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className="mono-metric" style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '0.55rem' }}>
              SEC FORM 10-K RETRIEVED VECTOR CHUNKS ({displayedChunks.length})
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              {displayedChunks.map((chunk) => {
                const isRisk = chunk.section.includes('ITEM 1A');
                const col = isRisk ? '#f43f5e' : '#10b981';
                return (
                  <div
                    key={chunk.id}
                    onClick={() => handleSelectTicker(chunk.sym)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '18px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${col}44`,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '0.3rem' }}>
                      <span className="mono-metric" style={{ fontWeight: 800, color: col }}>{chunk.sym} • {chunk.section}</span>
                      <span className="mono-metric" style={{ color: '#10b981', fontWeight: 700 }}>{chunk.cosineSim}</span>
                    </div>
                    <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                      {chunk.text[langCode] || chunk.text.EN}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bento Tile 4 (Span 1): FinBERT Stream */}
          <div style={{ ...capsule, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className="mono-metric" style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '0.55rem' }}>
              P-04 & P-08 • NLP WIRE
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {filteredHeadlines.map((n) => {
                const pos = n.scoreNum >= 0;
                return (
                  <div
                    key={n.id}
                    onClick={() => handleSelectTicker(n.sym)}
                    style={{
                      padding: '0.7rem 0.85rem',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      borderLeft: `3px solid ${pos ? '#10b981' : '#f43f5e'}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', marginBottom: '0.2rem' }}>
                      <span className="mono-metric" style={{ fontWeight: 800, color: '#fff' }}>{n.sym}</span>
                      <span className="mono-metric" style={{ fontWeight: 800, color: pos ? '#10b981' : '#f43f5e' }}>{n.score}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {n.title[langCode] || n.title.EN}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // DESIGN 5: UNIFIED SIGNAL CHRONICLE (SINGLE COMBINED FEED OF P-04 + P-07 + P-08)
  // ============================================================================
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        height: 'calc(100vh - 115px)',
        overflowY: 'auto',
        padding: '0.1rem 0.4rem',
      }}
    >
      {renderSharedTopControls()}

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {unifiedFeed.map((item) => {
          const toneColor = item.isPositive ? '#10b981' : '#f43f5e';
          return (
            <div
              key={item.uid}
              onClick={() => handleSelectTicker(item.sym)}
              style={{
                borderRadius: '20px',
                backgroundColor: 'rgba(13, 19, 33, 0.58)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${toneColor}44`,
                padding: '0.85rem 1.15rem',
                display: 'grid',
                gridTemplateColumns: '150px 1fr auto',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span className="mono-metric" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                    {item.sym}
                  </span>
                  <span
                    className="mono-metric"
                    style={{
                      fontSize: '0.56rem',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(255,255,255,0.07)',
                      color: 'var(--text-dim)',
                    }}
                  >
                    {item.kind}
                  </span>
                </div>
                <div className="mono-metric" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                  {item.pipe}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {item.body}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  className="mono-metric"
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '0.22rem 0.65rem',
                    borderRadius: '999px',
                    backgroundColor: item.isPositive ? 'rgba(16,185,129,0.16)' : 'rgba(244,63,94,0.16)',
                    color: toneColor,
                  }}
                >
                  {item.metricLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
