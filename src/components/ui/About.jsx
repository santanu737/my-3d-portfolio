import { useScrollReveal } from '../../hooks/useScrollReveal'
import { personalInfo } from '../../data/portfolio'

export function About() {
  const [ref, isVisible] = useScrollReveal({ duration: 1.0, y: 50 })

  return (
    <section id="about" className="about" aria-label="About me">
      <h2 className="section-title">About</h2>
      <div className="about__grid">
        <div
          className={`about__text ${isVisible ? 'about__text--visible' : ''}`}
          ref={ref}
        >
          {formatBio(personalInfo.about).map((para, i) => (
            <p key={i} className="about__paragraph">{para}</p>
          ))}
        </div>
        <div className="about__meta">
          <dl className="about__details">
            <div className="about__detail">
              <dt>Location</dt>
              <dd>{personalInfo.location}</dd>
            </div>
            <div className="about__detail">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
              </dd>
            </div>
            <div className="about__detail">
              <dt>Availability</dt>
              <dd>Open to opportunities</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

// Format bio string: split into paragraphs
function formatBio(bio) {
  return bio
    .split('\n\n')
    .filter(Boolean)
    .map((p) => p.trim())
}
