import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { WORKS, MORE_WORKS, type Work } from '../config/site'
import { SectionHead, Corners } from '../components/ui'
import Media from '../components/Media'
import { EASE } from '../lib/motion'
import { isCoarse, reducedMotion } from '../lib/env'

export const openWork = (id: string) => { location.hash = `work/${id}` }

/** Активна, когда карточка под курсором (десктоп) или в центре экрана (телефон) */
function useActive<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    if (!isCoarse) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '-35% 0px -35% 0px' })
    io.observe(ref.current!); return () => io.disconnect()
  }, [])
  const hover = isCoarse ? {} : { onMouseEnter: () => setActive(true), onMouseLeave: () => setActive(false) }
  return { ref, active, hover }
}

/**
 * Большая карточка проекта. Карточки «залипают» и наслаиваются: предыдущая уменьшается и темнеет,
 * когда следующая наезжает сверху. При наведении — видео, плавный zoom, кнопка «Открыть проект».
 */
function Card({ w, i, n, progress }: { w: Work; i: number; n: number; progress: MotionValue<number> }) {
  const { ref, active, hover } = useActive<HTMLElement>()
  const start = i / n, end = (i + 1) / n
  const scale = useTransform(progress, [start, end, 1], [1, reducedMotion ? 1 : 0.93, reducedMotion ? 1 : 0.93])
  const dim = useTransform(progress, [start, end], [0, i === n - 1 ? 0 : 0.55])
  return (
    <li className="sticky top-[84px] h-[min(78svh,820px)] sm:top-[96px]" style={{ zIndex: i + 1 }}>
      <motion.article ref={ref} {...hover} style={{ scale }} data-cursor="open" onClick={() => openWork(w.id)}
        role="link" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') openWork(w.id) }} aria-label={`${w.title} — открыть проект`}
        className="group relative h-full origin-top cursor-pointer overflow-hidden rounded-[22px] border border-white/[0.08] bg-coal sm:rounded-[32px]">
        <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.045]">
          <Media w={w} active={active} eager={i === 0} />
        </div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,6,.92)_0%,rgba(5,5,6,.35)_38%,rgba(5,5,6,0)_60%)]" />
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-void" style={{ opacity: dim }} />

        {/* верхняя строка: номер, категория, год, тип */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-8">
          <span className="mono flex items-center gap-3 rounded-full bg-void/50 px-3 py-1.5 backdrop-blur-md"><span className="text-signal">{w.index}</span>{w.category}</span>
          <span className="mono flex items-center gap-2 rounded-full bg-void/50 px-3 py-1.5 backdrop-blur-md">
            {w.kind === 'concept' && <span className="text-signal">Concept ·</span>}{w.year}
          </span>
        </div>

        {/* название и кнопка */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-10">
          <div className="min-w-0">
            <h3 className="display overflow-hidden text-[clamp(40px,8.4vw,150px)]">
              <span className="block transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] sm:translate-y-[6%] sm:group-hover:translate-y-0">{w.title}</span>
            </h3>
            <p className="mt-2 max-w-md text-[14px] text-ink/70 sm:text-[16px]">{w.tagline}</p>
          </div>
          <span className="inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-ink px-5 text-[14px] font-medium text-void transition-[transform,opacity] duration-700 ease-[cubic-bezier(.16,1,.3,1)] sm:translate-y-4 sm:self-auto sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            Открыть проект <ArrowUpRight size={16} />
          </span>
        </div>
      </motion.article>
    </li>
  )
}

function SmallCard({ w, i }: { w: Work; i: number }) {
  const { ref, active, hover } = useActive<HTMLButtonElement>()
  return (
    <motion.button ref={ref} {...hover} data-cursor="open" onClick={() => openWork(w.id)} aria-label={`${w.title} — открыть проект`}
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.08, ease: EASE }}
      className="group block w-full text-left">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] border border-white/[0.08] bg-coal">
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"><Media w={w} active={active} /></div>
        <Corners className="inset-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100" color="rgba(255,255,255,.7)" />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <span className="text-[20px] font-semibold tracking-[-0.02em] sm:text-[24px]">{w.title}</span>
        <span className="mono text-dim">{w.category} · {w.year}</span>
      </div>
    </motion.button>
  )
}

export default function Works() {
  const list = useRef<HTMLUListElement>(null)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start start', 'end end'] })
  return (
    <section id="works" className="relative py-28 sm:py-40">
      <div className="wrap">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8 sm:mb-20">
          <SectionHead index="01" label="Избранные работы" title={['Из идей —', 'в цифровой продукт.']} />
          <p className="max-w-xs text-[15px] leading-relaxed text-muted">Наведите на проект — сайт оживёт. Нажмите, чтобы открыть кейс.</p>
        </div>
        <ul ref={list} className="relative grid gap-6 sm:gap-10">
          {WORKS.map((w, i) => <Card key={w.id} w={w} i={i} n={WORKS.length} progress={scrollYProgress} />)}
        </ul>

        <div className="mt-24 sm:mt-32">
          <p className="mono mb-8 flex items-center gap-3 text-muted"><span className="h-px w-10 bg-white/20" />Ещё работы</p>
          <div className="grid gap-8 md:grid-cols-2">{MORE_WORKS.map((w, i) => <SmallCard key={w.id} w={w} i={i} />)}</div>
        </div>
      </div>
    </section>
  )
}
