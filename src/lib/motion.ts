import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { reducedMotion } from './env'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

let lenis: Lenis | null = null
export function initSmoothScroll() {
  if (reducedMotion || lenis) return
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, touchMultiplier: 1.2 })
  lenis.on('scroll', ScrollTrigger.update)
  ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis // для автотестов: мгновенная прокрутка
  gsap.ticker.add((t) => lenis?.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}
export function lockScroll(lock: boolean) {
  if (lenis) lock ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}
export function scrollToId(id: string) {
  const el = document.querySelector(id) as HTMLElement | null
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.5, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
  else el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
}
export const EASE = [0.16, 1, 0.3, 1] as const
