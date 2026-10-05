// Интерактивные проверки: node tools/qa.mjs  (PW_PATH=<путь к playwright>, URL=...)
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PW_PATH)
const URL = process.env.URL || 'http://127.0.0.1:5530/', out = 'tools/out'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const res = []; const ok = (name, v, extra = '') => { res.push(`${v ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`) }
const loaded = (p) => p.waitForFunction(() => { const l = document.querySelector('[data-l="num"]'); return !l || getComputedStyle(l.closest('.fixed')).display === 'none' }, null, { timeout: 90000 })
const to = (p, sel) => p.evaluate((s) => { const el = document.querySelector(s); const y = el.getBoundingClientRect().top + scrollY - 40; window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y) }, sel)

async function page(opts) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage()
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (x) => x.type() === 'error' && errs.push(x.text().slice(0, 160)))
  const t = Date.now(); await p.goto(URL, { waitUntil: 'load' }); await loaded(p)
  return { p, errs, t: Date.now() - t }
}

// ---------- Desktop ----------
{
  const { p, errs, t } = await page({ viewport: { width: 1440, height: 900 } })
  ok('loader finishes', true, `${t} ms`)
  ok('hero canvas rendered', await p.locator('#top canvas').count() > 0)
  ok('custom cursor active', await p.evaluate(() => document.documentElement.classList.contains('has-cursor')))
  ok('h1 text', (await p.locator('h1').getAttribute('aria-label'))?.includes('дороже'))
  // nav click → services
  await p.getByRole('navigation', { name: 'Главная навигация' }).getByText('Цена').click(); await p.waitForTimeout(2200)
  ok('nav scrolls to pricing', await p.evaluate(() => Math.abs(document.querySelector('#pricing').getBoundingClientRect().top) < 140))
  ok('header turns glass on scroll', await p.evaluate(() => !!document.querySelector('header .glass, header [class*="backdrop"]')))
  // works → case
  await to(p, '#works'); await p.waitForTimeout(1200)
  await p.locator('#works article').first().click(); await p.waitForTimeout(1600)
  ok('card opens case (hash)', (await p.evaluate(() => location.hash)) === '#work/fade-district', await p.evaluate(() => location.hash))
  const dlg = p.getByRole('dialog', { name: /Кейс/ })
  ok('case dialog visible', await dlg.isVisible())
  for (const h of ['О проекте', 'Задача', 'Решение', 'Технологии', 'Результат']) ok(`case has «${h}»`, await dlg.getByText(h, { exact: false }).first().isVisible().catch(() => false) || await dlg.getByText(h).count() > 0)
  await p.screenshot({ path: `${out}/qa-case-top.png` })
  await dlg.evaluate((d) => { const s = d.querySelector('[data-lenis-prevent]') || d; s.scrollTop = s.scrollHeight }); await p.waitForTimeout(1500)
  await p.screenshot({ path: `${out}/qa-case-end.png` })
  await dlg.getByText('Следующий проект').click(); await p.waitForTimeout(1500)
  ok('next project', (await p.evaluate(() => location.hash)) === '#work/noire-coffee', await p.evaluate(() => location.hash))
  await p.keyboard.press('Escape'); await p.waitForTimeout(1200)
  ok('Esc closes case', !(await p.getByRole('dialog', { name: /Кейс/ }).count()) && !(await p.evaluate(() => location.hash)).includes('work'))
  // concept case
  await p.evaluate(() => { location.hash = '#work/automotive' }); await p.waitForTimeout(1500)
  ok('deep link opens concept', await p.getByRole('dialog', { name: /VELOCE/ }).isVisible().catch(() => false))
  await p.screenshot({ path: `${out}/qa-case-concept.png` })
  await p.getByRole('button', { name: 'Закрыть кейс' }).click(); await p.waitForTimeout(1200)
  ok('close button', !(await p.getByRole('dialog', { name: /Кейс/ }).count()))
  // services hover
  await to(p, '#services'); await p.waitForTimeout(1200)
  await p.locator('#services li button').nth(3).hover(); await p.waitForTimeout(900)
  ok('services hover switches preview', /service 04/i.test(await p.locator('#services').innerText()))
  // pricing
  await to(p, '#pricing'); await p.waitForTimeout(1500)
  const pr = await p.locator('#pricing').innerText()
  ok('prices 7 000 / 15 000 / 25 000', ['7 000', '15 000', '25 000'].every((s) => pr.includes(s)))
  // contact form
  await to(p, '#contact'); await p.waitForTimeout(1200)
  const submit = p.locator('#contact button[type=submit]')
  ok('submit disabled when empty', await submit.isDisabled())
  await p.fill('#contact input[autocomplete=name]', 'Анна'); await p.fill('#contact input[placeholder^="Telegram"]', '@anna'); await p.fill('#contact textarea', 'Нужен сайт для кофейни')
  ok('submit enabled when valid', await submit.isEnabled())
  await submit.click(); await p.waitForTimeout(1600)
  ok('form sent state', await p.locator('#contact [role=status]').isVisible())
  ok('no console errors (desktop)', errs.length === 0, errs.join(' | '))
  await p.context().close()
}

// ---------- Mobile ----------
{
  const { p, errs } = await page({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  ok('no custom cursor on touch', !(await p.evaluate(() => document.documentElement.classList.contains('has-cursor'))))
  await p.getByRole('button', { name: 'Открыть меню' }).click(); await p.waitForTimeout(1300)
  const menu = p.locator('#menu')
  ok('mobile menu opens', await menu.isVisible())
  await p.screenshot({ path: `${out}/qa-m-menu.png` })
  await menu.getByText('Процесс').first().click(); await p.waitForTimeout(2200)
  ok('menu link navigates + closes', !(await menu.isVisible().catch(() => false)) && await p.evaluate(() => Math.abs(document.querySelector('#process').getBoundingClientRect().top) < 160))
  await to(p, '#works'); await p.waitForTimeout(1500)
  await p.locator('#works article').nth(1).tap(); await p.waitForTimeout(1600)
  await p.screenshot({ path: `${out}/qa-m-case.png` })
  ok('mobile case opens', await p.getByRole('dialog', { name: /Кейс/ }).isVisible())
  await p.keyboard.press('Escape'); await p.waitForTimeout(800)
  ok('no console errors (mobile)', errs.length === 0, errs.join(' | '))
  await p.context().close()
}

// ---------- Reduced motion ----------
{
  const { p, errs, t } = await page({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
  ok('reduced motion loads', true, `${t} ms`)
  await to(p, '#cta'); await p.waitForTimeout(800)
  ok('reduced: CTA heading visible', await p.locator('#cta h2').isVisible())
  ok('no console errors (reduced)', errs.length === 0, errs.join(' | '))
  await p.context().close()
}
await b.close()
console.log(res.join('\n'))
console.log(res.filter((r) => r.startsWith('FAIL')).length ? 'HAS FAILURES' : 'ALL PASS')
