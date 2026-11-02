# Especificaciones Técnicas e Indicadores por Tipo de Activo (`ASSET_CLASS_SPECIFICATIONS.md`)

> **Objetivo:** Definir qué **indicadores, columnas dinámicas de Nivel 1 (`Screener`), herramientas interactivas de Nivel 2 (`Analytics`) y ejes de investigación (`Research` + Q&A)** muestra cada uno de los **10 tipos de activos** dentro del diseño aprobado de `Markets` y `Portfolio` (sin crear pantallas nuevas).
>
> ### Cuatro Motores Cuantitativos Especializados (con Renderizado Volumétrico 3D Interactivo) Integrados en Nivel 2 (`Analytics`):
> 1. **Superficie de Volatilidad 3D y 2D (`3D Volatility Surface` — `9 Strikes (85%..115%)` × `7 Vencimientos (7D..365D)` × `IV %`):** disponible en `DERIVATIVES_VOL`, `EQUITY`, `ETF`, `INDEX` y `CRYPTO`. Renderiza una **malla 3D volumétrica interactiva** (`Surface3DViewer.jsx`, rotable con el mouse en `Yaw / Pitch`, con cortes transversales en 3D y cámaras preconfiguradas *Isométrica*, *Frente Smile*, *Perfil Term Structure* y *Planta Heatmap*) además de la vista 2D multicurva, filtrando estrictamente strikes líquidos (`Vol > 10k`, `OI > 25k`) junto con `ATM IV`, `IV Rank`, `Straddle Breakeven (±%)`, `25Δ Put-Call Skew`, `Net GEX ($B)` y `Max Pain`.
> 2. **Perfil de Beneficios (`Payoff P&L` a Vencimiento y `T+0`) y Estrategias con Sintéticos (`Options & Synthetics Payoff Engine`):** integrado junto a la Superficie IV 3D/2D en la lente de Derivados. Permite simular **10 estructuras cuantitativas y sintéticas** (*Long Straddle ATM*, *Bull Call Spread*, *Bear Put Spread*, *Iron Condor*, *Long Strangle*, *Synthetic Long (`+Call -Put`)*, *Synthetic Short (`-Call +Put`)*, *Covered Call*, *Long Call ATM*, *Long Put ATM*), graficando el **P&L al Vencimiento (`$`)**, la curva de **Valoración Hoy (`T+0 Black-Scholes $`)** y la línea de `Breakeven ($0)`, junto con Costo/Crédito Neto, Puntos de Equilibrio (`BE`), Máxima Ganancia/Pérdida y **Griegas Netas de la Estrategia (`Δ, Γ, Θ, ν`)**.
> 3. **Superficie y Curva de Rendimientos de Bonos Soberanos 3D/2D (`Sovereign Yield Surface` — `3M` a `30Y` en 42 Países):** disponible en `RATES`, `FIXED_INCOME` (`Bonos US Treasury`) y `CASH`. Permite elegir cualquiera de los **42 países** y alternar entre:
>    - **Superficie 3D (Evolución Histórica):** `10 Plazos (3M..30Y)` × `6 Horizontes (-2Y a Hoy)` × `Yield (%)`.
>    - **Superficie 3D (Multi-País):** comparativa tridimensional simultánea entre las curvas soberanas de `6 países` (`País seleccionado, US, DE, GB, JP, BR`).
>    - **Curva 2D:** superposición directa contra el Tesoro de EE.UU. (`UST`) y el `Bund` alemán, calculando en vivo `2s10s`, `3m10y`, *Butterfly* `2s5s10s`, `Real Yield 10Y`, `Modified Duration` y `DV01`.
> 4. **Conversor Cruzado de Tipos de Cambio (`FX Cross-Currency Converter & Triangulator` — 61 Monedas ISO) + Superficie Forward 3D de Materias Primas (`COMMODITY`):**
>    - En `FX`: permite ingresar cualquier **monto nominal**, elegir **Moneda Base (`A`)** y **Moneda Cotizada (`B`)** (`A ⇄ B`), calcular la conversión cruzada exacta triangulando contra el dólar `(USD/B) ÷ (USD/A)`, medir el **Diferencial de Tasas (`Carry Spread bps`)** y graficar la serie histórica del par cruzado `A/B`.
>    - En `COMMODITY`: renderiza la **Superficie Forward 3D (`M1..M18` × `Evolución Temporal` × `Precio Futuro $`)** para visualizar *Backwardation / Contango* en 3 dimensiones.

