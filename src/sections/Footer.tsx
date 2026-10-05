import { BRAND } from '../config/site'
import { ContactLink } from '../components/ui'
import { Mark } from '../components/Logo'
import { scrollToId } from '../lib/motion'

/** Минималистичный подвал + крупное имя-«подпись» */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] pt-16">
      <div className="wrap flex flex-wrap items-start justify-between gap-10">
        <div className="flex items-center gap-3"><Mark size={30} /><div><p className="text-[16px] font-semibold tracking-[0.06em]">{BRAND.name}</p><p className="mono mt-1 text-dim">{BRAND.role}</p></div></div>
        <div className="flex gap-8">
          <ContactLink k="telegram" className="text-[15px] text-muted hover:text-ink">Telegram</ContactLink>
          <ContactLink k="instagram" className="text-[15px] text-muted hover:text-ink">Instagram</ContactLink>
          <button onClick={() => scrollToId('#top')} className="mono text-dim hover:text-ink">Наверх ↑</button>
        </div>
      </div>
      <p aria-hidden className="mt-16 select-none whitespace-nowrap text-center text-[clamp(64px,19vw,320px)] font-semibold leading-[0.78] tracking-[-0.06em] text-transparent [background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,0)_80%)] [-webkit-background-clip:text] [background-clip:text]">{BRAND.name}</p>
      <div className="wrap flex justify-between border-t border-white/[0.06] py-6"><span className="mono text-dim">© {BRAND.year} {BRAND.name}</span><span className="mono text-dim">{BRAND.city}</span></div>
    </footer>
  )
}
