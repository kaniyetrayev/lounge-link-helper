
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { MapPin, X } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import { getLoungeById } from "@/lib/data";
import { api } from "@/lib/api";
import { adaptLounges } from "@/lib/apiAdapter";
import { toast } from "sonner";
import { Lounge } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  guests: z.number(),
});

type BookingFormData = z.infer<typeof formSchema>;

interface BookingProps {
  onClose: () => void;
}

const Booking = ({ onClose }: BookingProps) => {
  const { loungeId } = useParams();
  const navigate = useNavigate();
  const [lounge, setLounge] = useState<Lounge | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchLoungeDetails = async () => {
      console.log("Booking - Fetching lounge details for ID:", loungeId);
      
      if (!loungeId) {
        console.error("Booking - No loungeId provided");
        toast.error("Lounge information not found");
        handleClose();
        return;
      }

      // First try to get from local data
      const localLounge = getLoungeById(loungeId);
      
      if (localLounge) {
        console.log("Booking - Found lounge in local data:", localLounge.name);
        setLounge(localLounge);
        setLoading(false);
        return;
      }
      
      // If not in local data, check session storage
      const storedLoungeData = sessionStorage.getItem("selectedLounge");
      if (storedLoungeData) {
        try {
          const parsedLounge = JSON.parse(storedLoungeData);
          console.log("Booking - Found lounge in session storage:", parsedLounge.name);
          setLounge(parsedLounge);
          setLoading(false);
          return;
        } catch (err) {
          console.error("Booking - Error parsing stored lounge data:", err);
        }
      }
      
      // As a fallback, try to fetch from API using the ID
      try {
        console.log("Booking - Fetching lounge from API");
        const allLounges = await api.getAllLounges();
        
        // Use loungeId to find matching lounge in API response
        const foundLounge = allLounges?.find(l => l.lounge_code === loungeId);
        
        if (foundLounge) {
          console.log("Booking - Found lounge in API response");
          const adaptedLounges = adaptLounges([foundLounge]);
          if (adaptedLounges.length > 0) {
            setLounge(adaptedLounges[0]);
            setLoading(false);
            return;
          }
        }
        
        // If we reach here, no lounge was found
        console.error("Booking - Lounge not found with ID:", loungeId);
        toast.error("Lounge information not found");
        handleClose();
      } catch (err) {
        console.error("Booking - Failed to fetch lounge:", err);
        toast.error("Failed to load lounge information");
        handleClose();
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoungeDetails();
  }, [loungeId, navigate]);
  
  const handleSubmit = (data: BookingFormData) => {
    console.log("Booking - Form submitted:", data);
    
    if (!lounge) {
      toast.error("Lounge information not available");
      return;
    }
    
    // Store the booking details in state
    const details = {
      loungeId: lounge.id,
      loungeName: lounge.name,
      terminal: lounge.terminal,
      guests: data.guests,
      pricePerGuest: lounge.price,
      totalPrice: lounge.price * data.guests,
      currency: lounge.currency,
    };
    
    console.log("Booking - Saving booking details:", details);
    setBookingDetails(details);
    sessionStorage.setItem("bookingDetails", JSON.stringify(details));
    
    // Switch to checkout mode
    setCheckoutMode(true);
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      
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
        setIsProcessing(false);
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
      setIsProcessing(false);
    }
  };

  const handleContinueBrowsing = () => {
    setIsOpen(false);
    // Add a slight delay to allow drawer close animation
    setTimeout(onClose, 300);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Add a slight delay to allow drawer close animation
    setTimeout(onClose, 300);
  };

  const handleBackToBooking = () => {
    setCheckoutMode(false);
  };

  if (!lounge && !loading && !checkoutMode) {
    return null;
  }

  return (
    <Drawer 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DrawerContent className="h-[90vh] max-h-[90vh]">
        <div className="max-w-md mx-auto h-full flex flex-col overflow-hidden page-content">
          <DrawerHeader className="border-b px-0">
            <DrawerTitle className="flex items-center justify-between">
              <span>{checkoutMode ? "Checkout" : "Book Lounge Access"}</span>
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
              {checkoutMode ? "Complete your booking" : "Book your lounge access"}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto py-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading lounge information...</p>
              </div>
            ) : checkoutMode ? (
              // Checkout view
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
            ) : (
              // Booking view
              <>
                <div className="p-5 rounded-xl bg-white border shadow-sm mb-6">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h2 className="font-semibold">{lounge?.name}</h2>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1" /> 
                        <span>{lounge?.terminal}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {lounge && <BookingForm lounge={lounge} onSubmit={handleSubmit} />}
              </>
            )}
          </div>

          {checkoutMode && (
            <DrawerFooter className="border-t pt-4 px-0">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Complete Booking"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={handleBackToBooking}
                disabled={isProcessing}
              >
                Back to Details
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={handleContinueBrowsing}
                disabled={isProcessing}
              >
                Continue Browsing
              </Button>
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Booking;
