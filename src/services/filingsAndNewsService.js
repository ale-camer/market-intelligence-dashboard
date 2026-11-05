import { bilingual, tx, txTpl, setActiveViewLang } from '../data/i18n/viewLocaleService';
/**
 * Filings RAG & Financial News Sentiment Service (`filingsAndNewsService.js`)
 *
 * Implements:
 * 1. 5 Bull Drivers & 5 Bear Risks per asset with Importance Weighting (`HIGH` = 1.5x, `MEDIUM` = 1.0x, `LOW` = 0.7x).
 * 2. Asset-Class News Sensitivity Model:
 *    - Equities (`NVDA`, `AAPL`, `MSFT`, `AMZN`, `GOOGL`): 80% Fundamental Filings / 20% News Sentiment (low news beta).
 *    - Indices (`SPY`, `QQQ`): 75% Fundamental Filings / 25% News Sentiment.
 *    - Crypto / Commodity-like (`BTC`, `ETH`, `SOL`): 50% On-Chain Filings / 50% News Sentiment (high news beta).
 * 3. Live News Wire with Materiality Filtering:
 *    - Routine news updates `NEWS SENTIMENT`.
 *    - High-materiality news (`materiality: 'HIGH'`) ALSO inserts a new driver/risk at the top of the
 *      5 Bull or 5 Bear list (keeping the latest 5 on each side).
 * 4. Strict LLM Guardrails (`executeSec10kRagQuery`) blocking gibberish, keyboard mashing, prompt injections,
 *    and off-topic non-financial queries.
 */

import { getAssetBySymbol } from './marketService';

export const IMPORTANCE_WEIGHTS = {
  HIGH: 1.5,
  MEDIUM: 1.0,
  LOW: 0.7,
};

export function getAssetClassSensitivity(cat = 'CRYPTO') {
  if (cat === 'EQUITY') {
    return {
      fundamentalWeight: 0.8,
      newsWeight: 0.2,
      shortLabel: bilingual('80% Filings • 20% News (Low News Beta)', '80% Balance • 20% Noticias (Baja Sensibilidad)'),
    };
  }
  if (cat === 'INDEX' || cat === 'ETF') {
    return {
      fundamentalWeight: 0.75,
      newsWeight: 0.25,
      shortLabel: bilingual('75% Constituents/Macro • 25% News (Index Beta)', '75% Componentes/Macro • 25% Noticias (Beta Índice)'),
    };
  }
  if (cat === 'RATES' || cat === 'FIXED_INCOME' || cat === 'CASH') {
    return {
      fundamentalWeight: 0.85,
      newsWeight: 0.15,
      shortLabel: bilingual('85% Central Bank/Auctions • 15% News (Macro Rate)', '85% Bancos Centrales/Subastas • 15% Noticias (Tasa Macro)'),
    };
  }
  if (cat === 'FX' || cat === 'COMMODITY') {
    return {
      fundamentalWeight: 0.65,
      newsWeight: 0.35,
      shortLabel: bilingual('65% Carry/Inventory • 35% Macro Wire', '65% Carry/Inventarios • 35% Flujo Macro'),
    };
  }
  if (cat === 'DERIVATIVES_VOL') {
    return {
      fundamentalWeight: 0.6,
      newsWeight: 0.4,
      shortLabel: bilingual('60% Term Structure/OI • 40% Order Flow', '60% Estructura Temporal/OI • 40% Flujo de Órdenes'),
    };
  }
  return {
    fundamentalWeight: 0.5,
    newsWeight: 0.5,
    shortLabel: bilingual('50% Filings • 50% News (High News Sensitivity)', '50% Fundamentos • 50% Noticias (Alta Sensibilidad)'),
  };
}

