import React, { useState, useEffect } from 'react';
import { Activity, Sparkles } from 'lucide-react';
import HoverTooltip from './HoverTooltip';
import { DEV_ICON_CATALOG, DEV_BOX_STYLES } from './DevLabView';
import { HEADER_VARIANTS } from '../data/headerVariantsCatalog';

export function resolveHeaderVariant(variantId) {
  const defaultV010 = HEADER_VARIANTS.find((v) => v.id === 'v010') || HEADER_VARIANTS[0];
  if (!variantId) return defaultV010;
  const found = HEADER_VARIANTS.find((v) => v.id === variantId);
  if (found) return found;
  return defaultV010;
}

export function renderNavShellStyle(navShell) {
  switch (navShell) {
    case 'glass-emerald':
      return {
        padding: '0.24rem',
        borderRadius: '999px',
        backgroundColor: 'rgba(8, 13, 24, 0.84)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(16, 185, 129, 0.38)',
        boxShadow: '0 8px 26px rgba(0, 0, 0, 0.48)',
      };
    case 'glass-neutral':
      return {
        padding: '0.24rem',
        borderRadius: '999px',
        backgroundColor: 'rgba(10, 15, 28, 0.78)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
      };
    case 'obsidian-ring':
      return {
        padding: '0.24rem',
        borderRadius: '999px',
        backgroundColor: 'rgba(4, 6, 11, 0.94)',
        border: '1px solid rgba(255, 255, 255, 0.24)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
      };
    case 'chamfer-box':
      return {
        padding: '0.24rem 0.45rem',
        backgroundColor: 'rgba(8, 13, 24, 0.88)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)',
      };
    case 'double-bezel':
      return {
        padding: '0.26rem',
        borderRadius: '999px',
        backgroundColor: 'rgba(7, 11, 20, 0.9)',
        border: '1px solid rgba(16, 185, 129, 0.45)',
        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.12), 0 10px 28px rgba(0,0,0,0.55)',
      };
    case 'slim-glass':
      return {
        padding: '0.12rem 0.2rem',
        borderRadius: '999px',
        backgroundColor: 'rgba(8, 13, 24, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      };
    case 'emerald-tint-shell':
      return {
        padding: '0.26rem',
        borderRadius: '999px',
        backgroundColor: 'rgba(16, 185, 129, 0.11)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(16, 185, 129, 0.5)',
        boxShadow: '0 0 24px rgba(16, 185, 129, 0.18)',
      };
    case 'shared-bottom-track':
      return {
        padding: '0 0.2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
      };
    case 'wide-split-50-50':
      return {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minWidth: '340px',
        padding: '0.18rem',
        borderRadius: '10px',
        backgroundColor: 'rgba(8, 13, 24, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
      };
    case 'notch-rounded':
      return {
        padding: '0.38rem 0.95rem 0.44rem 0.95rem',
        borderRadius: '0 0 16px 16px',
        backgroundColor: 'rgba(8, 13, 24, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(16, 185, 129, 0.38)',
        borderTop: '2.5px solid #10b981',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.6)',
      };
    case 'notch-trapezoid':
      return {
        padding: '0.38rem 1.4rem 0.44rem 1.4rem',
        backgroundColor: 'rgba(7, 12, 22, 0.94)',
        borderTop: '2.5px solid #10b981',
        clipPath: 'polygon(0 0, 100% 0, calc(100% - 16px) 100%, 16px 100%)',
      };
    case 'notch-riveted':
      return {
        padding: '0.38rem 1rem 0.44rem 1rem',
        borderRadius: '0 0 10px 10px',
        backgroundColor: 'rgba(6, 10, 18, 0.95)',
        border: '1px solid rgba(16, 185, 129, 0.45)',
        borderTop: 'none',
        boxShadow: 'inset 0 -2px 0 #10b981',
      };
    case 'notch-frost':
      return {
        padding: '0.36rem 0.95rem 0.42rem 0.95rem',
        borderRadius: '0 0 18px 18px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderTop: 'none',
      };
    case 'notch-struts':
      return {
        padding: '0.35rem 0.85rem',
        borderRadius: '10px',
        backgroundColor: 'rgba(8, 13, 24, 0.9)',
        borderLeft: '2px solid #10b981',
        borderRight: '2px solid #10b981',
        borderBottom: '1px solid rgba(255,255,255,0.14)',
      };
    case 'notch-arc':
      return {
        padding: '0.34rem 1.2rem 0.5rem 1.2rem',
        borderRadius: '0 0 50% 50% / 0 0 22px 22px',
        backgroundColor: 'rgba(8, 13, 24, 0.9)',
        borderBottom: '1.5px solid #10b981',
      };
    case 'compass-scale':
      return {
        padding: '0.2rem 0.75rem 0.38rem 0.75rem',
        borderBottom: '2px dotted rgba(16, 185, 129, 0.55)',
        backgroundColor: 'rgba(8, 13, 24, 0.65)',
        borderRadius: '8px 8px 0 0',
      };
    case 'neumorphic-well':
      return {
        padding: '0.28rem',
        borderRadius: '14px',
        backgroundColor: '#050811',
        boxShadow: 'inset 0 3px 7px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.08)',
        border: '1px solid rgba(0,0,0,0.8)',
      };
    case 'constellation-line':
      return {
        padding: '0.2rem 0.6rem',
        backgroundImage: 'linear-gradient(90deg, transparent 5%, rgba(16,185,129,0.35) 50%, transparent 95%)',
        backgroundSize: '100% 1px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      };
    case 'event-horizon-ring':
      return {
        padding: '0.26rem 0.9rem',
        borderRadius: '999px',
        backgroundColor: 'rgba(6, 10, 19, 0.8)',
        border: '1px solid rgba(16, 185, 129, 0.45)',
        boxShadow: '0 0 22px rgba(16, 185, 129, 0.25), inset 0 0 12px rgba(16, 185, 129, 0.15)',
      };
    default:
      return {};
  }
}

