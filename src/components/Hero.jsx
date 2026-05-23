import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// --- 1. Inline BlurText Component ---
function BlurText({ text, animateBy = "words", direction = "top", delay = 150, className }) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const yOffset = direction === "top" ? -20 : 20;

  return (
    <span className={className} style={{ display: 'inline' }}>
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

// --- 2. Inline TrueFocus Component ---
const TrueFocus = ({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = '#a78bfa',
  glowColor = 'rgba(139, 92, 246, 0.6)',
  animationDuration = 0.8,
  pauseBetweenAnimations = 1.2
}) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex(prev => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = index => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  return (
    <div className="focus-container" ref={containerRef}>
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={el => (wordRefs.current[index] = el)}
            className={`focus-word ${manualMode ? 'manual' : ''} ${isActive && !manualMode ? 'active' : ''}`}
            style={{
              filter: isActive ? `blur(0px)` : `blur(${blurAmount}px)`,
              '--border-color': borderColor,
              '--glow-color': glowColor,
              transition: `filter ${animationDuration}s ease`
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="focus-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0
        }}
        transition={{
          duration: animationDuration
        }}
        style={{
          '--border-color': borderColor,
          '--glow-color': glowColor
        }}
      >
        <span className="corner top-left"></span>
        <span className="corner top-right"></span>
        <span className="corner bottom-left"></span>
        <span className="corner bottom-right"></span>
      </motion.div>
    </div>
  );
};

// --- 3. Pure-JS Physics-Based FallingText (Removes Matter-JS dependency entirely) ---
const FallingText = ({
  className = '',
  text = '',
  highlightWords = [],
  highlightClass = 'highlighted',
  trigger = 'auto',
  gravity = 0.6,
  fontSize = '1rem'
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [effectStarted, setEffectStarted] = useState(false);
  const animationFrameRef = useRef(null);
  const wordPhysicsRef = useRef([]);

  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(' ');
    const newHTML = words
      .map(word => {
        const isHighlighted = highlightWords.some(hw => word.toLowerCase().includes(hw.toLowerCase()));
        return `<span class="word ${isHighlighted ? highlightClass : ''}">${word}</span>`;
      })
      .join(' ');
    textRef.current.innerHTML = newHTML;
  }, [text, highlightWords, highlightClass]);

  useEffect(() => {
    if (trigger === 'auto') {
      setEffectStarted(true);
      return;
    }
    if (trigger === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!effectStarted || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    const wordSpans = textRef.current.querySelectorAll('.word');
    
    // Set up the high-performance pure-JS physics profiles for each word
    const physicsObjects = [...wordSpans].map((elem) => {
      const rect = elem.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      // Position absolute so they drop cleanly within the parent
      elem.style.position = 'absolute';
      elem.style.left = `${x}px`;
      elem.style.top = `${y}px`;

      return {
        elem,
        width: rect.width,
        height: rect.height,
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 1.5,
        angle: 0,
        angularVelocity: (Math.random() - 0.5) * 0.08,
        bounceCount: 0
      };
    });

    wordPhysicsRef.current = physicsObjects;

    const runPhysicsLoop = () => {
      const currentContainer = containerRef.current;
      if (!currentContainer) return;

      const rectBounds = currentContainer.getBoundingClientRect();
      const boundsWidth = rectBounds.width;
      const boundsHeight = rectBounds.height;

      wordPhysicsRef.current.forEach((obj) => {
        // Apply Gravity
        obj.vy += gravity;

        // Apply Friction & Air Resistance
        obj.vx *= 0.99;
        obj.vy *= 0.995;

        // Update Position & Angle
        obj.x += obj.vx;
        obj.y += obj.vy;
        obj.angle += obj.angularVelocity;

        // Boundary Collision Logic
        const halfW = obj.width / 2;
        const halfH = obj.height / 2;

        // Floor collision with bouncy restitution
        if (obj.y + halfH > boundsHeight) {
          obj.y = boundsHeight - halfH;
          obj.vy = -obj.vy * 0.65; // restitution coefficient
          obj.vx *= 0.7; // kinetic friction on impact
          obj.angularVelocity *= 0.6;
        }

        // Left wall collision
        if (obj.x - halfW < 0) {
          obj.x = halfW;
          obj.vx = -obj.vx * 0.65;
        }

        // Right wall collision
        if (obj.x + halfW > boundsWidth) {
          obj.x = boundsWidth - halfW;
          obj.vx = -obj.vx * 0.65;
        }

        // Apply properties to the DOM
        obj.elem.style.left = `${obj.x}px`;
        obj.elem.style.top = `${obj.y}px`;
        obj.elem.style.transform = `translate(-50%, -50%) rotate(${obj.angle}rad)`;
      });

      animationFrameRef.current = requestAnimationFrame(runPhysicsLoop);
    };

    animationFrameRef.current = requestAnimationFrame(runPhysicsLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [effectStarted, gravity]);

  const handleTrigger = () => {
    if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {
      setEffectStarted(true);
    }
  };

  // Allow users to throw words on hover or click
  const handleMouseMove = (e) => {
    if (!effectStarted || !containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - parentRect.left;
    const mouseY = e.clientY - parentRect.top;

    wordPhysicsRef.current.forEach((obj) => {
      const dx = obj.x - mouseX;
      const dy = obj.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Apply push force if cursor is close to words
      if (dist < 45) {
        const force = (45 - dist) * 0.35;
        obj.vx += (dx / dist) * force;
        obj.vy += (dy / dist) * force - 1.5; // Lift up slightly on touch
        obj.angularVelocity += (Math.random() - 0.5) * 0.15;
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className={`falling-text-container ${className}`}
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        ref={textRef}
        className="falling-text-target"
        style={{
          fontSize: fontSize,
          lineHeight: 1.8
        }}
      />
    </div>
  );
};

// --- 4. Combined CSS Styles ---
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
  -webkit-mask-composite: xor;
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
  max-width: 650px;
  opacity: 0.95;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
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

/* === TrueFocus Custom Styles === */
.focus-container {
  position: relative;
  display: inline-flex;
  gap: 0.25em;
  justify-content: flex-start;
  align-items: center;
  outline: none;
  user-select: none;
}

.focus-word {
  position: relative;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: #A78BFA;
  cursor: pointer;
  transition: filter 0.3s ease, color 0.3s ease;
  outline: none;
  user-select: none;
}

.focus-word.active {
  filter: blur(0);
}

.focus-frame {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  box-sizing: content-box;
  border: none;
}

.corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid var(--border-color, #a78bfa);
  filter: drop-shadow(0px 0px 4px var(--glow-color, rgba(139, 92, 246, 0.6)));
  border-radius: 1px;
  transition: none;
}

.top-left {
  top: -6px;
  left: -6px;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: -6px;
  right: -6px;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: -6px;
  left: -6px;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: -6px;
  right: -6px;
  border-left: none;
  border-top: none;
}

/* === FallingText Custom Styles === */
.falling-text-container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 120px; /* bounds the physical canvas for text drops */
  cursor: pointer;
  text-align: left;
}

.falling-text-target {
  display: inline-block;
  color: #FFFFFF;
}

.word {
  display: inline-block;
  margin-right: 6px;
  user-select: none;
  transition: filter 0.3s ease, color 0.3s ease;
}

.word.highlighted-tag {
  color: #A78BFA;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(167, 139, 250, 0.4);
}

/* tablet */
@media (max-width: 968px) {
  .focus-container {
    justify-content: center;
  }

  .hero-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .hero-left {
    text-align: center;
    align-items: center;
  }

  .falling-text-container {
    text-align: center;
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
          
          {/* Heading splits into BlurText for normal words, and TrueFocus for 'AI prompting' */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-heading"
          >
            <BlurText
              text="Turning complex ideas into clean code, optimized via smart"
              animateBy="words"
              direction="top"
              delay={150}
              className="hero-heading"
            />
            {' '}
            <TrueFocus 
              sentence="AI prompting"
              manualMode={false}
              blurAmount={4}
              borderColor="#a78bfa"
              glowColor="rgba(139, 92, 246, 0.65)"
              animationDuration={0.8}
              pauseBetweenAnimations={1.2}
            />
          </motion.h1>
          
          {/* Animated FallingText replacing standard hero-description paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-description"
          >
            <FallingText
              text="Turning complex ideas into clean code, optimized via expert AI prompting and protected by ethical hacking practices."
              highlightWords = {["complex", "clean", "AI", "ethical", "hacking"]}
              highlightClass="word highlighted-tag"
              trigger="hover"
              gravity={0.5}
              fontSize="clamp(1rem, 2vw, 1.15rem)"
            />
          </motion.div>
          
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