export const ASSET_RESEARCH_BRIEFS = {
  BTC: {
    stance: 'BULLISH',
    stanceLabel: bilingual('Strong Institutional Accumulation', 'Fuerte Acumulación Institucional'),
    filingSource: bilingual('Institutional ETF & Custody Filings (Q3)', 'Reportes Institucionales de ETFs y Custodia (Q3)'),
    executiveSummary: bilingual('Bitcoin is experiencing sustained structural demand driven by spot ETF inflows (+$640M/day) and shrinking liquid exchange reserves, while macro rate sensitivity remains the primary short-term risk.', 'Bitcoin experimenta una demanda estructural sostenida impulsada por flujos hacia ETFs spot (+$640M/día) y menores reservas líquidas en exchanges, mientras la sensibilidad a tasas macro sigue siendo el principal riesgo.'),
    bullDrivers: [
      {
        score: 90,
        importance: 'HIGH',
        title: bilingual('Record Spot ETF Custody Inflows', 'Flujos Récord en Custodia de ETFs Spot'),
        detail: bilingual('Regulated spot ETFs hold over 1.1M BTC, absorbing more than 3x daily post-halving issuance.', 'Los ETFs spot regulados custodian más de 1.1M BTC, absorbiendo 3 veces la emisión diaria.'),
      },
      {
        score: 84,
        importance: 'HIGH',
        title: bilingual('Exchange Liquid Float Compression', 'Compresión de Oferta Líquida en Exchanges'),
        detail: bilingual('Centralized exchange reserves dropped to a 5-year low (11.8% of supply), reducing sell pressure.', 'Las reservas en exchanges cayeron a su mínimo de 5 años (11.8% del circulante).'),
      },
      {
        score: 78,
        importance: 'MEDIUM',
        title: bilingual('Post-Halving Issuance Reduction (0.83%/yr)', 'Reducción de Emisión Post-Halving (0.83% anual)'),
        detail: bilingual('Daily block reward issuance fell from 900 to 450 BTC, cutting structural miner sell flows in half.', 'La emisión diaria cayó de 900 a 450 BTC, reduciendo a la mitad la presión vendedora estructural.'),
      },
      {
        score: 74,
        importance: 'MEDIUM',
        title: bilingual('Corporate Treasury 13F Adoption', 'Adopción en Tesorerías Corporativas (13F)'),
        detail: bilingual('Institutional 13F filings show a 28% QoQ increase in pension and corporate balance sheet allocations.', 'Los reportes 13F muestran un aumento trimestral del 28% en asignaciones institucionales.'),
      },
      {
        score: 68,
        importance: 'LOW',
        title: bilingual('Sovereign Hashrate & Network Security Peak', 'Récord de Hashrate y Seguridad de Red'),
        detail: bilingual('Network difficulty and exahash compute reached all-time highs, reinforcing settlement finality.', 'La dificultad de red y potencia de cómputo marcaron máximos históricos.'),
      },
    ],
    bearRisks: [
      {
        score: 58,
        importance: 'HIGH',
        title: bilingual('Macro Real-Yield Sensitivity (US 10Y)', 'Sensibilidad a Tasas Reales Macro (US 10Y)'),
        detail: bilingual('Spikes in 10Y Treasury real yields or hawkish Fed repricing trigger institutional risk-off rotations.', 'Subas en el rendimiento real del bono a 10 años suelen gatillar reducción de exposición.'),
      },
      {
        score: 52,
        importance: 'MEDIUM',
        title: bilingual('Perpetual Derivatives Basis Crowding', 'Concentración de Apalancamiento en Perpetuos'),
        detail: bilingual('Annualized funding rates above 25% precede rapid 8–12% long liquidation flushes.', 'Tasas de fondeo mayores al 25% anual suelen anteceder correcciones rápidas del 8–12%.'),
      },
      {
        score: 46,
        importance: 'MEDIUM',
        title: bilingual('Legacy Sovereign & Bankruptcy Overhang', 'Ventas Remanentes de Gobiernos y Quiebras'),
        detail: bilingual('Episodic wallet movements from seized sovereign holdings or estate distributions create supply shocks.', 'Movimientos episódicos de billeteras gubernamentales generan volatilidad de corto plazo.'),
      },
      {
        score: 42,
        importance: 'LOW',
        title: bilingual('Miner Hashprice Margin Compression', 'Compresión de Márgenes en Mineros'),
        detail: bilingual('Lower transaction fee epochs force higher-cost mining operators to liquidate treasury inventory.', 'Menores comisiones en red obligan a mineros de alto costo a vender inventario.'),
      },
      {
        score: 38,
        importance: 'LOW',
        title: bilingual('Custodial Concentration in Top 2 Issuers', 'Concentración de Custodia Institucional'),
        detail: bilingual('Over 80% of institutional ETF assets rely on a single prime custody infrastructure provider.', 'Más del 80% de los ETFs spot concentra su custodia en un único proveedor institucional.'),
      },
    ],
    qaKnowledge: {
      margins: bilingual('Custody & Supply Economics: Post-halving block issuance stands at 450 BTC/day (~$30.8M), while spot ETF vehicles absorb an average of $640M/day, creating a 20x structural demand-to-issuance multiple.', 'Economía de Emisión y Custodia: La emisión post-halving es de 450 BTC/día (~$30.8M), mientras los ETFs spot absorben en promedio $640M/día, generando un múltiplo de demanda/emisión de 20x.'),
      risks: bilingual('Primary Risk Disclosure: A +50 bps jump in 10Y US real yields (-58 impact) or annualized perpetual funding rates exceeding 25% (-52 impact) historically precedes 8–12% leveraged position flushes.', 'Riesgo Principal: Un salto de +50 bps en tasas reales de EE.UU. (-58 de impacto) o tasas de fondeo mayores al 25% anual (-52 de impacto) suele anteceder limpiezas de apalancamiento del 8–12%.'),
      valuation: bilingual('Liquidity & Reserve Profile: Liquid exchange reserves sit at 2.32M BTC (11.8% of circulating supply), while institutional 13F filers increased spot ETF allocations by 28% QoQ.', 'Perfil de Liquidez y Reservas: Las reservas líquidas en exchanges están en 2.32M BTC (11.8% del circulante), mientras los inversores institucionales 13F aumentaron su posición un 28% trimestral.'),
      competition: bilingual('Market Dominance: Bitcoin retains 56.4% of total digital asset market capitalization and commands over 82% of regulated institutional crypto ETF inflows.', 'Dominancia de Mercado: Bitcoin retiene el 56.4% de la capitalización cripto total y concentra más del 82% de los flujos institucionales en ETFs regulados.'),
    },
  },
  ETH: {
    stance: 'BULLISH',
    stanceLabel: bilingual('Constructive Ecosystem Expansion', 'Expansión Constructiva del Ecosistema'),
    filingSource: bilingual('Ethereum Trust & Protocol Report (FY2025)', 'Reporte de Protocolo y Fideicomisos ETH (FY2025)'),
    executiveSummary: bilingual('Ethereum’s Layer-2 scaling roadmap is driving record transaction volume (+185%) and steady staking lockups (28.4% of supply), though fee compression on mainnet moderates short-term burn rates.', 'La hoja de ruta Layer-2 de Ethereum impulsa un volumen récord de transacciones (+185%) y un bloqueo estable en staking (28.4% de la oferta), aunque las menores comisiones moderan la quema de corto plazo.'),
    bullDrivers: [
      {
        score: 84,
        importance: 'HIGH',
        title: bilingual('Layer-2 Settlement Surge (+185%)', 'Salto del +185% en Liquidación Layer-2'),
        detail: bilingual('Blob fee optimization (EIP-4844) expanded institutional and DeFi activity across Base and Arbitrum.', 'La optimización EIP-4844 multiplicó la actividad institucional y DeFi en Base y Arbitrum.'),
      },
      {
        score: 79,
        importance: 'HIGH',
        title: bilingual('28.4% Supply Locked in Staking', '28.4% del Circulante Bloqueado en Staking'),
        detail: bilingual('Validator staking yields (3.4% APR) anchor long-term holders and compress liquid float.', 'El rendimiento de validación (3.4% anual) ancla a tenedores y reduce la oferta circulante.'),
      },
      {
        score: 75,
        importance: 'MEDIUM',
        title: bilingual('78% Share in Institutional RWA Tokenization', '78% de Cuota en Tokenización Institucional (RWA)'),
        detail: bilingual('BlackRock BUIDL and tokenized Treasury funds overwhelmingly settle on Ethereum mainnet.', 'Los fondos de bonos tokenizados de BlackRock y Franklin Templeton liquidan sobre Ethereum.'),
      },
      {
        score: 70,
        importance: 'MEDIUM',
        title: bilingual('$88B Stablecoin Settlement Collateral', '$88B en Liquidez de Stablecoins'),
        detail: bilingual('Dominant USDT and USDC liquidity pools anchor institutional DeFi lending protocols.', 'Los mayores pools de liquidez en dólares digitales continúan asentados en Ethereum.'),
      },
      {
        score: 64,
        importance: 'LOW',
        title: bilingual('Pectra Validator Efficiency Upgrade', 'Actualización Pectra para Validadores'),
        detail: bilingual('MaxEB validator consolidation (up to 2048 ETH) reduces institutional staking overhead.', 'La consolidación de validadores reduce costos operativos para custodia institucional.'),
      },
    ],
    bearRisks: [
      {
        score: 60,
        importance: 'HIGH',
        title: bilingual('L1 Base Fee & Burn Compression', 'Menor Quema de Comisiones en Capa Base'),
        detail: bilingual('Execution migration to L2 blobs lowers mainnet gas burn during moderate activity periods.', 'La migración de transacciones hacia Layer-2 reduce la quema de ETH en la capa principal.'),
      },
      {
        score: 56,
        importance: 'HIGH',
        title: bilingual('Competing Monolithic L1 DEX Velocity', 'Competencia de Redes L1 en Volumen DEX'),
        detail: bilingual('High-frequency retail spot swaps face active share competition from Solana.', 'El volumen minorista de alta frecuencia enfrenta fuerte competencia de Solana.'),
      },
      {
        score: 49,
        importance: 'MEDIUM',
        title: bilingual('Liquid Staking Concentration (>28%)', 'Concentración en Proveedores de Staking Líquido'),
        detail: bilingual('High validator share in a single liquid staking protocol remains a governance risk.', 'La concentración de validadores en un solo protocolo sigue siendo monitoreada.'),
      },
      {
        score: 45,
        importance: 'LOW',
        title: bilingual('Cross-Rollup Liquidity Fragmentation', 'Fragmentación de Liquidez entre Layer-2'),
        detail: bilingual('Bridging friction across multiple L2 rollups complicates user experience prior to shared sequencing.', 'La dispersión de liquidez entre distintas redes L2 genera fricción operativa.'),
      },
      {
        score: 41,
        importance: 'LOW',
        title: bilingual('Exclusion of Staking Yield in Spot ETFs', 'ETFs Spot Aún Sin Rendimiento de Staking'),
        detail: bilingual('US spot ETH ETFs currently omit staking rewards, creating a 3.4% opportunity cost vs native holding.', 'Los ETFs en EE.UU. aún no distribuyen el 3.4% de staking a sus tenedores.'),
      },
    ],
    qaKnowledge: {
      margins: bilingual('Protocol Yield & Burn Rate: Staking yield averages 3.4% APR across 34.2M staked ETH, while EIP-1559 fee burn offsets 68% of new validator issuance.', 'Rendimiento y Quema del Protocolo: El rendimiento de staking promedia 3.4% anual sobre 34.2M ETH bloqueados, mientras la quema EIP-1559 compensa el 68% de la emisión.'),
      risks: bilingual('Key Protocol Risks: Base-layer gas fee compression post-Dencun (-60) and competition from monolithic L1 chains (-56) represent the primary structural risks.', 'Riesgos del Protocolo: La menor recaudación de gas en capa 1 tras Dencun (-60) y la competencia en volumen DEX (-56) son los riesgos principales.'),
      valuation: bilingual('TVL & Settlement Collateral: Ethereum secures $54.8B in Total Value Locked (61% of all DeFi liquidity) plus $88B in stablecoin settlement float.', 'TVL y Colateral de Liquidación: Ethereum asegura $54.8B en Valor Total Bloqueado (61% de todo DeFi) más $88B en circulación de stablecoins.'),
      competition: bilingual('Competitive Landscape: While Solana captures high-frequency retail spot swaps, Ethereum + Layer-2 rollups retain 78% of institutional RWA tokenization.', 'Panorama Competitivo: Mientras Solana capta swaps minoristas de alta frecuencia, Ethereum y sus Layer-2 retienen el 78% de la tokenización institucional.'),
    },
  },
  SOL: {
    stance: 'BEARISH',
    stanceLabel: bilingual('Caution • High Leverage & Volatility', 'Precaución • Alto Apalancamiento y Volatilidad'),
    filingSource: bilingual('Network & Derivatives Risk Assessment', 'Reporte de Riesgo de Red y Derivados'),
    executiveSummary: bilingual('While Solana leads in retail DEX velocity, derivatives funding rates and leveraged open interest have reached overextended levels, triggering liquidation waves and wider spreads.', 'Aunque Solana lidera en velocidad de volumen DEX, las tasas de fondeo y el interés abierto apalancado alcanzaron niveles sobreextendidos, disparando liquidaciones y spreads más amplios.'),
    bullDrivers: [
      {
        score: 66,
        importance: 'HIGH',
        title: bilingual('Leading On-Chain DEX Velocity', 'Liderazgo en Velocidad de Volumen DEX'),
        detail: bilingual('Sub-second finality and low transaction costs capture high-frequency retail spot swaps.', 'La finalidad sub-segundo y los bajos costos capturan el volumen spot minorista.'),
      },
      {
        score: 60,
        importance: 'MEDIUM',
        title: bilingual('Firedancer Client Upgrade Pipeline', 'Actualización de Cliente Firedancer'),
        detail: bilingual('Independent validator client written in C aims to diversify and scale network throughput.', 'El nuevo cliente validador apunta a diversificar y escalar el procesamiento.'),
      },
      {
        score: 54,
        importance: 'MEDIUM',
        title: bilingual('Priority Fee & MEV Validator Revenue', 'Ingresos por Comisiones Prioritarias y MEV'),
        detail: bilingual('Real economic value generated from priority tips reached $18.4M weekly.', 'El valor económico real por propinas prioritarias alcanzó $18.4M semanales.'),
      },
      {
        score: 48,
        importance: 'LOW',
        title: bilingual('Consumer Mobile & DePIN Ecosystem', 'Ecosistema Móvil y Redes Físicas (DePIN)'),
        detail: bilingual(' Decentralised infrastructure projects (Helium, Render) anchor non-financial transaction counts.', 'Proyectos de infraestructura descentralizada sostienen el número de transacciones.'),
      },
      {
        score: 44,
        importance: 'LOW',
        title: bilingual('USDC Native Settlement Integration', 'Integración Nativa de Pagos con USDC'),
        detail: bilingual('High-speed stablecoin rails support cross-border payment pilot programs.', 'Rieles rápidos de stablecoins respaldan pilotos de pagos transfronterizos.'),
      },
    ],
    bearRisks: [
      {
        score: 90,
        importance: 'HIGH',
        title: bilingual('Overheated Perpetual Funding & Liquidations', 'Sobrecalentamiento en Perpetuos y Liquidaciones'),
        detail: bilingual('Extreme speculative positioning (+2.84σ volume spike) triggered cascading long liquidations.', 'El posicionamiento especulativo extremo disparó una ola de liquidaciones de largos.'),
      },
      {
        score: 84,
        importance: 'HIGH',
        title: bilingual('Order-Book Spread Dislocation (+14.8 bps)', 'Ampliación de Spreads en Libro de Órdenes (+14.8 bps)'),
        detail: bilingual('Market-maker depth thinned during volatility bursts, increasing slippage on institutional blocks.', 'La liquidez del libro de órdenes se redujo, aumentando el deslizamiento de precios.'),
      },
      {
        score: 76,
        importance: 'MEDIUM',
        title: bilingual('Validator Compute Congestion Under Stress', 'Congestión de Validadores en Picos de Tráfico'),
        detail: bilingual('Episodic packet drop rates during extreme meme/DEX spikes remain an operational risk.', 'La caída episódica de paquetes en picos extremos sigue siendo un riesgo operativo.'),
      },
      {
        score: 70,
        importance: 'MEDIUM',
        title: bilingual('4.9% Annualized Token Issuance Dilution', 'Dilución por Inflación Anual del Token (4.9%)'),
        detail: bilingual('Gross validator issuance exceeds fee burn, requiring continuous net capital inflows.', 'La emisión bruta supera la quema de comisiones, requiriendo entrada neta constante.'),
      },
      {
        score: 64,
        importance: 'LOW',
        title: bilingual('High Dependency on Speculative Meme Volume', 'Alta Dependencia de Volumen Especulativo'),
        detail: bilingual('Over 60% of recent DEX fee generation stems from highly cyclical retail token launches.', 'Más del 60% de las comisiones DEX recientes proviene de tokens altamente cíclicos.'),
      },
    ],
    qaKnowledge: {
      margins: bilingual('Throughput & Economic Fees: Weekly DEX volume exceeded $14B with Real Economic Value (priority fees + MEV tips) reaching $18.4M/week.', 'Volumen e Ingresos de Red: El volumen DEX semanal superó los $14B con ingresos económicos reales (comisiones prioritarias + MEV) de $18.4M por semana.'),
      risks: bilingual('Derivatives Dislocation Alert: Perpetual open interest surged +2.84σ above its 20-day mean (-90 impact) alongside wider order-book spreads (+14.8 bps, -84 impact), signaling high liquidation risk.', 'Alerta de Derivados: El interés abierto en perpetuos saltó +2.84σ sobre su media (-90) con spreads más amplios (+14.8 bps, -84), señalando alto riesgo de liquidación.'),
      valuation: bilingual('Supply & Inflation Schedule: Annualized token inflation sits at 4.9% (declining 15% yearly), with 65.2% of circulating SOL staked across validators.', 'Oferta e Inflación: La inflación anualizada del token es de 4.9% (bajando 15% por año), con el 65.2% del circulante bloqueado en validadores.'),
      competition: bilingual('Monolithic L1 Position: Solana commands #1 share in daily active addresses and retail DEX trades, competing directly against Ethereum Layer-2 rollups.', 'Posición Competitiva L1: Solana lidera en direcciones activas diarias y operaciones DEX minoristas, compitiendo contra los rollups Layer-2 de Ethereum.'),
    },
  },
  NVDA: {
    stance: 'BULLISH',
    stanceLabel: bilingual('High Conviction • AI Infrastructure Leader', 'Alta Convicción • Líder en Infraestructura de IA'),
    filingSource: bilingual('SEC Form 10-K (FY2025) • Item 7 & Item 1A', 'Reporte Oficial SEC Form 10-K (FY2025) • Item 7 y 1A'),
    executiveSummary: bilingual('SEC Form 10-K confirms Data Center revenue surged 112% YoY to $30.8B with 75.1% gross margins on Blackwell/Hopper demand, while TSMC CoWoS packaging capacity and export controls remain the primary bottlenecks.', 'El reporte SEC Form 10-K confirma que los ingresos de Centros de Datos saltaron 112% anual a $30.8B con márgenes brutos del 75.1% por la demanda de Blackwell, siendo la capacidad CoWoS y los controles de exportación los riesgos principales.'),
    bullDrivers: [
      {
        score: 95,
        importance: 'HIGH',
        title: bilingual('Data Center Revenue +112% YoY ($30.8B)', 'Ingresos de Data Center +112% Anual ($30.8B)'),
        detail: bilingual('Per Item 7 (MD&A), hyperscaler demand for Hopper H200 and Blackwell B200 sustains 75.1% gross margins.', 'Según Item 7 (MD&A), la demanda de racks H200 y Blackwell B200 sostiene márgenes brutos del 75.1%.'),
      },
      {
        score: 90,
        importance: 'HIGH',
        title: bilingual('CUDA & NVLink Full-Stack Software Moat', 'Foso Competitivo en Software CUDA y NVLink'),
        detail: bilingual('Over 4.7M developers and proprietary NVLink interconnects lock in enterprise AI clusters.', 'Más de 4.7M de desarrolladores e interconexiones NVLink aseguran contratos plurianuales.'),
      },
      {
        score: 84,
        importance: 'MEDIUM',
        title: bilingual('Spectrum-X AI Networking Expansion', 'Expansión en Redes de IA Spectrum-X'),
        detail: bilingual('Networking revenue topped $3.6B quarterly as Ethernet-for-AI adoption accelerates.', 'Los ingresos de redes superaron los $3.6B trimestrales por adopción en clusters de IA.'),
      },
      {
        score: 79,
        importance: 'MEDIUM',
        title: bilingual('Sovereign AI National Compute Backlog', 'Contratos de IA Soberana con Gobiernos'),
        detail: bilingual('National compute build-outs in Europe, Japan, and Middle East add $10B+ in incremental pipeline.', 'Proyectos nacionales de cómputo en Europa y Asia suman más de $10B en demanda incremental.'),
      },
      {
        score: 74,
        importance: 'LOW',
        title: bilingual('$27.0B Free Cash Flow & Share Repurchases', '$27.0B de Flujo de Caja Libre y Recompras'),
        detail: bilingual('Fortress balance sheet ($34.8B cash vs $8.4B debt) funds $50B share buyback authorization.', 'Sólida posición de caja ($34.8B frente a $8.4B de deuda) respalda el programa de recompras.'),
      },
    ],
    bearRisks: [
      {
        score: 54,
        importance: 'HIGH',
        title: bilingual('TSMC CoWoS-L Packaging Constraints', 'Cuellos de Botella en Empaquetado CoWoS-L'),
        detail: bilingual('Per Item 1A, quarterly rack shipments remain gated by third-party advanced wafer packaging.', 'Según Item 1A, las entregas trimestrales dependen de la capacidad de empaquetado de TSMC.'),
      },
      {
        score: 49,
        importance: 'HIGH',
        title: bilingual('US Semiconductor Export Licensing Rules', 'Restricciones de Exportación de Semiconductores'),
        detail: bilingual('Commerce Dept compute density caps restrict high-margin accelerator sales into restricted regions.', 'Los límites de densidad de cómputo restringen ventas de aceleradores en mercados regulados.'),
      },
      {
        score: 45,
        importance: 'MEDIUM',
        title: bilingual('Top-4 Hyperscaler Customer Concentration (46%)', 'Concentración de Clientes Cloud (46% en Top-4)'),
        detail: bilingual('Nearly half of Data Center revenue depends on CAPEX cycles of four cloud providers.', 'Casi la mitad de los ingresos depende del ciclo de inversión de cuatro hiperescaladores.'),
      },
      {
        score: 41,
        importance: 'LOW',
        title: bilingual('In-House Cloud ASIC Silicon (TPU / Trainium)', 'Chips Propios de Clientes Cloud (TPU / Trainium)'),
        detail: bilingual('Hyperscalers are deploying custom internal silicon for specific inference workloads.', 'Los grandes clientes desarrollan chips propios para cargas específicas de inferencia.'),
      },
      {
        score: 36,
        importance: 'LOW',
        title: bilingual('Blackwell Initial Ramp Margin Dilution', 'Costo Inicial de Transición a Racks Blackwell'),
        detail: bilingual('Complex liquid-cooled NVL72 rack yields temporarily moderate gross margin by 150–200 bps.', 'La complejidad inicial de los racks refrigerados por líquido modera el margen en 150 bps.'),
      },
    ],
    qaKnowledge: {
      margins: bilingual('Item 7 (MD&A — Profitability): GAAP gross margin reached 75.1% (+320 bps YoY) with operating income hitting $18.6B, driven by high-margin Blackwell B200 rack systems and Spectrum-X networking.', 'Item 7 (MD&A — Rentabilidad): El margen bruto GAAP alcanzó 75.1% (+320 bps anual) con utilidad operativa de $18.6B, impulsado por racks Blackwell B200 y redes Spectrum-X.'),
      risks: bilingual('Item 1A (Risk Factors): Top risks are TSMC CoWoS-L packaging allocation bottlenecks (-54), US Commerce Department export licensing rules (-49), and customer concentration (top 4 cloud buyers = 46% of revenue, -45).', 'Item 1A (Factores de Riesgo): Los riesgos clave son los cuellos de botella en empaquetado CoWoS de TSMC (-54), restricciones de exportación de EE.UU. (-49) y concentración de clientes (-45).'),
      valuation: bilingual('Balance Sheet & Cash Flow (Item 8): NVIDIA holds $34.8B in cash and marketable securities against $8.4B in long-term debt, generating $27.0B in trailing free cash flow.', 'Balance y Flujo de Caja (Item 8): NVIDIA posee $34.8B en caja e inversiones líquidas frente a $8.4B de deuda, generando $27.0B de flujo de caja libre.'),
      competition: bilingual('Competitive Moat: NVIDIA holds >85% share in AI training accelerators; while AMD MI325X and custom ASICs (Google TPU, AWS Trainium) compete on inference, CUDA + NVLink remain the industry standard.', 'Posición Competitiva: NVIDIA posee >85% del mercado de aceleradores de IA; aunque AMD y chips propios compiten en inferencia, CUDA y NVLink mantienen el estándar de la industria.'),
    },
  },
  AAPL: {
    stance: 'BULLISH',
    stanceLabel: bilingual('Constructive • Services Margin Expansion', 'Constructivo • Expansión de Márgenes en Servicios'),
    filingSource: bilingual('SEC Form 10-K (FY2025) • Item 7 & Item 1A', 'Reporte Oficial SEC Form 10-K (FY2025) • Item 7 y 1A'),
    executiveSummary: bilingual('Apple’s Services gross margin expanded 140 bps to 74.1% per Form 10-K, driving record recurring cash flow that offsets slower hardware replacement cycles and Asian supply chain concentration risks.', 'El margen bruto de Servicios de Apple se expandió 140 bps hasta 74.1% según su Form 10-K, generando flujo de caja recurrente récord que compensa ciclos largos de reemplazo en hardware y riesgos de cadena de suministro.'),
    bullDrivers: [
      {
        score: 86,
        importance: 'HIGH',
        title: bilingual('74.1% Services Gross Margin (+140 bps)', 'Margen Bruto de 74.1% en Servicios (+140 bps)'),
        detail: bilingual('Per Item 7, Services reached a $96.1B annual run-rate, lifting consolidated corporate margins.', 'Según Item 7, Servicios alcanzó una tasa anual de $96.1B, elevando la rentabilidad consolidada.'),
      },
      {
        score: 80,
        importance: 'HIGH',
        title: bilingual('2.2B Active Installed Device Base', 'Base Activa Récord de 2.200M de Dispositivos'),
        detail: bilingual('Over 1.0B paid subscriptions across iOS devices drive 92% ecosystem retention.', 'Más de 1.000M de suscripciones pagas sostienen una retención del 92% en el ecosistema.'),
      },
      {
        score: 76,
        importance: 'MEDIUM',
        title: bilingual('$118B Operating Cash Flow & $95B Buybacks', '$118B de Flujo de Caja Operativo y Recompras'),
        detail: bilingual('Consistent share count reduction (+3.2% annual EPS accretion) anchors downside support.', 'La reducción constante de acciones en circulación impulsa el beneficio por acción.'),
      },
      {
        score: 72,
        importance: 'MEDIUM',
        title: bilingual('On-Device Apple Intelligence Upgrade Cycle', 'Ciclo de Renovación por IA Integrada'),
        detail: bilingual('Hardware memory requirements for local AI inference incentivize iPhone 16/17 Pro upgrades.', 'Los requerimientos de hardware para IA local incentivan el recambio hacia modelos Pro.'),
      },
      {
        score: 68,
        importance: 'LOW',
        title: bilingual('In-House Apple Silicon M-Series Margin Lift', 'Ahorro de Costos por Chips Propios Serie M'),
        detail: bilingual('Custom 3nm processors across Mac and iPad reduce third-party component costs.', 'Los procesadores propios de 3nm mejoran los márgenes brutos del segmento hardware.'),
      },
    ],
    bearRisks: [
      {
        score: 56,
        importance: 'HIGH',
        title: bilingual('Asian Assembly & Tariff Exposure', 'Concentración de Manufactura y Aranceles'),
        detail: bilingual('Per Item 1A, final hardware assembly concentration exposes margins to trade tariff shifts.', 'Según Item 1A, la concentración de ensamblaje expone los márgenes a cambios arancelarios.'),
      },
      {
        score: 52,
        importance: 'HIGH',
        title: bilingual('EU DMA & DOJ App Store Antitrust Scrutiny', 'Regulación Antimonopolio sobre App Store'),
        detail: bilingual('Regulatory mandates on alternative app billing could pressure Services take-rates.', 'Las exigencias regulatorias en Europa y EE.UU. podrían presionar las comisiones digitales.'),
      },
      {
        score: 48,
        importance: 'MEDIUM',
        title: bilingual('Greater China Smartphone Competition (17% Rev)', 'Competencia en el Mercado Chino (17% Ventas)'),
        detail: bilingual('Domestic flagship competitors (Huawei) pressure premium market share in China.', 'Fabricantes locales presionan la cuota de mercado de gama alta en China.'),
      },
      {
        score: 43,
        importance: 'LOW',
        title: bilingual('Elongated 42-Month Hardware Replacement Cycle', 'Ciclo de Recambio de Equipos Más Largo (42m)'),
        detail: bilingual('Higher smartphone durability lengthens consumer upgrade intervals in mature markets.', 'La mayor durabilidad de los equipos extiende los tiempos de renovación.'),
      },
      {
        score: 39,
        importance: 'LOW',
        title: bilingual('DOJ Search TAC Revenue-Share Risk', 'Riesgo sobre Acuerdo de Buscador Predeterminado'),
        detail: bilingual('Antitrust remedies against Google could alter the ~$20B annual Safari licensing payment.', 'El fallo antimonopolio sobre Google podría afectar el canon anual de Safari.'),
      },
    ],
    qaKnowledge: {
      margins: bilingual('Item 7 (Segment Margins): Consolidated gross margin reached 46.2%, split between Products (37.2%) and high-margin Services (74.1%, $96.1B annual run-rate).', 'Item 7 (Márgenes por Segmento): El margen bruto consolidado alcanzó 46.2%, dividido entre Productos (37.2%) y Servicios de alto margen (74.1%, $96.1B anuales).'),
      risks: bilingual('Item 1A (Risk Factors): Key risks include Asian assembly & tariff exposure (-56), EU DMA App Store fee scrutiny (-52), and Greater China competition (17% of sales, -48).', 'Item 1A (Riesgos): Incluye exposición arancelaria en ensamblaje asiático (-56), regulaciones sobre comisiones del App Store (-52) y competencia en China (-48).'),
      valuation: bilingual('Capital Return & Liquidity (Item 8): Operating cash flow reached $118B, funding $95B in annual share repurchases with $65.2B in cash & marketable securities.', 'Retorno de Capital y Liquidez (Item 8): El flujo de caja operativo alcanzó $118B, financiando $95B en recompras de acciones con $65.2B en liquidez.'),
      competition: bilingual('Ecosystem Retention: Over 1.0B paid subscriptions across iOS devices drive 92% brand retention in North America and Europe.', 'Retención de Ecosistema: Más de 1.000 millones de suscripciones pagas generan una retención de marca del 92% en EE.UU. y Europa.'),
    },
  },
  MSFT: {
    stance: 'BULLISH',
    stanceLabel: bilingual('Constructive • Enterprise Cloud AI', 'Constructivo • Liderazgo en Cloud e IA Corporativa'),
    filingSource: bilingual('SEC Form 10-K (FY2025) • Item 7 & Item 1A', 'Reporte Oficial SEC Form 10-K (FY2025) • Item 7 y 1A'),
    executiveSummary: bilingual('Azure Intelligent Cloud operating income grew 21% with AI workloads contributing 12 points of growth per Form 10-K, though $55.7B in annual data center CAPEX will weigh on near-term depreciation.', 'El ingreso operativo de Azure creció 21% con cargas de IA aportando 12 puntos de crecimiento según su Form 10-K, aunque los $55.7B de inversión anual en centros de datos aumentan la depreciación de corto plazo.'),
    bullDrivers: [
      {
        score: 89,
        importance: 'HIGH',
        title: bilingual('Azure AI Workloads (+12 pts Growth Lift)', 'Cargas de IA Aportan 12 Puntos a Azure'),
        detail: bilingual('Per Item 7, Azure OpenAI API and GPU cluster demand lifted Intelligent Cloud income +21%.', 'Según Item 7, la demanda de Azure OpenAI elevó un 21% el ingreso operativo cloud.'),
      },
      {
        score: 84,
        importance: 'HIGH',
        title: bilingual('$269B Commercial RPO Backlog (+20% YoY)', 'Backlog Comercial de $269B (+20% Anual)'),
        detail: bilingual('Multi-year enterprise cloud commitments provide exceptional forward revenue visibility.', 'Los contratos plurianuales comprometidos otorgan alta visibilidad de ingresos futuros.'),
      },
      {
        score: 79,
        importance: 'MEDIUM',
        title: bilingual('M365 Copilot Enterprise ARPU Expansion', 'Mayor Ingreso por Usuario con M365 Copilot'),
        detail: bilingual('Commercial Office 365 revenue rose 14% on E5 tier upgrades and $30/seat Copilot add-ons.', 'Los ingresos comerciales de Office 365 crecieron 14% gracias a licencias E5 y Copilot.'),
      },
      {
        score: 74,
        importance: 'MEDIUM',
        title: bilingual('44.6% Consolidated Operating Margin', 'Margen Operativo Consolidado de 44.6%'),
        detail: bilingual('Disciplined opex headcount management preserves industry-leading software profitability.', 'El control de gastos operativos preserva márgenes líderes en la industria de software.'),
      },
      {
        score: 68,
        importance: 'LOW',
        title: bilingual('GitHub & Security Suite Cross-Selling', 'Venta Cruzada en GitHub y Ciberseguridad'),
        detail: bilingual('GitHub Copilot surpassed 1.8M paid enterprise developers alongside Defender growth.', 'GitHub Copilot superó 1.8M de desarrolladores pagos junto al crecimiento en seguridad.'),
      },
    ],
    bearRisks: [
      {
        score: 55,
        importance: 'HIGH',
        title: bilingual('$55.7B Data Center CAPEX Depreciation', 'Depreciación por CAPEX Récord de $55.7B'),
        detail: bilingual('Per Item 7, heavy GPU server investments increase COGS depreciation over the next 4 years.', 'El fuerte gasto de capital en servidores de IA incrementará los cargos por depreciación.'),
      },
      {
        score: 48,
        importance: 'MEDIUM',
        title: bilingual('Regional Power Grid & Data Center Delays', 'Restricciones Eléctricas para Centros de Datos'),
        detail: bilingual('Utility power availability constraints can delay new regional cloud capacity activation.', 'La disponibilidad eléctrica puede demorar la activación de nueva capacidad cloud.'),
      },
      {
        score: 44,
        importance: 'MEDIUM',
        title: bilingual('Enterprise AI Seat Adoption Pace', 'Ritmo de Conversión de Pilotos de IA a Licencias'),
        detail: bilingual('CIO budget scrutiny could lengthen conversion cycles from Copilot pilots to full deployments.', 'La revisión presupuestaria corporativa puede alargar el paso de pilotos a despliegues.'),
      },
      {
        score: 40,
        importance: 'LOW',
        title: bilingual('FTC & EU Cloud Licensing Antitrust Review', 'Revisión Antimonopolio de Licencias Cloud'),
        detail: bilingual('Regulatory review of bundled enterprise cloud licensing practices in Europe and US.', 'Reguladores en EE.UU. y Europa revisan el empaquetado de licencias corporativas.'),
      },
      {
        score: 36,
        importance: 'LOW',
        title: bilingual('OpenAI Partnership Concentration & Governance', 'Dependencia Tecnológica de OpenAI'),
        detail: bilingual('Reliance on external frontier model weights requires ongoing custom silicon diversification.', 'La exposición a un socio clave impulsa a Microsoft a diversificar modelos propios.'),
      },
    ],
    qaKnowledge: {
      margins: bilingual('Item 7 (Cloud Profitability): Consolidated operating margin stood at 44.6%, with Intelligent Cloud generating $49.5B in operating income (+21% YoY).', 'Item 7 (Rentabilidad Cloud): El margen operativo consolidado fue de 44.6%, con Intelligent Cloud generando $49.5B de ganancia operativa (+21% anual).'),
      risks: bilingual('Item 1A (Risk Factors): $55.7B in annual AI data center CAPEX increases depreciation headwinds (-55), alongside power-grid delivery delays (-48).', 'Item 1A (Riesgos): Los $55.7B de CAPEX anual en centros de datos elevan la depreciación (-55), junto con demoras de conexión eléctrica (-48).'),
      valuation: bilingual('Commercial Backlog (Item 7): Commercial Remaining Performance Obligations (RPO) jumped 20% to $269B, providing multi-year revenue visibility.', 'Backlog Comercial (Item 7): Las obligaciones de desempeño comercial pendientes (RPO) subieron 20% hasta $269B, dando alta visibilidad plurianual.'),
      competition: bilingual('Cloud Market Share: Azure holds 25% global cloud infrastructure share (second to AWS at 31%) but leads in enterprise generative AI seat deployment.', 'Cuota de Mercado Cloud: Azure posee 25% del mercado global de infraestructura cloud y lidera en despliegues corporativos de IA generativa.'),
    },
  },
  AMZN: {
    stance: 'BULLISH',
    stanceLabel: bilingual('Bullish • AWS Margin & Logistics Efficiency', 'Alcista • Margen Récord en AWS y Eficiencia Logística'),
    filingSource: bilingual('SEC Form 10-K (FY2025) • Item 7 & Item 1A', 'Reporte Oficial SEC Form 10-K (FY2025) • Item 7 y 1A'),
    executiveSummary: bilingual('Form 10-K highlights AWS operating margins reaching 35.5% alongside North American retail cost reductions from regionalized fulfillment and custom Trainium/Graviton silicon.', 'El Form 10-K destaca que el margen operativo de AWS alcanzó el 35.5% junto con fuertes reducciones de costos logísticos en Norteamérica y adopción de chips propios Trainium y Graviton.'),
    bullDrivers: [
      {
        score: 88,
        importance: 'HIGH',
        title: bilingual('AWS Operating Margin Hits Record 35.5%', 'Margen Operativo de AWS Alcanza Récord de 35.5%'),
        detail: bilingual('Per Item 7, custom Graviton and Trainium2 silicon lowers cloud inference cost with $164B backlog.', 'Según Item 7, el silicio propio Graviton y Trainium2 eleva márgenes con $164B de backlog.'),
      },
      {
        score: 83,
        importance: 'HIGH',
        title: bilingual('Regionalized Fulfillment Cost Leverage', 'Reducción de Costos por Logística Regionalizada'),
        detail: bilingual('Shorter delivery distances and warehouse robotics lifted operating cash flow +38% YoY to $112.7B.', 'Menores distancias de envío y robótica elevaron el flujo de caja operativo un 38% a $112.7B.'),
      },
      {
        score: 79,
        importance: 'MEDIUM',
        title: bilingual('$52B+ High-Margin Advertising Business', 'Negocio de Publicidad Supera los $52B Anuales'),
        detail: bilingual('Sponsored retail listings and Prime Video ad tiers deliver >50% incremental operating margins.', 'La publicidad en e-commerce y Prime Video aporta márgenes operativos superiores al 50%.'),
      },
      {
        score: 74,
        importance: 'MEDIUM',
        title: bilingual('31% Global Cloud Infrastructure Leadership', 'Liderazgo Global del 31% en Infraestructura Cloud'),
        detail: bilingual('Enterprise migration from on-premise to AWS Bedrock accelerates multi-year commitments.', 'La migración corporativa hacia AWS Bedrock acelera contratos plurianuales.'),
      },
      {
        score: 69,
        importance: 'LOW',
        title: bilingual('Prime Same-Day Delivery Retention Moat', 'Fidelización Prime por Entregas en el Día'),
        detail: bilingual('Over 9B units delivered same-day or next-day globally, increasing purchase frequency.', 'Más de 9.000M de unidades entregadas en el día refuerzan la recurrencia de compra.'),
      },
    ],
    bearRisks: [
      {
        score: 52,
        importance: 'HIGH',
        title: bilingual('$75B Planned AI & Logistics CAPEX Cycle', 'Ciclo de Inversión CAPEX de $75B en IA y Logística'),
        detail: bilingual('Massive data center and fulfillment capital deployment moderates near-term free cash flow.', 'El fuerte despliegue de capital en centros de datos modera el flujo de caja libre inmediato.'),
      },
      {
        score: 48,
        importance: 'MEDIUM',
        title: bilingual('Discretionary Consumer Spending Sensitivity', 'Sensibilidad del Consumo Discrecional'),
        detail: bilingual('Inflationary pressure on households shifts retail basket mix toward lower-margin essentials.', 'La presión en presupuestos familiares inclina compras hacia básicos de menor margen.'),
      },
      {
        score: 45,
        importance: 'MEDIUM',
        title: bilingual('FTC Marketplace Antitrust Litigation', 'Litigio Antimonopolio de la FTC'),
        detail: bilingual('Ongoing regulatory scrutiny over third-party seller fulfillment fees and Buy Box rules.', 'Escrutinio regulatorio sobre comisiones logísticas a vendedores terceros.'),
      },
      {
        score: 40,
        importance: 'LOW',
        title: bilingual('Cross-Border Discount E-Commerce Rivals', 'Competencia de Plataformas de Descuento'),
        detail: bilingual('Direct-from-factory ultra-low-cost platforms compete in low-ticket apparel and home goods.', 'Plataformas de bajo costo directo de fábrica compiten en tickets bajos.'),
      },
      {
        score: 36,
        importance: 'LOW',
        title: bilingual('Warehouse Labor & Freight Cost Inflation', 'Inflación Salarial y de Fletes Logísticos'),
        detail: bilingual('Wage adjustments across fulfillment hubs require continuous robotics productivity offsets.', 'Los ajustes salariales en almacenes exigen mejoras continuas en automatización.'),
      },
    ],
    qaKnowledge: {
      margins: bilingual('Item 7 (Segment Operating Income): AWS operating margin reached a record 35.5%, while high-margin Advertising services topped $52B annualized.', 'Item 7 (Margen por Segmento): El margen operativo de AWS alcanzó un récord de 35.5%, mientras el negocio de Publicidad superó los $52B anualizados.'),
      risks: bilingual('Item 1A (Risk Factors): Key risks are $75B planned infrastructure CAPEX (-52), consumer discretionary mix shifts (-48), and FTC marketplace litigation (-45).', 'Item 1A (Riesgos): Incluye el plan de $75B de CAPEX en infraestructura (-52), desaceleración en consumo discrecional (-48) y litigios de la FTC (-45).'),
      valuation: bilingual('Cash Flow & Backlog (Item 8): Operating cash flow rose 38% to $112.7B, backed by a $164B AWS long-term enterprise contract backlog.', 'Flujo de Caja y Backlog (Item 8): El flujo de caja operativo subió 38% a $112.7B, respaldado por $164B en contratos cloud comprometidos.'),
      competition: bilingual('Cloud & Retail Position: AWS leads global cloud infrastructure at 31% share, while custom Trainium2 chips offer 30–40% price-performance savings over third-party GPUs.', 'Posición en Cloud y Retail: AWS lidera con 31% del mercado cloud global, mientras sus chips propios Trainium2 reducen costos de inferencia entre 30% y 40%.'),
    },
  },
  GOOGL: {
    stance: 'BULLISH',
    stanceLabel: bilingual('Constructive • AI Search & Cloud Expansion', 'Constructivo • Monetización en Search y Cloud'),
    filingSource: bilingual('SEC Form 10-K (FY2025) • Item 7 & Item 1A', 'Reporte Oficial SEC Form 10-K (FY2025) • Item 7 y 1A'),
    executiveSummary: bilingual('Gemini AI integration into Search and TPU v5p adoption in Google Cloud are lifting operating margins, balanced against DOJ antitrust remedies and rising AI infrastructure depreciation.', 'La integración de Gemini en Search y la adopción de chips TPU v5p en Google Cloud elevan los márgenes operativos, contrapesados por los juicios antimonopolio del DOJ.'),
    bullDrivers: [
      {
        score: 83,
        importance: 'HIGH',
        title: bilingual('AI Overviews & Search Monetization Resilience', 'Monetización de IA en el Buscador'),
        detail: bilingual('Per Item 7, generative AI search summaries lifted commercial query engagement and ad conversion.', 'Los resúmenes con IA en el buscador aumentaron la conversión en búsquedas comerciales.'),
      },
      {
        score: 79,
        importance: 'HIGH',
        title: bilingual('Google Cloud Margin Expansion (17.1%)', 'Expansión de Margen en Google Cloud (17.1%)'),
        detail: bilingual('Cloud operating income hit $1.95B quarterly on enterprise Gemini and Vertex AI adoption.', 'La utilidad operativa de Cloud alcanzó $1.95B trimestrales por adopción de Vertex AI.'),
      },
      {
        score: 75,
        importance: 'MEDIUM',
        title: bilingual('Custom TPU v5p & Trillium Silicon Advantage', 'Ventaja de Costos con Chips Propios TPU'),
        detail: bilingual('Proprietary TPUs cut internal LLM training and inference cost by 45% vs merchant GPUs.', 'La arquitectura propia TPU reduce en 45% el costo interno de entrenamiento e inferencia.'),
      },
      {
        score: 71,
        importance: 'MEDIUM',
        title: bilingual('YouTube Ad + Subscription Revenue ($50B+)', 'YouTube Supera $50B en Publicidad y Suscripciones'),
        detail: bilingual('Connected TV viewership leadership and YouTube Premium subscriptions diversify ad revenue.', 'El liderazgo en TV conectada y suscripciones Premium diversifica los ingresos.'),
      },
      {
        score: 67,
        importance: 'LOW',
        title: bilingual('$93.2B Cash Fortress & 21.8x Forward P/E', '$93.2B en Liquidez y Valuación Atractiva (21.8x)'),
        detail: bilingual('Trades at the lowest forward multiple among mega-cap AI peers with $70B buyback authorization.', 'Cotiza al múltiplo más moderado entre las mega-caps de IA con fuertes recompras.'),
      },
    ],
    bearRisks: [
      {
        score: 64,
        importance: 'HIGH',
        title: bilingual('DOJ Search Distribution Antitrust Remedies', 'Sanciones Antimonopolio del DOJ en Distribución'),
        detail: bilingual('Per Item 1A, potential restrictions on default Apple/OEM search agreements pose legal risk.', 'Según Item 1A, posibles restricciones a acuerdos de buscador predeterminado son el riesgo clave.'),
      },
      {
        score: 56,
        importance: 'HIGH',
        title: bilingual('Standalone Conversational AI Search Rivals', 'Competencia en Búsqueda Conversacional'),
        detail: bilingual('New generative AI answer engines compete for high-intent informational queries.', 'Nuevos motores conversacionales compiten por consultas informativas de alto valor.'),
      },
      {
        score: 50,
        importance: 'MEDIUM',
        title: bilingual('$50B+ Annual AI Infrastructure Depreciation', 'Depreciación por Más de $50B en CAPEX de IA'),
        detail: bilingual('Accelerated server and TPU cluster investments increase quarterly depreciation charges.', 'La fuerte inversión en servidores y clusters TPU eleva los cargos por depreciación.'),
      },
      {
        score: 45,
        importance: 'LOW',
        title: bilingual('Ad-Tech DOJ Trial & European DMA Fines', 'Juicio sobre Tecnología Publicitaria (Ad-Tech)'),
        detail: bilingual('Regulatory pressure on third-party ad network exchange tools in US and EU.', 'Presión regulatoria sobre herramientas de intermediación publicitaria.'),
      },
      {
        score: 40,
        importance: 'LOW',
        title: bilingual('Waymo & Other Bets Operating Losses ($4.4B/yr)', 'Inversión Operativa en Otras Apuestas ($4.4B/año)'),
        detail: bilingual('Autonomous vehicle scaling and experimental moonshots require ongoing capital subsidies.', 'El escalamiento de vehículos autónomos requiere financiamiento continuo.'),
      },
    ],
    qaKnowledge: {
      margins: bilingual('Item 7 (Profitability): Alphabet consolidated operating margin expanded to 32.1%, with Google Cloud operating margin climbing to 17.1% ($1.95B quarterly operating income).', 'Item 7 (Rentabilidad): El margen operativo consolidado de Alphabet subió a 32.1%, con el margen de Google Cloud alcanzando el 17.1% ($1.95B trimestrales).'),
      risks: bilingual('Item 1A (Regulatory & Legal): DOJ remedies targeting Apple/OEM default search distribution agreements (-64) and generative AI search competition (-56) represent the primary overhangs.', 'Item 1A (Riesgo Regulatorio): Las medidas del DOJ sobre acuerdos de distribución por defecto (-64) y la competencia en búsqueda con IA (-56) son los riesgos principales.'),
      valuation: bilingual('Balance Sheet Strength (Item 8): Alphabet holds $93.2B in cash and marketable securities with only $12.3B in long-term debt, trading at 21.8x forward earnings.', 'Solidez de Balance (Item 8): Alphabet cuenta con $93.2B en caja e inversiones líquidas frente a sólo $12.3B de deuda, cotizando a 21.8x ganancias futuras.'),
      competition: bilingual('AI & Search Moat: Custom Trillium/v5p TPUs lower internal Gemini serving costs by 45%, protecting Search gross margins against standalone LLM competitors.', 'Foso en IA y Buscador: Los chips propios TPU reducen en 45% el costo de inferencia de Gemini, protegiendo los márgenes frente a competidores.'),
    },
  },
  SPY: {
    stance: 'BULLISH',
    stanceLabel: bilingual('Constructive • Expanding Corporate Margins', 'Constructivo • Expansión de Márgenes Corporativos'),
    filingSource: bilingual('S&P 500 Trust & Macro Earnings Report', 'Reporte Macro y de Ganancias del S&P 500'),
    executiveSummary: bilingual('S&P 500 forward 12-month operating margins expanded to 12.6% led by Technology and Communication Services, while top-10 constituent concentration (36.2%) remains the key structural risk.', 'Los márgenes operativos proyectados del S&P 500 subieron a 12.6% liderados por Tecnología, mientras que la alta concentración en las 10 mayores empresas (36.2%) es el principal riesgo estructural.'),
    bullDrivers: [
      {
        score: 80,
        importance: 'HIGH',
        title: bilingual('12.6% Forward Index Operating Margins', 'Márgenes Operativos Proyectados del 12.6%'),
        detail: bilingual('Corporate cost discipline and AI productivity gains support +11.4% YoY index EPS growth.', 'La disciplina de costos sostiene un crecimiento de ganancias proyectado del +11.4% anual.'),
      },
      {
        score: 75,
        importance: 'HIGH',
        title: bilingual('$920B Annualized Corporate Share Buybacks', '$920B Anuales en Recompras de Acciones'),
        detail: bilingual('Record share repurchase authorizations across S&P 500 constituents provide structural bid.', 'Las recompras corporativas récord sostienen la demanda estructural del índice.'),
      },
      {
        score: 72,
        importance: 'MEDIUM',
        title: bilingual('Broadening Cyclical Sector Earnings', 'Recuperación de Ganancias en Sectores Cíclicos'),
        detail: bilingual('Financials and Industrials are accelerating earnings participation alongside Tech.', 'Los sectores Financiero e Industrial aceleran su aporte al crecimiento de utilidades.'),
      },
      {
        score: 68,
        importance: 'MEDIUM',
        title: bilingual('79% Q3 Earnings Beat Rate (+6.4% Surprise)', '79% de Empresas Superan Estimaciones en Q3'),
        detail: bilingual('Constituent earnings resilience continues to exceed consensus Wall Street estimates.', 'Las utilidades reportadas superan el consenso en un promedio de +6.4%.'),
      },
      {
        score: 64,
        importance: 'LOW',
        title: bilingual('Fixed-Rate Corporate Debt Insulation', 'Deuda Corporativa Fijada a Tasas Bajas'),
        detail: bilingual('S&P 500 investment-grade issuers locked in long-duration maturities, limiting interest expense.', 'Las grandes empresas fijaron deuda a largo plazo, limitando el impacto financiero.'),
      },
    ],
    bearRisks: [
      {
        score: 58,
        importance: 'HIGH',
        title: bilingual('36.2% Top-10 Constituent Concentration', 'Concentración del 36.2% en el Top-10'),
        detail: bilingual('Index returns remain heavily exposed to multiple compression in the top 7 mega-cap weights.', 'El desempeño del índice es altamente sensible a las 7 mayores empresas tecnológicas.'),
      },
      {
        score: 54,
        importance: 'HIGH',
        title: bilingual('Elevated 21.4x Forward P/E Valuation', 'Valuación Exigente (P/E Proyectado 21.4x)'),
        detail: bilingual('Trades above the 10-year average (18.1x), leaving a narrower buffer for macro shocks.', 'Cotiza por encima del promedio histórico de 10 años (18.1x), dejando menor margen.'),
      },
      {
        score: 48,
        importance: 'MEDIUM',
        title: bilingual('Sticky Services Inflation & 10Y Yield Risk', 'Inflación de Servicios y Tasa del Bono a 10 Años'),
        detail: bilingual('Treasury yields above 4.5% historically cap further equity P/E multiple expansion.', 'Tasas del Tesoro sobre 4.5% suelen limitar la expansión de múltiplos bursátiles.'),
      },
      {
        score: 43,
        importance: 'LOW',
        title: bilingual(' Narrow Equity Risk Premium vs T-Bills', 'Prima de Riesgo Bursátil Comprimida frente a Bonos'),
        detail: bilingual('S&P 500 earnings yield (4.67%) sits close to risk-free Treasury yields.', 'El rendimiento por ganancias del índice se ubica cerca de la tasa libre de riesgo.'),
      },
      {
        score: 39,
        importance: 'LOW',
        title: bilingual('Geopolitical Trade & Tariff Uncertainty', 'Incertidumbre Geopolítica y Arancelaria'),
        detail: bilingual('40% of S&P 500 revenue is generated internationally, exposing multinationals to FX and tariffs.', 'El 40% de los ingresos del S&P 500 proviene del exterior, con exposición cambiaria.'),
      },
    ],
    qaKnowledge: {
      margins: bilingual('Index Earnings & Margins: Consensus S&P 500 EPS growth stands at +11.4% YoY with net profit margins at 12.6% vs the 5-year average of 11.5%.', 'Ganancias y Márgenes del Índice: El crecimiento proyectado de ganancias del S&P 500 es de +11.4% anual con márgenes netos del 12.6%.'),
      risks: bilingual('Concentration & Macro Risk: Top-10 weights account for 36.2% of index market cap (-58); trading at 21.4x forward P/E (-54) leaves sensitivity to 10Y yields.', 'Concentración y Riesgo Macro: Las 10 mayores acciones representan el 36.2% del índice (-58), mientras el múltiplo de 21.4x (-54) exige cumplir metas de ganancias.'),
      valuation: bilingual('Valuation Multiples: SPY trades at 21.4x forward 12-month earnings with a 1.28% dividend yield and $920B in annualized constituent buybacks.', 'Múltiplos de Valuación: SPY cotiza a 21.4x ganancias proyectadas con un dividendo de 1.28% y $920B anuales en recompras corporativas.'),
      competition: bilingual('Sector Allocation: Information Technology (31.8%), Financials (13.2%), and Healthcare (11.6%) represent over 56% of total SPY exposure.', 'Composición Sectorial: Tecnología (31.8%), Financieras (13.2%) y Salud (11.6%) concentran más del 56% del índice.'),
    },
  },
  QQQ: {
    stance: 'BULLISH',
    stanceLabel: bilingual('Bullish • Secular AI & Cloud Growth', 'Alcista • Crecimiento Secular en IA y Cloud'),
    filingSource: bilingual('Nasdaq-100 Trust Report (FY2025)', 'Reporte Institucional Nasdaq-100 (FY2025)'),
    executiveSummary: bilingual('Nasdaq-100 constituents are deploying over $210B annualized into AI and cloud infrastructure, driving 18.4% YoY EPS growth with strong balance sheet cash reserves.', 'Las empresas del Nasdaq-100 despliegan más de $210B anuales en infraestructura de IA y cloud, impulsando un crecimiento de ganancias del 18.4% anual con sólidos balances de caja.'),
    bullDrivers: [
      {
        score: 88,
        importance: 'HIGH',
        title: bilingual('+18.4% YoY Index EPS Growth', 'Crecimiento de Ganancias del +18.4% Anual'),
        detail: bilingual('Semiconductor and cloud hyperscaler constituents lead global corporate earnings expansion.', 'Los líderes en semiconductores y cloud encabezan el crecimiento global de utilidades.'),
      },
      {
        score: 84,
        importance: 'HIGH',
        title: bilingual('$210B+ Annualized AI & R&D Deployment', 'Más de $210B en Inversión en IA e I+D'),
        detail: bilingual('Self-funded innovation from operating cash flow widens technological moats.', 'La inversión autofinanciada con flujo de caja amplía las barreras tecnológicas.'),
      },
      {
        score: 79,
        importance: 'MEDIUM',
        title: bilingual('54.8% Aggregate Gross Profit Margin', 'Margen Bruto Agregado del 54.8%'),
        detail: bilingual('Asset-light software and proprietary silicon pricing power sustain high profitability.', 'El poder de fijación de precios en software y chips sostiene una alta rentabilidad.'),
      },
      {
        score: 75,
        importance: 'MEDIUM',
        title: bilingual('$480B Trailing Free Cash Flow in Top-10', '$480B de Flujo de Caja Libre en el Top-10'),
        detail: bilingual('Net cash balance sheets insulate mega-cap tech leaders from refinancing headwinds.', 'Los balances con caja neta positiva aíslan a las líderes tecnológicas del costo de deuda.'),
      },
      {
        score: 70,
        importance: 'LOW',
        title: bilingual('Global Enterprise Cloud & SaaS Penetration', 'Penetración Global de Cloud y Software SaaS'),
        detail: bilingual('Mission-critical enterprise software subscriptions provide >110% net dollar retention.', 'Las suscripciones de software crítico mantienen tasas de retención neta >110%.'),
      },
    ],
    bearRisks: [
      {
        score: 56,
        importance: 'HIGH',
        title: bilingual('AI CAPEX Monetization ROI Timeline', 'Tiempos de Retorno de la Inversión en IA'),
        detail: bilingual('Any lag between $210B hardware spend and software revenue realization can compress multiples.', 'Cualquier demora entre la fuerte inversión en hardware y su monetización puede comprimir múltiplos.'),
      },
      {
        score: 52,
        importance: 'HIGH',
        title: bilingual('Long-Duration Valuation Multiple (26.2x P/E)', 'Sensibilidad de Múltiplos (26.2x P/E) a Tasas'),
        detail: bilingual('Growth equity valuations remain sensitive to upward shifts in real Treasury yields.', 'Los múltiplos de crecimiento son sensibles a subas en las tasas reales de bonos.'),
      },
      {
        score: 48,
        importance: 'MEDIUM',
        title: bilingual('44% Weight in Top-5 Tech Constituents', '44% de Concentración en las 5 Mayores Acciones'),
        detail: bilingual('AAPL, MSFT, NVDA, AVGO, and AMZN drive nearly half of Nasdaq-100 index performance.', 'Cinco compañías concentran casi la mitad del movimiento del índice.'),
      },
      {
        score: 44,
        importance: 'LOW',
        title: bilingual('Global Semiconductor & Digital Antitrust Rules', 'Regulación Antimonopolio y Controles de Chips'),
        detail: bilingual('Simultaneous DOJ/EU digital market inquiries and semiconductor export restrictions.', 'Investigaciones antimonopolio en EE.UU./UE y controles de exportación en semiconductores.'),
      },
      {
        score: 39,
        importance: 'LOW',
        title: bilingual('Stock-Based Compensation Dilution', 'Dilución por Compensación en Acciones (SBC)'),
        detail: bilingual('Competition for AI engineering talent elevates equity compensation expense.', 'La competencia por talento en IA eleva los paquetes de compensación en acciones.'),
      },
    ],
    qaKnowledge: {
      margins: bilingual('Tech Margin Expansion: Nasdaq-100 aggregate gross margin sits at 54.8% with +18.4% YoY EPS growth driven by AI cloud and semiconductor constituents.', 'Expansión de Márgenes Tech: El margen bruto agregado del Nasdaq-100 es de 54.8% con crecimiento de ganancias del +18.4% anual.'),
      risks: bilingual('Key Index Risks: AI CAPEX ROI timeline scrutiny (-56) and 26.2x forward P/E duration sensitivity to 10-year Treasury yields (-52).', 'Riesgos Principales: Tiempos de retorno del CAPEX en IA (-56) y sensibilidad del múltiplo de 26.2x a la tasa del Tesoro a 10 años (-52).'),
      valuation: bilingual('Valuation & Cash Generation: QQQ trades at 26.2x forward earnings, supported by $480B in aggregate annual free cash flow across the top 10 holdings.', 'Valuación y Flujo de Caja: QQQ cotiza a 26.2x ganancias proyectadas, respaldado por $480B de flujo de caja libre anual en su top-10.'),
      competition: bilingual('Weighting Structure: Apple, Microsoft, NVIDIA, Broadcom, and Amazon represent ~44% of the modified market-cap-weighted Nasdaq-100 index.', 'Estructura del Índice: Apple, Microsoft, NVIDIA, Broadcom y Amazon representan cerca del 44% del peso total del Nasdaq-100.'),
    },
  },
};

