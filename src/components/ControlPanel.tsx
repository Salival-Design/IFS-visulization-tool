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

  const handleSettingChange = (key: keyof VisualizationSettings, value: any) => {
    onUpdateSettings({ ...visualSettings, [key]: value });
  };

  return (
    <>
      {/* Collapse/Expand button - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'fixed',
          right: isExpanded ? '400px' : '0',
          top: '20px',
          backgroundColor: 'rgba(20, 20, 30, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: isExpanded ? '4px 0 0 4px' : '4px 0 0 4px',
          padding: '10px 15px',
          color: 'white',
          cursor: 'pointer',
          zIndex: 1001,
          boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(30, 30, 40, 0.95)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(20, 20, 30, 0.95)';
        }}
      >
        {isExpanded ? (
          <>
            <span>→</span>
            <span style={{ display: 'none' }}>Show Panel</span>
          </>
        ) : (
          <>
            <span>←</span>
            <span>Visual Controls</span>
          </>
        )}
      </button>

      {/* Main panel */}
      <div className="control-panel" style={{
        position: 'fixed',
        top: '20px',
        right: isExpanded ? '0' : '-400px',
        width: '400px',
        backgroundColor: 'rgba(20, 20, 30, 0.95)',
        borderRadius: '12px',
        padding: '20px',
        color: 'white',
        transition: 'all 0.3s ease',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitOverflowScrolling: 'touch',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        margin: '0 20px 0 0',
        zIndex: 1000,
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '10px',
        }}>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>🎨</span>
            Visual Controls
          </h2>
        </div>

        {/* Visual Settings */}
        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            marginBottom: '15px', 
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎥</span>
            Visual Settings
          </h3>
          <div className="settings-grid" style={{ display: 'grid', gap: '15px' }}>
            {/* Camera Distance */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Camera Distance
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="0.5"
                  value={visualSettings.cameraDistance}
                  onChange={(e) => handleSettingChange('cameraDistance', parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '45px', textAlign: 'right' }}>
                  {visualSettings.cameraDistance.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Part Size */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Part Size
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={visualSettings.partSize}
                  onChange={(e) => handleSettingChange('partSize', parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '45px', textAlign: 'right' }}>
                  {visualSettings.partSize.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Self Size */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Self Size
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={visualSettings.selfSize}
                  onChange={(e) => handleSettingChange('selfSize', parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '45px', textAlign: 'right' }}>
                  {visualSettings.selfSize.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Background Color
              </label>
              <input
                type="color"
                value={visualSettings.backgroundColor}
                onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                style={{ width: '100%', height: '30px' }}
              />
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={visualSettings.showLabels}
                  onChange={(e) => handleSettingChange('showLabels', e.target.checked)}
                />
                <span>🏷️ Show Labels</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={visualSettings.showSparkles}
                  onChange={(e) => handleSettingChange('showSparkles', e.target.checked)}
                />
                <span>✨ Show Sparkles</span>
              </label>
            </div>
          </div>
        </section>

        {/* Parts Management */}
        <section>
          <h3 style={{ 
            marginBottom: '15px', 
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⭕</span>
            Parts Management
          </h3>
          <div className="parts-list" style={{ display: 'grid', gap: '10px' }}>
            {model.parts.map((part) => (
              <div
                key={part.id}
                style={{
                  padding: '15px',
                  backgroundColor: selectedPart === part.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onClick={() => setSelectedPart(part.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong>{part.name}</strong>
                  <span style={{ 
                    opacity: 0.7,
                    fontSize: '12px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>{part.type}</span>
                </div>
                {selectedPart === part.id && (
                  <div style={{ marginTop: '10px', display: 'grid', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                        Emotional Load
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={part.emotionalLoad}
                          onChange={(e) => {
                            const updatedParts = model.parts.map(p =>
                              p.id === part.id ? { ...p, emotionalLoad: parseFloat(e.target.value) } : p
                            );
                            onUpdateModel({ ...model, parts: updatedParts });
                          }}
                          style={{ flex: 1 }}
                        />
                        <span style={{ minWidth: '45px', textAlign: 'right' }}>
                          {(part.emotionalLoad * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
                      <label>
                        X
                        <input
                          type="number"
                          value={part.position.x}
                          onChange={(e) => {
                            const updatedParts = model.parts.map(p =>
                              p.id === part.id ? { ...p, position: { ...p.position, x: parseFloat(e.target.value) } } : p
                            );
                            onUpdateModel({ ...model, parts: updatedParts });
                          }}
                          style={{ width: '100%', padding: '4px' }}
                        />
                      </label>
                      <label>
                        Y
                        <input
                          type="number"
                          value={part.position.y}
                          onChange={(e) => {
                            const updatedParts = model.parts.map(p =>
                              p.id === part.id ? { ...p, position: { ...p.position, y: parseFloat(e.target.value) } } : p
                            );
                            onUpdateModel({ ...model, parts: updatedParts });
                          }}
                          style={{ width: '100%', padding: '4px' }}
                        />
                      </label>
                      <label>
                        Z
                        <input
                          type="number"
                          value={part.position.z}
                          onChange={(e) => {
                            const updatedParts = model.parts.map(p =>
                              p.id === part.id ? { ...p, position: { ...p.position, z: parseFloat(e.target.value) } } : p
                            );
                            onUpdateModel({ ...model, parts: updatedParts });
                          }}
                          style={{ width: '100%', padding: '4px' }}
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
    </>
  );
};

export default ControlPanel; 