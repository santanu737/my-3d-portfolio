import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const cursorRef = useRef()

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return undefined

    const move = (event) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
    }
    const enter = () => cursor.classList.add('custom-cursor--visible')
    const leave = () => cursor.classList.remove('custom-cursor--visible')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerenter', enter)
    window.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerenter', enter)
      window.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <span ref={cursorRef} className="custom-cursor" aria-hidden="true" />
}
