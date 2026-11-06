import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { tx, useViewLocale } from '../data/i18n/viewLocaleService';
import {
  AGENT_QUICK_PROMPTS,
  getAgentGreeting,
  buildLiveAppSnapshot,
  generateGlobalAgentResponse,
} from '../services/agentKnowledgeBase';

/**
 * Global Guide Agent Drawer (`GlobalAgentDrawer.jsx`)
 *
 * Implements Phase 2 (Steps 2.1 to 2.4):
 * - Opens from the top-right corner of the global HeaderBar.
 * - Minimal 1-line greeting + 4 unified quick prompts centered 100% on the product.
 * - Purely conversational (no UI-operating buttons).
 * - Preserves conversation history across tabs (`Home`, `Markets`, `Portfolio`, `System`, `Guide`).
 */
export default function GlobalAgentDrawer({
  isOpen,
  onClose,
  activeTab,
  marketsViewMode,
  selectedAsset,
  watchlistSyms = [],
  langCode = 'EN',
}) {
  useViewLocale(langCode);
  const [inputMsg, setInputMsg] = useState('');
  const [thread, setThread] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);

  const greetingText = getAgentGreeting();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (rawText) => {
    const clean = String(rawText || '').trim();
    if (!clean || isThinking) return;

    const nextHistory = [...thread, { role: 'user', txt: clean }];
    setThread(nextHistory);
    setInputMsg('');
    setIsThinking(true);

    try {
      const snapshot = buildLiveAppSnapshot({
        activeTab,
        marketsViewMode,
        selectedAsset,
        watchlistSyms,
      });
      const reply = await generateGlobalAgentResponse({
        userText: clean,
        history: nextHistory,
        snapshot,
      });
      setThread((prev) => [...prev, { role: 'ai', txt: reply }]);
    } finally {
      setIsThinking(false);
    }
  };

  // Simple lightweight formatter for bold (**text**) and inline code (`code`) + line breaks
  const renderFormattedMessage = (text) => {
    const lines = String(text || '').split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      return (
        <div key={lIdx} style={{ marginTop: lIdx > 0 ? '4px' : 0 }}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} style={{ color: '#ffffff', fontWeight: 700 }}>
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code
                  key={pIdx}
                  className="mono-metric"
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--ui-accent, #10b981)',
                    background: 'rgba(148, 163, 184, 0.1)',
                    padding: '1px 4px',
                    borderRadius: '4px',
                  }}
                >
                  {part.slice(1, -1)}
                </code>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <aside
      aria-label={tx('Guía de la Plataforma', 'Platform Guide')}
      style={{
        position: 'fixed',
        top: '3.6rem',
        right: '1.25rem',
        width: 'min(370px, calc(100vw - 2.5rem))',
        maxHeight: 'calc(100vh - 7.4rem)',
        zIndex: 95,
        backgroundColor: 'rgba(7, 11, 20, 0.94)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(148, 163, 184, 0.24)',
        borderRadius: '12px',
        boxShadow: '0 18px 42px rgba(0, 0, 0, 0.75)',
        padding: '14px 15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        color: '#f8fafc',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '999px',
              backgroundColor: 'var(--ui-accent, #10b981)',
              boxShadow: '0 0 10px var(--ui-accent, #10b981)',
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
            {tx('Agente Guía', 'Guide Agent')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {thread.length > 0 && (
            <button
              type="button"
              onClick={() => setThread([])}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '2px 4px',
              }}
            >
              {tx('Limpiar', 'Clear')}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={tx('Cerrar agente', 'Close agent')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              padding: '2px',
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* 4 Quick Product-Focused Prompts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', flexShrink: 0 }}>
        {AGENT_QUICK_PROMPTS.map((qItem) => {
          const lbl = qItem.label();
          return (
            <button
              key={qItem.id}
              type="button"
              onClick={() => handleSend(qItem.prompt())}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                background: 'rgba(15, 23, 42, 0.55)',
                color: '#e2e8f0',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--ui-accent, #10b981)';
                e.currentTarget.style.color = 'var(--ui-accent, #10b981)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.22)';
                e.currentTarget.style.color = '#e2e8f0';
              }}
            >
              {lbl}
            </button>
          );
        })}
      </div>

      {/* Conversation Thread */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: '150px',
          maxHeight: '360px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingRight: '2px',
        }}
      >
        {/* Minimal 1-line greeting */}
        <div
          style={{
            padding: '8px 10px',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.45)',
            border: '1px solid rgba(148, 163, 184, 0.16)',
            fontSize: '12.5px',
            color: '#e2e8f0',
            lineHeight: 1.45,
          }}
        >
          {greetingText}
        </div>

        {thread.map((m, idx) => (
          <div
            key={idx}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              background:
                m.role === 'ai'
                  ? 'rgba(15, 23, 42, 0.45)'
                  : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.13)',
              border: `1px solid ${
                m.role === 'ai'
                  ? 'rgba(148, 163, 184, 0.18)'
                  : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.55)'
              }`,
              fontSize: '12.2px',
              color: '#e2e8f0',
              lineHeight: 1.48,
              alignSelf: m.role === 'user' ? 'flex-end' : 'stretch',
              maxWidth: m.role === 'user' ? '92%' : '100%',
            }}
          >
            {renderFormattedMessage(m.txt)}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputMsg);
        }}
        style={{
          display: 'flex',
          gap: '6px',
          paddingTop: '4px',
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={tx(
            'Preguntá sobre esta vista, activos o métricas...',
            'Ask about this view, assets, or metrics...'
          )}
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.26)',
            borderRadius: '7px',
            padding: '7px 10px',
            color: '#f8fafc',
            fontSize: '12px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          aria-label={tx('Enviar consulta', 'Send query')}
          style={{
            padding: '7px 11px',
            borderRadius: '7px',
            border: '1px solid var(--ui-accent, #10b981)',
            background: 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.16)',
            color: 'var(--ui-accent, #10b981)',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={13} />
        </button>
      </form>
    </aside>
  );
}
