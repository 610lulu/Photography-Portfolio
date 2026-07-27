export type Tone = 'bw' | 'color' | 'polaroid'

export interface Photo {
  src: string
  w: number
  h: number
  tone: Tone
}

const photo = (filename: string) => `${import.meta.env.BASE_URL}photos/${filename}`

export const PHOTOS: Photo[] = [
  { src: photo('bw_tree.jpg'), w: 640, h: 853, tone: 'bw' },
  { src: photo('bw_crosswalk.jpg'), w: 640, h: 480, tone: 'bw' },
  { src: photo('bw_stairs.jpg'), w: 640, h: 1137, tone: 'bw' },
  { src: photo('bw_alley.jpg'), w: 640, h: 853, tone: 'bw' },
  { src: photo('bw_window.jpg'), w: 640, h: 480, tone: 'bw' },
  { src: photo('color_plane.jpg'), w: 640, h: 480, tone: 'color' },
  { src: photo('color_diner.jpg'), w: 640, h: 557, tone: 'color' },
  { src: photo('color_beach.jpg'), w: 640, h: 959, tone: 'color' },
  { src: photo('color_jump.jpg'), w: 640, h: 424, tone: 'color' },
  { src: photo('pol_woman.jpg'), w: 736, h: 969, tone: 'polaroid' },
  { src: photo('pol_man.jpg'), w: 736, h: 969, tone: 'polaroid' },
  { src: photo('pol_child.jpg'), w: 736, h: 969, tone: 'polaroid' },
]

export const photoIndex = (src: string) => PHOTOS.findIndex((p) => p.src === src)

/* ------------------------------- timeline ------------------------------- */

export interface SectionStop {
  id: string
  index: string
  title: string
  works: string
  /** nav active range */
  start: number
  end: number
  /** center title card visible range */
  card: [number, number]
  /** giant sweep text range */
  sweep: [number, number]
}

export const SECTIONS: SectionStop[] = [
  { id: 'top', index: '00', title: 'TOP', works: '', start: 0, end: 0.1, card: [0, 0], sweep: [0.015, 0.105] },
  { id: 'bw', index: '01', title: 'BLACK & WHITE', works: '68 WORKS', start: 0.1, end: 0.4, card: [0.135, 0.215], sweep: [0.115, 0.225] },
  { id: 'color', index: '02', title: 'COLOR', works: '27 WORKS', start: 0.4, end: 0.72, card: [0.435, 0.515], sweep: [0.415, 0.525] },
  { id: 'polaroid', index: '03', title: 'POLAROID', works: '01 WORKS', start: 0.72, end: 1, card: [0.745, 0.815], sweep: [0.725, 0.83] },
]

export interface FocusStop {
  p: number
  src: string
  caption: string
}

/** photos that drift to centre while travelling */
export const FOCUS_STOPS: FocusStop[] = [
  { p: 0.26, src: photo('bw_stairs.jpg'), caption: 'BW 24' },
  { p: 0.315, src: photo('bw_crosswalk.jpg'), caption: 'BW 31' },
  { p: 0.365, src: photo('bw_alley.jpg'), caption: 'BW 08' },
  { p: 0.56, src: photo('color_plane.jpg'), caption: 'COLOR 12' },
  { p: 0.615, src: photo('color_diner.jpg'), caption: 'COLOR 19' },
  { p: 0.67, src: photo('color_beach.jpg'), caption: 'COLOR 27' },
  { p: 0.845, src: photo('pol_woman.jpg'), caption: 'POLAROID 02' },
  { p: 0.885, src: photo('pol_man.jpg'), caption: 'POLAROID 16' },
  { p: 0.925, src: photo('pol_child.jpg'), caption: 'POLAROID 63' },
]

export const FOCUS_HALF = 0.026

export const HERO_END = 0.095
export const OUTRO_START = 0.955

export const activeFocus = (progress: number): FocusStop | null => {
  for (const s of FOCUS_STOPS) {
    if (progress >= s.p - FOCUS_HALF && progress <= s.p + FOCUS_HALF) return s
  }
  return null
}

export const activeSection = (progress: number): SectionStop =>
  SECTIONS.find((s) => progress >= s.start && progress < s.end) ?? SECTIONS[SECTIONS.length - 1]

/** eased 0→1 helper for a progress window */
export const windowT = (progress: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (progress - a) / (b - a)))

/** fade in/out bell for a window: 0 at edges, 1 inside plateau */
export const bell = (progress: number, a: number, b: number, edge = 0.25) => {
  if (progress <= a || progress >= b) return 0
  const t = (progress - a) / (b - a)
  if (t < edge) return t / edge
  if (t > 1 - edge) return (1 - t) / edge
  return 1
}
