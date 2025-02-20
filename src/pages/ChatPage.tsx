
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MenuItem } from "@/types/menu";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatPage = () => {
  const { restaurantId } = useParams();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [orderItems, setOrderItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [restaurantId]);

  const fetchRestaurantDetails = async () => {
    if (!restaurantId) return;

    try {
      // Fetch menu items
      const { data: menuData, error: menuError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantId);

      if (menuError) throw menuError;
      
      // Transform the menu items to match the MenuItem type
      const transformedMenuItems: MenuItem[] = (menuData || []).map(item => ({
        id: item.id,
        name: item.name,
        image: item.image_url || "",
        halfPrice: item.half_price,
        fullPrice: item.full_price,
        outOfStock: item.out_of_stock || false,
        isVegetarian: item.is_vegetarian,
        category: item.category,
      }));
      
      setMenuItems(transformedMenuItems);

      // Fetch restaurant name
      const { data: gstData, error: gstError } = await supabase
        .from("gst_settings")
        .select("restaurant_name")
        .eq("restaurant_id", restaurantId)
        .single();

      if (gstError) throw gstError;
      if (gstData?.restaurant_name) {
        setRestaurantName(gstData.restaurant_name);
        
        // Add initial greeting
        setMessages([{
          role: "assistant",
          content: `Welcome to ${gstData.restaurant_name}! Please enter your table number to get started.`
        }]);
      }
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      toast({
        title: "Error",
        description: "Failed to load restaurant details",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    const userMessage = input.trim();
    setInput("");

    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      // Call the AI chat function
      const response = await supabase.functions.invoke("ai-chat-assistant", {
        body: {
          message: userMessage,
          tableNumber,
          restaurantName,
          menuItems,
          orderItems,
          chatHistory: messages
        }
      });

      const data = await response.data;

      if (data.tableNumber && !tableNumber) {
        setTableNumber(data.tableNumber);
      }

      if (data.orderItems) {
        setOrderItems(data.orderItems);
      }

      // Add AI response to chat
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);

      // If order is confirmed, create the order in the database
      if (data.createOrder && orderItems.length > 0) {
        await createOrder();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          restaurant_id: restaurantId,
          table_number: parseInt(tableNumber),
          status: "pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItemsData = orderItems.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: 1, // You might want to track quantity in orderItems state
        size: "full" // You might want to track size in orderItems state
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      toast({
        title: "Order placed successfully!",
        description: "Your order has been sent to the restaurant.",
      });

      // Reset order items
      setOrderItems([]);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 w-full max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h1 className="text-xl font-bold text-primary">{restaurantName}</h1>
          {tableNumber && <p className="text-sm text-gray-600">Table {tableNumber}</p>}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 h-[calc(100vh-240px)] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "assistant" ? "text-gray-800" : "text-primary"
              }`}
            >
              <div className="bg-gray-50 rounded-lg p-3">
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
