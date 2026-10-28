import React, { useState, useEffect } from 'react';
import { Terminal, Bot } from 'lucide-react';
import { PALETTES, LANGUAGES, I18N } from './data/i18n';
import HeaderBar from './components/HeaderBar';
import FooterBar from './components/FooterBar';
import HomeStage from './components/HomeStage';
import StarfieldBackground from './components/StarfieldBackground';
import MarketAnomaliesView from './components/MarketAnomaliesView';
import AgentCommitteeView from './components/AgentCommitteeView';
import ObservabilityView from './components/ObservabilityView';
import DevLabView from './components/DevLabView';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'observability') return 'observability';
    if (params.get('view') === 'dev') return 'devlab';
    return 'presentation';
  });
  const [previousTab, setPreviousTab] = useState('presentation');
  const [themeIdx, setThemeIdx] = useState(0);
  const [langIdx, setLangIdx] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [marketsViewMode, setMarketsViewMode] = useState('screener');
  const [devIconId, setDevIconId] = useState('lambda08-h-chiseled-nib');
  const [devBoxStyleId, setDevBoxStyleId] = useState('free-green');
  const [isSystemHealthy] = useState(true);

  const currentTheme = PALETTES[themeIdx];
  const currentLang = LANGUAGES[langIdx];
  const t = I18N[currentLang.code];

  const cycleTheme = () => setThemeIdx((prev) => (prev + 1) % PALETTES.length);
  const cycleLang = () => setLangIdx((prev) => (prev + 1) % LANGUAGES.length);

  const handleNavigate = (tabId) => {
    setPreviousTab(activeTab === 'observability' ? previousTab : activeTab);
    setActiveTab(tabId);
  };

  const handleOpenAssetInMarkets = (sym) => {
    if (sym) setSelectedAsset(sym);
    setMarketsViewMode('detail');
    setPreviousTab(activeTab === 'observability' ? previousTab : activeTab);
    setActiveTab('workstation');
  };

  const openObservabilityNewWindow = () => {
    const url = `${window.location.origin}${window.location.pathname}?view=observability`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const goBack = () => setActiveTab(previousTab || 'presentation');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme.id);
  }, [currentTheme]);

  // Top Header Navigation: Markets (Level 1 Screener + Level 2 Analytics | Research) & Portfolio
  const navItems = [
    { id: 'workstation', label: t.navWorkstation, icon: Terminal },
    { id: 'consensus', label: t.navConsensus, icon: Bot },
  ];

  const isHome = activeTab === 'presentation';
  const showAmbientStarfield = !isHome && activeTab !== 'observability';

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <StarfieldBackground active={showAmbientStarfield} />
      <HeaderBar
        activeTab={activeTab}
        navItems={navItems}
        t={t}
        onNavigate={handleNavigate}
        onGoBack={goBack}
        devIconId={devIconId}
        devBoxStyleId={devBoxStyleId}
      />

      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative', zIndex: 5 }}>
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: 0,
            padding: isHome ? '0' : '3.8rem 1.75rem 3.2rem 1.75rem',
            overflowY: isHome ? 'hidden' : 'auto',
            backgroundColor: isHome ? '#000000' : activeTab === 'observability' ? 'var(--bg-app)' : 'transparent',
          }}
        >
          <HomeStage
            isHome={isHome}
            langCode={currentLang.code}
            navItems={navItems}
            t={t}
          />

          {activeTab === 'workstation' && (
            <MarketAnomaliesView
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
              initialViewMode={marketsViewMode}
              onViewModeChange={setMarketsViewMode}
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
              langCode={currentLang.code}
              t={t}
            />
          )}

          {activeTab === 'observability' && (
            <ObservabilityView t={t} onGoBack={goBack} />
          )}

          {activeTab === 'devlab' && (
            <DevLabView
              selectedIconId={devIconId}
              onSelectIconId={setDevIconId}
              selectedBoxStyleId={devBoxStyleId}
              onSelectBoxStyleId={setDevBoxStyleId}
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
        onOpenObservability={openObservabilityNewWindow}
        onToggleDevLab={() => handleNavigate(activeTab === 'devlab' ? previousTab || 'presentation' : 'devlab')}
        onCycleLang={cycleLang}
        onCycleTheme={cycleTheme}
      />
    </div>
  );
}

