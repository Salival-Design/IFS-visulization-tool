import React, { useState } from 'react';
import { IFSModel } from '../lib/ifs-model';

export interface ClinicalSettings {
  // Session Information
  sessionNumber: number;
  sessionDate: string;
  clientName: string;
  
  // Clinical Notes
  therapeuticGoals: string[];
  sessionNotes: string;
  
  // IFS-Specific Settings
  selfEnergyLevel: number;         // 0-1: Presence of Self energy
  unblending: number;              // 0-1: Degree of unblending achieved
  systemHarmony: number;           // 0-1: Overall system harmony
  
  // Annotations
  annotations: {
    id: string;
    text: string;
    position: { x: number; y: number; z: number };
    attachedTo?: string;          // Part ID if attached to a specific part
    type: 'insight' | 'observation' | 'intervention' | 'homework';
  }[];
  
  // Relationship Lines
  relationships: {
    sourceId: string;
    targetId: string;
    type: 'polarization' | 'alliance' | 'protection' | 'burden';
    strength: number;              // 0-1: Strength of relationship
    notes: string;
  }[];
}

interface ClinicalPanelProps {
  model: IFSModel;
  clinicalSettings: ClinicalSettings;
  onUpdateModel: (model: IFSModel) => void;
  onUpdateSettings: (settings: ClinicalSettings) => void;
}

