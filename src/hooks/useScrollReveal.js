import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

// ============================================================
// useReducedMotion — detect user's motion preferences
// ============================================================
export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

// ============================================================
// useScrollReveal — animates children with a fade-in-up
//                   when the element scrolls into view
// ============================================================
export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const prefersReduced = useReducedMotion()
  const [isVisible, setIsVisible] = useState(prefersReduced)

  const {
    duration = 1.0,
    delay = 0,
    y = 40,
    stagger = 0.1,
    selector = null, // optional child selector to stagger
  } = options

  useEffect(() => {
    if (!ref.current) return
    if (prefersReduced) {
      animate(ref.current, { duration, delay: 0, y: 0, stagger: 0, selector: null })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
            animate(ref.current, { duration, delay, y, stagger, selector })
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced, isVisible])

  return [ref, isVisible]
}

// ============================================================
// useScrollProgress — tracks scroll position for an element
// ============================================================
export function useScrollProgress() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const onScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const totalTravel = windowHeight + rect.height
      const scrolled = windowHeight - rect.top
      const p = Math.max(0, Math.min(1, scrolled / totalTravel))
      setProgress(p)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return [ref, progress]
}

// ============================================================
// animate — runs a GSAP tween on the element
// ============================================================
function animate(el, { duration, delay, y, stagger, selector }) {
  if (!el) return

  const targets = selector
    ? el.querySelectorAll(selector)
    : [el]

  gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger: selector ? stagger : 0,
      ease: 'power3.out',
      clearProps: 'all',
    }
  )
}
