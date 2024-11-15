import { Button } from "@/components/ui/button";
import Toolbar from "./Toolbar";
import { RelationType } from "./types";

interface EditorToolbarProps {
  onSave: () => void;
  onAddBox: (isInterface: boolean) => void;
  isConnectorMode: boolean;
  onToggleConnectorMode: () => void;
  selectedRelationType: RelationType;
  onRelationTypeChange: (type: RelationType) => void;
}

const EditorToolbar = ({
  onSave,
  onAddBox,
  isConnectorMode,
  onToggleConnectorMode,
  selectedRelationType,
  onRelationTypeChange,
}: EditorToolbarProps) => {
  return (
    <>
      <div className="fixed top-4 right-24 z-50">
        <Button onClick={onSave} className="mr-2" variant="default">
          Save Diagram
        </Button>
      </div>
      <Toolbar
        onAddBox={() => onAddBox(false)}
        onAddInterface={() => onAddBox(true)}
        isConnectorMode={isConnectorMode}
        onToggleConnectorMode={onToggleConnectorMode}
        selectedRelationType={selectedRelationType}
        onRelationTypeChange={onRelationTypeChange}
      />
    </>
  );
};

export default EditorToolbar;