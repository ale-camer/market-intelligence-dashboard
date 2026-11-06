# Hoja de Ruta Iterativa: Audiencias, Agente Guía Global e Identidad de la App

> **Metodología y Regla Estricta de Supervisión:**
> 1. **De menor a mayor y paso a paso:** Primero analizamos y definimos cada punto en este documento.
> 2. **Ejecución de a 1 punto a la vez bajo supervisión:** Al momento de implementar, se aplica **únicamente un (1) micro-paso por vez**, se verifica en pantalla y **sólo se avanza al siguiente bajo indicación y aprobación explícita del usuario**.

---

## 1. Los 5 Perfiles Oficiales de Audiencia

Toda decisión de comunicación, contenido y guía conversacional de la plataforma se evalúa frente a estos **5 perfiles**:

| # | Perfil | ¿Quién es y con qué mentalidad entra? | ¿Qué necesita encontrar rápido? |
| :-: | :--- | :--- | :--- |
| **1** | **Curioso / Aprendiz** | Persona interesada en aprender cómo funcionan los mercados o la tecnología aplicada a finanzas, sin base técnica ni financiera previa. | Explicaciones claras, sin jerga intimidante, entendiendo *qué es* cada cosa, *por qué se mueve* un activo y *por dónde empezar a explorar*. |
| **2** | **Inversor Individual / Principiante** | Persona que invierte (o quiere empezar a invertir) por su cuenta. Conoce términos básicos pero quiere evitar errores comunes. | Orientación práctica: cómo leer si un activo está caro/barato o con volumen anormal, cómo armar una cartera equilibrada y cómo entender el riesgo en términos simples. |
| **3** | **Profesional Quant** | Analista cuantitativo, trader, portfolio manager o perfil financiero avanzado. | Rigor estadístico e institucional: métricas puras (`Sharpe`, `Sortino`, `VaR 95%`, `CVaR 99%`, `ENB`, `ATM IV`, `25Δ RR`, `Carry Spread`, `Isolation Forest`, `Brinson`, `Kelly`). |
| **4** | **Profesional IT** | Ingeniero de Software, Data/ML Engineer, Cloud Architect, SRE o especialista FinOps. | Arquitectura real detrás del producto: cómo operan los 13 repositorios/pipelines (`P-01` a `P-13`), contratos de datos, latencias `p50/p95`, MLOps/RAG y cómo corre todo por `~$0.95/mes`. |
| **5** | **Evaluador de RRHH** | Recruiter, Talent Acquisition o Hiring Manager que evalúa el proyecto como portafolio profesional (suele disponer de 1 a 3 minutos). | Visión clara e inmediata del alcance del proyecto: qué problema resuelve, qué habilidades demuestra (producto, UX, 56 idiomas, datos en vivo, IA, cloud/FinOps) y una guía fácil de qué recorrer. |

---

## 2. Fase 1 — Mensajes y Adaptación por Audiencia (De Menor a Mayor)

El objetivo de esta fase es analizar vista por vista **qué mensaje mostramos, a qué perfil le habla y en qué lugar exacto se ubica**, sin recargar la estética minimalista (`V010 Ghost`).

### Micro-Pasos de la Fase 1

- [x] **Paso 1.1 — Diagnóstico y Mapa de Contacto Inicial (Punto de Partida):**
  - **Objetivo:** Analizar qué experimenta hoy cada uno de los 5 perfiles en los primeros 15 segundos al abrir la app (`Home` + barra de navegación + `Footer`) y definir qué piezas de orientación faltan o deben afinarse.
  - **Decisiones anotadas:**
    1. **Subtítulo de `Home` ([`HomeStage.jsx`](../src/components/HomeStage.jsx)):** Usar la primera versión conceptual y limpia, **sin mencionar el número de activos** (ya que la cantidad está pensada para que cualquiera pueda experimentar sin quedarse corto):
       > *"Analizá activos globales en tiempo real, simulá el riesgo de tu cartera y explorá una arquitectura cuantitativa y agéntica de punta a punta."*
    2. **Tooltips en Navegación (`HeaderBar` / `FooterBar`):** Si se incorporan, deben tener una **estética de máxima sencillez** (texto ultra-corto y discreto, estilo `V010 Ghost`, sin cajas pesadas ni contaminación visual como los tooltips anteriores).
    3. **Sección "¿Qué buscás?" en `Guide` (`Home`) con Links Directos:** En la primera página de `Guide`, sumar el bloque de orientación para los **5 perfiles** (*Curioso/Aprendiz, Inversor Individual/Principiante, Profesional Quant, Profesional IT, Evaluador de RRHH*) incluyendo **links interactivos directos** que lleven a cada usuario a la vista/herramienta correspondiente con un clic.

