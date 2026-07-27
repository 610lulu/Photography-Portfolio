/** shared normalised mouse position, x/y in [-1, 1] */
export const mouse = { x: 0, y: 0 }

let bound = false
export function bindMouse() {
  if (bound) return
  bound = true
  window.addEventListener(
    'mousemove',
    (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    },
    { passive: true },
  )
  window.addEventListener(
    'touchmove',
    (e) => {
      const t = e.touches[0]
      if (!t) return
      mouse.x = (t.clientX / window.innerWidth) * 2 - 1
      mouse.y = (t.clientY / window.innerHeight) * 2 - 1
    },
    { passive: true },
  )
}
