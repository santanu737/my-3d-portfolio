import { personalInfo } from '../data/portfolio'

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <p className="footer__note">{personalInfo.footerNote}</p>
        <nav className="footer__nav" aria-label="Footer navigation">
          <a href="#hero" className="footer__link">Top</a>
          <a href="#about" className="footer__link">About</a>
          <a href="#skills" className="footer__link">Skills</a>
          <a href="#projects" className="footer__link">Projects</a>
        </nav>
      </div>
    </footer>
  )
}
