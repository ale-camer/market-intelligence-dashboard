import React, { useState, useEffect } from 'react';
import { Terminal, Bot } from 'lucide-react';
import { PALETTES, LANGUAGES, I18N } from './data/i18n';
import { useViewLocale } from './data/i18n/viewLocaleService';
import HeaderBar from './components/HeaderBar';
import FooterBar from './components/FooterBar';
import HomeStage from './components/HomeStage';
import StarfieldBackground from './components/StarfieldBackground';
import MarketAnomaliesView from './components/MarketAnomaliesView';
import AgentCommitteeView from './components/AgentCommitteeView';
import ObservabilityView from './components/ObservabilityView';
import DevLabView from './components/DevLabView';
import UserGuideView from './components/UserGuideView';
import GlobalAgentDrawer from './components/GlobalAgentDrawer';
import { DEFAULT_WATCHLIST_SYMS } from './services/committeeService';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'markets' || v === 'workstation') return 'workstation';
    if (v === 'portfolio' || v === 'consensus') return 'consensus';
    if (v === 'observability') return 'observability';
    if (v === 'guide') return 'guide';
    if (v === 'dev' || v === 'devlab') return 'devlab';
    if (params.get('asset') || params.get('cat') || params.get('lens')) return 'workstation';
    return 'presentation';
  });
  const [previousTab, setPreviousTab] = useState('presentation');
  const [deepLinkNonce, setDeepLinkNonce] = useState(0);

  const [themeIdx, setThemeIdx] = useState(() => {
    try {
      const saved = window.localStorage.getItem('mid_theme_v1');
      if (saved !== null) {
        const idx = Number(saved);
        if (!Number.isNaN(idx) && idx >= 0 && idx < PALETTES.length) return idx;
      }
    } catch {
      // ignore storage errors
    }
    return 0;
  });

  const [langIdx, setLangIdx] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const lCode = (params.get('lang') || '').toUpperCase();
    const found = LANGUAGES.findIndex((l) => l.code === lCode);
    if (found >= 0) return found;
    try {
      const saved = window.localStorage.getItem('mid_lang_v1');
      if (saved) {
        const savedIdx = LANGUAGES.findIndex((l) => l.code === saved.toUpperCase());
        if (savedIdx >= 0) return savedIdx;
      }
    } catch {
      // ignore storage errors
    }
    return 0;
  });

  const [homeLayoutId, setHomeLayoutId] = useState(() => {
    try {
      const saved = window.localStorage.getItem('mid_home_layout_v1');
      if (saved && ['bento-grid', 'split-stage', 'minimal-hud'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return 'bento-grid';
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('mid_theme_v1', String(themeIdx));
    } catch {
      // ignore storage errors
    }
  }, [themeIdx]);

  useEffect(() => {
    try {
      const code = (LANGUAGES[langIdx] || LANGUAGES[0]).code;
      window.localStorage.setItem('mid_lang_v1', code);
    } catch {
      // ignore storage errors
    }
  }, [langIdx]);

  useEffect(() => {
    try {
      window.localStorage.setItem('mid_home_layout_v1', homeLayoutId);
    } catch {
      // ignore storage errors
    }
  }, [homeLayoutId]);
  const [selectedAsset, setSelectedAsset] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('asset') || 'BTC';
  });
  const [marketsViewMode, setMarketsViewMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'detail' || params.get('lens') || params.get('section')) {
      return 'detail';
    }
    return 'screener';
  });
  const [watchlistSyms, setWatchlistSyms] = useState(() => {
    try {
      const saved = window.localStorage.getItem('mid_watchlist_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_WATCHLIST_SYMS;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('mid_watchlist_v1', JSON.stringify(watchlistSyms));
    } catch {
      // ignore storage errors
    }
  }, [watchlistSyms]);

  const toggleWatchlist = (symOrList, bulkAction = null) => {
    if (!symOrList) return;
    if (Array.isArray(symOrList)) {
      const targetSyms = symOrList.filter(Boolean);
      if (targetSyms.length === 0) return;
      setWatchlistSyms((prev) => {
        if (bulkAction === 'remove') {
          const removeSet = new Set(targetSyms);
          return prev.filter((s) => !removeSet.has(s));
        }
        const existingSet = new Set(prev);
        const toAdd = targetSyms.filter((s) => !existingSet.has(s));
        return [...toAdd, ...prev];
      });
      return;
    }
    setWatchlistSyms((prev) =>
      prev.includes(symOrList) ? prev.filter((s) => s !== symOrList) : [symOrList, ...prev]
    );
  };
  const [devIconId, setDevIconId] = useState('lambda08-h-chiseled-nib');
  const [devBoxStyleId, setDevBoxStyleId] = useState('free-green');
  // Permanent official header design chosen by user: V010 • F01 (MINIMAL & GHOST)
  const [headerVariantId, setHeaderVariantId] = useState('v010');

  const [marketsToolsMode, setMarketsToolsMode] = useState('v4-tab');

  const [mainToolsStyleId, setMainToolsStyleId] = useState('hb-05');

  const [isSystemHealthy] = useState(true);
  const [agentOpen, setAgentOpen] = useState(false);

  const currentTheme = PALETTES[themeIdx];
  const currentLang = LANGUAGES[langIdx] || LANGUAGES[0];
  useViewLocale(currentLang.code);
  const t = I18N[currentLang.code] || I18N.EN;

  const cycleTheme = () => setThemeIdx((prev) => (prev + 1) % PALETTES.length);
  const cycleLang = () => setLangIdx((prev) => (prev + 1) % LANGUAGES.length);

  const isUtilityTab = (tab) => tab === 'observability' || tab === 'devlab' || tab === 'guide';

  const handleNavigate = (tabId) => {
    if (tabId !== activeTab) {
      setPreviousTab(isUtilityTab(activeTab) ? previousTab : activeTab);
    }
    if (tabId === 'workstation') {
      setMarketsViewMode('screener');
    }
    setActiveTab(tabId);
    const viewMap = {
      presentation: '',
      workstation: '?view=markets',
      consensus: '?view=portfolio',
      observability: '?view=observability',
      guide: '?view=guide',
      devlab: '?view=dev',
    };
    const nextSearch = viewMap[tabId] ?? '';
    window.history.replaceState({}, '', `${window.location.pathname}${nextSearch}`);
  };

  const handleOpenAssetInMarkets = (sym) => {
    if (sym) setSelectedAsset(sym);
    setMarketsViewMode('detail');
    setPreviousTab(isUtilityTab(activeTab) ? previousTab : activeTab);
    setActiveTab('workstation');
  };

  // Universal deep-link launcher for HomeStage, UserGuideView, and DevLabView
  const handleLaunchTarget = (target = {}) => {
    const params = new URLSearchParams();
    const targetView = target.view || 'markets';
    params.set('view', targetView);

    if (target.mode) params.set('mode', target.mode);
    if (target.screener) params.set('screener', target.screener);
    if (target.asset) {
      params.set('asset', target.asset);
      setSelectedAsset(target.asset);
    }
    if (target.cat) params.set('cat', target.cat);
    if (target.section) params.set('section', target.section);
    if (target.lens) params.set('lens', target.lens);
    if (target.sub) params.set('sub', target.sub);
    if (target.country) params.set('country', target.country);

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

    if (!isUtilityTab(activeTab)) {
      setPreviousTab(activeTab);
    }
    if (targetView === 'portfolio' || targetView === 'consensus') {
      setActiveTab('consensus');
    } else if (targetView === 'observability') {
      setActiveTab('observability');
    } else if (targetView === 'guide') {
      setActiveTab('guide');
    } else if (targetView === 'dev' || targetView === 'devlab') {
      setActiveTab('devlab');
    } else if (targetView === 'home' || targetView === 'presentation') {
      setActiveTab('presentation');
    } else {
      const nextMode =
        target.mode === 'detail' || target.lens || target.section ? 'detail' : 'screener';
      setMarketsViewMode(nextMode);
      setDeepLinkNonce((n) => n + 1);
      setActiveTab('workstation');
    }
  };

  const goBack = () => {
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setActiveTab(previousTab || 'presentation');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme.id);
  }, [currentTheme]);

  // Top Header Navigation: Markets (Level 1 Screener + Level 2 Analytics | Research) & Portfolio
  const navItems = [
    { id: 'workstation', label: t.navWorkstation, icon: Terminal },
    { id: 'consensus', label: t.navConsensus, icon: Bot },
  ];

  const isHome = activeTab === 'presentation';
  const showAmbientStarfield = !isHome;

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <StarfieldBackground active={showAmbientStarfield} />
      <HeaderBar
        activeTab={activeTab}
        navItems={navItems}
        t={t}
        onNavigate={handleNavigate}
        onGoBack={goBack}
        agentOpen={agentOpen}
        onToggleAgent={() => setAgentOpen((prev) => !prev)}
        devIconId={devIconId}
        devBoxStyleId={devBoxStyleId}
        headerVariantId={headerVariantId}
      />

      <GlobalAgentDrawer
        isOpen={agentOpen}
        onClose={() => setAgentOpen(false)}
        activeTab={activeTab}
        marketsViewMode={marketsViewMode}
        selectedAsset={selectedAsset}
        watchlistSyms={watchlistSyms}
        langCode={currentLang.code}
      />

      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative', zIndex: 5 }}>
        <main
          className={isHome ? undefined : 'app-main-viewport'}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: 0,
            margin: isHome ? '0' : '3.8rem 0 3.2rem 0',
            padding: isHome ? '0' : '0 1.75rem',
            overflowY: isHome ? 'hidden' : 'auto',
            overflowX: 'hidden',
            backgroundColor: isHome ? '#000000' : 'transparent',
          }}
        >
          <HomeStage
            isHome={isHome}
            langCode={currentLang.code}
            navItems={navItems}
            t={t}
            homeLayoutId={homeLayoutId}
            onSelectHomeLayout={setHomeLayoutId}
            onLaunchTarget={handleLaunchTarget}
            onNavigate={handleNavigate}
          />

          {activeTab === 'workstation' && (
            <MarketAnomaliesView
              key={deepLinkNonce}
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
              initialViewMode={marketsViewMode}
              onViewModeChange={setMarketsViewMode}
              watchlistSyms={watchlistSyms}
              onToggleWatchlist={toggleWatchlist}
              marketsToolsMode={marketsToolsMode}
              mainToolsStyleId={mainToolsStyleId}
              onLaunchTarget={handleLaunchTarget}
              langCode={currentLang.code}
              t={t}
            />
          )}

          {activeTab === 'consensus' && (
            <AgentCommitteeView
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
              onNavigate={handleNavigate}
              onOpenAssetInMarkets={handleOpenAssetInMarkets}
              watchlistSyms={watchlistSyms}
              onToggleWatchlist={toggleWatchlist}
              langCode={currentLang.code}
              t={t}
            />
          )}

          {activeTab === 'observability' && (
            <ObservabilityView langCode={currentLang.code} t={t} onGoBack={goBack} />
          )}

          {activeTab === 'guide' && (
            <UserGuideView
              langCode={currentLang.code}
              onGoBack={goBack}
              onLaunchTarget={handleLaunchTarget}
            />
          )}

          {activeTab === 'devlab' && (
            <DevLabView
              langCode={currentLang.code}
              mainToolsStyleId={mainToolsStyleId}
              onSelectMainToolsStyle={setMainToolsStyleId}
              onLaunchTarget={handleLaunchTarget}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>

      <FooterBar
        t={t}
        isSystemHealthy={isSystemHealthy}
        currentLang={currentLang}
        currentTheme={currentTheme}
        activeTab={activeTab}
        onOpenObservability={() => handleNavigate('observability')}
        onToggleGuide={() => handleNavigate('guide')}
        onCycleLang={cycleLang}
        onSelectLang={(idx) => setLangIdx(idx)}
        onCycleTheme={cycleTheme}
        onSelectTheme={(idx) => setThemeIdx(idx)}
      />
    </div>
  );
}

