import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
import { SERVICES } from '../config/site'
import { SectionHead, Corners } from '../components/ui'
import { EASE } from '../lib/motion'

const S = '#d4ff5a', W = 'rgba(255,255,255,.55)', G = 'rgba(255,255,255,.12)'
const draw = (d = 0) => ({ initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 1.1, delay: d, ease: EASE } })
const pop = (d = 0) => ({ initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.7, delay: d, ease: EASE } })

/** Мотив для каждой услуги — минималистичная анимированная схема */
function Motif({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
      {i === 0 && <>
        <motion.rect x="40" y="40" width="320" height="220" rx="14" fill="none" stroke={W} {...draw()} />
        <motion.line x1="40" x2="360" y1="70" y2="70" stroke={G} {...draw(0.2)} />
        {[0, 1, 2].map((k) => <motion.circle key={k} cx={58 + k * 14} cy="55" r="3.5" fill={k === 2 ? S : W} {...pop(0.4 + k * 0.08)} />)}
        <motion.rect x="64" y="96" width="170" height="22" rx="4" fill="rgba(255,255,255,.85)" {...pop(0.5)} />
        <motion.rect x="64" y="126" width="120" height="22" rx="4" fill={S} {...pop(0.6)} />
        <motion.rect x="64" y="170" width="90" height="28" rx="14" fill="none" stroke={W} {...pop(0.75)} />
        <motion.circle cx="290" cy="170" r="48" fill="none" stroke={W} {...draw(0.5)} />
      </>}
      {i === 1 && <>
        <motion.rect x="30" y="60" width="160" height="180" rx="10" fill="rgba(255,255,255,.04)" stroke={G} {...pop()} />
        {[0, 1, 2, 3].map((k) => <motion.rect key={k} x="46" y={80 + k * 22} width={120 - k * 18} height="10" rx="2" fill="rgba(255,255,255,.18)" {...pop(0.1 * k)} />)}
        <motion.path d="M200 150 h30" stroke={S} strokeWidth="2" {...draw(0.4)} /><motion.path d="M222 142 l8 8 -8 8" fill="none" stroke={S} strokeWidth="2" {...draw(0.6)} />
        <motion.rect x="240" y="60" width="140" height="180" rx="10" fill="none" stroke={W} {...draw(0.5)} />
        <motion.rect x="256" y="80" width="108" height="56" rx="6" fill={S} {...pop(0.8)} />
        <motion.rect x="256" y="148" width="80" height="12" rx="2" fill="rgba(255,255,255,.85)" {...pop(0.9)} />
      </>}
      {i === 2 && <>
        <line x1="40" x2="360" y1="240" y2="240" stroke={G} /><line x1="40" x2="40" y1="40" y2="240" stroke={G} />
        <motion.path d="M40 240 C 160 240, 180 50, 360 50" fill="none" stroke={S} strokeWidth="2.5" {...draw()} />
        <motion.circle r="9" fill="#fff" initial={{ cx: 40, cy: 240 }} animate={{ cx: [40, 200, 360], cy: [240, 120, 50] }} transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.6, ease: [0.65, 0, 0.35, 1] }} />
        <motion.text x="44" y="30" fill={W} className="font-mono text-[11px]" {...pop(0.4)}>ease-out-expo · 60fps</motion.text>
      </>}
      {i === 3 && <>
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} style={{ originX: '200px', originY: '150px' }}>
          <motion.path d="M200 60 L290 110 L290 200 L200 250 L110 200 L110 110 Z" fill="none" stroke={W} {...draw()} />
          <motion.path d="M200 60 L200 150 M110 110 L200 150 L290 110 M200 150 L200 250" fill="none" stroke={S} strokeWidth="1.5" {...draw(0.4)} />
        </motion.g>
        <motion.circle cx="200" cy="150" r="118" fill="none" stroke={G} strokeDasharray="3 8" {...draw(0.2)} />
      </>}
      {i === 4 && <>
        <motion.rect x="70" y="40" width="150" height="230" rx="12" fill="none" stroke={W} {...draw()} />
        <motion.rect x="240" y="20" width="120" height="250" rx="22" fill="none" stroke={S} strokeWidth="1.5" {...draw(0.3)} />
        <motion.rect x="282" y="32" width="36" height="8" rx="4" fill={S} {...pop(0.7)} />
        {[0, 1, 2].map((k) => <motion.rect key={k} x="256" y={60 + k * 56} width="88" height="44" rx="8" fill="rgba(255,255,255,.08)" {...pop(0.6 + k * 0.1)} />)}
        {[0, 1, 2, 3].map((k) => <motion.rect key={k} x="86" y={60 + k * 50} width={118 - (k % 2) * 30} height="34" rx="4" fill="rgba(255,255,255,.06)" {...pop(0.4 + k * 0.08)} />)}
      </>}
      {i === 5 && <>
        <motion.circle cx="200" cy="150" r="100" fill="none" stroke={W} {...draw()} />
        <motion.ellipse cx="200" cy="150" rx="44" ry="100" fill="none" stroke={G} {...draw(0.2)} />
        <motion.line x1="100" x2="300" y1="150" y2="150" stroke={G} {...draw(0.3)} />
        <motion.circle cx="200" cy="150" r="10" fill={S} {...pop(0.6)} />
        <motion.circle cx="200" cy="150" r="10" fill="none" stroke={S} animate={{ r: [10, 60], opacity: [0.8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }} />
        <motion.text x="200" y="285" textAnchor="middle" fill={W} className="font-mono text-[11px]" {...pop(0.6)}>status: live · 200 OK</motion.text>
      </>}
    </svg>
  )
}

