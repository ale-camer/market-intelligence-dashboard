# Plan Maestro Detallado del MVP (`MVP_MASTER_BLUEPRINT.md`)

Documento rector que define **qué contiene cada sección de la plataforma, qué problema resuelve para un perfil profesional (Trader / Quant) y para un perfil educativo, y cuáles son los 6 pilares exactos que delimitan el MVP terminado**.

> **Metodología de Trabajo en 2 Etapas:**
> 1. **Etapa 1 — Definición Funcional ("Qué va en cada parte"):** Revisar y acordar sobre este documento todos los componentes, instrumentos, métricas y flujos que debe tener cada pantalla. Podés dejar comentarios línea por línea igual que en los documentos anteriores.
> 2. **Etapa 2 — Distribución Visual y Prototipos en `DEV` ("Cómo se muestra y por qué"):** Una vez cerrado el contenido de cada pilar, armamos las propuestas de distribución y modelos visuales en la pestaña `DEV` para comparar opciones y elegir el diseño definitivo antes de aplicarlo.

---

## Visión y Alcance Cerrado del MVP

- **Objetivo Central:** Proveer una estación de trabajo multi-activo (*Workstation MVP*) que reúna el universo real de inversión de mayor liquidez global (**10 clases de activos, 213 instrumentos líderes**) junto con las **herramientas cuantitativas mínimas indispensables** que un Quant, Trader o estudiante avanzado necesita para:
  1. **Explorar y filtrar** el mercado global y armar su **`★ Watchlist`** de seguimiento.
  2. **Analizar cuantitativa y fundamentalmente** cada activo con las herramientas propias de su naturaleza (superficie de volatilidad y *payoff* de opciones/sintéticos, curvas soberanas, arbitraje/conversión cruzada de divisas, curvas *forward* de commodities, microestructura y reportes/noticias con IA).
  3. **Evaluar e incorporar activos a una Cartera (`Portfolio`)**, midiendo su impacto en riesgo agregado (`VaR`, `Beta`, `Sharpe`, correlaciones) y validando cada decisión con un **Comité Multi-Agente de 3 Pilares**.

---

## Los 6 Pilares Detallados del MVP

### PILAR 1 — `HOME` (Presentación, Orientación, Guía de Uso y Lanzadera de Navegación)
El `Home` deja de ser únicamente una portada estética y pasa a cumplir el rol de **centro de bienvenida, contexto y navegación rápida** tanto para quien entra por primera vez (fines educativos) como para quien entra a operar/analizar (fines profesionales).

