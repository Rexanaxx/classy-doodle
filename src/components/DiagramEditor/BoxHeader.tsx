import React, { useState } from 'react';
import { X, Link2, Unlink, GripVertical } from 'lucide-react';

interface BoxHeaderProps {
  id: string;
  title: string;
  isConnectorMode: boolean;
  isPendingConnection: boolean;
  onUpdate: (id: string, data: { title?: string }) => void;
  onDelete: (id: string) => void;
  onConnectionClick: (id: string) => void;
  onResetConnections: (id: string) => void;
  dragHandleProps?: any;
}

const BoxHeader: React.FC<BoxHeaderProps> = ({
  id,
  title,
  isConnectorMode,
  isPendingConnection,
  onUpdate,
  onDelete,
  onConnectionClick,
  onResetConnections,
  dragHandleProps,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="p-3 bg-editor-box-bg border-b-2 border-editor-box-border rounded-t-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-grab hover:bg-gray-100 p-1 rounded">
            <GripVertical size={16} className="text-gray-500" />
          </div>
          {isEditing ? (
            <input
              className="w-full px-2 py-1 border rounded"
              value={title}
              onChange={(e) => onUpdate(id, { title: e.target.value })}
              onBlur={() => setIsEditing(false)}
              autoFocus
            />
          ) : (
            <h3
              className="font-semibold text-editor-box-title cursor-text"
              onClick={() => setIsEditing(true)}
            >
              {title}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isConnectorMode && (
            <>
              <button
                onClick={() => onConnectionClick(id)}
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                title={isPendingConnection ? "Complete connection" : "Start connection"}
              >
                <Link2 size={16} className={`text-blue-500 ${isPendingConnection ? "text-blue-700" : ""}`} />
              </button>
              <button
                onClick={() => onResetConnections(id)}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                title="Reset all connections"
              >
                <Unlink size={16} className="text-red-500" />
              </button>
            </>
          )}
          <button
            onClick={() => onDelete(id)}
            className="p-1 hover:bg-red-100 rounded-full transition-colors"
          >
            <X size={16} className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoxHeader;