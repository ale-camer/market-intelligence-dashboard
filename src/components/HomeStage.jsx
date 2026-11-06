import React from 'react';
import WebbDeepFieldCanvas from './WebbDeepFieldCanvas';

export default function HomeStage({ isHome, langCode, t, lightMode = false }) {
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
      <WebbDeepFieldCanvas isPaused={!isHome} lang={langCode} lightMode={lightMode} />

      {/* INTRODUCTORY TEXT POSITIONED LOWER OVER THE STAGE */}
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
    </div>
  );
}

