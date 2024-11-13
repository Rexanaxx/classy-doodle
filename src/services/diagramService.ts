import { supabase } from "@/integrations/supabase/client";
import { DiagramData, diagramDataToJson, jsonToDiagramData } from "@/types/database";
import { toast } from "sonner";

export async function loadUserDiagram(): Promise<DiagramData | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: diagrams, error } = await supabase
      .from('diagrams')
      .select('diagram_data')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Error loading diagram:', error);
        toast.error('Failed to load diagram');
      }
      return null;
    }

    if (diagrams) {
      const diagramData = jsonToDiagramData(diagrams.diagram_data);
      if (diagramData) {
        toast.success('Diagram loaded successfully');
        return diagramData;
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading diagram:', error);
    toast.error('Failed to load diagram');
    return null;
  }
}

export async function saveDiagram(diagramData: DiagramData): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please log in to save your diagram');
      return false;
    }

    const { error } = await supabase
      .from('diagrams')
      .upsert({
        user_id: user.id,
        diagram_data: diagramDataToJson(diagramData)
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
    toast.success('Diagram saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving diagram:', error);
    toast.error('Failed to save diagram');
    return false;
  }
}