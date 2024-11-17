export type RelationType = 'association' | 'inheritance' | 'composition' | 'aggregation' | 'dependency' | 'realization';

export const relationColors: Record<RelationType, string> = {
  association: '#3B82F6', // blue
  inheritance: '#10B981', // green
  composition: '#F59E0B', // amber
  aggregation: '#8B5CF6', // purple
  dependency: '#EF4444', // red
  realization: '#6366F1'  // indigo
};

export type AccessModifier = 'public' | 'private' | 'protected' | 'static';

export interface BoxItem {
  value: string;
  accessModifier: AccessModifier;
}

export interface Box {
  id: string;
  title: string;
  attributes: BoxItem[];
  methods: BoxItem[];
  position: { x: number; y: number };
  isInterface?: boolean;
}

export interface Connector {
  id: string;
  startBoxId: string;
  endBoxId: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  type: RelationType;
}

export interface DiagramData {
  boxes: Box[];
  connectors: Connector[];
}

export const getAccessModifierSymbol = (modifier: AccessModifier): string => {
  switch (modifier) {
    case 'public':
      return '+';
    case 'private':
      return '-';
    case 'protected':
      return '#';
    case 'static':
      return '*';
    default:
      return '+';
  }
};