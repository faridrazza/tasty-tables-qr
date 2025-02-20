
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
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
        
        setMessages([{
          role: "assistant",
          content: `👋 Welcome to ${gstData.restaurant_name}! I'm your AI assistant.\n\nPlease provide your table number to get started.`
        }]);
      }
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      toast({
        title: "Error",
        description: "Failed to load restaurant details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    const userMessage = input.trim();
    setInput("");

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
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

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);

      if (data.createOrder && orderItems.length > 0) {
        await createOrder();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async () => {
    try {
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

      const orderItemsData = orderItems.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: 1,
        size: "full"
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      toast({
        title: "Order placed successfully!",
        description: "Your order has been sent to the restaurant.",
      });

      setOrderItems([]);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <div className="flex-1 w-full max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h1 className="text-2xl font-bold text-primary mb-1">{restaurantName}</h1>
          {tableNumber && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Table {tableNumber}
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4 h-[calc(100vh-280px)] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "assistant"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-primary text-white"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 bg-white rounded-lg shadow-md p-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading}
            size="icon"
            className="w-12 h-12 rounded-full"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