- [x] **Paso 1.2 — Patrones Adicionales de Orientación Concisa (Cómo se aplican en la UI actual):**
  - **Regla de Oro:** No crear cajas nuevas ni agrandar tarjetas; reutilizar los **renglones secundarios que ya existen** en la interfaz actual.
  - **1. Lectura en 2 Capas (En el 3er renglón de las tarjetas KPI que ya existen):**
    - *Dónde:* En las 4 tarjetas superiores de `Markets > Screener` ([`MarketAnomaliesView.jsx`](../src/components/MarketAnomaliesView.jsx)) y en las 6 tarjetas superiores de `Portfolio > Builder / Risk / Simulator` ([`PortfolioVista1Builder.jsx`](../src/components/portfolio/PortfolioVista1Builder.jsx), [`PortfolioVista2Risk.jsx`](../src/components/portfolio/PortfolioVista2Risk.jsx), [`PortfolioVista3AdHoc.jsx`](../src/components/portfolio/PortfolioVista3AdHoc.jsx)).
    - *Cómo:* Hoy cada tarjeta ya tiene 3 líneas (`Título técnico` arriba, `Número grande` al medio, `Subtítulo gris` abajo). Sólo cambiamos el texto de ese `Subtítulo gris` para que traduzca el dato en lenguaje llano y en dólares cuando aplique (ej. en `VaR 95%`: cambiar *"Pérdida diaria esperada cola"* por *"En un día normal no perderías más de $1,650"*).
  - **2. Semáforos de 1 Palabra junto al Dato Crudo:**
    - *Dónde:* En la misma línea del valor o del subtítulo en `Markets` (`RSI`, `P-06`, `Volumen`) y en `Portfolio` (`Sharpe`, `Beta`, `ENB`).
    - *Cómo:* Acompañar el número con una palabra diagnóstica clara entre paréntesis o separada por un punto: ej. `ENB: 5.5` → *"5.5 apuestas independientes (Bien diversificada)"*; `Sharpe: 1.54` → *"Retorno/riesgo sólido (>1.0)"*.
  - **3. Presets / Carteras de Ejemplo de 1 Clic:**
    - *Dónde:* En la cabecera derecha de la tarjeta `Portfolio Holdings` ([`PortfolioVista1Builder.jsx`](../src/components/portfolio/PortfolioVista1Builder.jsx)), exactamente en la misma línea de texto fantasma (`V010 Ghost`) donde hoy están `Equal Weight • Normalize 100% • Reset Base`.
    - *Cómo:* Sumar ahí mismo 3 botones de texto liviano (`Conservadora`, `Balanceada`, `Agresiva/Quant`) que cargan 3 combinaciones reales de activos para que cualquier perfil (Aprendiz, Inversor o RRHH) vea cambiar toda la cartera con un solo clic.
  - **4. Preguntas Iniciales Sugeridas en el Agente Global:**
    - *Dónde:* En la fila de *Quick Chips* arriba del historial del chat del Agente (donde hoy están los 3 botones `Check ETF overlap | Simulate Put hedge | Optimize Sharpe`).
    - *Cómo:* Esos mismos chips cambian dinámicamente según la pantalla en la que estés parado (ej. en `Home` o `Guide`: *"¿Por dónde empiezo?"*, *"Resumen para RRHH / IT"*; en `Markets`: *"Explicame este gráfico en simple"*, *"¿Por qué se mueve este activo?"*; en `System`: *"Explicame la arquitectura y el costo de $0.95/m"*).

- [x] **Paso 1.3 — Vista `Home` ([`src/components/HomeStage.jsx`](../src/components/HomeStage.jsx)) y Navegación (`HeaderBar`/`FooterBar`) *(Aplicado)*:**
  - **Objetivo:** Aplicar el nuevo subtítulo acordado y validar la estética ultra-simple de los tooltips de navegación.
  - **Cambios aplicados:**
    1. Subtítulo en `Home` actualizado en [`src/data/i18n/uiStrings56.js`](../src/data/i18n/uiStrings56.js) (*"Analizá activos globales en tiempo real, simulá el riesgo de tu cartera y explorá una arquitectura cuantitativa y agéntica de punta a punta."* / *"Analyze global assets in real time, simulate your portfolio risk, and explore an end-to-end quantitative and agentic architecture."*).
    2. Tooltips minimalistas de 1 línea con estilo **texto puro flotante (`pure-text`, sin cajas ni bordes)** habilitados en [`src/components/HoverTooltip.jsx`](../src/components/HoverTooltip.jsx), [`src/components/HeaderBar.jsx`](../src/components/HeaderBar.jsx) (`Home`, `Activos y análisis`, `Riesgo y simulaciones`) y [`src/components/FooterBar.jsx`](../src/components/FooterBar.jsx) (`Monitorear pipelines y FinOps`, `Cómo usar la plataforma`, `Elegir idioma`, `Elegir paleta`).

- [x] **Paso 1.4 — Vista `Guide` ([`src/components/UserGuideView.jsx`](../src/components/UserGuideView.jsx)) *(Completado)*:**
  - **Objetivo:** Incorporar el bloque **"¿Por dónde querés empezar?"** justo debajo de los 2 párrafos introductorios de `Guide > Home`, con 5 puntos de partida funcionales e implícitos (sin rotular perfiles explícitamente) y cápsulas `soft-pill` sin flechas hacia la Guía y la app en vivo.

- [x] **Paso 1.5 — Vista `System` ([`src/components/ObservabilityView.jsx`](../src/components/ObservabilityView.jsx)) *(Completado)*:**
  - **Objetivo:** Adaptar `Performance` y `FinOps` específicamente para el **Profesional IT** y como evidencia de ingeniería para el **Evaluador de RRHH**, sin agregar cajas nuevas:
    1. **En `Performance` (Bloque de especificación `// ...` del módulo seleccionado):**
       - Sumar `// Pipeline Topology (DAG):` indicando de qué módulos recibe datos y qué pantalla de la app alimenta (conectando backend con UI).
       - Sumar `// Scaling & Resilience:` explicando el perfil *Scale-to-Zero (`min=0`)* y el snapshot en caché ante arranque en frío.
    2. **En `Performance` (Cabecera de `Live Telemetry & Logs`):**
       - Sumar el indicador global `11/11 Pipelines PASS • 0 Schema Drift`.
    3. **En `FinOps` (Bajada del encabezado de cuotas):**
       - Sumar 1 oración concisa explicando el diseño *Scale-to-Zero & Free-Tier Arbitrage* (por qué el cómputo en reposo cuesta `$0.00` y el gasto total queda acotado a `~$0.95/mes`).

