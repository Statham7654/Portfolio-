import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { BRAND } from '../config/site'
import { hero } from '../lib/store'
import { canWebGL, reducedMotion } from '../lib/env'
import { lockScroll } from '../lib/motion'

/**
 * Загрузка: в центре «видоискатель» сходится к имени, счётчик 000→100 идёт по реальной готовности (шрифты + 3D),
 * затем уголки разлетаются к краям экрана и «открывают кадр» — сайт.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reducedMotion) { onDone(); root.current?.remove(); return }
    lockScroll(true)
    const num = root.current!.querySelector('[data-l="num"]')!, st = { v: 0 }
    const draw = (to: number, d: number) => gsap.to(st, { v: to, duration: d, ease: 'power2.inOut', onUpdate: () => { num.textContent = String(Math.round(st.v)).padStart(3, '0') } })
    const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2500))])
    const scene = new Promise<void>((res) => { if (!canWebGL) return res(); const t0 = performance.now(); const id = setInterval(() => { if (hero.ready || performance.now() - t0 > 4000) { clearInterval(id); res() } }, 60) })
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-l="c"]', { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.04 })
      gsap.fromTo('[data-l="name"]', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', delay: 0.2 })
      const head = draw(82, 1.1)
      Promise.all([fonts, scene, head.then()]).then(() => {
        gsap.timeline()
          .add(draw(100, 0.4))
          .to('[data-l="name"], [data-l="num"]', { yPercent: -110, duration: 0.6, ease: 'expo.in' }, '+=0.05')
          .to('[data-l="box"]', { width: '100vw', height: '100svh', duration: 1, ease: 'expo.inOut' }, '-=0.15')
          .add(() => onDone(), '-=0.45')
          .to(root.current, { opacity: 0, duration: 0.5 }, '-=0.25')
          .add(() => { lockScroll(false); root.current?.style.setProperty('display', 'none') })
      })
    }, root)
    return () => ctx.revert()
  }, [onDone])

  const c = 'absolute h-5 w-5 border-ink'
  return (
    <div ref={root} aria-hidden className="fixed inset-0 z-[100] grid place-items-center bg-void">
      <div data-l="box" className="relative grid h-[120px] w-[min(340px,80vw)] place-items-center">
        <span data-l="c" className={`${c} left-0 top-0 border-l border-t`} /><span data-l="c" className={`${c} right-0 top-0 border-r border-t`} />
        <span data-l="c" className={`${c} bottom-0 left-0 border-b border-l`} /><span data-l="c" className={`${c} bottom-0 right-0 border-b border-r`} />
        <div className="flex items-baseline gap-4 overflow-hidden">
          <span data-l="name" className="inline-block text-[22px] font-semibold tracking-[0.08em]">{BRAND.name}</span>
          <span data-l="num" className="mono inline-block text-signal">000</span>
        </div>
      </div>
    </div>
  )
}
