/**
 * Market Data Service (`marketService.js`)
 * Covers the 10-Category Global Financial Asset Universe (`docs/ASSET_UNIVERSE_PLAN.md`):
 * 1. `INDEX` — 24 Global Equity Benchmark Indices (US, Europe, Asia-Pacific, LatAm)
 * 2. `EQUITY` — Top-Volume S&P 500 & Nasdaq-100 Constituents
 * 3. `ETF` — Top-Volume Global ETFs (Core Index, Sector SPDR, Bond, Commodity, Regional)
 * 4. `CRYPTO` — Top-Volume Layer-1, Infrastructure & DeFi Digital Assets
 * 5. `RATES` — Sovereign Yield Curve Nodes (`3M`–`30Y`) linked to 40-Country Curve Engine
 * 6. `FIXED_INCOME` — US Treasury Notes, Bonds & TIPS (`UST-2Y`..`UST-30Y`)
 * 7. `FX` — World Currencies vs USD + `DXY` + Cross-Currency Triangulation (`(USD/B)/(USD/A)`)
 * 8. `COMMODITY` — Energy, Precious Metals, Industrial/Battery Metals, Agriculture & Softs
 * 9. `DERIVATIVES_VOL` — Volatility Indices (`VIX`, `MOVE`), Top Futures & High-Volume Equity Options
 * 10. `CASH` — Overnight Benchmark Rates (`SOFR`, `EFFR`, `ESTR`, `SONIA`), T-Bills & Money Market
 */

import {
  SOVEREIGN_YIELD_CURVES,
  computeSovereignCurveMetrics,
  WORLD_USD_RATES,
  computeCrossCurrencyRate,
  getHighVolumeOptionsChain,
  getCommodityForwardCurve,
  getAssetClassSpecificMetrics,
  OPTIONS_STRATEGIES,
  computeOptionsStrategyPayoff,
  computeVolatilitySurface3D,
  computeSovereignYieldSurface3D,
  computeCommodityForwardSurface3D,
} from '../data/globalUniverseData.js';

export {
  SOVEREIGN_YIELD_CURVES,
  computeSovereignCurveMetrics,
  WORLD_USD_RATES,
  computeCrossCurrencyRate,
  getHighVolumeOptionsChain,
  getCommodityForwardCurve,
  getAssetClassSpecificMetrics,
  OPTIONS_STRATEGIES,
  computeOptionsStrategyPayoff,
  computeVolatilitySurface3D,
  computeSovereignYieldSurface3D,
  computeCommodityForwardSurface3D,
};

