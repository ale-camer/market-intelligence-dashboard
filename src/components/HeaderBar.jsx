import React from 'react';
import { Activity, ArrowLeft } from 'lucide-react';
import HoverTooltip from './HoverTooltip';
import { DEV_ICON_CATALOG, DEV_BOX_STYLES } from './DevLabView';

export default function HeaderBar({
  activeTab,
  navItems,
  t,
  onNavigate,
  onGoBack,
  devIconId = 'lambda08-h-chiseled-nib',
  devBoxStyleId = 'free-green',
}) {
  const activeIconObj = DEV_ICON_CATALOG.find((i) => i.id === devIconId) || DEV_ICON_CATALOG[0];
  const activeBoxObj = DEV_BOX_STYLES.find((b) => b.id === devBoxStyleId) || DEV_BOX_STYLES[0];
  const isBorderless = activeBoxObj.id === 'free-green';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        borderBottom: 'none',
        padding: '0.85rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {/* LEFT: LOGO ONLY (HOME) — STRICT RULE: ONLY THE λ SYMBOL, NEVER ANY TEXT NEXT TO IT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <HoverTooltip
          title={t.navHome}
          description={t.navHomeDesc}
          hint={t.navHomeHint}
          badge="HOME"
          placement="bottom-left"
        >
          {(isHovered) => (
            <div
              onClick={() => onNavigate('presentation')}
              style={{
                width: isBorderless ? '34px' : '30px',
                height: isBorderless ? '34px' : '30px',
                borderRadius: '6px',
                backgroundColor: activeBoxObj.bg,
                border: isBorderless
                  ? 'none'
                  : isHovered
                  ? '1px solid #ffffff'
                  : activeBoxObj.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontWeight: 800,
                cursor: 'pointer',
                pointerEvents: 'auto',
                transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                boxShadow: isBorderless
                  ? 'none'
                  : isHovered
                  ? '0 0 16px var(--accent), 0 4px 14px rgba(0, 0, 0, 0.55)'
                  : '0 4px 14px rgba(0, 0, 0, 0.45)',
                filter: isBorderless
                  ? isHovered
                    ? 'drop-shadow(0 0 10px var(--accent))'
                    : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.65))'
                  : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {activeIconObj ? (
                activeIconObj.renderSvg(
                  isBorderless ? (isHovered ? '#ffffff' : 'var(--accent)') : activeBoxObj.strokeColor,
                  isBorderless ? 32 : 17
                )
              ) : (
                <Activity size={17} strokeWidth={2.5} />
              )}
            </div>
          )}
        </HoverTooltip>
      </div>

      {/* CENTER TOP MENU: TRADINGVIEW-STYLE CLEAN TEXT PILLS (NO ICONS, NO BOX CONTAINER) */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          pointerEvents: 'auto',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <HoverTooltip
              key={item.id}
              title={item.label}
              description={t.objInfo[item.id]}
              hint={t.navOpenHint}
              placement="bottom"
            >
              {(isHovered) => (
                <button
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.44rem 1.05rem',
                    borderRadius: '999px',
                    border: 'none',
                    backgroundColor: isActive
                      ? 'rgba(255, 255, 255, 0.16)'
                      : isHovered
                      ? 'rgba(255, 255, 255, 0.11)'
                      : 'transparent',
                    color: isActive || isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.82)',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    cursor: 'pointer',
                    transition: 'background-color 0.18s ease, color 0.18s ease',
                  }}
                >
                  <span>{item.label}</span>
                </button>
              )}
            </HoverTooltip>
          );
        })}
      </nav>

      {/* RIGHT: CLEAN SPACER (OR BACK BUTTON WHEN IN STANDALONE OBSERVABILITY) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {activeTab === 'observability' && (
          <HoverTooltip title={t.backBtn} description={t.navHomeDesc} placement="bottom-right">
            {(isHovered) => (
              <button
                onClick={onGoBack}
                style={{
                  backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(10, 14, 23, 0.78)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowLeft size={14} strokeWidth={2.2} /> {t.backBtn}
              </button>
            )}
          </HoverTooltip>
        )}
      </div>
    </header>
  );
}