export const SEC_10K_CHUNKS = [];

/**
 * Initial News Stream per asset with explicit `importance` weights (`HIGH`, `MEDIUM`, `LOW`)
 * so `NEWS SENTIMENT` is an importance-weighted integer average that aligns coherently with reality.
 */
export const FINBERT_HEADLINES = [
  // BTC
  {
    id: 'news-btc-1',
    sym: 'BTC',
    score: '+82',
    scoreNum: 0.82,
    importance: 'HIGH',
    probs: { pos: 0.87, neu: 0.08, neg: 0.05 },
    source: 'CoinDesk',
    time: '15:28',
    title: bilingual('Spot ETF net inflows surpass $640M intraday as institutional custody reserves hit record high', 'Flujos netos en ETFs Spot superan los $640M intradía mientras reservas institucionales marcan récord'),
  },
  {
    id: 'news-btc-2',
    sym: 'BTC',
    score: '+64',
    scoreNum: 0.64,
    importance: 'MEDIUM',
    probs: { pos: 0.74, neu: 0.16, neg: 0.1 },
    source: 'Reuters',
    time: '12:40',
    title: bilingual('Corporate treasury allocations into spot Bitcoin ETFs expand 28% across Q3 13F filings', 'Asignaciones de tesorería corporativa en ETFs de Bitcoin crecen 28% en los reportes 13F del Q3'),
  },
  {
    id: 'news-btc-3',
    sym: 'BTC',
    score: '-28',
    scoreNum: -0.28,
    importance: 'LOW',
    probs: { pos: 0.21, neu: 0.3, neg: 0.49 },
    source: 'Bloomberg',
    time: '09:15',
    title: bilingual('US 10Y Treasury yield steadies near 4.28% ahead of Federal Reserve commentary', 'Tasa del bono del Tesoro a 10 años opera cerca de 4.28% previo a comentarios de la Fed'),
  },

  // ETH
  {
    id: 'news-eth-1',
    sym: 'ETH',
    score: '+68',
    scoreNum: 0.68,
    importance: 'HIGH',
    probs: { pos: 0.77, neu: 0.15, neg: 0.08 },
    source: 'The Block',
    time: '14:52',
    title: bilingual('Layer-2 rollup transaction throughput hits all-time high (+185%) as staking lockups reach 28.4%', 'El volumen de transacciones en rollups Layer-2 marca récord (+185%) con 28.4% bloqueado en staking'),
  },
  {
    id: 'news-eth-2',
    sym: 'ETH',
    score: '-26',
    scoreNum: -0.26,
    importance: 'MEDIUM',
    probs: { pos: 0.23, neu: 0.28, neg: 0.49 },
    source: 'CoinDesk',
    time: '10:30',
    title: bilingual('Mainnet base gas fees dip during off-peak hours as execution migrates to L2 blobs', 'Comisiones de gas en la red principal bajan en horas valle al migrar actividad a Layer-2'),
  },

  // SOL (Clearly negative weighted sentiment matching its Caution / High Leverage stance!)
  {
    id: 'news-sol-1',
    sym: 'SOL',
    score: '-78',
    scoreNum: -0.78,
    importance: 'HIGH',
    probs: { pos: 0.07, neu: 0.08, neg: 0.85 },
    source: 'Coinglass',
    time: '15:18',
    title: bilingual('Cascading $68M long liquidations hit SOL perpetuals as open interest spikes +2.84σ above 20d mean', 'Liquidaciones en cascada por $68M golpean perpetuos de SOL tras salto de +2.84σ en interés abierto'),
  },
  {
    id: 'news-sol-2',
    sym: 'SOL',
    score: '-54',
    scoreNum: -0.54,
    importance: 'HIGH',
    probs: { pos: 0.14, neu: 0.18, neg: 0.68 },
    source: 'The Block',
    time: '13:42',
    title: bilingual('Order-book bid-ask spreads widen +14.8 bps across major venues amid derivatives volatility', 'Spreads del libro de órdenes se amplían +14.8 bps en medio de alta volatilidad en derivados'),
  },
  {
    id: 'news-sol-3',
    sym: 'SOL',
    score: '+42',
    scoreNum: 0.42,
    importance: 'LOW',
    probs: { pos: 0.61, neu: 0.2, neg: 0.19 },
    source: 'CoinDesk',
    time: '09:50',
    title: bilingual('Weekly DEX spot volume on Solana holds above $14B despite derivatives deleveraging', 'El volumen semanal de exchanges descentralizados en Solana se mantiene sobre $14B'),
  },

  // NVDA
  {
    id: 'news-nvda-1',
    sym: 'NVDA',
    score: '+92',
    scoreNum: 0.92,
    importance: 'HIGH',
    probs: { pos: 0.94, neu: 0.04, neg: 0.02 },
    source: 'Reuters',
    time: '15:56',
    title: bilingual('Next-gen Blackwell B200 AI cluster shipments exceed Q3 institutional consensus estimates', 'Envíos de clusters de IA Blackwell B200 superan estimaciones institucionales del Q3'),
  },
  {
    id: 'news-nvda-2',
    sym: 'NVDA',
    score: '+76',
    scoreNum: 0.76,
    importance: 'MEDIUM',
    probs: { pos: 0.83, neu: 0.11, neg: 0.06 },
    source: 'WSJ',
    time: '13:20',
    title: bilingual('Hyperscaler cloud CAPEX guidance raised by 18% for next fiscal year on GPU cluster build-outs', 'Hiperescaladores elevan un 18% su guía de inversión CAPEX para clusters de GPUs'),
  },
  {
    id: 'news-nvda-3',
    sym: 'NVDA',
    score: '-34',
    scoreNum: -0.34,
    importance: 'LOW',
    probs: { pos: 0.18, neu: 0.3, neg: 0.52 },
    source: 'Bloomberg',
    time: '10:15',
    title: bilingual('Foundry CoWoS packaging lead times remain tight through H1 despite new Taiwan capacity', 'Tiempos de espera en empaquetado CoWoS siguen ajustados pese a nueva capacidad en Taiwán'),
  },

  // AAPL
  {
    id: 'news-aapl-1',
    sym: 'AAPL',
    score: '+74',
    scoreNum: 0.74,
    importance: 'HIGH',
    probs: { pos: 0.81, neu: 0.12, neg: 0.07 },
    source: 'Bloomberg',
    time: '15:41',
    title: bilingual('Services gross margin expands 140 bps to 74.1% on recurring cloud subscriptions', 'Margen bruto de Servicios se expande 140 bps hasta 74.1% por suscripciones cloud recurrentes'),
  },
  {
    id: 'news-aapl-2',
    sym: 'AAPL',
    score: '-28',
    scoreNum: -0.28,
    importance: 'LOW',
    probs: { pos: 0.22, neu: 0.28, neg: 0.5 },
    source: 'Financial Times',
    time: '11:05',
    title: bilingual('EU regulators review App Store developer fee structure under Digital Markets Act compliance', 'Reguladores europeos revisan estructura de comisiones de App Store bajo la Ley de Mercados Digitales'),
  },

  // MSFT
  {
    id: 'news-msft-1',
    sym: 'MSFT',
    score: '+78',
    scoreNum: 0.78,
    importance: 'HIGH',
    probs: { pos: 0.84, neu: 0.1, neg: 0.06 },
    source: 'WSJ',
    time: '14:50',
    title: bilingual('Enterprise M365 Copilot seat deployments accelerate across Fortune 500 financial institutions', 'Despliegues corporativos de M365 Copilot se aceleran entre bancos del Fortune 500'),
  },
  {
    id: 'news-msft-2',
    sym: 'MSFT',
    score: '-24',
    scoreNum: -0.24,
    importance: 'LOW',
    probs: { pos: 0.24, neu: 0.28, neg: 0.48 },
    source: 'Reuters',
    time: '10:40',
    title: bilingual('Higher quarterly data center server depreciation noted in Intelligent Cloud guidance', 'Mayor cargo por depreciación de servidores de IA señalado en guía trimestral'),
  },

  // AMZN
  {
    id: 'news-amzn-1',
    sym: 'AMZN',
    score: '+80',
    scoreNum: 0.8,
    importance: 'HIGH',
    probs: { pos: 0.85, neu: 0.1, neg: 0.05 },
    source: 'Financial Times',
    time: '14:15',
    title: bilingual('AWS custom Trainium2 AI silicon orders expand enterprise cloud backlog to $164B', 'Pedidos de silicio propio Trainium2 de AWS expanden el backlog cloud a $164B'),
  },
  {
    id: 'news-amzn-2',
    sym: 'AMZN',
    score: '+62',
    scoreNum: 0.62,
    importance: 'MEDIUM',
    probs: { pos: 0.73, neu: 0.17, neg: 0.1 },
    source: 'Bloomberg',
    time: '11:20',
    title: bilingual('North American regionalized fulfillment robotics cut per-unit delivery cost by 45 cents', 'Robótica en almacenes regionalizados reduce en 45 centavos el costo de envío por unidad'),
  },

  // GOOGL
  {
    id: 'news-googl-1',
    sym: 'GOOGL',
    score: '+66',
    scoreNum: 0.66,
    importance: 'HIGH',
    probs: { pos: 0.75, neu: 0.15, neg: 0.1 },
    source: 'Reuters',
    time: '14:40',
    title: bilingual('Gemini Cloud TPU v5p adoption lifts Google Cloud operating margin to 17.1%', 'Adopción de chips TPU v5p eleva el margen operativo de Google Cloud al 17.1%'),
  },
  {
    id: 'news-googl-2',
    sym: 'GOOGL',
    score: '-38',
    scoreNum: -0.38,
    importance: 'MEDIUM',
    probs: { pos: 0.17, neu: 0.25, neg: 0.58 },
    source: 'Bloomberg',
    time: '10:55',
    title: bilingual('DOJ outlines proposed remedies regarding default mobile search distribution agreements', 'El Departamento de Justicia detalla propuestas sobre acuerdos de distribución de búsqueda móvil'),
  },

  // SPY
  {
    id: 'news-spy-1',
    sym: 'SPY',
    score: '+64',
    scoreNum: 0.64,
    importance: 'HIGH',
    probs: { pos: 0.74, neu: 0.16, neg: 0.1 },
    source: 'Bloomberg',
    time: '15:10',
    title: bilingual('S&P 500 forward operating margin consensus rises to 12.6% as 79% of companies beat Q3 EPS', 'Consenso de margen operativo del S&P 500 sube a 12.6% con 79% superando ganancias del Q3'),
  },
  {
    id: 'news-spy-2',
    sym: 'SPY',
    score: '-25',
    scoreNum: -0.25,
    importance: 'LOW',
    probs: { pos: 0.23, neu: 0.29, neg: 0.48 },
    source: 'WSJ',
    time: '11:30',
    title: bilingual('Top-10 index weight concentration reaches 36.2% ahead of mega-cap earnings week', 'Concentración del top-10 en el S&P 500 alcanza 36.2% previo a reportes de mega-caps'),
  },

  // QQQ
  {
    id: 'news-qqq-1',
    sym: 'QQQ',
    score: '+76',
    scoreNum: 0.76,
    importance: 'HIGH',
    probs: { pos: 0.82, neu: 0.12, neg: 0.06 },
    source: 'Reuters',
    time: '15:22',
    title: bilingual('Nasdaq-100 AI semiconductor and cloud constituents lead institutional equity inflows', 'Componentes de semiconductores de IA y cloud del Nasdaq-100 lideran flujos institucionales'),
  },
  {
    id: 'news-qqq-2',
    sym: 'QQQ',
    score: '-29',
    scoreNum: -0.29,
    importance: 'LOW',
    probs: { pos: 0.21, neu: 0.28, neg: 0.51 },
    source: 'Bloomberg',
    time: '10:45',
    title: bilingual('Long-duration tech multiples show sensitivity to intraday 10Y Treasury yield movements', 'Múltiplos tecnológicos muestran sensibilidad a movimientos intradía del bono a 10 años'),
  },
];

