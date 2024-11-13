import React, { useState, useEffect } from 'react';
import DiagramBox from './DiagramBox';
import DiagramConnector from './DiagramConnector';
import Toolbar from './Toolbar';
import { RelationType } from './types';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Box {
  id: string;
  title: string;
  attributes: string[];
  methods: string[];
  position: { x: number; y: number };
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
    loadDiagram();
  }, []);

  const loadDiagram = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: diagrams, error } = await supabase
        .from('diagrams')
        .select('diagram_data')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned is not an error for us
          console.error('Error loading diagram:', error);
          toast.error('Failed to load diagram');
        }
        return;
      }

      if (diagrams) {
        setBoxes(diagrams.diagram_data.boxes || []);
        setConnectors(diagrams.diagram_data.connectors || []);
        toast.success('Diagram loaded successfully');
      }
    } catch (error) {
      console.error('Error loading diagram:', error);
      toast.error('Failed to load diagram');
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to save your diagram');
        return;
      }

      const diagramData = {
        boxes,
        connectors,
      };

      const { error } = await supabase
        .from('diagrams')
        .upsert({
          user_id: user.id,
          diagram_data: diagramData,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      toast.success('Diagram saved successfully');
    } catch (error) {
      console.error('Error saving diagram:', error);
      toast.error('Failed to save diagram');
    }
  };

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
    data: { title?: string; attributes?: string[]; methods?: string[] }
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
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleSave}
          className="mr-2"
          variant="default"
        >
          Save Diagram
        </Button>
      </div>
      <Toolbar
        onAddBox={handleAddBox}
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