| Sub-bloque | Elementos Incluidos | Propósito Funcional / Educativo | Estado Actual |
| :--- | :--- | :--- | :--- |
| **1.1 Cabecera y Menú Global** | • Monograma institucional **`λ-08H`** arriba a la izquierda (sin texto adyacente).<br>• Navegación principal hacia **`Markets`** y **`Portfolio`**.<br>• Acceso rápido a **Guía/Glosario**, **Idioma (ventana modal central con menú desplegable y escritura en idioma original entre 56 idiomas con banderas)**, **Paleta Ambiental** y **Observabilidad**. | Garantizar navegación limpia y acceso en 1 click a cualquier área o configuración desde el primer segundo. | ✅ Base lista *(Falta integrar accesos del Home)* |
| **1.2 Presentación Ejecutiva de la App** | • Titular claro de propósito (*"Estación de Inteligencia Cuantitativa, Derivados y Gestión Sistemática de Cartera"*).<br>• Resumen dual de valor: **Modo Profesional (Desk Quant / Trader)** vs **Modo Educativo (Laboratorio Financiero e IA)**. | Explicar en 5 segundos qué es la plataforma, qué activos abarca y por qué combina estadística, derivados e IA. | 🔲 **A prototipar en `DEV`** |
| **1.3 Tarjetas de Navegación Posterior (Launchpad)** | Accesos directos interactivos hacia los 4 flujos principales:<br>1. **Screener Global & Watchlist (`213 activos • 10 clases`)**<br>2. **Workbenches Quant (`Volatilidad 2D & Payoffs • Curvas 42 Países • FX 61 Monedas • Forwards`)**<br>3. **Research Fundamental & Sentimiento IA (`SEC 10-K RAG + FinBERT`)**<br>4. **Simulador de Cartera & Comité de 3 Pilares (`$100k Ledger + Risk Guardrails`)** | Permitir que el usuario elija directamente a qué flujo entrar según lo que quiera hacer hoy. | 🔲 **A prototipar en `DEV`** |
| **1.4 Guía Rápida "Cómo usar la plataforma en 3 pasos"** | Flujo visual resumido en el propio Home:<br>**Paso 1 (Descubrir):** Filtrar activos en `Markets` y marcar candidatos en `★ Watchlist`.<br>**Paso 2 (Estudiar):** Analizar técnico, superficie/payoff de opciones, curvas o *Research* del activo.<br>**Paso 3 (Decidir):** Evaluar en `Portfolio` con el Comité IA, medir riesgo (`VaR`/correlación) e incorporar a la cartera. | Darle estructura pedagógica y operativa inmediata a cualquier usuario nuevo. | 🔲 **A prototipar en `DEV`** |
| **1.5 Pulso Macro en Vivo (Mini- Cinta / Snapshot)** | Indicadores rápidos del estado del mercado al entrar (*Régimen P-06 Normal/Dislocación, VIX, US10Y, DXY, S&P 500, BTC*). | Dar contexto de mercado instantáneo apenas abre la aplicación. | 🔲 **A prototipar en `DEV`** |

---

### PILAR 2 — `MARKETS • NIVEL 1` (Screener Multi-Activo, Pulso Agregado y `★ Watchlist`)
El primer nivel de `Markets` es el radar global donde el usuario filtra el universo líquido, detecta anomalías estadísticas y selecciona qué activos guardar en su **`★ Watchlist`** o abrir en detalle.

| Sub-bloque | Elementos Incluidos | Propósito Funcional / Educativo | Estado Actual |
| :--- | :--- | :--- | :--- |
| **2.1 Barra de Filtro de Universo** | • **`All` (`Todos`)** primero.<br>• **`★ Watchlist (N)`** segundo.<br>• Las **10 clases de activos ordenadas alfabéticamente**: `Cash & SOFR`, `Commodities`, `Crypto`, `Derivatives & Vol`, `Equities (S&P/NDX)`, `ETFs`, `FX Currencies`, `Indices`, `Rates & Curves`, `US Treasuries`. | Navegar los 213 instrumentos más líquidos del mundo o aislar en 1 click los activos en seguimiento (`Watchlist`). | ✅ **100% Listo** |
| **2.2 Las 4 Tarjetas de Pulso Agregado** | 1. **`24h Aggregate Volume`**: Volumen USD sumado de la categoría activa + sparkline.<br>2. **`AVG RSI (14)`**: Momentum promedio del grupo (`>50` alcista / `<50` bajista).<br>3. **`Normal Regime (P-06)`**: Anillo con **`%` limpio (`79%`)**, fracción legible al costado (`169 / 213 normales`), desglose (`Elevated • Disloc.`) y píldora dinámica de **`TOP ANOMALY`**.<br>4. **`Top Volume Z-Score (20d)`**: Los 3 activos con mayor desvío estadístico de volumen (`σ`). | Resumir la salud cuantitativa del universo completo o de la clase filtrada sin tener que leer 200 filas. | ✅ **100% Listo** |
| **2.3 Los 3 Modos Visuales del Screener** | • **`Table` (Tabla Institucional):** Búsqueda por teclado (`↑/↓/Enter`), estrella `★/☆` para agregar/quitar de `Watchlist`, ordenamiento por columna y **2 columnas dinámicas específicas** al elegir una clase de activo.<br>• **`Orbital` (Mapa de Anomalías):** Distribución radial según distancia al centro de dislocación.<br>• **`Heatmap` (Mapa de Calor):** Bloques proporcionales al volumen con escala estricta de 8 tonos **Verde (`#10b981`) / Rojo (`#f43f5e`)**. | Adaptar la exploración según el objetivo: lectura tabular precisa (`Table`), detección de *outliers* (`Orbital`) o visión de mercado completo (`Heatmap`). | ✅ **100% Listo** |

