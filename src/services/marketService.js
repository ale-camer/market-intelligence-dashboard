/**
 * Market Data Service (`marketService.js`)
 * Covers:
 * - P-01: financial-markets-pipeline (Equities OHLCV & Fundamentals)
 * - P-02: crypto-analytics-platform (Polars Technical Indicators: RSI, MACD, Bollinger)
 * - P-03: real-time-market-events (Sub-second Streaming Candles: 1M, 5M, 1H, 1D)
 * - P-05: market-intelligence-hub (Unified dbt BigQuery/Neon Analytics Marts)
 */

export const ASSET_CATALOG = [
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
    indicators: { rsi14: 76.8, macd: '+6.42', macdSignal: 'OVEREXTENDED', bbWidth: '9.4%' },
  },
  {
    sym: 'NVDA',
    pair: 'NVDA/USD',
    name: 'Nvidia Corp.',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 141.5,
    priceFormatted: '$141.50',
    chg: '+2.45%',
    chgNum: 2.45,
    indicators: { rsi14: 64.9, macd: '+2.18', macdSignal: 'BULLISH TREND', bbWidth: '5.2%' },
  },
  {
    sym: 'AAPL',
    pair: 'AAPL/USD',
    name: 'Apple Inc.',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 232.8,
    priceFormatted: '$232.80',
    chg: '+0.32%',
    chgNum: 0.32,
    indicators: { rsi14: 52.1, macd: '+0.64', macdSignal: 'ACCUMULATION', bbWidth: '2.7%' },
  },
  {
    sym: 'MSFT',
    pair: 'MSFT/USD',
    name: 'Microsoft Corp.',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 428.1,
    priceFormatted: '$428.10',
    chg: '-0.15%',
    chgNum: -0.15,
    indicators: { rsi14: 48.3, macd: '-0.45', macdSignal: 'CONSOLIDATING', bbWidth: '2.4%' },
  },
  {
    sym: 'AMZN',
    pair: 'AMZN/USD',
    name: 'Amazon.com Inc.',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 186.4,
    priceFormatted: '$186.40',
    chg: '+1.10%',
    chgNum: 1.1,
    indicators: { rsi14: 57.6, macd: '+1.12', macdSignal: 'BULLISH CROSS', bbWidth: '3.5%' },
  },
  {
    sym: 'GOOGL',
    pair: 'GOOGL/USD',
    name: 'Alphabet Inc.',
    cat: 'EQUITY',
    source: 'P-01 • Yahoo Finance / Neon',
    price: 165.7,
    priceFormatted: '$165.70',
    chg: '+0.75%',
    chgNum: 0.75,
    indicators: { rsi14: 55.0, macd: '+0.79', macdSignal: 'STEADY DRIFT', bbWidth: '3.1%' },
  },
  {
    sym: 'SPY',
    pair: 'SPY/USD',
    name: 'S&P 500 ETF',
    cat: 'INDEX',
    source: 'P-01 • Alpha Vantage / dbt Mart',
    price: 580.4,
    priceFormatted: '$580.40',
    chg: '+0.45%',
    chgNum: 0.45,
    indicators: { rsi14: 58.9, macd: '+1.35', macdSignal: 'UPTREND', bbWidth: '2.1%' },
  },
  {
    sym: 'QQQ',
    pair: 'QQQ/USD',
    name: 'Invesco QQQ',
    cat: 'INDEX',
    source: 'P-01 • Alpha Vantage / dbt Mart',
    price: 492.15,
    priceFormatted: '$492.15',
    chg: '+0.60%',
    chgNum: 0.6,
    indicators: { rsi14: 60.2, macd: '+1.90', macdSignal: 'UPTREND', bbWidth: '2.6%' },
  },
];

export const TICKER_ITEMS = ASSET_CATALOG.map((a) => ({
  sym: a.cat === 'CRYPTO' ? a.pair : a.sym,
  price: a.priceFormatted,
  chg: a.chg,
}));

const TIMEFRAME_STAMPS = {
  '1M': ['15:53', '15:54', '15:55', '15:56', '15:57', '15:58', '15:59', '16:00'],
  '5M': ['15:25', '15:30', '15:35', '15:40', '15:45', '15:50', '15:55', '16:00'],
  '1H': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
  '1D': ['Oct 18', 'Oct 21', 'Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26', 'Oct 27'],
};

const ASSET_CURVE_SHAPES = {
  BTC: [0.985, 0.989, 0.987, 0.992, 0.995, 0.994, 0.998, 1.0],
  ETH: [0.991, 0.989, 0.993, 0.994, 0.992, 0.996, 0.998, 1.0],
  SOL: [0.962, 0.968, 0.965, 0.979, 0.991, 1.012, 0.995, 1.0],
  NVDA: [0.974, 0.979, 0.983, 0.981, 0.988, 0.993, 0.997, 1.0],
  AAPL: [0.994, 0.996, 0.995, 0.997, 0.998, 0.997, 0.999, 1.0],
  MSFT: [1.003, 1.002, 1.004, 1.001, 0.999, 1.001, 0.999, 1.0],
  AMZN: [0.988, 0.991, 0.99, 0.993, 0.996, 0.995, 0.998, 1.0],
  GOOGL: [0.992, 0.991, 0.994, 0.995, 0.997, 0.996, 0.999, 1.0],
  SPY: [0.995, 0.996, 0.995, 0.997, 0.998, 0.998, 0.999, 1.0],
  QQQ: [0.993, 0.994, 0.993, 0.996, 0.997, 0.998, 0.999, 1.0],
};

const ASSET_VOL_SHAPES = {
  BTC: [140, 185, 120, 230, 290, 260, 315, 280],
  ETH: [95, 110, 88, 145, 160, 152, 175, 168],
  SOL: [180, 220, 195, 410, 580, 690, 520, 490],
  NVDA: [210, 245, 190, 275, 320, 295, 360, 340],
  AAPL: [110, 125, 105, 130, 148, 140, 165, 155],
  MSFT: [85, 92, 80, 105, 112, 98, 118, 110],
  AMZN: [100, 118, 95, 140, 155, 148, 170, 162],
  GOOGL: [90, 102, 88, 115, 128, 122, 140, 135],
  SPY: [150, 165, 140, 180, 195, 188, 220, 210],
  QQQ: [135, 148, 125, 168, 182, 175, 205, 194],
};

export function getAssetBySymbol(sym = 'BTC') {
  return ASSET_CATALOG.find((a) => a.sym === sym) || ASSET_CATALOG[0];
}

export function getAssetSeries(sym = 'BTC', timeframe = '5M') {
  const asset = getAssetBySymbol(sym);
  const stamps = TIMEFRAME_STAMPS[timeframe] || TIMEFRAME_STAMPS['5M'];
  const curve = ASSET_CURVE_SHAPES[sym] || ASSET_CURVE_SHAPES.BTC;
  const vols = ASSET_VOL_SHAPES[sym] || ASSET_VOL_SHAPES.BTC;

  const tfMultiplier =
    timeframe === '1M' ? 0.25 : timeframe === '5M' ? 0.55 : timeframe === '1H' ? 1.0 : 1.85;

  return stamps.map((time, idx) => {
    const ratio = 1 - (1 - curve[idx]) * tfMultiplier;
    const rawPrice = asset.price * ratio;
    const roundedPrice = asset.price > 500 ? Number(rawPrice.toFixed(1)) : Number(rawPrice.toFixed(2));
    return {
      time,
      price: roundedPrice,
      vol: Math.round(vols[idx] * (0.7 + 0.3 * tfMultiplier)),
    };
  });
}

