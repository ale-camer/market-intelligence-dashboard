# Checklist Exhaustivo de Aprobación Elemento por Elemento (`MVP_STATUS_TRACKER.md`)

> ### 📊 Resumen General de Estado (Total: `100 ítems` = `100.0%`)
> - ✅ **Aprobación Final del Usuario:** `2 / 100` (**`2.0%`**) — *`Home` minimalista original aprobado.*
> - 🟡 **Aprobación Parcial (Implementado y ya revisado/pedido por vos):** `76 / 100` (**`76.0%`**)
> - 🔵 **Implementado en Código (Listo para tu primera revisión):** `22 / 100` (**`22.0%`**)
> - 🔲 **Pendiente de Desarrollo (Aún por construir en código):** `0 / 100` (**`0.0%`**)
> - **Total Acumulado:** `100 / 100 ítems` (**`100.0%`** — *Construido en código: `100.0%` • Pendiente de código: `0.0%`*)

---

## 1. Marco Global: Cabecera (`HeaderBar`) y Pie de Página (`FooterBar`) — `[9 ítems]`

### 1.1 Cabecera Superior (`HeaderBar.jsx`)
- 🟡 **Ícono institucional (`λ`):** ubicado arriba a la izquierda; libre en verde esmeralda (`#10b981`) y al hacer click vuelve siempre al `Home`.
- 🟡 **Menú principal centrado (`Markets` | `Portfolio`):** píldora central flotante con únicamente las 2 estaciones operativas principales.
- 🟡 **Ausencia de botones redundantes en cabecera:** sin botón `Home` duplicado ni buscador global invasivo en la barra superior.

### 1.2 Pie de Página (`FooterBar.jsx`)
- 🟡 **Píldora izquierda `System Observability`:** punto verde pulsante; al hacer click abre/cierra la vista de salud de los 13 repositorios (`ObservabilityView`).
- 🟡 **Botón `(i)` de Guía de Usuario y Definiciones:** ubicado junto a `System Observability`; abre/cierra `UserGuideView`.
- 🟡 **Botón `DEV` (`DevLabView`):** ubicado junto al botón `(i)`; abre el laboratorio de diseño para comparar variantes visuales.
- 🟡 **Botón de Idioma (abajo a la derecha):** muestra bandera SVG + código ISO actual y al hacer click abre una ventana modal en el centro de la pantalla (no cambia de idioma directo).
- 🟡 **Ventana Modal de Idiomas (`56 idiomas`):** centrada en pantalla con fondo *glassmorphism*, buscador desplegable donde se puede escribir el idioma en su lengua original (`Español`, `English`, `Deutsch`, `Русский`, `العربية`, `日本語`, etc.) y banderas SVG a la izquierda de cada opción.
- 🟡 **Botón de Paleta Ambiental (abajo a la derecha):** cicla entre las 5 paletas de fondo (`Midnight Quant`, `Obsidian Carbon`, `Deep Space Navy`, `Emerald Abyss`, `Pure Pitch Black`) sin alterar jamás el verde/rojo financiero.

---

## 2. Pantalla 1: `Home` (`HomeStage.jsx` — `/?view=home`) — `[2 ítems]`

- ✅ **Fondo espacial interactivo (`WebbDeepFieldCanvas`):** animación cósmica en tiempo real sobre negro puro (`#000000`) totalmente despejada, sin tarjetas ni paneles superpuestos.
- ✅ **Título y subtítulo introductorios sutiles:** centrados en la parte superior (`18.5%`) con tipografía editorial limpia.

---

## 3. Pantalla 2 — Nivel 1: `Markets • Screener Global` (`MarketAnomaliesView.jsx` — `/?view=markets&mode=screener`) — `[31 ítems]`

