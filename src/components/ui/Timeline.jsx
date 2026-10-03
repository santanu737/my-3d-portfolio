import { useScrollReveal } from '../../hooks/useScrollReveal'
import { experience } from '../../data/portfolio'

export function Timeline() {
  const [ref, isVisible] = useScrollReveal({ duration: 1.0, y: 50 })

  return (
    <section id="experience" className="timeline" aria-label="Experience and education">
      <h2 className="section-title">Experience & Education</h2>
      <div className={`timeline__list ${isVisible ? 'timeline__list--visible' : ''}`} ref={ref} role="list">
        {experience.map((item) => (
          <article
            key={item.id}
            className={`timeline__item ${item.type === 'work' ? 'timeline__item--work' : 'timeline__item--education'}`}
            role="listitem"
          >
            <div className="timeline__marker" aria-hidden="true" />
            <div className="timeline__content">
              <header className="timeline__header">
                <h3>{item.title}</h3>
                <span className="timeline__company">{item.company}</span>
              </header>
              <time className="timeline__period" dateTime={item.period}>
                {item.period}
              </time>
              <p className="timeline__location">{item.location}</p>
              <p className="timeline__desc">{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <ul className="timeline__tags" role="list">
                  {item.tags.map((tag) => (
                    <li key={tag} className="timeline__tag">{tag}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
