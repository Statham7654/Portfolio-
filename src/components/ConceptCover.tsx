/**
 * Обложки-концепты для проектов без реальных материалов (ресторан, beauty, авто).
 * Это не стоковые фото, а нарисованные «первые экраны» в стиле сайта. Замените их реальными работами в config/site.ts.
 */
type Kind = 'restaurant' | 'beauty' | 'automotive'

export default function ConceptCover({ kind }: { kind: Kind }) {
  if (kind === 'restaurant') return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(90%_80%_at_70%_55%,#2a1a10_0%,#0d0907_60%,#050403_100%)]">
      {/* тарелка: керамика, соус, свет свечи */}
      <div className="absolute right-[8%] top-1/2 aspect-square w-[46%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_40%_35%,#f4efe7_0%,#d9d0c4_45%,#8b8075_70%,#2a221c_72%,transparent_73%)] shadow-[0_40px_80px_rgba(0,0,0,.7)]">
        <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle_at_45%_45%,#efe7dc,#cfc4b6_80%)]" />
        <div className="absolute left-[34%] top-[36%] h-[30%] w-[34%] rotate-[-18deg] rounded-[50%] bg-[radial-gradient(circle_at_40%_40%,#9b3b1d,#5c1d0c_70%)] blur-[1px]" />
        <div className="absolute left-[46%] top-[30%] h-[8%] w-[8%] rounded-full bg-[#6f8a3a]" />
        <div className="absolute left-[52%] top-[44%] h-[5%] w-[5%] rounded-full bg-[#a7c35c]" />
      </div>
      <div className="absolute left-[60%] top-[8%] h-[30%] w-[30%] rounded-full bg-[#ffb35c] opacity-25 blur-[60px]" />
    </div>
  )
  if (kind === 'beauty') return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,#f3e6df_0%,#e9d3c9_45%,#d8b8ab_100%)]">
      <div className="absolute right-[10%] top-[14%] aspect-square w-[42%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fffaf6,#f1d9cf_45%,#c99b8a_80%)] shadow-[0_50px_90px_rgba(120,70,55,.35)]" />
      <div className="absolute right-[4%] top-[8%] aspect-square w-[54%] rounded-full border border-[#2b2320]/15" />
      <div className="absolute right-[16%] top-[22%] aspect-square w-[30%] rounded-full border border-white/60" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-white/40 blur-[70px]" />
    </div>
  )
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_90%_at_50%_120%,#1b2230_0%,#07090d_55%,#030405_100%)]">
      {/* световые линии скорости и «фары» */}
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className="absolute h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" style={{ top: `${38 + i * 4.2}%`, left: `${-10 + (i % 3) * 8}%`, width: `${60 + (i % 4) * 12}%`, opacity: 0.15 + (i % 3) * 0.2 }} />
      ))}
      <svg viewBox="0 0 1000 400" className="absolute bottom-[16%] right-[-4%] w-[86%]" aria-hidden>
        <defs>
          <linearGradient id="vbody" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#46536a" /><stop offset=".5" stopColor="#141922" /><stop offset="1" stopColor="#050608" /></linearGradient>
          <linearGradient id="vrim" x1="0" x2="1"><stop offset="0" stopColor="rgba(220,235,255,0)" /><stop offset=".5" stopColor="rgba(220,235,255,.95)" /><stop offset="1" stopColor="rgba(220,235,255,0)" /></linearGradient>
          <radialGradient id="vwheel"><stop offset=".55" stopColor="#0a0c10" /><stop offset=".62" stopColor="#3a4250" /><stop offset=".7" stopColor="#07080a" /></radialGradient>
        </defs>
        <path d="M60 300 C 90 250, 180 236, 300 228 C 380 180, 470 132, 600 126 C 700 122, 790 160, 860 214 C 920 222, 960 250, 968 290 L 968 318 L 60 318 Z" fill="url(#vbody)" />
        <path d="M300 228 C 380 180, 470 132, 600 126 C 700 122, 790 160, 860 214" fill="none" stroke="url(#vrim)" strokeWidth="2.5" />
        <path d="M430 176 C 480 150, 540 142, 600 142 C 660 142, 720 162, 760 196 L 440 200 Z" fill="rgba(140,170,210,.12)" stroke="rgba(200,220,255,.25)" />
        <circle cx="250" cy="318" r="62" fill="url(#vwheel)" /><circle cx="790" cy="318" r="62" fill="url(#vwheel)" />
        <rect x="900" y="246" width="60" height="9" rx="4" fill="#eaf2ff" /><rect x="70" y="270" width="40" height="7" rx="3" fill="#ff3b30" />
      </svg>
      <div className="absolute bottom-[38%] right-[1%] h-[10%] w-[14%] rounded-full bg-[#cfe0ff] opacity-40 blur-[30px]" />
      <div className="absolute bottom-[14%] left-[4%] right-[4%] h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(0deg,rgba(212,255,90,.06),transparent)]" />
    </div>
  )
}
