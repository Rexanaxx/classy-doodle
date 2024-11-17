import { useState } from 'react';
import { Box, Connector } from './types';

export const useEditorState = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [textFields, setTextFields] = useState<{ id: string; position: { x: number; y: number } }[]>([]);
  const [isConnectorMode, setIsConnectorMode] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<string | null>(null);
  const [selectedRelationType, setSelectedRelationType] = useState<'association'>('association');
  const [isJsonDialogOpen, setIsJsonDialogOpen] = useState(false);

  return {
    boxes,
    setBoxes,
    connectors,
    setConnectors,
    textFields,
    setTextFields,
    isConnectorMode,
    setIsConnectorMode,
    pendingConnection,
    setPendingConnection,
    selectedRelationType,
    setSelectedRelationType,
    isJsonDialogOpen,
    setIsJsonDialogOpen,
  };
};