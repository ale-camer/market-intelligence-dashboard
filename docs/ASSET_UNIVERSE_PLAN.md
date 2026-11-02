# Planificación Definitiva del Universo de Activos y Retención de Datos (`ASSET_UNIVERSE_PLAN.md`)

Documento consolidado con tus decisiones sobre las **10 clases de activos**, sus reglas de cálculo/filtrado por volumen y la política de **Aplanado Progresivo (*Downsampling*) + Eliminación de Datos Viejos (*Rolling TTL*)** para mantener el almacenamiento fijo (`~45–60 MB` totales) y el costo en **`$0.00/mes`**.

---

## 1. Matriz Consolidada de las 10 Categorías (Decisiones Cerradas)

| # | Categoría (`cat`) | Alcance Definitivo Aprobado | Estrategia de Datos y Volumen |
|---|---|---|---|
| **1** | **`INDEX`** | **Todos los 22 índices listados** (Norteamérica, Europa, Asia-Pacífico y LatAm) | Serie OHLCV + retornos comparativos |
| **2** | **`EQUITY`** | **Exclusivamente las acciones que componen el S&P 500 y el Nasdaq-100** (~515 tickers únicos sin duplicados) | Ordenadas por volumen diario en USD ($B); se excluyen acciones individuales fuera de ambos índices |
| **3** | **`ETF`** | **Todos los 31 ETFs listados** (índices, sectores, renta fija, commodities, países) | Mayor volumen diario en USD y liquidez institucional |
| **4** | **`CRYPTO`** | **Todos los 15 criptoactivos líderes listados** por volumen 24h | Volumen combinado Spot + Perpetuos |
| **5** | **`RATES`** | **Curvas soberanas de todos los países posibles (~40 países)** con nodos de `1M`/`3M` a `30Y` | Matriz compacta de nodos por país/fecha para dibujar la curva y calcular `2s10s`, `3m10y`, `butterfly`, tasas reales y `DV01` |
| **6** | **`FIXED_INCOME`** | **Exclusivamente Bonos del Tesoro de Estados Unidos (*US Treasuries*)** | Benchmarks *On-The-Run* (`2Y`, `3Y`, `5Y`, `7Y`, `10Y`, `20Y`, `30Y` + `TIPS`); se excluyen corporativos y deuda extranjera |
| **7** | **`FX`** | **Todas las monedas del mundo (~150 divisas ISO) contra el `USD`** + conversión cruzada dinámica | Solo se guarda `USD/XXX`; cualquier par cruzado `A/B` se calcula en vivo como `(USD/B) / (USD/A)` |
| **8** | **`COMMODITY`** | **Todas las 26 materias primas listadas** (Energía, Metales Preciosos, Industriales y Agrícolas/Softs) | Contratos de referencia de mayor volumen global |
| **9** | **`DERIVATIVES_VOL`** | **Todos los futuros e índices de volatilidad listados + Opciones sobre Acciones de mayor volumen** | Filtro estricto de **Volumen y Open Interest mínimo** en primas de opciones para eliminar ruido y distorsión |
| **10** | **`CASH`** | **Todos los 13 instrumentos de liquidez listados** (`SOFR`, `EFFR`, `T-Bills`, `SGOV`, `BIL`, `RRP`, `USDT`, `USDC`) | Tasas *overnight* y vehículos monetarios de mayor volumen |

---

## 2. Detalle por Categoría

### Categoría 1: Índices Principales (`INDEX` — 22 Índices Aprobados)
- **Norteamérica (5):** `SPX` (S&P 500), `NDX` (Nasdaq-100), `DJI` (Dow Jones), `RUT` (Russell 2000), `TSX` (S&P/TSX Canadá).
- **Europa (7):** `SX5E` (Euro Stoxx 50), `DAX` (Alemania), `UKX` (FTSE 100 Reino Unido), `CAC` (Francia), `IBEX` (España), `FTSEMIB` (Italia), `SMI` (Suiza).
- **Asia-Pacífico (7):** `N225` (Nikkei 225 Japón), `TOPIX` (Japón), `HSI` (Hang Seng Hong Kong), `CSI300` (China Continental), `KOSPI` (Corea del Sur), `NIFTY` (India), `ASX200` (Australia).
- **Latinoamérica (3):** `IBOV` (Ibovespa Brasil), `IPC` (México), `MERVAL` (Argentina).

