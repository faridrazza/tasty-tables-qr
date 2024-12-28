import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

const QRCode = () => {
  const handleDownloadQR = () => {
    // TODO: Implement QR code download
    alert("QR Code download functionality will be implemented");
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-2xl font-bold text-primary mb-6">Menu QR Code</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-12 mb-4">
          <QrCode className="w-48 h-48 mx-auto text-primary" />
        </div>
        <p className="text-gray-600 mb-4">
          Place this QR code on your restaurant tables for easy menu access
        </p>
        <Button onClick={handleDownloadQR}>Download QR Code</Button>
      </div>
    </div>
  );
};

export default QRCode;