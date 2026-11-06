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

- [ ] **Paso 1.3 — Vista `Home` ([`src/components/HomeStage.jsx`](../src/components/HomeStage.jsx)) y Navegación (`HeaderBar`/`FooterBar`):**
  - **Objetivo:** Aplicar el nuevo subtítulo acordado y validar la estética ultra-simple de los tooltips de navegación.

- [x] **Paso 1.4 — Vista `Guide` ([`src/components/UserGuideView.jsx`](../src/components/UserGuideView.jsx)):**
  - **Objetivo:** Incorporar el bloque **"¿Qué buscás hoy? Elegí tu punto de partida:"** justo debajo de los 2 párrafos introductorios de `Guide > Home`, con tono en primera persona y doble link directo (al capítulo de la Guía y a la pantalla en vivo de la app):
    1. **Curioso / Aprendiz:** *"Quiero entender desde cero cómo se mueven los mercados y qué significa cada indicador sin chocar con jerga compleja."* → `[Ver capítulo Mercados en esta Guía →]` · `[Explorar el Radar Visual en vivo (Markets) →]`
    2. **Inversor Individual / Principiante:** *"Quiero analizar activos concretos, conocer qué factores empujan su precio y armar o probar mi propia cartera midiendo el riesgo en simple."* → `[Ir al Constructor de Cartera (Portfolio) →]` · `[Investigar Factores y Noticias (Research) →]`
    3. **Profesional Quant:** *"Busco instrumental cuantitativo directo: detección de anomalías, superficies de volatilidad y curvas, atribución de Brinson, estrés histórico y Criterio de Kelly."* → `[Abrir Estación Analytics →]` · `[Auditar Riesgo, Correlaciones y Stress (Portfolio > Risk) →]`
    4. **Profesional IT:** *"Quiero evaluar la arquitectura real detrás de la app: los 11 pipelines serverless (P-01 a P-13), contratos de datos, latencias HTTP en vivo y cómo opera todo por ~$0.95/mes."* → `[Abrir Telemetría e Infraestructura (System > Performance) →]` · `[Ver Arquitectura de Costos (FinOps) →]`
    5. **Evaluador de RRHH:** *"Tengo pocos minutos para evaluar el proyecto: quiero ver qué problema resuelve y qué nivel de producto, datos en tiempo real, IA, idiomas (56) e ingeniería cloud demuestra."* → `[Reproducir el Video Resumen aquí abajo ↓]` · `[Ver Tablero de Cartera (Portfolio) →]` · `[Ver Ingeniería y Costos (System) →]`

- [x] **Paso 1.5 — Vista `System` ([`src/components/ObservabilityView.jsx`](../src/components/ObservabilityView.jsx)):**
  - **Objetivo:** Adaptar `Performance` y `FinOps` específicamente para el **Profesional IT** y como evidencia de ingeniería para el **Evaluador de RRHH**, sin agregar cajas nuevas:
    1. **En `Performance` (Bloque de especificación `// ...` del módulo seleccionado):**
       - Sumar `// Pipeline Topology (DAG):` indicando de qué módulos recibe datos y qué pantalla de la app alimenta (conectando backend con UI).
       - Sumar `// Scaling & Resilience:` explicando el perfil *Scale-to-Zero (`min=0`)* y el snapshot en caché ante arranque en frío.
    2. **En `Performance` (Cabecera de `Live Telemetry & Logs`):**
       - Sumar el indicador global `11/11 Pipelines PASS • 0 Schema Drift`.
    3. **En `FinOps` (Bajada del encabezado de cuotas):**
       - Sumar 1 oración concisa explicando el diseño *Scale-to-Zero & Free-Tier Arbitrage* (por qué el cómputo en reposo cuesta `$0.00` y el gasto total queda acotado a `~$0.95/mes`).

