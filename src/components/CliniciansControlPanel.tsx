import React, { useState } from 'react';
import { IFSModel } from '../lib/ifs-model';
import { partColors } from '../types/IFSModel';

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
    color?: string;               // Color of the relationship line
    isHealthy: boolean;           // Whether the relationship is considered healthy
  }[];
}

interface CliniciansControlPanelProps {
  model: IFSModel;
  clinicalSettings: ClinicalSettings;
  onUpdateModel: (model: IFSModel) => void;
  onUpdateSettings: (settings: ClinicalSettings) => void;
}

type TabType = 'session' | 'parts' | 'relationships' | 'annotations';

const tabSymbols = {
  session: '🌟', // Self energy
  parts: '⭕', // Parts circle
  relationships: '↔️', // Connections
  annotations: '📝', // Notes
};

const TabButton: React.FC<{
  tab: TabType;
  activeTab: TabType;
  onClick: (tab: TabType) => void;
}> = ({ tab, activeTab, onClick }) => (
  <button
    onClick={() => onClick(tab)}
    style={{
      backgroundColor: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
      border: 'none',
      padding: '6px 8px',
      color: 'white',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      flex: '1 1 0',
      minWidth: '0',
      textTransform: 'capitalize',
      fontWeight: activeTab === tab ? 'bold' : 'normal',
      outline: 'none',
      fontSize: '13px',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = activeTab === tab ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)';
    }}
  >
    <span style={{ flexShrink: 0 }}>{tabSymbols[tab]}</span>
    <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab}</span>
  </button>
);

const SessionTab: React.FC<{
  clinicalSettings: ClinicalSettings;
  onUpdateSettings: (settings: ClinicalSettings) => void;
}> = ({ clinicalSettings, onUpdateSettings }) => (
  <div className="tab-content" style={{ display: 'grid', gap: '15px' }}>
    <label>
      Session Number
      <input
        type="number"
        value={clinicalSettings.sessionNumber}
        onChange={(e) => onUpdateSettings({
          ...clinicalSettings,
          sessionNumber: parseInt(e.target.value) || 1
        })}
        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
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
        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
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
        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
      />
    </label>
    <label>
      Self Energy Level
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          style={{ flex: 1 }}
        />
        <span>{(clinicalSettings.selfEnergyLevel * 100).toFixed(0)}%</span>
      </div>
    </label>
  </div>
);

const PartsTab: React.FC<{
  model: IFSModel;
  onUpdateModel: (model: IFSModel) => void;
}> = ({ model, onUpdateModel }) => {
  const [showNewPartForm, setShowNewPartForm] = useState(false);
  const [newPart, setNewPart] = useState({
    name: '',
    type: 'manager' as const,
    emotionalLoad: 0.5,
    imageUrl: '',
    showLabels: true
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isNewPart: boolean, partId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isNewPart) {
          setNewPart({ ...newPart, imageUrl: base64String });
        } else if (partId) {
          const updatedParts = model.parts.map(p =>
            p.id === partId ? { ...p, imageUrl: base64String || '' } : p
          );
          onUpdateModel({ ...model, parts: updatedParts });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPart = () => {
    if (!newPart.name) return;

    const newPartComplete = {
      id: `part_${Date.now()}`,
      name: newPart.name,
      type: newPart.type,
      emotionalLoad: newPart.emotionalLoad,
      position: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 2
      },
      relationships: [],
      imageUrl: newPart.imageUrl || '',
      showLabels: newPart.showLabels
    };

    onUpdateModel({
      ...model,
      parts: [...model.parts, newPartComplete]
    });

    setNewPart({
      name: '',
      type: 'manager',
      emotionalLoad: 0.5,
      imageUrl: '',
      showLabels: true
    });
    setShowNewPartForm(false);
  };

  return (
    <div className="tab-content" style={{ display: 'grid', gap: '15px' }}>
      <button
        onClick={() => setShowNewPartForm(true)}
        style={{
          padding: '12px 20px',
          backgroundColor: 'rgba(74, 144, 226, 0.2)',
          border: '1px solid rgba(74, 144, 226, 0.3)',
          borderRadius: '6px',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        + Add New Part
      </button>

      {showNewPartForm && (
        <div style={{
          padding: '20px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          display: 'grid',
          gap: '15px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <input
            type="text"
            placeholder="Part Name"
            value={newPart.name}
            onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontSize: '14px'
            }}
          />
          <select
            value={newPart.type}
            onChange={(e) => setNewPart({ ...newPart, type: e.target.value as any })}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontSize: '14px'
            }}
          >
            <option value="manager">Manager</option>
            <option value="firefighter">Firefighter</option>
            <option value="exile">Exile</option>
          </select>

          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Image</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
                style={{ display: 'none' }}
                id="new-part-image"
              />
              <label
                htmlFor="new-part-image"
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                  flex: 1,
                  textAlign: 'center',
                  fontSize: '14px'
                }}
              >
                Upload Image
              </label>
              <input
                type="text"
                placeholder="or paste image URL"
                value={newPart.imageUrl}
                onChange={(e) => setNewPart({ ...newPart, imageUrl: e.target.value })}
                style={{
                  flex: 2,
                  padding: '8px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Emotional Load</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={newPart.emotionalLoad}
                onChange={(e) => setNewPart({ ...newPart, emotionalLoad: parseFloat(e.target.value) })}
                style={{ flex: 1 }}
              />
              <span>{(newPart.emotionalLoad * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="show-labels"
              checked={newPart.showLabels}
              onChange={(e) => setNewPart({ ...newPart, showLabels: e.target.checked })}
            />
            <label htmlFor="show-labels">Show Labels</label>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowNewPartForm(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddPart}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4a90e2',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Add Part
            </button>
          </div>
        </div>
      )}

      {model.parts.map((part) => (
        <div 
          key={part.id} 
          style={{ 
            padding: '20px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '6px'
          }}>
            <div style={{ position: 'relative', width: '50px', height: '50px' }}>
              {part.imageUrl ? (
                <img 
                  src={part.imageUrl} 
                  alt={part.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '6px',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '6px',
                  backgroundColor: partColors[part.type],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: 'white'
                }}>
                  {part.name[0]}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{part.name}</h4>
              <span style={{ 
                opacity: 0.7, 
                fontSize: '12px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                {part.type}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Image</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, false, part.id)}
                  style={{ display: 'none' }}
                  id={`part-image-${part.id}`}
                />
                <label
                  htmlFor={`part-image-${part.id}`}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '14px'
                  }}
                >
                  Upload Image
                </label>
                <input
                  type="text"
                  placeholder="or paste image URL"
                  value={part.imageUrl || ''}
                  onChange={(e) => {
                    const updatedParts = model.parts.map(p =>
                      p.id === part.id ? { ...p, imageUrl: e.target.value } : p
                    );
                    onUpdateModel({ ...model, parts: updatedParts });
                  }}
                  style={{
                    flex: 2,
                    padding: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id={`show-labels-${part.id}`}
                checked={part.showLabels}
                onChange={(e) => {
                  const updatedParts = model.parts.map(p =>
                    p.id === part.id ? { ...p, showLabels: e.target.checked } : p
                  );
                  onUpdateModel({ ...model, parts: updatedParts });
                }}
              />
              <label htmlFor={`show-labels-${part.id}`}>Show Labels</label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const relationshipDescriptions = {
  polarization: 'Parts that are in conflict or opposition with each other',
  alliance: 'Parts working together in harmony',
  protection: 'One part protecting or shielding another',
  burden: 'One part carrying emotional weight for another'
};

const defaultRelationshipColors = {
  polarization: '#ff4444',
  alliance: '#44ff44',
  protection: '#4444ff',
  burden: '#ffaa44'
};

const RelationshipsTab: React.FC<{
  model: IFSModel;
  clinicalSettings: ClinicalSettings;
  onUpdateSettings: (settings: ClinicalSettings) => void;
}> = ({ model, clinicalSettings, onUpdateSettings }) => {
  const handleAddRelationship = () => {
    const newRelationship = {
      sourceId: model.parts[0]?.id || '',
      targetId: model.parts[1]?.id || '',
      type: 'alliance' as const,
      strength: 0.5,
      notes: '',
      color: defaultRelationshipColors.alliance,
      isHealthy: true
    };
    onUpdateSettings({
      ...clinicalSettings,
      relationships: [...clinicalSettings.relationships, newRelationship]
    });
  };

  const handleRelationshipTypeChange = (index: number, newType: string) => {
    const updatedRelationships = [...clinicalSettings.relationships];
    updatedRelationships[index] = { 
      ...updatedRelationships[index], 
      type: newType as 'polarization' | 'alliance' | 'protection' | 'burden',
      color: defaultRelationshipColors[newType as keyof typeof defaultRelationshipColors]
    };
    onUpdateSettings({
      ...clinicalSettings,
      relationships: updatedRelationships
    });
  };

  return (
    <div className="tab-content" style={{ display: 'grid', gap: '15px' }}>
      <button
        onClick={handleAddRelationship}
        style={{
          padding: '12px 20px',
          backgroundColor: 'rgba(74, 144, 226, 0.2)',
          border: '1px solid rgba(74, 144, 226, 0.3)',
          borderRadius: '6px',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        + Add Relationship
      </button>
      {clinicalSettings.relationships.map((rel, index) => (
        <div 
          key={index}
          style={{ 
            padding: '20px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            display: 'grid',
            gap: '15px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <select
              value={rel.sourceId}
              onChange={(e) => {
                const updatedRelationships = [...clinicalSettings.relationships];
                updatedRelationships[index] = { ...rel, sourceId: e.target.value };
                onUpdateSettings({ ...clinicalSettings, relationships: updatedRelationships });
              }}
              style={{ width: '100%', padding: '8px' }}
            >
              {model.parts.map(part => (
                <option key={part.id} value={part.id}>{part.name}</option>
              ))}
            </select>
            <select
              value={rel.targetId}
              onChange={(e) => {
                const updatedRelationships = [...clinicalSettings.relationships];
                updatedRelationships[index] = { ...rel, targetId: e.target.value };
                onUpdateSettings({ ...clinicalSettings, relationships: updatedRelationships });
              }}
              style={{ width: '100%', padding: '8px' }}
            >
              {model.parts.map(part => (
                <option key={part.id} value={part.id}>{part.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={rel.type}
              onChange={(e) => handleRelationshipTypeChange(index, e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
            >
              <option value="polarization">Polarization</option>
              <option value="alliance">Alliance</option>
              <option value="protection">Protection</option>
              <option value="burden">Burden</option>
            </select>
            <p style={{ 
              fontSize: '12px', 
              opacity: 0.7, 
              margin: '4px 0',
              padding: '8px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px'
            }}>
              {relationshipDescriptions[rel.type as keyof typeof relationshipDescriptions]}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                Line Color
              </label>
              <input
                type="color"
                value={rel.color || defaultRelationshipColors[rel.type as keyof typeof defaultRelationshipColors]}
                onChange={(e) => {
                  const updatedRelationships = [...clinicalSettings.relationships];
                  updatedRelationships[index] = { ...rel, color: e.target.value };
                  onUpdateSettings({ ...clinicalSettings, relationships: updatedRelationships });
                }}
                style={{ width: '100%', height: '30px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                Relationship Health
              </label>
              <select
                value={rel.isHealthy ? 'healthy' : 'unhealthy'}
                onChange={(e) => {
                  const updatedRelationships = [...clinicalSettings.relationships];
                  updatedRelationships[index] = { ...rel, isHealthy: e.target.value === 'healthy' };
                  onUpdateSettings({ ...clinicalSettings, relationships: updatedRelationships });
                }}
                style={{ width: '100%', padding: '4px' }}
              >
                <option value="healthy">Healthy</option>
                <option value="unhealthy">Unhealthy</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
              Relationship Strength
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={rel.strength}
                onChange={(e) => {
                  const updatedRelationships = [...clinicalSettings.relationships];
                  updatedRelationships[index] = { ...rel, strength: parseFloat(e.target.value) };
                  onUpdateSettings({ ...clinicalSettings, relationships: updatedRelationships });
                }}
                style={{ flex: 1 }}
              />
              <span style={{ minWidth: '45px', textAlign: 'right' }}>
                {(rel.strength * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <textarea
            value={rel.notes}
            placeholder="Add notes about this relationship..."
            onChange={(e) => {
              const updatedRelationships = [...clinicalSettings.relationships];
              updatedRelationships[index] = { ...rel, notes: e.target.value };
              onUpdateSettings({ ...clinicalSettings, relationships: updatedRelationships });
            }}
            style={{ 
              width: '100%',
              padding: '8px',
              minHeight: '60px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </div>
      ))}
    </div>
  );
};

const AnnotationsTab: React.FC<{
  model: IFSModel;
  clinicalSettings: ClinicalSettings;
  onUpdateSettings: (settings: ClinicalSettings) => void;
}> = ({ model, clinicalSettings, onUpdateSettings }) => {
  const handleAddAnnotation = () => {
    const newAnnotation = {
      id: `annotation_${Date.now()}`,
      text: '',
      position: { x: 0, y: 0, z: 0 },
      type: 'observation' as const
    };
    onUpdateSettings({
      ...clinicalSettings,
      annotations: [...clinicalSettings.annotations, newAnnotation]
    });
  };

  return (
    <div className="tab-content" style={{ display: 'grid', gap: '15px' }}>
      <button
        onClick={handleAddAnnotation}
        style={{
          padding: '8px 16px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Add Annotation
      </button>
      {clinicalSettings.annotations.map((annotation, index) => (
        <div 
          key={annotation.id}
          style={{ 
            padding: '15px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            display: 'grid',
            gap: '10px'
          }}
        >
          <select
            value={annotation.type}
            onChange={(e) => {
              const updatedAnnotations = [...clinicalSettings.annotations];
              updatedAnnotations[index] = { ...annotation, type: e.target.value as any };
              onUpdateSettings({ ...clinicalSettings, annotations: updatedAnnotations });
            }}
            style={{ width: '100%', padding: '8px' }}
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
            style={{ 
              width: '100%',
              padding: '8px',
              minHeight: '80px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white'
            }}
            placeholder="Enter annotation text..."
          />
          <select
            value={annotation.attachedTo || ''}
            onChange={(e) => {
              const updatedAnnotations = [...clinicalSettings.annotations];
              updatedAnnotations[index] = { ...annotation, attachedTo: e.target.value || undefined };
              onUpdateSettings({ ...clinicalSettings, annotations: updatedAnnotations });
            }}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Floating</option>
            {model.parts.map(part => (
              <option key={part.id} value={part.id}>{part.name}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

const CliniciansControlPanel: React.FC<CliniciansControlPanelProps> = ({
  model,
  clinicalSettings,
  onUpdateModel,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('session');
  const [isExpanded, setIsExpanded] = useState(true);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'session':
        return <SessionTab clinicalSettings={clinicalSettings} onUpdateSettings={onUpdateSettings} />;
      case 'parts':
        return <PartsTab model={model} onUpdateModel={onUpdateModel} />;
      case 'relationships':
        return <RelationshipsTab model={model} clinicalSettings={clinicalSettings} onUpdateSettings={onUpdateSettings} />;
      case 'annotations':
        return <AnnotationsTab model={model} clinicalSettings={clinicalSettings} onUpdateSettings={onUpdateSettings} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Main panel */}
      <div 
        className="clinicians-control-panel"
        style={{
          position: 'fixed',
          top: '0',
          left: isExpanded ? '0' : '-450px',
          width: '420px',
          backgroundColor: 'rgba(20, 20, 30, 0.95)',
          borderRadius: '0',
          padding: '0',
          color: 'white',
          transition: 'all 0.3s ease',
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 1000,
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitOverflowScrolling: 'touch',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.3) rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ 
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(20, 20, 30, 0.98)',
          padding: '16px 20px',
          zIndex: 2,
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <h2 style={{ 
              fontSize: '1.25rem',
              fontWeight: 'bold',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>🎯</span>
              Clinical Controls
            </h2>
          </div>

          <div style={{ 
            display: 'flex',
            gap: '6px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: '4px',
            borderRadius: '6px',
            minWidth: '0',
          }}>
            {(['session', 'parts', 'relationships', 'annotations'] as const).map((tab) => (
              <TabButton
                key={tab}
                tab={tab}
                activeTab={activeTab}
                onClick={setActiveTab}
              />
            ))}
          </div>
        </div>

        <div style={{
          padding: '20px',
          position: 'relative',
          zIndex: 1
        }}>
          {renderTabContent()}
        </div>
      </div>

      {/* Update collapse/expand button position */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'fixed',
          left: isExpanded ? '420px' : '0',
          top: '16px',
          backgroundColor: 'rgba(20, 20, 30, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0 4px 4px 0',
          padding: '10px 14px',
          color: 'white',
          cursor: 'pointer',
          zIndex: 1001,
          boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
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
            <span>←</span>
            <span style={{ display: 'none' }}>Show Panel</span>
          </>
        ) : (
          <>
            <span>→</span>
            <span>Clinical Panel</span>
          </>
        )}
      </button>
    </>
  );
};

export default CliniciansControlPanel; 