---

## 0. Tabla Resumen de las 10 Categorías (Orden Alfabético)

| # | Categoría (`cat`) | Métrica Principal de Precio/Tasa | Indicadores Clave en `Analytics` (Hero + Lente Especializada) | Fuente Documental y Peso en `Research` (`Fundamentos / Noticias`) | Chips Rápidos de Q&A (`Research`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **`CASH`** *(Cash & SOFR)* | Tasa Anualizada (`%`) o NAV (`$`) | Spread vs. Fed Funds (`EFFR`), Volumen Repo (`$B`), WAM (días), Liquidez `RRP` | Comunicados FOMC / Subastas T-Bills (**`85% Macro / 15% Noticias`**) | `Tasa & Corredor Fed` • `Riesgo de Liquidez` • `Volumen Repo / RRP` • `Curva T-Bills (1M-6M)` |
| **2** | **`COMMODITY`** *(Materias Primas)* | Precio Spot / Futuro Front-Month (`$`) | Estructura Temporal (*Contango / Backwardation*), Inventarios EIA/LME/USDA, Posicionamiento Neto COT | Reportes de Inventarios EIA / LME / USDA / COT (**`65% Físico / 35% Noticias`**) | `Oferta & Inventarios` • `Riesgos Geopolíticos/Clima` • `Curva Futuros (Roll Yield)` • `Demanda Industrial` |
| **3** | **`CRYPTO`** *(Crypto)* | Precio Spot (`$`) | *Perpetual Funding Rate* (`%`), *Open Interest* (`$B`), *Liquidations 24h*, Dominancia / TVL | Reportes de Custodia ETF, Auditoría On-Chain y TVL (**`50% On-Chain / 50% Noticias`**) | `Economía de Red & Quema` • `Riesgos de Apalancamiento` • `Reservas & Liquidez ETF` • `Cuota Layer-1 / DeFi` |
| **4** | **`DERIVATIVES_VOL`** *(Derivados & Vol)* | Prima ATM (`$`), Nivel Vol (`pts`) o Futuro | *Implied Volatility (`IV %`)*, *IV Rank / Percentile*, *25Δ Put-Call Skew*, Griegas (`Δ, Γ, Θ, ν`), *Net GEX* y *Max Pain* (solo alto volumen) | Superficie de Volatilidad CBOE / CME Open Interest (**`60% Estructura OI / 40% Flujo`**) | `Superficie IV & Skew` • `Riesgo Gamma / Pinning` • `Liquidez & Open Interest` • `Cobertura / Breakeven` |
| **5** | **`EQUITY`** *(Acciones S&P/NDX)* | Precio por Acción (`$`) | `P/E Forward`, `EV/EBITDA`, Margen Bruto/Operativo, Crecimiento `EPS YoY`, Cadena de Opciones Líquidas (`IV Smile`) | Reportes Oficiales `SEC Form 10-K / 10-Q` (**`80% Balance / 20% Noticias`**) | `Ingresos y Márgenes` • `Factores de Riesgo (1A)` • `Caja y Valuación` • `Foso Competitivo (Moat)` |
| **6** | **`ETF`** *(ETFs)* | Precio de Mercado (`$`) | `AUM ($B)`, Flujo Neto 24h/30d (`$M`), *Expense Ratio (`%`)*, *Premium/Discount vs. NAV (`bps`)*, *Dividend Yield* | Prospecto Oficial del Fondo, Fact Sheet y Flujos 13F (**`75% Flujos/NAV / 25% Noticias`**) | `Flujos & AUM` • `Riesgo de Concentración` • `Tracking Error & NAV` • `Composición & Costo (TER)` |
| **7** | **`FIXED_INCOME`** *(Bonos US Treasury)* | Precio Limpio (`$ base 100`) | *Yield to Maturity (`YTM %`)*, Cupón (`%`), *Modified Duration (años)*, `DV01 ($/MM)`, *Convexity*, *TIPS Breakeven* | Subastas del Tesoro de EE.UU. (*Quarterly Refunding*) (**`85% Subastas/Macro / 15% Noticias`**) | `Rendimiento (YTM) & Cupón` • `Riesgo de Duración (DV01)` • `Demanda en Subastas (Bid-to-Cover)` • `Inflación & Breakeven` |
| **8** | **`FX`** *(Divisas)* | Tipo de Cambio (`USD/XXX` o `XXX/USD`) | **Triangulador Cruzado (`61 monedas`)**, *Carry Differential 10Y (`bps`)*, *1M Risk Reversal (`25Δ`)*, *Real Effective Exchange Rate (REER)* | Balance de Pagos BIS y Diferencial de Bancos Centrales (**`65% Carry/Macro / 35% Noticias`**) | `Diferencial de Tasas (Carry)` • `Riesgo de Intervención/BC` • `Balanza Comercial & Flujos` • `Paridad & Valuación Real` |
| **9** | **`INDEX`** *(Índices)* | Puntos del Índice (`pts`) | Amplitud de Mercado (*`% > SMA200`*, *Advance/Decline*), `P/E Agregado`, `EPS Growth YoY`, Concentración Top-10 (`%`) | Agregado de Ganancias Trimestrales y Macro Regional (**`75% Ganancias / 25% Noticias`**) | `Crecimiento de Ganancias (EPS)` • `Riesgos Macro y Tasas` • `Múltiplos del Índice (P/E)` • `Amplitud y Liderazgo Sectorial` |
| **10** | **`RATES`** *(Tasas & Curvas)* | Rendimiento Nominal (`%`) | **Curva Soberana Completa (`3M` a `30Y` de 42 países)**, Pendientes `2s10s` y `3m10y` (`bps`), *Butterfly `2s5s10s`*, *Real Yield (`%`)*, *Spread vs. UST/Bund* | Actas de Bancos Centrales, Inflación CPI y Rating Soberano (**`85% Política Monetaria / 15% Noticias`**) | `Pendiente de Curva (2s10s)` • `Riesgo Inflacionario / Fiscal` • `Tasa Real & Prima por Plazo` • `Spread Soberano vs. UST` |

