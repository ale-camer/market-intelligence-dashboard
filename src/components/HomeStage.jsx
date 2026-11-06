import React, { useState, useCallback } from 'react';
import WebbDeepFieldCanvas, { LIGHT_ARTWORKS, DARK_ARTWORKS } from './WebbDeepFieldCanvas';

export default function HomeStage({ isHome, langCode, t }) {
  const [lightMode, setLightMode] = useState(true);
  const [selectedLightScene, setSelectedLightScene] = useState(0); // 0..11 or null for auto-rotate
  const [selectedDarkScene, setSelectedDarkScene] = useState(null); // 0..3 or null for auto-rotate
  const [liveLightIdx, setLiveLightIdx] = useState(0);
  const [liveDarkIdx, setLiveDarkIdx] = useState(0);
  const [morphMode, setMorphMode] = useState('auto'); // 'nature' (0) | 'auto' (null) | 'quant' (1)

  const morphOverride =
    morphMode === 'nature' ? 0.0 : morphMode === 'quant' ? 1.0 : null;

  const lightScenes = LIGHT_ARTWORKS.ES;
  const darkScenes = DARK_ARTWORKS.ES;

  const handleActiveSceneChange = useCallback((idx, isLight) => {
    if (isLight) {
      setLiveLightIdx(idx);
    } else {
      setLiveDarkIdx(idx);
    }
  }, []);

  const currentScenes = lightMode ? lightScenes : darkScenes;
  const selectedScene = lightMode ? selectedLightScene : selectedDarkScene;
  const activePlayingIdx =
    selectedScene !== null ? selectedScene : lightMode ? liveLightIdx : liveDarkIdx;

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
        selectedLightScene={selectedLightScene}
        selectedDarkScene={selectedDarkScene}
        morphOverride={morphOverride}
        onActiveSceneChange={handleActiveSceneChange}
      />

      {/* INTRODUCTORY TEXT POSITIONED OVER THE STAGE */}
      <div
        style={{
          position: 'absolute',
          top: '10.5%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
          textAlign: 'center',
          width: '90%',
          maxWidth: '720px',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
        }}
      >
        <h1
          className="serif-heading"
          style={{
            fontSize: '1.52rem',
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
            fontSize: '0.88rem',
            color: lightMode ? 'rgba(34, 52, 42, 0.72)' : 'rgba(255, 255, 255, 0.68)',
            lineHeight: 1.5,
            fontWeight: 400,
            margin: 0,
            transition: 'color 0.3s ease',
          }}
        >
          {t.homeBrief}
        </p>
      </div>

      {/* INTERACTIVE CATALOG SELECTOR FOR SPRING/NATURE LIGHT MODE (01..12) VS COSMOS DARK MODE (01..04) */}
      <div
        style={{
          position: 'absolute',
          top: '21.5%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 25,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.42rem',
          width: '95%',
          maxWidth: '980px',
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
            padding: '0.26rem 0.5rem',
            borderRadius: '999px',
            background: lightMode
              ? 'rgba(255, 255, 255, 0.84)'
              : 'rgba(12, 18, 30, 0.84)',
            border: lightMode
              ? '1px solid rgba(16, 85, 55, 0.18)'
              : '1px solid rgba(255, 255, 255, 0.16)',
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
            ☀ Claro: 12 Propuestas (01–12)
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
            ☾ Oscuro: 4 Cosmos JWST (01–04)
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

        {/* Row 2: Ordinal Numbered Scene Selector (01..12 in Light Mode, 01..04 in Dark Mode) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
            padding: '0.32rem 0.55rem',
            borderRadius: '14px',
            background: lightMode
              ? 'rgba(255, 255, 255, 0.80)'
              : 'rgba(12, 18, 30, 0.80)',
            border: lightMode
              ? '1px solid rgba(16, 85, 55, 0.15)'
              : '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: lightMode
              ? '0 4px 16px rgba(20, 40, 30, 0.06)'
              : '0 4px 16px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {currentScenes.map((sc) => {
            const isActive = activePlayingIdx === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() =>
                  lightMode ? setSelectedLightScene(sc.id) : setSelectedDarkScene(sc.id)
                }
                style={{
                  padding: '0.21rem 0.52rem',
                  borderRadius: '999px',
                  border: isActive
                    ? lightMode
                      ? '1px solid #0d6e4f'
                      : '1px solid var(--ui-accent)'
                    : lightMode
                    ? '1px solid rgba(15, 40, 30, 0.12)'
                    : '1px solid rgba(255, 255, 255, 0.14)',
                  cursor: 'pointer',
                  fontSize: '0.68rem',
                  fontWeight: isActive ? 700 : 500,
                  background: isActive
                    ? lightMode
                      ? '#0d6e4f'
                      : 'var(--ui-accent)'
                    : lightMode
                    ? 'rgba(246, 244, 236, 0.78)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isActive
                    ? lightMode
                      ? '#ffffff'
                      : '#04120c'
                    : lightMode
                    ? 'rgba(24, 42, 34, 0.85)'
                    : 'rgba(226, 232, 240, 0.82)',
                  transition: 'all 0.14s ease',
                }}
              >
                {sc.short}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() =>
              lightMode ? setSelectedLightScene(null) : setSelectedDarkScene(null)
            }
            style={{
              padding: '0.21rem 0.56rem',
              borderRadius: '999px',
              border:
                selectedScene === null
                  ? '1px solid #d9386a'
                  : '1px solid rgba(217, 56, 106, 0.30)',
              cursor: 'pointer',
              fontSize: '0.68rem',
              fontWeight: 700,
              background:
                selectedScene === null ? '#d9386a' : 'rgba(217, 56, 106, 0.10)',
              color: selectedScene === null ? '#ffffff' : '#e11d48',
            }}
          >
            {lightMode ? '↻ Rotar las 12' : '↻ Rotar las 4'}
          </button>
        </div>
      </div>
    </div>
  );
}

