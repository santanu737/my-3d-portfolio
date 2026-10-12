import { lazy, Suspense, useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Nav } from './components/ui/Nav'
import { Hero } from './components/ui/Hero'
import { About } from './components/ui/About'
import { Skills } from './components/ui/Skills'
import { Projects } from './components/ui/Projects'
import { Timeline } from './components/ui/Timeline'
import { Contact } from './components/ui/Contact'
import { Footer } from './components/ui/Footer'
import { CustomCursor } from './components/ui/CustomCursor'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useStore } from './store/useStore'

import './App.css'
import './index.css'

// Lazy-load the heavy persistent 3D scene
const PageScene = lazy(() =>
  import('./components/canvas/PageScene').then((m) => ({ default: m.PageScene }))
)

gsap.registerPlugin(ScrollTrigger)

function App() {
  const { activeSection, scrollProgress } = useScrollProgress()
  const setScrollProgress = useStore((state) => state.setScrollProgress)

  useEffect(() => {
    const lenis = new Lenis()
    const handleScroll = (instance) => {
      ScrollTrigger.update()
      setScrollProgress(instance.progress)
    }
    const handleTick = (time) => lenis.raf(time * 1000)

    lenis.on('scroll', handleScroll)
    gsap.ticker.add(handleTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', handleScroll)
      gsap.ticker.remove(handleTick)
      lenis.destroy()
    }
  }, [setScrollProgress])

  return (
    <>
      <CustomCursor />
      <Nav />

      {/* Persistent 3D canvas — fixed full-page, behind content */}
      <Suspense fallback={null}>
        <PageScene activeSection={activeSection} scrollProgress={scrollProgress} />
      </Suspense>

      <section id="hero" className="hero" aria-label="Introduction">
        <div className="hero__inner">
          <Hero />
        </div>
        <div className="hero__scroll-cue" aria-hidden="true">
          <span className="hero__scroll-line" />
        </div>
      </section>

      <main>
        <section id="about" className="about" aria-label="About me">
          <About />
        </section>

        <section id="skills" className="skills" aria-label="Skills and expertise">
          <Skills />
        </section>

        <section id="projects" className="projects" aria-label="Featured projects">
          <Projects />
        </section>

        <section id="experience" className="timeline" aria-label="Experience and education">
          <Timeline />
        </section>

        <section id="contact" className="contact" aria-label="Contact information">
          <Contact />
        </section>
      </main>

      <Footer />
    </>
  )
}

export default App
