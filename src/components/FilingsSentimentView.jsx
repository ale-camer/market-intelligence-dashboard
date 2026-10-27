import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Search, Sparkles, X, Filter } from 'lucide-react';
import {
  SEC_10K_CHUNKS,
  FINBERT_HEADLINES,
  RAG_QUICK_TOPICS,
  executeSec10kRagQuery,
} from '../services/filingsAndNewsService';

const SEC_FILING_TICKERS = ['ALL', 'AAPL', 'NVDA', 'MSFT', 'AMZN', 'GOOGL'];

export default function FilingsSentimentView({
  selectedAsset,
  onSelectAsset,
  langCode = 'EN',
  t,
}) {
  const [filingsQuery, setFilingsQuery] = useState('');
  const [tickerFilter, setTickerFilter] = useState(() =>
    SEC_FILING_TICKERS.includes(selectedAsset) ? selectedAsset : 'ALL'
  );
  const [sentimentFilter, setSentimentFilter] = useState('ALL'); // 'ALL' | 'BULLISH' | 'CAUTION'
  const [ragResult, setRagResult] = useState(null);
  const [isRetrieving, setIsRetrieving] = useState(false);

  // Sync ticker filter if user picks a SEC equity ticker
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
    } finally {
      setIsRetrieving(false);
    }
  };

  useEffect(() => {
    runRagSearch(filingsQuery, tickerFilter);
  }, [tickerFilter, langCode]);

  const displayedChunks = ragResult?.chunks || SEC_10K_CHUNKS;

  // Filtered FinBERT Headlines
  const filteredHeadlines = useMemo(() => {
    return FINBERT_HEADLINES.filter((h) => {
      const matchesTicker = tickerFilter === 'ALL' || h.sym === tickerFilter;
      if (!matchesTicker) return false;
      if (sentimentFilter === 'BULLISH') return h.scoreNum >= 0.5;
      if (sentimentFilter === 'CAUTION') return h.scoreNum < 0.5;
      return true;
    });
  }, [tickerFilter, sentimentFilter]);

  // Dynamic Aggregate Polarity Score
  const aggregatePolarity = useMemo(() => {
    const list = filteredHeadlines.length > 0 ? filteredHeadlines : FINBERT_HEADLINES;
    const avg = list.reduce((acc, item) => acc + item.scoreNum, 0) / list.length;
    const sign = avg >= 0 ? '+' : '';
    const label = avg >= 0.45 ? 'BULLISH' : avg <= -0.15 ? 'BEARISH' : 'NEUTRAL';
    const color = avg >= 0.45 ? 'var(--accent)' : avg <= -0.15 ? '#ef4444' : '#38bdf8';
    return { formatted: `${sign}${avg.toFixed(2)} ${label}`, color };
  }, [filteredHeadlines]);

  const handleSelectTicker = (sym) => {
    setTickerFilter(sym);
    if (sym !== 'ALL' && onSelectAsset) {
      onSelectAsset(sym);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.38fr 1fr', gap: '0.85rem', height: 'calc(100vh - 120px)' }}>
      {/* LEFT: P-07 SEC 10-K PGVECTOR SEMANTIC RAG */}
      <div className="terminal-card" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0 }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
              <FileText size={19} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 className="serif-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  SEC 10-K Semantic RAG (pgvector)
                </h2>
                <span
                  className="mono-metric"
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: 'var(--accent)',
                  }}
                >
                  {ragResult?.mode || 'P-07 • PGVECTOR'}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                {langCode === 'ES'
                  ? 'Búsqueda vectorial densa sobre reportes SEC Form 10-K (Item 7 MD&A e Item 1A Factores de Riesgo).'
                  : 'Dense vector retrieval across official SEC Form 10-K filings (Item 7 MD&A & Item 1A Risk Factors).'}
              </p>
            </div>
          </div>

          {/* TICKER FILTER PILLS */}
          <div style={{ display: 'flex', gap: '0.28rem', flexWrap: 'wrap' }}>
            {SEC_FILING_TICKERS.map((sym) => {
              const active = tickerFilter === sym;
              return (
                <button
                  key={sym}
                  onClick={() => handleSelectTicker(sym)}
                  className="mono-metric"
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.22rem 0.5rem',
                    borderRadius: '4px',
                    border: active ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                    backgroundColor: active ? 'var(--accent)' : 'var(--bg-subtle)',
                    color: active ? '#000' : 'var(--text-dim)',
                    cursor: 'pointer',
                  }}
                >
                  {sym}
                </button>
              );
            })}
          </div>
        </div>

        {/* RAG SEARCH INPUT BAR + QUICK TOPIC PILLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runRagSearch(filingsQuery, tickerFilter);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.42rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border-light)',
            }}
          >
            <Search size={15} strokeWidth={2.2} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder={t.searchSecFilings}
              value={filingsQuery}
              onChange={(e) => setFilingsQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.78rem',
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
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}
              >
                <X size={13} />
              </button>
            )}
            <button
              type="submit"
              disabled={isRetrieving}
              style={{
                backgroundColor: 'var(--accent)',
                color: '#000',
                border: 'none',
                padding: '0.32rem 0.8rem',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              {isRetrieving ? '...' : langCode === 'ES' ? 'Consultar' : 'Retrieve'}
            </button>
          </form>

          {/* QUICK TOPIC PILLS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="mono-metric" style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>
              {langCode === 'ES' ? 'TÓPICOS RÁPIDOS:' : 'QUICK TOPICS:'}
            </span>
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
                    padding: '0.16rem 0.5rem',
                    borderRadius: '999px',
                    border: active ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                    backgroundColor: active ? 'var(--accent-light)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {topic.label[langCode] || topic.label.EN}
                </button>
              );
            })}
          </div>
        </div>

        {/* RAG CITED SYNTHESIS BOX */}
        {ragResult?.answer && (
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.07)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '6px',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.55rem',
            }}
          >
            <Sparkles size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.1rem' }} />
            <p style={{ fontSize: '0.73rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
              {ragResult.answer}
            </p>
          </div>
        )}

        {/* RETRIEVED PGVECTOR CHUNKS */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: '0.2rem' }}>
          {displayedChunks.map((chunk) => (
            <div
              key={chunk.id}
              onClick={() => handleSelectTicker(chunk.sym)}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.8rem 0.9rem',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                borderLeft: `3px solid ${chunk.color}`,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', marginBottom: '0.3rem' }}>
                <span className="mono-metric" style={{ color: chunk.color, fontWeight: 700 }}>
                  {chunk.sym} • {chunk.filing} • {chunk.section}
                </span>
                <span className="mono-metric" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  cosine_sim: {chunk.cosineSim}
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {chunk.text[langCode] || chunk.text.EN}
              </p>
            </div>
          ))}

          {displayedChunks.length === 0 && (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
              {langCode === 'ES'
                ? 'No se encontraron fragmentos para esa consulta.'
                : 'No filing chunks matched your query.'}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: P-04 & P-08 FINBERT REAL-TIME NEWS SENTIMENT */}
      <div className="terminal-card" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div>
            <span className="mono-metric" style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700 }}>
              P-04 & P-08 • NLP TRANSFORMER STREAM
            </span>
            <h3 className="serif-heading" style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
              FinBERT Headline Sentiment
            </h3>
          </div>

          {/* SENTIMENT POLARITY FILTER */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[
              { id: 'ALL', label: 'ALL' },
              { id: 'BULLISH', label: 'BULLISH' },
              { id: 'CAUTION', label: 'CAUTION' },
            ].map((f) => {
              const active = sentimentFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSentimentFilter(f.id)}
                  className="mono-metric"
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.45rem',
                    borderRadius: '4px',
                    border: active ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                    backgroundColor: active ? 'var(--accent-light)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-dim)',
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* AGGREGATE POLARITY GAUGE */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            padding: '0.75rem 0.9rem',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.73rem', color: 'var(--text-dim)' }}>
            {langCode === 'ES' ? 'Polaridad Agregada' : 'Aggregate Polarity'}{' '}
            <strong className="mono-metric" style={{ color: 'var(--text-main)' }}>
              ({tickerFilter})
            </strong>
          </span>
          <span className="mono-metric" style={{ fontSize: '1.05rem', fontWeight: 800, color: aggregatePolarity.color }}>
            {aggregatePolarity.formatted}
          </span>
        </div>

        {/* HEADLINE CARDS WITH FINBERT PROBABILITY BREAKDOWN */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: '0.2rem' }}>
          {filteredHeadlines.map((news) => (
            <div
              key={news.id}
              onClick={() => onSelectAsset && onSelectAsset(news.sym)}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.75rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', marginBottom: '0.28rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span className="mono-metric" style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.74rem' }}>
                    {news.sym}
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.64rem' }}>
                    {news.source} • {news.time}
                  </span>
                </div>
                <span className="mono-metric" style={{ fontWeight: 700, color: news.color }}>
                  FinBERT: {news.score} ({news.label})
                </span>
              </div>

              <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: '0 0 0.45rem 0', lineHeight: 1.45 }}>
                {news.title[langCode] || news.title.EN}
              </p>

              {/* SOFTMAX PROBABILITY DISTRIBUTION BAR (POS / NEU / NEG) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div style={{ display: 'flex', height: '4px', width: '100%', borderRadius: '2px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ width: `${news.probs.pos * 100}%`, backgroundColor: 'var(--accent)' }} />
                  <div style={{ width: `${news.probs.neu * 100}%`, backgroundColor: '#38bdf8' }} />
                  <div style={{ width: `${news.probs.neg * 100}%`, backgroundColor: '#ef4444' }} />
                </div>
                <div className="mono-metric" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.59rem', color: 'var(--text-dim)' }}>
                  <span>POS: {Math.round(news.probs.pos * 100)}%</span>
                  <span>NEU: {Math.round(news.probs.neu * 100)}%</span>
                  <span>NEG: {Math.round(news.probs.neg * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
