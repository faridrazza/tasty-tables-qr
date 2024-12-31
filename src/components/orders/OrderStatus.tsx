import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderStatusProps {
  status: string;
  orderId: string;
  onUpdateStatus: (orderId: string, status: string) => void;
}

export const OrderStatus = ({ status, orderId, onUpdateStatus }: OrderStatusProps) => {
  if (status !== "pending") return null;

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });
      await onUpdateStatus(orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        className="bg-green-500 hover:bg-green-600"
        onClick={() => handleStatusUpdate("completed")}
      >
        <Check className="w-4 h-4 mr-1" />
        Complete
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleStatusUpdate("cancelled")}
      >
        <X className="w-4 h-4 mr-1" />
        Cancel
      </Button>
    </div>
  );
};