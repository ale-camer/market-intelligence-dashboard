import React, { useEffect, useRef } from 'react';

/**
 * Ambient deep-space starfield backdrop (`StarfieldBackground.jsx`)
 * Renders subtle twinkling stars and faint cosmic dust behind `Markets`, `Research`,
 * and `Portfolio` so the entire application shares the same atmosphere as the Home stage.
 */
export default function StarfieldBackground({ active = true, lightMode = false }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  const lightModeRef = useRef(lightMode);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    lightModeRef.current = lightMode;
  }, [lightMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const STAR_COUNT = 260;
    const stars = Array.from({ length: STAR_COUNT }, () => {
      const tier = Math.random();
      return {
        x: Math.random(),
        y: Math.random(),
        radius: tier > 0.92 ? 1.55 : tier > 0.65 ? 1.05 : 0.65,
        baseAlpha: tier > 0.92 ? 0.75 : tier > 0.65 ? 0.45 : 0.24,
        twinkleSpeed: 0.4 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        tintDark:
          tier > 0.94
            ? '185, 226, 255' // cool blue-white star
            : tier > 0.88
            ? '255, 228, 185' // warm gold-white star
            : '240, 246, 255', // crisp white star
        tintLight:
          tier > 0.78
            ? '16, 155, 108' // spring emerald
            : tier > 0.52
            ? '14, 150, 215' // sky celeste
            : tier > 0.28
            ? '20, 175, 155' // lagoon turquoise
            : '225, 165, 25', // warm pollen gold
      };
    });

    let animId;
    const startTime = performance.now();

    const render = (now) => {
      if (activeRef.current) {
        const t = (now - startTime) * 0.001;
        const isLight = lightModeRef.current;
        ctx.clearRect(0, 0, width, height);

        if (isLight) {
          // Spring Daylight ("Día Primaveral") sky-to-meadow gradient matching HomeStage
          const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
          skyGrad.addColorStop(0, '#cde8fc');
          skyGrad.addColorStop(0.32, '#e6f5fc');
          skyGrad.addColorStop(0.54, '#f4fcf8');
          skyGrad.addColorStop(0.78, '#dcf5e8');
          skyGrad.addColorStop(1, '#c2eed8');
          ctx.fillStyle = skyGrad;
          ctx.fillRect(0, 0, width, height);

          // Soft warm sun halo in the upper-center
          const sunGrad = ctx.createRadialGradient(
            width * 0.5,
            height * 0.28,
            10,
            width * 0.5,
            height * 0.28,
            Math.max(width, height) * 0.52
          );
          sunGrad.addColorStop(0, 'rgba(255, 249, 224, 0.62)');
          sunGrad.addColorStop(0.55, 'rgba(220, 248, 242, 0.28)');
          sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = sunGrad;
          ctx.fillRect(0, 0, width, height);

          // Delicate floating botanical & pollen motes (with clean footer fadeout at bottom)
          for (let i = 0; i < STAR_COUNT; i++) {
            const s = stars[i];
            const sx = ((s.x + Math.sin(t * 0.18 + s.phase) * 0.008) % 1 + 1) % 1 * width;
            const normY = ((s.y - t * 0.0015) % 1 + 1) % 1;
            const sy = normY * height;
            if (normY > 0.91 || normY < 0.06) continue;
            const footerFade = normY > 0.82 ? (0.91 - normY) / 0.09 : 1.0;
            const headerFade = normY < 0.14 ? (normY - 0.06) / 0.08 : 1.0;
            const twinkle = 0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.phase);
            const alpha = s.baseAlpha * 0.58 * twinkle * footerFade * headerFade;

            ctx.beginPath();
            ctx.arc(sx, sy, s.radius * 1.15, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.tintLight}, ${alpha.toFixed(3)})`;
            ctx.fill();
          }
        } else {
          // Deep space base radial glow
          const grad = ctx.createRadialGradient(
            width * 0.5,
            height * 0.15,
            20,
            width * 0.5,
            height * 0.5,
            Math.max(width, height) * 0.85
          );
          grad.addColorStop(0, 'rgba(14, 21, 38, 0.42)');
          grad.addColorStop(0.55, 'rgba(6, 9, 17, 0.78)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0.96)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          for (let i = 0; i < STAR_COUNT; i++) {
            const s = stars[i];
            const sx = s.x * width;
            const sy = ((s.y - t * 0.0015) % 1 + 1) % 1 * height;
            const twinkle = 0.68 + 0.32 * Math.sin(t * s.twinkleSpeed + s.phase);
            const alpha = s.baseAlpha * twinkle;

            ctx.beginPath();
            ctx.arc(sx, sy, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.tintDark}, ${alpha.toFixed(3)})`;
            ctx.fill();
          }
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        display: active ? 'block' : 'none',
        backgroundColor: lightMode ? '#e8f6ef' : '#000000',
      }}
    />
  );
}

