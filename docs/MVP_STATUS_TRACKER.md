# Checklist Exhaustivo de Aprobación Elemento por Elemento (`MVP_STATUS_TRACKER.md`)

> ### 📊 Resumen General de Estado (Total: `100 ítems` = `100.0%`)
> - ✅ **Aprobación Final del Usuario:** `94 / 100` (**`94.0%`**) — *`Home` (Sección 2), `HeaderBar V010` (Sección 1.1), `FooterBar V010` (Sección 1.2), `Markets • Screener Global — Nivel 1` (Sección 3), `Markets • Analytics — Nivel 2A` (Sección 4 completa `4.1 a 4.8`), `Markets • Research — Nivel 2B` (Sección 5 con `FOC-01`) y `Portfolio & ★ Watchlist` (Sección 6 completa con las 3 Vistas modularizadas: `Vista 1: Constructor & Performance`, `Vista 2: Riesgo Cuantitativo & Stress V2-SIM-4` y `Vista 3: Laboratorio de Estrategias Ad-Hoc V3-SIM-1` + Copiloto RAG desplegable `#8`) aprobados.*
> - 🟡 **Aprobación Parcial (Implementado y ya revisado/pedido por vos):** `2 / 100` (**`2.0%`**)
> - 🔵 **Implementado en Código (Listo para tu primera revisión):** `4 / 100` (**`4.0%`**)
> - 🔲 **Pendiente de Desarrollo (Aún por construir en código):** `0 / 100` (**`0.0%`**)
> - **Total Acumulado:** `100 / 100 ítems` (**`100.0%`** — *Construido en código: `100.0%` • Pendiente de código: `0.0%`*)

---

## 1. Marco Global: Cabecera (`HeaderBar`) y Pie de Página (`FooterBar`) — `[9 ítems]`

### 1.1 Cabecera Superior (`HeaderBar.jsx`) — *Modelo Elegido: `V010 • F01 (Minimal & Ghost — Halo Neón Desmaterializado)`*
- ✅ **Ícono institucional (`λ`):** ubicado arriba a la izquierda; sincronizado con `var(--ui-accent)` y al hacer click vuelve siempre al `Home`.
- ✅ **Menú principal centrado (`Markets` | `Portfolio`) en estilo `V010 (Halo Neón Puro)`:** sin cajas ni bordes contenedores; brilla con resplandor neón (`text-shadow`), estableciendo el lenguaje visual trasladable al resto de botones de la app.
- ✅ **Ausencia de botones redundantes en cabecera:** sin botón `Home` duplicado ni buscador global invasivo en la barra superior.

### 1.2 Pie de Página (`FooterBar.jsx`) — *Homogeneizado en estilo `V010 (Minimal & Ghost)`*
- ✅ **Botón `System` (1 palabra):** punto verde de salud; abre/cierra `ObservabilityView` (13/13 proyectos validados en grilla *Master-Detail* 100% responsiva).
- ✅ **Botón `Guide` (1 palabra):** homogéneo con `System` y `DEV`; abre/cierra `UserGuideView` con el mismo layout *Master-Detail* responsivo.
- ✅ **Botón `DEV` (`DevLabView`):** homogéneo en tipografía y halo neón; abre el laboratorio de diseño.
- ✅ **Botón de Idioma (abajo a la derecha):** muestra bandera SVG + código ISO actual en estilo `V010` y abre el modal centrado.
- ✅ **Ventana Modal de Idiomas (`56 idiomas`):** adaptable a cualquier tamaño de pantalla (`min(480px, 94vw)` × `min(82vh, 520px)`), buscador en lengua original y banderas SVG.
- ✅ **Botón de Paleta Ambiental (abajo a la derecha):** cicla entre las 5 paletas cambiando al unísono el color de todas las opciones de navegación (`λ`, `Markets`, `Portfolio`, `System`, `Guide`, `DEV`, `EN` y `Palette`), manteniendo fijo el verde/rojo financiero.

---

## 2. Pantalla 1: `Home` (`HomeStage.jsx` — `/?view=home`) — `[2 ítems]`

- ✅ **Fondo espacial interactivo (`WebbDeepFieldCanvas`):** animación cósmica en tiempo real sobre negro puro (`#000000`) totalmente despejada, sin tarjetas ni paneles superpuestos.
- ✅ **Título y subtítulo introductorios sutiles:** centrados en la parte superior (`18.5%`) con tipografía editorial limpia.

---

## 3. Pantalla 2 — Nivel 1: `Markets • Screener Global` (`MarketAnomaliesView.jsx` — `/?view=markets&mode=screener`) — `[31 ítems]`

