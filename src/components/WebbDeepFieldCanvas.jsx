import React, { useEffect, useRef } from 'react';
import {
  BG_VERTEX_SHADER,
  BG_FRAGMENT_SHADER,
  PARTICLE_VERTEX_SHADER,
  PARTICLE_FRAGMENT_SHADER,
  LIGHT_BG_FRAGMENT_SHADER,
  LIGHT_PARTICLE_VERTEX_SHADER,
  LIGHT_PARTICLE_FRAGMENT_SHADER,
} from './webbHorizonShaders';

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('WebGL Shader Error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('WebGL Program Error:', gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

const ARTWORKS = {
  EN: [
    {
      title: 'Pillars of Creation (NGC 3324)  ⟷  Implied Volatility Surface σ(K,T)',
      medium: 'JWST Near-Infrared Dust Pillars • Black-Scholes-Merton Manifold',
    },
    {
      title: 'Einstein Gravitational Ring (SMACS 0723)  ⟷  Markowitz Efficient Frontier',
      medium: 'Relativistic Spacetime Lensing • Optimal Risk-Return Tangency',
    },
    {
      title: 'Bipolar Hourglass Nebula (L1527)  ⟷  Limit Order Book Depth V(p,t)',
      medium: 'Protostellar Accretion Shockwave • High-Frequency Liquidity Microstructure',
    },
    {
      title: 'Southern Ring Nebula (NGC 3132)  ⟷  Itô-Fokker-Planck Probability Density',
      medium: 'Concentric Stellar Ejecta Shells • Stochastic Dispersion Trajectories',
    },
  ],
  ES: [
    {
      title: 'Pilares de la Creación (NGC 3324)  ⟷  Superficie de Volatilidad Implícita σ(K,T)',
      medium: 'Pilares infrarrojos del JWST • Variedad de Black-Scholes-Merton',
    },
    {
      title: 'Anillo Gravitacional de Einstein (SMACS 0723)  ⟷  Frontera Eficiente de Markowitz',
      medium: 'Lente gravitacional relativista • Tangencia óptima riesgo-retorno',
    },
    {
      title: 'Nebulosa Reloj de Arena Bipolar (L1527)  ⟷  Profundidad de Order Book V(p,t)',
      medium: 'Onda de choque protoestelar • Microestructura de liquidez de alta frecuencia',
    },
    {
      title: 'Nebulosa del Anillo del Sur (NGC 3132)  ⟷  Densidad de Difusión de Itô-Fokker-Planck',
      medium: 'Capas concéntricas de eyección estelar • Trayectorias de dispersión estocástica',
    },
  ],
};

const SharedLightPieces = [
  {
    id: 0,
    short: '01. Girasol Fibonacci ⟷ Espiral Áurea',
    title: '01. Girasol Fibonacci ⟷ Espiral Áurea',
    medium: 'Filotaxis de semillas (137.5°) • Proporción áurea y anillos de Fibonacci (23.6% • 38.2% • 61.8%)',
  },
  {
    id: 1,
    short: '02. Flor de Loto ⟷ Interferencia de Ondas',
    title: '02. Flor de Loto ⟷ Interferencia de Ondas',
    medium: 'Mandala de loto y anillos de estanque • Propagación armónica y contagio de volatilidad',
  },
  {
    id: 2,
    short: '03. Caracola Nautilus ⟷ Canal de Regresión OLS',
    title: '03. Caracola Nautilus ⟷ Canal de Regresión OLS',
    medium: 'Cámaras septales en espiral • Ciclos de Elliott y bandas de desviación estándar (±2σ)',
  },
  {
    id: 3,
    short: '04. Bandada en Vuelo ⟷ 3 Regímenes de Markov',
    title: '04. Bandada en Vuelo ⟷ 3 Regímenes de Markov',
    medium: 'Murmuración de golondrinas • Matriz de transición (Calma • Transición • Estrés)',
  },
  {
    id: 4,
    short: '05. Cordillera & Ríos ⟷ Topografía Iso-Sharpe',
    title: '05. Cordillera & Ríos ⟷ Topografía Iso-Sharpe',
    medium: 'Valle primaveral y deshielo glaciar • Curvas de nivel de eficiencia riesgo-retorno',
  },
  {
    id: 5,
    short: '06. Panal & Lavanda ⟷ Red de Correlación (ENB)',
    title: '06. Panal & Lavanda ⟷ Red de Correlación (ENB)',
    medium: 'Teselación hexagonal de Voronoi • Constelación de 7 clusters de diversificación real',
  },
  {
    id: 6,
    short: '07. Árbol Copa & Raíces ⟷ Grafo Pipeline DAG',
    title: '07. Árbol Copa & Raíces ⟷ Grafo Pipeline DAG',
    medium: 'Árbol frondoso en flor y raíces • Topología de 4 etapas y contratos de datos (P-01..P-13)',
  },
  {
    id: 7,
    short: '08. Rosa de los Vientos ⟷ Radar Multi-Factor',
    title: '08. Rosa de los Vientos ⟷ Radar Multi-Factor',
    medium: 'Estrella náutica de 8 puntas • Polígono polar de 6 factores (Momentum • Value • Quality • Low-Vol)',
  },
  {
    id: 8,
    short: '09. ADN Botánico ⟷ Cointegración (Pairs Trading)',
    title: '09. ADN Botánico ⟷ Cointegración (Pairs Trading)',
    medium: 'Doble hélice viva entrelazada • Equilibrio estadístico y reversión a la media (±2σ)',
  },
  {
    id: 9,
    short: '10. Diente de León ⟷ Cono de Kelly',
    title: '10. Diente de León ⟷ Cono de Kelly',
    medium: 'Esfera radial de 32 rayos y semillas al viento • Cresta óptima de crecimiento compuesto g(f*)',
  },
];

export const LIGHT_ARTWORKS = {
  EN: SharedLightPieces,
  ES: SharedLightPieces,
};

export default function WebbDeepFieldCanvas({
  isPaused = false,
  lang = 'EN',
  lightMode = false,
  selectedLightScene = null, // null = auto cycle, 0..7 = fixed scene
  morphOverride = null, // null = auto sine wave, 0 = 100% Nature, 1 = 100% Quant
}) {
  const canvasRef = useRef(null);
  const artworkTitleRef = useRef(null);
  const artworkMediumRef = useRef(null);
  const langRef = useRef(lang);
  const isPausedRef = useRef(isPaused);
  const lightModeRef = useRef(lightMode);
  const selectedSceneRef = useRef(selectedLightScene);
  const morphOverrideRef = useRef(morphOverride);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    lightModeRef.current = lightMode;
  }, [lightMode]);

  useEffect(() => {
    selectedSceneRef.current = selectedLightScene;
  }, [selectedLightScene]);

  useEffect(() => {
    morphOverrideRef.current = morphOverride;
  }, [morphOverride]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance',
    });
    if (!gl) return;

    const bgProgram = createProgram(gl, BG_VERTEX_SHADER, BG_FRAGMENT_SHADER);
    const ptProgram = createProgram(gl, PARTICLE_VERTEX_SHADER, PARTICLE_FRAGMENT_SHADER);
    const lightBgProgram = createProgram(gl, BG_VERTEX_SHADER, LIGHT_BG_FRAGMENT_SHADER);
    const lightPtProgram = createProgram(gl, LIGHT_PARTICLE_VERTEX_SHADER, LIGHT_PARTICLE_FRAGMENT_SHADER);
    if (!bgProgram || !ptProgram || !lightBgProgram || !lightPtProgram) return;

    const quadVerts = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

    const PARTICLE_COUNT = 24000;
    const particleSeeds = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const rawU = Math.random() * 2 - 1;
      particleSeeds[i * 3 + 0] = rawU;
      particleSeeds[i * 3 + 1] = Math.random();
      particleSeeds[i * 3 + 2] = Math.random();
    }
    const particleBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, particleBuf);
    gl.bufferData(gl.ARRAY_BUFFER, particleSeeds, gl.STATIC_DRAW);

    const bgPosLoc = gl.getAttribLocation(bgProgram, 'aPos');
    const bgResLoc = gl.getUniformLocation(bgProgram, 'uResolution');
    const bgTimeLoc = gl.getUniformLocation(bgProgram, 'uTime');
    const bgPairLoc = gl.getUniformLocation(bgProgram, 'uPair');
    const bgMorphLoc = gl.getUniformLocation(bgProgram, 'uMorph');
    const bgHorizLoc = gl.getUniformLocation(bgProgram, 'uShowHorizon');

    const ptSeedLoc = gl.getAttribLocation(ptProgram, 'aSeed');
    const ptTimeLoc = gl.getUniformLocation(ptProgram, 'uTime');
    const ptResLoc = gl.getUniformLocation(ptProgram, 'uResolution');
    const ptDprLoc = gl.getUniformLocation(ptProgram, 'uDpr');
    const ptPairLoc = gl.getUniformLocation(ptProgram, 'uPair');
    const ptMorphLoc = gl.getUniformLocation(ptProgram, 'uMorph');

    const lBgPosLoc = gl.getAttribLocation(lightBgProgram, 'aPos');
    const lBgResLoc = gl.getUniformLocation(lightBgProgram, 'uResolution');
    const lBgTimeLoc = gl.getUniformLocation(lightBgProgram, 'uTime');
    const lBgPairLoc = gl.getUniformLocation(lightBgProgram, 'uPair');
    const lBgMorphLoc = gl.getUniformLocation(lightBgProgram, 'uMorph');

    const lPtSeedLoc = gl.getAttribLocation(lightPtProgram, 'aSeed');
    const lPtTimeLoc = gl.getUniformLocation(lightPtProgram, 'uTime');
    const lPtResLoc = gl.getUniformLocation(lightPtProgram, 'uResolution');
    const lPtDprLoc = gl.getUniformLocation(lightPtProgram, 'uDpr');
    const lPtSceneALoc = gl.getUniformLocation(lightPtProgram, 'uSceneA');
    const lPtSceneBLoc = gl.getUniformLocation(lightPtProgram, 'uSceneB');
    const lPtSceneMixLoc = gl.getUniformLocation(lightPtProgram, 'uSceneMix');
    const lPtMorphLoc = gl.getUniformLocation(lightPtProgram, 'uMorph');

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      if (!canvas.parentElement) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      const rawW = rect.width > 10 ? rect.width : window.innerWidth;
      const rawH = rect.height > 10 ? rect.height : window.innerHeight;
      const width = Math.max(1, Math.floor(rawW * dpr));
      const height = Math.max(1, Math.floor(rawH * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let animId;
    let lastTime = performance.now();
    let elapsed = 0;
    let sceneA = 0;
    let sceneB = 0;
    let sceneMix = 0;
    let lastTargetScene = selectedSceneRef.current;

    const render = (now) => {
      const dt = Math.min(0.1, Math.max(0, (now - lastTime) * 0.001));
      lastTime = now;

      if (!isPausedRef.current) {
        resize();
        elapsed += dt;

        const isLight = lightModeRef.current;
        const activeMorph =
          morphOverrideRef.current !== null
            ? morphOverrideRef.current
            : 0.5 - 0.5 * Math.cos(elapsed * (isLight ? 0.36 : 0.65));

        if (isLight) {
          let activePairIdx = 0;
          if (selectedSceneRef.current !== null) {
            const target = Number(selectedSceneRef.current) % 10;
            if (lastTargetScene !== target) {
              // Start a smooth direct particle transition from current visible scene to the clicked scene
              sceneA = sceneMix > 0.5 ? sceneB : sceneA;
              sceneB = target;
              sceneMix = 0.0;
              lastTargetScene = target;
            }
            sceneMix = Math.min(1.0, sceneMix + dt * 0.85);
            activePairIdx = sceneB;
          } else {
            lastTargetScene = null;
            const autoPhase = (elapsed * 0.075) % 10.0;
            sceneA = Math.floor(autoPhase) % 10;
            sceneB = (sceneA + 1) % 10;
            // Hold each scene clearly for 70% of the slot, then smoothly glide to the next over 30%
            const slotFrac = autoPhase - Math.floor(autoPhase);
            sceneMix = Math.max(0.0, Math.min(1.0, (slotFrac - 0.68) / 0.32));
            activePairIdx = sceneMix > 0.5 ? sceneB : sceneA;
          }

          const list = LIGHT_ARTWORKS[langRef.current] || LIGHT_ARTWORKS.EN;
          const piece = list[activePairIdx] || list[0];
          if (artworkTitleRef.current && artworkTitleRef.current.textContent !== piece.title) {
            artworkTitleRef.current.textContent = piece.title;
          }
          if (artworkMediumRef.current && artworkMediumRef.current.textContent !== piece.medium) {
            artworkMediumRef.current.textContent = piece.medium;
          }

          gl.disable(gl.BLEND);
          gl.useProgram(lightBgProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
          gl.enableVertexAttribArray(lBgPosLoc);
          gl.vertexAttribPointer(lBgPosLoc, 2, gl.FLOAT, false, 0, 0);
          gl.uniform2f(lBgResLoc, canvas.width, canvas.height);
          gl.uniform1f(lBgTimeLoc, elapsed);
          gl.uniform1f(lBgPairLoc, activePairIdx);
          gl.uniform1f(lBgMorphLoc, activeMorph);
          gl.drawArrays(gl.TRIANGLES, 0, 6);

          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          gl.useProgram(lightPtProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, particleBuf);
          gl.enableVertexAttribArray(lPtSeedLoc);
          gl.vertexAttribPointer(lPtSeedLoc, 3, gl.FLOAT, false, 0, 0);
          gl.uniform1f(lPtTimeLoc, elapsed);
          gl.uniform2f(lPtResLoc, canvas.width, canvas.height);
          gl.uniform1f(lPtDprLoc, dpr);
          gl.uniform1f(lPtSceneALoc, sceneA);
          gl.uniform1f(lPtSceneBLoc, sceneB);
          gl.uniform1f(lPtSceneMixLoc, sceneMix);
          gl.uniform1f(lPtMorphLoc, activeMorph);
          gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
        } else {
          const activePair = (elapsed * 0.12) % 4.0;
          const pairIdx = Math.floor(activePair) % 4;
          const list = ARTWORKS[langRef.current] || ARTWORKS.EN;
          const piece = list[pairIdx];
          if (artworkTitleRef.current && artworkTitleRef.current.textContent !== piece.title) {
            artworkTitleRef.current.textContent = piece.title;
          }
          if (artworkMediumRef.current && artworkMediumRef.current.textContent !== piece.medium) {
            artworkMediumRef.current.textContent = piece.medium;
          }

          gl.disable(gl.BLEND);
          gl.useProgram(bgProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
          gl.enableVertexAttribArray(bgPosLoc);
          gl.vertexAttribPointer(bgPosLoc, 2, gl.FLOAT, false, 0, 0);
          gl.uniform2f(bgResLoc, canvas.width, canvas.height);
          gl.uniform1f(bgTimeLoc, elapsed);
          gl.uniform1f(bgPairLoc, activePair);
          gl.uniform1f(bgMorphLoc, activeMorph);
          gl.uniform1f(bgHorizLoc, 1.0);
          gl.drawArrays(gl.TRIANGLES, 0, 6);

          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
          gl.useProgram(ptProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, particleBuf);
          gl.enableVertexAttribArray(ptSeedLoc);
          gl.vertexAttribPointer(ptSeedLoc, 3, gl.FLOAT, false, 0, 0);
          gl.uniform1f(ptTimeLoc, elapsed);
          gl.uniform2f(ptResLoc, canvas.width, canvas.height);
          gl.uniform1f(ptDprLoc, dpr);
          gl.uniform1f(ptPairLoc, activePair);
          gl.uniform1f(ptMorphLoc, activeMorph);
          gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(quadBuf);
      gl.deleteBuffer(particleBuf);
      gl.deleteProgram(bgProgram);
      gl.deleteProgram(ptProgram);
      gl.deleteProgram(lightBgProgram);
      gl.deleteProgram(lightPtProgram);
    };
  }, []);

  const initialList = lightMode
    ? LIGHT_ARTWORKS[lang] || LIGHT_ARTWORKS.EN
    : ARTWORKS[lang] || ARTWORKS.EN;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        backgroundColor: lightMode ? '#F6F4EC' : '#000000',
        overflow: 'hidden',
        transition: 'background-color 0.35s ease',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* GALLERY ARTWORK PLACARD (BOTTOM-CENTER) */}
      <div
        style={{
          position: 'absolute',
          bottom: '0.65rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '0.15rem',
          width: '90%',
          maxWidth: '640px',
        }}
      >
        <div
          ref={artworkTitleRef}
          className="serif-heading"
          style={{
            fontSize: '0.84rem',
            fontStyle: 'italic',
            color: lightMode ? 'rgba(20, 32, 26, 0.86)' : 'rgba(255, 255, 255, 0.78)',
            fontWeight: 500,
            letterSpacing: '0.01em',
          }}
        >
          {initialList[0].title}
        </div>
        <div
          ref={artworkMediumRef}
          style={{
            fontSize: '0.68rem',
            color: lightMode ? 'rgba(40, 58, 48, 0.56)' : 'rgba(255, 255, 255, 0.38)',
            letterSpacing: '0.03em',
          }}
        >
          {initialList[0].medium}
        </div>
      </div>
    </div>
  );
}



