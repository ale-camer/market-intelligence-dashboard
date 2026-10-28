# Especificación de Diseño, Producto y Hoja de Ruta (`UI_SPEC.md`)

Documento vivo que centraliza el estado actual de la plataforma y la agenda completa de desarrollo (iconografía funcional, consistencia global, nuevas clases de activos financieros, simulaciones de derivados/correlaciones y persistencia).

---

## Reglas Inquebrantables de Diseño
- **Header Arriba a la Izquierda (`HeaderBar.jsx`):** Va **ÚNICAMENTE** el símbolo **`λ-08H`** (`32px`, sin caja contenedor). **JAMÁS** colocar `"TBD"` ni ningún otro texto al lado del ícono en el Header.
- **Activos Financieros:** Sin logos de empresas ni criptomonedas; siempre tipografía monoespaciada limpia (`BTC`, `NVDA`, etc.).
- **Estándar Industrial Inamovible de Color Financiero:** **Verde (`#10b981`) = Positivo / Suba / Alcista** y **Rojo (`#f43f5e`) = Negativo / Baja / Bajista** en **TODA** medición de magnitud de movimiento de activos financieros (precios, variaciones `%`, P&L, velas/gráficos, barras de magnitud, sentimiento y anomalías). Ningún tema o paleta ambiental puede alterar jamás el verde ni el rojo en datos financieros.
- **Iconografía Funcional (Punto 1B Cerrado):** Se mantiene la interfaz tipográfica actual tal como está, sin agregar íconos extra en categorías, modos ni filtros.
- **Proceso de Trabajo:** Prohibido tomar decisiones unilaterales. Todo cambio se presenta con opciones paso a paso (o en `DEV`) y solo se aplica lo que el usuario elige.

---

## Estado Actual (Completado en base del MVP)
- [x] **Home Stage (`HomeStage.jsx`):** Animación WebGL en loop con placa estilo museo y fondo estelar (`StarfieldBackground.jsx`).
- [x] **Markets — Nivel 1 (`MarketAnomaliesView.jsx`):** Screener con modos `Table`, `Orbital` y `Heatmap`, filtros por categoría, búsqueda con teclado y semántica estricta de color (**Verde** = Positivo / **Rojo** = Negativo).
- [x] **Markets — Nivel 2 (`Analytics` | `Research`):**
  - `Analytics`: Gráfico interactivo multi-temporalidad, overlays técnicos (`SMA`, `Bollinger`, `VWAP`), comparación relativa (`%`) y microestructura (`Vol Z-Score` y `Spread bps`).
  - `Research`: Tesis ejecutiva, buscador sobre reportes oficiales con *guardrails* de 3 capas, Top 5 Bull Drivers / Top 5 Bear Risks ponderados por importancia, sensibilidad por clase de activo y flujo de noticias en vivo.
- [x] **Portfolio (`AgentCommitteeView.jsx`):** Anillo de distribución (Donut SVG) + bloques proporcionales de `68px`, selector de activos con doble filtro y teclado, expansión bajo demanda (*click-to-expand*) y Comité de 3 pilares (`Analytics` + `Research` + `Risk Guardrail`) más historial de órdenes.

---

## Agenda Completa de Pendientes (Ordenada por Bloques)

### 1. Identidad Visual, Iconografía Funcional y Paletas (En Progreso)
- [x] **Emblema de Marca y Favicon (`HeaderBar.jsx`, `public/favicon.svg`):** Monograma griego `λ-08H` (Lambda Matemática con Gancho Curvo y Trazo de Grosor Variable, sin caja contenedor).
- [x] **Sistema de Iconografía Funcional (Cerrado por Decisión del Usuario):** Se mantiene la interfaz tipográfica limpia tal como está, sin íconos adicionales en categorías, modos ni filtros.
- [x] **Calibración de Temas Ambientales (`index.css` e `i18n.js`):** 5 paletas ambientales en el selector del footer (*Obsidian Night*, *OLED Pitch Black*, *Abyssal Navy*, *Warm Titanium* y *Cobalt Quant*), manteniendo inamovibles **Verde (`#10b981`) = Positivo** y **Rojo (`#f43f5e`) = Negativo** en toda magnitud o movimiento financiero.

