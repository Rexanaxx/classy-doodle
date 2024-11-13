import { Json } from "@/integrations/supabase/types";
import { Box, Connector } from "@/components/DiagramEditor/types";

export interface DiagramData {
  boxes: Box[];
  connectors: Connector[];
}

export function isDiagramData(json: Json): json is DiagramData {
  if (typeof json !== 'object' || !json) return false;
  const data = json as any;
  return Array.isArray(data.boxes) && Array.isArray(data.connectors);
}