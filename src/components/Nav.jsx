import { useEffect, useRef, useState } from 'react'
import { personalInfo, navItems } from '../data/portfolio'

export function Nav() {
  const navRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Nav is always visible — no IntersectionObserver needed.
  // We use a small delay so the transition feels intentional on first load.
  useEffect(() => {
    const el = navRef.current
    if (!el) return
    const timer = setTimeout(() => {
      el.classList.add('nav--visible')
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  // Close menu when clicking a link
  const handleLinkClick = () => setIsMenuOpen(false)

  // Toggle menu
  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  return (
    <nav
      ref={navRef}
      className={`nav ${isMenuOpen ? 'nav--menu-open' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <a href="#hero" className="nav__logo" aria-label={`${personalInfo.name} — Home`}>
        <span className="nav__logo-text">{personalInfo.name}</span>
      </a>

      <ul className="nav__links" role="list">
        {navItems.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="nav__link" onClick={handleLinkClick}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {isMobile && (
        <button
          className="nav__toggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="nav-mobile-menu"
          type="button"
        >
          <span className="nav__toggle-bar" />
          <span className="nav__toggle-bar" />
          <span className="nav__toggle-bar" />
        </button>
      )}

      {isMobile && (
        <ul
          id="nav-mobile-menu"
          className={`nav__mobile-menu ${isMenuOpen ? 'nav__mobile-menu--open' : ''}`}
          role="list"
          aria-hidden={!isMenuOpen}
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="nav__mobile-link" onClick={handleLinkClick}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
