import React, { useState, useRef } from 'react';
import BoxHeader from './BoxHeader';
import BoxSection from './BoxSection';
import { cn } from '@/lib/utils';

interface DiagramBoxProps {
  id: string;
  title: string;
  attributes: string[];
  methods: string[];
  position: { x: number; y: number };
  isConnectorMode: boolean;
  isPendingConnection: boolean;
  onMove: (id: string, newPosition: { x: number; y: number }) => void;
  onUpdate: (id: string, data: { title?: string; attributes?: string[]; methods?: string[] }) => void;
  onDelete: (id: string) => void;
  onConnectionClick: (id: string) => void;
  onResetConnections: (id: string) => void;
}

const DiagramBox: React.FC<DiagramBoxProps> = ({
  id,
  title,
  attributes,
  methods,
  position,
  isConnectorMode,
  isPendingConnection,
  onMove,
  onUpdate,
  onDelete,
  onConnectionClick,
  onResetConnections,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isConnectorMode) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    onMove(id, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={boxRef}
      className={cn(
        "absolute bg-white border-2 border-editor-box-border rounded-lg shadow-lg min-w-[200px]",
        "transition-shadow duration-200",
        isDragging ? "shadow-xl cursor-grabbing" : "cursor-grab",
        "animate-fade-in",
        isPendingConnection && "ring-2 ring-blue-500"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <BoxHeader
        id={id}
        title={title}
        isConnectorMode={isConnectorMode}
        isPendingConnection={isPendingConnection}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onConnectionClick={onConnectionClick}
        onResetConnections={onResetConnections}
      />
      <BoxSection
        title="Attributes"
        items={attributes}
        onAdd={() => onUpdate(id, { attributes: [...attributes, 'New Attribute'] })}
        onUpdate={(index, value) => {
          const newAttributes = [...attributes];
          newAttributes[index] = value;
          onUpdate(id, { attributes: newAttributes });
        }}
        onDelete={(index) => {
          const newAttributes = attributes.filter((_, i) => i !== index);
          onUpdate(id, { attributes: newAttributes });
        }}
      />
      <BoxSection
        title="Methods"
        items={methods}
        onAdd={() => onUpdate(id, { methods: [...methods, 'New Method'] })}
        onUpdate={(index, value) => {
          const newMethods = [...methods];
          newMethods[index] = value;
          onUpdate(id, { methods: newMethods });
        }}
        onDelete={(index) => {
          const newMethods = methods.filter((_, i) => i !== index);
          onUpdate(id, { methods: newMethods });
        }}
      />
    </div>
  );
};

export default DiagramBox;