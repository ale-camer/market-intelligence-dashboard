import React, { useState } from 'react';

/**
 * Homogeneous Hover Popover & Highlight Module (`HoverTooltip`).
 * Ensures every interactive control across the application shares a consistent
 * glassmorphic hover card and visual highlight state.
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

  const getPopoverPosition = () => {
    const base = {
      position: 'absolute',
      zIndex: 120,
      pointerEvents: 'none',
    };

    switch (placement) {
      case 'bottom':
        return { ...base, top: 'calc(100% + 9px)', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-left':
        return { ...base, top: 'calc(100% + 9px)', left: 0 };
      case 'bottom-right':
        return { ...base, top: 'calc(100% + 9px)', right: 0 };
      case 'top-left':
        return { ...base, bottom: 'calc(100% + 9px)', left: 0 };
      case 'top-right':
        return { ...base, bottom: 'calc(100% + 9px)', right: 0 };
      case 'top':
      default:
        return { ...base, bottom: 'calc(100% + 9px)', left: '50%', transform: 'translateX(-50%)' };
    }
  };

  const accentBorder = statusColor || 'var(--accent)';

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        pointerEvents: 'auto',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {typeof children === 'function' ? children(hovered) : children}

      {hovered && !disabled && (title || description || hint) && (
        <div
          style={{
            ...getPopoverPosition(),
            backgroundColor: 'rgba(10, 14, 23, 0.94)',
            backdropFilter: 'blur(14px)',
            border: `1px solid ${accentBorder}`,
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.65), 0 0 14px rgba(16, 185, 129, 0.14)',
            borderRadius: '8px',
            padding: description ? '0.6rem 0.85rem' : '0.35rem 0.65rem',
            minWidth: description ? '220px' : 'max-content',
            maxWidth: '280px',
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
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: accentBorder,
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    padding: '0.1rem 0.35rem',
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
                color: 'rgba(255, 255, 255, 0.78)',
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
      )}
    </div>
  );
}

