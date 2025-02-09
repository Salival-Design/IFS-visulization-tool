import React, { useState } from 'react';
import { IFSModel, Part } from '../lib/ifs-model';

interface ControlPanelProps {
  model: IFSModel;
  onUpdateModel: (model: IFSModel) => void;
  visualSettings: VisualizationSettings;
  onUpdateSettings: (settings: VisualizationSettings) => void;
}

export interface VisualizationSettings {
  cameraDistance: number;
  rotationSpeed: number;
  particleDensity: number;
  selfSize: number;
  partSize: number;
  backgroundColor: string;
  showLabels: boolean;
  showSparkles: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  model,
  onUpdateModel,
  visualSettings,
  onUpdateSettings,
}) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handlePartUpdate = (partId: string, updates: Partial<Part>) => {
    const updatedModel = {
      ...model,
      parts: model.parts.map(part => 
        part.id === partId ? { ...part, ...updates } : part
      )
    };
    onUpdateModel(updatedModel);
  };

  const handleSettingChange = (key: keyof VisualizationSettings, value: any) => {
    onUpdateSettings({ ...visualSettings, [key]: value });
  };

  return (
    <div className="control-panel" style={{
      position: 'fixed',
      top: '20px',
      right: isExpanded ? '20px' : '-380px',
      width: '400px',
      backgroundColor: 'rgba(20, 20, 30, 0.95)',
      borderRadius: '8px',
      padding: '20px',
      color: 'white',
      transition: 'right 0.3s ease',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
    }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'absolute',
          left: '-40px',
          top: '10px',
          backgroundColor: 'rgba(20, 20, 30, 0.95)',
          border: 'none',
          borderRadius: '4px 0 0 4px',
          padding: '10px',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        {isExpanded ? '→' : '←'}
      </button>

      <h2 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
        IFS Control Panel
      </h2>

      {/* Visual Settings */}
      <section style={{ marginBottom: '20px' }}>
        <h3>Visual Settings</h3>
        <div className="settings-grid" style={{ display: 'grid', gap: '10px' }}>
          <label>
            Camera Distance
            <input
              type="range"
              min="4"
              max="20"
              step="0.5"
              value={visualSettings.cameraDistance}
              onChange={(e) => handleSettingChange('cameraDistance', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Rotation Speed
            <input
              type="range"
              min="0"
              max="0.01"
              step="0.001"
              value={visualSettings.rotationSpeed}
              onChange={(e) => handleSettingChange('rotationSpeed', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Particle Density
            <input
              type="range"
              min="500"
              max="2000"
              step="100"
              value={visualSettings.particleDensity}
              onChange={(e) => handleSettingChange('particleDensity', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Self Size
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={visualSettings.selfSize}
              onChange={(e) => handleSettingChange('selfSize', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Part Size
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={visualSettings.partSize}
              onChange={(e) => handleSettingChange('partSize', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Background Color
            <input
              type="color"
              value={visualSettings.backgroundColor}
              onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Show Labels
            <input
              type="checkbox"
              checked={visualSettings.showLabels}
              onChange={(e) => handleSettingChange('showLabels', e.target.checked)}
            />
          </label>
          <label>
            Show Sparkles
            <input
              type="checkbox"
              checked={visualSettings.showSparkles}
              onChange={(e) => handleSettingChange('showSparkles', e.target.checked)}
            />
          </label>
        </div>
      </section>

      {/* Parts Management */}
      <section>
        <h3>Parts Management</h3>
        <div className="parts-list" style={{ display: 'grid', gap: '10px' }}>
          {model.parts.map((part) => (
            <div
              key={part.id}
              style={{
                padding: '10px',
                backgroundColor: selectedPart === part.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedPart(part.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{part.name}</strong>
                <span style={{ opacity: 0.7 }}>{part.type}</span>
              </div>
              {selectedPart === part.id && (
                <div style={{ marginTop: '10px' }}>
                  <label>
                    Emotional Load
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={part.emotionalLoad}
                      onChange={(e) => handlePartUpdate(part.id, { emotionalLoad: parseFloat(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', marginTop: '5px' }}>
                    <label>
                      X
                      <input
                        type="number"
                        value={part.position.x}
                        onChange={(e) => handlePartUpdate(part.id, { position: { ...part.position, x: parseFloat(e.target.value) } })}
                        style={{ width: '100%' }}
                      />
                    </label>
                    <label>
                      Y
                      <input
                        type="number"
                        value={part.position.y}
                        onChange={(e) => handlePartUpdate(part.id, { position: { ...part.position, y: parseFloat(e.target.value) } })}
                        style={{ width: '100%' }}
                      />
                    </label>
                    <label>
                      Z
                      <input
                        type="number"
                        value={part.position.z}
                        onChange={(e) => handlePartUpdate(part.id, { position: { ...part.position, z: parseFloat(e.target.value) } })}
                        style={{ width: '100%' }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ControlPanel; 