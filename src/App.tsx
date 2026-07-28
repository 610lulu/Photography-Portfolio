import { useCallback, useEffect, useRef, useState } from 'react'
import Gallery3D from './components/Gallery3D'
import PixelFocus from './components/PixelFocus'
import Sweep from './components/Sweep'
import Chrome from './components/Chrome'
import Lightbox from './components/Lightbox'
import { Hero, Outro, SectionCards } from './components/Overlays'
import { activeFocus, SECTIONS } from './data/gallery'

const SCROLL_VH = 1400 // page length in viewport heights

export default function App() {
  const [progress, setProgress] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const progressRef = useRef(0)
  const trackingRef = useRef(true)

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      progressRef.current = p
    }
    measure()
    /* 每帧读一次滚动进度，仅在变化超过阈值时驱动 React 重渲染 */
    let last = -1
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      measure()
      const p = progressRef.current
      if (Math.abs(p - last) > 0.0006 || (p === 0 && last !== 0) || (p === 1 && last !== 1)) {
        last = p
        setProgress(p)
      }
    }
    loop()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const openPhoto = useCallback((index: number) => setLightbox(index), [])
  const closePhoto = useCallback(() => setLightbox(null), [])

  const focus = activeFocus(progress)

  return (
    <div className="bg-black text-white antialiased">
      {/* virtual travel distance */}
      <div style={{ height: `${SCROLL_VH}vh` }} aria-hidden />

      <Gallery3D progressRef={progressRef} trackingRef={trackingRef} onPhotoClick={openPhoto} />

      {/* giant sweep typography */}
      <Sweep text="BLACK & WHITE" range={SECTIONS[1].sweep} progress={progress} />
      <Sweep text="COLOR" range={SECTIONS[2].sweep} progress={progress} />
      <Sweep text="POLAROID" range={SECTIONS[3].sweep} progress={progress} />

      {/* narrative overlays */}
      <Hero progress={progress} />
      <SectionCards progress={progress} />
      <Outro progress={progress} />

      {/* centre-stage photo with pixel shatter */}
      <PixelFocus stop={focus} />

      {/* fixed chrome */}
      <Chrome progress={progress} />

      {/* lightbox */}
      <Lightbox photoIndex={lightbox} onClose={closePhoto} />
    </div>
  )
}
