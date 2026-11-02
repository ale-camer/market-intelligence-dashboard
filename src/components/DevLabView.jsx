import React from 'react';
import { Activity, ArrowUpRight, Link2, Sparkles } from 'lucide-react';

export const FINANCIAL_BULL_GREEN = '#10b981';
export const FINANCIAL_BEAR_RED = '#f43f5e';

export const DEV_ICON_CATALOG = [
  {
    id: 'current-activity',
    tier: 'baseline',
    family: 'Actual',
    letter: 'ACTUAL',
    code: '#00',
    name: 'Pulso Anterior (Referencia)',
    meaning: 'Ícono previo para comparar.',
    renderSvg: (strokeColor = '#000', size = 17) => (
      <Activity size={size} color={strokeColor} strokeWidth={2.5} />
    ),
  },
  {
    id: 'lambda08-h-chiseled-nib',
    tier: 'lambda08',
    family: 'ELEGIDO • Pluma Caligráfica Biselada',
    letter: 'λ-08H • PLUMA',
    code: '08-H',
    name: 'λ-08H • Trazo de Grosor Variable (Pluma Grabada)',
    meaning: 'Símbolo oficial elegido: silueta vectorial esculpida sin caja contenedor.',
    renderSvg: (strokeColor = '#000', size = 18) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M5.4 6.6C7.1 4.0 10.2 3.8 12.0 6.8L17.1 16.8C17.6 17.8 18.4 18.1 19.6 17.6C20.1 17.4 20.5 18.1 20.0 18.6C18.3 20.3 15.8 19.9 14.4 17.2L11.7 11.9L7.4 19.2C6.9 20.0 5.3 19.5 5.9 18.4L10.5 9.7L9.3 7.5C8.5 6.0 7.1 5.9 6.1 7.1C5.7 7.6 5.1 7.1 5.4 6.6Z"
          fill={strokeColor}
        />
      </svg>
    ),
  },
];

export const DEV_BOX_STYLES = [
  {
    id: 'solid-green',
    name: 'Caja 1: Fondo Verde + Glifo Negro',
    bg: 'var(--accent)',
    border: '1px solid transparent',
    strokeColor: '#000000',
  },
  {
    id: 'dark-neon',
    name: 'Caja 2: Fondo Oscuro + Borde/Glifo Verde',
    bg: '#070b14',
    border: '1.5px solid #10b981',
    strokeColor: '#10b981',
  },
  {
    id: 'dark-white',
    name: 'Caja 3: Fondo Oscuro + Glifo Blanco',
    bg: '#0b101d',
    border: '1px solid rgba(255, 255, 255, 0.28)',
    strokeColor: '#ffffff',
  },
  {
    id: 'free-green',
    name: 'Caja 4 (Elegida): Sin Caja (Glifo Libre)',
    bg: 'transparent',
    border: '1px solid transparent',
    strokeColor: '#10b981',
  },
];

