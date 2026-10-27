import React, { useState, useEffect } from 'react';
import { Bot, Play, ShieldCheck, Cpu, DollarSign } from 'lucide-react';
import { ASSET_CATALOG } from '../services/marketService';
import {
  INITIAL_LEDGER_EVENTS,
  getCommitteeDeliberation,
  runLiveCommitteeCycle,
} from '../services/committeeService';

export default function AgentCommitteeView({
  selectedAsset,
  onSelectAsset,
  langCode = 'EN',
  t,
}) {
  const [committeeResult, setCommitteeResult] = useState(() =>
    getCommitteeDeliberation(selectedAsset)
  );
  const [ledgerEvents, setLedgerEvents] = useState(INITIAL_LEDGER_EVENTS);
  const [isRunningCycle, setIsRunningCycle] = useState(false);
  const [cashBalance, setCashBalance] = useState(79999.99);
  const [totalEquity, setTotalEquity] = useState(100000.0);

  useEffect(() => {
    setCommitteeResult(getCommitteeDeliberation(selectedAsset));
  }, [selectedAsset]);

  const handleRunLiveCycle = async (targetSym = selectedAsset) => {
    setIsRunningCycle(true);
    try {
      const live = await runLiveCommitteeCycle(targetSym);
      setCommitteeResult(live);
      if (live.portfolio) {
        setCashBalance(live.portfolio.cash ?? 79999.99);
        setTotalEquity(live.portfolio.total_equity ?? 100000.0);
      }
      if (live.newLedgerEvent) {
        setLedgerEvents((prev) => [live.newLedgerEvent, ...prev.slice(0, 7)]);
      }
    } catch {
      setCommitteeResult(getCommitteeDeliberation(targetSym));
    } finally {
      setIsRunningCycle(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.38fr 1fr', gap: '0.85rem', height: 'calc(100vh - 120px)' }}>
      {/* LEFT: P-09, P-10, P-11 MULTI-AGENT DELIBERATION PROTOCOL */}
      <div className="terminal-card" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0 }}>
        {/* HEADER + RUN COMMITTEE CYCLE CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '6px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Bot size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 className="serif-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Autonomous Multi-Agent Committee
                </h2>
                <span
                  className="mono-metric"
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.42rem',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: 'var(--accent)',
                  }}
                >
                  {committeeResult.mode || 'P-09 • P-10 • P-11'}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                {langCode === 'ES'
                  ? 'Orquestador LangGraph donde Research (P-09), Trading (P-10) y Risk Manager (P-11) deliberan en vivo.'
                  : 'LangGraph orchestrator where Research (P-09), Trading (P-10), and Risk Manager (P-11) deliberate live.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleRunLiveCycle(selectedAsset)}
            disabled={isRunningCycle}
            className="mono-metric"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--accent)',
              color: '#000',
              border: 'none',
              padding: '0.42rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.71rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Play size={13} fill="#000" />
            <span>
              {isRunningCycle
                ? langCode === 'ES'
                  ? 'DELIBERANDO...'
                  : 'DELIBERATING...'
                : langCode === 'ES'
                ? `EJECUTAR COMITÉ (${selectedAsset})`
                : `RUN COMMITTEE (${selectedAsset})`}
            </span>
          </button>
        </div>

        {/* ASSET SELECTOR STRIP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
          {ASSET_CATALOG.map((asset) => {
            const active = selectedAsset === asset.sym;
            return (
              <button
                key={asset.sym}
                onClick={() => onSelectAsset && onSelectAsset(asset.sym)}
                className="mono-metric"
                style={{
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.48rem',
                  borderRadius: '4px',
                  border: active ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                  backgroundColor: active ? 'var(--accent-light)' : 'var(--bg-subtle)',
                  color: active ? 'var(--accent)' : 'var(--text-dim)',
                  cursor: 'pointer',
                }}
              >
                {asset.sym}
              </button>
            );
          })}
        </div>

        {/* CONSENSUS SUMMARY BAR */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            padding: '0.65rem 0.9rem',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={15} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {langCode === 'ES' ? 'Veredicto del Comité:' : 'Committee Verdict:'}
            </span>
            <span className="mono-metric" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {committeeResult.consensusAction}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {committeeResult.roundtripMs && (
              <span className="mono-metric" style={{ fontSize: '0.63rem', color: 'var(--text-dim)' }}>
                {committeeResult.roundtripMs}ms
              </span>
            )}
            <span
              className="mono-metric"
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--accent)',
                backgroundColor: 'var(--accent-light)',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
              }}
            >
              {committeeResult.allocatedNav}
            </span>
          </div>
        </div>

        {/* 3 SPECIALIZED AGENT CARDS */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: '0.2rem' }}>
          {committeeResult.agents.map((ag, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.85rem 0.95rem',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                borderLeft: `3px solid ${ag.color}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.69rem', marginBottom: '0.32rem' }}>
                <span className="mono-metric" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  {ag.role}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {ag.execTimeMs !== undefined && (
                    <span className="mono-metric" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                      {ag.execTimeMs}ms
                    </span>
                  )}
                  <span className="mono-metric" style={{ fontWeight: 800, color: ag.color }}>
                    {ag.verdict}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                {ag.note[langCode] || ag.note.EN}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: P-10 & P-11 SYSTEMATIC $100,000 PAPER LEDGER */}
      <div className="terminal-card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div
          style={{
            padding: '0.7rem 1rem',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span className="mono-metric" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)' }}>
            P-10 • {t.executionBook}
          </span>
          <span
            className="mono-metric"
            style={{
              fontSize: '0.64rem',
              fontWeight: 700,
              padding: '0.12rem 0.45rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--accent)',
            }}
          >
            TRADING_MODE = PAPER
          </span>
        </div>

        {/* PORTFOLIO TELEMETRY METRICS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            padding: '0.65rem 0.9rem',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-panel)',
          }}
        >
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.45rem 0.6rem', borderRadius: '5px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>TOTAL EQUITY (NAV)</div>
            <div className="mono-metric" style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>
              ${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.45rem 0.6rem', borderRadius: '5px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>LIQUID CASH</div>
            <div className="mono-metric" style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.1rem' }}>
              ${Math.round(cashBalance).toLocaleString('en-US')}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.45rem 0.6rem', borderRadius: '5px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>MAX POSITION CAP</div>
            <div className="mono-metric" style={{ fontSize: '0.84rem', fontWeight: 800, color: '#a855f7', marginTop: '0.1rem' }}>
              20.0% ($20k)
            </div>
          </div>
        </div>

        {/* AUDITABLE ORDER & DECISION STREAM */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {ledgerEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectAsset && onSelectAsset(ev.sym)}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.75rem 0.85rem',
                borderRadius: '5px',
                border: '1px solid var(--border-light)',
                borderLeft: `3px solid ${ev.color}`,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                  {ev.title[langCode] || ev.title.EN}
                </span>
                <span className="mono-metric" style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>
                  {ev.time}
                </span>
              </div>
              <p style={{ fontSize: '0.71rem', color: 'var(--text-muted)', marginTop: '0.28rem', marginBottom: '0.35rem', lineHeight: 1.45 }}>
                {ev.desc[langCode] || ev.desc.EN}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.63rem' }}>
                <span className="mono-metric" style={{ color: ev.color, fontWeight: 700 }}>
                  STATUS: {ev.status}
                </span>
                <span className="mono-metric" style={{ color: 'var(--text-main)', fontWeight: 700 }}>
                  {ev.allocText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
