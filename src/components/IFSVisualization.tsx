import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { IFSModel } from '../lib/ifs-model'
import { Points, Mesh } from 'three'

interface IFSVisualizationProps {
  model: IFSModel;
}

const CORE_RADIUS = 0.5

export default function IFSVisualization({ model }: IFSVisualizationProps) {
  const particles = useRef<Points>(null)

  const positions = useMemo(() => {
    const numParticles = model.parts.length;
    const arr = new Float32Array(numParticles * 3)
    for (let i = 0; i < numParticles; i++) {
      const part = model.parts[i];

      // Initial positions - spread out a bit
      const pos = new THREE.Vector3()
      pos.randomDirection().multiplyScalar(CORE_RADIUS * (1.5 + Math.random())) // Further out than core
      arr.set([pos.x, pos.y, pos.z], i * 3)
    }
    console.log('Particle system initialized', model)
    return arr
  }, [model])

  useFrame((state) => {
    if (!particles.current) return;

    particles.current.geometry.attributes.position.needsUpdate = true
    const positions = particles.current.geometry.attributes.position.array
    const numParticles = model.parts.length;

    // Animate particle system based on IFS Model
    for (let i = 0; i < numParticles; i++) {
      const i3 = i * 3;
      const part = model.parts[i];

      // Calculate distance from the core
      const dist = Math.sqrt(positions[i3]**2 + positions[i3+1]**2 + positions[i3+2]**2);

      // Basic attraction to the core
      let attraction = Math.max(0, CORE_RADIUS - dist) * 0.01;

      // Adjust attraction based on emotional load
      attraction -= part.emotionalLoad * 0.02; // Higher emotional load, further away

      // Apply attraction and random movement
      positions[i3] += (positions[i3] * -attraction) + (Math.random() - 0.5) * 0.01;
      positions[i3+1] += (positions[i3+1] * -attraction) + (Math.random() - 0.5) * 0.01;
      positions[i3+2] += (positions[i3+2] * -attraction) + (Math.random() - 0.5) * 0.01;
    }
  })

  return (
    <group>
      {/* Core Self Nucleus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[CORE_RADIUS, 32, 32]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffaa00" />
      </mesh>

      {/* Particle System */}
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={model.parts.length}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00aaff" // TODO: Color based on part type
          transparent
          opacity={0.8}
        />
      </points>
    </group>
  )
}