/** Услуги: список слева (наведение/клик выбирает), панель-превью справа. На телефоне — раскрывающиеся пункты. */
export default function Services() {
  const [i, setI] = useState(0)
  return (
    <section id="services" className="relative border-t border-white/[0.06] py-28 sm:py-40">
      <div className="wrap">
        <SectionHead index="02" label="Что делаю" title={['Что я могу сделать', 'для вашего бизнеса']} />
        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <ul className="border-t border-white/[0.08]">
            {SERVICES.map((s, k) => {
              const on = i === k
              return (
                <li key={s.n} className="border-b border-white/[0.08]" onMouseEnter={() => setI(k)}>
                  <button onClick={() => setI(k)} aria-expanded={on} className="group relative flex w-full items-center gap-5 overflow-hidden py-6 text-left sm:gap-8 sm:py-8">
                    <span aria-hidden className={`absolute inset-0 origin-left bg-[linear-gradient(90deg,rgba(212,255,90,.08),transparent_70%)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${on ? 'scale-x-100' : 'scale-x-0'}`} />
                    <span className={`mono relative transition-colors ${on ? 'text-signal' : 'text-dim'}`}>{s.n}</span>
                    <span className={`display relative flex-1 whitespace-nowrap text-[clamp(30px,4.4vw,64px)] uppercase transition-[color,transform] duration-500 ${on ? 'translate-x-2 text-ink' : 'text-white/40 group-hover:text-white/70'}`}>{s.title}</span>
                    <span className={`relative hidden max-w-[13rem] text-right text-[14px] text-muted transition-opacity duration-500 sm:block ${on ? 'opacity-100' : 'opacity-0'}`}>{s.text}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="overflow-hidden lg:hidden">
                        <p className="pb-4 text-[15px] text-muted sm:hidden">{s.text}</p>
                        <div className="relative mb-6 aspect-[4/3] rounded-2xl border border-white/[0.08] bg-coal p-4"><Motif i={k} /></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>

          <div className="hidden lg:block">
            <div className="group sticky top-28 rounded-[28px] border border-white/[0.08] bg-[radial-gradient(80%_70%_at_50%_0%,rgba(212,255,90,.07),transparent_70%),#0b0b0d] p-8">
              <Corners className="inset-4" color="rgba(255,255,255,.25)" />
              <div className="flex items-center justify-between"><span className="mono text-muted">Service {SERVICES[i].n} / 0{SERVICES.length}</span><span className="mono text-signal">{SERVICES[i].title}</span></div>
              <div className="mt-6 aspect-[4/3]"><AnimatePresence mode="wait"><motion.div key={i} className="h-full" exit={{ opacity: 0, transition: { duration: 0.2 } }}><Motif i={i} /></motion.div></AnimatePresence></div>
              <AnimatePresence mode="wait">
                <motion.ul key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="mt-6 grid gap-3 border-t border-white/[0.08] pt-6">
                  {SERVICES[i].points.map((p) => <li key={p} className="flex items-center gap-3 text-[15px]"><Check size={16} className="text-signal" />{p}</li>)}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