- [x] **Paso 1.6 — Vista `Markets` ([`src/components/MarketAnomaliesView.jsx`](../src/components/MarketAnomaliesView.jsx)) *(Completado)*:**
  - **Objetivo:** Hacer convivir las métricas puras del **Profesional Quant** con lecturas interpretativas claras para el **Inversor Principiante** y el **Curioso/Aprendiz**, reutilizando los renglones existentes:
    1. **En `Markets > Screener` (3er renglón gris de las 4 tarjetas KPI):**
       - *Tarjeta 1 (`24H AGGREGATE VOLUME`):* `{N} activos • Mayor entrada de dinero hoy` (o `Menor actividad que ayer`).
       - *Tarjeta 2 (`AVERAGE RSI 14D`):* en 3 tramos intuitivos (`>60` *"Predominio comprador fuerte"*, `45–60` *"Mercado equilibrado • Empuje moderado"*, `<45` *"Predominio vendedor"*).
       - *Tarjeta 3 (`NORMAL REGIME P-06`):* `Mayoría sin sobresaltos • Atípico hoy: {SYM} ({SCORE})`.
       - *Tarjeta 4 (`TOP VOLUME Z-SCORE 20D`):* `Volumen inusual: {SYM1} ({Z1}) • {SYM2}`.
    2. **En `Markets > Analytics` (Línea de diagnóstico al pie del gráfico):**
       - Poner primero la traducción humana y al final entre paréntesis el respaldo técnico para el Quant (ej. *"MOVIMIENTO NORMAL • Precio y volumen dentro de su rango habitual, sin presión inusual de compra o venta (P-06: 0.196 • Vol 20d: -0.15σ)"*).
    3. **En `Markets > Research`:**
       - Mantener las 3 tarjetas superiores limpias en 1 sola fila con el precio y el sparkline (`WEIGHTED COMPOSITE: +36 (Filings +32 • News +40)`), sin agregar texto extra que fuerce un salto de línea ni duplique la lectura que ya muestra la tarjeta vecina (`Strong Institutional Accumulation`).

- [x] **Paso 1.7 — Vista `Portfolio` ([`src/components/AgentCommitteeView.jsx`](../src/components/AgentCommitteeView.jsx) y Vistas 1, 2, 3) *(Completado)*:**
  - **Objetivo:** Afinar los mensajes de `Builder`, `Risk` y `Simulator` para que un **Inversor Principiante** entienda de un vistazo si su cartera está sana o concentrada, mientras el **Profesional Quant** conserva todo el instrumental de Brinson, VaR/CVaR, estrés histórico y Kelly.
  - **Decisiones aprobadas:**
    1. **En `Portfolio > Builder` (3er renglón gris de las 6 tarjetas KPI):**
       - `RETORNO ANUAL (CAGR)`: `vs +16.5% S&P 500 • Ganancia anual estimada`
       - `SHARPE / SORTINO`: `Volatilidad σ: 13.7% • Retorno/riesgo sólido (>1.0)` *(dinámico según nivel)*
       - `VaR 95% / CVaR 99% (1D)`: `Riesgo diario normal: -$1,650 • Extremo: -$2,540` *(calculado en vivo sobre base \$100k)*
       - `MAX DRAWDOWN (12M)`: `Caída máxima histórica • Recuperación: ~14 días`
       - `ALPHA BRINSON (12M)`: `Ventaja sobre el mercado • Beta: 0.9 vs S&P 500`
       - `ACTIVOS SELECCIONADOS`: `5.5 apuestas reales (ENB) • Bien diversificada` *(o `Concentrada` si `ENB < 3.5`)*
    2. **En `Portfolio > Builder` (3 Presets de Cartera de 1 Clic en cabecera de `Portfolio Holdings`):**
       - **`Conservadora`:** `TLT` 30%, `GLD` 25%, `SPY` 25%, `MSFT` 12%, `AAPL` 8%.
       - **`Balanceada`:** `SPY` 24%, `NVDA` 22%, `GLD` 18%, `BTC-USD` 14%, `TLT` 12%, `MSFT` 10%.
       - **`Quant / Agresiva`:** `NVDA` 28%, `BTC-USD` 22%, `QQQ` 20%, `MSFT` 15%, `SOL-USD` 15%.
    3. **En `Portfolio > Risk` y `Simulator`:**
       - En `Risk` (`STRESS CRASH 2008`): `Caída en crisis severa (vs -42.0% S&P 500)`.
       - En `Risk` (`RÉGIMEN MARKOV`): `Clima actual (62% prob.) • Retorno est. +2.4%/mes`.
       - En `Simulator` (Criterio de Kelly): acompañar las 3 variantes con su guía práctica (`Quarter-Kelly (0.25x — Conservador / Recomendado)`, `Half-Kelly (0.50x — Equilibrado)`, `Full-Kelly (1.00x — Límite agresivo)`).

---

## 3. Fase 2 — Agente Guía Global en Toda la App (De Menor a Mayor)

