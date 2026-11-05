import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Palette, Info, X, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import HoverTooltip from './HoverTooltip';
import { LANGUAGES, PALETTES } from '../data/i18n';

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
  onSelectTheme,
}) {
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [palettePopoverOpen, setPalettePopoverOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [langSearchQuery, setLangSearchQuery] = useState('');
  const [kbIdx, setKbIdx] = useState(0);
  const searchInputRef = useRef(null);
  const palettePopoverRef = useRef(null);
  const paletteBtnRef = useRef(null);
  const isES = currentLang?.code === 'ES';

  useEffect(() => {
    if (!palettePopoverOpen) return undefined;
    const handleOutsideClick = (e) => {
      if (
        palettePopoverRef.current &&
        !palettePopoverRef.current.contains(e.target) &&
        paletteBtnRef.current &&
        !paletteBtnRef.current.contains(e.target)
      ) {
        setPalettePopoverOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setPalettePopoverOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [palettePopoverOpen]);

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
      {/* CENTERED RESPONSIVE SCREEN MODAL FOR 56-LANGUAGE SEARCHABLE DROPDOWN */}
      {langModalOpen && (
        <div
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setLangModalOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(4, 7, 14, 0.78)',
            backdropFilter: 'blur(9px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(0.6rem, 2.5vw, 1.25rem)',
            zIndex: 250,
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              width: 'min(480px, 94vw)',
              maxHeight: 'min(82vh, 520px)',
              borderRadius: '18px',
              backgroundColor: 'rgba(10, 15, 26, 0.98)',
              border: '1px solid rgba(var(--ui-accent-rgb), 0.45)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 28px rgba(var(--ui-accent-rgb), 0.18)',
              padding: 'clamp(0.85rem, 2vw, 1.2rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.7rem',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.65rem', flexShrink: 0 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                    {t.langModalTitle || 'Select Interface Language'}
                  </span>
                  <span
                    className="mono-metric"
                    style={{
                      fontSize: '0.56rem',
                      fontWeight: 800,
                      padding: '0.12rem 0.5rem',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(var(--ui-accent-rgb), 0.16)',
                      border: '1px solid rgba(var(--ui-accent-rgb), 0.38)',
                      color: 'var(--ui-accent)',
                    }}
                  >
                    {LANGUAGES.length} LANGUAGES
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.18rem', lineHeight: 1.4 }}>
                  {t.langModalSub ||
                    'Type the language in its original script (e.g. Español, English, Deutsch, 日本語) or choose below.'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLangModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: 'var(--text-muted)',
                  borderRadius: '9px',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Active Language Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                flexWrap: 'wrap',
                padding: '0.45rem 0.75rem',
                borderRadius: '11px',
                backgroundColor: 'rgba(var(--ui-accent-rgb), 0.1)',
                border: '1px solid rgba(var(--ui-accent-rgb), 0.3)',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
                <FlagBadge lang={currentLang} width={22} height={15} />
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentLang.nativeName}{' '}
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    ({currentLang.name} • {currentLang.region})
                  </span>
                </div>
              </div>
              <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--ui-accent)' }}>
                ACTIVE • {currentLang.code}
              </span>
            </div>

            {/* SEARCHABLE COMBOBOX / DROPDOWN MENU */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(6, 10, 18, 0.92)',
                  border: '1.5px solid var(--ui-accent)',
                  borderRadius: '12px',
                  padding: '0.48rem 0.75rem',
                  boxShadow: '0 0 14px rgba(var(--ui-accent-rgb), 0.15)',
                  flexShrink: 0,
                }}
              >
                <Search size={14} style={{ color: 'var(--ui-accent)', flexShrink: 0 }} />
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
                    'Type language in original script (e.g. Español, Français, Deutsch, 日本語)...'
                  }
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '0.78rem',
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
                    color: 'var(--ui-accent)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                  }}
                >
                  {dropdownOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              </div>

              {/* DROPDOWN MENU LIST (FLEXIBLE HEIGHT TO FIT ANY VIEWPORT) */}
              {dropdownOpen && (
                <div
                  style={{
                    flex: 1,
                    minHeight: '120px',
                    overflowY: 'auto',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(6, 10, 18, 0.94)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '0.32rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.18rem',
                  }}
                >
                  {filteredLanguages.length === 0 ? (
                    <div
                      className="mono-metric"
                      style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-dim)' }}
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
                            gap: '0.6rem',
                            padding: '0.44rem 0.65rem',
                            borderRadius: '9px',
                            backgroundColor: isSelected
                              ? 'rgba(var(--ui-accent-rgb), 0.2)'
                              : isKbHighlighted
                              ? 'rgba(255, 255, 255, 0.07)'
                              : 'transparent',
                            border: isSelected
                              ? '1px solid var(--ui-accent)'
                              : isKbHighlighted
                              ? '1px solid rgba(255, 255, 255, 0.16)'
                              : '1px solid transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background-color 0.12s ease',
                            flexShrink: 0,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                            <FlagBadge lang={lang} width={22} height={15} />
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', flexWrap: 'wrap', minWidth: 0 }}>
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff' }}>
                                {lang.nativeName}
                              </span>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                {lang.name} • {lang.region}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                            <span
                              className="mono-metric"
                              style={{
                                fontSize: '0.6rem',
                                fontWeight: 800,
                                padding: '0.08rem 0.38rem',
                                borderRadius: '999px',
                                backgroundColor: isSelected ? 'rgba(var(--ui-accent-rgb), 0.22)' : 'rgba(255, 255, 255, 0.06)',
                                color: isSelected ? 'var(--ui-accent)' : 'var(--text-dim)',
                              }}
                            >
                              {lang.code}
                            </span>
                            {isSelected && <Check size={13} style={{ color: 'var(--ui-accent)' }} />}
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
          padding: '0.65rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.76rem',
          color: 'var(--ui-accent)',
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        {/* BOTTOM-LEFT: HOMOGENEOUS V010 SINGLE-WORD ITEMS (SYSTEM • GUIDE • DEV) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', pointerEvents: 'auto' }}>
          {/* 1. SYSTEM (ONE WORD, HOMOGENEOUS WITH GUIDE & DEV) */}
          <HoverTooltip disabled={true} placement="top-left">
            {(isHovered) => {
              const isHighlighted = activeTab === 'observability' || isHovered;
              return (
                <button
                  onClick={onOpenObservability}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: isHighlighted ? 'var(--ui-accent)' : 'rgba(var(--ui-accent-rgb), 0.78)',
                    height: '28px',
                    padding: '0 0.25rem',
                    fontSize: '0.76rem',
                    fontWeight: isHighlighted ? 700 : 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textShadow: isHighlighted
                      ? '0 0 12px rgba(var(--ui-accent-rgb), 0.95), 0 0 22px rgba(var(--ui-accent-rgb), 0.55)'
                      : '0 1px 4px rgba(0, 0, 0, 0.9)',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span>{t.navTelemetry || 'System'}</span>
                </button>
              );
            }}
          </HoverTooltip>

          {/* 2. GUIDE (ONE WORD, HOMOGENEOUS WITH SYSTEM) */}
          <HoverTooltip disabled={true} placement="top-left">
            {(isHovered) => {
              const isHighlighted = activeTab === 'guide' || isHovered;
              return (
                <button
                  onClick={onToggleGuide}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: isHighlighted ? 'var(--ui-accent)' : 'rgba(var(--ui-accent-rgb), 0.78)',
                    height: '28px',
                    padding: '0 0.25rem',
                    fontSize: '0.76rem',
                    fontWeight: isHighlighted ? 700 : 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textShadow: isHighlighted
                      ? '0 0 12px rgba(var(--ui-accent-rgb), 0.95), 0 0 22px rgba(var(--ui-accent-rgb), 0.55)'
                      : '0 1px 4px rgba(0, 0, 0, 0.9)',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span>{t.navGuide || 'Guide'}</span>
                </button>
              );
            }}
          </HoverTooltip>
        </div>

        {/* BOTTOM-RIGHT: HOMOGENEOUS V010 LANGUAGE & PALETTE CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', pointerEvents: 'auto' }}>
          {/* LANGUAGE SELECTOR BUTTON WITH FLAG ON THE LEFT */}
          <HoverTooltip disabled={true} placement="top-right">
            {(isHovered) => {
              const isHighlighted = langModalOpen || isHovered;
              return (
                <button
                  onClick={() => setLangModalOpen((prev) => !prev)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: isHighlighted ? 'var(--ui-accent)' : 'rgba(var(--ui-accent-rgb), 0.78)',
                    height: '28px',
                    padding: '0 0.25rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.42rem',
                    cursor: 'pointer',
                    fontSize: '0.76rem',
                    fontWeight: isHighlighted ? 700 : 600,
                    filter: isHighlighted ? 'drop-shadow(0 0 8px rgba(var(--ui-accent-rgb), 0.65))' : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <FlagBadge lang={currentLang} width={17} height={12} />
                  <span
                    style={{
                      color: isHighlighted ? 'var(--ui-accent)' : 'rgba(var(--ui-accent-rgb), 0.78)',
                      fontWeight: isHighlighted ? 700 : 600,
                      textShadow: isHighlighted
                        ? '0 0 12px rgba(var(--ui-accent-rgb), 0.95), 0 0 22px rgba(var(--ui-accent-rgb), 0.55)'
                        : '0 1px 4px rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    {currentLang.code}
                  </span>
                </button>
              );
            }}
          </HoverTooltip>

          {/* THEME COLOR PALETTE BUTTON + POPOVER SELECTOR */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            {palettePopoverOpen && (
              <div
                ref={palettePopoverRef}
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: '38px',
                  zIndex: 260,
                  width: '285px',
                  padding: '11px 13px',
                  borderRadius: '11px',
                  background: 'rgba(2, 6, 23, 0.96)',
                  border: '1px solid rgba(var(--ui-accent-rgb), 0.55)',
                  boxShadow: '0 14px 36px rgba(0, 0, 0, 0.88), 0 0 24px rgba(var(--ui-accent-rgb), 0.16)',
                  backdropFilter: 'blur(10px)',
                  pointerEvents: 'auto',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#ffffff' }}>
                    {isES ? '5 Ambientes de Lectura (Palette)' : '5 Visual Reading Themes (Palette)'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {PALETTES.map((pt, idx) => {
                    const isSelected = currentTheme?.id === pt.id;
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => {
                          if (onSelectTheme) {
                            onSelectTheme(idx);
                          } else if (onCycleTheme) {
                            onCycleTheme();
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '5px 9px',
                          borderRadius: '6px',
                          background: isSelected
                            ? 'rgba(var(--ui-accent-rgb), 0.22)'
                            : 'rgba(15, 23, 42, 0.72)',
                          border: isSelected
                            ? '1px solid var(--ui-accent)'
                            : '1px solid rgba(148, 163, 184, 0.14)',
                          fontSize: '11px',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.14s ease',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '999px',
                              backgroundColor: pt.color,
                              boxShadow: `0 0 6px ${pt.color}`,
                            }}
                          />
                          <span>{pt.name}</span>
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <span style={{ color: '#10b981' }}>▲#10b981</span>
                          <span style={{ color: '#f43f5e' }}>▼#f43f5e</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <HoverTooltip
              disabled={palettePopoverOpen}
              title={isES ? 'Elegir Paleta' : 'Choose Palette'}
              placement="top-right"
            >
              {(isHovered) => {
                const isHighlighted = palettePopoverOpen || isHovered;
                return (
                  <button
                    ref={paletteBtnRef}
                    onClick={() => setPalettePopoverOpen((prev) => !prev)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: isHighlighted ? 'var(--ui-accent)' : 'rgba(var(--ui-accent-rgb), 0.85)',
                      height: '28px',
                      padding: '0 0.25rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      filter: isHighlighted
                        ? 'drop-shadow(0 0 10px rgba(var(--ui-accent-rgb), 0.95)) drop-shadow(0 0 20px rgba(var(--ui-accent-rgb), 0.55))'
                        : 'drop-shadow(0 1px 4px rgba(0, 0, 0, 0.9))',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <Palette size={16} strokeWidth={isHighlighted ? 2.4 : 2.1} style={{ color: 'var(--ui-accent)' }} />
                  </button>
                );
              }}
            </HoverTooltip>
          </div>
        </div>
      </footer>
    </>
  );
}
