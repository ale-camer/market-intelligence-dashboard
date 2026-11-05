/* ═══════════════════════════════════════════════════════════════════════════
   CAPA INDEPENDIENTE DE IDIOMAS, SUBTÍTULOS Y TIEMPOS DE AUDIO (56 IDIOMAS)
   Separada 100% de la coreografía visual (GuideInteractiveVideoStage.jsx)
   y del texto escrito del manual (guideTreeData.js).
   ═══════════════════════════════════════════════════════════════════════════ */

export const GUIDE_VIDEO_I18N = {
  "EN": {
    "ui": {
      "walkthrough": "Live Visual Walkthrough",
      "clickPlayPause": "Click to play or pause (Space)",
      "subtitles": "Subtitles (C)",
      "fullscreen": "Fullscreen (F)",
      "exitFullscreen": "Exit Fullscreen (F or Esc)",
      "portTabs": [
        "Builder",
        "Risk",
        "Simulator",
        "Copilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Languages",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Categories",
      "scr-pulse": "02 • 24h Pulse",
      "scr-table": "03 • Table",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Heatmap",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Technical",
      "ana-compare": "03 • Compare %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D Engines",
      "res-hero": "01 • Score & Stance",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • Factors",
      "res-pulse24h": "04 • FinBERT Pulse",
      "p1-pills": "01 • Summary",
      "p1-table": "02 • Weighting",
      "p1-xray": "03 • X-Ray",
      "p1-calendar": "04 • Calendar",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Correlation",
      "p2-shock2d": "04 • Shock & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Impact",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Committee & Log",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Welcome to the Home screen: your distraction-free starting point where markets get decoded.",
      "home-header": "At the top-left corner of the Header, clicking the λ icon always brings you right back to this main stage.",
      "home-markets": "Centered at the top of the Header is Markets, your workstation to research all 213 global assets live.",
      "home-portfolio": "Right beside it in the centered menu is Portfolio, to build allocations, stress-test risk, and simulate trades.",
      "home-system": "Down in the bottom-left Footer, System opens the live observability monitor for servers and databases.",
      "home-guide": "Beside it, Guide opens this interactive step-by-step manual whenever you need it.",
      "home-langs": "At the bottom-right corner, the language button opens the centered modal to translate the platform into 56 languages.",
      "home-palettes": "And Palette opens the 5 visual reading themes while keeping financial green and red strictly intact.",
      "scr-categories": "In the top Categories bar, filter across All 213 assets, your Watchlist, or 10 specialized markets.",
      "scr-pulse": "The 4 Pulse 24h cards show aggregated volume, average RSI, P-06 regime, and top volume dislocations.",
      "scr-table": "The interactive Table features instant search, favorites, and smart columns tailored to each asset class.",
      "scr-orbital": "The Orbital view maps assets across three concentric rings by deviation with a live side inspection panel.",
      "scr-heatmap": "The Heatmap arranges the top 10 assets into proportional blocks across 8 shades of green and red.",
      "scr-maintools": "And Main Tools guides you in three steps to sovereign curves, 3D volatility, FX cross, and futures engines.",
      "ana-hero": "The Header combines the asset switcher, 9 timeframes from 1m to ALL, and the 5 core indicators.",
      "ana-technical": "The Technical lens overlays SMA 20, VWAP, and 2σ Bollinger Bands with bottom volume confirmation.",
      "ana-compare": "With Compare %, measure net percentage advantage or Alpha Spread from 0% against a compatible peer or index.",
      "ana-micro": "Micro & Flow detects volume spikes via 20d Z-Score, spread liquidity dislocation, and the P-06 anomaly score.",
      "ana-engines": "The fourth tab is a dynamic ad-hoc tool that varies by asset class: because NVDA is an equity it opens 3D Volatility & Options Payoff, while bonds, FX, and commodities launch their own specialized tools.",
      "res-hero": "At the top, Score & Stance summarizes the fundamental verdict, weighted rating, and headline thermometer.",
      "res-rag": "In the left column, RAG Document Chat answers verified queries grounded in official SEC 10-K and 10-Q filings.",
      "res-factors": "In the center column, the Factors accordion contrasts the top 5 bull drivers against the top 5 bear risks.",
      "res-pulse24h": "On the right, FinBERT Pulse scores breaking headlines in real time and plots the 24-hour sentiment curve.",
      "p1-pills": "The 6 Summary cards recompute live CAGR, Sharpe and Sortino, 95% VaR, Max Drawdown, Alpha, and diversification.",
      "p1-table": "In the Weighting table, add any of the 213 assets, set exact percentage weights, or rebalance to 100%.",
      "p1-xray": "Top-right, the 5-tab X-Ray panel audits ETF overlap, exposure, Brinson attribution, cashflow, and custody.",
      "p1-calendar": "Below X-Ray, the Monthly Calendar displays January-to-December return consistency and YTD totals.",
      "p1-backtest": "And at the full-width bottom, Backtesting compares your portfolio against the S&P 500, 60/40, All-Weather, and Min-Variance.",
      "p2-markowitz": "The first quadrant plots the 2D Markowitz Efficient Frontier and positions your portfolio versus Min-Var and Max-Sharpe.",
      "p2-tornado": "The bottom-left quadrant tests 5 historical crises, per-asset 95% VaR contribution, and Upside/Downside capture.",
      "p2-corr": "Top-right, the 6×6 Matrix compares correlations in normal conditions against crisis tail contagion.",
      "p2-shock2d": "Bottom-right, Shock & Markov crosses interest rate shifts with S&P 500 moves and estimates regime transitions.",
      "p2-montecarlo": "And the bottom panel projects 10,000 Monte Carlo paths across P95, P50, and P05, underwater Drawdown, and rolling Sharpe.",
      "p3-impact": "The 6 Impact cards compare your current portfolio against the projected state after your simulated trades.",
      "p3-whatif": "Top-left, What-If & Kelly simulates buy or sell tickets and computes the optimal Half-Kelly position size.",
      "p3-tailhedge": "Bottom-left, OTM Put & Margin simulates protective option shields and monitors Reg-T maintenance margin.",
      "p3-committee": "In the two right panels, the 3-pillar Committee audits risk guardrails alongside the Execution Log and Copilot.",
      "p3-walkforward": "And at the bottom, the Walk-Forward chart validates In-Sample and Out-of-Sample performance with the WFE index."
    }
  },
  "ES": {
    "ui": {
      "walkthrough": "Recorrido Visual en Vivo",
      "clickPlayPause": "Hacé clic para reproducir o pausar (Espacio)",
      "subtitles": "Subtítulos (C)",
      "fullscreen": "Pantalla completa (F)",
      "exitFullscreen": "Salir de pantalla completa (F o Esc)",
      "portTabs": [
        "Constructor",
        "Riesgo",
        "Simulador",
        "Copiloto"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Idiomas",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Categorías",
      "scr-pulse": "02 • Pulso 24h",
      "scr-table": "03 • Tabla",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Mapa Calor",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Cabecera",
      "ana-technical": "02 • Técnico",
      "ana-compare": "03 • Comparar %",
      "ana-micro": "04 • Micro & Flujo",
      "ana-engines": "05 • Motores 3D/2D",
      "res-hero": "01 • Nota & Postura",
      "res-rag": "02 • Chat RAG",
      "res-factors": "03 • Factores",
      "res-pulse24h": "04 • Pulso FinBERT",
      "p1-pills": "01 • Resumen",
      "p1-table": "02 • Ponderación",
      "p1-xray": "03 • Radiografía",
      "p1-calendar": "04 • Calendario",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Correlación",
      "p2-shock2d": "04 • Choque & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Impacto",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • Put OTM & Margen",
      "p3-committee": "04 • Comité & Libro",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Bienvenido a la pantalla Home: el punto de partida libre de distracciones donde se decodifican los mercados.",
      "home-header": "En la esquina superior izquierda del Header, un clic en el ícono λ te devuelve siempre a esta portada principal.",
      "home-markets": "En el centro superior del Header tenés Markets, tu estación para investigar los 213 activos globales en vivo.",
      "home-portfolio": "Y a su lado en el menú central está Portfolio, para construir carteras, medir el riesgo y simular órdenes.",
      "home-system": "Abajo a la izquierda en el Footer, System abre el monitor de estado de servidores y bases de datos en tiempo real.",
      "home-guide": "A su lado, Guide abre este manual interactivo paso a paso en cualquier momento.",
      "home-langs": "En la esquina inferior derecha, el botón de idioma abre la ventana central para traducir la plataforma a 56 lenguas.",
      "home-palettes": "Y Palette despliega los 5 ambientes visuales de lectura manteniendo intactos el verde y el rojo financieros.",
      "scr-categories": "En la barra superior de Categorías filtrás entre Todos los 213 activos, tu Watchlist o 10 mercados especializados.",
      "scr-pulse": "Las 4 tarjetas de Pulso 24h muestran el volumen agregado, el RSI promedio, el régimen P-06 y los picos de volumen.",
      "scr-table": "La Tabla interactiva incluye buscador, favoritos y columnas inteligentes adaptadas a cada clase de activo.",
      "scr-orbital": "La vista Orbital ubica los activos en tres anillos concéntricos según su desvío e incluye inspección lateral en vivo.",
      "scr-heatmap": "El Mapa de Calor ordena los 10 activos líderes en bloques proporcionales con 8 tonos de verde y rojo.",
      "scr-maintools": "Y Main Tools te guía en tres pasos hacia los motores de curvas soberanas, volatilidad 3D, divisas y futuros.",
      "ana-hero": "La Cabecera reúne el selector de activo, las 9 ventanas de tiempo de 1m a ALL y los 5 indicadores clave.",
      "ana-technical": "La lente Técnico superpone SMA 20, VWAP y Bandas de Bollinger 2σ con confirmación de volumen en la base.",
      "ana-compare": "Con Comparar % medís desde 0% la ventaja neta o Alpha Spread frente a otro activo o índice compatible.",
      "ana-micro": "Micro & Flujo detecta picos de volumen Z-Score 20d, tensión de liquidez en spreads y el puntaje P-06.",
      "ana-engines": "La cuarta pestaña es una herramienta ad-hoc según el tipo de activo: al ser NVDA una acción abre Volatilidad 3D y Payoff, mientras que bonos, divisas y materias primas activan sus propios motores.",
      "res-hero": "Arriba, Nota & Postura resume el veredicto fundamental, la calificación ponderada y el termómetro de titulares.",
      "res-rag": "En la columna izquierda, el Chat Documental RAG responde consultas verificadas sobre balances SEC 10-K y 10-Q.",
      "res-factors": "En la columna central, el acordeón de Factores enfrenta los 5 motores alcistas contra los 5 riesgos bajistas.",
      "res-pulse24h": "A la derecha, el Pulso FinBERT califica cada noticia en tiempo real y traza la curva de sentimiento de 24 horas.",
      "p1-pills": "Las 6 tarjetas de Resumen recalculan en vivo el CAGR, Sharpe y Sortino, VaR 95%, Max Drawdown, Alpha y diversificación.",
      "p1-table": "En la tabla de Ponderación sumás cualquiera de los 213 activos, definís su peso exacto o reequilibrás al 100%.",
      "p1-xray": "Arriba a la derecha, Radiografía audita en 5 pestañas el solapamiento en ETFs, exposición, atribución, cashflow y custodia.",
      "p1-calendar": "Debajo de la Radiografía, el Calendario mensual muestra de enero a diciembre la consistencia histórica de tus retornos.",
      "p1-backtest": "Y en la base a ancho completo, Backtesting compara tu cartera contra el S&P 500, 60/40 Classic, All-Weather y Min-Variance.",
      "p2-markowitz": "El primer cuadrante traza la Frontera Eficiente de Markowitz 2D y ubica tu cartera frente a Min-Var y Max-Sharpe.",
      "p2-tornado": "El cuadrante inferior izquierdo evalúa 5 crisis históricas reales, el VaR 95% por activo y la captura Upside/Downside.",
      "p2-corr": "Arriba a la derecha, la Matriz 6×6 compara correlaciones en un año normal frente a contagio en cola de crisis.",
      "p2-shock2d": "Abajo a la derecha, Choque & Markov cruza variaciones de tasas contra el S&P 500 y estima cambios de régimen.",
      "p2-montecarlo": "Y el panel inferior proyecta 10,000 caminos de Monte Carlo en P95, P50 y P05, Drawdown subacuático y Sharpe rodante.",
      "p3-impact": "Las 6 tarjetas de Impacto comparan tu cartera actual contra el resultado proyectado después de las jugadas simuladas.",
      "p3-whatif": "Arriba a la izquierda, What-If & Kelly simula órdenes de compra o venta y calcula el tamaño óptimo Half-Kelly.",
      "p3-tailhedge": "Abajo a la izquierda, Put OTM & Margen simula seguros con opciones protectoras y monitorea garantías Reg-T.",
      "p3-committee": "En los dos paneles derechos, el Comité de 3 pilares audita límites de riesgo junto al Libro de Ejecución y el Copiloto.",
      "p3-walkforward": "Y en la base, el gráfico Walk-Forward valida el rendimiento In-Sample y Out-of-Sample con el índice de eficiencia WFE."
    }
  },
  "PT": {
    "ui": {
      "walkthrough": "Tour Visual ao Vivo",
      "clickPlayPause": "Clique para reproduzir ou pausar (Espaço)",
      "subtitles": "Legendas (C)",
      "fullscreen": "Tela cheia (F)",
      "exitFullscreen": "Sair da tela cheia (F ou Esc)",
      "portTabs": [
        "Construtor",
        "Risco",
        "Simulador",
        "Copiloto"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Idiomas",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Categorias",
      "scr-pulse": "02 • Pulso 24h",
      "scr-table": "03 • Tabela",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Mapa Calor",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Cabeçalho",
      "ana-technical": "02 • Técnico",
      "ana-compare": "03 • Comparar %",
      "ana-micro": "04 • Micro & Fluxo",
      "ana-engines": "05 • Motores 3D/2D",
      "res-hero": "01 • Nota & Postura",
      "res-rag": "02 • Chat RAG",
      "res-factors": "03 • Fatores",
      "res-pulse24h": "04 • Pulso FinBERT",
      "p1-pills": "01 • Resumo",
      "p1-table": "02 • Ponderação",
      "p1-xray": "03 • Raio-X",
      "p1-calendar": "04 • Calendário",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Correlação",
      "p2-shock2d": "04 • Choque & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Impacto",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • Put OTM & Margem",
      "p3-committee": "04 • Comitê & Livro",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Bem-vindo à tela Home: o ponto de partida livre de distrações onde os mercados são decodificados.",
      "home-header": "No canto superior esquerdo do Header, clicar no ícone λ traz você sempre de volta a esta tela principal.",
      "home-markets": "No centro superior do Header está Markets, sua estação para pesquisar os 213 ativos globais ao vivo.",
      "home-portfolio": "E ao lado no menu central está Portfolio, para construir carteiras, medir o risco e simular ordens.",
      "home-system": "Abaixo à esquerda no Footer, System abre o monitor de status de servidores e bancos de dados em tempo real.",
      "home-guide": "Ao seu lado, Guide abre este manual interativo passo a passo a qualquer momento.",
      "home-langs": "No canto inferior direito, o botão de idioma abre a janela central para traduzir a plataforma para 56 línguas.",
      "home-palettes": "E Palette exibe os 5 temas visuais de leitura mantendo intactos o verde e o vermelho financeiros.",
      "scr-categories": "Na barra superior de Categorias você filtra entre Todos os 213 ativos, sua Watchlist ou 10 mercados especializados.",
      "scr-pulse": "Os 4 cartões de Pulso 24h mostram o volume agregado, o RSI médio, o regime P-06 e os picos de volume.",
      "scr-table": "A Tabela interativa inclui busca instantânea, favoritos e colunas inteligentes adaptadas a cada classe de ativo.",
      "scr-orbital": "A visão Orbital posiciona os ativos em três anéis concêntricos por desvio e inclui inspeção lateral ao vivo.",
      "scr-heatmap": "O Mapa de Calor organiza os 10 ativos líderes em blocos proporcionais com 8 tons de verde e vermelho.",
      "scr-maintools": "E Main Tools guia você em três passos até os motores de curvas soberanas, volatilidade 3D, câmbio FX e futuros.",
      "ana-hero": "O Cabeçalho reúne o seletor de ativo, as 9 janelas de tempo de 1m a ALL e os 5 indicadores principais.",
      "ana-technical": "A lente Técnico sobrepõe SMA 20, VWAP e Bandas de Bollinger 2σ com confirmação de volume na base.",
      "ana-compare": "Com Comparar % você mede desde 0% a vantagem líquida ou Alpha Spread contra outro ativo ou índice compatível.",
      "ana-micro": "Micro & Fluxo detecta picos de volume Z-Score 20d, tensão de liquidez em spreads e a pontuação P-06.",
      "ana-engines": "A quarta aba é uma ferramenta ad-hoc que varia por classe de ativo: como NVDA é uma ação abre Volatilidade 3D e Payoff, enquanto títulos, câmbio e commodities ativam seus próprios motores.",
      "res-hero": "No topo, Nota & Postura resume o veredito fundamental, a classificação ponderada e o termômetro de manchetes.",
      "res-rag": "Na coluna esquerda, o Chat Documental RAG responde consultas verificadas sobre balanços SEC 10-K e 10-Q.",
      "res-factors": "Na coluna central, o acordeão de Fatores confronta os 5 motores de alta contra os 5 riscos de baixa.",
      "res-pulse24h": "À direita, o Pulso FinBERT avalia cada notícia em tempo real e traça a curva de sentimento de 24 horas.",
      "p1-pills": "Os 6 cartões de Resumo recalculam ao vivo o CAGR, Sharpe e Sortino, VaR 95%, Max Drawdown, Alpha e diversificação.",
      "p1-table": "Na tabela de Ponderação você adiciona qualquer um dos 213 ativos, define seu peso exato ou reequilibra para 100%.",
      "p1-xray": "No topo à direita, Raio-X audita em 5 abas a sobreposição em ETFs, exposição, atribuição, fluxo de caixa e custódia.",
      "p1-calendar": "Abaixo do Raio-X, o Calendário mensal mostra de janeiro a dezembro a consistência histórica dos seus retornos.",
      "p1-backtest": "E na base em largura total, Backtesting compara sua carteira contra o S&P 500, 60/40 Classic, All-Weather e Min-Variance.",
      "p2-markowitz": "O primeiro quadrante traça a Fronteira Eficiente de Markowitz 2D e posiciona sua carteira frente a Min-Var e Max-Sharpe.",
      "p2-tornado": "O quadrante inferior esquerdo avalia 5 crises históricas reais, o VaR 95% por ativo e a captura Upside/Downside.",
      "p2-corr": "No topo à direita, a Matriz 6×6 compara correlações em condições normais contra contágio em cauda de crise.",
      "p2-shock2d": "Abaixo à direita, Choque & Markov cruza variações de juros contra o S&P 500 e estima mudanças de regime.",
      "p2-montecarlo": "E o painel inferior projeta 10,000 caminhos de Monte Carlo em P95, P50 e P05, Drawdown subaquático e Sharpe rolante.",
      "p3-impact": "Os 6 cartões de Impacto comparam sua carteira atual contra o resultado projetado após as operações simuladas.",
      "p3-whatif": "No topo à esquerda, What-If & Kelly simula ordens de compra ou venda e calcula o tamanho ótimo Half-Kelly.",
      "p3-tailhedge": "Abaixo à esquerda, Put OTM & Margem simula seguros com opções protetoras e monitora garantias Reg-T.",
      "p3-committee": "Nos dois painéis direitos, o Comitê de 3 pilares audita limites de risco junto ao Livro de Execução e ao Copiloto.",
      "p3-walkforward": "E na base, o gráfico Walk-Forward valida o desempenho In-Sample e Out-of-Sample com o índice de eficiência WFE."
    }
  },
  "FR": {
    "ui": {
      "walkthrough": "Visite Visuelle en Direct",
      "clickPlayPause": "Cliquez pour lire ou mettre en pause (Espace)",
      "subtitles": "Sous-titres (C)",
      "fullscreen": "Plein écran (F)",
      "exitFullscreen": "Quitter le plein écran (F ou Échap)",
      "portTabs": [
        "Constructeur",
        "Risque",
        "Simulateur",
        "Copilote"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Langues",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Catégories",
      "scr-pulse": "02 • Pouls 24h",
      "scr-table": "03 • Tableau",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Carte Thermique",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • En-tête",
      "ana-technical": "02 • Technique",
      "ana-compare": "03 • Comparer %",
      "ana-micro": "04 • Micro & Flux",
      "ana-engines": "05 • Moteurs 3D/2D",
      "res-hero": "01 • Note & Posture",
      "res-rag": "02 • Chat RAG",
      "res-factors": "03 • Facteurs",
      "res-pulse24h": "04 • Pouls FinBERT",
      "p1-pills": "01 • Résumé",
      "p1-table": "02 • Pondération",
      "p1-xray": "03 • Radiographie",
      "p1-calendar": "04 • Calendrier",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Corrélation",
      "p2-shock2d": "04 • Choc & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Impact",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • Put OTM & Marge",
      "p3-committee": "04 • Comité & Livre",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Bienvenue sur l’écran Home : votre point de départ sans distraction où les marchés sont décodés.",
      "home-header": "Dans le coin supérieur gauche du Header, cliquer sur l’icône λ vous ramène toujours vers cette scène principale.",
      "home-markets": "Au centre supérieur du Header se trouve Markets, votre station pour analyser les 213 actifs mondiaux en direct.",
      "home-portfolio": "Et juste à côté dans le menu central se trouve Portfolio, pour construire des allocations, mesurer le risque et simuler des ordres.",
      "home-system": "En bas à gauche dans le Footer, System ouvre le moniteur d’état des serveurs et bases de données en temps réel.",
      "home-guide": "À côté, Guide ouvre ce manuel interactif étape par étape à tout moment.",
      "home-langs": "Dans le coin inférieur droit, le bouton de langue ouvre la fenêtre centrale pour traduire la plateforme en 56 langues.",
      "home-palettes": "Et Palette déploie les 5 ambiances visuelles de lecture tout en gardant intacts le vert et le rouge financiers.",
      "scr-categories": "Dans la barre supérieure des Catégories, filtrez parmi les 213 actifs, votre Watchlist ou 10 marchés spécialisés.",
      "scr-pulse": "Les 4 cartes Pouls 24h affichent le volume agrégé, le RSI moyen, le régime P-06 et les pics de volume.",
      "scr-table": "Le Tableau interactif inclut une recherche instantanée, des favoris et des colonnes adaptées à chaque classe d’actifs.",
      "scr-orbital": "La vue Orbital place les actifs sur trois anneaux concentriques selon leur écart avec un panneau d’inspection en direct.",
      "scr-heatmap": "La Carte Thermique organise les 10 actifs principaux en blocs proportionnels sur 8 nuances de vert et de rouge.",
      "scr-maintools": "Et Main Tools vous guide en trois étapes vers les moteurs de courbes souveraines, volatilité 3D, devises FX et contrats à terme.",
      "ana-hero": "L’En-tête réunit le sélecteur d’actif, les 9 horizons temporels de 1m à ALL et les 5 indicateurs clés.",
      "ana-technical": "La vue Technique superpose SMA 20, VWAP et Bandes de Bollinger 2σ avec confirmation des volumes en bas.",
      "ana-compare": "Avec Comparer %, mesurez depuis 0% l’avantage net ou Alpha Spread face à un autre actif ou indice compatible.",
      "ana-micro": "Micro & Flux détecte les pics de volume Z-Score 20j, la tension de liquidité des spreads et le score P-06.",
      "ana-engines": "Le quatrième onglet est un outil ad-hoc qui varie selon la classe d’actif : comme NVDA est une action il ouvre Volatilité 3D et Payoff, tandis que les obligations, devises et matières premières lancent leurs propres moteurs.",
      "res-hero": "En haut, Note & Posture résume le verdict fondamental, la note pondérée et le thermomètre des titres.",
      "res-rag": "Dans la colonne de gauche, le Chat Documentaire RAG répond aux requêtes vérifiées sur les rapports SEC 10-K et 10-Q.",
      "res-factors": "Dans la colonne centrale, l’accordéon des Facteurs oppose les 5 moteurs haussiers aux 5 risques baissiers.",
      "res-pulse24h": "À droite, le Pouls FinBERT évalue chaque dépêche en temps réel et trace la courbe de sentiment sur 24 heures.",
      "p1-pills": "Les 6 cartes de Résumé recalculent en direct le CAGR, Sharpe et Sortino, VaR 95%, Max Drawdown, Alpha et la diversification.",
      "p1-table": "Dans la table de Pondération, ajoutez l’un des 213 actifs, définissez son poids exact ou rééquilibrez à 100%.",
      "p1-xray": "En haut à droite, Radiographie audite en 5 onglets le chevauchement des ETF, l’exposition, l’attribution, les flux et la garde.",
      "p1-calendar": "Sous la Radiographie, le Calendrier mensuel affiche de janvier à décembre la régularité historique des rendements.",
      "p1-backtest": "Et en bas sur toute la largeur, Backtesting compare votre portefeuille au S&P 500, 60/40 Classic, All-Weather et Min-Variance.",
      "p2-markowitz": "Le premier quadrant trace la Frontière Efficiente de Markowitz 2D et situe votre portefeuille face à Min-Var et Max-Sharpe.",
      "p2-tornado": "Le quadrant inférieur gauche évalue 5 crises historiques réelles, la VaR 95% par actif et la capture Upside/Downside.",
      "p2-corr": "En haut à droite, la Matrice 6×6 compare les corrélations en régime normal face à la contagion de crise.",
      "p2-shock2d": "En bas à droite, Choc & Markov croise les variations de taux avec le S&P 500 et estime les changements de régime.",
      "p2-montecarlo": "Et le panneau inférieur projette 10,000 trajectoires de Monte Carlo en P95, P50 et P05, le Drawdown et le Sharpe glissant.",
      "p3-impact": "Les 6 cartes d’Impact comparent votre portefeuille actuel au résultat projeté après vos opérations simulées.",
      "p3-whatif": "En haut à gauche, What-If & Kelly simule des ordres d’achat ou de vente et calcule la taille optimale Half-Kelly.",
      "p3-tailhedge": "En bas à gauche, Put OTM & Marge simule des couvertures par options protectrices et surveille la marge Reg-T.",
      "p3-committee": "Dans les deux panneaux de droite, le Comité à 3 piliers audite les limites de risque avec le Livre d’Exécution et le Copilote.",
      "p3-walkforward": "Et en bas, le graphique Walk-Forward valide la performance In-Sample et Out-of-Sample avec l’indice d’efficacité WFE."
    }
  },
  "DE": {
    "ui": {
      "walkthrough": "Live-Video-Rundgang",
      "clickPlayPause": "Klicken zum Abspielen oder Pausieren (Leertaste)",
      "subtitles": "Untertitel (C)",
      "fullscreen": "Vollbild (F)",
      "exitFullscreen": "Vollbild beenden (F oder Esc)",
      "portTabs": [
        "Portfolio-Bau",
        "Risiko",
        "Simulator",
        "Copilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Sprachen",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategorien",
      "scr-pulse": "02 • 24h-Puls",
      "scr-table": "03 • Tabelle",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Heatmap",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Kopfzeile",
      "ana-technical": "02 • Technik",
      "ana-compare": "03 • Vergleich %",
      "ana-micro": "04 • Mikro & Fluss",
      "ana-engines": "05 • 3D/2D-Engines",
      "res-hero": "01 • Note & Haltung",
      "res-rag": "02 • RAG-Chat",
      "res-factors": "03 • Faktoren",
      "res-pulse24h": "04 • FinBERT-Puls",
      "p1-pills": "01 • Übersicht",
      "p1-table": "02 • Gewichtung",
      "p1-xray": "03 • Röntgenblick",
      "p1-calendar": "04 • Kalender",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Korrelation",
      "p2-shock2d": "04 • Schock & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Auswirkung",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM-Put & Margin",
      "p3-committee": "04 • Komitee & Buch",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Willkommen auf dem Home-Bildschirm: Ihrem ablenkungsfreien Ausgangspunkt, an dem die Märkte entschlüsselt werden.",
      "home-header": "Oben links im Header bringt Sie ein Klick auf das λ-Symbol jederzeit zurück zu dieser Hauptansicht.",
      "home-markets": "Mittig oben im Header befindet sich Markets, Ihre Arbeitsstation zur Live-Analyse aller 213 globalen Assets.",
      "home-portfolio": "Daneben im zentralen Menü liegt Portfolio, um Allokationen aufzubauen, Risiken zu prüfen und Orders zu simulieren.",
      "home-system": "Unten links im Footer öffnet System den Echtzeit-Monitor für Server und Datenbanken.",
      "home-guide": "Direkt daneben öffnet Guide jederzeit dieses interaktive Schritt-für-Schritt-Handbuch.",
      "home-langs": "Unten rechts öffnet die Sprachschaltfläche das zentrale Fenster zur Übersetzung der Plattform in 56 Sprachen.",
      "home-palettes": "Und Palette entfaltet die 5 visuellen Lese-Themen, wobei das finanzielle Grün und Rot strikt erhalten bleiben.",
      "scr-categories": "In der oberen Kategorienleiste filtern Sie zwischen allen 213 Assets, Ihrer Watchlist oder 10 Spezialmärkten.",
      "scr-pulse": "Die 4 Karten des 24h-Pulses zeigen aggregiertes Volumen, durchschnittlichen RSI, das P-06-Regime und Volumenspitzen.",
      "scr-table": "Die interaktive Tabelle bietet Sofortsuche, Favoriten und intelligente Spalten für jede Anlageklasse.",
      "scr-orbital": "Die Orbital-Ansicht ordnet Assets nach Abweichung auf drei konzentrischen Ringen mit Live-Seiteninspektion an.",
      "scr-heatmap": "Die Heatmap gruppiert die 10 führenden Assets in proportionale Blöcke mit 8 Grün- und Rottönen.",
      "scr-maintools": "Und Main Tools führt Sie in drei Schritten zu Zinsstrukturkurven, 3D-Volatilität, Devisen und Futures-Engines.",
      "ana-hero": "Die Kopfzeile vereint den Asset-Umschalter, 9 Zeitfenster von 1m bis ALL und die 5 Kernindikatoren.",
      "ana-technical": "Die Technik-Ansicht überlagert SMA 20, VWAP und 2σ-Bollinger-Bänder mit Volumenbestätigung am unteren Rand.",
      "ana-compare": "Mit Vergleich % messen Sie ab 0% den Nettovorteil oder Alpha Spread gegenüber einem kompatiblen Asset oder Index.",
      "ana-micro": "Mikro & Fluss erkennt Volumenspitzen per 20-Tage-Z-Score, Spread-Liquiditätsspannungen und den P-06-Wert.",
      "ana-engines": "Der vierte Reiter ist ein dynamisches Ad-hoc-Tool je nach Anlageklasse: Da NVDA eine Aktie ist, öffnet er 3D-Volatilität und Options-Payoff, während Anleihen, Devisen und Rohstoffe ihre eigenen Spezialmotoren starten.",
      "res-hero": "Oben fasst Note & Haltung das fundamentale Urteil, die gewichtete Bewertung und das Schlagzeilen-Thermometer zusammen.",
      "res-rag": "In der linken Spalte beantwortet der RAG-Dokumenten-Chat verifizierte Fragen zu offiziellen SEC-10-K- und 10-Q-Berichten.",
      "res-factors": "In der mittleren Spalte stellt das Faktoren-Akkordeon die 5 Aufwärtstreiber den 5 Abwärtsrisiken gegenüber.",
      "res-pulse24h": "Rechts bewertet der FinBERT-Puls jede Eilmeldung in Echtzeit und zeichnet die 24-Stunden-Stimmungskurve.",
      "p1-pills": "Die 6 Übersichtskarten berechnen live CAGR, Sharpe und Sortino, 95%-VaR, Max Drawdown, Alpha und Diversifikation.",
      "p1-table": "In der Gewichtungstabelle fügen Sie jedes der 213 Assets hinzu, legen exakte Gewichte fest oder balancieren auf 100% aus.",
      "p1-xray": "Oben rechts prüft der Röntgenblick in 5 Reitern ETF-Überlappungen, Engagement, Attribution, Cashflow und Verwahrung.",
      "p1-calendar": "Unter dem Röntgenblick zeigt der Monatskalender von Januar bis Dezember die historische Renditekonsistenz.",
      "p1-backtest": "Und unten über die volle Breite vergleicht Backtesting Ihr Portfolio mit dem S&P 500, 60/40 Classic, All-Weather und Min-Variance.",
      "p2-markowitz": "Der erste Quadrant zeichnet die 2D-Markowitz-Effizienzgrenze und positioniert Ihr Portfolio gegenüber Min-Var und Max-Sharpe.",
      "p2-tornado": "Der untere linke Quadrant testet 5 reale historische Krisen, den 95%-VaR-Beitrag pro Asset und Upside/Downside-Capture.",
      "p2-corr": "Oben rechts vergleicht die 6×6-Matrix Korrelationen im Normaljahr mit Krisen-Ansteckungseffekten.",
      "p2-shock2d": "Unten rechts kreuzt Schock & Markov Zinsänderungen mit S&P-500-Bewegungen und schätzt Regimewechsel.",
      "p2-montecarlo": "Und das untere Panel projiziert 10,000 Monte-Carlo-Pfade für P95, P50 und P05, Unterwasser-Drawdown und rollierenden Sharpe.",
      "p3-impact": "Die 6 Auswirkungskarten vergleichen Ihr aktuelles Portfolio mit dem projizierten Zustand nach Ihren simulierten Trades.",
      "p3-whatif": "Oben links simuliert What-If & Kelly Kauf- oder Verkaufsorders und berechnet die optimale Half-Kelly-Positionsgröße.",
      "p3-tailhedge": "Unten links simuliert OTM-Put & Margin Schutzoptionen und überwacht die Reg-T-Sicherheitsmarge.",
      "p3-committee": "In den beiden rechten Panels prüft das 3-Säulen-Komitee Risikoschranken neben dem Ausführungsbuch und dem Copilot.",
      "p3-walkforward": "Und unten validiert das Walk-Forward-Diagramm die In-Sample- und Out-of-Sample-Performance mit dem WFE-Effizienzindex."
    }
  },
  "IT": {
    "ui": {
      "walkthrough": "Tour Visivo dal Vivo",
      "clickPlayPause": "Clicca per riprodurre o mettere in pausa (Spazio)",
      "subtitles": "Sottotitoli (C)",
      "fullscreen": "Schermo intero (F)",
      "exitFullscreen": "Esci da schermo intero (F o Esc)",
      "portTabs": [
        "Costruttore",
        "Rischio",
        "Simulatore",
        "Copilota"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Lingue",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Categorie",
      "scr-pulse": "02 • Impulso 24h",
      "scr-table": "03 • Tabella",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Mappa Calore",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Intestazione",
      "ana-technical": "02 • Tecnico",
      "ana-compare": "03 • Confronta %",
      "ana-micro": "04 • Micro & Flusso",
      "ana-engines": "05 • Motori 3D/2D",
      "res-hero": "01 • Voto & Posizione",
      "res-rag": "02 • Chat RAG",
      "res-factors": "03 • Fattori",
      "res-pulse24h": "04 • Impulso FinBERT",
      "p1-pills": "01 • Riepilogo",
      "p1-table": "02 • Ponderazione",
      "p1-xray": "03 • Radiografia",
      "p1-calendar": "04 • Calendario",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Correlazione",
      "p2-shock2d": "04 • Shock & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Impatto",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • Put OTM & Margine",
      "p3-committee": "04 • Comitato & Libro",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Benvenuto nella schermata Home: il tuo punto di partenza privo di distrazioni dove i mercati vengono decodificati.",
      "home-header": "Nell’angolo superiore sinistro dell’Header, un clic sull’icona λ ti riporta sempre a questa schermata principale.",
      "home-markets": "Al centro superiore dell’Header trovi Markets, la tua postazione per analizzare dal vivo i 213 asset globali.",
      "home-portfolio": "E accanto nel menu centrale c’è Portfolio, per costruire portafogli, misurare il rischio e simulare ordini.",
      "home-system": "In basso a sinistra nel Footer, System apre il monitor di stato di server e database in tempo reale.",
      "home-guide": "Accanto, Guide apre questo manuale interattivo passo dopo passo in qualsiasi momento.",
      "home-langs": "Nell’angolo inferiore destro, il pulsante della lingua apre la finestra centrale per tradurre la piattaforma in 56 lingue.",
      "home-palettes": "E Palette apre i 5 temi visivi di lettura mantenendo intatti il verde e il rosso finanziari.",
      "scr-categories": "Nella barra superiore delle Categorie filtri tra tutti i 213 asset, la tua Watchlist o 10 mercati specializzati.",
      "scr-pulse": "Le 4 schede Impulso 24h mostrano il volume aggregato, l’RSI medio, il regime P-06 e i picchi di volume.",
      "scr-table": "La Tabella interattiva include ricerca istantanea, preferiti e colonne intelligenti adattate a ogni classe di attivo.",
      "scr-orbital": "La vista Orbital dispone gli asset su tre anelli concentrici in base allo scostamento con ispezione laterale dal vivo.",
      "scr-heatmap": "La Mappa di Calore ordina i 10 asset principali in blocchi proporzionali con 8 tonalità di verde e rosso.",
      "scr-maintools": "E Main Tools ti guida in tre passi verso i motori di curve sovrane, volatilità 3D, cambi FX e future.",
      "ana-hero": "L’Intestazione riunisce il selettore di asset, i 9 orizzonti temporali da 1m a ALL e i 5 indicatori chiave.",
      "ana-technical": "La lente Tecnico sovrappone SMA 20, VWAP e Bande di Bollinger 2σ con conferma dei volumi in basso.",
      "ana-compare": "Con Confronta % misuri da 0% il vantaggio netto o Alpha Spread rispetto a un altro asset o indice compatibile.",
      "ana-micro": "Micro & Flusso rileva i picchi di volume Z-Score 20g, la tensione di liquidità negli spread e il punteggio P-06.",
      "ana-engines": "La quarta scheda è uno strumento ad-hoc che varia per classe di attivo: poiché NVDA è un’azione apre Volatilità 3D e Payoff, mentre obbligazioni, valute e materie prime attivano i propri motori.",
      "res-hero": "In alto, Voto & Posizione riassume il verdetto fondamentale, il punteggio ponderato e il termometro dei titoli.",
      "res-rag": "Nella colonna di sinistra, la Chat Documentale RAG risponde a domande verificate sui bilanci SEC 10-K e 10-Q.",
      "res-factors": "Nella colonna centrale, la fisarmonica dei Fattori confronta i 5 driver rialzisti con i 5 rischi ribassisti.",
      "res-pulse24h": "A destra, l’Impulso FinBERT valuta ogni notizia in tempo reale e traccia la curva del sentiment a 24 ore.",
      "p1-pills": "Le 6 schede di Riepilogo ricalcolano dal vivo CAGR, Sharpe e Sortino, VaR 95%, Max Drawdown, Alpha e diversificazione.",
      "p1-table": "Nella tabella di Ponderazione aggiungi uno qualsiasi dei 213 asset, imposti il peso esatto o ribilanci al 100%.",
      "p1-xray": "In alto a destra, Radiografia verifica in 5 schede la sovrapposizione ETF, l’esposizione, l’attribuzione, i flussi e la custodia.",
      "p1-calendar": "Sotto la Radiografia, il Calendario mensile mostra da gennaio a dicembre la coerenza storica dei rendimenti.",
      "p1-backtest": "E alla base a tutta larghezza, Backtesting confronta il tuo portafoglio con S&P 500, 60/40 Classic, All-Weather e Min-Variance.",
      "p2-markowitz": "Il primo quadrante traccia la Frontiera Efficiente di Markowitz 2D e posiziona il portafoglio rispetto a Min-Var e Max-Sharpe.",
      "p2-tornado": "Il quadrante inferiore sinistro valuta 5 crisi storiche reali, il VaR 95% per asset e la cattura Upside/Downside.",
      "p2-corr": "In alto a destra, la Matrice 6×6 confronta le correlazioni in condizioni normali con il contagio di coda in crisi.",
      "p2-shock2d": "In basso a destra, Shock & Markov incrocia le variazioni dei tassi con l’S&P 500 e stima i cambi di regime.",
      "p2-montecarlo": "E il pannello inferiore proietta 10,000 percorsi Monte Carlo su P95, P50 e P05, Drawdown subacqueo e Sharpe mobile.",
      "p3-impact": "Le 6 schede di Impatto confrontano il portafoglio attuale con il risultato previsto dopo le operazioni simulate.",
      "p3-whatif": "In alto a sinistra, What-If & Kelly simula ordini di acquisto o vendita e calcola la dimensione ottimale Half-Kelly.",
      "p3-tailhedge": "In basso a sinistra, Put OTM & Margine simula coperture con opzioni protettive e monitora i margini Reg-T.",
      "p3-committee": "Nei due pannelli di destra, il Comitato a 3 pilastri controlla i limiti di rischio insieme al Libro di Esecuzione e al Copilota.",
      "p3-walkforward": "E alla base, il grafico Walk-Forward convalida il rendimento In-Sample e Out-of-Sample con l’indice di efficienza WFE."
    }
  },
  "NL": {
    "ui": {
      "walkthrough": "Live visuele walkthrough",
      "clickPlayPause": "Klik om af te spelen of te pauzeren (spatie)",
      "subtitles": "Ondertitels (C)",
      "fullscreen": "Volledig scherm (F)",
      "exitFullscreen": "Volledig scherm afsluiten (F of Esc)",
      "portTabs": [
        "Bouwer",
        "Risico",
        "Simulatie",
        "Copiloot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Talen",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Categorieën",
      "scr-pulse": "02 • 24 uur puls",
      "scr-table": "03 • Tafel",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Warmtekaart",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Technisch",
      "ana-compare": "03 • Vergelijk %",
      "ana-micro": "04 • Micro en stroom",
      "ana-engines": "05 • 3D/2D-motoren",
      "res-hero": "01 • Score en houding",
      "res-rag": "02 • RAG-chat",
      "res-factors": "03 • Factoren",
      "res-pulse24h": "04 • FinBERT-puls",
      "p1-pills": "01 • Samenvatting",
      "p1-table": "02 • Weging",
      "p1-xray": "03 • Röntgenfoto",
      "p1-calendar": "04 • Kalender",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado en VaR",
      "p2-corr": "03 • Correlatie",
      "p2-shock2d": "04 • Schok & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Impact",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Marge",
      "p3-committee": "04 • Comité & Logboek",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Welkom op het Home-scherm: uw afleidingsvrije startpunt waar markten worden gedecodeerd.",
      "home-header": "Als u in de linkerbovenhoek van de Header op het λ-pictogram klikt, keert u altijd rechtstreeks terug naar dit hoofdpodium.",
      "home-markets": "Gecentreerd aan de bovenkant van de Header bevindt zich de Markets, uw werkstation waarmee u alle 213 wereldwijde assets live kunt onderzoeken.",
      "home-portfolio": "Direct ernaast in het gecentreerde menu staat Portfolio, om allocaties op te bouwen, risico's te testen en transacties te simuleren.",
      "home-system": "Linksonder in de Footer opent System de live observatiemonitor voor servers en databases.",
      "home-guide": "Daarnaast opent de Guide deze interactieve stap-voor-stap handleiding wanneer u deze nodig heeft.",
      "home-langs": "In de rechterbenedenhoek opent de taalknop het gecentreerde modale venster om het platform in 56 talen te vertalen.",
      "home-palettes": "En Palette opent de 5 visuele leesthema's terwijl financieel groen en rood strikt intact blijven.",
      "scr-categories": "Filter in de bovenste categorieënbalk op Alle 213 activa, uw Watchlist of 10 gespecialiseerde markten.",
      "scr-pulse": "De 4 Pulse 24h-kaarten tonen het geaggregeerde volume, de gemiddelde RSI, het P-06-regime en de dislocaties van het topvolume.",
      "scr-table": "De interactieve tabel biedt direct zoeken, favorieten en slimme kolommen die zijn afgestemd op elke activaklasse.",
      "scr-orbital": "De Orbital-weergave brengt activa in kaart over drie concentrische ringen op basis van afwijkingen met een live inspectiepaneel aan de zijkant.",
      "scr-heatmap": "De Heatmap rangschikt de top 10 activa in proportionele blokken in 8 tinten groen en rood.",
      "scr-maintools": "En Main Tools begeleidt u in drie stappen naar soevereine curves, 3D-volatiliteit, FX-cross en futures-engines.",
      "ana-hero": "De Header combineert de asset switcher, 9 tijdframes van 1m tot ALL, en de 5 kernindicatoren.",
      "ana-technical": "De technische lens overlapt SMA 20, VWAP en 2σ Bollinger Bands met bevestiging van het onderste volume.",
      "ana-compare": "Met Compare % meet u het netto procentuele voordeel van Alpha Spread vanaf 0% ten opzichte van een compatibele peer of index.",
      "ana-micro": "Micro & Flow detecteert volumepieken via de 20d Z-Score, gespreide liquiditeitsdislocatie en de P-06-afwijkingsscore.",
      "ana-engines": "Het vierde tabblad is een dynamische ad-hoctool die per activaklasse verschilt: omdat NVDA een aandeel is, opent het de 3D Volatility & Options Payoff, terwijl obligaties, valuta en grondstoffen hun eigen gespecialiseerde tools lanceren.",
      "res-hero": "Bovenaan vat Score & Stance het fundamentele oordeel, de gewogen beoordeling en de kopthermometer samen.",
      "res-rag": "In de linkerkolom beantwoordt RAG Document Chat geverifieerde vragen die zijn gebaseerd op officiële SEC 10-K- en 10-Q-documenten.",
      "res-factors": "In de middelste kolom contrasteert de Factors-accordeon de top 5 van bulldrivers met de top 5 van beerrisico's.",
      "res-pulse24h": "Aan de rechterkant scoort de FinBERT Pulse in realtime de belangrijkste krantenkoppen en wordt de 24-uurs sentimentcurve weergegeven.",
      "p1-pills": "De 6 samenvattingskaarten berekenen live CAGR, Sharpe en Sortino, 95% VaR, Max Drawdown, Alpha en diversificatie.",
      "p1-table": "Voeg in de Wegingstabel een van de 213 activa toe, stel exacte procentuele wegingen in of breng de balans opnieuw in naar 100%.",
      "p1-xray": "Rechtsboven controleert het röntgenpaneel met vijf tabbladen ETF-overlapping, blootstelling, Brinson-attributie, cashflow en bewaring.",
      "p1-calendar": "Onder X-Ray toont de Maandkalender de consistentie van de rendementen van januari tot en met december en de YTD-totalen.",
      "p1-backtest": "En aan de onderkant over de volledige breedte vergelijkt de Backtesting uw portfolio met de S&P 500, 60/40, All-Weather en Min-Variance.",
      "p2-markowitz": "In het eerste kwadrant wordt de 2D Markowitz Efficient Frontier weergegeven en wordt uw portefeuille gepositioneerd ten opzichte van de Min-Var en Max-Sharpe.",
      "p2-tornado": "Het kwadrant linksonder test vijf historische crises, een VaR-bijdrage van 95% per asset en een opwaartse/neerwaartse analyse.",
      "p2-corr": "Rechtsboven vergelijkt de 6×6-matrix correlaties onder normale omstandigheden met de besmetting van de crisisstaart.",
      "p2-shock2d": "Rechtsonder kruist Shock & Markov renteverschuivingen met S&P 500-bewegingen en schat het regime-overgangen in.",
      "p2-montecarlo": "En het onderste paneel projecteert 10.000 Monte Carlo-paden over P95, P50 en P05, onderwater Drawdown en rollende Sharpe.",
      "p3-impact": "De 6 Impact-kaarten vergelijken uw huidige portefeuille met de verwachte staat na uw gesimuleerde transacties.",
      "p3-whatif": "Linksboven simuleren What-If & Kelly koop- of verkooptickets en berekenen de optimale Half-Kelly-positiegrootte.",
      "p3-tailhedge": "Linksonder simuleert OTM Put & Margin beschermende optieschilden en bewaakt de Reg-T-onderhoudsmarge.",
      "p3-committee": "In de twee rechterpanels controleert het driepijlercomité de risicovangrails naast het uitvoeringslogboek en de copiloot.",
      "p3-walkforward": "En onderaan valideert het Walk-Forward-diagram de prestaties van de In-Sample en Out-of-Sample met de WFE-index."
    }
  },
  "PL": {
    "ui": {
      "walkthrough": "Wizualny przewodnik na żywo",
      "clickPlayPause": "Kliknij, aby odtworzyć lub wstrzymać (spacja)",
      "subtitles": "Napisy (C)",
      "fullscreen": "Pełny ekran (F)",
      "exitFullscreen": "Wyjdź z pełnego ekranu (F lub Esc)",
      "portTabs": [
        "Budowniczy",
        "Ryzyko",
        "Symulator",
        "Drugi pilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Języki",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategorie",
      "scr-pulse": "02 • Puls 24-godzinny",
      "scr-table": "03 • Stół",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Mapa cieplna",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Techniczne",
      "ana-compare": "03 • Porównaj%",
      "ana-micro": "04 • Mikro i przepływ",
      "ana-engines": "05 • Silniki 3D/2D",
      "res-hero": "01 • Wynik i postawa",
      "res-rag": "02 • Czat RAG",
      "res-factors": "03 • Czynniki",
      "res-pulse24h": "04 • FinBERT Impuls",
      "p1-pills": "01 • Podsumowanie",
      "p1-table": "02 • Ważenie",
      "p1-xray": "03 • Rentgen",
      "p1-calendar": "04 • Kalendarz",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado i VaR",
      "p2-corr": "03 • Korelacja",
      "p2-shock2d": "04 • Szok i Markow",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Wpływ",
      "p3-whatif": "02 • What-If i Kelly",
      "p3-tailhedge": "03 • OTM Put i Margin",
      "p3-committee": "04 • Komitet i dziennik",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Witamy na ekranie Home: pozbawionym rozpraszaczy punkcie wyjścia, w którym dekodowane są rynki.",
      "home-header": "Kliknięcie ikony λ w lewym górnym rogu Header zawsze powoduje powrót do głównego etapu.",
      "home-markets": "Na górze Header znajduje się Markets, stacja robocza do badania na żywo wszystkich 213 globalnych zasobów.",
      "home-portfolio": "Tuż obok, w środkowym menu, znajduje się Portfolio, służący do tworzenia alokacji, przeprowadzania testów warunków skrajnych i symulowania transakcji.",
      "home-system": "W lewym dolnym rogu Footer, System otwiera monitor obserwowalności serwerów i baz danych na żywo.",
      "home-guide": "Oprócz tego Guide otwiera interaktywną instrukcję krok po kroku, kiedy tylko jej potrzebujesz.",
      "home-langs": "W prawym dolnym rogu przycisk języka otwiera wyśrodkowany moduł umożliwiający przetłumaczenie platformy na 56 języków.",
      "home-palettes": "Palette otwiera 5 motywów czytania wizualnego, zachowując jednocześnie nienaruszoną zieleń i czerwień finansową.",
      "scr-categories": "Na górnym pasku kategorii przefiltruj wszystkie 213 zasobów, swój Watchlist lub 10 wyspecjalizowanych rynków.",
      "scr-pulse": "Karty 4 Pulse 24h pokazują zagregowany wolumen, średni RSI, reżim P-06 i przemieszczenia najwyższego wolumenu.",
      "scr-table": "Interaktywna tabela oferuje natychmiastowe wyszukiwanie, ulubione i inteligentne kolumny dostosowane do każdej klasy aktywów.",
      "scr-orbital": "Widok Orbital odwzorowuje zasoby w trzech koncentrycznych pierścieniach poprzez odchylenie za pomocą bocznego panelu inspekcyjnego pod napięciem.",
      "scr-heatmap": "Mapa cieplna porządkuje 10 najważniejszych zasobów w proporcjonalne bloki w 8 odcieniach zieleni i czerwieni.",
      "scr-maintools": "Main Tools poprowadzi Cię w trzech krokach do krzywych suwerennych, zmienności 3D, kursów walutowych i silników futures.",
      "ana-hero": "Header łączy w sobie przełącznik zasobów, 9 ram czasowych od 1 m do ALL i 5 podstawowych wskaźników.",
      "ana-technical": "Soczewka techniczna nakłada się na modele SMA 20, VWAP i paski Bollingera 2σ z potwierdzeniem dolnej głośności.",
      "ana-compare": "Za pomocą opcji Porównaj% zmierz procentową przewagę netto lub Alpha Spread od 0% w porównaniu z kompatybilnym partnerem lub indeksem.",
      "ana-micro": "Micro & Flow wykrywa skoki wolumenu za pomocą 20d Z-Score, dyslokacji płynności spreadu i wyniku anomalii P-06.",
      "ana-engines": "Czwarta zakładka to dynamiczne narzędzie ad hoc, które różni się w zależności od klasy aktywów: ponieważ NVDA jest instrumentem kapitałowym, otwiera 3D zmienność i wypłatę opcji, podczas gdy obligacje, waluty i towary uruchamiają własne, wyspecjalizowane narzędzia.",
      "res-hero": "U góry Wynik i postawa podsumowują podstawowy werdykt, ocenę ważoną i termometr nagłówkowy.",
      "res-rag": "W lewej kolumnie czat z dokumentami RAG odpowiada na zweryfikowane zapytania oparte na oficjalnych zgłoszeniach SEC 10-K i 10-Q.",
      "res-factors": "W środkowej kolumnie akordeon Factors porównuje 5 największych poganiaczy byków z 5 największymi zagrożeniami dla niedźwiedzi.",
      "res-pulse24h": "Po prawej stronie FinBERT Pulse w czasie rzeczywistym trafia na pierwsze strony gazet i wykreśla 24-godzinną krzywą nastrojów.",
      "p1-pills": "6 kart podsumowujących oblicza na żywo CAGR, Sharpe i Sortino, 95% VaR, Max Drawdown, Alpha i dywersyfikację.",
      "p1-table": "W tabeli ważenia dodaj dowolne z 213 zasobów, ustaw dokładne wagi procentowe lub zrównoważ na 100%.",
      "p1-xray": "W prawym górnym rogu panel rentgenowski składający się z 5 zakładek sprawdza nakładanie się funduszy ETF, ekspozycję, przypisanie Brinsona, przepływ środków pieniężnych i depozyt.",
      "p1-calendar": "Poniżej X-Ray kalendarz miesięczny wyświetla spójność zwrotów od stycznia do grudnia oraz sumy od początku roku.",
      "p1-backtest": "A na dole o pełnej szerokości Backtesting porównuje Twoje portfolio z S&P 500, 60/40, All-Weather i Min-Variance.",
      "p2-markowitz": "Pierwsza ćwiartka przedstawia granicę wydajności 2D Markowitz i pozycjonuje Twoje portfolio w porównaniu z Min-Var i Max-Sharpe.",
      "p2-tornado": "Lewy dolny kwadrant testuje 5 kryzysów historycznych, 95% wkładu VaR na aktywa oraz wychwytywanie wzrostów i spadków.",
      "p2-corr": "W prawym górnym rogu matryca 6×6 porównuje korelacje w normalnych warunkach z ogonem zarażenia kryzysem.",
      "p2-shock2d": "W prawym dolnym rogu Shock & Markov krzyżuje zmiany stóp procentowych z ruchami S&P 500 i szacuje zmiany reżimów.",
      "p2-montecarlo": "Dolny panel wyświetla 10 000 ścieżek Monte Carlo w P95, P50 i P05, podwodnym pobieraniu i toczeniu Sharpe.",
      "p3-impact": "6 kart wpływu porównuje Twój aktualny portfel z przewidywanym stanem po symulowanych transakcjach.",
      "p3-whatif": "W lewym górnym rogu What-If i Kelly symulują kupno lub sprzedaż biletów i obliczają optymalną wielkość pozycji Half-Kelly.",
      "p3-tailhedge": "W lewym dolnym rogu OTM Put & Margin symuluje osłony opcji ochronnych i monitoruje margines konserwacji Reg-T.",
      "p3-committee": "W dwóch prawych panelach Komisja składająca się z trzech filarów przeprowadza audyty poręczy zabezpieczających wraz z dziennikiem wykonania i drugim pilotem.",
      "p3-walkforward": "Na dole wykres Walk-Forward potwierdza wydajność In-Sample i Out-of-Sample za pomocą indeksu WFE."
    }
  },
  "SV": {
    "ui": {
      "walkthrough": "Live Visual Walkthrough",
      "clickPlayPause": "Klicka för att spela eller pausa (mellanslag)",
      "subtitles": "Undertexter (C)",
      "fullscreen": "Helskärm (F)",
      "exitFullscreen": "Avsluta helskärm (F eller Esc)",
      "portTabs": [
        "Byggare",
        "Risk",
        "Simulator",
        "Copilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Språk",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategorier",
      "scr-pulse": "02 • 24h puls",
      "scr-table": "03 • Tabell",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Värmekarta",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Tekniska",
      "ana-compare": "03 • Jämför %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D-motorer",
      "res-hero": "01 • Poäng & Ställning",
      "res-rag": "02 • RAG Chatt",
      "res-factors": "03 • Faktorer",
      "res-pulse24h": "04 • FinBERT Puls",
      "p1-pills": "01 • Sammanfattning",
      "p1-table": "02 • Viktning",
      "p1-xray": "03 • Röntgen",
      "p1-calendar": "04 • Kalender",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado och VaR",
      "p2-corr": "03 • Korrelation",
      "p2-shock2d": "04 • Shock & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Inverkan",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Kommitté & Logga",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Välkommen till Home-skärmen: din distraktionsfria utgångspunkt där marknader avkodas.",
      "home-header": "I det övre vänstra hörnet av Header, klickar du på λ-ikonen för dig alltid direkt tillbaka till detta huvudstadium.",
      "home-markets": "Centrerad överst på Header är Markets, din arbetsstation för att undersöka alla 213 globala tillgångar live.",
      "home-portfolio": "Alldeles bredvid i den centrerade menyn finns Portfolio, för att bygga allokeringar, stresstesta risker och simulera affärer.",
      "home-system": "Nere i det nedre vänstra Footer öppnar System live observerbarhetsmonitorn för servrar och databaser.",
      "home-guide": "Bredvid den öppnar Guide denna interaktiva steg-för-steg-manual när du behöver den.",
      "home-langs": "I det nedre högra hörnet öppnar språkknappen den centrerade modalen för att översätta plattformen till 56 språk.",
      "home-palettes": "Och Palette öppnar de 5 visuella lästeman samtidigt som finansiellt grönt och rött är strikt intakt.",
      "scr-categories": "Filtrera över alla 213 tillgångar, din Watchlist eller 10 specialiserade marknader i den översta kategorifältet.",
      "scr-pulse": "De 4 Pulse 24h-korten visar aggregerad volym, genomsnittlig RSI, P-06-regim och toppvolymdislokationer.",
      "scr-table": "Den interaktiva tabellen har omedelbar sökning, favoriter och smarta kolumner som är skräddarsydda för varje tillgångsklass.",
      "scr-orbital": "Orbital-vyn kartlägger tillgångar över tre koncentriska ringar genom avvikelse med en aktiv sidoinspektionspanel.",
      "scr-heatmap": "Värmekartan arrangerar de 10 bästa tillgångarna i proportionella block över 8 nyanser av grönt och rött.",
      "scr-maintools": "Och Main Tools guidar dig i tre steg till suveräna kurvor, 3D-volatilitet, FX-kors och terminsmotorer.",
      "ana-hero": "Header kombinerar tillgångsväxlaren, 9 tidsramar från 1m till ALL, och de 5 kärnindikatorerna.",
      "ana-technical": "Den tekniska linsen täcker SMA 20, VWAP och 2σ Bollinger Bands med bekräftelse på bottenvolymen.",
      "ana-compare": "Med Jämför %, mät nettofördel i procent eller Alpha Spread från 0 % mot en kompatibel kamrat eller index.",
      "ana-micro": "Micro & Flow upptäcker volymtoppar via 20d Z-Score, spridd likviditetsdislokation och P-06 anomalipoäng.",
      "ana-engines": "Den fjärde fliken är ett dynamiskt ad-hoc-verktyg som varierar beroende på tillgångsklass: eftersom NVDA är en aktie öppnar den 3D Volatility & Options Payoff, medan obligationer, FX och råvaror lanserar sina egna specialiserade verktyg.",
      "res-hero": "Överst sammanfattar Score & Stance det grundläggande omdömet, det viktade betyget och rubriktermometern.",
      "res-rag": "I den vänstra kolumnen svarar RAG Document Chat verifierade frågor grundade i officiella SEC 10-K- och 10-Q-anmälningar.",
      "res-factors": "I mittenkolumnen kontrasterar Factors dragspel de 5 bästa tjurförarna mot de 5 bästa björnriskerna.",
      "res-pulse24h": "Till höger får FinBERT Pulse brytande rubriker i realtid och ritar 24-timmars sentimentkurvan.",
      "p1-pills": "De 6 sammanfattningskorten räknar om live CAGR, Sharpe och Sortino, 95 % VaR, Max Drawdown, Alpha och diversifiering.",
      "p1-table": "Lägg till någon av de 213 tillgångarna i viktningstabellen, ställ in exakta procentvikter eller balansera om till 100 %.",
      "p1-xray": "Överst till höger granskar röntgenpanelen med 5 flikar ETF-överlappning, exponering, Brinson-tillskrivning, kassaflöde och förvaring.",
      "p1-calendar": "Under röntgen visar månadskalendern returkonsistens från januari till december och totalsummor för YTD.",
      "p1-backtest": "Och längst ner i full bredd jämför Backtesting din portfölj med S&P 500, 60/40, All-Weather och Min-Variance.",
      "p2-markowitz": "Den första kvadranten plottar 2D Markowitz Efficient Frontier och positionerar din portfölj mot Min-Var och Max-Sharpe.",
      "p2-tornado": "Den nedre vänstra kvadranten testar 5 historiska kriser, 95 % VaR-bidrag per tillgång och upp-/nedåtfångst.",
      "p2-corr": "Överst till höger jämför 6×6-matrisen korrelationer under normala förhållanden med krissvanssmitta.",
      "p2-shock2d": "Nederst till höger korsar Shock & Markov ränteförskjutningar med S&P 500-rörelser och uppskattar regimövergångar.",
      "p2-montecarlo": "Och den nedre panelen projicerar 10 000 Monte Carlo-banor över P95, P50 och P05, undervattensneddragning och rullande Sharpe.",
      "p3-impact": "De 6 effektkorten jämför din nuvarande portfölj med det projicerade tillståndet efter dina simulerade affärer.",
      "p3-whatif": "Överst till vänster simulerar What-If & Kelly köp eller sälj biljetter och beräknar den optimala Half-Kelly-positionsstorleken.",
      "p3-tailhedge": "Nederst till vänster simulerar OTM Put & Margin skyddande alternativskydd och övervakar Reg-T underhållsmarginal.",
      "p3-committee": "I de två högra panelerna granskar kommittén med tre pelare riskräcken vid sidan av Execution Log och Copilot.",
      "p3-walkforward": "Och längst ner, validerar Walk-Forward-diagrammet In-Sample och Out-of-Sample prestanda med WFE index."
    }
  },
  "NO": {
    "ui": {
      "walkthrough": "Live Visual Walkthrough",
      "clickPlayPause": "Klikk for å spille av eller sette på pause (mellomrom)",
      "subtitles": "Undertekster (C)",
      "fullscreen": "Fullskjerm (F)",
      "exitFullscreen": "Avslutt fullskjerm (F eller Esc)",
      "portTabs": [
        "Byggmester",
        "Risiko",
        "Simulator",
        "Copilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Språk",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategorier",
      "scr-pulse": "02 • 24 timers puls",
      "scr-table": "03 • Tabell",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Varmekart",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Teknisk",
      "ana-compare": "03 • Sammenlign %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D-motorer",
      "res-hero": "01 • Score og holdning",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • Faktorer",
      "res-pulse24h": "04 • FinBERT Puls",
      "p1-pills": "01 • Sammendrag",
      "p1-table": "02 • Vekting",
      "p1-xray": "03 • Røntgen",
      "p1-calendar": "04 • Kalender",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado og VaR",
      "p2-corr": "03 • Korrelasjon",
      "p2-shock2d": "04 • Sjokk & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Virkning",
      "p3-whatif": "02 • What-If og Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Komite & Logg",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Velkommen til Home-skjermen: ditt distraksjonsfrie utgangspunkt der markeder blir dekodet.",
      "home-header": "Ved å klikke på λ-ikonet øverst til venstre på Header kommer du alltid rett tilbake til dette hovedstadiet.",
      "home-markets": "Sentrert på toppen av Header er Markets, din arbeidsstasjon for å undersøke alle 213 globale eiendeler live.",
      "home-portfolio": "Rett ved siden av i den sentrerte menyen er Portfolio, for å bygge allokeringer, stressteste risiko og simulere handler.",
      "home-system": "Nede i Footer nederst til venstre åpner System live-observasjonsmonitoren for servere og databaser.",
      "home-guide": "Ved siden av den åpner Guide denne interaktive trinnvise manualen når du trenger den.",
      "home-langs": "Nederst til høyre åpner språkknappen den sentrerte modalen for å oversette plattformen til 56 språk.",
      "home-palettes": "Og Palette åpner de 5 visuelle lesetemaene mens de holder økonomisk grønt og rødt strengt tatt intakt.",
      "scr-categories": "I den øverste kategorilinjen kan du filtrere over alle 213 eiendeler, din Watchlist eller 10 spesialiserte markeder.",
      "scr-pulse": "De 4 Pulse 24-timerskortene viser aggregert volum, gjennomsnittlig RSI, P-06-regime og dislokasjoner av toppvolum.",
      "scr-table": "Den interaktive tabellen har øyeblikkelig søk, favoritter og smarte kolonner skreddersydd for hver aktivaklasse.",
      "scr-orbital": "Orbital-visningen kartlegger eiendeler på tvers av tre konsentriske ringer ved avvik med et live sideinspeksjonspanel.",
      "scr-heatmap": "Heatmap arrangerer de 10 beste ressursene i proporsjonale blokker på tvers av 8 nyanser av grønt og rødt.",
      "scr-maintools": "Og Main Tools guider deg i tre trinn til suverene kurver, 3D-volatilitet, FX-kryss og futures-motorer.",
      "ana-hero": "Header kombinerer aktivabytteren, 9 tidsrammer fra 1m til ALL, og de 5 kjerneindikatorene.",
      "ana-technical": "Den tekniske linsen overlegger SMA 20, VWAP og 2σ Bollinger-bånd med bekreftelse på bunnvolum.",
      "ana-compare": "Med Sammenlign %, mål netto prosentandel fordel eller Alpha Spread fra 0 % mot en kompatibel peer eller indeks.",
      "ana-micro": "Micro & Flow oppdager volumtopper via 20d Z-Score, spredt likviditetsdislokasjon og P-06 anomali-score.",
      "ana-engines": "Den fjerde fanen er et dynamisk ad-hoc-verktøy som varierer etter aktivaklasse: fordi NVDA er en aksje, åpner den 3D Volatility & Options Payoff, mens obligasjoner, valutaer og råvarer lanserer sine egne spesialiserte verktøy.",
      "res-hero": "Øverst oppsummerer Score & Stance den grunnleggende dommen, vektet vurdering og overskriftstermometer.",
      "res-rag": "I venstre kolonne svarer RAG Document Chat verifiserte forespørsler basert på offisielle SEC 10-K og 10-Q innleveringer.",
      "res-factors": "I den midtre kolonnen kontrasterer Factors-trekkspillet de 5 beste okseførerne mot de 5 beste bjørnerisikoene.",
      "res-pulse24h": "Til høyre scorer FinBERT Pulse overskrifter i sanntid og plotter 24-timers sentimentkurven.",
      "p1-pills": "De 6 sammendragskortene beregner live CAGR, Sharpe og Sortino, 95 % VaR, Max Drawdown, Alpha og diversifisering.",
      "p1-table": "I vektingstabellen legger du til noen av de 213 aktivaene, setter nøyaktige prosentvekter eller rebalanserer til 100 %.",
      "p1-xray": "Øverst til høyre reviderer røntgenpanelet med 5 faner ETF-overlapping, eksponering, Brinson-attribusjon, kontantstrøm og varetekt.",
      "p1-calendar": "Under røntgen viser månedskalenderen returkonsistens fra januar til desember og totaler for YTD.",
      "p1-backtest": "Og på bunnen i full bredde sammenligner Backtesting porteføljen din med S&P 500, 60/40, All-Weather og Min-Variance.",
      "p2-markowitz": "Den første kvadranten plotter 2D Markowitz Efficient Frontier og posisjonerer porteføljen din kontra Min-Var og Max-Sharpe.",
      "p2-tornado": "Den nederste venstre kvadranten tester 5 historiske kriser, 95 % VaR-bidrag per eiendel og opp-/ned-fangst.",
      "p2-corr": "Øverst til høyre sammenligner 6×6-matrisen korrelasjoner under normale forhold mot krisesmitte.",
      "p2-shock2d": "Nederst til høyre krysser Shock & Markov renteskift med S&P 500-bevegelser og anslår regimeoverganger.",
      "p2-montecarlo": "Og bunnpanelet projiserer 10 000 Monte Carlo-baner på tvers av P95, P50 og P05, undervannsdrawdown og rullende Sharpe.",
      "p3-impact": "De 6 effektkortene sammenligner din nåværende portefølje med den anslåtte tilstanden etter dine simulerte handler.",
      "p3-whatif": "Øverst til venstre simulerer What-If & Kelly kjøp eller salg av billetter og beregner den optimale Half-Kelly-posisjonsstørrelsen.",
      "p3-tailhedge": "Nederst til venstre simulerer OTM Put & Margin beskyttelsesalternativer og overvåker Reg-T vedlikeholdsmargin.",
      "p3-committee": "I de to høyre panelene reviderer 3-pilarkomiteen risikorekkverk ved siden av utførelsesloggen og copiloten.",
      "p3-walkforward": "Og nederst validerer Walk-Forward-diagrammet In-Sample- og Out-of-Sample-ytelsen med WFE-indeksen."
    }
  },
  "DA": {
    "ui": {
      "walkthrough": "Live visuel gennemgang",
      "clickPlayPause": "Klik for at afspille eller sætte på pause (mellemrum)",
      "subtitles": "Undertekster (C)",
      "fullscreen": "Fuld skærm (F)",
      "exitFullscreen": "Afslut fuldskærm (F eller Esc)",
      "portTabs": [
        "Bygmester",
        "Risiko",
        "Simulator",
        "Copilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Sprog",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategorier",
      "scr-pulse": "02 • 24 timers puls",
      "scr-table": "03 • Bord",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Heatmap",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Teknisk",
      "ana-compare": "03 • Sammenlign %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D motorer",
      "res-hero": "01 • Score og holdning",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • Faktorer",
      "res-pulse24h": "04 • FinBERT Puls",
      "p1-pills": "01 • Resumé",
      "p1-table": "02 • Vægtning",
      "p1-xray": "03 • Røntgen",
      "p1-calendar": "04 • Kalender",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado og VaR",
      "p2-corr": "03 • Korrelation",
      "p2-shock2d": "04 • Shock & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Indvirkning",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Udvalg & Log",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Velkommen til Home-skærmen: dit distraktionsfrie udgangspunkt, hvor markeder bliver afkodet.",
      "home-header": "I øverste venstre hjørne af Header vil et klik på λ-ikonet altid bringe dig tilbage til denne hovedstadie.",
      "home-markets": "Centreret i toppen af ​​Header er Markets, din arbejdsstation til at undersøge alle 213 globale aktiver live.",
      "home-portfolio": "Lige ved siden af ​​i den centrerede menu er Portfolio, til at opbygge allokeringer, stressteste risiko og simulere handler.",
      "home-system": "Nede i Footer nederst til venstre åbner System live-observationsmonitoren for servere og databaser.",
      "home-guide": "Ved siden af ​​den åbner Guide denne interaktive trin-for-trin manual, når du har brug for det.",
      "home-langs": "I nederste højre hjørne åbner sprogknappen den centrerede modal for at oversætte platformen til 56 sprog.",
      "home-palettes": "Og Palette åbner de 5 visuelle læsetemaer, mens de økonomiske grønt og rødt er intakt.",
      "scr-categories": "I den øverste kategorilinje skal du filtrere på tværs af alle 213 aktiver, dine Watchlist eller 10 specialiserede markeder.",
      "scr-pulse": "De 4 Pulse 24-timers kort viser aggregeret volumen, gennemsnitlig RSI, P-06 regime og topvolumen dislokationer.",
      "scr-table": "Den interaktive tabel byder på øjeblikkelig søgning, favoritter og smarte kolonner, der er skræddersyet til hver aktivklasse.",
      "scr-orbital": "Orbital-visningen kortlægger aktiver på tværs af tre koncentriske ringe ved afvigelse med et live-sideinspektionspanel.",
      "scr-heatmap": "Heatmap arrangerer de 10 bedste aktiver i proportionale blokke på tværs af 8 nuancer af grøn og rød.",
      "scr-maintools": "Og Main Tools guider dig i tre trin til suveræne kurver, 3D-volatilitet, FX-kryds og futures-motorer.",
      "ana-hero": "Header kombinerer aktivomskifteren, 9 tidsrammer fra 1 m til ALL og de 5 kerneindikatorer.",
      "ana-technical": "Det tekniske objektiv overlejrer SMA 20, VWAP og 2σ Bollinger-bånd med bekræftelse af bundvolumen.",
      "ana-compare": "Med Sammenlign % kan du måle nettoprocentfordel eller Alpha Spread fra 0 % i forhold til en kompatibel peer eller et kompatibelt indeks.",
      "ana-micro": "Micro & Flow registrerer volumenspidser via 20d Z-Score, spredt likviditetsforskydning og P-06 anomali-score.",
      "ana-engines": "Den fjerde fane er et dynamisk ad-hoc-værktøj, der varierer efter aktivklasse: fordi NVDA er en aktie, åbner den 3D Volatility & Options Payoff, mens obligationer, valuta og råvarer lancerer deres egne specialiserede værktøjer.",
      "res-hero": "Øverst opsummerer Score & Stance den grundlæggende dom, vægtede bedømmelse og overskriftstermometer.",
      "res-rag": "I venstre kolonne besvarer RAG Document Chat bekræftede forespørgsler baseret på officielle SEC 10-K og 10-Q arkiveringer.",
      "res-factors": "I den midterste kolonne kontrasterer Factors-harmonikaen de 5 bedste tyrkørere mod de 5 bedste bjørnerisikoer.",
      "res-pulse24h": "Til højre scorer FinBERT Pulse banebrydende overskrifter i realtid og plotter 24-timers sentimentkurven.",
      "p1-pills": "De 6 oversigtskort genberegner live CAGR, Sharpe og Sortino, 95 % VaR, Max Drawdown, Alpha og diversificering.",
      "p1-table": "I vægtningstabellen skal du tilføje et hvilket som helst af de 213 aktiver, indstille nøjagtige procentvægte eller rebalancere til 100 %.",
      "p1-xray": "Øverst til højre reviderer X-Ray-panelet med 5 faner ETF-overlapning, eksponering, Brinson-tilskrivning, cashflow og depot.",
      "p1-calendar": "Under X-Ray viser månedskalenderen returkonsistens fra januar til december og YTD-totaler.",
      "p1-backtest": "Og i bunden i fuld bredde sammenligner Backtesting din portefølje med S&P 500, 60/40, All-Weather og Min-Variance.",
      "p2-markowitz": "Den første kvadrant plotter 2D Markowitz Efficient Frontier og placerer din portefølje i forhold til Min-Var og Max-Sharpe.",
      "p2-tornado": "Den nederste venstre kvadrant tester 5 historiske kriser, 95 % VaR-bidrag pr; aktiv og op-/nedadgående optagelse.",
      "p2-corr": "Øverst til højre sammenligner 6×6 Matrix korrelationer under normale forhold med krisehalesmitte.",
      "p2-shock2d": "Nederst til højre krydser Shock & Markov renteskift med S&P 500-bevægelser og estimerer regimeovergange.",
      "p2-montecarlo": "Og det nederste panel projicerer 10.000 Monte Carlo-stier på tværs af P95, P50 og P05, undervands Drawdown og rullende Sharpe.",
      "p3-impact": "De 6 effektkort sammenligner din nuværende portefølje med den forventede tilstand efter dine simulerede handler.",
      "p3-whatif": "Øverst til venstre simulerer What-If & Kelly køb eller salg af billetter og beregner den optimale Half-Kelly-positionsstørrelse.",
      "p3-tailhedge": "Nederst til venstre simulerer OTM Put & Margin beskyttelsesskærme og overvåger Reg-T vedligeholdelsesmargin.",
      "p3-committee": "I de to højre paneler reviderer komiteen med 3 søjler risikoværn ved siden af ​​udførelsesloggen og Copiloten.",
      "p3-walkforward": "Og i bunden validerer Walk-Forward-diagrammet In-Sample og Out-of-Sample ydeevne med WFE-indekset."
    }
  },
  "FI": {
    "ui": {
      "walkthrough": "Live Visual Walkthrough",
      "clickPlayPause": "Napsauta toistaaksesi tai keskeyttääksesi (välilyönti)",
      "subtitles": "Tekstitykset (C)",
      "fullscreen": "Koko näyttö (F)",
      "exitFullscreen": "Poistu koko näytöstä (F tai Esc)",
      "portTabs": [
        "Rakentaja",
        "Riski",
        "Simulaattori",
        "Ohjaaja"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Kielet",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Luokat",
      "scr-pulse": "02 • 24h pulssi",
      "scr-table": "03 • Taulukko",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Lämpökartta",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Tekninen",
      "ana-compare": "03 • Vertaa %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D moottorit",
      "res-hero": "01 • Pisteet & asenne",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • tekijät",
      "res-pulse24h": "04 • FinBERT pulssi",
      "p1-pills": "01 • Yhteenveto",
      "p1-table": "02 • Painotus",
      "p1-xray": "03 • Röntgen",
      "p1-calendar": "04 • Kalenteri",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado ja VaR",
      "p2-corr": "03 • Korrelaatio",
      "p2-shock2d": "04 • Shokki & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Vaikutus",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Komitea ja loki",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Tervetuloa Home-näyttöön: häiriötön aloituspiste, jossa markkinat puretaan.",
      "home-header": "Header:n vasemmassa yläkulmassa λ-kuvakkeen napsauttaminen tuo sinut aina takaisin tähän päävaiheeseen.",
      "home-markets": "Header:n yläosassa on Markets, työasemasi, jossa voit tutkia kaikkia 213 maailmanlaajuista omaisuutta livenä.",
      "home-portfolio": "Aivan sen vieressä keskitetyssä valikossa on Portfolio, jolla voit rakentaa allokaatioita, stressitestaa riskiä ja simuloida kauppoja.",
      "home-system": "Vasemmassa alakulmassa oleva Footer System avaa palvelimien ja tietokantojen suoran havainnointimonitorin.",
      "home-guide": "Sen vieressä Guide avaa tämän interaktiivisen vaiheittaisen oppaan aina, kun sitä tarvitset.",
      "home-langs": "Oikeassa alakulmassa oleva kielipainike avaa keskitetyn modaalin kääntämään alustan 56 kielelle.",
      "home-palettes": "Ja Palette avaa 5 visuaalista lukuteemaa pitäen taloudellisen vihreän ja punaisen ennallaan.",
      "scr-categories": "Suodata yläreunan Luokat-palkissa Kaikki 213 omaisuutta, Watchlist tai 10 erikoistunutta markkinaa.",
      "scr-pulse": "4 Pulse 24h -kortit näyttävät aggregoidun äänenvoimakkuuden, keskimääräisen RSI:n, P-06-järjestelmän ja suurimman äänenvoimakkuuden poikkeaman.",
      "scr-table": "Interaktiivinen taulukko sisältää välittömän haun, suosikit ja älykkäät sarakkeet, jotka on räätälöity kullekin omaisuusluokalle.",
      "scr-orbital": "Orbital-näkymä kartoittaa omaisuuden kolmeen samankeskiseen renkaaseen poikkeamalla elävän puolen tarkastuspaneelin avulla.",
      "scr-heatmap": "Heatmap järjestää 10 parasta resurssia suhteellisiin lohkoihin 8 vihreän ja punaisen sävyssä.",
      "scr-maintools": "Ja Main Tools opastaa sinut kolmessa vaiheessa suvereeneihin käyriin, 3D-volatiliteettiin, FX crossiin ja futuurimoottoreihin.",
      "ana-hero": "Header yhdistää omaisuuden vaihtajan, 9 aikaväliä 1 metristä KAIKKIIN ja 5 ydinosoitinta.",
      "ana-technical": "Tekniset linssit peittävät SMA 20-, VWAP- ja 2σ Bollinger Bands -nauhat pohjaäänenvoimakkuuden vahvistuksella.",
      "ana-compare": "Vertaile %:lla voit mitata nettoprosenttiedun tai Alpha Spread:n 0 %:sta yhteensopivaan vertaiseen tai indeksiin verrattuna.",
      "ana-micro": "Micro & Flow havaitsee volyymipiikit 20d Z-pisteen, likviditeetin hajoamisen ja P-06-poikkeamapisteen avulla.",
      "ana-engines": "Neljäs välilehti on dynaaminen ad-hoc-työkalu, joka vaihtelee omaisuusluokittain: koska NVDA on osake, se avaa 3D-volatiliteetti- ja optiomaksun, kun taas joukkovelkakirjat, valuuttakurssit ja hyödykkeet tuovat markkinoille omat erikoistyökalunsa.",
      "res-hero": "Yläosassa Score & Stance tiivistää perustavanlaatuisen tuomion, painotetun arvion ja otsikon lämpömittarin.",
      "res-rag": "Vasemmassa sarakkeessa RAG Document Chat vastaa vahvistettuihin kyselyihin, jotka perustuvat virallisiin SEC 10-K- ja 10-Q-tiedostoihin.",
      "res-factors": "Keskisarakkeessa Factors-haitari asettaa vastakkain viiden parhaan häränkuljettajan ja 5 parhaan karhuriskin kanssa.",
      "res-pulse24h": "Oikealla oleva FinBERT Pulse saa reaaliajassa osuvia otsikoita ja piirtää 24 tunnin tunnekäyrän.",
      "p1-pills": "Kuusi yhteenvetokorttia laskee uudelleen live-CAGR, Sharpe ja Sortino, 95 % VaR, Max Drawdown, alfan ja monipuolistamisen.",
      "p1-table": "Lisää painotustaulukkoon mikä tahansa 213 omaisuudesta, aseta tarkat prosenttipainot tai tasapainota 100 %.",
      "p1-xray": "Oikeassa yläkulmassa 5 välilehden röntgenpaneeli tarkastaa ETF:n päällekkäisyyden, altistumisen, Brinsonin ansioksi lukemisen, kassavirran ja säilytyksen.",
      "p1-calendar": "Röntgen alla Kuukausikalenteri näyttää tammi-joulukuun tuottoyhteensopivuuden ja vuoden kokonaissummat.",
      "p1-backtest": "Ja täysleveänä alareunassa Backtesting vertaa portfoliotasi S&P 500-, 60/40-, All-Weather- ja Min-Variance-malleihin.",
      "p2-markowitz": "Ensimmäinen kvadrantti piirtää 2D Markowitz Efficient Frontierin ja asettaa portfoliosi Min-Var:ään ja Max-Sharpe:ään verrattuna.",
      "p2-tornado": "Vasemman alareunan neljännes testaa viittä historiallista kriisiä, omaisuuskohtaista 95 %:n VaR-osuutta ja ylös-/alaspäin kaappausta.",
      "p2-corr": "Yläoikealla 6 × 6 Matrix vertaa korrelaatioita normaaleissa olosuhteissa kriisin hännän tartuntaan.",
      "p2-shock2d": "Alhaalla oikealla, Shock & Markov risteää korkomuutoksia S&P 500-liikkeillä ja arvioi järjestelmän muutoksia.",
      "p2-montecarlo": "Ja alapaneeli heijastaa 10 000 Monte Carlo-polkua P95:n, P50:n ja P05:n, vedenalaisen vedon ja rullaavan Sharpe:n välillä.",
      "p3-impact": "6 Impact-korttia vertaavat nykyistä salkkuasi ennustettuun tilaan simuloitujen kauppojen jälkeen.",
      "p3-whatif": "Ylhäällä vasemmalla oleva What-If & Kelly simuloi lippujen ostamista tai myymistä ja laskee optimaalisen Half-Kelly-paikan koon.",
      "p3-tailhedge": "Vasemmalla alhaalla OTM Put & Margin simuloi suojaavia lisävarustesuojuksia ja valvoo Reg-T:n huoltomarginaalia.",
      "p3-committee": "Kahdessa oikeanpuoleisessa paneelissa 3-pilarin komitea tarkastaa riskisuojakaiteet Execution Login ja Copilotin rinnalla.",
      "p3-walkforward": "Ja alareunassa oleva Walk-Forward-kaavio vahvistaa In-Sample- ja Out-of-Sample-suorituskyvyn WFE-indeksillä."
    }
  },
  "IS": {
    "ui": {
      "walkthrough": "Live Visual Walkthrough",
      "clickPlayPause": "Smelltu til að spila eða gera hlé (rými)",
      "subtitles": "Textar (C)",
      "fullscreen": "Fullskjár (F)",
      "exitFullscreen": "Hætta á öllum skjánum (F eða Esc)",
      "portTabs": [
        "Byggingaraðili",
        "Áhætta",
        "Hermir",
        "Stýrimaður"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Tungumál",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Flokkar",
      "scr-pulse": "02 • 24 klst púls",
      "scr-table": "03 • Tafla",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Hitakort",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Tæknilegt",
      "ana-compare": "03 • Bera saman %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D vélar",
      "res-hero": "01 • Skor og afstaða",
      "res-rag": "02 • RAG Spjall",
      "res-factors": "03 • Þættir",
      "res-pulse24h": "04 • FinBERT púls",
      "p1-pills": "01 • Samantekt",
      "p1-table": "02 • Væging",
      "p1-xray": "03 • Röntgengeisli",
      "p1-calendar": "04 • Dagatal",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Fylgni",
      "p2-shock2d": "04 • Shock & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Áhrif",
      "p3-whatif": "02 • What-If og Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Nefnd & Dagskrá",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Velkomin á Home skjáinn: truflunarlaus upphafsstaðurinn þinn þar sem markaðir verða afkóðaðir.",
      "home-header": "Efst í vinstra horninu á Header, með því að smella á λ táknið færirðu þig alltaf aftur á þetta aðalstig.",
      "home-markets": "Miðja efst á Header er Markets, vinnustöðin þín til að rannsaka allar 213 alþjóðlegar eignir í beinni.",
      "home-portfolio": "Rétt við hliðina á honum í miðju valmyndinni er Portfolio, til að byggja upp úthlutun, álagsprófa áhættu og líkja eftir viðskiptum.",
      "home-system": "Neðst í Footer neðst til vinstri opnar System lifandi eftirlitsskjáinn fyrir netþjóna og gagnagrunna.",
      "home-guide": "Við hliðina á henni opnar Guide þessa gagnvirku skref-fyrir-skref handbók hvenær sem þú þarft á henni að halda.",
      "home-langs": "Neðst í hægra horninu opnar tungumálahnappurinn miðlæga aðferðina til að þýða pallinn á 56 tungumál.",
      "home-palettes": "Og Palette opnar 5 sjónræna lestrarþemu en heldur fjárhagslegum grænum og rauðum nákvæmlega óskertum.",
      "scr-categories": "Í efstu flokkastikunni skaltu sía yfir allar 213 eignirnar, Watchlist þína eða 10 sérhæfða markaði.",
      "scr-pulse": "4 Pulse 24h kortin sýna uppsafnað rúmmál, meðaltal RSI, P-06 stjórnkerfi og hæsta hljóðstyrk.",
      "scr-table": "Gagnvirka taflan býður upp á skyndileit, eftirlæti og snjalla dálka sem eru sérsniðnir að hverjum eignaflokki.",
      "scr-orbital": "Orbital útsýnið kortleggur eignir yfir þrjá sammiðja hringi með fráviki með lifandi hliðarskoðunarborði.",
      "scr-heatmap": "Hitakortið raðar efstu 10 eignunum í hlutfallslega kubba í 8 tónum af grænu og rauðu.",
      "scr-maintools": "Og Main Tools leiðir þig í þremur skrefum að fullveldisferlum, þrívíddarsveiflu, FX krossi og framtíðarvélum.",
      "ana-hero": "Header sameinar eignaskiptana, 9 tímaramma frá 1m til ALL, og 5 kjarnavísana.",
      "ana-technical": "Tæknilinsan leggst yfir SMA 20, VWAP og 2σ Bollinger bönd með staðfestingu á botni hljóðstyrks.",
      "ana-compare": "Með Bera saman % skaltu mæla nettóhlutfallsforskot eða Alpha Spread frá 0% á móti samhæfum jafningja eða vísitölu.",
      "ana-micro": "Micro & Flow skynjar rúmmálsauka með 20d Z-Score, dreift lausafjárstöðu og P-06 fráviksskor.",
      "ana-engines": "Fjórði flipinn er kraftmikið sértækt tól sem er mismunandi eftir eignaflokkum: vegna þess að NVDA er hlutabréf opnar það 3D flökt og valmöguleika útborgun, á meðan skuldabréf, gjaldeyrir og hrávörur hefja sín eigin sérhæfðu verkfæri.",
      "res-hero": "Efst tekur Score & Stance saman grundvallardóminn, vegið einkunn og fyrirsagnarhitamæli.",
      "res-rag": "Í vinstri dálknum svarar RAG Document Chat staðfestum fyrirspurnum byggðar á opinberum SEC 10-K og 10-Q skráningum.",
      "res-factors": "Í miðju dálkinum, Factors harmonikkan andstæða 5 efstu naut ökumenn á móti efstu 5 björn áhættu.",
      "res-pulse24h": "Hægra megin, FinBERT Pulse skorar fyrirsagnir í rauntíma og teiknar upp 24 klst tilfinningaferilinn.",
      "p1-pills": "Samantektarspjöldin 6 endurreikna lifandi CAGR, Sharpe og Sortino, 95% VaR, Max Drawdown, Alpha og fjölbreytni.",
      "p1-table": "Í vogunartöflunni skaltu bæta við einhverju af 213 eignunum, stilla nákvæmar prósentuvogir eða endurjafna í 100%.",
      "p1-xray": "Efst til hægri, 5-flipa X-Ray panel endurskoðun ETF skarast, áhættuskuldbinding, Brinson eignarhluti, sjóðstreymi og vörslu.",
      "p1-calendar": "Fyrir neðan röntgenmynd sýnir mánaðardagatalið samkvæmni janúar til desember og heildartölur á árinu.",
      "p1-backtest": "Og í botninum á fullri breidd, ber Backtesting eignasafnið þitt saman við S&P 500, 60/40, All-Weather og Min-Variance.",
      "p2-markowitz": "Fyrsti fjórðungurinn sýnir 2D Markowitz Efficient Frontier og staðsetur eignasafnið þitt á móti Min-Var og Max-Sharpe.",
      "p2-tornado": "Fjórðungurinn neðst til vinstri prófar 5 sögulegar kreppur, 95% VaR framlag á hverja eign og upptöku/niðurhlið.",
      "p2-corr": "Efst til hægri ber 6×6 fylkið saman fylgni við venjulegar aðstæður og smit hala.",
      "p2-shock2d": "Neðst til hægri fer Shock & Markov yfir vaxtabreytingar með S&P 500 hreyfingum og áætlar stjórnarskipti.",
      "p2-montecarlo": "Og neðsta spjaldið varpar 10.000 Monte Carlo slóðum yfir P95, P50 og P05, neðansjávar Drawdown og rúllandi Sharpe.",
      "p3-impact": "Áhrifaspjöldin 6 bera saman núverandi eignasafn þitt við áætlað ástand eftir hermdar viðskipti þín.",
      "p3-whatif": "Efst til vinstri, What-If & Kelly líkja eftir kaupa eða selja miða og reikna út bestu Half-Kelly stöðustærð.",
      "p3-tailhedge": "Neðst til vinstri, OTM Put & Margin líkir eftir hlífðarvalkostum og fylgist með Reg-T viðhaldsframlegð.",
      "p3-committee": "Í tveimur hægri spjöldum úttektar 3-stoða nefndin áhættuvarnarhandriði við hlið framkvæmdadagbókar og aðstoðarflugmanns.",
      "p3-walkforward": "Og neðst, Walk-Forward grafið staðfestir árangur In-Sample og Out-of-Sample með WFE vísitölunni."
    }
  },
  "CS": {
    "ui": {
      "walkthrough": "Živý vizuální návod",
      "clickPlayPause": "Kliknutím spustíte přehrávání nebo pozastavení (mezera)",
      "subtitles": "Titulky (C)",
      "fullscreen": "Celá obrazovka (F)",
      "exitFullscreen": "Ukončit celou obrazovku (F nebo Esc)",
      "portTabs": [
        "Stavitel",
        "Riziko",
        "Simulátor",
        "druhý pilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Jazyky",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategorie",
      "scr-pulse": "02 • 24h puls",
      "scr-table": "03 • Tabulka",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Teplotní mapa",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Technický",
      "ana-compare": "03 • Porovnat %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D motory",
      "res-hero": "01 • Skóre a postoj",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • Faktory",
      "res-pulse24h": "04 • FinBERT Pulzní",
      "p1-pills": "01 • Shrnutí",
      "p1-table": "02 • Vážení",
      "p1-xray": "03 • X-ray",
      "p1-calendar": "04 • Kalendář",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornádo a VaR",
      "p2-corr": "03 • Korelace",
      "p2-shock2d": "04 • Shock & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Dopad",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Výbor a deník",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Vítejte na obrazovce Home: výchozí bod bez rozptylování, kde se dekódují trhy.",
      "home-header": "Kliknutím na ikonu λ v levém horním rohu Header se vždy vrátíte zpět na tuto hlavní scénu.",
      "home-markets": "V horní části Header je umístěna Markets, vaše pracovní stanice pro přímý průzkum všech 213 globálních aktiv.",
      "home-portfolio": "Hned vedle ve středové nabídce je Portfolio pro vytváření alokací, zátěžové testování rizik a simulaci obchodů.",
      "home-system": "System vlevo dole v Footer otevírá živý monitor pozorovatelnosti pro servery a databáze.",
      "home-guide": "Vedle toho Guide otevře tuto interaktivní příručku krok za krokem, kdykoli ji budete potřebovat.",
      "home-langs": "Tlačítko jazyka v pravém dolním rohu otevře vycentrovaný modal pro překlad platformy do 56 jazyků.",
      "home-palettes": "A Palette otevírá 5 vizuálních témat čtení, přičemž finanční zelenou a červenou zachovává přísně nedotčené.",
      "scr-categories": "V horní liště kategorií filtrujte přes Všech 213 aktiv, svůj Watchlist nebo 10 specializovaných trhů.",
      "scr-pulse": "Karty 4 Pulse 24h ukazují agregovaný objem, průměrný RSI, režim P-06 a dislokace nejvyššího objemu.",
      "scr-table": "Interaktivní tabulka obsahuje okamžité vyhledávání, oblíbené položky a chytré sloupce přizpůsobené každé třídě aktiv.",
      "scr-orbital": "Pohled Orbital mapuje aktiva přes tři soustředné prstence podle odchylky s aktivním bočním kontrolním panelem.",
      "scr-heatmap": "Teplotní mapa uspořádá 10 nejlepších aktiv do proporcionálních bloků v 8 odstínech zelené a červené.",
      "scr-maintools": "A Main Tools vás ve třech krocích provede k suverénním křivkám, 3D volatilitě, FX cross a futures motorům.",
      "ana-hero": "Header kombinuje přepínač aktiv, 9 časových rámců od 1 m do ALL a 5 základních indikátorů.",
      "ana-technical": "Technická čočka překrývá SMA 20, VWAP a 2σ Bollinger Band s potvrzením spodní hlasitosti.",
      "ana-compare": "Pomocí funkce Porovnat % změřte čistou procentuální výhodu nebo Alpha Spread od 0 % oproti kompatibilnímu kolegovi nebo indexu.",
      "ana-micro": "Micro & Flow detekuje objemové špičky prostřednictvím 20d Z-score, dislokace likvidity spreadu a skóre anomálie P-06.",
      "ana-engines": "Čtvrtá karta je dynamický ad-hoc nástroj, který se liší podle třídy aktiv: protože NVDA je akcie, otevírá 3D volatilitu a výplatu opcí, zatímco dluhopisy, FX a komodity spouštějí své vlastní specializované nástroje.",
      "res-hero": "Nahoře Score & Stance shrnuje základní verdikt, vážené hodnocení a titulkový teploměr.",
      "res-rag": "V levém sloupci RAG Document Chat odpovídá na ověřené dotazy založené na oficiálních podáních SEC 10-K a 10-Q.",
      "res-factors": "Ve středním sloupci akordeon Factors kontrastuje 5 nejlepších řidičů býků a 5 nejlepších medvědích rizik.",
      "res-pulse24h": "Vpravo FinBERT Pulse zaznamenává v reálném čase titulky a vykresluje 24hodinovou křivku sentimentu.",
      "p1-pills": "6 souhrnných karet přepočítává živé CAGR, Sharpe a Sortino, 95 % VaR, Max Drawdown, Alpha a diverzifikaci.",
      "p1-table": "V tabulce vážení přidejte libovolné z 213 aktiv, nastavte přesné procentuální váhy nebo vyrovnejte na 100 %.",
      "p1-xray": "Vpravo nahoře panel rentgenového záření s 5 kartami kontroluje překrytí ETF, expozici, Brinsonovu atribuci, peněžní tok a úschovu.",
      "p1-calendar": "Pod rentgenem zobrazuje měsíční kalendář konzistenci návratnosti od ledna do prosince a součty od začátku roku.",
      "p1-backtest": "A dole po celé šířce Backtesting porovnává vaše portfolio s S&P 500, 60/40, All-Weather a Min-Variance.",
      "p2-markowitz": "První kvadrant zobrazuje 2D Markowitz Efficient Frontier a umístí vaše portfolio oproti Min-Var a Max-Sharpe.",
      "p2-tornado": "Levý dolní kvadrant testuje 5 historických krizí, 95% příspěvek VaR na aktiva a zachycení Upside/Downside.",
      "p2-corr": "Vpravo nahoře Matrix 6×6 porovnává korelace za normálních podmínek s krizovou ocasní nákazou.",
      "p2-shock2d": "Vpravo dole Shock & Markov kříží posuny úrokových sazeb s pohyby S&P 500 a odhaduje přechody režimů.",
      "p2-montecarlo": "A spodní panel promítá 10 000 cest Monte Carlo přes P95, P50 a P05, podvodní stahování a rolování Sharpe.",
      "p3-impact": "6 Impact karet porovnává vaše aktuální portfolio s projektovaným stavem po vašich simulovaných obchodech.",
      "p3-whatif": "Vlevo nahoře, What-If & Kelly simuluje nákup nebo prodej vstupenek a vypočítává optimální velikost pozice Half-Kelly.",
      "p3-tailhedge": "Vlevo dole, OTM Put & Margin simuluje ochranné opční štíty a monitoruje rezervu údržby Reg-T.",
      "p3-committee": "Ve dvou pravých panelech 3pilířový výbor prověřuje zábradlí rizika spolu s protokolem provádění a druhým pilotem.",
      "p3-walkforward": "A ve spodní části graf Walk-Forward ověřuje výkon In-Sample a Out-of-Sample pomocí indexu WFE."
    }
  },
  "SK": {
    "ui": {
      "walkthrough": "Živý vizuálny návod",
      "clickPlayPause": "Kliknutím spustíte prehrávanie alebo pozastavenie (medzerník)",
      "subtitles": "Titulky (C)",
      "fullscreen": "Celá obrazovka (F)",
      "exitFullscreen": "Ukončiť celú obrazovku (F alebo Esc)",
      "portTabs": [
        "Staviteľ",
        "Riziko",
        "Simulátor",
        "Druhý pilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Jazyky",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • kategórie",
      "scr-pulse": "02 • 24h pulz",
      "scr-table": "03 • Tabuľka",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • teplotná mapa",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Technická",
      "ana-compare": "03 • Porovnať %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D motory",
      "res-hero": "01 • Skóre a postoj",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • Faktory",
      "res-pulse24h": "04 • FinBERT Pulz",
      "p1-pills": "01 • Zhrnutie",
      "p1-table": "02 • Váženie",
      "p1-xray": "03 • X-ray",
      "p1-calendar": "04 • Kalendár",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornádo a VaR",
      "p2-corr": "03 • Korelácia",
      "p2-shock2d": "04 • Shock & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Vplyv",
      "p3-whatif": "02 • What-If a Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Výbor a denník",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Vitajte na obrazovke Home: váš východiskový bod bez rozptyľovania, kde sa dekódujú trhy.",
      "home-header": "Kliknutím na ikonu λ v ľavom hornom rohu Header sa vždy vrátite späť na túto hlavnú scénu.",
      "home-markets": "V strede hornej časti Header je Markets, vaša pracovná stanica na skúmanie všetkých 213 globálnych aktív naživo.",
      "home-portfolio": "Hneď vedľa v centrovanej ponuke je Portfolio na vytváranie alokácií, stresové testovanie rizika a simuláciu obchodov.",
      "home-system": "Dole v Footer vľavo dole otvára System živý monitor pozorovateľnosti pre servery a databázy.",
      "home-guide": "Okrem toho Guide otvorí túto interaktívnu príručku krok za krokom, kedykoľvek ju budete potrebovať.",
      "home-langs": "Tlačidlo jazyka v pravom dolnom rohu otvára vycentrovaný modál na preklad platformy do 56 jazykov.",
      "home-palettes": "A Palette otvára 5 vizuálnych tém čítania, pričom zachováva finančnú zelenú a červenú striktne nedotknutú.",
      "scr-categories": "V hornom paneli Kategórie môžete filtrovať cez Všetkých 213 aktív, Watchlist alebo 10 špecializovaných trhov.",
      "scr-pulse": "Karty 4 Pulse 24h zobrazujú agregovaný objem, priemerný RSI, režim P-06 a dislokácie najvyššieho objemu.",
      "scr-table": "Interaktívna tabuľka obsahuje okamžité vyhľadávanie, obľúbené položky a inteligentné stĺpce prispôsobené každej triede aktív.",
      "scr-orbital": "Pohľad Orbital mapuje aktíva cez tri sústredné krúžky podľa odchýlky so živým bočným kontrolným panelom.",
      "scr-heatmap": "Tepelná mapa usporiada 10 najlepších aktív do proporcionálnych blokov v 8 odtieňoch zelenej a červenej.",
      "scr-maintools": "A Main Tools vás v troch krokoch prevedie k suverénnym krivkám, 3D volatilite, FX cross a futures motorom.",
      "ana-hero": "Header kombinuje prepínač aktív, 9 časových rámcov od 1 m po VŠETKY a 5 základných indikátorov.",
      "ana-technical": "Technická šošovka prekrýva SMA 20, VWAP a 2σ Bollinger Band s potvrdením spodnej hlasitosti.",
      "ana-compare": "Pomocou funkcie Porovnať % zmerajte čistú percentuálnu výhodu alebo Alpha Spread od 0 % oproti kompatibilnému obdobnému produktu alebo indexu.",
      "ana-micro": "Micro & Flow zisťuje objemové špičky prostredníctvom 20d Z-score, dislokácie likvidity spreadu a skóre anomálií P-06.",
      "ana-engines": "Štvrtá karta je dynamický ad-hoc nástroj, ktorý sa líši podľa triedy aktív: keďže NVDA je akciová akcia, otvára 3D volatilitu a výplatu opcií, zatiaľ čo dlhopisy, devízy a komodity spúšťajú svoje vlastné špecializované nástroje.",
      "res-hero": "V hornej časti Score & Stance sumarizuje základný verdikt, vážené hodnotenie a titulkový teplomer.",
      "res-rag": "V ľavom stĺpci RAG Document Chat odpovedá na overené otázky založené na oficiálnych podaniach SEC 10-K a 10-Q.",
      "res-factors": "V stredovom stĺpci akordeón Factors kontrastuje 5 najlepších býčích vodičov s 5 najlepšími medveďmi.",
      "res-pulse24h": "Vpravo, FinBERT Pulse zaznamenáva prelomové titulky v reálnom čase a zobrazuje 24-hodinovú krivku sentimentu.",
      "p1-pills": "6 súhrnných kariet prepočítava živé CAGR, Sharpe a Sortino, 95 % VaR, Max Drawdown, Alpha a diverzifikáciu.",
      "p1-table": "V tabuľke váženia pridajte ľubovoľné z 213 aktív, nastavte presné percentuálne váhy alebo vyrovnajte na 100 %.",
      "p1-xray": "Vpravo hore 5-kartový röntgenový panel audituje prekrytie ETF, expozíciu, Brinsonovu atribúciu, peňažný tok a úschovu.",
      "p1-calendar": "Pod röntgenom zobrazuje mesačný kalendár konzistenciu návratnosti od januára do decembra a súčty YTD.",
      "p1-backtest": "A v spodnej časti plnej šírky Backtesting porovnáva vaše portfólio s modelmi S&P 500, 60/40, All-Weather a Min-Variance.",
      "p2-markowitz": "Prvý kvadrant zobrazuje 2D efektívnu hranicu Markowitz a umiestňuje vaše portfólio oproti Min-Var a Max-Sharpe.",
      "p2-tornado": "Ľavý dolný kvadrant testuje 5 historických kríz, 95 % príspevok VaR na aktívum a zachytávanie smerom hore/dole.",
      "p2-corr": "Vpravo hore matica 6×6 porovnáva korelácie za normálnych podmienok s krízovou nákazou chvosta.",
      "p2-shock2d": "Vpravo dole, Shock & Markov kríži posuny úrokových sadzieb s pohybmi S&P 500 a odhaduje prechody režimov.",
      "p2-montecarlo": "A spodný panel premieta 10 000 dráh Monte Carlo cez P95, P50 a P05, podvodný ťah a rolovanie Sharpe.",
      "p3-impact": "6 kariet Impact porovnáva vaše súčasné portfólio s predpokladaným stavom po vašich simulovaných obchodoch.",
      "p3-whatif": "Vľavo hore, What-If & Kelly simuluje nákup alebo predaj lístkov a vypočíta optimálnu veľkosť pozície Half-Kelly.",
      "p3-tailhedge": "Vľavo dole, OTM Put & Margin simuluje ochranné voliteľné štíty a monitoruje rezervu údržby Reg-T.",
      "p3-committee": "Na dvoch pravých paneloch 3-pilierový výbor kontroluje ochranné zábradlia spolu so záznamom vykonávania a druhým pilotom.",
      "p3-walkforward": "A v spodnej časti graf Walk-Forward potvrdzuje výkonnosť In-Sample a Out-of-Sample pomocou indexu WFE."
    }
  },
  "HU": {
    "ui": {
      "walkthrough": "Élő vizuális végigjátszás",
      "clickPlayPause": "Kattintson a lejátszáshoz vagy szüneteltetéshez (szóköz)",
      "subtitles": "Feliratok (C)",
      "fullscreen": "Teljes képernyő (F)",
      "exitFullscreen": "Kilépés a teljes képernyőről (F vagy Esc)",
      "portTabs": [
        "Építő",
        "Kockázat",
        "Szimulátor",
        "Másodpilóta"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Nyelvek",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategóriák",
      "scr-pulse": "02 • 24 órás pulzus",
      "scr-table": "03 • táblázat",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Hőtérkép",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Műszaki",
      "ana-compare": "03 • Összehasonlítás %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D motorok",
      "res-hero": "01 • Pontszám és álláspont",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • Tényezők",
      "res-pulse24h": "04 • FinBERT impulzus",
      "p1-pills": "01 • Összegzés",
      "p1-table": "02 • Súlyszámítás",
      "p1-xray": "03 • Röntgen",
      "p1-calendar": "04 • Naptár",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado és VaR",
      "p2-corr": "03 • Összefüggés",
      "p2-shock2d": "04 • Sokk és Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Hatás",
      "p3-whatif": "02 • What-If és Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Bizottság és napló",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Üdvözöljük a Home képernyőn: a figyelemeltereléstől mentes kiindulópont, ahol a piacok dekódolásra kerülnek.",
      "home-header": "A Header bal felső sarkában a λ ikonra kattintva mindig visszatérhet ehhez a fő színpadhoz.",
      "home-markets": "A Header tetején helyezkedik el a Markets, az Ön munkaállomása, amellyel élőben kutathatja mind a 213 globális eszközt.",
      "home-portfolio": "Közvetlenül mellette a középső menüben található a Portfolio, amely allokációkat, stressz-teszt kockázatot és kereskedéseket szimulál.",
      "home-system": "A bal alsó Footer ablakban a System megnyitja a szerverek és adatbázisok élő megfigyelhetőségét.",
      "home-guide": "Mellette a Guide megnyitja ezt az interaktív, lépésenkénti kézikönyvet, amikor csak szüksége van rá.",
      "home-langs": "A jobb alsó sarokban található nyelv gomb megnyitja a középen elhelyezett modált, és a platformot 56 nyelvre fordítja le.",
      "home-palettes": "A Palette pedig megnyitja az 5 vizuális olvasási témát, miközben szigorúan érintetlenül tartja a pénzügyi zöldet és a pirosat.",
      "scr-categories": "A felső Kategóriák sávon szűrhet az Összes 213 eszköz, a Watchlist vagy 10 speciális piac között.",
      "scr-pulse": "A 4 Pulse 24h kártyák összesített hangerőt, átlagos RSI-t, P-06 üzemmódot és felső hangerő-elmozdulásokat mutatnak.",
      "scr-table": "Az interaktív Table azonnali keresést, kedvenceket és intelligens oszlopokat tartalmaz az egyes eszközosztályokhoz szabva.",
      "scr-orbital": "A Orbital nézet az élő oldalsó ellenőrző panellel három koncentrikus gyűrűre térképezi fel az eszközöket.",
      "scr-heatmap": "A Heatmap a 10 legjobb eszközt arányos blokkokba rendezi a zöld és a piros 8 árnyalatában.",
      "scr-maintools": "A Main Tools pedig három lépésben elvezeti Önt a szuverén görbékhez, a 3D volatilitáshoz, az FX keresztezéshez és a határidős motorokhoz.",
      "ana-hero": "A Header egyesíti az eszközváltót, 9 időkeretet 1 perctől ALL-ig, és az 5 alapvető indikátort.",
      "ana-technical": "A műszaki objektívek SMA 20, VWAP és 2σ Bollinger szalagokat fednek, alsó hangerő-visszaigazolással.",
      "ana-compare": "Az Összehasonlítás %-kal mérheti a nettó százalékos előnyt vagy a Alpha Spread-t 0%-ról egy kompatibilis partnerrel vagy indexszel szemben.",
      "ana-micro": "A Micro & Flow a 20d Z-Score, a spread likviditási diszlokáció és a P-06 anomália pontszám segítségével érzékeli a volumencsúcsokat.",
      "ana-engines": "A negyedik lap egy dinamikus ad-hoc eszköz, amely eszközosztályonként változik: mivel a NVDA egy részvény, megnyitja a 3D volatilitás és opciók kifizetését, míg a kötvények, a deviza és az áruk saját speciális eszközeiket indítják el.",
      "res-hero": "A tetején a Score & Stance összefoglalja az alapvető ítéletet, a súlyozott értékelést és a hőmérőt.",
      "res-rag": "A bal oldali oszlopban a RAG Document Chat megválaszolja a hivatalos SEC 10-K és 10-Q bejelentéseken alapuló ellenőrzött lekérdezéseket.",
      "res-factors": "A középső oszlopban a Factors harmonika a legjobb 5 bikahajtót állítja szembe az első 5 medvekockával.",
      "res-pulse24h": "A jobb oldalon a FinBERT Pulse valós időben dönti el a legfrissebb híreket, és ábrázolja a 24 órás hangulatgörbét.",
      "p1-pills": "A 6 összefoglaló kártya újraszámolja az élő CAGR, Sharpe és Sortino, 95% VaR, Max Drawdown, Alfa és diverzifikációt.",
      "p1-table": "A Súlyozás táblázatban adja hozzá a 213 elem bármelyikét, állítsa be a pontos százalékos súlyokat, vagy 100%-ra egyensúlyozza újra.",
      "p1-xray": "A jobb felső sarokban az 5 lapos röntgenpanel az ETF átfedéseit, a kitettséget, a Brinson-hozzárendelést, a pénzforgalmat és a felügyeletet vizsgálja.",
      "p1-calendar": "Az X-Ray alatt a Havi naptár a januártól decemberig tartó hozamkonzisztenciát és az YTD összegeket jeleníti meg.",
      "p1-backtest": "A teljes szélességben alul a Backtesting összehasonlítja portfólióját a S&P 500, 60/40, All-Weather és Min-Variance modellekkel.",
      "p2-markowitz": "Az első kvadráns a 2D Markowitz Efficient Frontier-t ábrázolja, és pozícionálja portfólióját a Min-Var és Max-Sharpe-hez képest.",
      "p2-tornado": "A bal alsó kvadráns 5 történelmi válságot, eszközenkénti 95%-os VaR hozzájárulást és fejjel/lefelé mutató rögzítést tesztel.",
      "p2-corr": "A jobb felső sarokban a 6×6 Mátrix összehasonlítja a normál körülmények közötti összefüggéseket a válsággal való fertőzéssel.",
      "p2-shock2d": "A jobb alsó sarokban a Shock & Markov keresztezi a kamatlábakat a S&P 500 lépésekkel, és megbecsüli a rendszerváltásokat.",
      "p2-montecarlo": "Az alsó panel pedig 10 000 Monte Carlo útvonalat vetít a P95, P50 és P05, a víz alatti lehúzás és a gördülő Sharpe között.",
      "p3-impact": "A 6 Impact kártya összehasonlítja jelenlegi portfólióját a szimulált kereskedések utáni előrejelzett állapottal.",
      "p3-whatif": "A bal felső sarokban a What-If & Kelly szimulálja a jegyek vételét vagy eladását, és kiszámítja az optimális Half-Kelly pozícióméretet.",
      "p3-tailhedge": "A bal alsó sarokban az OTM Put & Margin szimulálja a védelmi opciós pajzsokat, és figyeli a Reg-T karbantartási rátát.",
      "p3-committee": "A két jobb oldali panelen a 3 pillérből álló Bizottság a kockázati védőkorlátokat a végrehajtási napló és a másodpilóta mellett ellenőrzi.",
      "p3-walkforward": "Alul pedig a Walk-Forward diagram a In-Sample és Out-of-Sample teljesítményét a WFE indexszel érvényesíti."
    }
  },
  "RO": {
    "ui": {
      "walkthrough": "Tutorial vizual live",
      "clickPlayPause": "Faceți clic pentru a reda sau pentru a întrerupe (Spațiu)",
      "subtitles": "Subtitrări (C)",
      "fullscreen": "Ecran complet (F)",
      "exitFullscreen": "Ieșiți din ecranul complet (F sau Esc)",
      "portTabs": [
        "Constructor",
        "Risc",
        "Simulator",
        "Copilotul"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Limbi",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Categorii",
      "scr-pulse": "02 • Puls 24h",
      "scr-table": "03 • Tabelul",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Hartă termică",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Tehnic",
      "ana-compare": "03 • Compara %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • Motoare 3D/2D",
      "res-hero": "01 • Scor și poziție",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • Factori",
      "res-pulse24h": "04 • FinBERT Puls",
      "p1-pills": "01 • Rezumat",
      "p1-table": "02 • Ponderarea",
      "p1-xray": "03 • cu raze X",
      "p1-calendar": "04 • Calendar",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado și VaR",
      "p2-corr": "03 • Corelație",
      "p2-shock2d": "04 • Șoc și Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Impact",
      "p3-whatif": "02 • What-If și Kelly",
      "p3-tailhedge": "03 • Put & Margin OTM",
      "p3-committee": "04 • Comitetul și jurnalul",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Bine ați venit la ecranul Home: punctul dvs; de pornire fără distracție, unde piețele sunt decodificate.",
      "home-header": "În colțul din stânga sus al Header, făcând clic pe pictograma λ vă aduce întotdeauna înapoi la această etapă principală.",
      "home-markets": "Centrat în partea de sus a Header este Markets, stația dvs; de lucru pentru a cerceta toate cele 213 de active globale în direct.",
      "home-portfolio": "Chiar lângă el, în meniul centrat, se află Portfolio, pentru a construi alocări, riscul de testare a stresului și a simula tranzacțiile.",
      "home-system": "Jos, în partea din stânga jos Footer, System deschide monitorul de observabilitate live pentru servere și baze de date.",
      "home-guide": "Pe lângă acesta, Guide deschide acest manual interactiv pas cu pas oricând aveți nevoie de el.",
      "home-langs": "În colțul din dreapta jos, butonul de limbă deschide modalul centrat pentru a traduce platforma în 56 de limbi.",
      "home-palettes": "Și Palette deschide cele 5 teme de citire vizuală, păstrând în același timp verdele și roșul financiar strict intacte.",
      "scr-categories": "În bara de categorii de sus, filtrați toate cele 213 de active, Watchlist sau 10 piețe specializate.",
      "scr-pulse": "Cardurile 4 Pulse 24h afișează volumul agregat, RSI mediu, regimul P-06 și dislocarea volumului superior.",
      "scr-table": "Tabelul interactiv oferă căutare instantanee, favorite și coloane inteligente adaptate fiecărei clase de active.",
      "scr-orbital": "Vizualizarea Orbital hărește activele pe trei inele concentrice prin abatere cu un panou de inspecție lateral activ.",
      "scr-heatmap": "Harta termică aranjează primele 10 elemente în blocuri proporționale în 8 nuanțe de verde și roșu.",
      "scr-maintools": "Și Main Tools vă ghidează în trei pași către curbe suverane, volatilitate 3D, încrucișare FX și motoare futures.",
      "ana-hero": "Header combină comutatorul de active, 9 intervale de timp de la 1 m la ALL și cei 5 indicatori de bază.",
      "ana-technical": "Lentila tehnică suprapune benzile SMA 20, VWAP și 2σ Bollinger cu confirmare a volumului inferior.",
      "ana-compare": "Cu Compara %, măsurați avantajul net net sau Alpha Spread de la 0% față de un peer sau index compatibil.",
      "ana-micro": "Micro & Flow detectează vârfurile de volum prin 20d Z-Score, dislocarea lichidității spread și scorul de anomalie P-06.",
      "ana-engines": "A patra filă este un instrument dinamic ad-hoc care variază în funcție de clasa de active: deoarece NVDA este o acțiune, deschide 3D Volatility & Options Payoff, în timp ce obligațiunile, FX și mărfurile își lansează propriile instrumente specializate.",
      "res-hero": "În partea de sus, Score & Stance rezumă verdictul fundamental, evaluarea ponderată și termometrul de titlu.",
      "res-rag": "În coloana din stânga, RAG Document Chat răspunde întrebărilor verificate bazate pe dosarele oficiale SEC 10-K și 10-Q.",
      "res-factors": "În coloana centrală, acordeonul Factori pune în contrast primii 5 tauriști cu primele 5 riscuri suportate.",
      "res-pulse24h": "În dreapta, FinBERT Pulse înregistrează titluri de ultimă oră în timp real și trasează curba sentimentului pe 24 de ore.",
      "p1-pills": "Cele 6 carduri Rezumat recalculează live CAGR, Sharpe și Sortino, 95% VaR, Max Drawdown, Alpha și diversificarea.",
      "p1-table": "În tabelul de ponderare, adăugați oricare dintre cele 213 de active, setați ponderi procentuale exacte sau reechilibrați la 100%.",
      "p1-xray": "În dreapta sus, panoul cu 5 file X-Ray auditează suprapunerea ETF, expunerea, atribuirea Brinson, fluxul de numerar și custodia.",
      "p1-calendar": "Sub X-Ray, Calendarul lunar afișează coerența returnărilor din ianuarie până în decembrie și totalurile YTD.",
      "p1-backtest": "Și în partea de jos la lățime completă, Backtesting compară portofoliul dvs; cu S&P 500, 60/40, All-Weather și Min-Variance.",
      "p2-markowitz": "Primul cadran trasează frontiera eficientă 2D Markowitz și vă poziționează portofoliul față de Min-Var și Max-Sharpe.",
      "p2-tornado": "Cadranul din stânga jos testează 5 crize istorice, contribuția VaR de 95% per activ și captura inversă/în jos.",
      "p2-corr": "În dreapta sus, Matricea 6×6 compară corelațiile în condiții normale cu contagierea cozii de criză.",
      "p2-shock2d": "În dreapta jos, Shock & Markov încrucișează schimbările ratei dobânzii cu mișcările S&P 500 și estimează tranzițiile de regim.",
      "p2-montecarlo": "Și panoul de jos proiectează 10.000 de căi Monte Carlo pe P95, P50 și P05, Drawdown subacvatic și Sharpe rulant.",
      "p3-impact": "Cele 6 cărți Impact vă compară portofoliul actual cu starea proiectată după tranzacțiile simulate.",
      "p3-whatif": "În stânga sus, What-If & Kelly simulează cumpărarea sau vânzarea de bilete și calculează dimensiunea optimă a poziției Half-Kelly.",
      "p3-tailhedge": "În stânga jos, OTM Put & Margin simulează opțiunile de protecție și monitorizează marja de întreținere Reg-T.",
      "p3-committee": "În cele două panouri din dreapta, Comitetul pe 3 piloni auditează balustradele de risc alături de Jurnalul de execuție și Copilot.",
      "p3-walkforward": "Și în partea de jos, graficul Walk-Forward validează performanța In-Sample și Out-of-Sample cu indicele WFE."
    }
  },
  "BG": {
    "ui": {
      "walkthrough": "Визуално ръководство на живо",
      "clickPlayPause": "Щракнете за възпроизвеждане или пауза (Интервал)",
      "subtitles": "Субтитри (C)",
      "fullscreen": "Цял екран (F)",
      "exitFullscreen": "Изход от цял екран (F или Esc)",
      "portTabs": [
        "Строител",
        "Риск",
        "Симулатор",
        "Втори пилот"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Езици",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Категории",
      "scr-pulse": "02 • 24-часов пулс",
      "scr-table": "03 • Таблица",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Топлинна карта",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • технически",
      "ana-compare": "03 • Сравнете %",
      "ana-micro": "04 • Микро и поток",
      "ana-engines": "05 • 3D/2D двигатели",
      "res-hero": "01 • Резултат и позиция",
      "res-rag": "02 • RAG Чат",
      "res-factors": "03 • Фактори",
      "res-pulse24h": "04 • FinBERT Пулс",
      "p1-pills": "01 • Резюме",
      "p1-table": "02 • Претегляне",
      "p1-xray": "03 • Рентгенова снимка",
      "p1-calendar": "04 • Календар",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Торнадо и VaR",
      "p2-corr": "03 • Корелация",
      "p2-shock2d": "04 • Шок & Марков",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Въздействие",
      "p3-whatif": "02 • What-If и Кели",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Комитет и дневник",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Добре дошли на екрана Home: вашата начална точка без разсейване, където пазарите се декодират.",
      "home-header": "В горния ляв ъгъл на Header, щракването върху иконата λ винаги ви връща обратно към този основен етап.",
      "home-markets": "Централно в горната част на Header е Markets, вашата работна станция за проучване на всички 213 глобални актива на живо.",
      "home-portfolio": "Точно до него в центрираното меню е Portfolio, за изграждане на разпределения, стрес тестване на риска и симулиране на сделки.",
      "home-system": "Долу в долния ляв Footer, System отваря монитора за наблюдение на живо за сървъри и бази данни.",
      "home-guide": "До него Guide отваря това интерактивно ръководство стъпка по стъпка, когато имате нужда от него.",
      "home-langs": "В долния десен ъгъл бутонът за език отваря центрирания модал за превод на платформата на 56 езика.",
      "home-palettes": "А Palette отваря 5-те теми за визуално четене, като същевременно запазва финансовото зелено и червено строго непокътнати.",
      "scr-categories": "В горната лента с категории филтрирайте всички 213 актива, вашия Watchlist или 10 специализирани пазара.",
      "scr-pulse": "4-те карти Pulse 24h показват агрегиран обем, среден RSI, режим P-06 и дислокации на най-високия обем.",
      "scr-table": "Интерактивната таблица разполага с незабавно търсене, предпочитани и интелигентни колони, пригодени за всеки клас активи.",
      "scr-orbital": "Изгледът Orbital картографира активи в три концентрични пръстена чрез отклонение с жив панел за странична инспекция.",
      "scr-heatmap": "Heatmap подрежда първите 10 актива в пропорционални блокове в 8 нюанса на зелено и червено.",
      "scr-maintools": "А Main Tools ви води в три стъпки към суверенните криви, 3D волатилността, FX cross и фючърсните двигатели.",
      "ana-hero": "Header съчетава превключвателя на активи, 9 времеви рамки от 1m до ALL и 5-те основни индикатора.",
      "ana-technical": "Техническият обектив покрива SMA 20, VWAP и 2σ Bollinger Bands с потвърждение на долния обем.",
      "ana-compare": "С Compare % измервайте нетното процентно предимство или Alpha Spread от 0% спрямо съвместим партньор или индекс.",
      "ana-micro": "Micro & Flow открива пикове в обема чрез 20d Z-Score, дислокация на ликвидността на спреда и P-06 аномален резултат.",
      "ana-engines": "Четвъртият раздел е динамичен ad-hoc инструмент, който варира в зависимост от класа активи: тъй като NVDA е капитал, той отваря 3D Volatility & Options Payoff, докато облигациите, валутата и стоките стартират свои собствени специализирани инструменти.",
      "res-hero": "В горната част Score & Stance обобщава основната присъда, претеглената оценка и термометъра за заглавие.",
      "res-rag": "В лявата колона RAG Document Chat отговаря на проверени запитвания, основани на официални документи на SEC 10-K и 10-Q.",
      "res-factors": "В централната колона акордеонът на факторите контрастира между 5-те най-добри бикове и 5-те най-добри мечи риска.",
      "res-pulse24h": "Отдясно FinBERT Pulse отбелязва революционни заглавия в реално време и чертае 24-часовата крива на настроението.",
      "p1-pills": "6-те обобщени карти преизчисляват на живо CAGR, Sharpe и Sortino, 95% VaR, Max Drawdown, Alpha и диверсификация.",
      "p1-table": "В таблицата с тежести добавете който и да е от 213 актива, задайте точни процентни тегла или балансирайте отново на 100%.",
      "p1-xray": "Горе вдясно панелът с 5 раздела X-Ray одитира припокриване на ETF, експозиция, приписване на Бринсън, паричен поток и попечителство.",
      "p1-calendar": "Под рентген, месечният календар показва последователност на връщанията от януари до декември и общи суми от началото на годината.",
      "p1-backtest": "И в долната част на цялата ширина Backtesting сравнява вашето портфолио с S&P 500, 60/40, All-Weather и Min-Variance.",
      "p2-markowitz": "Първият квадрант начертава 2D Markowitz Efficient Frontier и позиционира вашето портфолио спрямо Min-Var и Max-Sharpe.",
      "p2-tornado": "Долният ляв квадрант тества 5 исторически кризи, 95% VaR принос за всеки актив и улавяне на Upside/Downside.",
      "p2-corr": "Горе вдясно, матрицата 6 × 6 сравнява корелациите при нормални условия срещу заразяването на опашката на кризата.",
      "p2-shock2d": "Долу вдясно, Shock & Markov пресича промените на лихвените проценти с движения S&P 500 и оценява преходите на режима.",
      "p2-montecarlo": "А долният панел проектира 10 000 Monte Carlo пътеки през P95, P50 и P05, подводен Drawdown и търкалящ се Sharpe.",
      "p3-impact": "6-те карти Impact сравняват вашето текущо портфолио с прогнозираното състояние след вашите симулирани сделки.",
      "p3-whatif": "Горе вляво What-If & Kelly симулира покупка или продажба на билети и изчислява оптималния размер на позицията Half-Kelly.",
      "p3-tailhedge": "Долу вляво, OTM Put & Margin симулира защитни опционални щитове и следи маржа за поддръжка на Reg-T.",
      "p3-committee": "В двата десни панела комитетът от 3 стълба одитира предпазните ограждения за риск заедно с дневника за изпълнение и втория пилот.",
      "p3-walkforward": "И в долната част, графиката Walk-Forward потвърждава производителността на In-Sample и Out-of-Sample с индекса WFE."
    }
  },
  "EL": {
    "ui": {
      "walkthrough": "Live Visual Walkthrough",
      "clickPlayPause": "Κάντε κλικ για αναπαραγωγή ή παύση (Διάστημα)",
      "subtitles": "Υπότιτλοι (C)",
      "fullscreen": "Πλήρης οθόνη (F)",
      "exitFullscreen": "Έξοδος από την πλήρη οθόνη (F ή Esc)",
      "portTabs": [
        "οικοδόμος",
        "Κίνδυνος",
        "Προσομοιωτής",
        "Copilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Γλώσσες",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Κατηγορίες",
      "scr-pulse": "02 • 24h Pulse",
      "scr-table": "03 • Πίνακας",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Χάρτης θερμότητας",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Τεχνικό",
      "ana-compare": "03 • Σύγκριση %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D Κινητήρες",
      "res-hero": "01 • Βαθμολογία & Στάση",
      "res-rag": "02 • RAG Συνομιλία",
      "res-factors": "03 • Παράγοντες",
      "res-pulse24h": "04 • FinBERT Παλμός",
      "p1-pills": "01 • Περίληψη",
      "p1-table": "02 • στάθμιση",
      "p1-xray": "03 • Ακτινογραφία",
      "p1-calendar": "04 • Ημερολόγιο",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Συσχέτιση",
      "p2-shock2d": "04 • Σοκ & Μάρκοφ",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Αντίκτυπος",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Επιτροπή & Ημερολόγιο",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Καλώς ήρθατε στην οθόνη Home: το σημείο εκκίνησης χωρίς περισπασμούς όπου αποκωδικοποιούνται οι αγορές.",
      "home-header": "Στην επάνω αριστερή γωνία του Header, κάνοντας κλικ στο εικονίδιο λ σας φέρνει πάντα δεξιά πίσω σε αυτό το κύριο στάδιο.",
      "home-markets": "Στο κέντρο του Header βρίσκεται το Markets, ο σταθμός εργασίας σας για να ερευνήσετε ζωντανά και τα 213 παγκόσμια περιουσιακά στοιχεία.",
      "home-portfolio": "Ακριβώς δίπλα του στο κεντρικό μενού βρίσκεται το Portfolio, για τη δημιουργία κατανομών, τον κίνδυνο προσομοίωσης ακραίων καταστάσεων και την προσομοίωση συναλλαγών.",
      "home-system": "Κάτω στο Footer κάτω αριστερά, το System ανοίγει την οθόνη παρακολούθησης ζωντανής παρατηρητικότητας για διακομιστές και βάσεις δεδομένων.",
      "home-guide": "Εκτός από αυτό, το Guide ανοίγει αυτό το διαδραστικό εγχειρίδιο βήμα προς βήμα όποτε το χρειάζεστε.",
      "home-langs": "Στην κάτω δεξιά γωνία, το κουμπί γλώσσας ανοίγει το κεντραρισμένο modal για τη μετάφραση της πλατφόρμας σε 56 γλώσσες.",
      "home-palettes": "Και το Palette ανοίγει τα 5 οπτικά θέματα ανάγνωσης, διατηρώντας το οικονομικό πράσινο και κόκκινο αυστηρά ανέπαφο.",
      "scr-categories": "Στην επάνω γραμμή Κατηγορίες, φιλτράρετε όλα τα 213 στοιχεία, το Watchlist ή 10 εξειδικευμένες αγορές.",
      "scr-pulse": "Οι 4 κάρτες Pulse 24h δείχνουν συγκεντρωτικό όγκο, μέσο RSI, καθεστώς P-06 και εξαρθρώσεις κορυφαίου όγκου.",
      "scr-table": "Ο διαδραστικός πίνακας διαθέτει άμεση αναζήτηση, αγαπημένα και έξυπνες στήλες προσαρμοσμένες σε κάθε κατηγορία στοιχείων.",
      "scr-orbital": "Η προβολή Orbital αντιστοιχίζει τα στοιχεία σε τρεις ομόκεντρους δακτυλίους κατά απόκλιση με ένα ζωντανό πλαϊνό πίνακα επιθεώρησης.",
      "scr-heatmap": "Το Heatmap ταξινομεί τα 10 κορυφαία στοιχεία σε αναλογικά μπλοκ σε 8 αποχρώσεις του πράσινου και του κόκκινου.",
      "scr-maintools": "Και το Main Tools σας καθοδηγεί σε τρία βήματα σε κυρίαρχες καμπύλες, τρισδιάστατη αστάθεια, FX cross και κινητήρες μελλοντικής εκπλήρωσης.",
      "ana-hero": "Το Header συνδυάζει τον διακόπτη ενεργητικού, 9 χρονικά πλαίσια από 1 m σε ALL και 5 βασικούς δείκτες.",
      "ana-technical": "Ο τεχνικός φακός επικαλύπτει τις ζώνες SMA 20, VWAP και 2σ Bollinger με επιβεβαίωση έντασης κάτω.",
      "ana-compare": "Με το Compare %, μετρήστε το καθαρό ποσοστό πλεονέκτημα ή το Alpha Spread από 0% έναντι ενός συμβατού ομότιμου ή δείκτη.",
      "ana-micro": "Το Micro & Flow ανιχνεύει αιχμές όγκου μέσω 20d Z-Score, dislocation ρευστότητας και της βαθμολογίας ανωμαλίας P-06.",
      "ana-engines": "Η τέταρτη καρτέλα είναι ένα δυναμικό εργαλείο ad-hoc που ποικίλλει ανάλογα με την κατηγορία περιουσιακών στοιχείων: επειδή το NVDA είναι ένα μετοχικό κεφάλαιο, ανοίγει το 3D Volatility & Options Payoff, ενώ τα ομόλογα, το FX και τα εμπορεύματα λανσάρουν τα δικά τους εξειδικευμένα εργαλεία.",
      "res-hero": "Στην κορυφή, το Score & Stance συνοψίζει τη βασική ετυμηγορία, τη σταθμισμένη βαθμολογία και το θερμόμετρο επικεφαλίδας.",
      "res-rag": "Στην αριστερή στήλη, το RAG Document Chat απαντά σε επαληθευμένα ερωτήματα που βασίζονται σε επίσημα αρχεία SEC 10-K και 10-Q.",
      "res-factors": "Στην κεντρική στήλη, το ακορντεόν Factors αντιπαραβάλλει τους 5 κορυφαίους οδηγούς ταύρων με τους κορυφαίους 5 κινδύνους.",
      "res-pulse24h": "Στα δεξιά, το FinBERT Pulse σημειώνει εντυπωσιακούς τίτλους σε πραγματικό χρόνο και σχεδιάζει την 24ωρη καμπύλη συναισθήματος.",
      "p1-pills": "Οι 6 κάρτες Σύνοψης υπολογίζουν εκ νέου τα ζωντανά CAGR, Sharpe και Sortino, 95% VaR, Max Drawdown, Alpha και διαφοροποίηση.",
      "p1-table": "Στον πίνακα Στάθμιση, προσθέστε οποιοδήποτε από τα 213 στοιχεία, ορίστε ακριβείς ποσοστιαίες στάθμιση ή επανισορροπήστε στο 100%.",
      "p1-xray": "Επάνω δεξιά, ο πίνακας ακτίνων X 5 καρτελών ελέγχει την επικάλυψη ETF, την έκθεση, την απόδοση Brinson, τις ταμειακές ροές και την επιμέλεια.",
      "p1-calendar": "Κάτω από τις ακτίνες Χ, το Μηνιαίο Ημερολόγιο εμφανίζει τη συνέπεια των επιστροφών από τον Ιανουάριο έως τον Δεκέμβριο και τα σύνολα YTD.",
      "p1-backtest": "Και στο κάτω μέρος πλήρους πλάτους, το Backtesting συγκρίνει το χαρτοφυλάκιό σας με τα S&P 500, 60/40, All-Weather και Min-Variance.",
      "p2-markowitz": "Το πρώτο τεταρτημόριο σχεδιάζει το 2D Markowitz Efficient Frontier και τοποθετεί το χαρτοφυλάκιό σας έναντι των Min-Var και Max-Sharpe.",
      "p2-tornado": "Το κάτω αριστερό τεταρτημόριο δοκιμάζει 5 ιστορικές κρίσεις, συνεισφορά 95% VaR ανά περιουσιακό στοιχείο και σύλληψη Upside/Downside.",
      "p2-corr": "Επάνω δεξιά, η μήτρα 6×6 συγκρίνει τις συσχετίσεις σε κανονικές συνθήκες με τη μετάδοση της ουράς κρίσης.",
      "p2-shock2d": "Κάτω δεξιά, η Shock & Markov διασταυρώνει τις αλλαγές επιτοκίων με κινήσεις S&P 500 και εκτιμά τις μεταβάσεις καθεστώτος.",
      "p2-montecarlo": "Και το κάτω πλαίσιο προβάλλει 10.000 διαδρομές Monte Carlo σε P95, P50 και P05, υποβρύχια Drawdown και κυλιόμενη Sharpe.",
      "p3-impact": "Οι 6 κάρτες Impact συγκρίνουν το τρέχον χαρτοφυλάκιό σας με την προβλεπόμενη κατάσταση μετά τις προσομοιωμένες συναλλαγές σας.",
      "p3-whatif": "Επάνω αριστερά, το What-If & Kelly προσομοιώνει αγορά ή πώληση εισιτηρίων και υπολογίζει το βέλτιστο μέγεθος θέσης Half-Kelly.",
      "p3-tailhedge": "Κάτω αριστερά, το OTM Put & Margin προσομοιώνει τις προστατευτικές ασπίδες και παρακολουθεί το περιθώριο συντήρησης Reg-T.",
      "p3-committee": "Στους δύο δεξιούς πίνακες, η επιτροπή 3 πυλώνων ελέγχει τα προστατευτικά κιγκλιδώματα κινδύνου μαζί με το αρχείο καταγραφής εκτέλεσης και το Copilot.",
      "p3-walkforward": "Και στο κάτω μέρος, το γράφημα Walk-Forward επικυρώνει την απόδοση των In-Sample και Out-of-Sample με τον δείκτη WFE."
    }
  },
  "TR": {
    "ui": {
      "walkthrough": "Canlı Görsel Çözüm Yolu",
      "clickPlayPause": "Oynatmak veya duraklatmak için tıklayın (Boşluk)",
      "subtitles": "Altyazılar (C)",
      "fullscreen": "Tam Ekran (F)",
      "exitFullscreen": "Tam Ekrandan Çık (F veya Esc)",
      "portTabs": [
        "İnşaatçı",
        "Risk",
        "Simülatör",
        "Yardımcı pilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Diller",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategoriler",
      "scr-pulse": "02 • 24 saat Darbe",
      "scr-table": "03 • Tablo",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Isı haritası",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Teknik",
      "ana-compare": "03 • %'yi karşılaştır",
      "ana-micro": "04 • Mikro ve Akış",
      "ana-engines": "05 • 3D/2D Motorlar",
      "res-hero": "01 • Skor ve Duruş",
      "res-rag": "02 • RAG Sohbet",
      "res-factors": "03 • Faktörler",
      "res-pulse24h": "04 • FinBERT Darbe",
      "p1-pills": "01 • Özet",
      "p1-table": "02 • Ağırlıklandırma",
      "p1-xray": "03 • Röntgen",
      "p1-calendar": "04 • Takvim",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Kasırga ve VaR",
      "p2-corr": "03 • Korelasyon",
      "p2-shock2d": "04 • Şok ve Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Etki",
      "p3-whatif": "02 • What-If ve Kelly",
      "p3-tailhedge": "03 • OTM Satım ve Marj",
      "p3-committee": "04 • Komite ve Kayıt",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home ekranına hoş geldiniz: Piyasaların kodunun çözüldüğü, dikkatinizin dağılmadığı başlangıç noktanız.",
      "home-header": "Header'nin sol üst köşesindeki λ simgesine tıklamak sizi her zaman bu ana aşamaya geri getirir.",
      "home-markets": "Header'nin tepesinde, 213 küresel varlığın tamamını canlı olarak araştırmak için iş istasyonunuz olan Markets yer alır.",
      "home-portfolio": "Ortadaki menüde hemen yanında tahsisler oluşturmak, stres testi riski oluşturmak ve işlemleri simüle etmek için Portfolio bulunur.",
      "home-system": "Sol alt köşedeki Footer, System, sunucular ve veritabanları için canlı gözlemlenebilirlik monitörünü açar.",
      "home-guide": "Bunun yanında Guide, ihtiyaç duyduğunuzda bu etkileşimli adım adım kılavuzu açar.",
      "home-langs": "Sağ alt köşedeki dil düğmesi, platformu 56 dile çevirmek için ortalanmış modu açar.",
      "home-palettes": "Ve Palette, finansal yeşil ve kırmızıyı tam anlamıyla korurken 5 görsel okuma temasını açar.",
      "scr-categories": "Üstteki Kategoriler çubuğunda, 213 varlığın tamamına, Watchlist'nize veya 10 özel pazara göre filtreleyin.",
      "scr-pulse": "4 Pulse 24h kartı, toplu hacmi, ortalama RSI'yı, P-06 rejimini ve üst hacim dislokasyonlarını gösterir.",
      "scr-table": "İnteraktif Tabloda anında arama, sık kullanılanlar ve her varlık sınıfına göre uyarlanmış akıllı sütunlar bulunur.",
      "scr-orbital": "Orbital görünümü, canlı bir yan inceleme paneliyle varlıkları üç eşmerkezli halka boyunca sapmaya göre haritalar.",
      "scr-heatmap": "Isı Haritası, ilk 10 varlığı yeşil ve kırmızının 8 tonunda orantılı bloklar halinde düzenler.",
      "scr-maintools": "Ve Main Tools sizi üç adımda egemen eğriler, 3 boyutlu oynaklık, FX çapraz ve vadeli işlem motorlarına yönlendirir.",
      "ana-hero": "Header, varlık değiştiriciyi, 1 dakikadan TÜMÜNE kadar 9 zaman dilimini ve 5 temel göstergeyi birleştirir.",
      "ana-technical": "Teknik mercek, alt hacim onayıyla SMA 20, VWAP ve 2σ Bollinger Bantlarını kaplar.",
      "ana-compare": "Karşılaştırma %'si ile uyumlu bir eş veya endekse göre net yüzde avantajını veya Alpha Spread'yi %0'dan ölçün.",
      "ana-micro": "Micro & Flow, 20d Z-Score, spread likidite dislokasyonu ve P-06 anormallik skoru aracılığıyla hacim artışlarını tespit eder.",
      "ana-engines": "Dördüncü sekme, varlık sınıfına göre değişen dinamik, geçici bir araçtır: NVDA bir hisse senedi olduğundan, 3D Volatilite ve Opsiyon Kazançlarını açarken, tahviller, FX ve emtialar kendi özel araçlarını başlatır.",
      "res-hero": "En üstte, Skor ve Duruş temel kararı, ağırlıklı derecelendirmeyi ve manşet termometresini özetler.",
      "res-rag": "Sol sütundaki RAG Belge Sohbeti, resmi SEC 10-K ve 10-Q dosyalarına dayanan doğrulanmış sorguları yanıtlar.",
      "res-factors": "Orta sütunda, Faktörler akordeonunda en iyi 5 boğa sürücüsü ile ilk 5 ayı riski karşılaştırılıyor.",
      "res-pulse24h": "Sağda, FinBERT Pulse gerçek zamanlı olarak son dakika haberlerini puanlıyor ve 24 saatlik duyarlılık eğrisini çiziyor.",
      "p1-pills": "6 Özet kartı, canlı CAGR, Sharpe ve Sortino, %95 VaR, Max Drawdown, Alfa ve çeşitlendirmeyi yeniden hesaplar.",
      "p1-table": "Ağırlıklandırma tablosunda 213 varlıktan herhangi birini ekleyin, tam yüzde ağırlıklarını ayarlayın veya %100'e yeniden dengeleyin.",
      "p1-xray": "Sağ üstteki 5 sekmeli X-Ray paneli, ETF örtüşmesini, maruz kalmayı, Brinson ilişkilendirmesini, nakit akışını ve saklamayı denetler.",
      "p1-calendar": "X-Ray'in altında Aylık Takvim, Ocak-Aralık arası getiri tutarlılığını ve YTD toplamlarını gösterir.",
      "p1-backtest": "Ve tam genişlikte alttaki Backtesting, portföyünüzü S&P 500, 60/40, All-Weather ve Min-Variance ile karşılaştırır.",
      "p2-markowitz": "İlk çeyrek, 2D Markowitz Verimlilik Sınırını çizer ve portföyünüzü Min-Var ve Max-Sharpe'ye göre konumlandırır.",
      "p2-tornado": "Sol alt çeyrekte 5 tarihsel kriz, varlık başına %95 VaR katkısı ve Olumlu/Düşük Yön yakalaması test ediliyor.",
      "p2-corr": "Sağ üstte, 6×6 Matris normal koşullardaki korelasyonları krizin kuyruğunun yayılmasıyla karşılaştırıyor.",
      "p2-shock2d": "Sağ altta, Shock & Markov, faiz oranı değişimlerini S&P 500 hamleleriyle çaprazlıyor ve rejim geçişlerini tahmin ediyor.",
      "p2-montecarlo": "Ve alt panel, P95, P50 ve P05, su altı Düşüşü ve yuvarlanan Sharpe boyunca 10.000 Monte Carlo yolunu yansıtır.",
      "p3-impact": "6 Etki kartı, mevcut portföyünüzü simüle edilmiş işlemlerinizin ardından öngörülen durumla karşılaştırır.",
      "p3-whatif": "Sol üstte, What-If ve Kelly, alım veya satım biletlerini simüle eder ve optimum Half-Kelly konum boyutunu hesaplar.",
      "p3-tailhedge": "Sol altta, OTM Put & Margin, koruyucu seçenek kalkanlarını simüle eder ve Reg-T bakım marjını izler.",
      "p3-committee": "Sağdaki iki panelde, 3 sütunlu Komite, Yürütme Günlüğü ve Yardımcı Pilotun yanı sıra risk korkuluklarını da denetler.",
      "p3-walkforward": "En alttaki Walk-Forward grafiği, In-Sample ve Out-of-Sample performansını WFE endeksiyle doğrular."
    }
  },
  "RU": {
    "ui": {
      "walkthrough": "Живое визуальное прохождение",
      "clickPlayPause": "Нажмите, чтобы воспроизвести или приостановить воспроизведение (Пробел)",
      "subtitles": "Субтитры (С)",
      "fullscreen": "Полноэкранный режим (F)",
      "exitFullscreen": "Выход из полноэкранного режима (F или Esc)",
      "portTabs": [
        "Строитель",
        "Риск",
        "Симулятор",
        "Второй пилот"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Языки",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Категории",
      "scr-pulse": "02 • 24-часовой пульс",
      "scr-table": "03 • Таблица",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Тепловая карта",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Технический",
      "ana-compare": "03 • Сравнить %",
      "ana-micro": "04 • Микро и поток",
      "ana-engines": "05 • 3D/2D-движки",
      "res-hero": "01 • Оценка и позиция",
      "res-rag": "02 • RAG Чат",
      "res-factors": "03 • Факторы",
      "res-pulse24h": "04 • FinBERT Пульс",
      "p1-pills": "01 • Резюме",
      "p1-table": "02 • Взвешивание",
      "p1-xray": "03 • рентген",
      "p1-calendar": "04 • Календарь",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Торнадо и VaR",
      "p2-corr": "03 • Корреляция",
      "p2-shock2d": "04 • Шок и Марков",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Воздействие",
      "p3-whatif": "02 • What-If и Келли",
      "p3-tailhedge": "03 • OTM Пут и Маржа",
      "p3-committee": "04 • Комитет и журнал",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Добро пожаловать на экран Home: отправную точку, где вам не придется отвлекаться и расшифровывать рынки.",
      "home-header": "Щелчок по значку λ в верхнем левом углу Header всегда возвращает вас к этой основной сцене.",
      "home-markets": "В верхней части Header находится Markets, ваша рабочая станция для исследования всех 213 глобальных активов в реальном времени.",
      "home-portfolio": "Рядом с ним в центральном меню находится Portfolio, предназначенный для построения распределений, стресс-тестирования рисков и моделирования сделок.",
      "home-system": "В нижнем левом углу Footer System открывает монитор наблюдения в реальном времени для серверов и баз данных.",
      "home-guide": "Кроме того, Guide открывает это интерактивное пошаговое руководство, когда оно вам понадобится.",
      "home-langs": "В правом нижнем углу кнопка языка открывает центральное модальное окно для перевода платформы на 56 языков.",
      "home-palettes": "А Palette открывает 5 тем визуального чтения, сохраняя при этом финансовый зеленый и красный цвета.",
      "scr-categories": "В верхней панели категорий отфильтруйте все 213 активов, ваш Watchlist или 10 специализированных рынков.",
      "scr-pulse": "4 карты Pulse 24h показывают совокупный объем, средний RSI, режим P-06 и отклонения максимального объема.",
      "scr-table": "Интерактивная таблица обеспечивает мгновенный поиск, избранное и интеллектуальные столбцы, адаптированные для каждого класса активов.",
      "scr-orbital": "Представление Orbital отображает активы по трем концентрическим кольцам в зависимости от отклонения с помощью панели осмотра со стороны под напряжением.",
      "scr-heatmap": "Тепловая карта упорядочивает 10 лучших активов в пропорциональные блоки по 8 оттенкам зеленого и красного.",
      "scr-maintools": "Main Tools проведет вас за три шага к суверенным кривым, трехмерной волатильности, валютному кроссу и фьючерсным механизмам.",
      "ana-hero": "Header сочетает в себе переключатель активов, 9 таймфреймов от 1 мес до ВСЕХ и 5 основных индикаторов.",
      "ana-technical": "Техническая линза накладывает SMA 20, VWAP и полосы Боллинджера 2σ с подтверждением нижнего объема.",
      "ana-compare": "С помощью функции «Сравнить %» измерьте чистое процентное преимущество или Alpha Spread от 0% по сравнению с совместимым аналогом или индексом.",
      "ana-micro": "Micro & Flow обнаруживает скачки объема с помощью 20d Z-Score, дислокации спреда ликвидности и показателя аномалий P-06.",
      "ana-engines": "Четвертая вкладка представляет собой динамический специальный инструмент, который зависит от класса активов: поскольку NVDA является акцией, она открывает 3D-панель «Волатильность и выплата опционов», а облигации, валюта и сырьевые товары запускают свои собственные специализированные инструменты.",
      "res-hero": "Вверху Score & Stance суммирует фундаментальный вердикт, взвешенный рейтинг и термометр заголовка.",
      "res-rag": "В левом столбце RAG Document Chat отвечает на проверенные запросы, основанные на официальных документах SEC 10-K и 10-Q.",
      "res-factors": "В центральном столбце аккордеон «Факторы» сравнивает 5 главных драйверов быков с 5 крупнейшими медвежьими рисками.",
      "res-pulse24h": "Справа FinBERT Pulse оценивает заголовки новостей в режиме реального времени и строит 24-часовую кривую настроений.",
      "p1-pills": "На 6 сводных картах пересчитываются действующие CAGR, Sharpe и Sortino, 95% VaR, Max Drawdown, Alpha и диверсификация.",
      "p1-table": "В таблице «Вес» добавьте любой из 213 активов, установите точные процентные веса или выполните перебалансировку до 100%.",
      "p1-xray": "Вверху справа панель X-Ray с 5 вкладками проверяет перекрытие ETF, подверженность риску, атрибуцию Бринсона, денежный поток и хранение.",
      "p1-calendar": "Под X-Ray ежемесячный календарь отображает согласованность доходности с января по декабрь и итоговые показатели с начала года.",
      "p1-backtest": "А внизу во всю ширину Backtesting сравнивает ваше портфолио с S&P 500, 60/40, All-Weather и Min-Variance.",
      "p2-markowitz": "В первом квадранте отображается двухмерная граница эффективности Markowitz и позиционируется ваш портфель по сравнению с Min-Var и Max-Sharpe.",
      "p2-tornado": "Нижний левый квадрант тестирует 5 исторических кризисов, 95% вклад VaR на актив и захват восходящей/нисходящей стороны.",
      "p2-corr": "Вверху справа матрица 6×6 сравнивает корреляции в нормальных условиях с последствиями кризиса.",
      "p2-shock2d": "Внизу справа, Shock & Marov сравнивает изменения процентных ставок с изменениями S&P 500 и оценивает смену режимов.",
      "p2-montecarlo": "А на нижней панели проецируются 10 000 путей Monte Carlo через P95, P50 и P05, подводную просадку и перекат Sharpe.",
      "p3-impact": "6 карт «Влияние» сравнивают ваш текущий портфель с прогнозируемым состоянием после смоделированных сделок.",
      "p3-whatif": "Вверху слева What-If & Kelly имитирует покупку или продажу билетов и вычисляет оптимальный размер позиции Half-Kelly.",
      "p3-tailhedge": "Внизу слева OTM Put & Margin имитирует защитные опционные щиты и отслеживает поддерживающую маржу Reg-T.",
      "p3-committee": "На двух правых панелях трехкомпонентный комитет проверяет меры риска наряду с журналом выполнения и вторым пилотным проектом.",
      "p3-walkforward": "А внизу диаграмма Walk-Forward подтверждает производительность In-Sample и Out-of-Sample с индексом WFE."
    }
  },
  "UK": {
    "ui": {
      "walkthrough": "Живе візуальне проходження",
      "clickPlayPause": "Натисніть, щоб відтворити або призупинити (пробіл)",
      "subtitles": "Субтитри (C)",
      "fullscreen": "Повний екран (F)",
      "exitFullscreen": "Вийти з повноекранного режиму (F або Esc)",
      "portTabs": [
        "Будівельник",
        "Ризик",
        "Симулятор",
        "Другий пілот"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Мови",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Категорії",
      "scr-pulse": "02 • 24-годинний пульс",
      "scr-table": "03 • Таблиця",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Теплова карта",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • технічний",
      "ana-compare": "03 • Порівняти %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • Двигуни 3D/2D",
      "res-hero": "01 • Оцінка та стійка",
      "res-rag": "02 • RAG Чат",
      "res-factors": "03 • Фактори",
      "res-pulse24h": "04 • FinBERT Пульс",
      "p1-pills": "01 • Резюме",
      "p1-table": "02 • Зважування",
      "p1-xray": "03 • рентген",
      "p1-calendar": "04 • Календар",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Торнадо та VaR",
      "p2-corr": "03 • Кореляція",
      "p2-shock2d": "04 • Шок і Марков",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Вплив",
      "p3-whatif": "02 • What-If і Келлі",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Комітет і журнал",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Ласкаво просимо на екран Home: ваша відправна точка без відволікання, де декодуються ринки.",
      "home-header": "У верхньому лівому куті Header, клацнувши піктограму λ, ви завжди повертаєтеся до основної сцени.",
      "home-markets": "У верхній частині Header знаходиться Markets, ваша робоча станція для дослідження всіх 213 глобальних активів у реальному часі.",
      "home-portfolio": "Поряд із ним у центрованому меню знаходиться Portfolio для створення розподілу, стрес-тесту ризику та моделювання угод.",
      "home-system": "У нижньому лівому куті Footer System відкриває монітор реальної видимості для серверів і баз даних.",
      "home-guide": "Поряд з ним Guide відкриває цей інтерактивний покроковий посібник, коли вам це потрібно.",
      "home-langs": "У нижньому правому куті кнопка мови відкриває центрований режим для перекладу платформи на 56 мов.",
      "home-palettes": "А Palette відкриває 5 тем візуального читання, зберігаючи суворо недоторканими фінансовий зелений і червоний.",
      "scr-categories": "На верхній панелі категорій відфільтруйте всі 213 активів, ваш Watchlist або 10 спеціалізованих ринків.",
      "scr-pulse": "4 картки Pulse 24h показують загальний об’єм, середній RSI, режим P-06 і дислокації верхнього об’єму.",
      "scr-table": "Інтерактивна таблиця містить миттєвий пошук, уподобання та розумні стовпці, адаптовані до кожного класу активів.",
      "scr-orbital": "Перегляд Orbital відображає активи через три концентричні кільця за відхиленням за допомогою живої бічної оглядової панелі.",
      "scr-heatmap": "Heatmap упорядковує 10 найкращих активів у пропорційні блоки з 8 відтінками зеленого та червоного.",
      "scr-maintools": "А Main Tools допоможе вам у три кроки до суверенних кривих, тривимірної волатильності, валютного кросу та механізмів ф’ючерсів.",
      "ana-hero": "Header поєднує в собі перемикач активів, 9 таймфреймів від 1 м до ALL і 5 основних індикаторів.",
      "ana-technical": "Технічна лінза накладає смуги Боллінджера SMA 20, VWAP і 2σ із підтвердженням нижнього обсягу.",
      "ana-compare": "За допомогою Compare % виміряйте чисту відсоткову перевагу або Alpha Spread від 0% порівняно з аналогом або індексом.",
      "ana-micro": "Micro & Flow виявляє стрибки обсягу за допомогою 20d Z-Score, дислокації ліквідності спреду та оцінки аномалії P-06.",
      "ana-engines": "Четверта вкладка — це динамічний спеціальний інструмент, який залежить від класу активів: оскільки NVDA — це акції, він відкриває 3D Volatility & Options Payoff, тоді як облігації, валюта та товари запускають власні спеціалізовані інструменти.",
      "res-hero": "Угорі Score & Stance підсумовує фундаментальний вердикт, зважений рейтинг і термометр заголовка.",
      "res-rag": "У лівій колонці RAG Document Chat відповідає на перевірені запити, засновані на офіційних заявках SEC 10-K і 10-Q.",
      "res-factors": "У центральній колонці акордеон Факторів порівнює 5 найкращих факторів биків і 5 провідних ризиків ведмедів.",
      "res-pulse24h": "Праворуч FinBERT Pulse оцінює найактуальніші заголовки в режимі реального часу та малює 24-годинну криву настроїв.",
      "p1-pills": "6 підсумкових карток повторно обчислюють CAGR, Sharpe і Sortino, 95% VaR, Max Drawdown, Альфа та диверсифікацію.",
      "p1-table": "У таблиці зважування додайте будь-який із 213 активів, установіть точні відсоткові ваги або відновіть баланс до 100%.",
      "p1-xray": "У верхньому правому куті 5-вкладкова рентгенівська панель перевіряє перекриття ETF, експозицію, атрибуцію Брінсона, грошові потоки та зберігання.",
      "p1-calendar": "Під рентгенівським знімком у місячному календарі показано послідовність результатів за січень-грудень і загальні показники за рік.",
      "p1-backtest": "А внизу на всю ширину Backtesting порівнює ваше портфоліо з моделями S&P 500, 60/40, All-Weather і Min-Variance.",
      "p2-markowitz": "Перший квадрант показує 2D Markowitz Efficient Frontier і позиціонує ваш портфель у порівнянні з Min-Var і Max-Sharpe.",
      "p2-tornado": "У нижньому лівому квадранті перевіряються 5 історичних криз, 95% внеску VaR на кожен актив, а також фіксація позитивних/зворотних сторін.",
      "p2-corr": "Угорі праворуч матриця 6 × 6 порівнює кореляції в нормальних умовах із кризовим хвостом.",
      "p2-shock2d": "У нижньому правому куті Shock & Markov схрещує зміни процентної ставки з рухами S&P 500 і оцінює зміни режиму.",
      "p2-montecarlo": "А нижня панель проектує 10 000 шляхів Monte Carlo через P95, P50 і P05, підводне опускання та кочення Sharpe.",
      "p3-impact": "6 карток впливу порівнюють ваш поточний портфель із прогнозованим станом після змодельованих угод.",
      "p3-whatif": "Верхній ліворуч What-If & Kelly імітує купівлю або продаж квитків і обчислює оптимальний розмір позиції Half-Kelly.",
      "p3-tailhedge": "У нижньому лівому кутку OTM Put & Margin імітує захисні опціональні щити та відстежує маржу обслуговування Reg-T.",
      "p3-committee": "На двох правих панелях Комітет із трьох компонентів перевіряє огорожі ризиків разом із журналом виконання та копілотом.",
      "p3-walkforward": "А внизу діаграма Walk-Forward перевіряє продуктивність In-Sample і Out-of-Sample з індексом WFE."
    }
  },
  "SR": {
    "ui": {
      "walkthrough": "Визуелни водич уживо",
      "clickPlayPause": "Кликните за репродукцију или паузирање (размак)",
      "subtitles": "Титлови (Ц)",
      "fullscreen": "Цео екран (Ф)",
      "exitFullscreen": "Изађи из целог екрана (Ф или Есц)",
      "portTabs": [
        "Буилдер",
        "Ризик",
        "Симулатор",
        "Цопилот"
      ]
    },
    "short": {
      "home-canvas": "01 • ЗКСК25ККСЗ",
      "home-header": "02 • ЗКСК19ККСЗ (λ)",
      "home-markets": "03 • ЗКСК18ККСЗ",
      "home-portfolio": "04 • ЗКСК17ККСЗ",
      "home-system": "05 • ЗКСК21ККСЗ",
      "home-guide": "06 • ЗКСК22ККСЗ",
      "home-langs": "07 • Језици",
      "home-palettes": "08 • ЗКСК23ККСЗ",
      "scr-categories": "01 • Категорије",
      "scr-pulse": "02 • 24х Пулсе",
      "scr-table": "03 • Табле",
      "scr-orbital": "04 • ЗКСК24ККСЗ",
      "scr-heatmap": "05 • Хеатмап",
      "scr-maintools": "06 • ЗКСК13ККСЗ",
      "ana-hero": "01 • ЗКСК19ККСЗ",
      "ana-technical": "02 • Тецхницал",
      "ana-compare": "03 • Упоредити %",
      "ana-micro": "04 • Мицро & Флов",
      "ana-engines": "05 • 3Д/2Д мотори",
      "res-hero": "01 • Резултат и став",
      "res-rag": "02 • ЗКСК28ККСЗ Ћаскање",
      "res-factors": "03 • Фактори",
      "res-pulse24h": "04 • ЗКСК16ККСЗ Пулсе",
      "p1-pills": "01 • Резиме",
      "p1-table": "02 • Пондерисање",
      "p1-xray": "03 • Кс-Раи",
      "p1-calendar": "04 • Календар",
      "p1-backtest": "05 • ЗКСК15ККСЗ",
      "p2-markowitz": "01 • ЗКСК10ККСЗ 2Д",
      "p2-tornado": "02 • Торнадо & ЗКСК34ККСЗ",
      "p2-corr": "03 • Корелација",
      "p2-shock2d": "04 • Схоцк & Марков",
      "p2-montecarlo": "05 • ЗКСК07ККСЗ",
      "p3-impact": "01 • Утицај",
      "p3-whatif": "02 • ЗКСК06ККСЗ & Келли",
      "p3-tailhedge": "03 • ОТМ пут и маржа",
      "p3-committee": "04 • Одбор и дневник",
      "p3-walkforward": "05 • ЗКСК04ККСЗ"
    },
    "captions": {
      "home-canvas": "Добродошли на екран ЗКСК25ККСЗ: ваша почетна тачка без ометања где се тржишта декодирају.",
      "home-header": "У горњем левом углу ЗКСК19ККСЗ, кликом на икону λ увек се враћате на ову главну позорницу.",
      "home-markets": "Центрирано на врху ЗКСК19ККСЗ је ЗКСК18ККСЗ, ваша радна станица за истраживање свих 213 глобалних средстава уживо.",
      "home-portfolio": "Одмах поред њега у централном менију је ЗКСК17ККСЗ, за прављење алокација, стрес-тест ризика и симулацију трговања.",
      "home-system": "Доле у ​​доњем левом углу ЗКСК20ККСЗ, ЗКСК21ККСЗ отвара монитор видљивости уживо за сервере и базе података.",
      "home-guide": "Поред тога, ЗКСК22ККСЗ отвара овај интерактивни приручник корак по корак кад год вам затреба.",
      "home-langs": "У доњем десном углу, дугме за језик отвара центрирани модал за превођење платформе на 56 језика.",
      "home-palettes": "А ЗКСК23ККСЗ отвара 5 тема визуелног читања, задржавајући финансијску зелену и црвену стриктно нетакнуте.",
      "scr-categories": "На горњој траци са категоријама филтрирајте свих 213 средстава, ваш ЗКСК14ККСЗ или 10 специјализованих тржишта.",
      "scr-pulse": "4 Пулсе 24х картице показују агрегирану запремину, просечни РСИ, режим ЗКСК37ККСЗ и дислокације највеће запремине.",
      "scr-table": "Интерактивна табела садржи тренутну претрагу, фаворите и паметне колоне прилагођене свакој класи средстава.",
      "scr-orbital": "ЗКСК24ККСЗ приказ мапира средства кроз три концентрична прстена девијацијом са бочним панелом за инспекцију уживо.",
      "scr-heatmap": "Хеатмап распоређује првих 10 средстава у пропорционалне блокове у 8 нијанси зелене и црвене.",
      "scr-maintools": "А ЗКСК13ККСЗ вас води у три корака до суверених кривуља, 3Д волатилности, ФКС крста и механизама за будућност.",
      "ana-hero": "ЗКСК19ККСЗ комбинује мењач средстава, 9 временских оквира од 1 м до АЛЛ и 5 основних индикатора.",
      "ana-technical": "Техничко сочиво прекрива ЗКСК27ККСЗ, ЗКСК26ККСЗ и 2σ Боллингер Бандс са потврдом доње јачине звука.",
      "ana-compare": "Са упореди %, измерите нето процентуалну предност или ЗКСК12ККСЗ од 0% у односу на компатибилан пеер или индекс.",
      "ana-micro": "Мицро & Флов детектује скокове запремине преко 20д З-Сцоре-а, дислокације ширења ликвидности и ЗКСК37ККСЗ резултата аномалије.",
      "ana-engines": "Четврта картица је динамички ад-хоц алат који се разликује у зависности од класе имовине: пошто је ЗКСК29ККСЗ капитал, он отвара 3Д волатилност и исплату опција, док обвезнице, валута и роба покрећу сопствене специјализоване алате.",
      "res-hero": "На врху, Сцоре & Станце сумира основну пресуду, пондерисану оцену и насловни термометар.",
      "res-rag": "У левој колони, ЗКСК28ККСЗ Доцумент Цхат одговара на верификоване упите засноване на званичним поднесцима СЕЦ ЗКСК38ККСЗ и ЗКСК39ККСЗ.",
      "res-factors": "У средишњој колони, хармоника Фацтора супротставља 5 најбољих возача бикова у односу на 5 најбољих ризика који носе.",
      "res-pulse24h": "На десној страни, ЗКСК16ККСЗ Пулсе бележи ударне наслове у реалном времену и исцртава 24-часовну криву расположења.",
      "p1-pills": "6 картица са резимеом поново израчунавају ЗКСК33ККСЗ, ЗКСК31ККСЗ и ЗКСК32ККСЗ, 95% ЗКСК34ККСЗ, ЗКСК11ККСЗ, Алпха и диверсификацију.",
      "p1-table": "У табели пондерисања, додајте било коју од 213 средстава, поставите тачне процентуалне тежине или ребалансирајте на 100%.",
      "p1-xray": "Горе десно, рендгенски панел са 5 картица ревидира преклапање ЕТФ-а, изложеност, Бринсонову атрибуцију, ток новца и старатељство.",
      "p1-calendar": "Испод рендгенског снимка, месечни календар приказује конзистентност поврата од јануара до децембра и укупне износе од почетка године.",
      "p1-backtest": "А на дну пуне ширине, ЗКСК15ККСЗ упоређује ваш портфолио са ЗКСК30ККСЗ, 60/40, ЗКСК00ККСЗ и ЗКСК01ККСЗ.",
      "p2-markowitz": "Први квадрант приказује 2Д ЗКСК10ККСЗ Еффициент Фронтиер и позиционира ваш портфолио у односу на ЗКСК09ККСЗ и ЗКСК08ККСЗ.",
      "p2-tornado": "У доњем левом квадранту се тестира 5 историјских криза, 95% доприноса ЗКСК34ККСЗ по активи и хватање горе/доле.",
      "p2-corr": "Горе десно, матрица 6×6 упоређује корелације у нормалним условима са заразом кризног репа.",
      "p2-shock2d": "Доле десно, Схоцк & Марков укршта промене каматних стопа са ЗКСК30ККСЗ потезима и процењује промене режима.",
      "p2-montecarlo": "А доњи панел пројектује 10.000 путања ЗКСК07ККСЗ преко П95, П50 и П05, подводног повлачења и котрљања ЗКСК31ККСЗ.",
      "p3-impact": "6 Импацт картица упоређују ваш тренутни портфолио са пројектованим стањем након ваших симулираних трговина.",
      "p3-whatif": "Горе лево, ЗКСК06ККСЗ & Келли симулира куповину или продају карата и израчунава оптималну величину позиције ЗКСК05ККСЗ.",
      "p3-tailhedge": "Доле лево, ОТМ Пут & Маргин симулира заштитне опционе штитове и надгледа маргину одржавања ЗКСК36ККСЗ.",
      "p3-committee": "У два десна панела, Комитет са 3 стуба ревидира ограде од ризика заједно са Дневником извршења и копилотом.",
      "p3-walkforward": "А на дну, графикон ЗКСК04ККСЗ потврђује перформансе ЗКСК03ККСЗ и ЗКСК02ККСЗ индексом ЗКСК35ККСЗ."
    }
  },
  "HR": {
    "ui": {
      "walkthrough": "Vizualni pregled uživo",
      "clickPlayPause": "Kliknite za reprodukciju ili pauzu (razmaknica)",
      "subtitles": "Podnaslovi (C)",
      "fullscreen": "Cijeli zaslon (F)",
      "exitFullscreen": "Izlaz iz cijelog zaslona (F ili Esc)",
      "portTabs": [
        "Graditelj",
        "Rizik",
        "Simulator",
        "Kopilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • jezici",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • kategorije",
      "scr-pulse": "02 • 24h puls",
      "scr-table": "03 • Tablica",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Toplinska karta",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • tehnički",
      "ana-compare": "03 • Usporedi %",
      "ana-micro": "04 • Mikro i protok",
      "ana-engines": "05 • 3D/2D motori",
      "res-hero": "01 • Rezultat i stav",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • Čimbenici",
      "res-pulse24h": "04 • FinBERT Puls",
      "p1-pills": "01 • Sažetak",
      "p1-table": "02 • Ponderiranje",
      "p1-xray": "03 • X-zraka",
      "p1-calendar": "04 • Kalendar",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Korelacija",
      "p2-shock2d": "04 • Šok & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Utjecaj",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Odbor & Dnevnik",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Dobrodošli na zaslon Home: vaša početna točka bez ometanja gdje se tržišta dekodiraju.",
      "home-header": "U gornjem lijevom kutu Header, klik na ikonu λ uvijek vas vraća na ovu glavnu pozornicu.",
      "home-markets": "U sredini na vrhu Header je Markets, vaša radna stanica za istraživanje svih 213 globalnih sredstava uživo.",
      "home-portfolio": "Odmah pokraj njega u središnjem izborniku nalazi se Portfolio, za izgradnju alokacija, stres test rizika i simulaciju trgovanja.",
      "home-system": "Dolje u donjem lijevom Footer, System otvara monitor za praćenje uživo za poslužitelje i baze podataka.",
      "home-guide": "Pored njega, Guide otvara ovaj interaktivni priručnik korak po korak kad god vam zatreba.",
      "home-langs": "U donjem desnom kutu gumb za jezik otvara središnji modal za prijevod platforme na 56 jezika.",
      "home-palettes": "A Palette otvara 5 tema za vizualno čitanje, dok je financijska zelena i crvena strogo netaknuta.",
      "scr-categories": "Na gornjoj traci s kategorijama filtrirajte svih 213 sredstava, svoj Watchlist ili 10 specijaliziranih tržišta.",
      "scr-pulse": "Kartice 4 Pulse 24h prikazuju agregirani volumen, prosječni RSI, režim P-06 i najveće dislokacije volumena.",
      "scr-table": "Interaktivna tablica sadrži trenutno pretraživanje, favorite i pametne stupce prilagođene svakoj klasi imovine.",
      "scr-orbital": "Pogled Orbital mapira imovinu preko tri koncentrična prstena odstupanjem s bočnom inspekcijskom pločom uživo.",
      "scr-heatmap": "Toplinska karta raspoređuje 10 najboljih sredstava u proporcionalne blokove u 8 nijansi zelene i crvene.",
      "scr-maintools": "A Main Tools vodi vas u tri koraka do suverenih krivulja, 3D volatilnosti, FX cross-a i motora budućnosti.",
      "ana-hero": "Header kombinira izmjenjivač sredstava, 9 vremenskih okvira od 1m do ALL i 5 osnovnih indikatora.",
      "ana-technical": "Tehnička leća prekriva SMA 20, VWAP i 2σ Bollingerove trake s potvrđivanjem donjeg volumena.",
      "ana-compare": "Uz Usporedi %, izmjerite neto postotak prednosti ili Alpha Spread od 0% u odnosu na kompatibilnog konkurenta ili indeks.",
      "ana-micro": "Micro & Flow otkriva skokove volumena putem 20d Z-Score-a, dislokacije likvidnosti širenja i P-06 rezultata anomalije.",
      "ana-engines": "Četvrta kartica je dinamički ad-hoc alat koji se razlikuje prema klasi imovine: budući da je NVDA dionica, otvara 3D volatilnost i isplatu opcija, dok obveznice, FX i roba pokreću vlastite specijalizirane alate.",
      "res-hero": "Na vrhu, Score & Stance sažima temeljnu presudu, ponderiranu ocjenu i glavni termometar.",
      "res-rag": "U lijevom stupcu, RAG Document Chat odgovara na provjerene upite temeljene na službenim SEC 10-K i 10-Q podnescima.",
      "res-factors": "U središnjem stupcu, harmonika faktora suprotstavlja 5 najvećih pokretača bikova i 5 najvećih rizika medvjeda.",
      "res-pulse24h": "S desne strane, FinBERT Pulse bilježi najnovije naslove u stvarnom vremenu i iscrtava 24-satnu krivulju osjećaja.",
      "p1-pills": "6 kartica sa sažetkom ponovno izračunava CAGR, Sharpe i Sortino, 95% VaR, Max Drawdown, Alpha i diverzifikaciju.",
      "p1-table": "U tablici ponderiranja dodajte bilo koju od 213 imovine, postavite točne pondere u postocima ili rebalansirajte na 100%.",
      "p1-xray": "Gore desno, X-Ray ploča s 5 kartica revidira preklapanje ETF-a, izloženost, Brinsonovu atribuciju, tok novca i skrbništvo.",
      "p1-calendar": "Ispod rendgenske snimke, mjesečni kalendar prikazuje konzistentnost povrata od siječnja do prosinca i ukupne rezultate od početka godine.",
      "p1-backtest": "A na dnu pune širine, Backtesting uspoređuje vaš portfelj sa S&P 500, 60/40, All-Weather i Min-Variance.",
      "p2-markowitz": "Prvi kvadrant iscrtava 2D Markowitz Efficient Frontier i pozicionira vaš portfelj u odnosu na Min-Var i Max-Sharpe.",
      "p2-tornado": "Donji lijevi kvadrant testira 5 povijesnih kriza, VaR doprinos od 95% po imovini i bilježenje Upside/Downside.",
      "p2-corr": "Gore desno, Matrica 6×6 uspoređuje korelacije u normalnim uvjetima i zarazu kriznog repa.",
      "p2-shock2d": "Dolje desno, Shock & Markov križa promjene kamatnih stopa s potezima S&P 500 i procjenjuje prijelaze režima.",
      "p2-montecarlo": "A donja ploča projicira 10 000 Monte Carlo putanja preko P95, P50 i P05, podvodnog pada i kotrljajućeg Sharpe.",
      "p3-impact": "6 Impact kartica uspoređuje vaš trenutni portfelj s projiciranim stanjem nakon vaših simuliranih trgovanja.",
      "p3-whatif": "Gore lijevo, What-If & Kelly simulira kupnju ili prodaju ulaznica i izračunava optimalnu veličinu pozicije Half-Kelly.",
      "p3-tailhedge": "Dolje lijevo, OTM Put & Margin simulira zaštitne opcijske štitove i nadzire maržu održavanja Reg-T.",
      "p3-committee": "U dva desna panela, Odbor od 3 stupa revidira zaštitne ograde za rizik uz Dnevnik izvršenja i Kopilot.",
      "p3-walkforward": "A na dnu, grafikon Walk-Forward potvrđuje performanse In-Sample i Out-of-Sample sa WFE indeksom."
    }
  },
  "SL": {
    "ui": {
      "walkthrough": "Vizualni sprehod v živo",
      "clickPlayPause": "Kliknite za predvajanje ali premor (preslednica)",
      "subtitles": "Podnapisi (C)",
      "fullscreen": "Celozaslonski (F)",
      "exitFullscreen": "Izhod iz celozaslonskega načina (F ali Esc)",
      "portTabs": [
        "Gradbenik",
        "Tveganje",
        "Simulator",
        "Kopilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Jeziki",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • kategorije",
      "scr-pulse": "02 • 24-urni utrip",
      "scr-table": "03 • Tabela",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Toplotni zemljevid",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Tehnični",
      "ana-compare": "03 • Primerjaj %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D motorji",
      "res-hero": "01 • Rezultat in drža",
      "res-rag": "02 • RAG Klepet",
      "res-factors": "03 • Dejavniki",
      "res-pulse24h": "04 • FinBERT Pulse",
      "p1-pills": "01 • Povzetek",
      "p1-table": "02 • Ponderiranje",
      "p1-xray": "03 • Rentgen",
      "p1-calendar": "04 • Koledar",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado in VaR",
      "p2-corr": "03 • Korelacija",
      "p2-shock2d": "04 • Šok & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Vpliv",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Odbor in dnevnik",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Dobrodošli na zaslonu Home: vaše izhodišče brez motenj, kjer se trgi dekodirajo.",
      "home-header": "Klik na ikono λ v zgornjem levem kotu Header vas vedno pripelje nazaj na to glavno stopnjo.",
      "home-markets": "Na vrhu Header je Markets, vaša delovna postaja za raziskovanje vseh 213 globalnih sredstev v živo.",
      "home-portfolio": "Tik ob njem v osrednjem meniju je Portfolio za ustvarjanje dodelitev, stresno testiranje tveganja in simulacijo poslov.",
      "home-system": "Spodaj levo Footer System odpre nadzornik opazovanja v živo za strežnike in baze podatkov.",
      "home-guide": "Guide poleg tega odpre ta interaktivni priročnik po korakih, kadar koli ga potrebujete.",
      "home-langs": "V spodnjem desnem kotu jezikovni gumb odpre osrednji modal za prevajanje platforme v 56 jezikov.",
      "home-palettes": "In Palette odpre 5 tem za vizualno branje, medtem ko ohranja finančno zeleno in rdečo strogo nedotaknjeno.",
      "scr-categories": "V zgornji vrstici s kategorijami filtrirajte med vsemi 213 sredstvi, svojim Watchlist ali 10 specializiranimi trgi.",
      "scr-pulse": "Kartice 4 Pulse 24h prikazujejo skupni volumen, povprečni RSI, režim P-06 in dislokacije najvišjega volumna.",
      "scr-table": "Interaktivna tabela vsebuje takojšnje iskanje, priljubljene in pametne stolpce, prilagojene vsakemu razredu sredstev.",
      "scr-orbital": "Pogled Orbital preslika sredstva v tri koncentrične obroče z odstopanjem s stransko inšpekcijsko ploščo v živo.",
      "scr-heatmap": "Toplotni zemljevid razporedi 10 najboljših sredstev v sorazmerne bloke v 8 odtenkih zelene in rdeče.",
      "scr-maintools": "Main Tools pa vas v treh korakih vodi do suverenih krivulj, 3D volatilnosti, FX cross in terminskih motorjev.",
      "ana-hero": "Header združuje preklopnik sredstev, 9 časovnih okvirov od 1m do VSEH in 5 osnovnih indikatorjev.",
      "ana-technical": "Tehnična leča prekriva SMA 20, VWAP in 2σ Bollingerjev pas s potrditvijo spodnjega obsega.",
      "ana-compare": "S primerjavo % izmerite neto odstotno prednost ali Alpha Spread od 0 % proti združljivemu enakovrednemu ponudniku ali indeksu.",
      "ana-micro": "Micro & Flow zazna skoke količine prek 20d Z-Score, dislokacije razpršene likvidnosti in ocene anomalije P-06.",
      "ana-engines": "Četrti zavihek je dinamično priložnostno orodje, ki se razlikuje glede na razred sredstev: ker je NVDA lastniški kapital, odpre 3D Volatility & Options Payoff, medtem ko obveznice, FX in surovine lansirajo lastna specializirana orodja.",
      "res-hero": "Na vrhu Score & Stance povzema temeljno razsodbo, ponderirano oceno in naslovni termometer.",
      "res-rag": "V levem stolpcu RAG Document Chat odgovarja na preverjena vprašanja, ki temeljijo na uradnih vlogah SEC 10-K in 10-Q.",
      "res-factors": "V osrednjem stolpcu je harmonika Factors v nasprotju med 5 največjimi vozniki bikov in 5 največjimi medvedjimi tveganji.",
      "res-pulse24h": "Na desni FinBERT Pulse v realnem času beleži udarne naslove in izrisuje 24-urno krivuljo razpoloženja.",
      "p1-pills": "6 kartic s povzetkom v živo ponovno izračuna CAGR, Sharpe in Sortino, 95 % VaR, Max Drawdown, Alpha in diverzifikacijo.",
      "p1-table": "V tabeli uteži dodajte katero koli od 213 sredstev, nastavite natančne uteži v odstotkih ali znova uravnotežite na 100 %.",
      "p1-xray": "Zgoraj desno plošča X-Ray s 5 zavihki revidira prekrivanje ETF, izpostavljenost, pripis Brinson, denarni tok in skrbništvo.",
      "p1-calendar": "Mesečni koledar pod rentgenskim posnetkom prikazuje konsistentnost donosov od januarja do decembra in skupne vrednosti YTD.",
      "p1-backtest": "In na dnu celotne širine Backtesting primerja vaš portfelj z S&P 500, 60/40, All-Weather in Min-Variance.",
      "p2-markowitz": "Prvi kvadrant prikazuje 2D Markowitz Efficient Frontier in pozicionira vaš portfelj v primerjavi z Min-Var in Max-Sharpe.",
      "p2-tornado": "Spodnji levi kvadrant preizkuša 5 zgodovinskih kriz, 95-odstotni prispevek VaR na sredstvo in zajem Upside/Downside.",
      "p2-corr": "Zgoraj desno matrika 6 × 6 primerja korelacije v normalnih razmerah z okužbo kriznega repa.",
      "p2-shock2d": "Spodaj desno Shock & Markov križa premike obrestnih mer s premiki S&P 500 in ocenjuje prehode režimov.",
      "p2-montecarlo": "In spodnja plošča projicira 10.000 poti Monte Carlo čez P95, P50 in P05, podvodno vlečenje in kotaljenje Sharpe.",
      "p3-impact": "6 kartic Impact primerja vaš trenutni portfelj s predvidenim stanjem po vaših simuliranih poslih.",
      "p3-whatif": "Zgoraj levo What-If & Kelly simulira nakup ali prodajo vstopnic in izračuna optimalno velikost pozicije Half-Kelly.",
      "p3-tailhedge": "Spodaj levo OTM Put & Margin simulira zaščitne opcijske ščite in spremlja vzdrževalno maržo Reg-T.",
      "p3-committee": "V dveh desnih podoknih odbor s tremi stebri revidira zaščitne ograje tveganja poleg dnevnika izvajanja in kopilota.",
      "p3-walkforward": "Na dnu pa grafikon Walk-Forward potrjuje zmogljivost In-Sample in Out-of-Sample z indeksom WFE."
    }
  },
  "LT": {
    "ui": {
      "walkthrough": "Tiesioginis vizualinis perėjimas",
      "clickPlayPause": "Spustelėkite norėdami žaisti arba pristabdyti (tarpas)",
      "subtitles": "Subtitrai (C)",
      "fullscreen": "Visas ekranas (F)",
      "exitFullscreen": "Išeiti per visą ekraną (F arba Esc)",
      "portTabs": [
        "Statybininkas",
        "Rizika",
        "Simuliatorius",
        "Antrasis pilotas"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Kalbos",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategorijos",
      "scr-pulse": "02 • 24h pulsas",
      "scr-table": "03 • Lentelė",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Šilumos žemėlapis",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Techninė",
      "ana-compare": "03 • Palyginti %",
      "ana-micro": "04 • Mikro ir srautas",
      "ana-engines": "05 • 3D/2D varikliai",
      "res-hero": "01 • Rezultatas ir pozicija",
      "res-rag": "02 • RAG Pokalbiai",
      "res-factors": "03 • Veiksniai",
      "res-pulse24h": "04 • FinBERT impulsas",
      "p1-pills": "01 • Santrauka",
      "p1-table": "02 • Svoris",
      "p1-xray": "03 • Rentgeno spinduliai",
      "p1-calendar": "04 • Kalendorius",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornadas ir VaR",
      "p2-corr": "03 • Koreliacija",
      "p2-shock2d": "04 • Šokas ir Markovas",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Poveikis",
      "p3-whatif": "02 • What-If ir Kelly",
      "p3-tailhedge": "03 • OTM įdėjimas ir marža",
      "p3-committee": "04 • Komitetas ir žurnalas",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Sveiki atvykę į Home ekraną: jūsų neblaškantis pradžios taškas, kuriame rinkos iššifruojamos.",
      "home-header": "Viršutiniame kairiajame Header kampe spustelėjus piktogramą λ visada grįšite į šią pagrindinę sceną.",
      "home-markets": "Header viršuje yra Markets, jūsų darbo stotis, kurioje galite tiesiogiai tyrinėti visus 213 pasaulinių išteklių.",
      "home-portfolio": "Šalia jo centre esančiame meniu yra Portfolio, skirtas paskirstyti, testuoti riziką ir imituoti sandorius.",
      "home-system": "Apačioje kairėje Footer System atidaro tiesioginį serverių ir duomenų bazių stebėjimo monitorių.",
      "home-guide": "Šalia jo Guide atidaro šį interaktyvų nuoseklų vadovą, kai tik jo prireikia.",
      "home-langs": "Apatiniame dešiniajame kampe esantis kalbos mygtukas atveria centre esantį modalą, kad platforma būtų išversta į 56 kalbas.",
      "home-palettes": "Be to, Palette atveria 5 vaizdines skaitymo temas, o finansinės žaliavos ir raudonos spalvos išlieka nepakitusios.",
      "scr-categories": "Viršutinėje kategorijų juostoje filtruokite pagal visus 213 išteklių, savo Watchlist arba 10 specializuotų rinkų.",
      "scr-pulse": "4 Pulse 24h kortelės rodo bendrą garsumą, vidutinį RSI, P-06 režimą ir didžiausius garsumo poslinkius.",
      "scr-table": "Interaktyvioje lentelėje yra momentinė paieška, parankiniai ir išmanieji stulpeliai, pritaikyti kiekvienai turto klasei.",
      "scr-orbital": "Orbital rodinys rodo turtą per tris koncentrinius žiedus pagal nukrypimą, naudojant tiesioginį šoninį tikrinimo skydelį.",
      "scr-heatmap": "„Heatmap“ suskirsto 10 geriausių išteklių į proporcingus blokus per 8 žalios ir raudonos spalvos atspalvius.",
      "scr-maintools": "O Main Tools trimis žingsniais veda į suverenias kreives, 3D nepastovumą, FX kryžių ir ateities sandorių variklius.",
      "ana-hero": "Header sujungia turto perjungiklį, 9 laiko intervalus nuo 1 m iki ALL ir 5 pagrindinius indikatorius.",
      "ana-technical": "Techninės objektyvo perdangos SMA 20, VWAP ir 2σ Bollingerio juostos su apatinės apimties patvirtinimu.",
      "ana-compare": "Naudodami palyginimą %, išmatuokite grynąjį procentinį pranašumą arba Alpha Spread nuo 0%, palyginti su suderinamu partneriu ar indeksu.",
      "ana-micro": "„Micro & Flow“ aptinka apimties šuolius per 20 d Z-score, sklaidos likvidumo dislokaciją ir P-06 anomalijos balą.",
      "ana-engines": "Ketvirtasis skirtukas yra dinamiškas specialus įrankis, kuris skiriasi priklausomai nuo turto klasės: kadangi NVDA yra akcinis kapitalas, jis atveria 3D nepastovumo ir parinkčių atsipirkimą, o obligacijos, valiutos keitimas ir biržos prekės paleidžia savo specializuotus įrankius.",
      "res-hero": "Viršuje Score & Stance apibendrina pagrindinį verdiktą, svertinį įvertinimą ir antraštės termometrą.",
      "res-rag": "Kairiajame stulpelyje RAG Document Chat atsako į patikrintas užklausas, pagrįstas oficialiais SEC 10-K ir 10-Q dokumentais.",
      "res-factors": "Centrinėje stulpelyje „Factors“ akordeonas priešpastato 5 geriausius bulių varytuvus ir 5 geriausius meškos rizikos veiksnius.",
      "res-pulse24h": "Dešinėje „FinBERT Pulse“ realiuoju laiku pateikia itin svarbias antraštes ir nubrėžia 24 valandų nuotaikos kreivę.",
      "p1-pills": "6 suvestinės kortelės perskaičiuoja tiesioginius CAGR, Sharpe ir Sortino, 95 % VaR, Max Drawdown, alfa ir diversifikaciją.",
      "p1-table": "Svorių lentelėje pridėkite bet kurį iš 213 išteklių, nustatykite tikslius procentinius svorius arba perbalansuokite iki 100%.",
      "p1-xray": "Viršuje dešinėje 5 skirtukų rentgeno skydelis tikrina ETF sutapimą, ekspoziciją, Brinsono priskyrimą, pinigų srautus ir saugojimą.",
      "p1-calendar": "Po rentgeno spinduliu, Mėnesio kalendoriuje rodomas sausio–gruodžio mėn; grąžos nuoseklumas ir YTD sumos.",
      "p1-backtest": "Viso pločio apačioje Backtesting lygina jūsų portfelį su S&P 500, 60/40, All-Weather ir Min-Variance.",
      "p2-markowitz": "Pirmasis kvadrantas nubrėžia 2D Markowitz Efficient Frontier ir nustato jūsų portfelio pozicijas, palyginti su Min-Var ir Max-Sharpe.",
      "p2-tornado": "Apatiniame kairiajame kvadrante tikrinamos 5 istorinės krizės, 95 % VaR įnašas kiekvienam turtui ir fiksavimas iš aukštyn / žemyn.",
      "p2-corr": "Viršuje, dešinėje, 6 × 6 matrica lygina koreliacijas normaliomis sąlygomis su krizės uodegos užkrėtimu.",
      "p2-shock2d": "Apačioje dešinėje „Shock & Markov“ kerta palūkanų normų pokyčius su S&P 500 judesiais ir įvertina režimo pokyčius.",
      "p2-montecarlo": "Apatiniame skydelyje numatoma 10 000 Monte Carlo takų per P95, P50 ir P05, povandeninį nusileidimą ir riedėjimą Sharpe.",
      "p3-impact": "6 Poveikio kortelės lygina jūsų dabartinį portfelį su prognozuojama būsena po jūsų imituotų sandorių.",
      "p3-whatif": "Viršuje, kairėje, What-If ir Kelly imituoja bilietų pirkimą arba pardavimą ir apskaičiuoja optimalų Half-Kelly pozicijos dydį.",
      "p3-tailhedge": "Apačioje, kairėje, OTM Put & Margin imituoja apsauginius skydus ir stebi Reg-T priežiūros maržą.",
      "p3-committee": "Dviejuose dešiniuosiuose skydeliuose 3 ramsčių komitetas kartu su vykdymo žurnalu ir „Copilot“ tikrina rizikos apsauginius turėklus.",
      "p3-walkforward": "O apačioje esanti Walk-Forward diagrama patvirtina In-Sample ir Out-of-Sample našumą su WFE indeksu."
    }
  },
  "LV": {
    "ui": {
      "walkthrough": "Vizuāla tiešraide",
      "clickPlayPause": "Noklikšķiniet, lai atskaņotu vai apturētu (atstarpe)",
      "subtitles": "Subtitri (C)",
      "fullscreen": "Pilnekrāna režīms (F)",
      "exitFullscreen": "Iziet pilnekrāna režīmā (F vai Esc)",
      "portTabs": [
        "Celtnieks",
        "Risks",
        "Simulators",
        "Otrais pilots"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Valodas",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategorijas",
      "scr-pulse": "02 • 24h pulss",
      "scr-table": "03 • Tabula",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Siltuma karte",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Tehniski",
      "ana-compare": "03 • Salīdzināt %",
      "ana-micro": "04 • Mikro un plūsma",
      "ana-engines": "05 • 3D/2D dzinēji",
      "res-hero": "01 • Rezultāts un nostāja",
      "res-rag": "02 • RAG Tērzēšana",
      "res-factors": "03 • Faktori",
      "res-pulse24h": "04 • FinBERT impulss",
      "p1-pills": "01 • Kopsavilkums",
      "p1-table": "02 • Svēršana",
      "p1-xray": "03 • Rentgens",
      "p1-calendar": "04 • Kalendārs",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado un VaR",
      "p2-corr": "03 • Korelācija",
      "p2-shock2d": "04 • Šoks un Markovs",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Ietekme",
      "p3-whatif": "02 • What-If un Kellija",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Komiteja un žurnāls",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Laipni lūdzam Home ekrānā: jūsu sākumpunkts bez traucējumiem, kur tiek atšifrēti tirgi.",
      "home-header": "Header augšējā kreisajā stūrī, noklikšķinot uz ikonas λ, jūs vienmēr atgriezīsities šajā galvenajā posmā.",
      "home-markets": "Header augšdaļā atrodas Markets — jūsu darbstacija, lai tiešsaistē izpētītu visus 213 globālos īpašumus.",
      "home-portfolio": "Tieši blakus tai centrētajā izvēlnē ir Portfolio, lai izveidotu piešķīrumus, veiktu stresa testu un simulētu darījumus.",
      "home-system": "Apakšējā kreisajā stūrī Footer System atver serveru un datu bāzu reāllaika novērošanas monitoru.",
      "home-guide": "Blakus tam Guide atver šo interaktīvo soli pa solim sniegto rokasgrāmatu, kad vien tā ir nepieciešama.",
      "home-langs": "Apakšējā labajā stūrī valodas poga atver centrālo modālu, lai tulkotu platformu 56 valodās.",
      "home-palettes": "Un Palette atver 5 vizuālās lasīšanas tēmas, vienlaikus saglabājot finanšu zaļo un sarkano krāsu stingri neskartu.",
      "scr-categories": "Augšējā kategoriju joslā filtrējiet visus 213 līdzekļus, savu Watchlist vai 10 specializētos tirgus.",
      "scr-pulse": "4 pulsu 24 h kartes parāda apkopoto skaļumu, vidējo RSI, P-06 režīmu un lielākās skaļuma dislokācijas.",
      "scr-table": "Interaktīvajā tabulā ir tūlītēja meklēšana, izlase un viedās kolonnas, kas pielāgotas katrai līdzekļu klasei.",
      "scr-orbital": "Orbital skats kartē aktīvus trīs koncentriskos gredzenos pēc novirzes ar dzīvās puses pārbaudes paneli.",
      "scr-heatmap": "Heatmap sakārto 10 populārākos līdzekļus proporcionālos blokos 8 zaļās un sarkanās toņos.",
      "scr-maintools": "Un Main Tools trīs soļos ved uz suverēnām līknēm, 3D nepastāvību, FX krosu un nākotnes dzinējiem.",
      "ana-hero": "Header apvieno līdzekļu pārslēdzēju, 9 laika periodus no 1 min līdz VISIEM un 5 galvenos indikatorus.",
      "ana-technical": "Tehniskie objektīvi pārklāj SMA 20, VWAP un 2σ Bollingera joslas ar apakšējā skaļuma apstiprinājumu.",
      "ana-compare": "Izmantojot opciju Salīdzināt %, izmēriet neto procentuālo priekšrocību vai Alpha Spread no 0% salīdzinājumā ar saderīgu līdzinieku vai indeksu.",
      "ana-micro": "Micro & Flow nosaka skaļuma pieaugumu, izmantojot 20 d Z score, izkliedes likviditātes dislokāciju un P-06 anomālijas rādītāju.",
      "ana-engines": "Ceturtā cilne ir dinamisks ad-hoc rīks, kas atšķiras atkarībā no aktīvu klases: tā kā NVDA ir pamatkapitāls, tas atver 3D svārstīgumu un opciju izmaksu, savukārt obligācijas, FX un preces ievieš savus specializētos rīkus.",
      "res-hero": "Augšdaļā Score & Stance apkopo pamata spriedumu, svērto vērtējumu un virsraksta termometru.",
      "res-rag": "Kreisajā kolonnā RAG Document Chat atbild uz pārbaudītiem vaicājumiem, kas pamatoti ar oficiālajiem SEC 10-K un 10-Q dokumentiem.",
      "res-factors": "Vidējā kolonnā Factors akordeons pretstata 5 labākajiem vēršu dzinējiem un 5 labākajiem lāču riskiem.",
      "res-pulse24h": "Labajā pusē FinBERT Pulse iegūst aktuālus virsrakstus reāllaikā un zīmē 24 stundu noskaņojuma līkni.",
      "p1-pills": "6 kopsavilkuma kartītes pārrēķina reāllaika CAGR, Sharpe un Sortino, 95% VaR, Max Drawdown, alfa un dažādošanu.",
      "p1-table": "Svēruma tabulā pievienojiet jebkuru no 213 līdzekļiem, iestatiet precīzu procentuālo svaru vai līdzsvarojiet līdz 100%.",
      "p1-xray": "Augšējā labajā stūrī 5 cilņu rentgenstaru panelis pārbauda ETF pārklāšanos, ekspozīciju, Brinsona attiecinājumu, naudas plūsmu un glabāšanu.",
      "p1-calendar": "Zem rentgena attēla Mēneša kalendārs parāda atdeves konsekvenci no janvāra līdz decembrim un kopsummas YTD.",
      "p1-backtest": "Pilna platuma apakšā Backtesting salīdzina jūsu portfeli ar S&P 500, 60/40, All-Weather un Min-Variance.",
      "p2-markowitz": "Pirmajā kvadrantā ir attēlots 2D Markowitz Efficient Frontier un pozicionēts jūsu portfelis salīdzinājumā ar Min-Var un Max-Sharpe.",
      "p2-tornado": "Apakšējā kreisajā kvadrantā tiek pārbaudītas 5 vēsturiskās krīzes, 95% VaR ieguldījums uz katru līdzekli un augšupvērsta/negatīva uztveršana.",
      "p2-corr": "Augšējā labajā stūrī 6 × 6 Matrix salīdzina korelācijas normālos apstākļos ar krīzes astes izplatību.",
      "p2-shock2d": "Apakšējā labajā stūrī Shock & Markov šķērso procentu likmju izmaiņas ar S&P 500 kustībām un novērtē režīma pārejas.",
      "p2-montecarlo": "Apakšējais panelis paredz 10 000 Monte Carlo ceļu pāri P95, P50 un P05, zemūdens nolaišanu un ritošo Sharpe.",
      "p3-impact": "6 Ietekmes kartes salīdzina jūsu pašreizējo portfeli ar prognozēto stāvokli pēc simulētajiem darījumiem.",
      "p3-whatif": "Augšējā kreisajā pusē What-If un Kelly simulē biļešu pirkšanu vai pārdošanu un aprēķina optimālo Half-Kelly pozīcijas lielumu.",
      "p3-tailhedge": "Apakšējā kreisajā stūrī OTM Put & Margin simulē aizsardzības iespēju vairogus un uzrauga Reg-T apkopes rezervi.",
      "p3-committee": "Divos labajās paneļos 3 pīlāru komiteja revidē riska aizsargmargas kopā ar izpildes žurnālu un Copilot.",
      "p3-walkforward": "Un apakšā Walk-Forward diagramma apstiprina In-Sample un Out-of-Sample veiktspēju ar WFE indeksu."
    }
  },
  "ET": {
    "ui": {
      "walkthrough": "Visuaalne otseülekanne",
      "clickPlayPause": "Klõpsake esitamiseks või peatamiseks (tühik)",
      "subtitles": "Subtiitrid (C)",
      "fullscreen": "Täisekraan (F)",
      "exitFullscreen": "Välju täisekraanilt (F või Esc)",
      "portTabs": [
        "Ehitaja",
        "Risk",
        "Simulaator",
        "Kaaspiloot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Keeled",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategooriad",
      "scr-pulse": "02 • 24h pulss",
      "scr-table": "03 • Tabel",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Soojuskaart",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Tehniline",
      "ana-compare": "03 • Võrdle %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • 3D/2D mootorid",
      "res-hero": "01 • Skoor ja seisukoht",
      "res-rag": "02 • RAG Vestlus",
      "res-factors": "03 • tegurid",
      "res-pulse24h": "04 • FinBERT impulss",
      "p1-pills": "01 • Kokkuvõte",
      "p1-table": "02 • Kaalumine",
      "p1-xray": "03 • Röntgenikiirgus",
      "p1-calendar": "04 • Kalender",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornaado ja VaR",
      "p2-corr": "03 • Korrelatsioon",
      "p2-shock2d": "04 • Šokk ja Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Mõju",
      "p3-whatif": "02 • What-If ja Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Komitee ja logi",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Tere tulemast Home ekraanile: teie tähelepanu kõrvalejuhtimiseta alguspunkt, kus turud dekodeeritakse.",
      "home-header": "Header vasakus ülanurgas ikooni λ klõpsamine viib teid alati otse sellesse põhifaasi tagasi.",
      "home-markets": "Header ülaosas on Markets, teie tööjaam, kus saate reaalajas uurida kõiki 213 globaalset vara.",
      "home-portfolio": "Otse selle kõrval tsentreeritud menüüs on Portfolio, et luua jaotust, stressitesti riski ja simuleerida tehinguid.",
      "home-system": "All vasakus servas Footer avab System serverite ja andmebaaside reaalajas jälgitavuse monitori.",
      "home-guide": "Selle kõrval avab Guide selle interaktiivse samm-sammult käsiraamatu alati, kui seda vajate.",
      "home-langs": "Paremas alanurgas olev keelenupp avab keskel asuva modaali, et tõlkida platvorm 56 keelde.",
      "home-palettes": "Ja Palette avab 5 visuaalset lugemisteemat, säilitades samal ajal rahalise rohelise ja punase värvi.",
      "scr-categories": "Ülemisel kategooriate ribal filtreerige kõik 213 vara, oma Watchlist või 10 spetsialiseeritud turgu.",
      "scr-pulse": "4 Pulse 24h kaardid näitavad koondmahtu, keskmist RSI-d, P-06 režiimi ja suurimaid helitugevuse nihkeid.",
      "scr-table": "Interaktiivne tabel sisaldab kiirotsingut, lemmikuid ja nutikaid veerge, mis on kohandatud iga varaklassi jaoks.",
      "scr-orbital": "Vaade Orbital kaardistab varad kolme kontsentrilise rõnga vahel, kasutades hälbeid elava külje kontrollpaneeliga.",
      "scr-heatmap": "Heatmap korraldab 10 parimat vara proportsionaalseteks plokkideks 8 rohelise ja punase tooni vahel.",
      "scr-maintools": "Ja Main Tools juhatab teid kolmes etapis suveräänsete kõverate, 3D-volatiilsuse, FX-risti ja futuuride mootoriteni.",
      "ana-hero": "Header ühendab endas varade vahetaja, 9 ajavahemikku 1 minutist KÕIKI ja 5 põhiindikaatorit.",
      "ana-technical": "Tehnilised objektiivi ülekatted SMA 20, VWAP ja 2σ Bollingeri ribad koos põhja helitugevuse kinnitusega.",
      "ana-compare": "Võrdlemise % abil saate mõõta netoprotsenti või Alpha Spread-i 0%-st võrreldes ühilduva kaaslase või indeksiga.",
      "ana-micro": "Micro & Flow tuvastab mahu hüppeid 20d Z-skoori, hajutatud likviidsuse dislokatsiooni ja P-06 anomaalia skoori kaudu.",
      "ana-engines": "Neljas vahekaart on dünaamiline ad-hoc tööriist, mis varieerub olenevalt varaklassist: kuna NVDA on aktsia, avab see 3D volatiilsuse ja optsioonide väljamakse, samal ajal kui võlakirjad, valuutavahetus ja kaubad käivitavad oma spetsiaalsed tööriistad.",
      "res-hero": "Ülaosas on Score & Stance kokkuvõte põhiotsusest, kaalutud hinnangust ja pealkirja termomeetrist.",
      "res-rag": "Vasakpoolses veerus vastab RAG Document Chat kinnitatud päringutele, mis põhinevad ametlikel SEC 10-K ja 10-Q dokumentidel.",
      "res-factors": "Keskmises veerus vastandab Factorsi akordion 5 parimat härjajuhti ja 5 parimat karuriski.",
      "res-pulse24h": "Paremal kuvab FinBERT Pulse reaalajas murrangulisi pealkirju ja joonistab 24-tunnise meeleolukõvera.",
      "p1-pills": "Kuus kokkuvõttekaarti arvutavad ümber reaalajas CAGR, Sharpe ja Sortino, 95% VaR, Max Drawdown, alfa ja mitmekesistamise.",
      "p1-table": "Lisage tabelis Kaalud mis tahes 213 varast, määrake täpsed protsendikaalud või tasakaalustage 100%.",
      "p1-xray": "Paremal üleval 5-sakiga röntgenipaneel auditeerib ETF-i kattumist, kokkupuudet, Brinsoni omistamist, rahavoogusid ja hooldusõigust.",
      "p1-calendar": "Röntgenpildi all kuvab kuukalender jaanuarist detsembrini tootluse järjepidevust ja YTD kogusummasid.",
      "p1-backtest": "Täislaiuses alaosas võrdleb Backtesting teie portfelli mudelitega S&P 500, 60/40, All-Weather ja Min-Variance.",
      "p2-markowitz": "Esimene kvadrand joonistab 2D Markowitz Efficient Frontier ja positsioneerib teie portfelli Min-Var ja Max-Sharpe suhtes.",
      "p2-tornado": "Alumine vasak kvadrand testib 5 ajaloolist kriisi, 95% VaR panust vara kohta ja üles-/allapoole jäädvustamist.",
      "p2-corr": "Paremal üleval 6 × 6 Matrix võrdleb tavatingimustes korrelatsioone kriisisaba nakatumisega.",
      "p2-shock2d": "All paremal, Shock & Markov ristub intressimäära nihkega S&P 500 liigutustega ja hindab režiimi üleminekuid.",
      "p2-montecarlo": "Ja alumine paneel projitseerib 10 000 Monte Carlo rada läbi P95, P50 ja P05, veealuse väljatõmbe ja veereva Sharpe.",
      "p3-impact": "Kuus mõjukaarti võrdlevad teie praegust portfelli prognoositud olekuga pärast simuleeritud tehinguid.",
      "p3-whatif": "Vasakpoolses ülanurgas simuleerivad What-If ja Kelly piletite ostmist või müümist ning arvutavad välja optimaalse Half-Kelly positsiooni suuruse.",
      "p3-tailhedge": "Alt vasakul, OTM Put & Margin simuleerib kaitsevalikukilpe ja jälgib Reg-T hooldusvaru.",
      "p3-committee": "Kahes parempoolses paneelis auditeerib kolme sambaga komitee riskikaitsepiirdeid koos täitmislogi ja kopiloodiga.",
      "p3-walkforward": "Ja allosas on diagramm Walk-Forward, mis kinnitab In-Sample ja Out-of-Sample jõudlust indeksiga WFE."
    }
  },
  "GA": {
    "ui": {
      "walkthrough": "Siúlóid Amharc Beo",
      "clickPlayPause": "Cliceáil chun imirt nó sos (Space)",
      "subtitles": "Fotheidil (C)",
      "fullscreen": "Lánscáileán (F)",
      "exitFullscreen": "Scoir Lánscáileán (F nó Esc)",
      "portTabs": [
        "Tógálaí",
        "Riosca",
        "Insamhlóir",
        "Cóipchirt"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Teangacha",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Catagóirí",
      "scr-pulse": "02 • 24h Pulse",
      "scr-table": "03 • Tábla",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Léarscáil teasa",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Teicniúil",
      "ana-compare": "03 • Déan comparáid idir %",
      "ana-micro": "04 • Micrea & Sreabhadh",
      "ana-engines": "05 • Innill 3D/2D",
      "res-hero": "01 • Scór & Seasamh",
      "res-rag": "02 • Comhrá RAG",
      "res-factors": "03 • Fachtóirí",
      "res-pulse24h": "04 • FinBERT Pulse",
      "p1-pills": "01 • Achoimre",
      "p1-table": "02 • ualú",
      "p1-xray": "03 • X-gha",
      "p1-calendar": "04 • Féilire",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Comhghaol",
      "p2-shock2d": "04 • Turraing & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Tionchar",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Imeall",
      "p3-committee": "04 • Coiste & Loga",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Fáilte chuig an scáileán Home: do phointe tosaigh gan aon seachrán ina ndéantar margaí a dhíchódú.",
      "home-header": "Ag an gcúinne uachtarach ar chlé den Header, ach cliceáil ar an deilbhín λ beidh tú i gcónaí ar ais go dtí an phríomhchéim seo.",
      "home-markets": "Ag barr an Header tá Markets, do stáisiún oibre chun taighde a dhéanamh ar na 213 sócmhainn dhomhanda go léir beo.",
      "home-portfolio": "In aice leis sa roghchlár lárnaithe tá Portfolio, chun leithdháiltí a thógáil, riosca tástála struis, agus insamhail ceirdeanna.",
      "home-system": "Síos sa Footer ar chlé ag bun, osclaíonn System an monatóir inbhraite beo le haghaidh freastalaithe agus bunachair shonraí.",
      "home-guide": "In aice leis, osclaíonn Guide an lámhleabhar idirghníomhach céim ar chéim seo aon uair is gá duit é.",
      "home-langs": "Ag an gcúinne ag bun ar dheis, osclaíonn an cnaipe teanga an modh lárnaithe chun an t-ardán a aistriú go 56 teanga.",
      "home-palettes": "Agus osclaíonn Palette na 5 théama léitheoireachta amhairc agus é ag coinneáil glas agus dearg airgeadais go docht slán.",
      "scr-categories": "Sa bharra Catagóirí barr, scag trasna na 213 sócmhainn go léir, do Watchlist, nó 10 margadh speisialaithe.",
      "scr-pulse": "Léiríonn na 4 chárta Pulse 24h toirt comhiomlán, meán-RSI, réimeas P-06, agus díláithrithe toirte barr.",
      "scr-table": "Sa Tábla idirghníomhach tá cuardach meandarach, ceanáin, agus colúin chliste atá oiriúnaithe do gach aicme sócmhainne.",
      "scr-orbital": "Léarscáilíonn an radharc Orbital sócmhainní thar thrí fháinne comhlárnacha trí imeacht le painéal iniúchta taobh beo.",
      "scr-heatmap": "Socraíonn an Heatmap na 10 sócmhainn is fearr ina mbloic chomhréireacha thar 8 scáth glas agus dearg.",
      "scr-maintools": "Agus treoraíonn Main Tools tú i dtrí chéim chun cuair cheannasacha, luaineacht 3D, tras FX, agus innill todhchaíochtaí.",
      "ana-hero": "Comhcheanglaíonn an Header an lascóir sócmhainne, 9 bhfráma ama ó 1m go GACH, agus na 5 chroítháscairí.",
      "ana-technical": "Déanann an lionsa Teicniúil forleagan ar SMA 20, VWAP, agus 2σ Bandaí Bollinger le deimhniú toirte bun.",
      "ana-compare": "Le Déan comparáid idir %, tomhais buntáiste céatadáin glan nó Alpha Spread ó 0% i gcoinne piaraí nó innéacs comhoiriúnach.",
      "ana-micro": "Aimsíonn Micro & Flow spící toirte trí Scór 20d Z, díláithriú leachtachta scaipthe, agus scór aimhrialtacht P-06.",
      "ana-engines": "Is uirlis dinimiciúil ad-hoc é an ceathrú cluaisín a athraíonn de réir aicme sócmhainní: toisc gur cothromas é NVDA osclaíonn sé 3D Volatility & Options Payoff, agus seolann bannaí, FX, agus tráchtearraí a n-uirlisí speisialaithe féin.",
      "res-hero": "Ag an mbarr, déanann Score & Stance achoimre ar an bhfíorasc bunúsach, ar an rátáil ualaithe, agus ar an teirmiméadar ceannlíne.",
      "res-rag": "Sa cholún ar chlé, freagraíonn Comhrá Doiciméad RAG ceisteanna fíoraithe bunaithe ar chomhduithe oifigiúla CSS 10-K agus 10-Q.",
      "res-factors": "Sa cholún láir, cuireann an bosca ceoil Factors na 5 thiománaí tarbh is fearr i gcodarsnacht i gcoinne na 5 rioscaí is fearr iompróidh.",
      "res-pulse24h": "Ar dheis, scórálann FinBERT Pulse ceannlínte sáraithe i bhfíor-am agus ceapann sé an cuar meon 24 uair an chloig.",
      "p1-pills": "Ríomhann na 6 chárta Achoimre beo CAGR, Sharpe agus Sortino, 95% VaR, Max Drawdown, Alpha, agus éagsúlú.",
      "p1-table": "Sa tábla ualaithe, cuir aon cheann de na 213 sócmhainn, socraigh meáchain chéatadáin bheachta, nó athchothromaigh go 100%.",
      "p1-xray": "Ar dheis ón mbarr ar dheis, déanann an painéal X-Ray 5-cluaisín iniúchadh ar fhorluí an ETF, ar nochtadh, ar shannadh Brinson, ar shreabhadh airgid agus ar choimeád.",
      "p1-calendar": "Thíos X-Ray, taispeánann an Féilire Míosúil comhsheasmhacht tuairisceáin Eanáir go Nollaig agus iomláin YTD.",
      "p1-backtest": "Agus ag bun an lán-leithead, déanann Backtesting do phunann i gcomparáid leis an S&P 500, 60/40, All-Weather, agus Min-Variance.",
      "p2-markowitz": "Ceapann an chéad cheathrú an Teorainn Éifeachtúil 2D Markowitz agus suiteálann sé do phunann i gcoinne Min-Var agus Max-Sharpe.",
      "p2-tornado": "Déanann an ceathrú bun ar chlé tástáil ar 5 ghéarchéim stairiúla, ranníocaíocht VaR de 95% in aghaidh na sócmhainne, agus gabháil Buntáiste/Bun Taobh.",
      "p2-corr": "Ar dheis ar bharr, déanann an Maitrís 6×6 comparáid idir comhghaolta i ngnáthchoinníollacha agus gabháltas eireaball géarchéime.",
      "p2-shock2d": "Ag bun ar dheis, trasnaíonn Shock & Markov aistrithe ráta úis le bogann S&P 500 agus déanann sé meastachán ar aistrithe réimis.",
      "p2-montecarlo": "Agus tionscadail an phainéil bun 10,000 cosán Monte Carlo trasna P95, P50, agus P05, Tarraingt anuas faoi uisce, agus Sharpe rollta.",
      "p3-impact": "Déanann na 6 chárta Tionchair do phunann reatha a chur i gcomparáid leis an staid réamh-mheasta tar éis do cheirdeanna ionsamhlaithe.",
      "p3-whatif": "Insamhladh ar chlé, What-If & Kelly ticéid a cheannach nó a dhíol agus a ríomhann an méid suímh Half-Kelly is fearr.",
      "p3-tailhedge": "Ag bun ar chlé, samhlaíonn OTM Put & Margin sciatha roghanna cosanta agus déanann sé monatóireacht ar chorrlach cothabhála Reg-T.",
      "p3-committee": "Sa dá phainéal ar dheis, déanann an Coiste trí cholún iniúchadh ar ráillí cosanta riosca taobh leis an Loga Forghníomhaithe agus an Cóipióta.",
      "p3-walkforward": "Agus ag bun an leathanaigh, bailíochtaíonn an chairt Walk-Forward feidhmíocht In-Sample agus Out-of-Sample leis an innéacs WFE."
    }
  },
  "CA": {
    "ui": {
      "walkthrough": "Recorregut visual en directe",
      "clickPlayPause": "Feu clic per reproduir o posar en pausa (espai)",
      "subtitles": "Subtítols (C)",
      "fullscreen": "Pantalla completa (F)",
      "exitFullscreen": "Sortir de pantalla completa (F o Esc)",
      "portTabs": [
        "Constructor",
        "Risc",
        "Simulador",
        "Copilota"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Idiomes",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Categories",
      "scr-pulse": "02 • Pols 24h",
      "scr-table": "03 • Taula",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Mapa de calor",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Tècnic",
      "ana-compare": "03 • Comparar %",
      "ana-micro": "04 • Micro i flux",
      "ana-engines": "05 • Motors 3D/2D",
      "res-hero": "01 • Puntuació i postura",
      "res-rag": "02 • Xat RAG",
      "res-factors": "03 • Factors",
      "res-pulse24h": "04 • FinBERT Pols",
      "p1-pills": "01 • Resum",
      "p1-table": "02 • Ponderació",
      "p1-xray": "03 • Raigs X",
      "p1-calendar": "04 • Calendari",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado i VaR",
      "p2-corr": "03 • Correlació",
      "p2-shock2d": "04 • Xoc i Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Impacte",
      "p3-whatif": "02 • What-If i Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Comitè i Registre",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Benvingut a la pantalla Home: el vostre punt de partida sense distraccions on els mercats es descodifiquen.",
      "home-header": "A l'extrem superior esquerre de la Header, fent clic a la icona λ sempre us porta directament a aquesta etapa principal.",
      "home-markets": "Centrat a la part superior del Header hi ha Markets, la vostra estació de treball per investigar els 213 actius globals en directe.",
      "home-portfolio": "Just al costat, al menú centrat, hi ha Portfolio, per crear assignacions, risc de prova d'estrès i simular operacions.",
      "home-system": "A la part inferior esquerra Footer, System obre el monitor d'observabilitat en directe per a servidors i bases de dades.",
      "home-guide": "A més, Guide obre aquest manual interactiu pas a pas sempre que el necessiteu.",
      "home-langs": "A l'extrem inferior dret, el botó d'idioma obre el modal centrat per traduir la plataforma a 56 idiomes.",
      "home-palettes": "I Palette obre els 5 temes de lectura visual mentre manté el verd i el vermell financer estrictament intactes.",
      "scr-categories": "A la barra de Categories superior, filtreu els 213 actius, el vostre Watchlist o 10 mercats especialitzats.",
      "scr-pulse": "Les targetes 4 Pulse 24h mostren volum agregat, RSI mitjà, règim P-06 i dislocacions de volum superior.",
      "scr-table": "La taula interactiva inclou cerques instantànies, preferits i columnes intel·ligents adaptades a cada classe d'actius.",
      "scr-orbital": "La vista Orbital mapeja els actius a través de tres anells concèntrics per desviació amb un panell d'inspecció lateral en directe.",
      "scr-heatmap": "El mapa de calor organitza els 10 actius principals en blocs proporcionals en 8 tons de verd i vermell.",
      "scr-maintools": "I Main Tools us guia en tres passos cap a les corbes sobiranes, la volatilitat 3D, l'encreuament de divises i els motors de futurs.",
      "ana-hero": "El Header combina el commutador d'actius, 9 períodes de temps des d'1 m fins a TOTS i els 5 indicadors bàsics.",
      "ana-technical": "La lent tècnica superposa les bandes de Bollinger SMA 20, VWAP i 2σ amb confirmació de volum inferior.",
      "ana-compare": "Amb Comparar %, mesura el percentatge d'avantatge net o Alpha Spread des del 0% en comparació amb un parell o índex compatible.",
      "ana-micro": "Micro & Flow detecta pics de volum a través de la puntuació Z de 20 d, la dislocació de la liquiditat distribuïda i la puntuació d'anomalia P-06.",
      "ana-engines": "La quarta pestanya és una eina ad-hoc dinàmica que varia segons la classe d'actius: com que NVDA és una renda variable, obre el pagament de la volatilitat i les opcions 3D, mentre que els bons, els divises i les mercaderies llancen les seves pròpies eines especialitzades.",
      "res-hero": "A la part superior, Score & Stance resumeix el veredicte fonamental, la qualificació ponderada i el termòmetre de titular.",
      "res-rag": "A la columna de l'esquerra, RAG Document Chat respon a les consultes verificades basades en els documents oficials de SEC 10-K i 10-Q.",
      "res-factors": "A la columna central, l'acordió Factors contrasta els 5 millors toros amb els 5 principals riscos de suport.",
      "res-pulse24h": "A la dreta, FinBERT Pulse puntua els titulars en temps real i dibuixa la corba de sentiment de 24 hores.",
      "p1-pills": "Les 6 targetes de resum tornen a calcular CAGR, Sharpe i Sortino en directe, 95% VaR, Max Drawdown, Alpha i diversificació.",
      "p1-table": "A la taula de ponderació, afegiu qualsevol dels 213 actius, establiu ponderacions percentuals exactes o reequilibreu al 100%.",
      "p1-xray": "A la part superior dreta, el panell de raigs X de 5 pestanyes audita la superposició d'ETF, l'exposició, l'atribució de Brinson, el flux de caixa i la custòdia.",
      "p1-calendar": "A sota de X-Ray, el calendari mensual mostra la coherència dels retorns de gener a desembre i els totals YTD.",
      "p1-backtest": "I a la part inferior d'amplada completa, Backtesting compara la vostra cartera amb la S&P 500, 60/40, All-Weather i Min-Variance.",
      "p2-markowitz": "El primer quadrant representa la frontera eficient Markowitz 2D i posiciona la vostra cartera en comparació amb Min-Var i Max-Sharpe.",
      "p2-tornado": "El quadrant inferior esquerre posa a prova 5 crisis històriques, la contribució VaR del 95% per actiu i la captura al revés/a la baixa.",
      "p2-corr": "A la part superior dreta, la matriu 6×6 compara les correlacions en condicions normals amb el contagi de la cua de la crisi.",
      "p2-shock2d": "A la part inferior dreta, Shock & Markov creua els canvis de tipus d'interès amb els moviments de S&P 500 i estima les transicions del règim.",
      "p2-montecarlo": "I el panell inferior projecta 10.000 camins Monte Carlo a través de P95, P50 i P05, Drawdown sota l'aigua i Sharpe rodant.",
      "p3-impact": "Les 6 targetes d'impacte comparen la vostra cartera actual amb l'estat previst després de les vostres operacions simulades.",
      "p3-whatif": "A la part superior esquerra, What-If i Kelly simulen la compra o venda d'entrades i calcula la mida òptima de la posició Half-Kelly.",
      "p3-tailhedge": "A la part inferior esquerra, OTM Put & Margin simula escuts d'opcions de protecció i supervisa el marge de manteniment Reg-T.",
      "p3-committee": "Als dos panells de la dreta, el Comitè de 3 pilars audita les baranes de risc juntament amb el Registre d'execució i el Copilot.",
      "p3-walkforward": "I a la part inferior, el gràfic Walk-Forward valida el rendiment In-Sample i Out-of-Sample amb l'índex WFE."
    }
  },
  "EU": {
    "ui": {
      "walkthrough": "Zuzeneko Ikusizko Ibilbidea",
      "clickPlayPause": "Egin klik erreproduzitzeko edo pausatzeko (Zunea)",
      "subtitles": "Azpitituluak (C)",
      "fullscreen": "Pantaila osoa (F)",
      "exitFullscreen": "Irten pantaila osotik (F edo Esc)",
      "portTabs": [
        "Eraikitzailea",
        "Arriskua",
        "Simulagailua",
        "Kopilota"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Hizkuntzak",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategoriak",
      "scr-pulse": "02 • 24h Pultsua",
      "scr-table": "03 • Taula",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Bero-mapa",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Teknikoa",
      "ana-compare": "03 • Konparatu %",
      "ana-micro": "04 • Mikro eta Fluxua",
      "ana-engines": "05 • 3D/2D Motorrak",
      "res-hero": "01 • Puntuazioa eta jarrera",
      "res-rag": "02 • RAG Txata",
      "res-factors": "03 • Faktoreak",
      "res-pulse24h": "04 • FinBERT Pultsua",
      "p1-pills": "01 • Laburpena",
      "p1-table": "02 • Ponderazioa",
      "p1-xray": "03 • X izpiak",
      "p1-calendar": "04 • Egutegia",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado eta VaR",
      "p2-corr": "03 • Korrelazioa",
      "p2-shock2d": "04 • Shock eta Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Eragina",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Batzordea eta erregistroa",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Ongi etorri Home pantailara: zure distrakziorik gabeko abiapuntua non merkatuak deskodetzen diren.",
      "home-header": "Header-ren goiko ezkerreko izkinan, λ ikonoa sakatzean, beti itzuliko zara etapa nagusi honetara.",
      "home-markets": "Headerren goialdean zentratuta Markets dago, 213 aktibo global guztiak zuzenean ikertzeko zure lantokia.",
      "home-portfolio": "Zentratutako menuan ondoan dago Portfolio, esleipenak eraikitzeko, estres-probaren arriskua eta merkataritzak simulatzeko.",
      "home-system": "Beheko ezkerreko Footer-k, System-k zerbitzarien eta datu-baseen zuzeneko behagarritasun-monitorea irekitzen du.",
      "home-guide": "Haren ondoan, Guide-k urratsez urrats eskuliburu interaktibo hau irekitzen du behar duzun bakoitzean.",
      "home-langs": "Behe-eskuineko izkinan, hizkuntza-botoiak zentratutako modala irekitzen du plataforma 56 hizkuntzatara itzultzeko.",
      "home-palettes": "Eta Palette-k ikusmenezko irakurketa-gaiak irekitzen ditu, finantza berdea eta gorria osorik mantenduz.",
      "scr-categories": "Goiko Kategorien barran, iragazi 213 aktibo guztietan, zure Watchlist edo 10 merkatu espezializatuetan.",
      "scr-pulse": "4 Pulse 24h txartelek bolumen agregatua, batez besteko RSI, P-06 erregimena eta bolumen goreneko dislokazioak erakusten dituzte.",
      "scr-table": "Taula interaktiboak berehalako bilaketa, gogokoenak eta zutabe adimendunak eskaintzen ditu aktibo-klase bakoitzari egokitutako.",
      "scr-orbital": "Orbital ikuspegiak hiru eraztun zentrokideen bidez mapatzen ditu aktiboak desbiderapenaren arabera, zuzeneko alboko ikuskapen-panel batekin.",
      "scr-heatmap": "Bero-mapak 10 aktibo nagusiak bloke proportzionaletan antolatzen ditu 8 tonu berde eta gorritan.",
      "scr-maintools": "Eta Main Tools-k hiru urratsetan gidatzen zaitu kurba subiranoetara, 3D hegazkortasuna, FX gurutzea eta etorkizuneko motorretara.",
      "ana-hero": "Header-k aktiboen aldatzailea, 1m-tik ALL-era 9 denbora-tarte eta 5 oinarrizko adierazleak konbinatzen ditu.",
      "ana-technical": "Lente teknikoak SMA 20, VWAP eta 2σ Bollinger Bandak gainjartzen ditu beheko bolumenaren berrespenarekin.",
      "ana-compare": "Konparatu %-arekin, neurtu ehuneko abantaila garbia edo Alpha Spread % 0tik pareko edo indize bateragarri baten aldean.",
      "ana-micro": "Micro & Flow-ek bolumen-pikak detektatzen ditu 20d Z-Score-ren bidez, hedatu likidezia dislokazioaren bidez eta P-06 anomaliaren puntuazioaren bidez.",
      "ana-engines": "Laugarren fitxa aktiboen klasearen arabera aldatzen den ad-hoc tresna dinamikoa da: NVDA akzio bat denez, 3D Lurrunkortasuna eta Aukerak ordaintzea irekitzen du, bonuek, FXek eta salgaiek beren tresna espezializatuak abiarazten dituzten bitartean.",
      "res-hero": "Goialdean, Score & Stance-k oinarrizko epaia, balorazio haztatua eta goiburuko termometroa laburbiltzen ditu.",
      "res-rag": "Ezkerreko zutabean, RAG Document Chat-ek SEC 10-K eta 10-Q artxibo ofizialetan oinarritutako egiaztatutako galderei erantzuten die.",
      "res-factors": "Erdiko zutabean, Faktoreak akordeoiak 5 zezen-gidari nagusiak kontrastatu ditu 5 bear-arrisku nagusiekin.",
      "res-pulse24h": "Eskuinean, FinBERT Pulse-k titularrak hausten ditu denbora errealean eta 24 orduko sentimendu-kurba markatzen du.",
      "p1-pills": "6 Laburpen txartelek zuzeneko CAGR, Sharpe eta Sortino, % 95 VaR, Max Drawdown, Alpha eta dibertsifikazioa birkalkulatzen dituzte.",
      "p1-table": "Ponderazio-taulan, gehitu 213 aktiboetako edozein, ezarri portzentajeen pisu zehatzak edo orekatu % 100ean.",
      "p1-xray": "Goiko eskuinaldean, 5 fitxako X-Ray panelak ETF gainjartzea, esposizioa, Brinson-en atribuzioa, diru-fluxua eta zaintza ikuskatzen ditu.",
      "p1-calendar": "X Izpien azpian, Hileroko Egutegiak urtarriletik abendura arteko itzuleraren koherentzia eta YTD guztirakoak erakusten ditu.",
      "p1-backtest": "Eta zabalera osoko behealdean, Backtesting-k zure zorroa S&P 500, 60/40, All-Weather eta Min-Variance-ekin alderatzen du.",
      "p2-markowitz": "Lehenengo koadranteak 2D Markowitz Efficient Frontier marrazten du eta zure zorroa Min-Var eta Max-Sharperen aldean kokatzen du.",
      "p2-tornado": "Beheko ezkerreko koadranteak 5 krisi historiko probatzen ditu, aktibo bakoitzeko % 95 VaR ekarpena eta Gora/Behera harrapatzea.",
      "p2-corr": "Goi-eskuinean, 6×6 Matrix-ek baldintza normaletako korrelazioak alderatzen ditu krisi-buztanaren kutsadurarekin.",
      "p2-shock2d": "Beheko eskuinaldean, Shock & Markov-ek interes-tasaren aldaketak zeharkatzen ditu S&P 500 mugimenduekin eta erregimen-trantsizioak estimatzen ditu.",
      "p2-montecarlo": "Eta beheko panelak 10.000 Monte Carlo bide proiektatzen ditu P95, P50 eta P05, urpeko Drawdown eta Sharpe zeharkatuz.",
      "p3-impact": "6 Eragin-txartelek zure egungo zorroa simulatutako merkataritzaren ondoren proiektatutako egoerarekin alderatzen dute.",
      "p3-whatif": "Goiko ezkerrean, What-If & Kelly-k txartelak erostea edo saltzea simulatzen du eta Half-Kelly posizioaren tamaina optimoa kalkulatzen du.",
      "p3-tailhedge": "Beheko ezkerrean, OTM Put & Margin-ek babes-aukera ezkutuak simulatzen ditu eta Reg-T mantentze-marjina kontrolatzen du.",
      "p3-committee": "Eskuineko bi paneletan, 3 zutabeko Batzordeak arrisku-barandak ikuskatzen ditu Exekuzio-egunkariarekin eta kopiloarekin batera.",
      "p3-walkforward": "Eta behealdean, Walk-Forward grafikoak In-Sample eta Out-of-Sample errendimendua baliozkotzen du WFE indizearekin."
    }
  },
  "GL": {
    "ui": {
      "walkthrough": "Paseo visual en directo",
      "clickPlayPause": "Fai clic para reproducir ou pausar (espazo)",
      "subtitles": "Subtítulos (C)",
      "fullscreen": "Pantalla completa (F)",
      "exitFullscreen": "Saír da pantalla completa (F ou Esc)",
      "portTabs": [
        "Construtor",
        "Risco",
        "Simulador",
        "Copiloto"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Linguas",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Categorías",
      "scr-pulse": "02 • Pulso 24h",
      "scr-table": "03 • Táboa",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Mapa de calor",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Técnico",
      "ana-compare": "03 • Comparar %",
      "ana-micro": "04 • Micro e fluxo",
      "ana-engines": "05 • Motores 3D/2D",
      "res-hero": "01 • Puntuación e postura",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • Factores",
      "res-pulse24h": "04 • FinBERT Pulso",
      "p1-pills": "01 • Resumo",
      "p1-table": "02 • Ponderación",
      "p1-xray": "03 • Raios X",
      "p1-calendar": "04 • Calendario",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado e VaR",
      "p2-corr": "03 • Correlación",
      "p2-shock2d": "04 • Shock e Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Impacto",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Comité e rexistro",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Benvido á pantalla Home: o teu punto de partida sen distraccións onde se descodifican os mercados.",
      "home-header": "Na esquina superior esquerda do Header, ao facer clic na icona λ sempre volve a esta etapa principal.",
      "home-markets": "Centrado na parte superior do Header está Markets, a túa estación de traballo para investigar en directo os 213 activos globais.",
      "home-portfolio": "Xusto ao seu carón, no menú centrado, está Portfolio, para crear asignacións, probas de risco e simular operacións.",
      "home-system": "Abaixo na parte inferior esquerda Footer, System abre o monitor de observabilidade en directo para servidores e bases de datos.",
      "home-guide": "Ademais, Guide abre este manual interactivo paso a paso sempre que o necesites.",
      "home-langs": "Na esquina inferior dereita, o botón de idioma abre o modal centrado para traducir a plataforma a 56 idiomas.",
      "home-palettes": "E Palette abre os 5 temas de lectura visual mantendo o verde financeiro e o vermello estritamente intactos.",
      "scr-categories": "Na barra superior Categorías, filtra polos 213 activos, o teu Watchlist ou 10 mercados especializados.",
      "scr-pulse": "As tarxetas 4 Pulse 24h mostran volume agregado, RSI medio, réxime P-06 e dislocacións de volume superior.",
      "scr-table": "A táboa interactiva presenta busca instantánea, favoritos e columnas intelixentes adaptadas a cada clase de activo.",
      "scr-orbital": "A vista Orbital mapea os activos a través de tres aneis concéntricos por desviación cun panel de inspección lateral activo.",
      "scr-heatmap": "O mapa de calor organiza os 10 principais recursos en bloques proporcionais en 8 tons de verde e vermello.",
      "scr-maintools": "E Main Tools guíache en tres pasos cara a curvas soberanas, volatilidade 3D, cruce de divisas e motores de futuros.",
      "ana-hero": "O Header combina o cambiador de activos, 9 períodos de tempo de 1m a TODOS e os 5 indicadores básicos.",
      "ana-technical": "A lente técnica superpón as bandas SMA 20, VWAP e 2σ Bollinger con confirmación de volume inferior.",
      "ana-compare": "Con Comparar %, mide a vantaxe porcentual neta ou Alpha Spread a partir do 0 % fronte a un índice ou pares compatibles.",
      "ana-micro": "Micro & Flow detecta picos de volume a través de 20d Z-Score, dislocación de liquidez espallada e puntuación de anomalía P-06.",
      "ana-engines": "A cuarta pestana é unha ferramenta ad-hoc dinámica que varía segundo a clase de activos: debido a que NVDA é unha acción, abre 3D Volatility & Options Payoff, mentres que os bonos, FX e commodities lanzan as súas propias ferramentas especializadas.",
      "res-hero": "Na parte superior, Score & Stance resume o veredicto fundamental, a valoración ponderada e o termómetro de titular.",
      "res-rag": "Na columna da esquerda, RAG Document Chat responde a consultas verificadas baseadas nos arquivos oficiais SEC 10-K e 10-Q.",
      "res-factors": "Na columna central, o acordeón Factors contrasta os 5 principais toureiros contra os 5 principais riscos.",
      "res-pulse24h": "Á dereita, FinBERT Pulse marca titulares en tempo real e traza a curva de sentimento de 24 horas.",
      "p1-pills": "As 6 tarxetas de resumo recalculan CAGR, Sharpe e Sortino en directo, 95 % VaR, Max Drawdown, Alpha e diversificación.",
      "p1-table": "Na táboa de ponderación, engade calquera dos 213 activos, establece ponderacións porcentuais exactas ou reequilibra ao 100 %.",
      "p1-xray": "Na parte superior dereita, o panel de raios X de 5 pestanas verifica a superposición de ETF, a exposición, a atribución de Brinson, o fluxo de caixa e a custodia.",
      "p1-calendar": "Debaixo de X-Ray, o calendario mensual mostra a coherencia das devolucións de xaneiro a decembro e os totais do YTD.",
      "p1-backtest": "E na parte inferior de ancho completo, Backtesting compara a túa carteira con S&P 500, 60/40, All-Weather e Min-Variance.",
      "p2-markowitz": "O primeiro cuadrante representa a fronteira eficiente 2D Markowitz e sitúa a súa carteira fronte a Min-Var e Max-Sharpe.",
      "p2-tornado": "O cuadrante inferior esquerdo proba 5 crises históricas, a contribución VaR do 95 % por activo e a captura ao revés/descenso.",
      "p2-corr": "Arriba á dereita, o 6×6 Matrix compara correlacións en condicións normais co contaxio de cola de crise.",
      "p2-shock2d": "Abaixo á dereita, Shock & Markov cruza os cambios de tipos de interese cos movementos de S&P 500 e estima as transicións de réxime.",
      "p2-montecarlo": "E o panel inferior proxecta 10.000 camiños Monte Carlo en P95, P50 e P05, Drawdown submarino e Sharpe rodando.",
      "p3-impact": "As 6 tarxetas de impacto comparan a túa carteira actual co estado proxectado despois das túas operacións simuladas.",
      "p3-whatif": "Arriba á esquerda, What-If e Kelly simulan a compra ou a venda de entradas e calcula o tamaño de posición óptimo de Half-Kelly.",
      "p3-tailhedge": "Na parte inferior esquerda, OTM Put & Margin simula os escudos de opcións protectoras e supervisa a marxe de mantemento Reg-T.",
      "p3-committee": "Nos dous paneis da dereita, o Comité de 3 piares audita as barandillas de risco xunto co Rexistro de Execución e o Copiloto.",
      "p3-walkforward": "E na parte inferior, o gráfico Walk-Forward valida o rendemento de In-Sample e Out-of-Sample co índice WFE."
    }
  },
  "AR": {
    "ui": {
      "walkthrough": "تجول مرئي مباشر",
      "clickPlayPause": "انقر للتشغيل أو الإيقاف المؤقت (مسافة)",
      "subtitles": "الترجمة (ج)",
      "fullscreen": "ملء الشاشة (و)",
      "exitFullscreen": "الخروج من وضع ملء الشاشة (F أو Esc)",
      "portTabs": [
        "منشئ",
        "خطر",
        "محاكي",
        "مساعد الطيار"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (×)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • اللغات",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • الفئات",
      "scr-pulse": "02 • نبض 24 ساعة",
      "scr-table": "03 • الجدول",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • خريطة الحرارة",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • التقنية",
      "ana-compare": "03 • قارن %",
      "ana-micro": "04 • مايكرو والتدفق",
      "ana-engines": "05 • محركات ثلاثية الأبعاد/ثنائية الأبعاد",
      "res-hero": "01 • النتيجة والموقف",
      "res-rag": "02 • دردشة RAG",
      "res-factors": "03 • العوامل",
      "res-pulse24h": "04 • نبض FinBERT",
      "p1-pills": "01 • ملخص",
      "p1-table": "02 • الترجيح",
      "p1-xray": "03 • الأشعة السينية",
      "p1-calendar": "04 • التقويم",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • تورنادو و VaR",
      "p2-corr": "03 • الارتباط",
      "p2-shock2d": "04 • صدمة وماركوف",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • تأثير",
      "p3-whatif": "02 • What-If وكيلي",
      "p3-tailhedge": "03 • OTM وضع والهامش",
      "p3-committee": "04 • اللجنة والسجل",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "مرحبًا بك في شاشة Home: نقطة البداية الخالية من التشتيت حيث يتم فك تشفير الأسواق.",
      "home-header": "في الزاوية العلوية اليسرى من Header، يؤدي النقر فوق أيقونة α دائمًا إلى العودة إلى هذه المرحلة الرئيسية.",
      "home-markets": "في الجزء العلوي من Header توجد Markets، وهي محطة العمل الخاصة بك للبحث المباشر عن جميع الأصول العالمية البالغ عددها 213.",
      "home-portfolio": "بجوارها مباشرة في القائمة المركزية يوجد Portfolio، لإنشاء التخصيصات واختبار الضغط على المخاطر ومحاكاة الصفقات.",
      "home-system": "في أسفل يسار Footer، يفتح System مراقب إمكانية المراقبة المباشرة للخوادم وقواعد البيانات.",
      "home-guide": "وبجانبه، يفتح Guide هذا الدليل التفاعلي خطوة بخطوة عندما تحتاج إليه.",
      "home-langs": "في الزاوية اليمنى السفلية، يفتح زر اللغة النموذج المركزي لترجمة النظام الأساسي إلى 56 لغة.",
      "home-palettes": "ويفتح Palette موضوعات القراءة المرئية الخمسة مع الحفاظ على سلامة اللونين الأخضر والأحمر الماليين تمامًا.",
      "scr-categories": "في شريط الفئات العلوي، قم بالتصفية عبر جميع الأصول البالغ عددها 213، أو Watchlist، أو 10 أسواق متخصصة.",
      "scr-pulse": "تعرض بطاقات Pulse 24h الأربعة الحجم الإجمالي، ومتوسط ​​مؤشر القوة النسبية (RSI)، ونظام P-06، وإزاحات الحجم العلوي.",
      "scr-table": "يتميز الجدول التفاعلي بالبحث الفوري والمفضلات والأعمدة الذكية المصممة خصيصًا لكل فئة من فئات الأصول.",
      "scr-orbital": "تقوم طريقة العرض Orbital بتعيين الأصول عبر ثلاث حلقات متحدة المركز عن طريق الانحراف باستخدام لوحة فحص جانبية مباشرة.",
      "scr-heatmap": "تقوم الخريطة الحرارية بترتيب الأصول العشرة الأولى في كتل متناسبة عبر 8 ظلال من اللون الأخضر والأحمر.",
      "scr-maintools": "ويرشدك Main Tools في ثلاث خطوات إلى المنحنيات السيادية، والتقلبات ثلاثية الأبعاد، وتقاطع العملات الأجنبية، ومحركات العقود الآجلة.",
      "ana-hero": "يجمع Header بين أداة تبديل الأصول و9 أطر زمنية من دقيقة واحدة إلى الكل و5 مؤشرات أساسية.",
      "ana-technical": "تغطي العدسة التقنية SMA 20 وVWAP و2σ Bollinger Bands مع تأكيد الحجم السفلي.",
      "ana-compare": "باستخدام مقارنة %، قم بقياس صافي ميزة النسبة المئوية أو Alpha Spread من 0% مقابل نظير أو فهرس متوافق.",
      "ana-micro": "يكتشف Micro & Flow ارتفاعات الحجم عبر 20d Z-Score، واختلال السيولة المنتشرة، ودرجة الشذوذ P-06.",
      "ana-engines": "علامة التبويب الرابعة عبارة عن أداة ديناميكية مخصصة تختلف حسب فئة الأصول: نظرًا لأن NVDA عبارة عن أسهم، فإنها تفتح 3D Volatility & Options Payoff، بينما تطلق السندات والعملات الأجنبية والسلع أدواتها المتخصصة الخاصة.",
      "res-hero": "في الجزء العلوي، يلخص \"النتيجة والموقف\" الحكم الأساسي والتقييم المرجح ومقياس الحرارة الرئيسي.",
      "res-rag": "في العمود الأيسر، تجيب RAG Document Chat على الاستفسارات التي تم التحقق منها والتي تستند إلى ملفات 10-K و10-Q الرسمية الصادرة عن لجنة الأوراق المالية والبورصة.",
      "res-factors": "في العمود الأوسط، يقارن مؤشر العوامل بين أفضل 5 محركات صعودية مقابل أعلى 5 مخاطر تحمل.",
      "res-pulse24h": "على اليمين، يسجل FinBERT Pulse عناوين الأخبار العاجلة في الوقت الفعلي ويرسم منحنى المشاعر على مدار 24 ساعة.",
      "p1-pills": "تعيد البطاقات التلخيصية الست حساب CAGR وSharpe وSortino و95% VaR وMax Drawdown وAlpha والتنويع.",
      "p1-table": "في جدول الترجيح، أضف أيًا من الأصول البالغ عددها 213، وقم بتعيين نسبة الترجيح الدقيقة، أو أعد التوازن إلى 100%.",
      "p1-xray": "في أعلى اليمين، تقوم لوحة X-Ray المكونة من 5 علامات تبويب بمراجعة تداخل صناديق الاستثمار المتداولة، والتعرض، وإسناد برينسون، والتدفق النقدي، والحضانة.",
      "p1-calendar": "أسفل X-Ray، يعرض التقويم الشهري تناسق العائدات من يناير إلى ديسمبر وإجماليات منذ بداية العام.",
      "p1-backtest": "وفي الجزء السفلي ذو العرض الكامل، يقوم Backtesting بمقارنة محفظتك مع S&P 500، و60/40، وAll-Weather، وMin-Variance.",
      "p2-markowitz": "يرسم الربع الأول الحدود الفعالة Markowitz ثنائية الأبعاد ويضع محفظتك في مقابل Min-Var وMax-Sharpe.",
      "p2-tornado": "يختبر الربع السفلي الأيسر 5 أزمات تاريخية، ومساهمة VaR لكل أصل بنسبة 95%، والتقاط الاتجاه الصعودي/السلبي.",
      "p2-corr": "في أعلى اليمين، تقارن المصفوفة 6 × 6 الارتباطات في الظروف العادية مع عدوى ذيل الأزمة.",
      "p2-shock2d": "في أسفل اليمين، يعبر Shock & Markov تحولات أسعار الفائدة مع تحركات S&P 500 ويقدر تحولات النظام.",
      "p2-montecarlo": "وتعرض اللوحة السفلية 10000 مسار Monte Carlo عبر P95، وP50، وP05، والسحب تحت الماء، وSharpe المتدحرج.",
      "p3-impact": "تقوم بطاقات التأثير الستة بمقارنة محفظتك الحالية بالحالة المتوقعة بعد عمليات المحاكاة الخاصة بك.",
      "p3-whatif": "في أعلى اليسار، يحاكي What-If & Kelly شراء التذاكر أو بيعها ويحسب حجم موضع Half-Kelly الأمثل.",
      "p3-tailhedge": "في أسفل اليسار، يحاكي وضع وهامش OTM دروع خيارات الحماية ويراقب هامش صيانة Reg-T.",
      "p3-committee": "في اللوحتين الأيمنتين، تقوم اللجنة المكونة من 3 ركائز بمراجعة حواجز الحماية من المخاطر جنبًا إلى جنب مع سجل التنفيذ ومساعد الطيار.",
      "p3-walkforward": "وفي الجزء السفلي، يتحقق مخطط Walk-Forward من صحة أداء In-Sample وOut-of-Sample باستخدام مؤشر WFE."
    }
  },
  "HE": {
    "ui": {
      "walkthrough": "הדרכה חזותית חיה",
      "clickPlayPause": "לחץ כדי לשחק או להשהות (רווח)",
      "subtitles": "כתוביות (C)",
      "fullscreen": "מסך מלא (F)",
      "exitFullscreen": "צא ממסך מלא (F או Esc)",
      "portTabs": [
        "בונה",
        "סיכון",
        "סימולטור",
        "טייס משנה"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • שפות",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • קטגוריות",
      "scr-pulse": "02 • דופק 24 שעות",
      "scr-table": "03 • שולחן",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • מפת חום",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • טכני",
      "ana-compare": "03 • השווה %",
      "ana-micro": "04 • Micro & Flow",
      "ana-engines": "05 • מנועי 3D/2D",
      "res-hero": "01 • ניקוד ועמדה",
      "res-rag": "02 • צ'אט RAG",
      "res-factors": "03 • גורמים",
      "res-pulse24h": "04 • FinBERT דופק",
      "p1-pills": "01 • סיכום",
      "p1-table": "02 • שקלול",
      "p1-xray": "03 • רנטגן",
      "p1-calendar": "04 • לוח שנה",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • טורנדו ו-VaR",
      "p2-corr": "03 • מתאם",
      "p2-shock2d": "04 • הלם ומרקוב",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • השפעה",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • ועדה ויומן",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "ברוכים הבאים למסך Home: נקודת ההתחלה נטולת הסחות דעת שבה השווקים מפוענחים.",
      "home-header": "בפינה השמאלית העליונה של Header, לחיצה על הסמל λ תמיד מחזירה אותך ישר לשלב הראשי הזה.",
      "home-markets": "במרכז ה-Header נמצאת Markets, תחנת העבודה שלך לחקור את כל 213 הנכסים העולמיים בזמן אמת.",
      "home-portfolio": "ממש לידו בתפריט הממורכז נמצא Portfolio, לבניית הקצאות, בדיקת סיכון ומדמיית עסקאות.",
      "home-system": "למטה בפינה השמאלית התחתונה Footer, System פותח את מוניטור הצפייה החיה עבור שרתים ומסדי נתונים.",
      "home-guide": "לצדו, Guide פותח את המדריך האינטראקטיבי הזה שלב אחר שלב בכל פעם שתזדקק לו.",
      "home-langs": "בפינה השמאלית התחתונה, כפתור השפה פותח את המודאל הממורכז כדי לתרגם את הפלטפורמה ל-56 שפות.",
      "home-palettes": "ו-Palette פותח את 5 ערכות נושא הקריאה החזותיות תוך שמירה על הירוק והאדום הפיננסי ללא פגע.",
      "scr-categories": "בסרגל הקטגוריות העליון, סנן על פני כל 213 הנכסים, ה-Watchlist שלך או 10 שווקים מיוחדים.",
      "scr-pulse": "הכרטיסים 4 Pulse 24h מציגים נפח מצטבר, RSI ממוצע, משטר P-06 ונקעים בנפח העליון.",
      "scr-table": "הטבלה האינטראקטיבית כוללת חיפוש מיידי, מועדפים ועמודות חכמות המותאמות לכל סוג נכס.",
      "scr-orbital": "התצוגה Orbital ממפה נכסים על פני שלוש טבעות קונצנטריות על ידי סטייה עם לוח בדיקה חי.",
      "scr-heatmap": "מפת החום מסדרת את 10 הנכסים המובילים בלוקים פרופורציונליים על פני 8 גוונים של ירוק ואדום.",
      "scr-maintools": "ו-Main Tools מנחה אותך בשלושה שלבים לעקומות ריבוניות, תנודתיות תלת-ממדית, FX Cross ומנועים עתידיים.",
      "ana-hero": "ה-Header משלב את מחליף הנכסים, 9 מסגרות זמן מ-1m עד ALL, ו-5 מחווני הליבה.",
      "ana-technical": "העדשה הטכנית מכסה רצועות SMA 20, VWAP ו-2σ בולינגר עם אישור נפח תחתון.",
      "ana-compare": "עם Compare %, מדוד אחוז יתרון נטו או Alpha Spread מ-0% מול עמית או מדד תואם.",
      "ana-micro": "Micro & Flow מזהה עליות נפח באמצעות 20d Z-Score, פיזור נזילות וציון אנומליה P-06.",
      "ana-engines": "הכרטיסייה הרביעית היא כלי אד-הוק דינמי המשתנה לפי דרגת נכסים: מכיוון ש-NVDA היא מניות, היא פותחת תנודתיות ואפשרויות תלת-ממדיות, בעוד שאג\"ח, מטבעות וסחורות משיקים כלים מיוחדים משלהם.",
      "res-hero": "בחלק העליון, Score & Stance מסכמים את פסק הדין הבסיסי, הדירוג המשוקלל ומדחום הכותרת.",
      "res-rag": "בעמודה השמאלית, RAG Document Chat עונה על שאילתות מאומתות המבוססות על רישומים רשמיים של SEC 10-K ו-10-Q.",
      "res-factors": "בעמודה המרכזית, אקורדיון הפקטורים מעמיד את 5 נהגי השוורים המובילים מול 5 הסיכונים המובילים.",
      "res-pulse24h": "בצד ימין, FinBERT Pulse מבקיע כותרות שוברות בזמן אמת ומשרטט את עקומת הסנטימנט של 24 שעות.",
      "p1-pills": "6 כרטיסי הסיכום מחשבים מחדש את CAGR, Sharpe ו-Sortino, 95% VaR, Max Drawdown, אלפא וגיוון.",
      "p1-table": "בטבלת הניפוח, הוסף כל אחד מ-213 הנכסים, הגדר משקלי אחוז מדויקים או איזון מחדש ל-100%.",
      "p1-xray": "מימין למעלה, פאנל X-Ray בעל 5 כרטיסיות בוחן חפיפה של תעודות סל, חשיפה, ייחוס ברינסון, תזרים מזומנים ומשמורת.",
      "p1-calendar": "מתחת לרנטגן, לוח השנה החודשי מציג את עקביות ההחזרות בינואר עד דצמבר וסיכומי YTD.",
      "p1-backtest": "ובחלק התחתון ברוחב המלא, Backtesting משווה את הפורטפוליו שלך מול ה-S&P 500, 60/40, All-Weather ו-Min-Variance.",
      "p2-markowitz": "הרביע הראשון משרטט את 2D Markowitz Efficient Frontier ומציב את תיק העבודות שלך מול Min-Var ו-Max-Sharpe.",
      "p2-tornado": "הרביע השמאלי התחתון בודק 5 משברים היסטוריים, 95% תרומה של VaR לכל נכס ולכידת הפוך/למטה.",
      "p2-corr": "מימין למעלה, מטריקס 6×6 משווה מתאמים בתנאים רגילים מול הדבקה בזנב משבר.",
      "p2-shock2d": "מימין למטה, Shock & Markov חוצים את שינויי הריבית עם מהלכי S&P 500 ומעריכים מעברי משטר.",
      "p2-montecarlo": "והפאנל התחתון מקרין 10,000 נתיבים של Monte Carlo על פני P95, P50 ו-P05, Drawdown מתחת למים ו-Sharpe מתגלגל.",
      "p3-impact": "6 כרטיסי ההשפעה משווים את התיק הנוכחי שלך מול המצב החזוי לאחר העסקאות המדומות שלך.",
      "p3-whatif": "משמאל למעלה, What-If & Kelly מדמים קנייה או מכירה של כרטיסים ומחשבים את גודל המיקום האופטימלי של Half-Kelly.",
      "p3-tailhedge": "משמאל למטה, OTM Put & Margin מדמה מגיני אפשרויות הגנה ומנטר את שולי התחזוקה של Reg-T.",
      "p3-committee": "בשני הפאנלים הימניים, מבקר ועדת 3 העמודים מעקות בטיחות לצד יומן הביצוע וטייס המשנה.",
      "p3-walkforward": "ובחלק התחתון, תרשים Walk-Forward מאמת את ביצועי In-Sample ו-Out-of-Sample עם אינדקס WFE."
    }
  },
  "FA": {
    "ui": {
      "walkthrough": "اجرای زنده تصویری",
      "clickPlayPause": "برای پخش یا توقف (Space) کلیک کنید",
      "subtitles": "زیرنویس (C)",
      "fullscreen": "تمام صفحه (F)",
      "exitFullscreen": "خروج از تمام صفحه (F یا Esc)",
      "portTabs": [
        "سازنده",
        "ریسک",
        "شبیه ساز",
        "کمک خلبان"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • زبان ها",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • دسته بندی ها",
      "scr-pulse": "02 • نبض 24 ساعته",
      "scr-table": "03 • جدول",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • نقشه حرارتی",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • فنی",
      "ana-compare": "03 • مقایسه %",
      "ana-micro": "04 • میکرو و جریان",
      "ana-engines": "05 • موتورهای 3D/2D",
      "res-hero": "01 • امتیاز و موضع",
      "res-rag": "02 • RAG چت",
      "res-factors": "03 • عوامل",
      "res-pulse24h": "04 • پالس FinBERT",
      "p1-pills": "01 • خلاصه",
      "p1-table": "02 • وزن دهی",
      "p1-xray": "03 • اشعه ایکس",
      "p1-calendar": "04 • تقویم",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • تورنادو و VaR",
      "p2-corr": "03 • همبستگی",
      "p2-shock2d": "04 • شوک و مارکوف",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • تاثیر",
      "p3-whatif": "02 • What-If و کلی",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • کمیته و ثبت نام",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "به صفحه Home خوش آمدید: نقطه شروع بدون حواس پرتی شما که در آن بازارها رمزگشایی می شوند.",
      "home-header": "در گوشه سمت چپ بالای Header، کلیک کردن روی نماد λ همیشه شما را به سمت راست به این مرحله اصلی بازمی‌گرداند.",
      "home-markets": "در مرکز بالای Header، Markets قرار دارد، ایستگاه کاری شما برای تحقیق در مورد همه 213 دارایی جهانی به صورت زنده.",
      "home-portfolio": "درست در کنار آن در منوی مرکزی Portfolio قرار دارد، برای ایجاد تخصیص، ریسک تست استرس و شبیه سازی معاملات.",
      "home-system": "در پایین سمت چپ Footer، System مانیتور مشاهده زنده را برای سرورها و پایگاه‌های داده باز می‌کند.",
      "home-guide": "در کنار آن، Guide هر زمان که به آن نیاز داشته باشید، این کتابچه راهنمای گام به گام تعاملی را باز می کند.",
      "home-langs": "در گوشه سمت راست پایین، دکمه زبان مدال مرکزی را برای ترجمه پلت فرم به 56 زبان باز می کند.",
      "home-palettes": "و Palette 5 تم خواندن بصری را باز می کند در حالی که سبز و قرمز مالی را کاملاً دست نخورده نگه می دارد.",
      "scr-categories": "در نوار بالای دسته‌ها، همه 213 دارایی، Watchlist یا 10 بازار تخصصی را فیلتر کنید.",
      "scr-pulse": "4 کارت Pulse 24h حجم جمع شده، میانگین RSI، رژیم P-06 و نابجایی های حجم بالایی را نشان می دهد.",
      "scr-table": "جدول تعاملی دارای جستجوی فوری، موارد دلخواه و ستون‌های هوشمند متناسب با هر طبقه دارایی است.",
      "scr-orbital": "نمای Orbital دارایی ها را در سه حلقه متحدالمرکز با انحراف با یک پانل بازرسی کناری زنده ترسیم می کند.",
      "scr-heatmap": "Heatmap 10 دارایی برتر را در بلوک های متناسب در 8 سایه سبز و قرمز مرتب می کند.",
      "scr-maintools": "و Main Tools شما را در سه مرحله به سمت منحنی های مستقل، نوسانات سه بعدی، متقاطع FX و موتورهای آتی راهنمایی می کند.",
      "ana-hero": "Header سوئیچر دارایی، 9 تایم فریم از 1 متر تا ALL و 5 نشانگر اصلی را ترکیب می کند.",
      "ana-technical": "لنز فنی باندهای SMA 20، VWAP، و 2σ Bollinger را با تایید حجم پایین پوشش می‌دهد.",
      "ana-compare": "با مقایسه ٪، مزیت درصد خالص یا Alpha Spread را از 0٪ در برابر همتا یا شاخص سازگار اندازه گیری کنید.",
      "ana-micro": "Micro & Flow افزایش حجم را از طریق 20d Z-Score، نابجایی نقدینگی گسترده و امتیاز ناهنجاری P-06 تشخیص می‌دهد.",
      "ana-engines": "برگه چهارم یک ابزار ad-hoc پویا است که بر اساس طبقه دارایی متفاوت است: چون NVDA یک سهام است، نوسانات سه بعدی و پرداخت گزینه ها را باز می کند، در حالی که اوراق قرضه، FX و کالاها ابزارهای تخصصی خود را راه اندازی می کنند.",
      "res-hero": "در بالا، Score & Stance حکم اساسی، رتبه بندی وزنی و دماسنج سرفصل را خلاصه می کند.",
      "res-rag": "در ستون سمت چپ، RAG Document Chat به پرسش‌های تأیید شده مبتنی بر پرونده‌های رسمی SEC 10-K و 10-Q پاسخ می‌دهد.",
      "res-factors": "در ستون مرکزی، آکاردئون Factors 5 راننده گاو نر برتر را در مقابل 5 خطر خرس برتر قرار می دهد.",
      "res-pulse24h": "در سمت راست، FinBERT Pulse به عناوین بی‌نظیر در زمان واقعی امتیاز می‌دهد و منحنی احساسات 24 ساعته را ترسیم می‌کند.",
      "p1-pills": "6 کارت خلاصه، CAGR، Sharpe و Sortino، 95٪ VaR، Max Drawdown، آلفا، و تنوع را دوباره محاسبه می کنند.",
      "p1-table": "در جدول وزن، هر یک از 213 دارایی را اضافه کنید، درصد اوزان دقیق را تنظیم کنید، یا دوباره تعادل را به 100 درصد بدهید.",
      "p1-xray": "بالا سمت راست، پانل 5 زبانه ایکس ری همپوشانی ETF، نوردهی، انتساب برینسون، جریان نقدی و نگهداری را بررسی می کند.",
      "p1-calendar": "در زیر X-Ray، تقویم ماهانه ثبات بازدهی ژانویه تا دسامبر و مجموع YTD را نشان می‌دهد.",
      "p1-backtest": "و در انتهای تمام عرض، Backtesting نمونه کارها شما را با S&P 500، 60/40، All-Weather و Min-Variance مقایسه می‌کند.",
      "p2-markowitz": "ربع اول، مرز کارآمد 2 بعدی Markowitz را ترسیم می کند و مجموعه شما را در مقابل Min-Var و Max-Sharpe قرار می دهد.",
      "p2-tornado": "ربع پایین سمت چپ، 5 بحران تاریخی، 95 درصد سهم VaR برای هر دارایی، و تصویر Upside/Downside را آزمایش می‌کند.",
      "p2-corr": "بالا سمت راست، ماتریس 6×6 همبستگی ها را در شرایط عادی با سرایت دم بحران مقایسه می کند.",
      "p2-shock2d": "در پایین سمت راست، Shock & Markov تغییرات نرخ بهره را با حرکات S&P 500 تلاقی می‌کند و انتقال رژیم را تخمین می‌زند.",
      "p2-montecarlo": "و پانل پایینی 10000 مسیر Monte Carlo را در P95، P50، و P05، Drawdown زیر آب، و Sharpe نورد نشان می‌دهد.",
      "p3-impact": "6 کارت Impact سبد فعلی شما را با وضعیت پیش بینی شده پس از معاملات شبیه سازی شده مقایسه می کنند.",
      "p3-whatif": "بالا سمت چپ، What-If & Kelly خرید یا فروش بلیط را شبیه سازی می کند و اندازه موقعیت بهینه Half-Kelly را محاسبه می کند.",
      "p3-tailhedge": "OTM Put & Margin در سمت چپ پایین سپرهای گزینه محافظ را شبیه سازی می کند و حاشیه تعمیر و نگهداری Reg-T را نظارت می کند.",
      "p3-committee": "در دو پانل سمت راست، کمیته 3 ستونی حفاظ های خطر را در کنار گزارش اجرایی و Copilot بررسی می کند.",
      "p3-walkforward": "و در پایین، نمودار Walk-Forward عملکرد In-Sample و Out-of-Sample را با شاخص WFE تأیید می کند."
    }
  },
  "UR": {
    "ui": {
      "walkthrough": "لائیو بصری واک تھرو",
      "clickPlayPause": "کھیلنے یا روکنے کے لیے کلک کریں (اسپیس)",
      "subtitles": "سب ٹائٹلز (C)",
      "fullscreen": "پوری اسکرین (F)",
      "exitFullscreen": "فل سکرین سے باہر نکلیں (F یا Esc)",
      "portTabs": [
        "بلڈر",
        "خطرہ",
        "سمیلیٹر",
        "copilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • زبانیں",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • زمرے",
      "scr-pulse": "02 • 24 گھنٹے نبض",
      "scr-table": "03 • میز",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • ہیٹ میپ",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • تکنیکی",
      "ana-compare": "03 • % کا موازنہ کریں",
      "ana-micro": "04 • مائیکرو اینڈ فلو",
      "ana-engines": "05 • 3D/2D انجن",
      "res-hero": "01 • اسکور اور موقف",
      "res-rag": "02 • RAG چیٹ",
      "res-factors": "03 • عوامل",
      "res-pulse24h": "04 • FinBERT پلس",
      "p1-pills": "01 • خلاصہ",
      "p1-table": "02 • وزن",
      "p1-xray": "03 • ایکس رے",
      "p1-calendar": "04 • کیلنڈر",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • ٹورنیڈو اور VaR",
      "p2-corr": "03 • ارتباط",
      "p2-shock2d": "04 • شاک اینڈ مارکوف",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • اثر",
      "p3-whatif": "02 • What-If اور کیلی",
      "p3-tailhedge": "03 • OTM پٹ اور مارجن",
      "p3-committee": "04 • کمیٹی اور لاگ",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home اسکرین میں خوش آمدید: آپ کا خلفشار سے پاک نقطہ آغاز جہاں بازاروں کو ڈی کوڈ کیا جاتا ہے۔",
      "home-header": "Header کے اوپری بائیں کونے میں، λ آئیکن پر کلک کرنا آپ کو ہمیشہ اس مرکزی مرحلے پر واپس لے آتا ہے۔",
      "home-markets": "Header کے سب سے اوپر مرکز Markets ہے، تمام 213 عالمی اثاثوں کی براہ راست تحقیق کے لیے آپ کا ورک سٹیشن۔",
      "home-portfolio": "اس کے بالکل ساتھ مرکز والے مینو میں Portfolio ہے، مختص کرنے، تناؤ کی جانچ کے خطرے، اور تجارت کی نقل کرنے کے لیے۔",
      "home-system": "نیچے بائیں طرف Footer، System سرورز اور ڈیٹا بیسز کے لیے لائیو مشاہداتی مانیٹر کھولتا ہے۔",
      "home-guide": "اس کے ساتھ، Guide جب بھی آپ کو ضرورت ہو اس انٹرایکٹو مرحلہ وار دستی کو کھولتا ہے۔",
      "home-langs": "نیچے دائیں کونے میں، زبان کا بٹن پلیٹ فارم کو 56 زبانوں میں ترجمہ کرنے کے لیے سینٹرڈ موڈل کو کھولتا ہے۔",
      "home-palettes": "اور Palette مالیاتی سبز اور سرخ کو سختی سے برقرار رکھتے ہوئے 5 بصری ریڈنگ تھیمز کھولتا ہے۔",
      "scr-categories": "سب سے اوپر کیٹیگریز بار میں، تمام 213 اثاثوں، اپنے Watchlist، یا 10 مخصوص مارکیٹوں میں فلٹر کریں۔",
      "scr-pulse": "4 پلس 24h کارڈز مجموعی حجم، اوسط RSI، P-06 نظام، اور سب سے اوپر والیوم ڈس لوکیشن دکھاتے ہیں۔",
      "scr-table": "انٹرایکٹو ٹیبل میں ہر اثاثہ کلاس کے مطابق فوری تلاش، پسندیدہ اور سمارٹ کالم شامل ہیں۔",
      "scr-orbital": "Orbital ویو لائیو سائڈ انسپیکشن پینل کے ساتھ انحراف کے ذریعے تین مرتکز حلقوں میں اثاثوں کا نقشہ بناتا ہے۔",
      "scr-heatmap": "ہیٹ میپ سرفہرست 10 اثاثوں کو سبز اور سرخ کے 8 شیڈز میں متناسب بلاکس میں ترتیب دیتا ہے۔",
      "scr-maintools": "اور Main Tools آپ کو خود مختار منحنی خطوط، 3D اتار چڑھاؤ، FX کراس، اور مستقبل کے انجنوں کے لیے تین مراحل میں رہنمائی کرتا ہے۔",
      "ana-hero": "Header اثاثہ سوئچر، 1m سے ALL تک 9 ٹائم فریم، اور 5 بنیادی اشاریوں کو یکجا کرتا ہے۔",
      "ana-technical": "ٹیکنیکل لینس نیچے والیوم کی تصدیق کے ساتھ SMA 20، VWAP، اور 2σ بولنگر بینڈز کو اوورلے کرتا ہے۔",
      "ana-compare": "موازنہ % کے ساتھ، ہم آہنگ ہم مرتبہ یا انڈیکس کے مقابلے میں خالص فیصد فائدہ یا Alpha Spread کو 0% سے پیمائش کریں۔",
      "ana-micro": "مائیکرو اینڈ فلو 20d Z-Score، اسپریڈ لیکویڈیٹی ڈس لوکیشن، اور P-06 بے ضابطگی اسکور کے ذریعے حجم میں اضافے کا پتہ لگاتا ہے۔",
      "ana-engines": "چوتھا ٹیب ایک متحرک ایڈہاک ٹول ہے جو اثاثہ جات کے لحاظ سے مختلف ہوتا ہے: کیونکہ NVDA ایک ایکویٹی ہے یہ 3D اتار چڑھاؤ اور اختیارات کی ادائیگی کو کھولتا ہے، جبکہ بانڈز، FX، اور کموڈٹیز اپنے مخصوص ٹولز لانچ کرتے ہیں۔",
      "res-hero": "سب سے اوپر، اسکور اور موقف بنیادی فیصلے، وزنی درجہ بندی، اور ہیڈ لائن تھرمامیٹر کا خلاصہ کرتا ہے۔",
      "res-rag": "بائیں کالم میں، RAG دستاویز چیٹ سرکاری SEC 10-K اور 10-Q فائلنگ میں موجود تصدیق شدہ سوالات کے جوابات دیتا ہے۔",
      "res-factors": "سینٹر کالم میں، فیکٹرز ایکارڈین سرفہرست 5 بیل ڈرائیوروں کے مقابلے میں سب سے اوپر 5 ریچھ کے خطرات سے متصادم ہے۔",
      "res-pulse24h": "دائیں طرف، FinBERT پلس حقیقی وقت میں بریکنگ ہیڈ لائنز اسکور کرتی ہے اور 24 گھنٹے کے جذباتی وکر کو پلاٹ کرتی ہے۔",
      "p1-pills": "6 سمری کارڈز CAGR، Sharpe اور Sortino، 95% VaR، Max Drawdown، الفا، اور تنوع کی دوبارہ گنتی کرتے ہیں۔",
      "p1-table": "وزن کے جدول میں، 213 اثاثوں میں سے کوئی بھی شامل کریں، صحیح فیصد وزن مقرر کریں، یا 100% پر توازن قائم کریں۔",
      "p1-xray": "اوپر دائیں، 5-ٹیب ایکس رے پینل ETF اوورلیپ، نمائش، برنسن انتساب، کیش فلو، اور تحویل کا آڈٹ کرتا ہے۔",
      "p1-calendar": "ایکس رے کے نیچے، ماہانہ کیلنڈر جنوری تا دسمبر واپسی کی مستقل مزاجی اور YTD کے ٹوٹل دکھاتا ہے۔",
      "p1-backtest": "اور پوری چوڑائی کے نیچے، Backtesting آپ کے پورٹ فولیو کا موازنہ S&P 500، 60/40، All-Weather، اور Min-Variance سے کرتا ہے۔",
      "p2-markowitz": "پہلا کواڈرینٹ 2D Markowitz Efficient Frontier کو پلاٹ کرتا ہے اور Min-Var اور Max-Sharpe کے مقابلے میں آپ کے پورٹ فولیو کو رکھتا ہے۔",
      "p2-tornado": "نیچے بائیں کواڈرینٹ 5 تاریخی بحرانوں، فی اثاثہ 95% VaR شراکت، اور اوپر/نیچے کیپچر کی جانچ کرتا ہے۔",
      "p2-corr": "اوپر سے دائیں، 6×6 میٹرکس عام حالات میں کرائسس ٹیل متعدی کے خلاف ارتباط کا موازنہ کرتا ہے۔",
      "p2-shock2d": "نیچے دائیں طرف، شاک اینڈ مارکوف S&P 500 کے ساتھ شرح سود کی تبدیلیوں کو عبور کرتا ہے اور نظام کی منتقلی کا تخمینہ لگاتا ہے۔",
      "p2-montecarlo": "اور نیچے والا پینل P95، P50، اور P05 میں 10,000 Monte Carlo راستے، پانی کے اندر ڈرا ڈاؤن، اور Sharpe رولنگ کرتا ہے۔",
      "p3-impact": "6 امپیکٹ کارڈز آپ کے موجودہ پورٹ فولیو کا موازنہ آپ کی نقلی تجارت کے بعد متوقع حالت سے کرتے ہیں۔",
      "p3-whatif": "اوپر سے بائیں، What-If اور کیلی ٹکٹوں کی خرید و فروخت کی نقل کرتا ہے اور Half-Kelly پوزیشن کے بہترین سائز کا حساب لگاتا ہے۔",
      "p3-tailhedge": "نیچے سے بائیں، OTM پٹ اور مارجن حفاظتی آپشن شیلڈز کی نقل کرتا ہے اور Reg-T مینٹیننس مارجن کو مانیٹر کرتا ہے۔",
      "p3-committee": "دو دائیں پینلز میں، 3 ستون والی کمیٹی ایگزیکیوشن لاگ اور کوپائلٹ کے ساتھ ساتھ رسک گارڈریلز کا آڈٹ کرتی ہے۔",
      "p3-walkforward": "اور نیچے، Walk-Forward چارٹ WFE انڈیکس کے ساتھ In-Sample اور Out-of-Sample کارکردگی کی توثیق کرتا ہے۔"
    }
  },
  "HI": {
    "ui": {
      "walkthrough": "लाइव विज़ुअल वॉकथ्रू",
      "clickPlayPause": "चलाने या रोकने के लिए क्लिक करें (स्पेस)",
      "subtitles": "उपशीर्षक (सी)",
      "fullscreen": "फुलस्क्रीन (एफ)",
      "exitFullscreen": "फ़ुलस्क्रीन से बाहर निकलें (F या Esc)",
      "portTabs": [
        "बिल्डर",
        "जोखिम",
        "सिम्युलेटर",
        "सहपायलट"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • भाषाएँ",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • श्रेणियाँ",
      "scr-pulse": "02 • 24 घंटे पल्स",
      "scr-table": "03 • टेबल",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • हीटमैप",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • तकनीकी",
      "ana-compare": "03 • तुलना %",
      "ana-micro": "04 • सूक्ष्म एवं प्रवाह",
      "ana-engines": "05 • 3डी/2डी इंजन",
      "res-hero": "01 • स्कोर और रुख",
      "res-rag": "02 • RAG चैट",
      "res-factors": "03 • कारक",
      "res-pulse24h": "04 • FinBERT पल्स",
      "p1-pills": "01 • सारांश",
      "p1-table": "02 • भार उठाना",
      "p1-xray": "03 • एक्स-रे",
      "p1-calendar": "04 • कैलेंडर",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • बवंडर और VaR",
      "p2-corr": "03 • सहसंबंध",
      "p2-shock2d": "04 • शॉक और मार्कोव",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • प्रभाव",
      "p3-whatif": "02 • What-If और केली",
      "p3-tailhedge": "03 • ओटीएम पुट और मार्जिन",
      "p3-committee": "04 • समिति एवं लॉग",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home स्क्रीन पर आपका स्वागत है: आपका व्याकुलता-मुक्त शुरुआती बिंदु जहां बाजार डिकोड हो जाते हैं — .",
      "home-header": "Header के ऊपरी-बाएँ कोने पर, λ आइकन पर क्लिक करने से आप हमेशा इस मुख्य चरण पर वापस आ जाते हैं — .",
      "home-markets": "Header के शीर्ष पर केंद्रित Markets है, जो सभी 213 वैश्विक संपत्तियों पर लाइव शोध करने के लिए आपका कार्य केंद्र है — .",
      "home-portfolio": "आवंटन बनाने, तनाव-परीक्षण जोखिम और ट्रेडों का अनुकरण करने के लिए इसके ठीक बगल में मध्य मेनू में Portfolio है — .",
      "home-system": "नीचे बाईं ओर Footer में, System सर्वर और डेटाबेस के लिए लाइव ऑब्जर्वेबिलिटी मॉनिटर खोलता है — .",
      "home-guide": "इसके अलावा, जब भी आपको आवश्यकता हो, Guide इस इंटरैक्टिव चरण-दर-चरण मैनुअल को खोलता है — .",
      "home-langs": "निचले दाएं कोने पर, भाषा बटन प्लेटफ़ॉर्म को 56 भाषाओं में अनुवाद करने के लिए केंद्रित मोडल खोलता है — .",
      "home-palettes": "और Palette वित्तीय हरे और लाल को सख्ती से बरकरार रखते हुए 5 विज़ुअल रीडिंग थीम खोलता है — .",
      "scr-categories": "शीर्ष श्रेणी बार में, सभी 213 परिसंपत्तियों, अपने Watchlist, या 10 विशेष बाज़ारों को फ़िल्टर करें — .",
      "scr-pulse": "4 पल्स 24h कार्ड समग्र वॉल्यूम, औसत आरएसआई, P-06 शासन और शीर्ष वॉल्यूम डिस्लोकेशन दिखाते हैं — .",
      "scr-table": "इंटरैक्टिव तालिका में प्रत्येक परिसंपत्ति वर्ग के अनुरूप त्वरित खोज, पसंदीदा और स्मार्ट कॉलम शामिल हैं — .",
      "scr-orbital": "Orbital दृश्य लाइव साइड निरीक्षण पैनल के साथ विचलन द्वारा तीन संकेंद्रित रिंगों में परिसंपत्तियों को मैप करता है — .",
      "scr-heatmap": "हीटमैप शीर्ष 10 परिसंपत्तियों को हरे और लाल रंग के 8 रंगों में आनुपातिक ब्लॉकों में व्यवस्थित करता है — .",
      "scr-maintools": "और Main Tools आपको सॉवरेन कर्व्स, 3डी अस्थिरता, एफएक्स क्रॉस और फ्यूचर्स इंजन के तीन चरणों में मार्गदर्शन करता है — .",
      "ana-hero": "Header एसेट स्विचर, 1m से ALL तक 9 टाइमफ्रेम और 5 मुख्य संकेतकों को जोड़ता है — .",
      "ana-technical": "तकनीकी लेंस निचले वॉल्यूम पुष्टिकरण के साथ SMA 20, VWAP और 2σ बोलिंगर बैंड को ओवरले करता है — .",
      "ana-compare": "तुलना % के साथ, संगत सहकर्मी या सूचकांक के मुकाबले शुद्ध प्रतिशत लाभ या Alpha Spread को 0% से मापें — .",
      "ana-micro": "माइक्रो एंड फ्लो 20d Z-स्कोर, स्प्रेड लिक्विडिटी डिस्लोकेशन और P-06 विसंगति स्कोर के माध्यम से वॉल्यूम स्पाइक्स का पता लगाता है — .",
      "ana-engines": "चौथा टैब एक गतिशील तदर्थ उपकरण है जो परिसंपत्ति वर्ग के अनुसार भिन्न होता है: क्योंकि NVDA एक इक्विटी है, यह 3डी अस्थिरता और विकल्प भुगतान खोलता है, जबकि बांड, एफएक्स और कमोडिटी अपने स्वयं के विशेष उपकरण लॉन्च करते हैं — .",
      "res-hero": "शीर्ष पर, स्कोर एंड स्टांस मौलिक फैसले, भारित रेटिंग और हेडलाइन थर्मामीटर का सारांश देता है — .",
      "res-rag": "बाएं कॉलम में, RAG दस्तावेज़ चैट आधिकारिक SEC 10-K और 10-Q फाइलिंग पर आधारित सत्यापित प्रश्नों का उत्तर देता है — .",
      "res-factors": "मध्य स्तंभ में, फैक्टर्स अकॉर्डियन शीर्ष 5 बुल ड्राइवरों की तुलना शीर्ष 5 बियर जोखिमों से करता है — .",
      "res-pulse24h": "दाईं ओर, FinBERT पल्स वास्तविक समय में ब्रेकिंग हेडलाइंस हासिल करता है और 24 घंटे का सेंटीमेंट कर्व प्लॉट करता है — .",
      "p1-pills": "6 सारांश कार्ड लाइव CAGR, Sharpe और Sortino, 95% VaR, Max Drawdown, अल्फा और विविधीकरण की पुनर्गणना करते हैं — .",
      "p1-table": "भार तालिका में, 213 परिसंपत्तियों में से कोई भी जोड़ें, सटीक प्रतिशत भार निर्धारित करें, या 100% पर पुनर्संतुलन करें — .",
      "p1-xray": "ऊपर दाईं ओर, 5-टैब एक्स-रे पैनल ईटीएफ ओवरलैप, एक्सपोज़र, ब्रिंसन एट्रिब्यूशन, कैशफ्लो और कस्टडी का ऑडिट करता है — .",
      "p1-calendar": "एक्स-रे के नीचे, मासिक कैलेंडर जनवरी-से-दिसंबर रिटर्न स्थिरता और YTD योग प्रदर्शित करता है — .",
      "p1-backtest": "और पूर्ण-चौड़ाई के निचले भाग में, Backtesting आपके पोर्टफोलियो की तुलना S&P 500, 60/40, All-Weather, और Min-Variance से करता है — .",
      "p2-markowitz": "पहला चतुर्थांश 2D Markowitz कुशल फ्रंटियर को प्लॉट करता है और आपके पोर्टफोलियो को Min-Var और Max-Sharpe के मुकाबले रखता है — .",
      "p2-tornado": "नीचे-बाएँ चतुर्थांश में 5 ऐतिहासिक संकट, प्रति-परिसंपत्ति 95% VaR योगदान और अपसाइड/डाउनसाइड कैप्चर का परीक्षण किया जाता है — .",
      "p2-corr": "ऊपर दाईं ओर, 6×6 मैट्रिक्स संकट पूंछ संक्रमण के विरुद्ध सामान्य परिस्थितियों में सहसंबंधों की तुलना करता है — .",
      "p2-shock2d": "नीचे-दाएं, शॉक एंड मार्कोव S&P 500 चाल के साथ ब्याज दर में बदलाव को पार करता है और शासन परिवर्तन का अनुमान लगाता है — .",
      "p2-montecarlo": "और निचला पैनल P95, P50 और P05, अंडरवाटर ड्रॉडाउन और रोलिंग Sharpe में 10,000 Monte Carlo पथ प्रोजेक्ट करता है — .",
      "p3-impact": "6 इम्पैक्ट कार्ड आपके वर्तमान पोर्टफोलियो की तुलना आपके सिम्युलेटेड ट्रेडों के बाद अनुमानित स्थिति से करते हैं — .",
      "p3-whatif": "शीर्ष-बाएँ, What-If और केली टिकट खरीदने या बेचने का अनुकरण करते हैं और इष्टतम Half-Kelly स्थिति आकार की गणना करते हैं — .",
      "p3-tailhedge": "नीचे-बाएँ, OTM पुट और मार्जिन सुरक्षात्मक विकल्प शील्ड का अनुकरण करता है और Reg-T रखरखाव मार्जिन की निगरानी करता है — .",
      "p3-committee": "दो दाएं पैनल में, 3-स्तंभ समिति निष्पादन लॉग और कोपायलट के साथ-साथ जोखिम रेलिंग का ऑडिट करती है — .",
      "p3-walkforward": "और सबसे नीचे, Walk-Forward चार्ट WFE सूचकांक के साथ In-Sample और Out-of-Sample प्रदर्शन को मान्य करता है — ."
    }
  },
  "BN": {
    "ui": {
      "walkthrough": "লাইভ ভিজ্যুয়াল ওয়াকথ্রু",
      "clickPlayPause": "খেলতে বা পজ করতে ক্লিক করুন (স্পেস)",
      "subtitles": "সাবটাইটেল (C)",
      "fullscreen": "ফুলস্ক্রিন (F)",
      "exitFullscreen": "ফুলস্ক্রিন থেকে প্রস্থান করুন (F বা Esc)",
      "portTabs": [
        "নির্মাতা",
        "ঝুঁকি",
        "সিমুলেটর",
        "কপিলট"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • ভাষা",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • ক্যাটাগরি",
      "scr-pulse": "02 • 24 ঘন্টা পালস",
      "scr-table": "03 • টেবিল",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • হিটম্যাপ",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • প্রযুক্তিগত",
      "ana-compare": "03 • তুলনা করুন %",
      "ana-micro": "04 • মাইক্রো এবং ফ্লো",
      "ana-engines": "05 • 3D/2D ইঞ্জিন",
      "res-hero": "01 • স্কোর এবং অবস্থান",
      "res-rag": "02 • RAG চ্যাট",
      "res-factors": "03 • ফ্যাক্টর",
      "res-pulse24h": "04 • FinBERT পালস",
      "p1-pills": "01 • সারাংশ",
      "p1-table": "02 • ওজন করা",
      "p1-xray": "03 • এক্স-রে",
      "p1-calendar": "04 • ক্যালেন্ডার",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • টর্নেডো এবং VaR",
      "p2-corr": "03 • পারস্পরিক সম্পর্ক",
      "p2-shock2d": "04 • শক এবং মার্কভ",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • প্রভাব",
      "p3-whatif": "02 • What-If এবং কেলি",
      "p3-tailhedge": "03 • OTM পুট এবং মার্জিন",
      "p3-committee": "04 • কমিটি এবং লগ",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home স্ক্রিনে স্বাগতম: আপনার বিভ্রান্তি-মুক্ত সূচনা পয়েন্ট যেখানে বাজারগুলি ডিকোড করা হয় — .",
      "home-header": "Header-এর উপরের-বাম কোণে, λ আইকনে ক্লিক করা আপনাকে সর্বদা এই মূল পর্যায়ে ফিরিয়ে আনে — .",
      "home-markets": "Header-এর শীর্ষে কেন্দ্রীভূত হল Markets, সমস্ত 213টি বৈশ্বিক সম্পদ লাইভ গবেষণা করার জন্য আপনার ওয়ার্কস্টেশন — .",
      "home-portfolio": "কেন্দ্রীভূত মেনুতে এটির ঠিক পাশেই রয়েছে Portfolio, বরাদ্দ, স্ট্রেস-টেস্ট ঝুঁকি এবং ট্রেড অনুকরণ করতে — .",
      "home-system": "নীচে-বাম দিকে Footer, System সার্ভার এবং ডাটাবেসের জন্য লাইভ পর্যবেক্ষণ মনিটর খোলে — .",
      "home-guide": "এটির পাশে, Guide এই ইন্টারেক্টিভ ধাপে ধাপে ম্যানুয়ালটি খোলে যখনই আপনার প্রয়োজন হয়৷.",
      "home-langs": "নীচে-ডান কোণে, ভাষা বোতামটি 56টি ভাষায় প্ল্যাটফর্মটিকে অনুবাদ করতে কেন্দ্রীভূত মডেলটি খোলে — .",
      "home-palettes": "এবং Palette আর্থিক সবুজ এবং লাল কঠোরভাবে অক্ষত রেখে 5টি ভিজ্যুয়াল রিডিং থিম খুলেছে — .",
      "scr-categories": "শীর্ষ ক্যাটাগরি বারে, সমস্ত 213টি সম্পদ, আপনার Watchlist, বা 10টি বিশেষায়িত বাজার জুড়ে ফিল্টার করুন৷.",
      "scr-pulse": "4 পালস 24h কার্ড সমষ্টিগত ভলিউম, গড় RSI, P-06 শাসন, এবং শীর্ষ ভলিউম স্থানচ্যুতি দেখায় — .",
      "scr-table": "ইন্টারেক্টিভ টেবিলে তাত্ক্ষণিক অনুসন্ধান, পছন্দসই এবং প্রতিটি সম্পদ শ্রেণীর জন্য তৈরি স্মার্ট কলামগুলি রয়েছে৷.",
      "scr-orbital": "Orbital ভিউ একটি লাইভ সাইড ইন্সপেকশন প্যানেলের সাথে বিচ্যুতির মাধ্যমে তিনটি ঘনকেন্দ্রিক রিং জুড়ে সম্পদ ম্যাপ করে — .",
      "scr-heatmap": "হিটম্যাপ শীর্ষ 10টি সম্পদকে সবুজ এবং লালের 8টি শেড জুড়ে সমানুপাতিক ব্লকে সাজিয়েছে — .",
      "scr-maintools": "এবং Main Tools আপনাকে সার্বভৌম বক্ররেখা, 3D অস্থিরতা, FX ক্রস এবং ফিউচার ইঞ্জিনের জন্য তিনটি ধাপে গাইড করে — .",
      "ana-hero": "Header সম্পদ সুইচার, 1m থেকে ALL পর্যন্ত 9টি সময়সীমা এবং 5টি মূল সূচককে একত্রিত করে — .",
      "ana-technical": "টেকনিক্যাল লেন্স SMA 20, VWAP, এবং 2σ বলিঞ্জার ব্যান্ডগুলিকে নীচের ভলিউম নিশ্চিতকরণের সাথে ওভারলে করে — .",
      "ana-compare": "তুলনা % দিয়ে, একটি সামঞ্জস্যপূর্ণ পিয়ার বা সূচকের বিপরীতে 0% থেকে নেট শতাংশ সুবিধা বা Alpha Spread পরিমাপ করুন — .",
      "ana-micro": "মাইক্রো অ্যান্ড ফ্লো 20d Z-স্কোর, স্প্রেড লিকুইডিটি ডিসলোকেশন এবং P-06 অ্যানোমালি স্কোরের মাধ্যমে ভলিউম স্পাইক সনাক্ত করে — .",
      "ana-engines": "চতুর্থ ট্যাব হল একটি ডায়নামিক অ্যাড-হক টুল যা সম্পদের শ্রেণী অনুসারে পরিবর্তিত হয়: কারণ NVDA একটি ইকুইটি এটি 3D অস্থিরতা এবং বিকল্প পেঅফ খোলে, যখন বন্ড, এফএক্স এবং পণ্যগুলি তাদের নিজস্ব বিশেষ সরঞ্জাম চালু করে — .",
      "res-hero": "শীর্ষে, স্কোর এবং স্ট্যান্স মৌলিক রায়, ওজনযুক্ত রেটিং এবং শিরোনাম থার্মোমিটারের সংক্ষিপ্ত বিবরণ দেয় — .",
      "res-rag": "বাম কলামে, RAG ডকুমেন্ট চ্যাট অফিসিয়াল SEC 10-K এবং 10-Q ফাইলিং-এ ভিত্তি করে যাচাই করা প্রশ্নের উত্তর দেয় — .",
      "res-factors": "কেন্দ্রের কলামে, ফ্যাক্টর অ্যাকর্ডিয়ন শীর্ষ 5টি ভালুকের ঝুঁকির বিপরীতে শীর্ষ 5টি ষাঁড় চালকের বিপরীতে — .",
      "res-pulse24h": "ডানদিকে, FinBERT পালস রিয়েল টাইমে ব্রেকিং হেডলাইন স্কোর করে এবং 24-ঘন্টা সেন্টিমেন্ট কার্ভ প্লট করে — .",
      "p1-pills": "6টি সারাংশ কার্ড লাইভ CAGR, Sharpe এবং Sortino, 95% VaR, Max Drawdown, আলফা, এবং বৈচিত্র্য পুনরায় গণনা করে — .",
      "p1-table": "ওজন সারণীতে, 213টি সম্পদের যেকোনো একটি যোগ করুন, সঠিক শতাংশের ওজন সেট করুন, বা 100% এ ভারসাম্য বজায় রাখুন — .",
      "p1-xray": "উপরে-ডানদিকে, 5-ট্যাবের এক্স-রে প্যানেলটি ETF ওভারল্যাপ, এক্সপোজার, ব্রিনসন অ্যাট্রিবিউশন, ক্যাশফ্লো এবং হেফাজত নিরীক্ষা করে — .",
      "p1-calendar": "X-Ray-এর নীচে, মাসিক ক্যালেন্ডার জানুয়ারি-থেকে-ডিসেম্বর রিটার্নের সামঞ্জস্য এবং YTD মোট প্রদর্শন করে — .",
      "p1-backtest": "এবং সম্পূর্ণ-প্রস্থ নীচে, Backtesting আপনার পোর্টফোলিওকে S&P 500, 60/40, All-Weather, এবং Min-Variance এর সাথে তুলনা করে — .",
      "p2-markowitz": "প্রথম চতুর্ভুজ 2D Markowitz দক্ষ ফ্রন্টিয়ার প্লট করে এবং আপনার পোর্টফোলিও বনাম Min-Var এবং Max-Sharpe এর অবস্থান করে — .",
      "p2-tornado": "নীচে-বাম চতুর্ভুজ 5টি ঐতিহাসিক সংকট, প্রতি-সম্পদ 95% VaR অবদান এবং আপসাইড/ডাউনসাইড ক্যাপচার পরীক্ষা করে — .",
      "p2-corr": "উপরে-ডানে, 6×6 ম্যাট্রিক্স ক্রাইসিস লেজ সংক্রামনের বিরুদ্ধে স্বাভাবিক অবস্থায় পারস্পরিক সম্পর্ককে তুলনা করে — .",
      "p2-shock2d": "নীচে-ডানদিকে, শক এবং মার্কভ S&P 500 চালনার সাথে সুদের হার পরিবর্তন করে এবং শাসনের পরিবর্তনের অনুমান করে — .",
      "p2-montecarlo": "এবং নীচের প্যানেলটি P95, P50, এবং P05 জুড়ে 10,000 Monte Carlo পাথ, জলের নিচে ড্রডাউন, এবং রোলিং Sharpe প্রজেক্ট করে — .",
      "p3-impact": "6টি ইমপ্যাক্ট কার্ড আপনার সিমুলেটেড ট্রেডের পরে প্রজেক্টেড স্টেটের সাথে আপনার বর্তমান পোর্টফোলিওর তুলনা করে — .",
      "p3-whatif": "উপরে-বামে, What-If এবং কেলি টিকিট কেনা বা বিক্রির অনুকরণ করে এবং সর্বোত্তম Half-Kelly অবস্থানের আকার গণনা করে — .",
      "p3-tailhedge": "নীচে-বামে, OTM পুট এবং মার্জিন প্রতিরক্ষামূলক বিকল্প ঢালকে অনুকরণ করে এবং Reg-T রক্ষণাবেক্ষণ মার্জিন নিরীক্ষণ করে — .",
      "p3-committee": "দুটি ডান প্যানেলে, 3-স্তম্ভ কমিটি এক্সিকিউশন লগ এবং কপিলটের পাশাপাশি ঝুঁকির গার্ডেলগুলি নিরীক্ষণ করে — .",
      "p3-walkforward": "এবং নীচে, Walk-Forward চার্ট WFE সূচকের সাথে In-Sample এবং Out-of-Sample কার্যকারিতা যাচাই করে৷."
    }
  },
  "PA": {
    "ui": {
      "walkthrough": "ਲਾਈਵ ਵਿਜ਼ੂਅਲ ਵਾਕਥਰੂ",
      "clickPlayPause": "ਖੇਡਣ ਜਾਂ ਰੋਕਣ ਲਈ ਕਲਿੱਕ ਕਰੋ (ਸਪੇਸ)",
      "subtitles": "ਉਪਸਿਰਲੇਖ (C)",
      "fullscreen": "ਪੂਰੀ ਸਕਰੀਨ (F)",
      "exitFullscreen": "ਪੂਰੀ ਸਕਰੀਨ ਤੋਂ ਬਾਹਰ ਨਿਕਲੋ (F ਜਾਂ Esc)",
      "portTabs": [
        "ਬਿਲਡਰ",
        "ਜੋਖਮ",
        "ਸਿਮੂਲੇਟਰ",
        "ਕੋਪਾਇਲਟ"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • ਭਾਸ਼ਾਵਾਂ",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • ਸ਼੍ਰੇਣੀਆਂ",
      "scr-pulse": "02 • 24 ਘੰਟੇ ਪਲਸ",
      "scr-table": "03 • ਟੇਬਲ",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • ਹੀਟਮੈਪ",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • ਤਕਨੀਕੀ",
      "ana-compare": "03 • % ਦੀ ਤੁਲਨਾ ਕਰੋ",
      "ana-micro": "04 • ਮਾਈਕ੍ਰੋ ਅਤੇ ਫਲੋ",
      "ana-engines": "05 • 3D/2D ਇੰਜਣ",
      "res-hero": "01 • ਸਕੋਰ ਅਤੇ ਸਟੈਂਡ",
      "res-rag": "02 • RAG ਚੈਟ",
      "res-factors": "03 • ਕਾਰਕ",
      "res-pulse24h": "04 • FinBERT ਪਲਸ",
      "p1-pills": "01 • ਸੰਖੇਪ",
      "p1-table": "02 • ਵਜ਼ਨ",
      "p1-xray": "03 • ਐਕਸ-ਰੇ",
      "p1-calendar": "04 • ਕੈਲੰਡਰ",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • ਟੋਰਨੇਡੋ ਅਤੇ VaR",
      "p2-corr": "03 • ਸਬੰਧ",
      "p2-shock2d": "04 • ਸਦਮਾ ਅਤੇ ਮਾਰਕੋਵ",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • ਪ੍ਰਭਾਵ",
      "p3-whatif": "02 • What-If ਅਤੇ ਕੈਲੀ",
      "p3-tailhedge": "03 • OTM ਪੁਟ ਅਤੇ ਮਾਰਜਿਨ",
      "p3-committee": "04 • ਕਮੇਟੀ ਅਤੇ ਲੌਗ",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home ਸਕ੍ਰੀਨ 'ਤੇ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ: ਤੁਹਾਡਾ ਭਟਕਣਾ-ਮੁਕਤ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਜਿੱਥੇ ਬਾਜ਼ਾਰਾਂ ਨੂੰ ਡੀਕੋਡ ਕੀਤਾ ਜਾਂਦਾ ਹੈ — .",
      "home-header": "Header ਦੇ ਉੱਪਰ-ਖੱਬੇ ਕੋਨੇ 'ਤੇ, λ ਆਈਕਨ 'ਤੇ ਕਲਿੱਕ ਕਰਨਾ ਤੁਹਾਨੂੰ ਹਮੇਸ਼ਾ ਇਸ ਮੁੱਖ ਪੜਾਅ 'ਤੇ ਵਾਪਸ ਲਿਆਉਂਦਾ ਹੈ — .",
      "home-markets": "Header ਦੇ ਸਿਖਰ 'ਤੇ ਕੇਂਦਰਿਤ Markets ਹੈ, ਸਾਰੀਆਂ 213 ਗਲੋਬਲ ਸੰਪਤੀਆਂ ਦੀ ਲਾਈਵ ਖੋਜ ਕਰਨ ਲਈ ਤੁਹਾਡਾ ਵਰਕਸਟੇਸ਼ਨ — .",
      "home-portfolio": "ਕੇਂਦਰਿਤ ਮੀਨੂ ਵਿੱਚ ਇਸਦੇ ਸੱਜੇ ਪਾਸੇ Portfolio ਹੈ, ਅਲਾਟਮੈਂਟਾਂ, ਤਣਾਅ-ਟੈਸਟ ਜੋਖਮ, ਅਤੇ ਵਪਾਰਾਂ ਦੀ ਨਕਲ ਕਰਨ ਲਈ — .",
      "home-system": "ਹੇਠਾਂ-ਖੱਬੇ Footer ਵਿੱਚ, System ਸਰਵਰਾਂ ਅਤੇ ਡੇਟਾਬੇਸ ਲਈ ਲਾਈਵ ਨਿਰੀਖਣਯੋਗਤਾ ਮਾਨੀਟਰ ਖੋਲ੍ਹਦਾ ਹੈ — .",
      "home-guide": "ਇਸਦੇ ਨਾਲ, Guide ਇਸ ਇੰਟਰਐਕਟਿਵ ਕਦਮ-ਦਰ-ਕਦਮ ਮੈਨੂਅਲ ਨੂੰ ਖੋਲ੍ਹਦਾ ਹੈ ਜਦੋਂ ਵੀ ਤੁਹਾਨੂੰ ਇਸਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ — .",
      "home-langs": "ਹੇਠਲੇ-ਸੱਜੇ ਕੋਨੇ 'ਤੇ, ਭਾਸ਼ਾ ਬਟਨ ਪਲੇਟਫਾਰਮ ਨੂੰ 56 ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਅਨੁਵਾਦ ਕਰਨ ਲਈ ਕੇਂਦਰਿਤ ਮਾਡਲ ਨੂੰ ਖੋਲ੍ਹਦਾ ਹੈ — .",
      "home-palettes": "ਅਤੇ Palette ਵਿੱਤੀ ਹਰੇ ਅਤੇ ਲਾਲ ਨੂੰ ਸਖਤੀ ਨਾਲ ਬਰਕਰਾਰ ਰੱਖਦੇ ਹੋਏ 5 ਵਿਜ਼ੂਅਲ ਰੀਡਿੰਗ ਥੀਮ ਖੋਲ੍ਹਦਾ ਹੈ — .",
      "scr-categories": "ਚੋਟੀ ਦੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਪੱਟੀ ਵਿੱਚ, ਸਾਰੀਆਂ 213 ਸੰਪਤੀਆਂ, ਆਪਣੇ Watchlist, ਜਾਂ 10 ਵਿਸ਼ੇਸ਼ ਬਾਜ਼ਾਰਾਂ ਵਿੱਚ ਫਿਲਟਰ ਕਰੋ — .",
      "scr-pulse": "4 ਪਲਸ 24h ਕਾਰਡ ਐਗਰੀਗੇਟਿਡ ਵਾਲੀਅਮ, ਔਸਤ RSI, P-06 ਸ਼ਾਸਨ, ਅਤੇ ਸਿਖਰ ਵਾਲੀਅਮ ਡਿਸਲੋਕੇਸ਼ਨ ਦਿਖਾਉਂਦੇ ਹਨ — .",
      "scr-table": "ਇੰਟਰਐਕਟਿਵ ਟੇਬਲ ਵਿੱਚ ਤਤਕਾਲ ਖੋਜ, ਮਨਪਸੰਦ, ਅਤੇ ਹਰੇਕ ਸੰਪਤੀ ਸ਼੍ਰੇਣੀ ਲਈ ਤਿਆਰ ਕੀਤੇ ਸਮਾਰਟ ਕਾਲਮ ਸ਼ਾਮਲ ਹਨ — .",
      "scr-orbital": "Orbital ਦ੍ਰਿਸ਼ ਇੱਕ ਲਾਈਵ ਸਾਈਡ ਇੰਸਪੈਕਸ਼ਨ ਪੈਨਲ ਦੇ ਨਾਲ ਭਟਕਣ ਦੁਆਰਾ ਤਿੰਨ ਕੇਂਦਰਿਤ ਰਿੰਗਾਂ ਵਿੱਚ ਸੰਪਤੀਆਂ ਦਾ ਨਕਸ਼ਾ ਬਣਾਉਂਦਾ ਹੈ — .",
      "scr-heatmap": "ਹੀਟਮੈਪ ਚੋਟੀ ਦੀਆਂ 10 ਸੰਪਤੀਆਂ ਨੂੰ ਹਰੇ ਅਤੇ ਲਾਲ ਦੇ 8 ਸ਼ੇਡਾਂ ਵਿੱਚ ਅਨੁਪਾਤਕ ਬਲਾਕਾਂ ਵਿੱਚ ਵਿਵਸਥਿਤ ਕਰਦਾ ਹੈ — .",
      "scr-maintools": "ਅਤੇ Main Tools ਤੁਹਾਨੂੰ ਸਾਵਰੇਨ ਕਰਵ, 3D ਅਸਥਿਰਤਾ, FX ਕਰਾਸ, ਅਤੇ ਫਿਊਚਰ ਇੰਜਣਾਂ ਲਈ ਤਿੰਨ ਪੜਾਵਾਂ ਵਿੱਚ ਮਾਰਗਦਰਸ਼ਨ ਕਰਦਾ ਹੈ — .",
      "ana-hero": "Header ਸੰਪਤੀ ਸਵਿੱਚਰ, 1m ਤੋਂ ALL ਤੱਕ 9 ਸਮਾਂ-ਸੀਮਾਵਾਂ, ਅਤੇ 5 ਕੋਰ ਸੂਚਕਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ — .",
      "ana-technical": "ਟੈਕਨੀਕਲ ਲੈਂਸ SMA 20, VWAP, ਅਤੇ 2σ ਬੋਲਿੰਗਰ ਬੈਂਡ ਨੂੰ ਹੇਠਲੇ ਵਾਲੀਅਮ ਦੀ ਪੁਸ਼ਟੀ ਨਾਲ ਓਵਰਲੇ ਕਰਦਾ ਹੈ — .",
      "ana-compare": "ਤੁਲਨਾ % ਦੇ ਨਾਲ, ਇੱਕ ਅਨੁਕੂਲ ਪੀਅਰ ਜਾਂ ਸੂਚਕਾਂਕ ਦੇ ਮੁਕਾਬਲੇ 0% ਤੋਂ ਸ਼ੁੱਧ ਪ੍ਰਤੀਸ਼ਤ ਲਾਭ ਜਾਂ Alpha Spread ਨੂੰ ਮਾਪੋ — .",
      "ana-micro": "ਮਾਈਕ੍ਰੋ ਐਂਡ ਫਲੋ 20d Z-ਸਕੋਰ, ਸਪ੍ਰੈਡ ਤਰਲਤਾ ਡਿਸਲੋਕੇਸ਼ਨ, ਅਤੇ P-06 ਅਨੌਮਲੀ ਸਕੋਰ ਦੁਆਰਾ ਵਾਲੀਅਮ ਸਪਾਈਕਸ ਦਾ ਪਤਾ ਲਗਾਉਂਦਾ ਹੈ — .",
      "ana-engines": "ਚੌਥਾ ਟੈਬ ਇੱਕ ਗਤੀਸ਼ੀਲ ਐਡ-ਹਾਕ ਟੂਲ ਹੈ ਜੋ ਸੰਪੱਤੀ ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਬਦਲਦਾ ਹੈ: ਕਿਉਂਕਿ NVDA ਇੱਕ ਇਕੁਇਟੀ ਹੈ ਇਹ 3D ਅਸਥਿਰਤਾ ਅਤੇ ਵਿਕਲਪਾਂ ਦੇ ਭੁਗਤਾਨ ਨੂੰ ਖੋਲ੍ਹਦਾ ਹੈ, ਜਦੋਂ ਕਿ ਬਾਂਡ, FX, ਅਤੇ ਵਸਤੂਆਂ ਆਪਣੇ ਖੁਦ ਦੇ ਵਿਸ਼ੇਸ਼ ਟੂਲ ਲਾਂਚ ਕਰਦੀਆਂ ਹਨ — .",
      "res-hero": "ਸਿਖਰ 'ਤੇ, ਸਕੋਰ ਅਤੇ ਸਟੈਂਡ ਬੁਨਿਆਦੀ ਫੈਸਲੇ, ਵਜ਼ਨਦਾਰ ਰੇਟਿੰਗ, ਅਤੇ ਸਿਰਲੇਖ ਥਰਮਾਮੀਟਰ ਦਾ ਸਾਰ ਦਿੰਦਾ ਹੈ — .",
      "res-rag": "ਖੱਬੇ ਕਾਲਮ ਵਿੱਚ, RAG ਦਸਤਾਵੇਜ਼ ਚੈਟ ਅਧਿਕਾਰਤ SEC 10-K ਅਤੇ 10-Q ਫਾਈਲਿੰਗ ਵਿੱਚ ਆਧਾਰਿਤ ਪ੍ਰਮਾਣਿਤ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿੰਦੀ ਹੈ — .",
      "res-factors": "ਸੈਂਟਰ ਕਾਲਮ ਵਿੱਚ, ਫੈਕਟਰ ਐਕੋਰਡਿਅਨ ਚੋਟੀ ਦੇ 5 ਰਿੱਛ ਜੋਖਮਾਂ ਦੇ ਮੁਕਾਬਲੇ ਚੋਟੀ ਦੇ 5 ਬਲਦ ਡਰਾਈਵਰਾਂ ਦੇ ਉਲਟ ਹੈ — .",
      "res-pulse24h": "ਸੱਜੇ ਪਾਸੇ, FinBERT ਪਲਸ ਰੀਅਲ ਟਾਈਮ ਵਿੱਚ ਬ੍ਰੇਕਿੰਗ ਸੁਰਖੀਆਂ ਨੂੰ ਸਕੋਰ ਕਰਦਾ ਹੈ ਅਤੇ 24-ਘੰਟੇ ਦੇ ਭਾਵਨਾ ਵਕਰ ਨੂੰ ਪਲਾਟ ਕਰਦਾ ਹੈ — .",
      "p1-pills": "6 ਸੰਖੇਪ ਕਾਰਡ ਲਾਈਵ CAGR, Sharpe ਅਤੇ Sortino, 95% VaR, Max Drawdown, ਅਲਫ਼ਾ, ਅਤੇ ਵਿਭਿੰਨਤਾ ਦੀ ਦੁਬਾਰਾ ਗਣਨਾ ਕਰਦੇ ਹਨ — .",
      "p1-table": "ਵੇਟਿੰਗ ਟੇਬਲ ਵਿੱਚ, 213 ਸੰਪਤੀਆਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਜੋੜੋ, ਸਹੀ ਪ੍ਰਤੀਸ਼ਤ ਵਜ਼ਨ ਸੈੱਟ ਕਰੋ, ਜਾਂ 100% ਤੱਕ ਮੁੜ ਸੰਤੁਲਨ ਬਣਾਓ — .",
      "p1-xray": "ਉੱਪਰ-ਸੱਜੇ, 5-ਟੈਬ ਐਕਸ-ਰੇ ਪੈਨਲ ETF ਓਵਰਲੈਪ, ਐਕਸਪੋਜ਼ਰ, ਬ੍ਰਿਨਸਨ ਐਟ੍ਰਬ੍ਯੂਸ਼ਨ, ਕੈਸ਼ਫਲੋ, ਅਤੇ ਹਿਰਾਸਤ ਦਾ ਆਡਿਟ ਕਰਦਾ ਹੈ — .",
      "p1-calendar": "ਐਕਸ-ਰੇ ਦੇ ਹੇਠਾਂ, ਮਹੀਨਾਵਾਰ ਕੈਲੰਡਰ ਜਨਵਰੀ-ਤੋਂ-ਦਸੰਬਰ ਰਿਟਰਨ ਇਕਸਾਰਤਾ ਅਤੇ YTD ਕੁੱਲ ਦਰਸਾਉਂਦਾ ਹੈ — .",
      "p1-backtest": "ਅਤੇ ਪੂਰੀ-ਚੌੜਾਈ ਦੇ ਹੇਠਾਂ, Backtesting ਤੁਹਾਡੇ ਪੋਰਟਫੋਲੀਓ ਦੀ S&P 500, 60/40, All-Weather, ਅਤੇ Min-Variance ਨਾਲ ਤੁਲਨਾ ਕਰਦਾ ਹੈ — .",
      "p2-markowitz": "ਪਹਿਲਾ ਕੁਆਡ੍ਰੈਂਟ 2D Markowitz ਕੁਸ਼ਲ ਫਰੰਟੀਅਰ ਨੂੰ ਪਲਾਟ ਕਰਦਾ ਹੈ ਅਤੇ Min-Var ਅਤੇ Max-Sharpe ਬਨਾਮ ਤੁਹਾਡੇ ਪੋਰਟਫੋਲੀਓ ਦੀ ਸਥਿਤੀ ਰੱਖਦਾ ਹੈ — .",
      "p2-tornado": "ਹੇਠਾਂ-ਖੱਬੇ ਕੁਆਡਰੈਂਟ 5 ਇਤਿਹਾਸਕ ਸੰਕਟਾਂ, ਪ੍ਰਤੀ-ਸੰਪੱਤੀ 95% VaR ਯੋਗਦਾਨ, ਅਤੇ ਅੱਪਸਾਈਡ/ਡਾਊਨਸਾਈਡ ਕੈਪਚਰ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ — .",
      "p2-corr": "ਉੱਪਰ-ਸੱਜੇ, 6×6 ਮੈਟ੍ਰਿਕਸ ਸੰਕਟ ਪੂਛ ਛੂਤ ਦੇ ਵਿਰੁੱਧ ਆਮ ਸਥਿਤੀਆਂ ਵਿੱਚ ਸਬੰਧਾਂ ਦੀ ਤੁਲਨਾ ਕਰਦਾ ਹੈ — .",
      "p2-shock2d": "ਹੇਠਾਂ-ਸੱਜੇ, ਸਦਮਾ ਅਤੇ ਮਾਰਕੋਵ S&P 500 ਚਾਲਾਂ ਦੇ ਨਾਲ ਵਿਆਜ ਦਰ ਸ਼ਿਫਟਾਂ ਨੂੰ ਪਾਰ ਕਰਦਾ ਹੈ ਅਤੇ ਸ਼ਾਸਨ ਤਬਦੀਲੀਆਂ ਦਾ ਅਨੁਮਾਨ ਲਗਾਉਂਦਾ ਹੈ — .",
      "p2-montecarlo": "ਅਤੇ ਹੇਠਲਾ ਪੈਨਲ P95, P50, ਅਤੇ P05 ਵਿੱਚ 10,000 Monte Carlo ਮਾਰਗਾਂ, ਪਾਣੀ ਦੇ ਹੇਠਾਂ ਡਰਾਅਡਾਊਨ, ਅਤੇ ਰੋਲਿੰਗ Sharpe ਨੂੰ ਪ੍ਰੋਜੈਕਟ ਕਰਦਾ ਹੈ — .",
      "p3-impact": "6 ਇਮਪੈਕਟ ਕਾਰਡ ਤੁਹਾਡੇ ਮੌਜੂਦਾ ਪੋਰਟਫੋਲੀਓ ਦੀ ਤੁਲਨਾ ਤੁਹਾਡੇ ਸਿਮੂਲੇਟਡ ਵਪਾਰਾਂ ਤੋਂ ਬਾਅਦ ਅਨੁਮਾਨਿਤ ਸਥਿਤੀ ਨਾਲ ਕਰਦੇ ਹਨ — .",
      "p3-whatif": "ਉੱਪਰ-ਖੱਬੇ, What-If ਅਤੇ ਕੈਲੀ ਟਿਕਟਾਂ ਖਰੀਦਣ ਜਾਂ ਵੇਚਣ ਦੀ ਨਕਲ ਕਰਦਾ ਹੈ ਅਤੇ ਅਨੁਕੂਲ Half-Kelly ਸਥਿਤੀ ਆਕਾਰ ਦੀ ਗਣਨਾ ਕਰਦਾ ਹੈ — .",
      "p3-tailhedge": "ਹੇਠਾਂ-ਖੱਬੇ, OTM ਪੁਟ ਅਤੇ ਮਾਰਜਿਨ ਸੁਰੱਖਿਆ ਵਿਕਲਪ ਸ਼ੀਲਡਾਂ ਦੀ ਨਕਲ ਕਰਦਾ ਹੈ ਅਤੇ Reg-T ਮੇਨਟੇਨੈਂਸ ਮਾਰਜਿਨ ਦੀ ਨਿਗਰਾਨੀ ਕਰਦਾ ਹੈ — .",
      "p3-committee": "ਦੋ ਸੱਜੇ ਪੈਨਲਾਂ ਵਿੱਚ, 3-ਥੰਮ੍ਹ ਵਾਲੀ ਕਮੇਟੀ ਐਗਜ਼ੀਕਿਊਸ਼ਨ ਲੌਗ ਅਤੇ ਕੋਪਾਇਲਟ ਦੇ ਨਾਲ-ਨਾਲ ਜੋਖਮ ਪਹਿਰੇਦਾਰਾਂ ਦਾ ਆਡਿਟ ਕਰਦੀ ਹੈ — .",
      "p3-walkforward": "ਅਤੇ ਹੇਠਾਂ, Walk-Forward ਚਾਰਟ WFE ਸੂਚਕਾਂਕ ਦੇ ਨਾਲ In-Sample ਅਤੇ Out-of-Sample ਪ੍ਰਦਰਸ਼ਨ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਕਰਦਾ ਹੈ — ."
    }
  },
  "TA": {
    "ui": {
      "walkthrough": "லைவ் விஷுவல் வாக்த்ரூ",
      "clickPlayPause": "விளையாட அல்லது இடைநிறுத்த கிளிக் செய்யவும் (ஸ்பேஸ்)",
      "subtitles": "வசன வரிகள் (C)",
      "fullscreen": "முழுத்திரை (F)",
      "exitFullscreen": "முழுத்திரையிலிருந்து வெளியேறு (F அல்லது Esc)",
      "portTabs": [
        "கட்டுபவர்",
        "ஆபத்து",
        "சிமுலேட்டர்",
        "துணை விமானி"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • மொழிகள்",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • வகைகள்",
      "scr-pulse": "02 • 24 மணிநேர துடிப்பு",
      "scr-table": "03 • அட்டவணை",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • வெப்ப வரைபடம்",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • தொழில்நுட்பம்",
      "ana-compare": "03 • ஒப்பிடு %",
      "ana-micro": "04 • மைக்ரோ & ஃப்ளோ",
      "ana-engines": "05 • 3D/2D என்ஜின்கள்",
      "res-hero": "01 • மதிப்பெண் மற்றும் நிலைப்பாடு",
      "res-rag": "02 • RAG அரட்டை",
      "res-factors": "03 • காரணிகள்",
      "res-pulse24h": "04 • FinBERT பல்ஸ்",
      "p1-pills": "01 • சுருக்கம்",
      "p1-table": "02 • எடையிடுதல்",
      "p1-xray": "03 • எக்ஸ்-ரே",
      "p1-calendar": "04 • நாட்காட்டி",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • டொர்னாடோ & VaR",
      "p2-corr": "03 • தொடர்பு",
      "p2-shock2d": "04 • அதிர்ச்சி & மார்கோவ்",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • தாக்கம்",
      "p3-whatif": "02 • What-If & கெல்லி",
      "p3-tailhedge": "03 • OTM புட் & மார்ஜின்",
      "p3-committee": "04 • குழு & பதிவு",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home திரைக்கு வரவேற்கிறோம்: உங்கள் கவனச்சிதறல் இல்லாத தொடக்கப் புள்ளி சந்தைகள் டிகோட் செய்யப்படும்.",
      "home-header": "Header இன் மேல்-இடது மூலையில், λ ஐகானைக் கிளிக் செய்வதன் மூலம், நீங்கள் எப்போதும் இந்த முக்கிய நிலைக்குத் திரும்புவீர்கள்.",
      "home-markets": "Header இன் உச்சியில் அமைந்துள்ள Markets, உங்கள் பணிநிலையம் 213 உலகளாவிய சொத்துக்களை நேரடியாக ஆய்வு செய்யும்.",
      "home-portfolio": "மையப்படுத்தப்பட்ட மெனுவில் அதன் அருகில் Portfolio உள்ளது, இது ஒதுக்கீடுகளை உருவாக்க, மன அழுத்த சோதனை அபாயத்தை மற்றும் வர்த்தகங்களை உருவகப்படுத்துகிறது.",
      "home-system": "கீழ்-இடது Footer இல், System சேவையகங்கள் மற்றும் தரவுத்தளங்களுக்கான நேரடி கண்காணிப்பு மானிட்டரைத் திறக்கும்.",
      "home-guide": "அதைத் தவிர, Guide இந்த ஊடாடும் படி-படி-படி கையேட்டை உங்களுக்குத் தேவைப்படும் போதெல்லாம் திறக்கிறது.",
      "home-langs": "கீழ்-வலது மூலையில், பிளாட்ஃபார்மை 56 மொழிகளில் மொழிபெயர்க்க, மொழி பொத்தான் மையப்படுத்தப்பட்ட மாதிரியைத் திறக்கிறது.",
      "home-palettes": "மேலும் Palette நிதி பச்சை மற்றும் சிவப்பு நிறத்தை அப்படியே வைத்திருக்கும் போது 5 காட்சி வாசிப்பு தீம்களைத் திறக்கிறது.",
      "scr-categories": "மேல் வகைகள் பட்டியில், அனைத்து 213 சொத்துக்கள், உங்கள் Watchlist அல்லது 10 சிறப்பு சந்தைகளில் வடிகட்டவும்.",
      "scr-pulse": "4 பல்ஸ் 24ஹெச் கார்டுகள் ஒருங்கிணைக்கப்பட்ட ஒலியளவு, சராசரி RSI, P-06 ஆட்சி மற்றும் அதிக அளவு இடப்பெயர்வுகளைக் காட்டுகின்றன.",
      "scr-table": "ஊடாடும் அட்டவணையில் உடனடி தேடல், பிடித்தவை மற்றும் ஒவ்வொரு சொத்து வகுப்பிற்கும் ஏற்றவாறு ஸ்மார்ட் நெடுவரிசைகள் உள்ளன.",
      "scr-orbital": "Orbital காட்சியானது லைவ் சைட் இன்ஸ்பெக்ஷன் பேனல் மூலம் விலகல் மூலம் மூன்று செறிவு வளையங்களில் உள்ள சொத்துக்களை வரைபடமாக்குகிறது.",
      "scr-heatmap": "ஹீட்மேப் முதல் 10 சொத்துக்களை 8 பச்சை மற்றும் சிவப்பு நிறங்களில் விகிதாசார தொகுதிகளாக அமைக்கிறது.",
      "scr-maintools": "மற்றும் Main Tools இறையாண்மை வளைவுகள், 3D ஏற்ற இறக்கம், FX குறுக்கு மற்றும் எதிர்கால இயந்திரங்களுக்கு மூன்று படிகளில் உங்களை வழிநடத்துகிறது.",
      "ana-hero": "Header அசெட் ஸ்விட்சர், 1m முதல் ALL வரையிலான 9 காலகட்டங்கள் மற்றும் 5 முக்கிய குறிகாட்டிகளை ஒருங்கிணைக்கிறது.",
      "ana-technical": "தொழில்நுட்ப லென்ஸ் SMA 20, VWAP மற்றும் 2σ பொலிங்கர் பட்டைகள் கீழ் தொகுதி உறுதிப்படுத்தலுடன் மேலெழுகிறது.",
      "ana-compare": "ஒப்பிடு% உடன், நிகர சதவீத நன்மை அல்லது Alpha Spread ஐ 0% இலிருந்து இணக்கமான பியர் அல்லது இன்டெக்ஸுக்கு எதிராக அளவிடவும்.",
      "ana-micro": "மைக்ரோ & ஃப்ளோ 20d Z-ஸ்கோர், ஸ்ப்ரெட் லிக்விடிட்டி டிஸ்லோகேஷன் மற்றும் P-06 அனோமாலி ஸ்கோர் மூலம் வால்யூம் ஸ்பைக்குகளைக் கண்டறிகிறது.",
      "ana-engines": "நான்காவது தாவல் என்பது சொத்து வகுப்பின் அடிப்படையில் மாறுபடும் டைனமிக் தற்காலிகக் கருவியாகும்: NVDA என்பது ஒரு சமபங்கு என்பதால் இது 3D வாலட்டிலிட்டி & ஆப்ஷன்ஸ் பேஆஃப் திறக்கிறது, அதே நேரத்தில் பத்திரங்கள், எஃப்எக்ஸ் மற்றும் கமாடிட்டிகள் அவற்றின் சொந்த சிறப்புக் கருவிகளை வெளியிடுகின்றன.",
      "res-hero": "மேலே, மதிப்பெண் மற்றும் நிலைப்பாடு அடிப்படை தீர்ப்பு, எடை மதிப்பீடு மற்றும் தலைப்பு வெப்பமானி ஆகியவற்றை சுருக்கமாகக் கூறுகிறது.",
      "res-rag": "இடது நெடுவரிசையில், RAG ஆவண அரட்டை அதிகாரப்பூர்வ SEC 10-K மற்றும் 10-Q தாக்கல்களில் உள்ள சரிபார்க்கப்பட்ட கேள்விகளுக்கு பதிலளிக்கிறது.",
      "res-factors": "மைய நெடுவரிசையில், ஃபேக்டர்ஸ் துருத்தியானது முதல் 5 காளை ஓட்டுநர்களை முதல் 5 கரடி அபாயங்களுக்கு எதிராக வேறுபடுத்துகிறது.",
      "res-pulse24h": "வலதுபுறத்தில், FinBERT பல்ஸ் நிகழ்நேரத்தில் தலைப்புச் செய்திகளை முறியடித்து, 24 மணிநேர உணர்வு வளைவைத் திட்டமிடுகிறது.",
      "p1-pills": "6 சுருக்க அட்டைகள் நேரடி CAGR, Sharpe மற்றும் Sortino, 95% VaR, Max Drawdown, ஆல்பா மற்றும் பல்வகைப்படுத்தல் ஆகியவற்றை மீண்டும் கணக்கிடுகின்றன.",
      "p1-table": "எடையிடல் அட்டவணையில், 213 சொத்துக்களில் ஏதேனும் ஒன்றைச் சேர்க்கவும், சரியான சதவீத எடைகளை அமைக்கவும் அல்லது 100%க்கு மறு சமநிலைப்படுத்தவும்.",
      "p1-xray": "மேல்-வலது, 5-டேப் எக்ஸ்-ரே பேனல் ப.ப.வ.நிதி மேலெழுதல், வெளிப்பாடு, பிரின்சன் பண்புக்கூறு, பணப்புழக்கம் மற்றும் காவலில் தணிக்கை செய்கிறது.",
      "p1-calendar": "எக்ஸ்-ரேக்கு கீழே, மாதாந்திர நாட்காட்டி ஜனவரி முதல் டிசம்பர் வரை திரும்பும் நிலைத்தன்மையையும் YTD மொத்தத்தையும் காட்டுகிறது.",
      "p1-backtest": "முழு அகலத்தின் அடிப்பகுதியில், Backtesting உங்கள் போர்ட்ஃபோலியோவை S&P 500, 60/40, All-Weather மற்றும் Min-Variance ஆகியவற்றுடன் ஒப்பிடுகிறது.",
      "p2-markowitz": "முதல் குவாட்ரன்ட் 2D Markowitz திறமையான எல்லையை வரைந்து, உங்கள் போர்ட்ஃபோலியோவை Min-Var மற்றும் Max-Sharpe ஆகியவற்றுக்கு எதிராக நிலைநிறுத்துகிறது.",
      "p2-tornado": "கீழ்-இடது நாற்கரத்தில் 5 வரலாற்று நெருக்கடிகள், ஒவ்வொரு சொத்துக்கும் 95% VaR பங்களிப்பு மற்றும் தலைகீழ்/கீழ்நிலைப் பிடிப்பு ஆகியவற்றைச் சோதிக்கிறது.",
      "p2-corr": "மேல்-வலது, 6×6 மேட்ரிக்ஸ் நெருக்கடி வால் தொற்றுக்கு எதிராக இயல்பான நிலையில் உள்ள தொடர்புகளை ஒப்பிடுகிறது.",
      "p2-shock2d": "கீழ்-வலது, அதிர்ச்சி & மார்கோவ் S&P 500 நகர்வுகளுடன் வட்டி விகித மாற்றங்களைக் கடந்து ஆட்சி மாற்றங்களை மதிப்பிடுகிறது.",
      "p2-montecarlo": "மேலும் கீழ் பேனல் P95, P50 மற்றும் P05, நீருக்கடியில் டிராடவுன் மற்றும் ரோலிங் Sharpe முழுவதும் 10,000 Monte Carlo பாதைகளை திட்டமிடுகிறது.",
      "p3-impact": "6 தாக்க அட்டைகள் உங்களின் தற்போதைய போர்ட்ஃபோலியோவை உங்களின் உருவகப்படுத்தப்பட்ட வர்த்தகத்திற்குப் பிறகு திட்டமிடப்பட்ட நிலைக்கு எதிராக ஒப்பிடுகின்றன.",
      "p3-whatif": "மேல்-இடது, What-If & கெல்லி டிக்கெட்டுகளை வாங்க அல்லது விற்பதை உருவகப்படுத்துகிறது மற்றும் உகந்த Half-Kelly நிலை அளவைக் கணக்கிடுகிறது.",
      "p3-tailhedge": "கீழ்-இடது, OTM புட் & விளிம்பு பாதுகாப்பு விருப்ப கவசங்களை உருவகப்படுத்துகிறது மற்றும் Reg-T பராமரிப்பு விளிம்பை கண்காணிக்கிறது.",
      "p3-committee": "இரண்டு வலது பேனல்களில், 3-தூண் கமிட்டி, எக்ஸிகியூஷன் லாக் மற்றும் கோபிலட்டுடன் இணைந்து ரிஸ்க் காவலர்களைத் தணிக்கை செய்கிறது.",
      "p3-walkforward": "மேலும் கீழே, Walk-Forward விளக்கப்படம் In-Sample மற்றும் Out-of-Sample செயல்திறனை WFE குறியீட்டுடன் சரிபார்க்கிறது."
    }
  },
  "TE": {
    "ui": {
      "walkthrough": "ప్రత్యక్ష విజువల్ వాక్‌త్రూ",
      "clickPlayPause": "ప్లే చేయడానికి క్లిక్ చేయండి లేదా పాజ్ చేయండి (స్పేస్)",
      "subtitles": "ఉపశీర్షికలు (సి)",
      "fullscreen": "పూర్తి స్క్రీన్ (F)",
      "exitFullscreen": "పూర్తి స్క్రీన్ నుండి నిష్క్రమించు (F లేదా Esc)",
      "portTabs": [
        "బిల్డర్",
        "ప్రమాదం",
        "సిమ్యులేటర్",
        "కోపైలట్"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • భాషలు",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • వర్గాలు",
      "scr-pulse": "02 • 24h పల్స్",
      "scr-table": "03 • పట్టిక",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • హీట్‌మ్యాప్",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • సాంకేతిక",
      "ana-compare": "03 • సరిపోల్చండి %",
      "ana-micro": "04 • మైక్రో & ఫ్లో",
      "ana-engines": "05 • 3D/2D ఇంజన్లు",
      "res-hero": "01 • స్కోర్ & స్టాన్స్",
      "res-rag": "02 • RAG చాట్",
      "res-factors": "03 • కారకాలు",
      "res-pulse24h": "04 • FinBERT పల్స్",
      "p1-pills": "01 • సారాంశం",
      "p1-table": "02 • వెయిటింగ్",
      "p1-xray": "03 • ఎక్స్-రే",
      "p1-calendar": "04 • క్యాలెండర్",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • సుడిగాలి & VaR",
      "p2-corr": "03 • సహసంబంధం",
      "p2-shock2d": "04 • షాక్ & మార్కోవ్",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • ప్రభావం",
      "p3-whatif": "02 • What-If & కెల్లీ",
      "p3-tailhedge": "03 • OTM పుట్ & మార్జిన్",
      "p3-committee": "04 • కమిటీ & లాగ్",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home స్క్రీన్‌కు స్వాగతం: మార్కెట్‌లు డీకోడ్ చేయబడే మీ పరధ్యాన రహిత ప్రారంభ స్థానం.",
      "home-header": "Header యొక్క ఎగువ-ఎడమ మూలలో, λ చిహ్నాన్ని క్లిక్ చేయడం ద్వారా మీరు ఎల్లప్పుడూ ఈ ప్రధాన దశకు తిరిగి చేరుకుంటారు.",
      "home-markets": "Header ఎగువన కేంద్రీకృతమై ఉన్న Markets, మొత్తం 213 గ్లోబల్ ఆస్తులను ప్రత్యక్షంగా పరిశోధించడానికి మీ వర్క్‌స్టేషన్.",
      "home-portfolio": "కేటాయింపులు, ఒత్తిడి-పరీక్ష రిస్క్ మరియు ట్రేడ్‌లను అనుకరించడం కోసం కేంద్రీకృత మెనులో దాని పక్కనే Portfolio ఉంది.",
      "home-system": "దిగువ-ఎడమ Footerలో, System సర్వర్‌లు మరియు డేటాబేస్‌ల కోసం ప్రత్యక్ష పరిశీలన మానిటర్‌ను తెరుస్తుంది.",
      "home-guide": "దాని పక్కన, Guide మీకు అవసరమైనప్పుడు ఈ ఇంటరాక్టివ్ స్టెప్-బై-స్టెప్ మాన్యువల్‌ని తెరుస్తుంది.",
      "home-langs": "దిగువ-కుడి మూలలో, ప్లాట్‌ఫారమ్‌ను 56 భాషల్లోకి అనువదించడానికి భాష బటన్ కేంద్రీకృత మోడల్‌ను తెరుస్తుంది.",
      "home-palettes": "మరియు Palette 5 విజువల్ రీడింగ్ థీమ్‌లను తెరుస్తుంది, అయితే ఫైనాన్షియల్ గ్రీన్ మరియు ఎరుపును ఖచ్చితంగా చెక్కుచెదరకుండా ఉంచుతుంది.",
      "scr-categories": "టాప్ కేటగిరీల బార్‌లో, మొత్తం 213 ఆస్తులు, మీ Watchlist లేదా 10 ప్రత్యేక మార్కెట్‌లలో ఫిల్టర్ చేయండి.",
      "scr-pulse": "4 పల్స్ 24h కార్డ్‌లు సమగ్ర వాల్యూమ్, సగటు RSI, P-06 పాలన మరియు టాప్ వాల్యూమ్ డిస్‌లోకేషన్‌లను చూపుతాయి.",
      "scr-table": "ఇంటరాక్టివ్ టేబుల్‌లో తక్షణ శోధన, ఇష్టమైనవి మరియు ప్రతి ఆస్తి తరగతికి అనుగుణంగా స్మార్ట్ నిలువు వరుసలు ఉంటాయి.",
      "scr-orbital": "Orbital వీక్షణ ప్రత్యక్ష వైపు తనిఖీ ప్యానెల్‌తో విచలనం ద్వారా మూడు కేంద్రీకృత వలయాల్లో ఆస్తులను మ్యాప్ చేస్తుంది.",
      "scr-heatmap": "హీట్‌మ్యాప్ టాప్ 10 ఆస్తులను 8 ఆకుపచ్చ మరియు ఎరుపు షేడ్స్‌లో అనుపాత బ్లాక్‌లుగా అమర్చుతుంది.",
      "scr-maintools": "మరియు Main Tools సార్వభౌమ వక్రతలు, 3D అస్థిరత, FX క్రాస్ మరియు ఫ్యూచర్స్ ఇంజిన్‌లకు మూడు దశల్లో మీకు మార్గనిర్దేశం చేస్తుంది.",
      "ana-hero": "Header ఆస్తి స్విచ్చర్, 1m నుండి ALL వరకు 9 సమయ ఫ్రేమ్‌లు మరియు 5 ప్రధాన సూచికలను మిళితం చేస్తుంది.",
      "ana-technical": "సాంకేతిక లెన్స్ దిగువ వాల్యూమ్ నిర్ధారణతో SMA 20, VWAP మరియు 2σ బోలింగర్ బ్యాండ్‌లను అతివ్యాప్తి చేస్తుంది.",
      "ana-compare": "సరిపోల్చండి %తో, అనుకూలమైన పీర్ లేదా ఇండెక్స్‌తో 0% నుండి నికర శాతం ప్రయోజనాన్ని లేదా Alpha Spreadని కొలవండి.",
      "ana-micro": "మైక్రో & ఫ్లో 20d Z-స్కోర్, స్ప్రెడ్ లిక్విడిటీ డిస్‌లోకేషన్ మరియు P-06 అనోమలీ స్కోర్ ద్వారా వాల్యూమ్ స్పైక్‌లను గుర్తిస్తుంది.",
      "ana-engines": "నాల్గవ ట్యాబ్ అనేది ఆస్తి తరగతిని బట్టి మారే డైనమిక్ తాత్కాలిక సాధనం: NVDA ఈక్విటీ అయినందున ఇది 3D అస్థిరత & ఎంపికల చెల్లింపును తెరుస్తుంది, అయితే బాండ్‌లు, FX మరియు వస్తువులు వాటి స్వంత ప్రత్యేక సాధనాలను ప్రారంభిస్తాయి.",
      "res-hero": "ఎగువన, స్కోర్ & స్టాన్స్ ప్రాథమిక తీర్పు, వెయిటెడ్ రేటింగ్ మరియు హెడ్‌లైన్ థర్మామీటర్‌ను సంగ్రహిస్తుంది.",
      "res-rag": "ఎడమ కాలమ్‌లో, RAG డాక్యుమెంట్ చాట్ అధికారిక SEC 10-K మరియు 10-Q ఫైలింగ్‌ల ఆధారంగా ధృవీకరించబడిన ప్రశ్నలకు సమాధానమిస్తుంది.",
      "res-factors": "మధ్య కాలమ్‌లో, ఫాక్టర్స్ అకార్డియన్ టాప్ 5 బుల్ డ్రైవర్‌లను టాప్ 5 బేర్ రిస్క్‌లకు విరుద్ధంగా చూపుతుంది.",
      "res-pulse24h": "కుడివైపున, FinBERT పల్స్ నిజ సమయంలో ముఖ్యాంశాలను బద్దలు కొట్టి, 24-గంటల సెంటిమెంట్ కర్వ్‌ను ప్లాట్ చేస్తుంది.",
      "p1-pills": "6 సారాంశం కార్డ్‌లు లైవ్ CAGR, Sharpe మరియు Sortino, 95% VaR, Max Drawdown, ఆల్ఫా మరియు డైవర్సిఫికేషన్‌ను రీకంప్యూట్ చేస్తాయి.",
      "p1-table": "వెయిటింగ్ టేబుల్‌లో, 213 ఆస్తులలో దేనినైనా జోడించండి, ఖచ్చితమైన శాతం బరువులను సెట్ చేయండి లేదా 100%కి రీబ్యాలెన్స్ చేయండి.",
      "p1-xray": "ఎగువ-కుడి, 5-ట్యాబ్ ఎక్స్-రే ప్యానెల్ ETF అతివ్యాప్తి, బహిర్గతం, బ్రిన్సన్ అట్రిబ్యూషన్, నగదు ప్రవాహం మరియు కస్టడీని ఆడిట్ చేస్తుంది.",
      "p1-calendar": "X-రే క్రింద, నెలవారీ క్యాలెండర్ జనవరి నుండి డిసెంబర్ వరకు తిరిగి వచ్చే స్థిరత్వం మరియు YTD మొత్తాలను ప్రదర్శిస్తుంది.",
      "p1-backtest": "మరియు పూర్తి వెడల్పు దిగువన, Backtesting మీ పోర్ట్‌ఫోలియోను S&P 500, 60/40, All-Weather మరియు Min-Varianceతో పోల్చింది.",
      "p2-markowitz": "మొదటి క్వాడ్రంట్ 2D Markowitz సమర్థవంతమైన సరిహద్దును ప్లాట్ చేస్తుంది మరియు Min-Var మరియు Max-Sharpe వర్సెస్ మీ పోర్ట్‌ఫోలియోను ఉంచుతుంది.",
      "p2-tornado": "దిగువ-ఎడమ క్వాడ్రంట్ 5 చారిత్రక సంక్షోభాలను, ఒక్కో ఆస్తికి 95% VaR సహకారం మరియు అప్‌సైడ్/డౌన్‌సైడ్ క్యాప్చర్‌ని పరీక్షిస్తుంది.",
      "p2-corr": "ఎగువ-కుడి, 6×6 మ్యాట్రిక్స్ సంక్షోభం తోక అంటువ్యాధికి వ్యతిరేకంగా సాధారణ పరిస్థితుల్లో సహసంబంధాలను పోల్చింది.",
      "p2-shock2d": "దిగువ-కుడి, షాక్ & మార్కోవ్ S&P 500 కదలికలతో వడ్డీ రేటు మార్పులను దాటుతుంది మరియు పాలన పరివర్తనలను అంచనా వేస్తుంది.",
      "p2-montecarlo": "మరియు దిగువ ప్యానెల్ P95, P50 మరియు P05, నీటి అడుగున డ్రాడౌన్ మరియు రోలింగ్ Sharpe అంతటా 10,000 Monte Carlo పాత్‌లను ప్రొజెక్ట్ చేస్తుంది.",
      "p3-impact": "6 ఇంపాక్ట్ కార్డ్‌లు మీ ప్రస్తుత పోర్ట్‌ఫోలియోను మీ అనుకరణ ట్రేడ్‌ల తర్వాత అంచనా వేసిన స్థితితో సరిపోల్చుతాయి.",
      "p3-whatif": "ఎగువ-ఎడమ, What-If & కెల్లీ టిక్కెట్ల కొనుగోలు లేదా అమ్మకాన్ని అనుకరిస్తుంది మరియు సరైన Half-Kelly స్థాన పరిమాణాన్ని గణిస్తుంది.",
      "p3-tailhedge": "దిగువ-ఎడమ, OTM పుట్ & మార్జిన్ రక్షణ ఎంపిక షీల్డ్‌లను అనుకరిస్తుంది మరియు Reg-T నిర్వహణ మార్జిన్‌ను పర్యవేక్షిస్తుంది.",
      "p3-committee": "రెండు కుడి ప్యానెల్‌లలో, 3-స్తంభాల కమిటీ ఎగ్జిక్యూషన్ లాగ్ మరియు కోపైలట్‌తో పాటు రిస్క్ గార్డ్‌రైల్‌లను ఆడిట్ చేస్తుంది.",
      "p3-walkforward": "మరియు దిగువన, Walk-Forward చార్ట్ WFE సూచికతో In-Sample మరియు Out-of-Sample పనితీరును ధృవీకరిస్తుంది."
    }
  },
  "MR": {
    "ui": {
      "walkthrough": "थेट व्हिज्युअल वॉकथ्रू",
      "clickPlayPause": "प्ले करण्यासाठी क्लिक करा किंवा विराम द्या (स्पेस)",
      "subtitles": "उपशीर्षके (C)",
      "fullscreen": "पूर्णस्क्रीन (F)",
      "exitFullscreen": "फुलस्क्रीनमधून बाहेर पडा (F किंवा Esc)",
      "portTabs": [
        "बिल्डर",
        "धोका",
        "सिम्युलेटर",
        "सहपायलट"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • भाषा",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • श्रेण्या",
      "scr-pulse": "02 • 24 तास पल्स",
      "scr-table": "03 • टेबल",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • हीटमॅप",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • तांत्रिक",
      "ana-compare": "03 • % तुलना करा",
      "ana-micro": "04 • सूक्ष्म आणि प्रवाह",
      "ana-engines": "05 • 3D/2D इंजिन",
      "res-hero": "01 • गुण आणि स्थिती",
      "res-rag": "02 • RAG गप्पा",
      "res-factors": "03 • घटक",
      "res-pulse24h": "04 • FinBERT पल्स",
      "p1-pills": "01 • सारांश",
      "p1-table": "02 • भारनियमन",
      "p1-xray": "03 • एक्स-रे",
      "p1-calendar": "04 • कॅलेंडर",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • चक्रीवादळ आणि VaR",
      "p2-corr": "03 • सहसंबंध",
      "p2-shock2d": "04 • शॉक आणि मार्कोव्ह",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • प्रभाव",
      "p3-whatif": "02 • What-If आणि केली",
      "p3-tailhedge": "03 • OTM पुट आणि मार्जिन",
      "p3-committee": "04 • समिती आणि लॉग",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home स्क्रीनवर आपले स्वागत आहे: तुमचा विचलित न होणारा प्रारंभ बिंदू जिथे बाजार डीकोड केले जातात.",
      "home-header": "Header च्या वरच्या-डाव्या कोपऱ्यात, λ चिन्हावर क्लिक केल्याने तुम्हाला नेहमी या मुख्य स्टेजवर परत आणले जाते.",
      "home-markets": "Header च्या शीर्षस्थानी केंद्रस्थानी Markets आहे, सर्व 213 जागतिक मालमत्तांचे थेट संशोधन करण्यासाठी तुमचे वर्कस्टेशन.",
      "home-portfolio": "केंद्रीत मेनूमध्ये त्याच्या बाजूला Portfolio आहे, वाटप तयार करण्यासाठी, तणाव-चाचणी जोखीम आणि व्यवहारांचे अनुकरण करण्यासाठी.",
      "home-system": "खाली-डावीकडे Footer, System सर्व्हर आणि डेटाबेससाठी थेट निरीक्षणक्षमता मॉनिटर उघडतो.",
      "home-guide": "त्याच्या बाजूला, Guide हे परस्परसंवादी चरण-दर-चरण मॅन्युअल जेव्हा तुम्हाला आवश्यक असेल तेव्हा उघडते.",
      "home-langs": "तळाशी-उजव्या कोपर्यात, प्लॅटफॉर्मचे 56 भाषांमध्ये भाषांतर करण्यासाठी भाषा बटण मध्यभागी मोडेल उघडते.",
      "home-palettes": "आणि Palette आर्थिक हिरवा आणि लाल काटेकोरपणे अबाधित ठेवून 5 व्हिज्युअल वाचन थीम उघडते.",
      "scr-categories": "शीर्ष श्रेण्या बारमध्ये, सर्व 213 मालमत्ता, तुमची Watchlist किंवा 10 विशेष बाजारपेठ फिल्टर करा.",
      "scr-pulse": "4 पल्स 24h कार्ड एकत्रित व्हॉल्यूम, सरासरी RSI, P-06 रेजिम आणि टॉप व्हॉल्यूम डिस्लोकेशन दर्शवतात.",
      "scr-table": "परस्परसंवादी सारणीमध्ये झटपट शोध, आवडी आणि प्रत्येक मालमत्ता वर्गासाठी तयार केलेले स्मार्ट स्तंभ समाविष्ट आहेत.",
      "scr-orbital": "Orbital व्ह्यू लाइव्ह साइड इन्स्पेक्शन पॅनेलसह विचलनाद्वारे तीन एकाग्र रिंगांमध्ये मालमत्तेचे नकाशे बनवते.",
      "scr-heatmap": "हीटमॅप शीर्ष 10 मालमत्तांना हिरव्या आणि लाल रंगाच्या 8 छटामध्ये आनुपातिक ब्लॉकमध्ये व्यवस्था करतो.",
      "scr-maintools": "आणि Main Tools तुम्हाला सार्वभौम वक्र, 3D अस्थिरता, FX क्रॉस आणि फ्युचर्स इंजिनसाठी तीन चरणांमध्ये मार्गदर्शन करते.",
      "ana-hero": "Header मालमत्ता स्विचर, 1m ते ALL पर्यंत 9 टाइमफ्रेम आणि 5 मुख्य निर्देशक एकत्र करते.",
      "ana-technical": "तांत्रिक लेन्स SMA 20, VWAP आणि 2σ बॉलिंगर बँड्सना तळाच्या आवाजाच्या पुष्टीकरणासह आच्छादित करते.",
      "ana-compare": "तुलना % सह, निव्वळ टक्केवारीचा फायदा किंवा Alpha Spread 0% वरून सुसंगत समवयस्क किंवा निर्देशांक मोजा.",
      "ana-micro": "मायक्रो आणि फ्लो 20d Z-स्कोअर, स्प्रेड लिक्विडिटी डिस्लोकेशन आणि P-06 विसंगती स्कोअरद्वारे व्हॉल्यूम स्पाइक्स शोधते.",
      "ana-engines": "चौथा टॅब एक डायनॅमिक ॲड-हॉक टूल आहे जो मालमत्ता वर्गानुसार बदलतो: NVDA एक इक्विटी असल्यामुळे ते 3D अस्थिरता आणि पर्याय पेऑफ उघडते, तर बॉन्ड्स, FX आणि कमोडिटीज स्वतःची विशेष साधने लॉन्च करतात.",
      "res-hero": "शीर्षस्थानी, स्कोअर आणि स्थिती मूलभूत निर्णय, भारित रेटिंग आणि हेडलाइन थर्मामीटरचा सारांश देते.",
      "res-rag": "डाव्या स्तंभात, RAG दस्तऐवज चॅट अधिकृत SEC 10-K आणि 10-Q फाइलिंगमध्ये आधारलेल्या सत्यापित प्रश्नांची उत्तरे देते.",
      "res-factors": "मध्यभागी कॉलममध्ये, फॅक्टर्स एकॉर्डियन शीर्ष 5 बुल ड्रायव्हर्सच्या विरूद्ध शीर्ष 5 अस्वल जोखमींच्या विरूद्ध आहे.",
      "res-pulse24h": "उजवीकडे, FinBERT पल्स रिअल टाइममध्ये ब्रेकिंग हेडलाइन्स स्कोअर करते आणि 24-तास भावना वक्र प्लॉट करते.",
      "p1-pills": "6 सारांश कार्ड थेट CAGR, Sharpe आणि Sortino, 95% VaR, Max Drawdown, अल्फा आणि विविधीकरणाची पुनर्गणना करतात.",
      "p1-table": "वजन सारणीमध्ये, 213 मालमत्तांपैकी कोणतीही जोडा, अचूक टक्केवारीचे वजन सेट करा किंवा 100% वर पुनर्संतुलन करा.",
      "p1-xray": "शीर्ष-उजवीकडे, 5-टॅब एक्स-रे पॅनेल ETF ओव्हरलॅप, एक्सपोजर, ब्रिन्सन विशेषता, रोख प्रवाह आणि ताब्यात ऑडिट करते.",
      "p1-calendar": "एक्स-रे खाली, मासिक कॅलेंडर जानेवारी-ते-डिसेंबर रिटर्न सातत्य आणि YTD बेरीज दाखवते.",
      "p1-backtest": "आणि पूर्ण-रुंदीच्या तळाशी, Backtesting तुमच्या पोर्टफोलिओची S&P 500, 60/40, All-Weather आणि Min-Variance शी तुलना करते.",
      "p2-markowitz": "पहिला क्वाड्रंट 2D Markowitz कार्यक्षम फ्रंटियर प्लॉट करतो आणि Min-Var आणि Max-Sharpe विरुद्ध तुमचा पोर्टफोलिओ ठेवतो.",
      "p2-tornado": "तळ-डावा चतुर्थांश 5 ऐतिहासिक संकटे, प्रति-मालमत्ता 95% VaR योगदान आणि अपसाइड/डाउनसाइड कॅप्चरची चाचणी घेते.",
      "p2-corr": "शीर्ष-उजवीकडे, 6×6 मॅट्रिक्स क्रायसिस शेपटी संसर्गाविरूद्ध सामान्य परिस्थितीत परस्परसंबंधांची तुलना करते.",
      "p2-shock2d": "तळाशी-उजवीकडे, शॉक आणि मार्कोव्ह S&P 500 हालचालींसह व्याजदरातील शिफ्ट्स ओलांडतात आणि शासनातील संक्रमणाचा अंदाज लावतात.",
      "p2-montecarlo": "आणि तळाचे पॅनेल P95, P50 आणि P05 मध्ये 10,000 Monte Carlo पथ, पाण्याखालील ड्रॉडाउन आणि रोलिंग Sharpe प्रोजेक्ट करते.",
      "p3-impact": "6 इम्पॅक्ट कार्ड तुमच्या वर्तमान पोर्टफोलिओची तुमच्या सिम्युलेटेड ट्रेडनंतर प्रक्षेपित स्थितीशी तुलना करतात.",
      "p3-whatif": "शीर्ष-डावीकडे, What-If आणि केली तिकिटे खरेदी किंवा विक्रीचे अनुकरण करतात आणि इष्टतम Half-Kelly स्थिती आकाराची गणना करतात.",
      "p3-tailhedge": "खाली-डावीकडे, OTM पुट आणि मार्जिन संरक्षणात्मक पर्याय शील्ड्सचे अनुकरण करते आणि Reg-T देखभाल मार्जिनचे निरीक्षण करते.",
      "p3-committee": "दोन उजव्या पॅनेलमध्ये, 3-स्तंभ समिती एक्झिक्युशन लॉग आणि कोपायलटच्या बाजूने जोखीम रेलिंगचे ऑडिट करते.",
      "p3-walkforward": "आणि तळाशी, Walk-Forward चार्ट WFE निर्देशांकासह In-Sample आणि Out-of-Sample कार्यप्रदर्शन प्रमाणित करतो."
    }
  },
  "GU": {
    "ui": {
      "walkthrough": "લાઈવ વિઝ્યુઅલ વોકથ્રુ",
      "clickPlayPause": "રમવા અથવા થોભાવવા માટે ક્લિક કરો (સ્પેસ)",
      "subtitles": "ઉપશીર્ષકો (C)",
      "fullscreen": "પૂર્ણસ્ક્રીન (F)",
      "exitFullscreen": "પૂર્ણસ્ક્રીનથી બહાર નીકળો (F અથવા Esc)",
      "portTabs": [
        "બિલ્ડર",
        "જોખમ",
        "સિમ્યુલેટર",
        "કોપાયલોટ"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • ભાષાઓ",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • શ્રેણીઓ",
      "scr-pulse": "02 • 24 કલાક પલ્સ",
      "scr-table": "03 • ટેબલ",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • હીટમેપ",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • ટેકનિકલ",
      "ana-compare": "03 • % સરખામણી કરો",
      "ana-micro": "04 • માઇક્રો અને ફ્લો",
      "ana-engines": "05 • 3D/2D એન્જિન",
      "res-hero": "01 • સ્કોર અને વલણ",
      "res-rag": "02 • RAG ચેટ",
      "res-factors": "03 • પરિબળો",
      "res-pulse24h": "04 • FinBERT પલ્સ",
      "p1-pills": "01 • સારાંશ",
      "p1-table": "02 • વેઇટીંગ",
      "p1-xray": "03 • એક્સ-રે",
      "p1-calendar": "04 • કેલેન્ડર",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • ટોર્નેડો અને VaR",
      "p2-corr": "03 • સહસંબંધ",
      "p2-shock2d": "04 • શોક અને માર્કોવ",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • અસર",
      "p3-whatif": "02 • What-If અને કેલી",
      "p3-tailhedge": "03 • OTM પુટ અને માર્જિન",
      "p3-committee": "04 • સમિતિ અને લોગ",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home સ્ક્રીન પર આપનું સ્વાગત છે: તમારું વિક્ષેપ-મુક્ત પ્રારંભિક બિંદુ જ્યાં બજારો ડીકોડ થાય છે.",
      "home-header": "Header ના ઉપરના ડાબા ખૂણે, λ આઇકન પર ક્લિક કરવાથી હંમેશા તમને આ મુખ્ય સ્ટેજ પર પાછા લાવે છે.",
      "home-markets": "Header ની ટોચ પર કેન્દ્રિત Markets છે, જે તમામ 213 વૈશ્વિક સંપત્તિઓનું જીવંત સંશોધન કરવા માટેનું તમારું વર્કસ્ટેશન છે.",
      "home-portfolio": "કેન્દ્રીય મેનૂમાં તેની બાજુમાં જ Portfolio છે, ફાળવણી, તણાવ-પરીક્ષણ જોખમ અને વેપારનું અનુકરણ કરવા માટે.",
      "home-system": "નીચે-ડાબી બાજુએ Footer, System સર્વર્સ અને ડેટાબેઝ માટે જીવંત અવલોકનક્ષમતા મોનિટર ખોલે છે.",
      "home-guide": "તેની બાજુમાં, જ્યારે પણ તમને જરૂર હોય ત્યારે Guide આ ઇન્ટરેક્ટિવ સ્ટેપ-બાય-સ્ટેપ મેન્યુઅલ ખોલે છે.",
      "home-langs": "નીચે-જમણા ખૂણે, ભાષા બટન પ્લેટફોર્મને 56 ભાષાઓમાં અનુવાદિત કરવા માટે કેન્દ્રિય મોડલ ખોલે છે.",
      "home-palettes": "અને Palette નાણાકીય લીલા અને લાલને સખત રીતે અકબંધ રાખીને 5 વિઝ્યુઅલ રીડિંગ થીમ્સ ખોલે છે.",
      "scr-categories": "ટોચના કેટેગરીઝ બારમાં, બધી 213 સંપત્તિઓ, તમારી Watchlist અથવા 10 વિશિષ્ટ બજારોમાં ફિલ્ટર કરો.",
      "scr-pulse": "4 પલ્સ 24h કાર્ડ એકંદર વોલ્યુમ, સરેરાશ RSI, P-06 શાસન અને ટોચના વોલ્યુમ ડિસલોકેશન દર્શાવે છે.",
      "scr-table": "ઇન્ટરેક્ટિવ કોષ્ટક દરેક એસેટ ક્લાસને અનુરૂપ ત્વરિત શોધ, મનપસંદ અને સ્માર્ટ કૉલમ દર્શાવે છે.",
      "scr-orbital": "Orbital વ્યુ લાઇવ સાઇડ ઇન્સ્પેક્શન પેનલ સાથે વિચલન દ્વારા ત્રણ કેન્દ્રિત રિંગ્સમાં અસ્કયામતોને નકશા કરે છે.",
      "scr-heatmap": "હીટમેપ ટોચની 10 સંપત્તિઓને લીલા અને લાલના 8 શેડ્સમાં પ્રમાણસર બ્લોકમાં ગોઠવે છે.",
      "scr-maintools": "અને Main Tools તમને સાર્વભૌમ વણાંકો, 3D વોલેટિલિટી, FX ક્રોસ અને ફ્યુચર્સ એન્જિન માટે ત્રણ પગલાંમાં માર્ગદર્શન આપે છે.",
      "ana-hero": "Header એસેટ સ્વિચર, 1m થી ALL સુધીની 9 સમયમર્યાદા અને 5 મુખ્ય સૂચકાંકોને જોડે છે.",
      "ana-technical": "ટેકનિકલ લેન્સ SMA 20, VWAP, અને 2σ બોલિંગર બેન્ડને બોટમ વોલ્યુમ કન્ફર્મેશન સાથે ઓવરલે કરે છે.",
      "ana-compare": "સરખામણી % સાથે, સુસંગત પીઅર અથવા ઇન્ડેક્સ સામે 0% થી ચોખ્ખી ટકાવારી લાભ અથવા Alpha Spread માપો.",
      "ana-micro": "માઇક્રો અને ફ્લો 20d Z-સ્કોર, સ્પ્રેડ લિક્વિડિટી ડિસલોકેશન અને P-06 અસંગતિ સ્કોર દ્વારા વોલ્યુમ સ્પાઇક્સ શોધે છે.",
      "ana-engines": "ચોથું ટેબ એ એક ડાયનેમિક એડ-હોક ટૂલ છે જે એસેટ ક્લાસ પ્રમાણે બદલાય છે: કારણ કે NVDA એક ઇક્વિટી છે તે 3D વોલેટિલિટી અને ઓપ્શન્સ પેઓફ ખોલે છે, જ્યારે બોન્ડ્સ, એફએક્સ અને કોમોડિટીઝ તેમના પોતાના વિશિષ્ટ ટૂલ્સ લોન્ચ કરે છે.",
      "res-hero": "ટોચ પર, સ્કોર અને સ્ટેન્સ મૂળભૂત ચુકાદા, ભારિત રેટિંગ અને હેડલાઇન થર્મોમીટરનો સારાંશ આપે છે.",
      "res-rag": "ડાબી કોલમમાં, RAG દસ્તાવેજ ચેટ સત્તાવાર SEC 10-K અને 10-Q ફાઇલિંગમાં આધારીત ચકાસાયેલ પ્રશ્નોના જવાબ આપે છે.",
      "res-factors": "કેન્દ્રના સ્તંભમાં, ફેક્ટર્સ એકોર્ડિયન ટોચના 5 રીંછના જોખમો સામે ટોચના 5 બુલ ડ્રાઇવરોનો વિરોધાભાસ કરે છે.",
      "res-pulse24h": "જમણી બાજુએ, FinBERT પલ્સ રીઅલ ટાઇમમાં બ્રેકિંગ હેડલાઇન્સ સ્કોર કરે છે અને 24-કલાકના સેન્ટિમેન્ટ વળાંકને દર્શાવે છે.",
      "p1-pills": "6 સારાંશ કાર્ડ્સ લાઇવ CAGR, Sharpe અને Sortino, 95% VaR, Max Drawdown, આલ્ફા અને વૈવિધ્યકરણની ફરીથી ગણતરી કરે છે.",
      "p1-table": "વેઇટિંગ ટેબલમાં, 213 સંપત્તિઓમાંથી કોઈપણ ઉમેરો, ચોક્કસ ટકાવારીનું વજન સેટ કરો અથવા 100% પર પુનઃસંતુલન કરો.",
      "p1-xray": "ઉપર-જમણે, 5-ટેબ એક્સ-રે પેનલ ETF ઓવરલેપ, એક્સપોઝર, બ્રિન્સન એટ્રિબ્યુશન, કેશફ્લો અને કસ્ટડીનું ઓડિટ કરે છે.",
      "p1-calendar": "એક્સ-રેની નીચે, માસિક કૅલેન્ડર જાન્યુઆરી-થી-ડિસેમ્બરના વળતરની સુસંગતતા અને YTD ટોટલ દર્શાવે છે.",
      "p1-backtest": "અને પૂર્ણ-પહોળાઈના તળિયે, Backtesting તમારા પોર્ટફોલિયોને S&P 500, 60/40, All-Weather અને Min-Variance સાથે સરખાવે છે.",
      "p2-markowitz": "પ્રથમ ચતુર્થાંશ 2D Markowitz કાર્યક્ષમ ફ્રન્ટિયરને પ્લોટ કરે છે અને Min-Var અને Max-Sharpe વિરુદ્ધ તમારા પોર્ટફોલિયોને સ્થાન આપે છે.",
      "p2-tornado": "નીચે-ડાબે ચતુર્થાંશ 5 ઐતિહાસિક કટોકટી, પ્રતિ-સંપત્તિ 95% VaR યોગદાન અને અપસાઇડ/ડાઉનસાઇડ કેપ્ચરનું પરીક્ષણ કરે છે.",
      "p2-corr": "ઉપર-જમણે, 6×6 મેટ્રિક્સ કટોકટી પૂંછડીના ચેપ સામે સામાન્ય સ્થિતિમાં સહસંબંધોની તુલના કરે છે.",
      "p2-shock2d": "નીચે-જમણે, શોક અને માર્કોવ S&P 500 ચાલ સાથે વ્યાજ દરમાં ફેરફાર કરે છે અને શાસન સંક્રમણોનો અંદાજ કાઢે છે.",
      "p2-montecarlo": "અને નીચેની પેનલ સમગ્ર P95, P50 અને P05, પાણીની અંદર ડ્રોડાઉન અને રોલિંગ Sharpe 10,000 Monte Carlo પાથને પ્રોજેક્ટ કરે છે.",
      "p3-impact": "6 ઈમ્પેક્ટ કાર્ડ તમારા વર્તમાન પોર્ટફોલિયોને તમારા સિમ્યુલેટેડ સોદા પછી અંદાજિત સ્થિતિ સાથે સરખાવે છે.",
      "p3-whatif": "ઉપર-ડાબે, What-If અને કેલી ટિકિટ ખરીદવા અથવા વેચવાનું અનુકરણ કરે છે અને શ્રેષ્ઠ Half-Kelly સ્થિતિ કદની ગણતરી કરે છે.",
      "p3-tailhedge": "નીચે-ડાબે, OTM પુટ અને માર્જિન રક્ષણાત્મક વિકલ્પ શિલ્ડનું અનુકરણ કરે છે અને Reg-T જાળવણી માર્જિનને મોનિટર કરે છે.",
      "p3-committee": "બે જમણી પેનલમાં, 3-પિલર કમિટી એક્ઝેક્યુશન લોગ અને કોપાયલોટની સાથે રિસ્ક રેલનું ઓડિટ કરે છે.",
      "p3-walkforward": "અને તળિયે, Walk-Forward ચાર્ટ WFE ઇન્ડેક્સ સાથે In-Sample અને Out-of-Sample પ્રદર્શનને માન્ય કરે છે."
    }
  },
  "KN": {
    "ui": {
      "walkthrough": "ಲೈವ್ ವಿಷುಯಲ್ ವಾಕ್‌ಥ್ರೂ",
      "clickPlayPause": "ಪ್ಲೇ ಮಾಡಲು ಅಥವಾ ವಿರಾಮಗೊಳಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ (ಸ್ಪೇಸ್)",
      "subtitles": "ಉಪಶೀರ್ಷಿಕೆಗಳು (ಸಿ)",
      "fullscreen": "ಪೂರ್ಣಪರದೆ (F)",
      "exitFullscreen": "ಪೂರ್ಣಪರದೆಯಿಂದ ನಿರ್ಗಮಿಸಿ (F ಅಥವಾ Esc)",
      "portTabs": [
        "ಬಿಲ್ಡರ್",
        "ಅಪಾಯ",
        "ಸಿಮ್ಯುಲೇಟರ್",
        "ಕಾಪಿಲಟ್"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • ಭಾಷೆಗಳು",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • ವರ್ಗಗಳು",
      "scr-pulse": "02 • 24 ಗಂ ನಾಡಿ",
      "scr-table": "03 • ಟೇಬಲ್",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • ಹೀಟ್ಮ್ಯಾಪ್",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • ತಾಂತ್ರಿಕ",
      "ana-compare": "03 • ಹೋಲಿಕೆ %",
      "ana-micro": "04 • ಮೈಕ್ರೋ & ಫ್ಲೋ",
      "ana-engines": "05 • 3D/2D ಎಂಜಿನ್‌ಗಳು",
      "res-hero": "01 • ಸ್ಕೋರ್ ಮತ್ತು ನಿಲುವು",
      "res-rag": "02 • RAG ಚಾಟ್",
      "res-factors": "03 • ಅಂಶಗಳು",
      "res-pulse24h": "04 • FinBERT ಪಲ್ಸ್",
      "p1-pills": "01 • ಸಾರಾಂಶ",
      "p1-table": "02 • ತೂಕ",
      "p1-xray": "03 • ಎಕ್ಸ್-ರೇ",
      "p1-calendar": "04 • ಕ್ಯಾಲೆಂಡರ್",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • ಸುಂಟರಗಾಳಿ & VaR",
      "p2-corr": "03 • ಪರಸ್ಪರ ಸಂಬಂಧ",
      "p2-shock2d": "04 • ಶಾಕ್ & ಮಾರ್ಕೋವ್",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • ಪರಿಣಾಮ",
      "p3-whatif": "02 • What-If & ಕೆಲ್ಲಿ",
      "p3-tailhedge": "03 • OTM ಪುಟ್ ಮತ್ತು ಮಾರ್ಜಿನ್",
      "p3-committee": "04 • ಸಮಿತಿ ಮತ್ತು ಲಾಗ್",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home ಪರದೆಗೆ ಸುಸ್ವಾಗತ: ಮಾರುಕಟ್ಟೆಗಳು ಡಿಕೋಡ್ ಆಗುವ ನಿಮ್ಮ ವ್ಯಾಕುಲತೆ-ಮುಕ್ತ ಆರಂಭಿಕ ಹಂತ.",
      "home-header": "Header ನ ಮೇಲಿನ ಎಡ ಮೂಲೆಯಲ್ಲಿ, λ ಐಕಾನ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡುವುದರಿಂದ ಯಾವಾಗಲೂ ನಿಮ್ಮನ್ನು ಈ ಮುಖ್ಯ ಹಂತಕ್ಕೆ ಹಿಂತಿರುಗಿಸುತ್ತದೆ.",
      "home-markets": "Header ನ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಕೇಂದ್ರೀಕೃತವಾಗಿರುವ Markets, ಎಲ್ಲಾ 213 ಜಾಗತಿಕ ಸ್ವತ್ತುಗಳನ್ನು ಲೈವ್ ಆಗಿ ಸಂಶೋಧಿಸಲು ನಿಮ್ಮ ಕಾರ್ಯಸ್ಥಳವಾಗಿದೆ.",
      "home-portfolio": "ಅದರ ಪಕ್ಕದಲ್ಲಿ ಕೇಂದ್ರೀಕೃತ ಮೆನುವಿನಲ್ಲಿ Portfolio, ಹಂಚಿಕೆಗಳನ್ನು ನಿರ್ಮಿಸಲು, ಒತ್ತಡ-ಪರೀಕ್ಷೆಯ ಅಪಾಯ, ಮತ್ತು ವಹಿವಾಟುಗಳನ್ನು ಅನುಕರಿಸಲು.",
      "home-system": "ಕೆಳಗೆ-ಎಡ Footer ನಲ್ಲಿ, System ಸರ್ವರ್‌ಗಳು ಮತ್ತು ಡೇಟಾಬೇಸ್‌ಗಳಿಗಾಗಿ ಲೈವ್ ವೀಕ್ಷಣಾ ಮಾನಿಟರ್ ಅನ್ನು ತೆರೆಯುತ್ತದೆ.",
      "home-guide": "ಅದರ ಪಕ್ಕದಲ್ಲಿ, Guide ನಿಮಗೆ ಅಗತ್ಯವಿರುವಾಗ ಈ ಸಂವಾದಾತ್ಮಕ ಹಂತ-ಹಂತದ ಕೈಪಿಡಿಯನ್ನು ತೆರೆಯುತ್ತದೆ.",
      "home-langs": "ಕೆಳಗಿನ ಬಲ ಮೂಲೆಯಲ್ಲಿ, ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಅನ್ನು 56 ಭಾಷೆಗಳಿಗೆ ಭಾಷಾಂತರಿಸಲು ಭಾಷಾ ಬಟನ್ ಕೇಂದ್ರೀಕೃತ ಮಾದರಿಯನ್ನು ತೆರೆಯುತ್ತದೆ.",
      "home-palettes": "ಮತ್ತು Palette ಹಣಕಾಸಿನ ಹಸಿರು ಮತ್ತು ಕೆಂಪು ಬಣ್ಣವನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಉಳಿಸಿಕೊಂಡು 5 ದೃಶ್ಯ ಓದುವ ಥೀಮ್‌ಗಳನ್ನು ತೆರೆಯುತ್ತದೆ.",
      "scr-categories": "ಉನ್ನತ ವರ್ಗಗಳ ಬಾರ್‌ನಲ್ಲಿ, ಎಲ್ಲಾ 213 ಸ್ವತ್ತುಗಳು, ನಿಮ್ಮ Watchlist ಅಥವಾ 10 ವಿಶೇಷ ಮಾರುಕಟ್ಟೆಗಳಾದ್ಯಂತ ಫಿಲ್ಟರ್ ಮಾಡಿ.",
      "scr-pulse": "4 ಪಲ್ಸ್ 24h ಕಾರ್ಡ್‌ಗಳು ಒಟ್ಟು ವಾಲ್ಯೂಮ್, ಸರಾಸರಿ RSI, P-06 ಆಡಳಿತ ಮತ್ತು ಟಾಪ್ ವಾಲ್ಯೂಮ್ ಡಿಸ್ಲೊಕೇಶನ್‌ಗಳನ್ನು ತೋರಿಸುತ್ತವೆ.",
      "scr-table": "ಸಂವಾದಾತ್ಮಕ ಕೋಷ್ಟಕವು ತ್ವರಿತ ಹುಡುಕಾಟ, ಮೆಚ್ಚಿನವುಗಳು ಮತ್ತು ಪ್ರತಿ ಸ್ವತ್ತು ವರ್ಗಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಸ್ಮಾರ್ಟ್ ಕಾಲಮ್‌ಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.",
      "scr-orbital": "Orbital ವೀಕ್ಷಣೆಯು ಲೈವ್ ಸೈಡ್ ಇನ್‌ಸ್ಪೆಕ್ಷನ್ ಪ್ಯಾನೆಲ್‌ನೊಂದಿಗೆ ವಿಚಲನದ ಮೂಲಕ ಮೂರು ಕೇಂದ್ರೀಕೃತ ಉಂಗುರಗಳಾದ್ಯಂತ ಸ್ವತ್ತುಗಳನ್ನು ನಕ್ಷೆ ಮಾಡುತ್ತದೆ.",
      "scr-heatmap": "ಹೀಟ್‌ಮ್ಯಾಪ್ ಅಗ್ರ 10 ಸ್ವತ್ತುಗಳನ್ನು ಹಸಿರು ಮತ್ತು ಕೆಂಪು ಬಣ್ಣದ 8 ಛಾಯೆಗಳಲ್ಲಿ ಅನುಪಾತದ ಬ್ಲಾಕ್‌ಗಳಾಗಿ ಜೋಡಿಸುತ್ತದೆ.",
      "scr-maintools": "ಮತ್ತು Main Tools ನಿಮಗೆ ಮೂರು ಹಂತಗಳಲ್ಲಿ ಸಾರ್ವಭೌಮ ವಕ್ರಾಕೃತಿಗಳು, 3D ಚಂಚಲತೆ, FX ಕ್ರಾಸ್ ಮತ್ತು ಫ್ಯೂಚರ್ಸ್ ಎಂಜಿನ್‌ಗಳಿಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.",
      "ana-hero": "Header ಆಸ್ತಿ ಸ್ವಿಚರ್, 1m ನಿಂದ ALL ಗೆ 9 ಸಮಯ ಚೌಕಟ್ಟುಗಳು ಮತ್ತು 5 ಕೋರ್ ಸೂಚಕಗಳನ್ನು ಸಂಯೋಜಿಸುತ್ತದೆ.",
      "ana-technical": "ತಾಂತ್ರಿಕ ಮಸೂರವು SMA 20, VWAP, ಮತ್ತು 2σ ಬೋಲಿಂಜರ್ ಬ್ಯಾಂಡ್‌ಗಳನ್ನು ಕೆಳಭಾಗದ ಪರಿಮಾಣದ ದೃಢೀಕರಣದೊಂದಿಗೆ ಅತಿಕ್ರಮಿಸುತ್ತದೆ.",
      "ana-compare": "ಹೋಲಿಕೆ % ನೊಂದಿಗೆ, ಹೊಂದಾಣಿಕೆಯ ಪೀರ್ ಅಥವಾ ಇಂಡೆಕ್ಸ್ ವಿರುದ್ಧ 0% ನಿಂದ ನಿವ್ವಳ ಶೇಕಡಾವಾರು ಪ್ರಯೋಜನವನ್ನು ಅಥವಾ Alpha Spread ಅನ್ನು ಅಳೆಯಿರಿ.",
      "ana-micro": "ಮೈಕ್ರೋ & ಫ್ಲೋ 20d Z-ಸ್ಕೋರ್, ಸ್ಪ್ರೆಡ್ ಲಿಕ್ವಿಡಿಟಿ ಡಿಸ್ಲೊಕೇಶನ್ ಮತ್ತು P-06 ಅಸಂಗತ ಸ್ಕೋರ್ ಮೂಲಕ ವಾಲ್ಯೂಮ್ ಸ್ಪೈಕ್‌ಗಳನ್ನು ಪತ್ತೆ ಮಾಡುತ್ತದೆ.",
      "ana-engines": "ನಾಲ್ಕನೇ ಟ್ಯಾಬ್ ಒಂದು ಡೈನಾಮಿಕ್ ಆಡ್-ಹಾಕ್ ಟೂಲ್ ಆಗಿದ್ದು ಅದು ಆಸ್ತಿ ವರ್ಗದಿಂದ ಬದಲಾಗುತ್ತದೆ: NVDA ಒಂದು ಇಕ್ವಿಟಿ ಆಗಿರುವುದರಿಂದ ಇದು 3D ವೋಲಾಟಿಲಿಟಿ ಮತ್ತು ಆಯ್ಕೆಗಳ ಪಾವತಿಯನ್ನು ತೆರೆಯುತ್ತದೆ, ಆದರೆ ಬಾಂಡ್‌ಗಳು, FX ಮತ್ತು ಸರಕುಗಳು ತಮ್ಮದೇ ಆದ ವಿಶೇಷ ಸಾಧನಗಳನ್ನು ಪ್ರಾರಂಭಿಸುತ್ತವೆ.",
      "res-hero": "ಮೇಲ್ಭಾಗದಲ್ಲಿ, ಸ್ಕೋರ್ ಮತ್ತು ನಿಲುವು ಮೂಲಭೂತ ತೀರ್ಪು, ತೂಕದ ರೇಟಿಂಗ್ ಮತ್ತು ಹೆಡ್‌ಲೈನ್ ಥರ್ಮಾಮೀಟರ್ ಅನ್ನು ಸಾರಾಂಶಗೊಳಿಸುತ್ತದೆ.",
      "res-rag": "ಎಡ ಕಾಲಮ್‌ನಲ್ಲಿ, RAG ಡಾಕ್ಯುಮೆಂಟ್ ಚಾಟ್ ಅಧಿಕೃತ SEC 10-K ಮತ್ತು 10-Q ಫೈಲಿಂಗ್‌ಗಳಲ್ಲಿ ಆಧಾರವಾಗಿರುವ ಪರಿಶೀಲಿಸಿದ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸುತ್ತದೆ.",
      "res-factors": "ಮಧ್ಯದ ಅಂಕಣದಲ್ಲಿ, ಫ್ಯಾಕ್ಟರ್ಸ್ ಅಕಾರ್ಡಿಯನ್ ಅಗ್ರ 5 ಕರಡಿ ಅಪಾಯಗಳ ವಿರುದ್ಧ ಟಾಪ್ 5 ಬುಲ್ ಡ್ರೈವರ್‌ಗಳನ್ನು ವ್ಯತಿರಿಕ್ತಗೊಳಿಸುತ್ತದೆ.",
      "res-pulse24h": "ಬಲಭಾಗದಲ್ಲಿ, FinBERT ಪಲ್ಸ್ ನೈಜ ಸಮಯದಲ್ಲಿ ಬ್ರೇಕಿಂಗ್ ಹೆಡ್‌ಲೈನ್‌ಗಳನ್ನು ಸ್ಕೋರ್ ಮಾಡುತ್ತದೆ ಮತ್ತು 24-ಗಂಟೆಗಳ ಸೆಂಟಿಮೆಂಟ್ ಕರ್ವ್ ಅನ್ನು ರೂಪಿಸುತ್ತದೆ.",
      "p1-pills": "6 ಸಾರಾಂಶ ಕಾರ್ಡ್‌ಗಳು ಲೈವ್ CAGR, Sharpe ಮತ್ತು Sortino, 95% VaR, Max Drawdown, ಆಲ್ಫಾ ಮತ್ತು ವೈವಿಧ್ಯೀಕರಣವನ್ನು ಮರುಗಣಿಸುತ್ತವೆ.",
      "p1-table": "ತೂಕದ ಕೋಷ್ಟಕದಲ್ಲಿ, 213 ಸ್ವತ್ತುಗಳಲ್ಲಿ ಯಾವುದನ್ನಾದರೂ ಸೇರಿಸಿ, ನಿಖರವಾದ ಶೇಕಡಾವಾರು ತೂಕವನ್ನು ಹೊಂದಿಸಿ ಅಥವಾ 100% ಗೆ ಮರುಸಮತೋಲನ ಮಾಡಿ.",
      "p1-xray": "ಮೇಲಿನ ಬಲಕ್ಕೆ, 5-ಟ್ಯಾಬ್ ಎಕ್ಸ್-ರೇ ಪ್ಯಾನಲ್ ಇಟಿಎಫ್ ಅತಿಕ್ರಮಣ, ಮಾನ್ಯತೆ, ಬ್ರಿನ್ಸನ್ ಗುಣಲಕ್ಷಣ, ನಗದು ಹರಿವು ಮತ್ತು ಪಾಲನೆಯನ್ನು ಲೆಕ್ಕಪರಿಶೋಧಿಸುತ್ತದೆ.",
      "p1-calendar": "ಎಕ್ಸ್-ರೇ ಕೆಳಗೆ, ಮಾಸಿಕ ಕ್ಯಾಲೆಂಡರ್ ಜನವರಿಯಿಂದ ಡಿಸೆಂಬರ್‌ವರೆಗೆ ರಿಟರ್ನ್ ಸ್ಥಿರತೆ ಮತ್ತು YTD ಮೊತ್ತವನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತದೆ.",
      "p1-backtest": "ಮತ್ತು ಪೂರ್ಣ-ಅಗಲದ ಕೆಳಭಾಗದಲ್ಲಿ, Backtesting ನಿಮ್ಮ ಪೋರ್ಟ್‌ಫೋಲಿಯೊವನ್ನು S&P 500, 60/40, All-Weather, ಮತ್ತು Min-Variance ಗೆ ಹೋಲಿಸುತ್ತದೆ.",
      "p2-markowitz": "ಮೊದಲ ಕ್ವಾಡ್ರಾಂಟ್ 2D Markowitz ದಕ್ಷ ಫ್ರಾಂಟಿಯರ್ ಅನ್ನು ರೂಪಿಸುತ್ತದೆ ಮತ್ತು Min-Var ಮತ್ತು Max-Sharpe ವಿರುದ್ಧ ನಿಮ್ಮ ಪೋರ್ಟ್‌ಫೋಲಿಯೊವನ್ನು ಇರಿಸುತ್ತದೆ.",
      "p2-tornado": "ಕೆಳಗಿನ ಎಡ ಕ್ವಾಡ್ರಾಂಟ್ 5 ಐತಿಹಾಸಿಕ ಬಿಕ್ಕಟ್ಟುಗಳನ್ನು ಪರೀಕ್ಷಿಸುತ್ತದೆ, ಪ್ರತಿ ಸ್ವತ್ತು 95% VaR ಕೊಡುಗೆ, ಮತ್ತು ತಲೆಕೆಳಗಾದ/ಕೆಳಗಿನ ಕ್ಯಾಪ್ಚರ್.",
      "p2-corr": "ಮೇಲಿನ ಬಲಕ್ಕೆ, 6×6 ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಬಿಕ್ಕಟ್ಟಿನ ಬಾಲ ಸೋಂಕು ವಿರುದ್ಧ ಸಾಮಾನ್ಯ ಪರಿಸ್ಥಿತಿಗಳಲ್ಲಿ ಪರಸ್ಪರ ಸಂಬಂಧಗಳನ್ನು ಹೋಲಿಸುತ್ತದೆ.",
      "p2-shock2d": "ಕೆಳಗೆ-ಬಲ, ಶಾಕ್ ಮತ್ತು ಮಾರ್ಕೊವ್ S&P 500 ಚಲನೆಗಳೊಂದಿಗೆ ಬಡ್ಡಿದರದ ಬದಲಾವಣೆಗಳನ್ನು ದಾಟುತ್ತದೆ ಮತ್ತು ಆಡಳಿತ ಪರಿವರ್ತನೆಗಳನ್ನು ಅಂದಾಜು ಮಾಡುತ್ತದೆ.",
      "p2-montecarlo": "ಮತ್ತು ಕೆಳಗಿನ ಫಲಕವು P95, P50, ಮತ್ತು P05, ನೀರೊಳಗಿನ ಡ್ರಾಡೌನ್ ಮತ್ತು ರೋಲಿಂಗ್ Sharpe ನಾದ್ಯಂತ 10,000 Monte Carlo ಮಾರ್ಗಗಳನ್ನು ಯೋಜಿಸುತ್ತದೆ.",
      "p3-impact": "6 ಇಂಪ್ಯಾಕ್ಟ್ ಕಾರ್ಡ್‌ಗಳು ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪೋರ್ಟ್‌ಫೋಲಿಯೊವನ್ನು ನಿಮ್ಮ ಸಿಮ್ಯುಲೇಟೆಡ್ ಟ್ರೇಡ್‌ಗಳ ನಂತರ ಯೋಜಿತ ಸ್ಥಿತಿಗೆ ಹೋಲಿಸುತ್ತವೆ.",
      "p3-whatif": "ಮೇಲಿನ-ಎಡ, What-If ಮತ್ತು ಕೆಲ್ಲಿ ಟಿಕೆಟ್‌ಗಳ ಖರೀದಿ ಅಥವಾ ಮಾರಾಟವನ್ನು ಅನುಕರಿಸುತ್ತದೆ ಮತ್ತು ಸೂಕ್ತವಾದ Half-Kelly ಸ್ಥಾನದ ಗಾತ್ರವನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.",
      "p3-tailhedge": "ಕೆಳಗಿನ-ಎಡ, OTM ಪುಟ್ ಮತ್ತು ಮಾರ್ಜಿನ್ ರಕ್ಷಣಾತ್ಮಕ ಆಯ್ಕೆಯ ಶೀಲ್ಡ್‌ಗಳನ್ನು ಅನುಕರಿಸುತ್ತದೆ ಮತ್ತು Reg-T ನಿರ್ವಹಣಾ ಅಂಚುಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುತ್ತದೆ.",
      "p3-committee": "ಎರಡು ಬಲ ಪ್ಯಾನೆಲ್‌ಗಳಲ್ಲಿ, 3-ಪಿಲ್ಲರ್ ಸಮಿತಿಯು ಎಕ್ಸಿಕ್ಯೂಶನ್ ಲಾಗ್ ಮತ್ತು ಕಾಪಿಲಟ್ ಜೊತೆಗೆ ರಿಸ್ಕ್ ಗಾರ್ಡ್‌ರೈಲ್‌ಗಳನ್ನು ಲೆಕ್ಕಪರಿಶೋಧಿಸುತ್ತದೆ.",
      "p3-walkforward": "ಮತ್ತು ಕೆಳಭಾಗದಲ್ಲಿ, Walk-Forward ಚಾರ್ಟ್ WFE ಸೂಚ್ಯಂಕದೊಂದಿಗೆ In-Sample ಮತ್ತು Out-of-Sample ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಮೌಲ್ಯೀಕರಿಸುತ್ತದೆ."
    }
  },
  "ML": {
    "ui": {
      "walkthrough": "തത്സമയ വിഷ്വൽ വാക്ക്ത്രൂ",
      "clickPlayPause": "പ്ലേ ചെയ്യാനോ താൽക്കാലികമായി നിർത്താനോ ക്ലിക്ക് ചെയ്യുക (സ്പേസ്)",
      "subtitles": "സബ്ടൈറ്റിലുകൾ (സി)",
      "fullscreen": "പൂർണ്ണസ്‌ക്രീൻ (F)",
      "exitFullscreen": "പൂർണ്ണസ്‌ക്രീനിൽ നിന്ന് പുറത്തുകടക്കുക (F അല്ലെങ്കിൽ Esc)",
      "portTabs": [
        "ബിൽഡർ",
        "റിസ്ക്",
        "സിമുലേറ്റർ",
        "കോപൈലറ്റ്"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • ഭാഷകൾ",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • വിഭാഗങ്ങൾ",
      "scr-pulse": "02 • 24 മണിക്കൂർ പൾസ്",
      "scr-table": "03 • മേശ",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • ഹീറ്റ്മാപ്പ്",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • സാങ്കേതിക",
      "ana-compare": "03 • താരതമ്യം %",
      "ana-micro": "04 • മൈക്രോ & ഫ്ലോ",
      "ana-engines": "05 • 3D/2D എഞ്ചിനുകൾ",
      "res-hero": "01 • സ്കോർ & സ്റ്റാൻസ്",
      "res-rag": "02 • RAG ചാറ്റ്",
      "res-factors": "03 • ഘടകങ്ങൾ",
      "res-pulse24h": "04 • FinBERT പൾസ്",
      "p1-pills": "01 • സംഗ്രഹം",
      "p1-table": "02 • വെയ്റ്റിംഗ്",
      "p1-xray": "03 • എക്സ്-റേ",
      "p1-calendar": "04 • കലണ്ടർ",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • ടൊർണാഡോ & VaR",
      "p2-corr": "03 • പരസ്പരബന്ധം",
      "p2-shock2d": "04 • ഷോക്ക് & മാർക്കോവ്",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • ആഘാതം",
      "p3-whatif": "02 • What-If & കെല്ലി",
      "p3-tailhedge": "03 • OTM പുട്ട് & മാർജിൻ",
      "p3-committee": "04 • കമ്മിറ്റി & ലോഗ്",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home സ്‌ക്രീനിലേക്ക് സ്വാഗതം: വിപണികൾ ഡീകോഡ് ചെയ്യപ്പെടുന്ന നിങ്ങളുടെ ശ്രദ്ധ വ്യതിചലിക്കാത്ത ആരംഭ പോയിൻ്റ്.",
      "home-header": "Header-ൻ്റെ മുകളിൽ ഇടത് മൂലയിൽ, λ ഐക്കണിൽ ക്ലിക്കുചെയ്യുന്നത് എല്ലായ്പ്പോഴും ഈ പ്രധാന ഘട്ടത്തിലേക്ക് നിങ്ങളെ തിരികെ കൊണ്ടുവരുന്നു.",
      "home-markets": "Header-ൻ്റെ മുകളിൽ കേന്ദ്രീകരിച്ചിരിക്കുന്നത് Markets ആണ്, എല്ലാ 213 ആഗോള അസറ്റുകളും തത്സമയം ഗവേഷണം ചെയ്യാനുള്ള നിങ്ങളുടെ വർക്ക്‌സ്റ്റേഷൻ.",
      "home-portfolio": "അലോക്കേഷനുകൾ, സ്ട്രെസ്-ടെസ്റ്റ് റിസ്ക്, ട്രേഡുകൾ സിമുലേറ്റ് എന്നിവ നിർമ്മിക്കുന്നതിന്, കേന്ദ്രീകൃത മെനുവിൽ Portfolio ആണ്.",
      "home-system": "താഴെ-ഇടത് Footer-ൽ, System സെർവറുകൾക്കും ഡാറ്റാബേസുകൾക്കുമായി തത്സമയ നിരീക്ഷണ മോണിറ്റർ തുറക്കുന്നു.",
      "home-guide": "അതിനപ്പുറം, നിങ്ങൾക്ക് ആവശ്യമുള്ളപ്പോഴെല്ലാം Guide ഈ ഇൻ്ററാക്ടീവ് സ്റ്റെപ്പ്-ബൈ-സ്റ്റെപ്പ് മാനുവൽ തുറക്കുന്നു.",
      "home-langs": "താഴെ-വലത് കോണിലുള്ള, 56 ഭാഷകളിലേക്ക് പ്ലാറ്റ്‌ഫോം വിവർത്തനം ചെയ്യുന്നതിന് ഭാഷാ ബട്ടൺ കേന്ദ്രീകൃത മോഡൽ തുറക്കുന്നു.",
      "home-palettes": "കൂടാതെ Palette സാമ്പത്തിക പച്ചയും ചുവപ്പും കർശനമായി നിലനിർത്തിക്കൊണ്ട് 5 വിഷ്വൽ റീഡിംഗ് തീമുകൾ തുറക്കുന്നു.",
      "scr-categories": "മികച്ച വിഭാഗങ്ങളുടെ ബാറിൽ, എല്ലാ 213 അസറ്റുകൾ, നിങ്ങളുടെ Watchlist, അല്ലെങ്കിൽ 10 പ്രത്യേക വിപണികൾ എന്നിവയിലുടനീളം ഫിൽട്ടർ ചെയ്യുക.",
      "scr-pulse": "4 പൾസ് 24h കാർഡുകൾ മൊത്തം വോളിയം, ശരാശരി RSI, P-06 ഭരണകൂടം, ടോപ്പ് വോളിയം ഡിസ്ലോക്കേഷനുകൾ എന്നിവ കാണിക്കുന്നു.",
      "scr-table": "ഇൻ്ററാക്ടീവ് ടേബിളിൽ തൽക്ഷണ തിരയൽ, പ്രിയങ്കരങ്ങൾ, ഓരോ അസറ്റ് ക്ലാസിനും അനുയോജ്യമായ സ്‌മാർട്ട് കോളങ്ങൾ എന്നിവ ഉൾപ്പെടുന്നു.",
      "scr-orbital": "Orbital കാഴ്ച ഒരു ലൈവ് സൈഡ് ഇൻസ്പെക്ഷൻ പാനൽ ഉപയോഗിച്ച് വ്യതിയാനം വഴി മൂന്ന് കേന്ദ്രീകൃത വളയങ്ങളിലുടനീളം അസറ്റുകൾ മാപ്പ് ചെയ്യുന്നു.",
      "scr-heatmap": "ഹീറ്റ്‌മാപ്പ് മികച്ച 10 അസറ്റുകളെ 8 പച്ചയും ചുവപ്പും നിറങ്ങളിലുള്ള ആനുപാതിക ബ്ലോക്കുകളായി ക്രമീകരിക്കുന്നു.",
      "scr-maintools": "കൂടാതെ പരമാധികാര കർവുകൾ, 3D ചാഞ്ചാട്ടം, FX ക്രോസ്, ഫ്യൂച്ചേഴ്സ് എഞ്ചിനുകൾ എന്നിവയിലേക്ക് Main Tools നിങ്ങളെ മൂന്ന് ഘട്ടങ്ങളിലൂടെ നയിക്കുന്നു.",
      "ana-hero": "Header അസറ്റ് സ്വിച്ചർ, 1m മുതൽ ALL വരെയുള്ള 9 ടൈംഫ്രെയിമുകൾ, 5 കോർ സൂചകങ്ങൾ എന്നിവ സംയോജിപ്പിക്കുന്നു.",
      "ana-technical": "ടെക്നിക്കൽ ലെൻസ് SMA 20, VWAP, 2σ ബോളിംഗർ ബാൻഡുകൾ എന്നിവ താഴെയുള്ള വോളിയം സ്ഥിരീകരണത്തോടെ ഓവർലേ ചെയ്യുന്നു.",
      "ana-compare": "താരതമ്യം % ഉപയോഗിച്ച്, അനുയോജ്യമായ പിയർ അല്ലെങ്കിൽ സൂചികയ്‌ക്കെതിരെ 0%-ൽ നിന്ന് നെറ്റ് ശതമാനം നേട്ടം അല്ലെങ്കിൽ Alpha Spread അളക്കുക.",
      "ana-micro": "മൈക്രോ & ഫ്ലോ 20d Z- സ്‌കോർ, സ്‌പ്രെഡ് ലിക്വിഡിറ്റി ഡിസ്‌ലോക്കേഷൻ, P-06 അനോമലി സ്‌കോർ എന്നിവ വഴി വോളിയം സ്‌പൈക്കുകൾ കണ്ടെത്തുന്നു.",
      "ana-engines": "നാലാമത്തെ ടാബ് ഒരു ഡൈനാമിക് അഡ്-ഹോക്ക് ടൂളാണ്, അത് അസറ്റ് ക്ലാസ് അനുസരിച്ച് വ്യത്യാസപ്പെടുന്നു: NVDA ഒരു ഇക്വിറ്റി ആയതിനാൽ ഇത് 3D ചാഞ്ചാട്ടവും ഓപ്ഷനുകളും തുറക്കുന്നു, അതേസമയം ബോണ്ടുകൾ, FX, ചരക്കുകൾ എന്നിവ അവരുടേതായ പ്രത്യേക ഉപകരണങ്ങൾ സമാരംഭിക്കുന്നു.",
      "res-hero": "മുകളിൽ, സ്കോറും സ്റ്റാൻസും അടിസ്ഥാന വിധി, വെയ്റ്റഡ് റേറ്റിംഗ്, ഹെഡ്‌ലൈൻ തെർമോമീറ്റർ എന്നിവ സംഗ്രഹിക്കുന്നു.",
      "res-rag": "ഇടത് കോളത്തിൽ, RAG ഡോക്യുമെൻ്റ് ചാറ്റ് ഔദ്യോഗിക SEC 10-K, 10-Q ഫയലിംഗുകളിൽ അടിസ്ഥാനമാക്കിയുള്ള പരിശോധിച്ചുറപ്പിച്ച ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുന്നു.",
      "res-factors": "മധ്യ നിരയിൽ, ഫാക്‌ടേഴ്‌സ് അക്കോഡിയൻ മികച്ച 5 ബുൾ ഡ്രൈവർമാരെ മികച്ച 5 കരടി അപകടസാധ്യതകളുമായി താരതമ്യം ചെയ്യുന്നു.",
      "res-pulse24h": "വലതുവശത്ത്, FinBERT പൾസ് തത്സമയം തലക്കെട്ടുകൾ തകർക്കുകയും 24 മണിക്കൂർ സെൻ്റിമെൻ്റ് കർവ് പ്ലോട്ട് ചെയ്യുകയും ചെയ്യുന്നു.",
      "p1-pills": "6 സംഗ്രഹ കാർഡുകൾ തത്സമയ CAGR, Sharpe, Sortino, 95% VaR, Max Drawdown, ആൽഫ, വൈവിധ്യവൽക്കരണം എന്നിവ വീണ്ടും കണക്കാക്കുന്നു.",
      "p1-table": "വെയ്റ്റിംഗ് ടേബിളിൽ, 213 അസറ്റുകളിൽ ഏതെങ്കിലും ചേർക്കുക, കൃത്യമായ ശതമാനം വെയ്റ്റുകൾ സജ്ജീകരിക്കുക അല്ലെങ്കിൽ 100% റീബാലൻസ് ചെയ്യുക.",
      "p1-xray": "മുകളിൽ വലത്, 5-ടാബ് എക്സ്-റേ പാനൽ ETF ഓവർലാപ്പ്, എക്സ്പോഷർ, ബ്രിൻസൺ ആട്രിബ്യൂഷൻ, പണമൊഴുക്ക്, കസ്റ്റഡി എന്നിവ ഓഡിറ്റ് ചെയ്യുന്നു.",
      "p1-calendar": "എക്സ്-റേയ്ക്ക് താഴെ, പ്രതിമാസ കലണ്ടർ ജനുവരി മുതൽ ഡിസംബർ വരെയുള്ള റിട്ടേൺ സ്ഥിരതയും YTD ടോട്ടലുകളും പ്രദർശിപ്പിക്കുന്നു.",
      "p1-backtest": "പൂർണ്ണ വീതിയിൽ, Backtesting നിങ്ങളുടെ പോർട്ട്‌ഫോളിയോയെ S&P 500, 60/40, All-Weather, Min-Variance എന്നിവയുമായി താരതമ്യം ചെയ്യുന്നു.",
      "p2-markowitz": "ആദ്യ ക്വാഡ്രൻ്റ് 2D Markowitz കാര്യക്ഷമമായ അതിർത്തി പ്ലോട്ട് ചെയ്യുകയും Min-Var, Max-Sharpe എന്നിവയ്‌ക്കെതിരെ നിങ്ങളുടെ പോർട്ട്‌ഫോളിയോ സ്ഥാപിക്കുകയും ചെയ്യുന്നു.",
      "p2-tornado": "താഴെ-ഇടത് ക്വാഡ്രൻ്റ് 5 ചരിത്രപരമായ പ്രതിസന്ധികൾ, ഓരോ അസറ്റിൻ്റെയും 95% VaR സംഭാവന, അപ്‌സൈഡ്/ഡൗൺസൈഡ് ക്യാപ്‌ചർ എന്നിവ പരിശോധിക്കുന്നു.",
      "p2-corr": "മുകളിൽ-വലത്, 6×6 മാട്രിക്സ് ക്രൈസിസ് ടെയിൽ പകർച്ചവ്യാധിയുമായി സാധാരണ അവസ്ഥയിലെ പരസ്പര ബന്ധങ്ങളെ താരതമ്യം ചെയ്യുന്നു.",
      "p2-shock2d": "താഴെ-വലത്, ഷോക്ക് & മാർക്കോവ് S&P 500 നീക്കങ്ങളിലൂടെ പലിശ നിരക്ക് ഷിഫ്റ്റുകൾ മറികടക്കുകയും ഭരണ പരിവർത്തനങ്ങൾ കണക്കാക്കുകയും ചെയ്യുന്നു.",
      "p2-montecarlo": "താഴെയുള്ള പാനൽ P95, P50, P05, അണ്ടർവാട്ടർ ഡ്രോഡൗൺ, റോളിംഗ് Sharpe എന്നിവയിലുടനീളമുള്ള 10,000 Monte Carlo പാതകൾ പ്രൊജക്റ്റ് ചെയ്യുന്നു.",
      "p3-impact": "6 ഇംപാക്റ്റ് കാർഡുകൾ നിങ്ങളുടെ സിമുലേറ്റഡ് ട്രേഡുകൾക്ക് ശേഷം പ്രൊജക്റ്റ് ചെയ്ത അവസ്ഥയുമായി നിങ്ങളുടെ നിലവിലെ പോർട്ട്ഫോളിയോ താരതമ്യം ചെയ്യുന്നു.",
      "p3-whatif": "മുകളിൽ ഇടത്, What-If & കെല്ലി ടിക്കറ്റുകൾ വാങ്ങുകയോ വിൽക്കുകയോ ചെയ്യുന്നതിനെ അനുകരിക്കുകയും ഒപ്റ്റിമൽ Half-Kelly സ്ഥാന വലുപ്പം കണക്കാക്കുകയും ചെയ്യുന്നു.",
      "p3-tailhedge": "താഴെ-ഇടത്, OTM പുട്ട് & മാർജിൻ സംരക്ഷിത ഓപ്ഷൻ ഷീൽഡുകൾ അനുകരിക്കുകയും Reg-T മെയിൻ്റനൻസ് മാർജിൻ നിരീക്ഷിക്കുകയും ചെയ്യുന്നു.",
      "p3-committee": "രണ്ട് വലത് പാനലുകളിൽ, 3-പില്ലർ കമ്മിറ്റി എക്സിക്യൂഷൻ ലോഗ്, കോപൈലറ്റ് എന്നിവയ്‌ക്കൊപ്പം റിസ്ക് ഗാർഡ്‌റെയിലുകളും ഓഡിറ്റ് ചെയ്യുന്നു.",
      "p3-walkforward": "താഴെ, Walk-Forward ചാർട്ട് In-Sample, WFE സൂചിക ഉപയോഗിച്ച് Out-of-Sample പ്രകടനത്തെ സാധൂകരിക്കുന്നു."
    }
  },
  "TH": {
    "ui": {
      "walkthrough": "บทสรุปภาพสด",
      "clickPlayPause": "คลิกเพื่อเล่นหรือหยุดชั่วคราว (เว้นวรรค)",
      "subtitles": "คำบรรยาย (ค)",
      "fullscreen": "เต็มจอ (F)",
      "exitFullscreen": "ออกจากโหมดเต็มหน้าจอ (F หรือ Esc)",
      "portTabs": [
        "ช่างก่อสร้าง",
        "ความเสี่ยง",
        "เครื่องจำลอง",
        "นักบิน"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (แล)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • ภาษา",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • หมวดหมู่",
      "scr-pulse": "02 • ชีพจร 24 ชม",
      "scr-table": "03 • ตาราง",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • แผนที่ความร้อน",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • เทคนิค",
      "ana-compare": "03 • เปรียบเทียบ %",
      "ana-micro": "04 • ไมโคร แอนด์ โฟลว์",
      "ana-engines": "05 • เครื่องยนต์ 3D/2D",
      "res-hero": "01 • คะแนนและท่าทาง",
      "res-rag": "02 • แชท RAG",
      "res-factors": "03 • ปัจจัย",
      "res-pulse24h": "04 • FinBERT พัลส์",
      "p1-pills": "01 • สรุป",
      "p1-table": "02 • การถ่วงน้ำหนัก",
      "p1-xray": "03 • เอ็กซ์เรย์",
      "p1-calendar": "04 • ปฏิทิน",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • ทอร์นาโดและ VaR",
      "p2-corr": "03 • ความสัมพันธ์",
      "p2-shock2d": "04 • ช็อก & มาร์คอฟ",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • ผลกระทบ",
      "p3-whatif": "02 • What-If & เคลลี่",
      "p3-tailhedge": "03 • OTM ใส่และมาร์จิ้น",
      "p3-committee": "04 • คณะกรรมการและบันทึก",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "ยินดีต้อนรับสู่หน้าจอ Home: จุดเริ่มต้นที่ปราศจากสิ่งรบกวนซึ่งตลาดจะถูกถอดรหัส.",
      "home-header": "ที่มุมซ้ายบนของ Header การคลิกไอคอน λ จะนำคุณกลับมาที่เวทีหลักนี้เสมอ.",
      "home-markets": "ศูนย์กลางที่ด้านบนของ Header คือ Markets ซึ่งเป็นเวิร์กสเตชันของคุณสำหรับการวิจัยสินทรัพย์ทั่วโลกทั้งหมด 213 รายการแบบสดๆ.",
      "home-portfolio": "ข้างๆ ในเมนูตรงกลางคือ Portfolio เพื่อสร้างการจัดสรร ความเสี่ยงในการทดสอบความเครียด และจำลองการซื้อขาย.",
      "home-system": "ที่ด้านซ้ายล่างของ Footer นั้น System จะเปิดการตรวจสอบความสามารถในการสังเกตแบบเรียลไทม์สำหรับเซิร์ฟเวอร์และฐานข้อมูล.",
      "home-guide": "นอกจากนั้น Guide จะเปิดคู่มือเชิงโต้ตอบทีละขั้นตอนนี้ทุกครั้งที่คุณต้องการ.",
      "home-langs": "ที่มุมขวาล่าง ปุ่มภาษาจะเปิดโมดอลตรงกลางเพื่อแปลแพลตฟอร์มเป็น 56 ภาษา.",
      "home-palettes": "และ Palette จะเปิดธีมการอ่านด้วยภาพ 5 ธีมโดยยังคงรักษาสีเขียวและสีแดงทางการเงินไว้อย่างเคร่งครัด.",
      "scr-categories": "ในแถบหมวดหมู่ด้านบน กรองเนื้อหาทั้งหมด 213 รายการ, Watchlist ของคุณ หรือตลาดเฉพาะ 10 รายการ.",
      "scr-pulse": "การ์ด 4 Pulse 24 ชั่วโมงแสดงปริมาณรวม, RSI เฉลี่ย, รูปแบบ P-06 และการเคลื่อนที่ของปริมาณสูงสุด.",
      "scr-table": "ตารางเชิงโต้ตอบมีการค้นหาทันที รายการโปรด และคอลัมน์อัจฉริยะที่ปรับให้เหมาะกับสินทรัพย์แต่ละประเภท.",
      "scr-orbital": "Orbital ดูแผนที่สินทรัพย์บนวงแหวนศูนย์กลางสามวงโดยการเบี่ยงเบนด้วยแผงตรวจสอบด้านข้างแบบสด.",
      "scr-heatmap": "แผนที่ความร้อนจะจัดเรียงเนื้อหา 10 อันดับแรกออกเป็นบล็อกตามสัดส่วนโดยแบ่งเป็นสีเขียวและสีแดง 8 เฉด.",
      "scr-maintools": "และ Main Tools จะแนะนำคุณในสามขั้นตอนเกี่ยวกับกราฟโค้ง ความผันผวน 3 มิติ ครอส FX และกลไกฟิวเจอร์ส.",
      "ana-hero": "Header รวมตัวสลับสินทรัพย์ กรอบเวลา 9 ช่วงตั้งแต่ 1 นาทีถึงทั้งหมด และตัวบ่งชี้หลัก 5 ตัว.",
      "ana-technical": "เลนส์ด้านเทคนิคซ้อนทับ SMA 20, VWAP และ 2σ Bollinger Bands พร้อมการยืนยันระดับเสียงด้านล่าง.",
      "ana-compare": "ด้วยการเปรียบเทียบ % วัดเปอร์เซ็นต์ความได้เปรียบสุทธิหรือ Alpha Spread จาก 0% เทียบกับเพียร์หรือดัชนีที่เข้ากันได้.",
      "ana-micro": "Micro & Flow ตรวจจับปริมาณที่เพิ่มขึ้นอย่างรวดเร็วผ่าน 20d Z-Score, กระจายความคลาดเคลื่อนของสภาพคล่อง และคะแนนความผิดปกติ P-06.",
      "ana-engines": "แท็บที่สี่เป็นเครื่องมือเฉพาะกิจแบบไดนามิกที่แตกต่างกันไปตามประเภทสินทรัพย์ เนื่องจาก NVDA เป็นตราสารทุน จึงเปิดความผันผวน 3 มิติและการจ่ายผลตอบแทนของตัวเลือก ในขณะที่พันธบัตร FX และสินค้าโภคภัณฑ์เปิดตัวเครื่องมือพิเศษของตนเอง.",
      "res-hero": "ที่ด้านบน Score & Stance จะสรุปคำตัดสินพื้นฐาน การให้คะแนนแบบถ่วงน้ำหนัก และเครื่องวัดอุณหภูมิแบบพาดหัว.",
      "res-rag": "ในคอลัมน์ด้านซ้าย RAG Document Chat จะตอบคำถามที่ได้รับการตรวจสอบซึ่งมีพื้นฐานอยู่ในเอกสารที่ยื่นต่อ SEC 10-K และ 10-Q อย่างเป็นทางการ.",
      "res-factors": "ในคอลัมน์กลาง หีบเพลงปัจจัยจะเปรียบเทียบนักแข่งกระทิง 5 อันดับแรกกับความเสี่ยงหมี 5 อันดับแรก.",
      "res-pulse24h": "ทางด้านขวา FinBERT Pulse ให้คะแนนพาดหัวข่าวแบบเรียลไทม์และแสดงกราฟความเชื่อมั่นตลอด 24 ชั่วโมง.",
      "p1-pills": "การ์ดสรุปทั้ง 6 ใบคำนวณใหม่สด CAGR, Sharpe และ Sortino, 95% VaR, Max Drawdown, Alpha และการกระจายความเสี่ยง.",
      "p1-table": "ในตารางการถ่วงน้ำหนัก ให้เพิ่มเนื้อหาใดๆ จาก 213 รายการ กำหนดน้ำหนักเป็นเปอร์เซ็นต์ที่แน่นอน หรือปรับสมดุลเป็น 100%.",
      "p1-xray": "ด้านบนขวา แผง X-Ray แบบ 5 แท็บจะตรวจสอบ ETF ที่ทับซ้อนกัน การเปิดเผย การระบุแหล่งที่มาของ Brinson กระแสเงินสด และการดูแล.",
      "p1-calendar": "ด้านล่าง X-Ray ปฏิทินรายเดือนจะแสดงความสอดคล้องในการส่งคืนเดือนมกราคมถึงธันวาคมและผลรวม YTD.",
      "p1-backtest": "และที่ด้านล่างแบบเต็มความกว้าง Backtesting จะเปรียบเทียบพอร์ตโฟลิโอของคุณกับ S&P 500, 60/40, All-Weather และ Min-Variance.",
      "p2-markowitz": "ควอแดรนท์แรกแสดง 2D Markowitz Efficient Frontier และวางตำแหน่งพอร์ตโฟลิโอของคุณเทียบกับ Min-Var และ Max-Sharpe.",
      "p2-tornado": "ควอแดรนท์ด้านซ้ายล่างจะทดสอบวิกฤตการณ์ในอดีต 5 ครั้ง การสนับสนุน VaR ต่อสินทรัพย์ 95% และการยึดครองหุ้นขาขึ้น/ขาลง.",
      "p2-corr": "มุมขวาบน เมทริกซ์ 6×6 เปรียบเทียบความสัมพันธ์ในสภาวะปกติกับการแพร่กระจายของส่วนท้ายวิกฤต.",
      "p2-shock2d": "ล่างขวา Shock & Markov ข้ามการเปลี่ยนแปลงอัตราดอกเบี้ยด้วยการเคลื่อนไหว S&P 500 และประมาณการการเปลี่ยนแปลงระบอบการปกครอง.",
      "p2-montecarlo": "และแผงด้านล่างฉายเส้นทาง 10,000 Monte Carlo ข้าม P95, P50 และ P05, Drawdown ใต้น้ำ และ Sharpe ที่กลิ้ง.",
      "p3-impact": "การ์ด Impact 6 ใบจะเปรียบเทียบพอร์ตโฟลิโอปัจจุบันของคุณกับสถานะที่คาดการณ์ไว้หลังจากการเทรดจำลองของคุณ.",
      "p3-whatif": "ด้านซ้ายบน What-If & Kelly จำลองการซื้อหรือขายตั๋ว และคำนวณขนาดตำแหน่ง Half-Kelly ที่เหมาะสมที่สุด.",
      "p3-tailhedge": "ด้านซ้ายล่าง OTM Put & Margin จำลองเกราะป้องกันตัวเลือกและตรวจสอบหลักประกันการบำรุงรักษา Reg-T.",
      "p3-committee": "ในแผงด้านขวาสองแผง คณะกรรมการ 3 เสาจะตรวจสอบราวกั้นความเสี่ยงควบคู่ไปกับบันทึกการดำเนินการและนักบินร่วม.",
      "p3-walkforward": "และที่ด้านล่าง แผนภูมิ Walk-Forward ตรวจสอบประสิทธิภาพของ In-Sample และ Out-of-Sample ด้วยดัชนี WFE."
    }
  },
  "VI": {
    "ui": {
      "walkthrough": "Hướng dẫn trực quan trực tiếp",
      "clickPlayPause": "Bấm để phát hoặc tạm dừng (Dấu cách)",
      "subtitles": "Phụ đề (C)",
      "fullscreen": "Toàn màn hình (F)",
      "exitFullscreen": "Thoát toàn màn hình (F hoặc Esc)",
      "portTabs": [
        "Người xây dựng",
        "Rủi ro",
        "Trình mô phỏng",
        "Phi công phụ"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Ngôn ngữ",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Danh mục",
      "scr-pulse": "02 • Xung 24h",
      "scr-table": "03 • Bảng",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Bản đồ nhiệt",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • kỹ thuật",
      "ana-compare": "03 • So sánh %",
      "ana-micro": "04 • Vi mô & dòng chảy",
      "ana-engines": "05 • Động cơ 3D/2D",
      "res-hero": "01 • Điểm & Thế đứng",
      "res-rag": "02 • Trò chuyện RAG",
      "res-factors": "03 • Yếu tố",
      "res-pulse24h": "04 • Xung FinBERT",
      "p1-pills": "01 • Tóm tắt",
      "p1-table": "02 • Trọng số",
      "p1-xray": "03 • tia X",
      "p1-calendar": "04 • Lịch",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Lốc xoáy & VaR",
      "p2-corr": "03 • Tương quan",
      "p2-shock2d": "04 • Sốc & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • tác động",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • Đặt & ký quỹ OTM",
      "p3-committee": "04 • Ủy ban & Nhật ký",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Chào mừng bạn đến với màn hình Home: điểm khởi đầu không bị phân tâm, nơi thị trường được giải mã.",
      "home-header": "Ở góc trên bên trái của Header, việc nhấp vào biểu tượng λ luôn đưa bạn quay lại giai đoạn chính này.",
      "home-markets": "Nằm ở giữa Header là Markets, trạm làm việc của bạn để nghiên cứu trực tiếp tất cả 213 tài sản toàn cầu.",
      "home-portfolio": "Ngay bên cạnh nó trong menu ở giữa là Portfolio, để xây dựng phân bổ, kiểm tra rủi ro căng thẳng và mô phỏng giao dịch.",
      "home-system": "Ở phía dưới bên trái Footer, System mở màn hình quan sát trực tiếp cho máy chủ và cơ sở dữ liệu.",
      "home-guide": "Ngoài ra, Guide còn mở hướng dẫn tương tác từng bước này bất cứ khi nào bạn cần.",
      "home-langs": "Ở góc dưới bên phải, nút ngôn ngữ mở ra phương thức ở giữa để dịch nền tảng sang 56 ngôn ngữ.",
      "home-palettes": "Và Palette mở ra 5 chủ đề đọc trực quan trong khi vẫn giữ nguyên màu xanh và đỏ tài chính.",
      "scr-categories": "Trong thanh Danh mục trên cùng, lọc qua Tất cả 213 nội dung, Watchlist của bạn hoặc 10 thị trường chuyên biệt.",
      "scr-pulse": "4 thẻ Pulse 24h hiển thị khối lượng tổng hợp, chỉ số RSI trung bình, chế độ P-06 và độ lệch khối lượng hàng đầu.",
      "scr-table": "Bảng tương tác có tính năng tìm kiếm tức thời, mục yêu thích và các cột thông minh được điều chỉnh cho từng loại nội dung.",
      "scr-orbital": "Chế độ xem Orbital ánh xạ nội dung trên ba vòng đồng tâm theo độ lệch bằng bảng kiểm tra bên trực tiếp.",
      "scr-heatmap": "Bản đồ nhiệt sắp xếp 10 nội dung hàng đầu thành các khối tỷ lệ trên 8 sắc thái xanh lục và đỏ.",
      "scr-maintools": "Và Main Tools hướng dẫn bạn ba bước về đường cong chủ quyền, biến động 3D, chéo FX và công cụ tương lai.",
      "ana-hero": "Header kết hợp trình chuyển đổi nội dung, 9 khung thời gian từ 1 tháng đến TẤT CẢ và 5 chỉ báo cốt lõi.",
      "ana-technical": "Ống kính Kỹ thuật phủ lên SMA 20, VWAP và Dải Bollinger 2σ với xác nhận âm lượng đáy.",
      "ana-compare": "Với So sánh %, đo lường lợi thế phần trăm ròng hoặc Alpha Spread từ 0% so với chỉ số hoặc đối thủ tương thích.",
      "ana-micro": "Micro & Flow phát hiện các mức tăng đột biến về khối lượng thông qua Điểm Z 20d, chênh lệch thanh khoản chênh lệch và điểm bất thường P-06.",
      "ana-engines": "Tab thứ tư là một công cụ đặc biệt động, thay đổi tùy theo loại tài sản: vì NVDA là vốn chủ sở hữu nên nó mở ra Khoản thanh toán tùy chọn và biến động 3D, trong khi trái phiếu, FX và hàng hóa khởi chạy các công cụ chuyên dụng của riêng chúng.",
      "res-hero": "Ở trên cùng, Điểm & Lập trường tóm tắt nhận định cơ bản, xếp hạng có trọng số và nhiệt kế tiêu đề.",
      "res-rag": "Ở cột bên trái, Trò chuyện Tài liệu RAG trả lời các truy vấn đã được xác minh dựa trên hồ sơ chính thức của SEC 10-K và 10-Q.",
      "res-factors": "Ở cột giữa, yếu tố xếp hạng so sánh 5 động lực tăng giá hàng đầu với 5 nguy cơ giảm giá hàng đầu.",
      "res-pulse24h": "Ở bên phải, FinBERT Pulse ghi điểm theo các tiêu đề nổi bật trong thời gian thực và vẽ đường cong tâm lý trong 24 giờ.",
      "p1-pills": "6 thẻ Tóm tắt tính toán lại CAGR, Sharpe và Sortino trực tiếp, 95% VaR, Max Drawdown, Alpha và đa dạng hóa.",
      "p1-table": "Trong bảng Trọng số, hãy thêm bất kỳ tài sản nào trong số 213 tài sản, đặt trọng số phần trăm chính xác hoặc cân bằng lại thành 100%.",
      "p1-xray": "Ở trên cùng bên phải, bảng X-Ray gồm 5 tab kiểm tra sự chồng chéo, mức độ hiển thị, phân bổ Brinson, dòng tiền và quyền lưu ký của ETF.",
      "p1-calendar": "Bên dưới X-Ray, Lịch hàng tháng hiển thị tính nhất quán về lợi nhuận từ tháng 1 đến tháng 12 và tổng số YTD.",
      "p1-backtest": "Và ở dưới cùng có chiều rộng đầy đủ, Backtesting so sánh danh mục đầu tư của bạn với S&P 500, 60/40, All-Weather và Min-Variance.",
      "p2-markowitz": "Góc phần tư thứ nhất vẽ Đường biên hiệu quả 2D Markowitz và định vị danh mục đầu tư của bạn so với Min-Var và Max-Sharpe.",
      "p2-tornado": "Góc phần tư phía dưới bên trái kiểm tra 5 cuộc khủng hoảng lịch sử, mức đóng góp VaR 95% cho mỗi tài sản và khả năng nắm bắt Xu hướng tăng/giảm.",
      "p2-corr": "Ở trên cùng bên phải, Ma trận 6×6 so sánh các mối tương quan trong điều kiện bình thường với sự lây lan của khủng hoảng.",
      "p2-shock2d": "Dưới cùng bên phải, Shock & Markov vượt qua sự thay đổi lãi suất với các chuyển đổi S&P 500 và ước tính chuyển đổi chế độ.",
      "p2-montecarlo": "Và bảng điều khiển phía dưới chiếu 10.000 đường dẫn Monte Carlo qua P95, P50 và P05, Drawdown dưới nước và lăn Sharpe.",
      "p3-impact": "6 lá bài Tác động so sánh danh mục đầu tư hiện tại của bạn với trạng thái dự kiến ​​sau các giao dịch mô phỏng của bạn.",
      "p3-whatif": "Trên cùng bên trái, What-If & Kelly mô phỏng mua hoặc bán vé và tính toán kích thước vị thế Half-Kelly tối ưu.",
      "p3-tailhedge": "Dưới cùng bên trái, OTM Put & Margin mô phỏng các lá chắn tùy chọn bảo vệ và giám sát mức ký quỹ duy trì Reg-T.",
      "p3-committee": "Trong hai bảng bên phải, Ủy ban 3 trụ cột kiểm tra các biện pháp bảo vệ rủi ro cùng với Nhật ký thực hiện và Phi công phụ.",
      "p3-walkforward": "Và ở phía dưới, biểu đồ Walk-Forward xác nhận hiệu suất của In-Sample và Out-of-Sample với chỉ số WFE."
    }
  },
  "ID": {
    "ui": {
      "walkthrough": "Panduan Visual Langsung",
      "clickPlayPause": "Klik untuk memutar atau menjeda (Spasi)",
      "subtitles": "Terjemahan (C)",
      "fullscreen": "Layar penuh (P)",
      "exitFullscreen": "Keluar dari Layar Penuh (F atau Esc)",
      "portTabs": [
        "Pembangun",
        "Resiko",
        "Simulator",
        "Kopilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Bahasa",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategori",
      "scr-pulse": "02 • Pulsa 24 jam",
      "scr-table": "03 • Tabel",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Peta panas",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Teknis",
      "ana-compare": "03 • Bandingkan %",
      "ana-micro": "04 • Mikro & Aliran",
      "ana-engines": "05 • Mesin 3D/2D",
      "res-hero": "01 • Skor & Sikap",
      "res-rag": "02 • Obrolan RAG",
      "res-factors": "03 • Faktor",
      "res-pulse24h": "04 • Pulsa FinBERT",
      "p1-pills": "01 • Ringkasan",
      "p1-table": "02 • Pembobotan",
      "p1-xray": "03 • Sinar-X",
      "p1-calendar": "04 • Kalender",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Korelasi",
      "p2-shock2d": "04 • Kejutan & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Dampak",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • Masukan & Margin OTM",
      "p3-committee": "04 • Komite & Log",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Selamat datang di layar Home: titik awal bebas gangguan tempat pasar diterjemahkan.",
      "home-header": "Di pojok kiri atas Header, mengklik ikon λ selalu membawa Anda kembali ke panggung utama ini.",
      "home-markets": "Berpusat di bagian atas Header adalah Markets, stasiun kerja Anda untuk meneliti 213 aset global secara langsung.",
      "home-portfolio": "Tepat di sampingnya di menu tengah adalah Portfolio, untuk membangun alokasi, menguji risiko, dan mensimulasikan perdagangan.",
      "home-system": "Di kiri bawah Footer, System membuka monitor observasi langsung untuk server dan database.",
      "home-guide": "Di sampingnya, Guide membuka panduan langkah demi langkah interaktif ini kapan pun Anda membutuhkannya.",
      "home-langs": "Di pojok kanan bawah, tombol bahasa membuka modal tengah untuk menerjemahkan platform ke dalam 56 bahasa.",
      "home-palettes": "Dan Palette membuka 5 tema bacaan visual dengan tetap menjaga keutuhan warna hijau dan merah finansial.",
      "scr-categories": "Di bilah Kategori atas, filter seluruh 213 aset, Watchlist Anda, atau 10 pasar khusus.",
      "scr-pulse": "4 kartu Pulse 24 jam menunjukkan volume agregat, RSI rata-rata, rezim P-06, dan dislokasi volume atas.",
      "scr-table": "Tabel interaktif menampilkan pencarian instan, favorit, dan kolom cerdas yang disesuaikan dengan setiap kelas aset.",
      "scr-orbital": "Tampilan Orbital memetakan aset di tiga lingkaran konsentris berdasarkan deviasi dengan panel inspeksi sisi langsung.",
      "scr-heatmap": "Peta Panas mengatur 10 aset teratas ke dalam blok proporsional dalam 8 warna hijau dan merah.",
      "scr-maintools": "Dan Main Tools memandu Anda dalam tiga langkah menuju kurva kedaulatan, volatilitas 3D, persilangan FX, dan mesin berjangka.",
      "ana-hero": "Header menggabungkan pengalih aset, 9 kerangka waktu dari 1m ke ALL, dan 5 indikator inti.",
      "ana-technical": "Lensa Teknis melapisi SMA 20, VWAP, dan 2σ Bollinger Bands dengan konfirmasi volume bawah.",
      "ana-compare": "Dengan Bandingkan%, ukur keunggulan persentase bersih atau Alpha Spread dari 0% terhadap rekan atau indeks yang kompatibel.",
      "ana-micro": "Micro & Flow mendeteksi lonjakan volume melalui Z-Score 20 hari, dislokasi likuiditas spread, dan skor anomali P-06.",
      "ana-engines": "Tab keempat adalah alat ad-hoc dinamis yang bervariasi berdasarkan kelas aset: karena NVDA adalah ekuitas, ia membuka Volatilitas & Pembayaran Opsi 3D, sementara obligasi, FX, dan komoditas meluncurkan alat khusus mereka sendiri.",
      "res-hero": "Di bagian atas, Score & Stance merangkum keputusan fundamental, rating tertimbang, dan termometer judul.",
      "res-rag": "Di kolom kiri, Obrolan Dokumen RAG menjawab pertanyaan terverifikasi berdasarkan pengajuan resmi SEC 10-K dan 10-Q.",
      "res-factors": "Di kolom tengah, akordeon Faktor mengontraskan 5 pendorong kenaikan teratas dengan 5 risiko penurunan teratas.",
      "res-pulse24h": "Di sebelah kanan, FinBERT Pulse mencetak berita utama terkini secara real-time dan menggambarkan kurva sentimen 24 jam.",
      "p1-pills": "6 kartu Ringkasan menghitung ulang CAGR, Sharpe dan Sortino langsung, 95% VaR, Max Drawdown, Alpha, dan diversifikasi.",
      "p1-table": "Di tabel Pembobotan, tambahkan salah satu dari 213 aset, tetapkan bobot persentase yang tepat, atau seimbangkan kembali menjadi 100%.",
      "p1-xray": "Kanan atas, panel X-Ray 5 tab mengaudit tumpang tindih ETF, eksposur, atribusi Brinson, arus kas, dan penyimpanan.",
      "p1-calendar": "Di bawah X-Ray, Kalender Bulanan menampilkan konsistensi pengembalian Januari-Desember dan total YTD.",
      "p1-backtest": "Dan di bagian bawah lebar penuh, Backtesting membandingkan portofolio Anda dengan S&P 500, 60/40, All-Weather, dan Min-Variance.",
      "p2-markowitz": "Kuadran pertama memplot Perbatasan Efisien Markowitz 2D dan memposisikan portofolio Anda versus Min-Var dan Max-Sharpe.",
      "p2-tornado": "Kuadran kiri bawah menguji 5 krisis historis, 95% kontribusi VaR per aset, dan tangkapan Sisi Atas/Bawah.",
      "p2-corr": "Kanan atas, Matriks 6×6 membandingkan korelasi dalam kondisi normal dengan penularan krisis.",
      "p2-shock2d": "Kanan bawah, Shock & Markov melintasi pergeseran suku bunga dengan pergerakan S&P 500 dan memperkirakan transisi rezim.",
      "p2-montecarlo": "Dan panel bawah memproyeksikan 10.000 jalur Monte Carlo melintasi P95, P50, dan P05, Drawdown bawah air, dan menggulirkan Sharpe.",
      "p3-impact": "6 kartu Dampak membandingkan portofolio Anda saat ini dengan keadaan yang diproyeksikan setelah simulasi perdagangan Anda.",
      "p3-whatif": "Kiri atas, What-If & Kelly menyimulasikan pembelian atau penjualan tiket dan menghitung ukuran posisi Half-Kelly yang optimal.",
      "p3-tailhedge": "Kiri bawah, OTM Put & Margin menyimulasikan pelindung opsi pelindung dan memantau margin pemeliharaan Reg-T.",
      "p3-committee": "Di dua panel kanan, Komite 3 pilar mengaudit pagar pembatas risiko di samping Log Eksekusi dan Kopilot.",
      "p3-walkforward": "Dan di bagian bawah, bagan Walk-Forward memvalidasi kinerja In-Sample dan Out-of-Sample dengan indeks WFE."
    }
  },
  "MS": {
    "ui": {
      "walkthrough": "Panduan Visual Langsung",
      "clickPlayPause": "Klik untuk bermain atau jeda (Ruang)",
      "subtitles": "Sari kata (C)",
      "fullscreen": "Skrin penuh (F)",
      "exitFullscreen": "Keluar dari Skrin Penuh (F atau Esc)",
      "portTabs": [
        "pembina",
        "risiko",
        "Simulator",
        "Copilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Bahasa",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategori",
      "scr-pulse": "02 • Nadi 24j",
      "scr-table": "03 • Jadual",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Peta haba",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Teknikal",
      "ana-compare": "03 • Bandingkan %",
      "ana-micro": "04 • Mikro & Aliran",
      "ana-engines": "05 • Enjin 3D/2D",
      "res-hero": "01 • Skor & Pendirian",
      "res-rag": "02 • Sembang RAG",
      "res-factors": "03 • Faktor",
      "res-pulse24h": "04 • Nadi FinBERT",
      "p1-pills": "01 • Ringkasan",
      "p1-table": "02 • Pemberatan",
      "p1-xray": "03 • X-Ray",
      "p1-calendar": "04 • Kalendar",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado & VaR",
      "p2-corr": "03 • Korelasi",
      "p2-shock2d": "04 • Kejutan & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Kesan",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • AJK & Log",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Selamat datang ke skrin Home: titik permulaan bebas gangguan anda di mana pasaran dinyahkod.",
      "home-header": "Di penjuru kiri sebelah atas Header, mengklik ikon λ sentiasa membawa anda kembali ke peringkat utama ini.",
      "home-markets": "Berpusat di bahagian atas Header ialah Markets, stesen kerja anda untuk menyelidik semua 213 aset global secara langsung.",
      "home-portfolio": "Di sebelahnya dalam menu berpusat ialah Portfolio, untuk membina peruntukan, risiko ujian tekanan dan mensimulasikan dagangan.",
      "home-system": "Di bahagian bawah sebelah kiri Footer, System membuka monitor kebolehmerhatian langsung untuk pelayan dan pangkalan data.",
      "home-guide": "Di sebelahnya, Guide membuka manual langkah demi langkah interaktif ini apabila anda memerlukannya.",
      "home-langs": "Di penjuru kanan sebelah bawah, butang bahasa membuka modal berpusat untuk menterjemah platform kepada 56 bahasa.",
      "home-palettes": "Dan Palette membuka 5 tema bacaan visual sambil memastikan kewangan hijau dan merah sentiasa utuh.",
      "scr-categories": "Dalam bar Kategori teratas, tapis merentas Semua 213 aset, Watchlist anda atau 10 pasaran khusus.",
      "scr-pulse": "Kad 4 Pulse 24j menunjukkan volum agregat, RSI purata, rejim P-06 dan kehelan volum teratas.",
      "scr-table": "Jadual interaktif menampilkan carian segera, kegemaran dan lajur pintar yang disesuaikan dengan setiap kelas aset.",
      "scr-orbital": "Paparan Orbital memetakan aset merentasi tiga cincin sepusat dengan sisihan dengan panel pemeriksaan sisi langsung.",
      "scr-heatmap": "Peta Haba menyusun 10 aset teratas ke dalam blok berkadar merentas 8 warna hijau dan merah.",
      "scr-maintools": "Dan Main Tools membimbing anda dalam tiga langkah ke lengkung berdaulat, turun naik 3D, silang FX dan enjin hadapan.",
      "ana-hero": "Header menggabungkan penukar aset, 9 rangka masa dari 1m kepada SEMUA dan 5 penunjuk teras.",
      "ana-technical": "Lensa Teknikal menindih SMA 20, VWAP dan 2σ Bollinger Bands dengan pengesahan volum bawah.",
      "ana-compare": "Dengan Bandingkan %, ukur kelebihan peratusan bersih atau Alpha Spread daripada 0% berbanding rakan setara atau indeks.",
      "ana-micro": "Micro & Flow mengesan lonjakan volum melalui 20d Z-Score, penyebaran kehelan kecairan dan skor anomali P-06.",
      "ana-engines": "Tab keempat ialah alat ad-hoc dinamik yang berbeza mengikut kelas aset: kerana NVDA ialah ekuiti, ia membuka Kemeruapan 3D & Pembayaran Pilihan, manakala bon, FX dan komoditi melancarkan alat khusus mereka sendiri.",
      "res-hero": "Di bahagian atas, Score & Stance meringkaskan keputusan asas, penilaian wajaran dan termometer tajuk.",
      "res-rag": "Di lajur kiri, RAG Document Chat menjawab pertanyaan yang disahkan berdasarkan pemfailan SEC 10-K dan 10-Q rasmi.",
      "res-factors": "Di lajur tengah, akordion Faktor membezakan 5 pemandu lembu terbaik berbanding 5 risiko beruang teratas.",
      "res-pulse24h": "Di sebelah kanan, FinBERT Pulse mencatatkan berita utama dalam masa nyata dan memplot keluk sentimen 24 jam.",
      "p1-pills": "6 kad Summary mengira semula CAGR secara langsung, Sharpe dan Sortino, 95% VaR, Max Drawdown, Alpha dan kepelbagaian.",
      "p1-table": "Dalam jadual Pemberat, tambahkan mana-mana daripada 213 aset, tetapkan peratusan wajaran tepat atau imbangan semula kepada 100%.",
      "p1-xray": "Di kanan atas, panel X-Ray 5 tab mengaudit pertindihan, pendedahan, atribusi Brinson, aliran tunai dan jagaan ETF.",
      "p1-calendar": "Di bawah X-Ray, Kalendar Bulanan memaparkan konsistensi pemulangan Januari-hingga-Disember dan jumlah YTD.",
      "p1-backtest": "Dan pada bahagian bawah lebar penuh, Backtesting membandingkan portfolio anda dengan S&P 500, 60/40, All-Weather dan Min-Variance.",
      "p2-markowitz": "Kuadran pertama memplotkan 2D Markowitz Efficient Frontier dan meletakkan portfolio anda berbanding Min-Var dan Max-Sharpe.",
      "p2-tornado": "Kuadran kiri bawah menguji 5 krisis sejarah, sumbangan 95% VaR setiap aset dan tangkapan Upside/Downside.",
      "p2-corr": "Atas kanan, Matriks 6×6 membandingkan korelasi dalam keadaan biasa dengan penularan ekor krisis.",
      "p2-shock2d": "Bawah kanan, Shock & Markov melintasi peralihan kadar faedah dengan pergerakan S&P 500 dan menganggarkan peralihan rejim.",
      "p2-montecarlo": "Dan panel bawah menayangkan 10,000 laluan Monte Carlo merentasi P95, P50, dan P05, Drawdown dalam air dan Sharpe rolling.",
      "p3-impact": "6 Kad Impak membandingkan portfolio semasa anda dengan keadaan yang diunjurkan selepas dagangan simulasi anda.",
      "p3-whatif": "Kiri atas, What-If & Kelly mensimulasikan pembelian atau penjualan tiket dan mengira saiz kedudukan Half-Kelly yang optimum.",
      "p3-tailhedge": "Bahagian kiri bawah, OTM Put & Margin mensimulasikan perisai pilihan perlindungan dan memantau margin penyelenggaraan Reg-T.",
      "p3-committee": "Dalam dua panel kanan, Jawatankuasa 3 tiang mengaudit pagar pengadang risiko bersama Log Perlaksanaan dan Copilot.",
      "p3-walkforward": "Dan di bahagian bawah, carta Walk-Forward mengesahkan prestasi In-Sample dan Out-of-Sample dengan indeks WFE."
    }
  },
  "TL": {
    "ui": {
      "walkthrough": "Live Visual Walkthrough",
      "clickPlayPause": "I-click upang i-play o i-pause (Space)",
      "subtitles": "Mga Subtitle (C)",
      "fullscreen": "Fullscreen (F)",
      "exitFullscreen": "Lumabas sa Fullscreen (F o Esc)",
      "portTabs": [
        "Tagabuo",
        "Panganib",
        "Simulator",
        "Copilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Mga wika",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Mga kategorya",
      "scr-pulse": "02 • 24h Pulse",
      "scr-table": "03 • mesa",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Heatmap",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Teknikal",
      "ana-compare": "03 • Ihambing ang %",
      "ana-micro": "04 • Micro at Daloy",
      "ana-engines": "05 • Mga 3D/2D na Engine",
      "res-hero": "01 • Iskor at Paninindigan",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • Mga salik",
      "res-pulse24h": "04 • FinBERT Pulse",
      "p1-pills": "01 • Buod",
      "p1-table": "02 • Pagtitimbang",
      "p1-xray": "03 • X-Ray",
      "p1-calendar": "04 • Kalendaryo",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Buhawi at VaR",
      "p2-corr": "03 • Kaugnayan",
      "p2-shock2d": "04 • Shock at Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Epekto",
      "p3-whatif": "02 • What-If at Kelly",
      "p3-tailhedge": "03 • OTM Put & Margin",
      "p3-committee": "04 • Komite at Log",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Maligayang pagdating sa screen ng Home: ang iyong walang distraction na panimulang punto kung saan nade-decode ang mga market.",
      "home-header": "Sa kaliwang sulok sa itaas ng Header, ang pag-click sa icon na λ ay palaging magdadala sa iyo pabalik sa pangunahing yugtong ito.",
      "home-markets": "Nakasentro sa tuktok ng Header ang Markets, ang iyong workstation para magsaliksik ng lahat ng 213 pandaigdigang asset nang live.",
      "home-portfolio": "Sa tabi mismo nito sa nakasentro na menu ay ang Portfolio, upang bumuo ng mga alokasyon, panganib sa pagsubok sa stress, at gayahin ang mga trade.",
      "home-system": "Sa ibabang kaliwang Footer, binubuksan ng System ang live observability monitor para sa mga server at database.",
      "home-guide": "Sa tabi nito, binubuksan ng Guide ang interactive na step-by-step na manual sa tuwing kailangan mo ito.",
      "home-langs": "Sa kanang sulok sa ibaba, binubuksan ng button ng wika ang nakasentro na modal upang isalin ang platform sa 56 na wika.",
      "home-palettes": "At ang Palette ay nagbubukas ng 5 visual na tema ng pagbabasa habang pinapanatili ang pinansiyal na berde at pula na mahigpit na buo.",
      "scr-categories": "Sa tuktok na bar ng Mga Kategorya, i-filter ang lahat ng 213 asset, ang iyong Watchlist, o 10 espesyal na market.",
      "scr-pulse": "Ang 4 Pulse 24h card ay nagpapakita ng pinagsama-samang volume, average na RSI, P-06 na rehimen, at mga dislokasyon sa pinakamataas na volume.",
      "scr-table": "Nagtatampok ang interactive na Talahanayan ng instant na paghahanap, mga paborito, at mga smart column na iniakma sa bawat klase ng asset.",
      "scr-orbital": "Ang Orbital view ay nagmamapa ng mga asset sa tatlong concentric ring sa pamamagitan ng deviation na may live side inspection panel.",
      "scr-heatmap": "Inaayos ng Heatmap ang nangungunang 10 asset sa proporsyonal na mga bloke sa 8 shade ng berde at pula.",
      "scr-maintools": "At ginagabayan ka ng Main Tools sa tatlong hakbang sa mga sovereign curves, 3D volatility, FX cross, at futures engine.",
      "ana-hero": "Pinagsasama ng Header ang asset switcher, 9 na timeframe mula 1m hanggang LAHAT, at ang 5 pangunahing indicator.",
      "ana-technical": "Ang Teknikal na lens ay naka-overlay sa SMA 20, VWAP, at 2σ Bollinger Band na may mas mababang volume na kumpirmasyon.",
      "ana-compare": "Sa Compare %, sukatin ang net percentage advantage o Alpha Spread mula 0% laban sa isang katugmang peer o index.",
      "ana-micro": "Nakikita ng Micro & Flow ang mga pagtaas ng volume sa pamamagitan ng 20d Z-Score, pagkalat ng liquidity dislocation, at ang P-06 na marka ng anomalya.",
      "ana-engines": "Ang ika-apat na tab ay isang dynamic na ad-hoc tool na nag-iiba-iba ayon sa klase ng asset: dahil ang NVDA ay isang equity nagbubukas ito ng 3D Volatility & Options Payoff, habang ang mga bond, FX, at commodities ay naglulunsad ng sarili nilang mga espesyal na tool.",
      "res-hero": "Sa itaas, ibinubuod ng Score & Stance ang pangunahing hatol, weighted rating, at headline thermometer.",
      "res-rag": "Sa kaliwang column, sinasagot ng RAG Document Chat ang mga na-verify na query na batay sa opisyal na SEC 10-K at 10-Q filing.",
      "res-factors": "Sa gitnang hanay, ang Factors accordion ay pinaghahambing ang nangungunang 5 bull driver laban sa nangungunang 5 bear na panganib.",
      "res-pulse24h": "Sa kanan, ang FinBERT Pulse ay nagmamarka ng mga breaking headline sa real time at nag-plot ng 24-hour sentiment curve.",
      "p1-pills": "Ang 6 na Summary card ay nagrecompute ng live na CAGR, Sharpe at Sortino, 95% VaR, Max Drawdown, Alpha, at diversification.",
      "p1-table": "Sa Weighting table, idagdag ang alinman sa 213 asset, itakda ang eksaktong percentage weights, o rebalance sa 100%.",
      "p1-xray": "Sa kanang itaas, sinusuri ng 5-tab na X-Ray panel ang pag-overlap ng ETF, pagkakalantad, pagpapatungkol sa Brinson, cashflow, at pag-iingat.",
      "p1-calendar": "Sa ibaba ng X-Ray, ipinapakita ng Buwanang Kalendaryo ang pagkakapare-pareho ng pagbalik mula Enero hanggang Disyembre at mga kabuuan ng YTD.",
      "p1-backtest": "At sa full-width na ibaba, inihahambing ng Backtesting ang iyong portfolio laban sa S&P 500, 60/40, All-Weather, at Min-Variance.",
      "p2-markowitz": "Inilalagay ng unang quadrant ang 2D Markowitz Efficient Frontier at ipinoposisyon ang iyong portfolio kumpara sa Min-Var at Max-Sharpe.",
      "p2-tornado": "Ang ibabang kaliwang quadrant ay sumusubok sa 5 makasaysayang krisis, per-asset na 95% VaR na kontribusyon, at Upside/Downside capture.",
      "p2-corr": "Sa kanang itaas, inihahambing ng 6×6 Matrix ang mga ugnayan sa mga normal na kondisyon laban sa pagkalat ng buntot ng krisis.",
      "p2-shock2d": "Sa ibabang kanan, ang Shock & Markov ay tumatawid sa mga pagbabago sa rate ng interes sa mga paggalaw ng S&P 500 at tinatantya ang mga paglipat ng rehimen.",
      "p2-montecarlo": "At ang ilalim na panel ay nagpapalabas ng 10,000 Monte Carlo path sa P95, P50, at P05, underwater Drawdown, at rolling Sharpe.",
      "p3-impact": "Inihahambing ng 6 na Impact card ang iyong kasalukuyang portfolio laban sa inaasahang estado pagkatapos ng iyong mga simulate na trade.",
      "p3-whatif": "Sa kaliwa sa itaas, What-If at Kelly ay ginagaya ang pagbili o pagbebenta ng mga tiket at kino-compute ang pinakamainam na laki ng posisyon ng Half-Kelly.",
      "p3-tailhedge": "Sa ibaba sa kaliwa, ginagaya ng OTM Put & Margin ang mga protective option shield at sinusubaybayan ang Reg-T maintenance margin.",
      "p3-committee": "Sa dalawang kanang panel, ang 3-pillar na Committee ay nag-audit ng mga panganib na guardrail sa tabi ng Execution Log at Copilot.",
      "p3-walkforward": "At sa ibaba, ang Walk-Forward chart ay nagpapatunay ng In-Sample at Out-of-Sample na pagganap gamit ang WFE index."
    }
  },
  "JA": {
    "ui": {
      "walkthrough": "ライブビジュアルウォークスルー",
      "clickPlayPause": "クリックして再生または一時停止します (スペース)",
      "subtitles": "字幕(C)",
      "fullscreen": "フルスクリーン(F)",
      "exitFullscreen": "全画面表示を終了 (F または Esc)",
      "portTabs": [
        "ビルダー",
        "リスク",
        "シミュレータ",
        "副操縦士"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • 言語",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • カテゴリー",
      "scr-pulse": "02 • 24時間パルス",
      "scr-table": "03 • テーブル",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • ヒートマップ",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • 技術的な",
      "ana-compare": "03 • 比較%",
      "ana-micro": "04 • マイクロ＆フロー",
      "ana-engines": "05 • 3D/2D エンジン",
      "res-hero": "01 • スコアとスタンス",
      "res-rag": "02 • RAG チャット",
      "res-factors": "03 • 要因",
      "res-pulse24h": "04 • FinBERTパルス",
      "p1-pills": "01 • 概要",
      "p1-table": "02 • 重み付け",
      "p1-xray": "03 • X線",
      "p1-calendar": "04 • カレンダー",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • トルネード&VaR",
      "p2-corr": "03 • 相関関係",
      "p2-shock2d": "04 • ショック＆マルコフ",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • 影響",
      "p3-whatif": "02 • What-If & ケリー",
      "p3-tailhedge": "03 • OTM プットとマージン",
      "p3-committee": "04 • 委員会とログ",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home 画面へようこそ；ここは、気を散らすことなく市場を解読できるスタート地点です。",
      "home-header": "Header の左上隅にある λ アイコンをクリックすると、常にこのメイン ステージに戻ります。",
      "home-markets": "Header の上部の中央には Markets があり、213 のグローバル資産すべてをライブで調査するためのワークステーションです。",
      "home-portfolio": "中央のメニューのすぐ隣には、割り当てを構築し、リスクをテストし、取引をシミュレーションするための Portfolio があります。",
      "home-system": "左下の Footer、System は、サーバーとデータベースのライブ可観測性モニターを開きます。",
      "home-guide": "その横に、Guide は、必要なときにいつでもこのインタラクティブなステップバイステップ マニュアルを開きます。",
      "home-langs": "右下隅にある言語ボタンを押すと、中央のモーダルが開き、プラットフォームを 56 の言語に翻訳できます。",
      "home-palettes": "そして、Palette は、金融の緑と赤を厳密にそのままにしながら、5 つの視覚的な読み取りテーマを開きます。",
      "scr-categories": "上部のカテゴリ バーで、全 213 のアセット、Watchlist、または 10 の専門市場をフィルターします。",
      "scr-pulse": "4 枚の Pulse 24h カードには、集約ボリューム、平均 RSI、P-06 レジーム、およびトップ ボリューム転位が表示されます。",
      "scr-table": "インタラクティブなテーブルには、インスタント検索、お気に入り、各資産クラスに合わせたスマートな列が備わっています。",
      "scr-orbital": "Orbital ビューは、ライブサイド検査パネルを使用して、偏差によって 3 つの同心リング全体に資産をマッピングします。",
      "scr-heatmap": "ヒートマップは、上位 10 のアセットを緑と赤の 8 階調にわたる比例ブロックに配置します。",
      "scr-maintools": "また、Main Tools は、ソブリン カーブ、3D ボラティリティ、FX クロス、先物エンジンへの 3 つのステップをガイドします。",
      "ana-hero": "Header は、アセットスイッチャー、1m から ALL までの 9 つのタイムフレーム、および 5 つのコアインジケーターを組み合わせています。",
      "ana-technical": "テクニカルレンズは、SMA 20、VWAP、および2σボリンジャーバンドをボトムボリューム確認でオーバーレイします。",
      "ana-compare": "[比較 %] を使用すると、互換性のあるピアまたはインデックスに対する 0% からの純パーセンテージ アドバンテージまたは Alpha Spread を測定します。",
      "ana-micro": "Micro & Flow は、20 日の Z スコア、スプレッド流動性の混乱、および P-06 異常スコアを介して取引高のスパイクを検出します。",
      "ana-engines": "4 番目のタブは、資産クラスによって異なる動的アドホック ツールです；NVDA は株式であるため、3D ボラティリティとオプション ペイオフが開きますが、債券、FX、商品は独自の特殊なツールが起動します。",
      "res-hero": "上部には、スコアとスタンスが基本的な判断、加重評価、ヘッドラインの温度計をまとめています。",
      "res-rag": "左側の列では、RAG ドキュメント チャットが、公式 SEC 10-K および 10-Q 提出書類に基づいた検証済みのクエリに回答します。",
      "res-factors": "中央の列では、Factors アコーディオンで強気派上位 5 人と弱気派リスク上位 5 人を対比させています。",
      "res-pulse24h": "右側では、FinBERT Pulse がリアルタイムで最新のヘッドラインをスコアし、24 時間の感情曲線をプロットしています。",
      "p1-pills": "6 つの概要カードは、ライブ CAGR、Sharpe、Sortino、95% VaR、Max Drawdown、アルファ、および多様化を再計算します。",
      "p1-table": "重み付けテーブルで、213 の資産のいずれかを追加し、正確なパーセントの重みを設定するか、100% にリバランスします。",
      "p1-xray": "右上の 5 タブの X-Ray パネルは、ETF のオーバーラップ、エクスポージャー、ブリンソンの帰属、キャッシュフロー、カストディを監査します。",
      "p1-calendar": "X-Ray の下の月次カレンダーには、1 月から 12 月までの返品の一貫性と YTD 合計が表示されます。",
      "p1-backtest": "全角の下部では、Backtesting がポートフォリオを S&P 500、60/40、All-Weather、Min-Variance と比較します。",
      "p2-markowitz": "最初の象限は 2D Markowitz 効率フロンティアをプロットし、ポートフォリオを Min-Var および Max-Sharpe と比較して配置します。",
      "p2-tornado": "左下の象限は、5 つの歴史的危機、資産ごとの 95% VaR 寄与、および上値/下値キャプチャをテストします。",
      "p2-corr": "右上の 6×6 マトリックスは、通常の状態と危機尾部の伝染の相関関係を比較しています。",
      "p2-shock2d": "右下、ショック＆マルコフは金利の変化とS&P 500の動きを交差させ、政権移行を推定します。",
      "p2-montecarlo": "そして、下部パネルには、P95、P50、および P05 にわたる 10,000 の Monte Carlo パス、水中ドローダウン、およびローリング Sharpe が投影されます。",
      "p3-impact": "6 つのインパクト カードは、現在のポートフォリオと、シミュレーション取引後の予想される状態を比較します。",
      "p3-whatif": "左上、What-If & Kelly はチケットの売買をシミュレートし、最適な Half-Kelly ポジション サイズを計算します。",
      "p3-tailhedge": "左下の OTM プット & マージンは、保護オプション シールドをシミュレートし、Reg-T メンテナンス マージンを監視します。",
      "p3-committee": "右側の 2 つのパネルでは、3 本柱委員会が実行ログと副操縦士と並んでリスク ガードレールを監査します。",
      "p3-walkforward": "そして一番下の Walk-Forward チャートは、WFE インデックスを使用して In-Sample および Out-of-Sample のパフォーマンスを検証します。"
    }
  },
  "KO": {
    "ui": {
      "walkthrough": "라이브 시각적 연습",
      "clickPlayPause": "재생 또는 일시 정지하려면 클릭하세요(스페이스바)",
      "subtitles": "자막(C)",
      "fullscreen": "전체화면(F)",
      "exitFullscreen": "전체 화면 종료(F 또는 Esc)",
      "portTabs": [
        "빌더",
        "위험",
        "시뮬레이터",
        "부조종사"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header(λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • 언어",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • 카테고리",
      "scr-pulse": "02 • 24시간 펄스",
      "scr-table": "03 • 테이블",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • 히트맵",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • 기술",
      "ana-compare": "03 • % 비교",
      "ana-micro": "04 • 마이크로 & 플로우",
      "ana-engines": "05 • 3D/2D 엔진",
      "res-hero": "01 • 점수 및 자세",
      "res-rag": "02 • RAG 채팅",
      "res-factors": "03 • 요인",
      "res-pulse24h": "04 • FinBERT 펄스",
      "p1-pills": "01 • 요약",
      "p1-table": "02 • 가중치",
      "p1-xray": "03 • 엑스레이",
      "p1-calendar": "04 • 달력",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • 토네이도 & VaR",
      "p2-corr": "03 • 상관관계",
      "p2-shock2d": "04 • 쇼크 & 마르코프",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • 영향",
      "p3-whatif": "02 • What-If & 켈리",
      "p3-tailhedge": "03 • OTM 풋앤마진",
      "p3-committee": "04 • 위원회 및 로그",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Home 화면에 오신 것을 환영합니다; 시장이 해독되는 방해 없는 시작점입니다.",
      "home-header": "Header의 왼쪽 상단 모서리에 있는 λ 아이콘을 클릭하면 항상 이 메인 스테이지로 바로 돌아갑니다.",
      "home-markets": "Header 상단 중앙에는 213개의 글로벌 자산을 모두 실시간으로 조사할 수 있는 워크스테이션인 Markets가 있습니다.",
      "home-portfolio": "중앙 메뉴 바로 옆에는 할당, 스트레스 테스트 위험 및 거래 시뮬레이션을 위한 Portfolio가 있습니다.",
      "home-system": "왼쪽 하단 Footer에서 System는 서버 및 데이터베이스에 대한 실시간 관찰 모니터를 엽니다.",
      "home-guide": "그 옆에 Guide는 필요할 때마다 이 대화형 단계별 설명서를 엽니다.",
      "home-langs": "오른쪽 하단 모서리에 있는 언어 버튼을 누르면 플랫폼을 56개 언어로 번역할 수 있는 중앙 모달이 열립니다.",
      "home-palettes": "그리고 Palette는 금융 녹색과 빨간색을 그대로 유지하면서 5가지 시각적 읽기 테마를 엽니다.",
      "scr-categories": "상단 카테고리 표시줄에서 전체 213개 자산, Watchlist 또는 10개 전문 시장을 필터링합니다.",
      "scr-pulse": "4개의 Pulse 24h 카드에는 집계된 볼륨, 평균 RSI, P-06 체제 및 최고 볼륨 전위가 표시됩니다.",
      "scr-table": "대화형 테이블에는 각 자산 클래스에 맞는 즉각적인 검색, 즐겨찾기 및 스마트 열이 있습니다.",
      "scr-orbital": "Orbital 보기는 실시간 측면 검사 패널을 사용하여 편차에 따라 3개의 동심 링에 자산을 매핑합니다.",
      "scr-heatmap": "히트맵은 상위 10개 자산을 녹색과 빨간색의 8가지 음영에 걸쳐 비례 블록으로 배열합니다.",
      "scr-maintools": "그리고 Main Tools는 주권 곡선, 3D 변동성, FX 교차 및 선물 엔진에 대한 3단계를 안내합니다.",
      "ana-hero": "Header는 자산 전환기, 1m에서 ALL까지 9개의 기간 및 5개의 핵심 지표를 결합합니다.",
      "ana-technical": "기술 렌즈는 SMA 20, VWAP 및 2σ 볼린저 밴드를 하단 볼륨 확인과 오버레이합니다.",
      "ana-compare": "% 비교를 사용하면 호환 가능한 피어 또는 지수에 대해 0%에서 순 백분율 이점 또는 Alpha Spread를 측정합니다.",
      "ana-micro": "Micro & Flow는 20d Z-Score, 스프레드 유동성 전위 및 P-06 이상 점수를 통해 거래량 급증을 감지합니다.",
      "ana-engines": "네 번째 탭은 자산 클래스에 따라 달라지는 동적 임시 도구입니다; NVDA는 주식이므로 3D 변동성 및 옵션 보상이 열리고 채권, FX 및 상품은 고유한 전문 도구를 시작합니다.",
      "res-hero": "상단에는 Score & Stance의 기본 평결, 가중 평점, 헤드라인 온도계가 요약되어 있습니다.",
      "res-rag": "왼쪽 열의 RAG 문서 채팅은 공식 SEC 10-K 및 10-Q 서류에 근거한 검증된 쿼리에 답변합니다.",
      "res-factors": "중앙 열에서 Factors 아코디언은 상위 5개 강세 요인과 상위 5개 약세 위험을 대조합니다.",
      "res-pulse24h": "오른쪽에서 FinBERT Pulse는 실시간으로 속보 헤드라인의 점수를 매기고 24시간 감정 곡선을 표시합니다.",
      "p1-pills": "6개의 요약 카드는 실시간 CAGR, Sharpe 및 Sortino, 95% VaR, Max Drawdown, 알파 및 다양화를 다시 계산합니다.",
      "p1-table": "가중치 테이블에서 213개 자산 중 하나를 추가하거나, 정확한 백분율 가중치를 설정하거나, 100%로 재조정합니다.",
      "p1-xray": "오른쪽 상단의 5개 탭 X-Ray 패널은 ETF 중복, 노출, Brinson 속성, 현금 흐름 및 보관을 감사합니다.",
      "p1-calendar": "X-Ray 아래의 월별 달력에는 1월부터 12월까지의 반품 일관성과 YTD 총계가 표시됩니다.",
      "p1-backtest": "그리고 전체 너비 하단에서 Backtesting는 포트폴리오를 S&P 500, 60/40, All-Weather 및 Min-Variance와 비교합니다.",
      "p2-markowitz": "첫 번째 사분면은 2D Markowitz Efficient Frontier를 표시하고 Min-Var 및 Max-Sharpe와 비교하여 포트폴리오를 배치합니다.",
      "p2-tornado": "왼쪽 아래 사분면은 5가지 역사적 위기, 자산당 95% VaR 기여도 및 상승/하락 포착을 테스트합니다.",
      "p2-corr": "오른쪽 상단의 6×6 매트릭스는 위기 꼬리 전염과 정상 조건의 상관관계를 비교합니다.",
      "p2-shock2d": "오른쪽 하단의 Shock & Markov는 S&P 500 움직임으로 금리 변화를 교차하고 정권 전환을 추정합니다.",
      "p2-montecarlo": "하단 패널에는 P95, P50 및 P05, 수중 드로우다운 및 롤링 Sharpe에 걸쳐 10,000개의 Monte Carlo 경로가 투영됩니다.",
      "p3-impact": "6개의 영향 카드는 시뮬레이션 거래 후 예상 상태와 현재 포트폴리오를 비교합니다.",
      "p3-whatif": "왼쪽 상단, What-If 및 Kelly는 티켓 구매 또는 판매를 시뮬레이션하고 최적의 Half-Kelly 포지션 크기를 계산합니다.",
      "p3-tailhedge": "왼쪽 하단의 OTM Put & Margin은 보호 옵션 실드를 시뮬레이션하고 Reg-T 유지 관리 마진을 모니터링합니다.",
      "p3-committee": "두 개의 오른쪽 패널에서 3개 기둥 위원회는 실행 로그 및 Copilot과 함께 위험 가드레일을 감사합니다.",
      "p3-walkforward": "그리고 하단의 Walk-Forward 차트는 WFE 지수를 사용하여 In-Sample 및 Out-of-Sample 성능을 검증합니다."
    }
  },
  "ZH": {
    "ui": {
      "walkthrough": "实时视觉演练",
      "clickPlayPause": "单击播放或暂停（空格键）",
      "subtitles": "字幕（C）",
      "fullscreen": "全屏 (F)",
      "exitFullscreen": "退出全屏（F 或 Esc）",
      "portTabs": [
        "建设者",
        "风险",
        "模拟器",
        "副驾驶"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header(λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • 语言",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • 类别",
      "scr-pulse": "02 • 24小时脉搏",
      "scr-table": "03 • 表",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • 热图",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • 技术",
      "ana-compare": "03 • 比较%",
      "ana-micro": "04 • 微流",
      "ana-engines": "05 • 3D/2D 引擎",
      "res-hero": "01 • 分数与立场",
      "res-rag": "02 • RAG 聊天",
      "res-factors": "03 • 因素",
      "res-pulse24h": "04 • FinBERT脉冲",
      "p1-pills": "01 • 总结",
      "p1-table": "02 • 加权",
      "p1-xray": "03 • X射线",
      "p1-calendar": "04 • 日历",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • 龙卷风&VaR",
      "p2-corr": "03 • 相关性",
      "p2-shock2d": "04 • 休克与马尔可夫",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • 影响",
      "p3-whatif": "02 • What-If & 凯利",
      "p3-tailhedge": "03 • 价外看跌期权和保证金",
      "p3-committee": "04 • 委员会及日志",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "欢迎来到 Home 屏幕：您可以在不受干扰的情况下解码市场。",
      "home-header": "在 Header 的左上角，单击 λ 图标总是会带您回到这个主舞台。",
      "home-markets": "Markets 位于 Header 顶部的中心，它是您实时研究所有 213 个全球资产的工作站。",
      "home-portfolio": "在它旁边的中央菜单中是 Portfolio，用于构建分配、压力测试风险和模拟交易。",
      "home-system": "在左下角的 Footer 中，System 打开服务器和数据库的实时可观察性监视器。",
      "home-guide": "除此之外，Guide 还可以在您需要时打开此交互式分步手册。",
      "home-langs": "右下角的语言按钮可打开居中模式，将平台翻译成 56 种语言。",
      "home-palettes": "而Palette则在严格保留金融绿、红的情况下，开启了5个视觉阅读主题。",
      "scr-categories": "在顶部类别栏中，筛选所有 213 种资产、您的 Watchlist 或 10 个专业市场。",
      "scr-pulse": "4 脉冲 24 小时卡显示聚合交易量、平均 RSI、P-06 状态和顶部交易量错位。",
      "scr-table": "交互式表格具有即时搜索、收藏夹和针对每种资产类别量身定制的智能列。",
      "scr-orbital": "Orbital 视图通过实时侧面检查面板的偏差将资产映射到三个同心环上。",
      "scr-heatmap": "热图将排名前 10 的资产排列成 8 种绿色和红色阴影的比例块。",
      "scr-maintools": "Main Tools 通过三个步骤引导您使用主权曲线、3D 波动性、外汇交叉和期货引擎。",
      "ana-hero": "Header结合了资产切换器、从1m到ALL的9个时间范围以及5个核心指标。",
      "ana-technical": "技术镜头覆盖 SMA 20、VWAP 和 2σ 布林带，并确认底部成交量。",
      "ana-compare": "使用“比较%”，可衡量相对于兼容同行或指数从0%开始的净百分比优势或Alpha Spread。",
      "ana-micro": "Micro & Flow 通过 20d Z 分数、价差流动性错位和 P-06 异常分数来检测交易量峰值。",
      "ana-engines": "第四个选项卡是一个动态临时工具，因资产类别而异：因为 NVDA 是股票，所以它打开 3D 波动性和期权收益，而债券、外汇和大宗商品则推出自己的专用工具。",
      "res-hero": "顶部的“分数和立场”总结了基本结论、加权评级和标题温度计。",
      "res-rag": "在左栏中，RAG 文档聊天回答了基于官方 SEC 10-K 和 10-Q 文件的经过验证的查询。",
      "res-factors": "在中间一栏中，因素手风琴将前 5 个牛市驱动因素与前 5 个熊市风险进行了对比。",
      "res-pulse24h": "右侧，FinBERT Pulse 实时得分突发头条新闻并绘制 24 小时情绪曲线。",
      "p1-pills": "6 个摘要卡重新计算实时 CAGR、Sharpe 和 Sortino、95% VaR、Max Drawdown、Alpha 和多样化。",
      "p1-table": "在权重表中，添加 213 项资产中的任意一项，设置准确的百分比权重，或重新平衡至 100%。",
      "p1-xray": "右上角，5 个选项卡的 X 射线面板审核 ETF 重叠、风险暴露、布林森归因、现金流和托管。",
      "p1-calendar": "在 X-Ray 下方，月历显示 1 月至 12 月的回报一致性和年初至今总计。",
      "p1-backtest": "在全角底部，Backtesting 将您的投资组合与 S&P 500、60/40、All-Weather 和 Min-Variance 进行比较。",
      "p2-markowitz": "第一象限绘制了二维 Markowitz 有效前沿，并将您的投资组合与 Min-Var 和 Max-Sharpe 进行比较。",
      "p2-tornado": "左下象限测试 5 次历史危机、每项资产 95% VaR 贡献以及上行/下行捕获。",
      "p2-corr": "右上方的 6×6 矩阵比较了正常条件下与危机尾部传染的相关性。",
      "p2-shock2d": "右下角，Shock & Markov 将利率变动与 S&P 500 变动交叉，并估计制度转变。",
      "p2-montecarlo": "底部面板投射 10,000 条 Monte Carlo 路径，横跨 P95、P50 和 P05、水下回撤和滚动 Sharpe。",
      "p3-impact": "6 张影响卡将您当前的投资组合与模拟交易后的预测状态进行比较。",
      "p3-whatif": "左上角，What-If 和 Kelly 模拟买入或卖出门票并计算最佳 Half-Kelly 头寸大小。",
      "p3-tailhedge": "左下角，OTM 看跌期权和保证金模拟保护性期权屏蔽并监控 Reg-T 维持保证金。",
      "p3-committee": "在右侧的两个面板中，三支柱委员会与执行日志和副驾驶一起审核风险护栏。",
      "p3-walkforward": "底部的 Walk-Forward 图表通过 WFE 指数验证了 In-Sample 和 Out-of-Sample 的性能。"
    }
  },
  "ZH-TW": {
    "ui": {
      "walkthrough": "即時視覺演練",
      "clickPlayPause": "按一下播放或暫停（空白鍵）",
      "subtitles": "字幕（C）",
      "fullscreen": "全螢幕 (F)",
      "exitFullscreen": "退出全螢幕（F 或 Esc）",
      "portTabs": [
        "建設者",
        "風險",
        "模擬器",
        "副駕駛"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header(λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • 語言",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • 類別",
      "scr-pulse": "02 • 24小時脈搏",
      "scr-table": "03 • 表",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • 熱圖",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • 科技",
      "ana-compare": "03 • 比較%",
      "ana-micro": "04 • 微流",
      "ana-engines": "05 • 3D/2D 引擎",
      "res-hero": "01 • 分數與立場",
      "res-rag": "02 • RAG 聊天",
      "res-factors": "03 • 因素",
      "res-pulse24h": "04 • FinBERT脈衝",
      "p1-pills": "01 • 總結",
      "p1-table": "02 • 加權",
      "p1-xray": "03 • X射線",
      "p1-calendar": "04 • 日曆",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • 龍捲風&VaR",
      "p2-corr": "03 • 相關性",
      "p2-shock2d": "04 • 休克與馬可夫",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • 影響",
      "p3-whatif": "02 • What-If & 凱利",
      "p3-tailhedge": "03 • 價外賣權和保證金",
      "p3-committee": "04 • 委員會及日誌",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "歡迎來到 Home 螢幕：您可以在不受干擾的情況下解碼市場。",
      "home-header": "在 Header 的左上角，點擊 λ 圖示總是會帶您回到這個主舞台。",
      "home-markets": "Markets 位於 Header 頂部的中心，它是您即時研究所有 213 個全球資產的工作站。",
      "home-portfolio": "在它旁邊的中央選單中是 Portfolio，用於建立分配、壓力測試風險和模擬交易。",
      "home-system": "在左下角的 Footer 中，System 開啟伺服器和資料庫的即時可觀察性監視器。",
      "home-guide": "除此之外，Guide 還可以在您需要時開啟此互動式逐步手冊。",
      "home-langs": "右下角的語言按鈕可開啟居中模式，將平台翻譯成 56 種語言。",
      "home-palettes": "而Palette則在嚴格保留金融綠、紅的情況下，開啟了5個視覺閱讀主題。",
      "scr-categories": "在頂部類別欄中，篩選所有 213 種資產、您的 Watchlist 或 10 個專業市場。",
      "scr-pulse": "4 脈衝 24 小時卡顯示聚合交易量、平均 RSI、P-06 狀態和頂部交易量錯位。",
      "scr-table": "互動式表格具有即時搜尋、收藏夾和針對每種資產類別量身定制的智慧列。",
      "scr-orbital": "Orbital 視圖透過即時側面檢查面板的偏差將資產映射到三個同心環。",
      "scr-heatmap": "熱圖將排名前 10 的資產排列成 8 種綠色和紅色陰影的比例塊。",
      "scr-maintools": "Main Tools 透過三個步驟引導您使用主權曲線、3D 波動性、外匯交叉和期貨引擎。",
      "ana-hero": "Header結合了資產切換器、從1m到ALL的9個時間範圍以及5個核心指標。",
      "ana-technical": "技術鏡頭涵蓋 SMA 20、VWAP 和 2σ 布林通道，並確認底部成交量。",
      "ana-compare": "使用“比較%”，可衡量相對於相容同業或指數從0%開始的淨百分比優勢或Alpha Spread。",
      "ana-micro": "Micro & Flow 透過 20d Z 分數、價差流動性錯位和 P-06 異常分數來偵測交易量峰值。",
      "ana-engines": "第四個選項卡是一個動態臨時工具，因資產類別而異：因為 NVDA 是股票，所以它打開 3D 波動性和選擇權收益，而債券、外匯和大宗商品則推出自己的專用工具。",
      "res-hero": "頂部的“分數和立場”總結了基本結論、加權評級和標題溫度計。",
      "res-rag": "在左側欄中，RAG 文件聊天回答了基於官方 SEC 10-K 和 10-Q 文件的經過驗證的查詢。",
      "res-factors": "在中間一欄中，因素手風琴將前 5 個牛市驅動因素與前 5 個熊市風險進行了對比。",
      "res-pulse24h": "右側，FinBERT Pulse 即時得分突發頭條新聞並繪製 24 小時情緒曲線。",
      "p1-pills": "6 張摘要卡重新計算即時 CAGR、Sharpe 和 Sortino、95% VaR、Max Drawdown、Alpha 和多樣化。",
      "p1-table": "在權重表中，新增 213 項資產中的任一項，設定準確的百分比權重，或重新平衡至 100%。",
      "p1-xray": "右上角，5 個選項卡的 X 光面板審核 ETF 重疊、風險暴露、布林森歸因、現金流和託管。",
      "p1-calendar": "在 X-Ray 下方，月曆顯示 1 月至 12 月的回報一致性和年初至今總計。",
      "p1-backtest": "在全角底部，Backtesting 將您的投資組合與 S&P 500、60/40、All-Weather 和 Min-Variance 進行比較。",
      "p2-markowitz": "第一象限繪製了二維 Markowitz 有效前沿，並將您的投資組合與 Min-Var 和 Max-Sharpe 進行比較。",
      "p2-tornado": "左下象限測試 5 次歷史危機、每項資產 95% VaR 貢獻以及上行/下行捕獲。",
      "p2-corr": "右上方的 6×6 矩陣比較了正常條件下與危機尾部傳染的相關性。",
      "p2-shock2d": "右下角，Shock & Markov 將利率變動與 S&P 500 變動交叉，並估計制度轉變。",
      "p2-montecarlo": "底部面板投射 10,000 條 Monte Carlo 路徑，橫跨 P95、P50 和 P05、水下回撤和滾動 Sharpe。",
      "p3-impact": "6 張影響卡將您目前的投資組合與模擬交易後的預測狀態進行比較。",
      "p3-whatif": "左上角，What-If 和 Kelly 模擬買入或賣出門票併計算最佳 Half-Kelly 部位大小。",
      "p3-tailhedge": "左下角，OTM 看跌期權和保證金模擬保護性期權屏蔽並監控 Reg-T 維持保證金。",
      "p3-committee": "在右側的兩個面板中，三支柱委員會與執行日誌和副駕駛一起審查風險護欄。",
      "p3-walkforward": "底部的 Walk-Forward 圖表透過 WFE 指數驗證了 In-Sample 和 Out-of-Sample 的效能。"
    }
  },
  "SW": {
    "ui": {
      "walkthrough": "Matembezi ya Visual ya Moja kwa Moja",
      "clickPlayPause": "Bofya ili kucheza au kusitisha (Nafasi)",
      "subtitles": "Manukuu (C)",
      "fullscreen": "Skrini nzima (F)",
      "exitFullscreen": "Ondoka kwenye Skrini Kamili (F au Esc)",
      "portTabs": [
        "Mjenzi",
        "Hatari",
        "Mwimbaji",
        "Copilot"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Lugha",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategoria",
      "scr-pulse": "02 • 24h Pulse",
      "scr-table": "03 • Jedwali",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Ramani ya joto",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Kiufundi",
      "ana-compare": "03 • Linganisha %",
      "ana-micro": "04 • Micro & Mtiririko",
      "ana-engines": "05 • Injini za 3D/2D",
      "res-hero": "01 • Alama na Msimamo",
      "res-rag": "02 • Gumzo la RAG",
      "res-factors": "03 • Mambo",
      "res-pulse24h": "04 • Mboga wa FinBERT",
      "p1-pills": "01 • Muhtasari",
      "p1-table": "02 • Kupima uzito",
      "p1-xray": "03 • X-Ray",
      "p1-calendar": "04 • Kalenda",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Kimbunga na VaR",
      "p2-corr": "03 • Uwiano",
      "p2-shock2d": "04 • Mshtuko na Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Athari",
      "p3-whatif": "02 • What-If na Kelly",
      "p3-tailhedge": "03 • Weka OTM & Pembezoni",
      "p3-committee": "04 • Kamati na Kumbukumbu",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Karibu kwenye skrini ya Home: mahali pako pa kuanzia bila kukengeushwa ambapo masoko yanachambuliwa.",
      "home-header": "Katika kona ya juu kushoto ya Header, kubofya ikoni ya λ hukurudisha kulia kwenye hatua hii kuu.",
      "home-markets": "Markets iliyo katikati ya Header ni kituo chako cha kazi cha kutafiti mali zote 213 za kimataifa moja kwa moja.",
      "home-portfolio": "Kando yake kwenye menyu inayozingatia ni Portfolio, kujenga mgao, hatari ya mtihani wa mkazo, na kuiga biashara.",
      "home-system": "Chini chini kushoto Footer, System inafungua kifuatiliaji cha uangalizi wa moja kwa moja kwa seva na hifadhidata.",
      "home-guide": "Kando yake, Guide hufungua mwongozo huu shirikishi wa hatua kwa hatua wakati wowote unapouhitaji.",
      "home-langs": "Katika kona ya chini kulia, kitufe cha lugha hufungua modali iliyo katikati ili kutafsiri mfumo katika lugha 56.",
      "home-palettes": "Na Palette inafungua mandhari 5 za usomaji zinazoonekana huku ikiweka fedha kuwa kijani na nyekundu kabisa.",
      "scr-categories": "Katika sehemu ya juu ya Vitengo, chuja kwenye vipengee Vyote 213, Watchlist yako, au masoko 10 maalum.",
      "scr-pulse": "Kadi 4 za Pulse 24h zinaonyesha sauti iliyojumlishwa, wastani wa RSI, utaratibu wa P-06, na mitengano ya sauti ya juu.",
      "scr-table": "Jedwali wasilianifu huangazia utafutaji wa papo hapo, vipendwa na safu wima mahiri zilizoundwa kwa kila aina ya vipengee.",
      "scr-orbital": "Orbital hutazama vipengee vya ramani kwenye pete tatu makini kwa kukengeusha na paneli ya ukaguzi ya moja kwa moja ya upande.",
      "scr-heatmap": "Heatmap hupanga vipengee 10 bora katika vizuizi sawia kwenye vivuli 8 vya kijani na nyekundu.",
      "scr-maintools": "Na Main Tools hukuongoza katika hatua tatu za mikondo huru, tete ya 3D, FX cross, na injini za siku zijazo.",
      "ana-hero": "Header inachanganya kibadilishaji mali, muda 9 kutoka 1m hadi ZOTE, na viashirio 5 vya msingi.",
      "ana-technical": "Lenzi ya Kiufundi huwekelea SMA 20, VWAP, na Bendi 2 za Bollinger na uthibitishaji wa sauti ya chini.",
      "ana-compare": "Kwa Linganisha %, pima faida ya asilimia halisi au Alpha Spread kutoka 0% dhidi ya programu rika au faharasa inayolingana.",
      "ana-micro": "Micro & Flow hutambua ongezeko la sauti kupitia 20d Z-Score, kuenea kwa usambazaji wa ukwasi na alama ya P-06 isiyo ya kawaida.",
      "ana-engines": "Kichupo cha nne ni zana inayobadilika ya matangazo ambayo hutofautiana kulingana na aina ya mali: kwa sababu NVDA ni usawa hufungua Malipo ya Tete ya 3D na Chaguo, huku dhamana, FX, na bidhaa zikizindua zana zao maalum.",
      "res-hero": "Hapo juu, Score & Stance ni muhtasari wa uamuzi msingi, ukadiriaji wa uzani na kipimajoto cha kichwa.",
      "res-rag": "Katika safu ya kushoto, RAG Document Chat hujibu hoja zilizothibitishwa kulingana na faili rasmi za SEC 10-K na 10-Q.",
      "res-factors": "Katika safu ya katikati, accordion ya Factors inatofautisha viendeshaji 5 vya juu dhidi ya hatari 5 za juu.",
      "res-pulse24h": "Upande wa kulia, FinBERT Pulse hufunga vichwa vya habari kwa wakati halisi na kupanga mwendo wa masaa 24.",
      "p1-pills": "Kadi 6 za Muhtasari hulipa CAGR moja kwa moja, Sharpe na Sortino, 95% VaR, Max Drawdown, Alfa, na aina mbalimbali.",
      "p1-table": "Katika jedwali la Vipimo, ongeza mali yoyote kati ya 213, weka asilimia halisi ya uzani, au sawazisha hadi 100%.",
      "p1-xray": "Juu kulia, paneli ya X-Ray ya vichupo 5 hukagua mwingiliano wa ETF, udhihirisho, maelezo ya Brinson, mtiririko wa pesa na ulinzi.",
      "p1-calendar": "Chini ya X-Ray, Kalenda ya Kila Mwezi inaonyesha uthabiti wa kurudi kutoka Januari hadi Desemba na jumla ya YTD.",
      "p1-backtest": "Na chini ya upana kamili, Backtesting inalinganisha kwingineko yako dhidi ya S&P 500, 60/40, All-Weather, na Min-Variance.",
      "p2-markowitz": "Roboduara ya kwanza inapanga Mbele ya Ufanisi wa 2D Markowitz na inaweka kwingineko yako dhidi ya Min-Var na Max-Sharpe.",
      "p2-tornado": "Roboduara ya chini kushoto hujaribu migogoro 5 ya kihistoria, kwa kila kipengee 95% mchango wa VaR, na upigaji wa Juu/Chini.",
      "p2-corr": "Juu-kulia, Matrix ya 6x6 inalinganisha uunganisho katika hali ya kawaida dhidi ya uambukizaji wa mkia wa shida.",
      "p2-shock2d": "Chini kulia, Shock & Markov huvuka mabadiliko ya viwango vya riba kwa S&P 500 hatua na kukadiria mabadiliko ya serikali.",
      "p2-montecarlo": "Na paneli ya chini inatayarisha njia 10,000 za Monte Carlo kwenye P95, P50, na P05, kuteremka chini ya maji, na kukunja Sharpe.",
      "p3-impact": "Kadi 6 za Athari zinalinganisha jalada lako la sasa dhidi ya hali iliyokadiriwa baada ya biashara yako iliyoigizwa.",
      "p3-whatif": "Juu kushoto, What-If & Kelly huiga kununua au kuuza tikiti na kukokotoa saizi bora zaidi ya nafasi ya Half-Kelly.",
      "p3-tailhedge": "Chini-kushoto, OTM Weka & Pembezoni huiga ngao za chaguo za ulinzi na kufuatilia ukingo wa matengenezo wa Reg-T.",
      "p3-committee": "Katika vidirisha viwili vya kulia, Kamati ya nguzo 3 hukagua vizuizi vya hatari pamoja na Rekodi ya Utekelezaji na Mhudumu.",
      "p3-walkforward": "Na chini kabisa, chati ya Walk-Forward inathibitisha utendaji wa In-Sample na Out-of-Sample kwa faharasa ya WFE."
    }
  },
  "AF": {
    "ui": {
      "walkthrough": "Regstreekse visuele deurloop",
      "clickPlayPause": "Klik om te speel of te onderbreek (Spasie)",
      "subtitles": "Onderskrifte (C)",
      "fullscreen": "Volskerm (F)",
      "exitFullscreen": "Verlaat Volskerm (F of Esc)",
      "portTabs": [
        "Bouer",
        "Risiko",
        "Simulator",
        "Medevlieënier"
      ]
    },
    "short": {
      "home-canvas": "01 • Home",
      "home-header": "02 • Header (λ)",
      "home-markets": "03 • Markets",
      "home-portfolio": "04 • Portfolio",
      "home-system": "05 • System",
      "home-guide": "06 • Guide",
      "home-langs": "07 • Tale",
      "home-palettes": "08 • Palette",
      "scr-categories": "01 • Kategorieë",
      "scr-pulse": "02 • 24h Pols",
      "scr-table": "03 • Tafel",
      "scr-orbital": "04 • Orbital",
      "scr-heatmap": "05 • Hittekaart",
      "scr-maintools": "06 • Main Tools",
      "ana-hero": "01 • Header",
      "ana-technical": "02 • Tegnies",
      "ana-compare": "03 • Vergelyk %",
      "ana-micro": "04 • Mikro en vloei",
      "ana-engines": "05 • 3D/2D-enjins",
      "res-hero": "01 • Telling en houding",
      "res-rag": "02 • RAG Chat",
      "res-factors": "03 • Faktore",
      "res-pulse24h": "04 • FinBERT Pols",
      "p1-pills": "01 • Opsomming",
      "p1-table": "02 • Gewig",
      "p1-xray": "03 • X-straal",
      "p1-calendar": "04 • Kalender",
      "p1-backtest": "05 • Backtesting",
      "p2-markowitz": "01 • Markowitz 2D",
      "p2-tornado": "02 • Tornado en VaR",
      "p2-corr": "03 • Korrelasie",
      "p2-shock2d": "04 • Skok & Markov",
      "p2-montecarlo": "05 • Monte Carlo",
      "p3-impact": "01 • Impak",
      "p3-whatif": "02 • What-If & Kelly",
      "p3-tailhedge": "03 • OTM Put & Marge",
      "p3-committee": "04 • Komitee & Logboek",
      "p3-walkforward": "05 • Walk-Forward"
    },
    "captions": {
      "home-canvas": "Welkom by die Home-skerm: jou afleidingsvrye beginpunt waar markte gedekodeer word.",
      "home-header": "In die boonste linkerhoek van die Header, deur op die λ-ikoon te klik, bring jy altyd terug na hierdie hoofverhoog.",
      "home-markets": "Gesentreer aan die bokant van die Header is Markets, jou werkstasie om al 213 globale bates regstreeks na te vors.",
      "home-portfolio": "Reg langs dit in die gesentreerde spyskaart is Portfolio, om toekennings te bou, strestoetsrisiko en ambagte te simuleer.",
      "home-system": "Links onder in Footer maak System die regstreekse waarneembaarheidmonitor vir bedieners en databasisse oop.",
      "home-guide": "Daarby maak Guide hierdie interaktiewe stap-vir-stap handleiding oop wanneer jy dit ook al nodig het.",
      "home-langs": "In die onderste regterhoek maak die taalknoppie die gesentreerde modaal oop om die platform in 56 tale te vertaal.",
      "home-palettes": "En Palette maak die 5 visuele leestemas oop terwyl finansiële groen en rooi streng ongeskonde bly.",
      "scr-categories": "Filter in die boonste kategorieëbalk oor Al 213 bates, jou Watchlist of 10 gespesialiseerde markte.",
      "scr-pulse": "Die 4 Pulse 24h-kaarte wys saamgestelde volume, gemiddelde RSI, P-06-regime en topvolume-ontwrigtings.",
      "scr-table": "Die interaktiewe tabel bevat direkte soektog, gunstelinge en slimkolomme wat vir elke bateklas aangepas is.",
      "scr-orbital": "Die Orbital-aansig karteer bates oor drie konsentriese ringe deur afwyking met 'n lewendige sy-inspeksiepaneel.",
      "scr-heatmap": "Die Heatmap rangskik die top 10 bates in proporsionele blokke oor 8 skakerings van groen en rooi.",
      "scr-maintools": "En Main Tools lei jou in drie stappe na soewereine kurwes, 3D-wisselvalligheid, FX-kruis en termynenjins.",
      "ana-hero": "Die Header kombineer die batewisselaar, 9 tydraamwerke van 1m tot ALLE, en die 5 kernaanwysers.",
      "ana-technical": "Die Tegniese lens bedek SMA 20, VWAP en 2σ Bollinger Bands met onderste volume bevestiging.",
      "ana-compare": "Met Vergelyk %, meet netto persentasie voordeel of Alpha Spread vanaf 0% teenoor 'n versoenbare eweknie of indeks.",
      "ana-micro": "Micro & Flow bespeur volumestygings via 20d Z-telling, verspreide likiditeitsontwrigting en die P-06-anomalietelling.",
      "ana-engines": "Die vierde oortjie is 'n dinamiese ad-hoc-instrument wat volgens bateklas verskil: omdat NVDA 'n aandeel is, maak dit 3D Volatiliteit & Opsies-uitbetaling oop, terwyl effekte, FX en kommoditeite hul eie gespesialiseerde gereedskap bekendstel.",
      "res-hero": "Aan die bokant, som Score & Stance die fundamentele uitspraak, geweegde gradering en koptermometer op.",
      "res-rag": "In die linkerkolom beantwoord RAG Document Chat geverifieerde navrae wat in amptelike SEC 10-K- en 10-Q-filings gegrond is.",
      "res-factors": "In die middelkolom kontrasteer die Factors-trekklavier die top 5 bulbestuurders teen die top 5 beerrisiko's.",
      "res-pulse24h": "Aan die regterkant, FinBERT Pulse tellings brekende nuus in reële tyd en plot die 24-uur sentiment kurwe.",
      "p1-pills": "Die 6 Opsommingskaarte herbereken lewendige CAGR, Sharpe en Sortino, 95% VaR, Max Drawdown, Alpha, en diversifikasie.",
      "p1-table": "Voeg enige van die 213 bates in die Gewigstabel by, stel presiese persentasiegewigte in of herbalanseer na 100%.",
      "p1-xray": "Regs bo, die 5-oortjie X-Ray-paneel oudit ETF-oorvleueling, blootstelling, Brinson-toeskrywing, kontantvloei en bewaring.",
      "p1-calendar": "Onder X-straal, die Maandelikse kalender vertoon Januarie-tot-Desember terugkeer konsekwentheid en YTD totale.",
      "p1-backtest": "En aan die onderkant van die volle breedte vergelyk Backtesting jou portefeulje met die S&P 500, 60/40, All-Weather en Min-Variance.",
      "p2-markowitz": "Die eerste kwadrant plot die 2D Markowitz Efficient Frontier en posisioneer jou portefeulje teenoor Min-Var en Max-Sharpe.",
      "p2-tornado": "Die linker-onderste kwadrant toets 5 historiese krisisse, 95% VaR-bydrae per bate, en onderstebo/onderkant-vaslegging.",
      "p2-corr": "Regs bo vergelyk die 6×6-matriks korrelasies in normale toestande teen krisisstertbesmetting.",
      "p2-shock2d": "Regs onder kruis Shock & Markov rentekoersverskuiwings met S&P 500-skuiwe en skat regime-oorgange.",
      "p2-montecarlo": "En die onderste paneel projekteer 10 000 Monte Carlo-paaie oor P95, P50 en P05, onderwater-onttrekking en rollende Sharpe.",
      "p3-impact": "Die 6 impakkaarte vergelyk jou huidige portefeulje met die geprojekteerde toestand ná jou gesimuleerde ambagte.",
      "p3-whatif": "Links bo, What-If & Kelly simuleer koop of verkoop kaartjies en bereken die optimale Half-Kelly posisie grootte.",
      "p3-tailhedge": "Links onder simuleer OTM Put & Margin beskermende opsieskerms en monitor Reg-T onderhoudsmarge.",
      "p3-committee": "In die twee regterpanele oudit die 3-pilaarkomitee risiko-relings langs die uitvoeringslogboek en medevlieënier.",
      "p3-walkforward": "En onderaan bevestig die Walk-Forward-grafiek In-Sample- en Out-of-Sample-prestasie met die WFE-indeks."
    }
  }
};

export const GUIDE_VIDEO_TIMINGS_BY_LANG = {
  "EN": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.7
      },
      {
        "id": "home-header",
        "startPct": 10.7,
        "endPct": 23.8
      },
      {
        "id": "home-markets",
        "startPct": 23.8,
        "endPct": 37.1
      },
      {
        "id": "home-portfolio",
        "startPct": 37.1,
        "endPct": 51.2
      },
      {
        "id": "home-system",
        "startPct": 51.2,
        "endPct": 62.6
      },
      {
        "id": "home-guide",
        "startPct": 62.6,
        "endPct": 71.7
      },
      {
        "id": "home-langs",
        "startPct": 71.7,
        "endPct": 85.4
      },
      {
        "id": "home-palettes",
        "startPct": 85.4,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 19.6
      },
      {
        "id": "scr-pulse",
        "startPct": 19.6,
        "endPct": 38.4
      },
      {
        "id": "scr-table",
        "startPct": 38.4,
        "endPct": 55.5
      },
      {
        "id": "scr-orbital",
        "startPct": 55.5,
        "endPct": 71.1
      },
      {
        "id": "scr-heatmap",
        "startPct": 71.1,
        "endPct": 84.0
      },
      {
        "id": "scr-maintools",
        "startPct": 84.0,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 18.1
      },
      {
        "id": "ana-technical",
        "startPct": 18.1,
        "endPct": 35.5
      },
      {
        "id": "ana-compare",
        "startPct": 35.5,
        "endPct": 52.5
      },
      {
        "id": "ana-micro",
        "startPct": 52.5,
        "endPct": 69.4
      },
      {
        "id": "ana-engines",
        "startPct": 69.4,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 29.8
      },
      {
        "id": "res-rag",
        "startPct": 29.8,
        "endPct": 57.2
      },
      {
        "id": "res-factors",
        "startPct": 57.2,
        "endPct": 78.5
      },
      {
        "id": "res-pulse24h",
        "startPct": 78.5,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 24.7
      },
      {
        "id": "p1-table",
        "startPct": 24.7,
        "endPct": 44.9
      },
      {
        "id": "p1-xray",
        "startPct": 44.9,
        "endPct": 64.2
      },
      {
        "id": "p1-calendar",
        "startPct": 64.2,
        "endPct": 78.1
      },
      {
        "id": "p1-backtest",
        "startPct": 78.1,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 23.1
      },
      {
        "id": "p2-tornado",
        "startPct": 23.1,
        "endPct": 45.8
      },
      {
        "id": "p2-corr",
        "startPct": 45.8,
        "endPct": 61.2
      },
      {
        "id": "p2-shock2d",
        "startPct": 61.2,
        "endPct": 80.2
      },
      {
        "id": "p2-montecarlo",
        "startPct": 80.2,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 21.1
      },
      {
        "id": "p3-whatif",
        "startPct": 21.1,
        "endPct": 40.5
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.5,
        "endPct": 60.2
      },
      {
        "id": "p3-committee",
        "startPct": 60.2,
        "endPct": 79.6
      },
      {
        "id": "p3-walkforward",
        "startPct": 79.6,
        "endPct": 100.1
      }
    ]
  },
  "ES": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.5
      },
      {
        "id": "home-header",
        "startPct": 11.5,
        "endPct": 26.3
      },
      {
        "id": "home-markets",
        "startPct": 26.3,
        "endPct": 40.5
      },
      {
        "id": "home-portfolio",
        "startPct": 40.5,
        "endPct": 53.9
      },
      {
        "id": "home-system",
        "startPct": 53.9,
        "endPct": 65.1
      },
      {
        "id": "home-guide",
        "startPct": 65.1,
        "endPct": 73.7
      },
      {
        "id": "home-langs",
        "startPct": 73.7,
        "endPct": 86.5
      },
      {
        "id": "home-palettes",
        "startPct": 86.5,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 19.2
      },
      {
        "id": "scr-pulse",
        "startPct": 19.2,
        "endPct": 37.9
      },
      {
        "id": "scr-table",
        "startPct": 37.9,
        "endPct": 54.7
      },
      {
        "id": "scr-orbital",
        "startPct": 54.7,
        "endPct": 71.2
      },
      {
        "id": "scr-heatmap",
        "startPct": 71.2,
        "endPct": 84.8
      },
      {
        "id": "scr-maintools",
        "startPct": 84.8,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 19.6
      },
      {
        "id": "ana-technical",
        "startPct": 19.6,
        "endPct": 37.6
      },
      {
        "id": "ana-compare",
        "startPct": 37.6,
        "endPct": 53.1
      },
      {
        "id": "ana-micro",
        "startPct": 53.1,
        "endPct": 70.3
      },
      {
        "id": "ana-engines",
        "startPct": 70.3,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 30.4
      },
      {
        "id": "res-rag",
        "startPct": 30.4,
        "endPct": 54.7
      },
      {
        "id": "res-factors",
        "startPct": 54.7,
        "endPct": 77.7
      },
      {
        "id": "res-pulse24h",
        "startPct": 77.7,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 24.9
      },
      {
        "id": "p1-table",
        "startPct": 24.9,
        "endPct": 43.0
      },
      {
        "id": "p1-xray",
        "startPct": 43.0,
        "endPct": 64.9
      },
      {
        "id": "p1-calendar",
        "startPct": 64.9,
        "endPct": 79.9
      },
      {
        "id": "p1-backtest",
        "startPct": 79.9,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 24.9
      },
      {
        "id": "p2-tornado",
        "startPct": 24.9,
        "endPct": 46.6
      },
      {
        "id": "p2-corr",
        "startPct": 46.6,
        "endPct": 63.3
      },
      {
        "id": "p2-shock2d",
        "startPct": 63.3,
        "endPct": 81.1
      },
      {
        "id": "p2-montecarlo",
        "startPct": 81.1,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 22.7
      },
      {
        "id": "p3-whatif",
        "startPct": 22.7,
        "endPct": 42.3
      },
      {
        "id": "p3-tailhedge",
        "startPct": 42.3,
        "endPct": 61.0
      },
      {
        "id": "p3-committee",
        "startPct": 61.0,
        "endPct": 80.1
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.1,
        "endPct": 100.1
      }
    ]
  },
  "PT": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 12.0
      },
      {
        "id": "home-header",
        "startPct": 12.0,
        "endPct": 24.7
      },
      {
        "id": "home-markets",
        "startPct": 24.7,
        "endPct": 38.4
      },
      {
        "id": "home-portfolio",
        "startPct": 38.4,
        "endPct": 51.9
      },
      {
        "id": "home-system",
        "startPct": 51.9,
        "endPct": 64.6
      },
      {
        "id": "home-guide",
        "startPct": 64.6,
        "endPct": 74.3
      },
      {
        "id": "home-langs",
        "startPct": 74.3,
        "endPct": 88.4
      },
      {
        "id": "home-palettes",
        "startPct": 88.4,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 20.0
      },
      {
        "id": "scr-pulse",
        "startPct": 20.0,
        "endPct": 38.7
      },
      {
        "id": "scr-table",
        "startPct": 38.7,
        "endPct": 54.2
      },
      {
        "id": "scr-orbital",
        "startPct": 54.2,
        "endPct": 69.1
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.1,
        "endPct": 82.5
      },
      {
        "id": "scr-maintools",
        "startPct": 82.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 17.2
      },
      {
        "id": "ana-technical",
        "startPct": 17.2,
        "endPct": 34.5
      },
      {
        "id": "ana-compare",
        "startPct": 34.5,
        "endPct": 52.5
      },
      {
        "id": "ana-micro",
        "startPct": 52.5,
        "endPct": 70.1
      },
      {
        "id": "ana-engines",
        "startPct": 70.1,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 25.8
      },
      {
        "id": "res-rag",
        "startPct": 25.8,
        "endPct": 51.3
      },
      {
        "id": "res-factors",
        "startPct": 51.3,
        "endPct": 74.8
      },
      {
        "id": "res-pulse24h",
        "startPct": 74.8,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.3
      },
      {
        "id": "p1-table",
        "startPct": 22.3,
        "endPct": 41.4
      },
      {
        "id": "p1-xray",
        "startPct": 41.4,
        "endPct": 63.2
      },
      {
        "id": "p1-calendar",
        "startPct": 63.2,
        "endPct": 79.2
      },
      {
        "id": "p1-backtest",
        "startPct": 79.2,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.0
      },
      {
        "id": "p2-tornado",
        "startPct": 18.0,
        "endPct": 38.7
      },
      {
        "id": "p2-corr",
        "startPct": 38.7,
        "endPct": 57.8
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.8,
        "endPct": 74.6
      },
      {
        "id": "p2-montecarlo",
        "startPct": 74.6,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 19.3
      },
      {
        "id": "p3-whatif",
        "startPct": 19.3,
        "endPct": 37.8
      },
      {
        "id": "p3-tailhedge",
        "startPct": 37.8,
        "endPct": 57.2
      },
      {
        "id": "p3-committee",
        "startPct": 57.2,
        "endPct": 78.0
      },
      {
        "id": "p3-walkforward",
        "startPct": 78.0,
        "endPct": 100.1
      }
    ]
  },
  "FR": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.0
      },
      {
        "id": "home-header",
        "startPct": 11.0,
        "endPct": 23.4
      },
      {
        "id": "home-markets",
        "startPct": 23.4,
        "endPct": 37.8
      },
      {
        "id": "home-portfolio",
        "startPct": 37.8,
        "endPct": 53.2
      },
      {
        "id": "home-system",
        "startPct": 53.2,
        "endPct": 65.2
      },
      {
        "id": "home-guide",
        "startPct": 65.2,
        "endPct": 74.2
      },
      {
        "id": "home-langs",
        "startPct": 74.2,
        "endPct": 87.9
      },
      {
        "id": "home-palettes",
        "startPct": 87.9,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.4
      },
      {
        "id": "scr-pulse",
        "startPct": 17.4,
        "endPct": 36.3
      },
      {
        "id": "scr-table",
        "startPct": 36.3,
        "endPct": 52.4
      },
      {
        "id": "scr-orbital",
        "startPct": 52.4,
        "endPct": 67.3
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.3,
        "endPct": 82.0
      },
      {
        "id": "scr-maintools",
        "startPct": 82.0,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 16.5
      },
      {
        "id": "ana-technical",
        "startPct": 16.5,
        "endPct": 32.9
      },
      {
        "id": "ana-compare",
        "startPct": 32.9,
        "endPct": 51.0
      },
      {
        "id": "ana-micro",
        "startPct": 51.0,
        "endPct": 68.1
      },
      {
        "id": "ana-engines",
        "startPct": 68.1,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 26.2
      },
      {
        "id": "res-rag",
        "startPct": 26.2,
        "endPct": 52.4
      },
      {
        "id": "res-factors",
        "startPct": 52.4,
        "endPct": 74.7
      },
      {
        "id": "res-pulse24h",
        "startPct": 74.7,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 23.2
      },
      {
        "id": "p1-table",
        "startPct": 23.2,
        "endPct": 41.7
      },
      {
        "id": "p1-xray",
        "startPct": 41.7,
        "endPct": 62.2
      },
      {
        "id": "p1-calendar",
        "startPct": 62.2,
        "endPct": 78.1
      },
      {
        "id": "p1-backtest",
        "startPct": 78.1,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.1
      },
      {
        "id": "p2-tornado",
        "startPct": 18.1,
        "endPct": 38.5
      },
      {
        "id": "p2-corr",
        "startPct": 38.5,
        "endPct": 55.4
      },
      {
        "id": "p2-shock2d",
        "startPct": 55.4,
        "endPct": 73.3
      },
      {
        "id": "p2-montecarlo",
        "startPct": 73.3,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.9
      },
      {
        "id": "p3-whatif",
        "startPct": 18.9,
        "endPct": 36.9
      },
      {
        "id": "p3-tailhedge",
        "startPct": 36.9,
        "endPct": 56.0
      },
      {
        "id": "p3-committee",
        "startPct": 56.0,
        "endPct": 77.5
      },
      {
        "id": "p3-walkforward",
        "startPct": 77.5,
        "endPct": 100.1
      }
    ]
  },
  "DE": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 13.5
      },
      {
        "id": "home-header",
        "startPct": 13.5,
        "endPct": 23.9
      },
      {
        "id": "home-markets",
        "startPct": 23.9,
        "endPct": 38.7
      },
      {
        "id": "home-portfolio",
        "startPct": 38.7,
        "endPct": 53.7
      },
      {
        "id": "home-system",
        "startPct": 53.7,
        "endPct": 63.9
      },
      {
        "id": "home-guide",
        "startPct": 63.9,
        "endPct": 73.4
      },
      {
        "id": "home-langs",
        "startPct": 73.4,
        "endPct": 86.8
      },
      {
        "id": "home-palettes",
        "startPct": 86.8,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.9
      },
      {
        "id": "scr-pulse",
        "startPct": 17.9,
        "endPct": 38.2
      },
      {
        "id": "scr-table",
        "startPct": 38.2,
        "endPct": 53.3
      },
      {
        "id": "scr-orbital",
        "startPct": 53.3,
        "endPct": 68.4
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.4,
        "endPct": 82.3
      },
      {
        "id": "scr-maintools",
        "startPct": 82.3,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 16.1
      },
      {
        "id": "ana-technical",
        "startPct": 16.1,
        "endPct": 33.1
      },
      {
        "id": "ana-compare",
        "startPct": 33.1,
        "endPct": 50.0
      },
      {
        "id": "ana-micro",
        "startPct": 50.0,
        "endPct": 67.2
      },
      {
        "id": "ana-engines",
        "startPct": 67.2,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 25.7
      },
      {
        "id": "res-rag",
        "startPct": 25.7,
        "endPct": 52.4
      },
      {
        "id": "res-factors",
        "startPct": 52.4,
        "endPct": 75.8
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.8,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 23.3
      },
      {
        "id": "p1-table",
        "startPct": 23.3,
        "endPct": 44.0
      },
      {
        "id": "p1-xray",
        "startPct": 44.0,
        "endPct": 63.3
      },
      {
        "id": "p1-calendar",
        "startPct": 63.3,
        "endPct": 77.8
      },
      {
        "id": "p1-backtest",
        "startPct": 77.8,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.7
      },
      {
        "id": "p2-tornado",
        "startPct": 18.7,
        "endPct": 40.5
      },
      {
        "id": "p2-corr",
        "startPct": 40.5,
        "endPct": 58.8
      },
      {
        "id": "p2-shock2d",
        "startPct": 58.8,
        "endPct": 74.8
      },
      {
        "id": "p2-montecarlo",
        "startPct": 74.8,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 20.5
      },
      {
        "id": "p3-whatif",
        "startPct": 20.5,
        "endPct": 42.1
      },
      {
        "id": "p3-tailhedge",
        "startPct": 42.1,
        "endPct": 59.7
      },
      {
        "id": "p3-committee",
        "startPct": 59.7,
        "endPct": 79.4
      },
      {
        "id": "p3-walkforward",
        "startPct": 79.4,
        "endPct": 100.1
      }
    ]
  },
  "IT": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 13.5
      },
      {
        "id": "home-header",
        "startPct": 13.5,
        "endPct": 26.2
      },
      {
        "id": "home-markets",
        "startPct": 26.2,
        "endPct": 40.1
      },
      {
        "id": "home-portfolio",
        "startPct": 40.1,
        "endPct": 53.5
      },
      {
        "id": "home-system",
        "startPct": 53.5,
        "endPct": 65.0
      },
      {
        "id": "home-guide",
        "startPct": 65.0,
        "endPct": 75.0
      },
      {
        "id": "home-langs",
        "startPct": 75.0,
        "endPct": 89.4
      },
      {
        "id": "home-palettes",
        "startPct": 89.4,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.5
      },
      {
        "id": "scr-pulse",
        "startPct": 17.5,
        "endPct": 36.9
      },
      {
        "id": "scr-table",
        "startPct": 36.9,
        "endPct": 53.3
      },
      {
        "id": "scr-orbital",
        "startPct": 53.3,
        "endPct": 68.9
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.9,
        "endPct": 83.6
      },
      {
        "id": "scr-maintools",
        "startPct": 83.6,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 17.4
      },
      {
        "id": "ana-technical",
        "startPct": 17.4,
        "endPct": 34.0
      },
      {
        "id": "ana-compare",
        "startPct": 34.0,
        "endPct": 52.1
      },
      {
        "id": "ana-micro",
        "startPct": 52.1,
        "endPct": 70.3
      },
      {
        "id": "ana-engines",
        "startPct": 70.3,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 24.5
      },
      {
        "id": "res-rag",
        "startPct": 24.5,
        "endPct": 50.6
      },
      {
        "id": "res-factors",
        "startPct": 50.6,
        "endPct": 74.7
      },
      {
        "id": "res-pulse24h",
        "startPct": 74.7,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.5
      },
      {
        "id": "p1-table",
        "startPct": 22.5,
        "endPct": 40.9
      },
      {
        "id": "p1-xray",
        "startPct": 40.9,
        "endPct": 62.8
      },
      {
        "id": "p1-calendar",
        "startPct": 62.8,
        "endPct": 77.6
      },
      {
        "id": "p1-backtest",
        "startPct": 77.6,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.2
      },
      {
        "id": "p2-tornado",
        "startPct": 18.2,
        "endPct": 38.5
      },
      {
        "id": "p2-corr",
        "startPct": 38.5,
        "endPct": 56.3
      },
      {
        "id": "p2-shock2d",
        "startPct": 56.3,
        "endPct": 74.3
      },
      {
        "id": "p2-montecarlo",
        "startPct": 74.3,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 17.7
      },
      {
        "id": "p3-whatif",
        "startPct": 17.7,
        "endPct": 37.5
      },
      {
        "id": "p3-tailhedge",
        "startPct": 37.5,
        "endPct": 57.0
      },
      {
        "id": "p3-committee",
        "startPct": 57.0,
        "endPct": 78.1
      },
      {
        "id": "p3-walkforward",
        "startPct": 78.1,
        "endPct": 100.1
      }
    ]
  },
  "NL": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.5
      },
      {
        "id": "home-header",
        "startPct": 10.5,
        "endPct": 23.2
      },
      {
        "id": "home-markets",
        "startPct": 23.2,
        "endPct": 39.5
      },
      {
        "id": "home-portfolio",
        "startPct": 39.5,
        "endPct": 55.1
      },
      {
        "id": "home-system",
        "startPct": 55.1,
        "endPct": 65.9
      },
      {
        "id": "home-guide",
        "startPct": 65.9,
        "endPct": 76.0
      },
      {
        "id": "home-langs",
        "startPct": 76.0,
        "endPct": 88.9
      },
      {
        "id": "home-palettes",
        "startPct": 88.9,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.1
      },
      {
        "id": "scr-pulse",
        "startPct": 16.1,
        "endPct": 37.0
      },
      {
        "id": "scr-table",
        "startPct": 37.0,
        "endPct": 51.9
      },
      {
        "id": "scr-orbital",
        "startPct": 51.9,
        "endPct": 69.8
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.8,
        "endPct": 82.1
      },
      {
        "id": "scr-maintools",
        "startPct": 82.1,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.5
      },
      {
        "id": "ana-technical",
        "startPct": 15.5,
        "endPct": 31.0
      },
      {
        "id": "ana-compare",
        "startPct": 31.0,
        "endPct": 48.3
      },
      {
        "id": "ana-micro",
        "startPct": 48.3,
        "endPct": 65.4
      },
      {
        "id": "ana-engines",
        "startPct": 65.4,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.4
      },
      {
        "id": "res-rag",
        "startPct": 23.4,
        "endPct": 50.0
      },
      {
        "id": "res-factors",
        "startPct": 50.0,
        "endPct": 73.0
      },
      {
        "id": "res-pulse24h",
        "startPct": 73.0,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.7
      },
      {
        "id": "p1-table",
        "startPct": 20.7,
        "endPct": 41.0
      },
      {
        "id": "p1-xray",
        "startPct": 41.0,
        "endPct": 62.0
      },
      {
        "id": "p1-calendar",
        "startPct": 62.0,
        "endPct": 78.5
      },
      {
        "id": "p1-backtest",
        "startPct": 78.5,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 20.5
      },
      {
        "id": "p2-tornado",
        "startPct": 20.5,
        "endPct": 42.9
      },
      {
        "id": "p2-corr",
        "startPct": 42.9,
        "endPct": 60.2
      },
      {
        "id": "p2-shock2d",
        "startPct": 60.2,
        "endPct": 76.9
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.9,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 19.0
      },
      {
        "id": "p3-whatif",
        "startPct": 19.0,
        "endPct": 42.4
      },
      {
        "id": "p3-tailhedge",
        "startPct": 42.4,
        "endPct": 60.1
      },
      {
        "id": "p3-committee",
        "startPct": 60.1,
        "endPct": 80.4
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.4,
        "endPct": 100.1
      }
    ]
  },
  "PL": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.3
      },
      {
        "id": "home-header",
        "startPct": 11.3,
        "endPct": 20.7
      },
      {
        "id": "home-markets",
        "startPct": 20.7,
        "endPct": 33.3
      },
      {
        "id": "home-portfolio",
        "startPct": 33.3,
        "endPct": 51.3
      },
      {
        "id": "home-system",
        "startPct": 51.3,
        "endPct": 62.8
      },
      {
        "id": "home-guide",
        "startPct": 62.8,
        "endPct": 73.1
      },
      {
        "id": "home-langs",
        "startPct": 73.1,
        "endPct": 87.0
      },
      {
        "id": "home-palettes",
        "startPct": 87.0,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.4
      },
      {
        "id": "scr-pulse",
        "startPct": 16.4,
        "endPct": 35.3
      },
      {
        "id": "scr-table",
        "startPct": 35.3,
        "endPct": 51.9
      },
      {
        "id": "scr-orbital",
        "startPct": 51.9,
        "endPct": 68.8
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.8,
        "endPct": 83.5
      },
      {
        "id": "scr-maintools",
        "startPct": 83.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.8
      },
      {
        "id": "ana-technical",
        "startPct": 14.8,
        "endPct": 29.9
      },
      {
        "id": "ana-compare",
        "startPct": 29.9,
        "endPct": 46.9
      },
      {
        "id": "ana-micro",
        "startPct": 46.9,
        "endPct": 63.8
      },
      {
        "id": "ana-engines",
        "startPct": 63.8,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 20.8
      },
      {
        "id": "res-rag",
        "startPct": 20.8,
        "endPct": 49.5
      },
      {
        "id": "res-factors",
        "startPct": 49.5,
        "endPct": 74.0
      },
      {
        "id": "res-pulse24h",
        "startPct": 74.0,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.9
      },
      {
        "id": "p1-table",
        "startPct": 20.9,
        "endPct": 37.6
      },
      {
        "id": "p1-xray",
        "startPct": 37.6,
        "endPct": 63.7
      },
      {
        "id": "p1-calendar",
        "startPct": 63.7,
        "endPct": 79.7
      },
      {
        "id": "p1-backtest",
        "startPct": 79.7,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.0
      },
      {
        "id": "p2-tornado",
        "startPct": 19.0,
        "endPct": 41.0
      },
      {
        "id": "p2-corr",
        "startPct": 41.0,
        "endPct": 58.0
      },
      {
        "id": "p2-shock2d",
        "startPct": 58.0,
        "endPct": 76.1
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.1,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 16.4
      },
      {
        "id": "p3-whatif",
        "startPct": 16.4,
        "endPct": 36.3
      },
      {
        "id": "p3-tailhedge",
        "startPct": 36.3,
        "endPct": 55.0
      },
      {
        "id": "p3-committee",
        "startPct": 55.0,
        "endPct": 78.7
      },
      {
        "id": "p3-walkforward",
        "startPct": 78.7,
        "endPct": 100.1
      }
    ]
  },
  "SV": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.6
      },
      {
        "id": "home-header",
        "startPct": 11.6,
        "endPct": 24.3
      },
      {
        "id": "home-markets",
        "startPct": 24.3,
        "endPct": 38.8
      },
      {
        "id": "home-portfolio",
        "startPct": 38.8,
        "endPct": 53.9
      },
      {
        "id": "home-system",
        "startPct": 53.9,
        "endPct": 65.9
      },
      {
        "id": "home-guide",
        "startPct": 65.9,
        "endPct": 75.0
      },
      {
        "id": "home-langs",
        "startPct": 75.0,
        "endPct": 88.2
      },
      {
        "id": "home-palettes",
        "startPct": 88.2,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.4
      },
      {
        "id": "scr-pulse",
        "startPct": 17.4,
        "endPct": 37.4
      },
      {
        "id": "scr-table",
        "startPct": 37.4,
        "endPct": 53.9
      },
      {
        "id": "scr-orbital",
        "startPct": 53.9,
        "endPct": 68.9
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.9,
        "endPct": 82.9
      },
      {
        "id": "scr-maintools",
        "startPct": 82.9,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.7
      },
      {
        "id": "ana-technical",
        "startPct": 15.7,
        "endPct": 29.8
      },
      {
        "id": "ana-compare",
        "startPct": 29.8,
        "endPct": 46.7
      },
      {
        "id": "ana-micro",
        "startPct": 46.7,
        "endPct": 67.5
      },
      {
        "id": "ana-engines",
        "startPct": 67.5,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 22.9
      },
      {
        "id": "res-rag",
        "startPct": 22.9,
        "endPct": 53.3
      },
      {
        "id": "res-factors",
        "startPct": 53.3,
        "endPct": 76.1
      },
      {
        "id": "res-pulse24h",
        "startPct": 76.1,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.8
      },
      {
        "id": "p1-table",
        "startPct": 22.8,
        "endPct": 42.4
      },
      {
        "id": "p1-xray",
        "startPct": 42.4,
        "endPct": 64.4
      },
      {
        "id": "p1-calendar",
        "startPct": 64.4,
        "endPct": 79.7
      },
      {
        "id": "p1-backtest",
        "startPct": 79.7,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.5
      },
      {
        "id": "p2-tornado",
        "startPct": 18.5,
        "endPct": 39.9
      },
      {
        "id": "p2-corr",
        "startPct": 39.9,
        "endPct": 56.1
      },
      {
        "id": "p2-shock2d",
        "startPct": 56.1,
        "endPct": 74.9
      },
      {
        "id": "p2-montecarlo",
        "startPct": 74.9,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.7
      },
      {
        "id": "p3-whatif",
        "startPct": 18.7,
        "endPct": 39.2
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.2,
        "endPct": 59.3
      },
      {
        "id": "p3-committee",
        "startPct": 59.3,
        "endPct": 78.2
      },
      {
        "id": "p3-walkforward",
        "startPct": 78.2,
        "endPct": 100.1
      }
    ]
  },
  "NO": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.6
      },
      {
        "id": "home-header",
        "startPct": 11.6,
        "endPct": 23.0
      },
      {
        "id": "home-markets",
        "startPct": 23.0,
        "endPct": 38.3
      },
      {
        "id": "home-portfolio",
        "startPct": 38.3,
        "endPct": 53.8
      },
      {
        "id": "home-system",
        "startPct": 53.8,
        "endPct": 64.7
      },
      {
        "id": "home-guide",
        "startPct": 64.7,
        "endPct": 74.7
      },
      {
        "id": "home-langs",
        "startPct": 74.7,
        "endPct": 87.8
      },
      {
        "id": "home-palettes",
        "startPct": 87.8,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.5
      },
      {
        "id": "scr-pulse",
        "startPct": 16.5,
        "endPct": 36.5
      },
      {
        "id": "scr-table",
        "startPct": 36.5,
        "endPct": 52.6
      },
      {
        "id": "scr-orbital",
        "startPct": 52.6,
        "endPct": 68.6
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.6,
        "endPct": 83.1
      },
      {
        "id": "scr-maintools",
        "startPct": 83.1,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.6
      },
      {
        "id": "ana-technical",
        "startPct": 14.6,
        "endPct": 29.0
      },
      {
        "id": "ana-compare",
        "startPct": 29.0,
        "endPct": 45.4
      },
      {
        "id": "ana-micro",
        "startPct": 45.4,
        "endPct": 66.2
      },
      {
        "id": "ana-engines",
        "startPct": 66.2,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.0
      },
      {
        "id": "res-rag",
        "startPct": 23.0,
        "endPct": 53.4
      },
      {
        "id": "res-factors",
        "startPct": 53.4,
        "endPct": 77.1
      },
      {
        "id": "res-pulse24h",
        "startPct": 77.1,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.3
      },
      {
        "id": "p1-table",
        "startPct": 21.3,
        "endPct": 41.8
      },
      {
        "id": "p1-xray",
        "startPct": 41.8,
        "endPct": 63.3
      },
      {
        "id": "p1-calendar",
        "startPct": 63.3,
        "endPct": 78.4
      },
      {
        "id": "p1-backtest",
        "startPct": 78.4,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.2
      },
      {
        "id": "p2-tornado",
        "startPct": 18.2,
        "endPct": 39.6
      },
      {
        "id": "p2-corr",
        "startPct": 39.6,
        "endPct": 57.5
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.5,
        "endPct": 76.5
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.5,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.6
      },
      {
        "id": "p3-whatif",
        "startPct": 18.6,
        "endPct": 39.0
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.0,
        "endPct": 59.6
      },
      {
        "id": "p3-committee",
        "startPct": 59.6,
        "endPct": 78.5
      },
      {
        "id": "p3-walkforward",
        "startPct": 78.5,
        "endPct": 100.1
      }
    ]
  },
  "DA": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 12.1
      },
      {
        "id": "home-header",
        "startPct": 12.1,
        "endPct": 23.5
      },
      {
        "id": "home-markets",
        "startPct": 23.5,
        "endPct": 37.0
      },
      {
        "id": "home-portfolio",
        "startPct": 37.0,
        "endPct": 52.7
      },
      {
        "id": "home-system",
        "startPct": 52.7,
        "endPct": 64.4
      },
      {
        "id": "home-guide",
        "startPct": 64.4,
        "endPct": 74.9
      },
      {
        "id": "home-langs",
        "startPct": 74.9,
        "endPct": 87.5
      },
      {
        "id": "home-palettes",
        "startPct": 87.5,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.3
      },
      {
        "id": "scr-pulse",
        "startPct": 17.3,
        "endPct": 37.5
      },
      {
        "id": "scr-table",
        "startPct": 37.5,
        "endPct": 55.4
      },
      {
        "id": "scr-orbital",
        "startPct": 55.4,
        "endPct": 70.1
      },
      {
        "id": "scr-heatmap",
        "startPct": 70.1,
        "endPct": 83.5
      },
      {
        "id": "scr-maintools",
        "startPct": 83.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.7
      },
      {
        "id": "ana-technical",
        "startPct": 14.7,
        "endPct": 29.0
      },
      {
        "id": "ana-compare",
        "startPct": 29.0,
        "endPct": 47.3
      },
      {
        "id": "ana-micro",
        "startPct": 47.3,
        "endPct": 68.3
      },
      {
        "id": "ana-engines",
        "startPct": 68.3,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 22.7
      },
      {
        "id": "res-rag",
        "startPct": 22.7,
        "endPct": 53.8
      },
      {
        "id": "res-factors",
        "startPct": 53.8,
        "endPct": 75.6
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.6,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.0
      },
      {
        "id": "p1-table",
        "startPct": 22.0,
        "endPct": 42.5
      },
      {
        "id": "p1-xray",
        "startPct": 42.5,
        "endPct": 64.4
      },
      {
        "id": "p1-calendar",
        "startPct": 64.4,
        "endPct": 80.1
      },
      {
        "id": "p1-backtest",
        "startPct": 80.1,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.2
      },
      {
        "id": "p2-tornado",
        "startPct": 19.2,
        "endPct": 42.6
      },
      {
        "id": "p2-corr",
        "startPct": 42.6,
        "endPct": 58.9
      },
      {
        "id": "p2-shock2d",
        "startPct": 58.9,
        "endPct": 76.2
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.2,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 17.9
      },
      {
        "id": "p3-whatif",
        "startPct": 17.9,
        "endPct": 38.0
      },
      {
        "id": "p3-tailhedge",
        "startPct": 38.0,
        "endPct": 59.1
      },
      {
        "id": "p3-committee",
        "startPct": 59.1,
        "endPct": 77.7
      },
      {
        "id": "p3-walkforward",
        "startPct": 77.7,
        "endPct": 100.1
      }
    ]
  },
  "FI": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.9
      },
      {
        "id": "home-header",
        "startPct": 10.9,
        "endPct": 22.3
      },
      {
        "id": "home-markets",
        "startPct": 22.3,
        "endPct": 37.6
      },
      {
        "id": "home-portfolio",
        "startPct": 37.6,
        "endPct": 54.0
      },
      {
        "id": "home-system",
        "startPct": 54.0,
        "endPct": 65.6
      },
      {
        "id": "home-guide",
        "startPct": 65.6,
        "endPct": 76.8
      },
      {
        "id": "home-langs",
        "startPct": 76.8,
        "endPct": 89.3
      },
      {
        "id": "home-palettes",
        "startPct": 89.3,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 15.6
      },
      {
        "id": "scr-pulse",
        "startPct": 15.6,
        "endPct": 37.7
      },
      {
        "id": "scr-table",
        "startPct": 37.7,
        "endPct": 55.1
      },
      {
        "id": "scr-orbital",
        "startPct": 55.1,
        "endPct": 69.9
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.9,
        "endPct": 82.5
      },
      {
        "id": "scr-maintools",
        "startPct": 82.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 13.5
      },
      {
        "id": "ana-technical",
        "startPct": 13.5,
        "endPct": 29.3
      },
      {
        "id": "ana-compare",
        "startPct": 29.3,
        "endPct": 49.1
      },
      {
        "id": "ana-micro",
        "startPct": 49.1,
        "endPct": 66.9
      },
      {
        "id": "ana-engines",
        "startPct": 66.9,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.8
      },
      {
        "id": "res-rag",
        "startPct": 23.8,
        "endPct": 54.4
      },
      {
        "id": "res-factors",
        "startPct": 54.4,
        "endPct": 77.5
      },
      {
        "id": "res-pulse24h",
        "startPct": 77.5,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.7
      },
      {
        "id": "p1-table",
        "startPct": 22.7,
        "endPct": 41.6
      },
      {
        "id": "p1-xray",
        "startPct": 41.6,
        "endPct": 65.3
      },
      {
        "id": "p1-calendar",
        "startPct": 65.3,
        "endPct": 79.2
      },
      {
        "id": "p1-backtest",
        "startPct": 79.2,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 15.3
      },
      {
        "id": "p2-tornado",
        "startPct": 15.3,
        "endPct": 40.1
      },
      {
        "id": "p2-corr",
        "startPct": 40.1,
        "endPct": 56.8
      },
      {
        "id": "p2-shock2d",
        "startPct": 56.8,
        "endPct": 75.0
      },
      {
        "id": "p2-montecarlo",
        "startPct": 75.0,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.7
      },
      {
        "id": "p3-whatif",
        "startPct": 18.7,
        "endPct": 41.6
      },
      {
        "id": "p3-tailhedge",
        "startPct": 41.6,
        "endPct": 60.6
      },
      {
        "id": "p3-committee",
        "startPct": 60.6,
        "endPct": 80.7
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.7,
        "endPct": 100.1
      }
    ]
  },
  "IS": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.8
      },
      {
        "id": "home-header",
        "startPct": 11.8,
        "endPct": 24.4
      },
      {
        "id": "home-markets",
        "startPct": 24.4,
        "endPct": 37.8
      },
      {
        "id": "home-portfolio",
        "startPct": 37.8,
        "endPct": 53.7
      },
      {
        "id": "home-system",
        "startPct": 53.7,
        "endPct": 64.7
      },
      {
        "id": "home-guide",
        "startPct": 64.7,
        "endPct": 75.6
      },
      {
        "id": "home-langs",
        "startPct": 75.6,
        "endPct": 87.6
      },
      {
        "id": "home-palettes",
        "startPct": 87.6,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 18.6
      },
      {
        "id": "scr-pulse",
        "startPct": 18.6,
        "endPct": 38.8
      },
      {
        "id": "scr-table",
        "startPct": 38.8,
        "endPct": 55.7
      },
      {
        "id": "scr-orbital",
        "startPct": 55.7,
        "endPct": 68.9
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.9,
        "endPct": 81.9
      },
      {
        "id": "scr-maintools",
        "startPct": 81.9,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 13.4
      },
      {
        "id": "ana-technical",
        "startPct": 13.4,
        "endPct": 28.3
      },
      {
        "id": "ana-compare",
        "startPct": 28.3,
        "endPct": 47.7
      },
      {
        "id": "ana-micro",
        "startPct": 47.7,
        "endPct": 65.7
      },
      {
        "id": "ana-engines",
        "startPct": 65.7,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 21.0
      },
      {
        "id": "res-rag",
        "startPct": 21.0,
        "endPct": 49.5
      },
      {
        "id": "res-factors",
        "startPct": 49.5,
        "endPct": 74.7
      },
      {
        "id": "res-pulse24h",
        "startPct": 74.7,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.3
      },
      {
        "id": "p1-table",
        "startPct": 22.3,
        "endPct": 42.6
      },
      {
        "id": "p1-xray",
        "startPct": 42.6,
        "endPct": 63.7
      },
      {
        "id": "p1-calendar",
        "startPct": 63.7,
        "endPct": 77.9
      },
      {
        "id": "p1-backtest",
        "startPct": 77.9,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.7
      },
      {
        "id": "p2-tornado",
        "startPct": 19.7,
        "endPct": 41.5
      },
      {
        "id": "p2-corr",
        "startPct": 41.5,
        "endPct": 57.6
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.6,
        "endPct": 75.5
      },
      {
        "id": "p2-montecarlo",
        "startPct": 75.5,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 16.4
      },
      {
        "id": "p3-whatif",
        "startPct": 16.4,
        "endPct": 39.8
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.8,
        "endPct": 59.2
      },
      {
        "id": "p3-committee",
        "startPct": 59.2,
        "endPct": 79.4
      },
      {
        "id": "p3-walkforward",
        "startPct": 79.4,
        "endPct": 100.1
      }
    ]
  },
  "CS": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.9
      },
      {
        "id": "home-header",
        "startPct": 10.9,
        "endPct": 21.2
      },
      {
        "id": "home-markets",
        "startPct": 21.2,
        "endPct": 36.3
      },
      {
        "id": "home-portfolio",
        "startPct": 36.3,
        "endPct": 50.3
      },
      {
        "id": "home-system",
        "startPct": 50.3,
        "endPct": 61.4
      },
      {
        "id": "home-guide",
        "startPct": 61.4,
        "endPct": 73.2
      },
      {
        "id": "home-langs",
        "startPct": 73.2,
        "endPct": 86.0
      },
      {
        "id": "home-palettes",
        "startPct": 86.0,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 15.9
      },
      {
        "id": "scr-pulse",
        "startPct": 15.9,
        "endPct": 35.9
      },
      {
        "id": "scr-table",
        "startPct": 35.9,
        "endPct": 53.7
      },
      {
        "id": "scr-orbital",
        "startPct": 53.7,
        "endPct": 68.6
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.6,
        "endPct": 83.0
      },
      {
        "id": "scr-maintools",
        "startPct": 83.0,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.1
      },
      {
        "id": "ana-technical",
        "startPct": 14.1,
        "endPct": 31.0
      },
      {
        "id": "ana-compare",
        "startPct": 31.0,
        "endPct": 47.9
      },
      {
        "id": "ana-micro",
        "startPct": 47.9,
        "endPct": 67.7
      },
      {
        "id": "ana-engines",
        "startPct": 67.7,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 21.5
      },
      {
        "id": "res-rag",
        "startPct": 21.5,
        "endPct": 49.0
      },
      {
        "id": "res-factors",
        "startPct": 49.0,
        "endPct": 75.2
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.2,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.8
      },
      {
        "id": "p1-table",
        "startPct": 21.8,
        "endPct": 40.0
      },
      {
        "id": "p1-xray",
        "startPct": 40.0,
        "endPct": 64.5
      },
      {
        "id": "p1-calendar",
        "startPct": 64.5,
        "endPct": 80.2
      },
      {
        "id": "p1-backtest",
        "startPct": 80.2,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 17.5
      },
      {
        "id": "p2-tornado",
        "startPct": 17.5,
        "endPct": 38.5
      },
      {
        "id": "p2-corr",
        "startPct": 38.5,
        "endPct": 55.4
      },
      {
        "id": "p2-shock2d",
        "startPct": 55.4,
        "endPct": 76.6
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.6,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 20.1
      },
      {
        "id": "p3-whatif",
        "startPct": 20.1,
        "endPct": 42.5
      },
      {
        "id": "p3-tailhedge",
        "startPct": 42.5,
        "endPct": 60.3
      },
      {
        "id": "p3-committee",
        "startPct": 60.3,
        "endPct": 82.0
      },
      {
        "id": "p3-walkforward",
        "startPct": 82.0,
        "endPct": 100.1
      }
    ]
  },
  "SK": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 12.0
      },
      {
        "id": "home-header",
        "startPct": 12.0,
        "endPct": 22.2
      },
      {
        "id": "home-markets",
        "startPct": 22.2,
        "endPct": 36.6
      },
      {
        "id": "home-portfolio",
        "startPct": 36.6,
        "endPct": 51.5
      },
      {
        "id": "home-system",
        "startPct": 51.5,
        "endPct": 62.3
      },
      {
        "id": "home-guide",
        "startPct": 62.3,
        "endPct": 74.3
      },
      {
        "id": "home-langs",
        "startPct": 74.3,
        "endPct": 86.2
      },
      {
        "id": "home-palettes",
        "startPct": 86.2,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.1
      },
      {
        "id": "scr-pulse",
        "startPct": 17.1,
        "endPct": 36.8
      },
      {
        "id": "scr-table",
        "startPct": 36.8,
        "endPct": 55.4
      },
      {
        "id": "scr-orbital",
        "startPct": 55.4,
        "endPct": 69.8
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.8,
        "endPct": 84.0
      },
      {
        "id": "scr-maintools",
        "startPct": 84.0,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 13.9
      },
      {
        "id": "ana-technical",
        "startPct": 13.9,
        "endPct": 30.8
      },
      {
        "id": "ana-compare",
        "startPct": 30.8,
        "endPct": 49.7
      },
      {
        "id": "ana-micro",
        "startPct": 49.7,
        "endPct": 67.0
      },
      {
        "id": "ana-engines",
        "startPct": 67.0,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 22.2
      },
      {
        "id": "res-rag",
        "startPct": 22.2,
        "endPct": 49.1
      },
      {
        "id": "res-factors",
        "startPct": 49.1,
        "endPct": 72.1
      },
      {
        "id": "res-pulse24h",
        "startPct": 72.1,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.0
      },
      {
        "id": "p1-table",
        "startPct": 22.0,
        "endPct": 40.6
      },
      {
        "id": "p1-xray",
        "startPct": 40.6,
        "endPct": 62.9
      },
      {
        "id": "p1-calendar",
        "startPct": 62.9,
        "endPct": 78.9
      },
      {
        "id": "p1-backtest",
        "startPct": 78.9,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.2
      },
      {
        "id": "p2-tornado",
        "startPct": 18.2,
        "endPct": 39.3
      },
      {
        "id": "p2-corr",
        "startPct": 39.3,
        "endPct": 55.0
      },
      {
        "id": "p2-shock2d",
        "startPct": 55.0,
        "endPct": 77.7
      },
      {
        "id": "p2-montecarlo",
        "startPct": 77.7,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.3
      },
      {
        "id": "p3-whatif",
        "startPct": 18.3,
        "endPct": 41.1
      },
      {
        "id": "p3-tailhedge",
        "startPct": 41.1,
        "endPct": 59.5
      },
      {
        "id": "p3-committee",
        "startPct": 59.5,
        "endPct": 79.3
      },
      {
        "id": "p3-walkforward",
        "startPct": 79.3,
        "endPct": 100.1
      }
    ]
  },
  "HU": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 12.7
      },
      {
        "id": "home-header",
        "startPct": 12.7,
        "endPct": 22.0
      },
      {
        "id": "home-markets",
        "startPct": 22.0,
        "endPct": 36.9
      },
      {
        "id": "home-portfolio",
        "startPct": 36.9,
        "endPct": 51.9
      },
      {
        "id": "home-system",
        "startPct": 51.9,
        "endPct": 62.0
      },
      {
        "id": "home-guide",
        "startPct": 62.0,
        "endPct": 73.4
      },
      {
        "id": "home-langs",
        "startPct": 73.4,
        "endPct": 86.7
      },
      {
        "id": "home-palettes",
        "startPct": 86.7,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.0
      },
      {
        "id": "scr-pulse",
        "startPct": 16.0,
        "endPct": 35.0
      },
      {
        "id": "scr-table",
        "startPct": 35.0,
        "endPct": 51.6
      },
      {
        "id": "scr-orbital",
        "startPct": 51.6,
        "endPct": 66.1
      },
      {
        "id": "scr-heatmap",
        "startPct": 66.1,
        "endPct": 78.6
      },
      {
        "id": "scr-maintools",
        "startPct": 78.6,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.0
      },
      {
        "id": "ana-technical",
        "startPct": 15.0,
        "endPct": 30.1
      },
      {
        "id": "ana-compare",
        "startPct": 30.1,
        "endPct": 48.4
      },
      {
        "id": "ana-micro",
        "startPct": 48.4,
        "endPct": 67.6
      },
      {
        "id": "ana-engines",
        "startPct": 67.6,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 22.0
      },
      {
        "id": "res-rag",
        "startPct": 22.0,
        "endPct": 51.1
      },
      {
        "id": "res-factors",
        "startPct": 51.1,
        "endPct": 73.2
      },
      {
        "id": "res-pulse24h",
        "startPct": 73.2,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.3
      },
      {
        "id": "p1-table",
        "startPct": 21.3,
        "endPct": 42.5
      },
      {
        "id": "p1-xray",
        "startPct": 42.5,
        "endPct": 64.0
      },
      {
        "id": "p1-calendar",
        "startPct": 64.0,
        "endPct": 79.9
      },
      {
        "id": "p1-backtest",
        "startPct": 79.9,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.9
      },
      {
        "id": "p2-tornado",
        "startPct": 19.9,
        "endPct": 41.0
      },
      {
        "id": "p2-corr",
        "startPct": 41.0,
        "endPct": 58.8
      },
      {
        "id": "p2-shock2d",
        "startPct": 58.8,
        "endPct": 77.9
      },
      {
        "id": "p2-montecarlo",
        "startPct": 77.9,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 17.4
      },
      {
        "id": "p3-whatif",
        "startPct": 17.4,
        "endPct": 39.1
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.1,
        "endPct": 59.6
      },
      {
        "id": "p3-committee",
        "startPct": 59.6,
        "endPct": 81.0
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.0,
        "endPct": 100.1
      }
    ]
  },
  "RO": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 12.5
      },
      {
        "id": "home-header",
        "startPct": 12.5,
        "endPct": 24.0
      },
      {
        "id": "home-markets",
        "startPct": 24.0,
        "endPct": 39.5
      },
      {
        "id": "home-portfolio",
        "startPct": 39.5,
        "endPct": 54.8
      },
      {
        "id": "home-system",
        "startPct": 54.8,
        "endPct": 67.1
      },
      {
        "id": "home-guide",
        "startPct": 67.1,
        "endPct": 76.7
      },
      {
        "id": "home-langs",
        "startPct": 76.7,
        "endPct": 88.1
      },
      {
        "id": "home-palettes",
        "startPct": 88.1,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.4
      },
      {
        "id": "scr-pulse",
        "startPct": 17.4,
        "endPct": 37.3
      },
      {
        "id": "scr-table",
        "startPct": 37.3,
        "endPct": 53.2
      },
      {
        "id": "scr-orbital",
        "startPct": 53.2,
        "endPct": 68.2
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.2,
        "endPct": 82.4
      },
      {
        "id": "scr-maintools",
        "startPct": 82.4,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.6
      },
      {
        "id": "ana-technical",
        "startPct": 15.6,
        "endPct": 30.6
      },
      {
        "id": "ana-compare",
        "startPct": 30.6,
        "endPct": 46.4
      },
      {
        "id": "ana-micro",
        "startPct": 46.4,
        "endPct": 64.3
      },
      {
        "id": "ana-engines",
        "startPct": 64.3,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.7
      },
      {
        "id": "res-rag",
        "startPct": 23.7,
        "endPct": 50.0
      },
      {
        "id": "res-factors",
        "startPct": 50.0,
        "endPct": 73.5
      },
      {
        "id": "res-pulse24h",
        "startPct": 73.5,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.4
      },
      {
        "id": "p1-table",
        "startPct": 21.4,
        "endPct": 42.7
      },
      {
        "id": "p1-xray",
        "startPct": 42.7,
        "endPct": 62.9
      },
      {
        "id": "p1-calendar",
        "startPct": 62.9,
        "endPct": 78.2
      },
      {
        "id": "p1-backtest",
        "startPct": 78.2,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 17.7
      },
      {
        "id": "p2-tornado",
        "startPct": 17.7,
        "endPct": 39.8
      },
      {
        "id": "p2-corr",
        "startPct": 39.8,
        "endPct": 56.7
      },
      {
        "id": "p2-shock2d",
        "startPct": 56.7,
        "endPct": 77.2
      },
      {
        "id": "p2-montecarlo",
        "startPct": 77.2,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 17.0
      },
      {
        "id": "p3-whatif",
        "startPct": 17.0,
        "endPct": 39.7
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.7,
        "endPct": 58.6
      },
      {
        "id": "p3-committee",
        "startPct": 58.6,
        "endPct": 81.2
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.2,
        "endPct": 100.1
      }
    ]
  },
  "BG": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.1
      },
      {
        "id": "home-header",
        "startPct": 11.1,
        "endPct": 25.3
      },
      {
        "id": "home-markets",
        "startPct": 25.3,
        "endPct": 39.2
      },
      {
        "id": "home-portfolio",
        "startPct": 39.2,
        "endPct": 53.0
      },
      {
        "id": "home-system",
        "startPct": 53.0,
        "endPct": 63.2
      },
      {
        "id": "home-guide",
        "startPct": 63.2,
        "endPct": 73.4
      },
      {
        "id": "home-langs",
        "startPct": 73.4,
        "endPct": 86.9
      },
      {
        "id": "home-palettes",
        "startPct": 86.9,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.3
      },
      {
        "id": "scr-pulse",
        "startPct": 16.3,
        "endPct": 34.6
      },
      {
        "id": "scr-table",
        "startPct": 34.6,
        "endPct": 52.9
      },
      {
        "id": "scr-orbital",
        "startPct": 52.9,
        "endPct": 68.7
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.7,
        "endPct": 82.5
      },
      {
        "id": "scr-maintools",
        "startPct": 82.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.9
      },
      {
        "id": "ana-technical",
        "startPct": 14.9,
        "endPct": 29.3
      },
      {
        "id": "ana-compare",
        "startPct": 29.3,
        "endPct": 45.4
      },
      {
        "id": "ana-micro",
        "startPct": 45.4,
        "endPct": 63.2
      },
      {
        "id": "ana-engines",
        "startPct": 63.2,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.2
      },
      {
        "id": "res-rag",
        "startPct": 23.2,
        "endPct": 49.8
      },
      {
        "id": "res-factors",
        "startPct": 49.8,
        "endPct": 75.0
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.0,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.5
      },
      {
        "id": "p1-table",
        "startPct": 20.5,
        "endPct": 39.9
      },
      {
        "id": "p1-xray",
        "startPct": 39.9,
        "endPct": 60.3
      },
      {
        "id": "p1-calendar",
        "startPct": 60.3,
        "endPct": 78.3
      },
      {
        "id": "p1-backtest",
        "startPct": 78.3,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 16.5
      },
      {
        "id": "p2-tornado",
        "startPct": 16.5,
        "endPct": 38.1
      },
      {
        "id": "p2-corr",
        "startPct": 38.1,
        "endPct": 57.1
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.1,
        "endPct": 78.0
      },
      {
        "id": "p2-montecarlo",
        "startPct": 78.0,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 19.0
      },
      {
        "id": "p3-whatif",
        "startPct": 19.0,
        "endPct": 40.1
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.1,
        "endPct": 57.5
      },
      {
        "id": "p3-committee",
        "startPct": 57.5,
        "endPct": 80.0
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.0,
        "endPct": 100.1
      }
    ]
  },
  "EL": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.8
      },
      {
        "id": "home-header",
        "startPct": 10.8,
        "endPct": 22.8
      },
      {
        "id": "home-markets",
        "startPct": 22.8,
        "endPct": 36.8
      },
      {
        "id": "home-portfolio",
        "startPct": 36.8,
        "endPct": 52.7
      },
      {
        "id": "home-system",
        "startPct": 52.7,
        "endPct": 65.8
      },
      {
        "id": "home-guide",
        "startPct": 65.8,
        "endPct": 75.8
      },
      {
        "id": "home-langs",
        "startPct": 75.8,
        "endPct": 88.6
      },
      {
        "id": "home-palettes",
        "startPct": 88.6,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.7
      },
      {
        "id": "scr-pulse",
        "startPct": 16.7,
        "endPct": 36.0
      },
      {
        "id": "scr-table",
        "startPct": 36.0,
        "endPct": 52.4
      },
      {
        "id": "scr-orbital",
        "startPct": 52.4,
        "endPct": 67.9
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.9,
        "endPct": 81.1
      },
      {
        "id": "scr-maintools",
        "startPct": 81.1,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.0
      },
      {
        "id": "ana-technical",
        "startPct": 15.0,
        "endPct": 31.0
      },
      {
        "id": "ana-compare",
        "startPct": 31.0,
        "endPct": 47.2
      },
      {
        "id": "ana-micro",
        "startPct": 47.2,
        "endPct": 64.3
      },
      {
        "id": "ana-engines",
        "startPct": 64.3,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 25.4
      },
      {
        "id": "res-rag",
        "startPct": 25.4,
        "endPct": 50.6
      },
      {
        "id": "res-factors",
        "startPct": 50.6,
        "endPct": 73.3
      },
      {
        "id": "res-pulse24h",
        "startPct": 73.3,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.5
      },
      {
        "id": "p1-table",
        "startPct": 21.5,
        "endPct": 41.3
      },
      {
        "id": "p1-xray",
        "startPct": 41.3,
        "endPct": 63.1
      },
      {
        "id": "p1-calendar",
        "startPct": 63.1,
        "endPct": 80.8
      },
      {
        "id": "p1-backtest",
        "startPct": 80.8,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 17.6
      },
      {
        "id": "p2-tornado",
        "startPct": 17.6,
        "endPct": 40.7
      },
      {
        "id": "p2-corr",
        "startPct": 40.7,
        "endPct": 57.5
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.5,
        "endPct": 76.9
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.9,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.5
      },
      {
        "id": "p3-whatif",
        "startPct": 18.5,
        "endPct": 38.9
      },
      {
        "id": "p3-tailhedge",
        "startPct": 38.9,
        "endPct": 58.1
      },
      {
        "id": "p3-committee",
        "startPct": 58.1,
        "endPct": 81.6
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.6,
        "endPct": 100.1
      }
    ]
  },
  "TR": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 14.6
      },
      {
        "id": "home-header",
        "startPct": 14.6,
        "endPct": 24.8
      },
      {
        "id": "home-markets",
        "startPct": 24.8,
        "endPct": 39.3
      },
      {
        "id": "home-portfolio",
        "startPct": 39.3,
        "endPct": 54.4
      },
      {
        "id": "home-system",
        "startPct": 54.4,
        "endPct": 67.3
      },
      {
        "id": "home-guide",
        "startPct": 67.3,
        "endPct": 77.1
      },
      {
        "id": "home-langs",
        "startPct": 77.1,
        "endPct": 88.5
      },
      {
        "id": "home-palettes",
        "startPct": 88.5,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.2
      },
      {
        "id": "scr-pulse",
        "startPct": 16.2,
        "endPct": 35.7
      },
      {
        "id": "scr-table",
        "startPct": 35.7,
        "endPct": 52.2
      },
      {
        "id": "scr-orbital",
        "startPct": 52.2,
        "endPct": 67.5
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.5,
        "endPct": 81.7
      },
      {
        "id": "scr-maintools",
        "startPct": 81.7,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.7
      },
      {
        "id": "ana-technical",
        "startPct": 15.7,
        "endPct": 28.8
      },
      {
        "id": "ana-compare",
        "startPct": 28.8,
        "endPct": 44.2
      },
      {
        "id": "ana-micro",
        "startPct": 44.2,
        "endPct": 68.2
      },
      {
        "id": "ana-engines",
        "startPct": 68.2,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.8
      },
      {
        "id": "res-rag",
        "startPct": 23.8,
        "endPct": 50.8
      },
      {
        "id": "res-factors",
        "startPct": 50.8,
        "endPct": 73.8
      },
      {
        "id": "res-pulse24h",
        "startPct": 73.8,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.8
      },
      {
        "id": "p1-table",
        "startPct": 22.8,
        "endPct": 42.4
      },
      {
        "id": "p1-xray",
        "startPct": 42.4,
        "endPct": 64.8
      },
      {
        "id": "p1-calendar",
        "startPct": 64.8,
        "endPct": 79.7
      },
      {
        "id": "p1-backtest",
        "startPct": 79.7,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 17.6
      },
      {
        "id": "p2-tornado",
        "startPct": 17.6,
        "endPct": 37.1
      },
      {
        "id": "p2-corr",
        "startPct": 37.1,
        "endPct": 55.1
      },
      {
        "id": "p2-shock2d",
        "startPct": 55.1,
        "endPct": 76.0
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.0,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.7
      },
      {
        "id": "p3-whatif",
        "startPct": 18.7,
        "endPct": 39.4
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.4,
        "endPct": 58.8
      },
      {
        "id": "p3-committee",
        "startPct": 58.8,
        "endPct": 79.2
      },
      {
        "id": "p3-walkforward",
        "startPct": 79.3,
        "endPct": 100.1
      }
    ]
  },
  "RU": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 12.1
      },
      {
        "id": "home-header",
        "startPct": 12.1,
        "endPct": 22.7
      },
      {
        "id": "home-markets",
        "startPct": 22.7,
        "endPct": 37.9
      },
      {
        "id": "home-portfolio",
        "startPct": 37.9,
        "endPct": 53.4
      },
      {
        "id": "home-system",
        "startPct": 53.4,
        "endPct": 64.5
      },
      {
        "id": "home-guide",
        "startPct": 64.5,
        "endPct": 76.2
      },
      {
        "id": "home-langs",
        "startPct": 76.2,
        "endPct": 88.2
      },
      {
        "id": "home-palettes",
        "startPct": 88.2,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 15.3
      },
      {
        "id": "scr-pulse",
        "startPct": 15.3,
        "endPct": 33.5
      },
      {
        "id": "scr-table",
        "startPct": 33.5,
        "endPct": 51.6
      },
      {
        "id": "scr-orbital",
        "startPct": 51.6,
        "endPct": 69.5
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.5,
        "endPct": 84.0
      },
      {
        "id": "scr-maintools",
        "startPct": 84.0,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.0
      },
      {
        "id": "ana-technical",
        "startPct": 14.0,
        "endPct": 27.1
      },
      {
        "id": "ana-compare",
        "startPct": 27.1,
        "endPct": 46.3
      },
      {
        "id": "ana-micro",
        "startPct": 46.3,
        "endPct": 63.7
      },
      {
        "id": "ana-engines",
        "startPct": 63.7,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 22.1
      },
      {
        "id": "res-rag",
        "startPct": 22.1,
        "endPct": 49.8
      },
      {
        "id": "res-factors",
        "startPct": 49.8,
        "endPct": 75.2
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.2,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.8
      },
      {
        "id": "p1-table",
        "startPct": 22.8,
        "endPct": 44.0
      },
      {
        "id": "p1-xray",
        "startPct": 44.0,
        "endPct": 65.1
      },
      {
        "id": "p1-calendar",
        "startPct": 65.1,
        "endPct": 81.1
      },
      {
        "id": "p1-backtest",
        "startPct": 81.1,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 20.0
      },
      {
        "id": "p2-tornado",
        "startPct": 20.0,
        "endPct": 41.5
      },
      {
        "id": "p2-corr",
        "startPct": 41.5,
        "endPct": 57.7
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.7,
        "endPct": 78.2
      },
      {
        "id": "p2-montecarlo",
        "startPct": 78.2,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 19.4
      },
      {
        "id": "p3-whatif",
        "startPct": 19.4,
        "endPct": 40.4
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.4,
        "endPct": 60.6
      },
      {
        "id": "p3-committee",
        "startPct": 60.6,
        "endPct": 79.6
      },
      {
        "id": "p3-walkforward",
        "startPct": 79.6,
        "endPct": 100.1
      }
    ]
  },
  "UK": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.6
      },
      {
        "id": "home-header",
        "startPct": 11.6,
        "endPct": 23.0
      },
      {
        "id": "home-markets",
        "startPct": 23.0,
        "endPct": 39.2
      },
      {
        "id": "home-portfolio",
        "startPct": 39.2,
        "endPct": 53.5
      },
      {
        "id": "home-system",
        "startPct": 53.5,
        "endPct": 64.5
      },
      {
        "id": "home-guide",
        "startPct": 64.5,
        "endPct": 74.5
      },
      {
        "id": "home-langs",
        "startPct": 74.5,
        "endPct": 86.7
      },
      {
        "id": "home-palettes",
        "startPct": 86.7,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.6
      },
      {
        "id": "scr-pulse",
        "startPct": 16.6,
        "endPct": 36.4
      },
      {
        "id": "scr-table",
        "startPct": 36.4,
        "endPct": 52.9
      },
      {
        "id": "scr-orbital",
        "startPct": 52.9,
        "endPct": 68.2
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.2,
        "endPct": 82.6
      },
      {
        "id": "scr-maintools",
        "startPct": 82.6,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.0
      },
      {
        "id": "ana-technical",
        "startPct": 15.0,
        "endPct": 29.1
      },
      {
        "id": "ana-compare",
        "startPct": 29.1,
        "endPct": 47.3
      },
      {
        "id": "ana-micro",
        "startPct": 47.3,
        "endPct": 66.4
      },
      {
        "id": "ana-engines",
        "startPct": 66.4,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 22.3
      },
      {
        "id": "res-rag",
        "startPct": 22.3,
        "endPct": 48.7
      },
      {
        "id": "res-factors",
        "startPct": 48.7,
        "endPct": 73.5
      },
      {
        "id": "res-pulse24h",
        "startPct": 73.5,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.6
      },
      {
        "id": "p1-table",
        "startPct": 21.6,
        "endPct": 41.5
      },
      {
        "id": "p1-xray",
        "startPct": 41.5,
        "endPct": 63.3
      },
      {
        "id": "p1-calendar",
        "startPct": 63.3,
        "endPct": 80.7
      },
      {
        "id": "p1-backtest",
        "startPct": 80.7,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.3
      },
      {
        "id": "p2-tornado",
        "startPct": 18.3,
        "endPct": 44.0
      },
      {
        "id": "p2-corr",
        "startPct": 44.0,
        "endPct": 58.6
      },
      {
        "id": "p2-shock2d",
        "startPct": 58.6,
        "endPct": 76.6
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.6,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.1
      },
      {
        "id": "p3-whatif",
        "startPct": 18.1,
        "endPct": 39.4
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.4,
        "endPct": 60.3
      },
      {
        "id": "p3-committee",
        "startPct": 60.3,
        "endPct": 82.3
      },
      {
        "id": "p3-walkforward",
        "startPct": 82.3,
        "endPct": 100.1
      }
    ]
  },
  "SR": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.8
      },
      {
        "id": "home-header",
        "startPct": 10.8,
        "endPct": 21.8
      },
      {
        "id": "home-markets",
        "startPct": 21.8,
        "endPct": 37.9
      },
      {
        "id": "home-portfolio",
        "startPct": 37.9,
        "endPct": 51.5
      },
      {
        "id": "home-system",
        "startPct": 51.5,
        "endPct": 65.4
      },
      {
        "id": "home-guide",
        "startPct": 65.4,
        "endPct": 76.7
      },
      {
        "id": "home-langs",
        "startPct": 76.7,
        "endPct": 87.1
      },
      {
        "id": "home-palettes",
        "startPct": 87.1,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 18.0
      },
      {
        "id": "scr-pulse",
        "startPct": 18.0,
        "endPct": 38.1
      },
      {
        "id": "scr-table",
        "startPct": 38.1,
        "endPct": 53.1
      },
      {
        "id": "scr-orbital",
        "startPct": 53.1,
        "endPct": 69.8
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.8,
        "endPct": 82.4
      },
      {
        "id": "scr-maintools",
        "startPct": 82.4,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.1
      },
      {
        "id": "ana-technical",
        "startPct": 15.1,
        "endPct": 32.5
      },
      {
        "id": "ana-compare",
        "startPct": 32.5,
        "endPct": 49.2
      },
      {
        "id": "ana-micro",
        "startPct": 49.2,
        "endPct": 68.6
      },
      {
        "id": "ana-engines",
        "startPct": 68.6,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 19.4
      },
      {
        "id": "res-rag",
        "startPct": 19.4,
        "endPct": 53.7
      },
      {
        "id": "res-factors",
        "startPct": 53.7,
        "endPct": 74.2
      },
      {
        "id": "res-pulse24h",
        "startPct": 74.2,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 29.1
      },
      {
        "id": "p1-table",
        "startPct": 29.1,
        "endPct": 44.5
      },
      {
        "id": "p1-xray",
        "startPct": 44.5,
        "endPct": 61.8
      },
      {
        "id": "p1-calendar",
        "startPct": 61.8,
        "endPct": 77.6
      },
      {
        "id": "p1-backtest",
        "startPct": 77.6,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 22.9
      },
      {
        "id": "p2-tornado",
        "startPct": 22.9,
        "endPct": 42.8
      },
      {
        "id": "p2-corr",
        "startPct": 42.8,
        "endPct": 56.7
      },
      {
        "id": "p2-shock2d",
        "startPct": 56.7,
        "endPct": 74.5
      },
      {
        "id": "p2-montecarlo",
        "startPct": 74.5,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 15.6
      },
      {
        "id": "p3-whatif",
        "startPct": 15.6,
        "endPct": 39.8
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.8,
        "endPct": 60.3
      },
      {
        "id": "p3-committee",
        "startPct": 60.3,
        "endPct": 76.5
      },
      {
        "id": "p3-walkforward",
        "startPct": 76.5,
        "endPct": 100.1
      }
    ]
  },
  "HR": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.8
      },
      {
        "id": "home-header",
        "startPct": 10.8,
        "endPct": 21.1
      },
      {
        "id": "home-markets",
        "startPct": 21.1,
        "endPct": 35.3
      },
      {
        "id": "home-portfolio",
        "startPct": 35.3,
        "endPct": 51.6
      },
      {
        "id": "home-system",
        "startPct": 51.6,
        "endPct": 64.4
      },
      {
        "id": "home-guide",
        "startPct": 64.4,
        "endPct": 75.4
      },
      {
        "id": "home-langs",
        "startPct": 75.4,
        "endPct": 86.8
      },
      {
        "id": "home-palettes",
        "startPct": 86.8,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.2
      },
      {
        "id": "scr-pulse",
        "startPct": 16.2,
        "endPct": 37.7
      },
      {
        "id": "scr-table",
        "startPct": 37.7,
        "endPct": 55.4
      },
      {
        "id": "scr-orbital",
        "startPct": 55.4,
        "endPct": 69.7
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.7,
        "endPct": 84.0
      },
      {
        "id": "scr-maintools",
        "startPct": 84.0,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.2
      },
      {
        "id": "ana-technical",
        "startPct": 15.2,
        "endPct": 33.1
      },
      {
        "id": "ana-compare",
        "startPct": 33.1,
        "endPct": 49.7
      },
      {
        "id": "ana-micro",
        "startPct": 49.7,
        "endPct": 71.9
      },
      {
        "id": "ana-engines",
        "startPct": 71.9,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 20.4
      },
      {
        "id": "res-rag",
        "startPct": 20.4,
        "endPct": 47.7
      },
      {
        "id": "res-factors",
        "startPct": 47.7,
        "endPct": 72.3
      },
      {
        "id": "res-pulse24h",
        "startPct": 72.3,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.2
      },
      {
        "id": "p1-table",
        "startPct": 21.2,
        "endPct": 40.0
      },
      {
        "id": "p1-xray",
        "startPct": 40.0,
        "endPct": 60.9
      },
      {
        "id": "p1-calendar",
        "startPct": 60.9,
        "endPct": 79.8
      },
      {
        "id": "p1-backtest",
        "startPct": 79.8,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 16.5
      },
      {
        "id": "p2-tornado",
        "startPct": 16.5,
        "endPct": 37.3
      },
      {
        "id": "p2-corr",
        "startPct": 37.3,
        "endPct": 53.4
      },
      {
        "id": "p2-shock2d",
        "startPct": 53.4,
        "endPct": 75.9
      },
      {
        "id": "p2-montecarlo",
        "startPct": 75.9,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 21.1
      },
      {
        "id": "p3-whatif",
        "startPct": 21.1,
        "endPct": 45.5
      },
      {
        "id": "p3-tailhedge",
        "startPct": 45.5,
        "endPct": 62.4
      },
      {
        "id": "p3-committee",
        "startPct": 62.4,
        "endPct": 79.8
      },
      {
        "id": "p3-walkforward",
        "startPct": 79.8,
        "endPct": 100.1
      }
    ]
  },
  "SL": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.6
      },
      {
        "id": "home-header",
        "startPct": 11.6,
        "endPct": 21.9
      },
      {
        "id": "home-markets",
        "startPct": 21.9,
        "endPct": 36.3
      },
      {
        "id": "home-portfolio",
        "startPct": 36.3,
        "endPct": 50.5
      },
      {
        "id": "home-system",
        "startPct": 50.5,
        "endPct": 61.7
      },
      {
        "id": "home-guide",
        "startPct": 61.7,
        "endPct": 72.9
      },
      {
        "id": "home-langs",
        "startPct": 72.9,
        "endPct": 86.2
      },
      {
        "id": "home-palettes",
        "startPct": 86.2,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.3
      },
      {
        "id": "scr-pulse",
        "startPct": 17.3,
        "endPct": 39.1
      },
      {
        "id": "scr-table",
        "startPct": 39.1,
        "endPct": 55.7
      },
      {
        "id": "scr-orbital",
        "startPct": 55.7,
        "endPct": 69.9
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.9,
        "endPct": 84.2
      },
      {
        "id": "scr-maintools",
        "startPct": 84.2,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 13.9
      },
      {
        "id": "ana-technical",
        "startPct": 13.9,
        "endPct": 32.0
      },
      {
        "id": "ana-compare",
        "startPct": 32.0,
        "endPct": 48.4
      },
      {
        "id": "ana-micro",
        "startPct": 48.4,
        "endPct": 68.7
      },
      {
        "id": "ana-engines",
        "startPct": 68.7,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 21.2
      },
      {
        "id": "res-rag",
        "startPct": 21.2,
        "endPct": 48.4
      },
      {
        "id": "res-factors",
        "startPct": 48.4,
        "endPct": 76.3
      },
      {
        "id": "res-pulse24h",
        "startPct": 76.3,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.7
      },
      {
        "id": "p1-table",
        "startPct": 21.7,
        "endPct": 40.7
      },
      {
        "id": "p1-xray",
        "startPct": 40.7,
        "endPct": 62.2
      },
      {
        "id": "p1-calendar",
        "startPct": 62.2,
        "endPct": 79.2
      },
      {
        "id": "p1-backtest",
        "startPct": 79.2,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.4
      },
      {
        "id": "p2-tornado",
        "startPct": 18.4,
        "endPct": 39.2
      },
      {
        "id": "p2-corr",
        "startPct": 39.2,
        "endPct": 54.2
      },
      {
        "id": "p2-shock2d",
        "startPct": 54.2,
        "endPct": 76.7
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.7,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.7
      },
      {
        "id": "p3-whatif",
        "startPct": 18.7,
        "endPct": 40.8
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.8,
        "endPct": 59.6
      },
      {
        "id": "p3-committee",
        "startPct": 59.6,
        "endPct": 81.7
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.7,
        "endPct": 100.1
      }
    ]
  },
  "LT": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 12.3
      },
      {
        "id": "home-header",
        "startPct": 12.3,
        "endPct": 24.5
      },
      {
        "id": "home-markets",
        "startPct": 24.5,
        "endPct": 38.3
      },
      {
        "id": "home-portfolio",
        "startPct": 38.3,
        "endPct": 50.5
      },
      {
        "id": "home-system",
        "startPct": 50.5,
        "endPct": 61.5
      },
      {
        "id": "home-guide",
        "startPct": 61.5,
        "endPct": 70.4
      },
      {
        "id": "home-langs",
        "startPct": 70.4,
        "endPct": 86.5
      },
      {
        "id": "home-palettes",
        "startPct": 86.5,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.6
      },
      {
        "id": "scr-pulse",
        "startPct": 17.6,
        "endPct": 35.6
      },
      {
        "id": "scr-table",
        "startPct": 35.6,
        "endPct": 51.0
      },
      {
        "id": "scr-orbital",
        "startPct": 51.0,
        "endPct": 67.6
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.6,
        "endPct": 83.9
      },
      {
        "id": "scr-maintools",
        "startPct": 83.9,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.5
      },
      {
        "id": "ana-technical",
        "startPct": 15.5,
        "endPct": 30.4
      },
      {
        "id": "ana-compare",
        "startPct": 30.4,
        "endPct": 49.4
      },
      {
        "id": "ana-micro",
        "startPct": 49.4,
        "endPct": 65.6
      },
      {
        "id": "ana-engines",
        "startPct": 65.6,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 21.7
      },
      {
        "id": "res-rag",
        "startPct": 21.7,
        "endPct": 48.6
      },
      {
        "id": "res-factors",
        "startPct": 48.6,
        "endPct": 75.5
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.5,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 24.7
      },
      {
        "id": "p1-table",
        "startPct": 24.7,
        "endPct": 45.7
      },
      {
        "id": "p1-xray",
        "startPct": 45.7,
        "endPct": 64.9
      },
      {
        "id": "p1-calendar",
        "startPct": 64.9,
        "endPct": 80.6
      },
      {
        "id": "p1-backtest",
        "startPct": 80.6,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.3
      },
      {
        "id": "p2-tornado",
        "startPct": 19.3,
        "endPct": 41.9
      },
      {
        "id": "p2-corr",
        "startPct": 41.9,
        "endPct": 57.7
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.7,
        "endPct": 75.6
      },
      {
        "id": "p2-montecarlo",
        "startPct": 75.6,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 17.7
      },
      {
        "id": "p3-whatif",
        "startPct": 17.7,
        "endPct": 37.4
      },
      {
        "id": "p3-tailhedge",
        "startPct": 37.4,
        "endPct": 53.7
      },
      {
        "id": "p3-committee",
        "startPct": 53.7,
        "endPct": 76.7
      },
      {
        "id": "p3-walkforward",
        "startPct": 76.7,
        "endPct": 100.1
      }
    ]
  },
  "LV": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.8
      },
      {
        "id": "home-header",
        "startPct": 10.8,
        "endPct": 22.9
      },
      {
        "id": "home-markets",
        "startPct": 22.9,
        "endPct": 37.2
      },
      {
        "id": "home-portfolio",
        "startPct": 37.2,
        "endPct": 50.8
      },
      {
        "id": "home-system",
        "startPct": 50.8,
        "endPct": 62.8
      },
      {
        "id": "home-guide",
        "startPct": 62.8,
        "endPct": 74.4
      },
      {
        "id": "home-langs",
        "startPct": 74.4,
        "endPct": 87.0
      },
      {
        "id": "home-palettes",
        "startPct": 87.0,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 18.0
      },
      {
        "id": "scr-pulse",
        "startPct": 18.0,
        "endPct": 37.2
      },
      {
        "id": "scr-table",
        "startPct": 37.2,
        "endPct": 53.4
      },
      {
        "id": "scr-orbital",
        "startPct": 53.4,
        "endPct": 68.6
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.6,
        "endPct": 83.9
      },
      {
        "id": "scr-maintools",
        "startPct": 83.9,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.1
      },
      {
        "id": "ana-technical",
        "startPct": 15.1,
        "endPct": 30.0
      },
      {
        "id": "ana-compare",
        "startPct": 30.0,
        "endPct": 50.2
      },
      {
        "id": "ana-micro",
        "startPct": 50.2,
        "endPct": 70.4
      },
      {
        "id": "ana-engines",
        "startPct": 70.4,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 18.8
      },
      {
        "id": "res-rag",
        "startPct": 18.8,
        "endPct": 49.0
      },
      {
        "id": "res-factors",
        "startPct": 49.0,
        "endPct": 74.1
      },
      {
        "id": "res-pulse24h",
        "startPct": 74.1,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.9
      },
      {
        "id": "p1-table",
        "startPct": 20.9,
        "endPct": 41.7
      },
      {
        "id": "p1-xray",
        "startPct": 41.7,
        "endPct": 63.6
      },
      {
        "id": "p1-calendar",
        "startPct": 63.6,
        "endPct": 79.6
      },
      {
        "id": "p1-backtest",
        "startPct": 79.6,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.9
      },
      {
        "id": "p2-tornado",
        "startPct": 19.9,
        "endPct": 43.8
      },
      {
        "id": "p2-corr",
        "startPct": 43.8,
        "endPct": 60.1
      },
      {
        "id": "p2-shock2d",
        "startPct": 60.1,
        "endPct": 78.8
      },
      {
        "id": "p2-montecarlo",
        "startPct": 78.8,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.6
      },
      {
        "id": "p3-whatif",
        "startPct": 18.6,
        "endPct": 41.0
      },
      {
        "id": "p3-tailhedge",
        "startPct": 41.0,
        "endPct": 60.9
      },
      {
        "id": "p3-committee",
        "startPct": 60.9,
        "endPct": 79.4
      },
      {
        "id": "p3-walkforward",
        "startPct": 79.4,
        "endPct": 100.1
      }
    ]
  },
  "ET": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.8
      },
      {
        "id": "home-header",
        "startPct": 11.8,
        "endPct": 23.0
      },
      {
        "id": "home-markets",
        "startPct": 23.0,
        "endPct": 36.4
      },
      {
        "id": "home-portfolio",
        "startPct": 36.4,
        "endPct": 50.1
      },
      {
        "id": "home-system",
        "startPct": 50.1,
        "endPct": 63.5
      },
      {
        "id": "home-guide",
        "startPct": 63.5,
        "endPct": 74.5
      },
      {
        "id": "home-langs",
        "startPct": 74.5,
        "endPct": 87.3
      },
      {
        "id": "home-palettes",
        "startPct": 87.3,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.4
      },
      {
        "id": "scr-pulse",
        "startPct": 16.4,
        "endPct": 35.8
      },
      {
        "id": "scr-table",
        "startPct": 35.8,
        "endPct": 51.4
      },
      {
        "id": "scr-orbital",
        "startPct": 51.4,
        "endPct": 67.4
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.4,
        "endPct": 82.5
      },
      {
        "id": "scr-maintools",
        "startPct": 82.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.4
      },
      {
        "id": "ana-technical",
        "startPct": 14.4,
        "endPct": 30.0
      },
      {
        "id": "ana-compare",
        "startPct": 30.0,
        "endPct": 48.3
      },
      {
        "id": "ana-micro",
        "startPct": 48.3,
        "endPct": 67.7
      },
      {
        "id": "ana-engines",
        "startPct": 67.7,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.1
      },
      {
        "id": "res-rag",
        "startPct": 23.1,
        "endPct": 54.6
      },
      {
        "id": "res-factors",
        "startPct": 54.6,
        "endPct": 76.0
      },
      {
        "id": "res-pulse24h",
        "startPct": 76.0,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 23.2
      },
      {
        "id": "p1-table",
        "startPct": 23.2,
        "endPct": 41.6
      },
      {
        "id": "p1-xray",
        "startPct": 41.6,
        "endPct": 62.3
      },
      {
        "id": "p1-calendar",
        "startPct": 62.3,
        "endPct": 77.4
      },
      {
        "id": "p1-backtest",
        "startPct": 77.4,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.2
      },
      {
        "id": "p2-tornado",
        "startPct": 19.2,
        "endPct": 39.6
      },
      {
        "id": "p2-corr",
        "startPct": 39.6,
        "endPct": 56.2
      },
      {
        "id": "p2-shock2d",
        "startPct": 56.2,
        "endPct": 76.4
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.4,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 16.4
      },
      {
        "id": "p3-whatif",
        "startPct": 16.4,
        "endPct": 40.5
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.5,
        "endPct": 60.0
      },
      {
        "id": "p3-committee",
        "startPct": 60.0,
        "endPct": 79.3
      },
      {
        "id": "p3-walkforward",
        "startPct": 79.3,
        "endPct": 100.1
      }
    ]
  },
  "GA": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.6
      },
      {
        "id": "home-header",
        "startPct": 10.6,
        "endPct": 24.3
      },
      {
        "id": "home-markets",
        "startPct": 24.3,
        "endPct": 36.6
      },
      {
        "id": "home-portfolio",
        "startPct": 36.6,
        "endPct": 50.5
      },
      {
        "id": "home-system",
        "startPct": 50.5,
        "endPct": 63.8
      },
      {
        "id": "home-guide",
        "startPct": 63.8,
        "endPct": 74.6
      },
      {
        "id": "home-langs",
        "startPct": 74.6,
        "endPct": 87.0
      },
      {
        "id": "home-palettes",
        "startPct": 87.0,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.1
      },
      {
        "id": "scr-pulse",
        "startPct": 17.1,
        "endPct": 36.7
      },
      {
        "id": "scr-table",
        "startPct": 36.7,
        "endPct": 54.4
      },
      {
        "id": "scr-orbital",
        "startPct": 54.4,
        "endPct": 66.2
      },
      {
        "id": "scr-heatmap",
        "startPct": 66.2,
        "endPct": 81.2
      },
      {
        "id": "scr-maintools",
        "startPct": 81.2,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 18.4
      },
      {
        "id": "ana-technical",
        "startPct": 18.4,
        "endPct": 33.1
      },
      {
        "id": "ana-compare",
        "startPct": 33.1,
        "endPct": 49.1
      },
      {
        "id": "ana-micro",
        "startPct": 49.1,
        "endPct": 69.7
      },
      {
        "id": "ana-engines",
        "startPct": 69.7,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 25.5
      },
      {
        "id": "res-rag",
        "startPct": 25.5,
        "endPct": 50.6
      },
      {
        "id": "res-factors",
        "startPct": 50.6,
        "endPct": 77.5
      },
      {
        "id": "res-pulse24h",
        "startPct": 77.5,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.5
      },
      {
        "id": "p1-table",
        "startPct": 21.5,
        "endPct": 37.7
      },
      {
        "id": "p1-xray",
        "startPct": 37.7,
        "endPct": 59.6
      },
      {
        "id": "p1-calendar",
        "startPct": 59.6,
        "endPct": 76.3
      },
      {
        "id": "p1-backtest",
        "startPct": 76.3,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.7
      },
      {
        "id": "p2-tornado",
        "startPct": 19.7,
        "endPct": 40.6
      },
      {
        "id": "p2-corr",
        "startPct": 40.6,
        "endPct": 57.5
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.5,
        "endPct": 73.8
      },
      {
        "id": "p2-montecarlo",
        "startPct": 73.8,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 20.6
      },
      {
        "id": "p3-whatif",
        "startPct": 20.6,
        "endPct": 38.5
      },
      {
        "id": "p3-tailhedge",
        "startPct": 38.5,
        "endPct": 58.5
      },
      {
        "id": "p3-committee",
        "startPct": 58.5,
        "endPct": 80.3
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.3,
        "endPct": 100.1
      }
    ]
  },
  "CA": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.7
      },
      {
        "id": "home-header",
        "startPct": 11.7,
        "endPct": 24.7
      },
      {
        "id": "home-markets",
        "startPct": 24.7,
        "endPct": 39.2
      },
      {
        "id": "home-portfolio",
        "startPct": 39.2,
        "endPct": 54.6
      },
      {
        "id": "home-system",
        "startPct": 54.6,
        "endPct": 67.4
      },
      {
        "id": "home-guide",
        "startPct": 67.4,
        "endPct": 76.0
      },
      {
        "id": "home-langs",
        "startPct": 76.0,
        "endPct": 88.2
      },
      {
        "id": "home-palettes",
        "startPct": 88.2,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.3
      },
      {
        "id": "scr-pulse",
        "startPct": 16.3,
        "endPct": 36.0
      },
      {
        "id": "scr-table",
        "startPct": 36.0,
        "endPct": 51.9
      },
      {
        "id": "scr-orbital",
        "startPct": 51.9,
        "endPct": 68.2
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.2,
        "endPct": 81.5
      },
      {
        "id": "scr-maintools",
        "startPct": 81.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.0
      },
      {
        "id": "ana-technical",
        "startPct": 15.0,
        "endPct": 28.7
      },
      {
        "id": "ana-compare",
        "startPct": 28.7,
        "endPct": 45.4
      },
      {
        "id": "ana-micro",
        "startPct": 45.4,
        "endPct": 64.4
      },
      {
        "id": "ana-engines",
        "startPct": 64.4,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 24.9
      },
      {
        "id": "res-rag",
        "startPct": 24.9,
        "endPct": 53.9
      },
      {
        "id": "res-factors",
        "startPct": 53.9,
        "endPct": 76.0
      },
      {
        "id": "res-pulse24h",
        "startPct": 76.0,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.8
      },
      {
        "id": "p1-table",
        "startPct": 20.8,
        "endPct": 40.3
      },
      {
        "id": "p1-xray",
        "startPct": 40.3,
        "endPct": 63.7
      },
      {
        "id": "p1-calendar",
        "startPct": 63.7,
        "endPct": 79.2
      },
      {
        "id": "p1-backtest",
        "startPct": 79.2,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.2
      },
      {
        "id": "p2-tornado",
        "startPct": 18.2,
        "endPct": 38.5
      },
      {
        "id": "p2-corr",
        "startPct": 38.5,
        "endPct": 57.1
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.1,
        "endPct": 77.9
      },
      {
        "id": "p2-montecarlo",
        "startPct": 77.9,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 20.0
      },
      {
        "id": "p3-whatif",
        "startPct": 20.0,
        "endPct": 41.5
      },
      {
        "id": "p3-tailhedge",
        "startPct": 41.5,
        "endPct": 61.8
      },
      {
        "id": "p3-committee",
        "startPct": 61.8,
        "endPct": 82.6
      },
      {
        "id": "p3-walkforward",
        "startPct": 82.6,
        "endPct": 100.1
      }
    ]
  },
  "EU": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.6
      },
      {
        "id": "home-header",
        "startPct": 11.6,
        "endPct": 22.8
      },
      {
        "id": "home-markets",
        "startPct": 22.8,
        "endPct": 36.9
      },
      {
        "id": "home-portfolio",
        "startPct": 36.9,
        "endPct": 52.9
      },
      {
        "id": "home-system",
        "startPct": 52.9,
        "endPct": 64.3
      },
      {
        "id": "home-guide",
        "startPct": 64.3,
        "endPct": 74.1
      },
      {
        "id": "home-langs",
        "startPct": 74.1,
        "endPct": 86.3
      },
      {
        "id": "home-palettes",
        "startPct": 86.3,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 14.9
      },
      {
        "id": "scr-pulse",
        "startPct": 14.9,
        "endPct": 37.2
      },
      {
        "id": "scr-table",
        "startPct": 37.2,
        "endPct": 51.2
      },
      {
        "id": "scr-orbital",
        "startPct": 51.2,
        "endPct": 69.8
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.8,
        "endPct": 80.8
      },
      {
        "id": "scr-maintools",
        "startPct": 80.8,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 13.1
      },
      {
        "id": "ana-technical",
        "startPct": 13.1,
        "endPct": 27.4
      },
      {
        "id": "ana-compare",
        "startPct": 27.4,
        "endPct": 46.2
      },
      {
        "id": "ana-micro",
        "startPct": 46.2,
        "endPct": 70.4
      },
      {
        "id": "ana-engines",
        "startPct": 70.4,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 26.7
      },
      {
        "id": "res-rag",
        "startPct": 26.7,
        "endPct": 54.0
      },
      {
        "id": "res-factors",
        "startPct": 54.0,
        "endPct": 78.1
      },
      {
        "id": "res-pulse24h",
        "startPct": 78.1,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.3
      },
      {
        "id": "p1-table",
        "startPct": 20.3,
        "endPct": 40.1
      },
      {
        "id": "p1-xray",
        "startPct": 40.1,
        "endPct": 58.9
      },
      {
        "id": "p1-calendar",
        "startPct": 58.9,
        "endPct": 78.2
      },
      {
        "id": "p1-backtest",
        "startPct": 78.2,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 16.5
      },
      {
        "id": "p2-tornado",
        "startPct": 16.5,
        "endPct": 37.3
      },
      {
        "id": "p2-corr",
        "startPct": 37.3,
        "endPct": 53.0
      },
      {
        "id": "p2-shock2d",
        "startPct": 53.0,
        "endPct": 78.4
      },
      {
        "id": "p2-montecarlo",
        "startPct": 78.4,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 19.2
      },
      {
        "id": "p3-whatif",
        "startPct": 19.2,
        "endPct": 41.4
      },
      {
        "id": "p3-tailhedge",
        "startPct": 41.4,
        "endPct": 60.9
      },
      {
        "id": "p3-committee",
        "startPct": 60.9,
        "endPct": 81.5
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.5,
        "endPct": 100.1
      }
    ]
  },
  "GL": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.0
      },
      {
        "id": "home-header",
        "startPct": 11.0,
        "endPct": 22.6
      },
      {
        "id": "home-markets",
        "startPct": 22.6,
        "endPct": 37.3
      },
      {
        "id": "home-portfolio",
        "startPct": 37.3,
        "endPct": 52.7
      },
      {
        "id": "home-system",
        "startPct": 52.7,
        "endPct": 66.5
      },
      {
        "id": "home-guide",
        "startPct": 66.5,
        "endPct": 75.7
      },
      {
        "id": "home-langs",
        "startPct": 75.7,
        "endPct": 88.8
      },
      {
        "id": "home-palettes",
        "startPct": 88.8,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 18.8
      },
      {
        "id": "scr-pulse",
        "startPct": 18.8,
        "endPct": 38.4
      },
      {
        "id": "scr-table",
        "startPct": 38.4,
        "endPct": 54.3
      },
      {
        "id": "scr-orbital",
        "startPct": 54.3,
        "endPct": 69.5
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.5,
        "endPct": 83.5
      },
      {
        "id": "scr-maintools",
        "startPct": 83.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.8
      },
      {
        "id": "ana-technical",
        "startPct": 14.8,
        "endPct": 30.5
      },
      {
        "id": "ana-compare",
        "startPct": 30.5,
        "endPct": 48.3
      },
      {
        "id": "ana-micro",
        "startPct": 48.3,
        "endPct": 66.2
      },
      {
        "id": "ana-engines",
        "startPct": 66.2,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 26.1
      },
      {
        "id": "res-rag",
        "startPct": 26.1,
        "endPct": 53.4
      },
      {
        "id": "res-factors",
        "startPct": 53.4,
        "endPct": 76.9
      },
      {
        "id": "res-pulse24h",
        "startPct": 76.9,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.8
      },
      {
        "id": "p1-table",
        "startPct": 20.8,
        "endPct": 40.7
      },
      {
        "id": "p1-xray",
        "startPct": 40.7,
        "endPct": 65.7
      },
      {
        "id": "p1-calendar",
        "startPct": 65.7,
        "endPct": 81.6
      },
      {
        "id": "p1-backtest",
        "startPct": 81.6,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 17.3
      },
      {
        "id": "p2-tornado",
        "startPct": 17.3,
        "endPct": 39.4
      },
      {
        "id": "p2-corr",
        "startPct": 39.4,
        "endPct": 57.0
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.0,
        "endPct": 77.2
      },
      {
        "id": "p2-montecarlo",
        "startPct": 77.2,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.9
      },
      {
        "id": "p3-whatif",
        "startPct": 18.9,
        "endPct": 38.8
      },
      {
        "id": "p3-tailhedge",
        "startPct": 38.8,
        "endPct": 59.8
      },
      {
        "id": "p3-committee",
        "startPct": 59.8,
        "endPct": 80.5
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.5,
        "endPct": 100.1
      }
    ]
  },
  "AR": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.6
      },
      {
        "id": "home-header",
        "startPct": 10.6,
        "endPct": 23.6
      },
      {
        "id": "home-markets",
        "startPct": 23.6,
        "endPct": 39.8
      },
      {
        "id": "home-portfolio",
        "startPct": 39.8,
        "endPct": 54.2
      },
      {
        "id": "home-system",
        "startPct": 54.2,
        "endPct": 65.9
      },
      {
        "id": "home-guide",
        "startPct": 65.9,
        "endPct": 75.3
      },
      {
        "id": "home-langs",
        "startPct": 75.3,
        "endPct": 87.7
      },
      {
        "id": "home-palettes",
        "startPct": 87.7,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.9
      },
      {
        "id": "scr-pulse",
        "startPct": 16.9,
        "endPct": 38.1
      },
      {
        "id": "scr-table",
        "startPct": 38.1,
        "endPct": 51.8
      },
      {
        "id": "scr-orbital",
        "startPct": 51.8,
        "endPct": 67.9
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.9,
        "endPct": 81.7
      },
      {
        "id": "scr-maintools",
        "startPct": 81.7,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.8
      },
      {
        "id": "ana-technical",
        "startPct": 15.8,
        "endPct": 27.2
      },
      {
        "id": "ana-compare",
        "startPct": 27.2,
        "endPct": 45.1
      },
      {
        "id": "ana-micro",
        "startPct": 45.1,
        "endPct": 65.0
      },
      {
        "id": "ana-engines",
        "startPct": 65.0,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 19.6
      },
      {
        "id": "res-rag",
        "startPct": 19.6,
        "endPct": 54.0
      },
      {
        "id": "res-factors",
        "startPct": 54.0,
        "endPct": 76.1
      },
      {
        "id": "res-pulse24h",
        "startPct": 76.1,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 17.4
      },
      {
        "id": "p1-table",
        "startPct": 17.4,
        "endPct": 38.7
      },
      {
        "id": "p1-xray",
        "startPct": 38.7,
        "endPct": 65.0
      },
      {
        "id": "p1-calendar",
        "startPct": 65.0,
        "endPct": 79.7
      },
      {
        "id": "p1-backtest",
        "startPct": 79.7,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 16.6
      },
      {
        "id": "p2-tornado",
        "startPct": 16.6,
        "endPct": 40.2
      },
      {
        "id": "p2-corr",
        "startPct": 40.2,
        "endPct": 55.9
      },
      {
        "id": "p2-shock2d",
        "startPct": 55.9,
        "endPct": 75.9
      },
      {
        "id": "p2-montecarlo",
        "startPct": 75.9,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 19.4
      },
      {
        "id": "p3-whatif",
        "startPct": 19.4,
        "endPct": 38.1
      },
      {
        "id": "p3-tailhedge",
        "startPct": 38.1,
        "endPct": 54.2
      },
      {
        "id": "p3-committee",
        "startPct": 54.2,
        "endPct": 80.4
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.4,
        "endPct": 100.1
      }
    ]
  },
  "HE": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.9
      },
      {
        "id": "home-header",
        "startPct": 10.9,
        "endPct": 22.3
      },
      {
        "id": "home-markets",
        "startPct": 22.3,
        "endPct": 36.9
      },
      {
        "id": "home-portfolio",
        "startPct": 36.9,
        "endPct": 49.8
      },
      {
        "id": "home-system",
        "startPct": 49.8,
        "endPct": 62.4
      },
      {
        "id": "home-guide",
        "startPct": 62.4,
        "endPct": 73.6
      },
      {
        "id": "home-langs",
        "startPct": 73.6,
        "endPct": 87.6
      },
      {
        "id": "home-palettes",
        "startPct": 87.6,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 23.0
      },
      {
        "id": "scr-pulse",
        "startPct": 23.0,
        "endPct": 44.4
      },
      {
        "id": "scr-table",
        "startPct": 44.4,
        "endPct": 61.1
      },
      {
        "id": "scr-orbital",
        "startPct": 61.1,
        "endPct": 76.7
      },
      {
        "id": "scr-heatmap",
        "startPct": 76.7,
        "endPct": 92.8
      },
      {
        "id": "scr-maintools",
        "startPct": 92.8,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 18.3
      },
      {
        "id": "ana-technical",
        "startPct": 18.3,
        "endPct": 35.8
      },
      {
        "id": "ana-compare",
        "startPct": 35.8,
        "endPct": 51.5
      },
      {
        "id": "ana-micro",
        "startPct": 51.5,
        "endPct": 64.4
      },
      {
        "id": "ana-engines",
        "startPct": 64.4,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 22.8
      },
      {
        "id": "res-rag",
        "startPct": 22.8,
        "endPct": 51.1
      },
      {
        "id": "res-factors",
        "startPct": 51.1,
        "endPct": 75.8
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.8,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 23.5
      },
      {
        "id": "p1-table",
        "startPct": 23.5,
        "endPct": 44.5
      },
      {
        "id": "p1-xray",
        "startPct": 44.5,
        "endPct": 68.9
      },
      {
        "id": "p1-calendar",
        "startPct": 68.9,
        "endPct": 84.7
      },
      {
        "id": "p1-backtest",
        "startPct": 84.7,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.0
      },
      {
        "id": "p2-tornado",
        "startPct": 19.0,
        "endPct": 39.5
      },
      {
        "id": "p2-corr",
        "startPct": 39.5,
        "endPct": 54.2
      },
      {
        "id": "p2-shock2d",
        "startPct": 54.2,
        "endPct": 73.5
      },
      {
        "id": "p2-montecarlo",
        "startPct": 73.5,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.4
      },
      {
        "id": "p3-whatif",
        "startPct": 18.4,
        "endPct": 42.6
      },
      {
        "id": "p3-tailhedge",
        "startPct": 42.6,
        "endPct": 61.7
      },
      {
        "id": "p3-committee",
        "startPct": 61.7,
        "endPct": 80.3
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.3,
        "endPct": 100.1
      }
    ]
  },
  "FA": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.2
      },
      {
        "id": "home-header",
        "startPct": 11.2,
        "endPct": 23.8
      },
      {
        "id": "home-markets",
        "startPct": 23.8,
        "endPct": 38.8
      },
      {
        "id": "home-portfolio",
        "startPct": 38.8,
        "endPct": 52.4
      },
      {
        "id": "home-system",
        "startPct": 52.4,
        "endPct": 64.1
      },
      {
        "id": "home-guide",
        "startPct": 64.1,
        "endPct": 75.9
      },
      {
        "id": "home-langs",
        "startPct": 75.9,
        "endPct": 88.4
      },
      {
        "id": "home-palettes",
        "startPct": 88.4,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 14.5
      },
      {
        "id": "scr-pulse",
        "startPct": 14.5,
        "endPct": 34.4
      },
      {
        "id": "scr-table",
        "startPct": 34.4,
        "endPct": 50.0
      },
      {
        "id": "scr-orbital",
        "startPct": 50.0,
        "endPct": 66.4
      },
      {
        "id": "scr-heatmap",
        "startPct": 66.4,
        "endPct": 80.8
      },
      {
        "id": "scr-maintools",
        "startPct": 80.8,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.5
      },
      {
        "id": "ana-technical",
        "startPct": 14.5,
        "endPct": 27.7
      },
      {
        "id": "ana-compare",
        "startPct": 27.7,
        "endPct": 45.0
      },
      {
        "id": "ana-micro",
        "startPct": 45.0,
        "endPct": 65.6
      },
      {
        "id": "ana-engines",
        "startPct": 65.6,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 19.7
      },
      {
        "id": "res-rag",
        "startPct": 19.7,
        "endPct": 45.0
      },
      {
        "id": "res-factors",
        "startPct": 45.0,
        "endPct": 69.3
      },
      {
        "id": "res-pulse24h",
        "startPct": 69.3,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.7
      },
      {
        "id": "p1-table",
        "startPct": 20.7,
        "endPct": 43.1
      },
      {
        "id": "p1-xray",
        "startPct": 43.1,
        "endPct": 63.4
      },
      {
        "id": "p1-calendar",
        "startPct": 63.4,
        "endPct": 78.1
      },
      {
        "id": "p1-backtest",
        "startPct": 78.1,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 21.2
      },
      {
        "id": "p2-tornado",
        "startPct": 21.2,
        "endPct": 42.6
      },
      {
        "id": "p2-corr",
        "startPct": 42.6,
        "endPct": 58.0
      },
      {
        "id": "p2-shock2d",
        "startPct": 58.0,
        "endPct": 78.3
      },
      {
        "id": "p2-montecarlo",
        "startPct": 78.3,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 17.9
      },
      {
        "id": "p3-whatif",
        "startPct": 17.9,
        "endPct": 39.9
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.9,
        "endPct": 62.9
      },
      {
        "id": "p3-committee",
        "startPct": 62.9,
        "endPct": 81.5
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.5,
        "endPct": 100.1
      }
    ]
  },
  "UR": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.3
      },
      {
        "id": "home-header",
        "startPct": 11.3,
        "endPct": 22.9
      },
      {
        "id": "home-markets",
        "startPct": 22.9,
        "endPct": 38.0
      },
      {
        "id": "home-portfolio",
        "startPct": 38.0,
        "endPct": 54.4
      },
      {
        "id": "home-system",
        "startPct": 54.4,
        "endPct": 65.3
      },
      {
        "id": "home-guide",
        "startPct": 65.3,
        "endPct": 76.4
      },
      {
        "id": "home-langs",
        "startPct": 76.4,
        "endPct": 88.3
      },
      {
        "id": "home-palettes",
        "startPct": 88.3,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.2
      },
      {
        "id": "scr-pulse",
        "startPct": 16.2,
        "endPct": 35.2
      },
      {
        "id": "scr-table",
        "startPct": 35.2,
        "endPct": 49.5
      },
      {
        "id": "scr-orbital",
        "startPct": 49.5,
        "endPct": 63.8
      },
      {
        "id": "scr-heatmap",
        "startPct": 63.8,
        "endPct": 77.0
      },
      {
        "id": "scr-maintools",
        "startPct": 77.0,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 16.0
      },
      {
        "id": "ana-technical",
        "startPct": 16.0,
        "endPct": 29.8
      },
      {
        "id": "ana-compare",
        "startPct": 29.8,
        "endPct": 50.7
      },
      {
        "id": "ana-micro",
        "startPct": 50.7,
        "endPct": 69.7
      },
      {
        "id": "ana-engines",
        "startPct": 69.7,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 24.4
      },
      {
        "id": "res-rag",
        "startPct": 24.4,
        "endPct": 54.0
      },
      {
        "id": "res-factors",
        "startPct": 54.0,
        "endPct": 78.5
      },
      {
        "id": "res-pulse24h",
        "startPct": 78.5,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.5
      },
      {
        "id": "p1-table",
        "startPct": 20.5,
        "endPct": 43.7
      },
      {
        "id": "p1-xray",
        "startPct": 43.7,
        "endPct": 65.8
      },
      {
        "id": "p1-calendar",
        "startPct": 65.8,
        "endPct": 82.3
      },
      {
        "id": "p1-backtest",
        "startPct": 82.3,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 17.0
      },
      {
        "id": "p2-tornado",
        "startPct": 17.0,
        "endPct": 36.5
      },
      {
        "id": "p2-corr",
        "startPct": 36.5,
        "endPct": 53.5
      },
      {
        "id": "p2-shock2d",
        "startPct": 53.5,
        "endPct": 76.0
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.0,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 22.3
      },
      {
        "id": "p3-whatif",
        "startPct": 22.3,
        "endPct": 43.7
      },
      {
        "id": "p3-tailhedge",
        "startPct": 43.7,
        "endPct": 67.5
      },
      {
        "id": "p3-committee",
        "startPct": 67.5,
        "endPct": 88.1
      },
      {
        "id": "p3-walkforward",
        "startPct": 88.1,
        "endPct": 100.1
      }
    ]
  },
  "HI": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 12.2
      },
      {
        "id": "home-header",
        "startPct": 12.2,
        "endPct": 24.9
      },
      {
        "id": "home-markets",
        "startPct": 24.9,
        "endPct": 39.0
      },
      {
        "id": "home-portfolio",
        "startPct": 39.0,
        "endPct": 52.3
      },
      {
        "id": "home-system",
        "startPct": 52.3,
        "endPct": 63.8
      },
      {
        "id": "home-guide",
        "startPct": 63.8,
        "endPct": 76.3
      },
      {
        "id": "home-langs",
        "startPct": 76.3,
        "endPct": 89.1
      },
      {
        "id": "home-palettes",
        "startPct": 89.1,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.8
      },
      {
        "id": "scr-pulse",
        "startPct": 16.8,
        "endPct": 35.0
      },
      {
        "id": "scr-table",
        "startPct": 35.0,
        "endPct": 50.8
      },
      {
        "id": "scr-orbital",
        "startPct": 50.8,
        "endPct": 66.7
      },
      {
        "id": "scr-heatmap",
        "startPct": 66.7,
        "endPct": 81.8
      },
      {
        "id": "scr-maintools",
        "startPct": 81.8,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 13.7
      },
      {
        "id": "ana-technical",
        "startPct": 13.7,
        "endPct": 29.7
      },
      {
        "id": "ana-compare",
        "startPct": 29.7,
        "endPct": 46.9
      },
      {
        "id": "ana-micro",
        "startPct": 46.9,
        "endPct": 65.4
      },
      {
        "id": "ana-engines",
        "startPct": 65.4,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.3
      },
      {
        "id": "res-rag",
        "startPct": 23.3,
        "endPct": 50.4
      },
      {
        "id": "res-factors",
        "startPct": 50.4,
        "endPct": 72.4
      },
      {
        "id": "res-pulse24h",
        "startPct": 72.4,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.7
      },
      {
        "id": "p1-table",
        "startPct": 20.7,
        "endPct": 41.0
      },
      {
        "id": "p1-xray",
        "startPct": 41.0,
        "endPct": 61.8
      },
      {
        "id": "p1-calendar",
        "startPct": 61.8,
        "endPct": 77.4
      },
      {
        "id": "p1-backtest",
        "startPct": 77.4,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.8
      },
      {
        "id": "p2-tornado",
        "startPct": 18.8,
        "endPct": 39.8
      },
      {
        "id": "p2-corr",
        "startPct": 39.8,
        "endPct": 57.2
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.2,
        "endPct": 78.5
      },
      {
        "id": "p2-montecarlo",
        "startPct": 78.5,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.1
      },
      {
        "id": "p3-whatif",
        "startPct": 18.1,
        "endPct": 39.4
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.4,
        "endPct": 61.6
      },
      {
        "id": "p3-committee",
        "startPct": 61.6,
        "endPct": 80.4
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.4,
        "endPct": 100.1
      }
    ]
  },
  "BN": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 12.3
      },
      {
        "id": "home-header",
        "startPct": 12.3,
        "endPct": 23.2
      },
      {
        "id": "home-markets",
        "startPct": 23.2,
        "endPct": 39.0
      },
      {
        "id": "home-portfolio",
        "startPct": 39.0,
        "endPct": 52.6
      },
      {
        "id": "home-system",
        "startPct": 52.6,
        "endPct": 64.1
      },
      {
        "id": "home-guide",
        "startPct": 64.1,
        "endPct": 75.4
      },
      {
        "id": "home-langs",
        "startPct": 75.4,
        "endPct": 87.9
      },
      {
        "id": "home-palettes",
        "startPct": 87.9,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.5
      },
      {
        "id": "scr-pulse",
        "startPct": 16.5,
        "endPct": 34.6
      },
      {
        "id": "scr-table",
        "startPct": 34.6,
        "endPct": 50.2
      },
      {
        "id": "scr-orbital",
        "startPct": 50.2,
        "endPct": 67.3
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.3,
        "endPct": 81.3
      },
      {
        "id": "scr-maintools",
        "startPct": 81.3,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.3
      },
      {
        "id": "ana-technical",
        "startPct": 15.3,
        "endPct": 30.6
      },
      {
        "id": "ana-compare",
        "startPct": 30.6,
        "endPct": 49.8
      },
      {
        "id": "ana-micro",
        "startPct": 49.8,
        "endPct": 68.7
      },
      {
        "id": "ana-engines",
        "startPct": 68.7,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 25.2
      },
      {
        "id": "res-rag",
        "startPct": 25.2,
        "endPct": 51.4
      },
      {
        "id": "res-factors",
        "startPct": 51.4,
        "endPct": 75.9
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.9,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.8
      },
      {
        "id": "p1-table",
        "startPct": 22.8,
        "endPct": 43.0
      },
      {
        "id": "p1-xray",
        "startPct": 43.0,
        "endPct": 62.1
      },
      {
        "id": "p1-calendar",
        "startPct": 62.1,
        "endPct": 77.6
      },
      {
        "id": "p1-backtest",
        "startPct": 77.6,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.6
      },
      {
        "id": "p2-tornado",
        "startPct": 19.6,
        "endPct": 40.1
      },
      {
        "id": "p2-corr",
        "startPct": 40.1,
        "endPct": 57.5
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.5,
        "endPct": 76.8
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.8,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.7
      },
      {
        "id": "p3-whatif",
        "startPct": 18.7,
        "endPct": 40.0
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.0,
        "endPct": 62.3
      },
      {
        "id": "p3-committee",
        "startPct": 62.3,
        "endPct": 81.4
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.4,
        "endPct": 100.1
      }
    ]
  },
  "PA": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 13.0
      },
      {
        "id": "home-header",
        "startPct": 13.0,
        "endPct": 26.9
      },
      {
        "id": "home-markets",
        "startPct": 26.9,
        "endPct": 40.0
      },
      {
        "id": "home-portfolio",
        "startPct": 40.0,
        "endPct": 53.2
      },
      {
        "id": "home-system",
        "startPct": 53.2,
        "endPct": 64.1
      },
      {
        "id": "home-guide",
        "startPct": 64.1,
        "endPct": 75.9
      },
      {
        "id": "home-langs",
        "startPct": 75.9,
        "endPct": 89.5
      },
      {
        "id": "home-palettes",
        "startPct": 89.5,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.1
      },
      {
        "id": "scr-pulse",
        "startPct": 17.1,
        "endPct": 35.5
      },
      {
        "id": "scr-table",
        "startPct": 35.5,
        "endPct": 51.3
      },
      {
        "id": "scr-orbital",
        "startPct": 51.3,
        "endPct": 67.1
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.1,
        "endPct": 81.3
      },
      {
        "id": "scr-maintools",
        "startPct": 81.3,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.5
      },
      {
        "id": "ana-technical",
        "startPct": 14.5,
        "endPct": 30.7
      },
      {
        "id": "ana-compare",
        "startPct": 30.7,
        "endPct": 47.4
      },
      {
        "id": "ana-micro",
        "startPct": 47.4,
        "endPct": 67.0
      },
      {
        "id": "ana-engines",
        "startPct": 67.0,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 25.0
      },
      {
        "id": "res-rag",
        "startPct": 25.0,
        "endPct": 50.2
      },
      {
        "id": "res-factors",
        "startPct": 50.2,
        "endPct": 72.7
      },
      {
        "id": "res-pulse24h",
        "startPct": 72.7,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.1
      },
      {
        "id": "p1-table",
        "startPct": 22.1,
        "endPct": 41.3
      },
      {
        "id": "p1-xray",
        "startPct": 41.3,
        "endPct": 62.9
      },
      {
        "id": "p1-calendar",
        "startPct": 62.9,
        "endPct": 78.1
      },
      {
        "id": "p1-backtest",
        "startPct": 78.1,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.1
      },
      {
        "id": "p2-tornado",
        "startPct": 19.1,
        "endPct": 39.8
      },
      {
        "id": "p2-corr",
        "startPct": 39.8,
        "endPct": 54.4
      },
      {
        "id": "p2-shock2d",
        "startPct": 54.4,
        "endPct": 74.7
      },
      {
        "id": "p2-montecarlo",
        "startPct": 74.7,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.8
      },
      {
        "id": "p3-whatif",
        "startPct": 18.8,
        "endPct": 39.7
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.7,
        "endPct": 60.4
      },
      {
        "id": "p3-committee",
        "startPct": 60.4,
        "endPct": 81.2
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.2,
        "endPct": 100.1
      }
    ]
  },
  "TA": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.7
      },
      {
        "id": "home-header",
        "startPct": 10.7,
        "endPct": 22.8
      },
      {
        "id": "home-markets",
        "startPct": 22.8,
        "endPct": 36.2
      },
      {
        "id": "home-portfolio",
        "startPct": 36.2,
        "endPct": 53.0
      },
      {
        "id": "home-system",
        "startPct": 53.0,
        "endPct": 64.5
      },
      {
        "id": "home-guide",
        "startPct": 64.5,
        "endPct": 75.1
      },
      {
        "id": "home-langs",
        "startPct": 75.1,
        "endPct": 88.5
      },
      {
        "id": "home-palettes",
        "startPct": 88.5,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.4
      },
      {
        "id": "scr-pulse",
        "startPct": 16.4,
        "endPct": 36.8
      },
      {
        "id": "scr-table",
        "startPct": 36.8,
        "endPct": 52.1
      },
      {
        "id": "scr-orbital",
        "startPct": 52.1,
        "endPct": 67.5
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.5,
        "endPct": 80.3
      },
      {
        "id": "scr-maintools",
        "startPct": 80.3,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.7
      },
      {
        "id": "ana-technical",
        "startPct": 15.7,
        "endPct": 30.3
      },
      {
        "id": "ana-compare",
        "startPct": 30.3,
        "endPct": 47.3
      },
      {
        "id": "ana-micro",
        "startPct": 47.3,
        "endPct": 65.4
      },
      {
        "id": "ana-engines",
        "startPct": 65.4,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 24.8
      },
      {
        "id": "res-rag",
        "startPct": 24.8,
        "endPct": 52.1
      },
      {
        "id": "res-factors",
        "startPct": 52.1,
        "endPct": 75.3
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.3,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.3
      },
      {
        "id": "p1-table",
        "startPct": 22.3,
        "endPct": 42.3
      },
      {
        "id": "p1-xray",
        "startPct": 42.3,
        "endPct": 63.7
      },
      {
        "id": "p1-calendar",
        "startPct": 63.7,
        "endPct": 78.8
      },
      {
        "id": "p1-backtest",
        "startPct": 78.8,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.7
      },
      {
        "id": "p2-tornado",
        "startPct": 19.7,
        "endPct": 42.1
      },
      {
        "id": "p2-corr",
        "startPct": 42.1,
        "endPct": 57.8
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.8,
        "endPct": 75.7
      },
      {
        "id": "p2-montecarlo",
        "startPct": 75.7,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 20.4
      },
      {
        "id": "p3-whatif",
        "startPct": 20.4,
        "endPct": 40.0
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.0,
        "endPct": 60.5
      },
      {
        "id": "p3-committee",
        "startPct": 60.5,
        "endPct": 81.3
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.3,
        "endPct": 100.1
      }
    ]
  },
  "TE": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.2
      },
      {
        "id": "home-header",
        "startPct": 10.2,
        "endPct": 22.5
      },
      {
        "id": "home-markets",
        "startPct": 22.5,
        "endPct": 37.6
      },
      {
        "id": "home-portfolio",
        "startPct": 37.6,
        "endPct": 50.4
      },
      {
        "id": "home-system",
        "startPct": 50.4,
        "endPct": 62.2
      },
      {
        "id": "home-guide",
        "startPct": 62.2,
        "endPct": 72.9
      },
      {
        "id": "home-langs",
        "startPct": 72.9,
        "endPct": 85.7
      },
      {
        "id": "home-palettes",
        "startPct": 85.7,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.2
      },
      {
        "id": "scr-pulse",
        "startPct": 17.2,
        "endPct": 36.2
      },
      {
        "id": "scr-table",
        "startPct": 36.2,
        "endPct": 52.4
      },
      {
        "id": "scr-orbital",
        "startPct": 52.4,
        "endPct": 67.5
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.5,
        "endPct": 80.8
      },
      {
        "id": "scr-maintools",
        "startPct": 80.8,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 16.2
      },
      {
        "id": "ana-technical",
        "startPct": 16.2,
        "endPct": 32.5
      },
      {
        "id": "ana-compare",
        "startPct": 32.5,
        "endPct": 50.2
      },
      {
        "id": "ana-micro",
        "startPct": 50.2,
        "endPct": 67.6
      },
      {
        "id": "ana-engines",
        "startPct": 67.6,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 21.9
      },
      {
        "id": "res-rag",
        "startPct": 21.9,
        "endPct": 51.3
      },
      {
        "id": "res-factors",
        "startPct": 51.3,
        "endPct": 72.3
      },
      {
        "id": "res-pulse24h",
        "startPct": 72.3,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.1
      },
      {
        "id": "p1-table",
        "startPct": 22.1,
        "endPct": 43.3
      },
      {
        "id": "p1-xray",
        "startPct": 43.3,
        "endPct": 64.3
      },
      {
        "id": "p1-calendar",
        "startPct": 64.3,
        "endPct": 80.7
      },
      {
        "id": "p1-backtest",
        "startPct": 80.7,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.8
      },
      {
        "id": "p2-tornado",
        "startPct": 18.8,
        "endPct": 39.3
      },
      {
        "id": "p2-corr",
        "startPct": 39.3,
        "endPct": 57.1
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.1,
        "endPct": 76.5
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.5,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.0
      },
      {
        "id": "p3-whatif",
        "startPct": 18.0,
        "endPct": 39.1
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.1,
        "endPct": 59.7
      },
      {
        "id": "p3-committee",
        "startPct": 59.7,
        "endPct": 80.6
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.6,
        "endPct": 100.1
      }
    ]
  },
  "MR": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.6
      },
      {
        "id": "home-header",
        "startPct": 11.6,
        "endPct": 23.7
      },
      {
        "id": "home-markets",
        "startPct": 23.7,
        "endPct": 38.3
      },
      {
        "id": "home-portfolio",
        "startPct": 38.3,
        "endPct": 54.2
      },
      {
        "id": "home-system",
        "startPct": 54.2,
        "endPct": 65.1
      },
      {
        "id": "home-guide",
        "startPct": 65.1,
        "endPct": 76.8
      },
      {
        "id": "home-langs",
        "startPct": 76.8,
        "endPct": 89.5
      },
      {
        "id": "home-palettes",
        "startPct": 89.5,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.4
      },
      {
        "id": "scr-pulse",
        "startPct": 16.4,
        "endPct": 34.8
      },
      {
        "id": "scr-table",
        "startPct": 34.8,
        "endPct": 52.3
      },
      {
        "id": "scr-orbital",
        "startPct": 52.3,
        "endPct": 67.1
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.1,
        "endPct": 81.5
      },
      {
        "id": "scr-maintools",
        "startPct": 81.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.9
      },
      {
        "id": "ana-technical",
        "startPct": 14.9,
        "endPct": 31.5
      },
      {
        "id": "ana-compare",
        "startPct": 31.5,
        "endPct": 49.7
      },
      {
        "id": "ana-micro",
        "startPct": 49.7,
        "endPct": 67.9
      },
      {
        "id": "ana-engines",
        "startPct": 67.9,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.9
      },
      {
        "id": "res-rag",
        "startPct": 23.9,
        "endPct": 50.4
      },
      {
        "id": "res-factors",
        "startPct": 50.4,
        "endPct": 75.0
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.0,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.5
      },
      {
        "id": "p1-table",
        "startPct": 21.5,
        "endPct": 42.6
      },
      {
        "id": "p1-xray",
        "startPct": 42.6,
        "endPct": 64.3
      },
      {
        "id": "p1-calendar",
        "startPct": 64.3,
        "endPct": 79.0
      },
      {
        "id": "p1-backtest",
        "startPct": 79.0,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 17.8
      },
      {
        "id": "p2-tornado",
        "startPct": 17.8,
        "endPct": 37.8
      },
      {
        "id": "p2-corr",
        "startPct": 37.8,
        "endPct": 55.0
      },
      {
        "id": "p2-shock2d",
        "startPct": 55.0,
        "endPct": 77.3
      },
      {
        "id": "p2-montecarlo",
        "startPct": 77.3,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 17.2
      },
      {
        "id": "p3-whatif",
        "startPct": 17.2,
        "endPct": 39.3
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.3,
        "endPct": 60.9
      },
      {
        "id": "p3-committee",
        "startPct": 60.9,
        "endPct": 81.0
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.0,
        "endPct": 100.1
      }
    ]
  },
  "GU": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 13.3
      },
      {
        "id": "home-header",
        "startPct": 13.2,
        "endPct": 26.2
      },
      {
        "id": "home-markets",
        "startPct": 26.2,
        "endPct": 41.6
      },
      {
        "id": "home-portfolio",
        "startPct": 41.6,
        "endPct": 51.5
      },
      {
        "id": "home-system",
        "startPct": 51.5,
        "endPct": 64.8
      },
      {
        "id": "home-guide",
        "startPct": 64.8,
        "endPct": 76.9
      },
      {
        "id": "home-langs",
        "startPct": 76.9,
        "endPct": 89.8
      },
      {
        "id": "home-palettes",
        "startPct": 89.8,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 13.8
      },
      {
        "id": "scr-pulse",
        "startPct": 13.7,
        "endPct": 29.0
      },
      {
        "id": "scr-table",
        "startPct": 29.0,
        "endPct": 46.2
      },
      {
        "id": "scr-orbital",
        "startPct": 46.2,
        "endPct": 63.9
      },
      {
        "id": "scr-heatmap",
        "startPct": 63.9,
        "endPct": 80.3
      },
      {
        "id": "scr-maintools",
        "startPct": 80.3,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 17.5
      },
      {
        "id": "ana-technical",
        "startPct": 17.4,
        "endPct": 35.1
      },
      {
        "id": "ana-compare",
        "startPct": 35.1,
        "endPct": 48.1
      },
      {
        "id": "ana-micro",
        "startPct": 48.1,
        "endPct": 66.8
      },
      {
        "id": "ana-engines",
        "startPct": 66.8,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.0
      },
      {
        "id": "res-rag",
        "startPct": 22.9,
        "endPct": 49.4
      },
      {
        "id": "res-factors",
        "startPct": 49.4,
        "endPct": 74.0
      },
      {
        "id": "res-pulse24h",
        "startPct": 74.0,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.3
      },
      {
        "id": "p1-table",
        "startPct": 22.2,
        "endPct": 39.0
      },
      {
        "id": "p1-xray",
        "startPct": 39.0,
        "endPct": 61.1
      },
      {
        "id": "p1-calendar",
        "startPct": 61.1,
        "endPct": 79.3
      },
      {
        "id": "p1-backtest",
        "startPct": 79.3,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.3
      },
      {
        "id": "p2-tornado",
        "startPct": 18.2,
        "endPct": 41.8
      },
      {
        "id": "p2-corr",
        "startPct": 41.8,
        "endPct": 59.5
      },
      {
        "id": "p2-shock2d",
        "startPct": 59.5,
        "endPct": 82.6
      },
      {
        "id": "p2-montecarlo",
        "startPct": 82.6,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.0
      },
      {
        "id": "p3-whatif",
        "startPct": 17.9,
        "endPct": 41.4
      },
      {
        "id": "p3-tailhedge",
        "startPct": 41.4,
        "endPct": 63.4
      },
      {
        "id": "p3-committee",
        "startPct": 63.4,
        "endPct": 80.3
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.3,
        "endPct": 100.1
      }
    ]
  },
  "KN": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 9.9
      },
      {
        "id": "home-header",
        "startPct": 9.9,
        "endPct": 22.4
      },
      {
        "id": "home-markets",
        "startPct": 22.4,
        "endPct": 37.6
      },
      {
        "id": "home-portfolio",
        "startPct": 37.6,
        "endPct": 52.1
      },
      {
        "id": "home-system",
        "startPct": 52.1,
        "endPct": 63.2
      },
      {
        "id": "home-guide",
        "startPct": 63.2,
        "endPct": 73.6
      },
      {
        "id": "home-langs",
        "startPct": 73.6,
        "endPct": 87.0
      },
      {
        "id": "home-palettes",
        "startPct": 87.0,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 15.5
      },
      {
        "id": "scr-pulse",
        "startPct": 15.5,
        "endPct": 34.1
      },
      {
        "id": "scr-table",
        "startPct": 34.1,
        "endPct": 49.7
      },
      {
        "id": "scr-orbital",
        "startPct": 49.7,
        "endPct": 66.9
      },
      {
        "id": "scr-heatmap",
        "startPct": 66.9,
        "endPct": 81.6
      },
      {
        "id": "scr-maintools",
        "startPct": 81.6,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 13.8
      },
      {
        "id": "ana-technical",
        "startPct": 13.8,
        "endPct": 31.4
      },
      {
        "id": "ana-compare",
        "startPct": 31.4,
        "endPct": 49.9
      },
      {
        "id": "ana-micro",
        "startPct": 49.9,
        "endPct": 67.8
      },
      {
        "id": "ana-engines",
        "startPct": 67.8,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 24.1
      },
      {
        "id": "res-rag",
        "startPct": 24.1,
        "endPct": 50.7
      },
      {
        "id": "res-factors",
        "startPct": 50.7,
        "endPct": 73.9
      },
      {
        "id": "res-pulse24h",
        "startPct": 73.9,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.5
      },
      {
        "id": "p1-table",
        "startPct": 21.5,
        "endPct": 44.1
      },
      {
        "id": "p1-xray",
        "startPct": 44.1,
        "endPct": 63.2
      },
      {
        "id": "p1-calendar",
        "startPct": 63.2,
        "endPct": 79.6
      },
      {
        "id": "p1-backtest",
        "startPct": 79.6,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.9
      },
      {
        "id": "p2-tornado",
        "startPct": 18.9,
        "endPct": 38.8
      },
      {
        "id": "p2-corr",
        "startPct": 38.8,
        "endPct": 56.2
      },
      {
        "id": "p2-shock2d",
        "startPct": 56.2,
        "endPct": 77.9
      },
      {
        "id": "p2-montecarlo",
        "startPct": 77.9,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.4
      },
      {
        "id": "p3-whatif",
        "startPct": 18.4,
        "endPct": 40.2
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.2,
        "endPct": 62.4
      },
      {
        "id": "p3-committee",
        "startPct": 62.4,
        "endPct": 80.9
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.9,
        "endPct": 100.1
      }
    ]
  },
  "ML": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.6
      },
      {
        "id": "home-header",
        "startPct": 11.6,
        "endPct": 24.3
      },
      {
        "id": "home-markets",
        "startPct": 24.3,
        "endPct": 41.1
      },
      {
        "id": "home-portfolio",
        "startPct": 41.1,
        "endPct": 53.8
      },
      {
        "id": "home-system",
        "startPct": 53.8,
        "endPct": 64.8
      },
      {
        "id": "home-guide",
        "startPct": 64.8,
        "endPct": 75.3
      },
      {
        "id": "home-langs",
        "startPct": 75.3,
        "endPct": 88.5
      },
      {
        "id": "home-palettes",
        "startPct": 88.5,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 18.4
      },
      {
        "id": "scr-pulse",
        "startPct": 18.4,
        "endPct": 38.6
      },
      {
        "id": "scr-table",
        "startPct": 38.6,
        "endPct": 53.5
      },
      {
        "id": "scr-orbital",
        "startPct": 53.5,
        "endPct": 69.4
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.4,
        "endPct": 82.0
      },
      {
        "id": "scr-maintools",
        "startPct": 82.0,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.1
      },
      {
        "id": "ana-technical",
        "startPct": 14.1,
        "endPct": 29.3
      },
      {
        "id": "ana-compare",
        "startPct": 29.3,
        "endPct": 47.9
      },
      {
        "id": "ana-micro",
        "startPct": 47.9,
        "endPct": 67.7
      },
      {
        "id": "ana-engines",
        "startPct": 67.7,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 20.1
      },
      {
        "id": "res-rag",
        "startPct": 20.1,
        "endPct": 51.0
      },
      {
        "id": "res-factors",
        "startPct": 51.0,
        "endPct": 75.0
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.0,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 24.3
      },
      {
        "id": "p1-table",
        "startPct": 24.3,
        "endPct": 45.2
      },
      {
        "id": "p1-xray",
        "startPct": 45.2,
        "endPct": 63.8
      },
      {
        "id": "p1-calendar",
        "startPct": 63.8,
        "endPct": 79.6
      },
      {
        "id": "p1-backtest",
        "startPct": 79.6,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 20.1
      },
      {
        "id": "p2-tornado",
        "startPct": 20.1,
        "endPct": 41.4
      },
      {
        "id": "p2-corr",
        "startPct": 41.4,
        "endPct": 58.0
      },
      {
        "id": "p2-shock2d",
        "startPct": 58.0,
        "endPct": 76.4
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.4,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 20.1
      },
      {
        "id": "p3-whatif",
        "startPct": 20.1,
        "endPct": 41.5
      },
      {
        "id": "p3-tailhedge",
        "startPct": 41.5,
        "endPct": 61.8
      },
      {
        "id": "p3-committee",
        "startPct": 61.8,
        "endPct": 81.3
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.3,
        "endPct": 100.1
      }
    ]
  },
  "TH": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.8
      },
      {
        "id": "home-header",
        "startPct": 11.8,
        "endPct": 21.4
      },
      {
        "id": "home-markets",
        "startPct": 21.4,
        "endPct": 38.2
      },
      {
        "id": "home-portfolio",
        "startPct": 38.2,
        "endPct": 51.9
      },
      {
        "id": "home-system",
        "startPct": 51.9,
        "endPct": 66.4
      },
      {
        "id": "home-guide",
        "startPct": 66.4,
        "endPct": 76.6
      },
      {
        "id": "home-langs",
        "startPct": 76.6,
        "endPct": 87.4
      },
      {
        "id": "home-palettes",
        "startPct": 87.4,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.1
      },
      {
        "id": "scr-pulse",
        "startPct": 17.1,
        "endPct": 37.0
      },
      {
        "id": "scr-table",
        "startPct": 37.0,
        "endPct": 53.5
      },
      {
        "id": "scr-orbital",
        "startPct": 53.5,
        "endPct": 68.5
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.5,
        "endPct": 84.5
      },
      {
        "id": "scr-maintools",
        "startPct": 84.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.1
      },
      {
        "id": "ana-technical",
        "startPct": 14.1,
        "endPct": 29.1
      },
      {
        "id": "ana-compare",
        "startPct": 29.1,
        "endPct": 45.1
      },
      {
        "id": "ana-micro",
        "startPct": 45.1,
        "endPct": 66.7
      },
      {
        "id": "ana-engines",
        "startPct": 66.7,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.3
      },
      {
        "id": "res-rag",
        "startPct": 23.3,
        "endPct": 56.8
      },
      {
        "id": "res-factors",
        "startPct": 56.8,
        "endPct": 77.1
      },
      {
        "id": "res-pulse24h",
        "startPct": 77.1,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.6
      },
      {
        "id": "p1-table",
        "startPct": 21.6,
        "endPct": 41.8
      },
      {
        "id": "p1-xray",
        "startPct": 41.8,
        "endPct": 61.3
      },
      {
        "id": "p1-calendar",
        "startPct": 61.3,
        "endPct": 78.8
      },
      {
        "id": "p1-backtest",
        "startPct": 78.8,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.2
      },
      {
        "id": "p2-tornado",
        "startPct": 18.2,
        "endPct": 40.9
      },
      {
        "id": "p2-corr",
        "startPct": 40.9,
        "endPct": 57.1
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.1,
        "endPct": 78.1
      },
      {
        "id": "p2-montecarlo",
        "startPct": 78.1,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 20.6
      },
      {
        "id": "p3-whatif",
        "startPct": 20.6,
        "endPct": 40.3
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.3,
        "endPct": 59.3
      },
      {
        "id": "p3-committee",
        "startPct": 59.3,
        "endPct": 80.0
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.0,
        "endPct": 100.1
      }
    ]
  },
  "VI": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 12.7
      },
      {
        "id": "home-header",
        "startPct": 12.7,
        "endPct": 24.2
      },
      {
        "id": "home-markets",
        "startPct": 24.2,
        "endPct": 38.6
      },
      {
        "id": "home-portfolio",
        "startPct": 38.6,
        "endPct": 54.4
      },
      {
        "id": "home-system",
        "startPct": 54.4,
        "endPct": 66.6
      },
      {
        "id": "home-guide",
        "startPct": 66.6,
        "endPct": 77.0
      },
      {
        "id": "home-langs",
        "startPct": 77.0,
        "endPct": 89.1
      },
      {
        "id": "home-palettes",
        "startPct": 89.1,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.8
      },
      {
        "id": "scr-pulse",
        "startPct": 16.8,
        "endPct": 37.9
      },
      {
        "id": "scr-table",
        "startPct": 37.9,
        "endPct": 53.9
      },
      {
        "id": "scr-orbital",
        "startPct": 53.9,
        "endPct": 68.5
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.5,
        "endPct": 82.4
      },
      {
        "id": "scr-maintools",
        "startPct": 82.4,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 14.7
      },
      {
        "id": "ana-technical",
        "startPct": 14.7,
        "endPct": 30.1
      },
      {
        "id": "ana-compare",
        "startPct": 30.1,
        "endPct": 46.4
      },
      {
        "id": "ana-micro",
        "startPct": 46.4,
        "endPct": 66.1
      },
      {
        "id": "ana-engines",
        "startPct": 66.1,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 22.4
      },
      {
        "id": "res-rag",
        "startPct": 22.4,
        "endPct": 50.9
      },
      {
        "id": "res-factors",
        "startPct": 50.9,
        "endPct": 73.1
      },
      {
        "id": "res-pulse24h",
        "startPct": 73.1,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.6
      },
      {
        "id": "p1-table",
        "startPct": 20.6,
        "endPct": 40.8
      },
      {
        "id": "p1-xray",
        "startPct": 40.8,
        "endPct": 62.3
      },
      {
        "id": "p1-calendar",
        "startPct": 62.3,
        "endPct": 77.3
      },
      {
        "id": "p1-backtest",
        "startPct": 77.3,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 17.8
      },
      {
        "id": "p2-tornado",
        "startPct": 17.8,
        "endPct": 41.6
      },
      {
        "id": "p2-corr",
        "startPct": 41.6,
        "endPct": 59.2
      },
      {
        "id": "p2-shock2d",
        "startPct": 59.2,
        "endPct": 78.4
      },
      {
        "id": "p2-montecarlo",
        "startPct": 78.4,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 21.1
      },
      {
        "id": "p3-whatif",
        "startPct": 21.1,
        "endPct": 40.6
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.6,
        "endPct": 60.3
      },
      {
        "id": "p3-committee",
        "startPct": 60.3,
        "endPct": 81.9
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.9,
        "endPct": 100.1
      }
    ]
  },
  "ID": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.3
      },
      {
        "id": "home-header",
        "startPct": 10.3,
        "endPct": 21.3
      },
      {
        "id": "home-markets",
        "startPct": 21.3,
        "endPct": 36.5
      },
      {
        "id": "home-portfolio",
        "startPct": 36.5,
        "endPct": 51.9
      },
      {
        "id": "home-system",
        "startPct": 51.9,
        "endPct": 62.9
      },
      {
        "id": "home-guide",
        "startPct": 62.9,
        "endPct": 75.0
      },
      {
        "id": "home-langs",
        "startPct": 75.0,
        "endPct": 88.0
      },
      {
        "id": "home-palettes",
        "startPct": 88.0,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.3
      },
      {
        "id": "scr-pulse",
        "startPct": 16.3,
        "endPct": 35.8
      },
      {
        "id": "scr-table",
        "startPct": 35.8,
        "endPct": 52.3
      },
      {
        "id": "scr-orbital",
        "startPct": 52.3,
        "endPct": 67.4
      },
      {
        "id": "scr-heatmap",
        "startPct": 67.4,
        "endPct": 80.3
      },
      {
        "id": "scr-maintools",
        "startPct": 80.3,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.3
      },
      {
        "id": "ana-technical",
        "startPct": 15.3,
        "endPct": 30.2
      },
      {
        "id": "ana-compare",
        "startPct": 30.2,
        "endPct": 47.6
      },
      {
        "id": "ana-micro",
        "startPct": 47.6,
        "endPct": 65.9
      },
      {
        "id": "ana-engines",
        "startPct": 65.9,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.2
      },
      {
        "id": "res-rag",
        "startPct": 23.2,
        "endPct": 48.9
      },
      {
        "id": "res-factors",
        "startPct": 48.9,
        "endPct": 73.4
      },
      {
        "id": "res-pulse24h",
        "startPct": 73.4,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.3
      },
      {
        "id": "p1-table",
        "startPct": 22.3,
        "endPct": 44.4
      },
      {
        "id": "p1-xray",
        "startPct": 44.4,
        "endPct": 64.6
      },
      {
        "id": "p1-calendar",
        "startPct": 64.6,
        "endPct": 79.0
      },
      {
        "id": "p1-backtest",
        "startPct": 79.0,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.3
      },
      {
        "id": "p2-tornado",
        "startPct": 18.3,
        "endPct": 39.1
      },
      {
        "id": "p2-corr",
        "startPct": 39.1,
        "endPct": 54.3
      },
      {
        "id": "p2-shock2d",
        "startPct": 54.3,
        "endPct": 73.5
      },
      {
        "id": "p2-montecarlo",
        "startPct": 73.5,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 21.6
      },
      {
        "id": "p3-whatif",
        "startPct": 21.6,
        "endPct": 43.9
      },
      {
        "id": "p3-tailhedge",
        "startPct": 43.9,
        "endPct": 63.0
      },
      {
        "id": "p3-committee",
        "startPct": 63.0,
        "endPct": 81.2
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.2,
        "endPct": 100.1
      }
    ]
  },
  "MS": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.3
      },
      {
        "id": "home-header",
        "startPct": 10.3,
        "endPct": 21.9
      },
      {
        "id": "home-markets",
        "startPct": 21.9,
        "endPct": 37.3
      },
      {
        "id": "home-portfolio",
        "startPct": 37.3,
        "endPct": 51.6
      },
      {
        "id": "home-system",
        "startPct": 51.6,
        "endPct": 64.3
      },
      {
        "id": "home-guide",
        "startPct": 64.3,
        "endPct": 75.5
      },
      {
        "id": "home-langs",
        "startPct": 75.5,
        "endPct": 89.1
      },
      {
        "id": "home-palettes",
        "startPct": 89.1,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 18.2
      },
      {
        "id": "scr-pulse",
        "startPct": 18.2,
        "endPct": 36.3
      },
      {
        "id": "scr-table",
        "startPct": 36.3,
        "endPct": 52.3
      },
      {
        "id": "scr-orbital",
        "startPct": 52.3,
        "endPct": 68.4
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.4,
        "endPct": 82.0
      },
      {
        "id": "scr-maintools",
        "startPct": 82.0,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.6
      },
      {
        "id": "ana-technical",
        "startPct": 15.6,
        "endPct": 30.1
      },
      {
        "id": "ana-compare",
        "startPct": 30.1,
        "endPct": 48.7
      },
      {
        "id": "ana-micro",
        "startPct": 48.7,
        "endPct": 66.8
      },
      {
        "id": "ana-engines",
        "startPct": 66.8,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 24.4
      },
      {
        "id": "res-rag",
        "startPct": 24.4,
        "endPct": 52.2
      },
      {
        "id": "res-factors",
        "startPct": 52.2,
        "endPct": 75.3
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.3,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.3
      },
      {
        "id": "p1-table",
        "startPct": 21.3,
        "endPct": 43.2
      },
      {
        "id": "p1-xray",
        "startPct": 43.2,
        "endPct": 63.5
      },
      {
        "id": "p1-calendar",
        "startPct": 63.5,
        "endPct": 78.5
      },
      {
        "id": "p1-backtest",
        "startPct": 78.5,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 18.0
      },
      {
        "id": "p2-tornado",
        "startPct": 18.0,
        "endPct": 37.9
      },
      {
        "id": "p2-corr",
        "startPct": 37.9,
        "endPct": 54.8
      },
      {
        "id": "p2-shock2d",
        "startPct": 54.8,
        "endPct": 74.3
      },
      {
        "id": "p2-montecarlo",
        "startPct": 74.3,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 19.3
      },
      {
        "id": "p3-whatif",
        "startPct": 19.3,
        "endPct": 40.2
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.2,
        "endPct": 61.0
      },
      {
        "id": "p3-committee",
        "startPct": 61.0,
        "endPct": 80.7
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.7,
        "endPct": 100.1
      }
    ]
  },
  "TL": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 12.1
      },
      {
        "id": "home-header",
        "startPct": 12.1,
        "endPct": 24.6
      },
      {
        "id": "home-markets",
        "startPct": 24.6,
        "endPct": 38.1
      },
      {
        "id": "home-portfolio",
        "startPct": 38.1,
        "endPct": 53.6
      },
      {
        "id": "home-system",
        "startPct": 53.6,
        "endPct": 65.9
      },
      {
        "id": "home-guide",
        "startPct": 65.9,
        "endPct": 75.5
      },
      {
        "id": "home-langs",
        "startPct": 75.5,
        "endPct": 87.5
      },
      {
        "id": "home-palettes",
        "startPct": 87.5,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.3
      },
      {
        "id": "scr-pulse",
        "startPct": 16.3,
        "endPct": 37.0
      },
      {
        "id": "scr-table",
        "startPct": 37.0,
        "endPct": 53.5
      },
      {
        "id": "scr-orbital",
        "startPct": 53.5,
        "endPct": 71.5
      },
      {
        "id": "scr-heatmap",
        "startPct": 71.5,
        "endPct": 83.5
      },
      {
        "id": "scr-maintools",
        "startPct": 83.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.3
      },
      {
        "id": "ana-technical",
        "startPct": 15.3,
        "endPct": 30.3
      },
      {
        "id": "ana-compare",
        "startPct": 30.3,
        "endPct": 45.0
      },
      {
        "id": "ana-micro",
        "startPct": 45.0,
        "endPct": 66.6
      },
      {
        "id": "ana-engines",
        "startPct": 66.6,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 21.0
      },
      {
        "id": "res-rag",
        "startPct": 21.0,
        "endPct": 46.9
      },
      {
        "id": "res-factors",
        "startPct": 46.9,
        "endPct": 71.6
      },
      {
        "id": "res-pulse24h",
        "startPct": 71.6,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.0
      },
      {
        "id": "p1-table",
        "startPct": 20.0,
        "endPct": 37.5
      },
      {
        "id": "p1-xray",
        "startPct": 37.5,
        "endPct": 58.8
      },
      {
        "id": "p1-calendar",
        "startPct": 58.8,
        "endPct": 78.6
      },
      {
        "id": "p1-backtest",
        "startPct": 78.6,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 16.0
      },
      {
        "id": "p2-tornado",
        "startPct": 16.0,
        "endPct": 36.9
      },
      {
        "id": "p2-corr",
        "startPct": 36.9,
        "endPct": 55.7
      },
      {
        "id": "p2-shock2d",
        "startPct": 55.7,
        "endPct": 77.8
      },
      {
        "id": "p2-montecarlo",
        "startPct": 77.8,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.8
      },
      {
        "id": "p3-whatif",
        "startPct": 18.8,
        "endPct": 42.3
      },
      {
        "id": "p3-tailhedge",
        "startPct": 42.3,
        "endPct": 63.8
      },
      {
        "id": "p3-committee",
        "startPct": 63.8,
        "endPct": 82.1
      },
      {
        "id": "p3-walkforward",
        "startPct": 82.1,
        "endPct": 100.1
      }
    ]
  },
  "JA": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.7
      },
      {
        "id": "home-header",
        "startPct": 10.7,
        "endPct": 21.1
      },
      {
        "id": "home-markets",
        "startPct": 21.1,
        "endPct": 35.0
      },
      {
        "id": "home-portfolio",
        "startPct": 35.0,
        "endPct": 49.8
      },
      {
        "id": "home-system",
        "startPct": 49.8,
        "endPct": 61.1
      },
      {
        "id": "home-guide",
        "startPct": 61.1,
        "endPct": 72.7
      },
      {
        "id": "home-langs",
        "startPct": 72.7,
        "endPct": 86.1
      },
      {
        "id": "home-palettes",
        "startPct": 86.1,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 15.9
      },
      {
        "id": "scr-pulse",
        "startPct": 15.9,
        "endPct": 35.5
      },
      {
        "id": "scr-table",
        "startPct": 35.5,
        "endPct": 52.2
      },
      {
        "id": "scr-orbital",
        "startPct": 52.2,
        "endPct": 68.3
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.3,
        "endPct": 81.1
      },
      {
        "id": "scr-maintools",
        "startPct": 81.1,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 16.4
      },
      {
        "id": "ana-technical",
        "startPct": 16.4,
        "endPct": 31.9
      },
      {
        "id": "ana-compare",
        "startPct": 31.9,
        "endPct": 51.0
      },
      {
        "id": "ana-micro",
        "startPct": 51.0,
        "endPct": 69.8
      },
      {
        "id": "ana-engines",
        "startPct": 69.8,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 22.1
      },
      {
        "id": "res-rag",
        "startPct": 22.1,
        "endPct": 50.9
      },
      {
        "id": "res-factors",
        "startPct": 50.9,
        "endPct": 72.3
      },
      {
        "id": "res-pulse24h",
        "startPct": 72.3,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 23.7
      },
      {
        "id": "p1-table",
        "startPct": 23.7,
        "endPct": 44.0
      },
      {
        "id": "p1-xray",
        "startPct": 44.0,
        "endPct": 64.2
      },
      {
        "id": "p1-calendar",
        "startPct": 64.2,
        "endPct": 80.8
      },
      {
        "id": "p1-backtest",
        "startPct": 80.8,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.9
      },
      {
        "id": "p2-tornado",
        "startPct": 19.9,
        "endPct": 40.5
      },
      {
        "id": "p2-corr",
        "startPct": 40.5,
        "endPct": 56.3
      },
      {
        "id": "p2-shock2d",
        "startPct": 56.3,
        "endPct": 74.1
      },
      {
        "id": "p2-montecarlo",
        "startPct": 74.1,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.5
      },
      {
        "id": "p3-whatif",
        "startPct": 18.5,
        "endPct": 38.3
      },
      {
        "id": "p3-tailhedge",
        "startPct": 38.3,
        "endPct": 58.7
      },
      {
        "id": "p3-committee",
        "startPct": 58.7,
        "endPct": 77.7
      },
      {
        "id": "p3-walkforward",
        "startPct": 77.7,
        "endPct": 100.1
      }
    ]
  },
  "KO": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.8
      },
      {
        "id": "home-header",
        "startPct": 10.8,
        "endPct": 23.4
      },
      {
        "id": "home-markets",
        "startPct": 23.4,
        "endPct": 38.9
      },
      {
        "id": "home-portfolio",
        "startPct": 38.9,
        "endPct": 52.0
      },
      {
        "id": "home-system",
        "startPct": 52.0,
        "endPct": 63.6
      },
      {
        "id": "home-guide",
        "startPct": 63.6,
        "endPct": 72.9
      },
      {
        "id": "home-langs",
        "startPct": 72.9,
        "endPct": 87.0
      },
      {
        "id": "home-palettes",
        "startPct": 87.0,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.6
      },
      {
        "id": "scr-pulse",
        "startPct": 16.6,
        "endPct": 35.7
      },
      {
        "id": "scr-table",
        "startPct": 35.7,
        "endPct": 51.1
      },
      {
        "id": "scr-orbital",
        "startPct": 51.1,
        "endPct": 66.9
      },
      {
        "id": "scr-heatmap",
        "startPct": 66.9,
        "endPct": 81.4
      },
      {
        "id": "scr-maintools",
        "startPct": 81.4,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.5
      },
      {
        "id": "ana-technical",
        "startPct": 15.5,
        "endPct": 32.4
      },
      {
        "id": "ana-compare",
        "startPct": 32.4,
        "endPct": 50.8
      },
      {
        "id": "ana-micro",
        "startPct": 50.8,
        "endPct": 70.6
      },
      {
        "id": "ana-engines",
        "startPct": 70.6,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 25.1
      },
      {
        "id": "res-rag",
        "startPct": 25.1,
        "endPct": 50.6
      },
      {
        "id": "res-factors",
        "startPct": 50.6,
        "endPct": 73.7
      },
      {
        "id": "res-pulse24h",
        "startPct": 73.7,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 23.3
      },
      {
        "id": "p1-table",
        "startPct": 23.3,
        "endPct": 43.6
      },
      {
        "id": "p1-xray",
        "startPct": 43.6,
        "endPct": 63.5
      },
      {
        "id": "p1-calendar",
        "startPct": 63.5,
        "endPct": 79.3
      },
      {
        "id": "p1-backtest",
        "startPct": 79.3,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 20.6
      },
      {
        "id": "p2-tornado",
        "startPct": 20.6,
        "endPct": 41.6
      },
      {
        "id": "p2-corr",
        "startPct": 41.6,
        "endPct": 58.7
      },
      {
        "id": "p2-shock2d",
        "startPct": 58.7,
        "endPct": 77.3
      },
      {
        "id": "p2-montecarlo",
        "startPct": 77.3,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 17.3
      },
      {
        "id": "p3-whatif",
        "startPct": 17.3,
        "endPct": 40.0
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.0,
        "endPct": 60.5
      },
      {
        "id": "p3-committee",
        "startPct": 60.5,
        "endPct": 79.8
      },
      {
        "id": "p3-walkforward",
        "startPct": 79.8,
        "endPct": 100.1
      }
    ]
  },
  "ZH": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.4
      },
      {
        "id": "home-header",
        "startPct": 10.4,
        "endPct": 21.1
      },
      {
        "id": "home-markets",
        "startPct": 21.1,
        "endPct": 36.0
      },
      {
        "id": "home-portfolio",
        "startPct": 36.0,
        "endPct": 50.1
      },
      {
        "id": "home-system",
        "startPct": 50.1,
        "endPct": 63.7
      },
      {
        "id": "home-guide",
        "startPct": 63.7,
        "endPct": 74.1
      },
      {
        "id": "home-langs",
        "startPct": 74.1,
        "endPct": 86.5
      },
      {
        "id": "home-palettes",
        "startPct": 86.5,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 15.8
      },
      {
        "id": "scr-pulse",
        "startPct": 15.8,
        "endPct": 35.6
      },
      {
        "id": "scr-table",
        "startPct": 35.6,
        "endPct": 52.9
      },
      {
        "id": "scr-orbital",
        "startPct": 52.9,
        "endPct": 68.7
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.7,
        "endPct": 82.4
      },
      {
        "id": "scr-maintools",
        "startPct": 82.4,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.1
      },
      {
        "id": "ana-technical",
        "startPct": 15.1,
        "endPct": 30.3
      },
      {
        "id": "ana-compare",
        "startPct": 30.3,
        "endPct": 49.0
      },
      {
        "id": "ana-micro",
        "startPct": 49.0,
        "endPct": 67.5
      },
      {
        "id": "ana-engines",
        "startPct": 67.5,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 21.1
      },
      {
        "id": "res-rag",
        "startPct": 21.1,
        "endPct": 49.7
      },
      {
        "id": "res-factors",
        "startPct": 49.7,
        "endPct": 75.3
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.3,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 20.8
      },
      {
        "id": "p1-table",
        "startPct": 20.8,
        "endPct": 43.9
      },
      {
        "id": "p1-xray",
        "startPct": 43.9,
        "endPct": 64.6
      },
      {
        "id": "p1-calendar",
        "startPct": 64.6,
        "endPct": 79.4
      },
      {
        "id": "p1-backtest",
        "startPct": 79.4,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 20.5
      },
      {
        "id": "p2-tornado",
        "startPct": 20.5,
        "endPct": 41.0
      },
      {
        "id": "p2-corr",
        "startPct": 41.0,
        "endPct": 57.5
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.5,
        "endPct": 76.9
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.9,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.6
      },
      {
        "id": "p3-whatif",
        "startPct": 18.6,
        "endPct": 38.4
      },
      {
        "id": "p3-tailhedge",
        "startPct": 38.4,
        "endPct": 60.5
      },
      {
        "id": "p3-committee",
        "startPct": 60.5,
        "endPct": 81.6
      },
      {
        "id": "p3-walkforward",
        "startPct": 81.6,
        "endPct": 100.1
      }
    ]
  },
  "ZH-TW": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.3
      },
      {
        "id": "home-header",
        "startPct": 10.3,
        "endPct": 21.4
      },
      {
        "id": "home-markets",
        "startPct": 21.4,
        "endPct": 35.8
      },
      {
        "id": "home-portfolio",
        "startPct": 35.8,
        "endPct": 50.7
      },
      {
        "id": "home-system",
        "startPct": 50.7,
        "endPct": 63.8
      },
      {
        "id": "home-guide",
        "startPct": 63.8,
        "endPct": 74.3
      },
      {
        "id": "home-langs",
        "startPct": 74.3,
        "endPct": 86.6
      },
      {
        "id": "home-palettes",
        "startPct": 86.6,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 17.1
      },
      {
        "id": "scr-pulse",
        "startPct": 17.1,
        "endPct": 37.1
      },
      {
        "id": "scr-table",
        "startPct": 37.1,
        "endPct": 53.9
      },
      {
        "id": "scr-orbital",
        "startPct": 53.9,
        "endPct": 68.8
      },
      {
        "id": "scr-heatmap",
        "startPct": 68.8,
        "endPct": 82.3
      },
      {
        "id": "scr-maintools",
        "startPct": 82.3,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.3
      },
      {
        "id": "ana-technical",
        "startPct": 15.3,
        "endPct": 30.9
      },
      {
        "id": "ana-compare",
        "startPct": 30.9,
        "endPct": 49.1
      },
      {
        "id": "ana-micro",
        "startPct": 49.1,
        "endPct": 67.3
      },
      {
        "id": "ana-engines",
        "startPct": 67.3,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 20.6
      },
      {
        "id": "res-rag",
        "startPct": 20.6,
        "endPct": 49.6
      },
      {
        "id": "res-factors",
        "startPct": 49.6,
        "endPct": 75.8
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.8,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 21.4
      },
      {
        "id": "p1-table",
        "startPct": 21.4,
        "endPct": 44.0
      },
      {
        "id": "p1-xray",
        "startPct": 44.0,
        "endPct": 64.5
      },
      {
        "id": "p1-calendar",
        "startPct": 64.5,
        "endPct": 79.2
      },
      {
        "id": "p1-backtest",
        "startPct": 79.2,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 19.9
      },
      {
        "id": "p2-tornado",
        "startPct": 19.9,
        "endPct": 40.6
      },
      {
        "id": "p2-corr",
        "startPct": 40.6,
        "endPct": 57.4
      },
      {
        "id": "p2-shock2d",
        "startPct": 57.4,
        "endPct": 76.9
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.9,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.4
      },
      {
        "id": "p3-whatif",
        "startPct": 18.4,
        "endPct": 37.1
      },
      {
        "id": "p3-tailhedge",
        "startPct": 37.1,
        "endPct": 60.0
      },
      {
        "id": "p3-committee",
        "startPct": 60.0,
        "endPct": 82.2
      },
      {
        "id": "p3-walkforward",
        "startPct": 82.2,
        "endPct": 100.1
      }
    ]
  },
  "SW": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 11.2
      },
      {
        "id": "home-header",
        "startPct": 11.2,
        "endPct": 21.7
      },
      {
        "id": "home-markets",
        "startPct": 21.7,
        "endPct": 34.0
      },
      {
        "id": "home-portfolio",
        "startPct": 34.0,
        "endPct": 47.4
      },
      {
        "id": "home-system",
        "startPct": 47.4,
        "endPct": 60.4
      },
      {
        "id": "home-guide",
        "startPct": 60.4,
        "endPct": 74.6
      },
      {
        "id": "home-langs",
        "startPct": 74.6,
        "endPct": 87.8
      },
      {
        "id": "home-palettes",
        "startPct": 87.8,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 16.2
      },
      {
        "id": "scr-pulse",
        "startPct": 16.2,
        "endPct": 41.0
      },
      {
        "id": "scr-table",
        "startPct": 41.0,
        "endPct": 56.6
      },
      {
        "id": "scr-orbital",
        "startPct": 56.6,
        "endPct": 71.0
      },
      {
        "id": "scr-heatmap",
        "startPct": 71.0,
        "endPct": 83.9
      },
      {
        "id": "scr-maintools",
        "startPct": 83.9,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 16.3
      },
      {
        "id": "ana-technical",
        "startPct": 16.3,
        "endPct": 33.2
      },
      {
        "id": "ana-compare",
        "startPct": 33.2,
        "endPct": 50.2
      },
      {
        "id": "ana-micro",
        "startPct": 50.2,
        "endPct": 68.6
      },
      {
        "id": "ana-engines",
        "startPct": 68.6,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 23.5
      },
      {
        "id": "res-rag",
        "startPct": 23.5,
        "endPct": 50.7
      },
      {
        "id": "res-factors",
        "startPct": 50.7,
        "endPct": 75.6
      },
      {
        "id": "res-pulse24h",
        "startPct": 75.6,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 22.4
      },
      {
        "id": "p1-table",
        "startPct": 22.4,
        "endPct": 41.0
      },
      {
        "id": "p1-xray",
        "startPct": 41.0,
        "endPct": 61.3
      },
      {
        "id": "p1-calendar",
        "startPct": 61.3,
        "endPct": 76.1
      },
      {
        "id": "p1-backtest",
        "startPct": 76.1,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 17.0
      },
      {
        "id": "p2-tornado",
        "startPct": 17.0,
        "endPct": 36.7
      },
      {
        "id": "p2-corr",
        "startPct": 36.7,
        "endPct": 53.9
      },
      {
        "id": "p2-shock2d",
        "startPct": 53.9,
        "endPct": 71.5
      },
      {
        "id": "p2-montecarlo",
        "startPct": 71.5,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 20.0
      },
      {
        "id": "p3-whatif",
        "startPct": 20.0,
        "endPct": 39.7
      },
      {
        "id": "p3-tailhedge",
        "startPct": 39.7,
        "endPct": 59.1
      },
      {
        "id": "p3-committee",
        "startPct": 59.1,
        "endPct": 80.5
      },
      {
        "id": "p3-walkforward",
        "startPct": 80.5,
        "endPct": 100.1
      }
    ]
  },
  "AF": {
    "home": [
      {
        "id": "home-canvas",
        "startPct": 0.0,
        "endPct": 10.7
      },
      {
        "id": "home-header",
        "startPct": 10.7,
        "endPct": 23.8
      },
      {
        "id": "home-markets",
        "startPct": 23.8,
        "endPct": 38.0
      },
      {
        "id": "home-portfolio",
        "startPct": 38.0,
        "endPct": 53.5
      },
      {
        "id": "home-system",
        "startPct": 53.5,
        "endPct": 65.1
      },
      {
        "id": "home-guide",
        "startPct": 65.1,
        "endPct": 75.5
      },
      {
        "id": "home-langs",
        "startPct": 75.5,
        "endPct": 88.1
      },
      {
        "id": "home-palettes",
        "startPct": 88.1,
        "endPct": 100.1
      }
    ],
    "mkt-screener": [
      {
        "id": "scr-categories",
        "startPct": 0.0,
        "endPct": 18.2
      },
      {
        "id": "scr-pulse",
        "startPct": 18.2,
        "endPct": 38.1
      },
      {
        "id": "scr-table",
        "startPct": 38.1,
        "endPct": 53.9
      },
      {
        "id": "scr-orbital",
        "startPct": 53.9,
        "endPct": 69.3
      },
      {
        "id": "scr-heatmap",
        "startPct": 69.3,
        "endPct": 82.5
      },
      {
        "id": "scr-maintools",
        "startPct": 82.5,
        "endPct": 100.1
      }
    ],
    "mkt-analytics": [
      {
        "id": "ana-hero",
        "startPct": 0.0,
        "endPct": 15.2
      },
      {
        "id": "ana-technical",
        "startPct": 15.2,
        "endPct": 29.6
      },
      {
        "id": "ana-compare",
        "startPct": 29.6,
        "endPct": 48.5
      },
      {
        "id": "ana-micro",
        "startPct": 48.5,
        "endPct": 65.8
      },
      {
        "id": "ana-engines",
        "startPct": 65.8,
        "endPct": 100.1
      }
    ],
    "mkt-research": [
      {
        "id": "res-hero",
        "startPct": 0.0,
        "endPct": 25.1
      },
      {
        "id": "res-rag",
        "startPct": 25.1,
        "endPct": 51.6
      },
      {
        "id": "res-factors",
        "startPct": 51.6,
        "endPct": 74.1
      },
      {
        "id": "res-pulse24h",
        "startPct": 74.1,
        "endPct": 100.1
      }
    ],
    "port-v1": [
      {
        "id": "p1-pills",
        "startPct": 0.0,
        "endPct": 24.2
      },
      {
        "id": "p1-table",
        "startPct": 24.2,
        "endPct": 42.6
      },
      {
        "id": "p1-xray",
        "startPct": 42.6,
        "endPct": 63.3
      },
      {
        "id": "p1-calendar",
        "startPct": 63.3,
        "endPct": 79.7
      },
      {
        "id": "p1-backtest",
        "startPct": 79.7,
        "endPct": 100.1
      }
    ],
    "port-v2": [
      {
        "id": "p2-markowitz",
        "startPct": 0.0,
        "endPct": 17.9
      },
      {
        "id": "p2-tornado",
        "startPct": 17.9,
        "endPct": 41.4
      },
      {
        "id": "p2-corr",
        "startPct": 41.4,
        "endPct": 60.0
      },
      {
        "id": "p2-shock2d",
        "startPct": 60.0,
        "endPct": 76.3
      },
      {
        "id": "p2-montecarlo",
        "startPct": 76.3,
        "endPct": 100.1
      }
    ],
    "port-v3": [
      {
        "id": "p3-impact",
        "startPct": 0.0,
        "endPct": 18.4
      },
      {
        "id": "p3-whatif",
        "startPct": 18.4,
        "endPct": 40.7
      },
      {
        "id": "p3-tailhedge",
        "startPct": 40.7,
        "endPct": 59.5
      },
      {
        "id": "p3-committee",
        "startPct": 59.5,
        "endPct": 78.0
      },
      {
        "id": "p3-walkforward",
        "startPct": 78.0,
        "endPct": 100.1
      }
    ]
  }
};

export function getGuideVideoLangData(langCode = 'EN') {
    const code = (langCode || 'EN').toUpperCase();
    return GUIDE_VIDEO_I18N[code] || GUIDE_VIDEO_I18N.EN;
}

export function getGuideVideoPageTimings(langCode = 'EN', pageId = 'home') {
    const code = (langCode || 'EN').toUpperCase();
    const langTimings = GUIDE_VIDEO_TIMINGS_BY_LANG[code] || GUIDE_VIDEO_TIMINGS_BY_LANG.EN;
    return langTimings?.[pageId] || GUIDE_VIDEO_TIMINGS_BY_LANG.EN?.[pageId] || [];
}
