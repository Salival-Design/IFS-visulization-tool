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

interface CliniciansControlPanelProps {
  model: IFSModel;
  clinicalSettings: ClinicalSettings;
  onUpdateModel: (model: IFSModel) => void;
  onUpdateSettings: (settings: ClinicalSettings) => void;
}

type TabType = 'session' | 'parts' | 'relationships' | 'annotations';

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
      padding: '8px 12px',
      color: 'white',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      flex: 1,
      textTransform: 'capitalize',
      fontWeight: activeTab === tab ? 'bold' : 'normal',
      outline: 'none',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = activeTab === tab ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)';
    }}
  >
    {tab}
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
    imageUrl: ''
  });

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
      imageUrl: newPart.imageUrl || undefined
    };

    onUpdateModel({
      ...model,
      parts: [...model.parts, newPartComplete]
    });

    setNewPart({
      name: '',
      type: 'manager',
      emotionalLoad: 0.5,
      imageUrl: ''
    });
    setShowNewPartForm(false);
  };

  return (
    <div className="tab-content" style={{ display: 'grid', gap: '15px' }}>
      <button
        onClick={() => setShowNewPartForm(true)}
        style={{
          padding: '8px 16px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
      >
        Add New Part
      </button>

      {showNewPartForm && (
        <div style={{
          padding: '15px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          display: 'grid',
          gap: '10px'
        }}>
          <input
            type="text"
            placeholder="Part Name"
            value={newPart.name}
            onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white'
            }}
          />
          <select
            value={newPart.type}
            onChange={(e) => setNewPart({ ...newPart, type: e.target.value as any })}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white'
            }}
          >
            <option value="manager">Manager</option>
            <option value="firefighter">Firefighter</option>
            <option value="exile">Exile</option>
          </select>
          <div>
            <label>Emotional Load</label>
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
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={newPart.imageUrl}
            onChange={(e) => setNewPart({ ...newPart, imageUrl: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white'
            }}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowNewPartForm(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer'
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
                cursor: 'pointer'
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
            padding: '15px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            {part.imageUrl && (
              <img 
                src={part.imageUrl} 
                alt={part.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '4px',
                  objectFit: 'cover'
                }}
              />
            )}
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>{part.name}</h4>
              <span style={{ opacity: 0.7, fontSize: '0.9em' }}>{part.type}</span>
            </div>
          </div>
          <label>
            Emotional Load
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
              <span>{(part.emotionalLoad * 100).toFixed(0)}%</span>
            </div>
          </label>
          <input
            type="text"
            placeholder="Image URL"
            value={part.imageUrl || ''}
            onChange={(e) => {
              const updatedParts = model.parts.map(p =>
                p.id === part.id ? { ...p, imageUrl: e.target.value } : p
              );
              onUpdateModel({ ...model, parts: updatedParts });
            }}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '10px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white'
            }}
          />
        </div>
      ))}
    </div>
  );
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
      notes: ''
    };
    onUpdateSettings({
      ...clinicalSettings,
      relationships: [...clinicalSettings.relationships, newRelationship]
    });
  };

  return (
    <div className="tab-content" style={{ display: 'grid', gap: '15px' }}>
      <button
        onClick={handleAddRelationship}
        style={{
          padding: '8px 16px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Add Relationship
      </button>
      {clinicalSettings.relationships.map((rel, index) => (
        <div 
          key={index}
          style={{ 
            padding: '15px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            display: 'grid',
            gap: '10px'
          }}
        >
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
            value={rel.type}
            onChange={(e) => {
              const updatedRelationships = [...clinicalSettings.relationships];
              updatedRelationships[index] = { ...rel, type: e.target.value as any };
              onUpdateSettings({ ...clinicalSettings, relationships: updatedRelationships });
            }}
            style={{ width: '100%', padding: '8px' }}
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
            style={{ width: '100%', padding: '8px' }}
          >
            {model.parts.map(part => (
              <option key={part.id} value={part.id}>{part.name}</option>
            ))}
          </select>
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
    <div 
      className="clinicians-control-panel"
      style={{
        position: 'fixed',
        top: '20px',
        left: isExpanded ? '20px' : '-420px',
        width: '400px',
        backgroundColor: 'rgba(20, 20, 30, 0.95)',
        borderRadius: '8px',
        padding: '20px',
        paddingRight: '25px',
        color: 'white',
        transition: 'all 0.3s ease',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitOverflowScrolling: 'touch',
      }}
    >
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
          zIndex: 1001,
          boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(30, 30, 40, 0.95)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(20, 20, 30, 0.95)';
        }}
      >
        {isExpanded ? '←' : '→'}
      </button>

      <h2 style={{ 
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '10px',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        Clinical Controls
      </h2>

      <div style={{ 
        display: 'flex',
        marginBottom: '20px',
        gap: '10px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: '5px',
        borderRadius: '6px',
        position: 'sticky',
        top: 0,
        zIndex: 2,
        backdropFilter: 'blur(5px)'
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

      <div style={{
        position: 'relative',
        zIndex: 1,
        paddingBottom: '20px'
      }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CliniciansControlPanel; 