export function renderTabItem({ item, idx, isActive, isHovered, tabStyle, onClick, compact = false, isLightHome = false }) {
  const IconComp = item.icon;
  const pad = compact ? '0.22rem 0.62rem' : '0.38rem 0.98rem';
  const fontSz = compact ? '0.64rem' : '0.82rem';

  const baseBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.38rem',
    padding: pad,
    border: 'none',
    background: 'transparent',
    color: isActive ? '#ffffff' : isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.72)',
    fontSize: fontSz,
    fontWeight: isActive ? 700 : 600,
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    position: 'relative',
    whiteSpace: 'nowrap',
  };

  switch (tabStyle) {
    case 'clean-pill':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '999px',
            backgroundColor: isActive
              ? 'rgba(255, 255, 255, 0.16)'
              : isHovered
              ? 'rgba(255, 255, 255, 0.1)'
              : 'transparent',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'emerald-pill':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '999px',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
            border: isActive ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid transparent',
            color: isActive ? '#10b981' : 'rgba(255, 255, 255, 0.76)',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'ghost-dot-left':
      return (
        <button key={item.id} onClick={onClick} style={{ ...baseBtn, padding: compact ? '0.2rem 0.45rem' : '0.32rem 0.65rem' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '999px',
              backgroundColor: isActive ? '#10b981' : 'rgba(255,255,255,0.2)',
              boxShadow: isActive ? '0 0 8px #10b981' : 'none',
            }}
          />
          <span>{item.label}</span>
        </button>
      );

    case 'ghost-dot-bottom':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{ ...baseBtn, flexDirection: 'column', gap: '0.18rem', padding: compact ? '0.15rem 0.5rem' : '0.25rem 0.75rem' }}
        >
          <span>{item.label}</span>
          <span
            style={{
              width: isActive ? '5px' : '0px',
              height: '5px',
              borderRadius: '999px',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
              transition: 'all 0.2s ease',
            }}
          />
        </button>
      );

    case 'brackets-square':
      return (
        <button key={item.id} onClick={onClick} className="mono-metric" style={{ ...baseBtn, fontSize: compact ? '0.6rem' : '0.76rem' }}>
          <span style={{ color: isActive ? '#10b981' : 'transparent', fontWeight: 800 }}>[</span>
          <span style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)' }}>{item.label}</span>
          <span style={{ color: isActive ? '#10b981' : 'transparent', fontWeight: 800 }}>]</span>
        </button>
      );

    case 'brackets-angle':
      return (
        <button key={item.id} onClick={onClick} className="mono-metric" style={{ ...baseBtn, fontSize: compact ? '0.6rem' : '0.76rem' }}>
          <span style={{ color: isActive ? '#10b981' : 'transparent', fontWeight: 800 }}>⟨</span>
          <span style={{ color: isActive ? '#10b981' : 'rgba(255,255,255,0.65)' }}>{item.label}</span>
          <span style={{ color: isActive ? '#10b981' : 'transparent', fontWeight: 800 }}>⟩</span>
        </button>
      );

    case 'slash-prefix':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{ ...baseBtn, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: compact ? '0.58rem' : '0.74rem' }}
        >
          <span style={{ color: isActive ? '#10b981' : 'rgba(255,255,255,0.28)', fontWeight: 800 }}>//</span>
          <span>{item.label}</span>
        </button>
      );

    case 'editorial-serif':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="serif-heading"
          style={{
            ...baseBtn,
            fontSize: compact ? '0.72rem' : '0.96rem',
            fontStyle: isActive ? 'italic' : 'normal',
            color: isActive ? '#10b981' : 'rgba(255,255,255,0.75)',
            borderBottom: isActive ? '1px solid rgba(16,185,129,0.5)' : '1px solid transparent',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'wide-tracking':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{
            ...baseBtn,
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            fontSize: compact ? '0.54rem' : '0.68rem',
            color: isActive ? '#10b981' : 'rgba(255,255,255,0.6)',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'crosshair-plus':
      return (
        <button key={item.id} onClick={onClick} className="mono-metric" style={{ ...baseBtn, fontSize: compact ? '0.6rem' : '0.75rem' }}>
          <span style={{ color: isActive ? '#10b981' : 'rgba(255,255,255,0.2)' }}>+</span>
          <span>{item.label}</span>
          <span style={{ color: isActive ? '#10b981' : 'rgba(255,255,255,0.2)' }}>+</span>
        </button>
      );

    case 'neon-text-glow':
      return (
        <button
          key={item.id}
          onClick={onClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--ui-accent)';
            e.currentTarget.style.fontWeight = '700';
            e.currentTarget.style.textShadow = isLightHome
              ? '0 0 10px rgba(var(--ui-accent-rgb), 0.5), 0 1px 6px rgba(255, 255, 255, 0.95)'
              : '0 0 12px rgba(var(--ui-accent-rgb), 0.95), 0 0 22px rgba(var(--ui-accent-rgb), 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isActive ? 'var(--ui-accent)' : 'rgba(var(--ui-accent-rgb), 0.92)';
            e.currentTarget.style.fontWeight = isActive ? '700' : '600';
            e.currentTarget.style.textShadow = isActive
              ? isLightHome
                ? '0 0 10px rgba(var(--ui-accent-rgb), 0.5), 0 1px 6px rgba(255, 255, 255, 0.95)'
                : '0 0 12px rgba(var(--ui-accent-rgb), 0.95), 0 0 22px rgba(var(--ui-accent-rgb), 0.55)'
              : isLightHome
                ? '0 1px 8px rgba(255, 255, 255, 0.92), 0 0 2px rgba(255, 255, 255, 0.95)'
                : '0 1px 3px rgba(0, 0, 0, 0.75)';
          }}
          style={{
            ...baseBtn,
            color: isActive ? 'var(--ui-accent)' : 'rgba(var(--ui-accent-rgb), 0.92)',
            textShadow: isActive
              ? isLightHome
                ? '0 0 10px rgba(var(--ui-accent-rgb), 0.5), 0 1px 6px rgba(255, 255, 255, 0.95)'
                : '0 0 12px rgba(var(--ui-accent-rgb), 0.95), 0 0 22px rgba(var(--ui-accent-rgb), 0.55)'
              : isLightHome
                ? '0 1px 8px rgba(255, 255, 255, 0.92), 0 0 2px rgba(255, 255, 255, 0.95)'
                : '0 1px 3px rgba(0, 0, 0, 0.75)',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'twin-glass-islands':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '999px',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.18)' : 'rgba(8, 13, 24, 0.82)',
            backdropFilter: 'blur(12px)',
            border: isActive ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.14)',
            color: isActive ? '#10b981' : '#ffffff',
            margin: '0 0.2rem',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'chamfer-tab':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{
            ...baseBtn,
            fontSize: compact ? '0.58rem' : '0.74rem',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.22)' : 'transparent',
            color: isActive ? '#10b981' : 'rgba(255,255,255,0.75)',
            clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0 50%)',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'solid-emerald-active':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '999px',
            backgroundColor: isActive ? '#10b981' : 'transparent',
            color: isActive ? '#000000' : 'rgba(255,255,255,0.78)',
            fontWeight: isActive ? 800 : 600,
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'solid-white-active':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '999px',
            backgroundColor: isActive ? '#ffffff' : 'transparent',
            color: isActive ? '#000000' : 'rgba(255,255,255,0.78)',
            fontWeight: isActive ? 800 : 600,
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'diagonal-divider':
      return (
        <React.Fragment key={item.id}>
          {idx > 0 && (
            <span className="mono-metric" style={{ color: '#10b981', fontWeight: 800, fontSize: compact ? '0.65rem' : '0.85rem' }}>
              /
            </span>
          )}
          <button
            onClick={onClick}
            style={{
              ...baseBtn,
              borderRadius: '999px',
              color: isActive ? '#10b981' : 'rgba(255,255,255,0.75)',
            }}
          >
            <span>{item.label}</span>
          </button>
        </React.Fragment>
      );

    case 'slim-pill':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{
            ...baseBtn,
            padding: compact ? '0.12rem 0.45rem' : '0.2rem 0.72rem',
            fontSize: compact ? '0.56rem' : '0.7rem',
            borderRadius: '999px',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.22)' : 'transparent',
            color: isActive ? '#10b981' : 'rgba(255,255,255,0.72)',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'laser-bottom':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{
            ...baseBtn,
            borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
            borderRadius: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            fontSize: compact ? '0.58rem' : '0.74rem',
            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.62)',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'laser-top':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{
            ...baseBtn,
            borderTop: isActive ? '2px solid #10b981' : '2px solid transparent',
            borderRadius: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            fontSize: compact ? '0.58rem' : '0.74rem',
            color: isActive ? '#10b981' : 'rgba(255,255,255,0.62)',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'laser-double-rail':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{
            ...baseBtn,
            borderTop: isActive ? '1.5px solid #10b981' : '1.5px solid transparent',
            borderBottom: isActive ? '1.5px solid #10b981' : '1.5px solid transparent',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            fontSize: compact ? '0.58rem' : '0.73rem',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'laser-left-blade':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderLeft: isActive ? '3px solid #10b981' : '3px solid rgba(255,255,255,0.15)',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
            paddingLeft: compact ? '0.45rem' : '0.75rem',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'laser-gradient-fade':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            backgroundImage: isActive
              ? 'linear-gradient(90deg, transparent, #10b981, transparent)'
              : 'none',
            backgroundSize: '100% 2px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'laser-dashed':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{
            ...baseBtn,
            borderBottom: isActive ? '2px dashed #10b981' : '2px dashed transparent',
            fontSize: compact ? '0.58rem' : '0.74rem',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'corner-frame':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{
            ...baseBtn,
            border: isActive ? '1px solid rgba(16, 185, 129, 0.55)' : '1px solid transparent',
            outline: isActive ? '1px dashed rgba(16, 185, 129, 0.35)' : 'none',
            outlineOffset: '2px',
            fontSize: compact ? '0.58rem' : '0.74rem',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'laser-stepped':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
            boxShadow: isActive ? '0 4px 0 -1px rgba(16, 185, 129, 0.55)' : 'none',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'laser-chevron':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{ ...baseBtn, flexDirection: 'column', gap: '0.05rem', padding: compact ? '0.15rem 0.5rem' : '0.22rem 0.8rem' }}
        >
          <span>{item.label}</span>
          <span style={{ fontSize: '0.45rem', color: isActive ? '#10b981' : 'transparent', lineHeight: 1 }}>▲</span>
        </button>
      );

    case 'beveled-block':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{
            ...baseBtn,
            borderRadius: '6px',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(8, 13, 24, 0.85)',
            border: isActive ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.14)',
            color: isActive ? '#10b981' : '#ffffff',
            fontSize: compact ? '0.58rem' : '0.74rem',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'lambda-divider':
      return (
        <React.Fragment key={item.id}>
          {idx > 0 && (
            <span style={{ color: '#10b981', fontFamily: 'serif', fontWeight: 900, fontSize: compact ? '0.7rem' : '0.9rem' }}>
              λ
            </span>
          )}
          <button
            onClick={onClick}
            style={{
              ...baseBtn,
              borderRadius: '999px',
              color: isActive ? '#10b981' : 'rgba(255,255,255,0.75)',
            }}
          >
            <span>{item.label}</span>
          </button>
        </React.Fragment>
      );

    case 'docked-folder-tab':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '10px 10px 0 0',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.03)',
            border: isActive ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: isActive ? '2px solid #10b981' : 'none',
            color: isActive ? '#10b981' : 'rgba(255,255,255,0.7)',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'wide-block':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            width: '100%',
            borderRadius: '8px',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
            color: isActive ? '#10b981' : 'rgba(255,255,255,0.7)',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'drop-active-tab':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '0 0 10px 10px',
            backgroundColor: isActive ? '#10b981' : 'transparent',
            color: isActive ? '#000000' : 'rgba(255,255,255,0.78)',
            transform: isActive ? 'translateY(3px)' : 'none',
            fontWeight: 800,
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'hotkey-bracket':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{
            ...baseBtn,
            borderRadius: '8px',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.18)' : 'rgba(8, 13, 24, 0.8)',
            border: isActive ? '1px solid rgba(16, 185, 129, 0.55)' : '1px solid rgba(255, 255, 255, 0.12)',
            fontSize: compact ? '0.58rem' : '0.74rem',
          }}
        >
          <span style={{ color: '#10b981', fontWeight: 800 }}>[{idx + 1}]</span>
          {IconComp && !compact && <IconComp size={13} style={{ color: isActive ? '#10b981' : 'inherit' }} />}
          <span>{item.label}</span>
        </button>
      );

    case 'keycap-3d':
      return (
        <button
          key={item.id}
          onClick={onClick}
          className="mono-metric"
          style={{
            ...baseBtn,
            borderRadius: '8px',
            backgroundColor: isActive ? '#0d231d' : '#0a0f1c',
            border: isActive ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.18)',
            borderBottom: isActive ? '3px solid #10b981' : '3px solid rgba(255,255,255,0.28)',
            fontSize: compact ? '0.58rem' : '0.73rem',
          }}
        >
          <span style={{ color: '#10b981', fontWeight: 800 }}>⌘{idx + 1}</span>
          <span>{item.label}</span>
        </button>
      );

    case 'index-01-02':
      return (
        <button key={item.id} onClick={onClick} className="mono-metric" style={{ ...baseBtn, fontSize: compact ? '0.58rem' : '0.73rem' }}>
          <span style={{ color: '#10b981', fontWeight: 800 }}>0{idx + 1} /</span>
          <span>{item.label}</span>
        </button>
      );

    case 'fn-key-badge':
      return (
        <button key={item.id} onClick={onClick} className="mono-metric" style={{ ...baseBtn, fontSize: compact ? '0.58rem' : '0.72rem' }}>
          <span
            style={{
              padding: '0.06rem 0.32rem',
              borderRadius: '4px',
              backgroundColor: isActive ? '#10b981' : 'rgba(255,255,255,0.12)',
              color: isActive ? '#000' : '#fff',
              fontSize: compact ? '0.5rem' : '0.6rem',
              fontWeight: 800,
            }}
          >
            F{idx + 1}
          </span>
          <span>{item.label}</span>
        </button>
      );

    case 'cli-flag':
      return (
        <button key={item.id} onClick={onClick} className="mono-metric" style={{ ...baseBtn, fontSize: compact ? '0.56rem' : '0.7rem' }}>
          <span style={{ color: '#10b981', fontWeight: 800 }}>$</span>
          <span style={{ color: isActive ? '#10b981' : 'rgba(255,255,255,0.68)' }}>
            --{item.label.toLowerCase()}
          </span>
        </button>
      );

    case 'superscript-num':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
          }}
        >
          <span>{item.label}</span>
          <sup className="mono-metric" style={{ fontSize: '0.55rem', color: '#10b981', fontWeight: 800 }}>
            0{idx + 1}
          </sup>
        </button>
      );

    case 'circled-number':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '999px',
            backgroundColor: isActive ? 'rgba(16,185,129,0.2)' : 'transparent',
          }}
        >
          <span
            className="mono-metric"
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '999px',
              backgroundColor: isActive ? '#10b981' : 'rgba(255,255,255,0.12)',
              color: isActive ? '#000' : '#fff',
              fontSize: '0.55rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {idx + 1}
          </span>
          <span>{item.label}</span>
        </button>
      );

    case 'channel-tag':
      return (
        <button key={item.id} onClick={onClick} className="mono-metric" style={{ ...baseBtn, fontSize: compact ? '0.56rem' : '0.7rem' }}>
          <span style={{ color: '#10b981', fontWeight: 800 }}>CH-0{idx + 1}</span>
          <span>{item.label}</span>
        </button>
      );

    case 'binary-on-off':
      return (
        <button key={item.id} onClick={onClick} className="mono-metric" style={{ ...baseBtn, fontSize: compact ? '0.56rem' : '0.7rem' }}>
          <span style={{ color: isActive ? '#10b981' : 'rgba(255,255,255,0.3)', fontWeight: 800 }}>
            {isActive ? '[ON]' : '[--]'}
          </span>
          <span>{item.label}</span>
        </button>
      );

    case 'icon-and-label':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '999px',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
            color: isActive ? '#10b981' : 'rgba(255,255,255,0.78)',
          }}
        >
          {IconComp && <IconComp size={compact ? 11 : 14} />}
          <span>{item.label}</span>
        </button>
      );

    case 'two-tier-sub':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.05rem',
            padding: compact ? '0.15rem 0.5rem' : '0.24rem 0.85rem',
            borderRadius: '10px',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.16)' : 'transparent',
          }}
        >
          <span style={{ fontSize: compact ? '0.6rem' : '0.76rem', color: isActive ? '#10b981' : '#ffffff', fontWeight: 800 }}>
            {item.label}
          </span>
          {!compact && (
            <span className="mono-metric" style={{ fontSize: '0.5rem', color: 'var(--text-dim)' }}>
              {idx === 0 ? '213 ASSETS • 3D' : '$106.4K • VaR'}
            </span>
          )}
        </button>
      );

    case 'count-badge':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '999px',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
          }}
        >
          <span>{item.label}</span>
          <span
            className="mono-metric"
            style={{
              fontSize: '0.54rem',
              padding: '0.05rem 0.35rem',
              borderRadius: '999px',
              backgroundColor: isActive ? '#10b981' : 'rgba(255,255,255,0.1)',
              color: isActive ? '#000' : 'rgba(255,255,255,0.75)',
              fontWeight: 800,
            }}
          >
            {idx === 0 ? '213' : '6'}
          </span>
        </button>
      );

    case 'card-icon-two-line':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '12px',
            padding: compact ? '0.2rem 0.5rem' : '0.3rem 0.75rem',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(8, 13, 24, 0.8)',
            border: isActive ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {IconComp && <IconComp size={compact ? 11 : 14} style={{ color: '#10b981' }} />}
          <span>{item.label}</span>
        </button>
      );

    case 'stacked-icon-top':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            flexDirection: 'column',
            gap: '0.12rem',
            padding: compact ? '0.15rem 0.5rem' : '0.24rem 0.8rem',
            borderRadius: '10px',
            color: isActive ? '#10b981' : 'rgba(255,255,255,0.72)',
          }}
        >
          {IconComp && <IconComp size={compact ? 11 : 13} />}
          <span style={{ fontSize: compact ? '0.56rem' : '0.68rem' }}>{item.label}</span>
        </button>
      );

    case 'internal-progress-bar':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            flexDirection: 'column',
            gap: '0.18rem',
            padding: compact ? '0.18rem 0.55rem' : '0.28rem 0.85rem',
          }}
        >
          <span>{item.label}</span>
          <span
            style={{
              width: '100%',
              height: '3px',
              borderRadius: '999px',
              backgroundColor: isActive ? '#10b981' : 'rgba(255,255,255,0.12)',
            }}
          />
        </button>
      );

    case 'module-code-top':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.02rem',
            borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
          }}
        >
          <span className="mono-metric" style={{ fontSize: '0.46rem', color: '#10b981', fontWeight: 800 }}>
            MOD-0{idx + 1}
          </span>
          <span>{item.label}</span>
        </button>
      );

    case 'micro-tag-pill':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '999px',
            backgroundColor: isActive ? 'rgba(16,185,129,0.18)' : 'transparent',
          }}
        >
          <span>{item.label}</span>
          <span
            className="mono-metric"
            style={{
              fontSize: '0.48rem',
              padding: '0.04rem 0.28rem',
              borderRadius: '4px',
              border: '1px solid rgba(16,185,129,0.5)',
              color: '#10b981',
              fontWeight: 800,
            }}
          >
            {idx === 0 ? '3D' : 'IA'}
          </span>
        </button>
      );

    case 'engine-suffix':
      return (
        <button key={item.id} onClick={onClick} style={{ ...baseBtn, borderRadius: '999px' }}>
          <span>{item.label}</span>
          <span className="mono-metric" style={{ fontSize: '0.54rem', color: isActive ? '#10b981' : 'var(--text-dim)' }}>
            {idx === 0 ? '(3D/2D)' : '(VaR)'}
          </span>
        </button>
      );

    case 'centennial-full':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '999px',
            backgroundColor: isActive ? 'rgba(16,185,129,0.22)' : 'transparent',
            color: isActive ? '#10b981' : '#ffffff',
          }}
        >
          <span className="mono-metric" style={{ fontSize: '0.54rem', fontWeight: 800 }}>
            0{idx + 1}
          </span>
          {IconComp && !compact && <IconComp size={13} />}
          <span>{item.label}</span>
        </button>
      );

    case 'skew-parallelogram':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            transform: 'skewX(-14deg)',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.22)' : 'rgba(8, 13, 24, 0.85)',
            border: isActive ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.14)',
            borderRadius: '4px',
            margin: '0 0.15rem',
          }}
        >
          <span style={{ transform: 'skewX(14deg)', color: isActive ? '#10b981' : '#ffffff' }}>{item.label}</span>
        </button>
      );

    case 'hex-point-tab':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            backgroundColor: isActive ? '#10b981' : 'rgba(12, 18, 32, 0.88)',
            color: isActive ? '#000000' : '#ffffff',
            clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)',
            padding: compact ? '0.22rem 0.7rem' : '0.38rem 1.15rem',
            fontWeight: 800,
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'toggle-switch':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '999px',
            backgroundColor: isActive ? '#10b981' : 'transparent',
            color: isActive ? '#000000' : 'rgba(255,255,255,0.65)',
            fontWeight: 800,
          }}
        >
          <span>{isActive ? `● ${item.label}` : item.label}</span>
        </button>
      );

    case 'chiseled-leaf':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '16px 3px 16px 3px',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.22)' : 'rgba(8, 13, 24, 0.8)',
            border: isActive ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.14)',
            color: isActive ? '#10b981' : '#ffffff',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    case 'specular-prism':
      return (
        <button
          key={item.id}
          onClick={onClick}
          style={{
            ...baseBtn,
            borderRadius: '10px',
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.14)' : 'rgba(8, 13, 24, 0.75)',
            borderTop: isActive ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.22)',
            borderBottom: '1px solid rgba(0,0,0,0.8)',
            boxShadow: isActive ? 'inset 0 6px 12px -6px rgba(16,185,129,0.6)' : 'none',
          }}
        >
          <span>{item.label}</span>
        </button>
      );

    default:
      return (
        <button key={item.id} onClick={onClick} style={baseBtn}>
          <span>{item.label}</span>
        </button>
      );
  }
}

