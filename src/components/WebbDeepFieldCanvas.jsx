import React, { useEffect, useRef, useState } from 'react';
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

const SharedDarkPieces = [
  {
    id: 0,
    short: '01. Pilares de la Creación ⟷ Superficie de Volatilidad',
    title: '01. Pilares de la Creación ⟷ Superficie de Volatilidad',
    medium: 'Modo Oscuro • Pilares infrarrojos del JWST (NGC 3324) y Variedad σ(K,T) de Black-Scholes',
  },
  {
    id: 1,
    short: '02. Anillo de Einstein ⟷ Frontera de Markowitz',
    title: '02. Anillo de Einstein ⟷ Frontera de Markowitz',
    medium: 'Modo Oscuro • Lente gravitacional relativista (SMACS 0723) y Tangencia óptima riesgo-retorno',
  },
  {
    id: 2,
    short: '03. Nebulosa Reloj de Arena ⟷ Profundidad Order Book',
    title: '03. Nebulosa Reloj de Arena ⟷ Profundidad Order Book',
    medium: 'Modo Oscuro • Onda de choque protoestelar (L1527) y Microestructura de liquidez V(p,t)',
  },
  {
    id: 3,
    short: '04. Nebulosa Anillo del Sur ⟷ Difusión de Itô',
    title: '04. Nebulosa Anillo del Sur ⟷ Difusión de Itô',
    medium: 'Modo Oscuro • Eyección estelar concéntrica (NGC 3132) y Dispersión de Fokker-Planck',
  },
];

export const DARK_ARTWORKS = {
  EN: SharedDarkPieces,
  ES: SharedDarkPieces,
};

