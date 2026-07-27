import { useEffect } from 'react'
import { PHOTOS } from '../data/gallery'

interface Props {
  photoIndex: number | null
  onClose: () => void
}

export default function Lightbox({ photoIndex, onClose }: Props) {
  useEffect(() => {
    if (photoIndex === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photoIndex, onClose])

  if (photoIndex === null) return null
  const photo = PHOTOS[photoIndex]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-6 backdrop-blur-sm"
      onClick={onClose}
      style={{ animation: 'lb-fade 0.28s ease both' }}
    >
      <figure className="max-h-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.src}
          alt="gallery photo"
          className="mx-auto max-h-[80vh] max-w-[88vw] border border-white/15 object-contain shadow-2xl shadow-black"
          style={{ animation: 'lb-zoom 0.35s cubic-bezier(0.22, 1, 0.36, 1) both' }}
        />
        <figcaption className="mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-white/40" />
          <span
            className="text-[10px] font-medium uppercase text-white/75"
            style={{ letterSpacing: '0.42em', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {photo.tone === 'bw' ? 'Black & White' : photo.tone === 'color' ? 'Color' : 'Polaroid'} — click anywhere to close
          </span>
          <span className="h-px w-8 bg-white/40" />
        </figcaption>
      </figure>
    </div>
  )
}
