import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import ErrorBoundary from './ErrorBoundary'
import { extend } from '@react-three/fiber'
import { AmbientLight, PointLight } from 'three'

// Extend Three.js elements to JSX
extend({ AmbientLight, PointLight })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)