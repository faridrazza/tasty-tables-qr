import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { MenuItem, CartItem } from "@/types/menu";
import MenuHeader from "@/components/menu/MenuHeader";
import CartPanel from "@/components/menu/CartPanel";
import MenuItemComponent from "@/components/menu/MenuItem";

const MenuPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
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

    setIsPlacingOrder(true);

    try {
      // First create the order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          restaurant_id: restaurantId,
          table_number: parseInt(tableNumber),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        throw new Error("Failed to create order");
      }

      // Then create the order items
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        size: item.size,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Order items creation error:", itemsError);
        throw new Error("Failed to create order items");
      }

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
    } finally {
      setIsPlacingOrder(false);
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
      <MenuHeader />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
      <CartPanel
        cart={cart}
        tableNumber={tableNumber}
        onTableNumberChange={setTableNumber}
        onRemoveFromCart={removeFromCart}
        onPlaceOrder={handlePlaceOrder}
        isPlacingOrder={isPlacingOrder}
      />
    </div>
  );
};

export default MenuPage;