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
      .limit(1);

    if (error) {
      console.error('Error loading diagram:', error);
      toast.error('Failed to load diagram');
      return null;
    }

    if (diagrams && diagrams.length > 0) {
      const diagramData = jsonToDiagramData(diagrams[0].diagram_data);
      if (diagramData) {
        toast.success('Diagram loaded successfully');
        return diagramData;
      }
    }

    // If no diagram exists yet, return a new empty diagram
    return {
      boxes: [],
      connectors: []
    };
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

    // First, check if a diagram exists for this user
    const { data: existingDiagrams } = await supabase
      .from('diagrams')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (existingDiagrams && existingDiagrams.length > 0) {
      // Update existing diagram
      const { error } = await supabase
        .from('diagrams')
        .update({
          diagram_data: diagramDataToJson(diagramData)
        })
        .eq('user_id', user.id);

      if (error) throw error;
    } else {
      // Insert new diagram
      const { error } = await supabase
        .from('diagrams')
        .insert({
          user_id: user.id,
          diagram_data: diagramDataToJson(diagramData)
        });

      if (error) throw error;
    }

    toast.success('Diagram saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving diagram:', error);
    toast.error('Failed to save diagram');
    return false;
  }
}