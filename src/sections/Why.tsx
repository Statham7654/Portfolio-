import { motion } from 'motion/react'
import { WHY } from '../config/site'
import { EASE } from '../lib/motion'

/** Почему я: минимализм — пять строк, крупный кегль, номер; при наведении строка подсвечивается */
export default function Why() {
  return (
    <section id="why" className="relative border-t border-white/[0.06] py-28 sm:py-40">
      <div className="wrap grid gap-12 lg:grid-cols-[0.6fr_1.4fr]">
        <p className="mono flex items-center gap-3 self-start text-muted lg:sticky lg:top-28"><span className="text-signal">05</span><span className="h-px w-10 bg-white/20" />Почему я</p>
        <ol className="border-t border-white/[0.08]">
          {WHY.map((t, i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 1, delay: i * 0.06, ease: EASE }}
              className="group flex items-baseline gap-6 border-b border-white/[0.08] py-7 sm:gap-10 sm:py-9">
              <span className="mono text-dim transition-colors group-hover:text-signal">0{i + 1}</span>
              <span className="text-[clamp(22px,3vw,44px)] font-medium leading-[1.15] tracking-[-0.03em] text-white/55 transition-colors duration-500 group-hover:text-ink">{t}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
