import React, { useState, useEffect } from 'react';
import DiagramBox from './DiagramBox';
import DiagramConnector from './DiagramConnector';
import Toolbar from './Toolbar';
import { RelationType, BoxItem } from './types';
import { Button } from '@/components/ui/button';
import { loadUserDiagram, saveDiagram } from '@/services/diagramService';

interface Box {
  id: string;
  title: string;
  attributes: BoxItem[];
  methods: BoxItem[];
  position: { x: number; y: number };
  isInterface?: boolean;
}

interface Connector {
  id: string;
  startBoxId: string;
  endBoxId: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  type: RelationType;
}

const Editor: React.FC = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [isConnectorMode, setIsConnectorMode] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<string | null>(null);
  const [selectedRelationType, setSelectedRelationType] = useState<RelationType>('association');

  useEffect(() => {
    const loadDiagram = async () => {
      const diagram = await loadUserDiagram();
      if (diagram) {
        setBoxes(diagram.boxes);
        setConnectors(diagram.connectors);
      }
    };
    loadDiagram();
  }, []);

  const handleSave = async () => {
    await saveDiagram({ boxes, connectors });
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

  return (
    <div
      className="fixed inset-0 bg-editor-bg overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--tw-colors-editor-grid) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}
    >
      <div className="fixed top-4 right-24 z-50">
        <Button
          onClick={handleSave}
          className="mr-2"
          variant="default"
        >
          Save Diagram
        </Button>
      </div>
      
      <Toolbar
        onAddBox={() => handleAddBox(false)}
        onAddInterface={() => handleAddBox(true)}
        isConnectorMode={isConnectorMode}
        onToggleConnectorMode={() => {
          setIsConnectorMode(!isConnectorMode);
          setPendingConnection(null);
        }}
        selectedRelationType={selectedRelationType}
        onRelationTypeChange={setSelectedRelationType}
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
    </div>
  );
};

export default Editor;