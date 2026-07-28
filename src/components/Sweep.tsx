import { windowT } from '../data/gallery'

import { memo } from 'react'

interface Props {
  text: string
  range: [number, number]
  progress: number
}

/** giant display text sweeping horizontally across the screen */
function Sweep({ text, range, progress }: Props) {
  const [a, b] = range
  /* 提前卸载，避免越界文本仍在合成层中占位 */
  if (progress <= a - 0.01 || progress >= b + 0.01) return null
  const t = windowT(progress, a, b)

  const offset = (0.5 - t) * 170 // +85vw → -85vw
  const opacity = t < 0.12 ? t / 0.12 : t > 0.88 ? (1 - t) / 0.12 : 1

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <h2
        className="absolute left-1/2 top-1/2 whitespace-nowrap font-black text-white"
        style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: 'clamp(76px, 13.5vw, 250px)',
          letterSpacing: '0.05em',
          lineHeight: 1,
          transform: `translate(calc(-50% + ${offset.toFixed(2)}vw), -50%)`,
          opacity: opacity * 0.36,
        }}
      >
        {text}
      </h2>
    </div>
  )
}

export default memo(Sweep)
