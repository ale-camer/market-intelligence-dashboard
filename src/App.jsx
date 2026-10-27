import React, { useState, useEffect } from 'react';
import { Terminal, FileText, Bot } from 'lucide-react';
import { PALETTES, LANGUAGES, I18N } from './data/i18n';
import HeaderBar from './components/HeaderBar';
import FooterBar from './components/FooterBar';
import HomeStage from './components/HomeStage';
import MarketAnomaliesView from './components/MarketAnomaliesView';
import FilingsSentimentView from './components/FilingsSentimentView';
import AgentCommitteeView from './components/AgentCommitteeView';
import ObservabilityView from './components/ObservabilityView';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'observability' ? 'observability' : 'presentation';
  });
  const [previousTab, setPreviousTab] = useState('presentation');
  const [themeIdx, setThemeIdx] = useState(0);
  const [langIdx, setLangIdx] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState('BTC');
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

  const openObservabilityNewWindow = () => {
    const url = `${window.location.origin}${window.location.pathname}?view=observability`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const goBack = () => setActiveTab(previousTab || 'presentation');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme.id);
  }, [currentTheme]);

  const navItems = [
    { id: 'workstation', label: t.navWorkstation, icon: Terminal },
    { id: 'filings', label: t.navFilings, icon: FileText },
    { id: 'consensus', label: t.navConsensus, icon: Bot },
  ];

  const isHome = activeTab === 'presentation';

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <HeaderBar
        activeTab={activeTab}
        navItems={navItems}
        t={t}
        onNavigate={handleNavigate}
        onGoBack={goBack}
      />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: 0,
            padding: isHome ? '0' : '3.8rem 1.75rem 3.2rem 1.75rem',
            overflowY: isHome ? 'hidden' : 'auto',
            backgroundColor: isHome ? '#000000' : 'transparent',
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
              langCode={currentLang.code}
              t={t}
            />
          )}

          {activeTab === 'filings' && (
            <FilingsSentimentView
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
              langCode={currentLang.code}
              t={t}
            />
          )}

          {activeTab === 'consensus' && (
            <AgentCommitteeView
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
              langCode={currentLang.code}
              t={t}
            />
          )}

          {activeTab === 'observability' && (
            <ObservabilityView t={t} onGoBack={goBack} />
          )}
        </main>
      </div>

      <FooterBar
        t={t}
        isSystemHealthy={isSystemHealthy}
        currentLang={currentLang}
        currentTheme={currentTheme}
        onOpenObservability={openObservabilityNewWindow}
        onCycleLang={cycleLang}
        onCycleTheme={cycleTheme}
      />
    </div>
  );
}