---

### Categoría 2: Equities — Constituyentes del S&P 500 y Nasdaq-100 (`EQUITY`)
- **Alcance estricto:** Únicamente las empresas que integran el **S&P 500** y/o el **Nasdaq-100** (~515 acciones únicas sumando ambos índices sin repetir las ~85 que están en los dos).
- **Se descartan:** Acciones individuales de Europa, Asia o Latinoamérica que no formen parte del S&P 500 o del Nasdaq-100 (`MELI` se mantiene porque integra el Nasdaq-100).
- **Núcleo de Mayor Volumen Diario (Tier-1 de Liquidez):**
  - *Tecnología, IA y Semiconductores:* `NVDA`, `AAPL`, `MSFT`, `AMZN`, `GOOGL`, `META`, `TSLA`, `AVGO`, `AMD`, `NFLX`, `ORCL`, `CRM`, `PLTR`, `MU`, `INTC`, `CSCO`, `ADBE`, `QCOM`, `TXN`, `AMAT`, `LRCX`, `KLAC`, `PANW`, `CRWD`, `SNPS`, `CDNS`, `ARM`, `MRVL`, `MELI`.
  - *Finanzas y Pagos:* `BRK.B`, `JPM`, `BAC`, `WFC`, `C`, `GS`, `MS`, `BLK`, `SPGI`, `AXP`, `V`, `MA`, `PYPL`, `COIN`.
  - *Salud y Biotecnología:* `LLY`, `UNH`, `JNJ`, `ABBV`, `MRK`, `TMO`, `ABT`, `PFE`, `AMGN`, `GILD`, `ISRG`, `VRTX`, `REGN`.
  - *Consumo, Industria y Energía:* `WMT`, `COST`, `HD`, `PG`, `KO`, `PEP`, `MCD`, `NKE`, `SBUX`, `DIS`, `XOM`, `CVX`, `COP`, `SLB`, `CAT`, `GE`, `RTX`, `HON`, `UNP`, `BA`, `DE`, `LMT`, `NEE`, `LIN`.
  - *Resto de constituyentes del S&P 500 y Nasdaq-100:* Indexados en el catálogo general con ingesta diaria por lotes y ordenados por volumen operado en dólares.

---

### Categoría 3: ETFs Principales (`ETF` — 31 ETFs Aprobados)
- **Índices Generales (5):** `SPY`, `QQQ`, `IWM`, `DIA`, `VT`.
- **Sectoriales EE.UU. (9):** `SOXX`, `XLF`, `XLE`, `XLK`, `XLV`, `XLI`, `XLP`, `XLY`, `XLU`.
- **Renta Fija y Crédito (7):** `TLT`, `IEF`, `SHY`, `TIP`, `LQD`, `HYG`, `EMB`.
- **Materias Primas y Cripto Spot (6):** `GLD`, `SLV`, `USO`, `UNG`, `DBA`, `IBIT`.
- **Internacionales y Emergentes (7):** `EEM`, `EFA`, `FXI`, `EWJ`, `EWZ`, `EWW`, `ARGT`.

---

### Categoría 4: Criptoactivos (`CRYPTO` — 15 Criptoactivos Aprobados)
- `BTC`, `ETH`, `SOL`, `BNB`, `XRP`, `DOGE`, `ADA`, `AVAX`, `LINK`, `TON`, `SUI`, `DOT`, `NEAR`, `UNI`, `AAVE`.

---

