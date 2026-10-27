import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
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
    },
  },
})
