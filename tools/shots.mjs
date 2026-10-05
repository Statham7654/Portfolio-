// Снимки всех секций: node tools/shots.mjs [d|m] [outDir]
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PW_PATH)
const mode = process.argv[2] || 'd', out = process.argv[3] || 'tools/out'
const m = mode === 'm'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const p = await (await b.newContext({ viewport: m ? { width: 390, height: 844 } : { width: 1440, height: 900 }, isMobile: m, hasTouch: m })).newPage()
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (x) => x.type() === 'error' && errs.push(x.text().slice(0, 200)))
await p.goto(process.env.URL || 'http://127.0.0.1:5530/', { waitUntil: 'load' })
await p.waitForFunction(() => { const l = document.querySelector('[data-l="num"]'); return !l || getComputedStyle(l.closest('.fixed')).display === 'none' }, null, { timeout: 90000 })
await p.waitForTimeout(2500); await p.screenshot({ path: `${out}/${mode}-00-hero.png`, timeout: 120000 })
const ids = ['#works', '#services', '#process', '#pricing', '#why', '#cta', '#contact']
for (const [k, id] of ids.entries()) {
  for (const f of id === '#works' ? [0.15, 0.45, 0.97] : id === '#process' ? [0, 0.6] : [0]) {
    await p.evaluate(([id, f]) => { const el = document.querySelector(id); const y = el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * f + (f ? 0 : 60); window.__lenis.scrollTo(Math.max(0, y), { immediate: true, force: true }) }, [id, f])
    await p.waitForTimeout(id === '#works' ? 4000 : 2600)
    await p.screenshot({ path: `${out}/${mode}-${String(k + 1).padStart(2, '0')}-${id.slice(1)}${f ? '-b' : ''}.png`, timeout: 120000 })
  }
}
console.log(errs.length ? errs.join('\n') : 'no errors')
await b.close()
