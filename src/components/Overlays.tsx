import { memo } from 'react'
import { bell, HERO_END, OUTRO_START, SECTIONS, windowT } from '../data/gallery'

const archivo = { fontFamily: "'Archivo', sans-serif" }
const grotesk = { fontFamily: "'Space Grotesk', sans-serif" }

/* ---------------------------------- hero --------------------------------- */

export const Hero = memo(function Hero({ progress }: { progress: number }) {
  if (progress > HERO_END) return null
  const opacity = 1 - windowT(progress, HERO_END * 0.55, HERO_END)
  const drift = windowT(progress, 0, HERO_END) * -40

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center"
      style={{ opacity }}
    >
      <div
        className="text-center"
        style={{ transform: `translateY(${drift.toFixed(1)}px)` }}
      >
        <p
          className="mb-6 text-[10px] font-medium uppercase text-white/55"
          style={{ ...grotesk, letterSpacing: '0.62em' }}
        >
          Photography
        </p>
        <h1
          className="font-black uppercase leading-[0.95] text-white"
          style={{ ...archivo, fontSize: 'clamp(44px, 7.2vw, 118px)', letterSpacing: '0.04em' }}
        >
          Yilin Lu
        </h1>
        <p
          className="mt-3 text-sm font-medium uppercase text-white/85"
          style={{ ...archivo, letterSpacing: '0.55em' }}
        >
          Black &amp; White
        </p>
        <div className="mx-auto mt-7 h-px w-24 bg-white/35" />
        <p
          className="mt-7 text-[10px] uppercase text-white/55"
          style={{ ...grotesk, letterSpacing: '0.5em' }}
        >
          A gallery of light and shadow
        </p>
        <p
          className="mt-2 text-[9px] uppercase text-white/30"
          style={{ ...grotesk, letterSpacing: '0.4em' }}
        >
          Three.js × scroll experiment
        </p>
      </div>
    </div>
  )
})

/* ------------------------------ section card ------------------------------ */

export const SectionCards = memo(function SectionCards({ progress }: { progress: number }) {
  return (
    <>
      {SECTIONS.filter((s) => s.id !== 'top').map((s) => {
        const opacity = bell(progress, s.card[0], s.card[1], 0.28)
        if (opacity <= 0) return null
        const t = windowT(progress, s.card[0], s.card[1])
        return (
          <div
            key={s.id}
            className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center"
            style={{ opacity }}
          >
            <div
              className="text-center"
              style={{ transform: `translateY(${(0.5 - t) * 46}px)` }}
            >
              <p
                className="mb-5 text-[11px] font-medium text-white/60"
                style={{ ...grotesk, letterSpacing: '0.6em' }}
              >
                {s.index}
              </p>
              <h2
                className="font-black uppercase leading-none text-white"
                style={{ ...archivo, fontSize: 'clamp(34px, 4.6vw, 76px)', letterSpacing: '0.08em' }}
              >
                {s.title}
              </h2>
              <div className="mx-auto mt-6 h-px w-16 bg-white/35" />
              <p
                className="mt-6 text-[10px] uppercase text-white/55"
                style={{ ...grotesk, letterSpacing: '0.5em' }}
              >
                {s.works}
              </p>
            </div>
          </div>
        )
      })}
    </>
  )
})

/* ---------------------------------- outro --------------------------------- */

export const Outro = memo(function Outro({ progress }: { progress: number }) {
  if (progress < OUTRO_START) return null
  const opacity = windowT(progress, OUTRO_START, 1)
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center"
      style={{ opacity }}
    >
      <div className="text-center">
        <h2
          className="font-black uppercase leading-[0.95] text-white"
          style={{ ...archivo, fontSize: 'clamp(40px, 6.4vw, 104px)', letterSpacing: '0.04em' }}
        >
          Yilin Lu
        </h2>
        <p
          className="mt-4 text-[11px] uppercase text-white/60"
          style={{ ...grotesk, letterSpacing: '0.5em' }}
        >
          A gallery of light and shadow
        </p>
        <div className="mx-auto mt-8 h-px w-16 bg-white/30" />
        <p
          className="mt-8 text-[9px] uppercase text-white/30"
          style={{ ...grotesk, letterSpacing: '0.42em' }}
        >
          © MMXXVI — end of gallery — scroll back to revisit
        </p>
      </div>
    </div>
  )
})
