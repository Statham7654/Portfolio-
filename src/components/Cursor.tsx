import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { isCoarse, reducedMotion } from '../lib/env'

/**
 * Курсор-«видоискатель» (только мышь): точка + четыре уголка. Над ссылкой/кнопкой уголки «фокусируются» —
 * обнимают элемент по его размеру; над карточкой проекта появляется подпись «Открыть».
 */
export default function Cursor() {
  const box = useRef<HTMLDivElement>(null), dot = useRef<HTMLDivElement>(null), label = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (isCoarse || reducedMotion) return
    document.documentElement.classList.add('has-cursor')
    const b = box.current!, d = dot.current!, lb = label.current!
    const qx = gsap.quickTo(b, 'x', { duration: 0.35, ease: 'power3' }), qy = gsap.quickTo(b, 'y', { duration: 0.35, ease: 'power3' })
    const qw = gsap.quickTo(b, 'width', { duration: 0.35, ease: 'power3' }), qh = gsap.quickTo(b, 'height', { duration: 0.35, ease: 'power3' })
    let shown = false
    let lx = -1, ly = -1, raf = 0
    const update = (x: number, y: number, t: HTMLElement | null) => {
      if (!t) return
      const card = t.closest<HTMLElement>('[data-cursor="open"]')
      const hot = !card && t.closest<HTMLElement>('a,button,[role=button],input,textarea,label')
      if (hot) {
        const r = hot.getBoundingClientRect(), pad = 6
        qx(r.left + r.width / 2); qy(r.top + r.height / 2); qw(r.width + pad * 2); qh(r.height + pad * 2)
      } else {
        qx(x); qy(y); qw(card ? 96 : 30); qh(card ? 96 : 30)
      }
      lb.style.opacity = card ? '1' : '0'
      d.style.opacity = card ? '0' : '1'
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (!shown) { shown = true; gsap.to([b, d], { opacity: 1, duration: 0.3 }) }
      lx = e.clientX; ly = e.clientY
      gsap.set(d, { x: lx, y: ly })
      update(lx, ly, e.target as HTMLElement)
    }
    // при скролле/открытии кейса под курсором оказывается другой элемент — пересчитываем без движения мыши
    const recheck = () => {
      if (lx < 0 || raf) return
      raf = requestAnimationFrame(() => { raf = 0; update(lx, ly, document.elementFromPoint(lx, ly) as HTMLElement | null) })
    }
    const late = () => setTimeout(recheck, 450)
    const leave = () => { shown = false; gsap.to([b, d], { opacity: 0, duration: 0.3 }) }
    addEventListener('pointermove', move, { passive: true }); document.addEventListener('pointerleave', leave)
    addEventListener('scroll', recheck, { passive: true, capture: true }); addEventListener('hashchange', late)
    return () => {
      document.documentElement.classList.remove('has-cursor'); removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave)
      removeEventListener('scroll', recheck, { capture: true }); removeEventListener('hashchange', late); cancelAnimationFrame(raf)
    }
  }, [])
  if (isCoarse) return null
  const c = 'absolute h-2.5 w-2.5 border-ink/80'
  return (
    <>
      <div ref={box} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[99] h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-difference">
        <span className={`${c} left-0 top-0 border-l border-t`} /><span className={`${c} right-0 top-0 border-r border-t`} />
        <span className={`${c} bottom-0 left-0 border-b border-l`} /><span className={`${c} bottom-0 right-0 border-b border-r`} />
        <span ref={label} className="mono absolute inset-0 grid place-items-center text-[10px] text-ink opacity-0 transition-opacity duration-300">Открыть</span>
      </div>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[99] -ml-[2.5px] -mt-[2.5px] h-[5px] w-[5px] rounded-full bg-signal opacity-0" />
    </>
  )
}
