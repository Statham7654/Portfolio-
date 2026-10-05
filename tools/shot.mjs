// Быстрый снимок: node tools/shot.mjs <out.png> [w] [h] [selector|y] [mobile]
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PW_PATH)
const [out, w = 1440, h = 900, target = '', mob = ''] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const m = mob === 'm'
const p = await (await b.newContext({ viewport: { width: +w, height: +h }, isMobile: m, hasTouch: m })).newPage()
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (x) => x.type() === 'error' && errs.push(x.text().slice(0, 200)))
await p.goto(process.env.URL || 'http://127.0.0.1:5530/', { waitUntil: 'load' })
await p.waitForFunction(() => { const l = document.querySelector('[data-l="num"]'); return !l || getComputedStyle(l.closest('.fixed')).display === 'none' }, null, { timeout: 90000 })
if (target) await p.evaluate((t) => { const y = /^\d/.test(t) ? +t : document.querySelector(t).getBoundingClientRect().top + scrollY; window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y) }, target)
await p.waitForTimeout(+(process.env.WAIT || 3500))
await p.screenshot({ path: out, timeout: 120000 })
console.log(errs.length ? errs.join('\n') : 'ok')
await b.close()
