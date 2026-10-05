import { useRef } from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { PRICING } from '../config/site'
import { Button, SectionHead, Corners } from '../components/ui'
import { openBrief } from '../components/Nav'
import { EASE } from '../lib/motion'
import { isCoarse, reducedMotion } from '../lib/env'

const fmt = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ')

/** Карточка пакета: блик следует за курсором (spotlight), у главного пакета — лаймовая рамка и подсветка */
function Plan({ p, i }: { p: (typeof PRICING.plans)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.PointerEvent) => {
    if (isCoarse || reducedMotion) return
    const r = ref.current!.getBoundingClientRect()
    ref.current!.style.setProperty('--x', `${e.clientX - r.left}px`); ref.current!.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  const f = !!p.featured
  return (
    <motion.div ref={ref} onPointerMove={onMove}
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 1.1, delay: i * 0.1, ease: EASE }}
      className={`group relative flex flex-col overflow-hidden rounded-[28px] p-7 sm:p-10 ${f ? 'border border-signal/40 bg-[linear-gradient(180deg,rgba(212,255,90,.09),#0b0b0d_40%)]' : 'border border-white/[0.08] bg-coal'}`}>
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(400px circle at var(--x,50%) var(--y,0%), rgba(255,255,255,.07), transparent 60%)' }} />
      <Corners className="inset-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100" color={f ? 'rgba(212,255,90,.6)' : 'rgba(255,255,255,.35)'} />
      <div className="relative flex items-center justify-between">
        <span className="mono text-muted">0{i + 1}</span>
        {f && <span className="mono rounded-full bg-signal px-3 py-1.5 text-[10px] text-void">Чаще выбирают</span>}
      </div>
      <h3 className="display relative mt-10 text-[44px] uppercase sm:text-[56px]">{p.name}</h3>
      <p className="relative mt-2 text-[15px] text-muted">{p.for}</p>
      <p className="relative mt-10 flex items-baseline gap-2 border-t border-white/[0.08] pt-8">
        <span className="text-[15px] text-muted">от</span>
        <span className={`text-[44px] font-semibold tracking-[-0.04em] sm:text-[52px] ${f ? 'text-signal' : ''}`}>{fmt(p.from)}</span>
        <span className="text-[17px] text-muted">{PRICING.currency}</span>
      </p>
      <ul className="relative mt-8 grid gap-3">
        {p.items.map((it) => <li key={it} className="flex items-start gap-3 text-[15px]"><Check size={16} className={`mt-0.5 shrink-0 ${f ? 'text-signal' : 'text-muted'}`} />{it}</li>)}
      </ul>
      <div className="relative mt-auto pt-10">
        <Button variant={f ? 'signal' : 'ghost'} wrapClass="[&>*]:w-full w-full" onClick={() => openBrief()}>Обсудить проект</Button>
      </div>
    </motion.div>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden border-t border-white/[0.06] py-28 sm:py-40">
      <div aria-hidden className="absolute left-1/2 top-[30%] -z-10 h-[60vmin] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,255,90,.06),transparent)]" />
      <div className="wrap">
        <SectionHead index="04" label="Цена" title={['Инвестиция', 'в первое впечатление']} />
        <div className="mt-16 grid gap-4 lg:mt-24 lg:grid-cols-3">{PRICING.plans.map((p, i) => <Plan key={p.name} p={p} i={i} />)}</div>
        <p className="mono mt-10 text-center text-muted">{PRICING.note}</p>
      </div>
    </section>
  )
}