### 3.1 Barra Superior de Filtros por Clase de Activo (`10 Categorías + Watchlist`)
- ✅ **Píldora `Todos (All)`:** muestra el universo completo de `213 activos` ordenados por liquidez/volumen en USD.
- ✅ **Píldora `★ Watchlist (N)`:** filtra únicamente los activos marcados con estrella por el usuario, con contador en vivo.
- **10 Píldoras de Categorías ordenadas alfabéticamente:**
  - ✅ `Bonos US Treasury (FIXED_INCOME)` — `9` títulos del Tesoro de EE.UU. y TIPS.
  - ✅ `Cash & SOFR (CASH)` — `13` instrumentos monetarios, tasas overnight (`SOFR`, `EFFR`, `ESTR`, `SONIA`, `TONAR`), T-Bills y stablecoins.
  - ✅ `Crypto (CRYPTO)` — `15` criptoactivos líderes por volumen spot/perpetuos.
  - ✅ `Derivados & Vol (DERIVATIVES_VOL)` — `17` índices de volatilidad (`VIX`, `VXN`, `MOVE`), futuros y opciones líquidas.
  - ✅ `Divisas FX (FX)` — `30` pares principales en tabla + motor de `61` monedas ISO contra USD.
  - ✅ `Acciones S&P/NDX (EQUITY)` — `42` acciones líderes del S&P 500 y Nasdaq-100.
  - ✅ `ETFs (ETF)` — `35` ETFs globales de mayor volumen diario.
  - ✅ `Índices (INDEX)` — `22` índices bursátiles globales (EE.UU., Europa, Asia, LatAm).
  - ✅ `Materias Primas (COMMODITY)` — `26` futuros de energía, metales preciosos, industriales y agro.
  - ✅ `Tasas & Curvas (RATES)` — `4` nodos benchmark en tabla conectados al motor de `42` curvas soberanas.

### 3.2 Las 4 Tarjetas de Pulso Agregado (`Pulse Cards` — Altura Fija `114px` y 100% Informativas)
- ✅ **Tarjeta 1 — `24h Aggregate Volume`:** volumen total en miles de millones (`$B`), variación `%`, conteo de activos filtrados y *sparkline* dinámica que se recalcula por categoría.
- ✅ **Tarjeta 2 — `AVG RSI (14)`:** anillo circular `RadialRingGauge` con el promedio de RSI de la categoría activa y etiqueta de régimen (`POSITIVE >50` / `CAUTIOUS <50`).
- ✅ **Tarjeta 3 — `Normal Regime (P-06)`:** anillo circular con porcentaje legible (`79%`), conteo claro al lado (`169 / 213 activos normales`), desglose `Elevated • Disloc.` e indicador informativo `TOP ANOMALY` sin redirección accidental.
- ✅ **Tarjeta 4 — `Top Volume Z-Score (20d)`:** ranking informativo de los 3 activos con mayor desvío estadístico de volumen (`σ`) en las últimas 24h.

### 3.3 Barra de Modos Visuales (`Tabla` | `Orbital` | `Mapa de Calor` | `Main Tools`)
- ✅ **Selector de Vista Unificado (4 Modos con Popovers Flotantes `z-index: 9999`):** alterna entre `Tabla`, `Orbital`, `Mapa de Calor` y `Main Tools`.
- ✅ **Selector de Indicador Conductor (visible en `Orbital` y `Mapa de Calor`):** permite elegir qué métrica gobierna los colores y tamaños (`Anomaly Score P-06`, `Vol Z-Score 20d`, `RSI 14`, `24h % Change`, `24h Volume`, `Realized Vol`).
- **4 Motores Cuantitativos Integrados en `Main Tools` (`HÍBRIDO HB-05` — Flujo Progresivo de 3 Columnas por Click):**
  - ✅ **Motor 1 (`Tasas & Renta Fija`):** `🌐 Curva Soberana 3D/2D (42 Países)`.
  - ✅ **Motor 2 (`Acciones, Índices & Crypto`):** `📐 Superficie Volatilidad 3D` + `⚡ Payoff P&L & Sintéticos`.
  - ✅ **Motor 3 (`Divisas FX`):** `💱 Conversor FX (61 Monedas)`.
  - ✅ **Motor 4 (`Materias Primas`):** `🛢️ Superficie & Curva Forward 3D/2D (26 Futuros)`.

