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

export const DARK_ARTWORKS = {
  EN: [
    {
      id: 0,
      short: '01. Pillars of Creation ⟷ Volatility Surface',
      title: '01. Pillars of Creation (NGC 3324)  ⟷  Implied Volatility Surface σ(K,T)',
      medium: 'JWST Near-Infrared Dust Pillars • Black-Scholes-Merton Manifold',
    },
    {
      id: 1,
      short: '02. Einstein Ring ⟷ Markowitz Frontier',
      title: '02. Einstein Gravitational Ring (SMACS 0723)  ⟷  Markowitz Efficient Frontier',
      medium: 'Relativistic Spacetime Lensing • Optimal Risk-Return Tangency',
    },
    {
      id: 2,
      short: '03. Hourglass Nebula ⟷ Order Book Depth',
      title: '03. Bipolar Hourglass Nebula (L1527)  ⟷  Limit Order Book Depth V(p,t)',
      medium: 'Protostellar Accretion Shockwave • High-Frequency Liquidity Microstructure',
    },
    {
      id: 3,
      short: '04. Southern Ring ⟷ Itô Diffusion',
      title: '04. Southern Ring Nebula (NGC 3132)  ⟷  Itô-Fokker-Planck Probability Density',
      medium: 'Concentric Stellar Ejecta Shells • Stochastic Dispersion Trajectories',
    },
  ],
  ES: [
    {
      id: 0,
      short: '01. Pilares de la Creación ⟷ Superficie de Volatilidad',
      title: '01. Pilares de la Creación (NGC 3324)  ⟷  Superficie de Volatilidad Implícita σ(K,T)',
      medium: 'Pilares infrarrojos del JWST • Variedad de Black-Scholes-Merton',
    },
    {
      id: 1,
      short: '02. Anillo de Einstein ⟷ Frontera de Markowitz',
      title: '02. Anillo Gravitacional de Einstein (SMACS 0723)  ⟷  Frontera Eficiente de Markowitz',
      medium: 'Lente gravitacional relativista • Tangencia óptima riesgo-retorno',
    },
    {
      id: 2,
      short: '03. Nebulosa Reloj de Arena ⟷ Profundidad Order Book',
      title: '03. Nebulosa Reloj de Arena Bipolar (L1527)  ⟷  Profundidad de Order Book V(p,t)',
      medium: 'Onda de choque protoestelar • Microestructura de liquidez de alta frecuencia',
    },
    {
      id: 3,
      short: '04. Nebulosa Anillo del Sur ⟷ Difusión de Itô',
      title: '04. Nebulosa del Anillo del Sur (NGC 3132)  ⟷  Densidad de Difusión de Itô-Fokker-Planck',
      medium: 'Capas concéntricas de eyección estelar • Trayectorias de dispersión estocástica',
    },
  ],
};

export const LIGHT_ARTWORKS = {
  EN: [
    {
      id: 0,
      short: '01. Girasol Fibonacci ⟷ Espiral Áurea',
      title: '01. Fibonacci Sunflower (137.5°)  ⟷  Golden Spiral & Fibonacci Arcs',
      medium: 'Botanical Golden Phyllotaxis • Golden Ratio Retracement Manifold (23.6% • 38.2% • 61.8%)',
    },
    {
      id: 1,
      short: '02. Cordillera & Ríos ⟷ Topografía Iso-Sharpe',
      title: '02. Emerald Mountain Ridge & Rivers  ⟷  Iso-Sharpe & Alpha Topography',
      medium: 'Spring Meltwater Watershed • Risk-Return Efficiency Contour Manifold',
    },
    {
      id: 2,
      short: '03. Flor de Loto ⟷ Interferencia de Ondas',
      title: '03. Sacred Water Lotus & Pond Ripples  ⟷  Harmonic Wave Interference',
      medium: 'Botanical Water Mandala • Liquidity Cycle Wave Propagation',
    },
    {
      id: 3,
      short: '04. ADN Botánico ⟷ Cointegración (Pairs)',
      title: '04. Botanical Double Helix (DNA)  ⟷  Statistical Cointegration (Pairs)',
      medium: 'Intertwined Chlorophyll Strands • Mean-Reverting Stationary Spread (±2σ)',
    },
  ],
  ES: [
    {
      id: 0,
      short: '01. Girasol Fibonacci ⟷ Espiral Áurea',
      title: '01. Girasol de Fibonacci (137.5°)  ⟷  Espiral Áurea & Arcos de Fibonacci',
      medium: 'Filotaxis botánica de semillas • Niveles de proporción áurea φ (23.6% • 38.2% • 61.8%)',
    },
    {
      id: 1,
      short: '02. Cordillera & Ríos ⟷ Topografía Iso-Sharpe',
      title: '02. Cordillera Esmeralda & Ríos  ⟷  Topografía Iso-Sharpe & Alfa',
      medium: 'Cuenca hidrográfica de deshielo • Curvas de nivel de eficiencia riesgo-retorno',
    },
    {
      id: 2,
      short: '03. Flor de Loto ⟷ Interferencia de Ondas',
      title: '03. Flor de Loto & Estanque  ⟷  Interferencia Armónica de Ondas',
      medium: 'Mandala acuático y ondas de estanque • Propagación armónica de volatilidad',
    },
    {
      id: 3,
      short: '04. ADN Botánico ⟷ Cointegración (Pairs)',
      title: '04. ADN Botánico (Doble Hélice)  ⟷  Cointegración Estadística (Pairs)',
      medium: 'Hebras de clorofila entrelazadas • Reversión a la media y spread estacionario (±2σ)',
    },
  ],
};

