import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, Activity, Cpu, Palette, RefreshCw, 
  Terminal, ShieldCheck, Zap, Globe, Layers, BarChart2, Bell, CheckCircle2, 
  ChevronRight, ChevronDown, ArrowUpRight, Menu, X, ArrowLeft, ExternalLink, Database, Search, Bot, AlertTriangle, FileText
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import WebbDeepFieldCanvas from './components/WebbDeepFieldCanvas';

const PALETTES = [
  { id: 'midnight', name: 'Emerald Terminal', color: '#10b981' },
  { id: 'deep-ocean', name: 'Deep Ocean', color: '#38bdf8' },
  { id: 'cyber-amber', name: 'Amber Gold', color: '#f59e0b' },
];

const LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'ES', name: 'Español' },
];

const I18N = {
  EN: {
    tagline: 'Autonomous Market Intelligence & Systematic Execution',
    heroTag: 'CONTINUOUS QUANTITATIVE ARCHITECTURE',
    heroMainTitle: 'Where quantitative intelligence meets markets',
    heroSubtitle: 'Autonomous streaming pipelines, deep SEC 10-K document intelligence, and systematic multi-agent execution.',
    heroCta: 'Get started for free',
    heroSubCta: 'Institutional Quantitative Suite • Zero latency overhead',
    heroTitlePrefix: 'Look first.',
    heroTitleAccent: 'Then trade with AI.',
    heroDesc: "The world's markets, synthesized through continuous streaming pipelines, deep SEC document intelligence, and multi-agent quantitative models.",
    openTerminal: 'Open Live Terminal',
    inspectArch: 'Architecture Telemetry',
    coreArch: 'Core Architecture',
    coreDesc: 'Geometric Tensor Lattice & Candlestick Vector Field',
    pillar1Title: 'Enterprise Data Lakehouse',
    pillar1Desc: 'Daily batch extractions unified with BigQuery dbt Marts and sub-second streaming event ingestion on Google Cloud.',
    pillar1Sub: 'Automated Data Pipelines & Clean Schemas',
    pillar2Title: 'Statistical & NLP Scoring',
    pillar2Desc: 'Isolation Forest statistical anomaly scoring combined with FinBERT transformers analyzing continuous news feeds.',
    pillar2Sub: 'Real-time Predictive Inference & Scoring',
    pillar3Title: 'Autonomous Committee',
    pillar3Desc: 'Multi-agent society parsing official SEC 10-K filings via pgvector RAG to execute risk-managed algorithmic cycles.',
    pillar3Sub: 'Multi-Agent Consensus & Systematic Ledger',
    secSelector: 'SECURITY SELECTOR',
    searchSecurities: 'Search ticker or asset...',
    searchSecFilings: 'Search 10-K filings (e.g. Risk Factors, Item 7, CAPEX)...',
    searchPipelines: 'Filter system pipelines, databases, and microservices...',
    assetsCount: 'MATCHES',
    streamFeed: 'CONTINUOUS STREAMING FEED',
    executionBook: 'AI EXECUTION BOOK',
    ledgerBal: '$100,000 LEDGER',
    orderFilled: 'ORDER FILLED • BUY BTC',
    orderDesc: 'Systematic Allocation Analyst executed long entry. Low anomaly score (0.24) and positive headline sentiment (+0.81).',
    ragTitle: 'RESEARCH SYNTHESIS • AAPL',
    ragDesc: 'Autonomous Research Agent extracted SEC 10-K RAG Item 7. Hardware margins resilient, services revenue accelerating.',
    volAlert: 'VOLATILITY ALERT • SOL',
    volDesc: 'Statistical Anomaly Model flagged volume dislocation score: 0.659. Position sizing trimmed automatically.',
    observabilityTitle: 'Platform Engineering & Infrastructure Observability',
    observabilityDesc: 'Live service availability, latest ingestion stamps, and dataset metrics across the quantitative pipeline.',
    slaStatus: 'SLA Status: 100% OPERATIONAL',
    backBtn: 'Back to Dashboard',
    footerSuite: 'Autonomous Market Intelligence Suite',
    statusOkTitle: 'All systems are operating normally',
    statusOkDesc: '11 production engines online with 0 incidents detected.',
    statusErrTitle: 'System incident detected',
    statusErrDesc: 'One or more pipeline services report failure or degraded performance.',
    navHome: 'Executive Overview',
    navStudio: 'Hero Studio (Intro)',
    navWorkstation: 'Trading Workstation',
    navAnomaly: 'Anomaly Detection',
    navFilings: 'SEC Intelligence (RAG)',
    navConsensus: 'Multi-Agent Committee',
    navTelemetry: 'System Observability',
  },
  ES: {
    tagline: 'Inteligencia de Mercado Autónoma y Ejecución Sistemática',
    heroTag: 'ARQUITECTURA CUANTITATIVA CONTINUA',
    heroMainTitle: 'Donde la inteligencia cuantitativa domina el mercado',
    heroSubtitle: 'Pipelines de streaming continuo, inteligencia documental SEC 10-K y ejecución sistemática multi-agente.',
    heroCta: 'Get started for free',
    heroSubCta: 'Suite Cuantitativa Institucional • Ejecución sistemática autónoma',
    heroTitlePrefix: 'Mira primero.',
    heroTitleAccent: 'Luego opera con IA.',
    heroDesc: 'Los mercados globales, sintetizados a través de pipelines de streaming continuo, inteligencia de documentos SEC y modelos cuantitativos multi-agente.',
    openTerminal: 'Abrir Terminal en Vivo',
    inspectArch: 'Telemetría de Arquitectura',
    coreArch: 'Arquitectura Central',
    coreDesc: 'Red Tensorial Geométrica y Campo Vectorial de Velas',
    pillar1Title: 'Data Lakehouse Empresarial',
    pillar1Desc: 'Extracciones batch diarias unificadas con Marts dbt en BigQuery e ingesta de eventos por streaming en Google Cloud.',
    pillar1Sub: 'Pipelines Automatizados y Esquemas Limpios',
    pillar2Title: 'Scoring Estadístico y NLP',
    pillar2Desc: 'Scoring estadístico de anomalías con Isolation Forest combinado con transformadores FinBERT sobre noticias en tiempo real.',
    pillar2Sub: 'Inferencia Predictiva y Scoring en Tiempo Real',
    pillar3Title: 'Comité Autónomo',
    pillar3Desc: 'Sociedad multi-agente analizando reportes oficiales SEC 10-K con pgvector RAG para ejecutar ciclos algorítmicos controlados.',
    pillar3Sub: 'Consenso Multi-Agente y Libro Sistemático',
    secSelector: 'SELECTOR DE ACTIVOS',
    searchSecurities: 'Buscar ticker o activo...',
    searchSecFilings: 'Buscar en reportes 10-K (ej. Factores de Riesgo, Item 7)...',
    searchPipelines: 'Filtrar pipelines, bases de datos y microservicios...',
    assetsCount: 'COINCIDENCIAS',
    streamFeed: 'STREAMING EN TIEMPO REAL',
    executionBook: 'LIBRO DE EJECUCIÓN IA',
    ledgerBal: 'BALANCE $100,000',
    orderFilled: 'ORDEN EJECUTADA • COMPRA BTC',
    orderDesc: 'Analista de Asignación Sistemática ejecutó compra. Bajo score de anomalía (0.24) y sentimiento positivo (+0.81).',
    ragTitle: 'SÍNTESIS DE RESEARCH • AAPL',
    ragDesc: 'Agente Autónomo de Research extrajo Item 7 de reporte 10-K. Márgenes de hardware sólidos, ingresos de servicios en aceleración.',
    volAlert: 'ALERTA DE VOLATILIDAD • SOL',
    volDesc: 'Modelo de Anomalías Estadísticas detectó dislocación de volumen: 0.659. Reducción automática de tamaño de posición.',
    observabilityTitle: 'Ingeniería de Plataforma y Observabilidad de Infraestructura',
    observabilityDesc: 'Disponibilidad de servicios en vivo, marcas de tiempo de ingesta y métricas en toda la plataforma.',
    slaStatus: 'Estado de SLA: 100% OPERATIVO',
    backBtn: 'Volver al Dashboard',
    footerSuite: 'Plataforma de Inteligencia Cuantitativa',
    statusOkTitle: 'Todos los sistemas funcionan correctamente',
    statusOkDesc: '11 motores de producción en línea sin incidentes registrados.',
    statusErrTitle: 'Incidente detectado en el sistema',
    statusErrDesc: 'Uno o más pipelines reportan degradación o error de ejecución.',
    navHome: 'Visión Ejecutiva',
    navStudio: 'Hero Studio (Intro)',
    navWorkstation: 'Terminal de Trading',
    navAnomaly: 'Detección de Anomalías',
    navFilings: 'Inteligencia SEC (RAG)',
    navConsensus: 'Comité Multi-Agente',
    navTelemetry: 'Observabilidad del Sistema',
  }
};