---

### PILAR 3 — `MARKETS • NIVEL 2: ANALYTICS` (Estación Cuantitativa y Motores por Clase)
Al abrir un activo, `Analytics` ofrece 4 lentes de trabajo cuantitativo. Los primeros 3 son universales y el **4° lente se transforma dinámicamente según la clase de activo** para entregar la herramienta exacta que usa un Quant en esa mesa.

| Sub-bloque | Elementos Incluidos | Propósito Funcional / Educativo | Estado Actual |
| :--- | :--- | :--- | :--- |
| **3.1 Cabecera Editorial (`Hero`)** | • Ticker, nombre, par, categoría y botón **`★ EN WATCHLIST / ☆ + WATCHLIST`**.<br>• Selector de temporalidad (`1m`, `5m`, `1H`, `1D`, `1W`, `1M`, `3M`, `1Y`, `ALL`).<br>• Tira de métricas clave incluyendo las **2 métricas institucionales específicas de su categoría**. | Ver de un vistazo el precio, régimen de anomalía y los indicadores propios de ese tipo de instrumento. | ✅ **100% Listo** |
| **3.2 Lente 1: Análisis Técnico (`Technical Overlays`)** | • Gráfico principal con `SMA (20)`, `Bollinger Bands (20, 2σ)` y `VWAP` activables.<br>• Sub-panel sincronizado de histograma de volumen. | Evaluar tendencia, compresión de volatilidad y niveles de precio promedio ponderado por volumen. | ✅ **100% Listo** |
| **3.3 Lente 2: Comparación Relativa (`%`)** | • **Buscador con autocompletado por ticker o nombre** restringido estrictamente a activos de la **misma clase o clase compatible**.<br>• Normalización automática de ambas curvas en rendimiento porcentual (`%`) sobre la ventana elegida. | Comparar desempeño relativo real (ej. `NVDA` vs `AMD`/`SOXX` o `US10Y` vs `DE10Y`) evitando comparaciones inválidas entre clases incompatibles. | ✅ **100% Listo** |
| **3.4 Lente 3: Microestructura & Flujo (`P-06`)** | • Pulso de `Volume Z-Score (20d σ)` vs `24h Volume Histogram`.<br>• Telemetría de `Bid-Ask Spread (bps)`, `Bollinger Width` y diagnóstico en vivo del modelo *Isolation Forest (`P-06`)*. | Detectar flujos institucionales inusuales, secado de liquidez o roturas estadísticas de rango. | ✅ **100% Listo** |
| **3.5 Lente 4A: Opciones, Sintéticos y Superficie de Volatilidad 3D/2D (`DERIVATIVES_VOL`, `EQUITY`, `ETF`, `INDEX`, `CRYPTO`)** | Conmutador interno entre **3 vistas esenciales para un Quant de Opciones**:<br>1. **Superficie de Volatilidad 3D (`Surface3DViewer.jsx`):** malla 3D interactiva (`9 Strikes × 7 Vencimientos × IV %`) rotable con el mouse en `Yaw/Pitch`, con 4 cámaras predefinidas y cortes transversales 3D.<br>2. **Sonrisa de Volatilidad 2D:** Curvas simultáneas de IV a `7D`, `30D`, `90D` y `180D` por strike (`85%..115%` moneyness), `ATM IV`, `IV Rank`, `25Δ Skew`, `Net GEX` y `Max Pain` (filtrado por alta liquidez `Vol > 10k • OI > 25k`).<br>3. **Perfil de Beneficios (`Payoff P&L`) y Constructor de Estrategias / Sintéticos:**<br>   • Selector de 10 estrategias clásicas y sintéticas (*Long Straddle, Bull Call Spread, Bear Put Spread, Iron Condor, Long Strangle, Synthetic Long, Synthetic Short, Covered Call, Long Call, Long Put*).<br>   • Gráfico de **Payoff P&L al Vencimiento (`$`) superpuesto con la curva teórica hoy (`T+0 Black-Scholes $`)** y `Breakeven ($0)`.<br>   • Cálculo de **Costo/Crédito Neto, Puntos de Equilibrio (`BE`), Ganancia/Pérdida Máxima y Griegas Netas (`Δ, Γ, Θ, ν`)**. | Permitir pasar directamente del estudio de si la volatilidad implícita está cara/barata (Superficie 3D/2D y Skew) a estructurar qué estrategia o sintético conviene armar y visualizar exactamente su perfil de ganancias/pérdidas y sus griegas. | ✅ **100% Listo** |
| **3.5 Lente 4B: Superficie 3D y Curva de Rendimientos Soberanos (`RATES`, `FIXED_INCOME`, `CASH`)** | • Selector interactivo de **42 países** con curva completa (`3M`, `6M`, `1Y`, `2Y`, `3Y`, `5Y`, `7Y`, `10Y`, `20Y`, `30Y`).<br>• Conmutador entre **Superficie 3D (Evolución Histórica)**, **Superficie 3D (Multi-País)** y **Curva 2D** contra benchmarks **US Treasury** y **German Bund**.<br>• Cálculo de pendientes **`2s10s`**, **`3m10y`**, curvatura **`Butterfly 2s5s10s`**, **`Tasa Real 10Y`** y riesgo **`DV01`**. | Analizar inversiones de curva, empinamientos (*steepeners/flatteners*), riesgo de duración y spreads soberanos globales en 3D y 2D. | ✅ **100% Listo** |
| **3.5 Lente 4C: Conversor y Triangulador Cruzado (`FX`)** | • Input de monto + Selector `Moneda Base ⇄ Moneda Cotizada` entre **61 divisas ISO**.<br>• Triangulación exacta vía `USD`, tasa inversa, diferencial de tasas soberanas (**`Carry 10Y` en bps**) y gráfico histórico del par cruzado. | Calcular arbitrajes triangulares, costos de cobertura cambiaria y atractivo de *Carry Trade* entre cualquier par de monedas del mundo. | ✅ **100% Listo** |
| **3.5 Lente 4D: Superficie 3D y Curva Forward de Materias Primas (`COMMODITY`)** | • Superficie 3D y Curva 2D de estructura temporal de futuros `Spot (M1)` a `M18`.<br>• Diagnóstico automático de **`Contango`** vs **`Backwardation`**, cálculo de **`Roll Yield` anualizado**, inventarios vs media de 5 años y posicionamiento **`COT Net Speculative`**. | Evaluar el costo o beneficio de rolar contratos de futuros y la escasez física del commodity en 3D y 2D. | ✅ **100% Listo** |

