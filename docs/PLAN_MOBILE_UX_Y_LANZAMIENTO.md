# Plan de Corrección Mobile, UX Global y Preparación para Compartir (`quantlambda.dev`)

---

## 1. Resumen Ejecutivo Punto por Punto (Checklist de Trabajo)

### A. Bugs de UI, Mobile, Modo Claro y Guía (con Auditoría Global en toda la App)
- [x] **1. Menús colapsados en `Mercados > Analytics` y separación estricta con el `HeaderBar`:** Corregir el reordenamiento móvil (`order: -1` y `justify-content: space-between`) en `Mercados > Analytics` que empuja los submenús (`← Todos los Mercados`, `Cambiar activo...`, `Analytics | Research`, `P-06 | 1m 5m...`, `PNG / CSV`) encima del header superior, y auditar todas las vistas para que ninguna sub-barra colapse en pantallas chicas.
- [x] **2. Contraste en Modo Claro (`Divisas FX` y submenús/tablas en toda la app):** Reemplazar los colores pastel hardcodeados (`#BAE6FD` y `#fff`) en las píldoras de subcategorías (`G10 Majors`, `Emergentes & LatAm`, `Divisas Asiáticas`, etc.) y celdas de tablas por variables adaptativas de alto contraste en `[data-mode="light"]`, auditando las 5 secciones principales en Modo Claro.
- [x] **3. Legibilidad del menú de la `Guía` y `HeaderBar` / `FooterBar` siempre visibles sin pisar contenido:** Rediseñar el índice superior móvil de la Guía para que sea limpio y legible, fijar `HeaderBar` y `FooterBar` dentro de un layout `100dvh` con fondo translúcido (`backdrop-filter`) para que jamás se superpongan con tablas o botones, y desactivar en pantallas táctiles los tooltips flotantes que quedan "pegados" (como `"Cambiar a modo oscuro"`).
- [x] **4. Inicio desde arriba (`scroll top = 0`) al cambiar de página en la `Guía` (y en toda la app):** Corregir el reseteo de scroll al pulsar `Siguiente` / `Anterior` o elegir un tema en la Guía para que en móvil scrollee el contenedor real (`.app-main-viewport`), asegurando que cada página nueva arranque siempre desde el principio.
- [x] **5. Limpieza de códigos hexadecimales en `Guía > Palette`:** Quitar los códigos `#10b981` y `#f43f5e` de la viñeta *"Semántica financiera intacta"* dejando únicamente la mención clara de los colores `Verde / Rojo` (y su equivalente en los demás idiomas), y revisar que no haya otros códigos técnicos innecesarios en el texto de la Guía.
- [x] **6. Eliminación del cursor del mouse en el video de la `Guía` y mención del Modo Claro/Oscuro:** Quitar el puntero animado del mouse en `GuideInteractiveVideoStage` (que se desfasa en pantallas móviles/horizontales y es redundante porque cada opción ya se ilumina al mencionarse) y sumar la referencia al selector de **Modo Claro / Oscuro** en la sección `Palette`.
- [x] **7. Cuadro `Telemetría y Logs en Vivo` legible en móvil dentro de `Sistema`:** Mantener la altura compacta (`132px`) en escritorio tal como lo pediste para que entre en una sola pantalla, pero en móvil expandir la caja (`~300px`) y permitir que su cabecera (`Telemetría y Logs en Vivo | 11/11 Pipelines PASS | Sólo P-06 | View All`) se acomode en dos líneas limpias sin aplastarse.
- [x] **8. Colisión del menú `Performance | FinOps` con los botones de descarga (`MD | JSON`) en `Sistema`:** Quitar el posicionamiento absoluto (`position: absolute; right: 4px`) que hace que `MD`, `JSON` y `Refresh` pisen la pestaña `FinOps` en móvil, aplicando el mismo arreglo en `Portafolio` (`Builder | Risk | Simulator` vs. botón `Copilot`).

