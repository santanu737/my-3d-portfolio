import { lazy, Suspense } from 'react'
import { Nav } from './components/ui/Nav'
import { Hero } from './components/ui/Hero'
import { About } from './components/ui/About'
import { Skills } from './components/ui/Skills'
import { Projects } from './components/ui/Projects'
import { Timeline } from './components/ui/Timeline'
import { Contact } from './components/ui/Contact'
import { Footer } from './components/ui/Footer'
import { useScrollProgress } from './hooks/useScrollProgress'

import './App.css'
import './index.css'

// Lazy-load the heavy persistent 3D scene
const PageScene = lazy(() =>
  import('./components/PageScene').then((m) => ({ default: m.PageScene }))
)

function App() {
  const { activeSection, scrollProgress } = useScrollProgress()

  return (
    <>
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
