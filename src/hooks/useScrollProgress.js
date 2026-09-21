import { useState, useEffect, useCallback, useRef } from 'react'

// Section order — matches the DOM order
export const SECTIONS = ['hero', 'about', 'skills', 'projects', 'experience', 'contact']

/**
 * Tracks which section is currently in view and the overall scroll progress.
 *
 * Returns:
 *   activeSection  — string id of the active section ('hero', 'about', etc.)
 *   scrollY       — current window.scrollY
 *   scrollProgress — 0-1 overall page scroll progress
 *   sectionProgress — 0-1 progress within the active section
 */
export function useScrollProgress() {
  const [activeSection, setActiveSection] = useState('hero')
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [sectionProgress, setSectionProgress] = useState(0)

  const observersRef = useRef([])

  // Observe all sections for visibility changes
  useEffect(() => {
    // Give DOM a tick to render
    const timer = setTimeout(() => {
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id)
              }
            })
          },
          {
            threshold: Array.from({ length: 20 }, (_, i) => i / 19), // 5% increments
            rootMargin: '-10% 0px -60% 0px', // enter when top 40% enters viewport
          }
        )

        observer.observe(el)
        observersRef.current.push(observer)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observersRef.current.forEach((obs) => obs.disconnect())
      observersRef.current = []
    }
  }, [])

  // Track scrollY and overall progress
  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const prog = maxScroll > 0 ? sy / maxScroll : 0

      setScrollY(sy)
      setScrollProgress(prog)

      // Calculate progress within the active section
      const activeEl = document.getElementById(activeSection)
      if (activeEl) {
        const rect = activeEl.getBoundingClientRect()
        const viewH = window.innerHeight
        // 1 when section top hits bottom of viewport, 0 when bottom hits top
        const sp = Math.max(0, Math.min(1, (viewH - rect.top) / (viewH + rect.height)))
        setSectionProgress(sp)
      }
    }

    handleScroll() // initial
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeSection])

  return { activeSection, scrollY, scrollProgress, sectionProgress }
}

/**
 * A lightweight hook that just returns the active section index (0-based).
 * Useful for driving arrays of section configs.
 */
export function useActiveSectionIndex() {
  const { activeSection } = useScrollProgress()
  return SECTIONS.indexOf(activeSection)
}
