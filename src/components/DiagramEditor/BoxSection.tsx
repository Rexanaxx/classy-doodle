import React from 'react';
import { Plus, GripVertical, X } from 'lucide-react';

interface BoxSectionProps {
  title: string;
  items: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onDelete: (index: number) => void;
}

const BoxSection: React.FC<BoxSectionProps> = ({
  title,
  items,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="border-b-2 border-editor-box-border last:border-b-0">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
        <span className="text-sm font-medium text-editor-box-text">{title}</span>
        <button
          onClick={onAdd}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <Plus size={16} className="text-editor-box-text" />
        </button>
      </div>
      <ul className="p-2 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <GripVertical size={16} className="text-gray-400" />
            <input
              className="flex-1 px-2 py-1 text-sm border rounded hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={item}
              onChange={(e) => onUpdate(index, e.target.value)}
            />
            <button
              onClick={() => onDelete(index)}
              className="p-1 hover:bg-red-100 rounded-full transition-colors"
            >
              <X size={14} className="text-red-500" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoxSection;