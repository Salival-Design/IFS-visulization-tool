import React, { useState, useEffect, useCallback } from 'react';
import { IFSModel, SessionSnapshot, SessionTimeline, TimelineControls } from '../types/IFSModel';
import { ClinicalSettings } from './ClinicalPanel';

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

  const createSnapshot = useCallback(() => {
    const snapshot: SessionSnapshot = {
      id: `snapshot_${Date.now()}`,
      timestamp: Date.now(),
      model: JSON.parse(JSON.stringify(model)),
      clinicalSettings: JSON.parse(JSON.stringify(clinicalSettings)),
    };

    setTimeline(prev => ({
      ...prev,
      snapshots: [...prev.snapshots, snapshot],
      currentSnapshotIndex: prev.snapshots.length,
    }));
  }, [model, clinicalSettings]);

  const playSnapshot = useCallback((index: number) => {
    if (index >= 0 && index < timeline.snapshots.length) {
      const snapshot = timeline.snapshots[index];
      setTimeline(prev => ({ ...prev, currentSnapshotIndex: index }));
      setTimeout(() => {
        onUpdateModel(snapshot.model);
        onUpdateSettings(snapshot.clinicalSettings);
      }, 0);
    }
  }, [timeline.snapshots, onUpdateModel, onUpdateSettings]);

  const handlePlaybackTick = useCallback(() => {
    setTimeline(prev => {
      const nextIndex = prev.currentSnapshotIndex + 1;
      if (nextIndex < prev.snapshots.length) {
        const snapshot = prev.snapshots[nextIndex];
        setTimeout(() => {
          onUpdateModel(snapshot.model);
          onUpdateSettings(snapshot.clinicalSettings);
        }, 0);
        return { ...prev, currentSnapshotIndex: nextIndex };
      } else if (controls.loop) {
        const snapshot = prev.snapshots[0];
        setTimeout(() => {
          onUpdateModel(snapshot.model);
          onUpdateSettings(snapshot.clinicalSettings);
        }, 0);
        return { ...prev, currentSnapshotIndex: 0 };
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
      width: '80%',
      maxWidth: '800px',
      transition: 'bottom 0.3s ease',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px',
        position: 'relative'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Session Timeline</h3>
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
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            padding: '10px 0',
          }}>
            {timeline.snapshots.map((snapshot, index) => (
              <div
                key={snapshot.id}
                onClick={() => playSnapshot(index)}
                style={{
                  backgroundColor: index === timeline.currentSnapshotIndex ? 'rgba(74, 144, 226, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  minWidth: '100px',
                  textAlign: 'center',
                  border: index === timeline.currentSnapshotIndex ? '1px solid #4a90e2' : '1px solid transparent',
                }}
              >
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  {new Date(snapshot.timestamp).toLocaleTimeString()}
                </div>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  Snapshot {index + 1}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TimelinePanel; 