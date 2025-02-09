'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const IFSVisualization = dynamic(
  () => import('@/components/IFSVisualization'),
  { ssr: false }
)

const TimelinePanel = dynamic(
  () => import('@/components/TimelinePanel'),
  { ssr: false }
)

const ClinicalPanel = dynamic(
  () => import('@/components/ClinicalPanel'),
  { ssr: false }
)

const ControlPanel = dynamic(
  () => import('@/components/ControlPanel'),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="flex w-full">
        {/* Left Panel */}
        <div className="w-80 border-r bg-card">
          <ClinicalPanel />
        </div>

        {/* Main Content */}
        <div className="relative flex-1">
          <Suspense fallback={
            <div className="flex h-full items-center justify-center">
              <div className="text-lg">Loading visualization...</div>
            </div>
          }>
            <IFSVisualization />
          </Suspense>
          
          {/* Timeline Panel */}
          <div className="absolute bottom-0 left-0 right-0">
            <TimelinePanel />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 border-l bg-card">
          <ControlPanel />
        </div>
      </div>
    </div>
  )
} 