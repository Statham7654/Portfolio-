import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, AtSign, Camera, Send } from 'lucide-react'
import { NAV, CONTACTS, CONTACT_KEYS } from '../config/site'
import Logo from './Logo'
import { Button, ContactLink } from './ui'
import { lockScroll, scrollToId, EASE } from '../lib/motion'

/** «Обсудить проект» из любого места: прокрутка к форме и фокус на первом поле */
export function openBrief() {
  scrollToId('#contact')
  setTimeout(() => document.querySelector<HTMLInputElement>('#contact input')?.focus({ preventScroll: true }), 1500)
}

/** Фиксированная навигация: при скролле становится компактнее и получает стеклянный фон. Мобильное меню — на весь экран. */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const on = () => setScrolled(scrollY > 40)
    on(); addEventListener('scroll', on, { passive: true })
    const ids = new Set(NAV.map((n) => n.id))
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { const id = '#' + e.target.id; setActive(ids.has(id) ? id : '') } }), { rootMargin: '-45% 0px -50% 0px' })
    document.querySelectorAll('main > section').forEach((s) => io.observe(s))
    return () => { removeEventListener('scroll', on); io.disconnect() }
  }, [])
  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', esc); return () => removeEventListener('keydown', esc)
  }, [open])
  const go = (id: string) => { setOpen(false); setTimeout(() => scrollToId(id), open ? 350 : 0) }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className={`wrap transition-[padding] duration-500 ${scrolled ? 'pt-3' : 'pt-5 sm:pt-6'}`}>
          <div className={`flex items-center justify-between gap-6 rounded-full transition-[background-color,border-color,padding,backdrop-filter] duration-500 ${scrolled || open ? 'glass py-2 pl-5 pr-2' : 'border border-transparent py-2 pl-0 pr-0'}`}>
            <a href="#top" onClick={(e) => { e.preventDefault(); go('#top') }} aria-label="На главную" className="relative z-10"><Logo /></a>
            <nav aria-label="Главная навигация" className="hidden items-center gap-1 lg:flex">
              {NAV.map((n, i) => (
                <a key={n.id} href={n.id} onClick={(e) => { e.preventDefault(); go(n.id) }}
                  className={`group relative flex items-baseline gap-1.5 rounded-full px-3.5 py-2 text-[14px] transition-colors ${active === n.id ? 'text-ink' : 'text-muted hover:text-ink'}`}>
                  <span className={`mono text-[9px] transition-colors ${active === n.id ? 'text-signal' : 'text-dim'}`}>0{i + 1}</span>{n.label}
                  {active === n.id && <motion.span layoutId="navline" className="absolute inset-x-3.5 -bottom-0.5 h-px bg-signal" transition={{ duration: 0.5, ease: EASE }} />}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block"><Button size="sm" variant={scrolled ? 'signal' : 'primary'} onClick={() => { setOpen(false); openBrief() }}>Обсудить проект</Button></div>
              <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="menu" aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
                className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 lg:hidden">
                <span className={`absolute h-px w-4 bg-ink transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-[3px]'}`} />
                <span className={`absolute h-px w-4 bg-ink transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-[3px]'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div id="menu" role="dialog" aria-modal="true" aria-label="Меню" data-lenis-prevent className="fixed inset-0 z-40 flex flex-col overflow-y-auto overflow-x-hidden overscroll-contain bg-void pt-[calc(96px+env(safe-area-inset-top))] [@media(max-height:700px)]:pt-[calc(84px+env(safe-area-inset-top))] lg:hidden"
            initial={{ clipPath: 'circle(0% at 92% 6%)' }} animate={{ clipPath: 'circle(150% at 92% 6%)' }} exit={{ clipPath: 'circle(0% at 92% 6%)' }} transition={{ duration: 0.8, ease: EASE }}>
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden"><div className="absolute right-[-30%] top-[-10%] h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(closest-side,rgba(212,255,90,.08),transparent)]" /></div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="wrap mono flex items-center gap-3 text-[10px] text-dim">
              <span className="h-px w-8 bg-white/20" />Навигация
            </motion.p>
            <nav className="wrap mt-6 flex flex-col border-t border-white/[0.07]">
              {NAV.map((n, i) => {
                const on = active === n.id
                return (
                  <motion.a key={n.id} href={n.id} onClick={(e) => { e.preventDefault(); go(n.id) }} aria-current={on ? 'true' : undefined}
                    initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 + i * 0.05, duration: 0.6, ease: EASE }}
                    className="group grid grid-cols-[36px_1fr_auto] items-center border-b border-white/[0.07] py-[18px] active:bg-white/[0.02] [@media(max-height:700px)]:py-3.5">
                    <span className={`mono text-[10px] ${on ? 'text-signal' : 'text-dim'}`}>0{i + 1}</span>
                    <span className={`flex items-center gap-3 text-[28px] font-medium leading-none tracking-[-0.02em] min-[400px]:text-[30px] ${on ? 'text-ink' : 'text-ink/85'}`}>
                      {n.label}{on && <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px_rgba(212,255,90,.8)]" />}
                    </span>
                    <ArrowRight size={18} strokeWidth={1.5} className="text-dim transition-transform duration-300 group-active:translate-x-1" />
                  </motion.a>
                )
              })}
            </nav>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6, ease: EASE }} className="wrap mt-auto grid gap-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-8 [@media(max-height:700px)]:gap-3 [@media(max-height:700px)]:pt-5">
              <div className={`grid gap-2 ${CONTACT_KEYS.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {CONTACT_KEYS.map((k) => {
                  const Icon = k === 'telegram' ? Send : k === 'instagram' ? Camera : AtSign
                  return (
                    <ContactLink key={k} k={k} className="flex flex-col items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-left [@media(max-height:700px)]:flex-row [@media(max-height:700px)]:items-center [@media(max-height:700px)]:gap-2 [@media(max-height:700px)]:px-3 active:border-white/20">
                      <Icon size={16} strokeWidth={1.6} className="shrink-0 text-muted max-[359px]:hidden" />
                      <span className="mono text-[10px] text-ink/80">{k === 'email' ? 'Email' : k}</span>
                    </ContactLink>
                  )
                })}
              </div>
              <Button variant="signal" wrapClass="[&>*]:w-full" onClick={() => { setOpen(false); setTimeout(openBrief, 400) }}>Обсудить проект</Button>
              <span className="mono text-center text-[10px] text-dim">{CONTACTS.telegram.label} · {CONTACTS.instagram.label}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