---

## 1. `CASH` — Liquidez, Tasas Overnight y T-Bills (`SOFR`, `EFFR`, `ESTR`, `SONIA`, `TONAR`, `UST-1M..6M`, `SGOV`, `BIL`, `FED-RRP`, `USDT`, `USDC`)

- **Qué representa:** El costo puro del dinero *overnight* sin riesgo de duración y los vehículos institucionales de estacionamiento de liquidez.
- **Indicadores específicos en `Analytics`:**
  1. **Yield / Tasa Anualizada (`%`):** tasa efectiva diaria (`4.82%` en `SOFR`) o rendimiento SEC a 30 días (`SGOV`, `BIL`).
  2. **Spread contra Tasa de Política (`bps`):** desvío frente al piso/techo de la Reserva Federal (`EFFR` / `IORB` / `RRP`) para detectar estrés de liquidez bancaria a fin de mes/trimestre.
  3. **Volumen Diario de Fondeo (`$B`):** volumen operado en el mercado tripartito de *repo* (`~$1.94T/día` en `SOFR`) o saldo estacionado en el *Reverse Repo Facility* (`FED-RRP`).
  4. **En Stablecoins (`USDT`, `USDC`):** *Peg Deviation (`bps` vs. `$1.0000`)*, composición de reservas en T-Bills y flujo neto de emisión/rescate 24h.
