# Especificación de Diseño, Producto y Hoja de Ruta (`UI_SPEC.md`)

Documento vivo que centraliza el estado actual de la plataforma y la agenda completa de desarrollo (iconografía funcional, consistencia global, nuevas clases de activos financieros, simulaciones de derivados/correlaciones y persistencia).
- **Plan Maestro Detallado de los 6 Pilares del MVP:** Ver [`docs/MVP_MASTER_BLUEPRINT.md`](MVP_MASTER_BLUEPRINT.md).

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

### 1. Identidad Visual, Iconografía Funcional y Paletas (Completado)
- [x] **Emblema de Marca y Favicon (`HeaderBar.jsx`, `public/favicon.svg`):** Monograma griego `λ-08H` (Lambda Matemática con Gancho Curvo y Trazo de Grosor Variable, sin caja contenedor).
- [x] **Sistema de Iconografía Funcional (Cerrado por Decisión del Usuario):** Se mantiene la interfaz tipográfica limpia tal como está, sin íconos adicionales en categorías, modos ni filtros.
- [x] **Calibración de Temas Ambientales (`index.css` e `i18n.js`):** 5 paletas ambientales en el selector del footer (*Obsidian Night*, *OLED Pitch Black*, *Abyssal Navy*, *Warm Titanium* y *Cobalt Quant*), manteniendo inamovibles **Verde (`#10b981`) = Positivo** y **Rojo (`#f43f5e`) = Negativo** en toda magnitud o movimiento financiero.

### 2. Pantallas Secundarias, FinOps, Multi-Idioma y Limpieza Global (Completado)
- [x] **Rediseño Minimalista de `System Observability` y FinOps (`ObservabilityView.jsx`, `observabilityService.js`):** Cabecera con gradiente sutil de semáforo, 4 cards de FinOps y almacenes Free-Tier compartidos (`< $10/mes`, `Neon pgvector`, `Atlas M0`, `Upstash/BigQuery`) + las 13 cards de los repositorios reales (`P-01`..`P-11`, `portfolio-infra` y `market-intelligence-dashboard`), con validación programática de contratos y despliegue bajo demanda (*click-to-expand*).
- [x] **Ventana Central Selector de Idioma con 56 Idiomas y Banderas (`FooterBar.jsx` e `i18n.js`):** Ventana modal en el medio de la pantalla con menú desplegable (*combobox*) donde el usuario puede escribir el idioma en su lengua original (`Español`, `English`, `Português`, `Français`, `Deutsch`, `Italiano`, `Nederlands`, `Polski`, `Русский`, `Ελληνικά`, `العربية`, `עברית`, `हिन्दी`, `日本語`, `한국어`, `中文`, etc.) entre **56 idiomas globales** con su bandera SVG vectorial a la izquierda.
- [x] **Actualización de Tooltips Globales e `i18n.js` (`FooterBar.jsx`):** Sincronización de textos reflejando los 13 repositorios, almacenes compartidos y control FinOps (`< $10/mes`).

### 3. Planificación del Universo de Activos Financieros (Por Volumen, Liquidez y Compactación)
- **Catálogo Definitivo y Reglas de Compactación:** Ver [`docs/ASSET_UNIVERSE_PLAN.md`](ASSET_UNIVERSE_PLAN.md).
- **Regla de UI Inquebrantable:** **No crear ningún UI nuevo.** Todos los activos y categorías se integran directamente sobre la interfaz ya definida y aprobada en `Markets` (`Table`, `Orbital`, `Heatmap`, `Analytics`, `Research`) y `Portfolio`.
- **Criterio Rector de Datos (Volumen + Aplanado/TTL):**
  - Selección y filtrado estricto por **mayor volumen operado y liquidez**.
  - **Aplanado Progresivo (*Downsampling*) y Purga (*Rolling TTL*):** `1m`/`5m` (48h) → `1H` (30d) → `1D` (2y) → `1W` (>2y); cadenas de opciones y noticias se aplanan a métricas diarias tras su ventana activa, manteniendo el almacenamiento fijo en `~45–60 MB` (`$0.00/mes` permanente).