### Principios de Diseño Acordados para el Agente
1. **Guía Puro y Conversacional (Sin Botones que Operen la UI):** El agente **no** modifica la pantalla ni incluye botones que ejecuten acciones por el usuario. Su valor está en **saber absolutamente todo sobre la app y su contenido** para guiar, explicar y responder con precisión.
2. **Especialista en "¿Por dónde empiezo?":** Dado que lo primero que suele hacer un usuario nuevo (un **Evaluador de RRHH**, un **Curioso/Aprendiz**, un **Inversor** o un **Profesional IT**) es abrir el chat y preguntar *"¿Qué es esta app?"*, *"¿Por dónde empiezo?"* o *"¿Qué puedo hacer acá?"*, el agente debe saber guiarlo paso a paso según su perfil e intereses.
3. **Omnipresente y Consciente del Contexto:** Disponible en toda la app (no sólo en `Portfolio`), sabiendo en qué pantalla está el usuario y qué datos reales se están mostrando en ese momento.
4. **Multilingüe Real (56 Idiomas):** Capaz de conversar naturalmente con el usuario en cualquiera de los idiomas de la plataforma (o en el idioma en que le escriban), superando las 4 respuestas enlatadas actuales de [`committeeService.js`](../src/services/committeeService.js).

### Micro-Pasos de la Fase 2

- [x] **Paso 2.1 — Diseño del Flujo de Bienvenida, "¿Por dónde empiezo?" y Guardrails *(Aplicado)*:**
  - **Objetivo:** Definir la ubicación del agente, su saludo inicial mínimo con opciones predefinidas orientadas 100% al producto (sin autopromoción personal) y los *guardrails* estrictos de alcance.
  - **Decisiones aprobadas:**
    1. **Ubicación (Esquina Superior Derecha):** Botón fijo en la esquina superior derecha del header global ([`src/App.jsx`](../src/App.jsx)), que hoy está libre e invita a interactuar de forma inmediata desde cualquier vista.
    2. **Saludo Inicial Mínimo + 4 Opciones Predefinidas Unificadas:**
       - *Saludo:* `"Hola, soy el guía de la plataforma. ¿Qué te gustaría explorar o consultar?"`
       - *Opciones iniciales (envían la pregunta al hacer clic):*
         1. `¿Por dónde empiezo?`
         2. `¿Qué hay en cada sección de la app?`
         3. `Explicame qué estoy viendo en esta pantalla`
         4. `¿Cómo funciona la arquitectura y el sistema?`
    3. **Respuestas Cortas, al Grano y Centradas en el Producto (3–4 líneas máx.):**
       - `¿Por dónde empiezo?` → Indica en 4 viñetas breves adónde ir según el objetivo (`Markets` para explorar activos y marcar `★`, `Portfolio` para armar/probar una cartera, `System` para ver ingeniería/pipelines y costos cloud, `Guide` para el paso a paso) y pregunta en cuál profundizar.
       - `¿Qué hay en cada sección de la app?` → Resume en 4 líneas qué herramientas contiene cada pestaña del menú superior (`Markets`, `Portfolio`, `System`, `Guide`).
       - `Explicame qué estoy viendo en esta pantalla` → Explica en 2–3 oraciones qué muestra la pantalla activa en ese momento y cómo usarla.
       - `¿Cómo funciona la arquitectura y el sistema?` → Resume el pipeline automatizado de 13 módulos (`P-01` a `P-13`) sobre GCP, GitHub Actions y Supabase con operación *Scale-to-Zero* (`~$0.95/mes`), indicando la pestaña `System` para ver métricas en vivo.
    4. **Guardrails Estrictos de Alcance (*Scope Lock*):**
       - *Exclusividad de Dominio:* Sólo responde sobre la app, sus activos/métricas financieras y su arquitectura (`P-01`..`P-13` / `FinOps`). Rechaza cortésmente en 1 línea cualquier consulta fuera de ese alcance.
       - *Complejidad Progresiva a Demanda:* Responde corto y simple por defecto; sólo profundiza en matemática Quant o ingeniería IT si el usuario lo pide.
       - *Foco en el Producto (0% autobombo) y Sin Asesoramiento Financiero:* El valor profesional se demuestra por la solidez del producto; explica indicadores y simulaciones sin dar recomendaciones personalizadas de compra/venta.

- [x] **Paso 2.2 — Mapa de Conocimiento de la App (`Knowledge Base` Funcional, Financiera y Técnica) *(Aplicado)*:**
  - **Objetivo:** Documentar y estructurar todo el conocimiento interno del agente (`src/services/agentKnowledgeBase.js`) como **insumo contextual dinámico** (nunca como respuestas rígidas o enlatadas) para mantener conversaciones versátiles, fluidas y multi-turno.
  - **Decisiones aprobadas:**
    1. **Estructura en 3 Bloques con 2 Niveles de Profundidad (*Simple por defecto → Quant/IT a pedido*):**
       - *Bloque A (Mapa Funcional):* Inventario completo y modo de uso de `Home`, `Markets` (`Screener`, `Orbital`, `Heatmap`, `Main Tools`, `Analytics`, `Research`), `Portfolio` (`Builder`, `Risk`, `Simulator`), `System` (`Performance`, `FinOps`) y `Guide`.
       - *Bloque B (Diccionario Financiero en 2 Niveles):* Nivel 1 llano y práctico (1–2 oraciones por defecto) y Nivel 2 matemático/cuantitativo a demanda (`CVaR 99%`, `Sharpe/Sortino`, `OLS`, `Brinson-Fachler`, `Markov`, `Kelly`, `Isolation Forest P-06`, `ENB`).
       - *Bloque C (Ficha Técnica `P-01`..`P-13` y `FinOps`):* Rol de cada uno de los 13 módulos, topología DAG (GitHub Actions + GCP Cloud Run + BigQuery + Supabase) y arquitectura *Scale-to-Zero* (`~$0.95/mes`).
    2. **Versatilidad Conversacional Real (Cero Respuestas Enlatadas):**
       - *Contexto, no plantillas fijas:* Los 3 bloques alimentan al motor como hechos verificados que se combinan con la pregunta puntual del usuario y los datos en vivo.
       - *Memoria Multi-turno:* El agente mantiene el hilo de la charla (si el usuario pregunta por un concepto y luego repregunta *"¿y cómo afecta eso a mi cartera si sumo BTC?"*, cruza el concepto previo con su cartera real).
       - *Motor Híbrido Dinámico:* Conexión a LLM con *system prompt* estricto + sintetizador local dinámico que ensambla respuestas a medida cruzando intención, historial de charla y métricas en tiempo real.

