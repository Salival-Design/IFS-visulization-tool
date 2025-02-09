import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ErrorBoundary from './ErrorBoundary'
import IFSVisualization from './components/IFSVisualization'
import { IFSModel } from './types'

const App = () => {
  const sampleModel: IFSModel = {
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
  }

  return (
    <ErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: '#111' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <IFSVisualization model={sampleModel} />
        <OrbitControls />
      </Canvas>
    </ErrorBoundary>
  )
}

export default App