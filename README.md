# QuantLambda — Quantitative Market Intelligence & Multi-Agent Terminal (`quantlambda.dev`)

[![Live Platform](https://img.shields.io/badge/Live_Platform-quantlambda.dev-10b981?style=flat-square&logo=googlecloud&logoColor=white)](https://quantlambda.dev)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Localization](https://img.shields.io/badge/i18n-56_Languages-38bdf8?style=flat-square)](https://quantlambda.dev)

Unified institutional-grade web terminal for [**`quantlambda.dev`**](https://quantlambda.dev): integrating real-time macro & cross-asset market telemetry, quantitative portfolio optimization (`CVaR`, `HRP`, `Black-Litterman`), hybrid financial RAG, and a 6-agent AI investment committee across 13 Google Cloud Platform microservices (`P-01` – `P-11`).

---

## 1. Platform Capabilities & Workspaces

| Workspace | Core Capabilities | Backend Services Integrated |
| :--- | :--- | :--- |
| **1. Overview & Regime Telemetry** | Global macro regime radar, cross-asset volatility indices, live equity/FX/crypto feeds, and statistical anomaly alerts. | `P-01`, `P-02`, `P-03`, `P-05`, `P-06` |
| **2. Portfolio Lab & Risk Engine** | Efficient frontier synthesis, Hierarchical Risk Parity (`HRP`), Conditional Value-at-Risk (`CVaR`), Black-Litterman views, and historical stress-testing. | `P-01`, `P-05`, `P-08` |
| **3. Intelligence & Hybrid RAG** | FinBERT news sentiment stream, SEC filing & macro report semantic search (`Qdrant` + `MongoDB`), and tool-calling research synthesis. | `P-04`, `P-07`, `P-08`, `P-09` |
| **4. Multi-Agent Investment Committee** | Autonomous 6-agent deliberation (*Macro, Quant, Fundamental, Sentiment, Technical, Risk Veto*) with deterministic guardrails and audit trails. | `P-09`, `P-10`, `P-11` |
| **5. System Architecture & Telemetry** | Live health status, latency metrics, and interactive architectural blueprint across all 13 GCP microservices. | `portfolio-infra` + `P-01..P-11` |

---

## 2. Distributed Backend Ecosystem (`P-01` – `P-11`)

- [**`P-01 · financial-markets-pipeline`**](https://github.com/ale-camer/financial-markets-pipeline): Daily batch ingestion (Airflow, PostgreSQL, Pydantic, GCS).
- [**`P-02 · crypto-analytics-platform`**](https://github.com/ale-camer/crypto-analytics-platform): High-throughput crypto analytics lakehouse (Polars, BigQuery, Airflow, Terraform).
- [**`P-03 · real-time-market-events`**](https://github.com/ale-camer/real-time-market-events): Low-latency streaming event processor (Kafka, Faust, TimescaleDB).
- [**`P-04 · financial-news-intelligence-api`**](https://github.com/ale-camer/financial-news-intelligence-api): Financial news ingestion, FinBERT sentiment & NER (FastAPI, MongoDB).
- [**`P-05 · market-intelligence-hub`**](https://github.com/ale-camer/market-intelligence-hub): Unified analytical warehouse & serving API (Kafka, dbt, BigQuery, FastAPI).
- [**`P-06 · asset-anomaly-detection`**](https://github.com/ale-camer/asset-anomaly-detection): Cross-asset statistical & ML anomaly detection (Isolation Forest, Z-Score).
- [**`P-07 · financial-documents-rag`**](https://github.com/ale-camer/financial-documents-rag): Hybrid semantic + lexical RAG over SEC filings (Qdrant, MongoDB, FastAPI).
- [**`P-08 · ai-powered-market-intelligence`**](https://github.com/ale-camer/ai-powered-market-intelligence): Vector-enriched market intelligence pipeline (`pgvector`, Airflow, FastAPI).
- [**`P-09 · financial-research-agent`**](https://github.com/ale-camer/financial-research-agent): Tool-calling quantitative & fundamental financial research agent.
- [**`P-10 · autonomous-trading-analyst`**](https://github.com/ale-camer/autonomous-trading-analyst): Autonomous ReAct trading analyst with deterministic risk guardrails.
- [**`P-11 · multi-agent-market-intelligence`**](https://github.com/ale-camer/multi-agent-market-intelligence): Multi-agent investment committee orchestrator with consensus & risk veto.
- [**`IaC · portfolio-infra`**](https://github.com/ale-camer/portfolio-infra): Centralized GCP Terraform IaC and CI/CD automation.

---

## 3. Local Development & Cloud Run Deployment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run static analysis (Oxlint)
npm run lint

# Build production bundle
npm run build
```

Deployed as a scale-to-zero container (`Dockerfile` + `nginx.conf`) on Google Cloud Run (`us-central1`) serving [**`https://quantlambda.dev`**](https://quantlambda.dev).
