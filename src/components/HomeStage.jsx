import React, { useState } from 'react';
import { X } from 'lucide-react';
import WebbDeepFieldCanvas from './WebbDeepFieldCanvas';
import HoverTooltip from './HoverTooltip';

export default function HomeStage({ isHome, langCode, navItems, t }) {
  const [selectedHomeInfo, setSelectedHomeInfo] = useState(null);

  return (
    <div
      style={{
        display: isHome ? 'block' : 'none',
        position: 'relative',
        flex: 1,
        width: '100%',
        height: '100%',
        minHeight: 0,
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}
    >
      <WebbDeepFieldCanvas isPaused={!isHome} lang={langCode} />

      {/* SPIRIT OF THE APP & INTERACTIVE EXPLANATORY PILLS */}
      <div
        style={{
          position: 'absolute',
          top: '11.5%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
          textAlign: 'center',
          width: '90%',
          maxWidth: '740px',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.82)',
            lineHeight: 1.6,
            fontWeight: 400,
            letterSpacing: '0.01em',
            margin: 0,
          }}
        >
          {t.homeBrief}
        </p>

        <div
          style={{
            marginTop: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            pointerEvents: 'auto',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedHomeInfo === item.id;
            return (
              <HoverTooltip
                key={item.id}
                title={item.label}
                hint={t.hoverMore}
                placement="top"
                disabled={isSelected}
              >
                {(isHovered) => (
                  <button
                    onClick={() => setSelectedHomeInfo(isSelected ? null : item.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.38rem',
                      padding: '0.34rem 0.78rem',
                      borderRadius: '999px',
                      backgroundColor: isSelected
                        ? 'rgba(16, 185, 129, 0.18)'
                        : isHovered
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border:
                        isSelected || isHovered
                          ? '1px solid var(--accent)'
                          : '1px solid rgba(255, 255, 255, 0.12)',
                      color: isSelected || isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                      fontSize: '0.73rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      backdropFilter: 'blur(6px)',
                      boxShadow: isSelected || isHovered ? '0 0 12px rgba(16, 185, 129, 0.25)' : 'none',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <Icon size={12} strokeWidth={2.2} style={{ color: 'var(--accent)' }} />
                    <span>{item.label}</span>
                  </button>
                )}
              </HoverTooltip>
            );
          })}
        </div>

        {/* BRIEF EXPLANATION POPOVER WHEN CLICKED */}
        {selectedHomeInfo && (
          <div
            style={{
              marginTop: '0.85rem',
              marginInline: 'auto',
              maxWidth: '580px',
              backgroundColor: 'rgba(10, 14, 23, 0.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--accent)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '0.75rem',
              textAlign: 'left',
              pointerEvents: 'auto',
              boxShadow: '0 10px 28px rgba(0, 0, 0, 0.6)',
            }}
          >
            <p
              style={{
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.88)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {t.objInfo[selectedHomeInfo]}
            </p>
            <button
              onClick={() => setSelectedHomeInfo(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.45)',
                cursor: 'pointer',
                padding: '0.1rem',
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

