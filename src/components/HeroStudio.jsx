import React, { useState } from 'react';
import { Play, Pause, Sparkles, Orbit, Telescope, Compass, Eye } from 'lucide-react';
import WebbDeepFieldCanvas from './WebbDeepFieldCanvas';

const ACTS_GUIDE = [
  {
    num: 'ACT I',
    title: 'Carina Nebula & Pillars of Creation',
    quant: 'Volatility Surface & Smile Manifold',
    color: '#f59e0b',
    desc: 'Warm amber cosmic dust strata and infrared gas ridges sculpted into the parabolic volatility smile without synthetic gridlines.'
  },
  {
    num: 'ACT II',
    title: 'Einstein Gravitational Lens (SMACS 0723)',
    quant: 'Markowitz Efficient Frontier & Sharpe Tangency',
    color: '#38bdf8',
    desc: 'Lensed photon arcs curved by deep-field galactic gravity converging on the maximum Sharpe ratio tangency point.'
  },
  {
    num: 'ACT III',
    title: 'Cartwheel Galaxy Collision Shockwave',
    quant: 'Limit Order Book Depth (Bids & Asks)',
    color: '#10b981',
    desc: 'Kinetic gas shockwave dividing symmetrically into approaching emerald bids and receding crimson asks meeting at the spread.'
  },
  {
    num: 'ACT IV',
    title: 'Southern Ring Nebula Shells',
    quant: 'Geometric Brownian Monte Carlo Fan',
    color: '#8b5cf6',
    desc: 'Concentric stellar wind ejections dissolving into Itô stochastic dispersion streams, seamlessly looping back into the Carina dust.'
  }
];

export default function HeroStudio({ onSelectIntro, currentLang = 'EN' }) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1rem', height: 'calc(100vh - 160px)' }}>
      {/* LEFT: THEMATIC NARRATIVE OVERVIEW */}
      <div className="terminal-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono-metric" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Telescope size={15} color="var(--accent)" /> JWST DEEP FIELD SYMPHONY
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 600 }}>
              CONTINUOUS VOYAGE
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.35rem', lineHeight: 1.45 }}>
            A continuous cinematic voyage through real James Webb discoveries transforming organically into foundational quantitative market structures. Zero artificial wireframes.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {ACTS_GUIDE.map((act) => (
            <div
              key={act.num}
              style={{
                padding: '0.75rem 0.85rem',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-panel)',
                border: '1px solid var(--border-light)',
                borderLeft: `3px solid ${act.color}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono-metric" style={{ fontSize: '0.7rem', color: act.color, fontWeight: 700 }}>
                  {act.num}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Webb Discovery
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                {act.title}
              </div>

              <div style={{ fontSize: '0.74rem', color: act.color, fontWeight: 600, marginTop: '0.2rem' }}>
                ⟷ {act.quant}
              </div>

              <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.35rem', lineHeight: 1.45 }}>
                {act.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ padding: '0.65rem 1rem', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Infrared Volumetric Physics</span>
          <span className="mono-metric" style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700 }}>60 FPS SEAMLESS</span>
        </div>
      </div>

      {/* RIGHT: CINEMATIC STAGE WITH TRADINGVIEW COMPOSITION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* TOP BAR WITH FREEZE/RESUME CONTROL */}
        <div style={{
          backgroundColor: 'var(--bg-panel)',
          padding: '0.65rem 1rem',
          borderRadius: '8px',
          border: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
              [JAMES WEBB DEEP FIELD]
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Curvature of Cosmic Matter ⟷ Geometry of Capital Markets
            </span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-main)',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isPaused ? <Play size={13} fill="currentColor" /> : <Pause size={13} fill="currentColor" />}
            {isPaused ? 'Resume Symphony' : 'Freeze Moment'}
          </button>
        </div>

        {/* FULL VOLUMETRIC CANVASES STAGE */}
        <div style={{
          flex: 1,
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95)',
          backgroundColor: '#000'
        }}>
          {/* Volumetric Continuous Canvas */}
          <WebbDeepFieldCanvas isPaused={isPaused} />

          {/* Minimalist Centered TradingView Typography Overlay */}
          <div style={{
            position: 'absolute',
            top: '12%',
            left: 0,
            right: 0,
            textAlign: 'center',
            pointerEvents: 'none',
            padding: '0 1.5rem',
            zIndex: 10
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '0.3rem 0.85rem',
              borderRadius: '20px',
              marginBottom: '1.25rem'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', letterSpacing: '0.08em' }}>
                CONTINUOUS COSMIC QUANT SYMPHONY
              </span>
            </div>

            <h1 className="serif-heading" style={{
              fontSize: '3.6rem',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              maxWidth: '920px',
              margin: '0 auto',
              textShadow: '0 4px 30px rgba(0,0,0,0.85)'
            }}>
              Where cosmic laws govern capital
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'rgba(255, 255, 255, 0.72)',
              marginTop: '1.2rem',
              maxWidth: '640px',
              margin: '1.2rem auto 0 auto',
              lineHeight: 1.6
            }}>
              The universe bends light and matter through gravity; quantitative systems navigate risk through geometry.
            </p>

            <div style={{ marginTop: '2.2rem', pointerEvents: 'auto' }}>
              <button
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  padding: '0.9rem 2.2rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(255, 255, 255, 0.25)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              >
                Enter Quantitative Terminal
              </button>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)', marginTop: '0.65rem' }}>
                Infinite seamless infrared loop • Zero synthetic wireframes
              </div>
            </div>
          </div>

          {/* BOTTOM METADATA BAR */}
          <div style={{
            position: 'absolute',
            bottom: '1.25rem',
            left: '1.5rem',
            right: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
            fontSize: '0.74rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            <div>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>TELESCOPE: </span>
              <span>James Webb Space Telescope (NIRCam / MIRI Infrared Data)</span>
            </div>
            <div className="mono-metric" style={{ color: 'var(--accent)' }}>
              VOLUMETRIC FLUID DYNAMICS 60 FPS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
