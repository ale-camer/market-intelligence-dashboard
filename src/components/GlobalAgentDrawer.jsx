import React, { useState, useRef, useEffect } from 'react';
import { X, Send, RotateCcw, Copy, Check } from 'lucide-react';
import { tx, useViewLocale } from '../data/i18n/viewLocaleService';
import {
  getContextualQuickPrompts,
  getLiveContextPillLabel,
  getAgentGreeting,
  buildLiveAppSnapshot,
  generateGlobalAgentResponse,
} from '../services/agentKnowledgeBase';

/**
 * Global Guide Agent Drawer (`GlobalAgentDrawer.jsx`)
 *
 * Implements Phase 2 + Enhanced Conversational UX:
 * 1. Top-Anchored Turn View (Variant 2): scrolls the latest question + answer to the TOP of the
 *    reading area (eye level) with bottom breathing room so you never stare at the bottom edge.
 * 2. Auto-expanding multiline `<textarea>` (1 to 5 lines; `Enter` sends, `Shift+Enter` newline).
 * 3. Explicit `↺ New chat` / `Nuevo chat` button (ephemeral in-memory session, no chat storage needed).
 * 4. Quick prompts auto-hide as soon as the conversation starts (reappear on `New chat`).
 * 5. Live Context Pill in the header showing which view/asset the agent is reading in real time.
 * 6. Context-aware Quick Prompts tailored to the active tab (`Home`, `Markets`, `Portfolio`, `System`).
 * 7. 1-click Copy button on AI responses + `Esc` key to close the drawer.
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
  const [copiedIdx, setCopiedIdx] = useState(null);

  const scrollRef = useRef(null);
  const latestUserTurnRef = useRef(null);
  const textareaRef = useRef(null);

  const greetingText = getAgentGreeting();
  const quickPrompts = getContextualQuickPrompts({
    activeTab,
    marketsViewMode,
    selectedAsset,
  });
  const contextPillText = getLiveContextPillLabel({
    activeTab,
    marketsViewMode,
    selectedAsset,
  });

  // Close drawer on Escape key
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Anchor the latest turn at the very top of the scroll container so only the latest turn is visible (scroll UP for older turns)
  useEffect(() => {
    if (!isOpen) return;
    if (thread.length === 0) {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
      return;
    }
    const rafId = window.requestAnimationFrame(() => {
      if (latestUserTurnRef.current && scrollRef.current) {
        scrollRef.current.scrollTo({
          top: latestUserTurnRef.current.offsetTop,
          behavior: 'smooth',
        });
      }
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [thread, isThinking, isOpen]);

  // Auto-resize multiline textarea height (1 to 5 lines)
  const syncTextareaHeight = (el) => {
    if (!el) return;
    if (!el.value) {
      el.style.height = '36px';
      return;
    }
    el.style.height = '36px';
    el.style.height = `${Math.min(el.scrollHeight, 116)}px`;
  };

  if (!isOpen) return null;

  const handleResetChat = () => {
    setThread([]);
    setInputMsg('');
    setCopiedIdx(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = '36px';
    }
  };

  const handleCopyMessage = (text, idx) => {
    const clean = String(text || '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(clean).catch(() => {});
    }
    setCopiedIdx(idx);
    setTimeout(() => {
      setCopiedIdx((prev) => (prev === idx ? null : prev));
    }, 1600);
  };

  const handleSend = async (rawText) => {
    const clean = String(rawText || '').trim();
    if (!clean || isThinking) return;

    const nextHistory = [...thread, { role: 'user', txt: clean }];
    setThread(nextHistory);
    setInputMsg('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '36px';
    }
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

  // Group thread into chronological turns [ { userMsg, aiMsg, aiIdx } ] (top to bottom)
  const turns = [];
  for (let i = 0; i < thread.length; i += 1) {
    const m = thread[i];
    if (m.role === 'user') {
      const next = thread[i + 1];
      if (next && next.role === 'ai') {
        turns.push({ userMsg: m.txt, aiMsg: next.txt, aiIdx: i + 1 });
        i += 1;
      } else {
        turns.push({ userMsg: m.txt, aiMsg: null, aiIdx: -1 });
      }
    } else {
      turns.push({ userMsg: null, aiMsg: m.txt, aiIdx: i });
    }
  }

  return (
    <aside
      aria-label={tx('Guía de la Plataforma', 'Platform Guide')}
      style={{
        position: 'fixed',
        top: '44px',
        bottom: '36px',
        right: '12px',
        width: 'min(410px, calc(100vw - 24px))',
        zIndex: 95,
        backgroundColor: 'rgba(7, 11, 20, 0.96)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.24)',
        borderRadius: '12px',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.82)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        color: '#f8fafc',
      }}
    >
      {/* Header + Live Context Pill + New Chat / Close */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
          paddingBottom: '9px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '999px',
                backgroundColor: 'var(--ui-accent, #10b981)',
                boxShadow: '0 0 10px var(--ui-accent, #10b981)',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
              {tx('Agente Guía', 'Guide Agent')}
            </span>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#94a3b8',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              paddingLeft: '15px',
            }}
          >
            {contextPillText}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {thread.length > 0 && (
            <button
              type="button"
              onClick={handleResetChat}
              title={tx('Empezar un chat nuevo de cero', 'Start a fresh chat from scratch')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(148, 163, 184, 0.24)',
                borderRadius: '6px',
                color: '#cbd5e1',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 8px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--ui-accent, #10b981)';
                e.currentTarget.style.color = 'var(--ui-accent, #10b981)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.24)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              <RotateCcw size={11} />
              <span>{tx('Nuevo chat', 'New chat')}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            title={tx('Cerrar (Esc)', 'Close (Esc)')}
            aria-label={tx('Cerrar agente', 'Close agent')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Conversation Thread — Top-Anchored Latest Turn */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '9px',
          paddingRight: '3px',
          position: 'relative',
        }}
      >
        {/* Minimal 1-line greeting + Contextual Quick Prompts (shown at start before chatting) */}
        {thread.length === 0 && (
          <>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.45)',
                border: '1px solid rgba(148, 163, 184, 0.16)',
                fontSize: '12.6px',
                color: '#e2e8f0',
                lineHeight: 1.5,
              }}
            >
              {greetingText}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  paddingLeft: '2px',
                }}
              >
                {tx('Sugerencias para esta pantalla', 'Suggestions for this screen')}
              </span>
              {quickPrompts.map((qItem) => {
                const lbl = qItem.label();
                return (
                  <button
                    key={qItem.id}
                    type="button"
                    onClick={() => handleSend(qItem.prompt())}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '7px',
                      border: '1px solid rgba(148, 163, 184, 0.22)',
                      background: 'rgba(15, 23, 42, 0.55)',
                      color: '#e2e8f0',
                      fontSize: '11.8px',
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
          </>
        )}

        {turns.map((turn, tIdx) => {
          const isLatestTurn = tIdx === turns.length - 1;
          const userStr = String(turn.userMsg || '');
          const hasLongUnbrokenToken = /\S{30,}/.test(userStr) && !userStr.includes(' ');
          return (
            <div
              key={tIdx}
              ref={isLatestTurn ? latestUserTurnRef : null}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: '8px',
                flexShrink: 0,
                minHeight: isLatestTurn ? '100%' : 'auto',
                paddingBottom: !isLatestTurn ? '10px' : '4px',
                borderBottom: !isLatestTurn ? '1px dashed rgba(148, 163, 184, 0.14)' : 'none',
              }}
            >
              {turn.userMsg && (
                <div
                  style={{
                    flexShrink: 0,
                    padding: '8px 11px',
                    borderRadius: '8px',
                    background: 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.14)',
                    border: '1px solid rgba(var(--ui-accent-rgb, 16, 185, 129), 0.55)',
                    fontSize: '12.5px',
                    color: '#e2e8f0',
                    lineHeight: 1.5,
                    alignSelf: 'flex-end',
                    maxWidth: '92%',
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      overflow: hasLongUnbrokenToken ? 'hidden' : 'visible',
                      textOverflow: hasLongUnbrokenToken ? 'ellipsis' : 'clip',
                      whiteSpace: hasLongUnbrokenToken ? 'nowrap' : 'normal',
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                    }}
                  >
                    {renderFormattedMessage(turn.userMsg)}
                  </div>
                </div>
              )}

              {turn.aiMsg && (
                <div
                  style={{
                    position: 'relative',
                    flexShrink: 0,
                    padding: '10px 30px 10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.52)',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    fontSize: '12.5px',
                    color: '#e2e8f0',
                    lineHeight: 1.54,
                    alignSelf: 'stretch',
                    maxWidth: '100%',
                    minWidth: 0,
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(turn.aiMsg, turn.aiIdx)}
                    title={tx('Copiar respuesta', 'Copy response')}
                    aria-label={tx('Copiar respuesta', 'Copy response')}
                    style={{
                      position: 'absolute',
                      top: '7px',
                      right: '7px',
                      background: 'transparent',
                      border: 'none',
                      color: copiedIdx === turn.aiIdx ? 'var(--ui-accent, #10b981)' : '#64748b',
                      cursor: 'pointer',
                      padding: '3px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                    }}
                  >
                    {copiedIdx === turn.aiIdx ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                  {renderFormattedMessage(turn.aiMsg)}
                </div>
              )}

              {isLatestTurn && !turn.aiMsg && isThinking && (
                <div
                  style={{
                    flexShrink: 0,
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.35)',
                    border: '1px solid rgba(148, 163, 184, 0.14)',
                    fontSize: '11.8px',
                    color: '#94a3b8',
                    fontStyle: 'italic',
                  }}
                >
                  {tx('Pensando...', 'Thinking...')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Multiline Auto-Expanding Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputMsg);
        }}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '6px',
          paddingTop: '4px',
          flexShrink: 0,
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputMsg}
          onChange={(e) => {
            setInputMsg(e.target.value);
            syncTextareaHeight(e.target);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(inputMsg);
            }
          }}
          maxLength={500}
          placeholder={tx('Escribí tu consulta...', 'Ask anything...')}
          style={{
            flex: 1,
            resize: 'none',
            overflowY: inputMsg.length > 70 ? 'auto' : 'hidden',
            overflowX: 'hidden',
            height: '36px',
            minHeight: '36px',
            maxHeight: '116px',
            lineHeight: '20px',
            background: 'rgba(15, 23, 42, 0.68)',
            border: '1px solid rgba(148, 163, 184, 0.28)',
            borderRadius: '8px',
            padding: '7px 11px',
            color: '#f8fafc',
            fontSize: '12.3px',
            fontFamily: 'inherit',
            outline: 'none',
             boxSizing: 'border-box',
          }}
        />
        <button
          type="submit"
          aria-label={tx('Enviar consulta', 'Send query')}
          style={{
            height: '36px',
            padding: '0 12px',
            borderRadius: '8px',
            border: '1px solid var(--ui-accent, #10b981)',
            background: 'rgba(var(--ui-accent-rgb, 16, 185, 129), 0.16)',
            color: 'var(--ui-accent, #10b981)',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Send size={13} />
        </button>
      </form>
    </aside>
  );
}
