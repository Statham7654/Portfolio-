import { useEffect, useRef } from 'react'
import type { Work } from '../config/site'
import ConceptCover from './ConceptCover'
import { isCoarse, reducedMotion } from '../lib/env'

/**
 * Медиа проекта: обложка; видео подгружается только когда карточка рядом, на десктопе играет при наведении,
 * на телефоне — когда карточка в кадре. Концепты рисуются компонентом ConceptCover.
 */
export default function Media({ w, active, className = '', eager = false }: { w: Work; active: boolean; className?: string; eager?: boolean }) {
  const v = useRef<HTMLVideoElement>(null)
  const auto = isCoarse
  useEffect(() => {
    const el = v.current
    if (!el || reducedMotion) return
    if (active) { el.preload = 'auto'; el.play().catch(() => {}) } else el.pause()
  }, [active])

  if (!w.cover) return <div className={`absolute inset-0 ${className}`}><ConceptCover kind={w.concept!} /></div>
  return (
    <div className={`absolute inset-0 ${className}`}>
      <img src={w.cover} alt={`${w.title} — первый экран сайта`} loading={eager ? 'eager' : 'lazy'} decoding="async" width={1280} height={800} className="absolute inset-0 h-full w-full object-cover" />
      {w.video && (
        <video ref={v} muted loop playsInline preload="none" poster={w.cover} aria-hidden tabIndex={-1}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${active || auto ? 'opacity-100' : 'opacity-0'}`}>
          <source src={w.video.mp4} type="video/mp4" />
          <source src={w.video.webm} type="video/webm" />
        </video>
      )}
    </div>
  )
}
