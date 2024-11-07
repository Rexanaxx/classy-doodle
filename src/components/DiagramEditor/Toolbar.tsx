import React from 'react';
import { Square, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RelationType, relationColors } from './types';

interface ToolbarProps {
  onAddBox: () => void;
  isConnectorMode: boolean;
  onToggleConnectorMode: () => void;
  selectedRelationType: RelationType;
  onRelationTypeChange: (type: RelationType) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddBox,
  isConnectorMode,
  onToggleConnectorMode,
  selectedRelationType,
  onRelationTypeChange,
}) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-2 items-center">
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
      {isConnectorMode && (
        <Select
          value={selectedRelationType}
          onValueChange={(value) => onRelationTypeChange(value as RelationType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select relationship type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(relationColors).map(([type, color]) => (
              <SelectItem key={type} value={type} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default Toolbar;