---

### PILAR 4 — `MARKETS • NIVEL 2: RESEARCH` (Inteligencia Fundamental, NLP y Guardrails)
El modo `Research` complementa la mirada matemática con el análisis documental y de sentimiento en tiempo real adaptado a cada clase de activo.

| Sub-bloque | Elementos Incluidos | Propósito Funcional / Educativo | Estado Actual |
| :--- | :--- | :--- | :--- |
| **4.1 Hero Cualitativo y Termómetro FinBERT** | • Postura ejecutiva (`BULLISH / BEARISH`) y ponderación específica según la sensibilidad de la clase de activo (ej. Acciones pondera más fundamentos 10-K; Crypto/FX pondera más flujo de noticias).<br>• Nota Compuesta Ponderada y **Recta Numérica Lineal de Sentimiento (`-100` a `+100`)**. | Entender cuánto del movimiento actual responde a fundamentos estructurales vs ruido o catalizadores de noticias. | ✅ **100% Listo** |
| **4.2 Buscador RAG con Guardrail de 3 Capas y *Quick Chips* por Clase** | • Input de preguntas naturales sobre reportes oficiales (`10-K`, comunicados de bancos centrales, prospectos de ETFs, reportes EIA/OPEC).<br>• **4 *Quick Chips* específicos para cada una de las 10 categorías**.<br>• Guardrail estricto que bloquea consultas fuera de dominio financiero. |Consultar datos puntuales verificados con trazabilidad documental en 1 click. | ✅ **100% Listo** |
| **4.3 Top 5 *Bull Drivers* / *Bear Risks* + *Live Wire*** | • 5 catalizadores alcistas y 5 riesgos bajistas ponderados por materialidad (`HIGH / MEDIUM / LOW`).<br>• Flujo de titulares en tiempo real (*Live Wire*) con botón de simulación que actualiza los drivers cuando ingresa una noticia de alta materialidad. | Contrastar los argumentos alcistas y bajistas antes de tomar posición. | ✅ **100% Listo** |