### Categoría 5: Curvas de Tasas Soberanas de Todos los Países (`RATES`)
Cada país almacena su **vector de rendimientos por plazo** (`1M`, `3M`, `6M`, `1Y`, `2Y`, `3Y`, `5Y`, `7Y`, `10Y`, `20Y`, `30Y`) para graficar su curva soberana completa, comparar curvas entre países y calcular automáticamente:
- **`Spread 2s10s`** (`10Y - 2Y` en bps) y **`Spread 3m10y`** (`10Y - 3M` en bps)
- **`Butterfly 2s5s10s`** (`2×5Y - 2Y - 10Y`), **Pendiente**, **Tasa Real** y **`DV01`**
- **Spreads Soberanos Internacionales** (contra `UST` de EE.UU. o `Bund` de Alemania)

**Países incluidos para armado de curvas (~40 economías con mercado de deuda soberana líquido):**
1. **América del Norte (2):** Estados Unidos (`US`), Canadá (`CA`).
2. **Europa Occidental y Nórdicos (14):** Alemania (`DE`), Reino Unido (`GB`), Francia (`FR`), Italia (`IT`), España (`ES`), Suiza (`CH`), Países Bajos (`NL`), Bélgica (`BE`), Austria (`AT`), Irlanda (`IE`), Portugal (`PT`), Grecia (`GR`), Suecia (`SE`), Noruega (`NO`), Dinamarca (`DK`).
3. **Europa Central y del Este (4):** Polonia (`PL`), República Checa (`CZ`), Hungría (`HU`), Rumania (`RO`).
4. **Asia-Pacífico (12):** Japón (`JP`), China (`CN`), Australia (`AU`), Nueva Zelanda (`NZ`), Corea del Sur (`KR`), India (`IN`), Singapur (`SG`), Hong Kong (`HK`), Taiwán (`TW`), Indonesia (`ID`), Malasia (`MY`), Tailandia (`TH`), Filipinas (`PH`).
5. **Latinoamérica, Medio Oriente y África (8):** Brasil (`BR`), México (`MX`), Chile (`CL`), Colombia (`CO`), Perú (`PE`), Sudáfrica (`ZA`), Israel (`IL`), Turquía (`TR`).

---

### Categoría 6: Renta Fija — Exclusivamente Tesoro de EE.UU. (`FIXED_INCOME`)
Se incluyen **únicamente los Bonos del Tesoro de Estados Unidos (*US Treasuries*)** con su precio limpio, rendimiento (YTM), cupón, duración modificada, convexidad y `DV01`:
- [x] **`UST-2Y`** — US Treasury 2-Year Note (*On-The-Run Benchmark*)
- [x] **`UST-3Y`** — US Treasury 3-Year Note
- [x] **`UST-5Y`** — US Treasury 5-Year Note
- [x] **`UST-7Y`** — US Treasury 7-Year Note
- [x] **`UST-10Y`** — US Treasury 10-Year Note (*Benchmark Global*)
- [x] **`UST-20Y`** — US Treasury 20-Year Bond
- [x] **`UST-30Y`** — US Treasury 30-Year Long Bond
- [x] **`UST-5Y-TIPS`** — US 5-Year Treasury Inflation-Protected Security
- [x] **`UST-10Y-TIPS`** — US 10-Year Treasury Inflation-Protected Security
- [x] **`UST-30Y-TIPS`** — US 30-Year Treasury Inflation-Protected Security

---

### Categoría 7: Divisas — Todas las Monedas del Mundo + Conversión Cruzada (`FX`)
- **Almacenamiento mínimo sin redundancia:** Solo se ingiere y almacena cada moneda del mundo (**~150 códigos ISO 4217**) contra el Dólar Estadounidense (`USD/XXX`), más el índice **`DXY`**.
- **Motor de Conversión Cruzada Dinámica:** Cualquier cruce entre dos monedas cualesquiera del mundo (`Moneda A / Moneda B`, ej. `EUR/JPY`, `GBP/BRL`, `AUD/MXN`, `CHF/ARS`) se calcula matemáticamente en el acto sin almacenar series extra:
  $$\text{Tasa}(A / B) = \frac{\text{USD}/B}{\text{USD}/A}$$