- [x] **Paso 2.3 — Conciencia de Datos en Vivo (`Live Context Reader`) *(Aplicado)*:**
  - **Objetivo:** Conectar al agente (en modo 100% lectura, sin operar la UI) con una foto instantánea (`liveSnapshot`) de lo que el usuario está viendo en pantalla en cualquier sección de la app.
  - **Decisiones aprobadas:**
    1. **Ubicación activa:** Vista principal (`Home`, `Markets`, `Portfolio`, `System`, `Guide`) y sub-pestaña activa.
    2. **Estado en `Markets`:** Filtro activo del Screener (clase de activo o `★ Watchlist`), resumen de las 4 tarjetas KPI, lista de favoritos marcados con `★`, y métricas completas del activo abierto en `Analytics` / `Research` (ticker, precio, cambio 24h, ventana `1m`..`ALL`, `RSI`, score `P-06`, regresión `OLS` y `Nota Compuesta`).
    3. **Estado en `Portfolio`:** Activos y pesos `%` de la cartera activa, `CAGR`, `Sharpe`, `VaR 95% / CVaR 99%`, `Max Drawdown`, `ENB` y activo en prueba dentro del simulador *What-If*.
    4. **Estado en `System`:** Módulo seleccionado (`P-01`..`P-13`), estado de salud (`11/11 PASS`), latencia `p50/p95` y costo mensual `FinOps` (`~$0.95/mes`).

- [x] **Paso 2.4 — Interfaz Global Unificada y Motor Multilingüe *(Aplicado)*:**
  - **Objetivo:** Llevar el componente del agente a nivel global ([`src/App.jsx`](../src/App.jsx)) reemplazando el cajón aislado de `Portfolio`, asegurando persistencia de charla entre vistas y fluidez en los 56 idiomas.
  - **Decisiones aprobadas:**
    1. **Agente Único Global:** Se abre desde el botón de la esquina superior derecha en [`src/App.jsx`](../src/App.jsx); se retira el botón duplicado de `Portfolio` y la conversación se mantiene viva al navegar entre pestañas.
    2. **Estética Limpia (`V010`):** Panel lateral derecho discreto con las 4 opciones iniciales arriba, el hilo de conversación en el centro y el input abajo, sin botones de acción que alteren la interfaz.
    3. **Multilingüe Real (56 Idiomas):** Responde en el idioma seleccionado en la app (`currentLang`) o en el idioma en que le escriba el usuario, manteniendo versatilidad y datos en vivo en todos los idiomas.

---

## 4. Fase 3 — Estudio y Diseño de Outputs / Exportables por Audiencia (De Menor a Mayor)

El objetivo de esta fase es estudiar **qué resultados concretos (outputs) podría querer llevarse cada uno de los 5 perfiles** luego de usar una vista o conversar con el agente, en qué formato les aporta más valor (**imágenes/snapshots `PNG`/`SVG`, tablas `CSV`/`Excel`, especificaciones `JSON` o resúmenes `Markdown`/imprimibles**) y cómo ofrecerlos de forma limpia y no intrusiva.

### 4.1. Matriz Preliminar de Outputs Potenciales por Perfil y Vista

| Perfil | ¿Qué se querría llevar de la app? | Formatos Ideales | Vistas de Origen |
| :--- | :--- | :--- | :--- |
| **1. Curioso / Aprendiz** | • Ficha visual de un activo con su gráfico y explicación simple.<br>• Síntesis o glosario de una conversación con el Agente. | • **Imagen (`PNG`)** lista para guardar/compartir.<br>• **Texto / Markdown** copiable del chat. | `Markets > Analytics`, `Guide`, `Agente Global` |
| **2. Inversor Individual / Principiante** | • Tabla de su **Cartera Armada** (activos, pesos `%`, capital `$`, retorno y riesgo).<br>• Tabla de su **Watchlist** comparada.<br>• Captura visual de su distribución y rendimiento histórico. | • **Tabla (`CSV` / `Excel`)**.<br>• **Imagen (`PNG`)** del estado de su cartera. | `Portfolio > Builder`, `Markets > Screener (Watchlist)` |
| **3. Profesional Quant** | • Series de tiempo históricas del gráfico activo (`1m` a `ALL`).<br>• Matrices de riesgo (Correlaciones Normal vs. Estrés, Atribución de Brinson, Escenarios de Estrés, Dimensionamiento de Kelly).<br>• Gráfico técnico/cuantitativo en alta resolución. | • **Datos tabulares (`CSV` / `JSON`)**.<br>• **Gráfico (`PNG` / `SVG`)**. | `Markets > Analytics & Research`, `Portfolio > Risk & Simulator` |
| **4. Profesional IT** | • Especificación técnica de contratos de datos (`Schema Contracts`) y topología de los módulos `P-01` a `P-13`.<br>• Historial de corridas/latencias (`p50/p95`) y logs filtrados.<br>• Tabla de costos y cuotas cloud (`FinOps ~$0.95/m`). | • **Especificación (`JSON` / `CSV` / `Markdown`)**. | `System > Performance & FinOps` |
| **5. Evaluador de RRHH** | • **Ficha Ejecutiva / Resumen del Proyecto (One-Pager)** con el alcance funcional, arquitectura de 13 repositorios, métricas FinOps y stack tecnológico para compartir con el equipo contratante. | • **Resumen Ejecutivo (`Markdown` / Vista imprimible `PDF` / `PNG`)**. | `Home`, `Guide`, `System`, `Agente Global` |

