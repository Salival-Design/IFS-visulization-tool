import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ErrorBoundary from './ErrorBoundary'
import IFSVisualization from './components/IFSVisualization'
import ControlPanel, { VisualizationSettings } from './components/ControlPanel'
import CliniciansControlPanel, { ClinicalSettings } from './components/CliniciansControlPanel'
import { IFSModel } from './lib/ifs-model'
import { Suspense, useState } from 'react'

const Scene = ({ model, settings, clinicalSettings }: { 
  model: IFSModel; 
  settings: VisualizationSettings;
  clinicalSettings: ClinicalSettings;
}) => {
  return (
    <>
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
        settings={settings}
        clinicalSettings={clinicalSettings}
      />
      
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={20}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
};

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
        relationships: [],
        imageUrl: '',
        showLabels: true
      },
      {
        id: 'firefighter1',
        name: 'Distracter',
        type: 'firefighter',
        emotionalLoad: 0.8,
        position: { x: -1, y: 1, z: 0 },
        relationships: [],
        imageUrl: '',
        showLabels: true
      },
      {
        id: 'exile1',
        name: 'Lonely Child',
        type: 'exile',
        emotionalLoad: 0.9,
        position: { x: 0, y: -1, z: 0 },
        relationships: [],
        imageUrl: '',
        showLabels: true
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

  // Initial clinical settings
  const [clinicalSettings, setClinicalSettings] = useState<ClinicalSettings>({
    sessionNumber: 1,
    sessionDate: new Date().toISOString().split('T')[0],
    clientName: '',
    therapeuticGoals: [],
    sessionNotes: '',
    selfEnergyLevel: 0.8,
    unblending: 0.5,
    systemHarmony: 0.6,
    annotations: [],
    relationships: []
  });

  return (
    <ErrorBoundary>
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Canvas
          style={{
            background: visualSettings.backgroundColor
          }}
          camera={{ position: [0, 0, visualSettings.cameraDistance], fov: 50 }}
        >
          <ErrorBoundary>
            <Suspense fallback={null}>
              <Scene
                model={model}
                settings={visualSettings}
                clinicalSettings={clinicalSettings}
              />
            </Suspense>
          </ErrorBoundary>
        </Canvas>

        {/* Control Panels */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          pointerEvents: 'none'
        }}>
          <div style={{ pointerEvents: 'auto' }}>
            <CliniciansControlPanel
              model={model}
              clinicalSettings={clinicalSettings}
              onUpdateModel={setModel}
              onUpdateSettings={setClinicalSettings}
            />
          </div>
          <div style={{ pointerEvents: 'auto' }}>
            <ControlPanel
              model={model}
              onUpdateModel={setModel}
              visualSettings={visualSettings}
              onUpdateSettings={setVisualSettings}
            />
          </div>
        </div>

        {/* Help Tooltip */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          fontSize: '14px'
        }}>
          <strong>Controls:</strong> Left Click = Select Parts | Right Click + Drag = Rotate | Scroll = Zoom
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;