const ClinicalPanel: React.FC<ClinicalPanelProps> = ({
  model,
  clinicalSettings,
  onUpdateModel,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'session' | 'parts' | 'relationships' | 'annotations'>('session');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddAnnotation = () => {
    const newAnnotation = {
      id: `annotation_${Date.now()}`,
      text: 'New annotation',
      position: { x: 0, y: 0, z: 0 },
      type: 'observation' as const
    };
    onUpdateSettings({
      ...clinicalSettings,
      annotations: [...clinicalSettings.annotations, newAnnotation]
    });
  };

  const handleAddRelationship = () => {
    const newRelationship = {
      sourceId: model.parts[0]?.id || '',
      targetId: model.parts[1]?.id || '',
      type: 'alliance' as const,
      strength: 0.5,
      notes: ''
    };
    onUpdateSettings({
      ...clinicalSettings,
      relationships: [...clinicalSettings.relationships, newRelationship]
    });
  };

  return (
    <div className="clinical-panel" style={{
      position: 'fixed',
      top: '20px',
      left: isExpanded ? '20px' : '-380px',
      width: '400px',
      backgroundColor: 'rgba(20, 20, 30, 0.95)',
      borderRadius: '8px',
      padding: '20px',
      color: 'white',
      transition: 'left 0.3s ease',
      maxHeight: '90vh',
      overflowY: 'auto',
      zIndex: 1000,
    }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'absolute',
          right: '-40px',
          top: '10px',
          backgroundColor: 'rgba(20, 20, 30, 0.95)',
          border: 'none',
          borderRadius: '0 4px 4px 0',
          padding: '10px',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        {isExpanded ? '←' : '→'}
      </button>

      <h2 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
        Clinical Controls
      </h2>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
        {(['session', 'parts', 'relationships', 'annotations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              backgroundColor: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none',
              padding: '8px 12px',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Session Information */}
      {activeTab === 'session' && (
        <section>
          <h3>Session Information</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <label>
              Session Number
              <input
                type="number"
                value={clinicalSettings.sessionNumber}
                onChange={(e) => onUpdateSettings({
                  ...clinicalSettings,
                  sessionNumber: parseInt(e.target.value)
                })}
              />
            </label>
            <label>
              Session Date
              <input
                type="date"
                value={clinicalSettings.sessionDate}
                onChange={(e) => onUpdateSettings({
                  ...clinicalSettings,
                  sessionDate: e.target.value
                })}
              />
            </label>
            <label>
              Client Name
              <input
                type="text"
                value={clinicalSettings.clientName}
                onChange={(e) => onUpdateSettings({
                  ...clinicalSettings,
                  clientName: e.target.value
                })}
              />
            </label>
            <label>
              Self Energy Level
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={clinicalSettings.selfEnergyLevel}
                onChange={(e) => onUpdateSettings({
                  ...clinicalSettings,
                  selfEnergyLevel: parseFloat(e.target.value)
                })}
              />
            </label>
            <label>
              Unblending Progress
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={clinicalSettings.unblending}
                onChange={(e) => onUpdateSettings({
                  ...clinicalSettings,
                  unblending: parseFloat(e.target.value)
                })}
              />
            </label>
          </div>
        </section>
      )}

      {/* Parts Management */}
      {activeTab === 'parts' && (
        <section>
          <h3>Parts Management</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {model.parts.map((part) => (
              <div key={part.id} style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                <h4>{part.name}</h4>
                <label>
                  Emotional Load
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
                  />
                </label>
                <textarea
                  placeholder="Clinical notes about this part..."
                  style={{ width: '100%', marginTop: '10px' }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Relationships */}
      {activeTab === 'relationships' && (
        <section>
          <h3>Relationships</h3>
          <button onClick={handleAddRelationship}>Add Relationship</button>
          <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
            {clinicalSettings.relationships.map((rel, index) => (
              <div key={index} style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                <select
                  value={rel.sourceId}
                  onChange={(e) => {
                    const updatedRelationships = [...clinicalSettings.relationships];
                    updatedRelationships[index] = { ...rel, sourceId: e.target.value };
                    onUpdateSettings({ ...clinicalSettings, relationships: updatedRelationships });
                  }}
                >
                  {model.parts.map(part => (
                    <option key={part.id} value={part.id}>{part.name}</option>
                  ))}
                </select>
                <select
                  value={rel.type}
                  onChange={(e) => {
                    const updatedRelationships = [...clinicalSettings.relationships];
                    updatedRelationships[index] = { ...rel, type: e.target.value as any };
                    onUpdateSettings({ ...clinicalSettings, relationships: updatedRelationships });
                  }}
                >
                  <option value="polarization">Polarization</option>
                  <option value="alliance">Alliance</option>
                  <option value="protection">Protection</option>
                  <option value="burden">Burden</option>
                </select>
                <select
                  value={rel.targetId}
                  onChange={(e) => {
                    const updatedRelationships = [...clinicalSettings.relationships];
                    updatedRelationships[index] = { ...rel, targetId: e.target.value };
                    onUpdateSettings({ ...clinicalSettings, relationships: updatedRelationships });
                  }}
                >
                  {model.parts.map(part => (
                    <option key={part.id} value={part.id}>{part.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Annotations */}
      {activeTab === 'annotations' && (
        <section>
          <h3>Annotations</h3>
          <button onClick={handleAddAnnotation}>Add Annotation</button>
          <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
            {clinicalSettings.annotations.map((annotation, index) => (
              <div key={annotation.id} style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                <select
                  value={annotation.type}
                  onChange={(e) => {
                    const updatedAnnotations = [...clinicalSettings.annotations];
                    updatedAnnotations[index] = { ...annotation, type: e.target.value as any };
                    onUpdateSettings({ ...clinicalSettings, annotations: updatedAnnotations });
                  }}
                >
                  <option value="insight">Insight</option>
                  <option value="observation">Observation</option>
                  <option value="intervention">Intervention</option>
                  <option value="homework">Homework</option>
                </select>
                <textarea
                  value={annotation.text}
                  onChange={(e) => {
                    const updatedAnnotations = [...clinicalSettings.annotations];
                    updatedAnnotations[index] = { ...annotation, text: e.target.value };
                    onUpdateSettings({ ...clinicalSettings, annotations: updatedAnnotations });
                  }}
                  style={{ width: '100%', marginTop: '10px' }}
                />
                <select
                  value={annotation.attachedTo || ''}
                  onChange={(e) => {
                    const updatedAnnotations = [...clinicalSettings.annotations];
                    updatedAnnotations[index] = { ...annotation, attachedTo: e.target.value || undefined };
                    onUpdateSettings({ ...clinicalSettings, annotations: updatedAnnotations });
                  }}
                >
                  <option value="">Floating</option>
                  {model.parts.map(part => (
                    <option key={part.id} value={part.id}>{part.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClinicalPanel; 