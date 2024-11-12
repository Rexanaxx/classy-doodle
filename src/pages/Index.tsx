import Editor from '@/components/DiagramEditor/Editor';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

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
      <Editor />
    </div>
  );
};

export default Index;