---

### PILAR 5 — `PORTFOLIO & WATCHLIST` (Gestión de Cartera, Riesgo Quant y Comité Multi-Agente)
El módulo `Portfolio` conecta la `★ Watchlist` con una cartera sistemática de `$100,000`, permitiendo evaluar candidatos con el Comité IA, medir el riesgo cuantitativo del portafolio y simular rebalanceos.

| Sub-bloque | Elementos Incluidos | Propósito Funcional / Educativo | Estado Actual |
| :--- | :--- | :--- | :--- |
| **5.1 Cabecera de Asignación (`Donut SVG` + Bloques)** | • Balance total (`NAV`), P&L acumulado (`$` y `%`), `% Invertido` vs `% Liquidez (CASH)`.<br>• Anillo interactivo de distribución + barra proporcional de bloques por activo. | Visualizar la concentración de la cartera y el colchón de liquidez disponible. | ✅ **100% Listo** |
| **5.2 Selector Conectado (`En Cartera` vs `★ Watchlist`)** | • Pestañas `Todos`, `En Cartera` y **`★ Watchlist`** (sincronizada automáticamente con los activos marcados con `★` en `Markets`).<br>• Filtro dinámico por cualquiera de las 10 clases de activos.<br>• Botón **`+ INCORPORAR`** en cada candidato de la Watchlist y controles de simulación (`-1%`, `+1%`, `+5%`, `Reset`, `Execute AI Target`). | Pasar sin fricción de tener un activo en observación (`Watchlist`) a evaluarlo y sumarlo a la cartera respetando los límites de riesgo. | ✅ **100% Listo** |
| **5.3 Panel Quant de Riesgo y Correlación de Cartera (Por implementar)** | • **Métricas agregadas de riesgo de la cartera activa:**<br>  1. **`VaR (95%, 1D)`** en USD y `%` del NAV.<br>  2. **`Beta Ponderado`** de la cartera frente al S&P 500 (`SPY`).<br>  3. **`Sharpe Ratio` / `Sortino`** estimado y **`Volatilidad Anualizada`** de la cartera.<br>  4. **Matriz Compacta de Correlación Cruzada (`r` de `-1.00` a `+1.00`)** entre las posiciones activas para detectar sobre-concentración o coberturas naturales (*hedges*). | Darle al inversor/estudiante las métricas reales de gestión de portafolio institucional (diversificación real, riesgo de cola y correlaciones). | 🔲 **Pendiente de implementar** |
| **5.4 Comité Autónomo de 3 Pilares + Libro de Órdenes (`Execution Ledger`)** | • Deliberación auditable de los 3 agentes (**1. Quantitative Analytics**, **2. Fundamental & News Research**, **3. Risk & Sizing Guardrail** con tope máximo de `20% NAV` por activo y recorte automático al `5% NAV` si la anomalía `P-06 ≥ 0.65`).<br>• Historial cronológico de ejecuciones y rebalanceos simulados. | Mostrar de forma transparente y educativa *por qué* se aprueba, limita o recorta el tamaño de una posición. | ✅ **100% Listo** |

