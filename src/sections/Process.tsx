import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { PROCESS } from '../config/site'
import { SectionHead } from '../components/ui'
import { EASE } from '../lib/motion'

/**
 * Процесс: вертикальная линия заполняется по мере прокрутки, этапы загораются по очереди.
 * Слева на десктопе — «залипший» крупный номер текущего этапа.
 */
export default function Process() {
  const list = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 70%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const height = useTransform(fill, (v) => `${v * 100}%`)
  const [cur, setCur] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setCur(Math.min(PROCESS.length - 1, Math.max(0, Math.floor(v * PROCESS.length * 0.999)))))

  return (
    <section id="process" className="relative border-t border-white/[0.06] py-28 sm:py-40">
      <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead index="03" label="Процесс" title={['От идеи', 'до готового сайта']}>
            <p className="mt-8 max-w-sm text-[16px] leading-relaxed text-muted">Прозрачные этапы, понятные сроки и согласование на каждом шаге.</p>
          </SectionHead>
          <div className="mt-14 hidden items-end gap-5 lg:flex" aria-hidden>
            <span className="display chrome text-[160px] leading-[0.8] tabular-nums">{PROCESS[cur].n}</span>
            <span className="pb-3"><span className="mono block text-signal">{PROCESS[cur].title}</span><span className="mono mt-1 block text-dim">{PROCESS[cur].time}</span></span>
          </div>
        </div>

        <ol ref={list} className="relative pl-10 sm:pl-14">
          <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10 sm:left-[11px]" />
          <motion.span aria-hidden className="absolute left-[7px] top-2 w-px bg-signal shadow-[0_0_14px_rgba(212,255,90,.7)] sm:left-[11px]" style={{ height }} />
          {PROCESS.map((p, i) => {
            const passed = i <= cur
            return (
              <motion.li key={p.n} className="relative pb-14 last:pb-0 sm:pb-20"
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20% 0px' }} transition={{ duration: 1, ease: EASE }}>
                <span aria-hidden className={`absolute -left-10 top-1 grid h-[15px] w-[15px] place-items-center rounded-full border transition-colors duration-500 sm:-left-14 sm:h-[23px] sm:w-[23px] ${passed ? 'border-signal bg-void' : 'border-white/20 bg-void'}`}>
                  <span className={`h-[5px] w-[5px] rounded-full transition-all duration-500 sm:h-[7px] sm:w-[7px] ${passed ? 'bg-signal' : 'bg-white/20'}`} />
                </span>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="mono text-signal">{p.n}</span>
                  <h3 className={`display text-[clamp(32px,4.4vw,64px)] uppercase transition-colors duration-700 ${passed ? 'text-ink' : 'text-white/40'}`}>{p.title}</h3>
                  <span className="mono ml-auto text-dim">{p.time}</span>
                </div>
                <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted sm:text-[17px]">{p.text}</p>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