- **Cobertura Global:** Incluye todas las monedas de G10 (`EUR`, `JPY`, `GBP`, `CHF`, `AUD`, `CAD`, `NZD`, `SEK`, `NOK`), todas las de Latinoamérica (`BRL`, `MXN`, `ARS`, `CLP`, `COP`, `PEN`, `UYU`, etc.), todas las de Asia-Pacífico (`CNY`/`CNH`, `INR`, `KRW`, `SGD`, `HKD`, `TWD`, `THB`, `IDR`, `MYR`, `PHP`, `VND`), Europa Emergente (`PLN`, `CZK`, `HUF`, `RON`, `TRY`) y Medio Oriente / África (`ILS`, `AED`, `SAR`, `QAR`, `ZAR`, `EGP`, `NGN`).

---

### Categoría 8: Materias Primas (`COMMODITY` — 26 Materias Primas Aprobadas)
- **Energía (6):** `WTI`, `BRENT`, `NG` (Gas Natural EE.UU.), `TTF` (Gas Natural Europa), `RBOB` (Gasolina), `HO` (Heating Oil / Diésel).
- **Metales Preciosos (4):** `XAU` (Oro), `XAG` (Plata), `XPT` (Platino), `XPD` (Paladio).
- **Metales Industriales y Baterías (6):** `HG` (Cobre), `ALI` (Aluminio), `IRON` (Mineral de Hierro), `NICKEL` (Níquel), `ZINC` (Zinc), `LITHIUM` (Litio).
- **Agrícolas, Softs y Ganadería (10):** `ZS` (Soja), `ZM` (Harina de Soja), `ZL` (Aceite de Soja), `ZC` (Maíz), `ZW` (Trigo), `KC` (Café), `CC` (Cacao), `SB` (Azúcar), `CT` (Algodón), `LE` (Ganado Vacuno).

---

### Categoría 9: Derivados de Mayor Volumen, Volatilidad y Opciones Líquidas (`DERIVATIVES_VOL`)
1. **Índices de Volatilidad Implícita (6):** `VIX`, `VXN`, `MOVE`, `V2X`, `GVZ`, `OVX`.
2. **Futuros de Índices, Tasas y Perpetuos de Mayor Volumen (15):**
   - *Índices:* `ES` (S&P 500), `NQ` (Nasdaq), `RTY` (Russell), `YM` (Dow), `FESX` (Euro Stoxx), `FDAX` (DAX).
   - *Tasas/Bonos:* `SR3` (SOFR 3M), `ZN` (10Y T-Note), `ZB` (30Y T-Bond), `ZF` (5Y T-Note), `ZT` (2Y T-Note), `FGBL` (Euro-Bund).
   - *Perpetuos Cripto:* `BTC-PERP`, `ETH-PERP`, `SOL-PERP`.
3. **Opciones sobre Acciones de Mayor Volumen (*High-Volume Equity Options*):**
   - **Subyacentes habilitados:** Las acciones del S&P 500 / Nasdaq-100 e índices/ETFs con mayor volumen diario de contratos de opciones (`SPY`, `QQQ`, `NVDA`, `TSLA`, `AAPL`, `AMD`, `AMZN`, `META`, `MSFT`, `GOOGL`, `NFLX`, `AVGO`, `PLTR`, `MU`, `INTC`, `COIN`, `IWM`, `TLT`, `GLD`).
   - **Regla Estricta de Filtrado de Liquidez (Anti-Distorsión):**
     - **Se descartan automáticamente** todos los strikes con `Volumen diario < 500 contratos`, `Open Interest < 1.000 contratos` o `Spread Bid-Ask > 8%` de la prima.
     - Solo se conservan los vencimientos líquidos (*Front Weekly*, *Monthly OPEX* a `30D`, `60D`, `90D`) y los strikes en el rango líquido (`Delta 10Δ a 90Δ` / `±15%` del spot), garantizando que la curva de volatilidad implícita (*IV Smile*), el *25Δ Put/Call Skew* y la exposición *Gamma (`GEX`)* reflejen dinero institucional real sin distorsiones por primas ilíquidas.

