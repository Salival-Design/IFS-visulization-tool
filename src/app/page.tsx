'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState, useCallback } from 'react'
import { IFSModel } from '@/types/IFSModel'
import { VisualizationSettings } from '@/components/ControlPanel'
import { ClinicalSettings } from '@/components/ClinicalPanel'

// Dynamic imports with loading components
const IFSVisualization = dynamic(
  () => import('@/components/IFSVisualization'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading visualization...</div>
      </div>
    )
  }
)

const TimelinePanel = dynamic(
  () => import('@/components/TimelinePanel'),
  { 
    ssr: false,
    loading: () => <div className="h-20 bg-card animate-pulse" />
  }
)

const ClinicalPanel = dynamic(
  () => import('@/components/ClinicalPanel'),
  { 
    ssr: false,
    loading: () => <div className="w-80 h-full bg-card animate-pulse" />
  }
)

const ControlPanel = dynamic(
  () => import('@/components/ControlPanel'),
  { 
    ssr: false,
    loading: () => <div className="w-80 h-full bg-card animate-pulse" />
  }
)

// Default parts configuration
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
]

export default function Home() {
  const [model, setModel] = useState<IFSModel>({
    parts: defaultParts,
    self: {
      presence: 0.8,
      position: { x: 0, y: 0, z: 0 }
    },
    selfEnergy: 0.8,
    systemHarmony: 0.7,
    notes: []
  })

  const [visualSettings, setVisualSettings] = useState<VisualizationSettings>({
    selfSize: 1,
    partSize: 0.5,
    rotationSpeed: 0.01,
    particleDensity: 1000,
    showSparkles: true,
    showLabels: true,
    backgroundColor: '#000000'
  })

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
  })

  const handleModelUpdate = useCallback((newModel: IFSModel) => {
    setModel(newModel)
  }, [])

  const handleClinicalSettingsUpdate = useCallback((newSettings: ClinicalSettings) => {
    setClinicalSettings(newSettings)
  }, [])

  const handleVisualSettingsUpdate = useCallback((newSettings: VisualizationSettings) => {
    setVisualSettings(newSettings)
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="flex w-full">
        {/* Left Panel */}
        <div className="w-80 border-r bg-card">
          <Suspense fallback={<div className="w-80 h-full bg-card animate-pulse" />}>
            <ClinicalPanel
              model={model}
              clinicalSettings={clinicalSettings}
              onUpdateModel={handleModelUpdate}
              onUpdateSettings={handleClinicalSettingsUpdate}
            />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="relative flex-1">
          <Suspense fallback={
            <div className="flex h-full items-center justify-center">
              <div className="text-lg">Loading visualization...</div>
            </div>
          }>
            <IFSVisualization
              model={model}
              settings={visualSettings}
              clinicalSettings={clinicalSettings}
              onUpdateModel={handleModelUpdate}
            />
          </Suspense>
          
          {/* Timeline Panel */}
          <div className="absolute bottom-0 left-0 right-0">
            <Suspense fallback={<div className="h-20 bg-card animate-pulse" />}>
              <TimelinePanel
                model={model}
                clinicalSettings={clinicalSettings}
                onUpdateModel={handleModelUpdate}
                onUpdateSettings={handleClinicalSettingsUpdate}
              />
            </Suspense>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 border-l bg-card">
          <Suspense fallback={<div className="w-80 h-full bg-card animate-pulse" />}>
            <ControlPanel
              settings={visualSettings}
              onUpdateSettings={handleVisualSettingsUpdate}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
} 