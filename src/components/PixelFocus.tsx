import { useEffect, useMemo, useRef, useState } from 'react'
import { FOCUS_STOPS, PHOTOS, type FocusStop } from '../data/gallery'
import { mouse } from '../lib/mouse'

const GRID = 10

interface Tile {
  delay: number
  dx: number
  dy: number
  rot: number
}

const makeTiles = (): Tile[] =>
  Array.from({ length: GRID * GRID }, () => ({
    delay: Math.random() * 0.22,
    dx: (Math.random() - 0.5) * 160,
    dy: (Math.random() - 0.5) * 160,
    rot: (Math.random() - 0.5) * 50,
  }))

interface Props {
  stop: FocusStop | null
}

/* 预加载所有焦点照片，避免滚动到位置时才请求网络 */
let preloaded = false
function preloadFocusImages() {
  if (preloaded) return
  preloaded = true
  for (const s of FOCUS_STOPS) {
    const img = new Image()
    img.src = s.src
  }
}

/**
 * Centre-stage photo that assembles / dissolves through a pixel-shatter
 * whenever the active focus stop changes.
 */
export default function PixelFocus({ stop }: Props) {
  useEffect(preloadFocusImages, [])
  const [shown, setShown] = useState<FocusStop | null>(null)
  const [scattered, setScattered] = useState(true)
  const [tiles, setTiles] = useState<Tile[]>(() => makeTiles())
  const frameRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)

    if (!stop) {
      /* shatter whatever is on stage, then unmount */
      if (shown) {
        setTiles(makeTiles())
        setScattered(true)
        timer.current = setTimeout(() => setShown(null), 420)
      }
      return
    }
    if (!shown) {
      setShown(stop)
      setTiles(makeTiles())
      setScattered(true)
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setScattered(false)),
      )
      timer.current = setTimeout(() => undefined, 0)
      return () => cancelAnimationFrame(id)
    }
    if (shown.src !== stop.src) {
      /* dissolve old, assemble new */
      setTiles(makeTiles())
      setScattered(true)
      timer.current = setTimeout(() => {
        setShown(stop)
        setTiles(makeTiles())
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setScattered(false)),
        )
      }, 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stop?.src, stop?.p])

  /* gentle mouse parallax so the centre stage sits in the same space */
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
    () => (shown ? PHOTOS.find((p) => p.src === shown.src) ?? null : null),
    [shown],
  )

  if (!shown || !photo) return null

  const aspect = photo.w / photo.h

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col items-center justify-center">
      <div ref={frameRef} className="will-change-transform">
        <div
          className="relative"
          style={{
            aspectRatio: `${photo.w} / ${photo.h}`,
            width: `min(30vw, calc(44vh * ${aspect}))`,
          }}
        >
          {tiles.map((tile, i) => {
            const col = i % GRID
            const row = Math.floor(i / GRID)
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${(col / GRID) * 100}%`,
                  top: `${(row / GRID) * 100}%`,
                  width: `${100 / GRID + 0.12}%`,
                  height: `${100 / GRID + 0.12}%`,
                  backgroundImage: `url(${shown.src})`,
                  backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                  backgroundPosition: `${(col / (GRID - 1)) * 100}% ${(row / (GRID - 1)) * 100}%`,
                  opacity: scattered ? 0 : 1,
                  transform: scattered
                    ? `translate(${tile.dx}px, ${tile.dy}px) rotate(${tile.rot}deg) scale(0.6)`
                    : 'translate(0px, 0px) rotate(0deg) scale(1)',
                  transition: `transform 0.62s cubic-bezier(0.22, 1, 0.36, 1) ${tile.delay}s, opacity 0.5s ease ${tile.delay}s`,
                }}
              />
            )
          })}
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-white/40" />
          <p
            className="text-[10px] font-medium uppercase text-white/80 transition-opacity duration-500"
            style={{ letterSpacing: '0.42em', opacity: scattered ? 0 : 1 }}
          >
            {shown.caption}
          </p>
          <span className="h-px w-8 bg-white/40" />
        </div>
      </div>
    </div>
  )
}
