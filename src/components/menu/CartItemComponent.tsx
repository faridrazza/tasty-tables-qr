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
    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-gray-500">({item.size})</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-white rounded-md border p-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRemoveFromCart(item.id, item.size)}
            disabled={isPlacingOrder || item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onAddToCart(item, item.size)}
            disabled={isPlacingOrder}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onRemoveFromCart(item.id, item.size)}
          disabled={isPlacingOrder}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItemComponent;