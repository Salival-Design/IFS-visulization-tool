import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { IFSModel } from '../lib/ifs-model'
import { Points, Mesh, Line } from 'three'
import { useSpring, animated } from '@react-spring/three'
import { Html, Sparkles, Line as DreiLine } from '@react-three/drei'
import { VisualizationSettings } from './ControlPanel'
import { ClinicalSettings } from './ClinicalPanel'

interface IFSVisualizationProps {
  model: IFSModel;
  settings: VisualizationSettings;
  clinicalSettings: ClinicalSettings;
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
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const textureLoader = new THREE.TextureLoader();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (part.imageUrl) {
      textureLoader.load(part.imageUrl, (loadedTexture) => {
        setTexture(loadedTexture);
      });
    }
  }, [part.imageUrl]);

  // Animate on hover
  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  })

  useFrame((state) => {
    if (!meshRef.current) return;
    // Gentle floating motion
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime + part.id.length) * 0.0005;
  });

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
      {texture ? (
        <meshPhysicalMaterial
          map={texture}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
          emissiveMap={texture}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      ) : (
        <meshPhysicalMaterial
          color={partColors[part.type as keyof typeof partColors]}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
          emissive={partColors[part.type as keyof typeof partColors]}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      )}
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
          count={30}
          scale={0.4}
          size={2}
          speed={0.2}
          opacity={0.3}
          color={partColors[part.type as keyof typeof partColors]}
        />
      )}
    </animated.mesh>
  );
}

// Helper component for relationship lines
const RelationshipLine = ({ start, end, type, strength }: { 
  start: THREE.Vector3, 
  end: THREE.Vector3, 
  type: string,
  strength: number 
}) => {
  const lineColor = useMemo(() => {
    switch(type) {
      case 'polarization': return '#ff4444';
      case 'alliance': return '#44ff44';
      case 'protection': return '#4444ff';
      case 'burden': return '#ff8844';
      default: return '#ffffff';
    }
  }, [type]);

  const points = useMemo(() => [start, end], [start, end]);

  return (
    <DreiLine
      points={points}
      color={lineColor}
      lineWidth={strength * 5}
      dashed={type === 'polarization'}
    />
  );
};

// Helper component for annotations
const Annotation = ({ text, position, type }: { 
  text: string, 
  position: { x: number, y: number, z: number },
  type: string 
}) => {
  const [hovered, setHovered] = useState(false);
  
  const backgroundColor = useMemo(() => {
    switch(type) {
      case 'insight': return 'rgba(100, 200, 255, 0.9)';
      case 'observation': return 'rgba(255, 200, 100, 0.9)';
      case 'intervention': return 'rgba(100, 255, 150, 0.9)';
      case 'homework': return 'rgba(255, 150, 100, 0.9)';
      default: return 'rgba(200, 200, 200, 0.9)';
    }
  }, [type]);

  return (
    <Html
      position={[position.x, position.y, position.z]}
      style={{ 
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.2s'
      }}
    >
      <div
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          backgroundColor,
          color: 'black',
          fontSize: '14px',
          maxWidth: '200px',
          pointerEvents: 'auto',
          cursor: 'pointer'
        }}
      >
        <strong>{type.charAt(0).toUpperCase() + type.slice(1)}</strong>
        <p style={{ margin: '4px 0 0 0' }}>{text}</p>
      </div>
    </Html>
  );
};

export default function IFSVisualization({ model, settings, clinicalSettings }: IFSVisualizationProps) {
  const particles = useRef<Points>(null)
  const selfRef = useRef<Mesh>(null)
  const [selectedPart, setSelectedPart] = useState<string | null>(null)

  // Create a fixed-size buffer for background particles
  const { positions, geometry } = useMemo(() => {
    const maxParticles = 2000 // Set a fixed maximum
    const positions = new Float32Array(maxParticles * 3)
    
    // Initialize all particles, even if we don't use them all
    for (let i = 0; i < maxParticles; i++) {
      const radius = 5 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    // Set draw range to control how many particles are actually rendered
    geometry.setDrawRange(0, settings.particleDensity)

    return { positions, geometry }
  }, []) // Empty dependency array - only create once

  // Calculate relationship lines
  const relationshipLines = useMemo(() => {
    if (!clinicalSettings?.relationships) return [];
    
    return clinicalSettings.relationships.map(rel => {
      const sourcePart = model.parts.find(p => p.id === rel.sourceId);
      const targetPart = model.parts.find(p => p.id === rel.targetId);
      
      if (!sourcePart || !targetPart) return null;

      const start = new THREE.Vector3(
        sourcePart.position.x * 2,
        sourcePart.position.y * 2,
        sourcePart.position.z * 2
      );
      const end = new THREE.Vector3(
        targetPart.position.x * 2,
        targetPart.position.y * 2,
        targetPart.position.z * 2
      );

      return {
        start,
        end,
        type: rel.type,
        strength: rel.strength
      };
    }).filter(Boolean);
  }, [model.parts, clinicalSettings?.relationships]);

  // Process annotations
  const processedAnnotations = useMemo(() => {
    if (!clinicalSettings?.annotations) return [];
    
    return clinicalSettings.annotations.map(ann => {
      if (ann.attachedTo) {
        const attachedPart = model.parts.find(p => p.id === ann.attachedTo);
        if (attachedPart) {
          return {
            ...ann,
            position: {
              x: attachedPart.position.x * 2 + 0.5,
              y: attachedPart.position.y * 2 + 0.5,
              z: attachedPart.position.z * 2
            }
          };
        }
      }
      return ann;
    });
  }, [model.parts, clinicalSettings?.annotations]);

  useFrame((state) => {
    if (!selfRef.current || !particles.current) return

    // Rotate self nucleus gently
    selfRef.current.rotation.y += settings.rotationSpeed
    
    // Update particle positions with animation
    const positions = particles.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < settings.particleDensity; i++) {
      const i3 = i * 3
      positions[i3] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.001
      positions[i3 + 1] += Math.cos(state.clock.elapsedTime * 0.1 + i) * 0.001
      positions[i3 + 2] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.001
    }
    particles.current.geometry.attributes.position.needsUpdate = true
    // Update draw range based on current settings
    particles.current.geometry.setDrawRange(0, settings.particleDensity)
  })

  return (
    <group>
      {/* Background particle system */}
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={settings.particleDensity}
            array={positions}
            itemSize={3}
            usage={THREE.DynamicDrawUsage}
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
          emissiveIntensity={(clinicalSettings?.selfEnergyLevel ?? 0.5) * 0.8}
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
            opacity={(clinicalSettings?.selfEnergyLevel ?? 0.5) * 0.7}
            color="#ffaa00"
          />
        )}
      </mesh>

      {/* Relationship Lines */}
      {relationshipLines.map((line, index) => line && (
        <RelationshipLine
          key={`line-${index}`}
          start={line.start}
          end={line.end}
          type={line.type}
          strength={line.strength}
        />
      ))}

      {/* Part Visualization */}
      {model.parts.map((part) => (
        <PartParticle
          key={part.id}
          part={part}
          settings={settings}
          onClick={() => setSelectedPart(part.id)}
        />
      ))}

      {/* Clinical Annotations */}
      {processedAnnotations.map((annotation) => (
        <Annotation
          key={annotation.id}
          text={annotation.text}
          position={annotation.position}
          type={annotation.type}
        />
      ))}
    </group>
  )
}