export const personalInfo = {
  name: "Santanu Mondal",
  role: "CSE Undergrad (AI & ML) · Machine Learning & Deep Learning Explorer",
  location: "Kolkata, West Bengal, India",
  email: "santanu7299@gmail.com",
  about: "Passionate B.Tech student with a strong interest in Artificial Intelligence, Machine Learning, and emerging technologies. Enjoys exploring how technology can solve real-world problems — from weather prediction models to data analysis and intelligent systems.\n\nCurrently building machine learning projects and strengthening skills in data structures, algorithms, and problem-solving. Goal-driven learner open to internships, collaborations, and learning opportunities.",
  availability: "Open to opportunities",
  github: "https://github.com/santanu737",
  linkedin: "https://linkedin.com/in/santanu-mondal-823401353",
}

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
]

export const skills = [
  {
    category: "Languages & Core",
    items: ["C", "C++", "Python", "Data Structures & Algorithms"],
  },
  {
    category: "AI / ML / Data",
    items: ["Machine Learning", "Deep Learning", "NLP", "Agentic AI & LLMs", "Data Analysis", "scikit-learn"],
  },
  {
    category: "Tools & Platforms",
    items: ["Relay (Workflow Automation)", "Cisco Packet Tracer", "HTML5 / CSS3", "Netlify"],
  },
]

export const projects = [
  {
    id: "ai-email-agent",
    title: "AI Agent for Email Reply Automation",
    description:
      "Built an AI-powered email automation system using Relay to classify incoming emails and generate context-aware reply drafts with a human-in-the-loop review step. Implemented automated classification, AI-generated replies via LLMs, and email summarization.",
    tags: ["Relay", "LLMs", "NLP", "Gmail API"],
    year: "2026",
    featured: true,
    link: null,
    github: null,
  },
  {
    id: "birthday-wish-maker",
    title: "Birthday Wish Maker — Create & Share Wishes Online",
    description:
      "Developed and deployed a web app for creating and sharing customized birthday wishes/posters with instant shareable links. Responsive design, live in production on Netlify.",
    tags: ["HTML5", "CSS3", "Netlify"],
    year: "2026",
    featured: true,
    link: "https://birthday-wishmaker.netlify.app",
    github: "https://github.com/santanu737/birthday-wish-website",
  },
  {
    id: "house-price-prediction",
    title: "House Price Prediction Model",
    description:
      "Built a regression-based machine learning model to predict house prices from property and location features. Handled data cleaning, feature engineering, and preprocessing before training and evaluating with scikit-learn.",
    tags: ["Python", "scikit-learn", "Regression", "Data Preprocessing"],
    year: "2026",
    featured: false,
    link: null,
    github: null,
  },
  {
    id: "electricity-forecasting",
    title: "University Campus Electricity Consumption Forecasting",
    description:
      "Developed a regression-based forecasting model to predict future electricity consumption trends for a university campus. Applied data preprocessing and feature analysis on time-series consumption data.",
    tags: ["Python", "scikit-learn", "Regression", "Time-Series Data"],
    year: "2026",
    featured: false,
    link: null,
    github: null,
  },
]

export const experience = [
  {
    id: "inamigos-internship",
    type: "work",
    title: "AI & Machine Learning Intern",
    company: "InAmigos Foundation (via Internshala)",
    period: "Sep 2026 – Present",
    description: "Selected for the AI & Machine Learning internship through Internshala's selection process. Remote.",
  },
  {
    id: "codsoft-internship",
    type: "work",
    title: "Machine Learning Intern",
    company: "CodSoft Internships",
    period: "Aug 2026 – Sep 2026",
    description:
      "Completed a 1-month virtual ML internship: hands-on model development, data preprocessing, and predictive analytics (fraud detection, churn prediction, spam classification) using Python, scikit-learn, and pandas.",
  },
  {
    id: "cy-coders-club",
    type: "work",
    title: "Active Member",
    company: "CY-Coders Club, Adamas University",
    period: "Aug 2024 – Present",
    description: "Applying Python, C, C++, and Data Structures in club activities and coding practice.",
  },
  {
    id: "btech-adamas",
    type: "education",
    title: "B.Tech in Computer Science & Engineering (AI & ML)",
    company: "Adamas University",
    period: "Jul 2024 – Jul 2028",
    description: "SGPA — Sem 1: 8.45 | Sem 2: 8.25 | Sem 3: 8.43 | Sem 4: 8.77",
  },
  {
    id: "higher-secondary",
    type: "education",
    title: "Higher Secondary (Science)",
    company: "Bagdah High School",
    period: "Jul 2020 – Jul 2022",
    description: "Grade: 90.2%",
  },
]

export const contact = {
  heading: "Let's build something together",
  subheading: "Open to internships, collaborations, and learning opportunities.",
  availability: "Open to opportunities",
  email: "santanu7299@gmail.com",
  socials: {
    github: "https://github.com/santanu737",
    linkedin: "https://linkedin.com/in/santanu-mondal-823401353",
    twitter: null,
  },
}

export const sceneContent = {
  sectionLabels: [
    { id: "about", label: "ABOUT", color: "#00d9ff" },
    { id: "skills", label: "SKILLS", color: "#8338ec" },
    { id: "projects", label: "PROJECTS", color: "#ff006e" },
    { id: "experience", label: "EXPERIENCE", color: "#00d9ff" },
    { id: "contact", label: "CONTACT", color: "#00d9ff" },
  ],
  skillNodes: skills.flatMap((category) =>
    category.items.map((label, index) => ({
      label,
      category: category.category,
      index,
    }))
  ),
  projectNodes: projects.map(({ id, title, year, featured }) => ({
    id,
    title,
    year,
    featured,
  })),
  contactLabel: contact.heading,
}