import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Box, Connector } from "./types";

interface JsonDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  boxes: Box[];
  connectors: Connector[];
}

const JsonDialog = ({ isOpen, onOpenChange, boxes, connectors }: JsonDialogProps) => {
  const diagramData = { boxes, connectors };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Diagram JSON</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh]">
          <pre className="p-4 bg-slate-950 rounded-md">
            <code className="text-white text-xs whitespace-pre-wrap">
              {JSON.stringify(diagramData, null, 2)}
            </code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JsonDialog;