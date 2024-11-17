import { supabase } from '@/integrations/supabase/client';
import { DiagramData } from '@/components/DiagramEditor/types';

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

  // Ensure the data matches the DiagramData interface structure
  const diagramData = data?.diagram_data as any;
  if (diagramData && Array.isArray(diagramData.boxes) && Array.isArray(diagramData.connectors)) {
    return diagramData as DiagramData;
  }
  
  return null;
}

export async function saveDiagram(diagramId: string, data: DiagramData): Promise<void> {
  const { error } = await supabase
    .from('diagrams')
    .update({ 
      diagram_data: {
        boxes: data.boxes,
        connectors: data.connectors
      }
    })
    .eq('id', diagramId);

  if (error) {
    console.error('Error saving diagram:', error);
    throw error;
  }
}