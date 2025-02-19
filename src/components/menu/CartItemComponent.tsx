
import { Button } from "@/components/ui/button";
import { X, Plus, Minus } from "lucide-react";
import { CartItem, MenuItem } from "@/types/menu";

interface CartItemComponentProps {
  item: CartItem;
  isPlacingOrder: boolean;
  onRemoveFromCart: (itemId: string, size: "half" | "full") => void;
  onAddToCart: (item: MenuItem, size: "half" | "full") => void;
}

const CartItemComponent = ({
  item,
  isPlacingOrder,
  onRemoveFromCart,
  onAddToCart,
}: CartItemComponentProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center bg-gray-50 p-2 sm:p-3 rounded-lg">
      <div className="flex flex-col">
        <span className="font-medium text-sm sm:text-base">{item.name}</span>
        <span className="text-xs sm:text-sm text-gray-500">({item.size})</span>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <div className="flex items-center gap-1 bg-white rounded-md border p-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRemoveFromCart(item.id, item.size)}
            disabled={isPlacingOrder || item.quantity <= 1}
          >
            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onAddToCart(item, item.size)}
            disabled={isPlacingOrder}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <Button
          size="sm"
          variant="destructive"
          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          onClick={() => onRemoveFromCart(item.id, item.size)}
          disabled={isPlacingOrder}
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItemComponent;
