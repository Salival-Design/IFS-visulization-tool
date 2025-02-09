'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { IFSModel, SessionSnapshot, SessionTimeline, TimelineControls } from '@/types/IFSModel';
import { ClinicalSettings } from './ClinicalPanel';
import { saveSession, loadSession, getSessions, deleteSession, exportSession, importSession } from '../../utils/sessionStorage';

interface TimelinePanelProps {
  model: IFSModel;
  clinicalSettings: ClinicalSettings;
  onUpdateModel: (model: IFSModel) => void;
  onUpdateSettings: (settings: ClinicalSettings) => void;
}

const TimelinePanel: React.FC<TimelinePanelProps> = ({
  model,
  clinicalSettings,
  onUpdateModel,
  onUpdateSettings,
}) => {
  const [timeline, setTimeline] = useState<SessionTimeline>({
    sessionId: `session_${Date.now()}`,
    snapshots: [],
    currentSnapshotIndex: -1,
  });

  const [controls, setControls] = useState<TimelineControls>({
    isPlaying: false,
    playbackSpeed: 1000,
    loop: false,
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  const [availableSessions, setAvailableSessions] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessions = getSessions();
      setAvailableSessions(sessions);

      if (sessions.length > 0) {
        const lastSession = loadSession(sessions[sessions.length - 1]);
        if (lastSession) {
          setTimeline(lastSession);
          if (lastSession.snapshots.length > 0 && lastSession.currentSnapshotIndex >= 0) {
            const snapshot = lastSession.snapshots[lastSession.currentSnapshotIndex];
            onUpdateModel(snapshot.model);
            onUpdateSettings(snapshot.clinicalSettings);
          }
        }
      }
    }
  }, [onUpdateModel, onUpdateSettings]);

  const createSnapshot = useCallback(() => {
    const snapshot: SessionSnapshot = {
      id: `snapshot_${Date.now()}`,
      timestamp: Date.now(),
      model: JSON.parse(JSON.stringify(model)),
      clinicalSettings: JSON.parse(JSON.stringify(clinicalSettings)),
    };

    const updatedTimeline = {
      ...timeline,
      snapshots: [...timeline.snapshots, snapshot],
      currentSnapshotIndex: timeline.snapshots.length,
    };

    setTimeline(updatedTimeline);
    saveSession(updatedTimeline);
  }, [model, clinicalSettings, timeline]);

  const handleSessionSelect = useCallback((sessionId: string) => {
    const selectedSession = loadSession(sessionId);
    if (selectedSession) {
      setTimeline(selectedSession);
      if (selectedSession.snapshots.length > 0 && selectedSession.currentSnapshotIndex >= 0) {
        const snapshot = selectedSession.snapshots[selectedSession.currentSnapshotIndex];
        onUpdateModel(snapshot.model);
        onUpdateSettings(snapshot.clinicalSettings);
      }
    }
  }, [onUpdateModel, onUpdateSettings]);

  const handleDeleteSession = useCallback((sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(sessionId);
      setAvailableSessions(prev => prev.filter(id => id !== sessionId));
      
      // If we deleted the current session, load the last available one
      if (sessionId === timeline.sessionId) {
        const remainingSessions = getSessions();
        if (remainingSessions.length > 0) {
          handleSessionSelect(remainingSessions[remainingSessions.length - 1]);
        } else {
          // Create a new session if no others exist
          setTimeline({
            sessionId: `session_${Date.now()}`,
            snapshots: [],
            currentSnapshotIndex: -1,
          });
        }
      }
    }
  }, [timeline.sessionId, handleSessionSelect]);

  const handleExportSession = useCallback(() => {
    try {
      const exportData = exportSession(timeline.sessionId);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ifs_session_${timeline.sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting session:', error);
      alert('Failed to export session');
    }
  }, [timeline.sessionId]);

  const handleImportSession = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          importSession(data);
          const sessions = getSessions();
          setAvailableSessions(sessions);
          handleSessionSelect(sessions[sessions.length - 1]);
        } catch (error) {
          console.error('Error importing session:', error);
          alert('Failed to import session');
        }
      };
      reader.readAsText(file);
    }
  }, [handleSessionSelect]);

  const playSnapshot = useCallback((index: number) => {
    if (index >= 0 && index < timeline.snapshots.length) {
      const snapshot = timeline.snapshots[index];
      const updatedTimeline = { ...timeline, currentSnapshotIndex: index };
      setTimeline(updatedTimeline);
      saveSession(updatedTimeline);
      onUpdateModel(snapshot.model);
      onUpdateSettings(snapshot.clinicalSettings);
    }
  }, [timeline, onUpdateModel, onUpdateSettings]);

  const handlePlaybackTick = useCallback(() => {
    setTimeline(prev => {
      const nextIndex = prev.currentSnapshotIndex + 1;
      if (nextIndex < prev.snapshots.length) {
        const snapshot = prev.snapshots[nextIndex];
        const updatedTimeline = { ...prev, currentSnapshotIndex: nextIndex };
        saveSession(updatedTimeline);
        setTimeout(() => {
          onUpdateModel(snapshot.model);
          onUpdateSettings(snapshot.clinicalSettings);
        }, 0);
        return updatedTimeline;
      } else if (controls.loop) {
        const snapshot = prev.snapshots[0];
        const updatedTimeline = { ...prev, currentSnapshotIndex: 0 };
        saveSession(updatedTimeline);
        setTimeout(() => {
          onUpdateModel(snapshot.model);
          onUpdateSettings(snapshot.clinicalSettings);
        }, 0);
        return updatedTimeline;
      } else {
        setControls(prevControls => ({ ...prevControls, isPlaying: false }));
        return prev;
      }
    });
  }, [controls.loop, onUpdateModel, onUpdateSettings]);

  useEffect(() => {
    let playbackInterval: NodeJS.Timeout | null = null;

    if (controls.isPlaying) {
      playbackInterval = setInterval(handlePlaybackTick, controls.playbackSpeed);
    }

    return () => {
      if (playbackInterval) clearInterval(playbackInterval);
    };
  }, [controls.isPlaying, controls.playbackSpeed, handlePlaybackTick]);

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: isMinimized ? '-200px' : '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(20, 20, 30, 0.95)',
        padding: '15px',
        borderRadius: '8px',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        width: isExpanded ? '90%' : '80%',
        maxWidth: isExpanded ? '1200px' : '800px',
        maxHeight: isExpanded ? 'calc(70vh - 40px)' : 'auto',
        transition: 'all 0.3s ease',
        overflow: isExpanded ? 'auto' : 'hidden',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '15px',
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(20, 20, 30, 0.98)',
          zIndex: 2,
          padding: '5px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Session Timeline</h3>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSessionMenu(!showSessionMenu)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Sessions ▾
              </button>
              {showSessionMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'rgba(30, 30, 40, 0.95)',
                  borderRadius: '4px',
                  padding: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  zIndex: 3,
                  minWidth: '200px',
                }}>
                  {availableSessions.map(sessionId => (
                    <div
                      key={sessionId}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        backgroundColor: sessionId === timeline.sessionId ? 'rgba(74, 144, 226, 0.3)' : 'transparent',
                      }}
                    >
                      <span
                        onClick={() => handleSessionSelect(sessionId)}
                        style={{ flex: 1 }}
                      >
                        {new Date(parseInt(sessionId.split('_')[1])).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleDeleteSession(sessionId)}
                        style={{
                          backgroundColor: 'rgba(255, 50, 50, 0.2)',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          color: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '8px', paddingTop: '8px' }}>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportSession}
                      style={{ display: 'none' }}
                      id="import-session"
                    />
                    <label
                      htmlFor="import-session"
                      style={{
                        display: 'block',
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      Import Session
                    </label>
                    <button
                      onClick={handleExportSession}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      Export Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={createSnapshot}
              style={{
                backgroundColor: '#4a90e2',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Take Snapshot
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                padding: '8px',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px'
              }}
            >
              {isExpanded ? '↓' : '↑'}
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                padding: '8px',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px'
              }}
            >
              {isMinimized ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
              <button
                onClick={() => setControls(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                {controls.isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              <input
                type="range"
                min="0"
                max={Math.max(0, timeline.snapshots.length - 1)}
                value={timeline.currentSnapshotIndex}
                onChange={(e) => playSnapshot(parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    checked={controls.loop}
                    onChange={(e) => setControls(prev => ({ ...prev, loop: e.target.checked }))}
                  />
                  Loop
                </label>
                <select
                  value={controls.playbackSpeed}
                  onChange={(e) => setControls(prev => ({ ...prev, playbackSpeed: parseInt(e.target.value) }))}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: 'white',
                  }}
                >
                  <option value="500">0.5s</option>
                  <option value="1000">1.0s</option>
                  <option value="2000">2.0s</option>
                  <option value="3000">3.0s</option>
                </select>
              </div>
            </div>

            <div style={{
              display: isExpanded ? 'grid' : 'flex',
              gap: '10px',
              overflowX: isExpanded ? 'hidden' : 'auto',
              overflowY: isExpanded ? 'auto' : 'hidden',
              padding: '10px 0',
              gridTemplateColumns: isExpanded ? 'repeat(auto-fill, minmax(250px, 1fr))' : 'none',
              maxHeight: isExpanded ? 'calc(70vh - 150px)' : 'auto',
            }}>
              {timeline.snapshots.map((snapshot, index) => (
                <div
                  key={snapshot.id}
                  onClick={() => playSnapshot(index)}
                  style={{
                    backgroundColor: index === timeline.currentSnapshotIndex ? 'rgba(74, 144, 226, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    minWidth: isExpanded ? '0' : '150px',
                    border: index === timeline.currentSnapshotIndex ? '1px solid #4a90e2' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Snapshot {index + 1}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>
                    {new Date(snapshot.timestamp).toLocaleString()}
                  </div>
                  {isExpanded && (
                    <>
                      <div style={{ fontSize: '12px', marginTop: '8px' }}>
                        <strong>Parts:</strong> {snapshot.model.parts.length}
                      </div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>
                        <strong>Self Energy:</strong> {(snapshot.clinicalSettings.selfEnergyLevel * 100).toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>
                        <strong>Relationships:</strong> {snapshot.clinicalSettings.relationships.length}
                      </div>
                      {snapshot.clinicalSettings.sessionNotes && (
                        <div style={{ 
                          fontSize: '12px', 
                          marginTop: '8px',
                          padding: '8px',
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          borderRadius: '4px',
                          maxHeight: '80px',
                          overflowY: 'auto'
                        }}>
                          {snapshot.clinicalSettings.sessionNotes}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Persistent handle when minimized */}
      {isMinimized && (
        <div
          onClick={() => setIsMinimized(false)}
          style={{
            position: 'fixed',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(20, 20, 30, 0.95)',
            padding: '8px 16px',
            borderRadius: '8px 8px 0 0',
            color: 'white',
            cursor: 'pointer',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(30, 30, 40, 0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(20, 20, 30, 0.95)';
          }}
        >
          <span>↑</span>
          <span>Show Timeline</span>
          {timeline.snapshots.length > 0 && (
            <span style={{ 
              backgroundColor: 'rgba(74, 144, 226, 0.3)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {timeline.snapshots.length} Snapshots
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default TimelinePanel; 