// The 10 Most Iconic Quantitative and Institutional Finance Visualizations
export const ICONIC_FINANCE_THEMES = [
  {
    id: 'vol-surface',
    num: '01',
    title: 'Volatility Surface & Smile',
    sub: 'Implied volatility 3D manifold vs. strike and expiration (Black-Scholes / Dupire)',
    tag: 'DERIVATIVES QUANT',
    color: '#38bdf8',
    headline: 'The Volatility Surface',
    tagline: 'Where implied volatility reveals hidden tail risk across market horizons.',
    renderMode: 'vol_surface'
  },
  {
    id: 'markowitz-frontier',
    num: '02',
    title: 'Efficient Frontier & Sharpe Tangency',
    sub: 'Hyperbolic mean-variance frontier and Capital Allocation Line (Markowitz)',
    tag: 'PORTFOLIO THEORY',
    color: '#10b981',
    headline: 'The Efficient Frontier',
    tagline: 'Optimal mathematical risk-return trade-offs under dynamic portfolio constraints.',
    renderMode: 'markowitz'
  },
  {
    id: 'yield-curve-3d',
    num: '03',
    title: 'Yield Curve Term Structure',
    sub: 'Sovereign interest rate term structure undulating over time (Inversion & Steepening)',
    tag: 'MACRO & RATES',
    color: '#f59e0b',
    headline: 'Sovereign Yield Term Structure',
    tagline: 'The macroeconomic pulse anticipating recessions and liquidity expansions.',
    renderMode: 'yield_curve'
  },
  {
    id: 'candlestick-field',
    num: '04',
    title: 'Japanese Candlestick Formations',
    sub: 'Open-High-Low-Close price action, shadows, and engulfing momentum bars',
    tag: 'PRICE DISCOVERY',
    color: '#10b981',
    headline: 'Japanese Candlestick Formations',
    tagline: 'Universal visual language of market buyers and sellers battling at equilibrium.',
    renderMode: 'candlestick'
  },
  {
    id: 'orderbook-depth',
    num: '05',
    title: 'Order Book Depth & Liquidity Ladder',
    sub: 'Cumulative bids and asks forming opposing liquidity mountains meeting at the spread',
    tag: 'MICROSTRUCTURE',
    color: '#38bdf8',
    headline: 'Limit Order Book Depth',
    tagline: 'Visualizing subterranean resting liquidity and high-frequency order book pressure.',
    renderMode: 'orderbook'
  },
  {
    id: 'monte-carlo-funnel',
    num: '06',
    title: 'Geometric Brownian Monte Carlo Funnel',
    sub: 'Thousands of stochastic drift-diffusion asset trajectories branching across time',
    tag: 'STOCHASTICS',
    color: '#8b5cf6',
    headline: 'Monte Carlo Stochastic Fan',
    tagline: 'Simulating millions of probable futures through geometric Brownian motion.',
    renderMode: 'monte_carlo'
  },
  {
    id: 'correlation-matrix',
    num: '07',
    title: 'Cross-Asset Correlation Heatmap',
    sub: 'Symmetric orthogonal matrix of global asset covariances with spectral clustering',
    tag: 'SYSTEMIC RISK',
    color: '#ec4899',
    headline: 'Cross-Asset Correlation Heatmap',
    tagline: 'Tracking systemic contagion and diversification breakdown in real time.',
    renderMode: 'correlation'
  },
  {
    id: 'mandelbrot-fat-tails',
    num: '08',
    title: 'Fat Tails & Power Law Distributions',
    sub: 'Benoit Mandelbrot fractal power laws vs. Gaussian bell curve (Black Swans)',
    tag: 'FRACTAL RISK',
    color: '#ef4444',
    headline: 'Power Laws & Fat Tail Risk',
    tagline: 'Where extreme events shatter Gaussian illusions: Mandelbrot fractal turbulence.',
    renderMode: 'fat_tails'
  },
  {
    id: 'wall-street-bull',
    num: '09',
    title: 'Charging Bull & Neoclassical Colonnade',
    sub: 'Monumental bronze beast and Doric colonnade of the classical exchange temple',
    tag: 'INSTITUTIONAL HERITAGE',
    color: '#e2e8f0',
    headline: 'The Temple of Capital',
    tagline: 'Centuries of institutional financial sovereignty forged in bronze and marble.',
    renderMode: 'classical_bull'
  },
  {
    id: 'guilloche-intaglio',
    num: '10',
    title: 'Guilloché Intaglio Security Patterns',
    sub: 'Hypnotic mathematical spirograph curves engraved on banknotes and sovereign bonds',
    tag: 'SOVEREIGN CURRENCY',
    color: '#10b981',
    headline: 'Guilloché Intaglio Geometry',
    tagline: 'Mathematical security geometry protecting sovereign value for generations.',
    renderMode: 'guilloche'
  }
];
