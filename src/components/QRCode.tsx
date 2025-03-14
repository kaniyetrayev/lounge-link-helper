
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface QRCodeProps {
  bookingId: string;
  className?: string;
}

const QRCode = ({ bookingId, className }: QRCodeProps) => {
  const [qrImageUrl, setQrImageUrl] = useState<string>("");
  
  useEffect(() => {
    // For demo purposes, we're just generating a placeholder QR code URL
    // In a real app, this would be generated on the backend
    const encodedData = encodeURIComponent(
      JSON.stringify({
        bookingId,
        timestamp: new Date().toISOString(),
      })
    );
    
    // Using QR code API to generate a real QR code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;
    setQrImageUrl(qrUrl);
  }, [bookingId]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="bg-white p-4 rounded-xl shadow-md border">
        {qrImageUrl ? (
          <img 
            src={qrImageUrl} 
            alt="Booking QR Code" 
            className="w-56 h-56"
          />
        ) : (
          <div className="w-56 h-56 bg-muted animate-pulse rounded-md" />
        )}
      </div>
      <p className="mt-4 text-sm text-center text-muted-foreground">
        Booking ID: <span className="font-mono font-medium">{bookingId}</span>
      </p>
      <p className="mt-1 text-xs text-center text-muted-foreground max-w-xs">
        Present this QR code at the lounge entrance for quick access
      </p>
    </div>
  );
};

export default QRCode;
