import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart } from "lucide-react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { restaurantId } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", restaurantId);

        if (error) throw error;

        setMenuItems(
          data.map((item) => ({
            id: item.id,
            name: item.name,
            image: item.image_url,
            halfPrice: item.half_price,
            fullPrice: item.full_price,
            outOfStock: item.out_of_stock,
          }))
        );
      } catch (error: any) {
        console.error("Error fetching menu items:", error);
        toast({
          title: "Error",
          description: "Failed to load menu items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId, toast]);

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

  const handlePlaceOrder = async () => {
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

    try {
      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          restaurant_id: restaurantId,
          table_number: parseInt(tableNumber),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        size: item.size,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Order placed successfully!",
        description: `Your order will be served to table ${tableNumber}.`,
      });
      
      setCart([]);
      setTableNumber("");
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!menuItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Menu Items</h1>
          <p className="text-gray-600">This restaurant hasn't added any items yet.</p>
        </div>
      </div>
    );
  }

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