### 2. Pantallas Secundarias y Limpieza Global
- [ ] **Rediseño de `System Observability` (`ObservabilityView.jsx`):** Actualizar la estética de `🟢 System Observability ↗` al diseño *glassmorphic* actual, eliminando códigos internos (`P-01..P-11`) y mostrando salud real de ingesta cuantitativa, motor NLP/RAG y motor de riesgo.
- [ ] **Limpieza de Tooltips Globales e `i18n.js` (`FooterBar.jsx`):** Limpiar referencias a `P-01..P-11`, `pgvector` y `dbt` en el ícono `ⓘ` y asegurar traducción 100% completa entre `EN` y `ES`.

### 3. Expansión de Clases de Activos Financieros y Métricas Específicas
- [ ] **Incorporar Nuevas Clases de Activos al Universo (`marketService.js`, `filingsAndNewsService.js`, `committeeService.js`):**
  1. **Commodities (`COMMODITY`):** Ej. Oro (`XAU` / `GLD`), Petróleo WTI (`CL` / `USO`) — sensibles a tasas reales, inventarios físicos (EIA) y geopolítica (`35% Fundamentos / 65% Noticias`).
  2. **Renta Fija / Tasas (`RATES`):** Ej. Bono del Tesoro EE.UU. 10 Años (`US10Y` / `TLT`) — sensibles a actas de la Fed (FOMC), inflación CPI y subastas del Tesoro.
  3. **Divisas / FX (`FX`):** Ej. `EUR/USD`, `USD/JPY` — sensibles a diferenciales de tasas de bancos centrales (*Carry*) y balanza comercial.
- [ ] **Métricas y Herramientas Específicas por Clase de Activo en `Markets -> Analytics` (4ª Pestaña):**
  - **Acciones e Índices (`EQUITY` / `INDEX`):** Sonrisa de Volatilidad Implícita (*IV Smile*), *25Δ Put/Call Skew* y Gamma Exposure (`GEX`).
  - **Crypto (`CRYPTO`):** Curva de Tasas de Fondeo (*Perpetual Funding Rates*), *Spot-Perp Basis*, *Open Interest* y Mapa de Liquidaciones.
  - **Commodities (`COMMODITY`):** Estructura Temporal de Futuros (*Term Structure: Contango vs Backwardation*), *Roll Yield* y Posicionamiento Neto Especulativo (`COT`).
  - **Tasas / Bonos (`RATES`):** Curva de Rendimientos Soberana (*Yield Curve 2Y-10Y-30Y*), Spread `2s10s`, Duración Modificada (`DV01`) y *Convexity*.
  - **FX / Monedas (`FX`):** Diferencial de Tasas de Interés (*Carry Trade Matrix*), *25Δ Risk Reversals* y Correlación con `DXY`.
- [ ] **Simulador de Derivados, Correlaciones y Stress Test en `Portfolio`:**
  - Matriz de correlación interactiva entre todas las clases de activos.
  - Simulador de cobertura cruzada (*Cross-Asset Hedging*: cubrir riesgo tecnológico con puts de `QQQ`, cubrir duración con `TLT`, cubrir shock inflacionario con `XAU`/`CL`, o cubrir `SOL` con perpetuos de `ETH`/`BTC`).
  - Métricas de cartera (*Sharpe Ratio*, *Beta*, *VaR 95%*, *Max Drawdown*) y simulador de escenarios macro (*Stress Test*).

### 4. Experiencia de Usuario (UX), Persistencia y Sincronización
- [ ] **Persistencia en `localStorage`:** Conservar posiciones simuladas en `Portfolio`, noticias recibidas, idioma y tema al recargar.
- [ ] **Sincronización en vivo `Markets` ↔ `Portfolio`:** Que las noticias de alta materialidad que actualizan los drivers en `Research` impacten en vivo sobre el score de `Portfolio`.
- [ ] **Atajo Global de Teclado (`Cmd/Ctrl + K` o `/`):** Buscador rápido desde cualquier sección.

### 5. Motor de Ticks en Tiempo Real y Cierre Técnico
- [ ] **Simulación de Ticks en Tiempo Real:** Micro-actualizaciones de precio, volumen y P&L en vivo con indicador de latencia.
- [ ] **Optimización de Bundle (`code-splitting`):** Particionar módulos pesados para carga instantánea en producción.
