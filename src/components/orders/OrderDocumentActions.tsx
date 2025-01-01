import { Button } from "@/components/ui/button";
import { Eye, Printer, Download } from "lucide-react";

interface OrderDocumentActionsProps {
  onView?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
}

export const OrderDocumentActions = ({ onView, onPrint, onDownload }: OrderDocumentActionsProps) => {
  return (
    <div className="flex gap-2">
      {onView && (
        <Button variant="outline" size="sm" onClick={onView}>
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onPrint && (
        <Button variant="outline" size="sm" onClick={onPrint}>
          <Printer className="h-4 w-4" />
        </Button>
      )}
      {onDownload && (
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};