### 3.1 Barra Superior de Filtros por Clase de Activo (`10 Categorías + Watchlist`)
- 🟡 **Píldora `Todos (All)`:** muestra el universo completo de `213 activos` ordenados por liquidez/volumen en USD.
- 🟡 **Píldora `★ Watchlist (N)`:** filtra únicamente los activos marcados con estrella por el usuario, con contador en vivo.
- **10 Píldoras de Categorías ordenadas alfabéticamente:**
  - 🟡 `Bonos US Treasury (FIXED_INCOME)` — `9` títulos del Tesoro de EE.UU. y TIPS.
  - 🟡 `Cash & SOFR (CASH)` — `13` instrumentos monetarios, tasas overnight (`SOFR`, `EFFR`, `ESTR`, `SONIA`, `TONAR`), T-Bills y stablecoins.
  - 🟡 `Crypto (CRYPTO)` — `15` criptoactivos líderes por volumen spot/perpetuos.
  - 🟡 `Derivados & Vol (DERIVATIVES_VOL)` — `17` índices de volatilidad (`VIX`, `VXN`, `MOVE`), futuros y opciones líquidas.
  - 🟡 `Divisas FX (FX)` — `30` pares principales en tabla + motor de `61` monedas ISO contra USD.
  - 🟡 `Acciones S&P/NDX (EQUITY)` — `42` acciones líderes del S&P 500 y Nasdaq-100.
  - 🟡 `ETFs (ETF)` — `35` ETFs globales de mayor volumen diario.
  - 🟡 `Índices (INDEX)` — `22` índices bursátiles globales (EE.UU., Europa, Asia, LatAm).
  - 🟡 `Materias Primas (COMMODITY)` — `26` futuros de energía, metales preciosos, industriales y agro.
  - 🟡 `Tasas & Curvas (RATES)` — `4` nodos benchmark en tabla conectados al motor de `42` curvas soberanas.

### 3.2 Las 4 Tarjetas de Pulso Agregado (`Pulse Cards`)
- 🟡 **Tarjeta 1 — `24h Aggregate Volume`:** volumen total en miles de millones (`$B`), variación `%`, conteo de activos filtrados y *sparkline* verde/roja.
- 🟡 **Tarjeta 2 — `AVG RSI (14)`:** anillo circular `RadialRingGauge` con el promedio de RSI de la categoría activa y etiqueta de régimen (`POSITIVE >50` / `CAUTIOUS <50`).
- 🟡 **Tarjeta 3 — `Normal Regime (P-06)`:** anillo circular con porcentaje legible (`79%`), conteo claro al lado (`169 / 213 activos normales`), desglose `Elevated • Disloc.` y píldora clicable del activo con mayor anomalía de esa categoría (`TOP ANOMALY`).
- 🟡 **Tarjeta 4 — `Top Volume Z-Score (20d)`:** ranking de los 3 activos con mayor desvío estadístico de volumen (`σ`) en las últimas 24h; cada fila es clicable.

### 3.3 Barra de Modos Visuales y Accesos Rápidos a Motores Cuantitativos
- 🟡 **Selector de Vista a la izquierda (`Tabla` | `Orbital` | `Mapa de Calor`):** alterna entre las 3 representaciones del Screener.
- 🟡 **Selector de Indicador Conductor (visible en `Orbital` y `Mapa de Calor`):** permite elegir qué métrica gobierna los colores y tamaños (`Anomaly Score P-06`, `Vol Z-Score 20d`, `RSI 14`, `24h % Change`, `24h Volume`, `Realized Vol`).
- **Tira de 4 Accesos Directos alineada a la derecha:**
  - 🟡 **Atajo 1:** `🌐 Curva Soberana 3D/2D (42 Países)`.
  - 🟡 **Atajo 2:** `📐 Superficie Volatilidad 3D`.
  - 🟡 **Atajo 3:** `⚡ Payoff P&L & Sintéticos`.
  - 🟡 **Atajo 4:** `💱 Conversor FX (61 Monedas)`.

