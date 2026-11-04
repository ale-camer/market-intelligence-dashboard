# Propuesta Estructural de `Guide` (`GUIDE_BLUEPRINT.md`)

> **Reglas de Diseño Acordadas:**
> 1. **Máximo 2 palabras por ítem** en todo el árbol del menú y submenús.
> 2. **Menú desplegable por niveles** (los capítulos se abren y cierran mostrando sus submenús lógicos).
> 3. **Doble capa de profundidad:**
>    - **Vista Principal (Simple):** explicación breve de qué es cada elemento + cápsula de video corto IA / tour interactivo con texto y audio opcional.
>    - **Ventana Emergente (`Modal Técnico`):** se abre sólo si el usuario hace click en *"Profundizar / Detalle Técnico"* (fórmulas matemáticas, umbrales cuantitativos, arquitectura de modelos).

---

## 1. Estructura del Menú Lateral Desplegable (Máximo 2 Palabras por Ítem)

### ▸ `Home`
*(Agrupa todo lo que se ve y controla desde la pantalla inicial y el marco global sin entrar aún a Markets ni Portfolio)*
- **`Lienzo Espacial`** → *[Qué iría: breve descripción del escenario visual interactivo de bienvenida y título principal]*.
- **`Menú Superior`** → *[Qué iría: explicación del logo `λ` para volver al inicio y acceso a `Markets` y `Portfolio`]*.
- **`Pie Global`** → *[Qué iría: explicación de los accesos inferiores `System`, `Guide`, `Idioma` y `Paleta`]*.
- **`Idiomas`** → *[Qué iría: cómo funciona el selector de los 56 idiomas disponibles]*.
- **`Paletas`** → *[Qué iría: cómo cambian los temas ambientales respetando siempre el verde/rojo financiero]*.

---

### ▸ `Markets`
*(Desagregado exactamente igual a los niveles y sub-vistas de Markets)*

- **▸ `Screener`**
  - **`Categorías`** → *[Qué iría: explicación de las 10 clases de activos, botón `Todos` y filtro `★ Watchlist`]* + **[Modal Técnico: taxonomía de los 213 activos y criterios de liquidez]**.
  - **`Tarjetas Pulso`** → *[Qué iría: qué muestran los 4 indicadores superiores de Volumen, RSI, Régimen Normal y Z-Score]* + **[Modal Técnico: cálculo estadístico de RSI 14, Z-Score 20d e Isolation Forest P-06]**.
  - **`Vista Tabla`** → *[Qué iría: cómo buscar activos, ordenar columnas y marcar favoritos `★`]* + **[Modal Técnico: detalle de las 2 columnas específicas que se activan según cada clase de activo]**.
  - **`Vista Orbital`** → *[Qué iría: cómo leer la distancia al centro, el color verde/rojo y el inspector lateral]* + **[Modal Técnico: normalización radial según indicador conductor]**.
  - **`Mapa Calor`** → *[Qué iría: cómo interpretar el tamaño de los bloques y la escala de 8 tonos verdes/rojos]*.
  - **`Main Tools`** → *[Qué iría: explicación del acceso rápido de 3 pasos a los 4 motores especiales]*.

- **▸ `Analytics`**
  - **`Cabecera Activo`** → *[Qué iría: lectura rápida del precio, serie de tendencia, temporalidades y las 5 píldoras del activo]*.
  - **`Análisis Técnico`** → *[Qué iría: uso del gráfico principal, medias móviles, Bandas de Bollinger y volumen]* + **[Modal Técnico: fórmulas de SMA 20, Bollinger (20, 2σ) y VWAP]**.
  - **`Comparador`** → *[Qué iría: cómo comparar dos activos de clases compatibles en base porcentual `0%`]*.
  - **`Microestructura`** → *[Qué iría: lectura de picos de volumen inusual y spreads]* + **[Modal Técnico: telemetría de Spread Dislocation en bps y diagnóstico P-06]**.
  - **▸ `Motores 3D/2D`**
    - **`Volatilidad 3D`** → *[Qué iría: uso de la superficie 3D de opciones, sonrisa 2D y gráfico de Payoff P&L]* + **[Modal Técnico: modelo Black-Scholes T+0, Moneyness, Skew 25Δ, GEX y Griegas Δ, Γ, Θ, ν]**.
    - **`Curvas Soberanas`** → *[Qué iría: cómo comparar curvas de bonos de los 42 países en 3D y 2D]* + **[Modal Técnico: pendientes 2s10s/3m10y, Butterfly 2s5s10s, Tasa Real y sensibilidad DV01]**.
    - **`Conversor FX`** → *[Qué iría: cómo convertir montos y cruzar las 61 monedas ISO]* + **[Modal Técnico: triangulación cruzada USD y diferencial de tasas Carry 10Y]**.
    - **`Futuros Commodities`** → *[Qué iría: lectura de la curva de contratos futuros M1 a M18]* + **[Modal Técnico: estructura Contango vs Backwardation, Roll Yield anualizado e inventarios]**.

- **▸ `Research`**
  - **`Cabecera Sentimiento`** → *[Qué iría: lectura de la nota de `-100` a `+100` y la postura general]* + **[Modal Técnico: ponderación documental vs noticias según clase de activo con FinBERT]**.
  - **`Factores Bull/Bear`** → *[Qué iría: cómo explorar el acordeón central de 5 motores alcistas vs 5 riesgos bajistas]*.
  - **`Chat RAG`** → *[Qué iría: cómo consultar documentos oficiales usando preguntas libres o chips rápidos]* + **[Modal Técnico: arquitectura de recuperación verificada y Guardrail de 3 capas]**.
  - **`Pulso 24h`** → *[Qué iría: línea de tiempo de últimos titulares y curva de sentimiento de 24 horas]*.