export function renderRightHudModule(rightHud, utcTime, compact = false) {
  if (!rightHud || rightHud === 'none') return null;
  const pillStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: compact ? '0.25rem' : '0.42rem',
    padding: compact ? '0.14rem 0.45rem' : '0.28rem 0.72rem',
    borderRadius: '999px',
    backgroundColor: 'rgba(8, 13, 24, 0.82)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    fontSize: compact ? '0.48rem' : '0.58rem',
    color: 'rgba(255, 255, 255, 0.82)',
    pointerEvents: 'auto',
    whiteSpace: 'nowrap',
  };

  switch (rightHud) {
    case 'utc-live':
      return (
        <div className="mono-metric" style={pillStyle}>
          <span style={{ width: '6px', height: '6px', borderRadius: '999px', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ color: '#10b981', fontWeight: 800 }}>213 LIVE</span>
          {!compact && <span>• {utcTime} UTC</span>}
        </div>
      );
    case 'macro-ticker':
      return (
        <div className="mono-metric" style={pillStyle}>
          <span>SPX</span>
          <strong style={{ color: '#10b981' }}>+0.84%</strong>
          {!compact && (
            <>
              <span>• BTC</span>
              <strong style={{ color: '#10b981' }}>+3.4%</strong>
            </>
          )}
        </div>
      );
    case 'p06-regime':
      return (
        <div className="mono-metric" style={{ ...pillStyle, borderColor: 'rgba(16,185,129,0.35)' }}>
          <span style={{ color: '#10b981', fontWeight: 800 }}>P-06 NORMAL: 79.3%</span>
        </div>
      );
    case 'market-sessions':
      return (
        <div className="mono-metric" style={pillStyle}>
          <span style={{ color: '#10b981', fontWeight: 800 }}>● NY OPEN</span>
          {!compact && <span style={{ color: 'var(--text-dim)' }}>• LON • TKY</span>}
        </div>
      );
    case 'portfolio-nav-var':
      return (
        <div className="mono-metric" style={pillStyle}>
          <span style={{ color: '#10b981', fontWeight: 800 }}>NAV $106.4K</span>
          {!compact && <span style={{ color: '#f43f5e', fontWeight: 800 }}>VaR -1.4%</span>}
        </div>
      );
    case 'engine-latency':
      return (
        <div className="mono-metric" style={pillStyle}>
          <span style={{ color: '#10b981', fontWeight: 800 }}>P-06: 12ms</span>
          {!compact && <span>• RAG: OK</span>}
        </div>
      );
    case 'jwst-coords':
      return (
        <div className="mono-metric" style={pillStyle}>
          <span style={{ color: '#10b981', fontWeight: 800 }}>L2 ORBIT</span>
          {!compact && <span>• RA 05h 35m</span>}
        </div>
      );
    case 'rates-vix':
      return (
        <div className="mono-metric" style={pillStyle}>
          <span>UST10Y 4.28%</span>
          {!compact && <span style={{ color: '#10b981', fontWeight: 800 }}>• VIX 14.2</span>}
        </div>
      );
    case 'sparkline-pulse':
      return (
        <div className="mono-metric" style={pillStyle}>
          <svg width={compact ? '24' : '38'} height="12" viewBox="0 0 38 12" fill="none">
            <polyline
              points="1,9 8,6 15,8 22,3 29,5 37,1"
              stroke="#10b981"
              strokeWidth="1.8"
              fill="none"
            />
          </svg>
          <span style={{ color: '#10b981', fontWeight: 800 }}>213</span>
        </div>
      );
    case 'hotkey-hint':
      return (
        <div className="mono-metric" style={pillStyle}>
          <span style={{ color: '#10b981', fontWeight: 800 }}>Alt+1/2</span>
        </div>
      );
    case 'status-minimal':
      return (
        <div className="mono-metric" style={pillStyle}>
          <span style={{ color: '#10b981', fontWeight: 800 }}>● HEALTHY</span>
        </div>
      );
    default:
      return null;
  }
}

