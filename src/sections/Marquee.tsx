import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from 'motion/react'
import { MARQUEE } from '../config/site'
import { reducedMotion } from '../lib/env'

/**
 * Кинетическая строка: две ленты едут навстречу. Скорость и наклон зависят от скорости скролла —
 * чем резче прокрутка, тем сильнее «разгон». Когда скроллят вверх — ленты меняют направление.
 */
function Row({ base, outline }: { base: number; outline?: boolean }) {
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(vel, [-2000, 0, 2000], [-4, 0, 4], { clamp: false })
  const skew = useTransform(vel, [-2500, 2500], [4, -4])
  const dir = useRef(1)
  useAnimationFrame((_, dt) => {
    if (reducedMotion) return
    const b = boost.get()
    if (b < -0.05) dir.current = -1; else if (b > 0.05) dir.current = 1
    x.set(wrap(-50, 0, x.get() + dir.current * base * (dt / 1000) * (1 + Math.abs(b))))
  })
  const tx = useTransform(x, (v) => `${v}%`)
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <motion.div className="flex w-max whitespace-nowrap will-change-transform" style={{ x: tx, skewX: reducedMotion ? 0 : skew }}>
      {[0, 1].map((k) => (
        <div key={k} className="flex shrink-0 items-center">
          {items.map((t, i) => (
            <span key={i} className="flex items-center">
              <span className={`display px-[0.35em] text-[clamp(56px,9vw,150px)] uppercase ${(i + (outline ? 1 : 0)) % 2 ? 'bg-[linear-gradient(180deg,#4a4a52_0%,#232328_55%,#3a3a42_100%)] bg-clip-text text-transparent' : 'chrome'}`}>{t}</span>
              <Star />
            </span>
          ))}
        </div>
      ))}
    </motion.div>
  )
}

const Star = () => (
  <svg viewBox="0 0 24 24" className="h-[clamp(18px,2.4vw,36px)] w-[clamp(18px,2.4vw,36px)] shrink-0 text-signal drop-shadow-[0_0_10px_rgba(212,255,90,.6)]" aria-hidden>
    <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill="currentColor" />
  </svg>
)

export default function Marquee() {
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-white/[0.06] bg-coal py-10 sm:py-14">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[12vw] bg-gradient-to-r from-coal to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[12vw] bg-gradient-to-l from-coal to-transparent" />
      <div className="grid gap-2 sm:gap-4">
        <Row base={2.2} />
        <Row base={-1.6} outline />
      </div>
    </div>
  )
}
