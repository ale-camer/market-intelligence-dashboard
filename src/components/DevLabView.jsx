import React, { useState } from 'react';
import { Activity, Check, Grid, Palette } from 'lucide-react';

// ============================================================================
// REGLA INDUSTRIAL INAMOVIBLE:
// Toda medición de magnitud o dirección de movimiento de activos financieros
// (variación %, P&L, velas, barras de flujo, anomalías y sentimiento)
// SIEMPRE utiliza VERDE (#10b981) para positivo/suba y ROJO (#f43f5e) para negativo/baja.
// Las paletas ambientales SOLO modifican la atmósfera de paneles, bordes y foco de UI.
// ============================================================================
export const FINANCIAL_BULL_GREEN = '#10b981';
export const FINANCIAL_BEAR_RED = '#f43f5e';

export const DEV_PALETTE_MODELS = [
  {
    id: 'pal-01-obsidian',
    code: 'PAL-01',
    badge: 'ACTUAL • OBSIDIAN NIGHT',
    name: 'Obsidian Night (Cristal Azul Noche + UI Esmeralda)',
    description:
      'La atmósfera actual: paneles azul noche translúcidos, bordes blancos al 10% y controles activos en verde esmeralda.',
    panelBg: 'rgba(13, 19, 33, 0.72)',
    innerCardBg: 'rgba(7, 11, 20, 0.78)',
    border: 'rgba(255, 255, 255, 0.10)',
    uiAccent: '#10b981',
    uiAccentSoft: 'rgba(16, 185, 129, 0.15)',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
  },
  {
    id: 'pal-02-oled-black',
    code: 'PAL-02',
    badge: 'OLED PITCH BLACK',
    name: 'OLED Pitch Black (Negro Puro + UI Blanco Platino)',
    description:
      'Negro carbón absoluto sin tinte azul. Los controles de navegación usan blanco puro para que el Verde (#10b981) y Rojo (#f43f5e) sean los únicos colores vivos.',
    panelBg: 'rgba(8, 8, 10, 0.86)',
    innerCardBg: 'rgba(16, 16, 20, 0.92)',
    border: 'rgba(255, 255, 255, 0.15)',
    uiAccent: '#ffffff',
    uiAccentSoft: 'rgba(255, 255, 255, 0.12)',
    textMain: '#ffffff',
    textMuted: '#a1a1aa',
  },
  {
    id: 'pal-03-abyssal-navy',
    code: 'PAL-03',
    badge: 'ABYSSAL NAVY',
    name: 'Abyssal Navy (Azul Marino Profundo + UI Cian Institucional)',
    description:
      'Estilo terminal institucional (Koyfin / TradingView Dark): superficie azul marino profundo, bordes azulados y pestañas activas en cian (#38bdf8).',
    panelBg: 'rgba(8, 21, 40, 0.78)',
    innerCardBg: 'rgba(5, 14, 28, 0.85)',
    border: 'rgba(56, 189, 248, 0.22)',
    uiAccent: '#38bdf8',
    uiAccentSoft: 'rgba(56, 189, 248, 0.15)',
    textMain: '#f0f9ff',
    textMuted: '#93c5fd',
  },
  {
    id: 'pal-04-carbon-graphite',
    code: 'PAL-04',
    badge: 'CARBON GRAPHITE',
    name: 'Carbon Graphite (Gris Grafito Neutro + UI Acero)',
    description:
      'Superficie gris grafito mate inspirada en estaciones de ingeniería (Linear / Apple Pro). Separa totalmente la estructura neutra de las señales Verde/Rojo.',
    panelBg: 'rgba(20, 22, 27, 0.80)',
    innerCardBg: 'rgba(13, 14, 18, 0.88)',
    border: 'rgba(161, 161, 170, 0.20)',
    uiAccent: '#e4e4e7',
    uiAccentSoft: 'rgba(228, 228, 231, 0.14)',
    textMain: '#fafafa',
    textMuted: '#a1a1aa',
  },
  {
    id: 'pal-05-emerald-glass',
    code: 'PAL-05',
    badge: 'EMERALD QUANT GLASS',
    name: 'Emerald Quant Glass (Subtono Bosque Oscuro + UI Esmeralda)',
    description:
      'Cristal oscuro teñido con un sutil subtono verde cuantitativo y bordes esmeralda suaves.',
    panelBg: 'rgba(6, 24, 20, 0.76)',
    innerCardBg: 'rgba(4, 15, 13, 0.86)',
    border: 'rgba(16, 185, 129, 0.24)',
    uiAccent: '#10b981',
    uiAccentSoft: 'rgba(16, 185, 129, 0.16)',
    textMain: '#ecfdf5',
    textMuted: '#86efac',
  },
  {
    id: 'pal-06-warm-titanium',
    code: 'PAL-06',
    badge: 'WARM TITANIUM',
    name: 'Warm Titanium (Piedra Oscura + UI Ámbar Terminal)',
    description:
      'Inspirada en terminales clásicas: fondo piedra cálida oscura con pestañas de navegación en ámbar (#f59e0b), manteniendo Verde/Rojo estrictos para precios.',
    panelBg: 'rgba(23, 19, 16, 0.80)',
    innerCardBg: 'rgba(15, 12, 10, 0.88)',
    border: 'rgba(245, 158, 11, 0.22)',
    uiAccent: '#f59e0b',
    uiAccentSoft: 'rgba(245, 158, 11, 0.15)',
    textMain: '#fafaf9',
    textMuted: '#d6d3d1',
  },
  {
    id: 'pal-07-cobalt-indigo',
    code: 'PAL-07',
    badge: 'COBALT QUANT',
    name: 'Cobalt Quant (Índigo Nocturno + UI Violeta/Índigo)',
    description:
      'Atmósfera espacial cobalto/índigo profundo donde la navegación usa índigo (#818cf8) y las magnitudes financieras resaltan en Verde y Rojo puros.',
    panelBg: 'rgba(14, 16, 38, 0.78)',
    innerCardBg: 'rgba(9, 10, 26, 0.86)',
    border: 'rgba(129, 140, 248, 0.24)',
    uiAccent: '#818cf8',
    uiAccentSoft: 'rgba(129, 140, 248, 0.16)',
    textMain: '#eef2ff',
    textMuted: '#a5b4fc',
  },
  {
    id: 'pal-08-frosted-ice',
    code: 'PAL-08',
    badge: 'FROSTED SMOKE',
    name: 'Frosted Smoke (Cristal Translúcido de Alta Transparencia)',
    description:
      'Paneles ultra-translúcidos con bordes helados más marcados que dejan ver el campo estelar de fondo con mayor claridad.',
    panelBg: 'rgba(255, 255, 255, 0.05)',
    innerCardBg: 'rgba(10, 14, 24, 0.55)',
    border: 'rgba(255, 255, 255, 0.22)',
    uiAccent: '#38bdf8',
    uiAccentSoft: 'rgba(56, 189, 248, 0.16)',
    textMain: '#ffffff',
    textMuted: '#cbd5e1',
  },
];

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
  {
    id: 'lambda08-a-base',
    tier: 'lambda08',
    family: 'Archivo • Referencia Base (2.8px)',
    letter: 'λ-08A • BASE',
    code: '08-A',
    name: 'λ-08A • Original Elegida (Trazo Medio 2.8px)',
    meaning: 'Doble gancho curvo y pata izquierda continua a 2.8px.',
    renderSvg: (strokeColor = '#000', size = 18) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M6.2 6.2C7.8 4.3 9.8 4.8 11.1 7.2L16.3 17.6C17 19 18 19.4 19.3 18.8"
          stroke={strokeColor}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M12.4 10.6L6.2 19.3"
          stroke={strokeColor}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'lambda08-b-bold',
    tier: 'lambda08',
    family: 'Archivo • Peso Firme (3.35px)',
    letter: 'λ-08B • BOLD',
    code: '08-B',
    name: 'λ-08B • Peso Firme / Bold (3.35px)',
    meaning: 'Misma geometría de doble gancho pero con trazo más robusto.',
    renderSvg: (strokeColor = '#000', size = 18) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M5.8 6.4C7.6 4.2 9.8 4.7 11.2 7.3L16.2 17.4C16.9 18.9 18.1 19.3 19.5 18.6"
          stroke={strokeColor}
          strokeWidth="3.35"
          strokeLinecap="round"
        />
        <path
          d="M12.4 10.6L6.0 19.2"
          stroke={strokeColor}
          strokeWidth="3.35"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'lambda08-c-latex-contrast',
    tier: 'lambda08',
    family: 'Archivo • Contraste LaTeX',
    letter: 'λ-08C • LATEX',
    code: '08-C',
    name: 'λ-08C • Contraste Caligráfico LaTeX (3.5px / 2.15px)',
    meaning: 'Asta curva maestra gruesa (3.5px) y diagonal izquierda esbelta (2.15px).',
    renderSvg: (strokeColor = '#000', size = 18) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M6.0 6.3C7.7 4.3 9.8 4.8 11.2 7.3L16.3 17.5C17 19 18.1 19.4 19.4 18.7"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M12.3 10.4L6.0 19.3"
          stroke={strokeColor}
          strokeWidth="2.15"
          strokeLinecap="round"
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

export default function DevLabView({
  selectedIconId,
  onSelectIconId,
  selectedBoxStyleId,
  onSelectBoxStyleId,
}) {
  const [activeLabSection, setActiveLabSection] = useState('palettes'); // 'palettes' | 'icons'
  const [selectedPalettes, setSelectedPalettes] = useState(['pal-01-obsidian', 'pal-02-oled-black', 'pal-03-abyssal-navy']);
  const [showKeylineGrid, setShowKeylineGrid] = useState(true);
  const activeBox = DEV_BOX_STYLES.find((b) => b.id === selectedBoxStyleId) || DEV_BOX_STYLES[3];

  const togglePaletteSelection = (palId) => {
    setSelectedPalettes((prev) =>
      prev.includes(palId) ? prev.filter((id) => id !== palId) : [...prev, palId]
    );
  };

  const renderPaletteCard = (pal) => {
    const isChosen = selectedPalettes.includes(pal.id);
    return (
      <div
        key={pal.id}
        onClick={() => togglePaletteSelection(pal.id)}
        style={{
          borderRadius: '20px',
          backgroundColor: pal.panelBg,
          backdropFilter: 'blur(16px)',
          border: isChosen ? `2px solid ${pal.uiAccent}` : `1px solid ${pal.border}`,
          padding: '1.05rem 1.15rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          cursor: 'pointer',
          boxShadow: isChosen
            ? `0 10px 28px rgba(0, 0, 0, 0.55), 0 0 0 1px ${pal.uiAccent}`
            : '0 8px 22px rgba(0, 0, 0, 0.45)',
          transition: 'all 0.2s ease',
        }}
      >
        {/* TOP HEADER OF PALETTE CARD */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <span
              className="mono-metric"
              style={{
                fontSize: '0.6rem',
                fontWeight: 800,
                padding: '0.16rem 0.55rem',
                borderRadius: '999px',
                backgroundColor: pal.uiAccentSoft,
                border: `1px solid ${pal.uiAccent}`,
                color: pal.uiAccent,
              }}
            >
              {pal.code} • {pal.badge}
            </span>
            {isChosen && (
              <span
                className="mono-metric"
                style={{
                  fontSize: '0.56rem',
                  fontWeight: 800,
                  color: FINANCIAL_BULL_GREEN,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <Check size={11} /> MARCADA
              </span>
            )}
          </div>

          {/* Swatches: Surface + UI Accent + Locked Bull Green + Locked Bear Red */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Superficie • Acento UI • Verde Alcista Fijo • Rojo Bajista Fijo">
            <span
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '4px',
                backgroundColor: pal.panelBg,
                border: '1px solid rgba(255,255,255,0.35)',
              }}
            />
            <span
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '4px',
                backgroundColor: pal.uiAccent,
                border: '1px solid rgba(0,0,0,0.4)',
              }}
            />
            <span
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '999px',
                backgroundColor: FINANCIAL_BULL_GREEN,
                boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)',
              }}
            />
            <span
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '999px',
                backgroundColor: FINANCIAL_BEAR_RED,
                boxShadow: '0 0 6px rgba(244, 63, 94, 0.5)',
              }}
            />
          </div>
        </div>

        {/* TITLE & DESCRIPTION */}
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: pal.textMain, marginBottom: '0.2rem' }}>
            {pal.name}
          </div>
          <p style={{ fontSize: '0.7rem', color: pal.textMuted, margin: 0, lineHeight: 1.42 }}>
            {pal.description}
          </p>
        </div>

        {/* LIVE MINI-WORKSTATION PREVIEW WITH IMMOVABLE GREEN/RED FINANCIAL MOVEMENTS */}
        <div
          style={{
            borderRadius: '14px',
            backgroundColor: pal.innerCardBg,
            border: `1px solid ${pal.border}`,
            padding: '0.75rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          {/* Simulated UI Filter Pills (Uses Palette's Neutral UI Accent) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <span
                className="mono-metric"
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.48rem',
                  borderRadius: '999px',
                  backgroundColor: pal.uiAccentSoft,
                  border: `1px solid ${pal.uiAccent}`,
                  color: pal.uiAccent,
                }}
              >
                All Assets (10)
              </span>
              <span
                className="mono-metric"
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.48rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${pal.border}`,
                  color: pal.textMuted,
                }}
              >
                Equities
              </span>
              <span
                className="mono-metric"
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.48rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${pal.border}`,
                  color: pal.textMuted,
                }}
              >
                Crypto
              </span>
            </div>
            <span className="mono-metric" style={{ fontSize: '0.52rem', color: pal.textMuted }}>
              LIVE MAGNITUDES
            </span>
          </div>

          {/* BULLISH FINANCIAL ROW — STRICTLY GREEN (#10b981) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '64px 1fr auto',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.42rem 0.55rem',
              borderRadius: '9px',
              backgroundColor: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.22)',
            }}
          >
            <div>
              <div className="mono-metric" style={{ fontSize: '0.72rem', fontWeight: 800, color: pal.textMain }}>
                NVDA
              </div>
              <div className="mono-metric" style={{ fontSize: '0.55rem', color: pal.textMuted }}>
                $138.60
              </div>
            </div>

            {/* Magnitude Bar (Green) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.52rem' }}>
                <span className="mono-metric" style={{ color: FINANCIAL_BULL_GREEN, fontWeight: 700 }}>
                  BULL FLOW +2.4σ
                </span>
                <span className="mono-metric" style={{ color: FINANCIAL_BULL_GREEN, fontWeight: 800 }}>
                  +$5.56
                </span>
              </div>
              <div
                style={{
                  height: '5px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '82%',
                    height: '100%',
                    borderRadius: '999px',
                    backgroundColor: FINANCIAL_BULL_GREEN,
                  }}
                />
              </div>
            </div>

            <span
              className="mono-metric"
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '0.18rem 0.45rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.16)',
                color: FINANCIAL_BULL_GREEN,
              }}
            >
              +4.18%
            </span>
          </div>

          {/* BEARISH FINANCIAL ROW — STRICTLY RED (#f43f5e) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '64px 1fr auto',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.42rem 0.55rem',
              borderRadius: '9px',
              backgroundColor: 'rgba(244, 63, 94, 0.06)',
              border: '1px solid rgba(244, 63, 94, 0.22)',
            }}
          >
            <div>
              <div className="mono-metric" style={{ fontSize: '0.72rem', fontWeight: 800, color: pal.textMain }}>
                SOL
              </div>
              <div className="mono-metric" style={{ fontSize: '0.55rem', color: pal.textMuted }}>
                $174.20
              </div>
            </div>

            {/* Magnitude Bar (Red) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.52rem' }}>
                <span className="mono-metric" style={{ color: FINANCIAL_BEAR_RED, fontWeight: 700 }}>
                  BEAR OUTFLOW -1.9σ
                </span>
                <span className="mono-metric" style={{ color: FINANCIAL_BEAR_RED, fontWeight: 800 }}>
                  -$4.72
                </span>
              </div>
              <div
                style={{
                  height: '5px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '64%',
                    height: '100%',
                    borderRadius: '999px',
                    backgroundColor: FINANCIAL_BEAR_RED,
                  }}
                />
              </div>
            </div>

            <span
              className="mono-metric"
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '0.18rem 0.45rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(244, 63, 94, 0.16)',
                color: FINANCIAL_BEAR_RED,
              }}
            >
              -2.64%
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderIconCard = (item) => {
    const isSelected = selectedIconId === item.id;
    return (
      <div
        key={item.id}
        onClick={() => onSelectIconId(item.id)}
        style={{
          padding: '0.95rem 1.1rem',
          borderRadius: '18px',
          backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(13, 19, 33, 0.62)',
          backdropFilter: 'blur(12px)',
          border: isSelected ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '0.8rem',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span
              className="mono-metric"
              style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '0.14rem 0.5rem',
                borderRadius: '999px',
                backgroundColor: isSelected ? '#10b981' : 'rgba(16, 185, 129, 0.18)',
                color: isSelected ? '#000' : '#10b981',
              }}
            >
              {item.letter}
            </span>
            {isSelected && (
              <span className="mono-metric" style={{ fontSize: '0.56rem', color: '#10b981', fontWeight: 800 }}>
                ACTIVO EN HEADER
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: activeBox.bg,
                border: activeBox.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.renderSvg(activeBox.strokeColor, 28)}
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.18rem' }}>
            {item.name}
          </div>
          <p style={{ fontSize: '0.69rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.42 }}>
            {item.meaning}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: 'calc(100vh - 118px)',
        overflowY: 'auto',
        paddingRight: '0.35rem',
      }}
    >
      {/* TOP BAR: DEV LAB SWITCHER (PUNTO 1C PALETAS AMBIENTALES vs ARCHIVO LOGO λ) */}
      <div
        style={{
          borderRadius: '22px',
          backgroundColor: 'rgba(13, 19, 33, 0.65)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.95rem 1.3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          flexShrink: 0,
        }}
      >
        <div>
          <div className="mono-metric" style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 800 }}>
            PUNTO 1C • LABORATORIO DE PALETAS AMBIENTALES (VERDE `#10b981` Y ROJO `#f43f5e` 100% FIJOS EN DATOS FINANCIEROS)
          </div>
          <h2 style={{ fontSize: '1.16rem', fontWeight: 800, color: '#ffffff', margin: '0.15rem 0 0 0' }}>
            8 Modelos de Superficie y Atmósfera (`PAL-01` a `PAL-08`)
          </h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
            Cada tarjeta simula una mini-terminal real: la paleta cambia el cristal del panel y el acento de navegación, pero toda variación de precios, flujo y magnitud se mantiene inamovible en Verde (`#10b981`) y Rojo (`#f43f5e`).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setActiveLabSection('palettes')}
            className="mono-metric"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.6rem',
              fontWeight: 800,
              padding: '0.32rem 0.75rem',
              borderRadius: '999px',
              border: activeLabSection === 'palettes' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.14)',
              backgroundColor: activeLabSection === 'palettes' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255,255,255,0.04)',
              color: activeLabSection === 'palettes' ? '#10b981' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <Palette size={12} />
            <span>Punto 1C: 8 Paletas Ambientales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLabSection('icons')}
            className="mono-metric"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.6rem',
              fontWeight: 800,
              padding: '0.32rem 0.75rem',
              borderRadius: '999px',
              border: activeLabSection === 'icons' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.14)',
              backgroundColor: activeLabSection === 'icons' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255,255,255,0.04)',
              color: activeLabSection === 'icons' ? '#38bdf8' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <Grid size={12} />
            <span>Archivo: Logo λ-08H</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      {activeLabSection === 'palettes' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '0.9rem',
          }}
        >
          {DEV_PALETTE_MODELS.map(renderPaletteCard)}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(305px, 1fr))',
            gap: '0.8rem',
          }}
        >
          {DEV_ICON_CATALOG.map(renderIconCard)}
        </div>
      )}
    </div>
  );
}
