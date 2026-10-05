import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// SINGLE=1 собирает один HTML-файл (для публикации как артефакт)
const single = process.env.SINGLE === '1'

/** В режиме разработки отдаёт /api/lead из api/lead.ts (на Vercel это делает сама платформа) */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))
      server.middlewares.use('/api/lead', async (req, res) => {
        const chunks: Buffer[] = []
        for await (const c of req) chunks.push(c as Buffer)
        const mod = await server.ssrLoadModule('/api/lead.ts')
        const handler = req.method === 'POST' ? mod.POST : mod.GET
        const r: Response = await handler(new Request('http://localhost/api/lead', { method: req.method, headers: { 'Content-Type': 'application/json' }, body: req.method === 'POST' ? Buffer.concat(chunks) : undefined }))
        res.statusCode = r.status
        r.headers.forEach((v, k) => res.setHeader(k, v))
        res.end(await r.text())
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApi(), ...(single ? [viteSingleFile()] : [])],
  build: { assetsInlineLimit: single ? 100_000_000 : 4096, chunkSizeWarningLimit: 2500 },
})
