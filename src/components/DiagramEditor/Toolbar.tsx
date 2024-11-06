import React from 'react';
import { Square, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ToolbarProps {
  onAddBox: () => void;
  isConnectorMode: boolean;
  onToggleConnectorMode: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddBox, isConnectorMode, onToggleConnectorMode }) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onAddBox();
          toast.success('New class added');
        }}
        className="flex items-center gap-2"
      >
        <Square size={16} />
        Add Class
      </Button>
      <Button
        variant={isConnectorMode ? "default" : "outline"}
        size="sm"
        onClick={() => {
          onToggleConnectorMode();
          toast.success(isConnectorMode ? 'Connection mode disabled' : 'Connection mode enabled');
        }}
        className="flex items-center gap-2"
      >
        <ArrowRightLeft size={16} />
        {isConnectorMode ? 'Exit Connection Mode' : 'Enter Connection Mode'}
      </Button>
    </div>
  );
};

export default Toolbar;