### 3.4 Las 3 Vistas del Screener (Nivel 1)
- **Vista A — `Tabla` (`Table`):**
  - 🟡 **Buscador integrado en el encabezado de la columna Activo:** filtra por ticker o nombre y soporta teclado (`↑`, `↓`, `Enter`, `Escape`).
  - 🟡 **Estrella `★ / ☆` por fila:** agrega o quita el activo de la `Watchlist` sin entrar al detalle.
  - 🟡 **Columnas universales ordenables:** `#`, `Activo (Ticker + Nombre + Clase)`, `Price`, `24h %`, `Sparkline 7d`, `Volume (24h)`.
  - 🔵 **2 Columnas Dinámicas Específicas por Categoría:** aparecen al filtrar una clase específica (`2s10s / 3m10y` y `Tasa Real / DV01` en `RATES`; `P/E Fwd` y `Margen Bruto` en `EQUITY`; `ATM IV / Straddle` y `25Δ Skew / GEX` en `DERIVATIVES_VOL`; `Carry Spread` en `FX`; `Roll Yield` e `Inventario` en `COMMODITY`).
  - 🟡 **Columnas cuantitativas estándar (cuando está en `Todos`):** `Vol Z-Score (20d)`, `Realized Vol`, `RSI (14)`, `Anomaly Score (P-06)`.
- **Vista B — `Orbital` (`Radar Cuantitativo`):**
  - 🟡 **Anillos concéntricos y nodos orbitales:** posición radial proporcional a la magnitud del indicador elegido y color estrictamente verde/rojo según media histórica.
  - 🟡 **Inspector lateral en vivo:** al pasar el mouse sobre un planeta/nodo muestra sus métricas y *sparkline* de 5 minutos.
- **Vista C — `Mapa de Calor` (`Heatmap Finviz Style`):**
  - 🟡 **Grilla jerárquica de 4 columnas verticales (Top 10 activos):** ordenada de mayor a menor magnitud del indicador activo (`#1` y `#2` a la izquierda con mayor área).
  - 🟡 **Paleta estricta de 8 tonos verdes y rojos:** proporcional a la intensidad positiva o negativa frente a la media histórica.

---

## 4. Pantalla 2 — Nivel 2A: `Markets • Analytics` (`MarketAnomaliesView.jsx` — `/?view=markets&mode=detail&section=analytics`) — `[35 ítems]`

### 4.1 Barra Horizonte Superior y Cabecera Hero
- 🟡 **Botón `← Todos los Mercados`:** vuelve al Screener de Nivel 1.
- 🟡 **Buscador rápido `Cambiar activo (Ticker)...`:** autocompletado con navegación por teclado para cambiar de activo sin salir del Nivel 2.
- 🟡 **Conmutador Central Nivel 2 (`Analytics` | `Research`):** alterna entre la mesa cuantitativa y la mesa documental/NLP.
- 🔵 **Botón `P-06 RE-SCORE`:** dispara inferencia en vivo contra el microservicio Cloud Run (`Isolation Forest`) con lectura de latencia en `ms`.
- 🟡 **Selector de Temporalidad (`1m`, `5m`, `1H`, `1D`, `1W`, `1M`, `3M`, `1Y`, `ALL`):** recalcula la serie histórica del activo.
- 🟡 **Cabecera Hero del Activo:** nombre completo, par, categoría, botón **`★ EN WATCHLIST / ☆ + WATCHLIST`**, precio actual, cambio `%` y tira de 5 bloques de métricas a la derecha (incluyendo las **2 métricas específicas de su clase de activo**).

### 4.2 Lente 1: `Análisis Técnico` (`?lens=technical`)
- 🟡 **Gráfico de área/línea principal (`Recharts`):** curva de precio/tasa con gradiente verde o rojo según signo de 24h.
- 🟡 **Superposiciones activables (`Overlays`):** botones `SMA (20)`, `Bollinger Bands (20, 2σ)` y `VWAP`.
- 🟡 **Sub-panel sincronizado de Volumen:** histograma inferior activable/desactivable.

