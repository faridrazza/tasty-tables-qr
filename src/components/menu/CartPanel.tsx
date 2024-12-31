import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Loader2, X, Plus, Minus } from "lucide-react";
import { CartItem } from "@/types/menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  
  if (cart.length === 0) return null;

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const itemText = itemCount === 1 ? "Item" : "Items";

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-4 shadow-lg rounded-full px-6 py-6"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {itemCount} {itemText} Added
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Table Number"
                value={tableNumber}
                onChange={(e) => onTableNumberChange(e.target.value)}
                className="w-full"
                disabled={isPlacingOrder}
              />
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-gray-500">
                      ({item.size})
                    </span>
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
                        onClick={() => {
                          const newItem = { ...item };
                          newItem.quantity = 1;
                          onAddToCart(newItem, item.size);
                        }}
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
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => {
                onPlaceOrder();
                if (!isPlacingOrder) {
                  setIsOpen(false);
                }
              }}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4 mr-2" />
              )}
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartPanel;