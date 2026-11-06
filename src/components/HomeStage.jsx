import React, { useState } from 'react';
import WebbDeepFieldCanvas, { LIGHT_ARTWORKS } from './WebbDeepFieldCanvas';

export default function HomeStage({ isHome, langCode, t }) {
  const [lightMode, setLightMode] = useState(true);
  const [selectedScene, setSelectedScene] = useState(0); // 0..7 or null for auto-rotate
  const [morphMode, setMorphMode] = useState('auto'); // 'nature' (0) | 'auto' (null) | 'quant' (1)

  const morphOverride =
    morphMode === 'nature' ? 0.0 : morphMode === 'quant' ? 1.0 : null;

  const scenes = LIGHT_ARTWORKS.ES;

  return (
    <div
      style={{
        display: isHome ? 'block' : 'none',
        position: 'relative',
        flex: 1,
        width: '100%',
        height: '100%',
        minHeight: 0,
        backgroundColor: lightMode ? '#F6F4EC' : '#000000',
        overflow: 'hidden',
        transition: 'background-color 0.35s ease',
      }}
    >
      <WebbDeepFieldCanvas
        isPaused={!isHome}
        lang={langCode}
        lightMode={lightMode}
        selectedLightScene={selectedScene}
        morphOverride={morphOverride}
      />

      {/* INTRODUCTORY TEXT POSITIONED OVER THE STAGE */}
      <div
        style={{
          position: 'absolute',
          top: '11.5%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
          textAlign: 'center',
          width: '90%',
          maxWidth: '720px',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
        }}
      >
        <h1
          className="serif-heading"
          style={{
            fontSize: '1.55rem',
            fontWeight: 600,
            color: lightMode ? 'rgba(18, 28, 22, 0.94)' : 'rgba(255, 255, 255, 0.94)',
            letterSpacing: '-0.01em',
            margin: 0,
            transition: 'color 0.3s ease',
          }}
        >
          {t.homeHeadline}
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: lightMode ? 'rgba(34, 52, 42, 0.72)' : 'rgba(255, 255, 255, 0.68)',
            lineHeight: 1.55,
            fontWeight: 400,
            margin: 0,
            transition: 'color 0.3s ease',
          }}
        >
          {t.homeBrief}
        </p>
      </div>

      {/* INTERACTIVE CATALOG SELECTOR FOR SPRING/NATURE LIGHT MODE VS COSMOS DARK MODE */}
      <div
        style={{
          position: 'absolute',
          top: '23.5%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 25,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.45rem',
          width: '94%',
          maxWidth: '920px',
          pointerEvents: 'auto',
        }}
      >
        {/* Row 1: Mode Toggle + Morph State Toggle */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.28rem 0.5rem',
            borderRadius: '999px',
            background: lightMode
              ? 'rgba(255, 255, 255, 0.82)'
              : 'rgba(12, 18, 30, 0.82)',
            border: lightMode
              ? '1px solid rgba(16, 85, 55, 0.18)'
              : '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: lightMode
              ? '0 4px 18px rgba(20, 40, 30, 0.08)'
              : '0 4px 18px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <button
            type="button"
            onClick={() => setLightMode(true)}
            style={{
              padding: '0.24rem 0.68rem',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.73rem',
              fontWeight: 700,
              background: lightMode ? '#0d6e4f' : 'transparent',
              color: lightMode ? '#ffffff' : 'rgba(226, 232, 240, 0.78)',
              transition: 'all 0.15s ease',
            }}
          >
            ☀ Claro (Primavera & Tierra)
          </button>
          <button
            type="button"
            onClick={() => setLightMode(false)}
            style={{
              padding: '0.24rem 0.68rem',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.73rem',
              fontWeight: 700,
              background: !lightMode ? 'var(--ui-accent)' : 'transparent',
              color: !lightMode ? '#04120c' : 'rgba(30, 45, 38, 0.72)',
              transition: 'all 0.15s ease',
            }}
          >
            ☾ Oscuro (Cosmos JWST)
          </button>

          <span
            style={{
              width: '1px',
              height: '14px',
              background: lightMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.14)',
              margin: '0 0.15rem',
            }}
          />

          {[
            { id: 'nature', label: lightMode ? '🌿 100% Naturaleza' : '✦ 100% Cosmos' },
            { id: 'auto', label: '⟷ Morph En Vivo' },
            { id: 'quant', label: '📐 100% Quant' },
          ].map((mBtn) => {
            const active = morphMode === mBtn.id;
            return (
              <button
                key={mBtn.id}
                type="button"
                onClick={() => setMorphMode(mBtn.id)}
                style={{
                  padding: '0.22rem 0.58rem',
                  borderRadius: '999px',
                  border: active
                    ? lightMode
                      ? '1px solid #d97706'
                      : '1px solid var(--ui-accent)'
                    : '1px solid transparent',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  fontWeight: active ? 700 : 500,
                  background: active
                    ? lightMode
                      ? 'rgba(217, 119, 6, 0.14)'
                      : 'rgba(var(--ui-accent-rgb), 0.18)'
                    : 'transparent',
                  color: active
                    ? lightMode
                      ? '#92400e'
                      : 'var(--ui-accent)'
                    : lightMode
                    ? 'rgba(30, 45, 38, 0.68)'
                    : 'rgba(226, 232, 240, 0.68)',
                }}
              >
                {mBtn.label}
              </button>
            );
          })}
        </div>

        {/* Row 2: 8 Spring/Nature Scenes Selector (visible in Light Mode) */}
        {lightMode && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.32rem',
              padding: '0.32rem 0.55rem',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.78)',
              border: '1px solid rgba(16, 85, 55, 0.15)',
              boxShadow: '0 4px 16px rgba(20, 40, 30, 0.06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {scenes.map((sc) => {
              const isSelected = selectedScene === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedScene(sc.id)}
                  style={{
                    padding: '0.22rem 0.55rem',
                    borderRadius: '999px',
                    border: isSelected
                      ? '1px solid #0d6e4f'
                      : '1px solid rgba(15, 40, 30, 0.10)',
                    cursor: 'pointer',
                    fontSize: '0.69rem',
                    fontWeight: isSelected ? 700 : 500,
                    background: isSelected ? '#0d6e4f' : 'rgba(246, 244, 236, 0.7)',
                    color: isSelected ? '#ffffff' : 'rgba(24, 42, 34, 0.82)',
                    transition: 'all 0.14s ease',
                  }}
                >
                  {sc.short}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setSelectedScene(null)}
              style={{
                padding: '0.22rem 0.58rem',
                borderRadius: '999px',
                border:
                  selectedScene === null
                    ? '1px solid #d9386a'
                    : '1px solid rgba(217, 56, 106, 0.25)',
                cursor: 'pointer',
                fontSize: '0.69rem',
                fontWeight: 700,
                background:
                  selectedScene === null ? '#d9386a' : 'rgba(217, 56, 106, 0.08)',
                color: selectedScene === null ? '#ffffff' : '#be185d',
              }}
            >
              ↻ Rotar las 8
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

