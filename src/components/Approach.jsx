import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// ==========================================
// PIXEL ANIMATION ENGINE (From React Bits)
// ==========================================
class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

function getEffectiveSpeed(value, reducedMotion) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;
  const parsed = parseInt(value, 10);

  if (parsed <= min || reducedMotion) {
    return min;
  } else if (parsed >= max) {
    return max * throttle;
  } else {
    return parsed * throttle;
  }
}

const VARIANTS = {
  default: {
    activeColor: null,
    gap: 5,
    speed: 35,
    colors: '#f8fafc,#f1f5f9,#cbd5e1',
    noFocus: false
  },
  blue: {
    activeColor: '#e0f2fe',
    gap: 10,
    speed: 25,
    colors: '#e0f2fe,#7dd3fc,#0ea5e9',
    noFocus: false
  },
  yellow: {
    activeColor: '#fef08a',
    gap: 3,
    speed: 20,
    colors: '#fef08a,#fde047,#eab308',
    noFocus: false
  },
  pink: {
    activeColor: '#fecdd3',
    gap: 6,
    speed: 80,
    colors: '#fecdd3,#fda4af,#e11d48',
    noFocus: true
  }
};

function PixelCard({ variant = 'default', gap, speed, colors, noFocus, className = '', children }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const animationRef = useRef(null);
  const timePreviousRef = useRef(performance.now());
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const variantCfg = VARIANTS[variant] || VARIANTS.default;
  const finalGap = gap ?? variantCfg.gap;
  const finalSpeed = speed ?? variantCfg.speed;
  const finalColors = colors ?? variantCfg.colors;
  const finalNoFocus = noFocus ?? variantCfg.noFocus;

  const initPixels = () => {
    if (!containerRef.current || !canvasRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    const ctx = canvasRef.current.getContext('2d');

    canvasRef.current.width = width;
    canvasRef.current.height = height;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    const colorsArray = finalColors.split(',');
    const pxs = [];
    for (let x = 0; x < width; x += parseInt(finalGap, 10)) {
      for (let y = 0; y < height; y += parseInt(finalGap, 10)) {
        const color = colorsArray[Math.floor(Math.random() * colorsArray.length)];

        const dx = x - width / 2;
        const dy = y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delay = reducedMotion.current ? 0 : distance;

        pxs.push(new Pixel(canvasRef.current, ctx, x, y, color, getEffectiveSpeed(finalSpeed, reducedMotion.current), delay));
      }
    }
    pixelsRef.current = pxs;
  };

  const doAnimate = fnName => {
    animationRef.current = requestAnimationFrame(() => doAnimate(fnName));
    const timeNow = performance.now();
    const timePassed = timeNow - timePreviousRef.current;
    const timeInterval = 1000 / 60;

    if (timePassed < timeInterval) return;
    timePreviousRef.current = timeNow - (timePassed % timeInterval);

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    let allIdle = true;
    for (let i = 0; i < pixelsRef.current.length; i++) {
      const pixel = pixelsRef.current[i];
      pixel[fnName]();
      if (!pixel.isIdle) {
        allIdle = false;
      }
    }
    if (allIdle) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleAnimation = name => {
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => doAnimate(name));
  };

  const onMouseEnter = () => handleAnimation('appear');
  const onMouseLeave = () => handleAnimation('disappear');
  const onFocus = e => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    handleAnimation('appear');
  };
  const onBlur = e => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    handleAnimation('disappear');
  };

  useEffect(() => {
    initPixels();
    const observer = new ResizeObserver(() => {
      initPixels();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [finalGap, finalSpeed, finalColors, finalNoFocus]);

  return (
    <div
      ref={containerRef}
      className={`pixel-card ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={finalNoFocus ? undefined : onFocus}
      onBlur={finalNoFocus ? undefined : onBlur}
      tabIndex={finalNoFocus ? -1 : 0}
    >
      <canvas className="pixel-canvas" ref={canvasRef} />
      {children}
    </div>
  );
}

// ==========================================
// APPROACH SUB-COMPONENT AND PORTFOLIO VIEW
// ==========================================
export function ApproachSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const styleId = "approach-styles-injection";
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.innerHTML = `
        .approach-section {
          min-height: 100vh;
          padding: 8rem 2rem;
          position: relative;
          z-index: 1;
          background: transparent; /* Removed the black background color */
          color: #f9fafb;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .approach-section .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 3rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 3rem;
          color: #ffffff;
        }

        .approach-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          padding: 2rem 0;
        }

        /* Card base layout container */
        .approach-card {
          position: relative;
          background: radial-gradient(circle at top, rgba(167, 139, 250, 0.2), rgba(15, 23, 42, 0.95));
          border: 1px solid rgba(167, 139, 250, 0.35);
          border-radius: 24px;
          padding: 0;
          min-height: 280px;
          backdrop-filter: blur(12px);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
          cursor: pointer;
          overflow: hidden;
          transform: translateY(0) scale(1);
        }

        /* Subtle glow overlay */
        .approach-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, rgba(244, 244, 245, 0.25), transparent 55%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 1;
        }

        .approach-card.hovered::before {
          opacity: 1;
        }

        .approach-card.hovered {
          transform: translateY(-12px) scale(1.04);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.85);
          border-color: rgba(196, 181, 253, 0.9);
        }

        /* Overrides for default PixelCard wrapper layout */
        .approach-pixel-card.pixel-card {
          width: 100% !important;
          height: 100% !important;
          aspect-ratio: auto !important;
          display: flex !important;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
          border: none !important;
          background: transparent !important;
          padding: 2.5rem;
          box-sizing: border-box;
          border-radius: inherit;
          user-select: auto;
        }

        /* Ensure drawing canvas stays strictly behind the card text */
        .approach-pixel-card .pixel-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        /* Phase badge styling */
        .approach-phase-tag {
          position: absolute;
          top: -1rem;
          right: -1rem;
          z-index: 2;
        }

        .approach-phase-tag span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          border: 1px solid rgba(196, 181, 253, 0.6);
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* Inner Content */
        .approach-content-inner {
          position: relative;
          z-index: 2;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .approach-preview,
        .approach-details {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .approach-preview {
          justify-content: center;
          align-items: flex-start;
          min-height: 200px;
        }

        .approach-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #f9fafb;
          margin-bottom: 0.75rem;
          text-shadow: 0 0 12px rgba(15, 23, 42, 0.8);
        }

        .approach-short-desc {
          color: #c4b5fd;
          font-size: 0.98rem;
          line-height: 1.7;
          max-width: 22rem;
        }

        .hover-hint {
          margin-top: 1.25rem;
          color: rgba(196, 181, 253, 0.7);
          font-size: 0.85rem;
          font-style: italic;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        .approach-details {
          justify-content: flex-start;
        }

        .approach-full-desc {
          color: #e5e7eb;
          font-size: 0.95rem;
          line-height: 1.8;
          margin-top: 0.5rem;
          margin-bottom: 1.25rem;
          max-width: 26rem;
        }

        .approach-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .approach-list li {
          color: #ddd6fe;
          font-size: 0.9rem;
          line-height: 1.8;
          margin-bottom: 0.5rem;
          padding-left: 1.4rem;
          position: relative;
        }

        .approach-list li::before {
          content: '▸';
          position: absolute;
          left: 0;
          top: 0.1rem;
          color: #a78bfa;
          font-size: 0.8rem;
        }

        /* Canvas basic stylesheet fallbacks */
        .pixel-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .pixel-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        @media (max-width: 768px) {
          .approach-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .approach-card {
            min-height: 250px;
            position: relative;
          }

          .approach-pixel-card.pixel-card {
            padding: 2rem;
          }

          .approach-title {
            font-size: 1.45rem;
          }
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  const approaches = [
    {
      id: 1,
      phase: "Phase 1",
      title: "Planning & Strategy",
      shortDesc:
        "We define goals, audience, and features so your website has a clear direction.",
      fullDesc:
        "We’ll collaborate to map out your website’s goals, target audience, and key functionalities. We’ll also discuss site structure, navigation, and content requirements so every screen has a purpose.",
      bullets: [
        "Define goals, target users, and success metrics",
        "Map sitemap, flows, and key user journeys",
        "Decide tech stack and integrations up front",
        "Plan content, sections, and page hierarchy",
      ],
    },
    {
      id: 2,
      phase: "Phase 2",
      title: "Design, Dev & Progress",
      shortDesc:
        "I turn ideas into smooth interfaces while keeping you in the loop.",
      fullDesc:
        "Once we agree on the plan, I cue my lofi playlist and dive into building. From first wireframes to polished UI, I share regular updates so you can see your project evolving in real time.",
      bullets: [
        "Wireframes and interactive UI prototypes",
        "Responsive layouts for desktop and mobile",
        "Clean, reusable components and animations",
        "Frequent check-ins and progress demos",
      ],
    },
    {
      id: 3,
      phase: "Phase 3",
      title: "Development & Launch",
      shortDesc:
        "We polish, test, deploy, and make sure everything just works.",
      fullDesc:
        "This is where the magic happens. I integrate APIs, optimize performance, and prepare your project for production. After launch, I help with fixes and improvements so you stay confident going live.",
      bullets: [
        "Connect backend, APIs, and auth if needed",
        "Performance, accessibility, and SEO checks",
        "Deploy to production with best practices",
        "Post-launch support and small refinements",
      ],
    },
  ];

  return (
    <section className="approach-section" id="approach">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="section-title"
        >
          My Approach
        </motion.h2>

        <div className="approach-grid">
          {approaches.map((approach, index) => {
            const isHovered = hoveredIndex === approach.id;

            return (
              <motion.div
                key={approach.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(approach.id)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`approach-card ${isHovered ? "hovered" : ""}`}
              >
                <PixelCard 
                  variant="pink" 
                  speed={80} 
                  gap={6} 
                  noFocus={true}
                  className="approach-pixel-card"
                >
                  <div className="approach-content-inner">
                    <div className="approach-phase-tag">
                      <span>{approach.phase}</span>
                    </div>

                    {isHovered ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="approach-details"
                      >
                        <h3 className="approach-title">{approach.title}</h3>
                        <p className="approach-full-desc">
                          {approach.fullDesc}
                        </p>
                        <ul className="approach-list">
                          {approach.bullets.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : (
                      <div className="approach-preview">
                        <h3 className="approach-title">{approach.title}</h3>
                        <p className="approach-short-desc">
                          {approach.shortDesc}
                        </p>
                        <div className="hover-hint">
                          Hover to see the full phase →
                        </div>
                      </div>
                    )}
                  </div>
                </PixelCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// UNIFIED APTRY ENTRYPOINT
// ==========================================
export default function App() {
  return <ApproachSection />;
}