---

### PILAR 6 — `GUÍA DE USUARIO, GLOSARIO CUANTITATIVO Y CIERRE TÉCNICO`
El pilar transversal que convierte a la plataforma en una herramienta auto-explicativa, persistente y lista para uso diario o demostración profesional.

| Sub-bloque | Elementos Incluidos | Propósito Funcional / Educativo | Estado Actual |
| :--- | :--- | :--- | :--- |
| **6.1 Guía Interactiva, Definiciones y Objetos (`UserGuideView.jsx`)** | • Accesible desde el botón **`(i)`** del footer y desde el **`Home`**.<br>• Diccionario completo de **Objetos de Interfaz**, **Las 10 Clases de Activos**, **Fórmulas de los Motores Quant** (Superficie IV, Payoffs y Griegas, Curvas Soberanas y `DV01`, Triangulación FX y `Carry`, `Contango/Backwardation`, `VaR` y Correlación) e **Indicadores de IA (`P-06`, `FinBERT`, `RAG`)**. | Que cualquier usuario pueda consultar en el acto qué significa una métrica, cómo se calcula una fórmula o cómo interpretar un gráfico sin salir de la app. | 🟡 **Placeholder Listo** *(Redacción final e iteración al cerrar los pilares 1, 3.5 y 5.3)* |
| **6.2 Persistencia Completa y Atajo Global de Búsqueda** | • Guardar en `localStorage` la `Watchlist` (ya activo), las posiciones y órdenes de `Portfolio`, el idioma elegido y la paleta ambiental.<br>• Atajo de teclado global (`/` o `Ctrl+K`) para saltar a cualquier activo desde cualquier pantalla. | Conservar todo el trabajo del usuario al recargar el navegador y acelerar la navegación por teclado. | 🟡 **50% Listo** *(Watchlist persistida; falta persistir Portfolio/Preferencias y atajo)* |
| **6.3 Observabilidad FinOps, Multi-Idioma y Paletas (`FooterBar.jsx`, `ObservabilityView.jsx`)** | • Monitoreo de los 13 repositorios y presupuesto FinOps `< $10/mes`.<br>• Ventana modal en el centro de la pantalla con menú desplegable buscable en lengua original para **56 idiomas con banderas SVG vectoriales**.<br>• 5 paletas ambientales respetando **Verde (`#10b981`) = Positivo** y **Rojo (`#f43f5e`) = Negativo**. | Transparencia de arquitectura de datos y personalización visual internacional. | ✅ **100% Listo** |
| **6.4 URLs Específicas por Objeto y Auditoría Visual con Capturas (`Deep-Link Routing & Visual QA`)** | • Sincronización bidireccional en tiempo real (`window.location.search`) para que **cada pantalla, categoría, activo, motor 3D/2D y estrategia tenga su propia URL determinística**.<br>• Protocolo de **Auditoría Visual Final**: al cierre del desarrollo, recorrer automáticamente el catálogo de URLs canónicas tomando una captura de pantalla de cada objeto para verificar su salud visual y cero regresiones. | Poder abrir, compartir y auditar la salud visual de cualquier objeto de la app mediante su URL directa. | ✅ **URLs Activas** *(Protocolo de capturas visuales anotado como hito de auditoría final)* |

---

## Catálogo de URLs Canónicas por Objeto (Para Acceso Directo y Auditoría Visual)

