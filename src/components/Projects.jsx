import { motion } from 'framer-motion'
import './Projects.css'

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: 'Rhythm Box',
      description: 'A user-friendly web-based music website with beat animation.',
      image: '/projects/project1.jpg',
      tech: ['HTML', 'CSS', 'Tailwind CSS'],
      link: '#'
    },
    {
      id: 2,
      title: 'Chatbot Ticketing System',
      description: 'A fully chatbot-driven ticketing website that is available 24/7 for users anytime.',
      image: '/projects/project2.jpg',
      tech: ['HTML', 'CSS', 'JavaScript'],
      link: '#'
    },
    {
      id: 3,
      title: 'Cattle Vision AI',
      description: 'AI Cattle Health Assistant for image-based breed and disease prediction with farmer feedback.',
      image: '/projects/project3.jpg',
      tech: ['Python', 'Flask', 'PyTorch', 'Google OAuth'],
      link: '#'
    },
    {
      id: 4,
      title: 'The Onion Folio',
      description: 'Animated 3D React portfolio development.',
      image: '/projects/project4.jpg',
      tech: ['React', 'JSON'],
      link: '#'
    },
  ]

  return (
    <section className="projects-section" id="projects">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="section-title"
        >
          Featured Projects
        </motion.h2>
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="project-card"
            >
              <div className="project-image-wrapper">
                <img 
                  src={project.image} 
                  alt={project.title}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="project-placeholder" style={{ display: 'none' }}>
                  <span>{project.title}</span>
                </div>
                <div className="project-overlay">
                  <a href={project.link} className="project-link">
                    View Project →
                  </a>
                </div>
              </div>
              
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-tech">
                  {project.tech.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
