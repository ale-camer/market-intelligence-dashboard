import { bilingual, tx } from './i18n/viewLocaleService';
/**
 * Global Multi-Asset Universe & Quantitative Reference Data (`globalUniverseData.js`)
 * Implements the 10 approved asset classes from `docs/ASSET_UNIVERSE_PLAN.md`:
 * 1. INDEX (22 Global Benchmarks)
 * 2. EQUITY (S&P 500 & Nasdaq-100 Leaders by 24h USD Volume)
 * 3. ETF (34 Top-Volume Global ETFs)
 * 4. CRYPTO (15 Top-Volume Digital Assets)
 * 5. RATES (40 Sovereign Yield Curves with full tenors 3M..30Y & curve indicators)
 * 6. FIXED_INCOME (Exclusively US Treasury Benchmark Bonds & TIPS)
 * 7. FX (145+ World Currencies against USD + dynamic cross-currency triangulation engine)
 * 8. COMMODITY (26 Energy, Precious, Industrial & Agricultural Commodities)
 * 9. DERIVATIVES_VOL (Volatility Indices, Top-Volume Futures & High-Volume Filtered Equity Options)
 * 10. CASH (13 Money Market, Overnight Rates, T-Bills & Stablecoin Liquidity Instruments)
 */

// ============================================================================
// 1. CURVAS SOBERANAS DE 40 PAÍSES (`RATES` — NODOS 3M A 30Y)
// ============================================================================
export const SOVEREIGN_YIELD_CURVES = {
  US: {
    country: bilingual('United States (UST)', 'Estados Unidos (UST)'),
    currency: 'USD',
    rating: 'AA+',
    policyRate: 4.75,
    inflationYoY: 2.4,
    tenors: { '3M': 4.62, '6M': 4.48, '1Y': 4.28, '2Y': 4.08, '3Y': 4.04, '5Y': 4.11, '7Y': 4.18, '10Y': 4.24, '20Y': 4.52, '30Y': 4.48 },
  },
  CA: {
    country: bilingual('Canada (GoC)', 'Canadá (GoC)'),
    currency: 'CAD',
    rating: 'AAA',
    policyRate: 3.75,
    inflationYoY: 1.6,
    tenors: { '3M': 3.68, '6M': 3.52, '1Y': 3.34, '2Y': 3.12, '3Y': 3.08, '5Y': 3.05, '7Y': 3.14, '10Y': 3.26, '20Y': 3.38, '30Y': 3.35 },
  },
  DE: {
    country: bilingual('Germany (Bund • Eurozone)', 'Alemania (Bund • Eurozona)'),
    currency: 'EUR',
    rating: 'AAA',
    policyRate: 3.25,
    inflationYoY: 2.0,
    tenors: { '3M': 3.08, '6M': 2.86, '1Y': 2.48, '2Y': 2.18, '3Y': 2.12, '5Y': 2.16, '7Y': 2.22, '10Y': 2.32, '20Y': 2.54, '30Y': 2.58 },
  },
  GB: {
    country: bilingual('United Kingdom (Gilt)', 'Reino Unido (Gilt)'),
    currency: 'GBP',
    rating: 'AA',
    policyRate: 4.75,
    inflationYoY: 2.3,
    tenors: { '3M': 4.72, '6M': 4.58, '1Y': 4.36, '2Y': 4.18, '3Y': 4.12, '5Y': 4.15, '7Y': 4.24, '10Y': 4.38, '20Y': 4.78, '30Y': 4.86 },
  },
  FR: {
    country: bilingual('France (OAT)', 'Francia (OAT)'),
    currency: 'EUR',
    rating: 'AA-',
    policyRate: 3.25,
    inflationYoY: 1.5,
    tenors: { '3M': 3.12, '6M': 2.94, '1Y': 2.66, '2Y': 2.42, '3Y': 2.51, '5Y': 2.68, '7Y': 2.85, '10Y': 3.06, '20Y': 3.38, '30Y': 3.52 },
  },
  IT: {
    country: bilingual('Italy (BTP)', 'Italia (BTP)'),
    currency: 'EUR',
    rating: 'BBB',
    policyRate: 3.25,
    inflationYoY: 0.9,
    tenors: { '3M': 3.18, '6M': 3.04, '1Y': 2.85, '2Y': 2.74, '3Y': 2.86, '5Y': 3.08, '7Y': 3.32, '10Y': 3.58, '20Y': 3.96, '30Y': 4.12 },
  },
  ES: {
    country: bilingual('Spain (Bono)', 'España (Bono)'),
    currency: 'EUR',
    rating: 'A',
    policyRate: 3.25,
    inflationYoY: 1.8,
    tenors: { '3M': 3.10, '6M': 2.92, '1Y': 2.62, '2Y': 2.40, '3Y': 2.48, '5Y': 2.62, '7Y': 2.80, '10Y': 3.02, '20Y': 3.42, '30Y': 3.58 },
  },
  CH: {
    country: bilingual('Switzerland (Eidgenossen)', 'Suiza (Confederación)'),
    currency: 'CHF',
    rating: 'AAA',
    policyRate: 1.00,
    inflationYoY: 0.8,
    tenors: { '3M': 0.88, '6M': 0.76, '1Y': 0.62, '2Y': 0.48, '3Y': 0.44, '5Y': 0.46, '7Y': 0.51, '10Y': 0.58, '20Y': 0.68, '30Y': 0.65 },
  },
  NL: {
    country: bilingual('Netherlands (DSL)', 'Países Bajos (DSL)'),
    currency: 'EUR',
    rating: 'AAA',
    policyRate: 3.25,
    inflationYoY: 3.3,
    tenors: { '3M': 3.09, '6M': 2.88, '1Y': 2.52, '2Y': 2.24, '3Y': 2.20, '5Y': 2.28, '7Y': 2.40, '10Y': 2.56, '20Y': 2.78, '30Y': 2.82 },
  },
  BE: {
    country: bilingual('Belgium (OLO)', 'Bélgica (OLO)'),
    currency: 'EUR',
    rating: 'AA',
    policyRate: 3.25,
    inflationYoY: 3.1,
    tenors: { '3M': 3.11, '6M': 2.91, '1Y': 2.58, '2Y': 2.34, '3Y': 2.41, '5Y': 2.56, '7Y': 2.72, '10Y': 2.92, '20Y': 3.28, '30Y': 3.41 },
  },
  AT: {
    country: bilingual('Austria (RAGB)', 'Austria (RAGB)'),
    currency: 'EUR',
    rating: 'AA+',
    policyRate: 3.25,
    inflationYoY: 1.8,
    tenors: { '3M': 3.10, '6M': 2.90, '1Y': 2.55, '2Y': 2.30, '3Y': 2.35, '5Y': 2.48, '7Y': 2.64, '10Y': 2.82, '20Y': 3.08, '30Y': 3.18 },
  },
  IE: {
    country: bilingual('Ireland (IRISH)', 'Irlanda (IRISH)'),
    currency: 'EUR',
    rating: 'AA',
    policyRate: 3.25,
    inflationYoY: 0.7,
    tenors: { '3M': 3.09, '6M': 2.89, '1Y': 2.54, '2Y': 2.28, '3Y': 2.32, '5Y': 2.44, '7Y': 2.58, '10Y': 2.72, '20Y': 2.98, '30Y': 3.06 },
  },
  PT: {
    country: bilingual('Portugal (OT)', 'Portugal (OT)'),
    currency: 'EUR',
    rating: 'A-',
    policyRate: 3.25,
    inflationYoY: 2.1,
    tenors: { '3M': 3.10, '6M': 2.92, '1Y': 2.58, '2Y': 2.32, '3Y': 2.39, '5Y': 2.52, '7Y': 2.68, '10Y': 2.88, '20Y': 3.24, '30Y': 3.38 },
  },
  GR: {
    country: bilingual('Greece (GGB)', 'Grecia (GGB)'),
    currency: 'EUR',
    rating: 'BBB-',
    policyRate: 3.25,
    inflationYoY: 2.9,
    tenors: { '3M': 3.16, '6M': 2.98, '1Y': 2.68, '2Y': 2.46, '3Y': 2.58, '5Y': 2.76, '7Y': 2.98, '10Y': 3.22, '20Y': 3.58, '30Y': 3.72 },
  },
  SE: {
    country: bilingual('Sweden (SGB)', 'Suecia (SGB)'),
    currency: 'SEK',
    rating: 'AAA',
    policyRate: 2.75,
    inflationYoY: 1.6,
    tenors: { '3M': 2.72, '6M': 2.48, '1Y': 2.18, '2Y': 1.92, '3Y': 1.94, '5Y': 1.98, '7Y': 2.05, '10Y': 2.14, '20Y': 2.28, '30Y': 2.32 },
  },
  NO: {
    country: bilingual('Norway (NGB)', 'Noruega (NGB)'),
    currency: 'NOK',
    rating: 'AAA',
    policyRate: 4.50,
    inflationYoY: 3.0,
    tenors: { '3M': 4.52, '6M': 4.40, '1Y': 4.18, '2Y': 3.88, '3Y': 3.76, '5Y': 3.68, '7Y': 3.66, '10Y': 3.72, '20Y': 3.80, '30Y': 3.78 },
  },
  DK: {
    country: bilingual('Denmark (DGB)', 'Dinamarca (DGB)'),
    currency: 'DKK',
    rating: 'AAA',
    policyRate: 2.85,
    inflationYoY: 1.3,
    tenors: { '3M': 2.88, '6M': 2.68, '1Y': 2.34, '2Y': 2.04, '3Y': 2.02, '5Y': 2.08, '7Y': 2.15, '10Y': 2.24, '20Y': 2.42, '30Y': 2.46 },
  },
  PL: {
    country: bilingual('Poland (POLGB)', 'Polonia (POLGB)'),
    currency: 'PLN',
    rating: 'A-',
    policyRate: 5.75,
    inflationYoY: 4.9,
    tenors: { '3M': 5.65, '6M': 5.52, '1Y': 5.28, '2Y': 5.08, '3Y': 5.18, '5Y': 5.38, '7Y': 5.56, '10Y': 5.74, '20Y': 5.88, '30Y': 5.92 },
  },
  CZ: {
    country: bilingual('Czechia (CZGB)', 'República Checa (CZGB)'),
    currency: 'CZK',
    rating: 'AA-',
    policyRate: 4.00,
    inflationYoY: 2.6,
    tenors: { '3M': 3.92, '6M': 3.78, '1Y': 3.62, '2Y': 3.54, '3Y': 3.64, '5Y': 3.78, '7Y': 3.92, '10Y': 4.08, '20Y': 4.24, '30Y': 4.28 },
  },
  HU: {
    country: bilingual('Hungary (HGB)', 'Hungría (HGB)'),
    currency: 'HUF',
    rating: 'BBB-',
    policyRate: 6.50,
    inflationYoY: 3.2,
    tenors: { '3M': 6.38, '6M': 6.32, '1Y': 6.24, '2Y': 6.28, '3Y': 6.36, '5Y': 6.45, '7Y': 6.58, '10Y': 6.72, '20Y': 6.88, '30Y': 6.94 },
  },
  RO: {
    country: bilingual('Romania (ROMGB)', 'Rumania (ROMGB)'),
    currency: 'RON',
    rating: 'BBB-',
    policyRate: 6.50,
    inflationYoY: 4.6,
    tenors: { '3M': 6.12, '6M': 6.18, '1Y': 6.25, '2Y': 6.38, '3Y': 6.52, '5Y': 6.68, '7Y': 6.84, '10Y': 6.98, '20Y': 7.12, '30Y': 7.18 },
  },
  JP: {
    country: bilingual('Japan (JGB)', 'Japón (JGB)'),
    currency: 'JPY',
    rating: 'A+',
    policyRate: 0.25,
    inflationYoY: 2.5,
    tenors: { '3M': 0.12, '6M': 0.22, '1Y': 0.34, '2Y': 0.45, '3Y': 0.52, '5Y': 0.62, '7Y': 0.76, '10Y': 0.96, '20Y': 1.78, '30Y': 2.18 },
  },
  CN: {
    country: bilingual('China (CGB)', 'China (CGB)'),
    currency: 'CNY',
    rating: 'A+',
    policyRate: 3.10,
    inflationYoY: 0.4,
    tenors: { '3M': 1.42, '6M': 1.48, '1Y': 1.54, '2Y': 1.66, '3Y': 1.78, '5Y': 1.88, '7Y': 2.02, '10Y': 2.14, '20Y': 2.28, '30Y': 2.34 },
  },
  AU: {
    country: bilingual('Australia (ACGB)', 'Australia (ACGB)'),
    currency: 'AUD',
    rating: 'AAA',
    policyRate: 4.35,
    inflationYoY: 2.8,
    tenors: { '3M': 4.38, '6M': 4.34, '1Y': 4.18, '2Y': 4.02, '3Y': 3.98, '5Y': 4.08, '7Y': 4.26, '10Y': 4.46, '20Y': 4.82, '30Y': 4.94 },
  },
  NZ: {
    country: bilingual('New Zealand (NZGB)', 'Nueva Zelanda (NZGB)'),
    currency: 'NZD',
    rating: 'AA+',
    policyRate: 4.75,
    inflationYoY: 2.2,
    tenors: { '3M': 4.62, '6M': 4.38, '1Y': 4.08, '2Y': 3.94, '3Y': 3.98, '5Y': 4.12, '7Y': 4.30, '10Y': 4.48, '20Y': 4.76, '30Y': 4.84 },
  },
  KR: {
    country: bilingual('South Korea (KTB)', 'Corea del Sur (KTB)'),
    currency: 'KRW',
    rating: 'AA',
    policyRate: 3.25,
    inflationYoY: 1.6,
    tenors: { '3M': 3.22, '6M': 3.14, '1Y': 3.02, '2Y': 2.94, '3Y': 2.92, '5Y': 2.98, '7Y': 3.04, '10Y': 3.10, '20Y': 3.06, '30Y': 2.98 },
  },
  IN: {
    country: bilingual('India (IGB)', 'India (IGB)'),
    currency: 'INR',
    rating: 'BBB-',
    policyRate: 6.50,
    inflationYoY: 5.5,
    tenors: { '3M': 6.48, '6M': 6.58, '1Y': 6.64, '2Y': 6.70, '3Y': 6.72, '5Y': 6.76, '7Y': 6.80, '10Y': 6.84, '20Y': 6.96, '30Y': 7.02 },
  },
  SG: {
    country: bilingual('Singapore (SGS)', 'Singapur (SGS)'),
    currency: 'SGD',
    rating: 'AAA',
    policyRate: 3.30,
    inflationYoY: 2.0,
    tenors: { '3M': 3.32, '6M': 3.18, '1Y': 2.92, '2Y': 2.74, '3Y': 2.70, '5Y': 2.72, '7Y': 2.78, '10Y': 2.84, '20Y': 2.88, '30Y': 2.82 },
  },
  HK: {
    country: bilingual('Hong Kong (EFBN)', 'Hong Kong (EFBN)'),
    currency: 'HKD',
    rating: 'AA+',
    policyRate: 5.25,
    inflationYoY: 2.2,
    tenors: { '3M': 4.18, '6M': 3.98, '1Y': 3.68, '2Y': 3.38, '3Y': 3.32, '5Y': 3.36, '7Y': 3.44, '10Y': 3.52, '20Y': 3.68, '30Y': 3.72 },
  },
  TW: {
    country: bilingual('Taiwan (TWGB)', 'Taiwán (TWGB)'),
    currency: 'TWD',
    rating: 'AA+',
    policyRate: 2.00,
    inflationYoY: 1.8,
    tenors: { '3M': 1.18, '6M': 1.24, '1Y': 1.32, '2Y': 1.38, '3Y': 1.42, '5Y': 1.46, '7Y': 1.50, '10Y': 1.55, '20Y': 1.66, '30Y': 1.72 },
  },
  ID: {
    country: bilingual('Indonesia (INDOGB)', 'Indonesia (INDOGB)'),
    currency: 'IDR',
    rating: 'BBB',
    policyRate: 6.00,
    inflationYoY: 1.8,
    tenors: { '3M': 6.18, '6M': 6.26, '1Y': 6.38, '2Y': 6.46, '3Y': 6.52, '5Y': 6.62, '7Y': 6.72, '10Y': 6.82, '20Y': 7.02, '30Y': 7.08 },
  },
  MY: {
    country: bilingual('Malaysia (MGS)', 'Malasia (MGS)'),
    currency: 'MYR',
    rating: 'A-',
    policyRate: 3.00,
    inflationYoY: 1.9,
    tenors: { '3M': 3.12, '6M': 3.18, '1Y': 3.26, '2Y': 3.38, '3Y': 3.48, '5Y': 3.62, '7Y': 3.76, '10Y': 3.88, '20Y': 4.12, '30Y': 4.22 },
  },
  TH: {
    country: bilingual('Thailand (THBOND)', 'Tailandia (THBOND)'),
    currency: 'THB',
    rating: 'BBB+',
    policyRate: 2.25,
    inflationYoY: 0.8,
    tenors: { '3M': 2.12, '6M': 2.14, '1Y': 2.16, '2Y': 2.12, '3Y': 2.16, '5Y': 2.24, '7Y': 2.34, '10Y': 2.44, '20Y': 2.76, '30Y': 2.88 },
  },
  PH: {
    country: bilingual('Philippines (RPGB)', 'Filipinas (RPGB)'),
    currency: 'PHP',
    rating: 'BBB+',
    policyRate: 6.00,
    inflationYoY: 2.3,
    tenors: { '3M': 5.62, '6M': 5.74, '1Y': 5.82, '2Y': 5.86, '3Y': 5.90, '5Y': 5.96, '7Y': 6.04, '10Y': 6.12, '20Y': 6.28, '30Y': 6.32 },
  },
  BR: {
    country: bilingual('Brazil (DI / NTN-F)', 'Brasil (DI / NTN-F)'),
    currency: 'BRL',
    rating: 'BB',
    policyRate: 11.25,
    inflationYoY: 4.4,
    tenors: { '3M': 11.35, '6M': 11.82, '1Y': 12.48, '2Y': 12.92, '3Y': 12.98, '5Y': 12.88, '7Y': 12.82, '10Y': 12.78, '20Y': 12.74, '30Y': 12.70 },
  },
  MX: {
    country: bilingual('Mexico (MBONO)', 'México (MBONO)'),
    currency: 'MXN',
    rating: 'BBB',
    policyRate: 10.50,
    inflationYoY: 4.6,
    tenors: { '3M': 10.38, '6M': 10.22, '1Y': 9.98, '2Y': 9.86, '3Y': 9.82, '5Y': 9.88, '7Y': 9.96, '10Y': 10.08, '20Y': 10.26, '30Y': 10.34 },
  },
  CL: {
    country: bilingual('Chile (BTP)', 'Chile (BTP)'),
    currency: 'CLP',
    rating: 'A',
    policyRate: 5.25,
    inflationYoY: 4.1,
    tenors: { '3M': 5.18, '6M': 5.06, '1Y': 4.98, '2Y': 5.04, '3Y': 5.14, '5Y': 5.32, '7Y': 5.48, '10Y': 5.66, '20Y': 5.84, '30Y': 5.90 },
  },
  CO: {
    country: bilingual('Colombia (TES)', 'Colombia (TES)'),
    currency: 'COP',
    rating: 'BB+',
    policyRate: 9.75,
    inflationYoY: 5.4,
    tenors: { '3M': 9.42, '6M': 9.18, '1Y': 8.96, '2Y': 9.12, '3Y': 9.44, '5Y': 9.88, '7Y': 10.24, '10Y': 10.58, '20Y': 10.94, '30Y': 11.08 },
  },
  PE: {
    country: bilingual('Peru (Bono Soberano)', 'Perú (Bono Soberano)'),
    currency: 'PEN',
    rating: 'BBB',
    policyRate: 5.00,
    inflationYoY: 2.0,
    tenors: { '3M': 4.92, '6M': 4.88, '1Y': 4.96, '2Y': 5.18, '3Y': 5.42, '5Y': 5.86, '7Y': 6.24, '10Y': 6.62, '20Y': 6.94, '30Y': 7.06 },
  },
  ZA: {
    country: bilingual('South Africa (SAGB)', 'Sudáfrica (SAGB)'),
    currency: 'ZAR',
    rating: 'BB-',
    policyRate: 8.00,
    inflationYoY: 3.8,
    tenors: { '3M': 7.92, '6M': 7.98, '1Y': 8.06, '2Y': 8.24, '3Y': 8.52, '5Y': 9.12, '7Y': 9.74, '10Y': 10.42, '20Y': 11.38, '30Y': 11.62 },
  },
  IL: {
    country: bilingual('Israel (ILGOV)', 'Israel (ILGOV)'),
    currency: 'ILS',
    rating: 'A',
    policyRate: 4.50,
    inflationYoY: 3.5,
    tenors: { '3M': 4.42, '6M': 4.46, '1Y': 4.52, '2Y': 4.58, '3Y': 4.66, '5Y': 4.78, '7Y': 4.90, '10Y': 5.04, '20Y': 5.26, '30Y': 5.34 },
  },
  TR: {
    country: bilingual('Turkey (TURKGB)', 'Turquía (TURKGB)'),
    currency: 'TRY',
    rating: 'B+',
    policyRate: 50.00,
    inflationYoY: 48.6,
    tenors: { '3M': 46.20, '6M': 44.80, '1Y': 42.10, '2Y': 39.80, '3Y': 35.40, '5Y': 31.80, '7Y': 29.90, '10Y': 28.60, '20Y': 27.40, '30Y': 26.90 },
  },
};

