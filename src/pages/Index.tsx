import { useState } from 'react';
import Editor from '@/components/DiagramEditor/Editor';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import DiagramList from '@/components/DiagramEditor/DiagramList';

const Index = () => {
  const navigate = useNavigate();
  const [selectedDiagramId, setSelectedDiagramId] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="relative">
      <Button
        onClick={handleLogout}
        className="absolute top-4 right-4 z-50"
        variant="outline"
      >
        Logout
      </Button>
      <DiagramList 
        onSelectDiagram={setSelectedDiagramId}
        selectedDiagramId={selectedDiagramId}
      />
      {selectedDiagramId ? (
        <Editor diagramId={selectedDiagramId} />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-editor-bg">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Welcome to the Class Diagram Editor</h2>
            <p className="text-gray-600">Select a diagram from the list or create a new one to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;