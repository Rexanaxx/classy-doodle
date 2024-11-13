import { Json } from "@/integrations/supabase/types";
import { Box, Connector } from "@/components/DiagramEditor/types";

export interface DiagramData {
  boxes: Box[];
  connectors: Connector[];
}

export function isDiagramData(json: unknown): json is DiagramData {
  if (typeof json !== 'object' || !json) return false;
  const data = json as any;
  return Array.isArray(data.boxes) && Array.isArray(data.connectors);
}

export function diagramDataToJson(data: DiagramData): Json {
  return JSON.parse(JSON.stringify(data));
}

export function jsonToDiagramData(json: Json): DiagramData | null {
  try {
    if (typeof json === 'string') {
      const parsed = JSON.parse(json);
      if (isDiagramData(parsed)) {
        return parsed;
      }
    } else if (isDiagramData(json)) {
      return json;
    }
    return null;
  } catch {
    return null;
  }
}