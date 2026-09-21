import { useScrollReveal } from '../hooks/useScrollReveal'
import { projects } from '../data/portfolio'

export function Projects() {
  const [ref, isVisible] = useScrollReveal({ duration: 1.0, y: 50 })

  // Helper: check if a link is external (so we add rel="noopener noreferrer")
  const isExternal = (url) => url && (url.startsWith('http://') || url.startsWith('https://'))
  const extProps = (url) =>
    isExternal(url)
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {}

  return (
    <section id="projects" className="projects" aria-label="Featured projects">
      <h2 className="section-title">Featured Projects</h2>
      <div
        className={`projects__grid ${isVisible ? 'projects__grid--visible' : ''}`}
        ref={ref}
      >
        {projects.map((project, idx) => (
          <article
            key={project.id}
            className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
          >
            <div className="project-card__visual" aria-hidden="true">
              <div className="project-card__gradient" />
            </div>
            <div className="project-card__body">
              <div className="project-card__header">
                <h3>{project.title}</h3>
                {project.featured && (
                  <span className="project-card__badge">Featured</span>
                )}
              </div>
              <p className="project-card__desc">{project.description}</p>
              <p className="project-card__year">{project.year}</p>
              <ul className="project-card__tags" role="list">
                {project.tags.map((tag) => (
                  <li key={tag} className="project-card__tag">{tag}</li>
                ))}
              </ul>
              <div className="project-card__links">
                {project.link && project.link !== '#' && (
                  <a
                    href={project.link}
                    className="btn btn--sm"
                    aria-label={`View ${project.title} live (opens in new tab)`}
                    {...extProps(project.link)}
                  >
                    View Project
                  </a>
                )}
                {project.github && project.github !== '#' && (
                  <a
                    href={project.github}
                    className="btn btn--sm btn--ghost"
                    aria-label={`View ${project.title} source code (opens in new tab)`}
                    {...extProps(project.github)}
                  >
                    Source
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
