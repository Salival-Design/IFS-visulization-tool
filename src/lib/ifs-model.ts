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
  imageUrl?: string;
  showLabels: boolean;
}

export interface IFSModel {
  parts: Part[];
  self: {
    presence: number;
    position: { x: number; y: number; z: number };
  };
}