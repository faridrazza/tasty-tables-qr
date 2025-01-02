import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CartHeaderProps {
  tableNumber: string;
  onTableNumberChange: (value: string) => void;
  isPlacingOrder: boolean;
}

const CartHeader = ({
  tableNumber,
  onTableNumberChange,
  isPlacingOrder,
}: CartHeaderProps) => {
  return (
    <>
      <DialogHeader className="flex-shrink-0">
        <DialogTitle>Your Order</DialogTitle>
      </DialogHeader>
      <div className="flex-shrink-0 mb-4">
        <Input
          type="number"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => onTableNumberChange(e.target.value)}
          className="w-full"
          disabled={isPlacingOrder}
        />
      </div>
    </>
  );
};

export default CartHeader;