### 3.4 Las 4 Vistas del Screener (Nivel 1)
- **Vista A — `Tabla` (`Table`):**
  - ✅ **Buscador integrado en el encabezado de la columna Activo:** filtra por ticker o nombre y soporta teclado (`↑`, `↓`, `Enter`, `Escape`).
  - ✅ **Estrella `★ / ☆` por fila:** agrega o quita el activo de la `Watchlist` sin entrar al detalle.
  - ✅ **Columnas universales ordenables (sin columna `#` redundante):** `Activo (Ticker + Nombre + Clase)`, `Price`, `24h %`, `Sparkline 7d`, `Volume (24h)`.
  - ✅ **2 Columnas Dinámicas Específicas por Categoría:** aparecen al filtrar una clase específica (`2s10s / 3m10y` y `Tasa Real / DV01` en `RATES`; `P/E Fwd` y `Margen Bruto` en `EQUITY`; `ATM IV / Straddle` y `25Δ Skew / GEX` en `DERIVATIVES_VOL`; `Carry Spread` en `FX`; `Roll Yield` e `Inventario` en `COMMODITY`).
  - ✅ **Columnas cuantitativas estándar (cuando está en `Todos`):** `Vol Z-Score (20d)`, `Realized Vol`, `RSI (14)`, `Anomaly Score (P-06)`.
- **Vista B — `Orbital` (`Radar Cuantitativo`):**
  - ✅ **Anillos concéntricos y nodos orbitales (muestra inteligente `Top 45` o categoría completa):** posición radial proporcional a la magnitud del indicador elegido y color estrictamente verde/rojo según media histórica.
  - ✅ **Inspector lateral en vivo:** al pasar el mouse sobre un planeta/nodo muestra sus métricas y línea limpia de tendencia intradía 5m propia de cada ticker (sin línea vertical ni relleno borroso).
- **Vista C — `Mapa de Calor` (`Heatmap Finviz Style`):**
  - ✅ **Grilla jerárquica de 4 columnas verticales (Top 10 activos):** ordenada de mayor a menor magnitud del indicador activo (`#1` y `#2` a la izquierda con mayor área).
  - ✅ **Paleta estricta de 8 tonos verdes y rojos:** proporcional a la intensidad positiva o negativa frente a la media histórica.

---

## 4. Pantalla 2 — Nivel 2A: `Markets • Analytics` (`MarketAnomaliesView.jsx` — `/?view=markets&mode=detail&section=analytics`) — `[35 ítems]`

### 4.1 Barra Horizonte Superior y Cabecera Hero (`V010 • Variante B: Neon-Halo + AreaChart Sparkline Unificado + Dual-Tier Semantic Pills`)
- ✅ **Botón `← Todos los Mercados`:** vuelve al Screener de Nivel 1 en estilo `V010` con halo neón.
- ✅ **Buscador rápido `Cambiar activo (Ticker)...`:** autocompletado con navegación por teclado para cambiar de activo sin salir del Nivel 2.
- ✅ **Conmutador Central Nivel 2 (`Analytics` | `Research`) en estilo `V010`:** alterna entre la mesa cuantitativa y la mesa documental/NLP sin cajas contenedoras.
- ✅ **Botón `P-06` Ghost:** dispara inferencia en vivo contra el microservicio Cloud Run (`Isolation Forest`) con lectura de latencia en `ms`.
- ✅ **Selector de Temporalidad (`1m`, `5m`, `1H`, `1D`, `1W`, `1M`, `3M`, `1Y`, `ALL`) en estilo `V010`:** recalcula la serie histórica del activo.
- ✅ **Cabecera Hero del Activo:** categoría con halo neón, nombre, par, botón **`★ EN WATCHLIST / ☆ + WATCHLIST`**, precio actual, cambio `%`, **Serie de Tiempo `AreaChart` unificada con el formato exacto de `24h Aggregate Volume` (igual que Tabla y Orbital)**, y **5 Píldoras Semánticas de Doble Nivel** (destacando las **2 métricas específicas de su clase de activo**).

### 4.2 Lente 1: `Análisis Técnico` (`?lens=technical`) — `Opción 4.2-A (Boxed Lenses on Left + Toggles on Right)`
- ✅ **Gráfico de área/línea principal (`Recharts`):** curva de precio/tasa con gradiente unificado (`stopOpacity 0.45 -> 0.0`, `strokeWidth 2`) igual a `24h Aggregate Volume`.
- ✅ **Superposiciones activables (`Overlays`):** botones `SMA (20)`, `Bollinger Bands (20, 2σ)` y `VWAP`.
- ✅ **Sub-panel sincronizado de Volumen:** histograma inferior activable/desactivable.

