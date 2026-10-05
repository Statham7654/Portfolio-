import { useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { CTA as T } from '../config/site'
import { Button } from '../components/ui'
import { openBrief } from '../components/Nav'
import { EASE } from '../lib/motion'
import { isCoarse, reducedMotion } from '../lib/env'

/**
 * Интерактивный фон: поле точек. У курсора точки растут и загораются лаймом, по полю идёт медленная волна.
 * На телефоне — реже сетка и только волна. Рисуется только пока секция видна.
 */
function DotField() {
  const cv = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = cv.current!, g = c.getContext('2d')!
    let w = 0, h = 0, dpr = 1, raf = 0, vis = false, mx = -9999, my = -9999, tx = -9999, ty = -9999
    const step = isCoarse ? 30 : 24
    const resize = () => { dpr = Math.min(2, devicePixelRatio); w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0) }
    const frame = (t: number) => {
      raf = 0
      if (!vis) return
      mx += (tx - mx) * 0.12; my += (ty - my) * 0.12
      g.clearRect(0, 0, w, h)
      for (let y = step / 2; y < h; y += step) for (let x = step / 2; x < w; x += step) {
        const d = Math.hypot(x - mx, y - my), near = Math.max(0, 1 - d / 220)
        const wave = reducedMotion ? 0 : (Math.sin(x * 0.012 + y * 0.008 - t * 0.0012) + 1) / 2
        const r = 0.8 + wave * 0.7 + near * 3.2
        g.fillStyle = near > 0.05 ? `rgba(212,255,90,${0.25 + near * 0.75})` : `rgba(255,255,255,${0.08 + wave * 0.1})`
        g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill()
      }
      if (!reducedMotion) raf = requestAnimationFrame(frame)
    }
    const kick = () => { if (!raf && vis) raf = requestAnimationFrame(frame) }
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; kick() }
    const leave = () => { tx = ty = -9999 }
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; kick() })
    resize(); io.observe(c); addEventListener('resize', resize)
    if (!isCoarse) { c.parentElement!.addEventListener('pointermove', move); c.parentElement!.addEventListener('pointerleave', leave) }
    return () => { io.disconnect(); removeEventListener('resize', resize); cancelAnimationFrame(raf); c.parentElement?.removeEventListener('pointermove', move); c.parentElement?.removeEventListener('pointerleave', leave) }
  }, [])
  return <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
}

export default function CTA() {
  const head = useRef<HTMLHeadingElement>(null)
  const inView = useInView(head, { once: true, margin: '-10% 0px' })
  return (
    <section id="cta" className="relative isolate overflow-hidden border-t border-white/[0.06] py-32 sm:py-48">
      <div className="absolute inset-0 -z-10"><DotField /></div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_50%,transparent,#050506_85%)]" />
      <div className="wrap text-center">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mono text-muted"><span className="text-signal">06</span> · Следующий шаг</motion.p>
        <h2 ref={head} className="display mx-auto mt-8 text-[clamp(44px,9vw,160px)]">
          {T.title.map((l, i) => (
            <span key={i} className="line-mask"><motion.span className={`block ${i === T.title.length - 1 ? 'chrome' : ''}`} initial={{ y: '110%' }} animate={inView ? { y: '0%' } : {}} transition={{ duration: 1.2, delay: i * 0.1, ease: EASE }}>{l}</motion.span></span>
          ))}
        </h2>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4, ease: EASE }} className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-muted sm:text-[19px]">{T.text}</motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.55, ease: EASE }} className="mt-12">
          <Button size="lg" variant="signal" onClick={() => openBrief()}>{T.button}</Button>
        </motion.div>
      </div>
    </section>
  )
}