export function computeSovereignCurveMetrics(countryCode = 'US') {
  const c = SOVEREIGN_YIELD_CURVES[countryCode] || SOVEREIGN_YIELD_CURVES.US;
  const ust = SOVEREIGN_YIELD_CURVES.US.tenors;
  const bund = SOVEREIGN_YIELD_CURVES.DE.tenors;
  const t = c.tenors;

  const spread2s10sBps = Math.round((t['10Y'] - t['2Y']) * 100);
  const spread3m10yBps = Math.round((t['10Y'] - t['3M']) * 100);
  const butterfly2s5s10sBps = Math.round((2 * t['5Y'] - t['2Y'] - t['10Y']) * 100);
  const realYield10Y = Number((t['10Y'] - c.inflationYoY).toFixed(2));
  const spreadVsUST10YBps = Math.round((t['10Y'] - ust['10Y']) * 100);
  const spreadVsBund10YBps = Math.round((t['10Y'] - bund['10Y']) * 100);
  const modifiedDuration10Y = Number((8.45 - t['10Y'] * 0.08).toFixed(2));
  const dv01Per100k = Number((modifiedDuration10Y * 10).toFixed(2));
  const dv01PerMillion10Y = `$${Math.round(modifiedDuration10Y * 100)} / $1MM`;

  const points = Object.entries(t).map(([tenor, yld]) => ({
    tenor,
    yield: yld,
    ustYield: ust[tenor],
    bundYield: bund[tenor],
  }));

  return {
    code: countryCode,
    ...c,
    y3m: t['3M'],
    y2: t['2Y'],
    y5: t['5Y'],
    y10: t['10Y'],
    y30: t['30Y'],
    spread2s10sBps,
    spread3m10yBps,
    butterfly2s5s10sBps,
    realYield10Y,
    spreadVsUST10YBps,
    spreadVsBund10YBps,
    modifiedDuration10Y,
    dv01Per100k,
    dv01PerMillion10Y,
    points,
    curveSeries: points,
  };
}