/**
 * Rich, non-repetitive incoming live wire pool per asset.
 * When `materiality === 'HIGH'`, the incoming news ALSO inserts a new item at the top of the
 * asset's 5 Bull Drivers or 5 Bear Risks (`driverUpdate`), pushing out the oldest of the 5!
 */
export const LIVE_WIRE_POOL = {
  BTC: [
    {
      scoreNum: 0.89,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.91, neu: 0.06, neg: 0.03 },
      source: 'Reuters Desk',
      title: bilingual('FLASH: BlackRock IBIT & Fidelity FBTC record $480M combined net inflows in morning session', 'FLASH: ETFs de BlackRock y Fidelity registran $480M de flujos netos en la sesión matutina'),
      driverUpdate: {
        side: 'bull',
        score: 92,
        importance: 'HIGH',
        title: bilingual('Intraday ETF Block Inflow Surge (+$480M)', 'Salto Intradía en Bloques de ETFs (+$480M)'),
        detail: bilingual('Updated from Live Wire: Institutional creations in IBIT/FBTC accelerated 40% above 30-day average.', 'Actualizado por noticia: Las suscripciones en IBIT/FBTC aceleraron 40% sobre su media mensual.'),
      },
    },
    {
      scoreNum: -0.45,
      importance: 'MEDIUM',
      materiality: 'ROUTINE',
      probs: { pos: 0.16, neu: 0.23, neg: 0.61 },
      source: 'Bloomberg Wire',
      title: bilingual('MACRO: US 10Y real yield ticks up +5 bps following stronger-than-expected ISM Services print', 'MACRO: Tasa real de EE.UU. a 10 años sube +5 bps tras dato ISM de servicios superior al esperado'),
    },
    {
      scoreNum: 0.74,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.81, neu: 0.12, neg: 0.07 },
      source: 'Glassnode Live',
      title: bilingual('ON-CHAIN: 18,400 BTC ($1.26B) withdrawn from Coinbase Institutional to cold custody vaults', 'ON-CHAIN: 18.400 BTC ($1.26B) retirados de Coinbase Institutional hacia bóvedas en frío'),
      driverUpdate: {
        side: 'bull',
        score: 86,
        importance: 'HIGH',
        title: bilingual('18,400 BTC Institutional Cold-Custody Outflow', 'Retiro Institucional de 18.400 BTC a Custodia'),
        detail: bilingual('Updated from Live Wire: Large OTC settlement reduced liquid exchange float by another $1.26B.', 'Actualizado por noticia: Liquidación OTC redujo el circulante en exchanges en otros $1.26B.'),
      },
    },
    {
      scoreNum: -0.52,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.12, neu: 0.24, neg: 0.64 },
      source: 'Coinglass Desk',
      title: bilingual('DERIVATIVES: Annualized BTC perpetual funding rate crosses 24% across offshore futures venues', 'DERIVADOS: Tasa de fondeo anualizada en futuros perpetuos de BTC supera el 24%'),
      driverUpdate: {
        side: 'bear',
        score: 62,
        importance: 'MEDIUM',
        title: bilingual('Perpetual Funding Rate Approaching 24% APR', 'Tasa de Fondeo en Perpetuos Cercana al 24%'),
        detail: bilingual('Updated from Live Wire: Rising leveraged long basis increases short-term squeeze sensitivity.', 'Actualizado por noticia: El aumento del fondeo eleva el riesgo de toma de ganancias.'),
      },
    },
  ],
  SOL: [
    {
      scoreNum: -0.82,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.06, neu: 0.06, neg: 0.88 },
      source: 'Coinglass Live',
      title: bilingual('FLASH: Additional $42M in leveraged SOL long positions liquidated in 15 minutes as funding resets', 'FLASH: Otros $42M en posiciones largas apalancadas de SOL liquidados en 15 minutos'),
      driverUpdate: {
        side: 'bear',
        score: 94,
        importance: 'HIGH',
        title: bilingual('Intraday $42M Long Liquidation Cascade', 'Cascada Intradía de $42M en Liquidaciones'),
        detail: bilingual('Updated from Live Wire: Forced perpetual liquidations deepened order-book volatility.', 'Actualizado por noticia: Liquidaciones forzadas profundizaron la volatilidad en perpetuos.'),
      },
    },
    {
      scoreNum: -0.64,
      importance: 'MEDIUM',
      materiality: 'ROUTINE',
      probs: { pos: 0.11, neu: 0.14, neg: 0.75 },
      source: 'Kaiko Liquidity',
      title: bilingual('MICROSTRUCTURE: Top-of-book SOL liquidity depth drops 28% during high-velocity DEX arbitrage', 'MICROESTRUCTURA: Profundidad del libro de órdenes en SOL cae 28% durante arbitraje DEX'),
    },
    {
      scoreNum: 0.58,
      importance: 'MEDIUM',
      materiality: 'HIGH',
      probs: { pos: 0.71, neu: 0.16, neg: 0.13 },
      source: 'The Block Wire',
      title: bilingual('NETWORK: Firedancer testnet benchmark demonstrates 99.8% packet completion under stress load', 'RED: Prueba de estrés de Firedancer demuestra 99.8% de efectividad en procesamiento de paquetes'),
      driverUpdate: {
        side: 'bull',
        score: 70,
        importance: 'MEDIUM',
        title: bilingual('Firedancer 99.8% Stress-Test Milestone', 'Hito de 99.8% de Efectividad en Firedancer'),
        detail: bilingual('Updated from Live Wire: New validator client passed high-load packet stress benchmarks.', 'Actualizado por noticia: El nuevo cliente validador superó pruebas de alta carga.'),
      },
    },
    {
      scoreNum: -0.59,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.12, neu: 0.17, neg: 0.71 },
      source: 'Solana Compass',
      title: bilingual('ALERT: Non-vote transaction drop rate ticks up to 18% during peak meme token launch window', 'ALERTA: Tasa de transacciones fallidas sube al 18% durante pico de lanzamientos en DEX'),
      driverUpdate: {
        side: 'bear',
        score: 82,
        importance: 'HIGH',
        title: bilingual('18% Transaction Drop Spike Under Peak Load', 'Pico de 18% en Caída de Transacciones'),
        detail: bilingual('Updated from Live Wire: Compute scheduler saturation observed during DEX volume burst.', 'Actualizado por noticia: Saturación en planificador de cómputo durante pico de tráfico.'),
      },
    },
  ],
  NVDA: [
    {
      scoreNum: 0.88,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.9, neu: 0.08, neg: 0.02 },
      source: 'Taiwan Economic Daily',
      title: bilingual('FLASH: TSMC accelerates CoWoS-L advanced packaging line activation by one quarter for Blackwell B200', 'FLASH: TSMC adelanta un trimestre la activación de líneas de empaquetado CoWoS-L para Blackwell B200'),
      driverUpdate: {
        side: 'bull',
        score: 92,
        importance: 'HIGH',
        title: bilingual('TSMC Accelerates CoWoS-L Capacity for Blackwell', 'TSMC Adelanta Capacidad CoWoS-L para Blackwell'),
        detail: bilingual('Updated from Live Wire: Early packaging line activation expands Q4 B200 rack supply by 15%.', 'Actualizado por noticia: Adelanto de líneas amplía un 15% la oferta de racks B200 en Q4.'),
      },
    },
    {
      scoreNum: 0.72,
      importance: 'MEDIUM',
      materiality: 'ROUTINE',
      probs: { pos: 0.8, neu: 0.12, neg: 0.08 },
      source: 'Bloomberg Intelligence',
      title: bilingual('CHANNEL CHECK: Enterprise InfiniBand & Spectrum-X switch attach rates top 82% on new GPU clusters', 'CANAL: Adopción de switches InfiniBand y Spectrum-X supera el 82% en nuevos clusters de IA'),
    },
    {
      scoreNum: -0.41,
      importance: 'MEDIUM',
      materiality: 'HIGH',
      probs: { pos: 0.16, neu: 0.27, neg: 0.57 },
      source: 'Reuters Policy',
      title: bilingual('POLICY: Commerce Dept reviews additional licensing thresholds for high-density AI clusters in Middle East', 'REGULACIÓN: Departamento de Comercio revisa licencias para clusters de IA en Medio Oriente'),
      driverUpdate: {
        side: 'bear',
        score: 52,
        importance: 'MEDIUM',
        title: bilingual('Expanded Regional Export License Reviews', 'Revisión de Licencias de Exportación en Medio Oriente'),
        detail: bilingual('Updated from Live Wire: Additional sovereign cluster export approvals may lengthen delivery timelines.', 'Actualizado por noticia: Revisiones adicionales podrían extender tiempos de entrega.'),
      },
    },
  ],
  ETH: [
    {
      scoreNum: 0.79,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.84, neu: 0.1, neg: 0.06 },
      source: 'The Block Wire',
      title: bilingual('FLASH: Base & Arbitrum daily L2 settlement volume hits new record, lifting mainnet blob fee burn', 'FLASH: Volumen diario en Base y Arbitrum marca récord, elevando quema de comisiones en Ethereum'),
      driverUpdate: {
        side: 'bull',
        score: 86,
        importance: 'HIGH',
        title: bilingual('Record L2 Blob Fee Burn Acceleration', 'Aceleración Récord en Quema de Blobs L2'),
        detail: bilingual('Updated from Live Wire: Surge in Base/Arbitrum blob posting lifted daily ETH burn by 34%.', 'Actualizado por noticia: El salto de tráfico en L2 elevó la quema diaria de ETH un 34%.'),
      },
    },
    {
      scoreNum: -0.35,
      importance: 'LOW',
      materiality: 'ROUTINE',
      probs: { pos: 0.19, neu: 0.27, neg: 0.54 },
      source: 'CoinDesk Desk',
      title: bilingual('STAKING: Validator exit queue ticks slightly higher as institutional stakers rebalance portfolios', 'STAKING: Cola de salida de validadores sube levemente por rebalanceo de carteras institucionales'),
    },
  ],
  AAPL: [
    {
      scoreNum: 0.81,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.85, neu: 0.1, neg: 0.05 },
      source: 'Bloomberg Intelligence',
      title: bilingual('FLASH: App Store global billing run-rate accelerates +13% YoY led by cloud & AI subscriptions', 'FLASH: Facturación global de App Store acelera +13% anual liderada por suscripciones cloud e IA'),
      driverUpdate: {
        side: 'bull',
        score: 88,
        importance: 'HIGH',
        title: bilingual('App Store Billings Accelerate +13% YoY', 'Facturación de App Store Acelera +13% Anual'),
        detail: bilingual('Updated from Live Wire: AI app subscriptions lifted quarterly Services gross margin outlook.', 'Actualizado por noticia: Suscripciones de apps de IA impulsan el margen de Servicios.'),
      },
    },
    {
      scoreNum: -0.32,
      importance: 'LOW',
      materiality: 'ROUTINE',
      probs: { pos: 0.2, neu: 0.29, neg: 0.51 },
      source: 'Nikkei Asia',
      title: bilingual('SUPPLY CHAIN: Seasonal component lead times lengthen by 4 days across Southeast Asian hubs', 'CADENA DE SUMINISTRO: Tiempos de entrega de componentes se extienden 4 días en Asia'),
    },
  ],
  MSFT: [
    {
      scoreNum: 0.84,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.87, neu: 0.09, neg: 0.04 },
      source: 'Reuters Enterprise',
      title: bilingual('FLASH: Multi-year Azure OpenAI enterprise commitments top $12B in new quarterly bookings', 'FLASH: Compromisos plurianuales de Azure OpenAI superan los $12B en nuevos contratos trimestrales'),
      driverUpdate: {
        side: 'bull',
        score: 91,
        importance: 'HIGH',
        title: bilingual('$12B New Quarterly Azure OpenAI Bookings', '$12B en Nuevos Contratos Trimestrales de Azure IA'),
        detail: bilingual('Updated from Live Wire: Fortune 500 multi-year AI cloud commitments exceeded consensus.', 'Actualizado por noticia: Contratos plurianuales de IA en Fortune 500 superaron el consenso.'),
      },
    },
    {
      scoreNum: -0.31,
      importance: 'LOW',
      materiality: 'ROUTINE',
      probs: { pos: 0.21, neu: 0.28, neg: 0.51 },
      source: 'WSJ Tech',
      title: bilingual('INFRASTRUCTURE: Regional utility grid interconnects push two data center expansions into Q4', 'INFRAESTRUCTURA: Conexiones eléctricas regionales postergan dos expansiones hacia el Q4'),
    },
  ],
  AMZN: [
    {
      scoreNum: 0.84,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.87, neu: 0.1, neg: 0.03 },
      source: 'Bloomberg Wire',
      title: bilingual('FLASH: AWS signs $4.2B multi-year cloud migration and Bedrock AI agreement with global telecom', 'FLASH: AWS firma acuerdo plurianual de $4.2B en migración cloud e IA Bedrock'),
      driverUpdate: {
        side: 'bull',
        score: 89,
        importance: 'HIGH',
        title: bilingual('$4.2B Enterprise Bedrock AI Cloud Contract', 'Contrato Corporativo de $4.2B en AWS Bedrock'),
        detail: bilingual('Updated from Live Wire: Large enterprise AI workload migration boosts AWS high-margin backlog.', 'Actualizado por noticia: Migración corporativa de IA eleva el backlog de alto margen.'),
      },
    },
  ],
  GOOGL: [
    {
      scoreNum: 0.78,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.83, neu: 0.11, neg: 0.06 },
      source: 'Reuters Tech',
      title: bilingual('FLASH: Google Cloud signs multi-year TPU v5p compute agreement with leading enterprise AI labs', 'FLASH: Google Cloud firma acuerdo plurianual de cómputo TPU v5p con laboratorios líderes de IA'),
      driverUpdate: {
        side: 'bull',
        score: 85,
        importance: 'HIGH',
        title: bilingual('Multi-Year TPU v5p Enterprise AI Contracts', 'Acuerdos Plurianuales de Cómputo TPU v5p'),
        detail: bilingual('Updated from Live Wire: External AI lab demand for custom TPUs expands Cloud operating leverage.', 'Actualizado por noticia: La demanda externa de TPUs amplía el margen operativo de Cloud.'),
      },
    },
  ],
  SPY: [
    {
      scoreNum: 0.74,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.8, neu: 0.13, neg: 0.07 },
      source: 'FactSet Live',
      title: bilingual('FLASH: S&P 500 Q3 blended earnings growth rate revised upward from +8.2% to +11.4% YoY', 'FLASH: Crecimiento de ganancias del S&P 500 en Q3 se revisa al alza de +8.2% a +11.4% anual'),
      driverUpdate: {
        side: 'bull',
        score: 83,
        importance: 'HIGH',
        title: bilingual('Upward Revision to +11.4% YoY Index EPS', 'Revisión al Alza en Ganancias del Índice (+11.4%)'),
        detail: bilingual('Updated from Live Wire: Broad-based margin beats across Tech and Financials lifted index EPS.', 'Actualizado por noticia: Sorpresas positivas en márgenes elevaron la ganancia del índice.'),
      },
    },
  ],
  QQQ: [
    {
      scoreNum: 0.82,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.86, neu: 0.1, neg: 0.04 },
      source: 'Bloomberg Terminal',
      title: bilingual('FLASH: Hyperscaler cloud & semiconductor basket sees $2.4B institutional block inflows intraday', 'FLASH: Canasta de semiconductores e hiperescaladores recibe $2.4B en flujos institucionales intradía'),
      driverUpdate: {
        side: 'bull',
        score: 89,
        importance: 'HIGH',
        title: bilingual('$2.4B Institutional Tech Block Inflows', '$2.4B en Flujos Institucionales hacia Tech'),
        detail: bilingual('Updated from Live Wire: Institutional allocation into AI infrastructure leaders accelerated intraday.', 'Actualizado por noticia: Asignación institucional hacia líderes de IA aceleró intradía.'),
      },
    },
  ],
};

