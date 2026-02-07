import { motion } from 'framer-motion'
import './About.css'

export default function About() {
  const stats = [
    { number: '5+', label: 'Projects Completed' },
    { number: '8+', label: 'Happy Clients' },
    { number: '3+', label: 'Years Experience' },
    { number: '24/7', label: 'Support Available' },
  ]

  return (
    <section className="about-section" id="about">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="about-content"
        >
          <div className="about-text">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="section-title-left"
            >
              About Me
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="about-description"
            >
              I'm a passionate developer who transforms complex ideas into elegant and 
              a ethical hacker aspirant with maintainable code. With expertise in modern web technologies 
              and AI integration, I create solutions that are not just functional,
              but truly exceptional.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="about-description"
            >
              My approach combines clean code principles with smart AI prompting techniques, 
              ensuring every project is optimized, scalable, and future-proof. I believe in 
              continuous learning and staying ahead of the curve in this ever-evolving tech landscape.
            </motion.p>
          </div>

          <div className="about-stats">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="stat-card"
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