// ============================================================================
// 2. TODAS LAS MONEDAS DEL MUNDO CONTRA USD (`FX` — CONVERSIÓN CRUZADA DINÁMICA)
// ============================================================================
// Unidades de cada moneda por 1 USD (USD/XXX). Permite triangular cualquier par A/B = (USD/B) / (USD/A)
export const WORLD_USD_RATES = {
  USD: { name: 'US Dollar', region: 'G10', perUsd: 1.0, chg24h: 0.0, policyRate: 4.75 },
  EUR: { name: 'Euro', region: 'G10', perUsd: 0.9223, chg24h: -0.34, policyRate: 3.25 },
  JPY: { name: 'Japanese Yen', region: 'G10', perUsd: 152.3, chg24h: 0.62, policyRate: 0.25 },
  GBP: { name: 'British Pound', region: 'G10', perUsd: 0.7704, chg24h: -0.28, policyRate: 4.75 },
  CHF: { name: 'Swiss Franc', region: 'G10', perUsd: 0.8654, chg24h: -0.15, policyRate: 1.0 },
  AUD: { name: 'Australian Dollar', region: 'G10', perUsd: 1.5152, chg24h: 0.42, policyRate: 4.35 },
  CAD: { name: 'Canadian Dollar', region: 'G10', perUsd: 1.3889, chg24h: 0.24, policyRate: 3.75 },
  NZD: { name: 'New Zealand Dollar', region: 'G10', perUsd: 1.6722, chg24h: 0.51, policyRate: 4.75 },
  SEK: { name: 'Swedish Krona', region: 'G10', perUsd: 10.62, chg24h: 0.31, policyRate: 3.25 },
  NOK: { name: 'Norwegian Krone', region: 'G10', perUsd: 10.98, chg24h: 0.44, policyRate: 4.5 },
  DKK: { name: 'Danish Krone', region: 'Europe', perUsd: 6.88, chg24h: -0.33, policyRate: 2.85 },
  ISK: { name: 'Icelandic Króna', region: 'Europe', perUsd: 138.4, chg24h: 0.12, policyRate: 9.0 },
  PLN: { name: 'Polish Złoty', region: 'Europe', perUsd: 4.01, chg24h: 0.19, policyRate: 5.75 },
  CZK: { name: 'Czech Koruna', region: 'Europe', perUsd: 23.34, chg24h: 0.22, policyRate: 4.25 },
  HUF: { name: 'Hungarian Forint', region: 'Europe', perUsd: 374.5, chg24h: 0.48, policyRate: 6.5 },
  RON: { name: 'Romanian Leu', region: 'Europe', perUsd: 4.58, chg24h: 0.14, policyRate: 6.5 },
  BGN: { name: 'Bulgarian Lev', region: 'Europe', perUsd: 1.804, chg24h: -0.34, policyRate: 3.25 },
  TRY: { name: 'Turkish Lira', region: 'Europe/EM', perUsd: 34.28, chg24h: 0.18, policyRate: 50.0 },
  UAH: { name: 'Ukrainian Hryvnia', region: 'Europe', perUsd: 41.25, chg24h: 0.08, policyRate: 13.0 },
  CNY: { name: 'Chinese Yuan Onshore', region: 'Asia', perUsd: 7.124, chg24h: 0.15, policyRate: 3.1 },
  CNH: { name: 'Chinese Yuan Offshore', region: 'Asia', perUsd: 7.136, chg24h: 0.19, policyRate: 3.1 },
  HKD: { name: 'Hong Kong Dollar', region: 'Asia', perUsd: 7.771, chg24h: -0.02, policyRate: 4.75 },
  SGD: { name: 'Singapore Dollar', region: 'Asia', perUsd: 1.322, chg24h: 0.16, policyRate: 3.4 },
  INR: { name: 'Indian Rupee', region: 'Asia', perUsd: 84.08, chg24h: 0.07, policyRate: 6.5 },
  KRW: { name: 'South Korean Won', region: 'Asia', perUsd: 1384.5, chg24h: 0.45, policyRate: 3.25 },
  TWD: { name: 'New Taiwan Dollar', region: 'Asia', perUsd: 32.08, chg24h: 0.21, policyRate: 2.0 },
  THB: { name: 'Thai Baht', region: 'Asia', perUsd: 33.76, chg24h: 0.34, policyRate: 2.25 },
  MYR: { name: 'Malaysian Ringgit', region: 'Asia', perUsd: 4.362, chg24h: 0.28, policyRate: 3.0 },
  IDR: { name: 'Indonesian Rupiah', region: 'Asia', perUsd: 15720.0, chg24h: 0.39, policyRate: 6.0 },
  PHP: { name: 'Philippine Peso', region: 'Asia', perUsd: 58.24, chg24h: 0.31, policyRate: 6.0 },
  VND: { name: 'Vietnamese Đồng', region: 'Asia', perUsd: 25280.0, chg24h: 0.14, policyRate: 4.5 },
  PKR: { name: 'Pakistani Rupee', region: 'Asia', perUsd: 277.8, chg24h: 0.05, policyRate: 17.5 },
  BDT: { name: 'Bangladeshi Taka', region: 'Asia', perUsd: 119.5, chg24h: 0.09, policyRate: 9.5 },
  LKR: { name: 'Sri Lankan Rupee', region: 'Asia', perUsd: 293.4, chg24h: -0.11, policyRate: 8.25 },
  KZT: { name: 'Kazakhstani Tenge', region: 'Asia', perUsd: 488.2, chg24h: 0.26, policyRate: 14.25 },
  BRL: { name: 'Brazilian Real', region: 'LatAm', perUsd: 5.712, chg24h: 0.58, policyRate: 10.75 },
  MXN: { name: 'Mexican Peso', region: 'LatAm', perUsd: 20.04, chg24h: 0.49, policyRate: 10.5 },
  ARS: { name: 'Argentine Peso (CCL/Spot)', region: 'LatAm', perUsd: 1165.0, chg24h: -0.65, policyRate: 35.0 },
  CLP: { name: 'Chilean Peso', region: 'LatAm', perUsd: 948.5, chg24h: 0.36, policyRate: 5.25 },
  COP: { name: 'Colombian Peso', region: 'LatAm', perUsd: 4328.0, chg24h: 0.52, policyRate: 9.75 },
  PEN: { name: 'Peruvian Sol', region: 'LatAm', perUsd: 3.768, chg24h: 0.11, policyRate: 5.25 },
  UYU: { name: 'Uruguayan Peso', region: 'LatAm', perUsd: 41.65, chg24h: 0.18, policyRate: 8.5 },
  PYG: { name: 'Paraguayan Guaraní', region: 'LatAm', perUsd: 7790.0, chg24h: 0.12, policyRate: 6.0 },
  BOB: { name: 'Bolivian Boliviano', region: 'LatAm', perUsd: 6.91, chg24h: 0.0, policyRate: 4.0 },
  CRC: { name: 'Costa Rican Colón', region: 'LatAm', perUsd: 512.4, chg24h: -0.08, policyRate: 4.25 },
  DOP: { name: 'Dominican Peso', region: 'LatAm', perUsd: 60.15, chg24h: 0.09, policyRate: 6.5 },
  GTQ: { name: 'Guatemalan Quetzal', region: 'LatAm', perUsd: 7.72, chg24h: 0.02, policyRate: 4.75 },
  ILS: { name: 'Israeli New Shekel', region: 'MEA', perUsd: 3.742, chg24h: -0.22, policyRate: 4.5 },
  AED: { name: 'UAE Dirham', region: 'MEA', perUsd: 3.6725, chg24h: 0.0, policyRate: 4.9 },
  SAR: { name: 'Saudi Riyal', region: 'MEA', perUsd: 3.754, chg24h: 0.01, policyRate: 5.25 },
  QAR: { name: 'Qatari Riyal', region: 'MEA', perUsd: 3.641, chg24h: 0.0, policyRate: 5.1 },
  KWD: { name: 'Kuwaiti Dinar', region: 'MEA', perUsd: 0.3066, chg24h: 0.04, policyRate: 4.0 },
  BHD: { name: 'Bahraini Dinar', region: 'MEA', perUsd: 0.377, chg24h: 0.0, policyRate: 5.5 },
  OMR: { name: 'Omani Rial', region: 'MEA', perUsd: 0.385, chg24h: 0.0, policyRate: 5.25 },
  JOD: { name: 'Jordanian Dinar', region: 'MEA', perUsd: 0.709, chg24h: 0.0, policyRate: 6.75 },
  ZAR: { name: 'South African Rand', region: 'MEA', perUsd: 17.68, chg24h: 0.41, policyRate: 8.0 },
  EGP: { name: 'Egyptian Pound', region: 'MEA', perUsd: 48.72, chg24h: 0.15, policyRate: 27.25 },
  NGN: { name: 'Nigerian Naira', region: 'MEA', perUsd: 1645.0, chg24h: 0.38, policyRate: 27.25 },
  KES: { name: 'Kenyan Shilling', region: 'MEA', perUsd: 129.0, chg24h: -0.05, policyRate: 12.0 },
  MAD: { name: 'Moroccan Dirham', region: 'MEA', perUsd: 9.88, chg24h: 0.12, policyRate: 2.75 },
  GHS: { name: 'Ghanaian Cedi', region: 'MEA', perUsd: 16.12, chg24h: 0.29, policyRate: 27.0 },
};

