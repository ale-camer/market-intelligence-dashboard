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

  const popoverNode =
    hovered && !disabled && labelText ? (
      <div
        style={{
          ...getPopoverFixedStyle(),
          backgroundColor: 'transparent',
          border: 'none',
          padding: '2px 4px',
          maxWidth: '280px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-main, rgba(248, 250, 252, 0.92))',
          textShadow: 'var(--tooltip-shadow, 0 1px 4px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.85))',
          letterSpacing: '0.02em',
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
