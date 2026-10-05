import { BRAND } from '../config/site'

/** Знак: уголки видоискателя + сигнальная точка; рядом — имя */
export function Mark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M3 11V3h8M21 3h8v8M29 21v8h-8M11 29H3v-8" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="3.5" fill="#d4ff5a" />
    </svg>
  )
}
export default function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Mark />
      <span className="text-[15px] font-semibold tracking-[0.06em]">{BRAND.name}<sup className="mono ml-1 text-[9px] text-dim">{BRAND.suffix}</sup></span>
    </span>
  )
}