- **Lente Especializada en Nivel 2 (`Analytics`):** Comparativa directa de la **Curva Corta de Liquidez (`Overnight` → `1M` → `3M` → `6M` → `1Y`)** y corredor de tasas de bancos centrales (`Fed`, `ECB`, `BoE`, `BoJ`).

---

## 2. `COMMODITY` — Materias Primas (`CL`, `BZ`, `NG`, `TTF`, `GC`, `SI`, `HG`, `ALI`, `LITH`, `ZS`, `ZC`, `ZW`, `KC`, `CC`, etc.)

- **Qué representa:** Energía, metales preciosos, metales industriales/baterías y granos/softs operados en `NYMEX`, `COMEX`, `ICE`, `LME` y `CBOT`.
- **Indicadores específicos en `Analytics`:**
  1. **Estructura Temporal (*Term Structure*):** diferencial `Front-Month vs. 3rd-Month` en `%` y `$` para identificar **Backwardation** (escasez física aguda, *roll yield* positivo) o **Contango** (abundancia de inventarios, costo de almacenamiento).
  2. **Nivel de Inventarios Físicos vs. Media de 5 Años:** barriles en Cushing/EIA (energía), toneladas en almacenes LME/COMEX (metales) o ratio *Stocks-to-Use* USDA (granos).
  3. **Posicionamiento Neto Especulativo (`CFTC COT`):** posición neta de *Managed Money* vs. *Commercial Hedgers* (productores/consumidores).
  4. **Correlación con Dólar (`DXY`) y Tasas Reales (`TIPS`):** especialmente crítica en Oro (`GC`), Plata (`SI`) y Cobre (`HG`).
- **Lente Especializada en Nivel 2 (`Analytics`):** Curva Forward del contrato (`M1` a `M12`) + indicador de *Contango / Backwardation* e inventarios físicos.

---

## 3. `CRYPTO` — Criptoactivos Líderes (`BTC`, `ETH`, `SOL`, `BNB`, `XRP`, `DOGE`, `ADA`, `AVAX`, `LINK`, `SUI`, `UNI`, `AAVE`, etc.)

- **Qué representa:** Activos digitales de Capa 1, oráculos e infraestructura DeFi de mayor liquidez spot y perpetuos 24/7.
- **Indicadores específicos en `Analytics`:**
  1. **Tasa de Fondeo en Perpetuos (*Annualized Funding Rate `%`*):** mide el costo del apalancamiento largo vs. corto cada 8 horas.
  2. **Interés Abierto (*Open Interest `$B`*) y Basis Spot-Perp (`bps`):** detecta exceso de apalancamiento antes de cascadas de liquidación.
  3. **Flujos Institucionales ETF Spot (`$M/día`) y Reservas en Exchanges (`% supply`):** mide absorción institucional vs. oferta líquida disponible.
  4. **Métricas On-Chain / Protocolo:** `TVL ($B)`, tasa de *staking* (`% APR`), emisión neta post-quema (`%/año`) e ingresos por comisiones reales (*REV*).
- **Lente Especializada en Nivel 2 (`Analytics`):** Curva de *Funding Rate*, *Open Interest Basis* y sonrisa de volatilidad implícita (`IV Smile`) de opciones sobre `BTC`/`ETH`/`SOL`.

---

## 4. `DERIVATIVES_VOL` — Índices de Volatilidad, Futuros y Opciones de Alto Volumen (`VIX`, `VXN`, `MOVE`, `ES`, `NQ`, `ZN`, `NVDA-OPT`, `SPY-OPT`, `QQQ-OPT`, `TSLA-OPT`, etc.)

