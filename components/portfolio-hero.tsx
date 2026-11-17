'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Icosahedron } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// ASSET SWAP: Replace these two URLs with the licensed portrait and matching depth map.
const PORTRAIT_IMAGE = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sai_img-XBMaUZpNH5bzoOmjxZcLjP0eiAHqPT.png'
const DEPTH_IMAGE = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wmremove-transformed-v2o7a16umCQXLlhPyv4B0xHoxGfW4m.jpeg'

const vertexShader = `uniform sampler2D uDepth; uniform vec2 uMouse; uniform float uTime; varying vec2 vUv; void main() { vUv = uv; float depth = texture2D(uDepth, uv).r; vec3 transformed = position; transformed.z += (depth - 0.5) * 0.22; transformed.x += uMouse.x * (0.04 + depth * 0.22); transformed.y += uMouse.y * (0.03 + depth * 0.16); transformed.x += sin(uTime * 0.35 + uv.y * 2.0) * 0.006 * depth; gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0); }`
const fragmentShader = `uniform sampler2D uTexture; uniform float uOpacity; varying vec2 vUv; void main() { vec4 color = texture2D(uTexture, vUv); gl_FragColor = vec4(color.rgb, color.a * uOpacity); }`

function PortraitPlane() {
  const material = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()
  const mouse = useRef(new THREE.Vector2())
  const target = useRef(new THREE.Vector2())
  const uniforms = useMemo(() => ({ uTexture: { value: new THREE.Texture() }, uDepth: { value: new THREE.Texture() }, uMouse: { value: new THREE.Vector2() }, uTime: { value: 0 }, uOpacity: { value: 1 } }), [])
  useEffect(() => { const loader = new THREE.TextureLoader(); loader.setCrossOrigin('anonymous'); const portrait = loader.load(PORTRAIT_IMAGE); const depth = loader.load(DEPTH_IMAGE); portrait.colorSpace = THREE.SRGBColorSpace; uniforms.uTexture.value = portrait; uniforms.uDepth.value = depth; return () => { portrait.dispose(); depth.dispose() } }, [uniforms])
  useEffect(() => { const onMove = (event: PointerEvent) => target.current.set((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * -2); window.addEventListener('pointermove', onMove, { passive: true }); return () => window.removeEventListener('pointermove', onMove) }, [])
  useFrame((state, delta) => { if (!material.current) return; mouse.current.lerp(target.current, Math.min(delta * 5, 1)); material.current.uniforms.uMouse.value.copy(mouse.current); material.current.uniforms.uTime.value = state.clock.elapsedTime })
  const height = Math.min(viewport.height * 1.18, 7.9)
  return <mesh scale={[height * (1320 / 1200), height, 1]} position={[0, -0.05, 0.15]}><planeGeometry args={[1, 1, 160, 160]} /><shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent toneMapped={false} /></mesh>
}
function WireframeSphere() { const ref = useRef<THREE.Mesh>(null); useFrame((_, delta) => { if (ref.current) { ref.current.rotation.y += delta * 0.08; ref.current.rotation.x += delta * 0.025 } }); return <Icosahedron ref={ref} args={[2.5, 3]} position={[0.55, 0.1, -0.8]} scale={1.3}><meshBasicMaterial color="#2d332c" wireframe transparent opacity={0.22} /></Icosahedron> }
function Scene() { return <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 8], fov: 36 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}><WireframeSphere /><PortraitPlane /></Canvas> }

const stats = [['04+', 'years building systems'], ['18', 'automations shipped'], ['∞', 'curiosity in motion']]
const projects = [
  ['01', 'Pipeline Control', 'Data infrastructure / Python / Cloud'],
  ['02', 'Signal Studio', 'Automation systems / Integrations'],
  ['03', 'Ops, in motion', 'Dashboards / Observability / Scale'],
]

