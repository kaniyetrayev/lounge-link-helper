
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  const [isOpen, setIsOpen] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Get booking details from session storage
    try {
      const storedDetails = sessionStorage.getItem("bookingDetails");
      if (storedDetails) {
        setBookingDetails(JSON.parse(storedDetails));
      } else {
        toast.error("No booking details found");
        // Close the drawer if no booking details
        handleClose();
      }
    } catch (err) {
      console.error("Failed to parse booking details:", err);
      toast.error("Failed to load booking details");
      handleClose();
    }
  }, []);
  
  const handleCheckout = async () => {
    // Process the checkout and save to Supabase
    try {
      setIsLoading(true);
      
      // Generate booking reference ID
      const bookingId = `LNG-${Math.floor(Math.random() * 10000)}`;
      
      // Prepare the booking data
      const bookingData = {
        lounge_id: bookingDetails.loungeId,
        lounge_name: bookingDetails.loungeName,
        terminal: bookingDetails.terminal,
        guests: bookingDetails.guests,
        total_price: bookingDetails.totalPrice,
        currency: bookingDetails.currency,
        // Add dummy customer data for the demo
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "+1 123-456-7890",
        booking_id: bookingId,
        status: "confirmed"
      };
      
      // Save to Supabase
      const { error } = await supabase
        .from('bookings')
        .insert(bookingData);
        
      if (error) {
        console.error("Failed to save booking:", error);
        toast.error("Failed to complete booking, please try again");
        setIsLoading(false);
        return;
      }
      
      // Store the completed booking for the confirmation page
      const completedBooking = {
        ...bookingDetails,
        bookingId,
        status: "confirmed",
        firstName: bookingData.first_name,
        lastName: bookingData.last_name,
        email: bookingData.email,
        phone: bookingData.phone
      };
      
      sessionStorage.setItem("completedBooking", JSON.stringify(completedBooking));
      
      // Close drawer first to avoid animation issues
      setIsOpen(false);
      
      // Then navigate to confirmation page after a short delay
      setTimeout(() => {
        navigate("/confirmation", { state: { fromCheckout: true, bookingId } });
      }, 300);
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Checkout failed, please try again");
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
    // Add a slight delay to allow drawer close animation
    setTimeout(onClose, 300);
  };
  
  if (!bookingDetails) {
    return null;
  }
  
  return (
    <Drawer 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
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
                {bookingDetails.formattedDate && (
                  <div className="flex justify-between text-sm">
                    <span>Date</span>
                    <span className="font-medium">{bookingDetails.formattedDate}</span>
                  </div>
                )}
                {bookingDetails.time && (
                  <div className="flex justify-between text-sm">
                    <span>Time</span>
                    <span className="font-medium">{bookingDetails.time}</span>
                  </div>
                )}
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
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Complete Booking"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={handleClose}
              disabled={isLoading}
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