function hashSym(sym = 'BTC') {
  let h = 2166136261;
  for (let i = 0; i < sym.length; i++) {
    h ^= sym.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function buildAssetEntry(raw, idx) {
  const h = hashSym(raw.sym);
  const chgNum = typeof raw.chgNum === 'number' ? raw.chgNum : Number((((h % 420) - 180) / 100).toFixed(2));
  const chg = raw.chg || `${chgNum >= 0 ? '+' : ''}${chgNum.toFixed(2)}%`;
  const vol24hNum = typeof raw.vol24hNum === 'number' ? raw.vol24hNum : Number((1.2 + (h % 180) / 10).toFixed(2));
  const vol24h = raw.vol24h || `$${vol24hNum.toFixed(2)}B`;
  const volChgVal = raw.volChgVal ?? Number((((h >> 3) % 360) - 120) / 10);
  const volChg24h = raw.volChg24h || `${volChgVal >= 0 ? '+' : ''}${volChgVal.toFixed(1)}%`;

  const rsi14 =
    raw.indicators?.rsi14 ??
    Number(Math.min(79.4, Math.max(28.5, 51 + chgNum * 3.8 + (((h >> 5) % 90) - 45) / 10)).toFixed(1));
  const macdVal = raw.indicators?.macd ?? `${chgNum >= 0 ? '+' : ''}${(chgNum * 0.65).toFixed(2)}`;
  const macdSignal =
    raw.indicators?.macdSignal ??
    (rsi14 >= 68
      ? 'OVEREXTENDED'
      : rsi14 >= 57
      ? 'BULLISH TREND'
      : rsi14 >= 50
      ? 'ACCUMULATION'
      : rsi14 >= 43
      ? 'CONSOLIDATING'
      : 'MEAN REVERSION');
  const bbWidth = raw.indicators?.bbWidth ?? `${(1.8 + ((h >> 7) % 55) / 10).toFixed(1)}%`;

  let priceFormatted = raw.priceFormatted;
  if (!priceFormatted) {
    if (raw.unit === 'yield') {
      priceFormatted = `${raw.price.toFixed(2)}%`;
    } else if (raw.unit === 'fx') {
      priceFormatted = raw.price >= 50 ? raw.price.toFixed(2) : raw.price.toFixed(4);
    } else if (raw.unit === 'pts') {
      priceFormatted = `${raw.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      priceFormatted = `$${raw.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  const defaultSourceByCat = {
    INDEX: 'P-01 • Global Index Feed / dbt Mart',
    EQUITY: 'P-01 • S&P 500 & NDX / Neon PG',
    ETF: 'P-01 • Institutional ETF Tape / dbt Mart',
    CRYPTO: 'P-02 • CoinGecko / BigQuery Lake',
    RATES: 'P-05 • Sovereign Curve Mart (40 Countries)',
    FIXED_INCOME: 'P-05 • US Treasury Desk / FRED',
    FX: 'P-03 • BIS Interbank FX Triangulator',
    COMMODITY: 'P-05 • CME / NYMEX / ICE Spot Mart',
    DERIVATIVES_VOL: 'P-06 • CBOE / CME High-OI Surface',
    CASH: 'P-05 • Fed SOFR / Money Market Mart',
  };

  return {
    rank: idx + 1,
    sym: raw.sym,
    pair: raw.pair || `${raw.sym}/USD`,
    name: raw.name,
    cat: raw.cat,
    countryCode: raw.countryCode || null,
    underlyingSym: raw.underlyingSym || null,
    source: raw.source || defaultSourceByCat[raw.cat] || 'P-05 • Unified Analytics Mart',
    price: raw.price,
    priceFormatted,
    chg,
    chgNum,
    vol24h,
    vol24hNum,
    volChg24h,
    marketCap: raw.marketCap || '—',
    indicators: {
      rsi14,
      macd: macdVal,
      macdSignal,
      bbWidth,
    },
  };
}

const RAW_ASSET_UNIVERSE = [
  // ==========================================================================
  // CORE FLAGSHIP ASSETS (Ranks 1–10 preserved for instant familiarity)
  // ==========================================================================
  {
    sym: 'BTC',
    pair: 'BTC/USD',
    name: 'Bitcoin',
    cat: 'CRYPTO',
    source: 'P-02 • CoinGecko / BigQuery',
    price: 68620.0,
    priceFormatted: '$68,620.00',
    chg: '+1.85%',
    chgNum: 1.85,
    vol24h: '$43.23B',
    vol24hNum: 43.23,
    volChg24h: '+12.4%',
    marketCap: '$1.36T',
    indicators: { rsi14: 61.4, macd: '+412.5', macdSignal: 'BULLISH CROSS', bbWidth: '4.8%' },
  },
  {
    sym: 'ETH',
    pair: 'ETH/USD',
    name: 'Ethereum',
    cat: 'CRYPTO',
    source: 'P-02 • CoinGecko / BigQuery',
    price: 2750.4,
    priceFormatted: '$2,750.40',
    chg: '+0.92%',
    chgNum: 0.92,
    vol24h: '$19.84B',
    vol24hNum: 19.84,
    volChg24h: '+4.1%',
    marketCap: '$331.2B',
    indicators: { rsi14: 54.2, macd: '+18.3', macdSignal: 'NEUTRAL-BULL', bbWidth: '3.9%' },
  },
  {
    sym: 'SOL',
    pair: 'SOL/USD',
    name: 'Solana',
    cat: 'CRYPTO',
    source: 'P-02 • CoinGecko / BigQuery',
    price: 178.2,
    priceFormatted: '$178.20',
    chg: '+3.14%',
    chgNum: 3.14,
    vol24h: '$6.42B',
    vol24hNum: 6.42,
    volChg24h: '+48.7%',
    marketCap: '$84.5B',
    indicators: { rsi14: 76.8, macd: '+6.42', macdSignal: 'OVEREXTENDED', bbWidth: '9.4%' },
  },
  {
    sym: 'NVDA',
    pair: 'NVDA/USD',
    name: 'Nvidia Corp. (S&P 500 / NDX)',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 141.5,
    priceFormatted: '$141.50',
    chg: '+2.45%',
    chgNum: 2.45,
    vol24h: '$38.90B',
    vol24hNum: 38.9,
    volChg24h: '+19.2%',
    marketCap: '$3.46T',
    indicators: { rsi14: 64.9, macd: '+2.18', macdSignal: 'BULLISH TREND', bbWidth: '5.2%' },
  },
  {
    sym: 'AAPL',
    pair: 'AAPL/USD',
    name: 'Apple Inc. (S&P 500 / NDX)',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 232.8,
    priceFormatted: '$232.80',
    chg: '+0.32%',
    chgNum: 0.32,
    vol24h: '$11.45B',
    vol24hNum: 11.45,
    volChg24h: '-3.2%',
    marketCap: '$3.54T',
    indicators: { rsi14: 52.1, macd: '+0.64', macdSignal: 'ACCUMULATION', bbWidth: '2.7%' },
  },
  {
    sym: 'MSFT',
    pair: 'MSFT/USD',
    name: 'Microsoft Corp. (S&P 500 / NDX)',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 428.1,
    priceFormatted: '$428.10',
    chg: '-0.15%',
    chgNum: -0.15,
    vol24h: '$8.72B',
    vol24hNum: 8.72,
    volChg24h: '-6.4%',
    marketCap: '$3.18T',
    indicators: { rsi14: 48.3, macd: '-0.45', macdSignal: 'CONSOLIDATING', bbWidth: '2.4%' },
  },
  {
    sym: 'AMZN',
    pair: 'AMZN/USD',
    name: 'Amazon.com Inc. (S&P 500 / NDX)',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 186.4,
    priceFormatted: '$186.40',
    chg: '+1.10%',
    chgNum: 1.1,
    vol24h: '$9.18B',
    vol24hNum: 9.18,
    volChg24h: '+7.8%',
    marketCap: '$1.96T',
    indicators: { rsi14: 57.6, macd: '+1.12', macdSignal: 'BULLISH CROSS', bbWidth: '3.5%' },
  },
  {
    sym: 'GOOGL',
    pair: 'GOOGL/USD',
    name: 'Alphabet Inc. (S&P 500 / NDX)',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 165.7,
    priceFormatted: '$165.70',
    chg: '+0.75%',
    chgNum: 0.75,
    vol24h: '$6.10B',
    vol24hNum: 6.1,
    volChg24h: '+2.9%',
    marketCap: '$2.05T',
    indicators: { rsi14: 55.0, macd: '+0.79', macdSignal: 'STEADY DRIFT', bbWidth: '3.1%' },
  },
  {
    sym: 'SPY',
    pair: 'SPY/USD',
    name: 'SPDR S&P 500 ETF Trust',
    cat: 'ETF',
    source: 'P-01 • Alpha Vantage / dbt Mart',
    price: 580.4,
    priceFormatted: '$580.40',
    chg: '+0.45%',
    chgNum: 0.45,
    vol24h: '$24.60B',
    vol24hNum: 24.6,
    volChg24h: '+1.5%',
    marketCap: '$618.0B',
    indicators: { rsi14: 58.9, macd: '+1.35', macdSignal: 'UPTREND', bbWidth: '2.1%' },
  },
  {
    sym: 'QQQ',
    pair: 'QQQ/USD',
    name: 'Invesco QQQ Trust (Nasdaq-100 ETF)',
    cat: 'ETF',
    source: 'P-01 • Alpha Vantage / dbt Mart',
    price: 492.15,
    priceFormatted: '$492.15',
    chg: '+0.60%',
    chgNum: 0.6,
    vol24h: '$16.12B',
    vol24hNum: 16.12,
    volChg24h: '+3.8%',
    marketCap: '$298.4B',
    indicators: { rsi14: 60.2, macd: '+1.90', macdSignal: 'UPTREND', bbWidth: '2.6%' },
  },

  // ==========================================================================
  // 1. INDEX — 24 GLOBAL BENCHMARK INDICES (US, EUROPE, ASIA-PACIFIC, LATAM)
  // ==========================================================================
  { sym: 'SPX', pair: 'SPX/PTS', name: 'S&P 500 Index (US Benchmark)', cat: 'INDEX', unit: 'pts', price: 5864.2, chgNum: 0.48, vol24hNum: 142.5, volChg24h: '+6.2%' },
  { sym: 'NDX', pair: 'NDX/PTS', name: 'Nasdaq-100 Index (US Tech)', cat: 'INDEX', unit: 'pts', price: 20480.5, chgNum: 0.64, vol24hNum: 98.4, volChg24h: '+8.1%' },
  { sym: 'DJI', pair: 'DJI/PTS', name: 'Dow Jones Industrial Average', cat: 'INDEX', unit: 'pts', price: 42380.1, chgNum: 0.22, vol24hNum: 36.8, volChg24h: '+1.9%' },
  { sym: 'RUT', pair: 'RUT/PTS', name: 'Russell 2000 Small-Cap Index', cat: 'INDEX', unit: 'pts', price: 2218.4, chgNum: -0.34, vol24hNum: 21.4, volChg24h: '-2.1%' },
  { sym: 'SOX', pair: 'SOX/PTS', name: 'PHLX Semiconductor Index', cat: 'INDEX', unit: 'pts', price: 5210.8, chgNum: 1.54, vol24hNum: 44.2, volChg24h: '+14.8%' },
  { sym: 'NYFANG', pair: 'FANG/PTS', name: 'NYSE FANG+ Mega-Cap Tech Index', cat: 'INDEX', unit: 'pts', price: 11940.0, chgNum: 1.18, vol24hNum: 39.6, volChg24h: '+11.4%' },
  { sym: 'SX5E', pair: 'SX5E/EUR', name: 'Euro Stoxx 50 Index (Eurozone)', cat: 'INDEX', unit: 'pts', price: 4965.2, chgNum: 0.31, vol24hNum: 28.4, volChg24h: '+3.2%' },
  { sym: 'DAX', pair: 'DAX/EUR', name: 'DAX 40 Performance Index (Germany)', cat: 'INDEX', unit: 'pts', price: 19482.0, chgNum: 0.42, vol24hNum: 18.9, volChg24h: '+4.5%' },
  { sym: 'UKX', pair: 'UKX/GBP', name: 'FTSE 100 Index (United Kingdom)', cat: 'INDEX', unit: 'pts', price: 8285.4, chgNum: -0.18, vol24hNum: 15.2, volChg24h: '-1.4%' },
  { sym: 'CAC', pair: 'CAC/EUR', name: 'CAC 40 Index (France)', cat: 'INDEX', unit: 'pts', price: 7542.1, chgNum: 0.19, vol24hNum: 12.6, volChg24h: '+2.0%' },
  { sym: 'SMI', pair: 'SMI/CHF', name: 'Swiss Market Index (Switzerland)', cat: 'INDEX', unit: 'pts', price: 12180.5, chgNum: 0.25, vol24hNum: 9.8, volChg24h: '+1.1%' },
  { sym: 'IBEX', pair: 'IBEX/EUR', name: 'IBEX 35 Index (Spain)', cat: 'INDEX', unit: 'pts', price: 11840.2, chgNum: 0.52, vol24hNum: 6.4, volChg24h: '+5.3%' },
  { sym: 'FTSEMIB', pair: 'MIB/EUR', name: 'FTSE MIB Index (Italy)', cat: 'INDEX', unit: 'pts', price: 34910.0, chgNum: 0.47, vol24hNum: 7.1, volChg24h: '+3.8%' },
  { sym: 'NKY', pair: 'NKY/JPY', name: 'Nikkei 225 Index (Japan)', cat: 'INDEX', unit: 'pts', price: 38920.0, chgNum: 0.88, vol24hNum: 34.5, volChg24h: '+9.4%' },
  { sym: 'TPX', pair: 'TPX/JPY', name: 'TOPIX Index (Tokyo Stock Exchange)', cat: 'INDEX', unit: 'pts', price: 2695.4, chgNum: 0.65, vol24hNum: 26.2, volChg24h: '+6.1%' },
  { sym: 'HSI', pair: 'HSI/HKD', name: 'Hang Seng Index (Hong Kong)', cat: 'INDEX', unit: 'pts', price: 20590.2, chgNum: 1.24, vol24hNum: 29.8, volChg24h: '+15.2%' },
  { sym: 'SHCOMP', pair: 'SHCOMP/CNY', name: 'SSE Shanghai Composite Index', cat: 'INDEX', unit: 'pts', price: 3295.1, chgNum: 0.72, vol24hNum: 58.4, volChg24h: '+12.8%' },
  { sym: 'CSI300', pair: 'CSI300/CNY', name: 'CSI 300 Index (China A-Shares)', cat: 'INDEX', unit: 'pts', price: 3928.4, chgNum: 0.81, vol24hNum: 42.1, volChg24h: '+10.6%' },
  { sym: 'KOSPI', pair: 'KOSPI/KRW', name: 'KOSPI Composite Index (South Korea)', cat: 'INDEX', unit: 'pts', price: 2612.8, chgNum: 0.36, vol24hNum: 14.7, volChg24h: '+2.8%' },
  { sym: 'TWII', pair: 'TWII/TWD', name: 'TAIEX Index (Taiwan Semiconductor Heavy)', cat: 'INDEX', unit: 'pts', price: 23348.0, chgNum: 1.12, vol24hNum: 16.9, volChg24h: '+9.7%' },
  { sym: 'AS51', pair: 'ASX200/AUD', name: 'S&P/ASX 200 Index (Australia)', cat: 'INDEX', unit: 'pts', price: 8245.6, chgNum: 0.18, vol24hNum: 11.2, volChg24h: '+1.4%' },
  { sym: 'NIFTY', pair: 'NIFTY50/INR', name: 'Nifty 50 Index (NSE India)', cat: 'INDEX', unit: 'pts', price: 24420.5, chgNum: 0.44, vol24hNum: 22.8, volChg24h: '+7.5%' },
  { sym: 'IBOV', pair: 'IBOV/BRL', name: 'Ibovespa Index (B3 Brazil)', cat: 'INDEX', unit: 'pts', price: 130840.0, chgNum: -0.28, vol24hNum: 8.9, volChg24h: '-1.8%' },
  { sym: 'MEXBOL', pair: 'IPC/MXN', name: 'S&P/BMV IPC Index (Mexico)', cat: 'INDEX', unit: 'pts', price: 51680.0, chgNum: 0.15, vol24hNum: 3.4, volChg24h: '+0.9%' },
  { sym: 'MERVAL', pair: 'MERV/ARS', name: 'S&P Merval Index (BYMA Argentina)', cat: 'INDEX', unit: 'pts', price: 1845200.0, chgNum: 2.35, vol24hNum: 1.8, volChg24h: '+21.4%' },

  // ==========================================================================
  // 2. EQUITY — STRICTLY S&P 500 & NASDAQ-100 TOP VOLUME CONSTITUENTS
  // ==========================================================================
  { sym: 'TSLA', name: 'Tesla Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 258.4, chgNum: 2.85, vol24hNum: 24.8, marketCap: '$812B' },
  { sym: 'META', name: 'Meta Platforms Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 592.4, chgNum: 1.42, vol24hNum: 11.2, marketCap: '$1.49T' },
  { sym: 'AMD', name: 'Advanced Micro Devices (S&P 500 / NDX)', cat: 'EQUITY', price: 156.8, chgNum: 1.95, vol24hNum: 9.85, marketCap: '$253B' },
  { sym: 'AVGO', name: 'Broadcom Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 178.9, chgNum: 1.68, vol24hNum: 8.4, marketCap: '$835B' },
  { sym: 'PLTR', name: 'Palantir Technologies (S&P 500)', cat: 'EQUITY', price: 44.85, chgNum: 3.12, vol24hNum: 6.8, marketCap: '$100B' },
  { sym: 'NFLX', name: 'Netflix Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 754.2, chgNum: 0.94, vol24hNum: 5.4, marketCap: '$324B' },
  { sym: 'BRK.B', name: 'Berkshire Hathaway Inc. (S&P 500)', cat: 'EQUITY', price: 456.2, chgNum: 0.28, vol24hNum: 4.9, marketCap: '$985B' },
  { sym: 'LLY', name: 'Eli Lilly & Co. (S&P 500)', cat: 'EQUITY', price: 904.5, chgNum: 0.86, vol24hNum: 4.7, marketCap: '$859B' },
  { sym: 'JPM', name: 'JPMorgan Chase & Co. (S&P 500)', cat: 'EQUITY', price: 226.4, chgNum: 0.54, vol24hNum: 4.5, marketCap: '$642B' },
  { sym: 'MU', name: 'Micron Technology Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 108.6, chgNum: 1.74, vol24hNum: 4.3, marketCap: '$120B' },
  { sym: 'COST', name: 'Costco Wholesale Corp. (S&P 500 / NDX)', cat: 'EQUITY', price: 892.1, chgNum: 0.41, vol24hNum: 3.9, marketCap: '$395B' },
  { sym: 'ORCL', name: 'Oracle Corp. (S&P 500)', cat: 'EQUITY', price: 174.8, chgNum: 1.22, vol24hNum: 3.8, marketCap: '$482B' },
  { sym: 'UNH', name: 'UnitedHealth Group Inc. (S&P 500)', cat: 'EQUITY', price: 568.4, chgNum: -0.45, vol24hNum: 3.7, marketCap: '$524B' },
  { sym: 'V', name: 'Visa Inc. (S&P 500)', cat: 'EQUITY', price: 288.5, chgNum: 0.38, vol24hNum: 3.6, marketCap: '$565B' },
  { sym: 'XOM', name: 'Exxon Mobil Corp. (S&P 500)', cat: 'EQUITY', price: 119.8, chgNum: -0.62, vol24hNum: 3.5, marketCap: '$528B' },
  { sym: 'MA', name: 'Mastercard Inc. (S&P 500)', cat: 'EQUITY', price: 512.4, chgNum: 0.44, vol24hNum: 3.2, marketCap: '$475B' },
  { sym: 'WMT', name: 'Walmart Inc. (S&P 500)', cat: 'EQUITY', price: 82.65, chgNum: 0.58, vol24hNum: 3.1, marketCap: '$664B' },
  { sym: 'CRM', name: 'Salesforce Inc. (S&P 500)', cat: 'EQUITY', price: 294.2, chgNum: 0.79, vol24hNum: 3.0, marketCap: '$284B' },
  { sym: 'QCOM', name: 'Qualcomm Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 171.4, chgNum: 0.92, vol24hNum: 2.9, marketCap: '$191B' },
  { sym: 'INTC', name: 'Intel Corp. (S&P 500 / NDX)', cat: 'EQUITY', price: 22.85, chgNum: -1.12, vol24hNum: 2.85, marketCap: '$97B' },
  { sym: 'AMAT', name: 'Applied Materials Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 186.5, chgNum: 1.15, vol24hNum: 2.7, marketCap: '$154B' },
  { sym: 'GS', name: 'Goldman Sachs Group Inc. (S&P 500)', cat: 'EQUITY', price: 524.8, chgNum: 0.68, vol24hNum: 2.6, marketCap: '$168B' },
  { sym: 'BAC', name: 'Bank of America Corp. (S&P 500)', cat: 'EQUITY', price: 42.4, chgNum: 0.49, vol24hNum: 2.55, marketCap: '$328B' },
  { sym: 'CVX', name: 'Chevron Corp. (S&P 500)', cat: 'EQUITY', price: 149.2, chgNum: -0.54, vol24hNum: 2.4, marketCap: '$272B' },
  { sym: 'HD', name: 'Home Depot Inc. (S&P 500)', cat: 'EQUITY', price: 396.4, chgNum: 0.24, vol24hNum: 2.35, marketCap: '$393B' },
  { sym: 'PG', name: 'Procter & Gamble Co. (S&P 500)', cat: 'EQUITY', price: 169.8, chgNum: 0.18, vol24hNum: 2.2, marketCap: '$399B' },
  { sym: 'PANW', name: 'Palo Alto Networks Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 364.2, chgNum: 1.38, vol24hNum: 2.15, marketCap: '$118B' },
  { sym: 'ISRG', name: 'Intuitive Surgical Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 512.6, chgNum: 0.84, vol24hNum: 2.05, marketCap: '$182B' },

  // ==========================================================================
  // 3. ETF — TOP-VOLUME GLOBAL ETFs (INDEX, SECTORS, BONDS, COMMODITIES, EM)
  // ==========================================================================
  { sym: 'IWM', name: 'iShares Russell 2000 ETF', cat: 'ETF', price: 220.4, chgNum: -0.32, vol24hNum: 9.4, marketCap: '$68.5B' },
  { sym: 'SMH', name: 'VanEck Semiconductor ETF', cat: 'ETF', price: 254.8, chgNum: 1.62, vol24hNum: 6.8, marketCap: '$24.6B' },
  { sym: 'SOXX', name: 'iShares Semiconductor ETF', cat: 'ETF', price: 229.5, chgNum: 1.55, vol24hNum: 4.9, marketCap: '$15.2B' },
  { sym: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', cat: 'ETF', price: 92.45, chgNum: -0.48, vol24hNum: 5.6, marketCap: '$58.4B' },
  { sym: 'VOO', name: 'Vanguard S&P 500 ETF', cat: 'ETF', price: 534.2, chgNum: 0.45, vol24hNum: 4.8, marketCap: '$512.0B' },
  { sym: 'IVV', name: 'iShares Core S&P 500 ETF', cat: 'ETF', price: 584.1, chgNum: 0.46, vol24hNum: 4.5, marketCap: '$540.0B' },
  { sym: 'VTI', name: 'Vanguard Total Stock Market ETF', cat: 'ETF', price: 286.4, chgNum: 0.42, vol24hNum: 3.4, marketCap: '$438.0B' },
  { sym: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', cat: 'ETF', price: 423.9, chgNum: 0.21, vol24hNum: 3.2, marketCap: '$36.8B' },
  { sym: 'XLK', name: 'Technology Select Sector SPDR ETF', cat: 'ETF', price: 231.4, chgNum: 0.92, vol24hNum: 3.8, marketCap: '$72.4B' },
  { sym: 'XLF', name: 'Financial Select Sector SPDR ETF', cat: 'ETF', price: 46.85, chgNum: 0.54, vol24hNum: 3.5, marketCap: '$44.2B' },
  { sym: 'XLE', name: 'Energy Select Sector SPDR ETF', cat: 'ETF', price: 89.4, chgNum: -0.68, vol24hNum: 3.1, marketCap: '$36.5B' },
  { sym: 'XLV', name: 'Health Care Select Sector SPDR ETF', cat: 'ETF', price: 151.2, chgNum: 0.22, vol24hNum: 2.4, marketCap: '$41.2B' },
  { sym: 'XLI', name: 'Industrial Select Sector SPDR ETF', cat: 'ETF', price: 136.8, chgNum: 0.35, vol24hNum: 2.1, marketCap: '$20.8B' },
  { sym: 'XLY', name: 'Consumer Discretionary SPDR ETF', cat: 'ETF', price: 201.5, chgNum: 0.88, vol24hNum: 2.0, marketCap: '$21.4B' },
  { sym: 'XLP', name: 'Consumer Staples Select Sector SPDR', cat: 'ETF', price: 81.4, chgNum: 0.14, vol24hNum: 1.7, marketCap: '$17.2B' },
  { sym: 'XLU', name: 'Utilities Select Sector SPDR ETF', cat: 'ETF', price: 80.2, chgNum: 0.48, vol24hNum: 1.65, marketCap: '$18.5B' },
  { sym: 'XLC', name: 'Communication Services SPDR ETF', cat: 'ETF', price: 92.6, chgNum: 0.76, vol24hNum: 1.6, marketCap: '$19.8B' },
  { sym: 'XLB', name: 'Materials Select Sector SPDR ETF', cat: 'ETF', price: 94.8, chgNum: 0.29, vol24hNum: 1.3, marketCap: '$5.8B' },
  { sym: 'XLRE', name: 'Real Estate Select Sector SPDR ETF', cat: 'ETF', price: 43.6, chgNum: -0.18, vol24hNum: 1.25, marketCap: '$7.9B' },
  { sym: 'GLD', name: 'SPDR Gold Shares ETF', cat: 'ETF', price: 253.8, chgNum: 0.74, vol24hNum: 3.9, marketCap: '$78.4B' },
  { sym: 'SLV', name: 'iShares Silver Trust ETF', cat: 'ETF', price: 30.85, chgNum: 1.28, vol24hNum: 2.4, marketCap: '$15.6B' },
  { sym: 'USO', name: 'United States Oil Fund LP', cat: 'ETF', price: 71.2, chgNum: -0.95, vol24hNum: 1.8, marketCap: '$1.4B' },
  { sym: 'HYG', name: 'iShares iBoxx $ High Yield Corporate Bond', cat: 'ETF', price: 79.4, chgNum: 0.12, vol24hNum: 3.6, marketCap: '$16.8B' },
  { sym: 'LQD', name: 'iShares iBoxx $ Inv Grade Corporate Bond', cat: 'ETF', price: 109.2, chgNum: -0.19, vol24hNum: 2.9, marketCap: '$31.4B' },
  { sym: 'IEF', name: 'iShares 7-10 Year Treasury Bond ETF', cat: 'ETF', price: 94.8, chgNum: -0.22, vol24hNum: 2.5, marketCap: '$32.1B' },
  { sym: 'SHY', name: 'iShares 1-3 Year Treasury Bond ETF', cat: 'ETF', price: 82.35, chgNum: 0.04, vol24hNum: 1.9, marketCap: '$24.2B' },
  { sym: 'EEM', name: 'iShares MSCI Emerging Markets ETF', cat: 'ETF', price: 45.2, chgNum: 0.64, vol24hNum: 3.1, marketCap: '$18.9B' },
  { sym: 'FXI', name: 'iShares China Large-Cap ETF', cat: 'ETF', price: 32.4, chgNum: 1.45, vol24hNum: 4.2, marketCap: '$8.4B' },
  { sym: 'EWJ', name: 'iShares MSCI Japan ETF', cat: 'ETF', price: 71.8, chgNum: 0.68, vol24hNum: 1.4, marketCap: '$16.2B' },
  { sym: 'EWZ', name: 'iShares MSCI Brazil ETF', cat: 'ETF', price: 27.6, chgNum: -0.42, vol24hNum: 1.5, marketCap: '$4.8B' },
  { sym: 'RSP', name: 'Invesco S&P 500 Equal Weight ETF', cat: 'ETF', price: 178.4, chgNum: 0.31, vol24hNum: 1.85, marketCap: '$68.2B' },
  { sym: 'ARKK', name: 'ARK Innovation ETF', cat: 'ETF', price: 48.9, chgNum: 1.84, vol24hNum: 1.45, marketCap: '$5.9B' },

  // ==========================================================================
  // 4. CRYPTO — TOP-VOLUME LAYER 1, INFRASTRUCTURE & DEFI DIGITAL ASSETS
  // ==========================================================================
  { sym: 'BNB', pair: 'BNB/USD', name: 'BNB Chain', cat: 'CRYPTO', price: 594.2, chgNum: 0.84, vol24hNum: 2.15, marketCap: '$86.4B' },
  { sym: 'XRP', pair: 'XRP/USD', name: 'XRP Ledger', cat: 'CRYPTO', price: 0.548, priceFormatted: '$0.5480', chgNum: -0.62, vol24hNum: 1.92, marketCap: '$31.1B' },
  { sym: 'DOGE', pair: 'DOGE/USD', name: 'Dogecoin', cat: 'CRYPTO', price: 0.144, priceFormatted: '$0.1440', chgNum: 4.12, vol24hNum: 2.48, marketCap: '$21.0B' },
  { sym: 'ADA', pair: 'ADA/USD', name: 'Cardano', cat: 'CRYPTO', price: 0.362, priceFormatted: '$0.3620', chgNum: 0.45, vol24hNum: 0.68, marketCap: '$12.9B' },
  { sym: 'TRX', pair: 'TRX/USD', name: 'TRON Network', cat: 'CRYPTO', price: 0.165, priceFormatted: '$0.1650', chgNum: 0.72, vol24hNum: 0.84, marketCap: '$14.3B' },
  { sym: 'AVAX', pair: 'AVAX/USD', name: 'Avalanche', cat: 'CRYPTO', price: 27.85, chgNum: 2.18, vol24hNum: 0.96, marketCap: '$11.4B' },
  { sym: 'LINK', pair: 'LINK/USD', name: 'Chainlink Oracle Network', cat: 'CRYPTO', price: 11.95, chgNum: 1.64, vol24hNum: 0.74, marketCap: '$7.5B' },
  { sym: 'SUI', pair: 'SUI/USD', name: 'Sui Move Layer-1', cat: 'CRYPTO', price: 2.08, chgNum: 3.45, vol24hNum: 1.38, marketCap: '$5.8B' },
  { sym: 'NEAR', pair: 'NEAR/USD', name: 'NEAR Protocol (AI Sharded L1)', cat: 'CRYPTO', price: 4.82, chgNum: 1.92, vol24hNum: 0.62, marketCap: '$5.9B' },
  { sym: 'DOT', pair: 'DOT/USD', name: 'Polkadot Relay Chain', cat: 'CRYPTO', price: 4.38, chgNum: -0.28, vol24hNum: 0.42, marketCap: '$6.3B' },
  { sym: 'UNI', pair: 'UNI/USD', name: 'Uniswap Protocol', cat: 'CRYPTO', price: 7.94, chgNum: 1.48, vol24hNum: 0.54, marketCap: '$4.8B' },
  { sym: 'AAVE', pair: 'AAVE/USD', name: 'Aave Liquidity Protocol', cat: 'CRYPTO', price: 154.6, chgNum: 2.34, vol24hNum: 0.49, marketCap: '$2.3B' },

  // ==========================================================================
  // 5. RATES — SOVEREIGN YIELD CURVE BENCHMARKS (LINKED TO 40 COUNTRIES)
  // ==========================================================================
  { sym: 'US2Y', pair: 'US2Y/YLD', name: 'US 2-Year Treasury Yield', cat: 'RATES', unit: 'yield', countryCode: 'US', price: 4.08, chgNum: 0.42, vol24hNum: 68.4 },
  { sym: 'US5Y', pair: 'US5Y/YLD', name: 'US 5-Year Treasury Yield', cat: 'RATES', unit: 'yield', countryCode: 'US', price: 4.04, chgNum: 0.55, vol24hNum: 54.2 },
  { sym: 'US10Y', pair: 'US10Y/YLD', name: 'US 10-Year Benchmark Yield', cat: 'RATES', unit: 'yield', countryCode: 'US', price: 4.24, chgNum: 0.68, vol24hNum: 82.5 },
  { sym: 'US30Y', pair: 'US30Y/YLD', name: 'US 30-Year Long Bond Yield', cat: 'RATES', unit: 'yield', countryCode: 'US', price: 4.51, chgNum: 0.72, vol24hNum: 38.9 },
  { sym: 'DE10Y', pair: 'DE10Y/YLD', name: 'Germany 10-Year Bund Yield', cat: 'RATES', unit: 'yield', countryCode: 'DE', price: 2.28, chgNum: 0.35, vol24hNum: 46.2 },
  { sym: 'UK10Y', pair: 'UK10Y/YLD', name: 'UK 10-Year Gilt Yield', cat: 'RATES', unit: 'yield', countryCode: 'GB', price: 4.22, chgNum: 0.48, vol24hNum: 28.4 },
  { sym: 'JP10Y', pair: 'JP10Y/YLD', name: 'Japan 10-Year JGB Yield', cat: 'RATES', unit: 'yield', countryCode: 'JP', price: 0.96, chgNum: 0.92, vol24hNum: 34.1 },
  { sym: 'FR10Y', pair: 'FR10Y/YLD', name: 'France 10-Year OAT Yield', cat: 'RATES', unit: 'yield', countryCode: 'FR', price: 3.02, chgNum: 0.41, vol24hNum: 24.6 },
  { sym: 'IT10Y', pair: 'IT10Y/YLD', name: 'Italy 10-Year BTP Yield', cat: 'RATES', unit: 'yield', countryCode: 'IT', price: 3.51, chgNum: 0.29, vol24hNum: 22.8 },
  { sym: 'ES10Y', pair: 'ES10Y/YLD', name: 'Spain 10-Year Bonos Yield', cat: 'RATES', unit: 'yield', countryCode: 'ES', price: 2.98, chgNum: 0.24, vol24hNum: 16.4 },
  { sym: 'CA10Y', pair: 'CA10Y/YLD', name: 'Canada 10-Year Govt Bond Yield', cat: 'RATES', unit: 'yield', countryCode: 'CA', price: 3.22, chgNum: 0.38, vol24hNum: 18.2 },
  { sym: 'AU10Y', pair: 'AU10Y/YLD', name: 'Australia 10-Year ACGB Yield', cat: 'RATES', unit: 'yield', countryCode: 'AU', price: 4.46, chgNum: 0.51, vol24hNum: 14.9 },
  { sym: 'CH10Y', pair: 'CH10Y/YLD', name: 'Switzerland 10-Year Conf Yield', cat: 'RATES', unit: 'yield', countryCode: 'CH', price: 0.44, chgNum: -0.22, vol24hNum: 9.8 },
  { sym: 'CN10Y', pair: 'CN10Y/YLD', name: 'China 10-Year Sovereign CGB Yield', cat: 'RATES', unit: 'yield', countryCode: 'CN', price: 2.14, chgNum: -0.35, vol24hNum: 29.4 },
  { sym: 'IN10Y', pair: 'IN10Y/YLD', name: 'India 10-Year G-Sec Yield', cat: 'RATES', unit: 'yield', countryCode: 'IN', price: 6.82, chgNum: 0.14, vol24hNum: 15.6 },
  { sym: 'BR10Y', pair: 'BR10Y/YLD', name: 'Brazil 10-Year NTN-F Sovereign Yield', cat: 'RATES', unit: 'yield', countryCode: 'BR', price: 12.65, chgNum: 0.85, vol24hNum: 11.4 },
  { sym: 'MX10Y', pair: 'MX10Y/YLD', name: 'Mexico 10-Year Mbono Yield', cat: 'RATES', unit: 'yield', countryCode: 'MX', price: 10.05, chgNum: 0.62, vol24hNum: 9.2 },
  { sym: 'KR10Y', pair: 'KR10Y/YLD', name: 'South Korea 10-Year KTB Yield', cat: 'RATES', unit: 'yield', countryCode: 'KR', price: 3.08, chgNum: 0.19, vol24hNum: 12.1 },
  { sym: 'ZA10Y', pair: 'ZA10Y/YLD', name: 'South Africa 10-Year R2035 Yield', cat: 'RATES', unit: 'yield', countryCode: 'ZA', price: 10.45, chgNum: -0.31, vol24hNum: 6.8 },

  // ==========================================================================
  // 6. FIXED_INCOME — STRICTLY US TREASURY NOTES, BONDS & TIPS ONLY
  // ==========================================================================
  { sym: 'UST-2Y', pair: 'UST2Y/USD', name: 'US Treasury 2-Year Note (4.125% Coupon)', cat: 'FIXED_INCOME', countryCode: 'US', price: 99.64, chgNum: -0.08, vol24hNum: 74.2 },
  { sym: 'UST-3Y', pair: 'UST3Y/USD', name: 'US Treasury 3-Year Note (4.000% Coupon)', cat: 'FIXED_INCOME', countryCode: 'US', price: 99.42, chgNum: -0.12, vol24hNum: 42.8 },
  { sym: 'UST-5Y', pair: 'UST5Y/USD', name: 'US Treasury 5-Year Note (3.875% Coupon)', cat: 'FIXED_INCOME', countryCode: 'US', price: 98.85, chgNum: -0.24, vol24hNum: 64.5 },
  { sym: 'UST-7Y', pair: 'UST7Y/USD', name: 'US Treasury 7-Year Note (4.000% Coupon)', cat: 'FIXED_INCOME', countryCode: 'US', price: 98.12, chgNum: -0.31, vol24hNum: 38.4 },
  { sym: 'UST-10Y', pair: 'UST10Y/USD', name: 'US Treasury 10-Year Benchmark Note', cat: 'FIXED_INCOME', countryCode: 'US', price: 97.38, chgNum: -0.45, vol24hNum: 92.6 },
  { sym: 'UST-20Y', pair: 'UST20Y/USD', name: 'US Treasury 20-Year Bond (4.250% Coupon)', cat: 'FIXED_INCOME', countryCode: 'US', price: 93.6, chgNum: -0.62, vol24hNum: 29.4 },
  { sym: 'UST-30Y', pair: 'UST30Y/USD', name: 'US Treasury 30-Year Long Bond', cat: 'FIXED_INCOME', countryCode: 'US', price: 91.85, chgNum: -0.78, vol24hNum: 48.2 },
  { sym: 'UST-5Y-TIPS', pair: 'TIPS5Y/USD', name: 'US Treasury 5-Year Inflation-Protected (TIPS)', cat: 'FIXED_INCOME', countryCode: 'US', price: 101.2, chgNum: 0.18, vol24hNum: 19.6 },
  { sym: 'UST-10Y-TIPS', pair: 'TIPS10Y/USD', name: 'US Treasury 10-Year Inflation-Protected (TIPS)', cat: 'FIXED_INCOME', countryCode: 'US', price: 99.88, chgNum: 0.14, vol24hNum: 24.8 },

  // ==========================================================================
  // 7. FX — WORLD CURRENCIES VS USD + DXY + TRIANGULATION ENGINE
  // ==========================================================================
  { sym: 'DXY', pair: 'DXY/INDEX', name: 'US Dollar Index (ICE Spot)', cat: 'FX', unit: 'pts', price: 104.28, chgNum: 0.24, vol24hNum: 48.5 },
  { sym: 'EUR/USD', pair: 'EUR/USD', name: 'Euro / US Dollar (G10 Major)', cat: 'FX', unit: 'fx', price: 1.0818, chgNum: -0.22, vol24hNum: 185.4 },
  { sym: 'USD/JPY', pair: 'USD/JPY', name: 'US Dollar / Japanese Yen (G10 Major)', cat: 'FX', unit: 'fx', price: 152.85, chgNum: 0.48, vol24hNum: 142.8 },
  { sym: 'GBP/USD', pair: 'GBP/USD', name: 'British Pound / US Dollar (G10 Major)', cat: 'FX', unit: 'fx', price: 1.2974, chgNum: -0.15, vol24hNum: 96.2 },
  { sym: 'USD/CHF', pair: 'USD/CHF', name: 'US Dollar / Swiss Franc (G10 Major)', cat: 'FX', unit: 'fx', price: 0.8662, chgNum: 0.12, vol24hNum: 54.6 },
  { sym: 'AUD/USD', pair: 'AUD/USD', name: 'Australian Dollar / US Dollar (G10)', cat: 'FX', unit: 'fx', price: 0.6588, chgNum: -0.34, vol24hNum: 49.2 },
  { sym: 'USD/CAD', pair: 'USD/CAD', name: 'US Dollar / Canadian Dollar (G10)', cat: 'FX', unit: 'fx', price: 1.3885, chgNum: 0.19, vol24hNum: 52.1 },
  { sym: 'NZD/USD', pair: 'NZD/USD', name: 'New Zealand Dollar / US Dollar (G10)', cat: 'FX', unit: 'fx', price: 0.5982, chgNum: -0.41, vol24hNum: 21.8 },
  { sym: 'USD/CNH', pair: 'USD/CNH', name: 'US Dollar / Offshore Chinese Yuan', cat: 'FX', unit: 'fx', price: 7.128, chgNum: 0.16, vol24hNum: 68.4 },
  { sym: 'USD/MXN', pair: 'USD/MXN', name: 'US Dollar / Mexican Peso', cat: 'FX', unit: 'fx', price: 19.96, chgNum: 0.54, vol24hNum: 34.2 },
  { sym: 'USD/BRL', pair: 'USD/BRL', name: 'US Dollar / Brazilian Real', cat: 'FX', unit: 'fx', price: 5.705, chgNum: 0.62, vol24hNum: 28.9 },
  { sym: 'USD/INR', pair: 'USD/INR', name: 'US Dollar / Indian Rupee', cat: 'FX', unit: 'fx', price: 84.08, chgNum: 0.08, vol24hNum: 26.4 },
  { sym: 'USD/SGD', pair: 'USD/SGD', name: 'US Dollar / Singapore Dollar', cat: 'FX', unit: 'fx', price: 1.3215, chgNum: 0.14, vol24hNum: 38.6 },
  { sym: 'USD/KRW', pair: 'USD/KRW', name: 'US Dollar / South Korean Won', cat: 'FX', unit: 'fx', price: 1384.5, chgNum: 0.32, vol24hNum: 24.5 },
  { sym: 'USD/ZAR', pair: 'USD/ZAR', name: 'US Dollar / South African Rand', cat: 'FX', unit: 'fx', price: 17.68, chgNum: -0.28, vol24hNum: 16.8 },
  { sym: 'USD/TRY', pair: 'USD/TRY', name: 'US Dollar / Turkish Lira', cat: 'FX', unit: 'fx', price: 34.28, chgNum: 0.21, vol24hNum: 14.2 },
  { sym: 'USD/PLN', pair: 'USD/PLN', name: 'US Dollar / Polish Zloty', cat: 'FX', unit: 'fx', price: 4.018, chgNum: 0.26, vol24hNum: 12.4 },
  { sym: 'USD/SEK', pair: 'USD/SEK', name: 'US Dollar / Swedish Krona', cat: 'FX', unit: 'fx', price: 10.58, chgNum: 0.31, vol24hNum: 15.9 },
  { sym: 'USD/NOK', pair: 'USD/NOK', name: 'US Dollar / Norwegian Krone', cat: 'FX', unit: 'fx', price: 10.94, chgNum: 0.38, vol24hNum: 14.1 },
  { sym: 'USD/ARS', pair: 'USD/ARS', name: 'US Dollar / Argentine Peso (Official)', cat: 'FX', unit: 'fx', price: 988.5, chgNum: 0.12, vol24hNum: 4.2 },
  { sym: 'USD/CLP', pair: 'USD/CLP', name: 'US Dollar / Chilean Peso', cat: 'FX', unit: 'fx', price: 948.2, chgNum: 0.44, vol24hNum: 6.8 },
  { sym: 'USD/COP', pair: 'USD/COP', name: 'US Dollar / Colombian Peso', cat: 'FX', unit: 'fx', price: 4285.0, chgNum: 0.52, vol24hNum: 5.4 },

  // ==========================================================================
  // 8. COMMODITY — ENERGY, PRECIOUS, INDUSTRIAL/BATTERY METALS & AGRICULTURE
  // ==========================================================================
  { sym: 'CL', pair: 'WTI/USD', name: 'WTI Crude Oil (NYMEX Front Month)', cat: 'COMMODITY', price: 68.4, chgNum: -1.15, vol24hNum: 54.8 },
  { sym: 'BZ', pair: 'BRENT/USD', name: 'Brent Crude Oil (ICE Global Benchmark)', cat: 'COMMODITY', price: 72.15, chgNum: -0.98, vol24hNum: 48.2 },
  { sym: 'NG', pair: 'NATGAS/USD', name: 'Henry Hub Natural Gas (NYMEX)', cat: 'COMMODITY', price: 2.58, chgNum: 2.14, vol24hNum: 19.6 },
  { sym: 'TTF', pair: 'TTF/EUR', name: 'European Dutch TTF Natural Gas', cat: 'COMMODITY', price: 41.8, chgNum: 1.45, vol24hNum: 14.8 },
  { sym: 'RB', pair: 'RBOB/USD', name: 'RBOB Gasoline Futures (NYMEX)', cat: 'COMMODITY', price: 1.98, chgNum: -0.85, vol24hNum: 9.4 },
  { sym: 'HO', pair: 'HO/USD', name: 'ULSD Heating Oil / Diesel (NYMEX)', cat: 'COMMODITY', price: 2.16, chgNum: -0.72, vol24hNum: 8.6 },
  { sym: 'UX', pair: 'U3O8/USD', name: 'Uranium Spot U3O8 (Nuclear Fuel)', cat: 'COMMODITY', price: 81.5, chgNum: 1.62, vol24hNum: 4.2 },
  { sym: 'GC', pair: 'XAU/USD', name: 'Gold Spot / COMEX Futures (oz)', cat: 'COMMODITY', price: 2748.5, chgNum: 0.78, vol24hNum: 62.4 },
  { sym: 'SI', pair: 'XAG/USD', name: 'Silver Spot / COMEX Futures (oz)', cat: 'COMMODITY', price: 33.85, chgNum: 1.42, vol24hNum: 24.8 },
  { sym: 'PL', pair: 'XPT/USD', name: 'Platinum Spot / NYMEX (oz)', cat: 'COMMODITY', price: 1028.0, chgNum: 0.64, vol24hNum: 6.2 },
  { sym: 'PA', pair: 'XPD/USD', name: 'Palladium Spot / NYMEX (oz)', cat: 'COMMODITY', price: 1185.0, chgNum: 1.85, vol24hNum: 4.8 },
  { sym: 'HG', pair: 'COPPER/USD', name: 'Copper High-Grade (COMEX $/lb)', cat: 'COMMODITY', price: 4.38, chgNum: 0.52, vol24hNum: 28.4 },
  { sym: 'ALI', pair: 'ALUM/USD', name: 'Primary Aluminum (LME $/mt)', cat: 'COMMODITY', price: 2645.0, chgNum: 0.44, vol24hNum: 14.2 },
  { sym: 'NICKEL', pair: 'NI/USD', name: 'Primary Nickel (LME $/mt)', cat: 'COMMODITY', price: 16120.0, chgNum: -0.68, vol24hNum: 8.4 },
  { sym: 'ZINC', pair: 'ZN/USD', name: 'Special High-Grade Zinc (LME $/mt)', cat: 'COMMODITY', price: 3140.0, chgNum: 0.31, vol24hNum: 7.9 },
  { sym: 'LITH', pair: 'LCE/USD', name: 'Battery-Grade Lithium Carbonate ($/mt)', cat: 'COMMODITY', price: 10650.0, chgNum: 0.95, vol24hNum: 5.6 },
  { sym: 'TIO', pair: 'FE62/USD', name: 'Iron Ore 62% Fe CFR Benchmark ($/mt)', cat: 'COMMODITY', price: 104.2, chgNum: 0.88, vol24hNum: 18.4 },
  { sym: 'ZS', pair: 'SOY/USd', name: 'Soybeans Futures (CBOT ¢/bu)', cat: 'COMMODITY', price: 988.5, chgNum: -0.42, vol24hNum: 12.6 },
  { sym: 'ZC', pair: 'CORN/USd', name: 'Corn Futures (CBOT ¢/bu)', cat: 'COMMODITY', price: 415.25, chgNum: 0.36, vol24hNum: 11.8 },
  { sym: 'ZW', pair: 'WHEAT/USd', name: 'SRW Wheat Futures (CBOT ¢/bu)', cat: 'COMMODITY', price: 572.5, chgNum: -0.58, vol24hNum: 8.4 },
  { sym: 'ZM', pair: 'SM/USD', name: 'Soybean Meal Futures (CBOT $/st)', cat: 'COMMODITY', price: 308.4, chgNum: -0.35, vol24hNum: 5.2 },
  { sym: 'ZL', pair: 'BO/USd', name: 'Soybean Oil Futures (CBOT ¢/lb)', cat: 'COMMODITY', price: 43.2, chgNum: 0.74, vol24hNum: 5.8 },
  { sym: 'KC', pair: 'COFFEE/USd', name: 'Coffee Arabica Futures (ICE ¢/lb)', cat: 'COMMODITY', price: 252.4, chgNum: 1.28, vol24hNum: 6.4 },
  { sym: 'CC', pair: 'COCOA/USD', name: 'Cocoa Futures (ICE $/mt)', cat: 'COMMODITY', price: 7180.0, chgNum: 2.15, vol24hNum: 5.9 },
  { sym: 'SB', pair: 'SUGAR/USd', name: 'Sugar No. 11 World Futures (ICE ¢/lb)', cat: 'COMMODITY', price: 22.15, chgNum: 0.45, vol24hNum: 4.8 },
  { sym: 'CT', pair: 'COTTON/USd', name: 'Cotton No. 2 Futures (ICE ¢/lb)', cat: 'COMMODITY', price: 70.8, chgNum: -0.22, vol24hNum: 3.1 },

  // ==========================================================================
  // 9. DERIVATIVES_VOL — VOL INDICES, TOP FUTURES & HIGH-VOLUME EQUITY OPTIONS
  // ==========================================================================
  { sym: 'VIX', pair: 'VIX/PTS', name: 'CBOE S&P 500 Volatility Index', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'SPY', price: 19.24, chgNum: -2.45, vol24hNum: 38.4 },
  { sym: 'VXN', pair: 'VXN/PTS', name: 'CBOE Nasdaq-100 Volatility Index', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'QQQ', price: 22.65, chgNum: -1.85, vol24hNum: 18.2 },
  { sym: 'MOVE', pair: 'MOVE/PTS', name: 'ICE BofA US Bond Market Option Vol Index', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'TLT', price: 124.8, chgNum: 1.42, vol24hNum: 24.6 },
  { sym: 'V2X', pair: 'V2X/PTS', name: 'Euro Stoxx 50 Volatility Index (VSTOXX)', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'SX5E', price: 18.4, chgNum: -1.12, vol24hNum: 11.4 },
  { sym: 'GVZ', pair: 'GVZ/PTS', name: 'CBOE Gold ETF Volatility Index', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'GLD', price: 17.85, chgNum: 0.65, vol24hNum: 7.8 },
  { sym: 'OVX', pair: 'OVX/PTS', name: 'CBOE Crude Oil ETF Volatility Index', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'USO', price: 38.6, chgNum: -2.1, vol24hNum: 9.2 },
  { sym: 'ES', pair: 'ES1!/USD', name: 'CME E-Mini S&P 500 Futures', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'SPY', price: 5892.5, chgNum: 0.48, vol24hNum: 165.0 },
  { sym: 'NQ', pair: 'NQ1!/USD', name: 'CME E-Mini Nasdaq-100 Futures', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'QQQ', price: 20615.0, chgNum: 0.64, vol24hNum: 118.4 },
  { sym: 'ZN', pair: 'ZN1!/USD', name: 'CBOT 10-Year US Treasury Note Futures', cat: 'DERIVATIVES_VOL', underlyingSym: 'UST-10Y', price: 110.84, chgNum: -0.38, vol24hNum: 96.2 },
  { sym: 'ZB', pair: 'ZB1!/USD', name: 'CBOT 30-Year US Treasury Bond Futures', cat: 'DERIVATIVES_VOL', underlyingSym: 'UST-30Y', price: 118.62, chgNum: -0.64, vol24hNum: 48.5 },
  { sym: 'SR3', pair: 'SR31!/USD', name: 'CME 3-Month SOFR Interest Rate Futures', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'SOFR', price: 95.88, chgNum: -0.06, vol24hNum: 142.0 },
  { sym: 'NVDA-OPT', pair: 'NVDA/30D-ATM', name: 'NVDA High-Vol 30D ATM Options Straddle (OI > 50k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'NVDA', price: 11.4, chgNum: 4.25, vol24hNum: 18.6 },
  { sym: 'SPY-OPT', pair: 'SPY/30D-ATM', name: 'SPY High-Vol 30D ATM Options Straddle (OI > 100k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'SPY', price: 14.2, chgNum: -1.65, vol24hNum: 32.4 },
  { sym: 'QQQ-OPT', pair: 'QQQ/30D-ATM', name: 'QQQ High-Vol 30D ATM Options Straddle (OI > 85k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'QQQ', price: 15.8, chgNum: -1.18, vol24hNum: 24.1 },
  { sym: 'TSLA-OPT', pair: 'TSLA/30D-ATM', name: 'TSLA High-Vol 30D ATM Options Straddle (OI > 60k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'TSLA', price: 24.6, chgNum: 5.12, vol24hNum: 16.9 },
  { sym: 'AAPL-OPT', pair: 'AAPL/30D-ATM', name: 'AAPL High-Vol 30D ATM Options Straddle (OI > 50k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'AAPL', price: 8.9, chgNum: 0.85, vol24hNum: 11.2 },
  { sym: 'AMD-OPT', pair: 'AMD/30D-ATM', name: 'AMD High-Vol 30D ATM Options Straddle (OI > 40k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'AMD', price: 12.8, chgNum: 3.15, vol24hNum: 9.8 },

  // ==========================================================================
  // 10. CASH — OVERNIGHT RATES, T-BILLS, MONEY MARKET & LIQUIDITY BENCHMARKS
  // ==========================================================================
  { sym: 'SOFR', pair: 'SOFR/RATE', name: 'NY Fed Secured Overnight Financing Rate', cat: 'CASH', unit: 'yield', price: 4.82, chgNum: 0.02, vol24hNum: 1940.0 },
  { sym: 'EFFR', pair: 'EFFR/RATE', name: 'Effective Federal Funds Rate (Fed)', cat: 'CASH', unit: 'yield', price: 4.83, chgNum: 0.0, vol24hNum: 112.0 },
  { sym: 'ESTR', pair: 'ESTR/RATE', name: 'Euro Short-Term Rate (€STR • ECB)', cat: 'CASH', unit: 'yield', price: 3.16, chgNum: -0.02, vol24hNum: 64.5 },
  { sym: 'SONIA', pair: 'SONIA/RATE', name: 'Sterling Overnight Index Average (BoE)', cat: 'CASH', unit: 'yield', price: 4.95, chgNum: 0.01, vol24hNum: 52.8 },
  { sym: 'TONAR', pair: 'TONAR/RATE', name: 'Tokyo Overnight Average Rate (BoJ)', cat: 'CASH', unit: 'yield', price: 0.23, chgNum: 0.05, vol24hNum: 28.4 },
  { sym: 'UST-1M-BILL', pair: 'TB1M/YLD', name: 'US 1-Month Treasury Bill Yield', cat: 'CASH', unit: 'yield', price: 4.74, chgNum: -0.04, vol24hNum: 48.2 },
  { sym: 'UST-3M-BILL', pair: 'TB3M/YLD', name: 'US 3-Month Treasury Bill Yield', cat: 'CASH', unit: 'yield', price: 4.62, chgNum: -0.06, vol24hNum: 76.4 },
  { sym: 'UST-6M-BILL', pair: 'TB6M/YLD', name: 'US 6-Month Treasury Bill Yield', cat: 'CASH', unit: 'yield', price: 4.44, chgNum: -0.08, vol24hNum: 54.1 },
  { sym: 'SGOV', pair: 'SGOV/USD', name: 'iShares 0-3 Month Treasury Bond ETF', cat: 'CASH', price: 100.52, chgNum: 0.02, vol24hNum: 2.85, marketCap: '$26.4B' },
  { sym: 'BIL', pair: 'BIL/USD', name: 'SPDR Bloomberg 1-3 Month T-Bill ETF', cat: 'CASH', price: 91.68, chgNum: 0.02, vol24hNum: 2.4, marketCap: '$34.8B' },
  { sym: 'FED-RRP', pair: 'RRP/RATE', name: 'Fed Overnight Reverse Repo Facility Award Rate', cat: 'CASH', unit: 'yield', price: 4.8, chgNum: 0.0, vol24hNum: 262.4 },
  { sym: 'USDT', pair: 'USDT/USD', name: 'Tether USD Institutional Liquidity Peg', cat: 'CASH', price: 1.0001, priceFormatted: '$1.0001', chgNum: 0.01, vol24hNum: 56.4, marketCap: '$120.2B' },
  { sym: 'USDC', pair: 'USDC/USD', name: 'Circle USD Coin Treasury-Backed Peg', cat: 'CASH', price: 1.0, priceFormatted: '$1.0000', chgNum: 0.0, vol24hNum: 8.9, marketCap: '$35.4B' },
];

export const ASSET_CATALOG = RAW_ASSET_UNIVERSE.map((raw, idx) => buildAssetEntry(raw, idx));

export const TICKER_ITEMS = ASSET_CATALOG.slice(0, 24).map((a) => ({
  sym: a.cat === 'CRYPTO' ? a.pair : a.sym,
  price: a.priceFormatted,
  chg: a.chg,
}));

export const GLOBAL_VOLUME_SPARKLINE = [
  { t: '01', v: 158 },
  { t: '02', v: 164 },
  { t: '03', v: 161 },
  { t: '04', v: 172 },
  { t: '05', v: 169 },
  { t: '06', v: 178 },
  { t: '07', v: 175 },
  { t: '08', v: 184.6 },
];

// Multi-granularity Time-Series Rollup Configuration:
// Intraday (1m, 5m, 1H, 1D) -> Daily Aggregated (1W, 1M, 3M) -> Monthly Aggregated (1Y, ALL)
export const TIMEFRAME_GRANULARITY_CONFIG = {
  '1M': {
    stamps: ['15:49', '15:50', '15:51', '15:52', '15:53', '15:54', '15:55', '15:56', '15:57', '15:58', '15:59', '16:00'],
    tfSeed: 101,
    totalDriftScale: 0.18,
    volAmpScale: 0.22,
    volMult: 0.35,
    granularity: '1m Intraday Bars',
  },
  '5M': {
    stamps: ['15:05', '15:10', '15:15', '15:20', '15:25', '15:30', '15:35', '15:40', '15:45', '15:50', '15:55', '16:00'],
    tfSeed: 203,
    totalDriftScale: 0.42,
    volAmpScale: 0.45,
    volMult: 0.6,
    granularity: '5m Intraday Bars',
  },
  '1H': {
    stamps: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    tfSeed: 307,
    totalDriftScale: 0.78,
    volAmpScale: 0.75,
    volMult: 0.9,
    granularity: '1H Session Bars',
  },
  '1D': {
    stamps: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    tfSeed: 409,
    totalDriftScale: 1.0,
    volAmpScale: 1.0,
    volMult: 1.15,
    granularity: 'Intraday (24h)',
  },
  '1W': {
    stamps: ['30 Oct', '31 Oct', '01 Nov', '02 Nov', '03 Nov', '04 Nov', '05 Nov'],
    tfSeed: 521,
    totalDriftScale: 2.35,
    volAmpScale: 1.75,
    volMult: 1.65,
    granularity: 'Daily Aggregated (1D Bars)',
  },
  '1M_CAL': {
    stamps: ['06 Oct', '09 Oct', '12 Oct', '15 Oct', '19 Oct', '22 Oct', '26 Oct', '29 Oct', '02 Nov', '05 Nov'],
    tfSeed: 631,
    totalDriftScale: 4.4,
    volAmpScale: 2.6,
    volMult: 2.4,
    granularity: 'Daily Aggregated (30D)',
  },
  '3M': {
    stamps: ['05 Aug', '15 Aug', '25 Aug', '04 Sep', '14 Sep', '24 Sep', '04 Oct', '15 Oct', '25 Oct', '05 Nov'],
    tfSeed: 743,
    totalDriftScale: 8.2,
    volAmpScale: 3.8,
    volMult: 3.5,
    granularity: 'Daily / Weekly Rollup (90D)',
  },
  '1Y': {
    stamps: ['Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26'],
    tfSeed: 859,
    totalDriftScale: 14.8,
    volAmpScale: 5.5,
    volMult: 5.2,
    granularity: 'Monthly Aggregated (12M)',
  },
  'ALL': {
    stamps: ['Jan 20', 'Jul 20', 'Jan 21', 'Jul 21', 'Jan 22', 'Jul 22', 'Jan 23', 'Jul 23', 'Jan 24', 'Jul 24', 'Jan 25', 'Nov 26'],
    tfSeed: 977,
    totalDriftScale: 24.5,
    volAmpScale: 7.8,
    volMult: 8.5,
    granularity: 'Monthly Rollup (2020–2026)',
  },
};

const SERIES_MEMORY_CACHE = {};

export function getAssetBySymbol(sym = 'BTC') {
  const clean = String(sym || 'BTC').replace(/1!$/, '').replace(/-USD$/i, '');
  const alias = clean === 'GB10Y' ? 'UK10Y' : clean;
  return (
    ASSET_CATALOG.find((a) => a.sym === sym) ||
    ASSET_CATALOG.find((a) => a.sym === clean) ||
    ASSET_CATALOG.find((a) => a.sym === alias) ||
    ASSET_CATALOG[0]
  );
}

/**
 * Synchronizes `ASSET_CATALOG` in-place with the live P-05 Market Intelligence Warehouse
 * (`/cloud/p05/api/v1/assets`) and P-03 Streaming Event Service (`/cloud/p03/health`) when reachable.
 */
export async function syncLiveMarketSnapshot() {
  try {
    const res = await fetch('/cloud/p05/api/v1/assets', {
      method: 'GET',
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return { synced: false, source: 'SNAPSHOT' };
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.assets || data?.items || [];
    let updatedCount = 0;

    rows.forEach((liveItem) => {
      const sym = String(liveItem.symbol || liveItem.sym || '').toUpperCase();
      const target = ASSET_CATALOG.find((a) => a.sym === sym);
      if (target && typeof liveItem.price === 'number' && liveItem.price > 0) {
        target.price = liveItem.price;
        target.priceFormatted = `$${liveItem.price.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
        if (typeof liveItem.change_pct === 'number') {
          target.chgNum = Number(liveItem.change_pct.toFixed(2));
          target.chg = `${target.chgNum >= 0 ? '+' : ''}${target.chgNum.toFixed(2)}%`;
        }
        updatedCount += 1;
      }
    });

    return {
      synced: updatedCount > 0,
      updatedCount,
      source: 'LIVE • P-05 Cloud Run',
    };
  } catch {
    return { synced: false, source: 'SNAPSHOT' };
  }
}

export function getAssetSeries(sym = 'BTC', timeframe = '1D') {
  const asset = getAssetBySymbol(sym);
  const tfKey = timeframe === '1M_HIST' ? '1M_CAL' : timeframe;
  const cfg = TIMEFRAME_GRANULARITY_CONFIG[tfKey] || TIMEFRAME_GRANULARITY_CONFIG['1D'];
  const cacheKey = `${asset.sym}_${tfKey}_${asset.price}`;
  if (SERIES_MEMORY_CACHE[cacheKey]) {
    return SERIES_MEMORY_CACHE[cacheKey];
  }

  const h = hashSym(`${asset.sym}:${tfKey}`);
  const symHash = hashSym(asset.sym);
  const stamps = cfg.stamps || TIMEFRAME_GRANULARITY_CONFIG['1D'].stamps;
  const n = stamps.length;
  const decimals = asset.price < 5 ? 4 : asset.price > 500 ? 1 : 2;

  const isLowVolClass = asset.cat === 'CASH' || asset.cat === 'FIXED_INCOME';
  const isMacroRate = asset.cat === 'FX' || asset.cat === 'RATES';
  const baseVolAmp = isLowVolClass ? 0.0022 : isMacroRate ? 0.0048 : 0.0115;
  const volAmp = baseVolAmp * cfg.volAmpScale;

  // Compute start-to-end structural drift distinct per timeframe and asset
  const dailyChgFrac = (asset.chgNum || 0.35) / 100;
  const tfSign =
    tfKey === '1W' || tfKey === '3M'
      ? ((symHash + cfg.tfSeed) % 5 === 0 ? -0.65 : 1.0)
      : 1.0;
  const rawDrift = dailyChgFrac * cfg.totalDriftScale * tfSign;
  const clampedDrift = Math.max(-0.58, Math.min(0.72, rawDrift));
  const startRatio = Math.max(0.28, 1 - clampedDrift);

  // Build realistic multi-harmonic path with timeframe-specific macro regime inflections
  const ratios = [];
  let rw = 0;
  for (let i = 0; i < n; i++) {
    if (i === n - 1) {
      ratios.push(1.0);
      continue;
    }
    const progress = i / (n - 1);
    // Macro regime cycle (e.g. for ALL / 1Y: 2022 dip + 2024-2026 expansion; for intraday: session U-shape)
    const freq1 = 1.35 + ((h % 7) * 0.28);
    const freq2 = 2.9 + (((h >> 3) % 5) * 0.42);
    const freq3 = 5.4 + (((h >> 6) % 7) * 0.55);
    const phase1 = (h % 19) * 0.33;
    const phase2 = ((h >> 4) % 13) * 0.47;

    const stepNoise =
      Math.sin(i * 1.7 + phase1) * 0.45 +
      Math.cos(i * 2.6 + phase2) * 0.35 +
      Math.sin(i * 4.1 + (h % 11)) * 0.2;
    rw = rw * 0.72 + stepNoise * volAmp * 0.55;

    const cycle1 = Math.sin(progress * Math.PI * freq1 + phase1) * volAmp * 0.85;
    const cycle2 = Math.cos(progress * Math.PI * freq2 + phase2) * volAmp * 0.48;
    const cycle3 = Math.sin(progress * Math.PI * freq3) * volAmp * 0.24;

    // Smoothly pin endpoints: taper oscillation at i=n-1 so last point lands cleanly on current price
    const endTaper = 1 - Math.pow(progress, 3.2) * 0.75;
    const trendRatio = startRatio + (1 - startRatio) * Math.pow(progress, tfKey === 'ALL' ? 1.35 : 1.0);
    const r = Math.max(0.18, trendRatio + (cycle1 + cycle2 + cycle3 + rw) * endTaper);
    ratios.push(r);
  }

  const baseVol = 110 + (symHash % 180);
  const startVal = ratios[0] || 1;

  const series = ratios.map((ratio, idx) => {
    const time = stamps[idx];
    const rawPrice = asset.price * ratio;
    const roundedPrice = Number(rawPrice.toFixed(decimals));

    // 5-bar moving average for SMA20 proxy and session VWAP
    let winSum = 0;
    let winCount = 0;
    const lookback = Math.min(6, idx + 1);
    for (let k = idx - lookback + 1; k <= idx; k++) {
      winSum += ratios[Math.max(0, k)];
      winCount += 1;
    }
    const smaRatio = winSum / Math.max(1, winCount);
    const sma20 = Number((asset.price * smaRatio).toFixed(decimals));
    const vwap = Number(((roundedPrice * 0.58 + sma20 * 0.42)).toFixed(decimals));

    const bbSpread = roundedPrice * Math.max(0.006, volAmp * 1.35);
    const bbUpper = Number((sma20 + bbSpread).toFixed(decimals));
    const bbLower = Number((sma20 - bbSpread).toFixed(decimals));
    const pctFromStart = Number((((ratio - startVal) / Math.max(0.0001, startVal)) * 100).toFixed(2));

    // U-shaped session volume profile + volatility spikes on large moves
    const prevRatio = idx > 0 ? ratios[idx - 1] : ratio;
    const barMove = Math.abs(ratio - prevRatio) / Math.max(0.001, volAmp);
    const uShape = 1 + 0.35 * Math.cos((idx / Math.max(1, n - 1) - 0.5) * 2 * Math.PI);
    const barVol = Math.round(baseVol * cfg.volMult * uShape * (0.75 + Math.min(1.6, barMove * 0.85)));

    return {
      time,
      price: roundedPrice,
      sma20,
      vwap,
      bbUpper,
      bbLower,
      pctReturn: pctFromStart,
      vol: barVol,
      granularity: cfg.granularity,
    };
  });

  SERIES_MEMORY_CACHE[cacheKey] = series;
  return series;
}