- **Qué representa:** El termómetro puro de cobertura institucional, miedo/complacencia y apalancamiento líquido.
- **Regla estricta de liquidez (según tu comentario):** En opciones sobre acciones/ETFs **solo se incluyen strikes con `Volumen > 10,000 contratos` y `Open Interest > 25,000`** para evitar primas ilíquidas con spreads amplios que distorsionen el estudio de volatilidad.
- **Indicadores específicos en `Analytics`:**
  1. **Volatilidad Implícita ATM (`IV %`) vs. Volatilidad Realizada 30d (`HV %`):** *Volatility Risk Premium (`VRP = IV - HV`)*.
  2. **Skew Put-Call `25Δ` (`%`) y Ratio Put/Call de Volumen:** mide cuánto más caras están las Puts de protección frente a las Calls especulativas.
  3. **Griegas Institucionales y Exposición de Dealers:** `Delta (Δ)`, `Gamma (Γ)`, `Vega (ν)`, `Theta (Θ)`, **Exposición Gamma Neta (`Net GEX $B`)** y nivel de **`Max Pain`**.
  4. **Movimiento Implícito (*ATM Straddle Breakeven `±%`*):** rango de precio descontado por el mercado de opciones para los próximos 30 días.
- **Lente Especializada en Nivel 2 (`Analytics`):** Selector dual interactivo entre:
  1. **Superficie de Volatilidad Implícita 2D (`IV Surface` por Strike `85%` a `115%` Moneyness × Tenors `7D, 30D, 90D, 180D`)** y barras de *Open Interest* Call/Put.
  2. **Perfil de Beneficios (`Payoff P&L & Sintéticos`):** simulador de 10 estrategias de opciones y sintéticos con curvas de P&L al vencimiento (`$`), P&L hoy (`T+0 Black-Scholes $`), puntos de equilibrio (`Breakeven`) y Griegas netas (`Δ, Γ, Θ, ν`).

---

## 5. `EQUITY` — Acciones Individuales del S&P 500 y Nasdaq-100 (`NVDA`, `AAPL`, `MSFT`, `AMZN`, `GOOGL`, `TSLA`, `META`, `AMD`, `AVGO`, `JPM`, `LLY`, etc.)

- **Qué representa:** Exclusivamente las compañías líderes que componen el **S&P 500** y el **Nasdaq-100**, ordenadas por volumen diario en dólares.
- **Indicadores específicos en `Analytics`:**
  1. **Múltiplos de Valuación:** `P/E Forward`, `EV/EBITDA`, `P/FCF` y *Free Cash Flow Yield (`%`)*.
  2. **Rentabilidad y Crecimiento Operativo (SEC 10-K / 10-Q):** Crecimiento de ingresos `YoY (%)`, Margen Bruto (`%`), Margen Operativo (`%`) y `ROE (%)`.
  3. **Microestructura Institucional:** Volumen 24h (`$B`), `Vol Z-Score (20d)` de bloques institucionales y *Short Interest (`% float`)*.
  4. **Derivados sobre la Acción:** acceso directo en Nivel 2 a su **Cadena de Opciones de Alto Volumen (`IV Smile`, `Straddle`, `25Δ Skew` y `Net GEX`)**.
- **Lente Especializada en Nivel 2 (`Analytics`):** Superficie / Sonrisa de Opciones Líquidas de la acción + comparador de retorno relativo (`%`) contra `SPY` / `QQQ` y pares del sector.

---

## 6. `ETF` — ETFs Más Operados del Mundo (`SPY`, `QQQ`, `IWM`, `SMH`, `SOXX`, `TLT`, `VOO`, `XLK`, `XLF`, `XLE`, `GLD`, `HYG`, `LQD`, `EEM`, etc.)