const MOCK_SERIES = [
  { time: '09:30', btc: 67800, aapl: 229.5, vol: 120 },
  { time: '11:00', btc: 68150, aapl: 230.8, vol: 180 },
  { time: '12:30', btc: 67950, aapl: 230.1, vol: 95 },
  { time: '14:00', btc: 68420, aapl: 231.9, vol: 240 },
  { time: '15:30', btc: 68500, aapl: 232.5, vol: 310 },
  { time: '16:00', btc: 68620, aapl: 232.8, vol: 280 },
];

const TICKER_ITEMS = [
  { sym: 'BTC/USD', price: '$68,620.00', chg: '+1.85%' },
  { sym: 'ETH/USD', price: '$2,750.40', chg: '+0.92%' },
  { sym: 'SOL/USD', price: '$178.20', chg: '+3.14%' },
  { sym: 'SPY', price: '$580.40', chg: '+0.45%' },
  { sym: 'QQQ', price: '$492.15', chg: '+0.60%' },
  { sym: 'AAPL', price: '$232.80', chg: '+0.32%' },
  { sym: 'NVDA', price: '$141.50', chg: '+2.45%' },
  { sym: 'MSFT', price: '$428.10', chg: '-0.15%' },
  { sym: 'AMZN', price: '$186.40', chg: '+1.10%' },
  { sym: 'GOOGL', price: '$165.70', chg: '+0.75%' },
];

