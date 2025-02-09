export type Relationship = {
  targetId: string;
  type: 'positive' | 'negative' | 'neutral';
  strength: number;
};

export type Part = {
  id: string;
  name: string;
  type: 'manager' | 'firefighter' | 'exile';
  emotionalLoad: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  relationships: Relationship[];
  imageUrl?: string;
  showLabels: boolean;
};

export const partColors = {
  manager: '#4a90e2',
  firefighter: '#e25555',
  exile: '#50c878'
}; 