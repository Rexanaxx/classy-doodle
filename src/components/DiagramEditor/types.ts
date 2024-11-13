export type RelationType = 'association' | 'inheritance' | 'composition' | 'aggregation' | 'dependency' | 'realization';

export const relationColors: Record<RelationType, string> = {
  association: '#3B82F6', // blue
  inheritance: '#10B981', // green
  composition: '#F59E0B', // amber
  aggregation: '#8B5CF6', // purple
  dependency: '#EF4444', // red
  realization: '#6366F1'  // indigo
};

export interface Box {
  id: string;
  title: string;
  attributes: string[];
  methods: string[];
  position: { x: number; y: number };
}

export interface Connector {
  id: string;
  startBoxId: string;
  endBoxId: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  type: RelationType;
}