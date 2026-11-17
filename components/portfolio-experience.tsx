'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Line, OrbitControls } from '@react-three/drei'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowDown, ArrowUpRight, Github, Mail, Menu, X, Copy, Check } from 'lucide-react'

const PORTRAIT_IMAGE = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sai_img-XBMaUZpNH5bzoOmjxZcLjP0eiAHqPT.png'
const DEPTH_IMAGE = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wmremove-transformed-v2o7a16umCQXLlhPyv4B0xHoxGfW4m.jpeg'

const projects = [
  {
    number: '01',
    title: 'Enterprise data migration',
    category: 'INTEGRATION / DATA',
    description: 'A migration pattern for moving enterprise data between platforms with controlled extraction, transformation, validation, and reconciliation.',
    stack: ['SnapLogic', 'SQL', 'Oracle', 'Azure'],
    detail: 'The engineering focus is on dependable orchestration, clear failure handling, traceable records, and repeatable validation across source and target systems.',
    tone: 'lime',
  },
  {
    number: '02',
    title: 'Integration framework',
    category: 'API / ORCHESTRATION',
    description: 'Reusable integration patterns for connecting services, orchestrating APIs, and making operational behavior easier to understand.',
    stack: ['SnapLogic', 'REST APIs', 'JSON', 'Git'],
    detail: 'The case-study structure covers pipeline design, reusable patterns, parameterization, error routes, monitoring, and maintainability.',
    tone: 'blue',
  },
  {
    number: '03',
    title: 'Automation engineering',
    category: 'QUALITY / PYTHON',
    description: 'A UI automation approach for React applications with structured test organization and maintainable browser interactions.',
    stack: ['Python', 'Pytest', 'Selenium', 'Page Object Model'],
    detail: 'The implementation story focuses on reliable selectors, reusable page objects, test data, assertions, and actionable execution reports.',
    tone: 'orange',
  },
  {
    number: '04',
    title: 'Data performance',
    category: 'SQL / PERFORMANCE',
    description: 'A performance-engineering approach to high-volume data workflows, batch processing, and database-side optimization.',
    stack: ['SQL', 'Oracle', 'Batching', 'Monitoring'],
    detail: 'The technical narrative examines throughput, query shape, batch sizing, transaction behavior, observability, and measured bottlenecks.',
    tone: 'violet',
  },
]

const skills = [
  { name: 'SnapLogic', group: 'Integration', x: -2.7, y: 1.05, z: 0.2, note: 'Pipeline design, orchestration, reusable integration patterns, and error handling.' },
  { name: 'Azure', group: 'Cloud', x: -1.25, y: 1.7, z: -0.25, note: 'Cloud data services and enterprise data-platform integration.' },
  { name: 'Python', group: 'Automation', x: 0.35, y: 1.15, z: 0.35, note: 'Automation scripting, test utilities, and data-oriented development.' },
  { name: 'SQL', group: 'Data', x: 2.35, y: 1.35, z: -0.2, note: 'Querying, transformation, relational data, and performance analysis.' },
  { name: 'Oracle', group: 'Database', x: -2.1, y: -0.7, z: -0.35, note: 'Enterprise database workflows and SQL-based processing.' },
  { name: 'Snowflake', group: 'Data platform', x: -0.45, y: -1.25, z: 0.2, note: 'Cloud data-platform concepts and integration workflows.' },
  { name: 'REST APIs', group: 'Integration', x: 1.3, y: -0.7, z: -0.35, note: 'Service integration, request/response patterns, and JSON payloads.' },
  { name: 'Pytest', group: 'Testing', x: 2.75, y: -0.75, z: 0.25, note: 'Python test organization, fixtures, assertions, and automation.' },
  { name: 'Selenium', group: 'Testing', x: -1.45, y: -2.15, z: 0.15, note: 'Browser automation and page-object-based UI testing.' },
  { name: 'Docker', group: 'Engineering', x: 0.4, y: -2.25, z: -0.3, note: 'Containerized development and repeatable local environments.' },
  { name: 'Git', group: 'Engineering', x: 2.15, y: -2.05, z: 0.15, note: 'Version control, collaboration, and delivery workflows.' },
]

const links: [number, number][] = [[0,1],[0,4],[0,6],[1,2],[1,5],[2,3],[2,7],[2,8],[3,5],[3,6],[4,5],[5,8],[6,7],[7,10],[8,9],[9,10],[2,9]]

function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true })
    const update = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])
  return null
}

function Preloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const duration = 1050
    let raf = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.round(progress * 100))
      if (progress < 1) raf = requestAnimationFrame(tick)
      else window.setTimeout(onComplete, 180)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])
  return (
    <div className="preloader" role="status" aria-label="Loading portfolio">
      <div className="preloader-top"><span>SP / 001</span><span>INDEPENDENT PORTFOLIO</span></div>
      <div className="preloader-center"><span className="preloader-mark">SP</span><strong>{String(count).padStart(3, '0')}</strong></div>
      <div className="preloader-track"><span style={{ transform: `scaleX(${count / 100})` }} /></div>
      <div className="preloader-bottom"><span>DATA / SYSTEMS / ENGINEERING</span><span>LOADING EXPERIENCE</span></div>
    </div>
  )
}

function NetworkNode({ index, active, onSelect }: { index: number; active: boolean; onSelect: (index: number) => void }) {
  const node = skills[index]
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = node.y + Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.045
    const target = active ? 1.65 : 1
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12)
  })
  return (
    <mesh ref={ref} position={[node.x, node.y, node.z]} onClick={(event) => { event.stopPropagation(); onSelect(index) }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
      <icosahedronGeometry args={[0.105, 2]} />
      <meshStandardMaterial color={active ? '#c7ff00' : '#d9ded4'} emissive={active ? '#536b00' : '#252b25'} emissiveIntensity={active ? 1.2 : 0.25} roughness={0.35} metalness={0.35} />
    </mesh>
  )
}

function NetworkScene({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const points = useMemo(() => skills.map((skill) => new THREE.Vector3(skill.x, skill.y, skill.z)), [])
  return (
    <>
      <ambientLight intensity={1.4} />
      <pointLight position={[0, 2, 4]} intensity={2.2} color="#c7ff00" />
      {links.map(([a, b], i) => <Line key={i} points={[points[a], points[b]]} color={active === a || active === b ? '#c7ff00' : '#6e786d'} transparent opacity={active === a || active === b ? 0.95 : 0.34} lineWidth={active === a || active === b ? 1.5 : 0.8} />)}
      {skills.map((skill, index) => <NetworkNode key={skill.name} index={index} active={active === index} onSelect={onSelect} />)}
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.35} />
    </>
  )
}

