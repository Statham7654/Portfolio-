import { lazy, Suspense, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { HERO } from '../config/site'
import { Button, Corners } from '../components/ui'
import { openBrief } from '../components/Nav'
import { scrollToId, EASE } from '../lib/motion'
import { hero } from '../lib/store'
import { canWebGL, isCoarse, reducedMotion } from '../lib/env'

const HeroScene = lazy(() => import('../three/HeroScene'))

/** Без WebGL — статичный «хром» из градиентов, в той же композиции */
function Fallback() {
  return <div className="mx-auto aspect-square w-[70%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,#c9ccd2_18%,#4a4c52_45%,#0b0b0d_70%),radial-gradient(circle_at_70%_80%,rgba(212,255,90,.5),transparent_40%)] shadow-[0_0_120px_rgba(212,255,90,.15)]" />
}

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const onMove = (e: PointerEvent) => { hero.mx = (e.clientX / innerWidth) * 2 - 1; hero.my = (e.clientY / innerHeight) * 2 - 1 }
    if (!isCoarse) addEventListener('pointermove', onMove, { passive: true })
    const io = new IntersectionObserver(([e]) => { hero.visible = e.isIntersecting })
    io.observe(root.current!)
    const ctx = gsap.context(() => {
      gsap.to(hero, { scroll: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      if (!reducedMotion) {
        gsap.to('[data-h="copy"]', { yPercent: -16, opacity: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 20%', scrub: true } })
        gsap.to('[data-h="scene"]', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      }
    }, root)
    return () => { removeEventListener('pointermove', onMove); io.disconnect(); ctx.revert() }
  }, [])

  const show = ready ? 'show' : 'hide'
  const line = { hide: { y: '110%' }, show: (i: number) => ({ y: '0%', transition: { duration: 1.3, delay: 0.1 + i * 0.09, ease: EASE } }) }
  const fade = { hide: { opacity: 0, y: 18 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1.1, delay: 0.55 + i * 0.1, ease: EASE } }) }

  return (
    <section ref={root} id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* свечение за объектом и тонкие направляющие */}
      <div aria-hidden className="absolute right-[-10%] top-[10%] -z-10 h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(circle,rgba(212,255,90,.10),transparent_60%)] max-lg:right-[-30%] max-lg:top-[0%]" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:96px_96px] [mask-image:radial-gradient(70%_60%_at_65%_40%,#000,transparent)]" />

      {/* 3D: справа на десктопе, сверху на телефоне */}
      <motion.div data-h="scene" className="absolute inset-x-0 top-[7svh] -z-10 h-[38svh] lg:inset-y-0 lg:left-[46%] lg:right-[-4%] lg:top-0 lg:h-auto"
        initial={{ opacity: 0, scale: 0.92 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 2.4, ease: EASE }}>
        <div className="absolute inset-[12%] hidden lg:block"><Corners size={18} color="rgba(255,255,255,.18)" /></div>
        {canWebGL ? <Suspense fallback={null}><HeroScene /></Suspense> : <div className="grid h-full place-items-center"><Fallback /></div>}
        <motion.span initial="hide" animate={show} custom={3} variants={fade} className="mono absolute bottom-[14%] right-[12%] hidden text-[10px] text-dim lg:block">fig. 01 — liquid chrome</motion.span>
      </motion.div>

      <div data-h="copy" className="wrap relative flex flex-1 flex-col justify-end pb-24 pt-[calc(45svh+8px)] lg:justify-center lg:pt-28 lg:pb-16">
        <motion.p initial="hide" animate={show} custom={0} variants={fade} className="mono flex items-center gap-3 text-muted">
          <span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-signal" style={{ animation: 'pulse-dot 2.4s ease-in-out infinite' }} /></span>
          {HERO.status}
        </motion.p>
        <h1 aria-label={HERO.title.join(' ')} className="display mt-7 max-w-[13ch] text-[clamp(44px,7.2vw,124px)]">
          {HERO.title.map((t, i) => (
            <span key={i} className="line-mask"><motion.span aria-hidden className={`block ${i === 1 ? 'chrome' : ''}`} initial="hide" animate={show} custom={i} variants={line}>{t}</motion.span></span>
          ))}
        </h1>
        <motion.p initial="hide" animate={show} custom={1} variants={fade} className="mt-6 max-w-[34rem] text-[16px] leading-relaxed text-muted sm:mt-8 sm:text-[18px]">{HERO.text}</motion.p>
        <motion.div initial="hide" animate={show} custom={2} variants={fade} className="mt-8 grid gap-2.5 sm:mt-10 sm:flex sm:gap-3">
          <Button wrapClass="max-sm:[&>*]:w-full max-sm:[&>*]:px-3" onClick={() => scrollToId('#works')}>{HERO.primary}</Button>
          <Button wrapClass="max-sm:[&>*]:w-full max-sm:[&>*]:px-3" variant="ghost" onClick={() => openBrief()}>{HERO.secondary}</Button>
        </motion.div>
      </div>

      <motion.div initial="hide" animate={show} custom={4} variants={fade} className="wrap relative hidden items-end justify-between pb-8 md:flex">
        <span className="mono text-dim">{HERO.kicker}</span>
        <button onClick={() => scrollToId('#works')} className="mono flex items-center gap-3 text-muted hover:text-ink">
          Scroll
          <span className="relative h-9 w-px overflow-hidden bg-white/15"><span className="absolute inset-x-0 top-0 h-1/2 bg-signal" style={{ animation: reducedMotion ? undefined : 'drip 1.8s cubic-bezier(.6,0,.2,1) infinite' }} /></span>
          ↓
        </button>
      </motion.div>
    </section>
  )
}
