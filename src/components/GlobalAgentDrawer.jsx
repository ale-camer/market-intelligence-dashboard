import React, { useState, useRef, useEffect } from 'react';
import { X, Send, KeyRound, Check } from 'lucide-react';
import { tx, useViewLocale } from '../data/i18n/viewLocaleService';
import {
  AGENT_QUICK_PROMPTS,
  getAgentGreeting,
  buildLiveAppSnapshot,
  generateGlobalAgentResponse,
  getConfiguredGeminiKey,
  setConfiguredGeminiKey,
} from '../services/agentKnowledgeBase';

/**
 * Global Guide Agent Drawer (`GlobalAgentDrawer.jsx`)
 *
 * Implements Phase 2 (Steps 2.1 to 2.4):
 * - Full-height vertical side drawer spanning between HeaderBar and FooterBar.
 * - Minimal 1-line greeting + 4 unified quick prompts centered 100% on the product.
 * - Powered by Gemini 2.5 Flash-Lite (`gemini-2.5-flash-lite`) when key is present,
 *   with instant language-aware local synthesis fallback.
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
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKeyDraft, setApiKeyDraft] = useState(() => getConfiguredGeminiKey());
  const [hasGeminiKey, setHasGeminiKey] = useState(() => Boolean(getConfiguredGeminiKey()));
  const scrollRef = useRef(null);

  const greetingText = getAgentGreeting();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread, isOpen, isThinking]);

  if (!isOpen) return null;

  const handleSaveKey = (e) => {
    e.preventDefault();
    setConfiguredGeminiKey(apiKeyDraft);
    setHasGeminiKey(Boolean(getConfiguredGeminiKey()));
    setShowKeyInput(false);
  };

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

  const renderInlineCode = (segment, keyPrefix) => {
    const subParts = String(segment || '').split(/(`[^`]+`)/g);
    return subParts.map((sp, sIdx) => {
      if (sp.startsWith('`') && sp.endsWith('`') && sp.length > 2) {
        return (
          <code
            key={`${keyPrefix}-c-${sIdx}`}
            className="mono-metric"
            style={{
              fontSize: '11.5px',
              color: 'var(--ui-accent, #10b981)',
              background: 'rgba(148, 163, 184, 0.12)',
              padding: '1px 4px',
              borderRadius: '4px',
            }}
          >
            {sp.slice(1, -1)}
          </code>
        );
      }
      return <span key={`${keyPrefix}-t-${sIdx}`}>{sp}</span>;
    });
  };

  // Clean formatter supporting **bold** (including nested `code`) and standalone `code` + line breaks
  const renderFormattedMessage = (text) => {
    const lines = String(text || '').split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <div key={lIdx} style={{ marginTop: lIdx > 0 ? '6px' : 0 }}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
              const inner = part.slice(2, -2);
              return (
                <strong key={pIdx} style={{ color: '#ffffff', fontWeight: 700 }}>
                  {renderInlineCode(inner, `${lIdx}-${pIdx}`)}
                </strong>
              );
            }
            return <React.Fragment key={pIdx}>{renderInlineCode(part, `${lIdx}-${pIdx}`)}</React.Fragment>;
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
        top: '44px',
        bottom: '36px',
        right: '12px',
        width: 'min(400px, calc(100vw - 24px))',
        zIndex: 95,
        backgroundColor: 'rgba(7, 11, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.24)',
        borderRadius: '12px',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.8)',
        padding: '14px 16px',
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
          <button
            type="button"
            onClick={() => setShowKeyInput((prev) => !prev)}
            title={
              hasGeminiKey
                ? tx('Gemini 2.5 Flash-Lite conectado', 'Gemini 2.5 Flash-Lite connected')
                : tx('Conectar API Key de Gemini Flash-Lite', 'Connect Gemini Flash-Lite API Key')
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              borderRadius: '999px',
              border: `1px solid ${
                hasGeminiKey ? 'rgba(16, 185, 129, 0.45)' : 'rgba(148, 163, 184, 0.25)'
              }`,
              background: hasGeminiKey ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.6)',
              color: hasGeminiKey ? '#10b981' : '#94a3b8',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <KeyRound size={10} />
            <span>{hasGeminiKey ? 'Flash-Lite ON' : 'Gemini Key'}</span>
          </button>
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

      {/* Optional 1-line Gemini API Key input bar */}
      {showKeyInput && (
        <form
          onSubmit={handleSaveKey}
          style={{
            display: 'flex',
            gap: '6px',
            padding: '6px 8px',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(148, 163, 184, 0.22)',
            flexShrink: 0,
          }}
        >
          <input
            type="password"
            value={apiKeyDraft}
            onChange={(e) => setApiKeyDraft(e.target.value)}
            placeholder={tx(
              'Pegá tu GEMINI_API_KEY (AI Studio Free Tier)...',
              'Paste your GEMINI_API_KEY (AI Studio Free Tier)...'
            )}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#f8fafc',
              fontSize: '11.5px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '3px 8px',
              borderRadius: '5px',
              border: '1px solid var(--ui-accent, #10b981)',
              background: 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.16)',
              color: 'var(--ui-accent, #10b981)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Check size={11} />
            <span>{tx('Guardar', 'Save')}</span>
          </button>
        </form>
      )}

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

      {/* Conversation Thread — Full Remaining Vertical Height */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '9px',
          paddingRight: '3px',
        }}
      >
        {/* Minimal 1-line greeting */}
        <div
          style={{
            padding: '9px 11px',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.45)',
            border: '1px solid rgba(148, 163, 184, 0.16)',
            fontSize: '12.5px',
            color: '#e2e8f0',
            lineHeight: 1.48,
          }}
        >
          {greetingText}
        </div>

        {thread.map((m, idx) => (
          <div
            key={idx}
            style={{
              padding: '9px 11px',
              borderRadius: '8px',
              background:
                m.role === 'ai'
                  ? 'rgba(15, 23, 42, 0.5)'
                  : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.14)',
              border: `1px solid ${
                m.role === 'ai'
                  ? 'rgba(148, 163, 184, 0.18)'
                  : 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.55)'
              }`,
              fontSize: '12.4px',
              color: '#e2e8f0',
              lineHeight: 1.52,
              alignSelf: m.role === 'user' ? 'flex-end' : 'stretch',
              maxWidth: m.role === 'user' ? '92%' : '100%',
            }}
          >
            {renderFormattedMessage(m.txt)}
          </div>
        ))}

        {isThinking && (
          <div
            style={{
              padding: '8px 11px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.35)',
              border: '1px solid rgba(148, 163, 184, 0.14)',
              fontSize: '11.5px',
              color: '#94a3b8',
              fontStyle: 'italic',
            }}
          >
            {tx('Analizando contexto en pantalla...', 'Analyzing live screen context...')}
          </div>
        )}
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
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(148, 163, 184, 0.26)',
            borderRadius: '7px',
            padding: '8px 11px',
            color: '#f8fafc',
            fontSize: '12.2px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          aria-label={tx('Enviar consulta', 'Send query')}
          style={{
            padding: '8px 12px',
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
