import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Loader2 } from "lucide-react";
import { CartItem } from "@/types/menu";

interface CartPanelProps {
  cart: CartItem[];
  tableNumber: string;
  onTableNumberChange: (value: string) => void;
  onRemoveFromCart: (itemId: string, size: "half" | "full") => void;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

const CartPanel = ({
  cart,
  tableNumber,
  onTableNumberChange,
  onRemoveFromCart,
  onPlaceOrder,
  isPlacingOrder,
}: CartPanelProps) => {
  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Order</h3>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => onTableNumberChange(e.target.value)}
              className="w-32"
              disabled={isPlacingOrder}
            />
            <Button onClick={onPlaceOrder} disabled={isPlacingOrder}>
              {isPlacingOrder ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4 mr-2" />
              )}
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex justify-between items-center"
            >
              <span>
                {item.quantity}x {item.name} ({item.size})
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemoveFromCart(item.id, item.size)}
                disabled={isPlacingOrder}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPanel;