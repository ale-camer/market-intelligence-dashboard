/* ═══════════════════════════════════════════════════════════════════════════
   CONTENIDO EDITORIAL DE LA GUÍA DE USUARIO (UserGuideView.jsx)
   - Estilo conversacional y fluido (inspirado en Docker Docs):
     1. Apertura con situaciones reales y preguntas directas al lector.
     2. Frases puente naturales antes de cada lista de viñetas.
     3. Viñetas con encabezado en negrita + referencia entre paréntesis:
        **Concepto (Referencia en pantalla).** Explicación clara y útil.
   ═══════════════════════════════════════════════════════════════════════════ */

import { GUIDE_MODALS_BY_SECTION } from './guideModalsData.js';

export const GUIDE_TREE_PAGES = [
    {
        id: 'home',
        label: 'Home',
        groupLabel: null,
        isPage: true,
        introParagraphs: [
            'Cuando abrís una plataforma financiera tradicional, lo primero que suele aparecer son decenas de gráficos, tablas parpadeando y menús por todos lados. ¿Por dónde empezás cuando sólo querés revisar el mercado o controlar cómo viene tu cartera?',
            'La pantalla Home está pensada justamente para evitar ese ruido inicial. Te recibe con un espacio limpio y despejado donde todo el control está concentrado en dos barras fijas: una arriba para ir a trabajar y otra abajo para configurar la plataforma a tu medida.'
        ],
        intro: 'La pantalla Home te recibe con un espacio limpio y despejado donde todo el control está concentrado en dos barras fijas: una arriba para ir a trabajar y otra abajo para configurar la plataforma a tu medida.',
        sections: [
            {
                id: 'home-canvas',
                label: 'Home',
                summary: 'El punto de partida despejado que divide tu trabajo en análisis de mercado y gestión de cartera.',
                paragraphs: [
                    'Imaginá que entrás a operar a primera hora de la mañana. Algunas veces vas a querer buscar qué acciones, bonos o monedas se están moviendo más; otras veces vas a ir directo a revisar el riesgo de tu cartera o a simular una compra antes de ejecutarla.',
                    '¿Cómo evitás mezclar las dos cosas en una misma pantalla sobrecargada? La portada separa claramente ese camino desde el primer segundo:'
                ],
                lead: '¿Cómo evitás mezclar las dos cosas en una misma pantalla sobrecargada? La portada separa claramente ese camino desde el primer segundo:',
                bullets: [
                    {
                        bold: 'Espacio sin distracciones',
                        code: 'Donde se decodifican los mercados',
                        text: 'Al entrar no hay tablas ni alertas abiertas que te obliguen a cerrar ventanas antes de empezar; vos elegís qué módulo abrir.'
                    },
                    {
                        bold: 'Dos caminos claros',
                        code: 'Markets / Portfolio',
                        text: 'Todo el flujo de la aplicación se divide en dos grandes etapas: primero investigar oportunidades en los mercados y después construir o poner a prueba tu portafolio.'
                    }
                ],
                hasTechnicalModal: false
            },
            {
                id: 'home-header',
                label: 'Header',
                summary: 'La barra superior para saltar en un click entre el inicio, los mercados y tu portafolio.',
                paragraphs: [
                    'A medida que vas entrando en el detalle de un activo o probando cambios en tu cartera, es muy fácil perder de vista dónde estabas. ¿Cómo pasás de mirar el gráfico de una acción a revisar tu portafolio sin dar vueltas por submenús?',
                    'La barra superior permanece siempre fija en pantalla y te da acceso directo a los tres puntos principales:'
                ],
                lead: 'La barra superior permanece siempre fija en pantalla y te da acceso directo a los tres puntos principales:',
                bullets: [
                    {
                        bold: 'Inicio',
                        code: 'λ',
                        text: 'Estés donde estés, un click en el símbolo de la izquierda te devuelve inmediatamente a la portada principal.'
                    },
                    {
                        bold: 'Mercados',
                        code: 'Markets',
                        text: 'Es tu espacio de investigación. Acá filtrás los 213 activos disponibles, seguís cotizaciones en vivo, analizás gráficos técnicos y consultás resúmenes de balances o noticias.'
                    },
                    {
                        bold: 'Cartera',
                        code: 'Portfolio',
                        text: 'Es tu mesa de decisiones. Acá definís qué porcentaje de tu capital va a cada activo, medís cuánto podrías perder en una crisis y simulás nuevas operaciones antes de arriesgar dinero.'
                    }
                ],
                hasTechnicalModal: false
            },
            {
                id: 'home-footer',
                label: 'Footer',
                summary: 'El pie de página para chequear el estado del sistema, volver a esta guía o ajustar el diseño.',
                paragraphs: [
                    'Mientras analizás datos en tiempo real, hay preguntas operativas que pueden surgir en cualquier momento: ¿están llegando bien las cotizaciones?, ¿qué significaba un indicador puntual?, ¿puedo bajar el brillo de la pantalla?',
                    'El pie de página agrupa todas esas herramientas de soporte y configuración para que estén siempre a mano sin estorbar en el centro de la pantalla:'
                ],
                lead: 'El pie de página agrupa todas esas herramientas de soporte y configuración para que estén siempre a mano sin estorbar en el centro de la pantalla:',
                bullets: [
                    {
                        bold: 'Estado del sistema',
                        code: 'System',
                        text: 'El punto verde te confirma de un vistazo que todo está en orden. Al abrirlo podés ver en detalle el estado de los servidores, las bases de datos y la velocidad de respuesta.'
                    },
                    {
                        bold: 'Guía de usuario',
                        code: 'Guide',
                        text: 'Abre este manual interactivo en cualquier momento para consultar cómo usar una pantalla o profundizar en sus cálculos.'
                    },
                    {
                        bold: 'Preferencias visuales',
                        code: 'Idioma / Palette',
                        text: 'Sobre el margen derecho tenés los controles para cambiar el idioma de toda la aplicación o ajustar la iluminación del fondo.'
                    }
                ],
                hasTechnicalModal: false
            },
            {
                id: 'home-langs',
                label: 'Idiomas',
                summary: 'El buscador para traducir toda la plataforma a tu idioma en el acto.',
                paragraphs: [
                    'Los términos financieros y los reportes de mercado ya tienen su propia complejidad como para sumarle una barrera de idioma. Si preferís leer las explicaciones en español, en inglés o en cualquier otra lengua, podés cambiarlo al instante.',
                    'Así funciona el selector desde la esquina inferior derecha:'
                ],
                lead: 'Así funciona el selector desde la esquina inferior derecha:',
                bullets: [
                    {
                        bold: 'Buscador instantáneo',
                        code: 'Select Language',
                        text: 'Al hacer click en la bandera actual se abre una ventana donde podés elegir entre 56 idiomas escribiendo su nombre o su código (por ejemplo, ES, EN, PT, FR o DE).'
                    },
                    {
                        bold: 'Memoria automática',
                        code: 'mid_lang_v1',
                        text: 'Toda la pantalla se traduce en el acto sin recargar la página y tu elección queda guardada para las próximas veces que entres.'
                    }
                ],
                hasTechnicalModal: false
            },
            {
                id: 'home-palettes',
                label: 'Palette',
                summary: 'Los temas visuales para adaptar el contraste de la pantalla sin alterar los colores financieros.',
                paragraphs: [
                    'Pasar varias horas frente a los gráficos con un contraste que no se adapta a la luz de tu ambiente termina cansando la vista. Sin embargo, cambiar los colores de una plataforma financiera tiene un peligro clásico: perder la referencia de qué está subiendo y qué está bajando.',
                    'Para resolverlo, el selector de temas separa el color del ambiente del color de los datos:'
                ],
                lead: 'Para resolverlo, el selector de temas separa el color del ambiente del color de los datos:',
                bullets: [
                    {
                        bold: 'Cinco ambientes de lectura',
                        code: 'Obsidian Night, OLED Pitch Black, Abyssal Navy, Warm Titanium y Cobalt Quant',
                        text: 'Con cada click vas rotando entre fondos negros puros, azulados o cálidos hasta encontrar el que te resulte más cómodo a los ojos.'
                    },
                    {
                        bold: 'Semántica financiera intacta',
                        code: 'Verde #10b981 / Rojo #f43f5e',
                        text: 'Cambies el tema que cambies, la regla universal del mercado no se altera nunca: el verde siempre significa suba o ganancia, y el rojo siempre significa caída, pérdida o alerta de riesgo.'
                    }
                ],
                hasTechnicalModal: false
            }
        ]
    },
    {
        id: 'markets',
        label: 'Markets',
        isGroup: true,
        children: [
            {
                id: 'mkt-screener',
                label: 'Screener',
                groupLabel: 'Markets',
                isPage: true,
                introParagraphs: [
                    'Imaginá que querés detectar dónde están las mejores oportunidades del día entre más de doscientos bonos, acciones, índices, monedas y materias primas. Si tuvieras que abrir los gráficos uno por uno, el mercado cerraría antes de que termines de mirarlos.',
                    'El Screener reúne los 213 activos de la plataforma en un solo tablero en vivo. Te permite filtrar por mercado en un segundo, medir el pulso general del día y elegir entre cuatro formas distintas de visualizar qué activos se están destacando.'
                ],
                intro: 'El Screener reúne los 213 activos de la plataforma en un solo tablero en vivo para que filtres por mercado y detectes oportunidades de un vistazo.',
                sections: [
                    {
                        id: 'scr-categories',
                        label: 'Categorías',
                        summary: 'Los filtros superiores para concentrarte en una sola clase de activos o en tu lista de seguimiento.',
                        paragraphs: [
                            'No tiene sentido analizar un bono del Tesoro con las mismas métricas que una acción tecnológica o que el petróleo. Cuando mezclás todo en una misma lista, terminás comparando peras con manzanas.',
                            '¿Cómo acotás la pantalla exactamente al mercado que te interesa hoy? La barra superior te deja separar el universo con un click:'
                        ],
                        lead: 'La barra superior te deja separar el universo con un click:',
                        bullets: [
                            {
                                bold: 'Panorama completo',
                                code: 'Todos',
                                text: 'Muestra los 213 instrumentos juntos y ordenados por volumen operado para que veas hacia dónde fluye la mayor cantidad de dinero a nivel global.'
                            },
                            {
                                bold: 'Seguimiento personal',
                                code: '★ Watchlist',
                                text: 'Aísla únicamente los activos que marcaste como favoritos para monitorearlos de cerca sin distracciones.'
                            },
                            {
                                bold: 'Diez mercados especializados',
                                code: 'Bonos, Cash, Crypto, Derivados, FX, Acciones, ETFs, Índices, Materias Primas y Tasas',
                                text: 'Al elegir cualquiera de estas categorías, toda la pantalla adapta sus indicadores y las columnas de la tabla a las reglas propias de ese sector.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Detalle de cómo se clasifican los 213 activos del catálogo y qué criterios de volumen y liquidez cumplen.'
                    },
                    {
                        id: 'scr-pulse',
                        label: 'Pulso 24h',
                        summary: 'Las cuatro tarjetas superiores que te dicen si el mercado está tranquilo, eufórico o bajo estrés.',
                        paragraphs: [
                            'Antes de comprar o vender un activo puntual, conviene saber en qué clima se está moviendo el conjunto. ¿Es un día de volumen normal o está entrando dinero institucional de golpe? ¿Suben todos los activos parejos o hay señales de tensión?',
                            'Las cuatro tarjetas debajo de los filtros te dan esa lectura general en pocos segundos:'
                        ],
                        lead: 'Las cuatro tarjetas debajo de los filtros te dan esa lectura general en pocos segundos:',
                        bullets: [
                            {
                                bold: 'Actividad total del día',
                                code: 'Volumen Agregado 24h',
                                text: 'Suma miles de millones de dólares operados en la categoría activa y te muestra si hoy hay más o menos participación que ayer.'
                            },
                            {
                                bold: 'Fuerza promedio del grupo',
                                code: 'AVG RSI 14',
                                text: 'Resume en un medidor circular si los precios del sector vienen con empuje comprador (verde, por encima de 50) o con presión vendedora (rojo, por debajo de 50).'
                            },
                            {
                                bold: 'Termómetro de normalidad',
                                code: 'Régimen Normal P-06',
                                text: 'Calcula qué porcentaje de los activos se mueve dentro de sus parámetros habituales y te señala con nombre y apellido cuál es el instrumento con la mayor anomalía del día.'
                            },
                            {
                                bold: 'Entradas inusuales de dinero',
                                code: 'Top Desvío Volumen 20d',
                                text: 'Destaca el podio de los tres activos que hoy están operando un volumen extraordinariamente alto en comparación con su promedio del último mes.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Explicación detallada de cómo se calculan el RSI promedio, el Z-Score de volumen y el detector de anomalías P-06.'
                    },
                    {
                        id: 'scr-table',
                        label: 'Tabla',
                        summary: 'El listado interactivo con buscador rápido, favoritos y columnas que se adaptan a cada mercado.',
                        paragraphs: [
                            'Cuando ya sabés qué sector querés mirar y necesitás comparar números concretos fila por fila, la vista de tabla es tu herramienta principal.',
                            'En lugar de mostrarte una planilla rígida igual para todo el mundo, la tabla se ajusta a lo que estás buscando:'
                        ],
                        lead: 'En lugar de mostrarte una planilla rígida igual para todo el mundo, la tabla se ajusta a lo que estás buscando:',
                        bullets: [
                            {
                                bold: 'Buscador y estrella de favoritos',
                                code: 'Buscar activo / ★',
                                text: 'En el encabezado de la primera columna podés escribir cualquier símbolo o nombre para ir directo a ese activo, o tocar la estrella a su izquierda para guardarlo en tu Watchlist.'
                            },
                            {
                                bold: 'Columnas inteligentes según el rubro',
                                code: '2 métricas exclusivas por categoría',
                                text: 'Si filtrás Acciones aparecen múltiplos de valoración y márgenes; si elegís Bonos o Tasas ves la pendiente de la curva y la sensibilidad a tasas; si mirás Derivados ves volatilidad implícita.'
                            },
                            {
                                bold: 'Salto directo al análisis profundo',
                                code: 'Click en cualquier fila',
                                text: 'Basta con hacer click sobre cualquier activo de la lista para abrir su estación completa de gráficos técnicos y reportes fundamentales.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Listado de las métricas específicas que muestra la tabla para cada una de las 10 categorías de activos.'
                    },
                    {
                        id: 'scr-orbital',
                        label: 'Orbital',
                        summary: 'El radar visual para detectar de un vistazo qué activos se están saliendo de su promedio histórico.',
                        paragraphs: [
                            'Leer doscientas filas de números puede hacer que se te pase por alto un activo que está empezando a moverse de forma explosiva. ¿Cómo detectás al instante qué instrumento se está escapando de lo normal?',
                            'La vista Orbital transforma la tabla en un radar de tres anillos concéntricos:'
                        ],
                        lead: 'La vista Orbital transforma la tabla en un radar de tres anillos concéntricos:',
                        bullets: [
                            {
                                bold: 'Elección del criterio',
                                code: 'INDICADOR',
                                text: 'Vos decidís qué mide el radar: anomalías estadísticas, saltos de volumen, fuerza de precio (RSI), volatilidad o ganancia de las últimas 24 horas.'
                            },
                            {
                                bold: 'Lectura por distancia y color',
                                code: 'Nodos verdes y rojos',
                                text: 'Cuanto más se acerca o se aleja un punto según el indicador y más intenso es su color verde o rojo, más relevante es su movimiento frente a su propia historia.'
                            },
                            {
                                bold: 'Inspección sin cambiar de pantalla',
                                code: 'Panel lateral en vivo',
                                text: 'Al apoyar el cursor sobre cualquier nodo del radar, a la derecha se despliega su cotización, su gráfico intradía limpio y sus tres métricas de riesgo.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Cómo se calcula la posición de cada activo en los anillos del radar según su desvío histórico.'
                    },
                    {
                        id: 'scr-heatmap',
                        label: 'Mapa Calor',
                        summary: 'El mosaico de bloques proporcionales para identificar en un segundo a los ganadores y perdedores.',
                        paragraphs: [
                            'Hay momentos en los que sólo querés responder una pregunta rápida: ¿quiénes lideran la suba hoy y quiénes están arrastrando al mercado hacia abajo?',
                            'El Mapa de Calor ordena los diez activos principales del filtro activo en bloques proporcionales para que no tengas que leer ni una sola tabla:'
                        ],
                        lead: 'El Mapa de Calor ordena los diez activos principales del filtro activo en bloques proporcionales:',
                        bullets: [
                            {
                                bold: 'Tamaño según importancia',
                                code: 'Puestos #1 a #10',
                                text: 'Los instrumentos con mayor peso dentro de la métrica elegida ocupan las columnas de la izquierda con los recuadros más grandes.'
                            },
                            {
                                bold: 'Intensidad de color',
                                code: '8 tonos de verde y rojo',
                                text: 'El tono del bloque te indica de inmediato la magnitud del movimiento, desde variaciones moderadas hasta subas o caídas abruptas.'
                            }
                        ],
                        hasTechnicalModal: false
                    },
                    {
                        id: 'scr-maintools',
                        label: 'Main Tools',
                        summary: 'El acceso directo en tres pasos a las calculadoras avanzadas de tasas, opciones, divisas y futuros.',
                        paragraphs: [
                            'Además de los gráficos de precios tradicionales, la plataforma incluye cuatro motores especiales para renta fija, opciones, cruce de monedas y curvas de materias primas. ¿Cómo llegás a ellos sin buscar activo por activo?',
                            'Esta vista te guía de izquierda a derecha en tres columnas muy simples:'
                        ],
                        lead: 'Esta vista te guía de izquierda a derecha en tres columnas muy simples:',
                        bullets: [
                            {
                                bold: 'Primero elegís la familia',
                                code: '1. Clases de Activo',
                                text: 'Seleccionás si querés trabajar con Tasas y Bonos, con Opciones sobre Acciones/Índices/Crypto, con Divisas o con Materias Primas.'
                            },
                            {
                                bold: 'Después revisás qué hace el motor',
                                code: '2. Instrumento Principal & Explicación',
                                text: 'En el centro leés una síntesis clara de qué muestra esa herramienta y cómo orientarte en sus ejes.'
                            },
                            {
                                bold: 'Por último elegís el activo y abrís',
                                code: '3. Vista Previa & Lanzador',
                                text: 'Miras un adelanto en vivo del gráfico, buscás cualquier activo compatible de esa familia y abrís la estación completa con un click.'
                            }
                        ],
                        hasTechnicalModal: false
                    }
                ]
            },
            {
                id: 'mkt-analytics',
                label: 'Analytics',
                groupLabel: 'Markets',
                isPage: true,
                introParagraphs: [
                    'Una vez que encontraste un activo interesante en el Screener, llega el momento de mirarlo con lupa. ¿Está en tendencia alcista o se quedó sin fuerza? ¿Le está ganando a sus competidores? ¿Qué dicen el volumen y el mercado de derivados?',
                    'La estación Analytics concentra todo el análisis técnico, comparativo y cuantitativo de ese activo en una sola pantalla. Arriba tenés el resumen general y a la izquierda cuatro lentes para cambiar el ángulo de análisis sin perder de vista el gráfico.'
                ],
                intro: 'La estación Analytics concentra el análisis técnico, comparativo, de flujo y los motores 3D/2D de un activo individual en una sola pantalla.',
                sections: [
                    {
                        id: 'ana-hero',
                        label: 'Cabecera',
                        summary: 'El tablero superior para cambiar de activo, elegir el plazo temporal y ver sus cinco métricas clave.',
                        paragraphs: [
                            'Cuando estás estudiando un activo, solés alternar entre el corto plazo de hoy y la película de los últimos meses, o incluso pasar a mirar otro símbolo parecido. ¿Cómo hacés todo eso sin volver atrás?',
                            'El encabezado superior reúne los controles de navegación y la ficha rápida del instrumento:'
                        ],
                        lead: 'El encabezado superior reúne los controles de navegación y la ficha rápida del instrumento:',
                        bullets: [
                            {
                                bold: 'Cambio de activo o retorno al listado',
                                code: '← Todos los Mercados / Cambiar activo',
                                text: 'Arriba a la izquierda podés volver al Screener o escribir el nombre de cualquier otro instrumento para cambiar de gráfico en el acto.'
                            },
                            {
                                bold: 'Nueve ventanas de tiempo',
                                code: '1m, 5m, 1H, 1D, 1W, 1M, 3M, 1Y y ALL',
                                text: 'Sobre el margen derecho cambiás la escala del gráfico desde movimientos minuto a minuto hasta el historial completo.'
                            },
                            {
                                bold: 'Cinco indicadores de cabecera',
                                code: 'Volumen 24h, 2 métricas del sector, RSI/MACD y P-06',
                                text: 'Al costado del precio tenés siempre a la vista el volumen operado, los dos datos clave de su categoría, la fuerza de la tendencia y el nivel de normalidad estadística.'
                            }
                        ],
                        hasTechnicalModal: false
                    },
                    {
                        id: 'ana-technical',
                        label: 'Técnico',
                        summary: 'El gráfico de precios con medias móviles, bandas de volatilidad y volumen para seguir la tendencia.',
                        paragraphs: [
                            'Mirar únicamente el último precio no te dice si un activo viene acelerando, si está rebotando en su promedio o si ya subió demasiado rápido en pocos días.',
                            'La primera lente del riel izquierdo te permite superponer sobre el gráfico las referencias técnicas más usadas del mercado:'
                        ],
                        lead: 'La primera lente del riel izquierdo te permite superponer las referencias técnicas más usadas:',
                        bullets: [
                            {
                                bold: 'Dirección y precio promedio real',
                                code: 'SMA 20 / VWAP',
                                text: 'Podés encender la media móvil de 20 períodos y el precio promedio ponderado por volumen para ver de inmediato si el activo cotiza por encima o por debajo de su nivel de equilibrio.'
                            },
                            {
                                bold: 'Zonas de exceso y confirmación por volumen',
                                code: 'Bollinger 2σ / Panel: Volumen',
                                text: 'Las bandas dibujan el techo y el piso estadístico del precio, mientras que las barras inferiores te confirman si el movimiento está respaldado por volumen.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Fórmulas y criterios de interpretación de la Media Móvil (SMA 20), Bandas de Bollinger y VWAP.'
                    },
                    {
                        id: 'ana-compare',
                        label: 'Comparar %',
                        summary: 'El comparador porcentual desde 0% para medir si tu activo rinde más o menos que otro del mismo rubro.',
                        paragraphs: [
                            'Que una acción suba un 5% parece una gran noticia, pero si su índice de referencia o su principal competidor subió un 12% en el mismo período, en realidad te estás quedando atrás.',
                            'La segunda lente resuelve esa duda poniendo a los dos activos en la misma línea de largada:'
                        ],
                        lead: 'La segunda lente resuelve esa duda poniendo a los dos activos en la misma línea de largada:',
                        bullets: [
                            {
                                bold: 'Búsqueda de pares coherentes',
                                code: 'Buscar par compatible',
                                text: 'El buscador filtra automáticamente activos de la misma familia (por ejemplo, acciones contra acciones, ETFs o índices) para que la comparación tenga sentido financiero.'
                            },
                            {
                                bold: 'Ventaja neta en porcentaje',
                                code: 'ALPHA SPREAD 24H',
                                text: 'Ambas curvas arrancan desde el 0% y el riel izquierdo te calcula cuántos puntos porcentuales de ventaja (en verde) o desventaja (en rojo) lleva tu activo.'
                            }
                        ],
                        hasTechnicalModal: false
                    },
                    {
                        id: 'ana-micro',
                        label: 'Micro & Flujo',
                        summary: 'El detector de compras institucionales fuera de patrón, liquidez y costos de spread.',
                        paragraphs: [
                            'Muchas veces los grandes fondos acumulan o descargan posiciones antes de que el precio haga un movimiento brusco. ¿Cómo detectás esa huella oculta en el volumen y en la liquidez del libro de órdenes?',
                            'La tercera lente pone el foco en lo que pasa por debajo de la cotización:'
                        ],
                        lead: 'La tercera lente pone el foco en lo que pasa por debajo de la cotización:',
                        bullets: [
                            {
                                bold: 'Picos estadísticos de volumen',
                                code: 'VOL Z-SCORE 20D',
                                text: 'Cambia el panel inferior para mostrarte cuántas veces se desvía el volumen actual respecto de lo normal, revelando actividad institucional inusual.'
                            },
                            {
                                bold: 'Tensión de liquidez y anomalías',
                                code: 'SPREAD DISLOCATION / P-06 ANOMALY SCORE',
                                text: 'Mide en puntos básicos si la brecha entre compradores y vendedores se está ensanchando y si el motor estadístico detecta un comportamiento atípico.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Cómo se miden la apertura de spreads y los picos estadísticos en el flujo de órdenes.'
                    },
                    {
                        id: 'ana-engines',
                        label: 'Motores 3D/2D',
                        summary: 'La cuarta lente que despliega una herramienta ad-hoc dinámica que varía según la clase de activo.',
                        paragraphs: [
                            'A diferencia de las tres primeras lentes (que son comunes a todos los instrumentos), la cuarta lente del riel izquierdo es una herramienta ad-hoc que cambia dinámicamente según el activo que estés analizando: por ejemplo, en el recorrido en vivo, al tratarse de una acción (NVDA), habilita la Superficie 3D de Volatilidad Implícita y Payoff de opciones, mientras que en otros mercados despliega su propio motor especializado.',
                            'El cuarto botón detecta la clase de activo abierta y activa automáticamente la herramienta ad-hoc que le corresponde:'
                        ],
                        lead: 'El cuarto botón detecta qué activo tenés abierto y activa la herramienta ad-hoc que le corresponde:',
                        bullets: [
                            {
                                bold: 'En acciones, índices, derivados y crypto',
                                code: 'Vol 3D & Payoff',
                                text: 'Despliega la superficie 3D de volatilidad implícita, la sonrisa de opciones por vencimiento y un simulador de 6 estrategias para ver cuánto ganarías o perderías hoy y al vencimiento.'
                            },
                            {
                                bold: 'En tasas, bonos y liquidez',
                                code: 'Curva 3D/2D',
                                text: 'Permite comparar las curvas de rendimiento de 42 países contra EE. UU. y Alemania, midiendo si la curva está normal o invertida (2s10s) y cuánto varía el precio ante cambios de tasas (DV01).'
                            },
                            {
                                bold: 'En divisas',
                                code: 'FX & Carry',
                                text: 'Ofrece un conversor y triangulador entre 61 monedas que calcula además el diferencial de tasas de interés a 10 años a favor o en contra de mantener ese par.'
                            },
                            {
                                bold: 'En materias primas',
                                code: 'Forward 3D/2D',
                                text: 'Grafica los precios de los contratos futuros mes a mes para mostrar si el mercado paga más a plazo (Contango) o por entrega inmediata (Backwardation), junto al estado de los inventarios físicos.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Detalle matemático de las superficies de volatilidad, curvas de rendimiento soberanas, carry cambiario y curvas de futuros.'
                    }
                ]
            },
            {
                id: 'mkt-research',
                label: 'Research',
                groupLabel: 'Markets',
                isPage: true,
                introParagraphs: [
                    'El gráfico te muestra qué está haciendo el precio, pero no te explica por qué. Para saber qué hay detrás de un movimiento tendrías que leer decenas de páginas de balances trimestrales, comunicados de bancos centrales, reportes de inventarios y cables de noticias.',
                    'La estación Research hace ese trabajo pesado por vos. Combina inteligencia artificial documental verificada contra reportes oficiales con lectura de noticias en tiempo real, organizando toda la evidencia a favor y en contra en tres columnas claras.'
                ],
                intro: 'La estación Research resume balances oficiales, reportes macroeconómicos y noticias en tiempo real en tres columnas claras.',
                sections: [
                    {
                        id: 'res-hero',
                        label: 'Nota & Postura',
                        summary: 'Las tres tarjetas superiores que sintetizan el veredicto fundamental y el humor de las noticias.',
                        paragraphs: [
                            '¿Los fundamentos del activo acompañan la suba del precio o las noticias están deteriorando el panorama? Antes de leer el detalle, necesitás una conclusión ejecutiva rápida.',
                            'En la esquina superior derecha tenés tres indicadores que resumen el estado general del activo:'
                        ],
                        lead: 'En la esquina superior derecha tenés tres indicadores que resumen el estado general:',
                        bullets: [
                            {
                                bold: 'Postura y peso de cada fuente',
                                code: 'ALCISTA / BAJISTA',
                                text: 'Define el veredicto general y te aclara qué peso le da a los documentos oficiales frente a las noticias según el tipo de activo (por ejemplo, 80% balances y 20% noticias en una acción).'
                            },
                            {
                                bold: 'Calificación combinada',
                                code: 'NOTA PONDERADA TOTAL',
                                text: 'Sintetiza en un solo puntaje el resultado neto de los fundamentos más el flujo informativo del día.'
                            },
                            {
                                bold: 'Termómetro de titulares',
                                code: 'SENTIMIENTO NOTICIAS',
                                text: 'Ubica sobre una barra de -100 a +100 si el tono de la prensa en las últimas horas es pesimista (rojo), neutral o entusiasta (verde).'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Cómo se ponderan los reportes oficiales frente a las noticias según el tipo de activo.'
                    },
                    {
                        id: 'res-rag',
                        label: 'Chat RAG',
                        summary: 'El asistente documental izquierdo para hacer preguntas concretas sobre balances y reportes oficiales.',
                        paragraphs: [
                            'Supongamos que querés saber qué dijo exactamente una empresa sobre sus márgenes en su último balance anual 10-K, o qué señaló la Reserva Federal en su última acta. Buscarlo a mano lleva tiempo; preguntarle a un chat genérico sin fuentes puede darte datos inventados.',
                            'La columna izquierda resuelve esto con un asistente conectado exclusivamente a documentación oficial verificada:'
                        ],
                        lead: 'La columna izquierda te ofrece un asistente conectado a documentación oficial verificada:',
                        bullets: [
                            {
                                bold: 'Tesis inicial y preguntas guiadas',
                                code: 'Chat Documental RAG',
                                text: 'Arranca con un resumen ejecutivo con citas verificadas y cuatro botones de consulta rápida adaptados al rubro del activo, además de un campo para que escribas tus propias preguntas.'
                            },
                            {
                                bold: 'Paso directo a tu portafolio',
                                code: '★ Simular en Portfolio & Riesgo',
                                text: 'Si después de investigar los fundamentos decidís que el activo vale la pena, este botón en el tope del chat lo envía directo al simulador de carteras.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Funcionamiento de la búsqueda documental verificada (RAG) y sus filtros de seguridad.'
                    },
                    {
                        id: 'res-factors',
                        label: 'Factores',
                        summary: 'El acordeón central con los cinco motores alcistas y los cinco riesgos bajistas ordenados por impacto.',
                        paragraphs: [
                            'Ninguna inversión es cien por ciento perfecta ni cien por ciento mala: siempre hay argumentos a favor y riesgos latentes. El secreto está en saber cuáles pesan más hoy.',
                            'La columna central pone ambos lados frente a frente para que tomes una decisión equilibrada:'
                        ],
                        lead: 'La columna central pone ambos lados frente a frente para que tomes una decisión equilibrada:',
                        bullets: [
                            {
                                bold: 'Balanza de fuerzas y filtros',
                                code: 'Todos 10 / ▲ 5 Bull / ▼ 5 Bear / 5 vs 5',
                                text: 'Arriba ves la barra de puja entre compradores y vendedores, y debajo podés filtrar los cinco catalizadores positivos (en verde) o los cinco riesgos principales (en rojo).'
                            },
                            {
                                bold: 'Detalle y profundización en un click',
                                code: 'Profundizar en Chat RAG →',
                                text: 'Al tocar cualquier factor de la lista se despliega su explicación completa junto a un botón para pedirle al Chat RAG más datos sobre ese punto puntual.'
                            }
                        ],
                        hasTechnicalModal: false
                    },
                    {
                        id: 'res-pulse24h',
                        label: 'Pulso FinBERT',
                        summary: 'La cronología derecha con los últimos titulares calificados por IA y la curva de humor de 24 horas.',
                        paragraphs: [
                            'Un solo titular de último momento sobre resultados, inflación o regulaciones puede cambiar por completo el ánimo del día. ¿Cómo sabés qué noticias acaban de salir y qué efecto están teniendo?',
                            'La columna derecha monitorea el flujo informativo minuto a minuto:'
                        ],
                        lead: 'La columna derecha monitorea el flujo informativo minuto a minuto:',
                        bullets: [
                            {
                                bold: 'Línea de tiempo calificada',
                                code: '2. PULSO 24H • TIMELINE FINBERT',
                                text: 'Lista los cinco titulares más recientes con su hora y agencia, asignándoles un puntaje en verde si son favorables o en rojo si representan una amenaza.'
                            },
                            {
                                bold: 'Simulador de impacto y curva diaria',
                                code: '+ Simular Noticia / Gráfico 24h',
                                text: 'Podés disparar un cable en vivo con el botón superior para ver cómo recalcula toda la pantalla y seguir en el gráfico inferior cómo evolucionó el ánimo durante las últimas 24 horas.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Cómo analiza el modelo FinBERT el lenguaje financiero de cada titular.'
                    }
                ]
            }
        ]
    },
    {
        id: 'portfolio',
        label: 'Portfolio',
        isGroup: true,
        children: [
            {
                id: 'port-v1',
                label: 'Constructor',
                groupLabel: 'Portfolio',
                isPage: true,
                introParagraphs: [
                    'Elegir buenos activos por separado no alcanza para tener una buena cartera. Si ponés demasiado capital en activos que se mueven igual, o si no medís cómo habrían rendido juntos en el pasado, estás invirtiendo a ciegas.',
                    'Constructor & Performance (la primera vista de Portfolio) es el taller donde armás tu portafolio. Te permite agregar cualquiera de los 213 activos, ajustar qué porcentaje le asignás a cada uno sin lidiar con controles imprecisos y auditar al instante tanto su composición interna como su historia.'
                ],
                intro: 'Constructor & Performance es el taller donde armás tu portafolio, ajustás el peso de cada activo y auditás su rendimiento histórico.',
                sections: [
                    {
                        id: 'p1-pills',
                        label: 'Resumen',
                        summary: 'Las seis tarjetas superiores que se recalculan en vivo cada vez que modificás tu cartera.',
                        paragraphs: [
                            'Cada vez que sumás un activo o cambiás un porcentaje en tu cartera, necesitás saber de inmediato si ese ajuste mejoró tu rendimiento esperado o si empeoró tu exposición a caídas.',
                            'La fila superior mantiene siempre visibles las seis métricas maestras del portafolio:'
                        ],
                        lead: 'La fila superior mantiene siempre visibles las seis métricas maestras del portafolio:',
                        bullets: [
                            {
                                bold: 'Rendimiento y eficiencia',
                                code: 'RETORNO ANUAL CAGR / SHARPE & SORTINO',
                                text: 'Te informan qué ganancia anual compuesta proyecta la cartera sobre tu capital y cuánto retorno estás obteniendo por cada unidad de riesgo asumido.'
                            },
                            {
                                bold: 'Pérdida diaria esperada y caída histórica',
                                code: 'VaR 95% 1D / MAX DRAWDOWN 12M',
                                text: 'Calculan cuántos dólares podrías perder en un día adverso dentro de lo estadísticamente previsible y cuál fue el retroceso más profundo del último año.'
                            },
                            {
                                bold: 'Valor agregado y diversificación',
                                code: 'ALPHA BRINSON 12M / ACTIVOS SELECCIONADOS',
                                text: 'Miden por cuántos puntos le gana tu cartera al índice de referencia y cuánto riesgo estás reduciendo gracias a combinar distintos activos.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Fórmulas de retorno compuesto (CAGR), ratios de Sharpe y Sortino, y Valor en Riesgo (VaR).'
                    },
                    {
                        id: 'p1-table',
                        label: 'Ponderación',
                        summary: 'La tabla izquierda para sumar activos, prenderlos o apagarlos y definir el porcentaje exacto de cada posición.',
                        paragraphs: [
                            '¿Qué pasaría con los números de tu cartera si hoy apagaras temporalmente una acción tecnológica o si repartieras el dinero en partes iguales entre todas tus posiciones?',
                            'El panel izquierdo te deja hacer todas esas pruebas de forma limpia y directa:'
                        ],
                        lead: 'El panel izquierdo te deja hacer todas esas pruebas de forma limpia y directa:',
                        bullets: [
                            {
                                bold: 'Buscador de los 213 activos',
                                code: 'Buscar entre los 213 activos / ★ Watchlist / + Agregar',
                                text: 'Podés buscar cualquier instrumento de la plataforma o filtrar tus favoritos para sumarlo a la tabla con un click.'
                            },
                            {
                                bold: 'Encendido rápido y edición exacta',
                                code: 'ON / PESO % / CAPITAL $',
                                text: 'Cada fila tiene una casilla para incluir o excluir el activo en tiempo real y un cuadro numérico para escribir el porcentaje exacto sin usar barras deslizantes imprecisas.'
                            },
                            {
                                bold: 'Tres atajos de rebalanceo',
                                code: '1/N Equal, Ajustar 100% y Restaurar Base',
                                text: 'En el tope de la tabla tenés botones para repartir pesos iguales entre todos los activos activos, llevar la suma automáticamente al 100% o volver a la cartera original.'
                            }
                        ],
                        hasTechnicalModal: false
                    },
                    {
                        id: 'p1-xray',
                        label: 'Radiografía',
                        summary: 'El panel superior derecho con cinco pestañas para descubrir concentraciones ocultas, flujo de caja y custodia.',
                        paragraphs: [
                            'Uno de los errores más frecuentes al invertir es creer que estás diversificado porque tenés cinco activos distintos, cuando en realidad compraste una acción individual y además dos ETFs que tienen esa misma acción adentro.',
                            'El panel de Radiografía analiza tu cartera por dentro a través de cinco pestañas:'
                        ],
                        lead: 'El panel de Radiografía analiza tu cartera por dentro a través de cinco pestañas:',
                        bullets: [
                            {
                                bold: 'Detector de posiciones repetidas',
                                code: '1. Solapamiento X-Ray #12',
                                text: 'Suma lo que tenés invertido directamente en cada empresa más la porción oculta que tenés dentro de índices o ETFs (como SPY o QQQ), avisándote en rojo si superás límites prudentes.'
                            },
                            {
                                bold: 'Mapa de exposición y origen del retorno',
                                code: '2. Exposición NEW-07 / 3. Descomposición Alpha #2',
                                text: 'Te muestran qué porcentaje real tenés en cada tipo de activo y moneda, y qué parte de tu ganancia provino de elegir buenos sectores frente a elegir buenos activos.'
                            },
                            {
                                bold: 'Renta anual proyectada y seguridad',
                                code: '4. Cashflow NEW-08 / 5. Custodia #16',
                                text: 'Calculan cuántos dólares vas a cobrar en el año por dividendos, cupones e intereses, y auditan la solvencia de los custodios donde descansa tu capital.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Cómo se calcula la exposición indirecta dentro de ETFs y el desglose de atribución Brinson.'
                    },
                    {
                        id: 'p1-calendar',
                        label: 'Calendario',
                        summary: 'El cuadro mensual de enero a diciembre para ver la regularidad de tus ganancias y pérdidas.',
                        paragraphs: [
                            'Un buen retorno anual puede esconder meses de caídas muy bruscas que en la práctica son difíciles de tolerar. ¿Qué tan consistente mes a mes es la cartera que acabás de armar?',
                            'Justo debajo de la Radiografía, el calendario desglosa el historial mensual:'
                        ],
                        lead: 'Justo debajo de la Radiografía, el calendario desglosa el historial mensual:',
                        bullets: [
                            {
                                bold: 'Meses verdes y meses rojos',
                                code: 'AÑO / ENE..DIC / YTD',
                                text: 'Cada celda se recalcula al instante según los pesos de tu tabla y se pinta de verde o rojo según el resultado de ese mes, cerrando a la derecha con el acumulado del año.'
                            }
                        ],
                        hasTechnicalModal: false
                    },
                    {
                        id: 'p1-backtest',
                        label: 'Backtesting',
                        summary: 'El gráfico inferior a pantalla completa para comparar tu cartera contra cuatro estrategias clásicas.',
                        paragraphs: [
                            'Antes de dar por buena tu cartera, queda la prueba fundamental: ¿realmente le gana a dejar la plata en el S&P 500 o en una cartera tradicional 60/40?',
                            'El panel inferior ocupa todo el ancho de la pantalla para poner tu diseño frente a los estándares del mercado:'
                        ],
                        lead: 'El panel inferior pone tu diseño frente a los estándares del mercado:',
                        bullets: [
                            {
                                bold: 'Cinco horizontes de prueba',
                                code: '3M, 6M, 1Y, 3Y y MAX',
                                text: 'Te permite evaluar cómo se comportó tu combinación tanto en los últimos trimestres como a través de ciclos completos de varios años.'
                            },
                            {
                                bold: 'Cuatro referencias cara a cara',
                                code: 'vs S&P 500, vs 60/40 Classic, vs All-Weather y vs Min-Variance',
                                text: 'Superpone la curva verde de tu cartera activa contra cualquiera de los cuatro modelos clásicos para que veas con claridad cuándo saca ventaja y cómo resiste las bajas.'
                            }
                        ],
                        hasTechnicalModal: false
                    }
                ]
            },
            {
                id: 'port-v2',
                label: 'Riesgo',
                groupLabel: 'Portfolio',
                isPage: true,
                introParagraphs: [
                    'En épocas en que el mercado sube tranquilo, casi cualquier cartera parece segura. El verdadero problema aparece cuando estalla una crisis, suben de golpe las tasas de interés y activos que parecían independientes empiezan a caer todos al mismo tiempo.',
                    'Riesgo Cuantitativo & Stress (la segunda vista de Portfolio) somete tu cartera a pruebas extremas antes de que ocurran en la vida real. A través de cuatro cuadrantes simétricos y un simulador de escenarios futuros abajo, te muestra exactamente dónde están tus puntos vulnerables.'
                ],
                intro: 'Riesgo Cuantitativo & Stress somete tu cartera a pruebas de crisis históricas, contagio de correlaciones y proyecciones de Monte Carlo.',
                sections: [
                    {
                        id: 'p2-markowitz',
                        label: 'Markowitz 2D',
                        summary: 'El mapa interactivo de riesgo y retorno para ver qué tan cerca estás de la cartera más eficiente posible.',
                        paragraphs: [
                            'Con los mismos activos que ya tenés en cartera, existen miles de formas de repartir los porcentajes. ¿La combinación que elegiste es la que mejor paga por el riesgo que corrés, o podrías ganar lo mismo con menos sobresaltos?',
                            'El primer cuadrante arriba a la izquierda dibuja ese mapa de posibilidades en vivo:'
                        ],
                        lead: 'El primer cuadrante arriba a la izquierda dibuja ese mapa de posibilidades en vivo:',
                        bullets: [
                            {
                                bold: 'Tu posición frente a las carteras óptimas',
                                code: '★ Mi Cartera / Min-Var / Max-Sharpe',
                                text: 'Muestra dónde se ubica tu cartera actual en relación con el punto de menor volatilidad posible y el punto de máxima eficiencia riesgo-retorno.'
                            },
                            {
                                bold: 'Capas visuales e inspección por activo',
                                code: 'Activos / Nube Monte Carlo / Tangente CML',
                                text: 'Podés encender o apagar las capas del modelo y hacer click sobre cualquier nodo para leer abajo el aporte exacto de ese activo.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Frontera eficiente de Markowitz y cálculo de las carteras de mínima varianza y máximo Sharpe.'
                    },
                    {
                        id: 'p2-tornado',
                        label: 'Tornado & VaR',
                        summary: 'El simulador de crisis históricas, desglose de pérdida diaria por activo y asimetría de mercado.',
                        paragraphs: [
                            'Si mañana se repitiera un desplome como el de 2008, el freno económico de 2020 o la suba de tasas de 2022, ¿cuánto perdería tu cartera actual y qué activo sería el principal culpable?',
                            'El cuadrante inferior izquierdo responde esas tres preguntas en tres pestañas concretas:'
                        ],
                        lead: 'El cuadrante inferior izquierdo responde esas preguntas en tres pestañas concretas:',
                        bullets: [
                            {
                                bold: 'Prueba contra cinco crisis reales',
                                code: '1. Tornado Stress',
                                text: 'Compara barra por barra cuánto caería tu cartera frente al S&P 500 ante cinco grandes shocks históricos.'
                            },
                            {
                                bold: 'Ranking de riesgo por posición',
                                code: '2. VaR 95% por Activo',
                                text: 'Ordena tus tenencias según cuántos dólares de pérdida potencial diaria aporta cada una al total del portafolio.'
                            },
                            {
                                bold: 'Comportamiento en subas y en bajas',
                                code: '3. Captura Upside/Downside',
                                text: 'Te muestra qué porcentaje de las ruedas alcistas del mercado aprovecha cada activo y cuánto logra amortiguar cuando el mercado cae.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Metodología de escenarios históricos de estrés, aporte marginal al VaR y ratios de captura.'
                    },
                    {
                        id: 'p2-corr',
                        label: 'Correlación',
                        summary: 'La matriz cruzada para comprobar si tus activos realmente diversifican o si se contagian durante un pánico.',
                        paragraphs: [
                            'Tener varios activos en cartera sólo reduce el riesgo si no se mueven todos para el mismo lado al mismo tiempo. Pero en momentos de pánico financiero, muchas correlaciones que parecían bajas saltan bruscamente hacia arriba.',
                            'El cuadrante superior derecho te permite auditar esa relación en dos escenarios:'
                        ],
                        lead: 'El cuadrante superior derecho te permite auditar esa relación en dos escenarios:',
                        bullets: [
                            {
                                bold: 'Cruce entre activos y sensibilidad',
                                code: '1. Matriz 6×6 / 2. Beta & Descorrelación',
                                text: 'Muestra qué tan parecidos se mueven cada par de activos (en verde o celeste cuando diversifican bien, y en rojo cuando se mueven demasiado juntos) y cuál es su sensibilidad frente al mercado.'
                            },
                            {
                                bold: 'Simulador de contagio en crisis',
                                code: 'Mercado Normal 1Y / Cola de Crisis Contagio',
                                text: 'Con un click cambiás las correlaciones de un año normal a las de un momento de pánico para descubrir qué posiciones dejarían de protegerte.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Cálculo de coeficientes de correlación de Pearson en condiciones normales y en estrés de mercado.'
                    },
                    {
                        id: 'p2-shock2d',
                        label: 'Choque & Markov',
                        summary: 'La tabla de impacto conjunto entre tasas y bolsa, más las probabilidades de cambio de ciclo económico.',
                        paragraphs: [
                            'En la economía real los problemas rara vez vienen de a uno: muchas veces una suba de tasas de interés coincide con una caída de las acciones. ¿Qué pasa con tu cartera si se combinan los dos factores a la vez?',
                            'El cuadrante inferior derecho cruza ambas variables y mide las probabilidades de cambio de régimen:'
                        ],
                        lead: 'El cuadrante inferior derecho cruza ambas variables y mide el ciclo de mercado:',
                        bullets: [
                            {
                                bold: 'Tabla de doble impacto',
                                code: '1. Matriz 2D Tasas × SPX',
                                text: 'Cruza movimientos de tasas (-100 a +200 puntos básicos) con caídas o subas del S&P 500 (-20% a +10%), dejándote filtrar por toda la cartera o por un activo individual.'
                            },
                            {
                                bold: 'Probabilidades de transición de ciclo',
                                code: '2. Regímenes Markov #11',
                                text: 'Calcula qué probabilidad tiene el mercado de mantenerse en calma o pasar a una fase volátil, inflacionaria o de crisis.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Sensibilidad conjunta a tasas y renta variable, y matriz de transición de estados de Markov.'
                    },
                    {
                        id: 'p2-montecarlo',
                        label: 'Monte Carlo',
                        summary: 'El panel inferior a pantalla completa con proyecciones probabilísticas a futuro y caídas históricas.',
                        paragraphs: [
                            'Mirar el pasado es útil, pero al invertir hacia adelante lo que necesitás saber es dentro de qué abanico de resultados puede moverse tu capital en los próximos seis meses, un año o dos años.',
                            'El panel inferior a ancho completo reúne tres herramientas temporales para proyectar y controlar ese camino:'
                        ],
                        lead: 'El panel inferior reúne tres herramientas temporales para proyectar ese camino:',
                        bullets: [
                            {
                                bold: 'Diez mil escenarios futuros',
                                code: '1. Proyección Monte Carlo NEW-01 / 6M, 12M y 24M',
                                text: 'Dibuja el cono de evolución probable de tu cartera distinguiendo el escenario optimista (P95 en verde), el camino central esperado (P50) y el escenario adverso (P05 en rojo).'
                            },
                            {
                                bold: 'Profundidad de caídas y estabilidad en el tiempo',
                                code: '2. Drawdown Subacuático NEW-02 / 3. Rolling 60D Sharpe & Beta NEW-05',
                                text: 'Te permiten alternar el gráfico para ver cuánto tiempo permaneció la cartera debajo de sus máximos históricos o qué tan estables fueron su eficiencia y su riesgo en ventanas móviles de 60 días.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Simulación estocástica Monte Carlo de 10,000 caminos y métricas rodantes de 60 días.'
                    }
                ]
            },
            {
                id: 'port-v3',
                label: 'Simulador',
                groupLabel: 'Portfolio',
                isPage: true,
                introParagraphs: [
                    'Antes de comprar un nuevo activo, reducir una posición o pagar por una cobertura con opciones, siempre surge la misma duda: ¿esta operación mejora de verdad mi cartera o me está sumando riesgo innecesario? ¿Y cuánto capital debería ponerle?',
                    'El Laboratorio de Estrategias Ad-Hoc (la tercera vista de Portfolio) es tu simulador previo a operar. Te permite cargar jugadas tácticas, calcular el tamaño ideal de posición, probar seguros contra caídas y ver el impacto exacto del antes y después sin tocar todavía tu cartera base.'
                ],
                intro: 'El Laboratorio de Estrategias Ad-Hoc es tu simulador pre-operación para probar órdenes, dimensionar posiciones y medir coberturas.',
                sections: [
                    {
                        id: 'p3-impact',
                        label: 'Impacto',
                        summary: 'Las seis tarjetas superiores que comparan tu cartera actual contra el resultado después de las jugadas simuladas.',
                        paragraphs: [
                            'Para saber si una idea táctica vale la pena, no basta con que el activo parezca atractivo por sí solo: tiene que mejorar los números del portafolio completo.',
                            'La fila superior te muestra de forma permanente la comparación entre tu cartera actual y la cartera con la simulación aplicada:'
                        ],
                        lead: 'La fila superior compara tu cartera actual contra la cartera con la simulación aplicada:',
                        bullets: [
                            {
                                bold: 'Efecto en ganancia y eficiencia',
                                code: 'IMPACTO EN RETORNO TOTAL / IMPACTO EN SHARPE',
                                text: 'Muestran el número base al lado del número proyectado, iluminando la diferencia en verde si la jugada suma eficiencia o en rojo si la deteriora.'
                            },
                            {
                                bold: 'Efecto en riesgo, capital y reglas',
                                code: 'IMPACTO EN VaR 95% / MAX DRAWDOWN / CAPITAL TÁCTICO / VEREDICTO COMITÉ',
                                text: 'Te indican cuánto cambia tu pérdida máxima esperada, qué porcentaje del portafolio estás comprometiendo en las pruebas y si se respetan todos los límites de seguridad.'
                            }
                        ],
                        hasTechnicalModal: false
                    },
                    {
                        id: 'p3-whatif',
                        label: 'What-If & Kelly',
                        summary: 'El simulador de boletas de compra/venta y la calculadora para definir cuánto dinero arriesgar.',
                        paragraphs: [
                            'Muchas buenas ideas de inversión terminan dando pérdidas por un error en el tamaño de la apuesta: poner muy poco no mueve la aguja, pero poner demasiado puede arruinar la cartera si el movimiento sale mal.',
                            'El primer cuadrante arriba a la izquierda une la boleta de pruebas con el cálculo matemático de tamaño:'
                        ],
                        lead: 'El primer cuadrante une la boleta de pruebas con el cálculo matemático de tamaño:',
                        bullets: [
                            {
                                bold: 'Carga de órdenes de prueba',
                                code: '1. Simulador What-If #1 / + Simular Orden',
                                text: 'Elegís cualquier activo, indicás si querés comprar, vender o cubrir y cargás el monto en dólares. En la lista inferior podés prender o apagar cada orden simulada para comparar su efecto.'
                            },
                            {
                                bold: 'Tamaño óptimo de posición',
                                code: '2. Criterio de Kelly #14 / Half-Kelly 0.5×',
                                text: 'A partir de tu probabilidad estimada de acierto y la relación entre ganancia y pérdida, te calcula qué porcentaje máximo del capital conviene asignar para crecer sin sobreexponerte.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Cálculo matemático del Criterio de Kelly y su versión conservadora Half-Kelly.'
                    },
                    {
                        id: 'p3-tailhedge',
                        label: 'Put OTM & Margen',
                        summary: 'El simulador de seguros con opciones ante caídas fuertes de mercado y el monitor de llamado de margen.',
                        paragraphs: [
                            'Cuando temés una corrección fuerte del mercado, vender todas tus posiciones suele ser costoso e ineficiente. La alternativa profesional es contratar un seguro con opciones protectoras, pero ¿cuánto cuesta ese seguro por año y cuánto te protege realmente?',
                            'El cuadrante inferior izquierdo te permite medir tanto la cobertura como el nivel de endeudamiento:'
                        ],
                        lead: 'El cuadrante inferior izquierdo mide tanto la cobertura como el nivel de garantías:',
                        bullets: [
                            {
                                bold: 'Comparador de escudos protectores',
                                code: '1. Escudo Put OTM #6',
                                text: 'Te permite alternar entre operar sin cobertura o aplicar tres tipos de seguros con opciones (sobre SPY, QQQ o volatilidad VIX), contrastando el costo anual de la prima contra los dólares que te ahorrarías en un desplome del 20%.'
                            },
                            {
                                bold: 'Control de apalancamiento y garantías',
                                code: '2. Margen & Margin Call #13',
                                text: 'Monitorea qué porcentaje de margen de mantenimiento tenés utilizado y qué caída porcentual soportaría la cartera antes de entrar en zona de llamado de margen.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Funcionamiento de las coberturas con opciones Put fuera del dinero y cálculo de garantías Reg-T.'
                    },
                    {
                        id: 'p3-committee',
                        label: 'Comité & Libro',
                        summary: 'Los dos paneles derechos con la revisión automática de límites de riesgo, el historial de órdenes y el Copiloto.',
                        paragraphs: [
                            'En el entusiasmo de probar una operación es fácil pasar por alto que un activo quedó concentrando más del 20% de toda tu cartera o que está operando en medio de una anomalía estadística severa.',
                            'Los dos cuadrantes de la derecha funcionan como tu control de riesgo automático y tu registro de auditoría:'
                        ],
                        lead: 'Los dos cuadrantes de la derecha funcionan como control de riesgo y registro:',
                        bullets: [
                            {
                                bold: 'Revisión en tres dimensiones',
                                code: '1. Quantitative Analytics, 2. Fundamental & News RAG y 3. Risk & Sizing Guardrail',
                                text: 'Evalúan tus órdenes simuladas desde lo técnico, lo fundamental y los límites duros de seguridad (alertando si alguna posición supera el tope del 20% del capital o si tiene anomalías elevadas).'
                            },
                            {
                                bold: 'Bitácora de órdenes y asistente de cartera',
                                code: 'Libro de Ejecución / 💬 Copiloto de Cartera #8',
                                text: 'El panel inferior deja constancia de cada simulación con su impacto en riesgo, mientras que el botón de diálogo arriba a la derecha abre el chat para consultar dudas directas sobre tu portafolio.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Reglas de control de riesgo pre-operación y topes de concentración por activo.'
                    },
                    {
                        id: 'p3-walkforward',
                        label: 'Walk-Forward',
                        summary: 'El gráfico inferior a pantalla completa para comprobar que tu estrategia funcione fuera del período de prueba.',
                        paragraphs: [
                            'Cualquier estrategia se puede ajustar mirando el pasado hasta que en el gráfico histórico parezca infalible. El verdadero desafío es saber si sigue funcionando cuando se enfrenta a datos nuevos de mercado.',
                            'El panel inferior a ancho completo somete la estrategia a la validación más exigente antes de pasar a producción:'
                        ],
                        lead: 'El panel inferior somete la estrategia a validación dentro y fuera de muestra:',
                        bullets: [
                            {
                                bold: 'Separación entre diseño y prueba real',
                                code: 'In-Sample Entrenamiento / Out-of-Sample Validación Pura',
                                text: 'Divide el gráfico histórico en una primera etapa donde se calibra la estrategia y una segunda etapa con datos no vistos para comprobar si mantiene su ventaja frente a la cartera base.'
                            },
                            {
                                bold: 'Nota de solidez estadística',
                                code: 'EFICIENCIA WALK-FORWARD WFE',
                                text: 'Si el indicador de eficiencia supera el 70%, confirma que los resultados son consistentes y no producto de haber forzado los números sobre el pasado.'
                            }
                        ],
                        hasTechnicalModal: true,
                        modalPreview: 'Qué mide el índice de Eficiencia Walk-Forward (WFE) y cómo detecta estrategias sobreoptimizadas.'
                    }
                ]
            }
        ]
    }
];

export const ALL_GUIDE_PAGES = [
    GUIDE_TREE_PAGES[0],
    ...GUIDE_TREE_PAGES[1].children,
    ...GUIDE_TREE_PAGES[2].children
];

/* Vinculamos las pestañas técnicas completas (GUIDE_MODALS_BY_SECTION) a cada sección con Profundizar */
ALL_GUIDE_PAGES.forEach(page => {
    page.sections?.forEach(sec => {
        if (GUIDE_MODALS_BY_SECTION[sec.id]) {
            sec.modalTabs = GUIDE_MODALS_BY_SECTION[sec.id];
        }
    });
});
