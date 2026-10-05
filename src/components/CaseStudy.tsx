import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { WORKS, MORE_WORKS } from '../config/site'
import Media from './Media'
import { Button, toast } from './ui'
import { openBrief } from './Nav'
import { lockScroll, EASE } from '../lib/motion'

const ALL = [...WORKS, ...MORE_WORKS]
const idFromHash = () => (location.hash.startsWith('#work/') ? decodeURIComponent(location.hash.slice(6)) : null)

/**
 * Полноэкранный кейс. Открывается по адресу #work/<id> — работают «назад» в браузере и прямые ссылки.
 * Шторка поднимается снизу, контент появляется по частям; внизу — переход к следующему проекту.
 */
export default function CaseStudy() {
  const [id, setId] = useState<string | null>(idFromHash)
  const scroller = useRef<HTMLDivElement>(null)
  const back = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const on = () => { const next = idFromHash(); if (next && !id) back.current = document.activeElement as HTMLElement; setId(next) }
    addEventListener('hashchange', on); return () => removeEventListener('hashchange', on)
  }, [id])
  useEffect(() => {
    lockScroll(!!id)
    if (!id) { back.current?.focus?.({ preventScroll: true }); return }
    scroller.current?.scrollTo({ top: 0 })
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && close()
    addEventListener('keydown', esc); return () => removeEventListener('keydown', esc)
  }, [id])

  const close = () => { history.pushState('', document.title, location.pathname + location.search); setId(null) }
  const w = ALL.find((x) => x.id === id)
  const idx = w ? ALL.indexOf(w) : -1
  const next = idx >= 0 ? ALL[(idx + 1) % ALL.length] : null
  const prev = idx >= 0 ? ALL[(idx - 1 + ALL.length) % ALL.length] : null
  const go = (x: string) => { location.hash = `work/${x}` }

  const Block = ({ k, children, d = 0 }: { k: string; children: React.ReactNode; d?: number }) => (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, root: scroller }} transition={{ duration: 0.9, delay: d, ease: EASE }}
      className="grid gap-4 border-t border-white/[0.08] py-10 md:grid-cols-[220px_1fr] md:gap-12">
      <p className="mono text-muted">{k}</p><div>{children}</div>
    </motion.div>
  )

  return (
    <AnimatePresence>
      {w && (
        <motion.div key="case" role="dialog" aria-modal="true" aria-label={`Кейс: ${w.title}`}
          className="fixed inset-0 z-[80] bg-void" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: EASE }}>
          <div ref={scroller} className="h-full overflow-y-auto overscroll-contain" data-lenis-prevent>
            {/* панель кейса */}
            <div className="sticky top-0 z-10 border-b border-white/[0.06] bg-void/80 backdrop-blur-xl">
              <div className="wrap flex h-16 items-center justify-between gap-4 sm:h-20">
                <button onClick={close} className="mono flex items-center gap-2 text-muted hover:text-ink"><ArrowLeft size={14} />Все работы</button>
                <span className="mono hidden text-dim sm:block">{w.index} / {String(ALL.length).padStart(2, '0')}</span>
                <button onClick={close} aria-label="Закрыть кейс" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 hover:border-white/40"><X size={18} /></button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <header className="wrap pb-10 pt-14 sm:pt-20">
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: EASE }} className="mono flex flex-wrap items-center gap-3 text-muted">
                    <span className="text-signal">{w.index}</span>{w.category}<span className="h-px w-8 bg-white/20" />{w.year}
                    {w.kind === 'concept' && <span className="rounded-full border border-signal/40 px-2.5 py-1 text-[10px] text-signal">Концепт — замените своим проектом</span>}
                  </motion.p>
                  <h2 className="display mt-6 text-[clamp(48px,11vw,190px)]">
                    <span className="line-mask"><motion.span className="block" initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 1.2, delay: 0.35, ease: EASE }}>{w.title}</motion.span></span>
                  </h2>
                  <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE }} className="mt-6 max-w-2xl text-[18px] leading-relaxed text-muted sm:text-[22px]">{w.tagline}</motion.p>
                </header>

                {/* Preview */}
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: EASE }} className="wrap">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] border border-white/[0.08] bg-coal sm:rounded-[32px]">
                    <Media w={w} active eager />
                  </div>
                </motion.div>

                <div className="wrap mt-16 sm:mt-24">
                  <Block k="О проекте"><p className="max-w-3xl text-[20px] leading-[1.5] sm:text-[26px]">{w.about}</p></Block>
                  <Block k="Задача"><p className="max-w-3xl text-[16px] leading-relaxed text-ink/80 sm:text-[18px]">{w.task}</p></Block>
                  <Block k="Решение"><p className="max-w-3xl text-[16px] leading-relaxed text-ink/80 sm:text-[18px]">{w.solution}</p></Block>
                  {w.gallery && w.gallery.length > 0 && (
                    <div className={`grid gap-4 py-6 ${w.gallery.length > 1 ? 'md:grid-cols-2' : ''}`}>
                      {w.gallery.map((g, k) => (
                        <motion.img key={g} src={g} alt={`${w.title} — экран ${k + 2}`} loading="lazy" decoding="async" width={1280} height={800}
                          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, root: scroller }} transition={{ duration: 1, delay: k * 0.1, ease: EASE }}
                          className="w-full rounded-[20px] border border-white/[0.08]" />
                      ))}
                    </div>
                  )}
                  <Block k="Технологии"><ul className="flex flex-wrap gap-2">{w.stack.map((s) => <li key={s} className="rounded-full border border-white/12 px-4 py-2 text-[14px]">{s}</li>)}</ul></Block>
                  <Block k="Результат">
                    <ul className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-3">
                      {w.result.map((r, k) => <li key={r} className="bg-void p-6"><span className="mono text-signal">0{k + 1}</span><p className="mt-4 text-[16px] leading-snug">{r}</p></li>)}
                    </ul>
                  </Block>
                  <div className="flex flex-wrap gap-3 border-t border-white/[0.08] py-10">
                    {w.url ? <Button href={w.url} arrow="up" variant="signal">Посмотреть сайт</Button>
                      : <Button variant="signal" arrow="up" onClick={() => toast('Ссылка появится, когда вы замените концепт реальным проектом')}>Посмотреть сайт</Button>}
                    <Button variant="ghost" onClick={() => { close(); setTimeout(openBrief, 600) }}>Хочу такой же уровень</Button>
                  </div>
                </div>

                {/* следующий проект */}
                {next && prev && (
                  <div className="mt-10 border-t border-white/[0.08]">
                    <button onClick={() => go(next.id)} className="group wrap flex w-full items-center justify-between gap-6 py-14 text-left sm:py-20">
                      <span>
                        <span className="mono text-muted">Следующий проект</span>
                        <span className="display mt-4 block text-[clamp(40px,8vw,128px)] transition-colors duration-500 group-hover:text-signal">{next.title}</span>
                      </span>
                      <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-signal group-hover:bg-signal group-hover:text-void sm:h-24 sm:w-24"><ArrowRight size={26} /></span>
                    </button>
                    <div className="wrap flex justify-between pb-10">
                      <button onClick={() => go(prev.id)} className="mono flex items-center gap-2 text-dim hover:text-ink"><ArrowLeft size={14} />{prev.title}</button>
                      <button onClick={close} className="mono flex items-center gap-2 text-dim hover:text-ink">Закрыть<ArrowUpRight size={14} /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