### B. Preparación para Compartir el Link Público (`https://quantlambda.dev`)
- [x] **9. Tarjeta de Vista Previa Social (Open Graph + Twitter/X Card + Meta Description):** Agregar las etiquetas `og:title`, `og:description`, `og:image`, `og:url` y `twitter:card` en `index.html` junto con una imagen de portada de la terminal para que al compartir el link por **WhatsApp, LinkedIn, Telegram o X** se vea una tarjeta profesional en lugar de un enlace vacío.
- [x] **10. Carga Diferida (`Lazy Loading` + `Code Splitting`) para Celulares:** Separar en `App.jsx` y `vite.config.js` la carga de las vistas pesadas (3D WebGL, `Mercados`, `Portafolio`, `Sistema`, `Guía`) para que el celular descargue primero sólo la pantalla inicial y abra mucho más rápido en redes móviles.
- [x] **11. Compresión `gzip` y Caché de Estáticos en Cloud Run (`nginx.conf`):** Activar compresión `gzip` para bundles JS/CSS/JSON y cabeceras básicas de caché y seguridad en Nginx para reducir el peso de transferencia en un ~70%.

---

## 2. Opinión Técnica sobre la Auditoría de Gemini Argon y los Servicios Externos

### ¿Cómo está la app hoy y por qué Gemini Argon vio un `<div id="root"></div>` vacío?
Tu aplicación está construida como una **SPA (Single Page Application) interactiva en React + Vite** — igual que terminales financieras web como TradingView, Koyfin o dashboards internos de Bloomberg/Datadog.
Cuando un bot de lectura simple (como el crawler que usó Gemini Argon) descarga el HTML inicial sin ejecutar JavaScript, sólo ve el contenedor `<div id="root"></div>`. Para un periódico digital o un blog que vive de posicionar 5.000 artículos en Google eso sería un problema grave; **para una terminal cuantitativa interactiva de portafolio personal, es totalmente normal**.

### ¿Qué cosas de las que mencionó Gemini NO valen la pena (son para otro tipo de producto)?
1. **Reescribir la app a Next.js, Astro o SSR (Server-Side Rendering):** No tiene sentido para este proyecto. Implicaría rearmar toda la arquitectura para que bots lean texto estático, cuando el valor real de `quantlambda.dev` es que una persona entre y use los gráficos, el simulador y la guía en vivo.
2. **Herramientas empresariales de SEO o auditorías exhaustivas (Seobility, Ahrefs, Yellow Lab Tools, WAVE):** Son suites pensadas para e-commerce o sitios corporativos masivos. Usarlas acá te va a llenar de alertas irrelevantes para una app de demostración.

### ¿Qué cosas de las que mencionó Gemini SÍ valen totalmente la pena antes de compartirla?
Hay **3 puntos concretos de muy bajo esfuerzo y altísimo impacto** cuando mandes el link por WhatsApp, LinkedIn o alguien lo abra desde su teléfono:

1. **Open Graph y Meta Tags en [`index.html`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/index.html) (Prioridad Alta):**
   - Hoy, si pegás `https://quantlambda.dev` en un chat de WhatsApp o en un post de LinkedIn, no aparece ni descripción ni imagen en miniatura porque faltan las etiquetas `<meta property="og:..." />`.
   - Agregando 12 líneas en `index.html` y una imagen estática `public/og-preview.png` (1200×630), cualquier chat o red social mostrará una tarjeta visual impecable.
   - **Servicio que sí vale la pena usar (1 minuto, gratis):** `opengraph.xyz` una vez desplegado el cambio para confirmar cómo se ve la tarjeta en WhatsApp/LinkedIn/X.
