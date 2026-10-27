import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, X, CheckCircle2 } from 'lucide-react';
import { INFRA_ENGINES } from '../services/observabilityService';

export default function ObservabilityView({ t, onGoBack }) {
  const [pipelineFilter, setPipelineFilter] = useState('');

  const filteredPipelines = useMemo(() => {
    if (!pipelineFilter.trim()) return INFRA_ENGINES;
    const q = pipelineFilter.toLowerCase();
    return INFRA_ENGINES.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.arch.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
    );
  }, [pipelineFilter]);

  return (
    <div>
      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <button
              onClick={onGoBack}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={14} strokeWidth={2.2} /> {t.backBtn}
            </button>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>•</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Architecture Overview</span>
          </div>
          <h2 className="serif-heading" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {t.observabilityTitle}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.observabilityDesc}</p>
        </div>

        {/* OBSERVABILITY FILTER BAR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: 'var(--bg-panel)',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
            minWidth: '260px',
          }}
        >
          <Search size={14} strokeWidth={2.2} style={{ color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder={t.searchPipelines}
            value={pipelineFilter}
            onChange={(e) => setPipelineFilter(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '0.76rem',
              outline: 'none',
              width: '100%',
              fontFamily: 'var(--font-sans)',
            }}
          />
          {pipelineFilter && (
            <button
              onClick={() => setPipelineFilter('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {filteredPipelines.map((eng, idx) => (
          <div key={idx} className="terminal-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                className="mono-metric"
                style={{
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '3px',
                }}
              >
                {eng.id} • {eng.status.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={13} strokeWidth={2.2} /> OK
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>{eng.name}</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{eng.arch}</span>
            </div>
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.65rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                marginTop: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Role:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{eng.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Metric:</span>
                <span className="mono-metric" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {eng.sync}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