### 4.3 Lente 2: `Comparar Activos (%)` (`?lens=compare`)
- 🟡 **Restricción estricta a clases compatibles:** impide comparar activos incompatibles (ej. muestra `EQUITY / ETF / INDEX` para una acción, o `RATES / FIXED_INCOME / CASH` para una tasa).
- 🟡 **Buscador con autocompletado libre:** el usuario escribe el ticker o nombre del segundo activo (sin botones predeterminados fijos).
- 🟡 **Gráfico normalizado en retorno porcentual (`%`):** superpone ambas series desde `0%` al inicio de la ventana temporal y limpia automáticamente la comparación si se cambia a un activo primario incompatible.

### 4.4 Lente 3: `Microestructura & Flujo` (`?lens=microstructure`)
- 🔵 **Conmutador de Sub-panel (`Volume Z-Score 20d` vs `24h Volume Histogram`):** visualiza desvíos estadísticos de volumen en unidades sigma (`σ`).
- 🔵 **Telemetría de Spread y Anomalía:** lectura de `Spread Dislocation (bps)`, `Bollinger Width (%)` y diagnóstico de árbol `Isolation Forest (P-06)` en el pie del gráfico.

### 4.5 Lente 4 (Especializada por Clase) — `Opciones, Superficie 3D y Payoff P&L` (`DERIVATIVES_VOL`, `EQUITY`, `ETF`, `INDEX`, `CRYPTO`)
- **Sub-vista 1 — `Superficie IV 3D` (`?lens=derivatives&sub=surface3d`):**
  - 🔵 **Malla 3D volumétrica interactiva (`Surface3DViewer.jsx`):** `9 Strikes líquidos (85%..115% Moneyness)` × `7 Vencimientos (7D, 14D, 30D, 60D, 90D, 180D, 365D)` × `IV (%)`.
  - 🔵 **Rotación libre 3D con el mouse (`Yaw` + `Pitch`) y Zoom (`- / 100% / +`).**
  - 🔵 **4 Cámaras preconfiguradas:** `3D Isométrica`, `Frente (Smile / Curva)`, `Perfil (Plazos)` y `Planta (Heatmap)`.
  - 🔵 **Cortes transversales 3D e Inspector de Nodo:** al pasar el mouse sobre cualquier vértice se iluminan en 3D la curva de Strike constante y la de Vencimiento constante, mostrando `IV %`, `Call Δ / Put Δ` y `Open Interest`.
- **Sub-vista 2 — `Sonrisa IV 2D` (`?lens=derivatives&sub=surface`):**
  - 🟡 **Proyección 2D multicurva:** grafica simultáneamente `7D Weekly IV`, `30D Benchmark IV`, `90D Quarterly IV` y `180D LEAPS IV` sobre el eje de Strikes líquidos (`Vol > 10k • OI > 25k`).
  - 🟡 **Tira de indicadores de opciones:** `ATM IV`, `IV Rank`, `Straddle Breakeven (±% y $)`, `25Δ Put-Call Skew`, `Net GEX ($B)` y `Max Pain ($)`.
- **Sub-vista 3 — `Payoff P&L & Sintéticos` (`?lens=derivatives&sub=payoff`):**
  - 🔵 **Selector de 10 Estrategias de Opciones y Sintéticos:** *Long Straddle (ATM)*, *Bull Call Spread*, *Bear Put Spread*, *Iron Condor*, *Long Strangle*, *Sintético Largo (`+Call -Put`)*, *Sintético Corto (`+Put -Call`)*, *Covered Call*, *Long Call ATM*, *Long Put ATM*.
  - 🔵 **Gráfico de Perfil de Beneficios:** curva de **`P&L al Vencimiento ($)`** superpuesta con la curva **`P&L Hoy (T+0 Black-Scholes $)`** y línea punteada de **`Breakeven ($0)`**.
  - 🔵 **Métricas de la Estrategia y Griegas Netas en barra:** `Prima Neta (Débito/Crédito $)`, `Breakeven(s)`, `Máxima Ganancia (Max +)`, `Máxima Pérdida (Max -)` y **Griegas Netas (`Δ Delta`, `Γ Gamma`, `Θ Theta/día`, `ν Vega`)**.

