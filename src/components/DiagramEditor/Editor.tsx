import React, { useEffect, useRef } from 'react';
import DiagramBox from './DiagramBox';
import DiagramConnector from './DiagramConnector';
import JsonDialog from './JsonDialog';
import EditorToolbar from './EditorToolbar';
import EditorButtons from './EditorButtons';
import * as htmlToImage from 'html-to-image';
import { toast } from 'sonner';
import { useEditorState } from './EditorState';
import DraggableText from './DraggableText';
import { Box, RelationType } from './types';
import { loadUserDiagram, saveDiagram } from '@/services/diagramService';
import { useDiagramHandlers } from './useDiagramHandlers';

const Editor: React.FC = () => {
  const {
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
  } = useEditorState();

  const editorRef = useRef<HTMLDivElement>(null);

  const {
    handleBoxMove,
    handleBoxUpdate,
    handleBoxDelete,
    handleConnectionClick,
    handleResetConnections,
  } = useDiagramHandlers({
    boxes,
    setBoxes,
    connectors,
    setConnectors,
    selectedRelationType,
    pendingConnection,
    setPendingConnection,
    isConnectorMode,
  });

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

  const handleAddTextField = () => {
    const newTextField = {
      id: `text-${Date.now()}`,
      position: { x: 100, y: 100 },
    };
    setTextFields([...textFields, newTextField]);
  };

  const handleTextFieldMove = (id: string, newPosition: { x: number; y: number }) => {
    setTextFields(textFields.map(field => 
      field.id === id ? { ...field, position: newPosition } : field
    ));
  };

  const handleTextFieldDelete = (id: string) => {
    setTextFields(textFields.filter(field => field.id !== id));
  };

  const handleRelationTypeChange = (type: RelationType) => {
    setSelectedRelationType(type);
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
      <EditorButtons
        onExport={handleExport}
        onAddTextField={handleAddTextField}
        onShowJson={() => setIsJsonDialogOpen(true)}
      />

      <EditorToolbar
        onSave={handleSave}
        onAddBox={handleAddBox}
        isConnectorMode={isConnectorMode}
        onToggleConnectorMode={() => {
          setIsConnectorMode(!isConnectorMode);
          setPendingConnection(null);
        }}
        selectedRelationType={selectedRelationType}
        onRelationTypeChange={handleRelationTypeChange}
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

      {textFields.map(field => (
        <DraggableText
          key={field.id}
          id={field.id}
          position={field.position}
          onMove={handleTextFieldMove}
          onDelete={handleTextFieldDelete}
        />
      ))}

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