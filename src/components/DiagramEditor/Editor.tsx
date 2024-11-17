import React, { useState, useEffect, useRef } from 'react';
import DiagramBox from './DiagramBox';
import DiagramConnector from './DiagramConnector';
import { RelationType, Box, BoxItem, Connector } from './types';
import { Button } from '@/components/ui/button';
import { loadUserDiagram, saveDiagram } from '@/services/diagramService';
import { Code, Download } from 'lucide-react';
import JsonDialog from './JsonDialog';
import EditorToolbar from './EditorToolbar';
import * as htmlToImage from 'html-to-image';
import { toast } from 'sonner';

interface EditorProps {
  diagramId: string;
}

const Editor: React.FC<EditorProps> = ({ diagramId }) => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [isConnectorMode, setIsConnectorMode] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<string | null>(null);
  const [selectedRelationType, setSelectedRelationType] = useState<RelationType>('association');
  const [isJsonDialogOpen, setIsJsonDialogOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDiagram = async () => {
      const diagram = await loadUserDiagram(diagramId);
      if (diagram) {
        setBoxes(diagram.boxes);
        setConnectors(diagram.connectors);
      }
    };
    loadDiagram();
  }, [diagramId]);

  const handleSave = async () => {
    await saveDiagram(diagramId, { boxes, connectors });
    toast.success('Diagram saved successfully');
  };

  const handleAddBox = (isInterface: boolean = false) => {
    const newBox: Box = {
      id: `box-${Date.now()}`,
      title: isInterface ? 'New Interface' : 'New Class',
      attributes: [],
      methods: [],
      position: { x: 100, y: 100 },
      isInterface,
    };
    setBoxes([...boxes, newBox]);
  };

  const handleBoxMove = (id: string, newPosition: { x: number; y: number }) => {
    setBoxes(boxes.map(box => 
      box.id === id ? { ...box, position: newPosition } : box
    ));

    setConnectors(connectors.map(conn => {
      if (conn.startBoxId === id || conn.endBoxId === id) {
        const startBox = boxes.find(b => b.id === conn.startBoxId);
        const endBox = boxes.find(b => b.id === conn.endBoxId);
        if (startBox && endBox) {
          return {
            ...conn,
            startPoint: conn.startBoxId === id ? newPosition : conn.startPoint,
            endPoint: conn.endBoxId === id ? newPosition : conn.endPoint,
          };
        }
      }
      return conn;
    }));
  };

  const handleBoxUpdate = (
    id: string,
    data: { title?: string; attributes?: BoxItem[]; methods?: BoxItem[] }
  ) => {
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, ...data } : box
    ));
  };

  const handleBoxDelete = (id: string) => {
    setBoxes(boxes.filter(box => box.id !== id));
    setConnectors(connectors.filter(conn => 
      conn.startBoxId !== id && conn.endBoxId !== id
    ));
  };

  const handleConnectionClick = (boxId: string) => {
    if (!isConnectorMode) return;

    if (!pendingConnection) {
      setPendingConnection(boxId);
    } else if (pendingConnection !== boxId) {
      const startBox = boxes.find(b => b.id === pendingConnection);
      const endBox = boxes.find(b => b.id === boxId);
      
      if (startBox && endBox) {
        const newConnector: Connector = {
          id: `connector-${Date.now()}`,
          startBoxId: pendingConnection,
          endBoxId: boxId,
          startPoint: startBox.position,
          endPoint: endBox.position,
          type: selectedRelationType,
        };
        setConnectors([...connectors, newConnector]);
      }
      setPendingConnection(null);
    }
  };

  const handleResetConnections = (boxId: string) => {
    setConnectors(connectors.filter(conn => 
      conn.startBoxId !== boxId && conn.endBoxId !== boxId
    ));
  };

  const handleExport = async () => {
    if (editorRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(editorRef.current);
        const link = document.createElement('a');
        link.download = 'diagram.png';
        link.href = dataUrl;
        link.click();
        toast.success('Diagram exported successfully');
      } catch (error) {
        toast.error('Failed to export diagram');
        console.error('Error exporting diagram:', error);
      }
    }
  };

  return (
    <div
      ref={editorRef}
      className="fixed inset-0 bg-editor-bg overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--tw-colors-editor-grid) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}
    >
      <Button
        onClick={handleExport}
        className="fixed top-4 left-64 z-50"
        variant="outline"
        size="sm"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>

      <EditorToolbar
        onSave={handleSave}
        onAddBox={(isInterface) => handleAddBox(isInterface)}
        isConnectorMode={isConnectorMode}
        onToggleConnectorMode={() => {
          setIsConnectorMode(!isConnectorMode);
          setPendingConnection(null);
        }}
        selectedRelationType={selectedRelationType}
        onRelationTypeChange={(type: RelationType) => setSelectedRelationType(type)}
      />

      {boxes.map(box => (
        <DiagramBox
          key={box.id}
          {...box}
          isConnectorMode={isConnectorMode}
          isPendingConnection={pendingConnection === box.id}
          onMove={handleBoxMove}
          onUpdate={handleBoxUpdate}
          onDelete={handleBoxDelete}
          onConnectionClick={handleConnectionClick}
          onResetConnections={handleResetConnections}
        />
      ))}

      {connectors.map(connector => (
        <DiagramConnector
          key={connector.id}
          {...connector}
          type={connector.type}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      ))}

      <Button
        onClick={() => setIsJsonDialogOpen(true)}
        className="fixed bottom-4 right-4 z-50"
        variant="outline"
        size="sm"
      >
        <Code className="w-4 h-4 mr-2" />
        Show JSON
      </Button>

      <JsonDialog
        isOpen={isJsonDialogOpen}
        onOpenChange={setIsJsonDialogOpen}
        boxes={boxes}
        connectors={connectors}
      />
    </div>
  );
};

export default Editor;
