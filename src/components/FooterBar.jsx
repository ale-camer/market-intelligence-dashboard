import React from 'react';
import { ExternalLink, Globe, Palette, Info } from 'lucide-react';
import HoverTooltip from './HoverTooltip';

export default function FooterBar({
  t,
  isSystemHealthy,
  currentLang,
  currentTheme,
  activeTab,
  onOpenObservability,
  onToggleDevLab,
  onCycleLang,
  onCycleTheme,
}) {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        borderTop: 'none',
        padding: '0.65rem 1.35rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--text-dim)',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {/* BOTTOM-LEFT: PIPELINE & SYSTEM OBSERVABILITY LINK + APP OVERVIEW INFO ICON */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'auto' }}>
        <HoverTooltip
          title={isSystemHealthy ? t.statusOkTitle : t.statusErrTitle}
          description={isSystemHealthy ? t.statusOkDesc : t.statusErrDesc}
          hint={t.statusHint}
          badge={isSystemHealthy ? '99.98% OK' : 'DEGRADED'}
          statusColor={isSystemHealthy ? '#10b981' : '#ef4444'}
          placement="top-left"
        >
          {(isHovered) => (
            <button
              onClick={onOpenObservability}
              style={{
                backgroundColor: isHovered ? 'rgba(16, 185, 129, 0.14)' : 'rgba(10, 14, 23, 0.72)',
                backdropFilter: 'blur(10px)',
                border: isHovered
                  ? `1px solid ${isSystemHealthy ? '#10b981' : '#ef4444'}`
                  : isSystemHealthy
                  ? '1px solid rgba(16, 185, 129, 0.35)'
                  : '1px solid rgba(239, 68, 68, 0.35)',
                color: isHovered ? '#ffffff' : 'var(--text-main)',
                height: '28px',
                padding: '0 0.7rem',
                borderRadius: '6px',
                fontSize: '0.71rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                boxShadow: isHovered
                  ? '0 0 14px rgba(16, 185, 129, 0.28), 0 4px 14px rgba(0, 0, 0, 0.45)'
                  : '0 4px 14px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '0.78rem', lineHeight: 1 }}>{isSystemHealthy ? '🟢' : '🔴'}</span>
              <span>{t.navTelemetry}</span>
              <ExternalLink size={12} strokeWidth={2.2} style={{ color: 'var(--accent)' }} />
            </button>
          )}
        </HoverTooltip>

        {/* APP EXPLANATION ICON IN FOOTER */}
        <HoverTooltip
          title={t.aboutTitle}
          description={t.aboutDesc}
          hint={t.aboutHint}
          badge="P-01 .. P-11"
          placement="top-left"
        >
          {(isHovered) => (
            <button
              style={{
                backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(10, 14, 23, 0.72)',
                backdropFilter: 'blur(10px)',
                border: isHovered ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                color: isHovered ? '#ffffff' : 'var(--text-dim)',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'help',
                boxShadow: isHovered
                  ? '0 0 14px rgba(16, 185, 129, 0.25), 0 4px 14px rgba(0, 0, 0, 0.45)'
                  : '0 4px 14px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              <Info size={14} strokeWidth={2.2} style={{ color: isHovered ? 'var(--accent)' : 'var(--text-muted)' }} />
            </button>
          )}
        </HoverTooltip>

        {/* DEV LAB SANDBOX BUTTON */}
        {onToggleDevLab && (
          <button
            onClick={onToggleDevLab}
            className="mono-metric"
            style={{
              backgroundColor: activeTab === 'devlab' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(10, 14, 23, 0.72)',
              backdropFilter: 'blur(10px)',
              border: activeTab === 'devlab' ? '1px solid #10b981' : '1px solid var(--border-light)',
              color: activeTab === 'devlab' ? '#10b981' : 'var(--text-muted)',
              height: '28px',
              padding: '0 0.65rem',
              borderRadius: '6px',
              fontSize: '0.64rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>DEV</span>
          </button>
        )}
      </div>

      {/* BOTTOM-RIGHT: LANGUAGE & COLOR PALETTE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'auto' }}>
        {/* LANGUAGE SELECTOR BUTTON */}
        <HoverTooltip
          title={t.langTitle}
          description={t.langDesc}
          hint={t.langHint}
          badge={currentLang.name.toUpperCase()}
          placement="top-right"
        >
          {(isHovered) => (
            <button
              onClick={onCycleLang}
              style={{
                backgroundColor: isHovered ? 'rgba(16, 185, 129, 0.14)' : 'rgba(10, 14, 23, 0.72)',
                backdropFilter: 'blur(10px)',
                border: isHovered ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                color: isHovered ? '#ffffff' : 'var(--text-main)',
                height: '28px',
                padding: '0 0.55rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 700,
                boxShadow: isHovered
                  ? '0 0 14px rgba(16, 185, 129, 0.25), 0 4px 14px rgba(0, 0, 0, 0.45)'
                  : '0 4px 14px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              <Globe size={14} strokeWidth={2.2} style={{ color: isHovered ? 'var(--accent)' : 'var(--text-dim)' }} />
              <span style={{ color: 'var(--accent)', letterSpacing: '0.05em' }}>{currentLang.code}</span>
            </button>
          )}
        </HoverTooltip>

        {/* THEME COLOR PALETTE BUTTON */}
        <HoverTooltip
          title={t.paletteTitle}
          description={t.paletteDesc}
          hint={t.paletteHint}
          badge={currentTheme.name}
          statusColor={currentTheme.color}
          placement="top-right"
        >
          {(isHovered) => (
            <button
              onClick={onCycleTheme}
              style={{
                backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(10, 14, 23, 0.72)',
                backdropFilter: 'blur(10px)',
                border: isHovered ? `1px solid ${currentTheme.color}` : '1px solid var(--border-light)',
                color: 'var(--text-main)',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                boxShadow: isHovered
                  ? `0 0 14px ${currentTheme.color}44, 0 4px 14px rgba(0, 0, 0, 0.45)`
                  : '0 4px 14px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              <Palette size={15} strokeWidth={2.2} color={currentTheme.color} />
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: currentTheme.color,
                }}
              />
            </button>
          )}
        </HoverTooltip>
      </div>
    </footer>
  );
}