### 4.3 Lente 2: `Comparar Activos (%)` (`?lens=compare`)
- ✅ **Restricción estricta a clases compatibles:** impide comparar activos incompatibles (ej. muestra `EQUITY / ETF / INDEX` para una acción, o `RATES / FIXED_INCOME / CASH` para una tasa).
- ✅ **Buscador con autocompletado libre:** el usuario escribe el ticker o nombre del segundo activo (sin botones predeterminados fijos).
- ✅ **Gráfico normalizado en retorno porcentual (`%`):** superpone ambas series desde `0%` al inicio de la ventana temporal y limpia automáticamente la comparación si se cambia a un activo primario incompatible.

### 4.4 Lente 3: `Microestructura & Flujo` (`?lens=microstructure`)
- ✅ **Conmutador de Sub-panel (`Volume Z-Score 20d` vs `24h Volume Histogram`):** visualiza desvíos estadísticos de volumen en unidades sigma (`σ`).
- ✅ **Telemetría de Spread y Anomalía:** lectura de `Spread Dislocation (bps)`, `Bollinger Width (%)` y diagnóstico de árbol `Isolation Forest (P-06)` en el pie del gráfico.

### 4.5 Lente 4 (Especializada por Clase) — `Opciones, Superficie 3D y Payoff P&L` (`DERIVATIVES_VOL`, `EQUITY`, `ETF`, `INDEX`, `CRYPTO`) — *Modelo Elegido: `LQR-F (4 Lenses + Sub-Modes + Search + Telemetry Inside Left Rail)`*
- **Sub-vista 1 — `Superficie IV 3D` (`?lens=derivatives&sub=surface3d`):**
  - ✅ **Malla 3D volumétrica interactiva (`Surface3DViewer.jsx`):** `9 Strikes líquidos (85%..115% Moneyness)` × `7 Vencimientos (7D, 14D, 30D, 60D, 90D, 180D, 365D)` × `IV (%)` con selección del subyacente a partir del buscador.
  - ✅ **Rotación libre 3D con el mouse (`Yaw` + `Pitch`) y Zoom (`- / 100% / +`).**
  - ✅ **4 Cámaras preconfiguradas:** `3D Isométrica`, `Frente (Smile / Curva)`, `Perfil (Plazos)` y `Planta (Heatmap)`.
  - ✅ **Cortes transversales 3D e Inspector de Nodo:** al pasar el mouse sobre cualquier vértice se iluminan en 3D la curva de Strike constante y la de Vencimiento constante, mostrando `IV %`, `Call Δ / Put Δ` y `Open Interest`.
- **Sub-vista 2 — `Sonrisa IV 2D` (`?lens=derivatives&sub=surface`):**
  - ✅ **Proyección 2D multicurva:** grafica simultáneamente `7D Weekly IV`, `30D Benchmark IV`, `90D Quarterly IV` y `180D LEAPS IV` sobre el eje de Strikes líquidos (`Vol > 10k • OI > 25k`).
  - ✅ **Grilla de 6 píldoras semánticas Dual-Tier en el riel izquierdo:** `ATM IV`, `IV Rank`, `Straddle Breakeven (±% y $)`, `25Δ Put-Call Skew`, `Net GEX ($B)` y `Max Pain ($)`.
- **Sub-vista 3 — `Payoff P&L & Sintéticos` (`?lens=derivatives&sub=payoff`):**
  - ✅ **Selector de Estrategias Multi-Leg + Buscador de Subyacente:** *Long Straddle (ATM)*, *Iron Condor*, *Bull Call Spread*, *Long Strangle* integrado en el riel izquierdo.
  - ✅ **Gráfico de Perfil de Beneficios:** curva de **`P&L al Vencimiento ($)`** superpuesta con la curva **`P&L Hoy (T+0 Black-Scholes $)`** y línea punteada de **`Breakeven ($0)`**.
  - ✅ **Métricas de la Estrategia y Griegas Netas en píldoras Dual-Tier:** `Prima Neta (Débito/Crédito $)`, `Breakeven(s)`, `Máxima Ganancia (Max +)`, `Máxima Pérdida (Max -)` y **Griegas Netas (`Δ Delta`, `Γ Gamma`, `Θ Theta/día`, `ν Vega`)**.