export function PortfolioHero() {
  const [isMobile, setIsMobile] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  useEffect(() => { const query = window.matchMedia('(max-width: 767px)'); const update = () => setIsMobile(query.matches); update(); query.addEventListener('change', update); return () => query.removeEventListener('change', update) }, [])
  useEffect(() => { gsap.registerPlugin(ScrollTrigger); const lenis = new Lenis({ lerp: 0.08, smoothWheel: true }); let frame = 0; const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }; frame = requestAnimationFrame(raf); const ctx = gsap.context(() => { gsap.fromTo('.hero-reveal', { clipPath: 'inset(100% 0 0 0)', y: 32, opacity: 0 }, { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 1.25, stagger: 0.12, ease: 'power4.out', delay: 0.15, scrollTrigger: { trigger: heroRef.current, start: 'top 80%' } }); if (titleRef.current) gsap.to(titleRef.current, { scale: 1.12, opacity: 0.86, transformOrigin: 'left bottom', ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true } }); gsap.to('.scroll-copy', { y: -34, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true } }) }, heroRef); return () => { cancelAnimationFrame(frame); lenis.destroy(); ctx.revert() } }, [])
  useEffect(() => { if (isMobile) return; const onMove = (event: PointerEvent) => { const x = event.clientX / window.innerWidth - 0.5; const y = event.clientY / window.innerHeight - 0.5; if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${event.clientX - 20}px, ${event.clientY - 20}px, 0)`; if (titleRef.current) titleRef.current.style.translate = `${x * 12}px ${y * 8}px` }; window.addEventListener('pointermove', onMove, { passive: true }); return () => window.removeEventListener('pointermove', onMove) }, [isMobile])

  return <main ref={heroRef} className="relative overflow-hidden bg-[#f3f3ee] text-[#20231e] cursor-none">
    <div ref={cursorRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-50 size-10 rounded-full border border-[#20231e] mix-blend-difference transition-transform duration-100 ease-out max-md:hidden" />
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 opacity-[0.045] mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.8%22/%3E%3C/svg%3E')]" />
    <section className="relative min-h-screen overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-10 sm:py-8"><div className="text-[27px] font-black uppercase leading-[0.78] tracking-[-0.08em]">Sai<br />Pamula</div><div className="hidden text-center font-mono text-[9px] uppercase tracking-[0.22em] sm:block">Data engineer<br />& automation specialist</div><div className="flex items-center gap-3"><span className="hidden rounded-xl bg-[#c7ff00] px-5 py-4 text-xs font-black uppercase sm:inline-flex">Let&apos;s talk</span><button aria-label="Open navigation menu" className="grid size-12 place-items-center rounded-xl border border-[#20231e] text-xl">—</button></div></header>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_52%_48%,rgba(210,224,205,0.72),transparent_42%),linear-gradient(120deg,#f3f3ee_0%,#e9ebe3_55%,#f3f3ee_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(32,35,30,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(32,35,30,0.05)_1px,transparent_1px)] [background-size:90px_90px]" />
      <div className="absolute left-5 top-1/2 z-20 hidden w-[110px] -translate-y-1/2 rounded-xl border border-[#20231e]/60 p-3 font-mono text-[8px] uppercase tracking-[0.08em] sm:block"><span className="mb-2 block text-[9px]">Current focus</span><div className="mb-5 h-px bg-[#20231e]/30" /><strong className="block text-[11px]">Scale</strong><span className="block text-[#20231e]/60">data systems</span><div className="mt-5 flex items-center justify-between text-xl"><span>+</span><span>↗</span></div></div>
      <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 text-right font-mono text-[9px] uppercase tracking-[0.18em] sm:block">Based in<br /><strong className="text-sm">Bengaluru</strong><br />India</div>
      <div className="pointer-events-none absolute inset-x-0 top-[11vh] z-10 h-[67vh] md:top-[8vh] md:h-[82vh]"><img src={PORTRAIT_IMAGE} alt="Sai Pamula in a dark business suit" className="absolute inset-0 h-full w-full object-contain object-center opacity-95" />{!isMobile && <div className="absolute inset-0"><Scene /></div>}</div>
      <div className="relative z-20 mx-auto flex min-h-screen max-w-[1500px] flex-col justify-end px-5 pb-7 pt-32 sm:px-10 sm:pb-10"><div className="hero-reveal mb-7 max-w-4xl sm:mb-10"><p className="mb-4 font-mono text-[9px] uppercase tracking-[0.34em] text-[#20231e]/65">Data / systems / human potential</p><h1 ref={titleRef} className="max-w-3xl text-[clamp(4rem,12vw,11.5rem)] font-black uppercase leading-[0.76] tracking-[-0.09em] mix-blend-multiply transition-[translate] duration-300 ease-out">Sai<br className="sm:hidden" /> Pamula</h1></div><div className="hero-reveal flex flex-col justify-between gap-7 border-t border-[#20231e]/40 pt-4 font-mono text-[9px] uppercase tracking-[0.18em] sm:flex-row sm:items-end"><p className="max-w-[270px] leading-[1.5]">Building calm, resilient systems<br />for noisy, complex worlds.</p><div className="scroll-copy flex items-center gap-3"><span className="size-2 rounded-full bg-[#20231e]" /> Scroll to explore <span>↓</span></div><span>SP / 001</span></div></div>
    </section>
    <section className="relative mx-auto max-w-[1500px] px-5 py-28 sm:px-10 sm:py-40"><div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]"><p className="font-mono text-[10px] uppercase tracking-[0.2em]">01 / Profile</p><div><p className="max-w-4xl text-[clamp(2rem,5vw,5.5rem)] font-black uppercase leading-[0.86] tracking-[-0.07em]">Redefining <span className="text-[#8b9486]">limits</span>, making data <span className="text-[#8b9486]">move</span>, and leaving every system better than I found it.</p><div className="mt-14 grid grid-cols-3 gap-5 border-t border-[#20231e]/30 pt-5">{stats.map(([value, label]) => <div key={value}><strong className="block text-4xl font-black tracking-[-0.06em] sm:text-6xl">{value}</strong><span className="mt-2 block max-w-[100px] font-mono text-[9px] uppercase leading-[1.45] tracking-[0.12em] text-[#20231e]/60">{label}</span></div>)}</div></div></div></section>
    <section className="bg-[#20231e] px-5 py-24 text-[#f3f3ee] sm:px-10 sm:py-36"><div className="mx-auto max-w-[1500px]"><div className="mb-16 flex items-end justify-between"><div><p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c7ff00]">02 / Selected work</p><h2 className="text-[clamp(4rem,11vw,11rem)] font-black uppercase leading-[0.75] tracking-[-0.09em]">In<br />motion</h2></div><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">Scroll / explore</span></div><div className="grid border-t border-white/20">{projects.map(([number, name, detail]) => <article key={number} className="group grid grid-cols-[44px_1fr_auto] items-center gap-4 border-b border-white/20 py-7 transition-colors hover:bg-[#c7ff00] hover:px-4 hover:text-[#20231e] sm:grid-cols-[70px_1fr_auto]"><span className="font-mono text-xs text-[#c7ff00] group-hover:text-[#20231e]">{number}</span><h3 className="text-2xl font-black uppercase tracking-[-0.05em] sm:text-5xl">{name}</h3><span className="hidden text-right font-mono text-[9px] uppercase tracking-[0.14em] opacity-60 sm:block">{detail}</span><span className="text-2xl">↗</span></article>)}</div></div></section>
    <section className="bg-[#c7ff00] px-5 py-24 sm:px-10 sm:py-36"><div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-16 lg:flex-row lg:items-end"><div><p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em]">03 / Start a conversation</p><h2 className="max-w-4xl text-[clamp(3.5rem,10vw,10rem)] font-black uppercase leading-[0.75] tracking-[-0.09em]">Let&apos;s make<br />something move.</h2></div><a href="mailto:hello@saipamula.dev" className="inline-flex w-fit items-center gap-3 rounded-xl border border-[#20231e] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-[#20231e] hover:text-[#c7ff00]">hello@saipamula.dev <span>↗</span></a></div></section>
    <footer className="flex flex-col justify-between gap-4 bg-[#20231e] px-5 py-7 font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 sm:flex-row sm:px-10"><span>© Sai Pamula / 2025</span><span>Data engineer & automation specialist</span><span>Bengaluru / India</span></footer>
  </main>
}