export default function HeaderBar({
  activeTab,
  navItems,
  t,
  onNavigate,
  onGoBack,
  agentOpen = false,
  onToggleAgent,
  lightMode = false,
  devIconId = 'lambda08-h-chiseled-nib',
  devBoxStyleId = 'free-green',
  headerVariantId = 'v001',
}) {
  const isLightHome = Boolean(lightMode);
  const variant = resolveHeaderVariant(headerVariantId);
  const activeIconObj = DEV_ICON_CATALOG.find((i) => i.id === devIconId) || DEV_ICON_CATALOG[0];
  const activeBoxObj = DEV_BOX_STYLES.find((b) => b.id === devBoxStyleId) || DEV_BOX_STYLES[0];
  const isBorderless = activeBoxObj.id === 'free-green';

  const [utcTime, setUtcTime] = useState(() => new Date().toISOString().slice(11, 19));
  useEffect(() => {
    if (variant.rightHud !== 'utc-live') return undefined;
    const timer = setInterval(() => {
      setUtcTime(new Date().toISOString().slice(11, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, [variant.rightHud]);

  // Global keyboard shortcuts Alt+1 / Alt+2 / Alt+0
  useEffect(() => {
    const handleKey = (e) => {
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        onNavigate('workstation');
      } else if (e.altKey && e.key === '2') {
        e.preventDefault();
        onNavigate('consensus');
      } else if (e.altKey && e.key === '0') {
        e.preventDefault();
        onNavigate('presentation');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onNavigate]);

  const renderLambdaEmblem = (emblemMode = 'default', customSize = null) => {
    const size = customSize || (isBorderless ? 32 : 17);
    const wrapStyle = (() => {
      if (emblemMode === 'circle-ring') {
        return {
          width: '34px',
          height: '34px',
          borderRadius: '999px',
          backgroundColor: 'rgba(16, 185, 129, 0.14)',
          border: '1.5px solid rgba(16, 185, 129, 0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          pointerEvents: 'auto',
        };
      }
      if (emblemMode === 'diamond') {
        return {
          width: '30px',
          height: '30px',
          transform: 'rotate(45deg)',
          backgroundColor: 'rgba(8, 13, 24, 0.92)',
          border: '1.5px solid #10b981',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          pointerEvents: 'auto',
        };
      }
      if (emblemMode === 'hexagon') {
        return {
          width: '34px',
          height: '34px',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          pointerEvents: 'auto',
        };
      }
      if (emblemMode === 'solid-emerald') {
        return {
          width: '32px',
          height: '32px',
          borderRadius: '999px',
          backgroundColor: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          pointerEvents: 'auto',
          boxShadow: '0 0 16px rgba(16, 185, 129, 0.55)',
        };
      }
      if (emblemMode === 'tall-pill') {
        return {
          width: '28px',
          height: '40px',
          borderRadius: '999px',
          backgroundColor: 'rgba(16, 185, 129, 0.16)',
          border: '1px solid #10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          pointerEvents: 'auto',
        };
      }
      return {
        width: customSize ? `${customSize}px` : isBorderless ? '34px' : '30px',
        height: customSize ? `${customSize}px` : isBorderless ? '34px' : '30px',
        borderRadius: '6px',
        backgroundColor: activeBoxObj.bg,
        border: isBorderless ? 'none' : activeBoxObj.border,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        pointerEvents: 'auto',
        filter: isBorderless ? 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.65))' : 'none',
      };
    })();

    const glyphColor =
      emblemMode === 'solid-emerald'
        ? '#000000'
        : 'var(--ui-accent)';

    return (
      <HoverTooltip
        title="Home"
        placement="bottom-left"
      >
        {(isHovered) => (
          <div
            onClick={() => onNavigate('presentation')}
            style={{
              ...wrapStyle,
              filter: isBorderless
                ? activeTab === 'presentation' || isHovered
                  ? isLightHome
                    ? 'drop-shadow(0 0 8px rgba(var(--ui-accent-rgb), 0.6)) drop-shadow(0 1px 4px rgba(255, 255, 255, 0.95))'
                    : 'drop-shadow(0 0 10px rgba(var(--ui-accent-rgb), 0.9)) drop-shadow(0 0 20px rgba(var(--ui-accent-rgb), 0.45))'
                  : isLightHome
                    ? 'drop-shadow(0 1px 6px rgba(255, 255, 255, 0.92))'
                    : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.75))'
                : 'none',
              transition: 'filter 0.2s ease, transform 0.2s ease',
            }}
          >
            <div style={{ transform: emblemMode === 'diamond' ? 'rotate(-45deg)' : 'none', display: 'flex' }}>
              {activeIconObj ? (
                activeIconObj.renderSvg(glyphColor, emblemMode === 'default' ? size : 20)
              ) : (
                <Activity size={17} strokeWidth={2.5} style={{ color: glyphColor }} />
              )}
            </div>
          </div>
        )}
      </HoverTooltip>
    );
  };

  const isRibbon = variant.layout.startsWith('ribbon');
  const isTopNotch = variant.layout.startsWith('top-notch');

  const headerContainerStyle = {
    position: 'fixed',
    top: variant.layout === 'ribbon-floating-inset' ? '8px' : 0,
    left: variant.layout === 'ribbon-floating-inset' ? '16px' : 0,
    right: variant.layout === 'ribbon-floating-inset' ? '16px' : 0,
    borderRadius: variant.layout === 'ribbon-floating-inset' ? '14px' : 0,
    backgroundColor: isRibbon
      ? 'rgba(6, 10, 19, 0.84)'
      : variant.layout === 'left-wing-ribbon'
      ? 'transparent'
      : 'transparent',
    backdropFilter: isRibbon ? 'blur(14px)' : 'none',
    borderTop:
      variant.ribbonStyle === 'top-crown-emerald'
        ? '2.5px solid #10b981'
        : variant.ribbonStyle === 'double-border'
        ? '1px solid rgba(16, 185, 129, 0.35)'
        : 'none',
    borderBottom:
      variant.ribbonStyle === 'emerald-bottom' || variant.ribbonStyle === 'double-border'
        ? '1px solid rgba(16, 185, 129, 0.32)'
        : variant.ribbonStyle === 'neutral-bottom' || variant.ribbonStyle === 'grid-cells'
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : variant.ribbonStyle === 'center-glow-bottom'
        ? '1px solid rgba(16, 185, 129, 0.5)'
        : 'none',
    padding: isTopNotch
      ? '0 1.5rem 0.45rem 1.5rem'
      : variant.layout === 'ribbon-slim'
      ? '0.32rem 1.5rem'
      : isRibbon
      ? '0.5rem 1.5rem'
      : '0.82rem 1.5rem',
    display: 'grid',
    gridTemplateColumns:
      variant.layout === 'third-offset' ? '0.45fr auto 1fr' : '1fr auto 1fr',
    alignItems: isTopNotch ? 'flex-start' : 'center',
    zIndex: 50,
    pointerEvents: 'none',
  };

  const shellStyle = renderNavShellStyle(variant.navShell);
  const isES = t.navWorkstation === 'Mercados';

  const renderTabWithTooltip = (item, idx, placement = 'bottom') => {
    const tooltipTitle =
      item.id === 'workstation'
        ? isES
          ? 'Activos y análisis'
          : 'Assets & analytics'
        : item.id === 'consensus'
        ? isES
          ? 'Riesgo y simulaciones'
          : 'Risk & simulations'
        : item.label;
    return (
      <HoverTooltip
        key={item.id}
        title={tooltipTitle}
        placement={placement}
      >
        {(isHovered) =>
          renderTabItem({
            item,
            idx,
            isActive: activeTab === item.id,
            isHovered,
            tabStyle: variant.tabStyle,
            onClick: () => onNavigate(item.id),
            isLightHome,
          })
        }
      </HoverTooltip>
    );
  };

  const renderTabsGroup = () => (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.32rem',
        pointerEvents: 'auto',
        ...shellStyle,
      }}
    >
      {navItems.map((item, idx) => renderTabWithTooltip(item, idx, 'bottom'))}
    </div>
  );

  const isCenterLambda = variant.layout.startsWith('center-lambda');

  return (
    <header style={headerContainerStyle}>
      {/* LEFT SECTOR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          paddingTop: isTopNotch && variant.layout !== 'top-notch-double' ? '0.75rem' : 0,
          borderRight:
            variant.ribbonStyle === 'grid-cells' ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        {variant.layout === 'left-dock' ||
        variant.layout === 'left-wing-ribbon' ||
        variant.layout === 'left-dock-laser' ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              pointerEvents: 'auto',
              ...shellStyle,
            }}
          >
            {renderLambdaEmblem('default', 28)}
            <span style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.18)' }} />
            {navItems.map((item, idx) => renderTabWithTooltip(item, idx, 'bottom-left'))}
          </div>
        ) : variant.layout === 'left-breadcrumb' ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', pointerEvents: 'auto' }}>
            {renderLambdaEmblem('default', 28)}
            <span className="mono-metric" style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>
              › TERMINAL ›
            </span>
            {renderTabsGroup()}
          </div>
        ) : variant.layout === 'left-modular-blocks' ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', pointerEvents: 'auto' }}>
            <div
              style={{
                padding: '0.2rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(8,13,24,0.88)',
                border: '1px solid rgba(16,185,129,0.4)',
              }}
            >
              {renderLambdaEmblem('default', 24)}
            </div>
            {renderTabsGroup()}
          </div>
        ) : variant.layout === 'left-unix-path' ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              pointerEvents: 'auto',
              ...shellStyle,
            }}
          >
            <span
              onClick={() => onNavigate('presentation')}
              className="mono-metric"
              style={{ color: '#10b981', fontWeight: 800, fontSize: '0.74rem', cursor: 'pointer', paddingLeft: '0.45rem' }}
            >
              ~/λ/
            </span>
            {navItems.map((item, idx) => renderTabWithTooltip(item, idx, 'bottom-left'))}
          </div>
        ) : variant.layout === 'split-corners' ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'auto' }}>
            {renderLambdaEmblem('default', 28)}
            {navItems[0] && renderTabWithTooltip(navItems[0], 0, 'bottom-left')}
          </div>
        ) : variant.layout === 'right-dock-all' ||
          variant.layout === 'top-notch-unified-center' ||
          isCenterLambda ? (
          <div />
        ) : variant.layout === 'top-notch-double' ? (
          <div style={{ ...shellStyle, padding: '0.3rem 0.65rem' }}>{renderLambdaEmblem('default', 26)}</div>
        ) : variant.layout === 'dual-hud' ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
            {renderLambdaEmblem()}
            {renderRightHudModule('p06-regime', utcTime)}
          </div>
        ) : (
          renderLambdaEmblem()
        )}
      </div>

      {/* CENTER SECTOR */}
      <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'auto' }}>
        {variant.layout === 'left-dock' ||
        variant.layout === 'left-breadcrumb' ||
        variant.layout === 'left-modular-blocks' ||
        variant.layout === 'left-unix-path' ||
        variant.layout === 'left-logo-right-nav' ||
        variant.layout === 'right-dock-all' ||
        variant.layout === 'split-corners' ||
        variant.layout === 'left-dock-laser' ||
        variant.layout === 'left-wing-ribbon' ? (
          <div />
        ) : isCenterLambda ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: variant.layout === 'center-lambda-bridge' ? '1.2rem' : '0.65rem',
              ...shellStyle,
            }}
          >
            {navItems[0] && renderTabWithTooltip(navItems[0], 0, 'bottom')}
            {variant.layout === 'center-lambda-bridge' && (
              <span style={{ width: '28px', height: '1px', backgroundColor: 'rgba(16,185,129,0.5)' }} />
            )}
            {renderLambdaEmblem(variant.centerEmblem || 'circle-ring', 28)}
            {variant.layout === 'center-lambda-bridge' && (
              <span style={{ width: '28px', height: '1px', backgroundColor: 'rgba(16,185,129,0.5)' }} />
            )}
            {navItems[1] && renderTabWithTooltip(navItems[1], 1, 'bottom')}
          </div>
        ) : variant.layout === 'top-notch-unified-center' ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', ...shellStyle }}>
            {renderLambdaEmblem('default', 26)}
            <span style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            {navItems.map((item, idx) => renderTabWithTooltip(item, idx, 'bottom'))}
          </div>
        ) : (
          <>
            {renderTabsGroup()}
            {variant.layout === 'two-deck-context' && (
              <div
                className="mono-metric"
                style={{
                  fontSize: '0.5rem',
                  color: '#10b981',
                  marginTop: '0.18rem',
                  letterSpacing: '0.06em',
                }}
              >
                {activeTab === 'consensus'
                  ? 'PORTFOLIO SANDBOX • VaR 95% & CORRELATION MATRIX'
                  : 'GLOBAL MULTI-ASSET SCREENER • 3D SURFACES & PAYOFFS'}
              </div>
            )}
          </>
        )}
      </nav>

      {/* RIGHT SECTOR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.55rem',
          paddingTop: isTopNotch ? '0.75rem' : 0,
          borderLeft:
            variant.ribbonStyle === 'grid-cells' ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        {variant.layout === 'left-logo-right-nav' && renderTabsGroup()}

        {variant.layout === 'right-dock-all' && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', pointerEvents: 'auto', ...shellStyle }}>
            {navItems.map((item, idx) => renderTabWithTooltip(item, idx, 'bottom-right'))}
            <span style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            {renderLambdaEmblem('default', 26)}
          </div>
        )}

        {variant.layout === 'split-corners' &&
          navItems[1] && (
            <div style={{ pointerEvents: 'auto' }}>
              {renderTabWithTooltip(navItems[1], 1, 'bottom-right')}
            </div>
          )}

        {activeTab !== 'observability' && activeTab !== 'guide' && renderRightHudModule(variant.rightHud, utcTime)}

        {onToggleAgent && (
          <HoverTooltip
            disabled={agentOpen}
            title={isES ? 'Consultar al agente guía' : 'Ask the platform guide'}
            placement="bottom-right"
          >
            {(isHovered) => {
              const isHighlighted = agentOpen || isHovered;
              return (
                <button
                  type="button"
                  data-agent-toggle="true"
                  onClick={onToggleAgent}
                  aria-label={isES ? 'Agente Guía' : 'Guide Agent'}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--ui-accent)',
                    height: '28px',
                    padding: '0 0.25rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    filter: isHighlighted
                      ? isLightHome
                        ? 'drop-shadow(0 0 8px rgba(var(--ui-accent-rgb), 0.65)) drop-shadow(0 1px 4px rgba(255, 255, 255, 0.95))'
                        : 'drop-shadow(0 0 10px rgba(var(--ui-accent-rgb), 0.95)) drop-shadow(0 0 20px rgba(var(--ui-accent-rgb), 0.55))'
                      : isLightHome
                        ? 'drop-shadow(0 1px 6px rgba(255, 255, 255, 0.92))'
                        : 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.75))',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <Sparkles size={17} strokeWidth={isHighlighted ? 2.5 : 2.25} style={{ color: 'var(--ui-accent)' }} />
                </button>
              );
            }}
          </HoverTooltip>
        )}
      </div>
    </header>
  );
}
