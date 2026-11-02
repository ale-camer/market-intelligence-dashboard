import React, { useState, useRef, useMemo } from 'react';

/**
 * Interactive 3D Quantitative Surface Renderer (`Surface3DViewer.jsx`)
 * Renders true 3D volumetric surfaces (X × Y × Z) with:
 * - Mouse drag 3D orbit rotation (Yaw + Pitch) & Zoom
 * - 4 institutional camera presets (Isométrica, Frente Smile/Curva, Perfil Term Structure, Cenital Heatmap)
 * - Painter's Algorithm depth-sorted 3D quads with normal-vector lighting & glowing wireframe mesh
 * - Interactive 3D cross-section slices (constant X and constant Y curves) & node inspection HUD
 */
export default function Surface3DViewer({ surfaceData, isES = false, extraToolbar = null }) {
  const [yaw, setYaw] = useState(-36); // degrees (-180 to 180)
  const [pitch, setPitch] = useState(27); // degrees (10 to 80)
  const [zoom, setZoom] = useState(1.0);
  const [hoveredNode, setHoveredNode] = useState({ j: 2, i: 4 }); // Default highlight near ATM / 30D
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, yaw: -36, pitch: 27 });

  const {
    title = '',
    xAxisTitle = 'X Axis',
    yAxisTitle = 'Y Axis',
    zAxisTitle = 'Z Axis',
    zUnit = '%',
    xLabels = [],
    yLabels = [],
    zMatrix = [],
    metaMatrix = [],
  } = surfaceData || {};

  const ny = zMatrix.length;
  const nx = ny > 0 ? zMatrix[0].length : 0;

  // Compute Z min/max for normalization
  const { zMin, zMax, zRange } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const v = Number(zMatrix[j][i]) || 0;
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    if (!Number.isFinite(min)) min = 0;
    if (!Number.isFinite(max)) max = 100;
    const pad = Math.max(0.4, (max - min) * 0.08);
    const floorMin = Number((min - pad).toFixed(2));
    const ceilMax = Number((max + pad * 0.35).toFixed(2));
    return {
      zMin: floorMin,
      zMax: ceilMax,
      zRange: Math.max(0.001, ceilMax - floorMin),
    };
  }, [zMatrix, nx, ny]);

  // Spectral Quant Color Map: normalized t in [0, 1] -> RGB + alpha
  const getQuantSurfaceColor = (t, shade = 1.0, alpha = 0.84) => {
    const c = Math.max(0, Math.min(1, t));
    let r, g, b;
    if (c < 0.33) {
      // Emerald/Teal (#10b981) -> Sky Cyan (#0ea5e9)
      const u = c / 0.33;
      r = Math.round(16 + (14 - 16) * u);
      g = Math.round(185 + (165 - 185) * u);
      b = Math.round(129 + (233 - 129) * u);
    } else if (c < 0.68) {
      // Sky Cyan (#0ea5e9) -> Indigo/Violet (#8b5cf6)
      const u = (c - 0.33) / 0.35;
      r = Math.round(14 + (139 - 14) * u);
      g = Math.round(165 + (92 - 165) * u);
      b = Math.round(233 + (246 - 233) * u);
    } else {
      // Indigo/Violet (#8b5cf6) -> Amber/Rose Peak (#f43f5e)
      const u = (c - 0.68) / 0.32;
      r = Math.round(139 + (244 - 139) * u);
      g = Math.round(92 + (63 - 92) * u);
      b = Math.round(246 + (94 - 246) * u);
    }
    r = Math.min(255, Math.max(0, Math.round(r * shade)));
    g = Math.min(255, Math.max(0, Math.round(g * shade)));
    b = Math.min(255, Math.max(0, Math.round(b * shade)));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // 3D Projection math: maps normalized (x, y, z) in [-1, 1] x [-1, 1] x [0, 1] to SVG (sx, sy, depth)
  const svgW = 860;
  const svgH = 360;
  const cx = svgW * 0.49;
  const cy = svgH * 0.62;
  const scaleX = 215 * zoom;
  const scaleY = 175 * zoom;
  const scaleZ = 148 * zoom;

  const radYaw = (yaw * Math.PI) / 180;
  const radPitch = (pitch * Math.PI) / 180;
  const cosY = Math.cos(radYaw);
  const sinY = Math.sin(radYaw);
  const cosP = Math.cos(radPitch);
  const sinP = Math.sin(radPitch);

  const project3D = (nxCoord, nyCoord, nzCoord) => {
    // Scale coordinates in world space
    const wx = nxCoord * scaleX;
    const wy = nyCoord * scaleY;
    const wz = nzCoord * scaleZ;

    // Rotate around Z-axis (Yaw)
    const rx = wx * cosY - wy * sinY;
    const ry = wx * sinY + wy * cosY;
    const rz = wz;

    // Rotate around X-axis (Pitch) and apply gentle perspective foreshortening
    const screenX = rx;
    const screenY = -rz * cosP + ry * sinP;
    const depth = ry * cosP + rz * sinP;
    const perspective = 1 / (1 + depth * 0.00045);

    return {
      sx: Number((cx + screenX * perspective).toFixed(2)),
      sy: Number((cy + screenY * perspective).toFixed(2)),
      depth,
    };
  };

  // Precompute 3D projected vertices, floor grid, quads, and cross-section ribbons
  const { projectedGrid, sortedQuads, floorLines, zTicks, xAxisTicks, yAxisTicks } = useMemo(() => {
    if (nx === 0 || ny === 0) {
      return { projectedGrid: [], sortedQuads: [], floorLines: [], zTicks: [], xAxisTicks: [], yAxisTicks: [] };
    }

    const grid = [];
    for (let j = 0; j < ny; j++) {
      const row = [];
      const nyCoord = ny > 1 ? (j / (ny - 1)) * 2 - 1 : 0; // -1 (front/short tenor) to +1 (back/long tenor)
      for (let i = 0; i < nx; i++) {
        const nxCoord = nx > 1 ? (i / (nx - 1)) * 2 - 1 : 0; // -1 (left strike) to +1 (right strike)
        const zVal = Number(zMatrix[j][i]) || 0;
        const nzCoord = Math.max(0, Math.min(1, (zVal - zMin) / zRange));
        const pt = project3D(nxCoord, nyCoord, nzCoord);
        const floorPt = project3D(nxCoord, nyCoord, 0);
        row.push({
          i,
          j,
          nxCoord,
          nyCoord,
          nzCoord,
          zVal,
          ...pt,
          floorSx: floorPt.sx,
          floorSy: floorPt.sy,
          meta: metaMatrix?.[j]?.[i] || null,
        });
      }
      grid.push(row);
    }

    // Build Quads and sort back-to-front by average depth (Painter's Algorithm)
    const quads = [];
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const p00 = grid[j][i];
        const p10 = grid[j][i + 1];
        const p11 = grid[j + 1][i + 1];
        const p01 = grid[j + 1][i];

        const avgDepth = (p00.depth + p10.depth + p11.depth + p01.depth) * 0.25;
        const avgT = (p00.nzCoord + p10.nzCoord + p11.nzCoord + p01.nzCoord) * 0.25;

        // Directional shading based on local slope
        const dzdx = p10.nzCoord - p00.nzCoord;
        const dzdy = p01.nzCoord - p00.nzCoord;
        const shade = Math.max(0.78, Math.min(1.18, 1.0 + dzdx * 0.35 - dzdy * 0.25));

        quads.push({
          key: `q-${j}-${i}`,
          i,
          j,
          points: `${p00.sx},${p00.sy} ${p10.sx},${p10.sy} ${p11.sx},${p11.sy} ${p01.sx},${p01.sy}`,
          avgDepth,
          fill: getQuantSurfaceColor(avgT, shade, 0.82),
          stroke: getQuantSurfaceColor(Math.min(1, avgT + 0.12), 1.15, 0.95),
        });
      }
    }
    quads.sort((a, b) => b.avgDepth - a.avgDepth);

    // Base Floor Grid (nz = 0)
    const fLines = [];
    for (let i = 0; i < nx; i++) {
      const a = grid[0][i];
      const b = grid[ny - 1][i];
      fLines.push({ x1: a.floorSx, y1: a.floorSy, x2: b.floorSx, y2: b.floorSy });
    }
    for (let j = 0; j < ny; j++) {
      const a = grid[j][0];
      const b = grid[j][nx - 1];
      fLines.push({ x1: a.floorSx, y1: a.floorSy, x2: b.floorSx, y2: b.floorSy });
    }

    // Z-Axis vertical pillar on the left-back corner (-1, 1, 0..1)
    const zSteps = [0, 0.25, 0.5, 0.75, 1.0];
    const zAxisPts = zSteps.map((s) => {
      const val = Number((zMin + s * zRange).toFixed(zRange < 5 ? 2 : 1));
      const p = project3D(-1.04, 1.04, s);
      const pEnd = project3D(-1.0, 1.0, s);
      return {
        s,
        label: zUnit === '$' ? `$${val}` : `${val}${zUnit}`,
        sx: p.sx,
        sy: p.sy,
        lineX: pEnd.sx,
        lineY: pEnd.sy,
      };
    });

    // X-Axis ticks along front edge (j = 0)
    const xTicks = [];
    for (let i = 0; i < nx; i++) {
      // Show every label if nx <= 7, or odd/even + ATM if nx > 7
      if (nx <= 8 || i % 2 === 0 || i === Math.floor(nx / 2)) {
        const nxCoord = (i / (nx - 1)) * 2 - 1;
        const p = project3D(nxCoord, -1.14, 0);
        const rawLbl = String(xLabels[i] || '');
        const shortLbl = rawLbl.includes(' (') ? rawLbl.split(' (')[0] : rawLbl;
        xTicks.push({ i, label: shortLbl, sx: p.sx, sy: p.sy });
      }
    }

    // Y-Axis ticks along right edge (i = nx - 1)
    const yTicks = [];
    for (let j = 0; j < ny; j++) {
      const nyCoord = (j / (ny - 1)) * 2 - 1;
      const p = project3D(1.14, nyCoord, 0);
      const rawLbl = String(yLabels[j] || '');
      const shortLbl = rawLbl.includes(' (') ? rawLbl.split(' (')[0] : rawLbl;
      yTicks.push({ j, label: shortLbl, sx: p.sx, sy: p.sy });
    }

    return {
      projectedGrid: grid,
      sortedQuads: quads,
      floorLines: fLines,
      zTicks: zAxisPts,
      xAxisTicks: xTicks,
      yAxisTicks: yTicks,
    };
  }, [zMatrix, metaMatrix, nx, ny, zMin, zRange, zUnit, xLabels, yLabels, yaw, pitch, zoom]);

  // Active hovered node (clamp to valid grid indices)
  const activeJ = Math.max(0, Math.min(ny - 1, hoveredNode?.j ?? Math.floor(ny / 2)));
  const activeI = Math.max(0, Math.min(nx - 1, hoveredNode?.i ?? Math.floor(nx / 2)));
  const activeVertex = projectedGrid?.[activeJ]?.[activeI] || null;

  // Cross-section polylines through activeVertex (constant Y row = Smile/Curve, constant X col = Term Structure)
  const constantYPath = useMemo(() => {
    if (!projectedGrid[activeJ]) return '';
    return projectedGrid[activeJ].map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${pt.sx},${pt.sy}`).join(' ');
  }, [projectedGrid, activeJ]);

  const constantXPath = useMemo(() => {
    if (!projectedGrid.length) return '';
    return projectedGrid.map((row, idx) => `${idx === 0 ? 'M' : 'L'}${row[activeI].sx},${row[activeI].sy}`).join(' ');
  }, [projectedGrid, activeI]);

  // Mouse drag handlers for 3D orbit rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, yaw, pitch };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const nextYaw = ((dragStartRef.current.yaw + dx * 0.45 + 180) % 360) - 180;
    const nextPitch = Math.max(10, Math.min(78, dragStartRef.current.pitch + dy * 0.35));
    setYaw(Number(nextYaw.toFixed(1)));
    setPitch(Number(nextPitch.toFixed(1)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: '320px',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Top 3D Controls & Camera Preset Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.45rem',
          padding: '0.28rem 0.55rem',
          marginBottom: '0.25rem',
          borderRadius: '8px',
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          fontSize: '0.67rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#38bdf8', fontWeight: 700, letterSpacing: '0.03em' }}>
            {isES ? 'CÁMARA 3D (ARRASTRAR PARA ROTAR):' : '3D CAMERA (DRAG TO ROTATE):'}
          </span>
          {[
            { id: 'iso', label: isES ? '3D Isométrica' : '3D Isometric', y: -36, p: 27 },
            { id: 'front', label: isES ? 'Frente (Smile / Curva)' : 'Front (Smile / Curve)', y: 0, p: 15 },
            { id: 'side', label: isES ? 'Perfil (Plazos)' : 'Profile (Term Structure)', y: -84, p: 18 },
            { id: 'top', label: isES ? 'Planta (Heatmap)' : 'Top (Heatmap)', y: 0, p: 76 },
          ].map((preset) => {
            const isPresetActive = Math.abs(yaw - preset.y) < 5 && Math.abs(pitch - preset.p) < 5;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setYaw(preset.y);
                  setPitch(preset.p);
                }}
                style={{
                  background: isPresetActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: isPresetActive ? '#38bdf8' : 'var(--text-secondary)',
                  border: isPresetActive ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '5px',
                  padding: '0.15rem 0.45rem',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {preset.label}
              </button>
            );
          })}
          {extraToolbar}
        </div>

        {/* Angle readout & Zoom buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.64rem' }}>
            Yaw {Math.round(yaw)}° • Pitch {Math.round(pitch)}°
          </span>
          <div style={{ display: 'inline-flex', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.1).toFixed(2))))}
              style={{
                background: 'rgba(15,23,42,0.8)',
                color: 'var(--text-secondary)',
                border: 'none',
                padding: '0.12rem 0.42rem',
                fontSize: '0.68rem',
                cursor: 'pointer',
              }}
              title="Zoom Out"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setZoom(1.0)}
              style={{
                background: 'rgba(15,23,42,0.8)',
                color: 'var(--text-primary)',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                borderTop: 'none',
                borderBottom: 'none',
                padding: '0.12rem 0.42rem',
                fontSize: '0.63rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
              }}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.35, Number((z + 0.1).toFixed(2))))}
              style={{
                background: 'rgba(15,23,42,0.8)',
                color: 'var(--text-secondary)',
                border: 'none',
                padding: '0.12rem 0.42rem',
                fontSize: '0.68rem',
                cursor: 'pointer',
              }}
              title="Zoom In"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Viewport + Floating Node Inspector */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab',
          borderRadius: '10px',
          background: 'radial-gradient(circle at 50% 55%, rgba(30, 41, 59, 0.55) 0%, rgba(10, 15, 28, 0.85) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Interactive 3D SVG Canvas */}
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Base Floor Grid (Z = zMin) */}
          <g stroke="rgba(148, 163, 184, 0.16)" strokeWidth="0.9" strokeDasharray="3 3">
            {floorLines.map((ln, idx) => (
              <line key={`fl-${idx}`} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} />
            ))}
          </g>

          {/* Vertical Drop Pillars from Surface Perimeter to Floor */}
          <g stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.8" strokeDasharray="2 2">
            {projectedGrid.map((row, j) =>
              row.map((pt, i) => {
                const isPerimeter = j === 0 || j === ny - 1 || i === 0 || i === nx - 1;
                if (!isPerimeter) return null;
                return (
                  <line
                    key={`pil-${j}-${i}`}
                    x1={pt.sx}
                    y1={pt.sy}
                    x2={pt.floorSx}
                    y2={pt.floorSy}
                  />
                );
              })
            )}
          </g>

          {/* Z-Axis Scale Pillar & Tick Labels */}
          {zTicks.length > 1 && (
            <g>
              <line
                x1={zTicks[0].lineX}
                y1={zTicks[0].lineY}
                x2={zTicks[zTicks.length - 1].lineX}
                y2={zTicks[zTicks.length - 1].lineY}
                stroke="rgba(148, 163, 184, 0.45)"
                strokeWidth="1.2"
              />
              {zTicks.map((zt, idx) => (
                <g key={`zt-${idx}`}>
                  <line
                    x1={zt.lineX}
                    y1={zt.lineY}
                    x2={zt.sx}
                    y2={zt.sy}
                    stroke="rgba(148, 163, 184, 0.45)"
                    strokeWidth="1"
                  />
                  <text
                    x={zt.sx - 5}
                    y={zt.sy + 3}
                    textAnchor="end"
                    fill="rgba(226, 232, 240, 0.8)"
                    fontSize="9.5"
                    fontFamily="var(--font-mono)"
                  >
                    {zt.label}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* Painter's Algorithm Depth-Sorted 3D Surface Quads */}
          <g>
            {sortedQuads.map((q) => (
              <polygon
                key={q.key}
                points={q.points}
                fill={q.fill}
                stroke={q.stroke}
                strokeWidth="0.95"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Highlighted 3D Cross-Section Ribbons (Constant Y = Smile/Curve & Constant X = Term Structure) */}
          {constantYPath && (
            <path
              d={constantYPath}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.6"
              strokeLinecap="round"
              style={{ pointerEvents: 'none' }}
            />
          )}
          {constantXPath && (
            <path
              d={constantXPath}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.4"
              strokeDasharray="4 2"
              strokeLinecap="round"
              style={{ pointerEvents: 'none' }}
            />
          )}

          {/* Interactive 3D Vertex Nodes */}
          <g>
            {projectedGrid.map((row, j) =>
              row.map((pt, i) => {
                const isSelected = j === activeJ && i === activeI;
                return (
                  <g key={`v-${j}-${i}`}>
                    {isSelected && (
                      <>
                        <line
                          x1={pt.sx}
                          y1={pt.sy}
                          x2={pt.floorSx}
                          y2={pt.floorSy}
                          stroke="#ffffff"
                          strokeWidth="1.4"
                          strokeDasharray="2 2"
                        />
                        <circle
                          cx={pt.sx}
                          cy={pt.sy}
                          r={6.5}
                          fill="rgba(56, 189, 248, 0.3)"
                          stroke="#ffffff"
                          strokeWidth="1.8"
                        />
                      </>
                    )}
                    <circle
                      cx={pt.sx}
                      cy={pt.sy}
                      r={isSelected ? 3.8 : 2.5}
                      fill={isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.72)'}
                      stroke="rgba(15, 23, 42, 0.9)"
                      strokeWidth="0.9"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredNode({ j, i })}
                    />
                  </g>
                );
              })
            )}
          </g>

          {/* X-Axis Perimeter Labels (Strike / Moneyness or Tenor) */}
          <g>
            {xAxisTicks.map((xt) => (
              <text
                key={`xl-${xt.i}`}
                x={xt.sx}
                y={xt.sy + 8}
                textAnchor="middle"
                fill={xt.i === activeI ? '#38bdf8' : 'rgba(203, 213, 225, 0.85)'}
                fontWeight={xt.i === activeI ? '700' : '500'}
                fontSize="9.5"
                fontFamily="var(--font-mono)"
              >
                {xt.label}
              </text>
            ))}
          </g>

          {/* Y-Axis Perimeter Labels (Expiration Tenor or Horizon/Country) */}
          <g>
            {yAxisTicks.map((yt) => (
              <text
                key={`yl-${yt.j}`}
                x={yt.sx + 6}
                y={yt.sy + 3}
                textAnchor="start"
                fill={yt.j === activeJ ? '#fbbf24' : 'rgba(203, 213, 225, 0.85)'}
                fontWeight={yt.j === activeJ ? '700' : '500'}
                fontSize="9.5"
                fontFamily="var(--font-mono)"
              >
                {yt.label}
              </text>
            ))}
          </g>
        </svg>

        {/* Top-Left Title & Axis Legend Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '0.55rem',
            left: '0.65rem',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.18rem',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.64rem', color: 'var(--text-muted)' }}>
            <span>
              <strong style={{ color: '#38bdf8' }}>X:</strong> {xAxisTitle}
            </span>
            <span>
              <strong style={{ color: '#fbbf24' }}>Y:</strong> {yAxisTitle}
            </span>
            <span>
              <strong style={{ color: '#f43f5e' }}>Z:</strong> {zAxisTitle}
            </span>
          </div>
        </div>

        {/* Top-Right Hovered 3D Node Inspector HUD */}
        {activeVertex && (
          <div
            style={{
              position: 'absolute',
              top: '0.55rem',
              right: '0.65rem',
              background: 'rgba(10, 15, 28, 0.88)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '9px',
              padding: '0.45rem 0.65rem',
              minWidth: '185px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
              pointerEvents: 'none',
              fontSize: '0.67rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                paddingBottom: '0.22rem',
                marginBottom: '0.28rem',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                {isES ? 'NODO 3D ACTIVO' : 'ACTIVE 3D NODE'}
              </span>
              <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.76rem' }}>
                {activeVertex.meta?.zFormatted || `${activeVertex.zVal}${zUnit}`}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '0.55rem', rowGap: '0.16rem' }}>
              <span style={{ color: '#38bdf8' }}>X ({xLabels[activeI]?.split(' ')[0]}):</span>
              <strong style={{ color: 'var(--text-primary)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                {activeVertex.meta?.xLabel || xLabels[activeI]}
              </strong>
              <span style={{ color: '#fbbf24' }}>Y (Plazo):</span>
              <strong style={{ color: 'var(--text-primary)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                {activeVertex.meta?.yLabel || yLabels[activeJ]}
              </strong>
              {activeVertex.meta?.extra1Label && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>{activeVertex.meta.extra1Label}:</span>
                  <span style={{ color: 'var(--text-secondary)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {activeVertex.meta.extra1Val}
                  </span>
                </>
              )}
              {activeVertex.meta?.extra2Label && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>{activeVertex.meta.extra2Label}:</span>
                  <span style={{ color: 'var(--text-secondary)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {activeVertex.meta.extra2Val}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bottom Thermal Scale Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.45rem',
            left: '0.65rem',
            right: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
            fontSize: '0.63rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              Min: {zUnit === '$' ? `$${zMin}` : `${zMin}${zUnit}`}
            </span>
            <div
              style={{
                width: '120px',
                height: '6px',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #10b981 0%, #0ea5e9 35%, #8b5cf6 70%, #f43f5e 100%)',
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              Max: {zUnit === '$' ? `$${zMax}` : `${zMax}${zUnit}`}
            </span>
          </div>
          <span>
            {isES
              ? 'Pasa el mouse sobre los nodos para cortar secciones 3D (X/Y) • Arrastra para orbitar'
              : 'Hover nodes to slice 3D cross-sections (X/Y) • Drag to orbit'}
          </span>
        </div>
      </div>
    </div>
  );
}

