import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Type, Code } from 'lucide-react';

interface EditorButtonsProps {
  onExport: () => void;
  onAddTextField: () => void;
  onShowJson: () => void;
}

const EditorButtons: React.FC<EditorButtonsProps> = ({
  onExport,
  onAddTextField,
  onShowJson,
}) => {
  return (
    <>
      <Button
        onClick={onExport}
        className="fixed top-4 left-4 z-50"
        variant="outline"
        size="sm"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>

      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <Button
          onClick={onAddTextField}
          variant="outline"
          size="sm"
        >
          <Type className="w-4 h-4 mr-2" />
          Add Text
        </Button>
        <Button
          onClick={onShowJson}
          variant="outline"
          size="sm"
        >
          <Code className="w-4 h-4 mr-2" />
          Show JSON
        </Button>
      </div>
    </>
  );
};

export default EditorButtons;