| # | Objeto / Motor de la Aplicación | URL Directa de Salud y Auditoría |
| :--- | :--- | :--- |
| **1** | **Home (`Landing Stage`)** | `http://localhost:5173/` |
| **2** | **Screener Global Nivel 1 (`Tabla 213 Activos`)** | `http://localhost:5173/?view=markets&mode=screener` |
| **3** | **Screener Nivel 1 — Vista `Orbital`** | `http://localhost:5173/?view=markets&mode=screener&screener=orbital` |
| **4** | **Screener Nivel 1 — Vista `Heatmap`** | `http://localhost:5173/?view=markets&mode=screener&screener=heatmap` |
| **5** | **Superficie de Bonos Soberanos 3D (Evolución `3M..30Y`)** | `http://localhost:5173/?view=markets&mode=detail&asset=US10Y&section=analytics&lens=derivatives&sub=3d-history&country=US` |
| **6** | **Superficie de Bonos Soberanos 3D (Multi-País)** | `http://localhost:5173/?view=markets&mode=detail&asset=US10Y&section=analytics&lens=derivatives&sub=3d-peers&country=US` |
| **7** | **Curva de Bonos Soberanos 2D (`vs UST & Bund`)** | `http://localhost:5173/?view=markets&mode=detail&asset=US10Y&section=analytics&lens=derivatives&sub=2d&country=US` |
| **8** | **Superficie de Volatilidad Implícita 3D (`Strike × Tenor × IV`)** | `http://localhost:5173/?view=markets&mode=detail&asset=NVDA-OPT&section=analytics&lens=derivatives&sub=surface3d` |
| **9** | **Sonrisa de Volatilidad 2D (`7D / 30D / 90D / 180D`)** | `http://localhost:5173/?view=markets&mode=detail&asset=NVDA-OPT&section=analytics&lens=derivatives&sub=surface` |
| **10** | **Payoff P&L de Opciones y Sintéticos (`Vencimiento & T+0`)** | `http://localhost:5173/?view=markets&mode=detail&asset=NVDA-OPT&section=analytics&lens=derivatives&sub=payoff&strategy=LONG_STRADDLE` |
| **11** | **Conversor Cruzado FX (`61 Monedas ISO`)** | `http://localhost:5173/?view=markets&mode=detail&asset=EUR/USD&section=analytics&lens=derivatives&fxBase=EUR&fxQuote=BRL` |
| **12** | **Superficie Forward 3D de Materias Primas (`M1..M18`)** | `http://localhost:5173/?view=markets&mode=detail&asset=CL&section=analytics&lens=derivatives&sub=3d` |
| **13** | **Comparador Relativo por Clase Compatible (`%`)** | `http://localhost:5173/?view=markets&mode=detail&asset=NVDA&section=analytics&lens=compare` |
| **14** | **Inteligencia Documental & Sentimiento (`Research + RAG`)** | `http://localhost:5173/?view=markets&mode=detail&asset=NVDA&section=research` |
| **15** | **Portfolio & Comité Multi-Agente (`+ ★ Watchlist`)** | `http://localhost:5173/?view=portfolio` |
| **16** | **Guía de Usuario, Definiciones y Objetos (`(i)`)** | `http://localhost:5173/?view=guide` |
| **17** | **Observabilidad del Sistema & FinOps** | `http://localhost:5173/?view=observability` |

---

## Resumen de lo que falta para declarar el MVP 100% Terminado

1. **En Pilar 1 (`Home`):** Definir y prototipar en `DEV` el nuevo `Home` útil (Presentación, Lanzadera de Navegación hacia las herramientas, Guía en 3 pasos y Pulso Macro).
2. **En Pilar 5 (`Portfolio`):** Agregar el **Panel Quant de Riesgo de Cartera (`VaR 95%`, `Beta`, `Sharpe` y Matriz de Correlación entre posiciones)**.
3. **En Pilar 6 (`Persistencia, Guía Final y Auditoría Visual por URL`):**
   - Persistir cartera/preferencias en `localStorage`.
   - Redactar e iterar la versión definitiva de la **Guía de Usuario y Glosario (`UserGuideView.jsx`)**.
   - Ejecutar la **Auditoría Visual Completa con capturas de pantalla** sobre las 17 URLs canónicas del catálogo superior para certificar la salud de cada objeto.

