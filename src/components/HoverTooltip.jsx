import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Homogeneous Hover Popover & Highlight Module (`HoverTooltip`).
 * Renders via React Portal (`document.body`) with `position: fixed` and `zIndex: 99999`
 * so it always floats above all `backdrop-filter`, `overflow`, and table/canvas layers.
 */
export default function HoverTooltip({
  title,
  description,
  hint,
  badge,
  statusColor,
  placement = 'top', // 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'
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
          top: `${rect.bottom + 9}px`,
          left: `${Math.min(vw - 150, Math.max(150, rect.left + rect.width / 2))}px`,
          transform: 'translateX(-50%)',
        };
      case 'bottom-left':
        return {
          ...base,
          top: `${rect.bottom + 9}px`,
          left: `${Math.min(vw - 290, Math.max(12, rect.left))}px`,
        };
      case 'bottom-right':
        return {
          ...base,
          top: `${rect.bottom + 9}px`,
          right: `${Math.max(12, vw - rect.right)}px`,
        };
      case 'top-left':
        return {
          ...base,
          bottom: `${vh - rect.top + 9}px`,
          left: `${Math.min(vw - 290, Math.max(12, rect.left))}px`,
        };
      case 'top-right':
        return {
          ...base,
          bottom: `${vh - rect.top + 9}px`,
          right: `${Math.max(12, vw - rect.right)}px`,
        };
      case 'top':
      default:
        return {
          ...base,
          bottom: `${vh - rect.top + 9}px`,
          left: `${Math.min(vw - 150, Math.max(150, rect.left + rect.width / 2))}px`,
          transform: 'translateX(-50%)',
        };
    }
  };

  const accentBorder = statusColor || 'var(--ui-accent)';

  const popoverNode =
    hovered && !disabled && (title || description || hint) ? (
      <div
        style={{
          ...getPopoverFixedStyle(),
          backgroundColor: 'rgba(8, 12, 22, 0.96)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${accentBorder}`,
          boxShadow: '0 14px 36px rgba(0, 0, 0, 0.78), 0 0 18px rgba(var(--ui-accent-rgb), 0.22)',
          borderRadius: '10px',
          padding: description ? '0.62rem 0.88rem' : '0.38rem 0.68rem',
          minWidth: description ? '225px' : 'max-content',
          maxWidth: '285px',
          textAlign: 'left',
        }}
      >
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              marginBottom: description || hint ? '0.25rem' : 0,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: '0.73rem',
                color: statusColor || '#ffffff',
                letterSpacing: '0.01em',
              }}
            >
              {title}
            </span>
            {badge && (
              <span
                className="mono-metric"
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: accentBorder,
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  padding: '0.1rem 0.38rem',
                  borderRadius: '4px',
                }}
              >
                {badge}
              </span>
            )}
          </div>
        )}

        {description && (
          <p
            style={{
              fontSize: '0.69rem',
              color: 'rgba(255, 255, 255, 0.82)',
              lineHeight: 1.45,
              margin: 0,
              whiteSpace: 'normal',
            }}
          >
            {description}
          </p>
        )}

        {hint && (
          <div
            style={{
              marginTop: title || description ? '0.4rem' : 0,
              paddingTop: title || description ? '0.32rem' : 0,
              borderTop: title || description ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.63rem',
              fontWeight: 600,
              color: accentBorder,
              whiteSpace: 'nowrap',
            }}
          >
            <span>{hint}</span>
          </div>
        )}
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