### 4.6 Lente 4 (Especializada por Clase) — `Superficie 3D y Curva de Bonos Soberanos` (`RATES`, `FIXED_INCOME`, `CASH`)
- ✅ **Apertura directa automática:** al hacer click en cualquier bono o tasa en la tabla (o desde `Main Tools` por buscador), abre directamente esta lente sin pasos extra.
- ✅ **Buscador de los `42 Países`:** combobox buscable por código ISO, nombre del país o calificación crediticia (`rating`) dentro del riel izquierdo.
- ✅ **Sub-vista 1 — `Superficie 3D (Hist)` (`?lens=derivatives&sub=3d-history`):** malla 3D rotable de los `10 Plazos (3M a 30Y)` × `6 Horizontes históricos (-2Y a Hoy)` × `Yield (%)`.
- ✅ **Sub-vista 2 — `Superficie 3D (Países)` (`?lens=derivatives&sub=3d-peers`):** malla 3D comparando simultáneamente las curvas completas de 6 soberanos (`País elegido, US, DE, GB, JP, BR`).
- ✅ **Sub-vista 3 — `Curva 2D` (`?lens=derivatives&sub=2d`):** curva `3M..30Y` del país elegido superpuesta contra `US Treasury Benchmark (%)` y `German Bund Benchmark (%)`.
- ✅ **Indicadores de renta fija en 6 píldoras Dual-Tier:** `10Y Yield`, pendientes `2s10s (bps)` y `3m10y (bps)`, curvatura `Butterfly 2s5s10s (bps)`, `Real Yield 10Y (%)` y sensibilidad `DV01 ($ / $1MM)`.

### 4.7 Lente 4 (Especializada por Clase) — `Conversor y Triangulador Cruzado FX` (`FX`)
- ✅ **Input numérico de Monto Nominal + Dos Buscadores `Moneda Base (A) ⇄ Moneda Cotizada (B)`:** cubre las **61 monedas ISO** mediante buscador con autocompletado.
- ✅ **6 Píldoras Semánticas Dual-Tier FX:** Tipo de Cambio Directo (`A/B`), Monto Convertido (`= Monto Moneda B`), Inverso (`B/A`), Variación 24h (`%`) y Diferencial de Tasas Soberanas (`Carry 10Y en bps`).
- ✅ **Gráfico de la serie histórica triangulada:** evolución del par cruzado `(USD/B) ÷ (USD/A)` con media móvil `SMA (20)`.

### 4.8 Lente 4 (Especializada por Clase) — `Superficie Forward 3D y Curva de Materias Primas` (`COMMODITY`)
- ✅ **Sub-vista 1 — `Superficie Forward 3D` (`?lens=derivatives&sub=3d`):** malla 3D rotable de `8 Contratos de Futuros (Spot M1 a M18)` × `6 Cortes Históricos` × `Precio Futuro ($)` con selección de materia prima por buscador (`26 futuros`).
- ✅ **Sub-vista 2 — `Curva Forward 2D` (`?lens=derivatives&sub=2d`):** estructura temporal `M1..M18` frente al precio Spot de referencia.
- ✅ **Indicadores físicos en 6 píldoras Dual-Tier:** régimen `BACKWARDATION` vs `CONTANGO`, `Roll Yield Anualizado (%/año)`, `Inventario Físico vs Media de 5 Años` y posicionamiento `CFTC COT Net Speculative`.

---

## 5. Pantalla 2 — Nivel 2B: `Markets • Research` (`MarketAnomaliesView.jsx` — `/?view=markets&mode=detail&section=research`) — `[5 ítems]`

- ✅ **Cabecera Cualitativa (`Hero`):** postura ejecutiva (`BULLISH / BEARISH`), ponderación explícita según clase de activo (ej. `80% SEC 10-K / 20% Noticias` en `EQUITY`, `85% Política Monetaria / 15% Noticias` en `RATES`), Nota Compuesta Ponderada y **Recta Numérica Lineal de Sentimiento (`-100` a `+100`)**.
- ✅ **Riel Izquierdo — `Chat Documental Vertical RAG` con Burbuja de Tesis Ejecutiva:** resumen institucional con fuente oficial (`SEC Form 10-K`, `FOMC / Treasury Refunding`, `EIA / LME Inventory Report`, etc.), hilo vertical de burbujas y botón puente **`★ Simular en Portfolio & Riesgo ↗`**.
- ✅ **Buscador Documental `RAG` en el Dock Inferior del Chat con `40 Quick Chips` (4 por cada una de las 10 clases de activos) y Guardrail de 3 Capas:** responde en el hilo de chat con fragmentos verificados del activo y bloquea consultas fuera de dominio financiero.
- ✅ **Foco Central Protagonista — `Veredicto & Acordeón de Factores Ponderados` (`Top 5 Bull Drivers` & `Top 5 Bear Risks`):** barra proporcional *Tug-of-War*, filtros rápidos (`Todos (10) | ▲ 5 Bull | ▼ 5 Bear | 5 vs 5`), barras de peso tipo *volume-profile* y botón `💬 Analizar en el Chat Vertical`.
- ✅ **Columna Derecha (`2. Pulso 24h`) — `Timeline Cronológico con Nodos Luminosos` + `Serie de Tiempo AreaChart 24h debajo`:** últimos 5 titulares con eje vertical continuo, polaridad entera, botón **`+ Simular Noticia`** y curva `AreaChart` estandarizada de 24h debajo del cuadro de noticias.

