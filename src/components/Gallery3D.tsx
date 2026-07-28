import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { PHOTOS } from '../data/gallery'
import { bindMouse, mouse } from '../lib/mouse'

interface Props {
  progressRef: React.MutableRefObject<number>
  trackingRef: React.MutableRefObject<boolean>
  onPhotoClick: (photoIndex: number) => void
}

const TRAVEL = 96 // total camera depth

/* deterministic pseudo-random */
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

interface PlaneSpec {
  photo: number
  x: number
  y: number
  z: number
  scale: number
  rotY: number
  rotZ: number
  phase: number
}

function buildSpecs(): PlaneSpec[] {
  const specs: PlaneSpec[] = []
  let seed = 1
  const push = (photo: number, side: number, z: number, scale = 1) => {
    seed += 1
    const yJitter = (rand(seed * 3.3) - 0.5) * 2.6
    const xJitter = rand(seed * 7.1) * 1.1
    specs.push({
      photo,
      x: side * (3.15 + xJitter),
      y: yJitter,
      z,
      scale: scale * (0.85 + rand(seed * 5.7) * 0.4),
      rotY: -side * (0.08 + rand(seed * 9.3) * 0.14),
      rotZ: (rand(seed * 11.9) - 0.5) * 0.09,
      phase: rand(seed * 13.7) * Math.PI * 2,
    })
  }

  const bw = [0, 1, 2, 3, 4]
  const color = [5, 6, 7, 8, 12]
  const pol = [9, 10, 11]

  /* hero cluster — colour left, b&w right (mirrors the reference first frame) */
  push(5, -1, -6.5, 1.05)
  push(7, -1, -9, 0.9)
  push(0, 1, -7, 1.05)
  push(4, 1, -9.5, 0.9)

  /* 01 — black & white corridor */
  for (let i = 0; i < 10; i++) {
    push(bw[i % bw.length], i % 2 === 0 ? -1 : 1, -12.5 - i * 2.7)
  }
  /* 02 — colour corridor */
  for (let i = 0; i < 11; i++) {
    push(color[i % color.length], i % 2 === 0 ? 1 : -1, -40 - i * 2.65)
  }
  /* 03 — polaroid corridor */
  for (let i = 0; i < 9; i++) {
    push(pol[i % pol.length], i % 2 === 0 ? -1 : 1, -70.5 - i * 2.6, 0.9)
  }
  return specs
}

export default function Gallery3D({ progressRef, trackingRef, onPhotoClick }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bindMouse()
    const host = hostRef.current
    if (!host) return

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 5.5, 24)

    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 60)
    camera.position.set(0, 0, 0)

    const loader = new THREE.TextureLoader()
    const group = new THREE.Group()
    scene.add(group)

    const meshes: THREE.Mesh[] = []
    const disposables: Array<{ dispose: () => void }> = []

    for (const spec of buildSpecs()) {
      const photo = PHOTOS[spec.photo]
      const tex = loader.load(photo.src)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = true
      const aspect = photo.w / photo.h
      const w = 3.3 * spec.scale
      const h = w / aspect
      const geo = new THREE.PlaneGeometry(w, h)
      const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, fog: true })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(spec.x, spec.y, spec.z)
      mesh.rotation.set(0, spec.rotY, spec.rotZ)
      mesh.userData = { photoIndex: spec.photo, baseY: spec.y, phase: spec.phase, baseRotZ: spec.rotZ }
      group.add(mesh)
      meshes.push(mesh)
      disposables.push(geo, mat, tex)
    }

    /* interaction — click a photo */
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    let downX = 0
    let downY = 0
    const onDown = (e: PointerEvent) => {
      downX = e.clientX
      downY = e.clientY
    }
    const onUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return
      ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const hit = raycaster.intersectObjects(meshes, false)[0]
      if (hit) onPhotoClick((hit.object as THREE.Mesh).userData.photoIndex as number)
    }
    renderer.domElement.addEventListener('pointerdown', onDown)
    renderer.domElement.addEventListener('pointerup', onUp)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let raf = 0
    const clock = new THREE.Clock()
    const cam = { x: 0, y: 0, z: 0 }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      const targetZ = -progressRef.current * TRAVEL

      const track = trackingRef.current
      const tx = track ? mouse.x * 1.05 : 0
      const ty = track ? -mouse.y * 0.65 : 0

      cam.z += (targetZ - cam.z) * 0.075
      cam.x += (tx - cam.x) * 0.055
      cam.y += (ty - cam.y) * 0.055

      camera.position.set(cam.x, cam.y, cam.z)
      camera.lookAt(cam.x * 0.55, cam.y * 0.55, cam.z - 9)

      for (const m of meshes) {
        m.position.y = m.userData.baseY + Math.sin(t * 0.45 + m.userData.phase) * 0.13
        m.rotation.z = m.userData.baseRotZ + Math.sin(t * 0.3 + m.userData.phase) * 0.012
      }

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('pointerup', onUp)
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [progressRef, trackingRef, onPhotoClick])

  return <div ref={hostRef} className="fixed inset-0 z-0" aria-hidden />
}