2. **Code-Splitting / Lazy Loading para Móviles (Prioridad Alta):**
   - Gemini marcó con razón que en un celular la descarga inicial carga de golpe todo el JavaScript de todas las pestañas (incluyendo gráficos 3D/WebGL y diccionarios). Con `React.lazy()` en [`src/App.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/App.jsx), la pantalla de inicio (`Home`) va a cargar en una fracción del tiempo y el resto se descargará a medida que el usuario toque cada sección.
3. **Compresión Gzip en [`nginx.conf`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/nginx.conf) (Prioridad Media-Alta):**
   - Agregar `gzip on;` y cabeceras básicas (`X-Content-Type-Options`, `X-Frame-Options`, caché de assets estáticos) en el `nginx.conf` de tu contenedor Docker lleva 10 minutos y hace que la app vuele en conexiones móviles.

---

## 3. Desarrollo Detallado Punto por Punto y Alcance en Toda la App

### Punto 1: Colapso de menús en `Mercados > Analytics` y separación global con `HeaderBar`
- **Qué pasa hoy (Causa Raíz):**
  1. En [`src/index.css`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/index.css#L588-L604) (`@media (max-width: 980px)`), la clase `.resp-l2-chart-stage` tiene `order: -1` y en [`src/components/MarketAnomaliesView.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/MarketAnomaliesView.jsx#L4964-L4976) `.resp-l2-shell` usa `justifyContent: 'space-between'` con alturas calculadas para escritorio.
  2. Además, las dos sub-barras superiores de `Analytics` (`← Todos los Mercados | Activo | Analytics/Research` y `P-06 | 1m 5m 15m | PNG CSV`) tienen alturas fijas (`height: '28px'`) sin `flex-wrap`, por lo que al achicarse el ancho en el teléfono se aplastan y el bloque entero sube hasta pisar el [`HeaderBar.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/HeaderBar.jsx).
- **Cómo lo vamos a solucionar:**
  - En móvil (`<= 980px`), quitar el `order: -1` que desordena la jerarquía respecto a las barras de navegación, cambiar `height: 28px` por `min-height: 32px` con `flex-wrap: wrap` y `gap: 6px` en las barras de herramientas de `Analytics` y `Research`, y asegurar un flujo vertical limpio: primero la barra de retorno/activo y cambio `Analytics | Research`, luego los controles del gráfico (`1m 5m...`), luego el gráfico con altura mínima garantizada, y debajo los paneles de métricas.
- **Chequeo en toda la app:**
  - Revisar también las sub-barras de `Mercados > Screener`, `Mercados > Research`, `Portafolio > Builder / Risk / Simulator` y `Sistema > Performance / FinOps` para que ninguna barra de segundo o tercer nivel use `height: 28px` rígido sin `flex-wrap` en pantallas móviles.

---

### Punto 2: Submenús ilegibles en Modo Claro (`Divisas FX` y auditoría global de Modo Claro)
- **Qué pasa hoy (Causa Raíz):**
  - En [`src/components/MarketAnomaliesView.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/MarketAnomaliesView.jsx#L2398-L2405), los botones de subcategoría (`activeCategoryTraits`, como `G10 Majors`, `Emergentes & LatAm`, `Divisas Asiáticas` en Divisas, o los filtros equivalentes en Acciones, Tasas, Cripto y Commodities) tienen el color de texto hardcodeado en celeste muy claro (`color: '#BAE6FD'`) pensado para fondo negro. Sobre el fondo claro (`#e8f6ef` / `#f8fafc`), `#BAE6FD` casi desaparece.
  - Además, en [`src/components/MarketAnomaliesView.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/MarketAnomaliesView.jsx#L4405-L4410), las celdas de datos específicos por categoría en la tabla tienen `color: '#fff'` hardcodeado.
  - En la vista previa de `Home` dentro del video de la Guía ([`GuideInteractiveVideoStage.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/guide/GuideInteractiveVideoStage.jsx)), cuando la app está en Modo Claro el texto secundario también pierde contraste.
- **Cómo lo vamos a solucionar:**
  - Reemplazar `#BAE6FD` y `#fff` hardcodeados por variables CSS semánticas (`var(--info-text)` / `var(--text-primary)`) y definir en [`src/index.css`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/index.css) bajo `[data-mode="light"]` un tono azul marino/cobalto oscuro (`#0369a1` / `#0284c7`) con fondo suave (`rgba(2, 132, 199, 0.10)`) y borde nítido (`rgba(2, 132, 199, 0.35)`).
- **Chequeo en toda la app:**
  - Auditar todos los colores hexadecimales claros (`#fff`, `#f8fafc`, `#e2e8f0`, `#bae6fd`, `#93c5fd`, `#cbd5e1`) en `MarketAnomaliesView.jsx`, `AgentCommitteeView.jsx`, `ObservabilityView.jsx`, `UserGuideView.jsx`, `HeaderBar.jsx` y `FooterBar.jsx` probando vista por vista en Modo Claro.

---

### Punto 3: Menú de la `Guía` + `HeaderBar` y `FooterBar` siempre visibles sin pisarse con nada
- **Qué pasa hoy (Causa Raíz):**
  1. **Colisión global con `HeaderBar` y `FooterBar`:** En [`src/App.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/App.jsx#L271-L311), el contenedor usa `100vh` (que en navegadores móviles excede la pantalla visible por la barra de direcciones) y tanto `HeaderBar` como `FooterBar` tienen `position: fixed` con `backgroundColor: 'transparent'`. Cuando cualquier vista hace scroll en móvil (como se ve en tus capturas de `Divisas`, `Guía` y `Sistema`), el texto pasa por detrás de las letras del `HeaderBar` y del `FooterBar`, superponiéndose.
  2. **Tooltip pegado en el Footer (`"Cambiar a modo oscuro"`):** En pantallas táctiles, al tocar el botón de Luna/Sol o Paleta, el componente [`HoverTooltip.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/HoverTooltip.jsx) dispara `onMouseEnter` pero nunca recibe `onMouseLeave`, dejando el cartelito flotando encima del contenido y del footer.
  3. **Menú superior de la Guía en móvil:** En [`src/index.css`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/index.css#L645-L653), `.resp-guide-sidebar` se apila arriba con `max-height: 190px; overflow-y: auto` mostrando todo el árbol desplegado pero cortado a la mitad y con bajo contraste en las etiquetas de grupo.
- **Cómo lo vamos a solucionar:**
  1. **Layout blindado `HeaderBar` / `Main` / `FooterBar`:** Convertir el shell principal en [`src/App.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/App.jsx) e [`index.css`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/index.css) a `height: 100dvh; display: flex; flex-direction: column; overflow: hidden;` donde el área central (`<main className="app-main-viewport">`) ocupe exactamente el espacio entre el Header y el Footer (`flex: 1; min-height: 0; overflow-y: auto`), y darle al `HeaderBar` y `FooterBar` un fondo sólido/translúcido con `backdrop-filter: blur(12px)` fuera de `Home`. Así **es físicamente imposible que el contenido pise al Header o al Footer**.
  2. **Desactivar `HoverTooltip` en dispositivos táctiles:** Detectar `window.matchMedia('(hover: none)')` en [`HoverTooltip.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/HoverTooltip.jsx) para que en celulares no queden carteles flotantes pegados tras tocar un botón.
  3. **Menú móvil de la Guía claro y compacto:** En resoluciones móviles (`<= 980px`), transformar el árbol lateral de [`UserGuideView.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/UserGuideView.jsx) en una barra desplegable/acordeón de alto contraste ("Índice de la Guía: Sección Actual ▾") que permita saltar a cualquier sección cómodamente sin robar media pantalla ni quedar cortado.

---

### Punto 4: Cambio de página en la `Guía` (`Siguiente` / `Anterior`) empezando desde arriba
- **Qué pasa hoy (Causa Raíz):**
  - En [`src/components/UserGuideView.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/UserGuideView.jsx#L993-L999), la función `handleSelectPage` ejecuta `contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })`.
  - En escritorio eso funciona porque `.resp-guide-main` (`contentScrollRef`) tiene `overflow-y: auto`. Pero en móvil (`@media (max-width: 980px)` en [`src/index.css`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/index.css#L654-L659)), `.resp-guide-main` tiene `overflow-y: visible !important; height: auto !important;` y quien realmente tiene el scroll es `<main className="app-main-viewport">` en `App.jsx`. Por eso, al tocar `Siguiente` abajo de todo, la página cambia pero el scroll del teléfono se queda abajo de todo.
- **Cómo lo vamos a solucionar:**
  - Al cambiar `activePageId` en [`UserGuideView.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/UserGuideView.jsx) (y también al cambiar `activeTab` en [`App.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/App.jsx) o sub-vistas en `Mercados`, `Portafolio` y `Sistema`), resetear a `top: 0` tanto `contentScrollRef.current` como `document.querySelector('.app-main-viewport')` y `window`.

---

### Punto 5: Quitar los códigos hexadecimales entre paréntesis en `Guía > Palette`
- **Qué pasa hoy (Causa Raíz):**
  - En [`src/components/guide/guideTreeData.js`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/guide/guideTreeData.js#L141-L145) (y en [`src/components/guide/i18n/defaultLocales.js`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/guide/i18n/defaultLocales.js) + `public/locales/guide/*.json`), la segunda viñeta de `home-palettes` tiene:
    `bold: 'Semántica financiera intacta', code: 'Verde #10b981 / Rojo #f43f5e'`.
- **Cómo lo vamos a solucionar:**
  - Cambiar el campo `code` a `'Verde / Rojo'` en español, `'Green / Red'` en inglés, y limpiar los códigos `#10b981` y `#f43f5e` en todos los archivos de idioma de `public/locales/guide/*.json` para que se lea limpio: **`Semántica financiera intacta (Verde / Rojo):`**.
  - Revisar además todas las demás páginas de la Guía para verificar si hay otros paréntesis con códigos internos o hexadecimales que no aporten al lector.

---

### Punto 6: Cursor del mouse en el video de la `Guía` y mención a la paleta Claro/Oscuro
- **Parte A — Eliminar el cursor del mouse en la animación:**
  - **Causa Raíz:** En [`src/components/guide/GuideInteractiveVideoStage.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/guide/GuideInteractiveVideoStage.jsx#L1021-L1055), el cursor verde se posiciona con porcentajes (`left: cursorX%`, `top: cursorY%`) sobre el contenedor externo, mientras que el lienzo interno `1440×810` se escala manteniendo proporción. En celulares o pantalla completa con otra relación de aspecto, las bandas laterales/inferiores hacen que el puntero quede flotando fuera de lugar.
  - **Solución:** Tal como propusiste, **eliminamos el puntero flotante del mouse** de `GuideInteractiveVideoStage.jsx`. Cada opción o panel del video ya se resalta con un borde luminoso y despliega sus menús automáticamente a medida que la voz lo menciona, por lo que queda mucho más limpio en cualquier tamaño de pantalla.
- **Parte B — Mención a la paleta Claro/Oscuro en el video y la Guía (Decisión: Opción A seleccionada):**
  - **Enfoque elegido (Opción A — Rápida y sin tocar locuciones MP3):**
    - Agregamos una viñeta dedicada a **Modo Claro y Oscuro** en el texto de la página `Guía > Palette` (en español, inglés y demás idiomas).
    - En la animación visual del video (`Escena 08 • Palette` en [`GuideInteractiveVideoStage.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/guide/GuideInteractiveVideoStage.jsx)), hacemos que además de ciclar las paletas también se ilumine el botón de **Luna/Sol** y muestre visualmente el cambio entre Modo Oscuro y Modo Claro durante esa escena, manteniendo los audios MP3 actuales intactos.

---

### Punto 7: Cuadro `Telemetría y Logs en Vivo` colapsado en móvil dentro de `Sistema`
- **Qué pasa hoy (Causa Raíz):**
  - En [`src/components/ObservabilityView.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/ObservabilityView.jsx#L767-L842), el contenedor de logs tiene `maxHeight: '132px'` fijo en línea para que en escritorio todo el dashboard de `Sistema > Performance` entre en un solo pantallazo sin scroll.
  - Sin embargo, en el teléfono (donde la página sí es scrolleable verticalmente), `132px` sumado a una cabecera sin `flex-wrap` (donde `"Sólo P-06"` se parte en 3 renglones y `"Telemetría y Logs en Vivo"` en 2) deja apenas espacio para ver 2 líneas apretadas de logs.
- **Cómo lo vamos a solucionar:**
  - En **escritorio (`> 980px`)**: se mantiene exactamente como está hoy (`max-height: 132px`, compacto en una pantalla).
  - En **móvil (`<= 980px`)**: mediante clase CSS en [`src/index.css`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/index.css), la cabecera de `Telemetría y Logs en Vivo` usa `flex-wrap: wrap` en dos filas ordenadas (título + estado arriba, filtros `Sólo P-06` y `View All` abajo con `white-space: nowrap`), y el área de logs se amplía a `max-height: 320px` con lectura cómoda de principio a fin.

---

### Punto 8: Menú superior de `Performance` pisándose con los botones de descarga (`MD / JSON`)
- **Qué pasa hoy (Causa Raíz):**
  - En [`src/components/ObservabilityView.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/ObservabilityView.jsx#L341-L440), la barra superior centra el selector `Performance | FinOps` y coloca los botones `MD`, `JSON` y `Refresh` con `position: 'absolute', right: '4px'`. En una pantalla de celular (~360px–412px de ancho), el botón `FinOps` centrado llega hasta la derecha y queda tapado por los botones `MD` y `JSON`.
- **Chequeo en toda la app (encontramos el mismo problema en `Portafolio`):**
  - Revisando el resto de las vistas, en [`src/components/AgentCommitteeView.jsx`](file:///home/alejandrocamerlengo/Projects/market-intelligence-dashboard/src/components/AgentCommitteeView.jsx#L868-L960) (`Portafolio`) pasa exactamente lo mismo: el selector centrado `Builder | Risk | Simulator` comparte barra con el botón `Copilot` posicionado con `position: 'absolute', right: '4px'`.
- **Cómo lo vamos a solucionar:**
  - Reemplazar en ambas vistas (`Sistema` y `Portafolio`) el `position: 'absolute'` en móvil por un layout flex adaptable (`justify-content: space-between` o con `flex-wrap: wrap` cuando el ancho es menor a `640px`), de modo que las pestañas y las acciones de exportación/Copilot jamás puedan superponerse.

