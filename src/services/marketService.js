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
  LIVE_CHART_SERIES_CACHE,
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
  LIVE_CHART_SERIES_CACHE,
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
    price: 80240.0,
    priceFormatted: '$80,240.00',
    chg: '+1.85%',
    chgNum: 1.85,
    vol24h: '$46.85B',
    vol24hNum: 46.85,
    volChg24h: '+12.4%',
    marketCap: '$1.59T',
    indicators: { rsi14: 61.4, macd: '+482.5', macdSignal: 'BULLISH CROSS', bbWidth: '4.8%' },
  },
  {
    sym: 'ETH',
    pair: 'ETH/USD',
    name: 'Ethereum',
    cat: 'CRYPTO',
    source: 'P-02 • CoinGecko / BigQuery',
    price: 2405.2,
    priceFormatted: '$2,405.20',
    chg: '+0.92%',
    chgNum: 0.92,
    vol24h: '$18.42B',
    vol24hNum: 18.42,
    volChg24h: '+4.1%',
    marketCap: '$289.8B',
    indicators: { rsi14: 54.2, macd: '+16.4', macdSignal: 'NEUTRAL-BULL', bbWidth: '3.9%' },
  },
  {
    sym: 'SOL',
    pair: 'SOL/USD',
    name: 'Solana',
    cat: 'CRYPTO',
    source: 'P-02 • CoinGecko / BigQuery',
    price: 95.6,
    priceFormatted: '$95.60',
    chg: '+3.14%',
    chgNum: 3.14,
    vol24h: '$5.84B',
    vol24hNum: 5.84,
    volChg24h: '+48.7%',
    marketCap: '$45.4B',
    indicators: { rsi14: 76.8, macd: '+3.42', macdSignal: 'OVEREXTENDED', bbWidth: '9.4%' },
  },
  {
    sym: 'NVDA',
    pair: 'NVDA/USD',
    name: 'Nvidia Corp. (S&P 500 / NDX)',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 198.45,
    priceFormatted: '$198.45',
    chg: '+2.45%',
    chgNum: 2.45,
    vol24h: '$42.60B',
    vol24hNum: 42.6,
    volChg24h: '+19.2%',
    marketCap: '$4.85T',
    indicators: { rsi14: 64.9, macd: '+3.06', macdSignal: 'BULLISH TREND', bbWidth: '5.2%' },
  },
  {
    sym: 'AAPL',
    pair: 'AAPL/USD',
    name: 'Apple Inc. (S&P 500 / NDX)',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 349.4,
    priceFormatted: '$349.40',
    chg: '+0.32%',
    chgNum: 0.32,
    vol24h: '$14.85B',
    vol24hNum: 14.85,
    volChg24h: '-3.2%',
    marketCap: '$5.28T',
    indicators: { rsi14: 52.1, macd: '+0.96', macdSignal: 'ACCUMULATION', bbWidth: '2.7%' },
  },
  {
    sym: 'MSFT',
    pair: 'MSFT/USD',
    name: 'Microsoft Corp. (S&P 500 / NDX)',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 555.5,
    priceFormatted: '$555.50',
    chg: '-0.15%',
    chgNum: -0.15,
    vol24h: '$11.24B',
    vol24hNum: 11.24,
    volChg24h: '-6.4%',
    marketCap: '$4.12T',
    indicators: { rsi14: 48.3, macd: '-0.58', macdSignal: 'CONSOLIDATING', bbWidth: '2.4%' },
  },
  {
    sym: 'AMZN',
    pair: 'AMZN/USD',
    name: 'Amazon.com Inc. (S&P 500 / NDX)',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 266.03,
    priceFormatted: '$266.03',
    chg: '+1.10%',
    chgNum: 1.1,
    vol24h: '$12.40B',
    vol24hNum: 12.4,
    volChg24h: '+7.8%',
    marketCap: '$2.88T',
    indicators: { rsi14: 57.6, macd: '+1.60', macdSignal: 'BULLISH CROSS', bbWidth: '3.5%' },
  },
  {
    sym: 'GOOGL',
    pair: 'GOOGL/USD',
    name: 'Alphabet Inc. (S&P 500 / NDX)',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 288.93,
    priceFormatted: '$288.93',
    chg: '+0.75%',
    chgNum: 0.75,
    vol24h: '$9.85B',
    vol24hNum: 9.85,
    volChg24h: '+2.9%',
    marketCap: '$3.56T',
    indicators: { rsi14: 55.0, macd: '+1.38', macdSignal: 'STEADY DRIFT', bbWidth: '3.1%' },
  },
  {
    sym: 'SPY',
    pair: 'SPY/USD',
    name: 'SPDR S&P 500 ETF Trust',
    cat: 'ETF',
    source: 'P-01 • Alpha Vantage / dbt Mart',
    price: 766.81,
    priceFormatted: '$766.81',
    chg: '+0.45%',
    chgNum: 0.45,
    vol24h: '$29.80B',
    vol24hNum: 29.8,
    volChg24h: '+1.5%',
    marketCap: '$785.0B',
    indicators: { rsi14: 58.9, macd: '+1.78', macdSignal: 'UPTREND', bbWidth: '2.1%' },
  },
  {
    sym: 'QQQ',
    pair: 'QQQ/USD',
    name: 'Invesco QQQ Trust (Nasdaq-100 ETF)',
    cat: 'ETF',
    source: 'P-01 • Alpha Vantage / dbt Mart',
    price: 691.95,
    priceFormatted: '$691.95',
    chg: '+0.60%',
    chgNum: 0.6,
    vol24h: '$21.40B',
    vol24hNum: 21.4,
    volChg24h: '+3.8%',
    marketCap: '$382.4B',
    indicators: { rsi14: 60.2, macd: '+2.67', macdSignal: 'UPTREND', bbWidth: '2.6%' },
  },

  // ==========================================================================
  // 1. INDEX — 24 GLOBAL BENCHMARK INDICES (US, EUROPE, ASIA-PACIFIC, LATAM)
  // ==========================================================================
  { sym: 'SPX', pair: 'SPX/PTS', name: 'S&P 500 Index (US Benchmark)', cat: 'INDEX', unit: 'pts', price: 7688.62, chgNum: 0.48, vol24hNum: 168.5, volChg24h: '+6.2%' },
  { sym: 'NDX', pair: 'NDX/PTS', name: 'Nasdaq-100 Index (US Tech)', cat: 'INDEX', unit: 'pts', price: 28437.17, chgNum: 0.64, vol24hNum: 124.8, volChg24h: '+8.1%' },
  { sym: 'DJI', pair: 'DJI/PTS', name: 'Dow Jones Industrial Average', cat: 'INDEX', unit: 'pts', price: 53356.12, chgNum: 0.22, vol24hNum: 42.6, volChg24h: '+1.9%' },
  { sym: 'RUT', pair: 'RUT/PTS', name: 'Russell 2000 Small-Cap Index', cat: 'INDEX', unit: 'pts', price: 2856.95, chgNum: -0.34, vol24hNum: 26.4, volChg24h: '-2.1%' },
  { sym: 'SOX', pair: 'SOX/PTS', name: 'PHLX Semiconductor Index', cat: 'INDEX', unit: 'pts', price: 7840.5, chgNum: 1.54, vol24hNum: 58.2, volChg24h: '+14.8%' },
  { sym: 'NYFANG', pair: 'FANG/PTS', name: 'NYSE FANG+ Mega-Cap Tech Index', cat: 'INDEX', unit: 'pts', price: 16420.0, chgNum: 1.18, vol24hNum: 49.6, volChg24h: '+11.4%' },
  { sym: 'SX5E', pair: 'SX5E/EUR', name: 'Euro Stoxx 50 Index (Eurozone)', cat: 'INDEX', unit: 'pts', price: 6306.24, chgNum: 0.31, vol24hNum: 32.4, volChg24h: '+3.2%' },
  { sym: 'DAX', pair: 'DAX/EUR', name: 'DAX 40 Performance Index (Germany)', cat: 'INDEX', unit: 'pts', price: 25864.62, chgNum: 0.42, vol24hNum: 22.9, volChg24h: '+4.5%' },
  { sym: 'UKX', pair: 'UKX/GBP', name: 'FTSE 100 Index (United Kingdom)', cat: 'INDEX', unit: 'pts', price: 10899.9, chgNum: -0.18, vol24hNum: 18.2, volChg24h: '-1.4%' },
  { sym: 'CAC', pair: 'CAC/EUR', name: 'CAC 40 Index (France)', cat: 'INDEX', unit: 'pts', price: 8250.2, chgNum: 0.19, vol24hNum: 14.6, volChg24h: '+2.0%' },
  { sym: 'SMI', pair: 'SMI/CHF', name: 'Swiss Market Index (Switzerland)', cat: 'INDEX', unit: 'pts', price: 13480.0, chgNum: 0.25, vol24hNum: 11.4, volChg24h: '+1.1%' },
  { sym: 'IBEX', pair: 'IBEX/EUR', name: 'IBEX 35 Index (Spain)', cat: 'INDEX', unit: 'pts', price: 14620.0, chgNum: 0.52, vol24hNum: 8.4, volChg24h: '+5.3%' },
  { sym: 'FTSEMIB', pair: 'MIB/EUR', name: 'FTSE MIB Index (Italy)', cat: 'INDEX', unit: 'pts', price: 41850.0, chgNum: 0.47, vol24hNum: 9.1, volChg24h: '+3.8%' },
  { sym: 'NKY', pair: 'NKY/JPY', name: 'Nikkei 225 Index (Japan)', cat: 'INDEX', unit: 'pts', price: 61077.9, chgNum: 0.88, vol24hNum: 42.5, volChg24h: '+9.4%' },
  { sym: 'TPX', pair: 'TPX/JPY', name: 'TOPIX Index (Tokyo Stock Exchange)', cat: 'INDEX', unit: 'pts', price: 4185.4, chgNum: 0.65, vol24hNum: 31.2, volChg24h: '+6.1%' },
  { sym: 'HSI', pair: 'HSI/HKD', name: 'Hang Seng Index (Hong Kong)', cat: 'INDEX', unit: 'pts', price: 24736.1, chgNum: 1.24, vol24hNum: 34.8, volChg24h: '+15.2%' },
  { sym: 'SHCOMP', pair: 'SHCOMP/CNY', name: 'SSE Shanghai Composite Index', cat: 'INDEX', unit: 'pts', price: 3685.2, chgNum: 0.72, vol24hNum: 64.4, volChg24h: '+12.8%' },
  { sym: 'CSI300', pair: 'CSI300/CNY', name: 'CSI 300 Index (China A-Shares)', cat: 'INDEX', unit: 'pts', price: 4420.8, chgNum: 0.81, vol24hNum: 48.1, volChg24h: '+10.6%' },
  { sym: 'KOSPI', pair: 'KOSPI/KRW', name: 'KOSPI Composite Index (South Korea)', cat: 'INDEX', unit: 'pts', price: 5383.8, chgNum: 0.36, vol24hNum: 19.7, volChg24h: '+2.8%' },
  { sym: 'TWII', pair: 'TWII/TWD', name: 'TAIEX Index (Taiwan Semiconductor Heavy)', cat: 'INDEX', unit: 'pts', price: 41574.72, chgNum: 1.12, vol24hNum: 24.9, volChg24h: '+9.7%' },
  { sym: 'AS51', pair: 'ASX200/AUD', name: 'S&P/ASX 200 Index (Australia)', cat: 'INDEX', unit: 'pts', price: 9420.5, chgNum: 0.18, vol24hNum: 13.2, volChg24h: '+1.4%' },
  { sym: 'NIFTY', pair: 'NIFTY50/INR', name: 'Nifty 50 Index (NSE India)', cat: 'INDEX', unit: 'pts', price: 28640.0, chgNum: 0.44, vol24hNum: 26.8, volChg24h: '+7.5%' },
  { sym: 'IBOV', pair: 'IBOV/BRL', name: 'Ibovespa Index (B3 Brazil)', cat: 'INDEX', unit: 'pts', price: 167563.0, chgNum: -0.28, vol24hNum: 11.4, volChg24h: '-1.8%' },
  { sym: 'MEXBOL', pair: 'IPC/MXN', name: 'S&P/BMV IPC Index (Mexico)', cat: 'INDEX', unit: 'pts', price: 58420.0, chgNum: 0.15, vol24hNum: 4.2, volChg24h: '+0.9%' },
  { sym: 'MERVAL', pair: 'MERV/ARS', name: 'S&P Merval Index (BYMA Argentina)', cat: 'INDEX', unit: 'pts', price: 2485000.0, chgNum: 2.35, vol24hNum: 2.4, volChg24h: '+21.4%' },

  // ==========================================================================
  // 2. EQUITY — STRICTLY S&P 500 & NASDAQ-100 TOP VOLUME CONSTITUENTS
  // ==========================================================================
  { sym: 'TSLA', name: 'Tesla Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 399.43, chgNum: 2.85, vol24hNum: 28.4, marketCap: '$1.26T' },
  { sym: 'META', name: 'Meta Platforms Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 623.74, chgNum: 1.42, vol24hNum: 13.8, marketCap: '$1.58T' },
  { sym: 'AMD', name: 'Advanced Micro Devices (S&P 500 / NDX)', cat: 'EQUITY', price: 488.78, chgNum: 1.95, vol24hNum: 16.4, marketCap: '$790B' },
  { sym: 'AVGO', name: 'Broadcom Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 321.5, chgNum: 1.68, vol24hNum: 11.8, marketCap: '$1.50T' },
  { sym: 'PLTR', name: 'Palantir Technologies (S&P 500)', cat: 'EQUITY', price: 170.2, chgNum: 3.12, vol24hNum: 10.6, marketCap: '$382B' },
  { sym: 'NFLX', name: 'Netflix Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 66.47, chgNum: 0.94, vol24hNum: 6.8, marketCap: '$286B' },
  { sym: 'BRK.B', name: 'Berkshire Hathaway Inc. (S&P 500)', cat: 'EQUITY', price: 579.09, chgNum: 0.28, vol24hNum: 5.9, marketCap: '$1.25T' },
  { sym: 'LLY', name: 'Eli Lilly & Co. (S&P 500)', cat: 'EQUITY', price: 1426.5, chgNum: 0.86, vol24hNum: 6.4, marketCap: '$1.35T' },
  { sym: 'JPM', name: 'JPMorgan Chase & Co. (S&P 500)', cat: 'EQUITY', price: 352.11, chgNum: 0.54, vol24hNum: 5.8, marketCap: '$995B' },
  { sym: 'MU', name: 'Micron Technology Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 795.23, chgNum: 1.74, vol24hNum: 9.2, marketCap: '$880B' },
  { sym: 'COST', name: 'Costco Wholesale Corp. (S&P 500 / NDX)', cat: 'EQUITY', price: 1034.2, chgNum: 0.41, vol24hNum: 4.6, marketCap: '$458B' },
  { sym: 'ORCL', name: 'Oracle Corp. (S&P 500)', cat: 'EQUITY', price: 123.73, chgNum: 1.22, vol24hNum: 4.4, marketCap: '$342B' },
  { sym: 'UNH', name: 'UnitedHealth Group Inc. (S&P 500)', cat: 'EQUITY', price: 400.16, chgNum: -0.45, vol24hNum: 4.9, marketCap: '$368B' },
  { sym: 'V', name: 'Visa Inc. (S&P 500)', cat: 'EQUITY', price: 437.2, chgNum: 0.38, vol24hNum: 4.5, marketCap: '$860B' },
  { sym: 'XOM', name: 'Exxon Mobil Corp. (S&P 500)', cat: 'EQUITY', price: 169.24, chgNum: -0.62, vol24hNum: 4.8, marketCap: '$745B' },
  { sym: 'MA', name: 'Mastercard Inc. (S&P 500)', cat: 'EQUITY', price: 672.5, chgNum: 0.44, vol24hNum: 3.9, marketCap: '$624B' },
  { sym: 'WMT', name: 'Walmart Inc. (S&P 500)', cat: 'EQUITY', price: 129.17, chgNum: 0.58, vol24hNum: 4.2, marketCap: '$1.04T' },
  { sym: 'CRM', name: 'Salesforce Inc. (S&P 500)', cat: 'EQUITY', price: 225.8, chgNum: 0.79, vol24hNum: 3.4, marketCap: '$218B' },
  { sym: 'QCOM', name: 'Qualcomm Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 164.2, chgNum: 0.92, vol24hNum: 3.3, marketCap: '$183B' },
  { sym: 'INTC', name: 'Intel Corp. (S&P 500 / NDX)', cat: 'EQUITY', price: 60.65, chgNum: -1.12, vol24hNum: 5.1, marketCap: '$258B' },
  { sym: 'AMAT', name: 'Applied Materials Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 367.35, chgNum: 1.15, vol24hNum: 4.1, marketCap: '$304B' },
  { sym: 'GS', name: 'Goldman Sachs Group Inc. (S&P 500)', cat: 'EQUITY', price: 915.4, chgNum: 0.68, vol24hNum: 3.8, marketCap: '$292B' },
  { sym: 'BAC', name: 'Bank of America Corp. (S&P 500)', cat: 'EQUITY', price: 51.66, chgNum: 0.49, vol24hNum: 3.5, marketCap: '$398B' },
  { sym: 'CVX', name: 'Chevron Corp. (S&P 500)', cat: 'EQUITY', price: 222.6, chgNum: -0.54, vol24hNum: 3.4, marketCap: '$405B' },
  { sym: 'HD', name: 'Home Depot Inc. (S&P 500)', cat: 'EQUITY', price: 355.33, chgNum: 0.24, vol24hNum: 2.9, marketCap: '$352B' },
  { sym: 'PG', name: 'Procter & Gamble Co. (S&P 500)', cat: 'EQUITY', price: 164.6, chgNum: 0.18, vol24hNum: 2.6, marketCap: '$387B' },
  { sym: 'PANW', name: 'Palo Alto Networks Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 357.88, chgNum: 1.38, vol24hNum: 2.8, marketCap: '$234B' },
  { sym: 'ISRG', name: 'Intuitive Surgical Inc. (S&P 500 / NDX)', cat: 'EQUITY', price: 460.8, chgNum: 0.84, vol24hNum: 2.4, marketCap: '$164B' },

  // ==========================================================================
  // 3. ETF — TOP-VOLUME GLOBAL ETFs (INDEX, SECTORS, BONDS, COMMODITIES, EM)
  // ==========================================================================
  { sym: 'IWM', name: 'iShares Russell 2000 ETF', cat: 'ETF', price: 283.37, chgNum: -0.32, vol24hNum: 11.4, marketCap: '$82.5B' },
  { sym: 'SMH', name: 'VanEck Semiconductor ETF', cat: 'ETF', price: 486.62, chgNum: 1.62, vol24hNum: 9.8, marketCap: '$38.6B' },
  { sym: 'SOXX', name: 'iShares Semiconductor ETF', cat: 'ETF', price: 450.41, chgNum: 1.55, vol24hNum: 6.9, marketCap: '$22.4B' },
  { sym: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', cat: 'ETF', price: 81.92, chgNum: -0.48, vol24hNum: 6.4, marketCap: '$52.4B' },
  { sym: 'VOO', name: 'Vanguard S&P 500 ETF', cat: 'ETF', price: 704.78, chgNum: 0.45, vol24hNum: 6.8, marketCap: '$684.0B' },
  { sym: 'IVV', name: 'iShares Core S&P 500 ETF', cat: 'ETF', price: 769.4, chgNum: 0.46, vol24hNum: 6.2, marketCap: '$712.0B' },
  { sym: 'VTI', name: 'Vanguard Total Stock Market ETF', cat: 'ETF', price: 377.15, chgNum: 0.42, vol24hNum: 4.8, marketCap: '$568.0B' },
  { sym: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', cat: 'ETF', price: 536.62, chgNum: 0.21, vol24hNum: 4.2, marketCap: '$46.8B' },
  { sym: 'XLK', name: 'Technology Select Sector SPDR ETF', cat: 'ETF', price: 176.95, chgNum: 0.92, vol24hNum: 4.8, marketCap: '$86.4B' },
  { sym: 'XLF', name: 'Financial Select Sector SPDR ETF', cat: 'ETF', price: 57.74, chgNum: 0.54, vol24hNum: 4.2, marketCap: '$54.2B' },
  { sym: 'XLE', name: 'Energy Select Sector SPDR ETF', cat: 'ETF', price: 65.4, chgNum: -0.68, vol24hNum: 3.6, marketCap: '$42.5B' },
  { sym: 'XLV', name: 'Health Care Select Sector SPDR ETF', cat: 'ETF', price: 184.29, chgNum: 0.22, vol24hNum: 2.9, marketCap: '$48.2B' },
  { sym: 'XLI', name: 'Industrial Select Sector SPDR ETF', cat: 'ETF', price: 171.8, chgNum: 0.35, vol24hNum: 2.6, marketCap: '$26.4B' },
  { sym: 'XLY', name: 'Consumer Discretionary SPDR ETF', cat: 'ETF', price: 113.1, chgNum: 0.88, vol24hNum: 2.4, marketCap: '$25.4B' },
  { sym: 'XLP', name: 'Consumer Staples Select Sector SPDR', cat: 'ETF', price: 92.25, chgNum: 0.14, vol24hNum: 2.1, marketCap: '$19.8B' },
  { sym: 'XLU', name: 'Utilities Select Sector SPDR ETF', cat: 'ETF', price: 43.48, chgNum: 0.48, vol24hNum: 2.0, marketCap: '$21.5B' },
  { sym: 'XLC', name: 'Communication Services SPDR ETF', cat: 'ETF', price: 106.48, chgNum: 0.76, vol24hNum: 1.9, marketCap: '$23.8B' },
  { sym: 'XLB', name: 'Materials Select Sector SPDR ETF', cat: 'ETF', price: 98.2, chgNum: 0.29, vol24hNum: 1.5, marketCap: '$6.4B' },
  { sym: 'XLRE', name: 'Real Estate Select Sector SPDR ETF', cat: 'ETF', price: 44.8, chgNum: -0.18, vol24hNum: 1.4, marketCap: '$8.4B' },
  { sym: 'GLD', name: 'SPDR Gold Shares ETF', cat: 'ETF', price: 377.92, chgNum: 0.74, vol24hNum: 5.8, marketCap: '$114.2B' },
  { sym: 'SLV', name: 'iShares Silver Trust ETF', cat: 'ETF', price: 47.16, chgNum: 1.28, vol24hNum: 3.4, marketCap: '$22.8B' },
  { sym: 'USO', name: 'United States Oil Fund LP', cat: 'ETF', price: 84.6, chgNum: -0.95, vol24hNum: 2.2, marketCap: '$1.8B' },
  { sym: 'HYG', name: 'iShares iBoxx $ High Yield Corporate Bond', cat: 'ETF', price: 78.9, chgNum: 0.12, vol24hNum: 3.8, marketCap: '$17.2B' },
  { sym: 'LQD', name: 'iShares iBoxx $ Inv Grade Corporate Bond', cat: 'ETF', price: 104.6, chgNum: -0.19, vol24hNum: 3.1, marketCap: '$30.4B' },
  { sym: 'IEF', name: 'iShares 7-10 Year Treasury Bond ETF', cat: 'ETF', price: 90.45, chgNum: -0.22, vol24hNum: 2.7, marketCap: '$31.8B' },
  { sym: 'SHY', name: 'iShares 1-3 Year Treasury Bond ETF', cat: 'ETF', price: 81.8, chgNum: 0.04, vol24hNum: 2.1, marketCap: '$24.6B' },
  { sym: 'EEM', name: 'iShares MSCI Emerging Markets ETF', cat: 'ETF', price: 52.4, chgNum: 0.64, vol24hNum: 3.5, marketCap: '$21.4B' },
  { sym: 'FXI', name: 'iShares China Large-Cap ETF', cat: 'ETF', price: 38.9, chgNum: 1.45, vol24hNum: 4.6, marketCap: '$9.8B' },
  { sym: 'EWJ', name: 'iShares MSCI Japan ETF', cat: 'ETF', price: 79.4, chgNum: 0.68, vol24hNum: 1.8, marketCap: '$18.4B' },
  { sym: 'EWZ', name: 'iShares MSCI Brazil ETF', cat: 'ETF', price: 29.8, chgNum: -0.42, vol24hNum: 1.7, marketCap: '$5.2B' },
  { sym: 'RSP', name: 'Invesco S&P 500 Equal Weight ETF', cat: 'ETF', price: 224.8, chgNum: 0.31, vol24hNum: 2.4, marketCap: '$82.4B' },
  { sym: 'ARKK', name: 'ARK Innovation ETF', cat: 'ETF', price: 80.6, chgNum: 1.84, vol24hNum: 2.1, marketCap: '$8.4B' },

  // ==========================================================================
  // 4. CRYPTO — TOP-VOLUME LAYER 1, INFRASTRUCTURE & DEFI DIGITAL ASSETS
  // ==========================================================================
  { sym: 'BNB', pair: 'BNB/USD', name: 'BNB Chain', cat: 'CRYPTO', price: 718.4, chgNum: 0.84, vol24hNum: 2.45, marketCap: '$104.2B' },
  { sym: 'XRP', pair: 'XRP/USD', name: 'XRP Ledger', cat: 'CRYPTO', price: 1.312, priceFormatted: '$1.3120', chgNum: -0.62, vol24hNum: 3.42, marketCap: '$75.2B' },
  { sym: 'DOGE', pair: 'DOGE/USD', name: 'Dogecoin', cat: 'CRYPTO', price: 0.0762, priceFormatted: '$0.0762', chgNum: 4.12, vol24hNum: 1.88, marketCap: '$11.2B' },
  { sym: 'ADA', pair: 'ADA/USD', name: 'Cardano', cat: 'CRYPTO', price: 0.204, priceFormatted: '$0.2040', chgNum: 0.45, vol24hNum: 0.58, marketCap: '$7.3B' },
  { sym: 'TRX', pair: 'TRX/USD', name: 'TRON Network', cat: 'CRYPTO', price: 0.321, priceFormatted: '$0.3210', chgNum: 0.72, vol24hNum: 1.14, marketCap: '$27.8B' },
  { sym: 'AVAX', pair: 'AVAX/USD', name: 'Avalanche', cat: 'CRYPTO', price: 8.78, chgNum: 2.18, vol24hNum: 0.64, marketCap: '$3.6B' },
  { sym: 'LINK', pair: 'LINK/USD', name: 'Chainlink Oracle Network', cat: 'CRYPTO', price: 11.53, chgNum: 1.64, vol24hNum: 0.72, marketCap: '$7.2B' },
  { sym: 'SUI', pair: 'SUI/USD', name: 'Sui Move Layer-1', cat: 'CRYPTO', price: 0.912, priceFormatted: '$0.9120', chgNum: 3.45, vol24hNum: 0.98, marketCap: '$2.6B' },
  { sym: 'NEAR', pair: 'NEAR/USD', name: 'NEAR Protocol (AI Sharded L1)', cat: 'CRYPTO', price: 3.99, chgNum: 1.92, vol24hNum: 0.54, marketCap: '$4.8B' },
  { sym: 'DOT', pair: 'DOT/USD', name: 'Polkadot Relay Chain', cat: 'CRYPTO', price: 0.952, priceFormatted: '$0.9520', chgNum: -0.28, vol24hNum: 0.32, marketCap: '$1.4B' },
  { sym: 'UNI', pair: 'UNI/USD', name: 'Uniswap Protocol', cat: 'CRYPTO', price: 7.28, chgNum: 1.48, vol24hNum: 0.48, marketCap: '$4.4B' },
  { sym: 'AAVE', pair: 'AAVE/USD', name: 'Aave Liquidity Protocol', cat: 'CRYPTO', price: 132.61, chgNum: 2.34, vol24hNum: 0.44, marketCap: '$2.0B' },

  // ==========================================================================
  // 5. RATES — SOVEREIGN YIELD CURVE BENCHMARKS (LINKED TO 40 COUNTRIES)
  // ==========================================================================
  { sym: 'US2Y', pair: 'US2Y/YLD', name: 'US 2-Year Treasury Yield', cat: 'RATES', unit: 'yield', countryCode: 'US', price: 4.62, chgNum: 0.42, vol24hNum: 68.4 },
  { sym: 'US5Y', pair: 'US5Y/YLD', name: 'US 5-Year Treasury Yield', cat: 'RATES', unit: 'yield', countryCode: 'US', price: 4.71, chgNum: 0.55, vol24hNum: 54.2 },
  { sym: 'US10Y', pair: 'US10Y/YLD', name: 'US 10-Year Benchmark Yield', cat: 'RATES', unit: 'yield', countryCode: 'US', price: 4.86, chgNum: 0.68, vol24hNum: 82.5 },
  { sym: 'US30Y', pair: 'US30Y/YLD', name: 'US 30-Year Long Bond Yield', cat: 'RATES', unit: 'yield', countryCode: 'US', price: 5.25, chgNum: 0.72, vol24hNum: 38.9 },
  { sym: 'DE10Y', pair: 'DE10Y/YLD', name: 'Germany 10-Year Bund Yield', cat: 'RATES', unit: 'yield', countryCode: 'DE', price: 3.28, chgNum: 0.35, vol24hNum: 46.2 },
  { sym: 'UK10Y', pair: 'UK10Y/YLD', name: 'UK 10-Year Gilt Yield', cat: 'RATES', unit: 'yield', countryCode: 'GB', price: 5.12, chgNum: 0.48, vol24hNum: 28.4 },
  { sym: 'JP10Y', pair: 'JP10Y/YLD', name: 'Japan 10-Year JGB Yield', cat: 'RATES', unit: 'yield', countryCode: 'JP', price: 2.76, chgNum: 0.92, vol24hNum: 34.1 },
  { sym: 'FR10Y', pair: 'FR10Y/YLD', name: 'France 10-Year OAT Yield', cat: 'RATES', unit: 'yield', countryCode: 'FR', price: 3.84, chgNum: 0.41, vol24hNum: 24.6 },
  { sym: 'IT10Y', pair: 'IT10Y/YLD', name: 'Italy 10-Year BTP Yield', cat: 'RATES', unit: 'yield', countryCode: 'IT', price: 4.28, chgNum: 0.29, vol24hNum: 22.8 },
  { sym: 'ES10Y', pair: 'ES10Y/YLD', name: 'Spain 10-Year Bonos Yield', cat: 'RATES', unit: 'yield', countryCode: 'ES', price: 3.68, chgNum: 0.24, vol24hNum: 16.4 },
  { sym: 'CA10Y', pair: 'CA10Y/YLD', name: 'Canada 10-Year Govt Bond Yield', cat: 'RATES', unit: 'yield', countryCode: 'CA', price: 3.74, chgNum: 0.38, vol24hNum: 18.2 },
  { sym: 'AU10Y', pair: 'AU10Y/YLD', name: 'Australia 10-Year ACGB Yield', cat: 'RATES', unit: 'yield', countryCode: 'AU', price: 4.82, chgNum: 0.51, vol24hNum: 14.9 },
  { sym: 'CH10Y', pair: 'CH10Y/YLD', name: 'Switzerland 10-Year Conf Yield', cat: 'RATES', unit: 'yield', countryCode: 'CH', price: 0.82, chgNum: -0.22, vol24hNum: 9.8 },
  { sym: 'CN10Y', pair: 'CN10Y/YLD', name: 'China 10-Year Sovereign CGB Yield', cat: 'RATES', unit: 'yield', countryCode: 'CN', price: 2.08, chgNum: -0.35, vol24hNum: 29.4 },
  { sym: 'IN10Y', pair: 'IN10Y/YLD', name: 'India 10-Year G-Sec Yield', cat: 'RATES', unit: 'yield', countryCode: 'IN', price: 6.88, chgNum: 0.14, vol24hNum: 15.6 },
  { sym: 'BR10Y', pair: 'BR10Y/YLD', name: 'Brazil 10-Year NTN-F Sovereign Yield', cat: 'RATES', unit: 'yield', countryCode: 'BR', price: 13.15, chgNum: 0.85, vol24hNum: 11.4 },
  { sym: 'MX10Y', pair: 'MX10Y/YLD', name: 'Mexico 10-Year Mbono Yield', cat: 'RATES', unit: 'yield', countryCode: 'MX', price: 10.24, chgNum: 0.62, vol24hNum: 9.2 },
  { sym: 'KR10Y', pair: 'KR10Y/YLD', name: 'South Korea 10-Year KTB Yield', cat: 'RATES', unit: 'yield', countryCode: 'KR', price: 3.42, chgNum: 0.19, vol24hNum: 12.1 },
  { sym: 'ZA10Y', pair: 'ZA10Y/YLD', name: 'South Africa 10-Year R2035 Yield', cat: 'RATES', unit: 'yield', countryCode: 'ZA', price: 10.18, chgNum: -0.31, vol24hNum: 6.8 },

  // ==========================================================================
  // 6. FIXED_INCOME — STRICTLY US TREASURY NOTES, BONDS & TIPS ONLY
  // ==========================================================================
  { sym: 'UST-2Y', pair: 'UST2Y/USD', name: 'US Treasury 2-Year Note (4.125% Coupon)', cat: 'FIXED_INCOME', countryCode: 'US', price: 99.12, chgNum: -0.08, vol24hNum: 74.2 },
  { sym: 'UST-3Y', pair: 'UST3Y/USD', name: 'US Treasury 3-Year Note (4.000% Coupon)', cat: 'FIXED_INCOME', countryCode: 'US', price: 98.65, chgNum: -0.12, vol24hNum: 42.8 },
  { sym: 'UST-5Y', pair: 'UST5Y/USD', name: 'US Treasury 5-Year Note (3.875% Coupon)', cat: 'FIXED_INCOME', countryCode: 'US', price: 97.45, chgNum: -0.24, vol24hNum: 64.5 },
  { sym: 'UST-7Y', pair: 'UST7Y/USD', name: 'US Treasury 7-Year Note (4.000% Coupon)', cat: 'FIXED_INCOME', countryCode: 'US', price: 95.8, chgNum: -0.31, vol24hNum: 38.4 },
  { sym: 'UST-10Y', pair: 'UST10Y/USD', name: 'US Treasury 10-Year Benchmark Note', cat: 'FIXED_INCOME', countryCode: 'US', price: 93.84, chgNum: -0.45, vol24hNum: 92.6 },
  { sym: 'UST-20Y', pair: 'UST20Y/USD', name: 'US Treasury 20-Year Bond (4.250% Coupon)', cat: 'FIXED_INCOME', countryCode: 'US', price: 87.4, chgNum: -0.62, vol24hNum: 29.4 },
  { sym: 'UST-30Y', pair: 'UST30Y/USD', name: 'US Treasury 30-Year Long Bond', cat: 'FIXED_INCOME', countryCode: 'US', price: 84.6, chgNum: -0.78, vol24hNum: 48.2 },
  { sym: 'UST-5Y-TIPS', pair: 'TIPS5Y/USD', name: 'US Treasury 5-Year Inflation-Protected (TIPS)', cat: 'FIXED_INCOME', countryCode: 'US', price: 100.45, chgNum: 0.18, vol24hNum: 19.6 },
  { sym: 'UST-10Y-TIPS', pair: 'TIPS10Y/USD', name: 'US Treasury 10-Year Inflation-Protected (TIPS)', cat: 'FIXED_INCOME', countryCode: 'US', price: 98.42, chgNum: 0.14, vol24hNum: 24.8 },

  // ==========================================================================
  // 7. FX — WORLD CURRENCIES VS USD + DXY + TRIANGULATION ENGINE
  // ==========================================================================
  { sym: 'DXY', pair: 'DXY/INDEX', name: 'US Dollar Index (ICE Spot)', cat: 'FX', unit: 'pts', price: 101.58, chgNum: 0.24, vol24hNum: 48.5 },
  { sym: 'EUR/USD', pair: 'EUR/USD', name: 'Euro / US Dollar (G10 Major)', cat: 'FX', unit: 'fx', price: 1.124, chgNum: -0.22, vol24hNum: 185.4 },
  { sym: 'USD/JPY', pair: 'USD/JPY', name: 'US Dollar / Japanese Yen (G10 Major)', cat: 'FX', unit: 'fx', price: 158.46, chgNum: 0.48, vol24hNum: 142.8 },
  { sym: 'GBP/USD', pair: 'GBP/USD', name: 'British Pound / US Dollar (G10 Major)', cat: 'FX', unit: 'fx', price: 1.347, chgNum: -0.15, vol24hNum: 96.2 },
  { sym: 'USD/CHF', pair: 'USD/CHF', name: 'US Dollar / Swiss Franc (G10 Major)', cat: 'FX', unit: 'fx', price: 0.8165, chgNum: 0.12, vol24hNum: 54.6 },
  { sym: 'AUD/USD', pair: 'AUD/USD', name: 'Australian Dollar / US Dollar (G10)', cat: 'FX', unit: 'fx', price: 0.7005, chgNum: -0.34, vol24hNum: 49.2 },
  { sym: 'USD/CAD', pair: 'USD/CAD', name: 'US Dollar / Canadian Dollar (G10)', cat: 'FX', unit: 'fx', price: 1.3955, chgNum: 0.19, vol24hNum: 52.1 },
  { sym: 'NZD/USD', pair: 'NZD/USD', name: 'New Zealand Dollar / US Dollar (G10)', cat: 'FX', unit: 'fx', price: 0.624, chgNum: -0.41, vol24hNum: 21.8 },
  { sym: 'USD/CNH', pair: 'USD/CNH', name: 'US Dollar / Offshore Chinese Yuan', cat: 'FX', unit: 'fx', price: 6.672, chgNum: 0.16, vol24hNum: 68.4 },
  { sym: 'USD/MXN', pair: 'USD/MXN', name: 'US Dollar / Mexican Peso', cat: 'FX', unit: 'fx', price: 18.61, chgNum: 0.54, vol24hNum: 34.2 },
  { sym: 'USD/BRL', pair: 'USD/BRL', name: 'US Dollar / Brazilian Real', cat: 'FX', unit: 'fx', price: 5.462, chgNum: 0.62, vol24hNum: 28.9 },
  { sym: 'USD/INR', pair: 'USD/INR', name: 'US Dollar / Indian Rupee', cat: 'FX', unit: 'fx', price: 96.13, chgNum: 0.08, vol24hNum: 26.4 },
  { sym: 'USD/SGD', pair: 'USD/SGD', name: 'US Dollar / Singapore Dollar', cat: 'FX', unit: 'fx', price: 1.281, chgNum: 0.14, vol24hNum: 38.6 },
  { sym: 'USD/KRW', pair: 'USD/KRW', name: 'US Dollar / South Korean Won', cat: 'FX', unit: 'fx', price: 1342.0, chgNum: 0.32, vol24hNum: 24.5 },
  { sym: 'USD/ZAR', pair: 'USD/ZAR', name: 'US Dollar / South African Rand', cat: 'FX', unit: 'fx', price: 16.39, chgNum: -0.28, vol24hNum: 16.8 },
  { sym: 'USD/TRY', pair: 'USD/TRY', name: 'US Dollar / Turkish Lira', cat: 'FX', unit: 'fx', price: 50.04, chgNum: 0.21, vol24hNum: 14.2 },
  { sym: 'USD/PLN', pair: 'USD/PLN', name: 'US Dollar / Polish Zloty', cat: 'FX', unit: 'fx', price: 3.842, chgNum: 0.26, vol24hNum: 12.4 },
  { sym: 'USD/SEK', pair: 'USD/SEK', name: 'US Dollar / Swedish Krona', cat: 'FX', unit: 'fx', price: 9.94, chgNum: 0.31, vol24hNum: 15.9 },
  { sym: 'USD/NOK', pair: 'USD/NOK', name: 'US Dollar / Norwegian Krone', cat: 'FX', unit: 'fx', price: 10.32, chgNum: 0.38, vol24hNum: 14.1 },
  { sym: 'USD/ARS', pair: 'USD/ARS', name: 'US Dollar / Argentine Peso (Official)', cat: 'FX', unit: 'fx', price: 1547.43, chgNum: 0.12, vol24hNum: 4.2 },
  { sym: 'USD/CLP', pair: 'USD/CLP', name: 'US Dollar / Chilean Peso', cat: 'FX', unit: 'fx', price: 966.0, chgNum: 0.44, vol24hNum: 6.8 },
  { sym: 'USD/COP', pair: 'USD/COP', name: 'US Dollar / Colombian Peso', cat: 'FX', unit: 'fx', price: 3228.0, chgNum: 0.52, vol24hNum: 5.4 },

  // ==========================================================================
  // 8. COMMODITY — ENERGY, PRECIOUS, INDUSTRIAL/BATTERY METALS & AGRICULTURE
  // ==========================================================================
  { sym: 'CL', pair: 'WTI/USD', name: 'WTI Crude Oil (NYMEX Front Month)', cat: 'COMMODITY', price: 88.49, chgNum: -1.15, vol24hNum: 58.4 },
  { sym: 'BZ', pair: 'BRENT/USD', name: 'Brent Crude Oil (ICE Global Benchmark)', cat: 'COMMODITY', price: 95.95, chgNum: -0.98, vol24hNum: 51.2 },
  { sym: 'NG', pair: 'NATGAS/USD', name: 'Henry Hub Natural Gas (NYMEX)', cat: 'COMMODITY', price: 2.94, chgNum: 2.14, vol24hNum: 21.6 },
  { sym: 'TTF', pair: 'TTF/EUR', name: 'European Dutch TTF Natural Gas', cat: 'COMMODITY', price: 46.2, chgNum: 1.45, vol24hNum: 15.8 },
  { sym: 'RB', pair: 'RBOB/USD', name: 'RBOB Gasoline Futures (NYMEX)', cat: 'COMMODITY', price: 2.54, chgNum: -0.85, vol24hNum: 10.4 },
  { sym: 'HO', pair: 'HO/USD', name: 'ULSD Heating Oil / Diesel (NYMEX)', cat: 'COMMODITY', price: 2.78, chgNum: -0.72, vol24hNum: 9.6 },
  { sym: 'UX', pair: 'U3O8/USD', name: 'Uranium Spot U3O8 (Nuclear Fuel)', cat: 'COMMODITY', price: 92.25, chgNum: 1.62, vol24hNum: 5.2 },
  { sym: 'GC', pair: 'XAU/USD', name: 'Gold Spot / COMEX Futures (oz)', cat: 'COMMODITY', price: 4119.1, chgNum: 0.78, vol24hNum: 78.4 },
  { sym: 'SI', pair: 'XAG/USD', name: 'Silver Spot / COMEX Futures (oz)', cat: 'COMMODITY', price: 52.52, chgNum: 1.42, vol24hNum: 32.8 },
  { sym: 'PL', pair: 'XPT/USD', name: 'Platinum Spot / NYMEX (oz)', cat: 'COMMODITY', price: 1519.0, chgNum: 0.64, vol24hNum: 7.4 },
  { sym: 'PA', pair: 'XPD/USD', name: 'Palladium Spot / NYMEX (oz)', cat: 'COMMODITY', price: 1018.0, chgNum: 1.85, vol24hNum: 5.1 },
  { sym: 'HG', pair: 'COPPER/USD', name: 'Copper High-Grade (COMEX $/lb)', cat: 'COMMODITY', price: 6.41, chgNum: 0.52, vol24hNum: 34.4 },
  { sym: 'ALI', pair: 'ALUM/USD', name: 'Primary Aluminum (LME $/mt)', cat: 'COMMODITY', price: 3108.75, chgNum: 0.44, vol24hNum: 16.2 },
  { sym: 'NICKEL', pair: 'NI/USD', name: 'Primary Nickel (LME $/mt)', cat: 'COMMODITY', price: 17450.0, chgNum: -0.68, vol24hNum: 9.4 },
  { sym: 'ZINC', pair: 'ZN/USD', name: 'Special High-Grade Zinc (LME $/mt)', cat: 'COMMODITY', price: 3380.0, chgNum: 0.31, vol24hNum: 8.4 },
  { sym: 'LITH', pair: 'LCE/USD', name: 'Battery-Grade Lithium Carbonate ($/mt)', cat: 'COMMODITY', price: 11850.0, chgNum: 0.95, vol24hNum: 6.2 },
  { sym: 'TIO', pair: 'FE62/USD', name: 'Iron Ore 62% Fe CFR Benchmark ($/mt)', cat: 'COMMODITY', price: 112.4, chgNum: 0.88, vol24hNum: 19.4 },
  { sym: 'ZS', pair: 'SOY/USd', name: 'Soybeans Futures (CBOT ¢/bu)', cat: 'COMMODITY', price: 1042.0, chgNum: -0.42, vol24hNum: 13.6 },
  { sym: 'ZC', pair: 'CORN/USd', name: 'Corn Futures (CBOT ¢/bu)', cat: 'COMMODITY', price: 448.5, chgNum: 0.36, vol24hNum: 12.4 },
  { sym: 'ZW', pair: 'WHEAT/USd', name: 'SRW Wheat Futures (CBOT ¢/bu)', cat: 'COMMODITY', price: 612.0, chgNum: -0.58, vol24hNum: 8.9 },
  { sym: 'ZM', pair: 'SM/USD', name: 'Soybean Meal Futures (CBOT $/st)', cat: 'COMMODITY', price: 324.0, chgNum: -0.35, vol24hNum: 5.6 },
  { sym: 'ZL', pair: 'BO/USd', name: 'Soybean Oil Futures (CBOT ¢/lb)', cat: 'COMMODITY', price: 46.8, chgNum: 0.74, vol24hNum: 6.2 },
  { sym: 'KC', pair: 'COFFEE/USd', name: 'Coffee Arabica Futures (ICE ¢/lb)', cat: 'COMMODITY', price: 280.27, chgNum: 1.28, vol24hNum: 7.4 },
  { sym: 'CC', pair: 'COCOA/USD', name: 'Cocoa Futures (ICE $/mt)', cat: 'COMMODITY', price: 5261.5, chgNum: 2.15, vol24hNum: 6.4 },
  { sym: 'SB', pair: 'SUGAR/USd', name: 'Sugar No. 11 World Futures (ICE ¢/lb)', cat: 'COMMODITY', price: 23.4, chgNum: 0.45, vol24hNum: 5.2 },
  { sym: 'CT', pair: 'COTTON/USd', name: 'Cotton No. 2 Futures (ICE ¢/lb)', cat: 'COMMODITY', price: 73.2, chgNum: -0.22, vol24hNum: 3.4 },

  // ==========================================================================
  // 9. DERIVATIVES_VOL — VOL INDICES, TOP FUTURES & HIGH-VOLUME EQUITY OPTIONS
  // ==========================================================================
  { sym: 'VIX', pair: 'VIX/PTS', name: 'CBOE S&P 500 Volatility Index', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'SPY', price: 17.85, chgNum: -2.45, vol24hNum: 42.4 },
  { sym: 'VXN', pair: 'VXN/PTS', name: 'CBOE Nasdaq-100 Volatility Index', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'QQQ', price: 21.4, chgNum: -1.85, vol24hNum: 20.2 },
  { sym: 'MOVE', pair: 'MOVE/PTS', name: 'ICE BofA US Bond Market Option Vol Index', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'TLT', price: 118.5, chgNum: 1.42, vol24hNum: 26.6 },
  { sym: 'V2X', pair: 'V2X/PTS', name: 'Euro Stoxx 50 Volatility Index (VSTOXX)', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'SX5E', price: 17.2, chgNum: -1.12, vol24hNum: 12.4 },
  { sym: 'GVZ', pair: 'GVZ/PTS', name: 'CBOE Gold ETF Volatility Index', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'GLD', price: 19.4, chgNum: 0.65, vol24hNum: 8.8 },
  { sym: 'OVX', pair: 'OVX/PTS', name: 'CBOE Crude Oil ETF Volatility Index', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'USO', price: 36.8, chgNum: -2.1, vol24hNum: 10.2 },
  { sym: 'ES', pair: 'ES1!/USD', name: 'CME E-Mini S&P 500 Futures', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'SPY', price: 7712.5, chgNum: 0.48, vol24hNum: 185.0 },
  { sym: 'NQ', pair: 'NQ1!/USD', name: 'CME E-Mini Nasdaq-100 Futures', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'QQQ', price: 28520.0, chgNum: 0.64, vol24hNum: 134.4 },
  { sym: 'ZN', pair: 'ZN1!/USD', name: 'CBOT 10-Year US Treasury Note Futures', cat: 'DERIVATIVES_VOL', underlyingSym: 'UST-10Y', price: 107.4, chgNum: -0.38, vol24hNum: 104.2 },
  { sym: 'ZB', pair: 'ZB1!/USD', name: 'CBOT 30-Year US Treasury Bond Futures', cat: 'DERIVATIVES_VOL', underlyingSym: 'UST-30Y', price: 111.8, chgNum: -0.64, vol24hNum: 52.5 },
  { sym: 'SR3', pair: 'SR31!/USD', name: 'CME 3-Month SOFR Interest Rate Futures', cat: 'DERIVATIVES_VOL', unit: 'pts', underlyingSym: 'SOFR', price: 96.03, chgNum: -0.06, vol24hNum: 148.0 },
  { sym: 'NVDA-OPT', pair: 'NVDA/30D-ATM', name: 'NVDA High-Vol 30D ATM Options Straddle (OI > 50k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'NVDA', price: 15.8, chgNum: 4.25, vol24hNum: 22.6 },
  { sym: 'SPY-OPT', pair: 'SPY/30D-ATM', name: 'SPY High-Vol 30D ATM Options Straddle (OI > 100k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'SPY', price: 18.6, chgNum: -1.65, vol24hNum: 36.4 },
  { sym: 'QQQ-OPT', pair: 'QQQ/30D-ATM', name: 'QQQ High-Vol 30D ATM Options Straddle (OI > 85k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'QQQ', price: 21.4, chgNum: -1.18, vol24hNum: 28.1 },
  { sym: 'TSLA-OPT', pair: 'TSLA/30D-ATM', name: 'TSLA High-Vol 30D ATM Options Straddle (OI > 60k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'TSLA', price: 36.8, chgNum: 5.12, vol24hNum: 19.9 },
  { sym: 'AAPL-OPT', pair: 'AAPL/30D-ATM', name: 'AAPL High-Vol 30D ATM Options Straddle (OI > 50k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'AAPL', price: 12.4, chgNum: 0.85, vol24hNum: 13.2 },
  { sym: 'AMD-OPT', pair: 'AMD/30D-ATM', name: 'AMD High-Vol 30D ATM Options Straddle (OI > 40k)', cat: 'DERIVATIVES_VOL', underlyingSym: 'AMD', price: 38.5, chgNum: 3.15, vol24hNum: 12.8 },

  // ==========================================================================
  // 10. CASH — OVERNIGHT RATES, T-BILLS, MONEY MARKET & LIQUIDITY BENCHMARKS
  // ==========================================================================
  { sym: 'SOFR', pair: 'SOFR/RATE', name: 'NY Fed Secured Overnight Financing Rate', cat: 'CASH', unit: 'yield', price: 3.97, chgNum: 0.02, vol24hNum: 2140.0 },
  { sym: 'EFFR', pair: 'EFFR/RATE', name: 'Effective Federal Funds Rate (Fed)', cat: 'CASH', unit: 'yield', price: 3.88, chgNum: 0.0, vol24hNum: 118.0 },
  { sym: 'ESTR', pair: 'ESTR/RATE', name: 'Euro Short-Term Rate (€STR • ECB)', cat: 'CASH', unit: 'yield', price: 2.65, chgNum: -0.02, vol24hNum: 68.5 },
  { sym: 'SONIA', pair: 'SONIA/RATE', name: 'Sterling Overnight Index Average (BoE)', cat: 'CASH', unit: 'yield', price: 4.45, chgNum: 0.01, vol24hNum: 56.8 },
  { sym: 'TONAR', pair: 'TONAR/RATE', name: 'Tokyo Overnight Average Rate (BoJ)', cat: 'CASH', unit: 'yield', price: 0.48, chgNum: 0.05, vol24hNum: 31.4 },
  { sym: 'UST-1M-BILL', pair: 'TB1M/YLD', name: 'US 1-Month Treasury Bill Yield', cat: 'CASH', unit: 'yield', price: 4.02, chgNum: -0.04, vol24hNum: 52.2 },
  { sym: 'UST-3M-BILL', pair: 'TB3M/YLD', name: 'US 3-Month Treasury Bill Yield', cat: 'CASH', unit: 'yield', price: 4.12, chgNum: -0.06, vol24hNum: 82.4 },
  { sym: 'UST-6M-BILL', pair: 'TB6M/YLD', name: 'US 6-Month Treasury Bill Yield', cat: 'CASH', unit: 'yield', price: 4.24, chgNum: -0.08, vol24hNum: 58.1 },
  { sym: 'SGOV', pair: 'SGOV/USD', name: 'iShares 0-3 Month Treasury Bond ETF', cat: 'CASH', price: 100.64, chgNum: 0.02, vol24hNum: 3.45, marketCap: '$31.8B' },
  { sym: 'BIL', pair: 'BIL/USD', name: 'SPDR Bloomberg 1-3 Month T-Bill ETF', cat: 'CASH', price: 91.78, chgNum: 0.02, vol24hNum: 2.9, marketCap: '$38.4B' },
  { sym: 'FED-RRP', pair: 'RRP/RATE', name: 'Fed Overnight Reverse Repo Facility Award Rate', cat: 'CASH', unit: 'yield', price: 3.8, chgNum: 0.0, vol24hNum: 194.2 },
  { sym: 'USDT', pair: 'USDT/USD', name: 'Tether USD Institutional Liquidity Peg', cat: 'CASH', price: 1.0001, priceFormatted: '$1.0001', chgNum: 0.01, vol24hNum: 62.4, marketCap: '$138.6B' },
  { sym: 'USDC', pair: 'USDC/USD', name: 'Circle USD Coin Treasury-Backed Peg', cat: 'CASH', price: 1.0, priceFormatted: '$1.0000', chgNum: 0.0, vol24hNum: 11.4, marketCap: '$42.8B' },
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
    stamps: [
      '15:36', '15:37', '15:38', '15:39', '15:40', '15:41', '15:42', '15:43',
      '15:44', '15:45', '15:46', '15:47', '15:48', '15:49', '15:50', '15:51',
      '15:52', '15:53', '15:54', '15:55', '15:56', '15:57', '15:58', '15:59', '16:00',
    ],
    tfSeed: 101,
    totalDriftScale: 0.18,
    volAmpScale: 0.22,
    volMult: 0.35,
    granularity: '1m Live Bars',
  },
  '5M': {
    stamps: [
      '14:00', '14:05', '14:10', '14:15', '14:20', '14:25', '14:30', '14:35',
      '14:40', '14:45', '14:50', '14:55', '15:00', '15:05', '15:10', '15:15',
      '15:20', '15:25', '15:30', '15:35', '15:40', '15:45', '15:50', '15:55', '16:00',
    ],
    tfSeed: 203,
    totalDriftScale: 0.42,
    volAmpScale: 0.45,
    volMult: 0.6,
    granularity: '5m Intraday Bars',
  },
  '1H': {
    stamps: [
      '03 Nov 18:00', '03 Nov 20:00', '03 Nov 22:00', '04 Nov 00:00', '04 Nov 02:00',
      '04 Nov 04:00', '04 Nov 06:00', '04 Nov 08:00', '04 Nov 10:00', '04 Nov 12:00',
      '04 Nov 14:00', '04 Nov 16:00', '04 Nov 18:00', '04 Nov 20:00', '04 Nov 22:00',
      '05 Nov 00:00', '05 Nov 02:00', '05 Nov 04:00', '05 Nov 06:00', '05 Nov 08:00',
      '05 Nov 10:00', '05 Nov 12:00', '05 Nov 14:00', '05 Nov 16:00',
    ],
    tfSeed: 307,
    totalDriftScale: 0.78,
    volAmpScale: 0.75,
    volMult: 0.9,
    granularity: '1H Session Bars',
  },
  '1D': {
    stamps: [
      '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
      '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
    ],
    tfSeed: 409,
    totalDriftScale: 1.0,
    volAmpScale: 1.0,
    volMult: 1.15,
    granularity: 'Intraday (24h)',
  },
  '1W': {
    stamps: [
      '30 Oct 08:00', '30 Oct 16:00', '31 Oct 00:00', '31 Oct 08:00', '31 Oct 16:00',
      '01 Nov 00:00', '01 Nov 12:00', '02 Nov 00:00', '02 Nov 08:00', '02 Nov 16:00',
      '03 Nov 00:00', '03 Nov 08:00', '03 Nov 16:00', '04 Nov 00:00', '04 Nov 08:00',
      '04 Nov 16:00', '05 Nov 00:00', '05 Nov 08:00', '05 Nov 16:00',
    ],
    tfSeed: 521,
    totalDriftScale: 2.35,
    volAmpScale: 1.75,
    volMult: 1.65,
    granularity: '1W Hourly Rollup (5D)',
  },
  '1M_CAL': {
    stamps: [
      '04 Oct', '05 Oct', '06 Oct', '07 Oct', '08 Oct', '11 Oct', '12 Oct', '13 Oct',
      '14 Oct', '15 Oct', '18 Oct', '19 Oct', '20 Oct', '21 Oct', '22 Oct', '26 Oct',
      '27 Oct', '28 Oct', '29 Oct', '30 Oct', '02 Nov', '03 Nov', '04 Nov', '05 Nov',
    ],
    tfSeed: 631,
    totalDriftScale: 4.4,
    volAmpScale: 2.6,
    volMult: 2.4,
    granularity: 'Daily Aggregated (30D)',
  },
  '3M': {
    stamps: [
      '05 Aug', '09 Aug', '13 Aug', '17 Aug', '21 Aug', '25 Aug', '29 Aug', '02 Sep',
      '06 Sep', '10 Sep', '14 Sep', '18 Sep', '22 Sep', '26 Sep', '30 Sep', '04 Oct',
      '08 Oct', '12 Oct', '16 Oct', '20 Oct', '24 Oct', '28 Oct', '01 Nov', '05 Nov',
    ],
    tfSeed: 743,
    totalDriftScale: 8.2,
    volAmpScale: 3.8,
    volMult: 3.5,
    granularity: 'Daily Rollup (90D)',
  },
  '1Y': {
    stamps: [
      'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26',
      'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26',
    ],
    tfSeed: 859,
    totalDriftScale: 14.8,
    volAmpScale: 5.5,
    volMult: 5.2,
    granularity: 'Weekly Aggregated (52W)',
  },
  'ALL': {
    stamps: [
      'Dec 21', 'Mar 22', 'Jun 22', 'Sep 22', 'Dec 22', 'Mar 23', 'Jun 23', 'Sep 23',
      'Dec 23', 'Mar 24', 'Jun 24', 'Sep 24', 'Dec 24', 'Mar 25', 'Jun 25', 'Sep 25',
      'Dec 25', 'Mar 26', 'Jun 26', 'Sep 26', 'Nov 26',
    ],
    tfSeed: 977,
    totalDriftScale: 24.5,
    volAmpScale: 7.8,
    volMult: 8.5,
    granularity: 'Monthly Rollup (5Y)',
  },
};

const SERIES_MEMORY_CACHE = {};
const IN_FLIGHT_SERIES_FETCHES = {};

const YAHOO_SYMBOL_MAP = {
  // Global Equity Indices
  SPX: '^GSPC',
  NDX: '^NDX',
  DJI: '^DJI',
  RUT: '^RUT',
  SX5E: '^STOXX50E',
  DAX: '^GDAXI',
  UKX: '^FTSE',
  CAC: '^FCHI',
  IBEX: '^IBEX',
  FTSEMIB: 'FTSEMIB.MI',
  SMI: '^SSMI',
  AEX: '^AEX',
  OMX: '^OMX',
  N225: '^N225',
  HSI: '^HSI',
  SHCOMP: '000001.SS',
  CSI300: '000300.SS',
  KOSPI: '^KS11',
  TWII: '^TWII',
  AS51: '^AXJO',
  SENSEX: '^BSESN',
  STI: '^STI',
  IBOV: '^BVSP',
  MEXBOL: '^MXX',
  DXY: 'DX-Y.NYB',
  // Volatility & Futures
  VIX: '^VIX',
  VXN: '^VXN',
  MOVE: '^MOVE',
  ES: 'ES=F',
  NQ: 'NQ=F',
  YM: 'YM=F',
  RTY: 'RTY=F',
  ZB: 'ZB=F',
  ZN: 'ZN=F',
  ZF: 'ZF=F',
  // Commodities
  CL: 'CL=F',
  BRN: 'BZ=F',
  NG: 'NG=F',
  RB: 'RB=F',
  HO: 'HO=F',
  GC: 'GC=F',
  SI: 'SI=F',
  PL: 'PL=F',
  PA: 'PA=F',
  HG: 'HG=F',
  ALI: 'ALI=F',
  ZC: 'ZC=F',
  ZS: 'ZS=F',
  ZW: 'ZW=F',
  KC: 'KC=F',
  SB: 'SB=F',
  CT: 'CT=F',
  CC: 'CC=F',
  LE: 'LE=F',
  // Rates & Fixed Income Proxies
  US2Y: '^IRX',
  US5Y: '^FVX',
  US10Y: '^TNX',
  US30Y: '^TYX',
  'UST-2Y': 'SHY',
  'UST-5Y': 'IEI',
  'UST-10Y': 'IEF',
  'UST-20Y': 'TLT',
  'UST-30Y': 'TLT',
  'UST-TIPS': 'TIP',
  'TBILL-3M': 'BIL',
  'TBILL-6M': 'SGOV',
  // Special Equity Symbols
  'BRK.B': 'BRK-B',
};

/**
 * Resolves any catalog symbol or `BASE/QUOTE` currency cross to its Yahoo Finance chart ticker.
 */
export function resolveYahooSymbol(sym = 'BTC', catHint = null) {
  const clean = String(sym || 'BTC').trim().toUpperCase();
  if (YAHOO_SYMBOL_MAP[clean]) {
    return { yahooSym: YAHOO_SYMBOL_MAP[clean], isProxyScale: clean.startsWith('UST-') || clean.startsWith('TBILL-') };
  }
  if (clean.endsWith('-OPT')) {
    return { yahooSym: clean.replace(/-OPT$/, ''), isProxyScale: true };
  }
  if (clean.includes('/')) {
    const [base, quote] = clean.split('/');
    if (base === 'USD' && quote && quote !== 'USD') {
      return { yahooSym: `${quote}=X`, isProxyScale: false };
    }
    if (quote === 'USD' && base && base !== 'USD') {
      return { yahooSym: `${base}USD=X`, isProxyScale: false };
    }
    if (base && quote) {
      return { yahooSym: `${base}${quote}=X`, isProxyScale: false };
    }
  }
  const catItem = ASSET_CATALOG.find((a) => a.sym === clean);
  const cat = catHint || catItem?.cat;
  if (cat === 'CRYPTO') {
    return { yahooSym: `${clean}-USD`, isProxyScale: false };
  }
  if (cat === 'RATES' || cat === 'CASH') {
    return { yahooSym: '^TNX', isProxyScale: true };
  }
  return { yahooSym: clean, isProxyScale: false };
}

const YAHOO_TIMEFRAME_QUERY = {
  '1M': { range: '5d', interval: '1m', slice: 36, granularity: '1m Live Bars', fmt: 'time' },
  '5M': { range: '5d', interval: '5m', slice: 36, granularity: '5m Intraday Bars', fmt: 'time' },
  '1H': { range: '1mo', interval: '1h', slice: 32, granularity: '1H Session Bars', fmt: 'dayhour' },
  '1D': { range: '5d', interval: '15m', slice: 40, granularity: 'Intraday (24h)', fmt: 'time' },
  '1W': { range: '5d', interval: '1h', slice: 55, granularity: '1W Hourly Rollup (5D)', fmt: 'dayhour' },
  '1M_CAL': { range: '1mo', interval: '1d', slice: 35, granularity: 'Daily Aggregated (30D)', fmt: 'day' },
  '3M': { range: '3mo', interval: '1d', slice: 75, granularity: 'Daily Rollup (90D)', fmt: 'day' },
  '1Y': { range: '1y', interval: '1wk', slice: 54, granularity: 'Weekly Aggregated (52W)', fmt: 'month' },
  'ALL': { range: '5y', interval: '1mo', slice: 62, granularity: 'Monthly Rollup (5Y)', fmt: 'month' },
};

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatYahooTimestamp(unixSec, fmt) {
  const d = new Date(unixSec * 1000);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mon = SHORT_MONTHS[d.getUTCMonth()] || 'Nov';
  const yy = String(d.getUTCFullYear()).slice(-2);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  if (fmt === 'time') return `${hh}:${mm}`;
  if (fmt === 'dayhour') return `${dd} ${mon} ${hh}:00`;
  if (fmt === 'day') return `${dd} ${mon}`;
  return `${mon} ${yy}`;
}

/**
 * Fetches real historical OHLCV bars from Yahoo Finance via `/cloud/yahoo-chart`
 * and populates `LIVE_CHART_SERIES_CACHE` for both `getAssetSeries` and `computeCrossCurrencyRate`.
 */
export async function fetchLiveAssetSeries(sym = 'BTC', timeframe = '1D') {
  const cleanSym = String(sym || 'BTC').trim().toUpperCase();
  const tfKey = timeframe === '1M_HIST' ? '1M_CAL' : timeframe;
  const cacheKey = `${cleanSym}_${tfKey}`;

  if (Array.isArray(LIVE_CHART_SERIES_CACHE[cacheKey]) && LIVE_CHART_SERIES_CACHE[cacheKey].length >= 6) {
    return LIVE_CHART_SERIES_CACHE[cacheKey];
  }
  if (IN_FLIGHT_SERIES_FETCHES[cacheKey]) {
    return IN_FLIGHT_SERIES_FETCHES[cacheKey];
  }

  const qCfg = YAHOO_TIMEFRAME_QUERY[tfKey] || YAHOO_TIMEFRAME_QUERY['1D'];
  const asset = ASSET_CATALOG.find((a) => a.sym === cleanSym);
  const { yahooSym, isProxyScale } = resolveYahooSymbol(cleanSym, asset?.cat);

  const promise = (async () => {
    try {
      const url = `/cloud/yahoo-chart/${encodeURIComponent(yahooSym)}?range=${qCfg.range}&interval=${qCfg.interval}&includePrePost=false`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4500) });
      if (!res.ok) return null;
      const data = await res.json();
      const result = data?.chart?.result?.[0];
      const timestamps = result?.timestamp || [];
      const quote = result?.indicators?.quote?.[0] || {};
      const closes = quote.close || [];
      const lows = quote.low || [];
      const highs = quote.high || [];
      const vols = quote.volume || [];

      const rawBars = [];
      for (let i = 0; i < timestamps.length; i++) {
        const c = closes[i];
        if (typeof c === 'number' && Number.isFinite(c) && c > 0) {
          let effectivePrice = c;
          const lo = lows[i];
          const hi = highs[i];
          // On 1M daily charts, preserve extreme one-sided fixing dips (such as Oct 16–18 ARS=X 1,472.19 fixing)
          if (
            tfKey === '1M_CAL' &&
            typeof lo === 'number' &&
            lo > 0 &&
            typeof hi === 'number' &&
            (c - lo) / c > 0.015 &&
            c - lo > 2.0 * Math.max(0.0001, hi - c)
          ) {
            effectivePrice = lo;
          }
          rawBars.push({
            ts: timestamps[i],
            price: effectivePrice,
            vol: typeof vols[i] === 'number' && vols[i] > 0 ? vols[i] : 0,
          });
        }
      }

      if (rawBars.length < 6) return null;
      const sliced = rawBars.slice(-qCfg.slice);

      // Determine target spot price for scaling proxy tickers or exact spot alignment
      let targetLastPrice = sliced[sliced.length - 1].price;
      if (cleanSym.includes('/')) {
        const [b, q] = cleanSym.split('/');
        if (WORLD_USD_RATES[b] && WORLD_USD_RATES[q]) {
          targetLastPrice = WORLD_USD_RATES[q].perUsd / WORLD_USD_RATES[b].perUsd;
        }
      } else if (asset && isProxyScale) {
        targetLastPrice = asset.price;
      }

      const rawLast = sliced[sliced.length - 1].price;
      const scaleFactor = isProxyScale && rawLast > 0 ? targetLastPrice / rawLast : 1.0;
      const samplePrice = rawLast * scaleFactor;
      const decimals = samplePrice < 5 ? 4 : samplePrice > 500 ? 2 : 2;
      const startPrice = sliced[0].price * scaleFactor;

      const avgVolRaw =
        sliced.reduce((acc, b) => acc + (b.vol || 0), 0) / Math.max(1, sliced.length);

      const formattedSeries = sliced.map((bar, idx) => {
        const scaledP =
          idx === sliced.length - 1 && !isProxyScale && Math.abs(targetLastPrice - rawLast) / Math.max(1, rawLast) < 0.02
            ? targetLastPrice
            : bar.price * scaleFactor;
        const price = Number(scaledP.toFixed(decimals));

        let winSum = 0;
        let winCount = 0;
        const lookback = Math.min(8, idx + 1);
        for (let k = idx - lookback + 1; k <= idx; k++) {
          winSum += sliced[Math.max(0, k)].price * scaleFactor;
          winCount += 1;
        }
        const sma20 = Number((winSum / Math.max(1, winCount)).toFixed(decimals));
        const vwap = Number(((price * 0.58 + sma20 * 0.42)).toFixed(decimals));
        const bbSpread = Math.max(price * 0.006, Math.abs(price - sma20) * 1.65);
        const bbUpper = Number((sma20 + bbSpread).toFixed(decimals));
        const bbLower = Number((sma20 - bbSpread).toFixed(decimals));
        const pctReturn = Number((((scaledP - startPrice) / Math.max(0.0001, startPrice)) * 100).toFixed(2));

        let normVol = 180;
        if (avgVolRaw > 0 && bar.vol > 0) {
          normVol = Math.round(Math.min(650, Math.max(45, (bar.vol / avgVolRaw) * 210)));
        } else {
          const prevP = idx > 0 ? sliced[idx - 1].price * scaleFactor : scaledP;
          const move = Math.abs(scaledP - prevP) / Math.max(0.0001, scaledP);
          normVol = Math.round(145 + Math.min(380, move * 18000) + ((idx * 29) % 55));
        }

        return {
          time: formatYahooTimestamp(bar.ts, qCfg.fmt),
          price,
          sma20,
          vwap,
          bbUpper,
          bbLower,
          pctReturn,
          vol: normVol,
          zBar: Number((((normVol - 190) / 85)).toFixed(2)),
          granularity: qCfg.granularity,
          isLiveYahoo: true,
        };
      });

      LIVE_CHART_SERIES_CACHE[cacheKey] = formattedSeries;
      if (asset && asset.sym !== cleanSym) {
        LIVE_CHART_SERIES_CACHE[`${asset.sym}_${tfKey}`] = formattedSeries;
      }
      return formattedSeries;
    } catch {
      return null;
    } finally {
      delete IN_FLIGHT_SERIES_FETCHES[cacheKey];
    }
  })();

  IN_FLIGHT_SERIES_FETCHES[cacheKey] = promise;
  return promise;
}

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
  const cleanSym = String(sym || 'BTC').trim().toUpperCase();
  const asset = getAssetBySymbol(sym);
  const tfKey = timeframe === '1M_HIST' ? '1M_CAL' : timeframe;

  // 1. Check Real Live Yahoo Finance Cache first
  const directLive = LIVE_CHART_SERIES_CACHE[`${cleanSym}_${tfKey}`] || LIVE_CHART_SERIES_CACHE[`${asset.sym}_${tfKey}`];
  if (Array.isArray(directLive) && directLive.length >= 6) {
    return directLive;
  }

  // 2. If FX pair, delegate to computeCrossCurrencyRate so FX Cross and Technical lens share identical curves
  if (asset.cat === 'FX' && asset.sym.includes('/')) {
    const [b, q] = asset.sym.split('/');
    const fxRes = computeCrossCurrencyRate(b, q, 1000, tfKey);
    if (fxRes?.crossSeries?.length) {
      return fxRes.crossSeries;
    }
  }

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

  // Build realistic multi-step random walk path with timeframe-specific regime inflections
  const ratios = [];
  let rw = 0;
  for (let i = 0; i < n; i++) {
    if (i === n - 1) {
      ratios.push(1.0);
      continue;
    }
    const progress = i / (n - 1);
    const freq1 = 1.85 + ((h % 9) * 0.37);
    const freq2 = 3.4 + (((h >> 3) % 7) * 0.53);
    const freq3 = 6.1 + (((h >> 6) % 9) * 0.67);
    const phase1 = (h % 23) * 0.41;
    const phase2 = ((h >> 4) % 17) * 0.59;

    const stepNoise =
      Math.sin((i + 1) * (1.79 + (h % 5) * 0.23) + phase1) * 0.48 +
      Math.cos((i + 2) * (2.93 + ((h >> 2) % 5) * 0.31) + phase2) * 0.34 +
      Math.sin((i + 3) * 4.37 + (h % 13)) * 0.18;
    rw = rw * 0.74 + stepNoise * volAmp * 0.72;

    const cycle1 = Math.sin(progress * Math.PI * freq1 + phase1) * volAmp * 0.55;
    const cycle2 = Math.cos(progress * Math.PI * freq2 + phase2) * volAmp * 0.38;
    const cycle3 = Math.sin(progress * Math.PI * freq3) * volAmp * 0.22;

    const endTaper = 1 - Math.pow(progress, 3.2) * 0.78;
    const trendRatio = startRatio + (1 - startRatio) * Math.pow(progress, tfKey === 'ALL' ? 1.45 : 1.0);
    const r = Math.max(0.18, trendRatio + (cycle1 + cycle2 + cycle3 + rw) * endTaper);
    ratios.push(r);
  }

  const baseVol = 110 + (symHash % 180);
  const startVal = ratios[0] || 1;

  const series = ratios.map((ratio, idx) => {
    const time = stamps[idx];
    const rawPrice = asset.price * ratio;
    const roundedPrice = Number(rawPrice.toFixed(decimals));

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
