import { personalInfo } from '../../data/portfolio'

export function Hero() {
  return (
    <div className="hero__content">
      <p className="hero__subtitle">{personalInfo.heroSubtitle}</p>
      <h1 className="hero__title">{personalInfo.name}</h1>
      <p className="hero__tagline">{personalInfo.tagline}</p>
      <div className="hero__cta-group">
        <a href="#projects" className="btn btn--primary">
          {personalInfo.heroCTA}
        </a>
        <a href="#contact" className="btn btn--secondary">
          {personalInfo.heroSecondary}
        </a>
      </div>
    </div>
  )
}
