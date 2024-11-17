import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface DiagramListProps {
  onSelectDiagram: (diagramId: string) => void;
  selectedDiagramId: string | null;
}

const DiagramList: React.FC<DiagramListProps> = ({ onSelectDiagram, selectedDiagramId }) => {
  const { user } = useAuth();

  const { data: diagrams, isLoading } = useQuery({
    queryKey: ['diagrams', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('diagrams')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createNewDiagram = async () => {
    if (!user) {
      toast.error('Please sign in to create a diagram');
      return;
    }

    const { data, error } = await supabase
      .from('diagrams')
      .insert({
        user_id: user.id,
        diagram_data: { boxes: [], connectors: [] }
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create new diagram');
      return;
    }

    if (data) {
      toast.success('New diagram created');
      onSelectDiagram(data.id);
    }
  };

  if (isLoading) return <div>Loading diagrams...</div>;

  return (
    <div className="fixed left-4 top-16 w-48 bg-white rounded-lg shadow-lg p-2 space-y-2 z-50">
      <Button 
        onClick={createNewDiagram}
        className="w-full flex items-center gap-2"
        variant="outline"
      >
        <Plus size={16} />
        New Diagram
      </Button>
      <div className="space-y-1">
        {diagrams?.map((diagram) => (
          <button
            key={diagram.id}
            onClick={() => onSelectDiagram(diagram.id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedDiagramId === diagram.id
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100'
            }`}
          >
            Diagram {diagram.id.slice(0, 8)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DiagramList;