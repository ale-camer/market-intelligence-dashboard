import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Palette, Info, X, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import HoverTooltip from './HoverTooltip';
import { LANGUAGES } from '../data/i18n';

/**
 * Universal crisp inline SVG Flag Badge supporting all 56 languages/countries
 * so flags always render in vibrant color on Linux / Chrome.
 */
export function FlagBadge({ lang, width = 22, height = 15 }) {
  const spec = lang?.flagSpec || { type: 'us', colors: ['#B22234', '#FFFFFF', '#3C3B6E'] };
  const [c1, c2, c3] = spec.colors;
  const baseStyle = {
    borderRadius: '3px',
    overflow: 'hidden',
    flexShrink: 0,
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.2)',
    display: 'inline-block',
  };

  if (spec.type === 'br') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" style={baseStyle}>
        <rect width="24" height="16" fill={c1} />
        <polygon points="12,2.2 21.5,8 12,13.8 2.5,8" fill={c2} />
        <circle cx="12" cy="8" r="3.3" fill={c3} />
      </svg>
    );
  }
  if (spec.type === 'v3') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" style={baseStyle}>
        <rect width="8" height="16" fill={c1} />
        <rect x="8" width="8" height="16" fill={c2} />
        <rect x="16" width="8" height="16" fill={c3} />
      </svg>
    );
  }
  if (spec.type === 'h3') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" style={baseStyle}>
        <rect width="24" height="5.34" fill={c1} />
        <rect y="5.33" width="24" height="5.34" fill={c2} />
        <rect y="10.66" width="24" height="5.34" fill={c3} />
      </svg>
    );
  }
  if (spec.type === 'h2') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" style={baseStyle}>
        <rect width="24" height="8" fill={c1} />
        <rect y="8" width="24" height="8" fill={c2} />
      </svg>
    );
  }
  if (spec.type === 'cross') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" style={baseStyle}>
        <rect width="24" height="16" fill={c1} />
        <rect x="7" width="3.2" height="16" fill={c2} />
        <rect y="6.4" width="24" height="3.2" fill={c2} />
      </svg>
    );
  }
  if (spec.type === 'circle') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 16" style={baseStyle}>
        <rect width="24" height="16" fill={c1} />
        <circle cx="12" cy="8" r="4.3" fill={c2} />
      </svg>
    );
  }
  // Default: US Flag
  return (
    <svg width={width} height={height} viewBox="0 0 24 16" style={baseStyle}>
      <rect width="24" height="16" fill="#B22234" />
      <rect y="2.3" width="24" height="2.2" fill="#FFFFFF" />
      <rect y="6.8" width="24" height="2.2" fill="#FFFFFF" />
      <rect y="11.3" width="24" height="2.2" fill="#FFFFFF" />
      <rect width="10.5" height="8.8" fill="#3C3B6E" />
      <circle cx="3" cy="2.5" r="0.7" fill="#FFFFFF" />
      <circle cx="5.5" cy="2.5" r="0.7" fill="#FFFFFF" />
      <circle cx="8" cy="2.5" r="0.7" fill="#FFFFFF" />
      <circle cx="4.2" cy="4.5" r="0.7" fill="#FFFFFF" />
      <circle cx="6.8" cy="4.5" r="0.7" fill="#FFFFFF" />
      <circle cx="3" cy="6.5" r="0.7" fill="#FFFFFF" />
      <circle cx="5.5" cy="6.5" r="0.7" fill="#FFFFFF" />
      <circle cx="8" cy="6.5" r="0.7" fill="#FFFFFF" />
    </svg>
  );
}