const SharedLightPieces = [
  {
    id: 0,
    short: '01. Girasol Fibonacci ⟷ Espiral Áurea',
    title: '01. Girasol Fibonacci ⟷ Espiral Áurea',
    medium: '1ra Tanda • Filotaxis de semillas (137.5°) y anillos de proporción áurea (23.6% • 38.2% • 61.8%)',
  },
  {
    id: 1,
    short: '02. Flor Sakura ⟷ Ondas de Fourier',
    title: '02. Flor Sakura ⟷ Ondas de Fourier',
    medium: '1ra Tanda • Rosa polar de 5 pétalos y descomposición espectral de ciclos de Fourier',
  },
  {
    id: 2,
    short: '03. Mariposa Monarca ⟷ Atractor de Lorenz',
    title: '03. Mariposa Monarca ⟷ Atractor de Lorenz',
    medium: '1ra Tanda • Simetría lepidóptera en vuelo y Efecto Mariposa de caos no lineal',
  },
  {
    id: 3,
    short: '04. Helecho Fractal ⟷ Árbol Isolation Forest',
    title: '04. Helecho Fractal ⟷ Árbol Isolation Forest',
    medium: '1ra Tanda • Frondas de helecho de Barnsley y árbol binario de anomalías (P-06)',
  },
  {
    id: 4,
    short: '05. Diente de León ⟷ Cono de Kelly',
    title: '05. Diente de León ⟷ Cono de Kelly',
    medium: '1ra/2da Tanda • Esfera radial de 32 rayos al viento y curvas de crecimiento óptimo de Kelly',
  },
  {
    id: 5,
    short: '06. Bandada en Vuelo ⟷ 3 Regímenes de Markov',
    title: '06. Bandada en Vuelo ⟷ 3 Regímenes de Markov',
    medium: '2da Tanda • Murmuración de golondrinas y transición orbital (Calma • Transición • Estrés)',
  },
  {
    id: 6,
    short: '07. Cordillera & Ríos ⟷ Topografía Iso-Sharpe',
    title: '07. Cordillera & Ríos ⟷ Topografía Iso-Sharpe',
    medium: '2da Tanda • Valle verde con río de deshielo y curvas de nivel de eficiencia riesgo-retorno',
  },
  {
    id: 7,
    short: '08. Panal & Lavanda ⟷ Red de Correlación',
    title: '08. Panal & Lavanda ⟷ Red de Correlación',
    medium: '2da Tanda • Celdas hexagonales de colmena y constelación de 7 clusters de activos (ENB)',
  },
  {
    id: 8,
    short: '09. Flor de Loto ⟷ Interferencia de Ondas',
    title: '09. Flor de Loto ⟷ Interferencia de Ondas',
    medium: '2da Tanda • Mandala de loto en estanque y propagación armónica de volatilidad',
  },
  {
    id: 9,
    short: '10. Caracola Nautilus ⟷ Canal de Regresión OLS',
    title: '10. Caracola Nautilus ⟷ Canal de Regresión OLS',
    medium: '2da Tanda • Cámaras septales marinas y canal de tendencia lineal con bandas ±2σ',
  },
  {
    id: 10,
    short: '11. Árbol Copa & Raíces ⟷ Grafo Pipeline DAG',
    title: '11. Árbol Copa & Raíces ⟷ Grafo Pipeline DAG',
    medium: '2da Tanda • Árbol frondoso con raíces y topología de 4 etapas (módulos P-01..P-13)',
  },
  {
    id: 11,
    short: '12. ADN Botánico ⟷ Cointegración (Pairs)',
    title: '12. ADN Botánico ⟷ Cointegración (Pairs)',
    medium: '2da Tanda • Doble hélice viva entrelazada y reversión a la media estadística (±2σ)',
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
  selectedLightScene = null, // null = auto cycle, 0..11 = fixed scene
  selectedDarkScene = null, // null = auto cycle, 0..3 = fixed scene
  morphOverride = null, // null = auto sine wave, 0 = 100% Nature, 1 = 100% Quant
  onActiveSceneChange = null,
}) {
  const canvasRef = useRef(null);
  const [activeLightIdx, setActiveLightIdx] = useState(
    selectedLightScene !== null ? Number(selectedLightScene) % 12 : 0
  );
  const [activeDarkIdx, setActiveDarkIdx] = useState(
    selectedDarkScene !== null ? Number(selectedDarkScene) % 4 : 0
  );

  const isPausedRef = useRef(isPaused);
  const lightModeRef = useRef(lightMode);
  const selectedLightSceneRef = useRef(selectedLightScene);
  const selectedDarkSceneRef = useRef(selectedDarkScene);
  const morphOverrideRef = useRef(morphOverride);
  const onActiveSceneChangeRef = useRef(onActiveSceneChange);
  const lastReportedLightRef = useRef(activeLightIdx);
  const lastReportedDarkRef = useRef(activeDarkIdx);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    lightModeRef.current = lightMode;
  }, [lightMode]);

  useEffect(() => {
    selectedLightSceneRef.current = selectedLightScene;
    if (selectedLightScene !== null) {
      const idx = Number(selectedLightScene) % 12;
      lastReportedLightRef.current = idx;
      setActiveLightIdx(idx);
    }
  }, [selectedLightScene]);

  useEffect(() => {
    selectedDarkSceneRef.current = selectedDarkScene;
    if (selectedDarkScene !== null) {
      const idx = Number(selectedDarkScene) % 4;
      lastReportedDarkRef.current = idx;
      setActiveDarkIdx(idx);
    }
  }, [selectedDarkScene]);

  useEffect(() => {
    morphOverrideRef.current = morphOverride;
  }, [morphOverride]);

  useEffect(() => {
    onActiveSceneChangeRef.current = onActiveSceneChange;
  }, [onActiveSceneChange]);

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
    let sceneA = selectedLightSceneRef.current !== null ? Number(selectedLightSceneRef.current) % 12 : 0;
    let sceneB = sceneA;
    let sceneMix = 0;
    let lastTargetScene = selectedLightSceneRef.current;

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
          if (selectedLightSceneRef.current !== null) {
            const target = Number(selectedLightSceneRef.current) % 12;
            if (lastTargetScene !== target) {
              // Smooth direct particle transition from current visible scene to the clicked scene
              sceneA = sceneMix > 0.5 ? sceneB : sceneA;
              sceneB = target;
              sceneMix = 0.0;
              lastTargetScene = target;
            }
            sceneMix = Math.min(1.0, sceneMix + dt * 0.85);
            activePairIdx = sceneB;
          } else {
            lastTargetScene = null;
            const autoPhase = (elapsed * 0.075) % 12.0;
            sceneA = Math.floor(autoPhase) % 12;
            sceneB = (sceneA + 1) % 12;
            // Hold each scene clearly for 68% of the slot, then smoothly glide to the next over 32%
            const slotFrac = autoPhase - Math.floor(autoPhase);
            sceneMix = Math.max(0.0, Math.min(1.0, (slotFrac - 0.68) / 0.32));
            activePairIdx = sceneMix > 0.5 ? sceneB : sceneA;
          }

          if (lastReportedLightRef.current !== activePairIdx) {
            lastReportedLightRef.current = activePairIdx;
            setActiveLightIdx(activePairIdx);
            if (onActiveSceneChangeRef.current) {
              onActiveSceneChangeRef.current(activePairIdx, true);
            }
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
          let activePair = 0;
          let pairIdx = 0;
          if (selectedDarkSceneRef.current !== null) {
            pairIdx = Number(selectedDarkSceneRef.current) % 4;
            activePair = pairIdx;
          } else {
            activePair = (elapsed * 0.12) % 4.0;
            pairIdx = Math.floor(activePair) % 4;
          }

          if (lastReportedDarkRef.current !== pairIdx) {
            lastReportedDarkRef.current = pairIdx;
            setActiveDarkIdx(pairIdx);
            if (onActiveSceneChangeRef.current) {
              onActiveSceneChangeRef.current(pairIdx, false);
            }
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

  const currentList = lightMode
    ? LIGHT_ARTWORKS[lang] || LIGHT_ARTWORKS.EN
    : DARK_ARTWORKS[lang] || DARK_ARTWORKS.EN;
  const activeIdx = lightMode
    ? selectedLightScene !== null
      ? Number(selectedLightScene) % 12
      : activeLightIdx
    : selectedDarkScene !== null
    ? Number(selectedDarkScene) % 4
    : activeDarkIdx;
  const currentPiece = currentList[activeIdx] || currentList[0];

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
          maxWidth: '680px',
        }}
      >
        <div
          className="serif-heading"
          style={{
            fontSize: '0.88rem',
            fontStyle: 'italic',
            color: lightMode ? 'rgba(20, 32, 26, 0.90)' : 'rgba(255, 255, 255, 0.84)',
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          {currentPiece.title}
        </div>
        <div
          style={{
            fontSize: '0.68rem',
            color: lightMode ? 'rgba(40, 58, 48, 0.62)' : 'rgba(255, 255, 255, 0.45)',
            letterSpacing: '0.03em',
          }}
        >
          {currentPiece.medium}
        </div>
      </div>
    </div>
  );
}



