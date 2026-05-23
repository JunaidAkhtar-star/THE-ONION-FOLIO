import React from 'react'
import { motion } from 'framer-motion'

// --- Inline BlurText Component to resolve the import error ---
function BlurText({ text, animateBy = "words", direction = "top", delay = 150, className }) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const yOffset = direction === "top" ? -20 : 20;

  return (
    <span className={className} style={{ display: 'inline-block' }}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          style={{ 
            display: "inline-block", 
            marginRight: animateBy === "words" ? "0.25em" : "0" 
          }}
          initial={{ filter: "blur(10px)", opacity: 0, y: yOffset }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: (i * delay) / 1000 }}
        >
          {el === "" ? "\u00A0" : el}
        </motion.span>
      ))}
    </span>
  );
}

// --- CSS Styles embedded with counter-clockwise rotation ---
const cssStyles = `
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 8rem 2rem 4rem;
  z-index: 1;
}

.hero-container {
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
  z-index: 2;
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Base Wrapper adjusted to cleanly house the spinning loader track */
.hero-image-wrapper {
  position: relative;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* Glowing Loader element with counter-clockwise rotation and transparent background masking */
.hero-image-loader-border {
  position: absolute;
  inset: -6px; /* expands slightly outside to form a border ring */
  border-radius: 50%;
  pointer-events: none;
  padding: 6px; /* controls the thickness of the rotating line */
  background: conic-gradient(from 0deg, #a78bfa 0%, #8b5cf6 30%, transparent 70%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.85));
  animation: spin-counter-clockwise 2.8s linear infinite;
  z-index: 1;
}

/* Mask gap layer is now fully transparent to support any underlying design */
.hero-image-inner-mask {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: transparent;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pause animation on hover */
.hero-image-wrapper:hover .hero-image-loader-border {
  animation-play-state: paused;
}

/* Smooth keyframes for counter-clockwise rotation */
@keyframes spin-counter-clockwise {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}

.hero-image-glow {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
  animation: pulse-glow 4s ease-in-out infinite;
  z-index: -1;
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.hero-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 50%;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 20px rgba(139, 92, 246, 0.2);
  width: fit-content;
}

.badge-icon {
  font-size: 1.1rem;
}

.hero-badge span:not(.badge-icon) {
  color: #FFFFFF;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.hero-heading {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.3;
  color: #FFFFFF;
  text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
  margin: 0;
}

.gradient-text {
  color: #A78BFA;
  font-weight: 800;
}

.hero-description {
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: #FFFFFF;
  line-height: 1.8;
  max-width: 650px;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.btn-primary {
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(139, 92, 246, 0.6);
}

/* === Scroll indicator === */
.scroll-indicator {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #A78BFA;
  font-size: 0.8rem;
  pointer-events: none;
}

.mouse {
  width: 30px;
  height: 50px;
  border: 2px solid #A78BFA;
  border-radius: 20px;
  position: relative;
  margin-bottom: 0.5rem;
}

.wheel {
  width: 4px;
  height: 10px;
  background: #A78BFA;
  border-radius: 2px;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  animation: scroll 2s infinite;
}

@keyframes scroll {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
}

/* tablet */
@media (max-width: 968px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .hero-left {
    text-align: center;
    align-items: center;
  }
  
  .hero-image-container {
    order: -1;
  }
  
  .hero-image-wrapper {
    width: 280px;
    height: 280px;
  }
  
  .hero-badge,
  .hero-description {
    margin: 0 auto;
  }
}

/* mobile */
@media (max-width: 768px) {
  .hero-section {
    padding: 6rem 1rem 5.5rem;
  }
  
  .hero-image-wrapper {
    width: 250px;
    height: 250px;
  }
  
  .hero-buttons {
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  
  .btn-primary {
    width: 100%;
    max-width: 300px;
  }

  .scroll-indicator {
    bottom: -2rem;
    font-size: 0.75rem;
  }

  .mouse {
    width: 24px;
    height: 40px;
  }

  .wheel {
    height: 9px;
  }
}
`;

export default function Hero() {
  return (
    <section className="hero-section" id="home">
      {/* Inject Style rules directly into document block */}
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

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
          
          {/* Heading with inline BlurText animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-heading"
          >
            <BlurText
              text="Turning complex ideas into clean code, optimized via smart AI prompting"
              animateBy="words"
              direction="top"
              delay={150}
              className="hero-heading"
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
            {/* Animated Single Color Conic Glowing Loader Border (Counter-Clockwise) */}
            <div className="hero-image-loader-border" />

            {/* Inner mask handles transparent spacing */}
            <div className="hero-image-inner-mask">
              <div className="hero-image-glow"></div>
              {/* Uses your profile photo path natively */}
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
