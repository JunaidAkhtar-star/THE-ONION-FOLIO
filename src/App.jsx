import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Navbar from './components/Navbar'
import Starfield from './components/Starfield'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Approach from './components/Approach'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="starfield-container">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Suspense fallback={null}>
            <Starfield count={5000} />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="content-wrapper">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Approach />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}

export default App
