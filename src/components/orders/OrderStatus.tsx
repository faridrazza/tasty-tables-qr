import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderStatusProps {
  status: string;
  orderId: string;
  onUpdateStatus: (orderId: string, status: string) => void;
}

export const OrderStatus = ({ status, orderId, onUpdateStatus }: OrderStatusProps) => {
  if (status !== "pending") return null;

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        className="bg-green-500 hover:bg-green-600"
        onClick={() => onUpdateStatus(orderId, "completed")}
      >
        <Check className="w-4 h-4 mr-1" />
        Complete
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onUpdateStatus(orderId, "cancelled")}
      >
        <X className="w-4 h-4 mr-1" />
        Cancel
      </Button>
    </div>
  );
};