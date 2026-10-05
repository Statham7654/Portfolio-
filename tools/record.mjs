// Ролики работ: покадрово выставляем прокрутку (с плавным ускорением/замедлением) и склеиваем кадры в видео.
// node tools/record.mjs  →  raw/<name>/f_###.png
import { createRequire } from 'module'
import { mkdirSync } from 'fs'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PW_PATH)
const SITES = [ // имя, адрес, сколько экранов прокрутить
  ['fade', 'http://127.0.0.1:5911/', 2.4], ['noire', 'http://127.0.0.1:5922/', 1.6], ['blackjack', 'http://127.0.0.1:5933/', 1.6],
  ['section', 'http://127.0.0.1:5944/', 1.4], ['ushakov', 'http://127.0.0.1:5955/', 1.6],
]
const N = 72
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
for (const [name, url, screens] of SITES) {
  mkdirSync(`raw/${name}`, { recursive: true })
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } })
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(9000)
  for (let i = 0; i < N; i++) {
    const y = ease(i / (N - 1)) * screens * 800
    await p.evaluate((y) => { const l = window.__lenis; l ? l.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y) }, y)
    await p.waitForTimeout(120)
    await p.screenshot({ path: `raw/${name}/f_${String(i).padStart(3, '0')}.png` })
  }
  console.log(name, 'done'); await p.close()
}
await b.close()