export default function WebbDeepFieldCanvas({
  isPaused = false,
  lang = 'EN',
  lightMode = false,
  selectedScene = null, // null = continuous 4-pair cycle identical to Dark Mode, 0..3 = fixed pair
  morphOverride = null, // null = continuous sine wave, 0 = 100% Nature/Cosmos, 1 = 100% Quant
  onActiveSceneChange = null,
}) {
  const canvasRef = useRef(null);
  const [activePairIdx, setActivePairIdx] = useState(
    selectedScene !== null ? Number(selectedScene) % 4 : 0
  );

  const isPausedRef = useRef(isPaused);
  const lightModeRef = useRef(lightMode);
  const selectedSceneRef = useRef(selectedScene);
  const morphOverrideRef = useRef(morphOverride);
  const onActiveSceneChangeRef = useRef(onActiveSceneChange);
  const lastReportedIdxRef = useRef(activePairIdx);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    lightModeRef.current = lightMode;
  }, [lightMode]);

  useEffect(() => {
    selectedSceneRef.current = selectedScene;
    if (selectedScene !== null) {
      const idx = Number(selectedScene) % 4;
      lastReportedIdxRef.current = idx;
      setActivePairIdx(idx);
    }
  }, [selectedScene]);

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
    const lPtPairLoc = gl.getUniformLocation(lightPtProgram, 'uPair');
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
    let currentPairFloat = selectedSceneRef.current !== null ? Number(selectedSceneRef.current) % 4 : 0;

    const render = (now) => {
      const dt = Math.min(0.1, Math.max(0, (now - lastTime) * 0.001));
      lastTime = now;

      if (!isPausedRef.current) {
        resize();
        elapsed += dt;

        // Exact same morph and pair cadence across both Dark Mode and Light Mode
        const activeMorph =
          morphOverrideRef.current !== null
            ? morphOverrideRef.current
            : 0.5 - 0.5 * Math.cos(elapsed * 0.65);

        let activePair = 0;
        if (selectedSceneRef.current !== null) {
          const target = Number(selectedSceneRef.current) % 4;
          // Shortest circular distance on mod 4 ring for smooth glide when user clicks a button
          let diff = ((target - currentPairFloat + 2.0) % 4.0 + 4.0) % 4.0 - 2.0;
          currentPairFloat = (currentPairFloat + diff * Math.min(1.0, dt * 3.2) + 4.0) % 4.0;
          activePair = currentPairFloat;
        } else {
          activePair = (elapsed * 0.12) % 4.0;
          currentPairFloat = activePair;
        }

        const pairIdx = Math.floor((activePair + 0.5) % 4.0) % 4;
        if (lastReportedIdxRef.current !== pairIdx) {
          lastReportedIdxRef.current = pairIdx;
          setActivePairIdx(pairIdx);
          if (onActiveSceneChangeRef.current) {
            onActiveSceneChangeRef.current(pairIdx);
          }
        }

        if (lightModeRef.current) {
          gl.disable(gl.BLEND);
          gl.useProgram(lightBgProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
          gl.enableVertexAttribArray(lBgPosLoc);
          gl.vertexAttribPointer(lBgPosLoc, 2, gl.FLOAT, false, 0, 0);
          gl.uniform2f(lBgResLoc, canvas.width, canvas.height);
          gl.uniform1f(lBgTimeLoc, elapsed);
          gl.uniform1f(lBgPairLoc, activePair);
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
          gl.uniform1f(lPtPairLoc, activePair);
          gl.uniform1f(lPtMorphLoc, activeMorph);
          gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
        } else {
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
  const displayIdx = selectedScene !== null ? Number(selectedScene) % 4 : activePairIdx;
  const currentPiece = currentList[displayIdx] || currentList[0];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        backgroundColor: lightMode ? '#DAF3EE' : '#000000',
        overflow: 'hidden',
        transition: 'background-color 0.35s ease',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* GALLERY ARTWORK PLACARD (BOTTOM-CENTER, IDENTICAL TO DARK MODE) */}
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
          maxWidth: '620px',
        }}
      >
        <div
          className="serif-heading"
          style={{
            fontSize: '0.84rem',
            fontStyle: 'italic',
            color: lightMode ? 'rgba(16, 36, 28, 0.86)' : 'rgba(255, 255, 255, 0.78)',
            fontWeight: 400,
            letterSpacing: '0.01em',
          }}
        >
          {currentPiece.title}
        </div>
        <div
          style={{
            fontSize: '0.68rem',
            color: lightMode ? 'rgba(32, 58, 46, 0.56)' : 'rgba(255, 255, 255, 0.38)',
            letterSpacing: '0.03em',
          }}
        >
          {currentPiece.medium}
        </div>
      </div>
    </div>
  );
}



