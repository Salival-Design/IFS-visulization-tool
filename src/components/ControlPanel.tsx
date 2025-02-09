import React, { useState } from 'react';
import { IFSModel, Part } from '../lib/ifs-model';

export interface VisualizationSettings {
  selfSize: number;
  partSize: number;
  rotationSpeed: number;
  particleDensity: number;
  showSparkles: boolean;
  showLabels: boolean;
  backgroundColor: string;
}

interface ControlPanelProps {
  settings: VisualizationSettings;
  onUpdateSettings: (settings: VisualizationSettings) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSettingChange = (key: keyof VisualizationSettings, value: any) => {
    onUpdateSettings({
      ...settings,
      [key]: value
    });
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
                  value={settings.selfSize}
                  onChange={(e) => handleSettingChange('selfSize', parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '45px', textAlign: 'right' }}>
                  {settings.selfSize.toFixed(1)}
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
                  min="0.2"
                  max="1"
                  step="0.1"
                  value={settings.partSize}
                  onChange={(e) => handleSettingChange('partSize', parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '45px', textAlign: 'right' }}>
                  {settings.partSize.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Rotation Speed */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Rotation Speed
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="0"
                  max="0.05"
                  step="0.001"
                  value={settings.rotationSpeed}
                  onChange={(e) => handleSettingChange('rotationSpeed', parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '45px', textAlign: 'right' }}>
                  {settings.rotationSpeed.toFixed(3)}
                </span>
              </div>
            </div>

            {/* Particle Density */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Particle Density
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={settings.particleDensity}
                  onChange={(e) => handleSettingChange('particleDensity', parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '45px', textAlign: 'right' }}>
                  {settings.particleDensity.toLocaleString()}
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
                value={settings.backgroundColor}
                onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                style={{ width: '100%', height: '30px' }}
              />
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.showLabels}
                  onChange={(e) => handleSettingChange('showLabels', e.target.checked)}
                />
                <span>🏷️ Show Labels</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.showSparkles}
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
            {/* Parts management content */}
          </div>
        </section>
      </div>
    </>
  );
};

export default ControlPanel; 