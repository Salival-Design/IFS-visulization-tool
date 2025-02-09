export interface Part {
  id: string;
  name: string;
  type: 'manager' | 'firefighter' | 'exile';
  emotionalLoad: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  relationships: {
    targetId: string;
    type: 'polarized' | 'allied' | 'protective';
  }[];
  imageUrl: string;
  showLabels: boolean;
}

export interface IFSModel {
  self: {
    presence: number;
    position: {
      x: number;
      y: number;
      z: number;
    };
  };
  parts: Part[];
}