### 4.6 Lente 4 (Especializada por Clase) — `Superficie 3D y Curva de Bonos Soberanos` (`RATES`, `FIXED_INCOME`, `CASH`)
- 🟡 **Apertura directa automática:** al hacer click en cualquier bono o tasa en la tabla (o en el acceso rápido `🌐 Curva Soberana 3D/2D`), abre directamente esta lente sin pasos extra.
- 🟡 **Selector de los `42 Países`:** menú desplegable con código ISO, nombre del país y calificación crediticia (`rating`).
- 🔵 **Sub-vista 1 — `Superficie 3D (Hist)` (`?lens=derivatives&sub=3d-history`):** malla 3D rotable de los `10 Plazos (3M a 30Y)` × `6 Horizontes históricos (-2Y a Hoy)` × `Yield (%)`.
- 🔵 **Sub-vista 2 — `Superficie 3D (Países)` (`?lens=derivatives&sub=3d-peers`):** malla 3D comparando simultáneamente las curvas completas de 6 soberanos (`País elegido, US, DE, GB, JP, BR`).
- 🟡 **Sub-vista 3 — `Curva 2D` (`?lens=derivatives&sub=2d`):** curva `3M..30Y` del país elegido superpuesta contra `US Treasury Benchmark (%)` y `German Bund Benchmark (%)`.
- 🟡 **Indicadores de renta fija en barra:** `10Y Yield`, pendientes `2s10s (bps)` y `3m10y (bps)`, curvatura `Butterfly 2s5s10s (bps)`, `Real Yield 10Y (%)` y sensibilidad `DV01 ($ / $1MM)`.

### 4.7 Lente 4 (Especializada por Clase) — `Conversor y Triangulador Cruzado FX` (`FX`)
- 🟡 **Input numérico de Monto Nominal + Selectores `Moneda Base (A) ⇄ Moneda Cotizada (B)`:** cubre **61 monedas ISO**.
- 🟡 **Píldora de Resultado Convertido (`= Monto Moneda B`) + Indicadores FX:** Tipo de Cambio Directo (`A/B`), Inverso (`B/A`), Variación 24h (`%`) y Diferencial de Tasas Soberanas (`Carry 10Y en bps`).
- 🟡 **Gráfico de la serie histórica triangulada:** evolución del par cruzado `(USD/B) ÷ (USD/A)` con media móvil `SMA (20)`.

### 4.8 Lente 4 (Especializada por Clase) — `Superficie Forward 3D y Curva de Materias Primas` (`COMMODITY`)
- 🔵 **Sub-vista 1 — `Superficie Forward 3D` (`?lens=derivatives&sub=3d`):** malla 3D rotable de `8 Contratos de Futuros (Spot M1 a M18)` × `6 Cortes Históricos` × `Precio Futuro ($)`.
- 🟡 **Sub-vista 2 — `Curva Forward 2D` (`?lens=derivatives&sub=2d`):** estructura temporal `M1..M18` frente al precio Spot de referencia.
- 🟡 **Indicadores físicos en barra:** régimen `BACKWARDATION` vs `CONTANGO`, `Roll Yield Anualizado (%/año)`, `Inventario Físico vs Media de 5 Años` y posicionamiento `CFTC COT Net Speculative`.

---

## 5. Pantalla 2 — Nivel 2B: `Markets • Research` (`MarketAnomaliesView.jsx` — `/?view=markets&mode=detail&section=research`) — `[5 ítems]`