- **Qué representa:** Vehículos institucionales cotizados de índices, sectores SPDR, bonos, oro/materias primas y mercados emergentes.
- **Indicadores específicos en `Analytics`:**
  1. **Activos Bajo Gestión (`AUM $B`) y Flujo Neto (`24h / 30d Inflows $M`):** creación y rescate de cuota-partes (*Creation/Redemption units*) por *Authorized Participants*.
  2. **Dislocación Precio vs. Valor Libros (*Premium / Discount to NAV en `bps`*):** detecta presión compradora o vendedora institucional cuando el mercado subyacente está cerrado o estresado.
  3. **Costo y Rendimiento:** *Expense Ratio (`TER %`)*, *Dividend / SEC 30-Day Yield (`%`)* y peso del Top-10 de tenencias (`%`).
  4. **Liquidez de Opciones del ETF:** volumen de opciones diarias y *Put/Call Skew* (especialmente en `SPY`, `QQQ`, `IWM`, `TLT`, `GLD`, `HYG`).
- **Lente Especializada en Nivel 2 (`Analytics`):** Cadena de Opciones de Alto Volumen (`IV Smile` y `GEX`) + descomposición de *Tracking Error / NAV Spread*.

---

## 7. `FIXED_INCOME` — Bonos del Tesoro de Estados Unidos (`UST-2Y`, `UST-3Y`, `UST-5Y`, `UST-7Y`, `UST-10Y`, `UST-20Y`, `UST-30Y`, `UST-5Y-TIPS`, `UST-10Y-TIPS`)

- **Qué representa:** Exclusivamente títulos soberanos del Tesoro de EE.UU. (*Notes, Bonds y TIPS*), cotizados en **Precio Limpio (`$ base 100`)**.
- **Indicadores específicos en `Analytics`:**
  1. **Precio Limpio (`$`) y *Yield to Maturity (`YTM %`)*:** relación inversa precio/tasa junto con la tasa cupón nominal (`%`).
  2. **Sensibilidad a Tasas (*Modified Duration* en años y `DV01`):** cuántos dólares gana o pierde cada `$1,000,000` nominal ante un movimiento de `1 bp` (`0.01%`) en la curva, más la **Convexidad**.
  3. **Métricas de Subasta Primaria (*US Treasury Auction*):** *Bid-to-Cover Ratio* (ej. `2.58x`), *Tail / Stop-Through (`bps`)* y porcentaje adjudicado a *Indirect Bidders* (bancos centrales y fondos extranjeros).
  4. **En `TIPS` (`UST-5Y-TIPS`, `UST-10Y-TIPS`):** *Real Yield (`%`)* e **Inflación Implícita (*Breakeven Inflation Rate `%`*)**.
- **Lente Especializada en Nivel 2 (`Analytics`):** Visualización directa de la **Curva del Tesoro de EE.UU. (`3M` a `30Y`)** con cálculo en vivo de `DV01`, `Duration`, `2s10s` y `3m10y`.

---

## 8. `FX` — Divisas Globales y Triangulación Cruzada (`DXY`, `EUR/USD`, `USD/JPY`, `GBP/USD`, `USD/BRL`, `USD/MXN`, `USD/ARS`, `USD/CNH` + 61 monedas ISO)

- **Qué representa:** Todas las monedas del mundo almacenadas contra el dólar estadounidense (`USD/XXX`) con conversión cruzada dinámica entre cualquier par `(A/B) = (USD/B) / (USD/A)`.
- **Indicadores específicos en `Analytics`:**
  1. **Tipo de Cambio Directo e Inverso (`A/B` y `B/A`):** calculado al instante con precisión institucional de 4 decimales (o 2 decimales en monedas de nominal alto como `JPY`, `ARS`, `CLP`, `COP`, `KRW`).
  2. **Diferencial de Tasas Soberanas (*Carry Spread `bps`*):** diferencia entre el rendimiento soberano / tasa de política de la moneda base vs. la moneda cotizada (motor de flujos de *Carry Trade*).
  3. **Volatilidad Implícita FX (`1M ATM Vol %`) y *25Δ Risk Reversal*:** mide el sesgo de cobertura hacia fortaleza o debilidad de la divisa.
  4. **Índice Dólar (`DXY`):** fuerza ponderada del `USD` frente a la canasta G6 (`EUR`, `JPY`, `GBP`, `CAD`, `SEK`, `CHF`).
