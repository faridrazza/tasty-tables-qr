import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { CartItem, MenuItem } from "@/types/menu";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useState } from "react";
import CartHeader from "./CartHeader";
import CartFooter from "./CartFooter";
import CartItemComponent from "./CartItemComponent";

interface CartPanelProps {
  cart: CartItem[];
  tableNumber: string;
  onTableNumberChange: (value: string) => void;
  onRemoveFromCart: (itemId: string, size: "half" | "full") => void;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
  onAddToCart: (item: MenuItem, size: "half" | "full") => void;
}

const CartPanel = ({
  cart,
  tableNumber,
  onTableNumberChange,
  onRemoveFromCart,
  onPlaceOrder,
  isPlacingOrder,
  onAddToCart,
}: CartPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (cart.length === 0) return null;

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const itemText = itemCount === 1 ? "Item" : "Items";

  const handlePlaceOrder = () => {
    onPlaceOrder();
    if (!isPlacingOrder) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 right-4 shadow-lg rounded-full px-6 py-6"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {itemCount} {itemText} Added
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md flex flex-col h-[90vh]">
          <CartHeader
            tableNumber={tableNumber}
            onTableNumberChange={onTableNumberChange}
            isPlacingOrder={isPlacingOrder}
          />
          
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-4 pb-4">
              {cart.map((item) => (
                <CartItemComponent
                  key={`${item.id}-${item.size}`}
                  item={item}
                  isPlacingOrder={isPlacingOrder}
                  onRemoveFromCart={onRemoveFromCart}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
          
          <CartFooter
            onPlaceOrder={handlePlaceOrder}
            isPlacingOrder={isPlacingOrder}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartPanel;