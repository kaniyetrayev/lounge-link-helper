
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from "@/components/ui/drawer";

interface CheckoutProps {
  onClose: () => void;
}

const Checkout = ({ onClose }: CheckoutProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  useEffect(() => {
    // Get booking details from session storage
    try {
      const storedDetails = sessionStorage.getItem("bookingDetails");
      if (storedDetails) {
        setBookingDetails(JSON.parse(storedDetails));
      } else {
        toast.error("No booking details found");
        // Close the drawer if no booking details
        onClose();
      }
    } catch (err) {
      console.error("Failed to parse booking details:", err);
      toast.error("Failed to load booking details");
      onClose();
    }
    
    // Open the drawer with a slight delay for animation
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const handleCheckout = () => {
    // Process the checkout (in a real app, this would handle payment)
    try {
      // Store confirmation details for the confirmation page
      if (bookingDetails) {
        sessionStorage.setItem("confirmationDetails", JSON.stringify({
          ...bookingDetails,
          bookingId: `LNG-${Math.floor(Math.random() * 10000)}`,
          status: "confirmed"
        }));
        
        // Also store as completedBooking for the confirmation page
        sessionStorage.setItem("completedBooking", JSON.stringify({
          ...bookingDetails,
          bookingId: `LNG-${Math.floor(Math.random() * 10000)}`,
          status: "confirmed",
          firstName: "John", // Adding dummy data for the confirmation
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "+1 123-456-7890"
        }));
      }
      
      // Navigate to confirmation page
      navigate("/confirmation", { state: { fromCheckout: true } });
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Checkout failed, please try again");
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
    // Add a slight delay to allow drawer close animation
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  if (!bookingDetails) {
    return null;
  }
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) handleClose();
    }}>
      <DrawerContent>
        <div className="max-w-md mx-auto">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center justify-between">
              <span>Checkout</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Complete your booking
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 py-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg">{bookingDetails.loungeName}</h3>
                <p className="text-muted-foreground text-sm">{bookingDetails.terminal}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Date</span>
                  <span className="font-medium">{bookingDetails.formattedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time</span>
                  <span className="font-medium">{bookingDetails.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Guests</span>
                  <span className="font-medium">{bookingDetails.guests}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="font-medium">Price per guest</span>
                  <span>
                    {bookingDetails.currency} {bookingDetails.pricePerGuest}
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-lg font-semibold">
                  <span>Total</span>
                  <span>
                    {bookingDetails.currency} {bookingDetails.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <DrawerFooter className="border-t pt-4">
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCheckout}
            >
              Complete Booking
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={handleClose}
            >
              Continue Browsing
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Checkout;
