import { useScrollReveal } from '../../hooks/useScrollReveal'
import { skills } from '../../data/portfolio'

export function Skills() {
  const [ref, isVisible] = useScrollReveal({ duration: 1.0, y: 50 })

  return (
    <section id="skills" className="skills" aria-label="Skills and expertise">
      <h2 className="section-title">Skills</h2>
      <div
        className={`skills__grid ${isVisible ? 'skills__grid--visible' : ''}`}
        ref={ref}
      >
        {skills.map((category) => (
          <div key={category.category} className="skills__category">
            <h3 className="skills__category-title">{category.category}</h3>
            <ul className="skills__tags" role="list">
              {category.items.map((item) => (
                <li key={item} className="skills__tag">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
