import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { IFSModel, Part } from '../lib/ifs-model'
import { Points, Mesh } from 'three'
import { useSpring } from '@react-spring/three'
import { Html, Sparkles, Line } from '@react-three/drei'
import { VisualizationSettings } from './ControlPanel'
import { ClinicalSettings } from './ClinicalPanel'
import { partColors } from '../types/IFSModel'
import { ThreeEvent } from '@react-three/fiber'

interface IFSVisualizationProps {
  model: IFSModel;
  settings: VisualizationSettings;
  clinicalSettings: ClinicalSettings;
}

const CORE_RADIUS = 0.8
const PARTICLE_COUNT = 1000 // Background particles
const PART_SCALE = 0.3

const PartMesh: React.FC<{
  part: Part;
  settings: VisualizationSettings;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}> = ({ part, settings, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    if (part.imageUrl) {
      textureLoader.loadAsync(part.imageUrl)
        .then(loadedTexture => {
          setTexture(loadedTexture);
        })
        .catch(error => {
          console.error('Error loading texture:', error);
          setTexture(null);
        });
    } else {
      setTexture(null);
    }
  }, [part.imageUrl, textureLoader]);

  const scale = settings.partSize * (1 + (part.emotionalLoad * 0.5));
  const hoverScale = isHovered ? 1.2 : 1;

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color = new THREE.Color(texture ? 'white' : partColors[part.type]);
      materialRef.current.map = texture;
      materialRef.current.emissive = new THREE.Color(texture ? 'white' : partColors[part.type]);
      materialRef.current.emissiveIntensity = isHovered ? 0.5 : 0.2;
      materialRef.current.transparent = true;
      materialRef.current.opacity = 0.9;
      materialRef.current.needsUpdate = true;
    }
  }, [texture, part.type, isHovered]);

  return (
    <group
      position={[part.position.x, part.position.y, part.position.z]}
      scale={[scale * hoverScale, scale * hoverScale, scale * hoverScale]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial ref={materialRef} />
      </mesh>
      {settings.showLabels && part.showLabels && (
        <Html
          position={[0, 0.8, 0]}
          center
          style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: '4px 8px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          {part.name}
        </Html>
      )}
    </group>
  );
};

// Helper function for relationship line colors
const lineColor = (type: string) => {
  switch(type) {
    case 'polarization': return '#ff4444';
    case 'alliance': return '#44ff44';
    case 'protection': return '#4444ff';
    case 'burden': return '#ff8844';
    default: return '#ffffff';
  }
};

// Update the RelationshipLine component
const RelationshipLine = ({ start, end, type, strength, color }: { 
  start: THREE.Vector3, 
  end: THREE.Vector3, 
  type: string,
  strength: number,
  color: string 
}) => {
  const points = useMemo(() => [start, end], [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={strength * 3}
      dashed={type === 'polarization'}
      dashScale={type === 'polarization' ? 0.5 : 1}
      dashSize={type === 'polarization' ? 0.4 : 1}
      gapSize={type === 'polarization' ? 0.2 : 0}
      transparent
      opacity={0.8}
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

// Move all Three.js specific components into a Scene component
const Scene: React.FC<IFSVisualizationProps> = ({ model, settings, clinicalSettings }) => {
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
        sourcePart.position.x,
        sourcePart.position.y,
        sourcePart.position.z
      );
      const end = new THREE.Vector3(
        targetPart.position.x,
        targetPart.position.y,
        targetPart.position.z
      );

      return {
        start,
        end,
        type: rel.type,
        strength: rel.strength,
        color: rel.color || lineColor(rel.type)
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
          color={line.color}
        />
      ))}

      {/* Part Visualization */}
      {model.parts.map((part) => (
        <PartMesh
          key={part.id}
          part={part}
          settings={settings}
          isHovered={selectedPart === part.id}
          onClick={() => setSelectedPart(part.id)}
          onPointerOver={() => setSelectedPart(part.id)}
          onPointerOut={() => setSelectedPart(null)}
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

// Main component that doesn't use any Three.js hooks directly
export default function IFSVisualization(props: IFSVisualizationProps) {
  return <Scene {...props} />;
}