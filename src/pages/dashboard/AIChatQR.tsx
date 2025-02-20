
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AIChatQR = () => {
  useRequireAuth();
  const { toast } = useToast();
  const [chatUrl, setChatUrl] = useState("");
  const [restaurantName, setRestaurantName] = useState("");

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get restaurant name from GST settings
      const { data: gstData } = await supabase
        .from("gst_settings")
        .select("restaurant_name")
        .eq("restaurant_id", user.id)
        .single();

      if (gstData?.restaurant_name) {
        setRestaurantName(gstData.restaurant_name);
      }

      // Generate chat URL
      const chatUrl = `${window.location.origin}/chat/${user.id}`;
      setChatUrl(chatUrl);
    };

    fetchRestaurantDetails();
  }, []);

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "ai-chat-qr.png";
    link.href = url;
    link.click();

    toast({
      title: "QR Code downloaded successfully",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-primary mb-2">AI Chat Assistant QR Code</h1>
        <p className="text-gray-600 mb-6">
          This QR code will direct your customers to an AI-powered chat interface where they can view the menu, place orders, and get assistance.
        </p>
        
        {restaurantName && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{restaurantName}</h2>
          </div>
        )}

        <div className="flex flex-col items-center space-y-6 p-6 bg-gray-50 rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <QRCodeCanvas
              value={chatUrl}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          
          <Button onClick={handleDownload} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">How it works</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">1. Customer Interaction</h3>
            <p className="text-gray-600">Customers scan the QR code to start chatting with your AI assistant.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">2. Menu & Ordering</h3>
            <p className="text-gray-600">The AI can show your menu, take orders, and handle customer queries.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">3. Order Management</h3>
            <p className="text-gray-600">All orders placed through the chat appear in your Orders dashboard automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatQR;