- [ ] **Paso 1.6 — Vista `Markets` ([`src/components/MarketAnomaliesView.jsx`](../src/components/MarketAnomaliesView.jsx)):**
  - **Objetivo:** Lograr que `Screener` (`Table`, `Orbital`, `Heatmap`, `Main Tools`) y el Nivel 2 (`Analytics` y `Research`) sirvan tanto al **Profesional Quant** (datos duros) como al **Inversor Principiante / Curioso** (interpretación clara de qué significa el régimen o los factores).

- [ ] **Paso 1.7 — Vista `Portfolio` ([`src/components/AgentCommitteeView.jsx`](../src/components/AgentCommitteeView.jsx) y Vistas 1, 2, 3):**
  - **Objetivo:** Afinar los mensajes de `Builder`, `Risk` y `Simulator` para que un **Inversor Principiante** entienda de un vistazo si su cartera está sana o concentrada, mientras el **Profesional Quant** conserva todo el instrumental de Brinson, VaR/CVaR, estrés histórico y Kelly.

---

## 3. Fase 2 — Agente Guía Global en Toda la App (De Menor a Mayor)

### Principios de Diseño Acordados para el Agente
1. **Guía Puro y Conversacional (Sin Botones que Operen la UI):** El agente **no** modifica la pantalla ni incluye botones que ejecuten acciones por el usuario. Su valor está en **saber absolutamente todo sobre la app y su contenido** para guiar, explicar y responder con precisión.
2. **Especialista en "¿Por dónde empiezo?":** Dado que lo primero que suele hacer un usuario nuevo (un **Evaluador de RRHH**, un **Curioso/Aprendiz**, un **Inversor** o un **Profesional IT**) es abrir el chat y preguntar *"¿Qué es esta app?"*, *"¿Por dónde empiezo?"* o *"¿Qué puedo hacer acá?"*, el agente debe saber guiarlo paso a paso según su perfil e intereses.
3. **Omnipresente y Consciente del Contexto:** Disponible en toda la app (no sólo en `Portfolio`), sabiendo en qué pantalla está el usuario y qué datos reales se están mostrando en ese momento.
4. **Multilingüe Real (56 Idiomas):** Capaz de conversar naturalmente con el usuario en cualquiera de los idiomas de la plataforma (o en el idioma en que le escriban), superando las 4 respuestas enlatadas actuales de [`committeeService.js`](../src/services/committeeService.js).

### Micro-Pasos de la Fase 2

- [ ] **Paso 2.1 — Diseño del Flujo de Bienvenida y "¿Por dónde empiezo?":**
  - **Objetivo:** Definir cómo saluda el agente y cómo orienta a cada uno de los **5 perfiles** cuando le preguntan qué hacer, por dónde empezar o qué secciones recorrer según lo que buscan.

- [ ] **Paso 2.2 — Mapa de Conocimiento de la App (`Knowledge Base` Funcional, Financiera y Técnica):**
  - **Objetivo:** Documentar y estructurar todo el conocimiento interno del agente sobre:
    1. **Mapa de la App:** Qué hay en `Home`, `Markets` (`Screener`, `Orbital`, `Heatmap`, `Main Tools`, `Analytics`, `Research`), `Portfolio` (`Builder`, `Risk`, `Simulator`), `System` (`Performance`, `FinOps`) y `Guide`, y cómo usar cada herramienta.
    2. **Conocimiento Financiero en 2 Niveles:** Cómo explicar cualquier métrica o gráfico de la app tanto a un **Curioso / Inversor Principiante** como a un **Profesional Quant**.
    3. **Conocimiento de Ingeniería (IT & RRHH):** Cómo explicar la arquitectura de los 13 módulos (`P-01` a `P-13`), el stack tecnológico, el diseño FinOps (`~$0.95/mes`) y el valor profesional del proyecto.

- [ ] **Paso 2.3 — Conciencia de Datos en Vivo (`Live Context Reader`):**
  - **Objetivo:** Conectar al agente (en modo lectura) con el estado real de la sesión: vista actual, activo seleccionado (entre los 213 activos), ventana temporal (`1m` a `ALL`), cartera armada por el usuario y estado de los módulos de `System`, para que dé diagnósticos reales y personalizados.