export const RAG_QUICK_TOPICS = [
  { id: 'margins', label: bilingual('Revenue & Margins', 'Ingresos y Márgenes'), query: 'margins & revenue growth' },
  { id: 'risks', label: bilingual('Key Risk Factors', 'Factores de Riesgo'), query: 'key risk factors & bottlenecks' },
  { id: 'valuation', label: bilingual('Cash Flow & Valuation', 'Caja y Valuación'), query: 'balance sheet cash flow & valuation' },
  { id: 'competition', label: bilingual('Moat & Competition', 'Competencia y Cuota'), query: 'competitive moat & market share' },
];

export function getRagQuickTopicsForCategory(cat = 'EQUITY') {
  const map = {
    CASH: [
      { id: 'margins', label: bilingual('Fed Corridor & Rate', 'Tasa y Corredor Fed'), query: 'margins & yield corridor growth' },
      { id: 'risks', label: bilingual('Liquidity Risk', 'Riesgo de Liquidez'), query: 'key risk factors & bottlenecks' },
      { id: 'valuation', label: bilingual('Repo / RRP Volume', 'Volumen Repo / RRP'), query: 'balance sheet cash flow & liquidity' },
      { id: 'competition', label: bilingual('T-Bill Curve (1M-6M)', 'Curva T-Bills (1M-6M)'), query: 'competitive moat & market share' },
    ],
    COMMODITY: [
      { id: 'margins', label: bilingual('Supply & Inventories', 'Oferta e Inventarios'), query: 'margins & revenue growth' },
      { id: 'risks', label: bilingual('Geopolitical / Weather Risk', 'Riesgos Geopolíticos / Clima'), query: 'key risk factors & bottlenecks' },
      { id: 'valuation', label: bilingual('Forward Curve (Roll Yield)', 'Curva Futuros (Roll Yield)'), query: 'balance sheet cash flow & valuation' },
      { id: 'competition', label: bilingual('Industrial Demand & COT', 'Demanda Industrial y COT'), query: 'competitive moat & market share' },
    ],
    CRYPTO: [
      { id: 'margins', label: bilingual('Network Fees & Burn', 'Economía de Red y Quema'), query: 'margins & revenue growth' },
      { id: 'risks', label: bilingual('Leverage & Funding Risk', 'Riesgos de Apalancamiento'), query: 'key risk factors & bottlenecks' },
      { id: 'valuation', label: bilingual('ETF Reserves & TVL', 'Reservas ETF y TVL'), query: 'balance sheet cash flow & valuation' },
      { id: 'competition', label: bilingual('L1 / DeFi Dominance', 'Dominancia Layer-1 / DeFi'), query: 'competitive moat & market share' },
    ],
    DERIVATIVES_VOL: [
      { id: 'margins', label: bilingual('IV Surface & Skew', 'Superficie IV y Skew'), query: 'margins & revenue growth' },
      { id: 'risks', label: bilingual('Gamma / Pinning Risk', 'Riesgo Gamma / Pinning'), query: 'key risk factors & bottlenecks' },
      { id: 'valuation', label: bilingual('Liquidity & Open Interest', 'Liquidez y Open Interest'), query: 'balance sheet cash flow & valuation' },
      { id: 'competition', label: bilingual('Straddle Breakeven', 'Cobertura / Breakeven'), query: 'competitive moat & market share' },
    ],
    EQUITY: RAG_QUICK_TOPICS,
    ETF: [
      { id: 'margins', label: bilingual('Inflows & AUM', 'Flujos y AUM'), query: 'margins & revenue growth' },
      { id: 'risks', label: bilingual('Concentration Risk', 'Riesgo de Concentración'), query: 'key risk factors & bottlenecks' },
      { id: 'valuation', label: bilingual('NAV Spread & Tracking', 'Tracking Error y NAV'), query: 'balance sheet cash flow & valuation' },
      { id: 'competition', label: bilingual('Holdings & Expense (TER)', 'Composición y Costo (TER)'), query: 'competitive moat & market share' },
    ],
    FIXED_INCOME: [
      { id: 'margins', label: bilingual('YTM & Coupon Profile', 'Rendimiento (YTM) y Cupón'), query: 'margins & revenue growth' },
      { id: 'risks', label: bilingual('Duration & DV01 Risk', 'Riesgo de Duración (DV01)'), query: 'key risk factors & bottlenecks' },
      { id: 'valuation', label: bilingual('Auction Demand (Bid/Cover)', 'Demanda en Subastas'), query: 'balance sheet cash flow & valuation' },
      { id: 'competition', label: bilingual('TIPS Breakeven & Curve', 'Inflación y Breakeven'), query: 'competitive moat & market share' },
    ],
    FX: [
      { id: 'margins', label: bilingual('Carry Differential (10Y)', 'Diferencial de Tasas (Carry)'), query: 'margins & revenue growth' },
      { id: 'risks', label: bilingual('Central Bank Intervention', 'Riesgo de Intervención BC'), query: 'key risk factors & bottlenecks' },
      { id: 'valuation', label: bilingual('Trade Balance & Flows', 'Balanza Comercial y Flujos'), query: 'balance sheet cash flow & valuation' },
      { id: 'competition', label: bilingual('Cross Parity & REER', 'Paridad y Valuación Real'), query: 'competitive moat & market share' },
    ],
    INDEX: [
      { id: 'margins', label: bilingual('Index EPS Growth YoY', 'Crecimiento Ganancias (EPS)'), query: 'margins & revenue growth' },
      { id: 'risks', label: bilingual('Macro & Rate Headwinds', 'Riesgos Macro y Tasas'), query: 'key risk factors & bottlenecks' },
      { id: 'valuation', label: bilingual('Index P/E & ERP', 'Múltiplos del Índice (P/E)'), query: 'balance sheet cash flow & valuation' },
      { id: 'competition', label: bilingual('Breadth & Sector Weights', 'Amplitud y Liderazgo Sectorial'), query: 'competitive moat & market share' },
    ],
    RATES: [
      { id: 'margins', label: bilingual('Curve Slope (2s10s / 3m10y)', 'Pendiente de Curva (2s10s)'), query: 'margins & revenue growth' },
      { id: 'risks', label: bilingual('Inflation & Fiscal Risk', 'Riesgo Inflacionario / Fiscal'), query: 'key risk factors & bottlenecks' },
      { id: 'valuation', label: bilingual('Real Yield & Term Premium', 'Tasa Real y Prima por Plazo'), query: 'balance sheet cash flow & valuation' },
      { id: 'competition', label: bilingual('Sovereign Spread vs UST', 'Spread Soberano vs. UST'), query: 'competitive moat & market share' },
    ],
  };
  return map[cat] || RAG_QUICK_TOPICS;
}

