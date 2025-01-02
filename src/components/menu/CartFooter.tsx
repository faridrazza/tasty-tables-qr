import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";

interface CartFooterProps {
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

const CartFooter = ({ onPlaceOrder, isPlacingOrder }: CartFooterProps) => {
  return (
    <div className="flex-shrink-0 pt-4 mt-auto border-t">
      <Button
        className="w-full"
        onClick={onPlaceOrder}
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
  );
};

export default CartFooter;