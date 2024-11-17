import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';

interface DraggableTextProps {
  id: string;
  position: { x: number; y: number };
  onMove: (id: string, newPosition: { x: number; y: number }) => void;
  onDelete: (id: string) => void;
}

const DraggableText: React.FC<DraggableTextProps> = ({
  id,
  position,
  onMove,
  onDelete,
}) => {
  const [text, setText] = useState('Edit this text');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent) => {
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
      className="absolute group"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 50,
      }}
    >
      <div
        className="cursor-move mb-1 h-4 bg-gray-200 rounded-t opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={handleDragStart}
      />
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-w-[200px]"
      />
      <button
        onClick={() => onDelete(id)}
        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  );
};

export default DraggableText;