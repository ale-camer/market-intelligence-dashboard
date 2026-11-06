import React, { useState, useCallback } from 'react';
import WebbDeepFieldCanvas, { LIGHT_ARTWORKS, DARK_ARTWORKS } from './WebbDeepFieldCanvas';

export default function HomeStage({ isHome, langCode, t }) {
  const [lightMode, setLightMode] = useState(true);
  const [selectedScene, setSelectedScene] = useState(null); // null = continuous auto-rotation identical to Dark Mode
  const [liveIdx, setLiveIdx] = useState(0);

  const handleActiveSceneChange = useCallback((idx) => {
    setLiveIdx(idx);
  }, []);

  const currentScenes = lightMode
    ? LIGHT_ARTWORKS[langCode] || LIGHT_ARTWORKS.ES
    : DARK_ARTWORKS[langCode] || DARK_ARTWORKS.ES;
  const activePlayingIdx = selectedScene !== null ? selectedScene : liveIdx;

  return (
    <div
      style={{
        display: isHome ? 'block' : 'none',
        position: 'relative',
        flex: 1,
        width: '100%',
        height: '100%',
        minHeight: 0,
        backgroundColor: lightMode ? '#DAF3EE' : '#000000',
        overflow: 'hidden',
        transition: 'background-color 0.35s ease',
      }}
    >
      <WebbDeepFieldCanvas
        isPaused={!isHome}
        lang={langCode}
        lightMode={lightMode}
        selectedScene={selectedScene}
        onActiveSceneChange={handleActiveSceneChange}
      />

      {/* INTRODUCTORY TEXT POSITIONED OVER THE STAGE (EXACT SAME POSITION AS DARK MODE: top 18.5%) */}
      <div
        style={{
          position: 'absolute',
          top: '18.5%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
          textAlign: 'center',
          width: '90%',
          maxWidth: '700px',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
        }}
      >
        <h1
          className="serif-heading"
          style={{
            fontSize: '1.55rem',
            fontWeight: 600,
            color: lightMode ? 'rgba(14, 28, 22, 0.94)' : 'rgba(255, 255, 255, 0.94)',
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
            color: lightMode ? 'rgba(28, 52, 40, 0.74)' : 'rgba(255, 255, 255, 0.68)',
            lineHeight: 1.6,
            fontWeight: 400,
            margin: 0,
            transition: 'color 0.3s ease',
          }}
        >
          {t.homeBrief}
        </p>
      </div>

      {/* DISCREET CORNER DOCK (BOTTOM-RIGHT, LEAVING STAGE 100% CLEAN LIKE DARK MODE) */}
      <div
        style={{
          position: 'absolute',
          bottom: '0.65rem',
          right: '1.25rem',
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          gap: '0.28rem',
          padding: '0.22rem 0.42rem',
          borderRadius: '999px',
          background: lightMode ? 'rgba(255, 255, 255, 0.72)' : 'rgba(12, 18, 30, 0.72)',
          border: lightMode
            ? '1px solid rgba(16, 85, 55, 0.16)'
            : '1px solid rgba(255, 255, 255, 0.14)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <button
          type="button"
          onClick={() => setLightMode(true)}
          style={{
            padding: '0.18rem 0.52rem',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.68rem',
            fontWeight: 700,
            background: lightMode ? '#0d6e4f' : 'transparent',
            color: lightMode ? '#ffffff' : 'rgba(226, 232, 240, 0.72)',
          }}
        >
          ☀ Claro
        </button>
        <button
          type="button"
          onClick={() => setLightMode(false)}
          style={{
            padding: '0.18rem 0.52rem',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.68rem',
            fontWeight: 700,
            background: !lightMode ? 'var(--ui-accent)' : 'transparent',
            color: !lightMode ? '#04120c' : 'rgba(24, 42, 34, 0.68)',
          }}
        >
          ☾ Oscuro
        </button>

        <span
          style={{
            width: '1px',
            height: '12px',
            background: lightMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.14)',
            margin: '0 0.1rem',
          }}
        />

        {currentScenes.map((sc) => {
          const isActive = activePlayingIdx === sc.id;
          const numLabel = `0${sc.id + 1}`;
          return (
            <button
              key={sc.id}
              type="button"
              title={sc.title}
              onClick={() => setSelectedScene(sc.id)}
              style={{
                padding: '0.16rem 0.38rem',
                borderRadius: '999px',
                border: isActive
                  ? lightMode
                    ? '1px solid #0d6e4f'
                    : '1px solid var(--ui-accent)'
                  : '1px solid transparent',
                cursor: 'pointer',
                fontSize: '0.66rem',
                fontWeight: isActive ? 700 : 500,
                background: isActive
                  ? lightMode
                    ? 'rgba(13, 110, 79, 0.14)'
                    : 'rgba(var(--ui-accent-rgb), 0.18)'
                  : 'transparent',
                color: isActive
                  ? lightMode
                    ? '#0d6e4f'
                    : 'var(--ui-accent)'
                  : lightMode
                  ? 'rgba(24, 42, 34, 0.68)'
                  : 'rgba(226, 232, 240, 0.68)',
              }}
            >
              {numLabel}
            </button>
          );
        })}
        <button
          type="button"
          title="Rotación automática continua (01–04)"
          onClick={() => setSelectedScene(null)}
          style={{
            padding: '0.16rem 0.42rem',
            borderRadius: '999px',
            border:
              selectedScene === null
                ? '1px solid #d9386a'
                : '1px solid transparent',
            cursor: 'pointer',
            fontSize: '0.66rem',
            fontWeight: 700,
            background:
              selectedScene === null ? 'rgba(217, 56, 106, 0.14)' : 'transparent',
            color:
              selectedScene === null
                ? '#be185d'
                : lightMode
                ? 'rgba(24, 42, 34, 0.62)'
                : 'rgba(226, 232, 240, 0.62)',
          }}
        >
          ↻ Auto
        </button>
      </div>
    </div>
  );
}