---

### Categoría 10: Cash y Mercado Monetario (`CASH` — 13 Instrumentos Aprobados)
- **Tasas Overnight (5):** `SOFR`, `EFFR`, `ESTR`, `SONIA`, `TONAR`.
- **Letras del Tesoro T-Bills (3):** `UST-1M-BILL`, `UST-3M-BILL`, `UST-6M-BILL`.
- **ETFs Monetarios y Liquidez Fed (3):** `SGOV`, `BIL`, `FED-RRP`.
- **Efectivo Digital / Stablecoins (2):** `USDT`, `USDC`.

---

## 3. Política de Aplanado Progresivo (*Downsampling*) y Purga (*Rolling TTL*) — Costo `$0.00`

Para evitar que la acumulación histórica de datos dispare el almacenamiento o el costo en GCP, Neon, Atlas o BigQuery, los pipelines aplican **3 reglas automáticas de compactación diaria**:

### Regla 1: Aplanado Temporal de Series OHLCV (*Time-Series Downsampling*)
| Antigüedad del Dato | Resolución Conservada | Acción Automática de Compactación | Ahorro de Espacio |
|---|---|---|---|
| **0 a 48 horas** | Velas de `1m` / `5m` | Se mantienen en vivo para el streaming intradía | Base de corto plazo |
| **2 a 30 días** | **1 vela por hora (`1H`)** | Aplana `60` velas de `1m` en `1` fila horaria (`O, H, L, C, Vol, VWAP`) y **borra los minutos** | **Reduce 60x** |
| **30 días a 2 años** | **1 fila por día (`1D`)** | Aplana las `24` horas en `1` fila diaria y **borra las horas** | **Reduce 1.440x** |
| **Más de 2 años** | **1 fila por semana (`1W`)** | Aplana `5` ruedas diarias en `1` vela semanal y **borra el detalle diario antiguo** | **Reduce 7.200x** |

### Regla 2: Aplanado y Eliminación de Datos Efímeros (Opciones, Curvas y Noticias)
1. **Cadenas de Opciones (`DERIVATIVES_VOL`):**
   - **En el día:** Solo se guardan los strikes que superan el filtro de volumen.
   - **Al cierre diario:** Toda la cadena de opciones de cada acción se **aplana en 1 única fila resumen diaria** (`ATM_IV_30D`, `Skew_25D`, `Put_Call_Vol_Ratio`, `Net_GEX_USD`, `Total_Call_OI`, `Total_Put_OI`) y **se eliminan todas las filas individuales de strikes del día anterior**.
2. **Curvas Soberanas (`RATES`) y Cruces FX (`FX`):**
   - **Últimos 90 días:** Se conserva el vector diario de cada país y de cada `USD/XXX`.
   - **Más de 90 días:** Se conserva `1` corte semanal de cierre de curva por país, suficiente para comparar dónde estaba la curva hace `1M`, `6M`, `1Y` o `5Y` con peso casi nulo (`< 2 MB`).
3. **Noticias y Sentimiento (`MongoDB Atlas M0`):**
   - **Últimos 30 días:** Se conservan los titulares con un índice automático `TTL = 30 días`.
   - **Más de 30 días:** El texto del titular se elimina solo y únicamente queda guardado el **score diario promedio ponderado de sentimiento** (`1 float por activo por día`).

### Regla 3: Techo Fijo de Almacenamiento y FinOps
- Con este esquema de **Aplanado + Eliminación**, el volumen total en base de datos alcanza una **meseta máxima estacionaria de `~45 a 60 MB`** (apenas ~10% de los `512 MB` gratuitos de Neon Postgres y ~0.5% de BigQuery) y **no vuelve a crecer**, manteniendo el gasto de almacenamiento y bases de datos en **`$0.00/mes` de forma permanente**.
