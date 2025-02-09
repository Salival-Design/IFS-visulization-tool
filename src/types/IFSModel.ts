import { ClinicalSettings } from '../components/ClinicalPanel';

export interface Part {
  id: string;
  name: string;
  type: 'manager' | 'firefighter' | 'exile';
  position: {
    x: number;
    y: number;
    z: number;
  };
  emotionalLoad: number;
  relationships: Relationship[];
  notes: string;
  image?: string;
  color?: string;
  imageUrl?: string;
  showLabels: boolean;
  brightness: number; // 0-1: Controls the image brightness
}

export interface Relationship {
  targetId: string;
  type: 'alliance' | 'conflict' | 'protection' | 'polarization';
  strength: number;
  notes?: string;
}

export interface IFSModel {
  parts: Part[];
  self: {
    presence: number;
    position: { x: number; y: number; z: number };
  };
  selfEnergy: number;
  systemHarmony: number;
  notes: string[];
}

export interface SessionSnapshot {
  id: string;
  timestamp: number;
  model: IFSModel;
  clinicalSettings: ClinicalSettings;
  note?: string;
}

export interface SessionTimeline {
  sessionId: string;
  snapshots: SessionSnapshot[];
  currentSnapshotIndex: number;
}

export interface TimelineControls {
  isPlaying: boolean;
  playbackSpeed: number; // milliseconds between snapshots
  loop: boolean;
}

export const partColors = {
  manager: '#4a90e2',
  firefighter: '#e25555',
  exile: '#50c878'
}; 