---

## 6. Pantalla 3: `Portfolio & ★ Watchlist` (`AgentCommitteeView.jsx` — `/?view=portfolio`) — `[10 ítems]`

### 6.1 Cabecera de Asignación de Cartera (`Allocation Hero` — 6 Píldoras Semánticas Dual-Tier)
- ✅ **6 Píldoras Semánticas Dual-Tier en Fila 1 (`Vista 1` y `Vista 2`):** `Retorno Acumulado / NAV`, `Sharpe / Sortino`, `VaR 95% (1D) / CVaR 99%`, `Max Drawdown / Recuperación`, `Alpha vs Benchmark (Brinson #2)` y `Beneficio de Diversificación`.
- ✅ **Encabezado Permanente de Impacto en Cartera Total (`Vista 3`):** compara `Cartera Base` vs `Cartera + Estrategia Ad-Hoc` en `Retorno Anual`, `Sharpe Ratio`, `VaR 95% (1D)`, `Max Drawdown` y `Exposición Neta / Cash`.

### 6.2 Selector de Universo Conectado (`En Cartera` vs `★ Watchlist`) y Simulación (`PortfolioVista1Builder.jsx`)
- ✅ **Pestañas `En Cartera (N)`, `★ Watchlist (N)` y `Universo (213)` + Buscador de 213 Activos:** refleja automáticamente todos los activos marcados con estrella en `Markets`.
- ✅ **Tabla de Ponderación limpia sin sliders con Checkboxes `ON/OFF`:** permite activar/desactivar combinaciones de activos al instante y ajustar pesos con `-1%`, `+1%`, `+5%`, `Equal-Weight`, `AI Target` y `Reset`.
- ✅ **Radiografía & Atribución de la Cartera (5 Pestañas Internas):** `1. Descomposición Alpha (#2 Brinson)`, `2. Solapamiento X-Ray (#12)`, `3. Clase & Moneda (NEW-07)`, `4. Cashflow & Yield (NEW-08)` y `5. Custodia & Contraparte (#16)`.
- ✅ **Calendario Heatmap Mensual (`Ene..Dic`) + Serie de Tiempo del Backtesting 100% Ancho (`FILA 3`):** con selector de ventana (`1M`, `3M`, `6M`, `1Y`, `3Y`, `ALL`) y comparador Multi-Estrategia (`#10`).

### 6.3 Panel Quant de Riesgo y Correlación de Cartera (`PortfolioVista2Risk.jsx` — `V2-SIM-4`)
- ✅ **Cuadrante 1 (`Markowitz 2D 100% Dinámico`):** plano interactivo de activos y cartera con capas activables (`Frontera Eficiente`, `Línea CML`, `Caras Alternativas #10` y `Vectores de Cambio`).
- ✅ **Cuadrante 2 (`Tornado de Stress + VaR 95% + Captura por Activo`):** 3 sub-vistas activables con alineación estricta de columnas (`1ª Izq | Intermedias Centro | Última Der`).
- ✅ **Cuadrante 3 (`Matriz de Correlación Normal vs Crisis + Beta por Activo`):** conmutador de régimen `Normal` vs `Cola de Crisis (Stress r → 1)` y tabla de sensibilidad por activo.
- ✅ **Cuadrante 4 (`Matriz 2D Tasas × SPX + Matriz Regímenes de Markov #11`) + `FILA 3` (`Monte Carlo 6M/12M/24M`, `Underwater Drawdown`, `Rolling 60D Sharpe`).**

### 6.4 Laboratorio de Estrategias Ad-Hoc, Comité Autónomo y Libro de Ejecución (`PortfolioVista3AdHoc.jsx` — `V3-SIM-1`)
- ✅ **Cuadrante 1 (`Simulador Pre-Trade What-If #1` & `Dimensionamiento Óptimo de Kelly #14`) + Cuadrante 2 (`Escudo de Opciones Tail-Hedge #6` & `Monitor de Margen y Margin Call #13`).**
- ✅ **Cuadrante 3 (`Comité Autónomo de 3 Pilares NEW-09` con `Cap 20% NAV` y `P-06 < 0.65`), Cuadrante 4 (`Execution Ledger NEW-10`) y `FILA 3` (`Validación Walk-Forward In-Sample vs Out-of-Sample #9`).**

