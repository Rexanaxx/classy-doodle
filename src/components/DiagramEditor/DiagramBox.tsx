import React, { useState, useRef } from 'react';
import BoxHeader from './BoxHeader';
import BoxSection from './BoxSection';
import { cn } from '@/lib/utils';
import { AccessModifier, BoxItem } from './types';

interface DiagramBoxProps {
  id: string;
  title: string;
  attributes: BoxItem[];
  methods: BoxItem[];
  position: { x: number; y: number };
  isInterface?: boolean;
  isConnectorMode: boolean;
  isPendingConnection: boolean;
  onMove: (id: string, newPosition: { x: number; y: number }) => void;
  onUpdate: (id: string, data: { title?: string; attributes?: BoxItem[]; methods?: BoxItem[] }) => void;
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
  isInterface = false,
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

  const handleDragStart = (e: React.MouseEvent) => {
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
        "absolute bg-white border-2 rounded-lg shadow-lg min-w-[200px]",
        "transition-shadow duration-200",
        isDragging && "shadow-xl",
        "animate-fade-in",
        isPendingConnection && "ring-2 ring-blue-500",
        isInterface ? "border-red-500" : "border-editor-box-border"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 50,
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
        dragHandleProps={{
          onMouseDown: handleDragStart,
        }}
      />
      {!isInterface && (
        <BoxSection
          title="Attributes"
          items={attributes}
          onAdd={() => onUpdate(id, { attributes: [...attributes, { value: 'New Attribute', accessModifier: 'public' }] })}
          onUpdate={(index, value, accessModifier) => {
            const newAttributes = [...attributes];
            newAttributes[index] = { value, accessModifier };
            onUpdate(id, { attributes: newAttributes });
          }}
          onDelete={(index) => {
            const newAttributes = attributes.filter((_, i) => i !== index);
            onUpdate(id, { attributes: newAttributes });
          }}
        />
      )}
      <BoxSection
        title="Methods"
        items={methods}
        onAdd={() => onUpdate(id, { methods: [...methods, { value: 'New Method', accessModifier: 'public' }] })}
        onUpdate={(index, value, accessModifier) => {
          const newMethods = [...methods];
          newMethods[index] = { value, accessModifier };
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