export const CANONICAL_AUDIT_URLS = [
  {
    id: '01',
    label: 'Home Stage (Campo Profundo + Lanzadores)',
    url: '/?view=home',
    target: { view: 'home' },
  },
  {
    id: '02',
    label: 'Markets N1 • Screener Global (213 Activos)',
    url: '/?view=markets&mode=screener',
    target: { view: 'markets', mode: 'screener' },
  },
  {
    id: '03',
    label: 'Markets N1 • Categoría Rates & Curves (18 Bonos)',
    url: '/?view=markets&mode=screener&cat=Rates%20%26%20Curves',
    target: { view: 'markets', mode: 'screener', cat: 'Rates & Curves' },
  },
  {
    id: '04',
    label: 'Markets N2 • Equity Price Action & Bandas (NVDA)',
    url: '/?view=markets&mode=detail&asset=NVDA&section=analytics&lens=price',
    target: { view: 'markets', mode: 'detail', asset: 'NVDA', section: 'analytics', lens: 'price' },
  },
  {
    id: '05',
    label: 'Markets N2 • Factor Decomposition & Beta (NVDA)',
    url: '/?view=markets&mode=detail&asset=NVDA&section=analytics&lens=factor',
    target: { view: 'markets', mode: 'detail', asset: 'NVDA', section: 'analytics', lens: 'factor' },
  },
  {
    id: '06',
    label: 'Markets N2 • Microestructura & Liquidez (NVDA)',
    url: '/?view=markets&mode=detail&asset=NVDA&section=analytics&lens=micro',
    target: { view: 'markets', mode: 'detail', asset: 'NVDA', section: 'analytics', lens: 'micro' },
  },
  {
    id: '07',
    label: 'Motor 3D • Superficie de Volatilidad (NVDA-OPT)',
    url: '/?view=markets&mode=detail&asset=NVDA-OPT&section=analytics&lens=derivatives&sub=surface3d',
    target: {
      view: 'markets',
      mode: 'detail',
      asset: 'NVDA-OPT',
      section: 'analytics',
      lens: 'derivatives',
      sub: 'surface3d',
    },
  },
  {
    id: '08',
    label: 'Motor 2D • Curvas Smile/Skew por DTE (NVDA-OPT)',
    url: '/?view=markets&mode=detail&asset=NVDA-OPT&section=analytics&lens=derivatives&sub=surface2d',
    target: {
      view: 'markets',
      mode: 'detail',
      asset: 'NVDA-OPT',
      section: 'analytics',
      lens: 'derivatives',
      sub: 'surface2d',
    },
  },
  {
    id: '09',
    label: 'Motor P&L • Diagrama Payoff Opciones y Sintéticos',
    url: '/?view=markets&mode=detail&asset=NVDA-OPT&section=analytics&lens=derivatives&sub=payoff',
    target: {
      view: 'markets',
      mode: 'detail',
      asset: 'NVDA-OPT',
      section: 'analytics',
      lens: 'derivatives',
      sub: 'payoff',
    },
  },
  {
    id: '10',
    label: 'Motor 2D • Curva de Bonos Soberanos (42 Países • US10Y)',
    url: '/?view=markets&mode=detail&asset=US10Y&section=analytics&lens=derivatives&sub=2d-curve&country=US',
    target: {
      view: 'markets',
      mode: 'detail',
      asset: 'US10Y',
      section: 'analytics',
      lens: 'derivatives',
      sub: '2d-curve',
      country: 'US',
    },
  },
  {
    id: '11',
    label: 'Motor 3D • Superficie Histórica de Tasas Soberanas (US10Y)',
    url: '/?view=markets&mode=detail&asset=US10Y&section=analytics&lens=derivatives&sub=3d-history&country=US',
    target: {
      view: 'markets',
      mode: 'detail',
      asset: 'US10Y',
      section: 'analytics',
      lens: 'derivatives',
      sub: '3d-history',
      country: 'US',
    },
  },
  {
    id: '12',
    label: 'Motor FX • Conversor y Triangulador (61 Monedas • EUR/USD)',
    url: '/?view=markets&mode=detail&asset=EUR/USD&section=analytics&lens=derivatives',
    target: {
      view: 'markets',
      mode: 'detail',
      asset: 'EUR/USD',
      section: 'analytics',
      lens: 'derivatives',
    },
  },
  {
    id: '13',
    label: 'Motor 3D • Superficie Forward de Commodities (CL1!)',
    url: '/?view=markets&mode=detail&asset=CL1!&section=analytics&lens=derivatives&sub=3d-surface',
    target: {
      view: 'markets',
      mode: 'detail',
      asset: 'CL1!',
      section: 'analytics',
      lens: 'derivatives',
      sub: '3d-surface',
    },
  },
  {
    id: '14',
    label: 'Markets N2 • Research, Sentimiento FinBERT & RAG (NVDA)',
    url: '/?view=markets&mode=detail&asset=NVDA&section=research',
    target: { view: 'markets', mode: 'detail', asset: 'NVDA', section: 'research' },
  },
  {
    id: '15',
    label: 'Portfolio • Simulador $100K, VaR 95%, Matriz r y Comité IA',
    url: '/?view=portfolio',
    target: { view: 'portfolio' },
  },
  {
    id: '16',
    label: 'Observability • Telemetría FinOps & 14 Proyectos GCP',
    url: '/?view=observability',
    target: { view: 'observability' },
  },
  {
    id: '17',
    label: 'User Guide • Manual Interactivo y Glosario Cuantitativo',
    url: '/?view=guide',
    target: { view: 'guide' },
  },
];

export default function DevLabView({
  langCode = 'ES',
  homeLayoutId = 'bento-grid',
  onSelectHomeLayout,
  onLaunchTarget,
  onNavigate,
}) {
  const isES = langCode === 'ES';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        paddingBottom: '2rem',
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          borderRadius: '18px',
          background: 'var(--bg-panel-glass)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '1rem 1.3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
            <Sparkles size={14} style={{ color: '#10b981' }} />
            <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800, color: '#10b981' }}>
              {isES ? 'LABORATORIO DE DISEÑO Y AUDITORÍA DE URLS CANÓNICAS' : 'DESIGN LAB & CANONICAL URL AUDITOR'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            {isES
              ? 'Catálogo Interactivo de 17 Deep-Links Canónicos para Auditoría'
              : 'Interactive Catalog of 17 Canonical Deep-Links for Auditing'}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => (onNavigate ? onNavigate('presentation') : null)}
          className="mono-metric"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.95rem',
            borderRadius: '999px',
            backgroundColor: '#10b981',
            color: '#000000',
            border: 'none',
            fontSize: '0.66rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          <span>{isES ? 'Ir a Home ↗' : 'Go to Home ↗'}</span>
        </button>
      </div>

      {/* SECTION: 17 CANONICAL DEEP-LINK AUDIT URLS */}
      <div
        style={{
          borderRadius: '18px',
          backgroundColor: 'var(--bg-panel-glass)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.05rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span className="mono-metric" style={{ fontSize: '0.64rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Link2 size={14} style={{ color: '#10b981' }} />
            {isES
              ? '2. CATÁLOGO DE 17 URLS CANÓNICAS DE AUDITORÍA (DEEP-LINKING BIDIRECCIONAL)'
              : '2. 17 CANONICAL AUDIT URLS CATALOG (BIDIRECTIONAL DEEP-LINKING)'}
          </span>
          <span className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>
            {isES ? 'Clic en cualquier fila para abrir el motor exacto' : 'Click any row to open the exact engine'}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '0.5rem',
          }}
        >
          {CANONICAL_AUDIT_URLS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onLaunchTarget && onLaunchTarget(item.target)}
              style={{
                textAlign: 'left',
                padding: '0.6rem 0.8rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ffffff' }}>
                  <span className="mono-metric" style={{ color: '#10b981', marginRight: '0.4rem' }}>
                    #{item.id}
                  </span>
                  {item.label}
                </div>
                <div
                  className="mono-metric"
                  style={{
                    fontSize: '0.56rem',
                    color: 'var(--text-dim)',
                    marginTop: '0.15rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.url}
                </div>
              </div>
              <ArrowUpRight size={14} style={{ color: '#10b981', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
