import { Object3D } from 'three';
import { ReactThreeFiber } from '@react-three/fiber'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: ReactThreeFiber.Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight> & {
        intensity?: number;
      };
      pointLight: ReactThreeFiber.Object3DNode<THREE.PointLight, typeof THREE.PointLight> & {
        intensity?: number;
        position?: [number, number, number];
      };
      group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
      mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      points: ReactThreeFiber.Object3DNode<THREE.Points, typeof THREE.Points>;
      sphereGeometry: ReactThreeFiber.BufferGeometryNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
      bufferGeometry: ReactThreeFiber.BufferGeometryNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>;
      bufferAttribute: ReactThreeFiber.BufferAttributeNode<THREE.BufferAttribute, typeof THREE.BufferAttribute>;
      meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
      meshPhysicalMaterial: ReactThreeFiber.MaterialNode<THREE.MeshPhysicalMaterial, typeof THREE.MeshPhysicalMaterial> & {
        color?: string;
        emissive?: string;
        emissiveIntensity?: number;
        roughness?: number;
        metalness?: number;
        transparent?: boolean;
        opacity?: number;
        map?: THREE.Texture;
        emissiveMap?: THREE.Texture;
      };
      pointsMaterial: ReactThreeFiber.MaterialNode<THREE.PointsMaterial, typeof THREE.PointsMaterial> & {
        size?: number;
        color?: string;
        transparent?: boolean;
        opacity?: number;
        sizeAttenuation?: boolean;
      };
    }
  }
}

export interface IFSPart {
  id: string;
  name: string;
  type: 'manager' | 'firefighter' | 'exile';
  emotionalLoad: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  relationships: Array<{
    targetId: string;
    type: 'polarized' | 'allied' | 'protective';
  }>;
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
  parts: IFSPart[];
}