- [ ] **Paso 2.4 — Interfaz Global Unificada y Motor Multilingüe:**
  - **Objetivo:** Llevar el componente del agente a nivel global ([`src/App.jsx`](../src/App.jsx)) reemplazando el cajón aislado de `Portfolio`, asegurando que sea discreto, accesible desde cualquier vista y fluido en todos los idiomas.

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

- [ ] **Paso 3.1 — Estudio y Selección de Outputs Prioritarios:**
  - **Objetivo:** Evaluar vista por vista (`Markets`, `Portfolio`, `System`, `Guide` y `Agente Global`) cuáles de estos outputs aportan valor real y cuáles descartar para mantener la simplicidad de la interfaz.
- [ ] **Paso 3.2 — Diseño de UX/UI para Exportación Minimalista (`V010 Ghost`):**
  - **Objetivo:** Definir dónde y cómo aparece la opción de exportar/descargar (ej. un ícono discreto de descarga/captura en la cabecera de las tablas o gráficos clave, o acción de copiar/exportar respuesta en el Agente) sin recargar la pantalla.
- [ ] **Paso 3.3 — Implementación de Exportación de Tablas y Datos (`CSV` / `JSON` / `Markdown`):**
  - **Objetivo:** Construir el generador modular para descargar tablas limpias (Screener/Watchlist, Holdings de Cartera, Matrices de Riesgo/Kelly, FinOps/Logs de Sistema y respuestas tabulares del Agente).
- [ ] **Paso 3.4 — Implementación de Capturas Visuales (`PNG` / Snapshots de Gráficos y Tarjetas):**
  - **Objetivo:** Permitir que el usuario descargue una imagen limpia y bien formateada del gráfico o resumen de cartera que está analizando.

---

## 5. Fase 4 — Selección Masiva de Watchlist (`★` en 1 Clic) y Segundo Menú de Filtros por Características

> Reservado para las etapas finales (previo al cierre de identidad), para potenciar la experiencia de descubrimiento y armado rápido de seguimiento en `Markets`.

- [ ] **Paso 4.1 — Definición de Características del Segundo Menú de Filtros:**
  - **Características Transversales / Generales (aplicables a todos los activos):** Ej. *Régimen Normal vs. Anomalía (`P-06`)*, *Momentum (`RSI` alcista / sobreventa)*, *Volumen elevado (`Z-Score`)*, *Variación 24h positiva/negativa*.
  - **Características Específicas según la Clase de Activo seleccionada:**
    - *Equities:* Mega-Cap / Tech / Semiconductores / Alto Dividendo / ADR.
    - *FX Currencies:* G10 Majors / Emergentes (LatAm/Asia) / Carry Spread Positivo.
    - *Rates & US Treasuries:* Tramo Corto (`≤2Y`) / Tramo Medio (`5Y-10Y`) / Tramo Largo (`20Y-30Y`).
    - *Crypto:* Layer 1 / DeFi & Infraestructura / Alta Liquidez.
    - *Commodities:* Metales Preciosos / Energía / Industriales & Agro.
    - *ETFs & Indices / Derivatives:* Índices Amplios / Sectoriales / Volatilidad & Opciones.
- [ ] **Paso 4.2 — Acción de 1 Solo Clic (`★ Marcar / Desmarcar todos los filtrados`):**
  - Permitir que el usuario agregue (o quite) la estrella de favoritos (`Watchlist`) a **todos los activos resultantes del filtro activo con un único clic**, facilitando pasar ese grupo directo a `Watchlist` o a `Portfolio`.

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
| — | **Paso 1.6 (Markets)** | `[~] En definición` | Definir las lecturas claras en las tarjetas KPI del Screener y en la línea inferior de diagnóstico de `Analytics`. |

