import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// SINGLE=1 собирает один HTML-файл (для публикации как артефакт)
const single = process.env.SINGLE === '1'

/** В режиме разработки отдаёт /api/lead из api/lead.js (на Vercel это делает сама платформа) */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))
      server.middlewares.use('/api/lead', async (req, res) => {
        const mod = await server.ssrLoadModule('/api/lead.js')
        await mod.default(req, res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApi(), ...(single ? [viteSingleFile()] : [])],
  build: { assetsInlineLimit: single ? 100_000_000 : 4096, chunkSizeWarningLimit: 2500 },
})