---

### ▸ `Portfolio`
*(Desagregado en sus 3 vistas principales más el Copiloto)*

- **▸ `Constructor`** *(Vista 1)*
  - **`Píldoras Resumen`** → *[Qué iría: lectura rápida de las 6 métricas de cabecera de la cartera]* + **[Modal Técnico: fórmulas de Sharpe, Sortino, VaR 95%, Max Drawdown y Diversificación]**.
  - **`Tabla Ponderación`** → *[Qué iría: cómo tildar/destildar activos para probar combinaciones y ajustar pesos]*.
  - **`Radiografía Cartera`** → *[Qué iría: explicación de las 5 sub-pestañas de desglose estructural]* + **[Modal Técnico: descomposición de Alpha Brinson-Fachler, Look-Through X-Ray de ETFs, Cashflow y riesgo de custodia CDS/SIPC]**.
  - **`Calendario Mensual`** → *[Qué iría: lectura de la matriz de rendimientos mes a mes en verde/rojo]*.
  - **`Serie Backtest`** → *[Qué iría: cómo evaluar la evolución histórica de la cartera frente a estrategias de referencia]*.

- **▸ `Riesgo Quant`** *(Vista 2)*
  - **`Plano Markowitz`** → *[Qué iría: cómo leer la ubicación de los activos y la cartera en riesgo vs retorno y activar capas]* + **[Modal Técnico: optimización media-varianza, Frontera Eficiente y Línea del Mercado de Capitales CML]**.
  - **`Tornado Stress`** → *[Qué iría: impacto de crisis históricas, VaR por activo y captura alcista/bajista]* + **[Modal Técnico: escenarios macro de shock y cálculo de Upside/Downside Capture Ratio]**.
  - **`Matriz Correlación`** → *[Qué iría: lectura de diversificación entre activos en régimen normal vs crisis]* + **[Modal Técnico: coeficiente de Pearson `r` y asimetría de correlaciones en colas de estrés]**.
  - **`Choque 2D`** → *[Qué iría: cómo leer la tabla cruzada de Tasas × S&P 500 y regímenes de mercado]* + **[Modal Técnico: probabilidades de transición de Cadenas de Markov]**.
  - **`Monte Carlo`** → *[Qué iría: lectura de la proyección a futuro y curvas de caída máxima]* + **[Modal Técnico: simulación estocástica de 10,000 trayectorias con bandas P95/P50/P05, Underwater Drawdown y Rolling Sharpe 60D]**.

- **▸ `Laboratorio Ad-Hoc`** *(Vista 3)*
  - **`Impacto Total`** → *[Qué iría: cómo comparar la Cartera Base contra la Cartera + Estrategia antes de operar]*.
  - **`Simulador What-If`** → *[Qué iría: prueba de compras/ventas puntuales y tamaño sugerido]* + **[Modal Técnico: fórmula del Criterio de Kelly fraccional y óptimo]**.
  - **`Escudo Opciones`** → *[Qué iría: cómo simular coberturas con Puts y controlar el margen]* + **[Modal Técnico: convexidad de Protective Puts y cálculo de distancia a Margin Call]**.
  - **`Comité Autónomo`** → *[Qué iría: cómo deliberan los 3 pilares y qué frenos de seguridad aplican]* + **[Modal Técnico: reglas duras de Cap máximo 20% NAV y recorte automático por P-06 ≥ 0.65]**.
  - **`Libro Ejecución`** → *[Qué iría: registro histórico de órdenes ejecutadas]*.
  - **`Walk-Forward`** → *[Qué iría: validación de la estrategia dentro y fuera de muestra]* + **[Modal Técnico: eficiencia In-Sample vs Out-of-Sample y detección de sobreajuste]**.

- **`Copiloto RAG`**
  - **`Asistente Cartera`** → *[Qué iría: cómo abrir el ícono `💬` del menú para consultar dudas sobre la cartera activa]*.

---

## 2. Componentes de Cada Vista Dentro de `Guide`

Cuando el usuario selecciona cualquiera de los ítems de 1–2 palabras del árbol lateral, el panel principal muestra únicamente **4 bloques simples**:

1. **Bloque Escrito Breve:**
   - Qué es el elemento, para qué sirve y cómo se lee en lenguaje llano (2 a 3 párrafos cortos / viñetas).
2. **Cápsula de Video Corto IA (Multilingüe):**
   - Video corto demostrativo (estilo Docker Docs) mostrando ese elemento en acción, con selector de idioma (`ES`, `EN`, `PT`, etc.).
3. **Esquema Interactivo (con Texto y Audio opcional):**
   - Representación de las partes de esa pantalla donde el usuario puede hacer click sobre cada zona y escuchar/leer qué hace cada botón o gráfico.
4. **Botón `Profundizar (Detalle Técnico)` → Abre `Ventana Emergente (Modal)`:**
   - Sólo para quien quiera ver las ecuaciones matemáticas, parámetros del modelo, umbrales institucionales y referencias cuantitativas, manteniendo limpia la lectura principal.

