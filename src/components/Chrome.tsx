import { memo } from 'react'
import { activeSection, SECTIONS } from '../data/gallery'

const grotesk = { fontFamily: "'Space Grotesk', sans-serif" }
const archivo = { fontFamily: "'Archivo', sans-serif" }

interface Props {
  progress: number
}

function Chrome({ progress }: Props) {
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
    </>
  )
}

export default memo(Chrome)
