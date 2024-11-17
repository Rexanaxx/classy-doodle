import { supabase } from '@/integrations/supabase/client';
import { Box, Connector } from '@/components/DiagramEditor/types';

interface DiagramData {
  boxes: Box[];
  connectors: Connector[];
}

export async function loadUserDiagram(diagramId: string): Promise<DiagramData | null> {
  const { data, error } = await supabase
    .from('diagrams')
    .select('diagram_data')
    .eq('id', diagramId)
    .single();

  if (error) {
    console.error('Error loading diagram:', error);
    return null;
  }

  return data?.diagram_data as DiagramData;
}

export async function saveDiagram(diagramId: string, data: DiagramData): Promise<void> {
  const { error } = await supabase
    .from('diagrams')
    .update({ diagram_data: data })
    .eq('id', diagramId);

  if (error) {
    console.error('Error saving diagram:', error);
    throw error;
  }
}