function SkillsNetwork() {
  const [active, setActive] = useState(0)
  const selected = skills[active]
  return (
    <div className="skills-network">
      <div className="network-canvas"><Canvas camera={{ position: [0, 0, 7.6], fov: 42 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}><NetworkScene active={active} onSelect={setActive} /></Canvas></div>
      <div className="network-copy">
        <span className="eyebrow">SELECT A NODE / {String(active + 1).padStart(2, '0')}</span>
        <p className="network-category">{selected.group}</p>
        <h3>{selected.name}</h3>
        <p>{selected.note}</p>
        <div className="network-index">{skills.map((skill, i) => <button key={skill.name} className={active === i ? 'network-dot active' : 'network-dot'} onClick={() => setActive(i)} aria-label={`Show ${skill.name}`} />)}</div>
      </div>
      <div className="network-mobile-list">{skills.map((skill, i) => <button key={skill.name} onClick={() => setActive(i)} className={active === i ? 'active' : ''}>{skill.name}<span>{skill.group}</span></button>)}</div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    event.currentTarget.style.setProperty('--tilt-x', `${-y * 3}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${x * 4}deg`)
  }
  return (
    <article className={`project-card tone-${project.tone}`} onMouseMove={onMove} onMouseLeave={(event) => { event.currentTarget.style.setProperty('--tilt-x', '0deg'); event.currentTarget.style.setProperty('--tilt-y', '0deg') }}>
      <div className="project-card-top"><span>{project.number} / 04</span><span>{project.category}</span></div>
      <div className="project-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-core">{String(index + 1).padStart(2, '0')}</div><div className="art-cross">+</div></div>
      <div className="project-card-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-list">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <button className="text-link" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>{expanded ? 'CLOSE CASE STUDY' : 'EXPLORE CASE STUDY'} <ArrowUpRight size={15} /></button>
        {expanded && <div className="project-detail"><span>ENGINEERING APPROACH</span><p>{project.detail}</p><small>Illustrative, anonymized project description. Specific client details and outcome metrics are intentionally omitted.</small></div>}
      </div>
    </article>
  )
}

function Navigation({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const items = [{ label: 'ABOUT', href: '#about' }, { label: 'WORK', href: '#work' }, { label: 'EXPERTISE', href: '#expertise' }, { label: 'JOURNEY', href: '#journey' }, { label: 'CONTACT', href: '#contact' }]
  return (
    <>
      <header className="site-nav">
        <a href="#top" className="brand-mark" aria-label="Sai Pamula home">SP<span>.</span></a>
        <nav className="desktop-nav">{items.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </header>
      <div className={menuOpen ? 'menu-overlay open' : 'menu-overlay'} aria-hidden={!menuOpen}>
        <div className="menu-overlay-inner"><span className="eyebrow">NAVIGATE / SP</span>{items.map((item, i) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span>0{i + 1}</span>{item.label}<ArrowUpRight /></a>)}<p>DATA / SYSTEMS / HUMAN POTENTIAL</p></div>
      </div>
    </>
  )
}

export function PortfolioExperience() {
  const [loaded, setLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [cursorLabel, setCursorLabel] = useState('')
  const cursorRef = useRef<HTMLDivElement>(null)
  const completeLoading = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    if (!loaded) return
    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(element, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 86%', once: true } })
      })
      const section = document.querySelector<HTMLElement>('.projects-section')
      const track = document.querySelector<HTMLElement>('.projects-track')
      if (section && track && window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)').matches) {
        gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth + 80), ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth + 80}`, pin: true, scrub: 1, invalidateOnRefresh: true } })
      }
    })
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    return () => { window.clearTimeout(refresh); context.revert() }
  }, [loaded])

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('saikiran_pamula@srivensolutions.com')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = 'mailto:saikiran_pamula@srivensolutions.com'
    }
  }

  return (
    <>
      {!loaded && <Preloader onComplete={completeLoading} />}
      <SmoothScroll />
      <div className="grain-overlay" aria-hidden="true" />
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span>{cursorLabel}</span></div>
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-grid" />
          <div className="hero-meta hero-meta-left"><span>INTEGRATION / DATA / AUTOMATION</span><i /> <span>BUILDING SYSTEMS THAT CONNECT</span></div>
          <div className="hero-meta hero-meta-right">INDIA <b>—</b> AVAILABLE FOR CONVERSATIONS</div>
          <div className="hero-portrait"><img src={PORTRAIT_IMAGE} alt="Portrait of Sai Pamula" /><div className="hero-depth"><Canvas camera={{ position: [0, 0, 8], fov: 36 }} dpr={[1, 1.5]}><ambientLight intensity={1.2} /><mesh rotation={[0.25, 0.2, 0]}><icosahedronGeometry args={[2.45, 2]} /><meshBasicMaterial color="#c7ff00" wireframe transparent opacity={0.22} /></mesh></Canvas></div></div>
          <div className="hero-copy"><p className="eyebrow" data-reveal>DATA / SYSTEMS / HUMAN POTENTIAL</p><h1 id="hero-title" data-reveal>SAI<br /><span>PAMULA</span></h1><div className="hero-bottom" data-reveal><p>DATA ENGINEER<br />INTEGRATION DEVELOPER<br />AUTOMATION SPECIALIST</p><a href="#about" className="scroll-cue">SCROLL TO EXPLORE <ArrowDown size={15} /></a><span>SP / 001</span></div></div>
        </section>

        <section id="about" className="about-section section-pad">
          <div className="section-kicker" data-reveal><span>01 / THE APPROACH</span><span>ABOUT / PHILOSOPHY</span></div>
          <div className="about-layout"><h2 data-reveal>BRIDGING<br /><em>COMPLEX</em><br />SYSTEMS.</h2><div className="about-copy" data-reveal><span className="eyebrow">ENGINEERING WITH INTENTION</span><p>I work at the intersection of enterprise integration, data engineering, and automation. My focus is building dependable workflows that move information between systems, make complex processes easier to operate, and give teams clearer ways to understand their data.</p><p>From SnapLogic pipelines and API orchestration to SQL, cloud data services, and Python-based testing, I enjoy turning complicated technical requirements into maintainable engineering solutions.</p><div className="about-signature">DATA / SYSTEMS / HUMAN POTENTIAL</div></div></div>
          <div className="about-marquee" aria-hidden="true"><span>CONNECT / TRANSFORM / AUTOMATE / </span><span>CONNECT / TRANSFORM / AUTOMATE / </span></div>
        </section>

        <section id="work" className="projects-section">
          <div className="projects-heading section-pad"><div className="section-kicker"><span>02 / SELECTED WORK</span><span>ENGINEERING CASE STUDIES</span></div><h2 data-reveal>BUILT TO<br /><em>CONNECT.</em></h2><p data-reveal>Systems thinking, integration patterns, and automation practices — explored through selected engineering themes.</p></div>
          <div className="projects-track">{projects.map((project, index) => <ProjectCard key={project.number} project={project} index={index} />)}<div className="projects-end"><span>END OF TRANSMISSION</span><strong>MORE<br />IN MOTION.</strong><a href="#contact">START A CONVERSATION <ArrowUpRight size={16} /></a></div></div>
        </section>

        <section id="expertise" className="expertise-section section-pad">
          <div className="section-kicker" data-reveal><span>03 / THE TOOLKIT</span><span>INTERACTIVE SKILL NETWORK</span></div>
          <h2 data-reveal>CONNECTED<br /><em>BY DESIGN.</em></h2>
          <p className="section-intro" data-reveal>Explore the technologies and engineering disciplines that connect across my work. Select a node to see its role.</p>
          <SkillsNetwork />
        </section>

        <section id="journey" className="journey-section section-pad">
          <div className="section-kicker" data-reveal><span>04 / THE JOURNEY</span><span>LEARNING IN MOTION</span></div>
          <h2 data-reveal>BUILT THROUGH<br /><em>EXPERIENCE.</em></h2>
          <div className="journey-list">
            <article data-reveal><span>01</span><div><h3>FOUNDATIONS</h3><p>Building a strong base across databases, APIs, programming, and software quality.</p></div><small>DATA / SOFTWARE</small></article>
            <article data-reveal><span>02</span><div><h3>ENTERPRISE INTEGRATION</h3><p>Working with integration pipelines, migrations, transformations, orchestration, and operational reliability.</p></div><small>SNAPLOGIC / CLOUD</small></article>
            <article data-reveal><span>03</span><div><h3>AUTOMATION MINDSET</h3><p>Extending engineering workflows with Python, Pytest, Selenium, and repeatable testing practices.</p></div><small>PYTHON / QUALITY</small></article>
            <article data-reveal><span>04</span><div><h3>ARCHITECTURE IN PROGRESS</h3><p>Continuously developing the design, performance, and communication skills needed to build systems at greater scale.</p></div><small>GROWTH / SYSTEMS</small></article>
          </div>
        </section>

        <section id="beyond" className="beyond-section section-pad">
          <div className="section-kicker" data-reveal><span>05 / BEYOND ENGINEERING</span><span>THE HUMAN SIDE</span></div>
          <div className="beyond-layout"><h2 data-reveal>MORE THAN<br /><em>JUST CODE.</em></h2><div data-reveal><p>Visual storytelling, photography, creative experiments, and continuous learning influence how I see problems. Curiosity does not stop at the edge of a code editor.</p><div className="beyond-note"><span>ALWAYS EXPLORING</span><span>CREATIVITY × ENGINEERING</span></div></div></div>
          <div className="beyond-visual"><div className="visual-grid" /><span>IDEAS IN PROGRESS</span><strong>OBSERVE.<br />IMAGINE.<br />BUILD.</strong><span className="visual-index">SP / FIELD NOTES / 001</span></div>
        </section>

        <section id="contact" className="contact-section section-pad">
          <div className="section-kicker"><span>06 / START A CONVERSATION</span><span>CONTACT / COLLABORATION</span></div>
          <p className="eyebrow">HAVE A COMPLEX SYSTEM TO CONNECT?</p>
          <h2>LET&apos;S BUILD<br /><em>SOMETHING</em><br />MEANINGFUL.</h2>
          <div className="contact-bottom"><div><span className="eyebrow">EMAIL</span><a className="contact-email" href="mailto:saikiran_pamula@srivensolutions.com">saikiran_pamula@srivensolutions.com <ArrowUpRight size={17} /></a><button className="copy-button" onClick={copyEmail}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'COPIED' : 'COPY EMAIL'}</button></div><div className="social-links"><a href="https://github.com/blackdranzer099" target="_blank" rel="noreferrer"><Github size={17} /> GITHUB <ArrowUpRight size={14} /></a><a href="mailto:saikiran_pamula@srivensolutions.com"><Mail size={17} /> EMAIL <ArrowUpRight size={14} /></a><span>INDIA / OPEN TO GOOD CONVERSATIONS</span></div></div>
        </section>
      </main>
      <footer className="site-footer"><a href="#top" className="footer-brand">SP<span>.</span></a><span>© {new Date().getFullYear()} SAI PAMULA</span><span>DATA / SYSTEMS / ENGINEERING</span><a href="#top">BACK TO TOP ↑</a></footer>
    </>
  )
}
