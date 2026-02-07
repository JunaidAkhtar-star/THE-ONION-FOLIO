import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Starfield({ count = 5000 }) {
  const mesh = useRef()

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    const purple1 = new THREE.Color(0x8B5CF6) // Purple
    const purple2 = new THREE.Color(0xA78BFA) // Light purple
    const purple3 = new THREE.Color(0xC4B5FD) // Lighter purple
    const purple4 = new THREE.Color(0xDDD6FE) // Very light purple
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Random positions in a sphere
      const radius = Math.random() * 2000 + 500
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      // Random purple color
      const colorChoice = Math.random()
      let color
      if (colorChoice < 0.25) color = purple1
      else if (colorChoice < 0.5) color = purple2
      else if (colorChoice < 0.75) color = purple3
      else color = purple4
      
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    
    return [positions, colors]
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.002
      mesh.current.rotation.y += 0.003
      mesh.current.rotation.z += 0.001
    }
  })

  return (
    <>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
        />
      </points>
    </>
  )
}