- 🟡 **Cabecera Cualitativa (`Hero`):** postura ejecutiva (`BULLISH / BEARISH`), ponderación explícita según clase de activo (ej. `80% SEC 10-K / 20% Noticias` en `EQUITY`, `85% Política Monetaria / 15% Noticias` en `RATES`), Nota Compuesta Ponderada y **Recta Numérica Lineal de Sentimiento (`-100` a `+100`)**.
- 🟡 **Banner de Tesis Ejecutiva:** resumen institucional con fuente oficial (`SEC Form 10-K`, `FOMC / Treasury Refunding`, `EIA / LME Inventory Report`, etc.).
- 🔵 **Buscador Documental `RAG` con `40 Quick Chips` (4 por cada una de las 10 clases de activos) y Guardrail de 3 Capas:** responde con fragmentos verificados del activo o comparativa multi-activo y bloquea consultas fuera de dominio financiero.
- 🟡 **Columnas Gemelas: `Top 5 Catalizadores Alcistas (Bull Drivers)` vs `Top 5 Riesgos Bajistas (Bear Risks)`:** cada punto con nivel de materialidad (`HIGH / MEDIUM / LOW`) y puntaje de impacto (`+85`, `-70`, etc.).
- 🟡 **Flujo de Noticias en Tiempo Real (`Live FinBERT Wire`):** últimos 5 titulares con polaridad entera (`-100..+100`), desglose de probabilidades `P(+) / P(0) / P(-)` y botón **`+ SIMULAR NOTICIA EN VIVO`** que actualiza los *Bull/Bear Drivers* si la noticia es de alta materialidad.

---

## 6. Pantalla 3: `Portfolio & ★ Watchlist` (`AgentCommitteeView.jsx` — `/?view=portfolio`) — `[10 ítems]`

### 6.1 Cabecera de Asignación de Cartera (`Allocation Hero`)
- 🟡 **Gráfico `Donut SVG` interactivo + Barra proporcional de bloques:** muestra el peso (`%`) de cada posición activa y la liquidez (`CASH`).
- 🟡 **Métricas principales del portafolio:** `Total Balance ($100,000 base)`, `Total P&L ($ y %)`, `% Allocated` y `% Cash Available` con botones para sumar/retirar efectivo.

### 6.2 Selector de Universo Conectado (`En Cartera` vs `★ Watchlist`) y Simulación
- 🟡 **Pestañas `Todos`, `En Cartera` y `★ Watchlist (N)`:** la pestaña `★ Watchlist` refleja automáticamente todos los activos marcados con estrella en `Markets`.
- 🟡 **Píldoras de filtro por las 10 Clases de Activos:** permite filtrar el portafolio y la `Watchlist` por categoría.
- 🟡 **Tarjetas de Candidatos de `★ Watchlist`:** badge `★ WATCHLIST CANDIDATE`, estrella para quitar de seguimiento y botón **`+ INCORPORAR`** (asigna peso inicial del `5%` o el recomendado por la IA).
- 🟡 **Controles de Simulación en Posiciones Activas:** botones **`-1%`**, **`+1%`**, **`+5%`**, **`Reset`** y **`Execute AI Target`**.

### 6.3 Panel Quant de Riesgo y Correlación de Cartera *(Implementado en Código — Listo para Revisión)*
- 🔵 **`VaR (Value at Risk 95%, 1D)` y `CVaR (99%, 1D)` de la cartera activa:** expresado en `$ USD` y `% del NAV`, más `Beneficio de Diversificación ($)`, recalculado en vivo al simular cambios de pesos.
- 🔵 **`Beta Ponderado` de la cartera (vs `SPY`) y `Volatilidad Anualizada (%)`.**
- 🔵 **`Sharpe Ratio` estimado de la cartera (sobre tasa libre de riesgo `Rf = 4.30%`).**
- 🔵 **Matriz Interactiva de Correlación Cruzada (`r` de `-1.00` a `+1.00`)** entre los activos que integran la cartera actual para visualizar diversificación real (`< 0.45` en verde) o concentración (`≥ 0.70` en rojo).

### 6.4 Comité Autónomo de 3 Pilares y Libro de Ejecución (`Execution Ledger`)
- 🟡 **3 Tarjetas de Deliberación por Activo (`Quantitative Analytics`, `Fundamental & News Research`, `Risk & Sizing Guardrail`):** límite duro de concentración (`máx 20% NAV` por activo) y recorte automático al `5% NAV` cuando `P-06 ≥ 0.65`.
- 🟡 **Veredicto de Consenso y Libro de Órdenes (`Execution Ledger`):** historial cronológico de rebalanceos ejecutados.