const ASSET_CATALOG = [
  { sym: 'BTC', name: 'Bitcoin', price: '$68,620.00', chg: '+1.85%', cat: 'CRYPTO' },
  { sym: 'ETH', name: 'Ethereum', price: '$2,750.40', chg: '+0.92%', cat: 'CRYPTO' },
  { sym: 'SOL', name: 'Solana', price: '$178.20', chg: '+3.14%', cat: 'CRYPTO' },
  { sym: 'AAPL', name: 'Apple Inc.', price: '$232.80', chg: '+0.32%', cat: 'EQUITY' },
  { sym: 'NVDA', name: 'Nvidia Corp.', price: '$141.50', chg: '+2.45%', cat: 'EQUITY' },
  { sym: 'MSFT', name: 'Microsoft Corp.', price: '$428.10', chg: '-0.15%', cat: 'EQUITY' },
  { sym: 'AMZN', name: 'Amazon.com Inc.', price: '$186.40', chg: '+1.10%', cat: 'EQUITY' },
  { sym: 'GOOGL', name: 'Alphabet Inc.', price: '$165.70', chg: '+0.75%', cat: 'EQUITY' },
  { sym: 'SPY', name: 'S&P 500 ETF', price: '$580.40', chg: '+0.45%', cat: 'INDEX' },
  { sym: 'QQQ', name: 'Invesco QQQ', price: '$492.15', chg: '+0.60%', cat: 'INDEX' },
];