### 6.5 Registro de Decisiones de Diseño de `Portfolio` (25 Aprobados y Clasificación por Rol)
- **✅ 25 Componentes Elegidos por el Usuario para Integrar en `Portfolio` (`18` previos + `7` de `PEND`):**
  1. Tabla de Ponderación limpia **sin sliders** (con buscador universal de 213 activos y controles simples).
  2. Serie de Tiempo del Backtesting Histórico (`AreaChart` estandarizado vs Benchmark).
  3. Matriz de Correlación Cruzada (`r` de `-1.00` a `+1.00`).
  4. Medidas de Resumen (Píldoras Semánticas Dual-Tier: `Retorno`, `Sharpe/Sortino`, `VaR 95%`, `Max Drawdown`, `Alpha`, `Diversificación`).
  5. Plano 2D de Markowitz (`Volatilidad %` vs `Retorno Esperado %` + Frontera Eficiente).
  6. Calendario Heatmap de Retornos Mensuales (`Ene..Dic`).
  7. Gráfico Tornado de Stress Test Macro & Histórico.
  8. Copiloto Vertical de Portafolio (Chat RAG) oculto por defecto y desplegable bajo demanda.
  9. `NEW-01`: Proyección Monte Carlo a Futuro (10,000 simulaciones a 12M con bandas `P95 / P50 / P05`).
  10. `NEW-02`: Curva Subacuática de Drawdown & Tiempo de Recuperación (`Underwater Curve`).
  11. `NEW-05`: Sharpe Ratio & Beta Rodante (`Rolling 60-Day Regime`).
  12. `NEW-06`: Distribución de Retornos Diarios (Histograma + Corte de Cola `VaR 95%` / `CVaR 99%`).
  13. `NEW-07`: Radiografía de Exposición por Clase de Activo, Moneda y Liquidez Intradía.
  14. `NEW-08`: Monitor de Flujo de Caja, Cupones, Dividendos & Carry Anual (`Yield Harvest`).
  15. `NEW-09`: Comité Autónomo de 3 Pilares & Circuit-Breaker (`Cap 20% NAV` / `P-06 ≥ 0.65`).
  16. `NEW-10`: Libro de Órdenes y Auditoría Histórica (`Execution Ledger`).
  17. `NEW-11`: Ratio de Captura Alcista vs Bajista (`Upside / Downside Capture Ratio`).
  18. `NEW-12`: Matriz 2D de Shock Cruzado (`Tasas de Interés bps × S&P 500 %`).
  19. `PEND-02` (`#2`): Atribución de Performance Brinson-Fachler (*Selección de Activos* vs *Asignación Sectorial* vs *Interacción*).
  20. `PEND-06` (`#6`): Tail-Hedge & Escudo de Opciones (`Protective Puts / VIX` payoff convexo vs costo anual de prima).
  21. `PEND-10` (`#10`): Comparador Multi-Estrategia Cara a Cara (`Tu Cartera` vs `60/40`, `All-Weather`, `Equal-Weight`, `Min-Variance`).
  22. `PEND-11` (`#11`): Matriz de Transición de Regímenes de Markov (*Bull Quiet*, *Bull Volatile*, *Inflationary*, *Crash*).
  23. `PEND-12` (`#12`): Solapamiento de Subyacentes (`Look-Through X-Ray` de concentración real sumando directos + ETFs).
  24. `PEND-13` (`#13`): Apalancamiento, Margen & Distancia a Margin Call.
  25. `PEND-16` (`#16`): Radar de Fragilidad de Contraparte & Custodia (*CDS spread*, concentración por venue y cobertura `SIPC`).
- **❌ Componentes Descartados:**
  1. Sliders dentro de la tabla de ponderación.
  2. Barras de `Atribución de Riesgo: Peso Capital (%) vs Contribución al VaR (%)`.
  3. Barra superior de 4 pasos tipo Wizard.
  4. `NEW-03`: Calculadora de Rebalanceo y Boleta de Órdenes (`Drift → Target`).
  5. `NEW-04`: Huella Factorial de la Cartera (`Factor DNA vs S&P 500`).