export default function FooterBar({
  t,
  isSystemHealthy,
  currentLang,
  currentTheme,
  activeTab,
  onOpenObservability,
  onToggleGuide,
  onToggleDevLab,
  onCycleLang,
  onSelectLang,
  onCycleTheme,
}) {
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [langSearchQuery, setLangSearchQuery] = useState('');
  const [kbIdx, setKbIdx] = useState(0);
  const searchInputRef = useRef(null);

  // Filter the 56 languages by original/native name, English name, region, or ISO code
  const filteredLanguages = useMemo(() => {
    const q = langSearchQuery.trim().toLowerCase();
    return LANGUAGES.map((lang, originalIdx) => ({ ...lang, originalIdx })).filter((lang) => {
      if (!q) return true;
      return (
        lang.nativeName.toLowerCase().includes(q) ||
        lang.name.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        lang.region.toLowerCase().includes(q)
      );
    });
  }, [langSearchQuery]);

  useEffect(() => {
    if (!langModalOpen) return undefined;
    setLangSearchQuery('');
    setDropdownOpen(true);
    setKbIdx(0);
    const timer = setTimeout(() => {
      if (searchInputRef.current) searchInputRef.current.focus();
    }, 40);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLangModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [langModalOpen]);

  const handleChooseLanguage = (langObj) => {
    if (!langObj) return;
    if (onSelectLang) {
      onSelectLang(langObj.originalIdx);
    } else if (onCycleLang) {
      onCycleLang();
    }
    setLangModalOpen(false);
  };

  return (
    <>
      {/* CENTERED SCREEN MODAL FOR 56-LANGUAGE SEARCHABLE DROPDOWN */}
      {langModalOpen && (
        <div
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setLangModalOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(4, 7, 14, 0.76)',
            backdropFilter: 'blur(9px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 250,
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              width: '540px',
              maxWidth: '100%',
              borderRadius: '22px',
              backgroundColor: 'rgba(10, 15, 26, 0.98)',
              border: '1px solid rgba(16, 185, 129, 0.42)',
              boxShadow: '0 28px 70px rgba(0, 0, 0, 0.85), 0 0 32px rgba(16, 185, 129, 0.18)',
              padding: '1.35rem 1.45rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.95rem',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.04rem', fontWeight: 800, color: '#ffffff' }}>
                    {t.langModalTitle || 'Select Interface Language'}
                  </span>
                  <span
                    className="mono-metric"
                    style={{
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      padding: '0.14rem 0.55rem',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(16, 185, 129, 0.16)',
                      border: '1px solid rgba(16, 185, 129, 0.38)',
                      color: '#10b981',
                    }}
                  >
                    {LANGUAGES.length} LANGUAGES
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.24rem', lineHeight: 1.45 }}>
                  {t.langModalSub ||
                    'Type the language in its original script (e.g. Español, English, Deutsch, 日本語) or choose from the dropdown menu.'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLangModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: 'var(--text-muted)',
                  borderRadius: '10px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Active Language Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.28)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FlagBadge lang={currentLang} width={24} height={16} />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>
                    {currentLang.nativeName}{' '}
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      ({currentLang.name} • {currentLang.region})
                    </span>
                  </div>
                </div>
              </div>
              <span className="mono-metric" style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981' }}>
                ACTIVE • {currentLang.code}
              </span>
            </div>

            {/* SEARCHABLE COMBOBOX / DROPDOWN MENU */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  backgroundColor: 'rgba(6, 10, 18, 0.92)',
                  border: '1.5px solid #10b981',
                  borderRadius: '14px',
                  padding: '0.58rem 0.85rem',
                  boxShadow: '0 0 16px rgba(16, 185, 129, 0.15)',
                }}
              >
                <Search size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={langSearchQuery}
                  onFocus={() => setDropdownOpen(true)}
                  onChange={(e) => {
                    setLangSearchQuery(e.target.value);
                    setDropdownOpen(true);
                    setKbIdx(0);
                  }}
                  onKeyDown={(e) => {
                    if (!filteredLanguages.length) return;
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setDropdownOpen(true);
                      setKbIdx((prev) => (prev + 1) % filteredLanguages.length);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setDropdownOpen(true);
                      setKbIdx((prev) => (prev - 1 + filteredLanguages.length) % filteredLanguages.length);
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      const chosen = filteredLanguages[kbIdx] || filteredLanguages[0];
                      if (chosen) handleChooseLanguage(chosen);
                    }
                  }}
                  placeholder={
                    t.langSearchPlaceholder ||
                    'Type language in original script (e.g. Español, Français, Deutsch, 日本語, العربية)...'
                  }
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
                {langSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setLangSearchQuery('');
                      setKbIdx(0);
                      if (searchInputRef.current) searchInputRef.current.focus();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#10b981',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                  }}
                >
                  {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* DROPDOWN MENU LIST */}
              {dropdownOpen && (
                <div
                  style={{
                    maxHeight: '295px',
                    overflowY: 'auto',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(6, 10, 18, 0.94)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '0.38rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                  }}
                >
                  {filteredLanguages.length === 0 ? (
                    <div
                      className="mono-metric"
                      style={{ padding: '0.85rem', textAlign: 'center', fontSize: '0.73rem', color: 'var(--text-dim)' }}
                    >
                      No matching language found for "{langSearchQuery}"
                    </div>
                  ) : (
                    filteredLanguages.map((lang, idx) => {
                      const isSelected = currentLang.code === lang.code;
                      const isKbHighlighted = idx === kbIdx;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onMouseEnter={() => setKbIdx(idx)}
                          onClick={() => handleChooseLanguage(lang)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            padding: '0.52rem 0.75rem',
                            borderRadius: '10px',
                            backgroundColor: isSelected
                              ? 'rgba(16, 185, 129, 0.2)'
                              : isKbHighlighted
                              ? 'rgba(255, 255, 255, 0.07)'
                              : 'transparent',
                            border: isSelected
                              ? '1px solid #10b981'
                              : isKbHighlighted
                              ? '1px solid rgba(255, 255, 255, 0.16)'
                              : '1px solid transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background-color 0.12s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', minWidth: 0 }}>
                            <FlagBadge lang={lang} width={24} height={16} />
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.83rem', fontWeight: 800, color: '#ffffff' }}>
                                {lang.nativeName}
                              </span>
                              <span style={{ fontSize: '0.69rem', color: 'var(--text-muted)' }}>
                                {lang.name} • {lang.region}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                            <span
                              className="mono-metric"
                              style={{
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                padding: '0.1rem 0.42rem',
                                borderRadius: '999px',
                                backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.22)' : 'rgba(255, 255, 255, 0.06)',
                                color: isSelected ? '#10b981' : 'var(--text-dim)',
                              }}
                            >
                              {lang.code}
                            </span>
                            {isSelected && <Check size={14} style={{ color: '#10b981' }} />}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                  backgroundColor:
                    activeTab === 'observability' || isHovered
                      ? 'rgba(16, 185, 129, 0.16)'
                      : 'rgba(10, 14, 23, 0.72)',
                  backdropFilter: 'blur(10px)',
                  border:
                    activeTab === 'observability' || isHovered
                      ? `1px solid ${isSystemHealthy ? '#10b981' : '#ef4444'}`
                      : isSystemHealthy
                      ? '1px solid rgba(16, 185, 129, 0.35)'
                      : '1px solid rgba(239, 68, 68, 0.35)',
                  color: activeTab === 'observability' || isHovered ? '#ffffff' : 'var(--text-main)',
                  height: '28px',
                  padding: '0 0.7rem',
                  borderRadius: '6px',
                  fontSize: '0.71rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  boxShadow:
                    activeTab === 'observability' || isHovered
                      ? '0 0 14px rgba(16, 185, 129, 0.28), 0 4px 14px rgba(0, 0, 0, 0.45)'
                      : '0 4px 14px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '0.78rem', lineHeight: 1 }}>{isSystemHealthy ? '🟢' : '🔴'}</span>
                <span>{t.navTelemetry}</span>
              </button>
            )}
          </HoverTooltip>

          {/* APP EXPLANATION & USER GUIDE PLACEHOLDER ICON IN FOOTER */}
          <HoverTooltip
            title={t.aboutTitle}
            description={t.aboutDesc}
            hint={t.aboutHint}
            badge="GUIDE • 13 REPOS"
            placement="top-left"
          >
            {(isHovered) => (
              <button
                onClick={onToggleGuide}
                style={{
                  backgroundColor:
                    activeTab === 'guide' || isHovered
                      ? 'rgba(16, 185, 129, 0.16)'
                      : 'rgba(10, 14, 23, 0.72)',
                  backdropFilter: 'blur(10px)',
                  border:
                    activeTab === 'guide' || isHovered
                      ? '1px solid var(--accent)'
                      : '1px solid var(--border-light)',
                  color: activeTab === 'guide' || isHovered ? '#ffffff' : 'var(--text-dim)',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow:
                    activeTab === 'guide' || isHovered
                      ? '0 0 14px rgba(16, 185, 129, 0.25), 0 4px 14px rgba(0, 0, 0, 0.45)'
                      : '0 4px 14px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Info size={14} strokeWidth={2.2} style={{ color: activeTab === 'guide' || isHovered ? 'var(--accent)' : 'var(--text-muted)' }} />
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

        {/* BOTTOM-RIGHT: LANGUAGE MODAL TRIGGER & COLOR PALETTE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'auto' }}>
          {/* LANGUAGE SELECTOR BUTTON WITH FLAG ON THE LEFT */}
          <HoverTooltip
            title={t.langTitle}
            description={t.langDesc}
            hint={t.langHint}
            badge={`${currentLang.nativeName || currentLang.name} (${currentLang.code})`}
            placement="top-right"
          >
            {(isHovered) => (
              <button
                onClick={() => setLangModalOpen((prev) => !prev)}
                style={{
                  backgroundColor:
                    langModalOpen || isHovered ? 'rgba(16, 185, 129, 0.16)' : 'rgba(10, 14, 23, 0.72)',
                  backdropFilter: 'blur(10px)',
                  border:
                    langModalOpen || isHovered ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                  color: langModalOpen || isHovered ? '#ffffff' : 'var(--text-main)',
                  height: '28px',
                  padding: '0 0.62rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.42rem',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  boxShadow:
                    langModalOpen || isHovered
                      ? '0 0 14px rgba(16, 185, 129, 0.25), 0 4px 14px rgba(0, 0, 0, 0.45)'
                      : '0 4px 14px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                <FlagBadge lang={currentLang} width={17} height={12} />
                <span className="mono-metric" style={{ color: 'var(--accent)', letterSpacing: '0.05em', fontWeight: 800 }}>
                  {currentLang.code}
                </span>
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
    </>
  );
}
