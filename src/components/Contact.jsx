import { useScrollReveal } from '../hooks/useScrollReveal'
import { contact } from '../data/portfolio'

export function Contact() {
  const [ref, isVisible] = useScrollReveal({ duration: 1.0, y: 50 })

  // Helper: determine if URL is external and needs rel="noopener noreferrer"
  const isExternal = (url) => url && (url.startsWith('http://') || url.startsWith('https://'))
  const extProps = (url) =>
    isExternal(url)
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {}

  return (
    <section id="contact" className="contact" aria-label="Contact information">
      <h2 className="section-title">Contact</h2>
      <div className="contact__inner" ref={ref}>
        <div className="contact__text">
          <p className="contact__heading">{contact.heading}</p>
          <p className="contact__subheading">{contact.subheading}</p>
          <p className="contact__status">{contact.availability}</p>
        </div>
        <ul className="contact__socials" role="list">
          <li>
            <a
              href={contact.socials.github}
              className="contact__social-link"
              aria-label="Visit Santanu's GitHub profile (opens in new tab)"
              {...extProps(contact.socials.github)}
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={contact.socials.linkedin}
              className="contact__social-link"
              aria-label="Visit Santanu's LinkedIn profile (opens in new tab)"
              {...extProps(contact.socials.linkedin)}
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={contact.socials.twitter}
              className="contact__social-link"
              aria-label="Visit Santanu's X / Twitter profile (opens in new tab)"
              {...extProps(contact.socials.twitter)}
            >
              X / Twitter
            </a>
          </li>
          <li>
            <a
              href={`mailto:${contact.email}`}
              className="contact__social-link contact__social-link--email"
              aria-label={`Send email to ${contact.email}`}
            >
              Email
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
