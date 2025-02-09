export interface Part {
  id: string;
  name: string;
  type: 'protector' | 'exile'; // Initially, only two types
  emotionalLoad: number; // Value between 0 and 1
  relationships: {
    targetId: string;
    type: 'polarized' | 'allied' | 'neutral'; // Relationship types
  }[];
}

export interface IFSModel {
    parts: Part[];
}