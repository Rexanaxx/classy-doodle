import React, { useState } from 'react';
import DiagramBox from './DiagramBox';
import DiagramConnector from './DiagramConnector';
import Toolbar from './Toolbar';

interface Box {
  id: string;
  title: string;
  attributes: string[];
  methods: string[];
  position: { x: number; y: number };
}

interface Connector {
  id: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
}

const Editor: React.FC = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [isCreatingConnector, setIsCreatingConnector] = useState(false);
  const [tempConnector, setTempConnector] = useState<Connector | null>(null);

  const handleAddBox = () => {
    const newBox: Box = {
      id: `box-${Date.now()}`,
      title: 'New Class',
      attributes: [],
      methods: [],
      position: { x: 100, y: 100 },
    };
    setBoxes([...boxes, newBox]);
  };

  const handleBoxMove = (id: string, newPosition: { x: number; y: number }) => {
    setBoxes(boxes.map(box => 
      box.id === id ? { ...box, position: newPosition } : box
    ));
  };

  const handleBoxUpdate = (
    id: string,
    data: { title?: string; attributes?: string[]; methods?: string[] }
  ) => {
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, ...data } : box
    ));
  };

  const handleBoxDelete = (id: string) => {
    setBoxes(boxes.filter(box => box.id !== id));
    // Remove associated connectors
    setConnectors(connectors.filter(conn =>
      !conn.id.includes(id)
    ));
  };

  const handleStartConnector = () => {
    setIsCreatingConnector(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCreatingConnector) return;

    const newConnector: Connector = {
      id: `connector-${Date.now()}`,
      startPoint: { x: e.clientX, y: e.clientY },
      endPoint: { x: e.clientX, y: e.clientY },
    };
    setTempConnector(newConnector);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tempConnector) return;

    setTempConnector({
      ...tempConnector,
      endPoint: { x: e.clientX, y: e.clientY },
    });
  };

  const handleMouseUp = () => {
    if (tempConnector) {
      setConnectors([...connectors, tempConnector]);
      setTempConnector(null);
    }
    setIsCreatingConnector(false);
  };

  const handleConnectorUpdate = (
    id: string,
    startPoint: { x: number; y: number },
    endPoint: { x: number; y: number }
  ) => {
    setConnectors(connectors.map(conn =>
      conn.id === id ? { ...conn, startPoint, endPoint } : conn
    ));
  };

  const handleConnectorDelete = (id: string) => {
    setConnectors(connectors.filter(conn => conn.id !== id));
  };

  return (
    <div
      className="fixed inset-0 bg-editor-bg overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--tw-colors-editor-grid) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Toolbar
        onAddBox={handleAddBox}
        onAddConnector={handleStartConnector}
      />

      {boxes.map(box => (
        <DiagramBox
          key={box.id}
          {...box}
          onMove={handleBoxMove}
          onUpdate={handleBoxUpdate}
          onDelete={handleBoxDelete}
        />
      ))}

      {connectors.map(connector => (
        <DiagramConnector
          key={connector.id}
          {...connector}
          onUpdate={handleConnectorUpdate}
          onDelete={handleConnectorDelete}
        />
      ))}

      {tempConnector && (
        <DiagramConnector
          {...tempConnector}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  );
};

export default Editor;