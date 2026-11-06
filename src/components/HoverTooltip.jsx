import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Compact & Simple Hover Tooltip (`HoverTooltip`).
 * Renders via React Portal (`document.body`) with `position: fixed` and `zIndex: 99999`.
 */
export default function HoverTooltip({
  title,
  description,
  hint,
  placement = 'top',
  variantStyle = 'pure-text',
  disabled = false,
  children,
  style = {},
}) {
  const [hovered, setHovered] = useState(false);
  const [rect, setRect] = useState(null);
  const wrapRef = useRef(null);

  const handleEnter = () => {
    if (wrapRef.current) {
      setRect(wrapRef.current.getBoundingClientRect());
    }
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  const getPopoverFixedStyle = () => {
    const base = {
      position: 'fixed',
      zIndex: 99999,
      pointerEvents: 'none',
    };
    if (!rect || typeof window === 'undefined') return base;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    switch (placement) {
      case 'bottom':
        return {
          ...base,
          top: `${rect.bottom + 7}px`,
          left: `${Math.min(vw - 120, Math.max(120, rect.left + rect.width / 2))}px`,
          transform: 'translateX(-50%)',
        };
      case 'bottom-left':
        return {
          ...base,
          top: `${rect.bottom + 7}px`,
          left: `${Math.min(vw - 220, Math.max(12, rect.left))}px`,
        };
      case 'bottom-right':
        return {
          ...base,
          top: `${rect.bottom + 7}px`,
          right: `${Math.max(12, vw - rect.right)}px`,
        };
      case 'top-left':
        return {
          ...base,
          bottom: `${vh - rect.top + 7}px`,
          left: `${Math.min(vw - 220, Math.max(12, rect.left))}px`,
        };
      case 'top-right':
        return {
          ...base,
          bottom: `${vh - rect.top + 7}px`,
          right: `${Math.max(12, vw - rect.right)}px`,
        };
      case 'top':
      default:
        return {
          ...base,
          bottom: `${vh - rect.top + 7}px`,
          left: `${Math.min(vw - 120, Math.max(120, rect.left + rect.width / 2))}px`,
          transform: 'translateX(-50%)',
        };
    }
  };

  const labelText = title ? String(title).trim() : null;

  const getVisualVariantStyle = () => {
    switch (variantStyle) {
      case 'pure-text':
        // 1. Texto puro flotante sin caja ni bordes (tipo V010)
        return {
          backgroundColor: 'transparent',
          border: 'none',
          padding: '2px 4px',
          fontSize: '11px',
          fontWeight: 500,
          color: 'rgba(248, 250, 252, 0.88)',
          textShadow: '0 1px 4px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.85)',
          letterSpacing: '0.02em',
        };
      case 'ghost-pill':
        // 2. Cápsula ahumada ultra-suave sin borde de color
        return {
          backgroundColor: 'rgba(6, 10, 18, 0.76)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          padding: '3px 10px',
          fontSize: '11px',
          fontWeight: 500,
          color: 'rgba(241, 245, 249, 0.9)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          letterSpacing: '0.01em',
        };
      case 'mono-terminal':
        // 3. Etiqueta monoespaciada técnica con marquita izquierda sutil
        return {
          backgroundColor: 'rgba(4, 7, 13, 0.88)',
          borderLeft: '2px solid var(--ui-accent)',
          borderTop: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          borderRadius: '0 4px 4px 0',
          padding: '3px 8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10.5px',
          fontWeight: 500,
          color: '#e2e8f0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
          letterSpacing: '0.03em',
        };
      case 'underline-whisper':
        // 4. Texto limpio con línea inferior finita del color del tema
        return {
          backgroundColor: 'rgba(4, 7, 14, 0.62)',
          backdropFilter: 'blur(6px)',
          border: 'none',
          borderBottom: '1px solid rgba(var(--ui-accent-rgb), 0.55)',
          borderRadius: '3px 3px 0 0',
          padding: '2px 7px 3px 7px',
          fontSize: '11px',
          fontWeight: 500,
          color: '#f1f5f9',
          letterSpacing: '0.015em',
        };
      case 'matte-slate':
        // 5. Recuadro mate minimalista en gris grafito oscuro
        return {
          backgroundColor: '#0b111e',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          borderRadius: '4px',
          padding: '3px 8px',
          fontSize: '11px',
          fontWeight: 500,
          color: '#cbd5e1',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.55)',
        };
      case 'accent-text-glow':
      default:
        // 6. Texto puro en el tono del tema con halo suave (sin caja)
        return {
          backgroundColor: 'transparent',
          border: 'none',
          padding: '2px 4px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--ui-accent)',
          textShadow: '0 0 10px rgba(var(--ui-accent-rgb), 0.65), 0 1px 4px rgba(0, 0, 0, 0.95)',
          letterSpacing: '0.02em',
        };
    }
  };

  const popoverNode =
    hovered && !disabled && labelText ? (
      <div
        style={{
          ...getPopoverFixedStyle(),
          maxWidth: '280px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          ...getVisualVariantStyle(),
        }}
      >
        {labelText}
      </div>
    ) : null;

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        pointerEvents: 'auto',
        ...style,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {typeof children === 'function' ? children(hovered) : children}
      {popoverNode && typeof document !== 'undefined' ? createPortal(popoverNode, document.body) : null}
    </div>
  );
}