export function getAssetResearchBrief(sym = 'BTC') {
  if (ASSET_RESEARCH_BRIEFS[sym]) return ASSET_RESEARCH_BRIEFS[sym];

  const asset = getAssetBySymbol(sym);
  const isBull = (asset.chgNum || 0) >= -0.15;
  const cat = asset.cat;

  const sourceMap = {
    EQUITY: { EN: `SEC Form 10-K & 10-Q (${asset.sym})`, ES: `Reporte SEC Form 10-K y 10-Q (${asset.sym})` },
    INDEX: { EN: `Global Index Constituent Earnings & Macro Report`, ES: `Reporte de Ganancias y Macro del Índice` },
    ETF: { EN: `Institutional ETF Prospectus, AUM & Flow Report`, ES: `Prospecto Institucional, AUM y Flujos del ETF` },
    CRYPTO: { EN: `On-Chain Protocol, TVL & Derivatives Audit`, ES: `Auditoría On-Chain, TVL y Derivados del Protocolo` },
    RATES: { EN: `Central Bank Policy & Sovereign Debt Issuance Report`, ES: `Política Monetaria y Emisión Soberana` },
    FIXED_INCOME: { EN: `US Treasury Refunding & Auction Demand Report`, ES: `Subastas del Tesoro de EE.UU. y Demanda Primaria` },
    FX: { EN: `BIS Interbank FX Flow & Rate Differential Brief`, ES: `Flujo Interbancario BIS y Diferencial de Tasas` },
    COMMODITY: { EN: `CME/ICE Physical Inventory & Term Structure Report`, ES: `Inventarios Físicos CME/ICE y Estructura Temporal` },
    DERIVATIVES_VOL: { EN: `CBOE/CME Open Interest & Implied Volatility Surface`, ES: `Interés Abierto CBOE/CME y Superficie de Volatilidad` },
    CASH: { EN: `Federal Reserve Money Market & Overnight Liquidity Desk`, ES: `Mesa de Liquidez Overnight y Money Market` },
  };

  const filingSource = sourceMap[cat] || sourceMap.EQUITY;

  return {
    stance: isBull ? 'BULLISH' : 'BEARISH',
    stanceLabel: isBull
      ? { EN: `Constructive • Institutional Flow (${asset.sym})`, ES: `Constructivo • Flujo Institucional (${asset.sym})` }
      : { EN: `Defensive • Macro Headwinds (${asset.sym})`, ES: `Defensivo • Presión Macro (${asset.sym})` },
    filingSource,
    executiveSummary: {
      EN: `${asset.name} (${asset.sym}) is trading at ${asset.priceFormatted} (${asset.chg}) with ${asset.vol24h} in 24h institutional volume. Official ${cat} filings and market-structure metrics show ${isBull ? 'sustained institutional accumulation and constructive liquidity depth' : 'near-term consolidation and heightened sensitivity to macro rate repricing'}.`,
      ES: `${asset.name} (${asset.sym}) cotiza en ${asset.priceFormatted} (${asset.chg}) con ${asset.vol24h} de volumen institucional 24h. Los reportes oficiales de ${cat} y métricas de microestructura reflejan ${isBull ? 'acumulación institucional sostenida y profundidad de liquidez constructiva' : 'consolidación de corto plazo y mayor sensibilidad al reajuste de tasas macro'}.`,
    },
    bullDrivers: [
      {
        score: isBull ? 86 : 68,
        importance: 'HIGH',
        title: {
          EN: `Deep Institutional Liquidity (${asset.vol24h} 24h Vol)`,
          ES: `Alta Liquidez Institucional (${asset.vol24h} Vol 24h)`,
        },
        detail: {
          EN: `${asset.sym} maintains top-tier execution depth (${asset.volChg24h} vs 20d avg), minimizing institutional block slippage.`,
          ES: `${asset.sym} mantiene profundidad de ejecución líder (${asset.volChg24h} vs media 20d), minimizando el deslizamiento en bloques.`,
        },
      },
      {
        score: isBull ? 81 : 64,
        importance: 'HIGH',
        title: {
          EN: `Constructive Quantitative Momentum (RSI ${asset.indicators.rsi14})`,
          ES: `Momentum Cuantitativo Constructivo (RSI ${asset.indicators.rsi14})`,
        },
        detail: {
          EN: `Technical structure signals ${asset.indicators.macdSignal} with Bollinger bandwidth anchored at ${asset.indicators.bbWidth}.`,
          ES: `La estructura técnica señala ${asset.indicators.macdSignal} con ancho de banda Bollinger en ${asset.indicators.bbWidth}.`,
        },
      },
      {
        score: isBull ? 76 : 59,
        importance: 'MEDIUM',
        title: {
          EN: `Institutional Benchmark Allocation in ${cat}`,
          ES: `Asignación Institucional de Referencia en ${cat}`,
        },
        detail: {
          EN: `Core inclusion across systematic multi-asset portfolios supports steady passive and active rebalancing inflows.`,
          ES: `Su inclusión central en carteras multi-activo sistemáticas sostiene flujos constantes de rebalanceo.`,
        },
      },
      {
        score: isBull ? 72 : 55,
        importance: 'MEDIUM',
        title: {
          EN: `Resilient Fundamental & Yield Carry Profile`,
          ES: `Perfil Resiliente de Fundamentos y Carry`,
        },
        detail: {
          EN: `Underlying cash-flow / carry metrics compare favorably against ${cat} peer medians on a risk-adjusted basis.`,
          ES: `Las métricas subyacentes de flujo y carry superan la mediana de su categoría (${cat}) ajustada por riesgo.`,
        },
      },
      {
        score: isBull ? 67 : 51,
        importance: 'LOW',
        title: {
          EN: `Tight Cross-Venue Basis & Hedge Efficiency`,
          ES: `Eficiencia de Cobertura y Spread Ajustado`,
        },
        detail: {
          EN: `Liquid futures and options markets enable low-cost tail-risk hedging and delta-neutral overlays.`,
          ES: `La liquidez en derivados permite coberturas de riesgo de cola de bajo costo operativo.`,
        },
      },
    ],
    bearRisks: [
      {
        score: isBull ? 54 : 82,
        importance: 'HIGH',
        title: {
          EN: `Global Real-Rate & Sovereign Yield Sensitivity`,
          ES: `Sensibilidad a Tasas Reales y Curva Soberana`,
        },
        detail: {
          EN: `Abrupt shifts in US 10Y real yields or central bank terminal rate pricing can compress ${cat} valuation multiples.`,
          ES: `Cambios abruptos en tasas reales a 10 años o expectativas de bancos centrales presionan las valuaciones en ${cat}.`,
        },
      },
      {
        score: isBull ? 49 : 76,
        importance: 'HIGH',
        title: {
          EN: `Cross-Asset Volatility Contagion (VIX / MOVE)`,
          ES: `Contagio de Volatilidad Cruzada (VIX / MOVE)`,
        },
        detail: {
          EN: `Systematic de-risking across macro volatility indices can trigger correlated institutional outflows.`,
          ES: `Episodios de reducción de riesgo sistemático pueden gatillar salidas correlacionadas de flujo.`,
        },
      },
      {
        score: isBull ? 45 : 70,
        importance: 'MEDIUM',
        title: {
          EN: `Positioning Crowding & Gamma Unwind Risk`,
          ES: `Concentración de Posicionamiento y Desarme Gamma`,
        },
        detail: {
          EN: `Elevated institutional concentration in top-volume benchmarks amplifies short-term mean-reversion pullbacks.`,
          ES: `La alta concentración institucional en activos líderes amplifica correcciones tácticas de corto plazo.`,
        },
      },
      {
        score: isBull ? 41 : 64,
        importance: 'LOW',
        title: {
          EN: `Regulatory, Tariff & Geopolitical Headline Beta`,
          ES: `Riesgo Regulatorio, Arancelario y Geopolítico`,
        },
        detail: {
          EN: `Policy announcements and cross-border trade restrictions introduce episodic intraday spread widening.`,
          ES: `Anuncios regulatorios o comerciales pueden ampliar temporalmente los spreads intradía.`,
        },
      },
      {
        score: isBull ? 37 : 58,
        importance: 'LOW',
        title: {
          EN: `Intraday Liquidity Thinning Around Macro Releases`,
          ES: `Reducción de Liquidez en Eventos Macro (CPI/NFP)`,
        },
        detail: {
          EN: `Order-book depth temporarily compresses ahead of FOMC, CPI, and sovereign auction windows.`,
          ES: `La profundidad del libro de órdenes se reduce previo a anuncios de bancos centrales e inflación.`,
        },
      },
    ],
    qaKnowledge: {
      margins: {
        EN: `${asset.name} (${asset.sym}) Performance & Yield Profile: Trading at ${asset.priceFormatted} (${asset.chg}) with ${asset.vol24h} daily volume (${asset.volChg24h} vs 20d avg) and RSI(14) at ${asset.indicators.rsi14}.`,
        ES: `Perfil de Rendimiento y Flujo de ${asset.name} (${asset.sym}): Cotiza a ${asset.priceFormatted} (${asset.chg}) con ${asset.vol24h} de volumen diario (${asset.volChg24h} vs media 20d) y RSI(14) en ${asset.indicators.rsi14}.`,
      },
      risks: {
        EN: `Key Risk Factors (${asset.sym}): Primary downside drivers are macro real-yield repricing (-${isBull ? 54 : 82}), cross-asset volatility spikes in VIX/MOVE (-${isBull ? 49 : 76}), and positioning crowding (-${isBull ? 45 : 70}).`,
        ES: `Factores de Riesgo (${asset.sym}): Los principales riesgos son el reajuste de tasas reales (-${isBull ? 54 : 82}), picos de volatilidad en VIX/MOVE (-${isBull ? 49 : 76}) y concentración de posicionamiento (-${isBull ? 45 : 70}).`,
      },
      valuation: {
        EN: `Valuation & Liquidity (${asset.sym}): Market cap / institutional float stands at ${asset.marketCap !== '—' ? asset.marketCap : asset.vol24h + '/day'} with Bollinger volatility bandwidth at ${asset.indicators.bbWidth}.`,
        ES: `Valuación y Liquidez (${asset.sym}): Capitalización / liquidez institucional de ${asset.marketCap !== '—' ? asset.marketCap : asset.vol24h + '/día'} con ancho de banda de volatilidad Bollinger en ${asset.indicators.bbWidth}.`,
      },
      competition: {
        EN: `Benchmark Standing (${asset.sym}): Ranks #${asset.rank} in the global multi-asset universe within category ${cat}, serving as a primary institutional liquidity vehicle.`,
        ES: `Posición de Referencia (${asset.sym}): Ocupa el puesto #${asset.rank} en el universo global dentro de la categoría ${cat}, operando como vehículo líder de liquidez institucional.`,
      },
    },
  };
}