- **💡 Arquitectura de 3 Vistas Respirables Aprobada para `Portfolio` + Reglas de Diseño General Transversal:**
  - **Reglas de Diseño General Transversal (Estándar de toda la App):**
    1. **Semántica Financiera Estricta Verde / Rojo con Gradientes de Intensidad:** Todo rendimiento, variación, celda de calendario heatmap, matriz 2D de choque o atribución de P&L debe respetar estrictamente el estándar de la industria: **Verde Esmeralda (`#10b981`) con gradiente de opacidad proporcional a la ganancia** y **Rojo Coral (`#f43f5e`) con gradiente de opacidad proporcional a la pérdida/riesgo**.
    2. **Series de Tiempo Univariadas con Sombra Degradada (`AreaChart`):** Toda serie de tiempo para mostrar tendencia o trayectoria (precio, sentimiento 24h, backtest, drawdown subacuático, proyección, walk-forward) debe usar `AreaChart` (`type="monotone"`, `strokeWidth={2}`, relleno con degradación vertical `linearGradient` `5% -> 0.45` a `95% -> 0.0`).
    3. **Alineación Estricta de Columnas en Tablas y Matrices:** En toda tabla o matriz de la aplicación, tanto los **headers** como los **valores** deben estar **alineados a la izquierda en la primera columna (`left`)**, **centrados en todas las columnas intermedias (`center`)** y **alineados a la derecha en la última columna (`right`)**.
  - **✅ Vista 1 (`Constructor & Performance`) — Estructura de 3 Filas Aprobada:**
    - `FILA 1`: Cabecera de 6 Píldoras de Resumen.
    - `FILA 2 Izquierda`: Tabla de Ponderación limpia sin sliders (con buscador de 213 activos y checkboxes `ON/OFF` para probar combinaciones).
    - `FILA 2 Derecha (apilados)`: Arriba `Radiografía & Atribución de la Cartera` (con 5 pestañas internas incluyendo `Descomposición de Alpha Brinson #2`, `Solapamiento X-Ray #12`, `Exposición`, `Cashflow`, `Custodia #16`) + Abajo `Calendario Heatmap de Retornos Mensuales (Ene..Dic)`.
    - `FILA 3 (100% Ancho Completo)`: `Serie de Tiempo del Backtesting Histórico` (`AreaChart` con sombra degradada + selector de ventana temporal + comparador multi-estrategia `#10`).
  - **✅ Vista 2 (`Riesgo Cuantitativo & Stress`) — Variante `V2-SIM-4` Aprobada:**
    - `FILA 1`: Cabecera de 6 Píldoras de Resumen.
    - `FILA 2 (Grilla 2×2 Simétrica Amplia 320px — igual ancho 50%/50% e igual alto en los 4 cuadrantes)`:
      - `Cuadrante 1 (Izq Arriba)`: Plano 2D de Markowitz 100% dinámico e interactivo por activo y cartera con capas activables.
      - `Cuadrante 2 (Izq Abajo)`: Tornado de Stress Macro, VaR 95% por Activo y Captura Upside/Downside por Activo.
      - `Cuadrante 3 (Der Arriba)`: Matriz de Correlación Cruzada (`Normal` vs `Cola de Crisis`) + Beta y Descorrelación por Activo.
      - `Cuadrante 4 (Der Abajo)`: Matriz 2D de Choque Cruzado (`Tasas bps × S&P 500 %` filtrable por Cartera o Activo) + Matriz de Regímenes de Markov (`#11`).
    - `FILA 3 (100% Ancho Completo)`: Proyección Monte Carlo (`6M | 12M | 24M` con bandas activables) / Curva Subacuática de Drawdown / Rolling 60D Sharpe & Beta.
  - **✅ Vista 3 (`Laboratorio de Estrategias Ad-Hoc` — Variante `V3-SIM-1` Aprobada):**
    - `FILA 1`: Encabezado Permanente de Impacto sobre la Cartera Total (`Base` vs `Con Ad-Hoc`).
    - `FILA 2 (Grilla 2×2 Simétrica Amplia 320px)`: Cuadrante 1 (`Simulador What-If #1` + `Criterio de Kelly #14`), Cuadrante 2 (`Escudo de Opciones Tail-Hedge #6` + `Monitor de Margen y Margin Call #13`), Cuadrante 3 (`Comité Autónomo de 3 Pilares NEW-09` con `Cap 20% NAV` y `P-06 < 0.65`) y Cuadrante 4 (`Libro de Ejecución y Auditoría NEW-10`).
    - `FILA 3 (100% Ancho Completo)`: Validación `Walk-Forward In-Sample vs Out-of-Sample (#9)`.

---

## 7. Pantallas Transversales, Persistencia y Auditoría Visual de Cierre — `[6 ítems]`

- ✅ **Persistencia de `Watchlist` en `localStorage` (`mid_watchlist_v1`):** conserva los activos seguidos al recargar y sincroniza `Markets` con `Portfolio`.
- ✅ **Persistencia de Posiciones/Órdenes de `Portfolio` (`mid_portfolio_v1`), Idioma (`mid_lang_v1`), Paleta (`mid_theme_v1`) y Diseño de `Home` (`mid_home_layout_v1`) en `localStorage`:** conserva toda la personalización del usuario entre sesiones e incluye botón `Reset Base` en `Portfolio`.
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
