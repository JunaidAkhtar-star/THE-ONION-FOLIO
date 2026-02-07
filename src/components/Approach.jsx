import { motion } from 'framer-motion'
import { useState } from 'react'
import './Approach.css'

export default function Approach() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const approaches = [
    {
      id: 1,
      phase: 'Phase 1',
      title: 'Planning & Strategy',
      shortDesc:
        'We define goals, audience, and features so your website has a clear direction.',
      fullDesc:
        'We’ll collaborate to map out your website’s goals, target audience, and key functionalities. We’ll also discuss site structure, navigation, and content requirements so every screen has a purpose.',
      bullets: [
        'Define goals, target users, and success metrics',
        'Map sitemap, flows, and key user journeys',
        'Decide tech stack and integrations up front',
        'Plan content, sections, and page hierarchy',
      ],
    },
    {
      id: 2,
      phase: 'Phase 2',
      title: 'Design, Dev & Progress',
      shortDesc:
        'I turn ideas into smooth interfaces while keeping you in the loop.',
      fullDesc:
        'Once we agree on the plan, I cue my lofi playlist and dive into building. From first wireframes to polished UI, I share regular updates so you can see your project evolving in real time.',
      bullets: [
        'Wireframes and interactive UI prototypes',
        'Responsive layouts for desktop and mobile',
        'Clean, reusable components and animations',
        'Frequent check-ins and progress demos',
      ],
    },
    {
      id: 3,
      phase: 'Phase 3',
      title: 'Development & Launch',
      shortDesc:
        'We polish, test, deploy, and make sure everything just works.',
      fullDesc:
        'This is where the magic happens. I integrate APIs, optimize performance, and prepare your project for production. After launch, I help with fixes and improvements so you stay confident going live.',
      bullets: [
        'Connect backend, APIs, and auth if needed',
        'Performance, accessibility, and SEO checks',
        'Deploy to production with best practices',
        'Post-launch support and small refinements',
      ],
    },
  ]

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
            const isHovered = hoveredIndex === approach.id

            return (
              <motion.div
                key={approach.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(approach.id)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`approach-card ${isHovered ? 'hovered' : ''}`}
              >
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
                    <p className="approach-full-desc">{approach.fullDesc}</p>
                    <ul className="approach-list">
                      {approach.bullets.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <div className="approach-preview">
                    <h3 className="approach-title">{approach.title}</h3>
                    <p className="approach-short-desc">{approach.shortDesc}</p>
                    <div className="hover-hint">Hover to see the full phase →</div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
