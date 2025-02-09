import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { IFSModel } from '../lib/ifs-model'
import { Points, Mesh } from 'three'
import { useSpring, animated } from '@react-spring/three'
import { Html, Sparkles } from '@react-three/drei'
import { VisualizationSettings } from './ControlPanel'

interface IFSVisualizationProps {
  model: IFSModel;
  settings: VisualizationSettings;
}

const CORE_RADIUS = 0.8
const PARTICLE_COUNT = 1000 // Background particles
const PART_SCALE = 0.3

// Color schemes for different part types
const partColors = {
  manager: '#4a90e2',    // Calming blue
  firefighter: '#e25c45', // Energetic red
  exile: '#9b59b6',      // Deep purple
}

const PartParticle = ({ part, settings, onClick }: { part: any, settings: VisualizationSettings, onClick: () => void }) => {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  // Animate on hover
  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  })

  useFrame((state) => {
    if (!meshRef.current) return
    // Gentle floating motion
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime + part.id.length) * 0.0005
  })

  return (
    <animated.mesh
      ref={meshRef}
      position={[part.position.x * 2, part.position.y * 2, part.position.z * 2]}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[settings.partSize, 32, 32]} />
      <meshPhysicalMaterial
        color={partColors[part.type as keyof typeof partColors]}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.8}
        emissive={partColors[part.type as keyof typeof partColors]}
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />
      {settings.showLabels && hovered && (
        <Html distanceFactor={15}>
          <div className="part-label" style={{
            background: 'rgba(0,0,0,0.8)',
            padding: '8px 12px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}>
            <strong>{part.name}</strong>
            <br />
            Load: {(part.emotionalLoad * 100).toFixed(0)}%
          </div>
        </Html>
      )}
      {settings.showSparkles && (
        <Sparkles
          count={20}
          scale={0.4}
          size={2}
          speed={0.2}
          opacity={0.3}
          color={partColors[part.type as keyof typeof partColors]}
        />
      )}
    </animated.mesh>
  )
}

export default function IFSVisualization({ model, settings }: IFSVisualizationProps) {
  const particles = useRef<Points>(null)
  const selfRef = useRef<Mesh>(null)
  const [selectedPart, setSelectedPart] = useState<string | null>(null)

  // Background particle system
  const positions = useMemo(() => {
    const arr = new Float32Array(settings.particleDensity * 3)
    for (let i = 0; i < settings.particleDensity; i++) {
      const radius = 5 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = radius * Math.cos(phi)
    }
    return arr
  }, [settings.particleDensity])

  useFrame((state) => {
    if (!selfRef.current || !particles.current) return

    // Rotate self nucleus gently
    selfRef.current.rotation.y += settings.rotationSpeed
    
    // Animate background particles
    const positions = particles.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < settings.particleDensity; i++) {
      const i3 = i * 3
      positions[i3] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.001
      positions[i3 + 1] += Math.cos(state.clock.elapsedTime * 0.1 + i) * 0.001
      positions[i3 + 2] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.001
    }
    particles.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group>
      {/* Background particle system */}
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={settings.particleDensity}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#ffffff"
          transparent
          opacity={0.3}
          sizeAttenuation
        />
      </points>

      {/* Core Self Nucleus */}
      <mesh ref={selfRef} position={[0, 0, 0]}>
        <sphereGeometry args={[settings.selfSize, 64, 64]} />
        <meshPhysicalMaterial
          color="#ffd700"
          emissive="#ffaa00"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
        {settings.showSparkles && (
          <Sparkles
            count={30}
            scale={1}
            size={4}
            speed={0.2}
            opacity={0.5}
            color="#ffaa00"
          />
        )}
      </mesh>

      {/* Part Visualization */}
      {model.parts.map((part) => (
        <PartParticle
          key={part.id}
          part={part}
          settings={settings}
          onClick={() => setSelectedPart(part.id)}
        />
      ))}
    </group>
  )
}