import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus, ShoppingCart } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  image: string;
  halfPrice: number;
  fullPrice: number;
  outOfStock: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
  size: "half" | "full";
}

const MenuPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const { toast } = useToast();

  // Mock menu items (in real app, this would come from an API)
  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Margherita Pizza",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      halfPrice: 12,
      fullPrice: 18,
      outOfStock: false,
    },
    {
      id: "2",
      name: "Garlic Bread",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      halfPrice: 5,
      fullPrice: 8,
      outOfStock: false,
    },
  ];

  const addToCart = (item: MenuItem, size: "half" | "full") => {
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id && cartItem.size === size
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id && cartItem.size === size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1, size }]);
    }

    toast({
      title: "Added to cart",
      description: `${item.name} (${size}) added to your order.`,
    });
  };

  const removeFromCart = (itemId: string, size: "half" | "full") => {
    setCart(cart.filter((item) => !(item.id === itemId && item.size === size)));
  };

  const handlePlaceOrder = () => {
    if (!tableNumber) {
      toast({
        title: "Table number required",
        description: "Please enter your table number to place the order.",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        
        title: "Empty cart",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement order placement
    toast({
      title: "Order placed successfully!",
      description: `Your order will be served to table ${tableNumber}.`,
    });
    setCart([]);
    setTableNumber("");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-primary text-white p-6 mb-6">
        <h1 className="text-2xl font-bold text-center">Restaurant Menu</h1>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Half: ${item.halfPrice}</p>
                    <p className="text-sm text-gray-600">Full: ${item.fullPrice}</p>
                  </div>
                  {item.outOfStock ? (
                    <span className="text-red-500">Out of Stock</span>
                  ) : (
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        onClick={() => addToCart(item, "half")}
                      >
                        Add Half
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => addToCart(item, "full")}
                      >
                        Add Full
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
            <div className="container mx-auto max-w-4xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Order</h3>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    placeholder="Table Number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-32"
                  />
                  <Button onClick={handlePlaceOrder}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Place Order
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
                      onClick={() => removeFromCart(item.id, item.size)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;