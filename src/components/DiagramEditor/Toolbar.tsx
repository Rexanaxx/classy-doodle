import React from 'react';
import { Square, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ToolbarProps {
  onAddBox: () => void;
  onAddConnector: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddBox, onAddConnector }) => {
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
        variant="outline"
        size="sm"
        onClick={() => {
          onAddConnector();
          toast.success('Click and drag to create a connection');
        }}
        className="flex items-center gap-2"
      >
        <ArrowRightLeft size={16} />
        Add Connector
      </Button>
    </div>
  );
};

export default Toolbar;