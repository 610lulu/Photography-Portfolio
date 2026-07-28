import { useEffect, useMemo, useRef } from 'react'
import { FOCUS_STOPS, PHOTOS, type FocusStop } from '../data/gallery'
import { mouse } from '../lib/mouse'

interface Props {
  stop: FocusStop | null
}

let preloaded = false
function preloadFocusImages() {
  if (preloaded) return
  preloaded = true
  for (const focus of FOCUS_STOPS) {
    const image = new Image()
    image.src = focus.src
  }
}

export default function PixelFocus({ stop }: Props) {
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(preloadFocusImages, [])

  useEffect(() => {
    let raf = 0
    const pos = { x: 0, y: 0 }
    const loop = () => {
      raf = requestAnimationFrame(loop)
      pos.x += (mouse.x * -14 - pos.x) * 0.06
      pos.y += (mouse.y * -9 - pos.y) * 0.06
      if (frameRef.current) {
        frameRef.current.style.transform = `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0)`
      }
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])

  const photo = useMemo(
    () => (stop ? PHOTOS.find((item) => item.src === stop.src) ?? null : null),
    [stop],
  )

  if (!stop || !photo) return null

  const aspect = photo.w / photo.h

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col items-center justify-center">
      <div ref={frameRef} className="will-change-transform">
        <img
          src={photo.src}
          alt=""
          draggable={false}
          className="block object-contain"
          style={{
            aspectRatio: `${photo.w} / ${photo.h}`,
            width: `min(30vw, calc(44vh * ${aspect}))`,
          }}
        />
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-white/40" />
          <p
            className="text-[10px] font-medium uppercase text-white/80"
            style={{ letterSpacing: '0.42em' }}
          >
            {stop.caption}
          </p>
          <span className="h-px w-8 bg-white/40" />
        </div>
      </div>
    </div>
  )
}
