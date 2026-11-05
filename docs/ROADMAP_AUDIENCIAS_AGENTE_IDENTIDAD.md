# Hoja de Ruta Iterativa: Audiencias, Agente Guía Global e Identidad de la App

> **Metodología de Trabajo:** De menor a mayor, paso a paso y de forma 100% iterativa. Ninguna etapa se implementa de golpe: cada micro-paso se analiza, se decide el criterio/contenido exacto, se valida en la app y recién entonces se pasa al siguiente.

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

- [ ] **Paso 1.1 — Diagnóstico y Mapa de Contacto Inicial (Punto de Partida):**
  - **Objetivo:** Analizar qué experimenta hoy cada uno de los 5 perfiles en los primeros 15 segundos al abrir la app (`Home` + barra de navegación + `Footer`) y definir qué piezas de orientación faltan o deben afinarse.
  - **Entregable de análisis:** Propuesta concreta de micro-mensajes para la entrada de la app antes de tocar código.

- [ ] **Paso 1.2 — Vista `Home` ([`src/components/HomeStage.jsx`](../src/components/HomeStage.jsx)):**
  - **Objetivo:** Ajustar el mensaje principal y la bajada de `Home` para que reciba con claridad al **Evaluador de RRHH**, al **Curioso/Aprendiz** y a los perfiles **Inversor / Quant / IT**.
  - **Qué decidiremos aquí:** El texto exacto del título/subtítulo y si sumamos una pista sutil de orientación inicial.

- [ ] **Paso 1.3 — Vista `Guide` ([`src/components/UserGuideView.jsx`](../src/components/UserGuideView.jsx)):**
  - **Objetivo:** Revisar la estructura del `Guide` para que sea la puerta de entrada ideal del **Público General (Curioso/Aprendiz)**, del **Inversor Principiante** y del **Evaluador de RRHH**, manteniendo toda la matemática pesada de **Quant** y el detalle de **IT** dentro de los botones `Deep Dive`.
  - **Qué decidiremos aquí:** Ajustes en la introducción o secciones de la guía para que oriente a cada perfil sobre cómo aprovechar la plataforma.

- [ ] **Paso 1.4 — Vista `System` ([`src/components/ObservabilityView.jsx`](../src/components/ObservabilityView.jsx)):**
  - **Objetivo:** Adaptar `Performance` y `FinOps` específicamente para el **Profesional IT** (y como evidencia de ingeniería para el **Evaluador de RRHH**).
  - **Qué decidiremos aquí:** Qué metadatos de ingeniería (topología del pipeline, SLOs, contratos de datos, explicación del patrón *Scale-to-Zero & Free-Tier Arbitrage*) muestran mejor la solidez técnica sin ensuciar la vista.

- [ ] **Paso 1.5 — Vista `Markets` ([`src/components/MarketAnomaliesView.jsx`](../src/components/MarketAnomaliesView.jsx)):**
  - **Objetivo:** Lograr que `Screener` (`Table`, `Orbital`, `Heatmap`, `Main Tools`) y el Nivel 2 (`Analytics` y `Research`) sirvan tanto al **Profesional Quant** (datos duros) como al **Inversor Principiante / Curioso** (interpretación clara de qué significa el régimen o los factores).
  - **Qué decidiremos aquí:** Dónde ubicar las lecturas interpretativas (ej. línea de síntesis inferior o subtítulos de tarjetas) para que eduquen sin estorbar.

- [ ] **Paso 1.6 — Vista `Portfolio` ([`src/components/AgentCommitteeView.jsx`](../src/components/AgentCommitteeView.jsx) y Vistas 1, 2, 3):**
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

## 5. Fase 4 — Nombre e Identidad Final de la Aplicación (Al Final)

> Tal como definimos, el nombre se decidirá al final del recorrido, cuando la personalidad de la plataforma (con sus mensajes por audiencia, su nuevo Agente Global y sus capacidades de output) haya decantado por completo.

- [ ] **Paso 4.1 — Exploración y Elección del Nombre Definitivo:**
  - Revisar la plataforma ya pulida con las Fases 1, 2 y 3 completas y elegir el nombre que mejor sintetice su esencia.
- [ ] **Paso 4.2 — Integración del Nombre en la App y en los Outputs:**
  - Reemplazar `TBD` en [`index.html`](../index.html), cabeceras, guía de usuario, presentación del agente y pie/marca de agua de las imágenes y tablas exportadas.

---

## 6. Registro de Iteraciones y Decisiones

| Fecha | Paso | Estado | Resumen de Decisión / Avance |
| :---: | :--- | :---: | :--- |
| 2026-11-05 | **Definición Base** | `[x] Completado` | Se fijaron los 5 perfiles (*Curioso/Aprendiz, Inversor Individual/Principiante, Profesional Quant, Profesional IT, Evaluador de RRHH*), el rol del Agente como guía conversacional puro en toda la app (sin botones que operen la UI), el nombre para el final y la metodología iterativa de menor a mayor. |
| 2026-11-06 | **Fase 3 (Outputs)** | `[x] Incorporado al Plan` | Se sumó la Fase 3 dedicada al estudio e implementación iterativa de los outputs que cada perfil puede querer llevarse de la app (imágenes/gráficos, tablas CSV/JSON, fichas ejecutivas). |
| — | **Paso 1.1** | `[~] Próximo paso` | Diagnóstico inicial de qué ve cada uno de los 5 perfiles al entrar a la app y propuesta del primer ajuste en `Home` / orientación general. |

