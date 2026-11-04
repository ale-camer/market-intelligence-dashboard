/* ═══════════════════════════════════════════════════════════════════════════
   CONTENIDO TÉCNICO PROFUNDO DE LOS MODALES "PROFUNDIZAR" (21 SECCIONES)
   - Cada sección cuenta con pestañas simples (modalTabs) estilo Docker Docs.
   - Cada pestaña incluye:
     1. intro: explicación conversacional de la lógica.
     2. math: fórmula matemática estructurada (fracción real / ecuación + leyenda de variables).
     3. lead + bullets: escala de lectura práctica en la app con valores entre paréntesis.
     4. example: caso numérico concreto y fácil de seguir.
   ═══════════════════════════════════════════════════════════════════════════ */

export const GUIDE_MODALS_BY_SECTION = {
    /* ─────────────────────────────────────────────────────────────────────────
       CAPÍTULO 2: MARKETS • SCREENER
       ───────────────────────────────────────────────────────────────────────── */
    'scr-categories': [
        {
            id: 'cat-liquidity',
            label: 'Filtro de Liquidez (ADV)',
            intro: 'Para que un activo pueda operarse sin que una sola orden distorsione su precio, la plataforma exige un umbral mínimo de volumen diario promedio en dólares durante los últimos 20 días hábiles.',
            math: {
                lhs: 'ADV (20d)',
                numerator: '∑ ( Precio Cierreᵢ × Volumen Operadoᵢ )',
                denominator: '20 ruedas hábiles',
                vars: [
                    'Precio Cierreᵢ: cotización oficial de cierre del día i expresada en USD.',
                    'Volumen Operadoᵢ: cantidad total de unidades negociadas en esa jornada.'
                ]
            },
            lead: 'Según el volumen promedio diario, el catálogo clasifica la profundidad de cada instrumento:',
            bullets: [
                {
                    bold: 'Liquidez institucional alta',
                    code: '> $500M diarios',
                    text: 'Permite entrar y salir con posiciones grandes de inmediato sin mover el precio de mercado.'
                },
                {
                    bold: 'Liquidez estándar de catálogo',
                    code: '$50M a $500M diarios',
                    text: 'Apto para carteras diversificadas con costos de compra/venta muy bajos.'
                },
                {
                    bold: 'Vigilancia de spread',
                    code: '< $50M diarios',
                    text: 'En momentos de volatilidad conviene revisar la apertura de puntas antes de ejecutar órdenes grandes.'
                }
            ],
            example: 'Si una acción cotiza a $200 y negocia en promedio 5 millones de acciones por rueda durante el último mes, su volumen promedio diario (ADV) es de $1,000 millones ($1.0B).'
        },
        {
            id: 'cat-fx-norm',
            label: 'Normalización a USD',
            intro: 'Como el catálogo combina bonos europeos, índices asiáticos, materias primas y criptomonedas, todos los flujos de volumen se convierten a dólares estadounidenses en tiempo real para poder compararlos en una misma escala.',
            math: {
                lhs: 'Volumen USD',
                inline: 'Volumen Moneda Local × Tipo de Cambio Spot (CCY / USD)',
                vars: [
                    'Volumen Moneda Local: monto operado en la divisa original del mercado (EUR, JPY, GBP, BRL, etc.).',
                    'Tipo de Cambio Spot: cotización vigente en el motor de 61 divisas.'
                ]
            },
            lead: 'Esta conversión impacta directamente en dos lugares de la pantalla:',
            bullets: [
                {
                    bold: 'Ranking general de la vista Todos',
                    code: '213 activos',
                    text: 'Ordena los instrumentos de mayor a menor movimiento real de dinero a nivel mundial.'
                },
                {
                    bold: 'Tarjeta de Volumen Agregado',
                    code: 'Volumen 24h en $B',
                    text: 'Permite sumar sin distorsiones el volumen de activos que cotizan en distintos países.'
                }
            ],
            example: 'Si un bono alemán opera €4,000 millones en el día y el cruce EUR/USD cotiza a 1.08, el sistema computa $4.32B en el pulso global.'
        }
    ],

    'scr-pulse': [
        {
            id: 'rsi',
            label: 'AVG RSI (14)',
            intro: '¿Cómo medís si un mercado viene subiendo con fuerza genuina o si ya subió demasiado rápido y está agotado? El Índice de Fuerza Relativa (RSI) compara el promedio de las subas contra el promedio de las bajas de las últimas 14 ruedas en una escala de 0 a 100.',
            math: {
                lhs: 'RSI (14) = 100 −',
                numerator: '100',
                denominator: '1 + ( Promedio de Subas₁₄ / Promedio de Bajas₁₄ )',
                vars: [
                    'Promedio de Subas₁₄: media suavizada de los puntos ganados en los días alcistas de las últimas 14 ruedas.',
                    'Promedio de Bajas₁₄: media suavizada de los puntos perdidos en los días bajistas del mismo período.'
                ]
            },
            lead: 'Así se interpretan los tres tramos de la escala en el anillo circular:',
            bullets: [
                {
                    bold: 'Fuerza compradora y sobrecompra',
                    code: '70 a 100',
                    text: 'Las subas superan ampliamente a las bajas recientes. Muestra gran envión alcista, aunque por encima de 70 advierte que el precio puede necesitar una pausa.'
                },
                {
                    bold: 'Zona de equilibrio',
                    code: '30 a 70',
                    text: 'El mercado se mueve a un ritmo sostenible. Cruzar el nivel intermedio (> 50 en verde) confirma dominio comprador, mientras que caer debajo (< 50 en rojo) indica dominio vendedor.'
                },
                {
                    bold: 'Castigo y sobreventa',
                    code: '0 a 30',
                    text: 'Las caídas fueron tan seguidas y pronunciadas que el activo empieza a quedar estadísticamente barato y propenso a un rebote.'
                }
            ],
            example: 'Si en las últimas 14 ruedas un grupo de acciones subió en promedio $2 por día alcista y sólo cayó $1 por día bajista, su relación de fuerza es 2 y su RSI marca 66.7 (empuje alcista en verde).'
        },
        {
            id: 'p06',
            label: 'Régimen Normal (P-06)',
            intro: 'Un activo puede parecer tranquilo si sólo mirás su precio, pero estar sufriendo al mismo tiempo un salto extraño de volumen y una apertura anormal en sus puntas de compra y venta. El motor Isolation Forest (P-06) cruza esas variables a la vez para detectar comportamientos atípicos.',
            math: {
                lhs: 'Score P-06 =',
                inline: '2 ^ [ − E(h(x)) / c(n) ]   (Escala de 0.00 a 1.00)',
                vars: [
                    'E(h(x)): cantidad promedio de cortes aleatorios necesarios para aislar el comportamiento de hoy del resto del historial.',
                    'x: vector de 4 variables (Retorno 24h, Vol Z-Score 20d, Volatilidad Realizada 30d y Spread en bps).'
                ]
            },
            lead: 'Cuanto más raro es el movimiento de hoy, más rápido queda aislado y más cerca de 1.00 da el puntaje:',
            bullets: [
                {
                    bold: 'Régimen normal',
                    code: '0.00 a 0.49',
                    text: 'El precio, el volumen y la liquidez se mueven en sintonía con el promedio histórico del activo.'
                },
                {
                    bold: 'Actividad elevada',
                    code: '0.50 a 0.64',
                    text: 'Al menos una de las variables empezó a despegarse de su comportamiento habitual; conviene seguir de cerca el flujo de órdenes.'
                },
                {
                    bold: 'Dislocación o anomalía crítica',
                    code: '0.65 a 1.00',
                    text: 'El activo registra un comportamiento estadísticamente extremo. En el módulo de carteras, superar este umbral activa el freno de seguridad.'
                }
            ],
            example: 'Si un bono soberano apenas se mueve un 0.1% en precio pero su volumen se multiplica por cuatro y su spread se triplica en minutos, el detector cruza los tres datos y eleva su puntaje a 0.74 (Dislocación en rojo).'
        },
        {
            id: 'zscore',
            label: 'Desvío Volumen (Z-Score)',
            intro: 'Decir que hoy se operaron 500 millones de dólares es muchísimo para una empresa mediana, pero muy poco para el S&P 500. El Z-Score de Volumen lleva todos los activos a una misma unidad universal: cuántas desviaciones estándar (σ) se aleja el volumen de hoy respecto de su propio promedio de 20 ruedas.',
            math: {
                lhs: 'Vol Z-Score (20d) =',
                numerator: 'Volumen Hoy (24h) − Promedio de Volumen (20d)',
                denominator: 'Desvío Estándar del Volumen (20d)',
                vars: [
                    'Promedio de Volumen (20d): volumen habitual del activo durante el último mes hábil.',
                    'Desvío Estándar (20d): cuánto suele variar normalmente ese volumen de un día para otro.'
                ]
            },
            lead: 'Así podés comparar cualquier activo en la misma escala de unidades sigma (σ):',
            bullets: [
                {
                    bold: 'Actividad habitual',
                    code: '-1.0σ a +1.0σ',
                    text: 'El volumen del día está completamente dentro de la rutina de las últimas cuatro semanas.'
                },
                {
                    bold: 'Participación alta',
                    code: '+1.0σ a +2.0σ',
                    text: 'Hay un interés superior al promedio que empieza a darle validez a la tendencia del día.'
                },
                {
                    bold: 'Choque institucional',
                    code: '> +2.0σ',
                    text: 'Ocurre en menos del 5% de las ruedas del año y suele reflejar la entrada o salida masiva de grandes fondos.'
                }
            ],
            example: 'Si una acción suele operar $100M diarios con una variación habitual de ±$20M y hoy negocia $160M, está $60M por encima de su media, lo que equivale exactamente a +3.0σ.'
        }
    ],

    'scr-table': [
        {
            id: 'tbl-rates',
            label: 'Renta Fija (2s10s y DV01)',
            intro: 'Cuando filtrás Bonos o Tasas en la tabla, aparecen las dos métricas clave para evaluar deuda soberana: la pendiente de la curva (2s10s) y el valor monetario de un punto básico (DV01).',
            math: {
                lhs: 'Spread 2s10s =',
                inline: '( Tasa Bono 10 Años − Tasa Bono 2 Años ) × 100 bps',
                vars: [
                    '1 punto básico (1 bp): equivale a 0.01% de rendimiento.',
                    'DV01 ($ / $1M): cuántos dólares gana o pierde una posición de $1 millón si la tasa se mueve 1 punto básico.'
                ]
            },
            lead: 'Cómo leer estos dos números en la grilla:',
            bullets: [
                {
                    bold: 'Curva normal o positiva',
                    code: '2s10s > 0 bps',
                    text: 'Los bonos a 10 años pagan más tasa que los de 2 años, reflejando una expectativa de crecimiento económico saludable.'
                },
                {
                    bold: 'Curva invertida',
                    code: '2s10s < 0 bps',
                    text: 'Las tasas cortas superan a las largas; históricamente advierte enfriamiento económico o restricción monetaria.'
                }
            ],
            example: 'Si el Treasury a 10 años rinde 4.20% y el de 2 años rinde 4.55%, la columna 2s10s marca -35 bps (curva invertida en rojo).'
        },
        {
            id: 'tbl-equity',
            label: 'Acciones (P/E y Margen)',
            intro: 'Al filtrar Acciones S&P/NDX, la tabla despliega el múltiplo de ganancias proyectadas (P/E Forward) y el Margen Bruto operativo para que compares valoración contra rentabilidad.',
            math: {
                lhs: 'P/E Forward =',
                numerator: 'Precio Actual de la Acción',
                denominator: 'Ganancia por Acción Estimada (Próximos 12 Meses)',
                vars: [
                    'P/E Forward: cuántos años de ganancias futuras estás pagando al precio de hoy.',
                    'Margen Bruto (%): porcentaje de las ventas que queda como ganancia bruta tras descontar el costo directo.'
                ]
            },
            lead: 'Qué buscar al cruzar ambas columnas:',
            bullets: [
                {
                    bold: 'Valoración exigente vs moderada',
                    code: 'P/E > 30x vs < 18x',
                    text: 'Un múltiplo alto indica que el mercado descuenta un fuerte crecimiento futuro; uno bajo suele reflejar empresas maduras o de valor.'
                },
                {
                    bold: 'Poder de fijación de precios',
                    code: 'Margen Bruto > 50%',
                    text: 'Márgenes elevados muestran empresas con ventajas competitivas fuertes capaces de defender sus ganancias ante la inflación.'
                }
            ],
            example: 'Si una acción cotiza a $150 y se estima que ganará $6 por acción en los próximos 12 meses, su P/E Forward es de 25.0x.'
        },
        {
            id: 'tbl-deriv',
            label: 'Derivados, FX y Materias Primas',
            intro: 'Para los mercados de opciones, divisas y futuros físicos, las dos columnas dinámicas muestran el costo implícito del riesgo o el premio por mantener la posición en el tiempo.',
            math: {
                lhs: 'Breakeven Straddle (%) ≈',
                inline: 'Volatilidad Implícita ATM (30d) × √( 30 / 365 )',
                vars: [
                    'ATM IV (Derivados): volatilidad anualizada que el mercado de opciones descuenta para los próximos 30 días.',
                    'Carry 10Y (FX) y Roll Yield (Commodities): ganancia o costo anual por diferencial de tasas o renovación de futuros.'
                ]
            },
            lead: 'Cómo aprovechar estas columnas según el activo:',
            bullets: [
                {
                    bold: 'En Derivados',
                    code: 'ATM IV y Skew 25Δ',
                    text: 'Te dicen qué porcentaje de movimiento espera el mercado y si las opciones para cubrir caídas (Puts) están caras.'
                },
                {
                    bold: 'En Divisas y Materias Primas',
                    code: 'Carry Spread y Roll Yield',
                    text: 'Muestran en verde si mantener el activo te paga una renta adicional a favor o en rojo si tiene un costo de arrastre.'
                }
            ],
            example: 'Si una opción muestra una volatilidad implícita (ATM IV) del 35% anual, el mercado descuenta un movimiento cercano al ±10% para los próximos 30 días.'
        }
    ],

    'scr-orbital': [
        {
            id: 'orb-polar',
            label: 'Mapeo Radial del Radar',
            intro: 'Para ubicar hasta 45 activos en los tres anillos del radar sin que se encimen, la vista Orbital transforma el valor del indicador elegido en una distancia al centro (radio r) normalizada entre el mínimo y el máximo del grupo.',
            math: {
                lhs: 'Radio Normalizado (r) =',
                numerator: 'Valor del Activo − Valor Mínimo del Grupo',
                denominator: 'Valor Máximo del Grupo − Valor Mínimo del Grupo',
                vars: [
                    'r → 0 (Anillo Interior): concentra a los activos con mayor intensidad o desvío positivo.',
                    'r → 1 (Anillo Exterior): ubica a los activos periféricos o de menor lectura relativa.'
                ]
            },
            lead: 'Cómo leer la posición y el color de cada planeta en el radar:',
            bullets: [
                {
                    bold: 'Anillo interior de foco',
                    code: 'Centro del radar',
                    text: 'Reúne a los activos líderes del indicador que seleccionaste arriba para que tu vista vaya primero a lo más importante.'
                },
                {
                    bold: 'Semántica de color histórica',
                    code: 'Verde vs Rojo',
                    text: 'El nodo se ilumina en verde cuando supera su media histórica de forma favorable y en rojo cuando refleja caída o estrés.'
                }
            ],
            example: 'Si ordenás el radar por Desvío de Volumen (Z-Score), el activo con +3.4σ se ubica en el anillo central brillante, mientras que uno con 0.1σ queda en la órbita externa.'
        }
    ],

    /* ─────────────────────────────────────────────────────────────────────────
       CAPÍTULO 3: MARKETS • ANALYTICS
       ───────────────────────────────────────────────────────────────────────── */
    'ana-technical': [
        {
            id: 'tech-sma-bb',
            label: 'SMA (20) y Bandas de Bollinger',
            intro: 'La Media Móvil Simple de 20 períodos (SMA 20) marca la tendencia base del activo, mientras que las Bandas de Bollinger dibujan un canal dinámico sumando y restando dos desviaciones estándar (2σ) alrededor de esa media.',
            math: {
                lhs: 'Bandas (20, 2σ) =',
                inline: 'SMA(20) ± [ 2 × Desvío Estándar de Precios (20 períodos) ]',
                vars: [
                    'SMA(20): promedio aritmético de los últimos 20 cierres.',
                    'Ancho de Banda (BB Width): distancia porcentual entre la banda superior y la inferior.'
                ]
            },
            lead: 'Por estadística, cerca del 95% de las cotizaciones ocurren dentro de las dos bandas:',
            bullets: [
                {
                    bold: 'Precio sobre la media',
                    code: 'Precio > SMA 20',
                    text: 'Indica que la tendencia de corto plazo es alcista y la media suele actuar como piso de soporte.'
                },
                {
                    bold: 'Toque de banda superior o inferior',
                    code: '±2σ',
                    text: 'Advierte que el precio se estiró demasiado rápido respecto de su promedio reciente y puede tomar respiro.'
                },
                {
                    bold: 'Compresión de bandas',
                    code: 'BB Width bajo',
                    text: 'Cuando las bandas se angostan mucho, el mercado acumula energía antes de un movimiento fuerte.'
                }
            ],
            example: 'Si la SMA (20) de una acción es $100 y su desvío estándar de 20 ruedas es $4, la banda superior se ubica en $108 y la inferior en $92.'
        },
        {
            id: 'tech-vwap',
            label: 'VWAP Institucional',
            intro: 'A diferencia de una media común que le da el mismo peso a todas las horas del día, el VWAP pondera cada precio por la cantidad de dinero que realmente se operó en ese nivel. Es la referencia principal que usan las mesas institucionales.',
            math: {
                lhs: 'VWAP =',
                numerator: '∑ ( Precio Típicoᵢ × Volumen Operadoᵢ )',
                denominator: '∑ Volumen Operadoᵢ',
                vars: [
                    'Precio Típicoᵢ: promedio entre el máximo, mínimo y cierre de cada vela.',
                    'Volumen Operadoᵢ: volumen negociado específicamente en ese tramo.'
                ]
            },
            lead: 'Cómo usan los operadores profesionales la línea de VWAP:',
            bullets: [
                {
                    bold: 'Control de ejecución',
                    code: 'Comprar bajo el VWAP',
                    text: 'Si un fondo institucional compra por debajo del VWAP del período, consiguió un precio mejor que el promedio ponderado del mercado.'
                },
                {
                    bold: 'Nivel de defensa de tendencia',
                    code: 'Soporte / Resistencia',
                    text: 'Mientras el activo se mantenga por encima del VWAP, quienes compraron en el período están en ganancia promedio.'
                }
            ],
            example: 'Si a $100 se operaron 1 millón de acciones y a $110 sólo se operaron 100 mil acciones, la media simple diría $105, pero el VWAP marca $100.91 porque casi todo el dinero se negoció en $100.'
        }
    ],

    'ana-micro': [
        {
            id: 'micro-spread',
            label: 'Dislocación de Spread (bps)',
            intro: 'El spread es la diferencia entre el mejor precio de venta (Ask) y el mejor precio de compra (Bid) en el libro de órdenes. Cuando los formadores de mercado perciben riesgo o falta de liquidez, abren esa brecha para protegerse.',
            math: {
                lhs: 'Spread (bps) =',
                numerator: '( Precio Ask − Precio Bid )',
                denominator: 'Precio Medio (Mid-Price)',
                rhs: '× 10,000',
                vars: [
                    'Precio Ask / Bid: punta vendedora y punta compradora vigentes en el libro.',
                    '10,000: factor de conversión para expresar la diferencia en puntos básicos (bps).'
                ]
            },
            lead: 'Qué te indica la lectura de Spread Dislocation en el riel izquierdo:',
            bullets: [
                {
                    bold: 'Libro profundo y fluido',
                    code: 'Spread estable en verde',
                    text: 'Hay abundante liquidez en ambas puntas y el costo implícito de entrar o salir es mínimo.'
                },
                {
                    bold: 'Fricción o retiro de liquidez',
                    code: 'Salto en bps',
                    text: 'Suele ocurrir segundos antes de anuncios macroeconómicos o durante ventas de pánico, encareciendo la ejecución.'
                }
            ],
            example: 'Si un activo tiene punta compradora en $99.95 y vendedora en $100.05, la diferencia de $0.10 sobre $100 equivale a 10 puntos básicos (10 bps).'
        }
    ],

    'ana-engines': [
        {
            id: 'eng-options',
            label: 'Opciones (Black-Scholes y Griegas)',
            intro: 'En el motor de opciones, la plataforma grafica dos curvas de ganancias y pérdidas (P&L): cómo terminaría la estrategia el día del vencimiento y cuánto vale hoy mismo (T+0) aplicando el modelo Black-Scholes.',
            math: {
                lhs: 'Call (T+0) =',
                inline: 'S · N(d₁) − K · e^(−r·T) · N(d₂)',
                vars: [
                    'S y K: precio actual del activo subyacente (Spot) y precio de ejercicio de la opción (Strike).',
                    'Griegas Netas: Δ Delta (sensibilidad al precio), Γ Gamma (aceleración de Delta), Θ Theta (desgaste diario por tiempo) y ν Vega (sensibilidad a la volatilidad).'
                ]
            },
            lead: 'Cómo leer las Griegas de tu estrategia en las píldoras del riel izquierdo:',
            bullets: [
                {
                    bold: 'Dirección y aceleración',
                    code: 'Δ Delta / Γ Gamma',
                    text: 'Un Delta positivo gana cuando el activo sube; un Gamma positivo hace que ganes cada vez más rápido si el movimiento se acelera.'
                },
                {
                    bold: 'Paso del tiempo e incertidumbre',
                    code: 'Θ Theta / ν Vega',
                    text: 'Theta te indica cuántos dólares pierde o gana la posición por cada día que pasa; Vega cuánto cambia si sube un 1% la volatilidad implícita.'
                }
            ],
            example: 'Un Long Straddle (comprar Call y Put en el mismo strike) tiene Delta cercano a 0 (no importa si sube o baja), pero Vega positivo y necesita que el precio se mueva más allá de sus dos puntos de equilibrio (Breakevens).'
        },
        {
            id: 'eng-rates',
            label: 'Curvas Soberanas (Butterfly y DV01)',
            intro: 'El motor de renta fija compara los rendimientos desde 3 meses hasta 30 años de 42 países y calcula tanto la pendiente (2s10s) como la curvatura del tramo medio (Butterfly 2s5s10s) y la sensibilidad monetaria (DV01).',
            math: {
                lhs: 'Butterfly (2s5s10s) =',
                inline: '( 2 × Tasa 5Y ) − ( Tasa 2Y + Tasa 10Y )',
                vars: [
                    'Tasa 2Y, 5Y, 10Y: rendimientos soberanos a 2, 5 y 10 años del país seleccionado.',
                    'Tasa Real 10Y: rendimiento nominal a 10 años menos la tasa de referencia o inflación implícita.'
                ]
            },
            lead: 'Para qué sirve cada indicador en el análisis de bonos:',
            bullets: [
                {
                    bold: 'Curvatura del tramo medio',
                    code: 'Butterfly 2s5s10s',
                    text: 'Mide si el tramo de 5 años está caro o barato en relación con los extremos de 2 y 10 años.'
                },
                {
                    bold: 'Riesgo de duración en dólares',
                    code: 'DV01 por $1M',
                    text: 'Te dice exactamente cuántos dólares varía una cartera de un millón de dólares ante un movimiento de 0.01% en la tasa.'
                }
            ],
            example: 'Un bono a 10 años con un DV01 de $820 por millón perderá aproximadamente $82,000 si las tasas de mercado suben 100 puntos básicos (+1.00%).'
        },
        {
            id: 'eng-fx-comm',
            label: 'Divisas (Carry) y Futuros (Roll Yield)',
            intro: 'En divisas, cuando un par no cotiza directamente se calcula por triangulación contra el dólar y se mide su diferencial de tasas (Carry). En materias primas, se mide el rendimiento de renovación entre el contrato inmediato y el de 12 meses (Roll Yield).',
            math: {
                lhs: 'Roll Yield Anual (%) =',
                numerator: 'Precio Spot (Front M1) − Precio Futuro (M12)',
                denominator: 'Precio Futuro (M12)',
                rhs: '× 100',
                vars: [
                    'Backwardation (Spot > Futuro): la escasez física hoy hace que renovar futuros genere una ganancia positiva (Roll Yield > 0).',
                    'Contango (Spot < Futuro): los costos de almacenamiento hacen que los futuros sean más caros y renovarlos tenga un costo negativo.'
                ]
            },
            lead: 'Cómo impacta esto en tu bolsillo al mantener una posición:',
            bullets: [
                {
                    bold: 'Carry Trade positivo en divisas',
                    code: 'Carry Spread > 0 bps',
                    text: 'Si comprás una moneda con tasa de interés alta financiándote en una de tasa baja, cobrás ese diferencial a tu favor.'
                },
                {
                    bold: 'Viento a favor en materias primas',
                    code: 'Backwardation en verde',
                    text: 'Cuando los inventarios físicos están bajos, el contrato cercano vale más que el lejano y el inversor gana un rendimiento extra al rolar el contrato.'
                }
            ],
            example: 'Si el petróleo a 1 mes cotiza a $72 y el contrato a 12 meses cotiza a $68, el mercado está en Backwardation con un Roll Yield positivo de +5.88% anual.'
        }
    ],

    /* ─────────────────────────────────────────────────────────────────────────
       CAPÍTULO 4: MARKETS • RESEARCH
       ───────────────────────────────────────────────────────────────────────── */
    'res-hero': [
        {
            id: 'res-score',
            label: 'Nota Ponderada Total',
            intro: 'No todos los activos se mueven por las mismas fuentes: en una empresa pesan mucho los estados contables auditados (SEC 10-K/10-Q), mientras que en el criptomercado o en las divisas pesan más los flujos y comunicados diarios.',
            math: {
                lhs: 'Nota Compuesta =',
                inline: '( Peso_Fund × Puntaje Documental ) + ( Peso_Not × Sentimiento FinBERT )',
                vars: [
                    'Peso_Fund / Peso_Not: ponderación automática según la categoría (p. ej. 80% / 20% en Acciones; 85% / 15% en Tasas).',
                    'Escala Final: va de −100 (máximo pesimismo) a +100 (máxima convicción alcista).'
                ]
            },
            lead: 'Así se traduce el puntaje compuesto en el dictamen superior:',
            bullets: [
                {
                    bold: 'Postura alcista',
                    code: 'BULLISH / Nota > +15',
                    text: 'Los catalizadores documentales y el flujo de noticias superan con claridad a los factores de riesgo.'
                },
                {
                    bold: 'Postura neutral o mixta',
                    code: 'NEUTRAL / -15 a +15',
                    text: 'Fuerzas parejas entre fundamentos y noticias; conviene revisar el acordeón de 10 factores antes de decidir.'
                },
                {
                    bold: 'Postura defensiva o bajista',
                    code: 'BEARISH / Nota < -15',
                    text: 'Predominan las alertas en balances, deterioro de márgenes o titulares adversos.'
                }
            ],
            example: 'En una acción (80% fundamentos / 20% noticias), si los balances arrojan +50 puntos y las noticias del día marcan +20, la Nota Ponderada Total es (0.80 × 50) + (0.20 × 20) = +44.'
        }
    ],

    'res-rag': [
        {
            id: 'rag-pipeline',
            label: 'Búsqueda Verificada (RAG)',
            intro: 'Para evitar que la inteligencia artificial invente cifras, el Chat Documental utiliza Recuperación Aumentada por Generación (RAG): primero busca los párrafos relevantes en los reportes oficiales del activo y recién después redacta la respuesta citando la fuente.',
            math: {
                lhs: 'Similitud Coseno =',
                numerator: 'Vector Consulta (Q) · Vector Documento Oficial (D)',
                denominator: '‖Q‖ × ‖D‖',
                vars: [
                    'Vector Q y D: representaciones numéricas de tu pregunta y de los fragmentos oficiales (10-K, actas FOMC, reportes EIA).',
                    'Guardrail de 3 Capas: filtro que bloquea consultas ajenas a las finanzas o sin respaldo documental.'
                ]
            },
            lead: 'Qué garantiza este mecanismo cuando hacés una pregunta en el chat:',
            bullets: [
                {
                    bold: 'Anclaje en fuentes primarias',
                    code: 'SEC 10-K / FOMC / EIA',
                    text: 'Cada dato de ingresos, deuda, inventarios o tasas proviene del documento regulatorio correspondiente a ese activo.'
                },
                {
                    bold: 'Freno ante preguntas fuera de tema',
                    code: 'Guardrail activo',
                    text: 'Si alguien intenta consultar temas no financieros, el asistente rechaza la consulta y mantiene el foco en el análisis del instrumento.'
                }
            ],
            example: 'Al tocar el chip sobre factores de riesgo en una acción, el motor recupera la sección Item 1A (Risk Factors) de su último formulario 10-K y te resume los puntos críticos.'
        }
    ],

    'res-pulse24h': [
        {
            id: 'finbert-nlp',
            label: 'Puntaje Neuronal FinBERT',
            intro: 'Un diccionario común suele confundir palabras financieras (por ejemplo, "caída en los costos" o "reducción de deuda" son noticias excelentes aunque usen la palabra caída o reducción). FinBERT es una red neuronal entrenada específicamente con textos financieros.',
            math: {
                lhs: 'Polaridad FinBERT =',
                inline: '[ P(Positivo) − P(Negativo) ] × 100   (Escala de −100 a +100)',
                vars: [
                    'P(Positivo) y P(Negativo): probabilidades asignadas por el modelo a que el titular sea alcista o bajista para el activo.',
                    'Curva 24h: promedio móvil exponencial de los titulares de las últimas 24 horas.'
                ]
            },
            lead: 'Cómo califica cada nodo en la línea de tiempo de la derecha:',
            bullets: [
                {
                    bold: 'Titular catalizador',
                    code: '+20 a +100 en verde',
                    text: 'Superación de ganancias estimadas, mejoras de calificación crediticia o recortes de tasas favorables.'
                },
                {
                    bold: 'Cable informativo neutro',
                    code: '-19 a +19 en ámbar',
                    text: 'Anuncios operativos de rutina que no alteran la valoración estructural del instrumento.'
                },
                {
                    bold: 'Titular de riesgo',
                    code: '-20 a -100 en rojo',
                    text: 'Advertencias regulatorias, caídas de márgenes, huelgas o datos de inflación peores a lo esperado.'
                }
            ],
            example: 'Si ante un titular el modelo asigna 82% de probabilidad positiva, 12% neutral y 6% negativa, el nodo muestra un impacto neto de +76 en verde.'
        }
    ],

    /* ─────────────────────────────────────────────────────────────────────────
       CAPÍTULO 5: PORTFOLIO • CONSTRUCTOR
       ───────────────────────────────────────────────────────────────────────── */
    'p1-pills': [
        {
            id: 'p1-cagr-sharpe',
            label: 'CAGR, Sharpe y Sortino',
            intro: 'Las dos primeras tarjetas superiores miden cuánto crece tu capital por año (CAGR) y qué tan eficiente es ese crecimiento en relación con los sobresaltos que tenés que soportar (Sharpe y Sortino).',
            math: {
                lhs: 'Sharpe Ratio =',
                numerator: 'Retorno Anual de Cartera (Rp) − Tasa Libre de Riesgo (Rf)',
                denominator: 'Volatilidad Anual de Cartera (σp)',
                vars: [
                    'Rf (4.30%): rendimiento base que podrías obtener sin riesgo en letras del Tesoro.',
                    'Sortino Ratio: usa la misma fórmula pero en el denominador sólo penaliza la volatilidad de los días negativos (caídas).'
                ]
            },
            lead: 'Cómo evaluar la calidad de tu cartera con estos números:',
            bullets: [
                {
                    bold: 'Cartera eficiente',
                    code: 'Sharpe > 1.00',
                    text: 'El exceso de retorno que lográs por encima de la tasa sin riesgo supera ampliamente a la volatilidad asumida.'
                },
                {
                    bold: 'Desempeño sobresaliente',
                    code: 'Sharpe > 1.80 / Sortino > 2.20',
                    text: 'Indica una combinación muy bien diversificada donde las subas son consistentes y las caídas están contenidas.'
                }
            ],
            example: 'Si tu cartera rinde 15.3% anual, la tasa libre de riesgo es 4.3% y tu volatilidad anual es del 10%, tu exceso de retorno es 11% y tu Sharpe Ratio es 1.10.'
        },
        {
            id: 'p1-var-dd',
            label: 'VaR 95%, CVaR 99% y Drawdown',
            intro: 'La tercera y cuarta tarjeta responden cuánto podés perder en un día malo pero estadísticamente normal (VaR 95%), cuánto en un día de pánico extremo (CVaR 99%) y cuál fue el retroceso más grande desde un pico anterior (Max Drawdown).',
            math: {
                lhs: 'VaR 95% (1 Día) =',
                inline: 'Capital Total × [ −μ_diario + ( 1.645 × σ_diaria ) ]',
                vars: [
                    '1.645: factor estadístico que cubre el 95% de las ruedas normales del año (19 de cada 20 días).',
                    'CVaR 99% (Expected Shortfall): pérdida promedio cuando el mercado rompe ese umbral y entra en el 1% de los peores días.'
                ]
            },
            lead: 'Qué diferencia práctica hay entre mirar el VaR y mirar el Max Drawdown:',
            bullets: [
                {
                    bold: 'Riesgo de una sola jornada',
                    code: 'VaR 95% 1D en USD',
                    text: 'Te prepara psicológica y financieramente para lo que puede oscilar tu cuenta en una mala rueda sin que signifique que la estrategia falló.'
                },
                {
                    bold: 'Resistencia en una racha adversa',
                    code: 'Max Drawdown 12M',
                    text: 'Mide la caída acumulada de punta a punta desde el punto más alto hasta el piso antes de volver a recuperarse.'
                }
            ],
            example: 'En una cartera de $100,000 con un VaR 95% diario de 1.45% ($1,450), en 19 de cada 20 ruedas hábiles tus pérdidas diarias no superarán los $1,450.'
        }
    ],

    'p1-xray': [
        {
            id: 'xray-lookthrough',
            label: 'Solapamiento X-Ray (#12)',
            intro: 'Cuando comprás un ETF como SPY o QQQ, adentro estás comprando decenas de acciones. Si además tenés compradas algunas de esas mismas acciones de forma directa, tu exposición real es la suma de las dos cosas.',
            math: {
                lhs: 'Peso Real del Activo i =',
                inline: 'Peso Directoᵢ + ∑ ( Peso del ETFₖ × Porcentaje de i dentro del ETFₖ )',
                vars: [
                    'Peso Directoᵢ: porcentaje de tu cartera asignado directamente a la acción i.',
                    'Porcentaje dentro del ETFₖ: ponderación oficial que tiene esa empresa dentro del índice o fondo k.'
                ]
            },
            lead: 'Por qué es clave revisar esta primera pestaña antes de cerrar la cartera:',
            bullets: [
                {
                    bold: 'Visibilidad de concentración oculta',
                    code: 'Directo + Indirecto',
                    text: 'Desarma automáticamente cada ETF de tu cartera y te muestra una sola barra con el porcentaje verdadero que tenés en cada compañía.'
                },
                {
                    bold: 'Alerta de exceso',
                    code: '> 20% en rojo',
                    text: 'Si la suma total supera el umbral prudente de concentración en un solo nombre, la fila se ilumina para que puedas rebalancear.'
                }
            ],
            example: 'Si pusiste 15% de tu cartera en NVDA directo y además tenés 30% en el ETF SPY (donde NVDA pesa cerca del 7%), el X-Ray te revela que tu exposición real a NVDA es 15% + (30% × 7%) = 17.1%.'
        },
        {
            id: 'xray-brinson',
            label: 'Descomposición Alpha Brinson (#2)',
            intro: 'Cuando tu cartera le gana (o pierde contra) su índice de referencia, el modelo Brinson-Fachler separa exactamente de dónde salió esa diferencia: ¿acertaste en qué sectores sobreponderar o acertaste eligiendo los mejores activos dentro de cada sector?',
            math: {
                lhs: 'Alpha Total (Rp − Rb) =',
                inline: 'Efecto Asignación + Efecto Selección + Efecto Interacción',
                vars: [
                    'Efecto Asignación: (Peso Cartera − Peso Benchmark) × Retorno del Sector en el Benchmark.',
                    'Efecto Selección: Peso en Benchmark × (Retorno de tus Activos − Retorno del Sector).'
                ]
            },
            lead: 'Cómo leer las tres barras de atribución en la tercera pestaña:',
            bullets: [
                {
                    bold: 'Acierto macro o sectorial',
                    code: 'Asignación Sectorial',
                    text: 'Es positivo en verde cuando pusiste más peso que el mercado en las clases de activos que más subieron.'
                },
                {
                    bold: 'Acierto en la puntería de activos',
                    code: 'Selección de Activos',
                    text: 'Es positivo cuando los instrumentos puntuales que elegiste rindieron más que el promedio de su propio sector.'
                }
            ],
            example: 'Si tu cartera le ganó al S&P 500 por +3.20%, esta pestaña te permite ver que +2.10% vino de haber elegido mejores acciones (Selección) y +1.10% de haber tenido más peso en tecnología (Asignación).'
        }
    ],

    /* ─────────────────────────────────────────────────────────────────────────
       CAPÍTULO 6: PORTFOLIO • RIESGO QUANT
       ───────────────────────────────────────────────────────────────────────── */
    'p2-markowitz': [
        {
            id: 'mkw-frontier',
            label: 'Frontera Eficiente y CML',
            intro: 'En el plano de Markowitz, el retorno esperado de una cartera es el promedio ponderado del retorno de sus activos, pero su volatilidad es menor al promedio gracias a que los activos no se mueven 100% iguales.',
            math: {
                lhs: 'Volatilidad de Cartera (σp) =',
                inline: '√ [ ∑ᵢ ∑ⱼ ( wᵢ · wⱼ · σᵢ · σⱼ · ρᵢⱼ ) ]',
                vars: [
                    'wᵢ, wⱼ: porcentaje de capital asignado a los activos i y j.',
                    'ρᵢⱼ (Correlación): grado en que ambos activos se mueven juntos (−1 a +1). Cuanto más bajo es ρᵢⱼ, más se reduce el riesgo total.'
                ]
            },
            lead: 'Qué representan las tres referencias del gráfico:',
            bullets: [
                {
                    bold: 'Mínima Varianza',
                    code: 'Min-Var',
                    text: 'Es el punto más a la izquierda de la curva: la combinación exacta de pesos que logra la menor volatilidad posible.'
                },
                {
                    bold: 'Cartera de Máximo Sharpe y Recta CML',
                    code: 'Max-Sharpe / Tangente CML',
                    text: 'Es el punto donde la recta que parte de la tasa libre de riesgo toca la frontera eficiente, ofreciendo la mayor ganancia por unidad de riesgo.'
                }
            ],
            example: 'Si combinás en partes iguales dos activos que tienen un 20% de volatilidad cada uno pero correlación cero (ρ = 0), la volatilidad de la cartera no es 20%, sino que baja al 14.1%.'
        }
    ],

    'p2-tornado': [
        {
            id: 'tor-cvar',
            label: 'VaR por Activo y Captura',
            intro: 'Para saber qué posición le está sumando más riesgo al portafolio, se mide el aporte marginal de cada activo según su peso y su correlación con el resto. Además, los ratios de captura miden la asimetría frente a las subas y bajas del S&P 500.',
            math: {
                lhs: 'Ratio de Captura =',
                numerator: 'Retorno de tu Activo o Cartera en ruedas Alcistas (o Bajistas)',
                denominator: 'Retorno del S&P 500 en esas mismas ruedas',
                rhs: '× 100',
                vars: [
                    'Upside Capture (> 100%): gana más que el índice cuando el mercado sube.',
                    'Downside Capture (< 100%): cae menos que el índice cuando el mercado baja (amortiguador defensivo).'
                ]
            },
            lead: 'El perfil ideal que buscás al revisar la tercera pestaña del cuadrante:',
            bullets: [
                {
                    bold: 'Asimetría positiva',
                    code: 'Upside > 100% y Downside < 80%',
                    text: 'Participa de lleno en los mercados alcistas pero protege el capital cuando la bolsa corrige.'
                },
                {
                    bold: 'Activos refugio o descorrelacionados',
                    code: 'Downside negativo o cercano a 0%',
                    text: 'Instrumentos como bonos cortos o el oro que suelen mantenerse firmes o subir durante las caídas bursátiles.'
                }
            ],
            example: 'Si en los meses en que el S&P 500 subió un 10% tu cartera ganó un 11% (Upside 110%), y cuando el índice cayó un 10% tu cartera sólo bajó un 6% (Downside 60%), tenés una fuerte asimetría a tu favor.'
        }
    ],

    'p2-corr': [
        {
            id: 'corr-pearson',
            label: 'Correlación Normal vs Crisis',
            intro: 'El coeficiente de Pearson (r) mide de -1.00 a +1.00 cómo se mueven dos activos entre sí. El peligro en gestión de carteras es que durante un crash de mercado la correlación entre activos de riesgo suele dispararse hacia +1.00 (contagio).',
            math: {
                lhs: 'Correlación (rᵢⱼ) =',
                numerator: 'Covarianza ( Retornos Activo i , Retornos Activo j )',
                denominator: 'Volatilidad Activo i (σᵢ) × Volatilidad Activo j (σⱼ)',
                vars: [
                    'r cercanos a 0 o negativos: excelente diversificación (cuando uno baja, el otro no lo sigue).',
                    'r en Cola de Crisis: recalcula la matriz tomando únicamente el 5% de las peores ruedas del mercado.'
                ]
            },
            lead: 'Cómo leer los colores de la matriz 6×6 en ambos regímenes:',
            bullets: [
                {
                    bold: 'Diversificación real',
                    code: 'r < 0.30 en verde o cian',
                    text: 'Ambos activos responden a motores económicos distintos y se compensan mutuamente.'
                },
                {
                    bold: 'Concentración o contagio',
                    code: 'r ≥ 0.65 en rojo',
                    text: 'Se mueven prácticamente en bloque; tener ambos no reduce tus caídas en un mal día.'
                }
            ],
            example: 'Dos acciones de distintos sectores pueden tener una correlación moderada de 0.42 en un año normal, pero al activar el botón Cola de Crisis verás que sube a 0.81 porque en un pánico se venden juntas.'
        }
    ],

    'p2-shock2d': [
        {
            id: 'shock-bivar',
            label: 'Choque 2D (Tasas × Bolsa)',
            intro: 'La matriz 2D combina al mismo tiempo el impacto de un movimiento en las tasas de interés (vía Duración de renta fija y sensibilidad a tasas) con una caída o suba del índice S&P 500 (vía Beta de renta variable).',
            math: {
                lhs: 'Impacto Estimado (%) ≈',
                inline: '( Beta_Cartera × Δ% S&P 500 ) − ( Duración_Efectiva × Δ Tasas )',
                vars: [
                    'Δ% S&P 500: escenario de variación bursátil en el eje horizontal (−20% a +10%).',
                    'Δ Tasas: escenario de cambio en las tasas de interés en puntos básicos en el eje vertical (−100 a +200 bps).'
                ]
            },
            lead: 'Para qué te sirve cruzar los dos ejes en la tabla:',
            bullets: [
                {
                    bold: 'Escenario de estanflación o suba de tasas',
                    code: 'Tasas +100 bps y SPX -10%',
                    text: 'Como el ocurrido en 2022, donde sufren al mismo tiempo las acciones y los bonos largos.'
                },
                {
                    bold: 'Escenario de refugio clásico',
                    code: 'Tasas -100 bps y SPX -15%',
                    text: 'Donde la baja de tasas hace subir el precio de los bonos del Tesoro y amortigua la caída de las acciones.'
                }
            ],
            example: 'Filtrando por un bono largo como US10Y o TLT podés ver en la tabla cómo gana valor cuando las tasas bajan (-100 bps), actuando como paracaídas si ese mismo día cae el S&P 500.'
        },
        {
            id: 'shock-markov',
            label: 'Regímenes de Markov (#11)',
            intro: 'Una cadena de Markov modela la economía como un sistema que salta entre cuatro estados posibles (Alcista Calmo, Alcista Volátil, Inflación/Tasas y Crisis) y calcula la probabilidad de pasar de uno a otro.',
            math: {
                lhs: 'Probabilidad de Transición (Pᵢⱼ) =',
                inline: 'P ( Estado Mañana = j  |  Estado Hoy = i )   donde ∑ⱼ Pᵢⱼ = 100%',
                vars: [
                    'Diagonal principal (i = j): probabilidad de que el régimen actual se mantenga sin cambios.',
                    'Fuera de la diagonal (i ≠ j): probabilidad de rotar hacia un nuevo clima de mercado.'
                ]
            },
            lead: 'Cómo aprovechar la matriz de transición en la segunda pestaña:',
            bullets: [
                {
                    bold: 'Persistencia del ciclo actual',
                    code: 'Porcentaje alto en la diagonal',
                    text: 'Los regímenes tranquilos suelen tener alta persistencia (> 75%), permitiendo mantener posiciones de tendencia.'
                },
                {
                    bold: 'Alerta temprana de rotación',
                    code: 'Suba hacia Volátil o Stress',
                    text: 'Cuando crece la probabilidad de transición hacia estados volátiles, conviene reducir apalancamiento o activar coberturas.'
                }
            ],
            example: 'Si el mercado hoy está en régimen Bull Volátil y la fila marca 62% de permanencia, 20% de volver a Bull Calm y 18% de pasar a Stress/Crisis, sabés que casi 1 de cada 5 escenarios deriva en corrección.'
        }
    ],

    'p2-montecarlo': [
        {
            id: 'mc-gbm',
            label: 'Proyección Monte Carlo (10,000 Caminos)',
            intro: 'A partir del retorno esperado y la volatilidad actual de tu cartera, el simulador genera 10,000 trayectorias futuras posibles día por día aplicando el modelo estocástico de Movimiento Browniano Geométrico.',
            math: {
                lhs: 'Valor Cartera (S_t) =',
                inline: 'S₀ × exp [ ( μ − ½σ² )·t + σ·√t · Z ]',
                vars: [
                    'μ y σ: retorno anual esperado y volatilidad anualizada de tu cartera actual.',
                    'Z: variable aleatoria normal estándar sorteada 10,000 veces a lo largo del horizonte (6M, 12M o 24M).'
                ]
            },
            lead: 'De esas 10,000 simulaciones se extraen las tres curvas principales del gráfico:',
            bullets: [
                {
                    bold: 'Escenario favorable',
                    code: 'Percentil 95 / P95 en verde',
                    text: 'El nivel que sólo es superado por el 5% de los escenarios más optimistas.'
                },
                {
                    bold: 'Trayectoria central esperada',
                    code: 'Mediana P50',
                    text: 'El resultado típico donde la mitad de las simulaciones queda por encima y la otra mitad por debajo.'
                },
                {
                    bold: 'Escenario de estrés a plazo',
                    code: 'Percentil 5 / P05 en rojo',
                    text: 'El piso adverso: en el 95% de los caminos simulados tu cartera termina por encima de esta línea.'
                }
            ],
            example: 'En un horizonte de 12 meses sobre una base de 100, si P50 marca 116 y P05 marca 94, tu expectativa central es ganar +16% y en un año muy adverso arriesgás cerca de un -6%.'
        }
    ],

    /* ─────────────────────────────────────────────────────────────────────────
       CAPÍTULO 7: PORTFOLIO • LABORATORIO AD-HOC
       ───────────────────────────────────────────────────────────────────────── */
    'p3-whatif': [
        {
            id: 'kelly-formula',
            label: 'Criterio de Kelly (#14)',
            intro: 'El Criterio de Kelly responde científicamente qué porcentaje de tu capital deberías destinar a una operación cuando conocés tu probabilidad de acierto (Win-Rate) y cuánto ganás cuando acertás frente a lo que perdés cuando fallás (Ratio Payoff).',
            math: {
                lhs: 'Fracción Óptima de Kelly (f*) =',
                numerator: '( p × b ) − q',
                denominator: 'b',
                vars: [
                    'p y q: probabilidad de ganar (p) y probabilidad de perder (q = 1 − p).',
                    'b (Payoff Ratio): ganancia promedio dividida por pérdida promedio (por ejemplo, ganar $2 por cada $1 arriesgado implica b = 2).'
                ]
            },
            lead: 'Por qué los gestores profesionales usan la variante Half-Kelly (0.5×):',
            bullets: [
                {
                    bold: 'Kelly Completo',
                    code: 'Full Kelly 1.0×',
                    text: 'Maximiza el crecimiento matemático a largo plazo, pero genera oscilaciones muy bruscas si hay una racha de errores seguidos.'
                },
                {
                    bold: 'Mitad de Kelly recomendada',
                    code: 'Half-Kelly 0.5×',
                    text: 'Al usar la mitad del porcentaje sugerido capturás el 75% del crecimiento potencial pero reducís la volatilidad a la mitad.'
                }
            ],
            example: 'Si una estrategia acierta el 55% de las veces (p = 0.55, q = 0.45) y paga 2 a 1 (b = 2), el Kelly completo da (0.55×2 − 0.45) / 2 = 32.5%, y el Half-Kelly prudente recomienda asignar un 16.25%.'
        }
    ],

    'p3-tailhedge': [
        {
            id: 'hedge-put',
            label: 'Escudo Put OTM (#6)',
            intro: 'Una opción Put fuera del dinero (por ejemplo, 5% debajo del precio actual del S&P 500) funciona igual que la franquicia de un seguro: tiene un costo pequeño y fijo (la prima), pero si el mercado se desploma un 20% o 30%, su valor se multiplica de forma convexa y compensa las pérdidas de tu cartera.',
            math: {
                lhs: 'Resultado Neto en Crash =',
                inline: 'Pérdida de Cartera Base + Ganancia Convexa del Put − Costo de la Prima',
                vars: [
                    'Costo Anual (Carry Drag): porcentaje anual que cuesta renovar el seguro si el mercado no cae.',
                    'Protección en Crash (-20%): dólares que recupera el contrato Put durante un desplome severo.'
                ]
            },
            lead: 'Cómo comparar las opciones del simulador en la primera pestaña:',
            bullets: [
                {
                    bold: 'Seguro directo sobre el índice',
                    code: 'SPY Put 5% OTM',
                    text: 'Limita la pérdida máxima a partir de una caída del 5% a cambio de un costo anual moderado.'
                },
                {
                    bold: 'Cobertura financiada o por volatilidad',
                    code: 'QQQ Put Collar / VIX Call Tail',
                    text: 'El Collar reduce el costo vendiendo una Call arriba; el Call sobre VIX explota a favor cuando se dispara el pánico en el mercado.'
                }
            ],
            example: 'Si proteger una cartera de $100,000 con SPY Put 5% OTM cuesta 1.1% al año ($1,100), pero ante un crash del -20% recorta la caída de tu cartera a menos de la mitad, el ahorro neto supera los $7,000.'
        },
        {
            id: 'hedge-margin',
            label: 'Margen y Distancia a Margin Call (#13)',
            intro: 'Cuando operás con derivados o apalancamiento, el bróker exige mantener un porcentaje mínimo de capital propio sobre el valor total de la posición (Margen de Mantenimiento). Si una caída reduce tu capital por debajo de ese piso, se dispara un Margin Call.',
            math: {
                lhs: 'Precio de Margin Call =',
                numerator: 'Deuda o Saldo Financiado',
                denominator: '1 − % Margen de Mantenimiento (Reg-T)',
                vars: [
                    'Exposición Bruta: suma total de las posiciones abiertas dividida por el capital propio (p. ej. 1.18×).',
                    'Distancia a Margin Call (%): caída porcentual que todavía soporta la cartera antes de tocar el umbral.'
                ]
            },
            lead: 'Niveles de seguridad en la barra de monitoreo:',
            bullets: [
                {
                    bold: 'Zona de holgura amplia',
                    code: 'Distancia > 30% en verde',
                    text: 'El apalancamiento es bajo y la cartera puede absorber incluso una crisis severa sin ventas forzadas.'
                },
                {
                    bold: 'Zona de precaución',
                    code: 'Distancia < 15% en rojo',
                    text: 'Una corrección moderada del mercado agotaría las garantías libres y obligaría a liquidar posiciones en el peor momento.'
                }
            ],
            example: 'Con un apalancamiento moderado de 1.18× y un margen de mantenimiento utilizado del 22%, tu cartera cuenta con un colchón de seguridad de más del 38% de caída antes de cualquier reclamo de garantías.'
        }
    ],

    'p3-committee': [
        {
            id: 'comm-guardrails',
            label: 'Reglas del Comité de 3 Pilares',
            intro: 'Para que ninguna decisión impulsiva comprometa la supervivencia del portafolio, el Comité evalúa cada orden combinando la nota técnica, la nota fundamental y dos reglas duras innegociables de control de riesgo.',
            math: {
                lhs: 'Peso Máximo Permitido (wᵢ) =',
                inline: '20% del NAV   (se reduce automáticamente al 5% si Score P-06 ≥ 0.65)',
                vars: [
                    'Hard Cap 20% NAV: ningún activo individual puede concentrar más de la quinta parte del patrimonio total.',
                    'Freno por Anomalía (P-06 ≥ 0.65): si el activo entra en dislocación estadística, el sistema recorta la exposición máxima al 5%.'
                ]
            },
            lead: 'Qué significa cada estado en el veredicto y en el Libro de Ejecución:',
            bullets: [
                {
                    bold: 'Orden aprobada sin restricciones',
                    code: 'APROBADO en verde',
                    text: 'Los tres pilares coinciden favorablemente y el tamaño de la posición respeta todos los topes de concentración y liquidez.'
                },
                {
                    bold: 'Orden ajustada por guardrail',
                    code: 'RECORTE PREVENTIVO',
                    text: 'Cuando una boleta supera el límite del 20% o intenta comprar fuerte en medio de una anomalía, el guardrail advierte el exceso.'
                }
            ],
            example: 'Si intentás simular una compra que llevaría una sola acción al 26% de tu cartera, el Pilar 3 (Risk & Sizing Guardrail) marca la alerta de concentración para que la ajustes debajo del 20%.'
        }
    ],

    'p3-walkforward': [
        {
            id: 'wf-wfe',
            label: 'Eficiencia Walk-Forward (WFE)',
            intro: 'Para comprobar que una estrategia no fue simplemente maquillada para lucir bien en el pasado (sobreajuste u overfitting), el test Walk-Forward compara cómo rindió en el período de diseño (In-Sample) contra su rendimiento en datos posteriores nunca vistos (Out-of-Sample).',
            math: {
                lhs: 'Walk-Forward Efficiency (WFE) =',
                numerator: 'Retorno Anualizado Out-of-Sample (Validación Pura)',
                denominator: 'Retorno Anualizado In-Sample (Entrenamiento)',
                rhs: '× 100',
                vars: [
                    'In-Sample (IS): tramo histórico utilizado para calibrar los pesos y reglas de la estrategia.',
                    'Out-of-Sample (OOS): tramo siguiente donde la estrategia se pone a prueba en condiciones reales sin tocar sus parámetros.'
                ]
            },
            lead: 'Cómo califica la industria cuantitativa el porcentaje de WFE:',
            bullets: [
                {
                    bold: 'Estrategia robusta y consistente',
                    code: 'WFE ≥ 70% en verde',
                    text: 'Conserva la gran mayoría de su capacidad de generar ganancias cuando se enfrenta a condiciones nuevas de mercado.'
                },
                {
                    bold: 'Estrategia frágil o sobreajustada',
                    code: 'WFE < 50% en rojo',
                    text: 'Funcionaba bien en la teoría del pasado pero pierde efectividad en la realidad; no conviene ejecutarla con dinero real.'
                }
            ],
            example: 'Si una estrategia rindió un 20% anualizado durante su etapa de diseño (In-Sample) y en la etapa posterior de prueba real (Out-of-Sample) rindió un 18.8% anualizado, su eficiencia WFE es (18.8 / 20) = 94.0%.'
        }
    ]
};

