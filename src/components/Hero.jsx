import { motion } from 'framer-motion'
import BlurText from './BlurText' // <– add this import
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-container">
        <div className="hero-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-badge"
          >
            <span className="badge-icon">⭐</span>
            <span>Frontend Developer & AI Specialist</span>
          </motion.div>
          
          {/* Heading with BlurText animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-heading"
          >
            <BlurText
              text="Turning complex ideas into clean code, optimized via smart AI prompting"
              animateBy="words"      // or "letters"
              direction="top"        // same style as demo
              delay={150}
              className="hero-heading" // keep your existing color/size
            />
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-description"
          >
            Turning complex ideas into clean code, optimized via expert AI prompting and
            protected by ethical hacking practices.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-buttons"
          >
            <button 
              className="btn-primary"
              onClick={() =>
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              View my projects
            </button>
          </motion.div>
        </div>

        <div className="hero-image-container">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-image-wrapper"
          >
            <div className="hero-image-glow"></div>
            <img 
              src="/profile-photo.jpg" 
              alt="Profile" 
              className="hero-image"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="hero-image-placeholder" style={{ display: 'none' }}>
              <span>Your Photo</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="scroll-indicator"
      >
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <p>Scroll to explore</p>
      </motion.div>
    </section>
  )
}

