import React, { useState, useRef } from 'react';
import { X, GripVertical, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagramBoxProps {
  id: string;
  title: string;
  attributes: string[];
  methods: string[];
  position: { x: number; y: number };
  onMove: (id: string, newPosition: { x: number; y: number }) => void;
  onUpdate: (id: string, data: { title?: string; attributes?: string[]; methods?: string[] }) => void;
  onDelete: (id: string) => void;
}

const DiagramBox: React.FC<DiagramBoxProps> = ({
  id,
  title,
  attributes,
  methods,
  position,
  onMove,
  onUpdate,
  onDelete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
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

  const addItem = (type: 'attributes' | 'methods') => {
    const items = type === 'attributes' ? attributes : methods;
    const newItem = `New ${type === 'attributes' ? 'Attribute' : 'Method'}`;
    onUpdate(id, { [type]: [...items, newItem] });
  };

  const updateItem = (type: 'attributes' | 'methods', index: number, value: string) => {
    const items = type === 'attributes' ? attributes : methods;
    const newItems = [...items];
    newItems[index] = value;
    onUpdate(id, { [type]: newItems });
  };

  const deleteItem = (type: 'attributes' | 'methods', index: number) => {
    const items = type === 'attributes' ? attributes : methods;
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(id, { [type]: newItems });
  };

  return (
    <div
      ref={boxRef}
      className={cn(
        "absolute bg-white border-2 border-editor-box-border rounded-lg shadow-lg min-w-[200px]",
        "transition-shadow duration-200",
        isDragging ? "shadow-xl cursor-grabbing" : "cursor-grab",
        "animate-fade-in"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Title Section */}
      <div
        className="p-3 bg-editor-box-bg border-b-2 border-editor-box-border rounded-t-lg"
        onMouseDown={handleMouseDown}
      >
        {isEditing ? (
          <input
            className="w-full px-2 py-1 border rounded"
            value={title}
            onChange={(e) => onUpdate(id, { title: e.target.value })}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <div className="flex items-center justify-between">
            <h3
              className="font-semibold text-editor-box-title cursor-text"
              onClick={() => setIsEditing(true)}
            >
              {title}
            </h3>
            <button
              onClick={() => onDelete(id)}
              className="p-1 hover:bg-red-100 rounded-full transition-colors"
            >
              <X size={16} className="text-red-500" />
            </button>
          </div>
        )}
      </div>

      {/* Attributes Section */}
      <div className="border-b-2 border-editor-box-border">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
          <span className="text-sm font-medium text-editor-box-text">Attributes</span>
          <button
            onClick={() => addItem('attributes')}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Plus size={16} className="text-editor-box-text" />
          </button>
        </div>
        <ul className="p-2 space-y-1">
          {attributes.map((attr, index) => (
            <li key={index} className="flex items-center gap-2">
              <GripVertical size={16} className="text-gray-400" />
              <input
                className="flex-1 px-2 py-1 text-sm border rounded hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={attr}
                onChange={(e) => updateItem('attributes', index, e.target.value)}
              />
              <button
                onClick={() => deleteItem('attributes', index)}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
              >
                <X size={14} className="text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Methods Section */}
      <div>
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
          <span className="text-sm font-medium text-editor-box-text">Methods</span>
          <button
            onClick={() => addItem('methods')}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Plus size={16} className="text-editor-box-text" />
          </button>
        </div>
        <ul className="p-2 space-y-1">
          {methods.map((method, index) => (
            <li key={index} className="flex items-center gap-2">
              <GripVertical size={16} className="text-gray-400" />
              <input
                className="flex-1 px-2 py-1 text-sm border rounded hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={method}
                onChange={(e) => updateItem('methods', index, e.target.value)}
              />
              <button
                onClick={() => deleteItem('methods', index)}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
              >
                <X size={14} className="text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DiagramBox;