### Micro-Pasos de la Fase 3

- [x] **Paso 3.1 — Estudio y Selección de los 6 Outputs Prioritarios *(Definido)*:**
  - **Objetivo:** Concentrar las exportaciones en 6 puntos exactos de alto valor sin saturar la interfaz:
    1. **`Markets > Screener`** *(barra de filtros de la tabla)*: Tabla de activos filtrados o `★ Watchlist` con precio, variación, volumen, `RSI` y régimen `P-06` (`CSV`).
    2. **`Markets > Analytics`** *(cabezal del gráfico principal)*: Imagen limpia del gráfico con sus bandas/regresión y diagnóstico al pie (`PNG`) + serie histórica de precios y retornos de la ventana elegida (`CSV`).
    3. **`Portfolio > Builder`** *(cabezal de `Portfolio Holdings`)*: Tabla de la cartera armada con tickers, pesos `%`, monto `$` y KPIs (`CSV`) + snapshot visual del resumen de cartera (`PNG`).
    4. **`Portfolio > Risk`** *(cabezal superior de `Risk`)*: Reporte cuantitativo con matriz de correlaciones Normal vs. Estrés, atribución de Brinson y escenarios de estrés histórico (`CSV` / `JSON`).
    5. **`System` (`Performance` & `FinOps`)** *(cabezal derecho)*: Ficha técnica de arquitectura de los 13 módulos (`P-01`..`P-13`), SLAs (`p50/p95`), contratos de datos y desglose de costos cloud `~$0.95/mes` (`MD` / `JSON`).
    6. **`Agente Guía Global`** *(cabezal del chat)*: Acción de copiar o descargar la conversación (`MD` / Copiar) para guardar análisis o explicaciones.
- [x] **Paso 3.2 — Diseño de UX/UI para Exportación Minimalista (`V010 Ghost`) *(Definido)*:**
  - **Objetivo:** Integrar las acciones sin ruido visual mediante botones de texto monoespaciado discreto (`9px`, gris tenue que se ilumina en hover: `↓ CSV`, `↓ PNG`, `↓ MD`, `↓ JSON`) ubicados únicamente al final de los encabezados existentes, generando nombres de archivo automáticos con contexto y fecha (ej. `portfolio-holdings-2026-11-06.csv` o `analytics-NVDA-1Y.png`).
- [x] **Paso 3.3 — Especificación del Generador de Tablas y Datos (`CSV` / `JSON` / `Markdown`) *(Definido)*:**
  - **Objetivo:** Construir un módulo liviano del lado del cliente (`src/utils/exportService.js`) que formatee y descargue instantáneamente las tablas y fichas técnicas de los puntos 1, 2, 3, 4, 5 y 6 sin depender de servidores externos.
- [x] **Paso 3.4 — Especificación de Capturas Visuales (`PNG` / Snapshots) *(Definido)*:**
  - **Objetivo:** Generar snapshots limpios en alta resolución (`PNG` con fondo oscuro `#000000` institucional) del gráfico de `Analytics` y del resumen de cartera en `Portfolio > Builder`.

---

## 5. Fase 4 — Selección Masiva de Watchlist (`★` en 1 Clic) y Segundo Menú de Filtros por Características

> Reservado para las etapas finales (previo al cierre de identidad), para potenciar la experiencia de descubrimiento y armado rápido de seguimiento en `Markets`.

- [x] **Paso 4.1 — Definición de Características del Segundo Menú de Filtros *(Definido)*:**
  - **Ubicación:** Segunda fila de filtros justo debajo de la barra principal de clases de activo en `Markets > Screener`.
  - **A. Características Generales (disponibles siempre, incluso en `ALL`):**
    - `Todos` *(por defecto)* | `Suben Hoy (>0%)` | `Bajan Hoy (<0%)` | `Impulso Comprador (RSI > 60)` | `Sobreventa (RSI < 40)` | `Volumen Inusual (Z > 1.5σ)` | `Movimiento Normal (P-06)` | `Atípico / Anomalía (P-06)`.
  - **B. Características Específicas según la Clase de Activo seleccionada arriba:**
    - *`EQUITIES`:* `Mega-Cap & Tech` | `Finanzas & Industria` | `Consumo & Salud` | `ADRs & Global`.
    - *`FX CURRENCIES`:* `G10 Majors` | `Emergentes & LatAm` | `Divisas Asiáticas`.
    - *`RATES & US TREASURIES`:* `Corto Plazo (≤2Y)` | `Tramo Medio (5Y–10Y)` | `Largo Plazo (20Y–30Y)`.
    - *`CRYPTO`:* `Layer 1 Majors (BTC/ETH/SOL)` | `DeFi & Infraestructura` | `Alta Volatilidad`.
    - *`COMMODITIES`:* `Metales Preciosos` | `Energía (Petróleo/Gas)` | `Industriales & Agro`.
    - *`ETFs & INDICES` / `DERIVATIVES`:* `Índices Amplios (SPX/NDX)` | `Sectoriales & Temáticos` | `Renta Fija & Volatilidad`.
