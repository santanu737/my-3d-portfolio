// ============================================================
// EDIT THIS FILE — all personal information lives here
// ============================================================

export const personalInfo = {
  name: 'Santanu Mondal',
  title: 'Full-Stack Developer & 3D Web Artist',
  tagline: 'Building immersive digital experiences at the intersection of code and creativity.',
  location: 'Bengaluru, India',
  email: 'santanu@example.com',
  phone: '+91 98765 43210',
  linkedin: 'https://linkedin.com/in/santanumondal',
  github: 'https://github.com/santanumondal',
  twitter: 'https://x.com/santanumondal',

  // Short bio for the About section
  about: `I'm a full-stack developer passionate about crafting immersive web experiences
    that push creative boundaries. With expertise in React, Node.js, and WebGL/Three.js,
    I build everything from scalable backend systems to interactive 3D portfolio sites.

    When I'm not coding, you'll find me exploring generative art, contributing to open-source,
    or experimenting with new web technologies. I believe the best digital experiences
    are those that delight the senses while remaining fast, accessible, and delightful to use.`,

  // For the hero section
  heroSubtitle: 'Full-Stack Developer',
  heroCTA: 'View My Work',
  heroSecondary: 'Get In Touch',

  // Footer text
  footerNote: 'Designed & built with care. Open to opportunities.',
}

export const skills = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Three.js', 'WebGL', 'GSAP', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs', 'Redis'],
  },
  {
    category: 'Tools & Cloud',
    items: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'Blender', 'CI/CD'],
  },
  {
    category: 'Creative',
    items: ['3D Modeling', 'Shader Programming', 'Generative Art', 'Motion Design', 'WebGL'],
  },
]

export const projects = [
  {
    id: 1,
    title: 'Neural Canvas',
    description:
      'A generative art platform powered by WebGL shaders and machine learning. Users create unique digital artworks by manipulating procedural parameters in real-time.',
    tags: ['WebGL', 'Three.js', 'React', 'TensorFlow.js'],
    year: '2024',
    link: '#',
    github: '#',
    featured: true,
  },
  {
    id: 2,
    title: 'Synthwave Dashboard',
    description:
      'An interactive data visualization dashboard with a synthwave aesthetic. Features animated 3D charts, particle effects, and customizable dark theme.',
    tags: ['React', 'D3.js', 'Three.js', 'GSAP'],
    year: '2024',
    link: '#',
    github: '#',
    featured: true,
  },
  {
    id: 3,
    title: 'Motion Lab',
    description:
      'A collection of scroll-driven animations and micro-interactions built with React, GSAP, and Framer Motion. Showcasing creative approaches to web animation.',
    tags: ['React', 'GSAP', 'Framer Motion', 'CSS'],
    year: '2023',
    link: '#',
    github: '#',
    featured: true,
  },
  {
    id: 4,
    title: 'EcoTrack API',
    description:
      'A RESTful API for tracking carbon footprint data. Handles authentication, data aggregation, and generates environmental impact reports.',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
    year: '2023',
    link: '#',
    github: '#',
    featured: false,
  },
  {
    id: 5,
    title: 'Pixel Editor',
    description:
      'A browser-based pixel art editor with layer support, color palettes, and export to PNG. Built with vanilla JavaScript and the Canvas API.',
    tags: ['JavaScript', 'Canvas API', 'HTML5'],
    year: '2022',
    link: '#',
    github: '#',
    featured: false,
  },
]

export const experience = [
  {
    id: 1,
    type: 'work',
    title: 'Senior Frontend Engineer',
    company: 'Nexus Digital',
    location: 'Bengaluru, India',
    period: 'Jan 2023 – Present',
    description:
      'Leading frontend architecture for a suite of enterprise SaaS products. Migrated legacy codebases to React, reduced bundle sizes by 40%, and mentored junior developers.',
    tags: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
  },
  {
    id: 2,
    type: 'work',
    title: 'Full-Stack Developer',
    company: 'CreativeStack Agency',
    location: 'Remote',
    period: 'Mar 2021 – Dec 2022',
    description:
      'Built interactive web experiences and 3D product showcases for clients in fashion, automotive, and tech. Shipped 20+ client projects on time and under budget.',
    tags: ['React', 'Node.js', 'Three.js', 'PostgreSQL'],
  },
  {
    id: 3,
    type: 'work',
    title: 'Junior Web Developer',
    company: 'StartupHub',
    location: 'Kolkata, India',
    period: 'Jun 2019 – Feb 2021',
    description:
      'Developed and maintained company websites and internal tools. Introduced component-based development practices and automated testing workflows.',
    tags: ['JavaScript', 'WordPress', 'PHP', 'MySQL'],
  },
  {
    id: 4,
    type: 'education',
    title: 'B.Tech in Computer Science',
    company: 'Jadavpur University',
    location: 'Kolkata, India',
    period: '2015 – 2019',
    description:
      'Graduated with honors. Specialized in computer graphics and distributed systems. Led the web development club and organized tech meetups.',
    tags: [],
  },
]

export const contact = {
  heading: "Let's work together",
  subheading: "Have a project in mind or just want to chat? I'd love to hear from you.",
  email: 'santanu@example.com',
  availability: 'Open to freelance projects and full-time opportunities',
  socials: {
    github: 'https://github.com/santanumondal',
    linkedin: 'https://linkedin.com/in/santanumondal',
    twitter: 'https://x.com/santanumondal',
    dribbble: '#',
  },
}

// ============================================================
// SECTION LABELS — for accessibility & navigation
// ============================================================
export const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]
