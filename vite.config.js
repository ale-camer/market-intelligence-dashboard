import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const yahooChartCache = new Map()

function yahooChartProxyPlugin() {
  return {
    name: 'yahoo-chart-proxy',
    configureServer(server) {
      server.middlewares.use('/cloud/yahoo-chart', async (req, res) => {
        try {
          const pathAndQuery = req.url || ''
          const cached = yahooChartCache.get(pathAndQuery)
          if (cached && Date.now() - cached.ts < 120_000) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(cached.body)
            return
          }
          const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart${pathAndQuery}`
          const upstream = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          })
          const body = await upstream.text()
          if (upstream.ok) {
            yahooChartCache.set(pathAndQuery, { ts: Date.now(), body })
          }
          res.statusCode = upstream.status
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(body)
        } catch (err) {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), yahooChartProxyPlugin()],
  server: {
    watch: {
      ignored: ['**/public/guide/**', '**/public/locales/**'],
    },
    proxy: {
      '/cloud/p03': {
        target: 'https://p03-market-events-obaffww4hq-uc.a.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloud\/p03/, ''),
      },
      '/cloud/p05': {
        target: 'https://p05-hub-api-obaffww4hq-uc.a.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloud\/p05/, ''),
      },
      '/cloud/p06': {
        target: 'https://p06-anomaly-api-obaffww4hq-uc.a.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloud\/p06/, ''),
      },
      '/cloud/p07': {
        target: 'https://p07-docs-rag-obaffww4hq-uc.a.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloud\/p07/, ''),
      },
      '/cloud/p08': {
        target: 'https://p08-market-intel-obaffww4hq-uc.a.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloud\/p08/, ''),
      },
      '/cloud/p09': {
        target: 'https://p09-research-agent-obaffww4hq-uc.a.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloud\/p09/, ''),
      },
      '/cloud/p10': {
        target: 'https://p10-trading-analyst-obaffww4hq-uc.a.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloud\/p10/, ''),
      },
      '/cloud/p11': {
        target: 'https://p11-multi-agent-obaffww4hq-uc.a.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloud\/p11/, ''),
      },
      '/cloud/yahoo-rss': {
        target: 'https://feeds.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloud\/yahoo-rss/, '/rss/2.0/headline'),
      },
    },
  },
})
