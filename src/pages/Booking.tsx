
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
  date: z.date(),
  time: z.string(),
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
    
    if (!data.date) {
      toast.error("Please select a date");
      return;
    }
    
    // Format date for display
    const formattedDate = data.date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
    
    // Store the booking details in session storage
    const bookingDetails = {
      loungeId: lounge.id,
      loungeName: lounge.name,
      terminal: lounge.terminal,
      guests: data.guests,
      date: data.date.toISOString(),
      formattedDate,
      time: data.time,
      pricePerGuest: lounge.price,
      totalPrice: lounge.price * data.guests,
      currency: lounge.currency,
    };
    
    console.log("Booking - Saving booking details:", bookingDetails);
    sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
    
    // Close current drawer before navigating
    setIsOpen(false);
    
    // Navigate to the checkout page with a slight delay for animation
    setTimeout(() => {
      navigate("/checkout");
    }, 300);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Add a slight delay to allow drawer close animation
    setTimeout(onClose, 300);
  };

  if (!lounge && !loading) {
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
        <div className="max-w-md mx-auto h-full flex flex-col overflow-hidden">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center justify-between">
              <span>Book Lounge Access</span>
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
              Book your lounge access
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading lounge information...</p>
              </div>
            ) : (
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Booking;