- **Lente Especializada en Nivel 2 (`Analytics`):** **Triangulador Cruzado Interactivo de 61 Monedas (`Base` ÷ `Quote` vía `USD`)** integrado en la barra de herramientas de `Analytics`.

---

## 9. `INDEX` — Índices Bursátiles Globales (`SPX`, `NDX`, `DJI`, `RUT`, `SOX`, `SX5E`, `DAX`, `UKX`, `NKY`, `HSI`, `SHCOMP`, `KOSPI`, `TWII`, `NIFTY`, `IBOV`, `MERVAL`, etc.)

- **Qué representa:** Los 25 índices oficiales de referencia de EE.UU., Europa, Asia-Pacífico y América Latina cotizados en **puntos (`pts`)**.
- **Indicadores específicos en `Analytics`:**
  1. **Amplitud Interna (*Market Breadth*):** porcentaje de acciones del índice operando por encima de su media móvil de 200 ruedas (`% > SMA200`) y ratio *Advance / Decline*.
  2. **Valuación Agregada del Índice:** `P/E Forward` del índice, crecimiento agregado de ganancias (`Blended EPS Growth YoY %`) y *Earnings Yield vs. Bono Soberano 10Y (Equity Risk Premium)*.
  3. **Concentración y Liderazgo:** peso porcentual de las 10 mayores compañías del índice y contribución sectorial al movimiento diario.
  4. **Volatilidad Implícita Asociada:** vínculo directo con su índice de volatilidad (`VIX` para `SPX`, `VXN` para `NDX`, `V2X` para `SX5E`/`DAX`) y cadena de opciones del índice.
- **Lente Especializada en Nivel 2 (`Analytics`):** Comparador relativo (`%`) entre índices globales (ej. `SPX` vs. `SX5E` vs. `NKY` vs. `MERVAL`) y curva de volatilidad implícita.

---

## 10. `RATES` — Nodos Soberanos y Curvas de Rendimiento de 42 Países (`US2Y`, `US10Y`, `DE10Y`, `UK10Y`, `JP10Y`, `BR10Y`, `MX10Y`, etc. + Selector de 42 Países)

- **Qué representa:** Tasas soberanas por plazo (`3M`, `6M`, `1Y`, `2Y`, `3Y`, `5Y`, `7Y`, `10Y`, `20Y`, `30Y`) para armar la curva de rendimiento de **42 países** y medir el ciclo monetario y riesgo soberano.
- **Indicadores específicos en `Analytics`:**
  1. **Pendientes Clave de la Curva (`bps`):**
     - **`2s10s` (`10Y - 2Y`):** indicador clásico de crecimiento/recesión y empinamiento (*steepening*) o inversión (*inversion*).
     - **`3m10y` (`10Y - 3M`):** indicador preferido por la Reserva Federal para probabilidad de recesión a 12 meses.
  2. **Curvatura (*Butterfly `2s5s10s = 2×5Y - (2Y + 10Y)` en `bps`*):** mide la concavidad del tramo medio de la curva ante cambios en expectativas de tasas neutrales.
  3. **Rendimiento Real (`Real Yield 10Y = Nominal 10Y - CPI YoY`):** costo financiero real de cada economía descontando su inflación interanual.
  4. **Spread Soberano (`bps vs. US Treasury 10Y` o `vs. Bund Alemán 10Y`):** prima de riesgo país / diferencial soberano junto con la calificación crediticia (`AAA` a `B`) y `DV01`.
- **Lente Especializada en Nivel 2 (`Analytics`):** **Graficador de Curva Soberana Completa (`3M` a `30Y`) con selector de los 42 países**, superponiendo la curva del país elegido contra la curva del Tesoro de EE.UU. (`UST`) en el mismo gráfico.

