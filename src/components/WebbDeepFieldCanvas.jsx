import React, { useEffect, useRef } from 'react';
import {
  BG_VERTEX_SHADER,
  BG_FRAGMENT_SHADER,
  PARTICLE_VERTEX_SHADER,
  PARTICLE_FRAGMENT_SHADER,
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

const PAIRS_META = [
  {
    id: 0,
    short: 'PAR I',
    jwst: 'Pilares de la Creación (Carina)',
    quant: '3D Implied Volatility Surface σ(K,T)',
    color: '#f59e0b',
  },
  {
    id: 1,
    short: 'PAR II',
    jwst: 'Lente Gravitacional Einstein (SMACS 0723)',
    quant: 'Markowitz Frontier & Sharpe Tangency',
    color: '#38bdf8',
  },
  {
    id: 2,
    short: 'PAR III',
    jwst: 'Nebulosa Reloj de Arena Bipolar (L1527)',
    quant: 'Limit Order Book Depth V(p,t) (Bids/Asks)',
    color: '#10b981',
  },
  {
    id: 3,
    short: 'PAR IV',
    jwst: 'Nebulosa del Anillo del Sur (NGC 3132)',
    quant: 'Difusión de Itô & Densidad Fokker-Planck',
    color: '#a855f7',
  },
];

export default function WebbDeepFieldCanvas({ isPaused = false }) {
  const canvasRef = useRef(null);
  const [selectedPair, setSelectedPair] = React.useState(0);
  const [morphPct, setMorphPct] = React.useState(100);
  const [isAuto, setIsAuto] = React.useState(false);
  const [showHorizon, setShowHorizon] = React.useState(true);

  const controlsRef = useRef({
    selectedPair: 0,
    morph: 1.0,
    isAuto: false,
    showHorizon: 1.0,
  });

  useEffect(() => {
    controlsRef.current = {
      selectedPair,
      morph: morphPct / 100,
      isAuto,
      showHorizon: showHorizon ? 1.0 : 0.0,
    };
  }, [selectedPair, morphPct, isAuto, showHorizon]);

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
    if (!bgProgram || !ptProgram) return;

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

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      if (!canvas.parentElement) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    let animId;
    let startTime = performance.now();
    let pausedElapsed = 0;

    const render = (now) => {
      resize();
      const elapsed = isPaused ? pausedElapsed : (now - startTime) * 0.001;
      pausedElapsed = elapsed;

      const ctrl = controlsRef.current;
      const activePair = ctrl.isAuto ? (elapsed * 0.12) % 4.0 : ctrl.selectedPair;
      const activeMorph = ctrl.isAuto ? 0.5 - 0.5 * Math.cos(elapsed * 0.65) : ctrl.morph;

      gl.disable(gl.BLEND);
      gl.useProgram(bgProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(bgPosLoc);
      gl.vertexAttribPointer(bgPosLoc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(bgResLoc, canvas.width, canvas.height);
      gl.uniform1f(bgTimeLoc, elapsed);
      gl.uniform1f(bgPairLoc, activePair);
      gl.uniform1f(bgMorphLoc, activeMorph);
      gl.uniform1f(bgHorizLoc, ctrl.showHorizon);
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

      if (!isPaused) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(quadBuf);
      gl.deleteBuffer(particleBuf);
      gl.deleteProgram(bgProgram);
      gl.deleteProgram(ptProgram);
    };
  }, [isPaused]);

  const currentMeta = PAIRS_META[selectedPair];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000000', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      <div
        style={{
          position: 'absolute',
          bottom: '3.2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          backgroundColor: 'rgba(10, 14, 23, 0.84)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '12px',
          padding: '0.65rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
          minWidth: '680px',
          maxWidth: '92vw',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.75)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {PAIRS_META.map((pair) => {
              const active = !isAuto && selectedPair === pair.id;
              return (
                <button
                  key={pair.id}
                  onClick={() => {
                    setIsAuto(false);
                    setSelectedPair(pair.id);
                  }}
                  style={{
                    backgroundColor: active ? pair.color : 'rgba(255, 255, 255, 0.06)',
                    color: active ? '#000000' : '#e2e8f0',
                    border: active ? `1px solid ${pair.color}` : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {pair.short}
                </button>
              );
            })}
            <button
              onClick={() => setIsAuto(!isAuto)}
              style={{
                backgroundColor: isAuto ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                color: isAuto ? '#000000' : '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '6px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isAuto ? '● AUTO LOOP ON' : 'AUTO LOOP'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {[
              { label: '0% JWST', val: 0 },
              { label: '50%', val: 50 },
              { label: '100% QUANT', val: 100 },
            ].map((preset) => (
              <button
                key={preset.val}
                onClick={() => {
                  setIsAuto(false);
                  setMorphPct(preset.val);
                }}
                style={{
                  backgroundColor: !isAuto && morphPct === preset.val ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                  color: !isAuto && morphPct === preset.val ? '#ffffff' : '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '6px',
                  padding: '0.28rem 0.55rem',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            onClick={() => { setIsAuto(false); setMorphPct(0); }}
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: morphPct < 50 ? currentMeta.color : '#94a3b8',
              cursor: 'pointer',
              minWidth: '215px',
              textAlign: 'left',
            }}
          >
            0% JWST: {currentMeta.jwst}
          </span>

          <input
            type="range"
            min="0"
            max="100"
            value={morphPct}
            onChange={(e) => {
              setIsAuto(false);
              setMorphPct(Number(e.target.value));
            }}
            style={{
              flex: 1,
              accentColor: currentMeta.color,
              cursor: 'pointer',
            }}
          />

          <span
            onClick={() => { setIsAuto(false); setMorphPct(100); }}
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: morphPct >= 50 ? currentMeta.color : '#94a3b8',
              cursor: 'pointer',
              minWidth: '245px',
              textAlign: 'right',
            }}
          >
            100% QUANT: {currentMeta.quant}
          </span>
        </div>
      </div>
    </div>
  );
}