export function getAssetFinbertHeadlines(sym = 'BTC') {
  const direct = FINBERT_HEADLINES.filter((h) => h.sym === sym);
  if (direct.length > 0) return direct;

  const asset = getAssetBySymbol(sym);
  const isPos = (asset.chgNum || 0) >= 0;
  return [
    {
      id: `fb-synth-1-${sym}`,
      sym,
      score: isPos ? '+74' : '-62',
      scoreNum: isPos ? 0.74 : -0.62,
      importance: 'HIGH',
      probs: isPos ? { pos: 0.81, neu: 0.12, neg: 0.07 } : { pos: 0.11, neu: 0.16, neg: 0.73 },
      source: 'Bloomberg Terminal',
      time: '15:48',
      title: {
        EN: `${asset.name} (${sym}) sees ${asset.vol24h} in 24h institutional flow (${asset.volChg24h} vs 20d avg) as ${asset.cat} desks rebalance`,
        ES: `${asset.name} (${sym}) registra ${asset.vol24h} de volumen institucional (${asset.volChg24h} vs media 20d) por rebalanceo en ${asset.cat}`,
      },
    },
    {
      id: `fb-synth-2-${sym}`,
      sym,
      score: '+52',
      scoreNum: 0.52,
      importance: 'MEDIUM',
      probs: { pos: 0.68, neu: 0.2, neg: 0.12 },
      source: 'Reuters Institutional',
      time: '14:22',
      title: {
        EN: `Order-book depth on ${sym} (${asset.priceFormatted}) remains resilient with RSI(14) at ${asset.indicators.rsi14} (${asset.indicators.macdSignal})`,
        ES: `Profundidad de mercado en ${sym} (${asset.priceFormatted}) se mantiene firme con RSI(14) en ${asset.indicators.rsi14} (${asset.indicators.macdSignal})`,
      },
    },
    {
      id: `fb-synth-3-${sym}`,
      sym,
      score: '-38',
      scoreNum: -0.38,
      importance: 'LOW',
      probs: { pos: 0.18, neu: 0.26, neg: 0.56 },
      source: 'Macro Desk Wire',
      time: '12:55',
      title: {
        EN: `Cross-asset risk desks monitor sovereign yield curve shifts and ${asset.indicators.bbWidth} Bollinger width on ${sym}`,
        ES: `Mesas cuantitativas monitorean impacto de curvas soberanas y ancho Bollinger (${asset.indicators.bbWidth}) sobre ${sym}`,
      },
    },
  ];
}