---

## 7. Pantallas Transversales, Persistencia y Auditoría Visual de Cierre — `[6 ítems]`

- 🟡 **Persistencia de `Watchlist` en `localStorage` (`mid_watchlist_v1`):** conserva los activos seguidos al recargar.
- 🔵 **Persistencia de Posiciones/Órdenes de `Portfolio` (`mid_portfolio_v1`), Idioma (`mid_lang_v1`), Paleta (`mid_theme_v1`) y Diseño de `Home` (`mid_home_layout_v1`) en `localStorage`:** conserva toda la personalización del usuario entre sesiones e incluye botón `Restaurar Base` en `Portfolio`.
- 🟡 **Enrutamiento Bidireccional por URL (`?view=...&mode=...&asset=...&lens=...&sub=...`):** cada vista, activo y motor 3D/2D actualiza su URL específica en tiempo real.
- 🟡 **Guía de Usuario, Definiciones y Objetos (`UserGuideView.jsx` — `/?view=guide`):** estructura conectada al botón `(i)` y desde el `Home`.
- 🔵 **Redacción e Iteración Interactiva de `UserGuideView.jsx`:** diccionario buscable por pestañas con las definiciones de todos los objetos UI, las 10 clases de activos, las fórmulas cuantitativas (`Superficie IV 3D`, `Payoffs & Griegas`, `Curvas Soberanas & DV01`, `Triangulación FX & Carry`, `Contango/Backwardation`, `VaR & Matriz r`) y botones `Ir al Objeto ↗`.
- 🔵 **Lanzador de Auditoría sobre las 17 URLs Canónicas (`DevLabView.jsx` — `/?view=dev`):** consola interactiva con las 17 URLs canónicas de [`MVP_MASTER_BLUEPRINT.md`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/docs/MVP_MASTER_BLUEPRINT.md#L98-L119) listas para recorrer sección por sección y otorgar tu aprobación final (`✅`).

---

## 8. Marco de Ejecución Unificada (*One-Shot Build* de los Ítems `🔲` — **COMPLETADO `100%`**)

Todos los entregables de código del lote unificado fueron implementados y verificados (`vite build` sin errores):
1. ✅ **`HomeStage.jsx` + `DevLabView.jsx` + `App.jsx`:** Implementada la presentación ejecutiva, lanzadera de 6 tarjetas conectadas por *deep-linking* a `Screener`, `Superficie Vol 3D`, `Curva Soberana 3D/2D`, `Payoff & Sintéticos`, `Conversor FX` y `Portfolio`, guía rápida en 3 pasos, botón al Manual `(i)`, tira de pulso macro en vivo y **3 prototipos de distribución seleccionables en vivo y en `DEV`** (`bento-grid`, `split-stage`, `minimal-hud`).
2. ✅ **`committeeService.js` + `AgentCommitteeView.jsx`:** Implementado el **Panel Quant de Riesgo y Correlación de Cartera** (en la barra superior del Hero y en la nueva pestaña `Riesgo Quant & Correlación`) con cálculo en vivo de `VaR (95%, 1D)`, `CVaR (99%, 1D)`, `Beneficio de Diversificación ($)`, `Beta Ponderado (vs SPY)`, `Volatilidad Anualizada (%)`, `Sharpe Ratio` y la **Matriz Interactiva de Correlación Cruzada (`r` de `-1.00` a `+1.00`)**.
3. ✅ **`App.jsx` + `AgentCommitteeView.jsx` (`localStorage`):** Persistidos automáticamente posiciones/órdenes de `Portfolio` (`mid_portfolio_v1`), idioma (`mid_lang_v1`), paleta (`mid_theme_v1`) y diseño de `Home` (`mid_home_layout_v1`).
4. ✅ **`UserGuideView.jsx`:** Completado el manual y glosario interactivo con buscador instantáneo, 4 capítulos temáticos, fórmulas explícitas y botones `Abrir ↗` hacia cada motor.
