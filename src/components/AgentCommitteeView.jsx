import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  RotateCcw,
  X,
  Sliders,
  ListChecks,
} from 'lucide-react';
import {
  INITIAL_PORTFOLIO_UNIVERSE,
  INITIAL_LEDGER_EVENTS,
  getCommitteeDeliberation,
  runLiveCommitteeCycle,
} from '../services/committeeService';

export default function AgentCommitteeView({
  selectedAsset = 'NVDA',
  onSelectAsset,
  onNavigate,
  onOpenAssetInMarkets,
  langCode = 'EN',
}) {
  const isES = langCode === 'ES';

  // Full 10-asset interactive portfolio state
  const [universe, setUniverse] = useState(INITIAL_PORTFOLIO_UNIVERSE);
  const [baseCapital] = useState(106420);
  const [committeeResult, setCommitteeResult] = useState(() =>
    getCommitteeDeliberation(selectedAsset)
  );
  const [ledgerEvents, setLedgerEvents] = useState(INITIAL_LEDGER_EVENTS);
  const [isRunningCycle, setIsRunningCycle] = useState(false);

  // Two-tier asset filter & keyboard search state
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'HELD' | 'WATCHLIST'
  const [classFilter, setClassFilter] = useState('ALL'); // 'ALL' | 'EQUITY' | 'CRYPTO' | 'INDEX'
  const [searchQuery, setSearchQuery] = useState('');
  const [kbIndex, setKbIndex] = useState(0);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Progressive disclosure states (Collapsed by default so nothing clutters vision!)
  const [expandedAsset, setExpandedAsset] = useState(null);
  const [rightPanelTab, setRightPanelTab] = useState('committee'); // 'committee' | 'log'
  const [expandedPillar, setExpandedPillar] = useState(null); // 0 | 1 | 2 | null
  const [expandedLogId, setExpandedLogId] = useState(null); // log id | null

  useEffect(() => {
    setCommitteeResult(getCommitteeDeliberation(selectedAsset));
  }, [selectedAsset]);

  // Compute Portfolio Aggregates dynamically from universe holdings
  const portfolioSummary = useMemo(() => {
    const activeHoldings = universe.filter((h) => h.marketValue > 0);
    const watchlistCount = universe.length - activeHoldings.length;
    const investedValue = activeHoldings.reduce((acc, h) => acc + h.marketValue, 0);
    const cashBalance = Math.max(0, baseCapital - investedValue);
    const totalNav = investedValue + cashBalance;
    const totalPnlUsd = activeHoldings.reduce((acc, h) => acc + h.pnlUsd, 0);
    const totalCostBasis = Math.max(1, investedValue - totalPnlUsd);
    const totalPnlPct = (totalPnlUsd / totalCostBasis) * 100;
    const investedPct = (investedValue / totalNav) * 100;
    const cashPct = (cashBalance / totalNav) * 100;

    const weightedResearch =
      investedValue > 0
        ? Math.round(
            activeHoldings.reduce(
              (acc, h) => acc + h.researchScore * (h.marketValue / investedValue),
              0
            )
          )
        : 0;

    const activeBreakers = activeHoldings.filter((h) => h.anomalyScore >= 0.65).length;

    return {
      activeHoldings,
      watchlistCount,
      totalNav,
      investedValue,
      investedPct,
      cashBalance,
      cashPct,
      totalPnlUsd,
      totalPnlPct,
      weightedResearch,
      activeBreakers,
    };
  }, [universe, baseCapital]);

  // Filtered asset list combining Row 1 (statusFilter) + Row 2 (classFilter) + Search
  const filteredAssets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return universe.filter((item) => {
      if (statusFilter === 'HELD' && item.marketValue <= 0) return false;
      if (statusFilter === 'WATCHLIST' && item.marketValue > 0) return false;
      if (classFilter !== 'ALL' && item.cat !== classFilter) return false;
      if (!q) return true;
      return (
        item.sym.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.cat.toLowerCase().includes(q)
      );
    });
  }, [universe, statusFilter, classFilter, searchQuery]);

  // Adjust position weight interactively in the sandbox (respecting 20% NAV cap & available cash)
  const adjustAssetAllocation = (sym, deltaUsd, explicitTargetPct = null) => {
    const nowStamp = new Date().toTimeString().slice(0, 8);
    setUniverse((prev) => {
      const currentTotalInvested = prev.reduce((acc, x) => acc + x.marketValue, 0);
      const maxSingleAssetUsd = Math.round(baseCapital * 0.2); // 20% Max Cap Guardrail

      return prev.map((item) => {
        if (item.sym !== sym) return item;
        const otherInvested = currentTotalInvested - item.marketValue;
        const maxAvailableUsd = Math.max(0, baseCapital - otherInvested);

        let nextValue =
          explicitTargetPct !== null
            ? Math.round((explicitTargetPct / 100) * baseCapital)
            : item.marketValue + deltaUsd;

        // Enforce 0 floor, 20% single-asset cap, and available cash ceiling
        nextValue = Math.max(0, Math.min(nextValue, maxSingleAssetUsd, maxAvailableUsd));

        // If SOL or high anomaly (>0.65), cap at 5% NAV ($5,320) via Risk Guardrail
        if (item.anomalyScore >= 0.65) {
          nextValue = Math.min(nextValue, Math.round(baseCapital * 0.05));
        }

        const weightPct = ((nextValue / baseCapital) * 100).toFixed(1);
        const estPnlRatio = item.avgEntry > 0 ? (item.currentPrice - item.avgEntry) / item.avgEntry : 0;
        const nextPnlUsd = nextValue > 0 ? Math.round(nextValue * estPnlRatio) : 0;
        const nextPnlPct = nextValue > 0 ? Number((estPnlRatio * 100).toFixed(2)) : 0;

        // Log the sandbox simulation event
        const simEvent = {
          id: `sim-${sym}-${Date.now()}`,
          sym,
          action: nextValue > item.marketValue ? 'SIMULATE BUY' : nextValue === 0 ? 'CLOSE POSITION' : 'SIMULATE TRIM',
          status: 'SANDBOX REBALANCE',
          time: nowStamp,
          allocText: `${weightPct}% NAV ($${nextValue.toLocaleString()})`,
          isPositive: nextPnlUsd >= 0 && item.anomalyScore < 0.65,
          title: {
            EN:
              nextValue === 0
                ? `POSITION CLOSED • ${sym} → 0.0% NAV`
                : `PORTFOLIO REBALANCED • ${sym} → ${weightPct}% NAV ($${nextValue.toLocaleString()})`,
            ES:
              nextValue === 0
                ? `POSICIÓN CERRADA • ${sym} → 0.0% NAV`
                : `REBALANCEO SIMULADO • ${sym} → ${weightPct}% NAV ($${nextValue.toLocaleString()})`,
          },
          desc: {
            EN:
              item.anomalyScore >= 0.65
                ? `Risk Guardrail active on ${sym} (Anomaly ${item.anomalyScore} > 0.65): maximum exposure restricted to 5.0% NAV. Correlated hedge suggestion: ${item.proxyCorr}.`
                : `Updated ${sym} allocation to $${nextValue.toLocaleString()} (${weightPct}% of portfolio). Correlated derivative/proxy reference: ${item.proxyCorr}.`,
            ES:
              item.anomalyScore >= 0.65
                ? `Guardrail de riesgo activo en ${sym} (Anomalía ${item.anomalyScore} > 0.65): exposición máxima restringida a 5.0% NAV. Cobertura correlacionada: ${item.proxyCorr}.`
                : `Asignación de ${sym} ajustada a $${nextValue.toLocaleString()} (${weightPct}% de la cartera). Referencia de derivado/correlación: ${item.proxyCorr}.`,
          },
        };
        setLedgerEvents((logs) => [simEvent, ...logs.slice(0, 9)]);

        return {
          ...item,
          marketValue: nextValue,
          pnlUsd: nextPnlUsd,
          pnlPct: nextPnlPct,
          status:
            nextValue === 0
              ? 'WATCHLIST (0%)'
              : item.anomalyScore >= 0.65
              ? 'GUARDRAIL CAPPED'
              : Number(weightPct) >= 15
              ? 'CORE OVERWEIGHT'
              : 'ACTIVE LONG',
        };
      });
    });
  };

  const handleRunLiveCycle = async (targetSym = selectedAsset) => {
    setIsRunningCycle(true);
    try {
      const live = await runLiveCommitteeCycle(targetSym);
      setCommitteeResult(live);
      if (live.newLedgerEvent) {
        setLedgerEvents((prev) => [live.newLedgerEvent, ...prev.slice(0, 9)]);
      }
      if (typeof live.targetWeightPct === 'number') {
        adjustAssetAllocation(targetSym, 0, live.targetWeightPct);
      }
    } catch {
      setCommitteeResult(getCommitteeDeliberation(targetSym));
    } finally {
      setIsRunningCycle(false);
    }
  };

  // Navigate directly to Level 2 of the selected ticker in Markets
  const jumpToAssetLevel2 = (sym) => {
    if (onOpenAssetInMarkets) {
      onOpenAssetInMarkets(sym);
    } else if (onNavigate) {
      if (onSelectAsset) onSelectAsset(sym);
      onNavigate('workstation');
    }
  };

  const verdictPositive = committeeResult.isPositive !== false;
  const verdictColor = verdictPositive ? '#10b981' : '#f43f5e';

  // Build SVG Donut segments for the Portfolio Proportions ring
  const donutSegments = useMemo(() => {
    const r = 38;
    const c = 2 * Math.PI * r;
    let cumulativePct = 0;

    const slices = portfolioSummary.activeHoldings.map((h, idx) => {
      const pct = (h.marketValue / portfolioSummary.totalNav) * 100;
      const dash = (pct / 100) * c;
      const offset = -((cumulativePct / 100) * c);
      cumulativePct += pct;
      // Distinct green shades for healthy holdings, rose red for guardrail/negative holdings
      const greenShades = ['#10b981', '#059669', '#34d399', '#047857', '#6ee7b7', '#10b981'];
      const color = h.isPositive ? greenShades[idx % greenShades.length] : '#f43f5e';
      return {
        sym: h.sym,
        name: h.name,
        marketValue: h.marketValue,
        pct,
        dash: Math.max(0, dash - 1.5),
        c,
        offset,
        color,
        isPositive: h.isPositive,
      };
    });

    // Cash slice
    if (portfolioSummary.cashPct > 0.5) {
      const dash = (portfolioSummary.cashPct / 100) * c;
      const offset = -((cumulativePct / 100) * c);
      slices.push({
        sym: 'CASH',
        name: isES ? 'Liquidez Disponible' : 'Liquid Cash',
        marketValue: portfolioSummary.cashBalance,
        pct: portfolioSummary.cashPct,
        dash: Math.max(0, dash - 1.5),
        c,
        offset,
        color: 'rgba(255, 255, 255, 0.22)',
        isPositive: true,
      });
    }

    return slices;
  }, [portfolioSummary, isES]);

  const activeDonutFocus = useMemo(() => {
    const targetSym = hoveredSlice || selectedAsset;
    const found = donutSegments.find((s) => s.sym === targetSym);
    if (found) return found;
    return {
      sym: isES ? 'INVERTIDO' : 'INVESTED',
      pct: portfolioSummary.investedPct,
      marketValue: portfolioSummary.investedValue,
      color: '#10b981',
    };
  }, [hoveredSlice, selectedAsset, donutSegments, portfolioSummary, isES]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.95rem',
        height: 'calc(100vh - 118px)',
        minHeight: 0,
      }}
    >
      {/* 1. TOP HERO CARD: INTERACTIVE DONUT RING + PORTFOLIO TELEMETRY + TALL PROPORTIONAL ALLOCATION TILES */}
      <div
        style={{
          borderRadius: '22px',
          backgroundColor: 'var(--bg-panel-glass)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.15rem 1.45rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.45rem',
          }}
        >
          {/* Left: Interactive SVG Donut Chart (Larger 110x110) + Total NAV */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.3rem' }}>
            {/* Interactive Donut Ring */}
            <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
              <svg width="110" height="110" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="10.5"
                />
                {donutSegments.map((seg) => {
                  const isFocused = (hoveredSlice || selectedAsset) === seg.sym;
                  return (
                    <circle
                      key={seg.sym}
                      cx="48"
                      cy="48"
                      r="38"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={isFocused ? '13' : '10'}
                      strokeDasharray={`${seg.dash} ${seg.c}`}
                      strokeDashoffset={seg.offset}
                      style={{
                        cursor: seg.sym !== 'CASH' ? 'pointer' : 'default',
                        opacity: hoveredSlice && hoveredSlice !== seg.sym ? 0.45 : 1,
                        transition: 'all 0.25s ease',
                      }}
                      onMouseEnter={() => setHoveredSlice(seg.sym)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      onClick={() => {
                        if (seg.sym !== 'CASH' && onSelectAsset) {
                          onSelectAsset(seg.sym);
                          setExpandedAsset(seg.sym);
                        }
                      }}
                    />
                  );
                })}
              </svg>
              {/* Donut Center Readout */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <span className="mono-metric" style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                  {activeDonutFocus.sym}
                </span>
                <span className="mono-metric" style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeDonutFocus.pct.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Portfolio Total NAV & Return */}
            <div>
              <div className="mono-metric" style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.04em' }}>
                {isES ? 'VALOR TOTAL DE LA CARTERA (SIMULADOR $100K)' : 'TOTAL PORTFOLIO VALUE ($100K SANDBOX)'}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', marginTop: '0.15rem' }}>
                <span className="mono-metric" style={{ fontSize: '2.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
                  ${portfolioSummary.totalNav.toLocaleString('en-US')}
                </span>
                <span
                  className="mono-metric"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: portfolioSummary.totalPnlUsd >= 0 ? '#10b981' : '#f43f5e',
                  }}
                >
                  {portfolioSummary.totalPnlUsd >= 0 ? '+' : ''}${portfolioSummary.totalPnlUsd.toLocaleString('en-US')} (
                  {portfolioSummary.totalPnlPct >= 0 ? '+' : ''}
                  {portfolioSummary.totalPnlPct.toFixed(2)}%)
                </span>
              </div>
              <div className="mono-metric" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.28rem' }}>
                {isES ? 'Invertido:' : 'Invested:'}{' '}
                <strong style={{ color: '#10b981' }}>
                  ${portfolioSummary.investedValue.toLocaleString('en-US')} ({portfolioSummary.investedPct.toFixed(1)}%)
                </strong>{' '}
                • {isES ? 'Liquidez (Cash):' : 'Liquid Cash:'}{' '}
                <strong style={{ color: '#ffffff' }}>
                  ${portfolioSummary.cashBalance.toLocaleString('en-US')} ({portfolioSummary.cashPct.toFixed(1)}%)
                </strong>
              </div>
            </div>
          </div>

          {/* Right: Tall Visual Proportional Allocation Cards (Treemap Strip) */}
          <div style={{ flex: 1, minWidth: '360px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono-metric" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 800 }}>
                {isES
                  ? 'PROPORCIONES DE LA CARTERA (CLIC EN UN BLOQUE PARA INSPECCIONAR)'
                  : 'PORTFOLIO PROPORTIONS (CLICK ANY BLOCK TO INSPECT)'}
              </span>
              <span className="mono-metric" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                {isES ? 'Tope Máx: 20% / Activo' : 'Max Cap: 20% / Asset'} •{' '}
                <strong style={{ color: portfolioSummary.weightedResearch >= 0 ? '#10b981' : '#f43f5e' }}>
                  Research {portfolioSummary.weightedResearch >= 0 ? `+${portfolioSummary.weightedResearch}` : portfolioSummary.weightedResearch}
                </strong>
              </span>
            </div>

            {/* Proportional Interactive Tiles (Taller 68px height showing Ticker + % + $ Value) */}
            <div
              style={{
                display: 'flex',
                height: '68px',
                borderRadius: '14px',
                overflow: 'hidden',
                gap: '4px',
                backgroundColor: 'rgba(8, 12, 22, 0.65)',
                padding: '4px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {portfolioSummary.activeHoldings.map((h) => {
                const weight = (h.marketValue / portfolioSummary.totalNav) * 100;
                const isSelected = selectedAsset === h.sym;
                return (
                  <button
                    key={h.sym}
                    type="button"
                    onMouseEnter={() => setHoveredSlice(h.sym)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => {
                      onSelectAsset && onSelectAsset(h.sym);
                      setExpandedAsset((prev) => (prev === h.sym ? null : h.sym));
                    }}
                    style={{
                      flex: `${Math.max(weight, 5)} 1 0%`,
                      borderRadius: '10px',
                      border: isSelected
                        ? `1.5px solid ${h.isPositive ? '#10b981' : '#f43f5e'}`
                        : '1px solid rgba(255,255,255,0.08)',
                      backgroundColor: h.isPositive
                        ? isSelected
                          ? 'rgba(16, 185, 129, 0.28)'
                          : 'rgba(16, 185, 129, 0.14)'
                        : isSelected
                        ? 'rgba(244, 63, 94, 0.3)'
                        : 'rgba(244, 63, 94, 0.16)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.12rem',
                      cursor: 'pointer',
                      padding: '0 0.3rem',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span className="mono-metric" style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff' }}>
                      {h.sym}
                    </span>
                    <span
                      className="mono-metric"
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        color: h.isPositive ? '#10b981' : '#f43f5e',
                      }}
                    >
                      {weight.toFixed(1)}%
                    </span>
                    <span className="mono-metric" style={{ fontSize: '0.52rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      ${(h.marketValue / 1000).toFixed(1)}k
                    </span>
                  </button>
                );
              })}

              {/* Cash Block */}
              {portfolioSummary.cashPct > 1 && (
                <div
                  onMouseEnter={() => setHoveredSlice('CASH')}
                  onMouseLeave={() => setHoveredSlice(null)}
                  style={{
                    flex: `${Math.max(portfolioSummary.cashPct, 6.5)} 1 0%`,
                    borderRadius: '10px',
                    border: '1px dashed rgba(255,255,255,0.18)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.12rem',
                    padding: '0 0.35rem',
                    overflow: 'hidden',
                  }}
                >
                  <span className="mono-metric" style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                    CASH
                  </span>
                  <span className="mono-metric" style={{ fontSize: '0.62rem', fontWeight: 800, color: '#ffffff' }}>
                    {portfolioSummary.cashPct.toFixed(1)}%
                  </span>
                  <span className="mono-metric" style={{ fontSize: '0.52rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    ${(portfolioSummary.cashBalance / 1000).toFixed(1)}k
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: LEFT = ASSET UNIVERSE & SANDBOX (COLLAPSED BY DEFAULT), RIGHT = FOCUSED COMMITTEE OR LOG */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1.22fr 1fr',
          gap: '1.1rem',
        }}
      >
        {/* LEFT COLUMN: UNIFIED ASSET SELECTOR & POSITION SIMULATOR (CLICK TO EXPAND ONLY 1 AT A TIME) */}
        <div
          style={{
            borderRadius: '22px',
            backgroundColor: 'var(--bg-panel-glass)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.9rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.58rem',
            minHeight: 0,
          }}
        >
          {/* Row 1: Search Input + Primary Portfolio Status Filter (All | In Portfolio | Watchlist with counts) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            {/* Search Input with Keyboard Navigation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(8, 12, 22, 0.78)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '999px',
                padding: '0.28rem 0.75rem',
                minWidth: '215px',
                flex: '1 1 215px',
                maxWidth: '280px',
              }}
            >
              <Search size={13} style={{ color: '#10b981' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setKbIndex(0);
                }}
                onKeyDown={(e) => {
                  if (!filteredAssets.length) return;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = (kbIndex + 1) % filteredAssets.length;
                    setKbIndex(next);
                    onSelectAsset && onSelectAsset(filteredAssets[next].sym);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = (kbIndex - 1 + filteredAssets.length) % filteredAssets.length;
                    setKbIndex(prev);
                    onSelectAsset && onSelectAsset(filteredAssets[prev].sym);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const chosen = filteredAssets[kbIndex] || filteredAssets[0];
                    if (chosen) {
                      onSelectAsset && onSelectAsset(chosen.sym);
                      setExpandedAsset((cur) => (cur === chosen.sym ? null : chosen.sym));
                    }
                  } else if (e.key === 'Escape') {
                    setSearchQuery('');
                    setExpandedAsset(null);
                  }
                }}
                placeholder={isES ? 'Buscar activo (↑/↓/Enter)...' : 'Search asset (↑/↓/Enter)...'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  width: '100%',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter Row 1: Portfolio Status (All | In Portfolio | Watchlist with counts) */}
            <div style={{ display: 'flex', gap: '0.32rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: isES ? `Todos (${universe.length})` : `All (${universe.length})` },
                {
                  id: 'HELD',
                  label: isES
                    ? `En Cartera (${portfolioSummary.activeHoldings.length})`
                    : `In Portfolio (${portfolioSummary.activeHoldings.length})`,
                },
                {
                  id: 'WATCHLIST',
                  label: isES
                    ? `Watchlist (${portfolioSummary.watchlistCount})`
                    : `Watchlist (${portfolioSummary.watchlistCount})`,
                },
              ].map((tab) => {
                const active = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className="mono-metric"
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '0.24rem 0.68rem',
                      borderRadius: '999px',
                      border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.04)',
                      color: active ? '#10b981' : 'var(--text-dim)',
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Row 2: Asset Class Filter (Right below the first 3 filters) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              paddingBottom: '0.35rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <span className="mono-metric" style={{ fontSize: '0.56rem', color: 'var(--text-dim)', fontWeight: 700 }}>
              {isES ? 'FILTRAR POR TIPO DE ACTIVO:' : 'FILTER BY ASSET CLASS:'}
            </span>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: isES ? 'Todas las Clases' : 'All Classes' },
                { id: 'EQUITY', label: isES ? 'Acciones (5)' : 'Equities (5)' },
                { id: 'CRYPTO', label: 'Crypto (3)' },
                { id: 'INDEX', label: isES ? 'Índices (2)' : 'Indices (2)' },
              ].map((cls) => {
                const active = classFilter === cls.id;
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setClassFilter(cls.id)}
                    className="mono-metric"
                    style={{
                      fontSize: '0.56rem',
                      fontWeight: 700,
                      padding: '0.16rem 0.56rem',
                      borderRadius: '999px',
                      border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                      backgroundColor: active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
                      color: active ? '#10b981' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {cls.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Helper Hint */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.64rem', color: 'var(--text-dim)' }}>
            <span>
              {isES
                ? 'Hacé clic en un activo para desplegar sus detalles y simular cambios de peso en la cartera'
                : 'Click any asset row to expand details and simulate portfolio weight adjustments'}
            </span>
            {expandedAsset && (
              <button
                type="button"
                onClick={() => setExpandedAsset(null)}
                className="mono-metric"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.58rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {isES ? 'Contraer' : 'Collapse'}
              </button>
            )}
          </div>

          {/* Asset Rows (Compact 1-Line by default; expands ONLY when clicked) */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingRight: '0.2rem' }}>
            {filteredAssets.map((pos) => {
              const isSelected = selectedAsset === pos.sym;
              const isExpanded = expandedAsset === pos.sym;
              const isHeld = pos.marketValue > 0;
              const weightPct = ((pos.marketValue / portfolioSummary.totalNav) * 100).toFixed(1);
              const toneColor = pos.isPositive ? '#10b981' : '#f43f5e';
              const isAnomalyAlert = pos.anomalyScore >= 0.65;

              return (
                <div
                  key={pos.sym}
                  style={{
                    borderRadius: '14px',
                    backgroundColor: isSelected
                      ? pos.isPositive
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(244, 63, 94, 0.1)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected
                      ? `1.5px solid ${toneColor}`
                      : '1px solid rgba(255, 255, 255, 0.07)',
                    borderLeft: `4px solid ${isHeld ? toneColor : 'rgba(255,255,255,0.22)'}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* 1-Line Summary Header (Always Visible) */}
                  <div
                    onClick={() => {
                      onSelectAsset && onSelectAsset(pos.sym);
                      setExpandedAsset((cur) => (cur === pos.sym ? null : pos.sym));
                    }}
                    style={{
                      padding: '0.62rem 0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <span className="mono-metric" style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', minWidth: '44px' }}>
                        {pos.sym}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {pos.name}
                      </span>
                      <span
                        className="mono-metric"
                        style={{
                          fontSize: '0.54rem',
                          fontWeight: 800,
                          padding: '0.08rem 0.45rem',
                          borderRadius: '999px',
                          backgroundColor: !isHeld
                            ? 'rgba(255,255,255,0.08)'
                            : pos.isPositive
                            ? 'rgba(16, 185, 129, 0.16)'
                            : 'rgba(244, 63, 94, 0.18)',
                          color: !isHeld ? 'var(--text-muted)' : toneColor,
                        }}
                      >
                        {pos.status}
                      </span>
                    </div>

                    <div className="mono-metric" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {isHeld ? (
                        <>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
                            ${pos.marketValue.toLocaleString('en-US')}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700, minWidth: '52px', textAlign: 'right' }}>
                            {weightPct}%
                          </span>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: toneColor, minWidth: '58px', textAlign: 'right' }}>
                            {pos.pnlPct >= 0 ? '+' : ''}
                            {pos.pnlPct.toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.66rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                          {isES ? `0.0% • Objetivo Comité: ${pos.targetWeightPct}%` : `0.0% • Committee Target: ${pos.targetWeightPct}%`}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp size={15} style={{ color: 'var(--text-muted)' }} />
                      ) : (
                        <ChevronDown size={15} style={{ color: 'var(--text-dim)' }} />
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail & Sandbox Controls (Visible ONLY when this asset is clicked) */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '0.65rem 0.85rem 0.75rem 0.85rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: 'rgba(8, 12, 22, 0.55)',
                        borderBottomLeftRadius: '14px',
                        borderBottomRightRadius: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem',
                      }}
                    >
                      {/* Signal & Correlation Metrics */}
                      <div
                        className="mono-metric"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '0.5rem',
                          fontSize: '0.62rem',
                        }}
                      >
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.38rem 0.55rem', borderRadius: '8px' }}>
                          <div style={{ color: 'var(--text-dim)', fontSize: '0.54rem' }}>
                            {isES ? 'PRECIO ACTUAL' : 'CURRENT PRICE'}
                          </div>
                          <div style={{ color: '#ffffff', fontWeight: 800, marginTop: '0.1rem' }}>
                            ${pos.currentPrice.toLocaleString()}
                          </div>
                        </div>

                        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.38rem 0.55rem', borderRadius: '8px' }}>
                          <div style={{ color: 'var(--text-dim)', fontSize: '0.54rem' }}>ANALYTICS ANOMALY</div>
                          <div style={{ color: isAnomalyAlert ? '#f43f5e' : '#10b981', fontWeight: 800, marginTop: '0.1rem' }}>
                            {pos.anomalyScore} {isAnomalyAlert ? '(ALERT >0.65)' : '(Normal)'}
                          </div>
                        </div>

                        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.38rem 0.55rem', borderRadius: '8px' }}>
                          <div style={{ color: 'var(--text-dim)', fontSize: '0.54rem' }}>RESEARCH SCORE</div>
                          <div style={{ color: pos.researchScore >= 0 ? '#10b981' : '#f43f5e', fontWeight: 800, marginTop: '0.1rem' }}>
                            {pos.researchScore >= 0 ? `+${pos.researchScore}` : pos.researchScore}
                          </div>
                        </div>

                        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.38rem 0.55rem', borderRadius: '8px' }}>
                          <div style={{ color: 'var(--text-dim)', fontSize: '0.54rem' }}>
                            {isES ? 'CORRELACIÓN / PROXY' : 'CORRELATED PROXY'}
                          </div>
                          <div style={{ color: '#ffffff', fontWeight: 700, marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {pos.proxyCorr}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Position Weight Simulator + Jump to Markets Level 2 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <span className="mono-metric" style={{ fontSize: '0.58rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                            {isES ? 'SIMULAR PESO:' : 'SIMULATE WEIGHT:'}
                          </span>

                          <button
                            type="button"
                            onClick={() => adjustAssetAllocation(pos.sym, -2660)}
                            disabled={!isHeld}
                            className="mono-metric"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              padding: '0.22rem 0.52rem',
                              borderRadius: '999px',
                              border: '1px solid rgba(244, 63, 94, 0.35)',
                              backgroundColor: 'rgba(244, 63, 94, 0.12)',
                              color: '#f43f5e',
                              fontSize: '0.58rem',
                              fontWeight: 800,
                              cursor: isHeld ? 'pointer' : 'not-allowed',
                              opacity: isHeld ? 1 : 0.4,
                            }}
                          >
                            <Minus size={10} />
                            <span>2.5%</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => adjustAssetAllocation(pos.sym, 2660)}
                            className="mono-metric"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              padding: '0.22rem 0.52rem',
                              borderRadius: '999px',
                              border: '1px solid rgba(16, 185, 129, 0.35)',
                              backgroundColor: 'rgba(16, 185, 129, 0.14)',
                              color: '#10b981',
                              fontSize: '0.58rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            <Plus size={10} />
                            <span>2.5%</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => adjustAssetAllocation(pos.sym, 0, pos.targetWeightPct)}
                            className="mono-metric"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.22rem 0.58rem',
                              borderRadius: '999px',
                              border: '1px solid rgba(255,255,255,0.16)',
                              backgroundColor: 'rgba(255,255,255,0.06)',
                              color: '#ffffff',
                              fontSize: '0.58rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <RotateCcw size={10} />
                            <span>
                              {isES ? `Objetivo Comité (${pos.targetWeightPct}%)` : `Committee Target (${pos.targetWeightPct}%)`}
                            </span>
                          </button>

                          {isHeld && (
                            <button
                              type="button"
                              onClick={() => adjustAssetAllocation(pos.sym, 0, 0)}
                              className="mono-metric"
                              style={{
                                padding: '0.22rem 0.52rem',
                                borderRadius: '999px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backgroundColor: 'transparent',
                                color: 'var(--text-dim)',
                                fontSize: '0.56rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              {isES ? 'Cerrar (0%)' : 'Close (0%)'}
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => jumpToAssetLevel2(pos.sym)}
                          className="mono-metric"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.16)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.6rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          <span>{isES ? `Abrir ${pos.sym} en Markets (Nivel 2)` : `Open ${pos.sym} in Markets (Level 2)`}</span>
                          <ArrowUpRight size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: SINGLE FOCUSED VIEW (SWITCH BETWEEN COMMITTEE PILLARS OR ORDER LOG, CLICK TO EXPAND) */}
        <div
          style={{
            borderRadius: '22px',
            backgroundColor: 'var(--bg-panel-glass)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.9rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.7rem',
            minHeight: 0,
          }}
        >
          {/* Centered Top Switcher: Either Committee Verdict OR Order Log */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                padding: '0.22rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(8, 12, 22, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <button
                type="button"
                onClick={() => setRightPanelTab('committee')}
                className="mono-metric"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.38rem',
                  padding: '0.35rem 0.95rem',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: rightPanelTab === 'committee' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: rightPanelTab === 'committee' ? '#10b981' : 'var(--text-dim)',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <Sliders size={12} />
                <span>{isES ? `Comité (${selectedAsset})` : `Committee (${selectedAsset})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setRightPanelTab('log')}
                className="mono-metric"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.38rem',
                  padding: '0.35rem 0.95rem',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: rightPanelTab === 'log' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: rightPanelTab === 'log' ? '#10b981' : 'var(--text-dim)',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <ListChecks size={12} />
                <span>
                  {isES ? `Historial de Órdenes (${ledgerEvents.length})` : `Order Log (${ledgerEvents.length})`}
                </span>
              </button>
            </div>
          </div>

          {/* Action Sub-Bar for Selected Asset */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              paddingBottom: '0.35rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <span className="mono-metric" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {isES ? `ACTIVO EN FOCO: ${selectedAsset}` : `ACTIVE FOCUS: ${selectedAsset}`}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => jumpToAssetLevel2(selectedAsset)}
                className="mono-metric"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <span>{isES ? `Abrir ${selectedAsset} en Markets` : `Open ${selectedAsset} in Markets`}</span>
                <ArrowUpRight size={12} />
              </button>

              <button
                type="button"
                onClick={() => handleRunLiveCycle(selectedAsset)}
                disabled={isRunningCycle}
                className="mono-metric"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#10b981',
                  color: '#000',
                  border: 'none',
                  padding: '0.32rem 0.78rem',
                  borderRadius: '999px',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <Play size={11} fill="#000" />
                <span>
                  {isRunningCycle
                    ? isES
                      ? 'EVALUANDO...'
                      : 'EVALUATING...'
                    : isES
                    ? `EJECUTAR COMITÉ`
                    : `RUN COMMITTEE`}
                </span>
              </button>
            </div>
          </div>

          {/* VIEW A: 3-PILLAR COMMITTEE DELIBERATION (COLLAPSED ACCORDIONS BY DEFAULT) */}
          {rightPanelTab === 'committee' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem', minHeight: 0, overflowY: 'auto' }}>
              {/* Verdict Banner */}
              <div
                style={{
                  padding: '0.7rem 0.95rem',
                  borderRadius: '16px',
                  backgroundColor: verdictPositive ? 'rgba(16, 185, 129, 0.11)' : 'rgba(244, 63, 94, 0.12)',
                  border: `1px solid ${verdictPositive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.4)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {verdictPositive ? (
                    <ShieldCheck size={16} style={{ color: '#10b981' }} />
                  ) : (
                    <ShieldAlert size={16} style={{ color: '#f43f5e' }} />
                  )}
                  <span className="mono-metric" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                    {isES ? `VEREDICTO (${selectedAsset}):` : `VERDICT (${selectedAsset}):`}
                  </span>
                  <span className="mono-metric" style={{ fontSize: '0.78rem', fontWeight: 800, color: verdictColor }}>
                    {committeeResult.consensusAction[langCode] ||
                      committeeResult.consensusAction.EN ||
                      committeeResult.consensusAction}
                  </span>
                </div>

                <div className="mono-metric" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.64rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>
                    R/R: <strong style={{ color: '#ffffff' }}>{committeeResult.riskReward || '2.1x'}</strong>
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      color: verdictColor,
                      backgroundColor: verdictPositive ? 'rgba(16, 185, 129, 0.18)' : 'rgba(244, 63, 94, 0.2)',
                      padding: '0.12rem 0.55rem',
                      borderRadius: '999px',
                    }}
                  >
                    {committeeResult.allocatedNav}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.64rem', color: 'var(--text-dim)' }}>
                {isES
                  ? 'Hacé clic en cualquiera de los 3 pilares para desplegar su argumento detallado:'
                  : 'Click any of the 3 pillars below to expand its detailed reasoning:'}
              </div>

              {/* 3 Pillars (Click to Expand Only) */}
              {committeeResult.agents.map((ag, i) => {
                const agPos = ag.isPositive !== false;
                const agColor = agPos ? '#10b981' : '#f43f5e';
                const isOpen = expandedPillar === i;

                return (
                  <div
                    key={i}
                    style={{
                      borderRadius: '14px',
                      backgroundColor: isOpen
                        ? agPos
                          ? 'rgba(16, 185, 129, 0.09)'
                          : 'rgba(244, 63, 94, 0.1)'
                        : 'rgba(255, 255, 255, 0.03)',
                      border: isOpen ? `1px solid ${agColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                      borderLeft: `4px solid ${agColor}`,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      onClick={() => setExpandedPillar((cur) => (cur === i ? null : i))}
                      style={{
                        padding: '0.72rem 0.9rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        gap: '0.5rem',
                      }}
                    >
                      <span className="mono-metric" style={{ fontSize: '0.64rem', fontWeight: 800, color: '#ffffff' }}>
                        {ag.role[langCode] || ag.role.EN || ag.role}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          className="mono-metric"
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            color: agColor,
                            padding: '0.1rem 0.5rem',
                            borderRadius: '999px',
                            backgroundColor: agPos ? 'rgba(16, 185, 129, 0.16)' : 'rgba(244, 63, 94, 0.18)',
                          }}
                        >
                          {ag.verdict[langCode] || ag.verdict.EN || ag.verdict}
                        </span>
                        {isOpen ? (
                          <ChevronUp size={15} style={{ color: 'var(--text-muted)' }} />
                        ) : (
                          <ChevronDown size={15} style={{ color: 'var(--text-dim)' }} />
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div
                        style={{
                          padding: '0 0.9rem 0.78rem 0.9rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                          paddingTop: '0.55rem',
                        }}
                      >
                        <p style={{ fontSize: '0.74rem', color: '#ffffff', margin: 0, lineHeight: 1.5 }}>
                          {ag.note[langCode] || ag.note.EN}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* VIEW B: ORDER & GUARDRAIL EXECUTION LOG (COLLAPSED ACCORDIONS BY DEFAULT) */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0, overflowY: 'auto' }}>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-dim)' }}>
                {isES
                  ? 'Hacé clic en una orden o intervención para desplegar su detalle de ejecución:'
                  : 'Click any order or guardrail intervention to expand its execution details:'}
              </div>

              {ledgerEvents.map((ev) => {
                const evPos = ev.isPositive !== false;
                const evColor = evPos ? '#10b981' : '#f43f5e';
                const isOpen = expandedLogId === ev.id;

                return (
                  <div
                    key={ev.id}
                    style={{
                      borderRadius: '14px',
                      backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                      border: isOpen ? `1px solid ${evColor}` : '1px solid rgba(255, 255, 255, 0.07)',
                      borderLeft: `4px solid ${evColor}`,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      onClick={() => {
                        onSelectAsset && onSelectAsset(ev.sym);
                        setExpandedLogId((cur) => (cur === ev.id ? null : ev.id));
                      }}
                      style={{
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        gap: '0.5rem',
                      }}
                    >
                      <span className="mono-metric" style={{ fontSize: '0.64rem', fontWeight: 800, color: evColor }}>
                        {ev.title[langCode] || ev.title.EN}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                        <span className="mono-metric" style={{ color: 'var(--text-dim)', fontSize: '0.58rem' }}>
                          {ev.time} • {ev.allocText}
                        </span>
                        {isOpen ? (
                          <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
                        ) : (
                          <ChevronDown size={14} style={{ color: 'var(--text-dim)' }} />
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div
                        style={{
                          padding: '0.5rem 0.85rem 0.7rem 0.85rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <p style={{ fontSize: '0.72rem', color: '#ffffff', margin: 0, lineHeight: 1.48 }}>
                          {ev.desc[langCode] || ev.desc.EN}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
