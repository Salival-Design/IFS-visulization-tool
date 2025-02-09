import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import ErrorBoundary from './ErrorBoundary'
import IFSVisualization from './components/IFSVisualization'
import ControlPanel, { VisualizationSettings } from './components/ControlPanel'
import { IFSModel } from './lib/ifs-model'
import { Suspense, useState } from 'react'

const App = () => {
  // Initial model state
  const [model, setModel] = useState<IFSModel>({
    self: {
      presence: 0.8,
      position: { x: 0, y: 0, z: 0 }
    },
    parts: [
      {
        id: 'manager1',
        name: 'Perfectionist',
        type: 'manager',
        emotionalLoad: 0.7,
        position: { x: 1, y: 1, z: 0 },
        relationships: []
      },
      {
        id: 'firefighter1',
        name: 'Distracter',
        type: 'firefighter',
        emotionalLoad: 0.8,
        position: { x: -1, y: 1, z: 0 },
        relationships: []
      },
      {
        id: 'exile1',
        name: 'Lonely Child',
        type: 'exile',
        emotionalLoad: 0.9,
        position: { x: 0, y: -1, z: 0 },
        relationships: []
      }
    ]
  });

  // Initial visualization settings
  const [visualSettings, setVisualSettings] = useState<VisualizationSettings>({
    cameraDistance: 8,
    rotationSpeed: 0.001,
    particleDensity: 1000,
    selfSize: 0.8,
    partSize: 0.3,
    backgroundColor: '#0a0a0f',
    showLabels: true,
    showSparkles: true
  });

  return (
    <ErrorBoundary>
      <Canvas
        style={{
          background: visualSettings.backgroundColor,
          width: '100vw',
          height: '100vh'
        }}
        camera={{ position: [0, 0, visualSettings.cameraDistance], fov: 50 }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.2} />
          <hemisphereLight
            intensity={0.3}
            groundColor="#000000"
            color="#ffffff"
          />

          {/* Main visualization */}
          <IFSVisualization 
            model={model}
            settings={visualSettings}
          />
          
          {/* Controls */}
          <OrbitControls
            enablePan={false}
            minDistance={4}
            maxDistance={20}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Control Panel */}
      <ControlPanel
        model={model}
        onUpdateModel={setModel}
        visualSettings={visualSettings}
        onUpdateSettings={setVisualSettings}
      />
    </ErrorBoundary>
  )
}

export default App