- [x] **Paso 4.2 — Acción de 1 Solo Clic (`★ Marcar / Desmarcar todos los filtrados`) *(Definido)*:**
  - **Ubicación y comportamiento:** En el extremo derecho del segundo menú de filtros, un botón dinámico que actúa sobre los `{N}` activos resultantes del filtro actual:
    - Si aún no están todos marcados: `[ ★ Sumar los {N} filtrados a Watchlist ]` (marca todos de 1 clic).
    - Si ya están todos marcados (o dentro de `★ WATCHLIST`): `[ ☆ Quitar estrella a los {N} filtrados ]` (desmarca todos de 1 clic).

---

## 6. Fase 5 — Nombre e Identidad Final de la Aplicación (Al Final)

> Tal como definimos, el nombre se decidirá al final del recorrido, cuando la personalidad de la plataforma haya decantado por completo.

- [ ] **Paso 5.1 — Exploración y Elección del Nombre Definitivo:**
  - Revisar la plataforma ya pulida con las Fases 1 a 4 completas y elegir el nombre que mejor sintetice su esencia.
- [ ] **Paso 5.2 — Integración del Nombre en la App y en los Outputs:**
  - Reemplazar `TBD` en [`index.html`](../index.html), cabeceras, guía de usuario, presentación del agente y pie/marca de agua de las imágenes y tablas exportadas.

---

## 7. Registro de Iteraciones y Decisiones

