'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Icosahedron, OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// ASSET SWAP: Replace these two URLs with the licensed portrait and matching depth map.
const PORTRAIT_IMAGE = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sai_img-XBMaUZpNH5bzoOmjxZcLjP0eiAHqPT.png'
const DEPTH_IMAGE = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wmremove-transformed-v2o7a16umCQXLlhPyv4B0xHoxGfW4m.jpeg'

const vertexShader = `
uniform sampler2D uDepth;
uniform vec2 uMouse;
uniform float uTime;
varying vec2 vUv;
void main() {
  vUv = uv;
  float depth = texture2D(uDepth, uv).r;
  vec3 transformed = position;
  float parallax = (depth - 0.5) * 0.13;
  transformed.z += parallax;
  transformed.x += uMouse.x * depth * 0.16;
  transformed.y += uMouse.y * depth * 0.12;
  transformed.x += sin(uTime * 0.35 + uv.y * 2.0) * 0.004 * depth;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec4 color = texture2D(uTexture, vUv);
  gl_FragColor = vec4(color.rgb, color.a * uOpacity);
}
`

function PortraitPlane() {
  const material = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()
  const mouse = useRef(new THREE.Vector2())
  const target = useRef(new THREE.Vector2())
  const uniforms = useMemo(() => ({
    uTexture: { value: new THREE.Texture() },
    uDepth: { value: new THREE.Texture() },
    uMouse: { value: new THREE.Vector2() },
    uTime: { value: 0 },
    uOpacity: { value: 1 },
  }), [])

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    const portrait = loader.load(PORTRAIT_IMAGE)
    const depth = loader.load(DEPTH_IMAGE)
    portrait.colorSpace = THREE.SRGBColorSpace
    uniforms.uTexture.value = portrait
    uniforms.uDepth.value = depth
    return () => { portrait.dispose(); depth.dispose() }
  }, [uniforms])

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      target.current.set((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * -2)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    if (!material.current) return
    mouse.current.lerp(target.current, Math.min(delta * 4, 1))
    material.current.uniforms.uMouse.value.copy(mouse.current)
    material.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  const aspect = 1320 / 1200
  const height = Math.min(viewport.height * 1.18, 7.9)
  return (
    <mesh scale={[height * aspect, height, 1]} position={[0, -0.05, 0.15]}>
      <planeGeometry args={[1, 1, 128, 128]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent toneMapped={false} />
    </mesh>
  )
}

function WireframeSphere() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) { ref.current.rotation.y += delta * 0.08; ref.current.rotation.x += delta * 0.025 }
  })
  return <Icosahedron ref={ref} args={[2.5, 3]} position={[0.55, 0.1, -0.8]} scale={1.3}><meshBasicMaterial color="#7f8c89" wireframe transparent opacity={0.16} /></Icosahedron>
}

function Scene() {
  return <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 8], fov: 36 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
    <WireframeSphere />
    <PortraitPlane />
  </Canvas>
}

export function PortfolioHero() {
  const [isMobile, setIsMobile] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(query.matches)
    update(); query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    let frame = 0
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-reveal', { clipPath: 'inset(100% 0 0 0)', y: 32, opacity: 0 }, { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 1.25, stagger: 0.12, ease: 'power4.out', delay: 0.15, scrollTrigger: { trigger: heroRef.current, start: 'top 80%' } })
    }, heroRef)
    return () => { cancelAnimationFrame(frame); lenis.destroy(); ctx.revert() }
  }, [])

  return <main ref={heroRef} className="relative min-h-screen overflow-hidden bg-[#101212] text-[#e9ece9]">
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 mix-blend-difference sm:px-10 sm:py-8">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">SP / 001</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">Available for select projects</span>
    </header>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(79,92,89,0.25),transparent_38%),linear-gradient(115deg,#101212_0%,#222928_48%,#101212_100%)]" />
    <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:90px_90px]" />
    <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] flex-col justify-end px-6 pb-12 pt-28 sm:px-10 lg:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-[10vh] h-[72vh] md:top-[8vh] md:h-[82vh]">
        <img src={PORTRAIT_IMAGE} alt="Sai Pamula in a dark business suit" className="absolute inset-0 h-full w-full object-contain object-center opacity-90" />
        {!isMobile && <div className="absolute inset-0"><Scene /></div>}
      </div>
      <div className="hero-reveal relative z-20 mb-8 max-w-4xl sm:mb-10 lg:mb-12">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.36em] text-[#bdc8c2]/70">Data / systems / human potential</p>
        <h1 className="max-w-3xl text-[clamp(4rem,12vw,11.5rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] text-[#f1f2ed]">Sai<br className="sm:hidden" /> Pamula</h1>
      </div>
      <div className="hero-reveal flex flex-col justify-between gap-8 border-t border-white/20 pt-5 text-white/65 sm:flex-row sm:items-end">
        <p className="max-w-[280px] text-xs uppercase leading-[1.55] tracking-[0.16em]">Data engineer & automation specialist</p>
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em]"><span className="size-2 rounded-full bg-[#c4d8c2] shadow-[0_0_18px_#c4d8c2]" /> Scroll to explore <span className="text-white/30">↓</span></div>
        <span className="font-mono text-[10px] tracking-[0.15em]">Bengaluru / India</span>
      </div>
    </div>
  </main>
}