export function getAssetLiveWirePool(sym = 'BTC') {
  if (LIVE_WIRE_POOL[sym]) return LIVE_WIRE_POOL[sym];
  const asset = getAssetBySymbol(sym);
  return [
    {
      scoreNum: 0.81,
      importance: 'HIGH',
      materiality: 'HIGH',
      probs: { pos: 0.86, neu: 0.09, neg: 0.05 },
      source: 'Bloomberg Live Wire',
      title: {
        EN: `FLASH: Institutional block accumulation in ${asset.name} (${sym}) accelerates +18% above 20-day average volume`,
        ES: `FLASH: Acumulación institucional en bloques de ${asset.name} (${sym}) acelera +18% sobre el volumen medio de 20 días`,
      },
      driverUpdate: {
        side: 'bull',
        score: 88,
        importance: 'HIGH',
        title: {
          EN: `Intraday Institutional Block Inflow (${sym})`,
          ES: `Entrada Institucional en Bloques Intradía (${sym})`,
        },
        detail: {
          EN: `Updated from Live Wire: Large institutional buy blocks absorbed top-of-book liquidity at ${asset.priceFormatted}.`,
          ES: `Actualizado por noticia: Bloques de compra institucional absorbieron liquidez en ${asset.priceFormatted}.`,
        },
      },
    },
    {
      scoreNum: -0.44,
      importance: 'MEDIUM',
      materiality: 'ROUTINE',
      probs: { pos: 0.16, neu: 0.24, neg: 0.6 },
      source: 'Reuters Macro Desk',
      title: {
        EN: `FLOW: Systematic options & futures dealers adjust short-term gamma hedges around ${sym} (${asset.priceFormatted})`,
        ES: `FLUJO: Dealers sistemáticos ajustan coberturas gamma de corto plazo en torno a ${sym} (${asset.priceFormatted})`,
      },
    },
  ];
}

/**
 * Multi-Layer Guardrail & Intent Classifier for the Official Filing Q&A Engine.
 * Prevents gibberish ("mmmmmm"), keyboard mashing ("asdfg"), prompt injections,
 * and off-topic queries from ever generating fake or nonsensical answers.
 */
export async function executeSec10kRagQuery({ query = '', ticker = 'BTC', langCode = 'EN' }) {
  const sym = ticker && ticker !== 'ALL' ? ticker : 'BTC';
  const brief = getAssetResearchBrief(sym);
  const rawQuery = query.trim();
  const q = rawQuery.toLowerCase();
  setActiveViewLang(langCode);
  const isES = langCode === 'ES';

  // =========================================================================
  // GUARDRAIL LAYER 1: Empty, Too Short, Repeated Chars ("mmmmmm"), Gibberish
  // =========================================================================
  const alphaOnly = q.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ]/g, '');
  const hasRepeatedChars = /(.)\1{3,}/i.test(q); // e.g., "mmmm", "aaaa", "1111"
  const hasVowels = /[aeiouáéíóú]/i.test(alphaOnly);
  const hasImpossibleConsonants = /[bcdfghjklmnpqrstvwxyz]{5,}/i.test(alphaOnly);
  const isKeyboardMash = /^(asdf|qwer|zxcv|hjkl|jkli|bnm|poiuy|lkjh)/i.test(alphaOnly);

  if (
    alphaOnly.length < 3 ||
    hasRepeatedChars ||
    !hasVowels ||
    hasImpossibleConsonants ||
    isKeyboardMash
  ) {
    return {
      blocked: true,
      query: rawQuery,
      topicLabel: tx('GUARDRAIL ACTIVO • ENTRADA INVÁLIDA', 'GUARDRAIL ACTIVE • INVALID INPUT'),
      answer: txTpl("Consulta rechazada por el guardrail de validación: \"{0}\" no es una pregunta financiera válida. Por favor consultá sobre métricas auditadas del reporte de {1}: Ingresos y Márgenes, Factores de Riesgo, Flujo de Caja / Balance, CAPEX o Posición Competitiva.", [rawQuery, sym], "Query blocked by input validation guardrail: \"{0}\" is not a valid financial question. Please ask about verifiable sections of {1}’s official filings: Revenue & Margins, Key Risk Factors, Cash Flow & Balance Sheet, CAPEX, or Competitive Moat.", [rawQuery, sym]),
    };
  }

  // =========================================================================
  // GUARDRAIL LAYER 2: Prompt Injection & Off-Topic Non-Financial Filter
  // =========================================================================
  const injectionOrOffTopicPattern =
    /(ignore previous|olvida|instrucciones|system prompt|jailbreak|act as|actua como|receta|futbol|soccer|chiste|joke|poem|poema|hola|hello|buenos dias|como estas|quien sos|who are you|pelotud|mierda|fuck|shit)/i;

  if (injectionOrOffTopicPattern.test(q)) {
    return {
      blocked: true,
      query: rawQuery,
      topicLabel: tx('GUARDRAIL DE DOMINIO • FUERA DE ALCANCE', 'DOMAIN GUARDRAIL • OUT OF SCOPE'),
      answer: txTpl("Guardrail de dominio activado: Este asistente está estrictamente restringido a los reportes oficiales ({0}) de {1}. No responde conversación general ni temas fuera del análisis fundamental del activo.", [brief.filingSource.ES, sym], "Domain guardrail triggered: This assistant is strictly scoped to {0}’s official filings ({1}). General chat and off-topic requests are blocked.", [sym, brief.filingSource.EN]),
    };
  }

  // =========================================================================
  // LIVE P-07 CLOUD RUN RAG PROBE (WITH DETERMINISTIC LOCAL FALLBACK)
  // =========================================================================
  try {
    const res = await fetch('/cloud/p07/api/v1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: rawQuery, ticker: sym, top_k: 3 }),
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const liveRag = await res.json();
      if (liveRag?.answer && typeof liveRag.answer === 'string' && liveRag.answer.length > 20) {
        return {
          blocked: false,
          query: rawQuery,
          topicLabel: tx('P-07 RAG HÍBRIDO EN VIVO', 'LIVE P-07 HYBRID RAG'),
          answer: liveRag.answer,
          source: 'LIVE • P-07 Cloud Run',
        };
      }
    }
  } catch {
    // Graceful zero-latency fallback to verified local filing index
  }

  // =========================================================================
  // GUARDRAIL LAYER 3: Strict Financial Domain Intent Classification (All 10 Asset Classes)
  // =========================================================================
  const qa = brief.qaKnowledge;

  const isCompetitionIntent =
    /\b(competition|competitive|comp|moat|foso|market share|share|cuota|dominance|dominancia|rival|peers|amd|competidores|ventaja|ecosystem|ecosistema|retencion|retention|cuda|nvlink|tpu|trainium|firedancer|rollup|l2|layer-2|tbill|tbills|industrial|demand|demanda|straddle|breakeven|ter|yield|dividend|tips|reer|parity|breadth|amplitud|sovereign|soberano)\b/i.test(
      q
    );
  const isRisksIntent =
    /\b(risk|risks|riesgo|riesgos|bear|peligro|amenaza|problem|caida|drop|downside|fondeo|funding|liquidat|liquidations|liquidacion|regul|regulatory|antitrust|doj|ftc|dma|tariff|arancel|bottleneck|bottlenecks|cuello|cowos|1a|depreciat|inflacion|inflation|fiscal|dilution|dilucion|congestion|spread|weather|clima|geopolit|gamma|gex|pinning|concentration|concentracion|dv01|duration|duracion|intervention|intervencion|macro|rates)\b/i.test(
      q
    );
  const isValuationIntent =
    /\b(valuation|valuacion|valoracion|cash|caja|deuda|debt|pe|p\/e|multiplo|múltiplo|multiple|liquidez|liquidity|balance|reserve|reserves|reserva|supply|oferta|circulante|float|backlog|rpo|buyback|recompra|fcf|free cash|tvl|staking|emision|issuance|13f|custody|custodia|item 8|repo|rrp|roll|contango|backwardation|open interest|tracking|nav|auction|subasta|bid to cover|trade|comercial|real yield|tasa real)\b/i.test(
      q
    );
  const isMarginsOrGrowthIntent =
    /\b(bull|growth|crecimiento|margin|margins|margen|márgenes|revenue|ingresos|ingreso|venta|sales|ganancia|profit|ebitda|eps|utilidad|capex|ai|ia|cloud|data center|blackwell|hopper|azure|aws|services|servicios|etf|inflow|inflows|flujo|flows|aum|item 7|md&a|driver|drivers|motor|catalizador|fed|corridor|sofr|effr|inventory|inventarios|iv|surface|skew|ytm|coupon|cupon|carry|differential|slope|2s10s|3m10y|curve|curva)\b/i.test(
      q
    );
  const isExecutiveSummaryIntent =
    /\b(summary|resumen|thesis|tesis|stance|postura|overview|panorama|10-k|10k|filing|reporte|que opinas|outlook|perspectiva)\b/i.test(
      q
    );

  if (isCompetitionIntent) {
    return {
      blocked: false,
      query: rawQuery,
      topicLabel: tx('Posición Competitiva y Cuota de Mercado', 'Competitive Moat & Market Share'),
      answer: qa.competition[langCode] || qa.competition.EN,
    };
  }

  if (isRisksIntent) {
    return {
      blocked: false,
      query: rawQuery,
      topicLabel: tx('Factores de Riesgo (Bear Case)', 'Key Risk Factors (Bear Case)'),
      answer: qa.risks[langCode] || qa.risks.EN,
    };
  }

  if (isValuationIntent) {
    return {
      blocked: false,
      query: rawQuery,
      topicLabel: tx('Balance, Caja y Valuación', 'Balance Sheet, Cash Flow & Valuation'),
      answer: qa.valuation[langCode] || qa.valuation.EN,
    };
  }

  if (isMarginsOrGrowthIntent) {
    return {
      blocked: false,
      query: rawQuery,
      topicLabel: tx('Motores, Ingresos y Márgenes', 'Revenue, Growth & Margins'),
      answer: qa.margins[langCode] || qa.margins.EN,
    };
  }

  if (isExecutiveSummaryIntent) {
    return {
      blocked: false,
      query: rawQuery,
      topicLabel: tx('Síntesis Oficial del Reporte', 'Official Filing Synthesis'),
      answer: brief.executiveSummary[langCode] || brief.executiveSummary.EN,
    };
  }

  // If the query passed Layer 1 & 2 but contains NO recognizable financial/filing concept:
  // Block it rather than hallucinating or echoing nonsense!
  return {
    blocked: true,
    query: rawQuery,
    topicLabel: tx('GUARDRAIL ESTRICTO • CONCEPTO NO INDEXADO', 'STRICT GUARDRAIL • UNINDEXED TOPIC'),
    answer: txTpl("No se encontró evidencia sobre \"{0}\" dentro del reporte oficial ({1}) de {2}. El guardrail bloquea respuestas especulativas. Probá consultar por: Márgenes e Ingresos, Factores de Riesgo, Caja y Valuación, o Competencia.", [rawQuery, brief.filingSource.ES, sym], "No evidence found for \"{0}\" inside {1}’s official filing ({2}). Speculative answers are blocked by guardrail. Try asking about: Revenue & Margins, Key Risk Factors, Cash Flow & Valuation, or Competition.", [rawQuery, sym, brief.filingSource.EN]),
  };
}
