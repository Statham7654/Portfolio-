import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { CONTACTS } from '../config/site'
import { EASE } from '../lib/motion'
import { isCoarse, reducedMotion } from '../lib/env'

/** «Магнитная» обёртка: тянется за курсором и пружинит обратно (только мышь) */
export function Magnetic({ children, strength = 0.3, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current!
    if (isCoarse || reducedMotion) return
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: 0.45, ease: 'power3.out' }) }
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.35)' })
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [strength])
  return <span ref={ref} className={`inline-flex will-change-transform ${className}`}>{children}</span>
}

type BtnProps = {
  children: ReactNode; onClick?: () => void; href?: string; variant?: 'primary' | 'ghost' | 'signal'
  size?: 'md' | 'sm' | 'lg'; arrow?: 'right' | 'up' | false; className?: string; wrapClass?: string; type?: 'button' | 'submit'; disabled?: boolean; ariaLabel?: string
}
/**
 * Кнопка-«пилюля»: при наведении заливка поднимается снизу, стрелка уезжает и возвращается с другой стороны.
 * primary — светлая, ghost — контур, signal — лаймовая (главное действие).
 */
export function Button({ children, onClick, href, variant = 'primary', size = 'md', arrow = 'right', className = '', wrapClass = '', type = 'button', disabled, ariaLabel }: BtnProps) {
  const sz = size === 'sm' ? 'h-10 px-4 text-[13px] gap-2' : size === 'lg' ? 'h-16 px-8 text-[16px] gap-3 sm:h-[72px] sm:px-10 sm:text-[18px]' : 'h-12 px-6 text-[14px] gap-2.5 sm:h-14 sm:px-7 sm:text-[15px]'
  const base = variant === 'primary' ? 'bg-ink text-void' : variant === 'signal' ? 'bg-signal text-void' : 'border border-white/15 text-ink'
  const fill = variant === 'ghost' ? 'bg-ink' : variant === 'signal' ? 'bg-ink' : 'bg-signal'
  const hoverText = variant === 'ghost' ? 'group-hover:text-void' : ''
  const Icon = arrow === 'up' ? ArrowUpRight : ArrowRight
  const cls = `group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em] transition-[color,opacity] duration-500 disabled:cursor-not-allowed disabled:opacity-35 ${sz} ${base} ${className}`
  const inner = (<>
    <span aria-hidden className={`absolute inset-0 translate-y-[101%] rounded-full transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0 group-disabled:translate-y-[101%] ${fill}`} />
    <span className={`relative transition-colors duration-500 ${hoverText}`}>{children}</span>
    {arrow && (
      <span aria-hidden className={`relative grid h-4 w-4 overflow-hidden transition-colors duration-500 ${hoverText}`}>
        <Icon size={16} strokeWidth={1.8} className="col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-5" />
        <Icon size={16} strokeWidth={1.8} className="col-start-1 row-start-1 -translate-x-5 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0" />
      </span>
    )}
  </>)
  return (
    <Magnetic className={wrapClass}>
      {href ? <a href={href} target="_blank" rel="noreferrer" className={cls} aria-label={ariaLabel}>{inner}</a>
        : <button type={type} onClick={onClick} disabled={disabled} className={cls} aria-label={ariaLabel}>{inner}</button>}
    </Magnetic>
  )
}

/** Соцсети: пока адрес не задан в конфиге — подсказка вместо битой ссылки */
/** Ссылка на контакт: настоящий <a> (открывается в новой вкладке). Пока url не задан — кнопка с подсказкой. */
export function ContactLink({ k, className, children }: { k: keyof typeof CONTACTS; className?: string; children: React.ReactNode }) {
  const c = CONTACTS[k]
  if (c.url) return <a href={c.url} target={c.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={className}>{children}</a>
  return <button type="button" onClick={() => openContact(k)} className={className}>{children}</button>
}

export function openContact(k: keyof typeof CONTACTS) {
  const c = CONTACTS[k]
  if (c.url) window.open(c.url, '_blank', 'noopener')
  else toast(`Ссылка на ${k === 'email' ? 'email' : k[0].toUpperCase() + k.slice(1)} появится скоро`)
}
export const toast = (msg: string) => window.dispatchEvent(new CustomEvent('toast', { detail: msg }))
export function Toast() {
  const [msg, setMsg] = useState<string | null>(null)
  useEffect(() => {
    let id = 0
    const on = (e: Event) => { setMsg((e as CustomEvent<string>).detail); clearTimeout(id); id = window.setTimeout(() => setMsg(null), 2800) }
    addEventListener('toast', on); return () => removeEventListener('toast', on)
  }, [])
  return (
    <div role="status" aria-live="polite" className={`glass pointer-events-none fixed bottom-6 left-1/2 z-[95] -translate-x-1/2 rounded-full px-5 py-3 text-[13px] transition-all duration-500 ${msg ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-signal align-middle" />{msg}
    </div>
  )
}

/** Заголовок секции: номер + ярлык моно-шрифтом, крупная строка раскрывается из-под маски */
export function SectionHead({ index, label, title, children, align = 'left', className = '' }: { index: string; label: string; title: string[]; children?: ReactNode; align?: 'left' | 'center'; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })
  return (
    <div ref={ref} className={`${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}
        className={`mono flex items-center gap-3 text-muted ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="text-signal">{index}</span><span className="h-px w-10 bg-white/20" />{label}
      </motion.p>
      <h2 className="display mt-7 text-[clamp(40px,7vw,112px)]">
        {title.map((line, i) => (
          <span key={i} className="line-mask"><motion.span className={`block ${i === title.length - 1 ? 'chrome' : ''}`} initial={{ y: '108%' }} animate={inView ? { y: '0%' } : {}} transition={{ duration: 1.2, delay: 0.08 * i, ease: EASE }}>{line}</motion.span></span>
        ))}
      </h2>
      {children && <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.3, ease: EASE }}>{children}</motion.div>}
    </div>
  )
}

export function Reveal({ children, delay = 0, className = '', y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: 1.1, delay, ease: EASE }}>
      {children}
    </motion.div>
  )
}

/** Уголки «видоискателя» вокруг блока — фирменный элемент (4 угла, анимируются при наведении родителя .group) */
export function Corners({ className = '', size = 14, color = 'rgba(255,255,255,.4)' }: { className?: string; size?: number; color?: string }) {
  const s = { width: size, height: size, borderColor: color }
  const c = 'absolute border-solid transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]'
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${c} left-0 top-0 border-l border-t group-hover:-translate-x-1 group-hover:-translate-y-1`} style={s} />
      <span className={`${c} right-0 top-0 border-r border-t group-hover:-translate-y-1 group-hover:translate-x-1`} style={s} />
      <span className={`${c} bottom-0 left-0 border-b border-l group-hover:-translate-x-1 group-hover:translate-y-1`} style={s} />
      <span className={`${c} bottom-0 right-0 border-b border-r group-hover:translate-x-1 group-hover:translate-y-1`} style={s} />
    </span>
  )
}
