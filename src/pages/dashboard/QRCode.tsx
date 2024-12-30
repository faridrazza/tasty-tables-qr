import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import QRCodeLib from "qrcode";

const QRCode = () => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view your QR code",
            variant: "destructive",
          });
          return;
        }

        // Generate the menu URL for this restaurant
        const menuUrl = `${window.location.origin}/menu/${user.id}`;
        
        // Generate QR code
        const qrCode = await QRCodeLib.toDataURL(menuUrl, {
          width: 400,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        setQrCodeDataUrl(qrCode);
      } catch (error) {
        console.error("Error generating QR code:", error);
        toast({
          title: "Error",
          description: "Failed to generate QR code",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateQRCode();
  }, [toast]);

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = "restaurant-menu-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "QR code downloaded successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-2xl font-bold text-primary mb-6">Menu QR Code</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
        {qrCodeDataUrl ? (
          <>
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-12 mb-4">
              <img
                src={qrCodeDataUrl}
                alt="Menu QR Code"
                className="mx-auto max-w-[300px]"
              />
            </div>
            <p className="text-gray-600 mb-4">
              Place this QR code on your restaurant tables for easy menu access
            </p>
            <Button onClick={handleDownloadQR}>Download QR Code</Button>
          </>
        ) : (
          <div className="text-gray-600">
            Please add menu items first to generate a QR code
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCode;