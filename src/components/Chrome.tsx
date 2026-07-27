import { memo } from 'react'
import { activeSection, SECTIONS } from '../data/gallery'

const grotesk = { fontFamily: "'Space Grotesk', sans-serif" }
const archivo = { fontFamily: "'Archivo', sans-serif" }

interface Props {
  progress: number
  tracking: boolean
  onToggleTracking: () => void
}

function Chrome({ progress, tracking, onToggleTracking }: Props) {
  const current = activeSection(progress)

  const jump = (start: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: start * max + 2, behavior: 'smooth' })
  }

  return (
    <>
      {/* film grain + vignette */}
      <div className="grain pointer-events-none fixed inset-0 z-30" />
      <div
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* brand — top left */}
      <header className="fixed left-6 top-6 z-40 flex items-baseline gap-4 md:left-8 md:top-7">
        <span
          className="text-sm font-bold uppercase text-white"
          style={{ ...archivo, letterSpacing: '0.32em' }}
        >
          Yilin Lu
        </span>
        <span
          className="hidden text-[9px] uppercase text-white/45 sm:inline"
          style={{ ...grotesk, letterSpacing: '0.34em' }}
        >
          A gallery of light and shadow
        </span>
      </header>

      {/* head tracking pill — top right */}
      <button
        onClick={onToggleTracking}
        className="fixed right-6 top-6 z-40 flex items-center gap-2.5 rounded-full border border-white/25 px-4 py-1.5 transition-colors hover:border-white/60 md:right-8 md:top-7"
        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full transition-colors"
          style={{ background: tracking ? '#4ade80' : 'rgba(255,255,255,0.35)' }}
        />
        <span
          className="text-[9px] font-medium uppercase text-white/80"
          style={{ ...grotesk, letterSpacing: '0.3em' }}
        >
          Head tracking
        </span>
      </button>

      {/* section rail — right */}
      <nav className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-5 md:right-8 md:flex">
        {SECTIONS.map((s) => {
          const active = current.id === s.id
          return (
            <button
              key={s.id}
              onClick={() => jump(s.start)}
              className="group flex items-center gap-3"
            >
              <span
                className="text-[9px] uppercase transition-all duration-300"
                style={{
                  ...grotesk,
                  letterSpacing: '0.26em',
                  color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.32)',
                }}
              >
                {s.index} · {s.title}
              </span>
              <span
                className="rounded-full transition-all duration-300"
                style={{
                  width: active ? 7 : 5,
                  height: active ? 7 : 5,
                  background: active ? '#fff' : 'rgba(255,255,255,0.3)',
                  boxShadow: active ? '0 0 10px rgba(255,255,255,0.7)' : 'none',
                }}
              />
            </button>
          )
        })}
      </nav>

      {/* travel progress hairline — bottom left */}
      <div className="fixed bottom-[54px] left-6 z-40 hidden h-px w-40 bg-white/15 md:left-8 md:block">
        <div
          className="h-px bg-white/80"
          style={{ width: `${(progress * 100).toFixed(1)}%`, transition: 'width 0.15s linear' }}
        />
      </div>

      {/* footer hints */}
      <footer className="fixed bottom-5 left-6 right-6 z-40 flex items-center justify-between md:left-8 md:right-8">
        <span
          className="text-[9px] uppercase text-white/45"
          style={{ ...grotesk, letterSpacing: '0.3em' }}
        >
          Scroll to travel
        </span>
        <span
          className="hidden text-[9px] uppercase text-white/45 sm:inline"
          style={{ ...grotesk, letterSpacing: '0.3em' }}
        >
          Sweep your head
        </span>
        <span
          className="hidden text-[9px] uppercase text-white/45 sm:inline"
          style={{ ...grotesk, letterSpacing: '0.3em' }}
        >
          Click a photo
        </span>
        <span
          className="flex items-center gap-1.5 rounded-sm bg-white/10 px-2 py-1 text-[9px] font-semibold text-white/70"
          style={{ ...grotesk, letterSpacing: '0.12em' }}
        >
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-white text-[8px] font-black text-black">
            K
          </span>
          Kimi Agent
        </span>
      </footer>
    </>
  )
}

export default memo(Chrome)