| Fecha | Paso | Estado | Resumen de Decisión / Avance |
| :---: | :--- | :---: | :--- |
| 2026-11-05 | **Definición Base** | `[x] Completado` | Se fijaron los 5 perfiles (*Curioso/Aprendiz, Inversor Individual/Principiante, Profesional Quant, Profesional IT, Evaluador de RRHH*), el rol del Agente como guía conversacional puro en toda la app (sin botones que operen la UI), el nombre para el final y la metodología iterativa de menor a mayor. |
| 2026-11-06 | **Fase 3 (Outputs)** | `[x] Incorporado al Plan` | Se sumó la Fase 3 dedicada al estudio e implementación iterativa de los outputs que cada perfil puede querer llevarse de la app (imágenes/gráficos, tablas CSV/JSON, fichas ejecutivas). |
| 2026-11-06 | **Paso 1.1** | `[x] Definido` | Se acordó: (1) Subtítulo conceptual en `Home` sin número de activos, (2) Tooltips ultra-sencillos sin contaminación visual, y (3) Bloque *"¿Qué buscás?"* en `Guide` con links directos para cada uno de los 5 perfiles. |
| 2026-11-06 | **Paso 1.2** | `[x] Definido` | Se definió cómo aplicar los 4 patrones reutilizando los renglones y barras que ya existen en la UI sin agregar cajas ni ruido visual + **Regla estricta de aplicar 1 solo paso a la vez bajo supervisión**. |
| 2026-11-06 | **Fase 4 (Watchlist Bulk)** | `[x] Incorporado al Plan` | Se anotó para el tramo final el segundo menú de filtros por características (generales y propias de cada clase de activo) con botón de 1 clic para agregar/quitar la estrella (`★`) a múltiples activos a la vez. |
| 2026-11-06 | **Paso 1.4 (Guide)** | `[x] Definido` | Se definieron los 5 textos en primera persona y los links directos (a la Guía y a la app en vivo) del bloque *"¿Qué buscás hoy?"* en `Guide > Home`. |
| 2026-11-06 | **Paso 1.5 (System)** | `[x] Definido` | Se definieron los 3 ajustes en `System` (Topología DAG + Scaling en el bloque de contrato, `11/11 Pipelines PASS • 0 Schema Drift` en logs y explicación de 1 línea de *Scale-to-Zero* en `FinOps`). |
| 2026-11-06 | **Paso 1.6 (Markets)** | `[x] Definido` | Se definieron los textos del 3er renglón de las 4 tarjetas KPI del Screener, la línea inferior bilingüe (humano + Quant) en `Analytics` y el subtítulo de `Research`. |
| 2026-11-06 | **Paso 1.7 (Portfolio)** | `[x] Definido` | Se definieron los textos del 3er renglón de las 6 tarjetas KPI de `Builder`, los 3 Presets de cartera (*Conservadora, Balanceada, Quant*), las traducciones en `Risk` (*Stress 2008* y *Régimen Markov*) y las etiquetas guía del Criterio de Kelly en `Simulator`. **Fase 1 100% definida.** |
| 2026-11-06 | **Paso 2.1 (Agente)** | `[x] Definido` | Se definió ubicar el botón en la esquina superior derecha, con saludo mínimo de 1 línea, 4 opciones predefinidas con respuestas cortas centradas 100% en el producto (dónde ver cada cosa) y *guardrails* estrictos de alcance (*Scope Lock*). |
| 2026-11-06 | **Paso 2.2 (Agente)** | `[x] Definido` | Se definió la Base de Conocimiento en 3 bloques (Funcional, Financiero en 2 niveles y Técnico `P-01`..`P-13`/FinOps) operando como contexto dinámico con memoria multi-turno para garantizar versatilidad conversacional real (sin respuestas cerradas/enlatadas). |
| 2026-11-06 | **Paso 2.3 y 2.4 (Agente)** | `[x] Definido` | Se definió el `liveSnapshot` en modo lectura para todas las vistas (`Markets`, `Portfolio`, `System`) y la interfaz global única desde la esquina superior derecha con persistencia entre pestañas y soporte fluido en 56 idiomas. **Fase 2 100% definida.** |
| 2026-11-06 | **Fase 3 (Outputs)** | `[x] Definido` | Se definieron los 6 puntos exactos de exportación (`Screener CSV`, `Analytics PNG/CSV`, `Portfolio Builder CSV/PNG`, `Portfolio Risk CSV/JSON`, `System MD/JSON` y `Agente MD/Copiar`) con botones de texto fantasma (`9px` `↓ CSV` / `↓ PNG`) integrados en los encabezados existentes. **Fase 3 100% definida.** |
| 2026-11-06 | **Fase 4 (Watchlist Bulk)** | `[x] Definido` | Se definió el segundo menú de filtros en `Markets > Screener` (características generales + específicas por clase de activo) y el botón dinámico de 1 clic (`★ Sumar / ☆ Quitar los {N} filtrados`). **Fases 1 a 4 100% definidas.** |
| 2026-11-06 | **Ejecución Paso 1.3** | `[x] Completado` | Aplicado y aprobado el subtítulo conceptual en `Home` ([`uiStrings56.js`](../src/data/i18n/uiStrings56.js)) y el estilo unificado de texto puro flotante (`pure-text`) con las leyendas definitivas en [`HoverTooltip.jsx`](../src/components/HoverTooltip.jsx), [`HeaderBar.jsx`](../src/components/HeaderBar.jsx) y [`FooterBar.jsx`](../src/components/FooterBar.jsx). |
| 2026-11-06 | **Ejecución Paso 1.4** | `[x] Completado` | Aplicado y aprobado en [`UserGuideView.jsx`](../src/components/UserGuideView.jsx) (`Guide > Home`) el bloque *"¿Por dónde querés empezar?"* con los 5 objetivos funcionales implícitos y botones tipo cápsula (`soft-pill`) sin flechas. |
| 2026-11-06 | **Ejecución Paso 1.5** | `[x] Completado` | Aplicados y aprobados en [`ObservabilityView.jsx`](../src/components/ObservabilityView.jsx) (`System`) los 3 puntos: `// Pipeline Topology (DAG):` y `// Scaling & Resilience:` en el bloque de contrato, `11/11 Pipelines PASS • 0 Schema Drift` en la cabecera de logs, y la bajada de 1 línea de *Scale-to-Zero & Free-Tier Arbitrage* en `FinOps`. |
| 2026-11-06 | **Jerarquía de Navegación** | `[x] Completado` | Eliminado de [`HeaderBar.jsx`](../src/components/HeaderBar.jsx) el botón redundante `← Back to Dashboard` en las vistas principales (`System` y `Guide`), homogeneizando la regla en toda la app: las vistas de nivel 1 se navegan desde las barras fijas superior/inferior y sólo los subniveles reales (como `Markets` Nivel 2 `Analytics`/`Research` → Nivel 1 `Screener`) muestran botón de retorno (`← Todos los Mercados`). |
| 2026-11-06 | **Ejecución Paso 1.6** | `[x] Completado` | Aplicados y aprobados en [`MarketAnomaliesView.jsx`](../src/components/MarketAnomaliesView.jsx) (`Markets`): (1) lecturas interpretativas en el 3er renglón de las 4 tarjetas KPI del `Screener`, (2) línea de diagnóstico al pie de `Analytics` con lectura clara primero y respaldo técnico `(P-06 • Vol 20d • Volatilidad/Spread)` entre paréntesis + sincronización en vivo de la etiqueta `(NORMAL/ELEVATED/ATYPICAL)` en la tarjeta `P-06 ANOMALY`, y (3) fijada la posición central de `Analytics | Research` y homologadas las medidas de las 3 tarjetas de `Research` con las de `Analytics`. |
| 2026-11-06 | **Ejecución Paso 1.7** | `[x] Completado` | Aplicados y aprobados en [`PortfolioVista1Builder.jsx`](../src/components/portfolio/PortfolioVista1Builder.jsx), [`PortfolioVista2Risk.jsx`](../src/components/portfolio/PortfolioVista2Risk.jsx) y [`PortfolioVista3AdHoc.jsx`](../src/components/portfolio/PortfolioVista3AdHoc.jsx): (1) 3er renglón interpretativo en las 6 tarjetas KPI de `Builder`, (2) 3 Presets de 1 clic (`Conservadora`, `Balanceada`, `Quant`) + `1/N` y `100%`, (3) lecturas claras en `STRESS CRASH 2008` y `RÉGIMEN MARKOV ACTUAL` en `Risk`, (4) etiquetas guía en `Tamaño Kelly` dentro de `Simulator`, y (5) altura unificada (`84px`) de las 6 tarjetas KPI entre `Builder`, `Risk` y `Simulator`. **Fase 1 100% completada.** |
| 2026-11-06 | **Ejecución Fase 2 (Agente)** | `[x] Aplicado` | Implementado el Agente Guía Global en [`src/services/agentKnowledgeBase.js`](../src/services/agentKnowledgeBase.js), [`src/components/GlobalAgentDrawer.jsx`](../src/components/GlobalAgentDrawer.jsx), [`src/components/HeaderBar.jsx`](../src/components/HeaderBar.jsx) y [`src/App.jsx`](../src/App.jsx) (y retirado el botón local `Copilot` de [`AgentCommitteeView.jsx`](../src/components/AgentCommitteeView.jsx)): botón `Agent` en esquina superior derecha con saludo mínimo de 1 línea, 4 preguntas rápidas orientadas al producto, base de conocimiento en 2 niveles (llano por defecto + matemático/técnico a pedido con memoria multi-turno), lectura en vivo (`liveSnapshot`) de la pantalla activa y `Scope Lock`. Pendiente de supervisión antes de pasar a la Fase 3 (Outputs). |

