import React, { useState, useCallback, useRef, createContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import ErrorBoundary from './ErrorBoundary';
import IFSVisualization from './components/IFSVisualization';
import ControlPanel, { VisualizationSettings } from './components/ControlPanel';
import CliniciansControlPanel, { ClinicalSettings } from './components/CliniciansControlPanel';
import TimelinePanel from './components/TimelinePanel';
import { IFSModel } from './types/IFSModel';
import { Suspense } from 'react';

export const DraggingContext = createContext<{
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}>({
  isDragging: false,
  setIsDragging: () => {},
});

const Scene = ({ model, settings, clinicalSettings, onUpdateModel }: { 
  model: IFSModel; 
  settings: VisualizationSettings;
  clinicalSettings: ClinicalSettings;
  onUpdateModel: (updatedModel: IFSModel) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isRotationLocked, setIsRotationLocked] = useState(false);

  return (
    <DraggingContext.Provider value={{ isDragging, setIsDragging }}>
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
        onUpdateModel={onUpdateModel}
      />
      
      {/* Controls */}
      <OrbitControls
        enabled={!isDragging && !isRotationLocked}
        enablePan={false}
        minDistance={4}
        maxDistance={20}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Rotation Lock Button */}
      <Html position={[-5, 3, 0]}>
        <button
          onClick={() => setIsRotationLocked(!isRotationLocked)}
          style={{
            backgroundColor: isRotationLocked ? 'rgba(255,50,50,0.8)' : 'rgba(50,50,50,0.8)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          {isRotationLocked ? '🔒' : '🔓'} {isRotationLocked ? 'Unlock' : 'Lock'} Rotation
        </button>
      </Html>
    </DraggingContext.Provider>
  );
};

// Add default parts
const defaultParts = [
  {
    id: 'manager_1',
    name: 'Perfectionist',
    type: 'manager' as const,
    position: { x: 2, y: 1, z: 0 },
    emotionalLoad: 0.7,
    showLabels: true,
    brightness: 0.5,
    relationships: [],
    notes: ''
  },
  {
    id: 'manager_2',
    name: 'Protector',
    type: 'manager' as const,
    position: { x: -2, y: 1, z: 0 },
    emotionalLoad: 0.6,
    showLabels: true,
    brightness: 0.5,
    relationships: [],
    notes: ''
  },
  {
    id: 'firefighter_1',
    name: 'Distracter',
    type: 'firefighter' as const,
    position: { x: 0, y: 2, z: 1 },
    emotionalLoad: 0.8,
    showLabels: true,
    brightness: 0.5,
    relationships: [],
    notes: ''
  },
  {
    id: 'exile_1',
    name: 'Inner Child',
    type: 'exile' as const,
    position: { x: 0, y: -2, z: 0 },
    emotionalLoad: 0.5,
    showLabels: true,
    brightness: 0.5,
    relationships: [],
    notes: ''
  }
];

function App() {
  const [model, setModel] = useState<IFSModel>({
    parts: defaultParts,
    self: {
      presence: 0.8,
      position: { x: 0, y: 0, z: 0 }
    },
    selfEnergy: 0.8,
    systemHarmony: 0.7,
    notes: []
  });

  const [visualSettings, setVisualSettings] = useState<VisualizationSettings>({
    selfSize: 1,
    partSize: 0.5,
    rotationSpeed: 0.01,
    particleDensity: 1000,
    showSparkles: true,
    showLabels: true,
    backgroundColor: '#000000'
  });

  const [clinicalSettings, setClinicalSettings] = useState<ClinicalSettings>({
    sessionNumber: 1,
    sessionDate: new Date().toISOString().split('T')[0],
    clientName: '',
    therapeuticGoals: [],
    sessionNotes: '',
    selfEnergyLevel: 0.5,
    unblending: 0.5,
    systemHarmony: 0.5,
    annotations: [],
    relationships: []
  });

  const handleModelUpdate = useCallback((newModel: IFSModel) => {
    setModel(newModel);
  }, []);

  const handleClinicalSettingsUpdate = useCallback((newSettings: ClinicalSettings) => {
    setClinicalSettings(newSettings);
  }, []);

  const handleVisualSettingsUpdate = useCallback((newSettings: VisualizationSettings) => {
    setVisualSettings(newSettings);
  }, []);

  return (
    <ErrorBoundary>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <Canvas
          style={{
            background: visualSettings.backgroundColor
          }}
          camera={{ position: [0, 0, 10], fov: 50 }}
        >
          <ErrorBoundary>
            <Suspense fallback={null}>
              <Scene
                model={model}
                settings={visualSettings}
                clinicalSettings={clinicalSettings}
                onUpdateModel={handleModelUpdate}
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
              onUpdateModel={handleModelUpdate}
              onUpdateSettings={handleClinicalSettingsUpdate}
            />
          </div>
          <div style={{ pointerEvents: 'auto' }}>
            <ControlPanel
              settings={visualSettings}
              onUpdateSettings={handleVisualSettingsUpdate}
            />
          </div>
        </div>

        <TimelinePanel
          model={model}
          clinicalSettings={clinicalSettings}
          onUpdateModel={handleModelUpdate}
          onUpdateSettings={handleClinicalSettingsUpdate}
        />

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

        {/* Copyright Notice */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '440px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '12px',
          padding: '8px 12px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '4px',
          zIndex: 1000
        }}>
          © {new Date().getFullYear()} The Mood & Mind Centre. All rights reserved.
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;