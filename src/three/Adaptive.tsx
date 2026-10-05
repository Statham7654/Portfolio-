import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

/**
 * Адаптивное качество: если средний кадр дольше ~22 мс (меньше ~45 fps), ступенчато снижаем плотность пикселей
 * (1.5 → 1.15 → 0.85), а на последней ступени вызываем onLow (например, выключить мягкие тени). Повышать обратно не пытаемся.
 */
export default function Adaptive({ onLow }: { onLow?: () => void }) {
  const gl = useThree((s) => s.gl), setDpr = useThree((s) => s.setDpr)
  const st = useRef({ t: 0, n: 0, level: 0, skip: 30 })
  useFrame((_, dt) => {
    const s = st.current
    if (s.skip > 0) { s.skip--; return } // первые кадры — компиляция шейдеров, их не считаем
    s.t += dt; s.n++
    if (s.t < 1.2) return
    const avg = s.t / s.n
    s.t = 0; s.n = 0
    if (avg > 0.022 && s.level < 3) {
      s.level++
      const cur = gl.getPixelRatio()
      const next = s.level === 1 ? Math.min(cur, 1.15) : s.level === 2 ? Math.min(cur, 0.85) : cur
      if (next < cur) setDpr(next)
      if (s.level === 3) onLow?.()
      s.skip = 20
    }
  })
  return null
}