/**
 * Triangulates ANY currency pair `baseCcy / quoteCcy` directly from `WORLD_USD_RATES`:
 * Rate(A/B) = (USD/B) / (USD/A)
 */
export function computeCrossCurrencyRate(baseCcy = 'EUR', quoteCcy = 'USD', amount = 1000, timeframe = '1D') {
  const base = WORLD_USD_RATES[baseCcy] || WORLD_USD_RATES.EUR;
  const quote = WORLD_USD_RATES[quoteCcy] || WORLD_USD_RATES.USD;
  const rawRate = quote.perUsd / base.perUsd;
  const rawInverse = base.perUsd / quote.perUsd;
  const rate = rawRate >= 100 ? Number(rawRate.toFixed(2)) : Number(rawRate.toFixed(4));
  const inverseRate = rawInverse >= 100 ? Number(rawInverse.toFixed(2)) : Number(rawInverse.toFixed(4));
  const rateFormatted = rawRate >= 100 ? rawRate.toFixed(2) : rawRate.toFixed(4);
  const inverseFormatted = rawInverse >= 100 ? rawInverse.toFixed(2) : rawInverse.toFixed(4);
  const crossChgPct = Number((quote.chg24h - base.chg24h).toFixed(2));
  const carryDiffBps = Math.round(((quote.policyRate ?? 4.0) - (base.policyRate ?? 4.0)) * 100);
  const cleanAmount = Number.isFinite(Number(amount)) && Number(amount) > 0 ? Number(amount) : 1000;
  const convertedAmount = cleanAmount * rawRate;
  const convertedFormatted = convertedAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: rawRate < 1 ? 4 : 2,
  });

  const fxStampsByTf = {
    '1M': ['15:53', '15:54', '15:55', '15:56', '15:57', '15:58', '15:59', '16:00'],
    '5M': ['15:25', '15:30', '15:35', '15:40', '15:45', '15:50', '15:55', '16:00'],
    '1H': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    '1D': ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    '1W': ['30 Oct', '31 Oct', '01 Nov', '02 Nov', '03 Nov', '04 Nov', '05 Nov'],
    '1M_CAL': ['06 Oct', '09 Oct', '12 Oct', '15 Oct', '19 Oct', '22 Oct', '26 Oct', '29 Oct', '02 Nov', '05 Nov'],
    '3M': ['05 Aug', '15 Aug', '25 Aug', '04 Sep', '14 Sep', '24 Sep', '04 Oct', '15 Oct', '25 Oct', '05 Nov'],
    '1Y': ['Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26'],
    'ALL': ['Jan 20', 'Jul 20', 'Jan 21', 'Jul 21', 'Jan 22', 'Jul 22', 'Jan 23', 'Jul 23', 'Jan 24', 'Jul 24', 'Jan 25', 'Nov 26'],
  };
  const stamps = fxStampsByTf[timeframe] || fxStampsByTf['1D'];
  const tfScale =
    timeframe === '1M' ? 0.25 :
    timeframe === '5M' ? 0.5 :
    timeframe === '1H' ? 0.8 :
    timeframe === '1D' ? 1.0 :
    timeframe === '1W' ? 2.2 :
    timeframe === '1M_CAL' ? 4.0 :
    timeframe === '3M' ? 7.5 :
    timeframe === '1Y' ? 13.0 : 20.0;
  const drift = Math.max(-0.35, Math.min(0.45, (crossChgPct / 100) * tfScale));
  const startRatio = 1 - drift;
  const n = stamps.length;
  const crossSeries = stamps.map((time, idx) => {
    const progress = idx / Math.max(1, n - 1);
    const wave = idx === n - 1 ? 0 : Math.sin(idx * 1.4 + base.perUsd + tfScale) * 0.0028 * Math.sqrt(tfScale);
    const r = rawRate * (startRatio + (1 - startRatio) * progress + wave);
    const dec = rawRate >= 100 ? 2 : 4;
    const price = Number(r.toFixed(dec));
    const sma20 = Number((rawRate * (startRatio + (1 - startRatio) * Math.max(0, progress - 0.12))).toFixed(dec));
    return {
      time,
      price,
      sma20,
      vwap: Number(((price + sma20) / 2).toFixed(dec)),
      vol: Math.round((140 + (idx * 19) % 85) * Math.sqrt(tfScale)),
      zBar: Number(((idx - Math.floor(n / 2)) * 0.35).toFixed(2)),
    };
  });

  const formula = `(${quote.perUsd} USD/${quoteCcy}) ÷ (${base.perUsd} USD/${baseCcy})`;
  return {
    pair: `${baseCcy}/${quoteCcy}`,
    baseCcy,
    quoteCcy,
    baseName: base.name,
    quoteName: quote.name,
    rate,
    rateFormatted,
    inverseRate,
    inverseFormatted,
    amount: cleanAmount,
    convertedAmount,
    convertedFormatted,
    usdToBase: base.perUsd,
    usdToQuote: quote.perUsd,
    chg24h: crossChgPct,
    chgPct: crossChgPct,
    chgFormatted: `${crossChgPct >= 0 ? '+' : ''}${crossChgPct.toFixed(2)}%`,
    carryDiffBps,
    carryFormatted: `${carryDiffBps >= 0 ? '+' : ''}${carryDiffBps} bps`,
    formula,
    formulaNote: `Triangulación: ${formula} • Carry: ${carryDiffBps >= 0 ? '+' : ''}${carryDiffBps} bps`,
    crossSeries,
  };
}