const INFRA_ENGINES = [
  { name: 'Equities Ingestion Pipeline', role: 'Daily Batch Price Bar Engine', arch: 'Cloud Run Job • Neon PostgreSQL', status: 'Healthy', sync: '170 price bars (30 assets)' },
  { name: 'Crypto Analytics Lake', role: 'Real-time & Historic Crypto Feed', arch: 'Cloud Run Job • BigQuery Lake', status: 'Healthy', sync: '40 records (5 assets)' },
  { name: 'Streaming Market Events', role: 'Sub-second Tick Aggregation', arch: 'Cloud Run • Cloud Pub/Sub • Neon', status: 'Live', sync: '1-min synthesized candles' },
  { name: 'Financial Sentiment Engine', role: 'NLP Sentiment Evaluation', arch: 'FinBERT Worker • Low Latency', status: 'Live', sync: 'Real-time headline scoring' },
  { name: 'Market Intelligence Warehouse', role: 'Enterprise dbt Analytics Marts', arch: 'Cloud Run Job • dbt BigQuery Marts', status: 'Healthy', sync: '35 unified assets (28 tests passed)' },
  { name: 'Statistical Anomaly MLOps', role: 'Isolation Forest Inference Service', arch: 'Cloud Run Service • Model Artifacts', status: 'Live', sync: 'Production latency < 45ms' },
  { name: 'SEC Filings Intelligence RAG', role: 'Vector Search & Document QA', arch: 'Cloud Run Service • Neon pgvector', status: 'Live', sync: 'Dense financial embeddings' },
  { name: 'Market Intelligence Dispatcher', role: 'Multi-Source Signal Broker', arch: 'Cloud Run Service • Redis Cache', status: 'Live', sync: 'Real-time alert distribution' },
  { name: 'Autonomous Research Agent', role: 'Deep Equity Valuation & Synthesis', arch: 'Cloud Run Service • Gemini Engine', status: 'Active', sync: 'Multi-step investment thesis' },
  { name: 'Systematic Trading Analyst', role: 'Autonomous Portfolio Allocator', arch: 'Cloud Run Service • Algorithmic Ledger', status: 'Live', sync: '$100,000 cash balance' },
  { name: 'Multi-Agent Consensus Platform', role: 'Committee Strategy Synthesis', arch: 'Cloud Run Service • Multi-Agent', status: 'Live', sync: 'Autonomous consensus engine' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('presentation'); // 'presentation' | 'studio' | 'workstation' | 'anomaly' | 'filings' | 'consensus' | 'observability'
  const [previousTab, setPreviousTab] = useState('presentation');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);
  const [langIdx, setLangIdx] = useState(0); // 0: EN, 1: ES
  const [selectedAsset, setSelectedAsset] = useState('BTC');

  // Search states
  const [assetSearch, setAssetSearch] = useState('');
  const [filingsQuery, setFilingsQuery] = useState('');
  const [pipelineFilter, setPipelineFilter] = useState('');

  // Status tooltip state
  const [isSystemHealthy, setIsSystemHealthy] = useState(true);
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);

  const currentTheme = PALETTES[themeIdx];
  const currentLang = LANGUAGES[langIdx];
  const t = I18N[currentLang.code];

  const cycleTheme = () => {
    setThemeIdx((prev) => (prev + 1) % PALETTES.length);
  };

  const cycleLang = () => {
    setLangIdx((prev) => (prev + 1) % LANGUAGES.length);
  };

  const handleNavigate = (tabId) => {
    setPreviousTab(activeTab === 'observability' ? previousTab : activeTab);
    setActiveTab(tabId);
  };

  const openObservability = () => {
    setPreviousTab(activeTab);
    setActiveTab('observability');
  };

  const goBack = () => {
    setActiveTab(previousTab || 'presentation');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme.id);
  }, [currentTheme]);

  // Filtered lists based on search bars
  const filteredAssets = useMemo(() => {
    if (!assetSearch.trim()) return ASSET_CATALOG;
    const q = assetSearch.toLowerCase();
    return ASSET_CATALOG.filter(a => 
      a.sym.toLowerCase().includes(q) || 
      a.name.toLowerCase().includes(q) || 
      a.cat.toLowerCase().includes(q)
    );
  }, [assetSearch]);

  const filteredPipelines = useMemo(() => {
    if (!pipelineFilter.trim()) return INFRA_ENGINES;
    const q = pipelineFilter.toLowerCase();
    return INFRA_ENGINES.filter(e => 
      e.name.toLowerCase().includes(q) || 
      e.role.toLowerCase().includes(q) || 
      e.arch.toLowerCase().includes(q)
    );
  }, [pipelineFilter]);

  const navItems = [
    { id: 'presentation', label: t.navHome, icon: Activity },
    { id: 'workstation', label: t.navWorkstation, icon: Terminal },
    { id: 'anomaly', label: t.navAnomaly, icon: AlertTriangle },
    { id: 'filings', label: t.navFilings, icon: FileText },
    { id: 'consensus', label: t.navConsensus, icon: Bot },
  ];

  const isHome = activeTab === 'presentation';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* INSTITUTIONAL HEADER */}
      <header style={{
        backgroundColor: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border-light)',
        padding: '0.65rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* BRAND IDENTITY & HOME LINK */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => {
              if (isHome) {
                handleNavigate('workstation');
              } else {
                setSidebarExpanded(!sidebarExpanded);
              }
            }}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-light)',
              color: 'var(--text-main)',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={isHome ? 'Open Trading Workstation' : (sidebarExpanded ? 'Collapse Navigation' : 'Expand Navigation')}
          >
            {!isHome && sidebarExpanded ? <X size={17} strokeWidth={2.2} /> : <Menu size={17} strokeWidth={2.2} />}
          </button>

          <div 
            onClick={() => handleNavigate('presentation')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
            title="Return to Home"
          >
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              backgroundColor: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 800
            }}>
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="serif-heading" style={{ fontSize: '1.12rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-main)', lineHeight: 1.1 }}>
                CAMERLENGO QUANTITATIVE LABS
              </h1>
              <span style={{ fontSize: '0.64rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                {t.tagline}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER TOP MENU (TradingView Style, Active on Home or smoothly visible) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: 'var(--bg-app)',
          padding: '0.2rem',
          borderRadius: '8px',
          border: '1px solid var(--border-light)',
          transition: 'all 0.35s ease',
          opacity: isHome ? 1 : 0.85
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#000' : 'var(--text-muted)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} strokeWidth={2.2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* HEADER RIGHT ACTIONS: LANGUAGE + PALETTE + BACK */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {activeTab === 'observability' && (
            <button
              onClick={goBack}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                color: 'var(--accent)',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={14} strokeWidth={2.2} /> {t.backBtn}
            </button>
          )}

          {/* LANGUAGE SELECTOR ICON BUTTON */}
          <button
            onClick={cycleLang}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-light)',
              color: 'var(--text-main)',
              height: '32px',
              padding: '0 0.65rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontWeight: 700
            }}
            title={`Language: ${currentLang.name} (Click to switch)`}
          >
            <Globe size={15} strokeWidth={2.2} style={{ color: 'var(--text-dim)' }} />
            <span style={{ color: 'var(--accent)', letterSpacing: '0.05em' }}>{currentLang.code}</span>
          </button>

          {/* THEME COLOR PALETTE ICON BUTTON */}
          <button
            onClick={cycleTheme}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-light)',
              color: 'var(--text-main)',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer'
            }}
            title={`Active Palette: ${currentTheme.name}`}
          >
            <Palette size={16} strokeWidth={2.2} color={currentTheme.color} />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: currentTheme.color
            }} />
          </button>
        </div>
      </header>

      {/* INFINITE SMOOTH RUNNING TICKER TAPE */}
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-light)',
        padding: '0.4rem 0',
        fontSize: '0.74rem',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div className="ticker-marquee-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((tItem, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.5rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{tItem.sym}</span>
              <span className="mono-metric" style={{ color: 'var(--accent)', fontWeight: 600 }}>{tItem.price}</span>
              <span style={{ color: tItem.chg.startsWith('+') ? 'var(--accent)' : 'var(--danger)', fontSize: '0.68rem', fontWeight: 600 }}>
                {tItem.chg}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTAINER WITH DYNAMIC SIDEBAR (APPEARS ON SUBVIEWS) */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* COLLAPSIBLE LEFT NAVIGATION BAR */}
        {!isHome && (
          <aside style={{
            width: sidebarExpanded ? '230px' : '58px',
            transition: 'width 0.24s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: 'var(--bg-panel)',
            borderRight: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0,
            zIndex: 40
          }}>
            {/* PRIMARY NAVIGATION ITEMS */}
            <div style={{ padding: '0.75rem 0.4rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: sidebarExpanded ? '0.6rem 0.85rem' : '0.6rem 0',
                      justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                      borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                    title={item.label}
                  >
                    <Icon size={17} strokeWidth={2.2} style={{ flexShrink: 0 }} />
                    {sidebarExpanded && (
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* SIDEBAR FOOTER OBSERVABILITY SHORTCUT */}
            <div style={{ padding: '0.75rem 0.4rem', borderTop: '1px solid var(--border-light)' }}>
              <button
                onClick={openObservability}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: sidebarExpanded ? '0.6rem 0.85rem' : '0.6rem 0',
                  justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeTab === 'observability' ? 'var(--accent-light)' : 'transparent',
                  color: activeTab === 'observability' ? 'var(--accent)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                title={t.navTelemetry}
              >
                <Cpu size={17} strokeWidth={2.2} style={{ flexShrink: 0 }} />
                {sidebarExpanded && (
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.navTelemetry}</span>
                )}
              </button>
            </div>
          </aside>
        )}

        {/* CONTENT VIEWPORT */}
        <main style={{ flex: 1, padding: isHome ? '0' : '1.25rem 1.75rem', overflowY: 'auto', backgroundColor: isHome ? '#000000' : 'transparent' }}>
          {/* VIEW 1: EXECUTIVE OVERVIEW (TRADINGVIEW FULL-BLEED HORIZON HERO STYLE) */}
          {activeTab === 'presentation' && (
            <div style={{ backgroundColor: '#000000', width: '100%' }}>
              {/* FULL-SCREEN TRADINGVIEW HERO STAGE */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: 'calc(100vh - 102px)',
                minHeight: '640px',
                backgroundColor: '#000000',
                overflow: 'hidden'
              }}>
                {/* Continuous WebGL JWST Horizon & Quantitative Matter Metamorphosis */}
                <WebbDeepFieldCanvas />

                {/* Minimalist Centered TradingView Typography & CTA Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '9%',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  padding: '0 1.5rem',
                  zIndex: 10,
                  pointerEvents: 'none'
                }}>
                  <h2 style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(2.5rem, 4.6vw, 4.1rem)',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.08,
                    letterSpacing: '-0.03em',
                    maxWidth: '960px',
                    margin: '0 auto'
                  }}>
                    {t.heroMainTitle}
                  </h2>

                  <p style={{
                    fontSize: 'clamp(1rem, 1.35vw, 1.22rem)',
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginTop: '1.15rem',
                    maxWidth: '720px',
                    margin: '1.15rem auto 0 auto',
                    lineHeight: 1.5,
                    fontWeight: 400
                  }}>
                    {t.heroSubtitle}
                  </p>

                  {/* TradingView-style White Button with Diagonal Right Edge */}
                  <div style={{ marginTop: '2.1rem', pointerEvents: 'auto', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button
                      onClick={() => handleNavigate('workstation')}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        border: 'none',
                        padding: '0.95rem 2.4rem 0.95rem 2.1rem',
                        borderRadius: '10px',
                        clipPath: 'polygon(0 0, 100% 0, 93% 100%, 0% 100%)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        fontFamily: 'var(--font-sans)',
                        cursor: 'pointer',
                        transition: 'transform 0.18s ease, background-color 0.18s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1.0)';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                    >
                      {t.heroCta}
                    </button>

                    <span style={{
                      fontSize: '0.74rem',
                      color: 'rgba(255, 255, 255, 0.45)',
                      marginTop: '0.65rem',
                      letterSpacing: '0.01em'
                    }}>
                      {t.heroSubCta}
                    </span>
                  </div>
                </div>

                {/* Subtle Bottom Center Chevron (TradingView Scroll Indicator) */}
                <button
                  onClick={() => {
                    const el = document.getElementById('institutional-pillars');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '1.1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.65)',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    zIndex: 10
                  }}
                  title="Scroll to Architecture Pillars"
                >
                  <ChevronDown size={22} strokeWidth={1.8} />
                </button>
              </div>

              {/* THREE CORE PILLARS BELOW THE FOLD */}
              <div id="institutional-pillars" style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.75rem 2.5rem 1.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <div className="terminal-card" style={{ padding: '1.75rem 1.5rem' }}>
                    <span className="mono-metric" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>FOUNDATION</span>
                    <h3 className="serif-heading" style={{ fontSize: '1.25rem', marginTop: '0.5rem', color: 'var(--text-main)' }}>
                      {t.pillar1Title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.65rem', lineHeight: 1.6 }}>
                      {t.pillar1Desc}
                    </p>
                    <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {t.pillar1Sub}
                    </div>
                  </div>

                  <div className="terminal-card" style={{ padding: '1.75rem 1.5rem' }}>
                    <span className="mono-metric" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>INTELLIGENCE</span>
                    <h3 className="serif-heading" style={{ fontSize: '1.25rem', marginTop: '0.5rem', color: 'var(--text-main)' }}>
                      {t.pillar2Title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.65rem', lineHeight: 1.6 }}>
                      {t.pillar2Desc}
                    </p>
                    <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {t.pillar2Sub}
                    </div>
                  </div>

                  <div className="terminal-card" style={{ padding: '1.75rem 1.5rem' }}>
                    <span className="mono-metric" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>EXECUTION</span>
                    <h3 className="serif-heading" style={{ fontSize: '1.25rem', marginTop: '0.5rem', color: 'var(--text-main)' }}>
                      {t.pillar3Title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.65rem', lineHeight: 1.6 }}>
                      {t.pillar3Desc}
                    </p>
                    <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {t.pillar3Sub}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: DENSE HIGH-TECH MULTI-PANEL BLOOMBERG TERMINAL WITH SEARCH */}
          {activeTab === 'workstation' && (
            <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr 340px', gap: '0.75rem', height: 'calc(100vh - 160px)' }}>
              {/* LEFT: ASSET WATCHLIST WITH INTEGRATED SEARCH */}
              <div className="terminal-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono-metric" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-main)' }}>{t.secSelector}</span>
                  <span className="mono-metric" style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 600 }}>
                    {filteredAssets.length} {t.assetsCount}
                  </span>
                </div>

                {/* SEARCH INPUT BAR */}
                <div style={{ padding: '0.5rem 0.65rem', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-panel)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-light)'
                  }}>
                    <Search size={14} strokeWidth={2.2} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder={t.searchSecurities}
                      value={assetSearch}
                      onChange={(e) => setAssetSearch(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.74rem',
                        outline: 'none',
                        width: '100%',
                        fontFamily: 'var(--font-sans)'
                      }}
                    />
                    {assetSearch && (
                      <button 
                        onClick={() => setAssetSearch('')} 
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {filteredAssets.map((item) => (
                    <div
                      key={item.sym}
                      onClick={() => setSelectedAsset(item.sym)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderBottom: '1px solid var(--border-light)',
                        backgroundColor: selectedAsset === item.sym ? 'var(--bg-subtle)' : 'transparent',
                        cursor: 'pointer',
                        borderLeft: selectedAsset === item.sym ? '3px solid var(--accent)' : '3px solid transparent'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="mono-metric" style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-main)' }}>{item.sym}</span>
                        <span className="mono-metric" style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)' }}>{item.price}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem', fontSize: '0.68rem' }}>
                        <span style={{ color: 'var(--text-dim)' }}>{item.name}</span>
                        <span style={{ color: item.chg.startsWith('+') ? 'var(--accent)' : 'var(--danger)', fontWeight: 600 }}>{item.chg}</span>
                      </div>
                    </div>
                  ))}
                  {filteredAssets.length === 0 && (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                      No assets matching "{assetSearch}"
                    </div>
                  )}
                </div>
              </div>

              {/* CENTER: HIGH-TECH CHARTING & DEPTH */}
              <div className="terminal-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="mono-metric" style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{selectedAsset}/USD</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{t.streamFeed}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {['1M', '5M', '1H', '1D'].map((tf, i) => (
                      <span key={tf} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '3px', backgroundColor: i === 1 ? 'var(--accent)' : 'transparent', color: i === 1 ? '#000' : 'var(--text-dim)', fontWeight: 600 }}>
                        {tf}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1, padding: '1rem 0.5rem 0 0' }}>
                  <ResponsiveContainer width="100%" height="70%">
                    <AreaChart data={MOCK_SERIES}>
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={11} tickLine={false} />
                      <YAxis domain={['auto', 'auto']} stroke="var(--text-dim)" fontSize={11} orientation="right" tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)', fontSize: '0.75rem' }} />
                      <Area type="monotone" dataKey="btc" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#chartGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div style={{ height: '28%', borderTop: '1px solid var(--border-light)', padding: '0.5rem 0 0 0' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MOCK_SERIES}>
                        <Bar dataKey="vol" fill="var(--text-dim)" opacity={0.6} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* RIGHT: LIVE AI EXECUTION LEDGER */}
              <div className="terminal-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="mono-metric" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)' }}>{t.executionBook}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{t.ledgerBal}</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: '4px', borderLeft: '3px solid var(--accent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{t.orderFilled}</span>
                      <span className="mono-metric" style={{ color: 'var(--text-dim)' }}>16:04:12</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      {t.orderDesc}
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: '4px', borderLeft: '3px solid #38bdf8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{t.ragTitle}</span>
                      <span className="mono-metric" style={{ color: 'var(--text-dim)' }}>15:42:00</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      {t.ragDesc}
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: '4px', borderLeft: '3px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{t.volAlert}</span>
                      <span className="mono-metric" style={{ color: 'var(--text-dim)' }}>14:18:22</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      {t.volDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: ANOMALY DETECTION ENGINE */}
          {activeTab === 'anomaly' && (
            <div className="terminal-card" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '6px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                  <AlertTriangle size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="serif-heading" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Statistical Anomaly Detection Service
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Isolation Forest inference scanning intraday volume, spread shocks, and statistical dislocations.
                  </p>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                <span className="mono-metric" style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700 }}>
                  PRODUCTION ENDPOINT CONNECTIVITY READY
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                  This interactive view connects to the Cloud Run Anomaly scoring engine. Submissions of feature vectors evaluate anomaly scores in real time against serialized production model artifacts.
                </p>
              </div>
            </div>
          )}

          {/* VIEW 4: SEC DOCUMENT INTELLIGENCE (RAG) WITH NATURAL LANGUAGE SEARCH */}
          {activeTab === 'filings' && (
            <div className="terminal-card" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '6px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                  <FileText size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="serif-heading" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    SEC Filings Document Intelligence (RAG)
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Dense pgvector similarity search extracting Management Discussion & Analysis (Item 7) and risk factors from official 10-K filings.
                  </p>
                </div>
              </div>

              {/* RAG SEARCH BAR */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                marginBottom: '1.5rem'
              }}>
                <Search size={18} strokeWidth={2.2} style={{ color: 'var(--accent)' }} />
                <input 
                  type="text"
                  placeholder={t.searchSecFilings}
                  value={filingsQuery}
                  onChange={(e) => setFilingsQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)'
                  }}
                />
                <button
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#000',
                    border: 'none',
                    padding: '0.45rem 1rem',
                    borderRadius: '5px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Retrieve
                </button>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                <span className="mono-metric" style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700 }}>
                  VECTOR SEARCH ENGINE PREPARED
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                  Directly interrogates SEC filings with natural language queries. Results are retrieved via vector distance and synthesized by financial reasoning models.
                </p>
              </div>
            </div>
          )}

          {/* VIEW 5: MULTI-AGENT COMMITTEE */}
          {activeTab === 'consensus' && (
            <div className="terminal-card" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '6px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                  <Bot size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="serif-heading" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Multi-Agent Consensus Platform
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Autonomous committee deliberating macroeconomic signals, market volatility, and risk exposure.
                  </p>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                <span className="mono-metric" style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700 }}>
                  COMMITTEE DELIBERATION PROTOCOL
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                  Multi-agent debate rounds combine technical, fundamental, and risk perspectives into an unhedged strategic verdict.
                </p>
              </div>
            </div>
          )}

          {/* VIEW 6: SYSTEM OBSERVABILITY WITH FILTER BAR */}
          {activeTab === 'observability' && (
            <div>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <button
                      onClick={goBack}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      <ArrowLeft size={14} strokeWidth={2.2} /> {t.backBtn}
                    </button>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>•</span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Architecture Overview</span>
                  </div>
                  <h2 className="serif-heading" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {t.observabilityTitle}
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {t.observabilityDesc}
                  </p>
                </div>

                {/* OBSERVABILITY FILTER BAR */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'var(--bg-panel)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  minWidth: '260px'
                }}>
                  <Search size={14} strokeWidth={2.2} style={{ color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    placeholder={t.searchPipelines}
                    value={pipelineFilter}
                    onChange={(e) => setPipelineFilter(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      fontSize: '0.76rem',
                      outline: 'none',
                      width: '100%',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                  {pipelineFilter && (
                    <button 
                      onClick={() => setPipelineFilter('')}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {filteredPipelines.map((eng, idx) => (
                  <div key={idx} className="terminal-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="mono-metric" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '3px' }}>
                        {eng.status.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={13} strokeWidth={2.2} /> OK
                      </span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>{eng.name}</h3>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{eng.arch}</span>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.65rem', borderRadius: '4px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Role:</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{eng.role}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Metric:</span>
                        <span className="mono-metric" style={{ color: 'var(--accent)', fontWeight: 600 }}>{eng.sync}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* INSTITUTIONAL FOOTER WITH EMOJI STATUS & HOVER POPOVER */}
      <footer style={{
        backgroundColor: 'var(--bg-panel)',
        borderTop: '1px solid var(--border-light)',
        padding: '0.6rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--text-dim)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>© 2026 CAMERLENGO QUANTITATIVE LABS</span>
          <span>•</span>
          <span style={{ color: 'var(--text-muted)' }}>{t.footerSuite}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={openObservability}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-light)',
              color: activeTab === 'observability' ? 'var(--accent)' : 'var(--text-muted)',
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
          >
            <Cpu size={13} strokeWidth={2.2} /> {t.navTelemetry}
          </button>

          {/* STATUS EMOJI BADGE WITH HOVER POPUP WINDOW */}
          <div 
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
            onMouseEnter={() => setShowStatusTooltip(true)}
            onMouseLeave={() => setShowStatusTooltip(false)}
          >
            <div
              style={{
                cursor: 'pointer',
                fontSize: '1.05rem',
                lineHeight: 1,
                padding: '0.15rem 0.35rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSystemHealthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: isSystemHealthy ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)'
              }}
              title="System Health Indicator"
            >
              {isSystemHealthy ? '🟢' : '🔴'}
            </div>

            {/* HOVER POPOVER WINDOW */}
            {showStatusTooltip && (
              <div style={{
                position: 'absolute',
                bottom: '140%',
                right: 0,
                backgroundColor: 'var(--bg-panel)',
                border: isSystemHealthy ? '1px solid #10b981' : '1px solid #ef4444',
                boxShadow: isSystemHealthy 
                  ? '0 10px 25px -5px rgba(16, 185, 129, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.6)' 
                  : '0 10px 25px -5px rgba(239, 68, 68, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                minWidth: '260px',
                zIndex: 100,
                pointerEvents: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1rem' }}>{isSystemHealthy ? '🟢' : '🔴'}</span>
                  <span style={{ 
                    fontWeight: 700, 
                    fontSize: '0.76rem', 
                    color: isSystemHealthy ? '#10b981' : '#ef4444' 
                  }}>
                    {isSystemHealthy ? t.statusOkTitle : t.statusErrTitle}
                  </span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
                  {isSystemHealthy ? t.statusOkDesc : t.statusErrDesc}
                </p>
                <div style={{ 
                  marginTop: '0.5rem', 
                  paddingTop: '0.4rem', 
                  borderTop: '1px solid var(--border-light)', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '0.65rem',
                  color: 'var(--text-dim)'
                }}>
                  <span>SLA</span>
                  <span className="mono-metric" style={{ color: isSystemHealthy ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                    {isSystemHealthy ? '99.98% OK' : 'DEGRADED'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
