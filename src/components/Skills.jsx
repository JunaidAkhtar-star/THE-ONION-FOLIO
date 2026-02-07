import { motion } from 'framer-motion'
import './Skills.css'

export default function Skills() {
  const skills = [
    { name: 'HTML', logo: '/logos/html5-logo.png' }, // Orange shield with "5"
    { name: 'CSS', logo: '/logos/css3-logo.png' }, // Blue shield with "3" and "CSS" text
    { name: 'JS', logo: '/logos/js-logo.png' }, // Golden shield with "5" and "JS" text
    { name: 'Python', logo: '/logos/python-logo.png' }, // Blue and yellow intertwined snakes
    { name: 'Java', logo: '/logos/java-logo.png' }, // Blue coffee cup with red-orange steam
    { name: 'MySQL', logo: '/logos/mysql-logo.png' }, // Blue dolphin with "MySQL" text
    { name: 'TensorFlow', logo: '/logos/tensorflow-logo.png' }, // Orange/yellow 3D geometric shape
    { name: 'PyTorch', logo: '/logos/pytorch-logo.png' }, // Orange curved shape with circle
    { name: 'Kali Linux', logo: '/logos/kali-linux-logo.png' }, // Blue dragon with "KALI" text
  ]

  return (
    <section className="skills-section" id="skills">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="section-title"
        >
          Skills & Technologies
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="skills-grid"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="skill-card"
            >
              <div className="skill-logo">
                <img 
                  src={skill.logo} 
                  alt={skill.name}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="skill-placeholder" style={{ display: 'none' }}>
                  {skill.name.charAt(0)}
                </div>
              </div>
              <p className="skill-name">{skill.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