- **Las 10 Categorías Oficiales Cerradas:**
  1. **`INDEX` (Índices Principales):** Los 22 índices globales listados (Norteamérica, Europa, Asia-Pacífico y LatAm).
  2. **`EQUITY` (Equities):** **Exclusivamente las acciones que componen el S&P 500 y el Nasdaq-100** (~515 tickers únicos ordenados por volumen diario en USD).
  3. **`ETF` (ETFs Principales):** Los 31 ETFs de mayor volumen operado listados.
  4. **`CRYPTO` (Criptoactivos):** Los 15 criptoactivos líderes por volumen 24h.
  5. **`RATES` (Curvas Soberanas de Todos los Países):** Vectores por plazo (`1M`/`3M` a `30Y`) de **todos los países con mercado soberano (~40 países)** para dibujar la curva de cada país y calcular `2s10s`, `3m10y`, `butterfly`, tasas reales y `DV01`.
  6. **`FIXED_INCOME` (Renta Fija):** **Exclusivamente los Bonos del Tesoro de Estados Unidos (*US Treasuries*)** (`2Y` a `30Y` + `TIPS`).
  7. **`FX` (Divisas — Todas las Monedas del Mundo):** Solo se almacena cada moneda del mundo (~150 divisas ISO) contra el dólar (`USD/XXX`) + `DXY`, y **cualquier cruce entre dos monedas se calcula dinámicamente por conversión cruzada** (`(USD/B) / (USD/A)`).
  8. **`COMMODITY` (Materias Primas):** Las 26 materias primas de Energía, Metales Preciosos, Metales Industriales y Agrícolas/Softs.
  9. **`DERIVATIVES_VOL` (Derivados, Volatilidad y Opciones sobre Acciones de Mayor Volumen):** Futuros líderes + Índices de Volatilidad (`VIX`, `VXN`, `MOVE`, etc.) + **Opciones sobre acciones de mayor volumen**, descartando primas de bajo volumen/Open Interest para no distorsionar la curva de volatilidad ni las griegas.
  10. **`CASH` (Mercado Monetario y Liquidez):** Los 13 instrumentos monetarios de mayor volumen (`SOFR`, `EFFR`, `ESTR`, `SONIA`, `TONAR`, `T-Bills`, `SGOV`, `BIL`, `Fed RRP`, `USDT`, `USDC`).

### 4. Cierre de Motores Quant del MVP (Opciones/Sintéticos & Riesgo de Cartera)
- [x] **Superficie de Volatilidad 2D, Curva Soberana de 42 Países, Conversor Cruzado de 61 Monedas y Curva Forward de Commodities (`globalUniverseData.js`, `MarketAnomaliesView.jsx`).**
- [ ] **Perfil de Beneficios (`Payoff P&L` a vencimiento y `T+0`) para Estrategias de Opciones y Sintéticos (`Analytics`):** Selector de estrategias (*Long/Short Call/Put, Straddle, Strangle, Bull/Bear Vertical Spread, Iron Condor, Covered Call, Synthetic Long/Short*) con gráfico de P&L, *breakevens* y Griegas netas (`Δ, Γ, Θ, ν`).
- [ ] **Métricas Quant de Cartera (`Portfolio`):** Resumen de riesgo agregado (**VaR 95% diario, Beta ponderado, Sharpe estimado y Matriz de Correlación de posiciones activas**).

### 5. Experiencia de Usuario (UX), Watchlist, Persistencia y Sincronización
- [x] **Watchlist Multi-Activo Conectada (`Markets` ↔ `Portfolio` con persistencia en `localStorage`):** Estrella `★/☆` en cada fila del Screener y en el Hero de Nivel 2 (`MarketAnomaliesView.jsx`), filtro dedicado `★ Watchlist (N)` en Nivel 1 y sincronización directa hacia la pestaña `★ Watchlist` en `Portfolio` (`AgentCommitteeView.jsx`) con evaluación del Comité de 3 pilares y botón de incorporación en 1 click (`+ INCORPORAR`).
- [ ] **Persistencia completa en `localStorage`:** Conservar también posiciones simuladas en `Portfolio`, noticias recibidas, idioma y tema al recargar.
- [ ] **Sincronización en vivo `Markets` ↔ `Portfolio`:** Que las noticias de alta materialidad que actualizan los drivers en `Research` impacten en vivo sobre el score de `Portfolio`.
- [ ] **Atajo Global de Teclado (`Cmd/Ctrl + K` o `/`):** Buscador rápido desde cualquier sección.

### 6. Motor de Ticks en Tiempo Real y Cierre Técnico
- [ ] **Simulación de Ticks en Tiempo Real:** Micro-actualizaciones de precio, volumen y P&L en vivo con indicador de latencia.
- [ ] **Optimización de Bundle (`code-splitting`):** Particionar módulos pesados para carga instantánea en producción.

### 7. Guía de Usuario, Definiciones Cuantitativas y Objetos de la App (Última Etapa — Iteración Final)
- [x] **Placeholder Estructural (`UserGuideView.jsx` accesible desde el botón `(i)` del Footer):** Esqueleto inicial dividido en 4 secciones (01. Objetos de Interfaz y Modos Visuales, 02. Las 10 Clases de Activos y sus Columnas, 03. Motores Cuantitativos Interactivos, 04. Glosario de Indicadores, Anomalías P-06 y Guardrails RAG).
- [ ] **Redacción Definitiva e Iteración de la Documentación In-App y Técnica (Última Tarea tras cerrar los bloques anteriores):**
  -Completar las definiciones detalladas, fórmulas, umbrales e interpretación práctica de cada objeto, indicador y motor cuantitativo dentro de la guía interactiva de usuario.
  - Iterar junto al usuario para asegurar que toda la documentación técnica y funcional (`UI_SPEC.md`, `ASSET_UNIVERSE_PLAN.md`, `ASSET_CLASS_SPECIFICATIONS.md` y `UserGuideView.jsx`) sea 100% consistente con el producto terminado.