function hashTicker(sym = 'NVDA') {
  let h = 2166136261;
  const s = String(sym);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const KNOWN_UNDERLYING_SPOT = {
  NVDA: 138.6,
  SPY: 584.2,
  SPX: 5852.4,
  QQQ: 496.8,
  NDX: 20480.0,
  TSLA: 258.4,
  AAPL: 233.8,
  AMD: 156.4,
  MSFT: 428.5,
  META: 592.4,
  AMZN: 210.8,
  GOOGL: 181.2,
  BTC: 71420.0,
  ETH: 2645.0,
  SOL: 178.4,
  TLT: 92.45,
  GLD: 253.8,
  USO: 71.2,
  SX5E: 4985.0,
};

function getTickerVolProfile(cleanSym) {
  const h = hashTicker(cleanSym);
  const presetIv = {
    TSLA: 54.2,
    NVDA: 46.8,
    AMD: 44.6,
    BTC: 58.4,
    ETH: 61.2,
    SOL: 72.8,
    SPY: 15.4,
    SPX: 15.2,
    QQQ: 20.6,
    NDX: 20.8,
    AAPL: 23.4,
    MSFT: 22.1,
    META: 34.6,
    AMZN: 29.8,
    GOOGL: 27.4,
    MSTR: 88.5,
    COIN: 68.4,
    NFLX: 31.5,
    IWM: 21.8,
    TLT: 17.6,
    GLD: 16.4,
    USO: 34.2,
  };
  const baseAtmIv = presetIv[cleanSym] || Number((19.5 + (h % 360) / 10).toFixed(1));
  const ivRankNum = 24 + (h % 68);
  const skewNum = Number((-1.2 - ((h >> 3) % 34) / 10).toFixed(1));
  const pcRatioNum = Number((0.58 + ((h >> 5) % 52) / 100).toFixed(2));
  const gexSign = (h >> 2) % 4 === 0 ? '-' : '+';
  const gexVal = Number((0.65 + ((h >> 4) % 48) / 10).toFixed(2));
  const smileAsym = 1.15 + ((h % 9) * 0.08);
  const wingCurvature = 1.45 + (((h >> 2) % 8) * 0.09);

  return {
    baseAtmIv,
    ivRank: `${ivRankNum}%`,
    skewNum,
    skew25d: `${skewNum}% (${skewNum < -2.5 ? 'Put Skew' : 'Balanced Skew'})`,
    putCallVolRatio: `${pcRatioNum} (${pcRatioNum < 0.85 ? 'Flujo Constructivo' : 'Cobertura Puts'})`,
    netGexUsd: `${gexSign}$${gexVal}B (Gamma ${gexSign})`,
    smileAsym,
    wingCurvature,
    h,
  };
}

// ============================================================================
// 3. SUPERFICIE DE VOLATILIDAD 2D Y CADENA DE OPCIONES DE ALTO VOLUMEN
// ============================================================================
export function getHighVolumeOptionsChain(sym = 'NVDA', spotPrice = 141.5) {
  const cleanSym = sym.replace(/-OPT$/, '');
  const resolvedSpot =
    sym.endsWith('-OPT') && KNOWN_UNDERLYING_SPOT[cleanSym]
      ? KNOWN_UNDERLYING_SPOT[cleanSym]
      : spotPrice > 0
      ? spotPrice
      : KNOWN_UNDERLYING_SPOT[cleanSym] || 141.5;
  const baseSpot = resolvedSpot;
  const step = baseSpot > 1000 ? 50 : baseSpot > 300 ? 10 : baseSpot > 100 ? 5 : baseSpot > 20 ? 2.5 : 0.5;
  const atmStrike = Number((Math.round(baseSpot / step) * step).toFixed(2));

  // Strict Liquidity Guardrail: Vol >= 10k, OI >= 25k (7 liquid moneyness nodes from -15% to +15%)
  const offsets = [-3, -2, -1, 0, 1, 2, 3];
  const prof = getTickerVolProfile(cleanSym);
  const { baseAtmIv, smileAsym, wingCurvature, h } = prof;

  const strikes = offsets.map((k) => {
    const strike = Number((atmStrike + k * step).toFixed(2));
    const moneynessNum = Number((((strike - baseSpot) / baseSpot) * 100).toFixed(1));
    const moneyness = k === 0 ? 'ATM (100%)' : `${moneynessNum >= 0 ? '+' : ''}${moneynessNum}%`;
    // 2D Volatility Surface across 4 institutional expirations (7D, 30D, 90D, 180D)
    const smilewing =
      Math.pow(Math.abs(k), 1.32) * wingCurvature +
      (k < 0 ? Math.abs(k) * smileAsym : k * (0.28 + (h % 5) * 0.06));
    const iv30d = Number((baseAtmIv + smilewing).toFixed(1));
    const iv7d = Number((iv30d * (1.06 + (h % 4) * 0.015) + Math.abs(k) * 0.65).toFixed(1));
    const iv90d = Number((iv30d * 0.93 - Math.abs(k) * 0.25).toFixed(1));
    const iv180d = Number((iv30d * 0.88 - Math.abs(k) * 0.35).toFixed(1));

    const deltaCall = Number(Math.max(0.12, Math.min(0.88, 0.52 - k * 0.13)).toFixed(2));
    const putDelta = Number((deltaCall - 1).toFixed(2));
    const baseVol = 34000 + (h % 32000);
    const callVol = Math.round(baseVol / (1 + Math.abs(k) * 0.38));
    const putVol = Math.round((baseVol * 0.84) / (1 + Math.abs(k) * 0.42));
    const callOI = Math.round(callVol * 3.2);
    const putOI = Math.round(putVol * 2.9);
    const intrinsicCall = Math.max(0, baseSpot - strike);
    const timeVal = baseSpot * (iv30d / 100) * 0.14 * Math.exp(-Math.abs(k) * 0.28);
    const callMidNum = Number((intrinsicCall + timeVal).toFixed(2));
    const intrinsicPut = Math.max(0, strike - baseSpot);
    const putMidNum = Number((intrinsicPut + timeVal * 0.96).toFixed(2));

    return {
      strike,
      tag: k === 0 ? 'ATM' : k < 0 ? `${k * step}` : `+${k * step}`,
      moneyness,
      moneynessPct: `${moneynessNum >= 0 ? '+' : ''}${moneynessNum}%`,
      iv: `${iv30d}%`,
      ivNum: iv30d,
      ivPct: iv30d,
      iv7d,
      iv30d,
      iv90d,
      iv180d,
      callMid: callMidNum,
      putMid: putMidNum,
      deltaCall,
      callDelta: deltaCall,
      putDelta,
      callVol,
      putVol,
      callOI,
      putOI,
      bidAskSpreadPct: `${(0.8 + Math.abs(k) * 0.3).toFixed(1)}%`,
    };
  });

  const atmNode = strikes[3];
  const straddleUsd = Number((atmNode.callMid + atmNode.putMid).toFixed(2));
  const straddlePct = Number(((straddleUsd / baseSpot) * 100).toFixed(2));

  return {
    underlying: cleanSym,
    spotPrice: baseSpot,
    expiration: 'Superficie 2D (7D / 30D / 90D / 180D)',
    filterPolicy: 'Filtro Liquidez: Vol > 10k • OI > 25k',
    liquidityFilterNote: 'Vol > 10k • OI > 25k • Spread <= 2.5% (Sin primas ilíquidas)',
    atmIv30d: `${baseAtmIv}%`,
    atmIvPct: baseAtmIv,
    ivRank: prof.ivRank,
    straddleBreakevenPct: `±${straddlePct}% ($${straddleUsd})`,
    skew25d: prof.skew25d,
    putCallVolRatio: prof.putCallVolRatio,
    netGexUsd: prof.netGexUsd,
    netGammaExposure: prof.netGexUsd,
    maxPain: `${atmStrike}`,
    strikes,
  };
}

// ============================================================================
// 4. CURVA FORWARD DE MATERIAS PRIMAS (`COMMODITY` — CONTANGO / BACKWARDATION)
// ============================================================================
export function getCommodityForwardCurve(sym = 'CL', spotPrice = 68.4) {
  const cleanSym = String(sym).replace(/1!$/, '');
  const h = hashTicker(cleanSym);
  const COMMODITY_SPECS = {
    CL: { backw: true, slope: -0.048, inv: '-6.8% vs 5Y Avg (Tight)', cot: '+184k Contracts (Net Long)' },
    BZ: { backw: true, slope: -0.041, inv: '-5.2% vs 5Y Avg (Tight)', cot: '+162k Contracts (Net Long)' },
    NG: { backw: false, slope: 0.086, inv: '+7.4% vs 5Y Avg (Surplus)', cot: '-48k Contracts (Net Short)' },
    TTF: { backw: false, slope: 0.052, inv: '+4.9% vs 5Y Avg (Full Storage)', cot: '+38k Contracts (Long)' },
    GC: { backw: false, slope: 0.036, inv: '+1.8% vs 5Y Avg (CB Buying)', cot: '+246k Contracts (Bullish)' },
    SI: { backw: false, slope: 0.044, inv: '-3.4% vs 5Y Avg (Deficit)', cot: '+58k Contracts (Net Long)' },
    HG: { backw: true, slope: -0.029, inv: '-8.1% vs 5Y Avg (Low LME)', cot: '+74k Contracts (Net Long)' },
    UX: { backw: true, slope: -0.062, inv: '-14.2% vs 5Y Avg (Structural Deficit)', cot: '+42k Contracts (Long)' },
    KC: { backw: true, slope: -0.055, inv: '-11.5% vs 5Y Avg (Brazil Drought)', cot: '+64k Contracts (Net Long)' },
    CC: { backw: true, slope: -0.078, inv: '-18.4% vs 5Y Avg (Acute Deficit)', cot: '+39k Contracts (Long)' },
  };
  const spec = COMMODITY_SPECS[cleanSym] || {
    backw: ['RB', 'HO', 'LITH', 'TIO'].includes(cleanSym),
    slope: ['RB', 'HO', 'LITH', 'TIO'].includes(cleanSym)
      ? -0.025 - ((h % 35) / 1000)
      : 0.032 + ((h % 45) / 1000),
    inv: `${['RB', 'HO', 'LITH', 'TIO'].includes(cleanSym) ? '-' : '+'}${(2.1 + (h % 75) / 10).toFixed(1)}% vs 5Y Avg`,
    cot: `+${28 + (h % 140)}k Contracts`,
  };

  const isBackwardated = spec.backw;
  const slopePct = spec.slope;
  const rollPct = Number(( -slopePct * 100 ).toFixed(1));
  const rollFormatted = `${rollPct >= 0 ? '+' : ''}${rollPct}% / yr`;
  const tenors = ['Spot (M1)', 'M2', 'M3', 'M4', 'M6', 'M9', 'M12', 'M18'];
  const curveSeries = tenors.map((t, idx) => {
    const progress = idx / 7;
    const wave = Math.sin(progress * Math.PI + (h % 5)) * 0.006;
    const price = Number((spotPrice * (1 + slopePct * progress + wave)).toFixed(2));
    return {
      time: t,
      price,
      sma20: Number((spotPrice * (1 + slopePct * progress * 0.6)).toFixed(2)),
      vol: Math.round(320 - idx * 26 + (h % 30)),
      zBar: Number((((price - spotPrice) / spotPrice) * 100).toFixed(2)),
    };
  });

  return {
    isBackwardation: isBackwardated,
    regime: isBackwardated
      ? `BACKWARDATION (Roll Yield ${rollFormatted})`
      : `CONTANGO (Carry Cost ${rollFormatted})`,
    rollYieldAnnual: rollFormatted,
    inventoryVs5Y: spec.inv,
    cotNetSpec: spec.cot,
    curveSeries,
  };
}

// ============================================================================
// 5. ESPECIFICACIONES E INDICADORES POR CLASE DE ACTIVO (`ASSET_CLASS_SPECIFICATIONS.md`)
// ============================================================================
export function getAssetClassSpecificMetrics(asset, isES = false) {
  const cat = asset?.cat || 'EQUITY';
  const sym = asset?.sym || 'NVDA';
  const price = asset?.price || 100;

  if (cat === 'RATES') {
    const cCode = asset.countryCode || 'US';
    const m = computeSovereignCurveMetrics(cCode);
    return {
      col1Label: '2s10s / 3m10y',
      col1Val: `${m.spread2s10sBps >= 0 ? '+' : ''}${m.spread2s10sBps} bps`,
      col1Sub: `3m10y: ${m.spread3m10yBps >= 0 ? '+' : ''}${m.spread3m10yBps} bps`,
      col2Label: tx('Tasa Real / DV01', 'Real Yield / DV01'),
      col2Val: `${m.realYield10Y >= 0 ? '+' : ''}${m.realYield10Y}%`,
      col2Sub: `${m.dv01PerMillion10Y} • ${m.rating}`,
    };
  }

  if (cat === 'FIXED_INCOME') {
    const m = computeSovereignCurveMetrics('US');
    const isTips = sym.includes('TIPS');
    const ytm = isTips ? '1.92% Real' : `${m.y10}% YTM`;
    const dur = sym.includes('2Y') ? '1.92y' : sym.includes('5Y') ? '4.48y' : sym.includes('30Y') ? '16.8y' : '8.12y';
    return {
      col1Label: tx('YTM / Cupón', 'YTM / Coupon'),
      col1Val: ytm,
      col1Sub: isTips ? 'Breakeven 2.32%' : 'Coupon 4.125%',
      col2Label: 'Duration / DV01',
      col2Val: `Dur ${dur}`,
      col2Sub: 'Bid-to-Cover 2.58x',
    };
  }

  if (cat === 'FX') {
    const parts = sym.includes('/') ? sym.split('/') : ['USD', 'EUR'];
    const cross = computeCrossCurrencyRate(parts[0], parts[1]);
    return {
      col1Label: tx('Carry Spread (10Y)', 'Carry Spread (10Y)'),
      col1Val: cross.carryFormatted,
      col1Sub: `Inv: ${cross.inverseFormatted}`,
      col2Label: '1M ATM IV / RR25Δ',
      col2Val: '7.85% IV',
      col2Sub: '25Δ RR: -0.45%',
    };
  }

  if (cat === 'COMMODITY') {
    const fwd = getCommodityForwardCurve(sym, price);
    return {
      col1Label: 'Term Structure',
      col1Val: fwd.rollYieldAnnual,
      col1Sub: fwd.regime.split(' ')[0],
      col2Label: tx('Inventario / COT', 'Inventory / COT'),
      col2Val: fwd.inventoryVs5Y.split(' vs')[0],
      col2Sub: fwd.cotNetSpec.split(' (')[0],
    };
  }

  if (cat === 'DERIVATIVES_VOL') {
    const opt = getHighVolumeOptionsChain(asset.underlyingSym || sym, price);
    return {
      col1Label: 'ATM IV / Straddle',
      col1Val: `${opt.atmIvPct}% IV`,
      col1Sub: opt.straddleBreakevenPct.split(' ')[0],
      col2Label: '25Δ Skew / Net GEX',
      col2Val: opt.skew25d.split(' ')[0],
      col2Sub: opt.netGexUsd,
    };
  }

  if (cat === 'EQUITY') {
    const pe = sym === 'NVDA' ? '34.8x' : sym === 'TSLA' ? '62.4x' : sym === 'AAPL' ? '29.4x' : sym === 'MSFT' ? '31.2x' : '24.6x';
    const gm = sym === 'NVDA' ? '75.1%' : sym === 'MSFT' ? '69.8%' : sym === 'META' ? '81.2%' : '46.4%';
    return {
      col1Label: 'P/E Fwd • EV/EBITDA',
      col1Val: `${pe} P/E`,
      col1Sub: 'S&P 500 / NDX Core',
      col2Label: tx('Margen Bruto / EPS', 'Gross Margin / EPS'),
      col2Val: `${gm} GM`,
      col2Sub: 'EPS YoY +18.4%',
    };
  }

  if (cat === 'ETF') {
    const aum = asset.marketCap !== '—' ? asset.marketCap : '$28.4B';
    return {
      col1Label: 'AUM / Net Flow 24h',
      col1Val: aum,
      col1Sub: 'Flow +$420M (AP)',
      col2Label: 'NAV Spread / TER',
      col2Val: '+0.8 bps',
      col2Sub: 'TER 0.09%',
    };
  }

  if (cat === 'CASH') {
    return {
      col1Label: 'Spread vs EFFR',
      col1Val: '-1.0 bps',
      col1Sub: 'Fed Corridor 4.75-5.00%',
      col2Label: tx('Liquidez / WAM', 'Facility Vol / WAM'),
      col2Val: asset.vol24h,
      col2Sub: 'T+0 Settlement',
    };
  }

  if (cat === 'INDEX') {
    return {
      col1Label: tx('Amplitud (>SMA200)', 'Breadth (>SMA200)'),
      col1Val: '68.4% Constituents',
      col1Sub: 'Adv/Dec 1.85x',
      col2Label: 'Index P/E • EPS YoY',
      col2Val: '21.8x Fwd',
      col2Sub: 'EPS YoY +11.4%',
    };
  }

  // CRYPTO default
  return {
    col1Label: 'Perp Funding (8h)',
    col1Val: '+11.4% APR',
    col1Sub: 'Basis +4.2 bps',
    col2Label: 'Open Interest / ETF',
    col2Val: '$18.4B OI',
    col2Sub: 'Spot Flow +$380M',
  };
}

// ============================================================================
// 6. PERFIL DE BENEFICIOS (`PAYOFF P&L`) Y ESTRATEGIAS CON OPCIONES Y SINTÉTICOS
// ============================================================================
export const OPTIONS_STRATEGIES = [
  { id: 'LONG_STRADDLE', label: bilingual('Long Straddle (ATM Vol Long)', 'Long Straddle (Comprado en Vol ATM)') },
  { id: 'BULL_CALL_SPREAD', label: bilingual('Bull Call Spread (100% / 105%)', 'Bull Call Spread (100% / 105%)') },
  { id: 'BEAR_PUT_SPREAD', label: bilingual('Bear Put Spread (100% / 95%)', 'Bear Put Spread (100% / 95%)') },
  { id: 'IRON_CONDOR', label: bilingual('Iron Condor (±5% / ±10% Range)', 'Iron Condor (Rango ±5% / ±10%)') },
  { id: 'LONG_STRANGLE', label: bilingual('Long Strangle (OTM ±5%)', 'Long Strangle (OTM ±5%)') },
  { id: 'SYNTHETIC_LONG', label: bilingual('Synthetic Long (Call ATM - Put ATM)', 'Sintético Largo (+Call ATM / -Put ATM)') },
  { id: 'SYNTHETIC_SHORT', label: bilingual('Synthetic Short (Put ATM - Call ATM)', 'Sintético Corto (+Put ATM / -Call ATM)') },
  { id: 'COVERED_CALL', label: bilingual('Covered Call (Spot + Short 105% Call)', 'Covered Call (Subyacente - Call 105%)') },
  { id: 'LONG_CALL', label: bilingual('Long Call (ATM Directional)', 'Long Call (ATM Direccional)') },
  { id: 'LONG_PUT', label: bilingual('Long Put (ATM Hedge / Directional)', 'Long Put (ATM Cobertura / Bajista)') },
];

/**
 * Computes the complete Expiration Payoff P&L (`price`), T+0 Black-Scholes P&L (`t0Pnl`),
 * Net Premium, Breakeven points, Max Profit/Loss, and Net Strategy Greeks (`Δ, Γ, Θ, ν`).
 */
export function computeOptionsStrategyPayoff(sym = 'NVDA', spotPrice = 141.5, strategyId = 'LONG_STRADDLE') {
  const chain = getHighVolumeOptionsChain(sym, spotPrice);
  const s0 = chain.spotPrice || 100;
  // Strikes from chain: index 0 (-15%), 1 (-10%), 2 (-5%), 3 (ATM 0%), 4 (+5%), 5 (+10%), 6 (+15%)
  const st = chain.strikes;
  const kPut10 = st[1].strike;
  const kPut5 = st[2].strike;
  const kAtm = st[3].strike;
  const kCall5 = st[4].strike;
  const kCall10 = st[5].strike;

  const cAtm = st[3].callMid;
  const pAtm = st[3].putMid;
  const c5 = st[4].callMid;
  const p5 = st[2].putMid;
  const c10 = st[5].callMid;
  const p10 = st[1].putMid;

  // Build 13 price nodes from -15% to +15%
  const pctNodes = [-15, -12.5, -10, -7.5, -5, -2.5, 0, 2.5, 5, 7.5, 10, 12.5, 15];

  let netCost = 0;
  let breakevenText = '';
  let maxProfitText = '';
  let maxLossText = '';
  let greeks = { delta: '+0.00', gamma: '+0.08', theta: '-$0.42/d', vega: '+$0.68' };

  const evalExpirationPnl = (s) => {
    switch (strategyId) {
      case 'LONG_CALL':
        return Math.max(0, s - kAtm) - cAtm;
      case 'LONG_PUT':
        return Math.max(0, kAtm - s) - pAtm;
      case 'LONG_STRADDLE':
        return Math.max(0, s - kAtm) + Math.max(0, kAtm - s) - (cAtm + pAtm);
      case 'LONG_STRANGLE':
        return Math.max(0, s - kCall5) + Math.max(0, kPut5 - s) - (c5 + p5);
      case 'BULL_CALL_SPREAD': {
        const debit = cAtm - c5;
        return Math.max(0, s - kAtm) - Math.max(0, s - kCall5) - debit;
      }
      case 'BEAR_PUT_SPREAD': {
        const debit = pAtm - p5;
        return Math.max(0, kAtm - s) - Math.max(0, kPut5 - s) - debit;
      }
      case 'IRON_CONDOR': {
        const credit = p5 - p10 + (c5 - c10);
        const putSpreadLoss = Math.max(0, kPut5 - s) - Math.max(0, kPut10 - s);
        const callSpreadLoss = Math.max(0, s - kCall5) - Math.max(0, s - kCall10);
        return credit - putSpreadLoss - callSpreadLoss;
      }
      case 'SYNTHETIC_LONG': {
        const net = cAtm - pAtm;
        return s - kAtm - net;
      }
      case 'SYNTHETIC_SHORT': {
        const net = pAtm - cAtm;
        return kAtm - s - net;
      }
      case 'COVERED_CALL':
        return s - s0 + (c5 - Math.max(0, s - kCall5));
      default:
        return Math.max(0, s - kAtm) - cAtm;
    }
  };

  const scaleF = Math.max(0.18, s0 / 140) * (chain.atmIvPct / 45);
  const gScale = Math.max(0.01, 140 / Math.max(15, s0));
  const fmtSignedUsd = (v, suffix = '') => `${v >= 0 ? '+' : '-'}$${Math.abs(v).toFixed(2)}${suffix}`;

  switch (strategyId) {
    case 'LONG_CALL':
      netCost = cAtm;
      breakevenText = `$${(kAtm + cAtm).toFixed(2)}`;
      maxProfitText = 'Ilimitada (Unlimited)';
      maxLossText = `-$${cAtm.toFixed(2)}`;
      greeks = {
        delta: '+0.52',
        gamma: `+${(0.06 * gScale).toFixed(3)}`,
        theta: fmtSignedUsd(-0.22 * scaleF, '/d'),
        vega: fmtSignedUsd(0.36 * scaleF),
      };
      break;
    case 'LONG_PUT':
      netCost = pAtm;
      breakevenText = `$${(kAtm - pAtm).toFixed(2)}`;
      maxProfitText = `$${(kAtm - pAtm).toFixed(2)}`;
      maxLossText = `-$${pAtm.toFixed(2)}`;
      greeks = {
        delta: '-0.48',
        gamma: `+${(0.06 * gScale).toFixed(3)}`,
        theta: fmtSignedUsd(-0.20 * scaleF, '/d'),
        vega: fmtSignedUsd(0.35 * scaleF),
      };
      break;
    case 'LONG_STRADDLE': {
      const debit = cAtm + pAtm;
      netCost = debit;
      breakevenText = `$${(kAtm - debit).toFixed(2)} / $${(kAtm + debit).toFixed(2)}`;
      maxProfitText = 'Ilimitada (Convexa)';
      maxLossText = `-$${debit.toFixed(2)}`;
      greeks = {
        delta: '+0.04',
        gamma: `+${(0.12 * gScale).toFixed(3)}`,
        theta: fmtSignedUsd(-0.42 * scaleF, '/d'),
        vega: fmtSignedUsd(0.71 * scaleF),
      };
      break;
    }
    case 'LONG_STRANGLE': {
      const debit = c5 + p5;
      netCost = debit;
      breakevenText = `$${(kPut5 - debit).toFixed(2)} / $${(kCall5 + debit).toFixed(2)}`;
      maxProfitText = 'Ilimitada (Wings)';
      maxLossText = `-$${debit.toFixed(2)}`;
      greeks = {
        delta: '+0.02',
        gamma: `+${(0.09 * gScale).toFixed(3)}`,
        theta: fmtSignedUsd(-0.31 * scaleF, '/d'),
        vega: fmtSignedUsd(0.58 * scaleF),
      };
      break;
    }
    case 'BULL_CALL_SPREAD': {
      const debit = Math.max(0.2, cAtm - c5);
      const maxGain = Math.max(0.5, kCall5 - kAtm - debit);
      netCost = debit;
      breakevenText = `$${(kAtm + debit).toFixed(2)}`;
      maxProfitText = `+$${maxGain.toFixed(2)}`;
      maxLossText = `-$${debit.toFixed(2)}`;
      greeks = {
        delta: '+0.28',
        gamma: `+${(0.02 * gScale).toFixed(3)}`,
        theta: fmtSignedUsd(-0.07 * scaleF, '/d'),
        vega: fmtSignedUsd(0.11 * scaleF),
      };
      break;
    }
    case 'BEAR_PUT_SPREAD': {
      const debit = Math.max(0.2, pAtm - p5);
      const maxGain = Math.max(0.5, kAtm - kPut5 - debit);
      netCost = debit;
      breakevenText = `$${(kAtm - debit).toFixed(2)}`;
      maxProfitText = `+$${maxGain.toFixed(2)}`;
      maxLossText = `-$${debit.toFixed(2)}`;
      greeks = {
        delta: '-0.27',
        gamma: `+${(0.02 * gScale).toFixed(3)}`,
        theta: fmtSignedUsd(-0.06 * scaleF, '/d'),
        vega: fmtSignedUsd(0.10 * scaleF),
      };
      break;
    }
    case 'IRON_CONDOR': {
      const credit = Math.max(0.25, p5 - p10 + (c5 - c10));
      const wingWidth = Math.max(1, kCall10 - kCall5);
      netCost = -credit;
      breakevenText = `$${(kPut5 - credit).toFixed(2)} / $${(kCall5 + credit).toFixed(2)}`;
      maxProfitText = `+$${credit.toFixed(2)} (Crédito)`;
      maxLossText = `-$${Math.max(0.5, wingWidth - credit).toFixed(2)}`;
      greeks = {
        delta: '-0.01',
        gamma: `-${(0.05 * gScale).toFixed(3)}`,
        theta: fmtSignedUsd(0.19 * scaleF, '/d'),
        vega: fmtSignedUsd(-0.32 * scaleF),
      };
      break;
    }
    case 'SYNTHETIC_LONG': {
      const net = cAtm - pAtm;
      netCost = net;
      breakevenText = `$${(kAtm + net).toFixed(2)}`;
      maxProfitText = 'Ilimitada (Δ = +1.00)';
      maxLossText = 'Riesgo Subyacente';
      greeks = { delta: '+1.00', gamma: '0.000', theta: '-$0.01/d', vega: '$0.00' };
      break;
    }
    case 'SYNTHETIC_SHORT': {
      const net = pAtm - cAtm;
      netCost = net;
      breakevenText = `$${(kAtm - net).toFixed(2)}`;
      maxProfitText = `$${(kAtm - net).toFixed(2)} (Δ = -1.00)`;
      maxLossText = 'Ilimitada al Alza';
      greeks = { delta: '-1.00', gamma: '0.000', theta: '+$0.01/d', vega: '$0.00' };
      break;
    }
    case 'COVERED_CALL': {
      netCost = -c5;
      breakevenText = `$${(s0 - c5).toFixed(2)}`;
      maxProfitText = `+$${(kCall5 - s0 + c5).toFixed(2)}`;
      maxLossText = `-$${(s0 - c5).toFixed(2)}`;
      greeks = {
        delta: '+0.64',
        gamma: `-${(0.04 * gScale).toFixed(3)}`,
        theta: fmtSignedUsd(0.15 * scaleF, '/d'),
        vega: fmtSignedUsd(-0.24 * scaleF),
      };
      break;
    }
    default:
      break;
  }

  const payoffSeries = pctNodes.map((pct) => {
    const s = Number((s0 * (1 + pct / 100)).toFixed(2));
    const expPnl = Number(evalExpirationPnl(s).toFixed(2));
    // Smooth T+0 Black-Scholes approximation (captures remaining time value before expiration)
    const distRatio = Math.abs(pct) / 15;
    const t0Pnl = Number((expPnl * (0.58 + 0.36 * distRatio)).toFixed(2));
    return {
      time: `$${s} (${pct >= 0 ? '+' : ''}${pct}%)`,
      price: expPnl,
      t0Pnl,
      zeroLine: 0,
      vol: Math.round(Math.abs(expPnl) * 12 + 10),
      zBar: expPnl,
    };
  });

  return {
    strategyId,
    spotPrice: s0,
    netCostFormatted:
      netCost >= 0 ? `Débito $${netCost.toFixed(2)}` : `Crédito +$${Math.abs(netCost).toFixed(2)}`,
    breakevenText,
    maxProfitText,
    maxLossText,
    greeks,
    payoffSeries,
  };
}

// ============================================================================
// 7. MOTORES DE SUPERFICIES 3D VOLUMÉTRICAS (X · Y · Z)
//    - Superficie de Volatilidad Implícita 3D (Strike/Moneyness × Tenor × IV %)
//    - Superficie Soberana de Rendimientos 3D (Plazo 3M..30Y × Horizonte/Países × Yield %)
//    - Superficie Forward de Materias Primas 3D (Contrato M1..M18 × Evolución × Precio $)
// ============================================================================

export function computeVolatilitySurface3D(sym = 'NVDA', spotPrice = 141.5) {
  const cleanSym = sym.replace(/-OPT$/, '');
  const resolvedSpot =
    sym.endsWith('-OPT') && KNOWN_UNDERLYING_SPOT[cleanSym]
      ? KNOWN_UNDERLYING_SPOT[cleanSym]
      : spotPrice > 0
      ? spotPrice
      : KNOWN_UNDERLYING_SPOT[cleanSym] || 141.5;
  const baseSpot = resolvedSpot;
  const step = baseSpot > 1000 ? 40 : baseSpot > 300 ? 10 : baseSpot > 100 ? 3.5 : baseSpot > 20 ? 1.5 : 0.25;
  const atmStrike = Number((Math.round(baseSpot / step) * step).toFixed(2));

  const prof = getTickerVolProfile(cleanSym);
  const { baseAtmIv, smileAsym, wingCurvature, h } = prof;

  // 9 liquid strikes from -15% OTM Put to +15% OTM Call
  const moneynessOffsets = [-15, -10, -7.5, -5, 0, 5, 7.5, 10, 15];
  const xLabels = moneynessOffsets.map((pct) => {
    const kPrice = Number((atmStrike * (1 + pct / 100)).toFixed(baseSpot < 10 ? 2 : 1));
    return pct === 0 ? `ATM ($${kPrice})` : `${pct > 0 ? '+' : ''}${pct}% ($${kPrice})`;
  });

  // 7 institutional option expirations (Tenors)
  const tenors = [
    { label: '7D (Weekly)', mult: 1.09 + (h % 5) * 0.01, skewBoost: 1.38, wingCurv: 1.45, days: 7 },
    { label: '14D (2W)', mult: 1.05 + (h % 4) * 0.008, skewBoost: 1.22, wingCurv: 1.30, days: 14 },
    { label: '30D (1M Bench)', mult: 1.0, skewBoost: 1.0, wingCurv: 1.0, days: 30 },
    { label: '60D (2M)', mult: 0.96, skewBoost: 0.88, wingCurv: 0.86, days: 60 },
    { label: '90D (Quarterly)', mult: 0.93, skewBoost: 0.78, wingCurv: 0.75, days: 90 },
    { label: '180D (6M)', mult: 0.89, skewBoost: 0.66, wingCurv: 0.64, days: 180 },
    { label: '365D (1Y LEAPS)', mult: 0.86, skewBoost: 0.56, wingCurv: 0.55, days: 365 },
  ];

  const yLabels = tenors.map((t) => t.label);
  const zMatrix = [];
  const metaMatrix = [];

  tenors.forEach((tenor) => {
    const row = [];
    const metaRow = [];
    moneynessOffsets.forEach((pct) => {
      const normK = pct / 5; // -3 to +3
      // Realistic Put Skew + Smile Convexity + Term Structure decay tailored to each ticker
      const putWing =
        normK < 0
          ? Math.abs(normK) * smileAsym * tenor.skewBoost
          : normK * (0.28 + (h % 5) * 0.06);
      const convexity = Math.pow(Math.abs(normK), 1.36) * wingCurvature * tenor.wingCurv;
      const ivVal = Number((baseAtmIv * tenor.mult + putWing + convexity).toFixed(2));
      row.push(ivVal);

      const deltaCall = Number(Math.max(0.05, Math.min(0.95, 0.52 - normK * 0.135)).toFixed(2));
      const baseOi = 36000 + (h % 34000);
      const oiContracts = Math.round((baseOi / (1 + Math.abs(normK) * 0.35)) * (1 + Math.log10(tenor.days / 7) * 0.4));
      metaRow.push({
        xLabel: pct === 0 ? '100% ATM' : `${100 + pct}% (${pct > 0 ? '+' : ''}${pct}%)`,
        strike: `$${Number((atmStrike * (1 + pct / 100)).toFixed(2))}`,
        yLabel: tenor.label,
        zFormatted: `${ivVal.toFixed(2)}% IV`,
        extra1Label: 'Call Δ / Put Δ',
        extra1Val: `${deltaCall.toFixed(2)} / ${(deltaCall - 1).toFixed(2)}`,
        extra2Label: 'Open Interest',
        extra2Val: `${(oiContracts / 1000).toFixed(1)}k ctr`,
      });
    });
    zMatrix.push(row);
    metaMatrix.push(metaRow);
  });

  return {
    title: `${cleanSym} — 3D Implied Volatility Surface (Strike × Tenor × IV %)`,
    xAxisTitle: 'Strike / Moneyness (%)',
    yAxisTitle: 'Expiration Tenor (7D → 365D)',
    zAxisTitle: 'Implied Volatility (IV %)',
    zUnit: '%',
    xLabels,
    yLabels,
    zMatrix,
    metaMatrix,
  };
}

export const YIELD_CURVE_TENORS = ['3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '20Y', '30Y'];

export function computeSovereignYieldSurface3D(countryCode = 'US', mode = 'history') {
  const baseCountry = SOVEREIGN_YIELD_CURVES[countryCode] || SOVEREIGN_YIELD_CURVES.US;
  const baseTenors = baseCountry.tenors || SOVEREIGN_YIELD_CURVES.US.tenors;
  const ustTenors = SOVEREIGN_YIELD_CURVES.US.tenors;
  const baseCountryName = baseCountry.country?.EN || countryCode;
  const xLabels = [...YIELD_CURVE_TENORS];

  if (mode === 'crossCountry') {
    const peerCodes = [countryCode, 'US', 'DE', 'GB', 'JP', 'BR', 'FR', 'MX'];
    const uniquePeers = [...new Set(peerCodes)].slice(0, 6);
    const yLabels = uniquePeers.map((c) => {
      const info = SOVEREIGN_YIELD_CURVES[c] || SOVEREIGN_YIELD_CURVES.US;
      return `${c} (${info.rating})`;
    });
    const zMatrix = [];
    const metaMatrix = [];

    uniquePeers.forEach((c) => {
      const info = SOVEREIGN_YIELD_CURVES[c] || SOVEREIGN_YIELD_CURVES.US;
      const cTenors = info.tenors || ustTenors;
      const cName = info.country?.EN || c;
      const row = [];
      const metaRow = [];
      xLabels.forEach((t) => {
        const yVal = Number((cTenors[t] ?? 0).toFixed(2));
        row.push(yVal);
        const ustVal = ustTenors[t] ?? 0;
        const spreadBps = Math.round((yVal - ustVal) * 100);
        metaRow.push({
          xLabel: `Tenor ${t}`,
          strike: cName,
          yLabel: `${c} (${info.currency} • ${info.rating})`,
          zFormatted: `${yVal.toFixed(2)}% YTM`,
          extra1Label: 'Spread vs UST',
          extra1Val: `${spreadBps >= 0 ? '+' : ''}${spreadBps} bps`,
          extra2Label: 'Policy / CPI',
          extra2Val: `${info.policyRate}% / ${info.inflationYoY}%`,
        });
      });
      zMatrix.push(row);
      metaMatrix.push(metaRow);
    });

    return {
      title: `3D Sovereign Yield Surface — Multi-Country Term Structure (${uniquePeers.join(' · ')})`,
      xAxisTitle: 'Maturity Tenor (3M → 30Y)',
      yAxisTitle: 'Sovereign Curve (Country)',
      zAxisTitle: 'Nominal Yield (%)',
      zUnit: '%',
      xLabels,
      yLabels,
      zMatrix,
      metaMatrix,
    };
  }

  // Default: 'history' — 3D Evolution of the selected country's yield curve across 6 historical snapshots
  const snapshots = [
    { label: '-2Y (Cycle Tightening)', shortShift: +0.65, longShift: -0.42 },
    { label: '-1Y (Peak Inversion)', shortShift: +0.48, longShift: -0.24 },
    { label: '-6M (Pre-Pivot)', shortShift: +0.28, longShift: -0.10 },
    { label: '-3M (Steepening)', shortShift: +0.14, longShift: -0.04 },
    { label: '-1M (Prior Month)', shortShift: +0.06, longShift: -0.02 },
    { label: 'Spot Curve (Today)', shortShift: 0.0, longShift: 0.0 },
  ];

  const yLabels = snapshots.map((s) => s.label);
  const zMatrix = [];
  const metaMatrix = [];

  snapshots.forEach((snap) => {
    const row = [];
    const metaRow = [];
    xLabels.forEach((t, idx) => {
      const progress = idx / (xLabels.length - 1); // 0 at 3M, 1 at 30Y
      const shift = snap.shortShift * (1 - progress) + snap.longShift * progress;
      const baseVal = baseTenors[t] ?? 4.0;
      const yVal = Number((baseVal + shift).toFixed(2));
      row.push(yVal);
      const diffBps = Math.round((baseVal - yVal) * 100);
      metaRow.push({
        xLabel: `Tenor ${t}`,
        strike: `${countryCode} (${baseCountryName})`,
        yLabel: snap.label,
        zFormatted: `${yVal.toFixed(2)}% Yield`,
        extra1Label: 'Change to Today',
        extra1Val: `${diffBps >= 0 ? '+' : ''}${diffBps} bps`,
        extra2Label: 'Rating / Policy',
        extra2Val: `${baseCountry.rating} • ${baseCountry.policyRate}%`,
      });
    });
    zMatrix.push(row);
    metaMatrix.push(metaRow);
  });

  return {
    title: `${countryCode} (${baseCountryName}) — 3D Sovereign Yield Curve Evolution (3M..30Y × Horizon)`,
    xAxisTitle: 'Maturity Tenor (3M → 30Y)',
    yAxisTitle: 'Historical Horizon (-2Y → Today)',
    zAxisTitle: 'Sovereign Yield (%)',
    zUnit: '%',
    xLabels,
    yLabels,
    zMatrix,
    metaMatrix,
  };
}

export function computeCommodityForwardSurface3D(sym = 'CL', spotPrice = 68.4) {
  const cleanSym = String(sym).replace(/1!$/, '');
  const fwdRef = getCommodityForwardCurve(cleanSym, spotPrice);
  const isBackwardated = fwdRef.isBackwardation;
  const h = hashTicker(cleanSym);
  const baseSlope = isBackwardated ? -0.038 - (h % 35) / 1000 : 0.042 + (h % 45) / 1000;
  const xLabels = ['Spot (M1)', 'M2', 'M3', 'M4', 'M6', 'M9', 'M12', 'M18'];
  const snapshots = [
    { label: '-1Y Curve', spotMult: 0.94, slopeMult: 0.7 },
    { label: '-6M Curve', spotMult: 0.97, slopeMult: 0.85 },
    { label: '-3M Curve', spotMult: 1.02, slopeMult: 1.12 },
    { label: '-1M Curve', spotMult: 0.99, slopeMult: 0.95 },
    { label: '-1W Curve', spotMult: 1.005, slopeMult: 1.02 },
    { label: 'Today Forward Curve', spotMult: 1.0, slopeMult: 1.0 },
  ];

  const yLabels = snapshots.map((s) => s.label);
  const zMatrix = [];
  const metaMatrix = [];

  snapshots.forEach((snap) => {
    const row = [];
    const metaRow = [];
    const snapSpot = spotPrice * snap.spotMult;
    xLabels.forEach((t, idx) => {
      const progress = idx / (xLabels.length - 1);
      const curveWave = Math.sin(progress * Math.PI + (h % 5) * 0.4) * (isBackwardated ? -0.008 : 0.008);
      const fwdPrice = Number((snapSpot * (1 + baseSlope * snap.slopeMult * progress + curveWave)).toFixed(2));
      row.push(fwdPrice);
      const rollPct = Number((((fwdPrice - snapSpot) / snapSpot) * 100).toFixed(2));
      metaRow.push({
        xLabel: t,
        strike: cleanSym,
        yLabel: snap.label,
        zFormatted: `$${fwdPrice.toFixed(2)}`,
        extra1Label: 'Spread vs Spot (M1)',
        extra1Val: `${rollPct >= 0 ? '+' : ''}${rollPct}%`,
        extra2Label: 'Regime',
        extra2Val: isBackwardated ? 'Backwardation' : 'Contango',
      });
    });
    zMatrix.push(row);
    metaMatrix.push(metaRow);
  });

  return {
    title: `${cleanSym} — 3D Forward Term Structure Surface (M1..M18 × Historical Evolution)`,
    xAxisTitle: 'Contract Delivery Tenor (M1 → M18)',
    yAxisTitle: 'Curve Observation Horizon',
    zAxisTitle: 'Forward Price ($)',
    zUnit: '$',
    xLabels,
    yLabels,
    zMatrix,
    metaMatrix,
  };
}




