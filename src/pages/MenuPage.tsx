
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, CartItem } from "@/types/menu";
import MenuHeader from "@/components/menu/MenuHeader";
import CartPanel from "@/components/menu/CartPanel";
import MenuItemsGrid from "@/components/menu/MenuItemsGrid";
import MenuStateHandler from "@/components/menu/MenuStateHandler";

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
            isVegetarian: item.is_vegetarian,
            category: item.category,
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
  };

  const removeFromCart = (itemId: string, size: "half" | "full") => {
    const item = cart.find(
      (cartItem) => cartItem.id === itemId && cartItem.size === size
    );

    if (item && item.quantity > 1) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === itemId && cartItem.size === size
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else {
      setCart(cart.filter((item) => !(item.id === itemId && item.size === size)));
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuHeader />
      <MenuStateHandler isLoading={isLoading} itemsCount={menuItems.length} />
      {!isLoading && menuItems.length > 0 && (
        <div className="container mx-auto px-4 mb-20 md:mb-0">
          <MenuItemsGrid items={menuItems} onAddToCart={addToCart} />
        </div>
      )}
      <CartPanel
        cart={cart}
        tableNumber={tableNumber}
        onTableNumberChange={setTableNumber}
        onRemoveFromCart={removeFromCart}
        onPlaceOrder={handlePlaceOrder}
        isPlacingOrder={isPlacingOrder}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default MenuPage;
